
// // app/admin/utilisateurs/page.tsx
// 'use client'

// import { useState, useEffect } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import { getAllUsers, updateUserRole, deleteUser } from '@/actions/auth'
// import {
//   User,
//   Users,
//   Search,
//   Shield,
//   Eye,
//   Trash2,
//   Check,
//   X,
//   AlertCircle,
//   RefreshCw,
//   Plus,
//   Mail,
//   Phone,
//   Calendar,
//   Clock,
//   GraduationCap,
//   UserCheck,
//   UserPlus,
//   ArrowUpDown,
//   CheckCircle,
//   XCircle,
//   Key,
//   Lock,
//   SlidersHorizontal,
//   List,
//   LayoutGrid,
//   FileText,
//   Activity,
//   BookOpen,
//   MapPin,
//   Star
// } from 'lucide-react'
// import Loader from '@/components/Loader'
// import { adminVerifyUserEmail } from '@/actions/auth'
// import { MailCheck, MailX } from 'lucide-react' // Ajouter ces icônes

// type UserWithDetails = {
//   id: string
//   username: string
//   email: string
//   role: string
//   genre: string
//   photo_profil: string | null
//    email_verified: boolean 
//   created_at: string
//   updated_at: string
//   precepteurDetails?: {
//     id: number
//     commune: string | null
//     quartier: string | null
//     annees_experience: number
//     diplome: string | null
//     statut_verification: string
//     disponible: boolean
//     note_moyenne: number
//   } | null
// }

// // Modal de création d'administrateur
// function CreateAdminModal({
//   isOpen,
//   onClose,
//   onSubmit
// }: {
//   isOpen: boolean
//   onClose: () => void
//   onSubmit: (data: { email: string; password: string; username: string; genre: string }) => Promise<void>
// }) {
//   const [form, setForm] = useState({
//     email: '',
//     password: '',
//     username: '',
//     genre: 'homme'
//   })
//   const [saving, setSaving] = useState(false)

//   if (!isOpen) return null

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setSaving(true)
//     await onSubmit(form)
//     setSaving(false)
//     setForm({ email: '', password: '', username: '', genre: 'homme' })
//     onClose()
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
//         <div className="p-6 border-b flex justify-between items-center">
//           <h2 className="text-xl font-semibold flex items-center gap-2">
//             <Shield className="w-5 h-5" />
//             Créer un administrateur
//           </h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
//             <input
//               type="text"
//               required
//               value={form.username}
//               onChange={(e) => setForm({ ...form, username: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//             <input
//               type="email"
//               required
//               value={form.email}
//               onChange={(e) => setForm({ ...form, email: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
//             <input
//               type="password"
//               required
//               value={form.password}
//               onChange={(e) => setForm({ ...form, password: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
//             <select
//               value={form.genre}
//               onChange={(e) => setForm({ ...form, genre: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//             >
//               <option value="homme">Homme</option>
//               <option value="femme">Femme</option>
//               <option value="autre">Autre</option>
//             </select>
//           </div>

//           <div className="flex gap-2 pt-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
//             >
//               Annuler
//             </button>
//             <button
//               type="submit"
//               disabled={saving}
//               className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm flex items-center justify-center gap-2"
//             >
//               {saving ? (
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
//               ) : (
//                 <UserPlus className="w-4 h-4" />
//               )}
//               Créer
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// // Modal de confirmation de suppression
// function ConfirmDeleteModal({
//   isOpen,
//   user,
//   onClose,
//   onConfirm
// }: {
//   isOpen: boolean
//   user: UserWithDetails | null
//   onClose: () => void
//   onConfirm: (userId: string) => Promise<void>
// }) {
//   const [deleting, setDeleting] = useState(false)

//   if (!isOpen || !user) return null

//   const handleDelete = async () => {
//     setDeleting(true)
//     await onConfirm(user.id)
//     setDeleting(false)
//     onClose()
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
//         <div className="p-6 text-center">
//           <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Trash2 className="w-6 h-6 text-red-600" />
//           </div>
//           <h2 className="text-lg font-semibold mb-2">Supprimer {user.username} ?</h2>
//           <p className="text-sm text-gray-500 mb-6">Cette action est irréversible. Toutes les données associées seront supprimées.</p>
//           <div className="flex gap-2">
//             <button
//               onClick={onClose}
//               className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
//             >
//               Annuler
//             </button>
//             <button
//               onClick={handleDelete}
//               disabled={deleting}
//               className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center justify-center gap-2"
//             >
//               {deleting ? (
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
//               ) : (
//                 <Trash2 className="w-4 h-4" />
//               )}
//               Supprimer
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Modal de détail utilisateur
// function UserDetailModal({
//   user,
//   isOpen,
//   onVerifyEmail ,
//   onClose,
//   onRoleChange
// }: {
//   user: UserWithDetails | null
//   isOpen: boolean
//   onClose: () => void
//   onRoleChange: (userId: string, newRole: string) => Promise<void>
//   onVerifyEmail: (userId: string) => Promise<void> 
// }) {
//   const [selectedRole, setSelectedRole] = useState(user?.role || '')
//   const [changing, setChanging] = useState(false)

