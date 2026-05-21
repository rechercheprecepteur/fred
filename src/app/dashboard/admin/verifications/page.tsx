'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  User, 
  Search,
  Check,
  X,
  AlertCircle,
  Clock,
  Eye,
  GraduationCap,
  MapPin,
  Star,
  BookOpen,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Filter,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Users
} from 'lucide-react'

type Precepteur = {
  id: number
  user_id: string
  commune: string | null
  quartier: string | null
  latitude: number | null
  longitude: number | null
  annees_experience: number
  note_moyenne: number
  diplome: string | null
  etablissement_origine: string | null
  statut_verification: 'en_attente' | 'verifie' | 'rejete'
  disponible: boolean
  created_at: string
  updated_at: string
  user: {
    id: string
    username: string
    email: string
    genre: string
    photo_profil: string | null
    created_at: string
  }
  matieres: {
    matiere_id: number
    matiere: {
      id: number
      nom: string
      niveau: string
    }
  }[]
}

type Stats = {
  en_attente: number
  verifie: number
  rejete: number
  total: number
}

export default function VerificationPrecepteurs() {
  const [precepteurs, setPrecepteurs] = useState<Precepteur[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statutFilter, setStatutFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalForPage, setTotalForPage] = useState(0)
  const [stats, setStats] = useState<Stats>({
    en_attente: 0,
    verifie: 0,
    rejete: 0,
    total: 0
  })
  
  // Modal détails
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedPrecepteur, setSelectedPrecepteur] = useState<Precepteur | null>(null)
  
  // Modal confirmation
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'verifie' | 'rejete'>('verifie')
  const [confirmComment, setConfirmComment] = useState('')
  const [processing, setProcessing] = useState(false)

  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    loadStats()
  }, [])

  useEffect(() => {
    loadPrecepteurs()
  }, [statutFilter, page])

  const loadStats = async () => {
    // Charger les statistiques globales
    const { data: allPrecepteurs, error } = await supabase
      .from('precepteurs')
      .select('statut_verification')

    if (!error && allPrecepteurs) {
      const stats = {
        en_attente: allPrecepteurs.filter(p => p.statut_verification === 'en_attente').length,
        verifie: allPrecepteurs.filter(p => p.statut_verification === 'verifie').length,
        rejete: allPrecepteurs.filter(p => p.statut_verification === 'rejete').length,
        total: allPrecepteurs.length
      }
      setStats(stats)
    }
  }

  const loadPrecepteurs = async () => {
    setLoading(true)

    let query = supabase
      .from('precepteurs')
      .select(`
        *,
        user:users!inner(
          id, username, email, genre, photo_profil, created_at
        )
      `, { count: 'exact' })

    if (statutFilter) {
      query = query.eq('statut_verification', statutFilter)
    }

    query = query
      .order('created_at', { ascending: false })
      .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Error loading precepteurs:', error)
      setMessage('Erreur lors du chargement des précepteurs')
    } else {
      const precepteursData = data || []
      
      // Charger les matières pour chaque précepteur
      if (precepteursData.length > 0) {
        const precepteurIds = precepteursData.map(p => p.id)
        const { data: matieres } = await supabase
          .from('precepteur_matieres')
          .select(`
            precepteur_id,
            matiere_id,
            matiere:matieres!inner(
              id, nom, niveau
            )
          `)
          .in('precepteur_id', precepteurIds)

        const precepteursWithMatieres = precepteursData.map(p => ({
          ...p,
          matieres: matieres?.filter(m => m.precepteur_id === p.id) || []
        }))

        setPrecepteurs(precepteursWithMatieres)
      } else {
        setPrecepteurs([])
      }

      setTotalForPage(count || 0)
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE))
    }

    setLoading(false)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleVerification = async () => {
    if (!selectedPrecepteur) return
    
    setProcessing(true)
    
    try {
      const { error } = await supabase
        .from('precepteurs')
        .update({
          statut_verification: confirmAction,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedPrecepteur.id)

      if (error) throw error

      setMessage(
        confirmAction === 'verifie' 
          ? `Le précepteur ${selectedPrecepteur.user.username} est maintenant vérifié` 
          : `Le précepteur ${selectedPrecepteur.user.username} a été rejeté`
      )
      
      setShowConfirmModal(false)
      setShowDetailsModal(false)
      setSelectedPrecepteur(null)
      setConfirmComment('')
      
      // Recharger les stats et la liste
      await loadStats()
      await loadPrecepteurs()
    } catch (error) {
      console.error('Error updating verification:', error)
      setMessage('Erreur lors de la mise à jour du statut')
    }
    
    setProcessing(false)
    setTimeout(() => setMessage(''), 3000)
  }

  const openDetails = (precepteur: Precepteur) => {
    setSelectedPrecepteur(precepteur)
    setShowDetailsModal(true)
  }

  const openConfirmAction = (action: 'verifie' | 'rejete') => {
    setConfirmAction(action)
    setConfirmComment('')
    setShowConfirmModal(true)
  }

  // Filtrage par recherche
  const filteredPrecepteurs = precepteurs.filter(precepteur => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      precepteur.user?.username?.toLowerCase().includes(searchLower) ||
      precepteur.user?.email?.toLowerCase().includes(searchLower) ||
      precepteur.commune?.toLowerCase().includes(searchLower) ||
      precepteur.diplome?.toLowerCase().includes(searchLower) ||
      precepteur.matieres?.some(m => 
        m.matiere?.nom?.toLowerCase().includes(searchLower)
      )
    )
  })

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'verifie':
        return {
          icon: <ShieldCheck className="w-4 h-4" />,
          label: 'Vérifié',
          className: 'bg-green-100 text-green-700 border-green-200'
        }
      case 'rejete':
        return {
          icon: <ShieldX className="w-4 h-4" />,
          label: 'Rejeté',
          className: 'bg-red-100 text-red-700 border-red-200'
        }
      case 'en_attente':
      default:
        return {
          icon: <ShieldAlert className="w-4 h-4" />,
          label: 'En attente',
          className: 'bg-yellow-100 text-yellow-700 border-yellow-200'
        }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Message */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 border ${
          message.includes('Erreur') 
            ? 'bg-red-50 text-red-600 border-red-200' 
            : 'bg-green-50 text-green-600 border-green-200'
        }`}>
          {message.includes('Erreur') ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          {message}
        </div>
      )}

      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="w-6 h-6" /> Vérification des précepteurs
        </h1>
        <p className="text-gray-600 mt-1">
          Vérifiez et gérez les statuts des précepteurs inscrits sur la plateforme
        </p>
      </div>

      {/* Stats - Cliquables pour filtrer */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <button
          onClick={() => { 
            setStatutFilter(statutFilter === 'en_attente' ? '' : 'en_attente')
            setPage(1)
          }}
          className={`p-4 rounded-xl border-2 flex justify-between transition-colors text-left ${
            statutFilter === 'en_attente' 
              ? 'bg-yellow-100 border-yellow-400' 
              : 'bg-yellow-50 border-yellow-100 hover:bg-yellow-100 hover:border-yellow-300'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-yellow-700" />
            </div>
            <span className="text-sm font-medium text-yellow-800">En attente</span>
          </div>
          <p className="text-3xl cypher text-yellow-900">{stats.en_attente}</p>
        </button>

        <button
          onClick={() => { 
            setStatutFilter(statutFilter === 'verifie' ? '' : 'verifie')
            setPage(1)
          }}
          className={`p-4 rounded-xl border-2 flex justify-between transition-colors text-left ${
            statutFilter === 'verifie' 
              ? 'bg-green-100 border-green-400' 
              : 'bg-green-50 border-green-100 hover:bg-green-100 hover:border-green-300'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-green-700" />
            </div>
            <span className="text-sm font-medium text-green-800">Vérifiés</span>
          </div>
          <p className="text-3xl cypher text-green-900">{stats.verifie}</p>
        </button>

        <button
          onClick={() => { 
            setStatutFilter(statutFilter === 'rejete' ? '' : 'rejete')
            setPage(1)
          }}
          className={`p-4 rounded-xl border-2 flex justify-between transition-colors text-left ${
            statutFilter === 'rejete' 
              ? 'bg-red-100 border-red-400' 
              : 'bg-red-50 border-red-100 hover:bg-red-100 hover:border-red-300'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center">
              <ShieldX className="w-4 h-4 text-red-700" />
            </div>
            <span className="text-sm font-medium text-red-800">Rejetés</span>
          </div>
          <p className="text-3xl cypher text-red-900">{stats.rejete}</p>
        </button>

        <button
          onClick={() => { 
            setStatutFilter('')
            setPage(1)
          }}
          className={`p-4 rounded-xl border-2 flex justify-between transition-colors text-left ${
            !statutFilter 
              ? 'bg-blue-100 border-blue-400' 
              : 'bg-blue-50 border-blue-100 hover:bg-blue-100 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-700" />
            </div>
            <span className="text-sm font-medium text-blue-800">Total</span>
          </div>
          <p className="text-3xl cypher text-blue-900">{stats.total}</p>
        </button>
      </div>
      <div className="bg-white max-w-2xl rounded-xl row-span-2 border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, commune, matière..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
          </div>
          <select
            value={statutFilter}
            onChange={(e) => { setStatutFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
          >
            <option value="">Tous les statuts</option>
            <option value="en_attente">En attente ({stats.en_attente})</option>
            <option value="verifie">Vérifié ({stats.verifie})</option>
            <option value="rejete">Rejeté ({stats.rejete})</option>
          </select>
          {(searchTerm || statutFilter) && (
            <button
              onClick={() => { setSearchTerm(''); setStatutFilter(''); setPage(1); }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-black flex items-center gap-1 whitespace-nowrap"
            >
              <RotateCcw className="w-3 h-3" /> Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Filtres et recherche */}

      {/* Résumé des résultats */}
      <div className="mb-4 text-sm text-gray-600 flex items-center gap-2">
        <Users className="w-4 h-4" />
        {statutFilter ? (
          <span>
            <strong>{totalForPage}</strong> précepteur{totalForPage > 1 ? 's' : ''} 
            <span className="mx-1">avec le statut</span>
            <span className="font-medium capitalize">{statutFilter.replace('_', ' ')}</span>
            {searchTerm && <span className="ml-1">(filtré par recherche)</span>}
          </span>
        ) : (
          <span>
            <strong>{totalForPage}</strong> précepteur{totalForPage > 1 ? 's' : ''} au total
            {searchTerm && <span className="ml-1">(filtré par recherche)</span>}
          </span>
        )}
      </div>

      {/* Liste des précepteurs */}
      <div className="grid grid-cols-1   gap-4">

      <div className="  grid rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex gap-4">
                <div className="h-16 bg-gray-100 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredPrecepteurs.length === 0 ? (
          <div className="p-12 text-center">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">Aucun précepteur trouvé</p>
            <p className="text-gray-400 text-sm">
              {searchTerm || statutFilter 
                ? 'Essayez de modifier vos critères de recherche' 
                : 'Aucun précepteur à afficher'}
            </p>
            {(searchTerm || statutFilter) && (
              <button
                onClick={() => { setSearchTerm(''); setStatutFilter(''); setPage(1); }}
                className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100">
              {filteredPrecepteurs.map((precepteur) => {
                const statut = getStatutBadge(precepteur.statut_verification)
                return (
                  <div key={precepteur.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Photo */}
                      <div className="flex-shrink-0">
                        {precepteur.user?.photo_profil ? (
                          <img src={precepteur.user.photo_profil} alt="" className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Infos */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-900 truncate">
                                {precepteur.user?.username || 'Anonyme'}
                              </h3>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${statut.className}`}>
                                {statut.icon}
                                {statut.label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-0.5">{precepteur.user?.email}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => openDetails(precepteur)}
                              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" /> Détails
                            </button>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {precepteur.commune && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {precepteur.commune}
                              {precepteur.quartier && `, ${precepteur.quartier}`}
                            </span>
                          )}
                          <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {precepteur.annees_experience} an{precepteur.annees_experience > 1 ? 's' : ''}
                          </span>
                          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3" /> {precepteur.note_moyenne?.toFixed(1) || '0.0'}/5
                          </span>
                          {precepteur.matieres && precepteur.matieres.length > 0 && (
                            <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <BookOpen className="w-3 h-3" /> {precepteur.matieres.length} matière{precepteur.matieres.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>

                        {/* Date d'inscription */}
                        <p className="text-xs text-gray-400 mt-2">
                          Inscrit le {new Date(precepteur.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 p-4 border-t border-gray-100">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Précédent
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                  .map((p, index, array) => (
                    <span key={p} className="flex items-center">
                      {index > 0 && array[index - 1] !== p - 1 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <button
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          page === p
                            ? 'bg-black text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    </span>
                  ))}
                
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors flex items-center gap-1"
                >
                  Suivant <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
      </div>

      {/* MODAL - Détails du précepteur */}
      {showDetailsModal && selectedPrecepteur && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowDetailsModal(false)}
          ></div>

          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-xl max-w-2xl w-full border border-gray-200">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <User className="w-5 h-5" /> Détails du précepteur
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Corps */}
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* En-tête profil */}
                <div className="flex items-center gap-4">
                  {selectedPrecepteur.user?.photo_profil ? (
                    <img src={selectedPrecepteur.user.photo_profil} alt="" className="w-20 h-20 rounded-full object-cover" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{selectedPrecepteur.user?.username}</h3>
                    <p className="text-gray-600">{selectedPrecepteur.user?.email}</p>
                    <p className="text-sm text-gray-500">
                      Genre: {selectedPrecepteur.user?.genre === 'M' ? 'Masculin' : 'Féminin'}
                    </p>
                  </div>
                </div>

                {/* Infos générales */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Localisation
                    </p>
                    <p className="font-medium text-sm">
                      {selectedPrecepteur.commune || 'Non spécifié'}
                      {selectedPrecepteur.quartier && `, ${selectedPrecepteur.quartier}`}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Expérience
                    </p>
                    <p className="font-medium text-sm">
                      {selectedPrecepteur.annees_experience} an{selectedPrecepteur.annees_experience > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" /> Diplôme
                    </p>
                    <p className="font-medium text-sm">
                      {selectedPrecepteur.diplome || 'Non spécifié'}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" /> Établissement
                    </p>
                    <p className="font-medium text-sm">
                      {selectedPrecepteur.etablissement_origine || 'Non spécifié'}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <Star className="w-3 h-3" /> Note
                    </p>
                    <p className="font-medium text-sm">
                      {selectedPrecepteur.note_moyenne?.toFixed(1) || '0.0'}/5
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Statut
                    </p>
                    <p className="font-medium text-sm capitalize">
                      {selectedPrecepteur.statut_verification.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                {/* Matières */}
                {selectedPrecepteur.matieres && selectedPrecepteur.matieres.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> Matières enseignées ({selectedPrecepteur.matieres.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPrecepteur.matieres.map((m) => (
                        <span key={m.matiere_id} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                          {m.matiere?.nom} ({m.matiere?.niveau})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Coordonnées GPS */}
                {selectedPrecepteur.latitude && selectedPrecepteur.longitude && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Coordonnées GPS
                    </h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {selectedPrecepteur.latitude}, {selectedPrecepteur.longitude}
                    </p>
                  </div>
                )}

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p>Inscrit le: {new Date(selectedPrecepteur.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}</p>
                  <p>Dernière mise à jour: {new Date(selectedPrecepteur.updated_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl flex gap-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
                >
                  Fermer
                </button>
                {selectedPrecepteur.statut_verification !== 'verifie' && (
                  <button
                    onClick={() => openConfirmAction('verifie')}
                    className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" /> Vérifier
                  </button>
                )}
                {selectedPrecepteur.statut_verification !== 'rejete' && (
                  <button
                    onClick={() => openConfirmAction('rejete')}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShieldX className="w-4 h-4" /> Rejeter
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL - Confirmation */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowConfirmModal(false)}
          ></div>

          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-xl max-w-md w-full p-6 border border-gray-200">
              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 ${
                  confirmAction === 'verifie' 
                    ? 'bg-green-100 border-green-300' 
                    : 'bg-red-100 border-red-300'
                }`}>
                  {confirmAction === 'verifie' ? (
                    <ShieldCheck className="w-8 h-8 text-green-600" />
                  ) : (
                    <ShieldX className="w-8 h-8 text-red-600" />
                  )}
                </div>
                <h2 className="text-xl font-bold">
                  {confirmAction === 'verifie' ? 'Vérifier ce précepteur' : 'Rejeter ce précepteur'}
                </h2>
                <p className="text-gray-600 mt-2">
                  {confirmAction === 'verifie'
                    ? 'Ce précepteur pourra apparaître dans les résultats de recherche et proposer ses services.'
                    : 'Ce précepteur ne pourra plus proposer ses services. Cette action peut être annulée.'}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">{selectedPrecepteur?.user?.username}</p>
                    <p className="text-sm text-gray-600">{selectedPrecepteur?.user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commentaire (optionnel)
                </label>
                <textarea
                  value={confirmComment}
                  onChange={(e) => setConfirmComment(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm resize-none"
                  placeholder={
                    confirmAction === 'verifie'
                      ? 'Ex: Félicitations, votre profil a été vérifié avec succès...'
                      : 'Ex: Votre profil n\'a pas été validé car les informations sont incomplètes...'
                  }
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleVerification}
                  disabled={processing}
                  className={`flex-1 px-4 py-2.5 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                    confirmAction === 'verifie'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Traitement...
                    </>
                  ) : (
                    <>
                      {confirmAction === 'verifie' ? (
                        <><ShieldCheck className="w-4 h-4" /> Confirmer</>
                      ) : (
                        <><ShieldX className="w-4 h-4" /> Confirmer</>
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}