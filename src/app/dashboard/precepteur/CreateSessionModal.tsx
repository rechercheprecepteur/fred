
// // // // // components/CreateSeanceModal.tsx
// // // // 'use client'

// // // // import { useState, useEffect } from 'react'
// // // // import { supabase } from '@/lib/supabase'
// // // // import { 
// // // //   X, 
// // // //   Calendar, 
// // // //   Clock, 
// // // //   MapPin, 
// // // //   BookOpen, 
// // // //   Users,
// // // //   AlertCircle,
// // // //   Info,
// // // //   Building2,
// // // //   Home
// // // // } from 'lucide-react'

// // // // // ✅ REMPLACER le type Contract actuel par celui-ci
// // // // type Contract = {
// // // //   id: number
// // // //   parent_id: number
// // // //   date_debut: string
// // // //   date_fin: string
// // // //   heure_debut_pref: string
// // // //   heure_fin_pref: string
// // // //   type_contrat?: string
// // // //   frequence?: string
// // // //   tarif_horaire?: number | null
// // // //   statut?: string
// // // //   eleve?: {
// // // //     id?: number
// // // //     nom: string
// // // //     prenom: string
// // // //     postnom?: string | null
// // // //     niveau?: string
// // // //     ecole?: string | null
// // // //     genre?: string
// // // //     date_naissance?: string | null
// // // //   } | null
// // // //   matiere?: {
// // // //     id?: number
// // // //     nom: string
// // // //     niveau?: string
// // // //     description?: string | null
// // // //   } | null
// // // //   parent?: {
// // // //     id?: number
// // // //     telephone?: string | null
// // // //     adresse?: string | null
// // // //     user?: {
// // // //       id?: string
// // // //       username?: string
// // // //       email?: string
// // // //       photo_profil?: string | null
// // // //       telephone?: string | null
// // // //     }
// // // //   } | null
// // // //   seances?: any[] | null
// // // // }

// // // // type SeanceForm = {
// // // //   date_seance: string
// // // //   heure_debut: string
// // // //   heure_fin: string
// // // //   lieu: string
// // // //   notes: string
// // // // }

// // // // type FormErrors = {
// // // //   date_seance?: string
// // // //   heure_debut?: string
// // // //   heure_fin?: string
// // // //   lieu?: string
// // // //   general?: string
// // // // }

// // // // export default function CreateSessionModal({ 
// // // //   contract, 
// // // //   isOpen, 
// // // //   onClose, 
// // // //   onSuccess,
// // // //   onCreating,
// // // //   onError  
// // // // }: {
// // // //   contract: Contract | null
// // // //   isOpen: boolean
// // // //   onClose: () => void
// // // //   onSuccess: () => void
// // // //   onCreating?: () => void
// // // //   onError?: () => void  
// // // // }) {
// // // //   const [form, setForm] = useState<SeanceForm>({
// // // //     date_seance: '',
// // // //     heure_debut: '',
// // // //     heure_fin: '',
// // // //     lieu: '',
// // // //     notes: ''
// // // //   })
// // // //   const [saving, setSaving] = useState(false)
// // // //   const [errors, setErrors] = useState<FormErrors>({})

// // // //   // ✅ État pour stocker l'adresse du parent
// // // //   const [parentAdresse, setParentAdresse] = useState<string>('')
// // // //   const [loadingAdresse, setLoadingAdresse] = useState(false)

// // // //   // ✅ Récupérer l'adresse du parent quand le contrat change
// // // //   useEffect(() => {
// // // //     const fetchParentAdresse = async () => {
// // // //       if (contract?.parent_id) {
// // // //         setLoadingAdresse(true)
// // // //         try {
// // // //           const { data: parent } = await supabase
// // // //             .from('parents')
// // // //             .select('adresse')
// // // //             .eq('id', contract.parent_id)
// // // //             .single()
          
// // // //           if (parent?.adresse) {
// // // //             setParentAdresse(parent.adresse)
// // // //           } else {
// // // //             setParentAdresse('')
// // // //           }
// // // //         } catch (error) {
// // // //           console.error('Erreur récupération adresse parent:', error)
// // // //           setParentAdresse('')
// // // //         }
// // // //         setLoadingAdresse(false)
// // // //       }
// // // //     }

// // // //     if (isOpen && contract) {
// // // //       fetchParentAdresse()
// // // //     }
// // // //   }, [isOpen, contract])

// // // //   // Initialiser le formulaire quand le contrat change
// // // //   useEffect(() => {
// // // //     if (contract) {
// // // //       // Date par défaut : aujourd'hui si dans la période, sinon date_debut
// // // //       const today = new Date()
// // // //       today.setHours(0, 0, 0, 0)
      
// // // //       const dateDebut = new Date(contract.date_debut)
// // // //       dateDebut.setHours(0, 0, 0, 0)
      
// // // //       const dateFin = new Date(contract.date_fin)
// // // //       dateFin.setHours(0, 0, 0, 0)

// // // //       let defaultDate: Date
// // // //       if (today >= dateDebut && today <= dateFin) {
// // // //         defaultDate = today
// // // //       } else {
// // // //         defaultDate = dateDebut
// // // //       }

// // // //       const formattedDate = defaultDate.toISOString().split('T')[0]

// // // //       setForm({
// // // //         date_seance: formattedDate,
// // // //         heure_debut: contract.heure_debut_pref?.slice(0, 5) || '',
// // // //         heure_fin: contract.heure_fin_pref?.slice(0, 5) || '',
// // // //         lieu: parentAdresse || '',
// // // //         notes: ''
// // // //       })
// // // //       setErrors({})
// // // //     }
// // // //   }, [contract, parentAdresse])

// // // //   if (!isOpen || !contract) return null

// // // //   // Convertir HH:MM en minutes depuis minuit
// // // //   const timeToMinutes = (time: string): number => {
// // // //     const [h, m] = time.split(':').map(Number)
// // // //     return h * 60 + m
// // // //   }

// // // //   // Formater les minutes en HH:MM
// // // //   const minutesToTime = (minutes: number): string => {
// // // //     const h = Math.floor(minutes / 60)
// // // //     const m = minutes % 60
// // // //     return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
// // // //   }

// // // //   // Obtenir les dates min et max
// // // //   const dateDebut = new Date(contract.date_debut)
// // // //   dateDebut.setHours(0, 0, 0, 0)
// // // //   const dateFin = new Date(contract.date_fin)
// // // //   dateFin.setHours(0, 0, 0, 0)

// // // //   const minDate = dateDebut.toISOString().split('T')[0]
// // // //   const maxDate = dateFin.toISOString().split('T')[0]

// // // //   // Heures min/max du contrat en minutes
// // // //   const contratHeureDebutMin = timeToMinutes(contract.heure_debut_pref?.slice(0, 5) || '08:00')
// // // //   const contratHeureFinMax = timeToMinutes(contract.heure_fin_pref?.slice(0, 5) || '18:00')

// // // //   const validateForm = (): boolean => {
// // // //     const newErrors: FormErrors = {}

// // // //     // Validation date
// // // //     if (!form.date_seance) {
// // // //       newErrors.date_seance = 'La date est requise'
// // // //     } else {
// // // //       const selectedDate = new Date(form.date_seance)
// // // //       selectedDate.setHours(0, 0, 0, 0)
      
// // // //       if (selectedDate < dateDebut) {
// // // //         newErrors.date_seance = `Date minimum : ${dateDebut.toLocaleDateString('fr-FR')}`
// // // //       } else if (selectedDate > dateFin) {
// // // //         newErrors.date_seance = `Date maximum : ${dateFin.toLocaleDateString('fr-FR')}`
// // // //       }
// // // //     }

// // // //     // Validation heures
// // // //     if (!form.heure_debut) {
// // // //       newErrors.heure_debut = "L'heure de début est requise"
// // // //     }
// // // //     if (!form.heure_fin) {
// // // //       newErrors.heure_fin = "L'heure de fin est requise"
// // // //     }

// // // //     if (form.heure_debut && form.heure_fin) {
// // // //       const debutMin = timeToMinutes(form.heure_debut)
// // // //       const finMin = timeToMinutes(form.heure_fin)

// // // //       // Vérifier que l'heure de début est dans l'intervalle du contrat
// // // //       if (debutMin < contratHeureDebutMin) {
// // // //         newErrors.heure_debut = `Heure minimale : ${contract.heure_debut_pref?.slice(0, 5)}`
// // // //       }

// // // //       // Vérifier que l'heure de fin est dans l'intervalle du contrat
// // // //       if (finMin > contratHeureFinMax) {
// // // //         newErrors.heure_fin = `Heure maximale : ${contract.heure_fin_pref?.slice(0, 5)}`
// // // //       }

// // // //       // Vérifier que début < fin
// // // //       if (debutMin >= finMin) {
// // // //         newErrors.heure_fin = "L'heure de fin doit être après l'heure de début"
// // // //       }

// // // //       // Vérifier la durée minimale (30 minutes)
// // // //       const duree = finMin - debutMin
// // // //       if (duree > 0 && duree < 30) {
// // // //         newErrors.general = 'La durée minimale est de 30 minutes'
// // // //       }
// // // //     }

// // // //     // ✅ Validation du lieu (obligatoire car toutes les séances sont en présentiel)
// // // //     if (!form.lieu || form.lieu.trim() === '') {
// // // //       newErrors.lieu = 'Le lieu est obligatoire pour une séance en présentiel'
// // // //     }

// // // //     setErrors(newErrors)
// // // //     return Object.keys(newErrors).length === 0
// // // //   }


// // // //   const handleSubmit = async (e: React.FormEvent) => {
// // // //     e.preventDefault()
    
// // // //     if (!validateForm()) return

// // // //     setSaving(true)
// // // //     onCreating?.() 

