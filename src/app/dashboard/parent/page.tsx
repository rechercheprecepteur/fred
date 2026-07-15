
// // app/dashboard/parent/page.tsx
// 'use client'

// import { useAuth } from '@/context/AuthContext'
// import { updateProfilePhoto } from '@/actions/auth'
// import { ajouterEnfant, supprimerEnfant, getElevesParent } from '@/actions/eleves'
// import { creerService, getServicesParent, supprimerService } from '@/actions/parent-service'
// import { useState, useEffect, useCallback } from 'react'
// import Link from 'next/link'
// import { 
//   User, Calendar, BookOpen, GraduationCap, Plus, Trash2, Upload,
//   Search, Eye, Clock, Check, X, AlertCircle, Users, FileText,
//   Building2, ChevronRight, Mail, Briefcase, MapPin, DollarSign,
//   MessageSquare, Send, Star, Loader2, UserCheck
// } from 'lucide-react'
// import Loader from '@/components/Loader'

// // Types
// type Eleve = {
//   id: string
//   parent_id: string
//   nom: string
//   postnom: string | null
//   prenom: string
//   genre: string
//   date_naissance: string | null
//   niveau: string
//   ecole: string | null
// }

// type ServiceParent = {
//   id: string
//   parent_id: string
//   eleve_id: string
//   titre: string
//   description: string
//   matiere_preferee: string | null
//   niveau_eleve: string
//   frequence_souhaitee: string
//   jours_preferences: string | null
//   heures_preferences: string | null
//   budget_horaire: number | null
//   lieu_preference: string
//   statut: string
//   nombre_vues: number
//   nombre_candidatures: number
//   date_creation: string
//   date_expiration: string | null
//   eleve: {
//     nom: string
//     prenom: string
//     niveau: string
//   } | null
// }

// // 🆕 Type pour les candidatures
// type Candidature = {
//   id: string
//   service_parent_id: string
//   precepteur_id: number
//   message: string
//   tarif_propose: number | null
//   disponibilites: string | null
//   statut: string
//   created_at: string
//   precepteur: {
//     id: number
//     user_id: string
//     commune: string | null
//     quartier: string | null
//     annees_experience: number
//     diplome: string | null
//     note_moyenne: number
//     disponible: boolean
//     user: {
//       id: string
//       username: string
//       photo_profil: string | null
//     } | null
//   } | null
// }

// // 🆕 Type pour le contrat
// type ContratForm = {
//   date_debut: string
//   duree: string
//   tarif_final: number
//   notes: string
// }

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// export default function ParentDashboard() {
//   const { user, updateUser } = useAuth()
//   const [uploading, setUploading] = useState(false)
//   const [activeTab, setActiveTab] = useState('enfants')
//   const [eleves, setEleves] = useState<Eleve[]>([])
//   const [services, setServices] = useState<ServiceParent[]>([])
//   const [loading, setLoading] = useState(true)
//   const [showModal, setShowModal] = useState(false)
//   const [showServiceModal, setShowServiceModal] = useState(false)
//   const [formError, setFormError] = useState('')
//   const [submitting, setSubmitting] = useState(false)
//   const [message, setMessage] = useState('')
//   const [deletingEnfant, setDeletingEnfant] = useState<string | null>(null)
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState<{id: string, nom: string} | null>(null)
//   const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null)

//   // 🆕 États pour les candidatures
//   const [candidatures, setCandidatures] = useState<Candidature[]>([])
//   const [loadingCandidatures, setLoadingCandidatures] = useState(false)
//   const [selectedServiceForCandidatures, setSelectedServiceForCandidatures] = useState<string | null>(null)
  
//   // 🆕 États pour le contrat
//   const [showContratModal, setShowContratModal] = useState(false)
//   const [selectedCandidatureForContrat, setSelectedCandidatureForContrat] = useState<Candidature | null>(null)
//   const [selectedServiceForContrat, setSelectedServiceForContrat] = useState<ServiceParent | null>(null)
//   const [contratForm, setContratForm] = useState<ContratForm>({
//     date_debut: '',
//     duree: '1_mois',
//     tarif_final: 0,
//     notes: ''
//   })
//   const [contratSuccess, setContratSuccess] = useState('')
//   const [contratError, setContratError] = useState('')

//   // Charger les données
//   const loadData = useCallback(async () => {
//     if (!user?.id) return;
    
//     setLoading(true)
//     try {
//       console.log('🔄 Chargement des données parent...')
//       const [elevesResult, servicesResult] = await Promise.all([
//         getElevesParent(),
//         getServicesParent()
//       ])
      
//       console.log('📦 Élèves chargés:', elevesResult.eleves?.length || 0)
//       console.log('📦 Services chargés:', servicesResult.services?.length || 0)
      
//       if (elevesResult.eleves) setEleves(elevesResult.eleves)
//       if (servicesResult.services) {
//         setServices(servicesResult.services)
//       }
//     } catch (error) {
//       console.error('❌ Erreur chargement données:', error)
//     } finally {
//       setLoading(false)
//     }
//   }, [user?.id])

//   useEffect(() => {
//     if (user?.id) {
//       loadData()
//     }
//   }, [user?.id, loadData])

//   const forceReload = useCallback(async () => {
//     await loadData()
//   }, [loadData])

// const loadCandidatures = async (serviceId: string) => {
//   setLoadingCandidatures(true)
//   setSelectedServiceForCandidatures(serviceId)
  
//   try {
//     const token = localStorage.getItem('excellence-token')
//     if (!token) {
//       console.error('❌ Pas de token')
//       return
//     }

//     console.log('🔍 Chargement candidatures pour service:', serviceId)
//     console.log('🔑 Token présent:', !!token)
    
//     const url = `${API_URL}/auth/candidatures/service/${serviceId}`
//     console.log('📡 URL:', url)
    
//     const response = await fetch(url, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     })

//     console.log('📥 Status:', response.status)
    
//     const data = await response.json()
//     console.log('📦 Données reçues:', data)
    
//     if (data.success) {
//       console.log('✅ Candidatures:', data.candidatures?.length || 0)
//       setCandidatures(data.candidatures || [])
//     } else {
//       console.error('❌ Erreur API:', data.error || data.message)
//     }
//   } catch (err) {
//     console.error('❌ Erreur chargement candidatures:', err)
//   } finally {
//     setLoadingCandidatures(false)
//   }
// }

//   // 🆕 Créer un contrat
//   const handleCreateContrat = (candidature: Candidature, service: ServiceParent) => {
//     setSelectedCandidatureForContrat(candidature)
//     setSelectedServiceForContrat(service)
//     setContratForm({
//       date_debut: new Date().toISOString().split('T')[0],
//       duree: '1_mois',
//       tarif_final: candidature.tarif_propose || service.budget_horaire || 0,
//       notes: `Contrat pour ${service.titre}`
//     })
//     setContratSuccess('')
//     setContratError('')
//     setShowContratModal(true)
//   }

//   const submitContrat = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setSubmitting(true)
//     setContratError('')
//     setContratSuccess('')

//     try {
//       const token = localStorage.getItem('excellence-token')
//       if (!token) throw new Error('Non connecté')

//       const response = await fetch(`${API_URL}/auth/contracts`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           service_parent_id: selectedServiceForContrat?.id,
//           precepteur_id: selectedCandidatureForContrat?.precepteur_id,
//           date_debut: contratForm.date_debut,
//           duree: contratForm.duree,
//           tarif_final: contratForm.tarif_final,
//           notes: contratForm.notes
//         })
//       })

//       const data = await response.json()
//       if (!response.ok) throw new Error(data.error || 'Erreur')

//       setContratSuccess('✅ Contrat créé avec succès !')
//       setTimeout(() => {
//         setShowContratModal(false)
//         setContratSuccess('')
//         loadCandidatures(selectedServiceForCandidatures!)
//       }, 2000)

//     } catch (err: any) {
//       setContratError(err.message)
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   // Upload photo
//   const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (!file) return
    
