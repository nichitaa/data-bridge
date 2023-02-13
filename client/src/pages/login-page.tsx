import { alpha, Box, Grid, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { KeyboardEventHandler, useState } from 'react';
import { useAuthHandlers } from '../hooks/use-jwt-auth';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const { login, register } = useAuthHandlers();

  const handleLogin = async () => {
    const success = await login(credentials);
  };

  const handleRegister = async () => {
    const success = await register(credentials);
  };

  const handleOnKeyDown: KeyboardEventHandler = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex' }}>
      <Box
        sx={{
          padding: 1,
          gap: 1,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 300,
          borderRadius: '5px',
          border: `2px solid ${alpha('#fff', 0.1)}`,
          margin: 'auto',
        }}
      >
        <Typography
          component={'div'}
          sx={{
            borderRadius: '4px',
            background: alpha('#fff', 0.1),
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          Connect
        </Typography>
        <TextField
          required
          value={credentials.email}
          onChange={(e) =>
            setCredentials((prev) => ({ ...prev, email: e.target.value }))
          }
          onKeyDown={handleOnKeyDown}
          placeholder='email'
          autoComplete={'off'}
        />
        <TextField
          required
          value={credentials.password}
          type={'text'} // password
          onChange={(e) =>
            setCredentials((prev) => ({ ...prev, password: e.target.value }))
          }
          onKeyDown={handleOnKeyDown}
          placeholder='password'
          autoComplete={'off'}
        />
        <Grid container spacing={1}>
          <Grid item xs>
            <LoadingButton
              color={'secondary'}
              fullWidth
              onClick={handleRegister}
            >
              Register
            </LoadingButton>
          </Grid>
          <Grid item xs>
            <LoadingButton fullWidth onClick={handleLogin}>
              Login
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default LoginPage;
