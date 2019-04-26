
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export enum DeltaType {
    UNCLE_REWARD = "UNCLE_REWARD",
    BLOCK_REWARD = "BLOCK_REWARD",
    CONTRACT_CREATION = "CONTRACT_CREATION",
    TOKEN_TRANSFER = "TOKEN_TRANSFER",
    CONTRACT_DESTRUCTION = "CONTRACT_DESTRUCTION",
    TX = "TX",
    MINER_FEE = "MINER_FEE",
    INTERNAL_TX = "INTERNAL_TX"
}

export enum Duration {
    ALL = "ALL",
    YEAR = "YEAR",
    MONTH = "MONTH",
    WEEK = "WEEK",
    DAY = "DAY"
}

export enum ExchangeFrom {
    ETH = "ETH"
}

export enum ExchangeTo {
    USD = "USD"
}

export enum FilterEnum {
    in = "in",
    out = "out",
    all = "all"
}

export enum Order {
    asc = "asc",
    desc = "desc"
}

export enum SearchType {
    Address = "Address",
    Block = "Block",
    Uncle = "Uncle",
    Tx = "Tx",
    None = "None"
}

export enum TokenExchangeRateFilter {
    price_high = "price_high",
    price_low = "price_low",
    volume_high = "volume_high",
    volume_low = "volume_low",
    market_cap_high = "market_cap_high",
    market_cap_low = "market_cap_low",
    market_cap_rank = "market_cap_rank"
}

export class Account {
    address?: string;
    balance?: BigNumber;
    totalTxCount?: BigNumber;
    inTxCount?: BigNumber;
    outTxCount?: BigNumber;
    isMiner?: boolean;
    isContractCreator?: boolean;
}

export class AddressBalance {
    address?: string;
    balance?: BigNumber;
}

export class Block {
    header?: BlockHeader;
    transactions?: Transaction[];
    uncles?: Uncle[];
    rewards?: Reward[];
}

export class BlockHeader {
    number?: BigNumber;
    hash?: string;
    parentHash?: string;
    nonce?: BigNumber;
    sha3Uncles?: string;
    logsBloom?: string;
    transactionsRoot?: string;
    stateRoot?: string;
    receiptsRoot?: string;
    author?: string;
    difficulty?: BigNumber;
    totalDifficulty?: BigNumber;
    extraData?: string;
    gasLimit?: BigNumber;
    gasUsed?: BigNumber;
    timestamp?: string;
    size?: string;
    blockTime?: string;
    uncleHashes?: string[];
    transactionHashes?: string[];
}

export class BlockMetrics {
    timestamp?: string;
    blockCount?: number;
    maxDifficulty?: BigNumber;
    avgDifficulty?: BigNumber;
    minDifficulty?: BigNumber;
    sumDifficulty?: BigNumber;
    txCount?: number;
    maxTotalGasPrice?: BigNumber;
    minTotalGasPrice?: BigNumber;
    avgTotalGasPrice?: BigNumber;
    sumTotalGasPrice?: BigNumber;
    maxAvgGasLimit?: BigNumber;
    minAvgGasLimit?: BigNumber;
    avgAvgGasLimit?: BigNumber;
    sumAvgGasLimit?: BigNumber;
    maxAvgGasPrice?: BigNumber;
    minAvgGasPrice?: BigNumber;
    avgAvgGasPrice?: BigNumber;
    sumAvgGasPrice?: BigNumber;
    maxTotalTxFees?: BigNumber;
    minTotalTxFees?: BigNumber;
    avgTotalTxFees?: BigNumber;
    sumTotalTxFees?: BigNumber;
    maxAvgTxFees?: BigNumber;
    minAvgTxFees?: BigNumber;
    avgAvgTxFees?: BigNumber;
    sumAvgTxFees?: BigNumber;
    traceCount?: number;
    maxTotalTxs?: number;
    minTotalTxs?: number;
    avgTotalTxs?: number;
    sumTotalTxs?: number;
    maxNumSuccessfulTxs?: number;
    minNumSuccessfulTxs?: number;
    avgNumSuccessfulTxs?: number;
    sumNumSuccessfulTxs?: number;
    maxNumFailedTxs?: number;
    minNumFailedTxs?: number;
    avgNumFailedTxs?: number;
    sumNumFailedTxs?: number;
    maxNumInternalTxs?: number;
    minNumInternalTxs?: number;
    avgNumInternalTxs?: number;
    sumNumInternalTxs?: number;
}

export class BlockSummary {
    number?: BigNumber;
    hash?: string;
    author?: string;
    numSuccessfulTxs?: BigNumber;
    numFailedTxs?: BigNumber;
    reward?: BigNumber;
}

