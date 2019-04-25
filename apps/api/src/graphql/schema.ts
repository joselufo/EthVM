
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
    balance?: string;
    totalTxCount?: string;
    inTxCount?: string;
    outTxCount?: string;
    isMiner?: boolean;
    isContractCreator?: boolean;
}

export class AddressBalance {
    address?: string;
    balance?: Decimal;
}

export class Block {
    header?: BlockHeader;
    transactions?: Transaction[];
    uncles?: Uncle[];
    rewards?: Reward[];
}

export class BlockHeader {
    number?: string;
    hash?: string;
    parentHash?: string;
    nonce?: string;
    sha3Uncles?: string;
    logsBloom?: string;
    transactionsRoot?: string;
    stateRoot?: string;
    receiptsRoot?: string;
    author?: string;
    difficulty?: string;
    totalDifficulty?: string;
    extraData?: string;
    gasLimit?: string;
    gasUsed?: string;
    timestamp?: string;
    size?: string;
    blockTime?: string;
    uncleHashes?: string[];
    transactionHashes?: string[];
}

export class BlockMetrics {
    timestamp?: string;
    blockCount?: string;
    maxDifficulty?: string;
    avgDifficulty?: string;
    minDifficulty?: string;
    sumDifficulty?: string;
    txCount?: string;
    maxTotalGasPrice?: string;
    minTotalGasPrice?: string;
    avgTotalGasPrice?: string;
    sumTotalGasPrice?: string;
    maxAvgGasLimit?: string;
    minAvgGasLimit?: string;
    avgAvgGasLimit?: string;
    sumAvgGasLimit?: string;
    maxAvgGasPrice?: string;
    minAvgGasPrice?: string;
    avgAvgGasPrice?: string;
    sumAvgGasPrice?: string;
    maxTotalTxFees?: string;
    minTotalTxFees?: string;
    avgTotalTxFees?: string;
    sumTotalTxFees?: string;
    maxAvgTxFees?: string;
    minAvgTxFees?: string;
    avgAvgTxFees?: string;
    sumAvgTxFees?: string;
    traceCount?: string;
    maxTotalTxs?: number;
    minTotalTxs?: number;
    avgTotalTxs?: string;
    sumTotalTxs?: string;
    maxNumSuccessfulTxs?: number;
    minNumSuccessfulTxs?: number;
    avgNumSuccessfulTxs?: string;
    sumNumSuccessfulTxs?: string;
    maxNumFailedTxs?: number;
    minNumFailedTxs?: number;
    avgNumFailedTxs?: string;
    sumNumFailedTxs?: string;
    maxNumInternalTxs?: number;
    minNumInternalTxs?: number;
    avgNumInternalTxs?: string;
    sumNumInternalTxs?: string;
}

export class Contract {
    address?: string;
    creator?: string;
    init?: string;
    code?: string;
    refundAddress?: string;
    refundBalance?: number;
    traceCreatedAtBlockHash?: string;
    traceCreatedAtBlockNumber?: string;
    traceCreatedAtTransactionHash?: string;
    traceCreatedAtTransactionIndex?: number;
    traceCreatedAtLogIndex?: number;
    traceCreatedAtTraceAddress?: string;
    traceDestroyedAtBlockHash?: string;
    traceDestroyedAtBlockNumber?: string;
    traceDestroyedAtTransactionHash?: string;
    traceDestroyedAtTransactionIndex?: Long;
    traceDestroyedAtLogIndex?: Long;
    traceDestroyedAtTraceAddress?: string;
    traceDestroyedAt?: Buffer;
    metadata?: ContractMetadata;
    totalSupply?: string;
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

    abstract blocks(limit?: number, page?: number, fromBlock?: Long): Block[] | Promise<Block[]>;

    abstract blockByHash(hash?: string): Block | Promise<Block>;

    abstract blockByNumber(number?: number): Block | Promise<Block>;

    abstract minedBlocksByAddress(address?: string, limit?: number, page?: number): Block[] | Promise<Block[]>;

    abstract totalNumberOfBlocks(): number | Promise<number>;

    abstract contractByAddress(address: string): Contract | Promise<Contract>;

    abstract contractsCreatedBy(creator: string, limit?: number, page?: number): Contract[] | Promise<Contract[]>;

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

    abstract tokenTransfersByContractAddress(contractAddress: string, limit?: number, page?: number): TransfersPage | Promise<TransfersPage>;

    abstract tokenTransfersByContractAddressForHolder(contractAddress: string, holderAddress: string, filter?: FilterEnum, limit?: number, page?: number): Transfer[] | Promise<Transfer[]>;

