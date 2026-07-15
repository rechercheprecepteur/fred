
// // app/dashboard/precepteur/page.tsx
// 'use client'
// import { useRouter } from 'next/navigation'
// import UploadDocument from '@/components/UploadDocument'
// import ServiceManager from '@/components/ServiceManager'
// import ListeDocuments from '@/components/ListeDocuments'
// import ProfilModal from '@/components/ProfilModal'
// import { useAuth } from '@/context/AuthContext'
// import CreateSessionModal from './CreateSessionModal'
// import SessionDetailModal from './SessionDetailModal'
// import { updateProfilePhoto, updatePrecepteurDisponibility } from '@/actions/auth'
// import { updatePrecepteurProfil, getPrecepteurMatieres, getContrats, updateContratStatus, updateSessionStatus, updateSessionNotes } from '@/actions/precepteur'
// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { 
//   User, MapPin, Star, Clock, BookOpen, GraduationCap, Calendar, 
//   Edit3, Check, X, Upload, Plus, Trash2, Eye, AlertCircle, 
//   ChevronDown, Filter, Play, StopCircle, Ban, RotateCcw, FileText, 
//   Users, Tag, Phone, Mail, Building, CreditCard, Hash, MessageSquare, 
//   Activity, RefreshCw, Send
// } from 'lucide-react'
// import { PiBookOpen, PiPlus, PiTrash } from 'react-icons/pi'
// import Loader from '@/components/Loader'
// import { CheckBadgeIcon } from '@heroicons/react/24/solid'

// type Contract = {
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
//   type_contrat: 'recurrent' | 'ponctuel'
//   frequence: 'quotidien' | 'hebdomadaire' | 'bihebdomadaire' | 'mensuel' | 'ponctuel'
//   tarif_horaire: number | null
//   notes: string | null
//   statut: 'en_attente' | 'accepte' | 'refuse' | 'actif' | 'termine' | 'annule'
//   created_at: string
//   parent?: any
//   eleve?: any
//   matiere?: any
//   sessions?: Session[]
// }

// type Session = {
//   id: number
//   contract_id: number
//   date_session: string
//   heure_debut: string
//   heure_fin: string
//   duree_minutes: number
//   statut: 'planifie' | 'en_cours' | 'termine' | 'annule' | 'reporte'
//   type_session: 'presentiel' | 'en_ligne' | 'hybride'
//   lieu: string | null
//   lien_visio: string | null
//   notes_precepteur: string | null
//   notes_parent: string | null
//   feedback_precepteur: string | null
//   feedback_parent: string | null
//   note_session: number | null
//   raison_annulation: string | null
//   annule_par: string | null
//   created_at: string
// }

// type Matiere = {
//   id: number
//   nom: string
//   niveau: string
// }

// type Candidature = {
//   id: number
//   service_parent_id: number
//   precepteur_id: number
//   message: string
//   tarif_propose: number | null
//   disponibilites: string | null
//   statut: 'en_attente' | 'accepte' | 'refuse'
//   created_at: string
//   updated_at: string
// }

// interface ProfilForm {
//   latitude: string
//   longitude: string
//   commune: string
//   quartier: string
//   annees_experience: number
//   diplome: string
//   etablissement_origine: string
//   telephone: string
// }

// export default function PrecepteurDashboard() {
//   const [uploading, setUploading] = useState(false)
//   const [saving, setSaving] = useState(false)
//   const [message, setMessage] = useState('')
//   const [loading, setLoading] = useState(true)
//   const [contrats, setContrats] = useState<Contract[]>([])
//   const [matieres, setMatieres] = useState<Matiere[]>([])
//   const [selectedMatieres, setSelectedMatieres] = useState<number[]>([])
//   const [activeTab, setActiveTab] = useState('profil')
//   const [showModal, setShowModal] = useState(false)
//   const [refreshDocs, setRefreshDocs] = useState(0)
//   const router = useRouter()
//   const [creatingSession, setCreatingSession] = useState(false)
  
//   const [selectedSession, setSelectedSession] = useState<Session | null>(null)
//   const [showSessionModal, setShowSessionModal] = useState(false)
//   const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
//   const [showContractModal, setShowContractModal] = useState(false)
//   const [selectedContractForSession, setSelectedContractForSession] = useState<Contract | null>(null)
//   const [showCreateSessionModal, setShowCreateSessionModal] = useState(false)

//   // États pour les candidatures
//   const [candidatures, setCandidatures] = useState<Candidature[]>([])
//   const [loadingCandidatures, setLoadingCandidatures] = useState(false)

//   const { user, precepteurInfo, refreshPrecepteurInfo, updateUser } = useAuth()
  
//   const [form, setForm] = useState<ProfilForm>({
//     latitude: '',
//     longitude: '',
//     commune: '',
//     quartier: '',
//     annees_experience: 0,
//     diplome: '',
//     etablissement_origine: '',
//     telephone: '' 
//   })

//   const [disponible, setDisponible] = useState(precepteurInfo?.disponible ?? true)

//   useEffect(() => {
//     let isMounted = true;

//     const initializeData = async () => {
//       if (!user) {
//         setLoading(false);
//         return;
//       }

//       if (!precepteurInfo) {
//         await refreshPrecepteurInfo();
//       }

//       if (!isMounted) return;

//       if (precepteurInfo) {
//         setForm({
//           latitude: precepteurInfo.latitude?.toString() || '',
//           longitude: precepteurInfo.longitude?.toString() || '',
//           commune: precepteurInfo.commune || '',
//           quartier: precepteurInfo.quartier || '',
//           annees_experience: precepteurInfo.annees_experience || 0,
//           diplome: precepteurInfo.diplome || '',
//           telephone: precepteurInfo.telephone || '',
//           etablissement_origine: precepteurInfo.etablissement_origine || ''
//         });
//         setDisponible(precepteurInfo.disponible ?? true);
        
//         // Charger les matières du précepteur
//         if (precepteurInfo.precepteur_matieres) {
//           setSelectedMatieres(precepteurInfo.precepteur_matieres.map((pm: any) => pm.matiere_id));
//         }
        
//         await Promise.all([loadContrats(), loadMatieres(), loadCandidatures()]);
//       }

//       if (isMounted) {
//         setLoading(false);
//       }
//     };

//     initializeData();

//     return () => {
//       isMounted = false;
//     };
//   }, [user?.id, precepteurInfo?.id]);


// const handleSave = async (data: ProfilForm & { matieres: number[] }) => {
//   setSaving(true)
//   setMessage('')
  
//   try {
//     console.log('📤 Données envoyées:', data)
    
//     // ✅ Appel à l'action serveur
//     const result = await updatePrecepteurProfil({
//       latitude: data.latitude || undefined,
//       longitude: data.longitude || undefined,
//       commune: data.commune || undefined,
//       quartier: data.quartier || undefined,
//       annees_experience: data.annees_experience || 0,
//       diplome: data.diplome || undefined,
//       etablissement_origine: data.etablissement_origine || undefined,
//       telephone: data.telephone || undefined,
//       matieres: data.matieres
//     })
    
//     console.log('📥 Réponse:', result)
    
//     if (result.success) {
//       setShowModal(false)
//       setMessage('✅ Profil mis à jour avec succès !')
//       await refreshPrecepteurInfo()
//     } else {
//       setMessage(result.error || 'Erreur lors de la mise à jour')
//     }
//   } catch (error) {
//     console.error('❌ Erreur sauvegarde:', error)
//     setMessage('Erreur lors de la mise à jour du profil')
//   } finally {
//     setSaving(false)
//     setTimeout(() => setMessage(''), 3000)
//   }
// }

