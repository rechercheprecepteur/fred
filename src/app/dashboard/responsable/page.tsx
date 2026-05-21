

// app/dashboard/responsable_pedagogique/page.tsx
'use client'
import { 
  PiFilePdf, 
  PiFileImage, 
  PiFileText, 
  PiFile,
  PiEye,
  PiCheckCircle,
  PiXCircle,
  PiClock,
  PiDownloadSimple
} from 'react-icons/pi'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import {
  getPrecepteursForResponsable,
  getStatistiquesResponsable,
  verifyPrecepteur,
  rejectPrecepteur,
  verifyDocument,
  rejectDocument,
  type PrecepteurAvecInfos,
  type StatistiquesResponsable
} from '@/actions/responsable'
import {
  User,
  Check,
  X,
  Clock,
  FileText,
  BookOpen,
  Eye,
  Search,
  Users,
  RefreshCw,
  ExternalLink,
  Calendar,
  MapPin,
  Phone,
  Award,
  GraduationCap,
  AlertCircle
} from 'lucide-react'
import Loader from '@/components/Loader'

// ============ MODAL DE DÉTAIL ============
// function PrecepteurDetailModal({
//   precepteur,
//   isOpen,
//   onClose,
//   onVerify,
//   onReject,
//   onVerifyDocument,
//   onRejectDocument
// }: {
//   precepteur: PrecepteurAvecInfos | null
//   isOpen: boolean
//   onClose: () => void
//   onVerify: (id: number) => Promise<void>
//   onReject: (id: number) => Promise<void>
//   onVerifyDocument: (docId: number) => Promise<void>
//   onRejectDocument: (docId: number) => Promise<void>
// }) {
//   const [activeSection, setActiveSection] = useState<'info' | 'documents' | 'matieres'>('info')
//   const [actionLoading, setActionLoading] = useState(false)

//   if (!isOpen || !precepteur) return null

//   const statutConfig = {
//     verifie: { bg: 'bg-emerald-50 text-emerald-700', icon: Check },
//     en_attente: { bg: 'bg-amber-50 text-amber-700', icon: Clock },
//     rejete: { bg: 'bg-red-50 text-red-700', icon: X }
//   }

//   const config = statutConfig[precepteur.statut_verification] || statutConfig.en_attente
//   const StatusIcon = config.icon

//   const handleAction = async (action: () => Promise<void>) => {
//     setActionLoading(true)
//     await action()
//     setActionLoading(false)
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
//         {/* En-tête */}
//         <div className="p-6 border-b flex items-start justify-between">
//           <div className="flex items-center gap-4">
//             {precepteur.user?.photo_profil ? (
//               <img src={precepteur.user.photo_profil} alt="" className="w-14 h-14 rounded-full object-cover" />
//             ) : (
//               <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
//                 <User className="w-7 h-7 text-gray-400" />
//               </div>
//             )}
//             <div>
//               <h2 className="text-xl font-semibold">{precepteur.user?.username || 'Anonyme'}</h2>
//               <p className="text-sm text-gray-500">{precepteur.user?.email || 'Email non disponible'}</p>
//               <div className="flex items-center gap-2 mt-1.5">
//                 <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg}`}>
//                   <StatusIcon className="w-3 h-3" />
//                   {precepteur.statut_verification.replace('_', ' ')}
//                 </span>
//                 <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                   precepteur.disponible ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
//                 }`}>
//                   {precepteur.disponible ? 'Disponible' : 'Indisponible'}
//                 </span>
//               </div>
//             </div>
//           </div>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Navigation */}
//         <div className="flex border-b px-6">
//           {(['info', 'documents', 'matieres'] as const).map((section) => (
//             <button
//               key={section}
//               onClick={() => setActiveSection(section)}
//               className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
//                 activeSection === section
//                   ? 'border-black text-black'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               {section === 'info' && 'Informations'}
//               {section === 'documents' && `Documents (${precepteur.documents?.length || 0})`}
//               {section === 'matieres' && `Matières (${precepteur.matieres?.length || 0})`}
//             </button>
//           ))}
//         </div>

