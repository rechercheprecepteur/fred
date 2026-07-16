
// 'use client'

// import { useState, useEffect, useCallback, useRef } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import { rechercherPrecepteurs, getMatieres, getCommunes, getQuartiers } from '@/actions/recherche'
// import Link from 'next/link'
// import PrecepteurProfilModal from '@/components/PrecepteurProfilModal'
// import DemandeContractModal from '@/components/DemandeContractModal'
// import Loader from '@/components/Loader'
// import { 
//   Search, MapPin, Star, Clock, BookOpen, GraduationCap, 
//   RotateCcw, User, ChevronLeft, ChevronRight, X, Check,
//   FileText, ArrowLeft, SlidersHorizontal, XCircle
// } from 'lucide-react'
// import { CheckBadgeIcon } from '@heroicons/react/24/solid'

// // Types (les IDs sont maintenant des strings venant d'Express)
// type Precepteur = {
//   id: string
//   user_id: string
//   commune: string | null
//   quartier: string | null
//   annees_experience: number
//   note_moyenne: number
//   disponible: boolean
//   diplome: string | null
//   etablissement_origine: string | null
//   statut_verification: string
//   user: {
//     id: string
//     username: string
//     email: string
//     genre: string
//     photo_profil: string | null
//   } | null
//   matieres: {
//     matiere_id: string
//     matiere: {
//       id: string
//       nom: string
//       niveau: string
//     } | null
//   }[]
//   stats: {
//     id: string
//     statut: string
//   }[]
// }

// type Filtres = {
//   matiere: string
//   commune: string
//   quartier: string
//   experienceMin: string
//   noteMin: string
//   disponible: boolean
//   tri: 'note' | 'experience' | 'proximite'
// }

// // Helper pour construire l'URL complète d'une photo
// const getPhotoUrl = (photoPath: string | null | undefined): string | null => {
//   if (!photoPath) return null
//   if (photoPath.startsWith('http')) return photoPath
//   const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001'
//   return `${baseUrl}${photoPath}`
// }

// export default function RecherchePrecepteur() {
//   const { user } = useAuth()
//   const [precepteurs, setPrecepteurs] = useState<Precepteur[]>([])
//   const [matieres, setMatieres] = useState<any[]>([])
//   const [communes, setCommunes] = useState<string[]>([])
//   const [quartiers, setQuartiers] = useState<string[]>([])
//   const [loading, setLoading] = useState(true)
//   const [page, setPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
//   const [total, setTotal] = useState(0)
//   const [showFilters, setShowFilters] = useState(false)

//   // Autocomplétion
//   const [matiereInput, setMatiereInput] = useState('')
//   const [communeInput, setCommuneInput] = useState('')
//   const [quartierInput, setQuartierInput] = useState('')
//   const [showMatiereSuggestions, setShowMatiereSuggestions] = useState(false)
//   const [showCommuneSuggestions, setShowCommuneSuggestions] = useState(false)
//   const [showQuartierSuggestions, setShowQuartierSuggestions] = useState(false)

//   // Refs pour les clics extérieurs
//   const matiereRef = useRef<HTMLDivElement>(null)
//   const communeRef = useRef<HTMLDivElement>(null)
//   const quartierRef = useRef<HTMLDivElement>(null)

//   // Modals
//   const [showProfilModal, setShowProfilModal] = useState(false)
//   const [showContractModal, setShowContractModal] = useState(false)
//   const [selectedPrecepteur, setSelectedPrecepteur] = useState<Precepteur | null>(null)

//   const [filtres, setFiltres] = useState<Filtres>({
//     matiere: '',
//     commune: '',
//     quartier: '',
//     experienceMin: '',
//     noteMin: '',
//     disponible: true,
//     tri: 'note'
//   })

//   // Chargement initial
//   useEffect(() => {
//     loadMatieres()
//     loadCommunes()
//     loadQuartiers()
    
//     // Fermer les suggestions au clic extérieur
//     const handleClickOutside = (e: MouseEvent) => {
//       if (matiereRef.current && !matiereRef.current.contains(e.target as Node)) {
//         setShowMatiereSuggestions(false)
//       }
//       if (communeRef.current && !communeRef.current.contains(e.target as Node)) {
//         setShowCommuneSuggestions(false)
//       }
//       if (quartierRef.current && !quartierRef.current.contains(e.target as Node)) {
//         setShowQuartierSuggestions(false)
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

//   const loadMatieres = async () => {
//     const data = await getMatieres()
//     setMatieres(data || [])
//   }

//   const loadCommunes = async () => {
//     const data = await getCommunes()
//     setCommunes(data || [])
//   }

//   const loadQuartiers = async () => {
//     const data = await getQuartiers()
//     setQuartiers(data || [])
//   }

//   // Recherche
//   const rechercher = useCallback(async (pageNum?: number) => {
//     setLoading(true)
//     const currentPage = pageNum || 1
    
