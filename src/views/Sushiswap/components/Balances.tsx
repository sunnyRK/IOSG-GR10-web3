import BigNumber from 'bignumber.js'
import React, { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import Label from '../../../components/Label'
import Spacer from '../../../components/Spacer'
import Input from '../../../components/Input'
import useSushiROI from "../../../hooks/useSushiROI"
import useSushiROIGraph from "../../../hooks/useSushiROIGraph"
import Calendar from 'react-calendar'
import {Line} from 'react-chartjs-2'
import Value from '../../../components/Value'
import { sushiswapForkClient2 } from "../../../external/Data/sushiswapClient2"
import { masterChefClient } from "../../../external/Data/MasterChefClient"
import { getCurrentTimeSTamp } from "../../../utils/timestamp";
import { getCalculate } from "../../../utils/calculateDetails";
import { 
  SUSHI_GET_DERIVED_ETH,
  SUSHI_GET_POOL_INFO,
  SUSHI_GET_REWARD_POOLS,
  SUSHI_GET_TOTAL_ALLOC,
  SUSHI_GET_REWARD_POOLS_BY_PAIR
 } from "../../../external/Data/Query";
import sushiswap from "../../../assets/img/sushiswap.png";
import eth from "../../../assets/img/ETH.svg";
import usdt from "../../../assets/img/USDT.png";
import dai from "../../../assets/img/DAI.svg"
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import { Box } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem';
 
 const tagOptions = [
   {
       name: 'ETH-USDT',
       text: (
         <AvatarGroup max={3}>
           <Avatar alt="Remy Sharp" src={sushiswap} />
           <Avatar alt="Remy Sharp" src={eth} />
           <Avatar alt="Travis Howard" src={usdt} />
         </AvatarGroup>
         ),
       value: '0x06da0fd433c1a5d7a4faa01111c044910a184553',
   },{
       name: 'ETH-DAI',
       text: (
         <AvatarGroup max={3}>
           <Avatar alt="Remy Sharp" src={sushiswap} />
           <Avatar alt="Remy Sharp" src={eth} />
           <Avatar alt="Travis Howard" src={dai} />
       </AvatarGroup>
         ),
       value: '0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f',
   }
 ]

 const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: '100%',
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);

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

