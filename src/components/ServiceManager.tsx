// // components/ServiceManager.tsx
// 'use client'

// import { useState, useEffect, useCallback } from 'react'
// import { 
//   Plus, Edit3, Trash2, Eye, EyeOff, 
//   BookOpen, Users, Clock, MapPin, 
//   Laptop, Tag, X, Check
// } from 'lucide-react'
// import { supabase } from '@/lib/supabase'

// type ServicePrecepteur = {
//   id: number
//   precepteur_id: number
//   titre: string
//   description: string | null
//   type_service: string
//   modalite: string
//   tarif_horaire: number | null
//   tarif_forfaitaire: number | null
//   duree_minutes: number
//   nombre_eleves_max: number
//   est_actif: boolean
//   created_at: string
//   updated_at: string
// }

// type ServiceManagerProps = {
//   precepteurId?: number
//   isOwner?: boolean
// }

// export default function ServiceManager({ precepteurId, isOwner = false }: ServiceManagerProps) {
//   const [services, setServices] = useState<ServicePrecepteur[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [showForm, setShowForm] = useState(false)
//   const [editingService, setEditingService] = useState<ServicePrecepteur | null>(null)
//   const [saving, setSaving] = useState(false)
//   const [message, setMessage] = useState('')
  
//   const [form, setForm] = useState({
//     titre: '',
//     description: '',
//     type_service: 'cours_particulier',
//     modalite: 'presentiel',
//     tarif_horaire: 0,
//     tarif_forfaitaire: 0,
//     duree_minutes: 60,
//     nombre_eleves_max: 1
//   })

//   // ✅ Fonction de chargement avec useCallback pour éviter les re-rendus inutiles
//   const loadServices = useCallback(async () => {
//     if (!precepteurId) {
//       console.log('❌ Pas de precepteurId fourni')
//       setLoading(false)
//       return
//     }

//     console.log('📥 Chargement des services pour precepteurId:', precepteurId)
//     setLoading(true)
//     setError(null)

//     try {
//       const { data, error } = await supabase
//         .from('services_precepteur')
//         .select('*')
//         .eq('precepteur_id', precepteurId)
//         .order('created_at', { ascending: false })

//       if (error) {
//         console.error('❌ Erreur chargement services:', error)
//         setError('Erreur lors du chargement des services')
//         setServices([])
//       } else {
//         console.log('✅ Services chargés:', data?.length || 0, 'services')
//         setServices(data || [])
//       }
//     } catch (err) {
//       console.error('❌ Exception chargement services:', err)
//       setError('Erreur inattendue')
//       setServices([])
//     } finally {
//       setLoading(false)
//     }
//   }, [precepteurId])

//   // ✅ Charger les services quand precepteurId change
//   useEffect(() => {
//     loadServices()
//   }, [loadServices])

//   const resetForm = () => {
//     setForm({
//       titre: '',
//       description: '',
//       type_service: 'cours_particulier',
//       modalite: 'presentiel',
//       tarif_horaire: 0,
//       tarif_forfaitaire: 0,
//       duree_minutes: 60,
//       nombre_eleves_max: 1
//     })
//     setEditingService(null)
//     setMessage('')
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setSaving(true)
//     setMessage('')

//     if (!precepteurId) {
//       setMessage('❌ Erreur: ID du précepteur manquant')
//       setSaving(false)
//       return
//     }

//     console.log('💾 Sauvegarde du service:', {
//       precepteurId,
//       ...form,
//       isEditing: !!editingService
//     })

//     try {
//       if (editingService) {
//         // ✅ Mise à jour
//         const { error } = await supabase
//           .from('services_precepteur')
//           .update({
//             titre: form.titre,
//             description: form.description || null,
//             type_service: form.type_service,
//             modalite: form.modalite,
//             tarif_horaire: form.tarif_horaire || null,
//             tarif_forfaitaire: form.tarif_forfaitaire || null,
//             duree_minutes: form.duree_minutes,
//             nombre_eleves_max: form.nombre_eleves_max,
//             updated_at: new Date().toISOString()
//           })
//           .eq('id', editingService.id)
//           .eq('precepteur_id', precepteurId)

