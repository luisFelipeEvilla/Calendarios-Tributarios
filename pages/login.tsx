import Head from "next/head";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { parseCookies, setCookie } from 'nookies';
import axios from "axios";
import { useRouter } from 'next/router';
import { useState } from "react";

import banner from '../public/images/login-banner.jpg';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}

      R&R
      {' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignInSide() {
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const credentials = new FormData(event.currentTarget);
    const user = credentials.get('user');
    const password = credentials.get('password');

    // send data to server  
    const url = process.env.NEXT_PUBLIC_API_URL + '/login';

    try {      
      // todo login with axios
      if (user != '1234' || password != '1234') {
        setError(true);
        setErrorMessage('Usuario o contraseña incorrectos');
        return;
      }

      // redirect to home page
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  const handleOnChange =(event: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setErrorMessage('');
  }

  return (
    <>
      <Head>
        <title>Medical Gestion</title>
      </Head>
      <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: '100vh' }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: `url(${banner.src})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Iniciar Sesión
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  type={'text'}
                  label="Nombre de usuario"
                  name="user"
                  autoFocus
                  error={error}
                  helperText={errorMessage}
                  onChange={handleOnChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={handleOnChange}
                />
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Ingresar
                </Button>
                <Grid container>
                  <Grid item>
                    <Link href="/signup" variant="body2">
                      {"¿Aún no tienes una cuenta? Registrate"}
                    </Link>
                  </Grid>
                </Grid>
                <Copyright sx={{ mt: 5 }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
}