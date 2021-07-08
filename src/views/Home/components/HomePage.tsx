import BigNumber from 'bignumber.js'
import React, { useState, useCallback, useEffect } from 'react'
import useROI from "../../../hooks/useROI"
import useSushiROI from "../../../hooks/useSushiROI"
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import {Line} from 'react-chartjs-2'
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
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
import Slider from "./Slider";
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
      data: [10,20,30,40,50,60]
    }
  ]
}

interface Column {
  id: 'name' | 'liquidity' | 'tradedvolume' | 'fees' | 'roi1' | 'roi2' | 'roi3' | 'sushiroi1' | 'sushiroi2' | 'sushiroi3';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'name', label: 'Pool Name Uniswap', minWidth: 170 },
  { id: 'liquidity', label: 'Total Liquidity', minWidth: 100 },
  { id: 'tradedvolume', label: '24H Volume', minWidth: 100 },
  { id: 'fees', label: 'Swap fees(24H)', minWidth: 100 },
  { id: 'roi1', label: 'ROI(Last 24H)', minWidth: 100 },
  { id: 'roi2', label: 'ROI(Last 7D)', minWidth: 100 },
  { id: 'roi3', label: 'ROI(Last 30D)', minWidth: 100 },
];

const columnsSushi: Column[] = [
  { id: 'name', label: 'Pool Name Sushiswap', minWidth: 170 },
  { id: 'liquidity', label: 'Total Liquidity', minWidth: 100 },
  { id: 'tradedvolume', label: '24H Volume', minWidth: 100 },
  { id: 'fees', label: 'Swap fees(24H)', minWidth: 100 },
  { id: 'roi1', label: 'ROI(Last 24H)', minWidth: 100 },
  { id: 'roi2', label: 'ROI(Last 7D)', minWidth: 100 },
  { id: 'roi3', label: 'ROI(Last 30D)', minWidth: 100 },
];

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: '#3b3a39',
      color: theme.palette.common.white,

    },
    body: {
      fontSize: 14,
    },
  }),
)(TableCell);

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
    }
  })
);


const useStyles2 = makeStyles({
  root: {
    width: '100%',
    overflowX: 'auto'
  },
  table: {
    minWidth: 650
  }
});


