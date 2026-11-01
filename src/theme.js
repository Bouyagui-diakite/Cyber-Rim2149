import { createTheme } from '@mui/material/styles'

const cyberpunkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7b2fff', light: '#9b5eff', dark: '#5a00d4', contrastText: '#ffffff' },
    secondary: { main: '#00fff7', light: '#6efffe', dark: '#00cdc5', contrastText: '#000000' },
    error: { main: '#ff2d55' },
    warning: { main: '#ffd700' },
    success: { main: '#00ff41' },
    background: { default: '#0a0a0f', paper: '#12121f' },
    text: { primary: '#ffffff', secondary: '#a0a0b8' },
  },
  typography: {
    fontFamily: "'Fira Code', monospace",
    h1: { fontFamily: "'Fira Code', monospace", fontWeight: 700 },
    h2: { fontFamily: "'Fira Code', monospace", fontWeight: 700 },
    h3: { fontFamily: "'Fira Code', monospace", fontWeight: 700 },
    h4: { fontFamily: "'Fira Code', monospace", fontWeight: 600 },
    h5: { fontFamily: "'Fira Code', monospace", fontWeight: 600 },
    h6: { fontFamily: "'Fira Code', monospace", fontWeight: 600 },
    button: { fontFamily: "'Fira Code', monospace", fontWeight: 600, letterSpacing: '0.05em' },
  },
  shape: { borderRadius: 4 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          padding: '10px 28px',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #7b2fff, #5a00d4)',
          boxShadow: '0 0 20px rgba(123, 47, 255, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #9b5eff, #7b2fff)',
            boxShadow: '0 0 35px rgba(123, 47, 255, 0.7)',
          },
        },
        outlinedSecondary: {
          borderColor: '#00fff7',
          color: '#00fff7',
          '&:hover': {
            backgroundColor: 'rgba(0, 255, 247, 0.08)',
            boxShadow: '0 0 20px rgba(0, 255, 247, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#12121f',
          border: '1px solid rgba(123, 47, 255, 0.2)',
          transition: 'all 0.3s ease',
          '&:hover': {
            border: '1px solid rgba(123, 47, 255, 0.6)',
            boxShadow: '0 0 30px rgba(123, 47, 255, 0.25)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontFamily: "'Fira Code', monospace", fontWeight: 600, letterSpacing: '0.05em' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(10, 10, 15, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(123, 47, 255, 0.3)',
          boxShadow: '0 4px 30px rgba(123, 47, 255, 0.15)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: "'Fira Code', monospace",
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        },
      },
    },
  },
})

export default cyberpunkTheme

