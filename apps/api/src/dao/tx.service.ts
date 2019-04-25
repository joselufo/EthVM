import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindManyOptions, In, LessThanOrEqual, Repository } from 'typeorm'
import { TransactionTraceEntity } from '@app/orm/entities/transaction-trace.entity'
import { TransactionEntity } from '@app/orm/entities/transaction.entity'
import { TransactionReceiptEntity } from '@app/orm/entities/transaction-receipt.entity'

@Injectable()
export class TxService {
  constructor(
    @InjectRepository(TransactionEntity) private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(TransactionTraceEntity) private readonly transactionTraceRepository: Repository<TransactionTraceEntity>,
    @InjectRepository(TransactionReceiptEntity) private readonly transactionReceiptRepository: Repository<TransactionReceiptEntity>,
  ) {}

  async findTx(hash: string): Promise<TransactionEntity | undefined> {
    return this.transactionRepository.findOne({ where: { hash }, relations: ['receipt'] })
  }

  async findTxs(take: number = 10, page: number = 0, fromBlock: number = -1): Promise<TransactionEntity[]> {
    const skip = page * take
    const where = fromBlock !== -1 ? { blockNumber: LessThanOrEqual(fromBlock) } : {}
    const findOptions: FindManyOptions = {
      where,
      order: { blockNumber: 'DESC', transactionIndex: 'DESC', timestamp: 'DESC' },
      take,
      skip,
    }
    let txs = await this.transactionRepository.find(findOptions)
    if (!txs.length) return []

    txs = await this.findAndMapReceipts(txs)
    return this.findAndMapTraces(txs)
  }

  async findTxsForAddress(hash: string, filter?: string, take: number = 10, page: number = 0): Promise<TransactionEntity[]> {
    const skip = page * take
    let where
    switch (filter) {
      case 'in':
        where = { to: hash }
        break
      case 'out':
        where = { from: hash }
        break
      default:
        where = [{ from: hash }, { to: hash }]
        break
    }
    const txs = await this.transactionRepository.find({ where, take, skip, relations: ['receipt'] })
    if (!txs.length) return []
    return this.findAndMapTraces(txs)
  }

  private async findAndMapTraces(txs: TransactionEntity[]): Promise<TransactionEntity[]> {

    const traces = await this.transactionTraceRepository.find({ where: { transactionHash: In(txs.map(tx => tx.hash)) }})

    const txsByHash = txs.reduce((memo, next) => {
      next.traces = []
      memo[next.hash] = next
      return memo
    }, {})

    traces.forEach(trace => {
      txsByHash[trace.transactionHash].traces.push(trace)
    })

    return Object.values(txsByHash)

  }

  private async findAndMapReceipts(txs: TransactionEntity[]): Promise<TransactionEntity[]> {

    const receipts = await this.transactionReceiptRepository.find({ where: { transactionHash: In(txs.map(tx => tx.hash)) }})

    const txsByHash = txs.reduce((memo, next) => {
      next.traces = []
      memo[next.hash] = next
      return memo
    }, {})

    receipts.forEach(receipt => {
      txsByHash[receipt.transactionHash].receipt = receipt
    })

    return Object.values(txsByHash)

  }

  async countTransactions(): Promise<number> {
    return this.transactionRepository.count()
  }
}