const HomePage: React.FC = () => {
  // let uniCount = 0
  // let sushiCount = 0

  const classes = useStyles();
  const classes2 = useStyles2();
  const bull = <span className={classes.bullet}>•</span>;
  let liq = []

  const [dataObj, setDataObj] = useState(Object)
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isExpanded, setIsExpanded] = useState(true)
  const [spacing, setSpacing] = React.useState<GridSpacing>(2);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSpacing(Number((event.target as HTMLInputElement).value) as GridSpacing);
  };

  const handleChangePageUNI = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPageUNI = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePageSUSHI = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPageSUSHI = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [totalLiquidityState, setTotalLiquidity] = React.useState([]);
  const [totalLiquidityStateSushiSwap, setTotalLiquiditySushiswap] = React.useState([]);
  const [totalPlatforms, seTotalPlatforms] = React.useState([]);

  // const [nameArrayUni, setNameArrayUni] = React.useState([]);
  // const [nameArraySushi, setNameArraySushi] = React.useState([]);

  const [isUniProgress, setUniProgress] = useState(true)
  const [isShushiProgress, setSushiProgress] = useState(true)

  const { onROI } = useROI()
  const { onSushiROI } = useSushiROI()


  // Uniswap
  useEffect(() => {
    async function process() {
      try {
        // let liq = []
        let datas = []
        let resultROI
        // let tempNameArray = []
        const rows = UNI_DATA
        for (var i = 0; i < rows.length; i++) {

          //Get Current Timestamp
          const _currentTimeStamp = await getCurrentTimeSTamp()
          console.log('getCurrentTimeSTamp::', _currentTimeStamp)

          // // Total Liquidity 
          const result = await uniswapClient.query({
            query: GET_UNI_PAIR_DATA_24HOUR,
            variables: {
              pairAddress: rows[i].pairAddress,
              date: _currentTimeStamp - 86400
            },
            fetchPolicy: "cache-first",
          });

          // ROI 24 Hours - 7 days- 30 days
          const roiObj = []
          const timeSpanROI = [86400, 604800, 2592000]
          for (var j = 0; j < 3; j++) {
            resultROI = await onROI(rows[i].pairAddress, (_currentTimeStamp - timeSpanROI[j]).toString(), '10000', (_currentTimeStamp).toString())
            if (resultROI) {
              roiObj.push(resultROI.ROI.toString())
            } else {
              roiObj.push('0')
            }
          }

          // Swap Fees
          let monthlyAverageLiquidity = 0.0;
          let monthlyAverageVolume = 0.0;
          let dayCount = 0.0;

          const previousMonthData = await uniswapClient.query({
            query: UNI_TICKER_GET_MONTH_FOR_FEES,
            variables: {
              id: rows[i].pairAddress,
              date: _currentTimeStamp - 86400, // 1 day ago swap fees
            },
            fetchPolicy: "cache-first",
          });

          let previousMonth = previousMonthData.data.pairDayDatas;
          previousMonth.forEach((element) => {
            dayCount += 1.0;
            monthlyAverageLiquidity =
              monthlyAverageLiquidity +
              (element.reserveUSD - monthlyAverageLiquidity) / dayCount;
            monthlyAverageVolume =
              monthlyAverageVolume +
              (element.dailyVolumeUSD - monthlyAverageVolume) / dayCount;
          });
          let returns = (monthlyAverageVolume * 0.003 * 1)
          // / monthlyAverageLiquidity) * 100 

          // const swapingFees = new BigNumber(result.data.pairDayDatas[0].dailyVolumeUSD).multipliedBy(0.003)
          // console.log('swapingFees+++', swapingFees.toString(), returns)

          // Total Above Details in object
          datas = [{
            'name': rows[i].pairName,
            'liquidity': '$ ' + new BigNumber(result.data.pairDayDatas[0].reserveUSD).toFormat(0),
            'tradedvolume': '$ ' + new BigNumber(result.data.pairDayDatas[0].dailyVolumeUSD).toFormat(0),
            'fees': '$ ' + new BigNumber(returns).toFormat(0).toString(),
            'roi1': new BigNumber(roiObj[0]).toFormat(6) + ' %',
            'roi2': new BigNumber(roiObj[1]).toFormat(6) + ' %',
            'roi3': new BigNumber(roiObj[2]).toFormat(6) + ' %',
            'icon': uniswap,
            'pairAddress' : rows[i].pairAddress,
            'platform' : 'uniswap'
          }]

          // Add object into object array  
          liq.push(datas)
        }
        // Add object array into array for table
        setTotalLiquidity(liq)
        setUniProgress(false)
        // setNameArrayUni(tempNameArray)
      } catch (error) {
        console.log('error++', error)
      }
    }
    process()
  }, [])

  // Sushiswap
  useEffect(() => {
    async function process() {
      try {
        // let liq = []
        let datas = []
        // let tempNameArray = []
        const rows = SUSHI_DATA
        for (var i = 0; i < rows.length; i++) {
          let resultROI

          //Get Current Timestamp
          const _currentTimeStamp = await getCurrentTimeSTamp()
          console.log('getCurrentTimeSTamp::', _currentTimeStamp)

          // Total Liquidity Sushiswap
          const result = await sushiswapForkClient.query({
            query: GET_SUSHI_PAIR_DATA_24HOUR,
            variables: {
              pairAddress: rows[i].pairAddress,
              date: _currentTimeStamp - 86400
            },
            fetchPolicy: "cache-first",
          });

          // ROI 24hours- 7 days- 30 days Sushiswap
          const roiObj = []
          const sushiRoiObj = []
          const timeSpanROI = [86400, 604800, 2592000]

          for (var j = 0; j < 3; j++) {
            resultROI = await onSushiROI(rows[i].pairAddress, (_currentTimeStamp - timeSpanROI[j]).toString(), '10000', (_currentTimeStamp).toString())
            if (resultROI) {
              roiObj.push(resultROI.ROI.toString())
              // sushirewards sushi token
              const sushiRewards = await fetchSushi(rows[i].pairAddress, timeSpanROI[j] / 86400)
              sushiRoiObj.push(sushiRewards.toString())
            } else {
              roiObj.push('0')
              sushiRoiObj.push('0')
            }
          }

          // Swap Fees Sushiswap
          let monthlyAverageLiquidity = 0.0;
          let monthlyAverageVolume = 0.0;
          let dayCount = 0.0;

          const previousMonthData = await sushiswapForkClient.query({
            query: SUSHI_TICKER_GET_MONTH_FOR_FEES,
            variables: {
              id: rows[i].pairAddress,
              date: _currentTimeStamp - 86400,
            },
            fetchPolicy: "cache-first",
          });

          let previousMonth = previousMonthData.data.pairDayDatas;
          previousMonth.forEach((element) => {
            dayCount += 1.0;
            monthlyAverageLiquidity =
              monthlyAverageLiquidity +
              (element.reserveUSD - monthlyAverageLiquidity) / dayCount;
            monthlyAverageVolume =
              monthlyAverageVolume +
              (element.dailyVolumeUSD - monthlyAverageVolume) / dayCount;
          });
          let returns = (monthlyAverageVolume * 0.0025 * 1)
          // / monthlyAverageLiquidity) * 100 

          // Total Above Details in object
          datas = [{
            'name': rows[i].pairName,
            'liquidity': '$ ' + new BigNumber(result.data.pairDayDatas[0].reserveUSD).toFormat(0),
            'tradedvolume': '$ ' + new BigNumber(result.data.pairDayDatas[0].dailyVolumeUSD).toFormat(0),
            'fees': '$ ' + new BigNumber(returns).toFormat(0).toString(),
            'roi1': new BigNumber(roiObj[0]).toFormat(6) + ' %-' + new BigNumber(sushiRoiObj[0]).toFormat(6) + ' %',
            'roi2': new BigNumber(roiObj[1]).toFormat(6) + ' %-' + new BigNumber(sushiRoiObj[1]).toFormat(6) + ' %',
            'roi3': new BigNumber(roiObj[2]).toFormat(6) + ' %-' + new BigNumber(sushiRoiObj[2]).toFormat(6) + ' %',
            'icon': sushiswap,
            'pairAddress' : rows[i].pairAddress,
            'platform' : 'sushiswap'
          }]
          // Add object into object array  
          liq.push(datas)
        }
        // Add object array into array for table
        setTotalLiquiditySushiswap(liq)
        setSushiProgress(false)
        // setNameArraySushi(tempNameArray)
      } catch (error) {
        console.log('error++', error)
      }
    }
    process()
  }, [])

  useEffect(() => {
    async function process() {
      try {
        seTotalPlatforms(liq)      
      } catch (error) {
        console.log(error)
      }
    }
    if(isUniProgress && isShushiProgress) {
      process()
    }
  }, [isUniProgress, isShushiProgress])

  async function fetchSushi(pairAddress, time) {
    const blocksPerDay = 6500;
    const sushi = await sushiswapForkClient2.query({ // token
      query: SUSHI_GET_DERIVED_ETH,
      variables: {
        id: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2'
      },
      fetchPolicy: "cache-first",
    });
    const derivedETH = sushi.data.token.derivedETH;

    const poolResult = await masterChefClient.query({ // pool
      query: SUSHI_GET_REWARD_POOLS_BY_PAIR,
      variables: {
        pairAddress: pairAddress
      },
      fetchPolicy: "cache-first",
    });
    const pools = poolResult.data.pools;

    const allocResult = await masterChefClient.query({ // masterChef
      query: SUSHI_GET_TOTAL_ALLOC,
      fetchPolicy: "cache-first",
    });
    const totalAlloc = allocResult.data.masterChefs[0].totalAllocPoint;

    let pool30ROI = {};
    const poolInfo = await sushiswapForkClient2.query({ // pair
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
            time * (pools[0].allocPoint / totalAlloc)))
        / (totalValueETH * (pools[0].slpBalance / totalSupply));

      pool30ROI[pools[0].pair] = thirtyDayROI;
      return thirtyDayROI
    }
    return 0
  }

  return (
    // <Container fixed>
      <div style={{'margin': '75px'}}>
        <TableContainer className={classes.container}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell padding="checkbox" />
                <StyledTableCell>
                  <Typography variant="h5" component="h2">
                    Pool
                    </Typography>
                </StyledTableCell>
                <StyledTableCell align="right">
                <Typography variant="h5" component="h2">
                  Total Liquidity
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="right">
                <Typography variant="h5" component="h2">
                Trade Volume
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="right">
                <Typography variant="h5" component="h2">
                Swap Fees
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="right">
                <Typography variant="h5" component="h2">
                ROI(24H)
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="right">
                <Typography variant="h5" component="h2">
                ROI(7D)
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Typography variant="h5" component="h2">
                  ROI(30D)
                  </Typography>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isUniProgress ? <div style={{ "marginLeft": "850px", "marginTop": "40px", "marginBottom": "30px" }}><CircularProgress disableShrink /></div> :
                totalPlatforms.map((row) => (
                  <>
                    <Slider
                      key={row[0].name}
                      pairAddress={row[0].pairAddress}
                      platform={row[0].platform}
                      expandComponent={
                      <TableCell colSpan={7}>
                        <div className={classes.root2}>
                          <Paper className={classes.paper2}>
                          <Grid container spacing={1}>
                            <Grid item xs={4}>
                              <Grid item container direction="column" spacing={2} xs={12}>
                                <div>
                                {/* <TextField id="filled-search" label="Search field" type="search" variant="filled" /> */}

                                <FormControl fullWidth className={classes.margin} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                                <OutlinedInput
                                  id="outlined-adornment-amount"
                                  value={'10'}
                                  onChange={handleChange}
                                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                  labelWidth={60}
                                />
                              </FormControl>
                              <FormControl fullWidth className={classes.margin} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                                <OutlinedInput
                                  id="outlined-adornment-amount"
                                  value={'10'}
                                  onChange={handleChange}
                                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                  labelWidth={60}
                                />
                              </FormControl>
                              <div className={classes.buttonMargin}>
                              <Button variant="contained" color="primary">
                                Submit
                              </Button></div>
                                </div>
                              </Grid>
                            </Grid>

                            <Divider orientation="vertical" flexItem />

                            <Grid item xs={4}>

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
                            </Grid>
                            {/* <Grid item xs={4}>
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
                            <Grid container  item xs={8} spacing={3}>
                                  <Grid item xs={6}>
                                    <Card className={classes.root3} variant="outlined">
                                      <CardContent>
                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                          Total Liquidity
                                        </Typography>
                                        <Typography variant="h5" component="h2">
                                          {row[0].liquidity}
                                        </Typography>
                                      </CardContent>
                                    </Card>
                                    <Card className={classes.root3} variant="outlined">
                                      <CardContent>
                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                        Trade Volume
                                        </Typography>
                                        <Typography variant="h5" component="h2">
                                          {row[0].tradedvolume}
                                        </Typography>
                                      </CardContent>
                                    </Card>
                                    <Card className={classes.root3} variant="outlined">
                                      <CardContent>
                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                        Swap Fees
                                        </Typography>
                                        <Typography variant="h5" component="h2">
                                          {row[0].fees}
                                        </Typography>
                                      </CardContent>
                                    </Card>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Card className={classes.root3} variant="outlined">
                                      <CardContent>
                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                          ROI(24H)
                                        </Typography>
                                        <Typography variant="h5" component="h2">
                                          {row[0].roi1.split('-').map((it, i) => <div key={'x' + i}>{it}</div>)}
                                        </Typography>
                                      </CardContent>
                                    </Card>
                                    <Card className={classes.root3} variant="outlined">
                                      <CardContent>
                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                        ROI(7D)
                                        </Typography>
                                        <Typography variant="h5" component="h2">
                                        {row[0].roi2.split('-').map((it, i) => <div key={'x' + i}>{it}</div>)}
                                        </Typography>
                                      </CardContent>
                                    </Card>
                                    <Card className={classes.root3} variant="outlined">
                                      <CardContent>
                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                        ROI(30D)
                                        </Typography>
                                        <Typography variant="h5" component="h2">
                                        {row[0].roi3.split('-').map((it, i) => <div key={'x' + i}>{it}</div>)}
                                        </Typography>
                                      </CardContent>
                                    </Card>
                                  </Grid>
                              </Grid> */}
                            </Grid>
                          </Paper>
                        </div>
                      </TableCell>}
                    >
                      <TableCell component="th" scope="row">
                        <AvatarGroup max={3}>
                          <Avatar alt="Remy Sharp" src={row[0].icon} />
                        </AvatarGroup>
                        {row[0].name}
                      </TableCell>
                      <TableCell align="right">{row[0].liquidity}</TableCell>
                      <TableCell align="right">{row[0].tradedvolume}</TableCell>
                      <TableCell align="right">{row[0].fees}</TableCell>
                      <TableCell align="right">{row[0].roi1.split('-').map((it, i) => <div key={'x' + i}>{it}</div>)}</TableCell>
                      <TableCell align="right">{row[0].roi2.split('-').map((it, i) => <div key={'x' + i}>{it}</div>)}</TableCell>
                      <TableCell align="right">{row[0].roi3.split('-').map((it, i) => <div key={'x' + i}>{it}</div>)}</TableCell>
                    </Slider>
                  </>
                ))    
              }
            </TableBody>
          </Table>
        </TableContainer >
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalLiquidityState.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePageUNI}
          onChangeRowsPerPage={handleChangeRowsPerPageUNI}
        />
        {/* <Divider variant="middle" />
        <TableContainer className={classes.container} style={{ 'marginTop': "40px" }}>
          <Table className={classes2.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell padding="checkbox" />
                <StyledTableCell>
                <Typography variant="h5" component="h2">
                  Pool
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="right">
                <Typography variant="h5" component="h2">
                  Total Liquidity
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="right">
                <Typography variant="h5" component="h2">
                Trade Volume
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="right">
                <Typography variant="h5" component="h2">
                Swap Fees
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="right">
                <Typography variant="h5" component="h2">
                ROI(24H)
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="right">
                <Typography variant="h5" component="h2">
                ROI(7D)
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Typography variant="h5" component="h2">
                  ROI(30D)
                  </Typography>
                </StyledTableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {isShushiProgress ? <div style={{ "marginLeft": "850px", "marginTop": "40px", "marginBottom": "30px" }}><CircularProgress disableShrink /></div> :
                totalLiquidityStateSushiSwap.map((row) => (
                  <>
                    <ExpandableTableRow
                      key={row[0].name}
                      expandComponent={
                      <TableCell colSpan={7}>
                        <div className={classes.root2}>
                          <Paper className={classes.paper2}>
                          <Grid container spacing={1}>
                            <Grid item xs={4}>
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
                            <Grid container  item xs={8} spacing={3}>
                                  <Grid item xs={6}>
                                    <Card className={classes.root3} variant="outlined">
                                      <CardContent>
                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                          Total Liquidity
                                        </Typography>
                                        <Typography variant="h5" component="h2">
                                          {row[0].liquidity}
                                        </Typography>
                                      </CardContent>
                                    </Card>
                                    <Card className={classes.root3} variant="outlined">
                                      <CardContent>
                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                        Trade Volume
                                        </Typography>
                                        <Typography variant="h5" component="h2">
                                          {row[0].tradedvolume}
                                        </Typography>
                                      </CardContent>
                                    </Card>
                                    <Card className={classes.root3} variant="outlined">
                                      <CardContent>
                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                        Swap Fees
                                        </Typography>
                                        <Typography variant="h5" component="h2">
                                          {row[0].fees}
                                        </Typography>
                                      </CardContent>
                                    </Card>
                                  </Grid>
                                  <Grid item xs={6}>
                                    
                                    <Card className={classes.root3} variant="outlined">
                                      <CardContent>
                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                          ROI(24H)
                                        </Typography>
                                        <Typography variant="h5" component="h2">
                                          {row[0].roi1.split('-').map((it, i) => <div key={'x' + i}>{it}</div>)}
                                        </Typography>
                                      </CardContent>
                                    </Card>
                                    <Card className={classes.root3} variant="outlined">
                                      <CardContent>
                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                        ROI(7D)
                                        </Typography>
                                        <Typography variant="h5" component="h2">
                                        {row[0].roi2.split('-').map((it, i) => <div key={'x' + i}>{it}</div>)}
                                        </Typography>
                                      </CardContent>
                                    </Card>
                                    <Card className={classes.root3} variant="outlined">
                                      <CardContent>
                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                        ROI(30D)
                                        </Typography>
                                        <Typography variant="h5" component="h2">
                                        {row[0].roi3.split('-').map((it, i) => <div key={'x' + i}>{it}</div>)}
                                        </Typography>
                                      </CardContent>
                                    </Card>
                                  </Grid>
                              </Grid>
                          </Grid>
                        </Paper>
                      </div>
                      </TableCell>}
                    >
                      <TableCell component="th" scope="row">
                        <AvatarGroup max={3}>
                          <Avatar alt="Remy Sharp" src={row[0].icon} />
                        </AvatarGroup>
                        {row[0].name}
                      </TableCell>
                      <TableCell align="right">{row[0].liquidity}</TableCell>
                      <TableCell align="right">{row[0].tradedvolume}</TableCell>
                      <TableCell align="right">{row[0].fees}</TableCell>
                      <TableCell align="right">{row[0].roi1.split('-').map((it, i) => <div key={'x' + i}>{it}</div>)}</TableCell>
                      <TableCell align="right">{row[0].roi2.split('-').map((it, i) => <div key={'x' + i}>{it}</div>)}</TableCell>
                      <TableCell align="right">{row[0].roi3.split('-').map((it, i) => <div key={'x' + i}>{it}</div>)}</TableCell>
                    </ExpandableTableRow>
                  </>
                ))
                }
            </TableBody>
          </Table>
        </TableContainer> */}
        {/* <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalLiquidityStateSushiSwap.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePageSUSHI}
          onChangeRowsPerPage={handleChangeRowsPerPageSUSHI}
        /> */}
      </div>
  )
}

export default HomePage
