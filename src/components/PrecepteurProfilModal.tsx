// // app/components/PrecepteurProfilModal.tsx

// 'use client'
// import AvisPrecepteurModal from '@/components/AvisPrecepteurModal'
// import { useState, useEffect } from 'react'
// import { getPrecepteurProfile, getPrecepteurStats } from '@/actions/recherche'
// import { 
//   X, 
//   MapPin, 
//   Star, 
//   Clock, 
//   BookOpen, 
//   GraduationCap, 
//   User, 
//   Calendar,
//   Check,
//   Award,
//   Users,
//   Phone,
//   Mail,
//   Building,
//   Shield,
//   MessageSquare,
//   ThumbsUp,
//   FileText
// } from 'lucide-react'
// import { CheckBadgeIcon } from '@heroicons/react/24/solid'

// type PrecepteurProfilModalProps = {
//   precepteurId: number
//   isOpen: boolean
//   onClose: () => void
//   onDemanderSession: () => void
// }

// export default function PrecepteurProfilModal({ 
//   precepteurId, 
//   isOpen, 
//   onClose,
//   onDemanderSession 
// }: PrecepteurProfilModalProps) {
//   const [profil, setProfil] = useState<any>(null)
//   const [stats, setStats] = useState<any>(null)
//   const [loading, setLoading] = useState(true)
// const [showAvisModal, setShowAvisModal] = useState(false)

//   useEffect(() => {
//     if (isOpen && precepteurId) {
//       loadProfile()
//     }
//   }, [isOpen, precepteurId])

//   const loadProfile = async () => {
//     setLoading(true)
//     try {
//       const [profileData, statsData] = await Promise.all([
//         getPrecepteurProfile(precepteurId),
//         getPrecepteurStats(precepteurId)
//       ])
//       setProfil(profileData)
//       setStats(statsData)
//     } catch (error) {
//       console.error('Erreur chargement profil:', error)
//     }
//     setLoading(false)
//   }

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div 
//         className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
//         onClick={onClose}
//       />
      
//       <div className="flex items-center justify-center min-h-screen p-4">
//         <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col">
          
//           {loading ? (
//             <div className="p-8 space-y-4 animate-pulse">
//               <div className="flex items-center gap-4">
//                 <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
//                 <div className="space-y-2 flex-1">
//                   <div className="h-5 bg-gray-200 rounded w-1/3"></div>
//                   <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//                 </div>
//               </div>
//               <div className="h-20 bg-gray-200 rounded"></div>
//               <div className="h-20 bg-gray-200 rounded"></div>
//             </div>
//           ) : profil ? (
//             <>
//               {/* Header */}
//               <div className="relative p-6 pb-4">
//                 <button 
//                   onClick={onClose}
//                   className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
//                 >
//                   <X className="w-5 h-5 text-gray-500" />
//                 </button>
                
//                 <div className="flex items-start gap-4">
//                   {/* Avatar */}
//                   <div className="relative">
//                     {profil.user?.photo_profil ? (
//                       <img 
//                         src={profil.user.photo_profil} 
//                         alt="" 
//                         className="w-16 h-16 rounded-2xl object-cover ring-2 ring-gray-100" 
//                       />
//                     ) : (
//                       <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ring-2 ring-gray-100">
//                         <User className="w-7 h-7 text-white" />
//                       </div>
//                     )}
//                     {profil.disponible && (
//                       <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
//                     )}
//                   </div>

//                   <div className="flex-1 min-w-0 pt-1">
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <h2 className="text-xl font-bold text-gray-900 truncate">
//                         {profil.user?.username}
//                       </h2>
//                       {profil.statut_verification === 'verifie' && (
//                         <CheckBadgeIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
//                       )}
//                     </div>
                    
//                     {/* Note */}
//                     <div className="flex items-center gap-2 mt-1">
//                       <div className="flex items-center">
//                         {[1, 2, 3, 4, 5].map((etoile) => (
//                           <Star 
//                             key={etoile}
//                             className={`w-4 h-4 ${
//                               etoile <= Math.round(profil.note_moyenne || 0)
//                                 ? 'text-yellow-500 fill-current'
//                                 : 'text-gray-300'
//                             }`}
//                           />
//                         ))}
//                       </div>
//                       <span className="font-bold text-sm text-gray-900">
//                         {profil.note_moyenne?.toFixed(1) || '0.0'}
//                       </span>

