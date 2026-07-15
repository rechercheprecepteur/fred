
// 'use client'

// import { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react'
// import { useRouter } from 'next/navigation'
// import { login as serverLogin, register as serverRegister, logout as serverLogout, getCurrentUser } from '@/actions/auth'

// type UserRole = 'admin' | 'parent' | 'precepteur' | 'responsable_pedagogique'

// type User = {
//   id: string
//   email: string
//   username: string
//   role: UserRole
//   genre: string
//   photo_profil?: string | null
//   email_verified: boolean
//   created_at: string
//   updated_at: string
// }

// type PrecepteurInfo = {
//   id: number
//   user_id: string
//   commune?: string | null
//   quartier?: string | null
//   annees_experience?: number | null
//   diplome?: string | null
//   etablissement_origine?: string | null
//   statut_verification: string
//   disponible: boolean
//   note_moyenne: number
//   telephone?: string | null
//   latitude?: number | null
//   longitude?: number | null
//   created_at?: string
//   updated_at?: string
//   precepteur_matieres: Array<{
//     matiere_id: number
//     matiere: any
//   }>
// } | null

// type AuthContextType = {
//   user: User | null
//   precepteurInfo: PrecepteurInfo
//   isAuthenticated: boolean
//   loading: boolean
//   login: (email: string, password: string) => Promise<{
//     success: boolean
//     error?: string
//     code?: string
//     user?: any
//   }>
//   register: (data: {
//     email: string
//     password: string
//     username: string
//     role: string
//     genre: string
//   }) => Promise<{ success: boolean; error?: string }>
//   logout: () => Promise<void>
//   updateUser: (userData: Partial<User>) => void
//   refreshPrecepteurInfo: () => Promise<void>
//   setPrecepteurInfoDirect: (info: PrecepteurInfo) => void
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)
// const USER_STORAGE_KEY = 'excellence-user'
// const PRECEPTEUR_STORAGE_KEY = 'excellence-precepteur'

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [precepteurInfo, setPrecepteurInfo] = useState<PrecepteurInfo>(null)
//   const [loading, setLoading] = useState(true)
//   const isInitialMount = useRef(true)
//   const router = useRouter()

//   // Initialisation au chargement
//   useEffect(() => {
//     if (isInitialMount.current) {
//       isInitialMount.current = false
//       restoreSession()
//     }
//   }, [])

//   const restoreSession = async () => {
//     try {
//       // D'abord essayer de restaurer depuis le localStorage
//       const storedUser = localStorage.getItem(USER_STORAGE_KEY)
      
//       if (storedUser) {
//         const userData = JSON.parse(storedUser) as User
//         const validRoles: UserRole[] = ['admin', 'parent', 'precepteur', 'responsable_pedagogique']
        
//         if (validRoles.includes(userData.role)) {
//           setUser(userData)
          
//           const storedPrecepteur = localStorage.getItem(PRECEPTEUR_STORAGE_KEY)
//           if (storedPrecepteur && userData.role === 'precepteur') {
//             setPrecepteurInfo(JSON.parse(storedPrecepteur))
//           }
          
//           // Vérifier aussi avec le serveur pour s'assurer que la session est valide
//           try {
//             const result = await getCurrentUser()
//             if (result.success && result.user) {
//               setUser(result.user as User)
//               localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(result.user))
              
//               if (result.precepteurInfo) {
//                 setPrecepteurInfo(result.precepteurInfo)
//                 localStorage.setItem(PRECEPTEUR_STORAGE_KEY, JSON.stringify(result.precepteurInfo))
//               }
//             }
//           } catch (error) {
//             console.log('Session serveur invalide, utilisation du cache local')
//           }
          
//           setLoading(false)
//           return
//         }
//       }

//       // Si pas de localStorage, vérifier avec le serveur
//       const result = await getCurrentUser()
      
//       if (result.success && result.user) {
//         setUser(result.user as User)
//         localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(result.user))
        
//         if (result.precepteurInfo) {
//           setPrecepteurInfo(result.precepteurInfo)
//           localStorage.setItem(PRECEPTEUR_STORAGE_KEY, JSON.stringify(result.precepteurInfo))
//         }
//       }
//     } catch (error) {
//       console.error('Erreur restauration session:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

// const login = async (email: string, password: string) => {
//   try {
//     console.log('🔐 Tentative de connexion directe:', email);
    
//     // ✅ Appel DIRECT à l'API au lieu de passer par les Server Actions
//     const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
//     const response = await fetch(`${API_URL}/auth/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//       credentials: 'include',
//     });

