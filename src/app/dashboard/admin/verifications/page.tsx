// 'use client'

// import { useState, useEffect } from 'react'
// import { supabase } from '@/lib/supabase'
// import { 
//   User, 
//   Search,
//   Check,
//   X,
//   AlertCircle,
//   Clock,
//   Eye,
//   GraduationCap,
//   MapPin,
//   Star,
//   BookOpen,
//   Shield,
//   ShieldAlert,
//   ShieldCheck,
//   ShieldX,
//   Filter,
//   RotateCcw,
//   ChevronLeft,
//   ChevronRight,
//   Users
// } from 'lucide-react'

// type Precepteur = {
//   id: number
//   user_id: string
//   commune: string | null
//   quartier: string | null
//   latitude: number | null
//   longitude: number | null
//   annees_experience: number
//   note_moyenne: number
//   diplome: string | null
//   etablissement_origine: string | null
//   statut_verification: 'en_attente' | 'verifie' | 'rejete'
//   disponible: boolean
//   created_at: string
//   updated_at: string
//   user: {
//     id: string
//     username: string
//     email: string
//     genre: string
//     photo_profil: string | null
//     created_at: string
//   }
//   matieres: {
//     matiere_id: number
//     matiere: {
//       id: number
//       nom: string
//       niveau: string
//     }
//   }[]
// }

// type Stats = {
//   en_attente: number
//   verifie: number
//   rejete: number
//   total: number
// }

// export default function VerificationPrecepteurs() {
//   const [precepteurs, setPrecepteurs] = useState<Precepteur[]>([])
//   const [loading, setLoading] = useState(true)
//   const [message, setMessage] = useState('')
//   const [searchTerm, setSearchTerm] = useState('')
//   const [statutFilter, setStatutFilter] = useState('')
//   const [page, setPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
//   const [totalForPage, setTotalForPage] = useState(0)
//   const [stats, setStats] = useState<Stats>({
//     en_attente: 0,
//     verifie: 0,
//     rejete: 0,
//     total: 0
//   })
  
//   // Modal détails
//   const [showDetailsModal, setShowDetailsModal] = useState(false)
//   const [selectedPrecepteur, setSelectedPrecepteur] = useState<Precepteur | null>(null)
  
//   // Modal confirmation
//   const [showConfirmModal, setShowConfirmModal] = useState(false)
//   const [confirmAction, setConfirmAction] = useState<'verifie' | 'rejete'>('verifie')
//   const [confirmComment, setConfirmComment] = useState('')
//   const [processing, setProcessing] = useState(false)

//   const ITEMS_PER_PAGE = 10

//   useEffect(() => {
//     loadStats()
//   }, [])

//   useEffect(() => {
//     loadPrecepteurs()
//   }, [statutFilter, page])

//   const loadStats = async () => {
//     // Charger les statistiques globales
//     const { data: allPrecepteurs, error } = await supabase
//       .from('precepteurs')
//       .select('statut_verification')

//     if (!error && allPrecepteurs) {
//       const stats = {
//         en_attente: allPrecepteurs.filter(p => p.statut_verification === 'en_attente').length,
//         verifie: allPrecepteurs.filter(p => p.statut_verification === 'verifie').length,
//         rejete: allPrecepteurs.filter(p => p.statut_verification === 'rejete').length,
//         total: allPrecepteurs.length
//       }
//       setStats(stats)
//     }
//   }

//   const loadPrecepteurs = async () => {
//     setLoading(true)

//     let query = supabase
//       .from('precepteurs')
//       .select(`
//         *,
//         user:users!inner(
//           id, username, email, genre, photo_profil, created_at
//         )
//       `, { count: 'exact' })

//     if (statutFilter) {
//       query = query.eq('statut_verification', statutFilter)
//     }

//     query = query
//       .order('created_at', { ascending: false })
//       .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1)

//     const { data, error, count } = await query

//     if (error) {
//       console.error('Error loading precepteurs:', error)
//       setMessage('Erreur lors du chargement des précepteurs')
//     } else {
//       const precepteursData = data || []
      
//       // Charger les matières pour chaque précepteur
//       if (precepteursData.length > 0) {
//         const precepteurIds = precepteursData.map(p => p.id)
//         const { data: matieres } = await supabase
//           .from('precepteur_matieres')
//           .select(`
//             precepteur_id,
//             matiere_id,
//             matiere:matieres!inner(
//               id, nom, niveau
//             )
//           `)
//           .in('precepteur_id', precepteurIds)

//         const precepteursWithMatieres = precepteursData.map(p => ({
//           ...p,
//           matieres: matieres?.filter(m => m.precepteur_id === p.id) || []
//         }))

//         setPrecepteurs(precepteursWithMatieres)
//       } else {
//         setPrecepteurs([])
//       }

//       setTotalForPage(count || 0)
//       setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE))
//     }

//     setLoading(false)
//     setTimeout(() => setMessage(''), 3000)
//   }

//   const handleVerification = async () => {
//     if (!selectedPrecepteur) return
    
//     setProcessing(true)
    
//     try {
//       const { error } = await supabase
//         .from('precepteurs')
//         .update({
//           statut_verification: confirmAction,
//           updated_at: new Date().toISOString()
//         })
//         .eq('id', selectedPrecepteur.id)

//       if (error) throw error

//       setMessage(
//         confirmAction === 'verifie' 
//           ? `Le précepteur ${selectedPrecepteur.user.username} est maintenant vérifié` 
//           : `Le précepteur ${selectedPrecepteur.user.username} a été rejeté`
//       )
      
//       setShowConfirmModal(false)
//       setShowDetailsModal(false)
//       setSelectedPrecepteur(null)
//       setConfirmComment('')
      
//       // Recharger les stats et la liste
//       await loadStats()
//       await loadPrecepteurs()
//     } catch (error) {
//       console.error('Error updating verification:', error)
//       setMessage('Erreur lors de la mise à jour du statut')
//     }
    
//     setProcessing(false)
//     setTimeout(() => setMessage(''), 3000)
//   }

//   const openDetails = (precepteur: Precepteur) => {
//     setSelectedPrecepteur(precepteur)
//     setShowDetailsModal(true)
//   }

//   const openConfirmAction = (action: 'verifie' | 'rejete') => {
//     setConfirmAction(action)
//     setConfirmComment('')
//     setShowConfirmModal(true)
//   }

//   // Filtrage par recherche
//   const filteredPrecepteurs = precepteurs.filter(precepteur => {
//     if (!searchTerm) return true
    
//     const searchLower = searchTerm.toLowerCase()
//     return (
//       precepteur.user?.username?.toLowerCase().includes(searchLower) ||
//       precepteur.user?.email?.toLowerCase().includes(searchLower) ||
//       precepteur.commune?.toLowerCase().includes(searchLower) ||
//       precepteur.diplome?.toLowerCase().includes(searchLower) ||
//       precepteur.matieres?.some(m => 
//         m.matiere?.nom?.toLowerCase().includes(searchLower)
//       )
//     )
//   })

//   const getStatutBadge = (statut: string) => {
//     switch (statut) {
//       case 'verifie':
//         return {
//           icon: <ShieldCheck className="w-4 h-4" />,
//           label: 'Vérifié',
//           className: 'bg-green-100 text-green-700 border-green-200'
//         }
//       case 'rejete':
//         return {
//           icon: <ShieldX className="w-4 h-4" />,
//           label: 'Rejeté',
//           className: 'bg-red-100 text-red-700 border-red-200'
//         }
//       case 'en_attente':
//       default:
//         return {
//           icon: <ShieldAlert className="w-4 h-4" />,
//           label: 'En attente',
//           className: 'bg-yellow-100 text-yellow-700 border-yellow-200'
//         }
//     }
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       {/* Message */}
//       {message && (
//         <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 border ${
//           message.includes('Erreur') 
//             ? 'bg-red-50 text-red-600 border-red-200' 
//             : 'bg-green-50 text-green-600 border-green-200'
//         }`}>
//           {message.includes('Erreur') ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
//           {message}
//         </div>
//       )}