//   useEffect(() => {
//     if (user) setSelectedRole(user.role)
//   }, [user])

//   if (!isOpen || !user) return null

//   const getRoleColor = (role: string) => {
//     switch (role) {
//       case 'admin': return 'bg-purple-100 text-purple-800'
//       case 'precepteur': return 'bg-blue-100 text-blue-800'
//       case 'parent': return 'bg-green-100 text-green-800'
//       case 'responsable_pedagogique': return 'bg-orange-100 text-orange-800'
//       default: return 'bg-gray-100 text-gray-800'
//     }
//   }

//   const getRoleIcon = (role: string) => {
//     switch (role) {
//       case 'admin': return <Shield className="w-4 h-4" />
//       case 'precepteur': return <GraduationCap className="w-4 h-4" />
//       case 'parent': return <Users className="w-4 h-4" />
//       case 'responsable_pedagogique': return <UserCheck className="w-4 h-4" />
//       default: return <User className="w-4 h-4" />
//     }
//   }

//   const getRoleLabel = (role: string) => {
//     switch (role) {
//       case 'admin': return 'Administrateur'
//       case 'precepteur': return 'Précepteur'
//       case 'parent': return 'Parent'
//       case 'responsable_pedagogique': return 'Responsable pédagogique'
//       default: return role
//     }
//   }

//   const handleRoleChange = async () => {
//     if (selectedRole === user.role) return
//     setChanging(true)
//     await onRoleChange(user.id, selectedRole)
//     setChanging(false)
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
//         <div className="p-6 border-b flex justify-between items-center">
//           <h2 className="text-xl font-semibold">Détails de l'utilisateur</h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="p-6 space-y-4">
//           {/* En-tête utilisateur */}
//           <div className="flex items-center gap-4">
//             {user.photo_profil ? (
//               <img src={user.photo_profil} alt="" className="w-16 h-16 rounded-full object-cover" />
//             ) : (
//               <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
//                 <User className="w-8 h-8 text-gray-400" />
//               </div>
//             )}
//             <div>
//               <h3 className="text-lg font-semibold">{user.username}</h3>
//               <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mt-1 ${getRoleColor(user.role)}`}>
//                 {getRoleIcon(user.role)}
//                 {getRoleLabel(user.role)}
//               </span>
//             </div>
//           </div>

//           {/* Changement de rôle */}
//           <div className="bg-amber-50 p-4 rounded-xl">
//             <h3 className="text-sm font-medium text-amber-900 mb-3 flex items-center gap-2">
//               <Shield className="w-4 h-4" />
//               Modifier le rôle
//             </h3>
//             <div className="flex gap-2">
//               <select
//                 value={selectedRole}
//                 onChange={(e) => setSelectedRole(e.target.value)}
//                 className="flex-1 px-3 py-2 border border-amber-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
//               >
//                 <option value="parent">Parent</option>
//                 <option value="precepteur">Précepteur</option>
//                 <option value="responsable_pedagogique">Responsable pédagogique</option>
//                 <option value="admin">Administrateur</option>
//               </select>
//               <button
//                 onClick={handleRoleChange}
//                 disabled={changing || selectedRole === user.role}
//                 className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 text-sm transition-colors flex items-center gap-2"
//               >
//                 {changing ? (
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
//                 ) : (
//                   <Check className="w-4 h-4" />
//                 )}
//                 Appliquer
//               </button>
//             </div>
//           </div>
//  {user && !user.email_verified && (
//     <div className="bg-red-50 p-4 rounded-xl">
//       <h3 className="text-sm font-medium text-red-900 mb-3 flex items-center gap-2">
//         <MailX className="w-4 h-4" />
//         Email non vérifié
//       </h3>
//       <p className="text-sm text-red-700 mb-3">
//         Cet utilisateur n'a pas encore vérifié son adresse email. 
//         Vous pouvez le valider manuellement.
//       </p>
//       <button
//         onClick={async () => {
//           if (user) await onVerifyEmail(user.id)
//         }}
//         className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
//       >
//         <MailCheck className="w-4 h-4" />
//         Valider l'email manuellement
//       </button>
//     </div>
//   )}

//   {user && user.email_verified && (
//     <div className="bg-green-50 p-4 rounded-xl">
//       <h3 className="text-sm font-medium text-green-900 flex items-center gap-2">
//         <MailCheck className="w-4 h-4" />
//         Email vérifié
//       </h3>
//       <p className="text-sm text-green-700 mt-1">
//         L'adresse email de cet utilisateur a été vérifiée.
//       </p>
//     </div>
//   )}

