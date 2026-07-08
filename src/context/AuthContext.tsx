

// // context/AuthContext.tsx
// 'use client'

// import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
// import { getCurrentUser, getPrecepteurInfo, logout } from '@/actions/auth'

// interface AuthContextType {
//   user: any | null
//   precepteurInfo: any | null
//   loading: boolean
//   refreshing: boolean
//   precepteurLoading: boolean
//   isAuthenticated: boolean
//   loginUser: (user: any) => void
//   logoutUser: () => Promise<void>
//   refreshUser: () => Promise<void>
//   refreshPrecepteurInfo: () => Promise<void>
// }

// const AuthContext = createContext<AuthContextType>({} as AuthContextType)

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<any | null>(null)
//   const [precepteurInfo, setPrecepteurInfo] = useState<any | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [refreshing, setRefreshing] = useState(false)
//   const [precepteurLoading, setPrecepteurLoading] = useState(false)
  
//   const isInitialMount = useRef<boolean>(true)
//   const isCheckingAuth = useRef<boolean>(false)

//   useEffect(() => {
//     if (isInitialMount.current) {
//       isInitialMount.current = false
//       checkAuth()
//     }

//     const handleVisibilityChange = () => {
//       if (document.visibilityState === 'visible' && !isCheckingAuth.current) {
//         refreshSession()
//       }
//     }

//     document.addEventListener('visibilitychange', handleVisibilityChange)

//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange)
//     }
//   }, [])

//   const loadPrecepteurInfo = async (): Promise<boolean> => {
//     setPrecepteurLoading(true)
//     try {
//       console.log('🔍 Chargement infos précepteur...')
//       // ✅ Ne pas passer userId, la fonction le récupère du token
//       const result = await getPrecepteurInfo()
      
//       if (result.success) {
//         console.log('✅ Infos précepteur chargées:', result.precepteurInfo ? 'trouvées' : 'nouveau précepteur')
//         setPrecepteurInfo(result.precepteurInfo)
//         return true
//       } else {
//         console.warn('⚠️ Erreur chargement infos précepteur:', result.error)
//         // ✅ Ne pas déconnecter l'utilisateur, juste ne pas avoir les infos
//         setPrecepteurInfo(null)
//         return false
//       }
//     } catch (error) {
//       console.error('❌ Exception loadPrecepteurInfo:', error)
//       // ✅ Ne pas déconnecter l'utilisateur
//       setPrecepteurInfo(null)
//       return false
//     } finally {
//       setPrecepteurLoading(false)
//     }
//   }

//   const checkAuth = async () => {
//     if (isCheckingAuth.current) {
//       console.log('⏳ Vérification auth déjà en cours, ignorée')
//       return
//     }
    
//     isCheckingAuth.current = true
    
//     try {
//       setLoading(true)
//       console.log('🔍 Vérification authentification...')
      
//       const result = await getCurrentUser()
//       console.log('📡 Résultat getCurrentUser:', result.success ? 'succès' : 'échec', result.user?.email)
      
//       if (result.success && result.user) {
//         console.log('✅ Utilisateur authentifié:', result.user.email, '| rôle:', result.user.role)
//         setUser(result.user)
        
//         // ✅ Charger les infos précepteur si nécessaire
//         if (result.user.role === 'precepteur') {
//           await loadPrecepteurInfo()
//         }
//       } else {
//         console.log('❌ Pas d\'utilisateur authentifié:', result.error)
//         setUser(null)
//         setPrecepteurInfo(null)
//       }
//     } catch (error) {
//       console.error('❌ Erreur vérification auth:', error)
//       // ✅ En cas d'erreur, on ne déconnecte pas forcément
//       // On garde l'état actuel si l'utilisateur était déjà connecté
//       if (!user) {
//         setUser(null)
//         setPrecepteurInfo(null)
//       }
//     } finally {
//       setLoading(false)
//       isCheckingAuth.current = false
//     }
//   }

//   const refreshSession = async () => {
//     if (isCheckingAuth.current) return
    