// // // //     try {
// // // //       const sessionData = {
// // // //         contract_id: contract.id,
// // // //         date_session: form.date_seance,
// // // //         heure_debut: form.heure_debut,
// // // //         heure_fin: form.heure_fin,
// // // //         type_session: 'presentiel', // ✅ Fixe : toutes les séances sont en présentiel
// // // //         lieu: form.lieu,
// // // //         lien_visio: null, // ✅ Pas de lien visio car présentiel
// // // //         notes_precepteur: form.notes || null,
// // // //         statut: 'planifie'
// // // //       }

// // // //       console.log("Tentative d'insertion avec:", sessionData)

// // // //       const { data, error } = await supabase
// // // //         .from('sessions_cours')
// // // //         .insert(sessionData)
// // // //         .select()
// // // //         .single()

// // // //       if (error) {
// // // //         console.error('Erreur Supabase:', error)
// // // //         setErrors({ general: error.message || "Erreur lors de la création de la séance" })
// // // //         onError?.()
// // // //         setSaving(false)
// // // //         return
// // // //       }

// // // //       console.log('Séance créée:', data)
// // // //       onSuccess()
// // // //       onClose()
// // // //     } catch (error: any) {
// // // //       console.error('Exception:', error)
// // // //       setErrors({ general: error?.message || 'Erreur serveur inattendue' })
// // // //       onError?.() 
// // // //       setSaving(false)
// // // //     }
// // // //   }


// // // //   const apercuDuree = form.heure_debut && form.heure_fin 
// // // //     ? timeToMinutes(form.heure_fin) - timeToMinutes(form.heure_debut)
// // // //     : 0

// // // //   return (
// // // //     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
// // // //       <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
// // // //         {/* En-tête */}
// // // //         <div className="p-6 border-b flex justify-between items-center">
// // // //           <h2 className="text-xl font-semibold flex items-center gap-2">
// // // //             <Calendar className="w-5 h-5" />
// // // //             Planifier une séance
// // // //           </h2>
// // // //           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
// // // //             <X className="w-5 h-5" />
// // // //           </button>
// // // //         </div>

// // // //         <form onSubmit={handleSubmit} className="p-6 space-y-4">
// // // //           {/* Erreur générale */}
// // // //           {errors.general && (
// // // //             <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
// // // //               <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errors.general}
// // // //             </div>
// // // //           )}

// // // //           {/* Info contrat */}
// // // //           <div className="bg-blue-50 p-3 rounded-lg space-y-1">
// // // //             <p className="text-sm font-medium text-blue-900">
// // // //               {contract.matiere?.nom || 'Matière'} - {contract.eleve?.prenom} {contract.eleve?.nom}
// // // //             </p>
// // // //             <p className="text-xs text-blue-700">
// // // //               Période : {dateDebut.toLocaleDateString('fr-FR')} → {dateFin.toLocaleDateString('fr-FR')}
// // // //             </p>
// // // //             <p className="text-xs text-blue-700">
// // // //               Horaires contrat : {contract.heure_debut_pref?.slice(0, 5)} - {contract.heure_fin_pref?.slice(0, 5)}
// // // //             </p>
// // // //             {/* ✅ Badge indiquant que c'est en présentiel */}
// // // //             <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
// // // //               <MapPin className="w-3 h-3" />
// // // //               Séance en présentiel
// // // //             </div>
// // // //           </div>

// // // //           {/* Date */}
// // // //           <div>
// // // //             <label className="block text-sm font-medium text-gray-700 mb-1">
// // // //               Date de la séance *
// // // //             </label>
// // // //             <input
// // // //               type="date"
// // // //               value={form.date_seance}
// // // //               onChange={(e) => {
// // // //                 setForm({ ...form, date_seance: e.target.value })
// // // //                 setErrors({ ...errors, date_seance: undefined, general: undefined })
// // // //               }}
// // // //               min={minDate}
// // // //               max={maxDate}
// // // //               className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
// // // //                 errors.date_seance ? 'border-red-300 bg-red-50' : 'border-gray-300'
// // // //               }`}
// // // //               required
// // // //             />
// // // //             {errors.date_seance && (
// // // //               <p className="text-xs text-red-500 mt-1">{errors.date_seance}</p>
// // // //             )}
// // // //           </div>

// // // //           {/* Horaires */}
// // // //           <div className="grid grid-cols-2 gap-4">
// // // //             <div>
// // // //               <label className="block text-sm font-medium text-gray-700 mb-1">
// // // //                 Heure début *
// // // //               </label>
// // // //               <input
// // // //                 type="time"
// // // //                 value={form.heure_debut}
// // // //                 onChange={(e) => {
// // // //                   setForm({ ...form, heure_debut: e.target.value })
// // // //                   setErrors({ ...errors, heure_debut: undefined, general: undefined })
// // // //                 }}
// // // //                 min={contract.heure_debut_pref?.slice(0, 5)}
// // // //                 max={contract.heure_fin_pref?.slice(0, 5)}
// // // //                 className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
// // // //                   errors.heure_debut ? 'border-red-300 bg-red-50' : 'border-gray-300'
// // // //                 }`}
// // // //                 required
// // // //               />
// // // //               {errors.heure_debut && (
// // // //                 <p className="text-xs text-red-500 mt-1">{errors.heure_debut}</p>
// // // //               )}
// // // //             </div>
// // // //             <div>
// // // //               <label className="block text-sm font-medium text-gray-700 mb-1">
// // // //                 Heure fin *
// // // //               </label>
// // // //               <input
// // // //                 type="time"
// // // //                 value={form.heure_fin}
// // // //                 onChange={(e) => {
// // // //                   setForm({ ...form, heure_fin: e.target.value })
// // // //                   setErrors({ ...errors, heure_fin: undefined, general: undefined })
// // // //                 }}
// // // //                 min={form.heure_debut || contract.heure_debut_pref?.slice(0, 5)}
// // // //                 max={contract.heure_fin_pref?.slice(0, 5)}
// // // //                 className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
// // // //                   errors.heure_fin ? 'border-red-300 bg-red-50' : 'border-gray-300'
// // // //                 }`}
// // // //                 required
// // // //               />
// // // //               {errors.heure_fin && (
// // // //                 <p className="text-xs text-red-500 mt-1">{errors.heure_fin}</p>
// // // //               )}
// // // //             </div>
// // // //           </div>

// // // //           {/* Aperçu durée */}
// // // //           {apercuDuree > 0 && (
// // // //             <div className="bg-green-50 p-3 rounded-lg flex items-center gap-2">
// // // //               <Clock className="w-4 h-4 text-green-600" />
// // // //               <p className="text-sm text-green-700">
// // // //                 Durée : <span className="font-medium">{apercuDuree} minutes</span>
// // // //                 {apercuDuree >= 60 && ` (${Math.floor(apercuDuree / 60)}h${apercuDuree % 60 > 0 ? ` ${apercuDuree % 60}min` : ''})`}
// // // //               </p>
// // // //             </div>
// // // //           )}

// // // //           {/* ✅ Lieu (obligatoire pour présentiel) */}
// // // //           <div>
// // // //             <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
// // // //               <MapPin className="w-4 h-4" />
// // // //               Lieu de la séance *
// // // //               {parentAdresse && (
// // // //                 <span className="text-xs text-gray-400 font-normal">(adresse du parent suggérée)</span>
// // // //               )}
// // // //             </label>
            
// // // //             <input
// // // //               type="text"
// // // //               value={form.lieu}
// // // //               onChange={(e) => {
// // // //                 setForm({ ...form, lieu: e.target.value })
// // // //                 setErrors({ ...errors, lieu: undefined })
// // // //               }}
// // // //               placeholder={loadingAdresse ? "Chargement de l'adresse..." : "Adresse où se déroulera la séance"}
// // // //               className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
// // // //                 errors.lieu ? 'border-red-300 bg-red-50' : 'border-gray-300'
// // // //               }`}
// // // //               required
// // // //             />
// // // //             {errors.lieu && (
// // // //               <p className="text-xs text-red-500 mt-1">{errors.lieu}</p>
// // // //             )}
            
// // // //             {/* Message informatif sous le champ */}
// // // //             {parentAdresse ? (
// // // //               <div className="mt-1.5 flex items-start gap-2">
// // // //                 <Building2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
// // // //                 <p className="text-xs text-gray-500">
// // // //                   Adresse par défaut du parent : <span className="font-medium text-gray-700">{parentAdresse}</span>
// // // //                 </p>
// // // //               </div>
// // // //             ) : loadingAdresse ? (
// // // //               <div className="mt-1.5 flex items-center gap-2">
// // // //                 <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400"></div>
// // // //                 <p className="text-xs text-gray-400">Récupération de l'adresse du parent...</p>
// // // //               </div>
// // // //             ) : (
// // // //               <div className="mt-1.5 flex items-start gap-2">
// // // //                 <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
// // // //                 <p className="text-xs text-amber-600">
// // // //                   Le parent n'a pas encore renseigné son adresse. Veuillez la saisir manuellement.
// // // //                 </p>
// // // //               </div>
// // // //             )}
            
// // // //             {/* Bouton rapide pour utiliser l'adresse du parent */}
// // // //             {parentAdresse && form.lieu !== parentAdresse && (
// // // //               <button
// // // //                 type="button"
// // // //                 onClick={() => setForm({ ...form, lieu: parentAdresse })}
// // // //                 className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
// // // //               >
// // // //                 <Home className="w-3 h-3" />
// // // //                 Utiliser l'adresse du parent
// // // //               </button>
// // // //             )}
// // // //           </div>

// // // //           {/* Notes */}
// // // //           <div>
// // // //             <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
// // // //             <textarea
// // // //               value={form.notes}
// // // //               onChange={(e) => setForm({ ...form, notes: e.target.value })}
// // // //               placeholder="Notes pour cette séance..."
// // // //               rows={3}
// // // //               className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
// // // //             />
// // // //           </div>

