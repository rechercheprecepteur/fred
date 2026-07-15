// actions/matieres.ts
'use server'

import { serverFetch } from '@/lib/server-api'

/**
 * Récupérer toutes les matières
 */
export async function getMatieres(search?: string) {
  try {
    let endpoint = '/auth/matieres'
    if (search) {
      endpoint += `?search=${encodeURIComponent(search)}`
    }
    
    const data = await serverFetch(endpoint)
    return { matieres: data.matieres || [] }
  } catch (error: any) {
    console.error('❌ Erreur getMatieres:', error)
    return { matieres: [], error: error.message }
  }
}

/**
 * Ajouter une matière
 */
export async function ajouterMatiere(formData: {
  nom: string
  niveau: string
  description?: string
}) {
  try {
    const data = await serverFetch('/auth/matieres', {
      method: 'POST',
      body: JSON.stringify(formData)
    })
    return { success: true, matiere: data.matiere }
  } catch (error: any) {
    console.error('❌ Erreur ajouterMatiere:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Modifier une matière
 */
export async function modifierMatiere(id: number, formData: {
  nom: string
  niveau: string
  description?: string
}) {
  try {
    await serverFetch(`/auth/matieres/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formData)
    })
    return { success: true }
  } catch (error: any) {
    console.error('❌ Erreur modifierMatiere:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Supprimer une matière
 */
export async function supprimerMatiere(id: number) {
  try {
    await serverFetch(`/auth/matieres/${id}`, {
      method: 'DELETE'
    })
    return { success: true }
  } catch (error: any) {
    console.error('❌ Erreur supprimerMatiere:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Récupérer les matières du précepteur connecté
 */
export async function getPrecepteurMatieres() {
  try {
    const data = await serverFetch('/auth/precepteur/matieres')
    return { success: true, matieres: data.matieres || [] }
  } catch (error: any) {
    console.error('Erreur getPrecepteurMatieres:', error)
    return { success: false, matieres: [], error: error.message }
  }
}