//       {/* En-tête */}
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold flex items-center gap-2">
//           <Shield className="w-6 h-6" /> Vérification des précepteurs
//         </h1>
//         <p className="text-gray-600 mt-1">
//           Vérifiez et gérez les statuts des précepteurs inscrits sur la plateforme
//         </p>
//       </div>

//       {/* Stats - Cliquables pour filtrer */}
//       <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
//         <button
//           onClick={() => { 
//             setStatutFilter(statutFilter === 'en_attente' ? '' : 'en_attente')
//             setPage(1)
//           }}
//           className={`p-4 rounded-xl border-2 flex justify-between transition-colors text-left ${
//             statutFilter === 'en_attente' 
//               ? 'bg-yellow-100 border-yellow-400' 
//               : 'bg-yellow-50 border-yellow-100 hover:bg-yellow-100 hover:border-yellow-300'
//           }`}
//         >
//           <div className="flex items-center gap-2 mb-2">
//             <div className="w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center">
//               <ShieldAlert className="w-4 h-4 text-yellow-700" />
//             </div>
//             <span className="text-sm font-medium text-yellow-800">En attente</span>
//           </div>
//           <p className="text-3xl cypher text-yellow-900">{stats.en_attente}</p>
//         </button>

//         <button
//           onClick={() => { 
//             setStatutFilter(statutFilter === 'verifie' ? '' : 'verifie')
//             setPage(1)
//           }}
//           className={`p-4 rounded-xl border-2 flex justify-between transition-colors text-left ${
//             statutFilter === 'verifie' 
//               ? 'bg-green-100 border-green-400' 
//               : 'bg-green-50 border-green-100 hover:bg-green-100 hover:border-green-300'
//           }`}
//         >
//           <div className="flex items-center gap-2 mb-2">
//             <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center">
//               <ShieldCheck className="w-4 h-4 text-green-700" />
//             </div>
//             <span className="text-sm font-medium text-green-800">Vérifiés</span>
//           </div>
//           <p className="text-3xl cypher text-green-900">{stats.verifie}</p>
//         </button>

//         <button
//           onClick={() => { 
//             setStatutFilter(statutFilter === 'rejete' ? '' : 'rejete')
//             setPage(1)
//           }}
//           className={`p-4 rounded-xl border-2 flex justify-between transition-colors text-left ${
//             statutFilter === 'rejete' 
//               ? 'bg-red-100 border-red-400' 
//               : 'bg-red-50 border-red-100 hover:bg-red-100 hover:border-red-300'
//           }`}
//         >
//           <div className="flex items-center gap-2 mb-2">
//             <div className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center">
//               <ShieldX className="w-4 h-4 text-red-700" />
//             </div>
//             <span className="text-sm font-medium text-red-800">Rejetés</span>
//           </div>
//           <p className="text-3xl cypher text-red-900">{stats.rejete}</p>
//         </button>

//         <button
//           onClick={() => { 
//             setStatutFilter('')
//             setPage(1)
//           }}
//           className={`p-4 rounded-xl border-2 flex justify-between transition-colors text-left ${
//             !statutFilter 
//               ? 'bg-blue-100 border-blue-400' 
//               : 'bg-blue-50 border-blue-100 hover:bg-blue-100 hover:border-blue-300'
//           }`}
//         >
//           <div className="flex items-center gap-2 mb-2">
//             <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
//               <Users className="w-4 h-4 text-blue-700" />
//             </div>
//             <span className="text-sm font-medium text-blue-800">Total</span>
//           </div>
//           <p className="text-3xl cypher text-blue-900">{stats.total}</p>
//         </button>
//       </div>
//       <div className="bg-white max-w-2xl rounded-xl row-span-2 border border-gray-200 p-4 mb-6">
//         <div className="flex flex-col md:flex-row gap-4 items-center">
//           <div className="flex-1 relative w-full">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Rechercher par nom, email, commune, matière..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
//             />
//           </div>
//           <select
//             value={statutFilter}
//             onChange={(e) => { setStatutFilter(e.target.value); setPage(1); }}
//             className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
//           >
//             <option value="">Tous les statuts</option>
//             <option value="en_attente">En attente ({stats.en_attente})</option>
//             <option value="verifie">Vérifié ({stats.verifie})</option>
//             <option value="rejete">Rejeté ({stats.rejete})</option>
//           </select>
//           {(searchTerm || statutFilter) && (
//             <button
//               onClick={() => { setSearchTerm(''); setStatutFilter(''); setPage(1); }}
//               className="px-4 py-2 text-sm text-gray-600 hover:text-black flex items-center gap-1 whitespace-nowrap"
//             >
//               <RotateCcw className="w-3 h-3" /> Réinitialiser
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Filtres et recherche */}

//       {/* Résumé des résultats */}
//       <div className="mb-4 text-sm text-gray-600 flex items-center gap-2">
//         <Users className="w-4 h-4" />
//         {statutFilter ? (
//           <span>
//             <strong>{totalForPage}</strong> précepteur{totalForPage > 1 ? 's' : ''} 
//             <span className="mx-1">avec le statut</span>
//             <span className="font-medium capitalize">{statutFilter.replace('_', ' ')}</span>
//             {searchTerm && <span className="ml-1">(filtré par recherche)</span>}
//           </span>
//         ) : (
//           <span>
//             <strong>{totalForPage}</strong> précepteur{totalForPage > 1 ? 's' : ''} au total
//             {searchTerm && <span className="ml-1">(filtré par recherche)</span>}
//           </span>
//         )}
//       </div>

//       {/* Liste des précepteurs */}
//       <div className="grid grid-cols-1   gap-4">

//       <div className="  grid rounded-xl border border-gray-200 overflow-hidden">
//         {loading ? (
//           <div className="p-8 space-y-4">
//             {[1, 2, 3, 4, 5].map((i) => (
//               <div key={i} className="animate-pulse flex gap-4">
//                 <div className="h-16 bg-gray-100 rounded w-full"></div>
//               </div>
//             ))}
//           </div>
//         ) : filteredPrecepteurs.length === 0 ? (
//           <div className="p-12 text-center">
//             <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <p className="text-gray-500 text-lg mb-2">Aucun précepteur trouvé</p>
//             <p className="text-gray-400 text-sm">
//               {searchTerm || statutFilter 
//                 ? 'Essayez de modifier vos critères de recherche' 
//                 : 'Aucun précepteur à afficher'}
//             </p>
//             {(searchTerm || statutFilter) && (
//               <button
//                 onClick={() => { setSearchTerm(''); setStatutFilter(''); setPage(1); }}
//                 className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
//               >
//                 Réinitialiser les filtres
//               </button>
//             )}
//           </div>
//         ) : (
//           <>
//             <div className="divide-y divide-gray-100">
//               {filteredPrecepteurs.map((precepteur) => {
//                 const statut = getStatutBadge(precepteur.statut_verification)
//                 return (
//                   <div key={precepteur.id} className="p-4 hover:bg-gray-50 transition-colors">
//                     <div className="flex items-start gap-4">
//                       {/* Photo */}
//                       <div className="flex-shrink-0">
//                         {precepteur.user?.photo_profil ? (
//                           <img src={precepteur.user.photo_profil} alt="" className="w-12 h-12 rounded-full object-cover" />
//                         ) : (
//                           <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
//                             <User className="w-6 h-6 text-gray-400" />
//                           </div>
//                         )}
//                       </div>

//                       {/* Infos */}
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-start justify-between gap-4">
//                           <div>
//                             <div className="flex items-center gap-2">
//                               <h3 className="font-medium text-gray-900 truncate">
//                                 {precepteur.user?.username || 'Anonyme'}
//                               </h3>
//                               <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${statut.className}`}>
//                                 {statut.icon}
//                                 {statut.label}
//                               </span>
//                             </div>
//                             <p className="text-sm text-gray-500 mt-0.5">{precepteur.user?.email}</p>
//                           </div>
//                           <div className="flex items-center gap-2 flex-shrink-0">
//                             <button
//                               onClick={() => openDetails(precepteur)}
//                               className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1"
//                             >
//                               <Eye className="w-3 h-3" /> Détails
//                             </button>
//                           </div>
//                         </div>

