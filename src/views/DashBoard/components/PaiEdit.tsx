import BigNumber from 'bignumber.js'
import React, { useCallback, useState, useEffect } from 'react'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import Label from '../../../components/Label'
import Spacer from '../../../components/Spacer'
import Input from '../../../components/Input'
import useROI from "../../../hooks/useROI"
import useROIGraph from "../../../hooks/useROIGraph"
import Calendar from 'react-calendar';
import {Line} from 'react-chartjs-2'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalTitle from '../../../components/ModalTitle'
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import Grid from '@material-ui/core/Grid';
import { getCurrentTimeSTamp } from "../../../utils/timestamp";

interface PairEditProps extends ModalProps {
  _pairAddress: string
  _pairName: string
}

const data = {
  labels: [],
  datasets: [
    {
      label: 'ROI Chart in percent',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: []
    }
  ]
}

const data2 = {
  labels: [],
  datasets: [
    {
      label: 'ROI Chart in dollars',
      backgroundColor: 'rgba(34,139,34,0.2)',
      borderColor: 'rgba(34,139,34,1)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(34,139,34,0.4)',
      hoverBorderColor: 'rgba(34,139,34,1)',
      data: []
    }
  ]
}
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 900,
    height: 550,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));

const PairEdit: React.FC<PairEditProps> = ({
  _pairAddress,
  _pairName,
  onDismiss,

}) => {
  const classes = useStyles();

  const [dataObj, setDataObj] = useState(Object)
  const [dataObj2, setDataObj2] = useState(Object)
  const [pairAddress, setPairAddress] = useState('')
  const [timeStamp, setTimeStamp] = useState('')
  const [date, setDate] = useState('')

  const [amount, setAmount] = useState('')
  const [value, onChange] = useState(new Date());
  const [_day, onClickDay] = useState(new Date());

  const [isCalendar, setCalendar] = useState(false)

  const [ROI, setROI] = useState('0')
  const [totalAmount, setYourTotalAmount] = useState('0')
  const [token0AssetChange, setToken0AssetChange] = useState('0')
  const [token1AssetChange, setToken1AssetChange] = useState('0')
  
  const [token0Old, setToken0Old] = useState('0')
  const [token1Old, setToken1Old] = useState('0')
  const [token0New, setToken0New] = useState('0')
  const [token1New, setToken1New] = useState('0')

  const [symbol0, setSymbol0] = useState('')
  const [symbol1, setSymbol1] = useState('')

  const {onROI} = useROI()
  const {onROIGraph} = useROIGraph()

  useEffect(() => {
    setAmount('10000')
    setPairAddress(_pairAddress)
  }, [_pairAddress])

  useEffect(() => {
    async function names() {
      //Get Current Timestamp
      const _currentTimeStamp = await getCurrentTimeSTamp()
      console.log('getCurrentTimeSTamp::', _currentTimeStamp)

      const times: number = _currentTimeStamp-7776000
      var day = new Date(times*1000).getDate()
      var month = new Date(times*1000).getMonth()
      var year = new Date(times*1000).getFullYear()
      setDate(day+'-'+(month+1)+'-'+year)
      const result = await onROI(_pairAddress, (_currentTimeStamp-7776000).toString(), '10000', _currentTimeStamp.toString())
      const _totalAmt = new BigNumber(10000).multipliedBy(new BigNumber(result.ROI).plus(100)).div(100)
      
      setROI(result.ROI.toPrecision(4).toString())
      setYourTotalAmount(result._totalAmt.toFormat(2).toString())
      setToken0AssetChange(result.token0AssetChange.toPrecision(4).toString())
      setToken1AssetChange(result.token1AssetChange.toPrecision(4).toString())
      setToken0New(result.convertUserLpToToken0.toPrecision(4).toString())
      setToken1New(result.convertUserLpToToken1.toPrecision(4).toString())
      setToken0Old(result.convertUserLpToToken0PastTime.toPrecision(4).toString())
      setToken1Old(result.convertUserLpToToken1PastTime.toPrecision(4).toString())

      setSymbol0(result.symbol0.toString())
      setSymbol1(result.symbol1.toString())
      const resultGraphData = await onROIGraph(_pairAddress, (_currentTimeStamp-7776000).toString(), '10000', _currentTimeStamp.toString())
      
      data.datasets[0].data = resultGraphData.dataPerecent
      data.labels = Array.from(Array(resultGraphData.slotCount.toNumber()).keys()).map(String)
      data2.datasets[0].data = resultGraphData.dataDollar
      data2.labels = Array.from(Array(resultGraphData.slotCount.toNumber()).keys()).map(String)
      setDataObj(data)
      setDataObj2(data2)
    }
    names()
  }, [_pairAddress])


  const handleSubmitChange = useCallback(async () => {
    try {
      //Get Current Timestamp
      const _currentTimeStamp = await getCurrentTimeSTamp()
      console.log('getCurrentTimeSTamp::', _currentTimeStamp)

      const result = await onROI(pairAddress, timeStamp, amount, _currentTimeStamp.toString())
      const _totalAmt = new BigNumber(amount).multipliedBy(new BigNumber(result.ROI).plus(100)).div(100)
      setROI(result.ROI.toPrecision(4).toString())
      setYourTotalAmount(result._totalAmt.toFormat(2).toString())
      setToken0AssetChange(result.token0AssetChange.toPrecision(4).toString())
      setToken1AssetChange(result.token1AssetChange.toPrecision(4).toString())
      setToken0New(result.convertUserLpToToken0.toFormat(4).toString())
      setToken1New(result.convertUserLpToToken1.toFormat(4).toString())
      setToken0Old(result.convertUserLpToToken0PastTime.toFormat(4).toString())
      setToken1Old(result.convertUserLpToToken1PastTime.toFormat(4).toString())
      setSymbol0(result.symbol0.toString())
      setSymbol1(result.symbol1.toString())
      const resultGraphData = await onROIGraph(pairAddress, timeStamp, amount, _currentTimeStamp.toString())
      data.datasets[0].data = resultGraphData.dataPerecent
      data.labels = Array.from(Array(resultGraphData.slotCount.toNumber()).keys()).map(String)
      data2.datasets[0].data = resultGraphData.dataDollar
      data2.labels = Array.from(Array(resultGraphData.slotCount.toNumber()).keys()).map(String)
      setDataObj(data)
      setDataObj2(data2)
    } catch (e) {
      console.log(e)
    }
  }, [onROI, onROIGraph, pairAddress, timeStamp, amount, symbol0, symbol1, token0Old, token0New, token1Old, token1New, dataObj, dataObj2])

  const handleChangeTimeStamp = useCallback(
    async (e: React.FormEvent<HTMLInputElement>) => {
      setTimeStamp(new BigNumber(e.currentTarget.value).toString())
      setDataObj({})
      setDataObj2({})
      setROI('0')
      setYourTotalAmount('0')
      setToken0AssetChange('0')
      setToken1AssetChange('0')
      setToken0New('0')
      setToken1New('0')
      setToken0Old('0')
      setToken1Old('0')
      setSymbol0('')
      setSymbol1('')
  },[timeStamp, setTimeStamp])

  const handleChangeAmount = useCallback(
    async (e: React.FormEvent<HTMLInputElement>) => {
      setAmount(new BigNumber(e.currentTarget.value).toString())
  },[amount, setAmount])

  const handleCalendar = useCallback(async () => {
    try {
      if(isCalendar){
        setCalendar(false)
      } else {
        setCalendar(true)
      }
    } catch {}
  }, [isCalendar])

  const onChanges = useCallback(
    async (value, event) => {

      setDate('')
      setDataObj({})
      setDataObj2({})
      setROI('0')
      setYourTotalAmount('0')
      setToken0AssetChange('0')
      setToken1AssetChange('0')
      setToken0New('0')
      setToken1New('0')
      setToken0Old('0')
      setToken1Old('0')
      setSymbol0('')
      setSymbol1('')

      // console.log(value, event)
      // value.setHours(0,0,0,0);
      // console.log((value.getTime()/1000) + 19800)
      // var _timeStamp: number = (value.getTime()/1000) + 19800
      // var day = value.getDate()
      // var month = value.getMonth()
      // var year = value.getFullYear()
      // setDate(day+'-'+(month+1)+'-'+year)
      // setTimeStamp(_timeStamp.toString())
      // setCalendar(false)

      value.toUTCString();
      var d2 = new Date( value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), value.getUTCHours(), value.getUTCMinutes(), value.getUTCSeconds() );
      d2.toUTCString();
      let choosenTime = Math.floor(d2.getTime() / 1000)
      if(choosenTime % 86400 != 0) {
        const remainder = choosenTime % 86400
        choosenTime = choosenTime - remainder
      }
      console.log("choosenTime:", choosenTime)
      var day = value.getDate()
      var month = value.getMonth()
      var year = value.getFullYear()
      setDate(day+'-'+(month+1)+'-'+year)
      setTimeStamp(choosenTime.toString())
      setCalendar(false)

  },[value])

  return (
    <>
      <Modal>
        <ModalTitle text={`Deposit ${_pairName} Tokens in Uniswap`} />
        <div className={classes.root}>
        <GridList cellHeight={180} className={classes.gridList}>
          <Grid item xs={6}>
          <Card>
            <CardContent>
              <Input
                onChange={handleChangeAmount}
                placeholder="Amount"
                value={amount}> </Input>
              <Spacer/>
              
              <Button text="Set Date" onClick={handleCalendar}> </Button>
                {isCalendar ? <Calendar
                  onChange={onChanges}
                  value={value}
                /> : '' }
              <Spacer/>

              <Input
                onChange={handleChangeTimeStamp}
                placeholder="dd-mm-yyyy"
                value={date}></Input>
              <Spacer/>
              <Button text="Submit" onClick={handleSubmitChange}> </Button>
            </CardContent>
            </Card>

            <Spacer/>
            <Label text={`ROI: +${ROI}%`}></Label>
            <Label text={`Total Amount: $${totalAmount}`}></Label>
            <Spacer/>
            <Label text={symbol0}></Label>
            <Label text={`Asset Change in percent: ${token0AssetChange}%`}></Label>
            <Label text={`Actual change in ${symbol0}: ${token0Old} to ${token0New}`}></Label>
            <Spacer/>
            <Label text={symbol1}></Label>
            <Label text={`Asset Change in percent: ${token1AssetChange}%`}></Label>
            <Label text={`Actual change ${symbol1}: ${token1Old} to ${token1New}`}></Label>         
            </Grid>
              <Grid item xs={6}>
              <Line
                  data={dataObj}
                  options={{
                      scales: {
                        yAxes: [{
                            stacked: true,
                            ticks: {
                              callback: function (value, index, values) {
                                return value + '%';
                              }
                            }
                        }
                      ],
                    }
                  }}
                />
                <Line
                  data={dataObj2}
                  options={{
                      scales: {
                        yAxes: [{
                            stacked: true,
                            ticks: {
                              callback: function (value, index, values) {
                                return '$' + value;
                              }
                            }
                        }
                      ],
                    }
                  }}
                />
            </Grid>
          </GridList>
        </div>
      </Modal>
    </>
  )
}

export default PairEdit
