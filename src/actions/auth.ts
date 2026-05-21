

// actions/auth.ts
'use server'

import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { AuthResult } from '@/types'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { sendEmail } from '@/lib/email'
import { getVerificationEmail, getPasswordResetEmail } from '@/lib/emailTemplates'
import crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-tres-long-et-complexe'
const COOKIE_NAME = 'auth-token'
















// ============ 🆕 CACHE AVANCÉ ============
// Cache global avec Map pour supporter plusieurs utilisateurs
const userCacheMap = new Map<string, { user: any; timestamp: number }>()
const CACHE_DURATION = 30000 // 30 secondes (ajustable)
const pendingRequests = new Map<string, Promise<any>>() // Déduplication

// 🆕 Fonction légère pour obtenir juste l'ID utilisateur (optimisée)
async function getUserIdFromToken(): Promise<string | null> {
  const token = await getTokenFromCookie()
  if (!token) return null
  
  const decoded = verifyToken(token)
  return decoded?.userId || null
}

// ============ 🔧 getCurrentUser OPTIMISÉ ============
export async function getCurrentUser(forceRefresh = false): Promise<AuthResult> {
  try {
    const token = await getTokenFromCookie()
    if (!token) {
      return { error: 'Non authentifié' }
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      await removeAuthCookie()
      userCacheMap.delete(token) // Nettoyer le cache
      return { error: 'Session expirée' }
    }

    const userId = decoded.userId

    // Vérifier le cache (si pas forceRefresh)
    if (!forceRefresh) {
      const cached = userCacheMap.get(userId)
      if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        return { success: true, user: cached.user }
      }
    }

    // Déduplication : si une requête est déjà en cours, attendre son résultat
    const pendingKey = `user-${userId}`
    if (pendingRequests.has(pendingKey)) {
      return await pendingRequests.get(pendingKey)!
    }

    // Créer la promesse de requête
    const requestPromise = (async () => {
      try {
        const { data: user, error } = await supabase
          .from('users')
          .select('id, username, email, role, genre, photo_profil, created_at, updated_at')
          .eq('id', userId)
          .single()

        if (error || !user) {
          await removeAuthCookie()
          userCacheMap.delete(userId)
          return { error: 'Utilisateur non trouvé' }
        }

        // Rafraîchir le token (une seule fois par période de cache)
        const newToken = generateToken(user.id, user.role)
        await setAuthCookie(newToken)

        // Mettre en cache
        userCacheMap.set(userId, { user, timestamp: Date.now() })

        return { success: true, user }
      } finally {
        // Nettoyer la requête en attente
        pendingRequests.delete(pendingKey)
      }
    })()

    // Stocker la promesse pour déduplication
    pendingRequests.set(pendingKey, requestPromise)
    
    return await requestPromise

  } catch (error) {
    console.error('Exception getCurrentUser:', error)
    return { error: 'Erreur serveur' }
  }
}

// 🆕 Fonction utilitaire exportée
export async function getCurrentUserId(): Promise<string | null> {
  return await getUserIdFromToken()
}
export async function invalidateUserCache(userId?: string) {
  if (userId) {
    userCacheMap.delete(userId)
  } else {
    userCacheMap.clear()
  }
}







