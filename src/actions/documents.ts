// actions/documents.ts
'use server'

import { serverFetch, serverUpload } from '@/lib/server-api'

/**
 * Uploader un document
 */
export async function uploadDocument(formData: FormData) {
  try {
    console.log('📤 Upload document...')
    
    const data = await serverUpload('/auth/precepteur/documents', formData)
    
    return { 
      success: true, 
      document: data.document,
      url: data.url 
    }
  } catch (error: any) {
    console.error('❌ Erreur uploadDocument:', error)
    return { 
      success: false, 
      error: error.message || 'Erreur lors de l\'upload' 
    }
  }
}

/**
 * Récupérer les documents de l'utilisateur connecté
 */
export async function getDocuments() {
  try {
    const data = await serverFetch('/auth/precepteur/documents')
    return { 
      documents: data.documents || [], 
      success: true 
    }
  } catch (error: any) {
    console.error('❌ Erreur getDocuments:', error)
    return { 
      documents: [], 
      error: error.message || 'Erreur lors de la récupération' 
    }
  }
}

/**
 * Supprimer un document
 */
export async function deleteDocument(documentId: number) {
  try {
    await serverFetch(`/auth/precepteur/documents/${documentId}`, {
      method: 'DELETE'
    })
    return { success: true }
  } catch (error: any) {
    console.error('❌ Erreur deleteDocument:', error)
    return { 
      success: false, 
      error: error.message || 'Erreur lors de la suppression' 
    }
  }
}

/**
 * Récupérer les documents d'un précepteur par son user_id (pour admin)
 */
export async function getDocumentsByUserId(userId: string) {
  try {
    const data = await serverFetch(`/auth/admin/documents/${userId}`)
    return { 
      documents: data.documents || [], 
      error: null 
    }
  } catch (error: any) {
    console.error('❌ Erreur getDocumentsByUserId:', error)
    return { 
      documents: [], 
      error: error.message 
    }
  }
}

/**
 * Mettre à jour le statut d'un document (pour admin)
 */
export async function updateDocumentStatus(
  documentId: number,
  statut: 'verifie' | 'rejete',
  commentaire?: string
) {
  try {
    await serverFetch(`/auth/admin/documents/${documentId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ statut, commentaire })
    })
    return { success: true, error: null }
  } catch (error: any) {
    console.error('❌ Erreur updateDocumentStatus:', error)
    return { 
      success: false, 
      error: error.message 
    }
  }
}