export class Contract {
    address?: string;
    creator?: string;
    init?: string;
    code?: string;
    refundAddress?: string;
    refundBalance?: BigNumber;
    traceCreatedAtBlockHash?: string;
    traceCreatedAtBlockNumber?: BigNumber;
    traceCreatedAtTransactionHash?: string;
    traceCreatedAtTransactionIndex?: number;
    traceCreatedAtLogIndex?: number;
    traceCreatedAtTraceAddress?: string;
    traceDestroyedAtBlockHash?: string;
    traceDestroyedAtBlockNumber?: BigNumber;
    traceDestroyedAtTransactionHash?: string;
    traceDestroyedAtTransactionIndex?: Long;
    traceDestroyedAtLogIndex?: Long;
    traceDestroyedAtTraceAddress?: string;
    traceDestroyedAt?: Buffer;
    metadata?: ContractMetadata;
    totalSupply?: BigNumber;
}

export class ContractLogo {
    src?: string;
}

export class ContractMetadata {
    address?: string;
    name?: string;
    symbol?: string;
    decimals?: number;
    ensAddress?: string;
    type?: string;
    logo?: ContractLogo;
    support?: ContractSupport;
    social?: ContractSocial;
    website?: string;
}

export class ContractSocial {
    blog?: string;
    chat?: string;
    facebook?: string;
    forum?: string;
    github?: string;
    gitter?: string;
    instagram?: string;
    linkedin?: string;
    reddit?: string;
    slack?: string;
    telegram?: string;
    twitter?: string;
    youtube?: string;
}

export class ContractSupport {
    email?: string;
    url?: string;
}

export abstract class IQuery {
    abstract accountByAddress(address: string): Account | Promise<Account>;

    abstract blockMetricsByDay(duration: Duration, fields?: string[]): BlockMetrics[] | Promise<BlockMetrics[]>;

    abstract contractByAddress(address: string): Contract | Promise<Contract>;

    abstract contractsCreatedBy(creator: string, limit?: number, page?: number): Contract[] | Promise<Contract[]>;

    abstract latestBlocks(limit?: number): BlockSummary[] | Promise<BlockSummary[]>;

    abstract blocks(limit?: number, page?: number, fromBlock?: Long): Block[] | Promise<Block[]>;

    abstract blockByHash(hash?: string): Block | Promise<Block>;

    abstract blockByNumber(number?: number): Block | Promise<Block>;

    abstract minedBlocksByAddress(address?: string, limit?: number, page?: number): Block[] | Promise<Block[]>;

    abstract totalNumberOfBlocks(): BigNumber | Promise<BigNumber>;

    abstract search(query: string): Search | Promise<Search>;

    abstract tokenHolders(address: string, limit?: number, page?: number): TokenHolder[] | Promise<TokenHolder[]>;

    abstract tokenHolder(address: string, holderAddress: string): TokenHolder | Promise<TokenHolder>;

    abstract addressAllTokensOwned(address: string): Token[] | Promise<Token[]>;

    abstract addressAmountTokensOwned(address: string): number | Promise<number>;

    abstract quote(symbol: ExchangeFrom, to: ExchangeTo): Quote | Promise<Quote>;

    abstract tokenExchangeRates(filter: TokenExchangeRateFilter, limit?: number, page?: number): TokenExchangeRate[] | Promise<TokenExchangeRate[]>;

    abstract totalNumTokenExchangeRates(): number | Promise<number>;

    abstract tokenExchangeRateBySymbol(symbol: string): TokenExchangeRate | Promise<TokenExchangeRate>;

    abstract tokenExchangeRateByAddress(address: string): TokenExchangeRate | Promise<TokenExchangeRate>;

    abstract uncleByHash(hash: string): Uncle | Promise<Uncle>;

    abstract uncles(limit?: number, page?: number, fromUncle?: number): Uncle[] | Promise<Uncle[]>;

    abstract totalNumberOfUncles(): BigNumber | Promise<BigNumber>;

    abstract latestUncleBlockNumber(): BigNumber | Promise<BigNumber>;

    abstract tokenTransfersByContractAddress(contractAddress: string, limit?: number, page?: number): TransfersPage | Promise<TransfersPage>;

    abstract tokenTransfersByContractAddressForHolder(contractAddress: string, holderAddress: string, filter?: FilterEnum, limit?: number, page?: number): Transfer[] | Promise<Transfer[]>;

    abstract internalTransactionsByAddress(address: string, limit?: number, page?: number): TransfersPage | Promise<TransfersPage>;

    abstract latestTxs(limit?: number): TransactionSummary[] | Promise<TransactionSummary[]>;

    abstract tx(hash: string): Transaction | Promise<Transaction>;

    abstract txs(limit?: number, page?: number, fromBlock?: BigNumber): Transaction[] | Promise<Transaction[]>;

