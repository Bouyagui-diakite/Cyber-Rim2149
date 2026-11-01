import { Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider, CssBaseline, Box } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import cyberpunkTheme from './theme'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { pageTransition } from './utils/animations'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Games from './pages/Games'
import Hardware from './pages/Hardware'
import Contact from './pages/Contact'
import Checkout from './pages/Checkout'
import GameDetail from './pages/GameDetail'
import HardwareDetail from './pages/HardwareDetail'
import Login from './pages/Login'
import Account from './pages/Account'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageTransition}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <Routes location={location}>
          <Route path="/"              element={<Home />} />
          <Route path="/games"         element={<Games />} />
          <Route path="/games/:slug"   element={<GameDetail />} />
          <Route path="/hardware"         element={<Hardware />} />
          <Route path="/hardware/:slug"  element={<HardwareDetail />} />
          <Route path="/contact"       element={<Contact />} />
          <Route path="/checkout"      element={<Checkout />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/account"       element={<Account />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <ThemeProvider theme={cyberpunkTheme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <AnimatedRoutes />
            </Box>
            <Footer />
          </Box>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
