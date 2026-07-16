// // app/admin/verifications/page.tsx
// 'use client'

// import { useState, useEffect, useCallback, useMemo, memo, JSX } from 'react'
// import { getDocumentsByUserId, updateDocumentStatus } from '@/actions/documents'
// import { getPrecepteursForVerification, updatePrecepteurVerificationStatus } from '@/actions/admin'
// import {
//   User, Search, X, Clock, Eye,
//   GraduationCap, MapPin, Star, BookOpen, Shield,
//   ShieldAlert, ShieldCheck, ShieldX,
//   RotateCcw, Check, ChevronLeft, ChevronRight, Users,
//   FileText, FileImage, File as FileIcon,
//   CheckCircle, Ban, AlertTriangle, Loader2, RefreshCw,
//   ExternalLink
// } from 'lucide-react'

// // Types
// type Precepteur = {
//   id: number
//   user_id: string
//   commune: string | null
//   quartier: string | null
//   annees_experience: number
//   note_moyenne: number
//   diplome: string | null
//   etablissement_origine: string | null
//   statut_verification: 'en_attente' | 'verifie' | 'rejete'
//   created_at: string
//   user: {
//     id: string
//     username: string
//     email: string
//     genre: string
//     photo_profil: string | null
//   }
//   matieres: {
//     matiere_id: number
//     matiere: { id: number; nom: string; niveau: string }
//   }[]
// }

// type Document = {
//   id: number
//   titre: string
//   type_document: string
//   fichier_url: string
//   format_fichier: string
//   statut_verification: 'en_attente' | 'verifie' | 'rejete'
//   commentaire_verification: string | null
//   created_at: string
//   user_id: string
// }

// type ModalState = {
//   type: 'detail' | 'verify' | 'reject' | 'docVerify' | null
//   precepteur: Precepteur | null
//   doc: Document | null
//   docAction: 'verifie' | 'rejete'
//   comment: string
//   docComment: string
// }

// type StatsType = {
//   en_attente: number
//   verifie: number
//   rejete: number
//   total: number
// }

// // ✅ Helper pour construire l'URL de l'image
// const getImageUrl = (photoPath?: string | null): string => {
//   if (!photoPath) return ''
//   if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
//     return photoPath
//   }
//   const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
//   const BASE_URL = API_URL.replace('/api', '')
//   if (photoPath.startsWith('/uploads')) {
//     return `${BASE_URL}${photoPath}`
//   }
//   return `${BASE_URL}/uploads/profils/${photoPath}`
// }

// const ITEMS_PER_PAGE = 10

// // Composants memoïsés
// const StatutBadge = memo(({ statut }: { statut: string }) => {
//   const configs: Record<string, { bg: string; text: string; border: string; icon: JSX.Element }> = {
//     verifie: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: <ShieldCheck className="w-3 h-3" /> },
//     rejete: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: <ShieldX className="w-3 h-3" /> },
//     en_attente: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: <ShieldAlert className="w-3 h-3" /> }
//   }
//   const c = configs[statut] || configs.en_attente
//   return (
//     <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}>
//       {c.icon}
//       {statut.replace('_', ' ')}
//     </span>
//   )
// })
// StatutBadge.displayName = 'StatutBadge'

// const DocIcon = memo(({ format, size = 'md' }: { format: string; size?: 'sm' | 'md' }) => {
//   const cls = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
//   if (format?.includes('pdf')) return <FileText className={`${cls} text-red-500`} />
//   if (format?.includes('image')) return <FileImage className={`${cls} text-blue-500`} />
//   return <FileIcon className={`${cls} text-gray-400`} />
// })
// DocIcon.displayName = 'DocIcon'

// const InfoBadge = memo(({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
//   <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
//     <p className="text-xs text-gray-500 flex items-center gap-1 mb-0.5">
//       <Icon className="w-3 h-3" />{label}
//     </p>
//     <p className="font-medium text-sm">{value}</p>
//   </div>
// ))
// InfoBadge.displayName = 'InfoBadge'

// // ✅ Composant image avec gestion d'erreur
// const ProfileImage = memo(({ src, alt, className, userId, onError, imgErrors }: {
//   src?: string | null
//   alt: string
//   className: string
//   userId: string
//   onError: (userId: string) => void
//   imgErrors: Record<string, boolean>
// }) => {
//   if (src && !imgErrors[userId]) {
//     return (
//       <img 
//         src={getImageUrl(src)} 
//         alt={alt} 
//         className={className}
//         loading="lazy"
//         onError={() => onError(userId)}
//       />
//     )
//   }
//   return (
//     <div className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center`}>
//       <User className="w-5 h-5 text-gray-400" />
//     </div>
//   )
// })
// ProfileImage.displayName = 'ProfileImage'

// const SkeletonLoader = memo(() => (
//   <div className="divide-y divide-gray-50">
//     {[1, 2, 3, 4, 5].map(i => (
//       <div key={i} className="p-4 animate-pulse flex gap-4">
//         <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
//         <div className="flex-1 space-y-2">
//           <div className="h-4 bg-gray-200 rounded w-1/3" />
//           <div className="h-3 bg-gray-200 rounded w-1/2" />
//           <div className="flex gap-2">
//             <div className="h-5 bg-gray-200 rounded-full w-16" />
//             <div className="h-5 bg-gray-200 rounded-full w-20" />
//           </div>
//         </div>
//       </div>
//     ))}
//   </div>
// ))
// SkeletonLoader.displayName = 'SkeletonLoader'

// const EmptyState = memo(() => (
//   <div className="flex flex-col items-center justify-center py-16">
//     <Users className="w-12 h-12 text-gray-300 mb-3" />
//     <p className="text-gray-500 font-medium">Aucun précepteur trouvé</p>
//     <p className="text-gray-400 text-sm mt-1">Essayez de modifier vos filtres</p>
//   </div>
// ))
// EmptyState.displayName = 'EmptyState'

// const StatsSection = memo(({ stats, statutFilter, onFilterChange }: {
//   stats: StatsType
//   statutFilter: string
//   onFilterChange: (filter: string) => void
// }) => {
//   const items = [
//     { key: 'en_attente', label: 'En attente', value: stats.en_attente, color: 'yellow', icon: ShieldAlert },
//     { key: 'verifie', label: 'Vérifiés', value: stats.verifie, color: 'green', icon: ShieldCheck },
//     { key: 'rejete', label: 'Rejetés', value: stats.rejete, color: 'red', icon: ShieldX },
//     { key: '', label: 'Total', value: stats.total, color: 'blue', icon: Users },
//   ]

//   return (
//     <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
//       {items.map(s => (
//         <button
//           key={s.key}
//           onClick={() => onFilterChange(statutFilter === s.key ? '' : s.key)}
//           className={`bg-${s.color}-50 rounded-xl p-4 text-left hover:shadow-sm transition-all ${statutFilter === s.key ? 'ring-2 ring-black' : ''}`}
//         >
//           <div className="flex items-center gap-2 mb-2">
//             <s.icon className={`w-4 h-4 text-${s.color}-700`} />
//             <span className="text-xs font-medium text-gray-600">{s.label}</span>
//           </div>
//           <p className={`text-2xl font-bold text-${s.color}-900`}>{s.value}</p>
//         </button>
//       ))}
//     </div>
//   )
// })
// StatsSection.displayName = 'StatsSection'

