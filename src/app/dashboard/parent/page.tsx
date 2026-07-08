// // app/dashboard/parent/page.tsx

// 'use client'

// import { useAuth } from '@/context/AuthContext'
// import { updateProfilePhoto } from '@/actions/auth'
// import { ajouterEnfant, supprimerEnfant, getElevesParent } from '@/actions/eleves'
// import { useState, useEffect, useCallback, useRef } from 'react'
// import { supabase } from '@/lib/supabase'
// import Link from 'next/link'
// import { 
//   User, 
//   Calendar, 
//   BookOpen, 
//   GraduationCap, 
//   Plus, 
//   Trash2, 
//   Upload,
//   Search,
//   Eye,
//   Clock,
//   Check,
//   X,
//   AlertCircle,
//   Users,
//   FileText,
//   Building2,
//   ChevronRight,
//   Mail,
//   Phone
// } from 'lucide-react'
// import Loader from '@/components/Loader'
// import { updateParentProfile, getParentProfile } from '@/actions/auth'

// type Eleve = {
//   id: number
//   parent_id: number
//   nom: string
//   postnom: string
//   prenom: string
//   genre: string
//   date_naissance: string
//   niveau: string
//   ecole: string
// }

// type Contrat = {
//   id: number
//   parent_id: number
//   precepteur_id: number
//   eleve_id: number
//   matiere_id: number
//   date_debut: string
//   date_fin: string
//   heure_debut_pref: string
//   heure_fin_pref: string
//   jours_pref: string
//   type_contrat: string
//   frequence: string
//   tarif_horaire: number | null
//   notes: string | null
//   statut: 'en_attente' | 'accepte' | 'refuse' | 'actif' | 'termine' | 'annule'
//   created_at: string
//   precepteur_username: string
//   precepteur_commune: string
//   precepteur_note: number
//   precepteur_photo: string | null
//   eleve_nom: string
//   eleve_prenom: string
//   eleve_niveau: string
//   matiere_nom: string
//   matiere_niveau: string
//   sessions_count: number
//   sessions_planifiees: number
// }

// export default function ParentDashboard() {
//   // ✅ CORRECTION: refreshUser → updateUser, ajouter isAuthenticated
//   const { user, updateUser, isAuthenticated } = useAuth()
//   const [uploading, setUploading] = useState(false)
//   const [activeTab, setActiveTab] = useState('enfants')
//   const [eleves, setEleves] = useState<Eleve[]>([])
//   const [contrats, setContrats] = useState<Contrat[]>([])
//   const [loading, setLoading] = useState(true)
//   const [showModal, setShowModal] = useState(false)
//   const [formError, setFormError] = useState('')
//   const [submitting, setSubmitting] = useState(false)
//   const [message, setMessage] = useState('')
//   const [deletingEnfant, setDeletingEnfant] = useState<number | null>(null)
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState<{id: number, nom: string} | null>(null)
//   const [showProfilModal, setShowProfilModal] = useState(false)
//   const [parentProfile, setParentProfile] = useState<any>(null)
//   const [profilSubmitting, setProfilSubmitting] = useState(false)

//   // Références pour éviter les rechargements inutiles
//   const isInitializedRef = useRef(false)
//   const lastUserIdRef = useRef<string | null>(null)

//   const loadContrats = useCallback(async () => {
//     if (!user) return

//     const { data: parent } = await supabase
//       .from('parents')
//       .select('id')
//       .eq('user_id', user.id)
//       .single()

//     if (!parent) {
//       setContrats([])
//       return
//     }

//     const { data: contratsData, error } = await supabase
//       .from('contracts')
//       .select('*')
//       .eq('parent_id', parent.id)
//       .order('created_at', { ascending: false })
//       .limit(20)

//     if (error || !contratsData || contratsData.length === 0) {
//       setContrats([])
//       return
//     }

//     const contratsEnrichis = await Promise.all(
//       contratsData.map(async (contrat) => {
//         let enriched: any = { ...contrat }

//         const { data: eleve } = await supabase
//           .from('eleves').select('nom, prenom, niveau').eq('id', contrat.eleve_id).single()
//         if (eleve) {
//           enriched.eleve_nom = eleve.nom
//           enriched.eleve_prenom = eleve.prenom
//           enriched.eleve_niveau = eleve.niveau
//         }

//         const { data: matiere } = await supabase
//           .from('matieres').select('nom, niveau').eq('id', contrat.matiere_id).single()
//         if (matiere) {
//           enriched.matiere_nom = matiere.nom
//           enriched.matiere_niveau = matiere.niveau
//         }

//         const { data: precepteur } = await supabase
//           .from('precepteurs').select('id, commune, note_moyenne, user_id').eq('id', contrat.precepteur_id).single()
//         if (precepteur) {
//           enriched.precepteur_commune = precepteur.commune
//           enriched.precepteur_note = precepteur.note_moyenne
//           const { data: precepteurUser } = await supabase
//             .from('users').select('username, photo_profil').eq('id', precepteur.user_id).single()
//           if (precepteurUser) {
//             enriched.precepteur_username = precepteurUser.username
//             enriched.precepteur_photo = precepteurUser.photo_profil
//           }
//         }

//         const { data: sessions } = await supabase
//           .from('sessions_cours').select('id, statut').eq('contract_id', contrat.id)
//         enriched.sessions_count = sessions?.length || 0
//         enriched.sessions_planifiees = sessions?.filter(s => s.statut === 'planifie').length || 0

//         return enriched as Contrat
//       })
//     )

//     setContrats(contratsEnrichis)
//   }, [user?.id])

//   const loadParentProfile = useCallback(async () => {
//     const result = await getParentProfile()
//     if (result.success && result.parent) {
//       setParentProfile(result.parent)
//     }
//   }, [])

//   const loadData = useCallback(async () => {
//     setLoading(true)
//     try {
//       const { eleves: elevesData } = await getElevesParent()
//       if (elevesData) setEleves(elevesData)
//       await loadContrats()
//     } catch (error) {
//       console.error('Erreur chargement données:', error)
//     }
//     setLoading(false)
//   }, [loadContrats])

//   // Effet principal - ne se déclenche que lors du vrai changement d'utilisateur
//   useEffect(() => {
//     if (!isAuthenticated || !user?.id) {
//       return
//     }

//     const currentUserId = user.id
    
//     // Si même utilisateur et déjà initialisé, ne rien faire
//     if (lastUserIdRef.current === currentUserId && isInitializedRef.current) {
//       return
//     }

//     // Premier chargement ou changement d'utilisateur
//     isInitializedRef.current = true
//     lastUserIdRef.current = currentUserId
    
//     loadData()
//     loadParentProfile()
//   }, [isAuthenticated, user?.id, loadData, loadParentProfile])

