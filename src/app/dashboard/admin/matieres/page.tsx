// app/admin/matieres/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Plus, 
  Search, 
  X, 
  BookOpen, 
  GraduationCap,
  Trash2,
  Edit3,
  Check,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react'

type Matiere = {
  id: number
  nom: string
  niveau: string
  description: string | null
  created_at: string
  updated_at?: string // Ajout du champ optionnel
}

export default function AdminMatieresPage() {
  const [matieres, setMatieres] = useState<Matiere[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedMatiere, setSelectedMatiere] = useState<Matiere | null>(null)
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null)
  const [error, setError] = useState('')

  const [newMatiere, setNewMatiere] = useState({ nom: '', niveau: '7ème', description: '' })
  const [editMatiere, setEditMatiere] = useState({ nom: '', niveau: '7ème', description: '' })
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadMatieres()
  }, [search])

  // Fonction pour afficher les messages
  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  // ✅ Charger les matières
  const loadMatieres = async () => {
    setLoading(true)
    try {
      let query = supabase.from('matieres').select('*').order('nom')
      
      if (search) {
        query = query.ilike('nom', `%${search}%`)
      }
      
      const { data, error } = await query
      
      if (error) {
        console.error('Erreur Supabase:', error)
        showMessage('❌ Erreur lors du chargement des matières', 'error')
        setMatieres([])
        return
      }
      
      setMatieres(data || [])
    } catch (err) {
      console.error('Erreur chargement:', err)
      showMessage('❌ Erreur inattendue lors du chargement', 'error')
      setMatieres([])
    } finally {
      setLoading(false)
    }
  }

  // ✅ Ajouter
  const handleAddMatiere = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    if (!newMatiere.nom.trim()) {
      setError('Le nom de la matière est requis')
      setSubmitting(false)
      return
    }

    try {
      const { error: insertError } = await supabase
        .from('matieres')
        .insert([{
          nom: newMatiere.nom.trim(),
          niveau: newMatiere.niveau,
          description: newMatiere.description.trim() || null,
          created_at: new Date().toISOString()
        }])

      if (insertError) {
        console.error('Erreur insertion:', insertError)
        if (insertError.code === '23505') {
          setError('Cette matière existe déjà pour ce niveau')
        } else if (insertError.code === '42P01') {
          setError('La table matieres n\'existe pas')
        } else {
          setError(`Erreur: ${insertError.message}`)
        }
      } else {
        setShowAddModal(false)
        setNewMatiere({ nom: '', niveau: '7ème', description: '' })
        showMessage('✅ Matière ajoutée avec succès', 'success')
        loadMatieres()
      }
    } catch (err: any) {
      console.error('Exception:', err)
      setError(`Erreur inattendue: ${err.message || 'Erreur lors de l\'ajout'}`)
    } finally {
      setSubmitting(false)
    }
  }

  // ✅ Ouvrir modification
  const openEditModal = (matiere: Matiere) => {
    setSelectedMatiere(matiere)
    setEditMatiere({
      nom: matiere.nom,
      niveau: matiere.niveau,
      description: matiere.description || ''
    })
    setError('')
    setShowEditModal(true)
  }

  // ✅ Modifier
  const handleEditMatiere = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMatiere) return
    
    setError('')
    setSubmitting(true)

    if (!editMatiere.nom.trim()) {
      setError('Le nom de la matière est requis')
      setSubmitting(false)
      return
    }

    try {
      const updateData: any = {
        nom: editMatiere.nom.trim(),
        niveau: editMatiere.niveau,
        description: editMatiere.description.trim() || null,
        updated_at: new Date().toISOString()
      }

      const { error: updateError } = await supabase
        .from('matieres')
        .update(updateData)
        .eq('id', selectedMatiere.id)

      if (updateError) {
        console.error('Erreur modification:', updateError)
        if (updateError.code === '23505') {
          setError('Une matière avec ce nom existe déjà pour ce niveau')
        } else {
          setError(`Erreur: ${updateError.message}`)
        }
      } else {
        setShowEditModal(false)
        setSelectedMatiere(null)
        showMessage('✅ Matière modifiée avec succès', 'success')
        loadMatieres()
      }
    } catch (err: any) {
      console.error('Exception:', err)
      setError(`Erreur inattendue: ${err.message || 'Erreur lors de la modification'}`)
    } finally {
      setSubmitting(false)
    }
  }

  // ✅ Ouvrir suppression
  const openDeleteModal = (matiere: Matiere) => {
    setSelectedMatiere(matiere)
    setShowDeleteModal(true)
  }

  // ✅ Supprimer
  const handleDeleteMatiere = async () => {
    if (!selectedMatiere) return
    
    setDeleting(true)
    try {
      // Vérifier d'abord si la table precepteur_matieres existe
      const { error: checkError } = await supabase
        .from('precepteur_matieres')
        .select('id')
        .eq('matiere_id', selectedMatiere.id)
        .limit(1)

      // Si la table existe, supprimer les associations
      if (!checkError || checkError.code !== '42P01') {
        const { error: assocError } = await supabase
          .from('precepteur_matieres')
          .delete()
          .eq('matiere_id', selectedMatiere.id)
        
        if (assocError && assocError.code !== '42P01') {
          console.error('Erreur suppression associations:', assocError)
        }
      }
      
      // Supprimer la matière
      const { error: deleteError } = await supabase
        .from('matieres')
        .delete()
        .eq('id', selectedMatiere.id)

      if (deleteError) {
        console.error('Erreur suppression:', deleteError)
        showMessage(`❌ Erreur: ${deleteError.message}`, 'error')
      } else {
        setShowDeleteModal(false)
        setSelectedMatiere(null)
        showMessage('✅ Matière supprimée avec succès', 'success')
        loadMatieres()
      }
    } catch (err: any) {
      console.error('Exception:', err)
      showMessage(`❌ Erreur inattendue: ${err.message}`, 'error')
    } finally {
      setDeleting(false)
    }
  }

  // Grouper les matières par niveau
  const matieresParNiveau = matieres.reduce((acc, matiere) => {
    if (!acc[matiere.niveau]) {
      acc[matiere.niveau] = []
    }
    acc[matiere.niveau].push(matiere)
    return acc
  }, {} as Record<string, Matiere[]>)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Message de notification */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
          message.type === 'error' 
            ? 'bg-red-50 text-red-600 border border-red-200' 
            : 'bg-green-50 text-green-600 border border-green-200'
        }`}>
          {message.type === 'error' ? (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <Check className="w-4 h-4 flex-shrink-0" />
          )}
          {message.text}
        </div>
      )}

      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-7 h-7" />
            Gestion des matières
          </h1>
          <p className="text-gray-600 mt-1">
            {matieres.length} matière{matieres.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={loadMatieres} 
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
            title="Actualiser la liste"
          >
            <RefreshCw className="w-4 h-4" /> Actualiser
          </button>
          <button
            onClick={() => { 
              setNewMatiere({ nom: '', niveau: '7ème', description: '' }); 
              setError(''); 
              setShowAddModal(true) 
            }}
            className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Ajouter une matière
          </button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="bg-white rounded-2xl border border-gray-200 mb-6">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : Object.keys(matieresParNiveau).length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg font-medium mb-1">Aucune matière trouvée</p>
            <p className="text-gray-400 text-sm mb-6">
              {search ? 'Essayez un autre terme de recherche' : 'Ajoutez votre première matière'}
            </p>
            {!search && (
              <button 
                onClick={() => setShowAddModal(true)} 
                className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium text-sm"
              >
                <Plus className="w-4 h-4" /> Ajouter une matière
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(matieresParNiveau).map(([niveau, matieresList]) => (
            <div key={niveau}>
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-600" /> Niveau {niveau}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {matieresList.length} matière{matieresList.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="divide-y divide-gray-100">
                  {matieresList.map((matiere) => (
                    <div 
                      key={matiere.id} 
                      className="p-4 hover:bg-gray-50/50 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {matiere.nom}
                          </p>
                          {matiere.description ? (
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                              {matiere.description}
                            </p>
                          ) : (
                            <p className="text-xs text-gray-400 italic mt-0.5">
                              Aucune description
                            </p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-500">
                            Créée le {new Date(matiere.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => openEditModal(matiere)} 
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
                            title="Modifier"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openDeleteModal(matiere)} 
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Ajouter */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Plus className="w-5 h-5" /> Nouvelle matière
              </h2>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddMatiere} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-200">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={newMatiere.nom} 
                  onChange={(e) => setNewMatiere({ ...newMatiere, nom: e.target.value })} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Ex: Mathématiques"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Niveau <span className="text-red-500">*</span>
                </label>
                <select 
                  value={newMatiere.niveau} 
                  onChange={(e) => setNewMatiere({ ...newMatiere, niveau: e.target.value })} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="7ème">7ème année</option>
                  <option value="8ème">8ème année</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea 
                  value={newMatiere.description} 
                  onChange={(e) => setNewMatiere({ ...newMatiere, description: e.target.value })} 
                  rows={3} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
                  placeholder="Description optionnelle..."
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)} 
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={submitting || !newMatiere.nom.trim()} 
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Ajout...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" /> Ajouter
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Modifier */}
      {showEditModal && selectedMatiere && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Edit3 className="w-5 h-5" /> Modifier la matière
              </h2>
              <button 
                onClick={() => setShowEditModal(false)} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditMatiere} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-200">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={editMatiere.nom} 
                  onChange={(e) => setEditMatiere({ ...editMatiere, nom: e.target.value })} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Niveau <span className="text-red-500">*</span>
                </label>
                <select 
                  value={editMatiere.niveau} 
                  onChange={(e) => setEditMatiere({ ...editMatiere, niveau: e.target.value })} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="7ème">7ème année</option>
                  <option value="8ème">8ème année</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea 
                  value={editMatiere.description} 
                  onChange={(e) => setEditMatiere({ ...editMatiere, description: e.target.value })} 
                  rows={3} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)} 
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={submitting || !editMatiere.nom.trim()} 
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Modification...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> Enregistrer
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Supprimer */}
      {showDeleteModal && selectedMatiere && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Supprimer la matière ?</h3>
              <p className="text-sm text-gray-500 mb-2">
                <span className="font-medium text-gray-700">"{selectedMatiere.nom}"</span> ({selectedMatiere.niveau})
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Cette action est irréversible. Les associations avec les précepteurs seront également supprimées.
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowDeleteModal(false)} 
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleDeleteMatiere} 
                  disabled={deleting} 
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Suppression...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" /> Supprimer
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