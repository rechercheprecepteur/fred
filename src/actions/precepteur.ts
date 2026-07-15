
// // actions/precepteur.ts
// 'use server'

// import { api } from '@/lib/api'

// export async function updatePrecepteurProfil(
//   formData: {
//     latitude: string
//     longitude: string
//     commune: string
//     quartier: string
//     annees_experience: number
//     diplome: string
//     etablissement_origine: string
//     telephone: string
//     matieres: number[]
//   }
// ): Promise<{ success?: boolean; error?: string }> {
//   try {
//     const data = await api.put('/auth/precepteur/profile', formData)
//     return { success: true }
//   } catch (error: any) {
//     return { error: error.message || 'Erreur lors de la mise à jour du profil' }
//   }
// }

// export async function getPrecepteurMatieres() {
//   try {
//     const data = await api.get('/auth/precepteur/matieres')
//     return { success: true, matieres: data.matieres }
//   } catch (error: any) {
//     return { error: error.message }
//   }
// }

// export async function getContrats() {
//   try {
//     const data = await api.get('/auth/precepteur/contrats')
//     return { success: true, contrats: data.contrats }
//   } catch (error: any) {
//     return { error: error.message }
//   }
// }

// export async function updateContratStatus(contractId: number, status: string) {
//   try {
//     const data = await api.put(`/auth/precepteur/contrats/${contractId}/status`, { status })
//     return { success: true }
//   } catch (error: any) {
//     return { error: error.message }
//   }
// }

// export async function createSession(sessionData: {
//   contract_id: number
//   date_session: string
//   heure_debut: string
//   heure_fin: string
//   type_session: string
//   lieu?: string
//   lien_visio?: string
//   notes?: string
// }) {
//   try {
//     const data = await api.post('/auth/precepteur/sessions', sessionData)
//     return { success: true, session: data.session }
//   } catch (error: any) {
//     return { error: error.message }
//   }
// }

// export async function updateSessionStatus(sessionId: number, status: string) {
//   try {
//     const data = await api.put(`/auth/precepteur/sessions/${sessionId}/status`, { status })
//     return { success: true }
//   } catch (error: any) {
//     return { error: error.message }
//   }
// }

// export async function updateSessionNotes(sessionId: number, notes: string) {
//   try {
//     const data = await api.put(`/auth/precepteur/sessions/${sessionId}/notes`, { notes })
//     return { success: true }
//   } catch (error: any) {
//     return { error: error.message }
//   }
// }

// actions/precepteur.ts
'use server'

import { serverFetch } from '@/lib/server-api'

/**
 * Mettre à jour le profil précepteur
 */
export async function updatePrecepteurProfil(data: {
  latitude?: string
  longitude?: string
  commune?: string
  quartier?: string
  annees_experience?: number
  diplome?: string
  etablissement_origine?: string
  telephone?: string
  matieres?: number[]
}) {
  try {
    console.log('📤 updatePrecepteurProfil - Données:', data)
    
    const result = await serverFetch('/auth/precepteur/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
    
    console.log('📥 updatePrecepteurProfil - Réponse:', result)
    
    return { success: true, precepteur: result.precepteur }
  } catch (error: any) {
    console.error('❌ Erreur updatePrecepteurProfil:', error)
    return { success: false, error: error.message || 'Erreur lors de la mise à jour' }
  }
}

/**
 * Récupérer les matières disponibles
 */
export async function getPrecepteurMatieres() {
  try {
    const result = await serverFetch('/auth/precepteur/matieres')
    return { success: true, matieres: result.matieres || [] }
  } catch (error: any) {
    console.error('❌ Erreur getPrecepteurMatieres:', error)
    return { success: false, matieres: [], error: error.message }
  }
}

/**
 * Récupérer les contrats du précepteur
 */
export async function getContrats() {
  try {
    const result = await serverFetch('/auth/precepteur/contrats')
    return { success: true, contrats: result.contrats || [] }
  } catch (error: any) {
    console.error('❌ Erreur getContrats:', error)
    return { success: false, contrats: [], error: error.message }
  }
}

/**
 * Mettre à jour le statut d'un contrat
 */
export async function updateContratStatus(contratId: number, status: string) {
  try {
    await serverFetch(`/auth/precepteur/contrats/${contratId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
    return { success: true }
  } catch (error: any) {
    console.error('❌ Erreur updateContratStatus:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Mettre à jour le statut d'une session
 */
export async function updateSessionStatus(sessionId: number, status: string) {
  try {
    await serverFetch(`/auth/precepteur/sessions/${sessionId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    })
    return { success: true }
  } catch (error: any) {
    console.error('❌ Erreur updateSessionStatus:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Mettre à jour les notes d'une session
 */
export async function updateSessionNotes(sessionId: number, notes: string) {
  try {
    await serverFetch(`/auth/precepteur/sessions/${sessionId}/notes`, {
      method: 'PUT',
      body: JSON.stringify({ notes })
    })
    return { success: true }
  } catch (error: any) {
    console.error('❌ Erreur updateSessionNotes:', error)
    return { success: false, error: error.message }
  }
}