//     const data = await response.json();
//     console.log('📥 Réponse login:', {
//       success: data.success,
//       hasToken: !!data.token,
//       hasUser: !!data.user
//     });

//     if (data.success && data.user) {
//       const userData = data.user as User;
//       setUser(userData);
      
//       // ✅ Sauvegarder dans localStorage (côté client = OK)
//       localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
//       console.log('✅ Utilisateur sauvegardé');

//       // ✅ Sauvegarder le token
//       if (data.token) {
//         localStorage.setItem('excellence-token', data.token);
//         console.log('✅ Token sauvegardé:', data.token.substring(0, 30) + '...');
//       } else {
//         console.error('❌ Pas de token dans la réponse!');
//       }

//       // Charger les infos précepteur si nécessaire
//       if (userData.role === 'precepteur') {
//         try {
//           const precepteurResponse = await fetch(`${API_URL}/auth/me`, {
//             headers: {
//               'Authorization': `Bearer ${data.token}`,
//               'Content-Type': 'application/json'
//             },
//             credentials: 'include',
//           });
//           const precepteurData = await precepteurResponse.json();
          
//           if (precepteurData.success && precepteurData.precepteurInfo) {
//             setPrecepteurInfo(precepteurData.precepteurInfo);
//             localStorage.setItem(PRECEPTEUR_STORAGE_KEY, JSON.stringify(precepteurData.precepteurInfo));
//           }
//         } catch (err) {
//           console.error('Erreur chargement infos précepteur:', err);
//         }
//       }

//       return { success: true, user: userData };
//     }

//     return {
//       success: false,
//       error: data.error || 'Erreur de connexion',
//       code: data.code,
//     };
//   } catch (error) {
//     console.error('❌ Erreur login:', error);
//     return { success: false, error: 'Erreur de connexion au serveur' };
//   }
// };

//   const register = async (formData: {
//     email: string
//     password: string
//     username: string
//     role: string
//     genre: string
//   }) => {
//     try {
//       // ✅ Appel à notre nouveau backend Express
//       const result = await serverRegister(formData)
//       return {
//         success: result.success || false,
//         error: result.error
//       }
//     } catch (error) {
//       console.error('Register error:', error)
//       return { success: false, error: 'Erreur lors de l\'inscription' }
//     }
//   }

//   const logout = async () => {
//     try {
//       // ✅ Appel à notre nouveau backend Express
//       await serverLogout()
//     } catch (error) {
//       console.error('Logout error:', error)
//     } finally {
//       setUser(null)
//       setPrecepteurInfo(null)
//       localStorage.removeItem(USER_STORAGE_KEY)
//       localStorage.removeItem(PRECEPTEUR_STORAGE_KEY)
//       localStorage.removeItem('excellence-token')
      
//       // Rediriger vers la page de login
//       router.push('/login')
//     }
//   }

//   const updateUser = useCallback((userData: Partial<User>) => {
//     if (user) {
//       const updatedUser = { ...user, ...userData }
//       setUser(updatedUser)
//       localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser))
//     }
//   }, [user])

//   const refreshPrecepteurInfo = async () => {
//     if (!user || user.role !== 'precepteur') return

//     try {
//       const { getPrecepteurInfo } = await import('@/actions/auth')
//       const result = await getPrecepteurInfo()

//       if (result.success && result.precepteurInfo) {
//         setPrecepteurInfo(result.precepteurInfo)
//         localStorage.setItem(PRECEPTEUR_STORAGE_KEY, JSON.stringify(result.precepteurInfo))
//       }
//     } catch (error) {
//       console.error('Erreur rafraîchissement infos précepteur:', error)
//     }
//   }

//   const setPrecepteurInfoDirect = useCallback((info: PrecepteurInfo) => {
//     setPrecepteurInfo(info)
//     if (info) {
//       localStorage.setItem(PRECEPTEUR_STORAGE_KEY, JSON.stringify(info))
//     } else {
//       localStorage.removeItem(PRECEPTEUR_STORAGE_KEY)
//     }
//   }, [])

//   return (
//     <AuthContext.Provider value={{
//       user,
//       precepteurInfo,
//       isAuthenticated: !!user,
//       loading,
//       login,
//       register,
//       logout,
//       updateUser,
//       refreshPrecepteurInfo,
//       setPrecepteurInfoDirect
//     }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }

// export function useRole() {
//   const { user } = useAuth()

