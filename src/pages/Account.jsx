import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Container, Grid, Paper, Typography, Avatar, Button,
  TextField, Tab, Tabs, Divider, Alert, Chip, List,
  ListItem, ListItemText, ListItemAvatar, IconButton,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import LogoutIcon from '@mui/icons-material/Logout'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import PersonIcon from '@mui/icons-material/Person'
import LockIcon from '@mui/icons-material/Lock'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { useAuth } from '../context/AuthContext'

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: '#0a0a0f',
    '& fieldset': { borderColor: 'rgba(123,47,255,0.2)' },
    '&:hover fieldset': { borderColor: '#7b2fff' },
    '&.Mui-focused fieldset': { borderColor: '#7b2fff' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.35)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#7b2fff' },
  '& .MuiInputBase-input': { color: '#fff' },
  '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: 'rgba(255,255,255,0.35)' },
}

const MOCK_ORDERS = [
  { id: 'CR-10482', date: '2025-05-10', total: 180000, status: 'Livré', items: ['PlayStation 5'] },
  { id: 'CR-10391', date: '2025-04-28', total: 9700,   status: 'Livré', items: ['GTA VI', 'EA Sports FC 25'] },
  { id: 'CR-10287', date: '2025-03-15', total: 45000,  status: 'Livré', items: ['DualSense Edge'] },
]

const STATUS_COLORS = {
  'Livré':      { color: '#00ff41', bg: 'rgba(0,255,65,0.1)',  border: 'rgba(0,255,65,0.3)' },
  'En cours':   { color: '#ffd700', bg: 'rgba(255,215,0,0.1)', border: 'rgba(255,215,0,0.3)' },
  'Annulé':     { color: '#ff2d55', bg: 'rgba(255,45,85,0.1)', border: 'rgba(255,45,85,0.3)' },
}

function SectionTitle({ children }) {
  return (
    <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '0.75rem', color: '#7b2fff', letterSpacing: '0.15em', textTransform: 'uppercase', mb: 2.5 }}>
      {children}
    </Typography>
  )
}

