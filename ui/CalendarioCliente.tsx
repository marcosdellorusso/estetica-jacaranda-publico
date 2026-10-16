'use client'
import { TurnoPosible } from '../types/TurnoPosible'
import { CalendarioClienteHandle } from '../types/CalendarioCliente'


// Tipo de props utilizadas por el componente
export interface CalendarioClienteProps {
  tipo_servicio: string
  servicio_id: number
  onVistaChange?: (vista: string) => void
}

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

const CalendarioCliente = forwardRef<CalendarioClienteHandle, CalendarioClienteProps>(
  function CalendarioCliente({ tipo_servicio, servicio_id, onVistaChange }, ref) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const today = new Date()
  const [vista, setVista] = useState<'meses' | 'dias' | 'horas'>('meses')
  const anioActual = new Date().getFullYear()
  const [mesSeleccionado, setMesSeleccionado] = useState<number | null>(null)
  const [diaSeleccionado, setDiaSeleccionado] = useState<number | null>(null)
  const [turnosDisponibles, setTurnosDisponibles] = useState<TurnoPosible[]>([])
  const [mesesDisponibles, setMesesDisponibles] = useState<Set<number>>(new Set())
  const [diasDisponibles, setDiasDisponibles] = useState<Set<number>>(new Set())
  const [horariosDelDia, setHorariosDelDia] = useState<string[]>([])
  const [nombreServicioEspecifico, setNombreServicioEspecifico] = useState('');
  const [showCompletarFicha, setShowCompletarFicha] = useState(false)
  const [chequeandoFicha, setChequeandoFicha] = useState(true) // para evitar flicker

  // Nuevo estado para el cartel/modal de confirmación
  const [horaAConfirmar, setHoraAConfirmar] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState<string>('')

  // Nuevo estado para el modal de agradecimiento y la info del turno reservado
  const [showGracias, setShowGracias] = useState(false)
  const [infoTurno, setInfoTurno] = useState<{ servicio: string; fecha: string; hora: string } | null>(null)

  

  useEffect(() => {
    const fetchTurnos = async () => {
      const res = await fetch(`/api/horarios_disponibles?tipo_servicio=${tipo_servicio}`)
      const json = await res.json()
      const data: TurnoPosible[] = json.turnos
      setTurnosDisponibles(data)

      const mesesSet = new Set<number>()
      data.forEach(({ fecha }) => {
        const [anio, mes, dia] = fecha.split('-').map(Number)
        const fechaObj = new Date(anio, mes - 1, dia)
        mesesSet.add(fechaObj.getMonth())
      })
      setMesesDisponibles(mesesSet)
    }

    fetchTurnos()
  }, [tipo_servicio])

  useEffect(() => {
    const fetchNombre = async () => {
      const res = await fetch(`/api/servicios/${servicio_id}/nombre`);
      if (res.ok) {
        const { nombre } = await res.json();
        setNombreServicioEspecifico(nombre);
      }
    };
    console.log('servicio_id:', servicio_id);
console.log('nombreServicioEspecifico:', nombreServicioEspecifico);
    if (servicio_id) {
      fetchNombre();
    }
  }, [servicio_id]);

  useEffect(() => {
    const verificarFichaSalud = async () => {
      if (
        session?.user?.dni &&
        tipo_servicio !== "unias" &&
        tipo_servicio !== "cejas" &&
        tipo_servicio !== "pestanas"
      ) {
        try {
          const res = await fetch(`/api/ficha_salud/${session.user.dni}`);
          if (res.ok) {
            const data = await res.json();
            if (!data || Object.keys(data).length === 0) {
              setShowCompletarFicha(true);
            }
          } else {
            setShowCompletarFicha(true);
          }
        } catch {
          setShowCompletarFicha(true);
        }
      }
      setChequeandoFicha(false);
    };

    if (status === "authenticated") {
      verificarFichaSalud();
    } else {
      setChequeandoFicha(false);
    }
  }, [session, status, tipo_servicio]);
  
  const cambiarVista = (nuevaVista: 'meses' | 'dias' | 'horas') => {
    setVista(nuevaVista);
    if (onVistaChange) {
      onVistaChange(nuevaVista);
    }
  }

  const manejarSeleccionMes = (mes: number) => {
    setMesSeleccionado(mes)
    cambiarVista('dias')

    const diasSet = new Set<number>()
    turnosDisponibles.forEach(({ fecha }) => {
      const [anio, mesF, diaF] = fecha.split('-').map(Number)
      const f = new Date(anio, mesF - 1, diaF)
      if (f.getMonth() === mes) {
        diasSet.add(f.getDate())
      }
    })
    setDiasDisponibles(diasSet)
  }

  const manejarSeleccionDia = (dia: number) => {
    setDiaSeleccionado(dia)
    cambiarVista('horas')

    const horarios = turnosDisponibles
      .filter(({ fecha }) => {
        const [anio, mesF, diaF] = fecha.split('-').map(Number)
        const f = new Date(anio, mesF - 1, diaF)
        return f.getMonth() === mesSeleccionado && f.getDate() === dia
      })
      .map(t => t.hora)

    setHorariosDelDia(horarios)
  }

  // MODIFICADO: cuando selecciona una hora, mostrar modal/cartel de confirmación
  const manejarSeleccionHora = (hora: string) => {
    setHoraAConfirmar(hora)
    setMensaje('')
  }

  // Cuando confirma el turno:
  const confirmarTurno = async () => {
    if (!session?.user?.dni) {
      setMensaje('No se pudo obtener el usuario. Iniciá sesión nuevamente.')
      return
    }
    if (
      mesSeleccionado === null ||
      diaSeleccionado === null ||
      !horaAConfirmar
    ) {
      setMensaje('Error de datos seleccionados.')
      return
    }

    const fecha = new Date(anioActual, mesSeleccionado, diaSeleccionado)
    const fechaISO = fecha.toISOString().slice(0, 10) // yyyy-mm-dd

    const body = {
      dni_usuario: session.user.dni,
      fecha: fechaISO,
      hora: horaAConfirmar,
      estado: 'pendiente',
      tipo_servicio, // viene por props
      servicio_id// completá con otros campos si tu endpoint lo pide
    }

    const res = await fetch('/api/turnos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      setMensaje('¡Turno reservado con éxito!')
      setInfoTurno({ servicio: nombreServicioEspecifico, fecha: fechaISO, hora: horaAConfirmar })
      setHoraAConfirmar(null)
      setShowGracias(true)
      // Si querés, redirigí o refrescá turnos disponibles
    } else {
      setMensaje('No se pudo reservar el turno. Probá otra vez.')
    }
  }

  const cancelarConfirmacion = () => {
    setHoraAConfirmar(null)
    setMensaje('')
  }

  // --- Función para volver atrás según la vista actual ---
  const volver = () => {
    if (vista === 'horas') {
      cambiarVista('dias');
      setHoraAConfirmar(null);
    } else if (vista === 'dias') {
      cambiarVista('meses');
      setDiaSeleccionado(null);
    }
    // Si la vista es 'meses', no hace nada.
    // Si se quisiera volver al selector de servicios, se podría usar router.back() aquí.
  }

  useImperativeHandle(ref, () => ({
    volver
  }));

  const renderModalCompletarFicha = () => {
    if (!showCompletarFicha) return null;

    const handleIrAFicha = () => {
      router.push('/ficha_salud');
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
          <h2 className="text-lg font-bold text-purple-700 mb-3">Completar ficha de salud</h2>
          <p className="text-[#7C56AA] mb-4">Para reservar este tipo de servicio, es necesario completar la ficha de salud.</p>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold shadow"
            onClick={handleIrAFicha}
          >
            Completar ficha de salud
          </button>
        </div>
      </div>
    )
  }

  const renderModalGracias = () => {
    if (!showGracias || !infoTurno) return null;

    const handleIrAPagar = () => {
      // Redirigir a la página de carrito en vez de pago
      router.push('/carrito');
    };

    const handleAgregarOtro = () => {
      // Redirigir a la sección de selección de servicios
      router.push('/inicio#turnos');
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-2xl shadow-2xl max-w-xs w-full p-6 text-center">
          <h2 className="text-lg font-bold text-purple-700 mb-3">¡Gracias por reservar!</h2>
          <p className="text-[#7C56AA] mb-2 font-semibold">Servicio: {infoTurno.servicio}</p>
          <p className="text-[#7C56AA] mb-2">Fecha: {infoTurno.fecha}</p>
          <p className="text-[#7C56AA] mb-4">Hora: <span className="font-bold">{infoTurno.hora}</span></p>
          <div className="flex justify-center gap-3 mt-4">
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold shadow"
              onClick={handleIrAPagar}
            >
              Ir al carrito
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 text-purple-700 px-4 py-2 rounded-xl font-semibold"
              onClick={handleAgregarOtro}
            >
              Agregar otro servicio
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderVistaMeses = () => (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {meses.map((mes, idx) => {
        const disponible = mesesDisponibles.has(idx)
        return (
          <button
            key={mes}
            disabled={!disponible}
            className={`py-6 text-lg font-medium rounded-lg shadow-md transition-all ${
              disponible
                ? 'bg-white text-purple-600 hover:bg-purple-50'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            onClick={() => disponible && manejarSeleccionMes(idx)}
          >
            {mes}
          </button>
        )
      })}
    </div>
  )

  const renderVistaDias = () => {
    const primerDia = new Date(anioActual, mesSeleccionado!, 1)
    const ultimoDia = new Date(anioActual, mesSeleccionado! + 1, 0)
    const diasEnMes = ultimoDia.getDate()
    const primerDiaSemana = primerDia.getDay()
    const celdasVacias = Array(primerDiaSemana).fill(null)
    const dias = Array.from({ length: diasEnMes }, (_, i) => i + 1)

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 text-center font-semibold text-sm sm:text-base text-purple-900">
          {diasSemana.map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {celdasVacias.map((_, i) => <div key={`vacio-${i}`} />)}
          {dias.map(dia => {
            const disponible = diasDisponibles.has(dia)
            return (
              <button
                key={dia}
                disabled={!disponible}
                onClick={() => disponible && manejarSeleccionDia(dia)}
                className={`rounded shadow text-sm sm:text-base w-full aspect-square flex items-center justify-center transition-all ${
                  disponible
                    ? 'bg-white text-purple-700 hover:bg-purple-50'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {dia}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const renderVistaHoras = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-center text-xl font-semibold mb-2 text-purple-900">
          {`${diaSeleccionado} de ${meses[mesSeleccionado!]} ${anioActual}`}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {horariosDelDia.map(hora => (
            <button
              key={hora}
              className="bg-white rounded py-3 shadow text-purple-700 text-sm sm:text-base"
              onClick={() => manejarSeleccionHora(hora)}
            >
              {hora}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Modal/Cartel de confirmación:
  const renderModalConfirmacion = () => {
    if (!horaAConfirmar || mesSeleccionado === null || diaSeleccionado === null) return null

    const fechaMostrada = `${diaSeleccionado} de ${meses[mesSeleccionado]} ${anioActual}`

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-2xl shadow-2xl max-w-xs w-full p-6 text-center">
          <h2 className="text-lg font-bold text-purple-700 mb-3">Confirmar turno</h2>
          <p className="text-[#7C56AA] mb-2 font-semibold">
  Servicio de {nombreServicioEspecifico}
</p>
          <p className="text-[#7C56AA] mb-2">{fechaMostrada}</p>
          <p className="text-[#7C56AA] mb-2">Hora: <span className="font-bold">{horaAConfirmar}</span></p>
          <div className="flex justify-center gap-3 mt-4">
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold shadow"
              onClick={confirmarTurno}
            >
              Confirmar
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 text-purple-700 px-4 py-2 rounded-xl font-semibold"
              onClick={cancelarConfirmacion}
            >
              Cancelar
            </button>
          </div>
          {mensaje && (
            <p className="mt-3 text-sm text-purple-600">{mensaje}</p>
          )}
        </div>
      </div>
    )
  }

  const variants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-purple-100 rounded-xl shadow-xl min-h-[600px] relative">
      {renderModalCompletarFicha()}
      {renderModalGracias()}
      {renderModalConfirmacion()}
      {!showCompletarFicha && !chequeandoFicha && (
      <AnimatePresence mode="wait">
        {vista === 'meses' && (
          <motion.div
            key="meses"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {renderVistaMeses()}
          </motion.div>
        )}
        {vista === 'dias' && (
          <motion.div
            key="dias"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {renderVistaDias()}
          </motion.div>
        )}
        {vista === 'horas' && (
          <motion.div
            key="horas"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {renderVistaHoras()}
          </motion.div>
        )}
      </AnimatePresence>
      )}
    </div>
  )
  }
)

export default CalendarioCliente;