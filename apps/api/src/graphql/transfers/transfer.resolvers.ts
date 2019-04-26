import { TransferService } from '@app/dao/transfer.service';
import { TransferDto } from '@app/graphql/transfers/dto/transfer.dto';
import { TransfersPageDto } from '@app/graphql/transfers/dto/transfers-page.dto';
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe';
import { ParseLimitPipe } from '@app/shared/validation/parse-limit.pipe.1';
import { ParsePagePipe } from '@app/shared/validation/parse-page.pipe';
import { Args, Query, Resolver } from '@nestjs/graphql';
import BigNumber from 'bignumber.js';

@Resolver('Transfer')
export class TransferResolvers {

  constructor(private readonly transferService: TransferService) { }

  @Query()
  async tokenTransfersByContractAddress(
    @Args('contractAddress', ParseAddressPipe) contractAddress: string,
    @Args('limit', ParseLimitPipe) limit?: number,
    @Args('page', ParsePagePipe) page?: number,
  ): Promise<TransfersPageDto> {
    const result = await this.transferService.findTokenTransfersByContractAddress(contractAddress, limit, page)
    const transfersPage = {
      items: result[0],
      totalCount: new BigNumber(result[1]),
    }
    return new TransfersPageDto(transfersPage)
  }

  @Query()
  async tokenTransfersByContractAddressForHolder(
    @Args('contractAddress', ParseAddressPipe) contractAddress: string,
    @Args('holderAddress', ParseAddressPipe) holderAddress: string,
    @Args('filter') filter: string,
    @Args('limit', ParseLimitPipe) limit?: number,
    @Args('page', ParsePagePipe) page?: number,
  ): Promise<TransferDto[]> {
    const entities = await this.transferService.findTokenTransfersByContractAddressForHolder(contractAddress, holderAddress, filter, limit, page)
    return entities.map(e => new TransferDto(e))
  }

  @Query()
  async internalTransactionsByAddress(
    @Args('address', ParseAddressPipe) address: string,
    @Args('limit', ParseLimitPipe) limit?: number,
    @Args('page', ParsePagePipe) page?: number,
  ): Promise<TransfersPageDto> {
    const result = await this.transferService.findInternalTransactionsByAddress(address, limit, page)
    const transfersPage = {
      items: result[0],
      totalCount: new BigNumber(result[1]),
    }
    return new TransfersPageDto(transfersPage)
  }
}