//     setUploading(true)
//     try {
//       const result = await updateProfilePhoto(file)
//       if (result.success && result.photoUrl) {
//         updateUser({ photo_profil: result.photoUrl })
//         setMessage('✅ Photo mise à jour avec succès')
//       } else {
//         setMessage(result.error || 'Erreur lors de la mise à jour')
//       }
//     } catch (error) {
//       setMessage('Erreur lors de la mise à jour')
//     }
//     setUploading(false)
//     setTimeout(() => setMessage(''), 3000)
//   }

//   // Ajouter enfant
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
//         setMessage('✅ Enfant ajouté avec succès')
//         setTimeout(() => setMessage(''), 3000)
//         await forceReload()
//       }
//     } catch (error) {
//       setFormError("Erreur lors de l'ajout")
//     }
    
//     setSubmitting(false)
//   }

//   // Supprimer enfant
//   const handleSupprimerEnfant = async (eleveId: string) => {
//     setDeletingEnfant(eleveId)
//     try {
//       const result = await supprimerEnfant(parseInt(eleveId))
//       if (result.success) {
//         setMessage('✅ Enfant supprimé avec succès')
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

//   const handleCreerService = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     setFormError('')
//     setSubmitting(true)
    
//     try {
//       const formData = new FormData(e.currentTarget)
//       const eleveId = formData.get('eleve_id') as string
      
//       const result = await creerService({
//         eleve_id: eleveId,
//         titre: formData.get('titre') as string,
//         description: formData.get('description') as string,
//         matiere_preferee: formData.get('matiere_preferee') as string,
//         niveau_eleve: formData.get('niveau_eleve') as string,
//         frequence_souhaitee: formData.get('frequence_souhaitee') as string,
//         jours_preferences: formData.get('jours_preferences') as string,
//         heures_preferences: formData.get('heures_preferences') as string,
//         budget_horaire: formData.get('budget_horaire') ? parseFloat(formData.get('budget_horaire') as string) : undefined,
//         lieu_preference: formData.get('lieu_preference') as string,
//       })
      
//       if (result.error) {
//         setFormError(result.error)
//       } else {
//         setShowServiceModal(false)
//         setMessage('✅ Service créé avec succès')
//         setTimeout(() => setMessage(''), 3000)
//         await forceReload()
//       }
//     } catch (error) {
//       setFormError("Erreur lors de la création du service")
//     }
    
//     setSubmitting(false)
//   }

//   // Supprimer service
//   const handleSupprimerService = async () => {
//     if (!deleteServiceId) return
    
//     setSubmitting(true)
//     try {
//       const result = await supprimerService(parseInt(deleteServiceId))
//       if (result.success) {
//         setMessage('✅ Service supprimé avec succès')
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
//     setSubmitting(false)
//     setDeleteServiceId(null)
//   }

//   // Helpers UI
//   const getStatutColor = (statut: string) => {
//     switch (statut) {
//       case 'en_attente': return 'bg-yellow-100 text-yellow-800'
//       case 'accepte': return 'bg-blue-100 text-blue-800'
//       case 'actif': return 'bg-green-100 text-green-800'
//       case 'pourvu': return 'bg-green-100 text-green-800'
//       case 'en_cours': return 'bg-blue-100 text-blue-800'
//       case 'refuse': return 'bg-red-100 text-red-800'
//       case 'termine': return 'bg-gray-100 text-gray-800'
//       case 'annule': return 'bg-red-100 text-red-800'
//       case 'expire': return 'bg-gray-100 text-gray-800'
//       default: return 'bg-gray-100 text-gray-800'
//     }
//   }

//   const getStatutIcon = (statut: string) => {
//     switch (statut) {
//       case 'en_attente': return <Clock className="w-3.5 h-3.5" />
//       case 'accepte': case 'actif': case 'pourvu': case 'en_cours': 
//         return <Check className="w-3.5 h-3.5" />
//       case 'refuse': case 'annule': return <X className="w-3.5 h-3.5" />
//       case 'termine': return <Check className="w-3.5 h-3.5" />
//       case 'expire': return <AlertCircle className="w-3.5 h-3.5" />
//       default: return <AlertCircle className="w-3.5 h-3.5" />
//     }
//   }

//   const getFrequenceLabel = (frequence: string) => {
//     switch (frequence) {
//       case 'unique': return 'Ponctuel'
//       case 'hebdomadaire': return 'Hebdomadaire'
//       case 'bi-hebdomadaire': return '2x/semaine'
//       case 'mensuel': return 'Mensuel'
//       default: return frequence
//     }
//   }

//   const formatDate = (date: string) => {
//     return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
//   }

//   const getPhotoUrl = (photoPath: string | null | undefined) => {
//     if (!photoPath) return null
//     if (photoPath.startsWith('http')) return photoPath
//     const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001'
//     return `${baseUrl}${photoPath}`
//   }

//   // 🆕 Compter les candidatures totales
//   const totalCandidatures = services.reduce((sum, s) => sum + (s.nombre_candidatures || 0), 0)

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="w-20"><Loader /></div>
//       </div>
//     )
//   }

//   if (!user) return null

//   const servicesActifs = services.filter(s => s.statut === 'actif' || s.statut === 'en_cours').length

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
//           <div className="relative group flex-shrink-0 mx-auto md:mx-0">
//             {user.photo_profil ? (
//               <img 
//                 src={user.photo_profil.startsWith('http') ? user.photo_profil : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001'}${user.photo_profil}`}
//                 alt="Profile" 
//                 className="w-24 h-24 rounded-full object-cover" 
//                 onError={(e) => {
//                   e.currentTarget.style.display = 'none'
//                   const placeholder = e.currentTarget.nextElementSibling as HTMLElement
//                   if (placeholder) placeholder.style.display = 'flex'
//                 }}
//               />
//             ) : null}
//             <div className={`w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center ${user.photo_profil ? 'hidden' : 'flex'}`}>
//               <User className="w-10 h-10 text-gray-400" />
//             </div>
//             <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
//               {uploading ? (
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//               ) : (
//                 <Upload className="w-5 h-5 text-white" />
//               )}
//               <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
//             </label>
//           </div>

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
//           </div>

//           <div className="flex flex-wrap gap-2 justify-center md:justify-start">
//             <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-colors flex items-center gap-2">
//               <Plus className="w-4 h-4" /> Ajouter un enfant
//             </button>
//             <button onClick={() => setShowServiceModal(true)} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-md">
//               <Briefcase className="w-4 h-4" /> Solliciter un service
//             </button>
//             <Link href="/recherche" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
//               <Search className="w-4 h-4" /> Rechercher
//             </Link>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <div className="p-4 bg-blue-50 rounded-xl">
//             <p className="text-2xl font-bold text-blue-600">{eleves.length}</p>
//             <p className="text-sm text-gray-600 flex items-center gap-1"><Users className="w-3 h-3" /> Enfants</p>
//           </div>
//           <div className="p-4 bg-green-50 rounded-xl">
//             <p className="text-2xl font-bold text-green-600">{services.length}</p>
//             <p className="text-sm text-gray-600 flex items-center gap-1"><Briefcase className="w-3 h-3" /> Services</p>
//           </div>
//           <div className="p-4 bg-purple-50 rounded-xl">
//             <p className="text-2xl font-bold text-purple-600">{totalCandidatures}</p>
//             <p className="text-sm text-gray-600 flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Candidatures</p>
//           </div>
//           <div className="p-4 bg-orange-50 rounded-xl">
//             <p className="text-2xl font-bold text-orange-600">{servicesActifs}</p>
//             <p className="text-sm text-gray-600 flex items-center gap-1"><Check className="w-3 h-3" /> Actifs</p>
//           </div>
//         </div>
//       </div>

