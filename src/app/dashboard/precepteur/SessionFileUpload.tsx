// // src/components/SessionFileUpload.tsx
// 'use client'

// import { useState, useEffect } from 'react'
// import { supabase } from '@/lib/supabase'
// import { Upload, File, Image, FileText, Video, X, Download, Trash2 } from 'lucide-react'

// type SessionFile = {
//   id: number
//   session_id: number
//   file_name: string
//   file_path: string
//   file_type: string
//   file_size: number | null
//   uploaded_by: string
//   created_at: string
// }

// interface SessionFileUploadProps {
//   sessionId: number
//   uploadedBy: 'precepteur' | 'parent'
// }

// export default function SessionFileUpload({ sessionId, uploadedBy }: SessionFileUploadProps) {
//   const [files, setFiles] = useState<SessionFile[]>([])
//   const [uploading, setUploading] = useState(false)
//   const [loading, setLoading] = useState(true)

//   // Charger les fichiers existants
//   useEffect(() => {
//     loadFiles()
//   }, [sessionId])

//   const loadFiles = async () => {
//     const { data } = await supabase
//       .from('session_files')
//       .select('*')
//       .eq('session_id', sessionId)
//       .order('created_at', { ascending: false })

//     if (data) setFiles(data)
//     setLoading(false)
//   }

//   // Upload de fichier
//   const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (!file) return

//     setUploading(true)

//     try {
//       // Upload vers Supabase Storage
//       const filePath = `session-${sessionId}/${Date.now()}-${file.name}`
//       const { error: uploadError } = await supabase.storage
//         .from('session-files')
//         .upload(filePath, file)

//       if (uploadError) throw uploadError

//       // Déterminer le type de fichier
//       let fileType = 'other'
//       if (file.type.startsWith('image/')) fileType = 'image'
//       else if (file.type === 'application/pdf') fileType = 'pdf'
//       else if (file.type.startsWith('video/')) fileType = 'video'
//       else if (file.type.includes('document') || file.type.includes('word') || file.type.includes('text')) fileType = 'document'

//       // Sauvegarder en base
//       const { error: dbError } = await supabase
//         .from('session_files')
//         .insert({
//           session_id: sessionId,
//           file_name: file.name,
//           file_path: filePath,
//           file_type: fileType,
//           file_size: file.size,
//           uploaded_by: uploadedBy
//         })

//       if (dbError) throw dbError

//       await loadFiles()
//     } catch (error) {
//       console.error('Erreur upload:', error)
//     }

//     setUploading(false)
//     e.target.value = ''
//   }

//   // Télécharger un fichier
//   const handleDownload = async (filePath: string, fileName: string) => {
//     const { data } = await supabase.storage
//       .from('session-files')
//       .download(filePath)

//     if (data) {
//       const url = URL.createObjectURL(data)
//       const a = document.createElement('a')
//       a.href = url
//       a.download = fileName
//       a.click()
//       URL.revokeObjectURL(url)
//     }
//   }

//   // Supprimer un fichier
//   const handleDelete = async (fileId: number, filePath: string) => {
//     const { error: storageError } = await supabase.storage
//       .from('session-files')
//       .remove([filePath])

//     if (storageError) {
//       console.error('Erreur suppression storage:', storageError)
//       return
//     }

//     const { error: dbError } = await supabase
//       .from('session_files')
//       .delete()
//       .eq('id', fileId)

//     if (dbError) {
//       console.error('Erreur suppression DB:', dbError)
//       return
//     }

//     await loadFiles()
//   }

//   // Icône selon le type
//   const getFileIcon = (fileType: string) => {
//     switch (fileType) {
//       case 'image': return <Image className="w-4 h-4" />
//       case 'pdf': return <FileText className="w-4 h-4" />
//       case 'video': return <Video className="w-4 h-4" />
//       case 'document': return <FileText className="w-4 h-4" />
//       default: return <File className="w-4 h-4" />
//     }
//   }

//   // Couleur selon le type
//   const getFileColor = (fileType: string) => {
//     switch (fileType) {
//       case 'image': return 'bg-blue-100 text-blue-700'
//       case 'pdf': return 'bg-red-100 text-red-700'
//       case 'video': return 'bg-purple-100 text-purple-700'
//       case 'document': return 'bg-green-100 text-green-700'
//       default: return 'bg-gray-100 text-gray-700'
//     }
//   }

//   // Formater la taille
//   const formatSize = (bytes: number | null) => {
//     if (!bytes) return ''
//     if (bytes < 1024) return `${bytes} B`
//     if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
//     return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
//   }

