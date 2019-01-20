package io.enkrypt.common.config

import io.enkrypt.avro.capture.BlockRecord
import io.enkrypt.avro.common.Data20
import io.enkrypt.avro.processing.ChainEventRecord
import io.enkrypt.avro.processing.ChainEventType
import io.enkrypt.avro.processing.DaoHfBalanceTransferRecord
import io.enkrypt.common.extensions.ether
import io.enkrypt.common.extensions.hexData20
import io.enkrypt.common.extensions.unsignedBigInteger

interface ChainConfig {

  val constants: ChainConstants

  fun hardForkEvents(block: BlockRecord): List<ChainEventRecord> = emptyList()

  /**
   * EIP161: https://github.com/ethereum/EIPs/issues/161
   */
  fun eip161(): Boolean = false

  /**
   * EIP155: https://github.com/ethereum/EIPs/issues/155
   */
  fun chainId(): Int? = null

  /**
   * EIP198: https://github.com/ethereum/EIPs/issues/198
   */
  fun eip198(): Boolean = false

  /**
   * EIP206: https://github.com/ethereum/EIPs/issues/206
   */
  fun eip206(): Boolean = false

  /**
   * EIP211: https://github.com/ethereum/EIPs/issues/211
   */
  fun eip211(): Boolean = false

  /**
   * EIP212: https://github.com/ethereum/EIPs/issues/212
   */
  fun eip212(): Boolean = false

  /**
   * EIP213: https://github.com/ethereum/EIPs/issues/213
   */
  fun eip213(): Boolean = false

  /**
   * EIP214: https://github.com/ethereum/EIPs/issues/214
   */
  fun eip214(): Boolean = false

  /**
   * EIP658: https://github.com/ethereum/EIPs/issues/658
   */
  fun eip658(): Boolean = false

  /**
   * EIP1052: https://github.com/ethereum/EIPs/issues/1052
   */
  fun eip1052(): Boolean = false

  /**
   * EIP145: https://github.com/ethereum/EIPs/issues/145
   */
  fun eip145(): Boolean = false

  /**
   * EIP1283: https://github.com/ethereum/EIPs/issues/1283
   */
  fun eip1283(): Boolean = false

  /**
   * EIP1014: https://github.com/ethereum/EIPs/issues/1014
   */
  fun eip1014(): Boolean = false

}

open class OlympicConfig(override val constants: ChainConstants = ChainConstants.olympic) : ChainConfig

open class FrontierConfig(override val constants: ChainConstants = ChainConstants.frontier) : OlympicConfig(constants)

open class HomesteadConfig(override val constants: ChainConstants = ChainConstants.homestead) : FrontierConfig(constants)

open class DaoHardForkConfig(override val constants: ChainConstants = ChainConstants.daoHardFork) : HomesteadConfig(constants) {

  private val forkBlockNumber = 1_920_000.toBigInteger()

  private val withdrawAccount = "bf4ed7b27f1d666546e30d74d50d173d20bca754".hexData20()