//     try {
//       setRefreshing(true)
//       console.log('🔄 Rafraîchissement session...')
      
//       const result = await getCurrentUser()
      
//       if (result.success && result.user) {
//         console.log('✅ Session rafraîchie:', result.user.email)
//         setUser(result.user)
        
//         if (result.user.role === 'precepteur') {
//           await loadPrecepteurInfo()
//         }
//       } else {
//         console.log('⚠️ Session expirée ou invalide')
//         // Ne déconnecter que si l'erreur est explicite
//         if (result.error === 'Non authentifié' || result.error === 'Session expirée') {
//           setUser(null)
//           setPrecepteurInfo(null)
//         }
//       }
//     } catch (error) {
//       console.error('Erreur rafraîchissement session:', error)
//     } finally {
//       setRefreshing(false)
//     }
//   }

//   const loginUser = useCallback((userData: any) => {
//     console.log('👤 loginUser appelé avec:', userData.email, '| rôle:', userData.role)
//     setUser(userData)
    
//     if (userData.role === 'precepteur') {
//       // ✅ Charger les infos précepteur après connexion
//       loadPrecepteurInfo()
//     }
//   }, [])

//   const logoutUser = useCallback(async () => {
//     try {
//       await logout()
//     } catch (error) {
//       console.error('Erreur lors de la déconnexion:', error)
//     } finally {
//       setUser(null)
//       setPrecepteurInfo(null)
//     }
//   }, [])

//   const refreshUser = useCallback(async () => {
//     console.log('🔄 refreshUser appelé')
//     await checkAuth()
//   }, [])

//   const refreshPrecepteurInfo = useCallback(async () => {
//     console.log('🔄 refreshPrecepteurInfo appelé')
//     if (user) {
//       await loadPrecepteurInfo()
//     }
//   }, [user])

//   const value = {
//     user,
//     precepteurInfo,
//     loading,
//     refreshing,
//     precepteurLoading,
//     isAuthenticated: !!user,
//     loginUser,
//     logoutUser,
//     refreshUser,
//     refreshPrecepteurInfo,
//   }

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }

// context/AuthContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { login as serverLogin, register as serverRegister, logout as serverLogout, getCurrentUser } from '@/actions/auth'

type UserRole = 'admin' | 'parent' | 'precepteur' | 'responsable_pedagogique'

type User = {
  id: string
  email: string
  username: string
  role: UserRole
  genre: string
  photo_profil?: string | null
  email_verified: boolean
  created_at: string
  updated_at: string
}

// ✅ Type complet avec tous les champs possibles
type PrecepteurInfo = {
  id: number
  user_id: string
  commune?: string | null
  quartier?: string | null
  annees_experience?: number | null
  diplome?: string | null
  etablissement_origine?: string | null
  statut_verification: string
  disponible: boolean
  note_moyenne: number
  telephone?: string | null
  latitude?: number | null
  longitude?: number | null
  created_at?: string
  updated_at?: string
  precepteur_matieres: Array<{
    matiere_id: number
    matiere: any
  }>
} | null