//           {/* Informations générales */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="bg-gray-50 p-4 rounded-xl">
//               <h3 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
//                 <Mail className="w-4 h-4" /> Email
//               </h3>
//               <p className="font-medium text-sm">{user.email}</p>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-xl">
//               <h3 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
//                 <User className="w-4 h-4" /> Genre
//               </h3>
//               <p className="font-medium text-sm capitalize">{user.genre}</p>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-xl">
//               <h3 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
//                 <Calendar className="w-4 h-4" /> Inscription
//               </h3>
//               <p className="font-medium text-sm">
//                 {new Date(user.created_at).toLocaleDateString('fr-FR', {
//                   day: 'numeric',
//                   month: 'long',
//                   year: 'numeric'
//                 })}
//               </p>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-xl">
//               <h3 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
//                 <Clock className="w-4 h-4" /> Dernière mise à jour
//               </h3>
//               <p className="font-medium text-sm">
//                 {new Date(user.updated_at).toLocaleDateString('fr-FR', {
//                   day: 'numeric',
//                   month: 'long',
//                   year: 'numeric'
//                 })}
//               </p>
//             </div>
//           </div>

//           {/* Détails précepteur */}
//           {user.role === 'precepteur' && user.precepteurDetails && (
//             <div>
//               <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
//                 <GraduationCap className="w-4 h-4" />
//                 Détails du précepteur
//               </h3>
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="bg-blue-50 p-3 rounded-lg">
//                   <p className="text-xs text-blue-600 mb-1">Vérification</p>
//                   <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
//                     user.precepteurDetails.statut_verification === 'verifie' 
//                       ? 'bg-green-100 text-green-700' 
//                       : user.precepteurDetails.statut_verification === 'en_attente'
//                       ? 'bg-yellow-100 text-yellow-700'
//                       : 'bg-red-100 text-red-700'
//                   }`}>
//                     {user.precepteurDetails.statut_verification === 'verifie' && <Check className="w-3 h-3 mr-1" />}
//                     {user.precepteurDetails.statut_verification === 'en_attente' && <Clock className="w-3 h-3 mr-1" />}
//                     {user.precepteurDetails.statut_verification === 'rejete' && <X className="w-3 h-3 mr-1" />}
//                     {user.precepteurDetails.statut_verification}
//                   </span>
//                 </div>
//                 <div className="bg-green-50 p-3 rounded-lg">
//                   <p className="text-xs text-green-600 mb-1">Disponibilité</p>
//                   <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
//                     user.precepteurDetails.disponible 
//                       ? 'bg-green-100 text-green-700' 
//                       : 'bg-gray-100 text-gray-700'
//                   }`}>
//                     {user.precepteurDetails.disponible ? 'Disponible' : 'Indisponible'}
//                   </span>
//                 </div>
//                 <div className="bg-purple-50 p-3 rounded-lg">
//                   <p className="text-xs text-purple-600 mb-1">Expérience</p>
//                   <p className="font-medium text-sm">{user.precepteurDetails.annees_experience} an(s)</p>
//                 </div>
//                 <div className="bg-orange-50 p-3 rounded-lg">
//                   <p className="text-xs text-orange-600 mb-1">Note</p>
//                   <p className="font-medium text-sm flex items-center gap-1">
//                     <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
//                     {user.precepteurDetails.note_moyenne?.toFixed(1) || '0.0'}/5
//                   </p>
//                 </div>
//                 {user.precepteurDetails.commune && (
//                   <div className="bg-teal-50 p-3 rounded-lg">
//                     <p className="text-xs text-teal-600 mb-1">Commune</p>
//                     <p className="font-medium text-sm">{user.precepteurDetails.commune}</p>
//                   </div>
//                 )}
//                 {user.precepteurDetails.diplome && (
//                   <div className="bg-pink-50 p-3 rounded-lg">
//                     <p className="text-xs text-pink-600 mb-1">Diplôme</p>
//                     <p className="font-medium text-sm">{user.precepteurDetails.diplome}</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function AdminUsersPage() {
//   const { user: currentUser } = useAuth()
//   const [users, setUsers] = useState<UserWithDetails[]>([])
//   const [filteredUsers, setFilteredUsers] = useState<UserWithDetails[]>([])
//   const [loading, setLoading] = useState(true)
//   const [message, setMessage] = useState('')
//   const [searchTerm, setSearchTerm] = useState('')
//   const [filterRole, setFilterRole] = useState('tous')
//   const [filterVerification, setFilterVerification] = useState('tous')
//   const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null)
//   const [showDetailModal, setShowDetailModal] = useState(false)
//   const [showCreateAdminModal, setShowCreateAdminModal] = useState(false)
//   const [showDeleteModal, setShowDeleteModal] = useState(false)
//   const [userToDelete, setUserToDelete] = useState<UserWithDetails | null>(null)
//   const [sortField, setSortField] = useState<'username' | 'created_at' | 'role'>('created_at')
//   const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
//   const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
//   const [showFilters, setShowFilters] = useState(false)

//   // Stats
//   const totalUsers = users.length
//   const parents = users.filter(u => u.role === 'parent').length
//   const precepteurs = users.filter(u => u.role === 'precepteur').length
//   const responsables = users.filter(u => u.role === 'responsable_pedagogique').length
//   const admins = users.filter(u => u.role === 'admin').length
//   const precepteursVerifies = users.filter(u => u.precepteurDetails?.statut_verification === 'verifie').length
//   const precepteursEnAttente = users.filter(u => u.precepteurDetails?.statut_verification === 'en_attente').length

//   useEffect(() => {
//     loadUsers()
//   }, [])