  private val daoAccounts = listOf(
      "d4fe7bc31cedb7bfb8a345f31e668033056b2728".hexData20(),
      "b3fb0e5aba0e20e5c49d252dfd30e102b171a425".hexData20(),
      "2c19c7f9ae8b751e37aeb2d93a699722395ae18f".hexData20(),
      "ecd135fa4f61a655311e86238c92adcd779555d2".hexData20(),
      "1975bd06d486162d5dc297798dfc41edd5d160a7".hexData20(),
      "a3acf3a1e16b1d7c315e23510fdd7847b48234f6".hexData20(),
      "319f70bab6845585f412ec7724b744fec6095c85".hexData20(),
      "06706dd3f2c9abf0a21ddcc6941d9b86f0596936".hexData20(),
      "5c8536898fbb74fc7445814902fd08422eac56d0".hexData20(),
      "6966ab0d485353095148a2155858910e0965b6f9".hexData20(),
      "779543a0491a837ca36ce8c635d6154e3c4911a6".hexData20(),
      "2a5ed960395e2a49b1c758cef4aa15213cfd874c".hexData20(),
      "5c6e67ccd5849c0d29219c4f95f1a7a93b3f5dc5".hexData20(),
      "9c50426be05db97f5d64fc54bf89eff947f0a321".hexData20(),
      "200450f06520bdd6c527622a273333384d870efb".hexData20(),
      "be8539bfe837b67d1282b2b1d61c3f723966f049".hexData20(),
      "6b0c4d41ba9ab8d8cfb5d379c69a612f2ced8ecb".hexData20(),
      "f1385fb24aad0cd7432824085e42aff90886fef5".hexData20(),
      "d1ac8b1ef1b69ff51d1d401a476e7e612414f091".hexData20(),
      "8163e7fb499e90f8544ea62bbf80d21cd26d9efd".hexData20(),
      "51e0ddd9998364a2eb38588679f0d2c42653e4a6".hexData20(),
      "627a0a960c079c21c34f7612d5d230e01b4ad4c7".hexData20(),
      "f0b1aa0eb660754448a7937c022e30aa692fe0c5".hexData20(),
      "24c4d950dfd4dd1902bbed3508144a54542bba94".hexData20(),
      "9f27daea7aca0aa0446220b98d028715e3bc803d".hexData20(),
      "a5dc5acd6a7968a4554d89d65e59b7fd3bff0f90".hexData20(),
      "d9aef3a1e38a39c16b31d1ace71bca8ef58d315b".hexData20(),
      "63ed5a272de2f6d968408b4acb9024f4cc208ebf".hexData20(),
      "6f6704e5a10332af6672e50b3d9754dc460dfa4d".hexData20(),
      "77ca7b50b6cd7e2f3fa008e24ab793fd56cb15f6".hexData20(),
      "492ea3bb0f3315521c31f273e565b868fc090f17".hexData20(),
      "0ff30d6de14a8224aa97b78aea5388d1c51c1f00".hexData20(),
      "9ea779f907f0b315b364b0cfc39a0fde5b02a416".hexData20(),
      "ceaeb481747ca6c540a000c1f3641f8cef161fa7".hexData20(),
      "cc34673c6c40e791051898567a1222daf90be287".hexData20(),
      "579a80d909f346fbfb1189493f521d7f48d52238".hexData20(),
      "e308bd1ac5fda103967359b2712dd89deffb7973".hexData20(),
      "4cb31628079fb14e4bc3cd5e30c2f7489b00960c".hexData20(),
      "ac1ecab32727358dba8962a0f3b261731aad9723".hexData20(),
      "4fd6ace747f06ece9c49699c7cabc62d02211f75".hexData20(),
      "440c59b325d2997a134c2c7c60a8c61611212bad".hexData20(),
      "4486a3d68fac6967006d7a517b889fd3f98c102b".hexData20(),
      "9c15b54878ba618f494b38f0ae7443db6af648ba".hexData20(),
      "27b137a85656544b1ccb5a0f2e561a5703c6a68f".hexData20(),
      "21c7fdb9ed8d291d79ffd82eb2c4356ec0d81241".hexData20(),
      "23b75c2f6791eef49c69684db4c6c1f93bf49a50".hexData20(),
      "1ca6abd14d30affe533b24d7a21bff4c2d5e1f3b".hexData20(),
      "b9637156d330c0d605a791f1c31ba5890582fe1c".hexData20(),
      "6131c42fa982e56929107413a9d526fd99405560".hexData20(),
      "1591fc0f688c81fbeb17f5426a162a7024d430c2".hexData20(),
      "542a9515200d14b68e934e9830d91645a980dd7a".hexData20(),
      "c4bbd073882dd2add2424cf47d35213405b01324".hexData20(),
      "782495b7b3355efb2833d56ecb34dc22ad7dfcc4".hexData20(),
      "58b95c9a9d5d26825e70a82b6adb139d3fd829eb".hexData20(),
      "3ba4d81db016dc2890c81f3acec2454bff5aada5".hexData20(),
      "b52042c8ca3f8aa246fa79c3feaa3d959347c0ab".hexData20(),
      "e4ae1efdfc53b73893af49113d8694a057b9c0d1".hexData20(),
      "3c02a7bc0391e86d91b7d144e61c2c01a25a79c5".hexData20(),
      "0737a6b837f97f46ebade41b9bc3e1c509c85c53".hexData20(),
      "97f43a37f595ab5dd318fb46e7a155eae057317a".hexData20(),
      "52c5317c848ba20c7504cb2c8052abd1fde29d03".hexData20(),
      "4863226780fe7c0356454236d3b1c8792785748d".hexData20(),
      "5d2b2e6fcbe3b11d26b525e085ff818dae332479".hexData20(),
      "5f9f3392e9f62f63b8eac0beb55541fc8627f42c".hexData20(),
      "057b56736d32b86616a10f619859c6cd6f59092a".hexData20(),
      "9aa008f65de0b923a2a4f02012ad034a5e2e2192".hexData20(),
      "304a554a310c7e546dfe434669c62820b7d83490".hexData20(),
      "914d1b8b43e92723e64fd0a06f5bdb8dd9b10c79".hexData20(),
      "4deb0033bb26bc534b197e61d19e0733e5679784".hexData20(),
      "07f5c1e1bc2c93e0402f23341973a0e043f7bf8a".hexData20(),
      "35a051a0010aba705c9008d7a7eff6fb88f6ea7b".hexData20(),
      "4fa802324e929786dbda3b8820dc7834e9134a2a".hexData20(),
      "9da397b9e80755301a3b32173283a91c0ef6c87e".hexData20(),
      "8d9edb3054ce5c5774a420ac37ebae0ac02343c6".hexData20(),
      "0101f3be8ebb4bbd39a2e3b9a3639d4259832fd9".hexData20(),
      "5dc28b15dffed94048d73806ce4b7a4612a1d48f".hexData20(),
      "bcf899e6c7d9d5a215ab1e3444c86806fa854c76".hexData20(),
      "12e626b0eebfe86a56d633b9864e389b45dcb260".hexData20(),
      "a2f1ccba9395d7fcb155bba8bc92db9bafaeade7".hexData20(),
      "ec8e57756626fdc07c63ad2eafbd28d08e7b0ca5".hexData20(),
      "d164b088bd9108b60d0ca3751da4bceb207b0782".hexData20(),
      "6231b6d0d5e77fe001c2a460bd9584fee60d409b".hexData20(),
      "1cba23d343a983e9b5cfd19496b9a9701ada385f".hexData20(),
      "a82f360a8d3455c5c41366975bde739c37bfeb8a".hexData20(),
      "9fcd2deaff372a39cc679d5c5e4de7bafb0b1339".hexData20(),
      "005f5cee7a43331d5a3d3eec71305925a62f34b6".hexData20(),
      "0e0da70933f4c7849fc0d203f5d1d43b9ae4532d".hexData20(),
      "d131637d5275fd1a68a3200f4ad25c71a2a9522e".hexData20(),
      "bc07118b9ac290e4622f5e77a0853539789effbe".hexData20(),
      "47e7aa56d6bdf3f36be34619660de61275420af8".hexData20(),
      "acd87e28b0c9d1254e868b81cba4cc20d9a32225".hexData20(),
      "adf80daec7ba8dcf15392f1ac611fff65d94f880".hexData20(),
      "5524c55fb03cf21f549444ccbecb664d0acad706".hexData20(),
      "40b803a9abce16f50f36a77ba41180eb90023925".hexData20(),
      "fe24cdd8648121a43a7c86d289be4dd2951ed49f".hexData20(),
      "17802f43a0137c506ba92291391a8a8f207f487d".hexData20(),
      "253488078a4edf4d6f42f113d1e62836a942cf1a".hexData20(),
      "86af3e9626fce1957c82e88cbf04ddf3a2ed7915".hexData20(),
      "b136707642a4ea12fb4bae820f03d2562ebff487".hexData20(),
      "dbe9b615a3ae8709af8b93336ce9b477e4ac0940".hexData20(),
      "f14c14075d6c4ed84b86798af0956deef67365b5".hexData20(),
      "ca544e5c4687d109611d0f8f928b53a25af72448".hexData20(),
      "aeeb8ff27288bdabc0fa5ebb731b6f409507516c".hexData20(),
      "cbb9d3703e651b0d496cdefb8b92c25aeb2171f7".hexData20(),
      "6d87578288b6cb5549d5076a207456a1f6a63dc0".hexData20(),
      "b2c6f0dfbb716ac562e2d85d6cb2f8d5ee87603e".hexData20(),
      "accc230e8a6e5be9160b8cdf2864dd2a001c28b6".hexData20(),
      "2b3455ec7fedf16e646268bf88846bd7a2319bb2".hexData20(),
      "4613f3bca5c44ea06337a9e439fbc6d42e501d0a".hexData20(),
      "d343b217de44030afaa275f54d31a9317c7f441e".hexData20(),
      "84ef4b2357079cd7a7c69fd7a37cd0609a679106".hexData20(),
      "da2fef9e4a3230988ff17df2165440f37e8b1708".hexData20(),
      "f4c64518ea10f995918a454158c6b61407ea345c".hexData20(),
      "7602b46df5390e432ef1c307d4f2c9ff6d65cc97".hexData20(),
      "bb9bc244d798123fde783fcc1c72d3bb8c189413".hexData20(),
      "807640a13483f8ac783c557fcdf27be11ea4ac7a".hexData20()
  )