//   const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0]
//   if (!file) return
  
//   // ✅ Vérifier la taille du fichier (max 5MB)
//   if (file.size > 5 * 1024 * 1024) {
//     setMessage('Image trop volumineuse. Maximum 5MB.')
//     setTimeout(() => setMessage(''), 3000)
//     return
//   }
  
//   setUploading(true)
  
//   try {
//     // ✅ Utiliser FormData pour l'upload
//     const result = await updateProfilePhoto(file)
    
//     if (result.success && result.photoUrl) {
//       // Mettre à jour l'utilisateur avec la nouvelle URL
//       updateUser({ photo_profil: result.photoUrl })
//       setMessage('Photo mise à jour avec succès')
//     } else {
//       setMessage(result.error || 'Erreur lors de la mise à jour')
//     }
//   } catch (error) {
//     console.error('❌ Erreur upload photo:', error)
//     setMessage('Erreur lors de l\'upload de la photo')
//   } finally {
//     setUploading(false)
//     setTimeout(() => setMessage(''), 3000)
//   }
// }
//   const toggleDisponible = async () => {
//     const newDisponible = !disponible
//     setDisponible(newDisponible)
    
//     try {
//       const result = await updatePrecepteurDisponibility(newDisponible)
//       if (result.success) {
//         await refreshPrecepteurInfo()
//       } else {
//         setDisponible(!newDisponible)
//         setMessage(result.error || 'Erreur lors de la mise à jour')
//       }
//     } catch (error) {
//       console.error('Erreur toggleDisponible:', error)
//       setDisponible(!newDisponible)
//       setMessage('Erreur lors de la mise à jour')
//     }
//   }

//   const loadContrats = async () => {
//     if (!precepteurInfo) return;

//     try {
//       const result = await getContrats()
//       if (result.success) {
//         setContrats(result.contrats || [])
//       } else {
//         console.error('Erreur chargement contrats:', result.error)
//       }
//     } catch (error) {
//       console.error('Erreur chargement contrats:', error)
//     }
//   }

//   const loadMatieres = async () => {
//     try {
//       const result = await getPrecepteurMatieres()
//       if (result.success) {
//         setMatieres(result.matieres || [])
//       }
//     } catch (error) {
//       console.error('Erreur chargement matières:', error)
//     }
//   }

//   const loadCandidatures = async () => {
//     if (!precepteurInfo) return
    
//     setLoadingCandidatures(true)
//     try {
//       const token = localStorage.getItem('excellence-token')
//       if (!token) return
      
//       const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
//       const response = await fetch(`${API_URL}/auth/candidatures/mes-candidatures`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       })
      
//       if (response.ok) {
//         const data = await response.json()
//         console.log('📋 Candidatures chargées:', data)
//         if (data.success) {
//           setCandidatures(data.candidatures || [])
//         }
//       }
//     } catch (error) {
//       console.error('❌ Erreur chargement candidatures:', error)
//     } finally {
//       setLoadingCandidatures(false)
//     }
//   }

//   const handleMatiereToggle = (matiereId: number) => {
//     setSelectedMatieres(prev => 
//       prev.includes(matiereId)
//         ? prev.filter(id => id !== matiereId)
//         : [...prev, matiereId]
//     )
//   }

//   const openModal = () => {
//     if (precepteurInfo) {
//       setForm({
//         latitude: precepteurInfo.latitude?.toString() || '',
//         longitude: precepteurInfo.longitude?.toString() || '',
//         commune: precepteurInfo.commune || '',
//         quartier: precepteurInfo.quartier || '',
//         annees_experience: precepteurInfo.annees_experience || 0,
//         diplome: precepteurInfo.diplome || '',
//         telephone: precepteurInfo.telephone || '',
//         etablissement_origine: precepteurInfo.etablissement_origine || ''
//       })
//     }
//     setShowModal(true)
//   }

//   const handleContractStatusChange = async (contractId: number, newStatus: string) => {
//     console.log('📝 Changement statut contrat:', { contractId, newStatus })
    
//     const result = await updateContratStatus(contractId, newStatus)
    
//     if (result.success) {
//       await loadContrats()
//       setMessage(`Contrat ${newStatus.replace('_', ' ')} avec succès`)
//       setTimeout(() => setMessage(''), 3000)
//     } else {
//       setMessage(result.error || 'Erreur lors du changement de statut')
//       setTimeout(() => setMessage(''), 3000)
//     }
//   }

//   const handleSessionStatusChange = async (sessionId: number, newStatus: string) => {
//     const result = await updateSessionStatus(sessionId, newStatus)
    
//     if (result.success) {
//       setMessage(`Session ${newStatus.replace('_', ' ')} avec succès`)
//       await loadContrats()
//       setTimeout(() => setMessage(''), 3000)
//     } else {
//       setMessage('Erreur lors du changement de statut de la session')
//       setTimeout(() => setMessage(''), 3000)
//     }
//   }

//   const handleNotesUpdate = async (sessionId: number, notes: string) => {
//     const result = await updateSessionNotes(sessionId, notes)
    
//     if (result.success) {
//       setMessage('Notes sauvegardées avec succès')
//       await loadContrats()
//       setTimeout(() => setMessage(''), 3000)
//     } else {
//       setMessage('Erreur lors de la sauvegarde des notes')
//       setTimeout(() => setMessage(''), 3000)
//     }
//   }

//   const openSessionDetail = (session: Session) => {
//     setSelectedSession(session)
//     setShowSessionModal(true)
//   }

//   const openContractDetail = (contract: Contract) => {
//     router.push(`/dashboard/precepteur/contrats/${contract.id}`)
//   }

//   const getContratStatutColor = (statut: string) => {
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

//   const getSessionStatutColor = (statut: string) => {
//     switch (statut) {
//       case 'planifie': return 'bg-blue-100 text-blue-800'
//       case 'en_cours': return 'bg-yellow-100 text-yellow-800'
//       case 'termine': return 'bg-green-100 text-green-800'
//       case 'annule': return 'bg-red-100 text-red-800'
//       case 'reporte': return 'bg-purple-100 text-purple-800'
//       default: return 'bg-gray-100 text-gray-800'
//     }
//   }

//   const getCandidatureStatutColor = (statut: string) => {
//     switch (statut) {
//       case 'en_attente': return 'bg-yellow-100 text-yellow-800'
//       case 'accepte': return 'bg-green-100 text-green-800'
//       case 'refuse': return 'bg-red-100 text-red-800'
//       default: return 'bg-gray-100 text-gray-800'
//     }
//   }

//   const getStatutIcon = (statut: string) => {
//     switch (statut) {
//       case 'planifie':
//       case 'en_attente': return <Calendar className="w-4 h-4" />
//       case 'en_cours': return <Clock className="w-4 h-4" />
//       case 'termine':
//       case 'accepte':
//       case 'actif': return <Check className="w-4 h-4" />
//       case 'annule':
//       case 'refuse': return <X className="w-4 h-4" />
//       default: return <AlertCircle className="w-4 h-4" />
//     }
//   }

