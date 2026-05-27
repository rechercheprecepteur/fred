

// 'use client'

// import { useState, useEffect, useMemo } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import { demanderContract } from '@/actions/recherche'
// import { supabase } from '@/lib/supabase'
// import { 
//   X, 
//   User, 
//   BookOpen, 
//   Calendar, 
//   Clock, 
//   Check,
//   AlertCircle,
//   FileText,
//   ArrowUp,
//   RefreshCw,
//   Calculator
// } from 'lucide-react'

// type DemandeContractModalProps = {
//   precepteur: any
//   isOpen: boolean
//   onClose: () => void
// }

// export default function DemandeContractModal({ precepteur, isOpen, onClose }: DemandeContractModalProps) {
//   const { user } = useAuth()
//   const [contractData, setContractData] = useState({
//     eleveId: '',
//     matiereId: '',
//     dateDebut: new Date().toISOString().split('T')[0],
//     dateFin: '',
//     heureDebutPref: '08:00',
//     heureFinPref: '10:00',
//     joursPref: '1,2,3,4,5',
//     typeContrat: 'recurrent',
//     frequence: 'hebdomadaire' as 'quotidien' | 'hebdomadaire' | 'bihebdomadaire' | 'mensuel',
//     tarifHoraire: '',
//     notes: ''
//   })
//   const [eleves, setEleves] = useState<any[]>([])
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [submitting, setSubmitting] = useState(false)
//   const [loadingEleves, setLoadingEleves] = useState(false)

//   const joursSemaine = [
//     { value: '1', label: 'Lun' },
//     { value: '2', label: 'Mar' },
//     { value: '3', label: 'Mer' },
//     { value: '4', label: 'Jeu' },
//     { value: '5', label: 'Ven' },
//     { value: '6', label: 'Sam' },
//     { value: '0', label: 'Dim' }
//   ]

//   const frequences = [
//     { value: 'quotidien', label: 'Quotidien', multiplicateur: 5 },
//     { value: 'hebdomadaire', label: 'Hebdomadaire', multiplicateur: 1 },
//     { value: 'bihebdomadaire', label: 'Bi-hebdomadaire', multiplicateur: 0.5 },
//     { value: 'mensuel', label: 'Mensuel', multiplicateur: 0.25 }
//   ]

//   // Calculer la date de fin par défaut (début + 3 mois)
//   const getDefaultDateFin = (dateDebut: string) => {
//     if (!dateDebut) return ''
//     const debut = new Date(dateDebut)
//     debut.setMonth(debut.getMonth() + 3)
//     return debut.toISOString().split('T')[0]
//   }

//   // Calcul du nombre d'heures par séance
//   const heuresParSeance = useMemo(() => {
//     if (!contractData.heureDebutPref || !contractData.heureFinPref) return 0
//     const [hDebut, mDebut] = contractData.heureDebutPref.split(':').map(Number)
//     const [hFin, mFin] = contractData.heureFinPref.split(':').map(Number)
//     return (hFin + mFin / 60) - (hDebut + mDebut / 60)
//   }, [contractData.heureDebutPref, contractData.heureFinPref])

//   // Calcul du nombre de jours sélectionnés par semaine
//   const joursParSemaine = useMemo(() => {
//     return contractData.joursPref.split(',').filter(j => j).length
//   }, [contractData.joursPref])

//   // Calcul du tarif par séance
//   const tarifParSeance = useMemo(() => {
//     if (!contractData.tarifHoraire || !heuresParSeance) return 0
//     return parseFloat(contractData.tarifHoraire) * heuresParSeance
//   }, [contractData.tarifHoraire, heuresParSeance])

//   // Calcul du nombre de semaines dans la période
//   const nombreSemaines = useMemo(() => {
//     if (!contractData.dateDebut || !contractData.dateFin) return 0
//     const debut = new Date(contractData.dateDebut)
//     const fin = new Date(contractData.dateFin)
//     const diffMs = fin.getTime() - debut.getTime()
//     return Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 7))
//   }, [contractData.dateDebut, contractData.dateFin])

