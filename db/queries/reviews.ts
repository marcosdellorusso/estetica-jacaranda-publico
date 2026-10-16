import pool from '../index'

export async function getAllReviews() {
  const res = await pool.query(`
    SELECT
      id,
      usuario_dni,
      nombre,
      apellido,
      foto_url,
      estrellas,
      comentario,
      fecha
    FROM review
    ORDER BY fecha DESC
  `);
  return res.rows;
}

export async function createReview(data: {
  usuario_dni: string,
  nombre: string,
  apellido: string,
  foto_url: string,
  estrellas: number,
  comentario?: string
}) {
  await pool.query(`
    INSERT INTO review (usuario_dni, nombre, apellido, foto_url, estrellas, comentario)
    VALUES ($1, $2, $3, $4, $5, $6)
  `, [
    data.usuario_dni,
    data.nombre,
    data.apellido,
    data.foto_url,
    data.estrellas,
    data.comentario ?? null,
  ]);
}