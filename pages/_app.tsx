import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { CacheProvider } from '@emotion/react';
import theme from '../config/theme';
import createEmotionCache from '../config/cache';
import { CssBaseline, ThemeProvider } from '@mui/material';

const clientSideEmotionCache = createEmotionCache();

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
        <CssBaseline/>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default MyApp
