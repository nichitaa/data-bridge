import { alpha, Box, Grid, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

const LoginPage = () => {
  return (
    <Box sx={{ height: '100vh', display: 'flex' }}>
      <Box
        sx={{
          padding: 1,
          gap: 1,
          display: 'flex',
          flexDirection: 'column',
          width: 300,
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
        <TextField required label='email' autoComplete={'off'} />
        <TextField required autoComplete={'off'} label='password' />
        <Grid container spacing={1}>
          <Grid item xs>
            <LoadingButton color={'secondary'} fullWidth>
              Register
            </LoadingButton>
          </Grid>
          <Grid item xs>
            <LoadingButton fullWidth>Login</LoadingButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default LoginPage;
