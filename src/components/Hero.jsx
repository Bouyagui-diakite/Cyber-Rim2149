import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Box, Typography, Button, Container, Chip } from '@mui/material'
import { motion } from 'framer-motion'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'
import StorefrontIcon from '@mui/icons-material/Storefront'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { staggerContainer, fadeUp, fadeIn } from '../utils/animations'

const FLOATING_ICONS = ['🎮', '🕹️', '👾', '🏆', '⚡', '🎯']

const STATS = [
  { value: 50,  suffix: '+', label: 'Jeux disponibles' },
  { value: 200, suffix: '+', label: 'Produits hardware' },
  { value: 24,  suffix: 'h', label: 'Livraison Mauritanie' },
]

function AnimatedCounter({ target, suffix }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const duration = 1400
        const steps = 40
        const increment = target / steps
        let current = 0
        const timer = setInterval(() => {
          current = Math.min(current + increment, target)
          setCount(Math.floor(current))
          if (current >= target) clearInterval(timer)
        }, duration / steps)
      }
    }, { threshold: 0.5 })
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function Hero() {
  const { t } = useTranslation()

  return (
    <Box
      component="section"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 20% 50%, rgba(123,47,255,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(0,255,247,0.08) 0%, transparent 50%), #0a0a0f',
      }}
    >
      {/* Grid background */}
      <Box sx={{
        position: 'absolute', inset: 0, opacity: 0.06,
        backgroundImage: 'linear-gradient(rgba(123,47,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(123,47,255,1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* Floating icons */}
      {FLOATING_ICONS.map((icon, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.07 + (i % 4) * 0.02, y: [0, -14, 0] }}
          transition={{ opacity: { delay: 0.5 + i * 0.15, duration: 0.6 }, y: { delay: i * 0.3, duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut' } }}
          style={{
            position: 'absolute',
            fontSize: `${1.5 + (i % 3) * 0.5}rem`,
            top: `${10 + (i * 15) % 80}%`,
            left: `${5 + (i * 17) % 90}%`,
            pointerEvents: 'none',
          }}
        >
          {icon}
        </motion.div>
      ))}

      {/* Glow orbs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: '15%', right: '15%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,47,255,0.2) 0%, transparent 70%)', pointerEvents: 'none' }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{ position: 'absolute', bottom: '20%', left: '10%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,247,0.12) 0%, transparent 70%)', pointerEvents: 'none' }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: { xs: 14, md: 0 } }}>
        <motion.div variants={staggerContainer(0.12, 0.1)} initial="hidden" animate="visible">
          <Box sx={{ maxWidth: 720 }}>

            {/* Badge */}
            <motion.div variants={fadeUp}>
              <Chip
                label="🇲🇷 MAURITANIA #1 GAMING"
                size="small"
                sx={{ mb: 3, bgcolor: 'rgba(123,47,255,0.15)', border: '1px solid rgba(123,47,255,0.5)', color: '#7b2fff', fontFamily: "'Fira Code'", fontSize: '0.7rem', letterSpacing: '0.15em' }}
              />
            </motion.div>

            {/* Headline */}
            <motion.div variants={fadeUp}>
              <Typography component="h1" sx={{
                fontFamily: "'Fira Code'", fontSize: { xs: '2.2rem', sm: '3.2rem', md: '4.5rem' },
                fontWeight: 700, lineHeight: 1.1, mb: 1,
                background: 'linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #00fff7 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
              }}>
                {t('hero.tagline')}
              </Typography>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Typography component="span" sx={{
                display: 'block', fontFamily: "'Fira Code'",
                fontSize: { xs: '1.4rem', sm: '2rem', md: '2.8rem' },
                fontWeight: 700, color: '#00fff7',
                textShadow: '0 0 20px rgba(0,255,247,0.5)', mb: 3, letterSpacing: '0.02em',
              }}>
                {t('hero.subtitle')}
              </Typography>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Typography sx={{ fontSize: { xs: '1rem', md: '1.2rem' }, color: 'rgba(255,255,255,0.65)', maxWidth: 520, lineHeight: 1.7, mb: 5, fontWeight: 400 }}>
                {t('hero.desc')}
              </Typography>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fadeUp}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button component={Link} to="/games" variant="contained" color="primary" size="large"
                    startIcon={<SportsEsportsIcon />} endIcon={<ArrowForwardIcon />}
                    sx={{ fontSize: '1rem', py: 1.5, px: 3.5 }}
                  >
                    {t('hero.cta_games')}
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button component={Link} to="/hardware" variant="outlined" color="secondary" size="large"
                    startIcon={<StorefrontIcon />}
                    sx={{ fontSize: '1rem', py: 1.5, px: 3.5 }}
                  >
                    {t('hero.cta_shop')}
                  </Button>
                </motion.div>
              </Box>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp}>
              <Box sx={{ display: 'flex', gap: { xs: 3, md: 5 }, mt: 7, flexWrap: 'wrap' }}>
                {STATS.map(({ value, suffix, label }) => (
                  <Box key={label}>
                    <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '1.8rem', color: '#7b2fff', lineHeight: 1 }}>
                      <AnimatedCounter target={value} suffix={suffix} />
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', mt: 0.3 }}>
                      {label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>

          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
