import React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';

import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import  theme  from './theme'; // Utilisation de l'importation nommée

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CssVarsProvider theme={theme}>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </CssVarsProvider>,

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);