

// actions/auth.ts
'use server'

import { cookies } from 'next/headers';
import { serverFetch, serverUpload, setServerToken, removeServerToken } from '@/lib/server-api';
import { api } from '@/lib/api';

// Types
type UserRole = 'admin' | 'parent' | 'precepteur' | 'responsable_pedagogique';

type User = {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  genre: string;
  photo_profil?: string | null;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
};

type PrecepteurInfo = {
  id: number;
  user_id: string;
  commune?: string | null;
  quartier?: string | null;
  annees_experience?: number | null;
  diplome?: string | null;
  etablissement_origine?: string | null;
  statut_verification: string;
  disponible: boolean;
  note_moyenne: number;
  telephone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  precepteur_matieres: Array<{
    matiere_id: number;
    matiere: any;
  }>;
} | null;

/**
 * Connexion utilisateur
 */
export async function login(email: string, password: string) {
  try {
    console.log('🔐 Action login appelée pour:', email);
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    });

    const data = await response.json();
    console.log('📥 Réponse login:', { 
      success: data.success, 
      hasToken: !!data.token,
      hasUser: !!data.user 
    });

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Erreur de connexion',
        code: data.code
      };
    }

    // ✅ Stocker le token dans les cookies serveur
    if (data.token) {
      await setServerToken(data.token);
      console.log('✅ Token stocké dans les cookies serveur');
    }

    return {
      success: true,
      user: data.user,
      token: data.token
    };
  } catch (error: any) {
    console.error('❌ Erreur login action:', error);
    return {
      success: false,
      error: error.message || 'Erreur de connexion au serveur'
    };
  }
}

/**
 * Inscription utilisateur
 */
export async function register(formData: {
  email: string;
  password: string;
  username: string;
  role: string;
  genre: string;
}) {
  try {
    console.log('📝 Action register appelée pour:', formData.email);
    
    const data = await serverFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    
    console.log('✅ Inscription réussie:', data);
    
    return {
      success: true,
      ...data
    };
  } catch (error: any) {
    console.error('❌ Erreur register:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de l\'inscription'
    };
  }
}

/**
 * Déconnexion
 */
export async function logout() {
  try {
    console.log('🚪 Action logout appelée');
    
    await serverFetch('/auth/logout', {
      method: 'POST'
    });
    
    // Supprimer le token des cookies
    await removeServerToken();
    
    console.log('✅ Déconnexion réussie');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur logout:', error);
    // Même en cas d'erreur, supprimer le token
    await removeServerToken();
    return { success: false, error: error.message };
  }
}

/**
 * Récupérer l'utilisateur courant
 */
export async function getCurrentUser() {
  try {
    console.log('👤 Action getCurrentUser appelée');
    
    const data = await serverFetch('/auth/me');
    
    console.log('✅ Utilisateur récupéré:', data.user?.email);
    
    return {
      success: true,
      user: data.user,
      precepteurInfo: data.precepteurInfo || null
    };
  } catch (error: any) {
    console.error('❌ Erreur getCurrentUser:', error);
    return {
      success: false,
      error: error.message || 'Non authentifié'
    };
  }
}

/**
 * Récupérer les informations du précepteur
 */
