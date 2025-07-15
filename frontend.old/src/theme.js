import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#5A4FCF' },
    secondary: { main: '#00C48C' },
    info: { main: '#FFB800' },
    success: { main: '#4FC08D' },
    background: { default: '#F5F8FF' },
    text: { primary: '#333333', secondary: '#666666' }
  },
  typography: {
    fontFamily: `'Inter', sans-serif`,
    h4: { fontWeight: 600 },
    h6: { fontWeight: 500 },
  }
});

export default theme;