//                         {/* Badges */}
//                         <div className="flex flex-wrap gap-2 mt-2">
//                           {precepteur.commune && (
//                             <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
//                               <MapPin className="w-3 h-3" /> {precepteur.commune}
//                               {precepteur.quartier && `, ${precepteur.quartier}`}
//                             </span>
//                           )}
//                           <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full flex items-center gap-1">
//                             <Clock className="w-3 h-3" /> {precepteur.annees_experience} an{precepteur.annees_experience > 1 ? 's' : ''}
//                           </span>
//                           <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full flex items-center gap-1">
//                             <Star className="w-3 h-3" /> {precepteur.note_moyenne?.toFixed(1) || '0.0'}/5
//                           </span>
//                           {precepteur.matieres && precepteur.matieres.length > 0 && (
//                             <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full flex items-center gap-1">
//                               <BookOpen className="w-3 h-3" /> {precepteur.matieres.length} matière{precepteur.matieres.length > 1 ? 's' : ''}
//                             </span>
//                           )}
//                         </div>

//                         {/* Date d'inscription */}
//                         <p className="text-xs text-gray-400 mt-2">
//                           Inscrit le {new Date(precepteur.created_at).toLocaleDateString('fr-FR', {
//                             day: 'numeric',
//                             month: 'long',
//                             year: 'numeric'
//                           })}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex justify-center items-center gap-2 p-4 border-t border-gray-100">
//                 <button
//                   onClick={() => setPage(p => Math.max(1, p - 1))}
//                   disabled={page === 1}
//                   className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors flex items-center gap-1"
//                 >
//                   <ChevronLeft className="w-4 h-4" /> Précédent
//                 </button>
                
//                 {Array.from({ length: totalPages }, (_, i) => i + 1)
//                   .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
//                   .map((p, index, array) => (
//                     <span key={p} className="flex items-center">
//                       {index > 0 && array[index - 1] !== p - 1 && (
//                         <span className="px-2 text-gray-400">...</span>
//                       )}
//                       <button
//                         onClick={() => setPage(p)}
//                         className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
//                           page === p
//                             ? 'bg-black text-white'
//                             : 'border border-gray-300 hover:bg-gray-50'
//                         }`}
//                       >
//                         {p}
//                       </button>
//                     </span>
//                   ))}
                
//                 <button
//                   onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//                   disabled={page === totalPages}
//                   className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors flex items-center gap-1"
//                 >
//                   Suivant <ChevronRight className="w-4 h-4" />
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//       </div>

//       {/* MODAL - Détails du précepteur */}
//       {showDetailsModal && selectedPrecepteur && (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//           <div 
//             className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
//             onClick={() => setShowDetailsModal(false)}
//           ></div>

//           <div className="flex items-center justify-center min-h-screen p-4">
//             <div className="relative bg-white rounded-xl max-w-2xl w-full border border-gray-200">
//               {/* Header */}
//               <div className="flex items-center justify-between p-6 border-b border-gray-200">
//                 <h2 className="text-xl font-bold flex items-center gap-2">
//                   <User className="w-5 h-5" /> Détails du précepteur
//                 </h2>
//                 <button
//                   onClick={() => setShowDetailsModal(false)}
//                   className="text-gray-400 hover:text-gray-600 transition-colors"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               {/* Corps */}
//               <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
//                 {/* En-tête profil */}
//                 <div className="flex items-center gap-4">
//                   {selectedPrecepteur.user?.photo_profil ? (
//                     <img src={selectedPrecepteur.user.photo_profil} alt="" className="w-20 h-20 rounded-full object-cover" />
//                   ) : (
//                     <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
//                       <User className="w-10 h-10 text-gray-400" />
//                     </div>
//                   )}
//                   <div>
//                     <h3 className="text-lg font-semibold">{selectedPrecepteur.user?.username}</h3>
//                     <p className="text-gray-600">{selectedPrecepteur.user?.email}</p>
//                     <p className="text-sm text-gray-500">
//                       Genre: {selectedPrecepteur.user?.genre === 'M' ? 'Masculin' : 'Féminin'}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Infos générales */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
//                     <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
//                       <MapPin className="w-3 h-3" /> Localisation
//                     </p>
//                     <p className="font-medium text-sm">
//                       {selectedPrecepteur.commune || 'Non spécifié'}
//                       {selectedPrecepteur.quartier && `, ${selectedPrecepteur.quartier}`}
//                     </p>
//                   </div>
//                   <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
//                     <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
//                       <Clock className="w-3 h-3" /> Expérience
//                     </p>
//                     <p className="font-medium text-sm">
//                       {selectedPrecepteur.annees_experience} an{selectedPrecepteur.annees_experience > 1 ? 's' : ''}
//                     </p>
//                   </div>
//                   <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
//                     <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
//                       <GraduationCap className="w-3 h-3" /> Diplôme
//                     </p>
//                     <p className="font-medium text-sm">
//                       {selectedPrecepteur.diplome || 'Non spécifié'}
//                     </p>
//                   </div>
//                   <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
//                     <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
//                       <GraduationCap className="w-3 h-3" /> Établissement
//                     </p>
//                     <p className="font-medium text-sm">
//                       {selectedPrecepteur.etablissement_origine || 'Non spécifié'}
//                     </p>
//                   </div>
//                   <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
//                     <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
//                       <Star className="w-3 h-3" /> Note
//                     </p>
//                     <p className="font-medium text-sm">
//                       {selectedPrecepteur.note_moyenne?.toFixed(1) || '0.0'}/5
//                     </p>
//                   </div>
//                   <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
//                     <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
//                       <Shield className="w-3 h-3" /> Statut
//                     </p>
//                     <p className="font-medium text-sm capitalize">
//                       {selectedPrecepteur.statut_verification.replace('_', ' ')}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Matières */}
//                 {selectedPrecepteur.matieres && selectedPrecepteur.matieres.length > 0 && (
//                   <div>
//                     <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                       <BookOpen className="w-4 h-4" /> Matières enseignées ({selectedPrecepteur.matieres.length})
//                     </h4>
//                     <div className="flex flex-wrap gap-2">
//                       {selectedPrecepteur.matieres.map((m) => (
//                         <span key={m.matiere_id} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
//                           {m.matiere?.nom} ({m.matiere?.niveau})
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Coordonnées GPS */}
//                 {selectedPrecepteur.latitude && selectedPrecepteur.longitude && (
//                   <div>
//                     <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                       <MapPin className="w-4 h-4" /> Coordonnées GPS
//                     </h4>
//                     <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
//                       {selectedPrecepteur.latitude}, {selectedPrecepteur.longitude}
//                     </p>
//                   </div>
//                 )}

//                 {/* Dates */}
//                 <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
//                   <p>Inscrit le: {new Date(selectedPrecepteur.created_at).toLocaleDateString('fr-FR', {
//                     day: 'numeric',
//                     month: 'long',
//                     year: 'numeric'
//                   })}</p>
//                   <p>Dernière mise à jour: {new Date(selectedPrecepteur.updated_at).toLocaleDateString('fr-FR', {
//                     day: 'numeric',
//                     month: 'long',
//                     year: 'numeric'
//                   })}</p>
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl flex gap-3">
//                 <button
//                   onClick={() => setShowDetailsModal(false)}
//                   className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
//                 >
//                   Fermer
//                 </button>
//                 {selectedPrecepteur.statut_verification !== 'verifie' && (
//                   <button
//                     onClick={() => openConfirmAction('verifie')}
//                     className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
//                   >
//                     <ShieldCheck className="w-4 h-4" /> Vérifier
//                   </button>
//                 )}
//                 {selectedPrecepteur.statut_verification !== 'rejete' && (
//                   <button
//                     onClick={() => openConfirmAction('rejete')}
//                     className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
//                   >
//                     <ShieldX className="w-4 h-4" /> Rejeter
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* MODAL - Confirmation */}
//       {showConfirmModal && (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//           <div 
//             className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
//             onClick={() => setShowConfirmModal(false)}
//           ></div>

