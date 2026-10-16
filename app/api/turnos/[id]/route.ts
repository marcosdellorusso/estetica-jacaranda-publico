// app/api/turnos/[id]/route.ts
import { NextRequest } from 'next/server'
import { updateTurno, deleteTurno } from '@/db/queries/turnos'

export async function PUT(req: NextRequest, context: any) {
  const { id } = await context.params
  const body = await req.json()
  await updateTurno(Number(id), body)
  return new Response('Turno actualizado', { status: 200 })
}

export async function DELETE(_: NextRequest, context: any) {
  const { id } = await context.params
  await deleteTurno(Number(id))
  return new Response('Turno eliminado', { status: 200 })
}