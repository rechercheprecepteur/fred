
// // // // app/dashboard/parent/contrats/[id]/page.tsx
// // // 'use client'

// // // import { useAuth } from '@/context/AuthContext'
// // // import { useState, useEffect } from 'react'
// // // import { useParams, useRouter } from 'next/navigation'
// // // import Link from 'next/link'
// // // import {
// // //   User,
// // //   MapPin,
// // //   Calendar,
// // //   BookOpen,
// // //   Clock,
// // //   Check,
// // //   X,
// // //   AlertCircle,
// // //   GraduationCap,
// // //   CreditCard,
// // //   FileText,
// // //   Phone,
// // //   Mail,
// // //   ChevronLeft,
// // //   MessageSquare,
// // //   Eye,
// // //   Download,
// // //   Play,
// // //   Image as ImageIcon,
// // //   File,
// // //   Video,
// // //   Award,
// // //   Star,
// // //   Building,
// // //   Tag,
// // //   Activity,
// // //   Hash,
// // //   Send,
// // //   ThumbsUp
// // // } from 'lucide-react'
// // // import Loader from '@/components/Loader'

// // // const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// // // type Session = {
// // //   id: number | string
// // //   contract_id: number | string
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
// // //   files?: SessionFile[]
// // //   grades?: SessionGrade[]
// // //   files_count?: number
// // //   grades_count?: number
// // // }

// // // type SessionFile = {
// // //   id: number | string
// // //   session_id: number | string
// // //   file_name: string
// // //   file_path: string
// // //   file_url?: string
// // //   file_type: string
// // //   file_size: number | null
// // //   uploaded_by: string
// // //   created_at: string
// // // }

// // // type SessionGrade = {
// // //   id: number | string
// // //   session_id: number | string
// // //   titre?: string
// // //   title?: string
// // //   score: number
// // //   max_score: number
// // //   comment: string | null
// // //   created_at: string
// // // }

// // // type PrecepteurRating = {
// // //   id: number | string
// // //   contract_id: number | string
// // //   precepteur_id: number | string
// // //   parent_id: number | string
// // //   note: number
// // //   commentaire: string | null
// // //   created_at: string
// // //   updated_at: string
// // // }

// // // type ContratDetail = {
// // //   id: number | string
// // //   parent_id: number | string
// // //   precepteur_id: number | string
// // //   eleve_id: number | string
// // //   matiere_id: number | string
// // //   date_debut: string
// // //   date_fin: string
// // //   heure_debut_pref: string
// // //   heure_fin_pref: string
// // //   jours_pref: string
// // //   type_contrat: 'recurrent' | 'ponctuel'
// // //   frequence: 'quotidien' | 'hebdomadaire' | 'bihebdomadaire' | 'mensuel' | 'ponctuel'
// // //   tarif_horaire: number | null
// // //   tarif_final?: number
// // //   notes: string | null
// // //   statut: 'en_attente' | 'accepte' | 'refuse' | 'actif' | 'termine' | 'annule'
// // //   created_at: string
// // //   enfant_nom: string
// // //   enfant_prenom: string
// // //   enfant_postnom: string | null
// // //   enfant_niveau: string
// // //   enfant_genre: string
// // //   enfant_date_naissance: string | null
// // //   enfant_ecole: string | null
// // //   matiere_nom: string
// // //   matiere_niveau: string
// // //   matiere_description: string | null
// // //   precepteur_username: string
// // //   precepteur_email: string
// // //   precepteur_telephone: string | null
// // //   precepteur_commune: string
// // //   precepteur_quartier: string
// // //   precepteur_note: number
// // //   precepteur_diplome: string
// // //   precepteur_annees_exp: number
// // //   precepteur_photo: string | null
// // //   parent_telephone: string | null
// // //   parent_adresse: string | null
// // //   sessions: Session[]
// // // }

// // // function getToken(): string | null {
// // //   if (typeof window !== 'undefined') {
// // //     return localStorage.getItem('excellence-token')
// // //   }
// // //   return null
// // // }

// // // export default function ContratDetailPage() {
// // //   const { user } = useAuth()
// // //   const params = useParams()
// // //   const router = useRouter()
// // //   const contratId = params.id as string

// // //   const [contrat, setContrat] = useState<ContratDetail | null>(null)
// // //   const [loading, setLoading] = useState(true)
// // //   const [message, setMessage] = useState('')
// // //   const [activeTab, setActiveTab] = useState<'infos' | 'sessions'>('infos')
// // //   const [selectedSession, setSelectedSession] = useState<Session | null>(null)
// // //   const [showAllSessions, setShowAllSessions] = useState(false)

// // //   // États pour le rating
// // //   const [rating, setRating] = useState<PrecepteurRating | null>(null)
// // //   const [showRatingForm, setShowRatingForm] = useState(false)
// // //   const [newRating, setNewRating] = useState(0)
// // //   const [ratingComment, setRatingComment] = useState('')
// // //   const [hoveredRating, setHoveredRating] = useState(0)
// // //   const [submittingRating, setSubmittingRating] = useState(false)

// // //   useEffect(() => {
// // //     if (user && contratId) loadContrat()
// // //   }, [user, contratId])

// // //   useEffect(() => {
// // //     if (contrat) loadRating()
// // //   }, [contrat])

// // //   // ✅ Charger le contrat via API Express
// // //   const loadContrat = async () => {
// // //     setLoading(true)
    
// // //     try {
// // //       const token = getToken()
// // //       if (!token) {
// // //         setLoading(false)
// // //         return
// // //       }

// // //       // Récupérer les contrats du parent
// // //       const response = await fetch(`${API_URL}/auth/contracts`, {
// // //         headers: {
// // //           'Authorization': `Bearer ${token}`,
// // //           'Content-Type': 'application/json'
// // //         }
// // //       })
      
// // //       const data = await response.json()
      
// // //       if (data.success) {
// // //         // Trouver le contrat spécifique
// // //         const contratTrouve = data.contrats.find((c: any) => String(c.id) === String(contratId))
        
// // //         if (contratTrouve) {
// // //           // ✅ Récupérer les sessions du contrat via l'API sessions
// // //           let sessions: Session[] = []
// // //           try {
// // //             const sessionsResponse = await fetch(`${API_URL}/auth/precepteur/contrats/${contratId}/sessions`, {
// // //               headers: {
// // //                 'Authorization': `Bearer ${token}`,
// // //                 'Content-Type': 'application/json'
// // //               }
// // //             })
// // //             const sessionsData = await sessionsResponse.json()
// // //             if (sessionsData.success) {
// // //               sessions = sessionsData.sessions || []
// // //             }
// // //           } catch (err) {
// // //             console.warn('⚠️ Impossible de charger les sessions:', err)
// // //             sessions = contratTrouve.sessions || []
// // //           }

// // //           // Construire l'objet contrat enrichi
// // //           const enriched: ContratDetail = {
// // //             ...contratTrouve,
// // //             id: contratTrouve.id,
// // //             parent_id: contratTrouve.parent_id,
// // //             precepteur_id: contratTrouve.precepteur_id,
// // //             eleve_id: contratTrouve.eleve_id || contratTrouve.eleve?.id,
// // //             matiere_id: contratTrouve.matiere_id || contratTrouve.matiere?.id,
// // //             date_debut: contratTrouve.date_debut || '',
// // //             date_fin: contratTrouve.date_fin || '',
// // //             heure_debut_pref: contratTrouve.heure_debut_pref || '',
// // //             heure_fin_pref: contratTrouve.heure_fin_pref || '',
// // //             jours_pref: contratTrouve.jours_pref || '',
// // //             type_contrat: contratTrouve.type_contrat || 'ponctuel',
// // //             frequence: contratTrouve.frequence || 'hebdomadaire',
// // //             tarif_horaire: contratTrouve.tarif_horaire || contratTrouve.tarif_final || null,
// // //             notes: contratTrouve.notes || null,
// // //             statut: contratTrouve.statut || 'en_attente',
// // //             created_at: contratTrouve.created_at || '',
// // //             // Enfant
// // //             enfant_nom: contratTrouve.eleve?.nom || '',
// // //             enfant_prenom: contratTrouve.eleve?.prenom || '',
// // //             enfant_postnom: contratTrouve.eleve?.postnom || null,
// // //             enfant_niveau: contratTrouve.eleve?.niveau || contratTrouve.niveau || '',
// // //             enfant_genre: contratTrouve.eleve?.genre || '',
// // //             enfant_date_naissance: contratTrouve.eleve?.date_naissance || null,
// // //             enfant_ecole: contratTrouve.eleve?.ecole || null,
// // //             // Matière
// // //             matiere_nom: contratTrouve.matiere?.nom || contratTrouve.matiere || '',
// // //             matiere_niveau: contratTrouve.matiere?.niveau || contratTrouve.niveau || '',
// // //             matiere_description: contratTrouve.matiere?.description || null,
// // //             // Précepteur
// // //             precepteur_username: contratTrouve.precepteur?.user?.username || '',
// // //             precepteur_email: contratTrouve.precepteur?.user?.email || '',
// // //             precepteur_telephone: contratTrouve.precepteur?.user?.telephone || null,
// // //             precepteur_commune: contratTrouve.precepteur?.commune || '',
// // //             precepteur_quartier: contratTrouve.precepteur?.quartier || '',
// // //             precepteur_note: contratTrouve.precepteur?.note_moyenne || 0,
// // //             precepteur_diplome: contratTrouve.precepteur?.diplome || '',
// // //             precepteur_annees_exp: contratTrouve.precepteur?.annees_experience || 0,
// // //             precepteur_photo: contratTrouve.precepteur?.user?.photo_profil || null,
// // //             // Parent
// // //             parent_telephone: contratTrouve.parent?.telephone || null,
// // //             parent_adresse: contratTrouve.parent?.adresse || null,
// // //             // Sessions
// // //             sessions: sessions
// // //           }

// // //           setContrat(enriched)
// // //         }
// // //       }
// // //     } catch (error) {
// // //       console.error('❌ Erreur chargement contrat:', error)
// // //     }
    
// // //     setLoading(false)
// // //   }

// // //   // ✅ Charger le rating via API Express
// // //   const loadRating = async () => {
// // //     if (!contrat) return

// // //     try {
// // //       const token = getToken()
// // //       if (!token) return

// // //       const response = await fetch(`${API_URL}/auth/precepteur/ratings?contract_id=${contrat.id}`, {
// // //         headers: {
// // //           'Authorization': `Bearer ${token}`,
// // //           'Content-Type': 'application/json'
// // //         }
// // //       })

// // //       if (response.ok) {
// // //         const data = await response.json()
// // //         if (data.success && data.rating) {
// // //           setRating(data.rating)
// // //           setNewRating(data.rating.note)
// // //           setRatingComment(data.rating.commentaire || '')
// // //         }
// // //       }
// // //     } catch (error) {
// // //       console.error('❌ Erreur chargement rating:', error)
// // //     }
// // //   }

// // //   // ✅ Annuler le contrat
// // //   const handleAnnulerContrat = async () => {
// // //     if (!confirm('Voulez-vous vraiment annuler ce contrat ?')) return

// // //     try {
// // //       const token = getToken()
// // //       if (!token) return

// // //       const response = await fetch(`${API_URL}/auth/contracts/${contratId}/status`, {
// // //         method: 'PATCH',
// // //         headers: {
// // //           'Authorization': `Bearer ${token}`,
// // //           'Content-Type': 'application/json'
// // //         },
// // //         body: JSON.stringify({ statut: 'annule' })
// // //       })

// // //       if (response.ok) {
// // //         setMessage('Contrat annulé avec succès')
// // //         await loadContrat()
// // //         setTimeout(() => setMessage(''), 3000)
// // //       }
// // //     } catch (error) {
// // //       console.error('❌ Erreur annulation contrat:', error)
// // //     }
// // //   }

// // //   // ✅ Soumettre un rating
// // //   const handleSubmitRating = async () => {
// // //     if (newRating === 0) return

// // //     setSubmittingRating(true)

// // //     try {
// // //       const token = getToken()
// // //       if (!token) return

// // //       const body = {
// // //         contract_id: contrat!.id,
// // //         precepteur_id: contrat!.precepteur_id,
// // //         note: newRating,
// // //         commentaire: ratingComment || null
// // //       }

// // //       let response
// // //       if (rating) {
// // //         // Modifier
// // //         response = await fetch(`${API_URL}/auth/precepteur/ratings/${rating.id}`, {
// // //           method: 'PUT',
// // //           headers: {
// // //             'Authorization': `Bearer ${token}`,
// // //             'Content-Type': 'application/json'
// // //           },
// // //           body: JSON.stringify(body)
// // //         })
// // //       } else {
// // //         // Créer
// // //         response = await fetch(`${API_URL}/auth/precepteur/ratings`, {
// // //           method: 'POST',
// // //           headers: {
// // //             'Authorization': `Bearer ${token}`,
// // //             'Content-Type': 'application/json'
// // //           },
// // //           body: JSON.stringify(body)
// // //         })
// // //       }

// // //       if (response.ok) {
// // //         setMessage(rating ? 'Votre avis a été modifié avec succès !' : 'Merci pour votre avis !')
// // //         await loadRating()
// // //         await loadContrat()
// // //       }
// // //     } catch (error) {
// // //       console.error('❌ Erreur rating:', error)
// // //       setMessage('Erreur lors de l\'envoi')
// // //     }

// // //     setSubmittingRating(false)
// // //     setShowRatingForm(false)
// // //     setTimeout(() => setMessage(''), 3000)
// // //   }

// // //   // ✅ Télécharger un fichier
// // //   const handleDownloadFile = async (filePath: string, fileName: string) => {
// // //     try {
// // //       const token = getToken()
// // //       if (!token) return

// // //       // Construire l'URL de téléchargement
// // //       const baseUrl = API_URL.replace('/api', '')
// // //       const url = `${baseUrl}${filePath}`
      
// // //       const response = await fetch(url, {
// // //         headers: {
// // //           'Authorization': `Bearer ${token}`
// // //         }
// // //       })

// // //       if (response.ok) {
// // //         const blob = await response.blob()
// // //         const downloadUrl = URL.createObjectURL(blob)
// // //         const a = document.createElement('a')
// // //         a.href = downloadUrl
// // //         a.download = fileName
// // //         a.click()
// // //         URL.revokeObjectURL(downloadUrl)
// // //       }
// // //     } catch (error) {
// // //       console.error('❌ Erreur téléchargement:', error)
// // //     }
// // //   }

// // //   const getPhotoUrl = (photoPath: string | null | undefined) => {
// // //     if (!photoPath) return null
// // //     if (photoPath.startsWith('http')) return photoPath
// // //     const baseUrl = API_URL.replace('/api', '')
// // //     return `${baseUrl}${photoPath}`
// // //   }

// // //   const getStatutStyle = (statut: string) => {
// // //     switch (statut) {
// // //       case 'actif': return 'bg-green-100 text-green-700'
// // //       case 'en_attente': return 'bg-yellow-100 text-yellow-700'
// // //       case 'accepte': return 'bg-blue-100 text-blue-700'
// // //       case 'termine': return 'bg-gray-100 text-gray-700'
// // //       case 'annule': return 'bg-red-100 text-red-700'
// // //       case 'refuse': return 'bg-red-100 text-red-700'
// // //       default: return 'bg-gray-100 text-gray-700'
// // //     }
// // //   }

// // //   const getSessionStatutStyle = (statut: string) => {
// // //     switch (statut) {
// // //       case 'termine': return 'bg-green-100 text-green-700'
// // //       case 'annule': return 'bg-red-100 text-red-700'
// // //       case 'en_cours': return 'bg-yellow-100 text-yellow-700'
// // //       case 'planifie': return 'bg-blue-100 text-blue-700'
// // //       case 'reporte': return 'bg-purple-100 text-purple-700'
// // //       default: return 'bg-gray-100 text-gray-700'
// // //     }
// // //   }

// // //   const getFileIcon = (fileType: string) => {
// // //     switch (fileType) {
// // //       case 'image': return <ImageIcon className="w-4 h-4" />
// // //       case 'pdf': return <FileText className="w-4 h-4" />
// // //       case 'video': return <Video className="w-4 h-4" />
// // //       case 'document': return <FileText className="w-4 h-4" />
// // //       default: return <File className="w-4 h-4" />
// // //     }
// // //   }

// // //   const getFileColor = (fileType: string) => {
// // //     switch (fileType) {
// // //       case 'image': return 'bg-blue-100 text-blue-700'
// // //       case 'pdf': return 'bg-red-100 text-red-700'
// // //       case 'video': return 'bg-purple-100 text-purple-700'
// // //       case 'document': return 'bg-green-100 text-green-700'
// // //       default: return 'bg-gray-100 text-gray-700'
// // //     }
// // //   }

// // //   const formatSize = (bytes: number | null) => {
// // //     if (!bytes) return ''
// // //     if (bytes < 1024) return `${bytes} B`
// // //     if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
// // //     return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
// // //   }

// // //   if (loading) {
// // //     return (
// // //       <div className="flex items-center justify-center h-screen">
// // //         <div className="w-20"><Loader /></div>
// // //       </div>
// // //     )
// // //   }

// // //   if (!contrat) {
// // //     return (
// // //       <div className="max-w-4xl mx-auto px-4 py-12 text-center">
// // //         <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
// // //         <p className="text-gray-500 text-lg">Contrat non trouvé</p>
// // //         <Link href="/dashboard/parent" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
// // //           Retour au tableau de bord
// // //         </Link>
// // //       </div>
// // //     )
// // //   }

// // //   const sessionsTerminees = contrat.sessions.filter(s => s.statut === 'termine').length
// // //   const sessionsAVenir = contrat.sessions.filter(s => s.statut === 'planifie' || s.statut === 'en_cours').length
// // //   const joursLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
// // //   const jours = contrat.jours_pref?.split(',').map((j: string) => joursLabels[parseInt(j) - 1]).join(', ') || 'Non spécifié'

// // //   const displayedSessions = showAllSessions ? contrat.sessions : contrat.sessions.slice(0, 5)

// // //   // Calculer la moyenne globale des cotations
// // //   const allGrades = contrat.sessions.flatMap(s => s.grades || [])
// // //   const moyenneGlobale = allGrades.length > 0
// // //     ? allGrades.reduce((acc, g) => acc + (g.score / g.max_score) * 20, 0) / allGrades.length
// // //     : 0

// // //   return (
// // //     <div className="max-w-6xl mx-auto px-4 py-6">
// // //       {/* Toast */}
// // //       {message && (
// // //         <div className="mb-3 p-3 rounded-xl text-sm flex items-center gap-2 bg-green-50 text-green-600 animate-fadeIn">
// // //           <Check className="w-4 h-4" /> {message}
// // //         </div>
// // //       )}

// // //       {/* Retour */}
// // //       <button
// // //         onClick={() => router.back()}
// // //         className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
// // //       >
// // //         <ChevronLeft className="w-4 h-4" /> Retour
// // //       </button>

// // //       {/* En-tête + Stats */}
// // //       <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100">
// // //         <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
// // //           <div>
// // //             <div className="flex items-center gap-2 mb-1.5">
// // //               <h1 className="text-2xl font-bold text-gray-900">{contrat.matiere_nom}</h1>
// // //               <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatutStyle(contrat.statut)}`}>
// // //                 {contrat.statut.replace('_', ' ')}
// // //               </span>
// // //             </div>
// // //             <p className="text-sm text-gray-500 flex items-center gap-2">
// // //               <Hash className="w-3.5 h-3.5" />
// // //               Contrat N°{contrat.id} • 
// // //               <span className="capitalize">{contrat.type_contrat}</span> • 
// // //               <span className="capitalize">{contrat.frequence}</span>
// // //             </p>
// // //           </div>
// // //           {contrat.statut === 'actif' && (
// // //             <button
// // //               onClick={handleAnnulerContrat}
// // //               className="px-4 py-2 bg-red-50 text-red-600 text-sm rounded-xl hover:bg-red-100 flex items-center gap-2 font-medium transition-colors"
// // //             >
// // //               <X className="w-4 h-4" /> Annuler le contrat
// // //             </button>
// // //           )}
// // //         </div>

