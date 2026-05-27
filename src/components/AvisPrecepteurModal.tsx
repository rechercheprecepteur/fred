// app/components/AvisPrecepteurModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  X,
  Star,
  User,
  MessageSquare,
  Calendar,
  BookOpen,
  Award
} from 'lucide-react'
import Loader from '@/components/Loader'

type AvisPrecepteurModalProps = {
  precepteurId: number
  isOpen: boolean
  onClose: () => void
}

type Rating = {
  id: number
  contract_id: number
  precepteur_id: number
  parent_id: number
  note: number
  commentaire: string | null
  created_at: string
  updated_at: string
  parent?: {
    user: {
      username: string
      photo_profil: string | null
    }
  }
  contract?: {
    matiere: {
      nom: string
      niveau: string
    }
    eleve: {
      prenom: string
      nom: string
      niveau: string
    }
  }
}

export default function AvisPrecepteurModal({
  precepteurId,
  isOpen,
  onClose
}: AvisPrecepteurModalProps) {
  const [ratings, setRatings] = useState<Rating[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    moyenne: 0,
    total: 0,
    repartition: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  })

  useEffect(() => {
    if (isOpen && precepteurId) {
      loadRatings()
    }
  }, [isOpen, precepteurId])

  const loadRatings = async () => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('🔍 [DEBUG] Début chargement pour precepteurId:', precepteurId)
      
      // ÉTAPE 1: Test simple - Récupérer juste les ratings sans jointures
      const { data: simpleRatings, error: simpleError } = await supabase
        .from('precepteur_ratings')
        .select('*')
        .eq('precepteur_id', precepteurId)
      
      console.log('📊 [DEBUG] Résultat simple:', { 
        data: simpleRatings, 
        error: simpleError,
        count: simpleRatings?.length 
      })

      if (simpleError) {
        console.error('❌ [DEBUG] Erreur simple:', simpleError)
        setError(`Erreur base de données: ${simpleError.message || JSON.stringify(simpleError)}`)
        setLoading(false)
        return
      }

      if (!simpleRatings || simpleRatings.length === 0) {
        console.log('⚠️ [DEBUG] Aucun rating trouvé')
        setRatings([])
        setStats({ moyenne: 0, total: 0, repartition: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } })
        setLoading(false)
        return
      }

      console.log('✅ [DEBUG] Ratings simples trouvés:', simpleRatings.length)

      // ÉTAPE 2: Récupérer les IDs des parents
      const parentIds = [...new Set(simpleRatings.map(r => r.parent_id))]
      console.log('👥 [DEBUG] Parent IDs:', parentIds)

      // ÉTAPE 3: Récupérer les infos des parents
      const { data: parents, error: parentsError } = await supabase
        .from('parents')
        .select(`
          id,
          user:users!inner (
            username,
            photo_profil
          )
        `)
        .in('id', parentIds)

      console.log('👤 [DEBUG] Parents trouvés:', { data: parents, error: parentsError })

      // ÉTAPE 4: Récupérer les IDs des contrats
      const contractIds = [...new Set(simpleRatings.map(r => r.contract_id))]
      console.log('📝 [DEBUG] Contract IDs:', contractIds)

      // ÉTAPE 5: Récupérer les infos des contrats
      const { data: contracts, error: contractsError } = await supabase
        .from('contracts')
        .select(`
          id,
          matiere_id,
          eleve_id,
          matiere:matieres!inner (
            nom,
            niveau
          ),
          eleve:eleves!inner (
            prenom,
            nom,
            niveau
          )
        `)
        .in('id', contractIds)

      console.log('📄 [DEBUG] Contrats trouvés:', { data: contracts, error: contractsError })

      // ÉTAPE 6: Assembler les données
      const parentsMap = new Map()
      if (parents) {
        parents.forEach(p => parentsMap.set(p.id, p))
      }

      const contractsMap = new Map()
      if (contracts) {
        contracts.forEach(c => contractsMap.set(c.id, c))
      }

      const ratingsWithDetails = simpleRatings.map(rating => ({
        ...rating,
        parent: parentsMap.get(rating.parent_id) || null,
        contract: contractsMap.get(rating.contract_id) || null
      }))

      console.log('🎯 [DEBUG] Ratings assemblés:', ratingsWithDetails)
      setRatings(ratingsWithDetails)

      // Calculer les statistiques
      const total = ratingsWithDetails.length
      const moyenne = total > 0
        ? ratingsWithDetails.reduce((sum, r) => sum + r.note, 0) / total
        : 0

      const repartition = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      ratingsWithDetails.forEach(r => {
        if (r.note >= 1 && r.note <= 5) {
          repartition[r.note as keyof typeof repartition]++
        }
      })

      setStats({ moyenne, total, repartition })
      console.log('📈 [DEBUG] Stats calculées:', { moyenne, total, repartition })

    } catch (error) {
      console.error('💥 [DEBUG] Exception:', error)
      setError(`Exception: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    }

    setLoading(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="relative p-6 pb-4 border-b">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-gray-900">Avis des parents</h2>
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700">{error}</p>
                <button 
                  onClick={loadRatings}
                  className="text-xs text-red-600 underline mt-1"
                >
                  Réessayer
                </button>
              </div>
            )}

            {/* Statistiques rapides */}
            {!error && stats.total > 0 && (
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(stats.moyenne)
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {stats.moyenne.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {stats.total} avis
                </span>
              </div>
            )}

            {/* Barres de répartition */}
            {!error && stats.total > 0 && (
              <div className="space-y-1.5 mt-3">
                {[5, 4, 3, 2, 1].map((note) => {
                  const count = stats.repartition[note as keyof typeof stats.repartition]
                  const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
                  
                  return (
                    <div key={note} className="flex items-center gap-2">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm font-medium text-gray-700">{note}</span>
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                      </div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            note >= 4 ? 'bg-green-500' :
                            note >= 3 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Liste des avis */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse space-y-3 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                      </div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-red-300 mx-auto mb-4" />
                <p className="text-red-500 text-lg font-medium">Erreur de chargement</p>
                <p className="text-gray-400 text-sm mt-1">
                  Vérifiez la console pour plus de détails
                </p>
              </div>
            ) : ratings.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">Aucun avis pour le moment</p>
                <p className="text-gray-400 text-sm mt-1">
                  Les avis des parents apparaîtront ici une fois que des contrats seront terminés.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {ratings.map((rating) => (
                  <div
                    key={rating.id}
                    className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {rating.parent?.user?.photo_profil ? (
                          <img
                            src={rating.parent.user.photo_profil}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        )}
                        
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {rating.parent?.user?.username || 'Parent'}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {formatDate(rating.created_at)}
                            {rating.updated_at !== rating.created_at && (
                              <span className="text-gray-400">(modifié)</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= rating.note
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {rating.commentaire && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-700 italic">
                          "{rating.commentaire}"
                        </p>
                      </div>
                    )}

                    {rating.contract && (
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                          <BookOpen className="w-3 h-3" />
                          {rating.contract.matiere?.nom} - {rating.contract.matiere?.niveau}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full">
                          <Award className="w-3 h-3" />
                          {rating.contract.eleve?.prenom} {rating.contract.eleve?.nom}
                        </span>
                      </div>
                    )}

                    {!rating.commentaire && (
                      <p className="text-xs text-gray-400 italic">
                        Avis sans commentaire
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t p-4">
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}