//     try {
//       const result = await rechercherPrecepteurs({
//         matiere: filtres.matiere || undefined,
//         commune: filtres.commune || undefined,
//         quartier: filtres.quartier || undefined,
//         experienceMin: filtres.experienceMin ? parseInt(filtres.experienceMin) : undefined,
//         noteMin: filtres.noteMin ? parseFloat(filtres.noteMin) : undefined,
//         disponible: filtres.disponible,
//         tri: filtres.tri,
//         page: currentPage
//       })

//       if (result.precepteurs) {
//         // Les données viennent déjà formatées correctement depuis Express
//         setPrecepteurs(result.precepteurs as Precepteur[])
//         setTotal(result.total || 0)
//         setTotalPages(result.totalPages || 1)
//         setPage(result.page || 1)
//       }
//     } catch (error) {
//       console.error('❌ Erreur recherche:', error)
//       setPrecepteurs([])
//       setTotal(0)
//       setTotalPages(1)
//     }

//     setLoading(false)
//     setShowFilters(false)
//   }, [filtres])

//   // Relancer la recherche quand les filtres changent
//   useEffect(() => {
//     rechercher(1)
//   }, [filtres])

//   const handleFiltreChange = (key: keyof Filtres, value: any) => {
//     setFiltres(prev => ({ ...prev, [key]: value }))
//   }

//   const resetFiltres = () => {
//     setFiltres({
//       matiere: '',
//       commune: '',
//       quartier: '',
//       experienceMin: '',
//       noteMin: '',
//       disponible: true,
//       tri: 'note'
//     })
//     setMatiereInput('')
//     setCommuneInput('')
//     setQuartierInput('')
//   }

//   // Filtrer les suggestions d'autocomplétion
//   const filteredMatieres = matieres.filter(m => 
//     m.nom.toLowerCase().includes(matiereInput.toLowerCase()) ||
//     (m.niveau && m.niveau.toLowerCase().includes(matiereInput.toLowerCase()))
//   )
//   const filteredCommunes = communes.filter(c => 
//     c.toLowerCase().includes(communeInput.toLowerCase())
//   )
//   const filteredQuartiers = quartiers.filter(q => 
//     q.toLowerCase().includes(quartierInput.toLowerCase())
//   )

//   if (!user) return null

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-6">
//       {/* En-tête */}
//       <div className="mb-6">
//         <Link 
//           href="/dashboard/parent" 
//           className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1 mb-2"
//         >
//           <ArrowLeft className="w-4 h-4" /> Retour au tableau de bord
//         </Link>
//         <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//           <Search className="w-6 h-6" />
//           Rechercher un précepteur
//         </h1>
//         <p className="text-gray-500 text-sm mt-1">
//           Trouvez le précepteur idéal pour vos cours
//         </p>
//       </div>

//       {/* FILTRES */}
//       <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
//           {/* Matière avec autocomplétion */}
//           <div className="relative" ref={matiereRef}>
//             <label className="block text-xs font-medium text-gray-600 mb-1">
//               <BookOpen className="w-3.5 h-3.5 inline mr-1" /> Matière
//             </label>
//             <input
//               type="text"
//               value={matiereInput}
//               onChange={(e) => {
//                 setMatiereInput(e.target.value)
//                 setShowMatiereSuggestions(true)
//                 if (!e.target.value) handleFiltreChange('matiere', '')
//               }}
//               onFocus={() => setShowMatiereSuggestions(true)}
//               placeholder="Rechercher une matière..."
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black"
//             />
//             {showMatiereSuggestions && matiereInput && filteredMatieres.length > 0 && (
//               <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
//                 {filteredMatieres.map((matiere) => (
//                   <button
//                     key={matiere.id}
//                     type="button"
//                     onClick={() => {
//                       handleFiltreChange('matiere', matiere.nom)
//                       setMatiereInput(`${matiere.nom} - ${matiere.niveau || ''}`)
//                       setShowMatiereSuggestions(false)
//                     }}
//                     className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
//                   >
//                     <span>{matiere.nom}</span>
//                     {matiere.niveau && <span className="text-xs text-gray-400">{matiere.niveau}</span>}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Commune avec autocomplétion */}
//           <div className="relative" ref={communeRef}>
//             <label className="block text-xs font-medium text-gray-600 mb-1">
//               <MapPin className="w-3.5 h-3.5 inline mr-1" /> Commune
//             </label>
//             <input
//               type="text"
//               value={communeInput}
//               onChange={(e) => {
//                 setCommuneInput(e.target.value)
//                 setShowCommuneSuggestions(true)
//                 if (!e.target.value) handleFiltreChange('commune', '')
//               }}
//               onFocus={() => setShowCommuneSuggestions(true)}
//               placeholder="Rechercher une commune..."
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black"
//             />
//             {showCommuneSuggestions && communeInput && filteredCommunes.length > 0 && (
//               <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
//                 {filteredCommunes.map((commune) => (
//                   <button
//                     key={commune}
//                     type="button"
//                     onClick={() => {
//                       handleFiltreChange('commune', commune)
//                       setCommuneInput(commune)
//                       setShowCommuneSuggestions(false)
//                     }}
//                     className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
//                   >
//                     <MapPin className="w-3.5 h-3.5 inline mr-1 text-gray-400" />
//                     {commune}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Quartier avec autocomplétion */}
//           <div className="relative" ref={quartierRef}>
//             <label className="block text-xs font-medium text-gray-600 mb-1">
//               <MapPin className="w-3.5 h-3.5 inline mr-1" /> Quartier
//             </label>
//             <input
//               type="text"
//               value={quartierInput}
//               onChange={(e) => {
//                 setQuartierInput(e.target.value)
//                 setShowQuartierSuggestions(true)
//                 if (!e.target.value) handleFiltreChange('quartier', '')
//               }}
//               onFocus={() => setShowQuartierSuggestions(true)}
//               placeholder="Rechercher un quartier..."
//               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black"
//             />
//             {showQuartierSuggestions && quartierInput && filteredQuartiers.length > 0 && (
//               <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
//                 {filteredQuartiers.map((quartier) => (
//                   <button
//                     key={quartier}
//                     type="button"
//                     onClick={() => {
//                       handleFiltreChange('quartier', quartier)
//                       setQuartierInput(quartier)
//                       setShowQuartierSuggestions(false)
//                     }}
//                     className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
//                   >
//                     <MapPin className="w-3.5 h-3.5 inline mr-1 text-gray-400" />
//                     {quartier}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Bouton plus de filtres */}
//           <div className="flex items-end gap-2">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
//             >
//               <SlidersHorizontal className="w-4 h-4" />
//               Plus de filtres
//             </button>
//             {(filtres.matiere || filtres.commune || filtres.quartier || filtres.experienceMin || filtres.noteMin) && (
//               <button
//                 onClick={resetFiltres}
//                 className="px-3 py-2 text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
//                 title="Réinitialiser"
//               >
//                 <RotateCcw className="w-4 h-4" />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Filtres avancés */}
//         {showFilters && (
//           <div className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
//             {/* Expérience */}
//             <div>
//               <label className="block text-xs font-medium text-gray-600 mb-1">
//                 <Clock className="w-3.5 h-3.5 inline mr-1" /> Expérience minimum
//               </label>
//               <select
//                 value={filtres.experienceMin}
//                 onChange={(e) => handleFiltreChange('experienceMin', e.target.value)}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black bg-white"
//               >
//                 <option value="">Peu importe</option>
//                 <option value="1">1+ an</option>
//                 <option value="3">3+ ans</option>
//                 <option value="5">5+ ans</option>
//                 <option value="10">10+ ans</option>
//               </select>
//             </div>

