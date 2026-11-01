import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container, Box, Typography, Grid, Paper, TextField,
  Button, Divider, List, ListItem, Avatar, Stepper,
  Step, StepLabel, Radio, RadioGroup, FormControlLabel,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LockIcon from '@mui/icons-material/Lock'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../data/hardware'
import SectionHeader from '../components/SectionHeader'

const STEPS = ['Livraison', 'Paiement', 'Confirmation']

const ITEM_ICONS = {
  game: '🎮', consoles: '🎮', controllers: '🕹️',
  headsets: '🎧', pc: '💻', components: '⚙️',
  monitors: '🖥️', keyboards: '⌨️', mice: '🖱️', chairs: '🪑',
}

const inputSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: '#0f0f1a',
    '& fieldset': { borderColor: 'rgba(123,47,255,0.25)' },
    '&:hover fieldset': { borderColor: '#7b2fff' },
    '&.Mui-focused fieldset': { borderColor: '#7b2fff' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#7b2fff' },
  '& .MuiInputBase-input': { color: '#fff' },
}

export default function Checkout() {
  const navigate = useNavigate()
  const { items, totalPrice, clearCart } = useCart()
  const [step, setStep] = useState(0)
  const [payment, setPayment] = useState('cash')
  const [form, setForm] = useState({ name: '', phone: '', city: 'Nouakchott', address: '' })
  const [ordered, setOrdered] = useState(false)
  const [orderNum] = useState(() => Math.floor(Math.random() * 90000) + 10000)

  const shipping = totalPrice > 50000 ? 0 : 2500
  const grandTotal = totalPrice + shipping

  const handleOrder = () => {
    setOrdered(true)
    clearCart()
  }

  if (items.length === 0 && !ordered) {
    return (
      <Box sx={{ pt: 12, pb: 10, minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontSize: '4rem', mb: 2 }}>🛒</Typography>
          <Typography sx={{ fontFamily: "'Fira Code'", color: 'rgba(255,255,255,0.3)', mb: 3 }}>Votre panier est vide</Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/hardware')}>Voir le matériel</Button>
        </Box>
      </Box>
    )
  }

  if (ordered) {
    return (
      <Box sx={{ pt: 12, pb: 10, minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="sm">
          <Paper sx={{
            p: { xs: 4, md: 6 }, bgcolor: '#12121f', textAlign: 'center',
            border: '1px solid rgba(0,255,65,0.3)',
            boxShadow: '0 0 40px rgba(0,255,65,0.1)',
          }}>
            <CheckCircleIcon sx={{ fontSize: '4rem', color: '#00ff41', mb: 2, filter: 'drop-shadow(0 0 12px #00ff41)' }} />
            <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 900, fontSize: '1.5rem', color: '#fff', mb: 1 }}>
              Commande confirmée !
            </Typography>
            <Typography sx={{ fontFamily: "'Fira Code'", color: '#00fff7', fontSize: '0.85rem', mb: 0.5 }}>
              Commande #{orderNum}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', mb: 4, lineHeight: 1.8 }}>
              Merci {form.name || 'cher client'} !<br />
              Vous serez contacté au <strong style={{ color: '#fff' }}>{form.phone || 'votre numéro'}</strong> pour confirmer la livraison.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="contained" color="primary" onClick={() => navigate('/')}>Retour à l'accueil</Button>
              <Button variant="outlined" color="secondary" onClick={() => navigate('/hardware')}>Continuer les achats</Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ pt: 12, pb: 10, minHeight: '100vh', background: '#0a0a0f' }}>
      <Container maxWidth="lg">
        <SectionHeader title="Commande" subtitle="Finalisez votre achat" accentColor="#7b2fff" />

        {/* Stepper */}
        <Stepper activeStep={step} sx={{ mb: 5, maxWidth: 500, mx: 'auto',
          '& .MuiStepLabel-label': { fontFamily: "'Fira Code'", fontWeight: 700, color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' },
          '& .MuiStepLabel-label.Mui-active': { color: '#00fff7' },
          '& .MuiStepLabel-label.Mui-completed': { color: '#7b2fff' },
          '& .MuiStepIcon-root': { color: 'rgba(123,47,255,0.3)' },
          '& .MuiStepIcon-root.Mui-active': { color: '#7b2fff', filter: 'drop-shadow(0 0 6px #7b2fff)' },
          '& .MuiStepIcon-root.Mui-completed': { color: '#7b2fff' },
          '& .MuiStepConnector-line': { borderColor: 'rgba(123,47,255,0.2)' },
        }}>
          {STEPS.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
        </Stepper>

        <Grid container spacing={4}>
          {/* Left: form */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: { xs: 3, md: 4 }, bgcolor: '#12121f', border: '1px solid rgba(123,47,255,0.2)' }}>
              {step === 0 && (
                <Box>
                  <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '0.9rem', color: '#7b2fff', mb: 3, letterSpacing: '0.1em' }}>
                    INFORMATIONS DE LIVRAISON
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Nom complet" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} sx={inputSx} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Numéro de téléphone" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} sx={inputSx} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Ville" required value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} sx={inputSx} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Quartier / Zone" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} sx={inputSx} />
                    </Grid>
                  </Grid>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button
                      variant="contained" color="primary"
                      disabled={!form.name || !form.phone}
                      onClick={() => setStep(1)}
                      sx={{ px: 4 }}
                    >
                      Continuer
                    </Button>
                  </Box>
                </Box>
              )}

              {step === 1 && (
                <Box>
                  <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '0.9rem', color: '#7b2fff', mb: 3, letterSpacing: '0.1em' }}>
                    MODE DE PAIEMENT
                  </Typography>
                  <RadioGroup value={payment} onChange={e => setPayment(e.target.value)}>
                    {[
                      { value: 'cash', label: '💵 Paiement à la livraison', desc: 'Payez en cash à la réception de votre commande.' },
                      { value: 'bankily', label: '📱 Bankily', desc: 'Transfert mobile via Bankily (Mauritanie).' },
                      { value: 'masrivi', label: '📲 Masrivi', desc: 'Paiement via Masrivi.' },
                    ].map(opt => (
                      <Paper key={opt.value} onClick={() => setPayment(opt.value)} sx={{
                        p: 2, mb: 1.5, cursor: 'pointer',
                        bgcolor: payment === opt.value ? 'rgba(123,47,255,0.12)' : '#0f0f1a',
                        border: `1px solid ${payment === opt.value ? '#7b2fff' : 'rgba(255,255,255,0.08)'}`,
                        transition: 'all 0.2s',
                        '&:hover': { borderColor: 'rgba(123,47,255,0.5)' },
                      }}>
                        <FormControlLabel value={opt.value} control={
                          <Radio size="small" sx={{ color: 'rgba(255,255,255,0.3)', '&.Mui-checked': { color: '#7b2fff' } }} />
                        }
                          label={
                            <Box>
                              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>{opt.label}</Typography>
                              <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>{opt.desc}</Typography>
                            </Box>
                          }
                        />
                      </Paper>
                    ))}
                  </RadioGroup>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button startIcon={<ArrowBackIcon />} onClick={() => setStep(0)} sx={{ color: 'rgba(255,255,255,0.5)' }}>Retour</Button>
                    <Button variant="contained" color="primary" onClick={() => setStep(2)} sx={{ px: 4 }}>Continuer</Button>
                  </Box>
                </Box>
              )}

              {step === 2 && (
                <Box>
                  <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '0.9rem', color: '#7b2fff', mb: 3, letterSpacing: '0.1em' }}>
                    RÉCAPITULATIF
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                    {[
                      { label: 'Nom', value: form.name },
                      { label: 'Téléphone', value: form.phone },
                      { label: 'Ville', value: form.city + (form.address ? `, ${form.address}` : '') },
                      { label: 'Paiement', value: { cash: 'À la livraison', bankily: 'Bankily', masrivi: 'Masrivi' }[payment] },
                    ].map(({ label, value }) => (
                      <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>{label}</Typography>
                        <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>{value}</Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button startIcon={<ArrowBackIcon />} onClick={() => setStep(1)} sx={{ color: 'rgba(255,255,255,0.5)' }}>Retour</Button>
                    <Button
                      variant="contained" color="primary" size="large"
                      startIcon={<LockIcon />}
                      onClick={handleOrder}
                      sx={{ px: 4, background: 'linear-gradient(135deg, #00ff41, #00b832)', '&:hover': { background: 'linear-gradient(135deg,#00ff41,#00b832)', filter: 'brightness(1.15)' } }}
                    >
                      Confirmer la commande
                    </Button>
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Right: order summary */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, bgcolor: '#12121f', border: '1px solid rgba(123,47,255,0.2)', position: 'sticky', top: 90 }}>
              <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '0.8rem', color: '#7b2fff', letterSpacing: '0.12em', mb: 2 }}>
                VOTRE COMMANDE
              </Typography>
              <List disablePadding>
                {items.map(item => (
                  <ListItem key={`${item.itemType}-${item.id}`} disablePadding sx={{ mb: 1.5, gap: 1.5 }}>
                    <Avatar sx={{ width: 44, height: 44, borderRadius: 1, fontSize: '1.3rem', background: item.gradient || 'linear-gradient(135deg,#1a1a2e,#7b2fff)', flexShrink: 0 }}>
                      {ITEM_ICONS[item.category || item.itemType] || '📦'}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontFamily: "'Fira Code'", fontSize: '0.7rem', color: '#fff', fontWeight: 700, lineHeight: 1.3 }}>{item.name}</Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>x{item.quantity}</Typography>
                    </Box>
                    <Typography sx={{ fontFamily: "'Fira Code'", fontSize: '0.75rem', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                      {formatPrice(item.price * item.quantity)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ borderColor: 'rgba(123,47,255,0.15)', my: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[
                  { label: 'Sous-total', value: formatPrice(totalPrice) },
                  { label: 'Livraison', value: shipping === 0 ? 'GRATUITE 🎉' : formatPrice(shipping) },
                ].map(({ label, value }) => (
                  <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>{label}</Typography>
                    <Typography sx={{ color: shipping === 0 && label === 'Livraison' ? '#00ff41' : 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>{value}</Typography>
                  </Box>
                ))}
                <Divider sx={{ borderColor: 'rgba(123,47,255,0.1)', my: 0.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>TOTAL</Typography>
                  <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 900, fontSize: '1rem', color: '#7b2fff', textShadow: '0 0 10px rgba(123,47,255,0.5)' }}>
                    {formatPrice(grandTotal)}
                  </Typography>
                </Box>
              </Box>
              {shipping > 0 && (
                <Typography sx={{ mt: 2, fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
                  Livraison gratuite à partir de {formatPrice(50000)}
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

