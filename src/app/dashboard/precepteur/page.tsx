
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
import { updatePrecepteurProfil } from '@/actions/precepteur'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { 
  User, 
  MapPin, 
  Star, 
  Clock, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  Edit3, 
  Check, 
  X,
  Upload,
  Plus,
  Trash2,
  Eye,
  AlertCircle,
  ChevronDown,
  Filter,
  Play,
  StopCircle,
  Ban,
  RotateCcw,
  FileText,
  Users,
  Tag,
  Phone,
  Mail,
  Building,
  CreditCard,
  Hash,
  MessageSquare,
  Activity,
  RefreshCw
} from 'lucide-react'
import { PiBookOpen, PiPlus, PiTrash } from 'react-icons/pi'
import Loader from '@/components/Loader'
import { CheckBadgeIcon } from '@heroicons/react/24/solid'

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

type Matiere = {
  id: number
  nom: string
  niveau: string
}
// app/dashboard/precepteur/page.tsx
// Ajoutez cette interface en haut du fichier, après les autres types

// ✅ AJOUTER cette interface
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
function ContractDetailModal({ 
  contract, 
  isOpen, 
  onClose, 
  onStatusChange 
}: {
  contract: Contract | null
  isOpen: boolean
  onClose: () => void
  onStatusChange: (contractId: number, newStatus: string) => Promise<void>
}) {
  const [saving, setSaving] = useState(false)

  if (!isOpen || !contract) return null

  const handleStatusChange = async (newStatus: string) => {
    setSaving(true)
    await onStatusChange(contract.id, newStatus)
    setSaving(false)
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-2xl">
          <h2 className="text-xl font-semibold">Détails du contrat</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Statut + Référence */}
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatutColor(contract.statut)}`}>
              Statut : {contract.statut.replace('_', ' ')}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Hash className="w-3 h-3" />
              Contrat N° {contract.id}
            </span>
          </div>

          {/* Section Élève */}
          <div className="bg-blue-50 p-4 rounded-xl">
            <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" /> Élève
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-blue-600 mb-0.5">Nom complet</p>
                <p className="font-medium text-sm">
                  {contract.eleve?.prenom} {contract.eleve?.nom} {contract.eleve?.postnom || ''}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-600 mb-0.5">Genre</p>
                <p className="font-medium text-sm">{contract.eleve?.genre === 'M' ? 'Garçon' : 'Fille'}</p>
              </div>
              <div>
                <p className="text-xs text-blue-600 mb-0.5">Niveau</p>
                <p className="font-medium text-sm">{contract.eleve?.niveau}</p>
              </div>
              <div>
                <p className="text-xs text-blue-600 mb-0.5">Date de naissance</p>
                <p className="font-medium text-sm">
                  {contract.eleve?.date_naissance 
                    ? new Date(contract.eleve.date_naissance).toLocaleDateString('fr-FR')
                    : 'Non spécifiée'}
                </p>
              </div>
              {contract.eleve?.ecole && (
                <div className="col-span-2">
                  <p className="text-xs text-blue-600 mb-0.5">École</p>
                  <p className="font-medium text-sm flex items-center gap-1">
                    <Building className="w-3 h-3" /> {contract.eleve.ecole}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section Parent */}
          <div className="bg-purple-50 p-4 rounded-xl">
            <h3 className="text-sm font-semibold text-purple-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" /> Parent
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-purple-600 mb-0.5">Nom d'utilisateur</p>
                <p className="font-medium text-sm">{contract.parent?.user?.username || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-purple-600 mb-0.5">Email</p>
                <p className="font-medium text-sm flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {contract.parent?.user?.email || 'N/A'}
                </p>
              </div>
              {contract.parent?.user?.telephone && (
                <div>
                  <p className="text-xs text-purple-600 mb-0.5">Téléphone utilisateur</p>
                  <p className="font-medium text-sm flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {contract.parent.user.telephone}
                  </p>
                </div>
              )}
              {contract.parent?.telephone && (
                <div>
                  <p className="text-xs text-purple-600 mb-0.5">Téléphone parent</p>
                  <p className="font-medium text-sm flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {contract.parent.telephone}
                  </p>
                </div>
              )}
              {contract.parent?.adresse && (
                <div className="col-span-2">
                  <p className="text-xs text-purple-600 mb-0.5">Adresse</p>
                  <p className="font-medium text-sm flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {contract.parent.adresse}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section Matière */}
          <div className="bg-indigo-50 p-4 rounded-xl">
            <h3 className="text-sm font-semibold text-indigo-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Matière
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-indigo-600 mb-0.5">Nom</p>
                <p className="font-medium text-sm">{contract.matiere?.nom}</p>
              </div>
              <div>
                <p className="text-xs text-indigo-600 mb-0.5">Niveau</p>
                <p className="font-medium text-sm">{contract.matiere?.niveau}</p>
              </div>
              {contract.matiere?.description && (
                <div className="col-span-2">
                  <p className="text-xs text-indigo-600 mb-0.5">Description</p>
                  <p className="text-sm text-gray-700">{contract.matiere.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Section Période et Horaires */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Période et horaires
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Date début</p>
                <p className="font-medium text-sm">
                  {new Date(contract.date_debut).toLocaleDateString('fr-FR', {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Date fin</p>
                <p className="font-medium text-sm">
                  {new Date(contract.date_fin).toLocaleDateString('fr-FR', {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Horaires préférés</p>
                <p className="font-medium text-sm">
                  {contract.heure_debut_pref?.slice(0, 5)} - {contract.heure_fin_pref?.slice(0, 5)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Jours</p>
                <p className="font-medium text-sm">{getJoursLabels(contract.jours_pref)}</p>
              </div>
            </div>
          </div>

          {/* Section Détails du contrat */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Type de contrat
              </h3>
              <p className="font-medium text-sm">{getTypeContratLabel(contract.type_contrat)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Fréquence
              </h3>
              <p className="font-medium text-sm">{getFrequenceLabel(contract.frequence)}</p>
            </div>
          </div>

          {/* Section Tarif */}
          {contract.tarif_horaire && (
            <div className="bg-green-50 p-4 rounded-xl">
              <h3 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Tarif horaire
              </h3>
              <p className="text-xl font-bold text-green-900">
                {contract.tarif_horaire.toLocaleString()} FC/h
              </p>
            </div>
          )}

          {/* Section Notes */}
          {contract.notes && (
            <div className="bg-amber-50 p-4 rounded-xl">
              <h3 className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Notes du parent
              </h3>
              <p className="text-sm text-gray-700">{contract.notes}</p>
            </div>
          )}

          {/* Date de création */}
          <div className="text-xs text-gray-400 text-center">
            Contrat créé le {new Date(contract.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </div>

          {/* Actions */}
          {contract.statut === 'en_attente' && (
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleStatusChange('accepte')}
                disabled={saving}
                className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Check className="w-5 h-5" /> Accepter le contrat
              </button>
              <button
                onClick={() => handleStatusChange('refuse')}
                disabled={saving}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <X className="w-5 h-5" /> Refuser le contrat
              </button>
            </div>
          )}

          {/* Actions pour contrat actif */}
          {(contract.statut === 'actif' || contract.statut === 'accepte') && (
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleStatusChange('termine')}
                disabled={saving}
                className="flex-1 px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <StopCircle className="w-5 h-5" /> Terminer le contrat
              </button>
              <button
                onClick={() => handleStatusChange('annule')}
                disabled={saving}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Ban className="w-5 h-5" /> Annuler le contrat
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PrecepteurDashboard() {
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [contrats, setContrats] = useState<Contract[]>([])
  const [matieres, setMatieres] = useState<Matiere[]>([])
  const [selectedMatieres, setSelectedMatieres] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState('profil')
  const [showModal, setShowModal] = useState(false)
  const [refreshDocs, setRefreshDocs] = useState(0)
  const router = useRouter()
  const [creatingSession, setCreatingSession] = useState(false)
  
  // États pour les modals
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [showSessionModal, setShowSessionModal] = useState(false)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [showContractModal, setShowContractModal] = useState(false)
  const [selectedContractForSession, setSelectedContractForSession] = useState<Contract | null>(null)
  const [showCreateSessionModal, setShowCreateSessionModal] = useState(false)

  // ✅ Utiliser le nouveau contexte - refreshUser n'existe plus, on utilise refreshPrecepteurInfo
  const { user, precepteurInfo, refreshPrecepteurInfo, updateUser } = useAuth()
  
  // Formulaire
  const [form, setForm] = useState({
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

  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      if (!precepteurInfo ) {
        await refreshPrecepteurInfo();
      }

      if (!isMounted) return;

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
        });
        setDisponible(precepteurInfo.disponible ?? true);
        
        await Promise.all([loadContrats(), loadMatieres()]);
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    initializeData();

    return () => {
      isMounted = false;
    };
  }, [user?.id, precepteurInfo?.id]);

 // Dans app/dashboard/precepteur/page.tsx

// ✅ CORRECTION 1: La fonction handleSave du dashboard
const handleSave = async (data: ProfilForm & { matieres: number[] }) => {
  setSaving(true)
  setMessage('')
  
  try {
    console.log('📤 Données envoyées:', data) // Pour déboguer
    
    const result = await updatePrecepteurProfil({
      latitude: data.latitude,
      longitude: data.longitude,
      commune: data.commune,
      quartier: data.quartier,
      annees_experience: data.annees_experience,
      diplome: data.diplome,
      etablissement_origine: data.etablissement_origine,
      telephone: data.telephone, // ✅ S'assurer que telephone est bien envoyé
      matieres: data.matieres
    })
    
    console.log('📥 Réponse:', result) // Pour déboguer
    
    if (!result.error) {
      setShowModal(false)
      setMessage('Profil mis à jour avec succès')
      await refreshPrecepteurInfo() // ✅ Rafraîchir les infos
    } else {
      setMessage(result.error)
    }
  } catch (error) {
    console.error('❌ Erreur sauvegarde:', error)
    setMessage('Erreur lors de la mise à jour du profil')
  }
  
  setSaving(false)
  setTimeout(() => setMessage(''), 3000)
}
  // ✅ handlePhotoUpload - Remplacer refreshUser par updateUser
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploading(true)
    const reader = new FileReader()
    reader.onloadend = async () => {
      const result = await updateProfilePhoto(reader.result as string)
      if (result.success) {
        // ✅ Mettre à jour l'utilisateur dans le contexte
        updateUser({ photo_profil: reader.result as string })
        setMessage('Photo mise à jour avec succès')
      } else {
        setMessage(result.error || 'Erreur lors de la mise à jour')
      }
      setUploading(false)
      setTimeout(() => setMessage(''), 3000)
    }
    reader.readAsDataURL(file)
  }

  // ✅ toggleDisponible - utilise refreshPrecepteurInfo
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

  const loadContrats = async () => {
    if (!precepteurInfo) { setLoading(false); return }

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
      .eq('precepteur_id', precepteurInfo.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Erreur chargement contrats:', error)
    } else {
      setContrats((data || []) as unknown as Contract[])
    }
    setLoading(false)
  }

  const loadMatieres = async () => {
    const { data } = await supabase
      .from('matieres')
      .select('id, nom, niveau')
      .order('nom')

    setMatieres(data || [])

    if (precepteurInfo) {
      const { data: precepteurMatieres } = await supabase
        .from('precepteur_matieres')
        .select('matiere_id')
        .eq('precepteur_id', precepteurInfo.id)

      if (precepteurMatieres) {
        setSelectedMatieres(precepteurMatieres.map(pm => pm.matiere_id))
      }
    }
  }

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

  const handleContractStatusChange = async (contractId: number, newStatus: string) => {
    console.log('📝 Changement statut contrat:', { contractId, newStatus })
    
    const { error } = await supabase
      .from('contracts')
      .update({ 
        statut: newStatus, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', contractId)

    if (error) {
      console.error('❌ Erreur mise à jour contrat:', error)
      setMessage('Erreur lors du changement de statut du contrat')
      return
    }

    console.log('✅ Contrat mis à jour:', newStatus)

    if (newStatus === 'accepte' || newStatus === 'refuse') {
      console.log('📧 Envoi notification au parent...')
      
      try {
        const { data: contract, error: contractError } = await supabase
          .from('contracts')
          .select(`
            id,
            parent_id,
            precepteur_id,
            eleve_id,
            matiere_id,
            date_debut,
            date_fin
          `)
          .eq('id', contractId)
          .single()

        if (contractError || !contract) {
          console.error('❌ Erreur récupération contrat:', contractError)
          return
        }

        const [
          { data: parentData },
          { data: precepteurData },
          { data: eleveData },
          { data: matiereData }
        ] = await Promise.all([
          supabase
            .from('parents')
            .select(`
              user_id,
              user:users!parents_user_id_fkey(
                id,
                username,
                email
              )
            `)
            .eq('id', contract.parent_id)
            .single(),
          
          supabase
            .from('precepteurs')
            .select(`
              user:users!precepteurs_user_id_fkey(
                username
              )
            `)
            .eq('id', contract.precepteur_id)
            .single(),
          
          supabase
            .from('eleves')
            .select('prenom, nom')
            .eq('id', contract.eleve_id)
            .single(),
          
          supabase
            .from('matieres')
            .select('nom, niveau')
            .eq('id', contract.matiere_id)
            .single()
        ])

        const parentUser = Array.isArray(parentData?.user) 
          ? parentData?.user[0] 
          : parentData?.user
        
        const precepteurUser = Array.isArray(precepteurData?.user) 
          ? precepteurData?.user[0] 
          : precepteurData?.user

        const parentEmail = parentUser?.email
        const parentName = parentUser?.username || 'Parent'
        const precepteurName = precepteurUser?.username || 'Précepteur'
        const eleveName = eleveData ? `${eleveData.prenom} ${eleveData.nom}` : 'Élève'
        const matiereName = matiereData 
          ? `${matiereData.nom} ${matiereData.niveau ? `(${matiereData.niveau})` : ''}`
          : 'Matière'

        if (parentEmail) {
          const isAccepted = newStatus === 'accepte'
          
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
              isAccepted,
              contractId: contract.id
            })
          })

          const result = await response.json()
          if (result.success) {
            console.log('✅ Email envoyé au parent:', parentEmail)
          } else {
            console.error('❌ Erreur envoi email:', result.error)
          }
        }

        if (parentData?.user_id) {
          try {
            const isAccepted = newStatus === 'accepte'
            const { error: notifError } = await supabase
              .from('notifications')
              .insert({
                user_id: parentData.user_id,
                titre: isAccepted ? '✅ Contrat accepté !' : '❌ Contrat refusé',
                message: isAccepted 
                  ? `${precepteurName} a accepté votre demande de contrat pour ${eleveName} en ${matiereName}`
                  : `${precepteurName} a refusé votre demande de contrat pour ${eleveName} en ${matiereName}`,
                type: 'contrat',
                lien: `/dashboard/parent/contrats/${contractId}`,
                lu: false
              })

            if (notifError) {
              console.warn('⚠️ Erreur notification:', notifError.message)
            } else {
              console.log('✅ Notification créée pour le parent')
            }
          } catch (notifCatchError: any) {
            console.warn('⚠️ Table notifications peut ne pas exister:', notifCatchError?.message)
          }
        }

      } catch (emailError: any) {
        console.error('❌ Erreur lors de l\'envoi:', emailError?.message || emailError)
      }
    }

    await loadContrats()
    setMessage(`Contrat ${newStatus.replace('_', ' ')} avec succès`)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleSessionStatusChange = async (sessionId: number, newStatus: string) => {
    const { error } = await supabase
      .from('sessions_cours')
      .update({ statut: newStatus, updated_at: new Date().toISOString() })
      .eq('id', sessionId)

    if (!error) {
      setMessage(`Session ${newStatus.replace('_', ' ')} avec succès`)
      await loadContrats()
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
      await loadContrats()
      setTimeout(() => setMessage(''), 3000)
    } else {
      setMessage('Erreur lors de la sauvegarde des notes')
    }
  }

  const openSessionDetail = (session: Session) => {
    setSelectedSession(session)
    setShowSessionModal(true)
  }

  const openContractDetail = (contract: Contract) => {
    router.push(`/dashboard/precepteur/contrats/${contract.id}`)
  }

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
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const totalContrats = contrats.length
  const contratsActifs = contrats.filter(c => c.statut === 'actif' || c.statut === 'accepte').length
  const contratsEnAttente = contrats.filter(c => c.statut === 'en_attente').length
  const totalSessions = contrats.reduce((acc, c) => acc + (c.sessions?.length || 0), 0)
  const sessionsPlanifiees = contrats.reduce((acc, c) => acc + (c.sessions?.filter(s => s.statut === 'planifie').length || 0), 0)
  const sessionsEnCours = contrats.reduce((acc, c) => acc + (c.sessions?.filter(s => s.statut === 'en_cours').length || 0), 0)

  const elevesUniques = [...new Set(contrats.map(c => `${c.eleve?.prenom} ${c.eleve?.nom}`))]

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='w-20'>
          <Loader/> 
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Message */}
      {precepteurInfo && (
        !precepteurInfo.commune || 
        !precepteurInfo.quartier || 
        !precepteurInfo.diplome || 
        !precepteurInfo.etablissement_origine || 
        precepteurInfo.annees_experience === 0 || 
        precepteurInfo.statut_verification === 'en_attente' || 
        precepteurInfo.statut_verification === 'rejete'
      ) && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-800 mb-1">
              {precepteurInfo.statut_verification === 'rejete' 
                ? 'Votre dossier a été rejeté' 
                : precepteurInfo.statut_verification === 'en_attente'
                ? 'Votre dossier est en attente de vérification '
                : 'Profil incomplet'}
            </h3>
            <p className="text-sm text-red-700">
              {precepteurInfo.statut_verification === 'rejete' 
                ? 'Votre dossier a été rejeté par notre administration. Veuillez mettre à jour vos informations et soumettre à nouveau votre dossier.'
                : 'Veuillez cliquer sur "Modifier le profil" pour compléter vos informations. Une fois votre profil mis à jour, notre administration vérifiera votre dossier dans un délai de 24 heures. Pensez à revenir vérifier si votre dossier a été accepté ou rejeté.'}
            </p>
            <button
              onClick={openModal}
              className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Modifier le profil
            </button>
          </div>
        </div>
      )}

      {/* En-tête profil */}
      <div className="bg-white rounded-2xl mb-6 p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
          <div className="relative group w-24 h-24 flex-shrink-0">
            {user.photo_profil ? (
              <img src={user.photo_profil} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-10 h-10 text-gray-400" />
              </div>
            )}
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <Upload className="w-5 h-5 text-white" />
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              {user.username}
              {precepteurInfo?.statut_verification === 'verifie' && (
                <span className="text-sm font-normal text-blue-700 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  - <CheckBadgeIcon className="w-5 h-5" /> Vérifié
                </span>
              )}
            </h1>
            <p className="text-gray-600 flex items-center gap-2 mt-1">
              <GraduationCap className="w-4 h-4" />
              Précepteur
              {selectedMatieres.length > 0 && (
                <span className="text-sm text-gray-500">
                  • {selectedMatieres.length} matière{selectedMatieres.length > 1 ? 's' : ''}
                </span>
              )}
            </p>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              {precepteurInfo?.commune ? (
                <span>{precepteurInfo.commune}{precepteurInfo.quartier ? `, ${precepteurInfo.quartier}` : ''}</span>
              ) : (
                <span>Localisation non spécifiée</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">{precepteurInfo?.note_moyenne?.toFixed(1) || '0.0'}/5</span>
              <span className="text-xs text-gray-400">(0 évaluations)</span>
              {precepteurInfo?.statut_verification === 'en_attente' && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" /> En attente
                </span>
              )}
              {precepteurInfo?.statut_verification === 'rejete' && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <X className="w-3 h-3" /> Rejeté
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleDisponible}
              className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                disponible
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {disponible ? (
                <>
                  <Check className="w-4 h-4" /> Disponible
                </>
              ) : (
                <>
                  <X className="w-4 h-4" /> Indisponible
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl">
            <p className="text-2xl font-bold text-blue-600">{elevesUniques.length}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <User className="w-3 h-3" /> Élèves suivis
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl">
            <p className="text-2xl font-bold text-green-600">{totalContrats}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <FileText className="w-3 h-3" /> Contrats
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl">
            <p className="text-2xl font-bold text-purple-600">{contratsActifs}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Check className="w-3 h-3" /> Contrats actifs
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-xl">
            <p className="text-2xl font-bold text-orange-600">{totalSessions}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> Sessions
            </p>
          </div>
          <div className="p-4 bg-teal-50 rounded-xl">
            <p className="text-2xl font-bold text-teal-600">{sessionsPlanifiees}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Sessions à venir
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-xl">
            <p className="text-2xl font-bold text-yellow-600">{sessionsEnCours}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Clock className="w-3 h-3" /> En cours
            </p>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('profil')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'profil' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <User className="w-4 h-4" /> Profil
        </button>
        <button
          onClick={() => setActiveTab('matieres')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'matieres' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Matières ({selectedMatieres.length})
        </button>
        <button
          onClick={() => setActiveTab('contrats')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'contrats' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <FileText className="w-4 h-4" /> Contrats ({contrats.length})
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'documents' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <FileText className="w-4 h-4" /> Documents
        </button>

      <button
  onClick={() => setActiveTab('services')}
  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
    activeTab === 'services' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
  }`}
