// actions/services.ts
'use server'

import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-tres-long-et-complexe'

async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  
  if (!token) return null
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
    return decoded.userId
  } catch {
    return null
  }
}

export type ServicePrecepteur = {
  id: number
  precepteur_id: number
  titre: string
  description: string | null
  type_service: 'cours_particulier' | 'aide_devoirs' | 'preparation_examens' | 'soutien_scolaire' | 'autre'
  modalite: 'presentiel' | 'en_ligne' | 'hybride'
  tarif_horaire: number | null
  tarif_forfaitaire: number | null
  duree_minutes: number
  nombre_eleves_max: number
  est_actif: boolean
  created_at: string
  updated_at: string
}

export async function createService(data: {
  titre: string
  description?: string
  type_service: string
  modalite: string
  tarif_horaire?: number
  tarif_forfaitaire?: number
  duree_minutes?: number
  nombre_eleves_max?: number
}): Promise<{ success?: boolean; error?: string; service?: ServicePrecepteur }> {
  const userId = await getCurrentUserId()
  if (!userId) return { error: 'Non authentifié' }

  try {
    // Récupérer l'ID du précepteur
    const { data: precepteur } = await supabase
      .from('precepteurs')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!precepteur) return { error: 'Profil précepteur non trouvé' }

    const { data: newService, error } = await supabase
      .from('services_precepteur')
      .insert([{
        precepteur_id: precepteur.id,
        titre: data.titre,
        description: data.description || null,
        type_service: data.type_service,
        modalite: data.modalite,
        tarif_horaire: data.tarif_horaire || null,
        tarif_forfaitaire: data.tarif_forfaitaire || null,
        duree_minutes: data.duree_minutes || 60,
        nombre_eleves_max: data.nombre_eleves_max || 1,
        est_actif: true
      }])
      .select()
      .single()

    if (error) {
      console.error('Erreur création service:', error)
      return { error: 'Erreur lors de la création du service' }
    }

    return { success: true, service: newService }
  } catch (error) {
    console.error('Exception createService:', error)
    return { error: 'Erreur serveur' }
  }
}

export async function getServicesPrecepteur(precepteurId?: number) {
  try {
    let query = supabase
      .from('services_precepteur')
      .select(`
        *,
        precepteur:precepteurs(
          user:users(
            id, username, photo_profil
          ),
          diplome,
          annees_experience,
          commune,
          quartier,
          note_moyenne
        )
      `)
      .eq('est_actif', true)
      .order('created_at', { ascending: false })

    if (precepteurId) {
      query = query.eq('precepteur_id', precepteurId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Erreur récupération services:', error)
      return { error: 'Erreur lors de la récupération des services' }
    }

    return { services: data }
  } catch (error) {
    console.error('Exception getServicesPrecepteur:', error)
    return { error: 'Erreur serveur' }
  }
}

export async function updateService(serviceId: number, data: Partial<ServicePrecepteur>) {
  const userId = await getCurrentUserId()
  if (!userId) return { error: 'Non authentifié' }

  try {
    const { data: precepteur } = await supabase
      .from('precepteurs')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!precepteur) return { error: 'Profil précepteur non trouvé' }

    const { error } = await supabase
      .from('services_precepteur')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', serviceId)
      .eq('precepteur_id', precepteur.id)

    if (error) {
      console.error('Erreur mise à jour service:', error)
      return { error: 'Erreur lors de la mise à jour du service' }
    }

    return { success: true }
  } catch (error) {
    console.error('Exception updateService:', error)
    return { error: 'Erreur serveur' }
  }
}

export async function deleteService(serviceId: number) {
  const userId = await getCurrentUserId()
  if (!userId) return { error: 'Non authentifié' }

  try {
    const { data: precepteur } = await supabase
      .from('precepteurs')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!precepteur) return { error: 'Profil précepteur non trouvé' }

    const { error } = await supabase
      .from('services_precepteur')
      .delete()
      .eq('id', serviceId)
      .eq('precepteur_id', precepteur.id)

    if (error) {
      console.error('Erreur suppression service:', error)
      return { error: 'Erreur lors de la suppression du service' }
    }

    return { success: true }
  } catch (error) {
    console.error('Exception deleteService:', error)
    return { error: 'Erreur serveur' }
  }
}