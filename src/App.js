import './App.css';
import {Login} from "./user/Login";
import React from 'react';
import ReactDOM from 'react-dom';
import store from './store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
function App() {

  return (
      <BrowserRouter>
        <Provider store={store}>
          <Login/>
      </Provider>
      </BrowserRouter>
  );
}

export default App;