//         {/* Contenu */}
//         <div className="flex-1 overflow-y-auto p-6">
//           {activeSection === 'info' && (
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="bg-gray-50 rounded-xl p-4">
//                   <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
//                     <Award className="w-3 h-3" /> Note
//                   </p>
//                   <p className="font-semibold text-lg">{precepteur.note_moyenne?.toFixed(1) || '0.0'}/5</p>
//                 </div>
//                 <div className="bg-gray-50 rounded-xl p-4">
//                   <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
//                     <Calendar className="w-3 h-3" /> Expérience
//                   </p>
//                   <p className="font-semibold text-lg">{precepteur.annees_experience} an(s)</p>
//                 </div>
//                 <div className="bg-gray-50 rounded-xl p-4">
//                   <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
//                     <MapPin className="w-3 h-3" /> Commune
//                   </p>
//                   <p className="font-medium">{precepteur.commune || 'Non spécifiée'}</p>
//                 </div>
//                 <div className="bg-gray-50 rounded-xl p-4">
//                   <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
//                     <MapPin className="w-3 h-3" /> Quartier
//                   </p>
//                   <p className="font-medium">{precepteur.quartier || 'Non spécifié'}</p>
//                 </div>
//                 <div className="bg-gray-50 rounded-xl p-4">
//                   <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
//                     <GraduationCap className="w-3 h-3" /> Diplôme
//                   </p>
//                   <p className="font-medium">{precepteur.diplome || 'Non spécifié'}</p>
//                 </div>
//                 <div className="bg-gray-50 rounded-xl p-4">
//                   <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
//                     <Phone className="w-3 h-3" /> Téléphone
//                   </p>
//                   <p className="font-medium">{precepteur.user?.telephone || 'Non renseigné'}</p>
//                 </div>
//               </div>

//               {precepteur.statut_verification !== 'verifie' && (
//                 <div className="flex gap-3 justify-end pt-4 border-t">
//                   <button
//                     onClick={() => handleAction(() => onReject(precepteur.id))}
//                     disabled={actionLoading}
//                     className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium disabled:opacity-50"
//                   >
//                     Rejeter
//                   </button>
//                   <button
//                     onClick={() => handleAction(() => onVerify(precepteur.id))}
//                     disabled={actionLoading}
//                     className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm font-medium disabled:opacity-50"
//                   >
//                     Valider le précepteur
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

// {activeSection === 'documents' && (
//   <div className="space-y-3">
//     {precepteur.documents?.length === 0 ? (
//       <div className="text-center py-12">
//         <PiFileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//         <p className="text-gray-500 font-medium">Aucun document</p>
//         <p className="text-gray-400 text-sm mt-1">Le précepteur n'a pas encore téléchargé de documents</p>
//       </div>
//     ) : (
//       precepteur.documents.map((doc) => {
//         // Déterminer l'icône et la couleur selon le format
//         const isPdf = doc.format_fichier?.toLowerCase().includes('pdf') || doc.fichier_url?.toLowerCase().endsWith('.pdf')
//         const isImage = doc.format_fichier?.toLowerCase().includes('image') || 
//           ['jpg', 'jpeg', 'png', 'gif', 'webp'].some(ext => doc.fichier_url?.toLowerCase().endsWith(`.${ext}`))
        
//         const fileIcon = isPdf 
//           ? <PiFilePdf className="w-10 h-10 text-red-500" />
//           : isImage 
//             ? <PiFileImage className="w-10 h-10 text-blue-500" />
//             : <PiFileText className="w-10 h-10 text-gray-400" />

//         // Statut du document
//         const statutDocConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
//           verifie: { 
//             bg: 'bg-emerald-50 border-emerald-200', 
//             text: 'text-emerald-700',
//             icon: <PiCheckCircle className="w-3.5 h-3.5" />
//           },
//           en_attente: { 
//             bg: 'bg-amber-50 border-amber-200', 
//             text: 'text-amber-700',
//             icon: <PiClock className="w-3.5 h-3.5" />
//           },
//           rejete: { 
//             bg: 'bg-red-50 border-red-200', 
//             text: 'text-red-700',
//             icon: <PiXCircle className="w-3.5 h-3.5" />
//           }
//         }
        
