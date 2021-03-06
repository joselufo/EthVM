import { Args, Query, Resolver } from '@nestjs/graphql'
import { ContractService } from '@app/modules/contracts/contract.service'
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe'
import { ParseLimitPipe } from '@app/shared/validation/parse-limit.pipe'
import { ParsePagePipe } from '@app/shared/validation/parse-page.pipe'
import { ContractDto } from '@app/modules/contracts/dto/contract.dto'
import { ContractsPageDto } from '@app/modules/contracts/dto/contracts-page.dto'

@Resolver('Contract')
export class ContractResolvers {
  constructor(private readonly contractService: ContractService) {}

  @Query()
  async contractByAddress(@Args('address', ParseAddressPipe) address: string) {
    const entity = await this.contractService.findContractByAddress(address)
    return entity ? new ContractDto(entity) : null
  }

  @Query()
  async contractsCreatedBy(
    @Args('creator', ParseAddressPipe) creator: string,
    @Args('limit', ParseLimitPipe) limit?: number,
    @Args('page', ParsePagePipe) page?: number,
  ): Promise<ContractsPageDto> {
    const results = await this.contractService.findContractsCreatedBy(creator, limit, page)
    return {
      items: results[0].map(e => new ContractDto(e)),
      totalCount: results[1],
    }
  }
}