//   // Calcul du nombre total de séances estimé
//   const nombreSeancesEstime = useMemo(() => {
//     if (!nombreSemaines || !joursParSemaine) return 0
//     const freq = frequences.find(f => f.value === contractData.frequence)
//     if (!freq) return 0
//     return Math.ceil(nombreSemaines * joursParSemaine * freq.multiplicateur)
//   }, [nombreSemaines, joursParSemaine, contractData.frequence])

//   // Calcul du montant total estimé
//   const montantTotalEstime = useMemo(() => {
//     return tarifParSeance * nombreSeancesEstime
//   }, [tarifParSeance, nombreSeancesEstime])

//   useEffect(() => {
//     if (isOpen && user) {
//       loadEleves()
//       const debut = new Date().toISOString().split('T')[0]
//       setContractData({
//         eleveId: '',
//         matiereId: '',
//         dateDebut: debut,
//         dateFin: getDefaultDateFin(debut),
//         heureDebutPref: '08:00',
//         heureFinPref: '10:00',
//         joursPref: '1,2,3,4,5',
//         typeContrat: 'recurrent',
//         frequence: 'hebdomadaire',
//         tarifHoraire: '',
//         notes: ''
//       })
//       setError('')
//       setSuccess('')
//     }
//   }, [isOpen, user])

//   const loadEleves = async () => {
//     if (!user) return
    
//     setLoadingEleves(true)
//     try {
//       const { data: parent, error: parentError } = await supabase
//         .from('parents')
//         .select('id')
//         .eq('user_id', user.id)
//         .single()

//       if (parentError && parentError.code === 'PGRST116') {
//         const { data: newParent } = await supabase
//           .from('parents')
//           .insert([{ user_id: user.id }])
//           .select('id')
//           .single()
        
//         if (newParent) {
//           setEleves([])
//           setLoadingEleves(false)
//           return
//         }
//       }

//       if (parentError || !parent) {
//         setLoadingEleves(false)
//         return
//       }

//       const { data: elevesData } = await supabase
//         .from('eleves')
//         .select('id, nom, prenom, niveau')
//         .eq('parent_id', parent.id)
//         .order('prenom')

//       setEleves(elevesData || [])
//     } catch (err) {
//       console.error('Erreur chargement élèves:', err)
//     } finally {
//       setLoadingEleves(false)
//     }
//   }

//   const toggleJour = (jourValue: string) => {
//     const jours = contractData.joursPref.split(',').filter(j => j)
//     if (jours.includes(jourValue)) {
//       setContractData({
//         ...contractData,
//         joursPref: jours.filter(j => j !== jourValue).join(',')
//       })
//     } else {
//       setContractData({
//         ...contractData,
//         joursPref: [...jours, jourValue].join(',')
//       })
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')
//     setSuccess('')
//     setSubmitting(true)

//     if (!contractData.eleveId || !contractData.matiereId || !contractData.dateDebut || !contractData.dateFin) {
//       setError('Veuillez remplir tous les champs obligatoires')
//       setSubmitting(false)
//       return
//     }

//     if (new Date(contractData.dateFin) <= new Date(contractData.dateDebut)) {
//       setError('La date de fin doit être après la date de début')
//       setSubmitting(false)
//       return
//     }

//     const result = await demanderContract({
//       precepteurId: precepteur.id,
//       eleveId: parseInt(contractData.eleveId),
//       matiereId: parseInt(contractData.matiereId),
//       dateDebut: contractData.dateDebut,
//       dateFin: contractData.dateFin,
//       heureDebutPref: contractData.heureDebutPref,
//       heureFinPref: contractData.heureFinPref,
//       joursPref: contractData.joursPref,
//       typeContrat: contractData.typeContrat as 'recurrent' | 'ponctuel',
//       frequence: contractData.frequence,
//       tarifHoraire: contractData.tarifHoraire ? parseFloat(contractData.tarifHoraire) : undefined,
//       notes: contractData.notes || undefined
//     })