//         const docStatut = statutDocConfig[doc.statut_verification] || statutDocConfig.en_attente

//         // Type de document lisible
//         const typeLabels: Record<string, string> = {
//           cv: 'CV',
//           diplome: 'Diplôme',
//           certification: 'Certification',
//           carte_identite: "Carte d'identité",
//           autre: 'Autre'
//         }

//         return (
//           <div key={doc.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-all group">
//             <div className="flex items-center gap-4">
//               {/* Icône du fichier */}
//               <div className="flex-shrink-0">
//                 {fileIcon}
//               </div>

//               {/* Infos */}
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 mb-1">
//                   <p className="font-medium text-sm text-gray-900 truncate">{doc.titre}</p>
//                   <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${docStatut.bg} ${docStatut.text}`}>
//                     {docStatut.icon}
//                     {doc.statut_verification.replace('_', ' ')}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2 text-xs text-gray-400">
//                   <span>{typeLabels[doc.type_document] || doc.type_document}</span>
//                   <span>•</span>
//                   <span className="uppercase">{doc.format_fichier || 'PDF'}</span>
//                   <span>•</span>
//                   <span>{new Date(doc.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="flex items-center gap-1">
//                 <a 
//                   href={doc.fichier_url} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
//                   title="Voir le document"
//                 >
//                   <PiEye className="w-4 h-4" />
//                 </a>
//                 <a 
//                   href={doc.fichier_url} 
//                   download
//                   className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
//                   title="Télécharger"
//                 >
//                   <PiDownloadSimple className="w-4 h-4" />
//                 </a>
                
//                 {doc.statut_verification !== 'verifie' && (
//                   <button
//                     onClick={() => handleAction(() => onVerifyDocument(doc.id))}
//                     disabled={actionLoading}
//                     className="px-3 py-1.5 bg-black text-white text-xs rounded-lg hover:bg-gray-800 transition-colors font-medium ml-1"
//                   >
//                     Valider
//                   </button>
//                 )}
//                 {doc.statut_verification !== 'rejete' && doc.statut_verification !== 'verifie' && (
//                   <button
//                     onClick={() => handleAction(() => onRejectDocument(doc.id))}
//                     disabled={actionLoading}
//                     className="px-3 py-1.5 border border-red-200 text-red-600 text-xs rounded-lg hover:bg-red-50 transition-colors font-medium"
//                   >
//                     Rejeter
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         )
//       })
//     )}
//   </div>
// )}
//           {/* {activeSection === 'documents' && (
//             <div className="space-y-3">
//               {precepteur.documents?.length === 0 ? (
//                 <p className="text-gray-500 text-center py-8">Aucun document</p>
//               ) : (
//                 precepteur.documents.map((doc) => (
//                   <div key={doc.id} className="bg-gray-50 rounded-xl p-4">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-3">
//                         <FileText className="w-8 h-8 text-gray-400" />
//                         <div>
//                           <p className="font-medium text-sm">{doc.titre}</p>
//                           <p className="text-xs text-gray-500">{doc.type_document} • {doc.format_fichier}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <a href={doc.fichier_url} target="_blank" rel="noopener noreferrer"
//                           className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg">
//                           <ExternalLink className="w-4 h-4" />
//                         </a>
//                         {doc.statut_verification !== 'verifie' && (
//                           <button
//                             onClick={() => handleAction(() => onVerifyDocument(doc.id))}
//                             disabled={actionLoading}
//                             className="px-3 py-1 bg-black text-white text-xs rounded-lg hover:bg-gray-800"
//                           >
//                             Valider
//                           </button>
//                         )}
//                         {doc.statut_verification !== 'rejete' && doc.statut_verification !== 'verifie' && (
//                           <button
//                             onClick={() => handleAction(() => onRejectDocument(doc.id))}
//                             disabled={actionLoading}
//                             className="px-3 py-1 border border-red-200 text-red-600 text-xs rounded-lg hover:bg-red-50"
//                           >
//                             Rejeter
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           )} */}

