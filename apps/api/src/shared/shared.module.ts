import { ConfigService } from '@app/shared/config.service'
import { DurationService } from '@app/shared/duration.service'
import { EthService } from '@app/shared/eth.service'
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe'
import { ParseHashPipe } from '@app/shared/validation/parse-hash.pipe'
import { ParseLimitPipe } from '@app/shared/validation/parse-limit.pipe'
import { ParsePagePipe } from '@app/shared/validation/parse-page.pipe'
import { Global, Module } from '@nestjs/common'

@Global()
@Module({
  providers: [ConfigService, DurationService, EthService, ParseHashPipe, ParseAddressPipe, ParseLimitPipe, ParsePagePipe],
  exports: [ConfigService, DurationService, EthService, ParseHashPipe, ParseAddressPipe, ParseLimitPipe, ParsePagePipe],
})
export class SharedModule {}