const Balances: React.FC = () => {

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
  const [Iloss, setILoss] = useState('0')
  const [totalAmount, setYourTotalAmount] = useState('0')
  const [token0AssetChange, setToken0AssetChange] = useState('0')
  const [token1AssetChange, setToken1AssetChange] = useState('0')
  const [sushiReward, setSushiReward] = useState('0')

  const [token0Old, setToken0Old] = useState('0')
  const [token1Old, setToken1Old] = useState('0')
  const [token0New, setToken0New] = useState('0')
  const [token1New, setToken1New] = useState('0')

  const [symbol0, setSymbol0] = useState('')
  const [symbol1, setSymbol1] = useState('')

  const {onSushiROI} = useSushiROI()
  const {onSushiROIGraph} = useSushiROIGraph()

  
  const handleChangeDropDown = (event: React.ChangeEvent<{ value: unknown }>) => {
    console.log('dropdown::', event.target.value)
    setPairAddress(event.target.value.toString())
  };

  async function fetchSushi(pairAddress) {
    const blocksPerDay = 6500;

    const sushi = await sushiswapForkClient2.query({
      query: SUSHI_GET_DERIVED_ETH,
      variables: {
        id: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2'
      },
      fetchPolicy: "cache-first",
    });
  
    const derivedETH = sushi.data.token.derivedETH;
    
    const poolResult = await masterChefClient.query({
      query: SUSHI_GET_REWARD_POOLS_BY_PAIR,
      variables: {
        pairAddress: pairAddress
      },
      fetchPolicy: "cache-first",
    });

    const pools = poolResult.data.pools;
    console.log("POOLS: +++ ", pools)

    const allocResult = await masterChefClient.query({
      query: SUSHI_GET_TOTAL_ALLOC,
      fetchPolicy: "cache-first",
    });
    console.log("allocResult: +++ ", allocResult)

    const totalAlloc = allocResult.data.masterChefs[0].totalAllocPoint;
    console.log("totalAlloc: +++ ", totalAlloc)

    let pool30ROI = {};
      const poolInfo = await sushiswapForkClient2.query({
        query: SUSHI_GET_POOL_INFO,
        variables: {
          id: pools[0].pair,
        },
        fetchPolicy: "cache-first",
      });

      if (poolInfo.data.pair != null) {
        let totalSupply = poolInfo.data.pair.totalSupply;
        let totalValueETH = poolInfo.data.pair.reserveETH;
        let sushiPerBlock = 100 - 100 * (pools[0].allocPoint / totalAlloc);

        let thirtyDayROI =
          (100 *
            (derivedETH *
              blocksPerDay *
              sushiPerBlock *
              3 *
              1 * (pools[0].allocPoint / totalAlloc))) 
              / (totalValueETH * (pools[0].slpBalance / totalSupply));

        pool30ROI[pools[0].pair] = thirtyDayROI;
        return thirtyDayROI 
      } 
      return 0
  }
  
  const handleSubmitChange = useCallback(async () => {
    try {
      //Get Current Timestamp
      const _currentTimeStamp = await getCurrentTimeSTamp()
      console.log('getCurrentTimeSTamp::', _currentTimeStamp)

      const result = await onSushiROI(pairAddress, timeStamp, amount, (_currentTimeStamp).toString())
      setROI(result.ROI.toPrecision(4).toString())
      setILoss(result.ILossPercent.toPrecision(6).toString())
      setYourTotalAmount(result._totalAmt.toFormat(2).toString())
      setToken0AssetChange(result.token0AssetChange.toPrecision(4).toString())
      setToken1AssetChange(result.token1AssetChange.toPrecision(4).toString())
      setToken0New(result.convertUserLpToToken0.toFormat(4).toString())
      setToken1New(result.convertUserLpToToken1.toFormat(4).toString())
      setToken0Old(result.convertUserLpToToken0PastTime.toFormat(4).toString())
      setToken1Old(result.convertUserLpToToken1PastTime.toFormat(4).toString())
      setSymbol0(result.symbol0.toString())
      setSymbol1(result.symbol1.toString())
      setSushiReward('Wait...')

      const resultGraphData = await onSushiROIGraph(pairAddress, timeStamp, amount, _currentTimeStamp.toString())
      
      data.datasets[0].data = resultGraphData.dataPerecent
      data.labels = Array.from(Array(resultGraphData.slotCount.toNumber()).keys()).map(String)

      data2.datasets[0].data = resultGraphData.dataDollar
      data2.labels = Array.from(Array(resultGraphData.slotCount.toNumber()).keys()).map(String)

      setDataObj(data)
      setDataObj2(data2)
      const sushiRewards = await fetchSushi(pairAddress)
      setSushiReward(sushiRewards.toPrecision(4).toString())
    } catch (e) {
      console.log(e)
    }
  }, [onSushiROI, onSushiROIGraph, pairAddress, timeStamp, amount, symbol0, symbol1, token0Old, token0New, token1Old, token1New, dataObj, dataObj2, Iloss])

  // async function round(value, decimals) {
  //   return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
  // }

  const handleChangePairAddress = useCallback(
    async (e: React.FormEvent<HTMLInputElement>) => {
      setPairAddress(e.currentTarget.value)
  },[pairAddress, setPairAddress])

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
    } catch {

    }
  }, [isCalendar])

  const onChangesCalendar = useCallback(
    async (value, event) => {

      setDate('')
      setDataObj({})
      setDataObj2({})
      setROI('0')
      setILoss('0')
      setYourTotalAmount('0')
      setToken0AssetChange('0')
      setToken1AssetChange('0')
      setToken0New('0')
      setToken1New('0')
      setToken0Old('0')
      setToken1Old('0')
      setSymbol0('')
      setSymbol1('')

      
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
    <div style={{"marginLeft": "200px"}}>
    <StyledWrapper>
      <Card>
        <CardContent>
          <StyledBalances>
            <StyledBalance>
              <Spacer />
              <div style={{ flex: 1 }}>
                <div style={{  "display" : "flex" }}>
                  <Avatar alt="Remy Sharp" src={sushiswap} />
                  <Spacer/>
                  <Label text="Calculate ROI And Asset Change in Sushiswap" />
                </div>

                <Spacer/>

                <Box width={1}>
                <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-native-simple">PairADdress</InputLabel>
                  <Select 
                    labelId="label" 
                    id="select" 
                    onChange={handleChangeDropDown}
                    inputProps={{
                      name: 'age',
                      id: 'age-native-simple',
                    }}>
                      {tagOptions.map((option, i) => {
                        return(
                          <MenuItem value={option.value}>{option.text}</MenuItem>
                        )
                      })}
                  </Select>
                </FormControl>
                </Box>


                <Spacer/>
                <Input
                  onChange={handleChangePairAddress}
                  placeholder="PairAddress"
                  value={pairAddress}> </Input>
                  <Spacer/>

                <StyledCardContentInner>
                  <StyledCardActions>
                    <Input
                      onChange={handleChangeTimeStamp}
                      placeholder="dd-mm-yyyy"
                      value={date}></Input>
                      <Spacer/>
                    <Button text="Set Date" onClick={handleCalendar}> </Button>
                  </StyledCardActions>
                </StyledCardContentInner>

                {isCalendar ? <Calendar
                  onChange={onChangesCalendar}
                  value={value}
                /> : '' }
 
                <Spacer/>
                <Input
                  onChange={handleChangeAmount}
                  placeholder="Amount"
                  value={amount}> </Input>
                <Spacer/>
                <Button text="Submit" onClick={handleSubmitChange}> </Button>
                <Spacer/>
              
          <Card>
            <CardContent>
                <Value value={`ROI: +${ROI}%`}></Value>
                <Value value={`Sushi Reward: ${sushiReward} %`}></Value>

                <Value value={`Total Amount: $${totalAmount}`}></Value>
                <Value value={`Impermanent Loss: -${Iloss}%`}></Value>

                <Spacer/>
                <Label text={symbol0}></Label>
                <Label text={`Asset Change in percent: ${token0AssetChange}%`}></Label>
                <Label text={`Actual change in ${symbol0}: ${token0Old} to ${token0New}`}></Label>

                <Spacer/>
                <Label text={symbol1}></Label>
                <Label text={`Asset Change in percent: ${token1AssetChange}%`}></Label>
                <Label text={`Actual change ${symbol1}: ${token1Old} to ${token1New}`}></Label>
              </CardContent>
            </Card>
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
              </div>
            </StyledBalance>
          </StyledBalances>
        </CardContent>
      </Card>
    </StyledWrapper>
    </div>
  )
}

const StyledWrapper = styled.div`
  align-items: center;
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: stretch;
  }
`
const StyledBalances = styled.div`
  display: flex;
`
const StyledBalance = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
`
const StyledCardActions = styled.div`
display: flex;
justify-content: center;
margin-top: ${(props) => props.theme.spacing[2]}px;
margin-left: '100px';
width: 100%;
`
const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`
export default Balances
