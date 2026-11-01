import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Box, Container, Typography, Button, Grid, Chip, Rating,
  Dialog, DialogContent, IconButton, Paper, Divider, Avatar,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import StarIcon from '@mui/icons-material/Star'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import BusinessIcon from '@mui/icons-material/Business'
import { FEATURED_GAMES } from '../data/games'
import { useCart } from '../context/CartContext'
import GameCard from '../components/GameCard'

const PLATFORM_COLORS = {
  PS5: '#003087',
  Xbox: '#107c10',
  PC: '#2d2d2d',
  Switch: '#e4000f',
}

export default function GameDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { addItem } = useCart()

  const [trailerOpen, setTrailerOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [justAdded, setJustAdded] = useState(false)

  const game = FEATURED_GAMES.find(g => g.slug === slug)
  if (!game) {
    return (
      <Box sx={{ pt: 14, textAlign: 'center', minHeight: '100vh', background: '#0a0a0f' }}>
        <Typography sx={{ fontFamily: "'Fira Code'", color: 'rgba(255,255,255,0.3)', fontSize: '1.5rem' }}>
          Jeu introuvable
        </Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/games')} variant="outlined" color="primary">
          Retour aux jeux
        </Button>
      </Box>
    )
  }

  const lang = i18n.language in (game.longDescription || {}) ? i18n.language : 'fr'
  const related = FEATURED_GAMES
    .filter(g => g.slug !== slug)
    .sort((a, b) => (b.genre === game.genre ? 1 : 0) - (a.genre === game.genre ? 1 : 0) || b.rating - a.rating)
    .slice(0, 3)

  const handleAddToCart = () => {
    addItem({ id: game.id, name: game.title, price: game.price, itemType: 'game', category: 'game', gradient: game.gradient, accentColor: game.accentColor })
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#0a0a0f' }}>
      {/* ── HERO ── */}
      <Box sx={{
        position: 'relative',
        minHeight: { xs: 420, md: 520 },
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
      }}>
        {/* Background */}
        <Box sx={{
          position: 'absolute', inset: 0,
          background: game.gradient,
          filter: 'blur(0px)',
        }} />
        <Box sx={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,10,15,0.3) 0%, rgba(10,10,15,0.97) 100%)',
        }} />
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />

        {/* Cover art floating */}
        {game.cover && (
          <Box sx={{
            position: 'absolute',
            right: { xs: -60, md: '8%' },
            top: '50%',
            transform: 'translateY(-50%)',
            width: { xs: 200, md: 280 },
            opacity: { xs: 0.15, md: 0.45 },
            filter: 'drop-shadow(0 0 40px rgba(0,0,0,0.8))',
            pointerEvents: 'none',
          }}>
            <img src={game.cover} alt={game.title} onError={() => setHeroImgError(true)} style={{ width: '100%', borderRadius: 8 }} />
          </Box>
        )}

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pb: 5, pt: 14 }}>
          {/* Back */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/games')}
            sx={{ mb: 3, color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', '&:hover': { color: '#fff' }, p: 0 }}
          >
            Tous les jeux
          </Button>

          {/* Genre + badge */}
          <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
            <Chip label={game.genre} size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: game.accentColor, border: `1px solid ${game.accentColor}40`, fontWeight: 600, fontSize: '0.72rem' }}
            />
            {game.badge && (
              <Chip
                label={game.badge === 'new' ? '⚡ NOUVEAU' : '🔥 POPULAIRE'}
                size="small"
                sx={{
                  bgcolor: game.badge === 'new' ? 'rgba(0,255,247,0.12)' : 'rgba(255,45,85,0.12)',
                  border: `1px solid ${game.badge === 'new' ? 'rgba(0,255,247,0.4)' : 'rgba(255,45,85,0.4)'}`,
                  color: game.badge === 'new' ? '#00fff7' : '#ff2d55',
                  fontWeight: 700, fontSize: '0.7rem',
                }}
              />
            )}
          </Box>

          {/* Title */}
          <Typography sx={{
            fontFamily: "'Fira Code'", fontWeight: 700,
            fontSize: { xs: '2rem', md: '3.2rem' },
            color: '#fff', lineHeight: 1.1, mb: 1.5,
            textShadow: `0 0 40px ${game.accentColor}40`,
          }}>
            {game.title}
          </Typography>

          {/* Rating + meta */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Rating value={game.rating / 2} precision={0.1} readOnly size="small"
                emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
                sx={{ '& .MuiRating-iconFilled': { color: '#ffd700' } }}
              />
              <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, color: '#ffd700', fontSize: '0.9rem' }}>
                {game.rating}/10
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.6 }}>
              {game.platform.map(p => (
                <Chip key={p} label={p} size="small"
                  sx={{ bgcolor: PLATFORM_COLORS[p] || '#333', color: '#fff', fontSize: '0.65rem', height: 22, fontWeight: 600 }}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarTodayIcon sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>{game.releaseYear}</Typography>
            </Box>
          </Box>

          {/* CTA row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '1.8rem', color: game.accentColor, textShadow: `0 0 20px ${game.accentColor}80` }}>
              {game.price.toLocaleString()} MRU
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<FlashOnIcon />}
              onClick={handleAddToCart}
              sx={{ fontSize: '0.9rem', py: 1.2, px: 3 }}
            >
              Acheter maintenant
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={handleAddToCart}
              sx={{
                borderColor: justAdded ? '#00ff41' : 'rgba(123,47,255,0.5)',
                color: justAdded ? '#00ff41' : '#7b2fff',
                py: 1.2, px: 2.5, fontSize: '0.9rem',
                transition: 'all 0.3s',
                '&:hover': { borderColor: '#7b2fff', bgcolor: 'rgba(123,47,255,0.08)' },
              }}
              startIcon={justAdded ? <CheckIcon /> : <ShoppingCartIcon />}
            >
              {justAdded ? 'Ajouté !' : t('hardware.add_cart')}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ── BODY ── */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={5}>
          {/* Left col */}
          <Grid item xs={12} md={8}>

            {/* Trailer */}
            <Box sx={{ mb: 5 }}>
              <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '0.8rem', color: game.accentColor, letterSpacing: '0.15em', textTransform: 'uppercase', mb: 2 }}>
                // Bande-annonce
              </Typography>
              <Box
                onClick={() => setTrailerOpen(true)}
                sx={{
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: `1px solid ${game.accentColor}30`,
                  '&:hover .play-overlay': { bgcolor: 'rgba(0,0,0,0.5)' },
                  '&:hover .play-icon': { transform: 'scale(1.15)' },
                }}
              >
                <Box sx={{
                  height: { xs: 200, md: 360 },
                  background: game.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {game.cover && (
                    <img src={game.cover} alt={game.title}
                      style={{ height: '100%', width: '100%', objectFit: 'cover', opacity: 0.5, position: 'absolute', inset: 0 }}
                    />
                  )}
                </Box>
                <Box className="play-overlay" sx={{
                  position: 'absolute', inset: 0,
                  bgcolor: 'rgba(0,0,0,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s',
                  flexDirection: 'column', gap: 1.5,
                }}>
                  <Box className="play-icon" sx={{
                    width: 72, height: 72, borderRadius: '50%',
                    bgcolor: game.accentColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 30px ${game.accentColor}80`,
                    transition: 'transform 0.2s',
                  }}>
                    <PlayArrowIcon sx={{ fontSize: '2.5rem', color: '#000' }} />
                  </Box>
                  <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, color: '#fff', fontSize: '0.85rem', letterSpacing: '0.1em' }}>
                    VOIR LA BANDE-ANNONCE
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Description */}
            <Box sx={{ mb: 5 }}>
              <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '0.8rem', color: game.accentColor, letterSpacing: '0.15em', textTransform: 'uppercase', mb: 2 }}>
                // À propos du jeu
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.9, fontSize: '0.95rem' }}>
                {(game.longDescription || game.description)[lang]}
              </Typography>
            </Box>

            {/* Screenshots */}
            <Box sx={{ mb: 5 }}>
              <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '0.8rem', color: game.accentColor, letterSpacing: '0.15em', textTransform: 'uppercase', mb: 2 }}>
                // Captures d'écran
              </Typography>
              <Grid container spacing={1.5}>
                {game.screenshots.map((shot, idx) => (
                  <Grid item xs={6} sm={4} key={idx}>
                    <Box
                      onClick={() => setLightboxIndex(idx)}
                      sx={{
                        position: 'relative',
                        borderRadius: 1.5,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        aspectRatio: '16/9',
                        background: game.gradient,
                        border: '1px solid rgba(255,255,255,0.06)',
                        transition: 'all 0.25s',
                        '&:hover': {
                          transform: 'scale(1.03)',
                          border: `1px solid ${game.accentColor}60`,
                          boxShadow: `0 0 20px ${game.accentColor}30`,
                        },
                        '&:hover .shot-overlay': { opacity: 1 },
                      }}
                    >
                      <Box sx={{ position: 'absolute', inset: 0, bgcolor: shot.tint }} />
                      <Box sx={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2rem', opacity: 0.3,
                      }}>
                        🎮
                      </Box>
                      <Box className="shot-overlay" sx={{
                        position: 'absolute', inset: 0,
                        bgcolor: 'rgba(0,0,0,0.5)',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: 0.5,
                        opacity: 0, transition: 'opacity 0.2s',
                      }}>
                        <ZoomInIcon sx={{ color: '#fff', fontSize: '1.5rem' }} />
                        <Typography sx={{ fontFamily: "'Fira Code'", fontSize: '0.65rem', color: 'rgba(255,255,255,0.8)', textAlign: 'center', px: 1 }}>
                          {shot.label}
                        </Typography>
                      </Box>
                      <Box sx={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        p: 0.8, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                      }}>
                        <Typography sx={{ fontFamily: "'Fira Code'", fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)' }}>
                          {String(idx + 1).padStart(2, '0')} / {game.screenshots.length}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          {/* Right col — sidebar */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 90, display: 'flex', flexDirection: 'column', gap: 2 }}>

              {/* Game info card */}
              <Paper sx={{ p: 3, bgcolor: '#12121f', border: `1px solid ${game.accentColor}25` }}>
                <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '0.75rem', color: game.accentColor, letterSpacing: '0.15em', mb: 2 }}>
                  INFORMATIONS
                </Typography>
                {[
                  { icon: <BusinessIcon sx={{ fontSize: '0.9rem' }} />, label: 'Développeur', value: game.developer },
                  { icon: <BusinessIcon sx={{ fontSize: '0.9rem' }} />, label: 'Éditeur', value: game.publisher },
                  { icon: <CalendarTodayIcon sx={{ fontSize: '0.9rem' }} />, label: 'Sortie', value: game.releaseYear },
                  { icon: null, label: 'Genre', value: game.genre },
                ].map(({ label, value }) => (
                  <Box key={label}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.2 }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem' }}>{label}</Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.82rem', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{value}</Typography>
                    </Box>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
                  </Box>
                ))}
                {/* Platforms */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1.2, alignItems: 'flex-start' }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem' }}>Plateformes</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '60%' }}>
                    {game.platform.map(p => (
                      <Chip key={p} label={p} size="small"
                        sx={{ bgcolor: PLATFORM_COLORS[p] || '#333', color: '#fff', fontSize: '0.6rem', height: 20 }}
                      />
                    ))}
                  </Box>
                </Box>
              </Paper>

              {/* Features */}
              <Paper sx={{ p: 3, bgcolor: '#12121f', border: `1px solid ${game.accentColor}25` }}>
                <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '0.75rem', color: game.accentColor, letterSpacing: '0.15em', mb: 2 }}>
                  FONCTIONNALITÉS
                </Typography>
                {(game.features || []).map((f, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2, mb: 1.2 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: game.accentColor, mt: '5px', flexShrink: 0, boxShadow: `0 0 6px ${game.accentColor}` }} />
                    <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', lineHeight: 1.5 }}>{f}</Typography>
                  </Box>
                ))}
              </Paper>

              {/* Buy again CTA */}
              <Paper sx={{ p: 3, bgcolor: '#12121f', border: `1px solid ${game.accentColor}25`, textAlign: 'center' }}>
                <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 900, fontSize: '1.5rem', color: game.accentColor, mb: 0.5 }}>
                  {game.price.toLocaleString()} MRU
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', mb: 2 }}>
                  Livraison 24h — Mauritanie
                </Typography>
                <Button fullWidth variant="contained" color="primary" size="large" startIcon={<FlashOnIcon />}
                  onClick={handleAddToCart} sx={{ mb: 1, py: 1.2 }}
                >
                  Acheter maintenant
                </Button>
                <Button fullWidth variant="outlined" size="medium"
                  onClick={handleAddToCart}
                  sx={{
                    borderColor: justAdded ? '#00ff41' : 'rgba(123,47,255,0.4)',
                    color: justAdded ? '#00ff41' : '#7b2fff', py: 1,
                    '&:hover': { borderColor: '#7b2fff', bgcolor: 'rgba(123,47,255,0.08)' },
                  }}
                  startIcon={justAdded ? <CheckIcon /> : <ShoppingCartIcon />}
                >
                  {justAdded ? 'Ajouté au panier' : 'Ajouter au panier'}
                </Button>
              </Paper>
            </Box>
          </Grid>
        </Grid>

        {/* ── RELATED GAMES ── */}
        <Box sx={{ mt: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <Box sx={{ width: 3, height: 28, bgcolor: game.accentColor, borderRadius: 1, boxShadow: `0 0 10px ${game.accentColor}` }} />
            <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
              Vous aimerez aussi
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {related.map(g => (
              <Grid item xs={12} sm={6} md={4} key={g.id}>
                <GameCard game={g} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* ── TRAILER MODAL ── */}
      <Dialog
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { bgcolor: '#0a0a0f', border: `1px solid ${game.accentColor}40`, borderRadius: 2, overflow: 'visible' } }}
      >
        <IconButton
          onClick={() => setTrailerOpen(false)}
          sx={{ position: 'absolute', top: -16, right: -16, zIndex: 10, bgcolor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', '&:hover': { bgcolor: '#ff2d55' } }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ p: 0, aspectRatio: '16/9' }}>
          {game.trailerYoutubeId ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${game.trailerYoutubeId}?autoplay=1&rel=0`}
              title={`${game.title} — Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ display: 'block', borderRadius: 8 }}
            />
          ) : (
            <Box sx={{ height: '100%', background: game.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
              <Typography sx={{ fontFamily: "'Fira Code'", color: 'rgba(255,255,255,0.5)', fontSize: '1rem' }}>
                Bande-annonce bientôt disponible
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* ── SCREENSHOT LIGHTBOX ── */}
      <Dialog
        open={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { bgcolor: 'rgba(10,10,15,0.97)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2 } }}
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={() => setLightboxIndex(null)}
            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10, bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', '&:hover': { bgcolor: '#ff2d55' } }}
          >
            <CloseIcon />
          </IconButton>

          {lightboxIndex !== null && (
            <Box sx={{ aspectRatio: '16/9', position: 'relative', background: game.gradient }}>
              <Box sx={{ position: 'absolute', inset: 0, bgcolor: game.screenshots[lightboxIndex].tint }} />
              <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 1 }}>
                <Typography sx={{ fontSize: '5rem', opacity: 0.2 }}>🎮</Typography>
                <Typography sx={{ fontFamily: "'Fira Code'", color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                  {game.screenshots[lightboxIndex].label}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Nav arrows */}
          {lightboxIndex !== null && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <Button size="small" disabled={lightboxIndex === 0} onClick={() => setLightboxIndex(i => i - 1)}
                sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }}
              >
                ← Précédent
              </Button>
              <Typography sx={{ fontFamily: "'Fira Code'", fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
                {lightboxIndex + 1} / {game.screenshots.length}
              </Typography>
              <Button size="small" disabled={lightboxIndex === game.screenshots.length - 1} onClick={() => setLightboxIndex(i => i + 1)}
                sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }}
              >
                Suivant →
              </Button>
            </Box>
          )}
        </Box>
      </Dialog>
    </Box>
  )
}