//   return {
//     isAdmin: user?.role === 'admin',
//     isParent: user?.role === 'parent',
//     isPrecepteur: user?.role === 'precepteur',
//     isResponsable: user?.role === 'responsable_pedagogique',
//     role: user?.role,
//     hasRole: (roles: UserRole | UserRole[]) => {
//       if (!user) return false
//       if (Array.isArray(roles)) {
//         return roles.includes(user.role)
//       }
//       return user.role === roles
//     }
//   }
// }


// contexts/AuthContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  login as serverLogin, 
  register as serverRegister, 
  logout as serverLogout, 
  getCurrentUser,
  getPrecepteurInfo as fetchPrecepteurInfo,
  updateProfilePhoto as uploadProfilePhoto
} from '@/actions/auth'

// Types
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
  updateProfilePhoto: (file: File) => Promise<{ success: boolean; photoUrl?: string; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Clés de stockage
const USER_STORAGE_KEY = 'excellence-user'
const PRECEPTEUR_STORAGE_KEY = 'excellence-precepteur'
const TOKEN_STORAGE_KEY = 'excellence-token'

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

  /**
   * Restaure la session utilisateur
   */
  const restoreSession = async () => {
    try {
      console.log('🔄 Restauration de la session...')
      
      // Vérifier d'abord avec le serveur (via les cookies)
      try {
        const result = await getCurrentUser()
        console.log('📡 Résultat getCurrentUser:', { 
          success: result.success, 
          hasUser: !!result.user,
          hasPrecepteurInfo: !!result.precepteurInfo 
        })
        
        if (result.success && result.user) {
          setUser(result.user as User)
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(result.user))
          
          if (result.precepteurInfo) {
            setPrecepteurInfo(result.precepteurInfo as PrecepteurInfo)
            localStorage.setItem(PRECEPTEUR_STORAGE_KEY, JSON.stringify(result.precepteurInfo))
          }
          
          console.log('✅ Session restaurée depuis le serveur')
          setLoading(false)
          return
        }
      } catch (error) {
        console.log('⚠️ Impossible de restaurer depuis le serveur, tentative localStorage...')
      }

      // Fallback: Restaurer depuis le localStorage
      const storedUser = localStorage.getItem(USER_STORAGE_KEY)
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser) as User
          const validRoles: UserRole[] = ['admin', 'parent', 'precepteur', 'responsable_pedagogique']
          
          if (validRoles.includes(userData.role)) {
            setUser(userData)
            
            const storedPrecepteur = localStorage.getItem(PRECEPTEUR_STORAGE_KEY)
            if (storedPrecepteur && userData.role === 'precepteur') {
              try {
                setPrecepteurInfo(JSON.parse(storedPrecepteur) as PrecepteurInfo)
              } catch (e) {
                console.error('❌ Erreur parsing precepteur info:', e)
              }
            }
            
            console.log('✅ Session restaurée depuis localStorage')
            setLoading(false)
            return
          }
        } catch (e) {
          console.error('❌ Erreur parsing user data:', e)
        }
      }

      console.log('❌ Aucune session trouvée')
    } catch (error) {
      console.error('❌ Erreur restauration session:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Charge les informations du précepteur
   */
  const loadPrecepteurInfo = async (token?: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const authToken = token || localStorage.getItem(TOKEN_STORAGE_KEY)
      
      if (!authToken) {
        console.error('❌ Aucun token disponible pour charger les infos précepteur')
        return
      }
      
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      })
      
      const data = await response.json()
      
      if (data.success && data.precepteurInfo) {
        setPrecepteurInfo(data.precepteurInfo as PrecepteurInfo)
        localStorage.setItem(PRECEPTEUR_STORAGE_KEY, JSON.stringify(data.precepteurInfo))
        console.log('✅ Infos précepteur chargées')
      }
    } catch (err) {
      console.error('❌ Erreur chargement infos précepteur:', err)
    }
  }

  /**
   * Connexion
   */
  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Tentative de connexion:', email)
      
      // Appel à l'API directement
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      const data = await response.json()
      console.log('📥 Réponse login:', {
        success: data.success,
        hasToken: !!data.token,
        hasUser: !!data.user
      })

      if (data.success && data.user) {
        const userData = data.user as User
        setUser(userData)
        
        // Sauvegarder dans localStorage
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
        console.log('✅ Utilisateur sauvegardé dans localStorage')

        // Sauvegarder le token
        if (data.token) {
          localStorage.setItem(TOKEN_STORAGE_KEY, data.token)
          console.log('✅ Token sauvegardé dans localStorage')
          
          // ÉGALEMENT sauvegarder dans un cookie (important pour le serveur)
          document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`
          console.log('✅ Token sauvegardé dans les cookies')
        } else {
          console.error('❌ Pas de token dans la réponse!')
        }

        // Charger les infos précepteur si nécessaire
        if (userData.role === 'precepteur') {
          await loadPrecepteurInfo(data.token)
        }

        return { success: true, user: userData }
      }

      return {
        success: false,
        error: data.error || 'Erreur de connexion',
        code: data.code,
      }
    } catch (error) {
      console.error('❌ Erreur login:', error)
      return { success: false, error: 'Erreur de connexion au serveur' }
    }
  }

  /**
   * Inscription
   */
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
      console.error('❌ Erreur register:', error)
      return { success: false, error: 'Erreur lors de l\'inscription' }
    }
  }

  /**
   * Déconnexion
   */
  const logout = async () => {
    try {
      console.log('🚪 Déconnexion...')
      
      // Appeler l'API de déconnexion
      await serverLogout()
    } catch (error) {
      console.error('❌ Erreur logout API:', error)
    } finally {
      // Nettoyer l'état local
      setUser(null)
      setPrecepteurInfo(null)
      
      // Nettoyer le localStorage
      localStorage.removeItem(USER_STORAGE_KEY)
      localStorage.removeItem(PRECEPTEUR_STORAGE_KEY)
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      
      // Nettoyer les cookies
      document.cookie = 'token=; path=/; max-age=0; SameSite=Lax'
      
      console.log('✅ Déconnexion terminée')
      
      // Rediriger vers la page de login
      router.push('/login')
    }
  }

  /**
   * Mettre à jour l'utilisateur
   */
  const updateUser = useCallback((userData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return prevUser
      const updatedUser = { ...prevUser, ...userData }
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser))
      return updatedUser
    })
  }, [])

  /**
   * Rafraîchir les infos du précepteur
   */
  const refreshPrecepteurInfo = async () => {
    if (!user || user.role !== 'precepteur') return

    try {
      const result = await fetchPrecepteurInfo()

      if (result.success && result.precepteurInfo) {
        setPrecepteurInfo(result.precepteurInfo as PrecepteurInfo)
        localStorage.setItem(PRECEPTEUR_STORAGE_KEY, JSON.stringify(result.precepteurInfo))
      }
    } catch (error) {
      console.error('❌ Erreur rafraîchissement infos précepteur:', error)
    }
  }

  /**
   * Définir directement les infos précepteur
   */
  const setPrecepteurInfoDirect = useCallback((info: PrecepteurInfo) => {
    setPrecepteurInfo(info)
    if (info) {
      localStorage.setItem(PRECEPTEUR_STORAGE_KEY, JSON.stringify(info))
    } else {
      localStorage.removeItem(PRECEPTEUR_STORAGE_KEY)
    }
  }, [])

  /**
   * Mettre à jour la photo de profil
   */
  const updateProfilePhoto = async (file: File): Promise<{ success: boolean; photoUrl?: string; error?: string }> => {
    try {
      const result = await uploadProfilePhoto(file)
      
      if (result.success && result.photoUrl) {
        updateUser({ photo_profil: result.photoUrl })
        return { success: true, photoUrl: result.photoUrl }
      }
      
      return { success: false, error: result.error || 'Erreur lors de l\'upload' }
    } catch (error: any) {
      console.error('❌ Erreur updateProfilePhoto:', error)
      return { success: false, error: error.message || 'Erreur lors de l\'upload' }
    }
  }

  // Valeur du contexte
  const contextValue: AuthContextType = {
    user,
    precepteurInfo,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshPrecepteurInfo,
    setPrecepteurInfoDirect,
    updateProfilePhoto
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook useAuth
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/**
 * Hook useRole
 */
export function useRole() {
  const { user } = useAuth()

  return {
    isAdmin: user?.role === 'admin',
    isParent: user?.role === 'parent',
    isPrecepteur: user?.role === 'precepteur',
    isResponsable: user?.role === 'responsable_pedagogique',
    role: user?.role || null,
    hasRole: (roles: UserRole | UserRole[]) => {
      if (!user) return false
      if (Array.isArray(roles)) {
        return roles.includes(user.role)
      }
      return user.role === roles
    }
  }
}

export default AuthContext