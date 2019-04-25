import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindManyOptions, LessThanOrEqual, Repository } from 'typeorm'
import { UncleEntity } from '@app/orm/entities/uncle.entity'

@Injectable()
export class UncleService {
  constructor(@InjectRepository(UncleEntity) private readonly uncleRepository: Repository<UncleEntity>) {}

  async findUncleByHash(hash: string): Promise<UncleEntity | undefined> {
    return this.uncleRepository.findOne({ where: { hash } })
  }

  async findUncles(take: number = 10, page: number = 0, fromUncle?: number): Promise<UncleEntity[]> {
    // Issues to solve:
    //   1) We need to store the count of uncles in processing
    //   2) With that we can proceed with the same process as we're doing with Blocks
    // For now we are resorting to the well known skip, limit calls (but it will cause issues if you go very far)
    const offset = fromUncle && fromUncle !== -1 ? fromUncle : await this.findLatestUncleBlockNumber()
    const skip = page * take
    const findOptions: FindManyOptions = {
      where: { number: LessThanOrEqual(offset) },
      order: { nephewNumber: 'DESC', number: 'DESC' },
      take,
      skip,
    }
    return this.uncleRepository.find(findOptions)
  }

  async countUncles(): Promise<number> {
    return this.uncleRepository.count()
  }

  async findLatestUncleBlockNumber(): Promise<string> {
    const findOptions: FindManyOptions = { order: { nephewNumber: 'DESC', number: 'DESC' }, take: 1 }
    const latest = await this.uncleRepository.find(findOptions)
    return latest && latest.length ? latest[0].height : '0'
  }
}
