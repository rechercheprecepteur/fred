
// app/solicitation/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { getAllParentServices } from '@/actions/parent-service'
import { useAuth } from '@/context/AuthContext'
import { 
  Search, Eye, Clock, Check, X, AlertCircle, Users, 
  Briefcase, Calendar, BookOpen, MapPin, DollarSign,
  Filter, ChevronDown, ChevronUp, User, Loader2,
  ChevronRight, Send
} from 'lucide-react'
import Loader from '@/components/Loader'

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
    id: string
    nom: string
    prenom: string
    postnom: string | null
    niveau: string
    ecole: string | null
    genre: string
  } | null
}

type Filters = {
  statut: string
  niveau: string
  matiere: string
  lieu: string
  search: string
}

type CandidatureForm = {
  message: string
  tarif_propose: number | null
  disponibilites: string
}

export default function AdminServicesPage() {
  const { user } = useAuth()
  const [services, setServices] = useState<ServiceParent[]>([])
  const [filteredServices, setFilteredServices] = useState<ServiceParent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedService, setSelectedService] = useState<ServiceParent | null>(null)
  
  // États pour le modal de candidature
  const [showCandidatureModal, setShowCandidatureModal] = useState(false)
  const [serviceToApply, setServiceToApply] = useState<ServiceParent | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [candidatureError, setCandidatureError] = useState('')
  
  // 🆕 IDs des services où on a déjà postulé
  const [appliedServices, setAppliedServices] = useState<string[]>([])
  
  // Formulaire de candidature
  const [candidatureForm, setCandidatureForm] = useState<CandidatureForm>({
    message: '',
    tarif_propose: null,
    disponibilites: ''
  })
  
  const [filters, setFilters] = useState<Filters>({
    statut: 'tous',
    niveau: 'tous',
    matiere: 'toutes',
    lieu: 'tous',
    search: ''
  })

  const [stats, setStats] = useState({
    total: 0,
    actifs: 0,
    en_attente: 0,
    pourvus: 0
  })

// 🆕 Charger mes candidatures en vérifiant service par service
const loadMyCandidatures = useCallback(async () => {
  if (!user || user.role !== 'precepteur') {
    console.log('⚠️ Pas de user ou pas precepteur')
    return
  }
  
  try {
    const token = localStorage.getItem('excellence-token')
    if (!token) {
      console.log('⚠️ Pas de token')
      return
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
    
    // Essayer différents endpoints possibles
    const endpoints = [
      `${API_URL}/auth/candidatures/mes-candidatures`,
      `${API_URL}/auth/candidatures/me`,
      `${API_URL}/candidatures/mes-candidatures`,
      `${API_URL}/candidatures`,
    ]
    
    let candidaturesData = null
    
    // Essayer chaque endpoint
    for (const endpoint of endpoints) {
      try {
        console.log('🔍 Tentative endpoint:', endpoint)
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          console.log('✅ Endpoint trouvé:', endpoint, data)
          candidaturesData = data
          break
        } else {
          console.log('❌ Endpoint échoué:', endpoint, response.status)
        }
      } catch (err) {
        console.log('❌ Erreur endpoint:', endpoint, err)
      }
    }
    
    if (candidaturesData) {
      // Adapter selon la structure de la réponse
      let ids: string[] = []
      
      if (candidaturesData.success && candidaturesData.candidatures) {
        ids = candidaturesData.candidatures.map((c: any) => String(c.service_parent_id))
      } else if (Array.isArray(candidaturesData)) {
        ids = candidaturesData.map((c: any) => String(c.service_parent_id))
      } else if (candidaturesData.candidatures) {
        ids = candidaturesData.candidatures.map((c: any) => String(c.service_parent_id))
      }
      
      console.log('📋 IDs candidatures trouvés:', ids)
      setAppliedServices(ids)
    } else {
      console.log('⚠️ Aucun endpoint de candidature trouvé')
      // Fallback : vérifier dans les services si on a postulé
      await checkCandidaturesFromServices(token, API_URL)
    }
    
  } catch (err) {
    console.error('❌ Erreur chargement candidatures:', err)
  }
}, [user])