// // // //           {/* Boutons */}
// // // //           <div className="flex gap-2 pt-2">
// // // //             <button
// // // //               type="button"
// // // //               onClick={onClose}
// // // //               className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
// // // //             >
// // // //               Annuler
// // // //             </button>
// // // //             <button
// // // //               type="submit"
// // // //               disabled={saving}
// // // //               className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
// // // //             >
// // // //               {saving ? (
// // // //                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
// // // //               ) : (
// // // //                 <Calendar className="w-4 h-4" />
// // // //               )}
// // // //               Planifier
// // // //             </button>
// // // //           </div>
// // // //         </form>
// // // //       </div>
// // // //     </div>
// // // //   ) 
// // // // }


// // // // components/CreateSessionModal.tsx
// // // 'use client'

// // // import { useState, useEffect } from 'react'
// // // import { createSession } from '@/lib/session-api'
// // // import { 
// // //   X, Calendar, Clock, MapPin, BookOpen,
// // //   AlertCircle, Info, Building2, Home
// // // } from 'lucide-react'

// // // // ✅ Type aligné avec l'API Express
// // // type Contract = {
// // //   id: number
// // //   parent_id: number
// // //   date_debut: string
// // //   date_fin: string
// // //   heure_debut_pref: string
// // //   heure_fin_pref: string
// // //   type_contrat?: string
// // //   frequence?: string
// // //   tarif_horaire?: number | null
// // //   statut?: string
// // //   eleve?: {
// // //     id?: number
// // //     nom: string
// // //     prenom: string
// // //     postnom?: string | null
// // //     niveau?: string
// // //     ecole?: string | null
// // //     genre?: string
// // //     date_naissance?: string | null
// // //   } | null
// // //   matiere?: {
// // //     id?: number
// // //     nom: string
// // //     niveau?: string
// // //     description?: string | null
// // //   } | null
// // //   parent?: {
// // //     id?: number
// // //     telephone?: string | null
// // //     adresse?: string | null
// // //     user?: {
// // //       id?: string
// // //       username?: string
// // //       email?: string
// // //       photo_profil?: string | null
// // //       telephone?: string | null
// // //     }
// // //   } | null
// // // }

// // // type SeanceForm = {
// // //   date_seance: string
// // //   heure_debut: string
// // //   heure_fin: string
// // //   lieu: string
// // //   notes: string
// // // }

// // // type FormErrors = {
// // //   date_seance?: string
// // //   heure_debut?: string
// // //   heure_fin?: string
// // //   lieu?: string
// // //   general?: string
// // // }

// // // export default function CreateSessionModal({ 
// // //   contract, 
// // //   isOpen, 
// // //   onClose, 
// // //   onSuccess,
// // //   onCreating,
// // //   onError  
// // // }: {
// // //   contract: Contract | null
// // //   isOpen: boolean
// // //   onClose: () => void
// // //   onSuccess: () => void
// // //   onCreating?: () => void
// // //   onError?: () => void  
// // // }) {
// // //   const [form, setForm] = useState<SeanceForm>({
// // //     date_seance: '',
// // //     heure_debut: '',
// // //     heure_fin: '',
// // //     lieu: '',
// // //     notes: ''
// // //   })
// // //   const [saving, setSaving] = useState(false)
// // //   const [errors, setErrors] = useState<FormErrors>({})
// // //   const [parentAdresse, setParentAdresse] = useState<string>('')

// // //   // Récupérer l'adresse du parent depuis le contrat
// // //   useEffect(() => {
// // //     if (contract?.parent?.adresse) {
// // //       setParentAdresse(contract.parent.adresse)
// // //     } else {
// // //       setParentAdresse('')
// // //     }
// // //   }, [contract])

// // //   // Initialiser le formulaire
// // //   useEffect(() => {
// // //     if (contract) {
// // //       const today = new Date()
// // //       today.setHours(0, 0, 0, 0)
      
// // //       const dateDebut = new Date(contract.date_debut)
// // //       dateDebut.setHours(0, 0, 0, 0)
      
// // //       const dateFin = new Date(contract.date_fin)
// // //       dateFin.setHours(0, 0, 0, 0)

// // //       let defaultDate: Date
// // //       if (today >= dateDebut && today <= dateFin) {
// // //         defaultDate = today
// // //       } else {
// // //         defaultDate = dateDebut
// // //       }

// // //       setForm({
// // //         date_seance: defaultDate.toISOString().split('T')[0],
// // //         heure_debut: contract.heure_debut_pref?.slice(0, 5) || '',
// // //         heure_fin: contract.heure_fin_pref?.slice(0, 5) || '',
// // //         lieu: contract.parent?.adresse || parentAdresse || '',
// // //         notes: ''
// // //       })
// // //       setErrors({})
// // //     }
// // //   }, [contract, parentAdresse])

// // //   if (!isOpen || !contract) return null

// // //   // Helpers
// // //   const timeToMinutes = (time: string): number => {
// // //     const [h, m] = time.split(':').map(Number)
// // //     return h * 60 + m
// // //   }

// // //   const dateDebut = new Date(contract.date_debut)
// // //   dateDebut.setHours(0, 0, 0, 0)
// // //   const dateFin = new Date(contract.date_fin)
// // //   dateFin.setHours(0, 0, 0, 0)

// // //   const minDate = dateDebut.toISOString().split('T')[0]
// // //   const maxDate = dateFin.toISOString().split('T')[0]

// // //   const contratHeureDebutMin = timeToMinutes(contract.heure_debut_pref?.slice(0, 5) || '08:00')
// // //   const contratHeureFinMax = timeToMinutes(contract.heure_fin_pref?.slice(0, 5) || '18:00')

// // //   const validateForm = (): boolean => {
// // //     const newErrors: FormErrors = {}

// // //     if (!form.date_seance) {
// // //       newErrors.date_seance = 'La date est requise'
// // //     } else {
// // //       const selectedDate = new Date(form.date_seance)
// // //       selectedDate.setHours(0, 0, 0, 0)
      
// // //       if (selectedDate < dateDebut) {
// // //         newErrors.date_seance = `Date minimum : ${dateDebut.toLocaleDateString('fr-FR')}`
// // //       } else if (selectedDate > dateFin) {
// // //         newErrors.date_seance = `Date maximum : ${dateFin.toLocaleDateString('fr-FR')}`
// // //       }
// // //     }

// // //     if (!form.heure_debut) newErrors.heure_debut = "L'heure de début est requise"
// // //     if (!form.heure_fin) newErrors.heure_fin = "L'heure de fin est requise"

// // //     if (form.heure_debut && form.heure_fin) {
// // //       const debutMin = timeToMinutes(form.heure_debut)
// // //       const finMin = timeToMinutes(form.heure_fin)

// // //       if (debutMin < contratHeureDebutMin) {
// // //         newErrors.heure_debut = `Heure minimale : ${contract.heure_debut_pref?.slice(0, 5)}`
// // //       }
// // //       if (finMin > contratHeureFinMax) {
// // //         newErrors.heure_fin = `Heure maximale : ${contract.heure_fin_pref?.slice(0, 5)}`
// // //       }
// // //       if (debutMin >= finMin) {
// // //         newErrors.heure_fin = "L'heure de fin doit être après l'heure de début"
// // //       }

// // //       const duree = finMin - debutMin
// // //       if (duree > 0 && duree < 30) {
// // //         newErrors.general = 'La durée minimale est de 30 minutes'
// // //       }
// // //     }

// // //     if (!form.lieu || form.lieu.trim() === '') {
// // //       newErrors.lieu = 'Le lieu est obligatoire pour une séance en présentiel'
// // //     }

// // //     setErrors(newErrors)
// // //     return Object.keys(newErrors).length === 0
// // //   }

// // //   // ✅ SOUMISSION VERS L'API EXPRESS
// // //   const handleSubmit = async (e: React.FormEvent) => {
// // //     e.preventDefault()
    
// // //     if (!validateForm()) return

// // //     setSaving(true)
// // //     onCreating?.()

// // //     try {
// // //       await createSession({
// // //         contract_id: contract.id,
// // //         date_session: form.date_seance,
// // //         heure_debut: form.heure_debut,
// // //         heure_fin: form.heure_fin,
// // //         lieu: form.lieu,
// // //         type_session: 'presentiel',
// // //         lien_visio: undefined,
// // //         notes_precepteur: form.notes || undefined
// // //       })

// // //       onSuccess()
// // //       onClose()
// // //     } catch (error: any) {
// // //       console.error('Erreur création session:', error)
// // //       setErrors({ general: error.message || 'Erreur lors de la création de la séance' })
// // //       onError?.()
// // //     } finally {
// // //       setSaving(false)
// // //     }
// // //   }

// // //   const apercuDuree = form.heure_debut && form.heure_fin 
// // //     ? timeToMinutes(form.heure_fin) - timeToMinutes(form.heure_debut)
// // //     : 0

// // //   return (
// // //     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
// // //       <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
// // //         {/* En-tête */}
// // //         <div className="p-6 border-b flex justify-between items-center">
// // //           <h2 className="text-xl font-semibold flex items-center gap-2">
// // //             <Calendar className="w-5 h-5" />
// // //             Planifier une séance
// // //           </h2>
// // //           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
// // //             <X className="w-5 h-5" />
// // //           </button>
// // //         </div>

// // //         <form onSubmit={handleSubmit} className="p-6 space-y-4">
// // //           {/* Erreur générale */}
// // //           {errors.general && (
// // //             <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
// // //               <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errors.general}
// // //             </div>
// // //           )}

