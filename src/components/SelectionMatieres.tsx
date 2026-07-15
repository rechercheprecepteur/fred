'use client'

import { useState, useEffect, useRef } from 'react'
import { getMatieres } from '@/actions/matieres'
import { 
  BookOpen, 
  Search, 
  X, 
  Check, 
  Loader2,
  GraduationCap
} from 'lucide-react'

type Matiere = {
  id: number
  nom: string
  niveau: string
  description: string | null
}

interface SelectionMatieresProps {
  selectedIds: number[]
  onMatieresChange: (ids: number[]) => void
}

export default function SelectionMatieres({ selectedIds, onMatieresChange }: SelectionMatieresProps) {
  // S'assurer que selectedIds est toujours un tableau
  const safeSelectedIds = Array.isArray(selectedIds) ? selectedIds : []
  
  const [allMatieres, setAllMatieres] = useState<Matiere[]>([])
  const [searchResults, setSearchResults] = useState<Matiere[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Charger toutes les matières au montage pour la recherche locale
  useEffect(() => {
    loadAllMatieres()
  }, [])

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Recherche avec debounce
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    setIsSearching(true)
    const timer = setTimeout(() => {
      const term = searchTerm.toLowerCase().trim()
      const results = allMatieres.filter(matiere => 
        matiere.nom.toLowerCase().includes(term) ||
        matiere.niveau.toLowerCase().includes(term) ||
        (matiere.description && matiere.description.toLowerCase().includes(term))
      )
      setSearchResults(results)
      setShowDropdown(true)
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, allMatieres])

 const loadAllMatieres = async () => {
  console.log('🔄 SelectionMatieres - Chargement...')
  const result = await getMatieres('')
  console.log('📦 Résultat:', result)
  
  if (result.matieres && result.matieres.length > 0) {
    console.log(`✅ ${result.matieres.length} matières chargées dans le sélecteur`)
    setAllMatieres(result.matieres)
  } else {
    console.warn('⚠️ Aucune matière chargée dans le sélecteur')
    setAllMatieres([])
  }
}

  const toggleMatiere = (id: number) => {
    const newIds = safeSelectedIds.includes(id)
      ? safeSelectedIds.filter(mid => mid !== id)
      : [...safeSelectedIds, id]
    onMatieresChange(newIds)
  }

  const handleSelectMatiere = (matiereId: number) => {
    if (!safeSelectedIds.includes(matiereId)) {
      onMatieresChange([...safeSelectedIds, matiereId])
    }
    setSearchTerm('')
    setShowDropdown(false)
    inputRef.current?.focus()
  }

  const getMatiereById = (id: number) => allMatieres.find(m => m.id === id)

  // Grouper les résultats par niveau
  const groupedResults = searchResults.reduce((acc, matiere) => {
    const niveau = matiere.niveau || 'Sans niveau'
    if (!acc[niveau]) acc[niveau] = []
    acc[niveau].push(matiere)
    return acc
  }, {} as Record<string, Matiere[]>)

  const niveauxOrder = ['7ème', '8ème']

  return (
    <div className="space-y-4">
    

      {/* Barre de recherche avec autocomplétion */}
      <div ref={searchRef} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
              if (searchTerm.length >= 2 && searchResults.length > 0) {
                setShowDropdown(true)
              }
            }}
            placeholder="Rechercher une matière (ex: Mathématiques, Français...)"
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('')
                setShowDropdown(false)
                inputRef.current?.focus()
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown des résultats de recherche */}
        {showDropdown && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
            {isSearching ? (
              <div className="p-4 text-center">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400 mx-auto" />
                <p className="text-sm text-gray-500 mt-2">Recherche en cours...</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="p-6 text-center">
                <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Aucune matière trouvée</p>
                <p className="text-xs text-gray-400 mt-1">
                  Essayez avec un autre terme de recherche
                </p>
              </div>
            ) : (
              <div>
                {niveauxOrder.map(niveau => {
                  const matieresNiveau = groupedResults[niveau]
                  if (!matieresNiveau || matieresNiveau.length === 0) return null
                  
                  return (
                    <div key={niveau}>
                      <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider sticky top-0 flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5" />
                        {niveau}
                      </div>
                      {matieresNiveau.map((matiere) => {
                        const isSelected = safeSelectedIds.includes(matiere.id)
                        return (
                          <button
                            key={matiere.id}
                            onClick={() => !isSelected && handleSelectMatiere(matiere.id)}
                            disabled={isSelected}
                            className={`w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-blue-50 transition-colors ${
                              isSelected ? 'bg-green-50 cursor-not-allowed opacity-70' : ''
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {matiere.nom}
                              </p>
                              {matiere.description && (
                                <p className="text-xs text-gray-500 truncate mt-0.5">
                                  {matiere.description}
                                </p>
                              )}
                            </div>
                            {isSelected ? (
                              <span className="flex items-center gap-1 text-xs text-green-600 font-medium flex-shrink-0 ml-2">
                                <Check className="w-4 h-4" />
                                Ajoutée
                              </span>
                            ) : (
                              <span className="text-xs text-blue-600 font-medium flex-shrink-0 ml-2">
                                + Ajouter
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Matières sélectionnées */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">
              {safeSelectedIds.length} matière{safeSelectedIds.length > 1 ? 's' : ''} sélectionnée{safeSelectedIds.length > 1 ? 's' : ''}
            </span>
          </div>
          {safeSelectedIds.length > 0 && (
            <button
              onClick={() => onMatieresChange([])}
              className="text-xs text-red-600 hover:text-red-700 font-medium"
            >
              Tout désélectionner
            </button>
          )}
        </div>
        
        {safeSelectedIds.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-3">
            {safeSelectedIds.map((matiereId) => {
              const matiere = getMatiereById(matiereId)
              if (!matiere) return null
              
              return (
                <span
                  key={matiereId}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium group hover:bg-blue-200 transition-colors"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>{matiere.nom}</span>
                  {matiere.niveau && (
                    <span className="text-blue-400">({matiere.niveau})</span>
                  )}
                  <button
                    onClick={() => toggleMatiere(matiereId)}
                    className="ml-1 text-blue-400 hover:text-red-500 transition-colors"
                    title="Retirer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-400 mt-3 text-center py-4">
            Utilisez la recherche ci-dessus pour ajouter des matières
          </p>
        )}
      </div>
    </div>
  )
}