//         if (error) {
//           console.error('❌ Erreur mise à jour:', error)
//           setMessage('Erreur lors de la mise à jour du service')
//         } else {
//           console.log('✅ Service mis à jour')
//           setMessage('✅ Service mis à jour avec succès')
//         }
//       } else {
//         // ✅ Création
//         const { data, error } = await supabase
//           .from('services_precepteur')
//           .insert([{
//             precepteur_id: precepteurId,
//             titre: form.titre,
//             description: form.description || null,
//             type_service: form.type_service,
//             modalite: form.modalite,
//             tarif_horaire: form.tarif_horaire || null,
//             tarif_forfaitaire: form.tarif_forfaitaire || null,
//             duree_minutes: form.duree_minutes,
//             nombre_eleves_max: form.nombre_eleves_max,
//             est_actif: true
//           }])
//           .select()

//         if (error) {
//           console.error('❌ Erreur création:', error)
//           setMessage('Erreur lors de la création du service')
//         } else {
//           console.log('✅ Service créé:', data)
//           setMessage('✅ Service créé avec succès')
//         }
//       }

//       // ✅ Recharger les services APRÈS la sauvegarde
//       await loadServices()
//       resetForm()
//       setShowForm(false)
//     } catch (err) {
//       console.error('❌ Exception sauvegarde:', err)
//       setMessage('Erreur inattendue lors de la sauvegarde')
//     } finally {
//       setSaving(false)
//       // Effacer le message après 3 secondes
//       setTimeout(() => setMessage(''), 3000)
//     }
//   }

//   const handleEdit = (service: ServicePrecepteur) => {
//     setForm({
//       titre: service.titre,
//       description: service.description || '',
//       type_service: service.type_service,
//       modalite: service.modalite,
//       tarif_horaire: service.tarif_horaire || 0,
//       tarif_forfaitaire: service.tarif_forfaitaire || 0,
//       duree_minutes: service.duree_minutes,
//       nombre_eleves_max: service.nombre_eleves_max
//     })
//     setEditingService(service)
//     setShowForm(true)
//   }

//   const handleDelete = async (serviceId: number) => {
//     if (!confirm('Voulez-vous vraiment supprimer ce service ?')) return

//     console.log('🗑️ Suppression du service:', serviceId)

//     try {
//       const { error } = await supabase
//         .from('services_precepteur')
//         .delete()
//         .eq('id', serviceId)
//         .eq('precepteur_id', precepteurId)

//       if (error) {
//         console.error('❌ Erreur suppression:', error)
//         setMessage('Erreur lors de la suppression')
//       } else {
//         console.log('✅ Service supprimé')
//         setMessage('✅ Service supprimé avec succès')
//         await loadServices()
//       }
//     } catch (err) {
//       console.error('❌ Exception suppression:', err)
//       setMessage('Erreur inattendue')
//     }

//     setTimeout(() => setMessage(''), 3000)
//   }

//   const handleToggleActive = async (service: ServicePrecepteur) => {
//     console.log('🔄 Toggle actif:', service.id, !service.est_actif)

//     try {
//       const { error } = await supabase
//         .from('services_precepteur')
//         .update({ 
//           est_actif: !service.est_actif,
//           updated_at: new Date().toISOString()
//         })
//         .eq('id', service.id)
//         .eq('precepteur_id', precepteurId)

//       if (error) {
//         console.error('❌ Erreur toggle:', error)
//         setMessage('Erreur lors de la modification')
//       } else {
//         await loadServices()
//       }
//     } catch (err) {
//       console.error('❌ Exception toggle:', err)
//       setMessage('Erreur inattendue')
//     }

//     setTimeout(() => setMessage(''), 3000)
//   }

//   const getTypeServiceLabel = (type: string) => {
//     const labels: { [key: string]: string } = {
//       'cours_particulier': 'Cours particulier',
//       'aide_devoirs': 'Aide aux devoirs',
//       'preparation_examens': 'Préparation aux examens',
//       'soutien_scolaire': 'Soutien scolaire',
//       'autre': 'Autre'
//     }
//     return labels[type] || type
//   }

