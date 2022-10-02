import React from 'react'
import {render} from 'react-dom'
import App from './app'

const app = <App/>
const root = document.getElementById('root') as HTMLElement;
render(app, root);
