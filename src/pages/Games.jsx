import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Grid, Box, Tabs, Tab, Typography, TextField, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import GameCard from '../components/GameCard'
import SectionHeader from '../components/SectionHeader'
import { FEATURED_GAMES, ALL_GENRES } from '../data/games'
import { motion } from 'framer-motion'
import { staggerContainer, cardItem } from '../utils/animations'

export default function Games() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('all')

  const genres = ['all', ...ALL_GENRES]

  const filtered = FEATURED_GAMES.filter(g => {
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase())
    const matchTab = tab === 'all' || g.genre === tab
    return matchSearch && matchTab
  })

  return (
    <Box sx={{ pt: 12, pb: 10, minHeight: '100vh', background: 'linear-gradient(180deg, #0a0a0f, #0d0d1a 50%, #0a0a0f)' }}>
      <Container maxWidth="lg">
        <SectionHeader title={t('games.title')} subtitle={t('games.subtitle')} accentColor="#7b2fff" />

        {/* Search + Filter */}
        <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'flex-start' }}>
          <TextField
            placeholder="Rechercher un jeu..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#7b2fff' }} /></InputAdornment>,
            }}
            sx={{
              minWidth: 260,
              '& .MuiOutlinedInput-root': {
                bgcolor: '#12121f',
                '& fieldset': { borderColor: 'rgba(123,47,255,0.3)' },
                '&:hover fieldset': { borderColor: '#7b2fff' },
                '&.Mui-focused fieldset': { borderColor: '#7b2fff' },
              },
              '& input': { color: '#fff' },
            }}
          />
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': { background: 'linear-gradient(90deg, #7b2fff, #00fff7)', height: 2 },
              '& .MuiTab-root': { color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', minWidth: 'auto', px: 1.5, '&.Mui-selected': { color: '#00fff7' } },
            }}
          >
            {genres.map(g => (
              <Tab key={g} label={g === 'all' ? 'Tous' : g} value={g} />
            ))}
          </Tabs>
        </Box>

        {filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography sx={{ fontFamily: "'Fira Code'", color: 'rgba(255,255,255,0.2)', fontSize: '1.2rem' }}>Aucun jeu trouvé</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}
            component={motion.div}
            key={tab + search}
            variants={staggerContainer(0.06)}
            initial="hidden"
            animate="visible"
          >
            {filtered.map(game => (
              <Grid item xs={12} sm={6} md={4} key={game.id} component={motion.div} variants={cardItem}>
                <GameCard game={game} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}

