import { BlockService } from '@app/dao/block.service';
import { BlockDto } from '@app/graphql/blocks/dto/block.dto';
import { BlockHeaderEntity } from '@app/orm/entities/block-header.entity';
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe';
import { ParseHashPipe } from '@app/shared/validation/parse-hash.pipe';
import { ParseLimitPipe } from '@app/shared/validation/parse-limit.pipe';
import { ParsePagePipe } from '@app/shared/validation/parse-page.pipe';
import { Inject } from '@nestjs/common';
import { Args, Query, Resolver, Subscription, SubscriptionOptions } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

@Resolver('Block')
export class BlockResolvers {

  constructor(
    private readonly blockService: BlockService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) { }

  @Query()
  async blocks(
    @Args('page', ParsePagePipe) page: number,
    @Args('limit', ParseLimitPipe) limit: number,
    @Args('fromBlock') fromBlock?: number
  ) {
    const entities = await this.blockService.findBlocks(limit, page, fromBlock)
    return entities.map(e => new BlockDto(e))
  }

  @Query()
  async blockByHash(@Args('hash', ParseHashPipe) hash: string) {
    const entity = await this.blockService.findBlockByHash(hash)
    return entity ? new BlockDto(entity) : null
  }

  @Query()
  async blockByNumber(@Args('number') number: number) {
    const entity = await this.blockService.findBlockByNumber(number)
    return entity ? new BlockDto(entity) : null
  }

  @Query()
  async minedBlocksByAddress(
    @Args('address', ParseAddressPipe) address: string,
    @Args('limit', ParseLimitPipe) limit?: number,
    @Args('page', ParsePagePipe) page?: number,
  ) {
    const entities = await this.blockService.findMinedBlocksByAddress(address, limit, page)
    return entities.map(e => new BlockDto(e))
  }

  @Query()
  async totalNumberOfBlocks() {
    return await this.blockService.findTotalNumberOfBlocks()
  }

  @Subscription(
    'newBlock', {
      resolve: (block: BlockHeaderEntity) => new BlockDto(block)
    } as SubscriptionOptions)
  newBlock() {
    return this.pubSub.asyncIterator('block')
  }

  @Subscription()
  isSyncing() {
    return this.pubSub.asyncIterator('isSyncing')
  }

}