// // //         {/* Stats */}
// // //         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
// // //           <div className="bg-blue-50 rounded-xl p-4 text-center">
// // //             <p className="text-2xl font-bold text-blue-600">{contrat.sessions.length}</p>
// // //             <p className="text-xs text-gray-600 mt-0.5">Sessions totales</p>
// // //           </div>
// // //           <div className="bg-green-50 rounded-xl p-4 text-center">
// // //             <p className="text-2xl font-bold text-green-600">{sessionsTerminees}</p>
// // //             <p className="text-xs text-gray-600 mt-0.5">Terminées</p>
// // //           </div>
// // //           <div className="bg-yellow-50 rounded-xl p-4 text-center">
// // //             <p className="text-2xl font-bold text-yellow-600">{sessionsAVenir}</p>
// // //             <p className="text-xs text-gray-600 mt-0.5">À venir / En cours</p>
// // //           </div>
// // //           <div className="bg-purple-50 rounded-xl p-4 text-center">
// // //             <p className="text-2xl font-bold text-purple-600">
// // //               {contrat.tarif_horaire ? `${contrat.tarif_horaire.toLocaleString()} FC` : 'N/A'}
// // //             </p>
// // //             <p className="text-xs text-gray-600 mt-0.5">Tarif/horaire</p>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Navigation par onglets */}
// // //       <div className="flex gap-2 mb-4">
// // //         <button
// // //           onClick={() => setActiveTab('infos')}
// // //           className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
// // //             activeTab === 'infos' 
// // //               ? 'bg-black text-white shadow-lg shadow-black/20' 
// // //               : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
// // //           }`}
// // //         >
// // //           <FileText className="w-4 h-4" />
// // //           Informations contrat
// // //         </button>
// // //         <button
// // //           onClick={() => setActiveTab('sessions')}
// // //           className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
// // //             activeTab === 'sessions' 
// // //               ? 'bg-black text-white shadow-lg shadow-black/20' 
// // //               : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
// // //           }`}
// // //         >
// // //           <Calendar className="w-4 h-4" />
// // //           Sessions ({contrat.sessions.length})
// // //         </button>
// // //       </div>

// // //       {/* Contenu de l'onglet Informations */}
// // //       {activeTab === 'infos' && (
// // //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //           {/* Enfant */}
// // //           <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
// // //             <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
// // //               <span className="p-1.5 bg-blue-50 rounded-lg">
// // //                 <User className="w-4 h-4 text-blue-600" />
// // //               </span>
// // //               Élève
// // //             </h3>
// // //             <div className="space-y-3">
// // //               <div>
// // //                 <p className="text-xs text-gray-400 mb-0.5">Nom complet</p>
// // //                 <p className="text-sm font-semibold text-gray-900">
// // //                   {contrat.enfant_prenom} {contrat.enfant_nom} {contrat.enfant_postnom || ''}
// // //                 </p>
// // //               </div>
// // //               <div>
// // //                 <p className="text-xs text-gray-400 mb-0.5">Niveau scolaire</p>
// // //                 <p className="text-sm font-semibold text-gray-900">{contrat.enfant_niveau}</p>
// // //               </div>
// // //               <div>
// // //                 <p className="text-xs text-gray-400 mb-0.5">Genre</p>
// // //                 <p className="text-sm font-semibold text-gray-900">{contrat.enfant_genre === 'M' ? 'Garçon' : 'Fille'}</p>
// // //               </div>
// // //               {contrat.enfant_date_naissance && (
// // //                 <div>
// // //                   <p className="text-xs text-gray-400 mb-0.5">Date de naissance</p>
// // //                   <p className="text-sm font-semibold text-gray-900">
// // //                     {new Date(contrat.enfant_date_naissance).toLocaleDateString('fr-FR', { 
// // //                       day: 'numeric', month: 'long', year: 'numeric' 
// // //                     })}
// // //                   </p>
// // //                 </div>
// // //               )}
// // //               {contrat.enfant_ecole && (
// // //                 <div>
// // //                   <p className="text-xs text-gray-400 mb-0.5">Établissement</p>
// // //                   <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
// // //                     <Building className="w-3.5 h-3.5 text-gray-400" />
// // //                     {contrat.enfant_ecole}
// // //                   </p>
// // //                 </div>
// // //               )}
// // //             </div>
// // //           </div>

// // //           {/* Précepteur */}
// // //           <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
// // //             <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
// // //               <span className="p-1.5 bg-purple-50 rounded-lg">
// // //                 <GraduationCap className="w-4 h-4 text-purple-600" />
// // //               </span>
// // //               Précepteur
// // //             </h3>
// // //             <div className="space-y-3">
// // //               <div className="flex items-center gap-3 mb-3">
// // //                 {contrat.precepteur_photo ? (
// // //                   <img src={getPhotoUrl(contrat.precepteur_photo) || ''} alt="Précepteur" className="w-12 h-12 rounded-full object-cover" />
// // //                 ) : (
// // //                   <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
// // //                     <User className="w-6 h-6 text-gray-400" />
// // //                   </div>
// // //                 )}
// // //                 <div>
// // //                   <p className="text-sm font-semibold text-gray-900">{contrat.precepteur_username}</p>
// // //                   <div className="flex items-center gap-1 text-sm text-yellow-600">
// // //                     <Star className="w-3.5 h-3.5 fill-current" />
// // //                     {contrat.precepteur_note?.toFixed(1) || '0.0'}/5
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //               <div>
// // //                 <p className="text-xs text-gray-400 mb-0.5">Expérience & Diplôme</p>
// // //                 <p className="text-sm font-semibold text-gray-900">
// // //                   {contrat.precepteur_annees_exp} an(s) d'expérience • {contrat.precepteur_diplome || 'Diplôme non spécifié'}
// // //                 </p>
// // //               </div>
// // //               {contrat.precepteur_telephone && (
// // //                 <div>
// // //                   <p className="text-xs text-gray-400 mb-0.5">Téléphone</p>
// // //                   <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
// // //                     <Phone className="w-3.5 h-3.5 text-gray-400" />
// // //                     {contrat.precepteur_telephone}
// // //                   </p>
// // //                 </div>
// // //               )}
// // //               {contrat.precepteur_email && (
// // //                 <div>
// // //                   <p className="text-xs text-gray-400 mb-0.5">Email</p>
// // //                   <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
// // //                     <Mail className="w-3.5 h-3.5 text-gray-400" />
// // //                     {contrat.precepteur_email}
// // //                   </p>
// // //                 </div>
// // //               )}
// // //               <div>
// // //                 <p className="text-xs text-gray-400 mb-0.5">Localisation</p>
// // //                 <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
// // //                   <MapPin className="w-3.5 h-3.5 text-gray-400" />
// // //                   {[contrat.precepteur_quartier, contrat.precepteur_commune].filter(Boolean).join(', ') || 'Non spécifiée'}
// // //                 </p>
// // //               </div>

// // //               {/* Section Rating */}
// // //               <div className="mt-4 pt-4 border-t border-gray-100">
// // //                 {!showRatingForm ? (
// // //                   <div>
// // //                     {rating ? (
// // //                       <div className="bg-yellow-50 rounded-xl p-3">
// // //                         <p className="text-xs text-yellow-600 mb-1 font-medium flex items-center gap-1">
// // //                           <ThumbsUp className="w-3.5 h-3.5" />
// // //                           Votre évaluation
// // //                         </p>
// // //                         <div className="flex items-center gap-0.5 mb-1">
// // //                           {[1, 2, 3, 4, 5].map((star) => (
// // //                             <Star
// // //                               key={star}
// // //                               className={`w-5 h-5 ${
// // //                                 star <= rating.note
// // //                                   ? 'text-yellow-500 fill-current'
// // //                                   : 'text-gray-300'
// // //                               }`}
// // //                             />
// // //                           ))}
// // //                           <span className="ml-1 text-sm font-semibold text-yellow-700">
// // //                             {rating.note}/5
// // //                           </span>
// // //                         </div>
// // //                         {rating.commentaire && (
// // //                           <p className="text-sm text-gray-700 mt-1 italic">"{rating.commentaire}"</p>
// // //                         )}
// // //                         <button
// // //                           onClick={() => setShowRatingForm(true)}
// // //                           className="text-xs text-blue-600 hover:underline mt-2 font-medium"
// // //                         >
// // //                           Modifier mon avis
// // //                         </button>
// // //                       </div>
// // //                     ) : (
// // //                       <button
// // //                         onClick={() => setShowRatingForm(true)}
// // //                         className="w-full px-4 py-2.5 bg-yellow-50 text-yellow-700 rounded-xl hover:bg-yellow-100 flex items-center justify-center gap-2 font-medium transition-colors text-sm border border-yellow-200"
// // //                       >
// // //                         <Star className="w-4 h-4" />
// // //                         Noter ce précepteur
// // //                       </button>
// // //                     )}
// // //                   </div>
// // //                 ) : (
// // //                   <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
// // //                     <p className="text-sm font-semibold text-gray-900 mb-3">
// // //                       {rating ? 'Modifier votre évaluation' : 'Évaluer ce précepteur'}
// // //                     </p>
                    
// // //                     <div className="flex items-center gap-1 mb-3">
// // //                       {[1, 2, 3, 4, 5].map((star) => (
// // //                         <button
// // //                           key={star}
// // //                           onClick={() => setNewRating(star)}
// // //                           onMouseEnter={() => setHoveredRating(star)}
// // //                           onMouseLeave={() => setHoveredRating(0)}
// // //                           className="transition-transform hover:scale-110"
// // //                         >
// // //                           <Star
// // //                             className={`w-8 h-8 ${
// // //                               star <= (hoveredRating || newRating)
// // //                                 ? 'text-yellow-500 fill-current'
// // //                                 : 'text-gray-300'
// // //                             }`}
// // //                           />
// // //                         </button>
// // //                       ))}
// // //                       {newRating > 0 && (
// // //                         <span className="ml-2 text-sm font-medium text-gray-700">
// // //                           {newRating}/5
// // //                         </span>
// // //                       )}
// // //                     </div>

// // //                     <textarea
// // //                       value={ratingComment}
// // //                       onChange={(e) => setRatingComment(e.target.value)}
// // //                       placeholder="Partagez votre expérience avec ce précepteur (optionnel)..."
// // //                       rows={3}
// // //                       className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
// // //                     />

// // //                     <div className="flex gap-2 mt-3">
// // //                       <button
// // //                         onClick={() => {
// // //                           setShowRatingForm(false)
// // //                           setNewRating(rating?.note || 0)
// // //                           setRatingComment(rating?.commentaire || '')
// // //                         }}
// // //                         className="flex-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
// // //                       >
// // //                         Annuler
// // //                       </button>
// // //                       <button
// // //                         onClick={handleSubmitRating}
// // //                         disabled={newRating === 0 || submittingRating}
// // //                         className="flex-1 px-3 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-colors"
// // //                       >
// // //                         {submittingRating ? (
// // //                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
// // //                         ) : (
// // //                           <Send className="w-4 h-4" />
// // //                         )}
// // //                         {rating ? 'Modifier' : 'Envoyer'}
// // //                       </button>
// // //                     </div>
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Matière & Horaires */}
// // //           <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
// // //             <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
// // //               <span className="p-1.5 bg-indigo-50 rounded-lg">
// // //                 <BookOpen className="w-4 h-4 text-indigo-600" />
// // //               </span>
// // //               Matière & Planning
// // //             </h3>
// // //             <div className="space-y-3">
// // //               <div>
// // //                 <p className="text-xs text-gray-400 mb-0.5">Matière enseignée</p>
// // //                 <p className="text-sm font-semibold text-gray-900">{contrat.matiere_nom}</p>
// // //                 <p className="text-xs text-gray-500">Niveau {contrat.matiere_niveau}</p>
// // //               </div>
// // //               {contrat.matiere_description && (
// // //                 <div>
// // //                   <p className="text-xs text-gray-400 mb-0.5">Description</p>
// // //                   <p className="text-sm text-gray-700">{contrat.matiere_description}</p>
// // //                 </div>
// // //               )}
// // //               <div>
// // //                 <p className="text-xs text-gray-400 mb-0.5">Période du contrat</p>
// // //                 <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
// // //                   <Calendar className="w-3.5 h-3.5 text-gray-400" />
// // //                   Du {new Date(contrat.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
// // //                   {' au '}
// // //                   {new Date(contrat.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
// // //                 </p>
// // //               </div>
// // //               <div>
// // //                 <p className="text-xs text-gray-400 mb-0.5">Horaires habituels</p>
// // //                 <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
// // //                   <Clock className="w-3.5 h-3.5 text-gray-400" />
// // //                   {contrat.heure_debut_pref?.slice(0, 5)} - {contrat.heure_fin_pref?.slice(0, 5)}
// // //                 </p>
// // //               </div>
// // //               <div>
// // //                 <p className="text-xs text-gray-400 mb-0.5">Jours de cours</p>
// // //                 <p className="text-sm font-semibold text-gray-900">{jours}</p>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Détails contrat */}
// // //           <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
// // //             <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
// // //               <span className="p-1.5 bg-green-50 rounded-lg">
// // //                 <FileText className="w-4 h-4 text-green-600" />
// // //               </span>
// // //               Détails du contrat
// // //             </h3>
// // //             <div className="space-y-3">
// // //               <div className="grid grid-cols-2 gap-3">
// // //                 <div>
// // //                   <p className="text-xs text-gray-400 mb-0.5">Type</p>
// // //                   <p className="text-sm font-semibold text-gray-900 capitalize">{contrat.type_contrat}</p>
// // //                 </div>
// // //                 <div>
// // //                   <p className="text-xs text-gray-400 mb-0.5">Fréquence</p>
// // //                   <p className="text-sm font-semibold text-gray-900 capitalize">{contrat.frequence}</p>
// // //                 </div>
// // //               </div>
// // //               {contrat.tarif_horaire && (
// // //                 <div className="bg-green-50 rounded-xl p-3">
// // //                   <p className="text-xs text-green-600 mb-0.5">Tarif horaire</p>
// // //                   <p className="text-xl font-bold text-green-700 flex items-center gap-1.5">
// // //                     <CreditCard className="w-4 h-4" />
// // //                     {contrat.tarif_horaire.toLocaleString()} FC/h
// // //                   </p>
// // //                 </div>
// // //               )}
// // //               {contrat.notes && (
// // //                 <div className="bg-amber-50 rounded-xl p-3">
// // //                   <p className="text-xs text-amber-600 mb-0.5 flex items-center gap-1.5">
// // //                     <MessageSquare className="w-3.5 h-3.5" />
// // //                     Notes du contrat
// // //                   </p>
// // //                   <p className="text-sm text-amber-900">{contrat.notes}</p>
// // //                 </div>
// // //               )}
// // //               {contrat.parent_telephone && (
// // //                 <div>
// // //                   <p className="text-xs text-gray-400 mb-0.5">Mon téléphone</p>
// // //                   <p className="text-sm font-semibold text-gray-900">{contrat.parent_telephone}</p>
// // //                 </div>
// // //               )}
// // //               {contrat.parent_adresse && (
// // //                 <div>
// // //                   <p className="text-xs text-gray-400 mb-0.5">Mon adresse</p>
// // //                   <p className="text-sm font-semibold text-gray-900">{contrat.parent_adresse}</p>
// // //                 </div>
// // //               )}
// // //               <div className="pt-2 border-t border-gray-100">
// // //                 <p className="text-xs text-gray-400">
// // //                   Contrat créé le {new Date(contrat.created_at).toLocaleDateString('fr-FR', { 
// // //                     day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
// // //                   })}
// // //                 </p>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Contenu de l'onglet Sessions */}
// // //       {activeTab === 'sessions' && (
// // //         <div className="space-y-4">
// // //           {/* Résumé des cotations */}
// // //           {allGrades.length > 0 && (
// // //             <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
// // //               <div className="flex items-center justify-between">
// // //                 <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
// // //                   <Award className="w-4 h-4 text-yellow-500" />
// // //                   Résumé des évaluations
// // //                 </h3>
// // //                 <div className="flex items-center gap-2">
// // //                   <span className="text-xs text-gray-400">{allGrades.length} note{allGrades.length > 1 ? 's' : ''}</span>
// // //                   <span className="text-lg font-bold text-yellow-600">
// // //                     {moyenneGlobale.toFixed(1)}/20
// // //                   </span>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           )}

// // //           {contrat.sessions.length === 0 ? (
// // //             <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
// // //               <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
// // //               <p className="text-gray-500 text-lg font-medium mb-1">Aucune session planifiée</p>
// // //               <p className="text-gray-400 text-sm">Les sessions apparaîtront ici une fois qu'elles seront créées par le précepteur.</p>
// // //             </div>
// // //           ) : (
// // //             <>
// // //               <div className="space-y-3">
// // //                 {displayedSessions.map((session) => (
// // //                   <div key={session.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
// // //                     {/* En-tête session */}
// // //                     <div className="p-4">
// // //                       <div className="flex items-start justify-between mb-3">
// // //                         <div className="flex items-center gap-3">
// // //                           <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getSessionStatutStyle(session.statut)}`}>
// // //                             {session.statut.replace('_', ' ')}
// // //                           </span>
// // //                           <div>
// // //                             <p className="text-sm font-semibold text-gray-900">
// // //                               {new Date(session.date_session).toLocaleDateString('fr-FR', { 
// // //                                 weekday: 'long', 
// // //                                 day: 'numeric', 
// // //                                 month: 'long',
// // //                                 year: 'numeric'
// // //                               })}
// // //                             </p>
// // //                             <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
// // //                               <Clock className="w-3 h-3" />
// // //                               {session.heure_debut?.slice(0, 5)} - {session.heure_fin?.slice(0, 5)} • {session.duree_minutes} min
// // //                             </p>
// // //                           </div>
// // //                         </div>
// // //                         <div className="flex items-center gap-2">
// // //                           <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-lg">
// // //                             {session.type_session?.replace('_', ' ')}
// // //                           </span>
// // //                           {session.lieu && (
// // //                             <span className="text-xs text-gray-400 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
// // //                               <MapPin className="w-3 h-3" /> {session.lieu}
// // //                             </span>
// // //                           )}
// // //                           {session.lien_visio && (
// // //                             <a
// // //                               href={session.lien_visio}
// // //                               target="_blank"
// // //                               rel="noopener noreferrer"
// // //                               className="text-xs text-blue-600 hover:underline bg-blue-50 px-2 py-1 rounded-lg flex items-center gap-1"
// // //                             >
// // //                               <Play className="w-3 h-3" /> Visio
// // //                             </a>
// // //                           )}
// // //                         </div>
// // //                       </div>

// // //                       {/* Notes */}
// // //                       {session.notes_precepteur && (
// // //                         <div className="bg-blue-50 p-3 rounded-xl mb-3">
// // //                           <p className="text-xs text-blue-600 mb-1 font-medium">Note du précepteur</p>
// // //                           <p className="text-sm text-blue-900">{session.notes_precepteur}</p>
// // //                         </div>
// // //                       )}
// // //                       {session.raison_annulation && (
// // //                         <div className="bg-red-50 p-3 rounded-xl mb-3">
// // //                           <p className="text-xs text-red-600 mb-1 font-medium">
// // //                             Annulé par {session.annule_par === 'parent' ? 'vous' : 'le précepteur'}
// // //                           </p>
// // //                           <p className="text-sm text-red-700">{session.raison_annulation}</p>
// // //                         </div>
// // //                       )}

// // //                       {/* Fichiers */}
// // //                       {session.files && session.files.length > 0 && (
// // //                         <div className="mt-3">
// // //                           <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1.5">
// // //                             <File className="w-3.5 h-3.5" />
// // //                             Fichiers ({session.files.length})
// // //                           </p>
// // //                           <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
// // //                             {session.files.map((file) => (
// // //                               <div key={file.id}>
// // //                                 {(file.file_type === 'image') && (
// // //                                   <div className="relative group">
// // //                                     <img
// // //                                       src={getPhotoUrl(file.file_path) || ''}
// // //                                       alt={file.file_name}
// // //                                       className="w-full h-32 object-cover rounded-lg"
// // //                                       onError={(e) => {
// // //                                         e.currentTarget.style.display = 'none'
// // //                                       }}
// // //                                     />
// // //                                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all rounded-lg flex items-center justify-center">
// // //                                       <button
// // //                                         onClick={() => handleDownloadFile(file.file_path, file.file_name)}
// // //                                         className="opacity-0 group-hover:opacity-100 transition-all p-1.5 bg-white rounded-lg"
// // //                                       >
// // //                                         <Download className="w-3.5 h-3.5" />
// // //                                       </button>
// // //                                     </div>
// // //                                   </div>
// // //                                 )}

