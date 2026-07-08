// app/dashboard/parent/services/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Clock, 
  BookOpen, 
  Users, 
  Tag,
  X,
  ChevronDown,
  Sliders,
  GraduationCap,
  Laptop,
  Home,
  ArrowUpDown,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  MessageSquare,
  Award,
  Briefcase,
  Building,
  Heart,
  Share2,
  Eye
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Service = {
  id: number
  precepteur_id: number
  titre: string
  description: string | null
  type_service: string
  modalite: string
  tarif_horaire: number | null
  tarif_forfaitaire: number | null
  duree_minutes: number
  nombre_eleves_max: number
  est_actif: boolean
  created_at: string
  precepteur?: {
    id: number
    diplome: string
    annees_experience: number
    commune: string
    quartier: string
    note_moyenne: number
    disponible: boolean
    telephone?: string
    etablissement_origine?: string
    user?: {
      id: string
      username: string
      photo_profil: string | null
      email?: string
    }
  } | null
}

export default function ServicesPage() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  
  // Modal
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    type_service: '',
    modalite: '',
    localisation: '',
    tarif_min: '',
    tarif_max: '',
    duree_max: '',
    tri: 'pertinence'
  })

  const typeServiceOptions = [
    { value: '', label: 'Tous les types' },
    { value: 'cours_particulier', label: 'Cours particulier' },
    { value: 'aide_devoirs', label: 'Aide aux devoirs' },
    { value: 'preparation_examens', label: 'Préparation aux examens' },
    { value: 'soutien_scolaire', label: 'Soutien scolaire' },
    { value: 'autre', label: 'Autre' }
  ]

  const modaliteOptions = [
    { value: '', label: 'Toutes les modalités' },
    { value: 'presentiel', label: 'Présentiel' },
    { value: 'en_ligne', label: 'En ligne' },
    { value: 'hybride', label: 'Hybride' }
  ]

  const triOptions = [
    { value: 'pertinence', label: 'Pertinence' },
    { value: 'prix_croissant', label: 'Prix croissant' },
    { value: 'prix_decroissant', label: 'Prix décroissant' },
    { value: 'note', label: 'Meilleure note' },
    { value: 'experience', label: 'Plus expérimenté' }
  ]

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('services_precepteur')
        .select(`
          *,
          precepteur:precepteurs(
            id,
            diplome,
            annees_experience,
            commune,
            quartier,
            note_moyenne,
            disponible,
            telephone,
            etablissement_origine,
            user:users(
              id,
              username,
              photo_profil,
              email
            )
          )
        `)
        .eq('est_actif', true)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Erreur chargement services:', error)
      } else {
        setServices(data || [])
      }
    } catch (error) {
      console.error('Erreur:', error)
    }
    setLoading(false)
  }

  const filteredServices = services
    .filter(service => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        const matchesSearch = 
          service.titre.toLowerCase().includes(search) ||
          service.description?.toLowerCase().includes(search) ||
          service.precepteur?.user?.username.toLowerCase().includes(search) ||
          service.precepteur?.commune?.toLowerCase().includes(search)
        
        if (!matchesSearch) return false
      }

      if (filters.type_service && service.type_service !== filters.type_service) return false
      if (filters.modalite && service.modalite !== filters.modalite) return false

      if (filters.localisation) {
        const localisation = filters.localisation.toLowerCase()
        const matchesLocalisation = 
          service.precepteur?.commune?.toLowerCase().includes(localisation) ||
          service.precepteur?.quartier?.toLowerCase().includes(localisation)
        
        if (!matchesLocalisation) return false
      }

      if (filters.tarif_min && service.tarif_horaire) {
        if (service.tarif_horaire < parseFloat(filters.tarif_min)) return false
      }

      if (filters.tarif_max && service.tarif_horaire) {
        if (service.tarif_horaire > parseFloat(filters.tarif_max)) return false
      }

      if (filters.duree_max && service.duree_minutes > parseInt(filters.duree_max)) return false

      return true
    })
    .sort((a, b) => {
      switch (filters.tri) {
        case 'prix_croissant':
          return (a.tarif_horaire || 0) - (b.tarif_horaire || 0)
        case 'prix_decroissant':
          return (b.tarif_horaire || 0) - (a.tarif_horaire || 0)
        case 'note':
          return (b.precepteur?.note_moyenne || 0) - (a.precepteur?.note_moyenne || 0)
        case 'experience':
          return (b.precepteur?.annees_experience || 0) - (a.precepteur?.annees_experience || 0)
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  const resetFilters = () => {
    setFilters({
      type_service: '',
      modalite: '',
      localisation: '',
      tarif_min: '',
      tarif_max: '',
      duree_max: '',
      tri: 'pertinence'
    })
    setSearchTerm('')
  }

  const hasActiveFilters = () => {
    return filters.type_service || 
           filters.modalite || 
           filters.localisation || 
           filters.tarif_min || 
           filters.tarif_max || 
           filters.duree_max ||
           filters.tri !== 'pertinence' ||
           searchTerm
  }

  const openDetailModal = (service: Service) => {
    setSelectedService(service)
    setShowDetailModal(true)
    // Empêcher le scroll de la page
    document.body.style.overflow = 'hidden'
  }

  const closeDetailModal = () => {
    setShowDetailModal(false)
    setSelectedService(null)
    // Réactiver le scroll
    document.body.style.overflow = 'auto'
  }

  const getTypeServiceColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'cours_particulier': 'bg-purple-100 text-purple-700',
      'aide_devoirs': 'bg-blue-100 text-blue-700',
      'preparation_examens': 'bg-orange-100 text-orange-700',
      'soutien_scolaire': 'bg-green-100 text-green-700',
      'autre': 'bg-gray-100 text-gray-700'
    }
    return colors[type] || 'bg-gray-100 text-gray-700'
  }

  const getTypeServiceLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'cours_particulier': 'Cours particulier',
      'aide_devoirs': 'Aide aux devoirs',
      'preparation_examens': 'Préparation aux examens',
      'soutien_scolaire': 'Soutien scolaire',
      'autre': 'Autre'
    }
    return labels[type] || type
  }

  const getModaliteIcon = (modalite: string) => {
    switch (modalite) {
      case 'presentiel': return <Home className="w-4 h-4" />
      case 'en_ligne': return <Laptop className="w-4 h-4" />
      case 'hybride': return <Users className="w-4 h-4" />
      default: return null
    }
  }

  const getModaliteLabel = (modalite: string) => {
    const labels: { [key: string]: string } = {
      'presentiel': 'Présentiel',
      'en_ligne': 'En ligne',
      'hybride': 'Hybride'
    }
    return labels[modalite] || modalite
  }

  // Fonction pour partager
  const handleShare = async (service: Service) => {
    const shareData = {
      title: service.titre,
      text: `Découvrez ce service de ${service.precepteur?.user?.username} : ${service.titre}`,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback : copier le lien
        await navigator.clipboard.writeText(window.location.href)
        alert('Lien copié dans le presse-papier !')
      }
    } catch (error) {
      console.error('Erreur partage:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Services des précepteurs</h1>
            <p className="text-gray-600">Trouvez le service idéal pour votre enfant</p>
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-2xl shadow-sm border mb-6 overflow-hidden">
        <div className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par titre, description, précepteur, localisation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 border ${
              showFilters || hasActiveFilters()
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Filtres
            {hasActiveFilters() && (
              <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
                {[
                  filters.type_service,
                  filters.modalite,
                  filters.localisation,
                  filters.tarif_min || filters.tarif_max,
                  filters.duree_max
                ].filter(Boolean).length}
              </span>
            )}
          </button>

          <select
            value={filters.tri}
            onChange={(e) => setFilters({ ...filters, tri: e.target.value })}
            className="px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {triOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {showFilters && (
          <div className="border-t p-4 bg-gray-50/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Type de service
                </label>
                <select
                  value={filters.type_service}
                  onChange={(e) => setFilters({ ...filters, type_service: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {typeServiceOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Modalité
                </label>
                <select
                  value={filters.modalite}
                  onChange={(e) => setFilters({ ...filters, modalite: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {modaliteOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Localisation
                </label>
                <input
                  type="text"
                  placeholder="Commune ou quartier..."
                  value={filters.localisation}
                  onChange={(e) => setFilters({ ...filters, localisation: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Tarif minimum (FC)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.tarif_min}
                  onChange={(e) => setFilters({ ...filters, tarif_min: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="1000"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Tarif maximum (FC)
                </label>
                <input
                  type="number"
                  placeholder="Illimité"
                  value={filters.tarif_max}
                  onChange={(e) => setFilters({ ...filters, tarif_max: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="1000"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Durée maximum (minutes)
                </label>
                <select
                  value={filters.duree_max}
                  onChange={(e) => setFilters({ ...filters, duree_max: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Toutes les durées</option>
                  <option value="30">30 minutes max</option>
                  <option value="60">1 heure max</option>
                  <option value="90">1h30 max</option>
                  <option value="120">2 heures max</option>
                  <option value="180">3 heures max</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <button
                onClick={resetFilters}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Réinitialiser les filtres
              </button>
              <div className="text-sm text-gray-500">
                {filteredServices.length} résultat{filteredServices.length > 1 ? 's' : ''} trouvé{filteredServices.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Liste des services */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border">
          <Search className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun service trouvé</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Essayez de modifier vos critères de recherche ou de réinitialiser les filtres
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{filteredServices.length}</span> service{filteredServices.length > 1 ? 's' : ''} disponible{filteredServices.length > 1 ? 's' : ''}
            </p>
            {hasActiveFilters() && (
              <button
                onClick={resetFilters}
                className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Effacer les filtres
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group cursor-pointer"
                onClick={() => openDetailModal(service)}
              >
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      {service.precepteur?.user?.photo_profil ? (
                        <img 
                          src={service.precepteur.user.photo_profil} 
                          alt={service.precepteur.user.username}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                          <span className="text-lg font-bold text-blue-600">
                            {service.precepteur?.user?.username?.charAt(0).toUpperCase() || '?'}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {service.titre}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {service.precepteur?.user?.username}
                        </p>
                      </div>
                    </div>
                    {service.precepteur?.disponible && (
                      <span className="flex items-center gap-1.5 text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Dispo
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeServiceColor(service.type_service)}`}>
                      {getTypeServiceLabel(service.type_service)}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 flex items-center gap-1.5">
                      {getModaliteIcon(service.modalite)}
                      {getModaliteLabel(service.modalite)}
                    </span>
                  </div>

                  {service.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {service.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{service.duree_minutes} min</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{service.nombre_eleves_max} élève{service.nombre_eleves_max > 1 ? 's' : ''}</span>
                    </div>
                    {service.precepteur?.commune && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 col-span-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{service.precepteur.commune}{service.precepteur.quartier ? `, ${service.precepteur.quartier}` : ''}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50/80 border-t flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {service.precepteur?.note_moyenne && service.precepteur.note_moyenne > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-gray-700">
                          {service.precepteur.note_moyenne.toFixed(1)}
                        </span>
                      </div>
                    )}
                    {service.precepteur?.annees_experience && service.precepteur.annees_experience > 0 && (
                      <div className="flex items-center gap-1">
                        <GraduationCap className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {service.precepteur.annees_experience} an{service.precepteur.annees_experience > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    {service.tarif_horaire && service.tarif_horaire > 0 ? (
                      <div>
                        <p className="text-lg font-bold text-green-600">
                          {service.tarif_horaire.toLocaleString()} FC
                        </p>
                        <p className="text-xs text-gray-500">/heure</p>
                      </div>
                    ) : service.tarif_forfaitaire && service.tarif_forfaitaire > 0 ? (
                      <div>
                        <p className="text-lg font-bold text-orange-600">
                          {service.tarif_forfaitaire.toLocaleString()} FC
                        </p>
                        <p className="text-xs text-gray-500">forfait</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">Gratuit</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal de détail du service */}
      {showDetailModal && selectedService && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* En-tête du modal */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <button
                onClick={closeDetailModal}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4">
                {selectedService.precepteur?.user?.photo_profil ? (
                  <img 
                    src={selectedService.precepteur.user.photo_profil} 
                    alt={selectedService.precepteur.user.username}
                    className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/30"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center ring-4 ring-white/30">
                    <span className="text-3xl font-bold">
                      {selectedService.precepteur?.user?.username?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold">{selectedService.titre}</h2>
                    {selectedService.precepteur?.disponible && (
                      <span className="px-3 py-1 bg-green-500/30 text-white rounded-full text-xs font-medium backdrop-blur-sm">
                        Disponible
                      </span>
                    )}
                  </div>
                  <p className="text-white/80 text-lg">
                    par {selectedService.precepteur?.user?.username}
                  </p>
                </div>
              </div>
            </div>

            {/* Corps du modal */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getTypeServiceColor(selectedService.type_service)}`}>
                  {getTypeServiceLabel(selectedService.type_service)}
                </span>
                <span className="px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-blue-700 flex items-center gap-2">
                  {getModaliteIcon(selectedService.modalite)}
                  {getModaliteLabel(selectedService.modalite)}
                </span>
                <button
                  onClick={() => handleShare(selectedService)}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Partager
                </button>
              </div>

              {/* Description */}
              {selectedService.description && (
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-gray-400" />
                    Description du service
                  </h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {selectedService.description}
                  </p>
                </div>
              )}

              {/* Détails du service */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Durée</p>
                  <p className="font-semibold text-gray-900">{selectedService.duree_minutes} min</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Élèves max</p>
                  <p className="font-semibold text-gray-900">{selectedService.nombre_eleves_max}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center col-span-2">
                  <Tag className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Tarif</p>
                  {selectedService.tarif_horaire && selectedService.tarif_horaire > 0 ? (
                    <p className="font-semibold text-gray-900">
                      {selectedService.tarif_horaire.toLocaleString()} FC / heure
                    </p>
                  ) : selectedService.tarif_forfaitaire && selectedService.tarif_forfaitaire > 0 ? (
                    <p className="font-semibold text-gray-900">
                      {selectedService.tarif_forfaitaire.toLocaleString()} FC (forfait)
                    </p>
                  ) : (
                    <p className="font-semibold text-gray-400">Gratuit</p>
                  )}
                </div>
              </div>

              {/* Profil du précepteur */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  À propos du précepteur
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-600">Note :</span>
                      <span className="font-medium text-gray-900">
                        {selectedService.precepteur?.note_moyenne?.toFixed(1) || 'N/A'}/5
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Expérience :</span>
                      <span className="font-medium text-gray-900">
                        {selectedService.precepteur?.annees_experience || 0} an(s)
                      </span>
                    </div>
                    {selectedService.precepteur?.diplome && (
                      <div className="flex items-center gap-2 text-sm">
                        <GraduationCap className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Diplôme :</span>
                        <span className="font-medium text-gray-900">{selectedService.precepteur.diplome}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    {selectedService.precepteur?.commune && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Localisation :</span>
                        <span className="font-medium text-gray-900">
                          {selectedService.precepteur.commune}
                          {selectedService.precepteur.quartier ? `, ${selectedService.precepteur.quartier}` : ''}
                        </span>
                      </div>
                    )}
                    {selectedService.precepteur?.etablissement_origine && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Établissement :</span>
                        <span className="font-medium text-gray-900">
                          {selectedService.precepteur.etablissement_origine}
                        </span>
                      </div>
                    )}
                    {selectedService.precepteur?.user?.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Email :</span>
                        <span className="font-medium text-gray-900 text-xs">
                          {selectedService.precepteur.user.email}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Pied du modal */}
            <div className="border-t p-6 bg-white flex flex-col sm:flex-row gap-3">
              <button
                onClick={closeDetailModal}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  closeDetailModal()
                  router.push(`/dashboard/parent/contrats/nouveau?precepteur=${selectedService.precepteur_id}`)
                }}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Contacter le précepteur
              </button>
              <button
                onClick={() => {
                  // Ajouter aux favoris (à implémenter)
                  alert('Ajouté aux favoris !')
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}