//           {activeSection === 'matieres' && (
//             <div className="grid grid-cols-2 gap-3">
//               {precepteur.matieres?.length === 0 ? (
//                 <p className="text-gray-500 text-center py-8 col-span-2">Aucune matière</p>
//               ) : (
//                 precepteur.matieres.map(({ matiere }) => (
//                   <div key={matiere.id} className="bg-gray-50 rounded-xl p-4">
//                     <div className="flex items-center gap-3">
//                       <BookOpen className="w-8 h-8 text-gray-400" />
//                       <div>
//                         <p className="font-medium text-sm">{matiere.nom}</p>
//                         <p className="text-xs text-gray-500">{matiere.niveau}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }
// ============ MODAL DE DÉTAIL ============
function PrecepteurDetailModal({
  precepteur,
  isOpen,
  onClose,
  onVerify,
  onReject,
  onVerifyDocument,
  onRejectDocument
}: {
  precepteur: PrecepteurAvecInfos | null
  isOpen: boolean
  onClose: () => void
  onVerify: (id: number) => Promise<void>
  onReject: (id: number) => Promise<void>
  onVerifyDocument: (docId: number) => Promise<void>
  onRejectDocument: (docId: number) => Promise<void>
}) {
  const [activeSection, setActiveSection] = useState<'info' | 'documents' | 'matieres'>('info')
  const [actionLoading, setActionLoading] = useState<string | null>(null) // Stocke l'ID de l'action en cours

  if (!isOpen || !precepteur) return null

  const statutConfig = {
    verifie: { bg: 'bg-emerald-50 text-emerald-700', icon: Check },
    en_attente: { bg: 'bg-amber-50 text-amber-700', icon: Clock },
    rejete: { bg: 'bg-red-50 text-red-700', icon: X }
  }

  const config = statutConfig[precepteur.statut_verification] || statutConfig.en_attente
  const StatusIcon = config.icon

  const handleAction = async (actionKey: string, action: () => Promise<void>) => {
    setActionLoading(actionKey)
    await action()
    setActionLoading(null)
  }

  // Petit composant loader
  const Spinner = () => (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* En-tête */}
        <div className="p-6 border-b flex items-start justify-between">
          <div className="flex items-center gap-4">
            {precepteur.user?.photo_profil ? (
              <img src={precepteur.user.photo_profil} alt="" className="w-14 h-14 rounded-full object-cover" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="w-7 h-7 text-gray-400" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold">{precepteur.user?.username || 'Anonyme'}</h2>
              <p className="text-sm text-gray-500">{precepteur.user?.email || 'Email non disponible'}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg}`}>
                  <StatusIcon className="w-3 h-3" />
                  {precepteur.statut_verification.replace('_', ' ')}
                </span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  precepteur.disponible ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {precepteur.disponible ? 'Disponible' : 'Indisponible'}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex border-b px-6">
          {(['info', 'documents', 'matieres'] as const).map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeSection === section
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {section === 'info' && 'Informations'}
              {section === 'documents' && `Documents (${precepteur.documents?.length || 0})`}
              {section === 'matieres' && `Matières (${precepteur.matieres?.length || 0})`}
            </button>
          ))}
        </div>

        {/* Contenu */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeSection === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Award className="w-3 h-3" /> Note
                  </p>
                  <p className="font-semibold text-lg">{precepteur.note_moyenne?.toFixed(1) || '0.0'}/5</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Expérience
                  </p>
                  <p className="font-semibold text-lg">{precepteur.annees_experience} an(s)</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Commune
                  </p>
                  <p className="font-medium">{precepteur.commune || 'Non spécifiée'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Quartier
                  </p>
                  <p className="font-medium">{precepteur.quartier || 'Non spécifié'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" /> Diplôme
                  </p>
                  <p className="font-medium">{precepteur.diplome || 'Non spécifié'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Téléphone
                  </p>
                  <p className="font-medium">{precepteur.user?.telephone || 'Non renseigné'}</p>
                </div>
              </div>

              {precepteur.statut_verification !== 'verifie' && (
                <div className="flex gap-3 justify-end pt-4 border-t">
                  {/* Bouton Rejeter avec loader */}
                  <button
                    onClick={() => handleAction(`reject-precepteur-${precepteur.id}`, () => onReject(precepteur.id))}
                    disabled={actionLoading !== null}
                    className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    {actionLoading === `reject-precepteur-${precepteur.id}` && <Spinner />}
                    Rejeter
                  </button>

                  {/* Bouton Valider avec loader */}
                  <button
                    onClick={() => handleAction(`verify-precepteur-${precepteur.id}`, () => onVerify(precepteur.id))}
                    disabled={actionLoading !== null}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm font-medium disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    {actionLoading === `verify-precepteur-${precepteur.id}` && <Spinner />}
                    Valider le précepteur
                  </button>
                </div>
              )}
            </div>
          )}

          {activeSection === 'documents' && (
            <div className="space-y-3">
              {precepteur.documents?.length === 0 ? (
                <div className="text-center py-12">
                  <PiFileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Aucun document</p>
                  <p className="text-gray-400 text-sm mt-1">Le précepteur n'a pas encore téléchargé de documents</p>
                </div>
              ) : (
                precepteur.documents.map((doc) => {
                  const isPdf = doc.format_fichier?.toLowerCase().includes('pdf') || doc.fichier_url?.toLowerCase().endsWith('.pdf')
                  const isImage = doc.format_fichier?.toLowerCase().includes('image') || 
                    ['jpg', 'jpeg', 'png', 'gif', 'webp'].some(ext => doc.fichier_url?.toLowerCase().endsWith(`.${ext}`))
                  
                  const fileIcon = isPdf 
                    ? <PiFilePdf className="w-10 h-10 text-red-500" />
                    : isImage 
                      ? <PiFileImage className="w-10 h-10 text-blue-500" />
                      : <PiFileText className="w-10 h-10 text-gray-400" />

                  const statutDocConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
                    verifie: { 
                      bg: 'bg-emerald-50 border-emerald-200', 
                      text: 'text-emerald-700',
                      icon: <PiCheckCircle className="w-3.5 h-3.5" />
                    },
                    en_attente: { 
                      bg: 'bg-amber-50 border-amber-200', 
                      text: 'text-amber-700',
                      icon: <PiClock className="w-3.5 h-3.5" />
                    },
                    rejete: { 
                      bg: 'bg-red-50 border-red-200', 
                      text: 'text-red-700',
                      icon: <PiXCircle className="w-3.5 h-3.5" />
                    }
                  }
                  
                  const docStatut = statutDocConfig[doc.statut_verification] || statutDocConfig.en_attente

                  const typeLabels: Record<string, string> = {
                    cv: 'CV',
                    diplome: 'Diplôme',
                    certification: 'Certification',
                    carte_identite: "Carte d'identité",
                    autre: 'Autre'
                  }

                  return (
                    <div key={doc.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          {fileIcon}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm text-gray-900 truncate">{doc.titre}</p>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${docStatut.bg} ${docStatut.text}`}>
                              {docStatut.icon}
                              {doc.statut_verification.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>{typeLabels[doc.type_document] || doc.type_document}</span>
                            <span>•</span>
                            <span className="uppercase">{doc.format_fichier || 'PDF'}</span>
                            <span>•</span>
                            <span>{new Date(doc.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>

                        {/* Actions avec loaders */}
                        <div className="flex items-center gap-1">
                          <a 
                            href={doc.fichier_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                            title="Voir le document"
                          >
                            <PiEye className="w-4 h-4" />
                          </a>
                          <a 
                            href={doc.fichier_url} 
                            download
                            className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                            title="Télécharger"
                          >
                            <PiDownloadSimple className="w-4 h-4" />
                          </a>
                          
                          {doc.statut_verification !== 'verifie' && (
                            <button
                              onClick={() => handleAction(`verify-doc-${doc.id}`, () => onVerifyDocument(doc.id))}
                              disabled={actionLoading !== null}
                              className="px-3 py-1.5 bg-black text-white text-xs rounded-lg hover:bg-gray-800 transition-colors font-medium ml-1 inline-flex items-center gap-1.5 disabled:opacity-50"
                            >
                              {actionLoading === `verify-doc-${doc.id}` && <Spinner />}
                              Valider
                            </button>
                          )}
                          {doc.statut_verification !== 'rejete' && doc.statut_verification !== 'verifie' && (
                            <button
                              onClick={() => handleAction(`reject-doc-${doc.id}`, () => onRejectDocument(doc.id))}
                              disabled={actionLoading !== null}
                              className="px-3 py-1.5 border border-red-200 text-red-600 text-xs rounded-lg hover:bg-red-50 transition-colors font-medium inline-flex items-center gap-1.5 disabled:opacity-50"
                            >
                              {actionLoading === `reject-doc-${doc.id}` && <Spinner />}
                              Rejeter
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}

          {activeSection === 'matieres' && (
            <div className="grid grid-cols-2 gap-3">
              {precepteur.matieres?.length === 0 ? (
                <p className="text-gray-500 text-center py-8 col-span-2">Aucune matière</p>
              ) : (
                precepteur.matieres.map(({ matiere }) => (
                  <div key={matiere.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-8 h-8 text-gray-400" />
                      <div>
                        <p className="font-medium text-sm">{matiere.nom}</p>
                        <p className="text-xs text-gray-500">{matiere.niveau}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
// ============ PAGE PRINCIPALE ============
export default function ResponsableDashboard() {
  const { user } = useAuth()
  const [precepteurs, setPrecepteurs] = useState<PrecepteurAvecInfos[]>([])
  const [filteredPrecepteurs, setFilteredPrecepteurs] = useState<PrecepteurAvecInfos[]>([])
  const [statistiques, setStatistiques] = useState<StatistiquesResponsable>({
    total_precepteurs: 0,
    en_attente: 0,
    verifies: 0,
    rejetes: 0,
    total_sessions: 0,
    total_eleves: 0,
    documents_en_attente: 0,
    total_matieres: 0,
    taux_validation: 0
  })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'tous' | 'en_attente' | 'verifies' | 'rejetes'>('en_attente')
  const [selectedPrecepteur, setSelectedPrecepteur] = useState<PrecepteurAvecInfos | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) loadData()
  }, [user])

  useEffect(() => {
    filterPrecepteurs()
  }, [searchTerm, precepteurs, activeTab])

 
 
  // ✅ MODIFIÉ : handleVerifyPrecepteur avec token
  const handleVerifyPrecepteur = async (id: number) => {
    const token = localStorage.getItem('auth-token')  // 🔴 AJOUTER
    if (!token) {
      setMessage('❌ Non authentifié')
      return
    }

    const result = await verifyPrecepteur(token, id)  // 🔴 AJOUTER token
    if (result.success) {
      setMessage('✅ Précepteur validé avec succès')
      await loadData()
    } else {
      setMessage('❌ ' + (result.error || 'Erreur'))
    }
    setTimeout(() => setMessage(''), 3000)
  }

  // ✅ MODIFIÉ : handleRejectPrecepteur avec token
  const handleRejectPrecepteur = async (id: number) => {
    const token = localStorage.getItem('auth-token')  // 🔴 AJOUTER
    if (!token) {
      setMessage('❌ Non authentifié')
      return
    }

    const result = await rejectPrecepteur(token, id)  // 🔴 AJOUTER token
    if (result.success) {
      setMessage('Précepteur rejeté')
      await loadData()
    } else {
      setMessage('❌ ' + (result.error || 'Erreur'))
    }
    setTimeout(() => setMessage(''), 3000)
  }

  // ✅ MODIFIÉ : handleVerifyDocument avec token
  const handleVerifyDocument = async (docId: number) => {
    const token = localStorage.getItem('auth-token')  // 🔴 AJOUTER
    if (!token) {
      setMessage('❌ Non authentifié')
      return
    }

    const result = await verifyDocument(token, docId)  // 🔴 AJOUTER token
    if (result.success) {
      setMessage('✅ Document validé')
      await loadData()
    } else {
      setMessage('❌ ' + (result.error || 'Erreur'))
    }
    setTimeout(() => setMessage(''), 3000)
  }

  // ✅ MODIFIÉ : handleRejectDocument avec token
  const handleRejectDocument = async (docId: number) => {
    const token = localStorage.getItem('auth-token')  // 🔴 AJOUTER
    if (!token) {
      setMessage('❌ Non authentifié')
      return
    }

    const result = await rejectDocument(token, docId)  // 🔴 AJOUTER token
    if (result.success) {
      setMessage('Document rejeté')
      await loadData()
    } else {
      setMessage('❌ ' + (result.error || 'Erreur'))
    }
    setTimeout(() => setMessage(''), 3000)
  }

  const filterPrecepteurs = () => {
    let filtered = [...precepteurs]

    if (activeTab === 'en_attente') filtered = filtered.filter(p => p.statut_verification === 'en_attente')
    else if (activeTab === 'verifies') filtered = filtered.filter(p => p.statut_verification === 'verifie')
    else if (activeTab === 'rejetes') filtered = filtered.filter(p => p.statut_verification === 'rejete')

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(p =>
        p.user?.username?.toLowerCase().includes(term) ||
        p.user?.email?.toLowerCase().includes(term) ||
        p.commune?.toLowerCase().includes(term) ||
        p.diplome?.toLowerCase().includes(term)
      )
    }

    setFilteredPrecepteurs(filtered)
  }
// Dans ResponsableDashboard
const loadData = async () => {
  const token = localStorage.getItem('auth-token')
  
  // 🔴 DEBUG : Afficher le token
  console.log('Token trouvé:', token ? token.substring(0, 30) + '...' : 'AUCUN TOKEN')
  
  if (!token) {
    setError('Non authentifié - Token manquant dans localStorage')
    setLoading(false)
    return
  }

  setLoading(true)
  setError(null)

  console.log('Appel getPrecepteursForResponsable avec token...')
  const [precepteursResult, statsResult] = await Promise.all([
    getPrecepteursForResponsable(token),
    getStatistiquesResponsable(token)
  ])

  console.log('Résultat précepteurs:', precepteursResult)
  console.log('Résultat stats:', statsResult)

  if (precepteursResult.error) {
    setError(precepteursResult.error)
  } else {
    setPrecepteurs(precepteursResult.precepteurs || [])
  }

  if (statsResult.statistiques) {
    setStatistiques(statsResult.statistiques)
  }

  setLoading(false)
}
 

  const statutConfig = {
    verifie: { bg: 'bg-emerald-50 text-emerald-700', icon: Check },
    en_attente: { bg: 'bg-amber-50 text-amber-700', icon: Clock },
    rejete: { bg: 'bg-red-50 text-red-700', icon: X }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>

<div className='w-20'>

        <Loader/>
</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Message */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm flex items-center gap-2 ${
          message.includes('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.includes('✅') ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message}
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="mb-4 p-3 rounded-lg text-sm flex items-center gap-2 bg-red-50 text-red-700">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Espace Responsable</h1>
        <p className="text-gray-500 text-sm mt-1">Gestion et validation des précepteurs</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">Total</span>
          </div>
          <p className="text-2xl font-bold">{statistiques.total_precepteurs}</p>
          <p className="text-xs text-gray-500 mt-1">Précepteurs inscrits</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-gray-500">En attente</span>
          </div>
          <p className="text-2xl font-bold">{statistiques.en_attente}</p>
          <p className="text-xs text-gray-500 mt-1">À valider</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-gray-500">Vérifiés</span>
          </div>
          <p className="text-2xl font-bold">{statistiques.verifies}</p>
          <p className="text-xs text-gray-500 mt-1">{statistiques.taux_validation}% validés</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">Documents</span>
          </div>
          <p className="text-2xl font-bold">{statistiques.documents_en_attente}</p>
          <p className="text-xs text-gray-500 mt-1">En attente</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'en_attente' as const, label: 'En attente', count: statistiques.en_attente },
          { key: 'verifies' as const, label: 'Vérifiés', count: statistiques.verifies },
          { key: 'rejetes' as const, label: 'Rejetés', count: statistiques.rejetes },
          { key: 'tous' as const, label: 'Tous', count: statistiques.total_precepteurs }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === tab.key
                ? 'bg-black text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                activeTab === tab.key ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Recherche */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un précepteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <button
            onClick={loadData}
            className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 flex items-center gap-2 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
        </div>
      </div>

      {/* Liste */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {filteredPrecepteurs.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Aucun précepteur trouvé</p>
            <p className="text-gray-400 text-sm mt-1">
              {activeTab === 'en_attente' ? 'Aucun précepteur en attente de validation.' : 
               activeTab === 'verifies' ? 'Aucun précepteur vérifié.' :
               activeTab === 'rejetes' ? 'Aucun précepteur rejeté.' :
               'Aucun précepteur enregistré.'}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Précepteur</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Localisation</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Exp.</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Statut</th>
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Docs</th>
                <th className="text-right py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPrecepteurs.map((precepteur) => {
                const config = statutConfig[precepteur.statut_verification] || statutConfig.en_attente
                const StatusIcon = config.icon

                return (
                  <tr key={precepteur.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        {precepteur.user?.photo_profil ? (
                          <img src={precepteur.user.photo_profil} alt="" className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm">{precepteur.user?.username || 'Anonyme'}</p>
                          <p className="text-xs text-gray-500">{precepteur.matieres?.length || 0} matière(s)</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <p className="text-sm text-gray-600">{precepteur.user?.email || 'N/A'}</p>
                      <p className="text-xs text-gray-400">{precepteur.user?.telephone || 'N/A'}</p>
                    </td>
                    <td className="py-3 px-6">
                      <p className="text-sm text-gray-600">{precepteur.commune || 'N/A'}</p>
                      <p className="text-xs text-gray-400">{precepteur.quartier || ''}</p>
                    </td>
                    <td className="py-3 px-6">
                      <p className="text-sm font-medium">{precepteur.annees_experience} an(s)</p>
                    </td>
                    <td className="py-3 px-6">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg}`}>
                        <StatusIcon className="w-3 h-3" />
                        {precepteur.statut_verification.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{precepteur.documents?.length || 0}</span>
                        {precepteur.documents?.some(d => d.statut_verification === 'en_attente') && (
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setSelectedPrecepteur(precepteur); setShowDetailModal(true) }}
                          className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {precepteur.statut_verification !== 'verifie' && (
                          <button
                            onClick={() => handleVerifyPrecepteur(precepteur.id)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {precepteur.statut_verification !== 'rejete' && precepteur.statut_verification !== 'verifie' && (
                          <button
                            onClick={() => handleRejectPrecepteur(precepteur.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-sm text-gray-500 mt-4 text-center">
        {filteredPrecepteurs.length} précepteur{filteredPrecepteurs.length > 1 ? 's' : ''} affiché{filteredPrecepteurs.length > 1 ? 's' : ''}
      </p>

      {/* Modal */}
      <PrecepteurDetailModal
        precepteur={selectedPrecepteur}
        isOpen={showDetailModal}
        onClose={() => { setShowDetailModal(false); setSelectedPrecepteur(null) }}
        onVerify={handleVerifyPrecepteur}
        onReject={handleRejectPrecepteur}
        onVerifyDocument={handleVerifyDocument}
        onRejectDocument={handleRejectDocument}
      />
    </div>
  )
}