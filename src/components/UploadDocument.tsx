// // app/components/UploadDocument.tsx
// 'use client'

// import { useState, useRef } from 'react'
// import { uploadDocument } from '@/actions/documents'

// interface Props {
//   onSuccess: () => void
// }

// export default function UploadDocument({ onSuccess }: Props) {
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const formRef = useRef<HTMLFormElement>(null)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setError('')
//     setSuccess('')

//     const formData = new FormData(e.currentTarget as HTMLFormElement)
//     const result = await uploadDocument(formData)

//     if (result.error) {
//       setError(result.error)
//     } else {
//       setSuccess('Document ajouté !')
//       formRef.current?.reset()
//       onSuccess()
//     }
//     setLoading(false)
//   }

//   return (
//     <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg border">
//       <h3 className="font-semibold text-lg">Ajouter un document</h3>

//       {error && <div className="bg-red-50 text-red-500 p-2 rounded text-sm">{error}</div>}
//       {success && <div className="bg-green-50 text-green-600 p-2 rounded text-sm">{success}</div>}

//       <div>
//         <label className="block text-sm font-medium mb-1">Titre</label>
//         <input type="text" name="titre" required className="w-full px-3 py-2 border rounded-lg" />
//       </div>

//       <div>
//         <label className="block text-sm font-medium mb-1">Type de document</label>
//         <select name="type_document" required className="w-full px-3 py-2 border rounded-lg">
//           <option value="">Sélectionner...</option>
//           <option value="cv">CV</option>
//           <option value="diplome">Diplôme</option>
//           <option value="certification">Certification</option>
//           <option value="carte_identite">Carte d'identité</option>
//           <option value="autre">Autre</option>
//         </select>
//       </div>

//       <div>
//         <label className="block text-sm font-medium mb-1">Fichier</label>
//         <input type="file" name="fichier" required className="w-full" accept=".pdf,.jpg,.jpeg,.png" />
//       </div>

//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
//       >
//         {loading ? 'Upload...' : 'Ajouter'}
//       </button>
//     </form>
//   )
// }
// app/components/UploadDocument.tsx
'use client'

import { useState, useRef } from 'react'
import { uploadDocument } from '@/actions/documents'
import { PiUploadSimple, PiFilePdf, PiFileImage, PiFile, PiCheckCircle, PiWarningCircle, PiSpinner, PiPlus } from 'react-icons/pi'

interface Props {
  onSuccess: () => void
}

export default function UploadDocument({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
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

      if (!result) {
        setError('Aucune réponse du serveur')
      } else if (result.error) {
        setError(result.error)
      } else {
        setSuccess('Document ajouté avec succès !')
        formRef.current?.reset()
        setSelectedFile(null)
        onSuccess()
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err) {
      setError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const getFileIcon = (file: File | null) => {
    if (!file) return <PiFile className="w-10 h-10 text-gray-400" />
    if (file.type.includes('pdf')) return <PiFilePdf className="w-10 h-10 text-red-500" />
    if (file.type.includes('image')) return <PiFileImage className="w-10 h-10 text-blue-500" />
    return <PiFile className="w-10 h-10 text-gray-400" />
  }

  const getFileTypeName = (file: File | null) => {
    if (!file) return ''
    if (file.type.includes('pdf')) return 'PDF'
    if (file.type.includes('image')) return 'Image'
    return file.type.split('/')[1]?.toUpperCase() || 'Fichier'
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' o'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko'
    return (bytes / (1024 * 1024)).toFixed(1) + ' Mo'
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* En-tête */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <PiPlus className="w-5 h-5 text-gray-700" />
          Ajouter un document
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">CV, diplômes, certifications...</p>
      </div>

      <div className="p-6 space-y-5">
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
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Titre du document</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Type de document</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Fichier</label>
          
          {/* Zone de drop */}
          <div 
            className={`relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer ${
              dragOver 
                ? 'border-black bg-gray-50' 
                : selectedFile 
                  ? 'border-green-300 bg-green-50/30' 
                  : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(false)
              const file = e.dataTransfer.files?.[0]
              if (file && fileInputRef.current) {
                const dataTransfer = new DataTransfer()
                dataTransfer.items.add(file)
                fileInputRef.current.files = dataTransfer.files
                setSelectedFile(file)
              }
            }}
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
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="text-center">
                <PiUploadSimple className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700">Glissez-déposez votre fichier ici</p>
                <p className="text-xs text-gray-500 mt-1">ou cliquez pour parcourir</p>
                <p className="text-xs text-gray-400 mt-3">PDF, JPG, PNG • Max 10 Mo</p>
              </div>
            )}
          </div>
          
          <input 
            ref={fileInputRef}
            type="file" 
            name="fichier" 
            required 
            className="hidden" 
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />
        </div>

        {/* Bouton submit */}
        <button
          type="submit"
          disabled={loading || !selectedFile}
          className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm flex items-center justify-center gap-2"
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
  )
}