// // //           {/* Info contrat */}
// // //           <div className="bg-blue-50 p-3 rounded-lg space-y-1">
// // //             <p className="text-sm font-medium text-blue-900">
// // //               {contract.matiere?.nom || 'Matière'} - {contract.eleve?.prenom} {contract.eleve?.nom}
// // //             </p>
// // //             <p className="text-xs text-blue-700">
// // //               Période : {dateDebut.toLocaleDateString('fr-FR')} → {dateFin.toLocaleDateString('fr-FR')}
// // //             </p>
// // //             <p className="text-xs text-blue-700">
// // //               Horaires contrat : {contract.heure_debut_pref?.slice(0, 5)} - {contract.heure_fin_pref?.slice(0, 5)}
// // //             </p>
// // //             <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
// // //               <MapPin className="w-3 h-3" />
// // //               Séance en présentiel
// // //             </div>
// // //           </div>

// // //           {/* Date */}
// // //           <div>
// // //             <label className="block text-sm font-medium text-gray-700 mb-1">
// // //               Date de la séance *
// // //             </label>
// // //             <input
// // //               type="date"
// // //               value={form.date_seance}
// // //               onChange={(e) => {
// // //                 setForm({ ...form, date_seance: e.target.value })
// // //                 setErrors({ ...errors, date_seance: undefined, general: undefined })
// // //               }}
// // //               min={minDate}
// // //               max={maxDate}
// // //               className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
// // //                 errors.date_seance ? 'border-red-300 bg-red-50' : 'border-gray-300'
// // //               }`}
// // //               required
// // //             />
// // //             {errors.date_seance && (
// // //               <p className="text-xs text-red-500 mt-1">{errors.date_seance}</p>
// // //             )}
// // //           </div>

// // //           {/* Horaires */}
// // //           <div className="grid grid-cols-2 gap-4">
// // //             <div>
// // //               <label className="block text-sm font-medium text-gray-700 mb-1">
// // //                 Heure début *
// // //               </label>
// // //               <input
// // //                 type="time"
// // //                 value={form.heure_debut}
// // //                 onChange={(e) => {
// // //                   setForm({ ...form, heure_debut: e.target.value })
// // //                   setErrors({ ...errors, heure_debut: undefined, general: undefined })
// // //                 }}
// // //                 min={contract.heure_debut_pref?.slice(0, 5)}
// // //                 max={contract.heure_fin_pref?.slice(0, 5)}
// // //                 className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
// // //                   errors.heure_debut ? 'border-red-300 bg-red-50' : 'border-gray-300'
// // //                 }`}
// // //                 required
// // //               />
// // //               {errors.heure_debut && (
// // //                 <p className="text-xs text-red-500 mt-1">{errors.heure_debut}</p>
// // //               )}
// // //             </div>
// // //             <div>
// // //               <label className="block text-sm font-medium text-gray-700 mb-1">
// // //                 Heure fin *
// // //               </label>
// // //               <input
// // //                 type="time"
// // //                 value={form.heure_fin}
// // //                 onChange={(e) => {
// // //                   setForm({ ...form, heure_fin: e.target.value })
// // //                   setErrors({ ...errors, heure_fin: undefined, general: undefined })
// // //                 }}
// // //                 min={form.heure_debut || contract.heure_debut_pref?.slice(0, 5)}
// // //                 max={contract.heure_fin_pref?.slice(0, 5)}
// // //                 className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
// // //                   errors.heure_fin ? 'border-red-300 bg-red-50' : 'border-gray-300'
// // //                 }`}
// // //                 required
// // //               />
// // //               {errors.heure_fin && (
// // //                 <p className="text-xs text-red-500 mt-1">{errors.heure_fin}</p>
// // //               )}
// // //             </div>
// // //           </div>

// // //           {/* Aperçu durée */}
// // //           {apercuDuree > 0 && (
// // //             <div className="bg-green-50 p-3 rounded-lg flex items-center gap-2">
// // //               <Clock className="w-4 h-4 text-green-600" />
// // //               <p className="text-sm text-green-700">
// // //                 Durée : <span className="font-medium">{apercuDuree} minutes</span>
// // //                 {apercuDuree >= 60 && ` (${Math.floor(apercuDuree / 60)}h${apercuDuree % 60 > 0 ? ` ${apercuDuree % 60}min` : ''})`}
// // //               </p>
// // //             </div>
// // //           )}

// // //           {/* Lieu */}
// // //           <div>
// // //             <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
// // //               <MapPin className="w-4 h-4" />
// // //               Lieu de la séance *
// // //               {parentAdresse && (
// // //                 <span className="text-xs text-gray-400 font-normal">(adresse du parent suggérée)</span>
// // //               )}
// // //             </label>
            
// // //             <input
// // //               type="text"
// // //               value={form.lieu}
// // //               onChange={(e) => {
// // //                 setForm({ ...form, lieu: e.target.value })
// // //                 setErrors({ ...errors, lieu: undefined })
// // //               }}
// // //               placeholder="Adresse où se déroulera la séance"
// // //               className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
// // //                 errors.lieu ? 'border-red-300 bg-red-50' : 'border-gray-300'
// // //               }`}
// // //               required
// // //             />
// // //             {errors.lieu && (
// // //               <p className="text-xs text-red-500 mt-1">{errors.lieu}</p>
// // //             )}
            
// // //             {parentAdresse ? (
// // //               <div className="mt-1.5 flex items-start gap-2">
// // //                 <Building2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
// // //                 <p className="text-xs text-gray-500">
// // //                   Adresse par défaut du parent : <span className="font-medium text-gray-700">{parentAdresse}</span>
// // //                 </p>
// // //               </div>
// // //             ) : (
// // //               <div className="mt-1.5 flex items-start gap-2">
// // //                 <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
// // //                 <p className="text-xs text-amber-600">
// // //                   Le parent n'a pas encore renseigné son adresse. Veuillez la saisir manuellement.
// // //                 </p>
// // //               </div>
// // //             )}
            
// // //             {parentAdresse && form.lieu !== parentAdresse && (
// // //               <button
// // //                 type="button"
// // //                 onClick={() => setForm({ ...form, lieu: parentAdresse })}
// // //                 className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
// // //               >
// // //                 <Home className="w-3 h-3" />
// // //                 Utiliser l'adresse du parent
// // //               </button>
// // //             )}
// // //           </div>

// // //           {/* Notes */}
// // //           <div>
// // //             <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
// // //             <textarea
// // //               value={form.notes}
// // //               onChange={(e) => setForm({ ...form, notes: e.target.value })}
// // //               placeholder="Notes pour cette séance..."
// // //               rows={3}
// // //               className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
// // //             />
// // //           </div>

// // //           {/* Boutons */}
// // //           <div className="flex gap-2 pt-2">
// // //             <button
// // //               type="button"
// // //               onClick={onClose}
// // //               className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
// // //             >
// // //               Annuler
// // //             </button>
// // //             <button
// // //               type="submit"
// // //               disabled={saving}
// // //               className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
// // //             >
// // //               {saving ? (
// // //                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
// // //               ) : (
// // //                 <Calendar className="w-4 h-4" />
// // //               )}
// // //               Planifier
// // //             </button>
// // //           </div>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   )
// // // }

// // // components/CreateSessionModal.tsx
// // 'use client'

// // import { useState, useEffect } from 'react'
// // import { createSession } from '@/lib/session-api'
// // import { 
// //   X, Calendar, Clock, MapPin, BookOpen,
// //   AlertCircle, Info, Building2, Home
// // } from 'lucide-react'

// // // ✅ Type Contract compatible avec le type Contrat du dashboard
// // // Accepte les deux formes de données possibles
// // type Contract = {
// //   id: number | string  // Accepte string (du dashboard) ou number
// //   parent_id: number | string
// //   date_debut?: string  // Optionnel car le dashboard utilise date_debut directement
// //   date_fin?: string
// //   heure_debut_pref?: string
// //   heure_fin_pref?: string
// //   type_contrat?: string
// //   frequence?: string
// //   tarif_horaire?: number | null
// //   tarif_final?: number  // Le dashboard utilise tarif_final
// //   statut?: string
// //   titre?: string
// //   matiere?: string | {  // Le dashboard peut avoir une string ou un objet
// //     id?: number
// //     nom: string
// //     niveau?: string
// //     description?: string | null
// //   } | null
// //   niveau?: string
// //   eleve?: {
// //     id?: number
// //     nom: string
// //     prenom: string
// //     postnom?: string | null
// //     niveau?: string
// //     ecole?: string | null
// //     genre?: string
// //     date_naissance?: string | null
// //   } | null
// //   matiere_obj?: {
// //     id?: number
// //     nom: string
// //     niveau?: string
// //     description?: string | null
// //   } | null
// //   parent?: {
// //     id?: number | string
// //     telephone?: string | null
// //     adresse?: string | null
// //     user?: {
// //       id?: string
// //       username?: string
// //       email?: string
// //       photo_profil?: string | null
// //       telephone?: string | null
// //     }
// //   } | null
// // }

// // type SeanceForm = {
// //   date_seance: string
// //   heure_debut: string
// //   heure_fin: string
// //   lieu: string
// //   notes: string
// // }

// // type FormErrors = {
// //   date_seance?: string
// //   heure_debut?: string
// //   heure_fin?: string
// //   lieu?: string
// //   general?: string
// // }

// // // ✅ Helper pour extraire les infos du contrat (compatible avec les deux formats)
// // function getContractInfo(contract: Contract) {
// //   // Date début
// //   const dateDebutStr = contract.date_debut || ''
  
// //   // Date fin
// //   const dateFinStr = contract.date_fin || ''
  
// //   // Heures préférées
// //   const heureDebutPref = contract.heure_debut_pref?.slice(0, 5) || '08:00'
// //   const heureFinPref = contract.heure_fin_pref?.slice(0, 5) || '18:00'
  
// //   // Matière (peut être une string ou un objet)
// //   let matiereNom = 'Matière'
// //   let matiereNiveau = ''
// //   if (typeof contract.matiere === 'string') {
// //     matiereNom = contract.matiere
// //   } else if (contract.matiere_obj?.nom) {
// //     matiereNom = contract.matiere_obj.nom
// //     matiereNiveau = contract.matiere_obj.niveau || ''
// //   } else if (contract.matiere?.nom) {
// //     matiereNom = contract.matiere.nom
// //     matiereNiveau = contract.matiere.niveau || ''
// //   }
  