  override fun hardForkEvents(block: BlockRecord): List<ChainEventRecord> =
    if(block.getHeader().getNumber().unsignedBigInteger() != forkBlockNumber) {
      emptyList()
    } else {
      daoAccounts.map{ daoHfBalanceTransfer(it, withdrawAccount, block.getReverse()) }
    }

  private fun daoHfBalanceTransfer(from: Data20, to: Data20, reverse: Boolean) =
    ChainEventRecord.newBuilder()
      .setReverse(reverse)
      .setType(ChainEventType.DAO_HF_BALANCE_TRANSFER)
      .setValue(
        DaoHfBalanceTransferRecord.newBuilder()
          .setFrom(from)
          .setTo(to)
          .build()
      ).build()
}

open class Eip150HardForkConfig(private val parent: ChainConfig) : DaoHardForkConfig() {
  override val constants = parent.constants
  override fun eip161(): Boolean = parent.eip161()
  override fun eip198(): Boolean = parent.eip161()
  override fun eip212(): Boolean = parent.eip161()
  override fun eip213(): Boolean = parent.eip161()
}

open class Eip160HardForkConfig(parent: ChainConfig): Eip150HardForkConfig(parent) {
  override fun eip161() = true
  override fun chainId(): Int = ChainId.MainNet.number
}