// // //                                 {file.file_type === 'video' && (
// // //                                   <div className="relative group bg-gray-900 rounded-lg h-24 flex items-center justify-center">
// // //                                     <Video className="w-8 h-8 text-gray-400" />
// // //                                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all rounded-lg flex items-center justify-center">
// // //                                       <button
// // //                                         onClick={() => handleDownloadFile(file.file_path, file.file_name)}
// // //                                         className="opacity-0 group-hover:opacity-100 transition-all p-1.5 bg-white rounded-lg"
// // //                                       >
// // //                                         <Download className="w-3.5 h-3.5" />
// // //                                       </button>
// // //                                     </div>
// // //                                   </div>
// // //                                 )}

// // //                                 {file.file_type !== 'image' && file.file_type !== 'video' && (
// // //                                   <div 
// // //                                     className={`rounded-lg p-3 flex items-center gap-2 cursor-pointer hover:shadow transition-all ${getFileColor(file.file_type)}`}
// // //                                     onClick={() => handleDownloadFile(file.file_path, file.file_name)}
// // //                                   >
// // //                                     {getFileIcon(file.file_type)}
// // //                                     <div className="min-w-0 flex-1">
// // //                                       <p className="text-xs font-medium truncate">{file.file_name}</p>
// // //                                       <p className="text-xs opacity-70">{formatSize(file.file_size)}</p>
// // //                                     </div>
// // //                                     <Download className="w-3.5 h-3.5 flex-shrink-0" />
// // //                                   </div>
// // //                                 )}
                                
// // //                                 {(file.file_type === 'image' || file.file_type === 'video') && (
// // //                                   <div className="flex items-center justify-between mt-1">
// // //                                     <p className="text-xs text-gray-500 truncate flex-1 mr-1">{file.file_name}</p>
// // //                                     <button
// // //                                       onClick={() => handleDownloadFile(file.file_path, file.file_name)}
// // //                                       className="text-gray-400 hover:text-blue-600 flex-shrink-0"
// // //                                     >
// // //                                       <Download className="w-3 h-3" />
// // //                                     </button>
// // //                                   </div>
// // //                                 )}
// // //                               </div>
// // //                             ))}
// // //                           </div>
// // //                         </div>
// // //                       )}

// // //                       {/* Cotations */}
// // //                       {session.grades && session.grades.length > 0 && (
// // //                         <div className="mt-3">
// // //                           <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1.5">
// // //                             <Award className="w-3.5 h-3.5" />
// // //                             Évaluations ({session.grades.length})
// // //                           </p>
// // //                           <div className="space-y-1.5">
// // //                             {session.grades.map((grade) => {
// // //                               const percentage = Math.min((grade.score / grade.max_score) * 100, 100)
// // //                               const scoreOn20 = (grade.score / grade.max_score) * 20
// // //                               return (
// // //                                 <div key={grade.id} className="bg-gray-50 rounded-lg p-2.5">
// // //                                   <div className="flex items-center justify-between mb-1.5">
// // //                                     <p className="text-xs font-medium text-gray-700">{grade.titre || grade.title || 'Évaluation'}</p>
// // //                                     <div className="flex items-center gap-1.5">
// // //                                       <span className="text-xs font-bold text-gray-900">
// // //                                         {grade.score}/{grade.max_score}
// // //                                       </span>
// // //                                       <span className="text-xs text-gray-400">
// // //                                         ({scoreOn20.toFixed(1)}/20)
// // //                                       </span>
// // //                                     </div>
// // //                                   </div>
// // //                                   <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
// // //                                     <div 
// // //                                       className={`h-full rounded-full transition-all ${
// // //                                         percentage >= 80 ? 'bg-green-500' :
// // //                                         percentage >= 60 ? 'bg-blue-500' :
// // //                                         percentage >= 40 ? 'bg-yellow-500' :
// // //                                         'bg-red-500'
// // //                                       }`}
// // //                                       style={{ width: `${percentage}%` }}
// // //                                     />
// // //                                   </div>
// // //                                   {grade.comment && (
// // //                                     <p className="text-xs text-gray-500 mt-1.5">{grade.comment}</p>
// // //                                   )}
// // //                                 </div>
// // //                               )
// // //                             })}
// // //                           </div>
// // //                         </div>
// // //                       )}
// // //                     </div>
// // //                   </div>
// // //                 ))}
// // //               </div>

// // //               {contrat.sessions.length > 5 && (
// // //                 <div className="text-center pt-2">
// // //                   <button
// // //                     onClick={() => setShowAllSessions(!showAllSessions)}
// // //                     className="text-sm text-blue-600 hover:underline font-medium"
// // //                   >
// // //                     {showAllSessions 
// // //                       ? 'Afficher moins de sessions' 
// // //                       : `Voir les ${contrat.sessions.length - 5} autres sessions`
// // //                     }
// // //                   </button>
// // //                 </div>
// // //               )}
// // //             </>
// // //           )}
// // //         </div>
// // //       )}
// // //     </div>
// // //   )
// // // }

// // // app/dashboard/parent/contrats/[id]/page.tsx
// // 'use client'

// // import { useAuth } from '@/context/AuthContext'
// // import { useState, useEffect } from 'react'
// // import { useParams, useRouter } from 'next/navigation'
// // import Link from 'next/link'
// // import {
// //   User,
// //   MapPin,
// //   Calendar,
// //   BookOpen,
// //   Clock,
// //   Check,
// //   X,
// //   AlertCircle,
// //   GraduationCap,
// //   CreditCard,
// //   FileText,
// //   Phone,
// //   Mail,
// //   ChevronLeft,
// //   MessageSquare,
// //   Eye,
// //   Download,
// //   Play,
// //   Image as ImageIcon,
// //   File,
// //   Video,
// //   Award,
// //   Star,
// //   Building,
// //   Tag,
// //   Activity,
// //   Hash,
// //   Send,
// //   ThumbsUp
// // } from 'lucide-react'
// // import Loader from '@/components/Loader'

// // const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// // type Session = {
// //   id: number | string
// //   contract_id: number | string
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
// //   files?: SessionFile[]
// //   grades?: SessionGrade[]
// //   files_count?: number
// //   grades_count?: number
// // }

// // type SessionFile = {
// //   id: number | string
// //   session_id: number | string
// //   file_name: string
// //   file_path: string
// //   file_url?: string
// //   file_type: string
// //   file_size: number | null
// //   uploaded_by: string
// //   created_at: string
// // }

// // type SessionGrade = {
// //   id: number | string
// //   session_id: number | string
// //   titre?: string
// //   title?: string
// //   score: number
// //   max_score: number
// //   comment: string | null
// //   created_at: string
// // }

// // type PrecepteurRating = {
// //   id: number | string
// //   contract_id: number | string
// //   precepteur_id: number | string
// //   parent_id: number | string
// //   note: number
// //   commentaire: string | null
// //   created_at: string
// //   updated_at: string
// // }

// // type ContratDetail = {
// //   id: number | string
// //   parent_id: number | string
// //   precepteur_id: number | string
// //   eleve_id: number | string
// //   matiere_id: number | string
// //   date_debut: string
// //   date_fin: string
// //   heure_debut_pref: string
// //   heure_fin_pref: string
// //   jours_pref: string
// //   type_contrat: 'recurrent' | 'ponctuel'
// //   frequence: 'quotidien' | 'hebdomadaire' | 'bihebdomadaire' | 'mensuel' | 'ponctuel'
// //   tarif_horaire: number | null
// //   tarif_final?: number
// //   notes: string | null
// //   statut: 'en_attente' | 'accepte' | 'refuse' | 'actif' | 'termine' | 'annule'
// //   created_at: string
// //   enfant_nom: string
// //   enfant_prenom: string
// //   enfant_postnom: string | null
// //   enfant_niveau: string
// //   enfant_genre: string
// //   enfant_date_naissance: string | null
// //   enfant_ecole: string | null
// //   matiere_nom: string
// //   matiere_niveau: string
// //   matiere_description: string | null
// //   precepteur_username: string
// //   precepteur_email: string
// //   precepteur_telephone: string | null
// //   precepteur_commune: string
// //   precepteur_quartier: string
// //   precepteur_note: number
// //   precepteur_diplome: string
// //   precepteur_annees_exp: number
// //   precepteur_photo: string | null
// //   parent_telephone: string | null
// //   parent_adresse: string | null
// //   sessions: Session[]
// // }

// // function getToken(): string | null {
// //   if (typeof window !== 'undefined') {
// //     return localStorage.getItem('excellence-token')
// //   }
// //   return null
// // }

// // export default function ContratDetailPage() {
// //   const { user } = useAuth()
// //   const params = useParams()
// //   const router = useRouter()
// //   const contratId = params.id as string

// //   const [contrat, setContrat] = useState<ContratDetail | null>(null)
// //   const [loading, setLoading] = useState(true)
// //   const [message, setMessage] = useState('')
// //   const [showAllSessions, setShowAllSessions] = useState(false)

// //   // États pour le rating
// //   const [rating, setRating] = useState<PrecepteurRating | null>(null)
// //   const [showRatingForm, setShowRatingForm] = useState(false)
// //   const [newRating, setNewRating] = useState(0)
// //   const [ratingComment, setRatingComment] = useState('')
// //   const [hoveredRating, setHoveredRating] = useState(0)
// //   const [submittingRating, setSubmittingRating] = useState(false)

// //   useEffect(() => {
// //     if (user && contratId) loadContrat()
// //   }, [user, contratId])

// //   useEffect(() => {
// //     if (contrat) loadRating()
// //   }, [contrat])

// //   const loadContrat = async () => {
// //     setLoading(true)
    
// //     try {
// //       const token = getToken()
// //       if (!token) {
// //         setLoading(false)
// //         return
// //       }

// //       // 1. Charger tous les contrats du parent
// //       const response = await fetch(`${API_URL}/auth/contracts`, {
// //         headers: {
// //           'Authorization': `Bearer ${token}`,
// //           'Content-Type': 'application/json'
// //         }
// //       })
      
// //       const data = await response.json()
// //       console.log('📋 Contrats chargés:', data)
      
// //       if (data.success) {
// //         const contratTrouve = data.contrats.find((c: any) => String(c.id) === String(contratId))
        
// //         if (contratTrouve) {
// //           console.log('✅ Contrat trouvé:', contratTrouve)
          
// //           // 2. Charger les sessions du parent (toutes, puis filtrer)
// //           let sessions: Session[] = []
// //           try {
// //             const sessionsResponse = await fetch(`${API_URL}/auth/parent/sessions`, {
// //               headers: {
// //                 'Authorization': `Bearer ${token}`,
// //                 'Content-Type': 'application/json'
// //               }
// //             })
// //             const sessionsData = await sessionsResponse.json()
// //             console.log('📊 Sessions du parent chargées:', sessionsData)
            
// //             if (sessionsData.success && sessionsData.sessions) {
// //               // Filtrer les sessions pour ce contrat spécifique
// //               sessions = sessionsData.sessions.filter(
// //                 (s: any) => String(s.contract_id) === String(contratId)
// //               )
// //               console.log(`✅ ${sessions.length} sessions filtrées pour le contrat ${contratId}:`, sessions)
// //             } else {
// //               console.warn('⚠️ Format sessions inattendu:', sessionsData)
// //               // Essayer un autre endpoint
// //               try {
// //                 const altResponse = await fetch(`${API_URL}/auth/contracts/${contratId}/sessions`, {
// //                   headers: {
// //                     'Authorization': `Bearer ${token}`,
// //                     'Content-Type': 'application/json'
// //                   }
// //                 })
// //                 const altData = await altResponse.json()
// //                 console.log('🔄 Sessions via endpoint alternatif:', altData)
// //                 if (altData.success && altData.sessions) {
// //                   sessions = altData.sessions
// //                 }
// //               } catch (altErr) {
// //                 console.warn('⚠️ Endpoint alternatif échoué:', altErr)
// //               }
// //             }
// //           } catch (err) {
// //             console.warn('⚠️ Impossible de charger les sessions:', err)
// //             sessions = contratTrouve.sessions || []
// //           }

// //           // Construire l'objet contrat enrichi
// //           const enriched: ContratDetail = {
// //             ...contratTrouve,
// //             id: contratTrouve.id,
// //             parent_id: contratTrouve.parent_id,
// //             precepteur_id: contratTrouve.precepteur_id,
// //             eleve_id: contratTrouve.eleve_id || contratTrouve.eleve?.id,
// //             matiere_id: contratTrouve.matiere_id || contratTrouve.matiere?.id,
// //             date_debut: contratTrouve.date_debut || '',
// //             date_fin: contratTrouve.date_fin || '',
// //             heure_debut_pref: contratTrouve.heure_debut_pref || '',
// //             heure_fin_pref: contratTrouve.heure_fin_pref || '',
// //             jours_pref: contratTrouve.jours_pref || '',
// //             type_contrat: contratTrouve.type_contrat || 'ponctuel',
// //             frequence: contratTrouve.frequence || 'hebdomadaire',
// //             tarif_horaire: contratTrouve.tarif_horaire || contratTrouve.tarif_final || null,
// //             notes: contratTrouve.notes || null,
// //             statut: contratTrouve.statut || 'en_attente',
// //             created_at: contratTrouve.created_at || '',
// //             // Enfant
// //             enfant_nom: contratTrouve.eleve?.nom || contratTrouve.enfant_nom || '',
// //             enfant_prenom: contratTrouve.eleve?.prenom || contratTrouve.enfant_prenom || '',
// //             enfant_postnom: contratTrouve.eleve?.postnom || contratTrouve.enfant_postnom || null,
// //             enfant_niveau: contratTrouve.eleve?.niveau || contratTrouve.enfant_niveau || contratTrouve.niveau || '',
// //             enfant_genre: contratTrouve.eleve?.genre || contratTrouve.enfant_genre || '',
// //             enfant_date_naissance: contratTrouve.eleve?.date_naissance || contratTrouve.enfant_date_naissance || null,
// //             enfant_ecole: contratTrouve.eleve?.ecole || contratTrouve.enfant_ecole || null,
// //             // Matière
// //             matiere_nom: contratTrouve.matiere?.nom || contratTrouve.matiere_nom || contratTrouve.matiere || '',
// //             matiere_niveau: contratTrouve.matiere?.niveau || contratTrouve.matiere_niveau || contratTrouve.niveau || '',
// //             matiere_description: contratTrouve.matiere?.description || contratTrouve.matiere_description || null,
// //             // Précepteur
// //             precepteur_username: contratTrouve.precepteur?.user?.username || contratTrouve.precepteur_username || '',
// //             precepteur_email: contratTrouve.precepteur?.user?.email || contratTrouve.precepteur_email || '',
// //             precepteur_telephone: contratTrouve.precepteur?.user?.telephone || contratTrouve.precepteur_telephone || null,
// //             precepteur_commune: contratTrouve.precepteur?.commune || contratTrouve.precepteur_commune || '',
// //             precepteur_quartier: contratTrouve.precepteur?.quartier || contratTrouve.precepteur_quartier || '',
// //             precepteur_note: contratTrouve.precepteur?.note_moyenne || contratTrouve.precepteur_note || 0,
// //             precepteur_diplome: contratTrouve.precepteur?.diplome || contratTrouve.precepteur_diplome || '',
// //             precepteur_annees_exp: contratTrouve.precepteur?.annees_experience || contratTrouve.precepteur_annees_exp || 0,
// //             precepteur_photo: contratTrouve.precepteur?.user?.photo_profil || contratTrouve.precepteur_photo || null,
// //             // Parent
// //             parent_telephone: contratTrouve.parent?.telephone || contratTrouve.parent_telephone || null,
// //             parent_adresse: contratTrouve.parent?.adresse || contratTrouve.parent_adresse || null,
// //             // Sessions
// //             sessions: sessions
// //           }

// //           console.log('🎯 Contrat enrichi final:', enriched)
// //           setContrat(enriched)
// //         } else {
// //           console.error('❌ Contrat non trouvé avec l\'ID:', contratId)
// //         }
// //       }
// //     } catch (error) {
// //       console.error('❌ Erreur chargement contrat:', error)
// //     }
    
// //     setLoading(false)
// //   }

// //   const loadRating = async () => {
// //     if (!contrat) return

// //     try {
// //       const token = getToken()
// //       if (!token) return

// //       const response = await fetch(`${API_URL}/auth/precepteur/ratings?contract_id=${contrat.id}`, {
// //         headers: {
// //           'Authorization': `Bearer ${token}`,
// //           'Content-Type': 'application/json'
// //         }
// //       })

// //       if (response.ok) {
// //         const data = await response.json()
// //         if (data.success && data.rating) {
// //           setRating(data.rating)
// //           setNewRating(data.rating.note)
// //           setRatingComment(data.rating.commentaire || '')
// //         }
// //       }
// //     } catch (error) {
// //       console.error('❌ Erreur chargement rating:', error)
// //     }
// //   }

// //   const handleAnnulerContrat = async () => {
// //     if (!confirm('Voulez-vous vraiment annuler ce contrat ?')) return

// //     try {
// //       const token = getToken()
// //       if (!token) return

// //       const response = await fetch(`${API_URL}/auth/contracts/${contratId}/status`, {
// //         method: 'PATCH',
// //         headers: {
// //           'Authorization': `Bearer ${token}`,
// //           'Content-Type': 'application/json'
// //         },
// //         body: JSON.stringify({ statut: 'annule' })
// //       })

// //       if (response.ok) {
// //         setMessage('Contrat annulé avec succès')
// //         await loadContrat()
// //         setTimeout(() => setMessage(''), 3000)
// //       }
// //     } catch (error) {
// //       console.error('❌ Erreur annulation contrat:', error)
// //     }
// //   }

// //   const handleSubmitRating = async () => {
// //     if (newRating === 0) return

// //     setSubmittingRating(true)

// //     try {
// //       const token = getToken()
// //       if (!token) return

// //       const body = {
// //         contract_id: contrat!.id,
// //         precepteur_id: contrat!.precepteur_id,
// //         note: newRating,
// //         commentaire: ratingComment || null
// //       }

// //       let response
// //       if (rating) {
// //         response = await fetch(`${API_URL}/auth/precepteur/ratings/${rating.id}`, {
// //           method: 'PUT',
// //           headers: {
// //             'Authorization': `Bearer ${token}`,
// //             'Content-Type': 'application/json'
// //           },
// //           body: JSON.stringify(body)
// //         })
// //       } else {
// //         response = await fetch(`${API_URL}/auth/precepteur/ratings`, {
// //           method: 'POST',
// //           headers: {
// //             'Authorization': `Bearer ${token}`,
// //             'Content-Type': 'application/json'
// //           },
// //           body: JSON.stringify(body)
// //         })
// //       }

// //       if (response.ok) {
// //         setMessage(rating ? 'Votre avis a été modifié avec succès !' : 'Merci pour votre avis !')
// //         await loadRating()
// //         await loadContrat()
// //       }
// //     } catch (error) {
// //       console.error('❌ Erreur rating:', error)
// //       setMessage('Erreur lors de l\'envoi')
// //     }

// //     setSubmittingRating(false)
// //     setShowRatingForm(false)
// //     setTimeout(() => setMessage(''), 3000)
// //   }

// //   const handleDownloadFile = async (filePath: string, fileName: string) => {
// //     try {
// //       const token = getToken()
// //       if (!token) return

// //       const baseUrl = API_URL.replace('/api', '')
// //       const url = `${baseUrl}${filePath}`
      
// //       const response = await fetch(url, {
// //         headers: {
// //           'Authorization': `Bearer ${token}`
// //         }
// //       })

// //       if (response.ok) {
// //         const blob = await response.blob()
// //         const downloadUrl = URL.createObjectURL(blob)
// //         const a = document.createElement('a')
// //         a.href = downloadUrl
// //         a.download = fileName
// //         a.click()
// //         URL.revokeObjectURL(downloadUrl)
// //       }
// //     } catch (error) {
// //       console.error('❌ Erreur téléchargement:', error)
// //     }
// //   }

// //   const getPhotoUrl = (photoPath: string | null | undefined) => {
// //     if (!photoPath) return null
// //     if (photoPath.startsWith('http')) return photoPath
// //     const baseUrl = API_URL.replace('/api', '')
// //     return `${baseUrl}${photoPath}`
// //   }