//     if (result.success) {
//       setSuccess('Proposition envoyée avec succès !')
//       setTimeout(() => onClose(), 2000)
//     } else {
//       setError(result.error || 'Une erreur est survenue')
//     }
    
//     setSubmitting(false)
//   }

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="p-6 border-b flex justify-between items-center">
//           <h2 className="text-xl font-semibold flex items-center gap-2">
//             <FileText className="w-5 h-5" /> Proposer un contrat
//           </h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {success ? (
//           <div className="p-8 text-center">
//             <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
//             <p className="font-medium text-green-700">{success}</p>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} className="p-6 space-y-4">
//             {error && (
//               <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
//                 <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
//               </div>
//             )}

//             {/* Précepteur info */}
//             <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
//               {precepteur.user?.photo_profil ? (
//                 <img src={precepteur.user.photo_profil} alt="" className="w-10 h-10 rounded-full object-cover" />
//               ) : (
//                 <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
//                   <User className="w-5 h-5 text-blue-600" />
//                 </div>
//               )}
//               <div>
//                 <p className="font-medium text-sm">{precepteur.user?.username}</p>
//                 <p className="text-xs text-gray-500">{precepteur.commune}</p>
//               </div>
//             </div>

//             {/* Élève */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Enfant *</label>
//               {loadingEleves ? (
//                 <div className="text-sm text-gray-400 py-2">Chargement...</div>
//               ) : eleves.length === 0 ? (
//                 <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
//                   Aucun enfant trouvé. Ajoutez-en un dans votre tableau de bord.
//                 </div>
//               ) : (
//                 <select
//                   value={contractData.eleveId}
//                   onChange={(e) => setContractData({...contractData, eleveId: e.target.value})}
//                   required
//                   className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//                 >
//                   <option value="">Sélectionner un enfant</option>
//                   {eleves.map((eleve) => (
//                     <option key={eleve.id} value={eleve.id}>
//                       {eleve.prenom} {eleve.nom} - {eleve.niveau}
//                     </option>
//                   ))}
//                 </select>
//               )}
//             </div>

//             {/* Matière */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Matière *</label>
//               <select
//                 value={contractData.matiereId}
//                 onChange={(e) => setContractData({...contractData, matiereId: e.target.value})}
//                 required
//                 className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//               >
//                 <option value="">Sélectionner une matière</option>
//                 {precepteur.matieres?.map((pm: any) => (
//                   <option key={pm.matiere_id} value={pm.matiere_id}>
//                     {pm.matiere?.nom} {pm.matiere?.niveau ? `(${pm.matiere.niveau})` : ''}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Dates */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Début *</label>
//                 <input
//                   type="date"
//                   value={contractData.dateDebut}
//                   onChange={(e) => {
//                     const newDebut = e.target.value
//                     setContractData({
//                       ...contractData, 
//                       dateDebut: newDebut,
//                       dateFin: getDefaultDateFin(newDebut)
//                     })
//                   }}
//                   required
//                   min={new Date().toISOString().split('T')[0]}
//                   className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Fin *</label>
//                 <input
//                   type="date"
//                   value={contractData.dateFin}
//                   onChange={(e) => setContractData({...contractData, dateFin: e.target.value})}
//                   required
//                   min={contractData.dateDebut || new Date().toISOString().split('T')[0]}
//                   className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//                 />
//               </div>
//             </div>

//             {/* Horaires */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Heure début</label>
//                 <input
//                   type="time"
//                   value={contractData.heureDebutPref}
//                   onChange={(e) => setContractData({...contractData, heureDebutPref: e.target.value})}
//                   className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Heure fin</label>
//                 <input
//                   type="time"
//                   value={contractData.heureFinPref}
//                   onChange={(e) => setContractData({...contractData, heureFinPref: e.target.value})}
//                   className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//                 />
//               </div>
//             </div>