//   useEffect(() => {
//     filterAndSortUsers()
//   }, [searchTerm, filterRole, filterVerification, users, sortField, sortDirection])

//   const loadUsers = async () => {
//     setLoading(true)
//     const result = await getAllUsers()
    
//     if (result.success && result.users) {
//       setUsers(result.users as UserWithDetails[])
//     } else {
//       setMessage(result.error || 'Erreur lors du chargement')
//     }
    
//     setLoading(false)
//   }

//   const filterAndSortUsers = () => {
//     let filtered = [...users]

//     if (filterRole !== 'tous') {
//       filtered = filtered.filter(u => u.role === filterRole)
//     }

//     if (filterVerification !== 'tous') {
//       filtered = filtered.filter(u => u.precepteurDetails?.statut_verification === filterVerification)
//     }

//     if (searchTerm) {
//       const term = searchTerm.toLowerCase()
//       filtered = filtered.filter(u =>
//         u.username.toLowerCase().includes(term) ||
//         u.email.toLowerCase().includes(term)
//       )
//     }

//     filtered.sort((a, b) => {
//       let comparison = 0
//       if (sortField === 'username') {
//         comparison = a.username.localeCompare(b.username)
//       } else if (sortField === 'role') {
//         comparison = a.role.localeCompare(b.role)
//       } else {
//         comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
//       }
//       return sortDirection === 'asc' ? comparison : -comparison
//     })

//     setFilteredUsers(filtered)
//   }

//   const handleRoleChange = async (userId: string, newRole: string) => {
//     const result = await updateUserRole(userId, newRole)
    
//     if (result.success) {
//       setMessage('Rôle mis à jour avec succès')
//       await loadUsers()
//     } else {
//       setMessage(result.error || 'Erreur lors de la mise à jour')
//     }
    
//     setTimeout(() => setMessage(''), 3000)
//   }

//   const handleDeleteUser = async (userId: string) => {
//     const result = await deleteUser(userId)
    
//     if (result.success) {
//       setMessage('Utilisateur supprimé avec succès')
//       await loadUsers()
//     } else {
//       setMessage(result.error || 'Erreur lors de la suppression')
//     }
    
//     setTimeout(() => setMessage(''), 3000)
//   }
// // Remplacer la fonction handleVerifyEmail existante par celle-ci
// const handleVerifyEmail = async (userId: string) => {
//   // Mise à jour optimiste : on modifie l'état local immédiatement
//   setUsers(prevUsers => 
//     prevUsers.map(u => 
//       u.id === userId 
//         ? { ...u, email_verified: true } 
//         : u
//     )
//   )

//   // Appel API en arrière-plan
//   const result = await adminVerifyUserEmail(userId)
  
//   if (result.success) {
//     setMessage('Email vérifié avec succès')
//     // Pas besoin de recharger, l'état local est déjà à jour
//   } else {
//     // En cas d'erreur, on annule la modification optimiste
//     setUsers(prevUsers => 
//       prevUsers.map(u => 
//         u.id === userId 
//           ? { ...u, email_verified: false } 
//           : u
//       )
//     )
//     setMessage(result.error || 'Erreur lors de la vérification')
//   }
  
//   setTimeout(() => setMessage(''), 3000)
// }
//   const handleCreateAdmin = async (data: { email: string; password: string; username: string; genre: string }) => {
//     const { createUser } = await import('@/actions/auth')
//     const result = await createUser({
//       ...data,
//       role: 'admin'
//     })
    
//     if (result.success) {
//       setMessage('Administrateur créé avec succès')
//       await loadUsers()
//     } else {
//       setMessage(result.error || 'Erreur lors de la création')
//     }
    
//     setTimeout(() => setMessage(''), 3000)
//   }

//   const getRoleColor = (role: string) => {
//     switch (role) {
//       case 'admin': return 'bg-purple-100 text-purple-800'
//       case 'precepteur': return 'bg-blue-100 text-blue-800'
//       case 'parent': return 'bg-green-100 text-green-800'
//       case 'responsable_pedagogique': return 'bg-orange-100 text-orange-800'
//       default: return 'bg-gray-100 text-gray-800'
//     }
//   }

//   const getRoleIcon = (role: string) => {
//     switch (role) {
//       case 'admin': return <Shield className="w-3 h-3" />
//       case 'precepteur': return <GraduationCap className="w-3 h-3" />
//       case 'parent': return <Users className="w-3 h-3" />
//       case 'responsable_pedagogique': return <UserCheck className="w-3 h-3" />
//       default: return <User className="w-3 h-3" />
//     }
//   }

//   const getRoleLabel = (role: string) => {
//     switch (role) {
//       case 'admin': return 'Admin'
//       case 'precepteur': return 'Précepteur'
//       case 'parent': return 'Parent'
//       case 'responsable_pedagogique': return 'Resp. Pédago.'
//       default: return role
//     }
//   }

