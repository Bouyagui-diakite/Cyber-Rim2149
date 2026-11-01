import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find(i => i.id === action.item.id && i.itemType === action.item.itemType)
      if (existing) {
        return state.map(i =>
          i.id === action.item.id && i.itemType === action.item.itemType
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...state, { ...action.item, quantity: 1 }]
    }
    case 'REMOVE':
      return state.filter(i => !(i.id === action.id && i.itemType === action.itemType))
    case 'UPDATE_QTY':
      if (action.quantity <= 0) {
        return state.filter(i => !(i.id === action.id && i.itemType === action.itemType))
      }
      return state.map(i =>
        i.id === action.id && i.itemType === action.itemType
          ? { ...i, quantity: action.quantity }
          : i
      )
    case 'CLEAR':
      return []
    default:
      return state
  }
}

const STORAGE_KEY = 'cyberrim_cart'

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(
    cartReducer,
    [],
    () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : []
      } catch {
        return []
      }
    }
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (item) => dispatch({ type: 'ADD', item })
  const removeItem = (id, itemType) => dispatch({ type: 'REMOVE', id, itemType })
  const updateQty = (id, itemType, quantity) => dispatch({ type: 'UPDATE_QTY', id, itemType, quantity })
  const clearCart = () => dispatch({ type: 'CLEAR' })

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
