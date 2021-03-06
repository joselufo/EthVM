import { Block } from '@app/graphql/schema'
import { BlockHeaderEntity } from '@app/orm/entities/block-header.entity'
import { TxDto } from '@app/modules/txs/dto/tx.dto'
import { BlockHeaderDto } from '@app/modules/blocks/dto/block-header.dto'
import { UncleDto } from '@app/modules/uncles/uncle.dto'
import { BlockRewardDto } from '@app/modules/blocks/dto/block-reward.dto'

export class BlockDto extends Block {
  constructor(data: BlockHeaderEntity) {
    super()

    this.transactions = data.txs ? data.txs.map(tx => new TxDto(tx)) : []
    delete data.txs
    this.uncles = data.uncles ? data.uncles.map(uncle => new UncleDto(uncle)) : []
    delete data.uncles
    this.rewards = data.rewards ? data.rewards.map(reward => new BlockRewardDto(reward)) : []
    delete data.rewards
    this.header = new BlockHeaderDto(data)

  }
}