//                                             <button
//                         onClick={(e) => {
//                           e.stopPropagation()
//                           setShowAvisModal(true)
//                         }}
//                         className="text-xs text-blue-600 hover:underline"
//                       >
//                         ({stats?.totalEvaluations || 0} avis)
//                       </button>
//                       {/* <span className="text-xs text-gray-500">
//                         ({stats?.totalEvaluations || 0} avis)
//                       </span> */}
//                     </div>

//                     {/* Localisation */}
//                     <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
//                       <MapPin className="w-3.5 h-3.5" />
//                       {profil.commune}{profil.quartier ? `, ${profil.quartier}` : ''}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Stats rapides */}
//               {stats && (
//                 <div className="grid grid-cols-3 gap-3 px-6 pb-4">
//                   <div className="text-center p-3 bg-gray-50 rounded-xl">
//                     <div className="text-lg font-bold text-gray-900">{stats.totalSessions || 0}</div>
//                     <div className="text-xs text-gray-500">Sessions</div>
//                   </div>
//                   <div className="text-center p-3 bg-gray-50 rounded-xl">
//                     <div className="text-lg font-bold text-gray-900">{stats.contratsActifs || 0}</div>
//                     <div className="text-xs text-gray-500">Contrats actifs</div>
//                   </div>
//                   <div className="text-center p-3 bg-gray-50 rounded-xl">
//                     <div className="text-lg font-bold text-gray-900">{stats.moyenneNotes || '0.0'}</div>
//                     <div className="text-xs text-gray-500">Moyenne</div>
//                   </div>
//                 </div>
//               )}

//               {/* Détails */}
//               <div className="flex-1 overflow-y-auto px-6 pb-4">
//                 <div className="space-y-3">
//                   {/* Informations */}
//                   <div className="space-y-2">
//                     <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
//                       <User className="w-4 h-4" /> Informations
//                     </h3>
//                     <div className="grid grid-cols-2 gap-2">
//                       <InfoCard icon={Clock} label="Expérience" value={`${profil.annees_experience} an(s)`} />
//                       <InfoCard icon={GraduationCap} label="Diplôme" value={profil.diplome || 'Non spécifié'} />
//                       <InfoCard icon={Building} label="Établissement" value={profil.etablissement_origine || 'Non spécifié'} />
//                       <InfoCard icon={Users} label="Genre" value={profil.user?.genre === 'M' ? 'Masculin' : 'Féminin'} />
//                     </div>
//                   </div>

//                   {/* Matières */}
//                   {profil.matieres && profil.matieres.length > 0 && (
//                     <div>
//                       <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                         <BookOpen className="w-4 h-4" /> Matières enseignées
//                       </h3>
//                       <div className="flex flex-wrap gap-1.5">
//                         {profil.matieres.map((pm: any) => (
//                           <span 
//                             key={pm.matiere?.id || pm.matiere_id}
//                             className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium"
//                           >
//                             <BookOpen className="w-3 h-3" />
//                             {pm.matiere?.nom}
//                             <span className="text-blue-400">•</span>
//                             <span className="text-blue-500">{pm.matiere?.niveau}</span>
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Contact */}
//                   {profil.user?.email && (
//                     <div>
//                       <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                         <Mail className="w-4 h-4" /> Contact
//                       </h3>
//                       <div className="space-y-1.5">
//                         <div className="flex items-center gap-2 text-sm text-gray-600">
//                           <Mail className="w-3.5 h-3.5 text-gray-400" />
//                           {profil.user.email}
//                         </div>
//                         {profil.user?.telephone && (
//                           <div className="flex items-center gap-2 text-sm text-gray-600">
//                             <Phone className="w-3.5 h-3.5 text-gray-400" />
//                             {profil.user.telephone}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {/* Évaluations récentes */}
//                   {profil.evaluations && profil.evaluations.length > 0 && (
//                     <div>
//                       <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
//                         <MessageSquare className="w-4 h-4" /> Dernières évaluations
//                       </h3>
//                       <div className="space-y-2">
//                         {profil.evaluations.slice(0, 3).map((eval_: any) => (
//                           <div key={eval_.id} className="p-3 bg-gray-50 rounded-lg">
//                             <div className="flex items-center justify-between mb-1">
//                               <span className="text-xs font-medium text-gray-700">
//                                 {eval_.matiere?.nom} - {eval_.matiere?.niveau}
//                               </span>
//                               <div className="flex items-center gap-1">
//                                 <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
//                                 <span className="text-xs font-bold">{eval_.note}/20</span>
//                               </div>
//                             </div>
//                             {eval_.commentaire && (
//                               <p className="text-xs text-gray-500 line-clamp-2">{eval_.commentaire}</p>
//                             )}
//                             <p className="text-[10px] text-gray-400 mt-1">
//                               {new Date(eval_.date_evaluation).toLocaleDateString('fr-FR')}
//                             </p>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Vérification */}
//                   {profil.statut_verification === 'verifie' && (
//                     <div className="p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3">
//                       <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
//                       <div>
//                         <p className="text-sm font-medium text-green-800">Profil vérifié</p>
//                         <p className="text-xs text-green-600">Ce précepteur a été vérifié par notre équipe</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="border-t p-4 flex gap-3">
//                 <button
//                   onClick={onClose}
//                   className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
//                 >
//                   Fermer
//                 </button>
//                 <button
//                   onClick={() => {
//                     onClose()
//                     setTimeout(() => onDemanderSession(), 150)
//                   }}
//                   disabled={!profil.disponible}
//                   className="flex-1 px-4 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center gap-2"
//                 >
//                   <FileText className="w-4 h-4" />
//                   Proposer un contrat
//                 </button>
//               </div>
//             </>
//           ) : (
//             <div className="p-8 text-center">
//               <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//               <p className="text-gray-500">Profil non trouvé</p>
//             </div>
//           )}
//         </div>
//       </div>
//       <AvisPrecepteurModal
//   precepteurId={precepteurId}
//   isOpen={showAvisModal}
//   onClose={() => setShowAvisModal(false)}
// />
//     </div>
    
