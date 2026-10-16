// db/queries/turnos.ts
import pool from '../index'

export async function getTurnosByUsuario(dni_usuario: string) {
const res = await pool.query(
	`SELECT
		t.id AS turno_id,
		t.dni_usuario,
		t.fecha,
		t.hora,
		t.estado,
		s.nombre AS servicio,
		s.tipo_servicio,
		s.precio
	FROM turnos t
	JOIN servicios s ON t.servicio_id = s.id
	WHERE t.dni_usuario = $1 AND t.estado = 'pendiente'`,
	[dni_usuario]
)
  return res.rows
}

export async function getAllTurnos() {
  const res = await pool.query('SELECT * FROM turnos ORDER BY fecha, hora ASC')
  return res.rows
}

export async function getTurnoById(id: number) {
  const res = await pool.query('SELECT * FROM turnos WHERE id = $1', [id])
  return res.rows[0]
}

export async function createTurno(data: {
  dni_usuario: string,
  fecha: string,
  hora: string,
  estado?: string,
  tipo_servicio: string,
  servicio_id: number
}) {
  const {
    dni_usuario,
    fecha,
    hora,
    estado = 'pendiente',
    tipo_servicio,
    servicio_id
  } = data

  await pool.query(
    `INSERT INTO turnos (dni_usuario, fecha, hora, estado, tipo_servicio, servicio_id)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [dni_usuario, fecha, hora, estado, tipo_servicio, servicio_id]
  )
}

export async function updateTurno(id: number, data: Partial<{
  usuario_dni: string
  servicio_id: number
  fecha: string
  hora: string
  estado: string
}>) {
  const keys = Object.keys(data)
  const values = Object.values(data)

  if (keys.length === 0) return

  const set = keys.map((k, i) => `${k} = $${i + 1}`).join(', ')
  const sql = `UPDATE turnos SET ${set} WHERE id = $${keys.length + 1}`

  await pool.query(sql, [...values, id])
}

// Elimina un turno por su ID
export async function deleteTurno(id: number) {
  await pool.query('DELETE FROM turnos WHERE id = $1', [id])
}

// Elimina todos los turnos de un usuario por su DNI
export async function deleteTurnosByUsuario(dni_usuario: string) {
  await pool.query('DELETE FROM turnos WHERE dni_usuario = $1', [dni_usuario]);
}

// Obtiene una página de turnos ordenados por fecha y hora ASC
// page: número de página (1-indexed)
// limit: cantidad de turnos por página
export async function getTurnosPaginados(page: number, limit: number) {
  const offset = (page - 1) * limit;
  const res = await pool.query(
    'SELECT * FROM turnos ORDER BY fecha, hora ASC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  return res.rows;
}

// Devuelve el total de turnos registrados (para paginación)
export async function countTurnos() {
  const res = await pool.query('SELECT COUNT(*) FROM turnos');
  return parseInt(res.rows[0].count, 10);
}

// Obtiene turnos de una fecha específica, paginados
export async function getTurnosByFecha(fecha: string, page: number, limit: number) {
  const offset = (page - 1) * limit;
  const res = await pool.query(
    'SELECT * FROM turnos WHERE fecha = $1 ORDER BY hora ASC LIMIT $2 OFFSET $3',
    [fecha, limit, offset]
  );
  return res.rows;
}

// Cuenta la cantidad de turnos en una fecha específica
export async function countTurnosByFecha(fecha: string) {
  const res = await pool.query('SELECT COUNT(*) FROM turnos WHERE fecha = $1', [fecha]);
  return parseInt(res.rows[0].count, 10);
}

export async function getTurnosConTotal(page: number, limit: number) {
  const [turnos, total] = await Promise.all([
    getTurnosPaginados(page, limit),
    countTurnos()
  ])

  return {
    turnos,
    total
  }

  
}

export async function getTurnosConTotalFiltrados({ page = 1, limit = 10, dni, fecha }: { page: number, limit: number, dni?: string, fecha?: string }) {
  const offset = (page - 1) * limit;
  let filtros: string[] = [];
  let valores: any[] = [];
  let countFiltros: string[] = [];
  let countValores: any[] = [];

  if (dni) {
    filtros.push(`dni_usuario = $${valores.length + 1}`);
    valores.push(dni);
    countFiltros.push(`dni_usuario = $${countValores.length + 1}`);
    countValores.push(dni);
  }
  if (fecha) {
    filtros.push(`fecha = $${valores.length + 1}`);
    valores.push(fecha);
    countFiltros.push(`fecha = $${countValores.length + 1}`);
    countValores.push(fecha);
  }

  let where = filtros.length ? `WHERE ${filtros.join(" AND ")}` : "";

  const resTurnos = await pool.query(
    `SELECT * FROM turnos ${where} ORDER BY fecha, hora ASC LIMIT $${valores.length + 1} OFFSET $${valores.length + 2}`,
    [...valores, limit, offset]
  );
  const resTotal = await pool.query(
    `SELECT COUNT(*) FROM turnos ${where}`,
    countValores
  );
  return {
    turnos: resTurnos.rows,
    total: parseInt(resTotal.rows[0].count, 10)
  };
}

// Cambia el estado de todos los turnos pendientes de un usuario a 'confirmado'
export async function confirmarTurnosByUsuario(dni_usuario: string) {
  await pool.query("UPDATE turnos SET estado = 'confirmado' WHERE dni_usuario = $1 AND estado = 'pendiente'", [dni_usuario]);
}

// Obtiene turnos confirmados por usuario
export async function getTurnosConfirmadosByUsuario(dni_usuario: string) {
  const res = await pool.query(
    `SELECT
      t.id AS turno_id,
      t.dni_usuario,
      t.fecha,
      t.hora,
      t.estado,
      s.nombre AS servicio,
      s.tipo_servicio,
      s.precio
    FROM turnos t
    JOIN servicios s ON t.servicio_id = s.id
    WHERE t.dni_usuario = $1 AND t.estado = 'confirmado'
    ORDER BY t.fecha DESC, t.hora DESC`,
    [dni_usuario]
  )
  return res.rows
}