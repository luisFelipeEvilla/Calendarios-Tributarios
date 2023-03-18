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
import { useRouter } from 'next/router';
import { useContext, useState } from "react";
import { setCookie } from "nookies";

import banner from '../public/images/login-banner.jpg';
import { AuthContext } from "../contexts/authContext";

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
  const { login } = useContext(AuthContext);
  
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const credentials = new FormData(event.currentTarget);
    const username = credentials.get('user');
    const password = credentials.get('password');
  
    // send data to server  
    const url = 'api/handleLogin';

    try {      
      // todo login with axios

      
      const body = { username, password};
      
      const request = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const response = await request.json();
      if (response.status !== 200) {
        setError(true);
        setErrorMessage('Usuario o contraseña incorrectos');
        return;
      }

      login(response.data.user, response.data.token);

      const rol = response.data.user.rol.nombre;

      if (rol === 'admin') router.push('/calendarioTributario');
      if (rol === 'auditor') router.push('/cliente');
      if (rol === 'cliente') router.push(`/cliente/${response.data.user.cliente.id}/gestionTributaria`);
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
        <title>SGC</title>
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
                <Copyright sx={{ mt: 5 }} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
}