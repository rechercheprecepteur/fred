// app/api/precepteur/info/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-tres-long-et-complexe'
const COOKIE_NAME = 'auth-token'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }

    if (!decoded) {
      return NextResponse.json(
        { error: 'Session expirée' },
        { status: 401 }
      )
    }

    // Récupérer les infos précepteur
    const { data: precepteur, error: precepteurError } = await supabase
      .from('precepteurs')
      .select('*')
      .eq('user_id', decoded.userId)
      .single()

    if (precepteurError) {
      if (precepteurError.code === 'PGRST116') {
        return NextResponse.json({
          success: true,
          precepteurInfo: null
        })
      }
      throw precepteurError
    }

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

    const precepteurInfo = {
      ...precepteur,
      precepteur_matieres: matiereIds?.map(mi => ({
        matiere_id: mi.matiere_id,
        matiere: matieres.find(m => m.id === mi.matiere_id) || null
      })) || []
    }

    return NextResponse.json({
      success: true,
      precepteurInfo
    })

  } catch (error) {
    console.error('Get precepteur info error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}