>
  <BookOpen className="w-4 h-4" /> Mes Services
</button>

 
      </div>

      {/* Profil */}
      {activeTab === 'profil' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-700" />
                Informations du précepteur
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">Profil professionnel</p>
            </div>
            <button
              onClick={openModal}
              className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium"
            >
              <Edit3 className="w-4 h-4" />
              Modifier le profil
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Commune
                </p>
                <p className="font-medium text-gray-900">{precepteurInfo?.commune || 'Non spécifié'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Téléphone
                </p>
                <p className="font-medium text-gray-900">
                  {precepteurInfo?.telephone || 'Non spécifié'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Quartier
                </p>
                <p className="font-medium text-gray-900">{precepteurInfo?.quartier || 'Non spécifié'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Années d'expérience
                </p>
                <p className="font-medium text-gray-900">{precepteurInfo?.annees_experience || 0} an(s)</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" /> Diplôme
                </p>
                <p className="font-medium text-gray-900">{precepteurInfo?.diplome || 'Non spécifié'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" /> Établissement d'origine
                </p>
                <p className="font-medium text-gray-900">{precepteurInfo?.etablissement_origine || 'Non spécifié'}</p>
              </div>
              {precepteurInfo?.latitude && precepteurInfo?.longitude && (
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Coordonnées GPS
                  </p>
                  <p className="font-medium text-sm text-gray-900">
                    {precepteurInfo.latitude}, {precepteurInfo.longitude}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Matières */}
      {activeTab === 'matieres' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <PiBookOpen className="w-5 h-5 text-gray-700" />
                Mes matières
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">{selectedMatieres.length} matière{selectedMatieres.length > 1 ? 's' : ''}</p>
            </div>
            <button
              onClick={openModal}
              className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium"
            >
              <PiPlus className="w-4 h-4" />
              Gérer les matières
            </button>
          </div>

          {selectedMatieres.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <PiBookOpen className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium mb-1">Aucune matière sélectionnée</p>
              <p className="text-gray-400 text-sm mb-6">Ajoutez les matières que vous enseignez</p>
              <button
                onClick={openModal}
                className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium text-sm"
              >
                <PiPlus className="w-4 h-4" />
                Ajouter des matières
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {selectedMatieres.map(matiereId => {
                const matiere = matieres.find(m => m.id === matiereId)
                if (!matiere) return null
                
                return (
                  <div 
                    key={matiereId} 
                    className="p-4 hover:bg-gray-50/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                          <PiBookOpen className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{matiere.nom}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          {matiere.niveau && (
                            <>
                              <span>🎯 {matiere.niveau}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleMatiereToggle(matiere.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Retirer la matière"
                        >
                          <PiTrash className="w-5 h-5" />
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

      

      {/* Contrats */}
      {activeTab === 'contrats' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-700" />
                Mes contrats
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">{contrats.length} contrat{contrats.length > 1 ? 's' : ''}</p>
            </div>
            
            <button
              onClick={async () => {
                const contratActif = contrats.find(c => c.statut === 'actif' || c.statut === 'accepte')
                if (contratActif) {
                  setSelectedContractForSession(contratActif)
                  setShowCreateSessionModal(true)
                }
              }}
              disabled={!contrats.some(c => c.statut === 'actif' || c.statut === 'accepte') || creatingSession}
              className={`px-4 py-2 text-sm rounded-xl transition-colors flex items-center gap-2 font-medium ${
                contrats.some(c => c.statut === 'actif' || c.statut === 'accepte') && !creatingSession
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {creatingSession ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Planifier une session
                </>
              )}
            </button>
          </div>

          {contrats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <FileText className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium mb-1">Aucun contrat</p>
              <p className="text-gray-400 text-sm">Les contrats apparaîtront ici une fois que des parents vous contacteront.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {contrats.map((contrat) => (
                <div key={contrat.id}>
                  <div 
                    className="p-4 hover:bg-gray-50/50 transition-colors group flex items-center gap-4 cursor-pointer"
                    onClick={() => openContractDetail(contrat)}
                  >
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        contrat.statut === 'actif' ? 'bg-green-100' : 
                        contrat.statut === 'accepte' ? 'bg-blue-100' :
                        contrat.statut === 'en_attente' ? 'bg-yellow-100' : 
                        contrat.statut === 'refuse' || contrat.statut === 'annule' ? 'bg-red-100' :
                        'bg-gray-100'
                      }`}>
                        <FileText className={`w-5 h-5 ${
                          contrat.statut === 'actif' ? 'text-green-600' : 
                          contrat.statut === 'accepte' ? 'text-blue-600' :
                          contrat.statut === 'en_attente' ? 'text-yellow-600' : 
                          contrat.statut === 'refuse' || contrat.statut === 'annule' ? 'text-red-600' :
                          'text-gray-600'
                        }`} />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 truncate">
                          {contrat.matiere?.nom || 'Matière'}
                        </p>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getContratStatutColor(contrat.statut)}`}>
                          {getStatutIcon(contrat.statut)}
                          {contrat.statut.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {contrat.eleve?.prenom} {contrat.eleve?.nom}
                        </span>
                        <span>•</span>
                        <span>{contrat.eleve?.niveau}</span>
                        <span>•</span>
                        <span className="capitalize">{contrat.type_contrat}</span>
                        {contrat.tarif_horaire && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 font-medium">{contrat.tarif_horaire.toLocaleString()} FC/h</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 hidden sm:block">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(contrat.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        {' - '}
                        {new Date(contrat.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 capitalize">{contrat.frequence}</p>
                    </div>

                    {contrat.sessions && contrat.sessions.length > 0 && (
                      <div className="flex-shrink-0 hidden md:block">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                          <BookOpen className="w-3 h-3" />
                          {contrat.sessions.length} session{contrat.sessions.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      {(contrat.statut === 'actif' || contrat.statut === 'accepte') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedContractForSession(contrat)
                            setShowCreateSessionModal(true)
                          }}
                          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                          title="Planifier une session"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      )}
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          openContractDetail(contrat)
                        }}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Voir les détails"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      
                      {contrat.statut === 'en_attente' && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleContractStatusChange(contrat.id, 'accepte')
                            }}
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                            title="Accepter"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleContractStatusChange(contrat.id, 'refuse')
                            }}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Refuser"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Sessions du contrat */}
                  {contrat.sessions && contrat.sessions.length > 0 && (
                    <div className="bg-gray-50/30 border-t border-gray-100">
                      <div className="px-6 py-2 flex items-center justify-between">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sessions ({contrat.sessions.length})
                        </p>
                        {(contrat.statut === 'actif' || contrat.statut === 'accepte') && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedContractForSession(contrat)
                              setShowCreateSessionModal(true)
                            }}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            Ajouter une session
                          </button>
                        )}
                      </div>
                      <div className="divide-y divide-gray-100">
                        {contrat.sessions.map((session) => (
                          <div
                            key={session.id}
                            className="px-6 py-2.5 hover:bg-gray-50/50 transition-colors group/session flex items-center justify-between cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              openSessionDetail(session)
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getSessionStatutColor(session.statut)}`}>
                                {getStatutIcon(session.statut)}
                                {session.statut.replace('_', ' ')}
                              </span>
                              <span className="text-sm text-gray-700">
                                {new Date(session.date_session).toLocaleDateString('fr-FR', { 
                                  weekday: 'short', 
                                  day: 'numeric', 
                                  month: 'short' 
                                })}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {session.heure_debut?.slice(0, 5)} - {session.heure_fin?.slice(0, 5)}
                                </span>
                                <span>•</span>
                                <span>{session.duree_minutes} min</span>
                                <span>•</span>
                                <span className="capitalize">{session.type_session?.replace('_', ' ')}</span>
                                {session.lieu && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {session.lieu}
                                    </span>
                                  </>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-1 opacity-0 group-hover/session:opacity-100 transition-opacity">
                                {session.statut === 'planifie' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleSessionStatusChange(session.id, 'en_cours')
                                    }}
                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                    title="Démarrer la session"
                                  >
                                    <Play className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {session.statut === 'en_cours' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleSessionStatusChange(session.id, 'termine')
                                    }}
                                    className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                    title="Terminer la session"
                                  >
                                    <StopCircle className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {session.statut === 'planifie' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleSessionStatusChange(session.id, 'annule')
                                    }}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    title="Annuler la session"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openSessionDetail(session)
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                  title="Voir les détails"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {(!contrat.sessions || contrat.sessions.length === 0) && (contrat.statut === 'actif' || contrat.statut === 'accepte') && (
                    <div className="bg-gray-50/30 border-t border-gray-100 px-6 py-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Aucune session planifiée pour ce contrat
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedContractForSession(contrat)
                            setShowCreateSessionModal(true)
                          }}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Planifier une session
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Documents */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-2xl p-6">
          <ListeDocuments 
            refresh={refreshDocs} 
            onRefresh={() => setRefreshDocs(prev => prev + 1)} 
          />
        </div>
      )}

{activeTab === 'services' && (
  <div className="bg-white rounded-2xl p-6">
    {/* ✅ Vérifiez que precepteurInfo existe et a un id */}
    {precepteurInfo?.id ? (
      <ServiceManager precepteurId={precepteurInfo.id} isOwner={true} />
    ) : (
      <div className="text-center py-8">
        <p className="text-gray-500">Chargement du profil précepteur...</p>
      </div>
    )}
  </div>
)}
      {/* Modal de modification du profil */}
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

      {/* Modal de détail contrat */}
      <ContractDetailModal
        contract={selectedContract}
        isOpen={showContractModal}
        onClose={() => setShowContractModal(false)}
        onStatusChange={handleContractStatusChange}
      />

      {/* Modal de création de session */}
      <CreateSessionModal
        contract={selectedContractForSession}
        isOpen={showCreateSessionModal}
        onClose={() => {
          setShowCreateSessionModal(false)
          setSelectedContractForSession(null)
          setCreatingSession(false)
        }}
        onSuccess={() => {
          loadContrats()
          setMessage('Session planifiée avec succès !')
          setTimeout(() => setMessage(''), 3000)
          setCreatingSession(false)
        }}
        onCreating={() => setCreatingSession(true)}
        onError={() => setCreatingSession(false)}
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