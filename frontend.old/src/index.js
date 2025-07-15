import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import theme from './theme';
import { ThemeProvider, CssBaseline } from '@mui/material';

ReactDOM.render(
   <ThemeProvider theme={theme}>
     <CssBaseline />
     <App />
   </ThemeProvider>,
   document.getElementById('root')
 );