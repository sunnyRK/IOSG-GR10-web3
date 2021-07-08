import BigNumber from 'bignumber.js'
import React, { useState, useCallback, useEffect } from 'react'
import useROI from "../../../hooks/useROI"
import useROIGraph from "../../../hooks/useROIGraph"
import useSushiROI from "../../../hooks/useSushiROI"
import useSushiROIGraph from "../../../hooks/useSushiROIGraph"

import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import {Line} from 'react-chartjs-2'
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Label from '../../../components/Label'
import Spacer from '../../../components/Spacer'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Divider from '@material-ui/core/Divider';
import { uniswapClient } from "../../../external/Data/UniswapClient";
import { sushiswapForkClient2 } from "../../../external/Data/sushiswapClient2";
import { sushiswapForkClient } from "../../../external/Data/SushiswapForkClient";
import { masterChefClient } from "../../../external/Data/MasterChefClient"
import { getCurrentTimeSTamp } from "../../../utils/timestamp";
import uniswap from "../../../assets/img/uniswap.png";
import sushiswap from "../../../assets/img/sushiswap.png";
import {
  UNI_TICKER_GET_MONTH_FOR_FEES,
  SUSHI_TICKER_GET_MONTH_FOR_FEES,
  GET_UNI_PAIR_DATA_24HOUR,
  GET_SUSHI_PAIR_DATA_24HOUR,
  SUSHI_GET_DERIVED_ETH,
  SUSHI_GET_POOL_INFO,
  SUSHI_GET_TOTAL_ALLOC,
  SUSHI_GET_REWARD_POOLS_BY_PAIR
} from "../../../external/Data/Query";
import { UNI_DATA, SUSHI_DATA } from "../../../constants/constants";
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Grid, { GridSpacing } from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Calendar from 'react-calendar';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import Modal, { ModalProps } from '../../../components/Modal'
import ModalTitle from '../../../components/ModalTitle' 