//   // Reset quand l'utilisateur se déconnecte
//   useEffect(() => {
//     if (!isAuthenticated) {
//       isInitializedRef.current = false
//       lastUserIdRef.current = null
//     }
//   }, [isAuthenticated])

//   // Force le rechargement après modifications
//   const forceReload = useCallback(async () => {
//     isInitializedRef.current = false
//     await loadData()
//     isInitializedRef.current = true
//   }, [loadData])

//   // ✅ CORRECTION: Remplacer refreshUser par updateUser
//   const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (!file) return
    
//     setUploading(true)
//     try {
//       const reader = new FileReader()
//       reader.onloadend = async () => {
//         const result = await updateProfilePhoto(reader.result as string)
//         if (result.success) {
//           // ✅ Mettre à jour l'utilisateur dans le contexte
//           updateUser({ photo_profil: reader.result as string })
//           setMessage('Photo mise à jour avec succès')
//         } else {
//           setMessage(result.error || 'Erreur lors de la mise à jour')
//         }
//         setUploading(false)
//         setTimeout(() => setMessage(''), 3000)
//       }
//       reader.readAsDataURL(file)
//     } catch (error) {
//       setMessage('Erreur lors de la mise à jour')
//       setUploading(false)
//       setTimeout(() => setMessage(''), 3000)
//     }
//   }

//   const handleAjouterEnfant = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     setFormError('')
//     setSubmitting(true)
    
//     try {
//       const formData = new FormData(e.currentTarget)
//       const result = await ajouterEnfant({
//         nom: formData.get('nom') as string,
//         postnom: formData.get('postnom') as string,
//         prenom: formData.get('prenom') as string,
//         genre: formData.get('genre') as string,
//         date_naissance: formData.get('date_naissance') as string,
//         niveau: formData.get('niveau') as string,
//         ecole: formData.get('ecole') as string,
//       })
      
//       if (result.error) {
//         setFormError(result.error)
//       } else {
//         setShowModal(false)
//         setMessage('Enfant ajouté avec succès')
//         setTimeout(() => setMessage(''), 3000)
//         await forceReload()
//       }
//     } catch (error) {
//       setFormError("Erreur lors de l'ajout")
//     }
    
//     setSubmitting(false)
//   }

//   const handleSupprimerEnfant = async (eleveId: number) => {
//     setDeletingEnfant(eleveId)
//     try {
//       const result = await supprimerEnfant(eleveId)
//       if (result.success) {
//         setMessage('Enfant supprimé avec succès')
//         setTimeout(() => setMessage(''), 3000)
//         await forceReload()
//       } else {
//         setMessage(result.error || 'Erreur lors de la suppression')
//         setTimeout(() => setMessage(''), 3000)
//       }
//     } catch (error) {
//       setMessage('Erreur lors de la suppression')
//       setTimeout(() => setMessage(''), 3000)
//     }
//     setDeletingEnfant(null)
//     setShowDeleteConfirm(null)
//   }

//   const getStatutColor = (statut: string) => {
//     switch (statut) {
//       case 'en_attente': return 'bg-yellow-100 text-yellow-800'
//       case 'accepte': return 'bg-blue-100 text-blue-800'
//       case 'actif': return 'bg-green-100 text-green-800'
//       case 'refuse': return 'bg-red-100 text-red-800'
//       case 'termine': return 'bg-gray-100 text-gray-800'
//       case 'annule': return 'bg-red-100 text-red-800'
//       default: return 'bg-gray-100 text-gray-800'
//     }
//   }

//   const getStatutIcon = (statut: string) => {
//     switch (statut) {
//       case 'en_attente': return <Clock className="w-3.5 h-3.5" />
//       case 'accepte':
//       case 'actif': return <Check className="w-3.5 h-3.5" />
//       case 'refuse':
//       case 'annule': return <X className="w-3.5 h-3.5" />
//       case 'termine': return <Check className="w-3.5 h-3.5" />
//       default: return <AlertCircle className="w-3.5 h-3.5" />
//     }
//   }

//   const formatDate = (date: string) => {
//     return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="w-20"><Loader /></div>
//       </div>
//     )
//   }

//   if (!user) return null

//   const contratsActifs = contrats.filter(c => c.statut === 'actif' || c.statut === 'accepte').length
//   const contratsEnAttente = contrats.filter(c => c.statut === 'en_attente').length
//   const totalSessions = contrats.reduce((acc, c) => acc + c.sessions_count, 0)
//   const sessionsPlanifiees = contrats.reduce((acc, c) => acc + c.sessions_planifiees, 0)

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       {/* Message toast */}
//       {message && (
//         <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
//           message.includes('Erreur') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
//         }`}>
//           {message.includes('Erreur') ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <Check className="w-4 h-4 flex-shrink-0" />}
//           {message}
//         </div>
//       )}

//       {/* ========== CARD PROFIL ========== */}
//       <div className="bg-white rounded-2xl mb-6 p-6">
//         <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
//           {/* Photo */}
//           <div className="relative group flex-shrink-0 mx-auto md:mx-0">
//             {user.photo_profil ? (
//               <img src={user.photo_profil} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
//             ) : (
//               <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
//                 <User className="w-10 h-10 text-gray-400" />
//               </div>
//             )}
//             <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
//               {uploading ? (
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//               ) : (
//                 <Upload className="w-5 h-5 text-white" />
//               )}
//               <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
//             </label>
//           </div>

//           {/* Infos */}
//           <div className="flex-1 text-center md:text-left">
//             <h1 className="text-2xl font-bold">{user.username}</h1>
//             <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2 mt-1">
//               <Users className="w-4 h-4" />
//               Parent
//               <span className="text-sm text-gray-500">
//                 • {eleves.length} enfant{eleves.length > 1 ? 's' : ''}
//               </span>
//             </p>
//             <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm text-gray-500">
//               <Mail className="w-4 h-4" />
//               <span>{user.email}</span>
//             </div>
//             {parentProfile?.telephone && (
//               <div className="flex items-center justify-center md:justify-start gap-2 mt-1 text-sm text-gray-500">
//                 <Phone className="w-4 h-4" />
//                 <span>{parentProfile.telephone}</span>
//               </div>
//             )}
//             {parentProfile?.adresse && (
//               <div className="flex items-center justify-center md:justify-start gap-2 mt-1 text-sm text-gray-500">
//                 <Building2 className="w-4 h-4" />
//                 <span>{parentProfile.adresse}</span>
//               </div>
//             )}
//           </div>

