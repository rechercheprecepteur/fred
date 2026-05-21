// // actions/eleves.ts
// 'use server'

// import { supabase } from '@/lib/supabase'
// import { cookies } from 'next/headers'
// import jwt from 'jsonwebtoken'

// const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-tres-long-et-complexe'
// const COOKIE_NAME = 'auth-token'

// async function getCurrentUserId(): Promise<string | null> {
//   const cookieStore = await cookies()
//   const token = cookieStore.get(COOKIE_NAME)?.value
//   if (!token) return null

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
//     return decoded.userId
//   } catch {
//     return null
//   }
// }

// export async function ajouterEnfant(formData: {
//   nom: string
//   postnom: string
//   prenom: string
//   genre: string
//   date_naissance: string
//   niveau: string
//   ecole: string
// }) {
//   try {
//     const userId = await getCurrentUserId()
//     if (!userId) return { error: 'Non authentifié' }

//     // Vérifier que le niveau est valide
//     if (!['7ème', '8ème'].includes(formData.niveau)) {
//       return { error: 'Niveau invalide. Uniquement 7ème et 8ème année sont acceptés.' }
//     }

//     // Get or create parent
//     let { data: existingParent, error: fetchError } = await supabase
//       .from('parents')
//       .select('id')
//       .eq('user_id', userId)
//       .single()

//     if (fetchError && fetchError.code !== 'PGRST116') {
//       console.error('Error fetching parent:', fetchError)
//       return { error: 'Erreur lors de la vérification du profil parent' }
//     }

//     let parentId: number

//     if (existingParent) {
//       parentId = existingParent.id
//     } else {
//       // Create new parent profile
//       const { data: newParent, error: createError } = await supabase
//         .from('parents')
//         .insert([{ 
//           user_id: userId
//         }])
//         .select('id')
//         .single()

//       if (createError || !newParent) {
//         console.error('Error creating parent:', createError)
//         return { error: `Erreur création profil parent: ${createError?.message || 'Unknown error'}` }
//       }

//       parentId = newParent.id
//     }

//     // Add the student
//     const { data: newEleve, error: insertError } = await supabase
//       .from('eleves')
//       .insert([{
//         parent_id: parentId,
//         nom: formData.nom,
//         postnom: formData.postnom,
//         prenom: formData.prenom,
//         genre: formData.genre,
//         date_naissance: formData.date_naissance || null,
//         niveau: formData.niveau,
//         ecole: formData.ecole
//       }])
//       .select('id')
//       .single()

//     if (insertError) {
//       console.error('Error inserting student:', insertError)
//       return { error: `Erreur lors de l'ajout de l'enfant: ${insertError.message}` }
//     }

//     return { success: true, eleveId: newEleve?.id }
//   } catch (error) {
//     console.error('Unexpected error in ajouterEnfant:', error)
//     return { error: 'Une erreur inattendue est survenue' }
//   }
// }

// export async function supprimerEnfant(eleveId: number) {
//   try {
//     const userId = await getCurrentUserId()
//     if (!userId) return { error: 'Non authentifié' }

//     // Verify the child belongs to the connected parent
//     const { data: parent } = await supabase
//       .from('parents')
//       .select('id')
//       .eq('user_id', userId)
//       .single()

//     if (!parent) return { error: 'Parent non trouvé' }

//     // Vérifier que l'enfant existe et appartient bien au parent
//     const { data: eleve } = await supabase
//       .from('eleves')
//       .select('id, nom, prenom')
//       .eq('id', eleveId)
//       .eq('parent_id', parent.id)
//       .single()

//     if (!eleve) {
//       return { error: 'Enfant non trouvé ou non autorisé' }
//     }

//     // Supprimer d'abord les sessions liées aux contrats de cet enfant
//     const { data: contrats } = await supabase
//       .from('contracts')
//       .select('id')
//       .eq('eleve_id', eleveId)

//     if (contrats && contrats.length > 0) {
//       const contratIds = contrats.map(c => c.id)
      
//       // Supprimer les sessions
//       await supabase
//         .from('sessions_cours')
//         .delete()
//         .in('contract_id', contratIds)

//       // Supprimer les contrats
//       await supabase
//         .from('contracts')
//         .delete()
//         .eq('eleve_id', eleveId)
//     }

//     // Supprimer l'enfant
//     const { error } = await supabase
//       .from('eleves')
//       .delete()
//       .eq('id', eleveId)
//       .eq('parent_id', parent.id)

//     if (error) {
//       console.error('Error deleting eleve:', error)
//       return { error: 'Erreur lors de la suppression' }
//     }

//     return { success: true }
//   } catch (error) {
//     console.error('Error in supprimerEnfant:', error)
//     return { error: 'Une erreur est survenue lors de la suppression' }
//   }
// }

// export async function getElevesParent() {
//   try {
//     const userId = await getCurrentUserId()
//     if (!userId) return { error: 'Non authentifié', eleves: [] }

//     const { data: parent } = await supabase
//       .from('parents')
//       .select('id')
//       .eq('user_id', userId)
//       .single()

