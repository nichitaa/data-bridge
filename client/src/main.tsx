import React from 'react';
import { render } from 'react-dom';
import App from './app';
import { RecoilRoot } from 'recoil';

const app = (
  <RecoilRoot>
    <App />
  </RecoilRoot>
);
const root = document.getElementById('root') as HTMLElement;
render(app, root);
