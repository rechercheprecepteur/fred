// src/lib/session-api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * ✅ Récupère le token depuis localStorage (clé corrigée)
 */
function getToken(): string | null {
  if (typeof window !== 'undefined') {
    // ✅ Utiliser la même clé que partout dans l'app
    const token = localStorage.getItem('excellence-token');
    if (!token) {
      console.warn('⚠️ Aucun token trouvé dans localStorage (clé: excellence-token)');
    }
    return token;
  }
  return null;
}

/**
 * Helper pour les requêtes API sessions
 */
async function sessionFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = getToken();
  const url = `${API_URL}/auth/precepteur${endpoint}`;
  
  console.log(`📡 SessionFetch -> ${options.method || 'GET'} ${endpoint}`);
  console.log(`  - Token présent: ${!!token}`);

  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  // Ne pas mettre Content-Type pour FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // ✅ Ajouter le token d'authentification
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.error('❌ Token manquant pour la requête:', endpoint);
    throw new Error('Token d\'authentification requis');
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers as Record<string, string> || {}),
      },
      cache: 'no-store',
    });

    console.log(`  - Status: ${response.status}`);

    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        console.error('  - Erreur API:', data);
        throw new Error(data.error || 'Une erreur est survenue');
      }
      
      return data;
    } else {
      const text = await response.text();
      console.error('  - Réponse non-JSON:', text.substring(0, 200));
      throw new Error(`Réponse non-JSON: ${text.substring(0, 200)}`);
    }
  } catch (error: any) {
    if (error.message && !error.message.includes('fetch')) {
      throw error;
    }
    console.error('❌ Erreur fetch session:', error);
    throw new Error(error.message || 'Erreur de connexion au serveur');
  }
}

// ============ SESSIONS ============

export async function getSessions() {
  return sessionFetch('/sessions');
}

export async function getSessionById(sessionId: number) {
  return sessionFetch(`/sessions/${sessionId}`);
}

export async function getSessionsByContract(contractId: number) {
  return sessionFetch(`/contrats/${contractId}/sessions`);
}

export async function createSession(data: {
  contract_id: string | number;
  date_session: string;
  heure_debut: string;
  heure_fin: string;
  lieu: string;
  notes_precepteur?: string;
  type_session?: string;
  lien_visio?: string;
}) {
  return sessionFetch('/sessions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateSessionStatus(sessionId: number, statut: string, raison_annulation?: string) {
  return sessionFetch(`/sessions/${sessionId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ statut, raison_annulation }),
  });
}

export async function updateSessionNotes(sessionId: number, notes: string) {
  return sessionFetch(`/sessions/${sessionId}/notes`, {
    method: 'PUT',
    body: JSON.stringify({ notes_precepteur: notes }),
  });
}

export async function updateSession(sessionId: number, data: any) {
  return sessionFetch(`/sessions/${sessionId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteSession(sessionId: number) {
  return sessionFetch(`/sessions/${sessionId}`, {
    method: 'DELETE',
  });
}

// ============ FICHIERS ============

export async function getSessionFiles(sessionId: number) {
  return sessionFetch(`/sessions/${sessionId}/files`);
}

export async function uploadSessionFile(sessionId: number, file: File) {
  const token = getToken();
  if (!token) throw new Error('Token d\'authentification requis');

  const formData = new FormData();
  formData.append('fichier', file);

  const url = `${API_URL}/auth/precepteur/sessions/${sessionId}/files`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    body: formData,
  });

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Erreur upload');
    }
    return data;
  } else {
    const text = await response.text();
    throw new Error(`Réponse non-JSON: ${text.substring(0, 200)}`);
  }
}

export async function downloadSessionFile(fileId: number) {
  const token = getToken();
  if (!token) throw new Error('Token d\'authentification requis');

  const url = `${API_URL}/auth/precepteur/sessions/files/${fileId}/download`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Erreur téléchargement');
  
  const blob = await response.blob();
  return blob;
}

export async function deleteSessionFile(fileId: number) {
  return sessionFetch(`/sessions/files/${fileId}`, {
    method: 'DELETE',
  });
}

// ============ COTATIONS ============

export async function getSessionGrades(sessionId: number) {
  return sessionFetch(`/sessions/${sessionId}/grades`);
}

export async function createSessionGrade(sessionId: number, data: {
  titre: string;
  score: number;
  max_score: number;
  comment?: string;
}) {
  return sessionFetch(`/sessions/${sessionId}/grades`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateSessionGrade(gradeId: number, data: {
  titre?: string;
  score?: number;
  max_score?: number;
  comment?: string;
}) {
  return sessionFetch(`/sessions/grades/${gradeId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteSessionGrade(gradeId: number) {
  return sessionFetch(`/sessions/grades/${gradeId}`, {
    method: 'DELETE',
  });
}