//             {/* Jours */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Jours</label>
//               <div className="flex flex-wrap gap-1.5">
//                 {joursSemaine.map((jour) => (
//                   <button
//                     key={jour.value}
//                     type="button"
//                     onClick={() => toggleJour(jour.value)}
//                     className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
//                       contractData.joursPref.split(',').includes(jour.value)
//                         ? 'bg-black text-white'
//                         : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                     }`}
//                   >
//                     {jour.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Fréquence */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <RefreshCw className="w-4 h-4 inline mr-1" />
//                 Fréquence des cours
//               </label>
//               <div className="grid grid-cols-2 gap-2">
//                 {frequences.map((freq) => (
//                   <button
//                     key={freq.value}
//                     type="button"
//                     onClick={() => setContractData({...contractData, frequence: freq.value as any})}
//                     className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
//                       contractData.frequence === freq.value
//                         ? 'bg-black text-white border-black'
//                         : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
//                     }`}
//                   >
//                     {freq.label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Tarif */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Tarif horaire (FC)</label>
//               <div className="relative">
//                 <input
//                   type="number"
//                   value={contractData.tarifHoraire}
//                   onChange={(e) => setContractData({...contractData, tarifHoraire: e.target.value})}
//                   placeholder="5000"
//                   className="w-full pl-3 pr-12 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//                 />
//                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">FC</span>
//               </div>
//             </div>

//             {/* Résumé du calcul */}
//             {tarifParSeance > 0 && nombreSeancesEstime > 0 && (
//               <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
//                 <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
//                   <Calculator className="w-4 h-4" />
//                   Estimation du coût total
//                 </h3>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between text-blue-800">
//                     <span>Heures par séance</span>
//                     <span className="font-medium">{heuresParSeance.toFixed(1)}h</span>
//                   </div>
//                   <div className="flex justify-between text-blue-800">
//                     <span>Tarif par séance</span>
//                     <span className="font-medium">{tarifParSeance.toLocaleString()} FC</span>
//                   </div>
//                   <div className="flex justify-between text-blue-800">
//                     <span>Jours/semaine</span>
//                     <span className="font-medium">{joursParSemaine}</span>
//                   </div>
//                   <div className="flex justify-between text-blue-800">
//                     <span>Fréquence</span>
//                     <span className="font-medium">{frequences.find(f => f.value === contractData.frequence)?.label}</span>
//                   </div>
//                   <div className="flex justify-between text-blue-800">
//                     <span>Durée estimée</span>
//                     <span className="font-medium">{nombreSemaines} semaines</span>
//                   </div>
//                   <div className="flex justify-between text-blue-800">
//                     <span>Séances estimées</span>
//                     <span className="font-medium">{nombreSeancesEstime}</span>
//                   </div>
//                   <div className="pt-2 mt-2 border-t border-blue-200 flex justify-between text-blue-900 font-bold">
//                     <span>Total estimé</span>
//                     <span>{montantTotalEstime.toLocaleString()} FC</span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Notes */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Message (optionnel)</label>
//               <textarea
//                 value={contractData.notes}
//                 onChange={(e) => setContractData({...contractData, notes: e.target.value})}
//                 placeholder="Vos attentes, remarques..."
//                 rows={3}
//                 className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
//               />
//             </div>

//             {/* Boutons */}
//             <div className="flex gap-2 pt-2">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
//               >
//                 Annuler
//               </button>
//               <button
//                 type="submit"
//                 disabled={submitting || loadingEleves || eleves.length === 0}
//                 className="flex-1 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-40 transition-colors text-sm flex items-center justify-center gap-2 font-medium"
//               >
//                 {submitting ? (
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
//                 ) : (
//                   <ArrowUp className="w-4 h-4" />
//                 )}
//                 {submitting ? 'Envoi...' : 'Proposer'}
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   )
// }


'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/context/AuthContext'
import { demanderContract } from '@/actions/recherche'
import { supabase } from '@/lib/supabase'
import { 
  X, 
  User, 
  FileText,
  ArrowUp,
  Calculator
} from 'lucide-react'

