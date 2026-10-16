import { NextRequest, NextResponse } from "next/server";
import { getServiciosByTipoPaginado } from "@/db/queries/servicios";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const tipo = searchParams.get("tipo");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  if (!tipo) {
    return NextResponse.json({ error: "Falta tipo de servicio" }, { status: 400 });
  }

  try {
    const { servicios, total } = await getServiciosByTipoPaginado(tipo, page, limit);
    return NextResponse.json({ servicios, total });
  } catch (err) {
    return NextResponse.json({ error: "Error en la base de datos" }, { status: 500 });
  }
}