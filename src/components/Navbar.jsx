import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  AppBar, Toolbar, Box, Button, IconButton, Drawer,
  List, ListItem, ListItemButton, ListItemText, Typography,
  Menu, MenuItem, Divider, useScrollTrigger, Slide, Badge, Avatar,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { motion } from 'framer-motion'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import CartDrawer from './CartDrawer'
import TranslateIcon from '@mui/icons-material/Translate'
import CloseIcon from '@mui/icons-material/Close'

const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇲🇷' },
]

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger()
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langAnchor, setLangAnchor] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const { totalItems } = useCart()
  const { user } = useAuth()

  const changeLanguage = (code) => {
    i18n.changeLanguage(code)
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = code
    setLangAnchor(null)
  }

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0]

  const navLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.games'), path: '/games' },
    { label: t('nav.hardware'), path: '/hardware' },
    { label: t('nav.contact'), path: '/contact' },
  ]

  return (
    <>
      <HideOnScroll>
        <AppBar
          position="fixed"
          elevation={0}
          component={motion.header}
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Toolbar sx={{ px: { xs: 2, md: 4 }, justifyContent: 'space-between', minHeight: '70px !important' }}>
            {/* Logo */}
            <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}>
              <SportsEsportsIcon sx={{ color: '#7b2fff', fontSize: 32, filter: 'drop-shadow(0 0 8px #7b2fff)' }} />
              <Box>
                <Typography
                  variant="h6"
                  data-text="CYBER-RIM"
                  className="logo-glitch"
                  sx={{
                    fontFamily: "'Fira Code', monospace",
                    fontWeight: 900,
                    fontSize: '1.1rem',
                    lineHeight: 1,
                    background: 'linear-gradient(90deg, #7b2fff, #00fff7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '0.05em',
                  }}
                >
                  CYBER-RIM
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Fira Code', monospace",
                    fontSize: '0.65rem',
                    color: '#00fff7',
                    letterSpacing: '0.2em',
                    lineHeight: 1,
                  }}
                >
                  2149
                </Typography>
              </Box>
            </Box>

            {/* Desktop nav */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
              {navLinks.map(({ label, path }) => (
                <Button
                  key={path}
                  component={Link}
                  to={path}
                  sx={{
                    color: location.pathname === path ? '#00fff7' : 'rgba(255,255,255,0.75)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    letterSpacing: '0.12em',
                    position: 'relative',
                    px: 2,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 6,
                      left: '20%',
                      width: location.pathname === path ? '60%' : '0%',
                      height: '2px',
                      background: '#00fff7',
                      boxShadow: '0 0 8px #00fff7',
                      transition: 'width 0.3s ease',
                    },
                    '&:hover': { color: '#00fff7' },
                    '&:hover::after': { width: '60%' },
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>

            {/* Language + mobile */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                startIcon={<TranslateIcon />}
                onClick={(e) => setLangAnchor(e.currentTarget)}
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  border: '1px solid rgba(123, 47, 255, 0.4)',
                  borderRadius: 1,
                  px: 1.5,
                  py: 0.5,
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  '&:hover': { borderColor: '#7b2fff', color: '#fff' },
                }}
              >
                {currentLang.flag} {currentLang.code.toUpperCase()}
              </Button>
              <Menu anchorEl={langAnchor} open={Boolean(langAnchor)} onClose={() => setLangAnchor(null)}
                PaperProps={{ sx: { bgcolor: '#12121f', border: '1px solid rgba(123,47,255,0.4)', minWidth: 160 } }}
              >
                {LANGUAGES.map(({ code, label, flag }) => (
                  <MenuItem key={code} onClick={() => changeLanguage(code)}
                    sx={{ color: i18n.language === code ? '#00fff7' : 'rgba(255,255,255,0.8)', fontFamily: "'Fira Code'", fontWeight: 600 }}
                  >
                    {flag}&nbsp;&nbsp;{label}
                  </MenuItem>
                ))}
              </Menu>
              <IconButton
                onClick={() => setCartOpen(true)}
                sx={{
                  color: totalItems > 0 ? '#00fff7' : 'rgba(255,255,255,0.6)',
                  border: '1px solid',
                  borderColor: totalItems > 0 ? 'rgba(0,255,247,0.4)' : 'rgba(255,255,255,0.1)',
                  borderRadius: 1,
                  p: 0.8,
                  transition: 'all 0.2s',
                  '&:hover': { borderColor: '#00fff7', color: '#00fff7', boxShadow: '0 0 12px rgba(0,255,247,0.3)' },
                }}
              >
                <Badge badgeContent={totalItems} color="primary" max={99}
                  sx={{ '& .MuiBadge-badge': { fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '0.65rem', minWidth: 18, height: 18 } }}
                >
                  <ShoppingCartIcon fontSize="small" />
                </Badge>
              </IconButton>
              {user ? (
                <Button
                  component={Link}
                  to="/account"
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 0.8,
                    border: '1px solid rgba(123,47,255,0.35)',
                    borderRadius: 1, px: 1.2, py: 0.5,
                    color: 'rgba(255,255,255,0.8)',
                    '&:hover': { borderColor: '#7b2fff', color: '#fff', bgcolor: 'rgba(123,47,255,0.08)' },
                  }}
                >
                  <Avatar sx={{ width: 24, height: 24, bgcolor: '#7b2fff', fontSize: '0.65rem', fontFamily: "'Fira Code'", fontWeight: 700 }}>
                    {user.name.slice(0, 2).toUpperCase()}
                  </Avatar>
                  <Typography sx={{ fontSize: '0.78rem', fontFamily: "'Fira Code'", fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
                    {user.name.split(' ')[0]}
                  </Typography>
                </Button>
              ) : (
                <Button
                  component={Link}
                  to="/login"
                  startIcon={<AccountCircleIcon sx={{ fontSize: '1rem !important' }} />}
                  sx={{
                    border: '1px solid rgba(123,47,255,0.35)',
                    borderRadius: 1, px: 1.5, py: 0.5,
                    color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 600,
                    '&:hover': { borderColor: '#7b2fff', color: '#fff', bgcolor: 'rgba(123,47,255,0.08)' },
                  }}
                >
                  Connexion
                </Button>
              )}
              <IconButton sx={{ display: { md: 'none' }, color: '#fff' }} onClick={() => setMobileOpen(true)}>
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Mobile drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: 280, bgcolor: '#0f0f1a', borderLeft: '1px solid rgba(123,47,255,0.4)' } }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontFamily: "'Fira Code'", color: '#7b2fff', fontWeight: 700 }}>MENU</Typography>
          <IconButton onClick={() => setMobileOpen(false)} sx={{ color: '#a0a0b8' }}><CloseIcon /></IconButton>
        </Box>
        <Divider sx={{ borderColor: 'rgba(123,47,255,0.3)' }} />
        <List sx={{ pt: 2 }}>
          {navLinks.map(({ label, path }) => (
            <ListItem key={path} disablePadding>
              <ListItemButton component={Link} to={path} onClick={() => setMobileOpen(false)}
                sx={{ px: 3, py: 1.5, '&:hover': { bgcolor: 'rgba(123,47,255,0.1)' } }}
              >
                <ListItemText primary={label}
                  primaryTypographyProps={{
                    fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.1em',
                    color: location.pathname === path ? '#00fff7' : '#fff',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  )
}

