'use client'

import { useRouter } from 'next/navigation'

// Ajustá este número si querés mostrar más o menos preguntas en la vista resumida
const LIMITE_PREGUNTAS = 6

const preguntas = [
  { id: 'cuanto-duran-las-unas', texto: '¿Cuánto duran las uñas?' },
  { id: 'extra-por-strass', texto: '¿Se cobra extra por strass, diseños o brillo?' },
  { id: 'venir-con-esmalte', texto: '¿Puedo venir con esmalte puesto?' },
  { id: 'unas-cortas-o-mordidas', texto: '¿Se puede hacer sobre uñas cortas o mordidas?' },
  { id: 'duran-extensiones-pestanas', texto: '¿Cuánto duran las extensiones de pestañas?' },
  { id: 'mojar-pestanas', texto: '¿Puedo mojar las pestañas después del servicio?' },
  { id: 'cuidados-extensiones', texto: '¿Qué cuidados debo tener después de ponerme extensiones?' },
  { id: 'maquillarme-despues', texto: '¿Puedo maquillarme después del servicio?' },
  { id: 'es-doloroso', texto: '¿Es doloroso?' },
  { id: 'cuantas-sesiones', texto: '¿Cuántas sesiones necesito?' },
  { id: 'verano', texto: '¿Se puede hacer durante el verano?' },
  { id: 'rasurarme', texto: '¿Debo rasurarme antes del turno?' },
  { id: 'vello-rubio-blanco', texto: '¿Puedo hacerme si tengo vello rubio, blanco o canoso?' },
  { id: 'entre-sesiones', texto: '¿Cuánto tiempo tiene que pasar entre sesiones?' },
  { id: 'depilacion-menstruacion', texto: '¿Puedo hacerme depilación si estoy con la menstruación?' },
  { id: 'edad-minima', texto: '¿Hay edad mínima para hacerse depilación definitiva?' },
]

export default function DudasPage() {
  const router = useRouter()
  const preguntasAMostrar = preguntas.slice(0, LIMITE_PREGUNTAS)
  const hayMas = preguntas.length > LIMITE_PREGUNTAS

  return (
    <section id="dudas" className="h-screen relative flex flex-col">
      {/* Fondo */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[url('/images/fondo-jacaranda.png')] bg-cover bg-center opacity-60" />
      </div>

      {/* Preguntas */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start px-4 gap-3 mt-5">
        <div className="w-full flex flex-col items-center mt-4 mb-2">
          <h1
            className="text-2xl sm:text-3xl font-bold text-center mb-2"
            style={{
              fontFamily: "'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif",
              color: '#7C56AA',
              letterSpacing: '0.02em',
            }}
          >
            Dudas Frecuentes
          </h1>
        </div>
        <div className="w-full max-w-sm flex flex-col gap-3">
          {preguntasAMostrar.map((p) => (
            <button
              key={p.id}
              onClick={() => router.push(`/dudas#${p.id}`)}
              className="w-full py-3 px-4 bg-white/80 border border-[#e0b6fa] rounded-xl
              text-base sm:text-lg font-bold transition hover:bg-fuchsia-100 active:scale-95"
              style={{
                color: "#7C56AA",
                fontFamily: "'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif",
                boxShadow: "0 1px 8px #fff4"
              }}
            >
              {p.texto}
            </button>
          ))}
          {hayMas && (
            <button
              onClick={() => router.push('/dudas')}
              className="w-full py-3 px-4 bg-[#8B4EEB] rounded-xl text-base sm:text-lg font-bold mt-2 shadow-md transition hover:bg-[#A084CA] active:scale-95"
              style={{
                color: "#fff",
                fontFamily: "'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif",
                boxShadow: "0 2px 12px #8B4EEB33"
              }}
            >
              Ver más preguntas
            </button>
          )}
        </div>
      </div>
    </section>
  )
}