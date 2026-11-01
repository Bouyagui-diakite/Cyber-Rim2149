import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  Box, Container, Paper, Typography, TextField, Button,
  Tab, Tabs, InputAdornment, IconButton, Alert, Divider, Checkbox,
  FormControlLabel,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useAuth } from '../context/AuthContext'

const fieldSx = (accent = '#7b2fff') => ({
  '& .MuiOutlinedInput-root': {
    bgcolor: '#0a0a0f',
    '& fieldset': { borderColor: 'rgba(123,47,255,0.2)' },
    '&:hover fieldset': { borderColor: accent },
    '&.Mui-focused fieldset': { borderColor: accent, boxShadow: `0 0 12px ${accent}30` },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.35)' },
  '& .MuiInputLabel-root.Mui-focused': { color: accent },
  '& .MuiInputBase-input': { color: '#fff' },
})

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, register } = useAuth()
  const from = location.state?.from || '/account'

  const [tab, setTab] = useState(0)
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [loginForm, setLoginForm] = useState({ email: '', password: '', remember: false })
  const [regForm, setRegForm]     = useState({ name: '', email: '', password: '', confirm: '' })

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!loginForm.email || !loginForm.password) return setError('Veuillez remplir tous les champs.')
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const res = login({ email: loginForm.email, password: loginForm.password })
    setLoading(false)
    if (res.error) return setError(res.error)
    navigate(from, { replace: true })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (!regForm.name || !regForm.email || !regForm.password || !regForm.confirm)
      return setError('Veuillez remplir tous les champs.')
    if (regForm.password.length < 6)
      return setError('Le mot de passe doit contenir au moins 6 caractères.')
    if (regForm.password !== regForm.confirm)
      return setError('Les mots de passe ne correspondent pas.')
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const res = register({ name: regForm.name, email: regForm.email, password: regForm.password })
    setLoading(false)
    if (res.error) return setError(res.error)
    navigate(from, { replace: true })
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 30% 40%, rgba(123,47,255,0.12) 0%, transparent 60%), #0a0a0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pt: 10, pb: 6, px: 2,
    }}>
      {/* Grid bg */}
      <Box sx={{
        position: 'fixed', inset: 0, opacity: 0.04, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(123,47,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(123,47,255,1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box component={Link} to="/" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}>
            <SportsEsportsIcon sx={{ fontSize: 36, color: '#7b2fff', filter: 'drop-shadow(0 0 10px #7b2fff)' }} />
            <Box>
              <Typography sx={{
                fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '1.3rem',
                background: 'linear-gradient(90deg, #7b2fff, #00fff7)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                lineHeight: 1,
              }}>
                CYBER-RIM
              </Typography>
              <Typography sx={{ fontFamily: "'Fira Code'", fontSize: '0.65rem', color: '#00fff7', letterSpacing: '0.3em', lineHeight: 1 }}>
                2149
              </Typography>
            </Box>
          </Box>
        </Box>

        <Paper sx={{
          bgcolor: '#12121f',
          border: '1px solid rgba(123,47,255,0.25)',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 0 60px rgba(123,47,255,0.1)',
        }}>
          {/* Tabs */}
          <Tabs
            value={tab}
            onChange={(_, v) => { setTab(v); setError('') }}
            variant="fullWidth"
            sx={{
              borderBottom: '1px solid rgba(123,47,255,0.15)',
              '& .MuiTabs-indicator': { background: 'linear-gradient(90deg, #7b2fff, #00fff7)', height: 2 },
              '& .MuiTab-root': {
                py: 2, fontFamily: "'Fira Code'", fontWeight: 600,
                fontSize: '0.85rem', letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.35)',
                '&.Mui-selected': { color: '#fff' },
              },
            }}
          >
            <Tab label="Se connecter" icon={<LoginIcon sx={{ fontSize: '1rem' }} />} iconPosition="start" />
            <Tab label="Créer un compte" icon={<PersonAddIcon sx={{ fontSize: '1rem' }} />} iconPosition="start" />
          </Tabs>

          <Box sx={{ p: { xs: 3, md: 4 } }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2.5, bgcolor: 'rgba(255,45,85,0.1)', border: '1px solid rgba(255,45,85,0.3)', color: '#ff6b8a', '& .MuiAlert-icon': { color: '#ff2d55' } }}>
                {error}
              </Alert>
            )}

            {/* ── LOGIN FORM ── */}
            {tab === 0 && (
              <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  label="Adresse email"
                  type="email"
                  required
                  fullWidth
                  autoComplete="email"
                  value={loginForm.email}
                  onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                  sx={fieldSx()}
                />
                <TextField
                  label="Mot de passe"
                  type={showPw ? 'text' : 'password'}
                  required
                  fullWidth
                  autoComplete="current-password"
                  value={loginForm.password}
                  onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPw(v => !v)} edge="end" sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#7b2fff' } }}>
                          {showPw ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={fieldSx()}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: -1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={loginForm.remember}
                        onChange={e => setLoginForm(f => ({ ...f, remember: e.target.checked }))}
                        sx={{ color: 'rgba(255,255,255,0.2)', '&.Mui-checked': { color: '#7b2fff' } }}
                      />
                    }
                    label={<Typography sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)' }}>Se souvenir de moi</Typography>}
                  />
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={loading}
                  startIcon={<LoginIcon />}
                  sx={{ py: 1.4, fontSize: '0.95rem', mt: 0.5 }}
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </Button>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', my: 0.5 }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', px: 1 }}>pas encore de compte ?</Typography>
                </Divider>
                <Button variant="outlined" fullWidth onClick={() => { setTab(1); setError('') }}
                  sx={{ borderColor: 'rgba(123,47,255,0.3)', color: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: '#7b2fff', color: '#fff' } }}
                >
                  Créer un compte gratuitement
                </Button>
              </Box>
            )}

            {/* ── REGISTER FORM ── */}
            {tab === 1 && (
              <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  label="Nom complet"
                  required
                  fullWidth
                  autoComplete="name"
                  value={regForm.name}
                  onChange={e => setRegForm(f => ({ ...f, name: e.target.value }))}
                  sx={fieldSx()}
                />
                <TextField
                  label="Adresse email"
                  type="email"
                  required
                  fullWidth
                  autoComplete="email"
                  value={regForm.email}
                  onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))}
                  sx={fieldSx()}
                />
                <TextField
                  label="Mot de passe"
                  type={showPw ? 'text' : 'password'}
                  required
                  fullWidth
                  autoComplete="new-password"
                  helperText="Minimum 6 caractères"
                  value={regForm.password}
                  onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPw(v => !v)} edge="end" sx={{ color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#7b2fff' } }}>
                          {showPw ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ ...fieldSx(), '& .MuiFormHelperText-root': { color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem' } }}
                />
                <TextField
                  label="Confirmer le mot de passe"
                  type={showPw ? 'text' : 'password'}
                  required
                  fullWidth
                  autoComplete="new-password"
                  value={regForm.confirm}
                  onChange={e => setRegForm(f => ({ ...f, confirm: e.target.value }))}
                  error={!!regForm.confirm && regForm.confirm !== regForm.password}
                  helperText={regForm.confirm && regForm.confirm !== regForm.password ? 'Les mots de passe ne correspondent pas' : ''}
                  sx={{ ...fieldSx(), '& .MuiFormHelperText-root': { color: '#ff2d55', fontSize: '0.72rem' } }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={loading}
                  startIcon={<PersonAddIcon />}
                  sx={{ py: 1.4, fontSize: '0.95rem', mt: 0.5 }}
                >
                  {loading ? 'Création...' : 'Créer mon compte'}
                </Button>
                <Typography sx={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', mt: -0.5 }}>
                  En créant un compte, vous acceptez nos conditions d'utilisation.
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
