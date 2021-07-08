import { useCallback } from 'react'
import { sushiswapForkClient } from "../external/Data/SushiswapForkClient";
import {
  SUSHI_TICKER_GET_ALL_MONTH
} from "../external/Data/Query";
import BigNumber from 'bignumber.js';

const useSushiROIGraph = () => {
    const handleROIGraph = useCallback(async (_pairAddress: string, time: string, amount:  string, currentTime: string) => {
        let dataPerecent = []
        let dataDollar = []

        const slotCount = new BigNumber(currentTime).minus(time).div(86400)
        let _time = new BigNumber(time)

        let result0 = await sushiswapForkClient.query({
            query: SUSHI_TICKER_GET_ALL_MONTH,
            variables: {
            pairAddress: _pairAddress,
            date: new BigNumber(_time).toNumber(),
            date2: new BigNumber(currentTime).plus(86400).toNumber(),
            firstData: slotCount.plus(1).toNumber()
            },
            fetchPolicy: "cache-first",
        });

        if (result0) {
            for (let i = 1; i <= slotCount.toNumber(); i++) {
                const convertUserAmountInLp = new BigNumber(amount).
                    multipliedBy(new BigNumber(result0.data.pairDayDatas[0].totalSupply)).
                    div(new BigNumber(result0.data.pairDayDatas[0].reserveUSD))

                const convertUserLptoCurrentPrice = new BigNumber(convertUserAmountInLp).
                    multipliedBy(new BigNumber(result0.data.pairDayDatas[i].reserveUSD)).
                    div(new BigNumber(result0.data.pairDayDatas[i].totalSupply))

                const ROI = new BigNumber(convertUserLptoCurrentPrice).
                    multipliedBy(new BigNumber(100)).
                    div(new BigNumber(amount)).minus(100)

                const _totalAmt = new BigNumber(amount).multipliedBy(new BigNumber(ROI).plus(100)).div(100)
                dataPerecent.push(ROI)
                dataDollar.push(_totalAmt)
            }
        }
        return {
            dataPerecent,
            dataDollar,
            slotCount
        }
    }, [])
  return { onSushiROIGraph: handleROIGraph }
}
export default useSushiROIGraph
