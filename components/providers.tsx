'use client'

import { CssBaseline, ThemeProvider } from '@mui/material'
import { AuthProvider } from '../contexts/authContext'
import { FiltersProvider } from '../contexts/FiltersContext'
import theme from '../config/theme'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <FiltersProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </FiltersProvider>
    </AuthProvider>
  )
}
