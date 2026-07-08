
// 'use client'

// import { useState, useEffect, useCallback, useMemo, JSX } from 'react'
// import { supabase } from '@/lib/supabase'
// import { getDocumentsByUserId, updateDocumentStatus } from '@/actions/documents'
// import {
//   User, Search, Check, X, Clock, Eye,
//   GraduationCap, MapPin, Star, BookOpen, Shield,
//   ShieldAlert, ShieldCheck, ShieldX,
//   RotateCcw, ChevronLeft, ChevronRight, Users,
//   FileText, FileImage, File as FileIcon,
//   CheckCircle, Ban, AlertTriangle, Loader2, RefreshCw,
//   ExternalLink
// } from 'lucide-react'

// // Types
// type Precepteur = {
//   id: number
//   user_id: string
//   commune: string | null
//   quartier: string | null
//   annees_experience: number
//   note_moyenne: number
//   diplome: string | null
//   etablissement_origine: string | null
//   statut_verification: 'en_attente' | 'verifie' | 'rejete'
//   created_at: string
//   user: {
//     id: string
//     username: string
//     email: string
//     genre: string
//     photo_profil: string | null
//   }
//   matieres: {
//     matiere_id: number
//     matiere: { id: number; nom: string; niveau: string }
//   }[]
// }

// type Document = {
//   id: number
//   titre: string
//   type_document: string
//   fichier_url: string
//   format_fichier: string
//   statut_verification: 'en_attente' | 'verifie' | 'rejete'
//   commentaire_verification: string | null
//   created_at: string
//   user_id: string
// }

// const ITEMS_PER_PAGE = 10

// // Cache global (survit aux re-rendus et changements de page)
// let GLOBAL_CACHE: {
//   allPrecepteurs: Precepteur[]
//   stats: { en_attente: number; verifie: number; rejete: number; total: number }
//   timestamp: number
// } | null = null

// const CACHE_DURATION = 60000 // 1 minute

// export default function VerificationPrecepteurs() {
//   // États essentiels uniquement
//   const [allPrecepteurs, setAllPrecepteurs] = useState<Precepteur[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [statutFilter, setStatutFilter] = useState('')
//   const [page, setPage] = useState(1)
//   const [stats, setStats] = useState({ en_attente: 0, verifie: 0, rejete: 0, total: 0 })
//   const [message, setMessage] = useState('')
  
//   // Modals
//   const [selectedPrecepteur, setSelectedPrecepteur] = useState<Precepteur | null>(null)
//   const [modalType, setModalType] = useState<'detail' | 'verify' | 'reject' | 'docVerify' | null>(null)
//   const [processing, setProcessing] = useState(false)
//   const [confirmComment, setConfirmComment] = useState('')
  
//   // Documents
//   const [documents, setDocuments] = useState<Document[]>([])
//   const [loadingDocs, setLoadingDocs] = useState(false)
//   const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
//   const [docAction, setDocAction] = useState<'verifie' | 'rejete'>('verifie')
//   const [docComment, setDocComment] = useState('')

//   // Toast auto-disparition
//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => setMessage(''), 3000)
//       return () => clearTimeout(timer)
//     }
//   }, [message])

//   // ⚡ Chargement unique avec cache
//   const loadAllData = useCallback(async (forceRefresh = false) => {
//     // Vérifier le cache
//     if (!forceRefresh && GLOBAL_CACHE && (Date.now() - GLOBAL_CACHE.timestamp) < CACHE_DURATION) {
//       setAllPrecepteurs(GLOBAL_CACHE.allPrecepteurs)
//       setStats(GLOBAL_CACHE.stats)
//       setLoading(false)
//       return
//     }

//     setLoading(true)
//     const startTime = performance.now()

//     try {
//       // ⚡ UNE SEULE REQUÊTE avec toutes les jointures
//       const { data, error } = await supabase
//         .from('precepteurs')
//         .select(`
//           id, user_id, commune, quartier, annees_experience, note_moyenne,
//           diplome, etablissement_origine, statut_verification, created_at,
//           user:users!inner(id, username, email, genre, photo_profil),
//           precepteur_matieres(
//             matiere_id, 
//             matiere:matieres(id, nom, niveau)
//           )
//         `)
//         .order('created_at', { ascending: false })

//       if (error) throw error

//       // Transformer les données
//       const all: Precepteur[] = (data || []).map((p: any) => ({
//         ...p,
//         matieres: p.precepteur_matieres || [],
//         precepteur_matieres: undefined // Nettoyer
//       }))

//       // Calculer les stats
//       const counts = { en_attente: 0, verifie: 0, rejete: 0, total: all.length }
//       all.forEach(p => {
//         if (p.statut_verification === 'en_attente') counts.en_attente++
//         else if (p.statut_verification === 'verifie') counts.verifie++
//         else counts.rejete++
//       })

//       // Mettre en cache
//       GLOBAL_CACHE = {
//         allPrecepteurs: all,
//         stats: counts,
//         timestamp: Date.now()
//       }

//       setAllPrecepteurs(all)
//       setStats(counts)
      
//       console.log(`⚡ Chargement: ${(performance.now() - startTime).toFixed(0)}ms pour ${all.length} précepteurs`)
//     } catch (error) {
//       console.error('Erreur chargement:', error)
//       setMessage('❌ Erreur lors du chargement')
//     }
//     setLoading(false)
//   }, [])

//   // Chargement initial
//   useEffect(() => {
//     loadAllData()
//   }, [loadAllData])

//   // Invalider le cache
//   const invalidateCache = useCallback(() => {
//     GLOBAL_CACHE = null
//     loadAllData(true)
//   }, [loadAllData])

//   // ⚡ Filtrage + pagination côté client (instantané)
//   const { paginatedPrecepteurs, totalFiltered } = useMemo(() => {
//     let filtered = allPrecepteurs
    
//     // Filtre statut
//     if (statutFilter) {
//       filtered = allPrecepteurs.filter(p => p.statut_verification === statutFilter)
//     }
    
//     // Filtre recherche
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase()
//       filtered = filtered.filter(p =>
//         p.user?.username?.toLowerCase().includes(term) ||
//         p.user?.email?.toLowerCase().includes(term) ||
//         p.commune?.toLowerCase().includes(term) ||
//         p.diplome?.toLowerCase().includes(term) ||
//         p.matieres?.some(m => m.matiere?.nom?.toLowerCase().includes(term))
//       )
//     }

