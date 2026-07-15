

// // app/services/page.tsx - VERSION MISE À JOUR
// 'use client'

// import { useState, useEffect, useCallback } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { 
//   Search, SlidersHorizontal, MapPin, Users, 
//   Clock, Tag, BookOpen, Star, Filter, X,
//   GraduationCap, Home, Wifi, Eye,
//   Loader2, AlertCircle, RefreshCw,
//   User
// } from 'lucide-react'
// import Link from 'next/link'
// import { getPublicServices } from '@/actions/services'

// // Types (inchangés)
// type Service = {
//   id: number
//   precepteur_id: number
//   titre: string
//   description: string | null
//   type_service: string
//   modalite: string
//   tarif_horaire: number | null
//   tarif_forfaitaire: number | null
//   duree_minutes: number
//   nombre_eleves_max: number
//   est_actif: boolean
//   created_at: string
//   updated_at: string
//   precepteur?: {
//     id: number
//     user_id: string
//     commune: string | null
//     quartier: string | null
//     annees_experience: number
//     diplome: string | null
//     note_moyenne: number
//     disponible: boolean
//     telephone?: string
//     user?: {
//       id: string
//       username: string
//       email: string
//       photo_profil?: string
//       genre?: string
//     }
//     precepteur_matieres?: Array<{
//       matiere_id: number
//       matiere: {
//         id: number
//         nom: string
//         niveau: string
//       }
//     }>
//   }
// }

// type Filters = {
//   search: string
//   type_service: string
//   modalite: string
//   tarif_min: number | null
//   tarif_max: number | null
//   duree: string
//   nombre_eleves: string
//   commune: string
//   quartier: string
//   disponible: boolean | null
//   note_min: number | null
//   tri: string
// }

// export default function ServicesPage() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
  
//   const [services, setServices] = useState<Service[]>([])
//   const [filteredServices, setFilteredServices] = useState<Service[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [showFilters, setShowFilters] = useState(false)
  
//   const [filters, setFilters] = useState<Filters>({
//     search: searchParams.get('search') || '',
//     type_service: searchParams.get('type_service') || '',
//     modalite: searchParams.get('modalite') || '',
//     tarif_min: searchParams.get('tarif_min') ? Number(searchParams.get('tarif_min')) : null,
//     tarif_max: searchParams.get('tarif_max') ? Number(searchParams.get('tarif_max')) : null,
//     duree: searchParams.get('duree') || '',
//     nombre_eleves: searchParams.get('nombre_eleves') || '',
//     commune: searchParams.get('commune') || '',
//     quartier: searchParams.get('quartier') || '',
//     disponible: searchParams.get('disponible') === 'true' ? true : 
//                 searchParams.get('disponible') === 'false' ? false : null,
//     note_min: searchParams.get('note_min') ? Number(searchParams.get('note_min')) : null,
//     tri: searchParams.get('tri') || 'recent'
//   })

//   // ✅ Charger les services via l'action serveur
//   const loadServices = useCallback(async () => {
//     setLoading(true)
//     setError(null)
    
//     try {
//       console.log('📡 Chargement des services via action serveur...')
      
//       // ✅ Utiliser l'action serveur
//       const result = await getPublicServices()
      
