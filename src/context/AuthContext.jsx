import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'cyberrim_auth'
const USERS_KEY   = 'cyberrim_users'

function loadSession() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) } catch { return null }
}
function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || [] } catch { return [] }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadSession)

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  const register = ({ name, email, password }) => {
    const users = loadUsers()
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { error: 'Un compte existe déjà avec cet email.' }
    }
    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      city: '',
      phone: '',
      avatar: name.slice(0, 2).toUpperCase(),
      createdAt: new Date().toISOString(),
      orders: [],
    }
    saveUsers([...users, newUser])
    const { password: _, ...session } = newUser
    setUser(session)
    return { success: true }
  }

  const login = ({ email, password }) => {
    const users = loadUsers()
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!found) return { error: 'Email ou mot de passe incorrect.' }
    const { password: _, ...session } = found
    setUser(session)
    return { success: true }
  }

  const updateProfile = (fields) => {
    const users = loadUsers()
    const updated = users.map(u =>
      u.id === user.id ? { ...u, ...fields } : u
    )
    saveUsers(updated)
    setUser(prev => ({ ...prev, ...fields }))
  }

  const changePassword = ({ current, next }) => {
    const users = loadUsers()
    const found = users.find(u => u.id === user.id)
    if (!found || found.password !== current) return { error: 'Mot de passe actuel incorrect.' }
    saveUsers(users.map(u => u.id === user.id ? { ...u, password: next } : u))
    return { success: true }
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, register, login, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
