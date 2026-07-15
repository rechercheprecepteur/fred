// actions/admin.ts
'use server'

import { serverFetch } from '@/lib/server-api'

/**
 * Récupérer tous les utilisateurs (admin)
 */
export async function getAllUsers() {
  try {
    const data = await serverFetch('/auth/admin/users')
    return {
      success: true,
      users: data.users
    }
  } catch (error: any) {
    console.error('❌ Erreur getAllUsers:', error)
    return {
      success: false,
      error: error.message || 'Erreur lors du chargement des utilisateurs'
    }
  }
}

/**
 * Mettre à jour le rôle d'un utilisateur
 */
export async function updateUserRole(userId: string, newRole: string) {
  try {
    await serverFetch(`/auth/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role: newRole })
    })
    return { success: true }
  } catch (error: any) {
    console.error('❌ Erreur updateUserRole:', error)
    return {
      success: false,
      error: error.message || 'Erreur lors de la mise à jour du rôle'
    }
  }
}

/**
 * Supprimer un utilisateur
 */
export async function deleteUser(userId: string) {
  try {
    await serverFetch(`/auth/admin/users/${userId}`, {
      method: 'DELETE'
    })
    return { success: true }
  } catch (error: any) {
    console.error('❌ Erreur deleteUser:', error)
    return {
      success: false,
      error: error.message || 'Erreur lors de la suppression'
    }
  }
}

/**
 * Vérifier l'email d'un utilisateur (admin)
 */
export async function adminVerifyUserEmail(userId: string) {
  try {
    await serverFetch(`/auth/admin/users/${userId}/verify-email`, {
      method: 'POST'
    })
    return { success: true }
  } catch (error: any) {
    console.error('❌ Erreur adminVerifyUserEmail:', error)
    return {
      success: false,
      error: error.message || 'Erreur lors de la vérification'
    }
  }
}

// actions/admin.ts - Ajouter ces fonctions

/**
 * Récupérer tous les précepteurs pour la vérification
 */
export async function getPrecepteursForVerification() {
  try {
    const data = await serverFetch('/auth/admin/precepteurs/verification')
    return {
      success: true,
      precepteurs: data.precepteurs,
      stats: data.stats
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Erreur de chargement'
    }
  }
}

/**
 * Mettre à jour le statut de vérification d'un précepteur
 */
export async function updatePrecepteurVerificationStatus(
  precepteurId: number,
  statut: 'verifie' | 'rejete',
  commentaire?: string
) {
  try {
    await serverFetch(`/auth/admin/precepteurs/${precepteurId}/verification`, {
      method: 'PUT',
      body: JSON.stringify({ statut, commentaire })
    })
    return { success: true }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Erreur lors de la mise à jour'
    }
  }
}