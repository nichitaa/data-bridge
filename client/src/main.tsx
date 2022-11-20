import React from 'react';
import { render } from 'react-dom';
import App from './app';
import { RecoilRoot } from 'recoil';
import MuiThemeProvider from './shared/mui-theme.provider';
import { BrowserRouter } from 'react-router-dom';
import ToastProvider from './shared/toast/toast.provider';
import 'react-reflex/styles.css';
import '@cloudscape-design/global-styles/index.css';
import {
  applyDensity,
  applyMode,
  Density,
  Mode,
} from '@cloudscape-design/global-styles';

applyMode(Mode.Dark);
applyDensity(Density.Compact);

const app = (
  <MuiThemeProvider>
    <BrowserRouter>
      <RecoilRoot>
        <ToastProvider />
        <App />
      </RecoilRoot>
    </BrowserRouter>
  </MuiThemeProvider>
);

const root = document.getElementById('root') as HTMLElement;
render(app, root);