// //   const getStatutStyle = (statut: string) => {
// //     switch (statut) {
// //       case 'actif': return 'bg-green-100 text-green-700'
// //       case 'en_attente': return 'bg-yellow-100 text-yellow-700'
// //       case 'accepte': return 'bg-blue-100 text-blue-700'
// //       case 'termine': return 'bg-gray-100 text-gray-700'
// //       case 'annule': return 'bg-red-100 text-red-700'
// //       case 'refuse': return 'bg-red-100 text-red-700'
// //       default: return 'bg-gray-100 text-gray-700'
// //     }
// //   }

// //   const getSessionStatutStyle = (statut: string) => {
// //     switch (statut) {
// //       case 'termine': return 'bg-green-100 text-green-700'
// //       case 'annule': return 'bg-red-100 text-red-700'
// //       case 'en_cours': return 'bg-yellow-100 text-yellow-700'
// //       case 'planifie': return 'bg-blue-100 text-blue-700'
// //       case 'reporte': return 'bg-purple-100 text-purple-700'
// //       default: return 'bg-gray-100 text-gray-700'
// //     }
// //   }

// //   const getFileIcon = (fileType: string) => {
// //     switch (fileType) {
// //       case 'image': return <ImageIcon className="w-4 h-4" />
// //       case 'pdf': return <FileText className="w-4 h-4" />
// //       case 'video': return <Video className="w-4 h-4" />
// //       case 'document': return <FileText className="w-4 h-4" />
// //       default: return <File className="w-4 h-4" />
// //     }
// //   }

// //   const getFileColor = (fileType: string) => {
// //     switch (fileType) {
// //       case 'image': return 'bg-blue-100 text-blue-700'
// //       case 'pdf': return 'bg-red-100 text-red-700'
// //       case 'video': return 'bg-purple-100 text-purple-700'
// //       case 'document': return 'bg-green-100 text-green-700'
// //       default: return 'bg-gray-100 text-gray-700'
// //     }
// //   }

// //   const formatSize = (bytes: number | null) => {
// //     if (!bytes) return ''
// //     if (bytes < 1024) return `${bytes} B`
// //     if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
// //     return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
// //   }

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center h-screen">
// //         <div className="w-20"><Loader /></div>
// //       </div>
// //     )
// //   }

// //   if (!contrat) {
// //     return (
// //       <div className="max-w-4xl mx-auto px-4 py-12 text-center">
// //         <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
// //         <p className="text-gray-500 text-lg">Contrat non trouvé</p>
// //         <Link href="/dashboard/parent" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
// //           Retour au tableau de bord
// //         </Link>
// //       </div>
// //     )
// //   }

// //   const sessionsTerminees = contrat.sessions.filter(s => s.statut === 'termine').length
// //   const sessionsAVenir = contrat.sessions.filter(s => s.statut === 'planifie' || s.statut === 'en_cours').length
// //   const joursLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
// //   const jours = contrat.jours_pref?.split(',').map((j: string) => joursLabels[parseInt(j) - 1]).join(', ') || 'Non spécifié'

// //   const displayedSessions = showAllSessions ? contrat.sessions : contrat.sessions.slice(0, 5)

// //   // Calculer la moyenne globale des cotations
// //   const allGrades = contrat.sessions.flatMap(s => s.grades || [])
// //   const moyenneGlobale = allGrades.length > 0
// //     ? allGrades.reduce((acc, g) => acc + (g.score / g.max_score) * 20, 0) / allGrades.length
// //     : 0

// //   return (
// //     <div className="max-w-6xl mx-auto px-4 py-6">
// //       {/* Toast */}
// //       {message && (
// //         <div className="mb-3 p-3 rounded-xl text-sm flex items-center gap-2 bg-green-50 text-green-600 animate-fadeIn">
// //           <Check className="w-4 h-4" /> {message}
// //         </div>
// //       )}

// //       {/* Retour */}
// //       <button
// //         onClick={() => router.back()}
// //         className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
// //       >
// //         <ChevronLeft className="w-4 h-4" /> Retour
// //       </button>

// //       {/* En-tête + Stats */}
// //       <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100">
// //         <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
// //           <div>
// //             <div className="flex items-center gap-2 mb-1.5">
// //               <h1 className="text-2xl font-bold text-gray-900">{contrat.matiere_nom}</h1>
// //               <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatutStyle(contrat.statut)}`}>
// //                 {contrat.statut.replace('_', ' ')}
// //               </span>
// //             </div>
// //             <p className="text-sm text-gray-500 flex items-center gap-2">
// //               <Hash className="w-3.5 h-3.5" />
// //               Contrat N°{contrat.id} • 
// //               <span className="capitalize">{contrat.type_contrat}</span> • 
// //               <span className="capitalize">{contrat.frequence}</span>
// //             </p>
// //           </div>
// //           {contrat.statut === 'actif' && (
// //             <button
// //               onClick={handleAnnulerContrat}
// //               className="px-4 py-2 bg-red-50 text-red-600 text-sm rounded-xl hover:bg-red-100 flex items-center gap-2 font-medium transition-colors"
// //             >
// //               <X className="w-4 h-4" /> Annuler le contrat
// //             </button>
// //           )}
// //         </div>

// //         {/* Stats */}
// //         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
// //           <div className="bg-blue-50 rounded-xl p-4 text-center">
// //             <p className="text-2xl font-bold text-blue-600">{contrat.sessions.length}</p>
// //             <p className="text-xs text-gray-600 mt-0.5">Sessions totales</p>
// //           </div>
// //           <div className="bg-green-50 rounded-xl p-4 text-center">
// //             <p className="text-2xl font-bold text-green-600">{sessionsTerminees}</p>
// //             <p className="text-xs text-gray-600 mt-0.5">Terminées</p>
// //           </div>
// //           <div className="bg-yellow-50 rounded-xl p-4 text-center">
// //             <p className="text-2xl font-bold text-yellow-600">{sessionsAVenir}</p>
// //             <p className="text-xs text-gray-600 mt-0.5">À venir / En cours</p>
// //           </div>
// //           <div className="bg-purple-50 rounded-xl p-4 text-center">
// //             <p className="text-2xl font-bold text-purple-600">
// //               {contrat.tarif_horaire ? `${contrat.tarif_horaire.toLocaleString()} FC` : 'N/A'}
// //             </p>
// //             <p className="text-xs text-gray-600 mt-0.5">Tarif/horaire</p>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Informations détaillées - Grille de cartes */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
// //         {/* Enfant */}
// //         <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
// //           <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
// //             <span className="p-1.5 bg-blue-50 rounded-lg">
// //               <User className="w-4 h-4 text-blue-600" />
// //             </span>
// //             Élève
// //           </h3>
// //           <div className="space-y-3">
// //             <div>
// //               <p className="text-xs text-gray-400 mb-0.5">Nom complet</p>
// //               <p className="text-sm font-semibold text-gray-900">
// //                 {contrat.enfant_prenom} {contrat.enfant_nom} {contrat.enfant_postnom || ''}
// //               </p>
// //             </div>
// //             <div>
// //               <p className="text-xs text-gray-400 mb-0.5">Niveau scolaire</p>
// //               <p className="text-sm font-semibold text-gray-900">{contrat.enfant_niveau}</p>
// //             </div>
// //             <div>
// //               <p className="text-xs text-gray-400 mb-0.5">Genre</p>
// //               <p className="text-sm font-semibold text-gray-900">{contrat.enfant_genre === 'M' ? 'Garçon' : 'Fille'}</p>
// //             </div>
// //             {contrat.enfant_date_naissance && (
// //               <div>
// //                 <p className="text-xs text-gray-400 mb-0.5">Date de naissance</p>
// //                 <p className="text-sm font-semibold text-gray-900">
// //                   {new Date(contrat.enfant_date_naissance).toLocaleDateString('fr-FR', { 
// //                     day: 'numeric', month: 'long', year: 'numeric' 
// //                   })}
// //                 </p>
// //               </div>
// //             )}
// //             {contrat.enfant_ecole && (
// //               <div>
// //                 <p className="text-xs text-gray-400 mb-0.5">Établissement</p>
// //                 <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
// //                   <Building className="w-3.5 h-3.5 text-gray-400" />
// //                   {contrat.enfant_ecole}
// //                 </p>
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         {/* Précepteur */}
// //         <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
// //           <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
// //             <span className="p-1.5 bg-purple-50 rounded-lg">
// //               <GraduationCap className="w-4 h-4 text-purple-600" />
// //             </span>
// //             Précepteur
// //           </h3>
// //           <div className="space-y-3">
// //             <div className="flex items-center gap-3 mb-3">
// //               {contrat.precepteur_photo ? (
// //                 <img src={getPhotoUrl(contrat.precepteur_photo) || ''} alt="Précepteur" className="w-12 h-12 rounded-full object-cover" />
// //               ) : (
// //                 <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
// //                   <User className="w-6 h-6 text-gray-400" />
// //                 </div>
// //               )}
// //               <div>
// //                 <p className="text-sm font-semibold text-gray-900">{contrat.precepteur_username}</p>
// //                 <div className="flex items-center gap-1 text-sm text-yellow-600">
// //                   <Star className="w-3.5 h-3.5 fill-current" />
// //                   {contrat.precepteur_note?.toFixed(1) || '0.0'}/5
// //                 </div>
// //               </div>
// //             </div>
// //             <div>
// //               <p className="text-xs text-gray-400 mb-0.5">Expérience & Diplôme</p>
// //               <p className="text-sm font-semibold text-gray-900">
// //                 {contrat.precepteur_annees_exp} an(s) d'expérience • {contrat.precepteur_diplome || 'Diplôme non spécifié'}
// //               </p>
// //             </div>
// //             {contrat.precepteur_telephone && (
// //               <div>
// //                 <p className="text-xs text-gray-400 mb-0.5">Téléphone</p>
// //                 <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
// //                   <Phone className="w-3.5 h-3.5 text-gray-400" />
// //                   {contrat.precepteur_telephone}
// //                 </p>
// //               </div>
// //             )}
// //             {contrat.precepteur_email && (
// //               <div>
// //                 <p className="text-xs text-gray-400 mb-0.5">Email</p>
// //                 <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
// //                   <Mail className="w-3.5 h-3.5 text-gray-400" />
// //                   {contrat.precepteur_email}
// //                 </p>
// //               </div>
// //             )}
// //             <div>
// //               <p className="text-xs text-gray-400 mb-0.5">Localisation</p>
// //               <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
// //                 <MapPin className="w-3.5 h-3.5 text-gray-400" />
// //                 {[contrat.precepteur_quartier, contrat.precepteur_commune].filter(Boolean).join(', ') || 'Non spécifiée'}
// //               </p>
// //             </div>

// //             {/* Section Rating */}
// //             <div className="mt-4 pt-4 border-t border-gray-100">
// //               {!showRatingForm ? (
// //                 <div>
// //                   {rating ? (
// //                     <div className="bg-yellow-50 rounded-xl p-3">
// //                       <p className="text-xs text-yellow-600 mb-1 font-medium flex items-center gap-1">
// //                         <ThumbsUp className="w-3.5 h-3.5" />
// //                         Votre évaluation
// //                       </p>
// //                       <div className="flex items-center gap-0.5 mb-1">
// //                         {[1, 2, 3, 4, 5].map((star) => (
// //                           <Star
// //                             key={star}
// //                             className={`w-5 h-5 ${
// //                               star <= rating.note
// //                                 ? 'text-yellow-500 fill-current'
// //                                 : 'text-gray-300'
// //                             }`}
// //                           />
// //                         ))}
// //                         <span className="ml-1 text-sm font-semibold text-yellow-700">
// //                           {rating.note}/5
// //                         </span>
// //                       </div>
// //                       {rating.commentaire && (
// //                         <p className="text-sm text-gray-700 mt-1 italic">"{rating.commentaire}"</p>
// //                       )}
// //                       <button
// //                         onClick={() => setShowRatingForm(true)}
// //                         className="text-xs text-blue-600 hover:underline mt-2 font-medium"
// //                       >
// //                         Modifier mon avis
// //                       </button>
// //                     </div>
// //                   ) : (
// //                     <button
// //                       onClick={() => setShowRatingForm(true)}
// //                       className="w-full px-4 py-2.5 bg-yellow-50 text-yellow-700 rounded-xl hover:bg-yellow-100 flex items-center justify-center gap-2 font-medium transition-colors text-sm border border-yellow-200"
// //                     >
// //                       <Star className="w-4 h-4" />
// //                       Noter ce précepteur
// //                     </button>
// //                   )}
// //                 </div>
// //               ) : (
// //                 <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
// //                   <p className="text-sm font-semibold text-gray-900 mb-3">
// //                     {rating ? 'Modifier votre évaluation' : 'Évaluer ce précepteur'}
// //                   </p>
                  
// //                   <div className="flex items-center gap-1 mb-3">
// //                     {[1, 2, 3, 4, 5].map((star) => (
// //                       <button
// //                         key={star}
// //                         onClick={() => setNewRating(star)}
// //                         onMouseEnter={() => setHoveredRating(star)}
// //                         onMouseLeave={() => setHoveredRating(0)}
// //                         className="transition-transform hover:scale-110"
// //                       >
// //                         <Star
// //                           className={`w-8 h-8 ${
// //                             star <= (hoveredRating || newRating)
// //                               ? 'text-yellow-500 fill-current'
// //                               : 'text-gray-300'
// //                           }`}
// //                         />
// //                       </button>
// //                     ))}
// //                     {newRating > 0 && (
// //                       <span className="ml-2 text-sm font-medium text-gray-700">
// //                         {newRating}/5
// //                       </span>
// //                     )}
// //                   </div>

// //                   <textarea
// //                     value={ratingComment}
// //                     onChange={(e) => setRatingComment(e.target.value)}
// //                     placeholder="Partagez votre expérience avec ce précepteur (optionnel)..."
// //                     rows={3}
// //                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
// //                   />

