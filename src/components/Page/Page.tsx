import React from 'react'
import styled from 'styled-components'
import Footer from '../Footer'

const Page: React.FC = ({ children }) => (
  <StyledPage>
    <StyledMain>{children}</StyledMain>
    <Footer />
  </StyledPage>
)

const StyledPage = styled.div``

const StyledMain = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.color.grey[100]};
  min-height: calc(100vh - ${(props) => props.theme.topBarSize * 2}px);
`

export default Page
