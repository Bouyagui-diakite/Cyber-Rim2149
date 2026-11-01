import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Box, Container, Typography, Button, Grid, Chip,
  Paper, Divider, Snackbar, Alert, List, ListItem,
  ListItemIcon, ListItemText,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import CheckIcon from '@mui/icons-material/Check'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { motion } from 'framer-motion'
import { HARDWARE_ITEMS, formatPrice } from '../data/hardware'
import { useCart } from '../context/CartContext'
import HardwareCard from '../components/HardwareCard'

const CATEGORY_ICONS = {
  consoles: '🎮', controllers: '🕹️', headsets: '🎧',
  pc: '💻', components: '⚙️', monitors: '🖥️',
  keyboards: '⌨️', mice: '🖱️', chairs: '🪑',
}

export default function HardwareDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { addItem } = useCart()
  const [justAdded, setJustAdded] = useState(false)
  const [snack, setSnack] = useState(false)

  const item = HARDWARE_ITEMS.find(h => h.slug === slug)

  if (!item) {
    return (
      <Box sx={{ pt: 14, textAlign: 'center', minHeight: '100vh', background: '#0a0a0f' }}>
        <Typography sx={{ fontFamily: "'Fira Code'", color: 'rgba(255,255,255,0.3)', fontSize: '1.5rem' }}>
          Produit introuvable
        </Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/hardware')} variant="outlined" color="primary">
          Retour au catalogue
        </Button>
      </Box>
    )
  }

  const lang = i18n.language in (item.description || {}) ? i18n.language : 'fr'

  const related = HARDWARE_ITEMS
    .filter(h => h.id !== item.id && h.category === item.category)
    .slice(0, 3)

  const handleAddToCart = () => {
    addItem({ ...item, itemType: 'hardware' })
    setJustAdded(true)
    setSnack(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  const badge = item.badge ? {
    bestseller: { label: '🔥 BEST-SELLER', color: '#ff2d55' },
    pro:        { label: '⭐ PRO',         color: '#ffd700' },
    featured:   { label: '✨ FEATURED',    color: '#00fff7' },
  }[item.badge] : null

  return (
    <Box sx={{ minHeight: '100vh', background: '#0a0a0f' }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <Box sx={{ position: 'relative', minHeight: { xs: 380, md: 460 }, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: item.gradient, opacity: 0.85 }} />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,15,0.2) 0%, rgba(10,10,15,0.97) 100%)' }} />
        {/* grid overlay */}
        <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

        {/* Floating product image */}
        {item.image && (
          <Box sx={{ position: 'absolute', right: { xs: -40, md: '7%' }, top: '50%', transform: 'translateY(-50%)', width: { xs: 180, md: 300 }, opacity: { xs: 0.12, md: 0.5 }, filter: 'drop-shadow(0 0 50px rgba(0,0,0,0.9))', pointerEvents: 'none' }}>
            <Box component="img" src={item.image} alt={item.name} sx={{ width: '100%', objectFit: 'contain' }} />
          </Box>
        )}

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pb: 5, pt: 14 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/hardware')}
            sx={{ mb: 3, color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', p: 0, '&:hover': { color: '#fff' } }}>
            Catalogue
          </Button>

          <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
            <Chip label={CATEGORY_ICONS[item.category] + ' ' + t(`categories.${item.category}`)} size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: item.accentColor, border: `1px solid ${item.accentColor}40`, fontWeight: 600 }} />
            {badge && (
              <Chip label={badge.label} size="small"
                sx={{ bgcolor: 'rgba(0,0,0,0.3)', border: `1px solid ${badge.color}60`, color: badge.color, fontWeight: 700, fontSize: '0.7rem' }} />
            )}
            <Chip
              label={item.inStock ? '● En stock' : '○ Rupture'}
              size="small"
              sx={{ bgcolor: 'rgba(0,0,0,0.3)', color: item.inStock ? '#00ff41' : '#ff2d55', border: `1px solid ${item.inStock ? '#00ff41' : '#ff2d55'}40`, fontWeight: 600 }}
            />
          </Box>

          <Typography sx={{ color: item.accentColor, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', mb: 0.5 }}>
            {item.brand}
          </Typography>
          <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: { xs: '1.8rem', md: '2.8rem' }, color: '#fff', lineHeight: 1.1, mb: 2, textShadow: `0 0 40px ${item.accentColor}40` }}>
            {item.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 900, fontSize: '1.8rem', color: item.accentColor, textShadow: `0 0 20px ${item.accentColor}80` }}>
              {formatPrice(item.price)}
            </Typography>
            <Button variant="contained" color="primary" size="large" startIcon={<FlashOnIcon />}
              onClick={handleAddToCart} disabled={!item.inStock} sx={{ fontSize: '0.9rem', py: 1.2, px: 3 }}>
              Acheter maintenant
            </Button>
            <Button variant="outlined" size="large" onClick={handleAddToCart} disabled={!item.inStock}
              startIcon={justAdded ? <CheckIcon /> : <ShoppingCartIcon />}
              sx={{ borderColor: justAdded ? '#00ff41' : 'rgba(123,47,255,0.5)', color: justAdded ? '#00ff41' : '#7b2fff', py: 1.2, px: 2.5, transition: 'all 0.3s', '&:hover': { borderColor: '#7b2fff', bgcolor: 'rgba(123,47,255,0.08)' } }}>
              {justAdded ? 'Ajouté !' : 'Panier'}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ── BODY ──────────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={5}>

          {/* Left — description + specs */}
          <Grid item xs={12} md={8}>

            {/* Large product image */}
            {item.image && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <Box sx={{ mb: 5, borderRadius: 2, overflow: 'hidden', border: `1px solid ${item.accentColor}20`, background: item.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
                  <Box component="img" src={item.image} alt={item.name} loading="lazy"
                    sx={{ maxHeight: 340, maxWidth: '100%', objectFit: 'contain', p: 3, filter: 'drop-shadow(0 10px 40px rgba(0,0,0,0.6))' }} />
                </Box>
              </motion.div>
            )}

            {/* Description */}
            {item.longDescription && (
              <Box sx={{ mb: 5 }}>
                <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '0.78rem', color: item.accentColor, letterSpacing: '0.15em', textTransform: 'uppercase', mb: 2 }}>
                  // À propos
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.9, fontSize: '0.95rem' }}>
                  {item.longDescription[lang]}
                </Typography>
              </Box>
            )}

            {/* Specs */}
            <Box sx={{ mb: 5 }}>
              <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '0.78rem', color: item.accentColor, letterSpacing: '0.15em', textTransform: 'uppercase', mb: 2 }}>
                // Spécifications
              </Typography>
              <Paper sx={{ bgcolor: '#12121f', border: `1px solid ${item.accentColor}20`, overflow: 'hidden' }}>
                {item.specs.map((spec, i) => (
                  <Box key={spec}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 1.8 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: item.accentColor, flexShrink: 0, boxShadow: `0 0 8px ${item.accentColor}` }} />
                      <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontFamily: "'Fira Code'", fontSize: '0.88rem' }}>
                        {spec}
                      </Typography>
                    </Box>
                    {i < item.specs.length - 1 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.04)' }} />}
                  </Box>
                ))}
              </Paper>
            </Box>
          </Grid>

          {/* Right — sidebar */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 90, display: 'flex', flexDirection: 'column', gap: 2 }}>

              {/* Buy card */}
              <Paper sx={{ p: 3, bgcolor: '#12121f', border: `1px solid ${item.accentColor}25` }}>
                <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 900, fontSize: '1.6rem', color: item.accentColor, mb: 0.5 }}>
                  {formatPrice(item.price)}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', mb: 2.5 }}>
                  Livraison 24–48h — Mauritanie
                </Typography>
                <Button fullWidth variant="contained" color="primary" size="large" startIcon={<FlashOnIcon />}
                  onClick={handleAddToCart} disabled={!item.inStock} sx={{ mb: 1.2, py: 1.2 }}>
                  Acheter maintenant
                </Button>
                <Button fullWidth variant="outlined" size="medium" onClick={handleAddToCart} disabled={!item.inStock}
                  startIcon={justAdded ? <CheckIcon /> : <ShoppingCartIcon />}
                  sx={{ borderColor: justAdded ? '#00ff41' : 'rgba(123,47,255,0.4)', color: justAdded ? '#00ff41' : '#7b2fff', py: 1, transition: 'all 0.3s', '&:hover': { borderColor: '#7b2fff', bgcolor: 'rgba(123,47,255,0.08)' } }}>
                  {justAdded ? 'Ajouté au panier' : 'Ajouter au panier'}
                </Button>
                {!item.inStock && (
                  <Typography sx={{ mt: 1.5, fontSize: '0.78rem', color: '#ff2d55', textAlign: 'center' }}>
                    Rupture de stock — disponible prochainement
                  </Typography>
                )}
              </Paper>

              {/* Product info */}
              <Paper sx={{ p: 3, bgcolor: '#12121f', border: `1px solid ${item.accentColor}25` }}>
                <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '0.75rem', color: item.accentColor, letterSpacing: '0.15em', mb: 2 }}>
                  INFORMATIONS
                </Typography>
                {[
                  { label: 'Marque',     value: item.brand },
                  { label: 'Catégorie',  value: t(`categories.${item.category}`) },
                  { label: 'Référence',  value: `CYB-${String(item.id).padStart(3,'0')}` },
                  { label: 'Stock',      value: item.inStock ? 'Disponible' : 'Rupture' },
                ].map(({ label, value }) => (
                  <Box key={label}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.2 }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem' }}>{label}</Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.82rem', fontWeight: 600 }}>{value}</Typography>
                    </Box>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
                  </Box>
                ))}
              </Paper>

              {/* Key features */}
              {item.features && (
                <Paper sx={{ p: 3, bgcolor: '#12121f', border: `1px solid ${item.accentColor}25` }}>
                  <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '0.75rem', color: item.accentColor, letterSpacing: '0.15em', mb: 2 }}>
                    POINTS FORTS
                  </Typography>
                  <List dense disablePadding>
                    {item.features.map((f, i) => (
                      <ListItem key={i} disablePadding sx={{ py: 0.4 }}>
                        <ListItemIcon sx={{ minWidth: 22 }}>
                          <CheckCircleOutlineIcon sx={{ fontSize: '0.8rem', color: item.accentColor }} />
                        </ListItemIcon>
                        <ListItemText primary={f}
                          primaryTypographyProps={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.4 }} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* ── RELATED PRODUCTS ── */}
        {related.length > 0 && (
          <Box sx={{ mt: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box sx={{ width: 3, height: 28, bgcolor: item.accentColor, borderRadius: 1, boxShadow: `0 0 10px ${item.accentColor}` }} />
              <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
                Dans la même catégorie
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {related.map(h => (
                <Grid item xs={12} sm={6} md={4} key={h.id}>
                  <HardwareCard item={h} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>

      <Snackbar open={snack} autoHideDuration={2000} onClose={() => setSnack(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnack(false)} severity="success" variant="filled"
          sx={{ bgcolor: '#12121f', border: '1px solid rgba(0,255,65,0.4)', color: '#fff', fontFamily: "'Fira Code'", '& .MuiAlert-icon': { color: '#00ff41' } }}>
          {item.name} ajouté au panier
        </Alert>
      </Snackbar>
    </Box>
  )
}
