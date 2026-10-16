import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import pool from '@/db/index';

function validarDni(dni: string) {
  return /^\d{8}$/.test(dni);
}

function validarNombreApellido(str: string) {
  return /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(str.trim());
}

export async function POST(req: NextRequest) {
  try {
    const { dni, nombre, apellido, password, rol } = await req.json();
    const nombreTrim = (nombre || "").trim();
    const apellidoTrim = (apellido || "").trim();
    const rolValido = (rol === "admin" || rol === "usuario" || rol === "user") ? (rol === "user" ? "usuario" : rol) : "usuario";
    console.log('DNI:', dni, 'Nombre:', nombreTrim, 'Apellido:', apellidoTrim);
    if (!dni || !nombreTrim || !apellidoTrim || !password) {
      return NextResponse.json({ error: "Faltan campos" }, { status: 400 });
    }
    if (!validarDni(dni)) {
      return NextResponse.json({ error: "El DNI debe ser numérico y tener 8 dígitos." }, { status: 400 });
    }
    if (!validarNombreApellido(nombreTrim)) {
      return NextResponse.json({ error: "El nombre solo puede contener letras y espacios." }, { status: 400 });
    }
    if (!validarNombreApellido(apellidoTrim)) {
      return NextResponse.json({ error: "El apellido solo puede contener letras y espacios." }, { status: 400 });
    }
    // Verificar si el usuario ya existe
    const { rows: existing } = await pool.query('SELECT dni FROM usuarios WHERE dni = $1', [dni]);
    if (existing.length > 0) {
      return NextResponse.json({ error: "Ya existe un usuario con ese DNI" }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO usuarios (dni, nombre, apellido, password, rol) VALUES ($1, $2, $3, $4, $5)',
      [dni, nombreTrim, apellidoTrim, hashedPassword, rolValido]
    );
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 });
  }
}