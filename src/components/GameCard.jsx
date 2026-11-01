import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardMedia, CardActions, Box, Typography, Chip, Button, Rating, Snackbar, Alert } from '@mui/material'
import { motion } from 'framer-motion'
import StarIcon from '@mui/icons-material/Star'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import CheckIcon from '@mui/icons-material/Check'
import { useCart } from '../context/CartContext'

export default function GameCard({ game }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language in game.description ? i18n.language : 'fr'
  const { addItem } = useCart()
  const [snack, setSnack] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const handleAddToCart = () => {
    addItem({ id: game.id, name: game.title, price: game.price, itemType: 'game', category: 'game', gradient: game.gradient, accentColor: game.accentColor })
    setSnack(true)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
  }

  const badgeColor = game.badge === 'new'
    ? { bg: 'rgba(0,255,247,0.15)', border: 'rgba(0,255,247,0.5)', color: '#00fff7' }
    : { bg: 'rgba(255,45,85,0.15)', border: 'rgba(255,45,85,0.5)', color: '#ff2d55' }

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      style={{ height: '100%' }}
    >
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Game cover / gradient */}
      <Box component={Link} to={`/games/${game.slug}`} sx={{ position: 'relative', height: 200, overflow: 'hidden', display: 'block', textDecoration: 'none' }}>
        {game.cover ? (
          <CardMedia
            component="img"
            image={game.cover}
            alt={game.title}
            sx={{ height: '100%', objectFit: 'cover', filter: 'brightness(0.85)', transition: 'transform 0.4s ease', '.MuiCard-root:hover &': { transform: 'scale(1.05)' } }}
          />
        ) : (
          <Box sx={{
            height: '100%',
            background: game.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3.5rem',
          }}>
            🎮
          </Box>
        )}
        {/* Overlay gradient */}
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,0.95) 0%, transparent 60%)' }} />

        {/* Badge */}
        {game.badge && (
          <Chip
            label={t(`games.${game.badge}`)}
            size="small"
            sx={{
              position: 'absolute', top: 10, right: 10,
              bgcolor: badgeColor.bg,
              border: `1px solid ${badgeColor.border}`,
              color: badgeColor.color,
              fontFamily: "'Fira Code'",
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              fontWeight: 700,
            }}
          />
        )}

        {/* Platforms */}
        <Box sx={{ position: 'absolute', bottom: 8, left: 10, display: 'flex', gap: 0.5 }}>
          {game.platform.map(p => (
            <Chip key={p} label={p} size="small"
              sx={{ bgcolor: 'rgba(0,0,0,0.7)', color: 'rgba(255,255,255,0.7)', fontSize: '0.6rem', height: 20, border: '1px solid rgba(255,255,255,0.15)' }}
            />
          ))}
        </Box>
      </Box>

      <CardContent sx={{ flex: 1, pb: 1 }}>
        <Typography variant="caption" sx={{ color: game.accentColor, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.7rem' }}>
          {game.genre}
        </Typography>
        <Typography component={Link} to={`/games/${game.slug}`} variant="h6"
          sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '1rem', mt: 0.3, lineHeight: 1.3, color: '#fff', textDecoration: 'none', display: 'block', '&:hover': { color: game.accentColor, transition: 'color 0.2s' } }}
        >
          {game.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.8, mb: 1 }}>
          <Rating value={game.rating / 2} precision={0.1} readOnly size="small"
            emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
            sx={{ '& .MuiRating-iconFilled': { color: '#ffd700' } }}
          />
          <Typography sx={{ fontSize: '0.8rem', color: '#a0a0b8', fontWeight: 600 }}>{game.rating}/10</Typography>
        </Box>
        <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
          {game.description[lang]}
        </Typography>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '1rem', color: game.accentColor }}>
          {game.price.toLocaleString()} MRU
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.8 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleAddToCart}
            sx={{
              borderColor: justAdded ? '#00ff41' : 'rgba(123,47,255,0.4)',
              color: justAdded ? '#00ff41' : '#7b2fff',
              fontSize: '0.75rem',
              py: 0.5,
              px: 1.2,
              minWidth: 36,
              transition: 'all 0.3s',
              '&:hover': { borderColor: '#7b2fff', bgcolor: 'rgba(123,47,255,0.08)' },
            }}
          >
            {justAdded ? <CheckIcon sx={{ fontSize: '0.9rem' }} /> : <ShoppingCartIcon sx={{ fontSize: '0.9rem' }} />}
          </Button>
        </Box>
      </CardActions>

      <Snackbar open={snack} autoHideDuration={2000} onClose={() => setSnack(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnack(false)} severity="success" variant="filled"
          sx={{ bgcolor: '#12121f', border: '1px solid rgba(0,255,65,0.4)', color: '#fff', fontFamily: "'Fira Code'", fontWeight: 600,
            '& .MuiAlert-icon': { color: '#00ff41' } }}
        >
          {game.title} ajouté au panier
        </Alert>
      </Snackbar>
    </Card>
    </motion.div>
  )
}

