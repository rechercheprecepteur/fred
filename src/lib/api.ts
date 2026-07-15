// // src/lib/api.ts
// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// class ApiClient {
//   private getTokenFromCookie(): string | null {
//     if (typeof document === 'undefined') return null;
//     const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
//     return match ? match[1] : null;
//   }

//   private getToken(): string | null {
//     // Essayer localStorage d'abord
//     if (typeof window !== 'undefined') {
//       const token = localStorage.getItem('excellence-token');
//       if (token) {
//         console.log('🔑 Token trouvé dans localStorage');
//         return token;
//       }
//     }
    
//     // Essayer les cookies
//     const cookieToken = this.getTokenFromCookie();
//     if (cookieToken) {
//       console.log('🔑 Token trouvé dans les cookies');
//       return cookieToken;
//     }
    
//     console.log('❌ Aucun token trouvé (ni localStorage ni cookies)');
//     return null;
//   }

//   private async request(endpoint: string, options: RequestInit = {}) {
//     const url = `${API_URL}${endpoint}`;
//     const token = this.getToken();
    
//     console.log(`📡 ${options.method || 'GET'} ${endpoint} - Token: ${!!token}`);
    
//     const headers: Record<string, string> = {};

//     // ✅ NE PAS mettre Content-Type pour FormData
//     if (!(options.body instanceof FormData)) {
//       headers['Content-Type'] = 'application/json';
//     }

//     // Fusionner avec les headers existants
//     if (options.headers) {
//       Object.assign(headers, options.headers);
//     }

//     // ✅ Ajouter le token dans le header Authorization
//     if (token) {
//       headers['Authorization'] = `Bearer ${token}`;
//     }

//     try {
//       const response = await fetch(url, {
//         ...options,
//         headers,
//         credentials: 'include', // Important pour les cookies
//       });

//       const contentType = response.headers.get('content-type');
//       if (contentType && contentType.includes('application/json')) {
//         const data = await response.json();
        
//         if (!response.ok) {
//           throw { 
//             message: data.error || 'Une erreur est survenue',
//             status: response.status 
//           };
//         }

//         return data;
//       } else {
//         const text = await response.text();
//         console.error('❌ Réponse non-JSON:', text.substring(0, 200));
//         throw { message: 'Erreur serveur', status: response.status };
//       }
//     } catch (error: any) {
//       if (error.message && error.status) throw error;
//       console.error('❌ Erreur API:', error);
//       throw { message: 'Erreur de connexion au serveur' };
//     }
//   }

//   get(endpoint: string) { 
//     return this.request(endpoint); 
//   }
  
//   post(endpoint: string, body?: any) { 
//     return this.request(endpoint, { 
//       method: 'POST', 
//       body: body ? JSON.stringify(body) : undefined 
//     }); 
//   }
  
//   put(endpoint: string, body?: any) { 
//     return this.request(endpoint, { 
//       method: 'PUT', 
//       body: body ? JSON.stringify(body) : undefined 
//     }); 
//   }
  
//   delete(endpoint: string) { 
//     return this.request(endpoint, { method: 'DELETE' }); 
//   }

//   async upload(endpoint: string, formData: FormData) {
//     const url = `${API_URL}${endpoint}`;
//     const token = this.getToken();
    
//     const headers: Record<string, string> = {};
//     if (token) {
//       headers['Authorization'] = `Bearer ${token}`;
//     }

//     const response = await fetch(url, {
//       method: 'PUT',
//       headers,
//       body: formData,
//       credentials: 'include',
//     });

//     const data = await response.json();
//     if (!response.ok) throw { message: data.error, status: response.status };
//     return data;
//   }
// }

// export const api = new ApiClient();



// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private getTokenFromCookie(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
    return match ? match[1] : null;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    // Essayer localStorage d'abord
    const token = localStorage.getItem('excellence-token');
    if (token) {
      console.log('🔑 Token trouvé dans localStorage');
      return token;
    }
    
    // Essayer les cookies
    const cookieToken = this.getTokenFromCookie();
    if (cookieToken) {
      console.log('🔑 Token trouvé dans les cookies');
      // Synchroniser avec localStorage
      localStorage.setItem('excellence-token', cookieToken);
      return cookieToken;
    }
    
    console.log('❌ Aucun token trouvé (ni localStorage ni cookies)');
    return null;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_URL}${endpoint}`;
    const token = this.getToken();
    
    console.log(`📡 ${options.method || 'GET'} ${endpoint} - Token: ${!!token}`);
    
    const headers: Record<string, string> = {};

    // ✅ NE PAS mettre Content-Type pour FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    // Fusionner avec les headers existants
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    // ✅ Ajouter le token dans le header Authorization
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Important pour les cookies
      });

      // Vérifier si le token a été rafraîchi dans la réponse
      const newToken = response.headers.get('X-New-Token');
      if (newToken && typeof window !== 'undefined') {
        localStorage.setItem('excellence-token', newToken);
        document.cookie = `token=${newToken}; path=/; max-age=86400; SameSite=Lax`;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        
        if (!response.ok) {
          // Si non autorisé, nettoyer le token
          if (response.status === 401 || response.status === 403) {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('excellence-token');
              document.cookie = 'token=; path=/; max-age=0';
            }
          }
          
          throw { 
            message: data.error || 'Une erreur est survenue',
            status: response.status,
            data
          };
        }

        return data;
      } else {
        const text = await response.text();
        console.error('❌ Réponse non-JSON:', text.substring(0, 200));
        throw { message: 'Erreur serveur', status: response.status };
      }
    } catch (error: any) {
      if (error.message && error.status) throw error;
      console.error('❌ Erreur API:', error);
      throw { message: 'Erreur de connexion au serveur', status: 500 };
    }
  }

  get(endpoint: string) { 
    return this.request(endpoint); 
  }
  
  post(endpoint: string, body?: any) { 
    return this.request(endpoint, { 
      method: 'POST', 
      body: body ? JSON.stringify(body) : undefined 
    }); 
  }
  
  put(endpoint: string, body?: any) { 
    return this.request(endpoint, { 
      method: 'PUT', 
      body: body ? JSON.stringify(body) : undefined 
    }); 
  }
  
  delete(endpoint: string) { 
    return this.request(endpoint, { method: 'DELETE' }); 
  }

  async upload(endpoint: string, formData: FormData) {
    const url = `${API_URL}${endpoint}`;
    const token = this.getToken();
    
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) throw { message: data.error, status: response.status };
      return data;
    } catch (error: any) {
      if (error.message && error.status) throw error;
      throw { message: 'Erreur lors de l\'upload', status: 500 };
    }
  }
}

export const api = new ApiClient();