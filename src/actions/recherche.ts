
'use server'

import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { getNewContractRequestEmail } from '@/lib/emailTemplates'
import { sendEmail } from '@/lib/email'
const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-tres-long-et-complexe'
const COOKIE_NAME = 'auth-token'

function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
  } catch {
    return null
  }
}

async function getCurrentUserFromCookie() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null
    const decoded = verifyToken(token)
    if (!decoded) return null
    return decoded
  } catch (error) {
    console.error('❌ Erreur cookie:', error)
    return null
  }
}

// =============================================
// TYPES
// =============================================
export type CriteresRecherche = {
  matiere?: string
  commune?: string
  quartier?: string
  experienceMin?: number
  noteMin?: number
  disponible?: boolean
  tri?: 'note' | 'experience' | 'proximite'
  page?: number
  limit?: number
}

export type DemandeContractData = {
  precepteurId: number
  eleveId: number
  matiereId: number
  dateDebut: string
  dateFin: string
  heureDebutPref: string
  heureFinPref: string
  joursPref: string
  typeContrat: 'recurrent' | 'ponctuel'
  frequence: 'quotidien' | 'hebdomadaire' | 'bihebdomadaire' | 'mensuel' | 'ponctuel'
  tarifHoraire?: number
  notes?: string
}

// =============================================
// RECHERCHE PRÉCEPTEURS (CORRIGÉE)
// =============================================
export async function rechercherPrecepteurs(criteres: CriteresRecherche) {
  const limit = criteres.limit || 10
  const page = criteres.page || 1
  const offset = (page - 1) * limit

  // 1. Requête simple sans jointure
  let query = supabase
    .from('precepteurs')
    .select(`
      id,
      user_id,
      commune,
      quartier,
      latitude,
      longitude,
      annees_experience,
      note_moyenne,
      disponible,
      diplome,
      etablissement_origine,
      statut_verification
    `, { count: 'exact' })

  query = query.eq('statut_verification', 'verifie')

  if (criteres.disponible !== undefined) {
    query = query.eq('disponible', criteres.disponible)
  }

  if (criteres.experienceMin) {
    query = query.gte('annees_experience', criteres.experienceMin)
  }

  if (criteres.noteMin) {
    query = query.gte('note_moyenne', criteres.noteMin)
  }

  if (criteres.commune) {
    query = query.ilike('commune', `%${criteres.commune}%`)
  }

  if (criteres.quartier) {
    query = query.ilike('quartier', `%${criteres.quartier}%`)
  }

  if (criteres.matiere) {
    const matiereId = await getMatiereIdByName(criteres.matiere)
    if (matiereId) {
      const { data: precepteurIds } = await supabase
        .from('precepteur_matieres')
        .select('precepteur_id')
        .eq('matiere_id', matiereId)
      
      if (precepteurIds && precepteurIds.length > 0) {
        query = query.in('id', precepteurIds.map(p => p.precepteur_id))
      } else {
        return { precepteurs: [], total: 0, totalPages: 0, page: 1 }
      }
    } else {
      return { precepteurs: [], total: 0, totalPages: 0, page: 1 }
    }
  }

  switch (criteres.tri) {
    case 'experience':
      query = query.order('annees_experience', { ascending: false })
      break
    case 'note':
    default:
      query = query.order('note_moyenne', { ascending: false })
      break
  }

  query = query.range(offset, offset + limit - 1)

  const { data: precepteurs, count, error } = await query

  if (error) {
    console.error('Erreur recherche:', error)
    return { precepteurs: [], total: 0, totalPages: 0, page: 1 }
  }

  if (!precepteurs || precepteurs.length === 0) {
    return { precepteurs: [], total: 0, totalPages: 0, page: 1 }
  }

  // 2. Récupérer les users séparément
  const userIds = [...new Set(precepteurs.map(p => p.user_id))]
  
  const { data: users } = await supabase
    .from('users')
    .select('id, username, email, genre, photo_profil')
    .in('id', userIds)

  const usersMap = new Map((users || []).map(u => [u.id, u]))

  // 3. Récupérer les matières séparément
  const precepteurIds = precepteurs.map(p => p.id)
  
  const { data: precepteurMatieres } = await supabase
    .from('precepteur_matieres')
    .select(`
      precepteur_id,
      matiere_id,
      matieres (
        id,
        nom,
        niveau
      )
    `)
    .in('precepteur_id', precepteurIds)

  const matieresMap = new Map()
  if (precepteurMatieres) {
    precepteurMatieres.forEach(pm => {
      if (!matieresMap.has(pm.precepteur_id)) {
        matieresMap.set(pm.precepteur_id, [])
      }
      matieresMap.get(pm.precepteur_id).push({
        matiere_id: pm.matiere_id,
        matiere: pm.matieres || null
      })
    })
  }

  // 4. Récupérer les contrats séparément
  const { data: contracts } = await supabase
    .from('contracts')
    .select('id, statut, precepteur_id')
    .in('precepteur_id', precepteurIds)

  const contractsMap = new Map()
  if (contracts) {
    contracts.forEach(c => {
      if (!contractsMap.has(c.precepteur_id)) {
        contractsMap.set(c.precepteur_id, [])
      }
      contractsMap.get(c.precepteur_id).push({
        id: c.id,
        statut: c.statut
      })
    })
  }

  // 5. Assembler le résultat final
  const precepteursComplets = precepteurs.map(precepteur => ({
    ...precepteur,
    user: usersMap.get(precepteur.user_id) || null,
    matieres: matieresMap.get(precepteur.id) || [],
    stats: contractsMap.get(precepteur.id) || []
  }))

  return {
    precepteurs: precepteursComplets,
    total: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
    page
  }
}


