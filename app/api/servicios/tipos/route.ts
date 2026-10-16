import { NextResponse } from "next/server"
import { getTiposServicioDisponibles } from "@/db/queries/servicios"

export async function GET() {
  try {
    const tipos = await getTiposServicioDisponibles()
    return NextResponse.json({ ok: true, tipos })
  } catch (error) {
    console.error("Error al obtener tipos de servicio:", error)
    return NextResponse.json({ ok: false, error: "Error interno del servidor" }, { status: 500 })
  }
}