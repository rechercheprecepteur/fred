// actions/responsable.ts
'use server'

import { supabase } from '@/lib/supabase'


// Alternative si tu utilises la table sessions
async function verifyResponsableWithSessions(token: string): Promise<{ authorized: boolean; userId?: string; error?: string }> {
  if (!token) {
    return { authorized: false, error: 'Non authentifié' }
  }

  try {
    // Vérifier la session
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('user_id')
      .eq('token', token)
      .single()

    if (sessionError || !session) {
      return { authorized: false, error: 'Session expirée' }
    }

    // Vérifier le rôle
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user_id)
      .single()

    if (userError || !user) {
      return { authorized: false, error: 'Utilisateur non trouvé' }
    }

    if (user.role !== 'responsable_pedagogique') {
      return { authorized: false, error: 'Accès non autorisé' }
    }

    return { authorized: true, userId: session.user_id }
  } catch (err) {
    console.error('Erreur vérification responsable:', err)
    return { authorized: false, error: 'Erreur de vérification' }
  }
}

// ============ TYPES ============

export type PrecepteurAvecInfos = {
  id: number
  user_id: string
  commune: string | null
  quartier: string | null
  annees_experience: number
  diplome: string | null
  etablissement_origine: string | null
  statut_verification: 'en_attente' | 'verifie' | 'rejete'
  disponible: boolean
  note_moyenne: number
  created_at: string
  updated_at: string
  user: {
    username: string
    email: string
    telephone: string | null
    photo_profil: string | null
  } | null
  matieres: {
    matiere: {
      id: number
      nom: string
      niveau: string
    }
  }[]
  documents: {
    id: number
    titre: string
    type_document: string
    fichier_url: string
    format_fichier: string
    statut_verification: 'en_attente' | 'verifie' | 'rejete'
    created_at: string
  }[]
}

export type StatistiquesResponsable = {
  total_precepteurs: number
  en_attente: number
  verifies: number
  rejetes: number
  total_sessions: number
  total_eleves: number
  documents_en_attente: number
  total_matieres: number
  taux_validation: number
}

// ============ ACTIONS PRINCIPALES ============

export async function getPrecepteursForResponsable(token: string): Promise<{
  success?: boolean
  error?: string
  precepteurs?: PrecepteurAvecInfos[]
}> {
  const auth = await verifyResponsable(token)
  if (!auth.authorized) return { error: auth.error }

  try {
    // 1. Récupérer tous les précepteurs
    const { data: precepteursData, error: precepteursError } = await supabase
      .from('precepteurs')
      .select('*')
      .order('created_at', { ascending: false })

    if (precepteursError) {
      console.error('Erreur chargement précepteurs:', precepteursError)
      return { error: precepteursError.message }
    }

    if (!precepteursData || precepteursData.length === 0) {
      return { success: true, precepteurs: [] }
    }

    // 2. Pour chaque précepteur, récupérer les infos associées
    const precepteursAvecInfos = await Promise.all(
      precepteursData.map(async (precepteur) => {
        // Récupérer l'utilisateur
        const { data: userData } = await supabase
          .from('users')
          .select('username, email, telephone, photo_profil')
          .eq('id', precepteur.user_id)
          .single()

        // Récupérer les matières
        const { data: matieresData } = await supabase
          .from('precepteur_matieres')
          .select(`
            matiere:matieres (
              id,
              nom,
              niveau
            )
          `)
          .eq('precepteur_id', precepteur.id)

        // Récupérer les documents
        let documentsData: any[] = []
        try {
          const { data } = await supabase
            .from('documents')
            .select('*')
            .eq('precepteur_id', precepteur.id)
          documentsData = data || []
        } catch {
          // La table documents n'existe peut-être pas encore
        }

        return {
          ...precepteur,
          user: userData || null,
          matieres: matieresData || [],
          documents: documentsData || []
        }
      })
    )

    return { success: true, precepteurs: precepteursAvecInfos as PrecepteurAvecInfos[] }

  } catch (err) {
    console.error('Erreur inattendue:', err)
    return { error: 'Une erreur est survenue lors du chargement des données' }
  }
}

