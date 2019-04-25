import { BlockRewardEntity } from '@app/orm/entities/block-reward.entity';
import { TransactionEntity } from '@app/orm/entities/transaction.entity';
import { UncleEntity } from '@app/orm/entities/uncle.entity';
import { assignClean } from '@app/shared/utils';
import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('canonical_block_header')
export class BlockHeaderEntity {

  constructor(data: any) {
    assignClean(this, data);
  }

  @PrimaryColumn({ type: 'numeric', readonly: true })
  number!: string

  @Column({ type: 'character', length: 66, unique: true, readonly: true })
  hash!: string

  @Column({ type: 'character', length: 66, unique: true })
  parentHash!: string

  @Column({ type: 'numeric', readonly: true })
  nonce?: string

  @Column({ type: 'character', length: 66, readonly: true })
  sha3Uncles!: string

  @Column({ type: 'character', length: 514, readonly: true })
  logsBloom!: string

  @Column({ type: 'character', length: 66, readonly: true })
  transactionsRoot!: string

  @Column({ type: 'character', length: 66, readonly: true })
  stateRoot!: string

  @Column({ type: 'character', length: 66, readonly: true })
  receiptsRoot!: string

  @Column({ type: 'character', length: 66, readonly: true })
  author!: string

  @Column({ type: 'numeric', readonly: true })
  difficulty!: string

  @Column({ type: 'numeric', readonly: true })
  totalDifficulty!: string

  @Column({ type: 'text', readonly: true })
  extraData?: string

  @Column({ type: 'numeric', readonly: true })
  gasLimit!: string

  @Column({ type: 'numeric', readonly: true })
  gasUsed!: string

  @Column({ type: 'bigint', readonly: true })
  timestamp!: string

  @Column({ type: 'text', readonly: true })
  uncleHashes!: string

  @Column({ type: 'text', readonly: true })
  transactionHashes!: string

  @Column({ type: 'bigint', readonly: true })
  size!: string

  @Column({ type: 'bigint', readonly: true })
  blockTime?: string

  @OneToMany(type => TransactionEntity, tx => tx.blockHeader)
  @JoinColumn({
    name: 'hash',
    referencedColumnName: 'blockHash',
  })
  txs?: TransactionEntity[]

  @OneToMany(type => UncleEntity, uncle => uncle.blockHeader)
  @JoinColumn({
    name: 'hash',
    referencedColumnName: 'nephewHash',
  })
  uncles?: UncleEntity[]

  @OneToMany(type => BlockRewardEntity, reward => reward.blockHeader)
  @JoinColumn({
    name: 'hash',
    referencedColumnName: 'blockHash',
  })
  rewards?: BlockRewardEntity[]

}
