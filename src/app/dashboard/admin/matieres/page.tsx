// 'use client'

// import { useState, useEffect } from 'react'
// import { getMatieres, ajouterMatiere } from '@/actions/matieres'
// import { 
//   Plus, 
//   Search, 
//   X, 
//   BookOpen, 
//   GraduationCap,
//   Trash2,
//   Edit3,
//   Check,
//   AlertCircle,
//   Loader2
// } from 'lucide-react'

// type Matiere = {
//   id: number
//   nom: string
//   niveau: string
//   description: string | null
//   created_at: string
// }

// export default function AdminMatieresPage() {
//   const [matieres, setMatieres] = useState<Matiere[]>([])
//   const [loading, setLoading] = useState(true)
//   const [search, setSearch] = useState('')
//   const [showAddModal, setShowAddModal] = useState(false)
//   const [message, setMessage] = useState('')
//   const [error, setError] = useState('')

//   // Formulaire nouvelle matière
//   const [newMatiere, setNewMatiere] = useState({
//     nom: '',
//     niveau: '7ème',
//     description: ''
//   })
//   const [submitting, setSubmitting] = useState(false)

//   useEffect(() => {
//     loadMatieres()
//   }, [search])

//   const loadMatieres = async () => {
//     setLoading(true)
//     const { matieres: data } = await getMatieres(search)
//     setMatieres(data || [])
//     setLoading(false)
//   }

//   const handleAddMatiere = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')
//     setSubmitting(true)

//     if (!newMatiere.nom.trim()) {
//       setError('Le nom de la matière est requis')
//       setSubmitting(false)
//       return
//     }

//     const result = await ajouterMatiere({
//       nom: newMatiere.nom.trim(),
//       niveau: newMatiere.niveau,
//       description: newMatiere.description.trim() || undefined
//     })

//     if (result.error) {
//       setError(result.error)
//     } else {
//       setShowAddModal(false)
//       setNewMatiere({ nom: '', niveau: '7ème', description: '' })
//       setMessage('Matière ajoutée avec succès')
//       setTimeout(() => setMessage(''), 3000)
//       loadMatieres()
//     }
    
//     setSubmitting(false)
//   }