//           {/* Actions */}
//           <div className="flex gap-2 justify-center md:justify-start">
//             <button
//               onClick={() => setShowProfilModal(true)}
//               className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
//             >
//               <User className="w-4 h-4" /> Modifier profil
//             </button>
//             <button
//               onClick={() => setShowModal(true)}
//               className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-colors flex items-center gap-2"
//             >
//               <Plus className="w-4 h-4" /> Ajouter un enfant
//             </button>
//             <Link
//               href="/recherche"
//               className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
//             >
//               <Search className="w-4 h-4" /> Rechercher
//             </Link>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
//           <div className="p-4 bg-blue-50 rounded-xl">
//             <p className="text-2xl font-bold text-blue-600">{eleves.length}</p>
//             <p className="text-sm text-gray-600 flex items-center gap-1">
//               <Users className="w-3 h-3" /> Enfants
//             </p>
//           </div>
//           <div className="p-4 bg-green-50 rounded-xl">
//             <p className="text-2xl font-bold text-green-600">{contrats.length}</p>
//             <p className="text-sm text-gray-600 flex items-center gap-1">
//               <FileText className="w-3 h-3" /> Contrats
//             </p>
//           </div>
//           <div className="p-4 bg-purple-50 rounded-xl">
//             <p className="text-2xl font-bold text-purple-600">{contratsActifs}</p>
//             <p className="text-sm text-gray-600 flex items-center gap-1">
//               <Check className="w-3 h-3" /> Actifs
//             </p>
//           </div>
//           <div className="p-4 bg-orange-50 rounded-xl">
//             <p className="text-2xl font-bold text-orange-600">{totalSessions}</p>
//             <p className="text-sm text-gray-600 flex items-center gap-1">
//               <BookOpen className="w-3 h-3" /> Sessions
//             </p>
//           </div>
//           <div className="p-4 bg-teal-50 rounded-xl">
//             <p className="text-2xl font-bold text-teal-600">{sessionsPlanifiees}</p>
//             <p className="text-sm text-gray-600 flex items-center gap-1">
//               <Calendar className="w-3 h-3" /> À venir
//             </p>
//           </div>
//           <div className="p-4 bg-yellow-50 rounded-xl">
//             <p className="text-2xl font-bold text-yellow-600">{contratsEnAttente}</p>
//             <p className="text-sm text-gray-600 flex items-center gap-1">
//               <Clock className="w-3 h-3" /> En attente
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* ========== TABS ========== */}
//       <div className="flex gap-4 mb-6">
//         <button
//           onClick={() => setActiveTab('enfants')}
//           className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
//             activeTab === 'enfants' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
//           }`}
//         >
//           <Users className="w-4 h-4" /> Enfants ({eleves.length})
//         </button>
//         <button
//           onClick={() => setActiveTab('contrats')}
//           className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
//             activeTab === 'contrats' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
//           }`}
//         >
//           <FileText className="w-4 h-4" /> Contrats ({contrats.length})
//         </button>
//       </div>

//       {/* ========== CARD ENFANTS ========== */}
//       {activeTab === 'enfants' && (
//         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
//             <div>
//               <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//                 <Users className="w-5 h-5 text-gray-700" />
//                 Mes enfants
//               </h3>
//               <p className="text-sm text-gray-500 mt-0.5">{eleves.length} enfant{eleves.length > 1 ? 's' : ''} inscrit{eleves.length > 1 ? 's' : ''}</p>
//             </div>
//             <button
//               onClick={() => setShowModal(true)}
//               className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium"
//             >
//               <Plus className="w-4 h-4" /> Ajouter
//             </button>
//           </div>

//           {eleves.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 px-6">
//               <Users className="w-16 h-16 text-gray-300 mb-4" />
//               <p className="text-gray-500 text-lg font-medium mb-1">Aucun enfant inscrit</p>
//               <p className="text-gray-400 text-sm mb-6">Ajoutez votre premier enfant pour commencer</p>
//               <button
//                 onClick={() => setShowModal(true)}
//                 className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium text-sm"
//               >
//                 <Plus className="w-4 h-4" /> Ajouter un enfant
//               </button>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-100">
//               {eleves.map((eleve) => (
//                 <div key={eleve.id} className="p-4 hover:bg-gray-50/50 transition-colors group">
//                   <div className="flex items-center gap-4">
//                     {/* Avatar */}
//                     <div className="flex-shrink-0">
//                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
//                         eleve.genre === 'M' ? 'bg-blue-100' : 'bg-pink-100'
//                       }`}>
//                         <span className={`text-lg font-bold ${
//                           eleve.genre === 'M' ? 'text-blue-600' : 'text-pink-600'
//                         }`}>
//                           {eleve.prenom[0]}{eleve.nom[0]}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Infos */}
//                     <div className="flex-1 min-w-0">
//                       <p className="font-medium text-gray-900">
//                         {eleve.prenom} {eleve.nom} {eleve.postnom}
//                       </p>
//                       <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
//                         <span className="inline-flex items-center gap-1">
//                           <GraduationCap className="w-3 h-3" /> {eleve.niveau}
//                         </span>
//                         {eleve.ecole && (
//                           <>
//                             <span>•</span>
//                             <span className="inline-flex items-center gap-1">
//                               <Building2 className="w-3 h-3" /> {eleve.ecole}
//                             </span>
//                           </>
//                         )}
//                         <span>•</span>
//                         <span>{eleve.genre === 'M' ? 'Garçon' : 'Fille'}</span>
//                         {eleve.date_naissance && (
//                           <>
//                             <span>•</span>
//                             <span>{new Date(eleve.date_naissance).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
//                           </>
//                         )}
//                       </div>
//                     </div>

//                     {/* Actions - visibles au hover */}
//                     <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <Link
//                         href={`/dashboard/parent/suivi/${eleve.id}`}
//                         className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//                         title="Suivi"
//                       >
//                         <Eye className="w-4 h-4" />
//                       </Link>
//                       <button
//                         onClick={() => setShowDeleteConfirm({ id: eleve.id, nom: `${eleve.prenom} ${eleve.nom}` })}
//                         disabled={deletingEnfant === eleve.id}
//                         className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
//                         title="Supprimer"
//                       >
//                         {deletingEnfant === eleve.id ? (
//                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
//                         ) : (
//                           <Trash2 className="w-4 h-4" />
//                         )}
//                       </button>
//                     </div>

//                     <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* ========== CARD CONTRATS ========== */}
//       {activeTab === 'contrats' && (
//         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
//             <div>
//               <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//                 <FileText className="w-5 h-5 text-gray-700" />
//                 Mes contrats
//               </h3>
//               <p className="text-sm text-gray-500 mt-0.5">{contrats.length} contrat{contrats.length > 1 ? 's' : ''}</p>
//             </div>
//             <Link
//               href="/recherche"
//               className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium"
//             >
//               <Search className="w-4 h-4" /> Trouver un précepteur
//             </Link>
//           </div>

