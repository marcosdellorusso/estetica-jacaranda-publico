// app/api/turnos/route.ts
import { getAllTurnos, createTurno, getTurnosPaginados, countTurnos, getTurnoById, getTurnosByFecha, countTurnosByFecha, getTurnosByUsuario } from '@/db/queries/turnos'

// Función auxiliar para asegurar formato 'YYYY-MM-DD'
function mapFechas(turnos: any[]) {
  return turnos.map(t => ({
    ...t,
    fecha: typeof t.fecha === 'string'
      ? t.fecha.slice(0, 10)
      : (t.fecha && t.fecha.getFullYear
          ? `${t.fecha.getFullYear()}-${(t.fecha.getMonth() + 1).toString().padStart(2,'0')}-${t.fecha.getDate().toString().padStart(2,'0')}`
          : t.fecha)
  }))
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const dni = searchParams.get('dni');
  const fecha = searchParams.get('fecha');

  // Si hay filtro por DNI y por fecha, filtrar ambos
  if (dni && fecha) {
    const turnos = await getTurnosByUsuario(dni);
    // Filtrar por fecha en el array
    const filtrados = turnos.filter(t => {
      // t.fecha puede ser Date o string, normalizar a yyyy-mm-dd
      const fechaTurno = (typeof t.fecha === 'string')
        ? t.fecha.slice(0, 10)
        : `${t.fecha.getFullYear()}-${(t.fecha.getMonth() + 1).toString().padStart(2, '0')}-${t.fecha.getDate().toString().padStart(2, '0')}`;
      return fechaTurno === fecha;
    });
    const total = filtrados.length;
    const paginados = filtrados.slice((page - 1) * limit, page * limit);
    return Response.json({ turnos: mapFechas(paginados), total });
  }

  // Si hay filtro por DNI, buscar turnos de ese usuario paginados
  if (dni) {
    const { getTurnosByUsuario } = await import('@/db/queries/turnos');
    const turnos = await getTurnosByUsuario(dni);
    // Paginación manual sobre el array
    const total = turnos.length;
    const paginados = turnos.slice((page - 1) * limit, page * limit);
    return Response.json({ turnos: mapFechas(paginados), total });
  }

  // Si hay filtro por fecha, buscar turnos de esa fecha paginados
  if (fecha) {
    const [turnos, total] = await Promise.all([
      getTurnosByFecha(fecha, page, limit),
      countTurnosByFecha(fecha),
    ]);
    return Response.json({ turnos: mapFechas(turnos), total });
  }

  // Sin filtros: paginación normal
  const [turnos, total] = await Promise.all([
    getTurnosPaginados(page, limit),
    countTurnos(),
  ]);

  return Response.json({ turnos: mapFechas(turnos), total });
}

export async function POST(req: Request) {
  const body = await req.json()
  await createTurno(body)
  return new Response('Turno creado', { status: 201 })
}