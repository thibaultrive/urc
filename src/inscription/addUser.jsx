import React, { useState, useEffect } from 'react';
import { Input } from "@nextui-org/input";
import { EyeFilledIcon } from "../pages/component/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../pages/component/EyeSlashFilledIcon";
import { Button } from "@nextui-org/button";

export function addUser() {
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleVisibility2 = () => setIsVisible2(!isVisible2);

  useEffect(() => {
    const match = password1 === password2;
    setPasswordsMatch(match);
  }, [password1, password2]);

  const handlePasswordChange1 = (e) => setPassword1(e.target.value);
  const handlePasswordChange2 = (e) => setPassword2(e.target.value);

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 shadow-md rounded-md w-96">
          <br /> <br /> <br /> <br /> <br /> <br />
          <h1 className="text-4xl font-extrabold mb-6">Add User</h1><br />
          <form>
            <Input
              name="login"
              placeholder="login"
            /><br />
            <Input
              name="password"
              placeholder="password"
              value={password1}
              onChange={handlePasswordChange1}
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
            /><br />
            <Input
              name="password"
              placeholder="retype password"
              value={password2}
              onChange={handlePasswordChange2}
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibility2}>
                  {isVisible2 ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisible2 ? "text" : "password"}
              className="mb-4"
            />

            {passwordsMatch && (
              <p className="text-green-500">Passwords match</p>
            )}

            {!passwordsMatch && (
              <p className="text-red-500">Passwords do not match</p>
            )}

            <Button
              type="submit"
              color="primary"
              disabled={!passwordsMatch}
            >
              Add User
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