//             {/* Note minimum avec étoiles sélectionnables */}
//             <div>
//               <label className="block text-xs font-medium text-gray-600 mb-1">
//                 <Star className="w-3.5 h-3.5 inline mr-1" /> Note minimum
//               </label>
//               <div className="flex items-center gap-1">
//                 {[1, 2, 3, 4, 5].map((etoile) => (
//                   <button
//                     key={etoile}
//                     type="button"
//                     onClick={() => {
//                       if (filtres.noteMin === etoile.toString()) {
//                         handleFiltreChange('noteMin', '')
//                       } else {
//                         handleFiltreChange('noteMin', etoile.toString())
//                       }
//                     }}
//                     className={`p-1 rounded transition-all ${
//                       filtres.noteMin && parseInt(filtres.noteMin) >= etoile
//                         ? 'text-yellow-500 scale-110'
//                         : 'text-gray-300 hover:text-yellow-400'
//                     }`}
//                     title={`${etoile}+ étoiles`}
//                   >
//                     <Star className={`w-6 h-6 ${filtres.noteMin && parseInt(filtres.noteMin) >= etoile ? 'fill-current' : ''}`} />
//                   </button>
//                 ))}
//                 {filtres.noteMin && (
//                   <button
//                     onClick={() => handleFiltreChange('noteMin', '')}
//                     className="ml-1 text-xs text-gray-400 hover:text-red-500"
//                     title="Effacer"
//                   >
//                     <XCircle className="w-4 h-4" />
//                   </button>
//                 )}
//                 <span className="ml-2 text-sm text-gray-500">
//                   {filtres.noteMin ? `${filtres.noteMin}+` : 'Toutes'}
//                 </span>
//               </div>
//             </div>

//             {/* Tri */}
//             <div>
//               <label className="block text-xs font-medium text-gray-600 mb-1">
//                 <SlidersHorizontal className="w-3.5 h-3.5 inline mr-1" /> Trier par
//               </label>
//               <select
//                 value={filtres.tri}
//                 onChange={(e) => handleFiltreChange('tri', e.target.value)}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black bg-white"
//               >
//                 <option value="note">Meilleure note</option>
//                 <option value="experience">Plus d'expérience</option>
//               </select>
//             </div>