// //   // Élève
// //   const elevePrenom = contract.eleve?.prenom || ''
// //   const eleveNom = contract.eleve?.nom || ''
  
// //   // Parent adresse
// //   const parentAdresse = contract.parent?.adresse || ''
  
// //   return {
// //     dateDebutStr,
// //     dateFinStr,
// //     heureDebutPref,
// //     heureFinPref,
// //     matiereNom,
// //     matiereNiveau,
// //     elevePrenom,
// //     eleveNom,
// //     parentAdresse,
// //     niveau: contract.niveau || contract.eleve?.niveau || matiereNiveau
// //   }
// // }

// // export default function CreateSessionModal({ 
// //   contract, 
// //   isOpen, 
// //   onClose, 
// //   onSuccess,
// //   onCreating,
// //   onError  
// // }: {
// //   contract: Contract | null
// //   isOpen: boolean
// //   onClose: () => void
// //   onSuccess: () => void
// //   onCreating?: () => void
// //   onError?: () => void  
// // }) {
// //   const [form, setForm] = useState<SeanceForm>({
// //     date_seance: '',
// //     heure_debut: '',
// //     heure_fin: '',
// //     lieu: '',
// //     notes: ''
// //   })
// //   const [saving, setSaving] = useState(false)
// //   const [errors, setErrors] = useState<FormErrors>({})
// //   const [parentAdresse, setParentAdresse] = useState<string>('')

// //   // Récupérer l'adresse du parent depuis le contrat
// //   useEffect(() => {
// //     if (contract) {
// //       const info = getContractInfo(contract)
// //       setParentAdresse(info.parentAdresse)
// //     } else {
// //       setParentAdresse('')
// //     }
// //   }, [contract])

// //   // Initialiser le formulaire
// //   useEffect(() => {
// //     if (contract) {
// //       const info = getContractInfo(contract)
      
// //       const today = new Date()
// //       today.setHours(0, 0, 0, 0)
      
// //       let dateDebut: Date
// //       let dateFin: Date
      
// //       if (info.dateDebutStr) {
// //         dateDebut = new Date(info.dateDebutStr)
// //         dateDebut.setHours(0, 0, 0, 0)
// //       } else {
// //         dateDebut = today
// //       }
      
// //       if (info.dateFinStr) {
// //         dateFin = new Date(info.dateFinStr)
// //         dateFin.setHours(0, 0, 0, 0)
// //       } else {
// //         // Si pas de date_fin, mettre 3 mois par défaut
// //         dateFin = new Date(today)
// //         dateFin.setMonth(dateFin.getMonth() + 3)
// //       }

// //       let defaultDate: Date
// //       if (today >= dateDebut && today <= dateFin) {
// //         defaultDate = today
// //       } else {
// //         defaultDate = dateDebut
// //       }

// //       setForm({
// //         date_seance: defaultDate.toISOString().split('T')[0],
// //         heure_debut: info.heureDebutPref,
// //         heure_fin: info.heureFinPref,
// //         lieu: info.parentAdresse || parentAdresse || '',
// //         notes: ''
// //       })
// //       setErrors({})
// //     }
// //   }, [contract, parentAdresse])

// //   if (!isOpen || !contract) return null

// //   const info = getContractInfo(contract)

// //   // Helpers
// //   const timeToMinutes = (time: string): number => {
// //     const [h, m] = time.split(':').map(Number)
// //     return h * 60 + m
// //   }

// //   const dateDebut = info.dateDebutStr ? new Date(info.dateDebutStr) : new Date()
// //   dateDebut.setHours(0, 0, 0, 0)
  
// //   const dateFin = info.dateFinStr ? new Date(info.dateFinStr) : (() => {
// //     const d = new Date()
// //     d.setMonth(d.getMonth() + 3)
// //     return d
// //   })()
// //   dateFin.setHours(0, 0, 0, 0)

// //   const minDate = dateDebut.toISOString().split('T')[0]
// //   const maxDate = dateFin.toISOString().split('T')[0]

// //   const contratHeureDebutMin = timeToMinutes(info.heureDebutPref)
// //   const contratHeureFinMax = timeToMinutes(info.heureFinPref)

// //   const validateForm = (): boolean => {
// //     const newErrors: FormErrors = {}

// //     if (!form.date_seance) {
// //       newErrors.date_seance = 'La date est requise'
// //     } else {
// //       const selectedDate = new Date(form.date_seance)
// //       selectedDate.setHours(0, 0, 0, 0)
      
// //       if (selectedDate < dateDebut) {
// //         newErrors.date_seance = `Date minimum : ${dateDebut.toLocaleDateString('fr-FR')}`
// //       } else if (selectedDate > dateFin) {
// //         newErrors.date_seance = `Date maximum : ${dateFin.toLocaleDateString('fr-FR')}`
// //       }
// //     }

// //     if (!form.heure_debut) newErrors.heure_debut = "L'heure de début est requise"
// //     if (!form.heure_fin) newErrors.heure_fin = "L'heure de fin est requise"

// //     if (form.heure_debut && form.heure_fin) {
// //       const debutMin = timeToMinutes(form.heure_debut)
// //       const finMin = timeToMinutes(form.heure_fin)

// //       if (debutMin < contratHeureDebutMin) {
// //         newErrors.heure_debut = `Heure minimale : ${info.heureDebutPref}`
// //       }
// //       if (finMin > contratHeureFinMax) {
// //         newErrors.heure_fin = `Heure maximale : ${info.heureFinPref}`
// //       }
// //       if (debutMin >= finMin) {
// //         newErrors.heure_fin = "L'heure de fin doit être après l'heure de début"
// //       }

// //       const duree = finMin - debutMin
// //       if (duree > 0 && duree < 30) {
// //         newErrors.general = 'La durée minimale est de 30 minutes'
// //       }
// //     }

// //     if (!form.lieu || form.lieu.trim() === '') {
// //       newErrors.lieu = 'Le lieu est obligatoire pour une séance en présentiel'
// //     }

// //     setErrors(newErrors)
// //     return Object.keys(newErrors).length === 0
// //   }

// //   // ✅ SOUMISSION VERS L'API EXPRESS
// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault()
    
// //     if (!validateForm()) return

// //     setSaving(true)
// //     onCreating?.()

// //     try {
// //       await createSession({
// //         contract_id: Number(contract.id),
// //         date_session: form.date_seance,
// //         heure_debut: form.heure_debut,
// //         heure_fin: form.heure_fin,
// //         lieu: form.lieu,
// //         type_session: 'presentiel',
// //         lien_visio: undefined,
// //         notes_precepteur: form.notes || undefined
// //       })

// //       onSuccess()
// //       onClose()
// //     } catch (error: any) {
// //       console.error('Erreur création session:', error)
// //       setErrors({ general: error.message || 'Erreur lors de la création de la séance' })
// //       onError?.()
// //     } finally {
// //       setSaving(false)
// //     }
// //   }

// //   const apercuDuree = form.heure_debut && form.heure_fin 
// //     ? timeToMinutes(form.heure_fin) - timeToMinutes(form.heure_debut)
// //     : 0

// //   return (
// //     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
// //       <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
// //         {/* En-tête */}
// //         <div className="p-6 border-b flex justify-between items-center">
// //           <h2 className="text-xl font-semibold flex items-center gap-2">
// //             <Calendar className="w-5 h-5" />
// //             Planifier une séance
// //           </h2>
// //           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
// //             <X className="w-5 h-5" />
// //           </button>
// //         </div>

// //         <form onSubmit={handleSubmit} className="p-6 space-y-4">
// //           {/* Erreur générale */}
// //           {errors.general && (
// //             <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
// //               <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errors.general}
// //             </div>
// //           )}

// //           {/* Info contrat */}
// //           <div className="bg-blue-50 p-3 rounded-lg space-y-1">
// //             <p className="text-sm font-medium text-blue-900">
// //               {info.matiereNom} - {info.elevePrenom} {info.eleveNom}
// //             </p>
// //             {info.dateDebutStr && info.dateFinStr && (
// //               <p className="text-xs text-blue-700">
// //                 Période : {dateDebut.toLocaleDateString('fr-FR')} → {dateFin.toLocaleDateString('fr-FR')}
// //               </p>
// //             )}
// //             <p className="text-xs text-blue-700">
// //               Horaires contrat : {info.heureDebutPref} - {info.heureFinPref}
// //             </p>
// //             {info.niveau && (
// //               <p className="text-xs text-blue-700">
// //                 Niveau : {info.niveau}
// //               </p>
// //             )}
// //             <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
// //               <MapPin className="w-3 h-3" />
// //               Séance en présentiel
// //             </div>
// //           </div>

// //           {/* Date */}
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1">
// //               Date de la séance *
// //             </label>
// //             <input
// //               type="date"
// //               value={form.date_seance}
// //               onChange={(e) => {
// //                 setForm({ ...form, date_seance: e.target.value })
// //                 setErrors({ ...errors, date_seance: undefined, general: undefined })
// //               }}
// //               min={minDate}
// //               max={maxDate}
// //               className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
// //                 errors.date_seance ? 'border-red-300 bg-red-50' : 'border-gray-300'
// //               }`}
// //               required
// //             />
// //             {errors.date_seance && (
// //               <p className="text-xs text-red-500 mt-1">{errors.date_seance}</p>
// //             )}
// //           </div>

