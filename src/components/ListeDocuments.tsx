// app/components/ListeDocuments.tsx
'use client'

import { useEffect, useState } from 'react'
import { getDocuments, deleteDocument } from '@/actions/documents'
import { useAuth } from '@/context/AuthContext'
import { 
  PiFilePdf, 
  PiFileImage, 
  PiFile, 
  PiTrash, 
  PiEye, 
  PiCheckCircle, 
  PiClock, 
  PiXCircle,
  PiFiles,
  PiPlus,
  PiWarning
} from 'react-icons/pi'
import UploadDocumentModal from './UploadDocumentModal'

interface Document {
  id: number
  titre: string
  type_document: string
  fichier_url: string
  format_fichier: string
  statut_verification: string
  created_at: string
}

export default function ListeDocuments({ refresh, onRefresh }: { refresh: number; onRefresh: () => void }) {
  const { isAuthenticated } = useAuth()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)

  const loadDocuments = async () => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    
    try {
      // ✅ Plus besoin de token - récupéré automatiquement côté serveur via les cookies
      const { documents: docs, error: loadError } = await getDocuments()
      
      if (loadError) {
        setError(loadError)
      } else {
        setDocuments(docs || [])
      }
    } catch (err) {
      console.error('Erreur chargement documents:', err)
      setError('Erreur lors du chargement des documents')
    }
    
    setLoading(false)
  }

  useEffect(() => {
    loadDocuments()
  }, [refresh, isAuthenticated])

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce document ?')) return

    setDeleting(id)
    setError('')
    
    try {
      // ✅ Plus besoin de token
      const result = await deleteDocument(id)
      
      if (result.error) {
        setError(result.error)
      } else {
        await loadDocuments()
        onRefresh()
      }
    } catch (err) {
      console.error('Erreur suppression:', err)
      setError('Erreur lors de la suppression')
    }
    
    setDeleting(null)
  }

  const getFileIcon = (format: string) => {
    if (format?.includes('pdf')) return <PiFilePdf className="w-8 h-8 text-red-500" />
    if (format?.includes('image')) return <PiFileImage className="w-8 h-8 text-blue-500" />
    return <PiFile className="w-8 h-8 text-gray-400" />
  }

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'verifie':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <PiCheckCircle className="w-3.5 h-3.5" />
            Vérifié
          </span>
        )
      case 'rejete':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            <PiXCircle className="w-3.5 h-3.5" />
            Rejeté
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
            <PiClock className="w-3.5 h-3.5" />
            En attente
          </span>
        )
    }
  }

  const getTypeLabel = (type: string) => {
    const types: Record<string, { icon: string; label: string }> = {
      cv: { icon: '📄', label: 'CV' },
      diplome: { icon: '🎓', label: 'Diplôme' },
      certification: { icon: '🏅', label: 'Certification' },
      carte_identite: { icon: '🪪', label: "Carte d'identité" },
      autre: { icon: '📁', label: 'Autre' }
    }
    return types[type] || { icon: '📄', label: type }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // ✅ Utiliser isAuthenticated au lieu de token
  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <PiWarning className="w-16 h-16 text-yellow-400 mb-4" />
          <p className="text-gray-500 text-lg font-medium mb-1">Non connecté</p>
          <p className="text-gray-400 text-sm">Connectez-vous pour voir vos documents</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* En-tête */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <PiFiles className="w-5 h-5 text-gray-700" />
              Mes documents
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">{documents.length} document{documents.length > 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium"
          >
            <PiPlus className="w-4 h-4" />
            Ajouter
          </button>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-100">
            <p className="text-sm text-red-600 flex items-center gap-2">
              <PiWarning className="w-4 h-4" />
              {error}
            </p>
          </div>
        )}

        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <PiFiles className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg font-medium mb-1">Aucun document</p>
            <p className="text-gray-400 text-sm mb-6">Ajoutez vos diplômes, CV ou certifications</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium text-sm"
            >
              <PiPlus className="w-4 h-4" />
              Ajouter un document
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {documents.map((doc) => {
              const typeInfo = getTypeLabel(doc.type_document)
              
              return (
                <div 
                  key={doc.id} 
                  className="p-4 hover:bg-gray-50/50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {getFileIcon(doc.format_fichier)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 truncate">{doc.titre}</p>
                        {getStatusBadge(doc.statut_verification)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{typeInfo.icon} {typeInfo.label}</span>
                        <span>•</span>
                        <span>{formatDate(doc.created_at)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href={doc.fichier_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Voir le document"
                      >
                        <PiEye className="w-5 h-5" />
                      </a>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        disabled={deleting === doc.id}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                        title="Supprimer"
                      >
                        {deleting === doc.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <PiTrash className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ✅ Plus besoin de passer le token */}
      {showUploadModal && (
        <UploadDocumentModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            loadDocuments()
            onRefresh()
          }}
        />
      )}
    </>
  )
}