//             {/* Disponible */}
//             <div className="sm:col-span-3">
//               <label className="flex items-center gap-2 text-sm cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={filtres.disponible}
//                   onChange={(e) => handleFiltreChange('disponible', e.target.checked)}
//                   className="rounded text-black focus:ring-black"
//                 />
//                 <span className="text-gray-700">
//                   {filtres.disponible ? (
//                     <Check className="w-4 h-4 inline text-green-500 mr-1" />
//                   ) : (
//                     <X className="w-4 h-4 inline text-gray-400 mr-1" />
//                   )}
//                   Disponible uniquement
//                 </span>
//               </label>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Badges des filtres actifs */}
//       {(filtres.matiere || filtres.commune || filtres.quartier || filtres.experienceMin || filtres.noteMin) && (
//         <div className="flex flex-wrap gap-2 mb-4">
//           {filtres.matiere && (
//             <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
//               <BookOpen className="w-3 h-3" />
//               {filtres.matiere}
//               <button onClick={() => { handleFiltreChange('matiere', ''); setMatiereInput('') }}>
//                 <XCircle className="w-3 h-3" />
//               </button>
//             </span>
//           )}
//           {filtres.commune && (
//             <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs rounded-full">
//               <MapPin className="w-3 h-3" />
//               {filtres.commune}
//               <button onClick={() => { handleFiltreChange('commune', ''); setCommuneInput('') }}>
//                 <XCircle className="w-3 h-3" />
//               </button>
//             </span>
//           )}
//           {filtres.quartier && (
//             <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
//               <MapPin className="w-3 h-3" />
//               {filtres.quartier}
//               <button onClick={() => { handleFiltreChange('quartier', ''); setQuartierInput('') }}>
//                 <XCircle className="w-3 h-3" />
//               </button>
//             </span>
//           )}
//           {filtres.experienceMin && (
//             <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
//               <Clock className="w-3 h-3" />
//               {filtres.experienceMin}+ an{filtres.experienceMin !== '1' ? 's' : ''}
//               <button onClick={() => handleFiltreChange('experienceMin', '')}>
//                 <XCircle className="w-3 h-3" />
//               </button>
//             </span>
//           )}
//           {filtres.noteMin && (
//             <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
//               {filtres.noteMin}+ <Star className="w-3 h-3 fill-current" />
//               <button onClick={() => handleFiltreChange('noteMin', '')}>
//                 <XCircle className="w-3 h-3" />
//               </button>
//             </span>
//           )}
//         </div>
//       )}

//       {/* Résultats */}
//       <div className="mb-4 flex items-center justify-between">
//         <p className="text-sm text-gray-600">
//           {total} précepteur{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
//         </p>
//       </div>

//       {loading ? (
//         <div className="space-y-2">
//           {[1, 2, 3].map((i) => (
//             <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
//                 <div className="flex-1 space-y-2">
//                   <div className="h-4 bg-gray-200 rounded w-1/4"></div>
//                   <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : precepteurs.length === 0 ? (
//         <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
//           <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//           <p className="text-gray-500 font-medium">Aucun précepteur trouvé</p>
//           <p className="text-gray-400 text-sm mt-1">Essayez de modifier vos critères de recherche</p>
//           <button
//             onClick={resetFiltres}
//             className="mt-4 px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800"
//           >
//             Réinitialiser les filtres
//           </button>
//         </div>
//       ) : (
//         <>
//           {/* LISTE DES PRÉCEPTEURS */}
//           <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//             <div className="divide-y divide-gray-100">
//               {precepteurs.map((precepteur) => (
//                 <div 
//                   key={precepteur.id} 
//                   className="p-4 hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="flex items-center gap-4">
//                     {/* Avatar */}
//                     <div className="relative flex-shrink-0">
//                       {getPhotoUrl(precepteur.user?.photo_profil) ? (
//                         <img 
//                           src={getPhotoUrl(precepteur.user?.photo_profil)!} 
//                           alt="" 
//                           className="w-12 h-12 rounded-full object-cover"
//                           onError={(e) => {
//                             e.currentTarget.style.display = 'none'
//                             const placeholder = e.currentTarget.nextElementSibling as HTMLElement
//                             if (placeholder) placeholder.style.display = 'flex'
//                           }}
//                         />
//                       ) : null}
//                       <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ${precepteur.user?.photo_profil ? 'hidden' : 'flex'}`}>
//                         <User className="w-6 h-6 text-gray-400" />
//                       </div>
//                       {precepteur.disponible && (
//                         <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
//                       )}
//                     </div>

//                     {/* Infos principales */}
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 flex-wrap">
//                         <span className="font-semibold text-gray-900">
//                           {precepteur.user?.username || 'Anonyme'}
//                         </span>
//                         {precepteur.statut_verification === 'verifie' && (
//                           <CheckBadgeIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
//                         )}
//                       </div>

//                       <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5 flex-wrap">
//                         {precepteur.commune && (
//                           <span className="flex items-center gap-1">
//                             <MapPin className="w-3.5 h-3.5" />
//                             {precepteur.commune}{precepteur.quartier ? `, ${precepteur.quartier}` : ''}
//                           </span>
//                         )}
//                         {precepteur.diplome && (
//                           <span className="flex items-center gap-1">
//                             <GraduationCap className="w-3.5 h-3.5" />
//                             {precepteur.diplome}
//                           </span>
//                         )}
//                         <span className="flex items-center gap-1">
//                           <Clock className="w-3.5 h-3.5" />
//                           {precepteur.annees_experience} an{precepteur.annees_experience > 1 ? 's' : ''}
//                         </span>
//                       </div>

