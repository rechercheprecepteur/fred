

// components/UploadDocumentModal.tsx
'use client'

import { useState, useRef } from 'react'
import { uploadDocument } from '@/actions/documents'
import { PiUploadSimple, PiFilePdf, PiFileImage, PiFile, PiCheckCircle, PiWarningCircle, PiSpinner, PiX } from 'react-icons/pi'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function UploadDocumentModal({ isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validation taille (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Le fichier est trop volumineux. Maximum : 10MB')
        return
      }
      
      // Validation type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ]
      
      if (!allowedTypes.includes(file.type)) {
        setError('Type de fichier non accepté. Utilisez PDF, JPG, PNG, DOC ou DOCX')
        return
      }
      
      setSelectedFile(file)
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement)
      const result = await uploadDocument(formData)

      if (result.success) {
        setSuccess('✅ Document ajouté avec succès !')
        formRef.current?.reset()
        setSelectedFile(null)
        onSuccess()
        setTimeout(() => {
          setSuccess('')
          onClose()
        }, 1500)
      } else {
        setError(result.error || 'Erreur lors de l\'upload')
      }
    } catch (err) {
      console.error('❌ Erreur upload:', err)
      setError('Une erreur est survenue lors de l\'upload')
    } finally {
      setLoading(false)
    }
  }

  const getFileIcon = (file: File | null) => {
    if (!file) return <PiFile className="w-12 h-12 text-gray-400" />
    if (file.type.includes('pdf')) return <PiFilePdf className="w-12 h-12 text-red-500" />
    if (file.type.includes('image')) return <PiFileImage className="w-12 h-12 text-blue-500" />
    return <PiFile className="w-12 h-12 text-gray-400" />
  }

  const getFileTypeName = (file: File | null) => {
    if (!file) return ''
    if (file.type.includes('pdf')) return 'PDF'
    if (file.type.includes('image')) return 'Image'
    if (file.type.includes('word')) return 'Document Word'
    return file.type.split('/')[1]?.toUpperCase() || 'Fichier'
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' o'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko'
    return (bytes / (1024 * 1024)).toFixed(1) + ' Mo'
  }

  const handleClose = () => {
    setError('')
    setSuccess('')
    setSelectedFile(null)
    formRef.current?.reset()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
              <PiUploadSimple className="w-5 h-5" />
              Ajouter un document
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">CV, diplômes, certifications...</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <PiX className="w-5 h-5" />
          </button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-sm flex items-center gap-2">
              <PiWarningCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-100 text-green-600 p-3 rounded-xl text-sm flex items-center gap-2">
              <PiCheckCircle className="w-5 h-5 flex-shrink-0" />
              {success}
            </div>
          )}

          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Titre du document <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              name="titre" 
              required 
              placeholder="Ex: Mon CV, Diplôme de licence..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm"
            />
          </div>

          {/* Type de document */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Type de document <span className="text-red-500">*</span>
            </label>
            <select 
              name="type_document" 
              required 
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm bg-white"
            >
              <option value="">Sélectionner un type...</option>
              <option value="cv">📄 CV</option>
              <option value="diplome">🎓 Diplôme</option>
              <option value="certification">🏅 Certification</option>
              <option value="carte_identite">🪪 Carte d'identité</option>
              <option value="autre">📁 Autre</option>
            </select>
          </div>

          {/* Upload de fichier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Fichier <span className="text-red-500">*</span>
            </label>
            
            <div 
              className={`relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer ${
                selectedFile 
                  ? 'border-green-300 bg-green-50/30' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              {selectedFile ? (
                <div className="flex items-center gap-4">
                  {getFileIcon(selectedFile)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {getFileTypeName(selectedFile)} • {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedFile(null)
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <PiX className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <PiUploadSimple className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-700">Cliquez pour sélectionner un fichier</p>
                  <p className="text-xs text-gray-500 mt-1">ou glissez-déposez ici</p>
                  <p className="text-xs text-gray-400 mt-3">PDF, JPG, PNG, DOC, DOCX • Max 10 Mo</p>
                </div>
              )}
            </div>
            
            <input 
              ref={fileInputRef}
              type="file" 
              name="fichier" 
              required 
              className="hidden" 
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileChange}
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !selectedFile}
              className="flex-1 bg-black text-white py-2.5 rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <PiSpinner className="w-5 h-5 animate-spin" />
                  Upload en cours...
                </>
              ) : (
                <>
                  <PiUploadSimple className="w-5 h-5" />
                  Ajouter le document
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}