//     // Pagination
//     const start = (page - 1) * ITEMS_PER_PAGE
//     return {
//       paginatedPrecepteurs: filtered.slice(start, start + ITEMS_PER_PAGE),
//       totalFiltered: filtered.length
//     }
//   }, [allPrecepteurs, statutFilter, searchTerm, page])

//   const totalPages = Math.ceil(totalFiltered / ITEMS_PER_PAGE)

//   // Reset page quand filtre change
//   useEffect(() => {
//     setPage(1)
//   }, [statutFilter, searchTerm])

//   // Chargement documents (quand on ouvre les détails)
//   const loadDocuments = async (userId: string) => {
//     setLoadingDocs(true)
//     try {
//       const { documents: docs, error } = await getDocumentsByUserId(userId)
//       if (!error) setDocuments(docs || [])
//     } catch (e) {
//       console.error(e)
//     }
//     setLoadingDocs(false)
//   }

//   // Actions
//   const handleVerification = async (action: 'verifie' | 'rejete') => {
//     if (!selectedPrecepteur) return
//     setProcessing(true)
//     try {
//       const { error } = await supabase
//         .from('precepteurs')
//         .update({ statut_verification: action, updated_at: new Date().toISOString() })
//         .eq('id', selectedPrecepteur.id)
//       if (error) throw error

//       setMessage(`✅ Précepteur ${action === 'verifie' ? 'vérifié' : 'rejeté'}`)
//       closeAllModals()
//       invalidateCache() // Recharger depuis le serveur
//     } catch (e: any) {
//       setMessage('❌ ' + (e.message || 'Erreur'))
//     }
//     setProcessing(false)
//   }

//   const handleDocVerification = async () => {
//     if (!selectedDoc) return
//     setProcessing(true)
//     try {
//       const result = await updateDocumentStatus(selectedDoc.id, docAction, docComment || undefined)
//       if (!result.success) throw new Error(result.error || 'Erreur lors de la mise à jour du document')
      
//       setMessage(`✅ Document ${docAction === 'verifie' ? 'vérifié' : 'rejeté'}`)
//       setModalType('detail')
//       if (selectedPrecepteur) await loadDocuments(selectedPrecepteur.user_id)
//       invalidateCache()
//     } catch (e: any) {
//       setMessage('❌ ' + (e.message || 'Erreur'))
//     }
//     setProcessing(false)
//   }

//   const openDetails = (p: Precepteur) => {
//     setSelectedPrecepteur(p)
//     setModalType('detail')
//     loadDocuments(p.user_id)
//   }

//   const openDocVerify = (doc: Document, action: 'verifie' | 'rejete') => {
//     setSelectedDoc(doc)
//     setDocAction(action)
//     setDocComment(doc.commentaire_verification || '')
//     setModalType('docVerify')
//   }

//   const closeAllModals = () => {
//     setModalType(null)
//     setSelectedPrecepteur(null)
//     setSelectedDoc(null)
//     setConfirmComment('')
//   }

//   // Helpers visuels
//   const getStatutBadge = (statut: string) => {
//     const configs: Record<string, { bg: string; text: string; border: string; icon: JSX.Element }> = {
//       verifie: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: <ShieldCheck className="w-3 h-3" /> },
//       rejete: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: <ShieldX className="w-3 h-3" /> },
//       en_attente: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: <ShieldAlert className="w-3 h-3" /> }
//     }
//     const c = configs[statut] || configs.en_attente
//     return (
//       <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}>
//         {c.icon}
//         {statut.replace('_', ' ')}
//       </span>
//     )
//   }

//   const getDocIcon = (format: string, size: 'sm' | 'md' = 'md') => {
//     const cls = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
//     if (format?.includes('pdf')) return <FileText className={`${cls} text-red-500`} />
//     if (format?.includes('image')) return <FileImage className={`${cls} text-blue-500`} />
//     return <FileIcon className={`${cls} text-gray-400`} />
//   }

//   const areAllDocsVerified = documents.length > 0 && documents.every(d => d.statut_verification === 'verifie')

//   // Skeleton loading
//   const Skeleton = () => (
//     <div className="divide-y divide-gray-50">
//       {[1, 2, 3, 4, 5].map(i => (
//         <div key={i} className="p-4 animate-pulse flex gap-4">
//           <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
//           <div className="flex-1 space-y-2">
//             <div className="h-4 bg-gray-200 rounded w-1/3" />
//             <div className="h-3 bg-gray-200 rounded w-1/2" />
//             <div className="flex gap-2">
//               <div className="h-5 bg-gray-200 rounded-full w-16" />
//               <div className="h-5 bg-gray-200 rounded-full w-20" />
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   )

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-6">
//       {/* Toast */}
//       {message && (
//         <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-top-2 duration-300 ${
//           message.includes('✅') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
//         }`}>
//           {message}
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl font-bold flex items-center gap-2">
//             <Shield className="w-6 h-6" /> Vérification des précepteurs
//           </h1>
//           <p className="text-sm text-gray-500 mt-0.5">{stats.total} précepteurs au total</p>
//         </div>
//         <button 
//           onClick={invalidateCache} 
//           className="p-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
//           title="Actualiser"
//         >
//           <RefreshCw className="w-4 h-4" />
//         </button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
//         {[
//           { key: 'en_attente', label: 'En attente', value: stats.en_attente, color: 'yellow', icon: ShieldAlert },
//           { key: 'verifie', label: 'Vérifiés', value: stats.verifie, color: 'green', icon: ShieldCheck },
//           { key: 'rejete', label: 'Rejetés', value: stats.rejete, color: 'red', icon: ShieldX },
//           { key: '', label: 'Total', value: stats.total, color: 'blue', icon: Users },
//         ].map(s => (
//           <button
//             key={s.key}
//             onClick={() => setStatutFilter(statutFilter === s.key ? '' : s.key)}
//             className={`bg-${s.color}-50 rounded-xl p-4 text-left hover:shadow-sm transition-all ${statutFilter === s.key ? 'ring-2 ring-black' : ''}`}
//           >
//             <div className="flex items-center gap-2 mb-2">
//               <s.icon className={`w-4 h-4 text-${s.color}-700`} />
//               <span className="text-xs font-medium text-gray-600">{s.label}</span>
//             </div>
//             <p className={`text-2xl font-bold text-${s.color}-900`}>{s.value}</p>
//           </button>
//         ))}
//       </div>

