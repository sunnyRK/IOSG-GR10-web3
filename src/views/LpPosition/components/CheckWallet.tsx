import BigNumber from 'bignumber.js'
import React, { useState, useCallback, useEffect } from 'react'
import useROIForLP from "../../../hooks/useROIForLP"
import useROI from "../../../hooks/useROI"
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
  UNI_TO_GET_ALL_LP_POSITIONS,
  UNI_MINT_TXS,
  UNI_BURN_TXS
} from "../../../external/Data/LP_Query";
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

const CheckWallet: React.FC = () => {
  const classes = useStyles();
  const { onROILP } = useROIForLP()
  const {onROI} = useROI()

  const [walletAddress, setWalletAddress] = useState('')
  const handleChangeWalletAddress = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(e.currentTarget.value)
      setWalletAddress(e.currentTarget.value)
  },[walletAddress, setWalletAddress])

  const handleSubmitChange = useCallback(async () => {
    try {
      const _currentTimeStamp = await getCurrentTimeSTamp()

      const result0 = await uniswapClient.query({
        query: UNI_TO_GET_ALL_LP_POSITIONS,
        variables: {
            id: walletAddress
        },
        fetchPolicy: "cache-first",
      });

      console.log(result0)

      for(let k=0; k<result0.data.users[0].liquidityPositions.length; k++)
      {

      // Mint
        const result = await uniswapClient.query({
          query: UNI_MINT_TXS,
          variables: {
              to: walletAddress,
              pairAddress: result0.data.users[0].liquidityPositions[k].pair.id
          },
          fetchPolicy: "cache-first",
        });

        let totalMint: number = 0
        let totalLiquidityMint: number = 0
        let pastPriceMint: number = 0
        for (let i=0; i<result.data.mints.length; i++) {
          let resultROI = await onROILP(
            result.data.mints[i].pair.id, 
            result.data.mints[i].amountUSD,
            result.data.mints[i].liquidity,  
            (_currentTimeStamp).toString()
          )
          if (resultROI) {
            totalMint = totalMint + resultROI.convertUserLptoCurrentPrice.toNumber()
            totalLiquidityMint = totalLiquidityMint + new BigNumber(result.data.mints[i].liquidity).toNumber() 
            pastPriceMint = pastPriceMint + new BigNumber(result.data.mints[i].amountUSD).toNumber() 
            console.log('MintResult: ', i, resultROI.convertUserLptoCurrentPrice.toNumber())
          }
        }
        console.log('totalMint: ', totalMint, totalLiquidityMint)

        // Burn
        const result1 = await uniswapClient.query({
          query: UNI_BURN_TXS,
          variables: {
              sender: walletAddress,
              pairAddress: result0.data.users[0].liquidityPositions[k].pair.id
          },
          fetchPolicy: "cache-first",
        });

        let totalBurn: number = 0
        let totalLiquidityBurn: number = 0
        let pastPriceBurn: number = 0
        for (let i=0; i<result1.data.burns.length; i++) {
          let resultROI = await onROILP(
            result1.data.burns[i].pair.id, 
            result1.data.burns[i].amountUSD,
            result1.data.burns[i].liquidity,  
            (_currentTimeStamp).toString()
          )
          if (resultROI) {
            totalBurn = totalBurn + resultROI.convertUserLptoCurrentPrice.toNumber()
            totalLiquidityBurn = totalLiquidityBurn + new BigNumber(result1.data.burns[i].liquidity).toNumber() 
            pastPriceBurn = pastPriceBurn + new BigNumber(result1.data.burns[i].amountUSD).toNumber() 
            console.log('BurnResult: ', i, resultROI.convertUserLptoCurrentPrice.toNumber())
          }
        }
        console.log('totalBurn: ', totalBurn, totalLiquidityBurn)

        if (totalMint > 0) {
          pastPriceMint = pastPriceMint - pastPriceBurn
          totalMint = totalMint - totalBurn
          totalLiquidityMint = totalLiquidityMint - totalLiquidityBurn
        }

        
        let ROI = new BigNumber(totalMint).
        multipliedBy(new BigNumber(100)).
        div(new BigNumber(pastPriceMint)).minus(100)

        // let resultDetails = await onROI(result0.data.users[0].liquidityPositions[k].pair.id, (_currentTimeStamp-7776000).toString(), totalLiquidityMint.toString(), _currentTimeStamp.toString())

        console.log('totalLiquidityFinalMint: ', totalLiquidityMint, ROI+"%")
      }



      // const handleROILP = useCallback(async (_pairAddress: string, _price: string, _lp: string, currentTime: string) => {

    } catch (e) {
      console.log(e)
    }
  }, [walletAddress, setWalletAddress])

  return (
    <div style={{'margin': '75px'}}>
      <FormControl fullWidth className={classes.margin} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-amount">Address</InputLabel>
        <OutlinedInput
          id="outlined-adornment-amount"
          value={walletAddress}
          onChange={handleChangeWalletAddress}
          startAdornment={<InputAdornment position="start">WA</InputAdornment>}
          labelWidth={60}
        />
      </FormControl>
      <div className={classes.buttonMargin}>
        <Button variant="contained" color="primary" onClick={handleSubmitChange}>
          Submit
        </Button>
      </div>
    </div>
  )
}

export default CheckWallet
