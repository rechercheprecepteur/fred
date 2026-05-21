// // app/components/ProfilModal.tsx
// 'use client'

// import { useState } from 'react'
// import { 
//   PiX, 
//   PiBookOpen, 
//   PiMapPin, 
//   PiClock, 
//   PiGraduationCap, 
//   PiCheck,
//   PiFloppyDisk
// } from 'react-icons/pi'
// import SelectionMatieres from './SelectionMatieres'

// interface ProfilForm {
//   latitude: string
//   longitude: string
//   commune: string
//   quartier: string
//   annees_experience: number
//   diplome: string
//   etablissement_origine: string
// }

// interface ProfilModalProps {
//   isOpen: boolean
//   onClose: () => void
//   onSave: (data: ProfilForm & { matieres: number[] }) => Promise<void>
//   initialData: ProfilForm
//   selectedMatieres: number[]
//   onMatieresChange: (matieres: number[]) => void
//   saving: boolean
// }

// export default function ProfilModal({
//   isOpen,
//   onClose,
//   onSave,
//   initialData,
//   selectedMatieres,
//   onMatieresChange,
//   saving
// }: ProfilModalProps) {
//   const [form, setForm] = useState<ProfilForm>(initialData)

//   useState(() => {
//     setForm(initialData)
//   })

//   if (!isOpen) return null

//   const handleSave = async () => {
//     await onSave({
//       ...form,
//       matieres: selectedMatieres
//     })
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         {/* En-tête du modal */}
//         <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
//           <div>
//             <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//               <PiGraduationCap className="w-5 h-5 text-gray-700" />
//               Modifier le profil
//             </h2>
//             <p className="text-sm text-gray-500 mt-0.5">Mettez à jour vos informations professionnelles</p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <PiX className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="p-6 space-y-6">
//           {/* Section Matières */}
//           <div className="bg-gradient-to-br p border-blue-100">
//             <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
//               <PiBookOpen className="w-4 h-4 text-blue-600" />
//               Matières enseignées
//             </h3>
//             <SelectionMatieres
//               selectedIds={selectedMatieres}
//               onMatieresChange={onMatieresChange}
//             />
//             {selectedMatieres.length > 0 && (
//               <p className="text-xs text-blue-700 mt-3 font-medium">
//                 {selectedMatieres.length} matière{selectedMatieres.length > 1 ? 's' : ''} sélectionnée{selectedMatieres.length > 1 ? 's' : ''}
//               </p>
//             )}
//           </div>

//           {/* Section Localisation */}
//           <div>
//             <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
//               <PiMapPin className="w-4 h-4 text-gray-700" />
//               Localisation
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1">Commune *</label>
//                 <input
//                   type="text"
//                   value={form.commune}
//                   onChange={(e) => setForm({...form, commune: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
//                   placeholder="Lubumbashi"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1">Quartier *</label>
//                 <input
//                   type="text"
//                   value={form.quartier}
//                   onChange={(e) => setForm({...form, quartier: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
//                   placeholder="Golf"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1">Latitude</label>
//                 <input
//                   type="text"
//                   value={form.latitude}
//                   onChange={(e) => setForm({...form, latitude: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
//                   placeholder="-11.6646"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1">Longitude</label>
//                 <input
//                   type="text"
//                   value={form.longitude}
//                   onChange={(e) => setForm({...form, longitude: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
//                   placeholder="27.4794"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Section Expérience & Formation */}
//           <div>
//             <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
//               <PiGraduationCap className="w-4 h-4 text-gray-700" />
//               Expérience & Formation
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1">
//                   <PiClock className="w-3 h-3 inline mr-1" />
//                   Années d'expérience
//                 </label>
//                 <input
//                   type="number"
//                   value={form.annees_experience}
//                   onChange={(e) => setForm({...form, annees_experience: parseInt(e.target.value) || 0})}
//                   className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
//                   min="0"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-700 mb-1">Diplôme</label>
//                 <input
//                   type="text"
//                   value={form.diplome}
//                   onChange={(e) => setForm({...form, diplome: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
//                   placeholder="Licence en Mathématiques"
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-xs font-medium text-gray-700 mb-1">Établissement d'origine</label>
//                 <input
//                   type="text"
//                   value={form.etablissement_origine}
//                   onChange={(e) => setForm({...form, etablissement_origine: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
//                   placeholder="Université de Lubumbashi"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex gap-3 justify-end rounded-b-2xl">
//           <button
//             onClick={onClose}
//             className="px-4 py-2.5 border border-gray-200 text-gray-700 text-sm rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2 font-medium"
//           >
//             <PiX className="w-4 h-4" />
//             Annuler
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={saving}
//             className="px-6 py-2.5 bg-black text-white text-sm rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center gap-2 font-medium"
//           >
//             {saving ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                 Enregistrement...
//               </>
//             ) : (
//               <>
//                 <PiFloppyDisk className="w-4 h-4" />
//                 Enregistrer
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// app/components/ProfilModal.tsx
'use client'