//   )
  
// }

// function InfoCard({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
//   return (
//     <div className="p-2.5 bg-gray-50 rounded-lg">
//       <div className="flex items-center gap-1.5 text-gray-400 mb-0.5">
//         <Icon className="w-3.5 h-3.5" />
//         <span className="text-[10px] uppercase tracking-wide">{label}</span>
//       </div>
//       <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
//     </div>
//   )
// }
// app/components/PrecepteurProfilModal.tsx

'use client'
import AvisPrecepteurModal from '@/components/AvisPrecepteurModal'
import { useState, useEffect } from 'react'
import { getPrecepteurProfile, getPrecepteurStats } from '@/actions/recherche'
import { 
  X, 
  MapPin, 
  Star, 
  Clock, 
  BookOpen, 
  GraduationCap, 
  User, 
  Calendar,
  Check,
  Award,
  Users,
  Phone,
  Mail,
  Building,
  Shield,
  MessageSquare,
  ThumbsUp,
  FileText
} from 'lucide-react'
import { CheckBadgeIcon } from '@heroicons/react/24/solid'

type PrecepteurProfilModalProps = {
  precepteurId: number
  isOpen: boolean
  onClose: () => void
  onDemanderSession: () => void
}

export default function PrecepteurProfilModal({ 
  precepteurId, 
  isOpen, 
  onClose,
  onDemanderSession 
}: PrecepteurProfilModalProps) {
  const [profil, setProfil] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAvisModal, setShowAvisModal] = useState(false)

  useEffect(() => {
    if (isOpen && precepteurId) {
      loadProfile()
    }
  }, [isOpen, precepteurId])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const [profileData, statsData] = await Promise.all([
        getPrecepteurProfile(precepteurId),
        getPrecepteurStats(precepteurId)
      ])
      setProfil(profileData)
      setStats(statsData)
    } catch (error) {
      console.error('Erreur chargement profil:', error)
    }
    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col">
          
          {loading ? (
            <div className="p-8 space-y-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ) : profil ? (
            <>
              {/* Header */}
              <div className="relative p-6 pb-4">
                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
                
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="relative">
                    {profil.user?.photo_profil ? (
                      <img 
                        src={profil.user.photo_profil} 
                        alt="" 
                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-gray-100" 
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ring-2 ring-gray-100">
                        <User className="w-7 h-7 text-white" />
                      </div>
                    )}
                    {profil.disponible && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl font-bold text-gray-900 truncate">
                        {profil.user?.username}
                      </h2>
                      {profil.statut_verification === 'verifie' && (
                        <CheckBadgeIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      )}
                    </div>
                    
                    {/* Note */}
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((etoile) => (
                          <Star 
                            key={etoile}
                            className={`w-4 h-4 ${
                              etoile <= Math.round(profil.note_moyenne || 0)
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-sm text-gray-900">
                        {profil.note_moyenne?.toFixed(1) || '0.0'}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowAvisModal(true)
                        }}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        ({stats?.totalEvaluations || 0} avis)
                      </button>
                    </div>

                    {/* Localisation */}
                    <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                      <MapPin className="w-3.5 h-3.5" />
                      {profil.commune}{profil.quartier ? `, ${profil.quartier}` : ''}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats rapides */}
              {stats && (
                <div className="grid grid-cols-3 gap-3 px-6 pb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-lg font-bold text-gray-900">{stats.totalSessions || 0}</div>
                    <div className="text-xs text-gray-500">Sessions</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-lg font-bold text-gray-900">{stats.contratsActifs || 0}</div>
                    <div className="text-xs text-gray-500">Contrats actifs</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-lg font-bold text-gray-900">{stats.moyenneNotes || '0.0'}</div>
                    <div className="text-xs text-gray-500">Moyenne</div>
                  </div>
                </div>
              )}

              {/* Détails */}
              <div className="flex-1 overflow-y-auto px-6 pb-4">
                <div className="space-y-3">
                  {/* Informations */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4" /> Informations
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <InfoCard icon={Clock} label="Expérience" value={`${profil.annees_experience} an(s)`} />
                      <InfoCard icon={GraduationCap} label="Diplôme" value={profil.diplome || 'Non spécifié'} />
                      <InfoCard icon={Building} label="Établissement" value={profil.etablissement_origine || 'Non spécifié'} />
                      <InfoCard icon={Users} label="Genre" value={profil.user?.genre === 'M' ? 'Masculin' : 'Féminin'} />
                    </div>
                  </div>

                  {/* Matières */}
                  {profil.matieres && profil.matieres.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> Matières enseignées
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {profil.matieres.map((pm: any) => (
                          <span 
                            key={pm.matiere?.id || pm.matiere_id}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium"
                          >
                            <BookOpen className="w-3 h-3" />
                            {pm.matiere?.nom}
                            <span className="text-blue-400">•</span>
                            <span className="text-blue-500">{pm.matiere?.niveau}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contact */}
                  {/* ← MODIFIER : Ajouter le téléphone du précepteur */}
                  {(profil.user?.email || profil.telephone) && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4" /> Contact
                      </h3>
                      <div className="space-y-1.5">
                        {/* ← AJOUTER : Téléphone du précepteur (prioritaire) */}
                        {profil.telephone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            <a 
                              href={`tel:${profil.telephone}`} 
                              className="hover:text-blue-600 hover:underline transition-colors"
                            >
                              {profil.telephone}
                            </a>
                          </div>
                        )}
                        
                        {/* Email de l'utilisateur */}
                        {profil.user?.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <a 
                              href={`mailto:${profil.user.email}`}
                              className="hover:text-blue-600 hover:underline transition-colors"
                            >
                              {profil.user.email}
                            </a>
                          </div>
                        )}
                        
                        {/* Téléphone de l'utilisateur (secondaire) */}
                        {profil.user?.telephone && !profil.telephone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            <a 
                              href={`tel:${profil.user.telephone}`}
                              className="hover:text-blue-600 hover:underline transition-colors"
                            >
                              {profil.user.telephone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Évaluations récentes */}
                  {profil.evaluations && profil.evaluations.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" /> Dernières évaluations
                      </h3>
                      <div className="space-y-2">
                        {profil.evaluations.slice(0, 3).map((eval_: any) => (
                          <div key={eval_.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-700">
                                {eval_.matiere?.nom} - {eval_.matiere?.niveau}
                              </span>
                              <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                                <span className="text-xs font-bold">{eval_.note}/20</span>
                              </div>
                            </div>
                            {eval_.commentaire && (
                              <p className="text-xs text-gray-500 line-clamp-2">{eval_.commentaire}</p>
                            )}
                            <p className="text-[10px] text-gray-400 mt-1">
                              {new Date(eval_.date_evaluation).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vérification */}
                  {profil.statut_verification === 'verifie' && (
                    <div className="p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3">
                      <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Profil vérifié</p>
                        <p className="text-xs text-green-600">Ce précepteur a été vérifié par notre équipe</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="border-t p-4 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    onClose()
                    setTimeout(() => onDemanderSession(), 150)
                  }}
                  disabled={!profil.disponible}
                  className="flex-1 px-4 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Proposer un contrat
                </button>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Profil non trouvé</p>
            </div>
          )}
        </div>
      </div>
      
      <AvisPrecepteurModal
        precepteurId={precepteurId}
        isOpen={showAvisModal}
        onClose={() => setShowAvisModal(false)}
      />
    </div>
  )
}

function InfoCard({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="p-2.5 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-1.5 text-gray-400 mb-0.5">
        <Icon className="w-3.5 h-3.5" />
        <span className="text-[10px] uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
    </div>
  )
}