import React from 'react';
import { Input } from "@nextui-org/input";
import { EyeFilledIcon } from "./pages/component/EyeFilledIcon";
import { EyeSlashFilledIcon } from "./pages/component/EyeSlashFilledIcon";
import { Button } from "@nextui-org/button";
import { useDispatch } from 'react-redux';
import { Form } from 'react-router-dom';
import { Login } from './user/Login';
import axios from 'axios';
import { setToken } from './authSlice';
import { useState } from 'react';
import {loginUser} from './user/loginApi';


function LoginForm() {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const token = "Aa2HASQgNmEyMTUzNTAtZmUyMi00YTBlLWI0OTAtOTg3NWNmMDI4ZDAxOGVhOTk4OThiYWM3NGM0NGEwN2JkNmU4MjkzYWFhNTQ=";

  const dispach = useDispatch();
  async function handleSubmit(event) {
    event.preventDefault();
    var user = {} ;
    user.email ;
    user.password;
    loginUser(user);
    // try {
    //   console.log("hi");
    //   const response = await fetch('http://localhost:3000/api/login', {
    //     method: 'POST',
    //     headers: {
    //       Accept: 'application/json',
    //       'Content-Type': 'application/json'    
    //         },
    //     body: JSON.stringify({ email, password }),
    //     withCredentials: true,
    //   });
    //   console.log("hi2");
  
    //   if (response.status === 401) {
    //     console.error("Unauthorized: Check your credentials");
    //   } else if (response.ok) {
    //     const data = await response.json();
    //     console.log("The token is", data.token);
    //     dispach(setToken(data.token));
    //   } else {
    //     console.error("Can not connect. Server returned", response.status);
    //   }
    // } catch (error) {
    //   console.error("Can not connect " + error);
    // }
  }
  
  
  return (
   
   
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 shadow-md rounded-md w-96">
      <br/>  <br/> <br/>  <br/> <br/>  <br/> 
      <h1 className="text-4xl font-extrabold mb-6">Login</h1><br/> 
        
        <Input
        
          isRequired
          type="email"
          label="Email"
          defaultValue="junior@nextui.org"
          className="mb-4"
          onChange={
            (e) => setEmail(e.target.value)
          }
        />
        <br/> 
        <Input
          label="Password"
          variant="bordered"
          placeholder="Enter your password"
          endContent={
            <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          className="mb-4"
          onChange={
            (e) => setPassword(e.target.value)
          }
        />
        <br/> 
        <Button color="primary" onClick={handleSubmit}>
          Login
        </Button>
      </div>
    </div>
   
  );
}

export default LoginForm;
