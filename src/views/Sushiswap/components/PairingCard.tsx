import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import BigNumber from 'bignumber.js'
import useSushiROI from "../../../hooks/useSushiROI"
import PaiEdit from './PaiEdit'
import useModal from '../../../hooks/useModal'
import Spacer from '../../../components/Spacer'
import Label from '../../../components/Label'
import { getCurrentTimeSTamp } from "../../../utils/timestamp";

interface PairProps {
  pairName: string
  pairAddress: string
}

const PairingCard: React.FC<PairProps> = ({ pairName, pairAddress }) => {
  
    const {onSushiROI} = useSushiROI()
    const [ROI, setROI] = useState('0')
    const [totalAmount, setYourTotalAmount] = useState('0')

    const [onPresentDeposit] = useModal(
      <PaiEdit
          _pairAddress={pairAddress}
          _pairName={pairName}
      />,
    )      
  
    useEffect(() => {
      async function names() {
        try {
          //Get Current Timestamp
          const _currentTimeStamp = await getCurrentTimeSTamp()
          console.log('getCurrentTimeSTamp::', _currentTimeStamp)

          const result = await onSushiROI(pairAddress, (_currentTimeStamp-7776000).toString(), '10000', _currentTimeStamp.toString())
          const _totalAmt = new BigNumber(10000).multipliedBy(new BigNumber(result.ROI).plus(100)).div(100)
          setROI(result.ROI.toPrecision(4).toString())
          setYourTotalAmount(new BigNumber(_totalAmt).toFormat(2).toString())
        } catch (error) {}
      }
      names()
    }, [pairAddress])
    
    return (
      <Card>
        <CardContent>
            <Label text={'For last 3 months'}></Label>
            <Label text={pairName}></Label>
            <Label text={`ROI: +${ROI}%`}></Label>
            <Label text={`Total Amount: $${totalAmount}`}></Label>
            <Spacer/>
            <Button
              text="Change"
              onClick={onPresentDeposit}
            />
        </CardContent>
      </Card>
    )
  }

const StyledTitle = styled.h4`
  color: ${(props) => props.theme.color.grey[600]};
  font-size: 24px;
  font-weight: 700;
  margin: ${(props) => props.theme.spacing[2]}px 0 0;
  padding: 0;
`

export default PairingCard
