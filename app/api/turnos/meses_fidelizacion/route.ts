import { NextResponse } from "next/server";
import { obtenerMesesFidelizacion } from "@/db/queries/mesesFidelizacion";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dni = searchParams.get("dni");

  if (!dni) {
    return NextResponse.json({ error: "Falta el DNI" }, { status: 400 });
  }

  try {
    const cantidad = await obtenerMesesFidelizacion(dni);
    return NextResponse.json({ corazonesLlenos: cantidad });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al consultar turnos" }, { status: 500 });
  }
}