//       {/* Recherche & Filtres */}
//       <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
//         <div className="flex flex-col sm:flex-row gap-3">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Rechercher par nom, email, commune, matière..."
//               value={searchTerm}
//               onChange={e => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
//             />
//           </div>
//           <select
//             value={statutFilter}
//             onChange={e => setStatutFilter(e.target.value)}
//             className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-white"
//           >
//             <option value="">Tous les statuts</option>
//             <option value="en_attente">En attente ({stats.en_attente})</option>
//             <option value="verifie">Vérifié ({stats.verifie})</option>
//             <option value="rejete">Rejeté ({stats.rejete})</option>
//           </select>
//           {(searchTerm || statutFilter) && (
//             <button
//               onClick={() => { setSearchTerm(''); setStatutFilter('') }}
//               className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl flex items-center gap-1.5"
//             >
//               <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Liste */}
//       <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
//         {loading ? (
//           <Skeleton />
//         ) : paginatedPrecepteurs.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-16">
//             <Users className="w-12 h-12 text-gray-300 mb-3" />
//             <p className="text-gray-500 font-medium">Aucun précepteur trouvé</p>
//             <p className="text-gray-400 text-sm mt-1">Essayez de modifier vos filtres</p>
//           </div>
//         ) : (
//           <>
//             <div className="divide-y divide-gray-50">
//               {paginatedPrecepteurs.map(p => (
//                 <div 
//                   key={p.id} 
//                   className="p-4 hover:bg-gray-50/50 transition-colors cursor-pointer flex items-center gap-4"
//                   onClick={() => openDetails(p)}
//                 >
//                   {p.user?.photo_profil ? (
//                     <img src={p.user.photo_profil} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
//                   ) : (
//                     <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
//                       <User className="w-5 h-5 text-gray-400" />
//                     </div>
//                   )}
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-2">
//                       <p className="font-medium text-sm truncate">{p.user?.username || 'Anonyme'}</p>
//                       {getStatutBadge(p.statut_verification)}
//                     </div>
//                     <p className="text-xs text-gray-500 mt-0.5">{p.user?.email}</p>
//                     <div className="flex flex-wrap gap-1.5 mt-1.5">
//                       {p.commune && (
//                         <span className="text-xs text-gray-500 flex items-center gap-1">
//                           <MapPin className="w-3 h-3" />{p.commune}
//                         </span>
//                       )}
//                       <span className="text-xs text-gray-500 flex items-center gap-1">
//                         <Clock className="w-3 h-3" />{p.annees_experience} an(s)
//                       </span>
//                       <span className="text-xs text-gray-500 flex items-center gap-1">
//                         <Star className="w-3 h-3" />{p.note_moyenne?.toFixed(1) || '0'}/5
//                       </span>
//                       {p.matieres?.length > 0 && (
//                         <span className="text-xs text-gray-500 flex items-center gap-1">
//                           <BookOpen className="w-3 h-3" />{p.matieres.length} matière(s)
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                   <Eye className="w-4 h-4 text-gray-300 flex-shrink-0" />
//                 </div>
//               ))}
//             </div>

//             {/* Pagination */}
//             <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
//               <p className="text-sm text-gray-500">
//                 {totalFiltered} résultat{totalFiltered > 1 ? 's' : ''}
//                 {statutFilter && <span> • {statutFilter.replace('_', ' ')}</span>}
//               </p>
//               {totalPages > 1 && (
//                 <div className="flex items-center gap-1">
//                   <button
//                     onClick={() => setPage(p => Math.max(1, p - 1))}
//                     disabled={page === 1}
//                     className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
//                   >
//                     <ChevronLeft className="w-4 h-4" />
//                   </button>
                  
//                   {Array.from({ length: totalPages }, (_, i) => i + 1)
//                     .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
//                     .map((p, i, arr) => (
//                       <span key={p} className="flex items-center">
//                         {i > 0 && arr[i - 1] !== p - 1 && <span className="px-1 text-gray-400">...</span>}
//                         <button
//                           onClick={() => setPage(p)}
//                           className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
//                             page === p ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-700'
//                           }`}
//                         >
//                           {p}
//                         </button>
//                       </span>
//                     ))}
                  
//                   <button
//                     onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//                     disabled={page === totalPages}
//                     className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
//                   >
//                     <ChevronRight className="w-4 h-4" />
//                   </button>
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>

//       {/* ============ MODAL DÉTAILS ============ */}
//       {modalType === 'detail' && selectedPrecepteur && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeAllModals}>
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
//             {/* Header */}
//             <div className="sticky top-0 bg-white border-b p-6 flex items-center gap-4 z-10">
//               {selectedPrecepteur.user?.photo_profil ? (
//                 <img src={selectedPrecepteur.user.photo_profil} alt="" className="w-12 h-12 rounded-xl object-cover" />
//               ) : (
//                 <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
//                   <User className="w-6 h-6 text-gray-400" />
//                 </div>
//               )}
//               <div className="flex-1">
//                 <h2 className="font-bold">{selectedPrecepteur.user?.username}</h2>
//                 <p className="text-sm text-gray-500">{selectedPrecepteur.user?.email}</p>
//               </div>
//               <button onClick={closeAllModals} className="p-2 hover:bg-gray-100 rounded-xl">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Contenu */}
//             <div className="p-6 space-y-4">
//               {getStatutBadge(selectedPrecepteur.statut_verification)}

//               <div className="grid grid-cols-2 gap-3">
//                 <InfoBadge icon={MapPin} label="Localisation" value={[selectedPrecepteur.commune, selectedPrecepteur.quartier].filter(Boolean).join(', ') || 'Non spécifié'} />
//                 <InfoBadge icon={Clock} label="Expérience" value={`${selectedPrecepteur.annees_experience} an(s)`} />
//                 <InfoBadge icon={GraduationCap} label="Diplôme" value={selectedPrecepteur.diplome || 'Non spécifié'} />
//                 <InfoBadge icon={Star} label="Note" value={`${selectedPrecepteur.note_moyenne?.toFixed(1) || '0'}/5`} />
//               </div>