//           {contrats.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 px-6">
//               <FileText className="w-16 h-16 text-gray-300 mb-4" />
//               <p className="text-gray-500 text-lg font-medium mb-1">Aucun contrat</p>
//               <p className="text-gray-400 text-sm mb-6">Proposez un contrat à un précepteur</p>
//               <Link
//                 href="/recherche"
//                 className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium text-sm"
//               >
//                 <Search className="w-4 h-4" /> Trouver un précepteur
//               </Link>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-100">
//               {contrats.map((contrat) => (
//                 <Link
//                   key={contrat.id}
//                   href={`/dashboard/parent/contrats/${contrat.id}`}
//                   className="p-4 hover:bg-gray-50/50 transition-colors group block"
//                 >
//                   <div className="flex items-center gap-4">
//                     {/* Icône matière */}
//                     <div className="flex-shrink-0">
//                       <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
//                         <BookOpen className="w-5 h-5 text-blue-600" />
//                       </div>
//                     </div>

//                     {/* Infos contrat */}
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 mb-1">
//                         <p className="font-medium text-gray-900 truncate">
//                           {contrat.matiere_nom || 'Matière'}
//                         </p>
//                         <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatutColor(contrat.statut)}`}>
//                           {getStatutIcon(contrat.statut)}
//                           {contrat.statut.replace('_', ' ')}
//                         </span>
//                       </div>
                      
//                       <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
//                         <span className="flex items-center gap-1">
//                           <User className="w-3 h-3" /> {contrat.eleve_prenom} {contrat.eleve_nom}
//                         </span>
//                         <span>•</span>
//                         <span className="flex items-center gap-1">
//                           <GraduationCap className="w-3 h-3" /> {contrat.precepteur_username || 'Précepteur'}
//                         </span>
//                       </div>

//                       <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-gray-400">
//                         <span className="flex items-center gap-1">
//                           <Calendar className="w-3 h-3" />
//                           {formatDate(contrat.date_debut)} → {formatDate(contrat.date_fin)}
//                         </span>
//                         <span>•</span>
//                         <span className="flex items-center gap-1">
//                           <Clock className="w-3 h-3" />
//                           {contrat.heure_debut_pref?.slice(0, 5)} - {contrat.heure_fin_pref?.slice(0, 5)}
//                         </span>
//                         {contrat.tarif_horaire && (
//                           <>
//                             <span>•</span>
//                             <span className="text-green-600 font-medium">
//                               {contrat.tarif_horaire.toLocaleString()} FC/h
//                             </span>
//                           </>
//                         )}
//                         {contrat.sessions_count > 0 && (
//                           <>
//                             <span>•</span>
//                             <span className="flex items-center gap-1">
//                               <BookOpen className="w-3 h-3" /> {contrat.sessions_count} session{contrat.sessions_count > 1 ? 's' : ''}
//                             </span>
//                           </>
//                         )}
//                       </div>
//                     </div>

//                     {/* Précepteur mini avatar + flèche */}
//                     <div className="flex items-center gap-2 flex-shrink-0">
//                       {contrat.precepteur_photo ? (
//                         <img src={contrat.precepteur_photo} alt="" className="w-8 h-8 rounded-full object-cover" />
//                       ) : (
//                         <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
//                           <User className="w-4 h-4 text-gray-400" />
//                         </div>
//                       )}
//                       <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* ========== MODAL AJOUT ENFANT ========== */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b flex justify-between items-center">
//               <h2 className="text-xl font-semibold flex items-center gap-2">
//                 <Plus className="w-5 h-5" /> Ajouter un enfant
//               </h2>
//               <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <form onSubmit={handleAjouterEnfant} className="p-6 space-y-4">
//               {formError && (
//                 <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
//                   <AlertCircle className="w-4 h-4" /> {formError}
//                 </div>
//               )}

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
//                   <input type="text" name="prenom" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Marie" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
//                   <input type="text" name="nom" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Kyungu" />
//                 </div>
//                 <div className="col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Postnom</label>
//                   <input type="text" name="postnom" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Kunta" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Genre *</label>
//                   <select name="genre" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
//                     <option value="M">Masculin</option>
//                     <option value="F">Féminin</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
//                   <input type="date" name="date_naissance" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Niveau *</label>
//                   <select name="niveau" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
//                     <option value="7ème">7ème année</option>
//                     <option value="8ème">8ème année</option>
//                   </select>
//                 </div>
//                 <div className="col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">École</label>
//                   <input type="text" name="ecole" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Collège Saint Joseph" />
//                 </div>
//               </div>

//               <div className="flex gap-2 pt-2">
//                 <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
//                   Annuler
//                 </button>
//                 <button type="submit" disabled={submitting} className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm flex items-center justify-center gap-2">
//                   {submitting ? (
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
//                   ) : (
//                     <Plus className="w-4 h-4" />
//                   )}
//                   Ajouter
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* ========== MODAL PROFIL PARENT ========== */}
//       {showProfilModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
//             <div className="p-6 border-b flex justify-between items-center">
//               <h2 className="text-xl font-semibold flex items-center gap-2">
//                 <User className="w-5 h-5" /> Modifier mon profil
//               </h2>
//               <button onClick={() => setShowProfilModal(false)} className="text-gray-400 hover:text-gray-600">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <form onSubmit={async (e) => {
//               e.preventDefault()
//               setProfilSubmitting(true)
//               setFormError('')
//               const formData = new FormData(e.currentTarget)
//               const result = await updateParentProfile({
//                 telephone: formData.get('telephone') as string,
//                 adresse: formData.get('adresse') as string,
//               })
//               if (result.success) {
//                 setMessage('Profil mis à jour avec succès')
//                 setTimeout(() => setMessage(''), 3000)
//                 setShowProfilModal(false)
//                 await loadParentProfile()
//               } else {
//                 setFormError(result.error || 'Erreur lors de la mise à jour')
//               }
//               setProfilSubmitting(false)
//             }} className="p-6 space-y-4">
//               {formError && (
//                 <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
//                   <AlertCircle className="w-4 h-4" /> {formError}
//                 </div>
//               )}

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
//                 <input 
//                   type="tel" 
//                   name="telephone" 
//                   defaultValue={parentProfile?.telephone || ''}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
//                   placeholder="+243 123 456 789" 
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
//                 <input 
//                   type="text" 
//                   name="adresse" 
//                   defaultValue={parentProfile?.adresse || ''}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
//                   placeholder="123, Avenue de la Paix" 
//                 />
//               </div>

//               <div className="flex gap-2 pt-2">
//                 <button 
//                   type="button" 
//                   onClick={() => {
//                     setShowProfilModal(false)
//                     setFormError('')
//                   }} 
//                   className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
//                 >
//                   Annuler
//                 </button>
//                 <button 
//                   type="submit" 
//                   disabled={profilSubmitting} 
//                   className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm flex items-center justify-center gap-2"
//                 >
//                   {profilSubmitting ? (
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
//                   ) : (
//                     'Enregistrer'
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* ========== MODAL CONFIRMATION SUPPRESSION ========== */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
//             <div className="p-6 text-center">
//               <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Trash2 className="w-6 h-6 text-red-600" />
//               </div>
//               <h3 className="text-lg font-semibold mb-2">Supprimer {showDeleteConfirm.nom} ?</h3>
//               <p className="text-sm text-gray-500 mb-6">Cette action est irréversible. Toutes les données associées à cet enfant seront supprimées.</p>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setShowDeleteConfirm(null)}
//                   className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   onClick={() => handleSupprimerEnfant(showDeleteConfirm.id)}
//                   className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
//                 >
//                   Supprimer
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// app/dashboard/parent/page.tsx