// //           {/* Horaires */}
// //           <div className="grid grid-cols-2 gap-4">
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">
// //                 Heure début *
// //               </label>
// //               <input
// //                 type="time"
// //                 value={form.heure_debut}
// //                 onChange={(e) => {
// //                   setForm({ ...form, heure_debut: e.target.value })
// //                   setErrors({ ...errors, heure_debut: undefined, general: undefined })
// //                 }}
// //                 min={info.heureDebutPref}
// //                 max={info.heureFinPref}
// //                 className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
// //                   errors.heure_debut ? 'border-red-300 bg-red-50' : 'border-gray-300'
// //                 }`}
// //                 required
// //               />
// //               {errors.heure_debut && (
// //                 <p className="text-xs text-red-500 mt-1">{errors.heure_debut}</p>
// //               )}
// //             </div>
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">
// //                 Heure fin *
// //               </label>
// //               <input
// //                 type="time"
// //                 value={form.heure_fin}
// //                 onChange={(e) => {
// //                   setForm({ ...form, heure_fin: e.target.value })
// //                   setErrors({ ...errors, heure_fin: undefined, general: undefined })
// //                 }}
// //                 min={form.heure_debut || info.heureDebutPref}
// //                 max={info.heureFinPref}
// //                 className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
// //                   errors.heure_fin ? 'border-red-300 bg-red-50' : 'border-gray-300'
// //                 }`}
// //                 required
// //               />
// //               {errors.heure_fin && (
// //                 <p className="text-xs text-red-500 mt-1">{errors.heure_fin}</p>
// //               )}
// //             </div>
// //           </div>

// //           {/* Aperçu durée */}
// //           {apercuDuree > 0 && (
// //             <div className="bg-green-50 p-3 rounded-lg flex items-center gap-2">
// //               <Clock className="w-4 h-4 text-green-600" />
// //               <p className="text-sm text-green-700">
// //                 Durée : <span className="font-medium">{apercuDuree} minutes</span>
// //                 {apercuDuree >= 60 && ` (${Math.floor(apercuDuree / 60)}h${apercuDuree % 60 > 0 ? ` ${apercuDuree % 60}min` : ''})`}
// //               </p>
// //             </div>
// //           )}

// //           {/* Lieu */}
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
// //               <MapPin className="w-4 h-4" />
// //               Lieu de la séance *
// //               {parentAdresse && (
// //                 <span className="text-xs text-gray-400 font-normal">(adresse du parent suggérée)</span>
// //               )}
// //             </label>
            
// //             <input
// //               type="text"
// //               value={form.lieu}
// //               onChange={(e) => {
// //                 setForm({ ...form, lieu: e.target.value })
// //                 setErrors({ ...errors, lieu: undefined })
// //               }}
// //               placeholder="Adresse où se déroulera la séance"
// //               className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
// //                 errors.lieu ? 'border-red-300 bg-red-50' : 'border-gray-300'
// //               }`}
// //               required
// //             />
// //             {errors.lieu && (
// //               <p className="text-xs text-red-500 mt-1">{errors.lieu}</p>
// //             )}
            
// //             {parentAdresse ? (
// //               <div className="mt-1.5 flex items-start gap-2">
// //                 <Building2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
// //                 <p className="text-xs text-gray-500">
// //                   Adresse par défaut du parent : <span className="font-medium text-gray-700">{parentAdresse}</span>
// //                 </p>
// //               </div>
// //             ) : (
// //               <div className="mt-1.5 flex items-start gap-2">
// //                 <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
// //                 <p className="text-xs text-amber-600">
// //                   Le parent n'a pas encore renseigné son adresse. Veuillez la saisir manuellement.
// //                 </p>
// //               </div>
// //             )}
            
// //             {parentAdresse && form.lieu !== parentAdresse && (
// //               <button
// //                 type="button"
// //                 onClick={() => setForm({ ...form, lieu: parentAdresse })}
// //                 className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
// //               >
// //                 <Home className="w-3 h-3" />
// //                 Utiliser l'adresse du parent
// //               </button>
// //             )}
// //           </div>

// //           {/* Notes */}
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
// //             <textarea
// //               value={form.notes}
// //               onChange={(e) => setForm({ ...form, notes: e.target.value })}
// //               placeholder="Notes pour cette séance..."
// //               rows={3}
// //               className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
// //             />
// //           </div>

// //           {/* Boutons */}
// //           <div className="flex gap-2 pt-2">
// //             <button
// //               type="button"
// //               onClick={onClose}
// //               className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
// //             >
// //               Annuler
// //             </button>
// //             <button
// //               type="submit"
// //               disabled={saving}
// //               className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
// //             >
// //               {saving ? (
// //                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
// //               ) : (
// //                 <Calendar className="w-4 h-4" />
// //               )}
// //               Planifier
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   )
// // }

// // components/CreateSessionModal.tsx
// 'use client'

// import { useState, useEffect } from 'react'
// import { createSession } from '@/lib/session-api'
// import { 
//   X, Calendar, Clock, MapPin, BookOpen,
//   AlertCircle, Info, Building2, Home
// } from 'lucide-react'

// // ✅ Type Contract compatible avec le type Contrat du dashboard
// type Contract = {
//   id: number | string
//   parent_id?: number | string
//   date_debut?: string
//   date_fin?: string
//   heure_debut_pref?: string
//   heure_fin_pref?: string
//   type_contrat?: string
//   frequence?: string
//   tarif_horaire?: number | null
//   tarif_final?: number
//   statut?: string
//   titre?: string
//   matiere?: string | {
//     id?: number
//     nom: string
//     niveau?: string
//     description?: string | null
//   } | null
//   niveau?: string
//   eleve?: {
//     id?: number
//     nom: string
//     prenom: string
//     postnom?: string | null
//     niveau?: string
//     ecole?: string | null
//     genre?: string
//     date_naissance?: string | null
//   } | null
//   matiere_obj?: {
//     id?: number
//     nom: string
//     niveau?: string
//     description?: string | null
//   } | null
//   parent?: {
//     id?: number | string
//     telephone?: string | null
//     adresse?: string | null
//     user?: {
//       id?: string
//       username?: string
//       email?: string
//       photo_profil?: string | null
//       telephone?: string | null
//     }
//   } | null
// }

// type SeanceForm = {
//   date_seance: string
//   heure_debut: string
//   heure_fin: string
//   lieu: string
//   notes: string
// }

// type FormErrors = {
//   date_seance?: string
//   heure_debut?: string
//   heure_fin?: string
//   lieu?: string
//   general?: string
// }

// function getContractInfo(contract: Contract) {
//   const dateDebutStr = contract.date_debut || ''
//   const dateFinStr = contract.date_fin || ''
//   const heureDebutPref = contract.heure_debut_pref?.slice(0, 5) || '08:00'
//   const heureFinPref = contract.heure_fin_pref?.slice(0, 5) || '18:00'
  
//   let matiereNom = 'Matière'
//   if (typeof contract.matiere === 'string') {
//     matiereNom = contract.matiere
//   } else if (contract.matiere_obj?.nom) {
//     matiereNom = contract.matiere_obj.nom
//   } else if (contract.matiere?.nom) {
//     matiereNom = contract.matiere.nom
//   }
  
//   const elevePrenom = contract.eleve?.prenom || ''
//   const eleveNom = contract.eleve?.nom || ''
//   const parentAdresse = contract.parent?.adresse || ''
  
//   return {
//     dateDebutStr,
//     dateFinStr,
//     heureDebutPref,
//     heureFinPref,
//     matiereNom,
//     elevePrenom,
//     eleveNom,
//     parentAdresse,
//     niveau: contract.niveau || contract.eleve?.niveau || ''
//   }
// }

// export default function CreateSessionModal({ 
//   contract, 
//   isOpen, 
//   onClose, 
//   onSuccess,
//   onCreating,
//   onError  
// }: {
//   contract: Contract | null
//   isOpen: boolean
//   onClose: () => void
//   onSuccess: () => void
//   onCreating?: () => void
//   onError?: () => void  
// }) {
//   const [form, setForm] = useState<SeanceForm>({
//     date_seance: '',
//     heure_debut: '',
//     heure_fin: '',
//     lieu: '',
//     notes: ''
//   })
//   const [saving, setSaving] = useState(false)
//   const [errors, setErrors] = useState<FormErrors>({})
//   const [parentAdresse, setParentAdresse] = useState<string>('')

//   useEffect(() => {
//     if (contract) {
//       const info = getContractInfo(contract)
//       setParentAdresse(info.parentAdresse)
//     } else {
//       setParentAdresse('')
//     }
//   }, [contract])

//   useEffect(() => {
//     if (contract) {
//       const info = getContractInfo(contract)
      
//       const today = new Date()
//       today.setHours(0, 0, 0, 0)
      
//       let dateDebut: Date
//       let dateFin: Date
      
//       if (info.dateDebutStr) {
//         dateDebut = new Date(info.dateDebutStr)
//         dateDebut.setHours(0, 0, 0, 0)
//       } else {
//         dateDebut = today
//       }
      
//       if (info.dateFinStr) {
//         dateFin = new Date(info.dateFinStr)
//         dateFin.setHours(0, 0, 0, 0)
//       } else {
//         dateFin = new Date(today)
//         dateFin.setMonth(dateFin.getMonth() + 3)
//       }

//       let defaultDate: Date
//       if (today >= dateDebut && today <= dateFin) {
//         defaultDate = today
//       } else {
//         defaultDate = dateDebut
//       }

//       setForm({
//         date_seance: defaultDate.toISOString().split('T')[0],
//         heure_debut: info.heureDebutPref,
//         heure_fin: info.heureFinPref,
//         lieu: info.parentAdresse || parentAdresse || '',
//         notes: ''
//       })
//       setErrors({})
//     }
//   }, [contract, parentAdresse])

//   if (!isOpen || !contract) return null

//   const info = getContractInfo(contract)

//   const timeToMinutes = (time: string): number => {
//     const [h, m] = time.split(':').map(Number)
//     return h * 60 + m
//   }

//   const dateDebut = info.dateDebutStr ? new Date(info.dateDebutStr) : new Date()
//   dateDebut.setHours(0, 0, 0, 0)
  