//           <div className="flex items-center justify-center min-h-screen p-4">
//             <div className="relative bg-white rounded-xl max-w-md w-full p-6 border border-gray-200">
//               <div className="text-center mb-6">
//                 <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 ${
//                   confirmAction === 'verifie' 
//                     ? 'bg-green-100 border-green-300' 
//                     : 'bg-red-100 border-red-300'
//                 }`}>
//                   {confirmAction === 'verifie' ? (
//                     <ShieldCheck className="w-8 h-8 text-green-600" />
//                   ) : (
//                     <ShieldX className="w-8 h-8 text-red-600" />
//                   )}
//                 </div>
//                 <h2 className="text-xl font-bold">
//                   {confirmAction === 'verifie' ? 'Vérifier ce précepteur' : 'Rejeter ce précepteur'}
//                 </h2>
//                 <p className="text-gray-600 mt-2">
//                   {confirmAction === 'verifie'
//                     ? 'Ce précepteur pourra apparaître dans les résultats de recherche et proposer ses services.'
//                     : 'Ce précepteur ne pourra plus proposer ses services. Cette action peut être annulée.'}
//                 </p>
//               </div>

//               <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 mb-4">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
//                     <User className="w-5 h-5 text-gray-500" />
//                   </div>
//                   <div>
//                     <p className="font-medium">{selectedPrecepteur?.user?.username}</p>
//                     <p className="text-sm text-gray-600">{selectedPrecepteur?.user?.email}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Commentaire (optionnel)
//                 </label>
//                 <textarea
//                   value={confirmComment}
//                   onChange={(e) => setConfirmComment(e.target.value)}
//                   rows={3}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm resize-none"
//                   placeholder={
//                     confirmAction === 'verifie'
//                       ? 'Ex: Félicitations, votre profil a été vérifié avec succès...'
//                       : 'Ex: Votre profil n\'a pas été validé car les informations sont incomplètes...'
//                   }
//                 />
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setShowConfirmModal(false)}
//                   className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   onClick={handleVerification}
//                   disabled={processing}
//                   className={`flex-1 px-4 py-2.5 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
//                     confirmAction === 'verifie'
//                       ? 'bg-green-600 hover:bg-green-700'
//                       : 'bg-red-600 hover:bg-red-700'
//                   }`}
//                 >
//                   {processing ? (
//                     <>
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                       Traitement...
//                     </>
//                   ) : (
//                     <>
//                       {confirmAction === 'verifie' ? (
//                         <><ShieldCheck className="w-4 h-4" /> Confirmer</>
//                       ) : (
//                         <><ShieldX className="w-4 h-4" /> Confirmer</>
//                       )}
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

'use client'
import { getDocumentsByUserId, updateDocumentStatus } from '@/actions/documents'
import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  User, Search, Check, X, AlertCircle, Clock, Eye,
  GraduationCap, MapPin, Star, BookOpen, Shield,
  ShieldAlert, ShieldCheck, ShieldX, Filter,
  RotateCcw, ChevronLeft, ChevronRight, Users,
  FileText, Download, FileImage, File as FileIcon,
  CheckCircle, Ban, AlertTriangle, Loader2, RefreshCw,
  ZoomIn, ExternalLink
} from 'lucide-react'

// Types (inchangés)
type Precepteur = {
  id: number
  user_id: string
  commune: string | null
  quartier: string | null
  latitude: number | null
  longitude: number | null
  annees_experience: number
  note_moyenne: number
  diplome: string | null
  etablissement_origine: string | null
  statut_verification: 'en_attente' | 'verifie' | 'rejete'
  disponible: boolean
  created_at: string
  updated_at: string
  user: {
    id: string
    username: string
    email: string
    genre: string
    photo_profil: string | null
    created_at: string
  }
  matieres: {
    matiere_id: number
    matiere: {
      id: number
      nom: string
      niveau: string
    }
  }[]
}

type Document = {
  id: number
  titre: string
  type_document: string
  fichier_url: string
  format_fichier: string
  statut_verification: 'en_attente' | 'verifie' | 'rejete'
  commentaire_verification: string | null
  created_at: string
  user_id: string
}

type Stats = {
  en_attente: number
  verifie: number
  rejete: number
  total: number
}

// Types pour les notifications toast
type ToastType = 'success' | 'error' | 'info' | 'warning'
type Toast = {
  id: string
  message: string
  type: ToastType
}