//                       {/* Matières */}
//                       {precepteur.matieres && precepteur.matieres.length > 0 && (
//                         <div className="flex flex-wrap gap-1 mt-2">
//                           {precepteur.matieres.slice(0, 4).map((m) => (
//                             <span 
//                               key={m.matiere_id} 
//                               className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium"
//                             >
//                               <BookOpen className="w-3 h-3 inline mr-0.5" />
//                               {m.matiere?.nom || 'Matière'}
//                             </span>
//                           ))}
//                           {precepteur.matieres.length > 4 && (
//                             <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
//                               +{precepteur.matieres.length - 4}
//                             </span>
//                           )}
//                         </div>
//                       )}
//                     </div>

//                     {/* Note avec étoiles */}
//                     <div className="flex items-center gap-1 flex-shrink-0">
//                       <div className="flex">
//                         {[1, 2, 3, 4, 5].map((etoile) => (
//                           <Star 
//                             key={etoile}
//                             className={`w-4 h-4 ${
//                               etoile <= Math.round(precepteur.note_moyenne || 0)
//                                 ? 'text-yellow-500 fill-current'
//                                 : 'text-gray-300'
//                             }`}
//                           />
//                         ))}
//                       </div>
//                       <span className="font-bold text-sm ml-1">
//                         {precepteur.note_moyenne?.toFixed(1) || '0.0'}
//                       </span>
//                     </div>

//                     {/* Actions */}
//                     <div className="flex items-center gap-2 flex-shrink-0">
//                       <button
//                         onClick={() => {
//                           setSelectedPrecepteur(precepteur)
//                           setShowProfilModal(true)
//                         }}
//                         className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//                       >
//                         Profil
//                       </button>
                      
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex justify-center items-center gap-2 mt-6">
//               <button
//                 onClick={() => rechercher(Math.max(1, page - 1))}
//                 disabled={page === 1}
//                 className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
//               >
//                 <ChevronLeft className="w-4 h-4" />
//               </button>
              
//               {Array.from({ length: totalPages }, (_, i) => i + 1)
//                 .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
//                 .map((p, index, array) => (
//                   <span key={p} className="flex items-center">
//                     {index > 0 && array[index - 1] !== p - 1 && (
//                       <span className="px-1 text-gray-400">...</span>
//                     )}
//                     <button
//                       onClick={() => rechercher(p)}
//                       className={`w-9 h-9 rounded-lg text-sm font-medium ${
//                         page === p
//                           ? 'bg-black text-white'
//                           : 'border border-gray-300 hover:bg-gray-50'
//                       }`}
//                     >
//                       {p}
//                     </button>
//                   </span>
//                 ))}
              
//               <button
//                 onClick={() => rechercher(Math.min(totalPages, page + 1))}
//                 disabled={page === totalPages}
//                 className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
//               >
//                 <ChevronRight className="w-4 h-4" />
//               </button>
//             </div>
//           )}
//         </>
//       )}

//       {/* Modals */}
//       <PrecepteurProfilModal
//         precepteurId={selectedPrecepteur?.id || '0'}
//         isOpen={showProfilModal}
//         onClose={() => setShowProfilModal(false)}
//         onDemanderSession={() => {
//           setShowProfilModal(false)
//           setTimeout(() => setShowContractModal(true), 100)
//         }}
//       />

//       <DemandeContractModal
//         precepteur={selectedPrecepteur}
//         isOpen={showContractModal}
//         onClose={() => setShowContractModal(false)}
//       />
//     </div>
//   )
// }

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { rechercherPrecepteurs, getMatieres, getCommunes, getQuartiers } from '@/actions/recherche'
import Link from 'next/link'
import PrecepteurProfilModal from '@/components/PrecepteurProfilModal'
import Loader from '@/components/Loader'
import { 
  Search, MapPin, Star, Clock, BookOpen, GraduationCap, 
  RotateCcw, User, ChevronLeft, ChevronRight, X, Check,
  ArrowLeft, SlidersHorizontal, XCircle
} from 'lucide-react'
import { CheckBadgeIcon } from '@heroicons/react/24/solid'

// Types (les IDs sont maintenant des strings venant d'Express)
type Precepteur = {
  id: string
  user_id: string
  commune: string | null
  quartier: string | null
  annees_experience: number
  note_moyenne: number
  disponible: boolean
  diplome: string | null
  etablissement_origine: string | null
  statut_verification: string
  user: {
    id: string
    username: string
    email: string
    genre: string
    photo_profil: string | null
  } | null
  matieres: {
    matiere_id: string
    matiere: {
      id: string
      nom: string
      niveau: string
    } | null
  }[]
  stats: {
    id: string
    statut: string
  }[]
}

type Filtres = {
  matiere: string
  commune: string
  quartier: string
  experienceMin: string
  noteMin: string
  disponible: boolean
  tri: 'note' | 'experience' | 'proximite'
}

// Helper pour construire l'URL complète d'une photo
const getPhotoUrl = (photoPath: string | null | undefined): string | null => {
  if (!photoPath) return null
  if (photoPath.startsWith('http')) return photoPath
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001'
  return `${baseUrl}${photoPath}`
}

