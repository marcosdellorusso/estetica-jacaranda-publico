import { NextRequest, NextResponse } from 'next/server';
import { createFichaSalud } from '@/db/queries/fichaSalud';

export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    await createFichaSalud(data);
    return NextResponse.json({ message: 'Ficha de salud creada' }, { status: 201 });
  } catch (error) {
    console.error("Error al guardar ficha:", error);
    return NextResponse.json({ message: 'Error al guardar ficha', error: error?.toString?.() ?? error }, { status: 500 });
  }
}