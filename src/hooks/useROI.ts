import { useCallback } from 'react'
import { uniswapClient } from "../external/Data/UniswapClient";
import {
  UNI_TICKER_GET_MONTH,
} from "../external/Data/Query";
import BigNumber from 'bignumber.js';

const useROI = () => {
    const handleROI = useCallback(async (_pairAddress: string, time: string, amount:  string, currentTime: string) => {
        try {
            // past time pair data
            const result0 = await uniswapClient.query({
                query: UNI_TICKER_GET_MONTH,
                variables: {
                    pairAddress: _pairAddress,
                    date: new BigNumber(time).toNumber()
                },
                fetchPolicy: "cache-first",
            });
            
            // console.log("result0:", result0)

            // current time pair data
            const result1 = await uniswapClient.query({
                query: UNI_TICKER_GET_MONTH,
                variables: {
                    pairAddress: _pairAddress,
                    date: new BigNumber(currentTime).toNumber()
                },
                fetchPolicy: "cache-first",
            });
            
            // console.log("result1:", result1)

            let convertUserAmountInLp = new BigNumber(0);
            let convertUserLptoCurrentPrice = new BigNumber(0);
            let ROI = new BigNumber(0); 
            let token0AssetChange = new BigNumber(0);
            let token1AssetChange = new BigNumber(0);
            let convertUserLpToToken0 = new BigNumber(0); 
            let convertUserLpToToken0PastTime = new BigNumber(0); 
            let convertUserLpToToken1 = new BigNumber(0);
            let convertUserLpToToken1PastTime = new BigNumber(0);
            let symbol0;
            let symbol1;
            let _totalAmt = new BigNumber(0);
            let ILossPercent = 0;

            if(result0.data.pairDayDatas[0].totalSupply) {
                convertUserAmountInLp = new BigNumber(amount).
                    multipliedBy(new BigNumber(result0.data.pairDayDatas[0].totalSupply)).
                    div(new BigNumber(result0.data.pairDayDatas[0].reserveUSD))

                convertUserLptoCurrentPrice = new BigNumber(convertUserAmountInLp).
                    multipliedBy(new BigNumber(result1.data.pairDayDatas[0].reserveUSD)).
                    div(new BigNumber(result1.data.pairDayDatas[0].totalSupply))

                ROI = new BigNumber(convertUserLptoCurrentPrice).
                    multipliedBy(new BigNumber(100)).
                    div(new BigNumber(amount)).minus(100)

                convertUserLpToToken0PastTime = new BigNumber(convertUserAmountInLp).
                    multipliedBy(new BigNumber(result0.data.pairDayDatas[0].reserve0)).
                    div(new BigNumber(result0.data.pairDayDatas[0].totalSupply))

                convertUserLpToToken0 = new BigNumber(convertUserAmountInLp).
                    multipliedBy(new BigNumber(result1.data.pairDayDatas[0].reserve0)).
                    div(new BigNumber(result1.data.pairDayDatas[0].totalSupply))

                token0AssetChange = new BigNumber(convertUserLpToToken0).
                    multipliedBy(new BigNumber(100)).
                    div(convertUserLpToToken0PastTime).minus(100)

                convertUserLpToToken1PastTime = new BigNumber(convertUserAmountInLp).
                    multipliedBy(new BigNumber(result0.data.pairDayDatas[0].reserve1)).
                    div(new BigNumber(result0.data.pairDayDatas[0].totalSupply))

                convertUserLpToToken1 = new BigNumber(convertUserAmountInLp).
                    multipliedBy(new BigNumber(result1.data.pairDayDatas[0].reserve1)).
                    div(new BigNumber(result1.data.pairDayDatas[0].totalSupply))

                token1AssetChange = new BigNumber(convertUserLpToToken1).
                    multipliedBy(new BigNumber(100)).
                    div(convertUserLpToToken1PastTime).minus(100)

                symbol0 = result1.data.pairDayDatas[0].token0.symbol
                symbol1 = result1.data.pairDayDatas[0].token1.symbol

                _totalAmt = new BigNumber(amount).multipliedBy(new BigNumber(ROI).plus(100)).div(100)
                const halfAmt = _totalAmt.div(2)

                const token0NewPrice = halfAmt.div(convertUserLpToToken0)
                const totalValueOfrOldAsset0Quantity = token0NewPrice.multipliedBy(convertUserLpToToken0PastTime)

                const token1NewPrice = halfAmt.div(convertUserLpToToken1)
                const totalValueOfrOldAsset1Quantity = token1NewPrice.multipliedBy(convertUserLpToToken1PastTime)

                const totalAsetsValue = totalValueOfrOldAsset0Quantity.plus(totalValueOfrOldAsset1Quantity)
                ILossPercent = 0
                if(_totalAmt < totalAsetsValue) {
                    const ILossInDollar = totalAsetsValue.minus(_totalAmt)
                    ILossPercent = ILossInDollar.multipliedBy(100).div(_totalAmt).toNumber()
                }
            }
            return {
                ROI, 
                token0AssetChange, 
                token1AssetChange, 
                convertUserLpToToken0, 
                convertUserLpToToken0PastTime, 
                convertUserLpToToken1, 
                convertUserLpToToken1PastTime,
                symbol0,
                symbol1,
                _totalAmt,
                ILossPercent
            }
        } catch (error) {
              
        }
    }, [])
  return { onROI: handleROI }
}
export default useROI