//       if (result.success) {
//         console.log(`✅ ${result.services.length} services chargés`)
//         setServices(result.services)
//         setFilteredServices(result.services)
//       } else {
//         throw new Error(result.error || 'Erreur inconnue')
//       }
//     } catch (err: any) {
//       console.error('❌ Erreur chargement services:', err)
//       setError(err.message || 'Erreur de chargement')
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   useEffect(() => {
//     loadServices()
//   }, [loadServices])

//   // Appliquer les filtres côté client
//   useEffect(() => {
//     if (services.length === 0) {
//       setFilteredServices([])
//       return
//     }
    
//     let result = [...services]

//     // Filtre recherche
//     if (filters.search) {
//       const searchTerm = filters.search.toLowerCase()
//       result = result.filter(service => 
//         service.titre?.toLowerCase().includes(searchTerm) ||
//         service.description?.toLowerCase().includes(searchTerm) ||
//         service.precepteur?.user?.username?.toLowerCase().includes(searchTerm) ||
//         service.precepteur?.commune?.toLowerCase().includes(searchTerm) ||
//         service.precepteur?.quartier?.toLowerCase().includes(searchTerm) ||
//         service.precepteur?.diplome?.toLowerCase().includes(searchTerm)
//       )
//     }

//     // Filtre type de service
//     if (filters.type_service) {
//       result = result.filter(service => service.type_service === filters.type_service)
//     }

//     // Filtre modalité
//     if (filters.modalite) {
//       result = result.filter(service => service.modalite === filters.modalite)
//     }

//     // Filtre tarif
//     if (filters.tarif_min !== null) {
//       result = result.filter(service => {
//         const prix = service.tarif_horaire || service.tarif_forfaitaire || 0
//         return prix >= filters.tarif_min!
//       })
//     }

//     if (filters.tarif_max !== null) {
//       result = result.filter(service => {
//         const prix = service.tarif_horaire || service.tarif_forfaitaire || 0
//         return prix <= filters.tarif_max!
//       })
//     }

//     // Filtre durée
//     if (filters.duree) {
//       const [min, max] = filters.duree.split('-').map(Number)
//       if (max) {
//         result = result.filter(service => 
//           service.duree_minutes >= min && service.duree_minutes <= max
//         )
//       } else {
//         result = result.filter(service => service.duree_minutes >= min)
//       }
//     }

//     // Filtre nombre d'élèves
//     if (filters.nombre_eleves) {
//       const nbEleves = parseInt(filters.nombre_eleves)
//       result = result.filter(service => service.nombre_eleves_max >= nbEleves)
//     }

//     // Filtre commune
//     if (filters.commune) {
//       result = result.filter(service => 
//         service.precepteur?.commune?.toLowerCase().includes(filters.commune.toLowerCase())
//       )
//     }

//     // Filtre quartier
//     if (filters.quartier) {
//       result = result.filter(service => 
//         service.precepteur?.quartier?.toLowerCase().includes(filters.quartier.toLowerCase())
//       )
//     }

//     // Filtre disponibilité
//     if (filters.disponible !== null) {
//       result = result.filter(service => service.precepteur?.disponible === filters.disponible)
//     }

//     // Filtre note
//     if (filters.note_min !== null) {
//       result = result.filter(service => 
//         (service.precepteur?.note_moyenne || 0) >= filters.note_min!
//       )
//     }

//     // Tri
//     switch (filters.tri) {
//       case 'recent':
//         result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
//         break
//       case 'ancien':
//         result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
//         break
//       case 'prix_croissant':
//         result.sort((a, b) => {
//           const prixA = a.tarif_horaire || a.tarif_forfaitaire || 0
//           const prixB = b.tarif_horaire || b.tarif_forfaitaire || 0
//           return prixA - prixB
//         })
//         break
//       case 'prix_decroissant':
//         result.sort((a, b) => {
//           const prixA = a.tarif_horaire || a.tarif_forfaitaire || 0
//           const prixB = b.tarif_horaire || b.tarif_forfaitaire || 0
//           return prixB - prixA
//         })
//         break
//       case 'note':
//         result.sort((a, b) => (b.precepteur?.note_moyenne || 0) - (a.precepteur?.note_moyenne || 0))
//         break
//       case 'experience':
//         result.sort((a, b) => (b.precepteur?.annees_experience || 0) - (a.precepteur?.annees_experience || 0))
//         break
//     }

//     setFilteredServices(result)
//   }, [services, filters])

//   // Mettre à jour l'URL avec les filtres
//   const updateFilters = (newFilters: Partial<Filters>) => {
//     setFilters(prev => {
//       const updated = { ...prev, ...newFilters }
      
//       const params = new URLSearchParams()
//       Object.entries(updated).forEach(([key, value]) => {
//         if (value !== null && value !== '' && value !== undefined) {
//           params.set(key, String(value))
//         }
//       })
      
//       router.push(`/services?${params.toString()}`, { scroll: false })
      
//       return updated
//     })
//   }

//   // Réinitialiser les filtres
//   const resetFilters = () => {
//     setFilters({
//       search: '',
//       type_service: '',
//       modalite: '',
//       tarif_min: null,
//       tarif_max: null,
//       duree: '',
//       nombre_eleves: '',
//       commune: '',
//       quartier: '',
//       disponible: null,
//       note_min: null,
//       tri: 'recent'
//     })
//     router.push('/services', { scroll: false })
//   }

//   // Compter les filtres actifs
//   const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
//     if (key === 'tri') return value !== 'recent'
//     return value !== null && value !== '' && value !== undefined
//   }).length

//   const getTypeServiceLabel = (type: string) => {
//     const labels: Record<string, string> = {
//       'cours_particulier': 'Cours particulier',
//       'aide_devoirs': 'Aide aux devoirs',
//       'preparation_examens': 'Préparation examens',
//       'soutien_scolaire': 'Soutien scolaire',
//       'autre': 'Autre'
//     }
//     return labels[type] || type
//   }

//   const getModaliteIcon = (modalite: string) => {
//     switch (modalite) {
//       case 'presentiel': return <Home className="w-4 h-4" />
//       case 'en_ligne': return <Wifi className="w-4 h-4" />
//       case 'hybride': return <Users className="w-4 h-4" />
//       default: return null
//     }
//   }

//   const getModaliteLabel = (modalite: string) => {
//     switch (modalite) {
//       case 'presentiel': return 'Présentiel'
//       case 'en_ligne': return 'En ligne'
//       case 'hybride': return 'Hybride'
//       default: return modalite
//     }
//   }

//   // ✅ Rendu (reste identique)
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
//           <p className="text-gray-500">Chargement des services...</p>
//         </div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="text-center max-w-md">
//           <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
//           <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h2>
//           <p className="text-gray-500 mb-6">{error}</p>
//           <button
//             onClick={loadServices}
//             className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
//           >
//             <RefreshCw className="w-5 h-5" />
//             Réessayer
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b">
//         <div className="max-w-7xl mx-auto px-4 py-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Services des précepteurs</h1>
//           <p className="text-gray-600">
//             Découvrez tous les services proposés par nos précepteurs qualifiés
//           </p>
          
//           {/* Barre de recherche */}
//           <div className="mt-6 flex flex-col sm:flex-row gap-3">
//             <div className="flex-1 relative">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Rechercher un service, une matière, une commune..."
//                 value={filters.search}
//                 onChange={(e) => updateFilters({ search: e.target.value })}
//                 className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//               {filters.search && (
//                 <button
//                   onClick={() => updateFilters({ search: '' })}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               )}
//             </div>
            
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors ${
//                 showFilters || activeFiltersCount > 0
//                   ? 'bg-blue-600 text-white'
//                   : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               <SlidersHorizontal className="w-5 h-5" />
//               Filtres
//               {activeFiltersCount > 0 && (
//                 <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
//                   {activeFiltersCount}
//                 </span>
//               )}
//             </button>
            
//             <select
//               value={filters.tri}
//               onChange={(e) => updateFilters({ tri: e.target.value })}
//               className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
//             >
//               <option value="recent">Plus récents</option>
//               <option value="ancien">Plus anciens</option>
//               <option value="prix_croissant">Prix croissant</option>
//               <option value="prix_decroissant">Prix décroissant</option>
//               <option value="note">Mieux notés</option>
//               <option value="experience">Plus expérimentés</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Filtres avancés */}
//       {showFilters && (
//         <div className="bg-white border-b shadow-sm">
//           <div className="max-w-7xl mx-auto px-4 py-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                 <Filter className="w-5 h-5" />
//                 Filtres avancés
//               </h3>
//               <button
//                 onClick={resetFilters}
//                 className="text-sm text-blue-600 hover:text-blue-700 font-medium"
//               >
//                 Réinitialiser les filtres
//               </button>
//             </div>
            
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//               {/* Type de service */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Type de service</label>
//                 <select
//                   value={filters.type_service}
//                   onChange={(e) => updateFilters({ type_service: e.target.value })}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Tous les types</option>
//                   <option value="cours_particulier">Cours particulier</option>
//                   <option value="aide_devoirs">Aide aux devoirs</option>
//                   <option value="preparation_examens">Préparation examens</option>
//                   <option value="soutien_scolaire">Soutien scolaire</option>
//                   <option value="autre">Autre</option>
//                 </select>
//               </div>

//               {/* Modalité */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Modalité</label>
//                 <select
//                   value={filters.modalite}
//                   onChange={(e) => updateFilters({ modalite: e.target.value })}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Toutes les modalités</option>
//                   <option value="presentiel">Présentiel</option>
//                   <option value="en_ligne">En ligne</option>
//                   <option value="hybride">Hybride</option>
//                 </select>
//               </div>

//               {/* Durée */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Durée</label>
//                 <select
//                   value={filters.duree}
//                   onChange={(e) => updateFilters({ duree: e.target.value })}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Toutes les durées</option>
//                   <option value="30-45">30 à 45 minutes</option>
//                   <option value="60-90">1h à 1h30</option>
//                   <option value="120-180">2h à 3h</option>
//                   <option value="180">3h et plus</option>
//                 </select>
//               </div>

//               {/* Nombre d'élèves */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Nombre d'élèves</label>
//                 <select
//                   value={filters.nombre_eleves}
//                   onChange={(e) => updateFilters({ nombre_eleves: e.target.value })}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Peu importe</option>
//                   <option value="1">Individuel (1 élève)</option>
//                   <option value="2">2 élèves minimum</option>
//                   <option value="5">Groupe (5+ élèves)</option>
//                 </select>
//               </div>

//               {/* Commune */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Commune</label>
//                 <input
//                   type="text"
//                   placeholder="Ex: Gombe, Lingwala..."
//                   value={filters.commune}
//                   onChange={(e) => updateFilters({ commune: e.target.value })}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               {/* Quartier */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Quartier</label>
//                 <input
//                   type="text"
//                   placeholder="Quartier spécifique..."
//                   value={filters.quartier}
//                   onChange={(e) => updateFilters({ quartier: e.target.value })}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               {/* Tarif min */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Tarif minimum (FC)</label>
//                 <input
//                   type="number"
//                   placeholder="0"
//                   value={filters.tarif_min || ''}
//                   onChange={(e) => updateFilters({ tarif_min: e.target.value ? Number(e.target.value) : null })}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               {/* Tarif max */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Tarif maximum (FC)</label>
//                 <input
//                   type="number"
//                   placeholder="50000"
//                   value={filters.tarif_max || ''}
//                   onChange={(e) => updateFilters({ tarif_max: e.target.value ? Number(e.target.value) : null })}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             {/* Filtres supplémentaires */}
//             <div className="flex flex-wrap gap-4 mt-4">
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={filters.disponible === true}
//                   onChange={(e) => updateFilters({ disponible: e.target.checked ? true : null })}
//                   className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />
//                 <span className="text-sm text-gray-700">Disponible uniquement</span>
//               </label>
              
//               <div className="flex items-center gap-2">
//                 <span className="text-sm text-gray-700">Note minimum :</span>
//                 <select
//                   value={filters.note_min || ''}
//                   onChange={(e) => updateFilters({ note_min: e.target.value ? Number(e.target.value) : null })}
//                   className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Peu importe</option>
//                   <option value="4">4+ ⭐</option>
//                   <option value="3">3+ ⭐</option>
//                   <option value="2">2+ ⭐</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Résultats */}
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="flex items-center justify-between mb-6">
//           <p className="text-gray-600">
//             <span className="font-semibold text-gray-900">{filteredServices.length}</span> service{filteredServices.length > 1 ? 's' : ''} trouvé{filteredServices.length > 1 ? 's' : ''}
//           </p>
//           <button
//             onClick={loadServices}
//             className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
//           >
//             <RefreshCw className="w-4 h-4" />
//             Actualiser
//           </button>
//         </div>

//         {filteredServices.length === 0 ? (
//           <div className="text-center py-16">
//             <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun service trouvé</h3>
//             <p className="text-gray-500 mb-6">
//               Essayez de modifier vos critères de recherche ou de réinitialiser les filtres.
//             </p>
//             <button
//               onClick={resetFilters}
//               className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
//             >
//               <RefreshCw className="w-5 h-5" />
//               Réinitialiser les filtres
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredServices.map((service) => (
//               <Link
//                 key={service.id}
//                 href={`/services/${service.id}`}
//                 className="bg-white rounded-2xl border hover:shadow-xl transition-all duration-300 group overflow-hidden"
//               >
//                 {/* En-tête avec info précepteur */}
//                 <div className="p-5 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-blue-200">
//                       {service.precepteur?.user?.photo_profil ? (
//                         <img 
//                           src={service.precepteur.user.photo_profil.startsWith('http') 
//                             ? service.precepteur.user.photo_profil 
//                             : `${process.env.NEXT_PUBLIC_API_URL || ''}${service.precepteur.user.photo_profil}`
//                           }
//                           alt={service.precepteur.user.username}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <User className="w-6 h-6 text-blue-400" />
//                       )}
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-gray-900">
//                         {service.precepteur?.user?.username || 'Précepteur'}
//                       </h3>
//                       <div className="flex items-center gap-2 text-xs text-gray-600">
//                         {service.precepteur?.commune && (
//                           <span className="flex items-center gap-1">
//                             <MapPin className="w-3 h-3" />
//                             {service.precepteur.commune}
//                           </span>
//                         )}
//                         {service.precepteur?.note_moyenne && service.precepteur.note_moyenne > 0 && (
//                           <span className="flex items-center gap-1 text-yellow-600">
//                             <Star className="w-3 h-3 fill-yellow-400" />
//                             {service.precepteur.note_moyenne.toFixed(1)}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     {service.precepteur?.disponible && (
//                       <span className="ml-auto flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
//                         <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
//                         Dispo
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Contenu du service */}
//                 <div className="p-5">
//                   <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
//                     {service.titre}
//                   </h4>
                  
//                   {service.description && (
//                     <p className="text-sm text-gray-600 mb-4 line-clamp-2">
//                       {service.description}
//                     </p>
//                   )}

//                   <div className="flex flex-wrap gap-2 mb-4">
//                     <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
//                       <BookOpen className="w-3 h-3" />
//                       {getTypeServiceLabel(service.type_service)}
//                     </span>
//                     <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
//                       {getModaliteIcon(service.modalite)}
//                       {getModaliteLabel(service.modalite)}
//                     </span>
//                   </div>

//                   <div className="flex items-center justify-between text-sm">
//                     <div className="flex items-center gap-3 text-gray-500">
//                       <span className="flex items-center gap-1">
//                         <Clock className="w-4 h-4" />
//                         {service.duree_minutes} min
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <Users className="w-4 h-4" />
//                         {service.nombre_eleves_max}
//                       </span>
//                     </div>
                    
//                     {(service.tarif_horaire || service.tarif_forfaitaire) && (
//                       <span className="font-semibold text-green-600">
//                         {service.tarif_horaire 
//                           ? `${service.tarif_horaire.toLocaleString()} FC/h`
//                           : `${service.tarif_forfaitaire?.toLocaleString()} FC`
//                         }
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Footer */}
//                 <div className="px-5 py-3 bg-gray-50 border-t flex items-center justify-between">
//                   <span className="text-xs text-gray-500">
//                     {(service.precepteur?.annees_experience ?? 0) > 0 && (
//                       <span className="flex items-center gap-1">
//                         <GraduationCap className="w-3 h-3" />
//                         {service.precepteur?.annees_experience} an{service.precepteur.annees_experience > 1 ? 's' : ''} d'exp.
//                       </span>
//                     )}
//                   </span>
//                   <span className="text-blue-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
//                     Voir le détail
//                     <Eye className="w-4 h-4" />
//                   </span>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// app/services/page.tsx - VERSION FINALE AVEC MODAL
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Search, SlidersHorizontal, MapPin, Users, 
  Clock, Tag, BookOpen, Star, Filter, X,
  GraduationCap, Home, Wifi, Eye,
  Loader2, AlertCircle, RefreshCw,
  User, Phone, Mail, Calendar, CheckCircle,
  ChevronLeft, MessageCircle, Share2
} from 'lucide-react'
import { getPublicServices } from '@/actions/services'

// Types
type Service = {
  id: number
  precepteur_id: number
  titre: string
  description: string | null
  type_service: string
  modalite: string
  tarif_horaire: number | null
  tarif_forfaitaire: number | null
  duree_minutes: number
  nombre_eleves_max: number
  est_actif: boolean
  created_at: string
  updated_at: string
  precepteur?: {
    id: number
    user_id: string
    commune: string | null
    quartier: string | null
    annees_experience: number
    diplome: string | null
    note_moyenne: number
    disponible: boolean
    telephone?: string
    user?: {
      id: string
      username: string
      email: string
      photo_profil?: string
      genre?: string
    }
    precepteur_matieres?: Array<{
      matiere_id: number
      matiere: {
        id: number
        nom: string
        niveau: string
      }
    }>
  }
}

type Filters = {
  search: string
  type_service: string
  modalite: string
  tarif_min: number | null
  tarif_max: number | null
  duree: string
  nombre_eleves: string
  commune: string
  quartier: string
  disponible: boolean | null
  note_min: number | null
  tri: string
}

// ✅ Modal de détail d'un service
function ServiceDetailModal({
  service,
  isOpen,
  onClose
}: {
  service: Service | null
  isOpen: boolean
  onClose: () => void
}) {
  if (!isOpen || !service) return null

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  const getPhotoUrl = (photoPath?: string) => {
    if (!photoPath) return null
    if (photoPath.startsWith('http')) return photoPath
    return `${API_URL}${photoPath}`
  }

  const getTypeServiceLabel = (type: string) => {
    const labels: Record<string, string> = {
      'cours_particulier': 'Cours particulier',
      'aide_devoirs': 'Aide aux devoirs',
      'preparation_examens': 'Préparation aux examens',
      'soutien_scolaire': 'Soutien scolaire',
      'autre': 'Autre'
    }
    return labels[type] || type
  }

  const getModaliteLabel = (modalite: string) => {
    const labels: Record<string, string> = {
      'presentiel': 'Présentiel',
      'en_ligne': 'En ligne',
      'hybride': 'Hybride'
    }
    return labels[modalite] || modalite
  }

  const precepteur = service.precepteur

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header avec photo du précepteur */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white p-1 flex-shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                {precepteur?.user?.photo_profil ? (
                  <img 
                    src={getPhotoUrl(precepteur.user.photo_profil) || ''}
                    alt={precepteur.user.username}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                      const parent = (e.target as HTMLImageElement).parentElement
                      if (parent) {
                        const placeholder = parent.querySelector('.photo-placeholder') as HTMLElement
                        if (placeholder) placeholder.style.display = 'flex'
                      }
                    }}
                  />
                ) : null}
                <div className={`photo-placeholder w-full h-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 ${precepteur?.user?.photo_profil ? 'hidden' : 'flex'}`}>
                  <User className="w-8 h-8 text-blue-400" />
                </div>
              </div>
            </div>
            <div className="text-white">
              <h2 className="text-xl font-bold">{precepteur?.user?.username || 'Précepteur'}</h2>
              <div className="flex items-center gap-2 mt-1">
                {precepteur?.commune && (
                  <span className="text-sm text-white/80 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {precepteur.commune}
                  </span>
                )}
                {precepteur?.disponible && (
                  <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    Disponible
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-6">
          {/* Titre du service */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{service.titre}</h3>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                {getTypeServiceLabel(service.type_service)}
              </span>
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                {service.modalite === 'presentiel' ? <Home className="w-4 h-4" /> : 
                 service.modalite === 'en_ligne' ? <Wifi className="w-4 h-4" /> : 
                 <Users className="w-4 h-4" />}
                {getModaliteLabel(service.modalite)}
              </span>
            </div>
          </div>

          {/* Description */}
          {service.description && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          )}

          {/* Infos pratiques */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs">Durée</span>
              </div>
              <p className="font-semibold text-gray-900">{service.duree_minutes} minutes</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs">Élèves max</span>
              </div>
              <p className="font-semibold text-gray-900">{service.nombre_eleves_max} élève{service.nombre_eleves_max > 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Tarifs */}
          {(service.tarif_horaire || service.tarif_forfaitaire) && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Tarification</h4>
              <div className="space-y-2">
                {service.tarif_horaire && service.tarif_horaire > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tarif horaire</span>
                    <span className="text-xl font-bold text-green-700">
                      {service.tarif_horaire.toLocaleString()} FC/h
                    </span>
                  </div>
                )}
                {service.tarif_forfaitaire && service.tarif_forfaitaire > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Forfait</span>
                    <span className="text-xl font-bold text-green-700">
                      {service.tarif_forfaitaire.toLocaleString()} FC
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Infos précepteur */}
          {precepteur && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">À propos du précepteur</h4>
              <div className="space-y-3">
                {precepteur.diplome && (
                  <div className="flex items-center gap-3 text-sm">
                    <GraduationCap className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{precepteur.diplome}</span>
                  </div>
                )}
                {precepteur.annees_experience > 0 && (
                  <div className="flex items-center gap-3 text-sm">
                    <Star className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{precepteur.annees_experience} an{precepteur.annees_experience > 1 ? 's' : ''} d'expérience</span>
                  </div>
                )}
                {precepteur.note_moyenne > 0 && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < Math.floor(precepteur.note_moyenne) 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 font-medium">{precepteur.note_moyenne.toFixed(1)}/5</span>
                  </div>
                )}
                {precepteur.commune && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {precepteur.commune}{precepteur.quartier ? `, ${precepteur.quartier}` : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Matières */}
          {precepteur?.precepteur_matieres && precepteur.precepteur_matieres.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Matières enseignées</h4>
              <div className="flex flex-wrap gap-2">
                {precepteur.precepteur_matieres.map((pm) => (
                  <span 
                    key={pm.matiere_id}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
                  >
                    {pm.matiere?.nom || 'Matière'}
                    {pm.matiere?.niveau && (
                      <span className="text-indigo-400 ml-1">• {pm.matiere.niveau}</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Fermer
            </button>
            <button
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Contacter
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ✅ Page principale
export default function ServicesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  
  // ✅ État pour le modal
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  
  const [filters, setFilters] = useState<Filters>({
    search: searchParams.get('search') || '',
    type_service: searchParams.get('type_service') || '',
    modalite: searchParams.get('modalite') || '',
    tarif_min: searchParams.get('tarif_min') ? Number(searchParams.get('tarif_min')) : null,
    tarif_max: searchParams.get('tarif_max') ? Number(searchParams.get('tarif_max')) : null,
    duree: searchParams.get('duree') || '',
    nombre_eleves: searchParams.get('nombre_eleves') || '',
    commune: searchParams.get('commune') || '',
    quartier: searchParams.get('quartier') || '',
    disponible: searchParams.get('disponible') === 'true' ? true : 
                searchParams.get('disponible') === 'false' ? false : null,
    note_min: searchParams.get('note_min') ? Number(searchParams.get('note_min')) : null,
    tri: searchParams.get('tri') || 'recent'
  })

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

 const getPhotoUrl = (photoPath?: string) => {
  if (!photoPath) return null
  if (photoPath.startsWith('http')) return photoPath
  // ✅ Enlever /api si présent dans l'URL de base
  const baseUrl = API_URL.replace('/api', '')
  return `${baseUrl}${photoPath}`
}

  // Charger les services
  const loadServices = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('📡 Chargement des services...')
      
      const result = await getPublicServices()
      
      if (result.success) {
        console.log(`✅ ${result.services.length} services chargés`)
        setServices(result.services)
        setFilteredServices(result.services)
      } else {
        throw new Error(result.error || 'Erreur inconnue')
      }
    } catch (err: any) {
      console.error('❌ Erreur chargement services:', err)
      setError(err.message || 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadServices()
  }, [loadServices])

  // Appliquer les filtres
  useEffect(() => {
    if (services.length === 0) {
      setFilteredServices([])
      return
    }
    
    let result = [...services]

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      result = result.filter(service => 
        service.titre?.toLowerCase().includes(searchTerm) ||
        service.description?.toLowerCase().includes(searchTerm) ||
        service.precepteur?.user?.username?.toLowerCase().includes(searchTerm) ||
        service.precepteur?.commune?.toLowerCase().includes(searchTerm) ||
        service.precepteur?.quartier?.toLowerCase().includes(searchTerm) ||
        service.precepteur?.diplome?.toLowerCase().includes(searchTerm)
      )
    }

    if (filters.type_service) {
      result = result.filter(service => service.type_service === filters.type_service)
    }

    if (filters.modalite) {
      result = result.filter(service => service.modalite === filters.modalite)
    }

    if (filters.tarif_min !== null) {
      result = result.filter(service => {
        const prix = service.tarif_horaire || service.tarif_forfaitaire || 0
        return prix >= filters.tarif_min!
      })
    }

    if (filters.tarif_max !== null) {
      result = result.filter(service => {
        const prix = service.tarif_horaire || service.tarif_forfaitaire || 0
        return prix <= filters.tarif_max!
      })
    }

    if (filters.duree) {
      const [min, max] = filters.duree.split('-').map(Number)
      if (max) {
        result = result.filter(service => 
          service.duree_minutes >= min && service.duree_minutes <= max
        )
      } else {
        result = result.filter(service => service.duree_minutes >= min)
      }
    }

    if (filters.nombre_eleves) {
      const nbEleves = parseInt(filters.nombre_eleves)
      result = result.filter(service => service.nombre_eleves_max >= nbEleves)
    }

    if (filters.commune) {
      result = result.filter(service => 
        service.precepteur?.commune?.toLowerCase().includes(filters.commune.toLowerCase())
      )
    }

    if (filters.quartier) {
      result = result.filter(service => 
        service.precepteur?.quartier?.toLowerCase().includes(filters.quartier.toLowerCase())
      )
    }

    if (filters.disponible !== null) {
      result = result.filter(service => service.precepteur?.disponible === filters.disponible)
    }

    if (filters.note_min !== null) {
      result = result.filter(service => 
        (service.precepteur?.note_moyenne || 0) >= filters.note_min!
      )
    }

    switch (filters.tri) {
      case 'recent':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'ancien':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case 'prix_croissant':
        result.sort((a, b) => {
          const prixA = a.tarif_horaire || a.tarif_forfaitaire || 0
          const prixB = b.tarif_horaire || b.tarif_forfaitaire || 0
          return prixA - prixB
        })
        break
      case 'prix_decroissant':
        result.sort((a, b) => {
          const prixA = a.tarif_horaire || a.tarif_forfaitaire || 0
          const prixB = b.tarif_horaire || b.tarif_forfaitaire || 0
          return prixB - prixA
        })
        break
      case 'note':
        result.sort((a, b) => (b.precepteur?.note_moyenne || 0) - (a.precepteur?.note_moyenne || 0))
        break
      case 'experience':
        result.sort((a, b) => (b.precepteur?.annees_experience || 0) - (a.precepteur?.annees_experience || 0))
        break
    }

    setFilteredServices(result)
  }, [services, filters])

  const updateFilters = (newFilters: Partial<Filters>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters }
      const params = new URLSearchParams()
      Object.entries(updated).forEach(([key, value]) => {
        if (value !== null && value !== '' && value !== undefined) {
          params.set(key, String(value))
        }
      })
      router.push(`/services?${params.toString()}`, { scroll: false })
      return updated
    })
  }

  const resetFilters = () => {
    setFilters({
      search: '',
      type_service: '',
      modalite: '',
      tarif_min: null,
      tarif_max: null,
      duree: '',
      nombre_eleves: '',
      commune: '',
      quartier: '',
      disponible: null,
      note_min: null,
      tri: 'recent'
    })
    router.push('/services', { scroll: false })
  }

  // ✅ Ouvrir le modal de détail
  const openDetailModal = (service: Service) => {
    setSelectedService(service)
    setShowDetailModal(true)
  }

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'tri') return value !== 'recent'
    return value !== null && value !== '' && value !== undefined
  }).length

  const getTypeServiceLabel = (type: string) => {
    const labels: Record<string, string> = {
      'cours_particulier': 'Cours particulier',
      'aide_devoirs': 'Aide aux devoirs',
      'preparation_examens': 'Préparation examens',
      'soutien_scolaire': 'Soutien scolaire',
      'autre': 'Autre'
    }
    return labels[type] || type
  }

  const getModaliteIcon = (modalite: string) => {
    switch (modalite) {
      case 'presentiel': return <Home className="w-4 h-4" />
      case 'en_ligne': return <Wifi className="w-4 h-4" />
      case 'hybride': return <Users className="w-4 h-4" />
      default: return null
    }
  }

  const getModaliteLabel = (modalite: string) => {
    switch (modalite) {
      case 'presentiel': return 'Présentiel'
      case 'en_ligne': return 'En ligne'
      case 'hybride': return 'Hybride'
      default: return modalite
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">Chargement des services...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={loadServices}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Services des précepteurs</h1>
          <p className="text-gray-600">
            Découvrez tous les services proposés par nos précepteurs qualifiés
          </p>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un service, une matière, une commune..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {filters.search && (
                <button
                  onClick={() => updateFilters({ search: '' })}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors ${
                showFilters || activeFiltersCount > 0
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filtres
              {activeFiltersCount > 0 && (
                <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            
            <select
              value={filters.tri}
              onChange={(e) => updateFilters({ tri: e.target.value })}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="recent">Plus récents</option>
              <option value="ancien">Plus anciens</option>
              <option value="prix_croissant">Prix croissant</option>
              <option value="prix_decroissant">Prix décroissant</option>
              <option value="note">Mieux notés</option>
              <option value="experience">Plus expérimentés</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filtres avancés */}
      {showFilters && (
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtres avancés
              </h3>
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Réinitialiser les filtres
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de service</label>
                <select
                  value={filters.type_service}
                  onChange={(e) => updateFilters({ type_service: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tous les types</option>
                  <option value="cours_particulier">Cours particulier</option>
                  <option value="aide_devoirs">Aide aux devoirs</option>
                  <option value="preparation_examens">Préparation examens</option>
                  <option value="soutien_scolaire">Soutien scolaire</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Modalité</label>
                <select
                  value={filters.modalite}
                  onChange={(e) => updateFilters({ modalite: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Toutes les modalités</option>
                  <option value="presentiel">Présentiel</option>
                  <option value="en_ligne">En ligne</option>
                  <option value="hybride">Hybride</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Durée</label>
                <select
                  value={filters.duree}
                  onChange={(e) => updateFilters({ duree: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Toutes les durées</option>
                  <option value="30-45">30 à 45 minutes</option>
                  <option value="60-90">1h à 1h30</option>
                  <option value="120-180">2h à 3h</option>
                  <option value="180">3h et plus</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre d'élèves</label>
                <select
                  value={filters.nombre_eleves}
                  onChange={(e) => updateFilters({ nombre_eleves: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Peu importe</option>
                  <option value="1">Individuel (1 élève)</option>
                  <option value="2">2 élèves minimum</option>
                  <option value="5">Groupe (5+ élèves)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Commune</label>
                <input
                  type="text"
                  placeholder="Ex: Gombe, Lingwala..."
                  value={filters.commune}
                  onChange={(e) => updateFilters({ commune: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quartier</label>
                <input
                  type="text"
                  placeholder="Quartier spécifique..."
                  value={filters.quartier}
                  onChange={(e) => updateFilters({ quartier: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tarif minimum (FC)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.tarif_min || ''}
                  onChange={(e) => updateFilters({ tarif_min: e.target.value ? Number(e.target.value) : null })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tarif maximum (FC)</label>
                <input
                  type="number"
                  placeholder="50000"
                  value={filters.tarif_max || ''}
                  onChange={(e) => updateFilters({ tarif_max: e.target.value ? Number(e.target.value) : null })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.disponible === true}
                  onChange={(e) => updateFilters({ disponible: e.target.checked ? true : null })}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Disponible uniquement</span>
              </label>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Note minimum :</span>
                <select
                  value={filters.note_min || ''}
                  onChange={(e) => updateFilters({ note_min: e.target.value ? Number(e.target.value) : null })}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Peu importe</option>
                  <option value="4">4+ ⭐</option>
                  <option value="3">3+ ⭐</option>
                  <option value="2">2+ ⭐</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Résultats */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{filteredServices.length}</span> service{filteredServices.length > 1 ? 's' : ''} trouvé{filteredServices.length > 1 ? 's' : ''}
          </p>
          <button
            onClick={loadServices}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
        </div>

        {filteredServices.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun service trouvé</h3>
            <p className="text-gray-500 mb-6">
              Essayez de modifier vos critères de recherche ou de réinitialiser les filtres.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                onClick={() => openDetailModal(service)}
                className="bg-white rounded-2xl border hover:shadow-xl transition-all duration-300 group overflow-hidden cursor-pointer"
              >
                {/* En-tête avec info précepteur */}
                <div className="p-5 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-blue-200">
                      {service.precepteur?.user?.photo_profil ? (
                        <img 
                          src={getPhotoUrl(service.precepteur.user.photo_profil) || ''}
                          alt={service.precepteur.user.username || 'Photo'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                            const parent = (e.target as HTMLImageElement).parentElement
                            if (parent) {
                              const placeholder = parent.querySelector('.photo-placeholder') as HTMLElement
                              if (placeholder) placeholder.style.display = 'flex'
                            }
                          }}
                        />
                      ) : null}
                      <div className={`photo-placeholder w-full h-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 ${service.precepteur?.user?.photo_profil ? 'hidden' : 'flex'}`}>
                        <User className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {service.precepteur?.user?.username || 'Précepteur'}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        {service.precepteur?.commune && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {service.precepteur.commune}
                          </span>
                        )}
                        {service.precepteur?.note_moyenne && service.precepteur.note_moyenne > 0 && (
                          <span className="flex items-center gap-1 text-yellow-600">
                            <Star className="w-3 h-3 fill-yellow-400" />
                            {service.precepteur.note_moyenne.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                    {service.precepteur?.disponible && (
                      <span className="ml-auto flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Dispo
                      </span>
                    )}
                  </div>
                </div>

                {/* Contenu du service */}
                <div className="p-5">
                  <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {service.titre}
                  </h4>
                  
                  {service.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {service.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      <BookOpen className="w-3 h-3" />
                      {getTypeServiceLabel(service.type_service)}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                      {getModaliteIcon(service.modalite)}
                      {getModaliteLabel(service.modalite)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {service.duree_minutes} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {service.nombre_eleves_max}
                      </span>
                    </div>
                    
                    {(service.tarif_horaire || service.tarif_forfaitaire) && (
                      <span className="font-semibold text-green-600">
                        {service.tarif_horaire 
                          ? `${service.tarif_horaire.toLocaleString()} FC/h`
                          : `${service.tarif_forfaitaire?.toLocaleString()} FC`
                        }
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 bg-gray-50 border-t flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {(service.precepteur?.annees_experience ?? 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" />
                        {service.precepteur?.annees_experience} an{(service.precepteur?.annees_experience ?? 0) > 1 ? 's' : ''} d'exp.
                      </span>
                    )}
                  </span>
                  <span className="text-blue-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Voir le détail
                    <Eye className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Modal de détail */}
      <ServiceDetailModal
        service={selectedService}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedService(null)
        }}
      />
    </div>
  )
}