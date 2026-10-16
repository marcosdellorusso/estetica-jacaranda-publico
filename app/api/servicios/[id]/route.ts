import { NextRequest } from 'next/server'
import { updateServicio, deleteServicio } from '@/db/queries/servicios'

export async function PUT(req: NextRequest, context: any) {
  const { id } = await context.params
  const body = await req.json()
  await updateServicio(Number(id), body)
  return new Response('Servicio actualizado', { status: 200 })
}

export async function DELETE(_: NextRequest, context: any) {
  const { id } = context.params
  await deleteServicio(Number(id))
  return new Response('Servicio eliminado', { status: 200 })
}