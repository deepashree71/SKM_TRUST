import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('ngo_access_token')
    if (token) {
      authApi.me()
        .then(res => setUser(res.data.user))
        .catch(() => localStorage.removeItem('ngo_access_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await authApi.login({ email, password })
    // Backend returns { token, user } (not accessToken)
    const { token, user } = res.data
    localStorage.setItem('ngo_access_token', token)
    setUser(user)
    return user
  }

  const logout = async () => {
    try { await authApi.logout() } catch {}
    localStorage.removeItem('ngo_access_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