// const PrecepteurRow = memo(({ precepteur, onClick, onImageError, imgErrors }: {
//   precepteur: Precepteur
//   onClick: () => void
//   onImageError: (userId: string) => void
//   imgErrors: Record<string, boolean>
// }) => (
//   <div 
//     className="p-4 hover:bg-gray-50/50 transition-colors cursor-pointer flex items-center gap-4"
//     onClick={onClick}
//   >
//     <ProfileImage
//       src={precepteur.user?.photo_profil}
//       alt={precepteur.user?.username || 'Photo'}
//       className="w-10 h-10 rounded-full object-cover flex-shrink-0"
//       userId={precepteur.user_id}
//       onError={onImageError}
//       imgErrors={imgErrors}
//     />
//     <div className="flex-1 min-w-0">
//       <div className="flex items-center gap-2">
//         <p className="font-medium text-sm truncate">{precepteur.user?.username || 'Anonyme'}</p>
//         <StatutBadge statut={precepteur.statut_verification} />
//       </div>
//       <p className="text-xs text-gray-500 mt-0.5">{precepteur.user?.email}</p>
//       <div className="flex flex-wrap gap-1.5 mt-1.5">
//         {precepteur.commune && (
//           <span className="text-xs text-gray-500 flex items-center gap-1">
//             <MapPin className="w-3 h-3" />{precepteur.commune}
//           </span>
//         )}
//         <span className="text-xs text-gray-500 flex items-center gap-1">
//           <Clock className="w-3 h-3" />{precepteur.annees_experience} an(s)
//         </span>
//         <span className="text-xs text-gray-500 flex items-center gap-1">
//           <Star className="w-3 h-3" />{precepteur.note_moyenne?.toFixed(1) || '0'}/5
//         </span>
//         {precepteur.matieres?.length > 0 && (
//           <span className="text-xs text-gray-500 flex items-center gap-1">
//             <BookOpen className="w-3 h-3" />{precepteur.matieres.length} matière(s)
//           </span>
//         )}
//       </div>
//     </div>
//     <Eye className="w-4 h-4 text-gray-300 flex-shrink-0" />
//   </div>
// ))
// PrecepteurRow.displayName = 'PrecepteurRow'

// const Pagination = memo(({ page, totalPages, totalFiltered, statutFilter, onPageChange }: {
//   page: number
//   totalPages: number
//   totalFiltered: number
//   statutFilter: string
//   onPageChange: (page: number) => void
// }) => (
//   <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
//     <p className="text-sm text-gray-500">
//       {totalFiltered} résultat{totalFiltered > 1 ? 's' : ''}
//       {statutFilter && <span> • {statutFilter.replace('_', ' ')}</span>}
//     </p>
//     {totalPages > 1 && (
//       <div className="flex items-center gap-1">
//         <button onClick={() => onPageChange(page - 1)} disabled={page === 1} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30">
//           <ChevronLeft className="w-4 h-4" />
//         </button>
//         {Array.from({ length: totalPages }, (_, i) => i + 1)
//           .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
//           .map((p, i, arr) => (
//             <span key={p} className="flex items-center">
//               {i > 0 && arr[i - 1] !== p - 1 && <span className="px-1 text-gray-400">...</span>}
//               <button onClick={() => onPageChange(p)} className={`w-8 h-8 rounded-lg text-sm font-medium ${page === p ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-700'}`}>
//                 {p}
//               </button>
//             </span>
//           ))}
//         <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30">
//           <ChevronRight className="w-4 h-4" />
//         </button>
//       </div>
//     )}
//   </div>
// ))
// Pagination.displayName = 'Pagination'

// // Modal de détail
// const DetailModal = memo(({ precepteur, documents, loadingDocs, areAllDocsVerified, imgErrors, onImageError, onClose, onVerify, onReject, onDocVerify }: {
//   precepteur: Precepteur
//   documents: Document[]
//   loadingDocs: boolean
//   areAllDocsVerified: boolean
//   imgErrors: Record<string, boolean>
//   onImageError: (userId: string) => void
//   onClose: () => void
//   onVerify: (precepteur: Precepteur) => void
//   onReject: (precepteur: Precepteur) => void
//   onDocVerify: (doc: Document, action: 'verifie' | 'rejete') => void
// }) => (
//   <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
//     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
//       <div className="sticky top-0 bg-white border-b p-6 flex items-center gap-4 z-10">
//         <ProfileImage
//           src={precepteur.user?.photo_profil}
//           alt={precepteur.user?.username || 'Photo'}
//           className="w-12 h-12 rounded-xl object-cover"
//           userId={precepteur.user_id}
//           onError={onImageError}
//           imgErrors={imgErrors}
//         />
//         <div className="flex-1">
//           <h2 className="font-bold">{precepteur.user?.username}</h2>
//           <p className="text-sm text-gray-500">{precepteur.user?.email}</p>
//         </div>
//         <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">
//           <X className="w-5 h-5" />
//         </button>
//       </div>

//       <div className="p-6 space-y-4">
//         <StatutBadge statut={precepteur.statut_verification} />
//         <div className="grid grid-cols-2 gap-3">
//           <InfoBadge icon={MapPin} label="Localisation" value={[precepteur.commune, precepteur.quartier].filter(Boolean).join(', ') || 'Non spécifié'} />
//           <InfoBadge icon={Clock} label="Expérience" value={`${precepteur.annees_experience} an(s)`} />
//           <InfoBadge icon={GraduationCap} label="Diplôme" value={precepteur.diplome || 'Non spécifié'} />
//           <InfoBadge icon={Star} label="Note" value={`${precepteur.note_moyenne?.toFixed(1) || '0'}/5`} />
//         </div>

//         {precepteur.matieres?.length > 0 && (
//           <div>
//             <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
//               <BookOpen className="w-4 h-4" /> Matières ({precepteur.matieres.length})
//             </h3>
//             <div className="flex flex-wrap gap-1.5">
//               {precepteur.matieres.map(m => (
//                 <span key={m.matiere_id} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs border border-blue-100">
//                   {m.matiere?.nom} ({m.matiere?.niveau})
//                 </span>
//               ))}
//             </div>
//           </div>
//         )}

