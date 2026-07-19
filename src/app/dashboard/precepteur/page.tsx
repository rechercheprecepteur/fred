

// // // // // // app/dashboard/precepteur/page.tsx
// // // // // 'use client'
// // // // // import { useRouter } from 'next/navigation'
// // // // // import UploadDocument from '@/components/UploadDocument'
// // // // // import ServiceManager from '@/components/ServiceManager'
// // // // // import ListeDocuments from '@/components/ListeDocuments'
// // // // // import ProfilModal from '@/components/ProfilModal'
// // // // // import { useAuth } from '@/context/AuthContext'
// // // // // import CreateSessionModal from './CreateSessionModal'
// // // // // import SessionDetailModal from './SessionDetailModal'
// // // // // import { updateProfilePhoto, updatePrecepteurDisponibility } from '@/actions/auth'
// // // // // import { updatePrecepteurProfil, getPrecepteurMatieres, getContrats, updateContratStatus, updateSessionStatus, updateSessionNotes } from '@/actions/precepteur'
// // // // // import { useState, useEffect, useCallback, useRef } from 'react'
// // // // // import Link from 'next/link'
// // // // // import { 
// // // // //   User, MapPin, Star, Clock, BookOpen, GraduationCap, Calendar, 
// // // // //   Edit3, Check, X, Upload, Plus, Trash2, Eye, AlertCircle, 
// // // // //   ChevronDown, Filter, Play, StopCircle, Ban, RotateCcw, FileText, 
// // // // //   Users, Tag, Phone, Mail, Building, CreditCard,Search, Hash, MessageSquare, 
// // // // //   Activity, RefreshCw, Send, Loader2, DollarSign
// // // // // } from 'lucide-react'
// // // // // import { PiBookOpen, PiPlus, PiTrash } from 'react-icons/pi'
// // // // // import Loader from '@/components/Loader'
// // // // // import { CheckBadgeIcon } from '@heroicons/react/24/solid'

// // // // // // Types
// // // // // type Contrat = {
// // // // //   id: string
// // // // //   service_parent_id: string
// // // // //   parent_id: string
// // // // //   precepteur_id: number
// // // // //   titre: string
// // // // //   matiere: string | null
// // // // //   niveau: string
// // // // //   frequence: string
// // // // //   lieu: string
// // // // //   date_debut: string
// // // // //   duree: string
// // // // //   tarif_final: number
// // // // //   notes: string | null
// // // // //   statut: 'en_attente' | 'accepte' | 'refuse' | 'actif' | 'termine' | 'annule'
// // // // //   created_at: string
// // // // //   updated_at: string
// // // // //   parent?: {
// // // // //     id: string
// // // // //     user_id: string
// // // // //     user?: {
// // // // //       username: string
// // // // //       photo_profil: string | null
// // // // //     }
// // // // //   } | null
// // // // //   service_parent?: {
// // // // //     id: string
// // // // //     titre: string
// // // // //     description: string
// // // // //     eleve?: {
// // // // //       nom: string
// // // // //       prenom: string
// // // // //       niveau: string
// // // // //     }
// // // // //   } | null
// // // // // }

// // // // // type NegotiationMessage = {
// // // // //   id: string
// // // // //   contract_id: string
// // // // //   sender_id: string
// // // // //   sender: 'parent' | 'precepteur'
// // // // //   message: string
// // // // //   tarif_propose: number | null
// // // // //   created_at: string
// // // // // }

// // // // // type Candidature = {
// // // // //   id: string
// // // // //   service_parent_id: string
// // // // //   precepteur_id: number
// // // // //   message: string
// // // // //   tarif_propose: number | null
// // // // //   disponibilites: string | null
// // // // //   statut: 'en_attente' | 'accepte' | 'refuse'
// // // // //   created_at: string
// // // // //   service_parent?: {
// // // // //     id: string
// // // // //     titre: string
// // // // //     description: string
// // // // //     matiere_preferee: string | null
// // // // //     niveau_eleve: string
// // // // //     budget_horaire: number | null
// // // // //     lieu_preference: string
// // // // //     parent?: {
// // // // //       user?: {
// // // // //         username: string
// // // // //       }
// // // // //     }
// // // // //   }
// // // // // }

// // // // // interface ProfilForm {
// // // // //   latitude: string
// // // // //   longitude: string
// // // // //   commune: string
// // // // //   quartier: string
// // // // //   annees_experience: number
// // // // //   diplome: string
// // // // //   etablissement_origine: string
// // // // //   telephone: string
// // // // // }

// // // // // const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
// // // // // const POLLING_INTERVAL = 3000 // 3 secondes pour le polling en temps réel

// // // // // export default function PrecepteurDashboard() {
// // // // //   const router = useRouter()
// // // // //   const { user, precepteurInfo, refreshPrecepteurInfo, updateUser } = useAuth()
  
// // // // //   // États principaux
// // // // //   const [uploading, setUploading] = useState(false)
// // // // //   const [saving, setSaving] = useState(false)
// // // // //   const [message, setMessage] = useState('')
// // // // //   const [loading, setLoading] = useState(true)
// // // // //   const [activeTab, setActiveTab] = useState('profil')
// // // // //   const [showModal, setShowModal] = useState(false)
// // // // //   const [refreshDocs, setRefreshDocs] = useState(0)
  
// // // // //   // États contrats
// // // // //   const [contrats, setContrats] = useState<Contrat[]>([])
// // // // //   const [loadingContrats, setLoadingContrats] = useState(false)
  
// // // // //   // États négociation
// // // // //   const [showNegotiationModal, setShowNegotiationModal] = useState(false)
// // // // //   const [selectedContratForNegotiation, setSelectedContratForNegotiation] = useState<Contrat | null>(null)
// // // // //   const [negotiationForm, setNegotiationForm] = useState({
// // // // //     message: '',
// // // // //     tarif_propose: 0
// // // // //   })
// // // // //   const [negotiationMessages, setNegotiationMessages] = useState<NegotiationMessage[]>([])
// // // // //   const [sendingNegotiation, setSendingNegotiation] = useState(false)
  
// // // // //   // États matières
// // // // //   const [matieres, setMatieres] = useState<any[]>([])
// // // // //   const [selectedMatieres, setSelectedMatieres] = useState<number[]>([])
  
// // // // //   // États candidatures
// // // // //   const [candidatures, setCandidatures] = useState<Candidature[]>([])
// // // // //   const [loadingCandidatures, setLoadingCandidatures] = useState(false)
  
// // // // //   // États sessions
// // // // //   const [creatingSession, setCreatingSession] = useState(false)
// // // // //   const [selectedSession, setSelectedSession] = useState<any>(null)
// // // // //   const [showSessionModal, setShowSessionModal] = useState(false)
// // // // //   const [selectedContractForSession, setSelectedContractForSession] = useState<Contrat | null>(null)
// // // // //   const [showCreateSessionModal, setShowCreateSessionModal] = useState(false)
  
// // // // //   // États formulaire profil
// // // // //   const [form, setForm] = useState<ProfilForm>({
// // // // //     latitude: '',
// // // // //     longitude: '',
// // // // //     commune: '',
// // // // //     quartier: '',
// // // // //     annees_experience: 0,
// // // // //     diplome: '',
// // // // //     etablissement_origine: '',
// // // // //     telephone: ''
// // // // //   })
  
// // // // //   const [disponible, setDisponible] = useState(precepteurInfo?.disponible ?? true)

// // // // //   // Refs pour le polling
// // // // //   const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
// // // // //   const messagesEndRef = useRef<HTMLDivElement>(null)

// // // // //   // Initialisation des données
// // // // //   useEffect(() => {
// // // // //     let isMounted = true

// // // // //     const initializeData = async () => {
// // // // //       if (!user) {
// // // // //         setLoading(false)
// // // // //         return
// // // // //       }

// // // // //       if (!precepteurInfo) {
// // // // //         await refreshPrecepteurInfo()
// // // // //       }

// // // // //       if (!isMounted) return

// // // // //       if (precepteurInfo) {
// // // // //         setForm({
// // // // //           latitude: precepteurInfo.latitude?.toString() || '',
// // // // //           longitude: precepteurInfo.longitude?.toString() || '',
// // // // //           commune: precepteurInfo.commune || '',
// // // // //           quartier: precepteurInfo.quartier || '',
// // // // //           annees_experience: precepteurInfo.annees_experience || 0,
// // // // //           diplome: precepteurInfo.diplome || '',
// // // // //           telephone: precepteurInfo.telephone || '',
// // // // //           etablissement_origine: precepteurInfo.etablissement_origine || ''
// // // // //         })
// // // // //         setDisponible(precepteurInfo.disponible ?? true)
        
// // // // //         if (precepteurInfo.precepteur_matieres) {
// // // // //           setSelectedMatieres(precepteurInfo.precepteur_matieres.map((pm: any) => pm.matiere_id))
// // // // //         }
        
// // // // //         await Promise.all([loadContrats(), loadMatieres(), loadCandidatures()])
// // // // //       }

// // // // //       if (isMounted) {
// // // // //         setLoading(false)
// // // // //       }
// // // // //     }

// // // // //     initializeData()

// // // // //     return () => {
// // // // //       isMounted = false
// // // // //     }
// // // // //   }, [user?.id, precepteurInfo?.id])

// // // // //   // Nettoyer le polling quand le composant est démonté
// // // // //   useEffect(() => {
// // // // //     return () => {
// // // // //       if (pollingIntervalRef.current) {
// // // // //         clearInterval(pollingIntervalRef.current)
// // // // //       }
// // // // //     }
// // // // //   }, [])

// // // // //   // Scroll automatique vers le bas quand de nouveaux messages arrivent
// // // // //   useEffect(() => {
// // // // //     if (messagesEndRef.current) {
// // // // //       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
// // // // //     }
// // // // //   }, [negotiationMessages])

// // // // //   // Charger les messages de négociation
// // // // //   const loadNegotiationMessages = async (contratId: string) => {
// // // // //     try {
// // // // //       const token = localStorage.getItem('excellence-token')
// // // // //       if (!token) return

// // // // //       const response = await fetch(`${API_URL}/auth/contracts/${contratId}/negotiations`, {
// // // // //         headers: {
// // // // //           'Authorization': `Bearer ${token}`,
// // // // //           'Content-Type': 'application/json'
// // // // //         }
// // // // //       })

// // // // //       if (response.ok) {
// // // // //         const data = await response.json()
// // // // //         setNegotiationMessages(data.messages || [])
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error('❌ Erreur chargement négociations:', error)
// // // // //     }
// // // // //   }

// // // // //   // Démarrer le polling pour les messages en temps réel
// // // // //   const startNegotiationPolling = (contratId: string) => {
// // // // //     // Arrêter tout polling existant
// // // // //     if (pollingIntervalRef.current) {
// // // // //       clearInterval(pollingIntervalRef.current)
// // // // //     }

// // // // //     // Charger les messages immédiatement
// // // // //     loadNegotiationMessages(contratId)

// // // // //     // Démarrer le polling périodique
// // // // //     pollingIntervalRef.current = setInterval(() => {
// // // // //       loadNegotiationMessages(contratId)
// // // // //     }, POLLING_INTERVAL)
// // // // //   }

// // // // //   // Arrêter le polling
// // // // //   const stopNegotiationPolling = () => {
// // // // //     if (pollingIntervalRef.current) {
// // // // //       clearInterval(pollingIntervalRef.current)
// // // // //       pollingIntervalRef.current = null
// // // // //     }
// // // // //   }

// // // // //   // Charger les contrats
// // // // //   const loadContrats = useCallback(async () => {
// // // // //     if (!precepteurInfo) return
    
// // // // //     setLoadingContrats(true)
// // // // //     try {
// // // // //       const token = localStorage.getItem('excellence-token')
// // // // //       if (!token) return

// // // // //       const response = await fetch(`${API_URL}/auth/contracts`, {
// // // // //         headers: {
// // // // //           'Authorization': `Bearer ${token}`,
// // // // //           'Content-Type': 'application/json'
// // // // //         }
// // // // //       })

// // // // //       const data = await response.json()
// // // // //       if (data.success) {
// // // // //         setContrats(data.contrats || [])
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error('❌ Erreur chargement contrats:', error)
// // // // //     } finally {
// // // // //       setLoadingContrats(false)
// // // // //     }
// // // // //   }, [precepteurInfo])

// // // // //   // Charger les matières
// // // // //   const loadMatieres = async () => {
// // // // //     try {
// // // // //       const result = await getPrecepteurMatieres()
// // // // //       if (result.success) {
// // // // //         setMatieres(result.matieres || [])
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error('❌ Erreur chargement matières:', error)
// // // // //     }
// // // // //   }

// // // // //   // Charger les candidatures
// // // // //   const loadCandidatures = async () => {
// // // // //     if (!precepteurInfo) return
    
// // // // //     setLoadingCandidatures(true)
// // // // //     try {
// // // // //       const token = localStorage.getItem('excellence-token')
// // // // //       if (!token) return
      
// // // // //       const response = await fetch(`${API_URL}/auth/candidatures/mes-candidatures`, {
// // // // //         headers: {
// // // // //           'Authorization': `Bearer ${token}`,
// // // // //           'Content-Type': 'application/json'
// // // // //         }
// // // // //       })
      
// // // // //       if (response.ok) {
// // // // //         const data = await response.json()
// // // // //         if (data.success) {
// // // // //           setCandidatures(data.candidatures || [])
// // // // //         }
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error('❌ Erreur chargement candidatures:', error)
// // // // //     } finally {
// // // // //       setLoadingCandidatures(false)
// // // // //     }
// // // // //   }

// // // // //   // Gérer le statut du contrat
// // // // //   const handleContractStatusChange = async (contratId: string, newStatus: string) => {
// // // // //     try {
// // // // //       const token = localStorage.getItem('excellence-token')
// // // // //       if (!token) return

// // // // //       const response = await fetch(`${API_URL}/auth/contracts/${contratId}/status`, {
// // // // //         method: 'PATCH',
// // // // //         headers: {
// // // // //           'Content-Type': 'application/json',
// // // // //           'Authorization': `Bearer ${token}`
// // // // //         },
// // // // //         body: JSON.stringify({ statut: newStatus })
// // // // //       })

// // // // //       if (response.ok) {
// // // // //         setMessage(`✅ Contrat ${newStatus.replace('_', ' ')} avec succès`)
// // // // //         setTimeout(() => setMessage(''), 3000)
// // // // //         loadContrats()
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error('❌ Erreur changement statut contrat:', error)
// // // // //     }
// // // // //   }

// // // // //   // Ouvrir la négociation
// // // // //   const openNegotiation = async (contrat: Contrat) => {
// // // // //     setSelectedContratForNegotiation(contrat)
// // // // //     setNegotiationForm({
// // // // //       message: '',
// // // // //       tarif_propose: contrat.tarif_final
// // // // //     })
    
// // // // //     // Démarrer le polling pour les messages en temps réel
// // // // //     startNegotiationPolling(contrat.id)
// // // // //     setShowNegotiationModal(true)
// // // // //   }

// // // // //   // Fermer la négociation
// // // // //   const closeNegotiation = () => {
// // // // //     stopNegotiationPolling()
// // // // //     setShowNegotiationModal(false)
// // // // //     setSelectedContratForNegotiation(null)
// // // // //   }

// // // // //   // Envoyer un message de négociation
// // // // //   const sendNegotiationMessage = async (e: React.FormEvent) => {
// // // // //     e.preventDefault()
// // // // //     setSendingNegotiation(true)

// // // // //     try {
// // // // //       const token = localStorage.getItem('excellence-token')
// // // // //       if (!token) throw new Error('Non connecté')

// // // // //       const response = await fetch(`${API_URL}/auth/contracts/${selectedContratForNegotiation?.id}/negotiations`, {
// // // // //         method: 'POST',
// // // // //         headers: {
// // // // //           'Content-Type': 'application/json',
// // // // //           'Authorization': `Bearer ${token}`
// // // // //         },
// // // // //         body: JSON.stringify({
// // // // //           message: negotiationForm.message,
// // // // //           tarif_propose: negotiationForm.tarif_propose
// // // // //         })
// // // // //       })

// // // // //       if (response.ok) {
// // // // //         // Recharger immédiatement les messages après l'envoi
// // // // //         if (selectedContratForNegotiation) {
// // // // //           await loadNegotiationMessages(selectedContratForNegotiation.id)
// // // // //         }
// // // // //         setNegotiationForm({ ...negotiationForm, message: '' })
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error('❌ Erreur envoi message:', error)
// // // // //     } finally {
// // // // //       setSendingNegotiation(false)
// // // // //     }
// // // // //   }

// // // // //   // Sauvegarde du profil
// // // // //   const handleSave = async (data: ProfilForm & { matieres: number[] }) => {
// // // // //     setSaving(true)
// // // // //     setMessage('')
    
// // // // //     try {
// // // // //       const result = await updatePrecepteurProfil({
// // // // //         latitude: data.latitude || undefined,
// // // // //         longitude: data.longitude || undefined,
// // // // //         commune: data.commune || undefined,
// // // // //         quartier: data.quartier || undefined,
// // // // //         annees_experience: data.annees_experience || 0,
// // // // //         diplome: data.diplome || undefined,
// // // // //         etablissement_origine: data.etablissement_origine || undefined,
// // // // //         telephone: data.telephone || undefined,
// // // // //         matieres: data.matieres
// // // // //       })
      
// // // // //       if (result.success) {
// // // // //         setShowModal(false)
// // // // //         setMessage('✅ Profil mis à jour avec succès !')
// // // // //         await refreshPrecepteurInfo()
// // // // //       } else {
// // // // //         setMessage(result.error || 'Erreur lors de la mise à jour')
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error('❌ Erreur sauvegarde:', error)
// // // // //       setMessage('Erreur lors de la mise à jour du profil')
// // // // //     } finally {
// // // // //       setSaving(false)
// // // // //       setTimeout(() => setMessage(''), 3000)
// // // // //     }
// // // // //   }

// // // // //   // Upload photo
// // // // //   const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
// // // // //     const file = e.target.files?.[0]
// // // // //     if (!file) return
    
// // // // //     if (file.size > 5 * 1024 * 1024) {
// // // // //       setMessage('Image trop volumineuse. Maximum 5MB.')
// // // // //       setTimeout(() => setMessage(''), 3000)
// // // // //       return
// // // // //     }
    
// // // // //     setUploading(true)
    
// // // // //     try {
// // // // //       const result = await updateProfilePhoto(file)
      
// // // // //       if (result.success && result.photoUrl) {
// // // // //         updateUser({ photo_profil: result.photoUrl })
// // // // //         setMessage('Photo mise à jour avec succès')
// // // // //       } else {
// // // // //         setMessage(result.error || 'Erreur lors de la mise à jour')
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error('❌ Erreur upload photo:', error)
// // // // //       setMessage('Erreur lors de l\'upload de la photo')
// // // // //     } finally {
// // // // //       setUploading(false)
// // // // //       setTimeout(() => setMessage(''), 3000)
// // // // //     }
// // // // //   }

// // // // //   // Toggle disponibilité
// // // // //   const toggleDisponible = async () => {
// // // // //     const newDisponible = !disponible
// // // // //     setDisponible(newDisponible)
    
// // // // //     try {
// // // // //       const result = await updatePrecepteurDisponibility(newDisponible)
// // // // //       if (result.success) {
// // // // //         await refreshPrecepteurInfo()
// // // // //       } else {
// // // // //         setDisponible(!newDisponible)
// // // // //         setMessage(result.error || 'Erreur lors de la mise à jour')
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error('Erreur toggleDisponible:', error)
// // // // //       setDisponible(!newDisponible)
// // // // //       setMessage('Erreur lors de la mise à jour')
// // // // //     }
// // // // //   }

// // // // //   // Gestion matières
// // // // //   const handleMatiereToggle = (matiereId: number) => {
// // // // //     setSelectedMatieres(prev => 
// // // // //       prev.includes(matiereId)
// // // // //         ? prev.filter(id => id !== matiereId)
// // // // //         : [...prev, matiereId]
// // // // //     )
// // // // //   }

// // // // //   const openModal = () => {
// // // // //     if (precepteurInfo) {
// // // // //       setForm({
// // // // //         latitude: precepteurInfo.latitude?.toString() || '',
// // // // //         longitude: precepteurInfo.longitude?.toString() || '',
// // // // //         commune: precepteurInfo.commune || '',
// // // // //         quartier: precepteurInfo.quartier || '',
// // // // //         annees_experience: precepteurInfo.annees_experience || 0,
// // // // //         diplome: precepteurInfo.diplome || '',
// // // // //         telephone: precepteurInfo.telephone || '',
// // // // //         etablissement_origine: precepteurInfo.etablissement_origine || ''
// // // // //       })
// // // // //     }
// // // // //     setShowModal(true)
// // // // //   }

// // // // //   // Helpers UI
// // // // //   const getContratStatutColor = (statut: string) => {
// // // // //     switch (statut) {
// // // // //       case 'en_attente': return 'bg-yellow-100 text-yellow-800'
// // // // //       case 'accepte': return 'bg-blue-100 text-blue-800'
// // // // //       case 'actif': return 'bg-green-100 text-green-800'
// // // // //       case 'refuse': return 'bg-red-100 text-red-800'
// // // // //       case 'termine': return 'bg-gray-100 text-gray-800'
// // // // //       case 'annule': return 'bg-red-100 text-red-800'
// // // // //       default: return 'bg-gray-100 text-gray-800'
// // // // //     }
// // // // //   }

// // // // //   const getCandidatureStatutColor = (statut: string) => {
// // // // //     switch (statut) {
// // // // //       case 'en_attente': return 'bg-yellow-100 text-yellow-800'
// // // // //       case 'accepte': return 'bg-green-100 text-green-800'
// // // // //       case 'refuse': return 'bg-red-100 text-red-800'
// // // // //       default: return 'bg-gray-100 text-gray-800'
// // // // //     }
// // // // //   }

// // // // //   const getStatutIcon = (statut: string) => {
// // // // //     switch (statut) {
// // // // //       case 'en_attente': return <Clock className="w-4 h-4" />
// // // // //       case 'accepte':
// // // // //       case 'actif': return <Check className="w-4 h-4" />
// // // // //       case 'refuse':
// // // // //       case 'annule': return <X className="w-4 h-4" />
// // // // //       case 'termine': return <Check className="w-4 h-4" />
// // // // //       default: return <AlertCircle className="w-4 h-4" />
// // // // //     }
// // // // //   }

// // // // //   const getFrequenceLabel = (frequence: string) => {
// // // // //     switch (frequence) {
// // // // //       case 'unique': return 'Ponctuel'
// // // // //       case 'hebdomadaire': return 'Hebdomadaire'
// // // // //       case 'bi-hebdomadaire': return '2x/semaine'
// // // // //       case 'mensuel': return 'Mensuel'
// // // // //       default: return frequence
// // // // //     }
// // // // //   }

// // // // //   const getDureeLabel = (duree: string) => {
// // // // //     switch (duree) {
// // // // //       case '1_mois': return '1 mois'
// // // // //       case '3_mois': return '3 mois'
// // // // //       case '6_mois': return '6 mois'
// // // // //       case '12_mois': return '1 an'
// // // // //       case 'indetermine': return 'Indéterminée'
// // // // //       default: return duree
// // // // //     }
// // // // //   }

// // // // //   const formatDate = (date: string) => {
// // // // //     return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
// // // // //   }

// // // // //   const formatDateTime = (date: string) => {
// // // // //     return new Date(date).toLocaleString('fr-FR', { 
// // // // //       day: 'numeric', 
// // // // //       month: 'short', 
// // // // //       hour: '2-digit', 
// // // // //       minute: '2-digit' 
// // // // //     })
// // // // //   }

// // // // //   const getPhotoUrl = (photoPath: string | null | undefined) => {
// // // // //     if (!photoPath) return null
// // // // //     if (photoPath.startsWith('http')) return photoPath
// // // // //     const baseUrl = API_URL.replace('/api', '')
// // // // //     return `${baseUrl}${photoPath}`
// // // // //   }

// // // // //   // Stats
// // // // //   const contratsActifs = contrats.filter(c => c.statut === 'actif' || c.statut === 'accepte').length
// // // // //   const contratsEnAttente = contrats.filter(c => c.statut === 'en_attente').length

// // // // //   if (loading) {
// // // // //     return (
// // // // //       <div className='flex items-center justify-center h-screen'>
// // // // //         <div className='w-20'><Loader/></div>
// // // // //       </div>
// // // // //     )
// // // // //   }

// // // // //   if (!user) return null

// // // // //   return (
// // // // //     <div className="max-w-6xl mx-auto px-4 py-8">
// // // // //       {/* Message de notification */}
// // // // //       {message && (
// // // // //         <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
// // // // //           message.includes('Erreur') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
// // // // //         }`}>
// // // // //           {message.includes('Erreur') ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <Check className="w-4 h-4 flex-shrink-0" />}
// // // // //           {message}
// // // // //         </div>
// // // // //       )}

// // // // //       {/* Message profil incomplet */}
// // // // //       {precepteurInfo && (
// // // // //         !precepteurInfo.commune || 
// // // // //         !precepteurInfo.quartier || 
// // // // //         !precepteurInfo.diplome || 
// // // // //         !precepteurInfo.etablissement_origine || 
// // // // //         precepteurInfo.annees_experience === 0 || 
// // // // //         precepteurInfo.statut_verification === 'en_attente' || 
// // // // //         precepteurInfo.statut_verification === 'rejete'
// // // // //       ) && (
// // // // //         <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
// // // // //           <div className="flex-shrink-0 mt-0.5">
// // // // //             <AlertCircle className="w-5 h-5 text-amber-600" />
// // // // //           </div>
// // // // //           <div className="flex-1">
// // // // //             <h3 className="text-sm font-semibold text-amber-800 mb-1">
// // // // //               {precepteurInfo.statut_verification === 'rejete' 
// // // // //                 ? 'Votre dossier a été rejeté' 
// // // // //                 : precepteurInfo.statut_verification === 'en_attente'
// // // // //                 ? 'Votre dossier est en attente de vérification'
// // // // //                 : 'Profil incomplet'}
// // // // //             </h3>
// // // // //             <p className="text-sm text-amber-700">
// // // // //               {precepteurInfo.statut_verification === 'rejete' 
// // // // //                 ? 'Votre dossier a été rejeté. Veuillez mettre à jour vos informations.'
// // // // //                 : 'Complétez votre profil pour apparaître dans les recherches.'}
// // // // //             </p>
// // // // //             <button
// // // // //               onClick={openModal}
// // // // //               className="mt-3 px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
// // // // //             >
// // // // //               <Edit3 className="w-4 h-4" />
// // // // //               Modifier le profil
// // // // //             </button>
// // // // //           </div>
// // // // //         </div>
// // // // //       )}

// // // // //       {/* ========== CARD PROFIL ========== */}
// // // // //       <div className="bg-white rounded-2xl mb-6 p-6">
// // // // //         <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
// // // // //           {/* Photo de profil */}
// // // // //           <div className="relative group w-24 h-24 flex-shrink-0 mx-auto md:mx-0">
// // // // //             {user.photo_profil ? (
// // // // //               <img 
// // // // //                 src={getPhotoUrl(user.photo_profil) || ''}
// // // // //                 alt={`Photo de ${user.username}`}
// // // // //                 className="w-24 h-24 rounded-full object-cover border-2 border-gray-100"
// // // // //                 onError={(e) => {
// // // // //                   e.currentTarget.style.display = 'none'
// // // // //                   const placeholder = e.currentTarget.nextElementSibling as HTMLElement
// // // // //                   if (placeholder) placeholder.style.display = 'flex'
// // // // //                 }}
// // // // //               />
// // // // //             ) : null}
            
// // // // //             <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-2 border-gray-100 ${user.photo_profil ? 'hidden' : 'flex'}`}>
// // // // //               <User className="w-10 h-10 text-blue-400" />
// // // // //             </div>
            
// // // // //             <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
// // // // //               {uploading ? (
// // // // //                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
// // // // //               ) : (
// // // // //                 <Upload className="w-5 h-5 text-white" />
// // // // //               )}
// // // // //               <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
// // // // //             </label>
// // // // //           </div>

// // // // //           <div className="flex-1 text-center md:text-left">
// // // // //             <h1 className="text-2xl font-bold">
// // // // //               {user.username}
// // // // //               {precepteurInfo?.statut_verification === 'verifie' && (
// // // // //                 <span className="inline-flex items-center gap-1 ml-2 text-blue-600">
// // // // //                   <CheckBadgeIcon className="w-5 h-5" />
// // // // //                   <span className="text-sm font-normal">Vérifié</span>
// // // // //                 </span>
// // // // //               )}
// // // // //             </h1>
// // // // //             <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2 mt-1">
// // // // //               <GraduationCap className="w-4 h-4" />
// // // // //               Précepteur
// // // // //               {selectedMatieres.length > 0 && (
// // // // //                 <span className="text-sm text-gray-500">
// // // // //                   • {selectedMatieres.length} matière{selectedMatieres.length > 1 ? 's' : ''}
// // // // //                 </span>
// // // // //               )}
// // // // //             </p>
// // // // //             <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm text-gray-500">
// // // // //               <MapPin className="w-4 h-4" />
// // // // //               {precepteurInfo?.commune ? (
// // // // //                 <span>{precepteurInfo.commune}{precepteurInfo.quartier ? `, ${precepteurInfo.quartier}` : ''}</span>
// // // // //               ) : (
// // // // //                 <span>Localisation non spécifiée</span>
// // // // //               )}
// // // // //             </div>
// // // // //             <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
// // // // //               <Star className="w-4 h-4 text-yellow-500" />
// // // // //               <span className="text-sm font-medium">{precepteurInfo?.note_moyenne?.toFixed(1) || '0.0'}/5</span>
// // // // //             </div>
// // // // //           </div>

// // // // //           <div className="flex flex-wrap gap-2 justify-center md:justify-start">
// // // // //             <button
// // // // //               onClick={toggleDisponible}
// // // // //               className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 font-medium ${
// // // // //                 disponible
// // // // //                   ? 'bg-green-100 text-green-700 hover:bg-green-200'
// // // // //                   : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
// // // // //               }`}
// // // // //             >
// // // // //               {disponible ? <><Check className="w-4 h-4" /> Disponible</> : <><X className="w-4 h-4" /> Indisponible</>}
// // // // //             </button>
// // // // //             <Link href="/solicitation" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-md">
// // // // //               <Search className="w-4 h-4" /> Services disponibles
// // // // //             </Link>
// // // // //           </div>
// // // // //         </div>

// // // // //         {/* Stats */}
// // // // //         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
// // // // //           <div className="p-4 bg-blue-50 rounded-xl">
// // // // //             <p className="text-2xl font-bold text-blue-600">{selectedMatieres.length}</p>
// // // // //             <p className="text-sm text-gray-600 flex items-center gap-1"><BookOpen className="w-3 h-3" /> Matières</p>
// // // // //           </div>
// // // // //           <div className="p-4 bg-green-50 rounded-xl">
// // // // //             <p className="text-2xl font-bold text-green-600">{contrats.length}</p>
// // // // //             <p className="text-sm text-gray-600 flex items-center gap-1"><FileText className="w-3 h-3" /> Contrats</p>
// // // // //           </div>
// // // // //           <div className="p-4 bg-purple-50 rounded-xl">
// // // // //             <p className="text-2xl font-bold text-purple-600">{contratsActifs}</p>
// // // // //             <p className="text-sm text-gray-600 flex items-center gap-1"><Check className="w-3 h-3" /> Actifs</p>
// // // // //           </div>
// // // // //           <div className="p-4 bg-orange-50 rounded-xl">
// // // // //             <p className="text-2xl font-bold text-orange-600">{contratsEnAttente}</p>
// // // // //             <p className="text-sm text-gray-600 flex items-center gap-1"><Clock className="w-3 h-3" /> En attente</p>
// // // // //           </div>
// // // // //           <div className="p-4 bg-teal-50 rounded-xl">
// // // // //             <p className="text-2xl font-bold text-teal-600">{candidatures.length}</p>
// // // // //             <p className="text-sm text-gray-600 flex items-center gap-1"><Send className="w-3 h-3" /> Candidatures</p>
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* ========== TABS ========== */}
// // // // //       <div className="flex gap-4 mb-6 overflow-x-auto flex-wrap">
// // // // //         <button onClick={() => setActiveTab('profil')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'profil' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
// // // // //           <User className="w-4 h-4" /> Profil
// // // // //         </button>
// // // // //         <button onClick={() => setActiveTab('matieres')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'matieres' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
// // // // //           <BookOpen className="w-4 h-4" /> Matières ({selectedMatieres.length})
// // // // //         </button>
// // // // //         <button onClick={() => setActiveTab('contrats')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'contrats' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
// // // // //           <FileText className="w-4 h-4" /> Contrats ({contrats.length})
// // // // //         </button>
// // // // //         <button onClick={() => setActiveTab('candidatures')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'candidatures' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
// // // // //           <Send className="w-4 h-4" /> Candidatures ({candidatures.length})
// // // // //         </button>
// // // // //         <button onClick={() => setActiveTab('documents')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'documents' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
// // // // //           <FileText className="w-4 h-4" /> Documents
// // // // //         </button>
// // // // //       </div>

// // // // //       {/* ========== ONGLET PROFIL ========== */}
// // // // //       {activeTab === 'profil' && (
// // // // //         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
// // // // //           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
// // // // //             <div>
// // // // //               <h3 className="font-semibold text-gray-900 flex items-center gap-2"><User className="w-5 h-5 text-gray-700" />Informations du précepteur</h3>
// // // // //               <p className="text-sm text-gray-500 mt-0.5">Profil professionnel</p>
// // // // //             </div>
// // // // //             <button onClick={openModal} className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium">
// // // // //               <Edit3 className="w-4 h-4" /> Modifier le profil
// // // // //             </button>
// // // // //           </div>
// // // // //           <div className="p-6">
// // // // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // // // //               <div>
// // // // //                 <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Commune</p>
// // // // //                 <p className="font-medium text-gray-900">{precepteurInfo?.commune || 'Non spécifié'}</p>
// // // // //               </div>
// // // // //               <div>
// // // // //                 <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Quartier</p>
// // // // //                 <p className="font-medium text-gray-900">{precepteurInfo?.quartier || 'Non spécifié'}</p>
// // // // //               </div>
// // // // //               <div>
// // // // //                 <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Téléphone</p>
// // // // //                 <p className="font-medium text-gray-900">{precepteurInfo?.telephone || 'Non spécifié'}</p>
// // // // //               </div>
// // // // //               <div>
// // // // //                 <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Années d'expérience</p>
// // // // //                 <p className="font-medium text-gray-900">{precepteurInfo?.annees_experience || 0} an(s)</p>
// // // // //               </div>
// // // // //               <div>
// // // // //                 <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><GraduationCap className="w-3 h-3" /> Diplôme</p>
// // // // //                 <p className="font-medium text-gray-900">{precepteurInfo?.diplome || 'Non spécifié'}</p>
// // // // //               </div>
// // // // //               <div>
// // // // //                 <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Building className="w-3 h-3" /> Établissement d'origine</p>
// // // // //                 <p className="font-medium text-gray-900">{precepteurInfo?.etablissement_origine || 'Non spécifié'}</p>
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>
// // // // //       )}

// // // // //       {/* ========== ONGLET MATIÈRES ========== */}
// // // // //       {activeTab === 'matieres' && (
// // // // //         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
// // // // //           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
// // // // //             <div>
// // // // //               <h3 className="font-semibold text-gray-900 flex items-center gap-2"><BookOpen className="w-5 h-5 text-gray-700" />Mes matières</h3>
// // // // //               <p className="text-sm text-gray-500 mt-0.5">{selectedMatieres.length} matière{selectedMatieres.length > 1 ? 's' : ''}</p>
// // // // //             </div>
// // // // //             <button onClick={openModal} className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium">
// // // // //               <Plus className="w-4 h-4" /> Gérer les matières
// // // // //             </button>
// // // // //           </div>
// // // // //           {selectedMatieres.length === 0 ? (
// // // // //             <div className="flex flex-col items-center justify-center py-16 px-6">
// // // // //               <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
// // // // //               <p className="text-gray-500 text-lg font-medium mb-1">Aucune matière sélectionnée</p>
// // // // //               <p className="text-gray-400 text-sm mb-6">Ajoutez les matières que vous enseignez</p>
// // // // //               <button onClick={openModal} className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium text-sm">
// // // // //                 <Plus className="w-4 h-4" /> Ajouter des matières
// // // // //               </button>
// // // // //             </div>
// // // // //           ) : (
// // // // //             <div className="divide-y divide-gray-100">
// // // // //               {selectedMatieres.map(matiereId => {
// // // // //                 const matiere = matieres.find(m => m.id === matiereId)
// // // // //                 return (
// // // // //                   <div key={matiereId} className="p-4 hover:bg-gray-50/50 transition-colors group">
// // // // //                     <div className="flex items-center gap-4">
// // // // //                       <div className="flex-shrink-0">
// // // // //                         <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
// // // // //                           <BookOpen className="w-5 h-5 text-blue-600" />
// // // // //                         </div>
// // // // //                       </div>
// // // // //                       <div className="flex-1 min-w-0">
// // // // //                         <p className="font-medium text-gray-900 truncate">{matiere?.nom || `Matière #${matiereId}`}</p>
// // // // //                         {matiere?.niveau && <p className="text-xs text-gray-500 mt-0.5">🎯 {matiere.niveau}</p>}
// // // // //                       </div>
// // // // //                       <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
// // // // //                         <button onClick={() => handleMatiereToggle(matiereId)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Retirer">
// // // // //                           <Trash2 className="w-4 h-4" />
// // // // //                         </button>
// // // // //                       </div>
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 )
// // // // //               })}
// // // // //             </div>
// // // // //           )}
// // // // //         </div>
// // // // //       )}

// // // // //       {/* ========== ONGLET CONTRATS ========== */}
// // // // //       {activeTab === 'contrats' && (
// // // // //         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
// // // // //           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
// // // // //             <div>
// // // // //               <h3 className="font-semibold text-gray-900 flex items-center gap-2"><FileText className="w-5 h-5 text-gray-700" />Mes contrats</h3>
// // // // //               <p className="text-sm text-gray-500 mt-0.5">{contrats.length} contrat{contrats.length > 1 ? 's' : ''}</p>
// // // // //             </div>
// // // // //             <button onClick={loadContrats} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1">
// // // // //               <RefreshCw className="w-3.5 h-3.5" /> Actualiser
// // // // //             </button>
// // // // //           </div>
// // // // //           {loadingContrats ? (
// // // // //             <div className="flex items-center justify-center py-16"><Loader /></div>
// // // // //           ) : contrats.length === 0 ? (
// // // // //             <div className="flex flex-col items-center justify-center py-16 px-6">
// // // // //               <FileText className="w-16 h-16 text-gray-300 mb-4" />
// // // // //               <p className="text-gray-500 text-lg font-medium mb-1">Aucun contrat</p>
// // // // //               <p className="text-gray-400 text-sm">Les contrats apparaîtront ici quand les parents vous engageront.</p>
// // // // //             </div>
// // // // //           ) : (
// // // // //             <div className="divide-y divide-gray-100">
// // // // //               {contrats.map((contrat) => (
// // // // //                 <div key={contrat.id} className="p-4 hover:bg-gray-50/50 transition-colors group">
// // // // //                   <div className="flex items-start gap-4">
// // // // //                     <div className="flex-shrink-0">
// // // // //                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getContratStatutColor(contrat.statut)}`}>
// // // // //                         <FileText className="w-5 h-5" />
// // // // //                       </div>
// // // // //                     </div>
// // // // //                     <div className="flex-1 min-w-0">
// // // // //                       <div className="flex items-center gap-2 mb-1">
// // // // //                         <p className="font-medium text-gray-900">{contrat.titre}</p>
// // // // //                         <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getContratStatutColor(contrat.statut)}`}>
// // // // //                           {getStatutIcon(contrat.statut)}{contrat.statut.replace('_', ' ')}
// // // // //                         </span>
// // // // //                       </div>
// // // // //                       <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
// // // // //                         <span>{contrat.matiere} • {contrat.niveau}</span>
// // // // //                         <span>•</span>
// // // // //                         <span>{getFrequenceLabel(contrat.frequence)}</span>
// // // // //                         <span>•</span>
// // // // //                         <span className="text-green-600 font-medium">{contrat.tarif_final?.toLocaleString()} FC/h</span>
// // // // //                         <span>•</span>
// // // // //                         <span>{getDureeLabel(contrat.duree)}</span>
// // // // //                       </div>
// // // // //                       <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
// // // // //                         <span>Début: {formatDate(contrat.date_debut)}</span>
// // // // //                         {contrat.parent?.user && (
// // // // //                           <>
// // // // //                             <span>•</span>
// // // // //                             <span className="flex items-center gap-1"><User className="w-3 h-3" /> {contrat.parent.user.username}</span>
// // // // //                           </>
// // // // //                         )}
// // // // //                       </div>
// // // // //                     </div>
// // // // //                     <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
// // // // //                       {/* Négociation */}
// // // // //                       <button onClick={() => openNegotiation(contrat)}
// // // // //                         className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Négocier">
// // // // //                         <MessageSquare className="w-4 h-4" />
// // // // //                       </button>
                      
// // // // //                       {/* Actions selon statut */}
// // // // //                       {contrat.statut === 'en_attente' && (
// // // // //                         <>
// // // // //                           <button onClick={() => handleContractStatusChange(contrat.id, 'accepte')}
// // // // //                             className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Accepter">
// // // // //                             <Check className="w-4 h-4" />
// // // // //                           </button>
// // // // //                           <button onClick={() => handleContractStatusChange(contrat.id, 'refuse')}
// // // // //                             className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Refuser">
// // // // //                             <X className="w-4 h-4" />
// // // // //                           </button>
// // // // //                         </>
// // // // //                       )}
// // // // //                       {contrat.statut === 'accepte' && (
// // // // //                         <button onClick={() => handleContractStatusChange(contrat.id, 'actif')}
// // // // //                           className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Démarrer">
// // // // //                           <Play className="w-4 h-4" />
// // // // //                         </button>
// // // // //                       )}
// // // // //                       {contrat.statut === 'actif' && (
// // // // //                         <>
// // // // //                           <button onClick={() => handleContractStatusChange(contrat.id, 'termine')}
// // // // //                             className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Terminer">
// // // // //                             <Check className="w-4 h-4" />
// // // // //                           </button>
// // // // //                           <button onClick={() => handleContractStatusChange(contrat.id, 'annule')}
// // // // //                             className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Annuler">
// // // // //                             <Ban className="w-4 h-4" />
// // // // //                           </button>
// // // // //                         </>
// // // // //                       )}
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 </div>
// // // // //               ))}
// // // // //             </div>
// // // // //           )}
// // // // //         </div>
// // // // //       )}

// // // // //       {/* ========== ONGLET CANDIDATURES ========== */}
// // // // //       {activeTab === 'candidatures' && (
// // // // //         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
// // // // //           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
// // // // //             <div>
// // // // //               <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Send className="w-5 h-5 text-gray-700" />Mes candidatures</h3>
// // // // //               <p className="text-sm text-gray-500 mt-0.5">{candidatures.length} candidature{candidatures.length > 1 ? 's' : ''} envoyée{candidatures.length > 1 ? 's' : ''}</p>
// // // // //             </div>
// // // // //             <div className="flex gap-2">
// // // // //               <button onClick={loadCandidatures} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1">
// // // // //                 <RefreshCw className="w-3.5 h-3.5" /> Actualiser
// // // // //               </button>
// // // // //               <Link href="/solicitation" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-md">
// // // // //                 <Search className="w-4 h-4" /> Voir les services
// // // // //               </Link>
// // // // //             </div>
// // // // //           </div>
          
// // // // //           {loadingCandidatures ? (
// // // // //             <div className="flex items-center justify-center py-16"><Loader /></div>
// // // // //           ) : candidatures.length === 0 ? (
// // // // //             <div className="flex flex-col items-center justify-center py-16 px-6">
// // // // //               <Send className="w-16 h-16 text-gray-300 mb-4" />
// // // // //               <p className="text-gray-500 text-lg font-medium mb-1">Aucune candidature</p>
// // // // //               <p className="text-gray-400 text-sm mb-6">Vous n'avez pas encore postulé à des services</p>
// // // // //               <Link href="/solicitation" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 font-medium text-sm shadow-md">
// // // // //                 <Search className="w-4 h-4" /> Découvrir les services
// // // // //               </Link>
// // // // //             </div>
// // // // //           ) : (
// // // // //             <div className="divide-y divide-gray-100">
// // // // //               {candidatures.map((candidature) => (
// // // // //                 <div key={candidature.id} className="p-4 hover:bg-gray-50/50 transition-colors">
// // // // //                   <div className="flex items-start gap-4">
// // // // //                     <div className="flex-shrink-0">
// // // // //                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getCandidatureStatutColor(candidature.statut)}`}>
// // // // //                         <Send className="w-5 h-5" />
// // // // //                       </div>
// // // // //                     </div>
                    
// // // // //                     <div className="flex-1 min-w-0">
// // // // //                       <div className="flex items-center gap-2 mb-1">
// // // // //                         <p className="font-medium text-gray-900">
// // // // //                           {candidature.service_parent?.titre || `Service #${candidature.service_parent_id}`}
// // // // //                         </p>
// // // // //                         <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getCandidatureStatutColor(candidature.statut)}`}>
// // // // //                           {candidature.statut === 'en_attente' && <><Clock className="w-3 h-3" /> En attente</>}
// // // // //                           {candidature.statut === 'accepte' && <><Check className="w-3 h-3" /> Acceptée</>}
// // // // //                           {candidature.statut === 'refuse' && <><X className="w-3 h-3" /> Refusée</>}
// // // // //                         </span>
// // // // //                       </div>
                      
// // // // //                       <p className="text-sm text-gray-600 line-clamp-2 mb-2">{candidature.message}</p>
                      
// // // // //                       <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
// // // // //                         {candidature.tarif_propose && (
// // // // //                           <span className="flex items-center gap-1 text-green-600 font-medium">
// // // // //                             <DollarSign className="w-3 h-3" /> {candidature.tarif_propose.toLocaleString()} FC/h
// // // // //                           </span>
// // // // //                         )}
// // // // //                         {candidature.disponibilites && (
// // // // //                           <span className="flex items-center gap-1">
// // // // //                             <Calendar className="w-3 h-3" /> {candidature.disponibilites}
// // // // //                           </span>
// // // // //                         )}
// // // // //                         <span>📆 {formatDate(candidature.created_at)}</span>
// // // // //                       </div>
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 </div>
// // // // //               ))}
// // // // //             </div>
// // // // //           )}
// // // // //         </div>
// // // // //       )}

// // // // //       {/* ========== ONGLET DOCUMENTS ========== */}
// // // // //       {activeTab === 'documents' && (
// // // // //         <div className="bg-white rounded-2xl p-6">
// // // // //           <ListeDocuments refresh={refreshDocs} onRefresh={() => setRefreshDocs(prev => prev + 1)} />
// // // // //         </div>
// // // // //       )}

// // // // //       {/* ========== MODAL NÉGOCIATION EN TEMPS RÉEL ========== */}
// // // // //       {showNegotiationModal && selectedContratForNegotiation && (
// // // // //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
// // // // //           <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
// // // // //             {/* En-tête avec indicateur de temps réel */}
// // // // //             <div className="p-6 border-b flex justify-between items-center">
// // // // //               <div>
// // // // //                 <h2 className="text-xl font-semibold flex items-center gap-2">
// // // // //                   <MessageSquare className="w-5 h-5 text-blue-600" />
// // // // //                   Négociation en direct
// // // // //                 </h2>
// // // // //                 <div className="flex items-center gap-2 mt-1">
// // // // //                   <span className="relative flex h-2 w-2">
// // // // //                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
// // // // //                     <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
// // // // //                   </span>
// // // // //                   <span className="text-xs text-green-600 font-medium">Temps réel actif</span>
// // // // //                 </div>
// // // // //               </div>
// // // // //               <button onClick={closeNegotiation} className="text-gray-400 hover:text-gray-600">
// // // // //                 <X className="w-5 h-5" />
// // // // //               </button>
// // // // //             </div>
            
// // // // //             {/* Messages */}
// // // // //             <div className="flex-1 overflow-y-auto p-6 space-y-4">
// // // // //               <div className="bg-blue-50 rounded-xl p-4 mb-4">
// // // // //                 <p className="text-sm font-medium text-blue-900">
// // // // //                   {selectedContratForNegotiation.titre}
// // // // //                 </p>
// // // // //                 <p className="text-xs text-blue-700 mt-1">
// // // // //                   Tarif actuel : {selectedContratForNegotiation.tarif_final?.toLocaleString()} FC/h • 
// // // // //                   Statut : {selectedContratForNegotiation.statut.replace('_', ' ')}
// // // // //                 </p>
// // // // //               </div>

// // // // //               {negotiationMessages.length === 0 ? (
// // // // //                 <div className="text-center py-8 text-gray-400">
// // // // //                   <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
// // // // //                   <p className="text-sm">Aucun message. Commencez la négociation.</p>
// // // // //                 </div>
// // // // //               ) : (
// // // // //                 negotiationMessages.map((msg, index) => (
// // // // //                   <div key={msg.id || index} className={`flex ${msg.sender === 'precepteur' ? 'justify-end' : 'justify-start'}`}>
// // // // //                     <div className={`max-w-[80%] p-3 rounded-xl ${
// // // // //                       msg.sender === 'precepteur' 
// // // // //                         ? 'bg-blue-600 text-white rounded-br-none' 
// // // // //                         : 'bg-gray-100 text-gray-900 rounded-bl-none'
// // // // //                     }`}>
// // // // //                       <p className="text-sm">{msg.message}</p>
// // // // //                       {msg.tarif_propose && (
// // // // //                         <p className="text-xs mt-1 opacity-75">
// // // // //                           💰 Proposition : {msg.tarif_propose.toLocaleString()} FC/h
// // // // //                         </p>
// // // // //                       )}
// // // // //                       <p className="text-xs mt-1 opacity-50">
// // // // //                         {formatDateTime(msg.created_at)}
// // // // //                       </p>
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 ))
// // // // //               )}
// // // // //               <div ref={messagesEndRef} />
// // // // //             </div>

// // // // //             {/* Formulaire */}
// // // // //             <form onSubmit={sendNegotiationMessage} className="p-4 border-t bg-gray-50">
// // // // //               <div className="flex gap-2">
// // // // //                 <div className="flex-1 space-y-2">
// // // // //                   <input
// // // // //                     type="text"
// // // // //                     value={negotiationForm.message}
// // // // //                     onChange={(e) => setNegotiationForm({...negotiationForm, message: e.target.value})}
// // // // //                     placeholder="Votre message..."
// // // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
// // // // //                     required
// // // // //                   />
// // // // //                   <div className="flex items-center gap-2">
// // // // //                     <label className="text-xs text-gray-500">Contre-proposition (FC/h) :</label>
// // // // //                     <input
// // // // //                       type="number"
// // // // //                       value={negotiationForm.tarif_propose}
// // // // //                       onChange={(e) => setNegotiationForm({...negotiationForm, tarif_propose: Number(e.target.value)})}
// // // // //                       className="w-32 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
// // // // //                       min="0"
// // // // //                       step="1000"
// // // // //                     />
// // // // //                   </div>
// // // // //                 </div>
// // // // //                 <button
// // // // //                   type="submit"
// // // // //                   disabled={sendingNegotiation}
// // // // //                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 self-end"
// // // // //                 >
// // // // //                   {sendingNegotiation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
// // // // //                 </button>
// // // // //               </div>
// // // // //             </form>
// // // // //           </div>
// // // // //         </div>
// // // // //       )}

// // // // //       {/* ========== MODAL PROFIL ========== */}
// // // // //       {showModal && (
// // // // //         <ProfilModal
// // // // //           isOpen={showModal}
// // // // //           onClose={() => setShowModal(false)}
// // // // //           onSave={handleSave}
// // // // //           initialData={form}
// // // // //           selectedMatieres={selectedMatieres}
// // // // //           onMatieresChange={setSelectedMatieres}
// // // // //           saving={saving}
// // // // //         />
// // // // //       )}
// // // // //     </div>
// // // // //   )
// // // // // }

// // // // // app/dashboard/precepteur/page.tsx
// // // // 'use client'
// // // // import { useRouter } from 'next/navigation'
// // // // import UploadDocument from '@/components/UploadDocument'
// // // // import ServiceManager from '@/components/ServiceManager'
// // // // import ListeDocuments from '@/components/ListeDocuments'
// // // // import ProfilModal from '@/components/ProfilModal'
// // // // import { useAuth } from '@/context/AuthContext'
// // // // import CreateSessionModal from './CreateSessionModal'
// // // // import SessionDetailModal from './SessionDetailModal'
// // // // import { updateProfilePhoto, updatePrecepteurDisponibility } from '@/actions/auth'
// // // // import { updatePrecepteurProfil, getPrecepteurMatieres, getContrats, updateContratStatus, updateSessionStatus, updateSessionNotes } from '@/actions/precepteur'
// // // // import { getSessions, getSessionsByContract } from '@/lib/session-api'
// // // // import { useState, useEffect, useCallback, useRef } from 'react'
// // // // import Link from 'next/link'
// // // // import { 
// // // //   User, MapPin, Star, Clock, BookOpen, GraduationCap, Calendar, 
// // // //   Edit3, Check, X, Upload, Plus, Trash2, Eye, AlertCircle, 
// // // //   ChevronDown, Filter, Play, StopCircle, Ban, RotateCcw, FileText, 
// // // //   Users, Tag, Phone, Mail, Building, CreditCard,Search, Hash, MessageSquare, 
// // // //   Activity, RefreshCw, Send, Loader2, DollarSign, Video
// // // // } from 'lucide-react'
// // // // import { PiBookOpen, PiPlus, PiTrash } from 'react-icons/pi'
// // // // import Loader from '@/components/Loader'
// // // // import { CheckBadgeIcon } from '@heroicons/react/24/solid'

// // // // // Types
// // // // type Contrat = {
// // // //   id: string
// // // //   service_parent_id: string
// // // //   parent_id: string
// // // //   precepteur_id: number
// // // //   titre: string
// // // //   matiere: string | null
// // // //   niveau: string
// // // //   frequence: string
// // // //   lieu: string
// // // //   date_debut: string
// // // //   duree: string
// // // //   tarif_final: number
// // // //   notes: string | null
// // // //   statut: 'en_attente' | 'accepte' | 'refuse' | 'actif' | 'termine' | 'annule'
// // // //   created_at: string
// // // //   updated_at: string
// // // //   parent?: {
// // // //     id: string
// // // //     user_id: string
// // // //     telephone?: string | null
// // // //     adresse?: string | null
// // // //     user?: {
// // // //       id: string
// // // //       username: string
// // // //       email: string
// // // //       photo_profil: string | null
// // // //       telephone: string | null
// // // //     }
// // // //   } | null
// // // //   eleve?: {
// // // //     id: number
// // // //     nom: string
// // // //     prenom: string
// // // //     postnom?: string | null
// // // //     niveau: string
// // // //     ecole?: string | null
// // // //     genre: string
// // // //     date_naissance?: string | null
// // // //   } | null
// // // //   matiere_obj?: {
// // // //     id: number
// // // //     nom: string
// // // //     niveau: string
// // // //     description?: string | null
// // // //   } | null
// // // //   service_parent?: {
// // // //     id: string
// // // //     titre: string
// // // //     description: string
// // // //     eleve?: {
// // // //       nom: string
// // // //       prenom: string
// // // //       niveau: string
// // // //     }
// // // //   } | null
// // // //   sessions?: Session[] | null
// // // // }

// // // // type Session = {
// // // //   id: number
// // // //   contract_id: number
// // // //   date_session: string
// // // //   heure_debut: string
// // // //   heure_fin: string
// // // //   duree_minutes: number
// // // //   statut: 'planifie' | 'en_cours' | 'termine' | 'annule' | 'reporte'
// // // //   type_session: 'presentiel' | 'en_ligne' | 'hybride'
// // // //   lieu: string | null
// // // //   lien_visio: string | null
// // // //   notes_precepteur: string | null
// // // //   notes_parent: string | null
// // // //   feedback_precepteur: string | null
// // // //   feedback_parent: string | null
// // // //   note_session: number | null
// // // //   raison_annulation: string | null
// // // //   annule_par: string | null
// // // //   created_at: string
// // // //   updated_at?: string
// // // //   contrat?: {
// // // //     id: number
// // // //     titre: string
// // // //     matiere: string | null
// // // //     niveau: string
// // // //     frequence: string
// // // //     tarif_final: number
// // // //     statut: string
// // // //   } | null
// // // //   eleve?: {
// // // //     id: number
// // // //     nom: string
// // // //     prenom: string
// // // //     niveau: string
// // // //   } | null
// // // //   matiere?: {
// // // //     id: number
// // // //     nom: string
// // // //     niveau: string
// // // //   } | null
// // // //   parent?: {
// // // //     id: number
// // // //     telephone: string | null
// // // //     adresse: string | null
// // // //     user?: {
// // // //       username: string
// // // //       email: string
// // // //       photo_profil: string | null
// // // //       telephone: string | null
// // // //     }
// // // //   } | null
// // // //   files?: any[]
// // // //   grades?: any[]
// // // //   files_count?: number
// // // //   grades_count?: number
// // // // }

// // // // type NegotiationMessage = {
// // // //   id: string
// // // //   contract_id: string
// // // //   sender_id: string
// // // //   sender: 'parent' | 'precepteur'
// // // //   message: string
// // // //   tarif_propose: number | null
// // // //   created_at: string
// // // // }

// // // // type Candidature = {
// // // //   id: string
// // // //   service_parent_id: string
// // // //   precepteur_id: number
// // // //   message: string
// // // //   tarif_propose: number | null
// // // //   disponibilites: string | null
// // // //   statut: 'en_attente' | 'accepte' | 'refuse'
// // // //   created_at: string
// // // //   service_parent?: {
// // // //     id: string
// // // //     titre: string
// // // //     description: string
// // // //     matiere_preferee: string | null
// // // //     niveau_eleve: string
// // // //     budget_horaire: number | null
// // // //     lieu_preference: string
// // // //     parent?: {
// // // //       user?: {
// // // //         username: string
// // // //       }
// // // //     }
// // // //   }
// // // // }

// // // // interface ProfilForm {
// // // //   latitude: string
// // // //   longitude: string
// // // //   commune: string
// // // //   quartier: string
// // // //   annees_experience: number
// // // //   diplome: string
// // // //   etablissement_origine: string
// // // //   telephone: string
// // // // }

// // // // const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
// // // // const POLLING_INTERVAL = 3000 // 3 secondes pour le polling en temps réel

// // // // export default function PrecepteurDashboard() {
// // // //   const router = useRouter()
// // // //   const { user, precepteurInfo, refreshPrecepteurInfo, updateUser } = useAuth()
  
// // // //   // États principaux
// // // //   const [uploading, setUploading] = useState(false)
// // // //   const [saving, setSaving] = useState(false)
// // // //   const [message, setMessage] = useState('')
// // // //   const [loading, setLoading] = useState(true)
// // // //   const [activeTab, setActiveTab] = useState('profil')
// // // //   const [showModal, setShowModal] = useState(false)
// // // //   const [refreshDocs, setRefreshDocs] = useState(0)
  
// // // //   // États contrats
// // // //   const [contrats, setContrats] = useState<Contrat[]>([])
// // // //   const [loadingContrats, setLoadingContrats] = useState(false)
  
// // // //   // États sessions
// // // //   const [sessions, setSessions] = useState<Session[]>([])
// // // //   const [loadingSessions, setLoadingSessions] = useState(false)
// // // //   const [selectedSession, setSelectedSession] = useState<Session | null>(null)
// // // //   const [showSessionModal, setShowSessionModal] = useState(false)
// // // //   const [selectedContractForSession, setSelectedContractForSession] = useState<Contrat | null>(null)
// // // //   const [showCreateSessionModal, setShowCreateSessionModal] = useState(false)
  
// // // //   // États négociation
// // // //   const [showNegotiationModal, setShowNegotiationModal] = useState(false)
// // // //   const [selectedContratForNegotiation, setSelectedContratForNegotiation] = useState<Contrat | null>(null)
// // // //   const [negotiationForm, setNegotiationForm] = useState({
// // // //     message: '',
// // // //     tarif_propose: 0
// // // //   })
// // // //   const [negotiationMessages, setNegotiationMessages] = useState<NegotiationMessage[]>([])
// // // //   const [sendingNegotiation, setSendingNegotiation] = useState(false)
  
// // // //   // États matières
// // // //   const [matieres, setMatieres] = useState<any[]>([])
// // // //   const [selectedMatieres, setSelectedMatieres] = useState<number[]>([])
  
// // // //   // États candidatures
// // // //   const [candidatures, setCandidatures] = useState<Candidature[]>([])
// // // //   const [loadingCandidatures, setLoadingCandidatures] = useState(false)
  
// // // //   // États formulaire profil
// // // //   const [form, setForm] = useState<ProfilForm>({
// // // //     latitude: '',
// // // //     longitude: '',
// // // //     commune: '',
// // // //     quartier: '',
// // // //     annees_experience: 0,
// // // //     diplome: '',
// // // //     etablissement_origine: '',
// // // //     telephone: ''
// // // //   })
  
// // // //   const [disponible, setDisponible] = useState(precepteurInfo?.disponible ?? true)

// // // //   // Refs pour le polling
// // // //   const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
// // // //   const messagesEndRef = useRef<HTMLDivElement>(null)

// // // //   // ============ INITIALISATION ============
// // // //   useEffect(() => {
// // // //     let isMounted = true

// // // //     const initializeData = async () => {
// // // //       if (!user) {
// // // //         setLoading(false)
// // // //         return
// // // //       }

// // // //       if (!precepteurInfo) {
// // // //         await refreshPrecepteurInfo()
// // // //       }

// // // //       if (!isMounted) return

// // // //       if (precepteurInfo) {
// // // //         setForm({
// // // //           latitude: precepteurInfo.latitude?.toString() || '',
// // // //           longitude: precepteurInfo.longitude?.toString() || '',
// // // //           commune: precepteurInfo.commune || '',
// // // //           quartier: precepteurInfo.quartier || '',
// // // //           annees_experience: precepteurInfo.annees_experience || 0,
// // // //           diplome: precepteurInfo.diplome || '',
// // // //           telephone: precepteurInfo.telephone || '',
// // // //           etablissement_origine: precepteurInfo.etablissement_origine || ''
// // // //         })
// // // //         setDisponible(precepteurInfo.disponible ?? true)
        
// // // //         if (precepteurInfo.precepteur_matieres) {
// // // //           setSelectedMatieres(precepteurInfo.precepteur_matieres.map((pm: any) => pm.matiere_id))
// // // //         }
        
// // // //         await Promise.all([loadContrats(), loadMatieres(), loadCandidatures(), loadSessions()])
// // // //       }

// // // //       if (isMounted) {
// // // //         setLoading(false)
// // // //       }
// // // //     }

// // // //     initializeData()

// // // //     return () => {
// // // //       isMounted = false
// // // //     }
// // // //   }, [user?.id, precepteurInfo?.id])

// // // //   // Nettoyer le polling quand le composant est démonté
// // // //   useEffect(() => {
// // // //     return () => {
// // // //       if (pollingIntervalRef.current) {
// // // //         clearInterval(pollingIntervalRef.current)
// // // //       }
// // // //     }
// // // //   }, [])

// // // //   // Scroll automatique vers le bas quand de nouveaux messages arrivent
// // // //   useEffect(() => {
// // // //     if (messagesEndRef.current) {
// // // //       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
// // // //     }
// // // //   }, [negotiationMessages])

// // // //   // ============ CHARGEMENT SESSIONS ============
// // // //   const loadSessions = useCallback(async () => {
// // // //     setLoadingSessions(true)
// // // //     try {
// // // //       const data = await getSessions()
// // // //       setSessions(data.sessions || [])
// // // //     } catch (error) {
// // // //       console.error('❌ Erreur chargement sessions:', error)
// // // //     } finally {
// // // //       setLoadingSessions(false)
// // // //     }
// // // //   }, [])

// // // //   // ============ CHARGEMENT NÉGOCIATIONS ============
// // // //   const loadNegotiationMessages = async (contratId: string) => {
// // // //     try {
// // // //       const token = localStorage.getItem('excellence-token')
// // // //       if (!token) return

// // // //       const response = await fetch(`${API_URL}/auth/contracts/${contratId}/negotiations`, {
// // // //         headers: {
// // // //           'Authorization': `Bearer ${token}`,
// // // //           'Content-Type': 'application/json'
// // // //         }
// // // //       })

// // // //       if (response.ok) {
// // // //         const data = await response.json()
// // // //         setNegotiationMessages(data.messages || [])
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('❌ Erreur chargement négociations:', error)
// // // //     }
// // // //   }

// // // //   const startNegotiationPolling = (contratId: string) => {
// // // //     if (pollingIntervalRef.current) {
// // // //       clearInterval(pollingIntervalRef.current)
// // // //     }
// // // //     loadNegotiationMessages(contratId)
// // // //     pollingIntervalRef.current = setInterval(() => {
// // // //       loadNegotiationMessages(contratId)
// // // //     }, POLLING_INTERVAL)
// // // //   }

// // // //   const stopNegotiationPolling = () => {
// // // //     if (pollingIntervalRef.current) {
// // // //       clearInterval(pollingIntervalRef.current)
// // // //       pollingIntervalRef.current = null
// // // //     }
// // // //   }

// // // //   // ============ CHARGEMENT CONTRATS ============
// // // //   const loadContrats = useCallback(async () => {
// // // //     if (!precepteurInfo) return
    
// // // //     setLoadingContrats(true)
// // // //     try {
// // // //       const token = localStorage.getItem('excellence-token')
// // // //       if (!token) return

// // // //       const response = await fetch(`${API_URL}/auth/contracts`, {
// // // //         headers: {
// // // //           'Authorization': `Bearer ${token}`,
// // // //           'Content-Type': 'application/json'
// // // //         }
// // // //       })

// // // //       const data = await response.json()
// // // //       if (data.success) {
// // // //         setContrats(data.contrats || [])
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('❌ Erreur chargement contrats:', error)
// // // //     } finally {
// // // //       setLoadingContrats(false)
// // // //     }
// // // //   }, [precepteurInfo])

// // // //   // ============ CHARGEMENT MATIÈRES ============
// // // //   const loadMatieres = async () => {
// // // //     try {
// // // //       const result = await getPrecepteurMatieres()
// // // //       if (result.success) {
// // // //         setMatieres(result.matieres || [])
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('❌ Erreur chargement matières:', error)
// // // //     }
// // // //   }

// // // //   // ============ CHARGEMENT CANDIDATURES ============
// // // //   const loadCandidatures = async () => {
// // // //     if (!precepteurInfo) return
    
// // // //     setLoadingCandidatures(true)
// // // //     try {
// // // //       const token = localStorage.getItem('excellence-token')
// // // //       if (!token) return
      
// // // //       const response = await fetch(`${API_URL}/auth/candidatures/mes-candidatures`, {
// // // //         headers: {
// // // //           'Authorization': `Bearer ${token}`,
// // // //           'Content-Type': 'application/json'
// // // //         }
// // // //       })
      
// // // //       if (response.ok) {
// // // //         const data = await response.json()
// // // //         if (data.success) {
// // // //           setCandidatures(data.candidatures || [])
// // // //         }
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('❌ Erreur chargement candidatures:', error)
// // // //     } finally {
// // // //       setLoadingCandidatures(false)
// // // //     }
// // // //   }

// // // //   // ============ GESTION SESSIONS ============
// // // //   const handleSessionStatusChange = async (sessionId: number, newStatus: string) => {
// // // //     try {
// // // //       await updateSessionStatus(sessionId, newStatus)
// // // //       setMessage(`✅ Session ${newStatus.replace('_', ' ')} avec succès`)
// // // //       await loadSessions()
// // // //       setTimeout(() => setMessage(''), 3000)
// // // //     } catch (error) {
// // // //       console.error('❌ Erreur changement statut session:', error)
// // // //       setMessage('Erreur lors du changement de statut')
// // // //     }
// // // //   }

// // // //   const handleNotesUpdate = async (sessionId: number, notes: string) => {
// // // //     try {
// // // //       await updateSessionNotes(sessionId, notes)
// // // //       setMessage('✅ Notes sauvegardées avec succès')
// // // //       await loadSessions()
// // // //       setTimeout(() => setMessage(''), 3000)
// // // //     } catch (error) {
// // // //       console.error('❌ Erreur sauvegarde notes:', error)
// // // //       setMessage('Erreur lors de la sauvegarde des notes')
// // // //     }
// // // //   }

// // // //   const openSessionDetail = (session: Session) => {
// // // //     setSelectedSession(session)
// // // //     setShowSessionModal(true)
// // // //   }

// // // //   const openCreateSession = (contrat: Contrat) => {
// // // //     setSelectedContractForSession(contrat)
// // // //     setShowCreateSessionModal(true)
// // // //   }

// // // //   // ============ GESTION CONTRATS ============
// // // //   const handleContractStatusChange = async (contratId: string, newStatus: string) => {
// // // //     try {
// // // //       const token = localStorage.getItem('excellence-token')
// // // //       if (!token) return

// // // //       const response = await fetch(`${API_URL}/auth/contracts/${contratId}/status`, {
// // // //         method: 'PATCH',
// // // //         headers: {
// // // //           'Content-Type': 'application/json',
// // // //           'Authorization': `Bearer ${token}`
// // // //         },
// // // //         body: JSON.stringify({ statut: newStatus })
// // // //       })

// // // //       if (response.ok) {
// // // //         setMessage(`✅ Contrat ${newStatus.replace('_', ' ')} avec succès`)
// // // //         setTimeout(() => setMessage(''), 3000)
// // // //         loadContrats()
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('❌ Erreur changement statut contrat:', error)
// // // //     }
// // // //   }

// // // //   // ============ GESTION NÉGOCIATION ============
// // // //   const openNegotiation = async (contrat: Contrat) => {
// // // //     setSelectedContratForNegotiation(contrat)
// // // //     setNegotiationForm({
// // // //       message: '',
// // // //       tarif_propose: contrat.tarif_final
// // // //     })
// // // //     startNegotiationPolling(contrat.id)
// // // //     setShowNegotiationModal(true)
// // // //   }

// // // //   const closeNegotiation = () => {
// // // //     stopNegotiationPolling()
// // // //     setShowNegotiationModal(false)
// // // //     setSelectedContratForNegotiation(null)
// // // //   }

// // // //   const sendNegotiationMessage = async (e: React.FormEvent) => {
// // // //     e.preventDefault()
// // // //     setSendingNegotiation(true)

// // // //     try {
// // // //       const token = localStorage.getItem('excellence-token')
// // // //       if (!token) throw new Error('Non connecté')

// // // //       const response = await fetch(`${API_URL}/auth/contracts/${selectedContratForNegotiation?.id}/negotiations`, {
// // // //         method: 'POST',
// // // //         headers: {
// // // //           'Content-Type': 'application/json',
// // // //           'Authorization': `Bearer ${token}`
// // // //         },
// // // //         body: JSON.stringify({
// // // //           message: negotiationForm.message,
// // // //           tarif_propose: negotiationForm.tarif_propose
// // // //         })
// // // //       })

// // // //       if (response.ok) {
// // // //         if (selectedContratForNegotiation) {
// // // //           await loadNegotiationMessages(selectedContratForNegotiation.id)
// // // //         }
// // // //         setNegotiationForm({ ...negotiationForm, message: '' })
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('❌ Erreur envoi message:', error)
// // // //     } finally {
// // // //       setSendingNegotiation(false)
// // // //     }
// // // //   }

// // // //   // ============ GESTION PROFIL ============
// // // //   const handleSave = async (data: ProfilForm & { matieres: number[] }) => {
// // // //     setSaving(true)
// // // //     setMessage('')
    
// // // //     try {
// // // //       const result = await updatePrecepteurProfil({
// // // //         latitude: data.latitude || undefined,
// // // //         longitude: data.longitude || undefined,
// // // //         commune: data.commune || undefined,
// // // //         quartier: data.quartier || undefined,
// // // //         annees_experience: data.annees_experience || 0,
// // // //         diplome: data.diplome || undefined,
// // // //         etablissement_origine: data.etablissement_origine || undefined,
// // // //         telephone: data.telephone || undefined,
// // // //         matieres: data.matieres
// // // //       })
      
// // // //       if (result.success) {
// // // //         setShowModal(false)
// // // //         setMessage('✅ Profil mis à jour avec succès !')
// // // //         await refreshPrecepteurInfo()
// // // //       } else {
// // // //         setMessage(result.error || 'Erreur lors de la mise à jour')
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('❌ Erreur sauvegarde:', error)
// // // //       setMessage('Erreur lors de la mise à jour du profil')
// // // //     } finally {
// // // //       setSaving(false)
// // // //       setTimeout(() => setMessage(''), 3000)
// // // //     }
// // // //   }

// // // //   const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
// // // //     const file = e.target.files?.[0]
// // // //     if (!file) return
    
// // // //     if (file.size > 5 * 1024 * 1024) {
// // // //       setMessage('Image trop volumineuse. Maximum 5MB.')
// // // //       setTimeout(() => setMessage(''), 3000)
// // // //       return
// // // //     }
    
// // // //     setUploading(true)
    
// // // //     try {
// // // //       const result = await updateProfilePhoto(file)
      
// // // //       if (result.success && result.photoUrl) {
// // // //         updateUser({ photo_profil: result.photoUrl })
// // // //         setMessage('Photo mise à jour avec succès')
// // // //       } else {
// // // //         setMessage(result.error || 'Erreur lors de la mise à jour')
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('❌ Erreur upload photo:', error)
// // // //       setMessage('Erreur lors de l\'upload de la photo')
// // // //     } finally {
// // // //       setUploading(false)
// // // //       setTimeout(() => setMessage(''), 3000)
// // // //     }
// // // //   }

// // // //   const toggleDisponible = async () => {
// // // //     const newDisponible = !disponible
// // // //     setDisponible(newDisponible)
    
// // // //     try {
// // // //       const result = await updatePrecepteurDisponibility(newDisponible)
// // // //       if (result.success) {
// // // //         await refreshPrecepteurInfo()
// // // //       } else {
// // // //         setDisponible(!newDisponible)
// // // //         setMessage(result.error || 'Erreur lors de la mise à jour')
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('Erreur toggleDisponible:', error)
// // // //       setDisponible(!newDisponible)
// // // //       setMessage('Erreur lors de la mise à jour')
// // // //     }
// // // //   }

// // // //   const handleMatiereToggle = (matiereId: number) => {
// // // //     setSelectedMatieres(prev => 
// // // //       prev.includes(matiereId)
// // // //         ? prev.filter(id => id !== matiereId)
// // // //         : [...prev, matiereId]
// // // //     )
// // // //   }

// // // //   const openModal = () => {
// // // //     if (precepteurInfo) {
// // // //       setForm({
// // // //         latitude: precepteurInfo.latitude?.toString() || '',
// // // //         longitude: precepteurInfo.longitude?.toString() || '',
// // // //         commune: precepteurInfo.commune || '',
// // // //         quartier: precepteurInfo.quartier || '',
// // // //         annees_experience: precepteurInfo.annees_experience || 0,
// // // //         diplome: precepteurInfo.diplome || '',
// // // //         telephone: precepteurInfo.telephone || '',
// // // //         etablissement_origine: precepteurInfo.etablissement_origine || ''
// // // //       })
// // // //     }
// // // //     setShowModal(true)
// // // //   }

// // // //   // ============ HELPERS UI ============
// // // //   const getContratStatutColor = (statut: string) => {
// // // //     switch (statut) {
// // // //       case 'en_attente': return 'bg-yellow-100 text-yellow-800'
// // // //       case 'accepte': return 'bg-blue-100 text-blue-800'
// // // //       case 'actif': return 'bg-green-100 text-green-800'
// // // //       case 'refuse': return 'bg-red-100 text-red-800'
// // // //       case 'termine': return 'bg-gray-100 text-gray-800'
// // // //       case 'annule': return 'bg-red-100 text-red-800'
// // // //       default: return 'bg-gray-100 text-gray-800'
// // // //     }
// // // //   }

// // // //   const getCandidatureStatutColor = (statut: string) => {
// // // //     switch (statut) {
// // // //       case 'en_attente': return 'bg-yellow-100 text-yellow-800'
// // // //       case 'accepte': return 'bg-green-100 text-green-800'
// // // //       case 'refuse': return 'bg-red-100 text-red-800'
// // // //       default: return 'bg-gray-100 text-gray-800'
// // // //     }
// // // //   }

// // // //   const getSessionStatutColor = (statut: string) => {
// // // //     switch (statut) {
// // // //       case 'planifie': return 'bg-blue-100 text-blue-800'
// // // //       case 'en_cours': return 'bg-yellow-100 text-yellow-800'
// // // //       case 'termine': return 'bg-green-100 text-green-800'
// // // //       case 'annule': return 'bg-red-100 text-red-800'
// // // //       case 'reporte': return 'bg-purple-100 text-purple-800'
// // // //       default: return 'bg-gray-100 text-gray-800'
// // // //     }
// // // //   }

// // // //   const getStatutIcon = (statut: string) => {
// // // //     switch (statut) {
// // // //       case 'planifie':
// // // //       case 'en_attente': return <Clock className="w-4 h-4" />
// // // //       case 'en_cours': return <Play className="w-4 h-4" />
// // // //       case 'termine':
// // // //       case 'accepte':
// // // //       case 'actif': return <Check className="w-4 h-4" />
// // // //       case 'refuse':
// // // //       case 'annule': return <X className="w-4 h-4" />
// // // //       default: return <AlertCircle className="w-4 h-4" />
// // // //     }
// // // //   }

// // // //   const getFrequenceLabel = (frequence: string) => {
// // // //     switch (frequence) {
// // // //       case 'unique': return 'Ponctuel'
// // // //       case 'hebdomadaire': return 'Hebdomadaire'
// // // //       case 'bi-hebdomadaire': return '2x/semaine'
// // // //       case 'mensuel': return 'Mensuel'
// // // //       default: return frequence
// // // //     }
// // // //   }

// // // //   const getDureeLabel = (duree: string) => {
// // // //     switch (duree) {
// // // //       case '1_mois': return '1 mois'
// // // //       case '3_mois': return '3 mois'
// // // //       case '6_mois': return '6 mois'
// // // //       case '12_mois': return '1 an'
// // // //       case 'indetermine': return 'Indéterminée'
// // // //       default: return duree
// // // //     }
// // // //   }

// // // //   const formatDate = (date: string) => {
// // // //     return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
// // // //   }

// // // //   const formatDateLong = (date: string) => {
// // // //     return new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
// // // //   }

// // // //   const formatDateTime = (date: string) => {
// // // //     return new Date(date).toLocaleString('fr-FR', { 
// // // //       day: 'numeric', 
// // // //       month: 'short', 
// // // //       hour: '2-digit', 
// // // //       minute: '2-digit' 
// // // //     })
// // // //   }

// // // //   const getPhotoUrl = (photoPath: string | null | undefined) => {
// // // //     if (!photoPath) return null
// // // //     if (photoPath.startsWith('http')) return photoPath
// // // //     const baseUrl = API_URL.replace('/api', '')
// // // //     return `${baseUrl}${photoPath}`
// // // //   }

// // // //   // ============ STATS ============
// // // //   const contratsActifs = contrats.filter(c => c.statut === 'actif' || c.statut === 'accepte').length
// // // //   const contratsEnAttente = contrats.filter(c => c.statut === 'en_attente').length
// // // //   const sessionsPlanifiees = sessions.filter(s => s.statut === 'planifie' || s.statut === 'en_cours').length
// // // //   const sessionsTerminees = sessions.filter(s => s.statut === 'termine').length

// // // //   // ============ LOADING ============
// // // //   if (loading) {
// // // //     return (
// // // //       <div className='flex items-center justify-center h-screen'>
// // // //         <div className='w-20'><Loader/></div>
// // // //       </div>
// // // //     )
// // // //   }

// // // //   if (!user) return null

// // // //   // ============ RENDU ============
// // // //   return (
// // // //     <div className="max-w-6xl mx-auto px-4 py-8">
// // // //       {/* Message de notification */}
// // // //       {message && (
// // // //         <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
// // // //           message.includes('Erreur') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
// // // //         }`}>
// // // //           {message.includes('Erreur') ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <Check className="w-4 h-4 flex-shrink-0" />}
// // // //           {message}
// // // //         </div>
// // // //       )}

// // // //       {/* Message profil incomplet */}
// // // //       {precepteurInfo && (
// // // //         !precepteurInfo.commune || 
// // // //         !precepteurInfo.quartier || 
// // // //         !precepteurInfo.diplome || 
// // // //         !precepteurInfo.etablissement_origine || 
// // // //         precepteurInfo.annees_experience === 0 || 
// // // //         precepteurInfo.statut_verification === 'en_attente' || 
// // // //         precepteurInfo.statut_verification === 'rejete'
// // // //       ) && (
// // // //         <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
// // // //           <div className="flex-shrink-0 mt-0.5">
// // // //             <AlertCircle className="w-5 h-5 text-amber-600" />
// // // //           </div>
// // // //           <div className="flex-1">
// // // //             <h3 className="text-sm font-semibold text-amber-800 mb-1">
// // // //               {precepteurInfo.statut_verification === 'rejete' 
// // // //                 ? 'Votre dossier a été rejeté' 
// // // //                 : precepteurInfo.statut_verification === 'en_attente'
// // // //                 ? 'Votre dossier est en attente de vérification'
// // // //                 : 'Profil incomplet'}
// // // //             </h3>
// // // //             <p className="text-sm text-amber-700">
// // // //               {precepteurInfo.statut_verification === 'rejete' 
// // // //                 ? 'Votre dossier a été rejeté. Veuillez mettre à jour vos informations.'
// // // //                 : 'Complétez votre profil pour apparaître dans les recherches.'}
// // // //             </p>
// // // //             <button
// // // //               onClick={openModal}
// // // //               className="mt-3 px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
// // // //             >
// // // //               <Edit3 className="w-4 h-4" />
// // // //               Modifier le profil
// // // //             </button>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {/* ========== CARD PROFIL ========== */}
// // // //       <div className="bg-white rounded-2xl mb-6 p-6">
// // // //         <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
// // // //           {/* Photo de profil */}
// // // //           <div className="relative group w-24 h-24 flex-shrink-0 mx-auto md:mx-0">
// // // //             {user.photo_profil ? (
// // // //               <img 
// // // //                 src={getPhotoUrl(user.photo_profil) || ''}
// // // //                 alt={`Photo de ${user.username}`}
// // // //                 className="w-24 h-24 rounded-full object-cover border-2 border-gray-100"
// // // //                 onError={(e) => {
// // // //                   e.currentTarget.style.display = 'none'
// // // //                   const placeholder = e.currentTarget.nextElementSibling as HTMLElement
// // // //                   if (placeholder) placeholder.style.display = 'flex'
// // // //                 }}
// // // //               />
// // // //             ) : null}
            
// // // //             <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-2 border-gray-100 ${user.photo_profil ? 'hidden' : 'flex'}`}>
// // // //               <User className="w-10 h-10 text-blue-400" />
// // // //             </div>
            
// // // //             <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
// // // //               {uploading ? (
// // // //                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
// // // //               ) : (
// // // //                 <Upload className="w-5 h-5 text-white" />
// // // //               )}
// // // //               <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
// // // //             </label>
// // // //           </div>

// // // //           <div className="flex-1 text-center md:text-left">
// // // //             <h1 className="text-2xl font-bold">
// // // //               {user.username}
// // // //               {precepteurInfo?.statut_verification === 'verifie' && (
// // // //                 <span className="inline-flex items-center gap-1 ml-2 text-blue-600">
// // // //                   <CheckBadgeIcon className="w-5 h-5" />
// // // //                   <span className="text-sm font-normal">Vérifié</span>
// // // //                 </span>
// // // //               )}
// // // //             </h1>
// // // //             <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2 mt-1">
// // // //               <GraduationCap className="w-4 h-4" />
// // // //               Précepteur
// // // //               {selectedMatieres.length > 0 && (
// // // //                 <span className="text-sm text-gray-500">
// // // //                   • {selectedMatieres.length} matière{selectedMatieres.length > 1 ? 's' : ''}
// // // //                 </span>
// // // //               )}
// // // //             </p>
// // // //             <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm text-gray-500">
// // // //               <MapPin className="w-4 h-4" />
// // // //               {precepteurInfo?.commune ? (
// // // //                 <span>{precepteurInfo.commune}{precepteurInfo.quartier ? `, ${precepteurInfo.quartier}` : ''}</span>
// // // //               ) : (
// // // //                 <span>Localisation non spécifiée</span>
// // // //               )}
// // // //             </div>
// // // //             <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
// // // //               <Star className="w-4 h-4 text-yellow-500" />
// // // //               <span className="text-sm font-medium">{precepteurInfo?.note_moyenne?.toFixed(1) || '0.0'}/5</span>
// // // //             </div>
// // // //           </div>

// // // //           <div className="flex flex-wrap gap-2 justify-center md:justify-start">
// // // //             <button
// // // //               onClick={toggleDisponible}
// // // //               className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 font-medium ${
// // // //                 disponible
// // // //                   ? 'bg-green-100 text-green-700 hover:bg-green-200'
// // // //                   : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
// // // //               }`}
// // // //             >
// // // //               {disponible ? <><Check className="w-4 h-4" /> Disponible</> : <><X className="w-4 h-4" /> Indisponible</>}
// // // //             </button>
// // // //             <Link href="/solicitation" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-md">
// // // //               <Search className="w-4 h-4" /> Services disponibles
// // // //             </Link>
// // // //           </div>
// // // //         </div>

// // // //         {/* Stats */}
// // // //         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
// // // //           <div className="p-4 bg-blue-50 rounded-xl">
// // // //             <p className="text-2xl font-bold text-blue-600">{selectedMatieres.length}</p>
// // // //             <p className="text-sm text-gray-600 flex items-center gap-1"><BookOpen className="w-3 h-3" /> Matières</p>
// // // //           </div>
// // // //           <div className="p-4 bg-green-50 rounded-xl">
// // // //             <p className="text-2xl font-bold text-green-600">{contrats.length}</p>
// // // //             <p className="text-sm text-gray-600 flex items-center gap-1"><FileText className="w-3 h-3" /> Contrats</p>
// // // //           </div>
// // // //           <div className="p-4 bg-purple-50 rounded-xl">
// // // //             <p className="text-2xl font-bold text-purple-600">{contratsActifs}</p>
// // // //             <p className="text-sm text-gray-600 flex items-center gap-1"><Check className="w-3 h-3" /> Actifs</p>
// // // //           </div>
// // // //           <div className="p-4 bg-cyan-50 rounded-xl">
// // // //             <p className="text-2xl font-bold text-cyan-600">{sessions.length}</p>
// // // //             <p className="text-sm text-gray-600 flex items-center gap-1"><Calendar className="w-3 h-3" /> Sessions</p>
// // // //           </div>
// // // //           <div className="p-4 bg-teal-50 rounded-xl">
// // // //             <p className="text-2xl font-bold text-teal-600">{candidatures.length}</p>
// // // //             <p className="text-sm text-gray-600 flex items-center gap-1"><Send className="w-3 h-3" /> Candidatures</p>
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       {/* ========== TABS ========== */}
// // // //       <div className="flex gap-4 mb-6 overflow-x-auto flex-wrap">
// // // //         <button onClick={() => setActiveTab('profil')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'profil' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
// // // //           <User className="w-4 h-4" /> Profil
// // // //         </button>
// // // //         <button onClick={() => setActiveTab('matieres')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'matieres' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
// // // //           <BookOpen className="w-4 h-4" /> Matières ({selectedMatieres.length})
// // // //         </button>
// // // //         <button onClick={() => setActiveTab('contrats')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'contrats' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
// // // //           <FileText className="w-4 h-4" /> Contrats ({contrats.length})
// // // //         </button>
// // // //         <button onClick={() => setActiveTab('sessions')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'sessions' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
// // // //           <Calendar className="w-4 h-4" /> Sessions ({sessions.length})
// // // //         </button>
// // // //         <button onClick={() => setActiveTab('candidatures')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'candidatures' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
// // // //           <Send className="w-4 h-4" /> Candidatures ({candidatures.length})
// // // //         </button>
// // // //         <button onClick={() => setActiveTab('documents')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'documents' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
// // // //           <FileText className="w-4 h-4" /> Documents
// // // //         </button>
// // // //       </div>

// // // //       {/* ========== ONGLET PROFIL ========== */}
// // // //       {activeTab === 'profil' && (
// // // //         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
// // // //           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
// // // //             <div>
// // // //               <h3 className="font-semibold text-gray-900 flex items-center gap-2"><User className="w-5 h-5 text-gray-700" />Informations du précepteur</h3>
// // // //               <p className="text-sm text-gray-500 mt-0.5">Profil professionnel</p>
// // // //             </div>
// // // //             <button onClick={openModal} className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium">
// // // //               <Edit3 className="w-4 h-4" /> Modifier le profil
// // // //             </button>
// // // //           </div>
// // // //           <div className="p-6">
// // // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // // //               <div>
// // // //                 <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Commune</p>
// // // //                 <p className="font-medium text-gray-900">{precepteurInfo?.commune || 'Non spécifié'}</p>
// // // //               </div>
// // // //               <div>
// // // //                 <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Quartier</p>
// // // //                 <p className="font-medium text-gray-900">{precepteurInfo?.quartier || 'Non spécifié'}</p>
// // // //               </div>
// // // //               <div>
// // // //                 <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Téléphone</p>
// // // //                 <p className="font-medium text-gray-900">{precepteurInfo?.telephone || 'Non spécifié'}</p>
// // // //               </div>
// // // //               <div>
// // // //                 <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Années d'expérience</p>
// // // //                 <p className="font-medium text-gray-900">{precepteurInfo?.annees_experience || 0} an(s)</p>
// // // //               </div>
// // // //               <div>
// // // //                 <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><GraduationCap className="w-3 h-3" /> Diplôme</p>
// // // //                 <p className="font-medium text-gray-900">{precepteurInfo?.diplome || 'Non spécifié'}</p>
// // // //               </div>
// // // //               <div>
// // // //                 <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Building className="w-3 h-3" /> Établissement d'origine</p>
// // // //                 <p className="font-medium text-gray-900">{precepteurInfo?.etablissement_origine || 'Non spécifié'}</p>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {/* ========== ONGLET MATIÈRES ========== */}
// // // //       {activeTab === 'matieres' && (
// // // //         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
// // // //           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
// // // //             <div>
// // // //               <h3 className="font-semibold text-gray-900 flex items-center gap-2"><BookOpen className="w-5 h-5 text-gray-700" />Mes matières</h3>
// // // //               <p className="text-sm text-gray-500 mt-0.5">{selectedMatieres.length} matière{selectedMatieres.length > 1 ? 's' : ''}</p>
// // // //             </div>
// // // //             <button onClick={openModal} className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium">
// // // //               <Plus className="w-4 h-4" /> Gérer les matières
// // // //             </button>
// // // //           </div>
// // // //           {selectedMatieres.length === 0 ? (
// // // //             <div className="flex flex-col items-center justify-center py-16 px-6">
// // // //               <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
// // // //               <p className="text-gray-500 text-lg font-medium mb-1">Aucune matière sélectionnée</p>
// // // //               <p className="text-gray-400 text-sm mb-6">Ajoutez les matières que vous enseignez</p>
// // // //               <button onClick={openModal} className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium text-sm">
// // // //                 <Plus className="w-4 h-4" /> Ajouter des matières
// // // //               </button>
// // // //             </div>
// // // //           ) : (
// // // //             <div className="divide-y divide-gray-100">
// // // //               {selectedMatieres.map(matiereId => {
// // // //                 const matiere = matieres.find(m => m.id === matiereId)
// // // //                 return (
// // // //                   <div key={matiereId} className="p-4 hover:bg-gray-50/50 transition-colors group">
// // // //                     <div className="flex items-center gap-4">
// // // //                       <div className="flex-shrink-0">
// // // //                         <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
// // // //                           <BookOpen className="w-5 h-5 text-blue-600" />
// // // //                         </div>
// // // //                       </div>
// // // //                       <div className="flex-1 min-w-0">
// // // //                         <p className="font-medium text-gray-900 truncate">{matiere?.nom || `Matière #${matiereId}`}</p>
// // // //                         {matiere?.niveau && <p className="text-xs text-gray-500 mt-0.5">🎯 {matiere.niveau}</p>}
// // // //                       </div>
// // // //                       <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
// // // //                         <button onClick={() => handleMatiereToggle(matiereId)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Retirer">
// // // //                           <Trash2 className="w-4 h-4" />
// // // //                         </button>
// // // //                       </div>
// // // //                     </div>
// // // //                   </div>
// // // //                 )
// // // //               })}
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       )}

// // // //       {/* ========== ONGLET CONTRATS ========== */}
// // // //       {activeTab === 'contrats' && (
// // // //         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
// // // //           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
// // // //             <div>
// // // //               <h3 className="font-semibold text-gray-900 flex items-center gap-2"><FileText className="w-5 h-5 text-gray-700" />Mes contrats</h3>
// // // //               <p className="text-sm text-gray-500 mt-0.5">{contrats.length} contrat{contrats.length > 1 ? 's' : ''}</p>
// // // //             </div>
// // // //             <button onClick={loadContrats} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1">
// // // //               <RefreshCw className="w-3.5 h-3.5" /> Actualiser
// // // //             </button>
// // // //           </div>
// // // //           {loadingContrats ? (
// // // //             <div className="flex items-center justify-center py-16"><Loader /></div>
// // // //           ) : contrats.length === 0 ? (
// // // //             <div className="flex flex-col items-center justify-center py-16 px-6">
// // // //               <FileText className="w-16 h-16 text-gray-300 mb-4" />
// // // //               <p className="text-gray-500 text-lg font-medium mb-1">Aucun contrat</p>
// // // //               <p className="text-gray-400 text-sm">Les contrats apparaîtront ici quand les parents vous engageront.</p>
// // // //             </div>
// // // //           ) : (
// // // //             <div className="divide-y divide-gray-100">
// // // //               {contrats.map((contrat) => (
// // // //                 <div key={contrat.id} className="p-4 hover:bg-gray-50/50 transition-colors group">
// // // //                   <div className="flex items-start gap-4">
// // // //                     <div className="flex-shrink-0">
// // // //                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getContratStatutColor(contrat.statut)}`}>
// // // //                         <FileText className="w-5 h-5" />
// // // //                       </div>
// // // //                     </div>
// // // //                     <div className="flex-1 min-w-0">
// // // //                       <div className="flex items-center gap-2 mb-1">
// // // //                         <p className="font-medium text-gray-900">{contrat.titre}</p>
// // // //                         <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getContratStatutColor(contrat.statut)}`}>
// // // //                           {getStatutIcon(contrat.statut)}{contrat.statut.replace('_', ' ')}
// // // //                         </span>
// // // //                       </div>
// // // //                       <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
// // // //                         <span>{contrat.matiere} • {contrat.niveau}</span>
// // // //                         <span>•</span>
// // // //                         <span>{getFrequenceLabel(contrat.frequence)}</span>
// // // //                         <span>•</span>
// // // //                         <span className="text-green-600 font-medium">{contrat.tarif_final?.toLocaleString()} FC/h</span>
// // // //                         <span>•</span>
// // // //                         <span>{getDureeLabel(contrat.duree)}</span>
// // // //                       </div>
// // // //                       <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
// // // //                         <span>Début: {formatDate(contrat.date_debut)}</span>
// // // //                         {contrat.parent?.user && (
// // // //                           <>
// // // //                             <span>•</span>
// // // //                             <span className="flex items-center gap-1"><User className="w-3 h-3" /> {contrat.parent.user.username}</span>
// // // //                           </>
// // // //                         )}
// // // //                       </div>
// // // //                     </div>
// // // //                     <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
// // // //                       {/* Planifier une session */}
// // // //                       {(contrat.statut === 'actif' || contrat.statut === 'accepte') && (
// // // //                         <button onClick={() => openCreateSession(contrat)}
// // // //                           className="p-2 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all" title="Planifier une session">
// // // //                           <Calendar className="w-4 h-4" />
// // // //                         </button>
// // // //                       )}
                      
// // // //                       {/* Négociation */}
// // // //                       <button onClick={() => openNegotiation(contrat)}
// // // //                         className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Négocier">
// // // //                         <MessageSquare className="w-4 h-4" />
// // // //                       </button>
                      
// // // //                       {/* Actions selon statut */}
// // // //                       {contrat.statut === 'en_attente' && (
// // // //                         <>
// // // //                           <button onClick={() => handleContractStatusChange(contrat.id, 'accepte')}
// // // //                             className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Accepter">
// // // //                             <Check className="w-4 h-4" />
// // // //                           </button>
// // // //                           <button onClick={() => handleContractStatusChange(contrat.id, 'refuse')}
// // // //                             className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Refuser">
// // // //                             <X className="w-4 h-4" />
// // // //                           </button>
// // // //                         </>
// // // //                       )}
// // // //                       {contrat.statut === 'accepte' && (
// // // //                         <button onClick={() => handleContractStatusChange(contrat.id, 'actif')}
// // // //                           className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Démarrer">
// // // //                           <Play className="w-4 h-4" />
// // // //                         </button>
// // // //                       )}
// // // //                       {contrat.statut === 'actif' && (
// // // //                         <>
// // // //                           <button onClick={() => handleContractStatusChange(contrat.id, 'termine')}
// // // //                             className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Terminer">
// // // //                             <Check className="w-4 h-4" />
// // // //                           </button>
// // // //                           <button onClick={() => handleContractStatusChange(contrat.id, 'annule')}
// // // //                             className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Annuler">
// // // //                             <Ban className="w-4 h-4" />
// // // //                           </button>
// // // //                         </>
// // // //                       )}
// // // //                     </div>
// // // //                   </div>
// // // //                 </div>
// // // //               ))}
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       )}

// // // //       {/* ========== ONGLET SESSIONS ========== */}
// // // //       {activeTab === 'sessions' && (
// // // //         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
// // // //           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
// // // //             <div>
// // // //               <h3 className="font-semibold text-gray-900 flex items-center gap-2">
// // // //                 <Calendar className="w-5 h-5 text-gray-700" />
// // // //                 Mes sessions
// // // //               </h3>
// // // //               <p className="text-sm text-gray-500 mt-0.5">
// // // //                 {sessions.length} session{sessions.length > 1 ? 's' : ''} • 
// // // //                 {sessionsPlanifiees} à venir • 
// // // //                 {sessionsTerminees} terminée{sessionsTerminees > 1 ? 's' : ''}
// // // //               </p>
// // // //             </div>
// // // //             <div className="flex gap-2">
// // // //               <button onClick={loadSessions} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1">
// // // //                 <RefreshCw className="w-3.5 h-3.5" /> Actualiser
// // // //               </button>
// // // //             </div>
// // // //           </div>

// // // //           {loadingSessions ? (
// // // //             <div className="flex items-center justify-center py-16"><Loader /></div>
// // // //           ) : sessions.length === 0 ? (
// // // //             <div className="flex flex-col items-center justify-center py-16 px-6">
// // // //               <Calendar className="w-16 h-16 text-gray-300 mb-4" />
// // // //               <p className="text-gray-500 text-lg font-medium mb-1">Aucune session</p>
// // // //               <p className="text-gray-400 text-sm mb-6">
// // // //                 Les sessions apparaîtront ici quand vous en planifierez depuis un contrat actif.
// // // //               </p>
// // // //             </div>
// // // //           ) : (
// // // //             <div className="divide-y divide-gray-100">
// // // //               {/* Sessions à venir */}
// // // //               {sessionsPlanifiees > 0 && (
// // // //                 <div className="px-6 py-3 bg-blue-50/50">
// // // //                   <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
// // // //                     📅 Sessions à venir ({sessionsPlanifiees})
// // // //                   </p>
// // // //                 </div>
// // // //               )}

// // // //               {sessions
// // // //                 .filter(s => s.statut === 'planifie' || s.statut === 'en_cours')
// // // //                 .sort((a, b) => new Date(a.date_session).getTime() - new Date(b.date_session).getTime())
// // // //                 .map((session) => (
// // // //                   <div
// // // //                     key={session.id}
// // // //                     className="p-4 hover:bg-gray-50/50 transition-colors group cursor-pointer"
// // // //                     onClick={() => openSessionDetail(session)}
// // // //                   >
// // // //                     <div className="flex items-start gap-4">
// // // //                       <div className="flex-shrink-0">
// // // //                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getSessionStatutColor(session.statut)}`}>
// // // //                           <Calendar className="w-5 h-5" />
// // // //                         </div>
// // // //                       </div>

// // // //                       <div className="flex-1 min-w-0">
// // // //                         <div className="flex items-center gap-2 mb-1">
// // // //                           <p className="font-medium text-gray-900">
// // // //                             {session.matiere?.nom || 'Session'} 
// // // //                             {session.eleve && <span className="text-gray-500 font-normal"> - {session.eleve.prenom} {session.eleve.nom}</span>}
// // // //                           </p>
// // // //                           <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getSessionStatutColor(session.statut)}`}>
// // // //                             {getStatutIcon(session.statut)}
// // // //                             {session.statut.replace('_', ' ')}
// // // //                           </span>
// // // //                         </div>

// // // //                         <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
// // // //                           <span className="flex items-center gap-1">
// // // //                             <Calendar className="w-3.5 h-3.5" />
// // // //                             {formatDateLong(session.date_session)}
// // // //                           </span>
// // // //                         </div>

// // // //                         <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500">
// // // //                           <span className="flex items-center gap-1">
// // // //                             <Clock className="w-3 h-3" />
// // // //                             {session.heure_debut?.slice(0, 5)} - {session.heure_fin?.slice(0, 5)}
// // // //                           </span>
// // // //                           <span>•</span>
// // // //                           <span>{session.duree_minutes} min</span>
// // // //                           <span>•</span>
// // // //                           <span className="capitalize flex items-center gap-1">
// // // //                             {session.type_session === 'presentiel' ? <MapPin className="w-3 h-3" /> : <Video className="w-3 h-3" />}
// // // //                             {session.type_session?.replace('_', ' ')}
// // // //                           </span>
// // // //                           {session.lieu && (
// // // //                             <>
// // // //                               <span>•</span>
// // // //                               <span className="truncate max-w-[200px]">{session.lieu}</span>
// // // //                             </>
// // // //                           )}
// // // //                           {session.files_count ? (
// // // //                             <>
// // // //                               <span>•</span>
// // // //                               <span className="flex items-center gap-1">
// // // //                                 <FileText className="w-3 h-3" /> {session.files_count} fichier{session.files_count > 1 ? 's' : ''}
// // // //                               </span>
// // // //                             </>
// // // //                           ) : null}
// // // //                           {session.grades_count ? (
// // // //                             <>
// // // //                               <span>•</span>
// // // //                               <span className="flex items-center gap-1">
// // // //                                 <Star className="w-3 h-3" /> {session.grades_count} cotation{session.grades_count > 1 ? 's' : ''}
// // // //                               </span>
// // // //                             </>
// // // //                           ) : null}
// // // //                         </div>

// // // //                         {session.contrat && (
// // // //                           <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
// // // //                             <FileText className="w-3 h-3" />
// // // //                             Contrat : {session.contrat.titre || `#${session.contrat.id}`}
// // // //                           </div>
// // // //                         )}
// // // //                       </div>

// // // //                       {/* Actions rapides */}
// // // //                       <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
// // // //                         {session.statut === 'planifie' && (
// // // //                           <>
// // // //                             <button
// // // //                               onClick={() => handleSessionStatusChange(session.id, 'en_cours')}
// // // //                               className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
// // // //                               title="Démarrer"
// // // //                             >
// // // //                               <Play className="w-4 h-4" />
// // // //                             </button>
// // // //                             <button
// // // //                               onClick={() => handleSessionStatusChange(session.id, 'annule')}
// // // //                               className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
// // // //                               title="Annuler"
// // // //                             >
// // // //                               <X className="w-4 h-4" />
// // // //                             </button>
// // // //                           </>
// // // //                         )}
// // // //                         {session.statut === 'en_cours' && (
// // // //                           <button
// // // //                             onClick={() => handleSessionStatusChange(session.id, 'termine')}
// // // //                             className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
// // // //                             title="Terminer"
// // // //                           >
// // // //                             <StopCircle className="w-4 h-4" />
// // // //                           </button>
// // // //                         )}
// // // //                         {/* Voir détails */}
// // // //                         <button
// // // //                           onClick={() => openSessionDetail(session)}
// // // //                           className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
// // // //                           title="Voir détails"
// // // //                         >
// // // //                           <Eye className="w-4 h-4" />
// // // //                         </button>
// // // //                       </div>
// // // //                     </div>
// // // //                   </div>
// // // //                 ))}

// // // //               {/* Sessions passées */}
// // // //               {sessionsTerminees > 0 && sessions.filter(s => s.statut === 'termine' || s.statut === 'annule' || s.statut === 'reporte').length > 0 && (
// // // //                 <>
// // // //                   <div className="px-6 py-3 bg-gray-50/50">
// // // //                     <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
// // // //                       ✅ Sessions passées
// // // //                     </p>
// // // //                   </div>

// // // //                   {sessions
// // // //                     .filter(s => s.statut === 'termine' || s.statut === 'annule' || s.statut === 'reporte')
// // // //                     .sort((a, b) => new Date(b.date_session).getTime() - new Date(a.date_session).getTime())
// // // //                     .slice(0, 10)
// // // //                     .map((session) => (
// // // //                       <div
// // // //                         key={session.id}
// // // //                         className="p-4 hover:bg-gray-50/50 transition-colors group cursor-pointer opacity-75 hover:opacity-100"
// // // //                         onClick={() => openSessionDetail(session)}
// // // //                       >
// // // //                         <div className="flex items-start gap-4">
// // // //                           <div className="flex-shrink-0">
// // // //                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getSessionStatutColor(session.statut)}`}>
// // // //                               <Calendar className="w-5 h-5" />
// // // //                             </div>
// // // //                           </div>

// // // //                           <div className="flex-1 min-w-0">
// // // //                             <div className="flex items-center gap-2 mb-1">
// // // //                               <p className="font-medium text-gray-900">
// // // //                                 {session.matiere?.nom || 'Session'}
// // // //                                 {session.eleve && <span className="text-gray-500 font-normal"> - {session.eleve.prenom} {session.eleve.nom}</span>}
// // // //                               </p>
// // // //                               <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getSessionStatutColor(session.statut)}`}>
// // // //                                 {getStatutIcon(session.statut)}
// // // //                                 {session.statut.replace('_', ' ')}
// // // //                               </span>
// // // //                             </div>

// // // //                             <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
// // // //                               <span className="flex items-center gap-1">
// // // //                                 <Calendar className="w-3.5 h-3.5" />
// // // //                                 {formatDate(session.date_session)}
// // // //                               </span>
// // // //                             </div>

// // // //                             <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500">
// // // //                               <span>{session.heure_debut?.slice(0, 5)} - {session.heure_fin?.slice(0, 5)}</span>
// // // //                               <span>•</span>
// // // //                               <span>{session.duree_minutes} min</span>
// // // //                               {session.files_count ? (
// // // //                                 <>
// // // //                                   <span>•</span>
// // // //                                   <span>{session.files_count} fichier{session.files_count > 1 ? 's' : ''}</span>
// // // //                                 </>
// // // //                               ) : null}
// // // //                             </div>
// // // //                           </div>

// // // //                           <div className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
// // // //                             <button
// // // //                               onClick={() => openSessionDetail(session)}
// // // //                               className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
// // // //                               title="Voir détails"
// // // //                             >
// // // //                               <Eye className="w-4 h-4" />
// // // //                             </button>
// // // //                           </div>
// // // //                         </div>
// // // //                       </div>
// // // //                     ))}
// // // //                 </>
// // // //               )}
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       )}

// // // //       {/* ========== ONGLET CANDIDATURES ========== */}
// // // //       {activeTab === 'candidatures' && (
// // // //         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
// // // //           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
// // // //             <div>
// // // //               <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Send className="w-5 h-5 text-gray-700" />Mes candidatures</h3>
// // // //               <p className="text-sm text-gray-500 mt-0.5">{candidatures.length} candidature{candidatures.length > 1 ? 's' : ''} envoyée{candidatures.length > 1 ? 's' : ''}</p>
// // // //             </div>
// // // //             <div className="flex gap-2">
// // // //               <button onClick={loadCandidatures} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1">
// // // //                 <RefreshCw className="w-3.5 h-3.5" /> Actualiser
// // // //               </button>
// // // //               <Link href="/solicitation" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-md">
// // // //                 <Search className="w-4 h-4" /> Voir les services
// // // //               </Link>
// // // //             </div>
// // // //           </div>
          
// // // //           {loadingCandidatures ? (
// // // //             <div className="flex items-center justify-center py-16"><Loader /></div>
// // // //           ) : candidatures.length === 0 ? (
// // // //             <div className="flex flex-col items-center justify-center py-16 px-6">
// // // //               <Send className="w-16 h-16 text-gray-300 mb-4" />
// // // //               <p className="text-gray-500 text-lg font-medium mb-1">Aucune candidature</p>
// // // //               <p className="text-gray-400 text-sm mb-6">Vous n'avez pas encore postulé à des services</p>
// // // //               <Link href="/solicitation" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 font-medium text-sm shadow-md">
// // // //                 <Search className="w-4 h-4" /> Découvrir les services
// // // //               </Link>
// // // //             </div>
// // // //           ) : (
// // // //             <div className="divide-y divide-gray-100">
// // // //               {candidatures.map((candidature) => (
// // // //                 <div key={candidature.id} className="p-4 hover:bg-gray-50/50 transition-colors">
// // // //                   <div className="flex items-start gap-4">
// // // //                     <div className="flex-shrink-0">
// // // //                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getCandidatureStatutColor(candidature.statut)}`}>
// // // //                         <Send className="w-5 h-5" />
// // // //                       </div>
// // // //                     </div>
                    
// // // //                     <div className="flex-1 min-w-0">
// // // //                       <div className="flex items-center gap-2 mb-1">
// // // //                         <p className="font-medium text-gray-900">
// // // //                           {candidature.service_parent?.titre || `Service #${candidature.service_parent_id}`}
// // // //                         </p>
// // // //                         <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getCandidatureStatutColor(candidature.statut)}`}>
// // // //                           {candidature.statut === 'en_attente' && <><Clock className="w-3 h-3" /> En attente</>}
// // // //                           {candidature.statut === 'accepte' && <><Check className="w-3 h-3" /> Acceptée</>}
// // // //                           {candidature.statut === 'refuse' && <><X className="w-3 h-3" /> Refusée</>}
// // // //                         </span>
// // // //                       </div>
                      
// // // //                       <p className="text-sm text-gray-600 line-clamp-2 mb-2">{candidature.message}</p>
                      
// // // //                       <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
// // // //                         {candidature.tarif_propose && (
// // // //                           <span className="flex items-center gap-1 text-green-600 font-medium">
// // // //                             <DollarSign className="w-3 h-3" /> {candidature.tarif_propose.toLocaleString()} FC/h
// // // //                           </span>
// // // //                         )}
// // // //                         {candidature.disponibilites && (
// // // //                           <span className="flex items-center gap-1">
// // // //                             <Calendar className="w-3 h-3" /> {candidature.disponibilites}
// // // //                           </span>
// // // //                         )}
// // // //                         <span>📆 {formatDate(candidature.created_at)}</span>
// // // //                       </div>
// // // //                     </div>
// // // //                   </div>
// // // //                 </div>
// // // //               ))}
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       )}

// // // //       {/* ========== ONGLET DOCUMENTS ========== */}
// // // //       {activeTab === 'documents' && (
// // // //         <div className="bg-white rounded-2xl p-6">
// // // //           <ListeDocuments refresh={refreshDocs} onRefresh={() => setRefreshDocs(prev => prev + 1)} />
// // // //         </div>
// // // //       )}

// // // //       {/* ========== MODAL CRÉATION SESSION ========== */}
// // // //       <CreateSessionModal
// // // //         contract={selectedContractForSession}
// // // //         isOpen={showCreateSessionModal}
// // // //         onClose={() => setShowCreateSessionModal(false)}
// // // //         onSuccess={() => {
// // // //           loadSessions()
// // // //           loadContrats()
// // // //           setMessage('✅ Session planifiée avec succès !')
// // // //           setTimeout(() => setMessage(''), 3000)
// // // //         }}
// // // //         onCreating={() => setSaving(true)}
// // // //         onError={() => setSaving(false)}
// // // //       />

// // // //       {/* ========== MODAL DÉTAIL SESSION ========== */}
// // // //       <SessionDetailModal
// // // //         session={selectedSession}
// // // //         isOpen={showSessionModal}
// // // //         onClose={() => setShowSessionModal(false)}
// // // //         onStatusChange={handleSessionStatusChange}
// // // //         onNotesUpdate={handleNotesUpdate}
// // // //       />

// // // //       {/* ========== MODAL NÉGOCIATION EN TEMPS RÉEL ========== */}
// // // //       {showNegotiationModal && selectedContratForNegotiation && (
// // // //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
// // // //           <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
// // // //             {/* En-tête avec indicateur de temps réel */}
// // // //             <div className="p-6 border-b flex justify-between items-center">
// // // //               <div>
// // // //                 <h2 className="text-xl font-semibold flex items-center gap-2">
// // // //                   <MessageSquare className="w-5 h-5 text-blue-600" />
// // // //                   Négociation en direct
// // // //                 </h2>
// // // //                 <div className="flex items-center gap-2 mt-1">
// // // //                   <span className="relative flex h-2 w-2">
// // // //                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
// // // //                     <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
// // // //                   </span>
// // // //                   <span className="text-xs text-green-600 font-medium">Temps réel actif</span>
// // // //                 </div>
// // // //               </div>
// // // //               <button onClick={closeNegotiation} className="text-gray-400 hover:text-gray-600">
// // // //                 <X className="w-5 h-5" />
// // // //               </button>
// // // //             </div>
            
// // // //             {/* Messages */}
// // // //             <div className="flex-1 overflow-y-auto p-6 space-y-4">
// // // //               <div className="bg-blue-50 rounded-xl p-4 mb-4">
// // // //                 <p className="text-sm font-medium text-blue-900">
// // // //                   {selectedContratForNegotiation.titre}
// // // //                 </p>
// // // //                 <p className="text-xs text-blue-700 mt-1">
// // // //                   Tarif actuel : {selectedContratForNegotiation.tarif_final?.toLocaleString()} FC/h • 
// // // //                   Statut : {selectedContratForNegotiation.statut.replace('_', ' ')}
// // // //                 </p>
// // // //               </div>

// // // //               {negotiationMessages.length === 0 ? (
// // // //                 <div className="text-center py-8 text-gray-400">
// // // //                   <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
// // // //                   <p className="text-sm">Aucun message. Commencez la négociation.</p>
// // // //                 </div>
// // // //               ) : (
// // // //                 negotiationMessages.map((msg, index) => (
// // // //                   <div key={msg.id || index} className={`flex ${msg.sender === 'precepteur' ? 'justify-end' : 'justify-start'}`}>
// // // //                     <div className={`max-w-[80%] p-3 rounded-xl ${
// // // //                       msg.sender === 'precepteur' 
// // // //                         ? 'bg-blue-600 text-white rounded-br-none' 
// // // //                         : 'bg-gray-100 text-gray-900 rounded-bl-none'
// // // //                     }`}>
// // // //                       <p className="text-sm">{msg.message}</p>
// // // //                       {msg.tarif_propose && (
// // // //                         <p className="text-xs mt-1 opacity-75">
// // // //                           💰 Proposition : {msg.tarif_propose.toLocaleString()} FC/h
// // // //                         </p>
// // // //                       )}
// // // //                       <p className="text-xs mt-1 opacity-50">
// // // //                         {formatDateTime(msg.created_at)}
// // // //                       </p>
// // // //                     </div>
// // // //                   </div>
// // // //                 ))
// // // //               )}
// // // //               <div ref={messagesEndRef} />
// // // //             </div>

// // // //             {/* Formulaire */}
// // // //             <form onSubmit={sendNegotiationMessage} className="p-4 border-t bg-gray-50">
// // // //               <div className="flex gap-2">
// // // //                 <div className="flex-1 space-y-2">
// // // //                   <input
// // // //                     type="text"
// // // //                     value={negotiationForm.message}
// // // //                     onChange={(e) => setNegotiationForm({...negotiationForm, message: e.target.value})}
// // // //                     placeholder="Votre message..."
// // // //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
// // // //                     required
// // // //                   />
// // // //                   <div className="flex items-center gap-2">
// // // //                     <label className="text-xs text-gray-500">Contre-proposition (FC/h) :</label>
// // // //                     <input
// // // //                       type="number"
// // // //                       value={negotiationForm.tarif_propose}
// // // //                       onChange={(e) => setNegotiationForm({...negotiationForm, tarif_propose: Number(e.target.value)})}
// // // //                       className="w-32 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
// // // //                       min="0"
// // // //                       step="1000"
// // // //                     />
// // // //                   </div>
// // // //                 </div>
// // // //                 <button
// // // //                   type="submit"
// // // //                   disabled={sendingNegotiation}
// // // //                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 self-end"
// // // //                 >
// // // //                   {sendingNegotiation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
// // // //                 </button>
// // // //               </div>
// // // //             </form>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {/* ========== MODAL PROFIL ========== */}
// // // //       {showModal && (
// // // //         <ProfilModal
// // // //           isOpen={showModal}
// // // //           onClose={() => setShowModal(false)}
// // // //           onSave={handleSave}
// // // //           initialData={form}
// // // //           selectedMatieres={selectedMatieres}
// // // //           onMatieresChange={setSelectedMatieres}
// // // //           saving={saving}
// // // //         />
// // // //       )}
// // // //     </div>
// // // //   )
// // // // }


// // // // app/dashboard/precepteur/page.tsx
// // // 'use client'
// // // import { useRouter } from 'next/navigation'
// // // import UploadDocument from '@/components/UploadDocument'
// // // import ServiceManager from '@/components/ServiceManager'
// // // import ListeDocuments from '@/components/ListeDocuments'
// // // import ProfilModal from '@/components/ProfilModal'
// // // import { useAuth } from '@/context/AuthContext'
// // // import CreateSessionModal from './CreateSessionModal'
// // // import SessionDetailModal from './SessionDetailModal'
// // // import { updateProfilePhoto, updatePrecepteurDisponibility } from '@/actions/auth'
// // // import { updatePrecepteurProfil, getPrecepteurMatieres, getContrats, updateContratStatus, updateSessionStatus, updateSessionNotes } from '@/actions/precepteur'
// // // import { getSessions, getSessionsByContract } from '@/lib/session-api'
// // // import { useState, useEffect, useCallback, useRef } from 'react'
// // // import Link from 'next/link'
// // // import { 
// // //   User, MapPin, Star, Clock, BookOpen, GraduationCap, Calendar, 
// // //   Edit3, Check, X, Upload, Plus, Trash2, Eye, AlertCircle, 
// // //   ChevronDown, Filter, Play, StopCircle, Ban, RotateCcw, FileText, 
// // //   Users, Tag, Phone, Mail, Building, CreditCard, Search, Hash, MessageSquare, 
// // //   Activity, RefreshCw, Send, Loader2, DollarSign, Video, UserCheck
// // // } from 'lucide-react'
// // // import { PiBookOpen, PiPlus, PiTrash } from 'react-icons/pi'
// // // import Loader from '@/components/Loader'
// // // import { CheckBadgeIcon } from '@heroicons/react/24/solid'

// // // // Types
// // // type Contrat = {
// // //   id: string
// // //   service_parent_id?: string
// // //   service_precepteur_id?: string
// // //   parent_id: string
// // //   precepteur_id: number
// // //   eleve_id?: string
// // //   titre: string
// // //   matiere: string | null
// // //   niveau: string
// // //   frequence: string
// // //   lieu: string
// // //   date_debut: string
// // //   duree: string
// // //   tarif_final: number
// // //   notes: string | null
// // //   statut: 'en_attente' | 'accepte' | 'refuse' | 'actif' | 'termine' | 'annule'
// // //   created_at: string
// // //   updated_at: string
// // //   parent?: any
// // //   eleve?: any
// // //   matiere_obj?: any
// // //   sessions?: Session[] | null
// // // }

// // // type Session = {
// // //   id: number
// // //   contract_id: number
// // //   date_session: string
// // //   heure_debut: string
// // //   heure_fin: string
// // //   duree_minutes: number
// // //   statut: 'planifie' | 'en_cours' | 'termine' | 'annule' | 'reporte'
// // //   type_session: 'presentiel' | 'en_ligne' | 'hybride'
// // //   lieu: string | null
// // //   lien_visio: string | null
// // //   notes_precepteur: string | null
// // //   notes_parent: string | null
// // //   feedback_precepteur: string | null
// // //   feedback_parent: string | null
// // //   note_session: number | null
// // //   raison_annulation: string | null
// // //   annule_par: string | null
// // //   created_at: string
// // //   contrat?: any
// // //   eleve?: any
// // //   matiere?: any
// // //   files?: any[]
// // //   grades?: any[]
// // //   files_count?: number
// // //   grades_count?: number
// // // }

// // // type NegotiationMessage = {
// // //   id: string
// // //   contract_id: string
// // //   sender_id: string
// // //   sender: 'parent' | 'precepteur'
// // //   message: string
// // //   tarif_propose: number | null
// // //   created_at: string
// // // }

// // // // Candidature du précepteur vers un service parent
// // // type CandidaturePrecepteur = {
// // //   id: string
// // //   service_parent_id: string
// // //   precepteur_id: number
// // //   message: string
// // //   tarif_propose: number | null
// // //   disponibilites: string | null
// // //   statut: 'en_attente' | 'accepte' | 'refuse'
// // //   created_at: string
// // //   service_parent?: any
// // // }

// // // // Candidature d'un parent vers un service du précepteur
// // // type CandidatureParent = {
// // //   id: string
// // //   service_precepteur_id: string
// // //   parent_id: string
// // //   eleve_id: string
// // //   message: string
// // //   tarif_propose: number | null
// // //   statut: 'en_attente' | 'accepte' | 'refuse'
// // //   created_at: string
// // //   service?: any
// // //   parent?: any
// // //   eleve?: any
// // // }

// // // interface ProfilForm {
// // //   latitude: string
// // //   longitude: string
// // //   commune: string
// // //   quartier: string
// // //   annees_experience: number
// // //   diplome: string
// // //   etablissement_origine: string
// // //   telephone: string
// // // }

// // // const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
// // // const POLLING_INTERVAL = 3000

// // // export default function PrecepteurDashboard() {
// // //   const router = useRouter()
// // //   const { user, precepteurInfo, refreshPrecepteurInfo, updateUser } = useAuth()
  
// // //   // États principaux
// // //   const [uploading, setUploading] = useState(false)
// // //   const [saving, setSaving] = useState(false)
// // //   const [message, setMessage] = useState('')
// // //   const [loading, setLoading] = useState(true)
// // //   const [activeTab, setActiveTab] = useState('profil')
// // //   const [showModal, setShowModal] = useState(false)
// // //   const [refreshDocs, setRefreshDocs] = useState(0)
  
// // //   // États contrats
// // //   const [contrats, setContrats] = useState<Contrat[]>([])
// // //   const [loadingContrats, setLoadingContrats] = useState(false)
  
// // //   // États sessions
// // //   const [sessions, setSessions] = useState<Session[]>([])
// // //   const [loadingSessions, setLoadingSessions] = useState(false)
// // //   const [selectedSession, setSelectedSession] = useState<Session | null>(null)
// // //   const [showSessionModal, setShowSessionModal] = useState(false)
// // //   const [selectedContractForSession, setSelectedContractForSession] = useState<Contrat | null>(null)
// // //   const [showCreateSessionModal, setShowCreateSessionModal] = useState(false)
  
// // //   // États négociation
// // //   const [showNegotiationModal, setShowNegotiationModal] = useState(false)
// // //   const [selectedContratForNegotiation, setSelectedContratForNegotiation] = useState<Contrat | null>(null)
// // //   const [negotiationForm, setNegotiationForm] = useState({ message: '', tarif_propose: 0 })
// // //   const [negotiationMessages, setNegotiationMessages] = useState<NegotiationMessage[]>([])
// // //   const [sendingNegotiation, setSendingNegotiation] = useState(false)
  
// // //   // États matières
// // //   const [matieres, setMatieres] = useState<any[]>([])
// // //   const [selectedMatieres, setSelectedMatieres] = useState<number[]>([])
  
// // //   // États candidatures (précepteur → services parents)
// // //   const [candidatures, setCandidatures] = useState<CandidaturePrecepteur[]>([])
// // //   const [loadingCandidatures, setLoadingCandidatures] = useState(false)
  
// // //   // 🆕 États candidatures reçues (parents → mes services)
// // //   const [candidaturesRecues, setCandidaturesRecues] = useState<CandidatureParent[]>([])
// // //   const [loadingCandidaturesRecues, setLoadingCandidaturesRecues] = useState(false)
  
// // //   // 🆕 Modal création contrat depuis candidature parent
// // //   const [showContratModal, setShowContratModal] = useState(false)
// // //   const [selectedCandidature, setSelectedCandidature] = useState<CandidatureParent | null>(null)
// // //   const [contratForm, setContratForm] = useState({ date_debut: '', duree: '1_mois', tarif_final: 0, notes: '' })
  
// // //   // États formulaire profil
// // //   const [form, setForm] = useState<ProfilForm>({
// // //     latitude: '', longitude: '', commune: '', quartier: '',
// // //     annees_experience: 0, diplome: '', etablissement_origine: '', telephone: ''
// // //   })
  
// // //   const [disponible, setDisponible] = useState(precepteurInfo?.disponible ?? true)

// // //   const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
// // //   const messagesEndRef = useRef<HTMLDivElement>(null)

// // //   // ============ INITIALISATION ============
// // //   useEffect(() => {
// // //     let isMounted = true
// // //     const initializeData = async () => {
// // //       if (!user) { setLoading(false); return }
// // //       if (!precepteurInfo) await refreshPrecepteurInfo()
// // //       if (!isMounted) return
// // //       if (precepteurInfo) {
// // //         setForm({
// // //           latitude: precepteurInfo.latitude?.toString() || '',
// // //           longitude: precepteurInfo.longitude?.toString() || '',
// // //           commune: precepteurInfo.commune || '',
// // //           quartier: precepteurInfo.quartier || '',
// // //           annees_experience: precepteurInfo.annees_experience || 0,
// // //           diplome: precepteurInfo.diplome || '',
// // //           telephone: precepteurInfo.telephone || '',
// // //           etablissement_origine: precepteurInfo.etablissement_origine || ''
// // //         })
// // //         setDisponible(precepteurInfo.disponible ?? true)
// // //         if (precepteurInfo.precepteur_matieres) {
// // //           setSelectedMatieres(precepteurInfo.precepteur_matieres.map((pm: any) => pm.matiere_id))
// // //         }
// // //         await Promise.all([loadContrats(), loadMatieres(), loadCandidatures(), loadCandidaturesRecues(), loadSessions()])
// // //       }
// // //       if (isMounted) setLoading(false)
// // //     }
// // //     initializeData()
// // //     return () => { isMounted = false }
// // //   }, [user?.id, precepteurInfo?.id])

// // //   useEffect(() => {
// // //     return () => { if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current) }
// // //   }, [])

// // //   useEffect(() => {
// // //     if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
// // //   }, [negotiationMessages])

// // //   // ============ CHARGEMENT ============
// // //   const loadSessions = useCallback(async () => {
// // //     setLoadingSessions(true)
// // //     try { const data = await getSessions(); setSessions(data.sessions || []) }
// // //     catch (error) { console.error('❌ Erreur chargement sessions:', error) }
// // //     finally { setLoadingSessions(false) }
// // //   }, [])

// // //   const loadNegotiationMessages = async (contratId: string) => {
// // //     try {
// // //       const token = localStorage.getItem('excellence-token')
// // //       if (!token) return
// // //       const response = await fetch(`${API_URL}/auth/contracts/${contratId}/negotiations`, {
// // //         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
// // //       })
// // //       if (response.ok) { const data = await response.json(); setNegotiationMessages(data.messages || []) }
// // //     } catch (error) { console.error('❌ Erreur chargement négociations:', error) }
// // //   }

// // //   const startNegotiationPolling = (contratId: string) => {
// // //     if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current)
// // //     loadNegotiationMessages(contratId)
// // //     pollingIntervalRef.current = setInterval(() => loadNegotiationMessages(contratId), POLLING_INTERVAL)
// // //   }

// // //   const stopNegotiationPolling = () => {
// // //     if (pollingIntervalRef.current) { clearInterval(pollingIntervalRef.current); pollingIntervalRef.current = null }
// // //   }

// // //   const loadContrats = useCallback(async () => {
// // //     if (!precepteurInfo) return
// // //     setLoadingContrats(true)
// // //     try {
// // //       const token = localStorage.getItem('excellence-token')
// // //       if (!token) return
// // //       const response = await fetch(`${API_URL}/auth/contracts`, {
// // //         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
// // //       })
// // //       const data = await response.json()
// // //       if (data.success) setContrats(data.contrats || [])
// // //     } catch (error) { console.error('❌ Erreur chargement contrats:', error) }
// // //     finally { setLoadingContrats(false) }
// // //   }, [precepteurInfo])

// // //   const loadMatieres = async () => {
// // //     try {
// // //       const result = await getPrecepteurMatieres()
// // //       if (result.success) setMatieres(result.matieres || [])
// // //     } catch (error) { console.error('❌ Erreur chargement matières:', error) }
// // //   }

// // //   // 🆕 Charger mes candidatures envoyées (précepteur → services parents)
// // //   const loadCandidatures = async () => {
// // //     if (!precepteurInfo) return
// // //     setLoadingCandidatures(true)
// // //     try {
// // //       const token = localStorage.getItem('excellence-token')
// // //       if (!token) return
// // //       const response = await fetch(`${API_URL}/auth/candidatures/mes-candidatures`, {
// // //         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
// // //       })
// // //       if (response.ok) {
// // //         const data = await response.json()
// // //         if (data.success) setCandidatures(data.candidatures || [])
// // //       }
// // //     } catch (error) { console.error('❌ Erreur chargement candidatures:', error) }
// // //     finally { setLoadingCandidatures(false) }
// // //   }

// // //   // 🆕 Charger les candidatures reçues (parents → mes services)
// // //   const loadCandidaturesRecues = async () => {
// // //     if (!precepteurInfo) return
// // //     setLoadingCandidaturesRecues(true)
// // //     try {
// // //       const token = localStorage.getItem('excellence-token')
// // //       if (!token) return
// // //       const response = await fetch(`${API_URL}/auth/precepteur/candidatures`, {
// // //         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
// // //       })
// // //       if (response.ok) {
// // //         const data = await response.json()
// // //         if (data.success) setCandidaturesRecues(data.candidatures || [])
// // //       }
// // //     } catch (error) { console.error('❌ Erreur chargement candidatures reçues:', error) }
// // //     finally { setLoadingCandidaturesRecues(false) }
// // //   }

// // //   // ============ GESTION SESSIONS ============
// // //   const handleSessionStatusChange = async (sessionId: number, newStatus: string) => {
// // //     try {
// // //       await updateSessionStatus(sessionId, newStatus)
// // //       setMessage(`✅ Session ${newStatus.replace('_', ' ')} avec succès`)
// // //       await loadSessions()
// // //       setTimeout(() => setMessage(''), 3000)
// // //     } catch (error) { setMessage('Erreur lors du changement de statut') }
// // //   }

// // //   const handleNotesUpdate = async (sessionId: number, notes: string) => {
// // //     try {
// // //       await updateSessionNotes(sessionId, notes)
// // //       setMessage('✅ Notes sauvegardées avec succès')
// // //       await loadSessions()
// // //       setTimeout(() => setMessage(''), 3000)
// // //     } catch (error) { setMessage('Erreur lors de la sauvegarde des notes') }
// // //   }

// // //   const openSessionDetail = (session: Session) => { setSelectedSession(session); setShowSessionModal(true) }
// // //   const openCreateSession = (contrat: Contrat) => { setSelectedContractForSession(contrat); setShowCreateSessionModal(true) }

// // //   // ============ GESTION CONTRATS ============
// // //   const handleContractStatusChange = async (contratId: string, newStatus: string) => {
// // //     try {
// // //       const token = localStorage.getItem('excellence-token')
// // //       if (!token) return
// // //       const response = await fetch(`${API_URL}/auth/contracts/${contratId}/status`, {
// // //         method: 'PATCH',
// // //         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
// // //         body: JSON.stringify({ statut: newStatus })
// // //       })
// // //       if (response.ok) {
// // //         setMessage(`✅ Contrat ${newStatus.replace('_', ' ')} avec succès`)
// // //         setTimeout(() => setMessage(''), 3000)
// // //         loadContrats()
// // //       }
// // //     } catch (error) { console.error('❌ Erreur changement statut contrat:', error) }
// // //   }

// // //   // 🆕 Gestion candidatures reçues
// // //   const handleCandidatureStatus = async (candidatureId: string, newStatus: string) => {
// // //     try {
// // //       const token = localStorage.getItem('excellence-token')
// // //       if (!token) return
// // //       const response = await fetch(`${API_URL}/auth/parent/candidatures/${candidatureId}/status`, {
// // //         method: 'PUT',
// // //         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
// // //         body: JSON.stringify({ statut: newStatus })
// // //       })
// // //       if (response.ok) {
// // //         setMessage(`✅ Candidature ${newStatus === 'accepte' ? 'acceptée' : 'refusée'}`)
// // //         loadCandidaturesRecues()
// // //         setTimeout(() => setMessage(''), 3000)
// // //       }
// // //     } catch (error) { console.error('❌ Erreur statut candidature:', error) }
// // //   }

// // //   // 🆕 Ouvrir le modal de création de contrat
// // //   const openContratModal = (candidature: CandidatureParent) => {
// // //     setSelectedCandidature(candidature)
// // //     setContratForm({
// // //       date_debut: new Date().toISOString().split('T')[0],
// // //       duree: '1_mois',
// // //       tarif_final: candidature.tarif_propose || candidature.service?.tarif_horaire || 0,
// // //       notes: ''
// // //     })
// // //     setShowContratModal(true)
// // //   }

// // //   // 🆕 Créer un contrat depuis une candidature parent
// // //   const handleCreateContrat = async (e: React.FormEvent) => {
// // //     e.preventDefault()
// // //     setSaving(true)
// // //     try {
// // //       const token = localStorage.getItem('excellence-token')
// // //       if (!token) return
// // //       const response = await fetch(`${API_URL}/auth/parent/candidatures/${selectedCandidature?.id}/contrat`, {
// // //         method: 'POST',
// // //         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
// // //         body: JSON.stringify(contratForm)
// // //       })
// // //       const data = await response.json()
// // //       if (response.ok) {
// // //         setMessage('✅ Contrat créé avec succès !')
// // //         setShowContratModal(false)
// // //         loadContrats()
// // //         loadCandidaturesRecues()
// // //       } else {
// // //         setMessage(data.error || 'Erreur lors de la création du contrat')
// // //       }
// // //     } catch (error) { console.error('❌ Erreur création contrat:', error) }
// // //     finally { setSaving(false); setTimeout(() => setMessage(''), 3000) }
// // //   }

// // //   // ============ GESTION NÉGOCIATION ============
// // //   const openNegotiation = async (contrat: Contrat) => {
// // //     setSelectedContratForNegotiation(contrat)
// // //     setNegotiationForm({ message: '', tarif_propose: contrat.tarif_final })
// // //     startNegotiationPolling(contrat.id)
// // //     setShowNegotiationModal(true)
// // //   }

// // //   const closeNegotiation = () => { stopNegotiationPolling(); setShowNegotiationModal(false); setSelectedContratForNegotiation(null) }

// // //   const sendNegotiationMessage = async (e: React.FormEvent) => {
// // //     e.preventDefault()
// // //     setSendingNegotiation(true)
// // //     try {
// // //       const token = localStorage.getItem('excellence-token')
// // //       if (!token) throw new Error('Non connecté')
// // //       const response = await fetch(`${API_URL}/auth/contracts/${selectedContratForNegotiation?.id}/negotiations`, {
// // //         method: 'POST',
// // //         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
// // //         body: JSON.stringify({ message: negotiationForm.message, tarif_propose: negotiationForm.tarif_propose })
// // //       })
// // //       if (response.ok && selectedContratForNegotiation) {
// // //         await loadNegotiationMessages(selectedContratForNegotiation.id)
// // //         setNegotiationForm({ ...negotiationForm, message: '' })
// // //       }
// // //     } catch (error) { console.error('❌ Erreur envoi message:', error) }
// // //     finally { setSendingNegotiation(false) }
// // //   }

// // //   // ============ GESTION PROFIL ============
// // //   const handleSave = async (data: ProfilForm & { matieres: number[] }) => {
// // //     setSaving(true); setMessage('')
// // //     try {
// // //       const result = await updatePrecepteurProfil({
// // //         latitude: data.latitude || undefined, longitude: data.longitude || undefined,
// // //         commune: data.commune || undefined, quartier: data.quartier || undefined,
// // //         annees_experience: data.annees_experience || 0, diplome: data.diplome || undefined,
// // //         etablissement_origine: data.etablissement_origine || undefined,
// // //         telephone: data.telephone || undefined, matieres: data.matieres
// // //       })
// // //       if (result.success) { setShowModal(false); setMessage('✅ Profil mis à jour avec succès !'); await refreshPrecepteurInfo() }
// // //       else setMessage(result.error || 'Erreur lors de la mise à jour')
// // //     } catch (error) { setMessage('Erreur lors de la mise à jour du profil') }
// // //     finally { setSaving(false); setTimeout(() => setMessage(''), 3000) }
// // //   }

// // //   const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     const file = e.target.files?.[0]
// // //     if (!file) return
// // //     if (file.size > 5 * 1024 * 1024) { setMessage('Image trop volumineuse. Maximum 5MB.'); setTimeout(() => setMessage(''), 3000); return }
// // //     setUploading(true)
// // //     try {
// // //       const result = await updateProfilePhoto(file)
// // //       if (result.success && result.photoUrl) { updateUser({ photo_profil: result.photoUrl }); setMessage('Photo mise à jour avec succès') }
// // //       else setMessage(result.error || 'Erreur lors de la mise à jour')
// // //     } catch (error) { setMessage('Erreur lors de l\'upload de la photo') }
// // //     finally { setUploading(false); setTimeout(() => setMessage(''), 3000) }
// // //   }

// // //   const toggleDisponible = async () => {
// // //     const newDisponible = !disponible; setDisponible(newDisponible)
// // //     try {
// // //       const result = await updatePrecepteurDisponibility(newDisponible)
// // //       if (result.success) await refreshPrecepteurInfo()
// // //       else { setDisponible(!newDisponible); setMessage(result.error || 'Erreur lors de la mise à jour') }
// // //     } catch (error) { setDisponible(!newDisponible); setMessage('Erreur lors de la mise à jour') }
// // //   }

// // //   const handleMatiereToggle = (matiereId: number) => {
// // //     setSelectedMatieres(prev => prev.includes(matiereId) ? prev.filter(id => id !== matiereId) : [...prev, matiereId])
// // //   }

// // //   const openModal = () => {
// // //     if (precepteurInfo) {
// // //       setForm({
// // //         latitude: precepteurInfo.latitude?.toString() || '', longitude: precepteurInfo.longitude?.toString() || '',
// // //         commune: precepteurInfo.commune || '', quartier: precepteurInfo.quartier || '',
// // //         annees_experience: precepteurInfo.annees_experience || 0, diplome: precepteurInfo.diplome || '',
// // //         telephone: precepteurInfo.telephone || '', etablissement_origine: precepteurInfo.etablissement_origine || ''
// // //       })
// // //     }
// // //     setShowModal(true)
// // //   }

// // //   // ============ HELPERS UI ============
// // //   const getContratStatutColor = (statut: string) => {
// // //     switch (statut) {
// // //       case 'en_attente': return 'bg-yellow-100 text-yellow-800'
// // //       case 'accepte': return 'bg-blue-100 text-blue-800'
// // //       case 'actif': return 'bg-green-100 text-green-800'
// // //       case 'refuse': return 'bg-red-100 text-red-800'
// // //       case 'termine': return 'bg-gray-100 text-gray-800'
// // //       case 'annule': return 'bg-red-100 text-red-800'
// // //       default: return 'bg-gray-100 text-gray-800'
// // //     }
// // //   }

// // //   const getCandidatureStatutColor = (statut: string) => {
// // //     switch (statut) {
// // //       case 'en_attente': return 'bg-yellow-100 text-yellow-800'
// // //       case 'accepte': return 'bg-green-100 text-green-800'
// // //       case 'refuse': return 'bg-red-100 text-red-800'
// // //       default: return 'bg-gray-100 text-gray-800'
// // //     }
// // //   }

// // //   const getSessionStatutColor = (statut: string) => {
// // //     switch (statut) {
// // //       case 'planifie': return 'bg-blue-100 text-blue-800'
// // //       case 'en_cours': return 'bg-yellow-100 text-yellow-800'
// // //       case 'termine': return 'bg-green-100 text-green-800'
// // //       case 'annule': return 'bg-red-100 text-red-800'
// // //       case 'reporte': return 'bg-purple-100 text-purple-800'
// // //       default: return 'bg-gray-100 text-gray-800'
// // //     }
// // //   }

// // //   const getStatutIcon = (statut: string) => {
// // //     switch (statut) {
// // //       case 'planifie': case 'en_attente': return <Clock className="w-4 h-4" />
// // //       case 'en_cours': return <Play className="w-4 h-4" />
// // //       case 'termine': case 'accepte': case 'actif': return <Check className="w-4 h-4" />
// // //       case 'refuse': case 'annule': return <X className="w-4 h-4" />
// // //       default: return <AlertCircle className="w-4 h-4" />
// // //     }
// // //   }

// // //   const getFrequenceLabel = (frequence: string) => {
// // //     switch (frequence) {
// // //       case 'unique': return 'Ponctuel'; case 'hebdomadaire': return 'Hebdomadaire'
// // //       case 'bi-hebdomadaire': return '2x/semaine'; case 'mensuel': return 'Mensuel'
// // //       default: return frequence
// // //     }
// // //   }

// // //   const getDureeLabel = (duree: string) => {
// // //     switch (duree) {
// // //       case '1_mois': return '1 mois'; case '3_mois': return '3 mois'
// // //       case '6_mois': return '6 mois'; case '12_mois': return '1 an'
// // //       case 'indetermine': return 'Indéterminée'; default: return duree
// // //     }
// // //   }

// // //   const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
// // //   const formatDateLong = (date: string) => new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
// // //   const formatDateTime = (date: string) => new Date(date).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
// // //   const getPhotoUrl = (photoPath: string | null | undefined) => {
// // //     if (!photoPath) return null
// // //     if (photoPath.startsWith('http')) return photoPath
// // //     return `${API_URL.replace('/api', '')}${photoPath}`
// // //   }

// // //   // ============ STATS ============
// // //   const contratsActifs = contrats.filter(c => c.statut === 'actif' || c.statut === 'accepte').length
// // //   const sessionsPlanifiees = sessions.filter(s => s.statut === 'planifie' || s.statut === 'en_cours').length
// // //   const sessionsTerminees = sessions.filter(s => s.statut === 'termine').length

// // //   // ============ LOADING ============
// // //   if (loading) return <div className='flex items-center justify-center h-screen'><div className='w-20'><Loader/></div></div>
// // //   if (!user) return null

// // //   // ============ RENDU ============
// // //   return (
// // //     <div className="max-w-6xl mx-auto px-4 py-8">
// // //       {message && (
// // //         <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${message.includes('Erreur') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
// // //           {message.includes('Erreur') ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <Check className="w-4 h-4 flex-shrink-0" />}
// // //           {message}
// // //         </div>
// // //       )}

// // //       {/* Message profil incomplet */}
// // //       {precepteurInfo && (!precepteurInfo.commune || !precepteurInfo.quartier || !precepteurInfo.diplome || !precepteurInfo.etablissement_origine || precepteurInfo.annees_experience === 0 || precepteurInfo.statut_verification === 'en_attente' || precepteurInfo.statut_verification === 'rejete') && (
// // //         <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
// // //           <div className="flex-shrink-0 mt-0.5"><AlertCircle className="w-5 h-5 text-amber-600" /></div>
// // //           <div className="flex-1">
// // //             <h3 className="text-sm font-semibold text-amber-800 mb-1">
// // //               {precepteurInfo.statut_verification === 'rejete' ? 'Votre dossier a été rejeté' : precepteurInfo.statut_verification === 'en_attente' ? 'Votre dossier est en attente de vérification' : 'Profil incomplet'}
// // //             </h3>
// // //             <p className="text-sm text-amber-700">
// // //               {precepteurInfo.statut_verification === 'rejete' ? 'Votre dossier a été rejeté. Veuillez mettre à jour vos informations.' : 'Complétez votre profil pour apparaître dans les recherches.'}
// // //             </p>
// // //             <button onClick={openModal} className="mt-3 px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2">
// // //               <Edit3 className="w-4 h-4" /> Modifier le profil
// // //             </button>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* ========== CARD PROFIL ========== */}
// // //       <div className="bg-white rounded-2xl mb-6 p-6">
// // //         <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
// // //           <div className="relative group w-24 h-24 flex-shrink-0 mx-auto md:mx-0">
// // //             {user.photo_profil ? (
// // //               <img src={getPhotoUrl(user.photo_profil) || ''} alt="" className="w-24 h-24 rounded-full object-cover border-2 border-gray-100"
// // //                 onError={(e) => { e.currentTarget.style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex' }} />
// // //             ) : null}
// // //             <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-2 border-gray-100 ${user.photo_profil ? 'hidden' : 'flex'}`}>
// // //               <User className="w-10 h-10 text-blue-400" />
// // //             </div>
// // //             <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
// // //               {uploading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <Upload className="w-5 h-5 text-white" />}
// // //               <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
// // //             </label>
// // //           </div>
// // //           <div className="flex-1 text-center md:text-left">
// // //             <h1 className="text-2xl font-bold">{user.username}
// // //               {precepteurInfo?.statut_verification === 'verifie' && (
// // //                 <span className="inline-flex items-center gap-1 ml-2 text-blue-600"><CheckBadgeIcon className="w-5 h-5" /><span className="text-sm font-normal">Vérifié</span></span>
// // //               )}
// // //             </h1>
// // //             <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2 mt-1">
// // //               <GraduationCap className="w-4 h-4" /> Précepteur
// // //               {selectedMatieres.length > 0 && <span className="text-sm text-gray-500">• {selectedMatieres.length} matière{selectedMatieres.length > 1 ? 's' : ''}</span>}
// // //             </p>
// // //             <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm text-gray-500">
// // //               <MapPin className="w-4 h-4" />
// // //               {precepteurInfo?.commune ? <span>{precepteurInfo.commune}{precepteurInfo.quartier ? `, ${precepteurInfo.quartier}` : ''}</span> : <span>Localisation non spécifiée</span>}
// // //             </div>
// // //             <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
// // //               <Star className="w-4 h-4 text-yellow-500" /><span className="text-sm font-medium">{precepteurInfo?.note_moyenne?.toFixed(1) || '0.0'}/5</span>
// // //             </div>
// // //           </div>
// // //           <div className="flex flex-wrap gap-2 justify-center md:justify-start">
// // //             <button onClick={toggleDisponible} className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 font-medium ${disponible ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
// // //               {disponible ? <><Check className="w-4 h-4" /> Disponible</> : <><X className="w-4 h-4" /> Indisponible</>}
// // //             </button>
// // //             <Link href="/solicitation" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-md">
// // //               <Search className="w-4 h-4" /> Services disponibles
// // //             </Link>
// // //           </div>
// // //         </div>
// // //         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
// // //           <div className="p-4 bg-blue-50 rounded-xl"><p className="text-2xl font-bold text-blue-600">{selectedMatieres.length}</p><p className="text-sm text-gray-600 flex items-center gap-1"><BookOpen className="w-3 h-3" /> Matières</p></div>
// // //           <div className="p-4 bg-green-50 rounded-xl"><p className="text-2xl font-bold text-green-600">{contrats.length}</p><p className="text-sm text-gray-600 flex items-center gap-1"><FileText className="w-3 h-3" /> Contrats</p></div>
// // //           <div className="p-4 bg-purple-50 rounded-xl"><p className="text-2xl font-bold text-purple-600">{contratsActifs}</p><p className="text-sm text-gray-600 flex items-center gap-1"><Check className="w-3 h-3" /> Actifs</p></div>
// // //           <div className="p-4 bg-cyan-50 rounded-xl"><p className="text-2xl font-bold text-cyan-600">{sessions.length}</p><p className="text-sm text-gray-600 flex items-center gap-1"><Calendar className="w-3 h-3" /> Sessions</p></div>
// // //           <div className="p-4 bg-teal-50 rounded-xl"><p className="text-2xl font-bold text-teal-600">{candidatures.length + candidaturesRecues.length}</p><p className="text-sm text-gray-600 flex items-center gap-1"><Send className="w-3 h-3" /> Candidatures</p></div>
// // //         </div>
// // //       </div>

// // //       {/* ========== TABS ========== */}
// // //       <div className="flex gap-4 mb-6 overflow-x-auto flex-wrap">
// // //         {[
// // //           { key: 'profil', icon: User, label: 'Profil' },
// // //           { key: 'matieres', icon: BookOpen, label: `Matières (${selectedMatieres.length})` },
// // //           { key: 'contrats', icon: FileText, label: `Contrats (${contrats.length})` },
// // //           { key: 'sessions', icon: Calendar, label: `Sessions (${sessions.length})` },
// // //           { key: 'candidatures', icon: Send, label: `Candidatures (${candidatures.length})` },
// // //           { key: 'candidatures-recues', icon: UserCheck, label: `Reçues (${candidaturesRecues.length})` },
// // //           { key: 'documents', icon: FileText, label: 'Documents' },
// // //         ].map(tab => (
// // //           <button key={tab.key} onClick={() => setActiveTab(tab.key)}
// // //             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === tab.key ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
// // //             <tab.icon className="w-4 h-4" /> {tab.label}
// // //           </button>
// // //         ))}
// // //       </div>

// // //       {/* ========== ONGLET PROFIL ========== */}
// // //       {activeTab === 'profil' && (
// // //         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
// // //           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
// // //             <div><h3 className="font-semibold text-gray-900 flex items-center gap-2"><User className="w-5 h-5 text-gray-700" />Informations du précepteur</h3><p className="text-sm text-gray-500 mt-0.5">Profil professionnel</p></div>
// // //             <button onClick={openModal} className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium"><Edit3 className="w-4 h-4" /> Modifier le profil</button>
// // //           </div>
// // //           <div className="p-6">
// // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // //               {[
// // //                 { label: 'Commune', value: precepteurInfo?.commune, icon: MapPin },
// // //                 { label: 'Quartier', value: precepteurInfo?.quartier, icon: MapPin },
// // //                 { label: 'Téléphone', value: precepteurInfo?.telephone, icon: Phone },
// // //                 { label: 'Années d\'expérience', value: `${precepteurInfo?.annees_experience || 0} an(s)`, icon: Clock },
// // //                 { label: 'Diplôme', value: precepteurInfo?.diplome, icon: GraduationCap },
// // //                 { label: 'Établissement d\'origine', value: precepteurInfo?.etablissement_origine, icon: Building },
// // //               ].map((item, i) => (
// // //                 <div key={i}>
// // //                   <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><item.icon className="w-3 h-3" /> {item.label}</p>
// // //                   <p className="font-medium text-gray-900">{item.value || 'Non spécifié'}</p>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* ========== ONGLET MATIÈRES ========== */}
// // //       {activeTab === 'matieres' && (
// // //         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
// // //           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
// // //             <div><h3 className="font-semibold text-gray-900 flex items-center gap-2"><BookOpen className="w-5 h-5 text-gray-700" />Mes matières</h3><p className="text-sm text-gray-500 mt-0.5">{selectedMatieres.length} matière{selectedMatieres.length > 1 ? 's' : ''}</p></div>
// // //             <button onClick={openModal} className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium"><Plus className="w-4 h-4" /> Gérer les matières</button>
// // //           </div>
// // //           {selectedMatieres.length === 0 ? (
// // //             <div className="flex flex-col items-center justify-center py-16 px-6">
// // //               <BookOpen className="w-16 h-16 text-gray-300 mb-4" /><p className="text-gray-500 text-lg font-medium mb-1">Aucune matière sélectionnée</p>
// // //               <button onClick={openModal} className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium text-sm"><Plus className="w-4 h-4" /> Ajouter des matières</button>
// // //             </div>
// // //           ) : (
// // //             <div className="divide-y divide-gray-100">
// // //               {selectedMatieres.map(matiereId => {
// // //                 const matiere = matieres.find(m => m.id === matiereId)
// // //                 return (
// // //                   <div key={matiereId} className="p-4 hover:bg-gray-50/50 transition-colors group">
// // //                     <div className="flex items-center gap-4">
// // //                       <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center"><BookOpen className="w-5 h-5 text-blue-600" /></div>
// // //                       <div className="flex-1 min-w-0"><p className="font-medium text-gray-900 truncate">{matiere?.nom || `Matière #${matiereId}`}</p>{matiere?.niveau && <p className="text-xs text-gray-500 mt-0.5">🎯 {matiere.niveau}</p>}</div>
// // //                       <button onClick={() => handleMatiereToggle(matiereId)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
// // //                     </div>
// // //                   </div>
// // //                 )
// // //               })}
// // //             </div>
// // //           )}
// // //         </div>
// // //       )}

// // //       {/* ========== ONGLET CONTRATS ========== */}
// // //       {activeTab === 'contrats' && (
// // //         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
// // //           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
// // //             <div><h3 className="font-semibold text-gray-900 flex items-center gap-2"><FileText className="w-5 h-5 text-gray-700" />Mes contrats</h3><p className="text-sm text-gray-500 mt-0.5">{contrats.length} contrat{contrats.length > 1 ? 's' : ''}</p></div>
// // //             <button onClick={loadContrats} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> Actualiser</button>
// // //           </div>
// // //           {loadingContrats ? <div className="flex items-center justify-center py-16"><Loader /></div> : contrats.length === 0 ? (
// // //             <div className="flex flex-col items-center justify-center py-16 px-6"><FileText className="w-16 h-16 text-gray-300 mb-4" /><p className="text-gray-500 text-lg font-medium mb-1">Aucun contrat</p></div>
// // //           ) : (
// // //             <div className="divide-y divide-gray-100">
// // //               {contrats.map((contrat) => (
// // //                 <div key={contrat.id} className="p-4 hover:bg-gray-50/50 transition-colors group">
// // //                   <div className="flex items-start gap-4">
// // //                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getContratStatutColor(contrat.statut)}`}><FileText className="w-5 h-5" /></div>
// // //                     <div className="flex-1 min-w-0">
// // //                       <div className="flex items-center gap-2 mb-1">
// // //                         <p className="font-medium text-gray-900">{contrat.titre}</p>
// // //                         <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getContratStatutColor(contrat.statut)}`}>{getStatutIcon(contrat.statut)}{contrat.statut.replace('_', ' ')}</span>
// // //                       </div>
// // //                       <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
// // //                         <span>{contrat.matiere} • {contrat.niveau}</span><span>•</span><span>{getFrequenceLabel(contrat.frequence)}</span><span>•</span>
// // //                         <span className="text-green-600 font-medium">{contrat.tarif_final?.toLocaleString()} FC/h</span><span>•</span><span>{getDureeLabel(contrat.duree)}</span>
// // //                       </div>
// // //                       <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
// // //                         <span>Début: {formatDate(contrat.date_debut)}</span>
// // //                         {contrat.parent?.user && <><span>•</span><span className="flex items-center gap-1"><User className="w-3 h-3" /> {contrat.parent.user.username}</span></>}
// // //                       </div>
// // //                     </div>
// // //                     <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
// // //                       {(contrat.statut === 'actif' || contrat.statut === 'accepte') && (
// // //                         <button onClick={() => openCreateSession(contrat)} className="p-2 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all" title="Planifier une session"><Calendar className="w-4 h-4" /></button>
// // //                       )}
// // //                       <button onClick={() => openNegotiation(contrat)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Négocier"><MessageSquare className="w-4 h-4" /></button>
// // //                       {contrat.statut === 'en_attente' && (
// // //                         <>
// // //                           <button onClick={() => handleContractStatusChange(contrat.id, 'accepte')} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"><Check className="w-4 h-4" /></button>
// // //                           <button onClick={() => handleContractStatusChange(contrat.id, 'refuse')} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><X className="w-4 h-4" /></button>
// // //                         </>
// // //                       )}
// // //                       {contrat.statut === 'accepte' && <button onClick={() => handleContractStatusChange(contrat.id, 'actif')} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"><Play className="w-4 h-4" /></button>}
// // //                       {contrat.statut === 'actif' && (
// // //                         <>
// // //                           <button onClick={() => handleContractStatusChange(contrat.id, 'termine')} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Check className="w-4 h-4" /></button>
// // //                           <button onClick={() => handleContractStatusChange(contrat.id, 'annule')} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Ban className="w-4 h-4" /></button>
// // //                         </>
// // //                       )}
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           )}
// // //         </div>
// // //       )}

// // //       {/* ========== ONGLET SESSIONS ========== */}
// // //       {activeTab === 'sessions' && (
// // //         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
// // //           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
// // //             <div><h3 className="font-semibold text-gray-900 flex items-center gap-2"><Calendar className="w-5 h-5 text-gray-700" />Mes sessions</h3><p className="text-sm text-gray-500 mt-0.5">{sessions.length} session{sessions.length > 1 ? 's' : ''} • {sessionsPlanifiees} à venir • {sessionsTerminees} terminée{sessionsTerminees > 1 ? 's' : ''}</p></div>
// // //             <button onClick={loadSessions} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> Actualiser</button>
// // //           </div>
// // //           {loadingSessions ? <div className="flex items-center justify-center py-16"><Loader /></div> : sessions.length === 0 ? (
// // //             <div className="flex flex-col items-center justify-center py-16 px-6"><Calendar className="w-16 h-16 text-gray-300 mb-4" /><p className="text-gray-500 text-lg font-medium mb-1">Aucune session</p></div>
// // //           ) : (
// // //             <div className="divide-y divide-gray-100">
// // //               {sessions.filter(s => s.statut === 'planifie' || s.statut === 'en_cours').length > 0 && (
// // //                 <div className="px-6 py-3 bg-blue-50/50"><p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">📅 Sessions à venir</p></div>
// // //               )}
// // //               {sessions.filter(s => s.statut === 'planifie' || s.statut === 'en_cours').sort((a, b) => new Date(a.date_session).getTime() - new Date(b.date_session).getTime()).map((session) => (
// // //                 <div key={session.id} className="p-4 hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => openSessionDetail(session)}>
// // //                   <div className="flex items-start gap-4">
// // //                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getSessionStatutColor(session.statut)}`}><Calendar className="w-5 h-5" /></div>
// // //                     <div className="flex-1 min-w-0">
// // //                       <div className="flex items-center gap-2 mb-1">
// // //                         <p className="font-medium text-gray-900">{session.matiere?.nom || 'Session'}{session.eleve && <span className="text-gray-500 font-normal"> - {session.eleve.prenom} {session.eleve.nom}</span>}</p>
// // //                         <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getSessionStatutColor(session.statut)}`}>{getStatutIcon(session.statut)}{session.statut.replace('_', ' ')}</span>
// // //                       </div>
// // //                       <p className="text-sm text-gray-600 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDateLong(session.date_session)}</p>
// // //                       <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500">
// // //                         <span><Clock className="w-3 h-3 inline mr-1" />{session.heure_debut?.slice(0, 5)} - {session.heure_fin?.slice(0, 5)}</span><span>•</span><span>{session.duree_minutes} min</span>
// // //                         {session.files_count ? <><span>•</span><span>{session.files_count} fichier{session.files_count > 1 ? 's' : ''}</span></> : null}
// // //                       </div>
// // //                     </div>
// // //                     <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
// // //                       {session.statut === 'planifie' && <><button onClick={() => handleSessionStatusChange(session.id, 'en_cours')} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Play className="w-4 h-4" /></button><button onClick={() => handleSessionStatusChange(session.id, 'annule')} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><X className="w-4 h-4" /></button></>}
// // //                       {session.statut === 'en_cours' && <button onClick={() => handleSessionStatusChange(session.id, 'termine')} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"><StopCircle className="w-4 h-4" /></button>}
// // //                       <button onClick={() => openSessionDetail(session)} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"><Eye className="w-4 h-4" /></button>
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           )}
// // //         </div>
// // //       )}

// // //       {/* ========== ONGLET CANDIDATURES (envoyées) ========== */}
// // //       {activeTab === 'candidatures' && (
// // //         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
// // //           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
// // //             <div><h3 className="font-semibold text-gray-900 flex items-center gap-2"><Send className="w-5 h-5 text-gray-700" />Mes candidatures envoyées</h3><p className="text-sm text-gray-500 mt-0.5">{candidatures.length} candidature{candidatures.length > 1 ? 's' : ''}</p></div>
// // //             <div className="flex gap-2">
// // //               <button onClick={loadCandidatures} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> Actualiser</button>
// // //               <Link href="/solicitation" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-md"><Search className="w-4 h-4" /> Voir les services</Link>
// // //             </div>
// // //           </div>
// // //           {loadingCandidatures ? <div className="flex items-center justify-center py-16"><Loader /></div> : candidatures.length === 0 ? (
// // //             <div className="flex flex-col items-center justify-center py-16 px-6"><Send className="w-16 h-16 text-gray-300 mb-4" /><p className="text-gray-500 text-lg font-medium mb-1">Aucune candidature envoyée</p><Link href="/solicitation" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 font-medium text-sm shadow-md"><Search className="w-4 h-4" /> Découvrir les services</Link></div>
// // //           ) : (
// // //             <div className="divide-y divide-gray-100">
// // //               {candidatures.map((candidature) => (
// // //                 <div key={candidature.id} className="p-4 hover:bg-gray-50/50 transition-colors">
// // //                   <div className="flex items-start gap-4">
// // //                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getCandidatureStatutColor(candidature.statut)}`}><Send className="w-5 h-5" /></div>
// // //                     <div className="flex-1 min-w-0">
// // //                       <div className="flex items-center gap-2 mb-1">
// // //                         <p className="font-medium text-gray-900">{candidature.service_parent?.titre || `Service #${candidature.service_parent_id}`}</p>
// // //                         <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getCandidatureStatutColor(candidature.statut)}`}>
// // //                           {candidature.statut === 'en_attente' && <><Clock className="w-3 h-3" /> En attente</>}
// // //                           {candidature.statut === 'accepte' && <><Check className="w-3 h-3" /> Acceptée</>}
// // //                           {candidature.statut === 'refuse' && <><X className="w-3 h-3" /> Refusée</>}
// // //                         </span>
// // //                       </div>
// // //                       <p className="text-sm text-gray-600 line-clamp-2 mb-2">{candidature.message}</p>
// // //                       <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
// // //                         {candidature.tarif_propose && <span className="flex items-center gap-1 text-green-600 font-medium"><DollarSign className="w-3 h-3" /> {candidature.tarif_propose.toLocaleString()} FC/h</span>}
// // //                         <span>📆 {formatDate(candidature.created_at)}</span>
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           )}
// // //         </div>
// // //       )}

// // //       {/* ========== 🆕 ONGLET CANDIDATURES REÇUES (parents → mes services) ========== */}
// // //       {activeTab === 'candidatures-recues' && (
// // //         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
// // //           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
// // //             <div><h3 className="font-semibold text-gray-900 flex items-center gap-2"><UserCheck className="w-5 h-5 text-gray-700" />Candidatures reçues</h3><p className="text-sm text-gray-500 mt-0.5">{candidaturesRecues.length} candidature{candidaturesRecues.length > 1 ? 's' : ''} reçue{candidaturesRecues.length > 1 ? 's' : ''}</p></div>
// // //             <button onClick={loadCandidaturesRecues} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> Actualiser</button>
// // //           </div>
// // //           {loadingCandidaturesRecues ? <div className="flex items-center justify-center py-16"><Loader /></div> : candidaturesRecues.length === 0 ? (
// // //             <div className="flex flex-col items-center justify-center py-16 px-6"><UserCheck className="w-16 h-16 text-gray-300 mb-4" /><p className="text-gray-500 text-lg font-medium mb-1">Aucune candidature reçue</p><p className="text-gray-400 text-sm">Les parents pourront postuler à vos services</p></div>
// // //           ) : (
// // //             <div className="divide-y divide-gray-100">
// // //               {candidaturesRecues.map((candidature) => (
// // //                 <div key={candidature.id} className="p-4 hover:bg-gray-50/50 transition-colors">
// // //                   <div className="flex items-start gap-4">
// // //                     <div className="flex-shrink-0">
// // //                       {candidature.parent?.user?.photo_profil ? (
// // //                         <img src={getPhotoUrl(candidature.parent.user.photo_profil) || ''} alt="" className="w-10 h-10 rounded-full object-cover" />
// // //                       ) : (
// // //                         <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"><User className="w-5 h-5 text-gray-400" /></div>
// // //                       )}
// // //                     </div>
// // //                     <div className="flex-1 min-w-0">
// // //                       <div className="flex items-center gap-2 mb-1">
// // //                         <p className="font-medium text-gray-900">{candidature.parent?.user?.username || 'Parent'}</p>
// // //                         <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getCandidatureStatutColor(candidature.statut)}`}>
// // //                           {candidature.statut === 'en_attente' && <><Clock className="w-3 h-3" /> En attente</>}
// // //                           {candidature.statut === 'accepte' && <><Check className="w-3 h-3" /> Acceptée</>}
// // //                           {candidature.statut === 'refuse' && <><X className="w-3 h-3" /> Refusée</>}
// // //                         </span>
// // //                       </div>
// // //                       <p className="text-xs text-gray-500">Service : {candidature.service?.titre || 'N/A'}</p>
// // //                       {candidature.eleve && <p className="text-xs text-gray-500">Élève : {candidature.eleve.prenom} {candidature.eleve.nom} • {candidature.eleve.niveau}</p>}
// // //                       <p className="text-sm text-gray-600 mt-2 line-clamp-2">{candidature.message}</p>
// // //                       <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
// // //                         {candidature.tarif_propose && <span className="flex items-center gap-1 text-green-600 font-medium"><DollarSign className="w-3 h-3" /> {candidature.tarif_propose.toLocaleString()} FC/h</span>}
// // //                         <span>📆 {formatDate(candidature.created_at)}</span>
// // //                       </div>
// // //                     </div>
// // //                     {candidature.statut === 'en_attente' && (
// // //                       <div className="flex items-center gap-1 flex-shrink-0">
// // //                         <button onClick={() => openContratModal(candidature)} className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 flex items-center gap-1"><FileText className="w-3 h-3" /> Contrat</button>
// // //                         <button onClick={() => handleCandidatureStatus(candidature.id, 'accepte')} className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"><Check className="w-4 h-4" /></button>
// // //                         <button onClick={() => handleCandidatureStatus(candidature.id, 'refuse')} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><X className="w-4 h-4" /></button>
// // //                       </div>
// // //                     )}
// // //                   </div>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           )}
// // //         </div>
// // //       )}

// // //       {/* ========== ONGLET DOCUMENTS ========== */}
// // //       {activeTab === 'documents' && (
// // //         <div className="bg-white rounded-2xl p-6"><ListeDocuments refresh={refreshDocs} onRefresh={() => setRefreshDocs(prev => prev + 1)} /></div>
// // //       )}

// // //       {/* ========== MODALS ========== */}
// // //       <CreateSessionModal contract={selectedContractForSession} isOpen={showCreateSessionModal} onClose={() => setShowCreateSessionModal(false)}
// // //         onSuccess={() => { loadSessions(); loadContrats(); setMessage('✅ Session planifiée avec succès !'); setTimeout(() => setMessage(''), 3000) }}
// // //         onCreating={() => setSaving(true)} onError={() => setSaving(false)} />

// // //       <SessionDetailModal session={selectedSession} isOpen={showSessionModal} onClose={() => setShowSessionModal(false)}
// // //         onStatusChange={handleSessionStatusChange} onNotesUpdate={handleNotesUpdate} />

// // //       {/* Modal Négociation */}
// // //       {showNegotiationModal && selectedContratForNegotiation && (
// // //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
// // //           <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
// // //             <div className="p-6 border-b flex justify-between items-center">
// // //               <div><h2 className="text-xl font-semibold flex items-center gap-2"><MessageSquare className="w-5 h-5 text-blue-600" />Négociation en direct</h2>
// // //                 <div className="flex items-center gap-2 mt-1"><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" /></span><span className="text-xs text-green-600 font-medium">Temps réel actif</span></div></div>
// // //               <button onClick={closeNegotiation} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
// // //             </div>
// // //             <div className="flex-1 overflow-y-auto p-6 space-y-4">
// // //               <div className="bg-blue-50 rounded-xl p-4 mb-4"><p className="text-sm font-medium text-blue-900">{selectedContratForNegotiation.titre}</p><p className="text-xs text-blue-700 mt-1">Tarif actuel : {selectedContratForNegotiation.tarif_final?.toLocaleString()} FC/h • Statut : {selectedContratForNegotiation.statut.replace('_', ' ')}</p></div>
// // //               {negotiationMessages.length === 0 ? <div className="text-center py-8 text-gray-400"><MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" /><p className="text-sm">Aucun message. Commencez la négociation.</p></div> : negotiationMessages.map((msg, index) => (
// // //                 <div key={msg.id || index} className={`flex ${msg.sender === 'precepteur' ? 'justify-end' : 'justify-start'}`}>
// // //                   <div className={`max-w-[80%] p-3 rounded-xl ${msg.sender === 'precepteur' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'}`}>
// // //                     <p className="text-sm">{msg.message}</p>{msg.tarif_propose && <p className="text-xs mt-1 opacity-75">💰 Proposition : {msg.tarif_propose.toLocaleString()} FC/h</p>}<p className="text-xs mt-1 opacity-50">{formatDateTime(msg.created_at)}</p>
// // //                   </div>
// // //                 </div>
// // //               ))}
// // //               <div ref={messagesEndRef} />
// // //             </div>
// // //             <form onSubmit={sendNegotiationMessage} className="p-4 border-t bg-gray-50">
// // //               <div className="flex gap-2">
// // //                 <div className="flex-1 space-y-2">
// // //                   <input type="text" value={negotiationForm.message} onChange={(e) => setNegotiationForm({...negotiationForm, message: e.target.value})} placeholder="Votre message..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" required />
// // //                   <div className="flex items-center gap-2"><label className="text-xs text-gray-500">Contre-proposition (FC/h) :</label><input type="number" value={negotiationForm.tarif_propose} onChange={(e) => setNegotiationForm({...negotiationForm, tarif_propose: Number(e.target.value)})} className="w-32 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" min="0" step="1000" /></div>
// // //                 </div>
// // //                 <button type="submit" disabled={sendingNegotiation} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 self-end">{sendingNegotiation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}</button>
// // //               </div>
// // //             </form>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* 🆕 Modal Création Contrat depuis Candidature Parent */}
// // //       {showContratModal && selectedCandidature && (
// // //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
// // //           <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
// // //             <div className="p-6 border-b flex justify-between items-center">
// // //               <h2 className="text-xl font-semibold flex items-center gap-2"><FileText className="w-5 h-5 text-green-600" />Créer un contrat</h2>
// // //               <button onClick={() => setShowContratModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
// // //             </div>
// // //             <form onSubmit={handleCreateContrat} className="p-6 space-y-4">
// // //               <div className="bg-blue-50 rounded-xl p-4">
// // //                 <p className="text-sm font-medium text-blue-900">{selectedCandidature.service?.titre || 'Service'}</p>
// // //                 <p className="text-xs text-blue-700 mt-1">Parent : {selectedCandidature.parent?.user?.username} • {selectedCandidature.tarif_propose ? `${selectedCandidature.tarif_propose.toLocaleString()} FC/h` : ''}</p>
// // //                 {selectedCandidature.eleve && <p className="text-xs text-blue-700">Élève : {selectedCandidature.eleve.prenom} {selectedCandidature.eleve.nom} • {selectedCandidature.eleve.niveau}</p>}
// // //               </div>
// // //               <div><label className="block text-sm font-medium text-gray-700 mb-1">Date de début *</label><input type="date" value={contratForm.date_debut} onChange={(e) => setContratForm({...contratForm, date_debut: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" /></div>
// // //               <div><label className="block text-sm font-medium text-gray-700 mb-1">Durée *</label><select value={contratForm.duree} onChange={(e) => setContratForm({...contratForm, duree: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"><option value="1_mois">1 mois</option><option value="3_mois">3 mois</option><option value="6_mois">6 mois</option><option value="12_mois">1 an</option><option value="indetermine">Indéterminée</option></select></div>
// // //               <div><label className="block text-sm font-medium text-gray-700 mb-1">Tarif final (FC/h) *</label><input type="number" value={contratForm.tarif_final} onChange={(e) => setContratForm({...contratForm, tarif_final: Number(e.target.value)})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" min="0" step="1000" /></div>
// // //               <div><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label><textarea value={contratForm.notes} onChange={(e) => setContratForm({...contratForm, notes: e.target.value})} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" /></div>
// // //               <div className="flex gap-2 pt-2">
// // //                 <button type="button" onClick={() => setShowContratModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">Annuler</button>
// // //                 <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}Créer le contrat</button>
// // //               </div>
// // //             </form>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Modal Profil */}
// // //       {showModal && <ProfilModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={handleSave} initialData={form} selectedMatieres={selectedMatieres} onMatieresChange={setSelectedMatieres} saving={saving} />}
// // //     </div>
// // //   )
// // // }

// // // app/dashboard/precepteur/page.tsx
// // 'use client'
// // import { useRouter } from 'next/navigation'
// // import UploadDocument from '@/components/UploadDocument'
// // import ServiceManager from '@/components/ServiceManager'
// // import ListeDocuments from '@/components/ListeDocuments'
// // import ProfilModal from '@/components/ProfilModal'
// // import { useAuth } from '@/context/AuthContext'
// // import CreateSessionModal from './CreateSessionModal'
// // import SessionDetailModal from './SessionDetailModal'
// // import { updateProfilePhoto, updatePrecepteurDisponibility } from '@/actions/auth'
// // import { updatePrecepteurProfil, getPrecepteurMatieres, getContrats, updateContratStatus, updateSessionStatus, updateSessionNotes } from '@/actions/precepteur'
// // import { getSessions, getSessionsByContract } from '@/lib/session-api'
// // import { useState, useEffect, useCallback, useRef } from 'react'
// // import Link from 'next/link'
// // import { 
// //   User, MapPin, Star, Clock, BookOpen, GraduationCap, Calendar, 
// //   Edit3, Check, X, Upload, Plus, Trash2, Eye, AlertCircle, 
// //   ChevronDown, Filter, Play, StopCircle, Ban, RotateCcw, FileText, 
// //   Users, Tag, Phone, Mail, Building, CreditCard, Search, Hash, MessageSquare, 
// //   Activity, RefreshCw, Send, Loader2, DollarSign, Video, UserCheck
// // } from 'lucide-react'
// // import { PiBookOpen, PiPlus, PiTrash } from 'react-icons/pi'
// // import Loader from '@/components/Loader'
// // import { CheckBadgeIcon } from '@heroicons/react/24/solid'

// // // Types
// // type Contrat = {
// //   id: string
// //   service_parent_id?: string
// //   service_precepteur_id?: string
// //   parent_id: string
// //   precepteur_id: number
// //   eleve_id?: string
// //   titre: string
// //   matiere: string | null
// //   niveau: string
// //   frequence: string
// //   lieu: string
// //   date_debut: string
// //   duree: string
// //   tarif_final: number
// //   notes: string | null
// //   statut: 'en_attente' | 'accepte' | 'refuse' | 'actif' | 'termine' | 'annule'
// //   created_at: string
// //   updated_at: string
// //   parent?: any
// //   eleve?: any
// //   matiere_obj?: any
// //   sessions?: Session[] | null
// // }

// // type Session = {
// //   id: number
// //   contract_id: number
// //   date_session: string
// //   heure_debut: string
// //   heure_fin: string
// //   duree_minutes: number
// //   statut: 'planifie' | 'en_cours' | 'termine' | 'annule' | 'reporte'
// //   type_session: 'presentiel' | 'en_ligne' | 'hybride'
// //   lieu: string | null
// //   lien_visio: string | null
// //   notes_precepteur: string | null
// //   notes_parent: string | null
// //   feedback_precepteur: string | null
// //   feedback_parent: string | null
// //   note_session: number | null
// //   raison_annulation: string | null
// //   annule_par: string | null
// //   created_at: string
// //   contrat?: any
// //   eleve?: any
// //   matiere?: any
// //   files?: any[]
// //   grades?: any[]
// //   files_count?: number
// //   grades_count?: number
// // }

// // type NegotiationMessage = {
// //   id: string
// //   contract_id: string
// //   sender_id: string
// //   sender: 'parent' | 'precepteur'
// //   message: string
// //   tarif_propose: number | null
// //   created_at: string
// // }

// // // Candidature du précepteur vers un service parent
// // type CandidaturePrecepteur = {
// //   id: string
// //   service_parent_id: string
// //   precepteur_id: number
// //   message: string
// //   tarif_propose: number | null
// //   disponibilites: string | null
// //   statut: 'en_attente' | 'accepte' | 'refuse'
// //   created_at: string
// //   service_parent?: any
// // }

// // // Candidature d'un parent vers un service du précepteur
// // type CandidatureParent = {
// //   id: string
// //   service_precepteur_id: string
// //   parent_id: string
// //   eleve_id: string
// //   message: string
// //   tarif_propose: number | null
// //   statut: 'en_attente' | 'accepte' | 'refuse'
// //   created_at: string
// //   service?: any
// //   parent?: any
// //   eleve?: any
// // }

// // interface ProfilForm {
// //   latitude: string
// //   longitude: string
// //   commune: string
// //   quartier: string
// //   annees_experience: number
// //   diplome: string
// //   etablissement_origine: string
// //   telephone: string
// // }

// // const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
// // const POLLING_INTERVAL = 3000

// // export default function PrecepteurDashboard() {
// //   const router = useRouter()
// //   const { user, precepteurInfo, refreshPrecepteurInfo, updateUser } = useAuth()
  
// //   // États principaux
// //   const [uploading, setUploading] = useState(false)
// //   const [saving, setSaving] = useState(false)
// //   const [message, setMessage] = useState('')
// //   const [loading, setLoading] = useState(true)
// //   const [activeTab, setActiveTab] = useState('profil')
// //   const [showModal, setShowModal] = useState(false)
// //   const [refreshDocs, setRefreshDocs] = useState(0)
  
// //   // États contrats
// //   const [contrats, setContrats] = useState<Contrat[]>([])
// //   const [loadingContrats, setLoadingContrats] = useState(false)
  
// //   // États sessions
// //   const [sessions, setSessions] = useState<Session[]>([])
// //   const [loadingSessions, setLoadingSessions] = useState(false)
// //   const [selectedSession, setSelectedSession] = useState<Session | null>(null)
// //   const [showSessionModal, setShowSessionModal] = useState(false)
// //   const [selectedContractForSession, setSelectedContractForSession] = useState<Contrat | null>(null)
// //   const [showCreateSessionModal, setShowCreateSessionModal] = useState(false)
  
// //   // États négociation
// //   const [showNegotiationModal, setShowNegotiationModal] = useState(false)
// //   const [selectedContratForNegotiation, setSelectedContratForNegotiation] = useState<Contrat | null>(null)
// //   const [negotiationForm, setNegotiationForm] = useState({ message: '', tarif_propose: 0 })
// //   const [negotiationMessages, setNegotiationMessages] = useState<NegotiationMessage[]>([])
// //   const [sendingNegotiation, setSendingNegotiation] = useState(false)
  
// //   // États matières
// //   const [matieres, setMatieres] = useState<any[]>([])
// //   const [selectedMatieres, setSelectedMatieres] = useState<number[]>([])
  
// //   // États candidatures (précepteur → services parents)
// //   const [candidatures, setCandidatures] = useState<CandidaturePrecepteur[]>([])
// //   const [loadingCandidatures, setLoadingCandidatures] = useState(false)
  
// //   // 🆕 États candidatures reçues (parents → mes services)
// //   const [candidaturesRecues, setCandidaturesRecues] = useState<CandidatureParent[]>([])
// //   const [loadingCandidaturesRecues, setLoadingCandidaturesRecues] = useState(false)
  
// //   // 🆕 Modal création contrat depuis candidature parent
// //   const [showContratModal, setShowContratModal] = useState(false)
// //   const [selectedCandidature, setSelectedCandidature] = useState<CandidatureParent | null>(null)
// //   const [contratForm, setContratForm] = useState({ date_debut: '', duree: '1_mois', tarif_final: 0, notes: '' })
  
// //   // États formulaire profil
// //   const [form, setForm] = useState<ProfilForm>({
// //     latitude: '', longitude: '', commune: '', quartier: '',
// //     annees_experience: 0, diplome: '', etablissement_origine: '', telephone: ''
// //   })
  
// //   const [disponible, setDisponible] = useState(precepteurInfo?.disponible ?? true)

// //   const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
// //   const messagesEndRef = useRef<HTMLDivElement>(null)

// //   // ============ INITIALISATION ============
// //   useEffect(() => {
// //     let isMounted = true
// //     const initializeData = async () => {
// //       if (!user) { setLoading(false); return }
// //       if (!precepteurInfo) await refreshPrecepteurInfo()
// //       if (!isMounted) return
// //       if (precepteurInfo) {
// //         setForm({
// //           latitude: precepteurInfo.latitude?.toString() || '',
// //           longitude: precepteurInfo.longitude?.toString() || '',
// //           commune: precepteurInfo.commune || '',
// //           quartier: precepteurInfo.quartier || '',
// //           annees_experience: precepteurInfo.annees_experience || 0,
// //           diplome: precepteurInfo.diplome || '',
// //           telephone: precepteurInfo.telephone || '',
// //           etablissement_origine: precepteurInfo.etablissement_origine || ''
// //         })
// //         setDisponible(precepteurInfo.disponible ?? true)
// //         if (precepteurInfo.precepteur_matieres) {
// //           setSelectedMatieres(precepteurInfo.precepteur_matieres.map((pm: any) => pm.matiere_id))
// //         }
// //         await Promise.all([loadContrats(), loadMatieres(), loadCandidatures(), loadCandidaturesRecues(), loadSessions()])
// //       }
// //       if (isMounted) setLoading(false)
// //     }
// //     initializeData()
// //     return () => { isMounted = false }
// //   }, [user?.id, precepteurInfo?.id])

// //   useEffect(() => {
// //     return () => { if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current) }
// //   }, [])

// //   useEffect(() => {
// //     if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
// //   }, [negotiationMessages])

// //   // ============ CHARGEMENT ============
// //   const loadSessions = useCallback(async () => {
// //     setLoadingSessions(true)
// //     try { const data = await getSessions(); setSessions(data.sessions || []) }
// //     catch (error) { console.error('❌ Erreur chargement sessions:', error) }
// //     finally { setLoadingSessions(false) }
// //   }, [])

// //   const loadNegotiationMessages = async (contratId: string) => {
// //     try {
// //       const token = localStorage.getItem('excellence-token')
// //       if (!token) return
// //       const response = await fetch(`${API_URL}/auth/contracts/${contratId}/negotiations`, {
// //         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
// //       })
// //       if (response.ok) { const data = await response.json(); setNegotiationMessages(data.messages || []) }
// //     } catch (error) { console.error('❌ Erreur chargement négociations:', error) }
// //   }

// //   const startNegotiationPolling = (contratId: string) => {
// //     if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current)
// //     loadNegotiationMessages(contratId)
// //     pollingIntervalRef.current = setInterval(() => loadNegotiationMessages(contratId), POLLING_INTERVAL)
// //   }

// //   const stopNegotiationPolling = () => {
// //     if (pollingIntervalRef.current) { clearInterval(pollingIntervalRef.current); pollingIntervalRef.current = null }
// //   }

// //   const loadContrats = useCallback(async () => {
// //     if (!precepteurInfo) return
// //     setLoadingContrats(true)
// //     try {
// //       const token = localStorage.getItem('excellence-token')
// //       if (!token) return
// //       const response = await fetch(`${API_URL}/auth/contracts`, {
// //         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
// //       })
// //       const data = await response.json()
// //       if (data.success) setContrats(data.contrats || [])
// //     } catch (error) { console.error('❌ Erreur chargement contrats:', error) }
// //     finally { setLoadingContrats(false) }
// //   }, [precepteurInfo])

// //   const loadMatieres = async () => {
// //     try {
// //       const result = await getPrecepteurMatieres()
// //       if (result.success) setMatieres(result.matieres || [])
// //     } catch (error) { console.error('❌ Erreur chargement matières:', error) }
// //   }

// //   // 🆕 Charger mes candidatures envoyées (précepteur → services parents)
// //   const loadCandidatures = async () => {
// //     if (!precepteurInfo) return
// //     setLoadingCandidatures(true)
// //     try {
// //       const token = localStorage.getItem('excellence-token')
// //       if (!token) return
// //       const response = await fetch(`${API_URL}/auth/candidatures/mes-candidatures`, {
// //         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
// //       })
// //       if (response.ok) {
// //         const data = await response.json()
// //         if (data.success) setCandidatures(data.candidatures || [])
// //       }
// //     } catch (error) { console.error('❌ Erreur chargement candidatures:', error) }
// //     finally { setLoadingCandidatures(false) }
// //   }

// //   // 🆕 Charger les candidatures reçues (parents → mes services)
// //   const loadCandidaturesRecues = async () => {
// //     if (!precepteurInfo) return
// //     setLoadingCandidaturesRecues(true)
// //     try {
// //       const token = localStorage.getItem('excellence-token')
// //       if (!token) return
// //       const response = await fetch(`${API_URL}/auth/precepteur/candidatures`, {
// //         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
// //       })
// //       if (response.ok) {
// //         const data = await response.json()
// //         if (data.success) setCandidaturesRecues(data.candidatures || [])
// //       }
// //     } catch (error) { console.error('❌ Erreur chargement candidatures reçues:', error) }
// //     finally { setLoadingCandidaturesRecues(false) }
// //   }

// //   // ============ GESTION SESSIONS ============
// //   const handleSessionStatusChange = async (sessionId: number, newStatus: string) => {
// //     try {
// //       await updateSessionStatus(sessionId, newStatus)
// //       setMessage(`✅ Session ${newStatus.replace('_', ' ')} avec succès`)
// //       await loadSessions()
// //       setTimeout(() => setMessage(''), 3000)
// //     } catch (error) { setMessage('Erreur lors du changement de statut') }
// //   }

// //   const handleNotesUpdate = async (sessionId: number, notes: string) => {
// //     try {
// //       await updateSessionNotes(sessionId, notes)
// //       setMessage('✅ Notes sauvegardées avec succès')
// //       await loadSessions()
// //       setTimeout(() => setMessage(''), 3000)
// //     } catch (error) { setMessage('Erreur lors de la sauvegarde des notes') }
// //   }

// //   const openSessionDetail = (session: Session) => { setSelectedSession(session); setShowSessionModal(true) }
// //   const openCreateSession = (contrat: Contrat) => { setSelectedContractForSession(contrat); setShowCreateSessionModal(true) }

// //   // ============ GESTION CONTRATS ============
// //   const handleContractStatusChange = async (contratId: string, newStatus: string) => {
// //     try {
// //       const token = localStorage.getItem('excellence-token')
// //       if (!token) return
// //       const response = await fetch(`${API_URL}/auth/contracts/${contratId}/status`, {
// //         method: 'PATCH',
// //         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
// //         body: JSON.stringify({ statut: newStatus })
// //       })
// //       if (response.ok) {
// //         setMessage(`✅ Contrat ${newStatus.replace('_', ' ')} avec succès`)
// //         setTimeout(() => setMessage(''), 3000)
// //         loadContrats()
// //       }
// //     } catch (error) { console.error('❌ Erreur changement statut contrat:', error) }
// //   }

// //   // 🆕 Gestion candidatures reçues
// //   const handleCandidatureStatus = async (candidatureId: string, newStatus: string) => {
// //     try {
// //       const token = localStorage.getItem('excellence-token')
// //       if (!token) return
// //       const response = await fetch(`${API_URL}/auth/parent/candidatures/${candidatureId}/status`, {
// //         method: 'PUT',
// //         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
// //         body: JSON.stringify({ statut: newStatus })
// //       })
// //       if (response.ok) {
// //         setMessage(`✅ Candidature ${newStatus === 'accepte' ? 'acceptée' : 'refusée'}`)
// //         loadCandidaturesRecues()
// //         setTimeout(() => setMessage(''), 3000)
// //       }
// //     } catch (error) { console.error('❌ Erreur statut candidature:', error) }
// //   }

// //   // 🆕 Ouvrir le modal de création de contrat
// //   const openContratModal = (candidature: CandidatureParent) => {
// //     setSelectedCandidature(candidature)
// //     setContratForm({
// //       date_debut: new Date().toISOString().split('T')[0],
// //       duree: '1_mois',
// //       tarif_final: candidature.tarif_propose || candidature.service?.tarif_horaire || 0,
// //       notes: ''
// //     })
// //     setShowContratModal(true)
// //   }

// //   // 🆕 Créer un contrat depuis une candidature parent
// //   const handleCreateContrat = async (e: React.FormEvent) => {
// //     e.preventDefault()
// //     setSaving(true)
// //     try {
// //       const token = localStorage.getItem('excellence-token')
// //       if (!token) return
// //       const response = await fetch(`${API_URL}/auth/parent/candidatures/${selectedCandidature?.id}/contrat`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
// //         body: JSON.stringify(contratForm)
// //       })
// //       const data = await response.json()
// //       if (response.ok) {
// //         setMessage('✅ Contrat créé avec succès !')
// //         setShowContratModal(false)
// //         loadContrats()
// //         loadCandidaturesRecues()
// //       } else {
// //         setMessage(data.error || 'Erreur lors de la création du contrat')
// //       }
// //     } catch (error) { console.error('❌ Erreur création contrat:', error) }
// //     finally { setSaving(false); setTimeout(() => setMessage(''), 3000) }
// //   }

// //   // ============ GESTION NÉGOCIATION ============
// //   const openNegotiation = async (contrat: Contrat) => {
// //     setSelectedContratForNegotiation(contrat)
// //     setNegotiationForm({ message: '', tarif_propose: contrat.tarif_final })
// //     startNegotiationPolling(contrat.id)
// //     setShowNegotiationModal(true)
// //   }

// //   const closeNegotiation = () => { stopNegotiationPolling(); setShowNegotiationModal(false); setSelectedContratForNegotiation(null) }

// //   const sendNegotiationMessage = async (e: React.FormEvent) => {
// //     e.preventDefault()
// //     setSendingNegotiation(true)
// //     try {
// //       const token = localStorage.getItem('excellence-token')
// //       if (!token) throw new Error('Non connecté')
// //       const response = await fetch(`${API_URL}/auth/contracts/${selectedContratForNegotiation?.id}/negotiations`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
// //         body: JSON.stringify({ message: negotiationForm.message, tarif_propose: negotiationForm.tarif_propose })
// //       })
// //       if (response.ok && selectedContratForNegotiation) {
// //         await loadNegotiationMessages(selectedContratForNegotiation.id)
// //         setNegotiationForm({ ...negotiationForm, message: '' })
// //       }
// //     } catch (error) { console.error('❌ Erreur envoi message:', error) }
// //     finally { setSendingNegotiation(false) }
// //   }

// //   // ============ GESTION PROFIL ============
// //   const handleSave = async (data: ProfilForm & { matieres: number[] }) => {
// //     setSaving(true); setMessage('')
// //     try {
// //       const result = await updatePrecepteurProfil({
// //         latitude: data.latitude || undefined, longitude: data.longitude || undefined,
// //         commune: data.commune || undefined, quartier: data.quartier || undefined,
// //         annees_experience: data.annees_experience || 0, diplome: data.diplome || undefined,
// //         etablissement_origine: data.etablissement_origine || undefined,
// //         telephone: data.telephone || undefined, matieres: data.matieres
// //       })
// //       if (result.success) { setShowModal(false); setMessage('✅ Profil mis à jour avec succès !'); await refreshPrecepteurInfo() }
// //       else setMessage(result.error || 'Erreur lors de la mise à jour')
// //     } catch (error) { setMessage('Erreur lors de la mise à jour du profil') }
// //     finally { setSaving(false); setTimeout(() => setMessage(''), 3000) }
// //   }

// //   const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = e.target.files?.[0]
// //     if (!file) return
// //     if (file.size > 5 * 1024 * 1024) { setMessage('Image trop volumineuse. Maximum 5MB.'); setTimeout(() => setMessage(''), 3000); return }
// //     setUploading(true)
// //     try {
// //       const result = await updateProfilePhoto(file)
// //       if (result.success && result.photoUrl) { updateUser({ photo_profil: result.photoUrl }); setMessage('Photo mise à jour avec succès') }
// //       else setMessage(result.error || 'Erreur lors de la mise à jour')
// //     } catch (error) { setMessage('Erreur lors de l\'upload de la photo') }
// //     finally { setUploading(false); setTimeout(() => setMessage(''), 3000) }
// //   }

// //   const toggleDisponible = async () => {
// //     const newDisponible = !disponible; setDisponible(newDisponible)
// //     try {
// //       const result = await updatePrecepteurDisponibility(newDisponible)
// //       if (result.success) await refreshPrecepteurInfo()
// //       else { setDisponible(!newDisponible); setMessage(result.error || 'Erreur lors de la mise à jour') }
// //     } catch (error) { setDisponible(!newDisponible); setMessage('Erreur lors de la mise à jour') }
// //   }

// //   const handleMatiereToggle = (matiereId: number) => {
// //     setSelectedMatieres(prev => prev.includes(matiereId) ? prev.filter(id => id !== matiereId) : [...prev, matiereId])
// //   }

// //   const openModal = () => {
// //     if (precepteurInfo) {
// //       setForm({
// //         latitude: precepteurInfo.latitude?.toString() || '', longitude: precepteurInfo.longitude?.toString() || '',
// //         commune: precepteurInfo.commune || '', quartier: precepteurInfo.quartier || '',
// //         annees_experience: precepteurInfo.annees_experience || 0, diplome: precepteurInfo.diplome || '',
// //         telephone: precepteurInfo.telephone || '', etablissement_origine: precepteurInfo.etablissement_origine || ''
// //       })
// //     }
// //     setShowModal(true)
// //   }

// //   // ============ HELPERS UI ============
// //   const getContratStatutColor = (statut: string) => {
// //     switch (statut) {
// //       case 'en_attente': return 'bg-yellow-100 text-yellow-800'
// //       case 'accepte': return 'bg-blue-100 text-blue-800'
// //       case 'actif': return 'bg-green-100 text-green-800'
// //       case 'refuse': return 'bg-red-100 text-red-800'
// //       case 'termine': return 'bg-gray-100 text-gray-800'
// //       case 'annule': return 'bg-red-100 text-red-800'
// //       default: return 'bg-gray-100 text-gray-800'
// //     }
// //   }

// //   const getCandidatureStatutColor = (statut: string) => {
// //     switch (statut) {
// //       case 'en_attente': return 'bg-yellow-100 text-yellow-800'
// //       case 'accepte': return 'bg-green-100 text-green-800'
// //       case 'refuse': return 'bg-red-100 text-red-800'
// //       default: return 'bg-gray-100 text-gray-800'
// //     }
// //   }

// //   const getSessionStatutColor = (statut: string) => {
// //     switch (statut) {
// //       case 'planifie': return 'bg-blue-100 text-blue-800'
// //       case 'en_cours': return 'bg-yellow-100 text-yellow-800'
// //       case 'termine': return 'bg-green-100 text-green-800'
// //       case 'annule': return 'bg-red-100 text-red-800'
// //       case 'reporte': return 'bg-purple-100 text-purple-800'
// //       default: return 'bg-gray-100 text-gray-800'
// //     }
// //   }

// //   const getStatutIcon = (statut: string) => {
// //     switch (statut) {
// //       case 'planifie': case 'en_attente': return <Clock className="w-4 h-4" />
// //       case 'en_cours': return <Play className="w-4 h-4" />
// //       case 'termine': case 'accepte': case 'actif': return <Check className="w-4 h-4" />
// //       case 'refuse': case 'annule': return <X className="w-4 h-4" />
// //       default: return <AlertCircle className="w-4 h-4" />
// //     }
// //   }

// //   const getFrequenceLabel = (frequence: string) => {
// //     switch (frequence) {
// //       case 'unique': return 'Ponctuel'; case 'hebdomadaire': return 'Hebdomadaire'
// //       case 'bi-hebdomadaire': return '2x/semaine'; case 'mensuel': return 'Mensuel'
// //       default: return frequence
// //     }
// //   }

// //   const getDureeLabel = (duree: string) => {
// //     switch (duree) {
// //       case '1_mois': return '1 mois'; case '3_mois': return '3 mois'
// //       case '6_mois': return '6 mois'; case '12_mois': return '1 an'
// //       case 'indetermine': return 'Indéterminée'; default: return duree
// //     }
// //   }

// //   const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
// //   const formatDateLong = (date: string) => new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
// //   const formatDateTime = (date: string) => new Date(date).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
// //   const getPhotoUrl = (photoPath: string | null | undefined) => {
// //     if (!photoPath) return null
// //     if (photoPath.startsWith('http')) return photoPath
// //     return `${API_URL.replace('/api', '')}${photoPath}`
// //   }

// //   // ============ STATS ============
// //   const contratsActifs = contrats.filter(c => c.statut === 'actif' || c.statut === 'accepte').length
// //   const sessionsPlanifiees = sessions.filter(s => s.statut === 'planifie' || s.statut === 'en_cours').length
// //   const sessionsTerminees = sessions.filter(s => s.statut === 'termine').length

// //   // ============ LOADING ============
// //   if (loading) return <div className='flex items-center justify-center h-screen'><div className='w-20'><Loader/></div></div>
// //   if (!user) return null

// //   // ============ RENDU ============
// //   return (
// //     <div className="max-w-6xl mx-auto px-4 py-8">
// //       {message && (
// //         <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${message.includes('Erreur') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
// //           {message.includes('Erreur') ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <Check className="w-4 h-4 flex-shrink-0" />}
// //           {message}
// //         </div>
// //       )}

// //       {/* Message profil incomplet */}
// //       {precepteurInfo && (!precepteurInfo.commune || !precepteurInfo.quartier || !precepteurInfo.diplome || !precepteurInfo.etablissement_origine || precepteurInfo.annees_experience === 0 || precepteurInfo.statut_verification === 'en_attente' || precepteurInfo.statut_verification === 'rejete') && (
// //         <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
// //           <div className="flex-shrink-0 mt-0.5"><AlertCircle className="w-5 h-5 text-amber-600" /></div>
// //           <div className="flex-1">
// //             <h3 className="text-sm font-semibold text-amber-800 mb-1">
// //               {precepteurInfo.statut_verification === 'rejete' ? 'Votre dossier a été rejeté' : precepteurInfo.statut_verification === 'en_attente' ? 'Votre dossier est en attente de vérification' : 'Profil incomplet'}
// //             </h3>
// //             <p className="text-sm text-amber-700">
// //               {precepteurInfo.statut_verification === 'rejete' ? 'Votre dossier a été rejeté. Veuillez mettre à jour vos informations.' : 'Complétez votre profil pour apparaître dans les recherches.'}
// //             </p>
// //             <button onClick={openModal} className="mt-3 px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2">
// //               <Edit3 className="w-4 h-4" /> Modifier le profil
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       {/* ========== CARD PROFIL ========== */}
// //       <div className="bg-white rounded-2xl mb-6 p-6">
// //         <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
// //           <div className="relative group w-24 h-24 flex-shrink-0 mx-auto md:mx-0">
// //             {user.photo_profil ? (
// //               <img src={getPhotoUrl(user.photo_profil) || ''} alt="" className="w-24 h-24 rounded-full object-cover border-2 border-gray-100"
// //                 onError={(e) => { e.currentTarget.style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex' }} />
// //             ) : null}
// //             <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-2 border-gray-100 ${user.photo_profil ? 'hidden' : 'flex'}`}>
// //               <User className="w-10 h-10 text-blue-400" />
// //             </div>
// //             <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
// //               {uploading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <Upload className="w-5 h-5 text-white" />}
// //               <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
// //             </label>
// //           </div>
// //           <div className="flex-1 text-center md:text-left">
// //             <h1 className="text-2xl font-bold">{user.username}
// //               {precepteurInfo?.statut_verification === 'verifie' && (
// //                 <span className="inline-flex items-center gap-1 ml-2 text-blue-600"><CheckBadgeIcon className="w-5 h-5" /><span className="text-sm font-normal">Vérifié</span></span>
// //               )}
// //             </h1>
// //             <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2 mt-1">
// //               <GraduationCap className="w-4 h-4" /> Précepteur
// //               {selectedMatieres.length > 0 && <span className="text-sm text-gray-500">• {selectedMatieres.length} matière{selectedMatieres.length > 1 ? 's' : ''}</span>}
// //             </p>
// //             <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm text-gray-500">
// //               <MapPin className="w-4 h-4" />
// //               {precepteurInfo?.commune ? <span>{precepteurInfo.commune}{precepteurInfo.quartier ? `, ${precepteurInfo.quartier}` : ''}</span> : <span>Localisation non spécifiée</span>}
// //             </div>
// //             <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
// //               <Star className="w-4 h-4 text-yellow-500" /><span className="text-sm font-medium">{precepteurInfo?.note_moyenne?.toFixed(1) || '0.0'}/5</span>
// //             </div>
// //           </div>
// //           <div className="flex flex-wrap gap-2 justify-center md:justify-start">
// //             <button onClick={toggleDisponible} className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 font-medium ${disponible ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
// //               {disponible ? <><Check className="w-4 h-4" /> Disponible</> : <><X className="w-4 h-4" /> Indisponible</>}
// //             </button>
// //             <Link href="/solicitation" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-md">
// //               <Search className="w-4 h-4" /> Services disponibles
// //             </Link>
// //           </div>
// //         </div>
// //         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
// //           <div className="p-4 bg-blue-50 rounded-xl"><p className="text-2xl font-bold text-blue-600">{selectedMatieres.length}</p><p className="text-sm text-gray-600 flex items-center gap-1"><BookOpen className="w-3 h-3" /> Matières</p></div>
// //           <div className="p-4 bg-green-50 rounded-xl"><p className="text-2xl font-bold text-green-600">{contrats.length}</p><p className="text-sm text-gray-600 flex items-center gap-1"><FileText className="w-3 h-3" /> Contrats</p></div>
// //           <div className="p-4 bg-purple-50 rounded-xl"><p className="text-2xl font-bold text-purple-600">{contratsActifs}</p><p className="text-sm text-gray-600 flex items-center gap-1"><Check className="w-3 h-3" /> Actifs</p></div>
// //           <div className="p-4 bg-cyan-50 rounded-xl"><p className="text-2xl font-bold text-cyan-600">{sessions.length}</p><p className="text-sm text-gray-600 flex items-center gap-1"><Calendar className="w-3 h-3" /> Sessions</p></div>
// //           <div className="p-4 bg-teal-50 rounded-xl"><p className="text-2xl font-bold text-teal-600">{candidatures.length + candidaturesRecues.length}</p><p className="text-sm text-gray-600 flex items-center gap-1"><Send className="w-3 h-3" /> Candidatures</p></div>
// //         </div>
// //       </div>

// //       {/* ========== TABS ========== */}
// //       <div className="flex gap-4 mb-6 overflow-x-auto flex-wrap">
// //         {[
// //           { key: 'profil', icon: User, label: 'Profil' },
// //           { key: 'matieres', icon: BookOpen, label: `Matières (${selectedMatieres.length})` },
// //           { key: 'contrats', icon: FileText, label: `Contrats (${contrats.length})` },
// //           { key: 'sessions', icon: Calendar, label: `Sessions (${sessions.length})` },
// //           { key: 'candidatures', icon: Send, label: `Candidatures (${candidatures.length})` },
// //           { key: 'candidatures-recues', icon: UserCheck, label: `Reçues (${candidaturesRecues.length})` },
// //           { key: 'documents', icon: FileText, label: 'Documents' },
// //         ].map(tab => (
// //           <button key={tab.key} onClick={() => setActiveTab(tab.key)}
// //             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === tab.key ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
// //             <tab.icon className="w-4 h-4" /> {tab.label}
// //           </button>
// //         ))}
// //       </div>

// //       {/* ========== ONGLET PROFIL ========== */}
// //       {activeTab === 'profil' && (
// //         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
// //           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
// //             <div><h3 className="font-semibold text-gray-900 flex items-center gap-2"><User className="w-5 h-5 text-gray-700" />Informations du précepteur</h3><p className="text-sm text-gray-500 mt-0.5">Profil professionnel</p></div>
// //             <button onClick={openModal} className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium"><Edit3 className="w-4 h-4" /> Modifier le profil</button>
// //           </div>
// //           <div className="p-6">
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               {[
// //                 { label: 'Commune', value: precepteurInfo?.commune, icon: MapPin },
// //                 { label: 'Quartier', value: precepteurInfo?.quartier, icon: MapPin },
// //                 { label: 'Téléphone', value: precepteurInfo?.telephone, icon: Phone },
// //                 { label: 'Années d\'expérience', value: `${precepteurInfo?.annees_experience || 0} an(s)`, icon: Clock },
// //                 { label: 'Diplôme', value: precepteurInfo?.diplome, icon: GraduationCap },
// //                 { label: 'Établissement d\'origine', value: precepteurInfo?.etablissement_origine, icon: Building },
// //               ].map((item, i) => (
// //                 <div key={i}>
// //                   <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><item.icon className="w-3 h-3" /> {item.label}</p>
// //                   <p className="font-medium text-gray-900">{item.value || 'Non spécifié'}</p>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* ========== ONGLET MATIÈRES ========== */}
// //       {activeTab === 'matieres' && (
// //         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
// //           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
// //             <div><h3 className="font-semibold text-gray-900 flex items-center gap-2"><BookOpen className="w-5 h-5 text-gray-700" />Mes matières</h3><p className="text-sm text-gray-500 mt-0.5">{selectedMatieres.length} matière{selectedMatieres.length > 1 ? 's' : ''}</p></div>
// //             <button onClick={openModal} className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium"><Plus className="w-4 h-4" /> Gérer les matières</button>
// //           </div>
// //           {selectedMatieres.length === 0 ? (
// //             <div className="flex flex-col items-center justify-center py-16 px-6">
// //               <BookOpen className="w-16 h-16 text-gray-300 mb-4" /><p className="text-gray-500 text-lg font-medium mb-1">Aucune matière sélectionnée</p>
// //               <button onClick={openModal} className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium text-sm"><Plus className="w-4 h-4" /> Ajouter des matières</button>
// //             </div>
// //           ) : (
// //             <div className="divide-y divide-gray-100">
// //               {selectedMatieres.map(matiereId => {
// //                 const matiere = matieres.find(m => m.id === matiereId)
// //                 return (
// //                   <div key={matiereId} className="p-4 hover:bg-gray-50/50 transition-colors group">
// //                     <div className="flex items-center gap-4">
// //                       <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center"><BookOpen className="w-5 h-5 text-blue-600" /></div>
// //                       <div className="flex-1 min-w-0"><p className="font-medium text-gray-900 truncate">{matiere?.nom || `Matière #${matiereId}`}</p>{matiere?.niveau && <p className="text-xs text-gray-500 mt-0.5">🎯 {matiere.niveau}</p>}</div>
// //                       <button onClick={() => handleMatiereToggle(matiereId)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
// //                     </div>
// //                   </div>
// //                 )
// //               })}
// //             </div>
// //           )}
// //         </div>
// //       )}

// //       {/* ========== ONGLET CONTRATS ========== */}
// //       {activeTab === 'contrats' && (
// //         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
// //           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
// //             <div><h3 className="font-semibold text-gray-900 flex items-center gap-2"><FileText className="w-5 h-5 text-gray-700" />Mes contrats</h3><p className="text-sm text-gray-500 mt-0.5">{contrats.length} contrat{contrats.length > 1 ? 's' : ''}</p></div>
// //             <button onClick={loadContrats} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> Actualiser</button>
// //           </div>
// //           {loadingContrats ? <div className="flex items-center justify-center py-16"><Loader /></div> : contrats.length === 0 ? (
// //             <div className="flex flex-col items-center justify-center py-16 px-6"><FileText className="w-16 h-16 text-gray-300 mb-4" /><p className="text-gray-500 text-lg font-medium mb-1">Aucun contrat</p></div>
// //           ) : (
// //             <div className="divide-y divide-gray-100">
// //               {contrats.map((contrat) => (
// //                 <div key={contrat.id} className="p-4 hover:bg-gray-50/50 transition-colors group">
// //                   <div className="flex items-start gap-4">
// //                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getContratStatutColor(contrat.statut)}`}><FileText className="w-5 h-5" /></div>
// //                     <div className="flex-1 min-w-0">
// //                       <div className="flex items-center gap-2 mb-1">
// //                         <p className="font-medium text-gray-900">{contrat.titre}</p>
// //                         <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getContratStatutColor(contrat.statut)}`}>{getStatutIcon(contrat.statut)}{contrat.statut.replace('_', ' ')}</span>
// //                       </div>
// //                       <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
// //                         <span>{contrat.matiere} • {contrat.niveau}</span><span>•</span><span>{getFrequenceLabel(contrat.frequence)}</span><span>•</span>
// //                         <span className="text-green-600 font-medium">{contrat.tarif_final?.toLocaleString()} FC/h</span><span>•</span><span>{getDureeLabel(contrat.duree)}</span>
// //                       </div>
// //                       <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
// //                         <span>Début: {formatDate(contrat.date_debut)}</span>
// //                         {contrat.parent?.user && <><span>•</span><span className="flex items-center gap-1"><User className="w-3 h-3" /> {contrat.parent.user.username}</span></>}
// //                       </div>
// //                     </div>
// //                     <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
// //                       {(contrat.statut === 'actif' || contrat.statut === 'accepte') && (
// //                         <button onClick={() => openCreateSession(contrat)} className="p-2 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all" title="Planifier une session"><Calendar className="w-4 h-4" /></button>
// //                       )}
// //                       <button onClick={() => openNegotiation(contrat)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Négocier"><MessageSquare className="w-4 h-4" /></button>
// //                       {contrat.statut === 'en_attente' && (
// //                         <>
// //                           <button onClick={() => handleContractStatusChange(contrat.id, 'accepte')} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"><Check className="w-4 h-4" /></button>
// //                           <button onClick={() => handleContractStatusChange(contrat.id, 'refuse')} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><X className="w-4 h-4" /></button>
// //                         </>
// //                       )}
// //                       {contrat.statut === 'accepte' && <button onClick={() => handleContractStatusChange(contrat.id, 'actif')} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"><Play className="w-4 h-4" /></button>}
// //                       {contrat.statut === 'actif' && (
// //                         <>
// //                           <button onClick={() => handleContractStatusChange(contrat.id, 'termine')} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Check className="w-4 h-4" /></button>
// //                           <button onClick={() => handleContractStatusChange(contrat.id, 'annule')} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Ban className="w-4 h-4" /></button>
// //                         </>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //       )}

// //       {/* ========== ONGLET SESSIONS ========== */}
// //       {activeTab === 'sessions' && (
// //         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
// //           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
// //             <div><h3 className="font-semibold text-gray-900 flex items-center gap-2"><Calendar className="w-5 h-5 text-gray-700" />Mes sessions</h3><p className="text-sm text-gray-500 mt-0.5">{sessions.length} session{sessions.length > 1 ? 's' : ''} • {sessionsPlanifiees} à venir • {sessionsTerminees} terminée{sessionsTerminees > 1 ? 's' : ''}</p></div>
// //             <button onClick={loadSessions} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> Actualiser</button>
// //           </div>
// //           {loadingSessions ? <div className="flex items-center justify-center py-16"><Loader /></div> : sessions.length === 0 ? (
// //             <div className="flex flex-col items-center justify-center py-16 px-6"><Calendar className="w-16 h-16 text-gray-300 mb-4" /><p className="text-gray-500 text-lg font-medium mb-1">Aucune session</p></div>
// //           ) : (
// //             <div className="divide-y divide-gray-100">
// //               {sessions.filter(s => s.statut === 'planifie' || s.statut === 'en_cours').length > 0 && (
// //                 <div className="px-6 py-3 bg-blue-50/50"><p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">📅 Sessions à venir</p></div>
// //               )}
// //               {sessions.filter(s => s.statut === 'planifie' || s.statut === 'en_cours').sort((a, b) => new Date(a.date_session).getTime() - new Date(b.date_session).getTime()).map((session) => (
// //                 <div key={session.id} className="p-4 hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => openSessionDetail(session)}>
// //                   <div className="flex items-start gap-4">
// //                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getSessionStatutColor(session.statut)}`}><Calendar className="w-5 h-5" /></div>
// //                     <div className="flex-1 min-w-0">
// //                       <div className="flex items-center gap-2 mb-1">
// //                         <p className="font-medium text-gray-900">{session.matiere?.nom || 'Session'}{session.eleve && <span className="text-gray-500 font-normal"> - {session.eleve.prenom} {session.eleve.nom}</span>}</p>
// //                         <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getSessionStatutColor(session.statut)}`}>{getStatutIcon(session.statut)}{session.statut.replace('_', ' ')}</span>
// //                       </div>
// //                       <p className="text-sm text-gray-600 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDateLong(session.date_session)}</p>
// //                       <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500">
// //                         <span><Clock className="w-3 h-3 inline mr-1" />{session.heure_debut?.slice(0, 5)} - {session.heure_fin?.slice(0, 5)}</span><span>•</span><span>{session.duree_minutes} min</span>
// //                         {session.files_count ? <><span>•</span><span>{session.files_count} fichier{session.files_count > 1 ? 's' : ''}</span></> : null}
// //                       </div>
// //                     </div>
// //                     <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
// //                       {session.statut === 'planifie' && <><button onClick={() => handleSessionStatusChange(session.id, 'en_cours')} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Play className="w-4 h-4" /></button><button onClick={() => handleSessionStatusChange(session.id, 'annule')} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><X className="w-4 h-4" /></button></>}
// //                       {session.statut === 'en_cours' && <button onClick={() => handleSessionStatusChange(session.id, 'termine')} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"><StopCircle className="w-4 h-4" /></button>}
// //                       <button onClick={() => openSessionDetail(session)} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"><Eye className="w-4 h-4" /></button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //       )}

// //       {/* ========== ONGLET CANDIDATURES (envoyées) ========== */}
// //       {activeTab === 'candidatures' && (
// //         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
// //           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
// //             <div><h3 className="font-semibold text-gray-900 flex items-center gap-2"><Send className="w-5 h-5 text-gray-700" />Mes candidatures envoyées</h3><p className="text-sm text-gray-500 mt-0.5">{candidatures.length} candidature{candidatures.length > 1 ? 's' : ''}</p></div>
// //             <div className="flex gap-2">
// //               <button onClick={loadCandidatures} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> Actualiser</button>
// //               <Link href="/solicitation" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-md"><Search className="w-4 h-4" /> Voir les services</Link>
// //             </div>
// //           </div>
// //           {loadingCandidatures ? <div className="flex items-center justify-center py-16"><Loader /></div> : candidatures.length === 0 ? (
// //             <div className="flex flex-col items-center justify-center py-16 px-6"><Send className="w-16 h-16 text-gray-300 mb-4" /><p className="text-gray-500 text-lg font-medium mb-1">Aucune candidature envoyée</p><Link href="/solicitation" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 font-medium text-sm shadow-md"><Search className="w-4 h-4" /> Découvrir les services</Link></div>
// //           ) : (
// //             <div className="divide-y divide-gray-100">
// //               {candidatures.map((candidature) => (
// //                 <div key={candidature.id} className="p-4 hover:bg-gray-50/50 transition-colors">
// //                   <div className="flex items-start gap-4">
// //                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getCandidatureStatutColor(candidature.statut)}`}><Send className="w-5 h-5" /></div>
// //                     <div className="flex-1 min-w-0">
// //                       <div className="flex items-center gap-2 mb-1">
// //                         <p className="font-medium text-gray-900">{candidature.service_parent?.titre || `Service #${candidature.service_parent_id}`}</p>
// //                         <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getCandidatureStatutColor(candidature.statut)}`}>
// //                           {candidature.statut === 'en_attente' && <><Clock className="w-3 h-3" /> En attente</>}
// //                           {candidature.statut === 'accepte' && <><Check className="w-3 h-3" /> Acceptée</>}
// //                           {candidature.statut === 'refuse' && <><X className="w-3 h-3" /> Refusée</>}
// //                         </span>
// //                       </div>
// //                       <p className="text-sm text-gray-600 line-clamp-2 mb-2">{candidature.message}</p>
// //                       <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
// //                         {candidature.tarif_propose && <span className="flex items-center gap-1 text-green-600 font-medium"><DollarSign className="w-3 h-3" /> {candidature.tarif_propose.toLocaleString()} FC/h</span>}
// //                         <span>📆 {formatDate(candidature.created_at)}</span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //       )}

// //       {/* ========== 🆕 ONGLET CANDIDATURES REÇUES (parents → mes services) ========== */}
// //       {/* {activeTab === 'candidatures-recues' && (
// //         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
// //           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
// //             <div><h3 className="font-semibold text-gray-900 flex items-center gap-2"><UserCheck className="w-5 h-5 text-gray-700" />Candidatures reçues</h3><p className="text-sm text-gray-500 mt-0.5">{candidaturesRecues.length} candidature{candidaturesRecues.length > 1 ? 's' : ''} reçue{candidaturesRecues.length > 1 ? 's' : ''}</p></div>
// //             <button onClick={loadCandidaturesRecues} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> Actualiser</button>
// //           </div>
// //           {loadingCandidaturesRecues ? <div className="flex items-center justify-center py-16"><Loader /></div> : candidaturesRecues.length === 0 ? (
// //             <div className="flex flex-col items-center justify-center py-16 px-6"><UserCheck className="w-16 h-16 text-gray-300 mb-4" /><p className="text-gray-500 text-lg font-medium mb-1">Aucune candidature reçue</p><p className="text-gray-400 text-sm">Les parents pourront postuler à vos services</p></div>
// //           ) : (
// //             <div className="divide-y divide-gray-100">
// //               {candidaturesRecues.map((candidature) => (
// //                 <div key={candidature.id} className="p-4 hover:bg-gray-50/50 transition-colors">
// //                   <div className="flex items-start gap-4">
// //                     <div className="flex-shrink-0">
// //                       {candidature.parent?.user?.photo_profil ? (
// //                         <img src={getPhotoUrl(candidature.parent.user.photo_profil) || ''} alt="" className="w-10 h-10 rounded-full object-cover" />
// //                       ) : (
// //                         <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"><User className="w-5 h-5 text-gray-400" /></div>
// //                       )}
// //                     </div>
// //                     <div className="flex-1 min-w-0">
// //                       <div className="flex items-center gap-2 mb-1">
// //                         <p className="font-medium text-gray-900">{candidature.parent?.user?.username || 'Parent'}</p>
// //                         <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getCandidatureStatutColor(candidature.statut)}`}>
// //                           {candidature.statut === 'en_attente' && <><Clock className="w-3 h-3" /> En attente</>}
// //                           {candidature.statut === 'accepte' && <><Check className="w-3 h-3" /> Acceptée</>}
// //                           {candidature.statut === 'refuse' && <><X className="w-3 h-3" /> Refusée</>}
// //                         </span>
// //                       </div>
// //                       <p className="text-xs text-gray-500">Service : {candidature.service?.titre || 'N/A'}</p>
// //                       {candidature.eleve && <p className="text-xs text-gray-500">Élève : {candidature.eleve.prenom} {candidature.eleve.nom} • {candidature.eleve.niveau}</p>}
// //                       <p className="text-sm text-gray-600 mt-2 line-clamp-2">{candidature.message}</p>
// //                       <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
// //                         {candidature.tarif_propose && <span className="flex items-center gap-1 text-green-600 font-medium"><DollarSign className="w-3 h-3" /> {candidature.tarif_propose.toLocaleString()} FC/h</span>}
// //                         <span>📆 {formatDate(candidature.created_at)}</span>
// //                       </div>
// //                     </div>
// //                     {candidature.statut === 'en_attente' && (
// //                       <div className="flex items-center gap-1 flex-shrink-0">
// //                         <button onClick={() => openContratModal(candidature)} className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 flex items-center gap-1"><FileText className="w-3 h-3" /> Contrat</button>
// //                         <button onClick={() => handleCandidatureStatus(candidature.id, 'accepte')} className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"><Check className="w-4 h-4" /></button>
// //                         <button onClick={() => handleCandidatureStatus(candidature.id, 'refuse')} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><X className="w-4 h-4" /></button>
// //                       </div>
// //                     )}
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //       )} */}
// // {/* ========== 🆕 ONGLET CANDIDATURES REÇUES (parents → mes services) ========== */}
// // {activeTab === 'candidatures-recues' && (
// //   <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
// //     <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
// //       <div>
// //         <h3 className="font-semibold text-gray-900 flex items-center gap-2">
// //           <UserCheck className="w-5 h-5 text-gray-700" />
// //           Candidatures reçues
// //         </h3>
// //         <p className="text-sm text-gray-500 mt-0.5">
// //           {candidaturesRecues.length} candidature{candidaturesRecues.length > 1 ? 's' : ''} reçue{candidaturesRecues.length > 1 ? 's' : ''}
// //         </p>
// //       </div>
// //       <button onClick={loadCandidaturesRecues} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1">
// //         <RefreshCw className="w-3.5 h-3.5" /> Actualiser
// //       </button>
// //     </div>

// //     {loadingCandidaturesRecues ? (
// //       <div className="flex items-center justify-center py-16"><Loader /></div>
// //     ) : candidaturesRecues.length === 0 ? (
// //       <div className="flex flex-col items-center justify-center py-16 px-6">
// //         <UserCheck className="w-16 h-16 text-gray-300 mb-4" />
// //         <p className="text-gray-500 text-lg font-medium mb-1">Aucune candidature reçue</p>
// //         <p className="text-gray-400 text-sm">Les parents pourront postuler à vos services</p>
// //       </div>
// //     ) : (
// //       <div className="divide-y divide-gray-100">
// //         {candidaturesRecues.map((candidature) => (
// //           <div key={candidature.id} className="p-4 hover:bg-gray-50/50 transition-colors">
// //             <div className="flex items-start gap-4">
// //               {/* Avatar */}
// //               <div className="flex-shrink-0">
// //                 {candidature.parent?.user?.photo_profil ? (
// //                   <img src={getPhotoUrl(candidature.parent.user.photo_profil) || ''} alt="" className="w-10 h-10 rounded-full object-cover" />
// //                 ) : (
// //                   <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
// //                     <User className="w-5 h-5 text-purple-600" />
// //                   </div>
// //                 )}
// //               </div>

// //               {/* Infos */}
// //               <div className="flex-1 min-w-0">
// //                 <div className="flex items-center gap-2 mb-1">
// //                   <p className="font-medium text-gray-900">
// //                     {candidature.parent?.user?.username || 'Parent'}
// //                   </p>
// //                   <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getCandidatureStatutColor(candidature.statut)}`}>
// //                     {candidature.statut === 'en_attente' && <><Clock className="w-3 h-3" /> En attente</>}
// //                     {candidature.statut === 'accepte' && <><Check className="w-3 h-3" /> Acceptée</>}
// //                     {candidature.statut === 'refuse' && <><X className="w-3 h-3" /> Refusée</>}
// //                   </span>
// //                 </div>

// //                 <p className="text-xs text-gray-500">
// //                   Service : <span className="font-medium">{candidature.service?.titre || 'N/A'}</span>
// //                 </p>

// //                 {candidature.eleve && (
// //                   <p className="text-xs text-gray-500">
// //                     Élève : <span className="font-medium">{candidature.eleve.prenom} {candidature.eleve.nom}</span> • {candidature.eleve.niveau}
// //                   </p>
// //                 )}

// //                 <p className="text-sm text-gray-600 mt-2 line-clamp-2">{candidature.message}</p>

// //                 <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
// //                   {candidature.tarif_propose && (
// //                     <span className="flex items-center gap-1 text-green-600 font-medium">
// //                       <DollarSign className="w-3 h-3" /> {candidature.tarif_propose.toLocaleString()} FC/h
// //                     </span>
// //                   )}
// //                   <span>📆 {formatDate(candidature.created_at)}</span>
// //                 </div>

// //                 {/* ✅ BOUTONS TOUJOURS VISIBLES - En attente */}
// //                 {candidature.statut === 'en_attente' && (
// //                   <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
// //                     <button
// //                       onClick={() => openContratModal(candidature)}
// //                       className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
// //                     >
// //                       <FileText className="w-4 h-4" />
// //                       Créer un contrat
// //                     </button>
// //                     <button
// //                       onClick={() => handleCandidatureStatus(candidature.id, 'accepte')}
// //                       className="px-3 py-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
// //                       title="Accepter"
// //                     >
// //                       <Check className="w-4 h-4" />
// //                     </button>
// //                     <button
// //                       onClick={() => handleCandidatureStatus(candidature.id, 'refuse')}
// //                       className="px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
// //                       title="Refuser"
// //                     >
// //                       <X className="w-4 h-4" />
// //                     </button>
// //                   </div>
// //                 )}

// //                 {/* ✅ Statut accepté - Bouton pour créer contrat si pas encore fait */}
// //                 {candidature.statut === 'accepte' && (
// //                   <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
// //                     <button
// //                       onClick={() => openContratModal(candidature)}
// //                       className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
// //                     >
// //                       <FileText className="w-4 h-4" />
// //                       Créer un contrat
// //                     </button>
// //                   </div>
// //                 )}

// //                 {/* ✅ Statut refusé - Juste un message */}
// //                 {candidature.statut === 'refuse' && (
// //                   <div className="mt-3 pt-3 border-t border-gray-100">
// //                     <p className="text-xs text-red-500 italic">Candidature refusée</p>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     )}
// //   </div>
// // )}
// //       {/* ========== ONGLET DOCUMENTS ========== */}
// //       {activeTab === 'documents' && (
// //         <div className="bg-white rounded-2xl p-6"><ListeDocuments refresh={refreshDocs} onRefresh={() => setRefreshDocs(prev => prev + 1)} /></div>
// //       )}

// //       {/* ========== MODALS ========== */}
// //       <CreateSessionModal contract={selectedContractForSession} isOpen={showCreateSessionModal} onClose={() => setShowCreateSessionModal(false)}
// //         onSuccess={() => { loadSessions(); loadContrats(); setMessage('✅ Session planifiée avec succès !'); setTimeout(() => setMessage(''), 3000) }}
// //         onCreating={() => setSaving(true)} onError={() => setSaving(false)} />

// //       <SessionDetailModal session={selectedSession} isOpen={showSessionModal} onClose={() => setShowSessionModal(false)}
// //         onStatusChange={handleSessionStatusChange} onNotesUpdate={handleNotesUpdate} />

// //       {/* Modal Négociation */}
// //       {showNegotiationModal && selectedContratForNegotiation && (
// //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
// //             <div className="p-6 border-b flex justify-between items-center">
// //               <div><h2 className="text-xl font-semibold flex items-center gap-2"><MessageSquare className="w-5 h-5 text-blue-600" />Négociation en direct</h2>
// //                 <div className="flex items-center gap-2 mt-1"><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" /></span><span className="text-xs text-green-600 font-medium">Temps réel actif</span></div></div>
// //               <button onClick={closeNegotiation} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
// //             </div>
// //             <div className="flex-1 overflow-y-auto p-6 space-y-4">
// //               <div className="bg-blue-50 rounded-xl p-4 mb-4"><p className="text-sm font-medium text-blue-900">{selectedContratForNegotiation.titre}</p><p className="text-xs text-blue-700 mt-1">Tarif actuel : {selectedContratForNegotiation.tarif_final?.toLocaleString()} FC/h • Statut : {selectedContratForNegotiation.statut.replace('_', ' ')}</p></div>
// //               {negotiationMessages.length === 0 ? <div className="text-center py-8 text-gray-400"><MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" /><p className="text-sm">Aucun message. Commencez la négociation.</p></div> : negotiationMessages.map((msg, index) => (
// //                 <div key={msg.id || index} className={`flex ${msg.sender === 'precepteur' ? 'justify-end' : 'justify-start'}`}>
// //                   <div className={`max-w-[80%] p-3 rounded-xl ${msg.sender === 'precepteur' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'}`}>
// //                     <p className="text-sm">{msg.message}</p>{msg.tarif_propose && <p className="text-xs mt-1 opacity-75">💰 Proposition : {msg.tarif_propose.toLocaleString()} FC/h</p>}<p className="text-xs mt-1 opacity-50">{formatDateTime(msg.created_at)}</p>
// //                   </div>
// //                 </div>
// //               ))}
// //               <div ref={messagesEndRef} />
// //             </div>
// //             <form onSubmit={sendNegotiationMessage} className="p-4 border-t bg-gray-50">
// //               <div className="flex gap-2">
// //                 <div className="flex-1 space-y-2">
// //                   <input type="text" value={negotiationForm.message} onChange={(e) => setNegotiationForm({...negotiationForm, message: e.target.value})} placeholder="Votre message..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" required />
// //                   <div className="flex items-center gap-2"><label className="text-xs text-gray-500">Contre-proposition (FC/h) :</label><input type="number" value={negotiationForm.tarif_propose} onChange={(e) => setNegotiationForm({...negotiationForm, tarif_propose: Number(e.target.value)})} className="w-32 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" min="0" step="1000" /></div>
// //                 </div>
// //                 <button type="submit" disabled={sendingNegotiation} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 self-end">{sendingNegotiation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}</button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}

// //       {/* 🆕 Modal Création Contrat depuis Candidature Parent */}
// //       {showContratModal && selectedCandidature && (
// //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
// //             <div className="p-6 border-b flex justify-between items-center">
// //               <h2 className="text-xl font-semibold flex items-center gap-2"><FileText className="w-5 h-5 text-green-600" />Créer un contrat</h2>
// //               <button onClick={() => setShowContratModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
// //             </div>
// //             <form onSubmit={handleCreateContrat} className="p-6 space-y-4">
// //               <div className="bg-blue-50 rounded-xl p-4">
// //                 <p className="text-sm font-medium text-blue-900">{selectedCandidature.service?.titre || 'Service'}</p>
// //                 <p className="text-xs text-blue-700 mt-1">Parent : {selectedCandidature.parent?.user?.username} • {selectedCandidature.tarif_propose ? `${selectedCandidature.tarif_propose.toLocaleString()} FC/h` : ''}</p>
// //                 {selectedCandidature.eleve && <p className="text-xs text-blue-700">Élève : {selectedCandidature.eleve.prenom} {selectedCandidature.eleve.nom} • {selectedCandidature.eleve.niveau}</p>}
// //               </div>
// //               <div><label className="block text-sm font-medium text-gray-700 mb-1">Date de début *</label><input type="date" value={contratForm.date_debut} onChange={(e) => setContratForm({...contratForm, date_debut: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" /></div>
// //               <div><label className="block text-sm font-medium text-gray-700 mb-1">Durée *</label><select value={contratForm.duree} onChange={(e) => setContratForm({...contratForm, duree: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"><option value="1_mois">1 mois</option><option value="3_mois">3 mois</option><option value="6_mois">6 mois</option><option value="12_mois">1 an</option><option value="indetermine">Indéterminée</option></select></div>
// //               <div><label className="block text-sm font-medium text-gray-700 mb-1">Tarif final (FC/h) *</label><input type="number" value={contratForm.tarif_final} onChange={(e) => setContratForm({...contratForm, tarif_final: Number(e.target.value)})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" min="0" step="1000" /></div>
// //               <div><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label><textarea value={contratForm.notes} onChange={(e) => setContratForm({...contratForm, notes: e.target.value})} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" /></div>
// //               <div className="flex gap-2 pt-2">
// //                 <button type="button" onClick={() => setShowContratModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">Annuler</button>
// //                 <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}Créer le contrat</button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}

// //       {/* Modal Profil */}
// //       {showModal && <ProfilModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={handleSave} initialData={form} selectedMatieres={selectedMatieres} onMatieresChange={setSelectedMatieres} saving={saving} />}
// //     </div>
// //   )
// // }




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
// import { getSessions, getSessionsByContract } from '@/lib/session-api'
// import { useState, useEffect, useCallback, useRef } from 'react'
// import Link from 'next/link'
// import { 
//   User, MapPin, Star, Clock, BookOpen, GraduationCap, Calendar, 
//   Edit3, Check, X, Upload, Plus, Trash2, Eye, AlertCircle, 
//   ChevronDown, Filter, Play, StopCircle, Ban, RotateCcw, FileText, 
//   Users, Tag, Phone, Mail, Building, CreditCard, Search, Hash, MessageSquare, 
//   Activity, RefreshCw, Send, Loader2, DollarSign, Video, UserCheck, Briefcase
// } from 'lucide-react'
// import { PiBookOpen, PiPlus, PiTrash } from 'react-icons/pi'
// import Loader from '@/components/Loader'
// import { CheckBadgeIcon } from '@heroicons/react/24/solid'

// // Types
// type Contrat = {
//   id: string
//   service_parent_id?: string
//   service_precepteur_id?: string
//   parent_id: string
//   precepteur_id: number
//   eleve_id?: string
//   titre: string
//   matiere: string | null
//   niveau: string
//   frequence: string
//   lieu: string
//   date_debut: string
//   duree: string
//   tarif_final: number
//   notes: string | null
//   statut: 'en_attente' | 'accepte' | 'refuse' | 'actif' | 'termine' | 'annule'
//   created_at: string
//   updated_at: string
//   parent?: any
//   eleve?: any
//   matiere_obj?: any
//   sessions?: Session[] | null
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
//   contrat?: any
//   eleve?: any
//   matiere?: any
//   files?: any[]
//   grades?: any[]
//   files_count?: number
//   grades_count?: number
// }

// type NegotiationMessage = {
//   id: string
//   contract_id: string
//   sender_id: string
//   sender: 'parent' | 'precepteur'
//   message: string
//   tarif_propose: number | null
//   created_at: string
// }

// // Candidature du précepteur vers un service parent
// type CandidaturePrecepteur = {
//   id: string
//   service_parent_id: string
//   precepteur_id: number
//   message: string
//   tarif_propose: number | null
//   disponibilites: string | null
//   statut: 'en_attente' | 'accepte' | 'refuse'
//   created_at: string
//   service_parent?: any
// }

// // Candidature d'un parent vers un service du précepteur
// type CandidatureParent = {
//   id: string
//   service_precepteur_id: string
//   parent_id: string
//   eleve_id: string
//   message: string
//   tarif_propose: number | null
//   statut: 'en_attente' | 'accepte' | 'refuse'
//   created_at: string
//   service?: any
//   parent?: any
//   eleve?: any
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

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
// const POLLING_INTERVAL = 3000

// export default function PrecepteurDashboard() {
//   const router = useRouter()
//   const { user, precepteurInfo, refreshPrecepteurInfo, updateUser } = useAuth()
  
//   // États principaux
//   const [uploading, setUploading] = useState(false)
//   const [saving, setSaving] = useState(false)
//   const [message, setMessage] = useState('')
//   const [loading, setLoading] = useState(true)
//   const [activeTab, setActiveTab] = useState('profil')
//   const [showModal, setShowModal] = useState(false)
//   const [refreshDocs, setRefreshDocs] = useState(0)
  
//   // États contrats
//   const [contrats, setContrats] = useState<Contrat[]>([])
//   const [loadingContrats, setLoadingContrats] = useState(false)
  
//   // États sessions
//   const [sessions, setSessions] = useState<Session[]>([])
//   const [loadingSessions, setLoadingSessions] = useState(false)
//   const [selectedSession, setSelectedSession] = useState<Session | null>(null)
//   const [showSessionModal, setShowSessionModal] = useState(false)
//   const [selectedContractForSession, setSelectedContractForSession] = useState<Contrat | null>(null)
//   const [showCreateSessionModal, setShowCreateSessionModal] = useState(false)
  
//   // États négociation
//   const [showNegotiationModal, setShowNegotiationModal] = useState(false)
//   const [selectedContratForNegotiation, setSelectedContratForNegotiation] = useState<Contrat | null>(null)
//   const [negotiationForm, setNegotiationForm] = useState({ message: '', tarif_propose: 0 })
//   const [negotiationMessages, setNegotiationMessages] = useState<NegotiationMessage[]>([])
//   const [sendingNegotiation, setSendingNegotiation] = useState(false)
  
//   // États matières
//   const [matieres, setMatieres] = useState<any[]>([])
//   const [selectedMatieres, setSelectedMatieres] = useState<number[]>([])
  
//   // États candidatures (précepteur → services parents)
//   const [candidatures, setCandidatures] = useState<CandidaturePrecepteur[]>([])
//   const [loadingCandidatures, setLoadingCandidatures] = useState(false)
  
//   // États candidatures reçues (parents → mes services)
//   const [candidaturesRecues, setCandidaturesRecues] = useState<CandidatureParent[]>([])
//   const [loadingCandidaturesRecues, setLoadingCandidaturesRecues] = useState(false)
  
//   // Modal création contrat depuis candidature parent
//   const [showContratModal, setShowContratModal] = useState(false)
//   const [selectedCandidature, setSelectedCandidature] = useState<CandidatureParent | null>(null)
//   const [contratForm, setContratForm] = useState({ date_debut: '', duree: '1_mois', tarif_final: 0, notes: '' })
  
//   // États formulaire profil
//   const [form, setForm] = useState<ProfilForm>({
//     latitude: '', longitude: '', commune: '', quartier: '',
//     annees_experience: 0, diplome: '', etablissement_origine: '', telephone: ''
//   })
  
//   const [disponible, setDisponible] = useState(precepteurInfo?.disponible ?? true)

//   const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
//   const messagesEndRef = useRef<HTMLDivElement>(null)

//   // ============ INITIALISATION ============
//   useEffect(() => {
//     let isMounted = true
//     const initializeData = async () => {
//       if (!user) { setLoading(false); return }
//       if (!precepteurInfo) await refreshPrecepteurInfo()
//       if (!isMounted) return
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
//         })
//         setDisponible(precepteurInfo.disponible ?? true)
//         if (precepteurInfo.precepteur_matieres) {
//           setSelectedMatieres(precepteurInfo.precepteur_matieres.map((pm: any) => pm.matiere_id))
//         }
//         await Promise.all([loadContrats(), loadMatieres(), loadCandidatures(), loadCandidaturesRecues(), loadSessions()])
//       }
//       if (isMounted) setLoading(false)
//     }
//     initializeData()
//     return () => { isMounted = false }
//   }, [user?.id, precepteurInfo?.id])

//   useEffect(() => {
//     return () => { if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current) }
//   }, [])

//   useEffect(() => {
//     if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
//   }, [negotiationMessages])

//   // ============ CHARGEMENT ============
//   const loadSessions = useCallback(async () => {
//     setLoadingSessions(true)
//     try { const data = await getSessions(); setSessions(data.sessions || []) }
//     catch (error) { console.error('❌ Erreur chargement sessions:', error) }
//     finally { setLoadingSessions(false) }
//   }, [])

//   const loadNegotiationMessages = async (contratId: string) => {
//     try {
//       const token = localStorage.getItem('excellence-token')
//       if (!token) return
//       const response = await fetch(`${API_URL}/auth/contracts/${contratId}/negotiations`, {
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
//       })
//       if (response.ok) { const data = await response.json(); setNegotiationMessages(data.messages || []) }
//     } catch (error) { console.error('❌ Erreur chargement négociations:', error) }
//   }

//   const startNegotiationPolling = (contratId: string) => {
//     if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current)
//     loadNegotiationMessages(contratId)
//     pollingIntervalRef.current = setInterval(() => loadNegotiationMessages(contratId), POLLING_INTERVAL)
//   }

//   const stopNegotiationPolling = () => {
//     if (pollingIntervalRef.current) { clearInterval(pollingIntervalRef.current); pollingIntervalRef.current = null }
//   }

//   const loadContrats = useCallback(async () => {
//     if (!precepteurInfo) return
//     setLoadingContrats(true)
//     try {
//       const token = localStorage.getItem('excellence-token')
//       if (!token) return
//       const response = await fetch(`${API_URL}/auth/contracts`, {
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
//       })
//       const data = await response.json()
//       if (data.success) setContrats(data.contrats || [])
//     } catch (error) { console.error('❌ Erreur chargement contrats:', error) }
//     finally { setLoadingContrats(false) }
//   }, [precepteurInfo])

//   const loadMatieres = async () => {
//     try {
//       const result = await getPrecepteurMatieres()
//       if (result.success) setMatieres(result.matieres || [])
//     } catch (error) { console.error('❌ Erreur chargement matières:', error) }
//   }

//   // Charger mes candidatures envoyées (précepteur → services parents)
//   const loadCandidatures = async () => {
//     if (!precepteurInfo) return
//     setLoadingCandidatures(true)
//     try {
//       const token = localStorage.getItem('excellence-token')
//       if (!token) return
//       const response = await fetch(`${API_URL}/auth/candidatures/mes-candidatures`, {
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
//       })
//       if (response.ok) {
//         const data = await response.json()
//         if (data.success) setCandidatures(data.candidatures || [])
//       }
//     } catch (error) { console.error('❌ Erreur chargement candidatures:', error) }
//     finally { setLoadingCandidatures(false) }
//   }

//   // Charger les candidatures reçues (parents → mes services)
//   const loadCandidaturesRecues = async () => {
//     if (!precepteurInfo) return
//     setLoadingCandidaturesRecues(true)
//     try {
//       const token = localStorage.getItem('excellence-token')
//       if (!token) return
//       const response = await fetch(`${API_URL}/auth/precepteur/candidatures`, {
//         headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
//       })
//       if (response.ok) {
//         const data = await response.json()
//         if (data.success) setCandidaturesRecues(data.candidatures || [])
//       }
//     } catch (error) { console.error('❌ Erreur chargement candidatures reçues:', error) }
//     finally { setLoadingCandidaturesRecues(false) }
//   }

//   // ============ GESTION SESSIONS ============
//   const handleSessionStatusChange = async (sessionId: number, newStatus: string) => {
//     try {
//       await updateSessionStatus(sessionId, newStatus)
//       setMessage(`✅ Session ${newStatus.replace('_', ' ')} avec succès`)
//       await loadSessions()
//       setTimeout(() => setMessage(''), 3000)
//     } catch (error) { setMessage('Erreur lors du changement de statut') }
//   }

//   const handleNotesUpdate = async (sessionId: number, notes: string) => {
//     try {
//       await updateSessionNotes(sessionId, notes)
//       setMessage('✅ Notes sauvegardées avec succès')
//       await loadSessions()
//       setTimeout(() => setMessage(''), 3000)
//     } catch (error) { setMessage('Erreur lors de la sauvegarde des notes') }
//   }

//   const openSessionDetail = (session: Session) => { setSelectedSession(session); setShowSessionModal(true) }
//   const openCreateSession = (contrat: Contrat) => { setSelectedContractForSession(contrat); setShowCreateSessionModal(true) }

//   // ============ GESTION CONTRATS ============
//   const handleContractStatusChange = async (contratId: string, newStatus: string) => {
//     try {
//       const token = localStorage.getItem('excellence-token')
//       if (!token) return
//       const response = await fetch(`${API_URL}/auth/contracts/${contratId}/status`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//         body: JSON.stringify({ statut: newStatus })
//       })
//       if (response.ok) {
//         setMessage(`✅ Contrat ${newStatus.replace('_', ' ')} avec succès`)
//         setTimeout(() => setMessage(''), 3000)
//         loadContrats()
//       }
//     } catch (error) { console.error('❌ Erreur changement statut contrat:', error) }
//   }

//   // Gestion candidatures reçues
//   const handleCandidatureStatus = async (candidatureId: string, newStatus: string) => {
//     try {
//       const token = localStorage.getItem('excellence-token')
//       if (!token) return
//       const response = await fetch(`${API_URL}/auth/parent/candidatures/${candidatureId}/status`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//         body: JSON.stringify({ statut: newStatus })
//       })
//       if (response.ok) {
//         setMessage(`✅ Candidature ${newStatus === 'accepte' ? 'acceptée' : 'refusée'}`)
//         loadCandidaturesRecues()
//         setTimeout(() => setMessage(''), 3000)
//       }
//     } catch (error) { console.error('❌ Erreur statut candidature:', error) }
//   }

//   // Ouvrir le modal de création de contrat
//   const openContratModal = (candidature: CandidatureParent) => {
//     setSelectedCandidature(candidature)
//     setContratForm({
//       date_debut: new Date().toISOString().split('T')[0],
//       duree: '1_mois',
//       tarif_final: candidature.tarif_propose || candidature.service?.tarif_horaire || 0,
//       notes: ''
//     })
//     setShowContratModal(true)
//   }

//   // Créer un contrat depuis une candidature parent
//   const handleCreateContrat = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setSaving(true)
//     try {
//       const token = localStorage.getItem('excellence-token')
//       if (!token) return
//       const response = await fetch(`${API_URL}/auth/parent/candidatures/${selectedCandidature?.id}/contrat`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//         body: JSON.stringify(contratForm)
//       })
//       const data = await response.json()
//       if (response.ok) {
//         setMessage('✅ Contrat créé avec succès !')
//         setShowContratModal(false)
//         loadContrats()
//         loadCandidaturesRecues()
//       } else {
//         setMessage(data.error || 'Erreur lors de la création du contrat')
//       }
//     } catch (error) { console.error('❌ Erreur création contrat:', error) }
//     finally { setSaving(false); setTimeout(() => setMessage(''), 3000) }
//   }

//   // ============ GESTION NÉGOCIATION ============
//   const openNegotiation = async (contrat: Contrat) => {
//     setSelectedContratForNegotiation(contrat)
//     setNegotiationForm({ message: '', tarif_propose: contrat.tarif_final })
//     startNegotiationPolling(contrat.id)
//     setShowNegotiationModal(true)
//   }

//   const closeNegotiation = () => { stopNegotiationPolling(); setShowNegotiationModal(false); setSelectedContratForNegotiation(null) }

//   const sendNegotiationMessage = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setSendingNegotiation(true)
//     try {
//       const token = localStorage.getItem('excellence-token')
//       if (!token) throw new Error('Non connecté')
//       const response = await fetch(`${API_URL}/auth/contracts/${selectedContratForNegotiation?.id}/negotiations`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//         body: JSON.stringify({ message: negotiationForm.message, tarif_propose: negotiationForm.tarif_propose })
//       })
//       if (response.ok && selectedContratForNegotiation) {
//         await loadNegotiationMessages(selectedContratForNegotiation.id)
//         setNegotiationForm({ ...negotiationForm, message: '' })
//       }
//     } catch (error) { console.error('❌ Erreur envoi message:', error) }
//     finally { setSendingNegotiation(false) }
//   }

//   // ============ GESTION PROFIL ============
//   const handleSave = async (data: ProfilForm & { matieres: number[] }) => {
//     setSaving(true); setMessage('')
//     try {
//       const result = await updatePrecepteurProfil({
//         latitude: data.latitude || undefined, longitude: data.longitude || undefined,
//         commune: data.commune || undefined, quartier: data.quartier || undefined,
//         annees_experience: data.annees_experience || 0, diplome: data.diplome || undefined,
//         etablissement_origine: data.etablissement_origine || undefined,
//         telephone: data.telephone || undefined, matieres: data.matieres
//       })
//       if (result.success) { setShowModal(false); setMessage('✅ Profil mis à jour avec succès !'); await refreshPrecepteurInfo() }
//       else setMessage(result.error || 'Erreur lors de la mise à jour')
//     } catch (error) { setMessage('Erreur lors de la mise à jour du profil') }
//     finally { setSaving(false); setTimeout(() => setMessage(''), 3000) }
//   }

//   const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (!file) return
//     if (file.size > 5 * 1024 * 1024) { setMessage('Image trop volumineuse. Maximum 5MB.'); setTimeout(() => setMessage(''), 3000); return }
//     setUploading(true)
//     try {
//       const result = await updateProfilePhoto(file)
//       if (result.success && result.photoUrl) { updateUser({ photo_profil: result.photoUrl }); setMessage('Photo mise à jour avec succès') }
//       else setMessage(result.error || 'Erreur lors de la mise à jour')
//     } catch (error) { setMessage('Erreur lors de l\'upload de la photo') }
//     finally { setUploading(false); setTimeout(() => setMessage(''), 3000) }
//   }

//   const toggleDisponible = async () => {
//     const newDisponible = !disponible; setDisponible(newDisponible)
//     try {
//       const result = await updatePrecepteurDisponibility(newDisponible)
//       if (result.success) await refreshPrecepteurInfo()
//       else { setDisponible(!newDisponible); setMessage(result.error || 'Erreur lors de la mise à jour') }
//     } catch (error) { setDisponible(!newDisponible); setMessage('Erreur lors de la mise à jour') }
//   }

//   const handleMatiereToggle = (matiereId: number) => {
//     setSelectedMatieres(prev => prev.includes(matiereId) ? prev.filter(id => id !== matiereId) : [...prev, matiereId])
//   }

//   const openModal = () => {
//     if (precepteurInfo) {
//       setForm({
//         latitude: precepteurInfo.latitude?.toString() || '', longitude: precepteurInfo.longitude?.toString() || '',
//         commune: precepteurInfo.commune || '', quartier: precepteurInfo.quartier || '',
//         annees_experience: precepteurInfo.annees_experience || 0, diplome: precepteurInfo.diplome || '',
//         telephone: precepteurInfo.telephone || '', etablissement_origine: precepteurInfo.etablissement_origine || ''
//       })
//     }
//     setShowModal(true)
//   }

//   // ============ HELPERS UI ============
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

//   const getCandidatureStatutColor = (statut: string) => {
//     switch (statut) {
//       case 'en_attente': return 'bg-yellow-100 text-yellow-800'
//       case 'accepte': return 'bg-green-100 text-green-800'
//       case 'refuse': return 'bg-red-100 text-red-800'
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

//   const getStatutIcon = (statut: string) => {
//     switch (statut) {
//       case 'planifie': case 'en_attente': return <Clock className="w-4 h-4" />
//       case 'en_cours': return <Play className="w-4 h-4" />
//       case 'termine': case 'accepte': case 'actif': return <Check className="w-4 h-4" />
//       case 'refuse': case 'annule': return <X className="w-4 h-4" />
//       default: return <AlertCircle className="w-4 h-4" />
//     }
//   }

//   const getFrequenceLabel = (frequence: string) => {
//     switch (frequence) {
//       case 'unique': return 'Ponctuel'; case 'hebdomadaire': return 'Hebdomadaire'
//       case 'bi-hebdomadaire': return '2x/semaine'; case 'mensuel': return 'Mensuel'
//       default: return frequence
//     }
//   }

//   const getDureeLabel = (duree: string) => {
//     switch (duree) {
//       case '1_mois': return '1 mois'; case '3_mois': return '3 mois'
//       case '6_mois': return '6 mois'; case '12_mois': return '1 an'
//       case 'indetermine': return 'Indéterminée'; default: return duree
//     }
//   }

//   const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
//   const formatDateLong = (date: string) => new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
//   const formatDateTime = (date: string) => new Date(date).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
//   const getPhotoUrl = (photoPath: string | null | undefined) => {
//     if (!photoPath) return null
//     if (photoPath.startsWith('http')) return photoPath
//     return `${API_URL.replace('/api', '')}${photoPath}`
//   }

//   // ============ STATS ============
//   const contratsActifs = contrats.filter(c => c.statut === 'actif' || c.statut === 'accepte').length
//   const sessionsPlanifiees = sessions.filter(s => s.statut === 'planifie' || s.statut === 'en_cours').length
//   const sessionsTerminees = sessions.filter(s => s.statut === 'termine').length

//   // ============ LOADING ============
//   if (loading) return <div className='flex items-center justify-center h-screen'><div className='w-20'><Loader/></div></div>
//   if (!user) return null

//   // ============ RENDU ============
//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       {message && (
//         <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${message.includes('Erreur') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
//           {message.includes('Erreur') ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <Check className="w-4 h-4 flex-shrink-0" />}
//           {message}
//         </div>
//       )}

//       {/* Message profil incomplet */}
//       {precepteurInfo && (!precepteurInfo.commune || !precepteurInfo.quartier || !precepteurInfo.diplome || !precepteurInfo.etablissement_origine || precepteurInfo.annees_experience === 0 || precepteurInfo.statut_verification === 'en_attente' || precepteurInfo.statut_verification === 'rejete') && (
//         <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
//           <div className="flex-shrink-0 mt-0.5"><AlertCircle className="w-5 h-5 text-amber-600" /></div>
//           <div className="flex-1">
//             <h3 className="text-sm font-semibold text-amber-800 mb-1">
//               {precepteurInfo.statut_verification === 'rejete' ? 'Votre dossier a été rejeté' : precepteurInfo.statut_verification === 'en_attente' ? 'Votre dossier est en attente de vérification' : 'Profil incomplet'}
//             </h3>
//             <p className="text-sm text-amber-700">
//               {precepteurInfo.statut_verification === 'rejete' ? 'Votre dossier a été rejeté. Veuillez mettre à jour vos informations.' : 'Complétez votre profil pour apparaître dans les recherches.'}
//             </p>
//             <button onClick={openModal} className="mt-3 px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2">
//               <Edit3 className="w-4 h-4" /> Modifier le profil
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ========== CARD PROFIL ========== */}
//       <div className="bg-white rounded-2xl mb-6 p-6">
//         <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
//           <div className="relative group w-24 h-24 flex-shrink-0 mx-auto md:mx-0">
//             {user.photo_profil ? (
//               <img src={getPhotoUrl(user.photo_profil) || ''} alt="" className="w-24 h-24 rounded-full object-cover border-2 border-gray-100"
//                 onError={(e) => { e.currentTarget.style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex' }} />
//             ) : null}
//             <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-2 border-gray-100 ${user.photo_profil ? 'hidden' : 'flex'}`}>
//               <User className="w-10 h-10 text-blue-400" />
//             </div>
//             <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
//               {uploading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <Upload className="w-5 h-5 text-white" />}
//               <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
//             </label>
//           </div>
//           <div className="flex-1 text-center md:text-left">
//             <h1 className="text-2xl font-bold">{user.username}
//               {precepteurInfo?.statut_verification === 'verifie' && (
//                 <span className="inline-flex items-center gap-1 ml-2 text-blue-600"><CheckBadgeIcon className="w-5 h-5" /><span className="text-sm font-normal">Vérifié</span></span>
//               )}
//             </h1>
//             <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2 mt-1">
//               <GraduationCap className="w-4 h-4" /> Précepteur
//               {selectedMatieres.length > 0 && <span className="text-sm text-gray-500">• {selectedMatieres.length} matière{selectedMatieres.length > 1 ? 's' : ''}</span>}
//             </p>
//             <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm text-gray-500">
//               <MapPin className="w-4 h-4" />
//               {precepteurInfo?.commune ? <span>{precepteurInfo.commune}{precepteurInfo.quartier ? `, ${precepteurInfo.quartier}` : ''}</span> : <span>Localisation non spécifiée</span>}
//             </div>
//             <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
//               <Star className="w-4 h-4 text-yellow-500" /><span className="text-sm font-medium">{precepteurInfo?.note_moyenne?.toFixed(1) || '0.0'}/5</span>
//             </div>
//           </div>
//           <div className="flex flex-wrap gap-2 justify-center md:justify-start">
//             <button onClick={toggleDisponible} className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 font-medium ${disponible ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
//               {disponible ? <><Check className="w-4 h-4" /> Disponible</> : <><X className="w-4 h-4" /> Indisponible</>}
//             </button>
//             <Link href="/solicitation" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-md">
//               <Search className="w-4 h-4" /> Services disponibles
//             </Link>
//           </div>
//         </div>
//         <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
//           <div className="p-4 bg-blue-50 rounded-xl"><p className="text-2xl font-bold text-blue-600">{selectedMatieres.length}</p><p className="text-sm text-gray-600 flex items-center gap-1"><BookOpen className="w-3 h-3" /> Matières</p></div>
//           <div className="p-4 bg-green-50 rounded-xl"><p className="text-2xl font-bold text-green-600">{contrats.length}</p><p className="text-sm text-gray-600 flex items-center gap-1"><FileText className="w-3 h-3" /> Contrats</p></div>
//           <div className="p-4 bg-purple-50 rounded-xl"><p className="text-2xl font-bold text-purple-600">{contratsActifs}</p><p className="text-sm text-gray-600 flex items-center gap-1"><Check className="w-3 h-3" /> Actifs</p></div>
//           <div className="p-4 bg-cyan-50 rounded-xl"><p className="text-2xl font-bold text-cyan-600">{sessions.length}</p><p className="text-sm text-gray-600 flex items-center gap-1"><Calendar className="w-3 h-3" /> Sessions</p></div>
//           <div className="p-4 bg-teal-50 rounded-xl"><p className="text-2xl font-bold text-teal-600">{candidatures.length + candidaturesRecues.length}</p><p className="text-sm text-gray-600 flex items-center gap-1"><Send className="w-3 h-3" /> Candidatures</p></div>
//           <div className="p-4 bg-indigo-50 rounded-xl"><p className="text-2xl font-bold text-indigo-600">{/* Nombre de services du précepteur */}</p><p className="text-sm text-gray-600 flex items-center gap-1"><Briefcase className="w-3 h-3" /> Services</p></div>
//         </div>
//       </div>

//       {/* ========== TABS ========== */}
//       <div className="flex gap-4 mb-6 overflow-x-auto flex-wrap">
//         {[
//           { key: 'profil', icon: User, label: 'Profil' },
//           { key: 'matieres', icon: BookOpen, label: `Matières (${selectedMatieres.length})` },
//           { key: 'services', icon: Briefcase, label: 'Mes services' },
//           { key: 'contrats', icon: FileText, label: `Contrats (${contrats.length})` },
//           { key: 'sessions', icon: Calendar, label: `Sessions (${sessions.length})` },
//           { key: 'candidatures', icon: Send, label: `Envoyées (${candidatures.length})` },
//           { key: 'candidatures-recues', icon: UserCheck, label: `Reçues (${candidaturesRecues.length})` },
//           { key: 'documents', icon: FileText, label: 'Documents' },
//         ].map(tab => (
//           <button key={tab.key} onClick={() => setActiveTab(tab.key)}
//             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === tab.key ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
//             <tab.icon className="w-4 h-4" /> {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* ========== ONGLET PROFIL ========== */}
//       {activeTab === 'profil' && (
//         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
//             <div><h3 className="font-semibold text-gray-900 flex items-center gap-2"><User className="w-5 h-5 text-gray-700" />Informations du précepteur</h3><p className="text-sm text-gray-500 mt-0.5">Profil professionnel</p></div>
//             <button onClick={openModal} className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium"><Edit3 className="w-4 h-4" /> Modifier le profil</button>
//           </div>
//           <div className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {[
//                 { label: 'Commune', value: precepteurInfo?.commune, icon: MapPin },
//                 { label: 'Quartier', value: precepteurInfo?.quartier, icon: MapPin },
//                 { label: 'Téléphone', value: precepteurInfo?.telephone, icon: Phone },
//                 { label: 'Années d\'expérience', value: `${precepteurInfo?.annees_experience || 0} an(s)`, icon: Clock },
//                 { label: 'Diplôme', value: precepteurInfo?.diplome, icon: GraduationCap },
//                 { label: 'Établissement d\'origine', value: precepteurInfo?.etablissement_origine, icon: Building },
//               ].map((item, i) => (
//                 <div key={i}>
//                   <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><item.icon className="w-3 h-3" /> {item.label}</p>
//                   <p className="font-medium text-gray-900">{item.value || 'Non spécifié'}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ========== ONGLET MATIÈRES ========== */}
//       {activeTab === 'matieres' && (
//         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
//             <div><h3 className="font-semibold text-gray-900 flex items-center gap-2"><BookOpen className="w-5 h-5 text-gray-700" />Mes matières</h3><p className="text-sm text-gray-500 mt-0.5">{selectedMatieres.length} matière{selectedMatieres.length > 1 ? 's' : ''}</p></div>
//             <button onClick={openModal} className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium"><Plus className="w-4 h-4" /> Gérer les matières</button>
//           </div>
//           {selectedMatieres.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 px-6">
//               <BookOpen className="w-16 h-16 text-gray-300 mb-4" /><p className="text-gray-500 text-lg font-medium mb-1">Aucune matière sélectionnée</p>
//               <button onClick={openModal} className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium text-sm"><Plus className="w-4 h-4" /> Ajouter des matières</button>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-100">
//               {selectedMatieres.map(matiereId => {
//                 const matiere = matieres.find(m => m.id === matiereId)
//                 return (
//                   <div key={matiereId} className="p-4 hover:bg-gray-50/50 transition-colors group">
//                     <div className="flex items-center gap-4">
//                       <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center"><BookOpen className="w-5 h-5 text-blue-600" /></div>
//                       <div className="flex-1 min-w-0"><p className="font-medium text-gray-900 truncate">{matiere?.nom || `Matière #${matiereId}`}</p>{matiere?.niveau && <p className="text-xs text-gray-500 mt-0.5">🎯 {matiere.niveau}</p>}</div>
//                       <button onClick={() => handleMatiereToggle(matiereId)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           )}
//         </div>
//       )}

//       {/* ========== ONGLET SERVICES (ServiceManager) ========== */}
//       {activeTab === 'services' && (
//         <div className="bg-white rounded-2xl p-6">
//           <ServiceManager />
//         </div>
//       )}

//       {/* ========== ONGLET CONTRATS ========== */}
//       {activeTab === 'contrats' && (
//         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
//             <div><h3 className="font-semibold text-gray-900 flex items-center gap-2"><FileText className="w-5 h-5 text-gray-700" />Mes contrats</h3><p className="text-sm text-gray-500 mt-0.5">{contrats.length} contrat{contrats.length > 1 ? 's' : ''}</p></div>
//             <button onClick={loadContrats} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> Actualiser</button>
//           </div>
//           {loadingContrats ? <div className="flex items-center justify-center py-16"><Loader /></div> : contrats.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 px-6"><FileText className="w-16 h-16 text-gray-300 mb-4" /><p className="text-gray-500 text-lg font-medium mb-1">Aucun contrat</p></div>
//           ) : (
//             <div className="divide-y divide-gray-100">
//               {contrats.map((contrat) => (
//                 <div key={contrat.id} className="p-4 hover:bg-gray-50/50 transition-colors group">
//                   <div className="flex items-start gap-4">
//                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getContratStatutColor(contrat.statut)}`}><FileText className="w-5 h-5" /></div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 mb-1">
//                         <p className="font-medium text-gray-900">{contrat.titre}</p>
//                         <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getContratStatutColor(contrat.statut)}`}>{getStatutIcon(contrat.statut)}{contrat.statut.replace('_', ' ')}</span>
//                       </div>
//                       <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
//                         <span>{contrat.matiere} • {contrat.niveau}</span><span>•</span><span>{getFrequenceLabel(contrat.frequence)}</span><span>•</span>
//                         <span className="text-green-600 font-medium">{contrat.tarif_final?.toLocaleString()} FC/h</span><span>•</span><span>{getDureeLabel(contrat.duree)}</span>
//                       </div>
//                       <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
//                         <span>Début: {formatDate(contrat.date_debut)}</span>
//                         {contrat.parent?.user && <><span>•</span><span className="flex items-center gap-1"><User className="w-3 h-3" /> {contrat.parent.user.username}</span></>}
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
//                       {(contrat.statut === 'actif' || contrat.statut === 'accepte') && (
//                         <button onClick={() => openCreateSession(contrat)} className="p-2 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all" title="Planifier une session"><Calendar className="w-4 h-4" /></button>
//                       )}
//                       <button onClick={() => openNegotiation(contrat)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Négocier"><MessageSquare className="w-4 h-4" /></button>
//                       {contrat.statut === 'en_attente' && (
//                         <>
//                           <button onClick={() => handleContractStatusChange(contrat.id, 'accepte')} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"><Check className="w-4 h-4" /></button>
//                           <button onClick={() => handleContractStatusChange(contrat.id, 'refuse')} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><X className="w-4 h-4" /></button>
//                         </>
//                       )}
//                       {contrat.statut === 'accepte' && <button onClick={() => handleContractStatusChange(contrat.id, 'actif')} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"><Play className="w-4 h-4" /></button>}
//                       {contrat.statut === 'actif' && (
//                         <>
//                           <button onClick={() => handleContractStatusChange(contrat.id, 'termine')} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Check className="w-4 h-4" /></button>
//                           <button onClick={() => handleContractStatusChange(contrat.id, 'annule')} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Ban className="w-4 h-4" /></button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* ========== ONGLET SESSIONS ========== */}
//       {activeTab === 'sessions' && (
//         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
//             <div><h3 className="font-semibold text-gray-900 flex items-center gap-2"><Calendar className="w-5 h-5 text-gray-700" />Mes sessions</h3><p className="text-sm text-gray-500 mt-0.5">{sessions.length} session{sessions.length > 1 ? 's' : ''} • {sessionsPlanifiees} à venir • {sessionsTerminees} terminée{sessionsTerminees > 1 ? 's' : ''}</p></div>
//             <button onClick={loadSessions} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> Actualiser</button>
//           </div>
//           {loadingSessions ? <div className="flex items-center justify-center py-16"><Loader /></div> : sessions.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 px-6"><Calendar className="w-16 h-16 text-gray-300 mb-4" /><p className="text-gray-500 text-lg font-medium mb-1">Aucune session</p></div>
//           ) : (
//             <div className="divide-y divide-gray-100">
//               {sessions.filter(s => s.statut === 'planifie' || s.statut === 'en_cours').length > 0 && (
//                 <div className="px-6 py-3 bg-blue-50/50"><p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">📅 Sessions à venir</p></div>
//               )}
//               {sessions.filter(s => s.statut === 'planifie' || s.statut === 'en_cours').sort((a, b) => new Date(a.date_session).getTime() - new Date(b.date_session).getTime()).map((session) => (
//                 <div key={session.id} className="p-4 hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => openSessionDetail(session)}>
//                   <div className="flex items-start gap-4">
//                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getSessionStatutColor(session.statut)}`}><Calendar className="w-5 h-5" /></div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 mb-1">
//                         <p className="font-medium text-gray-900">{session.matiere?.nom || 'Session'}{session.eleve && <span className="text-gray-500 font-normal"> - {session.eleve.prenom} {session.eleve.nom}</span>}</p>
//                         <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getSessionStatutColor(session.statut)}`}>{getStatutIcon(session.statut)}{session.statut.replace('_', ' ')}</span>
//                       </div>
//                       <p className="text-sm text-gray-600 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDateLong(session.date_session)}</p>
//                       <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500">
//                         <span><Clock className="w-3 h-3 inline mr-1" />{session.heure_debut?.slice(0, 5)} - {session.heure_fin?.slice(0, 5)}</span><span>•</span><span>{session.duree_minutes} min</span>
//                         {session.files_count ? <><span>•</span><span>{session.files_count} fichier{session.files_count > 1 ? 's' : ''}</span></> : null}
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
//                       {session.statut === 'planifie' && <><button onClick={() => handleSessionStatusChange(session.id, 'en_cours')} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Play className="w-4 h-4" /></button><button onClick={() => handleSessionStatusChange(session.id, 'annule')} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><X className="w-4 h-4" /></button></>}
//                       {session.statut === 'en_cours' && <button onClick={() => handleSessionStatusChange(session.id, 'termine')} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"><StopCircle className="w-4 h-4" /></button>}
//                       <button onClick={() => openSessionDetail(session)} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"><Eye className="w-4 h-4" /></button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* ========== ONGLET CANDIDATURES (envoyées) ========== */}
//       {activeTab === 'candidatures' && (
//         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
//             <div><h3 className="font-semibold text-gray-900 flex items-center gap-2"><Send className="w-5 h-5 text-gray-700" />Mes candidatures envoyées</h3><p className="text-sm text-gray-500 mt-0.5">{candidatures.length} candidature{candidatures.length > 1 ? 's' : ''}</p></div>
//             <div className="flex gap-2">
//               <button onClick={loadCandidatures} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> Actualiser</button>
//               <Link href="/solicitation" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-md"><Search className="w-4 h-4" /> Voir les services</Link>
//             </div>
//           </div>
//           {loadingCandidatures ? <div className="flex items-center justify-center py-16"><Loader /></div> : candidatures.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 px-6"><Send className="w-16 h-16 text-gray-300 mb-4" /><p className="text-gray-500 text-lg font-medium mb-1">Aucune candidature envoyée</p><Link href="/solicitation" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 font-medium text-sm shadow-md"><Search className="w-4 h-4" /> Découvrir les services</Link></div>
//           ) : (
//             <div className="divide-y divide-gray-100">
//               {candidatures.map((candidature) => (
//                 <div key={candidature.id} className="p-4 hover:bg-gray-50/50 transition-colors">
//                   <div className="flex items-start gap-4">
//                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getCandidatureStatutColor(candidature.statut)}`}><Send className="w-5 h-5" /></div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 mb-1">
//                         <p className="font-medium text-gray-900">{candidature.service_parent?.titre || `Service #${candidature.service_parent_id}`}</p>
//                         <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getCandidatureStatutColor(candidature.statut)}`}>
//                           {candidature.statut === 'en_attente' && <><Clock className="w-3 h-3" /> En attente</>}
//                           {candidature.statut === 'accepte' && <><Check className="w-3 h-3" /> Acceptée</>}
//                           {candidature.statut === 'refuse' && <><X className="w-3 h-3" /> Refusée</>}
//                         </span>
//                       </div>
//                       <p className="text-sm text-gray-600 line-clamp-2 mb-2">{candidature.message}</p>
//                       <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
//                         {candidature.tarif_propose && <span className="flex items-center gap-1 text-green-600 font-medium"><DollarSign className="w-3 h-3" /> {candidature.tarif_propose.toLocaleString()} FC/h</span>}
//                         <span>📆 {formatDate(candidature.created_at)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* ========== ONGLET CANDIDATURES REÇUES (parents → mes services) ========== */}
//       {activeTab === 'candidatures-recues' && (
//         <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
//             <div>
//               <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//                 <UserCheck className="w-5 h-5 text-gray-700" />
//                 Candidatures reçues
//               </h3>
//               <p className="text-sm text-gray-500 mt-0.5">
//                 {candidaturesRecues.length} candidature{candidaturesRecues.length > 1 ? 's' : ''} reçue{candidaturesRecues.length > 1 ? 's' : ''}
//               </p>
//             </div>
//             <button onClick={loadCandidaturesRecues} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1">
//               <RefreshCw className="w-3.5 h-3.5" /> Actualiser
//             </button>
//           </div>

//           {loadingCandidaturesRecues ? (
//             <div className="flex items-center justify-center py-16"><Loader /></div>
//           ) : candidaturesRecues.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 px-6">
//               <UserCheck className="w-16 h-16 text-gray-300 mb-4" />
//               <p className="text-gray-500 text-lg font-medium mb-1">Aucune candidature reçue</p>
//               <p className="text-gray-400 text-sm">Les parents pourront postuler à vos services</p>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-100">
//               {candidaturesRecues.map((candidature) => (
//                 <div key={candidature.id} className="p-4 hover:bg-gray-50/50 transition-colors">
//                   <div className="flex items-start gap-4">
//                     {/* Avatar */}
//                     <div className="flex-shrink-0">
//                       {candidature.parent?.user?.photo_profil ? (
//                         <img src={getPhotoUrl(candidature.parent.user.photo_profil) || ''} alt="" className="w-10 h-10 rounded-full object-cover" />
//                       ) : (
//                         <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
//                           <User className="w-5 h-5 text-purple-600" />
//                         </div>
//                       )}
//                     </div>

//                     {/* Infos */}
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 mb-1">
//                         <p className="font-medium text-gray-900">
//                           {candidature.parent?.user?.username || 'Parent'}
//                         </p>
//                         <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getCandidatureStatutColor(candidature.statut)}`}>
//                           {candidature.statut === 'en_attente' && <><Clock className="w-3 h-3" /> En attente</>}
//                           {candidature.statut === 'accepte' && <><Check className="w-3 h-3" /> Acceptée</>}
//                           {candidature.statut === 'refuse' && <><X className="w-3 h-3" /> Refusée</>}
//                         </span>
//                       </div>

//                       <p className="text-xs text-gray-500">
//                         Service : <span className="font-medium">{candidature.service?.titre || 'N/A'}</span>
//                       </p>

//                       {candidature.eleve && (
//                         <p className="text-xs text-gray-500">
//                           Élève : <span className="font-medium">{candidature.eleve.prenom} {candidature.eleve.nom}</span> • {candidature.eleve.niveau}
//                         </p>
//                       )}

//                       <p className="text-sm text-gray-600 mt-2 line-clamp-2">{candidature.message}</p>

//                       <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
//                         {candidature.tarif_propose && (
//                           <span className="flex items-center gap-1 text-green-600 font-medium">
//                             <DollarSign className="w-3 h-3" /> {candidature.tarif_propose.toLocaleString()} FC/h
//                           </span>
//                         )}
//                         <span>📆 {formatDate(candidature.created_at)}</span>
//                       </div>

//                       {/* ✅ BOUTONS TOUJOURS VISIBLES - En attente */}
//                       {candidature.statut === 'en_attente' && (
//                         <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
//                           <button
//                             onClick={() => openContratModal(candidature)}
//                             className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
//                           >
//                             <FileText className="w-4 h-4" />
//                             Créer un contrat
//                           </button>
//                           <button
//                             onClick={() => handleCandidatureStatus(candidature.id, 'accepte')}
//                             className="px-3 py-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
//                             title="Accepter"
//                           >
//                             <Check className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => handleCandidatureStatus(candidature.id, 'refuse')}
//                             className="px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                             title="Refuser"
//                           >
//                             <X className="w-4 h-4" />
//                           </button>
//                         </div>
//                       )}

//                       {/* ✅ Statut accepté - Bouton pour créer contrat si pas encore fait */}
//                       {candidature.statut === 'accepte' && (
//                         <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
//                           <button
//                             onClick={() => openContratModal(candidature)}
//                             className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
//                           >
//                             <FileText className="w-4 h-4" />
//                             Créer un contrat
//                           </button>
//                         </div>
//                       )}

//                       {/* ✅ Statut refusé - Juste un message */}
//                       {candidature.statut === 'refuse' && (
//                         <div className="mt-3 pt-3 border-t border-gray-100">
//                           <p className="text-xs text-red-500 italic">Candidature refusée</p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* ========== ONGLET DOCUMENTS ========== */}
//       {activeTab === 'documents' && (
//         <div className="bg-white rounded-2xl p-6"><ListeDocuments refresh={refreshDocs} onRefresh={() => setRefreshDocs(prev => prev + 1)} /></div>
//       )}

//       {/* ========== MODALS ========== */}
//       <CreateSessionModal contract={selectedContractForSession} isOpen={showCreateSessionModal} onClose={() => setShowCreateSessionModal(false)}
//         onSuccess={() => { loadSessions(); loadContrats(); setMessage('✅ Session planifiée avec succès !'); setTimeout(() => setMessage(''), 3000) }}
//         onCreating={() => setSaving(true)} onError={() => setSaving(false)} />

//       <SessionDetailModal session={selectedSession} isOpen={showSessionModal} onClose={() => setShowSessionModal(false)}
//         onStatusChange={handleSessionStatusChange} onNotesUpdate={handleNotesUpdate} />

//       {/* Modal Négociation */}
//       {showNegotiationModal && selectedContratForNegotiation && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
//             <div className="p-6 border-b flex justify-between items-center">
//               <div><h2 className="text-xl font-semibold flex items-center gap-2"><MessageSquare className="w-5 h-5 text-blue-600" />Négociation en direct</h2>
//                 <div className="flex items-center gap-2 mt-1"><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" /></span><span className="text-xs text-green-600 font-medium">Temps réel actif</span></div></div>
//               <button onClick={closeNegotiation} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
//             </div>
//             <div className="flex-1 overflow-y-auto p-6 space-y-4">
//               <div className="bg-blue-50 rounded-xl p-4 mb-4"><p className="text-sm font-medium text-blue-900">{selectedContratForNegotiation.titre}</p><p className="text-xs text-blue-700 mt-1">Tarif actuel : {selectedContratForNegotiation.tarif_final?.toLocaleString()} FC/h • Statut : {selectedContratForNegotiation.statut.replace('_', ' ')}</p></div>
//               {negotiationMessages.length === 0 ? <div className="text-center py-8 text-gray-400"><MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" /><p className="text-sm">Aucun message. Commencez la négociation.</p></div> : negotiationMessages.map((msg, index) => (
//                 <div key={msg.id || index} className={`flex ${msg.sender === 'precepteur' ? 'justify-end' : 'justify-start'}`}>
//                   <div className={`max-w-[80%] p-3 rounded-xl ${msg.sender === 'precepteur' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'}`}>
//                     <p className="text-sm">{msg.message}</p>{msg.tarif_propose && <p className="text-xs mt-1 opacity-75">💰 Proposition : {msg.tarif_propose.toLocaleString()} FC/h</p>}<p className="text-xs mt-1 opacity-50">{formatDateTime(msg.created_at)}</p>
//                   </div>
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>
//             <form onSubmit={sendNegotiationMessage} className="p-4 border-t bg-gray-50">
//               <div className="flex gap-2">
//                 <div className="flex-1 space-y-2">
//                   <input type="text" value={negotiationForm.message} onChange={(e) => setNegotiationForm({...negotiationForm, message: e.target.value})} placeholder="Votre message..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" required />
//                   <div className="flex items-center gap-2"><label className="text-xs text-gray-500">Contre-proposition (FC/h) :</label><input type="number" value={negotiationForm.tarif_propose} onChange={(e) => setNegotiationForm({...negotiationForm, tarif_propose: Number(e.target.value)})} className="w-32 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" min="0" step="1000" /></div>
//                 </div>
//                 <button type="submit" disabled={sendingNegotiation} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 self-end">{sendingNegotiation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Modal Création Contrat depuis Candidature Parent */}
//       {showContratModal && selectedCandidature && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b flex justify-between items-center">
//               <h2 className="text-xl font-semibold flex items-center gap-2"><FileText className="w-5 h-5 text-green-600" />Créer un contrat</h2>
//               <button onClick={() => setShowContratModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
//             </div>
//             <form onSubmit={handleCreateContrat} className="p-6 space-y-4">
//               <div className="bg-blue-50 rounded-xl p-4">
//                 <p className="text-sm font-medium text-blue-900">{selectedCandidature.service?.titre || 'Service'}</p>
//                 <p className="text-xs text-blue-700 mt-1">Parent : {selectedCandidature.parent?.user?.username} • {selectedCandidature.tarif_propose ? `${selectedCandidature.tarif_propose.toLocaleString()} FC/h` : ''}</p>
//                 {selectedCandidature.eleve && <p className="text-xs text-blue-700">Élève : {selectedCandidature.eleve.prenom} {selectedCandidature.eleve.nom} • {selectedCandidature.eleve.niveau}</p>}
//               </div>
//               <div><label className="block text-sm font-medium text-gray-700 mb-1">Date de début *</label><input type="date" value={contratForm.date_debut} onChange={(e) => setContratForm({...contratForm, date_debut: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" /></div>
//               <div><label className="block text-sm font-medium text-gray-700 mb-1">Durée *</label><select value={contratForm.duree} onChange={(e) => setContratForm({...contratForm, duree: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"><option value="1_mois">1 mois</option><option value="3_mois">3 mois</option><option value="6_mois">6 mois</option><option value="12_mois">1 an</option><option value="indetermine">Indéterminée</option></select></div>
//               <div><label className="block text-sm font-medium text-gray-700 mb-1">Tarif final (FC/h) *</label><input type="number" value={contratForm.tarif_final} onChange={(e) => setContratForm({...contratForm, tarif_final: Number(e.target.value)})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" min="0" step="1000" /></div>
//               <div><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label><textarea value={contratForm.notes} onChange={(e) => setContratForm({...contratForm, notes: e.target.value})} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" /></div>
//               <div className="flex gap-2 pt-2">
//                 <button type="button" onClick={() => setShowContratModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">Annuler</button>
//                 <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}Créer le contrat</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Modal Profil */}
//       {showModal && <ProfilModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={handleSave} initialData={form} selectedMatieres={selectedMatieres} onMatieresChange={setSelectedMatieres} saving={saving} />}
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
import { getSessions, getSessionsByContract } from '@/lib/session-api'
import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { 
  User, MapPin, Star, Clock, BookOpen, GraduationCap, Calendar, 
  Edit3, Check, X, Upload, Plus, Trash2, Eye, AlertCircle, 
  ChevronDown, Filter, Play, StopCircle, Ban, RotateCcw, FileText, 
  Users, Tag, Phone, Mail, Building, CreditCard, Search, Hash, MessageSquare, 
  Activity, RefreshCw, Send, Loader2, DollarSign, Video, UserCheck, Briefcase
} from 'lucide-react'
import { PiBookOpen, PiPlus, PiTrash } from 'react-icons/pi'
import Loader from '@/components/Loader'
import { CheckBadgeIcon } from '@heroicons/react/24/solid'

// Types
type Contrat = {
  id: string
  service_parent_id?: string
  service_precepteur_id?: string
  parent_id: string
  precepteur_id: number
  eleve_id?: string
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
  parent?: any
  eleve?: any
  matiere_obj?: any
  sessions?: Session[] | null
}

type Session = {
  id: number
  contract_id: number
  date_session: string
  heure_debut: string
  heure_fin: string
  duree_minutes: number
  statut: 'planifie' | 'en_cours' | 'termine' | 'annule' | 'reporte'
  type_session: 'presentiel' | 'en_ligne' | 'hybride'
  lieu: string | null
  lien_visio: string | null
  notes_precepteur: string | null
  notes_parent: string | null
  feedback_precepteur: string | null
  feedback_parent: string | null
  note_session: number | null
  raison_annulation: string | null
  annule_par: string | null
  created_at: string
  contrat?: any
  eleve?: any
  matiere?: any
  files?: any[]
  grades?: any[]
  files_count?: number
  grades_count?: number
}

type NegotiationMessage = {
  id: string
  contract_id: string
  sender_id: string
  sender: 'parent' | 'precepteur'
  message: string
  tarif_propose: number | null
  created_at: string
}

// Candidature du précepteur vers un service parent
type CandidaturePrecepteur = {
  id: string
  service_parent_id: string
  precepteur_id: number
  message: string
  tarif_propose: number | null
  disponibilites: string | null
  statut: 'en_attente' | 'accepte' | 'refuse'
  created_at: string
  service_parent?: any
}

// Candidature d'un parent vers un service du précepteur
type CandidatureParent = {
  id: string
  service_precepteur_id: string
  parent_id: string
  eleve_id: string
  message: string
  tarif_propose: number | null
  statut: 'en_attente' | 'accepte' | 'refuse'
  created_at: string
  service?: any
  parent?: any
  eleve?: any
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
const POLLING_INTERVAL = 3000

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
  
  // États sessions
  const [sessions, setSessions] = useState<Session[]>([])
  const [loadingSessions, setLoadingSessions] = useState(false)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [showSessionModal, setShowSessionModal] = useState(false)
  const [selectedContractForSession, setSelectedContractForSession] = useState<Contrat | null>(null)
  const [showCreateSessionModal, setShowCreateSessionModal] = useState(false)
  
  // États négociation
  const [showNegotiationModal, setShowNegotiationModal] = useState(false)
  const [selectedContratForNegotiation, setSelectedContratForNegotiation] = useState<Contrat | null>(null)
  const [negotiationForm, setNegotiationForm] = useState({ message: '', tarif_propose: 0 })
  const [negotiationMessages, setNegotiationMessages] = useState<NegotiationMessage[]>([])
  const [sendingNegotiation, setSendingNegotiation] = useState(false)
  
  // États matières
  const [matieres, setMatieres] = useState<any[]>([])
  const [selectedMatieres, setSelectedMatieres] = useState<number[]>([])
  
  // États candidatures (précepteur → services parents)
  const [candidatures, setCandidatures] = useState<CandidaturePrecepteur[]>([])
  const [loadingCandidatures, setLoadingCandidatures] = useState(false)
  
  // États candidatures reçues (parents → mes services)
  const [candidaturesRecues, setCandidaturesRecues] = useState<CandidatureParent[]>([])
  const [loadingCandidaturesRecues, setLoadingCandidaturesRecues] = useState(false)
  
  // Modal création contrat depuis candidature parent
  const [showContratModal, setShowContratModal] = useState(false)
  const [selectedCandidature, setSelectedCandidature] = useState<CandidatureParent | null>(null)
  const [contratForm, setContratForm] = useState({ date_debut: '', duree: '1_mois', tarif_final: 0, notes: '' })
  
  // États formulaire profil
  const [form, setForm] = useState<ProfilForm>({
    latitude: '', longitude: '', commune: '', quartier: '',
    annees_experience: 0, diplome: '', etablissement_origine: '', telephone: ''
  })
  
  const [disponible, setDisponible] = useState(precepteurInfo?.disponible ?? true)

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // ============ INITIALISATION ============
  useEffect(() => {
    let isMounted = true
    const initializeData = async () => {
      if (!user) { setLoading(false); return }
      if (!precepteurInfo) await refreshPrecepteurInfo()
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
        await Promise.all([loadContrats(), loadMatieres(), loadCandidatures(), loadCandidaturesRecues(), loadSessions()])
      }
      if (isMounted) setLoading(false)
    }
    initializeData()
    return () => { isMounted = false }
  }, [user?.id, precepteurInfo?.id])

  useEffect(() => {
    return () => { if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current) }
  }, [])

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [negotiationMessages])

  // ============ CHARGEMENT ============
  const loadSessions = useCallback(async () => {
    setLoadingSessions(true)
    try { const data = await getSessions(); setSessions(data.sessions || []) }
    catch (error) { console.error('❌ Erreur chargement sessions:', error) }
    finally { setLoadingSessions(false) }
  }, [])

  const loadNegotiationMessages = async (contratId: string) => {
    try {
      const token = localStorage.getItem('excellence-token')
      if (!token) return
      const response = await fetch(`${API_URL}/auth/contracts/${contratId}/negotiations`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      })
      if (response.ok) { const data = await response.json(); setNegotiationMessages(data.messages || []) }
    } catch (error) { console.error('❌ Erreur chargement négociations:', error) }
  }

  const startNegotiationPolling = (contratId: string) => {
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current)
    loadNegotiationMessages(contratId)
    pollingIntervalRef.current = setInterval(() => loadNegotiationMessages(contratId), POLLING_INTERVAL)
  }

  const stopNegotiationPolling = () => {
    if (pollingIntervalRef.current) { clearInterval(pollingIntervalRef.current); pollingIntervalRef.current = null }
  }

  const loadContrats = useCallback(async () => {
    if (!precepteurInfo) return
    setLoadingContrats(true)
    try {
      const token = localStorage.getItem('excellence-token')
      if (!token) return
      const response = await fetch(`${API_URL}/auth/contracts`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      })
      const data = await response.json()
      if (data.success) setContrats(data.contrats || [])
    } catch (error) { console.error('❌ Erreur chargement contrats:', error) }
    finally { setLoadingContrats(false) }
  }, [precepteurInfo])

  const loadMatieres = async () => {
    try {
      const result = await getPrecepteurMatieres()
      if (result.success) setMatieres(result.matieres || [])
    } catch (error) { console.error('❌ Erreur chargement matières:', error) }
  }

  // Charger mes candidatures envoyées (précepteur → services parents)
  const loadCandidatures = async () => {
    if (!precepteurInfo) return
    setLoadingCandidatures(true)
    try {
      const token = localStorage.getItem('excellence-token')
      if (!token) return
      const response = await fetch(`${API_URL}/auth/candidatures/mes-candidatures`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success) setCandidatures(data.candidatures || [])
      }
    } catch (error) { console.error('❌ Erreur chargement candidatures:', error) }
    finally { setLoadingCandidatures(false) }
  }

  // Charger les candidatures reçues (parents → mes services)
  const loadCandidaturesRecues = async () => {
    if (!precepteurInfo) return
    setLoadingCandidaturesRecues(true)
    try {
      const token = localStorage.getItem('excellence-token')
      if (!token) return
      const response = await fetch(`${API_URL}/auth/precepteur/candidatures`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success) setCandidaturesRecues(data.candidatures || [])
      }
    } catch (error) { console.error('❌ Erreur chargement candidatures reçues:', error) }
    finally { setLoadingCandidaturesRecues(false) }
  }

  // ============ GESTION SESSIONS ============
  const handleSessionStatusChange = async (sessionId: number, newStatus: string) => {
    try {
      await updateSessionStatus(sessionId, newStatus)
      setMessage(`✅ Session ${newStatus.replace('_', ' ')} avec succès`)
      await loadSessions()
      setTimeout(() => setMessage(''), 3000)
    } catch (error) { setMessage('Erreur lors du changement de statut') }
  }

  const handleNotesUpdate = async (sessionId: number, notes: string) => {
    try {
      await updateSessionNotes(sessionId, notes)
      setMessage('✅ Notes sauvegardées avec succès')
      await loadSessions()
      setTimeout(() => setMessage(''), 3000)
    } catch (error) { setMessage('Erreur lors de la sauvegarde des notes') }
  }

  const openSessionDetail = (session: Session) => { setSelectedSession(session); setShowSessionModal(true) }
  const openCreateSession = (contrat: Contrat) => { setSelectedContractForSession(contrat); setShowCreateSessionModal(true) }

  // ============ GESTION CONTRATS ============
  const handleContractStatusChange = async (contratId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('excellence-token')
      if (!token) return
      const response = await fetch(`${API_URL}/auth/contracts/${contratId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ statut: newStatus })
      })
      if (response.ok) {
        setMessage(`✅ Contrat ${newStatus.replace('_', ' ')} avec succès`)
        setTimeout(() => setMessage(''), 3000)
        loadContrats()
      }
    } catch (error) { console.error('❌ Erreur changement statut contrat:', error) }
  }

  // Gestion candidatures reçues
  const handleCandidatureStatus = async (candidatureId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('excellence-token')
      if (!token) return
      const response = await fetch(`${API_URL}/auth/parent/candidatures/${candidatureId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ statut: newStatus })
      })
      if (response.ok) {
        setMessage(`✅ Candidature ${newStatus === 'accepte' ? 'acceptée' : 'refusée'}`)
        loadCandidaturesRecues()
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) { console.error('❌ Erreur statut candidature:', error) }
  }

  // Ouvrir le modal de création de contrat
  const openContratModal = (candidature: CandidatureParent) => {
    setSelectedCandidature(candidature)
    setContratForm({
      date_debut: new Date().toISOString().split('T')[0],
      duree: '1_mois',
      tarif_final: candidature.tarif_propose || candidature.service?.tarif_horaire || 0,
      notes: ''
    })
    setShowContratModal(true)
  }

  // Créer un contrat depuis une candidature parent
  const handleCreateContrat = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem('excellence-token')
      if (!token) return
      const response = await fetch(`${API_URL}/auth/parent/candidatures/${selectedCandidature?.id}/contrat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(contratForm)
      })
      const data = await response.json()
      if (response.ok) {
        setMessage('✅ Contrat créé avec succès !')
        setShowContratModal(false)
        loadContrats()
        loadCandidaturesRecues()
      } else {
        setMessage(data.error || 'Erreur lors de la création du contrat')
      }
    } catch (error) { console.error('❌ Erreur création contrat:', error) }
    finally { setSaving(false); setTimeout(() => setMessage(''), 3000) }
  }

  // ============ GESTION NÉGOCIATION ============
  const openNegotiation = async (contrat: Contrat) => {
    setSelectedContratForNegotiation(contrat)
    setNegotiationForm({ message: '', tarif_propose: contrat.tarif_final })
    startNegotiationPolling(contrat.id)
    setShowNegotiationModal(true)
  }

  const closeNegotiation = () => { stopNegotiationPolling(); setShowNegotiationModal(false); setSelectedContratForNegotiation(null) }

  const sendNegotiationMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setSendingNegotiation(true)
    try {
      const token = localStorage.getItem('excellence-token')
      if (!token) throw new Error('Non connecté')
      const response = await fetch(`${API_URL}/auth/contracts/${selectedContratForNegotiation?.id}/negotiations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ message: negotiationForm.message, tarif_propose: negotiationForm.tarif_propose })
      })
      if (response.ok && selectedContratForNegotiation) {
        await loadNegotiationMessages(selectedContratForNegotiation.id)
        setNegotiationForm({ ...negotiationForm, message: '' })
      }
    } catch (error) { console.error('❌ Erreur envoi message:', error) }
    finally { setSendingNegotiation(false) }
  }

  // ============ GESTION PROFIL ============
  const handleSave = async (data: ProfilForm & { matieres: number[] }) => {
    setSaving(true); setMessage('')
    try {
      const result = await updatePrecepteurProfil({
        latitude: data.latitude || undefined, longitude: data.longitude || undefined,
        commune: data.commune || undefined, quartier: data.quartier || undefined,
        annees_experience: data.annees_experience || 0, diplome: data.diplome || undefined,
        etablissement_origine: data.etablissement_origine || undefined,
        telephone: data.telephone || undefined, matieres: data.matieres
      })
      if (result.success) { setShowModal(false); setMessage('✅ Profil mis à jour avec succès !'); await refreshPrecepteurInfo() }
      else setMessage(result.error || 'Erreur lors de la mise à jour')
    } catch (error) { setMessage('Erreur lors de la mise à jour du profil') }
    finally { setSaving(false); setTimeout(() => setMessage(''), 3000) }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setMessage('Image trop volumineuse. Maximum 5MB.'); setTimeout(() => setMessage(''), 3000); return }
    setUploading(true)
    try {
      const result = await updateProfilePhoto(file)
      if (result.success && result.photoUrl) { updateUser({ photo_profil: result.photoUrl }); setMessage('Photo mise à jour avec succès') }
      else setMessage(result.error || 'Erreur lors de la mise à jour')
    } catch (error) { setMessage('Erreur lors de l\'upload de la photo') }
    finally { setUploading(false); setTimeout(() => setMessage(''), 3000) }
  }

  const toggleDisponible = async () => {
    const newDisponible = !disponible; setDisponible(newDisponible)
    try {
      const result = await updatePrecepteurDisponibility(newDisponible)
      if (result.success) await refreshPrecepteurInfo()
      else { setDisponible(!newDisponible); setMessage(result.error || 'Erreur lors de la mise à jour') }
    } catch (error) { setDisponible(!newDisponible); setMessage('Erreur lors de la mise à jour') }
  }

  const handleMatiereToggle = (matiereId: number) => {
    setSelectedMatieres(prev => prev.includes(matiereId) ? prev.filter(id => id !== matiereId) : [...prev, matiereId])
  }

  const openModal = () => {
    if (precepteurInfo) {
      setForm({
        latitude: precepteurInfo.latitude?.toString() || '', longitude: precepteurInfo.longitude?.toString() || '',
        commune: precepteurInfo.commune || '', quartier: precepteurInfo.quartier || '',
        annees_experience: precepteurInfo.annees_experience || 0, diplome: precepteurInfo.diplome || '',
        telephone: precepteurInfo.telephone || '', etablissement_origine: precepteurInfo.etablissement_origine || ''
      })
    }
    setShowModal(true)
  }

  // ============ HELPERS UI ============
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

  const getSessionStatutColor = (statut: string) => {
    switch (statut) {
      case 'planifie': return 'bg-blue-100 text-blue-800'
      case 'en_cours': return 'bg-yellow-100 text-yellow-800'
      case 'termine': return 'bg-green-100 text-green-800'
      case 'annule': return 'bg-red-100 text-red-800'
      case 'reporte': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'planifie': case 'en_attente': return <Clock className="w-4 h-4" />
      case 'en_cours': return <Play className="w-4 h-4" />
      case 'termine': case 'accepte': case 'actif': return <Check className="w-4 h-4" />
      case 'refuse': case 'annule': return <X className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const getFrequenceLabel = (frequence: string) => {
    switch (frequence) {
      case 'unique': return 'Ponctuel'; case 'hebdomadaire': return 'Hebdomadaire'
      case 'bi-hebdomadaire': return '2x/semaine'; case 'mensuel': return 'Mensuel'
      default: return frequence
    }
  }

  const getDureeLabel = (duree: string) => {
    switch (duree) {
      case '1_mois': return '1 mois'; case '3_mois': return '3 mois'
      case '6_mois': return '6 mois'; case '12_mois': return '1 an'
      case 'indetermine': return 'Indéterminée'; default: return duree
    }
  }

  const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
  const formatDateLong = (date: string) => new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const formatDateTime = (date: string) => new Date(date).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  const getPhotoUrl = (photoPath: string | null | undefined) => {
    if (!photoPath) return null
    if (photoPath.startsWith('http')) return photoPath
    return `${API_URL.replace('/api', '')}${photoPath}`
  }

  // ============ STATS ============
  const contratsActifs = contrats.filter(c => c.statut === 'actif' || c.statut === 'accepte').length
  const sessionsPlanifiees = sessions.filter(s => s.statut === 'planifie' || s.statut === 'en_cours').length
  const sessionsTerminees = sessions.filter(s => s.statut === 'termine').length

  // ============ LOADING ============
  if (loading) return <div className='flex items-center justify-center h-screen'><div className='w-20'><Loader/></div></div>
  if (!user) return null

  // ============ RENDU ============
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${message.includes('Erreur') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {message.includes('Erreur') ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <Check className="w-4 h-4 flex-shrink-0" />}
          {message}
        </div>
      )}

      {/* Message profil incomplet */}
      {precepteurInfo && (!precepteurInfo.commune || !precepteurInfo.quartier || !precepteurInfo.diplome || !precepteurInfo.etablissement_origine || precepteurInfo.annees_experience === 0 || precepteurInfo.statut_verification === 'en_attente' || precepteurInfo.statut_verification === 'rejete') && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5"><AlertCircle className="w-5 h-5 text-amber-600" /></div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-amber-800 mb-1">
              {precepteurInfo.statut_verification === 'rejete' ? 'Votre dossier a été rejeté' : precepteurInfo.statut_verification === 'en_attente' ? 'Votre dossier est en attente de vérification' : 'Profil incomplet'}
            </h3>
            <p className="text-sm text-amber-700">
              {precepteurInfo.statut_verification === 'rejete' ? 'Votre dossier a été rejeté. Veuillez mettre à jour vos informations.' : 'Complétez votre profil pour apparaître dans les recherches.'}
            </p>
            <button onClick={openModal} className="mt-3 px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2">
              <Edit3 className="w-4 h-4" /> Modifier le profil
            </button>
          </div>
        </div>
      )}

      {/* ========== CARD PROFIL ========== */}
      <div className="bg-white rounded-2xl mb-6 p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
          <div className="relative group w-24 h-24 flex-shrink-0 mx-auto md:mx-0">
            {user.photo_profil ? (
              <img src={getPhotoUrl(user.photo_profil) || ''} alt="" className="w-24 h-24 rounded-full object-cover border-2 border-gray-100"
                onError={(e) => { e.currentTarget.style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex' }} />
            ) : null}
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-2 border-gray-100 ${user.photo_profil ? 'hidden' : 'flex'}`}>
              <User className="w-10 h-10 text-blue-400" />
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              {uploading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <Upload className="w-5 h-5 text-white" />}
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold">{user.username}
              {precepteurInfo?.statut_verification === 'verifie' && (
                <span className="inline-flex items-center gap-1 ml-2 text-blue-600"><CheckBadgeIcon className="w-5 h-5" /><span className="text-sm font-normal">Vérifié</span></span>
              )}
            </h1>
            <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2 mt-1">
              <GraduationCap className="w-4 h-4" /> Précepteur
              {selectedMatieres.length > 0 && <span className="text-sm text-gray-500">• {selectedMatieres.length} matière{selectedMatieres.length > 1 ? 's' : ''}</span>}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              {precepteurInfo?.commune ? <span>{precepteurInfo.commune}{precepteurInfo.quartier ? `, ${precepteurInfo.quartier}` : ''}</span> : <span>Localisation non spécifiée</span>}
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
              <Star className="w-4 h-4 text-yellow-500" /><span className="text-sm font-medium">{precepteurInfo?.note_moyenne?.toFixed(1) || '0.0'}/5</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <button onClick={toggleDisponible} className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 font-medium ${disponible ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              {disponible ? <><Check className="w-4 h-4" /> Disponible</> : <><X className="w-4 h-4" /> Indisponible</>}
            </button>
            <Link href="/solicitation" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-md">
              <Search className="w-4 h-4" /> Services disponibles
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl"><p className="text-2xl font-bold text-blue-600">{selectedMatieres.length}</p><p className="text-sm text-gray-600 flex items-center gap-1"><BookOpen className="w-3 h-3" /> Matières</p></div>
          <div className="p-4 bg-green-50 rounded-xl"><p className="text-2xl font-bold text-green-600">{contrats.length}</p><p className="text-sm text-gray-600 flex items-center gap-1"><FileText className="w-3 h-3" /> Contrats</p></div>
          <div className="p-4 bg-purple-50 rounded-xl"><p className="text-2xl font-bold text-purple-600">{contratsActifs}</p><p className="text-sm text-gray-600 flex items-center gap-1"><Check className="w-3 h-3" /> Actifs</p></div>
          <div className="p-4 bg-cyan-50 rounded-xl"><p className="text-2xl font-bold text-cyan-600">{sessions.length}</p><p className="text-sm text-gray-600 flex items-center gap-1"><Calendar className="w-3 h-3" /> Sessions</p></div>
          <div className="p-4 bg-teal-50 rounded-xl"><p className="text-2xl font-bold text-teal-600">{candidatures.length + candidaturesRecues.length}</p><p className="text-sm text-gray-600 flex items-center gap-1"><Send className="w-3 h-3" /> Candidatures</p></div>
          <div className="p-4 bg-indigo-50 rounded-xl"><p className="text-2xl font-bold text-indigo-600">{/* Nombre de services du précepteur */}</p><p className="text-sm text-gray-600 flex items-center gap-1"><Briefcase className="w-3 h-3" /> Services</p></div>
        </div>
      </div>

      {/* ========== TABS ========== */}
      <div className="flex gap-4 mb-6 overflow-x-auto flex-wrap">
        {[
          { key: 'profil', icon: User, label: 'Profil' },
          { key: 'matieres', icon: BookOpen, label: `Matières (${selectedMatieres.length})` },
          { key: 'services', icon: Briefcase, label: 'Mes services' },
          { key: 'contrats', icon: FileText, label: `Contrats (${contrats.length})` },
          { key: 'sessions', icon: Calendar, label: `Sessions (${sessions.length})` },
          { key: 'candidatures', icon: Send, label: `Envoyées (${candidatures.length})` },
          { key: 'candidatures-recues', icon: UserCheck, label: `Reçues (${candidaturesRecues.length})` },
          { key: 'documents', icon: FileText, label: 'Documents' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === tab.key ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* ========== ONGLET PROFIL ========== */}
      {activeTab === 'profil' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div><h3 className="font-semibold text-gray-900 flex items-center gap-2"><User className="w-5 h-5 text-gray-700" />Informations du précepteur</h3><p className="text-sm text-gray-500 mt-0.5">Profil professionnel</p></div>
            <button onClick={openModal} className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium"><Edit3 className="w-4 h-4" /> Modifier le profil</button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Commune', value: precepteurInfo?.commune, icon: MapPin },
                { label: 'Quartier', value: precepteurInfo?.quartier, icon: MapPin },
                { label: 'Téléphone', value: precepteurInfo?.telephone, icon: Phone },
                { label: 'Années d\'expérience', value: `${precepteurInfo?.annees_experience || 0} an(s)`, icon: Clock },
                { label: 'Diplôme', value: precepteurInfo?.diplome, icon: GraduationCap },
                { label: 'Établissement d\'origine', value: precepteurInfo?.etablissement_origine, icon: Building },
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><item.icon className="w-3 h-3" /> {item.label}</p>
                  <p className="font-medium text-gray-900">{item.value || 'Non spécifié'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========== ONGLET MATIÈRES ========== */}
      {activeTab === 'matieres' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div><h3 className="font-semibold text-gray-900 flex items-center gap-2"><BookOpen className="w-5 h-5 text-gray-700" />Mes matières</h3><p className="text-sm text-gray-500 mt-0.5">{selectedMatieres.length} matière{selectedMatieres.length > 1 ? 's' : ''}</p></div>
            <button onClick={openModal} className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium"><Plus className="w-4 h-4" /> Gérer les matières</button>
          </div>
          {selectedMatieres.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <BookOpen className="w-16 h-16 text-gray-300 mb-4" /><p className="text-gray-500 text-lg font-medium mb-1">Aucune matière sélectionnée</p>
              <button onClick={openModal} className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium text-sm"><Plus className="w-4 h-4" /> Ajouter des matières</button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {selectedMatieres.map(matiereId => {
                const matiere = matieres.find(m => m.id === matiereId)
                return (
                  <div key={matiereId} className="p-4 hover:bg-gray-50/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center"><BookOpen className="w-5 h-5 text-blue-600" /></div>
                      <div className="flex-1 min-w-0"><p className="font-medium text-gray-900 truncate">{matiere?.nom || `Matière #${matiereId}`}</p>{matiere?.niveau && <p className="text-xs text-gray-500 mt-0.5">🎯 {matiere.niveau}</p>}</div>
                      <button onClick={() => handleMatiereToggle(matiereId)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ========== ONGLET SERVICES (ServiceManager) ========== */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-2xl p-6">
          <ServiceManager precepteurId={precepteurInfo?.id} isOwner={true} />
        </div>
      )}

      {/* ========== ONGLET CONTRATS ========== */}
      {activeTab === 'contrats' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div><h3 className="font-semibold text-gray-900 flex items-center gap-2"><FileText className="w-5 h-5 text-gray-700" />Mes contrats</h3><p className="text-sm text-gray-500 mt-0.5">{contrats.length} contrat{contrats.length > 1 ? 's' : ''}</p></div>
            <button onClick={loadContrats} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> Actualiser</button>
          </div>
          {loadingContrats ? <div className="flex items-center justify-center py-16"><Loader /></div> : contrats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6"><FileText className="w-16 h-16 text-gray-300 mb-4" /><p className="text-gray-500 text-lg font-medium mb-1">Aucun contrat</p></div>
          ) : (
            <div className="divide-y divide-gray-100">
              {contrats.map((contrat) => (
                <div key={contrat.id} className="p-4 hover:bg-gray-50/50 transition-colors group">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getContratStatutColor(contrat.statut)}`}><FileText className="w-5 h-5" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900">{contrat.titre}</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getContratStatutColor(contrat.statut)}`}>{getStatutIcon(contrat.statut)}{contrat.statut.replace('_', ' ')}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span>{contrat.matiere} • {contrat.niveau}</span><span>•</span><span>{getFrequenceLabel(contrat.frequence)}</span><span>•</span>
                        <span className="text-green-600 font-medium">{contrat.tarif_final?.toLocaleString()} FC/h</span><span>•</span><span>{getDureeLabel(contrat.duree)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <span>Début: {formatDate(contrat.date_debut)}</span>
                        {contrat.parent?.user && <><span>•</span><span className="flex items-center gap-1"><User className="w-3 h-3" /> {contrat.parent.user.username}</span></>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      {(contrat.statut === 'actif' || contrat.statut === 'accepte') && (
                        <button onClick={() => openCreateSession(contrat)} className="p-2 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all" title="Planifier une session"><Calendar className="w-4 h-4" /></button>
                      )}
                      <button onClick={() => openNegotiation(contrat)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Négocier"><MessageSquare className="w-4 h-4" /></button>
                      {contrat.statut === 'en_attente' && (
                        <>
                          <button onClick={() => handleContractStatusChange(contrat.id, 'accepte')} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"><Check className="w-4 h-4" /></button>
                          <button onClick={() => handleContractStatusChange(contrat.id, 'refuse')} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><X className="w-4 h-4" /></button>
                        </>
                      )}
                      {contrat.statut === 'accepte' && <button onClick={() => handleContractStatusChange(contrat.id, 'actif')} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"><Play className="w-4 h-4" /></button>}
                      {contrat.statut === 'actif' && (
                        <>
                          <button onClick={() => handleContractStatusChange(contrat.id, 'termine')} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Check className="w-4 h-4" /></button>
                          <button onClick={() => handleContractStatusChange(contrat.id, 'annule')} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Ban className="w-4 h-4" /></button>
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

      {/* ========== ONGLET SESSIONS ========== */}
      {activeTab === 'sessions' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div><h3 className="font-semibold text-gray-900 flex items-center gap-2"><Calendar className="w-5 h-5 text-gray-700" />Mes sessions</h3><p className="text-sm text-gray-500 mt-0.5">{sessions.length} session{sessions.length > 1 ? 's' : ''} • {sessionsPlanifiees} à venir • {sessionsTerminees} terminée{sessionsTerminees > 1 ? 's' : ''}</p></div>
            <button onClick={loadSessions} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> Actualiser</button>
          </div>
          {loadingSessions ? <div className="flex items-center justify-center py-16"><Loader /></div> : sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6"><Calendar className="w-16 h-16 text-gray-300 mb-4" /><p className="text-gray-500 text-lg font-medium mb-1">Aucune session</p></div>
          ) : (
            <div className="divide-y divide-gray-100">
              {sessions.filter(s => s.statut === 'planifie' || s.statut === 'en_cours').length > 0 && (
                <div className="px-6 py-3 bg-blue-50/50"><p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">📅 Sessions à venir</p></div>
              )}
              {sessions.filter(s => s.statut === 'planifie' || s.statut === 'en_cours').sort((a, b) => new Date(a.date_session).getTime() - new Date(b.date_session).getTime()).map((session) => (
                <div key={session.id} className="p-4 hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => openSessionDetail(session)}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getSessionStatutColor(session.statut)}`}><Calendar className="w-5 h-5" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900">{session.matiere?.nom || 'Session'}{session.eleve && <span className="text-gray-500 font-normal"> - {session.eleve.prenom} {session.eleve.nom}</span>}</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getSessionStatutColor(session.statut)}`}>{getStatutIcon(session.statut)}{session.statut.replace('_', ' ')}</span>
                      </div>
                      <p className="text-sm text-gray-600 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{formatDateLong(session.date_session)}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500">
                        <span><Clock className="w-3 h-3 inline mr-1" />{session.heure_debut?.slice(0, 5)} - {session.heure_fin?.slice(0, 5)}</span><span>•</span><span>{session.duree_minutes} min</span>
                        {session.files_count ? <><span>•</span><span>{session.files_count} fichier{session.files_count > 1 ? 's' : ''}</span></> : null}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                      {session.statut === 'planifie' && <><button onClick={() => handleSessionStatusChange(session.id, 'en_cours')} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Play className="w-4 h-4" /></button><button onClick={() => handleSessionStatusChange(session.id, 'annule')} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><X className="w-4 h-4" /></button></>}
                      {session.statut === 'en_cours' && <button onClick={() => handleSessionStatusChange(session.id, 'termine')} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg"><StopCircle className="w-4 h-4" /></button>}
                      <button onClick={() => openSessionDetail(session)} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"><Eye className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========== ONGLET CANDIDATURES (envoyées) ========== */}
      {activeTab === 'candidatures' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div><h3 className="font-semibold text-gray-900 flex items-center gap-2"><Send className="w-5 h-5 text-gray-700" />Mes candidatures envoyées</h3><p className="text-sm text-gray-500 mt-0.5">{candidatures.length} candidature{candidatures.length > 1 ? 's' : ''}</p></div>
            <div className="flex gap-2">
              <button onClick={loadCandidatures} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> Actualiser</button>
              <Link href="/solicitation" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-md"><Search className="w-4 h-4" /> Voir les services</Link>
            </div>
          </div>
          {loadingCandidatures ? <div className="flex items-center justify-center py-16"><Loader /></div> : candidatures.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6"><Send className="w-16 h-16 text-gray-300 mb-4" /><p className="text-gray-500 text-lg font-medium mb-1">Aucune candidature envoyée</p><Link href="/solicitation" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 font-medium text-sm shadow-md"><Search className="w-4 h-4" /> Découvrir les services</Link></div>
          ) : (
            <div className="divide-y divide-gray-100">
              {candidatures.map((candidature) => (
                <div key={candidature.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getCandidatureStatutColor(candidature.statut)}`}><Send className="w-5 h-5" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900">{candidature.service_parent?.titre || `Service #${candidature.service_parent_id}`}</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getCandidatureStatutColor(candidature.statut)}`}>
                          {candidature.statut === 'en_attente' && <><Clock className="w-3 h-3" /> En attente</>}
                          {candidature.statut === 'accepte' && <><Check className="w-3 h-3" /> Acceptée</>}
                          {candidature.statut === 'refuse' && <><X className="w-3 h-3" /> Refusée</>}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{candidature.message}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        {candidature.tarif_propose && <span className="flex items-center gap-1 text-green-600 font-medium"><DollarSign className="w-3 h-3" /> {candidature.tarif_propose.toLocaleString()} FC/h</span>}
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

      {/* ========== ONGLET CANDIDATURES REÇUES (parents → mes services) ========== */}
      {activeTab === 'candidatures-recues' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-gray-700" />
                Candidatures reçues
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                {candidaturesRecues.length} candidature{candidaturesRecues.length > 1 ? 's' : ''} reçue{candidaturesRecues.length > 1 ? 's' : ''}
              </p>
            </div>
            <button onClick={loadCandidaturesRecues} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5" /> Actualiser
            </button>
          </div>

          {loadingCandidaturesRecues ? (
            <div className="flex items-center justify-center py-16"><Loader /></div>
          ) : candidaturesRecues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <UserCheck className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium mb-1">Aucune candidature reçue</p>
              <p className="text-gray-400 text-sm">Les parents pourront postuler à vos services</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {candidaturesRecues.map((candidature) => (
                <div key={candidature.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {candidature.parent?.user?.photo_profil ? (
                        <img src={getPhotoUrl(candidature.parent.user.photo_profil) || ''} alt="" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-purple-600" />
                        </div>
                      )}
                    </div>

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900">
                          {candidature.parent?.user?.username || 'Parent'}
                        </p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getCandidatureStatutColor(candidature.statut)}`}>
                          {candidature.statut === 'en_attente' && <><Clock className="w-3 h-3" /> En attente</>}
                          {candidature.statut === 'accepte' && <><Check className="w-3 h-3" /> Acceptée</>}
                          {candidature.statut === 'refuse' && <><X className="w-3 h-3" /> Refusée</>}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500">
                        Service : <span className="font-medium">{candidature.service?.titre || 'N/A'}</span>
                      </p>

                      {candidature.eleve && (
                        <p className="text-xs text-gray-500">
                          Élève : <span className="font-medium">{candidature.eleve.prenom} {candidature.eleve.nom}</span> • {candidature.eleve.niveau}
                        </p>
                      )}

                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{candidature.message}</p>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                        {candidature.tarif_propose && (
                          <span className="flex items-center gap-1 text-green-600 font-medium">
                            <DollarSign className="w-3 h-3" /> {candidature.tarif_propose.toLocaleString()} FC/h
                          </span>
                        )}
                        <span>📆 {formatDate(candidature.created_at)}</span>
                      </div>

                      {/* BOUTONS - En attente */}
                      {candidature.statut === 'en_attente' && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => openContratModal(candidature)}
                            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
                          >
                            <FileText className="w-4 h-4" />
                            Créer un contrat
                          </button>
                          <button
                            onClick={() => handleCandidatureStatus(candidature.id, 'accepte')}
                            className="px-3 py-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Accepter"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCandidatureStatus(candidature.id, 'refuse')}
                            className="px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Refuser"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* Statut accepté - Bouton pour créer contrat */}
                      {candidature.statut === 'accepte' && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => openContratModal(candidature)}
                            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
                          >
                            <FileText className="w-4 h-4" />
                            Créer un contrat
                          </button>
                        </div>
                      )}

                      {/* Statut refusé */}
                      {candidature.statut === 'refuse' && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-red-500 italic">Candidature refusée</p>
                        </div>
                      )}
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
        <div className="bg-white rounded-2xl p-6"><ListeDocuments refresh={refreshDocs} onRefresh={() => setRefreshDocs(prev => prev + 1)} /></div>
      )}

      {/* ========== MODALS ========== */}
      <CreateSessionModal contract={selectedContractForSession} isOpen={showCreateSessionModal} onClose={() => setShowCreateSessionModal(false)}
        onSuccess={() => { loadSessions(); loadContrats(); setMessage('✅ Session planifiée avec succès !'); setTimeout(() => setMessage(''), 3000) }}
        onCreating={() => setSaving(true)} onError={() => setSaving(false)} />

      <SessionDetailModal session={selectedSession} isOpen={showSessionModal} onClose={() => setShowSessionModal(false)}
        onStatusChange={handleSessionStatusChange} onNotesUpdate={handleNotesUpdate} />

      {/* Modal Négociation */}
      {showNegotiationModal && selectedContratForNegotiation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <div><h2 className="text-xl font-semibold flex items-center gap-2"><MessageSquare className="w-5 h-5 text-blue-600" />Négociation en direct</h2>
                <div className="flex items-center gap-2 mt-1"><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" /></span><span className="text-xs text-green-600 font-medium">Temps réel actif</span></div></div>
              <button onClick={closeNegotiation} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="bg-blue-50 rounded-xl p-4 mb-4"><p className="text-sm font-medium text-blue-900">{selectedContratForNegotiation.titre}</p><p className="text-xs text-blue-700 mt-1">Tarif actuel : {selectedContratForNegotiation.tarif_final?.toLocaleString()} FC/h • Statut : {selectedContratForNegotiation.statut.replace('_', ' ')}</p></div>
              {negotiationMessages.length === 0 ? <div className="text-center py-8 text-gray-400"><MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" /><p className="text-sm">Aucun message. Commencez la négociation.</p></div> : negotiationMessages.map((msg, index) => (
                <div key={msg.id || index} className={`flex ${msg.sender === 'precepteur' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-xl ${msg.sender === 'precepteur' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'}`}>
                    <p className="text-sm">{msg.message}</p>{msg.tarif_propose && <p className="text-xs mt-1 opacity-75">💰 Proposition : {msg.tarif_propose.toLocaleString()} FC/h</p>}<p className="text-xs mt-1 opacity-50">{formatDateTime(msg.created_at)}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendNegotiationMessage} className="p-4 border-t bg-gray-50">
              <div className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <input type="text" value={negotiationForm.message} onChange={(e) => setNegotiationForm({...negotiationForm, message: e.target.value})} placeholder="Votre message..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" required />
                  <div className="flex items-center gap-2"><label className="text-xs text-gray-500">Contre-proposition (FC/h) :</label><input type="number" value={negotiationForm.tarif_propose} onChange={(e) => setNegotiationForm({...negotiationForm, tarif_propose: Number(e.target.value)})} className="w-32 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" min="0" step="1000" /></div>
                </div>
                <button type="submit" disabled={sendingNegotiation} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 self-end">{sendingNegotiation ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Création Contrat depuis Candidature Parent */}
      {showContratModal && selectedCandidature && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2"><FileText className="w-5 h-5 text-green-600" />Créer un contrat</h2>
              <button onClick={() => setShowContratModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateContrat} className="p-6 space-y-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm font-medium text-blue-900">{selectedCandidature.service?.titre || 'Service'}</p>
                <p className="text-xs text-blue-700 mt-1">Parent : {selectedCandidature.parent?.user?.username} • {selectedCandidature.tarif_propose ? `${selectedCandidature.tarif_propose.toLocaleString()} FC/h` : ''}</p>
                {selectedCandidature.eleve && <p className="text-xs text-blue-700">Élève : {selectedCandidature.eleve.prenom} {selectedCandidature.eleve.nom} • {selectedCandidature.eleve.niveau}</p>}
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Date de début *</label><input type="date" value={contratForm.date_debut} onChange={(e) => setContratForm({...contratForm, date_debut: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Durée *</label><select value={contratForm.duree} onChange={(e) => setContratForm({...contratForm, duree: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"><option value="1_mois">1 mois</option><option value="3_mois">3 mois</option><option value="6_mois">6 mois</option><option value="12_mois">1 an</option><option value="indetermine">Indéterminée</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Tarif final (FC/h) *</label><input type="number" value={contratForm.tarif_final} onChange={(e) => setContratForm({...contratForm, tarif_final: Number(e.target.value)})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" min="0" step="1000" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label><textarea value={contratForm.notes} onChange={(e) => setContratForm({...contratForm, notes: e.target.value})} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" /></div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowContratModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">Annuler</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}Créer le contrat</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Profil */}
      {showModal && <ProfilModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={handleSave} initialData={form} selectedMatieres={selectedMatieres} onMatieresChange={setSelectedMatieres} saving={saving} />}
    </div>
  )
}