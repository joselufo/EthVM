import { Test } from '@nestjs/testing'
import { EthService } from '../../shared/eth.service'
import { BlockMetricService } from './block-metric.service'
import { BlockMetricsResolvers } from './block-metrics.resolvers'
import { BlockMetricEntity } from '../../orm/entities/block-metric.entity'
import { BlockMetricsDto } from './block-metrics.dto'
import { PubSub } from 'graphql-subscriptions'

const hashOne = '0x0000000000000000000000000000000000000000000000000000000000000001'
const hashTwo = '0x0000000000000000000000000000000000000000000000000000000000000002'
const hashThree = '0x0000000000000000000000000000000000000000000000000000000000000003'
const hashFour = '0x0000000000000000000000000000000000000000000000000000000000000004'
const hashFive = '0x0000000000000000000000000000000000000000000000000000000000000005'
const hashSix = '0x0000000000000000000000000000000000000000000000000000000000000006'
const hashSeven = '0x0000000000000000000000000000000000000000000000000000000000000007'
const hashEight = '0x0000000000000000000000000000000000000000000000000000000000000008'
const hashNine = '0x0000000000000000000000000000000000000000000000000000000000000009'
const hashTen = '0x00000000000000000000000000000000000000000000000000000000000000010'
const hashEleven = '0x0000000000000000000000000000000000000000000000000000000000000011'

const blockMetrics = {
  '0x0000000000000000000000000000000000000000000000000000000000000001': {
    id: 1,
    hash: hashOne
  },
  '0x0000000000000000000000000000000000000000000000000000000000000002': {
    id: 2,
    hash: hashTwo
  },
  '0x0000000000000000000000000000000000000000000000000000000000000003': {
    id: 3,
    hash: hashThree
  },
  '0x0000000000000000000000000000000000000000000000000000000000000004': {
    id: 4,
    hash: hashFour
  },
  '0x0000000000000000000000000000000000000000000000000000000000000005': {
    id: 5,
    hash: hashFive
  },
  '0x0000000000000000000000000000000000000000000000000000000000000006': {
    id: 6,
    hash: hashSix
  },
  '0x0000000000000000000000000000000000000000000000000000000000000007': {
    id: 7,
    hash: hashSeven
  },
  '0x0000000000000000000000000000000000000000000000000000000000000008': {
    id: 8,
    hash: hashEight
  },
  '0x0000000000000000000000000000000000000000000000000000000000000009': {
    id: 9,
    hash: hashNine
  },
  '0x00000000000000000000000000000000000000000000000000000000000000010': {
    id: 10,
    hash: hashTen
  }
}

const mockService = {
  async findBlockMetricByHash(hash: string) {
    const data = blockMetrics[hash]
    return data ? new BlockMetricEntity(data) : null
  },
  async findBlockMetrics(limit: number = 10, page: number = 0) {
    const start = page * limit
    const end = start + limit
    const items = Object.values(blockMetrics).slice(start, end)
    return items.map(i => new BlockMetricEntity(i))
  }
}

describe('BlockMetricResolvers', () => {
  let blockMetricService: BlockMetricService
  let blockMetricResolvers: BlockMetricsResolvers

  beforeEach(async () => {
    // test module
    const module = await Test.createTestingModule({
      providers: [
        BlockMetricsResolvers,
        EthService,
        {
          provide: 'PUB_SUB',
          useValue: new PubSub()
        },
        {
          provide: BlockMetricService,
          useValue: mockService
        }
      ]
    }).compile()

    // fetch dependencies
    blockMetricService = module.get<BlockMetricService>(BlockMetricService)
    blockMetricResolvers = module.get<BlockMetricsResolvers>(BlockMetricsResolvers)
  })

  describe('blockMetricByHash', () => {
    it('should return null if BlockMetricEntity does not exist for a given hash', async () => {
      expect(await blockMetricResolvers.blockMetricByHash(hashEleven)).toEqual(null)
    })

    it('should return an instance of BlockMetricsDto matching the hash provided', async () => {
      const blockMetricOne = await blockMetricResolvers.blockMetricByHash(hashOne)
      const blockMetricTwo = await blockMetricResolvers.blockMetricByHash(hashTwo)

      // check that distinct objects are returned based on hash and that they do not equal each other

      expect(blockMetricOne).not.toBeNull()
      expect(blockMetricOne).toBeInstanceOf(BlockMetricsDto)
      expect(blockMetricOne).toHaveProperty('hash', hashOne)

      expect(blockMetricTwo).not.toBeNull()
      expect(blockMetricTwo).toBeInstanceOf(BlockMetricsDto)
      expect(blockMetricTwo).toHaveProperty('hash', hashTwo)

      expect(blockMetricOne).not.toEqual(blockMetricTwo)
    })

    it('should convert a BlockMetricEntity to a BlockMetricsDto', async () => {
      const blockMetricOne = await blockMetricResolvers.blockMetricByHash(hashOne)

      expect(blockMetricOne).toEqual(
        new BlockMetricsDto({
          id: 1,
          hash: hashOne
        })
      )
    })
  })

  describe('blockMetrics', () => {
    it('should return an array of BlockMetricsDto instances, respecting given limit and page parameters', async () => {
      const blockMetricsOne = await blockMetricResolvers.blockMetrics(5, 0)
      expect(blockMetricsOne).toHaveLength(5)
      expect(blockMetricsOne[0]).toHaveProperty('id', 1)
      expect(blockMetricsOne[4]).toHaveProperty('id', 5)

      const blockMetricsTwo = await blockMetricResolvers.blockMetrics(5, 1)
      expect(blockMetricsTwo).toHaveLength(5)
      expect(blockMetricsTwo[0]).toHaveProperty('id', 6)
      expect(blockMetricsTwo[4]).toHaveProperty('id', 10)

      // Check an empty array is returned if no items available for requested page
      const blockMetricsThree = await blockMetricResolvers.blockMetrics(10, 1)
      expect(blockMetricsThree).toHaveLength(0)
    })

    it('should convert an array of BlockMetricEntity instances to an array of BlockMetricsDto instances', async () => {
      const blockMetrics = await blockMetricResolvers.blockMetrics()
      const expected = [
        new BlockMetricsDto({ id: 1, hash: hashOne }),
        new BlockMetricsDto({ id: 2, hash: hashTwo }),
        new BlockMetricsDto({ id: 3, hash: hashThree }),
        new BlockMetricsDto({ id: 4, hash: hashFour }),
        new BlockMetricsDto({ id: 5, hash: hashFive }),
        new BlockMetricsDto({ id: 6, hash: hashSix }),
        new BlockMetricsDto({ id: 7, hash: hashSeven }),
        new BlockMetricsDto({ id: 8, hash: hashEight }),
        new BlockMetricsDto({ id: 9, hash: hashNine }),
        new BlockMetricsDto({ id: 10, hash: hashTen })
      ]
      expect(blockMetrics).toEqual(expect.arrayContaining(expected))
    })
  })
})
