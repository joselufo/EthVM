package io.enkrypt.kafka.connect.sinks.mongo

import com.mongodb.MongoClient
import com.mongodb.client.MongoCollection
import com.mongodb.client.MongoDatabase
import com.mongodb.client.model.DeleteManyModel
import com.mongodb.client.model.DeleteOneModel
import com.mongodb.client.model.ReplaceOneModel
import com.mongodb.client.model.ReplaceOptions
import com.mongodb.client.model.UpdateOneModel
import com.mongodb.client.model.UpdateOptions
import com.mongodb.client.model.WriteModel
import io.enkrypt.common.extensions.hex
import io.enkrypt.common.extensions.unsignedBigInteger
import io.enkrypt.kafka.connect.sinks.mongo.MongoCollections.*
import io.enkrypt.kafka.connect.utils.Versions
import mu.KotlinLogging
import org.apache.kafka.clients.consumer.OffsetAndMetadata
import org.apache.kafka.common.TopicPartition
import org.apache.kafka.connect.data.Schema
import org.apache.kafka.connect.data.Struct
import org.apache.kafka.connect.sink.SinkRecord
import org.apache.kafka.connect.sink.SinkTask
import org.bson.BsonArray
import org.bson.BsonDecimal128
import org.bson.BsonDocument
import org.bson.BsonString
import org.bson.Document
import org.bson.types.Decimal128
import kotlin.system.measureTimeMillis

class MongoSinkTask : SinkTask() {

  private val logger = KotlinLogging.logger {}

  private var client: MongoClient? = null
  private lateinit var db: MongoDatabase
  private lateinit var collections: Map<MongoCollections, MongoCollection<BsonDocument>>

  override fun version() = Versions.CURRENT

  override fun start(props: MutableMap<String, String>) {

    val uri = MongoSinkConnector.Config.mongoUri(props)
    val databaseName = uri.database ?: throw IllegalArgumentException("Mongo URI does not contain a database name!")
    client = MongoClient(uri)
    db = client!!.getDatabase(databaseName)

    val clazz = BsonDocument::class.java
    collections = mapOf<MongoCollections, MongoCollection<BsonDocument>>(
      Blocks to db.getCollection(Blocks.id, clazz),
      Accounts to db.getCollection(Accounts.id, clazz),
      Transactions to db.getCollection(Transactions.id, clazz),
      Contracts to db.getCollection(Contracts.id, clazz),
      Balances to db.getCollection(Balances.id, clazz),
      PendingTransactions to db.getCollection(PendingTransactions.id, clazz),
      BlockStatistics to db.getCollection(BlockStatistics.id, clazz)
    )
  }

  override fun stop() {
    client?.close()
  }

  override fun put(records: MutableCollection<SinkRecord>) {

    // TODO use mongo transactions

    logger.info { "Processing ${records.size} records" }

    val elapsedMs = measureTimeMillis {
      var batch = mapOf<MongoCollections, List<WriteModel<BsonDocument>>>()

      records.forEach { r -> batch += KafkaTopics.forTopic(r.topic())(r) }

      batch
        .filterValues { it.isNotEmpty() }
        .forEach { (collectionId, writes) ->

          val collection = collections[collectionId]!!
          val bulkWrite = collection.bulkWrite(writes)

          logger.debug {
            "Bulk write complete. Collection = $collectionId, inserts = ${bulkWrite.insertedCount}, " +
              "updates = ${bulkWrite.modifiedCount}, upserts = ${bulkWrite.upserts.size}, " +
              "deletes = ${bulkWrite.deletedCount}"
          }
        }
    }

    logger.info { "Batch processing completed in $elapsedMs ms" }
  }

  override fun flush(currentOffsets: MutableMap<TopicPartition, OffsetAndMetadata>?) {
  }

  companion object {

    val updateOptions: UpdateOptions = UpdateOptions().upsert(true)
    val replaceOptions: ReplaceOptions = ReplaceOptions().upsert(true)
  }
}

enum class MongoCollections(val id: String) {
  Blocks("blocks"),
  BlockStatistics("block_statistics"),
  Accounts("accounts"),
  Transactions("transactions"),
  Contracts("contracts"),
  Balances("balances"),
  PendingTransactions("pending_transactions")
}