type AuthContextType = {
  user: User | null
  precepteurInfo: PrecepteurInfo
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<{
    success: boolean
    error?: string
    code?: string
    user?: any
  }>
  register: (data: {
    email: string
    password: string
    username: string
    role: string
    genre: string
  }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => void
  refreshPrecepteurInfo: () => Promise<void>
  setPrecepteurInfoDirect: (info: PrecepteurInfo) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const USER_STORAGE_KEY = 'excellence-user'
const PRECEPTEUR_STORAGE_KEY = 'excellence-precepteur'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [precepteurInfo, setPrecepteurInfo] = useState<PrecepteurInfo>(null)
  const [loading, setLoading] = useState(true)
  const isInitialMount = useRef(true)
  const router = useRouter()

  // Initialisation au chargement
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      restoreSession()
    }
  }, [])

  const restoreSession = async () => {
    try {
      // D'abord essayer de restaurer depuis le localStorage
      const storedUser = localStorage.getItem(USER_STORAGE_KEY)
      
      if (storedUser) {
        const userData = JSON.parse(storedUser) as User
        const validRoles: UserRole[] = ['admin', 'parent', 'precepteur', 'responsable_pedagogique']
        
        if (validRoles.includes(userData.role)) {
          setUser(userData)
          
          const storedPrecepteur = localStorage.getItem(PRECEPTEUR_STORAGE_KEY)
          if (storedPrecepteur && userData.role === 'precepteur') {
            setPrecepteurInfo(JSON.parse(storedPrecepteur))
          }
          
          setLoading(false)
          return
        }
      }

      // Si pas de localStorage, vérifier avec le serveur
      const result = await getCurrentUser()
      
      if (result.success && result.user) {
        setUser(result.user as User)
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(result.user))
      }
    } catch (error) {
      console.error('Erreur restauration session:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const result = await serverLogin(email, password)

      if (result.success && result.user) {
        const userData = result.user as User
        setUser(userData)
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))

        // Charger les infos précepteur si nécessaire
        if (userData.role === 'precepteur') {
          const { getPrecepteurInfo } = await import('@/actions/auth')
          const precepteurResult = await getPrecepteurInfo()
          
          if (precepteurResult.success && precepteurResult.precepteurInfo) {
            setPrecepteurInfo(precepteurResult.precepteurInfo)
            localStorage.setItem(PRECEPTEUR_STORAGE_KEY, JSON.stringify(precepteurResult.precepteurInfo))
          }
        }

        return { success: true, user: userData }
      }

      return {
        success: false,
        error: result.error || 'Erreur de connexion',
        code: result.code,
        user: result.user
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Erreur de connexion au serveur' }
    }
  }

  const register = async (formData: {
    email: string
    password: string
    username: string
    role: string
    genre: string
  }) => {
    try {
      const result = await serverRegister(formData)
      return {
        success: result.success || false,
        error: result.error
      }
    } catch (error) {
      console.error('Register error:', error)
      return { success: false, error: 'Erreur lors de l\'inscription' }
    }
  }

  const logout = async () => {
    try {
      await serverLogout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setPrecepteurInfo(null)
      localStorage.removeItem(USER_STORAGE_KEY)
      localStorage.removeItem(PRECEPTEUR_STORAGE_KEY)
    }
  }

  const updateUser = useCallback((userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser))
    }
  }, [user])

  const refreshPrecepteurInfo = async () => {
    if (!user || user.role !== 'precepteur') return

    try {
      const { getPrecepteurInfo } = await import('@/actions/auth')
      const result = await getPrecepteurInfo()

      if (result.success && result.precepteurInfo) {
        setPrecepteurInfo(result.precepteurInfo)
        localStorage.setItem(PRECEPTEUR_STORAGE_KEY, JSON.stringify(result.precepteurInfo))
      }
    } catch (error) {
      console.error('Erreur rafraîchissement infos précepteur:', error)
    }
  }

  const setPrecepteurInfoDirect = useCallback((info: PrecepteurInfo) => {
    setPrecepteurInfo(info)
    if (info) {
      localStorage.setItem(PRECEPTEUR_STORAGE_KEY, JSON.stringify(info))
    } else {
      localStorage.removeItem(PRECEPTEUR_STORAGE_KEY)
    }
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      precepteurInfo,
      isAuthenticated: !!user,
      loading,
      login,
      register,
      logout,
      updateUser,
      refreshPrecepteurInfo,
      setPrecepteurInfoDirect
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useRole() {
  const { user } = useAuth()

  return {
    isAdmin: user?.role === 'admin',
    isParent: user?.role === 'parent',
    isPrecepteur: user?.role === 'precepteur',
    isResponsable: user?.role === 'responsable_pedagogique',
    role: user?.role,
    hasRole: (roles: UserRole | UserRole[]) => {
      if (!user) return false
      if (Array.isArray(roles)) {
        return roles.includes(user.role)
      }
      return user.role === roles
    }
  }
}