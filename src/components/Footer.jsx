import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Box, Container, Typography, Grid, Divider, IconButton } from '@mui/material'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import YouTubeIcon from '@mui/icons-material/YouTube'
import TelegramIcon from '@mui/icons-material/Telegram'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        background: 'linear-gradient(to top, rgba(123,47,255,0.08), transparent), #0a0a0f',
        borderTop: '1px solid rgba(123,47,255,0.25)',
        pt: 6, pb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <SportsEsportsIcon sx={{ color: '#7b2fff', fontSize: 28, filter: 'drop-shadow(0 0 6px #7b2fff)' }} />
              <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 900, fontSize: '1.1rem', background: 'linear-gradient(90deg, #7b2fff, #00fff7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                CYBER-RIM 2149
              </Typography>
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', lineHeight: 1.8, maxWidth: 280 }}>
              {t('footer.tagline')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {[FacebookIcon, InstagramIcon, YouTubeIcon, TelegramIcon].map((Icon, i) => (
                <IconButton key={i} size="small"
                  sx={{ color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(123,47,255,0.2)', borderRadius: 1, '&:hover': { color: '#7b2fff', borderColor: '#7b2fff', bgcolor: 'rgba(123,47,255,0.08)' } }}
                >
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Links */}
          <Grid item xs={6} md={2}>
            <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '0.75rem', color: '#7b2fff', letterSpacing: '0.15em', mb: 2, textTransform: 'uppercase' }}>
              {t('footer.links')}
            </Typography>
            {[
              { label: t('nav.home'), path: '/' },
              { label: t('nav.games'), path: '/games' },
              { label: t('nav.hardware'), path: '/hardware' },
              { label: t('nav.contact'), path: '/contact' },
            ].map(({ label, path }) => (
              <Box key={path} component={Link} to={path}
                sx={{ display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', textDecoration: 'none', mb: 1, fontWeight: 500, transition: 'color 0.2s', '&:hover': { color: '#00fff7' } }}
              >
                {label}
              </Box>
            ))}
          </Grid>

          {/* Games */}
          <Grid item xs={6} md={2}>
            <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '0.75rem', color: '#7b2fff', letterSpacing: '0.15em', mb: 2, textTransform: 'uppercase' }}>
              Top Jeux
            </Typography>
            {['EA Sports FC 25', 'GTA VI', 'NBA 2K25', 'Forza Horizon 5', 'Cyberpunk 2077'].map(name => (
              <Typography key={name} sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', mb: 1 }}>{name}</Typography>
            ))}
          </Grid>

          {/* Contact */}
          <Grid item xs={12} md={4}>
            <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '0.75rem', color: '#7b2fff', letterSpacing: '0.15em', mb: 2, textTransform: 'uppercase' }}>
              {t('footer.contact')}
            </Typography>
            {[
              { icon: '📍', text: 'Nouakchott, Mauritanie' },
              { icon: '📞', text: '+222 XX XX XX XX' },
              { icon: '✉️', text: 'contact@cyberrim2149.mr' },
            ].map(({ icon, text }) => (
              <Box key={text} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Typography sx={{ fontSize: '1rem' }}>{icon}</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{text}</Typography>
              </Box>
            ))}
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(123,47,255,0.15)', mt: 4, mb: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>
            © {year} CYBER-RIM2149 — {t('footer.rights')}
          </Typography>
          <Typography sx={{ fontFamily: "'Fira Code'", fontSize: '0.7rem', color: 'rgba(123,47,255,0.4)', letterSpacing: '0.1em' }}>
            MAURITANIA GAMING PLATFORM v2.1.4.9
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