//               {selectedPrecepteur.matieres?.length > 0 && (
//                 <div>
//                   <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
//                     <BookOpen className="w-4 h-4" /> Matières ({selectedPrecepteur.matieres.length})
//                   </h3>
//                   <div className="flex flex-wrap gap-1.5">
//                     {selectedPrecepteur.matieres.map(m => (
//                       <span key={m.matiere_id} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs border border-blue-100">
//                         {m.matiere?.nom} ({m.matiere?.niveau})
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Documents */}
//               <div className="border-t pt-4">
//                 <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//                   <FileText className="w-4 h-4" /> Documents
//                 </h3>
//                 {loadingDocs ? (
//                   <div className="text-center py-4">
//                     <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
//                   </div>
//                 ) : documents.length === 0 ? (
//                   <p className="text-sm text-gray-500 text-center py-4">Aucun document soumis</p>
//                 ) : (
//                   <div className="space-y-2">
//                     {documents.map(doc => (
//                       <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-colors">
//                         {getDocIcon(doc.format_fichier)}
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm font-medium truncate">{doc.titre}</p>
//                           <p className="text-xs text-gray-500">{doc.format_fichier?.toUpperCase()} • {new Date(doc.created_at).toLocaleDateString('fr-FR')}</p>
//                         </div>
//                         <a 
//                           href={doc.fichier_url} 
//                           target="_blank" 
//                           rel="noopener noreferrer" 
//                           className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
//                         >
//                           <ExternalLink className="w-4 h-4" />
//                         </a>
//                         {doc.statut_verification === 'en_attente' ? (
//                           <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
//                             <button
//                               onClick={() => openDocVerify(doc, 'verifie')}
//                               className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
//                               title="Valider"
//                             >
//                               <CheckCircle className="w-4 h-4" />
//                             </button>
//                             <button
//                               onClick={() => openDocVerify(doc, 'rejete')}
//                               className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
//                               title="Rejeter"
//                             >
//                               <Ban className="w-4 h-4" />
//                             </button>
//                           </div>
//                         ) : (
//                           <span className={`text-xs px-2 py-0.5 rounded-full ${
//                             doc.statut_verification === 'verifie' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//                           }`}>
//                             {doc.statut_verification}
//                           </span>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 {!loadingDocs && documents.length > 0 && !areAllDocsVerified && (
//                   <p className="text-xs text-yellow-600 mt-2 flex items-center gap-1">
//                     <AlertTriangle className="w-3 h-3" /> Vérifiez tous les documents avant de valider le précepteur
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="p-6 border-t bg-gray-50/50 rounded-b-2xl flex gap-3">
//               <button onClick={closeAllModals} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-white transition-colors">
//                 Fermer
//               </button>
//               {selectedPrecepteur.statut_verification !== 'verifie' && areAllDocsVerified && (
//                 <button
//                   onClick={() => { setConfirmComment(''); setModalType('verify') }}
//                   className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
//                 >
//                   <ShieldCheck className="w-4 h-4" /> Vérifier
//                 </button>
//               )}
//               {selectedPrecepteur.statut_verification !== 'rejete' && (
//                 <button
//                   onClick={() => { setConfirmComment(''); setModalType('reject') }}
//                   className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
//                 >
//                   <ShieldX className="w-4 h-4" /> Rejeter
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ MODAL CONFIRMATION VÉRIFICATION/REJET ============ */}
//       {(modalType === 'verify' || modalType === 'reject') && selectedPrecepteur && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeAllModals}>
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
//             <div className="text-center">
//               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
//                 modalType === 'verify' ? 'bg-green-100' : 'bg-red-100'
//               }`}>
//                 {modalType === 'verify' ? (
//                   <ShieldCheck className="w-7 h-7 text-green-600" />
//                 ) : (
//                   <ShieldX className="w-7 h-7 text-red-600" />
//                 )}
//               </div>
//               <h3 className="text-lg font-bold mb-1">
//                 {modalType === 'verify' ? 'Vérifier ce précepteur ?' : 'Rejeter ce précepteur ?'}
//               </h3>
//               <p className="text-sm text-gray-500 mb-4">
//                 {selectedPrecepteur.user?.username} • {selectedPrecepteur.user?.email}
//               </p>
//               <textarea
//                 value={confirmComment}
//                 onChange={e => setConfirmComment(e.target.value)}
//                 rows={2}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-black"
//                 placeholder="Commentaire (optionnel)..."
//                 disabled={processing}
//               />
//               <div className="flex gap-2">
//                 <button
//                   onClick={closeAllModals}
//                   disabled={processing}
//                   className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   onClick={() => handleVerification(modalType === 'verify' ? 'verifie' : 'rejete')}
//                   disabled={processing}
//                   className={`flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70 ${
//                     modalType === 'verify' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
//                   }`}
//                 >
//                   {processing ? (
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                   ) : (
//                     <Check className="w-4 h-4" />
//                   )}
//                   Confirmer
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ============ MODAL VÉRIFICATION DOCUMENT ============ */}
//       {modalType === 'docVerify' && selectedDoc && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeAllModals}>
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
//             <div className="text-center">
//               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
//                 docAction === 'verifie' ? 'bg-green-100' : 'bg-red-100'
//               }`}>
//                 {docAction === 'verifie' ? (
//                   <CheckCircle className="w-7 h-7 text-green-600" />
//                 ) : (
//                   <Ban className="w-7 h-7 text-red-600" />
//                 )}
//               </div>
//               <h3 className="text-lg font-bold mb-1">
//                 {docAction === 'verifie' ? 'Valider ce document ?' : 'Rejeter ce document ?'}
//               </h3>
//               <p className="text-sm text-gray-500 mb-2 truncate">{selectedDoc.titre}</p>
//               <a
//                 href={selectedDoc.fichier_url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-sm text-blue-600 hover:underline mb-4 inline-flex items-center gap-1"
//               >
//                 <ExternalLink className="w-3 h-3" /> Voir le document
//               </a>
//               <textarea
//                 value={docComment}
//                 onChange={e => setDocComment(e.target.value)}
//                 rows={2}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-black"
//                 placeholder="Commentaire (optionnel)..."
//                 disabled={processing}
//               />
//               <div className="flex gap-2">
//                 <button
//                   onClick={closeAllModals}
//                   disabled={processing}
//                   className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   onClick={handleDocVerification}
//                   disabled={processing}
//                   className={`flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70 ${
//                     docAction === 'verifie' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
//                   }`}
//                 >
//                   {processing ? (
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                   ) : (
//                     <Check className="w-4 h-4" />
//                   )}
//                   Confirmer
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// // Composant helper
// function InfoBadge({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
//   return (
//     <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
//       <p className="text-xs text-gray-500 flex items-center gap-1 mb-0.5">
//         <Icon className="w-3 h-3" />{label}
//       </p>
//       <p className="font-medium text-sm">{value}</p>
//     </div>
//   )
// }

'use client'

import { useState, useEffect, useCallback, useMemo, memo, JSX } from 'react'
import { supabase } from '@/lib/supabase'
import { getDocumentsByUserId, updateDocumentStatus } from '@/actions/documents'
import {
  User, Search, X, Clock, Eye,
  GraduationCap, MapPin, Star, BookOpen, Shield,
  ShieldAlert, ShieldCheck, ShieldX,
  RotateCcw,Check, ChevronLeft, ChevronRight, Users,
  FileText, FileImage, File as FileIcon,
  CheckCircle, Ban, AlertTriangle, Loader2, RefreshCw,
  ExternalLink
} from 'lucide-react'

// Types
type Precepteur = {
  id: number
  user_id: string
  commune: string | null
  quartier: string | null
  annees_experience: number
  note_moyenne: number
  diplome: string | null
  etablissement_origine: string | null
  statut_verification: 'en_attente' | 'verifie' | 'rejete'
  created_at: string
  user: {
    id: string
    username: string
    email: string
    genre: string
    photo_profil: string | null
  }
  matieres: {
    matiere_id: number
    matiere: { id: number; nom: string; niveau: string }
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

type ModalState = {
  type: 'detail' | 'verify' | 'reject' | 'docVerify' | null
  precepteur: Precepteur | null
  doc: Document | null
  docAction: 'verifie' | 'rejete'
  comment: string
  docComment: string
}

type StatsType = {
  en_attente: number
  verifie: number
  rejete: number
  total: number
}

type StatsSectionProps = {
  stats: StatsType
  statutFilter: string
  onFilterChange: (filter: string) => void
}

type PrecepteurRowProps = {
  precepteur: Precepteur
  onClick: () => void
}

type PaginationProps = {
  page: number
  totalPages: number
  totalFiltered: number
  statutFilter: string
  onPageChange: (page: number) => void
}

type DetailModalProps = {
  precepteur: Precepteur
  documents: Document[]
  loadingDocs: boolean
  areAllDocsVerified: boolean
  onClose: () => void
  onVerify: (precepteur: Precepteur) => void
  onReject: (precepteur: Precepteur) => void
  onDocVerify: (doc: Document, action: 'verifie' | 'rejete') => void
}

type ConfirmModalProps = {
  type: 'verify' | 'reject'
  precepteur: Precepteur
  comment: string
  processing: boolean
  onClose: () => void
  onConfirm: (action: 'verifie' | 'rejete') => void
  onCommentChange: (comment: string) => void
}

type DocVerifyModalProps = {
  doc: Document
  docAction: 'verifie' | 'rejete'
  docComment: string
  processing: boolean
  onClose: () => void
  onConfirm: () => void
  onCommentChange: (comment: string) => void
}

type InfoBadgeProps = {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}

type DocIconProps = {
  format: string
  size?: 'sm' | 'md'
}

type CacheData = {
  precepteurs: Precepteur[]
  stats: StatsType
}

const ITEMS_PER_PAGE = 10

// Cache global optimisé
const CACHE = new Map<string, { data: CacheData; timestamp: number }>()
const CACHE_DURATION = 30000 // 30 secondes pour plus de réactivité

// Composants memoïsés pour éviter les re-rendus
const StatutBadge = memo(({ statut }: { statut: string }) => {
  const configs: Record<string, { bg: string; text: string; border: string; icon: JSX.Element }> = {
    verifie: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: <ShieldCheck className="w-3 h-3" /> },
    rejete: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: <ShieldX className="w-3 h-3" /> },
    en_attente: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: <ShieldAlert className="w-3 h-3" /> }
  }
  const c = configs[statut] || configs.en_attente
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}>
      {c.icon}
      {statut.replace('_', ' ')}
    </span>
  )
})
StatutBadge.displayName = 'StatutBadge'