    abstract txsForAddress(hash: string, filter: FilterEnum, limit?: number, page?: number): Transaction[] | Promise<Transaction[]>;

    abstract totalNumberOfTransactions(): BigNumber | Promise<BigNumber>;

    abstract temp__(): boolean | Promise<boolean>;
}

export class Quote {
    to?: string;
    price?: BigNumber;
    last_update?: BigNumber;
    vol_24h?: string;
}

export class Receipt {
    transactionHash?: string;
    transactionIndex?: string;
    blockHash?: string;
    blockNumber?: BigNumber;
    from?: string;
    to?: string;
    contractAddress?: string;
    cumulativeGasUsed?: BigNumber;
    gasUsed?: BigNumber;
    logs?: string;
    logsBloom?: string;
    root?: string;
    status?: string;
}

export class Reward {
    address?: string;
    blockHash?: string;
    deltaType?: DeltaType;
    amount?: BigNumber;
}

export class Search {
    type?: SearchType;
    address?: AddressBalance;
    block?: Block;
    uncle?: Uncle;
    tx?: Transaction;
}

export abstract class ISubscription {
    abstract newBlock(): BlockSummary | Promise<BlockSummary>;

    abstract isSyncing(): boolean | Promise<boolean>;

    abstract newTxs(): Transaction[] | Promise<Transaction[]>;
}

export class Token {
    name?: string;
    website?: string;
    email?: string;
    symbol?: string;
    address?: string;
    decimals?: number;
    balance?: BigNumber;
    currentPrice?: BigNumber;
}

export class TokenExchangeRate {
    address?: string;
    symbol?: string;
    name?: string;
    image?: string;
    currentPrice?: BigNumber;
    marketCap?: BigNumber;
    marketCapRank?: number;
    totalVolume?: BigNumber;
    high24h?: BigNumber;
    low24h?: BigNumber;
    priceChange24h?: BigNumber;
    priceChangePercentage24h?: BigNumber;
    marketCapChange24h?: BigNumber;
    marketCapChangePercentage24h?: BigNumber;
    circulatingSupply?: BigNumber;
    totalSupply?: BigNumber;
    lastUpdated?: string;
    owner?: string;
    holdersCount?: number;
}

export class TokenHolder {
    address?: string;
    balance?: BigNumber;
}

export class Trace {
    blockHash?: string;
    transactionHash?: string;
    traceAddress?: string;
    transactionPosition?: number;
    blockNumber?: BigNumber;
    subtraces?: number;
    error?: string;
    type?: string;
    action?: string;
    result?: string;
}

export class Transaction {
    hash?: string;
    nonce?: BigNumber;
    blockHash?: string;
    blockNumber?: BigNumber;
    transactionIndex?: number;
    from?: string;
    to?: string;
    value?: BigNumber;
    gas?: BigNumber;
    gasPrice?: BigNumber;
    input?: Buffer;
    v?: string;
    r?: string;
    s?: string;
    timestamp?: string;
    creates?: string;
    chainId?: string;
    receipt?: Receipt;
    traces?: Trace[];
    successful?: boolean;
}

export class TransactionSummary {
    hash?: string;
    blockNumber?: BigNumber;
    from?: string;
    to?: string;
    created?: string;
    value?: BigNumber;
    fee?: BigNumber;
    successful?: boolean;
    timestamp?: string;
}

export class Transfer {
    id?: string;
    to?: string;
    deltaType?: DeltaType;
    from?: string;
    contractAddress?: string;
    tokenType?: string;
    amount?: BigNumber;
    traceLocationBlockHash?: string;
    traceLocationBlockNumber?: BigNumber;
    traceLocationTransactionHash?: string;
    traceLocationTransactionIndex?: number;
    traceLocationLogIndex?: number;
    traceLocationTraceAddress?: string;
    timestamp?: string;
}

export class TransfersPage {
    items?: Transfer[];
    totalCount?: BigNumber;
}

export class Uncle {
    hash?: string;
    index?: number;
    nephewNumber?: BigNumber;
    nephewHash?: string;
    number?: BigNumber;
    height?: string;
    parentHash?: string;
    nonce?: BigNumber;
    sha3Uncles?: string;
    logsBloom?: string;
    transactionsRoot?: string;
    stateRoot?: string;
    receiptsRoot?: string;
    author?: string;
    difficulty?: BigNumber;
    totalDifficulty?: BigNumber;
    extraData?: string;
    gasLimit?: BigNumber;
    gasUsed?: BigNumber;
    timestamp?: string;
    size?: string;
    rewardAmount?: BigNumber;
}

export type BigNumber = any;
export type Buffer = any;
export type Date = any;
export type Decimal = any;
export type JSON = any;
export type Long = any;
export type StatisticValue = any;
