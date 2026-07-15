// app/admin/utilisateurs/page.tsx
'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getAllUsers, updateUserRole, deleteUser, adminVerifyUserEmail } from '@/actions/admin'
import {
  User, Users, Search, Shield, Eye, Trash2, Check, X, AlertCircle,
  RefreshCw, Plus, Mail, Calendar, GraduationCap, UserCheck,
  UserPlus, Edit3, UserX, MailCheck, MailX, Filter,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react'
import Loader from '@/components/Loader'

// ============ TYPES ============
type UserWithDetails = {
  id: string
  username: string
  email: string
  role: string
  genre: string
  photo_profil: string | null
  email_verified: boolean
  created_at: string
  updated_at: string
  precepteurDetails?: {
    id: number
    commune: string | null
    quartier: string | null
    annees_experience: number
    diplome: string | null
    statut_verification: string
    disponible: boolean
    note_moyenne: number
  } | null
}

const ITEMS_PER_PAGE = 10

// ✅ Helper pour construire l'URL de l'image
const getImageUrl = (photoPath?: string | null): string => {
  if (!photoPath) return ''
  if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
    return photoPath
  }
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  const BASE_URL = API_URL.replace('/api', '')
  if (photoPath.startsWith('/uploads')) {
    return `${BASE_URL}${photoPath}`
  }
  return `${BASE_URL}/uploads/profils/${photoPath}`
}

// ============ COMPOSANTS MODAUX ============