//         <div className="border-t pt-4">
//           <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//             <FileText className="w-4 h-4" /> Documents
//           </h3>
//           {loadingDocs ? (
//             <div className="text-center py-4"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" /></div>
//           ) : documents.length === 0 ? (
//             <p className="text-sm text-gray-500 text-center py-4">Aucun document soumis</p>
//           ) : (
//             <div className="space-y-2">
//               {documents.map(doc => (
//                 <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-colors">
//                   <DocIcon format={doc.format_fichier} />
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-medium truncate">{doc.titre}</p>
//                     <p className="text-xs text-gray-500">{doc.format_fichier?.toUpperCase()} • {new Date(doc.created_at).toLocaleDateString('fr-FR')}</p>
//                   </div>
//                   <a href={doc.fichier_url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
//                     <ExternalLink className="w-4 h-4" />
//                   </a>
//                   {doc.statut_verification === 'en_attente' ? (
//                     <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
//                       <button onClick={() => onDocVerify(doc, 'verifie')} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="Valider">
//                         <CheckCircle className="w-4 h-4" />
//                       </button>
//                       <button onClick={() => onDocVerify(doc, 'rejete')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Rejeter">
//                         <Ban className="w-4 h-4" />
//                       </button>
//                     </div>
//                   ) : (
//                     <span className={`text-xs px-2 py-0.5 rounded-full ${doc.statut_verification === 'verifie' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//                       {doc.statut_verification}
//                     </span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//           {!loadingDocs && documents.length > 0 && !areAllDocsVerified && (
//             <p className="text-xs text-yellow-600 mt-2 flex items-center gap-1">
//               <AlertTriangle className="w-3 h-3" /> Vérifiez tous les documents avant de valider le précepteur
//             </p>
//           )}
//         </div>
//       </div>

//       <div className="p-6 border-t bg-gray-50/50 rounded-b-2xl flex gap-3">
//         <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-white transition-colors">Fermer</button>
//         {precepteur.statut_verification !== 'verifie' && areAllDocsVerified && (
//           <button onClick={() => onVerify(precepteur)} className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
//             <ShieldCheck className="w-4 h-4" /> Vérifier
//           </button>
//         )}
//         {precepteur.statut_verification !== 'rejete' && (
//           <button onClick={() => onReject(precepteur)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
//             <ShieldX className="w-4 h-4" /> Rejeter
//           </button>
//         )}
//       </div>
//     </div>
//   </div>
// ))
// DetailModal.displayName = 'DetailModal'

// // Modal de confirmation
// const ConfirmModal = memo(({ type, precepteur, comment, processing, onClose, onConfirm, onCommentChange }: {
//   type: 'verify' | 'reject'
//   precepteur: Precepteur
//   comment: string
//   processing: boolean
//   onClose: () => void
//   onConfirm: (action: 'verifie' | 'rejete') => void
//   onCommentChange: (comment: string) => void
// }) => (
//   <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
//     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
//       <div className="text-center">
//         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${type === 'verify' ? 'bg-green-100' : 'bg-red-100'}`}>
//           {type === 'verify' ? <ShieldCheck className="w-7 h-7 text-green-600" /> : <ShieldX className="w-7 h-7 text-red-600" />}
//         </div>
//         <h3 className="text-lg font-bold mb-1">{type === 'verify' ? 'Vérifier ce précepteur ?' : 'Rejeter ce précepteur ?'}</h3>
//         <p className="text-sm text-gray-500 mb-4">{precepteur.user?.username} • {precepteur.user?.email}</p>
//         <textarea value={comment} onChange={e => onCommentChange(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-black" placeholder="Commentaire (optionnel)..." disabled={processing} />
//         <div className="flex gap-2">
//           <button onClick={onClose} disabled={processing} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50">Annuler</button>
//           <button onClick={() => onConfirm(type === 'verify' ? 'verifie' : 'rejete')} disabled={processing} className={`flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-70 ${type === 'verify' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
//             {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
//             Confirmer
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// ))
// ConfirmModal.displayName = 'ConfirmModal'

// // Modal vérification document
// const DocVerifyModal = memo(({ doc, docAction, docComment, processing, onClose, onConfirm, onCommentChange }: {
//   doc: Document
//   docAction: 'verifie' | 'rejete'
//   docComment: string
//   processing: boolean
//   onClose: () => void
//   onConfirm: () => void
//   onCommentChange: (comment: string) => void
// }) => (
//   <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
//     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
//       <div className="text-center">
//         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${docAction === 'verifie' ? 'bg-green-100' : 'bg-red-100'}`}>
//           {docAction === 'verifie' ? <CheckCircle className="w-7 h-7 text-green-600" /> : <Ban className="w-7 h-7 text-red-600" />}
//         </div>
//         <h3 className="text-lg font-bold mb-1">{docAction === 'verifie' ? 'Valider ce document ?' : 'Rejeter ce document ?'}</h3>
//         <p className="text-sm text-gray-500 mb-2 truncate">{doc.titre}</p>
//         <a href={doc.fichier_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mb-4 inline-flex items-center gap-1">
//           <ExternalLink className="w-3 h-3" /> Voir le document
//         </a>
//         <textarea value={docComment} onChange={e => onCommentChange(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-black" placeholder="Commentaire (optionnel)..." disabled={processing} />
//         <div className="flex gap-2">
//           <button onClick={onClose} disabled={processing} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50">Annuler</button>
//           <button onClick={onConfirm} disabled={processing} className={`flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-70 ${docAction === 'verifie' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
//             {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
//             Confirmer
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// ))
// DocVerifyModal.displayName = 'DocVerifyModal'

// // ============ COMPOSANT PRINCIPAL ============

// export default function VerificationPrecepteurs() {
//   const [allPrecepteurs, setAllPrecepteurs] = useState<Precepteur[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [statutFilter, setStatutFilter] = useState('')
//   const [page, setPage] = useState(1)
//   const [stats, setStats] = useState<StatsType>({ en_attente: 0, verifie: 0, rejete: 0, total: 0 })
//   const [message, setMessage] = useState('')
//   const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})
  
//   const [modal, setModal] = useState<ModalState>({
//     type: null, precepteur: null, doc: null, docAction: 'verifie', comment: '', docComment: ''
//   })
  
//   const [processing, setProcessing] = useState(false)
//   const [documents, setDocuments] = useState<Document[]>([])
//   const [loadingDocs, setLoadingDocs] = useState(false)

//   // Gestionnaire d'erreur d'image
//   const handleImageError = useCallback((userId: string) => {
//     setImgErrors(prev => ({ ...prev, [userId]: true }))
//   }, [])

//   // Toast
//   useEffect(() => {
//     if (!message) return
//     const timer = setTimeout(() => setMessage(''), 3000)
//     return () => clearTimeout(timer)
//   }, [message])

//   // Reset page
//   useEffect(() => { setPage(1) }, [statutFilter, searchTerm])

//   // ✅ Chargement depuis l'API Express
//   const loadData = useCallback(async () => {
//     setLoading(true)
//     try {
//       const result = await getPrecepteursForVerification()
      
//       if (result.success && result.precepteurs) {
//         setAllPrecepteurs(result.precepteurs)
//         setStats(result.stats || { en_attente: 0, verifie: 0, rejete: 0, total: result.precepteurs.length })
//       } else {
//         setMessage('❌ ' + (result.error || 'Erreur de chargement'))
//       }
//     } catch (error) {
//       console.error('❌ Erreur chargement:', error)
//       setMessage('❌ Erreur lors du chargement')
//     }
//     setLoading(false)
//   }, [])

