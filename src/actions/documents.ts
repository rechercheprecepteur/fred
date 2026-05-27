// actions/documents.ts
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

async function getPrecepteurId(): Promise<number | null> {
  const userId = await getCurrentUserId()
  if (!userId) return null

  const { data: precepteur, error } = await supabase
    .from('precepteurs')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (error || !precepteur) return null
  return precepteur.id
}

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

export async function uploadDocument(formData: FormData) {
  try {
    const precepteurId = await getPrecepteurId()
    if (!precepteurId) {
      return { error: 'Non authentifié ou précepteur non trouvé' }
    }

    const file = formData.get('fichier') as File
    const titre = formData.get('titre') as string
    const type_document = formData.get('type_document') as string

    if (!file || !titre || !type_document) {
      return { error: 'Tous les champs sont requis' }
    }

    // Validation taille (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return { error: 'Le fichier est trop volumineux. Maximum : 10MB' }
    }

    // Validation type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return { error: 'Type de fichier non accepté' }
    }

    const extension = file.name.split('.').pop()
    const cleanName = sanitizeFileName(titre)
    const fileName = `${precepteurId}/${cleanName}.${extension}`

    // Vérifier doublon
    const { data: existingFiles } = await supabase.storage
      .from('documents')
      .list(`${precepteurId}`)

    if (existingFiles?.some(f => f.name === `${cleanName}.${extension}`)) {
      return { error: 'Un document avec ce titre existe déjà' }
    }

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file, { 
        upsert: false,
        cacheControl: '3600'
      })

    if (uploadError) {
      return { error: 'Erreur lors de l\'upload' }
    }

    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName)

    const { error: dbError } = await supabase
      .from('documents')
      .insert({
        precepteur_id: precepteurId,
        titre,
        type_document,
        fichier_url: urlData.publicUrl,
        format_fichier: file.type,
        statut_verification: 'en_attente'
      })

    if (dbError) {
      await supabase.storage.from('documents').remove([fileName])
      return { error: 'Erreur lors de la sauvegarde' }
    }

    return { success: true, url: urlData.publicUrl }
    
  } catch (error) {
    console.error('Erreur uploadDocument:', error)
    return { error: 'Une erreur est survenue' }
  }
}

export async function getDocuments() {
  try {
    const precepteurId = await getPrecepteurId()
    if (!precepteurId) {
      return { documents: [], error: null }
    }

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('precepteur_id', precepteurId)
      .order('created_at', { ascending: false })

    if (error) {
      return { documents: [], error: 'Erreur lors de la récupération' }
    }

    return { documents: data || [], success: true }
    
  } catch (error) {
    console.error('Erreur getDocuments:', error)
    return { documents: [], error: 'Erreur serveur' }
  }
}

export async function deleteDocument(documentId: number) {
  try {
    const precepteurId = await getPrecepteurId()
    if (!precepteurId) {
      return { error: 'Non authentifié' }
    }

    // Vérifier propriété
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .select('id, fichier_url, precepteur_id')
      .eq('id', documentId)
      .single()

    if (docError || !doc) {
      return { error: 'Document non trouvé' }
    }

    if (doc.precepteur_id !== precepteurId) {
      return { error: 'Non autorisé' }
    }

    // Supprimer du stockage
    if (doc.fichier_url) {
      try {
        const url = new URL(doc.fichier_url)
        const pathParts = url.pathname.split('/')
        const docsIndex = pathParts.findIndex(part => part === 'documents')
        const filePath = pathParts.slice(docsIndex + 1).join('/')
        
        await supabase.storage.from('documents').remove([filePath])
      } catch (urlError) {
        console.error('Erreur parsing URL:', urlError)
      }
    }

    // Supprimer de la DB
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId)

    if (deleteError) {
      return { error: 'Erreur lors de la suppression' }
    }

    return { success: true }
    
  } catch (error) {
    console.error('Erreur deleteDocument:', error)
    return { error: 'Erreur lors de la suppression' }
  }
}


// ✅ AJOUTER à la fin du fichier actions/documents.ts

// Récupérer les documents d'un précepteur par son ID (pour l'admin)
export async function getDocumentsByPrecepteurId(precepteurId: number) {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('precepteur_id', precepteurId)
      .order('created_at', { ascending: false })

    if (error) {
      return { documents: [], error: error.message }
    }

    return { documents: data || [], error: null }
    
  } catch (error) {
    console.error('Erreur getDocumentsByPrecepteurId:', error)
    return { documents: [], error: 'Erreur serveur' }
  }
}

// Mettre à jour le statut d'un document (pour l'admin)
export async function updateDocumentStatus(
  documentId: number,
  statut: 'verifie' | 'rejete',
  commentaire?: string
) {
  try {
    const { error } = await supabase
      .from('documents')
      .update({
        statut_verification: statut,
        commentaire_verification: commentaire || null
      })
      .eq('id', documentId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
    
  } catch (error) {
    console.error('Erreur updateDocumentStatus:', error)
    return { success: false, error: 'Erreur serveur' }
  }
}

// Récupérer les documents par user_id (si la table utilise aussi user_id)
export async function getDocumentsByUserId(userId: string) {
  try {
    // D'abord trouver le precepteur_id à partir du user_id
    const { data: precepteur, error: precepteurError } = await supabase
      .from('precepteurs')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (precepteurError || !precepteur) {
      return { documents: [], error: 'Précepteur non trouvé' }
    }

    // Ensuite récupérer les documents
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('precepteur_id', precepteur.id)
      .order('created_at', { ascending: false })

    if (error) {
      return { documents: [], error: error.message }
    }

    return { documents: data || [], error: null }
    
  } catch (error) {
    console.error('Erreur getDocumentsByUserId:', error)
    return { documents: [], error: 'Erreur serveur' }
  }
}