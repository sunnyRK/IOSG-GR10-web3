import gql from "graphql-tag";

export const UNI_TICKER_GET_MONTH = gql`
  query pairDayData($pairAddress: Bytes!, $date: Int!) {
    pairDayDatas(where: { pairAddress: $pairAddress, date: $date }) {
      id
      date
      reserve0
      reserve1
      reserveUSD
      dailyVolumeUSD
      totalSupply
      token0{
        symbol
      }
      token1{
        symbol
      }
    }
  }
`;

export const UNI_TICKER_GET_ALL_MONTH = gql`
  query pairDayData($pairAddress: Bytes!, $date: Int!,  $date2: Int!, $firstData: Int!) {
    pairDayDatas(first: $firstData, where: { pairAddress: $pairAddress, date_gte: $date, date_lte: $date2 }) {
      id
      date
      reserve0
      reserve1
      reserveUSD
      dailyVolumeUSD
      totalSupply
      token0{
        symbol
      }
      token1{
        symbol
      }
    }
  }
`;

export const UNI_TICKER_GET_MONTH_FOR_FEES = gql`
  query pairDayData($id: Bytes!, $date: Int!) {
    pairDayDatas(where: { pairAddress: $id, date_gt: $date }) {
      id
      reserve0
      reserve1
      reserveUSD
      dailyVolumeUSD
    }
  }
`;

export const GET_UNI_DAY_DATA = gql`
  query dayData {
    uniswapDayDatas(
      first: 100
      where: { dailyVolumeUSD_gt: 0 }
      orderBy: date
      orderDirection: desc
    ) {
      date
      dailyVolumeUSD
      id
    }
  }
`;

export const GET_UNI_PAIR_DATA = gql`
  query pair($id: Bytes!) {
    pairs(
      where: { id: $id }
    ) {
      reserveUSD
    }
  }
`;

export const GET_UNI_PAIR_DATA_24HOUR = gql`
  query pairDayData($pairAddress: Bytes!, $date: Int!) {
    pairDayDatas(where: { pairAddress: $pairAddress, date: $date }) {
      reserveUSD
      dailyVolumeUSD
    }
  }
`;

export const GET_SUSHI_PAIR_DATA_24HOUR = gql`
  query pairDayData($pairAddress: Bytes!, $date: Int!) {
    pairDayDatas(where: { pairAddress: $pairAddress, date: $date }) {
      reserveUSD
      dailyVolumeUSD
    }
  }
`;

export const GET_SUSHI_PAIR_DATA = gql`
  query pair($id: Bytes!) {
    pairs(
      where: { id: $id }
    ) {
      reserveUSD
    }
  }
`;

export const SUSHI_TICKER_GET_MONTH_FOR_FEES = gql`
  query pairDayData($id: Bytes!, $date: Int!) {
    pairDayDatas(where: { pairAddress: $id, date_gt: $date }) {
      id
      reserve0
      reserve1
      reserveUSD
      dailyVolumeUSD
    }
  }
`;

export const SUSHI_TICKER_GET_MONTH = gql`
  query pairDayData($pairAddress: Bytes!, $date: Int!) {
    pairDayDatas(where: { pairAddress: $pairAddress, date: $date }) {
      id
      date
      reserve0
      reserve1
      reserveUSD
      dailyVolumeUSD
      totalSupply
      token0{
        symbol
      }
      token1{
        symbol
      }
    }
  }
`;

export const SUSHI_TICKER_GET_ALL_MONTH = gql`
  query pairDayData($pairAddress: Bytes!, $date: Int!,  $date2: Int!, $firstData: Int!) {
    pairDayDatas(first: $firstData, where: { pairAddress: $pairAddress, date_gte: $date, date_lte: $date2 }) {
      id
      date
      reserve0
      reserve1
      reserveUSD
      dailyVolumeUSD
      totalSupply
      token0{
        symbol
      }
      token1{
        symbol
      }
    }
  }
`;

export const SUSHI_GET_DERIVED_ETH = gql`
  query token($id: ID!) {
    token(id: $id) {
      id
      derivedETH
    }
  }
`;

export const SUSHI_GET_POOL_INFO = gql`
  query poolinfo($id: ID!) {
    pair(id: $id) {
      id
      totalSupply
      reserveETH
    }
  }
`;

export const SUSHI_GET_REWARD_POOLS = gql`
  query pools {
    pools(where: { allocPoint_gt: 0 }) {
      id
      pair
      slpBalance
      allocPoint
    }
  }
`;

export const SUSHI_GET_REWARD_POOLS_BY_PAIR = gql`
  query pools($pairAddress: Bytes!) {
    pools(where: { pair: $pairAddress }) {
      id
      pair
      slpBalance
      allocPoint
    }
  }
`;

export const SUSHI_GET_TOTAL_ALLOC = gql`
  query totalalloc {
    masterChefs {
      id
      totalAllocPoint
    }
  }
`;