//   const dateFin = info.dateFinStr ? new Date(info.dateFinStr) : (() => {
//     const d = new Date()
//     d.setMonth(d.getMonth() + 3)
//     return d
//   })()
//   dateFin.setHours(0, 0, 0, 0)

//   const minDate = dateDebut.toISOString().split('T')[0]
//   const maxDate = dateFin.toISOString().split('T')[0]

//   const contratHeureDebutMin = timeToMinutes(info.heureDebutPref)
//   const contratHeureFinMax = timeToMinutes(info.heureFinPref)

//   const validateForm = (): boolean => {
//     const newErrors: FormErrors = {}

//     if (!form.date_seance) {
//       newErrors.date_seance = 'La date est requise'
//     }
//     if (!form.heure_debut) newErrors.heure_debut = "L'heure de début est requise"
//     if (!form.heure_fin) newErrors.heure_fin = "L'heure de fin est requise"
//     if (!form.lieu || form.lieu.trim() === '') {
//       newErrors.lieu = 'Le lieu est obligatoire'
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     if (!validateForm()) return

//     // ✅ DEBUG: Vérifier les données avant envoi
// const contractId = String(contract.id);
//     console.log('📤 Données à envoyer:', {
//       contract_id: contractId,
//       contract_id_type: typeof contractId,
//       contract_original_id: contract.id,
//       contract_original_type: typeof contract.id,
//       date_session: form.date_seance,
//       heure_debut: form.heure_debut,
//       heure_fin: form.heure_fin,
//       lieu: form.lieu,
//       notes_precepteur: form.notes || undefined
//     });

//     // ✅ Vérifier que contract_id est valide
//     if (!contractId || contractId === 0 || isNaN(contractId)) {
//       setErrors({ general: 'Erreur: Contrat invalide (ID manquant)' });
//       return;
//     }

//     setSaving(true)
//     onCreating?.()

//     try {
//       const result = await createSession({
//         contract_id: contractId,
//         date_session: form.date_seance,
//         heure_debut: form.heure_debut,
//         heure_fin: form.heure_fin,
//         lieu: form.lieu,
//         type_session: 'presentiel',
//         lien_visio: undefined,
//         notes_precepteur: form.notes || undefined
//       })
      
//       console.log('✅ Session créée:', result);
//       onSuccess()
//       onClose()
//     } catch (error: any) {
//       console.error('❌ Erreur création session:', error)
//       setErrors({ general: error.message || 'Erreur lors de la création de la séance' })
//       onError?.()
//     } finally {
//       setSaving(false)
//     }
//   }

//   const apercuDuree = form.heure_debut && form.heure_fin 
//     ? timeToMinutes(form.heure_fin) - timeToMinutes(form.heure_debut)
//     : 0

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
//         <div className="p-6 border-b flex justify-between items-center">
//           <h2 className="text-xl font-semibold flex items-center gap-2">
//             <Calendar className="w-5 h-5" />
//             Planifier une séance
//           </h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           {/* ✅ DEBUG: Afficher l'ID du contrat */}
//           <div className="bg-gray-50 p-2 rounded text-xs text-gray-500">
//             Contrat ID: {String(contract.id)} (type: {typeof contract.id})
//           </div>

//           {errors.general && (
//             <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
//               <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errors.general}
//             </div>
//           )}

//           <div className="bg-blue-50 p-3 rounded-lg space-y-1">
//             <p className="text-sm font-medium text-blue-900">
//               {info.matiereNom} - {info.elevePrenom} {info.eleveNom}
//             </p>
//             {info.dateDebutStr && info.dateFinStr && (
//               <p className="text-xs text-blue-700">
//                 Période : {dateDebut.toLocaleDateString('fr-FR')} → {dateFin.toLocaleDateString('fr-FR')}
//               </p>
//             )}
//             <p className="text-xs text-blue-700">
//               Horaires contrat : {info.heureDebutPref} - {info.heureFinPref}
//             </p>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Date de la séance *</label>
//             <input
//               type="date"
//               value={form.date_seance}
//               onChange={(e) => {
//                 setForm({ ...form, date_seance: e.target.value })
//                 setErrors({ ...errors, date_seance: undefined, general: undefined })
//               }}
//               min={minDate}
//               max={maxDate}
//               className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                 errors.date_seance ? 'border-red-300 bg-red-50' : 'border-gray-300'
//               }`}
//               required
//             />
//             {errors.date_seance && <p className="text-xs text-red-500 mt-1">{errors.date_seance}</p>}
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Heure début *</label>
//               <input
//                 type="time"
//                 value={form.heure_debut}
//                 onChange={(e) => {
//                   setForm({ ...form, heure_debut: e.target.value })
//                   setErrors({ ...errors, heure_debut: undefined, general: undefined })
//                 }}
//                 min={info.heureDebutPref}
//                 max={info.heureFinPref}
//                 className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                   errors.heure_debut ? 'border-red-300 bg-red-50' : 'border-gray-300'
//                 }`}
//                 required
//               />
//               {errors.heure_debut && <p className="text-xs text-red-500 mt-1">{errors.heure_debut}</p>}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Heure fin *</label>
//               <input
//                 type="time"
//                 value={form.heure_fin}
//                 onChange={(e) => {
//                   setForm({ ...form, heure_fin: e.target.value })
//                   setErrors({ ...errors, heure_fin: undefined, general: undefined })
//                 }}
//                 min={form.heure_debut || info.heureDebutPref}
//                 max={info.heureFinPref}
//                 className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                   errors.heure_fin ? 'border-red-300 bg-red-50' : 'border-gray-300'
//                 }`}
//                 required
//               />
//               {errors.heure_fin && <p className="text-xs text-red-500 mt-1">{errors.heure_fin}</p>}
//             </div>
//           </div>

//           {apercuDuree > 0 && (
//             <div className="bg-green-50 p-3 rounded-lg flex items-center gap-2">
//               <Clock className="w-4 h-4 text-green-600" />
//               <p className="text-sm text-green-700">
//                 Durée : <span className="font-medium">{apercuDuree} minutes</span>
//               </p>
//             </div>
//           )}

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
//               <MapPin className="w-4 h-4" /> Lieu de la séance *
//             </label>
//             <input
//               type="text"
//               value={form.lieu}
//               onChange={(e) => {
//                 setForm({ ...form, lieu: e.target.value })
//                 setErrors({ ...errors, lieu: undefined })
//               }}
//               placeholder="Adresse où se déroulera la séance"
//               className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                 errors.lieu ? 'border-red-300 bg-red-50' : 'border-gray-300'
//               }`}
//               required
//             />
//             {errors.lieu && <p className="text-xs text-red-500 mt-1">{errors.lieu}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
//             <textarea
//               value={form.notes}
//               onChange={(e) => setForm({ ...form, notes: e.target.value })}
//               placeholder="Notes pour cette séance..."
//               rows={3}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//             />
//           </div>

//           <div className="flex gap-2 pt-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
//             >
//               Annuler
//             </button>
//             <button
//               type="submit"
//               disabled={saving}
//               className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
//             >
//               {saving ? (
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
//               ) : (
//                 <Calendar className="w-4 h-4" />
//               )}
//               Planifier
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// components/CreateSessionModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { createSession } from '@/lib/session-api'
import { 
  X, Calendar, Clock, MapPin, BookOpen,
  AlertCircle, Info, Building2, Home
} from 'lucide-react'

// ✅ Type Contract compatible avec le type Contrat du dashboard
type Contract = {
  id: number | string
  parent_id?: number | string
  date_debut?: string
  date_fin?: string
  heure_debut_pref?: string
  heure_fin_pref?: string
  type_contrat?: string
  frequence?: string
  tarif_horaire?: number | null
  tarif_final?: number
  statut?: string
  titre?: string
  matiere?: string | {
    id?: number
    nom: string
    niveau?: string
    description?: string | null
  } | null
  niveau?: string
  eleve?: {
    id?: number
    nom: string
    prenom: string
    postnom?: string | null
    niveau?: string
    ecole?: string | null
    genre?: string
    date_naissance?: string | null
  } | null
  matiere_obj?: {
    id?: number
    nom: string
    niveau?: string
    description?: string | null
  } | null
  parent?: {
    id?: number | string
    telephone?: string | null
    adresse?: string | null
    user?: {
      id?: string
      username?: string
      email?: string
      photo_profil?: string | null
      telephone?: string | null
    }
  } | null
}

type SeanceForm = {
  date_seance: string
  heure_debut: string
  heure_fin: string
  lieu: string
  notes: string
}

type FormErrors = {
  date_seance?: string
  heure_debut?: string
  heure_fin?: string
  lieu?: string
  general?: string
}

function getContractInfo(contract: Contract) {
  const dateDebutStr = contract.date_debut || ''
  const dateFinStr = contract.date_fin || ''
  const heureDebutPref = contract.heure_debut_pref?.slice(0, 5) || '08:00'
  const heureFinPref = contract.heure_fin_pref?.slice(0, 5) || '18:00'
  
  let matiereNom = 'Matière'
  if (typeof contract.matiere === 'string') {
    matiereNom = contract.matiere
  } else if (contract.matiere_obj?.nom) {
    matiereNom = contract.matiere_obj.nom
  } else if (contract.matiere?.nom) {
    matiereNom = contract.matiere.nom
  }
  
  const elevePrenom = contract.eleve?.prenom || ''
  const eleveNom = contract.eleve?.nom || ''
  const parentAdresse = contract.parent?.adresse || ''
  
  return {
    dateDebutStr,
    dateFinStr,
    heureDebutPref,
    heureFinPref,
    matiereNom,
    elevePrenom,
    eleveNom,
    parentAdresse,
    niveau: contract.niveau || contract.eleve?.niveau || ''
  }
}

