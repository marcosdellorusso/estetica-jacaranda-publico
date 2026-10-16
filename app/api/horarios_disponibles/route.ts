import { NextResponse } from 'next/server'
import { generarTurnosPosibles } from '@/db/queries/horariosDisponibles'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const tipo_servicio = searchParams.get('tipo_servicio')

  if (!tipo_servicio) {
    return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })
  }

  const T = await generarTurnosPosibles(tipo_servicio)

  return NextResponse.json({ turnos: T })
}