import { useCallback } from 'react'
import { uniswapClient } from "../external/Data/UniswapClient";
import {
    GET_UNI_PAIR_DATA
} from "../external/Data/Query";
import BigNumber from 'bignumber.js';
import { UNI_DATA } from "../constants/constants";
const useHome = () => {
    const handleHome = useCallback(async () => {
    let liq = []
    const rows = UNI_DATA
    await rows.map(async (pairRow, i) => {
        const result = await uniswapClient.query({
            query: GET_UNI_PAIR_DATA,
            variables: {
            id: pairRow[0].pairAddress
            },
            fetchPolicy: "cache-first",
        });
        liq.push(result.data.pairs[0].reserveUSD)
        console.log('Result++', liq)
        })
        return {
            liq
        }
    }, [])
  return { onHome: handleHome }
}
export default useHome
