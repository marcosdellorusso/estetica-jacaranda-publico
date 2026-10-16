// db/queries/servicios.ts
import pool from '../index'

export async function getAllServicios() {
  try {
    console.log('Conectando a la DB...')
    const res = await pool.query('SELECT * FROM servicios ORDER BY id ASC')
    console.log('Servicios obtenidos:', res.rows)
    return res.rows
  } catch (error) {
    console.error('ERROR EN getAllServicios:', error)
    throw error // importante: para que el route.ts lo capture y devuelva 500
  }
}

export async function getServiciosByTipo(tipo: string) {
  try {
    const res = await pool.query(
      'SELECT * FROM servicios WHERE tipo_servicio = $1 ORDER BY id ASC',
      [tipo]
    )
    return res.rows
  } catch (error) {
    console.error('ERROR EN getServiciosByTipo:', error)
    throw error
  }
}

export async function getServicioById(id: number) {
  const res = await pool.query('SELECT * FROM servicios WHERE id = $1', [id])
  return res.rows[0]
}

export async function getNombreById(id: number) {
  const res = await pool.query('SELECT nombre FROM servicios WHERE id = $1', [id])
  return res.rows[0]?.nombre
}

export async function createServicio(data: {
  nombre: string
  tipo_servicio: string
  descripcion?: string
  precio: number
  imagen_url?: string
  duracion_min?: number
}) {
  const { nombre, tipo_servicio, descripcion, precio, imagen_url, duracion_min } = data
  await pool.query(
    `INSERT INTO servicios (nombre, tipo_servicio, descripcion, precio, imagen_url, duracion_min)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [nombre, tipo_servicio, descripcion, precio, imagen_url, duracion_min]
  )
}

export async function updateServicio(id: number, data: Partial<{
  nombre: string
  tipo_servicio: string
  descripcion: string
  precio: number
  imagen_url: string
  duracion_min: number
  activo: boolean
}>) {
  const keys = Object.keys(data)
  const values = Object.values(data)

  if (keys.length === 0) return

  const set = keys.map((k, i) => `${k} = $${i + 1}`).join(', ')
  const sql = `UPDATE servicios SET ${set} WHERE id = $${keys.length + 1}`

  await pool.query(sql, [...values, id])
}

export async function deleteServicio(id: number) {
  await pool.query('DELETE FROM servicios WHERE id = $1', [id])
}



export async function getTiposServicioDisponibles() {
  try {
    const res = await pool.query(
      `SELECT DISTINCT tipo_servicio
       FROM servicios
       ORDER BY tipo_servicio ASC`
    );
    return res.rows.map(row => row.tipo_servicio);
  } catch (error) {
    console.error('ERROR EN getTiposServicioDisponibles:', error);
    throw error;
  }
}

export async function getServiciosByTipoPaginado(tipo: string, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const serviciosRes = await pool.query(
    'SELECT * FROM servicios WHERE tipo_servicio = $1 ORDER BY id ASC LIMIT $2 OFFSET $3',
    [tipo, limit, offset]
  );
  const totalRes = await pool.query(
    'SELECT COUNT(*) FROM servicios WHERE tipo_servicio = $1',
    [tipo]
  );
  return {
    servicios: serviciosRes.rows,
    total: parseInt(totalRes.rows[0].count, 10)
  };
}