// Fallback : Vérifier les candidatures en interrogeant les services un par un
const checkCandidaturesFromServices = async (token: string, API_URL: string) => {
  try {
    console.log('🔍 Fallback: Vérification candidatures par service')
    
    // Récupérer tous les services
    const response = await fetch(`${API_URL}/auth/services-parent`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      const services = data.services || data || []
      
      // Pour chaque service, vérifier si on a postulé
      const appliedIds: string[] = []
      
      for (const service of services) {
        try {
          const candidaturesResponse = await fetch(
            `${API_URL}/auth/services-parent/${service.id}/candidatures`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          )
          
          if (candidaturesResponse.ok) {
            const candidaturesData = await candidaturesResponse.json()
            const candidatures = candidaturesData.candidatures || candidaturesData || []
            
            // Vérifier si on est dans les candidats
            const hasApplied = candidatures.some((c: any) => 
              String(c.precepteur_id) === String(user?.id)
            )
            
            if (hasApplied) {
              appliedIds.push(String(service.id))
            }
          }
        } catch (err) {
          // Ignorer les erreurs pour les services individuels
        }
      }
      
      console.log('📋 IDs trouvés par fallback:', appliedIds)
      setAppliedServices(appliedIds)
    }
  } catch (err) {
    console.error('❌ Erreur fallback:', err)
  }
}
  // Charger les services
  const loadServices = useCallback(async () => {
    setLoading(true)
    setError('')
    
    try {
      const result = await getAllParentServices()
      console.log('📦 Services chargés:', result.services?.length || 0)
      
      if (result.services) {
        setServices(result.services)
        setFilteredServices(result.services)
        
        const total = result.services.length
        const actifs = result.services.filter((s: ServiceParent) => 
          s.statut === 'actif' || s.statut === 'en_cours'
        ).length
        const en_attente = result.services.filter((s: ServiceParent) => 
          s.statut === 'en_attente'
        ).length
        const pourvus = result.services.filter((s: ServiceParent) => 
          s.statut === 'pourvu'
        ).length
        
        setStats({ total, actifs, en_attente, pourvus })
      }
    } catch (err) {
      console.error('❌ Erreur chargement:', err)
      setError('Impossible de charger les services')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadServices()
    loadMyCandidatures()
  }, [loadServices, loadMyCandidatures])

  // Appliquer les filtres
  useEffect(() => {
    let filtered = [...services]
    
    if (filters.statut !== 'tous') {
      filtered = filtered.filter(s => s.statut === filters.statut)
    }
    
    if (filters.niveau !== 'tous') {
      filtered = filtered.filter(s => s.niveau_eleve === filters.niveau)
    }
    
    if (filters.matiere !== 'toutes') {
      filtered = filtered.filter(s => s.matiere_preferee === filters.matiere)
    }
    
    if (filters.lieu !== 'tous') {
      filtered = filtered.filter(s => s.lieu_preference === filters.lieu)
    }
    
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(s => 
        s.titre.toLowerCase().includes(searchLower) ||
        s.description.toLowerCase().includes(searchLower) ||
        s.eleve?.prenom?.toLowerCase().includes(searchLower) ||
        s.eleve?.nom?.toLowerCase().includes(searchLower)
      )
    }
    
    setFilteredServices(filtered)
  }, [services, filters])

  // Postuler à un service
  const handlePostuler = (service: ServiceParent) => {
    // 🆕 Vérifier si déjà postulé
    if (appliedServices.includes(String(service.id))) {
      return // Ne rien faire si déjà postulé
    }
    
    setServiceToApply(service)
    setCandidatureForm({
      message: `Bonjour, je suis intéressé par votre demande de cours de ${service.matiere_preferee || 'soutien scolaire'} pour le niveau ${service.niveau_eleve}.`,
      tarif_propose: service.budget_horaire || null,
      disponibilites: service.jours_preferences || ''
    })
    setCandidatureError('')
    setSuccessMessage('')
    setShowCandidatureModal(true)
  }

  const submitCandidature = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setCandidatureError('')
    setSuccessMessage('')
    
    try {
      const token = localStorage.getItem('excellence-token')
      
      if (!token) {
        throw new Error('Vous devez être connecté pour postuler')
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
      
      console.log('📤 Envoi candidature:', {
        service_parent_id: serviceToApply?.id,
        message: candidatureForm.message,
        tarif_propose: candidatureForm.tarif_propose,
        disponibilites: candidatureForm.disponibilites
      })

      const response = await fetch(`${API_URL}/auth/candidatures`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          service_parent_id: serviceToApply?.id,
          message: candidatureForm.message,
          tarif_propose: candidatureForm.tarif_propose,
          disponibilites: candidatureForm.disponibilites
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi de la candidature')
      }

      console.log('✅ Candidature envoyée avec succès:', data)
      
      // 🆕 Ajouter l'ID du service à la liste des services postulés
      if (serviceToApply) {
        setAppliedServices(prev => [...prev, String(serviceToApply.id)])
      }
      
      setSuccessMessage('✅ Votre candidature a été envoyée avec succès !')
      
      setTimeout(() => {
        setShowCandidatureModal(false)
        setSuccessMessage('')
        loadServices()
      }, 2000)
      
    } catch (err: any) {
      console.error('❌ Erreur candidature:', err)
      setCandidatureError(err.message || 'Une erreur est survenue')
    } finally {
      setSubmitting(false)
    }
  }

 // 🆕 Vérifier si on a déjà postulé à un service - CORRIGÉ
