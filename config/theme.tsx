import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
      primary: {
        main: '#1d3557',
      },
      secondary: {
        main: '#f6fff8',
      },
    },
    components: {
      MuiTableCell: {
        styleOverrides: {
          
          root: {
            padding: '8px 16px',
            fontSize: '1.2rem',
            alignContent: 'center',
            textAlign: 'center',
            
          }
        },
      },
    }
  });

export default theme;