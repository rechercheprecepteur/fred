
// app/dashboard/parent/contrats/[id]/page.tsx
'use client'

import { useAuth } from '@/context/AuthContext'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
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
  Tag,
  Activity,
  Hash,
  Send,
  ThumbsUp
} from 'lucide-react'
import Loader from '@/components/Loader'

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
  files?: SessionFile[]
  grades?: SessionGrade[]
}

type SessionFile = {
  id: number
  session_id: number
  file_name: string
  file_path: string
  file_type: string
  file_size: number | null
  uploaded_by: string
  created_at: string
}

type SessionGrade = {
  id: number
  session_id: number
  title: string
  score: number
  max_score: number
  comment: string | null
  created_at: string
}

type PrecepteurRating = {
  id: number
  contract_id: number
  precepteur_id: number
  parent_id: number
  note: number
  commentaire: string | null
  created_at: string
  updated_at: string
}

type ContratDetail = {
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
  type_contrat: 'recurrent' | 'ponctuel'
  frequence: 'quotidien' | 'hebdomadaire' | 'bihebdomadaire' | 'mensuel' | 'ponctuel'
  tarif_horaire: number | null
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

export default function ContratDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const contratId = params.id as string

  const [contrat, setContrat] = useState<ContratDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'infos' | 'sessions'>('infos')
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [showAllSessions, setShowAllSessions] = useState(false)

  // États pour le rating
  const [rating, setRating] = useState<PrecepteurRating | null>(null)
  const [showRatingForm, setShowRatingForm] = useState(false)
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

    const { data: contratData, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', contratId)
      .single()

    if (error || !contratData) {
      setLoading(false)
      return
    }

    let enriched: any = { ...contratData }

    // Enfant
    const { data: enfant } = await supabase
      .from('eleves')
      .select('nom, postnom, prenom, niveau, genre, date_naissance, ecole')
      .eq('id', contratData.eleve_id)
      .single()
    if (enfant) {
      enriched.enfant_nom = enfant.nom
      enriched.enfant_postnom = enfant.postnom
      enriched.enfant_prenom = enfant.prenom
      enriched.enfant_niveau = enfant.niveau
      enriched.enfant_genre = enfant.genre
      enriched.enfant_date_naissance = enfant.date_naissance
      enriched.enfant_ecole = enfant.ecole
    }

    // Matière
    const { data: matiere } = await supabase
      .from('matieres')
      .select('nom, niveau, description')
      .eq('id', contratData.matiere_id)
      .single()
    if (matiere) {
      enriched.matiere_nom = matiere.nom
      enriched.matiere_niveau = matiere.niveau
      enriched.matiere_description = matiere.description
    }

    // Précepteur
    const { data: precepteur } = await supabase
      .from('precepteurs')
      .select('id, commune, quartier, note_moyenne, diplome, annees_experience, user_id')
      .eq('id', contratData.precepteur_id)
      .single()
    if (precepteur) {
      enriched.precepteur_commune = precepteur.commune
      enriched.precepteur_quartier = precepteur.quartier
      enriched.precepteur_note = precepteur.note_moyenne
      enriched.precepteur_diplome = precepteur.diplome
      enriched.precepteur_annees_exp = precepteur.annees_experience

      const { data: precepteurUser } = await supabase
        .from('users')
        .select('username, email, photo_profil, telephone')
        .eq('id', precepteur.user_id)
        .single()
      if (precepteurUser) {
        enriched.precepteur_username = precepteurUser.username
        enriched.precepteur_email = precepteurUser.email
        enriched.precepteur_photo = precepteurUser.photo_profil
        enriched.precepteur_telephone = precepteurUser.telephone
      }
    }

    // Parent
    const { data: parent } = await supabase
      .from('parents')
      .select('telephone, adresse')
      .eq('id', contratData.parent_id)
      .single()
    if (parent) {
      enriched.parent_telephone = parent.telephone
      enriched.parent_adresse = parent.adresse
    }

    // Sessions avec fichiers et grades
    const { data: sessions } = await supabase
      .from('sessions_cours')
      .select('*')
      .eq('contract_id', contratData.id)
      .order('date_session', { ascending: false })

    if (sessions) {
      const sessionsWithDetails = await Promise.all(
        sessions.map(async (session) => {
          const { data: files } = await supabase
            .from('session_files')
            .select('*')
            .eq('session_id', session.id)
            .order('created_at', { ascending: false })

          const { data: grades } = await supabase
            .from('session_grades')
            .select('*')
            .eq('session_id', session.id)
            .order('created_at', { ascending: false })

          return {
            ...session,
            files: files || [],
            grades: grades || []
          }
        })
      )
      enriched.sessions = sessionsWithDetails
    } else {
      enriched.sessions = []
    }

    setContrat(enriched as ContratDetail)
    setLoading(false)
  }

  const loadRating = async () => {
    if (!contrat) return

    const { data } = await supabase
      .from('precepteur_ratings')
      .select('*')
      .eq('contract_id', contrat.id)
      .single()

    if (data) {
      setRating(data)
      setNewRating(data.note)
      setRatingComment(data.commentaire || '')
    }
  }

  const handleAnnulerContrat = async () => {
    if (!confirm('Voulez-vous vraiment annuler ce contrat ?')) return

    const { error } = await supabase
      .from('contracts')
      .update({ statut: 'annule' })
      .eq('id', contratId)

    if (!error) {
      setMessage('Contrat annulé avec succès')
      await loadContrat()
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleSubmitRating = async () => {
    if (newRating === 0) return

    setSubmittingRating(true)

    if (rating) {
      // Modifier le rating existant
      const { error } = await supabase
        .from('precepteur_ratings')
        .update({
          note: newRating,
          commentaire: ratingComment || null
        })
        .eq('id', rating.id)

      if (!error) {
        setMessage('Votre avis a été modifié avec succès !')
        await loadRating()
        await loadContrat()
      } else {
        setMessage('Erreur lors de la modification')
      }
    } else {
      // Créer un nouveau rating
      const { error } = await supabase
        .from('precepteur_ratings')
        .insert({
          contract_id: contrat!.id,
          precepteur_id: contrat!.precepteur_id,
          parent_id: contrat!.parent_id,
          note: newRating,
          commentaire: ratingComment || null
        })

      if (!error) {
        setMessage('Merci pour votre avis !')
        await loadRating()
        await loadContrat()
      } else {
        setMessage('Erreur lors de l\'envoi')
      }
    }

    setSubmittingRating(false)
    setShowRatingForm(false)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleDownloadFile = async (filePath: string, fileName: string) => {
    const { data } = await supabase.storage
      .from('session-files')
      .download(filePath)

    if (data) {
      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const getPublicUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('session-files')
      .getPublicUrl(filePath)
    return data?.publicUrl || ''
  }

  const getStatutStyle = (statut: string) => {
    switch (statut) {
      case 'actif': return 'bg-green-100 text-green-700'
      case 'en_attente': return 'bg-yellow-100 text-yellow-700'
      case 'accepte': return 'bg-blue-100 text-blue-700'
      case 'termine': return 'bg-gray-100 text-gray-700'
      case 'annule': return 'bg-red-100 text-red-700'
      case 'refuse': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
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

  // Calculer la moyenne globale des cotations
  const allGrades = contrat.sessions.flatMap(s => s.grades || [])
  const moyenneGlobale = allGrades.length > 0
    ? allGrades.reduce((acc, g) => acc + (g.score / g.max_score) * 20, 0) / allGrades.length
    : 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Toast */}
      {message && (
        <div className="mb-3 p-3 rounded-xl text-sm flex items-center gap-2 bg-green-50 text-green-600 animate-fadeIn">
          <Check className="w-4 h-4" /> {message}
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
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatutStyle(contrat.statut)}`}>
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

      {/* Navigation par onglets */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('infos')}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'infos' 
              ? 'bg-black text-white shadow-lg shadow-black/20' 
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Informations contrat
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'sessions' 
              ? 'bg-black text-white shadow-lg shadow-black/20' 
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Sessions ({contrat.sessions.length})
        </button>
      </div>

      {/* Contenu de l'onglet Informations */}
      {activeTab === 'infos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <img src={contrat.precepteur_photo} alt="Précepteur" className="w-12 h-12 rounded-full object-cover" />
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

              {/* Section Rating */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                {!showRatingForm ? (
                  <div>
                    {rating ? (
                      // Afficher le rating existant
                      <div className="bg-yellow-50 rounded-xl p-3">
                        <p className="text-xs text-yellow-600 mb-1 font-medium flex items-center gap-1">
                          <ThumbsUp className="w-3.5 h-3.5" />
                          Votre évaluation
                        </p>
                        <div className="flex items-center gap-0.5 mb-1">
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
                          <span className="ml-1 text-sm font-semibold text-yellow-700">
                            {rating.note}/5
                          </span>
                        </div>
                        {rating.commentaire && (
                          <p className="text-sm text-gray-700 mt-1 italic">"{rating.commentaire}"</p>
                        )}
                        <button
                          onClick={() => setShowRatingForm(true)}
                          className="text-xs text-blue-600 hover:underline mt-2 font-medium"
                        >
                          Modifier mon avis
                        </button>
                      </div>
                    ) : (
                      // Bouton pour noter
                      <button
                        onClick={() => setShowRatingForm(true)}
                        className="w-full px-4 py-2.5 bg-yellow-50 text-yellow-700 rounded-xl hover:bg-yellow-100 flex items-center justify-center gap-2 font-medium transition-colors text-sm border border-yellow-200"
                      >
                        <Star className="w-4 h-4" />
                        Noter ce précepteur
                      </button>
                    )}
                  </div>
                ) : (
                  // Formulaire de notation
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                    <p className="text-sm font-semibold text-gray-900 mb-3">
                      {rating ? 'Modifier votre évaluation' : 'Évaluer ce précepteur'}
                    </p>
                    
                    {/* Étoiles interactives */}
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setNewRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= (hoveredRating || newRating)
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      {newRating > 0 && (
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          {newRating}/5
                        </span>
                      )}
                    </div>

                    {/* Commentaire */}
                    <textarea
                      value={ratingComment}
                      onChange={(e) => setRatingComment(e.target.value)}
                      placeholder="Partagez votre expérience avec ce précepteur (optionnel)..."
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 resize-none"
                    />

                    {/* Boutons d'action */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => {
                          setShowRatingForm(false)
                          setNewRating(rating?.note || 0)
                          setRatingComment(rating?.commentaire || '')
                        }}
                        className="flex-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleSubmitRating}
                        disabled={newRating === 0 || submittingRating}
                        className="flex-1 px-3 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-colors"
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
                  {new Date(contrat.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Horaires habituels</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  {contrat.heure_debut_pref?.slice(0, 5)} - {contrat.heure_fin_pref?.slice(0, 5)}
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
      )}

      {/* Contenu de l'onglet Sessions */}
      {activeTab === 'sessions' && (
        <div className="space-y-4">
          {/* Résumé des cotations */}
          {allGrades.length > 0 && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-500" />
                  Résumé des évaluations
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{allGrades.length} note{allGrades.length > 1 ? 's' : ''}</span>
                  <span className="text-lg font-bold text-yellow-600">
                    {moyenneGlobale.toFixed(1)}/20
                  </span>
                </div>
              </div>
            </div>
          )}

          {contrat.sessions.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium mb-1">Aucune session planifiée</p>
              <p className="text-gray-400 text-sm">Les sessions apparaîtront ici une fois qu'elles seront créées par le précepteur.</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {displayedSessions.map((session) => (
                  <div key={session.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* En-tête session */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
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
                          <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-lg">
                            {session.type_session?.replace('_', ' ')}
                          </span>
                          {session.lieu && (
                            <span className="text-xs text-gray-400 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                              <MapPin className="w-3 h-3" /> {session.lieu}
                            </span>
                          )}
                          {session.lien_visio && (
                            <a
                              href={session.lien_visio}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline bg-blue-50 px-2 py-1 rounded-lg flex items-center gap-1"
                            >
                              <Play className="w-3 h-3" /> Visio
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Notes */}
                      {session.notes_precepteur && (
                        <div className="bg-blue-50 p-3 rounded-xl mb-3">
                          <p className="text-xs text-blue-600 mb-1 font-medium">Note du précepteur</p>
                          <p className="text-sm text-blue-900">{session.notes_precepteur}</p>
                        </div>
                      )}
                      {session.raison_annulation && (
                        <div className="bg-red-50 p-3 rounded-xl mb-3">
                          <p className="text-xs text-red-600 mb-1 font-medium">
                            Annulé par {session.annule_par === 'parent' ? 'vous' : 'le précepteur'}
                          </p>
                          <p className="text-sm text-red-700">{session.raison_annulation}</p>
                        </div>
                      )}

                      {/* Fichiers */}
                      {session.files && session.files.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1.5">
                            <File className="w-3.5 h-3.5" />
                            Fichiers ({session.files.length})
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {session.files.map((file) => (
                              <div key={file.id}>
                                {/* Preview pour images */}
                                {(file.file_type === 'image') && (
                                  <div className="relative group">
                                    <img
                                      src={getPublicUrl(file.file_path)}
                                      alt={file.file_name}
                                      className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all rounded-lg flex items-center justify-center">
                                      <button
                                        onClick={() => handleDownloadFile(file.file_path, file.file_name)}
                                        className="opacity-0 group-hover:opacity-100 transition-all p-1.5 bg-white rounded-lg"
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Preview pour vidéos */}
                                {file.file_type === 'video' && (
                                  <div className="relative group bg-gray-900 rounded-lg h-24 flex items-center justify-center">
                                    <Video className="w-8 h-8 text-gray-400" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all rounded-lg flex items-center justify-center">
                                      <button
                                        onClick={() => handleDownloadFile(file.file_path, file.file_name)}
                                        className="opacity-0 group-hover:opacity-100 transition-all p-1.5 bg-white rounded-lg"
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Preview pour autres fichiers */}
                                {file.file_type !== 'image' && file.file_type !== 'video' && (
                                  <div 
                                    className={`rounded-lg p-3 flex items-center gap-2 cursor-pointer hover:shadow transition-all ${getFileColor(file.file_type)}`}
                                    onClick={() => handleDownloadFile(file.file_path, file.file_name)}
                                  >
                                    {getFileIcon(file.file_type)}
                                    <div className="min-w-0 flex-1">
                                      <p className="text-xs font-medium truncate">{file.file_name}</p>
                                      <p className="text-xs opacity-70">{formatSize(file.file_size)}</p>
                                    </div>
                                    <Download className="w-3.5 h-3.5 flex-shrink-0" />
                                  </div>
                                )}
                                
                                {/* Légende sous l'image/vidéo */}
                                {(file.file_type === 'image' || file.file_type === 'video') && (
                                  <div className="flex items-center justify-between mt-1">
                                    <p className="text-xs text-gray-500 truncate flex-1 mr-1">{file.file_name}</p>
                                    <button
                                      onClick={() => handleDownloadFile(file.file_path, file.file_name)}
                                      className="text-gray-400 hover:text-blue-600 flex-shrink-0"
                                    >
                                      <Download className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Cotations */}
                      {session.grades && session.grades.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5" />
                            Évaluations ({session.grades.length})
                          </p>
                          <div className="space-y-1.5">
                            {session.grades.map((grade) => {
                              const percentage = Math.min((grade.score / grade.max_score) * 100, 100)
                              const scoreOn20 = (grade.score / grade.max_score) * 20
                              return (
                                <div key={grade.id} className="bg-gray-50 rounded-lg p-2.5">
                                  <div className="flex items-center justify-between mb-1.5">
                                    <p className="text-xs font-medium text-gray-700">{grade.title}</p>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-bold text-gray-900">
                                        {grade.score}/{grade.max_score}
                                      </span>
                                      <span className="text-xs text-gray-400">
                                        ({scoreOn20.toFixed(1)}/20)
                                      </span>
                                    </div>
                                  </div>
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
                                  {grade.comment && (
                                    <p className="text-xs text-gray-500 mt-1.5">{grade.comment}</p>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {contrat.sessions.length > 5 && (
                <div className="text-center pt-2">
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
      )}
    </div>
  )
}