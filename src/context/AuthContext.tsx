// context/AuthContext.tsx
'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { getCurrentUser, getPrecepteurInfo, logout } from '@/actions/auth'

interface AuthContextType {
  user: any | null
  precepteurInfo: any | null
  loading: boolean
  refreshing: boolean
  precepteurLoading: boolean
  isAuthenticated: boolean
  loginUser: (user: any) => void
  logoutUser: () => Promise<void>
  refreshUser: () => Promise<void>
  refreshPrecepteurInfo: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [precepteurInfo, setPrecepteurInfo] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [precepteurLoading, setPrecepteurLoading] = useState(false)
  
  const isInitialMount = useRef<boolean>(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      checkAuth()
    }

    // Rafraîchir quand l'utilisateur revient sur l'onglet
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshSession()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const checkAuth = async () => {
    try {
      setLoading(true)
      const result = await getCurrentUser()
      
      if (result.success && result.user) {
        setUser(result.user)
        
        if (result.user.role === 'precepteur') {
          await loadPrecepteurInfo(result.user.id)
        }
      } else {
        setUser(null)
        setPrecepteurInfo(null)
      }
    } catch (error) {
      console.error('Erreur vérification auth:', error)
      setUser(null)
      setPrecepteurInfo(null)
    } finally {
      setLoading(false)
    }
  }

  const refreshSession = async () => {
    try {
      setRefreshing(true)
      
      const result = await getCurrentUser()
      
      if (result.success && result.user) {
        setUser(result.user)
        if (result.user.role === 'precepteur') {
          await loadPrecepteurInfo(result.user.id)
        }
      }
    } catch (error) {
      console.error('Erreur rafraîchissement session:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const loadPrecepteurInfo = async (userId: string) => {
    setPrecepteurLoading(true)
    try {
      const result = await getPrecepteurInfo(userId)
      if (result.success) {
        setPrecepteurInfo(result.precepteurInfo)
      }
    } catch (error) {
      console.error('Erreur chargement infos précepteur:', error)
    } finally {
      setPrecepteurLoading(false)
    }
  }

  const loginUser = useCallback((userData: any) => {
    setUser(userData)
    
    if (userData.role === 'precepteur') {
      loadPrecepteurInfo(userData.id)
    }
  }, [])

  const logoutUser = useCallback(async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      setUser(null)
      setPrecepteurInfo(null)
    }
  }, [])

  const refreshUser = useCallback(async () => {
    await checkAuth()
  }, [])

  const refreshPrecepteurInfo = useCallback(async () => {
    if (user) {
      await loadPrecepteurInfo(user.id)
    }
  }, [user])

  const value = {
    user,
    precepteurInfo,
    loading,
    refreshing,
    precepteurLoading,
    isAuthenticated: !!user,
    loginUser,
    logoutUser,
    refreshUser,
    refreshPrecepteurInfo,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}