import React from 'react'
import CheckWallet from "./components/CheckWallet";
import { makeStyles } from '@material-ui/core/styles';

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

const LpPosition: React.FC = () => {
  // const classes = useStyles();
  return (
    // <div>
      <CheckWallet />
    // </div>
  )
}

export default LpPosition
