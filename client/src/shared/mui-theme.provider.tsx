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

// in the file where you are creating the theme (invoking the function `createTheme()`)
import { Theme } from '@mui/material/styles';

// https://mui.com/material-ui/migration/v5-style-changes/#%E2%9C%85-add-module-augmentation-for-defaulttheme-typescript
declare module '@mui/styles' {
  interface DefaultTheme extends Theme {}
}

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
        maxWidth: 7,
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
