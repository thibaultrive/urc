import React, { useState } from 'react';
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
import { createUser } from "./SignUpApi";
import { CustomError } from "../model/CustomError";

function ModeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <Button variant="soft">Change mode</Button>;
  }

  return (
    <Select
      variant="soft"
      value={mode}
      onChange={(event: any, newMode: any) => {
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

export function SignUp() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState({} as CustomError);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Simple validation
    const email = data.get('email') as string;
    const username = data.get('username') as string;
    const password = data.get('password') as string;

    if (!email || !username || !password) {
      setError(new CustomError("All fields are required"));
      return;
    }

    setLoading(true);

    createUser(
      {
        email, username, password,
        user_id: 0
      },
      () => {
        setMessage("Account created successfully");
        form.reset();
        setError(new CustomError(""));
        setLoading(false);
      },
      (signUpError: CustomError) => {
        setError(signUpError);
        setMessage("Sign-up failed");
        setLoading(false);
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
            <b>Create Account</b>
          </Typography>
          <Typography level="body-sm">Sign up to get started.</Typography>
        </div>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input name="email" type="email" placeholder="johndoe@email.com" required />
        </FormControl>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input name="username" type="text" placeholder="username" required />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input name="password" type="password" placeholder="password" required />
        </FormControl>
        <Button type="submit" sx={{ mt: 1 }} disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
        </Button>
        {message && (
          <Typography level="body-sm" color={error.message ? "danger" : "primary"}>
            {message}
          </Typography>
        )}
        <Typography
          endDecorator={<Link href="/">Log in</Link>}
          sx={{ fontSize: 'sm', alignSelf: 'center' }}
        >
          Already have an account?
        </Typography>
      </Sheet>
    </main>
  );
}