type DemandeContractModalProps = {
  precepteur: any
  isOpen: boolean
  onClose: () => void
}

export default function DemandeContractModal({ precepteur, isOpen, onClose }: DemandeContractModalProps) {
  const { user } = useAuth()
  const [contractData, setContractData] = useState({
    eleveId: '',
    matiereId: '',
    dateDebut: new Date().toISOString().split('T')[0],
    dateFin: '',
    heureDebutPref: '08:00',
    heureFinPref: '10:00',
    joursPref: '1,2,3,4,5',
    typeContrat: 'recurrent',
    frequence: 'hebdomadaire' as 'hebdomadaire' | 'mensuel',
    tarifHoraire: '',
    notes: ''
  })
  const [eleves, setEleves] = useState<any[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loadingEleves, setLoadingEleves] = useState(false)

  const joursSemaine = [
    { value: '1', label: 'Lun' },
    { value: '2', label: 'Mar' },
    { value: '3', label: 'Mer' },
    { value: '4', label: 'Jeu' },
    { value: '5', label: 'Ven' },
    { value: '6', label: 'Sam' },
    { value: '0', label: 'Dim' }
  ]

  // Date de fin par défaut : début + 3 mois
  const getDefaultDateFin = (dateDebut: string) => {
    if (!dateDebut) return ''
    const debut = new Date(dateDebut)
    debut.setMonth(debut.getMonth() + 3)
    return debut.toISOString().split('T')[0]
  }

  // Heures par séance
  const heuresParSeance = useMemo(() => {
    if (!contractData.heureDebutPref || !contractData.heureFinPref) return 0
    const [hDebut, mDebut] = contractData.heureDebutPref.split(':').map(Number)
    const [hFin, mFin] = contractData.heureFinPref.split(':').map(Number)
    return (hFin + mFin / 60) - (hDebut + mDebut / 60)
  }, [contractData.heureDebutPref, contractData.heureFinPref])

  // Jours sélectionnés par semaine
  const joursParSemaine = useMemo(() => {
    return contractData.joursPref.split(',').filter(j => j).length
  }, [contractData.joursPref])

  // Nombre de semaines entre les deux dates
  const nombreSemaines = useMemo(() => {
    if (!contractData.dateDebut || !contractData.dateFin) return 0
    const debut = new Date(contractData.dateDebut)
    const fin = new Date(contractData.dateFin)
    const diffMs = fin.getTime() - debut.getTime()
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 7))
  }, [contractData.dateDebut, contractData.dateFin])

  // Nombre total de séances estimé
  const nombreSeancesEstime = useMemo(() => {
    if (!nombreSemaines || !joursParSemaine) return 0
    
    if (contractData.frequence === 'hebdomadaire') {
      // Chaque semaine, tous les jours cochés
      return nombreSemaines * joursParSemaine
    } else {
      // Mensuel : 1 fois par mois (1 mois = 4 semaines)
      const nombreMois = Math.ceil(nombreSemaines / 4)
      return nombreMois
    }
  }, [nombreSemaines, joursParSemaine, contractData.frequence])

  // Tarif par séance
  const tarifParSeance = useMemo(() => {
    if (!contractData.tarifHoraire || !heuresParSeance) return 0
    return parseFloat(contractData.tarifHoraire) * heuresParSeance
  }, [contractData.tarifHoraire, heuresParSeance])

  // Montant total estimé
  const montantTotalEstime = useMemo(() => {
    return tarifParSeance * nombreSeancesEstime
  }, [tarifParSeance, nombreSeancesEstime])

  useEffect(() => {
    if (isOpen && user) {
      loadEleves()
      const debut = new Date().toISOString().split('T')[0]
      setContractData({
        eleveId: '',
        matiereId: '',
        dateDebut: debut,
        dateFin: getDefaultDateFin(debut),
        heureDebutPref: '08:00',
        heureFinPref: '10:00',
        joursPref: '1,2,3,4,5',
        typeContrat: 'recurrent',
        frequence: 'hebdomadaire',
        tarifHoraire: '',
        notes: ''
      })
      setError('')
      setSuccess('')
    }
  }, [isOpen, user])

  const loadEleves = async () => {
    if (!user) return
    
    setLoadingEleves(true)
    try {
      const { data: parent, error: parentError } = await supabase
        .from('parents')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (parentError && parentError.code === 'PGRST116') {
        const { data: newParent } = await supabase
          .from('parents')
          .insert([{ user_id: user.id }])
          .select('id')
          .single()
        
        if (newParent) {
          setEleves([])
          setLoadingEleves(false)
          return
        }
      }

      if (parentError || !parent) {
        setLoadingEleves(false)
        return
      }

      const { data: elevesData } = await supabase
        .from('eleves')
        .select('id, nom, prenom, niveau')
        .eq('parent_id', parent.id)
        .order('prenom')

      setEleves(elevesData || [])
    } catch (err) {
      console.error('Erreur chargement élèves:', err)
    } finally {
      setLoadingEleves(false)
    }
  }

  const toggleJour = (jourValue: string) => {
    const jours = contractData.joursPref.split(',').filter(j => j)
    if (jours.includes(jourValue)) {
      setContractData({
        ...contractData,
        joursPref: jours.filter(j => j !== jourValue).join(',')
      })
    } else {
      setContractData({
        ...contractData,
        joursPref: [...jours, jourValue].join(',')
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    if (!contractData.eleveId || !contractData.matiereId || !contractData.dateDebut || !contractData.dateFin) {
      setError('Veuillez remplir tous les champs obligatoires')
      setSubmitting(false)
      return
    }

    if (new Date(contractData.dateFin) <= new Date(contractData.dateDebut)) {
      setError('La date de fin doit être après la date de début')
      setSubmitting(false)
      return
    }

    const result = await demanderContract({
      precepteurId: precepteur.id,
      eleveId: parseInt(contractData.eleveId),
      matiereId: parseInt(contractData.matiereId),
      dateDebut: contractData.dateDebut,
      dateFin: contractData.dateFin,
      heureDebutPref: contractData.heureDebutPref,
      heureFinPref: contractData.heureFinPref,
      joursPref: contractData.joursPref,
      typeContrat: contractData.typeContrat as 'recurrent' | 'ponctuel',
      frequence: contractData.frequence,
      tarifHoraire: contractData.tarifHoraire ? parseFloat(contractData.tarifHoraire) : undefined,
      notes: contractData.notes || undefined
    })

    if (result.success) {
      setSuccess('Proposition envoyée avec succès !')
      setTimeout(() => onClose(), 2000)
    } else {
      setError(result.error || 'Une erreur est survenue')
    }
    
    setSubmitting(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" /> Proposer un contrat
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-medium text-green-700">{success}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Précepteur info */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              {precepteur.user?.photo_profil ? (
                <img src={precepteur.user.photo_profil} alt="" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
              )}
              <div>
                <p className="font-medium text-sm">{precepteur.user?.username}</p>
                <p className="text-xs text-gray-500">{precepteur.commune}</p>
              </div>
            </div>

            {/* Élève */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enfant *</label>
              {loadingEleves ? (
                <div className="text-sm text-gray-400 py-2">Chargement...</div>
              ) : eleves.length === 0 ? (
                <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                  Aucun enfant trouvé. Ajoutez-en un dans votre tableau de bord.
                </div>
              ) : (
                <select
                  value={contractData.eleveId}
                  onChange={(e) => setContractData({...contractData, eleveId: e.target.value})}
                  required
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Sélectionner un enfant</option>
                  {eleves.map((eleve) => (
                    <option key={eleve.id} value={eleve.id}>
                      {eleve.prenom} {eleve.nom} - {eleve.niveau}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Matière */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Matière *</label>
              <select
                value={contractData.matiereId}
                onChange={(e) => setContractData({...contractData, matiereId: e.target.value})}
                required
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Sélectionner une matière</option>
                {precepteur.matieres?.map((pm: any) => (
                  <option key={pm.matiere_id} value={pm.matiere_id}>
                    {pm.matiere?.nom} {pm.matiere?.niveau ? `(${pm.matiere.niveau})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Début *</label>
                <input
                  type="date"
                  value={contractData.dateDebut}
                  onChange={(e) => {
                    const newDebut = e.target.value
                    setContractData({
                      ...contractData, 
                      dateDebut: newDebut,
                      dateFin: getDefaultDateFin(newDebut)
                    })
                  }}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fin *</label>
                <input
                  type="date"
                  value={contractData.dateFin}
                  onChange={(e) => setContractData({...contractData, dateFin: e.target.value})}
                  required
                  min={contractData.dateDebut || new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* Horaires */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure début</label>
                <input
                  type="time"
                  value={contractData.heureDebutPref}
                  onChange={(e) => setContractData({...contractData, heureDebutPref: e.target.value})}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure fin</label>
                <input
                  type="time"
                  value={contractData.heureFinPref}
                  onChange={(e) => setContractData({...contractData, heureFinPref: e.target.value})}
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* Jours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jours</label>
              <div className="flex flex-wrap gap-1.5">
                {joursSemaine.map((jour) => (
                  <button
                    key={jour.value}
                    type="button"
                    onClick={() => toggleJour(jour.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      contractData.joursPref.split(',').includes(jour.value)
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {jour.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fréquence */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fréquence des cours</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setContractData({...contractData, frequence: 'hebdomadaire'})}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    contractData.frequence === 'hebdomadaire'
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Hebdomadaire
                </button>
                <button
                  type="button"
                  onClick={() => setContractData({...contractData, frequence: 'mensuel'})}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    contractData.frequence === 'mensuel'
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Mensuel
                </button>
              </div>
            </div>

            {/* Tarif/h */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tarif/h (FC)</label>
              <div className="relative">
                <input
                  type="number"
                  value={contractData.tarifHoraire}
                  onChange={(e) => setContractData({...contractData, tarifHoraire: e.target.value})}
                  placeholder="5000"
                  className="w-full pl-3 pr-12 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">FC</span>
              </div>
            </div>

            {/* Résumé du calcul */}
            {contractData.tarifHoraire && nombreSeancesEstime > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Estimation
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-blue-800">
                    <span>{heuresParSeance.toFixed(1)}h/séance × {parseFloat(contractData.tarifHoraire).toLocaleString()} FC/h</span>
                    <span className="font-medium">{tarifParSeance.toLocaleString()} FC</span>
                  </div>
                  <div className="flex justify-between text-blue-800">
                    <span>{joursParSemaine} jour{joursParSemaine > 1 ? 's' : ''}/semaine</span>
                    <span className="font-medium">{contractData.frequence === 'hebdomadaire' ? 'Chaque semaine' : '1 fois/mois'}</span>
                  </div>
                  <div className="flex justify-between text-blue-800">
                    <span>{nombreSemaines} semaines</span>
                    <span className="font-medium">{nombreSeancesEstime} séance{nombreSeancesEstime > 1 ? 's' : ''}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-blue-200 flex justify-between text-blue-900 font-bold">
                    <span>Total estimé</span>
                    <span>{montantTotalEstime.toLocaleString()} FC</span>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message (optionnel)</label>
              <textarea
                value={contractData.notes}
                onChange={(e) => setContractData({...contractData, notes: e.target.value})}
                placeholder="Vos attentes, remarques..."
                rows={3}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
            </div>

            {/* Boutons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting || loadingEleves || eleves.length === 0}
                className="flex-1 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-40 transition-colors text-sm flex items-center justify-center gap-2 font-medium"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <ArrowUp className="w-4 h-4" />
                )}
                {submitting ? 'Envoi...' : 'Proposer'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}