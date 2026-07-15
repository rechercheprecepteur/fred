// src/lib/server-api.ts
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Récupère le token depuis les cookies (côté serveur)
 */
export async function getServerToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');
    const token = tokenCookie?.value || null;
    console.log('🔍 Server Token from cookie:', !!token);
    return token;
  } catch (error) {
    console.error('❌ Erreur lecture cookie token:', error);
    return null;
  }
}

/**
 * Effectue une requête authentifiée depuis le serveur
 */
export async function serverFetch(
  endpoint: string, 
  options: RequestInit = {}
): Promise<any> {
  const token = await getServerToken();
  const url = `${API_URL}${endpoint}`;
  
  console.log(`📡 Server -> ${options.method || 'GET'} ${endpoint} - Token: ${!!token}`);
  
  const headers: Record<string, string> = {};
  
  // Ne pas mettre Content-Type pour FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  // Fusionner avec les headers existants
  if (options.headers) {
    const existingHeaders = options.headers as Record<string, string>;
    Object.assign(headers, existingHeaders);
  }
  
  // Ajouter le token d'authentification
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
      cache: 'no-store',
    });
    
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        throw {
          message: data.error || 'Une erreur est survenue',
          status: response.status,
          data
        };
      }
      
      return data;
    } else {
      const text = await response.text();
      console.error('❌ Réponse non-JSON du serveur:', text.substring(0, 200));
      throw { message: 'Erreur serveur', status: response.status };
    }
  } catch (error: any) {
    if (error.message && error.status) {
      throw error;
    }
    console.error('❌ Erreur fetch serveur:', error);
    throw { message: 'Erreur de connexion au serveur', status: 500 };
  }
}

/**
 * Upload de fichier depuis le serveur
 */
// export async function serverUpload(
//   endpoint: string,
//   formData: FormData
// ): Promise<any> {
//   const token = await getServerToken();
//   const url = `${API_URL}${endpoint}`;
  
//   const headers: Record<string, string> = {};
//   if (token) {
//     headers['Authorization'] = `Bearer ${token}`;
//   }
  
//   try {
//     const response = await fetch(url, {
//       method: 'PUT',
//       headers,
//       body: formData,
//       cache: 'no-store',
//     });
    
//     const data = await response.json();
//     if (!response.ok) throw { message: data.error, status: response.status };
//     return data;
//   } catch (error: any) {
//     if (error.message && error.status) throw error;
//     throw { message: 'Erreur lors de l\'upload', status: 500 };
//   }
// }
// src/lib/server-api.ts

// ... (autres fonctions inchangées)

/**
 * Upload de fichier depuis le serveur - VERSION CORRIGÉE
 */
export async function serverUpload(
  endpoint: string,
  formData: FormData,
  method: 'POST' | 'PUT' = 'POST' // ✅ Paramètre pour choisir la méthode
): Promise<any> {
  const token = await getServerToken();
  const url = `${API_URL}${endpoint}`;
  
  console.log(`📤 ServerUpload -> ${method} ${endpoint}`);
  console.log('  - Token présent:', !!token);
  console.log('  - FormData contient:', [...formData.entries()].map(([key, value]) => 
    `${key}: ${value instanceof File ? `File(${value.name}, ${value.size} bytes)` : value}`
  ));
  
  // ✅ NE PAS mettre Content-Type manuellement pour FormData
  // Le navigateur/fetch le fera automatiquement avec la bonne boundary
  const headers: Record<string, string> = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // ✅ Ajouter Accept pour s'assurer de recevoir du JSON
  headers['Accept'] = 'application/json';
  
  try {
    const response = await fetch(url, {
      method: method, // ✅ Utiliser la méthode spécifiée
      headers: headers,
      body: formData,
      cache: 'no-store',
      // ✅ Important: ne pas transformer le body
      duplex: 'half', // Pour Node.js 18+
    } as RequestInit);
    
    console.log('  - Status:', response.status);
    console.log('  - Content-Type:', response.headers.get('content-type'));
    
    // Vérifier si la réponse est du JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        console.error('  - Erreur réponse:', data);
        throw { 
          message: data.error || data.message || 'Erreur lors de l\'upload', 
          status: response.status,
          data 
        };
      }
      
      console.log('  - Upload réussi');
      return data;
    } else {
      const text = await response.text();
      console.error('  - Réponse non-JSON:', text.substring(0, 200));
      throw { message: 'Réponse serveur invalide', status: response.status };
    }
  } catch (error: any) {
    if (error.message && error.status) {
      throw error;
    }
    console.error('❌ Erreur upload:', error);
    throw { message: error.message || 'Erreur lors de l\'upload', status: 500 };
  }
}

// ... (reste inchangé)
/**
 * Définit le token dans les cookies (côté serveur)
 */
export async function setServerToken(token: string): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24, // 24 heures
      path: '/',
    });
    console.log('✅ Token défini dans les cookies serveur');
  } catch (error) {
    console.error('❌ Erreur définition cookie token:', error);
  }
}

/**
 * Supprime le token des cookies (côté serveur)
 */
export async function removeServerToken(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 0,
      path: '/',
    });
    console.log('✅ Token supprimé des cookies serveur');
  } catch (error) {
    console.error('❌ Erreur suppression cookie token:', error);
  }
}