//   if (loading) {
//     return (
//       <div className='flex items-center justify-center h-screen'>
//         <div className='w-20'>
//           <Loader />
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       {/* Message toast */}
//       {message && (
//         <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
//           message.includes('Erreur') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
//         }`}>
//           {message.includes('Erreur') ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <Check className="w-4 h-4 flex-shrink-0" />}
//           {message}
//         </div>
//       )}

//       {/* En-tête */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
//             <Users className="w-7 h-7" />
//             Gestion des utilisateurs
//           </h1>
//           <p className="text-gray-600 mt-1">Gérez les comptes, les rôles et les permissions</p>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={loadUsers}
//             className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
//           >
//             <RefreshCw className="w-4 h-4" /> Actualiser
//           </button>
//           <button
//             onClick={() => setShowCreateAdminModal(true)}
//             className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-colors flex items-center gap-2"
//           >
//             <Plus className="w-4 h-4" /> Nouvel admin
//           </button>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
//         <div className="p-4 bg-gray-50 rounded-xl">
//           <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
//           <p className="text-sm text-gray-600 flex items-center gap-1">
//             <Users className="w-3 h-3" /> Total
//           </p>
//         </div>
//         <div className="p-4 bg-green-50 rounded-xl">
//           <p className="text-2xl font-bold text-green-600">{parents}</p>
//           <p className="text-sm text-gray-600 flex items-center gap-1">
//             <Users className="w-3 h-3" /> Parents
//           </p>
//         </div>
//         <div className="p-4 bg-blue-50 rounded-xl">
//           <p className="text-2xl font-bold text-blue-600">{precepteurs}</p>
//           <p className="text-sm text-gray-600 flex items-center gap-1">
//             <GraduationCap className="w-3 h-3" /> Précepteurs
//           </p>
//         </div>
//         <div className="p-4 bg-orange-50 rounded-xl">
//           <p className="text-2xl font-bold text-orange-600">{responsables}</p>
//           <p className="text-sm text-gray-600 flex items-center gap-1">
//             <UserCheck className="w-3 h-3" /> Resp. Pédago.
//           </p>
//         </div>
//         <div className="p-4 bg-purple-50 rounded-xl">
//           <p className="text-2xl font-bold text-purple-600">{admins}</p>
//           <p className="text-sm text-gray-600 flex items-center gap-1">
//             <Shield className="w-3 h-3" /> Admins
//           </p>
//         </div>
//         <div className="p-4 bg-emerald-50 rounded-xl">
//           <p className="text-2xl font-bold text-emerald-600">{precepteursVerifies}</p>
//           <p className="text-sm text-gray-600 flex items-center gap-1">
//             <Check className="w-3 h-3" /> Vérifiés
//           </p>
//         </div>
//         <div className="p-4 bg-yellow-50 rounded-xl">
//           <p className="text-2xl font-bold text-yellow-600">{precepteursEnAttente}</p>
//           <p className="text-sm text-gray-600 flex items-center gap-1">
//             <Clock className="w-3 h-3" /> En attente
//           </p>
//         </div>
//       </div>

//       {/* Filtres et recherche */}
//       <div className="bg-white rounded-2xl border border-gray-200 mb-6">
//         <div className="p-4 flex flex-col md:flex-row gap-3">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Rechercher par nom ou email..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className={`px-4 py-2 border rounded-lg text-sm transition-colors flex items-center gap-2 ${
//               showFilters 
//                 ? 'bg-blue-50 border-blue-200 text-blue-700' 
//                 : 'border-gray-300 text-gray-700 hover:bg-gray-50'
//             }`}
//           >
//             <SlidersHorizontal className="w-4 h-4" />
//             Filtres
//             {(filterRole !== 'tous' || filterVerification !== 'tous') && (
//               <span className="w-2 h-2 rounded-full bg-blue-500" />
//             )}
//           </button>
//           <div className="flex border border-gray-300 rounded-lg overflow-hidden">
//             <button
//               onClick={() => setViewMode('table')}
//               className={`p-2 transition-colors ${viewMode === 'table' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
//             >
//               <List className="w-4 h-4" />
//             </button>
//             <button
//               onClick={() => setViewMode('grid')}
//               className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
//             >
//               <LayoutGrid className="w-4 h-4" />
//             </button>
//           </div>
//         </div>

