<<<<<<< HEAD
import React from 'react';
=======
>>>>>>> origin/main
import {useState} from "react";
import {loginUser} from "./loginApi";
import {Session} from "../model/common";
import {CustomError} from "../model/CustomError";
<<<<<<< HEAD
import { Input } from "@nextui-org/input";
import { EyeFilledIcon } from "../pages/component/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../pages/component/EyeSlashFilledIcon";
import { Button } from "@nextui-org/button";
import { useDispatch } from 'react-redux';
import { Form } from 'react-router-dom';
import { setToken } from '../authSlice';

=======
>>>>>>> origin/main

export function Login() {

    const [error, setError] = useState({} as CustomError);
    const [session, setSession] = useState({} as Session);
<<<<<<< HEAD
    const dispach = useDispatch();

    const [isVisible, setIsVisible] = React.useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
=======

>>>>>>> origin/main
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        loginUser({user_id: -1, username:  data.get('login') as string, password: data.get('password') as string},
            (result: Session) => {
                console.log(result);
                setSession(result);
<<<<<<< HEAD
                dispach(setToken(result.token));
=======
>>>>>>> origin/main
                form.reset();
                setError(new CustomError(""));
            }, (loginError: CustomError) => {
                console.log(loginError);
                setError(loginError);
                setSession({} as Session);
            });
    };

    return(<>
<<<<<<< HEAD
      <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 shadow-md rounded-md w-96">
      <br/>  <br/> <br/>  <br/> <br/>  <br/> 
      <h1 className="text-4xl font-extrabold mb-6">Login Page</h1><br/> 
      <form onSubmit={handleSubmit}>
      <Input name="login" placeholder="login"/><br/>
            <Input name="password" placeholder="password"
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
            /><br/>
        <Button 
        type="submit" 
        color="primary" >
          Login
        </Button>
        </form>
      </div>
    </div>
    { session.token &&
=======
        <form onSubmit={handleSubmit}>
            <input name="login" placeholder="login"/><br/>
            <input name="password" placeholder="password"/><br/>
            <button type="submit">connexion</button>
        </form>
            { session.token &&
>>>>>>> origin/main
                <span>{session.username} : {session.token}</span>
            }
            { error.message &&
                <span>{error.message}</span>
            }
        </>
    );
}