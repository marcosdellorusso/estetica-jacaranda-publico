import { NextRequest, NextResponse } from 'next/server';
import pool from '@/db/index';

export async function GET(req: NextRequest, context: any) {
  const { dni } = await context.params;

  try {
    const result = await pool.query(
      `SELECT nombre, apellido FROM usuarios WHERE dni = $1 LIMIT 1`,
      [dni]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    const usuario = result.rows[0];
    return NextResponse.json(usuario);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}