async function createContract(parentId: number, data: DemandeContractData) {
  const { data: eleve, error: eleveError } = await supabase
    .from('eleves')
    .select('id')
    .eq('id', data.eleveId)
    .eq('parent_id', parentId)
    .single()

  if (eleveError || !eleve) {
    return { success: false, error: 'Élève non trouvé' }
  }

  const { data: precepteur, error: precepteurError } = await supabase
    .from('precepteurs')
    .select('id, disponible')
    .eq('id', data.precepteurId)
    .single()

  if (precepteurError || !precepteur) {
    return { success: false, error: 'Précepteur non trouvé' }
  }

  if (!precepteur.disponible) {
    return { success: false, error: 'Précepteur indisponible' }
  }

  const { data: existant } = await supabase
    .from('contracts')
    .select('id')
    .eq('parent_id', parentId)
    .eq('precepteur_id', data.precepteurId)
    .eq('eleve_id', data.eleveId)
    .eq('matiere_id', data.matiereId)
    .in('statut', ['en_attente', 'actif'])
    .maybeSingle()

  if (existant) {
    return { success: false, error: 'Contrat déjà existant' }
  }

  const { data: contrat, error: insertError } = await supabase
    .from('contracts')
    .insert({
      parent_id: parentId,
      precepteur_id: data.precepteurId,
      eleve_id: data.eleveId,
      matiere_id: data.matiereId,
      date_debut: data.dateDebut,
      date_fin: data.dateFin,
      heure_debut_pref: data.heureDebutPref,
      heure_fin_pref: data.heureFinPref,
      jours_pref: data.joursPref,
      type_contrat: data.typeContrat,
      frequence: data.frequence,
      tarif_horaire: data.tarifHoraire || null,
      notes: data.notes || null,
      statut: 'en_attente'
    })
    .select()
    .single()

  if (insertError) {
    return { success: false, error: 'Erreur création contrat' }
  }

  return { success: true, contract: contrat }
}