open class RopstenConfig(parent: ChainConfig): Eip160HardForkConfig(parent) {
  override fun chainId(): Int = ChainId.Ropsten.number
}

open class ByzantiumConfig(parent: ChainConfig): Eip160HardForkConfig(parent) {

  override val constants = parent.constants.copy(
    blockReward = 3.ether()
  )

  override fun eip198(): Boolean = true
  override fun eip206(): Boolean = true
  override fun eip211(): Boolean = true
  override fun eip212(): Boolean = true
  override fun eip213(): Boolean = true
  override fun eip214(): Boolean = true
  override fun eip658(): Boolean = true

}

open class ConstantinopleConfig(parent: ChainConfig) : ByzantiumConfig(parent) {

  override val constants = parent.constants.copy(
    blockReward = 2.ether()
  )

  override fun eip1052() = true
  override fun eip145() = true
  override fun eip1283() = true
  override fun eip1014() = true

}

interface NetConfig {

  fun chainConfigForBlock(block: BlockRecord): ChainConfig

  companion object {

    val mainnet = BaseNetConfig(
      listOf(
        0L to FrontierConfig(),
        1_150_000L to HomesteadConfig(),
        1_920_000L to DaoHardForkConfig(),
        2_463_000L to Eip150HardForkConfig(DaoHardForkConfig()),
        2_675_000L to Eip160HardForkConfig(DaoHardForkConfig()),
        4_370_000L to ByzantiumConfig(DaoHardForkConfig()),
        7_080_000L to ConstantinopleConfig(DaoHardForkConfig())
      )
    )

    val ropsten = BaseNetConfig(
      listOf(
        0L to HomesteadConfig(),
        10L to RopstenConfig(HomesteadConfig()),
        1_700_000L to RopstenConfig(ByzantiumConfig(DaoHardForkConfig())),
        4_230_000L to RopstenConfig(ConstantinopleConfig(DaoHardForkConfig()))
      )
    )

    val testnet = BaseNetConfig(
      listOf(
        0L to FrontierConfig(),
        1_500_000L to HomesteadConfig()
      )
    )

    // TODO add support for other networks

  }
}

class BaseNetConfig(configs: List<Pair<Long, ChainConfig>>) : NetConfig {

  private val blockNumbers = configs.map { it.first.toBigInteger() }
  private val chainConfigs = configs.map { it.second }

  init {
    // TODO enforce that block numbers are increasing
  }

  override fun chainConfigForBlock(block: BlockRecord): ChainConfig {

    val blockNumber = block.getHeader().getNumber().unsignedBigInteger()!!

    var idx = 0
    while (blockNumber >= blockNumbers[idx]) {
      idx += 1
    }
    return chainConfigs[idx]
  }

}
