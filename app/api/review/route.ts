import { createReview, getAllReviews } from '@/db/queries/reviews'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Si querés filtros, agregá aquí
    const reviews = await getAllReviews()
    return NextResponse.json(reviews)
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    await createReview(body)
    return new NextResponse('Review creada', { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear review' }, { status: 500 })
  }
}