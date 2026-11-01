import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardActions, Box, Typography, Chip, Button, List, ListItem, ListItemIcon, ListItemText, Snackbar, Alert } from '@mui/material'
import { motion } from 'framer-motion'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CheckIcon from '@mui/icons-material/Check'
import { formatPrice } from '../data/hardware'
import { useCart } from '../context/CartContext'

const CATEGORY_ICONS = {
  consoles: '🎮',
  controllers: '🕹️',
  headsets: '🎧',
  pc: '💻',
  components: '⚙️',
  monitors: '🖥️',
  keyboards: '⌨️',
  mice: '🖱️',
  chairs: '🪑',
}

export default function HardwareCard({ item }) {
  const { t } = useTranslation()
  const { addItem } = useCart()
  const [snack, setSnack] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const handleAddToCart = () => {
    addItem({ ...item, itemType: 'hardware' })
    setSnack(true)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
  }

  const badgeConfig = {
    bestseller: { label: '🔥 BEST-SELLER', color: '#ff2d55', bg: 'rgba(255,45,85,0.15)', border: 'rgba(255,45,85,0.5)' },
    pro: { label: '⭐ PRO', color: '#ffd700', bg: 'rgba(255,215,0,0.12)', border: 'rgba(255,215,0,0.4)' },
    featured: { label: '✨ FEATURED', color: '#00fff7', bg: 'rgba(0,255,247,0.12)', border: 'rgba(0,255,247,0.4)' },
  }

  const badge = item.badge ? badgeConfig[item.badge] : null

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      style={{ height: '100%' }}
    >
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {badge && (
        <Chip
          label={badge.label}
          size="small"
          sx={{
            position: 'absolute', top: 12, right: 12, zIndex: 1,
            bgcolor: badge.bg, border: `1px solid ${badge.border}`,
            color: badge.color, fontFamily: "'Fira Code'", fontSize: '0.65rem', letterSpacing: '0.12em',
          }}
        />
      )}

      {/* Visual */}
      <Box component={Link} to={`/hardware/${item.slug}`}
        sx={{ height: 160, position: 'relative', overflow: 'hidden', background: item.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', textDecoration: 'none', cursor: 'pointer' }}>
        {item.image ? (
          <Box
            component="img"
            src={item.image}
            alt={item.name}
            loading="lazy"
            sx={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', p: 1.5, transition: 'transform 0.4s ease', '.MuiCard-root:hover &': { transform: 'scale(1.06)' } }}
          />
        ) : (
          CATEGORY_ICONS[item.category] || '📦'
        )}
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(18,18,31,0.7) 0%, transparent 50%)', pointerEvents: 'none' }} />
      </Box>

      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
          <Box>
            <Typography variant="caption" sx={{ color: item.accentColor, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.68rem' }}>
              {item.brand}
            </Typography>
            <Typography component={Link} to={`/hardware/${item.slug}`}
              sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '0.95rem', color: '#fff', lineHeight: 1.3, textDecoration: 'none', display: 'block', '&:hover': { color: item.accentColor, transition: 'color 0.2s' } }}>
              {item.name}
            </Typography>
          </Box>
          <Chip
            label={t(`categories.${item.category}`)}
            size="small"
            sx={{ bgcolor: 'rgba(123,47,255,0.12)', border: '1px solid rgba(123,47,255,0.3)', color: '#a78bfa', fontSize: '0.65rem', mt: 0.5 }}
          />
        </Box>

        {/* Specs */}
        <List dense disablePadding sx={{ mt: 1 }}>
          {item.specs.map((spec) => (
            <ListItem key={spec} disablePadding sx={{ py: 0.1 }}>
              <ListItemIcon sx={{ minWidth: 20 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: '0.75rem', color: item.accentColor }} />
              </ListItemIcon>
              <ListItemText
                primary={spec}
                primaryTypographyProps={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontFamily: "'Fira Code'", fontWeight: 500 }}
              />
            </ListItem>
          ))}
        </List>

        {/* Stock */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1.5 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.inStock ? '#00ff41' : '#ff2d55', boxShadow: `0 0 6px ${item.inStock ? '#00ff41' : '#ff2d55'}` }} />
          <Typography sx={{ fontSize: '0.75rem', color: item.inStock ? '#00ff41' : '#ff2d55', fontWeight: 600 }}>
            {item.inStock ? t('hardware.available') : t('hardware.out_of_stock')}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0, flexDirection: 'column', gap: 1 }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 900, fontSize: '1.05rem', color: item.accentColor }}>
            {formatPrice(item.price)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            fullWidth
            disabled={!item.inStock}
            startIcon={<FlashOnIcon />}
            onClick={handleAddToCart}
            sx={{ fontSize: '0.75rem', py: 0.8 }}
          >
            {t('hardware.buy_now')}
          </Button>
          <Button
            variant="outlined"
            size="small"
            disabled={!item.inStock}
            onClick={handleAddToCart}
            sx={{
              borderColor: justAdded ? '#00ff41' : 'rgba(123,47,255,0.4)',
              color: justAdded ? '#00ff41' : '#7b2fff',
              minWidth: 40, px: 1,
              transition: 'all 0.3s',
              '&:hover': { borderColor: '#7b2fff', bgcolor: 'rgba(123,47,255,0.08)' },
            }}
          >
            {justAdded ? <CheckIcon sx={{ fontSize: '1rem' }} /> : <ShoppingCartIcon sx={{ fontSize: '1rem' }} />}
          </Button>
        </Box>
      </CardActions>

      <Snackbar open={snack} autoHideDuration={2000} onClose={() => setSnack(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnack(false)} severity="success" variant="filled"
          sx={{ bgcolor: '#12121f', border: '1px solid rgba(0,255,65,0.4)', color: '#fff', fontFamily: "'Fira Code'", fontWeight: 600,
            '& .MuiAlert-icon': { color: '#00ff41' } }}
        >
          {item.name} ajouté au panier
        </Alert>
      </Snackbar>
    </Card>
    </motion.div>
  )
}

