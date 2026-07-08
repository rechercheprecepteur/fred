// app/precepteur/services/page.tsx

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { 
  getServicesDisponibles, 
  getServiceById, 
  postulerService,
  getMesCandidatures 
} from '@/actions/parent-service'
import Loader from '@/components/Loader'
import { 
  Search, 
  Filter, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Clock, 
  User, 
  GraduationCap,
  BookOpen,
  Eye,
  ChevronRight,
  X,
  Send,
  Check,
  AlertCircle,
  Building2,
  Phone,
  ArrowLeft,
  Users,
  TrendingUp
} from 'lucide-react'

// ✅ Définition des types
type ServiceParent = {
  id: number
  parent_id: number
  eleve_id: number
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
  parent: {
    id: number
    user: {
      username: string
      photo_profil: string | null
    }
  }
  eleve: {
    nom: string
    prenom: string
    niveau: string
  }
}

type ServiceDetail = {
  id: number
  parent_id: number
  eleve_id: number
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
  parent: {
    id: number
    user: {
      id: number
      username: string
      email: string
      photo_profil: string | null
    }
    telephone: string | null
    adresse: string | null
  }
  eleve: {
    id: number
    nom: string
    prenom: string
    niveau: string
    ecole: string | null
  }
}

type Candidature = {
  id: number
  service_id: number
  message: string
  statut: string
  date_candidature: string
  service: {
    titre: string
    description: string
    matiere_preferee: string | null
    niveau_eleve: string
    frequence_souhaitee: string
    budget_horaire: number | null
    lieu_preference: string
    statut: string
    eleve: {
      nom: string
      prenom: string
    }
  }
}