// =============================================
// UTILITAIRES
// =============================================
async function getMatiereIdByName(nom: string): Promise<number | null> {
  const { data } = await supabase
    .from('matieres')
    .select('id')
    .ilike('nom', nom)
    .single()
  
  return data?.id || null
}

export async function getMatieres() {
  const { data } = await supabase
    .from('matieres')
    .select('*')
    .order('nom')
  
  return data || []
}

export async function getCommunes() {
  const { data } = await supabase
    .from('precepteurs')
    .select('commune')
    .not('commune', 'is', null)
    .eq('statut_verification', 'verifie')
  
  const communes = [...new Set((data || []).map(p => p.commune).filter(Boolean))]
  return communes.sort()
}

export async function getQuartiers() {
  const { data } = await supabase
    .from('precepteurs')
    .select('quartier')
    .not('quartier', 'is', null)
    .eq('statut_verification', 'verifie')
  
  const quartiers = [...new Set((data || []).map(p => p.quartier).filter(Boolean))]
  return quartiers.sort()
}

// =============================================
// PROFIL PRÉCEPTEUR
// =============================================
export async function getPrecepteurProfile(precepteurId: number) {
  try {
    // Récupérer le précepteur
    const { data: precepteur, error: precepteurError } = await supabase
      .from('precepteurs')
      .select('*')
      .eq('id', precepteurId)
      .single()

    if (precepteurError || !precepteur) {
      console.error('Erreur getPrecepteurProfile:', precepteurError)
      return null
    }

    // Récupérer le user séparément
    const { data: user } = await supabase
      .from('users')
      .select('id, username, email, genre, photo_profil, telephone, created_at')
      .eq('id', precepteur.user_id)
      .single()

    // Récupérer les matières
    const { data: precepteurMatieres } = await supabase
      .from('precepteur_matieres')
      .select(`
        matiere_id,
        matieres (
          id,
          nom,
          niveau,
          description
        )
      `)
      .eq('precepteur_id', precepteurId)

    // Récupérer les évaluations
    const { data: evaluations } = await supabase
      .from('evaluations')
      .select(`
        id,
        note,
        commentaire,
        date_evaluation,
        matieres (
          nom,
          niveau
        )
      `)
      .eq('precepteur_id', precepteurId)
      .order('date_evaluation', { ascending: false })

    // Assembler
    return {
      ...precepteur,
      user: user || null,
      matieres: (precepteurMatieres || []).map(pm => ({
        matiere_id: pm.matiere_id,
        matiere: pm.matieres || null
      })),
      evaluations: (evaluations || []).map(e => ({
        ...e,
        matiere: e.matieres || null
      }))
    }
  } catch (error) {
    console.error('Exception getPrecepteurProfile:', error)
    return null
  }
}




export async function getPrecepteurStats(precepteurId: number) {
  try {
    // Récupérer les contrats
    const { data: contrats, error: contratsError } = await supabase
      .from('contracts')
      .select('id, statut')
      .eq('precepteur_id', precepteurId)

    if (contratsError) {
      console.error('Erreur contrats:', contratsError)
      return {
        totalContrats: 0,
        contratsActifs: 0,
        totalSessions: 0,
        sessionsTerminees: 0,
        moyenneNotes: '0.0',
        totalEvaluations: 0
      }
    }

    const contratIds = (contrats || []).map(c => c.id)
    let sessions: any[] = []
    
    if (contratIds.length > 0) {
      const { data: sessionsData } = await supabase
        .from('sessions_cours')
        .select('id, statut')
        .in('contract_id', contratIds)

      if (sessionsData) {
        sessions = sessionsData
      }
    }

    // ✅ CORRECTION : Utiliser precepteur_ratings au lieu de evaluations
    const { data: ratings, error: ratingsError } = await supabase
      .from('precepteur_ratings')
      .select('note')
      .eq('precepteur_id', precepteurId)

    if (ratingsError) {
      console.error('Erreur ratings:', ratingsError)
    }

    const notes = (ratings || []).map(r => r.note).filter(n => n !== null && n !== undefined)
    const totalEvaluations = notes.length
    const moyenne = totalEvaluations > 0
      ? (notes.reduce((sum, n) => sum + n, 0) / totalEvaluations).toFixed(1)
      : '0.0'

    console.log('📊 Stats calculées:', {
      precepteurId,
      totalEvaluations,
      notes,
      moyenne
    })

    return {
      totalContrats: contrats?.length || 0,
      contratsActifs: contrats?.filter(c => c.statut === 'actif').length || 0,
      totalSessions: sessions.length,
      sessionsTerminees: sessions.filter(s => s.statut === 'termine').length || 0,
      moyenneNotes: moyenne,
      totalEvaluations: totalEvaluations
    }
  } catch (error) {
    console.error('Exception getPrecepteurStats:', error)
    return {
      totalContrats: 0,
      contratsActifs: 0,
      totalSessions: 0,
      sessionsTerminees: 0,
      moyenneNotes: '0.0',
      totalEvaluations: 0
    }
  }
}



