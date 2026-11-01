import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Box, Typography, TextField, Button, Grid, Paper } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import SectionHeader from '../components/SectionHeader'

export default function Contact() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setForm({ name: '', email: '', message: '' })
    setTimeout(() => setSent(false), 4000)
  }

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#0f0f1a',
      '& fieldset': { borderColor: 'rgba(123,47,255,0.3)' },
      '&:hover fieldset': { borderColor: '#7b2fff' },
      '&.Mui-focused fieldset': { borderColor: '#7b2fff', boxShadow: '0 0 10px rgba(123,47,255,0.2)' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#7b2fff' },
    '& .MuiInputBase-input': { color: '#fff' },
    '& .MuiInputBase-inputMultiline': { color: '#fff' },
  }

  return (
    <Box sx={{ pt: 12, pb: 10, minHeight: '100vh', background: '#0a0a0f' }}>
      <Container maxWidth="lg">
        <SectionHeader title={t('nav.contact')} subtitle="Envoyez-nous un message" accentColor="#7b2fff" />

        <Grid container spacing={4} justifyContent="center">
          {/* Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { Icon: LocationOnIcon, title: 'Adresse', text: 'Nouakchott, Mauritanie' },
                { Icon: PhoneIcon, title: 'Téléphone', text: '+222 XX XX XX XX' },
                { Icon: EmailIcon, title: 'Email', text: 'contact@cyberrim2149.mr' },
              ].map(({ Icon, title, text }) => (
                <Paper key={title} sx={{ p: 2.5, bgcolor: '#12121f', border: '1px solid rgba(123,47,255,0.2)', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1.2, bgcolor: 'rgba(123,47,255,0.12)', borderRadius: 1, border: '1px solid rgba(123,47,255,0.3)' }}>
                    <Icon sx={{ color: '#7b2fff', fontSize: '1.3rem' }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontFamily: "'Fira Code'", fontSize: '0.7rem', color: '#7b2fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{title}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', mt: 0.2 }}>{text}</Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Grid>

          {/* Form */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: { xs: 3, md: 4 }, bgcolor: '#12121f', border: '1px solid rgba(123,47,255,0.25)', boxShadow: '0 0 40px rgba(123,47,255,0.08)' }}>
              {sent ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography sx={{ fontSize: '3rem', mb: 2 }}>✅</Typography>
                  <Typography sx={{ fontFamily: "'Fira Code'", color: '#00ff41', fontWeight: 700 }}>Message envoyé !</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', mt: 1 }}>Nous vous répondrons dans les plus brefs délais.</Typography>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Votre nom" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} sx={inputSx} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Email" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} sx={inputSx} />
                    </Grid>
                  </Grid>
                  <TextField fullWidth label="Message" multiline rows={5} required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} sx={inputSx} />
                  <Button type="submit" variant="contained" color="primary" size="large" endIcon={<SendIcon />} sx={{ alignSelf: 'flex-end', px: 4 }}>
                    Envoyer
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