//       {/* ========== TABS ========== */}
//       <div className="flex gap-4 mb-6 flex-wrap">
//         <button onClick={() => { setActiveTab('enfants'); setSelectedServiceForCandidatures(null) }}
//           className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'enfants' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
//           <Users className="w-4 h-4" /> Enfants ({eleves.length})
//         </button>
//         <button onClick={() => { setActiveTab('services'); setSelectedServiceForCandidatures(null) }}
//           className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'services' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
//           <Briefcase className="w-4 h-4" /> Services ({services.length})
//         </button>
//         <button onClick={() => setActiveTab('candidatures')}
//           className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'candidatures' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
//           <MessageSquare className="w-4 h-4" /> Candidatures ({totalCandidatures})
//         </button>
//       </div>

//       {/* ========== ONGLET ENFANTS ========== */}
//       {activeTab === 'enfants' && (
//         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
//             <div>
//               <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Users className="w-5 h-5 text-gray-700" />Mes enfants</h3>
//               <p className="text-sm text-gray-500 mt-0.5">{eleves.length} enfant{eleves.length > 1 ? 's' : ''} inscrit{eleves.length > 1 ? 's' : ''}</p>
//             </div>
//             <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium">
//               <Plus className="w-4 h-4" /> Ajouter
//             </button>
//           </div>

//           {eleves.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 px-6">
//               <Users className="w-16 h-16 text-gray-300 mb-4" />
//               <p className="text-gray-500 text-lg font-medium mb-1">Aucun enfant inscrit</p>
//               <p className="text-gray-400 text-sm mb-6">Ajoutez votre premier enfant pour commencer</p>
//               <button onClick={() => setShowModal(true)} className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium text-sm">
//                 <Plus className="w-4 h-4" /> Ajouter un enfant
//               </button>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-100">
//               {eleves.map((eleve) => (
//                 <div key={eleve.id} className="p-4 hover:bg-gray-50/50 transition-colors group">
//                   <div className="flex items-center gap-4">
//                     <div className="flex-shrink-0">
//                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${eleve.genre === 'M' ? 'bg-blue-100' : 'bg-pink-100'}`}>
//                         <span className={`text-lg font-bold ${eleve.genre === 'M' ? 'text-blue-600' : 'text-pink-600'}`}>{eleve.prenom[0]}{eleve.nom[0]}</span>
//                       </div>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="font-medium text-gray-900">{eleve.prenom} {eleve.nom} {eleve.postnom}</p>
//                       <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
//                         <span className="inline-flex items-center gap-1"><GraduationCap className="w-3 h-3" /> {eleve.niveau}</span>
//                         {eleve.ecole && <><span>•</span><span className="inline-flex items-center gap-1"><Building2 className="w-3 h-3" /> {eleve.ecole}</span></>}
//                         <span>•</span><span>{eleve.genre === 'M' ? 'Garçon' : 'Fille'}</span>
//                         {eleve.date_naissance && <><span>•</span><span>{formatDate(eleve.date_naissance)}</span></>}
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <Link href={`/dashboard/parent/suivi/${eleve.id}`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Suivi"><Eye className="w-4 h-4" /></Link>
//                       <button onClick={() => setShowDeleteConfirm({ id: eleve.id, nom: `${eleve.prenom} ${eleve.nom}` })} disabled={deletingEnfant === eleve.id} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50" title="Supprimer">
//                         {deletingEnfant === eleve.id ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div> : <Trash2 className="w-4 h-4" />}
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

//       {/* ========== ONGLET SERVICES ========== */}
//       {activeTab === 'services' && (
//         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
//             <div>
//               <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Briefcase className="w-5 h-5 text-gray-700" />Mes sollicitations de service</h3>
//               <p className="text-sm text-gray-500 mt-0.5">{services.length} service{services.length > 1 ? 's' : ''} publié{services.length > 1 ? 's' : ''}</p>
//             </div>
//             <button onClick={() => setShowServiceModal(true)} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 font-medium shadow-md">
//               <Plus className="w-4 h-4" /> Nouveau service
//             </button>
//           </div>

//           {services.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 px-6">
//               <Briefcase className="w-16 h-16 text-gray-300 mb-4" />
//               <p className="text-gray-500 text-lg font-medium mb-1">Aucune sollicitation</p>
//               <p className="text-gray-400 text-sm mb-6">Publiez votre première demande de service</p>
//               <button onClick={() => setShowServiceModal(true)} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 font-medium text-sm shadow-md">
//                 <Plus className="w-4 h-4" /> Créer une sollicitation
//               </button>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-100">
//               {services.map((service) => (
//                 <div key={service.id} className="p-4 hover:bg-gray-50/50 transition-colors group">
//                   <div className="flex items-start gap-4">
//                     <div className="flex-shrink-0">
//                       <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
//                         <Briefcase className="w-5 h-5 text-blue-600" />
//                       </div>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 mb-1">
//                         <p className="font-medium text-gray-900 truncate">{service.titre}</p>
//                         <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatutColor(service.statut || 'inconnu')}`}>
//                           {getStatutIcon(service.statut || 'inconnu')}{service.statut ? service.statut.replace('_', ' ') : 'Inconnu'}
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-600 mb-2 line-clamp-2">{service.description}</p>
//                       <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
//                         <span className="flex items-center gap-1"><User className="w-3 h-3" /> {service.eleve?.prenom} {service.eleve?.nom}</span>
//                         {service.matiere_preferee && <><span>•</span><span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {service.matiere_preferee}</span></>}
//                         <span>•</span><span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {getFrequenceLabel(service.frequence_souhaitee)}</span>
//                         {service.budget_horaire && <><span>•</span><span className="flex items-center gap-1 text-green-600 font-medium"><DollarSign className="w-3 h-3" /> {service.budget_horaire.toLocaleString()} FC/h</span></>}
//                       </div>
//                       <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
//                         <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {service.nombre_vues} vues</span>
//                         <button onClick={(e) => { e.stopPropagation(); loadCandidatures(service.id); setActiveTab('candidatures'); }}
//                           className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
//                           <Users className="w-3 h-3" /> {service.nombre_candidatures} candidature{service.nombre_candidatures > 1 ? 's' : ''} →
//                         </button>
//                         <span>Créé le {formatDate(service.date_creation)}</span>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
//                       <button onClick={() => setDeleteServiceId(service.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* ========== 🆕 ONGLET CANDIDATURES ========== */}
//       {activeTab === 'candidatures' && (
//         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
//             <div>
//               <h3 className="font-semibold text-gray-900 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-gray-700" />Candidatures reçues</h3>
//               <p className="text-sm text-gray-500 mt-0.5">
//                 {selectedServiceForCandidatures ? 'Candidatures pour un service spécifique' : 'Sélectionnez un service pour voir ses candidatures'}
//               </p>
//             </div>
//             {selectedServiceForCandidatures && (
//               <button onClick={() => { setSelectedServiceForCandidatures(null); setCandidatures([]); }}
//                 className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
//                 <X className="w-4 h-4" /> Voir tous les services
//               </button>
//             )}
//           </div>

//           {!selectedServiceForCandidatures ? (
//             // Liste des services avec candidatures
//             <div className="divide-y divide-gray-100">
//               {services.filter(s => s.nombre_candidatures > 0).length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-16 px-6">
//                   <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
//                   <p className="text-gray-500 text-lg font-medium mb-1">Aucune candidature</p>
//                   <p className="text-gray-400 text-sm">Les candidatures apparaîtront ici quand des précepteurs postuleront à vos services.</p>
//                 </div>
//               ) : (
//                 services.filter(s => s.nombre_candidatures > 0).map((service) => (
//                   <div key={service.id} onClick={() => loadCandidatures(service.id)}
//                     className="p-4 hover:bg-gray-50/50 transition-colors cursor-pointer flex items-center justify-between">
//                     <div>
//                       <p className="font-medium text-gray-900">{service.titre}</p>
//                       <p className="text-sm text-gray-500">{service.matiere_preferee} • {service.niveau_eleve}</p>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
//                         {service.nombre_candidatures} candidature{service.nombre_candidatures > 1 ? 's' : ''}
//                       </span>
//                       <ChevronRight className="w-5 h-5 text-gray-400" />
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           ) : loadingCandidatures ? (
//             <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
//           ) : candidatures.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 px-6">
//               <Users className="w-16 h-16 text-gray-300 mb-4" />
//               <p className="text-gray-500 text-lg font-medium mb-1">Aucune candidature pour ce service</p>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-100">
//               {candidatures.map((candidature) => (
//                 <div key={candidature.id} className="p-4 hover:bg-gray-50/50 transition-colors">
//                   <div className="flex items-start gap-4">
//                     <div className="flex-shrink-0">
//                       {candidature.precepteur?.user?.photo_profil ? (
//                         <img src={getPhotoUrl(candidature.precepteur.user.photo_profil) || ''} alt="" className="w-12 h-12 rounded-full object-cover" />
//                       ) : (
//                         <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
//                           <User className="w-6 h-6 text-gray-400" />
//                         </div>
//                       )}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 mb-1">
//                         <p className="font-semibold text-gray-900">
//                           {candidature.precepteur?.user?.username || 'Précepteur'}
//                         </p>
//                         {candidature.precepteur?.note_moyenne !== undefined && candidature.precepteur.note_moyenne > 0 && (
//                           <span className="flex items-center gap-1 text-yellow-600 text-sm">
//                             <Star className="w-4 h-4 fill-yellow-400" />
//                             {candidature.precepteur.note_moyenne.toFixed(1)}
//                           </span>
//                         )}
//                         <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
//                           candidature.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' : 
//                           candidature.statut === 'acceptee' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                         }`}>
//                           {candidature.statut === 'en_attente' ? 'En attente' : candidature.statut}
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-600 mb-2">{candidature.message}</p>
//                       <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
//                         {candidature.tarif_propose && (
//                           <span className="flex items-center gap-1 text-green-600 font-medium">
//                             <DollarSign className="w-3 h-3" /> {candidature.tarif_propose.toLocaleString()} FC/h
//                           </span>
//                         )}
//                         {candidature.disponibilites && (
//                           <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {candidature.disponibilites}</span>
//                         )}
//                         {candidature.precepteur?.commune && (
//                           <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {candidature.precepteur.commune}</span>
//                         )}
//                         <span>{formatDate(candidature.created_at)}</span>
//                       </div>
//                     </div>
//                     <div className="flex-shrink-0">
//                       <button onClick={() => {
//                         const service = services.find(s => s.id === candidature.service_parent_id)
//                         if (service) handleCreateContrat(candidature, service)
//                       }}
//                         className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium">
//                         <FileText className="w-4 h-4" />
//                         Créer un contrat
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* ========== 🆕 MODAL CONTRAT ========== */}
//       {showContratModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b flex justify-between items-center">
//               <h2 className="text-xl font-semibold flex items-center gap-2"><FileText className="w-5 h-5 text-green-600" />Créer un contrat</h2>
//               <button onClick={() => setShowContratModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
//             </div>
//             <form onSubmit={submitContrat} className="p-6 space-y-4">
//               <div className="bg-green-50 rounded-xl p-4">
//                 <p className="text-sm font-medium text-green-900">{selectedServiceForContrat?.titre}</p>
//                 <p className="text-xs text-green-700 mt-1">
//                   Avec : {selectedCandidatureForContrat?.precepteur?.user?.username} • 
//                   {selectedCandidatureForContrat?.tarif_propose ? ` ${selectedCandidatureForContrat.tarif_propose.toLocaleString()} FC/h` : ''}
//                 </p>
//               </div>

