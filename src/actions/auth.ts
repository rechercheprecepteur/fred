
// actions/auth.ts
'use server'

import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { sendEmail } from '@/lib/email'
import { getVerificationEmail, getPasswordResetEmail } from '@/lib/emailTemplates'
import crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-tres-long-et-complexe'
const COOKIE_NAME = 'auth-token'

// Types
type AuthResult = {
  success?: boolean
  error?: string
  user?: any
  message?: string
  code?: string
}

// Cache simple pour éviter les requêtes multiples
let memoryCache: {
  data: any
  timestamp: number
  userId: string
} | null = null

const CACHE_DURATION = 30000 // 30 secondes

// ============ HELPERS JWT & COOKIES ============

async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 jours
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

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function generateRandomToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Helper pour obtenir l'ID utilisateur rapidement
export async function getCurrentUserId(): Promise<string | null> {
  const token = await getTokenFromCookie()
  if (!token) return null
  
  const decoded = verifyToken(token)
  return decoded?.userId || null
}

// ============ AUTHENTIFICATION PRINCIPALE ============

export async function getCurrentUser(forceRefresh = false): Promise<AuthResult> {
  try {
    const token = await getTokenFromCookie()
    console.log('🔍 getCurrentUser - Token présent:', !!token)
    
    if (!token) {
      return { error: 'Non authentifié' }
    }

    const decoded = verifyToken(token)
    console.log('🔍 Token décodé:', decoded ? 'valide' : 'invalide')
    
    if (!decoded) {
      await removeAuthCookie()
      memoryCache = null
      return { error: 'Session expirée' }
    }

    const userId = decoded.userId
    console.log('🔍 UserId du token:', userId)

    // Vérifier le cache (si pas forceRefresh)
    if (!forceRefresh && memoryCache && 
        memoryCache.userId === userId && 
        (Date.now() - memoryCache.timestamp) < CACHE_DURATION) {
      console.log('✅ Utilisateur trouvé dans le cache')
      return { success: true, user: memoryCache.data }
    }

    // Requête DB
    console.log('🔍 Requête Supabase pour userId:', userId)
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, email, role, genre, photo_profil, email_verified, created_at, updated_at')
      .eq('id', userId)
      .single()

    if (error || !user) {
      console.log('❌ Utilisateur non trouvé dans Supabase:', error)
      await removeAuthCookie()
      memoryCache = null
      return { error: 'Utilisateur non trouvé' }
    }

    console.log('✅ Utilisateur trouvé:', user.email)

    // Rafraîchir le token
    const newToken = generateToken(user.id, user.role)
    await setAuthCookie(newToken)

    // Mettre en cache
    memoryCache = {
      data: user,
      timestamp: Date.now(),
      userId: user.id
    }

    return { success: true, user }

  } catch (error) {
    console.error('❌ Exception getCurrentUser:', error)
    return { error: 'Erreur serveur' }
  }
}