//   const totalContrats = contrats.length
//   const contratsActifs = contrats.filter(c => c.statut === 'actif' || c.statut === 'accepte').length
//   const contratsEnAttente = contrats.filter(c => c.statut === 'en_attente').length
//   const totalSessions = contrats.reduce((acc, c) => acc + (c.sessions?.length || 0), 0)
//   const sessionsPlanifiees = contrats.reduce((acc, c) => acc + (c.sessions?.filter(s => s.statut === 'planifie').length || 0), 0)
//   const sessionsEnCours = contrats.reduce((acc, c) => acc + (c.sessions?.filter(s => s.statut === 'en_cours').length || 0), 0)

//   const elevesUniques = [...new Set(contrats.map(c => `${c.eleve?.prenom} ${c.eleve?.nom}`))]

//   if (loading) {
//     return (
//       <div className='flex items-center justify-center h-screen'>
//         <div className='w-20'>
//           <Loader/> 
//         </div>
//       </div>
//     )
//   }

//   if (!user) return null

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       {/* Message de notification */}
//       {message && (
//         <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
//           message.includes('succès') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
//         }`}>
//           {message}
//         </div>
//       )}

//       {/* Message profil incomplet */}
//       {precepteurInfo && (
//         !precepteurInfo.commune || 
//         !precepteurInfo.quartier || 
//         !precepteurInfo.diplome || 
//         !precepteurInfo.etablissement_origine || 
//         precepteurInfo.annees_experience === 0 || 
//         precepteurInfo.statut_verification === 'en_attente' || 
//         precepteurInfo.statut_verification === 'rejete'
//       ) && (
//         <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
//           <div className="flex-shrink-0 mt-0.5">
//             <AlertCircle className="w-5 h-5 text-red-600" />
//           </div>
//           <div className="flex-1">
//             <h3 className="text-sm font-semibold text-red-800 mb-1">
//               {precepteurInfo.statut_verification === 'rejete' 
//                 ? 'Votre dossier a été rejeté' 
//                 : precepteurInfo.statut_verification === 'en_attente'
//                 ? 'Votre dossier est en attente de vérification'
//                 : 'Profil incomplet'}
//             </h3>
//             <p className="text-sm text-red-700">
//               {precepteurInfo.statut_verification === 'rejete' 
//                 ? 'Votre dossier a été rejeté. Veuillez mettre à jour vos informations.'
//                 : 'Complétez votre profil pour apparaître dans les recherches.'}
//             </p>
//             <button
//               onClick={openModal}
//               className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
//             >
//               <Edit3 className="w-4 h-4" />
//               Modifier le profil
//             </button>
//           </div>
//         </div>
//       )}

//       {/* En-tête profil */}
//       <div className="bg-white rounded-2xl mb-6 p-6">
//         <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
//          {/* En-tête profil - Partie photo CORRIGÉE */}
// <div className="relative group w-24 h-24 flex-shrink-0">
//   {user.photo_profil ? (
//     <img 
//       src={
//         user.photo_profil.startsWith('http') 
//           ? user.photo_profil 
//           : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace('/api', '')}${user.photo_profil}`
//       }
//       alt={`Photo de ${user.username}`}
//       className="w-24 h-24 rounded-full object-cover border-2 border-gray-100"
//       onError={(e) => {
//         console.error('❌ Erreur chargement image:', e.currentTarget.src)
//         e.currentTarget.style.display = 'none'
//         const placeholder = e.currentTarget.nextElementSibling as HTMLElement
//         if (placeholder) {
//           placeholder.style.display = 'flex'
//         }
//       }}
//       onLoad={() => console.log('✅ Image chargée avec succès')}
//     />
//   ) : null}
  
//   <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-2 border-gray-100 ${user.photo_profil ? 'hidden' : 'flex'}`}>
//     <User className="w-10 h-10 text-blue-400" />
//   </div>
  
//   <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
//     <Upload className="w-5 h-5 text-white" />
//     <input 
//       type="file" 
//       accept="image/*" 
//       onChange={handlePhotoUpload} 
//       className="hidden" 
//       disabled={uploading} 
//     />
//   </label>
  
//   {uploading && (
//     <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-full">
//       <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//     </div>
//   )}
// </div>
//           <div className="flex-1">
//             <h1 className="text-2xl font-bold">
//               {user.username}
//               {precepteurInfo?.statut_verification === 'verifie' && (
//                 <span className="text-sm font-normal text-blue-700 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
//                   - <CheckBadgeIcon className="w-5 h-5" /> Vérifié
//                 </span>
//               )}
//             </h1>
//             <p className="text-gray-600 flex items-center gap-2 mt-1">
//               <GraduationCap className="w-4 h-4" />
//               Précepteur
//               {selectedMatieres.length > 0 && (
//                 <span className="text-sm text-gray-500">
//                   • {selectedMatieres.length} matière{selectedMatieres.length > 1 ? 's' : ''}
//                 </span>
//               )}
//             </p>
//             <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
//               <MapPin className="w-4 h-4" />
//               {precepteurInfo?.commune ? (
//                 <span>{precepteurInfo.commune}{precepteurInfo.quartier ? `, ${precepteurInfo.quartier}` : ''}</span>
//               ) : (
//                 <span>Localisation non spécifiée</span>
//               )}
//             </div>
//             <div className="flex items-center gap-2 mt-2">
//               <Star className="w-4 h-4 text-yellow-500" />
//               <span className="text-sm font-medium">{precepteurInfo?.note_moyenne?.toFixed(1) || '0.0'}/5</span>
//               <span className="text-xs text-gray-400">(0 évaluations)</span>
//             </div>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={toggleDisponible}
//               className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
//                 disponible
//                   ? 'bg-green-100 text-green-700 hover:bg-green-200'
//                   : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
//               }`}
//             >
//               {disponible ? (
//                 <>
//                   <Check className="w-4 h-4" /> Disponible
//                 </>
//               ) : (
//                 <>
//                   <X className="w-4 h-4" /> Indisponible
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
//           <div className="p-4 bg-blue-50 rounded-xl">
//             <p className="text-2xl font-bold text-blue-600">{elevesUniques.length}</p>
//             <p className="text-sm text-gray-600 flex items-center gap-1">
//               <User className="w-3 h-3" /> Élèves suivis
//             </p>
//           </div>
//           <div className="p-4 bg-green-50 rounded-xl">
//             <p className="text-2xl font-bold text-green-600">{totalContrats}</p>
//             <p className="text-sm text-gray-600 flex items-center gap-1">
//               <FileText className="w-3 h-3" /> Contrats
//             </p>
//           </div>
//           <div className="p-4 bg-purple-50 rounded-xl">
//             <p className="text-2xl font-bold text-purple-600">{contratsActifs}</p>
//             <p className="text-sm text-gray-600 flex items-center gap-1">
//               <Check className="w-3 h-3" /> Contrats actifs
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
//               <Calendar className="w-3 h-3" /> Sessions à venir
//             </p>
//           </div>
//           <div className="p-4 bg-yellow-50 rounded-xl">
//             <p className="text-2xl font-bold text-yellow-600">{sessionsEnCours}</p>
//             <p className="text-sm text-gray-600 flex items-center gap-1">
//               <Clock className="w-3 h-3" /> En cours
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Navigation tabs */}
//       <div className="flex gap-4 mb-6 overflow-x-auto">
//         <button onClick={() => setActiveTab('profil')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'profil' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
//           <User className="w-4 h-4" /> Profil
//         </button>
//         <button onClick={() => setActiveTab('matieres')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'matieres' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
//           <BookOpen className="w-4 h-4" /> Matières ({selectedMatieres.length})
//         </button>
//         <button onClick={() => setActiveTab('contrats')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'contrats' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
//           <FileText className="w-4 h-4" /> Contrats ({contrats.length})
//         </button>
//         <button onClick={() => setActiveTab('candidatures')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'candidatures' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
//           <Send className="w-4 h-4" /> Candidatures ({candidatures.length})
//         </button>
//         <button onClick={() => setActiveTab('documents')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'documents' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
//           <FileText className="w-4 h-4" /> Documents
//         </button>
//         <button onClick={() => setActiveTab('services')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'services' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
//           <BookOpen className="w-4 h-4" /> Mes Services
//         </button>
//       </div>