const hasAlreadyApplied = (serviceId: string) => {
  // Convertir tout en string pour la comparaison
  const serviceIdStr = String(serviceId)
  return appliedServices.some(id => String(id) === serviceIdStr)
}

  // Helpers UI
  const getStatutConfig = (statut: string) => {
    const configs: Record<string, { color: string, icon: React.ReactNode, label: string }> = {
      'en_attente': { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: <Clock className="w-3.5 h-3.5" />,
        label: 'En attente'
      },
      'accepte': { 
        color: 'bg-blue-100 text-blue-800', 
        icon: <Check className="w-3.5 h-3.5" />,
        label: 'Accepté'
      },
      'actif': { 
        color: 'bg-green-100 text-green-800', 
        icon: <Check className="w-3.5 h-3.5" />,
        label: 'Actif'
      },
      'pourvu': { 
        color: 'bg-green-100 text-green-800', 
        icon: <Check className="w-3.5 h-3.5" />,
        label: 'Pourvu'
      },
      'en_cours': { 
        color: 'bg-blue-100 text-blue-800', 
        icon: <Check className="w-3.5 h-3.5" />,
        label: 'En cours'
      },
      'refuse': { 
        color: 'bg-red-100 text-red-800', 
        icon: <X className="w-3.5 h-3.5" />,
        label: 'Refusé'
      },
      'termine': { 
        color: 'bg-gray-100 text-gray-800', 
        icon: <Check className="w-3.5 h-3.5" />,
        label: 'Terminé'
      },
      'annule': { 
        color: 'bg-red-100 text-red-800', 
        icon: <X className="w-3.5 h-3.5" />,
        label: 'Annulé'
      },
      'expire': { 
        color: 'bg-gray-100 text-gray-800', 
        icon: <AlertCircle className="w-3.5 h-3.5" />,
        label: 'Expiré'
      }
    }
    return configs[statut] || { 
      color: 'bg-gray-100 text-gray-800', 
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      label: statut 
    }
  }

  const getFrequenceLabel = (frequence: string) => {
    const labels: Record<string, string> = {
      'unique': 'Ponctuel',
      'hebdomadaire': 'Hebdomadaire',
      'bi-hebdomadaire': '2x/semaine',
      'mensuel': 'Mensuel'
    }
    return labels[frequence] || frequence
  }

  const getLieuLabel = (lieu: string) => {
    const labels: Record<string, string> = {
      'domicile': 'À domicile',
      'en_ligne': 'En ligne',
      'autre': 'Autre'
    }
    return labels[lieu] || lieu
  }

  const getMatiereColor = (matiere: string | null) => {
    const colors: Record<string, string> = {
      'Mathématiques': 'bg-blue-100 text-blue-700',
      'Français': 'bg-purple-100 text-purple-700',
      'Anglais': 'bg-green-100 text-green-700',
      'Sciences': 'bg-cyan-100 text-cyan-700',
      'Physique-Chimie': 'bg-indigo-100 text-indigo-700',
      'SVT': 'bg-emerald-100 text-emerald-700',
      'Histoire-Géo': 'bg-amber-100 text-amber-700'
    }
    return colors[matiere || ''] || 'bg-gray-100 text-gray-700'
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-blue-600" />
            Services des parents
          </h1>
          <p className="text-gray-500 mt-1">
            {filteredServices.length} service{filteredServices.length > 1 ? 's' : ''} trouvé{filteredServices.length > 1 ? 's' : ''}
          </p>
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
        >
          <Filter className="w-4 h-4" />
          Filtres
          {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Briefcase className="w-3 h-3" /> Total
          </p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <p className="text-2xl font-bold text-green-600">{stats.actifs}</p>
          <p className="text-sm text-green-600 flex items-center gap-1">
            <Check className="w-3 h-3" /> Actifs
          </p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
          <p className="text-2xl font-bold text-yellow-600">{stats.en_attente}</p>
          <p className="text-sm text-yellow-600 flex items-center gap-1">
            <Clock className="w-3 h-3" /> En attente
          </p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-2xl font-bold text-blue-600">{stats.pourvus}</p>
          <p className="text-sm text-blue-600 flex items-center gap-1">
            <Users className="w-3 h-3" /> Pourvus
          </p>
        </div>
      </div>

      {/* Filtres */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Statut</label>
              <select
                value={filters.statut}
                onChange={(e) => setFilters({...filters, statut: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="tous">Tous</option>
                <option value="en_attente">En attente</option>
                <option value="actif">Actif</option>
                <option value="en_cours">En cours</option>
                <option value="pourvu">Pourvu</option>
                <option value="termine">Terminé</option>
                <option value="annule">Annulé</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Niveau</label>
              <select
                value={filters.niveau}
                onChange={(e) => setFilters({...filters, niveau: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="tous">Tous</option>
                <option value="7ème">7ème année</option>
                <option value="8ème">8ème année</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Matière</label>
              <select
                value={filters.matiere}
                onChange={(e) => setFilters({...filters, matiere: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="toutes">Toutes</option>
                <option value="Mathématiques">Mathématiques</option>
                <option value="Français">Français</option>
                <option value="Anglais">Anglais</option>
                <option value="Sciences">Sciences</option>
                <option value="Physique-Chimie">Physique-Chimie</option>
                <option value="SVT">SVT</option>
                <option value="Histoire-Géo">Histoire-Géo</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Lieu</label>
              <select
                value={filters.lieu}
                onChange={(e) => setFilters({...filters, lieu: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="tous">Tous</option>
                <option value="domicile">À domicile</option>
                <option value="en_ligne">En ligne</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Recherche</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  placeholder="Rechercher..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setFilters({ 
                statut: 'tous', 
                niveau: 'tous', 
                matiere: 'toutes', 
                lieu: 'tous', 
                search: '' 
              })}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {/* Liste des services */}
      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">Aucun service trouvé</p>
          <p className="text-gray-400 text-sm mt-1">
            {services.length > 0 ? 'Aucun service ne correspond à vos filtres' : 'Aucun service n\'a été publié pour le moment'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredServices.map((service) => {
            const statutConfig = getStatutConfig(service.statut)
            const alreadyApplied = hasAlreadyApplied(service.id)
            
            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Icône */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{service.titre}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statutConfig.color}`}>
                            {statutConfig.icon}
                            {statutConfig.label}
                          </span>
                          {service.matiere_preferee && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getMatiereColor(service.matiere_preferee)}`}>
                              <BookOpen className="w-3 h-3" />
                              {service.matiere_preferee}
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {getFrequenceLabel(service.frequence_souhaitee)}
                          </span>
                        </div>
                      </div>
                      
                      {service.budget_horaire && (
                        <div className="flex items-center gap-1 text-green-600 font-medium bg-green-50 px-3 py-1 rounded-lg text-sm">
                          <DollarSign className="w-4 h-4" />
                          {service.budget_horaire.toLocaleString()} FC/h
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{service.description}</p>

                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
                      {service.eleve && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {service.eleve.prenom} {service.eleve.nom}
                          <span className="text-gray-400">• {service.eleve.niveau}</span>
                        </span>
                      )}
                      
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {getLieuLabel(service.lieu_preference)}
                      </span>
                      
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {service.nombre_vues} vues
                      </span>
                      
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {service.nombre_candidatures} candidature{service.nombre_candidatures > 1 ? 's' : ''}
                      </span>
                      
                      <span>• {formatDate(service.date_creation)}</span>
                    </div>

                    {/* 🆕 BOUTONS D'ACTION */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                      {alreadyApplied ? (
                        <button
                          disabled
                          className="px-4 py-2 bg-green-100 text-green-700 text-sm rounded-lg flex items-center gap-2 font-medium cursor-not-allowed"
                        >
                          <Check className="w-4 h-4" />
                          Déjà postulé
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePostuler(service)
                          }}
                          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
                        >
                          <Send className="w-4 h-4" />
                          Postuler
                        </button>
                      )}
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedService(service)
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Détails
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* MODAL CANDIDATURE */}
      {showCandidatureModal && serviceToApply && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-600" />
                Postuler au service
              </h2>
              <button 
                onClick={() => setShowCandidatureModal(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitCandidature} className="p-6 space-y-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm font-medium text-blue-900">{serviceToApply.titre}</p>
                <p className="text-xs text-blue-700 mt-1">
                  {serviceToApply.matiere_preferee} • {serviceToApply.niveau_eleve} • Budget: {serviceToApply.budget_horaire?.toLocaleString()} FC/h
                </p>
              </div>

              {successMessage && (
                <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm flex items-center gap-2">
                  <Check className="w-4 h-4" /> {successMessage}
                </div>
              )}

              {candidatureError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {candidatureError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message au parent *
                </label>
                <textarea
                  value={candidatureForm.message}
                  onChange={(e) => setCandidatureForm({...candidatureForm, message: e.target.value})}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Présentez-vous et expliquez pourquoi vous êtes intéressé..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Votre tarif proposé (FC/h)
                </label>
                <input
                  type="number"
                  value={candidatureForm.tarif_propose || ''}
                  onChange={(e) => setCandidatureForm({...candidatureForm, tarif_propose: e.target.value ? Number(e.target.value) : null})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Laissez vide pour accepter le budget proposé"
                  min="0"
                  step="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vos disponibilités
                </label>
                <input
                  type="text"
                  value={candidatureForm.disponibilites}
                  onChange={(e) => setCandidatureForm({...candidatureForm, disponibilites: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Ex: Lundi et Mercredi 14h-18h"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowCandidatureModal(false)} 
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Envoyer ma candidature
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Détail */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Détails du service
              </h2>
              <button onClick={() => setSelectedService(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedService.titre}</h3>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatutConfig(selectedService.statut).color}`}>
                    {getStatutConfig(selectedService.statut).icon}
                    {getStatutConfig(selectedService.statut).label}
                  </span>
                </div>
                <p className="text-gray-500 mt-1">Créé le {formatDate(selectedService.date_creation)}</p>
              </div>

              {selectedService.eleve && (
                <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg">
                    {selectedService.eleve.prenom[0]}{selectedService.eleve.nom[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {selectedService.eleve.prenom} {selectedService.eleve.nom}
                      {selectedService.eleve.postnom && ` ${selectedService.eleve.postnom}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedService.eleve.niveau} • {selectedService.eleve.genre === 'M' ? 'Garçon' : 'Fille'}
                      {selectedService.eleve.ecole && ` • ${selectedService.eleve.ecole}`}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-gray-600">{selectedService.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {selectedService.matiere_preferee && (
                  <div className="bg-purple-50 rounded-xl p-4">
                    <p className="text-xs text-purple-600 font-medium uppercase tracking-wide">Matière</p>
                    <p className="font-medium text-gray-900">{selectedService.matiere_preferee}</p>
                    <p className="text-sm text-gray-500">Niveau {selectedService.niveau_eleve}</p>
                  </div>
                )}
                
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Fréquence</p>
                  <p className="font-medium text-gray-900">{getFrequenceLabel(selectedService.frequence_souhaitee)}</p>
                  {selectedService.jours_preferences && (
                    <p className="text-sm text-gray-500">Jours: {selectedService.jours_preferences}</p>
                  )}
                </div>
                
                <div className="bg-amber-50 rounded-xl p-4">
                  <p className="text-xs text-amber-600 font-medium uppercase tracking-wide">Lieu</p>
                  <p className="font-medium text-gray-900">{getLieuLabel(selectedService.lieu_preference)}</p>
                  {selectedService.heures_preferences && (
                    <p className="text-sm text-gray-500">Heures: {selectedService.heures_preferences}</p>
                  )}
                </div>

                {selectedService.budget_horaire && (
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Budget</p>
                    <p className="text-xl font-bold text-green-600">
                      {selectedService.budget_horaire.toLocaleString()} FC/h
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 border-t pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-700">{selectedService.nombre_vues}</p>
                  <p className="text-xs text-gray-500">Vues</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedService.nombre_candidatures}</p>
                  <p className="text-xs text-gray-500">Candidatures</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-700">
                    {selectedService.date_expiration ? '📅' : '♾️'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedService.date_expiration ? 
                      `Expire ${formatDate(selectedService.date_expiration)}` : 
                      'Sans expiration'
                    }
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => setSelectedService(null)} 
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}