'use client'

import { useAuth } from '@/context/AuthContext'
import { updateProfilePhoto } from '@/actions/auth'
import { ajouterEnfant, supprimerEnfant, getElevesParent } from '@/actions/eleves'
import { creerService, getServicesParent, supprimerService, updateServiceStatus } from '@/actions/parent-service'
import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { 
  User, 
  Calendar, 
  BookOpen, 
  GraduationCap, 
  Plus, 
  Trash2, 
  Upload,
  Search,
  Eye,
  Clock,
  Check,
  X,
  AlertCircle,
  Users,
  FileText,
  Building2,
  ChevronRight,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  DollarSign,
  Edit3,
  MoreVertical
} from 'lucide-react'
import Loader from '@/components/Loader'
import { updateParentProfile, getParentProfile } from '@/actions/auth'

type Eleve = {
  id: number
  parent_id: number
  nom: string
  postnom: string
  prenom: string
  genre: string
  date_naissance: string
  niveau: string
  ecole: string
}

type Contrat = {
  id: number
  parent_id: number
  precepteur_id: number
  eleve_id: number
  matiere_id: number
  date_debut: string
  date_fin: string
  heure_debut_pref: string
  heure_fin_pref: string
  jours_pref: string
  type_contrat: string
  frequence: string
  tarif_horaire: number | null
  notes: string | null
  statut: 'en_attente' | 'accepte' | 'refuse' | 'actif' | 'termine' | 'annule'
  created_at: string
  precepteur_username: string
  precepteur_commune: string
  precepteur_note: number
  precepteur_photo: string | null
  eleve_nom: string
  eleve_prenom: string
  eleve_niveau: string
  matiere_nom: string
  matiere_niveau: string
  sessions_count: number
  sessions_planifiees: number
}

type ServiceParent = {
  id: number
  parent_id: number
  eleve_id: number
  titre: string
  description: string
  matiere_preferee: string | null
  niveau_eleve: string
  frequence_souhaitee: string
  jours_preferences: string | null
  heures_preferences: string | null
  budget_horaire: number | null
  lieu_preference: string
  statut: string
  nombre_vues: number
  nombre_candidatures: number
  date_creation: string
  date_expiration: string | null
  eleve: {
    nom: string
    prenom: string
    niveau: string
  }
}

export default function ParentDashboard() {
  const { user, updateUser, isAuthenticated } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('enfants')
  const [eleves, setEleves] = useState<Eleve[]>([])
  const [contrats, setContrats] = useState<Contrat[]>([])
  const [services, setServices] = useState<ServiceParent[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [deletingEnfant, setDeletingEnfant] = useState<number | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{id: number, nom: string} | null>(null)
  const [showProfilModal, setShowProfilModal] = useState(false)
  const [parentProfile, setParentProfile] = useState<any>(null)
  const [profilSubmitting, setProfilSubmitting] = useState(false)
  const [deleteServiceId, setDeleteServiceId] = useState<number | null>(null)

  const isInitializedRef = useRef(false)
  const lastUserIdRef = useRef<string | null>(null)

  const loadContrats = useCallback(async () => {
    if (!user) return

    const { data: parent } = await supabase
      .from('parents')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!parent) {
      setContrats([])
      return
    }

    const { data: contratsData, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('parent_id', parent.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error || !contratsData || contratsData.length === 0) {
      setContrats([])
      return
    }

    const contratsEnrichis = await Promise.all(
      contratsData.map(async (contrat) => {
        let enriched: any = { ...contrat }

        const { data: eleve } = await supabase
          .from('eleves').select('nom, prenom, niveau').eq('id', contrat.eleve_id).single()
        if (eleve) {
          enriched.eleve_nom = eleve.nom
          enriched.eleve_prenom = eleve.prenom
          enriched.eleve_niveau = eleve.niveau
        }

        const { data: matiere } = await supabase
          .from('matieres').select('nom, niveau').eq('id', contrat.matiere_id).single()
        if (matiere) {
          enriched.matiere_nom = matiere.nom
          enriched.matiere_niveau = matiere.niveau
        }

        const { data: precepteur } = await supabase
          .from('precepteurs').select('id, commune, note_moyenne, user_id').eq('id', contrat.precepteur_id).single()
        if (precepteur) {
          enriched.precepteur_commune = precepteur.commune
          enriched.precepteur_note = precepteur.note_moyenne
          const { data: precepteurUser } = await supabase
            .from('users').select('username, photo_profil').eq('id', precepteur.user_id).single()
          if (precepteurUser) {
            enriched.precepteur_username = precepteurUser.username
            enriched.precepteur_photo = precepteurUser.photo_profil
          }
        }

        const { data: sessions } = await supabase
          .from('sessions_cours').select('id, statut').eq('contract_id', contrat.id)
        enriched.sessions_count = sessions?.length || 0
        enriched.sessions_planifiees = sessions?.filter(s => s.statut === 'planifie').length || 0

        return enriched as Contrat
      })
    )

    setContrats(contratsEnrichis)
  }, [user?.id])

  const loadParentProfile = useCallback(async () => {
    const result = await getParentProfile()
    if (result.success && result.parent) {
      setParentProfile(result.parent)
    }
  }, [])

// Modifiez loadServices pour passer l'ID utilisateur
const loadServices = useCallback(async () => {
  if (!user?.id) return
  
  const { services: servicesData } = await getServicesParent(user.id)
  if (servicesData) {
    setServices(servicesData)
  }
}, [user?.id])

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const { eleves: elevesData } = await getElevesParent()
      if (elevesData) setEleves(elevesData)
      await loadContrats()
      await loadServices()
    } catch (error) {
      console.error('Erreur chargement données:', error)
    }
    setLoading(false)
  }, [loadContrats, loadServices])

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      return
    }

    const currentUserId = user.id
    
    if (lastUserIdRef.current === currentUserId && isInitializedRef.current) {
      return
    }

    isInitializedRef.current = true
    lastUserIdRef.current = currentUserId
    
    loadData()
    loadParentProfile()
  }, [isAuthenticated, user?.id, loadData, loadParentProfile])

  useEffect(() => {
    if (!isAuthenticated) {
      isInitializedRef.current = false
      lastUserIdRef.current = null
    }
  }, [isAuthenticated])

  const forceReload = useCallback(async () => {
    isInitializedRef.current = false
    await loadData()
    isInitializedRef.current = true
  }, [loadData])

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploading(true)
    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const result = await updateProfilePhoto(reader.result as string)
        if (result.success) {
          updateUser({ photo_profil: reader.result as string })
          setMessage('Photo mise à jour avec succès')
        } else {
          setMessage(result.error || 'Erreur lors de la mise à jour')
        }
        setUploading(false)
        setTimeout(() => setMessage(''), 3000)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      setMessage('Erreur lors de la mise à jour')
      setUploading(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleAjouterEnfant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError('')
    setSubmitting(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      const result = await ajouterEnfant({
        nom: formData.get('nom') as string,
        postnom: formData.get('postnom') as string,
        prenom: formData.get('prenom') as string,
        genre: formData.get('genre') as string,
        date_naissance: formData.get('date_naissance') as string,
        niveau: formData.get('niveau') as string,
        ecole: formData.get('ecole') as string,
      })
      
      if (result.error) {
        setFormError(result.error)
      } else {
        setShowModal(false)
        setMessage('Enfant ajouté avec succès')
        setTimeout(() => setMessage(''), 3000)
        await forceReload()
      }
    } catch (error) {
      setFormError("Erreur lors de l'ajout")
    }
    
    setSubmitting(false)
  }

  // Dans le composant ParentDashboard, modifiez les fonctions suivantes :