//   const getModaliteLabel = (modalite: string) => {
//     const labels: { [key: string]: string } = {
//       'presentiel': 'Présentiel',
//       'en_ligne': 'En ligne',
//       'hybride': 'Hybride'
//     }
//     return labels[modalite] || modalite
//   }

//   const getModaliteIcon = (modalite: string) => {
//     switch (modalite) {
//       case 'presentiel': return <MapPin className="w-4 h-4" />
//       case 'en_ligne': return <Laptop className="w-4 h-4" />
//       case 'hybride': return <Users className="w-4 h-4" />
//       default: return null
//     }
//   }

//   // ✅ Ajouter un bouton de rafraîchissement manuel
//   const handleRefresh = () => {
//     console.log('🔄 Rafraîchissement manuel')
//     loadServices()
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center py-8">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-red-600 mb-4">{error}</p>
//         <button
//           onClick={handleRefresh}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//         >
//           Réessayer
//         </button>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Message de succès/erreur */}
//       {message && (
//         <div className={`p-4 rounded-xl ${
//           message.startsWith('✅') ? 'bg-green-50 text-green-800' : 
//           message.startsWith('❌') ? 'bg-red-50 text-red-800' : 
//           'bg-blue-50 text-blue-800'
//         }`}>
//           <p className="text-sm font-medium">{message}</p>
//         </div>
//       )}