export default function Account() {
  const navigate = useNavigate()
  const { user, logout, updateProfile, changePassword } = useAuth()
  const [tab, setTab] = useState(0)

  // Profile tab
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState({ name: user.name, email: user.email, phone: user.phone || '', city: user.city || '' })
  const [profileMsg, setProfileMsg] = useState(null)

  // Security tab
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [pwMsg, setPwMsg] = useState(null)

  const handleSaveProfile = () => {
    if (!profile.name || !profile.email) return
    updateProfile({ name: profile.name, phone: profile.phone, city: profile.city })
    setEditing(false)
    setProfileMsg({ type: 'success', text: 'Profil mis à jour avec succès.' })
    setTimeout(() => setProfileMsg(null), 3000)
  }

  const handleChangePassword = (e) => {
    e.preventDefault()
    setPwMsg(null)
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) return setPwMsg({ type: 'error', text: 'Remplissez tous les champs.' })
    if (pwForm.next.length < 6) return setPwMsg({ type: 'error', text: 'Nouveau mot de passe trop court (min 6 car.).' })
    if (pwForm.next !== pwForm.confirm) return setPwMsg({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas.' })
    const res = changePassword({ current: pwForm.current, next: pwForm.next })
    if (res.error) return setPwMsg({ type: 'error', text: res.error })
    setPwForm({ current: '', next: '', confirm: '' })
    setPwMsg({ type: 'success', text: 'Mot de passe modifié avec succès.' })
    setTimeout(() => setPwMsg(null), 3000)
  }

  const handleLogout = () => { logout(); navigate('/') }

  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const memberSince = new Date(user.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })

  return (
    <Box sx={{ pt: 12, pb: 10, minHeight: '100vh', background: '#0a0a0f' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>

          {/* ── SIDEBAR ── */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, bgcolor: '#12121f', border: '1px solid rgba(123,47,255,0.2)', textAlign: 'center', mb: 2 }}>
              <Avatar sx={{
                width: 72, height: 72, mx: 'auto', mb: 1.5,
                bgcolor: '#7b2fff', fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '1.5rem',
                boxShadow: '0 0 20px rgba(123,47,255,0.5)',
              }}>
                {initials}
              </Avatar>
              <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '1rem', color: '#fff', mb: 0.3 }}>
                {user.name}
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', mb: 1.5 }}>
                {user.email}
              </Typography>
              <Chip
                label={`Membre depuis ${memberSince}`}
                size="small"
                sx={{ bgcolor: 'rgba(123,47,255,0.1)', border: '1px solid rgba(123,47,255,0.3)', color: '#a78bfa', fontSize: '0.68rem' }}
              />
            </Paper>

            {/* Nav */}
            <Paper sx={{ bgcolor: '#12121f', border: '1px solid rgba(123,47,255,0.15)', overflow: 'hidden' }}>
              {[
                { icon: <PersonIcon sx={{ fontSize: '1rem' }} />,      label: 'Mon Profil',     idx: 0 },
                { icon: <ShoppingBagIcon sx={{ fontSize: '1rem' }} />, label: 'Mes Commandes',  idx: 1 },
                { icon: <LockIcon sx={{ fontSize: '1rem' }} />,        label: 'Sécurité',       idx: 2 },
              ].map(({ icon, label, idx }) => (
                <Box
                  key={idx}
                  onClick={() => setTab(idx)}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1.8,
                    cursor: 'pointer', transition: 'all 0.2s',
                    borderLeft: `3px solid ${tab === idx ? '#7b2fff' : 'transparent'}`,
                    bgcolor: tab === idx ? 'rgba(123,47,255,0.08)' : 'transparent',
                    color: tab === idx ? '#fff' : 'rgba(255,255,255,0.4)',
                    '&:hover': { bgcolor: 'rgba(123,47,255,0.06)', color: 'rgba(255,255,255,0.75)' },
                  }}
                >
                  {icon}
                  <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 600, fontSize: '0.85rem' }}>{label}</Typography>
                </Box>
              ))}
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
              <Box
                onClick={handleLogout}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1.8,
                  cursor: 'pointer', color: 'rgba(255,45,85,0.6)',
                  '&:hover': { bgcolor: 'rgba(255,45,85,0.06)', color: '#ff2d55' },
                  transition: 'all 0.2s',
                }}
              >
                <LogoutIcon sx={{ fontSize: '1rem' }} />
                <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 600, fontSize: '0.85rem' }}>Déconnexion</Typography>
              </Box>
            </Paper>
          </Grid>

          {/* ── MAIN CONTENT ── */}
          <Grid item xs={12} md={9}>

            {/* ── PROFILE TAB ── */}
            {tab === 0 && (
              <Paper sx={{ p: { xs: 3, md: 4 }, bgcolor: '#12121f', border: '1px solid rgba(123,47,255,0.2)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <SectionTitle>Informations personnelles</SectionTitle>
                  <IconButton
                    size="small"
                    onClick={() => editing ? handleSaveProfile() : setEditing(true)}
                    sx={{
                      color: editing ? '#00fff7' : '#7b2fff',
                      border: '1px solid', borderColor: editing ? 'rgba(0,255,247,0.4)' : 'rgba(123,47,255,0.3)',
                      borderRadius: 1, p: 0.8,
                      '&:hover': { bgcolor: editing ? 'rgba(0,255,247,0.08)' : 'rgba(123,47,255,0.08)' },
                    }}
                  >
                    {editing ? <SaveIcon sx={{ fontSize: '1rem' }} /> : <EditIcon sx={{ fontSize: '1rem' }} />}
                  </IconButton>
                </Box>

                {profileMsg && (
                  <Alert severity={profileMsg.type} sx={{ mb: 2.5, bgcolor: profileMsg.type === 'success' ? 'rgba(0,255,65,0.08)' : 'rgba(255,45,85,0.08)', border: `1px solid ${profileMsg.type === 'success' ? 'rgba(0,255,65,0.3)' : 'rgba(255,45,85,0.3)'}`, color: profileMsg.type === 'success' ? '#00ff41' : '#ff6b8a', '& .MuiAlert-icon': { color: profileMsg.type === 'success' ? '#00ff41' : '#ff2d55' } }}>
                    {profileMsg.text}
                  </Alert>
                )}

                <Grid container spacing={2.5}>
                  {[
                    { label: 'Nom complet',   key: 'name',  type: 'text',  half: true },
                    { label: 'Email',          key: 'email', type: 'email', half: true, disabled: true },
                    { label: 'Téléphone',      key: 'phone', type: 'tel',   half: true },
                    { label: 'Ville',          key: 'city',  type: 'text',  half: true },
                  ].map(({ label, key, type, half, disabled }) => (
                    <Grid item xs={12} sm={half ? 6 : 12} key={key}>
                      <TextField
                        label={label}
                        type={type}
                        fullWidth
                        disabled={!editing || disabled}
                        value={profile[key]}
                        onChange={e => setProfile(f => ({ ...f, [key]: e.target.value }))}
                        helperText={disabled ? 'Non modifiable' : ''}
                        sx={{ ...fieldSx, '& .MuiFormHelperText-root': { color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem' } }}
                      />
                    </Grid>
                  ))}
                </Grid>

                {editing && (
                  <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
                    <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSaveProfile}>
                      Enregistrer
                    </Button>
                    <Button variant="outlined" onClick={() => { setEditing(false); setProfile({ name: user.name, email: user.email, phone: user.phone || '', city: user.city || '' }) }}
                      sx={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: '#fff', color: '#fff' } }}
                    >
                      Annuler
                    </Button>
                  </Box>
                )}
              </Paper>
            )}

            {/* ── ORDERS TAB ── */}
            {tab === 1 && (
              <Paper sx={{ p: { xs: 3, md: 4 }, bgcolor: '#12121f', border: '1px solid rgba(123,47,255,0.2)' }}>
                <SectionTitle>Historique des commandes</SectionTitle>
                {MOCK_ORDERS.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography sx={{ fontSize: '3rem', mb: 2, opacity: 0.2 }}>📦</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontFamily: "'Fira Code'" }}>Aucune commande pour le moment</Typography>
                  </Box>
                ) : (
                  <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {MOCK_ORDERS.map((order, i) => {
                      const s = STATUS_COLORS[order.status] || STATUS_COLORS['En cours']
                      return (
                        <Paper key={order.id} sx={{ p: 2.5, bgcolor: '#0f0f1a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 1.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>
                                  #{order.id}
                                </Typography>
                                <Chip label={order.status} size="small"
                                  icon={order.status === 'Livré' ? <CheckCircleIcon sx={{ fontSize: '0.75rem !important', color: `${s.color} !important` }} /> : undefined}
                                  sx={{ bgcolor: s.bg, border: `1px solid ${s.border}`, color: s.color, fontSize: '0.68rem', height: 20 }}
                                />
                              </Box>
                              <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>
                                {new Date(order.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </Typography>
                              <Typography sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
                                {order.items.join(' · ')}
                              </Typography>
                            </Box>
                            <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '0.95rem', color: '#7b2fff' }}>
                              {order.total.toLocaleString()} MRU
                            </Typography>
                          </Box>
                        </Paper>
                      )
                    })}
                  </List>
                )}
              </Paper>
            )}

            {/* ── SECURITY TAB ── */}
            {tab === 2 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Paper sx={{ p: { xs: 3, md: 4 }, bgcolor: '#12121f', border: '1px solid rgba(123,47,255,0.2)' }}>
                  <SectionTitle>Changer le mot de passe</SectionTitle>

                  {pwMsg && (
                    <Alert severity={pwMsg.type} sx={{ mb: 2.5, bgcolor: pwMsg.type === 'success' ? 'rgba(0,255,65,0.08)' : 'rgba(255,45,85,0.08)', border: `1px solid ${pwMsg.type === 'success' ? 'rgba(0,255,65,0.3)' : 'rgba(255,45,85,0.3)'}`, color: pwMsg.type === 'success' ? '#00ff41' : '#ff6b8a', '& .MuiAlert-icon': { color: pwMsg.type === 'success' ? '#00ff41' : '#ff2d55' } }}>
                      {pwMsg.text}
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleChangePassword} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {[
                      { label: 'Mot de passe actuel',     key: 'current' },
                      { label: 'Nouveau mot de passe',    key: 'next' },
                      { label: 'Confirmer le nouveau',    key: 'confirm' },
                    ].map(({ label, key }) => (
                      <TextField
                        key={key}
                        label={label}
                        type={showPw ? 'text' : 'password'}
                        fullWidth
                        value={pwForm[key]}
                        onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))}
                        sx={fieldSx}
                      />
                    ))}
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <Button type="submit" variant="contained" color="primary" startIcon={<LockIcon />}>
                        Mettre à jour
                      </Button>
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() => setShowPw(v => !v)}
                        sx={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.45)', '&:hover': { borderColor: '#fff', color: '#fff' } }}
                      >
                        {showPw ? 'Masquer' : 'Afficher'}
                      </Button>
                    </Box>
                  </Box>
                </Paper>

                {/* Danger zone */}
                <Paper sx={{ p: { xs: 3, md: 4 }, bgcolor: '#12121f', border: '1px solid rgba(255,45,85,0.2)' }}>
                  <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '0.75rem', color: '#ff2d55', letterSpacing: '0.15em', textTransform: 'uppercase', mb: 2 }}>
                    Zone de danger
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                      <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600 }}>
                        Supprimer le compte
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', mt: 0.3 }}>
                        Cette action est irréversible. Toutes vos données seront supprimées.
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<DeleteForeverIcon />}
                      sx={{ borderColor: 'rgba(255,45,85,0.4)', color: '#ff2d55', flexShrink: 0, '&:hover': { borderColor: '#ff2d55', bgcolor: 'rgba(255,45,85,0.08)' } }}
                    >
                      Supprimer
                    </Button>
                  </Box>
                </Paper>
              </Box>
            )}

          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