// =============================================
// DEMANDER UN CONTRAT
// =============================================
// export async function demanderContract(data: DemandeContractData) {
//   try {
//     const user = await getCurrentUserFromCookie()
    
//     if (!user) {
//       return { success: false, error: 'Non authentifié' }
//     }

//     const { data: parent, error: parentError } = await supabase
//       .from('parents')
//       .select('id')
//       .eq('user_id', user.userId)
//       .single()

//     if (parentError) {
//       if (parentError.code === 'PGRST116') {
//         const { data: newParent, error: createError } = await supabase
//           .from('parents')
//           .insert([{ user_id: user.userId }])
//           .select('id')
//           .single()

//         if (createError) {
//           return { success: false, error: 'Erreur création profil parent' }
//         }

//         return await createContract(newParent.id, data)
//       }
      
//       return { success: false, error: 'Erreur récupération parent' }
//     }

//     if (!parent) {
//       return { success: false, error: 'Profil parent non trouvé' }
//     }

//     return await createContract(parent.id, data)

//   } catch (error) {
//     console.error('❌ Erreur:', error)
//     return { success: false, error: 'Une erreur est survenue' }
//   }
// }

// =============================================
// DEMANDER UN CONTRAT (AVEC EMAIL)
// =============================================
export async function demanderContract(data: DemandeContractData) {
  console.log('📝 ========== DÉBUT DEMANDE CONTRAT ==========')
  console.log('📝 data:', JSON.stringify(data, null, 2))
  
  try {
    const user = await getCurrentUserFromCookie()
    
    if (!user) {
      console.error('❌ Non authentifié')
      return { success: false, error: 'Non authentifié' }
    }
    console.log('✅ User authentifié:', user.userId)

    // Récupérer ou créer le parent
    let parentId: number | null = null
    
    const { data: parent, error: parentError } = await supabase
      .from('parents')
      .select('id')
      .eq('user_id', user.userId)
      .single()

    if (parentError) {
      if (parentError.code === 'PGRST116') {
        // Créer le parent s'il n'existe pas
        console.log('📝 Création du profil parent...')
        const { data: newParent, error: createError } = await supabase
          .from('parents')
          .insert([{ user_id: user.userId }])
          .select('id')
          .single()

        if (createError) {
          console.error('❌ Erreur création parent:', createError)
          return { success: false, error: 'Erreur création profil parent' }
        }
        
        parentId = newParent.id
        console.log('✅ Nouveau parent créé:', parentId)
      } else {
        console.error('❌ Erreur récupération parent:', parentError)
        return { success: false, error: 'Erreur récupération parent' }
      }
    } else if (parent) {
      parentId = parent.id
      console.log('✅ Parent trouvé:', parentId)
    }

    if (!parentId) {
      return { success: false, error: 'Profil parent non trouvé' }
    }

    // 🔥 APPELER LA FONCTION AVEC EMAIL
    console.log('📧 Appel de createContractWithEmail...')
    return await createContractWithEmail(parentId, data, user.userId)

  } catch (error) {
    console.error('❌ Erreur globale:', error)
    return { success: false, error: 'Une erreur est survenue' }
  }
}

