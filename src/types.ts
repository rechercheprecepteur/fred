

// types.ts

export type User = {
  id: string
  username: string
  email: string
  password?: string
  role: 'admin' | 'parent' | 'precepteur' | 'responsable_pedagogique'
  genre: 'M' | 'F'
  photo_profil: string | null
  created_at: Date
  updated_at: Date
}

export type PrecepteurInfo = {
  id: number
  user_id: string
  latitude: number | null
  longitude: number | null
  commune: string | null
  quartier: string | null
  annees_experience: number
  note_moyenne: number
   telephone: string | null 
  diplome: string | null
  etablissement_origine: string | null
  statut_verification: 'en_attente' | 'verifie' | 'rejete'
  disponible: boolean
  created_at?: Date
  updated_at?: Date
}

// export type AuthResult = {
//   success?: boolean
//   error?: string
//   user?: Omit<User, 'password'>
//   precepteurInfo?: PrecepteurInfo | null
// }

// types/index.ts ou là où est défini AuthResult
// export type AuthResult = {
//   success?: boolean
//   error?: string
//   user?: {
//     id: string
//     username: string
//     email: string
//     role: string
//     genre: string
//     photo_profil: string | null
//     created_at: string
//     updated_at: string
//   }
//   token?: string  // Ajoute cette ligne
//   users?: any[]
//   total?: number
//   stats?: any
//   precepteurInfo?: any
// }

// types.ts - Version mise à jour de AuthResult

export type AuthResult = {
  success?: boolean
  error?: string
  message?: string  // ← Ajouter pour les messages de succès
  code?: string     // ← Ajouter pour les codes d'erreur spécifiques (EMAIL_NOT_VERIFIED, etc.)
  user?: {
    id: string
    username: string
    email: string
    role: string
    genre: string
    photo_profil: string | null
    email_verified?: boolean  // ← Ajouter
    created_at: string
    updated_at: string
  }
  token?: string
  users?: any[]
  total?: number
  stats?: any
  precepteurInfo?: any
  parent?: any  // ← Ajouter si utilisé
}

export type Parent = {
  id: number
  user_id: string
  latitude: number | null
  longitude: number | null
  commune: string | null
  quartier: string | null
  created_at: Date
  updated_at: Date
}

export type Eleve = {
  id: number
  parent_id: number
  nom: string
  postnom: string | null
  prenom: string
  genre: 'M' | 'F'
  date_naissance: string | null
  niveau: '7ème' | '8ème'
  ecole: string | null
  created_at: Date
  updated_at: Date
}

export type Matiere = {
  id: number
  nom: string
  description: string | null
  niveau: string
  created_at: Date
}

export type PrecepteurMatiere = {
  precepteur_id: number
  matiere_id: number
}

export type SessionCours = {
  id: number
  eleve_id: number
  precepteur_id: number
  matiere_id: number
  date_session: string
  heure_debut: string
  heure_fin: string
  duree_minutes?: number
  type_session: 'presentiel' | 'en_ligne' | 'hybride'
  lieu: string | null
  statut: 'planifie' | 'en_cours' | 'termine' | 'annule'
  notes_precepteur: string | null
  created_at: Date
  updated_at: Date
}

export type Evaluation = {
  id: number
  session_id: number | null
  eleve_id: number
  precepteur_id: number
  matiere_id: number
  type_evaluation: 'test' | 'devoir' | 'examen_blanc' | 'exercice' | 'quiz'
  note: number
  commentaire: string | null
  date_evaluation: string
  created_at: Date
  updated_at: Date
}

export type RapportProgression = {
  id: number
  eleve_id: number
  precepteur_id: number
  periode_debut: string
  periode_fin: string
  moyenne_generale: number | null
  points_forts: string | null
  axes_amelioration: string | null
  assiduite: 'excellente' | 'bonne' | 'moyenne' | 'faible' | null
  recommandations: string | null
  date_rapport: string
  vu_par_parent: boolean
  created_at: Date
}

export type Alerte = {
  id: number
  user_id: number
  type_alerte: 'baisse_performance' | 'absence_cours' | 'retard_devoir' | 'progres_remarquable' | 'rappel_session' | 'nouveau_rapport'
  titre: string
  message: string
  lu: boolean
  priorite: 'haute' | 'moyenne' | 'basse'
  date_creation: Date
}

export type EvaluationPrecepteur = {
  id: number
  parent_id: number
  precepteur_id: number
  note: number
  commentaire: string | null
  created_at: Date
}

export type FiltresRecherche = {
  matiere?: string
  commune?: string
  quartier?: string
  experienceMin?: number
  noteMin?: number
  disponible?: boolean
  tri?: 'note' | 'experience'
  page?: number
}