// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'auth-token'

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true })
  
  response.cookies.delete(COOKIE_NAME)
  
  return response
}