// 🔥 GARDER UNIQUEMENT CETTE FONCTION (supprimer l'ancienne createContract)
async function createContractWithEmail(parentId: number, data: DemandeContractData, userId: string) {
  console.log('📝 ========== createContractWithEmail ==========')
  console.log('📝 parentId:', parentId)
  console.log('📝 userId:', userId)
  
  // Vérifier l'élève
  const { data: eleve, error: eleveError } = await supabase
    .from('eleves')
    .select('id')
    .eq('id', data.eleveId)
    .eq('parent_id', parentId)
    .single()

  if (eleveError || !eleve) {
    console.error('❌ Élève non trouvé:', eleveError)
    return { success: false, error: 'Élève non trouvé' }
  }
  console.log('✅ Élève trouvé:', eleve.id)

  // Vérifier le précepteur
  const { data: precepteur, error: precepteurError } = await supabase
    .from('precepteurs')
    .select('id, disponible, user_id')
    .eq('id', data.precepteurId)
    .single()

  if (precepteurError || !precepteur) {
    console.error('❌ Précepteur non trouvé:', precepteurError)
    return { success: false, error: 'Précepteur non trouvé' }
  }
  console.log('✅ Précepteur trouvé:', {
    id: precepteur.id,
    disponible: precepteur.disponible,
    user_id: precepteur.user_id
  })

  if (!precepteur.disponible) {
    console.warn('⚠️ Précepteur indisponible')
    return { success: false, error: 'Précepteur indisponible' }
  }

  // Vérifier si un contrat existe déjà
  const { data: existant } = await supabase
    .from('contracts')
    .select('id')
    .eq('parent_id', parentId)
    .eq('precepteur_id', data.precepteurId)
    .eq('eleve_id', data.eleveId)
    .eq('matiere_id', data.matiereId)
    .in('statut', ['en_attente', 'actif'])
    .maybeSingle()

  if (existant) {
    console.warn('⚠️ Contrat déjà existant:', existant.id)
    return { success: false, error: 'Contrat déjà existant' }
  }

  // Créer le contrat
  console.log('📝 Insertion du contrat dans la DB...')
  const { data: contrat, error: insertError } = await supabase
    .from('contracts')
    .insert({
      parent_id: parentId,
      precepteur_id: data.precepteurId,
      eleve_id: data.eleveId,
      matiere_id: data.matiereId,
      date_debut: data.dateDebut,
      date_fin: data.dateFin,
      heure_debut_pref: data.heureDebutPref,
      heure_fin_pref: data.heureFinPref,
      jours_pref: data.joursPref,
      type_contrat: data.typeContrat,
      frequence: data.frequence,
      tarif_horaire: data.tarifHoraire || null,
      notes: data.notes || null,
      statut: 'en_attente'
    })
    .select()
    .single()

  if (insertError) {
    console.error('❌ Erreur insertion contrat:', insertError)
    return { success: false, error: 'Erreur création contrat' }
  }

  console.log('✅ Contrat créé:', contrat.id)

  // 📧 ENVOI DE L'EMAIL (avec await pour voir les logs)
  console.log('📧 ========== DÉBUT ENVOI EMAIL ==========')
  try {
    // Récupérer les infos en parallèle
    const [
      { data: precepteurUser },
      { data: parentUser },
      { data: matiere }
    ] = await Promise.all([
      supabase
        .from('users')
        .select('username, email')
        .eq('id', precepteur.user_id)
        .single(),
      supabase
        .from('users')
        .select('username')
        .eq('id', userId)
        .single(),
      supabase
        .from('matieres')
        .select('nom, niveau')
        .eq('id', data.matiereId)
        .single()
    ])

    console.log('📧 Infos récupérées:')
    console.log('  - precepteurUser:', { 
      username: precepteurUser?.username, 
      email: precepteurUser?.email ? '***@***' : 'PAS D\'EMAIL' 
    })
    console.log('  - parentUser:', { username: parentUser?.username })
    console.log('  - matiere:', { nom: matiere?.nom, niveau: matiere?.niveau })

    // Vérifier si l'email existe
    if (!precepteurUser?.email) {
      console.error('❌❌❌ PAS D\'EMAIL POUR LE PRÉCEPTEUR !')
      console.error('❌ precepteur.user_id:', precepteur.user_id)
      return { 
        success: true, 
        contract: contrat,
        message: 'Contrat créé mais pas d\'email pour le précepteur' 
      }
    }

    console.log('✅ Email trouvé, préparation de l\'envoi...')

    // Formater les jours
    const joursMap: { [key: string]: string } = {
      '0': 'Dim', '1': 'Lun', '2': 'Mar', '3': 'Mer',
      '4': 'Jeu', '5': 'Ven', '6': 'Sam'
    }
    const joursFormatted = data.joursPref
      .split(',')
      .map(j => joursMap[j.trim()] || j)
      .join(', ')

    console.log('📧 Génération du template email...')
    const emailHTML = getNewContractRequestEmail({
      precepteurName: precepteurUser.username || 'Précepteur',
      parentName: parentUser?.username || 'Un parent',
      matiere: `${matiere?.nom || ''} ${matiere?.niveau ? `(${matiere.niveau})` : ''}`,
      dateDebut: new Date(data.dateDebut).toLocaleDateString('fr-FR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      }),
      dateFin: new Date(data.dateFin).toLocaleDateString('fr-FR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      }),
      jours: joursFormatted,
      horaires: `${data.heureDebutPref} - ${data.heureFinPref}`,
      tarif: data.tarifHoraire ? `${data.tarifHoraire.toLocaleString()}` : '',
      message: data.notes
    })

    console.log('📧 Envoi de l\'email à:', precepteurUser.email)
    
    // 🔥 ENVOI AVEC AWAIT pour voir les logs
    const emailResult = await sendEmail(
      precepteurUser.email,
      '📚 Nouvelle demande de cours reçue !',
      emailHTML
    )

    if (emailResult.success) {
      console.log('✅✅✅ EMAIL ENVOYÉ AVEC SUCCÈS !')
      console.log('✅ Message ID:', emailResult.messageId)
    } else {
      console.error('❌❌❌ ÉCHEC ENVOI EMAIL:', emailResult.error)
    }

    // Notification (optionnelle)
    try {
      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: precepteur.user_id,
          titre: 'Nouvelle demande de contrat',
          message: `${parentUser?.username || 'Un parent'} vous a envoyé une proposition de contrat pour ${matiere?.nom || 'une matière'}`,
          type: 'contrat',
          lien: `/dashboard/precepteur/contrats/${contrat.id}`,
          lu: false
        })

      if (notifError) {
        console.warn('⚠️ Erreur notification (non bloquant):', notifError.message)
      } else {
        console.log('✅ Notification créée')
      }
    } catch (notifCatchError) {
      console.warn('⚠️ Table notifications peut ne pas exister')
    }

  } catch (emailError) {
    console.error('❌❌❌ ERREUR GLOBALE EMAIL:', emailError)
  }

  console.log('📝 ========== FIN createContractWithEmail ==========')
  
  return { 
    success: true, 
    contract: contrat,
    message: 'Proposition envoyée avec succès !'
  }
}

// ❌ SUPPRIMER L'ANCIENNE FONCTION createContract (lignes 155-205)
// ❌ SUPPRIMER la fonction commentée en double (lignes 313-442)