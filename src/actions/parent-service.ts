// // actions/parent-service.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type ServiceParent = {
  userId: string  // ✅ Ajouter l'ID utilisateur
  eleve_id: number
  titre: string
  description: string
  matiere_preferee?: string
  niveau_eleve: string
  frequence_souhaitee: string
  jours_preferences?: string
  heures_preferences?: string
  budget_horaire?: number
  lieu_preference: string
}

export async function creerService(data: ServiceParent) {
  const supabase = await createClient()
  
  // ✅ Utiliser directement l'ID utilisateur passé depuis le client
  const userId = data.userId
  
  if (!userId) {
    console.error('Pas d\'ID utilisateur fourni')
    return { error: 'Non authentifié. Veuillez vous reconnecter.' }
  }

  // Récupérer le parent_id
  const { data: parent, error: parentError } = await supabase
    .from('parents')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (parentError || !parent) {
    console.error('Erreur parent:', parentError)
    return { error: 'Profil parent non trouvé. Êtes-vous bien inscrit comme parent ?' }
  }

  // Définir la date d'expiration (30 jours par défaut)
  const dateExpiration = new Date()
  dateExpiration.setDate(dateExpiration.getDate() + 30)

  const { error: insertError } = await supabase
    .from('services_parent')
    .insert({
      parent_id: parent.id,
      eleve_id: data.eleve_id,
      titre: data.titre,
      description: data.description,
      matiere_preferee: data.matiere_preferee || null,
      niveau_eleve: data.niveau_eleve,
      frequence_souhaitee: data.frequence_souhaitee,
      jours_preferences: data.jours_preferences || null,
      heures_preferences: data.heures_preferences || null,
      budget_horaire: data.budget_horaire || null,
      lieu_preference: data.lieu_preference,
      statut: 'actif',
      date_expiration: dateExpiration.toISOString()
    })

  if (insertError) {
    console.error('Erreur insertion:', insertError)
    return { error: insertError.message }
  }

  revalidatePath('/dashboard/parent')
  return { success: true, message: 'Service créé avec succès' }
}

export async function getServicesParent(userId?: string) {
  const supabase = await createClient()
  
  // Si userId est fourni, l'utiliser directement
  if (!userId) {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { services: [], error: 'Non authentifié' }
    userId = user.id
  }

  // Récupérer le parent_id
  const { data: parent } = await supabase
    .from('parents')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!parent) return { services: [], error: 'Parent non trouvé' }

  const { data: services, error } = await supabase
    .from('services_parent')
    .select(`
      *,
      eleve:eleves(nom, prenom, niveau)
    `)
    .eq('parent_id', parent.id)
    .order('date_creation', { ascending: false })

  if (error) {
    console.error('Erreur getServicesParent:', error)
    return { services: [], error: error.message }
  }

  return { services, success: true }
}

export async function supprimerService(serviceId: number, userId?: string) {
  const supabase = await createClient()
  
  if (!userId) {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Non authentifié' }
    userId = user.id
  }

  // Vérifier que le service appartient bien au parent
  const { data: parent } = await supabase
    .from('parents')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!parent) return { error: 'Parent non trouvé' }

  const { error } = await supabase
    .from('services_parent')
    .delete()
    .eq('id', serviceId)
    .eq('parent_id', parent.id)

  if (error) {
    console.error('Erreur suppression:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/parent')
  return { success: true, message: 'Service supprimé avec succès' }
}

export async function updateServiceStatus(serviceId: number, statut: string, userId?: string) {
  const supabase = await createClient()
  
  if (!userId) {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Non authentifié' }
    userId = user.id
  }

  const { data: parent } = await supabase
    .from('parents')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!parent) return { error: 'Parent non trouvé' }

  const { error } = await supabase
    .from('services_parent')
    .update({ statut })
    .eq('id', serviceId)
    .eq('parent_id', parent.id)

  if (error) {
    console.error('Erreur mise à jour statut:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/parent')
  return { success: true }
}


// actions/parent-service.ts (suite)

// ========== FONCTIONS POUR PRÉCEPTEURS ==========

