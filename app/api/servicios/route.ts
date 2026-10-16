// app/api/servicios/route.ts
import { createServicio, getAllServicios, getServiciosByTipo } from '@/db/queries/servicios'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')

    if (tipo) {
      const servicios = await getServiciosByTipo(tipo)
      return NextResponse.json(servicios)
    }

    const servicios = await getAllServicios()
    return NextResponse.json(servicios)
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    await createServicio(body)
    return new NextResponse('Servicio creado', { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear servicio' }, { status: 500 })
  }
}