// app/api/auth/me/route.ts
import { NextResponse } from 'next/server'
import { getCurrentUser } from '../../../actions/auth'

export async function GET() {
  try {
    const result = await getCurrentUser()
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}