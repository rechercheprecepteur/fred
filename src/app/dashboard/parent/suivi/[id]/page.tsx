// app/dashboard/parent/suivi/[id]/page.tsx
'use client'

import { useAuth } from '@/context/AuthContext'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User,
  Calendar,
  BookOpen,
  Clock,
  Check,
  X,
  AlertCircle,
  GraduationCap,
  Building,
  ChevronLeft,
  Award,
  Star,
  TrendingUp,
  TrendingDown,
  FileText,
  Eye,
  MapPin,
  Phone,
  Mail,
  Hash,
  Activity
} from 'lucide-react'
import Loader from '@/components/Loader'

type EleveInfo = {
  id: number
  nom: string
  postnom: string | null
  prenom: string
  genre: string
  date_naissance: string | null
  niveau: string
  ecole: string | null
}

type ContratWithDetails = {
  id: number
  matiere_nom: string
  matiere_niveau: string
  precepteur_username: string
  precepteur_photo: string | null
  precepteur_email: string | null
  precepteur_telephone: string | null
  precepteur_note: number
  precepteur_commune: string
  precepteur_quartier: string
  date_debut: string
  date_fin: string
  heure_debut_pref: string
  heure_fin_pref: string
  jours_pref: string
  tarif_horaire: number | null
  statut: string
  sessions: SessionWithDetails[]
}

type SessionWithDetails = {
  id: number
  date_session: string
  heure_debut: string
  heure_fin: string
  duree_minutes: number
  statut: string
  type_session: string
  lieu: string | null
  lien_visio: string | null
  notes_precepteur: string | null
  notes_parent: string | null
  feedback_precepteur: string | null
  feedback_parent: string | null
  note_session: number | null
  raison_annulation: string | null
  annule_par: string | null
  grades: Grade[]
  files: FileInfo[]
}

type Grade = {
  id: number
  title: string
  score: number
  max_score: number
  comment: string | null
  created_at: string
}

type FileInfo = {
  id: number
  file_name: string
  file_path: string
  file_type: string
  file_size: number | null
  uploaded_by: string
  created_at: string
}