//       {/* Profil */}
//       {activeTab === 'profil' && (
//         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
//             <div>
//               <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//                 <User className="w-5 h-5 text-gray-700" />
//                 Informations du précepteur
//               </h3>
//               <p className="text-sm text-gray-500 mt-0.5">Profil professionnel</p>
//             </div>
//             <button onClick={openModal} className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium">
//               <Edit3 className="w-4 h-4" /> Modifier le profil
//             </button>
//           </div>
//           <div className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Commune</p>
//                 <p className="font-medium text-gray-900">{precepteurInfo?.commune || 'Non spécifié'}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Téléphone</p>
//                 <p className="font-medium text-gray-900">{precepteurInfo?.telephone || 'Non spécifié'}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Quartier</p>
//                 <p className="font-medium text-gray-900">{precepteurInfo?.quartier || 'Non spécifié'}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Années d'expérience</p>
//                 <p className="font-medium text-gray-900">{precepteurInfo?.annees_experience || 0} an(s)</p>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><GraduationCap className="w-3 h-3" /> Diplôme</p>
//                 <p className="font-medium text-gray-900">{precepteurInfo?.diplome || 'Non spécifié'}</p>
//               </div>
//               <div className="md:col-span-2">
//                 <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><GraduationCap className="w-3 h-3" /> Établissement d'origine</p>
//                 <p className="font-medium text-gray-900">{precepteurInfo?.etablissement_origine || 'Non spécifié'}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Matières */}
//       {activeTab === 'matieres' && (
//         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
//             <div>
//               <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//                 <PiBookOpen className="w-5 h-5 text-gray-700" /> Mes matières
//               </h3>
//               <p className="text-sm text-gray-500 mt-0.5">{selectedMatieres.length} matière{selectedMatieres.length > 1 ? 's' : ''}</p>
//             </div>
//             <button onClick={openModal} className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium">
//               <PiPlus className="w-4 h-4" /> Gérer les matières
//             </button>
//           </div>
//           {selectedMatieres.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 px-6">
//               <PiBookOpen className="w-16 h-16 text-gray-300 mb-4" />
//               <p className="text-gray-500 text-lg font-medium mb-1">Aucune matière sélectionnée</p>
//               <p className="text-gray-400 text-sm mb-6">Ajoutez les matières que vous enseignez</p>
//               <button onClick={openModal} className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium text-sm">
//                 <PiPlus className="w-4 h-4" /> Ajouter des matières
//               </button>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-100">
//               {selectedMatieres.map(matiereId => {
//                 const matiere = matieres.find(m => m.id === matiereId)
//                 if (!matiere) return null
//                 return (
//                   <div key={matiereId} className="p-4 hover:bg-gray-50/50 transition-colors group">
//                     <div className="flex items-center gap-4">
//                       <div className="flex-shrink-0">
//                         <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
//                           <PiBookOpen className="w-5 h-5 text-blue-600" />
//                         </div>
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="font-medium text-gray-900 truncate">{matiere.nom}</p>
//                         <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
//                           {matiere.niveau && <span>🎯 {matiere.niveau}</span>}
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <button onClick={() => handleMatiereToggle(matiere.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Retirer la matière">
//                           <PiTrash className="w-5 h-5" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Contrats */}
//       {activeTab === 'contrats' && (
//         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
//             <div>
//               <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//                 <FileText className="w-5 h-5 text-gray-700" /> Mes contrats
//               </h3>
//               <p className="text-sm text-gray-500 mt-0.5">{contrats.length} contrat{contrats.length > 1 ? 's' : ''}</p>
//             </div>
//           </div>
//           {contrats.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 px-6">
//               <FileText className="w-16 h-16 text-gray-300 mb-4" />
//               <p className="text-gray-500 text-lg font-medium mb-1">Aucun contrat</p>
//               <p className="text-gray-400 text-sm">Les contrats apparaîtront ici une fois que des parents vous contacteront.</p>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-100">
//               {contrats.map((contrat) => (
//                 <div key={contrat.id}>
//                   <div className="p-4 hover:bg-gray-50/50 transition-colors group flex items-center gap-4 cursor-pointer" onClick={() => openContractDetail(contrat)}>
//                     <div className="flex-shrink-0">
//                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getContratStatutColor(contrat.statut)}`}>
//                         <FileText className="w-5 h-5" />
//                       </div>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 mb-1">
//                         <p className="font-medium text-gray-900 truncate">{contrat.matiere?.nom || 'Matière'}</p>
//                         <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getContratStatutColor(contrat.statut)}`}>
//                           {getStatutIcon(contrat.statut)}
//                           {contrat.statut.replace('_', ' ')}
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-2 text-xs text-gray-500">
//                         <span className="flex items-center gap-1"><User className="w-3 h-3" /> {contrat.eleve?.prenom} {contrat.eleve?.nom}</span>
//                         <span>•</span>
//                         <span>{contrat.eleve?.niveau}</span>
//                         {contrat.tarif_horaire && (
//                           <>
//                             <span>•</span>
//                             <span className="text-green-600 font-medium">{contrat.tarif_horaire.toLocaleString()} FC/h</span>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
//                       {contrat.statut === 'en_attente' && (
//                         <>
//                           <button onClick={(e) => { e.stopPropagation(); handleContractStatusChange(contrat.id, 'accepte') }} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Accepter">
//                             <Check className="w-5 h-5" />
//                           </button>
//                           <button onClick={(e) => { e.stopPropagation(); handleContractStatusChange(contrat.id, 'refuse') }} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Refuser">
//                             <X className="w-5 h-5" />
//                           </button>
//                         </>
//                       )}
//                       <button onClick={(e) => { e.stopPropagation(); openContractDetail(contrat) }} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Voir les détails">
//                         <Eye className="w-5 h-5" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Candidatures */}
//       {activeTab === 'candidatures' && (
//         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
//             <div>
//               <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//                 <Send className="w-5 h-5 text-gray-700" /> Mes candidatures
//               </h3>
//               <p className="text-sm text-gray-500 mt-0.5">
//                 {candidatures.length} candidature{candidatures.length > 1 ? 's' : ''} envoyée{candidatures.length > 1 ? 's' : ''}
//               </p>
//             </div>
//             <button 
//               onClick={loadCandidatures}
//               className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1"
//             >
//               <RefreshCw className="w-3.5 h-3.5" />
//               Actualiser
//             </button>
//           </div>
          
//           {loadingCandidatures ? (
//             <div className="flex items-center justify-center py-16">
//               <Loader />
//             </div>
//           ) : candidatures.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 px-6">
//               <Send className="w-16 h-16 text-gray-300 mb-4" />
//               <p className="text-gray-500 text-lg font-medium mb-1">Aucune candidature</p>
//               <p className="text-gray-400 text-sm mb-6">
//                 Vous n'avez pas encore postulé à des services parents
//               </p>
//               <Link 
//                 href="/solicitation" 
//                 className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium text-sm"
//               >
//                 <Send className="w-4 h-4" />
//                 Voir les services disponibles
//               </Link>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-100">
//               {candidatures.map((candidature) => (
//                 <div key={candidature.id} className="p-4 hover:bg-gray-50/50 transition-colors">
//                   <div className="flex items-start gap-4">
//                     <div className="flex-shrink-0">
//                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getCandidatureStatutColor(candidature.statut)}`}>
//                         <Send className="w-5 h-5" />
//                       </div>
//                     </div>
                    
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 mb-1">
//                         <p className="font-medium text-gray-900">
//                           Service #{candidature.service_parent_id}
//                         </p>
//                         <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getCandidatureStatutColor(candidature.statut)}`}>
//                           {candidature.statut === 'en_attente' && <Clock className="w-3 h-3" />}
//                           {candidature.statut === 'accepte' && <Check className="w-3 h-3" />}
//                           {candidature.statut === 'refuse' && <X className="w-3 h-3" />}
//                           {candidature.statut === 'en_attente' ? 'En attente' :
//                            candidature.statut === 'accepte' ? 'Acceptée' :
//                            candidature.statut === 'refuse' ? 'Refusée' :
//                            candidature.statut}
//                         </span>
//                       </div>
                      
//                       <p className="text-sm text-gray-600 line-clamp-2">
//                         {candidature.message}
//                       </p>
                      
//                       <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
//                         {candidature.tarif_propose && (
//                           <span className="flex items-center gap-1 text-green-600 font-medium">
//                             💰 {candidature.tarif_propose.toLocaleString()} FC/h
//                           </span>
//                         )}
                        
//                         {candidature.disponibilites && (
//                           <span className="flex items-center gap-1">
//                             📅 {candidature.disponibilites}
//                           </span>
//                         )}
                        
//                         <span className="flex items-center gap-1">
//                           📆 {new Date(candidature.created_at).toLocaleDateString('fr-FR', {
//                             day: 'numeric',
//                             month: 'short',
//                             year: 'numeric'
//                           })}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Documents */}
//       {activeTab === 'documents' && (
//         <div className="bg-white rounded-2xl p-6">
//           <ListeDocuments refresh={refreshDocs} onRefresh={() => setRefreshDocs(prev => prev + 1)} />
//         </div>
//       )}

//       {/* Services */}
//       {activeTab === 'services' && (
//         <div className="bg-white rounded-2xl p-6">
//           {precepteurInfo?.id ? (
//             <ServiceManager precepteurId={precepteurInfo.id} isOwner={true} />
//           ) : (
//             <div className="text-center py-8">
//               <p className="text-gray-500">Chargement du profil précepteur...</p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Modal de modification du profil */}
//       {showModal && (
//         <ProfilModal
//           isOpen={showModal}
//           onClose={() => setShowModal(false)}
//           onSave={handleSave}
//           initialData={form}
//           selectedMatieres={selectedMatieres}
//           onMatieresChange={setSelectedMatieres}
//           saving={saving}
//         />
//       )}

//       {/* Modal de création de session */}
//       <CreateSessionModal
//         contract={selectedContractForSession}
//         isOpen={showCreateSessionModal}
//         onClose={() => {
//           setShowCreateSessionModal(false)
//           setSelectedContractForSession(null)
//           setCreatingSession(false)
//         }}
//         onSuccess={() => {
//           loadContrats()
//           setMessage('Session planifiée avec succès !')
//           setTimeout(() => setMessage(''), 3000)
//           setCreatingSession(false)
//         }}
//         onCreating={() => setCreatingSession(true)}
//         onError={() => setCreatingSession(false)}
//       />

//       {/* Modal de détail session */}
//       <SessionDetailModal
//         session={selectedSession}
//         isOpen={showSessionModal}
//         onClose={() => setShowSessionModal(false)}
//         onStatusChange={handleSessionStatusChange}
//         onNotesUpdate={handleNotesUpdate}
//       />
//     </div>
//   )
// }


// app/dashboard/precepteur/page.tsx
'use client'
import { useRouter } from 'next/navigation'
import UploadDocument from '@/components/UploadDocument'
import ServiceManager from '@/components/ServiceManager'
import ListeDocuments from '@/components/ListeDocuments'
import ProfilModal from '@/components/ProfilModal'
import { useAuth } from '@/context/AuthContext'
import CreateSessionModal from './CreateSessionModal'
import SessionDetailModal from './SessionDetailModal'
import { updateProfilePhoto, updatePrecepteurDisponibility } from '@/actions/auth'
import { updatePrecepteurProfil, getPrecepteurMatieres, getContrats, updateContratStatus, updateSessionStatus, updateSessionNotes } from '@/actions/precepteur'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { 
  User, MapPin, Star, Clock, BookOpen, GraduationCap, Calendar, 
  Edit3, Check, X, Upload, Plus, Trash2, Eye, AlertCircle, 
  ChevronDown, Filter, Play, StopCircle, Ban, RotateCcw, FileText, 
  Users, Tag, Phone, Mail, Building, CreditCard,Search, Hash, MessageSquare, 
  Activity, RefreshCw, Send, Loader2, DollarSign
} from 'lucide-react'
import { PiBookOpen, PiPlus, PiTrash } from 'react-icons/pi'
import Loader from '@/components/Loader'
import { CheckBadgeIcon } from '@heroicons/react/24/solid'

// Types
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
  parent?: {
    id: string
    user_id: string
    user?: {
      username: string
      photo_profil: string | null
    }
  } | null
  service_parent?: {
    id: string
    titre: string
    description: string
    eleve?: {
      nom: string
      prenom: string
      niveau: string
    }
  } | null
}

// type NegotiationMessage = {
//   id: string
//   contract_id: string
//   sender_id: string
//   sender_type: 'parent' | 'precepteur'
//   message: string
//   tarif_propose: number | null
//   created_at: string
//   sender?: {
//     username: string
//     photo_profil: string | null
//   }
// }
// Dans les types, assure-toi que c'est bien 'sender' et pas 'sender_type'
type NegotiationMessage = {
  id: string
  contract_id: string
  sender_id: string
  sender: 'parent' | 'precepteur'  // Changé de sender_type à sender
  message: string
  tarif_propose: number | null
  created_at: string
}


type Candidature = {
  id: string
  service_parent_id: string
  precepteur_id: number
  message: string
  tarif_propose: number | null
  disponibilites: string | null
  statut: 'en_attente' | 'accepte' | 'refuse'
  created_at: string
  service_parent?: {
    id: string
    titre: string
    description: string
    matiere_preferee: string | null
    niveau_eleve: string
    budget_horaire: number | null
    lieu_preference: string
    parent?: {
      user?: {
        username: string
      }
    }
  }
}

interface ProfilForm {
  latitude: string
  longitude: string
  commune: string
  quartier: string
  annees_experience: number
  diplome: string
  etablissement_origine: string
  telephone: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export default function PrecepteurDashboard() {
  const router = useRouter()
  const { user, precepteurInfo, refreshPrecepteurInfo, updateUser } = useAuth()
  
  // États principaux
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profil')
  const [showModal, setShowModal] = useState(false)
  const [refreshDocs, setRefreshDocs] = useState(0)
  
  // États contrats
  const [contrats, setContrats] = useState<Contrat[]>([])
  const [loadingContrats, setLoadingContrats] = useState(false)
  
  // États négociation
  const [showNegotiationModal, setShowNegotiationModal] = useState(false)
  const [selectedContratForNegotiation, setSelectedContratForNegotiation] = useState<Contrat | null>(null)
  const [negotiationForm, setNegotiationForm] = useState({
    message: '',
    tarif_propose: 0
  })
  const [negotiationMessages, setNegotiationMessages] = useState<NegotiationMessage[]>([])
  const [sendingNegotiation, setSendingNegotiation] = useState(false)
  
  // États matières
  const [matieres, setMatieres] = useState<any[]>([])
  const [selectedMatieres, setSelectedMatieres] = useState<number[]>([])
  
  // États candidatures
  const [candidatures, setCandidatures] = useState<Candidature[]>([])
  const [loadingCandidatures, setLoadingCandidatures] = useState(false)
  
  // États sessions
  const [creatingSession, setCreatingSession] = useState(false)
  const [selectedSession, setSelectedSession] = useState<any>(null)
  const [showSessionModal, setShowSessionModal] = useState(false)
  const [selectedContractForSession, setSelectedContractForSession] = useState<Contrat | null>(null)
  const [showCreateSessionModal, setShowCreateSessionModal] = useState(false)
  
  // États formulaire profil
  const [form, setForm] = useState<ProfilForm>({
    latitude: '',
    longitude: '',
    commune: '',
    quartier: '',
    annees_experience: 0,
    diplome: '',
    etablissement_origine: '',
    telephone: ''
  })
  
  const [disponible, setDisponible] = useState(precepteurInfo?.disponible ?? true)

  // Initialisation des données
  useEffect(() => {
    let isMounted = true

    const initializeData = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      if (!precepteurInfo) {
        await refreshPrecepteurInfo()
      }

      if (!isMounted) return

      if (precepteurInfo) {
        setForm({
          latitude: precepteurInfo.latitude?.toString() || '',
          longitude: precepteurInfo.longitude?.toString() || '',
          commune: precepteurInfo.commune || '',
          quartier: precepteurInfo.quartier || '',
          annees_experience: precepteurInfo.annees_experience || 0,
          diplome: precepteurInfo.diplome || '',
          telephone: precepteurInfo.telephone || '',
          etablissement_origine: precepteurInfo.etablissement_origine || ''
        })
        setDisponible(precepteurInfo.disponible ?? true)
        
        if (precepteurInfo.precepteur_matieres) {
          setSelectedMatieres(precepteurInfo.precepteur_matieres.map((pm: any) => pm.matiere_id))
        }
        
        await Promise.all([loadContrats(), loadMatieres(), loadCandidatures()])
      }

      if (isMounted) {
        setLoading(false)
      }
    }

    initializeData()

    return () => {
      isMounted = false
    }
  }, [user?.id, precepteurInfo?.id])

  // Charger les contrats
  const loadContrats = useCallback(async () => {
    if (!precepteurInfo) return
    
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
    } catch (error) {
      console.error('❌ Erreur chargement contrats:', error)
    } finally {
      setLoadingContrats(false)
    }
  }, [precepteurInfo])

  // Charger les matières
  const loadMatieres = async () => {
    try {
      const result = await getPrecepteurMatieres()
      if (result.success) {
        setMatieres(result.matieres || [])
      }
    } catch (error) {
      console.error('❌ Erreur chargement matières:', error)
    }
  }

  // Charger les candidatures
  const loadCandidatures = async () => {
    if (!precepteurInfo) return
    
    setLoadingCandidatures(true)
    try {
      const token = localStorage.getItem('excellence-token')
      if (!token) return
      
      const response = await fetch(`${API_URL}/auth/candidatures/mes-candidatures`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setCandidatures(data.candidatures || [])
        }
      }
    } catch (error) {
      console.error('❌ Erreur chargement candidatures:', error)
    } finally {
      setLoadingCandidatures(false)
    }
  }

  // Gérer le statut du contrat
  const handleContractStatusChange = async (contratId: string, newStatus: string) => {
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
// La fonction sendNegotiationMessage CORRIGÉE
const sendNegotiationMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setSendingNegotiation(true)

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
        
        // Ajouter le message localement avec le bon sender
        const newMessage = {
          id: data.message?.id || `temp-${Date.now()}`,
          contract_id: selectedContratForNegotiation?.id || '',
          sender_id: user?.id || '',
          sender: 'precepteur', // FORCÉ à 'precepteur' pour l'affichage local
          message: negotiationForm.message,
          tarif_propose: negotiationForm.tarif_propose || null,
          created_at: new Date().toISOString()
        }
        
        setNegotiationMessages(prev => [...prev, newMessage as NegotiationMessage])
        setNegotiationForm({ ...negotiationForm, message: '' })
      }
    } catch (error) {
      console.error('❌ Erreur envoi message:', error)
    } finally {
      setSendingNegotiation(false)
    }
  }
  // const sendNegotiationMessage = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setSendingNegotiation(true)

  //   try {
  //     const token = localStorage.getItem('excellence-token')
  //     if (!token) throw new Error('Non connecté')

  //     const response = await fetch(`${API_URL}/auth/contracts/${selectedContratForNegotiation?.id}/negotiations`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`
  //       },
  //       body: JSON.stringify({
  //         message: negotiationForm.message,
  //         tarif_propose: negotiationForm.tarif_propose
  //       })
  //     })

  //     if (response.ok) {
  //       const data = await response.json()
  //       setNegotiationMessages([...negotiationMessages, data.message])
  //       setNegotiationForm({ ...negotiationForm, message: '' })
  //     }
  //   } catch (error) {
  //     console.error('❌ Erreur envoi message:', error)
  //   } finally {
  //     setSendingNegotiation(false)
  //   }
  // }

  // Sauvegarde du profil
  const handleSave = async (data: ProfilForm & { matieres: number[] }) => {
    setSaving(true)
    setMessage('')
    
    try {
      const result = await updatePrecepteurProfil({
        latitude: data.latitude || undefined,
        longitude: data.longitude || undefined,
        commune: data.commune || undefined,
        quartier: data.quartier || undefined,
        annees_experience: data.annees_experience || 0,
        diplome: data.diplome || undefined,
        etablissement_origine: data.etablissement_origine || undefined,
        telephone: data.telephone || undefined,
        matieres: data.matieres
      })
      
      if (result.success) {
        setShowModal(false)
        setMessage('✅ Profil mis à jour avec succès !')
        await refreshPrecepteurInfo()
      } else {
        setMessage(result.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error)
      setMessage('Erreur lors de la mise à jour du profil')
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  // Upload photo
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (file.size > 5 * 1024 * 1024) {
      setMessage('Image trop volumineuse. Maximum 5MB.')
      setTimeout(() => setMessage(''), 3000)
      return
    }
    
    setUploading(true)
    
    try {
      const result = await updateProfilePhoto(file)
      
      if (result.success && result.photoUrl) {
        updateUser({ photo_profil: result.photoUrl })
        setMessage('Photo mise à jour avec succès')
      } else {
        setMessage(result.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('❌ Erreur upload photo:', error)
      setMessage('Erreur lors de l\'upload de la photo')
    } finally {
      setUploading(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  // Toggle disponibilité
  const toggleDisponible = async () => {
    const newDisponible = !disponible
    setDisponible(newDisponible)
    
    try {
      const result = await updatePrecepteurDisponibility(newDisponible)
      if (result.success) {
        await refreshPrecepteurInfo()
      } else {
        setDisponible(!newDisponible)
        setMessage(result.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Erreur toggleDisponible:', error)
      setDisponible(!newDisponible)
      setMessage('Erreur lors de la mise à jour')
    }
  }

  // Gestion matières
  const handleMatiereToggle = (matiereId: number) => {
    setSelectedMatieres(prev => 
      prev.includes(matiereId)
        ? prev.filter(id => id !== matiereId)
        : [...prev, matiereId]
    )
  }

  const openModal = () => {
    if (precepteurInfo) {
      setForm({
        latitude: precepteurInfo.latitude?.toString() || '',
        longitude: precepteurInfo.longitude?.toString() || '',
        commune: precepteurInfo.commune || '',
        quartier: precepteurInfo.quartier || '',
        annees_experience: precepteurInfo.annees_experience || 0,
        diplome: precepteurInfo.diplome || '',
        telephone: precepteurInfo.telephone || '',
        etablissement_origine: precepteurInfo.etablissement_origine || ''
      })
    }
    setShowModal(true)
  }

  // Helpers UI
  const getContratStatutColor = (statut: string) => {
    switch (statut) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-800'
      case 'accepte': return 'bg-blue-100 text-blue-800'
      case 'actif': return 'bg-green-100 text-green-800'
      case 'refuse': return 'bg-red-100 text-red-800'
      case 'termine': return 'bg-gray-100 text-gray-800'
      case 'annule': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCandidatureStatutColor = (statut: string) => {
    switch (statut) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-800'
      case 'accepte': return 'bg-green-100 text-green-800'
      case 'refuse': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'en_attente': return <Clock className="w-4 h-4" />
      case 'accepte':
      case 'actif': return <Check className="w-4 h-4" />
      case 'refuse':
      case 'annule': return <X className="w-4 h-4" />
      case 'termine': return <Check className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
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
    const baseUrl = API_URL.replace('/api', '')
    return `${baseUrl}${photoPath}`
  }

  // Stats
  const contratsActifs = contrats.filter(c => c.statut === 'actif' || c.statut === 'accepte').length
  const contratsEnAttente = contrats.filter(c => c.statut === 'en_attente').length

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='w-20'><Loader/></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Message de notification */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
          message.includes('Erreur') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
        }`}>
          {message.includes('Erreur') ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <Check className="w-4 h-4 flex-shrink-0" />}
          {message}
        </div>
      )}

      {/* Message profil incomplet */}
      {precepteurInfo && (
        !precepteurInfo.commune || 
        !precepteurInfo.quartier || 
        !precepteurInfo.diplome || 
        !precepteurInfo.etablissement_origine || 
        precepteurInfo.annees_experience === 0 || 
        precepteurInfo.statut_verification === 'en_attente' || 
        precepteurInfo.statut_verification === 'rejete'
      ) && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-amber-800 mb-1">
              {precepteurInfo.statut_verification === 'rejete' 
                ? 'Votre dossier a été rejeté' 
                : precepteurInfo.statut_verification === 'en_attente'
                ? 'Votre dossier est en attente de vérification'
                : 'Profil incomplet'}
            </h3>
            <p className="text-sm text-amber-700">
              {precepteurInfo.statut_verification === 'rejete' 
                ? 'Votre dossier a été rejeté. Veuillez mettre à jour vos informations.'
                : 'Complétez votre profil pour apparaître dans les recherches.'}
            </p>
            <button
              onClick={openModal}
              className="mt-3 px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Modifier le profil
            </button>
          </div>
        </div>
      )}

      {/* ========== CARD PROFIL ========== */}
      <div className="bg-white rounded-2xl mb-6 p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
          {/* Photo de profil */}
          <div className="relative group w-24 h-24 flex-shrink-0 mx-auto md:mx-0">
            {user.photo_profil ? (
              <img 
                src={getPhotoUrl(user.photo_profil) || ''}
                alt={`Photo de ${user.username}`}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-100"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const placeholder = e.currentTarget.nextElementSibling as HTMLElement
                  if (placeholder) placeholder.style.display = 'flex'
                }}
              />
            ) : null}
            
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-2 border-gray-100 ${user.photo_profil ? 'hidden' : 'flex'}`}>
              <User className="w-10 h-10 text-blue-400" />
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
            <h1 className="text-2xl font-bold">
              {user.username}
              {precepteurInfo?.statut_verification === 'verifie' && (
                <span className="inline-flex items-center gap-1 ml-2 text-blue-600">
                  <CheckBadgeIcon className="w-5 h-5" />
                  <span className="text-sm font-normal">Vérifié</span>
                </span>
              )}
            </h1>
            <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2 mt-1">
              <GraduationCap className="w-4 h-4" />
              Précepteur
              {selectedMatieres.length > 0 && (
                <span className="text-sm text-gray-500">
                  • {selectedMatieres.length} matière{selectedMatieres.length > 1 ? 's' : ''}
                </span>
              )}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              {precepteurInfo?.commune ? (
                <span>{precepteurInfo.commune}{precepteurInfo.quartier ? `, ${precepteurInfo.quartier}` : ''}</span>
              ) : (
                <span>Localisation non spécifiée</span>
              )}
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">{precepteurInfo?.note_moyenne?.toFixed(1) || '0.0'}/5</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <button
              onClick={toggleDisponible}
              className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 font-medium ${
                disponible
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {disponible ? <><Check className="w-4 h-4" /> Disponible</> : <><X className="w-4 h-4" /> Indisponible</>}
            </button>
            <Link href="/solicitation" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-md">
              <Search className="w-4 h-4" /> Services disponibles
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl">
            <p className="text-2xl font-bold text-blue-600">{selectedMatieres.length}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1"><BookOpen className="w-3 h-3" /> Matières</p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl">
            <p className="text-2xl font-bold text-green-600">{contrats.length}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1"><FileText className="w-3 h-3" /> Contrats</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl">
            <p className="text-2xl font-bold text-purple-600">{contratsActifs}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1"><Check className="w-3 h-3" /> Actifs</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-xl">
            <p className="text-2xl font-bold text-orange-600">{contratsEnAttente}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1"><Clock className="w-3 h-3" /> En attente</p>
          </div>
          <div className="p-4 bg-teal-50 rounded-xl">
            <p className="text-2xl font-bold text-teal-600">{candidatures.length}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1"><Send className="w-3 h-3" /> Candidatures</p>
          </div>
        </div>
      </div>

      {/* ========== TABS ========== */}
      <div className="flex gap-4 mb-6 overflow-x-auto flex-wrap">
        <button onClick={() => setActiveTab('profil')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'profil' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
          <User className="w-4 h-4" /> Profil
        </button>
        <button onClick={() => setActiveTab('matieres')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'matieres' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
          <BookOpen className="w-4 h-4" /> Matières ({selectedMatieres.length})
        </button>
        <button onClick={() => setActiveTab('contrats')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'contrats' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
          <FileText className="w-4 h-4" /> Contrats ({contrats.length})
        </button>
        <button onClick={() => setActiveTab('candidatures')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'candidatures' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
          <Send className="w-4 h-4" /> Candidatures ({candidatures.length})
        </button>
        <button onClick={() => setActiveTab('documents')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'documents' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
          <FileText className="w-4 h-4" /> Documents
        </button>
      </div>

      {/* ========== ONGLET PROFIL ========== */}
      {activeTab === 'profil' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2"><User className="w-5 h-5 text-gray-700" />Informations du précepteur</h3>
              <p className="text-sm text-gray-500 mt-0.5">Profil professionnel</p>
            </div>
            <button onClick={openModal} className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium">
              <Edit3 className="w-4 h-4" /> Modifier le profil
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Commune</p>
                <p className="font-medium text-gray-900">{precepteurInfo?.commune || 'Non spécifié'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Quartier</p>
                <p className="font-medium text-gray-900">{precepteurInfo?.quartier || 'Non spécifié'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Téléphone</p>
                <p className="font-medium text-gray-900">{precepteurInfo?.telephone || 'Non spécifié'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Années d'expérience</p>
                <p className="font-medium text-gray-900">{precepteurInfo?.annees_experience || 0} an(s)</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><GraduationCap className="w-3 h-3" /> Diplôme</p>
                <p className="font-medium text-gray-900">{precepteurInfo?.diplome || 'Non spécifié'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Building className="w-3 h-3" /> Établissement d'origine</p>
                <p className="font-medium text-gray-900">{precepteurInfo?.etablissement_origine || 'Non spécifié'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== ONGLET MATIÈRES ========== */}
      {activeTab === 'matieres' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2"><BookOpen className="w-5 h-5 text-gray-700" />Mes matières</h3>
              <p className="text-sm text-gray-500 mt-0.5">{selectedMatieres.length} matière{selectedMatieres.length > 1 ? 's' : ''}</p>
            </div>
            <button onClick={openModal} className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium">
              <Plus className="w-4 h-4" /> Gérer les matières
            </button>
          </div>
          {selectedMatieres.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium mb-1">Aucune matière sélectionnée</p>
              <p className="text-gray-400 text-sm mb-6">Ajoutez les matières que vous enseignez</p>
              <button onClick={openModal} className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium text-sm">
                <Plus className="w-4 h-4" /> Ajouter des matières
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {selectedMatieres.map(matiereId => {
                const matiere = matieres.find(m => m.id === matiereId)
                return (
                  <div key={matiereId} className="p-4 hover:bg-gray-50/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{matiere?.nom || `Matière #${matiereId}`}</p>
                        {matiere?.niveau && <p className="text-xs text-gray-500 mt-0.5">🎯 {matiere.niveau}</p>}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleMatiereToggle(matiereId)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Retirer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ========== ONGLET CONTRATS ========== */}
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
            <div className="flex items-center justify-center py-16"><Loader /></div>
          ) : contrats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <FileText className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium mb-1">Aucun contrat</p>
              <p className="text-gray-400 text-sm">Les contrats apparaîtront ici quand les parents vous engageront.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {contrats.map((contrat) => (
                <div key={contrat.id} className="p-4 hover:bg-gray-50/50 transition-colors group">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getContratStatutColor(contrat.statut)}`}>
                        <FileText className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900">{contrat.titre}</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getContratStatutColor(contrat.statut)}`}>
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
                        {contrat.parent?.user && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {contrat.parent.user.username}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Négociation */}
                      <button onClick={() => openNegotiation(contrat)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Négocier">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      
                      {/* Actions selon statut */}
                      {contrat.statut === 'en_attente' && (
                        <>
                          <button onClick={() => handleContractStatusChange(contrat.id, 'accepte')}
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Accepter">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleContractStatusChange(contrat.id, 'refuse')}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Refuser">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {contrat.statut === 'accepte' && (
                        <button onClick={() => handleContractStatusChange(contrat.id, 'actif')}
                          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Démarrer">
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      {contrat.statut === 'actif' && (
                        <>
                          <button onClick={() => handleContractStatusChange(contrat.id, 'termine')}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Terminer">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleContractStatusChange(contrat.id, 'annule')}
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

      {/* ========== ONGLET CANDIDATURES ========== */}
      {activeTab === 'candidatures' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Send className="w-5 h-5 text-gray-700" />Mes candidatures</h3>
              <p className="text-sm text-gray-500 mt-0.5">{candidatures.length} candidature{candidatures.length > 1 ? 's' : ''} envoyée{candidatures.length > 1 ? 's' : ''}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={loadCandidatures} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> Actualiser
              </button>
              <Link href="/solicitation" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-md">
                <Search className="w-4 h-4" /> Voir les services
              </Link>
            </div>
          </div>
          
          {loadingCandidatures ? (
            <div className="flex items-center justify-center py-16"><Loader /></div>
          ) : candidatures.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <Send className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium mb-1">Aucune candidature</p>
              <p className="text-gray-400 text-sm mb-6">Vous n'avez pas encore postulé à des services</p>
              <Link href="/solicitation" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 font-medium text-sm shadow-md">
                <Search className="w-4 h-4" /> Découvrir les services
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {candidatures.map((candidature) => (
                <div key={candidature.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getCandidatureStatutColor(candidature.statut)}`}>
                        <Send className="w-5 h-5" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900">
                          {candidature.service_parent?.titre || `Service #${candidature.service_parent_id}`}
                        </p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getCandidatureStatutColor(candidature.statut)}`}>
                          {candidature.statut === 'en_attente' && <><Clock className="w-3 h-3" /> En attente</>}
                          {candidature.statut === 'accepte' && <><Check className="w-3 h-3" /> Acceptée</>}
                          {candidature.statut === 'refuse' && <><X className="w-3 h-3" /> Refusée</>}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{candidature.message}</p>
                      
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        {candidature.tarif_propose && (
                          <span className="flex items-center gap-1 text-green-600 font-medium">
                            <DollarSign className="w-3 h-3" /> {candidature.tarif_propose.toLocaleString()} FC/h
                          </span>
                        )}
                        {candidature.disponibilites && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {candidature.disponibilites}
                          </span>
                        )}
                        <span>📆 {formatDate(candidature.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========== ONGLET DOCUMENTS ========== */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-2xl p-6">
          <ListeDocuments refresh={refreshDocs} onRefresh={() => setRefreshDocs(prev => prev + 1)} />
        </div>
      )}


{/* ========== MODAL NÉGOCIATION CORRIGÉ (MÊME LOGIQUE QUE PARENT, MAIS INVERSE) ========== */}
{showNegotiationModal && selectedContratForNegotiation && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          Négociation
        </h2>
        <button onClick={() => setShowNegotiationModal(false)} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="bg-blue-50 rounded-xl p-4 mb-4">
          <p className="text-sm font-medium text-blue-900">
            {selectedContratForNegotiation.titre}
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Tarif actuel : {selectedContratForNegotiation.tarif_final?.toLocaleString()} FC/h • 
            Statut : {selectedContratForNegotiation.statut.replace('_', ' ')}
          </p>
        </div>

        {negotiationMessages.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucun message. Commencez la négociation.</p>
          </div>
        ) : (
          negotiationMessages.map((msg, index) => (
            <div key={msg.id || index} className={`flex ${msg.sender === 'precepteur' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-xl ${
                msg.sender === 'precepteur' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
              }`}>
                <p className="text-sm">{msg.message}</p>
                {msg.tarif_propose && (
                  <p className="text-xs mt-1 opacity-75">
                    💰 Proposition : {msg.tarif_propose.toLocaleString()} FC/h
                  </p>
                )}
                <p className="text-xs mt-1 opacity-50">
                  {formatDate(msg.created_at)}
                </p>
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
              <label className="text-xs text-gray-500">Contre-proposition (FC/h) :</label>
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
            disabled={sendingNegotiation}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 self-end"
          >
            {sendingNegotiation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      {/* ========== MODAL PROFIL ========== */}
      {showModal && (
        <ProfilModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          initialData={form}
          selectedMatieres={selectedMatieres}
          onMatieresChange={setSelectedMatieres}
          saving={saving}
        />
      )}
    </div>
  )
}