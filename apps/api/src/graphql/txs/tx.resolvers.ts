import { TxService } from '@app/dao/tx.service';
import { TxDto } from '@app/graphql/txs/dto/tx.dto';
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe';
import { ParseBigNumberPipe } from '@app/shared/validation/parse-big-number.pipe';
import { ParseHashPipe } from '@app/shared/validation/parse-hash.pipe';
import { ParseLimitPipe } from '@app/shared/validation/parse-limit.pipe.1';
import { ParsePagePipe } from '@app/shared/validation/parse-page.pipe';
import { Args, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import BigNumber from 'bignumber.js';

@Resolver('Transaction')
export class TxResolvers {
  constructor(
    private readonly txService: TxService,
    // @Inject('PUB_SUB') private pubSub: PubSub
  ) { }

  @Query()
  async tx(@Args('hash', ParseHashPipe) hash: string): Promise<TxDto | null> {
    const entity = await this.txService.findOneByHash(hash)
    return entity ? new TxDto(entity) : null
  }

  @Query()
  async txs(
    @Args('limit', ParseLimitPipe) limit?: number,
    @Args('page') page?: number,
    @Args('fromBlock', ParseBigNumberPipe) fromBlock?: BigNumber
  ): Promise<TxDto[]> {
    const entities = await this.txService.find(limit, page, fromBlock)
    return entities.map(e => new TxDto(e))
  }

  @Query()
  async txsForAddress(
    @Args('hash', ParseAddressPipe) hash: string,
    @Args('filter') filter?: string,
    @Args('limit', ParseLimitPipe) limit?: number,
    @Args('page', ParsePagePipe) page?: number,
  ): Promise<TxDto[]> {
    const entities = await this.txService.findByAddress(hash, filter, limit, page)
    return entities.map(e => new TxDto(e))
  }

  @Query()
  async totalNumberOfTransactions(): Promise<number> {
    return await this.txService.countTransactions()
  }

  @ResolveProperty()
  async successful(): Promise<boolean> {
    return true
  }

  // @Subscription()
  // newTxs() {
  //   return {
  //     resolve: payload => {
  //       return new TxDto(payload.value)
  //     },
  //     subscribe: () => this.pubSub.asyncIterator('txs'),
  //   }
  // }
}