const DocIcon = memo(({ format, size = 'md' }: DocIconProps) => {
  const cls = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
  if (format?.includes('pdf')) return <FileText className={`${cls} text-red-500`} />
  if (format?.includes('image')) return <FileImage className={`${cls} text-blue-500`} />
  return <FileIcon className={`${cls} text-gray-400`} />
})
DocIcon.displayName = 'DocIcon'

const InfoBadge = memo(({ icon: Icon, label, value }: InfoBadgeProps) => (
  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
    <p className="text-xs text-gray-500 flex items-center gap-1 mb-0.5">
      <Icon className="w-3 h-3" />{label}
    </p>
    <p className="font-medium text-sm">{value}</p>
  </div>
))
InfoBadge.displayName = 'InfoBadge'

const SkeletonLoader = memo(() => (
  <div className="divide-y divide-gray-50">
    {[1, 2, 3, 4, 5].map(i => (
      <div key={i} className="p-4 animate-pulse flex gap-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="flex gap-2">
            <div className="h-5 bg-gray-200 rounded-full w-16" />
            <div className="h-5 bg-gray-200 rounded-full w-20" />
          </div>
        </div>
      </div>
    ))}
  </div>
))
SkeletonLoader.displayName = 'SkeletonLoader'

const EmptyState = memo(() => (
  <div className="flex flex-col items-center justify-center py-16">
    <Users className="w-12 h-12 text-gray-300 mb-3" />
    <p className="text-gray-500 font-medium">Aucun précepteur trouvé</p>
    <p className="text-gray-400 text-sm mt-1">Essayez de modifier vos filtres</p>
  </div>
))
EmptyState.displayName = 'EmptyState'