//         {showFilters && (
//           <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
//             <div>
//               <label className="block text-xs font-medium text-gray-500 mb-1">Rôle</label>
//               <select
//                 value={filterRole}
//                 onChange={(e) => setFilterRole(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//               >
//                 <option value="tous">Tous les rôles</option>
//                 <option value="admin">Administrateurs</option>
//                 <option value="precepteur">Précepteurs</option>
//                 <option value="parent">Parents</option>
//                 <option value="responsable_pedagogique">Responsables pédagogiques</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-xs font-medium text-gray-500 mb-1">Tri</label>
//               <select
//                 value={`${sortField}-${sortDirection}`}
//                 onChange={(e) => {
//                   const [field, dir] = e.target.value.split('-') as [typeof sortField, typeof sortDirection]
//                   setSortField(field)
//                   setSortDirection(dir)
//                 }}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//               >
//                 <option value="created_at-desc">Plus récents d'abord</option>
//                 <option value="created_at-asc">Plus anciens d'abord</option>
//                 <option value="username-asc">Nom A-Z</option>
//                 <option value="username-desc">Nom Z-A</option>
//               </select>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Liste des utilisateurs */}
//       <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
//         {filteredUsers.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-16 px-6">
//             <Users className="w-16 h-16 text-gray-300 mb-4" />
//             <p className="text-gray-500 text-lg font-medium mb-1">Aucun utilisateur trouvé</p>
//             <p className="text-gray-400 text-sm">
//               {searchTerm || filterRole !== 'tous' || filterVerification !== 'tous' 
//                 ? 'Essayez de modifier vos filtres de recherche' 
//                 : 'Aucun utilisateur enregistré'}
//             </p>
//           </div>
//         ) : viewMode === 'table' ? (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-100 bg-gray-50/50">
//                   <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Utilisateur
//                   </th>
//                   <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Email
//                   </th>
//                   <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Rôle
//                   </th>
//                   <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Statut
//                   </th>
//                   <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Inscription
//                   </th>
//                   <th className="text-right py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {filteredUsers.map((user) => (
//                   <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
//                     <td className="py-4 px-6">
//                       <div className="flex items-center gap-3">
//                         {user.photo_profil ? (
//                           <img src={user.photo_profil} alt="" className="w-10 h-10 rounded-full object-cover" />
//                         ) : (
//                           <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
//                             <User className="w-5 h-5 text-gray-400" />
//                           </div>
//                         )}
//                         <div>
//                           <p className="font-medium text-sm text-gray-900">{user.username}</p>
//                           <p className="text-xs text-gray-500 capitalize">{user.genre}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="py-4 px-6">
//                       <p className="text-sm text-gray-600">{user.email}</p>
//                     </td>
//                     <td className="py-4 px-6">
//                       <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
//                         {getRoleIcon(user.role)}
//                         {getRoleLabel(user.role)}
//                       </span>
//                     </td>
//                     <td className="py-4 px-6">
//                       {user.role === 'precepteur' && user.precepteurDetails && (
//                         <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
//                           user.precepteurDetails.statut_verification === 'verifie'
//                             ? 'bg-green-100 text-green-700'
//                             : user.precepteurDetails.statut_verification === 'en_attente'
//                             ? 'bg-yellow-100 text-yellow-700'
//                             : 'bg-red-100 text-red-700'
//                         }`}>
//                           {user.precepteurDetails.statut_verification === 'verifie' && <Check className="w-3 h-3" />}
//                           {user.precepteurDetails.statut_verification === 'en_attente' && <Clock className="w-3 h-3" />}
//                           {user.precepteurDetails.statut_verification === 'rejete' && <X className="w-3 h-3" />}
//                           {user.precepteurDetails.statut_verification}
//                         </span>
//                       )}
//                     </td>
//                     <td className="py-4 px-6">
//                       <p className="text-sm text-gray-600">
//                         {new Date(user.created_at).toLocaleDateString('fr-FR', {
//                           day: 'numeric',
//                           month: 'short',
//                           year: 'numeric'
//                         })}
//                       </p>
//                     </td>
//                     <td className="py-4 px-6">
//                       <div className="flex items-center justify-end gap-1  group-hover:opacity-100 transition-opacity">
//                         <button
//                           onClick={() => {
//                             setSelectedUser(user)
//                             setShowDetailModal(true)
//                           }}
//                           className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//                           title="Voir les détails"
//                         >
//                           <Eye className="w-4 h-4" />
//                         </button>
//                         <select
//                           value={user.role}
//                           onChange={(e) => handleRoleChange(user.id, e.target.value)}
//                           className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
//                           title="Changer le rôle"
//                         >
//                           <option value="parent">Parent</option>
//                           <option value="precepteur">Précepteur</option>
//                           <option value="responsable_pedagogique">Resp. Pédago.</option>
//                           <option value="admin">Admin</option>
//                         </select>
//                         {currentUser?.id !== user.id && (
//                           <button
//                             onClick={() => {
//                               setUserToDelete(user)
//                               setShowDeleteModal(true)
//                             }}
//                             className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
//                             title="Supprimer"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           /* Vue en grille */
//           <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {filteredUsers.map((user) => (
//               <div 
//                 key={user.id} 
//                 className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50/50 transition-colors group cursor-pointer"
//                 onClick={() => {
//                   setSelectedUser(user)
//                   setShowDetailModal(true)
//                 }}
//               >
//                 <div className="flex items-center gap-3 mb-3">
//                   {user.photo_profil ? (
//                     <img src={user.photo_profil} alt="" className="w-12 h-12 rounded-full object-cover" />
//                   ) : (
//                     <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
//                       <User className="w-6 h-6 text-gray-400" />
//                     </div>
//                   )}
//                   <div className="flex-1 min-w-0">
//                     <p className="font-medium text-sm text-gray-900 truncate">{user.username}</p>
//                     <p className="text-xs text-gray-500 truncate">{user.email}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
//                     {getRoleIcon(user.role)}
//                     {getRoleLabel(user.role)}
//                   </span>
//                   {user.role === 'precepteur' && user.precepteurDetails && (
//                     <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
//                       user.precepteurDetails.statut_verification === 'verifie'
//                         ? 'bg-green-100 text-green-700'
//                         : user.precepteurDetails.statut_verification === 'en_attente'
//                         ? 'bg-yellow-100 text-yellow-700'
//                         : 'bg-red-100 text-red-700'
//                     }`}>
//                       {user.precepteurDetails.statut_verification}
//                     </span>
//                   )}