export async function getStatistiquesResponsable(token: string): Promise<{
  success?: boolean
  error?: string
  statistiques?: StatistiquesResponsable
}> {
  const auth = await verifyResponsable(token)
  if (!auth.authorized) return { error: auth.error }

  try {
    // Précepteurs
    const { data: precepteursData } = await supabase
      .from('precepteurs')
      .select('statut_verification')

    // Sessions
    const { count: sessionsCount } = await supabase
      .from('sessions_cours')
      .select('*', { count: 'exact', head: true })

    // Élèves
    const { count: elevesCount } = await supabase
      .from('eleves')
      .select('*', { count: 'exact', head: true })

    // Matières
    const { count: matieresCount } = await supabase
      .from('precepteur_matieres')
      .select('*', { count: 'exact', head: true })

    // Documents en attente
    let docsEnAttente = 0
    try {
      const { count } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('statut_verification', 'en_attente')
      docsEnAttente = count || 0
    } catch {
      // Table documents inexistante
    }

    const total = precepteursData?.length || 0
    const verifies = precepteursData?.filter(p => p.statut_verification === 'verifie').length || 0
    const tauxValidation = total > 0 ? Math.round((verifies / total) * 100) : 0

    return {
      success: true,
      statistiques: {
        total_precepteurs: total,
        en_attente: precepteursData?.filter(p => p.statut_verification === 'en_attente').length || 0,
        verifies: verifies,
        rejetes: precepteursData?.filter(p => p.statut_verification === 'rejete').length || 0,
        total_sessions: sessionsCount || 0,
        total_eleves: elevesCount || 0,
        documents_en_attente: docsEnAttente,
        total_matieres: matieresCount || 0,
        taux_validation: tauxValidation
      }
    }

  } catch (err) {
    console.error('Erreur chargement statistiques:', err)
    return { error: 'Erreur lors du chargement des statistiques' }
  }
}

export async function verifyPrecepteur(token: string, id: number): Promise<{ success?: boolean; error?: string }> {
  const auth = await verifyResponsable(token)
  if (!auth.authorized) return { error: auth.error }

  const { error } = await supabase
    .from('precepteurs')
    .update({ 
      statut_verification: 'verifie',
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) return { error: error.message }
  return { success: true }
}

export async function rejectPrecepteur(token: string, id: number): Promise<{ success?: boolean; error?: string }> {
  const auth = await verifyResponsable(token)
  if (!auth.authorized) return { error: auth.error }

  const { error } = await supabase
    .from('precepteurs')
    .update({ 
      statut_verification: 'rejete',
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) return { error: error.message }
  return { success: true }
}

export async function verifyDocument(token: string, docId: number): Promise<{ success?: boolean; error?: string }> {
  const auth = await verifyResponsable(token)
  if (!auth.authorized) return { error: auth.error }

  const { error } = await supabase
    .from('documents')
    .update({ 
      statut_verification: 'verifie',
      updated_at: new Date().toISOString()
    })
    .eq('id', docId)

  if (error) return { error: error.message }
  return { success: true }
}

export async function rejectDocument(token: string, docId: number): Promise<{ success?: boolean; error?: string }> {
  const auth = await verifyResponsable(token)
  if (!auth.authorized) return { error: auth.error }

  const { error } = await supabase
    .from('documents')
    .update({ 
      statut_verification: 'rejete',
      updated_at: new Date().toISOString()
    })
    .eq('id', docId)

  if (error) return { error: error.message }
  return { success: true }
}



// ✅ Fonction de vérification CORRIGÉE
async function verifyResponsable(token: string): Promise<{ authorized: boolean; userId?: string; error?: string }> {
  if (!token) {
    return { authorized: false, error: 'Non authentifié' }
  }

  try {
    // 🔴 VÉRIFIER : Chercher d'abord dans la table sessions
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('user_id')
      .eq('token', token)
      .single()

    if (!sessionError && session) {
      // Session trouvée, vérifier le rôle
      const { data: user } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user_id)
        .single()

      if (user && user.role === 'responsable_pedagogique') {
        return { authorized: true, userId: session.user_id }
      }
    }

    // 🔴 Si pas trouvé dans sessions, chercher dans users.auth_token
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, role')
      .eq('auth_token', token)
      .single()

    if (userError || !user) {
      console.log('Token non trouvé:', token.substring(0, 20) + '...')
      return { authorized: false, error: 'Session expirée' }
    }

    if (user.role !== 'responsable_pedagogique') {
      return { authorized: false, error: 'Accès non autorisé' }
    }

    return { authorized: true, userId: user.id }
  } catch (err) {
    console.error('Erreur vérification responsable:', err)
    return { authorized: false, error: 'Erreur de vérification' }
  }
}