// //                   <div className="flex gap-2 mt-3">
// //                     <button
// //                       onClick={() => {
// //                         setShowRatingForm(false)
// //                         setNewRating(rating?.note || 0)
// //                         setRatingComment(rating?.commentaire || '')
// //                       }}
// //                       className="flex-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
// //                     >
// //                       Annuler
// //                     </button>
// //                     <button
// //                       onClick={handleSubmitRating}
// //                       disabled={newRating === 0 || submittingRating}
// //                       className="flex-1 px-3 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-colors"
// //                     >
// //                       {submittingRating ? (
// //                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
// //                       ) : (
// //                         <Send className="w-4 h-4" />
// //                       )}
// //                       {rating ? 'Modifier' : 'Envoyer'}
// //                     </button>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Matière & Horaires */}
// //         <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
// //           <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
// //             <span className="p-1.5 bg-indigo-50 rounded-lg">
// //               <BookOpen className="w-4 h-4 text-indigo-600" />
// //             </span>
// //             Matière & Planning
// //           </h3>
// //           <div className="space-y-3">
// //             <div>
// //               <p className="text-xs text-gray-400 mb-0.5">Matière enseignée</p>
// //               <p className="text-sm font-semibold text-gray-900">{contrat.matiere_nom}</p>
// //               <p className="text-xs text-gray-500">Niveau {contrat.matiere_niveau}</p>
// //             </div>
// //             {contrat.matiere_description && (
// //               <div>
// //                 <p className="text-xs text-gray-400 mb-0.5">Description</p>
// //                 <p className="text-sm text-gray-700">{contrat.matiere_description}</p>
// //               </div>
// //             )}
// //             <div>
// //               <p className="text-xs text-gray-400 mb-0.5">Période du contrat</p>
// //               <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
// //                 <Calendar className="w-3.5 h-3.5 text-gray-400" />
// //                 Du {new Date(contrat.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
// //                 {' au '}
// //                 {contrat.date_fin ? new Date(contrat.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Non définie'}
// //               </p>
// //             </div>
// //             <div>
// //               <p className="text-xs text-gray-400 mb-0.5">Horaires habituels</p>
// //               <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
// //                 <Clock className="w-3.5 h-3.5 text-gray-400" />
// //                 {contrat.heure_debut_pref || contrat.heure_fin_pref ? `${contrat.heure_debut_pref?.slice(0, 5) || '?'} - ${contrat.heure_fin_pref?.slice(0, 5) || '?'}` : 'Non spécifiés'}
// //               </p>
// //             </div>
// //             <div>
// //               <p className="text-xs text-gray-400 mb-0.5">Jours de cours</p>
// //               <p className="text-sm font-semibold text-gray-900">{jours}</p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Détails contrat */}
// //         <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
// //           <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
// //             <span className="p-1.5 bg-green-50 rounded-lg">
// //               <FileText className="w-4 h-4 text-green-600" />
// //             </span>
// //             Détails du contrat
// //           </h3>
// //           <div className="space-y-3">
// //             <div className="grid grid-cols-2 gap-3">
// //               <div>
// //                 <p className="text-xs text-gray-400 mb-0.5">Type</p>
// //                 <p className="text-sm font-semibold text-gray-900 capitalize">{contrat.type_contrat}</p>
// //               </div>
// //               <div>
// //                 <p className="text-xs text-gray-400 mb-0.5">Fréquence</p>
// //                 <p className="text-sm font-semibold text-gray-900 capitalize">{contrat.frequence}</p>
// //               </div>
// //             </div>
// //             {contrat.tarif_horaire && (
// //               <div className="bg-green-50 rounded-xl p-3">
// //                 <p className="text-xs text-green-600 mb-0.5">Tarif horaire</p>
// //                 <p className="text-xl font-bold text-green-700 flex items-center gap-1.5">
// //                   <CreditCard className="w-4 h-4" />
// //                   {contrat.tarif_horaire.toLocaleString()} FC/h
// //                 </p>
// //               </div>
// //             )}
// //             {contrat.notes && (
// //               <div className="bg-amber-50 rounded-xl p-3">
// //                 <p className="text-xs text-amber-600 mb-0.5 flex items-center gap-1.5">
// //                   <MessageSquare className="w-3.5 h-3.5" />
// //                   Notes du contrat
// //                 </p>
// //                 <p className="text-sm text-amber-900">{contrat.notes}</p>
// //               </div>
// //             )}
// //             {contrat.parent_telephone && (
// //               <div>
// //                 <p className="text-xs text-gray-400 mb-0.5">Mon téléphone</p>
// //                 <p className="text-sm font-semibold text-gray-900">{contrat.parent_telephone}</p>
// //               </div>
// //             )}
// //             {contrat.parent_adresse && (
// //               <div>
// //                 <p className="text-xs text-gray-400 mb-0.5">Mon adresse</p>
// //                 <p className="text-sm font-semibold text-gray-900">{contrat.parent_adresse}</p>
// //               </div>
// //             )}
// //             <div className="pt-2 border-t border-gray-100">
// //               <p className="text-xs text-gray-400">
// //                 Contrat créé le {new Date(contrat.created_at).toLocaleDateString('fr-FR', { 
// //                   day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
// //                 })}
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Sessions - Affichées directement ici, sans onglet */}
// //       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
// //         <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <h3 className="font-semibold text-gray-900 flex items-center gap-2">
// //                 <Calendar className="w-5 h-5 text-gray-700" />
// //                 Sessions du contrat
// //               </h3>
// //               <p className="text-sm text-gray-500 mt-0.5">
// //                 {contrat.sessions.length} session{contrat.sessions.length > 1 ? 's' : ''} au total
// //               </p>
// //             </div>
// //             {allGrades.length > 0 && (
// //               <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-lg">
// //                 <Award className="w-4 h-4 text-yellow-500" />
// //                 <span className="text-sm font-semibold text-yellow-700">
// //                   Moyenne : {moyenneGlobale.toFixed(1)}/20
// //                 </span>
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         {contrat.sessions.length === 0 ? (
// //           <div className="p-12 text-center">
// //             <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
// //             <p className="text-gray-500 text-lg font-medium mb-1">Aucune session planifiée</p>
// //             <p className="text-gray-400 text-sm">Les sessions apparaîtront ici une fois qu'elles seront créées par le précepteur.</p>
// //           </div>
// //         ) : (
// //           <>
// //             <div className="divide-y divide-gray-100">
// //               {displayedSessions.map((session) => (
// //                 <div key={session.id} className="p-4 hover:bg-gray-50/50 transition-colors">
// //                   {/* En-tête session */}
// //                   <div className="flex items-start justify-between mb-3">
// //                     <div className="flex items-center gap-3">
// //                       <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getSessionStatutStyle(session.statut)}`}>
// //                         {session.statut.replace('_', ' ')}
// //                       </span>
// //                       <div>
// //                         <p className="text-sm font-semibold text-gray-900">
// //                           {new Date(session.date_session).toLocaleDateString('fr-FR', { 
// //                             weekday: 'long', 
// //                             day: 'numeric', 
// //                             month: 'long',
// //                             year: 'numeric'
// //                           })}
// //                         </p>
// //                         <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
// //                           <Clock className="w-3 h-3" />
// //                           {session.heure_debut?.slice(0, 5)} - {session.heure_fin?.slice(0, 5)} • {session.duree_minutes} min
// //                         </p>
// //                       </div>
// //                     </div>
// //                     <div className="flex items-center gap-2">
// //                       <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-lg">
// //                         {session.type_session?.replace('_', ' ')}
// //                       </span>
// //                       {session.lieu && (
// //                         <span className="text-xs text-gray-400 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
// //                           <MapPin className="w-3 h-3" /> {session.lieu}
// //                         </span>
// //                       )}
// //                       {session.lien_visio && (
// //                         <a
// //                           href={session.lien_visio}
// //                           target="_blank"
// //                           rel="noopener noreferrer"
// //                           className="text-xs text-blue-600 hover:underline bg-blue-50 px-2 py-1 rounded-lg flex items-center gap-1"
// //                         >
// //                           <Play className="w-3 h-3" /> Visio
// //                         </a>
// //                       )}
// //                     </div>
// //                   </div>

// //                   {/* Notes */}
// //                   {session.notes_precepteur && (
// //                     <div className="bg-blue-50 p-3 rounded-xl mb-3">
// //                       <p className="text-xs text-blue-600 mb-1 font-medium">Note du précepteur</p>
// //                       <p className="text-sm text-blue-900">{session.notes_precepteur}</p>
// //                     </div>
// //                   )}
// //                   {session.raison_annulation && (
// //                     <div className="bg-red-50 p-3 rounded-xl mb-3">
// //                       <p className="text-xs text-red-600 mb-1 font-medium">
// //                         Annulé par {session.annule_par === 'parent' ? 'vous' : 'le précepteur'}
// //                       </p>
// //                       <p className="text-sm text-red-700">{session.raison_annulation}</p>
// //                     </div>
// //                   )}

// //                   {/* Fichiers */}
// //                   {session.files && session.files.length > 0 && (
// //                     <div className="mt-3">
// //                       <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1.5">
// //                         <File className="w-3.5 h-3.5" />
// //                         Fichiers ({session.files.length})
// //                       </p>
// //                       <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
// //                         {session.files.map((file) => (
// //                           <div key={file.id}>
// //                             {(file.file_type === 'image') && (
// //                               <div className="relative group">
// //                                 <img
// //                                   src={getPhotoUrl(file.file_path) || ''}
// //                                   alt={file.file_name}
// //                                   className="w-full h-32 object-cover rounded-lg"
// //                                   onError={(e) => {
// //                                     e.currentTarget.style.display = 'none'
// //                                   }}
// //                                 />
// //                                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all rounded-lg flex items-center justify-center">
// //                                   <button
// //                                     onClick={() => handleDownloadFile(file.file_path, file.file_name)}
// //                                     className="opacity-0 group-hover:opacity-100 transition-all p-1.5 bg-white rounded-lg"
// //                                   >
// //                                     <Download className="w-3.5 h-3.5" />
// //                                   </button>
// //                                 </div>
// //                               </div>
// //                             )}

// //                             {file.file_type === 'video' && (
// //                               <div className="relative group bg-gray-900 rounded-lg h-24 flex items-center justify-center">
// //                                 <Video className="w-8 h-8 text-gray-400" />
// //                                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all rounded-lg flex items-center justify-center">
// //                                   <button
// //                                     onClick={() => handleDownloadFile(file.file_path, file.file_name)}
// //                                     className="opacity-0 group-hover:opacity-100 transition-all p-1.5 bg-white rounded-lg"
// //                                   >
// //                                     <Download className="w-3.5 h-3.5" />
// //                                   </button>
// //                                 </div>
// //                               </div>
// //                             )}

// //                             {file.file_type !== 'image' && file.file_type !== 'video' && (
// //                               <div 
// //                                 className={`rounded-lg p-3 flex items-center gap-2 cursor-pointer hover:shadow transition-all ${getFileColor(file.file_type)}`}
// //                                 onClick={() => handleDownloadFile(file.file_path, file.file_name)}
// //                               >
// //                                 {getFileIcon(file.file_type)}
// //                                 <div className="min-w-0 flex-1">
// //                                   <p className="text-xs font-medium truncate">{file.file_name}</p>
// //                                   <p className="text-xs opacity-70">{formatSize(file.file_size)}</p>
// //                                 </div>
// //                                 <Download className="w-3.5 h-3.5 flex-shrink-0" />
// //                               </div>
// //                             )}
                            
// //                             {(file.file_type === 'image' || file.file_type === 'video') && (
// //                               <div className="flex items-center justify-between mt-1">
// //                                 <p className="text-xs text-gray-500 truncate flex-1 mr-1">{file.file_name}</p>
// //                                 <button
// //                                   onClick={() => handleDownloadFile(file.file_path, file.file_name)}
// //                                   className="text-gray-400 hover:text-blue-600 flex-shrink-0"
// //                                 >
// //                                   <Download className="w-3 h-3" />
// //                                 </button>
// //                               </div>
// //                             )}
// //                           </div>
// //                         ))}
// //                       </div>
// //                     </div>
// //                   )}

// //                   {/* Cotations */}
// //                   {session.grades && session.grades.length > 0 && (
// //                     <div className="mt-3">
// //                       <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1.5">
// //                         <Award className="w-3.5 h-3.5" />
// //                         Évaluations ({session.grades.length})
// //                       </p>
// //                       <div className="space-y-1.5">
// //                         {session.grades.map((grade) => {
// //                           const percentage = Math.min((grade.score / grade.max_score) * 100, 100)
// //                           const scoreOn20 = (grade.score / grade.max_score) * 20
// //                           return (
// //                             <div key={grade.id} className="bg-gray-50 rounded-lg p-2.5">
// //                               <div className="flex items-center justify-between mb-1.5">
// //                                 <p className="text-xs font-medium text-gray-700">{grade.titre || grade.title || 'Évaluation'}</p>
// //                                 <div className="flex items-center gap-1.5">
// //                                   <span className="text-xs font-bold text-gray-900">
// //                                     {grade.score}/{grade.max_score}
// //                                   </span>
// //                                   <span className="text-xs text-gray-400">
// //                                     ({scoreOn20.toFixed(1)}/20)
// //                                   </span>
// //                                 </div>
// //                               </div>
// //                               <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
// //                                 <div 
// //                                   className={`h-full rounded-full transition-all ${
// //                                     percentage >= 80 ? 'bg-green-500' :
// //                                     percentage >= 60 ? 'bg-blue-500' :
// //                                     percentage >= 40 ? 'bg-yellow-500' :
// //                                     'bg-red-500'
// //                                   }`}
// //                                   style={{ width: `${percentage}%` }}
// //                                 />
// //                               </div>
// //                               {grade.comment && (
// //                                 <p className="text-xs text-gray-500 mt-1.5">{grade.comment}</p>
// //                               )}
// //                             </div>
// //                           )
// //                         })}
// //                       </div>
// //                     </div>
// //                   )}
// //                 </div>
// //               ))}
// //             </div>

// //             {contrat.sessions.length > 5 && (
// //               <div className="text-center py-4 border-t">
// //                 <button
// //                   onClick={() => setShowAllSessions(!showAllSessions)}
// //                   className="text-sm text-blue-600 hover:underline font-medium"
// //                 >
// //                   {showAllSessions 
// //                     ? 'Afficher moins de sessions' 
// //                     : `Voir les ${contrat.sessions.length - 5} autres sessions`
// //                   }
// //                 </button>
// //               </div>
// //             )}
// //           </>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }


// // app/dashboard/parent/contrats/[id]/page.tsx
// 'use client'

// import { useAuth } from '@/context/AuthContext'
// import { useState, useEffect } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import Link from 'next/link'
// import {
//   User,
//   MapPin,
//   Calendar,
//   BookOpen,
//   Clock,
//   Check,
//   X,
//   AlertCircle,
//   GraduationCap,
//   CreditCard,
//   FileText,
//   Phone,
//   Mail,
//   ChevronLeft,
//   MessageSquare,
//   Eye,
//   Download,
//   Play,
//   Image as ImageIcon,
//   File,
//   Video,
//   Award,
//   Star,
//   Building,
//   Tag,
//   Activity,
//   Hash,
//   Send,
//   ThumbsUp,
//   ArrowLeft
// } from 'lucide-react'
// import Loader from '@/components/Loader'

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// // ============ TYPES ============

// type Session = {
//   id: number | string
//   contract_id: number | string
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
//   files?: SessionFile[]
//   grades?: SessionGrade[]
//   files_count?: number
//   grades_count?: number
// }

// type SessionFile = {
//   id: number | string
//   session_id: number | string
//   file_name: string
//   file_path: string
//   file_url?: string
//   file_type: string
//   file_size: number | null
//   uploaded_by: string
//   created_at: string
// }

// type SessionGrade = {
//   id: number | string
//   session_id: number | string
//   titre?: string
//   title?: string
//   score: number
//   max_score: number
//   comment: string | null
//   created_at: string
// }

// type PrecepteurRating = {
//   id: number | string
//   contract_id: number | string
//   precepteur_id: number | string
//   parent_id: number | string
//   note: number
//   commentaire: string | null
//   created_at: string
//   updated_at: string
// }

// type ContratDetail = {
//   id: number | string
//   parent_id: number | string
//   precepteur_id: number | string
//   eleve_id: number | string
//   matiere_id: number | string
//   date_debut: string
//   date_fin: string
//   heure_debut_pref: string
//   heure_fin_pref: string
//   jours_pref: string
//   type_contrat: 'recurrent' | 'ponctuel'
//   frequence: 'quotidien' | 'hebdomadaire' | 'bihebdomadaire' | 'mensuel' | 'ponctuel'
//   tarif_horaire: number | null
//   tarif_final?: number
//   notes: string | null
//   statut: 'en_attente' | 'accepte' | 'refuse' | 'actif' | 'termine' | 'annule'
//   created_at: string
//   enfant_nom: string
//   enfant_prenom: string
//   enfant_postnom: string | null
//   enfant_niveau: string
//   enfant_genre: string
//   enfant_date_naissance: string | null
//   enfant_ecole: string | null
//   matiere_nom: string
//   matiere_niveau: string
//   matiere_description: string | null
//   precepteur_username: string
//   precepteur_email: string
//   precepteur_telephone: string | null
//   precepteur_commune: string
//   precepteur_quartier: string
//   precepteur_note: number
//   precepteur_diplome: string
//   precepteur_annees_exp: number
//   precepteur_photo: string | null
//   parent_telephone: string | null
//   parent_adresse: string | null
//   sessions: Session[]
// }

// function getToken(): string | null {
//   if (typeof window !== 'undefined') {
//     return localStorage.getItem('excellence-token')
//   }
//   return null
// }

// export default function ContratDetailPage() {
//   const { user } = useAuth()
//   const params = useParams()
//   const router = useRouter()
//   const contratId = params.id as string

//   const [contrat, setContrat] = useState<ContratDetail | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [message, setMessage] = useState('')
//   const [showAllSessions, setShowAllSessions] = useState(false)

//   // États pour le modal de détail de session
//   const [selectedSession, setSelectedSession] = useState<Session | null>(null)
//   const [showSessionDetailModal, setShowSessionDetailModal] = useState(false)

//   // États pour le rating
//   const [rating, setRating] = useState<PrecepteurRating | null>(null)
//   const [showRatingForm, setShowRatingForm] = useState(false)
//   const [newRating, setNewRating] = useState(0)
//   const [ratingComment, setRatingComment] = useState('')
//   const [hoveredRating, setHoveredRating] = useState(0)
//   const [submittingRating, setSubmittingRating] = useState(false)

//   useEffect(() => {
//     if (user && contratId) loadContrat()
//   }, [user, contratId])

//   useEffect(() => {
//     if (contrat) loadRating()
//   }, [contrat])

//   const loadContrat = async () => {
//     setLoading(true)
    
//     try {
//       const token = getToken()
//       if (!token) {
//         setLoading(false)
//         return
//       }

//       // 1. Charger tous les contrats du parent
//       const response = await fetch(`${API_URL}/auth/contracts`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       })
      
//       const data = await response.json()
      
//       if (data.success) {
//         const contratTrouve = data.contrats.find((c: any) => String(c.id) === String(contratId))
        
//         if (contratTrouve) {
//           // 2. Charger les sessions du parent (toutes, puis filtrer)
//           let sessions: Session[] = []
//           try {
//             const sessionsResponse = await fetch(`${API_URL}/auth/parent/sessions`, {
//               headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//               }
//             })
//             const sessionsData = await sessionsResponse.json()
            
//             if (sessionsData.success && sessionsData.sessions) {
//               sessions = sessionsData.sessions.filter(
//                 (s: any) => String(s.contract_id) === String(contratId)
//               )
//             }
//           } catch (err) {
//             console.warn('⚠️ Impossible de charger les sessions:', err)
//             sessions = contratTrouve.sessions || []
//           }

//           const enriched: ContratDetail = {
//             ...contratTrouve,
//             id: contratTrouve.id,
//             parent_id: contratTrouve.parent_id,
//             precepteur_id: contratTrouve.precepteur_id,
//             eleve_id: contratTrouve.eleve_id || contratTrouve.eleve?.id,
//             matiere_id: contratTrouve.matiere_id || contratTrouve.matiere?.id,
//             date_debut: contratTrouve.date_debut || '',
//             date_fin: contratTrouve.date_fin || '',
//             heure_debut_pref: contratTrouve.heure_debut_pref || '',
//             heure_fin_pref: contratTrouve.heure_fin_pref || '',
//             jours_pref: contratTrouve.jours_pref || '',
//             type_contrat: contratTrouve.type_contrat || 'ponctuel',
//             frequence: contratTrouve.frequence || 'hebdomadaire',
//             tarif_horaire: contratTrouve.tarif_horaire || contratTrouve.tarif_final || null,
//             notes: contratTrouve.notes || null,
//             statut: contratTrouve.statut || 'en_attente',
//             created_at: contratTrouve.created_at || '',
//             enfant_nom: contratTrouve.eleve?.nom || contratTrouve.enfant_nom || '',
//             enfant_prenom: contratTrouve.eleve?.prenom || contratTrouve.enfant_prenom || '',
//             enfant_postnom: contratTrouve.eleve?.postnom || contratTrouve.enfant_postnom || null,
//             enfant_niveau: contratTrouve.eleve?.niveau || contratTrouve.enfant_niveau || contratTrouve.niveau || '',
//             enfant_genre: contratTrouve.eleve?.genre || contratTrouve.enfant_genre || '',
//             enfant_date_naissance: contratTrouve.eleve?.date_naissance || contratTrouve.enfant_date_naissance || null,
//             enfant_ecole: contratTrouve.eleve?.ecole || contratTrouve.enfant_ecole || null,
//             matiere_nom: contratTrouve.matiere?.nom || contratTrouve.matiere_nom || contratTrouve.matiere || '',
//             matiere_niveau: contratTrouve.matiere?.niveau || contratTrouve.matiere_niveau || contratTrouve.niveau || '',
//             matiere_description: contratTrouve.matiere?.description || contratTrouve.matiere_description || null,
//             precepteur_username: contratTrouve.precepteur?.user?.username || contratTrouve.precepteur_username || '',
//             precepteur_email: contratTrouve.precepteur?.user?.email || contratTrouve.precepteur_email || '',
//             precepteur_telephone: contratTrouve.precepteur?.user?.telephone || contratTrouve.precepteur_telephone || null,
//             precepteur_commune: contratTrouve.precepteur?.commune || contratTrouve.precepteur_commune || '',
//             precepteur_quartier: contratTrouve.precepteur?.quartier || contratTrouve.precepteur_quartier || '',
//             precepteur_note: contratTrouve.precepteur?.note_moyenne || contratTrouve.precepteur_note || 0,
//             precepteur_diplome: contratTrouve.precepteur?.diplome || contratTrouve.precepteur_diplome || '',
//             precepteur_annees_exp: contratTrouve.precepteur?.annees_experience || contratTrouve.precepteur_annees_exp || 0,
//             precepteur_photo: contratTrouve.precepteur?.user?.photo_profil || contratTrouve.precepteur_photo || null,
//             parent_telephone: contratTrouve.parent?.telephone || contratTrouve.parent_telephone || null,
//             parent_adresse: contratTrouve.parent?.adresse || contratTrouve.parent_adresse || null,
//             sessions: sessions
//           }

//           setContrat(enriched)
//         }
//       }
//     } catch (error) {
//       console.error('❌ Erreur chargement contrat:', error)
//     }
    
//     setLoading(false)
//   }

//   const loadRating = async () => {
//     if (!contrat) return

//     try {
//       const token = getToken()
//       if (!token) return

//       const response = await fetch(`${API_URL}/auth/precepteur/ratings?contract_id=${contrat.id}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       })

//       if (response.ok) {
//         const data = await response.json()
//         if (data.success && data.rating) {
//           setRating(data.rating)
//           setNewRating(data.rating.note)
//           setRatingComment(data.rating.commentaire || '')
//         }
//       }
//     } catch (error) {
//       console.error('❌ Erreur chargement rating:', error)
//     }
//   }

//   const handleAnnulerContrat = async () => {
//     if (!confirm('Voulez-vous vraiment annuler ce contrat ?')) return

//     try {
//       const token = getToken()
//       if (!token) return

//       const response = await fetch(`${API_URL}/auth/contracts/${contratId}/status`, {
//         method: 'PATCH',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ statut: 'annule' })
//       })

//       if (response.ok) {
//         setMessage('Contrat annulé avec succès')
//         await loadContrat()
//         setTimeout(() => setMessage(''), 3000)
//       }
//     } catch (error) {
//       console.error('❌ Erreur annulation contrat:', error)
//     }
//   }

//   const handleSubmitRating = async () => {
//     if (newRating === 0) return

//     setSubmittingRating(true)

//     try {
//       const token = getToken()
//       if (!token) return

//       const body = {
//         contract_id: contrat!.id,
//         precepteur_id: contrat!.precepteur_id,
//         note: newRating,
//         commentaire: ratingComment || null
//       }

//       let response
//       if (rating) {
//         response = await fetch(`${API_URL}/auth/precepteur/ratings/${rating.id}`, {
//           method: 'PUT',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify(body)
//         })
//       } else {
//         response = await fetch(`${API_URL}/auth/precepteur/ratings`, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify(body)
//         })
//       }

//       if (response.ok) {
//         setMessage(rating ? 'Votre avis a été modifié avec succès !' : 'Merci pour votre avis !')
//         await loadRating()
//         await loadContrat()
//       }
//     } catch (error) {
//       console.error('❌ Erreur rating:', error)
//       setMessage('Erreur lors de l\'envoi')
//     }

//     setSubmittingRating(false)
//     setShowRatingForm(false)
//     setTimeout(() => setMessage(''), 3000)
//   }

//   const handleDownloadFile = async (filePath: string, fileName: string) => {
//     try {
//       const token = getToken()
//       if (!token) return

//       const baseUrl = API_URL.replace('/api', '')
//       const url = `${baseUrl}${filePath}`
      
//       const response = await fetch(url, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       })

//       if (response.ok) {
//         const blob = await response.blob()
//         const downloadUrl = URL.createObjectURL(blob)
//         const a = document.createElement('a')
//         a.href = downloadUrl
//         a.download = fileName
//         a.click()
//         URL.revokeObjectURL(downloadUrl)
//       }
//     } catch (error) {
//       console.error('❌ Erreur téléchargement:', error)
//     }
//   }

//   const openSessionDetail = (session: Session) => {
//     setSelectedSession(session)
//     setShowSessionDetailModal(true)
//   }

//   const getPhotoUrl = (photoPath: string | null | undefined) => {
//     if (!photoPath) return null
//     if (photoPath.startsWith('http')) return photoPath
//     const baseUrl = API_URL.replace('/api', '')
//     return `${baseUrl}${photoPath}`
//   }

//   const getStatutStyle = (statut: string) => {
//     switch (statut) {
//       case 'actif': return 'bg-green-100 text-green-700'
//       case 'en_attente': return 'bg-yellow-100 text-yellow-700'
//       case 'accepte': return 'bg-blue-100 text-blue-700'
//       case 'termine': return 'bg-gray-100 text-gray-700'
//       case 'annule': return 'bg-red-100 text-red-700'
//       case 'refuse': return 'bg-red-100 text-red-700'
//       default: return 'bg-gray-100 text-gray-700'
//     }
//   }

//   const getSessionStatutStyle = (statut: string) => {
//     switch (statut) {
//       case 'termine': return 'bg-green-100 text-green-700'
//       case 'annule': return 'bg-red-100 text-red-700'
//       case 'en_cours': return 'bg-yellow-100 text-yellow-700'
//       case 'planifie': return 'bg-blue-100 text-blue-700'
//       case 'reporte': return 'bg-purple-100 text-purple-700'
//       default: return 'bg-gray-100 text-gray-700'
//     }
//   }

//   const getFileIcon = (fileType: string) => {
//     switch (fileType) {
//       case 'image': return <ImageIcon className="w-4 h-4" />
//       case 'pdf': return <FileText className="w-4 h-4" />
//       case 'video': return <Video className="w-4 h-4" />
//       case 'document': return <FileText className="w-4 h-4" />
//       default: return <File className="w-4 h-4" />
//     }
//   }

//   const getFileColor = (fileType: string) => {
//     switch (fileType) {
//       case 'image': return 'bg-blue-100 text-blue-700'
//       case 'pdf': return 'bg-red-100 text-red-700'
//       case 'video': return 'bg-purple-100 text-purple-700'
//       case 'document': return 'bg-green-100 text-green-700'
//       default: return 'bg-gray-100 text-gray-700'
//     }
//   }

//   const formatSize = (bytes: number | null) => {
//     if (!bytes) return ''
//     if (bytes < 1024) return `${bytes} B`
//     if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
//     return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="w-20"><Loader /></div>
//       </div>
//     )
//   }

//   if (!contrat) {
//     return (
//       <div className="max-w-4xl mx-auto px-4 py-12 text-center">
//         <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//         <p className="text-gray-500 text-lg">Contrat non trouvé</p>
//         <Link href="/dashboard/parent" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
//           Retour au tableau de bord
//         </Link>
//       </div>
//     )
//   }

//   const sessionsTerminees = contrat.sessions.filter(s => s.statut === 'termine').length
//   const sessionsAVenir = contrat.sessions.filter(s => s.statut === 'planifie' || s.statut === 'en_cours').length
//   const joursLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
//   const jours = contrat.jours_pref?.split(',').map((j: string) => joursLabels[parseInt(j) - 1]).join(', ') || 'Non spécifié'

//   const displayedSessions = showAllSessions ? contrat.sessions : contrat.sessions.slice(0, 5)

//   const allGrades = contrat.sessions.flatMap(s => s.grades || [])
//   const moyenneGlobale = allGrades.length > 0
//     ? allGrades.reduce((acc, g) => acc + (g.score / g.max_score) * 20, 0) / allGrades.length
//     : 0

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-6">
//       {/* Toast */}
//       {message && (
//         <div className="mb-3 p-3 rounded-xl text-sm flex items-center gap-2 bg-green-50 text-green-600 animate-fadeIn">
//           <Check className="w-4 h-4" /> {message}
//         </div>
//       )}

//       {/* Retour */}
//       <button
//         onClick={() => router.back()}
//         className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
//       >
//         <ChevronLeft className="w-4 h-4" /> Retour
//       </button>

//       {/* En-tête + Stats */}
//       <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100">
//         <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
//           <div>
//             <div className="flex items-center gap-2 mb-1.5">
//               <h1 className="text-2xl font-bold text-gray-900">{contrat.matiere_nom}</h1>
//               <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatutStyle(contrat.statut)}`}>
//                 {contrat.statut.replace('_', ' ')}
//               </span>
//             </div>
//             <p className="text-sm text-gray-500 flex items-center gap-2">
//               <Hash className="w-3.5 h-3.5" />
//               Contrat N°{contrat.id} • 
//               <span className="capitalize">{contrat.type_contrat}</span> • 
//               <span className="capitalize">{contrat.frequence}</span>
//             </p>
//           </div>
//           {contrat.statut === 'actif' && (
//             <button
//               onClick={handleAnnulerContrat}
//               className="px-4 py-2 bg-red-50 text-red-600 text-sm rounded-xl hover:bg-red-100 flex items-center gap-2 font-medium transition-colors"
//             >
//               <X className="w-4 h-4" /> Annuler le contrat
//             </button>
//           )}
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//           <div className="bg-blue-50 rounded-xl p-4 text-center">
//             <p className="text-2xl font-bold text-blue-600">{contrat.sessions.length}</p>
//             <p className="text-xs text-gray-600 mt-0.5">Sessions totales</p>
//           </div>
//           <div className="bg-green-50 rounded-xl p-4 text-center">
//             <p className="text-2xl font-bold text-green-600">{sessionsTerminees}</p>
//             <p className="text-xs text-gray-600 mt-0.5">Terminées</p>
//           </div>
//           <div className="bg-yellow-50 rounded-xl p-4 text-center">
//             <p className="text-2xl font-bold text-yellow-600">{sessionsAVenir}</p>
//             <p className="text-xs text-gray-600 mt-0.5">À venir / En cours</p>
//           </div>
//           <div className="bg-purple-50 rounded-xl p-4 text-center">
//             <p className="text-2xl font-bold text-purple-600">
//               {contrat.tarif_horaire ? `${contrat.tarif_horaire.toLocaleString()} FC` : 'N/A'}
//             </p>
//             <p className="text-xs text-gray-600 mt-0.5">Tarif/horaire</p>
//           </div>
//         </div>
//       </div>

//       {/* Informations détaillées - Grille de cartes */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         {/* Enfant */}
//         <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
//           <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
//             <span className="p-1.5 bg-blue-50 rounded-lg">
//               <User className="w-4 h-4 text-blue-600" />
//             </span>
//             Élève
//           </h3>
//           <div className="space-y-3">
//             <div>
//               <p className="text-xs text-gray-400 mb-0.5">Nom complet</p>
//               <p className="text-sm font-semibold text-gray-900">
//                 {contrat.enfant_prenom} {contrat.enfant_nom} {contrat.enfant_postnom || ''}
//               </p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-400 mb-0.5">Niveau scolaire</p>
//               <p className="text-sm font-semibold text-gray-900">{contrat.enfant_niveau}</p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-400 mb-0.5">Genre</p>
//               <p className="text-sm font-semibold text-gray-900">{contrat.enfant_genre === 'M' ? 'Garçon' : 'Fille'}</p>
//             </div>
//             {contrat.enfant_date_naissance && (
//               <div>
//                 <p className="text-xs text-gray-400 mb-0.5">Date de naissance</p>
//                 <p className="text-sm font-semibold text-gray-900">
//                   {new Date(contrat.enfant_date_naissance).toLocaleDateString('fr-FR', { 
//                     day: 'numeric', month: 'long', year: 'numeric' 
//                   })}
//                 </p>
//               </div>
//             )}
//             {contrat.enfant_ecole && (
//               <div>
//                 <p className="text-xs text-gray-400 mb-0.5">Établissement</p>
//                 <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
//                   <Building className="w-3.5 h-3.5 text-gray-400" />
//                   {contrat.enfant_ecole}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Précepteur */}
//         <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
//           <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
//             <span className="p-1.5 bg-purple-50 rounded-lg">
//               <GraduationCap className="w-4 h-4 text-purple-600" />
//             </span>
//             Précepteur
//           </h3>
//           <div className="space-y-3">
//             <div className="flex items-center gap-3 mb-3">
//               {contrat.precepteur_photo ? (
//                 <img src={getPhotoUrl(contrat.precepteur_photo) || ''} alt="Précepteur" className="w-12 h-12 rounded-full object-cover" />
//               ) : (
//                 <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
//                   <User className="w-6 h-6 text-gray-400" />
//                 </div>
//               )}
//               <div>
//                 <p className="text-sm font-semibold text-gray-900">{contrat.precepteur_username}</p>
//                 <div className="flex items-center gap-1 text-sm text-yellow-600">
//                   <Star className="w-3.5 h-3.5 fill-current" />
//                   {contrat.precepteur_note?.toFixed(1) || '0.0'}/5
//                 </div>
//               </div>
//             </div>
//             <div>
//               <p className="text-xs text-gray-400 mb-0.5">Expérience & Diplôme</p>
//               <p className="text-sm font-semibold text-gray-900">
//                 {contrat.precepteur_annees_exp} an(s) d'expérience • {contrat.precepteur_diplome || 'Diplôme non spécifié'}
//               </p>
//             </div>
//             {contrat.precepteur_telephone && (
//               <div>
//                 <p className="text-xs text-gray-400 mb-0.5">Téléphone</p>
//                 <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
//                   <Phone className="w-3.5 h-3.5 text-gray-400" />
//                   {contrat.precepteur_telephone}
//                 </p>
//               </div>
//             )}
//             {contrat.precepteur_email && (
//               <div>
//                 <p className="text-xs text-gray-400 mb-0.5">Email</p>
//                 <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
//                   <Mail className="w-3.5 h-3.5 text-gray-400" />
//                   {contrat.precepteur_email}
//                 </p>
//               </div>
//             )}
//             <div>
//               <p className="text-xs text-gray-400 mb-0.5">Localisation</p>
//               <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
//                 <MapPin className="w-3.5 h-3.5 text-gray-400" />
//                 {[contrat.precepteur_quartier, contrat.precepteur_commune].filter(Boolean).join(', ') || 'Non spécifiée'}
//               </p>
//             </div>

//             {/* Section Rating */}
//             <div className="mt-4 pt-4 border-t border-gray-100">
//               {!showRatingForm ? (
//                 <div>
//                   {rating ? (
//                     <div className="bg-yellow-50 rounded-xl p-3">
//                       <p className="text-xs text-yellow-600 mb-1 font-medium flex items-center gap-1">
//                         <ThumbsUp className="w-3.5 h-3.5" />
//                         Votre évaluation
//                       </p>
//                       <div className="flex items-center gap-0.5 mb-1">
//                         {[1, 2, 3, 4, 5].map((star) => (
//                           <Star
//                             key={star}
//                             className={`w-5 h-5 ${
//                               star <= rating.note
//                                 ? 'text-yellow-500 fill-current'
//                                 : 'text-gray-300'
//                             }`}
//                           />
//                         ))}
//                         <span className="ml-1 text-sm font-semibold text-yellow-700">
//                           {rating.note}/5
//                         </span>
//                       </div>
//                       {rating.commentaire && (
//                         <p className="text-sm text-gray-700 mt-1 italic">"{rating.commentaire}"</p>
//                       )}
//                       <button
//                         onClick={() => setShowRatingForm(true)}
//                         className="text-xs text-blue-600 hover:underline mt-2 font-medium"
//                       >
//                         Modifier mon avis
//                       </button>
//                     </div>
//                   ) : (
//                     <button
//                       onClick={() => setShowRatingForm(true)}
//                       className="w-full px-4 py-2.5 bg-yellow-50 text-yellow-700 rounded-xl hover:bg-yellow-100 flex items-center justify-center gap-2 font-medium transition-colors text-sm border border-yellow-200"
//                     >
//                       <Star className="w-4 h-4" />
//                       Noter ce précepteur
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
//                   <p className="text-sm font-semibold text-gray-900 mb-3">
//                     {rating ? 'Modifier votre évaluation' : 'Évaluer ce précepteur'}
//                   </p>
                  
//                   <div className="flex items-center gap-1 mb-3">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <button
//                         key={star}
//                         onClick={() => setNewRating(star)}
//                         onMouseEnter={() => setHoveredRating(star)}
//                         onMouseLeave={() => setHoveredRating(0)}
//                         className="transition-transform hover:scale-110"
//                       >
//                         <Star
//                           className={`w-8 h-8 ${
//                             star <= (hoveredRating || newRating)
//                               ? 'text-yellow-500 fill-current'
//                               : 'text-gray-300'
//                           }`}
//                         />
//                       </button>
//                     ))}
//                     {newRating > 0 && (
//                       <span className="ml-2 text-sm font-medium text-gray-700">
//                         {newRating}/5
//                       </span>
//                     )}
//                   </div>

//                   <textarea
//                     value={ratingComment}
//                     onChange={(e) => setRatingComment(e.target.value)}
//                     placeholder="Partagez votre expérience avec ce précepteur (optionnel)..."
//                     rows={3}
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
//                   />

//                   <div className="flex gap-2 mt-3">
//                     <button
//                       onClick={() => {
//                         setShowRatingForm(false)
//                         setNewRating(rating?.note || 0)
//                         setRatingComment(rating?.commentaire || '')
//                       }}
//                       className="flex-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//                     >
//                       Annuler
//                     </button>
//                     <button
//                       onClick={handleSubmitRating}
//                       disabled={newRating === 0 || submittingRating}
//                       className="flex-1 px-3 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-colors"
//                     >
//                       {submittingRating ? (
//                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                       ) : (
//                         <Send className="w-4 h-4" />
//                       )}
//                       {rating ? 'Modifier' : 'Envoyer'}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Matière & Horaires */}
//         <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
//           <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
//             <span className="p-1.5 bg-indigo-50 rounded-lg">
//               <BookOpen className="w-4 h-4 text-indigo-600" />
//             </span>
//             Matière & Planning
//           </h3>
//           <div className="space-y-3">
//             <div>
//               <p className="text-xs text-gray-400 mb-0.5">Matière enseignée</p>
//               <p className="text-sm font-semibold text-gray-900">{contrat.matiere_nom}</p>
//               <p className="text-xs text-gray-500">Niveau {contrat.matiere_niveau}</p>
//             </div>
//             {contrat.matiere_description && (
//               <div>
//                 <p className="text-xs text-gray-400 mb-0.5">Description</p>
//                 <p className="text-sm text-gray-700">{contrat.matiere_description}</p>
//               </div>
//             )}
//             <div>
//               <p className="text-xs text-gray-400 mb-0.5">Période du contrat</p>
//               <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
//                 <Calendar className="w-3.5 h-3.5 text-gray-400" />
//                 Du {new Date(contrat.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
//                 {' au '}
//                 {contrat.date_fin ? new Date(contrat.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Non définie'}
//               </p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-400 mb-0.5">Horaires habituels</p>
//               <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
//                 <Clock className="w-3.5 h-3.5 text-gray-400" />
//                 {contrat.heure_debut_pref || contrat.heure_fin_pref ? `${contrat.heure_debut_pref?.slice(0, 5) || '?'} - ${contrat.heure_fin_pref?.slice(0, 5) || '?'}` : 'Non spécifiés'}
//               </p>
//             </div>
//             <div>
//               <p className="text-xs text-gray-400 mb-0.5">Jours de cours</p>
//               <p className="text-sm font-semibold text-gray-900">{jours}</p>
//             </div>
//           </div>
//         </div>

//         {/* Détails contrat */}
//         <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
//           <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
//             <span className="p-1.5 bg-green-50 rounded-lg">
//               <FileText className="w-4 h-4 text-green-600" />
//             </span>
//             Détails du contrat
//           </h3>
//           <div className="space-y-3">
//             <div className="grid grid-cols-2 gap-3">
//               <div>
//                 <p className="text-xs text-gray-400 mb-0.5">Type</p>
//                 <p className="text-sm font-semibold text-gray-900 capitalize">{contrat.type_contrat}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-400 mb-0.5">Fréquence</p>
//                 <p className="text-sm font-semibold text-gray-900 capitalize">{contrat.frequence}</p>
//               </div>
//             </div>
//             {contrat.tarif_horaire && (
//               <div className="bg-green-50 rounded-xl p-3">
//                 <p className="text-xs text-green-600 mb-0.5">Tarif horaire</p>
//                 <p className="text-xl font-bold text-green-700 flex items-center gap-1.5">
//                   <CreditCard className="w-4 h-4" />
//                   {contrat.tarif_horaire.toLocaleString()} FC/h
//                 </p>
//               </div>
//             )}
//             {contrat.notes && (
//               <div className="bg-amber-50 rounded-xl p-3">
//                 <p className="text-xs text-amber-600 mb-0.5 flex items-center gap-1.5">
//                   <MessageSquare className="w-3.5 h-3.5" />
//                   Notes du contrat
//                 </p>
//                 <p className="text-sm text-amber-900">{contrat.notes}</p>
//               </div>
//             )}
//             {contrat.parent_telephone && (
//               <div>
//                 <p className="text-xs text-gray-400 mb-0.5">Mon téléphone</p>
//                 <p className="text-sm font-semibold text-gray-900">{contrat.parent_telephone}</p>
//               </div>
//             )}
//             {contrat.parent_adresse && (
//               <div>
//                 <p className="text-xs text-gray-400 mb-0.5">Mon adresse</p>
//                 <p className="text-sm font-semibold text-gray-900">{contrat.parent_adresse}</p>
//               </div>
//             )}
//             <div className="pt-2 border-t border-gray-100">
//               <p className="text-xs text-gray-400">
//                 Contrat créé le {new Date(contrat.created_at).toLocaleDateString('fr-FR', { 
//                   day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
//                 })}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Sessions - Liste cliquable */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
//         <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//                 <Calendar className="w-5 h-5 text-gray-700" />
//                 Sessions du contrat
//               </h3>
//               <p className="text-sm text-gray-500 mt-0.5">
//                 {contrat.sessions.length} session{contrat.sessions.length > 1 ? 's' : ''} au total
//               </p>
//             </div>
//             {allGrades.length > 0 && (
//               <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-lg">
//                 <Award className="w-4 h-4 text-yellow-500" />
//                 <span className="text-sm font-semibold text-yellow-700">
//                   Moyenne : {moyenneGlobale.toFixed(1)}/20
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>

//         {contrat.sessions.length === 0 ? (
//           <div className="p-12 text-center">
//             <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <p className="text-gray-500 text-lg font-medium mb-1">Aucune session planifiée</p>
//             <p className="text-gray-400 text-sm">Les sessions apparaîtront ici une fois qu'elles seront créées par le précepteur.</p>
//           </div>
//         ) : (
//           <>
//             <div className="divide-y divide-gray-100">
//               {displayedSessions
//                 .sort((a, b) => new Date(a.date_session).getTime() - new Date(b.date_session).getTime())
//                 .map((session) => (
//                 <div
//                   key={session.id}
//                   className="p-4 hover:bg-gray-50/50 transition-colors cursor-pointer group"
//                   onClick={() => openSessionDetail(session)}
//                 >
//                   <div className="flex items-start justify-between mb-2">
//                     <div className="flex items-center gap-3">
//                       <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getSessionStatutStyle(session.statut)}`}>
//                         {session.statut.replace('_', ' ')}
//                       </span>
//                       <div>
//                         <p className="text-sm font-semibold text-gray-900">
//                           {new Date(session.date_session).toLocaleDateString('fr-FR', { 
//                             weekday: 'long', 
//                             day: 'numeric', 
//                             month: 'long',
//                             year: 'numeric'
//                           })}
//                         </p>
//                         <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
//                           <Clock className="w-3 h-3" />
//                           {session.heure_debut?.slice(0, 5)} - {session.heure_fin?.slice(0, 5)} • {session.duree_minutes} min
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       {session.type_session && (
//                         <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-lg">
//                           {session.type_session.replace('_', ' ')}
//                         </span>
//                       )}
//                       {session.lieu && (
//                         <span className="text-xs text-gray-400 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
//                           <MapPin className="w-3 h-3" /> {session.lieu}
//                         </span>
//                       )}
//                       <Eye className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
//                     </div>
//                   </div>

//                   {/* Indicateurs de contenu */}
//                   <div className="flex items-center gap-3 text-xs text-gray-400">
//                     {session.notes_precepteur && (
//                       <span className="flex items-center gap-1">
//                         <MessageSquare className="w-3 h-3" /> Notes
//                       </span>
//                     )}
//                     {session.files && session.files.length > 0 && (
//                       <span className="flex items-center gap-1">
//                         <File className="w-3 h-3" /> {session.files.length} fichier{session.files.length > 1 ? 's' : ''}
//                       </span>
//                     )}
//                     {session.grades && session.grades.length > 0 && (
//                       <span className="flex items-center gap-1">
//                         <Award className="w-3 h-3" /> {session.grades.length} évaluation{session.grades.length > 1 ? 's' : ''}
//                       </span>
//                     )}
//                     {session.lien_visio && (
//                       <span className="flex items-center gap-1 text-blue-500">
//                         <Play className="w-3 h-3" /> Visio
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {contrat.sessions.length > 5 && (
//               <div className="text-center py-4 border-t">
//                 <button
//                   onClick={() => setShowAllSessions(!showAllSessions)}
//                   className="text-sm text-blue-600 hover:underline font-medium"
//                 >
//                   {showAllSessions 
//                     ? 'Afficher moins de sessions' 
//                     : `Voir les ${contrat.sessions.length - 5} autres sessions`
//                   }
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* ========== MODAL DÉTAIL SESSION ========== */}
//       {showSessionDetailModal && selectedSession && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             {/* En-tête du modal */}
//             <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={() => {
//                     setShowSessionDetailModal(false)
//                     setSelectedSession(null)
//                   }}
//                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   <ArrowLeft className="w-5 h-5 text-gray-600" />
//                 </button>
//                 <div>
//                   <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                     Détail de la session
//                     <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getSessionStatutStyle(selectedSession.statut)}`}>
//                       {selectedSession.statut.replace('_', ' ')}
//                     </span>
//                   </h2>
//                   <p className="text-sm text-gray-500">
//                     {new Date(selectedSession.date_session).toLocaleDateString('fr-FR', {
//                       weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
//                     })}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => {
//                   setShowSessionDetailModal(false)
//                   setSelectedSession(null)
//                 }}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500" />
//               </button>
//             </div>

//             {/* Contenu du modal */}
//             <div className="p-6 space-y-6">
//               {/* Informations de base */}
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//                 <div className="bg-gray-50 rounded-xl p-3">
//                   <p className="text-xs text-gray-500 mb-1">Date</p>
//                   <p className="text-sm font-semibold">
//                     {new Date(selectedSession.date_session).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
//                   </p>
//                 </div>
//                 <div className="bg-gray-50 rounded-xl p-3">
//                   <p className="text-xs text-gray-500 mb-1">Horaire</p>
//                   <p className="text-sm font-semibold">
//                     {selectedSession.heure_debut?.slice(0, 5)} - {selectedSession.heure_fin?.slice(0, 5)}
//                   </p>
//                 </div>
//                 <div className="bg-gray-50 rounded-xl p-3">
//                   <p className="text-xs text-gray-500 mb-1">Durée</p>
//                   <p className="text-sm font-semibold">{selectedSession.duree_minutes} min</p>
//                 </div>
//                 <div className="bg-gray-50 rounded-xl p-3">
//                   <p className="text-xs text-gray-500 mb-1">Type</p>
//                   <p className="text-sm font-semibold capitalize">{selectedSession.type_session?.replace('_', ' ')}</p>
//                 </div>
//               </div>

//               {/* Lieu / Lien visio */}
//               {(selectedSession.lieu || selectedSession.lien_visio) && (
//                 <div>
//                   <h4 className="text-sm font-semibold text-gray-700 mb-2">Lieu de la session</h4>
//                   <div className="flex flex-wrap gap-2">
//                     {selectedSession.lieu && (
//                       <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm">
//                         <MapPin className="w-4 h-4" /> {selectedSession.lieu}
//                       </span>
//                     )}
//                     {selectedSession.lien_visio && (
//                       <a
//                         href={selectedSession.lien_visio}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100 transition-colors"
//                       >
//                         <Play className="w-4 h-4" /> Rejoindre la visio
//                       </a>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Notes du précepteur */}
//               {selectedSession.notes_precepteur && (
//                 <div>
//                   <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                     <MessageSquare className="w-4 h-4 text-blue-600" />
//                     Notes du précepteur
//                   </h4>
//                   <div className="bg-blue-50 rounded-xl p-4">
//                     <p className="text-sm text-blue-900 whitespace-pre-wrap">{selectedSession.notes_precepteur}</p>
//                   </div>
//                 </div>
//               )}

//               {/* Feedback */}
//               {selectedSession.feedback_precepteur && (
//                 <div>
//                   <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                     <MessageSquare className="w-4 h-4 text-purple-600" />
//                     Feedback du précepteur
//                   </h4>
//                   <div className="bg-purple-50 rounded-xl p-4">
//                     <p className="text-sm text-purple-900 whitespace-pre-wrap">{selectedSession.feedback_precepteur}</p>
//                   </div>
//                 </div>
//               )}

//               {/* Raison d'annulation */}
//               {selectedSession.raison_annulation && (
//                 <div>
//                   <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                     <X className="w-4 h-4 text-red-600" />
//                     Raison d'annulation
//                   </h4>
//                   <div className="bg-red-50 rounded-xl p-4">
//                     <p className="text-xs text-red-600 mb-1">
//                       Annulé par {selectedSession.annule_par === 'parent' ? 'vous' : 'le précepteur'}
//                     </p>
//                     <p className="text-sm text-red-900">{selectedSession.raison_annulation}</p>
//                   </div>
//                 </div>
//               )}

//               {/* Fichiers */}
//               {selectedSession.files && selectedSession.files.length > 0 && (
//                 <div>
//                   <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                     <File className="w-4 h-4 text-gray-600" />
//                     Fichiers partagés ({selectedSession.files.length})
//                   </h4>
//                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                     {selectedSession.files.map((file) => (
//                       <div key={file.id}>
//                         {file.file_type === 'image' ? (
//                           <div className="relative group rounded-xl overflow-hidden bg-gray-100">
//                             <img
//                               src={getPhotoUrl(file.file_path) || ''}
//                               alt={file.file_name}
//                               className="w-full h-32 object-cover"
//                               onError={(e) => {
//                                 e.currentTarget.style.display = 'none'
//                               }}
//                             />
//                             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
//                               <button
//                                 onClick={() => handleDownloadFile(file.file_path, file.file_name)}
//                                 className="opacity-0 group-hover:opacity-100 transition-all p-2 bg-white rounded-lg shadow-lg"
//                               >
//                                 <Download className="w-4 h-4" />
//                               </button>
//                             </div>
//                             <p className="text-xs text-gray-500 mt-1 truncate px-1">{file.file_name}</p>
//                           </div>
//                         ) : file.file_type === 'video' ? (
//                           <div className="relative group rounded-xl overflow-hidden bg-gray-900 h-32 flex items-center justify-center">
//                             <Video className="w-10 h-10 text-gray-400" />
//                             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
//                               <button
//                                 onClick={() => handleDownloadFile(file.file_path, file.file_name)}
//                                 className="opacity-0 group-hover:opacity-100 transition-all p-2 bg-white rounded-lg shadow-lg"
//                               >
//                                 <Download className="w-4 h-4" />
//                               </button>
//                             </div>
//                             <p className="absolute bottom-0 left-0 right-0 text-xs text-white bg-black/50 px-1 py-0.5 truncate">{file.file_name}</p>
//                           </div>
//                         ) : (
//                           <div 
//                             className={`rounded-xl p-3 cursor-pointer hover:shadow-md transition-all ${getFileColor(file.file_type)}`}
//                             onClick={() => handleDownloadFile(file.file_path, file.file_name)}
//                           >
//                             <div className="flex items-center gap-2">
//                               {getFileIcon(file.file_type)}
//                               <div className="min-w-0 flex-1">
//                                 <p className="text-xs font-medium truncate">{file.file_name}</p>
//                                 <p className="text-xs opacity-70">{formatSize(file.file_size)}</p>
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Cotations / Évaluations */}
//               {selectedSession.grades && selectedSession.grades.length > 0 && (
//                 <div>
//                   <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                     <Award className="w-4 h-4 text-yellow-600" />
//                     Évaluations ({selectedSession.grades.length})
//                   </h4>
//                   <div className="space-y-3">
//                     {selectedSession.grades.map((grade) => {
//                       const percentage = Math.min((grade.score / grade.max_score) * 100, 100)
//                       const scoreOn20 = (grade.score / grade.max_score) * 20
//                       return (
//                         <div key={grade.id} className="bg-white border border-gray-200 rounded-xl p-4">
//                           <div className="flex items-center justify-between mb-2">
//                             <p className="text-sm font-semibold text-gray-900">
//                               {grade.titre || grade.title || 'Évaluation'}
//                             </p>
//                             <div className="flex items-center gap-2">
//                               <span className="text-lg font-bold text-gray-900">
//                                 {grade.score}/{grade.max_score}
//                               </span>
//                               <span className="text-sm text-gray-500">
//                                 ({scoreOn20.toFixed(1)}/20)
//                               </span>
//                             </div>
//                           </div>
//                           <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
//                             <div 
//                               className={`h-full rounded-full transition-all ${
//                                 percentage >= 80 ? 'bg-green-500' :
//                                 percentage >= 60 ? 'bg-blue-500' :
//                                 percentage >= 40 ? 'bg-yellow-500' :
//                                 'bg-red-500'
//                               }`}
//                               style={{ width: `${percentage}%` }}
//                             />
//                           </div>
//                           {grade.comment && (
//                             <div className="mt-3 bg-gray-50 rounded-lg p-3">
//                               <p className="text-xs text-gray-500 mb-1">Commentaire</p>
//                               <p className="text-sm text-gray-700">{grade.comment}</p>
//                             </div>
//                           )}
//                           <p className="text-xs text-gray-400 mt-2">
//                             Évalué le {new Date(grade.created_at).toLocaleDateString('fr-FR', {
//                               day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
//                             })}
//                           </p>
//                         </div>
//                       )
//                     })}
//                   </div>
//                 </div>
//               )}

//               {/* Note de la session */}
//               {selectedSession.note_session && (
//                 <div>
//                   <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                     <Star className="w-4 h-4 text-yellow-600" />
//                     Note de la session
//                   </h4>
//                   <div className="flex items-center gap-1">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <Star
//                         key={star}
//                         className={`w-6 h-6 ${
//                           star <= (selectedSession.note_session || 0)
//                             ? 'text-yellow-500 fill-current'
//                             : 'text-gray-300'
//                         }`}
//                       />
//                     ))}
//                     <span className="ml-2 text-sm font-semibold text-gray-700">
//                       {selectedSession.note_session}/5
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Pied du modal */}
//             <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-2xl">
//               <button
//                 onClick={() => {
//                   setShowSessionDetailModal(false)
//                   setSelectedSession(null)
//                 }}
//                 className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm"
//               >
//                 Fermer
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }




// app/dashboard/parent/contrats/[id]/page.tsx
'use client'

import { useAuth } from '@/context/AuthContext'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User,
  MapPin,
  Calendar,
  BookOpen,
  Clock,
  Check,
  X,
  AlertCircle,
  GraduationCap,
  CreditCard,
  FileText,
  Phone,
  Mail,
  ChevronLeft,
  MessageSquare,
  Eye,
  Download,
  Play,
  Image as ImageIcon,
  File,
  Video,
  Award,
  Star,
  Building,
  Hash,
  ThumbsUp,
  Edit3,
  Send,
  ArrowLeft
} from 'lucide-react'
import Loader from '@/components/Loader'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// ============ TYPES ============

type SessionFile = {
  id: number | string
  session_id: number | string
  file_name: string
  file_path: string
  file_url?: string
  file_type: string
  file_size: number | null
  uploaded_by: string
  created_at: string
}

type SessionGrade = {
  id: number | string
  session_id: number | string
  titre?: string
  title?: string
  score: number
  max_score: number
  comment: string | null
  created_at: string
}

type Session = {
  id: number | string
  contract_id: number | string
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
  files?: SessionFile[]
  grades?: SessionGrade[]
  files_count?: number
  grades_count?: number
}

type PrecepteurRating = {
  id: number | string
  contract_id: number | string
  precepteur_id: number | string
  parent_id: number | string
  note: number
  commentaire: string | null
  created_at: string
  updated_at: string
}

type ContratDetail = {
  id: number | string
  parent_id: number | string
  precepteur_id: number | string
  eleve_id: number | string
  matiere_id: number | string
  date_debut: string
  date_fin: string
  heure_debut_pref: string
  heure_fin_pref: string
  jours_pref: string
  type_contrat: 'recurrent' | 'ponctuel'
  frequence: 'quotidien' | 'hebdomadaire' | 'bihebdomadaire' | 'mensuel' | 'ponctuel'
  tarif_horaire: number | null
  tarif_final?: number
  notes: string | null
  statut: 'en_attente' | 'accepte' | 'refuse' | 'actif' | 'termine' | 'annule'
  created_at: string
  enfant_nom: string
  enfant_prenom: string
  enfant_postnom: string | null
  enfant_niveau: string
  enfant_genre: string
  enfant_date_naissance: string | null
  enfant_ecole: string | null
  matiere_nom: string
  matiere_niveau: string
  matiere_description: string | null
  precepteur_username: string
  precepteur_email: string
  precepteur_telephone: string | null
  precepteur_commune: string
  precepteur_quartier: string
  precepteur_note: number
  precepteur_diplome: string
  precepteur_annees_exp: number
  precepteur_photo: string | null
  parent_telephone: string | null
  parent_adresse: string | null
  sessions: Session[]
}

function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('excellence-token')
  }
  return null
}

