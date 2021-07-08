import React from 'react'
import HomePage from "./components/HomePage";
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
  // const classes = useStyles();
  return (
    // <div>
      <HomePage />
    // </div>
  )
}

export default DashBoard
