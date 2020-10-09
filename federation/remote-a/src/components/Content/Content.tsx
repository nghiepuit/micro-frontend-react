import React from 'react'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import { ThemeProvider } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'

const Headline = styled.h2`
  font-weight: 500;
`

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ff69b4',
    },
  },
})

const Content: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Headline>Remote A</Headline>
      <Button variant="contained" color="primary">
        pink remote button :)!
      </Button>
    </ThemeProvider>
  )
}

export default Content
