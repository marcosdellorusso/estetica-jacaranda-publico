// app/api/turnos/confirmados/route.ts
import { getTurnosConfirmadosByUsuario } from '@/db/queries/turnos'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  
  if (!session?.user?.dni) {
    return Response.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const turnos = await getTurnosConfirmadosByUsuario(session.user.dni)
    return Response.json({ turnos })
  } catch (error) {
    console.error('Error al obtener turnos confirmados:', error)
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