export default function CreateSessionModal({ 
  contract, 
  isOpen, 
  onClose, 
  onSuccess,
  onCreating,
  onError  
}: {
  contract: Contract | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  onCreating?: () => void
  onError?: () => void  
}) {
  const [form, setForm] = useState<SeanceForm>({
    date_seance: '',
    heure_debut: '',
    heure_fin: '',
    lieu: '',
    notes: ''
  })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [parentAdresse, setParentAdresse] = useState<string>('')

  useEffect(() => {
    if (contract) {
      const info = getContractInfo(contract)
      setParentAdresse(info.parentAdresse)
    } else {
      setParentAdresse('')
    }
  }, [contract])

  useEffect(() => {
    if (contract) {
      const info = getContractInfo(contract)
      
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      let dateDebut: Date
      let dateFin: Date
      
      if (info.dateDebutStr) {
        dateDebut = new Date(info.dateDebutStr)
        dateDebut.setHours(0, 0, 0, 0)
      } else {
        dateDebut = today
      }
      
      if (info.dateFinStr) {
        dateFin = new Date(info.dateFinStr)
        dateFin.setHours(0, 0, 0, 0)
      } else {
        dateFin = new Date(today)
        dateFin.setMonth(dateFin.getMonth() + 3)
      }

      let defaultDate: Date
      if (today >= dateDebut && today <= dateFin) {
        defaultDate = today
      } else {
        defaultDate = dateDebut
      }

      setForm({
        date_seance: defaultDate.toISOString().split('T')[0],
        heure_debut: info.heureDebutPref,
        heure_fin: info.heureFinPref,
        lieu: info.parentAdresse || parentAdresse || '',
        notes: ''
      })
      setErrors({})
    }
  }, [contract, parentAdresse])

  if (!isOpen || !contract) return null

  const info = getContractInfo(contract)

  const timeToMinutes = (time: string): number => {
    const [h, m] = time.split(':').map(Number)
    return h * 60 + m
  }

  const dateDebut = info.dateDebutStr ? new Date(info.dateDebutStr) : new Date()
  dateDebut.setHours(0, 0, 0, 0)
  
  const dateFin = info.dateFinStr ? new Date(info.dateFinStr) : (() => {
    const d = new Date()
    d.setMonth(d.getMonth() + 3)
    return d
  })()
  dateFin.setHours(0, 0, 0, 0)

  const minDate = dateDebut.toISOString().split('T')[0]
  const maxDate = dateFin.toISOString().split('T')[0]

  const contratHeureDebutMin = timeToMinutes(info.heureDebutPref)
  const contratHeureFinMax = timeToMinutes(info.heureFinPref)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!form.date_seance) {
      newErrors.date_seance = 'La date est requise'
    } else {
      const selectedDate = new Date(form.date_seance)
      selectedDate.setHours(0, 0, 0, 0)
      
      if (selectedDate < dateDebut) {
        newErrors.date_seance = `Date minimum : ${dateDebut.toLocaleDateString('fr-FR')}`
      } else if (selectedDate > dateFin) {
        newErrors.date_seance = `Date maximum : ${dateFin.toLocaleDateString('fr-FR')}`
      }
    }

    if (!form.heure_debut) {
      newErrors.heure_debut = "L'heure de début est requise"
    } else {
      const debutMin = timeToMinutes(form.heure_debut)
      if (debutMin < contratHeureDebutMin) {
        newErrors.heure_debut = `Heure minimale : ${info.heureDebutPref}`
      }
    }

    if (!form.heure_fin) {
      newErrors.heure_fin = "L'heure de fin est requise"
    } else {
      const finMin = timeToMinutes(form.heure_fin)
      if (finMin > contratHeureFinMax) {
        newErrors.heure_fin = `Heure maximale : ${info.heureFinPref}`
      }
    }

    if (form.heure_debut && form.heure_fin) {
      const debutMin = timeToMinutes(form.heure_debut)
      const finMin = timeToMinutes(form.heure_fin)

      if (debutMin >= finMin) {
        newErrors.heure_fin = "L'heure de fin doit être après l'heure de début"
      }

      const duree = finMin - debutMin
      if (duree > 0 && duree < 30) {
        newErrors.general = 'La durée minimale est de 30 minutes'
      }
    }

    if (!form.lieu || form.lieu.trim() === '') {
      newErrors.lieu = 'Le lieu est obligatoire pour une séance en présentiel'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    // ✅ Garder l'ID en string (les IDs contiennent des lettres)
    const contractId = String(contract.id)
    
    console.log('📤 Création session - Données:', {
      contract_id: contractId,
      contract_id_type: typeof contractId,
      date_session: form.date_seance,
      heure_debut: form.heure_debut,
      heure_fin: form.heure_fin,
      lieu: form.lieu
    })

    // Vérifier que le contract_id est valide (non vide)
    if (!contractId || contractId.trim() === '') {
      setErrors({ general: 'Erreur: Contrat invalide (ID manquant)' })
      return
    }

    setSaving(true)
    onCreating?.()

    try {
      const result = await createSession({
        contract_id: contractId,  // ✅ Envoyer en string
        date_session: form.date_seance,
        heure_debut: form.heure_debut,
        heure_fin: form.heure_fin,
        lieu: form.lieu.trim(),
        type_session: 'presentiel',
        lien_visio: undefined,
        notes_precepteur: form.notes?.trim() || undefined
      })
      
      console.log('✅ Session créée avec succès:', result)
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('❌ Erreur création session:', error)
      setErrors({ general: error.message || 'Erreur lors de la création de la séance' })
      onError?.()
    } finally {
      setSaving(false)
    }
  }

  const apercuDuree = form.heure_debut && form.heure_fin 
    ? timeToMinutes(form.heure_fin) - timeToMinutes(form.heure_debut)
    : 0

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Planifier une séance
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Erreur générale */}
          {errors.general && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errors.general}
            </div>
          )}

          {/* Info contrat */}
          <div className="bg-blue-50 p-3 rounded-lg space-y-1">
            <p className="text-sm font-medium text-blue-900">
              {info.matiereNom} - {info.elevePrenom} {info.eleveNom}
            </p>
            {info.dateDebutStr && info.dateFinStr && (
              <p className="text-xs text-blue-700">
                Période : {dateDebut.toLocaleDateString('fr-FR')} → {dateFin.toLocaleDateString('fr-FR')}
              </p>
            )}
            <p className="text-xs text-blue-700">
              Horaires contrat : {info.heureDebutPref} - {info.heureFinPref}
            </p>
            {info.niveau && (
              <p className="text-xs text-blue-700">Niveau : {info.niveau}</p>
            )}
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              <MapPin className="w-3 h-3" />
              Séance en présentiel
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de la séance *
            </label>
            <input
              type="date"
              value={form.date_seance}
              onChange={(e) => {
                setForm({ ...form, date_seance: e.target.value })
                setErrors({ ...errors, date_seance: undefined, general: undefined })
              }}
              min={minDate}
              max={maxDate}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.date_seance ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              required
            />
            {errors.date_seance && (
              <p className="text-xs text-red-500 mt-1">{errors.date_seance}</p>
            )}
          </div>

          {/* Horaires */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heure début *
              </label>
              <input
                type="time"
                value={form.heure_debut}
                onChange={(e) => {
                  setForm({ ...form, heure_debut: e.target.value })
                  setErrors({ ...errors, heure_debut: undefined, general: undefined })
                }}
                min={info.heureDebutPref}
                max={info.heureFinPref}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.heure_debut ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                required
              />
              {errors.heure_debut && (
                <p className="text-xs text-red-500 mt-1">{errors.heure_debut}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heure fin *
              </label>
              <input
                type="time"
                value={form.heure_fin}
                onChange={(e) => {
                  setForm({ ...form, heure_fin: e.target.value })
                  setErrors({ ...errors, heure_fin: undefined, general: undefined })
                }}
                min={form.heure_debut || info.heureDebutPref}
                max={info.heureFinPref}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.heure_fin ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                required
              />
              {errors.heure_fin && (
                <p className="text-xs text-red-500 mt-1">{errors.heure_fin}</p>
              )}
            </div>
          </div>

          {/* Aperçu durée */}
          {apercuDuree > 0 && (
            <div className="bg-green-50 p-3 rounded-lg flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-600" />
              <p className="text-sm text-green-700">
                Durée : <span className="font-medium">{apercuDuree} minutes</span>
                {apercuDuree >= 60 && ` (${Math.floor(apercuDuree / 60)}h${apercuDuree % 60 > 0 ? ` ${apercuDuree % 60}min` : ''})`}
              </p>
            </div>
          )}

          {/* Lieu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Lieu de la séance *
              {parentAdresse && (
                <span className="text-xs text-gray-400 font-normal">(adresse du parent suggérée)</span>
              )}
            </label>
            
            <input
              type="text"
              value={form.lieu}
              onChange={(e) => {
                setForm({ ...form, lieu: e.target.value })
                setErrors({ ...errors, lieu: undefined })
              }}
              placeholder="Adresse où se déroulera la séance"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.lieu ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              required
            />
            {errors.lieu && (
              <p className="text-xs text-red-500 mt-1">{errors.lieu}</p>
            )}
            
            {parentAdresse ? (
              <div className="mt-1.5 flex items-start gap-2">
                <Building2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-500">
                  Adresse par défaut du parent : <span className="font-medium text-gray-700">{parentAdresse}</span>
                </p>
              </div>
            ) : (
              <div className="mt-1.5 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-600">
                  Le parent n'a pas encore renseigné son adresse. Veuillez la saisir manuellement.
                </p>
              </div>
            )}
            
            {parentAdresse && form.lieu !== parentAdresse && (
              <button
                type="button"
                onClick={() => setForm({ ...form, lieu: parentAdresse })}
                className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <Home className="w-3 h-3" />
                Utiliser l'adresse du parent
              </button>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Notes pour cette séance..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Calendar className="w-4 h-4" />
              )}
              Planifier
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}