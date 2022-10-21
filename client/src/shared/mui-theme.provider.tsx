import {
  alpha,
  createTheme,
  CssBaseline,
  GlobalStyles,
  inputBaseClasses,
  outlinedInputClasses,
  ThemeProvider,
} from '@mui/material';
import { Property } from 'csstype';

// for @mui/lab theme extend
import type {} from '@mui/lab/themeAugmentation';

import { FC } from 'react';

// in the file where you are creating the theme (invoking the function `createTheme()`)
import { Theme } from '@mui/material/styles';
import { ToastVariant } from './toast/toast.types';

// https://mui.com/material-ui/migration/v5-style-changes/#%E2%9C%85-add-module-augmentation-for-defaulttheme-typescript
declare module '@mui/material/styles' {
  export interface PaletteOptions {
    toast: Record<ToastVariant, Property.Color>;
  }

  export interface Palette {
    toast: Record<ToastVariant, Property.Color>;
  }
}

const darkTheme = createTheme({
  palette: {
    toast: {
      error: '#FC545D',
      success: '#36CC82',
      warning: '#FC8654',
      info: '#FFFFFF',
    },
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
    MuiButton: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
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
      styleOverrides: {
        root: {
          [`& .${inputBaseClasses.root}`]: {
            height: 30,
          },
          [`& .${inputBaseClasses.input}`]: {
            height: 30,
            paddingTop: 0,
            paddingBottom: 0,
            '&::placeholder': {
              fontStyle: 'italic',
              fontSize: 14,
            },
          },
        },
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
