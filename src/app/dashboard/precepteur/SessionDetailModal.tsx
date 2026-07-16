// // src/app/dashboard/precepteur/SessionDetailModal.tsx
// 'use client'

// import { useState, useEffect } from 'react'
// import { 
//   X, 
//   Calendar, 
//   Clock, 
//   MapPin, 
//   Check,
//   FileText,
//   Play,
//   StopCircle,
//   Ban,
//   RotateCcw,
//   Building2
// } from 'lucide-react'
// import SessionFileUpload from './SessionFileUpload'
// import SessionGrades from './SessionGrades'
// type Session = {
//   id: number
//   contract_id: number
//   date_session: string
//   heure_debut: string
//   heure_fin: string
//   duree_minutes: number
//   statut: 'planifie' | 'en_cours' | 'termine' | 'annule' | 'reporte'
//   type_session: 'presentiel' | 'en_ligne' | 'hybride'
//   lieu: string | null
//   lien_visio: string | null
//   notes_precepteur: string | null
//   notes_parent: string | null
//   feedback_precepteur: string | null
//   feedback_parent: string | null
//   note_session: number | null
//   raison_annulation: string | null
//   annule_par: string | null
//   created_at: string
// }

// interface SessionDetailModalProps {
//   session: Session | null
//   isOpen: boolean
//   onClose: () => void
//   onStatusChange: (sessionId: number, newStatus: string) => Promise<void>
//   onNotesUpdate: (sessionId: number, notes: string) => Promise<void>
// }

// export default function SessionDetailModal({ 
//   session, 
//   isOpen, 
//   onClose, 
//   onStatusChange, 
//   onNotesUpdate 
// }: SessionDetailModalProps) {
//   const [notes, setNotes] = useState('')
//   const [saving, setSaving] = useState(false)

//   useEffect(() => {
//     if (session) {
//       setNotes(session.notes_precepteur || '')
//     }
//   }, [session])

//   if (!isOpen || !session) return null

//   const handleStatusChange = async (newStatus: string) => {
//     setSaving(true)
//     await onStatusChange(session.id, newStatus)
//     setSaving(false)
//   }

//   const handleNotesSave = async () => {
//     setSaving(true)
//     await onNotesUpdate(session.id, notes)
//     setSaving(false)
//   }

//   const getStatutActions = (statut: string) => {
//     switch (statut) {
//       case 'planifie':
//         return [
//           { label: 'Démarrer', value: 'en_cours', icon: Play, color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
//           { label: 'Annuler', value: 'annule', icon: Ban, color: 'bg-red-100 text-red-700 hover:bg-red-200' }
//         ]
//       case 'en_cours':
//         return [
//           { label: 'Terminer', value: 'termine', icon: StopCircle, color: 'bg-green-100 text-green-700 hover:bg-green-200' },
//           { label: 'Annuler', value: 'annule', icon: Ban, color: 'bg-red-100 text-red-700 hover:bg-red-200' }
//         ]
//       case 'termine':
//         return [
//           { label: 'Réouvrir', value: 'en_cours', icon: RotateCcw, color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' }
//         ]
//       case 'annule':
//         return [
//           { label: 'Réactiver', value: 'planifie', icon: RotateCcw, color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' }
//         ]
//       default:
//         return []
//     }
//   }

//   const getStatutColor = (statut: string) => {
//     switch (statut) {
//       case 'planifie': return 'bg-blue-100 text-blue-800'
//       case 'en_cours': return 'bg-yellow-100 text-yellow-800'
//       case 'termine': return 'bg-green-100 text-green-800'
//       case 'annule': return 'bg-red-100 text-red-800'
//       case 'reporte': return 'bg-purple-100 text-purple-800'
//       default: return 'bg-gray-100 text-gray-800'
//     }
//   }

//   const getStatutIcon = (statut: string) => {
//     switch (statut) {
//       case 'planifie': return <Calendar className="w-4 h-4" />
//       case 'en_cours': return <Clock className="w-4 h-4" />
//       case 'termine': return <Check className="w-4 h-4" />
//       case 'annule': return <X className="w-4 h-4" />
//       default: return <Calendar className="w-4 h-4" />
//     }
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
//         {/* En-tête */}
//         <div className="p-6 border-b flex justify-between items-center">
//           <h2 className="text-xl font-semibold">Détails de la session</h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="p-6 space-y-4">
//           {/* Statut actuel */}
//           <div className="flex items-center justify-between">
//             <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatutColor(session.statut)}`}>
//               {getStatutIcon(session.statut)}
//               Statut : {session.statut.replace('_', ' ')}
//             </span>
//           </div>

