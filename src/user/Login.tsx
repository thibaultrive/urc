import React, { useState, useEffect } from 'react';
import { useColorScheme } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import CssBaseline from '@mui/joy/CssBaseline';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { loginUser } from "./loginApi";
import { Session } from "../model/common";
import { CustomError } from "../model/CustomError";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, loginFailure } from '../features/authSlice';

// ModeToggle component
function ModeToggle() {
    const { mode, setMode } = useColorScheme();
    const [mounted, setMounted] = useState(false);
  
    useEffect(() => {
      setMounted(true);
    }, []);
  
    if (!mounted) {
      return <Button variant="soft">Change mode</Button>;
    }
  
    return (
      <Select
        variant="soft"
        value={mode}
        onChange={(event, newMode) => {
          setMode(newMode);
        }}
        sx={{ width: 'max-content' }}
      >
        <Option value="system">System</Option>
        <Option value="light">Light</Option>
        <Option value="dark">Dark</Option>
      </Select>
    );
  }


export default function Login() {
  const [error, setError] = useState<CustomError>({
    message: '',
    name: ''
  }); // Proper typing for error state
  const [session, setSession] = useState<Session | null>(null); // Optional session state
  const navigate = useNavigate(); // Hook pour la navigation
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Login logic
    loginUser(
      {
        username: data.get('username') as string,
        password: data.get('password') as string,
        user_id: 0
      },
      (result: Session) => {
        setSession(result);
        alert("Login successful");
        navigate('/messaging');
        setError({ message: '', name: '' }); // Clear error message on success
      },
      (loginError: CustomError) => {
        setError(loginError);
        setSession(null); // Reset session on failure
        alert("Login failed");
      }
    );
  };

  return (
    <main>
      <ModeToggle />
      <CssBaseline />
      <Sheet
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: 300,
          mx: 'auto',
          my: 4,
          py: 3,
          px: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          borderRadius: 'sm',
          boxShadow: 'md',
        }}
        variant="outlined"
      >
        <div>
          <Typography level="h4" component="h1">
            <b>Welcome!</b>
          </Typography>
          <Typography level="body-sm">Sign in to continue.</Typography>
        </div>

        {/* Username field */}
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            name="username"
            type="text" // Correct type for username
            placeholder="username"
            required
          />
        </FormControl>

        {/* Password field */}
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            name="password"
            type="password"
            placeholder="password"
            required
          />
        </FormControl>

        <Button type="submit" sx={{ mt: 1 }}>
          Log in
        </Button>

        {/* Display session info if login is successful */}
        {session?.token && (
          <Typography level="body-sm">
            {session.username} : {session.token}
          </Typography>
        )}

        {/* Display error message if login fails */}
        {error.message && (
          <Typography color="danger" level="body-sm">
            {error.message}
          </Typography>
        )}

        {/* Link to sign up if the user doesn't have an account */}
        <Typography
          endDecorator={<Link href="/signUp">Sign up</Link>}
          sx={{ fontSize: 'sm', alignSelf: 'center' }}
        >
          Don&apos;t have an account?
        </Typography>
      </Sheet>
    </main>
  );
}