export async function changePassword(oldPassword: string, newPassword: string): Promise<AuthResult> {
  try {
    const session = await getCurrentUser()
    if (!session.success || !session.user) {
      return { error: 'Non authentifié' }
    }

    // Récupérer le mot de passe actuel
    const { data: user } = await supabase
      .from('users')
      .select('password')
      .eq('id', session.user.id)
      .single()

    if (!user) {
      return { error: 'Utilisateur non trouvé' }
    }

    // Vérifier l'ancien mot de passe
    const isValid = await bcrypt.compare(oldPassword, user.password)
    if (!isValid) {
      return { error: 'Ancien mot de passe incorrect' }
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    const { error } = await supabase
      .from('users')
      .update({ 
        password: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', session.user.id)

    if (error) return { error: 'Erreur lors du changement de mot de passe' }

    return { success: true }

  } catch (error) {
    console.error('Exception changePassword:', error)
    return { error: 'Erreur serveur' }
  }
}

// // ============ ACTIONS ADMIN ============

async function checkAdminAccess(): Promise<AuthResult> {
  const session = await getCurrentUser()
  if (!session.success || !session.user) {
    return { error: 'Non authentifié' }
  }

  if (session.user.role !== 'admin' && session.user.role !== 'responsable_pedagogique') {
    return { error: 'Accès non autorisé' }
  }

  return { success: true, user: session.user }
}



export async function updateUserRole(userId: string, newRole: string): Promise<AuthResult> {
  try {
    const access = await checkAdminAccess()
    if (access.error) return { error: access.error }

    if (access.user?.id === userId) {
      return { error: 'Vous ne pouvez pas modifier votre propre rôle' }
    }

    const { error } = await supabase
      .from('users')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (error) return { error: 'Erreur lors de la mise à jour du rôle' }

    return { success: true }

  } catch (error) {
    console.error('Exception updateUserRole:', error)
    return { error: 'Erreur serveur' }
  }
}

export async function deleteUser(userId: string): Promise<AuthResult> {
  try {
    const access = await checkAdminAccess()
    if (access.error) return { error: access.error }

    if (access.user?.id === userId) {
      return { error: 'Vous ne pouvez pas supprimer votre propre compte' }
    }

    await supabase.from('precepteur_matieres').delete().eq('precepteur_id', userId)
    await supabase.from('precepteurs').delete().eq('user_id', userId)

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) return { error: 'Erreur lors de la suppression' }

    return { success: true }

  } catch (error) {
    console.error('Exception deleteUser:', error)
    return { error: 'Erreur serveur' }
  }
}

export async function getStats(): Promise<{
  success?: boolean
  error?: string
  stats?: any
}> {
  try {
    const access = await checkAdminAccess()
    if (access.error) return { error: access.error }

    const { data: usersByRole, error: roleError } = await supabase
      .from('users')
      .select('role')

    if (roleError) return { error: 'Erreur lors de la récupération des stats' }

    const { count: totalPrecepteurs } = await supabase
      .from('precepteurs')
      .select('*', { count: 'exact', head: true })

    const { count: precepteursDisponibles } = await supabase
      .from('precepteurs')
      .select('*', { count: 'exact', head: true })
      .eq('disponible', true)

    const stats = {
      total: usersByRole.length,
      parents: usersByRole.filter(u => u.role === 'parent').length,
      precepteurs: usersByRole.filter(u => u.role === 'precepteur').length,
      responsables: usersByRole.filter(u => u.role === 'responsable_pedagogique').length,
      admins: usersByRole.filter(u => u.role === 'admin').length,
      precepteurs_actifs: totalPrecepteurs || 0,
      precepteurs_disponibles: precepteursDisponibles || 0,
    }

    return { success: true, stats }

  } catch (error) {
    console.error('Exception getStats:', error)
    return { error: 'Erreur serveur' }
  }
}

export async function createUser(formData: {
  email: string
  password: string
  username: string
  role: string
  genre: string
}): Promise<AuthResult> {
  try {
    // Vérifier l'accès admin
    const access = await checkAdminAccess()
    if (access.error) return { error: access.error }

    // Vérifier si l'email ou le username existe déjà
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${formData.email},username.eq.${formData.username}`)
      .single()

    if (existingUser) {
      return { error: 'Cet email ou nom d\'utilisateur existe déjà' }
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(formData.password, 10)

    // Créer l'utilisateur
    const { data: user, error } = await supabase
      .from('users')
      .insert([{
        username: formData.username,
        email: formData.email,
        password: hashedPassword,
        role: formData.role,
        genre: formData.genre,
        photo_profil: null
      }])
      .select()
      .single()

    if (error) {
      console.error('Erreur création utilisateur:', error)
      return { error: 'Erreur lors de la création du compte' }
    }

    // Si c'est un précepteur, créer l'entrée dans la table precepteurs
    if (formData.role === 'precepteur') {
      const { error: precepteurError } = await supabase
        .from('precepteurs')
        .insert([{
          user_id: user.id,
          disponible: true
        }])

      if (precepteurError) {
        console.error('Erreur création précepteur:', precepteurError)
        // On ne bloque pas, l'utilisateur a été créé
      }
    }

    // Si c'est un parent, créer l'entrée dans la table parents
    if (formData.role === 'parent') {
      const { error: parentError } = await supabase
        .from('parents')
        .insert([{
          user_id: user.id
        }])

      if (parentError) {
        console.error('Erreur création parent:', parentError)
        // On ne bloque pas
      }
    }

    return { success: true, user }

  } catch (error) {
    console.error('Exception createUser:', error)
    return { error: 'Erreur serveur lors de la création du compte' }
  }
}

export async function verifyPrecepteur(precepteurId: number, statut: 'verifie' | 'rejete'): Promise<AuthResult> {
  try {
    const access = await checkAdminAccess()
    if (access.error) return { error: access.error }

    const { error } = await supabase
      .from('precepteurs')
      .update({ 
        statut_verification: statut,
        updated_at: new Date().toISOString()
      })
      .eq('id', precepteurId)

    if (error) return { error: 'Erreur lors de la mise à jour du statut' }

    return { success: true }

  } catch (error) {
    console.error('Exception verifyPrecepteur:', error)
    return { error: 'Erreur serveur' }
  }
}

export async function getPrecepteursEnAttente(): Promise<{
  success?: boolean
  error?: string
  precepteurs?: any[]
}> {
  try {
    const access = await checkAdminAccess()
    if (access.error) return { error: access.error }

    const { data: precepteurs, error } = await supabase
      .from('precepteurs')
      .select(`
        id,
        user_id,
        commune,
        quartier,
        annees_experience,
        diplome,
        etablissement_origine,
        statut_verification,
        disponible,
        note_moyenne,
        created_at,
        user:users!inner(id, username, email, genre, photo_profil)
      `)
      .eq('statut_verification', 'en_attente')
      .order('created_at', { ascending: false })

    if (error) return { error: 'Erreur lors de la récupération' }

    return { success: true, precepteurs }

  } catch (error) {
    console.error('Exception getPrecepteursEnAttente:', error)
    return { error: 'Erreur serveur' }
  }
}

export async function getAllPrecepteurs(): Promise<{
  success?: boolean
  error?: string
  precepteurs?: any[]
}> {
  try {
    const access = await checkAdminAccess()
    if (access.error) return { error: access.error }

    const { data: precepteurs, error } = await supabase
      .from('precepteurs')
      .select(`
        id,
        user_id,
        commune,
        quartier,
        annees_experience,
        diplome,
        etablissement_origine,
        statut_verification,
        disponible,
        note_moyenne,
        created_at,
        user:users!inner(id, username, email, genre, photo_profil)
      `)
      .order('created_at', { ascending: false })

    if (error) return { error: 'Erreur lors de la récupération' }

    return { success: true, precepteurs }

  } catch (error) {
    console.error('Exception getAllPrecepteurs:', error)
    return { error: 'Erreur serveur' }
  }
}





























// ============ GESTION DES COOKIES (INCHANGÉ) ============

async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })
}

async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

async function getTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value || null
}

// ============ JWT HELPERS (INCHANGÉ) ============

function generateToken(userId: string, role: string): string {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
  } catch {
    return null
  }
}

// // ============ 🆕 NOUVEAU: Cache utilisateur ============
// // Ce cache est réinitialisé à chaque requête (comportement normal des Server Actions)
let userCache: { user: any; timestamp: number } | null = null
// const CACHE_DURATION = 2000 // 2 secondes

// // 🆕 Fonction légère pour obtenir juste l'ID utilisateur
// async function getUserIdFromToken(): Promise<string | null> {
//   const token = await getTokenFromCookie()
//   if (!token) return null
  
//   const decoded = verifyToken(token)
//   return decoded?.userId || null
// }

// ============ ACTIONS PRINCIPALES (login, register, logout INCHANGÉS) ============

// export async function login(email: string, password: string): Promise<AuthResult> {
//   try {
//     const { data: user, error } = await supabase
//       .from('users')
//       .select('*')
//       .eq('email', email)
//       .single()

//     if (error || !user) {
//       return { error: 'Email ou mot de passe incorrect' }
//     }

//     const isValid = await bcrypt.compare(password, user.password)
//     if (!isValid) {
//       return { error: 'Email ou mot de passe incorrect' }
//     }

//     const token = generateToken(user.id, user.role)
//     await setAuthCookie(token)
    
//     // Invalider le cache après connexion
//     userCache = null

//     const { password: _, ...userWithoutPassword } = user
    
//     return { 
//       success: true, 
//       user: userWithoutPassword
//     }

//   } catch (error) {
//     console.error('Exception login:', error)
//     return { error: 'Erreur serveur lors de la connexion' }
//   }
// }

// export async function register(formData: {
//   email: string
//   password: string
//   username: string
//   role: string
//   genre: string
// }): Promise<AuthResult> {
//   try {
//     const { data: existingUser } = await supabase
//       .from('users')
//       .select('id')
//       .or(`email.eq.${formData.email},username.eq.${formData.username}`)
//       .single()

//     if (existingUser) {
//       return { error: 'Cet email ou nom d\'utilisateur existe déjà' }
//     }

//     const hashedPassword = await bcrypt.hash(formData.password, 10)

//     const { data: user, error } = await supabase
//       .from('users')
//       .insert([{
//         username: formData.username,
//         email: formData.email,
//         password: hashedPassword,
//         role: formData.role,
//         genre: formData.genre,
//         photo_profil: null
//       }])
//       .select()
//       .single()

//     if (error) {
//       return { error: 'Erreur lors de la création du compte' }
//     }

//     if (formData.role === 'precepteur') {
//       await supabase
//         .from('precepteurs')
//         .insert([{
//           user_id: user.id,
//           disponible: true
//         }])
//     }
    
//     // 🆕 Créer aussi le parent si nécessaire
//     if (formData.role === 'parent') {
//       await supabase
//         .from('parents')
//         .insert([{ user_id: user.id }])
//     }

//     return { success: true }

//   } catch (error) {
//     console.error('Exception register:', error)
//     return { error: 'Erreur serveur lors de l\'inscription' }
//   }
// }

export async function logout(): Promise<void> {
  userCache = null // 🆕 Vider le cache
  await removeAuthCookie()
}

// ============ 🔧 CORRECTION PRINCIPALE: getCurrentUser optimisé ============

// export async function getCurrentUser(): Promise<AuthResult> {
//   try {
//     // 🆕 Utiliser le cache si disponible et frais
//     if (userCache && (Date.now() - userCache.timestamp) < CACHE_DURATION) {
//       return { success: true, user: userCache.user }
//     }

//     const token = await getTokenFromCookie()
//     if (!token) {
//       return { error: 'Non authentifié' }
//     }

//     const decoded = verifyToken(token)
//     if (!decoded) {
//       await removeAuthCookie()
//       return { error: 'Session expirée' }
//     }

//     // 🆕 Ne rafraîchir le token qu'une seule fois par période de cache
//     const { data: user, error } = await supabase
//       .from('users')
//       .select('id, username, email, role, genre, photo_profil, created_at, updated_at')
//       .eq('id', decoded.userId)
//       .single()

//     if (error || !user) {
//       await removeAuthCookie()
//       return { error: 'Utilisateur non trouvé' }
//     }

//     // 🆕 Rafraîchir le token
//     const newToken = generateToken(user.id, user.role)
//     await setAuthCookie(newToken)

//     // 🆕 Mettre en cache
//     userCache = { user, timestamp: Date.now() }

//     return { 
//       success: true, 
//       user
//     }

//   } catch (error) {
//     console.error('Exception getCurrentUser:', error)
//     return { error: 'Erreur serveur' }
//   }
// }

// // ============ 🆕 Fonction utilitaire exportée ============
// export async function getCurrentUserId(): Promise<string | null> {
//   return await getUserIdFromToken()
// }

// ============ GESTION DU PROFIL (CORRIGÉ) ============

export async function updateProfilePhoto(photoBase64: string): Promise<AuthResult> {
  try {
    // 🆕 Utiliser getUserIdFromToken au lieu de getCurrentUser
    const userId = await getUserIdFromToken()
    if (!userId) {
      return { error: 'Non authentifié' }
    }

    const { error } = await supabase
      .from('users')
      .update({ 
        photo_profil: photoBase64,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) return { error: 'Erreur lors de la mise à jour de la photo' }

    // 🆕 Invalider le cache pour forcer un rechargement
    userCache = null

    return { success: true }

  } catch (error) {
    console.error('Exception updateProfilePhoto:', error)
    return { error: 'Erreur serveur' }
  }
}

export async function updateProfile(data: {
  username?: string
  email?: string
  genre?: string
}): Promise<AuthResult> {
  try {
    const userId = await getUserIdFromToken()
    if (!userId) {
      return { error: 'Non authentifié' }
    }

    const updates: any = {
      ...data,
      updated_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)

    if (error) {
      if (error.code === '23505') {
        return { error: 'Cet email ou nom d\'utilisateur existe déjà' }
      }
      return { error: 'Erreur lors de la mise à jour du profil' }
    }

    userCache = null // Invalider le cache

    return { success: true }

  } catch (error) {
    console.error('Exception updateProfile:', error)
    return { error: 'Erreur serveur' }
  }
}

// changePassword - déjà OK, pas de modification nécessaire

// ============ GESTION PRÉCEPTEUR (CORRIGÉ) ============

export async function updatePrecepteurDisponibility(disponible: boolean): Promise<AuthResult> {
  try {
    const userId = await getUserIdFromToken()
    if (!userId) {
      return { error: 'Non authentifié' }
    }

    const { error } = await supabase
      .from('precepteurs')
      .update({ disponible })
      .eq('user_id', userId)

    if (error) return { error: 'Erreur lors de la mise à jour' }

    return { success: true }

  } catch (error) {
    console.error('Exception updatePrecepteurDisponibility:', error)
    return { error: 'Erreur serveur' }
  }
}

export async function getPrecepteurInfo(userId?: string): Promise<{
  success?: boolean
  error?: string
  precepteurInfo?: any
}> {
  try {
    const currentUserId = await getUserIdFromToken()
    if (!currentUserId) {
      return { error: 'Non authentifié' }
    }

    const targetUserId = userId || currentUserId

    const { data: precepteur, error: precepteurError } = await supabase
      .from('precepteurs')
      .select('*')
      .eq('user_id', targetUserId)
      .single()

    if (precepteurError) {
      if (precepteurError.code === 'PGRST116') {
        return { success: true, precepteurInfo: null }
      }
      return { error: 'Erreur lors de la récupération des informations précepteur' }
    }

    const { data: matiereIds } = await supabase
      .from('precepteur_matieres')
      .select('matiere_id')
      .eq('precepteur_id', precepteur.id)

    if (!matiereIds || matiereIds.length === 0) {
      return { success: true, precepteurInfo: { ...precepteur, precepteur_matieres: [] } }
    }

    const ids = matiereIds.map(m => m.matiere_id)
    const { data: matieres } = await supabase
      .from('matieres')
      .select('id, nom, niveau')
      .in('id', ids)

    const precepteurMatieres = matiereIds.map(mi => ({
      matiere_id: mi.matiere_id,
      matiere: matieres?.find(m => m.id === mi.matiere_id) || null
    }))

    return { 
      success: true, 
      precepteurInfo: { ...precepteur, precepteur_matieres: precepteurMatieres }
    }

  } catch (error) {
    console.error('Exception getPrecepteurInfo:', error)
    return { error: 'Erreur serveur' }
  }
}

// ============ ACTIONS ADMIN (CORRIGÉ) ============



// getAllUsers, updateUserRole, deleteUser, getStats - INCHANGÉS

// ============ 🆕 GESTION PROFIL PARENT (CORRIGÉ) ============

export async function updateParentProfile(data: {
  telephone?: string
  adresse?: string
}): Promise<AuthResult> {
  try {
    const userId = await getUserIdFromToken()
    if (!userId) {
      return { error: 'Non authentifié' }
    }

    // Récupérer le parent_id
    const { data: parent } = await supabase
      .from('parents')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!parent) {
      // 🆕 Créer le parent s'il n'existe pas au lieu de renvoyer une erreur
      const { error: createError } = await supabase
        .from('parents')
        .insert([{ 
          user_id: userId,
          ...data
        }])
      
      if (createError) {
        return { error: 'Erreur lors de la création du profil parent' }
      }
      
      return { success: true }
    }

    const { error } = await supabase
      .from('parents')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', parent.id)

    if (error) return { error: 'Erreur lors de la mise à jour du profil' }

    return { success: true }

  } catch (error) {
    console.error('Exception updateParentProfile:', error)
    return { error: 'Erreur serveur' }
  }
}

export async function getParentProfile(): Promise<{
  success?: boolean
  error?: string
  parent?: any
}> {
  try {
    const userId = await getUserIdFromToken()
    if (!userId) {
      return { error: 'Non authentifié' }
    }

    const { data: parent } = await supabase
      .from('parents')
      .select('*')
      .eq('user_id', userId)
      .single()

    return { success: true, parent }

  } catch (error) {
    console.error('Exception getParentProfile:', error)
    return { error: 'Erreur serveur' }
  }
}




// // Générer un token aléatoire
// function generateRandomToken(): string {
//   return crypto.randomBytes(32).toString('hex')
// }

// // ============ VÉRIFICATION D'EMAIL ============

// export async function sendVerificationEmail(userId: string): Promise<AuthResult> {
//   try {
//     // Récupérer l'utilisateur
//     const { data: user, error } = await supabase
//       .from('users')
//       .select('id, email, username, email_verified')
//       .eq('id', userId)
//       .single()

//     if (error || !user) {
//       return { error: 'Utilisateur non trouvé' }
//     }

//     if (user.email_verified) {
//       return { error: 'Email déjà vérifié' }
//     }

//     // Générer un token
//     const token = generateRandomToken()
//     const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 heures

//     // Sauvegarder le token
//     const { error: updateError } = await supabase
//       .from('users')
//       .update({
//         verification_token: token,
//         verification_token_expires: expiresAt.toISOString()
//       })
//       .eq('id', userId)

//     if (updateError) {
//       return { error: 'Erreur lors de la génération du token' }
//     }

//     // Envoyer l'email
//     const emailHtml = getVerificationEmail(user.username, token)
//     const emailResult = await sendEmail(user.email, 'Vérification de votre adresse email', emailHtml)

//     if (!emailResult.success) {
//       return { error: 'Erreur lors de l\'envoi de l\'email de vérification' }
//     }

//     return { success: true }

//   } catch (error) {
//     console.error('Exception sendVerificationEmail:', error)
//     return { error: 'Erreur serveur' }
//   }
// }

// export async function verifyEmail(token: string): Promise<AuthResult> {
//   try {
//     // Trouver l'utilisateur avec ce token
//     const { data: user, error } = await supabase
//       .from('users')
//       .select('id, verification_token, verification_token_expires, email_verified')
//       .eq('verification_token', token)
//       .single()

//     if (error || !user) {
//       return { error: 'Token de vérification invalide' }
//     }

//     // Vérifier si l'email est déjà vérifié
//     if (user.email_verified) {
//       return { error: 'Email déjà vérifié' }
//     }

//     // Vérifier si le token a expiré
//     if (user.verification_token_expires && new Date(user.verification_token_expires) < new Date()) {
//       return { error: 'Le lien de vérification a expiré. Veuillez demander un nouveau lien.' }
//     }

//     // Marquer l'email comme vérifié et supprimer le token
//     const { error: updateError } = await supabase
//       .from('users')
//       .update({
//         email_verified: true,
//         verification_token: null,
//         verification_token_expires: null,
//         updated_at: new Date().toISOString()
//       })
//       .eq('id', user.id)

//     if (updateError) {
//       return { error: 'Erreur lors de la vérification de l\'email' }
//     }

//     return { success: true }

//   } catch (error) {
//     console.error('Exception verifyEmail:', error)
//     return { error: 'Erreur serveur' }
//   }
// }

// Modifier la fonction register pour envoyer l'email de vérification
export async function register(formData: {
  email: string
  password: string
  username: string
  role: string
  genre: string
}): Promise<AuthResult> {
  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .or(`email.eq.${formData.email},username.eq.${formData.username}`)
      .single()

    if (existingUser) {
      return { error: 'Cet email ou nom d\'utilisateur existe déjà' }
    }

    const hashedPassword = await bcrypt.hash(formData.password, 10)

    const { data: user, error } = await supabase
      .from('users')
      .insert([{
        username: formData.username,
        email: formData.email,
        password: hashedPassword,
        role: formData.role,
        genre: formData.genre,
        photo_profil: null,
        email_verified: false
      }])
      .select()
      .single()

    if (error) {
      return { error: 'Erreur lors de la création du compte' }
    }

    // Créer le profil parent ou précepteur
    if (formData.role === 'precepteur') {
      await supabase
        .from('precepteurs')
        .insert([{ user_id: user.id, disponible: true }])
    }
    
    if (formData.role === 'parent') {
      await supabase
        .from('parents')
        .insert([{ user_id: user.id }])
    }

    // Envoyer l'email de vérification
    await sendVerificationEmail(user.id)

    return { 
      success: true, 
      message: 'Compte créé avec succès. Veuillez vérifier votre email.'
    }

  } catch (error) {
    console.error('Exception register:', error)
    return { error: 'Erreur serveur lors de l\'inscription' }
  }
}

export async function getAllUsers(): Promise<{
  success?: boolean
  error?: string
  users?: any[]
  total?: number
}> {
  try {
    const access = await checkAdminAccess()
    if (access.error) return { error: access.error }

    const { data: users, error, count } = await supabase
      .from('users')
      .select('id, username, email, role, genre, photo_profil, email_verified, created_at, updated_at', { count: 'exact' }) // ← Ajouter email_verified
      .order('created_at', { ascending: false })

    if (error) return { error: 'Erreur lors de la récupération des utilisateurs' }

    return { success: true, users, total: count || 0 }

  } catch (error) {
    console.error('Exception getAllUsers:', error)
    return { error: 'Erreur serveur' }
  }
}
// actions/auth.ts - Ajouter cette fonction

export async function adminVerifyUserEmail(userId: string): Promise<AuthResult> {
  try {
    // Vérifier que l'utilisateur actuel est admin
    const access = await checkAdminAccess()
    if (access.error) return { error: access.error }

    const { error } = await supabase
      .from('users')
      .update({
        email_verified: true,
        verification_token: null,
        verification_code: null,
        verification_token_expires: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      return { error: 'Erreur lors de la validation de l\'email' }
    }

    return { success: true, message: 'Email validé avec succès' }

  } catch (error) {
    console.error('Exception adminVerifyUserEmail:', error)
    return { error: 'Erreur serveur' }
  }
}
// actions/auth.ts - Fonction forgotPassword corrigée

// export async function forgotPassword(email: string): Promise<AuthResult> {
//   try {
//     const { data: user, error } = await supabase
//       .from('users')
//       .select('id, email, username')
//       .eq('email', email)
//       .single()

//     if (error || !user) {
//       // Pour des raisons de sécurité, ne pas révéler si l'email existe
//       return { 
//         success: true, 
//         message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.' 
//       }
//     }

//     // Générer le token ET le code
//     const token = generateRandomToken()
//     const code = generateVerificationCode()  // ← Générer aussi un code
//     const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 heure

//     const { error: updateError } = await supabase
//       .from('users')
//       .update({
//         reset_password_token: token,
//         reset_password_code: code,  // ← Sauvegarder le code aussi
//         reset_password_expires: expiresAt.toISOString()
//       })
//       .eq('id', user.id)

//     if (updateError) {
//       return { error: 'Erreur lors de la génération du token' }
//     }

//     // Passer les 3 arguments : username, token, code
//     const emailHtml = getPasswordResetEmail(user.username, token, code)
//     await sendEmail(user.email, 'Réinitialisation de votre mot de passe', emailHtml)

//     return { 
//       success: true, 
//       message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.' 
//     }

//   } catch (error) {
//     console.error('Exception forgotPassword:', error)
//     return { error: 'Erreur serveur' }
//   }
// }
// export async function resetPassword(token: string, newPassword: string): Promise<AuthResult> {
//   try {
//     const { data: user, error } = await supabase
//       .from('users')
//       .select('id, reset_password_token, reset_password_expires')
//       .eq('reset_password_token', token)
//       .single()

//     if (error || !user) {
//       return { error: 'Token de réinitialisation invalide' }
//     }

//     if (user.reset_password_expires && new Date(user.reset_password_expires) < new Date()) {
//       return { error: 'Le lien de réinitialisation a expiré. Veuillez demander un nouveau lien.' }
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10)

//     const { error: updateError } = await supabase
//       .from('users')
//       .update({
//         password: hashedPassword,
//         reset_password_token: null,
//         reset_password_expires: null,
//         updated_at: new Date().toISOString()
//       })
//       .eq('id', user.id)

//     if (updateError) {
//       return { error: 'Erreur lors de la réinitialisation du mot de passe' }
//     }

//     return { success: true, message: 'Mot de passe réinitialisé avec succès' }

//   } catch (error) {
//     console.error('Exception resetPassword:', error)
//     return { error: 'Erreur serveur' }
//   }
// }

// Modifier le login pour vérifier l'email
export async function login(email: string, password: string): Promise<AuthResult> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return { error: 'Email ou mot de passe incorrect' }
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return { error: 'Email ou mot de passe incorrect' }
    }

    // Vérifier si l'email est vérifié
    if (!user.email_verified) {
      return { 
        error: 'Veuillez vérifier votre adresse email avant de vous connecter.',
        code: 'EMAIL_NOT_VERIFIED',
       user: {  // ✅ Existe dans AuthResult
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role,
  genre: user.genre,
  photo_profil: user.photo_profil,
  email_verified: false,
  created_at: user.created_at,
  updated_at: user.updated_at
}
      }
    }

    const token = generateToken(user.id, user.role)
    await setAuthCookie(token)
    
    userCache = null

    const { password: _, ...userWithoutPassword } = user
    
    return { 
      success: true, 
      user: userWithoutPassword
    }

  } catch (error) {
    console.error('Exception login:', error)
    return { error: 'Erreur serveur lors de la connexion' }
  }
}


































// actions/auth.ts - Ajouter/modifier ces fonctions

// Générer un code à 6 chiffres
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Générer un token (pour le lien)
function generateRandomToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// ============ VÉRIFICATION D'EMAIL ============

export async function sendVerificationEmail(userId: string): Promise<AuthResult> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, username, email_verified')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return { error: 'Utilisateur non trouvé' }
    }

    if (user.email_verified) {
      return { error: 'Email déjà vérifié' }
    }

    // Générer le token (pour le lien) et le code (pour la saisie manuelle)
    const token = generateRandomToken()
    const code = generateVerificationCode()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 heures

    // Sauvegarder le token ET le code
    const { error: updateError } = await supabase
      .from('users')
      .update({
        verification_token: token,
        verification_code: code,  // ← Nouveau champ
        verification_token_expires: expiresAt.toISOString()
      })
      .eq('id', userId)

    if (updateError) {
      return { error: 'Erreur lors de la génération du token' }
    }

    // Envoyer l'email avec le lien ET le code
    const emailHtml = getVerificationEmail(user.username, token, code)
    const emailResult = await sendEmail(user.email, 'Vérification de votre adresse email', emailHtml)

    if (!emailResult.success) {
      return { error: 'Erreur lors de l\'envoi de l\'email de vérification' }
    }

    return { success: true, message: 'Email de vérification envoyé' }

  } catch (error) {
    console.error('Exception sendVerificationEmail:', error)
    return { error: 'Erreur serveur' }
  }
}

// Vérifier avec le lien (token)
export async function verifyEmail(token: string): Promise<AuthResult> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, verification_token, verification_token_expires, email_verified')
      .eq('verification_token', token)
      .single()

    if (error || !user) {
      return { error: 'Lien de vérification invalide' }
    }

    if (user.email_verified) {
      return { success: true, message: 'Email déjà vérifié. Vous pouvez vous connecter.' }
    }

    if (user.verification_token_expires && new Date(user.verification_token_expires) < new Date()) {
      return { error: 'Le lien de vérification a expiré. Veuillez demander un nouveau code.' }
    }

    // Marquer comme vérifié
    const { error: updateError } = await supabase
      .from('users')
      .update({
        email_verified: true,
        verification_token: null,
        verification_code: null,
        verification_token_expires: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      return { error: 'Erreur lors de la vérification' }
    }

    return { success: true, message: 'Email vérifié avec succès ! Vous pouvez maintenant vous connecter.' }

  } catch (error) {
    console.error('Exception verifyEmail:', error)
    return { error: 'Erreur serveur' }
  }
}

// Vérifier avec le code (saisie manuelle)
export async function verifyEmailWithCode(email: string, code: string): Promise<AuthResult> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, verification_code, verification_token_expires, email_verified')
      .eq('email', email)
      .single()

    if (error || !user) {
      return { error: 'Email non trouvé' }
    }

    if (user.email_verified) {
      return { success: true, message: 'Email déjà vérifié. Vous pouvez vous connecter.' }
    }

    if (user.verification_code !== code) {
      return { error: 'Code de vérification incorrect' }
    }

    if (user.verification_token_expires && new Date(user.verification_token_expires) < new Date()) {
      return { error: 'Le code a expiré. Veuillez demander un nouveau code.' }
    }

    // Marquer comme vérifié
    const { error: updateError } = await supabase
      .from('users')
      .update({
        email_verified: true,
        verification_token: null,
        verification_code: null,
        verification_token_expires: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      return { error: 'Erreur lors de la vérification' }
    }

    return { success: true, message: 'Email vérifié avec succès ! Vous pouvez maintenant vous connecter.' }

  } catch (error) {
    console.error('Exception verifyEmailWithCode:', error)
    return { error: 'Erreur serveur' }
  }
}

// Renvoyer l'email de vérification (depuis la page de vérification)
export async function resendVerificationEmail(email: string): Promise<AuthResult> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email_verified')
      .eq('email', email)
      .single()

    if (error || !user) {
      return { error: 'Email non trouvé' }
    }

    if (user.email_verified) {
      return { success: true, message: 'Email déjà vérifié' }
    }

    return await sendVerificationEmail(user.id)

  } catch (error) {
    console.error('Exception resendVerificationEmail:', error)
    return { error: 'Erreur serveur' }
  }
}



















// resetPassword existant (avec token/lien) - le garder aussi
export async function resetPassword(token: string, newPassword: string): Promise<AuthResult> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, reset_password_token, reset_password_expires')
      .eq('reset_password_token', token)
      .single()

    if (error || !user) {
      return { error: 'Lien de réinitialisation invalide' }
    }

    if (user.reset_password_expires && new Date(user.reset_password_expires) < new Date()) {
      return { error: 'Le lien a expiré. Veuillez demander un nouveau lien.' }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    const { error: updateError } = await supabase
      .from('users')
      .update({
        password: hashedPassword,
        reset_password_token: null,
        reset_password_code: null,
        reset_password_expires: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      return { error: 'Erreur lors de la réinitialisation du mot de passe' }
    }

    return { success: true, message: 'Mot de passe réinitialisé avec succès' }

  } catch (error) {
    console.error('Exception resetPassword:', error)
    return { error: 'Erreur serveur' }
  }
}














































// actions/auth.ts - Modifier resetPasswordWithCode

export async function resetPasswordWithCode(
  email: string, 
  code: string, 
  newPassword: string
): Promise<AuthResult> {
  try {
    // Chercher l'utilisateur par email
    const { data: user, error } = await supabase
      .from('users')
      .select('id, reset_password_code, reset_password_expires, reset_password_token')
      .eq('email', email)
      .single()

    if (error || !user) {
      return { error: 'Email non trouvé' }
    }

    // Vérifier si le code existe
    if (!user.reset_password_code) {
      return { error: 'Aucun code de réinitialisation trouvé. Veuillez redemander un code.' }
    }

    // Comparer les codes
    if (user.reset_password_code.toString().trim() !== code.toString().trim()) {
      return { error: 'Code de réinitialisation incorrect' }
    }

    // Vérifier l'expiration
    if (user.reset_password_expires && new Date(user.reset_password_expires) < new Date()) {
      return { error: 'Le code a expiré. Veuillez demander un nouveau code.' }
    }

    // ✅ Si le mot de passe est vide, c'est juste une vérification de code
    if (!newPassword || newPassword.length === 0) {
      return { success: true, message: 'Code valide' }
    }

    // Vérifier la longueur du mot de passe
    if (newPassword.length < 6) {
      return { error: 'Le mot de passe doit contenir au moins 6 caractères.' }
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Mettre à jour le mot de passe et effacer les tokens
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password: hashedPassword,
        reset_password_token: null,
        reset_password_code: null,
        reset_password_expires: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      return { error: 'Erreur lors de la réinitialisation du mot de passe' }
    }

    return { success: true, message: 'Mot de passe réinitialisé avec succès' }

  } catch (error) {
    console.error('Exception resetPasswordWithCode:', error)
    return { error: 'Erreur serveur' }
  }
}

// actions/auth.ts - Version modifiée de forgotPassword

export async function forgotPassword(email: string): Promise<AuthResult & { emailExists?: boolean }> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, username')
      .eq('email', email)
      .single()

    // Vérifier si l'utilisateur existe
    if (error || !user) {
      return { 
        error: 'Aucun compte n\'est associé à cette adresse email.',
        emailExists: false
      }
    }

    // L'utilisateur existe, on peut continuer
    // Générer le token ET le code
    const token = generateRandomToken()
    const code = generateVerificationCode()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 heure

    const { error: updateError } = await supabase
      .from('users')
      .update({
        reset_password_token: token,
        reset_password_code: code,
        reset_password_expires: expiresAt.toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      return { error: 'Erreur lors de la génération du token' }
    }

    // Envoyer l'email avec le code et le lien
    const emailHtml = getPasswordResetEmail(user.username, token, code)
    await sendEmail(user.email, 'Réinitialisation de votre mot de passe', emailHtml)

    return { 
      success: true, 
      emailExists: true,
      message: 'Un code de réinitialisation a été envoyé à votre adresse email.' 
    }

  } catch (error) {
    console.error('Exception forgotPassword:', error)
    return { error: 'Erreur serveur' }
  }
}