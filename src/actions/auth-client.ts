// À utiliser côté client pour gérer le localStorage
export const authClient = {
  setSession(token: string, user: any) {
    localStorage.setItem('auth-token', token)
    localStorage.setItem('auth-user', JSON.stringify(user))
  },

  getSession(): { token: string | null; user: any } {
    const token = localStorage.getItem('auth-token')
    const user = localStorage.getItem('auth-user')
    return {
      token,
      user: user ? JSON.parse(user) : null
    }
  },

  clearSession() {
    localStorage.removeItem('auth-token')
    localStorage.removeItem('auth-user')
  }
}
