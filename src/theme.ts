import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#f5f5f5',
            paper: '#fff',
        },
        text: {
            primary: '#000',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
        :root {
          --primary-color: #1976d2;
          --bg-color: #ffffff;
          --text-color: #000000;
        }
      `,
        },
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
        text: {
            primary: '#ffffff',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
        :root {
          --primary-color: #90caf9;
          --bg-color: #121212;
          --text-color: #ffffff;
        }
      `,
        },
    },
});