//   useEffect(() => { loadData() }, [loadData])

//   // Filtrage + pagination
//   const { paginatedPrecepteurs, totalFiltered } = useMemo(() => {
//     if (allPrecepteurs.length === 0) return { paginatedPrecepteurs: [], totalFiltered: 0 }
    
//     let filtered = allPrecepteurs
    
//     if (statutFilter) {
//       filtered = filtered.filter(p => p.statut_verification === statutFilter)
//       if (filtered.length === 0) return { paginatedPrecepteurs: [], totalFiltered: 0 }
//     }
    
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase()
//       filtered = filtered.filter(p => {
//         if (p.user?.username?.toLowerCase().includes(term)) return true
//         if (p.user?.email?.toLowerCase().includes(term)) return true
//         if (p.commune?.toLowerCase().includes(term)) return true
//         if (p.diplome?.toLowerCase().includes(term)) return true
//         return p.matieres?.some(m => m.matiere?.nom?.toLowerCase().includes(term))
//       })
//     }

//     const start = (page - 1) * ITEMS_PER_PAGE
//     return {
//       paginatedPrecepteurs: filtered.slice(start, start + ITEMS_PER_PAGE),
//       totalFiltered: filtered.length
//     }
//   }, [allPrecepteurs, statutFilter, searchTerm, page])

//   const totalPages = Math.ceil(totalFiltered / ITEMS_PER_PAGE)

//   // Chargement documents
//   const loadDocuments = useCallback(async (userId: string) => {
//     setLoadingDocs(true)
//     try {
//       const { documents: docs, error } = await getDocumentsByUserId(userId)
//       if (!error && docs) setDocuments(docs)
//       else setDocuments([])
//     } catch (e) {
//       setDocuments([])
//     }
//     setLoadingDocs(false)
//   }, [])

//   // ✅ Vérification via API Express
//   const handleVerification = useCallback(async (action: 'verifie' | 'rejete') => {
//     if (!modal.precepteur) return
//     setProcessing(true)
//     try {
//       const result = await updatePrecepteurVerificationStatus(modal.precepteur.id, action, modal.comment || undefined)
      
//       if (result.success) {
//         setAllPrecepteurs(prev => prev.map(p => 
//           p.id === modal.precepteur?.id ? { ...p, statut_verification: action } : p
//         ))
//         setMessage(`✅ Précepteur ${action === 'verifie' ? 'vérifié' : 'rejeté'}`)
//         closeAllModals()
//         setTimeout(() => loadData(), 1000)
//       } else {
//         setMessage('❌ ' + (result.error || 'Erreur'))
//       }
//     } catch (e: any) {
//       setMessage('❌ ' + (e.message || 'Erreur'))
//     }
//     setProcessing(false)
//   }, [modal.precepteur, loadData])

//   // ✅ Vérification document via API Express
//   const handleDocVerification = useCallback(async () => {
//     if (!modal.doc) return
//     setProcessing(true)
//     try {
//       const result = await updateDocumentStatus(modal.doc.id, modal.docAction, modal.docComment || undefined)
//       if (result.success) {
//         setDocuments(prev => prev.map(d => 
//           d.id === modal.doc?.id ? { ...d, statut_verification: modal.docAction } : d
//         ))
//         setMessage(`✅ Document ${modal.docAction === 'verifie' ? 'vérifié' : 'rejeté'}`)
//         setModal(prev => ({ ...prev, type: 'detail', doc: null }))
//       } else {
//         setMessage('❌ ' + (result.error || 'Erreur'))
//       }
//     } catch (e: any) {
//       setMessage('❌ ' + (e.message || 'Erreur'))
//     }
//     setProcessing(false)
//   }, [modal.doc, modal.docAction, modal.docComment])

//   const openDetails = useCallback((p: Precepteur) => {
//     setModal({ type: 'detail', precepteur: p, doc: null, docAction: 'verifie', comment: '', docComment: '' })
//     loadDocuments(p.user_id)
//   }, [loadDocuments])

//   const openDocVerify = useCallback((doc: Document, action: 'verifie' | 'rejete') => {
//     setModal(prev => ({ ...prev, type: 'docVerify', doc, docAction: action, docComment: doc.commentaire_verification || '' }))
//   }, [])

//   const closeAllModals = useCallback(() => {
//     setModal({ type: null, precepteur: null, doc: null, docAction: 'verifie', comment: '', docComment: '' })
//   }, [])

//   const areAllDocsVerified = useMemo(() => 
//     documents.length > 0 && documents.every(d => d.statut_verification === 'verifie'),
//     [documents]
//   )

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-6">
//       {message && (
//         <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-top-2 duration-300 ${message.includes('✅') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
//           {message}
//         </div>
//       )}

//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl font-bold flex items-center gap-2"><Shield className="w-6 h-6" /> Vérification des précepteurs</h1>
//           <p className="text-sm text-gray-500 mt-0.5">{stats.total} précepteurs au total</p>
//         </div>
//         <button onClick={loadData} className="p-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors" title="Actualiser">
//           <RefreshCw className="w-4 h-4" />
//         </button>
//       </div>

//       <StatsSection stats={stats} statutFilter={statutFilter} onFilterChange={setStatutFilter} />

//       <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
//         <div className="flex flex-col sm:flex-row gap-3">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black" />
//           </div>
//           <select value={statutFilter} onChange={e => setStatutFilter(e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-white">
//             <option value="">Tous les statuts</option>
//             <option value="en_attente">En attente ({stats.en_attente})</option>
//             <option value="verifie">Vérifié ({stats.verifie})</option>
//             <option value="rejete">Rejeté ({stats.rejete})</option>
//           </select>
//           {(searchTerm || statutFilter) && (
//             <button onClick={() => { setSearchTerm(''); setStatutFilter('') }} className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl flex items-center gap-1.5">
//               <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
//         {loading ? <SkeletonLoader /> : paginatedPrecepteurs.length === 0 ? <EmptyState /> : (
//           <>
//             <div className="divide-y divide-gray-50">
//               {paginatedPrecepteurs.map(p => (
//                 <PrecepteurRow key={p.id} precepteur={p} onClick={() => openDetails(p)} onImageError={handleImageError} imgErrors={imgErrors} />
//               ))}
//             </div>
//             <Pagination page={page} totalPages={totalPages} totalFiltered={totalFiltered} statutFilter={statutFilter} onPageChange={setPage} />
//           </>
//         )}
//       </div>

//       {modal.type === 'detail' && modal.precepteur && (
//         <DetailModal precepteur={modal.precepteur} documents={documents} loadingDocs={loadingDocs} areAllDocsVerified={areAllDocsVerified} imgErrors={imgErrors} onImageError={handleImageError} onClose={closeAllModals}
//           onVerify={p => setModal(prev => ({ ...prev, type: 'verify', precepteur: p }))}
//           onReject={p => setModal(prev => ({ ...prev, type: 'reject', precepteur: p }))}
//           onDocVerify={openDocVerify} />
//       )}