export default function SuiviEnfantPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const enfantId = params.id as string

  const [eleve, setEleve] = useState<EleveInfo | null>(null)
  const [contrats, setContrats] = useState<ContratWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedContrat, setSelectedContrat] = useState<number | null>(null)
  const [activeView, setActiveView] = useState<'overview' | 'grades' | 'sessions'>('overview')

  useEffect(() => {
    if (user && enfantId) {
      loadSuiviData()
    }
  }, [user, enfantId])

  const loadSuiviData = async () => {
    setLoading(true)
    setError('')

    try {
      // Charger les infos de l'élève
      const { data: eleveData, error: eleveError } = await supabase
        .from('eleves')
        .select('*')
        .eq('id', enfantId)
        .single()

      if (eleveError || !eleveData) {
        setError('Enfant non trouvé')
        setLoading(false)
        return
      }

      setEleve(eleveData)

      // Charger les contrats avec leurs détails
      const { data: contratsData, error: contratsError } = await supabase
        .from('contracts')
        .select('*')
        .eq('eleve_id', enfantId)
        .order('created_at', { ascending: false })

      if (contratsError) throw contratsError

      if (contratsData && contratsData.length > 0) {
        const contratsEnrichis = await Promise.all(
          contratsData.map(async (contrat) => {
            const enriched: any = { ...contrat }

            // Matière
            const { data: matiere } = await supabase
              .from('matieres')
              .select('nom, niveau')
              .eq('id', contrat.matiere_id)
              .single()
            if (matiere) {
              enriched.matiere_nom = matiere.nom
              enriched.matiere_niveau = matiere.niveau
            }

            // Précepteur
            const { data: precepteur } = await supabase
              .from('precepteurs')
              .select('id, commune, quartier, note_moyenne, user_id')
              .eq('id', contrat.precepteur_id)
              .single()
            if (precepteur) {
              enriched.precepteur_commune = precepteur.commune
              enriched.precepteur_quartier = precepteur.quartier
              enriched.precepteur_note = precepteur.note_moyenne

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

            // Sessions avec grades et fichiers
            const { data: sessions } = await supabase
              .from('sessions_cours')
              .select('*')
              .eq('contract_id', contrat.id)
              .order('date_session', { ascending: false })

            if (sessions) {
              enriched.sessions = await Promise.all(
                sessions.map(async (session) => {
                  const { data: grades } = await supabase
                    .from('session_grades')
                    .select('*')
                    .eq('session_id', session.id)

                  const { data: files } = await supabase
                    .from('session_files')
                    .select('*')
                    .eq('session_id', session.id)

                  return {
                    ...session,
                    grades: grades || [],
                    files: files || []
                  }
                })
              )
            } else {
              enriched.sessions = []
            }

            return enriched as ContratWithDetails
          })
        )

        setContrats(contratsEnrichis)
        if (contratsEnrichis.length > 0) {
          setSelectedContrat(contratsEnrichis[0].id)
        }
      }
    } catch (err) {
      console.error('Erreur chargement:', err)
      setError('Erreur lors du chargement des données')
    }

    setLoading(false)
  }

  const getStatutColor = (statut: string) => {
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

  const getSessionStatutColor = (statut: string) => {
    switch (statut) {
      case 'termine': return 'bg-green-100 text-green-700'
      case 'annule': return 'bg-red-100 text-red-700'
      case 'en_cours': return 'bg-yellow-100 text-yellow-700'
      case 'planifie': return 'bg-blue-100 text-blue-700'
      case 'reporte': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const selectedContratData = contrats.find(c => c.id === selectedContrat)

  // Calculer les statistiques
  const allGrades = contrats.flatMap(c => 
    c.sessions.flatMap(s => s.grades)
  )

  const sessionsTerminees = contrats.flatMap(c => 
    c.sessions.filter(s => s.statut === 'termine')
  )

  const sessionsPlanifiees = contrats.flatMap(c => 
    c.sessions.filter(s => s.statut === 'planifie' || s.statut === 'en_cours')
  )

  const moyenneGlobale = allGrades.length > 0
    ? allGrades.reduce((acc, g) => acc + (g.score / g.max_score) * 20, 0) / allGrades.length
    : 0

  const getTendance = () => {
    if (allGrades.length < 2) return 'stable'
    const recent = allGrades.slice(-3)
    const moyenne = recent.reduce((acc, g) => acc + (g.score / g.max_score) * 20, 0) / recent.length
    return moyenne >= moyenneGlobale ? 'up' : 'down'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-20"><Loader /></div>
      </div>
    )
  }

  if (error || !eleve) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">{error || 'Enfant non trouvé'}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          Retour
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Bouton retour */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Retour
      </button>

      {/* En-tête élève */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
            eleve.genre === 'M' ? 'bg-blue-100' : 'bg-pink-100'
          }`}>
            <span className={`text-2xl font-bold ${
              eleve.genre === 'M' ? 'text-blue-600' : 'text-pink-600'
            }`}>
              {eleve.prenom[0]}{eleve.nom[0]}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {eleve.prenom} {eleve.nom} {eleve.postnom || ''}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-gray-400" />
                {eleve.niveau}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-gray-400" />
                {eleve.genre === 'M' ? 'Garçon' : 'Fille'}
              </span>
              {eleve.date_naissance && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  Né(e) le {new Date(eleve.date_naissance).toLocaleDateString('fr-FR')}
                </span>
              )}
              {eleve.ecole && (
                <span className="flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-gray-400" />
                  {eleve.ecole}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-blue-600">{contrats.length}</p>
          <p className="text-sm text-gray-600">Contrats</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-green-600">{sessionsTerminees.length}</p>
          <p className="text-sm text-gray-600">Sessions terminées</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-purple-600">{allGrades.length}</p>
          <p className="text-sm text-gray-600">Évaluations</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-yellow-600">{moyenneGlobale.toFixed(1)}/20</p>
            {getTendance() === 'up' ? (
              <TrendingUp className="w-5 h-5 text-green-500" />
            ) : getTendance() === 'down' ? (
              <TrendingDown className="w-5 h-5 text-red-500" />
            ) : null}
          </div>
          <p className="text-sm text-gray-600">Moyenne générale</p>
        </div>
      </div>

      {/* Sélecteur de contrat */}
      {contrats.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {contrats.map((contrat) => (
              <button
                key={contrat.id}
                onClick={() => setSelectedContrat(contrat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedContrat === contrat.id
                    ? 'bg-black text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {contrat.matiere_nom} • {contrat.precepteur_username}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Détails du contrat sélectionné */}
      {selectedContratData && (
        <div className="space-y-6">
          {/* Vue d'ensemble */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-700" />
              Détails du contrat
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Matière</p>
                <p className="font-medium text-gray-900">{selectedContratData.matiere_nom} ({selectedContratData.matiere_niveau})</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Précepteur</p>
                <div className="flex items-center gap-2">
                  {selectedContratData.precepteur_photo ? (
                    <img src={selectedContratData.precepteur_photo} alt="" className="w-6 h-6 rounded-full" />
                  ) : (
                    <User className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="font-medium text-gray-900">{selectedContratData.precepteur_username}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Période</p>
                <p className="font-medium text-gray-900">
                  {new Date(selectedContratData.date_debut).toLocaleDateString('fr-FR')} → {new Date(selectedContratData.date_fin).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Statut</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatutColor(selectedContratData.statut)}`}>
                  {selectedContratData.statut.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Progression */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-700">Progression des sessions</p>
                <p className="text-sm text-gray-500">
                  {selectedContratData.sessions.filter(s => s.statut === 'termine').length}/{selectedContratData.sessions.length} terminées
                </p>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all"
                  style={{ 
                    width: selectedContratData.sessions.length > 0 
                      ? `${(selectedContratData.sessions.filter(s => s.statut === 'termine').length / selectedContratData.sessions.length) * 100}%`
                      : '0%' 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Sessions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-700" />
                Sessions ({selectedContratData.sessions.length})
              </h3>
            </div>

            {selectedContratData.sessions.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Aucune session pour ce contrat</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {selectedContratData.sessions.map((session) => (
                  <div key={session.id} className="p-4 hover:bg-gray-50/50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSessionStatutColor(session.statut)}`}>
                            {session.statut.replace('_', ' ')}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(session.date_session).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {session.heure_debut?.slice(0, 5)} - {session.heure_fin?.slice(0, 5)}
                          </span>
                          <span>•</span>
                          <span>{session.duree_minutes} min</span>
                          {session.type_session && (
                            <>
                              <span>•</span>
                              <span className="capitalize">{session.type_session.replace('_', ' ')}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {session.notes_precepteur && (
                      <div className="mt-2 bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-blue-600 font-medium mb-1">Note du précepteur</p>
                        <p className="text-sm text-blue-900">{session.notes_precepteur}</p>
                      </div>
                    )}

                    {/* Grades */}
                    {session.grades && session.grades.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-gray-500 mb-2">Évaluations</p>
                        <div className="space-y-1.5">
                          {session.grades.map((grade) => {
                            const percentage = (grade.score / grade.max_score) * 100
                            return (
                              <div key={grade.id} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className="text-xs font-medium text-gray-700">{grade.title}</p>
                                    <p className="text-xs font-bold text-gray-900">
                                      {grade.score}/{grade.max_score} ({((grade.score / grade.max_score) * 20).toFixed(1)}/20)
                                    </p>
                                  </div>
                                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full ${
                                        percentage >= 80 ? 'bg-green-500' :
                                        percentage >= 60 ? 'bg-blue-500' :
                                        percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                      }`}
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                </div>
                                {grade.comment && (
                                  <p className="text-xs text-gray-500">{grade.comment}</p>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* Files */}
                    {session.files && session.files.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-gray-500 mb-2">
                          Fichiers ({session.files.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {session.files.map((file) => (
                            <button
                              key={file.id}
                              onClick={async () => {
                                const { data } = await supabase.storage
                                  .from('session-files')
                                  .download(file.file_path)
                                if (data) {
                                  const url = URL.createObjectURL(data)
                                  const a = document.createElement('a')
                                  a.href = url
                                  a.download = file.file_name
                                  a.click()
                                  URL.revokeObjectURL(url)
                                }
                              }}
                              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                              <FileText className="w-3 h-3" />
                              {file.file_name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Feedback */}
                    {session.feedback_precepteur && (
                      <div className="mt-2 bg-purple-50 p-3 rounded-lg">
                        <p className="text-xs text-purple-600 font-medium mb-1">Feedback du précepteur</p>
                        <p className="text-sm text-purple-900">{session.feedback_precepteur}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {contrats.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium mb-2">Aucun contrat</p>
          <p className="text-gray-400 text-sm">
            Cet enfant n'a pas encore de contrat avec un précepteur
          </p>
        </div>
      )}
    </div>
  )
}