//   return (
//     <div className="space-y-3">
//       <div className="flex items-center justify-between">
//         <h3 className="text-sm font-medium text-gray-700">Fichiers ({files.length})</h3>
//         <label className="cursor-pointer">
//           <input
//             type="file"
//             onChange={handleUpload}
//             className="hidden"
//             disabled={uploading}
//             accept="image/*,.pdf,.doc,.docx,.txt,.mp4,.avi,.mov"
//           />
//           <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white text-xs rounded-lg hover:bg-gray-800 transition-colors">
//             {uploading ? (
//               <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
//             ) : (
//               <Upload className="w-3 h-3" />
//             )}
//             Ajouter
//           </span>
//         </label>
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-4">
//           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400" />
//         </div>
//       ) : files.length === 0 ? (
//         <p className="text-xs text-gray-400 text-center py-4">Aucun fichier</p>
//       ) : (
//         <div className="space-y-1.5">
//           {files.map((file) => (
//             <div
//               key={file.id}
//               className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
//             >
//               <div className={`p-1.5 rounded-lg ${getFileColor(file.file_type)}`}>
//                 {getFileIcon(file.file_type)}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-xs font-medium text-gray-700 truncate">{file.file_name}</p>
//                 <p className="text-xs text-gray-400">
//                   {formatSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString('fr-FR')}
//                 </p>
//               </div>
//               <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                 <button
//                   onClick={() => handleDownload(file.file_path, file.file_name)}
//                   className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
//                   title="Télécharger"
//                 >
//                   <Download className="w-3.5 h-3.5" />
//                 </button>
//                 <button
//                   onClick={() => handleDelete(file.id, file.file_path)}
//                   className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
//                   title="Supprimer"
//                 >
//                   <Trash2 className="w-3.5 h-3.5" />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// components/SessionFileUpload.tsx
'use client'

import { useState, useEffect } from 'react'
import { getSessionFiles, uploadSessionFile, downloadSessionFile, deleteSessionFile } from '@/lib/session-api'
import { Upload, File, Image, FileText, Video, X, Download, Trash2 } from 'lucide-react'

type SessionFile = {
  id: number
  session_id: number
  file_name: string
  file_path: string
  file_url?: string
  file_type: string
  file_size: number | null
  uploaded_by: string
  created_at: string
}

interface SessionFileUploadProps {
  sessionId: number
  uploadedBy: 'precepteur' | 'parent'
}

export default function SessionFileUpload({ sessionId, uploadedBy }: SessionFileUploadProps) {
  const [files, setFiles] = useState<SessionFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  // ✅ Charger les fichiers via API Express
  useEffect(() => {
    loadFiles()
  }, [sessionId])

  const loadFiles = async () => {
    try {
      const data = await getSessionFiles(sessionId)
      setFiles(data.files || [])
    } catch (error) {
      console.error('Erreur chargement fichiers:', error)
    }
    setLoading(false)
  }

  // ✅ Upload via API Express
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      await uploadSessionFile(sessionId, file)
      await loadFiles()
    } catch (error) {
      console.error('Erreur upload:', error)
    }

    setUploading(false)
    e.target.value = ''
  }

  // ✅ Téléchargement via API Express
  const handleDownload = async (fileId: number, fileName: string) => {
    try {
      const blob = await downloadSessionFile(fileId)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erreur téléchargement:', error)
    }
  }

  // ✅ Suppression via API Express
  const handleDelete = async (fileId: number) => {
    try {
      await deleteSessionFile(fileId)
      await loadFiles()
    } catch (error) {
      console.error('Erreur suppression:', error)
    }
  }

  // Icône selon le type
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image': return <Image className="w-4 h-4" />
      case 'pdf': return <FileText className="w-4 h-4" />
      case 'video': return <Video className="w-4 h-4" />
      case 'document': return <FileText className="w-4 h-4" />
      default: return <File className="w-4 h-4" />
    }
  }

  // Couleur selon le type
  const getFileColor = (fileType: string) => {
    switch (fileType) {
      case 'image': return 'bg-blue-100 text-blue-700'
      case 'pdf': return 'bg-red-100 text-red-700'
      case 'video': return 'bg-purple-100 text-purple-700'
      case 'document': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  // Formater la taille
  const formatSize = (bytes: number | null) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Fichiers ({files.length})</h3>
        <label className="cursor-pointer">
          <input
            type="file"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
            accept="image/*,.pdf,.doc,.docx,.txt,.mp4,.avi,.mov"
          />
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white text-xs rounded-lg hover:bg-gray-800 transition-colors">
            {uploading ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
            ) : (
              <Upload className="w-3 h-3" />
            )}
            Ajouter
          </span>
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400" />
        </div>
      ) : files.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4">Aucun fichier</p>
      ) : (
        <div className="space-y-1.5">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
            >
              <div className={`p-1.5 rounded-lg ${getFileColor(file.file_type)}`}>
                {getFileIcon(file.file_type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700 truncate">{file.file_name}</p>
                <p className="text-xs text-gray-400">
                  {formatSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDownload(file.id, file.file_name)}
                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                  title="Télécharger"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}