const StatsSection = memo(({ stats, statutFilter, onFilterChange }: StatsSectionProps) => {
  const items = [
    { key: 'en_attente', label: 'En attente', value: stats.en_attente, color: 'yellow', icon: ShieldAlert },
    { key: 'verifie', label: 'Vérifiés', value: stats.verifie, color: 'green', icon: ShieldCheck },
    { key: 'rejete', label: 'Rejetés', value: stats.rejete, color: 'red', icon: ShieldX },
    { key: '', label: 'Total', value: stats.total, color: 'blue', icon: Users },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {items.map(s => (
        <button
          key={s.key}
          onClick={() => onFilterChange(statutFilter === s.key ? '' : s.key)}
          className={`bg-${s.color}-50 rounded-xl p-4 text-left hover:shadow-sm transition-all ${statutFilter === s.key ? 'ring-2 ring-black' : ''}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <s.icon className={`w-4 h-4 text-${s.color}-700`} />
            <span className="text-xs font-medium text-gray-600">{s.label}</span>
          </div>
          <p className={`text-2xl font-bold text-${s.color}-900`}>{s.value}</p>
        </button>
      ))}
    </div>
  )
})
StatsSection.displayName = 'StatsSection'

const PrecepteurRow = memo(({ precepteur, onClick }: PrecepteurRowProps) => (
  <div 
    className="p-4 hover:bg-gray-50/50 transition-colors cursor-pointer flex items-center gap-4"
    onClick={onClick}
  >
    {precepteur.user?.photo_profil ? (
      <img src={precepteur.user.photo_profil} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" loading="lazy" />
    ) : (
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
        <User className="w-5 h-5 text-gray-400" />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className="font-medium text-sm truncate">{precepteur.user?.username || 'Anonyme'}</p>
        <StatutBadge statut={precepteur.statut_verification} />
      </div>
      <p className="text-xs text-gray-500 mt-0.5">{precepteur.user?.email}</p>
      <div className="flex flex-wrap gap-1.5 mt-1.5">
        {precepteur.commune && (
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin className="w-3 h-3" />{precepteur.commune}
          </span>
        )}
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Clock className="w-3 h-3" />{precepteur.annees_experience} an(s)
        </span>
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Star className="w-3 h-3" />{precepteur.note_moyenne?.toFixed(1) || '0'}/5
        </span>
        {precepteur.matieres?.length > 0 && (
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <BookOpen className="w-3 h-3" />{precepteur.matieres.length} matière(s)
          </span>
        )}
      </div>
    </div>
    <Eye className="w-4 h-4 text-gray-300 flex-shrink-0" />
  </div>
))
PrecepteurRow.displayName = 'PrecepteurRow'

const Pagination = memo(({ page, totalPages, totalFiltered, statutFilter, onPageChange }: PaginationProps) => (
  <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
    <p className="text-sm text-gray-500">
      {totalFiltered} résultat{totalFiltered > 1 ? 's' : ''}
      {statutFilter && <span> • {statutFilter.replace('_', ' ')}</span>}
    </p>
    {totalPages > 1 && (
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        {Array.from({ length: totalPages }, (_: unknown, i: number) => i + 1)
          .filter((p: number) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .map((p: number, i: number, arr: number[]) => (
            <span key={p} className="flex items-center">
              {i > 0 && arr[i - 1] !== p - 1 && <span className="px-1 text-gray-400">...</span>}
              <button
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  page === p ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {p}
              </button>
            </span>
          ))}
        
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    )}
  </div>
))
Pagination.displayName = 'Pagination'

const DetailModal = memo(({ precepteur, documents, loadingDocs, areAllDocsVerified, onClose, onVerify, onReject, onDocVerify }: DetailModalProps) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
      {/* Header */}
      <div className="sticky top-0 bg-white border-b p-6 flex items-center gap-4 z-10">
        {precepteur.user?.photo_profil ? (
          <img src={precepteur.user.photo_profil} alt="" className="w-12 h-12 rounded-xl object-cover" loading="lazy" />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
            <User className="w-6 h-6 text-gray-400" />
          </div>
        )}
        <div className="flex-1">
          <h2 className="font-bold">{precepteur.user?.username}</h2>
          <p className="text-sm text-gray-500">{precepteur.user?.email}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Contenu */}
      <div className="p-6 space-y-4">
        <StatutBadge statut={precepteur.statut_verification} />

        <div className="grid grid-cols-2 gap-3">
          <InfoBadge icon={MapPin} label="Localisation" value={[precepteur.commune, precepteur.quartier].filter(Boolean).join(', ') || 'Non spécifié'} />
          <InfoBadge icon={Clock} label="Expérience" value={`${precepteur.annees_experience} an(s)`} />
          <InfoBadge icon={GraduationCap} label="Diplôme" value={precepteur.diplome || 'Non spécifié'} />
          <InfoBadge icon={Star} label="Note" value={`${precepteur.note_moyenne?.toFixed(1) || '0'}/5`} />
        </div>

        {precepteur.matieres?.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Matières ({precepteur.matieres.length})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {precepteur.matieres.map((m: { matiere_id: number; matiere: { id: number; nom: string; niveau: string } }) => (
                <span key={m.matiere_id} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs border border-blue-100">
                  {m.matiere?.nom} ({m.matiere?.niveau})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Documents */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Documents
          </h3>
          {loadingDocs ? (
            <div className="text-center py-4">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
            </div>
          ) : documents.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Aucun document soumis</p>
          ) : (
            <div className="space-y-2">
              {documents.map((doc: Document) => (
                <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-colors">
                  <DocIcon format={doc.format_fichier} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.titre}</p>
                    <p className="text-xs text-gray-500">{doc.format_fichier?.toUpperCase()} • {new Date(doc.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <a 
                    href={doc.fichier_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  {doc.statut_verification === 'en_attente' ? (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => onDocVerify(doc, 'verifie')}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Valider"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDocVerify(doc, 'rejete')}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Rejeter"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      doc.statut_verification === 'verifie' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {doc.statut_verification}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          {!loadingDocs && documents.length > 0 && !areAllDocsVerified && (
            <p className="text-xs text-yellow-600 mt-2 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Vérifiez tous les documents avant de valider le précepteur
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-t bg-gray-50/50 rounded-b-2xl flex gap-3">
        <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-white transition-colors">
          Fermer
        </button>
        {precepteur.statut_verification !== 'verifie' && areAllDocsVerified && (
          <button
            onClick={() => onVerify(precepteur)}
            className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" /> Vérifier
          </button>
        )}
        {precepteur.statut_verification !== 'rejete' && (
          <button
            onClick={() => onReject(precepteur)}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <ShieldX className="w-4 h-4" /> Rejeter
          </button>
        )}
      </div>
    </div>
  </div>
))
DetailModal.displayName = 'DetailModal'

const ConfirmModal = memo(({ type, precepteur, comment, processing, onClose, onConfirm, onCommentChange }: ConfirmModalProps) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
      <div className="text-center">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
          type === 'verify' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {type === 'verify' ? (
            <ShieldCheck className="w-7 h-7 text-green-600" />
          ) : (
            <ShieldX className="w-7 h-7 text-red-600" />
          )}
        </div>
        <h3 className="text-lg font-bold mb-1">
          {type === 'verify' ? 'Vérifier ce précepteur ?' : 'Rejeter ce précepteur ?'}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {precepteur.user?.username} • {precepteur.user?.email}
        </p>
        <textarea
          value={comment}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onCommentChange(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Commentaire (optionnel)..."
          disabled={processing}
        />
        <div className="flex gap-2">
          <button
            onClick={onClose}
            disabled={processing}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={() => onConfirm(type === 'verify' ? 'verifie' : 'rejete')}
            disabled={processing}
            className={`flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70 ${
              type === 'verify' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {processing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Confirmer
          </button>
        </div>
      </div>
    </div>
  </div>
))
ConfirmModal.displayName = 'ConfirmModal'

const DocVerifyModal = memo(({ doc, docAction, docComment, processing, onClose, onConfirm, onCommentChange }: DocVerifyModalProps) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
      <div className="text-center">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
          docAction === 'verifie' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {docAction === 'verifie' ? (
            <CheckCircle className="w-7 h-7 text-green-600" />
          ) : (
            <Ban className="w-7 h-7 text-red-600" />
          )}
        </div>
        <h3 className="text-lg font-bold mb-1">
          {docAction === 'verifie' ? 'Valider ce document ?' : 'Rejeter ce document ?'}
        </h3>
        <p className="text-sm text-gray-500 mb-2 truncate">{doc.titre}</p>
        <a
          href={doc.fichier_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline mb-4 inline-flex items-center gap-1"
        >
          <ExternalLink className="w-3 h-3" /> Voir le document
        </a>
        <textarea
          value={docComment}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onCommentChange(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Commentaire (optionnel)..."
          disabled={processing}
        />
        <div className="flex gap-2">
          <button
            onClick={onClose}
            disabled={processing}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={processing}
            className={`flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70 ${
              docAction === 'verifie' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {processing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Confirmer
          </button>
        </div>
      </div>
    </div>
  </div>
))
DocVerifyModal.displayName = 'DocVerifyModal'

export default function VerificationPrecepteurs() {
  const [allPrecepteurs, setAllPrecepteurs] = useState<Precepteur[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [statutFilter, setStatutFilter] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [stats, setStats] = useState<StatsType>({ en_attente: 0, verifie: 0, rejete: 0, total: 0 })
  const [message, setMessage] = useState<string>('')
  
  const [modal, setModal] = useState<ModalState>({
    type: null,
    precepteur: null,
    doc: null,
    docAction: 'verifie',
    comment: '',
    docComment: ''
  })
  
  const [processing, setProcessing] = useState<boolean>(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const [loadingDocs, setLoadingDocs] = useState<boolean>(false)

  // Toast auto-disparition avec cleanup
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => setMessage(''), 3000)
    return () => clearTimeout(timer)
  }, [message])

  // Reset page quand filtre change
  useEffect(() => {
    setPage(1)
  }, [statutFilter, searchTerm])

  // Chargement optimisé avec pagination serveur
  const loadData = useCallback(async (forceRefresh: boolean = false) => {
    const cacheKey = 'precepteurs_list'
    
    // Vérifier le cache
    if (!forceRefresh && CACHE.has(cacheKey)) {
      const cached = CACHE.get(cacheKey)!
      if (Date.now() - cached.timestamp < CACHE_DURATION) {
        setAllPrecepteurs(cached.data.precepteurs)
        setStats(cached.data.stats)
        setLoading(false)
        return
      }
    }

    setLoading(true)
    const startTime = performance.now()

    try {
      // Requête optimisée avec sélection des champs nécessaires uniquement
      const { data, error } = await supabase
        .from('precepteurs')
        .select(`
          id,
          user_id,
          commune,
          quartier,
          annees_experience,
          note_moyenne,
          diplome,
          etablissement_origine,
          statut_verification,
          created_at,
          user:users!inner(id, username, email, genre, photo_profil),
          precepteur_matieres(
            matiere_id,
            matiere:matieres(id, nom, niveau)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(1000) // Limiter à 1000 pour éviter de trop charger

      if (error) throw error

      const precepteurs: Precepteur[] = (data || []).map((p: any) => ({
        ...p,
        matieres: p.precepteur_matieres || []
      }))

      // Calculer les stats en une seule passe
      const counts: StatsType = { en_attente: 0, verifie: 0, rejete: 0, total: precepteurs.length }
      for (let i = 0; i < precepteurs.length; i++) {
        const statut = precepteurs[i].statut_verification
        if (statut === 'en_attente') counts.en_attente++
        else if (statut === 'verifie') counts.verifie++
        else if (statut === 'rejete') counts.rejete++
      }

      // Mettre en cache
      CACHE.set(cacheKey, {
        data: { precepteurs, stats: counts },
        timestamp: Date.now()
      })

      setAllPrecepteurs(precepteurs)
      setStats(counts)
      
      console.log(`⚡ Chargé en ${(performance.now() - startTime).toFixed(0)}ms - ${precepteurs.length} précepteurs`)
    } catch (error) {
      console.error('Erreur chargement:', error)
      setMessage('❌ Erreur lors du chargement')
    }
    setLoading(false)
  }, [])

  // Chargement initial
  useEffect(() => {
    loadData()
  }, [loadData])

  // Filtrage + pagination avec useMemo optimisé
  const { paginatedPrecepteurs, totalFiltered } = useMemo((): { paginatedPrecepteurs: Precepteur[]; totalFiltered: number } => {
    if (allPrecepteurs.length === 0) return { paginatedPrecepteurs: [], totalFiltered: 0 }
    
    let filtered: Precepteur[] = allPrecepteurs
    
    // Filtres optimisés avec early return
    if (statutFilter) {
      filtered = allPrecepteurs.filter((p: Precepteur) => p.statut_verification === statutFilter)
      if (filtered.length === 0) return { paginatedPrecepteurs: [], totalFiltered: 0 }
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter((p: Precepteur) => {
        // Vérifications rapides d'abord
        if (p.user?.username?.toLowerCase().includes(term)) return true
        if (p.user?.email?.toLowerCase().includes(term)) return true
        if (p.commune?.toLowerCase().includes(term)) return true
        if (p.diplome?.toLowerCase().includes(term)) return true
        // Vérification plus lourde en dernier
        return p.matieres?.some((m: { matiere: { nom: string } }) => m.matiere?.nom?.toLowerCase().includes(term))
      })
    }

    const start = (page - 1) * ITEMS_PER_PAGE
    return {
      paginatedPrecepteurs: filtered.slice(start, start + ITEMS_PER_PAGE),
      totalFiltered: filtered.length
    }
  }, [allPrecepteurs, statutFilter, searchTerm, page])

  const totalPages = Math.ceil(totalFiltered / ITEMS_PER_PAGE)

  // Chargement documents optimisé
  const loadDocuments = useCallback(async (userId: string) => {
    setLoadingDocs(true)
    try {
      const { documents: docs, error } = await getDocumentsByUserId(userId)
      if (!error && docs) setDocuments(docs)
      else setDocuments([])
    } catch (e) {
      console.error('Erreur chargement documents:', e)
      setDocuments([])
    }
    setLoadingDocs(false)
  }, [])

  // Actions optimisées
  const handleVerification = useCallback(async (action: 'verifie' | 'rejete') => {
    if (!modal.precepteur) return
    setProcessing(true)
    try {
      const { error } = await supabase
        .from('precepteurs')
        .update({ 
          statut_verification: action, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', modal.precepteur.id)
      
      if (error) throw error

      // Mise à jour optimiste locale
      setAllPrecepteurs((prev: Precepteur[]) => prev.map((p: Precepteur) => 
        p.id === modal.precepteur?.id ? { ...p, statut_verification: action } : p
      ))
      
      setMessage(`✅ Précepteur ${action === 'verifie' ? 'vérifié' : 'rejeté'}`)
      closeAllModals()
      
      // Invalider le cache en arrière-plan
      setTimeout(() => loadData(true), 1000)
    } catch (e: any) {
      setMessage('❌ ' + (e.message || 'Erreur'))
    }
    setProcessing(false)
  }, [modal.precepteur, loadData])

  const handleDocVerification = useCallback(async () => {
    if (!modal.doc) return
    setProcessing(true)
    try {
      const result = await updateDocumentStatus(modal.doc.id, modal.docAction, modal.docComment || undefined)
      if (!result.success) throw new Error(result.error || 'Erreur lors de la mise à jour')
      
      // Mise à jour optimiste locale
      setDocuments((prev: Document[]) => prev.map((d: Document) => 
        d.id === modal.doc?.id ? { ...d, statut_verification: modal.docAction } : d
      ))
      
      setMessage(`✅ Document ${modal.docAction === 'verifie' ? 'vérifié' : 'rejeté'}`)
      
      // Fermer le modal doc et retourner aux détails
      setModal((prev: ModalState) => ({ ...prev, type: 'detail', doc: null }))
    } catch (e: any) {
      setMessage('❌ ' + (e.message || 'Erreur'))
    }
    setProcessing(false)
  }, [modal.doc, modal.docAction, modal.docComment])

  // Gestionnaires modaux optimisés
  const openDetails = useCallback((p: Precepteur) => {
    setModal({ type: 'detail', precepteur: p, doc: null, docAction: 'verifie', comment: '', docComment: '' })
    loadDocuments(p.user_id)
  }, [loadDocuments])

  const openDocVerify = useCallback((doc: Document, action: 'verifie' | 'rejete') => {
    setModal((prev: ModalState) => ({ 
      ...prev, 
      type: 'docVerify', 
      doc, 
      docAction: action,
      docComment: doc.commentaire_verification || ''
    }))
  }, [])

  const closeAllModals = useCallback(() => {
    setModal({ type: null, precepteur: null, doc: null, docAction: 'verifie', comment: '', docComment: '' })
  }, [])

  const areAllDocsVerified = useMemo(() => 
    documents.length > 0 && documents.every((d: Document) => d.statut_verification === 'verifie'),
    [documents]
  )

  // Rendu principal
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
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6" /> Vérification des précepteurs
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{stats.total} précepteurs au total</p>
        </div>
        <button 
          onClick={() => loadData(true)} 
          className="p-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          title="Actualiser"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Stats - Composants séparés pour éviter les re-rendus */}
      <StatsSection 
        stats={stats} 
        statutFilter={statutFilter} 
        onFilterChange={setStatutFilter} 
      />

      {/* Recherche & Filtres */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, commune, matière..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <select
            value={statutFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatutFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-white"
          >
            <option value="">Tous les statuts</option>
            <option value="en_attente">En attente ({stats.en_attente})</option>
            <option value="verifie">Vérifié ({stats.verifie})</option>
            <option value="rejete">Rejeté ({stats.rejete})</option>
          </select>
          {(searchTerm || statutFilter) && (
            <button
              onClick={() => { setSearchTerm(''); setStatutFilter('') }}
              className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Liste */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <SkeletonLoader />
        ) : paginatedPrecepteurs.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="divide-y divide-gray-50">
              {paginatedPrecepteurs.map((p: Precepteur) => (
                <PrecepteurRow key={p.id} precepteur={p} onClick={() => openDetails(p)} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination 
              page={page}
              totalPages={totalPages}
              totalFiltered={totalFiltered}
              statutFilter={statutFilter}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {/* Modals */}
      {modal.type === 'detail' && modal.precepteur && (
        <DetailModal
          precepteur={modal.precepteur}
          documents={documents}
          loadingDocs={loadingDocs}
          areAllDocsVerified={areAllDocsVerified}
          onClose={closeAllModals}
          onVerify={(precepteur: Precepteur) => setModal((prev: ModalState) => ({ ...prev, type: 'verify', precepteur }))}
          onReject={(precepteur: Precepteur) => setModal((prev: ModalState) => ({ ...prev, type: 'reject', precepteur }))}
          onDocVerify={openDocVerify}
        />
      )}

      {(modal.type === 'verify' || modal.type === 'reject') && modal.precepteur && (
        <ConfirmModal
          type={modal.type}
          precepteur={modal.precepteur}
          comment={modal.comment}
          processing={processing}
          onClose={closeAllModals}
          onConfirm={handleVerification}
          onCommentChange={(comment: string) => setModal((prev: ModalState) => ({ ...prev, comment }))}
        />
      )}

      {modal.type === 'docVerify' && modal.doc && (
        <DocVerifyModal
          doc={modal.doc}
          docAction={modal.docAction}
          docComment={modal.docComment}
          processing={processing}
          onClose={closeAllModals}
          onConfirm={handleDocVerification}
          onCommentChange={(comment: string) => setModal((prev: ModalState) => ({ ...prev, docComment: comment }))}
        />
      )}
    </div>
  )
}