export default function VerificationPrecepteurs() {
  // États principaux
  const [precepteurs, setPrecepteurs] = useState<Precepteur[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [statutFilter, setStatutFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalForPage, setTotalForPage] = useState(0)
  const [stats, setStats] = useState<Stats>({
    en_attente: 0,
    verifie: 0,
    rejete: 0,
    total: 0
  })
  
  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([])
  
  // Documents
  const [documents, setDocuments] = useState<Document[]>([])
  const [loadingDocuments, setLoadingDocuments] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [showDocumentVerifyModal, setShowDocumentVerifyModal] = useState(false)
  const [verifyDocumentAction, setVerifyDocumentAction] = useState<'verifie' | 'rejete'>('verifie')
  const [verifyDocumentComment, setVerifyDocumentComment] = useState('')
  const [processingDocument, setProcessingDocument] = useState(false)
  const [documentVerificationStep, setDocumentVerificationStep] = useState<'idle' | 'processing' | 'completed'>('idle')
  
  // Modal détails
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedPrecepteur, setSelectedPrecepteur] = useState<Precepteur | null>(null)
  const [activeDetailTab, setActiveDetailTab] = useState<'info' | 'documents'>('info')
  
  // Modal confirmation vérification précepteur
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'verifie' | 'rejete'>('verifie')
  const [confirmComment, setConfirmComment] = useState('')
  const [processing, setProcessing] = useState(false)
  
  // Modal avertissement documents non vérifiés
  const [showWarningModal, setShowWarningModal] = useState(false)

  // Ref pour le timer de simulation de progression
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Cache des matières pour éviter les requêtes répétées
  const matieresCacheRef = useRef<Map<number, any>>(new Map())

  const ITEMS_PER_PAGE = 10

  // Gestion des toasts
  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  // Simulation de progression de chargement
  const startProgressSimulation = useCallback(() => {
    setLoadingProgress(0)
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + Math.random() * 15
      })
    }, 300)
    progressTimerRef.current = interval
    return interval
  }, [])

  const completeProgress = useCallback(() => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current)
    }
    setLoadingProgress(100)
    setTimeout(() => setLoadingProgress(0), 500)
  }, [])

  // Chargement initial des stats
  useEffect(() => {
    loadStats()
  }, [])

  // Chargement des précepteurs avec dépendances
  useEffect(() => {
    loadPrecepteurs()
  }, [statutFilter, page])

  // Nettoyage du timer
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current)
      }
    }
  }, [])

  // Chargement des statistiques (optimisé)
  const loadStats = async () => {
    const { data: allPrecepteurs, error } = await supabase
      .from('precepteurs')
      .select('statut_verification')

    if (!error && allPrecepteurs) {
      const stats = allPrecepteurs.reduce((acc, p) => {
        acc.total++
        return acc
      }, { en_attente: 0, verifie: 0, rejete: 0, total: 0 })
      
      setStats(stats)
    }
  }

  // Chargement des précepteurs (optimisé avec requêtes parallèles)
  const loadPrecepteurs = async () => {
    setLoading(true)
    const progressInterval = startProgressSimulation()

    try {
      // Requête principale avec comptage
      let query = supabase
        .from('precepteurs')
        .select(`
          *,
          user:users!inner(
            id, username, email, genre, photo_profil, created_at
          )
        `, { count: 'exact' })

      if (statutFilter) {
        query = query.eq('statut_verification', statutFilter)
      }

      query = query
        .order('created_at', { ascending: false })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1)

      const { data, error, count } = await query

      if (error) throw error

      const precepteursData = data || []
      
      if (precepteursData.length > 0) {
        // Charger les matières en parallèle
        const precepteurIds = precepteursData.map(p => p.id)
        
        // Vérifier le cache
        const uncachedIds = precepteurIds.filter(id => !matieresCacheRef.current.has(id))
        let newMatieres: any[] = []
        
        if (uncachedIds.length > 0) {
          const { data: matieres } = await supabase
            .from('precepteur_matieres')
            .select(`
              precepteur_id,
              matiere_id,
              matiere:matieres!inner(
                id, nom, niveau
              )
            `)
            .in('precepteur_id', uncachedIds)
          
          if (matieres) {
            // Mettre en cache par précepteur_id
            matieres.forEach(m => {
              const existing = matieresCacheRef.current.get(m.precepteur_id) || []
              existing.push(m)
              matieresCacheRef.current.set(m.precepteur_id, existing)
            })
            newMatieres = matieres
          }
        }

        // Assembler avec les données du cache
        const precepteursWithMatieres = precepteursData.map(p => ({
          ...p,
          matieres: matieresCacheRef.current.get(p.id) || []
        }))

        setPrecepteurs(precepteursWithMatieres)
      } else {
        setPrecepteurs([])
      }

      setTotalForPage(count || 0)
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE))
      
      completeProgress()
      setLoading(false)
    } catch (error) {
      console.error('Error loading precepteurs:', error)
      addToast('Erreur lors du chargement des précepteurs', 'error')
      completeProgress()
      setLoading(false)
    }
  }

  // Chargement des documents (avec cache simple)
  const loadDocuments = async (userId: string) => {
    setLoadingDocuments(true)
    
    try {
      const { documents: docs, error } = await getDocumentsByUserId(userId)
      
      if (error) {
        throw error
      }
      
      // Petit délai pour montrer le chargement (meilleure UX)
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setDocuments(docs || [])
    } catch (error) {
      console.error('Erreur chargement documents:', error)
      addToast('Erreur lors du chargement des documents', 'error')
      setDocuments([])
    }
    
    setLoadingDocuments(false)
  }

  // Vérification de document avec feedback visuel amélioré
  const handleDocumentVerification = async () => {
    if (!selectedDocument) return
    
    setProcessingDocument(true)
    setDocumentVerificationStep('processing')
    
    try {
      // Simuler un délai pour montrer la progression
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const result = await updateDocumentStatus(
        selectedDocument.id,
        verifyDocumentAction,
        verifyDocumentComment || undefined
      )
      
      if (result.success) {
        setDocumentVerificationStep('completed')
        
        addToast(
          verifyDocumentAction === 'verifie' 
            ? `Document "${selectedDocument.titre}" vérifié avec succès` 
            : `Document "${selectedDocument.titre}" rejeté`,
          verifyDocumentAction === 'verifie' ? 'success' : 'warning'
        )
        
        // Délai pour montrer l'état "completed"
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setShowDocumentVerifyModal(false)
        setSelectedDocument(null)
        setVerifyDocumentComment('')
        setDocumentVerificationStep('idle')
        
        // Recharger les documents
        if (selectedPrecepteur) {
          await loadDocuments(selectedPrecepteur.user_id)
        }
        await loadStats()
      } else {
        throw new Error(result.error || 'Erreur lors de la vérification')
      }
    } catch (error: any) {
      addToast(error.message || 'Erreur lors de la vérification', 'error')
      setDocumentVerificationStep('idle')
    }
    
    setProcessingDocument(false)
  }

  // Vérification des documents
  const areAllDocumentsVerified = (docs: Document[]) => {
    if (docs.length === 0) return false
    return docs.every(doc => doc.statut_verification === 'verifie')
  }

  const getUnverifiedDocuments = (docs: Document[]) => {
    return docs.filter(doc => doc.statut_verification !== 'verifie')
  }

  // Vérification du précepteur
  const handleVerification = async () => {
    if (!selectedPrecepteur) return
    
    const unverifiedDocs = getUnverifiedDocuments(documents)
    
    if (confirmAction === 'verifie' && unverifiedDocs.length > 0) {
      setShowConfirmModal(false)
      setShowWarningModal(true)
      return
    }
    
    await processVerification()
  }

  const processVerification = async () => {
    if (!selectedPrecepteur) return
    
    setProcessing(true)
    
    try {
      // Simuler un délai pour le feedback
      await new Promise(resolve => setTimeout(resolve, 600))
      
      const { error } = await supabase
        .from('precepteurs')
        .update({
          statut_verification: confirmAction,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedPrecepteur.id)

      if (error) throw error

      addToast(
        confirmAction === 'verifie' 
          ? `Le précepteur ${selectedPrecepteur.user.username} est maintenant vérifié` 
          : `Le précepteur ${selectedPrecepteur.user.username} a été rejeté`,
        confirmAction === 'verifie' ? 'success' : 'info'
      )
      
      setShowConfirmModal(false)
      setShowWarningModal(false)
      setShowDetailsModal(false)
      setSelectedPrecepteur(null)
      setConfirmComment('')
      
      await Promise.all([loadStats(), loadPrecepteurs()])
    } catch (error: any) {
      console.error('Error updating verification:', error)
      addToast('Erreur lors de la mise à jour du statut', 'error')
    }
    
    setProcessing(false)
  }

  // Ouvrir les détails avec chargement optimiste
  const openDetails = (precepteur: Precepteur) => {
    setSelectedPrecepteur(precepteur)
    setActiveDetailTab('info')
    setShowDetailsModal(true)
    // Charger les documents immédiatement
    loadDocuments(precepteur.user_id)
  }

  const openConfirmAction = (action: 'verifie' | 'rejete') => {
    if (selectedPrecepteur) {
      // Recharger les documents pour avoir l'état le plus récent
      loadDocuments(selectedPrecepteur.user_id).then(() => {
        setConfirmAction(action)
        setConfirmComment('')
        setShowConfirmModal(true)
      })
    } else {
      setConfirmAction(action)
      setConfirmComment('')
      setShowConfirmModal(true)
    }
  }

  const openDocumentVerify = (document: Document, action: 'verifie' | 'rejete') => {
    setSelectedDocument(document)
    setVerifyDocumentAction(action)
    setVerifyDocumentComment(document.commentaire_verification || '')
    setDocumentVerificationStep('idle')
    setShowDocumentVerifyModal(true)
  }

  // Utilitaires d'affichage (inchangés)
  const getDocumentIcon = (format: string) => {
    if (format?.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />
    if (format?.includes('image')) return <FileImage className="w-8 h-8 text-blue-500" />
    return <FileIcon className="w-8 h-8 text-gray-400" />
  }

  const getDocumentIconSmall = (format: string) => {
    if (format?.includes('pdf')) return <FileText className="w-4 h-4 text-red-500" />
    if (format?.includes('image')) return <FileImage className="w-4 h-4 text-blue-500" />
    return <FileIcon className="w-4 h-4 text-gray-400" />
  }

  const getDocumentStatusBadge = (statut: string) => {
    switch (statut) {
      case 'verifie':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs border border-green-200">
            <CheckCircle className="w-3 h-3" />
            Vérifié
          </span>
        )
      case 'rejete':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs border border-red-200">
            <Ban className="w-3 h-3" />
            Rejeté
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs border border-yellow-200">
            <Clock className="w-3 h-3" />
            En attente
          </span>
        )
    }
  }

  const getDocumentTypeLabel = (type: string) => {
    const types: Record<string, { icon: string; label: string }> = {
      cv: { icon: '📄', label: 'CV' },
      diplome: { icon: '🎓', label: 'Diplôme' },
      certification: { icon: '🏅', label: 'Certification' },
      carte_identite: { icon: '🪪', label: "Carte d'identité" },
      autre: { icon: '📁', label: 'Autre' }
    }
    return types[type] || { icon: '📄', label: type }
  }

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'verifie':
        return {
          icon: <ShieldCheck className="w-4 h-4" />,
          label: 'Vérifié',
          className: 'bg-green-100 text-green-700 border-green-200'
        }
      case 'rejete':
        return {
          icon: <ShieldX className="w-4 h-4" />,
          label: 'Rejeté',
          className: 'bg-red-100 text-red-700 border-red-200'
        }
      case 'en_attente':
      default:
        return {
          icon: <ShieldAlert className="w-4 h-4" />,
          label: 'En attente',
          className: 'bg-yellow-100 text-yellow-700 border-yellow-200'
        }
    }
  }

  // Filtrage par recherche (optimisé avec useMemo implicite)
  const filteredPrecepteurs = precepteurs.filter(precepteur => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      precepteur.user?.username?.toLowerCase().includes(searchLower) ||
      precepteur.user?.email?.toLowerCase().includes(searchLower) ||
      precepteur.commune?.toLowerCase().includes(searchLower) ||
      precepteur.diplome?.toLowerCase().includes(searchLower) ||
      precepteur.matieres?.some(m => 
        m.matiere?.nom?.toLowerCase().includes(searchLower)
      )
    )
  })

  // Composant Toast
  const ToastContainer = () => {
    if (toasts.length === 0) return null
    
    return (
      <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-sm">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg border flex items-start gap-3 animate-slide-in ${
              toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
              toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
              toast.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
              'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
            {toast.type === 'info' && <Loader2 className="w-5 h-5 flex-shrink-0 animate-spin" />}
            <p className="text-sm flex-1">{toast.message}</p>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    )
  }

  // Skeleton de chargement amélioré
  const LoadingSkeleton = () => (
    <div className="p-8 space-y-4">
      {/* Barre de progression */}
      {loadingProgress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
          <div 
            className="bg-black h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
      )}
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="animate-pulse flex gap-4 p-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-3 bg-gray-200 rounded w-1/4" />
            <div className="flex gap-2">
              <div className="h-5 bg-gray-200 rounded-full w-20" />
              <div className="h-5 bg-gray-200 rounded-full w-16" />
              <div className="h-5 bg-gray-200 rounded-full w-24" />
            </div>
          </div>
          <div className="w-20 h-8 bg-gray-200 rounded-lg flex-shrink-0" />
        </div>
      ))}
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Toast Container */}
      <ToastContainer />

      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="w-6 h-6" /> Vérification des précepteurs
        </h1>
        <p className="text-gray-600 mt-1">
          Vérifiez les documents puis validez les précepteurs inscrits sur la plateforme
        </p>
      </div>

      {/* Stats - Cliquables pour filtrer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { key: 'en_attente', icon: ShieldAlert, color: 'yellow', label: 'En attente', value: stats.en_attente },
          { key: 'verifie', icon: ShieldCheck, color: 'green', label: 'Vérifiés', value: stats.verifie },
          { key: 'rejete', icon: ShieldX, color: 'red', label: 'Rejetés', value: stats.rejete },
          { key: '', icon: Users, color: 'blue', label: 'Total', value: stats.total }
        ].map(stat => (
          <button
            key={stat.key}
            onClick={() => { 
              setStatutFilter(statutFilter === stat.key ? '' : stat.key)
              setPage(1)
            }}
            className={`p-4 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md ${
              statutFilter === stat.key 
                ? `bg-${stat.color}-100 border-${stat.color}-400 shadow-sm` 
                : `bg-${stat.color}-50 border-${stat.color}-100 hover:bg-${stat.color}-100 hover:border-${stat.color}-300`
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-full bg-${stat.color}-200 flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 text-${stat.color}-700`} />
              </div>
              <span className={`text-sm font-medium text-${stat.color}-800`}>{stat.label}</span>
            </div>
            <p className={`text-3xl font-bold text-${stat.color}-900`}>{stat.value}</p>
          </button>
        ))}
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, commune, matière..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm transition-all"
            />
          </div>
          <select
            value={statutFilter}
            onChange={(e) => { setStatutFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm bg-white"
          >
            <option value="">Tous les statuts</option>
            <option value="en_attente">En attente ({stats.en_attente})</option>
            <option value="verifie">Vérifié ({stats.verifie})</option>
            <option value="rejete">Rejeté ({stats.rejete})</option>
          </select>
          {(searchTerm || statutFilter) && (
            <button
              onClick={() => { setSearchTerm(''); setStatutFilter(''); setPage(1); }}
              className="px-4 py-2.5 text-sm text-gray-600 hover:text-black flex items-center gap-1 whitespace-nowrap transition-colors hover:bg-gray-100 rounded-lg"
            >
              <RotateCcw className="w-3 h-3" /> Réinitialiser
            </button>
          )}
          <button
            onClick={() => loadPrecepteurs()}
            className="px-3 py-2.5 text-sm text-gray-600 hover:text-black flex items-center gap-1 transition-colors hover:bg-gray-100 rounded-lg"
            title="Actualiser"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Résumé des résultats */}
      <div className="mb-4 text-sm text-gray-600 flex items-center gap-2">
        <Users className="w-4 h-4" />
        {statutFilter ? (
          <span>
            <strong>{totalForPage}</strong> précepteur{totalForPage > 1 ? 's' : ''} 
            <span className="mx-1">avec le statut</span>
            <span className="font-medium capitalize">{statutFilter.replace('_', ' ')}</span>
            {searchTerm && <span className="ml-1">(filtré par recherche)</span>}
          </span>
        ) : (
          <span>
            <strong>{totalForPage}</strong> précepteur{totalForPage > 1 ? 's' : ''} au total
            {searchTerm && <span className="ml-1">(filtré par recherche)</span>}
          </span>
        )}
      </div>

      {/* Liste des précepteurs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <LoadingSkeleton />
        ) : filteredPrecepteurs.length === 0 ? (
          <div className="p-12 text-center">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">Aucun précepteur trouvé</p>
            <p className="text-gray-400 text-sm">
              {searchTerm || statutFilter 
                ? 'Essayez de modifier vos critères de recherche' 
                : 'Aucun précepteur à afficher'}
            </p>
            {(searchTerm || statutFilter) && (
              <button
                onClick={() => { setSearchTerm(''); setStatutFilter(''); setPage(1); }}
                className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100">
              {filteredPrecepteurs.map((precepteur) => {
                const statut = getStatutBadge(precepteur.statut_verification)
                return (
                  <div 
                    key={precepteur.id} 
                    className="p-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer group"
                    onClick={() => openDetails(precepteur)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {precepteur.user?.photo_profil ? (
                          <img src={precepteur.user.photo_profil} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-900 truncate group-hover:text-black transition-colors">
                                {precepteur.user?.username || 'Anonyme'}
                              </h3>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${statut.className}`}>
                                {statut.icon}
                                {statut.label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-0.5">{precepteur.user?.email}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                openDetails(precepteur)
                              }}
                              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
                            >
                              <Eye className="w-3 h-3" /> Détails
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {precepteur.commune && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {precepteur.commune}
                              {precepteur.quartier && `, ${precepteur.quartier}`}
                            </span>
                          )}
                          <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {precepteur.annees_experience} an{precepteur.annees_experience > 1 ? 's' : ''}
                          </span>
                          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3" /> {precepteur.note_moyenne?.toFixed(1) || '0.0'}/5
                          </span>
                          {precepteur.matieres && precepteur.matieres.length > 0 && (
                            <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <BookOpen className="w-3 h-3" /> {precepteur.matieres.length} matière{precepteur.matieres.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-400 mt-2">
                          Inscrit le {new Date(precepteur.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 p-4 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-white transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Précédent
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                    .map((p, index, array) => (
                      <span key={p} className="flex items-center">
                        {index > 0 && array[index - 1] !== p - 1 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                            page === p
                              ? 'bg-black text-white shadow-sm'
                              : 'border border-gray-300 hover:bg-white hover:border-gray-400'
                          }`}
                        >
                          {p}
                        </button>
                      </span>
                    ))}
                </div>
                
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-white transition-colors flex items-center gap-1"
                >
                  Suivant <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ==================== MODALS ==================== */}

      {/* MODAL 1 - Détails du précepteur avec onglets */}
      {showDetailsModal && selectedPrecepteur && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowDetailsModal(false)}
          ></div>

          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-xl max-w-3xl w-full border border-gray-200 shadow-xl animate-modal-in">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <User className="w-5 h-5" /> Détails du précepteur
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="px-6 pt-4 border-b border-gray-200">
                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveDetailTab('info')}
                    className={`pb-3 px-1 text-sm font-medium transition-all border-b-2 ${
                      activeDetailTab === 'info'
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Informations
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveDetailTab('documents')}
                    className={`pb-3 px-1 text-sm font-medium transition-all border-b-2 ${
                      activeDetailTab === 'documents'
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Documents
                      {!loadingDocuments && documents.length > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-xs transition-colors ${
                          areAllDocumentsVerified(documents)
                            ? 'bg-green-100 text-green-700'
                            : getUnverifiedDocuments(documents).length > 0
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-200 text-gray-600'
                        }`}>
                          {documents.length}
                        </span>
                      )}
                      {loadingDocuments && (
                        <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
                      )}
                    </span>
                  </button>
                </div>
              </div>

              {/* Corps */}
              <div className="p-6">
                {activeDetailTab === 'info' ? (
                  /* Onglet Informations */
                  <div className="space-y-6 max-h-[55vh] overflow-y-auto custom-scrollbar">
                    {/* En-tête profil */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      {selectedPrecepteur.user?.photo_profil ? (
                        <img src={selectedPrecepteur.user.photo_profil} alt="" className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-sm" />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center ring-4 ring-white shadow-sm">
                          <User className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold">{selectedPrecepteur.user?.username}</h3>
                        <p className="text-gray-600">{selectedPrecepteur.user?.email}</p>
                        <p className="text-sm text-gray-500">
                          Genre: {selectedPrecepteur.user?.genre === 'M' ? 'Masculin' : 'Féminin'}
                        </p>
                      </div>
                    </div>

                    {/* Infos générales */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: MapPin, label: 'Localisation', value: [selectedPrecepteur.commune, selectedPrecepteur.quartier].filter(Boolean).join(', ') || 'Non spécifié' },
                        { icon: Clock, label: 'Expérience', value: `${selectedPrecepteur.annees_experience} an${selectedPrecepteur.annees_experience > 1 ? 's' : ''}` },
                        { icon: GraduationCap, label: 'Diplôme', value: selectedPrecepteur.diplome || 'Non spécifié' },
                        { icon: GraduationCap, label: 'Établissement', value: selectedPrecepteur.etablissement_origine || 'Non spécifié' },
                        { icon: Star, label: 'Note', value: `${selectedPrecepteur.note_moyenne?.toFixed(1) || '0.0'}/5` },
                        { icon: Shield, label: 'Statut', value: selectedPrecepteur.statut_verification.replace('_', ' ') }
                      ].map((item, i) => (
                        <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                            <item.icon className="w-3 h-3" /> {item.label}
                          </p>
                          <p className="font-medium text-sm capitalize">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Matières */}
                    {selectedPrecepteur.matieres && selectedPrecepteur.matieres.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" /> Matières enseignées ({selectedPrecepteur.matieres.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedPrecepteur.matieres.map((m) => (
                            <span key={m.matiere_id} className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors">
                              {m.matiere?.nom} ({m.matiere?.niveau})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Résumé des documents */}
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Résumé des documents
                      </h4>
                      {loadingDocuments ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                        </div>
                      ) : documents.length === 0 ? (
                        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <p className="text-sm text-yellow-700 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Aucun document soumis
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: 'Total', value: documents.length, color: 'gray' },
                            { label: 'Vérifiés', value: documents.filter(d => d.statut_verification === 'verifie').length, color: 'green' },
                            { label: 'En attente', value: documents.filter(d => d.statut_verification === 'en_attente').length, color: 'yellow' },
                            { label: 'Rejetés', value: documents.filter(d => d.statut_verification === 'rejete').length, color: 'red' }
                          ].map((stat, i) => (
                            <div key={i} className={`p-3 bg-${stat.color}-50 rounded-lg border border-${stat.color}-100`}>
                              <p className="text-xs text-gray-500">{stat.label}</p>
                              <p className={`text-lg font-bold text-${stat.color}-700`}>{stat.value}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {!loadingDocuments && documents.length > 0 && !areAllDocumentsVerified(documents) && (
                        <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <p className="text-xs text-yellow-700 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Tous les documents doivent être vérifiés avant de pouvoir vérifier le précepteur.
                          </p>
                        </div>
                      )}
                      {!loadingDocuments && areAllDocumentsVerified(documents) && documents.length > 0 && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-xs text-green-700 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Tous les documents sont vérifiés. Le précepteur peut être validé.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Onglet Documents */
                  <div className="max-h-[55vh] overflow-y-auto custom-scrollbar">
                    {loadingDocuments ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="animate-pulse flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-gray-200 rounded" />
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-1/2" />
                              <div className="h-3 bg-gray-200 rounded w-1/3" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : documents.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg mb-2">Aucun document soumis</p>
                        <p className="text-gray-400 text-sm">Ce précepteur n'a pas encore téléchargé de documents</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {documents.map((doc) => {
                          const typeInfo = getDocumentTypeLabel(doc.type_document)
                          return (
                            <div 
                              key={doc.id}
                              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group"
                            >
                              <div className="flex-shrink-0">
                                {getDocumentIcon(doc.format_fichier)}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-medium text-sm text-gray-900 truncate">
                                    {doc.titre}
                                  </p>
                                  {getDocumentStatusBadge(doc.statut_verification)}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span>{typeInfo.icon} {typeInfo.label}</span>
                                  <span>•</span>
                                  <span>{doc.format_fichier?.toUpperCase()}</span>
                                  <span>•</span>
                                  <span>
                                    {new Date(doc.created_at).toLocaleDateString('fr-FR', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric'
                                    })}
                                  </span>
                                </div>
                                {doc.commentaire_verification && (
                                  <p className="text-xs text-gray-500 mt-1 italic">
                                    "{doc.commentaire_verification}"
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <a
                                  href={doc.fichier_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                  title="Voir le document"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>

                                {doc.statut_verification === 'en_attente' && (
                                  <>
                                    <button
                                      onClick={() => openDocumentVerify(doc, 'verifie')}
                                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                      title="Valider le document"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => openDocumentVerify(doc, 'rejete')}
                                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                      title="Rejeter le document"
                                    >
                                      <Ban className="w-4 h-4" />
                                    </button>
                                  </>
                                )}

                                {doc.statut_verification !== 'en_attente' && (
                                  <button
                                    onClick={() => openDocumentVerify(doc, doc.statut_verification === 'verifie' ? 'rejete' : 'verifie')}
                                    className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                                    title="Modifier la vérification"
                                  >
                                    <RotateCcw className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl flex gap-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
                >
                  Fermer
                </button>
                
                {selectedPrecepteur.statut_verification === 'en_attente' && !loadingDocuments && !areAllDocumentsVerified(documents) && documents.length > 0 && (
                  <button
                    onClick={() => setActiveDetailTab('documents')}
                    className="flex-1 px-4 py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Vérifier les documents d'abord
                  </button>
                )}

                {selectedPrecepteur.statut_verification !== 'verifie' && !loadingDocuments && areAllDocumentsVerified(documents) && documents.length > 0 && (
                  <button
                    onClick={() => openConfirmAction('verifie')}
                    className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" /> Vérifier le précepteur
                  </button>
                )}
                
                {selectedPrecepteur.statut_verification !== 'rejete' && (
                  <button
                    onClick={() => openConfirmAction('rejete')}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShieldX className="w-4 h-4" /> Rejeter le précepteur
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2 - Confirmation vérification/rejet précepteur */}
      {showConfirmModal && selectedPrecepteur && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => !processing && setShowConfirmModal(false)}
          ></div>

          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-xl max-w-md w-full p-6 border border-gray-200 shadow-xl animate-modal-in">
              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 ${
                  confirmAction === 'verifie' 
                    ? 'bg-green-100 border-green-300' 
                    : 'bg-red-100 border-red-300'
                }`}>
                  {confirmAction === 'verifie' ? (
                    <ShieldCheck className="w-8 h-8 text-green-600" />
                  ) : (
                    <ShieldX className="w-8 h-8 text-red-600" />
                  )}
                </div>
                <h2 className="text-xl font-bold">
                  {confirmAction === 'verifie' ? 'Vérifier ce précepteur' : 'Rejeter ce précepteur'}
                </h2>
                <p className="text-gray-600 mt-2">
                  {confirmAction === 'verifie'
                    ? 'Ce précepteur pourra apparaître dans les résultats de recherche et proposer ses services.'
                    : 'Ce précepteur ne pourra plus proposer ses services. Cette action peut être annulée.'}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">{selectedPrecepteur?.user?.username}</p>
                    <p className="text-sm text-gray-600">{selectedPrecepteur?.user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commentaire (optionnel)
                </label>
                <textarea
                  value={confirmComment}
                  onChange={(e) => setConfirmComment(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm resize-none"
                  placeholder={
                    confirmAction === 'verifie'
                      ? 'Ex: Félicitations, votre profil a été vérifié avec succès...'
                      : 'Ex: Votre profil n\'a pas été validé car...'
                  }
                  disabled={processing}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={processing}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleVerification}
                  disabled={processing}
                  className={`flex-1 px-4 py-2.5 text-white rounded-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2 ${
                    confirmAction === 'verifie'
                      ? 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                      : 'bg-red-600 hover:bg-red-700 active:bg-red-800'
                  }`}
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      {confirmAction === 'verifie' ? (
                        <><ShieldCheck className="w-4 h-4" /> Confirmer</>
                      ) : (
                        <><ShieldX className="w-4 h-4" /> Confirmer</>
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3 - Avertissement documents non vérifiés */}
      {showWarningModal && selectedPrecepteur && (
        <div className="fixed inset-0 z-[70] overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowWarningModal(false)}
          ></div>

          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-xl max-w-md w-full p-6 border border-gray-200 shadow-xl animate-modal-in">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-yellow-100 border-2 border-yellow-300 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-yellow-600" />
                </div>
                <h2 className="text-xl font-bold">Documents non vérifiés</h2>
                <p className="text-gray-600 mt-2">
                  Vous ne pouvez pas vérifier ce précepteur car tous ses documents n'ont pas encore été vérifiés.
                </p>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Documents en attente ({getUnverifiedDocuments(documents).length})
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                  {getUnverifiedDocuments(documents).map((doc) => (
                    <div key={doc.id} className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                      {getDocumentIconSmall(doc.format_fichier)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.titre}</p>
                        <p className="text-xs text-gray-500">
                          {getDocumentTypeLabel(doc.type_document).label} • {doc.statut_verification === 'en_attente' ? 'En attente' : 'Rejeté'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowWarningModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    setShowWarningModal(false)
                    setActiveDetailTab('documents')
                  }}
                  className="flex-1 px-4 py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Vérifier les documents
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4 - Vérification d'un document (avec feedback de progression) */}
      {showDocumentVerifyModal && selectedDocument && (
        <div className="fixed inset-0 z-[80] overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => !processingDocument && setShowDocumentVerifyModal(false)}
          ></div>

          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-xl max-w-md w-full p-6 border border-gray-200 shadow-xl animate-modal-in">
              {/* Étape de complétion */}
              {documentVerificationStep === 'completed' ? (
                <div className="text-center py-8">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 ${
                    verifyDocumentAction === 'verifie' 
                      ? 'bg-green-100 border-green-300' 
                      : 'bg-red-100 border-red-300'
                  }`}>
                    {verifyDocumentAction === 'verifie' ? (
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    ) : (
                      <Ban className="w-10 h-10 text-red-600" />
                    )}
                  </div>
                  <h2 className="text-xl font-bold mb-2">
                    {verifyDocumentAction === 'verifie' ? 'Document vérifié !' : 'Document rejeté'}
                  </h2>
                  <p className="text-gray-600">
                    {verifyDocumentAction === 'verifie' 
                      ? 'Le document a été validé avec succès.' 
                      : 'Le document a été rejeté.'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 ${
                      verifyDocumentAction === 'verifie' 
                        ? 'bg-green-100 border-green-300' 
                        : 'bg-red-100 border-red-300'
                    }`}>
                      {processingDocument ? (
                        <Loader2 className={`w-8 h-8 animate-spin ${verifyDocumentAction === 'verifie' ? 'text-green-600' : 'text-red-600'}`} />
                      ) : verifyDocumentAction === 'verifie' ? (
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      ) : (
                        <Ban className="w-8 h-8 text-red-600" />
                      )}
                    </div>
                    <h2 className="text-xl font-bold">
                      {verifyDocumentAction === 'verifie' ? 'Valider ce document' : 'Rejeter ce document'}
                    </h2>
                    <p className="text-gray-600 mt-2">
                      {verifyDocumentAction === 'verifie'
                        ? 'Ce document sera marqué comme vérifié.'
                        : 'Ce document sera marqué comme rejeté. Le précepteur pourra en soumettre un nouveau.'}
                    </p>
                  </div>

                  {/* Aperçu du document */}
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 mb-4">
                    <div className="flex items-center gap-3">
                      {getDocumentIcon(selectedDocument.format_fichier)}
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{selectedDocument.titre}</p>
                        <p className="text-xs text-gray-500">
                          {getDocumentTypeLabel(selectedDocument.type_document).label} • {selectedDocument.format_fichier?.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <a
                      href={selectedDocument.fichier_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" /> Voir le document
                    </a>
                  </div>

                  {/* Commentaire */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Commentaire (optionnel)
                    </label>
                    <textarea
                      value={verifyDocumentComment}
                      onChange={(e) => setVerifyDocumentComment(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm resize-none"
                      placeholder={
                        verifyDocumentAction === 'verifie'
                          ? 'Ex: Document valide et conforme...'
                          : 'Ex: Document illisible, veuillez en soumettre un nouveau...'
                      }
                      disabled={processingDocument}
                    />
                  </div>

                  {/* Barre de progression pendant le traitement */}
                  {processingDocument && (
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-black h-1.5 rounded-full animate-progress-bar" />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDocumentVerifyModal(false)}
                      disabled={processingDocument}
                      className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleDocumentVerification}
                      disabled={processingDocument}
                      className={`flex-1 px-4 py-2.5 text-white rounded-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2 ${
                        verifyDocumentAction === 'verifie'
                          ? 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                          : 'bg-red-600 hover:bg-red-700 active:bg-red-800'
                      }`}
                    >
                      {processingDocument ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Traitement...
                        </>
                      ) : (
                        <>
                          {verifyDocumentAction === 'verifie' ? (
                            <><CheckCircle className="w-4 h-4" /> Valider</>
                          ) : (
                            <><Ban className="w-4 h-4" /> Rejeter</>
                          )}
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Styles globaux pour les animations */}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes modalIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes progressBar {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-modal-in {
          animation: modalIn 0.2s ease-out;
        }
        
        .animate-progress-bar {
          animation: progressBar 1.5s ease-in-out infinite;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </div>
  )
}