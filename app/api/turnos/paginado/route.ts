import { NextRequest, NextResponse } from "next/server";
import { getTurnosConTotalFiltrados } from "@/db/queries/turnos";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const dni = searchParams.get("dni") || undefined;
  const fecha = searchParams.get("fecha") || undefined;

  if (isNaN(page) || isNaN(limit)) {
    return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
  }

  try {
    const data = await getTurnosConTotalFiltrados({ page, limit, dni, fecha });
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error al obtener turnos paginados:", err);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}