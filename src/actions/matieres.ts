'use server'

import { supabase } from '@/lib/supabase'

export async function getMatieres(search?: string) {
  try {
    let query = supabase
      .from('matieres')
      .select('*')
      .order('niveau')
      .order('nom')

    if (search && search.trim()) {
      query = query.ilike('nom', `%${search.trim()}%`)
    }

    const { data, error } = await query

    if (error) throw error

    return { matieres: data || [] }
  } catch (error) {
    console.error('Erreur getMatieres:', error)
    return { matieres: [], error: 'Erreur lors du chargement des matières' }
  }
}

export async function ajouterMatiere(formData: {
  nom: string
  niveau: string
  description?: string
}) {
  try {
    // Vérifier si la matière existe déjà
    const { data: existing } = await supabase
      .from('matieres')
      .select('id')
      .eq('nom', formData.nom)
      .eq('niveau', formData.niveau)
      .single()

    if (existing) {
      return { 
        error: `La matière "${formData.nom}" existe déjà pour le niveau ${formData.niveau}`,
        matiere: existing 
      }
    }

    // Créer la nouvelle matière
    const { data: nouvelleMatiere, error } = await supabase
      .from('matieres')
      .insert([{
        nom: formData.nom,
        niveau: formData.niveau,
        description: formData.description || null
      }])
      .select()
      .single()

    if (error) throw error

    return { success: true, matiere: nouvelleMatiere }
  } catch (error) {
    console.error('Erreur ajouterMatiere:', error)
    return { error: 'Erreur lors de la création de la matière' }
  }
}