<<<<<<< HEAD

import React from 'react';
import {NextUIProvider} from "@nextui-org/react";
import { Routes, Route } from 'react-router-dom';
import Welcome from './pages/HomePage';
import LoginForm from './LogForm';
import store from './store';
import { Provider } from 'react-redux';
import { Login } from './user/Login';
import {addUser} from './inscription/addUser';
=======
import './App.css';
import {Login} from "./user/Login";
>>>>>>> origin/main

function App() {

  return (
<<<<<<< HEAD
    <Provider store={store}>
    <NextUIProvider>
      <Routes>
      <Route path = "/" Component={Welcome} />
      <Route path = "login" Component={Login} /> 
      <Route path="addUser" Component={addUser}/>
      </Routes>
      </NextUIProvider>
      </Provider>
=======
      <Login/>
>>>>>>> origin/main
  );
}

export default App;