function QuickRoleModal({ user, onClose, onConfirm }: {
  user: UserWithDetails
  onClose: () => void
  onConfirm: (role: string) => Promise<void>
}) {
  const [role, setRole] = useState(user.role)
  const [saving, setSaving] = useState(false)

  const roles = [
    { value: 'parent', label: 'Parent', icon: Users, color: 'green' },
    { value: 'precepteur', label: 'Précepteur', icon: GraduationCap, color: 'blue' },
    { value: 'responsable_pedagogique', label: 'Resp. Pédago.', icon: UserCheck, color: 'orange' },
    { value: 'admin', label: 'Admin', icon: Shield, color: 'purple' },
  ]

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Changer le rôle</h3>
          <p className="text-sm text-gray-500 mb-4">{user.username} • {user.email}</p>
          
          <div className="space-y-2 mb-6">
            {roles.map(r => {
              const Icon = r.icon
              return (
                <button
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    role === r.value 
                      ? `border-${r.color}-500 bg-${r.color}-50` 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 text-${r.color}-600`} />
                  <span className="font-medium text-sm">{r.label}</span>
                  {role === r.value && <Check className="w-4 h-4 ml-auto text-green-500" />}
                </button>
              )
            })}
          </div>

          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium">
              Annuler
            </button>
            <button
              onClick={async () => {
                setSaving(true)
                await onConfirm(role)
                setSaving(false)
                onClose()
              }}
              disabled={saving || role === user.role}
              className="flex-1 px-4 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Appliquer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function UserDetailModal({ user, onClose, onVerifyEmail, onRoleChange }: {
  user: UserWithDetails
  onClose: () => void
  onVerifyEmail: (id: string) => Promise<void>
  onRoleChange: (id: string, role: string) => Promise<void>
}) {
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [imgError, setImgError] = useState(false)
  
  const getRoleStyle = (role: string) => {
    const styles: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-700 border-purple-200',
      precepteur: 'bg-blue-100 text-blue-700 border-blue-200',
      parent: 'bg-green-100 text-green-700 border-green-200',
      responsable_pedagogique: 'bg-orange-100 text-orange-700 border-orange-200',
    }
    return styles[role] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="sticky top-0 bg-white border-b p-6 flex items-center gap-4 z-10">
            {user.photo_profil && !imgError ? (
              <img 
                src={getImageUrl(user.photo_profil)} 
                alt="" 
                className="w-14 h-14 rounded-xl object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <User className="w-7 h-7 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-lg font-bold">{user.username}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getRoleStyle(user.role)}`}>
                {user.role === 'precepteur' ? <GraduationCap className="w-3.5 h-3.5" /> : 
                 user.role === 'admin' ? <Shield className="w-3.5 h-3.5" /> :
                 user.role === 'parent' ? <Users className="w-3.5 h-3.5" /> :
                 <UserCheck className="w-3.5 h-3.5" />}
                {user.role === 'responsable_pedagogique' ? 'Resp. Pédago.' : user.role}
              </span>
              {user.email_verified ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                  <MailCheck className="w-3.5 h-3.5" /> Email vérifié
                </span>
              ) : (
                <button
                  onClick={() => onVerifyEmail(user.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200 hover:bg-green-100 hover:text-green-700 hover:border-green-200 transition-all cursor-pointer"
                >
                  <MailX className="w-3.5 h-3.5" /> Valider l'email
                </button>
              )}
            </div>

            {/* Infos rapides */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-0.5">Genre</p>
                <p className="font-medium text-sm capitalize">{user.genre}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-0.5">Inscrit le</p>
                <p className="font-medium text-sm">{new Date(user.created_at).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>

            {/* Détails précepteur */}
            {user.role === 'precepteur' && user.precepteurDetails && (
              <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                <h3 className="font-semibold text-sm text-blue-900 mb-3 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" /> Détails précepteur
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <InfoBadge label="Statut" value={user.precepteurDetails.statut_verification} />
                  <InfoBadge label="Expérience" value={`${user.precepteurDetails.annees_experience} an(s)`} />
                  <InfoBadge label="Note" value={`${user.precepteurDetails.note_moyenne?.toFixed(1) || '0'}/5`} />
                  <InfoBadge label="Disponible" value={user.precepteurDetails.disponible ? 'Oui' : 'Non'} />
                  {user.precepteurDetails.commune && <InfoBadge label="Commune" value={user.precepteurDetails.commune} />}
                  {user.precepteurDetails.diplome && <InfoBadge label="Diplôme" value={user.precepteurDetails.diplome} />}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Fermer
              </button>
              <button
                onClick={() => setShowRoleModal(true)}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" /> Modifier le rôle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sous-modal changement de rôle */}
      {showRoleModal && (
        <QuickRoleModal
          user={user}
          onClose={() => setShowRoleModal(false)}
          onConfirm={(role) => onRoleChange(user.id, role)}
        />
      )}
    </>
  )
}

function InfoBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-lg p-2.5 border border-blue-100">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-sm capitalize">{value}</p>
    </div>
  )
}

function DeleteConfirmModal({ user, onClose, onConfirm }: {
  user: UserWithDetails
  onClose: () => void
  onConfirm: () => Promise<void>
}) {
  const [deleting, setDeleting] = useState(false)

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="text-center">
          <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserX className="w-7 h-7 text-red-600" />
          </div>
          <h3 className="text-lg font-bold mb-1">Supprimer l'utilisateur ?</h3>
          <p className="text-sm text-gray-500 mb-6">
            {user.username} sera définitivement supprimé. Cette action est irréversible.
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={deleting}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              onClick={async () => {
                setDeleting(true)
                await onConfirm()
                setDeleting(false)
                onClose()
              }}
              disabled={deleting}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {deleting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ SKELETON LOADER ============
function UsersTableSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-pulse">
        <div>
          <div className="h-8 bg-gray-200 rounded w-48 mb-2" />
          <div className="h-4 bg-gray-100 rounded w-32" />
        </div>
        <div className="flex gap-2">
          <div className="w-10 h-10 bg-gray-200 rounded-xl" />
          <div className="w-36 h-10 bg-gray-200 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-3 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-1" />
            <div className="h-3 bg-gray-100 rounded w-16 mx-auto" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4 animate-pulse">
        <div className="flex gap-3">
          <div className="flex-1 h-10 bg-gray-100 rounded-xl" />
          <div className="w-40 h-10 bg-gray-100 rounded-xl" />
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="w-9 h-9 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
              <div className="h-6 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-100 rounded w-16" />
              <div className="flex gap-1">
                <div className="w-8 h-8 bg-gray-100 rounded-lg" />
                <div className="w-8 h-8 bg-gray-100 rounded-lg" />
                <div className="w-8 h-8 bg-gray-100 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============ PAGE PRINCIPALE ============

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth()
  
  const [users, setUsers] = useState<UserWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})
  
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('tous')
  const [currentPage, setCurrentPage] = useState(1)
  
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null)
  const [modalType, setModalType] = useState<'detail' | 'role' | 'delete' | null>(null)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    
    try {
      const result = await getAllUsers()
      
      if (result.success && result.users) {
        setUsers(result.users as UserWithDetails[])
        setCurrentPage(1)
      } else {
        setError(result.error || 'Erreur lors du chargement')
      }
    } catch (err) {
      console.error('❌ [AdminUsers] Erreur:', err)
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => setMessage(''), 3000)
    return () => clearTimeout(timer)
  }, [message])

  const filteredUsers = useMemo(() => {
    let result = [...users]
    if (filterRole !== 'tous') {
      result = result.filter(u => u.role === filterRole)
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      result = result.filter(u =>
        u.username.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
      )
    }
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    return result
  }, [users, searchTerm, filterRole])

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredUsers, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterRole])

  const stats = useMemo(() => ({
    total: users.length,
    parents: users.filter(u => u.role === 'parent').length,
    precepteurs: users.filter(u => u.role === 'precepteur').length,
    admins: users.filter(u => u.role === 'admin').length,
    responsables: users.filter(u => u.role === 'responsable_pedagogique').length,
    nonVerifies: users.filter(u => !u.email_verified).length,
  }), [users])

  const handleRoleChange = useCallback(async (userId: string, newRole: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
    
    const result = await updateUserRole(userId, newRole)
    if (result.success) {
      setMessage('✅ Rôle mis à jour')
    } else {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: u.role } : u))
      setMessage('❌ ' + (result.error || 'Erreur'))
    }
    setModalType(null)
    setSelectedUser(null)
  }, [])

  const handleVerifyEmail = useCallback(async (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, email_verified: true } : u))
    
    const result = await adminVerifyUserEmail(userId)
    if (result.success) {
      setMessage('✅ Email vérifié')
    } else {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, email_verified: false } : u))
      setMessage('❌ ' + (result.error || 'Erreur'))
    }
  }, [])

  const handleDeleteUser = useCallback(async (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId))
    setModalType(null)
    setSelectedUser(null)
    
    const result = await deleteUser(userId)
    if (result.success) {
      setMessage('✅ Utilisateur supprimé')
    } else {
      await loadUsers()
      setMessage('❌ ' + (result.error || 'Erreur'))
    }
  }, [loadUsers])

  const handleImageError = (userId: string) => {
    setImgErrors(prev => ({ ...prev, [userId]: true }))
  }

  if (loading) {
    return <UsersTableSkeleton />
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center py-16">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button 
            onClick={loadUsers}
            className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-top-2 duration-300 ${
          message.includes('✅') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Utilisateurs
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{stats.total} utilisateurs au total</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadUsers}
            className="p-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-gray-600"
            title="Actualiser"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'bg-gray-50', icon: Users },
          { label: 'Parents', value: stats.parents, color: 'bg-green-50', icon: Users },
          { label: 'Précepteurs', value: stats.precepteurs, color: 'bg-blue-50', icon: GraduationCap },
          { label: 'Admins', value: stats.admins, color: 'bg-purple-50', icon: Shield },
          { label: 'Resp. Pédago.', value: stats.responsables, color: 'bg-orange-50', icon: UserCheck },
          { label: 'Non vérifiés', value: stats.nonVerifies, color: 'bg-red-50', icon: MailX },
        ].map(stat => (
          <div key={stat.label} className={`${stat.color} rounded-xl p-3 text-center`}>
            <p className="text-xl font-bold">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="tous">Tous les rôles</option>
            <option value="admin">Administrateurs</option>
            <option value="precepteur">Précepteurs</option>
            <option value="parent">Parents</option>
            <option value="responsable_pedagogique">Resp. Pédago.</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {paginatedUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Users className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Aucun utilisateur trouvé</p>
            <p className="text-gray-400 text-sm">Essayez de modifier vos filtres</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Email</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Rôle</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Vérifié</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedUsers.map(user => {
                    const roleConfig: Record<string, { bg: string; text: string; border: string; icon: any }> = {
                      admin: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: Shield },
                      precepteur: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: GraduationCap },
                      parent: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: Users },
                      responsable_pedagogique: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: UserCheck },
                    }
                    const c = roleConfig[user.role] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', icon: User }
                    const RoleIcon = c.icon
                    
                    return (
                      <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {user.photo_profil && !imgErrors[user.id] ? (
                              <img 
                                src={getImageUrl(user.photo_profil)} 
                                alt="" 
                                className="w-9 h-9 rounded-full object-cover"
                                onError={() => handleImageError(user.id)}
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-sm text-gray-900">{user.username}</p>
                              <p className="text-xs text-gray-500 md:hidden">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium border rounded-full ${c.bg} ${c.text} ${c.border}`}>
                            <RoleIcon className="w-3 h-3" />
                            {user.role === 'responsable_pedagogique' ? 'Resp. Pédago.' : user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 hidden sm:table-cell">
                          {user.email_verified ? (
                            <span className="inline-flex items-center gap-1 text-xs text-green-600">
                              <Check className="w-3 h-3" /> Vérifié
                            </span>
                          ) : (
                            <button
                              onClick={() => handleVerifyEmail(user.id)}
                              className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-green-600 transition-colors"
                            >
                              <X className="w-3 h-3" /> Valider
                            </button>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => { setSelectedUser(user); setModalType('detail') }}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Détails"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => { setSelectedUser(user); setModalType('role') }}
                              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                              title="Changer le rôle"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            {currentUser?.id !== user.id && (
                              <button
                                onClick={() => { setSelectedUser(user); setModalType('delete') }}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Page {currentPage} sur {totalPages} • {filteredUsers.length} résultat{filteredUsers.length > 1 ? 's' : ''}
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .map((p, i, arr) => (
                      <div key={p} className="flex items-center">
                        {i > 0 && arr[i - 1] !== p - 1 && <span className="px-1 text-gray-400">...</span>}
                        <button onClick={() => setCurrentPage(p)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${currentPage === p ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-700'}`}>
                          {p}
                        </button>
                      </div>
                    ))}
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {modalType === 'detail' && selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => { setModalType(null); setSelectedUser(null) }}
          onVerifyEmail={handleVerifyEmail}
          onRoleChange={handleRoleChange}
        />
      )}

      {modalType === 'role' && selectedUser && (
        <QuickRoleModal
          user={selectedUser}
          onClose={() => { setModalType(null); setSelectedUser(null) }}
          onConfirm={(role) => handleRoleChange(selectedUser.id, role)}
        />
      )}

      {modalType === 'delete' && selectedUser && (
        <DeleteConfirmModal
          user={selectedUser}
          onClose={() => { setModalType(null); setSelectedUser(null) }}
          onConfirm={() => handleDeleteUser(selectedUser.id)}
        />
      )}
    </div>
  )
}