//                    {user.email_verified ? (
//       <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
//         <MailCheck className="w-3 h-3" />
//         Email vérifié
//       </span>
//     ) : (
//       <button
//         onClick={(e) => {
//           e.stopPropagation()
//           handleVerifyEmail(user.id)
//         }}
//         className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700 transition-colors cursor-pointer"
//         title="Cliquer pour valider l'email manuellement"
//       >
//         <MailX className="w-3 h-3" />
//         Non vérifié
//       </button>
//     )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Pied de page */}
//       <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
//         <p>
//           {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} affiché{filteredUsers.length > 1 ? 's' : ''}
//           {filterRole !== 'tous' && ` • Rôle: ${filterRole}`}
//         </p>
//         <p>Dernière mise à jour : {new Date().toLocaleTimeString('fr-FR')}</p>
//       </div>

//       {/* Modals */}
//       <UserDetailModal
//         user={selectedUser}
//         isOpen={showDetailModal}
//         onClose={() => {
//           setShowDetailModal(false)
//           setSelectedUser(null)
//         }}
//         onRoleChange={handleRoleChange}
//          onVerifyEmail={handleVerifyEmail} 
//       />

//       <CreateAdminModal
//         isOpen={showCreateAdminModal}
//         onClose={() => setShowCreateAdminModal(false)}
//         onSubmit={handleCreateAdmin}
//       />

//       <ConfirmDeleteModal
//         isOpen={showDeleteModal}
//         user={userToDelete}
//         onClose={() => {
//           setShowDeleteModal(false)
//           setUserToDelete(null)
//         }}
//         onConfirm={handleDeleteUser}
//       />
//     </div>
//   )
// }
// app/admin/utilisateurs/page.tsx
'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getAllUsers, updateUserRole, deleteUser, adminVerifyUserEmail, createUser } from '@/actions/auth'
import {
  User, Users, Search, Shield, Eye, Trash2, Check, X, AlertCircle,
  RefreshCw, Plus, Mail, Calendar, Clock, GraduationCap, UserCheck,
  UserPlus, SlidersHorizontal, List, LayoutGrid, Star, ChevronLeft,
  ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, Edit3,
  UserX, MailCheck, MailX, MapPin, Award, Filter
} from 'lucide-react'
import Loader from '@/components/Loader'

// Types
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

// ============ COMPOSANTS MODAUX ============

