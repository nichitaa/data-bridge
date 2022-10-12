import {
  alpha,
  createTheme,
  CssBaseline,
  GlobalStyles,
  outlinedInputClasses,
  ThemeProvider,
} from '@mui/material';
// for @mui/lab theme extend
import type {} from '@mui/lab/themeAugmentation';

import { FC } from 'react';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6F69AC',
    },
    background: {
      default: '#030913',
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          [`&:not(.Mui-focused)`]: {
            '&:hover': {
              [`& .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: `${alpha('#fff', 0.3)}!important`,
              },
            },
          },
        },
      },
    },
    MuiLoadingButton: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
  },
  typography: {
    fontFamily: 'Poppins',
  },
});

const globalStyles = (
  <GlobalStyles
    styles={(theme) => ({
      '#root': {
        maxHeight: '100vh',
        // overflow: 'hidden',
      },
      '&::-webkit-scrollbar': {
        width: 7,
        height: 7,
      },
      '&::-webkit-scrollbar-track': {
        background: 'transparent',
        // borderRadius: 2,
      },
      '&::-webkit-scrollbar-thumb': {
        background: `${alpha(theme.palette.primary.main, 0.2)}`,
        // borderRadius: 2,
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: `${alpha(theme.palette.primary.main, 0.5)}!important`,
      },
    })}
  />
);

const MuiThemeProvider: FC = ({ children }) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {globalStyles}
      {children}
    </ThemeProvider>
  );
};

export default MuiThemeProvider;
