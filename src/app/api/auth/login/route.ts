import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-tres-long-et-complexe'
const COOKIE_NAME = 'auth-token'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    // 1. Vérifier l'utilisateur
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // 2. Vérifier le mot de passe
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // 3. Vérifier l'email
    if (!user.email_verified) {
      const { password: _, verification_token, verification_code, ...userWithoutPassword } = user
      return NextResponse.json(
        { 
          error: 'Veuillez vérifier votre adresse email avant de vous connecter.',
          code: 'EMAIL_NOT_VERIFIED',
          user: userWithoutPassword
        },
        { status: 403 }
      )
    }

    // 4. Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // 5. Préparer les données utilisateur (sans le mot de passe)
    const { password: _, verification_token, verification_code, verification_token_expires, reset_password_token, reset_password_code, reset_password_expires, ...userData } = user

    // 6. Charger les infos précepteur si nécessaire
    let precepteurInfo = null
    if (user.role === 'precepteur') {
      const { data: precepteur } = await supabase
        .from('precepteurs')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (precepteur) {
        // Récupérer les matières
        const { data: matiereIds } = await supabase
          .from('precepteur_matieres')
          .select('matiere_id')
          .eq('precepteur_id', precepteur.id)

        const matieres: { id: any; nom: any; niveau: any }[] = []
        if (matiereIds && matiereIds.length > 0) {
          const ids = matiereIds.map(m => m.matiere_id)
          const { data: matieresData } = await supabase
            .from('matieres')
            .select('id, nom, niveau')
            .in('id', ids)

          matieres.push(...(matieresData || []))
        }

        precepteurInfo = {
          ...precepteur,
          precepteur_matieres: matiereIds?.map(mi => ({
            matiere_id: mi.matiere_id,
            matiere: matieres.find(m => m.id === mi.matiere_id) || null
          })) || []
        }
      }
    }

    // 7. Créer la réponse avec le cookie
    const response = NextResponse.json({
      success: true,
      user: userData,
      precepteurInfo
    })

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 jours
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la connexion' },
      { status: 500 }
    )
  }
}