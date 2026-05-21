'use client'

import { useState, useEffect, useCallback } from 'react'
import { getMatieres, ajouterMatiere } from '@/actions/matieres'
import { 
  BookOpen, 
  Plus, 
  Search, 
  X, 
  Check, 
  AlertCircle,
  Loader2,
  GraduationCap,
  ChevronDown,
  ChevronUp
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
  const [matieres, setMatieres] = useState<Matiere[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMatiere, setNewMatiere] = useState({ nom: '', niveau: '7ème', description: '' })
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [expandedNiveaux, setExpandedNiveaux] = useState<string[]>(['7ème', '8ème'])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadMatieres()
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const loadMatieres = async () => {
    setLoading(true)
    const { matieres: data } = await getMatieres(searchTerm)
    setMatieres(data || [])
    setLoading(false)
  }

  // Charger toutes les matières au premier rendu
  useEffect(() => {
    loadMatieres()
  }, [])

  const toggleMatiere = (id: number) => {
    const newIds = selectedIds.includes(id)
      ? selectedIds.filter(mid => mid !== id)
      : [...selectedIds, id]
    onMatieresChange(newIds)
  }

  const handleAddMatiere = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setAdding(true)

    if (!newMatiere.nom.trim()) {
      setError('Le nom de la matière est requis')
      setAdding(false)
      return
    }

    const result = await ajouterMatiere({
      nom: newMatiere.nom.trim(),
      niveau: newMatiere.niveau,
      description: newMatiere.description.trim() || undefined
    })

    if (result.error) {
      // Si la matière existe déjà, on peut la sélectionner directement
      if (result.matiere && result.matiere.id) {
        const existingMatiere = result.matiere as Partial<Matiere> & { id: number }
        if (!selectedIds.includes(existingMatiere.id)) {
          onMatieresChange([...selectedIds, existingMatiere.id])
        }
        setNewMatiere({ nom: '', niveau: '7ème', description: '' })
        setShowAddForm(false)
        setMessage(
          existingMatiere.nom
            ? `${existingMatiere.nom} existe déjà et a été ajoutée à votre sélection`
            : 'Cette matière existe déjà et a été ajoutée à votre sélection'
        )
        setTimeout(() => setMessage(''), 3000)
      } else {
        setError(result.error)
      }
    } else if (result.success && result.matiere) {
      // Nouvelle matière créée
      onMatieresChange([...selectedIds, result.matiere.id])
      setNewMatiere({ nom: '', niveau: '7ème', description: '' })
      setShowAddForm(false)
      setMessage('Matière créée et ajoutée avec succès')
      setTimeout(() => setMessage(''), 3000)
      await loadMatieres()
    }
    
    setAdding(false)
  }

  const toggleNiveau = (niveau: string) => {
    setExpandedNiveaux(prev => 
      prev.includes(niveau) 
        ? prev.filter(n => n !== niveau)
        : [...prev, niveau]
    )
  }

  // Grouper par niveau
  const matieresByNiveau = matieres.reduce((acc, matiere) => {
    if (!acc[matiere.niveau]) acc[matiere.niveau] = []
    acc[matiere.niveau].push(matiere)
    return acc
  }, {} as Record<string, Matiere[]>)

  const niveaux = ['7ème', '8ème']

  return (
    <div className="space-y-4 hid">
      {/* En-tête avec recherche */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une matière..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm)
            setError('')
            if (!showAddForm) {
              setNewMatiere({ nom: '', niveau: '7ème', description: '' })
            }
          }}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            showAddForm 
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {showAddForm ? (
            <>
              <X className="w-4 h-4" /> Fermer
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" /> Proposer une matière
            </>
          )}
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm flex items-center gap-2 border border-green-200">
          <Check className="w-4 h-4 flex-shrink-0" /> {message}
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      {/* Formulaire d'ajout rapide */}
      {showAddForm && (
        <form onSubmit={handleAddMatiere} className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
          <h4 className="text-sm font-semibold  text-gray-900 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Proposer une nouvelle matière
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nom de la matière *</label>
              <input
                type="text"
                value={newMatiere.nom}
                onChange={(e) => setNewMatiere({ ...newMatiere, nom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Physique, Chimie..."
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Niveau</label>
              <select
                value={newMatiere.niveau}
                onChange={(e) => setNewMatiere({ ...newMatiere, niveau: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7ème">7ème année</option>
                <option value="8ème">8ème année</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={adding || !newMatiere.nom.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              {adding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Ajout en cours...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Ajouter cette matière
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Liste des matières par niveau */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : matieres.length === 0 ? (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            {searchTerm ? 'Aucune matière trouvée pour cette recherche' : 'Aucune matière disponible'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              Effacer la recherche
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {niveaux.map(niveau => {
            const matieresNiveau = matieresByNiveau[niveau]
            if (!matieresNiveau || matieresNiveau.length === 0) return null
            
            const isExpanded = expandedNiveaux.includes(niveau)
            const selectedInNiveau = matieresNiveau.filter(m => selectedIds.includes(m.id)).length
            
            return (
              <div key={niveau} className="border border-gray-200 rounded-xl overflow-hidden">
                {/* En-tête du niveau */}
                <button
                  onClick={() => toggleNiveau(niveau)}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-sm text-gray-900">
                      Niveau {niveau}
                    </span>
                    {selectedInNiveau > 0 && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                        {selectedInNiveau} sélectionnée{selectedInNiveau > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {matieresNiveau.length} matière{matieresNiveau.length > 1 ? 's' : ''}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Liste des matières */}
                {isExpanded && (
                  <div className="divide-y divide-gray-100">
                    {matieresNiveau.map((matiere) => {
                      const isSelected = selectedIds.includes(matiere.id)
                      
                      return (
                        <label
                          key={matiere.id}
                          className={`flex items-center gap-3 p-3 cursor-pointer transition-all hover:bg-gray-50 ${
                            isSelected ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                            isSelected 
                              ? 'bg-blue-600 border-blue-600' 
                              : 'border-gray-300'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${
                              isSelected ? 'font-medium text-blue-700' : 'text-gray-900'
                            }`}>
                              {matiere.nom}
                            </p>
                            {matiere.description && (
                              <p className="text-xs text-gray-500 truncate mt-0.5">
                                {matiere.description}
                              </p>
                            )}
                          </div>
                          
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleMatiere(matiere.id)}
                            className="hidden"
                          />
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Résumé de la sélection */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">
              {selectedIds.length} matière{selectedIds.length > 1 ? 's' : ''} sélectionnée{selectedIds.length > 1 ? 's' : ''}
            </span>
          </div>
          {selectedIds.length > 0 && (
            <button
              onClick={() => onMatieresChange([])}
              className="text-xs text-red-600 hover:text-red-700 font-medium"
            >
              Tout désélectionner
            </button>
          )}
        </div>
        
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {matieres
              .filter(m => selectedIds.includes(m.id))
              .map(matiere => (
                <span
                  key={matiere.id}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                >
                  {matiere.nom}
                  <button
                    onClick={() => toggleMatiere(matiere.id)}
                    className="hover:text-blue-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            }
          </div>
        )}
      </div>
    </div>
  )
}