//               {contratSuccess && (<div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm flex items-center gap-2"><Check className="w-4 h-4" /> {contratSuccess}</div>)}
//               {contratError && (<div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {contratError}</div>)}

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Date de début *</label>
//                 <input type="date" value={contratForm.date_debut} onChange={(e) => setContratForm({...contratForm, date_debut: e.target.value})} required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Durée *</label>
//                 <select value={contratForm.duree} onChange={(e) => setContratForm({...contratForm, duree: e.target.value})} required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
//                   <option value="1_mois">1 mois</option><option value="3_mois">3 mois</option><option value="6_mois">6 mois</option>
//                   <option value="12_mois">1 an</option><option value="indetermine">Durée indéterminée</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Tarif final (FC/h) *</label>
//                 <input type="number" value={contratForm.tarif_final} onChange={(e) => setContratForm({...contratForm, tarif_final: Number(e.target.value)})} required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" min="0" step="1000" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
//                 <textarea value={contratForm.notes} onChange={(e) => setContratForm({...contratForm, notes: e.target.value})} rows={3}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
//               </div>
//               <div className="flex gap-2 pt-2">
//                 <button type="button" onClick={() => setShowContratModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">Annuler</button>
//                 <button type="submit" disabled={submitting} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50">
//                   {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />Création...</> : <><FileText className="w-4 h-4" />Créer le contrat</>}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* ========== MODAL AJOUT ENFANT ========== */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b flex justify-between items-center">
//               <h2 className="text-xl font-semibold flex items-center gap-2"><Plus className="w-5 h-5" />Ajouter un enfant</h2>
//               <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
//             </div>
//             <form onSubmit={handleAjouterEnfant} className="p-6 space-y-4">
//               {formError && (<div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{formError}</div>)}
//               <div className="grid grid-cols-2 gap-4">
//                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label><input type="text" name="prenom" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Marie" /></div>
//                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label><input type="text" name="nom" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Kyungu" /></div>
//                 <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Postnom</label><input type="text" name="postnom" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Kunta" /></div>
//                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Genre *</label><select name="genre" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"><option value="M">Masculin</option><option value="F">Féminin</option></select></div>
//                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label><input type="date" name="date_naissance" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" /></div>
//                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Niveau *</label><select name="niveau" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"><option value="7ème">7ème année</option><option value="8ème">8ème année</option></select></div>
//                 <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">École</label><input type="text" name="ecole" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Collège Saint Joseph" /></div>
//               </div>
//               <div className="flex gap-2 pt-2">
//                 <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">Annuler</button>
//                 <button type="submit" disabled={submitting} className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm flex items-center justify-center gap-2">
//                   {submitting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <><Plus className="w-4 h-4" />Ajouter</>}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* ========== MODAL CREATION SERVICE ========== */}
//       {showServiceModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b flex justify-between items-center">
//               <h2 className="text-xl font-semibold flex items-center gap-2"><Briefcase className="w-5 h-5 text-blue-600" />Solliciter un service</h2>
//               <button onClick={() => setShowServiceModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
//             </div>
//             <form onSubmit={handleCreerService} className="p-6 space-y-4">
//               {formError && (<div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{formError}</div>)}
//               <div><label className="block text-sm font-medium text-gray-700 mb-1">Pour quel enfant ? *</label>
//                 <select name="eleve_id" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
//                   <option value="">Sélectionnez un enfant</option>
//                   {eleves.map(eleve => (<option key={eleve.id} value={eleve.id}>{eleve.prenom} {eleve.nom} - {eleve.niveau}</option>))}
//                 </select>
//               </div>
//               <div><label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label><input type="text" name="titre" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Ex: Cours de mathématiques" /></div>
//               <div><label className="block text-sm font-medium text-gray-700 mb-1">Description *</label><textarea name="description" required rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Décrivez vos besoins..." /></div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Matière</label><select name="matiere_preferee" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"><option value="">Toutes</option><option value="Mathématiques">Mathématiques</option><option value="Français">Français</option><option value="Anglais">Anglais</option></select></div>
//                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Niveau *</label><select name="niveau_eleve" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"><option value="7ème">7ème</option><option value="8ème">8ème</option></select></div>
//                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Fréquence *</label><select name="frequence_souhaitee" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"><option value="unique">Ponctuel</option><option value="hebdomadaire">Hebdomadaire</option><option value="bi-hebdomadaire">2x/semaine</option></select></div>
//                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label><select name="lieu_preference" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"><option value="domicile">Domicile</option><option value="en_ligne">En ligne</option></select></div>
//                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Budget (FC/h)</label><input type="number" name="budget_horaire" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="5000" /></div>
//               </div>
//               <div className="flex gap-2 pt-2">
//                 <button type="button" onClick={() => setShowServiceModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">Annuler</button>
//                 <button type="submit" disabled={submitting} className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-sm flex items-center justify-center gap-2 shadow-md">
//                   {submitting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <><Briefcase className="w-4 h-4" />Publier</>}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* ========== MODAL SUPPRESSION ENFANT ========== */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
//             <div className="p-6 text-center">
//               <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-600" /></div>
//               <h3 className="text-lg font-semibold mb-2">Supprimer {showDeleteConfirm.nom} ?</h3>
//               <p className="text-sm text-gray-500 mb-6">Cette action est irréversible.</p>
//               <div className="flex gap-2">
//                 <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">Annuler</button>
//                 <button onClick={() => handleSupprimerEnfant(showDeleteConfirm.id)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">Supprimer</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ========== MODAL SUPPRESSION SERVICE ========== */}
//       {deleteServiceId && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
//             <div className="p-6 text-center">
//               <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-600" /></div>
//               <h3 className="text-lg font-semibold mb-2">Supprimer cette sollicitation ?</h3>
//               <p className="text-sm text-gray-500 mb-6">Cette action est irréversible.</p>
//               <div className="flex gap-2">
//                 <button onClick={() => setDeleteServiceId(null)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">Annuler</button>
//                 <button onClick={handleSupprimerService} disabled={submitting} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center justify-center">
//                   {submitting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : 'Supprimer'}
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
import { creerService, getServicesParent, supprimerService } from '@/actions/parent-service'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { 
  User, Calendar, BookOpen, GraduationCap, Plus, Trash2, Upload,
  Search, Eye, Clock, Check, X, AlertCircle, Users, FileText,
  Building2, ChevronRight, Mail, Briefcase, MapPin, DollarSign,
  MessageSquare, Send, Star, Loader2, UserCheck, Edit3, RefreshCw,
  Ban, Play, History
} from 'lucide-react'
import Loader from '@/components/Loader'