import { useState } from 'react'
import { 
  PiX, 
  PiBookOpen, 
  PiMapPin, 
  PiClock, 
  PiGraduationCap, 
  PiCheck,
  PiFloppyDisk,
  PiPhone  // ← AJOUTER l'icône téléphone
} from 'react-icons/pi'
import SelectionMatieres from './SelectionMatieres'

// ← MODIFIER : Ajouter telephone dans l'interface
interface ProfilForm {
  latitude: string
  longitude: string
  commune: string
  quartier: string
  annees_experience: number
  diplome: string
  etablissement_origine: string
  telephone: string  // ← AJOUTER
}

interface ProfilModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: ProfilForm & { matieres: number[] }) => Promise<void>
  initialData: ProfilForm
  selectedMatieres: number[]
  onMatieresChange: (matieres: number[]) => void
  saving: boolean
}

export default function ProfilModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  selectedMatieres,
  onMatieresChange,
  saving
}: ProfilModalProps) {
  const [form, setForm] = useState<ProfilForm>(initialData)

  useState(() => {
    setForm(initialData)
  })

  if (!isOpen) return null

  const handleSave = async () => {
    await onSave({
      ...form,
      matieres: selectedMatieres
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* En-tête du modal */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <PiGraduationCap className="w-5 h-5 text-gray-700" />
              Modifier le profil
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">Mettez à jour vos informations professionnelles</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <PiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* ← AJOUTER : Section Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <PiPhone className="w-4 h-4 text-gray-700" />
              Contact
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div>
               
                <input
                  type="tel"
                  value={form.telephone}
                  onChange={(e) => setForm({...form, telephone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="+243 812 345 678"
                />
              </div>
            </div>
          </div>

          {/* Section Matières */}
          <div className="bg-gradient-to-br p border-blue-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <PiBookOpen className="w-4 h-4 text-blue-600" />
              Matières enseignées
            </h3>
            <SelectionMatieres
              selectedIds={selectedMatieres}
              onMatieresChange={onMatieresChange}
            />
            {selectedMatieres.length > 0 && (
              <p className="text-xs text-blue-700 mt-3 font-medium">
                {selectedMatieres.length} matière{selectedMatieres.length > 1 ? 's' : ''} sélectionnée{selectedMatieres.length > 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Section Localisation */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <PiMapPin className="w-4 h-4 text-gray-700" />
              Localisation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Commune *</label>
                <input
                  type="text"
                  value={form.commune}
                  onChange={(e) => setForm({...form, commune: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="Lubumbashi"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Quartier *</label>
                <input
                  type="text"
                  value={form.quartier}
                  onChange={(e) => setForm({...form, quartier: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="Golf"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Latitude</label>
                <input
                  type="text"
                  value={form.latitude}
                  onChange={(e) => setForm({...form, latitude: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="-11.6646"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Longitude</label>
                <input
                  type="text"
                  value={form.longitude}
                  onChange={(e) => setForm({...form, longitude: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="27.4794"
                />
              </div>
            </div>
          </div>

          {/* Section Expérience & Formation */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <PiGraduationCap className="w-4 h-4 text-gray-700" />
              Expérience & Formation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  <PiClock className="w-3 h-3 inline mr-1" />
                  Années d'expérience
                </label>
                <input
                  type="number"
                  value={form.annees_experience}
                  onChange={(e) => setForm({...form, annees_experience: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Diplôme</label>
                <input
                  type="text"
                  value={form.diplome}
                  onChange={(e) => setForm({...form, diplome: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="Licence en Mathématiques"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Établissement d'origine</label>
                <input
                  type="text"
                  value={form.etablissement_origine}
                  onChange={(e) => setForm({...form, etablissement_origine: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="Université de Lubumbashi"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex gap-3 justify-end rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-gray-200 text-gray-700 text-sm rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2 font-medium"
          >
            <PiX className="w-4 h-4" />
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-black text-white text-sm rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center gap-2 font-medium"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Enregistrement...
              </>
            ) : (
              <>
                <PiFloppyDisk className="w-4 h-4" />
                Enregistrer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}