//           {/* Date et heure */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="bg-gray-50 p-4 rounded-xl">
//               <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                 <Calendar className="w-4 h-4" /> Date
//               </h3>
//               <p className="font-medium">
//                 {new Date(session.date_session).toLocaleDateString('fr-FR', { 
//                   weekday: 'long', 
//                   day: 'numeric', 
//                   month: 'long',
//                   year: 'numeric'
//                 })}
//               </p>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-xl">
//               <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                 <Clock className="w-4 h-4" /> Horaire
//               </h3>
//               <p className="font-medium">{session.heure_debut?.slice(0, 5)} - {session.heure_fin?.slice(0, 5)}</p>
//               <p className="text-sm text-gray-500">{session.duree_minutes} minutes</p>
//             </div>
//           </div>

//           {/* Type et lieu */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="bg-gray-50 p-4 rounded-xl">
//               <h3 className="text-sm font-medium text-gray-700 mb-2">Type</h3>
//               <p className="font-medium capitalize">{session.type_session?.replace('_', ' ')}</p>
//             </div>
//             <div className="bg-gray-50 p-4 rounded-xl">
//               <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                 <MapPin className="w-4 h-4" /> Lieu
//               </h3>
//               <p className="font-medium">{session.lieu || 'Non spécifié'}</p>
//               {/* ✅ Message si le lieu contient une adresse */}
//               {session.lieu && (session.lieu.includes('Avenue') || session.lieu.includes('Rue') || session.lieu.includes('Boulevard')) && (
//                 <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
//                   <Building2 className="w-3 h-3" />
//                   Adresse du parent de l'élève
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Lien visio */}
//           {session.lien_visio && (
//             <div className="bg-blue-50 p-4 rounded-xl">
//               <h3 className="text-sm font-medium text-blue-700 mb-1">Lien visio</h3>
//               <p className="text-sm text-blue-600 break-all">{session.lien_visio}</p>
//             </div>
//           )}

//           {/* Actions changement de statut */}
//           <div>
//             <h3 className="text-sm font-medium text-gray-700 mb-3">Changer le statut</h3>
//             <div className="flex flex-wrap gap-2">
//               {getStatutActions(session.statut).map((action) => (
//                 <button
//                   key={action.value}
//                   onClick={() => handleStatusChange(action.value)}
//                   disabled={saving}
//                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${action.color}`}
//                 >
//                   <action.icon className="w-4 h-4" />
//                   {action.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Notes du précepteur */}
//           <div>
//             <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//               <FileText className="w-4 h-4" /> Notes personnelles
//             </h3>
//             <textarea
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               placeholder="Ajoutez vos notes sur cette session..."
//               rows={4}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
//             />
//             <button
//               onClick={handleNotesSave}
//               disabled={saving}
//               className="mt-2 px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
//             >
//               {saving ? (
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
//               ) : (
//                 <Check className="w-4 h-4" />
//               )}
//               Sauvegarder les notes
//             </button>
//           </div>

//           <div className="border-t pt-4">
//   <SessionFileUpload sessionId={session.id} uploadedBy="precepteur" />
// </div>

// <div className="border-t pt-4">
//   <SessionGrades sessionId={session.id} />
// </div>
//         </div>
//       </div>
//     </div>
//   )
// }


// components/SessionDetailModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { updateSessionStatus, updateSessionNotes } from '@/lib/session-api'
import { 
  X, Calendar, Clock, MapPin, Check,
  FileText, Play, StopCircle, Ban, RotateCcw, Building2
} from 'lucide-react'
import SessionFileUpload from './SessionFileUpload'
import SessionGrades from './SessionGrades'

type Session = {
  id: number
  contract_id: number
  date_session: string
  heure_debut: string
  heure_fin: string
  duree_minutes: number
  statut: 'planifie' | 'en_cours' | 'termine' | 'annule' | 'reporte'
  type_session: 'presentiel' | 'en_ligne' | 'hybride'
  lieu: string | null
  lien_visio: string | null
  notes_precepteur: string | null
  notes_parent: string | null
  feedback_precepteur: string | null
  feedback_parent: string | null
  note_session: number | null
  raison_annulation: string | null
  annule_par: string | null
  created_at: string
}

interface SessionDetailModalProps {
  session: Session | null
  isOpen: boolean
  onClose: () => void
  onStatusChange: (sessionId: number, newStatus: string) => Promise<void>
  onNotesUpdate: (sessionId: number, notes: string) => Promise<void>
}

