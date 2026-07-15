
// actions/parent-service.ts - MIGRÉ VERS EXPRESS
'use server'

import { serverFetch } from '@/lib/server-api'

type ServiceData = {
  eleve_id: string
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

export async function creerService(data: ServiceData) {
  try {
    const result = await serverFetch('/parent-services', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    
    return { 
      success: true, 
      service: result.service,
      message: result.message 
    }
  } catch (error: any) {
    console.error('❌ Erreur creerService:', error)
    return { error: error.message || 'Erreur lors de la création du service' }
  }
}

// actions/parent-service.ts - CORRIGÉ
export async function getServicesParent() {
  try {
    const result = await serverFetch('/parent-services')
    console.log('📦 Résultat brut API:', result)
    
    // CORRECTION: Normaliser les noms de colonnes (snake_case -> camelCase)
    const services = (result.services || []).map((service: any) => ({
      id: service.id,
      parent_id: service.parent_id,
      eleve_id: service.eleve_id,
      titre: service.titre,
      description: service.description,
      matiere_preferee: service.matiere_preferee || service.matierePreferee,
      niveau_eleve: service.niveau_eleve || service.niveauEleve,
      frequence_souhaitee: service.frequence_souhaitee || service.frequenceSouhaitee,
      jours_preferences: service.jours_preferences || service.joursPreferences,
      heures_preferences: service.heures_preferences || service.heuresPreferences,
      budget_horaire: service.budget_horaire || service.budgetHoraire,
      lieu_preference: service.lieu_preference || service.lieuPreference,
      statut: service.statut,
      nombre_vues: service.nombre_vues || service.nombreVues || 0,
      nombre_candidatures: service.nombre_candidatures || service.nombreCandidatures || 0,
      date_creation: service.date_creation || service.dateCreation,
      date_expiration: service.date_expiration || service.dateExpiration,
      eleve: service.eleve ? {
        nom: service.eleve.nom,
        prenom: service.eleve.prenom,
        niveau: service.eleve.niveau
      } : null
    }))
    
    console.log('📦 Services normalisés:', services)
    return { services }
  } catch (error: any) {
    console.error('❌ Erreur getServicesParent:', error)
    return { services: [] }
  }
}

export async function supprimerService(serviceId: number) {
  try {
    await serverFetch(`/parent-services/${serviceId}`, {
      method: 'DELETE'
    })
    
    return { success: true }
  } catch (error: any) {
    console.error('❌ Erreur supprimerService:', error)
    return { error: error.message || 'Erreur lors de la suppression' }
  }
}

export async function updateServiceStatus(serviceId: number, statut: string) {
  try {
    await serverFetch(`/parent-services/${serviceId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ statut })
    })
    
    return { success: true }
  } catch (error: any) {
    console.error('❌ Erreur updateServiceStatus:', error)
    return { error: error.message || 'Erreur lors de la mise à jour' }
  }
}

// actions/parent-service.ts
export async function getAllParentServices() {
  try {
    console.log('========================================');
    console.log('📡 [DEBUG FRONTEND] Appel API /parent-services/all');
    console.log('========================================');
    
    const result = await serverFetch('/parent-services/all')
    
    console.log('📦 [DEBUG FRONTEND] Réponse reçue:');
    console.log('  - success:', result.success);
    console.log('  - services.length:', result.services?.length || 0);
    
    if (result.services && result.services.length > 0) {
      console.log('📋 [DEBUG FRONTEND] Premier service:');
      console.log(JSON.stringify(result.services[0], null, 2));
    } else {
      console.log('⚠️ [DEBUG FRONTEND] Aucun service dans la réponse !');
      console.log('  - Réponse complète:', JSON.stringify(result, null, 2));
    }
    
    console.log('========================================');
    
    return { services: result.services || [] }
  } catch (error: any) {
    console.error('========================================');
    console.error('❌ [DEBUG FRONTEND] Erreur getAllParentServices:');
    console.error('  - Message:', error.message);
    console.error('  - Stack:', error.stack);
    console.error('========================================');
    return { services: [] }
  }
}
// Rechercher/filtrer les services parents
export async function searchParentServices(filters: {
  matiere?: string
  niveau?: string
  lieu?: string
  budget_min?: string
  budget_max?: string
  search?: string
}) {
  try {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    
    const result = await serverFetch(`/parent-services/search?${params.toString()}`)
    return { services: result.services || [], total: result.total }
  } catch (error: any) {
    console.error('❌ Erreur searchParentServices:', error)
    return { services: [] }
  }
}