export async function login(email: string, password: string): Promise<AuthResult> {
  try {
    console.log('🔑 Tentative de connexion:', email)
    
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (error || !user) {
      console.log('❌ Utilisateur non trouvé')
      return { error: 'Email ou mot de passe incorrect' }
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      console.log('❌ Mot de passe incorrect')
      return { error: 'Email ou mot de passe incorrect' }
    }

    // Vérifier si l'email est vérifié
    if (!user.email_verified) {
      console.log('⚠️ Email non vérifié')
      return { 
        error: 'Veuillez vérifier votre adresse email avant de vous connecter.',
        code: 'EMAIL_NOT_VERIFIED',
        user: {
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

    // Vider le cache
    memoryCache = null
    
    // Générer le token
    const token = generateToken(user.id, user.role)
    console.log('🔑 Token généré pour:', user.id)
    
    // Définir le cookie
    await setAuthCookie(token)
    console.log('🍪 Cookie défini')

    const { password: _, ...userWithoutPassword } = user
    
    console.log('✅ Connexion réussie')
    
    return { 
      success: true, 
      user: userWithoutPassword
    }

  } catch (error) {
    console.error('❌ Exception login:', error)
    return { error: 'Erreur serveur lors de la connexion' }
  }
}

export async function register(formData: {
  email: string
  password: string
  username: string
  role: string
  genre: string
}): Promise<AuthResult> {
  try {
    // Vérifier si l'email ou le username existe déjà
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
        email: formData.email.toLowerCase().trim(),
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
      const { error: precepteurError } = await supabase
        .from('precepteurs')
        .insert([{ user_id: user.id, disponible: true }])

      if (precepteurError) {
        console.error('Erreur création précepteur:', precepteurError)
      }
    }
    
    if (formData.role === 'parent') {
      const { error: parentError } = await supabase
        .from('parents')
        .insert([{ user_id: user.id }])

      if (parentError) {
        console.error('Erreur création parent:', parentError)
      }
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

export async function logout(): Promise<void> {
  memoryCache = null
  await removeAuthCookie()
}

// ============ VÉRIFICATION EMAIL ============

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

    const token = generateRandomToken()
    const code = generateVerificationCode()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 heures

    const { error: updateError } = await supabase
      .from('users')
      .update({
        verification_token: token,
        verification_code: code,
        verification_token_expires: expiresAt.toISOString()
      })
      .eq('id', userId)

    if (updateError) {
      return { error: 'Erreur lors de la génération du token' }
    }

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

export async function verifyEmailWithCode(email: string, code: string): Promise<AuthResult> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, verification_code, verification_token_expires, email_verified')
      .eq('email', email.toLowerCase().trim())
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

export async function resendVerificationEmail(email: string): Promise<AuthResult> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email_verified')
      .eq('email', email.toLowerCase().trim())
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

// ============ MOT DE PASSE OUBLIÉ ============

export async function forgotPassword(email: string): Promise<AuthResult & { emailExists?: boolean }> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, username')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (error || !user) {
      return { 
        error: 'Aucun compte n\'est associé à cette adresse email.',
        emailExists: false
      }
    }

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

export async function resetPasswordWithCode(
  email: string, 
  code: string, 
  newPassword: string
): Promise<AuthResult> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, reset_password_code, reset_password_expires')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (error || !user) {
      return { error: 'Email non trouvé' }
    }

    if (!user.reset_password_code) {
      return { error: 'Aucun code de réinitialisation trouvé. Veuillez redemander un code.' }
    }

    if (user.reset_password_code.toString().trim() !== code.toString().trim()) {
      return { error: 'Code de réinitialisation incorrect' }
    }

    if (user.reset_password_expires && new Date(user.reset_password_expires) < new Date()) {
      return { error: 'Le code a expiré. Veuillez demander un nouveau code.' }
    }

    // Si newPassword est vide, c'est juste une vérification de code
    if (!newPassword || newPassword.length === 0) {
      return { success: true, message: 'Code valide' }
    }

    if (newPassword.length < 6) {
      return { error: 'Le mot de passe doit contenir au moins 6 caractères.' }
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
    console.error('Exception resetPasswordWithCode:', error)
    return { error: 'Erreur serveur' }
  }
}

// ============ PROFIL UTILISATEUR ============

export async function updateProfile(data: {
  username?: string
  email?: string
  genre?: string
}): Promise<AuthResult> {
  try {
    const userId = await getCurrentUserId()
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

    memoryCache = null // Invalider le cache

    return { success: true }

  } catch (error) {
    console.error('Exception updateProfile:', error)
    return { error: 'Erreur serveur' }
  }
}

export async function updateProfilePhoto(photoBase64: string): Promise<AuthResult> {
  try {
    const userId = await getCurrentUserId()
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

    memoryCache = null // Invalider le cache

    return { success: true }

  } catch (error) {
    console.error('Exception updateProfilePhoto:', error)
    return { error: 'Erreur serveur' }
  }
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<AuthResult> {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { error: 'Non authentifié' }
    }

    const { data: user } = await supabase
      .from('users')
      .select('password')
      .eq('id', userId)
      .single()

    if (!user) {
      return { error: 'Utilisateur non trouvé' }
    }

    const isValid = await bcrypt.compare(oldPassword, user.password)
    if (!isValid) {
      return { error: 'Ancien mot de passe incorrect' }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    const { error } = await supabase
      .from('users')
      .update({ 
        password: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) return { error: 'Erreur lors du changement de mot de passe' }

    return { success: true }

  } catch (error) {
    console.error('Exception changePassword:', error)
    return { error: 'Erreur serveur' }
  }
}

// ============ PRÉCEPTEUR ============

export async function getPrecepteurInfo(userId?: string): Promise<{
  success?: boolean
  error?: string
  precepteurInfo?: any
}> {
  try {
    const currentUserId = await getCurrentUserId()
    if (!currentUserId) {
      return { error: 'Non authentifié' }
    }

    const targetUserId = userId || currentUserId

    // Une seule requête avec jointure
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

    // Récupérer les matières
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

export async function updatePrecepteurDisponibility(disponible: boolean): Promise<AuthResult> {
  try {
    const userId = await getCurrentUserId()
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

// ============ PARENT ============

export async function getParentProfile(): Promise<{
  success?: boolean
  error?: string
  parent?: any
}> {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { error: 'Non authentifié' }
    }

    const { data: parent, error } = await supabase
      .from('parents')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return { success: true, parent: null }
      }
      return { error: 'Erreur lors de la récupération' }
    }

    return { success: true, parent }

  } catch (error) {
    console.error('Exception getParentProfile:', error)
    return { error: 'Erreur serveur' }
  }
}

export async function updateParentProfile(data: {
  telephone?: string
  adresse?: string
}): Promise<AuthResult> {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { error: 'Non authentifié' }
    }

    // Vérifier si le parent existe
    const { data: parent } = await supabase
      .from('parents')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!parent) {
      // Créer le parent s'il n'existe pas
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

// ============ ADMIN ============

async function checkAdminAccess(): Promise<AuthResult> {
  const userId = await getCurrentUserId()
  if (!userId) return { error: 'Non authentifié' }

  const token = await getTokenFromCookie()
  if (!token) return { error: 'Non authentifié' }

  const decoded = verifyToken(token)
  if (!decoded) return { error: 'Session expirée' }

  if (decoded.role !== 'admin' && decoded.role !== 'responsable_pedagogique') {
    return { error: 'Accès non autorisé' }
  }

  return { success: true }
}



export async function createUser(formData: {
  email: string
  password: string
  username: string
  role: string
  genre: string
}): Promise<AuthResult> {
  try {
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

    const hashedPassword = await bcrypt.hash(formData.password, 10)

    const { data: user, error } = await supabase
      .from('users')
      .insert([{
        username: formData.username,
        email: formData.email.toLowerCase().trim(),
        password: hashedPassword,
        role: formData.role,
        genre: formData.genre,
        photo_profil: null,
        email_verified: true // Admin créé = directement vérifié
      }])
      .select()
      .single()

    if (error) {
      return { error: 'Erreur lors de la création du compte' }
    }

    // Créer le profil associé
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

    return { success: true, user }

  } catch (error) {
    console.error('Exception createUser:', error)
    return { error: 'Erreur serveur lors de la création du compte' }
  }
}

export async function updateUserRole(userId: string, newRole: string): Promise<AuthResult> {
  try {
    const access = await checkAdminAccess()
    if (access.error) return { error: access.error }

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

    // Supprimer les données liées
    await supabase.from('precepteur_matieres').delete().eq('precepteur_id', userId)
    await supabase.from('precepteurs').delete().eq('user_id', userId)
    await supabase.from('parents').delete().eq('user_id', userId)

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

export async function adminVerifyUserEmail(userId: string): Promise<AuthResult> {
  try {
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

// Fonction pour invalider le cache (utile après modifications)
export async function invalidateUserCache(): Promise<void> {
  memoryCache = null
}


// actions/auth.ts

// ✅ Cache global pour getAllUsers
let usersCache: {
  data: any[]
  timestamp: number
} | null = null

const USERS_CACHE_DURATION = 60000 // 1 minute





// actions/auth.ts
export async function getAllUsers(): Promise<{
  success?: boolean
  error?: string
  users?: any[]
  total?: number
}> {
  console.time('⏱️ getAllUsers')
  
  try {
    // ✅ Vérification admin rapide
    const token = await getTokenFromCookie()
    if (!token) return { error: 'Non authentifié' }
    
    const decoded = verifyToken(token)
    if (!decoded || (decoded.role !== 'admin' && decoded.role !== 'responsable_pedagogique')) {
      return { error: 'Accès non autorisé' }
    }

    // ✅ Cache plus long (5 minutes)
    if (usersCache && (Date.now() - usersCache.timestamp) < 300000) {
      console.timeEnd('⏱️ getAllUsers')
      return { 
        success: true, 
        users: usersCache.data, 
        total: usersCache.data.length 
      }
    }

    // ✅ Requête optimisée SANS count exact
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, role, photo_profil, email_verified, created_at') // Moins de champs
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('❌ Erreur Supabase:', error)
      return { error: 'Erreur lors de la récupération' }
    }

    // Mise en cache
    usersCache = {
      data: data || [],
      timestamp: Date.now()
    }

    console.timeEnd('⏱️ getAllUsers')
    return { success: true, users: data || [], total: data?.length || 0 }

  } catch (error) {
    console.error('❌ Exception getAllUsers:', error)
    return { error: 'Erreur serveur' }
  }
}