// Types
type Eleve = {
  id: string
  parent_id: string
  nom: string
  postnom: string | null
  prenom: string
  genre: string
  date_naissance: string | null
  niveau: string
  ecole: string | null
}

type ServiceParent = {
  id: string
  parent_id: string
  eleve_id: string
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
  } | null
}

type Candidature = {
  id: string
  service_parent_id: string
  precepteur_id: number
  message: string
  tarif_propose: number | null
  disponibilites: string | null
  statut: string
  created_at: string
  precepteur: {
    id: number
    user_id: string
    commune: string | null
    quartier: string | null
    annees_experience: number
    diplome: string | null
    note_moyenne: number
    disponible: boolean
    user: {
      id: string
      username: string
      photo_profil: string | null
    } | null
  } | null
}

type Contrat = {
  id: string
  service_parent_id: string
  parent_id: string
  precepteur_id: number
  titre: string
  matiere: string | null
  niveau: string
  frequence: string
  lieu: string
  date_debut: string
  duree: string
  tarif_final: number
  notes: string | null
  statut: 'en_attente' | 'accepte' | 'refuse' | 'actif' | 'termine' | 'annule'
  created_at: string
  updated_at: string
  precepteur?: any
}

type ContratForm = {
  date_debut: string
  duree: string
  tarif_final: number
  notes: string
}