// Modifiez handleCreerService pour passer l'ID utilisateur
const handleCreerService = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setFormError('')
  setSubmitting(true)
  
  try {
    const formData = new FormData(e.currentTarget)
    
    // ✅ Ajouter l'ID utilisateur
    if (!user?.id) {
      setFormError('Vous devez être connecté')
      setSubmitting(false)
      return
    }
    
    const result = await creerService({
      userId: user.id,  // ✅ Passer l'ID utilisateur
      eleve_id: parseInt(formData.get('eleve_id') as string),
      titre: formData.get('titre') as string,
      description: formData.get('description') as string,
      matiere_preferee: formData.get('matiere_preferee') as string,
      niveau_eleve: formData.get('niveau_eleve') as string,
      frequence_souhaitee: formData.get('frequence_souhaitee') as string,
      jours_preferences: formData.get('jours_preferences') as string,
      heures_preferences: formData.get('heures_preferences') as string,
      budget_horaire: formData.get('budget_horaire') ? parseFloat(formData.get('budget_horaire') as string) : undefined,
      lieu_preference: formData.get('lieu_preference') as string,
    })
    
    if (result.error) {
      setFormError(result.error)
    } else {
      setShowServiceModal(false)
      setMessage('Service créé avec succès')
      setTimeout(() => setMessage(''), 3000)
      await forceReload()
    }
  } catch (error) {
    setFormError("Erreur lors de la création du service")
  }
  
  setSubmitting(false)
}



