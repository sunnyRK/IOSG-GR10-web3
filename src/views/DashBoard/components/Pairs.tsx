import React from 'react'
import styled, { keyframes } from 'styled-components'
import PairingCard  from "./PairingCard"

const data = [
    [
        {
            pairAddress : "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852",
            pairName: "ETH-USDT"
        }
    ],
    [
        {
            pairAddress : "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11",
            pairName: "ETH-DAI"
        }
    ],
    [
        {
            pairAddress : "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc",
            pairName: "ETH-USDC"
        }
    ],
    [
        {
            pairAddress : "0xbb2b8038a1640196fbe3e38816f3e67cba72d940",
            pairName: "ETH-WBTC"
        }
    ],
    [
        {
            pairAddress : "0xd3d2e2692501a5c9ca623199d38826e513033a17",
            pairName: "ETH-UNI"
        }
    ],
    [
        {
            pairAddress : "0xa2107fa5b38d9bbd2c461d6edf11b11a50f6b974",
            pairName: "ETH-LINK"
        }
    ],
    [
        {
            pairAddress : "0x3041cbd36888becc7bbcbc0045e3b1f144466f5f",
            pairName: "USDT-USDC"
        }
    ]
]

const Pairs: React.FC = () => {
  const rows = data
  return (
    <StyledCards>
        {rows.map((pairRow, i) => (
          <StyledRow key={i}>
                <PairCarding pair={pairRow} />
          </StyledRow>
        ))}
    </StyledCards>
  )
}

interface PairCradProps {
    pair: {}
}
  
const PairCarding: React.FC<PairCradProps> = ({ pair }) => {
  return (
    <StyledCardWrapper>
      <PairingCard pairName={pair[0].pairName} pairAddress={pair[0].pairAddress} />
    </StyledCardWrapper>
  )
}

const StyledCards = styled.div`
width: 900px;
@media (max-width: 768px) {
  width: 100%;
}
`
const StyledRow = styled.div`
display: flex;
margin-bottom: ${(props) => props.theme.spacing[4]}px;
flex-flow: row wrap;
@media (max-width: 768px) {
  width: 100%;
  flex-flow: column nowrap;
  align-items: center;
}
`
const StyledCardWrapper = styled.div`
display: flex;
width: calc((900px - ${(props) => props.theme.spacing[4]}px * 2) / 3);
position: relative;
`

export default Pairs
