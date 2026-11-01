import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Container, Grid, Box, Button, Typography } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { motion } from 'framer-motion'
import { staggerContainer, cardItem, fadeUp, fadeIn } from '../utils/animations'
import Hero from '../components/Hero'
import GameCard from '../components/GameCard'
import HardwareCard from '../components/HardwareCard'
import SectionHeader from '../components/SectionHeader'
import { FEATURED_GAMES } from '../data/games'
import { HARDWARE_ITEMS } from '../data/hardware'

export default function Home() {
  const { t } = useTranslation()

  const featuredGames = [...FEATURED_GAMES].sort((a, b) => b.rating - a.rating).slice(0, 6)
  const featuredHardware = HARDWARE_ITEMS.filter(i => i.badge).slice(0, 4)

  return (
    <Box>
      <Hero />

      {/* Featured Games */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, background: 'linear-gradient(180deg, #0a0a0f, #0d0d1a)' }}>
        <Container maxWidth="lg">
          <SectionHeader title={t('games.title')} subtitle={t('games.subtitle')} accentColor="#7b2fff" />
          <Grid container spacing={3}
            component={motion.div}
            variants={staggerContainer(0.07)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {featuredGames.map(game => (
              <Grid item xs={12} sm={6} md={4} lg={4} key={game.id} component={motion.div} variants={cardItem}>
                <GameCard game={game} />
              </Grid>
            ))}
          </Grid>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Button
              component={Link}
              to="/games"
              variant="outlined"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              sx={{ fontSize: '0.9rem', borderColor: 'rgba(123,47,255,0.5)', color: '#7b2fff', '&:hover': { borderColor: '#7b2fff', bgcolor: 'rgba(123,47,255,0.08)' } }}
            >
              {t('games.more')}
            </Button>
          </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Promo banner */}
      <Box sx={{
        py: { xs: 6, md: 8 },
        background: 'linear-gradient(135deg, rgba(123,47,255,0.15) 0%, rgba(0,255,247,0.05) 100%)',
        borderTop: '1px solid rgba(123,47,255,0.2)',
        borderBottom: '1px solid rgba(0,255,247,0.15)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(123,47,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(123,47,255,0.06) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative' }}>
          <Typography sx={{ fontFamily: "'Fira Code'", color: '#00fff7', fontSize: '0.75rem', letterSpacing: '0.3em', mb: 1, opacity: 0.8 }}>
            // LIVRAISON EXPRESS
          </Typography>
          <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 900, fontSize: { xs: '1.5rem', md: '2.5rem' }, color: '#fff', mb: 2 }}>
            Livraison en 24h dans tout
            <Box component="span" sx={{ color: '#00fff7', textShadow: '0 0 20px rgba(0,255,247,0.5)', display: 'block' }}>
              Nouakchott & Nouadhibou
            </Box>
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', mb: 3 }}>
            Commandez avant 18h, recevez le lendemain.
          </Typography>
          <Button component={Link} to="/hardware" variant="contained" color="secondary"
            sx={{ color: '#000', fontWeight: 700, '&:hover': { bgcolor: '#00fff7' } }}
          >
            Commander maintenant
          </Button>
        </Container>
      </Box>

      {/* Featured Hardware */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, background: '#0a0a0f' }}>
        <Container maxWidth="lg">
          <SectionHeader title={t('hardware.title')} subtitle={t('hardware.subtitle')} accentColor="#00fff7" />
          <Grid container spacing={3}
            component={motion.div}
            variants={staggerContainer(0.07)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {featuredHardware.map(item => (
              <Grid item xs={12} sm={6} md={3} key={item.id} component={motion.div} variants={cardItem}>
                <HardwareCard item={item} />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Button
              component={Link}
              to="/hardware"
              variant="outlined"
              color="secondary"
              endIcon={<ArrowForwardIcon />}
              sx={{ fontSize: '0.9rem' }}
            >
              {t('hardware.more')}
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

