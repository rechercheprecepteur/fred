// app/dashboard/precepteur/contrats/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import Loader from '@/components/Loader'
import CreateSessionModal from '../../CreateSessionModal'
import SessionDetailModal from '../../SessionDetailModal'
import { 
  ArrowLeft,
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  BookOpen, 
  FileText,
  Check,
  X,
  Plus,
  Eye,
  Play,
  StopCircle,
  Ban,
  CreditCard,
  Hash,
  Phone,
  Mail,
  Building,
  MessageSquare,
  Activity,
  Users,
  GraduationCap
} from 'lucide-react'

// Types
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
}

type Contract = {
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
  parent?: {
    id: number
    telephone: string | null
    adresse: string | null
    user: {
      id: string
      username: string
      email: string
      photo_profil: string | null
      telephone: string | null
    }
  } | null
  eleve?: {
    id: number
    nom: string
    postnom: string | null
    prenom: string
    genre: string
    date_naissance: string | null
    niveau: string
    ecole: string | null
  } | null
  matiere?: {
    id: number
    nom: string
    niveau: string
    description: string | null
  } | null
  sessions?: Session[] | null
}

export default function ContractDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, precepteurInfo } = useAuth()
  const contractId = params.id as string

  const [contract, setContract] = useState<Contract | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  // États pour les modals
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [showSessionModal, setShowSessionModal] = useState(false)
  const [showCreateSessionModal, setShowCreateSessionModal] = useState(false)

  useEffect(() => {
    if (contractId && precepteurInfo) {
      loadContract()
    }
  }, [contractId, precepteurInfo])

  const loadContract = async () => {
    setLoading(true)
    
    const { data, error } = await supabase
      .from('contracts')
      .select(`
        id, 
        parent_id, 
        precepteur_id, 
        eleve_id, 
        matiere_id,
        date_debut, 
        date_fin, 
        heure_debut_pref, 
        heure_fin_pref, 
        jours_pref,
        type_contrat,
        frequence,
        tarif_horaire,
        notes,
        statut, 
        created_at,
        parent:parents!inner(
          id,
          telephone,
          adresse,
          user:users!inner(
            id,
            username,
            email,
            photo_profil,
            telephone
          )
        ),
        eleve:eleves!inner(
          id,
          nom,
          postnom,
          prenom,
          genre,
          date_naissance,
          niveau,
          ecole
        ),
        matiere:matieres!inner(
          id,
          nom,
          niveau,
          description
        ),
        sessions:sessions_cours(
          id,
          contract_id,
          date_session,
          heure_debut,
          heure_fin,
          duree_minutes,
          statut,
          type_session,
          lieu,
          lien_visio,
          notes_precepteur,
          notes_parent,
          feedback_precepteur,
          feedback_parent,
          note_session,
          raison_annulation,
          annule_par,
          created_at
        )
      `)
      .eq('id', contractId)
      .eq('precepteur_id', precepteurInfo.id)
      .single()

    if (error) {
      console.error('Erreur chargement contrat:', error)
      setMessage('Contrat introuvable')
    } else {
      setContract(data as unknown as Contract)
    }
    
    setLoading(false)
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!contract) return
    
    setSaving(true)
    
    const { error } = await supabase
      .from('contracts')
      .update({ 
        statut: newStatus, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', contract.id)

    if (error) {
      console.error('Erreur mise à jour contrat:', error)
      setMessage('Erreur lors du changement de statut')
    } else {
      // Envoyer notification si accepté ou refusé
      if (newStatus === 'accepte' || newStatus === 'refuse') {
        await sendNotificationToParent(newStatus)
      }
      
      setMessage(`Contrat ${newStatus.replace('_', ' ')} avec succès`)
      await loadContract()
      setTimeout(() => setMessage(''), 3000)
    }
    
    setSaving(false)
  }
const sendNotificationToParent = async (newStatus: string) => {
  if (!contract?.parent?.user?.email) return

  try {
    const parentUser = contract.parent.user
    const parentEmail = parentUser.email
    const parentName = parentUser.username || 'Parent'
    const precepteurName = user?.username || 'Précepteur'
    const eleveName = contract.eleve ? `${contract.eleve.prenom} ${contract.eleve.nom}` : 'Élève'
    const matiereName = contract.matiere 
      ? `${contract.matiere.nom} ${contract.matiere.niveau ? `(${contract.matiere.niveau})` : ''}`
      : 'Matière'

    // Envoyer l'email
    const response = await fetch('/api/send-contract-status-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: parentEmail,
        parentName,
        precepteurName,
        eleveName,
        matiere: matiereName,
        dateDebut: contract.date_debut 
          ? new Date(contract.date_debut).toLocaleDateString('fr-FR') 
          : 'N/A',
        dateFin: contract.date_fin 
          ? new Date(contract.date_fin).toLocaleDateString('fr-FR') 
          : 'N/A',
        status: newStatus,
        isAccepted: newStatus === 'accepte',
        contractId: contract.id
      })
    })

    // Créer une notification dans la base de données
    // ✅ CORRECTION : utiliser parentUser.id au lieu de contract.parent.user_id
    if (parentUser.id) {
      const isAccepted = newStatus === 'accepte'
      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: parentUser.id, // ✅ C'est l'ID de l'utilisateur parent
          titre: isAccepted ? '✅ Contrat accepté !' : '❌ Contrat refusé',
          message: isAccepted 
            ? `${precepteurName} a accepté votre demande de contrat pour ${eleveName} en ${matiereName}`
            : `${precepteurName} a refusé votre demande de contrat pour ${eleveName} en ${matiereName}`,
          type: 'contrat',
          lien: `/dashboard/parent/contrats/${contract.id}`,
          lu: false
        })

      if (notifError) {
        console.warn('⚠️ Erreur lors de la création de la notification:', notifError.message)
      } else {
        console.log('✅ Notification créée pour le parent')
      }
    }
  } catch (error) {
    console.error('Erreur envoi notification:', error)
  }
}
  const handleSessionStatusChange = async (sessionId: number, newStatus: string) => {
    const { error } = await supabase
      .from('sessions_cours')
      .update({ statut: newStatus, updated_at: new Date().toISOString() })
      .eq('id', sessionId)

    if (!error) {
      setMessage(`Session ${newStatus.replace('_', ' ')} avec succès`)
      await loadContract()
      setTimeout(() => setMessage(''), 3000)
    } else {
      setMessage('Erreur lors du changement de statut de la session')
    }
  }

  const handleNotesUpdate = async (sessionId: number, notes: string) => {
    const { error } = await supabase
      .from('sessions_cours')
      .update({ notes_precepteur: notes, updated_at: new Date().toISOString() })
      .eq('id', sessionId)

    if (!error) {
      setMessage('Notes sauvegardées avec succès')
      await loadContract()
      setTimeout(() => setMessage(''), 3000)
    } else {
      setMessage('Erreur lors de la sauvegarde des notes')
    }
  }

  const openSessionDetail = (session: Session) => {
    setSelectedSession(session)
    setShowSessionModal(true)
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'accepte': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'actif': return 'bg-green-100 text-green-800 border-green-200'
      case 'refuse': return 'bg-red-100 text-red-800 border-red-200'
      case 'termine': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'annule': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
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
      case 'planifie':
      case 'en_attente': return <Calendar className="w-4 h-4" />
      case 'en_cours': return <Clock className="w-4 h-4" />
      case 'termine':
      case 'accepte':
      case 'actif': return <Check className="w-4 h-4" />
      case 'annule':
      case 'refuse': return <X className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getJoursLabels = (joursPref: string) => {
    const jours = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    return joursPref?.split(',').map(j => jours[parseInt(j) - 1]).join(', ') || 'Non spécifié'
  }

  const getFrequenceLabel = (frequence: string) => {
    switch (frequence) {
      case 'quotidien': return 'Quotidien'
      case 'hebdomadaire': return 'Hebdomadaire'
      case 'bihebdomadaire': return 'Bi-hebdomadaire'
      case 'mensuel': return 'Mensuel'
      case 'ponctuel': return 'Ponctuel'
      default: return frequence
    }
  }

  const getTypeContratLabel = (type: string) => {
    switch (type) {
      case 'recurrent': return 'Récurrent'
      case 'ponctuel': return 'Ponctuel'
      default: return type
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-20">
          <Loader />
        </div>
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Contrat introuvable</h2>
          <p className="text-gray-500 mb-6">Ce contrat n'existe pas ou vous n'y avez pas accès.</p>
          <button
            onClick={() => router.push('/dashboard/precepteur')}
            className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au tableau de bord
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Message de succès/erreur */}
      {message && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-700">{message}</p>
        </div>
      )}

      {/* En-tête avec retour */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push('/dashboard/precepteur')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Retour"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Contrat N° {contract.id}
          </h1>
          <p className="text-sm text-gray-500">
            Créé le {new Date(contract.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'long', year: 'numeric'
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne de gauche - Détails du contrat */}
        <div className="lg:col-span-2 space-y-6">
          {/* Statut et actions */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatutColor(contract.statut)}`}>
                {getStatutIcon(contract.statut)}
                Statut : {contract.statut.replace('_', ' ')}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Hash className="w-3 h-3" />
                Réf: {contract.id}
              </span>
            </div>

            {/* Actions selon le statut */}
            {contract.statut === 'en_attente' && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleStatusChange('accepte')}
                  disabled={saving}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50"
                >
                  <Check className="w-5 h-5" /> Accepter le contrat
                </button>
                <button
                  onClick={() => handleStatusChange('refuse')}
                  disabled={saving}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50"
                >
                  <X className="w-5 h-5" /> Refuser le contrat
                </button>
              </div>
            )}

            {(contract.statut === 'actif' || contract.statut === 'accepte') && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleStatusChange('termine')}
                  disabled={saving}
                  className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50"
                >
                  <StopCircle className="w-5 h-5" /> Terminer le contrat
                </button>
                <button
                  onClick={() => handleStatusChange('annule')}
                  disabled={saving}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50"
                >
                  <Ban className="w-5 h-5" /> Annuler le contrat
                </button>
              </div>
            )}
          </div>

          {/* Section Élève */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100/50">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                <User className="w-5 h-5" /> Informations de l'élève
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Nom complet</p>
                  <p className="font-medium text-gray-900">
                    {contract.eleve?.prenom} {contract.eleve?.nom} {contract.eleve?.postnom || ''}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Genre</p>
                  <p className="font-medium text-gray-900">
                    {contract.eleve?.genre === 'M' ? 'Garçon' : 'Fille'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" /> Niveau
                  </p>
                  <p className="font-medium text-gray-900">{contract.eleve?.niveau}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Date de naissance</p>
                  <p className="font-medium text-gray-900">
                    {contract.eleve?.date_naissance 
                      ? new Date(contract.eleve.date_naissance).toLocaleDateString('fr-FR')
                      : 'Non spécifiée'}
                  </p>
                </div>
                {contract.eleve?.ecole && (
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <Building className="w-3 h-3" /> École
                    </p>
                    <p className="font-medium text-gray-900">{contract.eleve.ecole}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section Matière */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-indigo-100/50">
              <h3 className="font-semibold text-indigo-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Matière enseignée
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Matière</p>
                  <p className="font-medium text-gray-900 text-lg">{contract.matiere?.nom}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Niveau</p>
                  <p className="font-medium text-gray-900">{contract.matiere?.niveau}</p>
                </div>
                {contract.matiere?.description && (
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Description</p>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                      {contract.matiere.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section Période et Horaires */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100/50">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Période et horaires
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Date de début</p>
                  <p className="font-medium text-gray-900">
                    {new Date(contract.date_debut).toLocaleDateString('fr-FR', {
                      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Date de fin</p>
                  <p className="font-medium text-gray-900">
                    {new Date(contract.date_fin).toLocaleDateString('fr-FR', {
                      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Horaires préférés
                  </p>
                  <p className="font-medium text-gray-900">
                    {contract.heure_debut_pref?.slice(0, 5)} - {contract.heure_fin_pref?.slice(0, 5)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Jours
                  </p>
                  <p className="font-medium text-gray-900">{getJoursLabels(contract.jours_pref)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Détails du contrat */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <FileText className="w-3 h-3" /> Type de contrat
              </p>
              <p className="font-semibold text-gray-900">{getTypeContratLabel(contract.type_contrat)}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <Activity className="w-3 h-3" /> Fréquence
              </p>
              <p className="font-semibold text-gray-900">{getFrequenceLabel(contract.frequence)}</p>
            </div>
            {contract.tarif_horaire && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <CreditCard className="w-3 h-3" /> Tarif horaire
                </p>
                <p className="font-semibold text-green-600 text-xl">
                  {contract.tarif_horaire.toLocaleString()} FC/h
                </p>
              </div>
            )}
          </div>

          {/* Notes du parent */}
          {contract.notes && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-amber-100/50">
                <h3 className="font-semibold text-amber-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" /> Notes du parent
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-700 whitespace-pre-wrap">{contract.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Colonne de droite - Parent et Sessions */}
        <div className="space-y-6">
          {/* Section Parent */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-purple-100/50">
              <h3 className="font-semibold text-purple-900 flex items-center gap-2">
                <Users className="w-5 h-5" /> Parent
              </h3>
            </div>
            <div className="p-6">
              {contract.parent?.user?.photo_profil && (
                <div className="flex justify-center mb-4">
                  <img 
                    src={contract.parent.user.photo_profil} 
                    alt={contract.parent.user.username || 'Parent'} 
                    className="w-20 h-20 rounded-full object-cover border-4 border-purple-100"
                  />
                </div>
              )}
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Nom d'utilisateur</p>
                  <p className="font-medium text-gray-900">
                    {contract.parent?.user?.username || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email
                  </p>
                  <p className="text-sm text-gray-700 break-all">
                    {contract.parent?.user?.email || 'N/A'}
                  </p>
                </div>
                {contract.parent?.user?.telephone && (
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Téléphone
                    </p>
                    <p className="font-medium text-gray-900">
                      {contract.parent.user.telephone}
                    </p>
                  </div>
                )}
                {contract.parent?.telephone && (
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Téléphone parent
                    </p>
                    <p className="font-medium text-gray-900">
                      {contract.parent.telephone}
                    </p>
                  </div>
                )}
                {contract.parent?.adresse && (
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Adresse
                    </p>
                    <p className="text-sm text-gray-700">{contract.parent.adresse}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section Sessions */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-teal-100/50 flex items-center justify-between">
              <h3 className="font-semibold text-teal-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Sessions
                {contract.sessions && contract.sessions.length > 0 && (
                  <span className="text-sm font-normal text-teal-600">
                    ({contract.sessions.length})
                  </span>
                )}
              </h3>
              {(contract.statut === 'actif' || contract.statut === 'accepte') && (
                <button
                  onClick={() => setShowCreateSessionModal(true)}
                  className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  title="Planifier une session"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="p-4">
              {!contract.sessions || contract.sessions.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 mb-4">Aucune session planifiée</p>
                  {(contract.statut === 'actif' || contract.statut === 'accepte') && (
                    <button
                      onClick={() => setShowCreateSessionModal(true)}
                      className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Planifier une session
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {contract.sessions
                    .sort((a, b) => new Date(a.date_session).getTime() - new Date(b.date_session).getTime())
                    .map((session) => (
                      <div
                        key={session.id}
                        className="p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all cursor-pointer group"
                        onClick={() => openSessionDetail(session)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getSessionStatutColor(session.statut)}`}>
                            {getStatutIcon(session.statut)}
                            {session.statut.replace('_', ' ')}
                          </span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {session.statut === 'planifie' && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleSessionStatusChange(session.id, 'en_cours')
                                  }}
                                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                  title="Démarrer"
                                >
                                  <Play className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleSessionStatusChange(session.id, 'annule')
                                  }}
                                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                  title="Annuler"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </>
                            )}
                            {session.statut === 'en_cours' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSessionStatusChange(session.id, 'termine')
                                }}
                                className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                                title="Terminer"
                              >
                                <StopCircle className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(session.date_session).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                          })}
                        </p>
                        
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {session.heure_debut?.slice(0, 5)} - {session.heure_fin?.slice(0, 5)}
                          </span>
                          <span>•</span>
                          <span>{session.duree_minutes} min</span>
                          <span>•</span>
                          <span className="capitalize">{session.type_session?.replace('_', ' ')}</span>
                        </div>
                        
                        {session.lieu && (
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {session.lieu}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de création de session */}
      <CreateSessionModal
        contract={contract}
        isOpen={showCreateSessionModal}
        onClose={() => setShowCreateSessionModal(false)}
        onSuccess={() => {
          loadContract()
          setMessage('Session planifiée avec succès !')
          setTimeout(() => setMessage(''), 3000)
        }}
      />

      {/* Modal de détail session */}
      <SessionDetailModal
        session={selectedSession}
        isOpen={showSessionModal}
        onClose={() => setShowSessionModal(false)}
        onStatusChange={handleSessionStatusChange}
        onNotesUpdate={handleNotesUpdate}
      />
    </div>
  )
}