typealias SinkRecordToBsonFn = (record: SinkRecord) -> Map<MongoCollections, List<WriteModel<BsonDocument>>>

enum class KafkaTopics(
  private val id: String,
  private val convertFn: SinkRecordToBsonFn
) {

  Blocks("blocks", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    var blockWrites = listOf<WriteModel<BsonDocument>>()
    var txWrites = listOf<WriteModel<BsonDocument>>()

    val blockNumber = (record.key() as Struct).getBytes("number").unsignedBigInteger()
    val blockNumberBson = BsonDecimal128(Decimal128(blockNumber.toBigDecimal()))

    val blockFilter = BsonDocument().apply { append("_id", blockNumberBson) }

    if (record.value() == null) {

      // tombstone received so we need to delete
      blockWrites += DeleteOneModel(blockFilter)

      // delete transactions as-well
      val txsFilter = BsonDocument().apply { append("blockNumber", blockNumberBson) }
      txWrites += DeleteManyModel(txsFilter)

    } else {

      require(record.valueSchema().type() == Schema.Type.STRUCT) { "Value schema must be a struct" }

      val valueBson = StructToBsonConverter.convert(record.value() as Struct, "block")

      val txs = valueBson.getArray("transactions", BsonArray())
      val txReceipts = valueBson.getArray("transactionReceipts", BsonArray())

      valueBson.remove("transactionReceipts")   // we are going to embed them inside their respective transactions

      blockWrites += ReplaceOneModel(blockFilter, valueBson, MongoSinkTask.replaceOptions)

      txWrites += txs.zip(txReceipts)
        .map { (tx, receipt) -> Pair(tx as BsonDocument, receipt as BsonDocument) }
        .map { (tx, receipt) ->

          val txHash = tx.getString("hash")

          // drop and replace

          val update = UpdateOneModel<BsonDocument>(
            Document(mapOf(
              "from" to tx.getString("from"),
              "nonce" to tx.getDecimal128("nonce"))
            ),
            Document(mapOf(
              "\$set" to mapOf("replacedBy" to txHash),
              "\$unset" to mapOf("blockNumber" to 1)
            ))
          )

          val doc = tx
            .append("blockNumber", blockNumberBson)
            .append("receipt", receipt)

          val replace = ReplaceOneModel(org.bson.BsonDocument("_id", txHash), doc, MongoSinkTask.replaceOptions)

          listOf(update, replace)
        }.flatten()
    }

    mapOf(MongoCollections.Blocks to blockWrites, MongoCollections.Transactions to txWrites)
  }),

  ContractCreations("contract-creations", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    var writes = listOf<WriteModel<BsonDocument>>()

    val address = (record.key() as Struct).getBytes("address")
    val addressBson = BsonString(address.hex())

    val idFilter = BsonDocument().apply { append("_id", addressBson) }

    if (record.value() == null) {

      // TODO determine how to handle tombstones in light of merging with data from ethlists
    } else {

      require(record.valueSchema().type() == Schema.Type.STRUCT) { "Value schema must be a struct" }

      val struct = record.value() as Struct
      val bson = BsonDocument().apply {
        append("\$set", StructToBsonConverter.convert(struct, "contract"))
      }

      writes += UpdateOneModel(idFilter, bson, MongoSinkTask.updateOptions)
    }

    mapOf(MongoCollections.Contracts to writes)
  }),

  ContractDestructions("contract-destructions", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    var writes = listOf<WriteModel<BsonDocument>>()

    val address = (record.key() as Struct).getBytes("address")
    val addressBson = BsonString(address.hex())

    val idFilter = BsonDocument().apply { append("_id", addressBson) }

    if (record.value() == null) {

      // tombstone received so we need unset the suicide in the contract object
      writes += UpdateOneModel(idFilter, Document(mapOf("\$unset" to "destructed")))
    } else {

      require(record.valueSchema().type() == Schema.Type.STRUCT) { "Value schema must be a struct" }

      val struct = record.value() as Struct

      val bson = BsonDocument().apply {
        append("\$set", BsonDocument().apply { append("destructed", StructToBsonConverter.convert(struct, "contract")) })
      }

      writes += UpdateOneModel(idFilter, bson)
    }

    mapOf(MongoCollections.Contracts to writes)
  }),

  ContractMetadata("contract-metadata", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    var writes = listOf<WriteModel<BsonDocument>>()

    val address = (record.key() as Struct).getBytes("address")
    val addressBson = BsonString(address.hex())

    val idFilter = BsonDocument().apply { append("_id", addressBson) }

    if (record.value() == null) {

      // tombstone received so we need to delete
      writes += UpdateOneModel(idFilter, Document(mapOf("\$unset" to "metadata")))
    } else {

      require(record.valueSchema().type() == Schema.Type.STRUCT) { "Value schema must be a struct" }

      val struct = record.value() as Struct
      val bson = BsonDocument().apply {
        append("\$set", BsonDocument().apply { append("metadata", StructToBsonConverter.convert(struct, "contract")) })
      }

      writes += UpdateOneModel(idFilter, bson, MongoSinkTask.updateOptions)
    }

    mapOf(MongoCollections.Contracts to writes)
  }),

  Balances("balances", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    var writes = listOf<WriteModel<BsonDocument>>()

    val idBson = StructToBsonConverter.convert(record.key() as Struct, "balanceId")
    val idFilter = BsonDocument().apply { append("_id", idBson) }

    if (record.value() == null) {

      // tombstone received so we need to delete
      writes += DeleteOneModel(idFilter)
    } else {

      require(record.valueSchema().type() == Schema.Type.STRUCT) { "Value schema must be a struct" }

      val struct = record.value() as Struct

      var bson = StructToBsonConverter.convert(struct, "balance")

      // combine with id fields so we can query on them later
      idBson.forEach { k, v -> bson = bson.append(k, v) }

      writes += ReplaceOneModel(idFilter, bson, MongoSinkTask.replaceOptions)
    }

    mapOf(MongoCollections.Balances to writes)
  }),

  PendingTransactions("pending-transactions", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    var writes = listOf<WriteModel<BsonDocument>>()

    val idBson = StructToBsonConverter.convert(record.key() as Struct, "transactionId")
    val idFilter = BsonDocument().apply { append("_id", idBson) }

    if (record.value() == null) {

      // tombstone received so we need to delete
      writes += DeleteOneModel(idFilter)
    } else {

      require(record.valueSchema().type() == Schema.Type.STRUCT) { "Value schema must be a struct" }

      val struct = record.value() as Struct
      var bson = StructToBsonConverter.convert(struct, "transaction")

      // combine with id fields so we can query on them later
      idBson.forEach { k, v -> bson = bson.append(k, v) }

      writes += ReplaceOneModel(idFilter, bson, MongoSinkTask.replaceOptions)
    }

    mapOf(MongoCollections.PendingTransactions to writes)
  }),

  BlockStatistics("block-statistics", { record: SinkRecord ->

    require(record.keySchema().type() == Schema.Type.STRUCT) { "Key schema must be a struct" }

    var writes = listOf<WriteModel<BsonDocument>>()

    val idBson = StructToBsonConverter.convert(record.key() as Struct, "metricId")
    val idFilter = BsonDocument().apply { append("_id", idBson) }

    if (record.value() == null) {

      // tombstone received so we need to delete
      writes += DeleteOneModel(idFilter)
    } else {

      require(record.valueSchema().type() == Schema.Type.STRUCT) { "Value schema must be a struct" }

      val struct = record.value() as org.apache.kafka.connect.data.Struct
      var bson = StructToBsonConverter.convert(struct, "metric", false)

      // combine with id fields so we can query on them later
      idBson.forEach { k, v -> bson = bson.append(k, v) }

      writes += ReplaceOneModel(idFilter, bson, MongoSinkTask.replaceOptions)
    }

    mapOf(MongoCollections.BlockStatistics to writes)
  });

  companion object {

    fun forTopic(topic: String): SinkRecordToBsonFn =
      values().find { it.id == topic }?.convertFn ?: throw IllegalStateException("Unhandled topic: $topic")
  }
}
