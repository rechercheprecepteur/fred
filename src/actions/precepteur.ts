

// actions/precepteur.ts
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

export async function updatePrecepteurProfil(
  formData: {
    latitude: string
    longitude: string
    commune: string
    quartier: string
    annees_experience: number
    diplome: string
    etablissement_origine: string
    telephone: string  // ← AJOUTER
    matieres: number[]
  }
): Promise<{ success?: boolean; error?: string }> {
  const userId = await getCurrentUserId()
  if (!userId) return { error: 'Non authentifié' }

  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return { error: 'Utilisateur non trouvé' }
    }

    if (user.role !== 'precepteur') {
      return { error: 'Seuls les précepteurs peuvent modifier ce profil' }
    }

    const { data: existing } = await supabase
      .from('precepteurs')
      .select('id')
      .eq('user_id', userId)
      .single()

    let precepteurId: number

    if (existing) {
      // Mise à jour du précepteur existant
      const { error } = await supabase
        .from('precepteurs')
        .update({
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          commune: formData.commune,
          quartier: formData.quartier,
          annees_experience: formData.annees_experience,
          diplome: formData.diplome,
          etablissement_origine: formData.etablissement_origine,
          telephone: formData.telephone,  // ← AJOUTER
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (error) {
        console.error('Erreur mise à jour precepteur:', error)
        return { error: 'Erreur lors de la mise à jour du profil' }
      }
      
      precepteurId = existing.id
    } else {
      // Création d'un nouveau précepteur
      const { data: newPrecepteur, error } = await supabase
        .from('precepteurs')
        .insert([{
          user_id: userId,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          commune: formData.commune,
          quartier: formData.quartier,
          annees_experience: formData.annees_experience,
          diplome: formData.diplome,
          etablissement_origine: formData.etablissement_origine,
          telephone: formData.telephone,  // ← AJOUTER
          disponible: true
        }])
        .select('id')
        .single()

      if (error || !newPrecepteur) {
        console.error('Erreur création precepteur:', error)
        return { error: 'Erreur lors de la création du profil précepteur' }
      }
      
      precepteurId = newPrecepteur.id
    }

    // Mise à jour des matières
    if (precepteurId) {
      await supabase
        .from('precepteur_matieres')
        .delete()
        .eq('precepteur_id', precepteurId)

      if (formData.matieres && formData.matieres.length > 0) {
        const matieresToInsert = formData.matieres.map(matiereId => ({
          precepteur_id: precepteurId,
          matiere_id: matiereId
        }))

        const { error: matieresError } = await supabase
          .from('precepteur_matieres')
          .insert(matieresToInsert)

        if (matieresError) {
          console.error('Erreur insertion matières:', matieresError)
          return { error: 'Erreur lors de l\'ajout des matières' }
        }
      }
    }

    return { success: true }
    
  } catch (error) {
    console.error('Exception updatePrecepteurProfil:', error)
    return { error: 'Erreur serveur lors de la mise à jour du profil' }
  }
}