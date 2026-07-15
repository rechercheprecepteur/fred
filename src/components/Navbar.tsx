// app/components/Navbar.tsx
'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  PiUser, 
  PiSignOut, 
  PiHouse, 
  PiUsers, 
  PiFileText, 
  PiGear, 
  PiChartBar,
  PiGraduationCap,
  PiBookOpen,
  PiMagnifyingGlass,
  PiList,
  PiX,
  PiBell
} from 'react-icons/pi'
import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import { ArrowUpDown } from 'lucide-react'

type NavLink = {
  href: string
  label: string
  icon: React.ReactNode
  roles: string[]
}

type Notification = {
  id: number
  titre: string
  message: string
  type: string
  lien: string | null
  lu: boolean
  created_at: string
}

// ✅ Helper pour construire l'URL de l'image
const getImageUrl = (photoPath?: string | null): string => {
  if (!photoPath) return ''
  
  // Si c'est déjà une URL complète
  if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
    return photoPath
  }
  
  // Récupérer l'URL de base SANS le /api
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  const BASE_URL = API_URL.replace('/api', '')
  
  // Si le chemin commence par /uploads, le retourner directement
  if (photoPath.startsWith('/uploads')) {
    return `${BASE_URL}${photoPath}`
  }
  
  // Sinon, construire le chemin complet
  return `${BASE_URL}/uploads/profils/${photoPath}`
}

// 🔥 Liens avec dashboard dynamique selon le rôle
const getNavLinks = (role: string): NavLink[] => [
  {
    href: `/dashboard/${role}`,
    label: 'Dashboard',
    icon: <PiHouse className="w-4 h-4" />,
    roles: ['parent', 'precepteur', 'admin', 'responsable_pedagogique']
  },
  {
    href: '/recherche',
    label: 'Rechercher',
    icon: <PiMagnifyingGlass className="w-4 h-4" />,
    roles: ['parent']
  },
  {
    href: '/solicitation',
    label: 'Solicitations',
    icon: <PiFileText className="w-4 h-4" />,
    roles: ['precepteur']
  },
  {
    href: '/dashboard/admin/matieres',
    label: 'Matières',
    icon: <PiBookOpen className="w-4 h-4" />,
    roles: ['admin']
  },
  {
    href: '/parent/services',
    label: 'Services',
    icon: <ArrowUpDown className="w-4 h-4" />,
    roles: ['parent']
  },
  {
    href: '/dashboard/admin/verifications',
    label: 'Vérifications',
    icon: <CheckBadgeIcon className="w-4 h-4" />,
    roles: ['admin']
  },
]

