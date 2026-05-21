// lib/auth.ts - Utilitaire simple pour le stockage local
'use client'

const AUTH_KEY = 'edu_platform_user'

export interface StoredUser {
  id: string
  username: string
  email: string
  role: string
  genre: string
  photo_profil: string | null
}

export function saveUser(user: StoredUser): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user))
  }
}

export function getUser(): StoredUser | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(AUTH_KEY)
    if (data) {
      try {
        return JSON.parse(data)
      } catch {
        return null
      }
    }
  }
  return null
}

export function removeUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY)
  }
}

export function isAuthenticated(): boolean {
  return getUser() !== null
}