    abstract internalTransactionsByAddress(address: string, limit?: number, page?: number): TransfersPage | Promise<TransfersPage>;

    abstract tx(hash: string): Transaction | Promise<Transaction>;

    abstract txs(limit?: number, page?: number, fromBlock?: number): Transaction[] | Promise<Transaction[]>;

    abstract txsForAddress(hash: string, filter: FilterEnum, limit?: number, page?: number): Transaction[] | Promise<Transaction[]>;

    abstract totalNumberOfTransactions(): number | Promise<number>;

    abstract uncleByHash(hash: string): Uncle | Promise<Uncle>;

    abstract uncles(limit?: number, page?: number, fromUncle?: number): Uncle[] | Promise<Uncle[]>;

    abstract totalNumberOfUncles(): number | Promise<number>;

    abstract latestUncleBlockNumber(): number | Promise<number>;

    abstract temp__(): boolean | Promise<boolean>;
}

export class Quote {
    to?: string;
    price?: string;
    last_update?: Decimal;
    vol_24h?: string;
}

export class Receipt {
    transactionHash?: string;
    transactionIndex?: string;
    blockHash?: string;
    blockNumber?: string;
    from?: string;
    to?: string;
    contractAddress?: string;
    cumulativeGasUsed?: string;
    gasUsed?: string;
    logs?: string;
    logsBloom?: string;
    root?: string;
    status?: string;
}

export class Reward {
    address?: string;
    blockHash?: string;
    deltaType?: DeltaType;
    amount?: string;
}

export class Search {
    type?: SearchType;
    address?: AddressBalance;
    block?: Block;
    uncle?: Uncle;
    tx?: Transaction;
}

export abstract class ISubscription {
    abstract newBlock(): Block | Promise<Block>;

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
    balance?: string;
    currentPrice?: string;
}

export class TokenExchangeRate {
    address?: string;
    symbol?: string;
    name?: string;
    image?: string;
    currentPrice?: Decimal;
    marketCap?: Decimal;
    marketCapRank?: number;
    totalVolume?: Decimal;
    high24h?: Decimal;
    low24h?: Decimal;
    priceChange24h?: Decimal;
    priceChangePercentage24h?: Decimal;
    marketCapChange24h?: Decimal;
    marketCapChangePercentage24h?: Decimal;
    circulatingSupply?: string;
    totalSupply?: string;
    lastUpdated?: string;
    owner?: string;
    holdersCount?: number;
}

export class TokenHolder {
    address?: string;
    balance?: string;
}

export class Trace {
    blockHash?: string;
    transactionHash?: string;
    traceAddress?: string;
    transactionPosition?: number;
    blockNumber?: string;
    subtraces?: number;
    error?: string;
    type?: string;
    action?: string;
    result?: string;
}

export class Transaction {
    hash?: string;
    nonce?: string;
    blockHash?: string;
    blockNumber?: string;
    transactionIndex?: number;
    from?: string;
    to?: string;
    value?: string;
    gas?: string;
    gasPrice?: string;
    input?: Buffer;
    v?: string;
    r?: string;
    s?: string;
    timestamp?: string;
    creates?: string;
    chainId?: string;
    receipt?: Receipt;
    traces?: Trace[];
}

export class Transfer {
    id?: string;
    to?: string;
    deltaType?: DeltaType;
    from?: string;
    contractAddress?: string;
    tokenType?: string;
    amount?: string;
    traceLocationBlockHash?: string;
    traceLocationBlockNumber?: string;
    traceLocationTransactionHash?: string;
    traceLocationTransactionIndex?: number;
    traceLocationLogIndex?: number;
    traceLocationTraceAddress?: string;
    timestamp?: string;
}

export class TransfersPage {
    items?: Transfer[];
    totalCount?: number;
}

export class Uncle {
    hash?: string;
    index?: number;
    nephewNumber?: string;
    nephewHash?: string;
    number?: string;
    height?: string;
    parentHash?: string;
    nonce?: string;
    sha3Uncles?: string;
    logsBloom?: string;
    transactionsRoot?: string;
    stateRoot?: string;
    receiptsRoot?: string;
    author?: string;
    difficulty?: string;
    totalDifficulty?: string;
    extraData?: string;
    gasLimit?: string;
    gasUsed?: string;
    timestamp?: string;
    size?: string;
    rewardAmount?: string;
}

export type Buffer = any;
export type Date = any;
export type Decimal = any;
export type JSON = any;
export type Long = any;
export type StatisticValue = any;