export default function RecherchePrecepteur() {
  const { user } = useAuth()
  const [precepteurs, setPrecepteurs] = useState<Precepteur[]>([])
  const [matieres, setMatieres] = useState<any[]>([])
  const [communes, setCommunes] = useState<string[]>([])
  const [quartiers, setQuartiers] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  // Autocomplétion
  const [matiereInput, setMatiereInput] = useState('')
  const [communeInput, setCommuneInput] = useState('')
  const [quartierInput, setQuartierInput] = useState('')
  const [showMatiereSuggestions, setShowMatiereSuggestions] = useState(false)
  const [showCommuneSuggestions, setShowCommuneSuggestions] = useState(false)
  const [showQuartierSuggestions, setShowQuartierSuggestions] = useState(false)

  // Refs pour les clics extérieurs
  const matiereRef = useRef<HTMLDivElement>(null)
  const communeRef = useRef<HTMLDivElement>(null)
  const quartierRef = useRef<HTMLDivElement>(null)

  // Modals
  const [showProfilModal, setShowProfilModal] = useState(false)
  const [selectedPrecepteur, setSelectedPrecepteur] = useState<Precepteur | null>(null)

  const [filtres, setFiltres] = useState<Filtres>({
    matiere: '',
    commune: '',
    quartier: '',
    experienceMin: '',
    noteMin: '',
    disponible: true,
    tri: 'note'
  })

  // Chargement initial
  useEffect(() => {
    loadMatieres()
    loadCommunes()
    loadQuartiers()
    
    // Fermer les suggestions au clic extérieur
    const handleClickOutside = (e: MouseEvent) => {
      if (matiereRef.current && !matiereRef.current.contains(e.target as Node)) {
        setShowMatiereSuggestions(false)
      }
      if (communeRef.current && !communeRef.current.contains(e.target as Node)) {
        setShowCommuneSuggestions(false)
      }
      if (quartierRef.current && !quartierRef.current.contains(e.target as Node)) {
        setShowQuartierSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadMatieres = async () => {
    const data = await getMatieres()
    setMatieres(data || [])
  }

  const loadCommunes = async () => {
    const data = await getCommunes()
    setCommunes(data || [])
  }

  const loadQuartiers = async () => {
    const data = await getQuartiers()
    setQuartiers(data || [])
  }

  // Recherche
  const rechercher = useCallback(async (pageNum?: number) => {
    setLoading(true)
    const currentPage = pageNum || 1
    
    try {
      const result = await rechercherPrecepteurs({
        matiere: filtres.matiere || undefined,
        commune: filtres.commune || undefined,
        quartier: filtres.quartier || undefined,
        experienceMin: filtres.experienceMin ? parseInt(filtres.experienceMin) : undefined,
        noteMin: filtres.noteMin ? parseFloat(filtres.noteMin) : undefined,
        disponible: filtres.disponible,
        tri: filtres.tri,
        page: currentPage
      })

      if (result.precepteurs) {
        // Les données viennent déjà formatées correctement depuis Express
        setPrecepteurs(result.precepteurs as Precepteur[])
        setTotal(result.total || 0)
        setTotalPages(result.totalPages || 1)
        setPage(result.page || 1)
      }
    } catch (error) {
      console.error('❌ Erreur recherche:', error)
      setPrecepteurs([])
      setTotal(0)
      setTotalPages(1)
    }

    setLoading(false)
    setShowFilters(false)
  }, [filtres])

  // Relancer la recherche quand les filtres changent
  useEffect(() => {
    rechercher(1)
  }, [filtres])

  const handleFiltreChange = (key: keyof Filtres, value: any) => {
    setFiltres(prev => ({ ...prev, [key]: value }))
  }

  const resetFiltres = () => {
    setFiltres({
      matiere: '',
      commune: '',
      quartier: '',
      experienceMin: '',
      noteMin: '',
      disponible: true,
      tri: 'note'
    })
    setMatiereInput('')
    setCommuneInput('')
    setQuartierInput('')
  }

  // Filtrer les suggestions d'autocomplétion
  const filteredMatieres = matieres.filter(m => 
    m.nom.toLowerCase().includes(matiereInput.toLowerCase()) ||
    (m.niveau && m.niveau.toLowerCase().includes(matiereInput.toLowerCase()))
  )
  const filteredCommunes = communes.filter(c => 
    c.toLowerCase().includes(communeInput.toLowerCase())
  )
  const filteredQuartiers = quartiers.filter(q => 
    q.toLowerCase().includes(quartierInput.toLowerCase())
  )

  if (!user) return null

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* En-tête */}
      <div className="mb-6">
        <Link 
          href="/dashboard/parent" 
          className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Retour au tableau de bord
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Search className="w-6 h-6" />
          Rechercher un précepteur
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Trouvez le précepteur idéal pour vos cours
        </p>
      </div>

      {/* FILTRES */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          {/* Matière avec autocomplétion */}
          <div className="relative" ref={matiereRef}>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              <BookOpen className="w-3.5 h-3.5 inline mr-1" /> Matière
            </label>
            <input
              type="text"
              value={matiereInput}
              onChange={(e) => {
                setMatiereInput(e.target.value)
                setShowMatiereSuggestions(true)
                if (!e.target.value) handleFiltreChange('matiere', '')
              }}
              onFocus={() => setShowMatiereSuggestions(true)}
              placeholder="Rechercher une matière..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black"
            />
            {showMatiereSuggestions && matiereInput && filteredMatieres.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredMatieres.map((matiere) => (
                  <button
                    key={matiere.id}
                    type="button"
                    onClick={() => {
                      handleFiltreChange('matiere', matiere.nom)
                      setMatiereInput(`${matiere.nom} - ${matiere.niveau || ''}`)
                      setShowMatiereSuggestions(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
                  >
                    <span>{matiere.nom}</span>
                    {matiere.niveau && <span className="text-xs text-gray-400">{matiere.niveau}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Commune avec autocomplétion */}
          <div className="relative" ref={communeRef}>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              <MapPin className="w-3.5 h-3.5 inline mr-1" /> Commune
            </label>
            <input
              type="text"
              value={communeInput}
              onChange={(e) => {
                setCommuneInput(e.target.value)
                setShowCommuneSuggestions(true)
                if (!e.target.value) handleFiltreChange('commune', '')
              }}
              onFocus={() => setShowCommuneSuggestions(true)}
              placeholder="Rechercher une commune..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black"
            />
            {showCommuneSuggestions && communeInput && filteredCommunes.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredCommunes.map((commune) => (
                  <button
                    key={commune}
                    type="button"
                    onClick={() => {
                      handleFiltreChange('commune', commune)
                      setCommuneInput(commune)
                      setShowCommuneSuggestions(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    <MapPin className="w-3.5 h-3.5 inline mr-1 text-gray-400" />
                    {commune}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quartier avec autocomplétion */}
          <div className="relative" ref={quartierRef}>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              <MapPin className="w-3.5 h-3.5 inline mr-1" /> Quartier
            </label>
            <input
              type="text"
              value={quartierInput}
              onChange={(e) => {
                setQuartierInput(e.target.value)
                setShowQuartierSuggestions(true)
                if (!e.target.value) handleFiltreChange('quartier', '')
              }}
              onFocus={() => setShowQuartierSuggestions(true)}
              placeholder="Rechercher un quartier..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black"
            />
            {showQuartierSuggestions && quartierInput && filteredQuartiers.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredQuartiers.map((quartier) => (
                  <button
                    key={quartier}
                    type="button"
                    onClick={() => {
                      handleFiltreChange('quartier', quartier)
                      setQuartierInput(quartier)
                      setShowQuartierSuggestions(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    <MapPin className="w-3.5 h-3.5 inline mr-1 text-gray-400" />
                    {quartier}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bouton plus de filtres */}
          <div className="flex items-end gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Plus de filtres
            </button>
            {(filtres.matiere || filtres.commune || filtres.quartier || filtres.experienceMin || filtres.noteMin) && (
              <button
                onClick={resetFiltres}
                className="px-3 py-2 text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                title="Réinitialiser"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Expérience */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                <Clock className="w-3.5 h-3.5 inline mr-1" /> Expérience minimum
              </label>
              <select
                value={filtres.experienceMin}
                onChange={(e) => handleFiltreChange('experienceMin', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black bg-white"
              >
                <option value="">Peu importe</option>
                <option value="1">1+ an</option>
                <option value="3">3+ ans</option>
                <option value="5">5+ ans</option>
                <option value="10">10+ ans</option>
              </select>
            </div>

            {/* Note minimum avec étoiles sélectionnables */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                <Star className="w-3.5 h-3.5 inline mr-1" /> Note minimum
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((etoile) => (
                  <button
                    key={etoile}
                    type="button"
                    onClick={() => {
                      if (filtres.noteMin === etoile.toString()) {
                        handleFiltreChange('noteMin', '')
                      } else {
                        handleFiltreChange('noteMin', etoile.toString())
                      }
                    }}
                    className={`p-1 rounded transition-all ${
                      filtres.noteMin && parseInt(filtres.noteMin) >= etoile
                        ? 'text-yellow-500 scale-110'
                        : 'text-gray-300 hover:text-yellow-400'
                    }`}
                    title={`${etoile}+ étoiles`}
                  >
                    <Star className={`w-6 h-6 ${filtres.noteMin && parseInt(filtres.noteMin) >= etoile ? 'fill-current' : ''}`} />
                  </button>
                ))}
                {filtres.noteMin && (
                  <button
                    onClick={() => handleFiltreChange('noteMin', '')}
                    className="ml-1 text-xs text-gray-400 hover:text-red-500"
                    title="Effacer"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
                <span className="ml-2 text-sm text-gray-500">
                  {filtres.noteMin ? `${filtres.noteMin}+` : 'Toutes'}
                </span>
              </div>
            </div>

            {/* Tri */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                <SlidersHorizontal className="w-3.5 h-3.5 inline mr-1" /> Trier par
              </label>
              <select
                value={filtres.tri}
                onChange={(e) => handleFiltreChange('tri', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:border-black bg-white"
              >
                <option value="note">Meilleure note</option>
                <option value="experience">Plus d'expérience</option>
              </select>
            </div>

            {/* Disponible */}
            <div className="sm:col-span-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={filtres.disponible}
                  onChange={(e) => handleFiltreChange('disponible', e.target.checked)}
                  className="rounded text-black focus:ring-black"
                />
                <span className="text-gray-700">
                  {filtres.disponible ? (
                    <Check className="w-4 h-4 inline text-green-500 mr-1" />
                  ) : (
                    <X className="w-4 h-4 inline text-gray-400 mr-1" />
                  )}
                  Disponible uniquement
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Badges des filtres actifs */}
      {(filtres.matiere || filtres.commune || filtres.quartier || filtres.experienceMin || filtres.noteMin) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filtres.matiere && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              <BookOpen className="w-3 h-3" />
              {filtres.matiere}
              <button onClick={() => { handleFiltreChange('matiere', ''); setMatiereInput('') }}>
                <XCircle className="w-3 h-3" />
              </button>
            </span>
          )}
          {filtres.commune && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              <MapPin className="w-3 h-3" />
              {filtres.commune}
              <button onClick={() => { handleFiltreChange('commune', ''); setCommuneInput('') }}>
                <XCircle className="w-3 h-3" />
              </button>
            </span>
          )}
          {filtres.quartier && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
              <MapPin className="w-3 h-3" />
              {filtres.quartier}
              <button onClick={() => { handleFiltreChange('quartier', ''); setQuartierInput('') }}>
                <XCircle className="w-3 h-3" />
              </button>
            </span>
          )}
          {filtres.experienceMin && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
              <Clock className="w-3 h-3" />
              {filtres.experienceMin}+ an{filtres.experienceMin !== '1' ? 's' : ''}
              <button onClick={() => handleFiltreChange('experienceMin', '')}>
                <XCircle className="w-3 h-3" />
              </button>
            </span>
          )}
          {filtres.noteMin && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
              {filtres.noteMin}+ <Star className="w-3 h-3 fill-current" />
              <button onClick={() => handleFiltreChange('noteMin', '')}>
                <XCircle className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Résultats */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {total} précepteur{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
        </p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : precepteurs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Aucun précepteur trouvé</p>
          <p className="text-gray-400 text-sm mt-1">Essayez de modifier vos critères de recherche</p>
          <button
            onClick={resetFiltres}
            className="mt-4 px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <>
          {/* LISTE DES PRÉCEPTEURS */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {precepteurs.map((precepteur) => (
                <div 
                  key={precepteur.id} 
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {getPhotoUrl(precepteur.user?.photo_profil) ? (
                        <img 
                          src={getPhotoUrl(precepteur.user?.photo_profil)!} 
                          alt="" 
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            const placeholder = e.currentTarget.nextElementSibling as HTMLElement
                            if (placeholder) placeholder.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ${precepteur.user?.photo_profil ? 'hidden' : 'flex'}`}>
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                      {precepteur.disponible && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>

                    {/* Infos principales */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900">
                          {precepteur.user?.username || 'Anonyme'}
                        </span>
                        {precepteur.statut_verification === 'verifie' && (
                          <CheckBadgeIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5 flex-wrap">
                        {precepteur.commune && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {precepteur.commune}{precepteur.quartier ? `, ${precepteur.quartier}` : ''}
                          </span>
                        )}
                        {precepteur.diplome && (
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-3.5 h-3.5" />
                            {precepteur.diplome}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {precepteur.annees_experience} an{precepteur.annees_experience > 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Matières */}
                      {precepteur.matieres && precepteur.matieres.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {precepteur.matieres.slice(0, 4).map((m) => (
                            <span 
                              key={m.matiere_id} 
                              className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium"
                            >
                              <BookOpen className="w-3 h-3 inline mr-0.5" />
                              {m.matiere?.nom || 'Matière'}
                            </span>
                          ))}
                          {precepteur.matieres.length > 4 && (
                            <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                              +{precepteur.matieres.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Note avec étoiles */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((etoile) => (
                          <Star 
                            key={etoile}
                            className={`w-4 h-4 ${
                              etoile <= Math.round(precepteur.note_moyenne || 0)
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-sm ml-1">
                        {precepteur.note_moyenne?.toFixed(1) || '0.0'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          setSelectedPrecepteur(precepteur)
                          setShowProfilModal(true)
                        }}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Profil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => rechercher(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, index, array) => (
                  <span key={p} className="flex items-center">
                    {index > 0 && array[index - 1] !== p - 1 && (
                      <span className="px-1 text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => rechercher(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium ${
                        page === p
                          ? 'bg-black text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                ))}
              
              <button
                onClick={() => rechercher(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal Profil uniquement */}
      <PrecepteurProfilModal
        precepteurId={selectedPrecepteur?.id || '0'}
        isOpen={showProfilModal}
        onClose={() => setShowProfilModal(false)}
      />
    </div>
  )
}