import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Container, Grid, Box, Tabs, Tab, Typography,
  TextField, InputAdornment, IconButton, Chip,
  MenuItem, Select, FormControl, Collapse, Paper,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import TuneIcon from '@mui/icons-material/Tune'
import SortIcon from '@mui/icons-material/Sort'
import HardwareCard from '../components/HardwareCard'
import SectionHeader from '../components/SectionHeader'
import { HARDWARE_ITEMS, HARDWARE_CATEGORIES } from '../data/hardware'
import { motion } from 'framer-motion'
import { staggerContainer, cardItem } from '../utils/animations'

const SORT_OPTIONS = [
  { value: 'default',    label: 'Par défaut' },
  { value: 'price_asc',  label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'name_asc',   label: 'Nom A → Z' },
  { value: 'stock',      label: 'En stock d\'abord' },
]

const CATEGORY_ICONS = {
  consoles: '🎮', controllers: '🕹️', headsets: '🎧',
  pc: '💻', components: '⚙️', monitors: '🖥️',
  keyboards: '⌨️', mice: '🖱️', chairs: '🪑',
}

export default function Hardware() {
  const { t } = useTranslation()
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort]         = useState('default')
  const [filtersOpen, setFiltersOpen] = useState(true)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    let result = HARDWARE_ITEMS.filter(item => {
      const matchSearch = !q
        || item.name.toLowerCase().includes(q)
        || item.brand.toLowerCase().includes(q)
        || item.specs.some(s => s.toLowerCase().includes(q))
        || t(`categories.${item.category}`).toLowerCase().includes(q)
      const matchCat = category === 'all' || item.category === category
      return matchSearch && matchCat
    })

    switch (sort) {
      case 'price_asc':  result = [...result].sort((a, b) => a.price - b.price); break
      case 'price_desc': result = [...result].sort((a, b) => b.price - a.price); break
      case 'name_asc':   result = [...result].sort((a, b) => a.name.localeCompare(b.name)); break
      case 'stock':      result = [...result].sort((a, b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0)); break
    }
    return result
  }, [search, category, sort, t])

  const clearSearch = () => setSearch('')
  const activeFilters = (search ? 1 : 0) + (category !== 'all' ? 1 : 0) + (sort !== 'default' ? 1 : 0)

  return (
    <Box sx={{ pt: 12, pb: 10, minHeight: '100vh', background: 'linear-gradient(180deg, #0a0a0f, #0d0d1a 50%, #0a0a0f)' }}>
      <Container maxWidth="lg">
        <SectionHeader title={t('hardware.title')} subtitle={t('hardware.subtitle')} accentColor="#00fff7" />

        {/* ── MAIN SEARCH BAR ── */}
        <Paper elevation={0} sx={{
          mb: 3, p: { xs: 2, md: 3 },
          bgcolor: '#12121f',
          border: search ? '1px solid rgba(0,255,247,0.5)' : '1px solid rgba(0,255,247,0.15)',
          borderRadius: 2,
          boxShadow: search ? '0 0 30px rgba(0,255,247,0.08)' : 'none',
          transition: 'all 0.3s',
        }}>
          <TextField
            fullWidth
            placeholder="Rechercher un produit, une marque, un composant..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{
                    color: search ? '#00fff7' : 'rgba(255,255,255,0.3)',
                    fontSize: '1.4rem',
                    transition: 'color 0.2s',
                  }} />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={clearSearch}
                    sx={{ color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#ff2d55' } }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'transparent',
                fontSize: '1rem',
                '& fieldset': { border: 'none' },
              },
              '& input': {
                color: '#fff',
                fontSize: { xs: '0.95rem', md: '1.05rem' },
                '&::placeholder': { color: 'rgba(255,255,255,0.25)', opacity: 1 },
              },
            }}
          />

          {/* Result count + filter toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, pt: 1.5, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', fontFamily: "'Fira Code'" }}>
                {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
                {search && <> pour <Box component="span" sx={{ color: '#00fff7' }}>"{search}"</Box></>}
              </Typography>
              {activeFilters > 0 && (
                <Chip
                  label={`${activeFilters} filtre${activeFilters > 1 ? 's' : ''} actif${activeFilters > 1 ? 's' : ''}`}
                  size="small"
                  onDelete={() => { clearSearch(); setCategory('all'); setSort('default') }}
                  sx={{ bgcolor: 'rgba(0,255,247,0.1)', border: '1px solid rgba(0,255,247,0.3)', color: '#00fff7', fontSize: '0.7rem', height: 22 }}
                />
              )}
            </Box>
            <IconButton
              size="small"
              onClick={() => setFiltersOpen(v => !v)}
              sx={{
                color: filtersOpen ? '#00fff7' : 'rgba(255,255,255,0.35)',
                border: '1px solid',
                borderColor: filtersOpen ? 'rgba(0,255,247,0.4)' : 'rgba(255,255,255,0.1)',
                borderRadius: 1, p: 0.6,
                '&:hover': { borderColor: '#00fff7', color: '#00fff7' },
              }}
            >
              <TuneIcon sx={{ fontSize: '1rem' }} />
            </IconButton>
          </Box>
        </Paper>

        {/* ── FILTERS ROW (collapsible) ── */}
        <Collapse in={filtersOpen}>
          <Box sx={{
            mb: 4, display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2, alignItems: { md: 'center' },
            justifyContent: 'space-between',
          }}>
            {/* Category tabs */}
            <Tabs
              value={category}
              onChange={(_, v) => setCategory(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                flex: 1,
                '& .MuiTabs-indicator': { background: 'linear-gradient(90deg, #00fff7, #7b2fff)', height: 2 },
                '& .MuiTab-root': {
                  color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem',
                  minWidth: 'auto', px: 1.5, py: 1,
                  '&.Mui-selected': { color: '#00fff7' },
                },
              }}
            >
              <Tab label="Tout" value="all" />
              {HARDWARE_CATEGORIES.map(cat => (
                <Tab
                  key={cat}
                  value={cat}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <span>{CATEGORY_ICONS[cat]}</span>
                      <span>{t(`categories.${cat}`)}</span>
                    </Box>
                  }
                />
              ))}
            </Tabs>

            {/* Sort */}
            <FormControl size="small" sx={{ minWidth: 185, flexShrink: 0 }}>
              <Select
                value={sort}
                onChange={e => setSort(e.target.value)}
                displayEmpty
                startAdornment={<SortIcon sx={{ mr: 0.8, fontSize: '1rem', color: 'rgba(255,255,255,0.4)' }} />}
                sx={{
                  bgcolor: '#12121f',
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: '0.82rem',
                  fontFamily: "'Fira Code'",
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0,255,247,0.2)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00fff7' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00fff7' },
                  '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.4)' },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      bgcolor: '#12121f',
                      border: '1px solid rgba(0,255,247,0.25)',
                      '& .MuiMenuItem-root': {
                        fontSize: '0.82rem', fontFamily: "'Fira Code'",
                        color: 'rgba(255,255,255,0.7)',
                        '&:hover': { bgcolor: 'rgba(0,255,247,0.08)', color: '#fff' },
                        '&.Mui-selected': { bgcolor: 'rgba(0,255,247,0.12)', color: '#00fff7' },
                      },
                    },
                  },
                }}
              >
                {SORT_OPTIONS.map(o => (
                  <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Collapse>

        {/* ── RESULTS ── */}
        {filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Typography sx={{ fontSize: '3rem', mb: 2, opacity: 0.3 }}>🔍</Typography>
            <Typography sx={{ fontFamily: "'Fira Code'", color: 'rgba(255,255,255,0.2)', fontSize: '1rem', mb: 1 }}>
              Aucun produit trouvé
            </Typography>
            {search && (
              <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.15)' }}>
                Essayez un autre mot-clé ou{' '}
                <Box component="span" onClick={clearSearch}
                  sx={{ color: '#00fff7', cursor: 'pointer', textDecoration: 'underline', '&:hover': { opacity: 0.7 } }}
                >
                  effacez la recherche
                </Box>
              </Typography>
            )}
          </Box>
        ) : (
          <Grid container spacing={3}
            component={motion.div}
            key={search + category + sort}
            variants={staggerContainer(0.05)}
            initial="hidden"
            animate="visible"
          >
            {filtered.map(item => (
              <Grid item xs={12} sm={6} md={3} key={item.id} component={motion.div} variants={cardItem}>
                <HardwareCard item={item} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}
