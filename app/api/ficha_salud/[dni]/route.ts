// app/api/ficha-salud/[dni]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFichaSaludByDni, updateFichaSaludByDni,deleteFichaSaludByDni } from '@/db/queries/fichaSalud';

export async function GET(req: NextRequest, context: any) {
  const { dni } = await context.params;
  // Buscar ficha por dni_usuario en la base
  const ficha = await getFichaSaludByDni(dni);
  if (ficha) {
    return NextResponse.json(ficha);
  } else {
    return NextResponse.json(null); // O status 404 si preferís
  }
}

export async function PUT(req: NextRequest, context: any) {
  const { dni } = context.params;
  const data = await req.json();
  try {
    await updateFichaSaludByDni(dni, data);
    return NextResponse.json({ message: 'Ficha actualizada' });
  } catch (error) {
    return NextResponse.json({ message: 'Error al actualizar ficha', error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: any) {
  const { dni } = context.params;
  try {
    await deleteFichaSaludByDni(dni);
    return NextResponse.json({ message: 'Ficha eliminada' });
  } catch (error) {
    return NextResponse.json({ message: 'Error al eliminar ficha', error }, { status: 500 });
  }
}