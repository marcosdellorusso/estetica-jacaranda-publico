import pool from "../index";

export async function obtenerMesesFidelizacion(dni: string): Promise<number> {
  const result = await pool.query(
    "SELECT fecha FROM turnos WHERE dni_usuario = $1 AND estado = 'confirmado'",
    [dni]
  );

  const mesesUnicos = new Set(
    result.rows.map(turno => {
      const fecha = new Date(turno.fecha);
      return `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;
    })
  );

  return mesesUnicos.size;
}