//       {(modal.type === 'verify' || modal.type === 'reject') && modal.precepteur && (
//         <ConfirmModal type={modal.type} precepteur={modal.precepteur} comment={modal.comment} processing={processing} onClose={closeAllModals}
//           onConfirm={handleVerification} onCommentChange={c => setModal(prev => ({ ...prev, comment: c }))} />
//       )}

//       {modal.type === 'docVerify' && modal.doc && (
//         <DocVerifyModal doc={modal.doc} docAction={modal.docAction} docComment={modal.docComment} processing={processing} onClose={closeAllModals}
//           onConfirm={handleDocVerification} onCommentChange={c => setModal(prev => ({ ...prev, docComment: c }))} />
//       )}
//     </div>
//   )
// }

// app/admin/verifications/page.tsx
'use client'

import { useState, useEffect, useCallback, useMemo, memo, JSX } from 'react'
import { getDocumentsByUserId, updateDocumentStatus } from '@/actions/documents'
import { getPrecepteursForVerification, updatePrecepteurVerificationStatus } from '@/actions/admin'
import {
  User, Search, X, Clock, Eye,
  GraduationCap, MapPin, Star, BookOpen, Shield,
  ShieldAlert, ShieldCheck, ShieldX,
  RotateCcw, Check, ChevronLeft, ChevronRight, Users,
  FileText, FileImage, File as FileIcon,
  CheckCircle, Ban, AlertTriangle, Loader2, RefreshCw,
  ExternalLink
} from 'lucide-react'

// Types
type Precepteur = {
  id: number
  user_id: string
  commune: string | null
  quartier: string | null
  annees_experience: number
  note_moyenne: number
  diplome: string | null
  etablissement_origine: string | null
  statut_verification: 'en_attente' | 'verifie' | 'rejete'
  created_at: string
  user: {
    id: string
    username: string
    email: string
    genre: string
    photo_profil: string | null
  }
  matieres: {
    matiere_id: number
    matiere: { id: number; nom: string; niveau: string }
  }[]
}

type Document = {
  id: number
  titre: string
  type_document: string
  fichier_url: string
  format_fichier: string
  statut_verification: 'en_attente' | 'verifie' | 'rejete'
  commentaire_verification: string | null
  created_at: string
  user_id: string
}

type ModalState = {
  type: 'detail' | 'verify' | 'reject' | 'docVerify' | null
  precepteur: Precepteur | null
  doc: Document | null
  docAction: 'verifie' | 'rejete'
  comment: string
  docComment: string
  forceVerify: boolean
}

type StatsType = {
  en_attente: number
  verifie: number
  rejete: number
  total: number
}

// ✅ Helper pour construire l'URL de l'image
const getImageUrl = (photoPath?: string | null): string => {
  if (!photoPath) return ''
  if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
    return photoPath
  }
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  const BASE_URL = API_URL.replace('/api', '')
  if (photoPath.startsWith('/uploads')) {
    return `${BASE_URL}${photoPath}`
  }
  return `${BASE_URL}/uploads/profils/${photoPath}`
}

const ITEMS_PER_PAGE = 10

// Composants memoïsés
const StatutBadge = memo(({ statut }: { statut: string }) => {
  const configs: Record<string, { bg: string; text: string; border: string; icon: JSX.Element }> = {
    verifie: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: <ShieldCheck className="w-3 h-3" /> },
    rejete: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: <ShieldX className="w-3 h-3" /> },
    en_attente: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: <ShieldAlert className="w-3 h-3" /> }
  }
  const c = configs[statut] || configs.en_attente
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}>
      {c.icon}
      {statut.replace('_', ' ')}
    </span>
  )
})
StatutBadge.displayName = 'StatutBadge'

const DocIcon = memo(({ format, size = 'md' }: { format: string; size?: 'sm' | 'md' }) => {
  const cls = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
  if (format?.includes('pdf')) return <FileText className={`${cls} text-red-500`} />
  if (format?.includes('image')) return <FileImage className={`${cls} text-blue-500`} />
  return <FileIcon className={`${cls} text-gray-400`} />
})
DocIcon.displayName = 'DocIcon'

const InfoBadge = memo(({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
    <p className="text-xs text-gray-500 flex items-center gap-1 mb-0.5">
      <Icon className="w-3 h-3" />{label}
    </p>
    <p className="font-medium text-sm">{value}</p>
  </div>
))
InfoBadge.displayName = 'InfoBadge'

// ✅ Composant image avec gestion d'erreur
const ProfileImage = memo(({ src, alt, className, userId, onError, imgErrors }: {
  src?: string | null
  alt: string
  className: string
  userId: string
  onError: (userId: string) => void
  imgErrors: Record<string, boolean>
}) => {
  if (src && !imgErrors[userId]) {
    return (
      <img 
        src={getImageUrl(src)} 
        alt={alt} 
        className={className}
        loading="lazy"
        onError={() => onError(userId)}
      />
    )
  }
  return (
    <div className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center`}>
      <User className="w-5 h-5 text-gray-400" />
    </div>
  )
})
ProfileImage.displayName = 'ProfileImage'

const SkeletonLoader = memo(() => (
  <div className="divide-y divide-gray-50">
    {[1, 2, 3, 4, 5].map(i => (
      <div key={i} className="p-4 animate-pulse flex gap-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="flex gap-2">
            <div className="h-5 bg-gray-200 rounded-full w-16" />
            <div className="h-5 bg-gray-200 rounded-full w-20" />
          </div>
        </div>
      </div>
    ))}
  </div>
))
SkeletonLoader.displayName = 'SkeletonLoader'

const EmptyState = memo(() => (
  <div className="flex flex-col items-center justify-center py-16">
    <Users className="w-12 h-12 text-gray-300 mb-3" />
    <p className="text-gray-500 font-medium">Aucun précepteur trouvé</p>
    <p className="text-gray-400 text-sm mt-1">Essayez de modifier vos filtres</p>
  </div>
))
EmptyState.displayName = 'EmptyState'

const StatsSection = memo(({ stats, statutFilter, onFilterChange }: {
  stats: StatsType
  statutFilter: string
  onFilterChange: (filter: string) => void
}) => {
  const items = [
    { key: 'en_attente', label: 'En attente', value: stats.en_attente, color: 'yellow', icon: ShieldAlert },
    { key: 'verifie', label: 'Vérifiés', value: stats.verifie, color: 'green', icon: ShieldCheck },
    { key: 'rejete', label: 'Rejetés', value: stats.rejete, color: 'red', icon: ShieldX },
    { key: '', label: 'Total', value: stats.total, color: 'blue', icon: Users },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {items.map(s => (
        <button
          key={s.key}
          onClick={() => onFilterChange(statutFilter === s.key ? '' : s.key)}
          className={`bg-${s.color}-50 rounded-xl p-4 text-left hover:shadow-sm transition-all ${statutFilter === s.key ? 'ring-2 ring-black' : ''}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <s.icon className={`w-4 h-4 text-${s.color}-700`} />
            <span className="text-xs font-medium text-gray-600">{s.label}</span>
          </div>
          <p className={`text-2xl font-bold text-${s.color}-900`}>{s.value}</p>
        </button>
      ))}
    </div>
  )
})
StatsSection.displayName = 'StatsSection'