//   // Grouper par niveau
//   const matieresParNiveau = matieres.reduce((acc, matiere) => {
//     if (!acc[matiere.niveau]) acc[matiere.niveau] = []
//     acc[matiere.niveau].push(matiere)
//     return acc
//   }, {} as Record<string, Matiere[]>)

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       {/* En-tête */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <BookOpen className="w-6 h-6" />
//             Gestion des matières
//           </h1>
//           <p className="text-gray-600 mt-1">
//             {matieres.length} matière{matieres.length > 1 ? 's' : ''} disponible{matieres.length > 1 ? 's' : ''}
//           </p>
//         </div>
//         <button
//           onClick={() => {
//             setNewMatiere({ nom: '', niveau: '7ème', description: '' })
//             setError('')
//             setShowAddModal(true)
//           }}
//           className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
//         >
//           <Plus className="w-4 h-4" />
//           Ajouter une matière
//         </button>
//       </div>

//       {/* Message */}
//       {message && (
//         <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-2">
//           <Check className="w-5 h-5" /> {message}
//         </div>
//       )}

//       {/* Recherche */}
//       <div className="relative mb-6">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//         <input
//           type="text"
//           placeholder="Rechercher par nom..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
//         />
//       </div>

//       {/* Liste des matières */}
//       {loading ? (
//         <div className="flex justify-center py-20">
//           <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
//         </div>
//       ) : Object.keys(matieresParNiveau).length === 0 ? (
//         <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
//           <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//           <p className="text-gray-500 text-lg mb-2">Aucune matière trouvée</p>
//           <p className="text-gray-400 text-sm mb-4">
//             {search ? 'Essayez avec un autre terme de recherche' : 'Commencez par ajouter votre première matière'}
//           </p>
//           {!search && (
//             <button
//               onClick={() => setShowAddModal(true)}
//               className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
//             >
//               <Plus className="w-4 h-4" /> Ajouter une matière
//             </button>
//           )}
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {Object.entries(matieresParNiveau).map(([niveau, matieresList]) => (
//             <div key={niveau} className="b">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                 <GraduationCap className="w-5 h-5 text-blue-600" />
//                 Niveau {niveau}
//                 <span className="text-sm font-normal text-gray-500">
//                   ({matieresList.length} matière{matieresList.length > 1 ? 's' : ''})
//                 </span>
//               </h2>
              
//               <div className="grid bg grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {matieresList.map((matiere) => (
//                   <div
//                     key={matiere.id}
//                     className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group"
//                   >
//                     <div className="flex items-start justify-between mb-2">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
//                           <BookOpen className="w-5 h-5 text-blue-600" />
//                         </div>
//                         <div>
//                           <h3 className="font-semibold text-gray-900">{matiere.nom}</h3>
//                           <p className="text-xs text-gray-500">ID: {matiere.id}</p>
//                         </div>
//                       </div>
//                     </div>
                    
//                     {matiere.description && (
//                       <p className="text-sm text-gray-600 mt-2 line-clamp-2">
//                         {matiere.description}
//                       </p>
//                     )}
                    
//                     {!matiere.description && (
//                       <p className="text-sm text-gray-400 italic mt-2">
//                         Aucune description
//                       </p>
//                     )}

//                     <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
//                       <span className="text-xs text-gray-500">
//                         Créée le {new Date(matiere.created_at).toLocaleDateString('fr-FR')}
//                       </span>
//                       <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
//                           <Edit3 className="w-4 h-4" />
//                         </button>
//                         <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* MODAL - Ajouter une matière */}
//       {showAddModal && (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//           <div 
//             className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
//             onClick={() => setShowAddModal(false)}
//           />

//           <div className="flex items-center justify-center min-h-screen p-4">
//             <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
//               {/* Header */}
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                   <Plus className="w-5 h-5" /> Nouvelle matière
//                 </h2>
//                 <button
//                   onClick={() => setShowAddModal(false)}
//                   className="text-gray-400 hover:text-gray-600 transition-colors"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               {/* Formulaire */}
//               <form onSubmit={handleAddMatiere} className="space-y-4">
//                 {error && (
//                   <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm flex items-center gap-2">
//                     <AlertCircle className="w-4 h-4" /> {error}
//                   </div>
//                 )}

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Nom de la matière *
//                   </label>
//                   <input
//                     type="text"
//                     value={newMatiere.nom}
//                     onChange={(e) => setNewMatiere({ ...newMatiere, nom: e.target.value })}
//                     required
//                     placeholder="Ex: Mathématiques, Français, Physique..."
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Niveau *
//                   </label>
//                   <select
//                     value={newMatiere.niveau}
//                     onChange={(e) => setNewMatiere({ ...newMatiere, niveau: e.target.value })}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//                   >
//                     <option value="7ème">7ème année (1ère secondaire)</option>
//                     <option value="8ème">8ème année (2ème secondaire)</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Description
//                   </label>
//                   <textarea
//                     value={newMatiere.description}
//                     onChange={(e) => setNewMatiere({ ...newMatiere, description: e.target.value })}
//                     rows={3}
//                     placeholder="Description optionnelle de la matière..."
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//                   />
//                 </div>

//                 {/* Boutons */}
//                 <div className="flex gap-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowAddModal(false)}
//                     className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
//                   >
//                     <X className="w-4 h-4" /> Annuler
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={submitting || !newMatiere.nom.trim()}
//                     className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
//                   >
//                     {submitting ? (
//                       <>
//                         <Loader2 className="w-4 h-4 animate-spin" />
//                         Ajout...
//                       </>
//                     ) : (
//                       <>
//                         <Plus className="w-4 h-4" /> Ajouter la matière
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


// app/admin/matieres/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { getMatieres, ajouterMatiere } from '@/actions/matieres'
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
import { PiBookOpen, PiPlus, PiTrash } from 'react-icons/pi'

type Matiere = {
  id: number
  nom: string
  niveau: string
  description: string | null
  created_at: string
}

export default function AdminMatieresPage() {
  const [matieres, setMatieres] = useState<Matiere[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Formulaire nouvelle matière
  const [newMatiere, setNewMatiere] = useState({
    nom: '',
    niveau: '7ème',
    description: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadMatieres()
  }, [search])

  const loadMatieres = async () => {
    setLoading(true)
    const { matieres: data } = await getMatieres(search)
    setMatieres(data || [])
    setLoading(false)
  }

  const handleAddMatiere = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    if (!newMatiere.nom.trim()) {
      setError('Le nom de la matière est requis')
      setSubmitting(false)
      return
    }

    const result = await ajouterMatiere({
      nom: newMatiere.nom.trim(),
      niveau: newMatiere.niveau,
      description: newMatiere.description.trim() || undefined
    })

    if (result.error) {
      setError(result.error)
    } else {
      setShowAddModal(false)
      setNewMatiere({ nom: '', niveau: '7ème', description: '' })
      setMessage('Matière ajoutée avec succès')
      setTimeout(() => setMessage(''), 3000)
      loadMatieres()
    }
    
    setSubmitting(false)
  }

  // Grouper par niveau
  const matieresParNiveau = matieres.reduce((acc, matiere) => {
    if (!acc[matiere.niveau]) acc[matiere.niveau] = []
    acc[matiere.niveau].push(matiere)
    return acc
  }, {} as Record<string, Matiere[]>)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Message toast */}
      {message && (
        <div className="mb-4 p-3 rounded-lg text-sm flex items-center gap-2 bg-green-50 text-green-600">
          <Check className="w-4 h-4 flex-shrink-0" />
          {message}
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
            {matieres.length} matière{matieres.length > 1 ? 's' : ''} disponible{matieres.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadMatieres}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Actualiser
          </button>
          <button
            onClick={() => {
              setNewMatiere({ nom: '', niveau: '7ème', description: '' })
              setError('')
              setShowAddModal(true)
            }}
            className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter une matière
          </button>
        </div>
      </div>

      {/* Recherche */}
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

      {/* Liste des matières */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : Object.keys(matieresParNiveau).length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <PiBookOpen className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg font-medium mb-1">Aucune matière trouvée</p>
            <p className="text-gray-400 text-sm mb-6">
              {search ? 'Essayez avec un autre terme de recherche' : 'Commencez par ajouter votre première matière'}
            </p>
            {!search && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium text-sm"
              >
                <PiPlus className="w-4 h-4" />
                Ajouter une matière
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(matieresParNiveau).map(([niveau, matieresList]) => (
            <div key={niveau}>
              {/* En-tête du niveau */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                      Niveau {niveau}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {matieresList.length} matière{matieresList.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Liste des matières */}
                <div className="divide-y divide-gray-100">
                  {matieresList.map((matiere) => (
                    <div 
                      key={matiere.id} 
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
                          {matiere.description ? (
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{matiere.description}</p>
                          ) : (
                            <p className="text-xs text-gray-400 italic mt-0.5">Aucune description</p>
                          )}
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-500">
                            Créée le {new Date(matiere.created_at).toLocaleDateString('fr-FR', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Modifier"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Supprimer"
                          >
                            <PiTrash className="w-5 h-5" />
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

      {/* MODAL - Ajouter une matière */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Nouvelle matière
              </h2>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMatiere} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la matière *
                </label>
                <input
                  type="text"
                  value={newMatiere.nom}
                  onChange={(e) => setNewMatiere({ ...newMatiere, nom: e.target.value })}
                  required
                  placeholder="Ex: Mathématiques, Français, Physique..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Niveau *
                </label>
                <select
                  value={newMatiere.niveau}
                  onChange={(e) => setNewMatiere({ ...newMatiere, niveau: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="7ème">7ème année (1ère secondaire)</option>
                  <option value="8ème">8ème année (2ème secondaire)</option>
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
                  placeholder="Description optionnelle de la matière..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Ajout...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Ajouter la matière
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}