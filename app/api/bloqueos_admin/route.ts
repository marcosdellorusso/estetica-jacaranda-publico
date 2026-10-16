// app/api/bloqueos_admin/route.ts

import { NextResponse } from 'next/server'
import { insertarBloqueo } from '@/db/queries/bloqueosAdmin'

export async function GET() {
  return NextResponse.json({ ok: true, message: 'Bloqueos Admin API funcionando' })
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const bloqueo = await insertarBloqueo(data)
    return NextResponse.json({ ok: true, bloqueo })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ ok: false, error: 'Error al insertar bloqueo' }, { status: 500 })
  }
}