// Modal rapide pour changement de rôle
function QuickRoleModal({ user, onClose, onConfirm }: {
  user: UserWithDetails
  onClose: () => void
  onConfirm: (role: string) => void
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
            {roles.map(r => (
              <button
                key={r.value}
                onClick={() => setRole(r.value)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  role === r.value 
                    ? `border-${r.color}-500 bg-${r.color}-50` 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <r.icon className={`w-5 h-5 text-${r.color}-600`} />
                <span className="font-medium text-sm">{r.label}</span>
                {role === r.value && <Check className="w-4 h-4 ml-auto text-green-500" />}
              </button>
            ))}
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
              {saving ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <Check className="w-4 h-4" />}
              Appliquer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Modal détails utilisateur (compact)
function UserDetailModal({ user, onClose, onVerifyEmail, onRoleChange }: {
  user: UserWithDetails
  onClose: () => void
  onVerifyEmail: (id: string) => void
  onRoleChange: (id: string, role: string) => void
}) {
  const getRoleStyle = (role: string) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-700 border-purple-200',
      precepteur: 'bg-blue-100 text-blue-700 border-blue-200',
      parent: 'bg-green-100 text-green-700 border-green-200',
      responsable_pedagogique: 'bg-orange-100 text-orange-700 border-orange-200',
    }
    return styles[role as keyof typeof styles] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex items-center gap-4 z-10">
          {user.photo_profil ? (
            <img src={user.photo_profil} alt="" className="w-14 h-14 rounded-xl object-cover" />
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
          {/* Badge rôle + email vérifié */}
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getRoleStyle(user.role)}`}>
              {user.role === 'precepteur' ? <GraduationCap className="w-3.5 h-3.5" /> : 
               user.role === 'admin' ? <Shield className="w-3.5 h-3.5" /> :
               user.role === 'parent' ? <Users className="w-3.5 h-3.5" /> :
               <UserCheck className="w-3.5 h-3.5" />}
              {user.role}
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

          {/* Actions rapides */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Fermer
            </button>
            <button
              onClick={() => {
                onClose()
                // Ouvrir le modal de changement de rôle
              }}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <Edit3 className="w-4 h-4" /> Modifier le rôle
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Mini composant info
function InfoBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-lg p-2.5 border border-blue-100">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-sm capitalize">{value}</p>
    </div>
  )
}

// ============ PAGE PRINCIPALE ============

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth()
  
  // États
  const [users, setUsers] = useState<UserWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  
  // Recherche & filtres
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('tous')
  const [showFilters, setShowFilters] = useState(false)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  
  // Modals
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null)
  const [modalType, setModalType] = useState<'detail' | 'role' | 'delete' | null>(null)

  // Chargement initial
  useEffect(() => {
    loadUsers()
  }, [])

  // Toast auto-disparition
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const loadUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    
    try {
      const result = await getAllUsers()
      if (result.success && result.users) {
        setUsers(result.users as UserWithDetails[])
        setCurrentPage(1) // Reset pagination
      } else {
        setError(result.error || 'Erreur lors du chargement')
      }
    } catch (err) {
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }, [])

  // Filtrage + tri (mémoïsé pour performance)
  const filteredUsers = useMemo(() => {
    let result = [...users]

    // Filtre rôle
    if (filterRole !== 'tous') {
      result = result.filter(u => u.role === filterRole)
    }

    // Recherche
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      result = result.filter(u =>
        u.username.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
      )
    }

    // Tri par date d'inscription (plus récent d'abord)
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return result
  }, [users, searchTerm, filterRole])

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredUsers, currentPage])

  // Stats rapides
  const stats = useMemo(() => ({
    total: users.length,
    parents: users.filter(u => u.role === 'parent').length,
    precepteurs: users.filter(u => u.role === 'precepteur').length,
    admins: users.filter(u => u.role === 'admin').length,
    responsables: users.filter(u => u.role === 'responsable_pedagogique').length,
    nonVerifies: users.filter(u => !u.email_verified).length,
  }), [users])

  // Actions optimisées (mise à jour locale + serveur)
  const handleRoleChange = useCallback(async (userId: string, newRole: string) => {
    // Optimistic update
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
    
    const result = await updateUserRole(userId, newRole)
    if (result.success) {
      setMessage('✅ Rôle mis à jour')
    } else {
      // Rollback
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: u.role } : u))
      setMessage('❌ ' + (result.error || 'Erreur'))
    }
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
      await loadUsers() // Recharger en cas d'erreur
      setMessage('❌ ' + (result.error || 'Erreur'))
    }
  }, [loadUsers])

  const handleCreateAdmin = useCallback(async (data: { email: string; password: string; username: string; genre: string }) => {
    const result = await createUser({ ...data, role: 'admin' })
    if (result.success) {
      setMessage('✅ Administrateur créé')
      await loadUsers()
    } else {
      setMessage('❌ ' + (result.error || 'Erreur'))
    }
  }, [loadUsers])

  // Helpers visuels
  const getRoleBadge = (role: string) => {
    const config = {
      admin: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: Shield },
      precepteur: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: GraduationCap },
      parent: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: Users },
      responsable_pedagogique: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: UserCheck },
    }
    const c = config[role as keyof typeof config] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', icon: User }
    const Icon = c.icon
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1  text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}>
        <Icon className="w-3 h-3" />
        {role === 'responsable_pedagogique' ? 'Resp. Pédago.' : role}
      </span>
    )
  }

  // ============ LOADING ============
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <Loader />
          </div>
          <p className="text-gray-500 animate-pulse">Chargement des utilisateurs...</p>
        </div>
      </div>
    )
  }

  // ============ RENDU ============
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Toast */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-top-2 duration-300 ${
          message.includes('✅') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Header */}
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
          <button
            onClick={() => {/* Ouvrir modal création */}}
            className="px-4 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nouvel admin
          </button>
        </div>
      </div>

      {/* Stats rapides */}
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

      {/* Barre de recherche & filtres */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => {
              setFilterRole(e.target.value)
              setCurrentPage(1)
            }}
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

      {/* Liste des utilisateurs */}
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
                  {paginatedUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {user.photo_profil ? (
                            <img src={user.photo_profil} alt="" className="w-9 h-9 rounded-full object-cover" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
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
                        {getRoleBadge(user.role)}
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
                          {/* Bouton voir détails */}
                          <button
                            onClick={() => { setSelectedUser(user); setModalType('detail') }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {/* Changement rapide de rôle */}
                          <button
                            onClick={() => { setSelectedUser(user); setModalType('role') }}
                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            title="Changer le rôle"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Supprimer (sauf soi-même) */}
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
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Page {currentPage} sur {totalPages} • {filteredUsers.length} résultat{filteredUsers.length > 1 ? 's' : ''}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {/* Numéros de page */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .map((p, i, arr) => (
                      <div key={p} className="flex items-center">
                        {i > 0 && arr[i - 1] !== p - 1 && (
                          <span className="px-1 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(p)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === p
                              ? 'bg-black text-white'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {p}
                        </button>
                      </div>
                    ))}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setModalType(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UserX className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-lg font-bold mb-1">Supprimer l'utilisateur ?</h3>
              <p className="text-sm text-gray-500 mb-6">
                {selectedUser.username} sera définitivement supprimé. Cette action est irréversible.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setModalType(null)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDeleteUser(selectedUser.id)}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}