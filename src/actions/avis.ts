// actions/avis.ts
'use server'

import { serverFetch } from '@/lib/server-api'

export type RatingData = {
  id: string
  contract_id: string
  precepteur_id: string
  parent_id: string
  note: number
  commentaire: string | null
  created_at: string
  updated_at: string
  parent: {
    id: string
    user: {
      username: string
      photo_profil: string | null
    } | null
  } | null
  contract: {
    id: string
    matiere: {
      nom: string
      niveau: string
    } | null
    eleve: {
      prenom: string
      nom: string
      niveau: string
    } | null
  } | null
}

export type AvisStats = {
  moyenne: number
  total: number
  repartition: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

export async function getPrecepteurAvis(precepteurId: string): Promise<{
  success: boolean
  ratings: RatingData[]
  stats: AvisStats
  error?: string
}> {
  try {
    const result = await serverFetch(`/avis/precepteur/${precepteurId}`)
    
    return {
      success: true,
      ratings: result.ratings || [],
      stats: result.stats || {
        moyenne: 0,
        total: 0,
        repartition: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      }
    }
  } catch (error: any) {
    console.error('❌ Erreur getPrecepteurAvis:', error)
    return {
      success: false,
      error: error.message || 'Erreur lors du chargement des avis',
      ratings: [],
      stats: {
        moyenne: 0,
        total: 0,
        repartition: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      }
    }
  }
}

export async function ajouterAvis(data: {
  precepteur_id: string
  contract_id: string
  note: number
  commentaire?: string
}) {
  try {
    const result = await serverFetch('/avis', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    
    return { success: true, message: result.message }
  } catch (error: any) {
    console.error('❌ Erreur ajouterAvis:', error)
    return { success: false, error: error.message || 'Erreur lors de l\'ajout de l\'avis' }
  }
}