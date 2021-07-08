import React from 'react'
import Pairs from "./components/Pairs"
import Balances from "./components/Balances";
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    // textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const DashBoard: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid className={classes.paper} item xs={8}>
          <Balances />
        </Grid>
        <Grid className={classes.paper} item xs={4}>
          <Pairs/>
        </Grid>
      </Grid>
    </div>
  )
}

export default DashBoard
