import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  Drawer, Box, Typography, IconButton, Button, Divider,
  List, ListItem, Avatar, Chip,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../data/hardware'

const ITEM_ICONS = {
  game: '🎮',
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

export default function CartDrawer({ open, onClose }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { items, removeItem, updateQty, totalItems, totalPrice } = useCart()

  const handleCheckout = () => {
    onClose()
    navigate('/checkout')
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: 420 },
          bgcolor: '#0f0f1a',
          borderLeft: '1px solid rgba(123,47,255,0.35)',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(123,47,255,0.2)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ShoppingBagIcon sx={{ color: '#7b2fff', filter: 'drop-shadow(0 0 6px #7b2fff)' }} />
          <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
            PANIER
          </Typography>
          {totalItems > 0 && (
            <Chip label={totalItems} size="small" sx={{ bgcolor: '#7b2fff', color: '#fff', fontWeight: 700, height: 22, fontSize: '0.75rem' }} />
          )}
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#a0a0b8', '&:hover': { color: '#fff' } }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Items */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 1 }}>
        {items.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 2, py: 10 }}>
            <Typography sx={{ fontSize: '3.5rem', opacity: 0.3 }}>🛒</Typography>
            <Typography sx={{ fontFamily: "'Fira Code'", color: 'rgba(255,255,255,0.2)', fontSize: '0.9rem', textAlign: 'center' }}>
              Votre panier est vide
            </Typography>
            <Button variant="outlined" color="primary" size="small" onClick={onClose} sx={{ mt: 1 }}>
              Continuer les achats
            </Button>
          </Box>
        ) : (
          <List disablePadding>
            {items.map((item, idx) => (
              <Box key={`${item.itemType}-${item.id}`}>
                <ListItem disablePadding sx={{ py: 2, alignItems: 'flex-start', gap: 2 }}>
                  {/* Thumbnail */}
                  <Avatar
                    sx={{
                      width: 56, height: 56, borderRadius: 1, fontSize: '1.6rem',
                      background: item.gradient || 'linear-gradient(135deg,#1a1a2e,#7b2fff)',
                      border: `1px solid ${item.accentColor || 'rgba(123,47,255,0.4)'}`,
                      flexShrink: 0,
                    }}
                  >
                    {ITEM_ICONS[item.category || item.itemType] || '📦'}
                  </Avatar>

                  {/* Info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '0.78rem', color: '#fff', lineHeight: 1.3, mb: 0.3 }}>
                      {item.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: item.accentColor || '#a0a0b8', fontWeight: 600, mb: 0.8 }}>
                      {formatPrice(item.price)}
                    </Typography>

                    {/* Qty controls */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => updateQty(item.id, item.itemType, item.quantity - 1)}
                        sx={{ p: 0.3, color: '#a0a0b8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 0.5, '&:hover': { color: '#ff2d55', borderColor: '#ff2d55' } }}
                      >
                        <RemoveIcon sx={{ fontSize: '0.85rem' }} />
                      </IconButton>
                      <Typography sx={{ mx: 1, fontFamily: "'Fira Code'", fontWeight: 700, color: '#fff', fontSize: '0.9rem', minWidth: 20, textAlign: 'center' }}>
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => updateQty(item.id, item.itemType, item.quantity + 1)}
                        sx={{ p: 0.3, color: '#a0a0b8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 0.5, '&:hover': { color: '#00fff7', borderColor: '#00fff7' } }}
                      >
                        <AddIcon sx={{ fontSize: '0.85rem' }} />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Line total + delete */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, flexShrink: 0 }}>
                    <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, fontSize: '0.82rem', color: '#fff' }}>
                      {formatPrice(item.price * item.quantity)}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => removeItem(item.id, item.itemType)}
                      sx={{ p: 0.4, color: 'rgba(255,255,255,0.25)', '&:hover': { color: '#ff2d55' } }}
                    >
                      <DeleteOutlineIcon sx={{ fontSize: '1rem' }} />
                    </IconButton>
                  </Box>
                </ListItem>
                {idx < items.length - 1 && <Divider sx={{ borderColor: 'rgba(123,47,255,0.1)' }} />}
              </Box>
            ))}
          </List>
        )}
      </Box>

      {/* Footer */}
      {items.length > 0 && (
        <Box sx={{ px: 3, py: 3, borderTop: '1px solid rgba(123,47,255,0.2)', background: 'rgba(10,10,15,0.8)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Sous-total</Typography>
            <Typography sx={{ fontFamily: "'Fira Code'", fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{formatPrice(totalPrice)}</Typography>
          </Box>
          <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', mb: 2.5 }}>
            Livraison calculée à la commande
          </Typography>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={handleCheckout}
            sx={{ py: 1.5, fontSize: '0.9rem' }}
          >
            Passer la commande
          </Button>
        </Box>
      )}
    </Drawer>
  )
}