interface SliderProps {
  pairAddress: string
  platform: string
  children: any
  expandComponent: any
  otherProps?: any
}

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

  const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      overflowX: 'auto'
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    container: {
      // maxHeight: 440,
    },
    root2: {
      flexGrow: 1,
    },
    paper: {
      height: 160,
      width: 100,
    },
    control: {
      padding: theme.spacing(2),
    },
    paper2: {
      padding: theme.spacing(2),
      margin: 'auto',
    },
    image: {
      width: 200,
      height: 300,
    },
    root3: {
      minWidth: 275,
      margin:'20px'
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    margin: {
      margin: theme.spacing(1),
    },
    buttonMargin: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "50px"
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: '25ch',
    },
  })
);

  const Slider: React.FC<SliderProps> = ({
    pairAddress, platform, children, expandComponent, ...otherProps
  }) => {    
  
    console.log('Children++', pairAddress)

    const classes = useStyles();

  const [isExpanded, setIsExpanded] = React.useState(false);
  const [spacing, setSpacing] = React.useState<GridSpacing>(2);

  const [dataObj, setDataObj] = useState(Object)
  const [dataObj2, setDataObj2] = useState(Object)
  // const [pairAddress, setPairAddress] = useState('0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852')
  const [timeStamp, setTimeStamp] = useState('')
  const [date, setDate] = useState('')

  const [amount, setAmount] = useState('10000')
  const [value, onChange] = useState(new Date());
  const [_day, onClickDay] = useState(new Date());

  const [isCalendar, setCalendar] = useState(false)

  const [ROI, setROI] = useState('0')
  const [Iloss, setILoss] = useState('0')
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

  const {onSushiROI} = useSushiROI()
  const {onSushiROIGraph} = useSushiROIGraph()

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
      console.log('pairAddress', pairAddress)

      let result, _totalAmt;
      if(platform == "uniswap") {
        result = await onROI(pairAddress, (_currentTimeStamp-7776000).toString(), '10000', _currentTimeStamp.toString())
        _totalAmt = new BigNumber(10000).multipliedBy(new BigNumber(result.ROI).plus(100)).div(100)
      } else if(platform == "sushiswap") {
        result = await onSushiROI(pairAddress, (_currentTimeStamp-7776000).toString(), '10000', _currentTimeStamp.toString())
        _totalAmt = new BigNumber(10000).multipliedBy(new BigNumber(result.ROI).plus(100)).div(100)
      }
      
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

      let resultGraphData
      if(platform == 'uniswap') {
        resultGraphData = await onROIGraph(pairAddress, (_currentTimeStamp-7776000).toString(), '10000', _currentTimeStamp.toString())
      } else if(platform == 'sushiswap') {
        resultGraphData = await onSushiROIGraph(pairAddress, (_currentTimeStamp-7776000).toString(), '10000', _currentTimeStamp.toString())
      }
      
      data.datasets[0].data = resultGraphData.dataPerecent
      data.labels = Array.from(Array(resultGraphData.slotCount.toNumber()).keys()).map(String)
      data2.datasets[0].data = resultGraphData.dataDollar
      data2.labels = Array.from(Array(resultGraphData.slotCount.toNumber()).keys()).map(String)
      setDataObj(data)
      setDataObj2(data2)
    }
    if(pairAddress!='') {
      names()
    }
  }, [pairAddress])

  const handleSubmitChange = useCallback(async () => {
    try {
      //Get Current Timestamp
      const _currentTimeStamp = await getCurrentTimeSTamp()
      console.log('getCurrentTimeSTamp::', _currentTimeStamp)

      const result = await onROI(pairAddress, timeStamp, amount, (_currentTimeStamp).toString())
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
  }, [onROI, onROIGraph, pairAddress, timeStamp, amount, symbol0, symbol1, token0Old, token0New, token1Old, token1New, dataObj, dataObj2, Iloss])

  // const handleChangePairAddress = useCallback(
  //   async (e: React.FormEvent<HTMLInputElement>) => {
  //     setPairAddress(e.currentTarget.value)
  // },[pairAddress, setPairAddress])

  const handleChangeTimeStamp = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.currentTarget.value != '') {
        console.log('(e.currentTarget.value)', (e.currentTarget.value))
        setTimeStamp(new BigNumber(e.currentTarget.value).toString())
      } else {
        console.log('(e.currentTarget.value)', (e.currentTarget.value))
        setTimeStamp(new BigNumber(0).toString())
      }
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
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.currentTarget.value != '') {
        console.log('(e.currentTarget.value)', (e.currentTarget.value))
        setAmount(new BigNumber(e.currentTarget.value).toString())
      } else {
        console.log('(e.currentTarget.value)', (e.currentTarget.value))
        setAmount(new BigNumber(0).toString())
      }
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
      <>
        <TableRow {...otherProps}>
          <TableCell padding="checkbox">
            <IconButton onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          {children}
        </TableRow>
        {isExpanded && (
          <TableRow>
            <TableCell padding="checkbox" />
            <TableCell colSpan={7}>
              <div className={classes.root2}>
                <Paper className={classes.paper2}>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Grid item container direction="column" spacing={2} xs={12}>
                        <div>
                          <FormControl fullWidth className={classes.margin} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                            <OutlinedInput
                              id="outlined-adornment-amount"
                              value={new BigNumber(amount)}
                              onChange={handleChangeAmount}
                              startAdornment={<InputAdornment position="start">$</InputAdornment>}
                              labelWidth={60}
                            />
                          </FormControl>
                          <Grid container spacing={2}>
                          <Grid item xs={1}>
                            <CalendarTodayIcon style={{ fontSize: 30, marginTop: 20, marginLeft: 10 }} onClick={handleCalendar}>Date</CalendarTodayIcon>
                          </Grid>
                          <Grid item xs={11}>
                            <FormControl fullWidth className={classes.margin} variant="outlined">
                              <InputLabel htmlFor="outlined-adornment-amount">Date</InputLabel>
                              <OutlinedInput
                                id="outlined-adornment-amount"
                                value={date}
                                onChange={handleChangeTimeStamp}
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                labelWidth={60}
                              />
                            </FormControl>
                          </Grid> 
                            
                          </Grid>
                          {isCalendar ? <Calendar
                              onChange={onChangesCalendar}
                              value={value}
                            /> : '' }

                        <Spacer/>
                        <div className={classes.buttonMargin}>
                          <Button variant="contained" color="primary" onClick={handleSubmitChange}>
                            Submit
                          </Button>
                        </div>
                        <div className={classes.buttonMargin} style={{'marginTop': "100px",}}>

                        <Card variant="outlined" style={{width: "70%", "backgroundColor": "#00bcd4", "color" : "#fff"}}>
                        <CardContent>
                          <Typography className={classes.title} color="textSecondary" gutterBottom>
                          Info:
                          </Typography>
                          <Typography variant="body1" component="h2">
                            Select date and amount to analyze the historical data of the underlying token Pair
                          </Typography>
                        </CardContent>
                      </Card></div>

                      </div>
                    </Grid>
                  </Grid>

                  <Divider orientation="vertical" flexItem />

                  <Grid item xs={4} style={{'padding': "10px"}}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                       <Card variant="outlined" style={{'marginTop': "20px"}}>
                      <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                        ROI(30D)
                        </Typography>
                        <Typography variant="body1" component="h2">
                          {ROI}
                        </Typography>
                      </CardContent>
                    </Card>
                    <Card  variant="outlined" style={{'marginTop': "20px"}}>
                      <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                        {symbol0} Asset Change in percent
                        </Typography>
                        <Typography variant="body1" component="h2">
                          {token0AssetChange}%
                        </Typography>
                      </CardContent>
                    </Card>
                    <Card variant="outlined" style={{'marginTop': "20px"}}>
                      <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                        {symbol1} Asset Change in percent
                        </Typography>
                        <Typography variant="body1" component="h2">
                        {token1AssetChange}%
                        </Typography>
                      </CardContent>
                    </Card>
                    </Grid> 
                      <Grid item xs={6}>
                      <Card variant="outlined" style={{'marginTop': "20px"}}>
                      <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Total Amount
                        </Typography>
                        <Typography variant="body1" component="h2">
                          {totalAmount}
                        </Typography>
                      </CardContent>
                    </Card>
                    
                    <Card variant="outlined" style={{'marginTop': "20px"}}>
                      <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Actual change in {symbol0}
                        </Typography>
                        <Typography variant="body1" component="h2">
                        {token0Old} to {token0New}
                        </Typography>
                      </CardContent>
                    </Card>
                    <Card variant="outlined" style={{'marginTop': "20px"}}>
                      <CardContent>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Actual change {symbol1}
                        </Typography>
                        <Typography variant="body1" component="h2">
                        {token1Old} to {token1New}
                        </Typography>
                      </CardContent> 
                    </Card>
                    
                    </Grid> 
                    </Grid>
                  </Grid>

                  <Divider orientation="vertical" flexItem />

                  <Grid item container direction="column" spacing={2} xs={4}>
                    <Grid item xs>
                    <Line
                      data={data}
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
                    </Grid>
                    <div style={{'marginLeft':'10px'}}>
                    <Divider  />
                    </div>

                    <Grid>
                    <Line
                      data={data2}
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
                    </Grid>
                  </Grid>
                  </Grid>
                </Paper>
              </div>
            </TableCell>
          </TableRow>
        )}
      </>
    );
  };

  export default Slider

