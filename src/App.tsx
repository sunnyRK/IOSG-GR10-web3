// import React from 'react';
import React, { useCallback, useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { UseWalletProvider } from 'use-wallet'
import theme from './theme'
import MobileMenu from './components/MobileMenu'
import TopBar from './components/TopBar'
import logo from './logo.svg';
import './App.css';
import DashBoard from "./views/DashBoard/DashBoard";
import Sushiswap from "./views/Sushiswap/Sushiswap";
import Home from "./views/Home/Home";
import LpPosition from "./views/LpPosition/LpPosition";

import ModalsProvider from './contexts/Modals'
import 'react-calendar/dist/Calendar.css';
import Container from '@material-ui/core/Container';

function App() {
  const [mobileMenu, setMobileMenu] = useState(false)

  const handleDismissMobileMenu = useCallback(() => {
    setMobileMenu(false)
  }, [setMobileMenu])

  const handlePresentMobileMenu = useCallback(() => {
    setMobileMenu(true)
  }, [setMobileMenu])

  return (
    // <Container maxWidth="lg" style={{"marginLeft": "500px"}}>
      <Providers>
        <Router>
        <TopBar onPresentMobileMenu={handlePresentMobileMenu} />
        <MobileMenu onDismiss={handleDismissMobileMenu} visible={mobileMenu} />
          <Switch>
            <Route path="/" exact>
              <Home/>
            </Route>
            <Route path="/uniswap" exact>
              <DashBoard/>
            </Route>
            <Route path="/sushiswap" exact>
              <Sushiswap/>
            </Route>
            <Route path="/lpposition" exact>
              <LpPosition/>
            </Route>
          </Switch>
        </Router>
      </Providers>
    // </Container>

  );
}

const Providers: React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <ModalsProvider>{children}</ModalsProvider>
    </ThemeProvider>
  )
}

export default App;
