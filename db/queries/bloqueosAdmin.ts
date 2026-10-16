import pool from '../index'

export async function insertarBloqueo({
  fecha_inicio,
  hora_inicio,
  hora_fin,
  fecha_fin,
  tipo_servicio
}: {
  fecha_inicio: string
  hora_inicio: string
  hora_fin: string
  fecha_fin: string
  tipo_servicio: string
}) {
  const result = await pool.query(
    `INSERT INTO bloqueos_admin (fecha_inicio, hora_inicio, hora_fin, fecha_fin, tipo_servicio)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [fecha_inicio, hora_inicio, hora_fin, fecha_fin, tipo_servicio]
  )

  return result.rows[0]
}