export default function ContratDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const contratId = params.id as string

  const [contrat, setContrat] = useState<ContratDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [showAllSessions, setShowAllSessions] = useState(false)

  // États pour le modal de détail de session
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [showSessionDetailModal, setShowSessionDetailModal] = useState(false)

  // États pour le rating du précepteur
  const [rating, setRating] = useState<PrecepteurRating | null>(null)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [newRating, setNewRating] = useState(0)
  const [ratingComment, setRatingComment] = useState('')
  const [hoveredRating, setHoveredRating] = useState(0)
  const [submittingRating, setSubmittingRating] = useState(false)

  useEffect(() => {
    if (user && contratId) loadContrat()
  }, [user, contratId])

  useEffect(() => {
    if (contrat) loadRating()
  }, [contrat])

  const loadContrat = async () => {
    setLoading(true)
    
    try {
      const token = getToken()
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch(`${API_URL}/auth/contracts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        const contratTrouve = data.contrats.find((c: any) => String(c.id) === String(contratId))
        
        if (contratTrouve) {
          let sessions: Session[] = []
          try {
            const sessionsResponse = await fetch(`${API_URL}/auth/parent/sessions`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            })
            const sessionsData = await sessionsResponse.json()
            
            if (sessionsData.success && sessionsData.sessions) {
              sessions = sessionsData.sessions.filter(
                (s: any) => String(s.contract_id) === String(contratId)
              )
            }
          } catch (err) {
            console.warn('⚠️ Impossible de charger les sessions:', err)
            sessions = contratTrouve.sessions || []
          }

          const enriched: ContratDetail = {
            ...contratTrouve,
            id: contratTrouve.id,
            parent_id: contratTrouve.parent_id,
            precepteur_id: contratTrouve.precepteur_id,
            eleve_id: contratTrouve.eleve_id || contratTrouve.eleve?.id,
            matiere_id: contratTrouve.matiere_id || contratTrouve.matiere?.id,
            date_debut: contratTrouve.date_debut || '',
            date_fin: contratTrouve.date_fin || '',
            heure_debut_pref: contratTrouve.heure_debut_pref || '',
            heure_fin_pref: contratTrouve.heure_fin_pref || '',
            jours_pref: contratTrouve.jours_pref || '',
            type_contrat: contratTrouve.type_contrat || 'ponctuel',
            frequence: contratTrouve.frequence || 'hebdomadaire',
            tarif_horaire: contratTrouve.tarif_horaire || contratTrouve.tarif_final || null,
            notes: contratTrouve.notes || null,
            statut: contratTrouve.statut || 'en_attente',
            created_at: contratTrouve.created_at || '',
            enfant_nom: contratTrouve.eleve?.nom || contratTrouve.enfant_nom || '',
            enfant_prenom: contratTrouve.eleve?.prenom || contratTrouve.enfant_prenom || '',
            enfant_postnom: contratTrouve.eleve?.postnom || contratTrouve.enfant_postnom || null,
            enfant_niveau: contratTrouve.eleve?.niveau || contratTrouve.enfant_niveau || contratTrouve.niveau || '',
            enfant_genre: contratTrouve.eleve?.genre || contratTrouve.enfant_genre || '',
            enfant_date_naissance: contratTrouve.eleve?.date_naissance || contratTrouve.enfant_date_naissance || null,
            enfant_ecole: contratTrouve.eleve?.ecole || contratTrouve.enfant_ecole || null,
            matiere_nom: contratTrouve.matiere?.nom || contratTrouve.matiere_nom || contratTrouve.matiere || '',
            matiere_niveau: contratTrouve.matiere?.niveau || contratTrouve.matiere_niveau || contratTrouve.niveau || '',
            matiere_description: contratTrouve.matiere?.description || contratTrouve.matiere_description || null,
            precepteur_username: contratTrouve.precepteur?.user?.username || contratTrouve.precepteur_username || '',
            precepteur_email: contratTrouve.precepteur?.user?.email || contratTrouve.precepteur_email || '',
            precepteur_telephone: contratTrouve.precepteur?.user?.telephone || contratTrouve.precepteur_telephone || null,
            precepteur_commune: contratTrouve.precepteur?.commune || contratTrouve.precepteur_commune || '',
            precepteur_quartier: contratTrouve.precepteur?.quartier || contratTrouve.precepteur_quartier || '',
            precepteur_note: contratTrouve.precepteur?.note_moyenne || contratTrouve.precepteur_note || 0,
            precepteur_diplome: contratTrouve.precepteur?.diplome || contratTrouve.precepteur_diplome || '',
            precepteur_annees_exp: contratTrouve.precepteur?.annees_experience || contratTrouve.precepteur_annees_exp || 0,
            precepteur_photo: contratTrouve.precepteur?.user?.photo_profil || contratTrouve.precepteur_photo || null,
            parent_telephone: contratTrouve.parent?.telephone || contratTrouve.parent_telephone || null,
            parent_adresse: contratTrouve.parent?.adresse || contratTrouve.parent_adresse || null,
            sessions: sessions
          }

          setContrat(enriched)
        }
      }
    } catch (error) {
      console.error('❌ Erreur chargement contrat:', error)
    }
    
    setLoading(false)
  }

  const loadRating = async () => {
    if (!contrat) return

    try {
      const token = getToken()
      if (!token) return

      const response = await fetch(`${API_URL}/auth/precepteur/ratings?contract_id=${contrat.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.rating) {
          setRating(data.rating)
        }
      }
    } catch (error) {
      console.error('❌ Erreur chargement rating:', error)
    }
  }

  const handleAnnulerContrat = async () => {
    if (!confirm('Voulez-vous vraiment annuler ce contrat ?')) return

    try {
      const token = getToken()
      if (!token) return

      const response = await fetch(`${API_URL}/auth/contracts/${contratId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ statut: 'annule' })
      })

      if (response.ok) {
        setMessage('Contrat annulé avec succès')
        await loadContrat()
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      console.error('❌ Erreur annulation contrat:', error)
    }
  }

  const openRatingModal = () => {
    if (rating) {
      setNewRating(rating.note)
      setRatingComment(rating.commentaire || '')
    } else {
      setNewRating(0)
      setRatingComment('')
    }
    setShowRatingModal(true)
  }

  const handleSubmitRating = async () => {
    if (newRating === 0) return

    setSubmittingRating(true)

    try {
      const token = getToken()
      if (!token) return

      const body = {
        contract_id: contrat!.id,
        precepteur_id: contrat!.precepteur_id,
        note: newRating,
        commentaire: ratingComment || null
      }

      let response
      if (rating) {
        response = await fetch(`${API_URL}/auth/precepteur/ratings/${rating.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        })
      } else {
        response = await fetch(`${API_URL}/auth/precepteur/ratings`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        })
      }

      if (response.ok) {
        setMessage(rating ? '✅ Votre avis a été modifié avec succès !' : '✅ Merci pour votre avis !')
        await loadRating()
        await loadContrat()
        setShowRatingModal(false)
      } else {
        const errorData = await response.json()
        setMessage(errorData.error || 'Erreur lors de l\'envoi')
      }
    } catch (error) {
      console.error('❌ Erreur rating:', error)
      setMessage('Erreur lors de l\'envoi')
    }

    setSubmittingRating(false)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleDownloadFile = async (filePath: string, fileName: string) => {
    try {
      const token = getToken()
      if (!token) return

      const baseUrl = API_URL.replace('/api', '')
      const url = `${baseUrl}${filePath}`
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const downloadUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = downloadUrl
        a.download = fileName
        a.click()
        URL.revokeObjectURL(downloadUrl)
      }
    } catch (error) {
      console.error('❌ Erreur téléchargement:', error)
    }
  }

  const openSessionDetail = (session: Session) => {
    setSelectedSession(session)
    setShowSessionDetailModal(true)
  }

  const getPhotoUrl = (photoPath: string | null | undefined) => {
    if (!photoPath) return null
    if (photoPath.startsWith('http')) return photoPath
    const baseUrl = API_URL.replace('/api', '')
    return `${baseUrl}${photoPath}`
  }

  const getStatutStyle = (statut: string) => {
    switch (statut) {
      case 'actif': return 'bg-green-100 text-green-700 border-green-200'
      case 'en_attente': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'accepte': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'termine': return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'annule': return 'bg-red-100 text-red-700 border-red-200'
      case 'refuse': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getSessionStatutStyle = (statut: string) => {
    switch (statut) {
      case 'termine': return 'bg-green-100 text-green-700'
      case 'annule': return 'bg-red-100 text-red-700'
      case 'en_cours': return 'bg-yellow-100 text-yellow-700'
      case 'planifie': return 'bg-blue-100 text-blue-700'
      case 'reporte': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image': return <ImageIcon className="w-4 h-4" />
      case 'pdf': return <FileText className="w-4 h-4" />
      case 'video': return <Video className="w-4 h-4" />
      case 'document': return <FileText className="w-4 h-4" />
      default: return <File className="w-4 h-4" />
    }
  }

  const getFileColor = (fileType: string) => {
    switch (fileType) {
      case 'image': return 'bg-blue-100 text-blue-700'
      case 'pdf': return 'bg-red-100 text-red-700'
      case 'video': return 'bg-purple-100 text-purple-700'
      case 'document': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatSize = (bytes: number | null) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-20"><Loader /></div>
      </div>
    )
  }

  if (!contrat) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Contrat non trouvé</p>
        <Link href="/dashboard/parent" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
          Retour au tableau de bord
        </Link>
      </div>
    )
  }

  const sessionsTerminees = contrat.sessions.filter(s => s.statut === 'termine').length
  const sessionsAVenir = contrat.sessions.filter(s => s.statut === 'planifie' || s.statut === 'en_cours').length
  const joursLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
  const jours = contrat.jours_pref?.split(',').map((j: string) => joursLabels[parseInt(j) - 1]).join(', ') || 'Non spécifié'

  const displayedSessions = showAllSessions ? contrat.sessions : contrat.sessions.slice(0, 5)

  const allGrades = contrat.sessions.flatMap(s => s.grades || [])
  const moyenneGlobale = allGrades.length > 0
    ? allGrades.reduce((acc, g) => acc + (g.score / g.max_score) * 20, 0) / allGrades.length
    : 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Toast message */}
      {message && (
        <div className={`mb-3 p-3 rounded-xl text-sm flex items-center gap-2 ${
          message.includes('Erreur') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
        }`}>
          {message.includes('Erreur') ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          {message}
        </div>
      )}

      {/* Retour */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Retour
      </button>

      {/* En-tête + Stats */}
      <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <h1 className="text-2xl font-bold text-gray-900">{contrat.matiere_nom}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatutStyle(contrat.statut)}`}>
                {contrat.statut.replace('_', ' ')}
              </span>
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Hash className="w-3.5 h-3.5" />
              Contrat N°{contrat.id} • 
              <span className="capitalize">{contrat.type_contrat}</span> • 
              <span className="capitalize">{contrat.frequence}</span>
            </p>
          </div>
          {contrat.statut === 'actif' && (
            <button
              onClick={handleAnnulerContrat}
              className="px-4 py-2 bg-red-50 text-red-600 text-sm rounded-xl hover:bg-red-100 flex items-center gap-2 font-medium transition-colors"
            >
              <X className="w-4 h-4" /> Annuler le contrat
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{contrat.sessions.length}</p>
            <p className="text-xs text-gray-600 mt-0.5">Sessions totales</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{sessionsTerminees}</p>
            <p className="text-xs text-gray-600 mt-0.5">Terminées</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{sessionsAVenir}</p>
            <p className="text-xs text-gray-600 mt-0.5">À venir / En cours</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {contrat.tarif_horaire ? `${contrat.tarif_horaire.toLocaleString()} FC` : 'N/A'}
            </p>
            <p className="text-xs text-gray-600 mt-0.5">Tarif/horaire</p>
          </div>
        </div>
      </div>

      {/* Informations détaillées - Grille de cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Enfant */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 rounded-lg">
              <User className="w-4 h-4 text-blue-600" />
            </span>
            Élève
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Nom complet</p>
              <p className="text-sm font-semibold text-gray-900">
                {contrat.enfant_prenom} {contrat.enfant_nom} {contrat.enfant_postnom || ''}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Niveau scolaire</p>
              <p className="text-sm font-semibold text-gray-900">{contrat.enfant_niveau}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Genre</p>
              <p className="text-sm font-semibold text-gray-900">{contrat.enfant_genre === 'M' ? 'Garçon' : 'Fille'}</p>
            </div>
            {contrat.enfant_date_naissance && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Date de naissance</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(contrat.enfant_date_naissance).toLocaleDateString('fr-FR', { 
                    day: 'numeric', month: 'long', year: 'numeric' 
                  })}
                </p>
              </div>
            )}
            {contrat.enfant_ecole && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Établissement</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-gray-400" />
                  {contrat.enfant_ecole}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Précepteur */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="p-1.5 bg-purple-50 rounded-lg">
              <GraduationCap className="w-4 h-4 text-purple-600" />
            </span>
            Précepteur
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-3">
              {contrat.precepteur_photo ? (
                <img src={getPhotoUrl(contrat.precepteur_photo) || ''} alt="Précepteur" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900">{contrat.precepteur_username}</p>
                <div className="flex items-center gap-1 text-sm text-yellow-600">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {contrat.precepteur_note?.toFixed(1) || '0.0'}/5
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Expérience & Diplôme</p>
              <p className="text-sm font-semibold text-gray-900">
                {contrat.precepteur_annees_exp} an(s) d'expérience • {contrat.precepteur_diplome || 'Diplôme non spécifié'}
              </p>
            </div>
            {contrat.precepteur_telephone && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Téléphone</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  {contrat.precepteur_telephone}
                </p>
              </div>
            )}
            {contrat.precepteur_email && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Email</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  {contrat.precepteur_email}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Localisation</p>
              <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {[contrat.precepteur_quartier, contrat.precepteur_commune].filter(Boolean).join(', ') || 'Non spécifiée'}
              </p>
            </div>

            {/* NOTATION DU PRÉCEPTEUR */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              {rating ? (
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-yellow-700 flex items-center gap-1.5">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      Votre évaluation
                    </p>
                    <button
                      onClick={openRatingModal}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      Modifier
                    </button>
                  </div>
                  <div className="flex items-center gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= rating.note
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-1.5 text-sm font-bold text-yellow-700">
                      {rating.note}/5
                    </span>
                  </div>
                  {rating.commentaire && (
                    <p className="text-sm text-gray-700 italic bg-white/50 rounded-lg p-2">
                      "{rating.commentaire}"
                    </p>
                  )}
                </div>
              ) : (
                <button
                  onClick={openRatingModal}
                  className="w-full px-4 py-3 bg-yellow-50 text-yellow-700 rounded-xl hover:bg-yellow-100 flex items-center justify-center gap-2 font-medium transition-colors text-sm border-2 border-dashed border-yellow-300 hover:border-yellow-400"
                >
                  <Star className="w-4 h-4" />
                  Noter ce précepteur
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Matière & Horaires */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 rounded-lg">
              <BookOpen className="w-4 h-4 text-indigo-600" />
            </span>
            Matière & Planning
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Matière enseignée</p>
              <p className="text-sm font-semibold text-gray-900">{contrat.matiere_nom}</p>
              <p className="text-xs text-gray-500">Niveau {contrat.matiere_niveau}</p>
            </div>
            {contrat.matiere_description && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Description</p>
                <p className="text-sm text-gray-700">{contrat.matiere_description}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Période du contrat</p>
              <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                Du {new Date(contrat.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                {' au '}
                {contrat.date_fin ? new Date(contrat.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Non définie'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Horaires habituels</p>
              <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                {contrat.heure_debut_pref || contrat.heure_fin_pref ? `${contrat.heure_debut_pref?.slice(0, 5) || '?'} - ${contrat.heure_fin_pref?.slice(0, 5) || '?'}` : 'Non spécifiés'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Jours de cours</p>
              <p className="text-sm font-semibold text-gray-900">{jours}</p>
            </div>
          </div>
        </div>

        {/* Détails contrat */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="p-1.5 bg-green-50 rounded-lg">
              <FileText className="w-4 h-4 text-green-600" />
            </span>
            Détails du contrat
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Type</p>
                <p className="text-sm font-semibold text-gray-900 capitalize">{contrat.type_contrat}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Fréquence</p>
                <p className="text-sm font-semibold text-gray-900 capitalize">{contrat.frequence}</p>
              </div>
            </div>
            {contrat.tarif_horaire && (
              <div className="bg-green-50 rounded-xl p-3">
                <p className="text-xs text-green-600 mb-0.5">Tarif horaire</p>
                <p className="text-xl font-bold text-green-700 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" />
                  {contrat.tarif_horaire.toLocaleString()} FC/h
                </p>
              </div>
            )}
            {contrat.notes && (
              <div className="bg-amber-50 rounded-xl p-3">
                <p className="text-xs text-amber-600 mb-0.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Notes du contrat
                </p>
                <p className="text-sm text-amber-900">{contrat.notes}</p>
              </div>
            )}
            {contrat.parent_telephone && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Mon téléphone</p>
                <p className="text-sm font-semibold text-gray-900">{contrat.parent_telephone}</p>
              </div>
            )}
            {contrat.parent_adresse && (
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Mon adresse</p>
                <p className="text-sm font-semibold text-gray-900">{contrat.parent_adresse}</p>
              </div>
            )}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Contrat créé le {new Date(contrat.created_at).toLocaleDateString('fr-FR', { 
                  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions - Liste cliquable */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-700" />
                Sessions du contrat
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                {contrat.sessions.length} session{contrat.sessions.length > 1 ? 's' : ''} au total
              </p>
            </div>
            {allGrades.length > 0 && (
              <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-lg">
                <Award className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-semibold text-yellow-700">
                  Moyenne : {moyenneGlobale.toFixed(1)}/20
                </span>
              </div>
            )}
          </div>
        </div>

        {contrat.sessions.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium mb-1">Aucune session planifiée</p>
            <p className="text-gray-400 text-sm">Les sessions apparaîtront ici une fois qu'elles seront créées par le précepteur.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100">
              {displayedSessions
                .sort((a, b) => new Date(b.date_session).getTime() - new Date(a.date_session).getTime())
                .map((session) => (
                <div
                  key={session.id}
                  className="p-4 hover:bg-gray-50/50 transition-colors cursor-pointer group"
                  onClick={() => openSessionDetail(session)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getSessionStatutStyle(session.statut)}`}>
                        {session.statut.replace('_', ' ')}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(session.date_session).toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {session.heure_debut?.slice(0, 5)} - {session.heure_fin?.slice(0, 5)} • {session.duree_minutes} min
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.type_session && (
                        <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-lg">
                          {session.type_session.replace('_', ' ')}
                        </span>
                      )}
                      {session.lieu && (
                        <span className="text-xs text-gray-400 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                          <MapPin className="w-3 h-3" /> {session.lieu}
                        </span>
                      )}
                      <Eye className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* Indicateurs de contenu */}
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    {session.notes_precepteur && (
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> Notes
                      </span>
                    )}
                    {session.files && session.files.length > 0 && (
                      <span className="flex items-center gap-1">
                        <File className="w-3 h-3" /> {session.files.length} fichier{session.files.length > 1 ? 's' : ''}
                      </span>
                    )}
                    {session.grades && session.grades.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Award className="w-3 h-3" /> {session.grades.length} évaluation{session.grades.length > 1 ? 's' : ''}
                      </span>
                    )}
                    {session.lien_visio && (
                      <span className="flex items-center gap-1 text-blue-500">
                        <Play className="w-3 h-3" /> Visio
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {contrat.sessions.length > 5 && (
              <div className="text-center py-4 border-t">
                <button
                  onClick={() => setShowAllSessions(!showAllSessions)}
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  {showAllSessions 
                    ? 'Afficher moins de sessions' 
                    : `Voir les ${contrat.sessions.length - 5} autres sessions`
                  }
                </button>
              </div>
            )}
          </>
        )}
      </div>

    
{/* ========== MODAL DÉTAIL SESSION (STYLE PRÉCEPTEUR) ========== */}
{showSessionDetailModal && selectedSession && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      {/* En-tête */}
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Détails de la session</h2>
        <button 
          onClick={() => {
            setShowSessionDetailModal(false)
            setSelectedSession(null)
          }} 
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-4">
        {/* Statut actuel */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getSessionStatutStyle(selectedSession.statut)}`}>
            {selectedSession.statut === 'planifie' && <Calendar className="w-4 h-4" />}
            {selectedSession.statut === 'en_cours' && <Clock className="w-4 h-4" />}
            {selectedSession.statut === 'termine' && <Check className="w-4 h-4" />}
            {selectedSession.statut === 'annule' && <X className="w-4 h-4" />}
            Statut : {selectedSession.statut.replace('_', ' ')}
          </span>
        </div>

        {/* Date et heure */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Date
            </h3>
            <p className="font-medium">
              {new Date(selectedSession.date_session).toLocaleDateString('fr-FR', { 
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
              })}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Horaire
            </h3>
            <p className="font-medium">{selectedSession.heure_debut?.slice(0, 5)} - {selectedSession.heure_fin?.slice(0, 5)}</p>
            <p className="text-sm text-gray-500">{selectedSession.duree_minutes} minutes</p>
          </div>
        </div>

        {/* Type et lieu */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Type</h3>
            <p className="font-medium capitalize">{selectedSession.type_session?.replace('_', ' ')}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Lieu
            </h3>
            <p className="font-medium">{selectedSession.lieu || 'Non spécifié'}</p>
          </div>
        </div>

        {/* Lien visio */}
        {selectedSession.lien_visio && (
          <div className="bg-blue-50 p-4 rounded-xl">
            <h3 className="text-sm font-medium text-blue-700 mb-1">Lien visio</h3>
            <a 
              href={selectedSession.lien_visio} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 break-all hover:underline"
            >
              {selectedSession.lien_visio}
            </a>
          </div>
        )}

        {/* Notes du précepteur */}
        {selectedSession.notes_precepteur && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Notes du précepteur
            </h3>
            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-sm text-blue-900 whitespace-pre-wrap">{selectedSession.notes_precepteur}</p>
            </div>
          </div>
        )}

        {/* Raison d'annulation */}
        {selectedSession.raison_annulation && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <X className="w-4 h-4 text-red-600" /> Raison d'annulation
            </h3>
            <div className="bg-red-50 p-4 rounded-xl">
              <p className="text-xs text-red-600 mb-1">
                Annulé par {selectedSession.annule_par === 'parent' ? 'vous' : 'le précepteur'}
              </p>
              <p className="text-sm text-red-900">{selectedSession.raison_annulation}</p>
            </div>
          </div>
        )}

        {/* Fichiers */}
        {selectedSession.files && selectedSession.files.length > 0 && (
          <div className="border-t pt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">
                  Fichiers ({selectedSession.files.length})
                </h3>
              </div>

              <div className="space-y-1.5">
                {selectedSession.files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
                  >
                    <div className={`p-1.5 rounded-lg ${getFileColor(file.file_type)}`}>
                      {getFileIcon(file.file_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 truncate">{file.file_name}</p>
                      <p className="text-xs text-gray-400">
                        {formatSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownloadFile(file.file_path, file.file_name)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Télécharger"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cotations / Évaluations */}
        {selectedSession.grades && selectedSession.grades.length > 0 && (
          <div className="border-t pt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-gray-700">
                    Cotations ({selectedSession.grades.length})
                  </h3>
                  {selectedSession.grades.length > 0 && (
                    <span className={`text-xs font-medium ${
                      (selectedSession.grades.reduce((acc, g) => acc + (g.score / g.max_score) * 20, 0) / selectedSession.grades.length) >= 80 ? 'text-green-600' :
                      (selectedSession.grades.reduce((acc, g) => acc + (g.score / g.max_score) * 20, 0) / selectedSession.grades.length) >= 60 ? 'text-blue-600' :
                      (selectedSession.grades.reduce((acc, g) => acc + (g.score / g.max_score) * 20, 0) / selectedSession.grades.length) >= 40 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      Moy: {(selectedSession.grades.reduce((acc, g) => acc + (g.score / g.max_score) * 20, 0) / selectedSession.grades.length).toFixed(1)}/20
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {selectedSession.grades.map((grade) => {
                  const percentage = Math.min((grade.score / grade.max_score) * 100, 100)
                  const scoreOn20 = (grade.score / grade.max_score) * 20
                  
                  return (
                    <div
                      key={grade.id}
                      className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-700 truncate">
                            {grade.titre || grade.title || 'Évaluation'}
                          </p>
                          {grade.comment && (
                            <p className="text-xs text-gray-400 mt-0.5">{grade.comment}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          <span className={`text-sm font-bold ${
                            percentage >= 80 ? 'text-green-600' :
                            percentage >= 60 ? 'text-blue-600' :
                            percentage >= 40 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {grade.score}/{grade.max_score}
                          </span>
                          <span className="text-xs text-gray-400">
                            ({scoreOn20.toFixed(1)}/20)
                          </span>
                        </div>
                      </div>
                      
                      {/* Barre de progression */}
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            percentage >= 80 ? 'bg-green-500' :
                            percentage >= 60 ? 'bg-blue-500' :
                            percentage >= 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}

                {/* Résumé */}
                {selectedSession.grades.length > 0 && (
                  <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                    <Award className="w-4 h-4 text-yellow-600" />
                    <span className="text-xs text-yellow-700">
                      <span className="font-medium">Moyenne session:</span>{' '}
                      {(selectedSession.grades.reduce((acc, g) => acc + (g.score / g.max_score) * 20, 0) / selectedSession.grades.length).toFixed(1)}/20
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Note de la session */}
        {selectedSession.note_session && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Note de la session</h3>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= (selectedSession.note_session || 0)
                      ? 'text-yellow-500 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-sm font-semibold text-gray-700">
                {selectedSession.note_session}/5
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)}
      {/* ========== MODAL NOTATION PRÉCEPTEUR ========== */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  {rating ? 'Modifier votre avis' : 'Noter le précepteur'}
                </h2>
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {contrat.precepteur_username}
              </p>
            </div>

            <div className="p-6 space-y-5">
              {/* Étoiles */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Votre note <span className="text-red-500">*</span>
                </p>
                <div className="flex items-center gap-1 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110 p-1"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= (hoveredRating || newRating)
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {newRating > 0 && (
                  <p className="text-center text-sm font-medium text-yellow-700 mt-2">
                    {newRating}/5 - {
                      newRating === 1 ? 'Très insatisfait' :
                      newRating === 2 ? 'Insatisfait' :
                      newRating === 3 ? 'Moyen' :
                      newRating === 4 ? 'Satisfait' :
                      'Très satisfait'
                    }
                  </p>
                )}
              </div>

              {/* Commentaire */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Votre commentaire <span className="text-gray-400 text-xs">(optionnel)</span>
                </p>
                <textarea
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder="Partagez votre expérience avec ce précepteur..."
                  rows={4}
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-none transition-all"
                />
              </div>

              {/* Boutons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmitRating}
                  disabled={newRating === 0 || submittingRating}
                  className="flex-1 px-4 py-2.5 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm flex items-center justify-center gap-2"
                >
                  {submittingRating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {rating ? 'Modifier' : 'Envoyer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}