export async function getServicesDisponibles(filtres?: {
  matiere?: string
  niveau?: string
  frequence?: string
  lieu?: string
  budget_min?: number
  budget_max?: number
}) {
  const supabase = await createClient()
  
  let query = supabase
    .from('services_parent')
    .select(`
      *,
      parent:parents(
        id,
        user:users(
          username,
          photo_profil
        )
      ),
      eleve:eleves(
        nom,
        prenom,
        niveau
      )
    `)
    .eq('statut', 'actif')
    .order('date_creation', { ascending: false })

  if (filtres?.matiere) {
    query = query.eq('matiere_preferee', filtres.matiere)
  }
  if (filtres?.niveau) {
    query = query.eq('niveau_eleve', filtres.niveau)
  }
  if (filtres?.frequence) {
    query = query.eq('frequence_souhaitee', filtres.frequence)
  }
  if (filtres?.lieu) {
    query = query.eq('lieu_preference', filtres.lieu)
  }
  if (filtres?.budget_min) {
    query = query.gte('budget_horaire', filtres.budget_min)
  }
  if (filtres?.budget_max) {
    query = query.lte('budget_horaire', filtres.budget_max)
  }

  const { data: services, error } = await query

  if (error) {
    console.error('Erreur getServicesDisponibles:', error)
    return { services: [], error: error.message }
  }

  return { services, success: true }
}

export async function getServiceById(serviceId: number) {
  const supabase = await createClient()
  
  // Incrémenter les vues avec une requête brute
  const { error: updateError } = await supabase.rpc('increment_vues', { 
    service_id: serviceId 
  })

  if (updateError) {
    console.error('Erreur incrémentation vues:', updateError)
    // On continue même si l'incrémentation échoue
  }
  
  const { data: service, error } = await supabase
    .from('services_parent')
    .select(`
      *,
      parent:parents(
        id,
        user:users(
          id,
          username,
          email,
          photo_profil
        ),
        telephone,
        adresse
      ),
      eleve:eleves(
        id,
        nom,
        prenom,
        niveau,
        ecole
      )
    `)
    .eq('id', serviceId)
    .single()

  if (error) {
    console.error('Erreur getServiceById:', error)
    return { service: null, error: error.message }
  }

  return { service, success: true }
}

export async function postulerService(serviceId: number, message: string, userId: string) {
  const supabase = await createClient()
  
  // ✅ Utiliser l'ID utilisateur passé depuis le client
  if (!userId) {
    return { error: 'Non authentifié. Veuillez vous reconnecter.' }
  }

  // Vérifier que c'est un précepteur
  const { data: precepteur, error: precepteurError } = await supabase
    .from('precepteurs')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (precepteurError || !precepteur) {
    console.error('Erreur précepteur:', precepteurError)
    return { error: 'Vous devez être inscrit comme précepteur pour postuler' }
  }

  // Vérifier si déjà postulé
  const { data: existing } = await supabase
    .from('candidatures_services')
    .select('id')
    .eq('service_id', serviceId)
    .eq('precepteur_id', precepteur.id)
    .single()

  if (existing) {
    return { error: 'Vous avez déjà postulé à cette sollicitation' }
  }

  // Insérer la candidature
  const { error: insertError } = await supabase
    .from('candidatures_services')
    .insert({
      service_id: serviceId,
      precepteur_id: precepteur.id,
      message,
      statut: 'en_attente'
    })

  if (insertError) {
    console.error('Erreur insertion candidature:', insertError)
    return { error: insertError.message }
  }

  // Incrémenter le compteur de candidatures avec RPC
  const { error: updateError } = await supabase.rpc('increment_candidatures', { 
    service_id: serviceId 
  })

  if (updateError) {
    console.error('Erreur mise à jour compteur:', updateError)
    // On continue même si l'incrémentation échoue
  }

  revalidatePath('/precepteur/services')
  return { success: true, message: 'Candidature envoyée avec succès !' }
}

export async function getMesCandidatures(userId: string) {
  const supabase = await createClient()
  
  // ✅ Utiliser l'ID utilisateur passé depuis le client
  if (!userId) {
    return { candidatures: [], error: 'Non authentifié' }
  }

  const { data: precepteur } = await supabase
    .from('precepteurs')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!precepteur) return { candidatures: [], error: 'Précepteur non trouvé' }

  const { data: candidatures, error } = await supabase
    .from('candidatures_services')
    .select(`
      *,
      service:services_parent(
        id,
        titre,
        description,
        matiere_preferee,
        niveau_eleve,
        frequence_souhaitee,
        budget_horaire,
        lieu_preference,
        statut,
        eleve:eleves(nom, prenom)
      )
    `)
    .eq('precepteur_id', precepteur.id)
    .order('date_candidature', { ascending: false })

  if (error) {
    console.error('Erreur getMesCandidatures:', error)
    return { candidatures: [], error: error.message }
  }

  return { candidatures, success: true }
}