export default function PrecepteurServices() {
  const { user, isAuthenticated } = useAuth()
  const [services, setServices] = useState<ServiceParent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showPostulerModal, setShowPostulerModal] = useState(false)
  const [candidatures, setCandidatures] = useState<Candidature[]>([])
  const [message, setMessage] = useState('')
  const [messagePostuler, setMessagePostuler] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<'disponibles' | 'mes_candidatures'>('disponibles')

  // Filtres
  const [filtres, setFiltres] = useState({
    matiere: '',
    niveau: '',
    frequence: '',
    lieu: '',
    budget_min: '',
    budget_max: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const loadServices = useCallback(async () => {
    setLoading(true)
    const { services: servicesData } = await getServicesDisponibles({
      matiere: filtres.matiere || undefined,
      niveau: filtres.niveau || undefined,
      frequence: filtres.frequence || undefined,
      lieu: filtres.lieu || undefined,
      budget_min: filtres.budget_min ? parseInt(filtres.budget_min) : undefined,
      budget_max: filtres.budget_max ? parseInt(filtres.budget_max) : undefined
    })
    if (servicesData) {
      setServices(servicesData as ServiceParent[])
    }
    setLoading(false)
  }, [filtres])

  // ✅ Correction : Passer l'ID utilisateur
  const loadCandidatures = useCallback(async () => {
    if (!user?.id) return
    
    const { candidatures: candidaturesData } = await getMesCandidatures(user.id)
    if (candidaturesData) {
      setCandidatures(candidaturesData as Candidature[])
    }
  }, [user?.id])

  useEffect(() => {
    if (isAuthenticated) {
      loadServices()
      loadCandidatures()
    }
  }, [isAuthenticated, loadServices, loadCandidatures])

  const handleViewService = async (serviceId: number) => {
    setLoading(true)
    const { service } = await getServiceById(serviceId)
    if (service) {
      setSelectedService(service as ServiceDetail)
      setShowDetailModal(true)
      
      // Incrémenter les vues
      await fetch(`/api/services/${serviceId}/view`, { method: 'POST' })
    }
    setLoading(false)
  }

  // ✅ Correction : Passer l'ID utilisateur dans postulerService
  const handlePostuler = async () => {
    if (!selectedService || !messagePostuler.trim() || !user?.id) return
    
    setSubmitting(true)
    const result = await postulerService(
      selectedService.id, 
      messagePostuler, 
      user.id  // ✅ Troisième argument : l'ID utilisateur
    )
    
    if (result.success) {
      setMessage('Votre candidature a été envoyée avec succès !')
      setShowPostulerModal(false)
      setMessagePostuler('')
      setShowDetailModal(false)
      setTimeout(() => setMessage(''), 3000)
      await loadServices()
      await loadCandidatures()
    } else {
      setMessage(result.error || 'Erreur lors de l\'envoi de la candidature')
      setTimeout(() => setMessage(''), 3000)
    }
    setSubmitting(false)
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

  const getLieuLabel = (lieu: string) => {
    switch (lieu) {
      case 'domicile': return 'À domicile'
      case 'en_ligne': return 'En ligne'
      case 'autre': return 'Autre'
      default: return lieu
    }
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-800'
      case 'acceptee': return 'bg-green-100 text-green-800'
      case 'refusee': return 'bg-red-100 text-red-800'
      case 'annulee': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const formatDateRelative = (date: string) => {
    const now = new Date()
    const d = new Date(date)
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return "Aujourd'hui"
    if (days === 1) return "Hier"
    if (days < 7) return `Il y a ${days} jours`
    if (days < 30) return `Il y a ${Math.floor(days / 7)} semaines`
    return formatDate(date)
  }

  // Filtrer les services par terme de recherche
  const filteredServices = services.filter(service => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      service.titre.toLowerCase().includes(search) ||
      service.description.toLowerCase().includes(search) ||
      service.matiere_preferee?.toLowerCase().includes(search) ||
      service.eleve?.prenom.toLowerCase().includes(search)
    )
  })

  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Connectez-vous</h2>
          <p className="text-gray-500">Connectez-vous pour voir les sollicitations disponibles</p>
        </div>
      </div>
    )
  }

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

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Briefcase className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Sollicitations des parents</h1>
        </div>
        <p className="text-gray-600 ml-11">
          Découvrez les demandes de cours et proposez vos services
        </p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 rounded-lg p-2">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-700">{services.length}</p>
              <p className="text-sm text-blue-600">Services disponibles</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 rounded-lg p-2">
              <Send className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-700">{candidatures.length}</p>
              <p className="text-sm text-green-600">Mes candidatures</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500 rounded-lg p-2">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-700">
                {candidatures.filter(c => c.statut === 'acceptee').length}
              </p>
              <p className="text-sm text-purple-600">Acceptées</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('disponibles')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'disponibles' 
              ? 'bg-black text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Services disponibles ({services.length})
        </button>
        <button
          onClick={() => setActiveTab('mes_candidatures')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'mes_candidatures' 
              ? 'bg-black text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Send className="w-4 h-4" /> Mes candidatures ({candidatures.length})
        </button>
      </div>

      {/* Barre de recherche et filtres */}
      {activeTab === 'disponibles' && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par titre, matière, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                showFilters 
                  ? 'bg-blue-50 border-blue-300 text-blue-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filtres
              {(filtres.matiere || filtres.niveau || filtres.frequence || filtres.lieu) && (
                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {[filtres.matiere, filtres.niveau, filtres.frequence, filtres.lieu].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {/* Filtres avancés */}
          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 pt-4 border-t">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Matière</label>
                <select 
                  value={filtres.matiere}
                  onChange={(e) => setFiltres({...filtres, matiere: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  <option value="">Toutes</option>
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
                <label className="block text-xs font-medium text-gray-700 mb-1">Niveau</label>
                <select 
                  value={filtres.niveau}
                  onChange={(e) => setFiltres({...filtres, niveau: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  <option value="">Tous</option>
                  <option value="7ème">7ème année</option>
                  <option value="8ème">8ème année</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Fréquence</label>
                <select 
                  value={filtres.frequence}
                  onChange={(e) => setFiltres({...filtres, frequence: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  <option value="">Toutes</option>
                  <option value="unique">Ponctuel</option>
                  <option value="hebdomadaire">Hebdomadaire</option>
                  <option value="bi-hebdomadaire">2x/semaine</option>
                  <option value="mensuel">Mensuel</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Lieu</label>
                <select 
                  value={filtres.lieu}
                  onChange={(e) => setFiltres({...filtres, lieu: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  <option value="">Tous</option>
                  <option value="domicile">À domicile</option>
                  <option value="en_ligne">En ligne</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Budget (FC/h)</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Min"
                    value={filtres.budget_min}
                    onChange={(e) => setFiltres({...filtres, budget_min: e.target.value})}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <input 
                    type="number" 
                    placeholder="Max"
                    value={filtres.budget_max}
                    onChange={(e) => setFiltres({...filtres, budget_max: e.target.value})}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Liste des services disponibles */}
      {activeTab === 'disponibles' && (
        <>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-12"><Loader /></div>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun service disponible</h3>
              <p className="text-gray-500">
                {services.length === 0 
                  ? 'Aucune sollicitation pour le moment. Revenez plus tard !'
                  : 'Aucun service ne correspond à votre recherche.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map((service) => (
                <div 
                  key={service.id}
                  className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all group cursor-pointer overflow-hidden"
                  onClick={() => handleViewService(service.id)}
                >
                  {/* En-tête de la carte */}
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1 line-clamp-2">
                          {service.titre}
                        </h3>
                        <div className="flex items-center gap-2">
                          {service.matiere_preferee && (
                            <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                              {service.matiere_preferee}
                            </span>
                          )}
                          <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                            {service.niveau_eleve}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  {/* Corps de la carte */}
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {service.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-medium">{service.eleve?.prenom} {service.eleve?.nom}</span>
                        <span>•</span>
                        <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                        <span>{service.eleve?.niveau}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                          <Calendar className="w-3 h-3" />
                          {getFrequenceLabel(service.frequence_souhaitee)}
                        </span>
                        <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                          <MapPin className="w-3 h-3" />
                          {getLieuLabel(service.lieu_preference)}
                        </span>
                        {service.budget_horaire && (
                          <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            <DollarSign className="w-3 h-3" />
                            {service.budget_horaire.toLocaleString()} FC/h
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <div className="flex items-center gap-1">
                        {service.parent?.user?.photo_profil ? (
                          <img 
                            src={service.parent.user.photo_profil} 
                            alt="" 
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="w-3 h-3 text-gray-400" />
                          </div>
                        )}
                        <span className="text-xs text-gray-600">{service.parent?.user?.username}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {service.nombre_vues}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> {service.nombre_candidatures}
                        </span>
                        <span>{formatDateRelative(service.date_creation)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Mes candidatures */}
      {activeTab === 'mes_candidatures' && (
        <>
          {candidatures.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
              <Send className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune candidature</h3>
              <p className="text-gray-500 mb-6">
                Vous n'avez pas encore postulé à des sollicitations
              </p>
              <button
                onClick={() => setActiveTab('disponibles')}
                className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors text-sm inline-flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4" /> Voir les services disponibles
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {candidatures.map((candidature) => (
                <div 
                  key={candidature.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {candidature.service?.titre}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User className="w-4 h-4" />
                        <span>
                          Pour {candidature.service?.eleve?.prenom} {candidature.service?.eleve?.nom}
                        </span>
                        {candidature.service?.matiere_preferee && (
                          <>
                            <span>•</span>
                            <BookOpen className="w-4 h-4" />
                            <span>{candidature.service.matiere_preferee}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatutColor(candidature.statut)}`}>
                      {candidature.statut.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {getFrequenceLabel(candidature.service?.frequence_souhaitee || '')}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {getLieuLabel(candidature.service?.lieu_preference || '')}
                    </span>
                    {candidature.service?.budget_horaire && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs flex items-center gap-1 font-medium">
                        <DollarSign className="w-3 h-3" />
                        {candidature.service.budget_horaire.toLocaleString()} FC/h
                      </span>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-gray-600">
                      <strong className="text-gray-700">Mon message :</strong> {candidature.message}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Postulé le {formatDate(candidature.date_candidature)}
                    </span>
                    {candidature.service?.statut !== 'actif' && (
                      <span className="text-orange-500 font-medium">
                        Service {candidature.service?.statut}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal détail service */}
      {showDetailModal && selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b z-10 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Retour</span>
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* En-tête service */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 -mx-6 -mt-6 px-6 py-6 mb-6">
                <h2 className="text-2xl font-bold text-white mb-3">
                  {selectedService.titre}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {selectedService.matiere_preferee && (
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      {selectedService.matiere_preferee}
                    </span>
                  )}
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    {selectedService.niveau_eleve}
                  </span>
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    {getFrequenceLabel(selectedService.frequence_souhaitee)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedService.description}
                </p>
              </div>

              {/* Détails */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Informations pratiques</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Fréquence :</span>
                      <span className="font-medium">{getFrequenceLabel(selectedService.frequence_souhaitee)}</span>
                    </div>
                    {selectedService.jours_preferences && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Jours :</span>
                        <span className="font-medium">{selectedService.jours_preferences}</span>
                      </div>
                    )}
                    {selectedService.heures_preferences && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Heures :</span>
                        <span className="font-medium">{selectedService.heures_preferences}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Lieu :</span>
                      <span className="font-medium">{getLieuLabel(selectedService.lieu_preference)}</span>
                    </div>
                    {selectedService.budget_horaire && (
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Budget :</span>
                        <span className="font-medium text-green-600">
                          {selectedService.budget_horaire.toLocaleString()} FC/h
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-3">L'élève</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Nom :</span>
                      <span className="font-medium">
                        {selectedService.eleve?.prenom} {selectedService.eleve?.nom}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Niveau :</span>
                      <span className="font-medium">{selectedService.eleve?.niveau}</span>
                    </div>
                    {selectedService.eleve?.ecole && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">École :</span>
                        <span className="font-medium">{selectedService.eleve.ecole}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Parent */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Le parent</h4>
                <div className="flex items-center gap-3 mb-3">
                  {selectedService.parent?.user?.photo_profil ? (
                    <img 
                      src={selectedService.parent.user.photo_profil} 
                      alt="" 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {selectedService.parent?.user?.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      Membre depuis {formatDate(selectedService.date_creation)}
                    </p>
                  </div>
                </div>
                {selectedService.parent?.telephone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Phone className="w-4 h-4" />
                    <span>{selectedService.parent.telephone}</span>
                  </div>
                )}
                {selectedService.parent?.adresse && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedService.parent.adresse}</span>
                  </div>
                )}
              </div>

              {/* Stats et dates */}
              <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" /> {selectedService.nombre_vues} vues
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> {selectedService.nombre_candidatures} candidatures
                  </span>
                </div>
                <div>
                  {selectedService.date_expiration && (
                    <span className="text-orange-500">
                      Expire le {formatDate(selectedService.date_expiration)}
                    </span>
                  )}
                </div>
              </div>

              {/* Bouton postuler */}
              <button
                onClick={() => setShowPostulerModal(true)}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium flex items-center justify-center gap-2 shadow-md"
              >
                <Send className="w-5 h-5" />
                Postuler à cette sollicitation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal postuler */}
      {showPostulerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-600" /> Postuler
              </h2>
              <button 
                onClick={() => setShowPostulerModal(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Votre message de candidature *
                </label>
                <textarea
                  value={messagePostuler}
                  onChange={(e) => setMessagePostuler(e.target.value)}
                  rows={5}
                  placeholder="Présentez-vous, expliquez votre expérience, votre méthode de travail, vos disponibilités..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Un message détaillé augmente vos chances d'être accepté
                </p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  Le parent recevra une notification avec votre candidature et pourra vous contacter directement.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowPostulerModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Annuler
                </button>
                <button
                  onClick={handlePostuler}
                  disabled={submitting || !messagePostuler.trim()}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Envoyer ma candidature
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}