//       {/* En-tête */}
//       {isOwner && (
//         <div className="flex justify-between items-center">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900">Mes services proposés</h3>
//             <p className="text-sm text-gray-500">
//               {services.length} service{services.length > 1 ? 's' : ''} proposé{services.length > 1 ? 's' : ''}
//             </p>
//           </div>
//           <div className="flex gap-2">
//             {/* ✅ Bouton de rafraîchissement */}
//             <button
//               onClick={handleRefresh}
//               className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm"
//               title="Rafraîchir la liste"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//               </svg>
//               Actualiser
//             </button>
//             <button
//               onClick={() => {
//                 resetForm()
//                 setShowForm(true)
//               }}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
//             >
//               <Plus className="w-4 h-4" />
//               Nouveau service
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Formulaire */}
//       {showForm && isOwner && (
//         <div className="bg-white border rounded-xl p-6 shadow-sm">
//           <div className="flex justify-between items-center mb-4">
//             <h4 className="font-medium text-gray-900">
//               {editingService ? 'Modifier le service' : 'Nouveau service'}
//             </h4>
//             <button
//               onClick={() => {
//                 setShowForm(false)
//                 resetForm()
//               }}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Titre du service *</label>
//                 <input
//                   type="text"
//                   value={form.titre}
//                   onChange={(e) => setForm({ ...form, titre: e.target.value })}
//                   className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Ex: Cours de mathématiques niveau collège"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Type de service</label>
//                 <select
//                   value={form.type_service}
//                   onChange={(e) => setForm({ ...form, type_service: e.target.value })}
//                   className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="cours_particulier">Cours particulier</option>
//                   <option value="aide_devoirs">Aide aux devoirs</option>
//                   <option value="preparation_examens">Préparation aux examens</option>
//                   <option value="soutien_scolaire">Soutien scolaire</option>
//                   <option value="autre">Autre</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Modalité</label>
//                 <select
//                   value={form.modalite}
//                   onChange={(e) => setForm({ ...form, modalite: e.target.value })}
//                   className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="presentiel">Présentiel</option>
//                   <option value="en_ligne">En ligne</option>
//                   <option value="hybride">Hybride</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Durée (minutes)</label>
//                 <input
//                   type="number"
//                   value={form.duree_minutes}
//                   onChange={(e) => setForm({ ...form, duree_minutes: parseInt(e.target.value) })}
//                   className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   min="30"
//                   step="30"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Nombre d'élèves maximum</label>
//                 <input
//                   type="number"
//                   value={form.nombre_eleves_max}
//                   onChange={(e) => setForm({ ...form, nombre_eleves_max: parseInt(e.target.value) })}
//                   className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   min="1"
//                   max="10"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Tarif horaire (FC)
//                 </label>
//                 <input
//                   type="number"
//                   value={form.tarif_horaire}
//                   onChange={(e) => setForm({ ...form, tarif_horaire: parseFloat(e.target.value) })}
//                   className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   min="0"
//                   step="1000"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Tarif forfaitaire (FC)
//                 </label>
//                 <input
//                   type="number"
//                   value={form.tarif_forfaitaire}
//                   onChange={(e) => setForm({ ...form, tarif_forfaitaire: parseFloat(e.target.value) })}
//                   className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   min="0"
//                   step="1000"
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                 <textarea
//                   value={form.description}
//                   onChange={(e) => setForm({ ...form, description: e.target.value })}
//                   className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   rows={3}
//                   placeholder="Décrivez votre service, votre méthodologie, vos disponibilités..."
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end gap-2 pt-4">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowForm(false)
//                   resetForm()
//                 }}
//                 className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
//               >
//                 Annuler
//               </button>
//               <button
//                 type="submit"
//                 disabled={saving}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
//               >
//                 {saving ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                     Enregistrement...
//                   </>
//                 ) : editingService ? (
//                   'Modifier'
//                 ) : (
//                   'Créer'
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Liste des services */}
//       {services.length === 0 && !showForm && (
//         <div className="text-center py-12 bg-gray-50 rounded-xl">
//           <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
//           <p className="text-gray-500 mb-4">Aucun service proposé pour le moment</p>
//           {isOwner && (
//             <button
//               onClick={() => {
//                 resetForm()
//                 setShowForm(true)
//               }}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
//             >
//               <Plus className="w-4 h-4" />
//               Créer mon premier service
//             </button>
//           )}
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {services.map((service) => (
//           <div
//             key={service.id}
//             className={`bg-white border rounded-xl p-5 hover:shadow-md transition-shadow ${
//               !service.est_actif ? 'opacity-60' : ''
//             }`}
//           >
//             <div className="flex items-start justify-between mb-3">
//               <div className="flex items-start gap-3">
//                 <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                   <BookOpen className="w-5 h-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <h4 className="font-semibold text-gray-900">{service.titre}</h4>
//                   <div className="flex items-center gap-2 mt-1">
//                     <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
//                       {getTypeServiceLabel(service.type_service)}
//                     </span>
//                     <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
//                       {getModaliteIcon(service.modalite)}
//                       {getModaliteLabel(service.modalite)}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {isOwner && (
//                 <div className="flex items-center gap-1">
//                   <button
//                     onClick={() => handleToggleActive(service)}
//                     className={`p-1.5 rounded-lg transition-colors ${
//                       service.est_actif 
//                         ? 'text-green-600 hover:bg-green-50' 
//                         : 'text-gray-400 hover:bg-gray-50'
//                     }`}
//                     title={service.est_actif ? 'Désactiver' : 'Activer'}
//                   >
//                     {service.est_actif ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
//                   </button>
//                   <button
//                     onClick={() => handleEdit(service)}
//                     className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                     title="Modifier"
//                   >
//                     <Edit3 className="w-4 h-4" />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(service.id)}
//                     className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                     title="Supprimer"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               )}
//             </div>

//             {service.description && (
//               <p className="text-sm text-gray-600 mb-3">{service.description}</p>
//             )}

//             <div className="flex flex-wrap gap-3 text-sm text-gray-500">
//               <span className="flex items-center gap-1">
//                 <Clock className="w-4 h-4" />
//                 {service.duree_minutes} min
//               </span>
//               <span className="flex items-center gap-1">
//                 <Users className="w-4 h-4" />
//                 {service.nombre_eleves_max} élève{service.nombre_eleves_max > 1 ? 's' : ''} max
//               </span>
//               {service.tarif_horaire && service.tarif_horaire > 0 && (
//                 <span className="flex items-center gap-1 text-green-600 font-medium">
//                   <Tag className="w-4 h-4" />
//                   {service.tarif_horaire.toLocaleString()} FC/h
//                 </span>
//               )}
//               {service.tarif_forfaitaire && service.tarif_forfaitaire > 0 && (
//                 <span className="flex items-center gap-1 text-orange-600 font-medium">
//                   <Tag className="w-4 h-4" />
//                   Forfait: {service.tarif_forfaitaire.toLocaleString()} FC
//                 </span>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// components/ServiceManager.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Plus, Edit3, Trash2, Eye, EyeOff, 
  BookOpen, Users, Clock, MapPin, 
  Laptop, Tag, X, Check,
  Save, Loader2
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

type ServicePrecepteur = {
  id: number
  precepteur_id: number
  titre: string
  description: string | null
  type_service: string
  modalite: string
  tarif_horaire: number | null
  tarif_forfaitaire: number | null
  duree_minutes: number
  nombre_eleves_max: number
  est_actif: boolean
  created_at: string
  updated_at: string
}

type ServiceManagerProps = {
  precepteurId?: number
  isOwner?: boolean
}

// ✅ Modal pour ajouter/modifier un service
function ServiceFormModal({
  isOpen,
  onClose,
  onSave,
  service,
  saving
}: {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => Promise<void>
  service: ServicePrecepteur | null
  saving: boolean
}) {
  const [form, setForm] = useState({
    titre: '',
    description: '',
    type_service: 'cours_particulier',
    modalite: 'presentiel',
    tarif_horaire: 0,
    tarif_forfaitaire: 0,
    duree_minutes: 60,
    nombre_eleves_max: 1
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (service) {
      setForm({
        titre: service.titre,
        description: service.description || '',
        type_service: service.type_service,
        modalite: service.modalite,
        tarif_horaire: service.tarif_horaire || 0,
        tarif_forfaitaire: service.tarif_forfaitaire || 0,
        duree_minutes: service.duree_minutes,
        nombre_eleves_max: service.nombre_eleves_max
      })
    } else {
      setForm({
        titre: '',
        description: '',
        type_service: 'cours_particulier',
        modalite: 'presentiel',
        tarif_horaire: 0,
        tarif_forfaitaire: 0,
        duree_minutes: 60,
        nombre_eleves_max: 1
      })
    }
    setErrors({})
  }, [service, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!form.titre.trim()) {
      newErrors.titre = 'Le titre est requis'
    } else if (form.titre.length < 3) {
      newErrors.titre = 'Le titre doit contenir au moins 3 caractères'
    }

    if (form.duree_minutes < 30) {
      newErrors.duree_minutes = 'La durée minimum est de 30 minutes'
    }

    if (form.nombre_eleves_max < 1) {
      newErrors.nombre_eleves_max = 'Au moins 1 élève'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    await onSave(form)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* En-tête du modal */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {service ? 'Modifier le service' : 'Nouveau service'}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {service ? 'Modifiez les informations du service' : 'Créez un nouveau service à proposer'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Titre du service <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.titre}
              onChange={(e) => {
                setForm({ ...form, titre: e.target.value })
                if (errors.titre) setErrors({ ...errors, titre: '' })
              }}
              className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.titre ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ex: Cours de mathématiques niveau collège"
            />
            {errors.titre && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <X className="w-3 h-3" />
                {errors.titre}
              </p>
            )}
          </div>

          {/* Type de service & Modalité */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Type de service</label>
              <select
                value={form.type_service}
                onChange={(e) => setForm({ ...form, type_service: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="cours_particulier">Cours particulier</option>
                <option value="aide_devoirs">Aide aux devoirs</option>
                <option value="preparation_examens">Préparation aux examens</option>
                <option value="soutien_scolaire">Soutien scolaire</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Modalité</label>
              <select
                value={form.modalite}
                onChange={(e) => setForm({ ...form, modalite: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="presentiel">Présentiel</option>
                <option value="en_ligne">En ligne</option>
                <option value="hybride">Hybride</option>
              </select>
            </div>
          </div>

          {/* Durée & Nombre d'élèves */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Durée (minutes)
              </label>
              <select
                value={form.duree_minutes}
                onChange={(e) => setForm({ ...form, duree_minutes: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 heure</option>
                <option value="90">1h30</option>
                <option value="120">2 heures</option>
                <option value="150">2h30</option>
                <option value="180">3 heures</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nombre d'élèves max
              </label>
              <select
                value={form.nombre_eleves_max}
                onChange={(e) => setForm({ ...form, nombre_eleves_max: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1">1 élève (individuel)</option>
                <option value="2">2 élèves</option>
                <option value="3">3 élèves</option>
                <option value="4">4 élèves</option>
                <option value="5">5 élèves</option>
                <option value="10">10 élèves (groupe)</option>
              </select>
            </div>
          </div>

          {/* Tarifs */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-4">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tarification
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Tarif horaire (FC)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={form.tarif_horaire || ''}
                    onChange={(e) => setForm({ ...form, tarif_horaire: e.target.value ? parseFloat(e.target.value) : 0 })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                    min="0"
                    step="1000"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">FC/h</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Tarif forfaitaire (FC)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={form.tarif_forfaitaire || ''}
                    onChange={(e) => setForm({ ...form, tarif_forfaitaire: e.target.value ? parseFloat(e.target.value) : 0 })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                    min="0"
                    step="1000"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">FC</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Laissez 0 si vous ne souhaitez pas définir ce tarif
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={4}
              placeholder="Décrivez votre service, votre méthodologie, vos disponibilités..."
            />
            <p className="mt-1 text-xs text-gray-400">
              {form.description.length}/500 caractères
            </p>
          </div>

          {/* Aperçu rapide */}
          {form.titre && (
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                Aperçu du service
              </h4>
              <div className="flex flex-wrap gap-2 text-xs">
                {form.type_service && (
                  <span className="px-2 py-1 bg-white rounded-full text-blue-700">
                    {form.type_service === 'cours_particulier' ? 'Cours particulier' :
                     form.type_service === 'aide_devoirs' ? 'Aide aux devoirs' :
                     form.type_service === 'preparation_examens' ? 'Préparation examens' :
                     form.type_service === 'soutien_scolaire' ? 'Soutien scolaire' : 'Autre'}
                  </span>
                )}
                {form.modalite && (
                  <span className="px-2 py-1 bg-white rounded-full text-blue-700">
                    {form.modalite === 'presentiel' ? '🏠 Présentiel' :
                     form.modalite === 'en_ligne' ? '💻 En ligne' : '🔄 Hybride'}
                  </span>
                )}
                <span className="px-2 py-1 bg-white rounded-full text-blue-700">
                  ⏱️ {form.duree_minutes} min
                </span>
                <span className="px-2 py-1 bg-white rounded-full text-blue-700">
                  👥 {form.nombre_eleves_max} élève{form.nombre_eleves_max > 1 ? 's' : ''}
                </span>
                {(form.tarif_horaire > 0 || form.tarif_forfaitaire > 0) && (
                  <span className="px-2 py-1 bg-white rounded-full text-green-700 font-medium">
                    💰 {form.tarif_horaire > 0 ? `${form.tarif_horaire.toLocaleString()} FC/h` : `${form.tarif_forfaitaire.toLocaleString()} FC`}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {service ? 'Modifier' : 'Créer le service'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ✅ Modal de confirmation de suppression
function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  serviceTitle,
  deleting
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  serviceTitle: string
  deleting: boolean
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Supprimer le service ?</h3>
          <p className="text-sm text-gray-600">
            Vous êtes sur le point de supprimer définitivement le service <span className="font-semibold">"{serviceTitle}"</span>.
            Cette action est irréversible.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {deleting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Suppression...
              </>
            ) : (
              <>
                <Trash2 className="w-5 h-5" />
                Supprimer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ✅ Composant principal
export default function ServiceManager({ precepteurId, isOwner = false }: ServiceManagerProps) {
  const [services, setServices] = useState<ServicePrecepteur[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState('')
  
  // ✅ États pour les modals
  const [showFormModal, setShowFormModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingService, setEditingService] = useState<ServicePrecepteur | null>(null)
  const [deletingService, setDeletingService] = useState<ServicePrecepteur | null>(null)

  const loadServices = useCallback(async () => {
    if (!precepteurId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('services_precepteur')
        .select('*')
        .eq('precepteur_id', precepteurId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Erreur chargement services:', error)
        setError('Erreur lors du chargement des services')
        setServices([])
      } else {
        setServices(data || [])
      }
    } catch (err) {
      console.error('❌ Exception chargement services:', err)
      setError('Erreur inattendue')
      setServices([])
    } finally {
      setLoading(false)
    }
  }, [precepteurId])

  useEffect(() => {
    loadServices()
  }, [loadServices])

  const handleCreate = async (formData: any) => {
    if (!precepteurId) return
    setSaving(true)

    try {
      const { data, error } = await supabase
        .from('services_precepteur')
        .insert([{
          precepteur_id: precepteurId,
          titre: formData.titre,
          description: formData.description || null,
          type_service: formData.type_service,
          modalite: formData.modalite,
          tarif_horaire: formData.tarif_horaire || null,
          tarif_forfaitaire: formData.tarif_forfaitaire || null,
          duree_minutes: formData.duree_minutes,
          nombre_eleves_max: formData.nombre_eleves_max,
          est_actif: true
        }])

      if (error) {
        console.error('❌ Erreur création:', error)
        setMessage('❌ Erreur lors de la création du service')
      } else {
        setMessage('✅ Service créé avec succès')
        setShowFormModal(false)
        await loadServices()
      }
    } catch (err) {
      console.error('❌ Exception création:', err)
      setMessage('❌ Erreur inattendue')
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleUpdate = async (formData: any) => {
    if (!precepteurId || !editingService) return
    setSaving(true)

    try {
      const { error } = await supabase
        .from('services_precepteur')
        .update({
          titre: formData.titre,
          description: formData.description || null,
          type_service: formData.type_service,
          modalite: formData.modalite,
          tarif_horaire: formData.tarif_horaire || null,
          tarif_forfaitaire: formData.tarif_forfaitaire || null,
          duree_minutes: formData.duree_minutes,
          nombre_eleves_max: formData.nombre_eleves_max,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingService.id)
        .eq('precepteur_id', precepteurId)

      if (error) {
        console.error('❌ Erreur mise à jour:', error)
        setMessage('❌ Erreur lors de la mise à jour')
      } else {
        setMessage('✅ Service mis à jour avec succès')
        setShowFormModal(false)
        setEditingService(null)
        await loadServices()
      }
    } catch (err) {
      console.error('❌ Exception mise à jour:', err)
      setMessage('❌ Erreur inattendue')
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleDelete = async () => {
    if (!precepteurId || !deletingService) return
    setDeleting(true)

    try {
      const { error } = await supabase
        .from('services_precepteur')
        .delete()
        .eq('id', deletingService.id)
        .eq('precepteur_id', precepteurId)

      if (error) {
        console.error('❌ Erreur suppression:', error)
        setMessage('❌ Erreur lors de la suppression')
      } else {
        setMessage('✅ Service supprimé avec succès')
        setShowDeleteModal(false)
        setDeletingService(null)
        await loadServices()
      }
    } catch (err) {
      console.error('❌ Exception suppression:', err)
      setMessage('❌ Erreur inattendue')
    } finally {
      setDeleting(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleToggleActive = async (service: ServicePrecepteur) => {
    try {
      const { error } = await supabase
        .from('services_precepteur')
        .update({ 
          est_actif: !service.est_actif,
          updated_at: new Date().toISOString()
        })
        .eq('id', service.id)
        .eq('precepteur_id', precepteurId)

      if (!error) {
        await loadServices()
        setMessage(`✅ Service ${service.est_actif ? 'désactivé' : 'activé'} avec succès`)
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (err) {
      console.error('❌ Exception toggle:', err)
    }
  }

  const openCreateModal = () => {
    setEditingService(null)
    setShowFormModal(true)
  }

  const openEditModal = (service: ServicePrecepteur) => {
    setEditingService(service)
    setShowFormModal(true)
  }

  const openDeleteModal = (service: ServicePrecepteur) => {
    setDeletingService(service)
    setShowDeleteModal(true)
  }

  const getTypeServiceLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'cours_particulier': 'Cours particulier',
      'aide_devoirs': 'Aide aux devoirs',
      'preparation_examens': 'Préparation aux examens',
      'soutien_scolaire': 'Soutien scolaire',
      'autre': 'Autre'
    }
    return labels[type] || type
  }

  const getModaliteLabel = (modalite: string) => {
    const labels: { [key: string]: string } = {
      'presentiel': 'Présentiel',
      'en_ligne': 'En ligne',
      'hybride': 'Hybride'
    }
    return labels[modalite] || modalite
  }

  const getModaliteIcon = (modalite: string) => {
    switch (modalite) {
      case 'presentiel': return <MapPin className="w-4 h-4" />
      case 'en_ligne': return <Laptop className="w-4 h-4" />
      case 'hybride': return <Users className="w-4 h-4" />
      default: return null
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <X className="w-8 h-8 text-red-600" />
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => loadServices()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Message de succès/erreur */}
      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${
          message.startsWith('✅') ? 'bg-green-50 text-green-800 border border-green-200' : 
          message.startsWith('❌') ? 'bg-red-50 text-red-800 border border-red-200' : 
          'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {message.startsWith('✅') ? (
            <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
          ) : message.startsWith('❌') ? (
            <X className="w-5 h-5 text-red-600 flex-shrink-0" />
          ) : null}
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}

      {/* En-tête */}
      {isOwner && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Mes services proposés</h3>
            <p className="text-sm text-gray-500">
              {services.length} service{services.length > 1 ? 's' : ''} proposé{services.length > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => loadServices()}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm"
              title="Rafraîchir la liste"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualiser
            </button>
            <button
              onClick={openCreateModal}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Nouveau service
            </button>
          </div>
        </div>
      )}

      {/* Liste des services */}
      {services.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun service</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Vous n'avez pas encore créé de service. Proposez vos premiers services pour être visible par les parents.
          </p>
          {isOwner && (
            <button
              onClick={openCreateModal}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors inline-flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Créer mon premier service
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              className={`bg-white border rounded-2xl p-5 hover:shadow-lg transition-all group ${
                !service.est_actif ? 'opacity-60 hover:opacity-80' : ''
              }`}
            >
              {/* En-tête de la carte */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    service.est_actif ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <BookOpen className={`w-5 h-5 ${
                      service.est_actif ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{service.titre}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        service.est_actif 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {getTypeServiceLabel(service.type_service)}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                        service.est_actif 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {getModaliteIcon(service.modalite)}
                        {getModaliteLabel(service.modalite)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {isOwner && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleToggleActive(service)}
                      className={`p-2 rounded-lg transition-colors ${
                        service.est_actif 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={service.est_actif ? 'Désactiver' : 'Activer'}
                    >
                      {service.est_actif ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => openEditModal(service)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(service)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Description */}
              {service.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>
              )}

              {/* Caractéristiques */}
              <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {service.duree_minutes} min
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-gray-400" />
                  {service.nombre_eleves_max} élève{service.nombre_eleves_max > 1 ? 's' : ''}
                </span>
                {service.tarif_horaire && service.tarif_horaire > 0 && (
                  <span className="flex items-center gap-1.5 text-green-600 font-medium">
                    <Tag className="w-4 h-4" />
                    {service.tarif_horaire.toLocaleString()} FC/h
                  </span>
                )}
                {service.tarif_forfaitaire && service.tarif_forfaitaire > 0 && (
                  <span className="flex items-center gap-1.5 text-orange-600 font-medium">
                    <Tag className="w-4 h-4" />
                    Forfait: {service.tarif_forfaitaire.toLocaleString()} FC
                  </span>
                )}
              </div>

              {/* Statut */}
              <div className="mt-3 pt-3 border-t flex items-center justify-between">
                <span className={`text-xs font-medium flex items-center gap-1.5 ${
                  service.est_actif ? 'text-green-600' : 'text-gray-400'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    service.est_actif ? 'bg-green-500' : 'bg-gray-300'
                  }`}></span>
                  {service.est_actif ? 'Actif' : 'Inactif'}
                </span>
                <span className="text-xs text-gray-400">
                  Créé le {new Date(service.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de création/modification */}
      <ServiceFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false)
          setEditingService(null)
        }}
        onSave={editingService ? handleUpdate : handleCreate}
        service={editingService}
        saving={saving}
      />

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeletingService(null)
        }}
        onConfirm={handleDelete}
        serviceTitle={deletingService?.titre || ''}
        deleting={deleting}
      />
    </div>
  )
}