import React from 'react'
import styled, { keyframes } from 'styled-components'
import PairingCard  from "./PairingCard"

const data = [
    [
        {
            pairAddress : "0x06da0fd433c1a5d7a4faa01111c044910a184553",
            pairName: "ETH-USDT"
        }
    ],
    [
        {
            pairAddress : "0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f",
            pairName: "ETH-DAI"
        }
    ],
    [
        {
            pairAddress : "0x397ff1542f962076d0bfe58ea045ffa2d347aca0",
            pairName: "ETH-USDC"
        }
    ],
    [
        {
            pairAddress : "0xceff51756c56ceffca006cd410b03ffc46dd3a58",
            pairName: "ETH-WBTC"
        }
    ],
    [
        {
            pairAddress : "0xdafd66636e2561b0284edde37e42d192f2844d40",
            pairName: "ETH-UNI"
        }
    ],
    [
        {
            pairAddress : "0xc40d16476380e4037e6b1a2594caf6a6cc8da967",
            pairName: "ETH-LINK"
        }
    ],
    // [
    //     {
    //         pairAddress : "",
    //         pairName: "USDT-USDC"
    //     }
    // ]
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