//     if (!parent) return { eleves: [] }

//     const { data: eleves, error } = await supabase
//       .from('eleves')
//       .select('*')
//       .eq('parent_id', parent.id)
//       .order('niveau')

//     if (error) {
//       console.error('Error fetching eleves:', error)
//       return { eleves: [] }
//     }

//     return { eleves: eleves || [] }
//   } catch (error) {
//     console.error('Error in getElevesParent:', error)
//     return { eleves: [] }
//   }
// }
// actions/eleves.ts
'use server'

import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-tres-long-et-complexe'
const COOKIE_NAME = 'auth-token'

// 🆕 Cache pour éviter de décoder le JWT à chaque appel
let cachedUserId: { id: string; timestamp: number } | null = null
const CACHE_DURATION = 2000

async function getCurrentUserId(): Promise<string | null> {
  // 🆕 Utiliser le cache si frais
  if (cachedUserId && (Date.now() - cachedUserId.timestamp) < CACHE_DURATION) {
    return cachedUserId.id
  }

  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
    
    // 🆕 Mettre en cache
    cachedUserId = { id: decoded.userId, timestamp: Date.now() }
    
    return decoded.userId
  } catch {
    return null
  }
}

// 🆕 Fonction utilitaire pour obtenir le parent_id
async function getParentId(userId: string): Promise<number | null> {
  const { data: parent } = await supabase
    .from('parents')
    .select('id')
    .eq('user_id', userId)
    .single()

  return parent?.id || null
}

// 🆕 Fonction pour obtenir ou créer un parent
async function getOrCreateParent(userId: string): Promise<number> {
  let parentId = await getParentId(userId)
  
  if (!parentId) {
    const { data: newParent } = await supabase
      .from('parents')
      .insert([{ user_id: userId }])
      .select('id')
      .single()
    
    if (newParent) {
      parentId = newParent.id
    }
  }
  
  return parentId!
}

export async function ajouterEnfant(formData: {
  nom: string
  postnom: string
  prenom: string
  genre: string
  date_naissance: string
  niveau: string
  ecole: string
}) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) return { error: 'Non authentifié' }

    if (!['7ème', '8ème'].includes(formData.niveau)) {
      return { error: 'Niveau invalide. Uniquement 7ème et 8ème année sont acceptés.' }
    }

    const parentId = await getOrCreateParent(userId)

    const { data: newEleve, error: insertError } = await supabase
      .from('eleves')
      .insert([{
        parent_id: parentId,
        nom: formData.nom,
        postnom: formData.postnom,
        prenom: formData.prenom,
        genre: formData.genre,
        date_naissance: formData.date_naissance || null,
        niveau: formData.niveau,
        ecole: formData.ecole
      }])
      .select('id')
      .single()

    if (insertError) {
      console.error('Error inserting student:', insertError)
      return { error: `Erreur lors de l'ajout de l'enfant: ${insertError.message}` }
    }

    return { success: true, eleveId: newEleve?.id }
  } catch (error) {
    console.error('Unexpected error in ajouterEnfant:', error)
    return { error: 'Une erreur inattendue est survenue' }
  }
}

// supprimerEnfant et getElevesParent - GARDER LE CODE EXISTANT, juste utiliser getParentId
export async function supprimerEnfant(eleveId: number) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) return { error: 'Non authentifié' }

    const parentId = await getParentId(userId)
    if (!parentId) return { error: 'Parent non trouvé' }

    const { data: eleve } = await supabase
      .from('eleves')
      .select('id, nom, prenom')
      .eq('id', eleveId)
      .eq('parent_id', parentId)
      .single()

    if (!eleve) {
      return { error: 'Enfant non trouvé ou non autorisé' }
    }

    const { data: contrats } = await supabase
      .from('contracts')
      .select('id')
      .eq('eleve_id', eleveId)

    if (contrats && contrats.length > 0) {
      const contratIds = contrats.map(c => c.id)
      await supabase.from('sessions_cours').delete().in('contract_id', contratIds)
      await supabase.from('contracts').delete().eq('eleve_id', eleveId)
    }

    const { error } = await supabase
      .from('eleves')
      .delete()
      .eq('id', eleveId)
      .eq('parent_id', parentId)

    if (error) {
      console.error('Error deleting eleve:', error)
      return { error: 'Erreur lors de la suppression' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in supprimerEnfant:', error)
    return { error: 'Une erreur est survenue lors de la suppression' }
  }
}

export async function getElevesParent() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) return { error: 'Non authentifié', eleves: [] }

    const parentId = await getParentId(userId)
    if (!parentId) return { eleves: [] }

    const { data: eleves, error } = await supabase
      .from('eleves')
      .select('*')
      .eq('parent_id', parentId)
      .order('niveau')

    if (error) {
      console.error('Error fetching eleves:', error)
      return { eleves: [] }
    }

    return { eleves: eleves || [] }
  } catch (error) {
    console.error('Error in getElevesParent:', error)
    return { eleves: [] }
  }
}