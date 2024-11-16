import './App.css';
import { Login } from "./user/Login";
import { SignUp } from "./user/SignUp";
import { MessagingPage } from './user/MessagingPage';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import store from './store';


function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/messaging" element={<MessagingPage />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