export default function Navbar() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // 🆕 États pour les notifications
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const notificationRef = useRef<HTMLDivElement>(null)

  // 🆕 Charger les notifications
  useEffect(() => {
    if (user) {
      loadNotifications()
      
      // 🔄 Recharger toutes les 30 secondes
      const interval = setInterval(loadNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  // 🆕 Fermer le panneau de notifications au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadNotifications = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) {
        console.warn('⚠️ Erreur chargement notifications:', error.message)
        return
      }

      setNotifications(data || [])
      setUnreadCount((data || []).filter(n => !n.lu).length)
    } catch (err) {
      console.warn('⚠️ Table notifications peut ne pas exister')
    }
  }

  const markAsRead = async (notificationId: number) => {
    try {
      await supabase
        .from('notifications')
        .update({ lu: true })
        .eq('id', notificationId)

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, lu: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.warn('⚠️ Erreur marquage notification')
    }
  }

  const markAllAsRead = async () => {
    if (!user) return

    try {
      await supabase
        .from('notifications')
        .update({ lu: true })
        .eq('user_id', user.id)
        .eq('lu', false)

      setNotifications(prev => prev.map(n => ({ ...n, lu: true })))
      setUnreadCount(0)
    } catch (err) {
      console.warn('⚠️ Erreur marquage notifications')
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    setShowNotifications(false)
    
    if (notification.lien) {
      router.push(notification.lien)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'contrat':
        return <PiFileText className="w-4 h-4 text-blue-500" />
      case 'session':
        return <PiBookOpen className="w-4 h-4 text-green-500" />
      case 'verification':
        return <CheckBadgeIcon className="w-4 h-4 text-purple-500" />
      default:
        return <PiBell className="w-4 h-4 text-gray-500" />
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/login')
    setMobileMenuOpen(false)
  }

  // 🔥 Dashboard dynamique selon le rôle
  const dashboardLink = user ? `/dashboard/${user.role}` : '/login'
  
  // 🔥 Liens filtrés dynamiquement
  const filteredLinks = user 
    ? getNavLinks(user.role).filter(link => link.roles.includes(user.role))
    : []

  // ✅ État pour gérer les erreurs de chargement d'image
  const [imgError, setImgError] = useState(false)

  // Skeleton pour le loading
  if (loading) {
    return (
      <nav className="bg-white border w-full max-w-5xl mx-auto rounded-xl mt-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
              <div className="w-20 h-5 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white border w-full max-w-5xl mx-auto rounded-xl mt-2 border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo - redirige vers le dashboard dynamique */}
          <Link href={dashboardLink} className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:opacity-80 transition-opacity flex-shrink-0">
            <img src='/icon.png' alt='Logo' className='w-auto h-10' />
            <span className="hidden sm:inline">Préc'App</span>
          </Link>

          {/* Liens desktop - centrés */}
          {user && filteredLinks.length > 0 && (
            <div className="hidden md:flex items-center gap-1 mx-4">
              {filteredLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {link.icon}
                    <span className="hidden lg:inline">{link.label}</span>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Partie droite */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* 🆕 Bouton Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <PiBell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* 🆕 Panneau de notifications */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                      <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Tout marquer comme lu
                          </button>
                        )}
                      </div>

                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center">
                            <PiBell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Aucune notification</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <button
                              key={notification.id}
                              onClick={() => handleNotificationClick(notification)}
                              className={`w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${
                                !notification.lu ? 'bg-blue-50/50' : ''
                              }`}
                            >
                              <div className="flex gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className={`text-sm font-medium truncate ${
                                      !notification.lu ? 'text-gray-900' : 'text-gray-600'
                                    }`}>
                                      {notification.titre}
                                    </p>
                                    {!notification.lu && (
                                      <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {new Date(notification.created_at).toLocaleDateString('fr-FR', {
                                      day: 'numeric',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* ✅ Profil - AVEC CORRECTION IMAGE */}
                <Link 
                  href={dashboardLink}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity px-2 py-1 rounded-lg hover:bg-gray-50"
                >
                  {user.photo_profil && !imgError ? (
                    <img 
                      src={getImageUrl(user.photo_profil)} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
                      onError={() => {
                        console.error('❌ Erreur chargement photo navbar:', getImageUrl(user.photo_profil))
                        setImgError(true)
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm font-medium text-white ring-2 ring-gray-100">
                      {user.username?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-medium leading-tight">{user.username}</span>
                    <span className="text-xs text-gray-500 capitalize leading-tight">{user.role.replace('_', ' ')}</span>
                  </div>
                </Link>

                {/* Déconnexion desktop */}
                <button 
                  onClick={handleLogout} 
                  className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <PiSignOut className="w-4 h-4" />
                  <span className="hidden lg:inline">Déconnexion</span>
                </button>

                {/* Burger mobile */}
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {mobileMenuOpen ? <PiX className="w-5 h-5" /> : <PiList className="w-5 h-5" />}
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="text-sm px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>

        {/* Menu mobile */}
        {user && mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1 animate-slideDown">
            {/* Notifications en mobile */}
            <div className="px-4 py-2">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications)
                }}
                className="flex items-center gap-3 w-full px-2 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                <PiBell className="w-4 h-4" />
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {filteredLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              )
            })}
            
            {/* Déconnexion mobile */}
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full"
            >
              <PiSignOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}