export async function getPrecepteurInfo() {
  try {
    console.log('👨‍🏫 Action getPrecepteurInfo appelée');
    
    const data = await serverFetch('/auth/me');
    
    return {
      success: true,
      precepteurInfo: data.precepteurInfo || null
    };
  } catch (error: any) {
    console.error('❌ Erreur getPrecepteurInfo:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Vérifier l'email
 */
export async function verifyEmail(email: string, code: string) {
  try {
    console.log('📧 Vérification email pour:', email);
    
    const data = await serverFetch('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, code })
    });
    
    // Si un token est retourné, le stocker
    if (data.token) {
      await setServerToken(data.token);
    }
    
    return {
      success: true,
      ...data
    };
  } catch (error: any) {
    console.error('❌ Erreur verifyEmail:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Renvoyer le code de vérification
 */
export async function resendVerificationCode(email: string) {
  try {
    const data = await serverFetch('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    
    return {
      success: true,
      ...data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Mot de passe oublié
 */
export async function forgotPassword(email: string) {
  try {
    const data = await serverFetch('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    
    return {
      success: true,
      ...data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Réinitialiser le mot de passe
 */
export async function resetPassword(token: string, newPassword: string) {
  try {
    const data = await serverFetch('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword })
    });
    
    return {
      success: true,
      ...data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Mettre à jour le profil (avec photo)
 */
export async function updateProfile(formData: FormData) {
  try {
    const data = await serverUpload('/auth/profile', formData);
    
    return {
      success: true,
      user: data.user
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

// actions/auth.ts
export async function updateProfilePhoto(file: File) {
  try {
    console.log('📤 Upload photo - Taille:', file.size, 'Type:', file.type);
    
    // Vérifications
    if (file.size > 5 * 1024 * 1024) {
      return { 
        success: false, 
        error: 'Image trop volumineuse. Maximum 5MB.' 
      };
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { 
        success: false, 
        error: 'Format non supporté. Utilisez JPG, PNG ou WebP.' 
      };
    }
    
    const formData = new FormData();
    formData.append('photo', file, file.name); // ✅ Ajouter le nom du fichier
    
    // ✅ Utiliser PUT et spécifier la méthode
    const data = await serverUpload('/auth/profile', formData, 'PUT');
    
    console.log('✅ Upload réussi:', data.user?.photo_profil);
    
    return { 
      success: true, 
      photoUrl: data.user?.photo_profil 
    };
  } catch (error: any) {
    console.error('❌ Erreur upload photo:', error);
    return { 
      success: false, 
      error: error.message || 'Erreur lors de l\'upload' 
    };
  }
}

/**
 * Mettre à jour le profil précepteur
 */
export async function updatePrecepteurProfile(profileData: {
  latitude?: number;
  longitude?: number;
  commune?: string;
  quartier?: string;
  annees_experience?: number;
  diplome?: string;
  etablissement_origine?: string;
  telephone?: string;
  matieres?: number[];
}) {
  try {
    const data = await serverFetch('/auth/precepteur/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
    
    return {
      success: true,
      precepteur: data.precepteur
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Récupérer les matières disponibles
 */
export async function getMatieres() {
  try {
    const data = await serverFetch('/auth/precepteur/matieres');
    return {
      success: true,
      matieres: data.matieres
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      matieres: []
    };
  }
}

/**
 * Récupérer les contrats du précepteur
 */
export async function getContrats() {
  try {
    const data = await serverFetch('/auth/precepteur/contrats');
    return {
      success: true,
      contrats: data.contrats
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      contrats: []
    };
  }
}

/**
 * Mettre à jour le statut d'un contrat
 */
export async function updateContratStatus(contratId: string, status: string) {
  try {
    await serverFetch(`/auth/precepteur/contrats/${contratId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Créer une session
 */
export async function createSession(sessionData: {
  contract_id: string;
  date_session: string;
  heure_debut: string;
  heure_fin: string;
  type_session?: string;
  lieu?: string;
  lien_visio?: string;
  notes?: string;
}) {
  try {
    const data = await serverFetch('/auth/precepteur/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData)
    });
    
    return {
      success: true,
      session: data.session
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Mettre à jour le statut d'une session
 */
export async function updateSessionStatus(sessionId: string, status: string) {
  try {
    await serverFetch(`/auth/precepteur/sessions/${sessionId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Mettre à jour les notes d'une session
 */
export async function updateSessionNotes(sessionId: string, notes: string) {
  try {
    await serverFetch(`/auth/precepteur/sessions/${sessionId}/notes`, {
      method: 'PUT',
      body: JSON.stringify({ notes })
    });
    
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Mettre à jour la disponibilité du précepteur
 */
export async function updatePrecepteurDisponibility(disponible: boolean) {
  try {
    await serverFetch('/auth/precepteur/disponibility', {
      method: 'PUT',
      body: JSON.stringify({ disponible })
    });
    
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Récupérer les statistiques du précepteur
 */
export async function getPrecepteurStats() {
  try {
    const data = await serverFetch('/auth/precepteur/stats');
    return {
      success: true,
      stats: data.stats
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      stats: null
    };
  }
}

/**
 * Récupérer les disponibilités du précepteur
 */
export async function getDisponibilites() {
  try {
    const data = await serverFetch('/auth/precepteur/disponibilites');
    return {
      success: true,
      disponibilites: data.disponibilites
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      disponibilites: []
    };
  }
}

/**
 * Ajouter une disponibilité
 */
export async function addDisponibilite(dispoData: {
  jour_semaine: number;
  heure_debut: string;
  heure_fin: string;
}) {
  try {
    const data = await serverFetch('/auth/precepteur/disponibilites', {
      method: 'POST',
      body: JSON.stringify(dispoData)
    });
    
    return {
      success: true,
      disponibilite: data.disponibilite
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Supprimer une disponibilité
 */
export async function deleteDisponibilite(dispoId: string) {
  try {
    await serverFetch(`/auth/precepteur/disponibilites/${dispoId}`, {
      method: 'DELETE'
    });
    
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}