const PrecepteurRow = memo(({ precepteur, onClick, onImageError, imgErrors }: {
  precepteur: Precepteur
  onClick: () => void
  onImageError: (userId: string) => void
  imgErrors: Record<string, boolean>
}) => (
  <div 
    className="p-4 hover:bg-gray-50/50 transition-colors cursor-pointer flex items-center gap-4"
    onClick={onClick}
  >
    <ProfileImage
      src={precepteur.user?.photo_profil}
      alt={precepteur.user?.username || 'Photo'}
      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      userId={precepteur.user_id}
      onError={onImageError}
      imgErrors={imgErrors}
    />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className="font-medium text-sm truncate">{precepteur.user?.username || 'Anonyme'}</p>
        <StatutBadge statut={precepteur.statut_verification} />
      </div>
      <p className="text-xs text-gray-500 mt-0.5">{precepteur.user?.email}</p>
      <div className="flex flex-wrap gap-1.5 mt-1.5">
        {precepteur.commune && (
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin className="w-3 h-3" />{precepteur.commune}
          </span>
        )}
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Clock className="w-3 h-3" />{precepteur.annees_experience} an(s)
        </span>
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Star className="w-3 h-3" />{precepteur.note_moyenne?.toFixed(1) || '0'}/5
        </span>
        {precepteur.matieres?.length > 0 && (
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <BookOpen className="w-3 h-3" />{precepteur.matieres.length} matière(s)
          </span>
        )}
      </div>
    </div>
    <Eye className="w-4 h-4 text-gray-300 flex-shrink-0" />
  </div>
))
PrecepteurRow.displayName = 'PrecepteurRow'

const Pagination = memo(({ page, totalPages, totalFiltered, statutFilter, onPageChange }: {
  page: number
  totalPages: number
  totalFiltered: number
  statutFilter: string
  onPageChange: (page: number) => void
}) => (
  <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between">
    <p className="text-sm text-gray-500">
      {totalFiltered} résultat{totalFiltered > 1 ? 's' : ''}
      {statutFilter && <span> • {statutFilter.replace('_', ' ')}</span>}
    </p>
    {totalPages > 1 && (
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30">
          <ChevronLeft className="w-4 h-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .map((p, i, arr) => (
            <span key={p} className="flex items-center">
              {i > 0 && arr[i - 1] !== p - 1 && <span className="px-1 text-gray-400">...</span>}
              <button onClick={() => onPageChange(p)} className={`w-8 h-8 rounded-lg text-sm font-medium ${page === p ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-700'}`}>
                {p}
              </button>
            </span>
          ))}
        <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    )}
  </div>
))
Pagination.displayName = 'Pagination'