// Modifiez handleSupprimerService pour passer l'ID utilisateur
const handleSupprimerService = async () => {
  if (!deleteServiceId || !user?.id) return
  
  setSubmitting(true)
  try {
    const result = await supprimerService(deleteServiceId, user.id)
    if (result.success) {
      setMessage('Service supprimé avec succès')
      setTimeout(() => setMessage(''), 3000)
      await forceReload()
    } else {
      setMessage(result.error || 'Erreur lors de la suppression')
      setTimeout(() => setMessage(''), 3000)
    }
  } catch (error) {
    setMessage('Erreur lors de la suppression')
    setTimeout(() => setMessage(''), 3000)
  }
  setSubmitting(false)
  setDeleteServiceId(null)
}
  const handleSupprimerEnfant = async (eleveId: number) => {
    setDeletingEnfant(eleveId)
    try {
      const result = await supprimerEnfant(eleveId)
      if (result.success) {
        setMessage('Enfant supprimé avec succès')
        setTimeout(() => setMessage(''), 3000)
        await forceReload()
      } else {
        setMessage(result.error || 'Erreur lors de la suppression')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      setMessage('Erreur lors de la suppression')
      setTimeout(() => setMessage(''), 3000)
    }
    setDeletingEnfant(null)
    setShowDeleteConfirm(null)
  }

  

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-800'
      case 'accepte': return 'bg-blue-100 text-blue-800'
      case 'actif': return 'bg-green-100 text-green-800'
      case 'pourvu': return 'bg-green-100 text-green-800'
      case 'en_cours': return 'bg-blue-100 text-blue-800'
      case 'refuse': return 'bg-red-100 text-red-800'
      case 'termine': return 'bg-gray-100 text-gray-800'
      case 'annule': return 'bg-red-100 text-red-800'
      case 'expire': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'en_attente': return <Clock className="w-3.5 h-3.5" />
      case 'accepte':
      case 'actif':
      case 'pourvu':
      case 'en_cours': return <Check className="w-3.5 h-3.5" />
      case 'refuse':
      case 'annule': return <X className="w-3.5 h-3.5" />
      case 'termine': return <Check className="w-3.5 h-3.5" />
      case 'expire': return <AlertCircle className="w-3.5 h-3.5" />
      default: return <AlertCircle className="w-3.5 h-3.5" />
    }
  }

  const getFrequenceLabel = (frequence: string) => {
    switch (frequence) {
      case 'unique': return 'Ponctuel'
      case 'hebdomadaire': return 'Hebdomadaire'
      case 'bi-hebdomadaire': return '2x/semaine'
      case 'mensuel': return 'Mensuel'
      default: return frequence
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-20"><Loader /></div>
      </div>
    )
  }

  if (!user) return null

  const contratsActifs = contrats.filter(c => c.statut === 'actif' || c.statut === 'accepte').length
  const contratsEnAttente = contrats.filter(c => c.statut === 'en_attente').length
  const totalSessions = contrats.reduce((acc, c) => acc + c.sessions_count, 0)
  const sessionsPlanifiees = contrats.reduce((acc, c) => acc + c.sessions_planifiees, 0)
  const servicesActifs = services.filter(s => s.statut === 'actif' || s.statut === 'en_cours').length

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Message toast */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
          message.includes('Erreur') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
        }`}>
          {message.includes('Erreur') ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <Check className="w-4 h-4 flex-shrink-0" />}
          {message}
        </div>
      )}

      {/* ========== CARD PROFIL ========== */}
      <div className="bg-white rounded-2xl mb-6 p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
          {/* Photo */}
          <div className="relative group flex-shrink-0 mx-auto md:mx-0">
            {user.photo_profil ? (
              <img src={user.photo_profil} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-10 h-10 text-gray-400" />
              </div>
            )}
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              {uploading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Upload className="w-5 h-5 text-white" />
              )}
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
            </label>
          </div>

          {/* Infos */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2 mt-1">
              <Users className="w-4 h-4" />
              Parent
              <span className="text-sm text-gray-500">
                • {eleves.length} enfant{eleves.length > 1 ? 's' : ''}
              </span>
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm text-gray-500">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
            {parentProfile?.telephone && (
              <div className="flex items-center justify-center md:justify-start gap-2 mt-1 text-sm text-gray-500">
                <Phone className="w-4 h-4" />
                <span>{parentProfile.telephone}</span>
              </div>
            )}
            {parentProfile?.adresse && (
              <div className="flex items-center justify-center md:justify-start gap-2 mt-1 text-sm text-gray-500">
                <Building2 className="w-4 h-4" />
                <span>{parentProfile.adresse}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <button
              onClick={() => setShowProfilModal(true)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <User className="w-4 h-4" /> Modifier profil
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Ajouter un enfant
            </button>
            <button
              onClick={() => setShowServiceModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-md"
            >
              <Briefcase className="w-4 h-4" /> Solliciter un service
            </button>
            <Link
              href="/recherche"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" /> Rechercher
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl">
            <p className="text-2xl font-bold text-blue-600">{eleves.length}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Users className="w-3 h-3" /> Enfants
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl">
            <p className="text-2xl font-bold text-green-600">{contrats.length}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <FileText className="w-3 h-3" /> Contrats
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl">
            <p className="text-2xl font-bold text-purple-600">{contratsActifs}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Check className="w-3 h-3" /> Actifs
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-xl">
            <p className="text-2xl font-bold text-orange-600">{services.length}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Briefcase className="w-3 h-3" /> Services
            </p>
          </div>
          <div className="p-4 bg-teal-50 rounded-xl">
            <p className="text-2xl font-bold text-teal-600">{sessionsPlanifiees}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Sessions à venir
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-xl">
            <p className="text-2xl font-bold text-yellow-600">{contratsEnAttente}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Clock className="w-3 h-3" /> En attente
            </p>
          </div>
        </div>
      </div>

      {/* ========== TABS ========== */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <button
          onClick={() => setActiveTab('enfants')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'enfants' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Users className="w-4 h-4" /> Enfants ({eleves.length})
        </button>
        <button
          onClick={() => setActiveTab('contrats')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'contrats' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <FileText className="w-4 h-4" /> Contrats ({contrats.length})
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'services' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Services ({services.length})
        </button>
      </div>

      {/* ========== CARD ENFANTS ========== */}
      {activeTab === 'enfants' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-700" />
                Mes enfants
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">{eleves.length} enfant{eleves.length > 1 ? 's' : ''} inscrit{eleves.length > 1 ? 's' : ''}</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" /> Ajouter
            </button>
          </div>

          {eleves.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <Users className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium mb-1">Aucun enfant inscrit</p>
              <p className="text-gray-400 text-sm mb-6">Ajoutez votre premier enfant pour commencer</p>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium text-sm"
              >
                <Plus className="w-4 h-4" /> Ajouter un enfant
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {eleves.map((eleve) => (
                <div key={eleve.id} className="p-4 hover:bg-gray-50/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        eleve.genre === 'M' ? 'bg-blue-100' : 'bg-pink-100'
                      }`}>
                        <span className={`text-lg font-bold ${
                          eleve.genre === 'M' ? 'text-blue-600' : 'text-pink-600'
                        }`}>
                          {eleve.prenom[0]}{eleve.nom[0]}
                        </span>
                      </div>
                    </div>

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">
                        {eleve.prenom} {eleve.nom} {eleve.postnom}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" /> {eleve.niveau}
                        </span>
                        {eleve.ecole && (
                          <>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1">
                              <Building2 className="w-3 h-3" /> {eleve.ecole}
                            </span>
                          </>
                        )}
                        <span>•</span>
                        <span>{eleve.genre === 'M' ? 'Garçon' : 'Fille'}</span>
                        {eleve.date_naissance && (
                          <>
                            <span>•</span>
                            <span>{new Date(eleve.date_naissance).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/dashboard/parent/suivi/${eleve.id}`}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Suivi"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setShowDeleteConfirm({ id: eleve.id, nom: `${eleve.prenom} ${eleve.nom}` })}
                        disabled={deletingEnfant === eleve.id}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                        title="Supprimer"
                      >
                        {deletingEnfant === eleve.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========== CARD CONTRATS ========== */}
      {activeTab === 'contrats' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-700" />
                Mes contrats
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">{contrats.length} contrat{contrats.length > 1 ? 's' : ''}</p>
            </div>
            <Link
              href="/recherche"
              className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium"
            >
              <Search className="w-4 h-4" /> Trouver un précepteur
            </Link>
          </div>

          {contrats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <FileText className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium mb-1">Aucun contrat</p>
              <p className="text-gray-400 text-sm mb-6">Proposez un contrat à un précepteur</p>
              <Link
                href="/recherche"
                className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium text-sm"
              >
                <Search className="w-4 h-4" /> Trouver un précepteur
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {contrats.map((contrat) => (
                <Link
                  key={contrat.id}
                  href={`/dashboard/parent/contrats/${contrat.id}`}
                  className="p-4 hover:bg-gray-50/50 transition-colors group block"
                >
                  <div className="flex items-center gap-4">
                    {/* Icône matière */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>

                    {/* Infos contrat */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 truncate">
                          {contrat.matiere_nom || 'Matière'}
                        </p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatutColor(contrat.statut)}`}>
                          {getStatutIcon(contrat.statut)}
                          {contrat.statut.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" /> {contrat.eleve_prenom} {contrat.eleve_nom}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" /> {contrat.precepteur_username || 'Précepteur'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(contrat.date_debut)} → {formatDate(contrat.date_fin)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {contrat.heure_debut_pref?.slice(0, 5)} - {contrat.heure_fin_pref?.slice(0, 5)}
                        </span>
                        {contrat.tarif_horaire && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 font-medium">
                              {contrat.tarif_horaire.toLocaleString()} FC/h
                            </span>
                          </>
                        )}
                        {contrat.sessions_count > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" /> {contrat.sessions_count} session{contrat.sessions_count > 1 ? 's' : ''}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Précepteur mini avatar + flèche */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {contrat.precepteur_photo ? (
                        <img src={contrat.precepteur_photo} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========== CARD SERVICES ========== */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-gray-700" />
                Mes sollicitations de service
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">{services.length} service{services.length > 1 ? 's' : ''} publié{services.length > 1 ? 's' : ''}</p>
            </div>
            <button
              onClick={() => setShowServiceModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 font-medium shadow-md"
            >
              <Plus className="w-4 h-4" /> Nouveau service
            </button>
          </div>

          {services.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <Briefcase className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium mb-1">Aucune sollicitation</p>
              <p className="text-gray-400 text-sm mb-6">Publiez votre première demande de service</p>
              <button
                onClick={() => setShowServiceModal(true)}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 font-medium text-sm shadow-md"
              >
                <Plus className="w-4 h-4" /> Créer une sollicitation
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {services.map((service) => (
                <div key={service.id} className="p-4 hover:bg-gray-50/50 transition-colors group">
                  <div className="flex items-start gap-4">
                    {/* Icône */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 truncate">
                          {service.titre}
                        </p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatutColor(service.statut)}`}>
                          {getStatutIcon(service.statut)}
                          {service.statut.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {service.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" /> {service.eleve?.prenom} {service.eleve?.nom}
                        </span>
                        {service.matiere_preferee && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" /> {service.matiere_preferee}
                            </span>
                          </>
                        )}
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {getFrequenceLabel(service.frequence_souhaitee)}
                        </span>
                        {service.lieu_preference && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> 
                              {service.lieu_preference === 'domicile' ? 'Domicile' : 
                               service.lieu_preference === 'en_ligne' ? 'En ligne' : 'Autre'}
                            </span>
                          </>
                        )}
                        {service.budget_horaire && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-green-600 font-medium">
                              <DollarSign className="w-3 h-3" /> {service.budget_horaire.toLocaleString()} FC/h
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {service.nombre_vues} vue{service.nombre_vues > 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> {service.nombre_candidatures} candidature{service.nombre_candidatures > 1 ? 's' : ''}
                        </span>
                        <span>
                          Créé le {formatDate(service.date_creation)}
                        </span>
                        {service.date_expiration && (
                          <span className="text-orange-500">
                            Expire le {formatDate(service.date_expiration)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        onClick={() => setDeleteServiceId(service.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========== MODAL AJOUT ENFANT ========== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Plus className="w-5 h-5" /> Ajouter un enfant
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAjouterEnfant} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                  <input type="text" name="prenom" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Marie" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input type="text" name="nom" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Kyungu" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postnom</label>
                  <input type="text" name="postnom" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Kunta" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Genre *</label>
                  <select name="genre" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                  <input type="date" name="date_naissance" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Niveau *</label>
                  <select name="niveau" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                    <option value="7ème">7ème année</option>
                    <option value="8ème">8ème année</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">École</label>
                  <input type="text" name="ecole" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Collège Saint Joseph" />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Annuler
                </button>
                <button type="submit" disabled={submitting} className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm flex items-center justify-center gap-2">
                  {submitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== MODAL CREATION SERVICE ========== */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" /> Solliciter un service
              </h2>
              <button onClick={() => {
                setShowServiceModal(false)
                setFormError('')
              }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreerService} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pour quel enfant ? *</label>
                <select name="eleve_id" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                  <option value="">Sélectionnez un enfant</option>
                  {eleves.map(eleve => (
                    <option key={eleve.id} value={eleve.id}>
                      {eleve.prenom} {eleve.nom} - {eleve.niveau}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre du service *</label>
                <input 
                  type="text" 
                  name="titre" 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                  placeholder="Ex: Cours de mathématiques niveau 7ème" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description détaillée *</label>
                <textarea 
                  name="description" 
                  required 
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                  placeholder="Décrivez vos besoins spécifiques, les difficultés de l'élève, vos attentes..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Matière souhaitée</label>
                  <select name="matiere_preferee" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                    <option value="">Toutes matières</option>
                    <option value="Mathématiques">Mathématiques</option>
                    <option value="Français">Français</option>
                    <option value="Anglais">Anglais</option>
                    <option value="Sciences">Sciences</option>
                    <option value="Physique-Chimie">Physique-Chimie</option>
                    <option value="SVT">SVT</option>
                    <option value="Histoire-Géo">Histoire-Géo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Niveau *</label>
                  <select name="niveau_eleve" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                    <option value="7ème">7ème année</option>
                    <option value="8ème">8ème année</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fréquence *</label>
                  <select name="frequence_souhaitee" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                    <option value="unique">Ponctuel (une fois)</option>
                    <option value="hebdomadaire">Hebdomadaire (1x/semaine)</option>
                    <option value="bi-hebdomadaire">Bi-hebdomadaire (2x/semaine)</option>
                    <option value="mensuel">Mensuel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lieu préféré</label>
                  <select name="lieu_preference" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                    <option value="domicile">À domicile</option>
                    <option value="en_ligne">En ligne</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jours préférés</label>
                  <input 
                    type="text" 
                    name="jours_preferences" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                    placeholder="Lundi, Mercredi, Vendredi" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heures préférées</label>
                  <input 
                    type="text" 
                    name="heures_preferences" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                    placeholder="14h - 16h" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget horaire (FC)</label>
                  <input 
                    type="number" 
                    name="budget_horaire" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                    placeholder="5000" 
                    min="0"
                    step="1000"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-sm text-blue-800">
                  <strong>💡 Information :</strong> Votre sollicitation sera visible par les précepteurs pendant 30 jours. 
                  Vous recevrez des notifications quand des précepteurs postuleront.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowServiceModal(false)
                    setFormError('')
                  }} 
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-sm flex items-center justify-center gap-2 shadow-md"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <Briefcase className="w-4 h-4" />
                  )}
                  Publier la sollicitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== MODAL PROFIL PARENT ========== */}
      {showProfilModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <User className="w-5 h-5" /> Modifier mon profil
              </h2>
              <button onClick={() => setShowProfilModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault()
              setProfilSubmitting(true)
              setFormError('')
              const formData = new FormData(e.currentTarget)
              const result = await updateParentProfile({
                telephone: formData.get('telephone') as string,
                adresse: formData.get('adresse') as string,
              })
              if (result.success) {
                setMessage('Profil mis à jour avec succès')
                setTimeout(() => setMessage(''), 3000)
                setShowProfilModal(false)
                await loadParentProfile()
              } else {
                setFormError(result.error || 'Erreur lors de la mise à jour')
              }
              setProfilSubmitting(false)
            }} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input 
                  type="tel" 
                  name="telephone" 
                  defaultValue={parentProfile?.telephone || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                  placeholder="+243 123 456 789" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <input 
                  type="text" 
                  name="adresse" 
                  defaultValue={parentProfile?.adresse || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                  placeholder="123, Avenue de la Paix" 
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowProfilModal(false)
                    setFormError('')
                  }} 
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={profilSubmitting} 
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {profilSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    'Enregistrer'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== MODAL CONFIRMATION SUPPRESSION ENFANT ========== */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Supprimer {showDeleteConfirm.nom} ?</h3>
              <p className="text-sm text-gray-500 mb-6">Cette action est irréversible. Toutes les données associées à cet enfant seront supprimées.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleSupprimerEnfant(showDeleteConfirm.id)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== MODAL CONFIRMATION SUPPRESSION SERVICE ========== */}
      {deleteServiceId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Supprimer cette sollicitation ?</h3>
              <p className="text-sm text-gray-500 mb-6">Cette action est irréversible. La sollicitation sera définitivement supprimée.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteServiceId(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSupprimerService}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center justify-center"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    'Supprimer'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

