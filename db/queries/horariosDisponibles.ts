import pool from '../index'
import { TurnoPosible } from '../../types/TurnoPosible'

/*
Esta función devuelve un arreglo de turnos disponibles para un tipo_servicio dado (unias, cejas o pestanas).
Tiene en cuenta:
  - La duración del servicio
  - Los horarios laborales configurados
  - Que los turnos comienzan a generarse a partir de pasado mañana hasta el viernes de la semana siguiente
  - Y que no estén ni tomados ni bloqueados por el admin

Devuelve un arreglo con objetos {fecha, hora} representando los turnos válidos.
*/
export async function generarTurnosPosibles(tipo_servicio: string) {
  const hoy = new Date() 
  hoy.setHours(0, 0, 0, 0)

  const desde = new Date(hoy)
  desde.setDate(desde.getDate() + 2) // pasado mañana

  const hasta = new Date(hoy)
  hasta.setDate(hasta.getDate() + 13) // viernes de la semana que viene

  const turnos: { fecha: string, hora: string }[] = []

  // 🔹 Obtener duración desde la tabla servicios
  const durRes = await pool.query(
    `SELECT duracion_min FROM servicios WHERE tipo_servicio = $1 LIMIT 1`,
    [tipo_servicio]
  )

  if (durRes.rowCount === 0) {
    throw new Error(`No se encontró duración para tipo_servicio = ${tipo_servicio}`)
  }

  const duracionMinutos = durRes.rows[0].duracion_min

  // 🔹 Obtener horarios laborales del servicio
  const res = await pool.query(
    `SELECT dia_semana, hora_inicio, hora_fin
     FROM horarios_laborales
     WHERE tipo_servicio = $1`,
    [tipo_servicio]
  )

  const laborales = res.rows // [{ dia_semana, hora_inicio, hora_fin }, ...]

  const diasPorNombre: Record<string, number> = {
    domingo: 0, lunes: 1, martes: 2, miercoles: 3,
    jueves: 4, viernes: 5, sabado: 6
  }

  for (let d = new Date(desde); d <= hasta; d.setDate(d.getDate() + 1)) {
    const diaJS = d.getDay()
    const diaNombre = Object.keys(diasPorNombre).find(k => diasPorNombre[k] === diaJS)

    const laboral = laborales.find(l => l.dia_semana === diaNombre)
    if (!laboral) continue

    const horaInicio = new Date(`2000-01-01T${laboral.hora_inicio}`)
    const horaFin = new Date(`2000-01-01T${laboral.hora_fin}`)
    const duracionMs = duracionMinutos * 60 * 1000

    for (
      let h = new Date(horaInicio);
      h.getTime() + duracionMs <= horaFin.getTime();
      h = new Date(h.getTime() + duracionMs)
    ) {
      const horaStr = h.toTimeString().slice(0, 5)
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      const fechaStr = `${year}-${month}-${day}`;
      turnos.push({ fecha: fechaStr, hora: horaStr })
    }
  }

  const turnosDisponibles = await filtrarTurnosDisponibles(turnos, tipo_servicio)
return turnosDisponibles.map(t => ({
  fecha: t.fecha,
  hora: t.hora
}))
}

/*Esto filtra los turnos posibles para que no estén tomados por otros clientes ni bloqueados por el admin.
ES UNA FUNCION AUXILIAR DE LA DE ARRIBA
*/

export async function filtrarTurnosDisponibles(turnos: TurnoPosible[], tipo_servicio: string): Promise<TurnoPosible[]> {
    if (turnos.length === 0) return []
  
    // Obtener fechas únicas para reducir el WHERE
    const fechas = Array.from(new Set(turnos.map(t => t.fecha)))
    
    const resTomados = await pool.query(//eso trae los turnos ya tomados por clientes en las fechas solicitadas
        `SELECT fecha, hora 
         FROM turnos 
         WHERE fecha = ANY($1::date[])
           AND tipo_servicio = $2`,
        [fechas, tipo_servicio]
      )
  
      const turnosTomados = new Set(
        resTomados.rows.map(r => {
          const fecha = r.fecha.toISOString().split('T')[0]
          const hora = typeof r.hora === 'string'
            ? r.hora.slice(0,5)
            : r.hora.toTimeString().slice(0,5)
          return `${fecha}T${hora}`
        })
      )
  
    // --- 2. Traer bloqueos del admin ---
    const resBloqueos = await pool.query(
      `SELECT fecha_inicio, fecha_fin, hora_inicio, hora_fin FROM bloqueos_admin
       WHERE tipo_servicio = $1`,
      [tipo_servicio]
    )
  
    // --- 3. Filtrar turnos ---
    const turnosFiltrados = turnos.filter(({ fecha, hora }) => {
      const clave = `${fecha}T${hora}`
  
      // Eliminar si ya está tomado
      if (turnosTomados.has(clave)) return false
  
      // Verificar si está bloqueado por el admin
      for (const b of resBloqueos.rows) {
        const estaEnFecha =
          fecha >= b.fecha_inicio.toISOString().split('T')[0] &&
          fecha <= b.fecha_fin.toISOString().split('T')[0]
  
        if (!estaEnFecha) continue
  
        const horaTurno = hora + ':00' // porque en la base debe estar con segundos
        if (horaTurno >= b.hora_inicio && horaTurno < b.hora_fin) {
          return false // turno bloqueado
        }
      }
  
      return true // turno válido
    })
  
    return turnosFiltrados
  }