// Modal de détail
const DetailModal = memo(({ precepteur, documents, loadingDocs, areAllDocsVerified, imgErrors, onImageError, onClose, onVerify, onReject, onDocVerify }: {
  precepteur: Precepteur
  documents: Document[]
  loadingDocs: boolean
  areAllDocsVerified: boolean
  imgErrors: Record<string, boolean>
  onImageError: (userId: string) => void
  onClose: () => void
  onVerify: (precepteur: Precepteur, forceVerify: boolean) => void
  onReject: (precepteur: Precepteur) => void
  onDocVerify: (doc: Document, action: 'verifie' | 'rejete') => void
}) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
      <div className="sticky top-0 bg-white border-b p-6 flex items-center gap-4 z-10">
        <ProfileImage
          src={precepteur.user?.photo_profil}
          alt={precepteur.user?.username || 'Photo'}
          className="w-12 h-12 rounded-xl object-cover"
          userId={precepteur.user_id}
          onError={onImageError}
          imgErrors={imgErrors}
        />
        <div className="flex-1">
          <h2 className="font-bold">{precepteur.user?.username}</h2>
          <p className="text-sm text-gray-500">{precepteur.user?.email}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-4">
        <StatutBadge statut={precepteur.statut_verification} />
        <div className="grid grid-cols-2 gap-3">
          <InfoBadge icon={MapPin} label="Localisation" value={[precepteur.commune, precepteur.quartier].filter(Boolean).join(', ') || 'Non spécifié'} />
          <InfoBadge icon={Clock} label="Expérience" value={`${precepteur.annees_experience} an(s)`} />
          <InfoBadge icon={GraduationCap} label="Diplôme" value={precepteur.diplome || 'Non spécifié'} />
          <InfoBadge icon={Star} label="Note" value={`${precepteur.note_moyenne?.toFixed(1) || '0'}/5`} />
        </div>

        {precepteur.matieres?.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Matières ({precepteur.matieres.length})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {precepteur.matieres.map(m => (
                <span key={m.matiere_id} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs border border-blue-100">
                  {m.matiere?.nom} ({m.matiere?.niveau})
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Documents
          </h3>
          {loadingDocs ? (
            <div className="text-center py-4"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" /></div>
          ) : documents.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Aucun document soumis</p>
          ) : (
            <div className="space-y-2">
              {documents.map(doc => (
                <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-colors">
                  <DocIcon format={doc.format_fichier} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.titre}</p>
                    <p className="text-xs text-gray-500">{doc.format_fichier?.toUpperCase()} • {new Date(doc.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <a href={doc.fichier_url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  {doc.statut_verification === 'en_attente' ? (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => onDocVerify(doc, 'verifie')} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="Valider">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDocVerify(doc, 'rejete')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Rejeter">
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${doc.statut_verification === 'verifie' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {doc.statut_verification}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          {!loadingDocs && documents.length > 0 && !areAllDocsVerified && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-xs text-yellow-700 flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> 
                <span>
                  <strong>Attention :</strong> Tous les documents n'ont pas été vérifiés. 
                  Il est recommandé de vérifier chaque document avant de valider le précepteur.
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 border-t bg-gray-50/50 rounded-b-2xl flex gap-3">
        <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-white transition-colors">Fermer</button>
        
        {/* Bouton Vérifier - toujours visible si pas déjà vérifié */}
        {precepteur.statut_verification !== 'verifie' && (
          <button 
            onClick={() => onVerify(precepteur, !areAllDocsVerified)} 
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              areAllDocsVerified 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-yellow-500 text-white hover:bg-yellow-600'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> 
            {areAllDocsVerified ? 'Vérifier' : 'Vérifier quand même'}
          </button>
        )}
        
        {/* Bouton Rejeter - toujours visible si pas déjà rejeté */}
        {precepteur.statut_verification !== 'rejete' && (
          <button onClick={() => onReject(precepteur)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
            <ShieldX className="w-4 h-4" /> Rejeter
          </button>
        )}
      </div>
    </div>
  </div>
))
DetailModal.displayName = 'DetailModal'

// Modal de confirmation
const ConfirmModal = memo(({ type, precepteur, comment, processing, forceVerify, onClose, onConfirm, onCommentChange }: {
  type: 'verify' | 'reject'
  precepteur: Precepteur
  comment: string
  processing: boolean
  forceVerify: boolean
  onClose: () => void
  onConfirm: (action: 'verifie' | 'rejete') => void
  onCommentChange: (comment: string) => void
}) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
      <div className="text-center">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
          type === 'verify' 
            ? forceVerify ? 'bg-yellow-100' : 'bg-green-100'
            : 'bg-red-100'
        }`}>
          {type === 'verify' ? (
            forceVerify ? <AlertTriangle className="w-7 h-7 text-yellow-600" /> : <ShieldCheck className="w-7 h-7 text-green-600" />
          ) : (
            <ShieldX className="w-7 h-7 text-red-600" />
          )}
        </div>
        
        <h3 className="text-lg font-bold mb-1">
          {type === 'verify' 
            ? forceVerify 
              ? 'Vérifier sans documents validés ?' 
              : 'Vérifier ce précepteur ?'
            : 'Rejeter ce précepteur ?'
          }
        </h3>
        
        <p className="text-sm text-gray-500 mb-2">{precepteur.user?.username} • {precepteur.user?.email}</p>
        
        {forceVerify && type === 'verify' && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-xs text-yellow-700 flex items-start gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>Certains documents n'ont pas été vérifiés. Cette action validera le précepteur malgré tout.</span>
            </p>
          </div>
        )}
        
        <textarea 
          value={comment} 
          onChange={e => onCommentChange(e.target.value)} 
          rows={2} 
          className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-black" 
          placeholder="Commentaire (optionnel)..." 
          disabled={processing} 
        />
        
        <div className="flex gap-2">
          <button 
            onClick={onClose} 
            disabled={processing} 
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            Annuler
          </button>
          <button 
            onClick={() => onConfirm(type === 'verify' ? 'verifie' : 'rejete')} 
            disabled={processing} 
            className={`flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-70 ${
              type === 'verify' 
                ? forceVerify ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {forceVerify && type === 'verify' ? 'Valider quand même' : 'Confirmer'}
          </button>
        </div>
      </div>
    </div>
  </div>
))
ConfirmModal.displayName = 'ConfirmModal'

// Modal vérification document
const DocVerifyModal = memo(({ doc, docAction, docComment, processing, onClose, onConfirm, onCommentChange }: {
  doc: Document
  docAction: 'verifie' | 'rejete'
  docComment: string
  processing: boolean
  onClose: () => void
  onConfirm: () => void
  onCommentChange: (comment: string) => void
}) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
      <div className="text-center">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${docAction === 'verifie' ? 'bg-green-100' : 'bg-red-100'}`}>
          {docAction === 'verifie' ? <CheckCircle className="w-7 h-7 text-green-600" /> : <Ban className="w-7 h-7 text-red-600" />}
        </div>
        <h3 className="text-lg font-bold mb-1">{docAction === 'verifie' ? 'Valider ce document ?' : 'Rejeter ce document ?'}</h3>
        <p className="text-sm text-gray-500 mb-2 truncate">{doc.titre}</p>
        <a href={doc.fichier_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mb-4 inline-flex items-center gap-1">
          <ExternalLink className="w-3 h-3" /> Voir le document
        </a>
        <textarea value={docComment} onChange={e => onCommentChange(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-black" placeholder="Commentaire (optionnel)..." disabled={processing} />
        <div className="flex gap-2">
          <button onClick={onClose} disabled={processing} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50">Annuler</button>
          <button onClick={onConfirm} disabled={processing} className={`flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-70 ${docAction === 'verifie' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Confirmer
          </button>
        </div>
      </div>
    </div>
  </div>
))
DocVerifyModal.displayName = 'DocVerifyModal'

// ============ COMPOSANT PRINCIPAL ============

export default function VerificationPrecepteurs() {
  const [allPrecepteurs, setAllPrecepteurs] = useState<Precepteur[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statutFilter, setStatutFilter] = useState('')
  const [page, setPage] = useState(1)
  const [stats, setStats] = useState<StatsType>({ en_attente: 0, verifie: 0, rejete: 0, total: 0 })
  const [message, setMessage] = useState('')
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})
  
  const [modal, setModal] = useState<ModalState>({
    type: null, precepteur: null, doc: null, docAction: 'verifie', comment: '', docComment: '', forceVerify: false
  })
  
  const [processing, setProcessing] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const [loadingDocs, setLoadingDocs] = useState(false)

  // Gestionnaire d'erreur d'image
  const handleImageError = useCallback((userId: string) => {
    setImgErrors(prev => ({ ...prev, [userId]: true }))
  }, [])

  // Toast
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => setMessage(''), 3000)
    return () => clearTimeout(timer)
  }, [message])

  // Reset page
  useEffect(() => { setPage(1) }, [statutFilter, searchTerm])

  // ✅ Calcul des statistiques locales
  const calculateStats = useCallback((precepteurs: Precepteur[]): StatsType => {
    return {
      en_attente: precepteurs.filter(p => p.statut_verification === 'en_attente').length,
      verifie: precepteurs.filter(p => p.statut_verification === 'verifie').length,
      rejete: precepteurs.filter(p => p.statut_verification === 'rejete').length,
      total: precepteurs.length
    }
  }, [])

  // ✅ Chargement depuis l'API Express
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getPrecepteursForVerification()
      
      if (result.success && result.precepteurs) {
        setAllPrecepteurs(result.precepteurs)
        setStats(result.stats || calculateStats(result.precepteurs))
      } else {
        setMessage('❌ ' + (result.error || 'Erreur de chargement'))
      }
    } catch (error) {
      console.error('❌ Erreur chargement:', error)
      setMessage('❌ Erreur lors du chargement')
    }
    setLoading(false)
  }, [calculateStats])

  useEffect(() => { loadData() }, [loadData])

  // ✅ Mise à jour des stats quand allPrecepteurs change
  useEffect(() => {
    setStats(calculateStats(allPrecepteurs))
  }, [allPrecepteurs, calculateStats])

  // Filtrage + pagination
  const { paginatedPrecepteurs, totalFiltered } = useMemo(() => {
    if (allPrecepteurs.length === 0) return { paginatedPrecepteurs: [], totalFiltered: 0 }
    
    let filtered = allPrecepteurs
    
    if (statutFilter) {
      filtered = filtered.filter(p => p.statut_verification === statutFilter)
      if (filtered.length === 0) return { paginatedPrecepteurs: [], totalFiltered: 0 }
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(p => {
        if (p.user?.username?.toLowerCase().includes(term)) return true
        if (p.user?.email?.toLowerCase().includes(term)) return true
        if (p.commune?.toLowerCase().includes(term)) return true
        if (p.diplome?.toLowerCase().includes(term)) return true
        return p.matieres?.some(m => m.matiere?.nom?.toLowerCase().includes(term))
      })
    }

    const start = (page - 1) * ITEMS_PER_PAGE
    return {
      paginatedPrecepteurs: filtered.slice(start, start + ITEMS_PER_PAGE),
      totalFiltered: filtered.length
    }
  }, [allPrecepteurs, statutFilter, searchTerm, page])

  const totalPages = Math.ceil(totalFiltered / ITEMS_PER_PAGE)

  // Chargement documents
  const loadDocuments = useCallback(async (userId: string) => {
    setLoadingDocs(true)
    try {
      const { documents: docs, error } = await getDocumentsByUserId(userId)
      if (!error && docs) setDocuments(docs)
      else setDocuments([])
    } catch (e) {
      setDocuments([])
    }
    setLoadingDocs(false)
  }, [])

  // ✅ Vérification via API Express - CORRIGÉ
  const handleVerification = useCallback(async (action: 'verifie' | 'rejete') => {
    if (!modal.precepteur) return
    setProcessing(true)
    try {
      const result = await updatePrecepteurVerificationStatus(modal.precepteur.id, action, modal.comment || undefined)
      
      if (result.success) {
        // ✅ Mise à jour optimiste de l'état local
        setAllPrecepteurs(prev => prev.map(p => 
          p.id === modal.precepteur?.id ? { ...p, statut_verification: action } : p
        ))
        
        // ✅ Mise à jour du précepteur dans le modal
        if (modal.precepteur) {
          setModal(prev => ({
            ...prev,
            precepteur: prev.precepteur ? { ...prev.precepteur, statut_verification: action } : null
          }))
        }
        
        setMessage(`✅ Précepteur ${action === 'verifie' ? 'vérifié' : 'rejeté'} avec succès`)
        
        // ✅ On garde le modal de détail ouvert pour voir le changement
        setModal(prev => ({
          ...prev,
          type: 'detail',
          comment: '',
          forceVerify: false
        }))
      } else {
        setMessage('❌ ' + (result.error || 'Erreur lors de la vérification'))
      }
    } catch (e: any) {
      console.error('❌ Erreur vérification:', e)
      setMessage('❌ ' + (e.message || 'Erreur lors de la vérification'))
    }
    setProcessing(false)
  }, [modal.precepteur, modal.comment])

  // ✅ Vérification document via API Express - CORRIGÉ
  const handleDocVerification = useCallback(async () => {
    if (!modal.doc) return
    setProcessing(true)
    try {
      const result = await updateDocumentStatus(modal.doc.id, modal.docAction, modal.docComment || undefined)
      if (result.success) {
        setDocuments(prev => prev.map(d => 
          d.id === modal.doc?.id ? { ...d, statut_verification: modal.docAction, commentaire_verification: modal.docComment || null } : d
        ))
        setMessage(`✅ Document ${modal.docAction === 'verifie' ? 'vérifié' : 'rejeté'} avec succès`)
        setModal(prev => ({ ...prev, type: 'detail', doc: null, docComment: '' }))
      } else {
        setMessage('❌ ' + (result.error || 'Erreur lors de la vérification du document'))
      }
    } catch (e: any) {
      console.error('❌ Erreur vérification document:', e)
      setMessage('❌ ' + (e.message || 'Erreur lors de la vérification du document'))
    }
    setProcessing(false)
  }, [modal.doc, modal.docAction, modal.docComment])

  const openDetails = useCallback((p: Precepteur) => {
    setModal({ type: 'detail', precepteur: p, doc: null, docAction: 'verifie', comment: '', docComment: '', forceVerify: false })
    loadDocuments(p.user_id)
  }, [loadDocuments])

  const openDocVerify = useCallback((doc: Document, action: 'verifie' | 'rejete') => {
    setModal(prev => ({ ...prev, type: 'docVerify', doc, docAction: action, docComment: doc.commentaire_verification || '' }))
  }, [])

  const openVerifyModal = useCallback((precepteur: Precepteur, forceVerify: boolean) => {
    setModal(prev => ({ ...prev, type: 'verify', precepteur, forceVerify }))
  }, [])

  const openRejectModal = useCallback((precepteur: Precepteur) => {
    setModal(prev => ({ ...prev, type: 'reject', precepteur }))
  }, [])

  const closeAllModals = useCallback(() => {
    setModal({ type: null, precepteur: null, doc: null, docAction: 'verifie', comment: '', docComment: '', forceVerify: false })
  }, [])

  const areAllDocsVerified = useMemo(() => 
    documents.length > 0 && documents.every(d => d.statut_verification === 'verifie'),
    [documents]
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-top-2 duration-300 ${message.includes('✅') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Shield className="w-6 h-6" /> Vérification des précepteurs</h1>
          <p className="text-sm text-gray-500 mt-0.5">{stats.total} précepteurs au total</p>
        </div>
        <button onClick={loadData} className="p-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors" title="Actualiser">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <StatsSection stats={stats} statutFilter={statutFilter} onFilterChange={setStatutFilter} />

      <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black" />
          </div>
          <select value={statutFilter} onChange={e => setStatutFilter(e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-white">
            <option value="">Tous les statuts</option>
            <option value="en_attente">En attente ({stats.en_attente})</option>
            <option value="verifie">Vérifié ({stats.verifie})</option>
            <option value="rejete">Rejeté ({stats.rejete})</option>
          </select>
          {(searchTerm || statutFilter) && (
            <button onClick={() => { setSearchTerm(''); setStatutFilter('') }} className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? <SkeletonLoader /> : paginatedPrecepteurs.length === 0 ? <EmptyState /> : (
          <>
            <div className="divide-y divide-gray-50">
              {paginatedPrecepteurs.map(p => (
                <PrecepteurRow key={p.id} precepteur={p} onClick={() => openDetails(p)} onImageError={handleImageError} imgErrors={imgErrors} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} totalFiltered={totalFiltered} statutFilter={statutFilter} onPageChange={setPage} />
          </>
        )}
      </div>

      {modal.type === 'detail' && modal.precepteur && (
        <DetailModal 
          precepteur={modal.precepteur} 
          documents={documents} 
          loadingDocs={loadingDocs} 
          areAllDocsVerified={areAllDocsVerified} 
          imgErrors={imgErrors} 
          onImageError={handleImageError} 
          onClose={closeAllModals}
          onVerify={openVerifyModal}
          onReject={openRejectModal}
          onDocVerify={openDocVerify} 
        />
      )}

      {(modal.type === 'verify' || modal.type === 'reject') && modal.precepteur && (
        <ConfirmModal 
          type={modal.type} 
          precepteur={modal.precepteur} 
          comment={modal.comment} 
          processing={processing} 
          forceVerify={modal.forceVerify}
          onClose={closeAllModals}
          onConfirm={handleVerification} 
          onCommentChange={c => setModal(prev => ({ ...prev, comment: c }))} 
        />
      )}

      {modal.type === 'docVerify' && modal.doc && (
        <DocVerifyModal 
          doc={modal.doc} 
          docAction={modal.docAction} 
          docComment={modal.docComment} 
          processing={processing} 
          onClose={closeAllModals}
          onConfirm={handleDocVerification} 
          onCommentChange={c => setModal(prev => ({ ...prev, docComment: c }))} 
        />
      )}
    </div>
  )
}