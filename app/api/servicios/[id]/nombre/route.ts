import { NextRequest, NextResponse } from 'next/server';
import { getNombreById } from '@/db/queries/servicios';

export async function GET(req: NextRequest, context: any) {
  const { id } =  await context.params;
  const nombre = await getNombreById(Number(id));
  return NextResponse.json({ nombre });
}