export default function SessionDetailModal({ 
  session, 
  isOpen, 
  onClose, 
  onStatusChange, 
  onNotesUpdate 
}: SessionDetailModalProps) {
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (session) {
      setNotes(session.notes_precepteur || '')
    }
  }, [session])

  if (!isOpen || !session) return null

  // ✅ Appels API Express
  const handleStatusChange = async (newStatus: string) => {
    setSaving(true)
    try {
      await updateSessionStatus(session.id, newStatus)
      await onStatusChange(session.id, newStatus)
    } catch (error) {
      console.error('Erreur changement statut:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleNotesSave = async () => {
    setSaving(true)
    try {
      await updateSessionNotes(session.id, notes)
      await onNotesUpdate(session.id, notes)
    } catch (error) {
      console.error('Erreur sauvegarde notes:', error)
    } finally {
      setSaving(false)
    }
  }

  const getStatutActions = (statut: string) => {
    switch (statut) {
      case 'planifie':
        return [
          { label: 'Démarrer', value: 'en_cours', icon: Play, color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
          { label: 'Annuler', value: 'annule', icon: Ban, color: 'bg-red-100 text-red-700 hover:bg-red-200' }
        ]
      case 'en_cours':
        return [
          { label: 'Terminer', value: 'termine', icon: StopCircle, color: 'bg-green-100 text-green-700 hover:bg-green-200' },
          { label: 'Annuler', value: 'annule', icon: Ban, color: 'bg-red-100 text-red-700 hover:bg-red-200' }
        ]
      case 'termine':
        return [
          { label: 'Réouvrir', value: 'en_cours', icon: RotateCcw, color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' }
        ]
      case 'annule':
        return [
          { label: 'Réactiver', value: 'planifie', icon: RotateCcw, color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' }
        ]
      default:
        return []
    }
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'planifie': return 'bg-blue-100 text-blue-800'
      case 'en_cours': return 'bg-yellow-100 text-yellow-800'
      case 'termine': return 'bg-green-100 text-green-800'
      case 'annule': return 'bg-red-100 text-red-800'
      case 'reporte': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'planifie': return <Calendar className="w-4 h-4" />
      case 'en_cours': return <Clock className="w-4 h-4" />
      case 'termine': return <Check className="w-4 h-4" />
      case 'annule': return <X className="w-4 h-4" />
      default: return <Calendar className="w-4 h-4" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Détails de la session</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Statut actuel */}
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatutColor(session.statut)}`}>
              {getStatutIcon(session.statut)}
              Statut : {session.statut.replace('_', ' ')}
            </span>
          </div>

          {/* Date et heure */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Date
              </h3>
              <p className="font-medium">
                {new Date(session.date_session).toLocaleDateString('fr-FR', { 
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Horaire
              </h3>
              <p className="font-medium">{session.heure_debut?.slice(0, 5)} - {session.heure_fin?.slice(0, 5)}</p>
              <p className="text-sm text-gray-500">{session.duree_minutes} minutes</p>
            </div>
          </div>

          {/* Type et lieu */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Type</h3>
              <p className="font-medium capitalize">{session.type_session?.replace('_', ' ')}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Lieu
              </h3>
              <p className="font-medium">{session.lieu || 'Non spécifié'}</p>
              {session.lieu && (session.lieu.includes('Avenue') || session.lieu.includes('Rue') || session.lieu.includes('Boulevard')) && (
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  Adresse du parent de l'élève
                </p>
              )}
            </div>
          </div>

          {/* Lien visio */}
          {session.lien_visio && (
            <div className="bg-blue-50 p-4 rounded-xl">
              <h3 className="text-sm font-medium text-blue-700 mb-1">Lien visio</h3>
              <p className="text-sm text-blue-600 break-all">{session.lien_visio}</p>
            </div>
          )}

          {/* Actions changement de statut */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Changer le statut</h3>
            <div className="flex flex-wrap gap-2">
              {getStatutActions(session.statut).map((action) => (
                <button
                  key={action.value}
                  onClick={() => handleStatusChange(action.value)}
                  disabled={saving}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${action.color}`}
                >
                  <action.icon className="w-4 h-4" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes du précepteur */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Notes personnelles
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajoutez vos notes sur cette session..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
            />
            <button
              onClick={handleNotesSave}
              disabled={saving}
              className="mt-2 px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Sauvegarder les notes
            </button>
          </div>

          {/* Fichiers */}
          <div className="border-t pt-4">
            <SessionFileUpload sessionId={session.id} uploadedBy="precepteur" />
          </div>

          {/* Cotations */}
          <div className="border-t pt-4">
            <SessionGrades sessionId={session.id} />
          </div>
        </div>
      </div>
    </div>
  )
}