type NegotiationForm = {
  message: string
  tarif_propose: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export default function ParentDashboard() {
  const { user, updateUser } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('enfants')
  const [eleves, setEleves] = useState<Eleve[]>([])
  const [services, setServices] = useState<ServiceParent[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [deletingEnfant, setDeletingEnfant] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{id: string, nom: string} | null>(null)
  const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null)

  // États pour les candidatures
  const [candidatures, setCandidatures] = useState<Candidature[]>([])
  const [loadingCandidatures, setLoadingCandidatures] = useState(false)
  const [selectedServiceForCandidatures, setSelectedServiceForCandidatures] = useState<string | null>(null)
  
  // États pour les contrats
  const [contrats, setContrats] = useState<Contrat[]>([])
  const [loadingContrats, setLoadingContrats] = useState(false)
  
  // États pour le contrat
  const [showContratModal, setShowContratModal] = useState(false)
  const [selectedCandidatureForContrat, setSelectedCandidatureForContrat] = useState<Candidature | null>(null)
  const [selectedServiceForContrat, setSelectedServiceForContrat] = useState<ServiceParent | null>(null)
  const [contratForm, setContratForm] = useState<ContratForm>({
    date_debut: '',
    duree: '1_mois',
    tarif_final: 0,
    notes: ''
  })
  const [contratSuccess, setContratSuccess] = useState('')
  const [contratError, setContratError] = useState('')

  // États pour la négociation
  const [showNegotiationModal, setShowNegotiationModal] = useState(false)
  const [selectedContratForNegotiation, setSelectedContratForNegotiation] = useState<Contrat | null>(null)
  const [negotiationForm, setNegotiationForm] = useState<NegotiationForm>({
    message: '',
    tarif_propose: 0
  })
  const [negotiationMessages, setNegotiationMessages] = useState<any[]>([])

  // Charger les données
  const loadData = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true)
    try {
      console.log('🔄 Chargement des données parent...')
      const [elevesResult, servicesResult] = await Promise.all([
        getElevesParent(),
        getServicesParent()
      ])
      
      console.log('📦 Élèves chargés:', elevesResult.eleves?.length || 0)
      console.log('📦 Services chargés:', servicesResult.services?.length || 0)
      
      if (elevesResult.eleves) setEleves(elevesResult.eleves)
      if (servicesResult.services) {
        setServices(servicesResult.services)
      }
    } catch (error) {
      console.error('❌ Erreur chargement données:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (user?.id) {
      loadData()
    }
  }, [user?.id, loadData])

  const forceReload = useCallback(async () => {
    await loadData()
  }, [loadData])

  // Charger les candidatures
  const loadCandidatures = async (serviceId: string) => {
    setLoadingCandidatures(true)
    setSelectedServiceForCandidatures(serviceId)
    
    try {
      const token = localStorage.getItem('excellence-token')
      if (!token) return

      const response = await fetch(`${API_URL}/auth/candidatures/service/${serviceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      
      if (data.success) {
        setCandidatures(data.candidatures || [])
      }
    } catch (err) {
      console.error('❌ Erreur chargement candidatures:', err)
    } finally {
      setLoadingCandidatures(false)
    }
  }

  // Charger les contrats
  const loadContrats = async () => {
    setLoadingContrats(true)
    try {
      const token = localStorage.getItem('excellence-token')
      if (!token) return

      const response = await fetch(`${API_URL}/auth/contracts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      
      if (data.success) {
        setContrats(data.contrats || [])
      }
    } catch (err) {
      console.error('❌ Erreur chargement contrats:', err)
    } finally {
      setLoadingContrats(false)
    }
  }

  // Créer un contrat ET changer le statut de la candidature
  const handleCreateContrat = (candidature: Candidature, service: ServiceParent) => {
    setSelectedCandidatureForContrat(candidature)
    setSelectedServiceForContrat(service)
    setContratForm({
      date_debut: new Date().toISOString().split('T')[0],
      duree: '1_mois',
      tarif_final: candidature.tarif_propose || service.budget_horaire || 0,
      notes: `Contrat pour ${service.titre}`
    })
    setContratSuccess('')
    setContratError('')
    setShowContratModal(true)
  }

  const submitContrat = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setContratError('')
    setContratSuccess('')

    try {
      const token = localStorage.getItem('excellence-token')
      if (!token) throw new Error('Non connecté')

      // 1. Créer le contrat
      const response = await fetch(`${API_URL}/auth/contracts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          service_parent_id: selectedServiceForContrat?.id,
          precepteur_id: selectedCandidatureForContrat?.precepteur_id,
          date_debut: contratForm.date_debut,
          duree: contratForm.duree,
          tarif_final: contratForm.tarif_final,
          notes: contratForm.notes
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Erreur')

      // 2. Changer le statut de la candidature à "accepte"
      if (selectedCandidatureForContrat) {
        await fetch(`${API_URL}/auth/candidatures/${selectedCandidatureForContrat.id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ statut: 'accepte' })
        })
      }

      setContratSuccess('✅ Contrat créé avec succès !')
      setTimeout(() => {
        setShowContratModal(false)
        setContratSuccess('')
        loadCandidatures(selectedServiceForCandidatures!)
        loadContrats()
      }, 2000)

    } catch (err: any) {
      setContratError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Gérer le statut du contrat
  const handleContratStatusChange = async (contratId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('excellence-token')
      if (!token) return

      const response = await fetch(`${API_URL}/auth/contracts/${contratId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ statut: newStatus })
      })

      if (response.ok) {
        setMessage(`✅ Contrat ${newStatus.replace('_', ' ')} avec succès`)
        setTimeout(() => setMessage(''), 3000)
        loadContrats()
      }
    } catch (error) {
      console.error('❌ Erreur changement statut contrat:', error)
    }
  }

  // Négociation
  const openNegotiation = async (contrat: Contrat) => {
    setSelectedContratForNegotiation(contrat)
    setNegotiationForm({
      message: '',
      tarif_propose: contrat.tarif_final
    })
    
    // Charger les messages de négociation
    try {
      const token = localStorage.getItem('excellence-token')
      if (!token) return

      const response = await fetch(`${API_URL}/auth/contracts/${contrat.id}/negotiations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setNegotiationMessages(data.messages || [])
      }
    } catch (error) {
      console.error('❌ Erreur chargement négociations:', error)
    }
    
    setShowNegotiationModal(true)
  }

  const sendNegotiationMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const token = localStorage.getItem('excellence-token')
      if (!token) throw new Error('Non connecté')

      const response = await fetch(`${API_URL}/auth/contracts/${selectedContratForNegotiation?.id}/negotiations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: negotiationForm.message,
          tarif_propose: negotiationForm.tarif_propose
        })
      })

      if (response.ok) {
        const data = await response.json()
        setNegotiationMessages([...negotiationMessages, data.message])
        setNegotiationForm({ ...negotiationForm, message: '' })
      }
    } catch (error) {
      console.error('❌ Erreur envoi message:', error)
    } finally {
      setSubmitting(false)
    }
  }

  // Upload photo
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploading(true)
    try {
      const result = await updateProfilePhoto(file)
      if (result.success && result.photoUrl) {
        updateUser({ photo_profil: result.photoUrl })
        setMessage('✅ Photo mise à jour avec succès')
      } else {
        setMessage(result.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      setMessage('Erreur lors de la mise à jour')
    }
    setUploading(false)
    setTimeout(() => setMessage(''), 3000)
  }

  // Ajouter enfant
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
        setMessage('✅ Enfant ajouté avec succès')
        setTimeout(() => setMessage(''), 3000)
        await forceReload()
      }
    } catch (error) {
      setFormError("Erreur lors de l'ajout")
    }
    
    setSubmitting(false)
  }

  // Supprimer enfant
  const handleSupprimerEnfant = async (eleveId: string) => {
    setDeletingEnfant(eleveId)
    try {
      const result = await supprimerEnfant(parseInt(eleveId))
      if (result.success) {
        setMessage('✅ Enfant supprimé avec succès')
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

  const handleCreerService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError('')
    setSubmitting(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      const eleveId = formData.get('eleve_id') as string
      
      const result = await creerService({
        eleve_id: eleveId,
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
        setMessage('✅ Service créé avec succès')
        setTimeout(() => setMessage(''), 3000)
        await forceReload()
      }
    } catch (error) {
      setFormError("Erreur lors de la création du service")
    }
    
    setSubmitting(false)
  }

  // Supprimer service
  const handleSupprimerService = async () => {
    if (!deleteServiceId) return
    
    setSubmitting(true)
    try {
      const result = await supprimerService(parseInt(deleteServiceId))
      if (result.success) {
        setMessage('✅ Service supprimé avec succès')
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

  // Helpers UI
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
      case 'accepte': case 'actif': case 'pourvu': case 'en_cours': 
        return <Check className="w-3.5 h-3.5" />
      case 'refuse': case 'annule': return <X className="w-3.5 h-3.5" />
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

  const getDureeLabel = (duree: string) => {
    switch (duree) {
      case '1_mois': return '1 mois'
      case '3_mois': return '3 mois'
      case '6_mois': return '6 mois'
      case '12_mois': return '1 an'
      case 'indetermine': return 'Indéterminée'
      default: return duree
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getPhotoUrl = (photoPath: string | null | undefined) => {
    if (!photoPath) return null
    if (photoPath.startsWith('http')) return photoPath
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001'
    return `${baseUrl}${photoPath}`
  }

  const totalCandidatures = services.reduce((sum, s) => sum + (s.nombre_candidatures || 0), 0)
  const contratsActifs = contrats.filter(c => c.statut === 'actif' || c.statut === 'accepte').length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-20"><Loader /></div>
      </div>
    )
  }

  if (!user) return null

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
          <div className="relative group flex-shrink-0 mx-auto md:mx-0">
            {user.photo_profil ? (
              <img 
                src={user.photo_profil.startsWith('http') ? user.photo_profil : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001'}${user.photo_profil}`}
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const placeholder = e.currentTarget.nextElementSibling as HTMLElement
                  if (placeholder) placeholder.style.display = 'flex'
                }}
              />
            ) : null}
            <div className={`w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center ${user.photo_profil ? 'hidden' : 'flex'}`}>
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              {uploading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Upload className="w-5 h-5 text-white" />
              )}
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
            </label>
          </div>

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
          </div>

          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" /> Ajouter un enfant
            </button>
            <button onClick={() => setShowServiceModal(true)} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-md">
              <Briefcase className="w-4 h-4" /> Solliciter un service
            </button>
            <Link href="/recherche" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Search className="w-4 h-4" /> Rechercher
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl">
            <p className="text-2xl font-bold text-blue-600">{eleves.length}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1"><Users className="w-3 h-3" /> Enfants</p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl">
            <p className="text-2xl font-bold text-green-600">{services.length}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1"><Briefcase className="w-3 h-3" /> Services</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl">
            <p className="text-2xl font-bold text-purple-600">{totalCandidatures}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Candidatures</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-xl">
            <p className="text-2xl font-bold text-orange-600">{contrats.length}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1"><FileText className="w-3 h-3" /> Contrats</p>
          </div>
          <div className="p-4 bg-teal-50 rounded-xl">
            <p className="text-2xl font-bold text-teal-600">{contratsActifs}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1"><Check className="w-3 h-3" /> Actifs</p>
          </div>
        </div>
      </div>

      {/* ========== TABS ========== */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <button onClick={() => { setActiveTab('enfants'); setSelectedServiceForCandidatures(null) }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'enfants' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
          <Users className="w-4 h-4" /> Enfants ({eleves.length})
        </button>
        <button onClick={() => { setActiveTab('services'); setSelectedServiceForCandidatures(null) }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'services' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
          <Briefcase className="w-4 h-4" /> Services ({services.length})
        </button>
        <button onClick={() => { setActiveTab('candidatures'); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'candidatures' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
          <MessageSquare className="w-4 h-4" /> Candidatures ({totalCandidatures})
        </button>
        <button onClick={() => { setActiveTab('contrats'); loadContrats(); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'contrats' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
          <FileText className="w-4 h-4" /> Contrats ({contrats.length})
        </button>
      </div>

      {/* ========== ONGLET ENFANTS ========== */}
      {activeTab === 'enfants' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Users className="w-5 h-5 text-gray-700" />Mes enfants</h3>
              <p className="text-sm text-gray-500 mt-0.5">{eleves.length} enfant{eleves.length > 1 ? 's' : ''} inscrit{eleves.length > 1 ? 's' : ''}</p>
            </div>
            <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium">
              <Plus className="w-4 h-4" /> Ajouter
            </button>
          </div>

          {eleves.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <Users className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium mb-1">Aucun enfant inscrit</p>
              <p className="text-gray-400 text-sm mb-6">Ajoutez votre premier enfant pour commencer</p>
              <button onClick={() => setShowModal(true)} className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium text-sm">
                <Plus className="w-4 h-4" /> Ajouter un enfant
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {eleves.map((eleve) => (
                <div key={eleve.id} className="p-4 hover:bg-gray-50/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${eleve.genre === 'M' ? 'bg-blue-100' : 'bg-pink-100'}`}>
                        <span className={`text-lg font-bold ${eleve.genre === 'M' ? 'text-blue-600' : 'text-pink-600'}`}>{eleve.prenom[0]}{eleve.nom[0]}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{eleve.prenom} {eleve.nom} {eleve.postnom}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1"><GraduationCap className="w-3 h-3" /> {eleve.niveau}</span>
                        {eleve.ecole && <><span>•</span><span className="inline-flex items-center gap-1"><Building2 className="w-3 h-3" /> {eleve.ecole}</span></>}
                        <span>•</span><span>{eleve.genre === 'M' ? 'Garçon' : 'Fille'}</span>
                        {eleve.date_naissance && <><span>•</span><span>{formatDate(eleve.date_naissance)}</span></>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/dashboard/parent/suivi/${eleve.id}`} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Suivi"><Eye className="w-4 h-4" /></Link>
                      <button onClick={() => setShowDeleteConfirm({ id: eleve.id, nom: `${eleve.prenom} ${eleve.nom}` })} disabled={deletingEnfant === eleve.id} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50" title="Supprimer">
                        {deletingEnfant === eleve.id ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div> : <Trash2 className="w-4 h-4" />}
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

      {/* ========== ONGLET SERVICES ========== */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Briefcase className="w-5 h-5 text-gray-700" />Mes sollicitations de service</h3>
              <p className="text-sm text-gray-500 mt-0.5">{services.length} service{services.length > 1 ? 's' : ''} publié{services.length > 1 ? 's' : ''}</p>
            </div>
            <button onClick={() => setShowServiceModal(true)} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 font-medium shadow-md">
              <Plus className="w-4 h-4" /> Nouveau service
            </button>
          </div>

          {services.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <Briefcase className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium mb-1">Aucune sollicitation</p>
              <p className="text-gray-400 text-sm mb-6">Publiez votre première demande de service</p>
              <button onClick={() => setShowServiceModal(true)} className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 font-medium text-sm shadow-md">
                <Plus className="w-4 h-4" /> Créer une sollicitation
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {services.map((service) => (
                <div key={service.id} className="p-4 hover:bg-gray-50/50 transition-colors group">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 truncate">{service.titre}</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatutColor(service.statut || 'inconnu')}`}>
                          {getStatutIcon(service.statut || 'inconnu')}{service.statut ? service.statut.replace('_', ' ') : 'Inconnu'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{service.description}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {service.eleve?.prenom} {service.eleve?.nom}</span>
                        {service.matiere_preferee && <><span>•</span><span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {service.matiere_preferee}</span></>}
                        <span>•</span><span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {getFrequenceLabel(service.frequence_souhaitee)}</span>
                        {service.budget_horaire && <><span>•</span><span className="flex items-center gap-1 text-green-600 font-medium"><DollarSign className="w-3 h-3" /> {service.budget_horaire.toLocaleString()} FC/h</span></>}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {service.nombre_vues} vues</span>
                        <button onClick={(e) => { e.stopPropagation(); loadCandidatures(service.id); setActiveTab('candidatures'); }}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
                          <Users className="w-3 h-3" /> {service.nombre_candidatures} candidature{service.nombre_candidatures > 1 ? 's' : ''} →
                        </button>
                        <span>Créé le {formatDate(service.date_creation)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button onClick={() => setDeleteServiceId(service.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========== ONGLET CANDIDATURES ========== */}
      {activeTab === 'candidatures' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-gray-700" />Candidatures reçues</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                {selectedServiceForCandidatures ? 'Candidatures pour un service spécifique' : 'Sélectionnez un service pour voir ses candidatures'}
              </p>
            </div>
            {selectedServiceForCandidatures && (
              <button onClick={() => { setSelectedServiceForCandidatures(null); setCandidatures([]); }}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
                <X className="w-4 h-4" /> Voir tous les services
              </button>
            )}
          </div>

          {!selectedServiceForCandidatures ? (
            <div className="divide-y divide-gray-100">
              {services.filter(s => s.nombre_candidatures > 0).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6">
                  <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg font-medium mb-1">Aucune candidature</p>
                  <p className="text-gray-400 text-sm">Les candidatures apparaîtront ici quand des précepteurs postuleront à vos services.</p>
                </div>
              ) : (
                services.filter(s => s.nombre_candidatures > 0).map((service) => (
                  <div key={service.id} onClick={() => loadCandidatures(service.id)}
                    className="p-4 hover:bg-gray-50/50 transition-colors cursor-pointer flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{service.titre}</p>
                      <p className="text-sm text-gray-500">{service.matiere_preferee} • {service.niveau_eleve}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {service.nombre_candidatures} candidature{service.nombre_candidatures > 1 ? 's' : ''}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : loadingCandidatures ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
          ) : candidatures.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <Users className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium mb-1">Aucune candidature pour ce service</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {candidatures.map((candidature) => (
                <div key={candidature.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {candidature.precepteur?.user?.photo_profil ? (
                        <img src={getPhotoUrl(candidature.precepteur.user.photo_profil) || ''} alt="" className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">
                          {candidature.precepteur?.user?.username || 'Précepteur'}
                        </p>
                        {candidature.precepteur?.note_moyenne !== undefined && candidature.precepteur.note_moyenne > 0 && (
                          <span className="flex items-center gap-1 text-yellow-600 text-sm">
                            <Star className="w-4 h-4 fill-yellow-400" />
                            {candidature.precepteur.note_moyenne.toFixed(1)}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          candidature.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' : 
                          candidature.statut === 'accepte' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {candidature.statut === 'en_attente' ? 'En attente' : 
                           candidature.statut === 'accepte' ? 'Acceptée' : candidature.statut}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{candidature.message}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        {candidature.tarif_propose && (
                          <span className="flex items-center gap-1 text-green-600 font-medium">
                            <DollarSign className="w-3 h-3" /> {candidature.tarif_propose.toLocaleString()} FC/h
                          </span>
                        )}
                        {candidature.disponibilites && (
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {candidature.disponibilites}</span>
                        )}
                        {candidature.precepteur?.commune && (
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {candidature.precepteur.commune}</span>
                        )}
                        <span>{formatDate(candidature.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {candidature.statut === 'en_attente' && (
                        <button onClick={() => {
                          const service = services.find(s => s.id === candidature.service_parent_id)
                          if (service) handleCreateContrat(candidature, service)
                        }}
                          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium">
                          <FileText className="w-4 h-4" />
                          Créer un contrat
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========== 🆕 ONGLET CONTRATS ========== */}
      {activeTab === 'contrats' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2"><FileText className="w-5 h-5 text-gray-700" />Mes contrats</h3>
              <p className="text-sm text-gray-500 mt-0.5">{contrats.length} contrat{contrats.length > 1 ? 's' : ''}</p>
            </div>
            <button onClick={loadContrats} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5" /> Actualiser
            </button>
          </div>

          {loadingContrats ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
          ) : contrats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <FileText className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium mb-1">Aucun contrat</p>
              <p className="text-gray-400 text-sm">Les contrats apparaîtront ici une fois créés.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {contrats.map((contrat) => (
                <div key={contrat.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getStatutColor(contrat.statut)}`}>
                        <FileText className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900">{contrat.titre}</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatutColor(contrat.statut)}`}>
                          {getStatutIcon(contrat.statut)}{contrat.statut.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span>{contrat.matiere} • {contrat.niveau}</span>
                        <span>•</span>
                        <span>{getFrequenceLabel(contrat.frequence)}</span>
                        <span>•</span>
                        <span className="text-green-600 font-medium">{contrat.tarif_final?.toLocaleString()} FC/h</span>
                        <span>•</span>
                        <span>{getDureeLabel(contrat.duree)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <span>Début: {formatDate(contrat.date_debut)}</span>
                        {contrat.notes && <><span>•</span><span className="italic">{contrat.notes}</span></>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {/* Négociation */}
                      <button onClick={() => openNegotiation(contrat)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Négocier">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      
                      {/* Actions selon statut */}
                      {contrat.statut === 'en_attente' && (
                        <>
                          <button onClick={() => handleContratStatusChange(contrat.id, 'actif')}
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Activer">
                            <Play className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleContratStatusChange(contrat.id, 'annule')}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Annuler">
                            <Ban className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {contrat.statut === 'actif' && (
                        <>
                          <button onClick={() => handleContratStatusChange(contrat.id, 'termine')}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Terminer">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleContratStatusChange(contrat.id, 'annule')}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Annuler">
                            <Ban className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========== MODAL CONTRAT ========== */}
      {showContratModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2"><FileText className="w-5 h-5 text-green-600" />Créer un contrat</h2>
              <button onClick={() => setShowContratModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={submitContrat} className="p-6 space-y-4">
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-sm font-medium text-green-900">{selectedServiceForContrat?.titre}</p>
                <p className="text-xs text-green-700 mt-1">
                  Avec : {selectedCandidatureForContrat?.precepteur?.user?.username} • 
                  {selectedCandidatureForContrat?.tarif_propose ? ` ${selectedCandidatureForContrat.tarif_propose.toLocaleString()} FC/h` : ''}
                </p>
              </div>

              {contratSuccess && (<div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm flex items-center gap-2"><Check className="w-4 h-4" /> {contratSuccess}</div>)}
              {contratError && (<div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {contratError}</div>)}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de début *</label>
                <input type="date" value={contratForm.date_debut} onChange={(e) => setContratForm({...contratForm, date_debut: e.target.value})} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durée *</label>
                <select value={contratForm.duree} onChange={(e) => setContratForm({...contratForm, duree: e.target.value})} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                  <option value="1_mois">1 mois</option><option value="3_mois">3 mois</option><option value="6_mois">6 mois</option>
                  <option value="12_mois">1 an</option><option value="indetermine">Durée indéterminée</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tarif final (FC/h) *</label>
                <input type="number" value={contratForm.tarif_final} onChange={(e) => setContratForm({...contratForm, tarif_final: Number(e.target.value)})} required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" min="0" step="1000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={contratForm.notes} onChange={(e) => setContratForm({...contratForm, notes: e.target.value})} rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowContratModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">Annuler</button>
                <button type="submit" disabled={submitting} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />Création...</> : <><FileText className="w-4 h-4" />Créer le contrat</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== 🆕 MODAL NÉGOCIATION ========== */}
      {showNegotiationModal && selectedContratForNegotiation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2"><MessageSquare className="w-5 h-5 text-blue-600" />Négociation</h2>
              <button onClick={() => setShowNegotiationModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <p className="text-sm font-medium text-blue-900">{selectedContratForNegotiation.titre}</p>
                <p className="text-xs text-blue-700 mt-1">
                  Tarif actuel: {selectedContratForNegotiation.tarif_final?.toLocaleString()} FC/h • 
                  Statut: {selectedContratForNegotiation.statut.replace('_', ' ')}
                </p>
              </div>

              {negotiationMessages.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucun message. Commencez la négociation.</p>
                </div>
              ) : (
                negotiationMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === 'parent' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-xl ${
                      msg.sender === 'parent' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                      {msg.tarif_propose && (
                        <p className="text-xs mt-1 opacity-75">
                          💰 Proposition: {msg.tarif_propose.toLocaleString()} FC/h
                        </p>
                      )}
                      <p className="text-xs mt-1 opacity-50">{formatDate(msg.created_at)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Formulaire */}
            <form onSubmit={sendNegotiationMessage} className="p-4 border-t bg-gray-50">
              <div className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={negotiationForm.message}
                    onChange={(e) => setNegotiationForm({...negotiationForm, message: e.target.value})}
                    placeholder="Votre message..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                  />
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-500">Contre-proposition (FC/h):</label>
                    <input
                      type="number"
                      value={negotiationForm.tarif_propose}
                      onChange={(e) => setNegotiationForm({...negotiationForm, tarif_propose: Number(e.target.value)})}
                      className="w-32 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      min="0"
                      step="1000"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 self-end"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== MODAL AJOUT ENFANT ========== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2"><Plus className="w-5 h-5" />Ajouter un enfant</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAjouterEnfant} className="p-6 space-y-4">
              {formError && (<div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{formError}</div>)}
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label><input type="text" name="prenom" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Marie" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label><input type="text" name="nom" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Kyungu" /></div>
                <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Postnom</label><input type="text" name="postnom" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Kunta" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Genre *</label><select name="genre" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"><option value="M">Masculin</option><option value="F">Féminin</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label><input type="date" name="date_naissance" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Niveau *</label><select name="niveau" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"><option value="7ème">7ème année</option><option value="8ème">8ème année</option></select></div>
                <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">École</label><input type="text" name="ecole" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Collège Saint Joseph" /></div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">Annuler</button>
                <button type="submit" disabled={submitting} className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm flex items-center justify-center gap-2">
                  {submitting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <><Plus className="w-4 h-4" />Ajouter</>}
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
              <h2 className="text-xl font-semibold flex items-center gap-2"><Briefcase className="w-5 h-5 text-blue-600" />Solliciter un service</h2>
              <button onClick={() => setShowServiceModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreerService} className="p-6 space-y-4">
              {formError && (<div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{formError}</div>)}
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Pour quel enfant ? *</label>
                <select name="eleve_id" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                  <option value="">Sélectionnez un enfant</option>
                  {eleves.map(eleve => (<option key={eleve.id} value={eleve.id}>{eleve.prenom} {eleve.nom} - {eleve.niveau}</option>))}
                </select>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label><input type="text" name="titre" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Ex: Cours de mathématiques" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Description *</label><textarea name="description" required rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Décrivez vos besoins..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Matière</label><select name="matiere_preferee" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"><option value="">Toutes</option><option value="Mathématiques">Mathématiques</option><option value="Français">Français</option><option value="Anglais">Anglais</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Niveau *</label><select name="niveau_eleve" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"><option value="7ème">7ème</option><option value="8ème">8ème</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Fréquence *</label><select name="frequence_souhaitee" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"><option value="unique">Ponctuel</option><option value="hebdomadaire">Hebdomadaire</option><option value="bi-hebdomadaire">2x/semaine</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label><select name="lieu_preference" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"><option value="domicile">Domicile</option><option value="en_ligne">En ligne</option></select></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Budget (FC/h)</label><input type="number" name="budget_horaire" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="5000" /></div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowServiceModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">Annuler</button>
                <button type="submit" disabled={submitting} className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-sm flex items-center justify-center gap-2 shadow-md">
                  {submitting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <><Briefcase className="w-4 h-4" />Publier</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== MODAL SUPPRESSION ENFANT ========== */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-600" /></div>
              <h3 className="text-lg font-semibold mb-2">Supprimer {showDeleteConfirm.nom} ?</h3>
              <p className="text-sm text-gray-500 mb-6">Cette action est irréversible.</p>
              <div className="flex gap-2">
                <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">Annuler</button>
                <button onClick={() => handleSupprimerEnfant(showDeleteConfirm.id)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">Supprimer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== MODAL SUPPRESSION SERVICE ========== */}
      {deleteServiceId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-600" /></div>
              <h3 className="text-lg font-semibold mb-2">Supprimer cette sollicitation ?</h3>
              <p className="text-sm text-gray-500 mb-6">Cette action est irréversible.</p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteServiceId(null)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">Annuler</button>
                <button onClick={handleSupprimerService} disabled={submitting} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center justify-center">
                  {submitting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}