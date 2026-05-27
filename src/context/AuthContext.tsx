

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
  const isCheckingAuth = useRef<boolean>(false)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      checkAuth()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isCheckingAuth.current) {
        refreshSession()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const loadPrecepteurInfo = async (): Promise<boolean> => {
    setPrecepteurLoading(true)
    try {
      console.log('🔍 Chargement infos précepteur...')
      // ✅ Ne pas passer userId, la fonction le récupère du token
      const result = await getPrecepteurInfo()
      
      if (result.success) {
        console.log('✅ Infos précepteur chargées:', result.precepteurInfo ? 'trouvées' : 'nouveau précepteur')
        setPrecepteurInfo(result.precepteurInfo)
        return true
      } else {
        console.warn('⚠️ Erreur chargement infos précepteur:', result.error)
        // ✅ Ne pas déconnecter l'utilisateur, juste ne pas avoir les infos
        setPrecepteurInfo(null)
        return false
      }
    } catch (error) {
      console.error('❌ Exception loadPrecepteurInfo:', error)
      // ✅ Ne pas déconnecter l'utilisateur
      setPrecepteurInfo(null)
      return false
    } finally {
      setPrecepteurLoading(false)
    }
  }

  const checkAuth = async () => {
    if (isCheckingAuth.current) {
      console.log('⏳ Vérification auth déjà en cours, ignorée')
      return
    }
    
    isCheckingAuth.current = true
    
    try {
      setLoading(true)
      console.log('🔍 Vérification authentification...')
      
      const result = await getCurrentUser()
      console.log('📡 Résultat getCurrentUser:', result.success ? 'succès' : 'échec', result.user?.email)
      
      if (result.success && result.user) {
        console.log('✅ Utilisateur authentifié:', result.user.email, '| rôle:', result.user.role)
        setUser(result.user)
        
        // ✅ Charger les infos précepteur si nécessaire
        if (result.user.role === 'precepteur') {
          await loadPrecepteurInfo()
        }
      } else {
        console.log('❌ Pas d\'utilisateur authentifié:', result.error)
        setUser(null)
        setPrecepteurInfo(null)
      }
    } catch (error) {
      console.error('❌ Erreur vérification auth:', error)
      // ✅ En cas d'erreur, on ne déconnecte pas forcément
      // On garde l'état actuel si l'utilisateur était déjà connecté
      if (!user) {
        setUser(null)
        setPrecepteurInfo(null)
      }
    } finally {
      setLoading(false)
      isCheckingAuth.current = false
    }
  }

  const refreshSession = async () => {
    if (isCheckingAuth.current) return
    
    try {
      setRefreshing(true)
      console.log('🔄 Rafraîchissement session...')
      
      const result = await getCurrentUser()
      
      if (result.success && result.user) {
        console.log('✅ Session rafraîchie:', result.user.email)
        setUser(result.user)
        
        if (result.user.role === 'precepteur') {
          await loadPrecepteurInfo()
        }
      } else {
        console.log('⚠️ Session expirée ou invalide')
        // Ne déconnecter que si l'erreur est explicite
        if (result.error === 'Non authentifié' || result.error === 'Session expirée') {
          setUser(null)
          setPrecepteurInfo(null)
        }
      }
    } catch (error) {
      console.error('Erreur rafraîchissement session:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const loginUser = useCallback((userData: any) => {
    console.log('👤 loginUser appelé avec:', userData.email, '| rôle:', userData.role)
    setUser(userData)
    
    if (userData.role === 'precepteur') {
      // ✅ Charger les infos précepteur après connexion
      loadPrecepteurInfo()
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
    console.log('🔄 refreshUser appelé')
    await checkAuth()
  }, [])

  const refreshPrecepteurInfo = useCallback(async () => {
    console.log('🔄 refreshPrecepteurInfo appelé')
    if (user) {
      await loadPrecepteurInfo()
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