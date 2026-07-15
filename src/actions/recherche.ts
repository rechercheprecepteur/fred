// actions/recherche.ts - MIGRÉ VERS EXPRESS
'use server'

import { serverFetch } from '@/lib/server-api'

// Types
export type CriteresRecherche = {
  matiere?: string
  commune?: string
  quartier?: string
  experienceMin?: number
  noteMin?: number
  disponible?: boolean
  tri?: 'note' | 'experience' | 'proximite'
  page?: number
  limit?: number
}

export type DemandeContractData = {
  precepteurId: number | string
  eleveId: number | string
  matiereId: number | string
  dateDebut: string
  dateFin: string
  heureDebutPref: string
  heureFinPref: string
  joursPref: string
  typeContrat: 'recurrent' | 'ponctuel'
  frequence: 'quotidien' | 'hebdomadaire' | 'bihebdomadaire' | 'mensuel' | 'ponctuel'
  tarifHoraire?: number
  notes?: string
}

// =============================================
// RECHERCHE PRÉCEPTEURS
// =============================================
export async function rechercherPrecepteurs(criteres: CriteresRecherche) {
  try {
    // Construire les query params
    const params = new URLSearchParams()
    if (criteres.matiere) params.append('matiere', criteres.matiere)
    if (criteres.commune) params.append('commune', criteres.commune)
    if (criteres.quartier) params.append('quartier', criteres.quartier)
    if (criteres.experienceMin) params.append('experienceMin', String(criteres.experienceMin))
    if (criteres.noteMin) params.append('noteMin', String(criteres.noteMin))
    if (criteres.disponible !== undefined) params.append('disponible', String(criteres.disponible))
    if (criteres.tri) params.append('tri', criteres.tri)
    if (criteres.page) params.append('page', String(criteres.page))
    if (criteres.limit) params.append('limit', String(criteres.limit))

    const result = await serverFetch(`/recherche/precepteurs?${params.toString()}`)
    
    return {
      precepteurs: result.precepteurs || [],
      total: result.total || 0,
      totalPages: result.totalPages || 0,
      page: result.page || 1
    }
  } catch (error: any) {
    console.error('❌ Erreur rechercherPrecepteurs:', error)
    return { precepteurs: [], total: 0, totalPages: 0, page: 1 }
  }
}

// =============================================
// RÉCUPÉRER LE PROFIL D'UN PRÉCEPTEUR
// =============================================
export async function getPrecepteurProfile(precepteurId: number | string) {
  try {
    const result = await serverFetch(`/recherche/precepteurs/${precepteurId}`)
    return result.precepteur || null
  } catch (error) {
    console.error('❌ Erreur getPrecepteurProfile:', error)
    return null
  }
}

// =============================================
// STATISTIQUES D'UN PRÉCEPTEUR
// =============================================
export async function getPrecepteurStats(precepteurId: number | string) {
  try {
    const result = await serverFetch(`/recherche/precepteurs/${precepteurId}/stats`)
    return result.stats || {
      totalContrats: 0,
      contratsActifs: 0,
      totalSessions: 0,
      sessionsTerminees: 0,
      moyenneNotes: '0.0',
      totalEvaluations: 0
    }
  } catch (error) {
    console.error('❌ Erreur getPrecepteurStats:', error)
    return {
      totalContrats: 0,
      contratsActifs: 0,
      totalSessions: 0,
      sessionsTerminees: 0,
      moyenneNotes: '0.0',
      totalEvaluations: 0
    }
  }
}

// =============================================
// RÉCUPÉRER LES MATIÈRES
// =============================================
export async function getMatieres() {
  try {
    const result = await serverFetch('/recherche/matieres')
    return result.matieres || []
  } catch (error) {
    console.error('❌ Erreur getMatieres:', error)
    return []
  }
}

// =============================================
// RÉCUPÉRER LES COMMUNES
// =============================================
export async function getCommunes() {
  try {
    const result = await serverFetch('/recherche/communes')
    return result.communes || []
  } catch (error) {
    console.error('❌ Erreur getCommunes:', error)
    return []
  }
}

// =============================================
// RÉCUPÉRER LES QUARTIERS
// =============================================
export async function getQuartiers() {
  try {
    const result = await serverFetch('/recherche/quartiers')
    return result.quartiers || []
  } catch (error) {
    console.error('❌ Erreur getQuartiers:', error)
    return []
  }
}

// =============================================
// DEMANDER UN CONTRAT
// =============================================
export async function demanderContract(data: DemandeContractData) {
  try {
    console.log('📝 Demande de contrat:', data)
    
    const result = await serverFetch('/recherche/contrats', {
      method: 'POST',
      body: JSON.stringify({
        precepteurId: String(data.precepteurId),
        eleveId: String(data.eleveId),
        matiereId: String(data.matiereId),
        dateDebut: data.dateDebut,
        dateFin: data.dateFin,
        heureDebutPref: data.heureDebutPref,
        heureFinPref: data.heureFinPref,
        joursPref: data.joursPref,
        typeContrat: data.typeContrat,
        frequence: data.frequence,
        tarifHoraire: data.tarifHoraire,
        notes: data.notes
      })
    })
    
    return { 
      success: true, 
      contract: result.contract,
      message: result.message 
    }
  } catch (error: any) {
    console.error('❌ Erreur demanderContract:', error)
    return { 
      success: false, 
      error: error.message || 'Une erreur est survenue' 
    }
  }
}