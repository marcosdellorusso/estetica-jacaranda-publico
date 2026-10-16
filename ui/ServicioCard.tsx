'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ServicioCardProps {
  titulo: string
  descripcion: string
  imagen: string
  precio: number
  duracion: number
  tipo_servicio: string
  servicio_id: number
}

export default function ServicioCard({ titulo, descripcion, imagen, precio, duracion, tipo_servicio,servicio_id }: ServicioCardProps) {
  const [abierto, setAbierto] = useState(false)
  const imagenSinCache = `${imagen}?t=${Date.now()}`
  const router = useRouter()

  const irAlCalendario = () => {
    router.push(`/turnos/${tipo_servicio}/calendario?servicio_id=${servicio_id}`)
  }

  return (
    <div
      className={`flex flex-col transition-all duration-500 ease-in-out w-full mx-auto max-w-xs sm:max-w-md md:max-w-lg ${
        abierto ? 'mb-10' : 'mb-20'
      }`}
    >
      {/* OVALO HORIZONTAL */}
      <div
        onClick={irAlCalendario}
        className="cursor-pointer bg-white overflow-hidden shadow-md w-full h-48 sm:h-56 md:h-64 rounded-[50%/40%] relative z-10"
      >
        <img
          src={imagenSinCache}
          alt={titulo}
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h3
            className="text-2xl sm:text-3xl text-center font-bold"
            style={{
              fontFamily: "'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif",
              color: '#fff',
              WebkitTextStroke: '0.7px #222',
              textShadow: `
                0 3px 16px #000c,
                0 1px 4px #000b,
                0 0px 1px #fff
              `,
              letterSpacing: '0.02em',
            }}
          >
            {titulo}
            <span
              className="inline-block align-middle ml-2"
              style={{
                fontFamily: "'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif",
                color: '#fff',
                WebkitTextStroke: '0.7px #222',
                textShadow: `
                  0 3px 16px #000c,
                  0 1px 4px #000b,
                  0 0px 1px #fff
                `,
                fontSize: '1.4rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                lineHeight: 1,
              }}
            >
              →
            </span>
          </h3>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setAbierto(!abierto)
          }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2
            bg-white/20 border-2 border-white/70
            px-4 py-1.5 rounded-full shadow-md
            transition-all duration-200
            hover:bg-white/50 active:scale-95
            z-20 flex items-center"
          style={{
            fontFamily: "'Trebuchet MS', 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Tahoma, sans-serif",
            color: '#fff',
            fontWeight: 700,
            fontSize: '15px',
            WebkitTextStroke: '0.7px #222',
            textShadow: `
              0 3px 16px #000c,
              0 1px 4px #000b,
              0 0px 1px #fff
            `,
            letterSpacing: '0.02em',
          }}
        >
          {abierto ? 'Ocultar' : 'Detalles'}
        </button>
      </div>

      {/* DESCRIPCIÓN UNIDA AL OVALO */}
      <div
        className={`bg-pink-100 text-purple-900 rounded-b-[2rem] overflow-hidden shadow-inner w-full transition-all duration-500 ease-in-out px-6 text-justify ${
          abierto ? 'max-h-[500px] pt-24 opacity-100 py-6' : 'max-h-0 opacity-0 py-0'
        }`}
        style={{
          marginTop: '-4rem',
          borderTopLeftRadius: abierto ? '0' : '1.5rem',
          borderTopRightRadius: abierto ? '0' : '1.5rem',
        }}
      >
        <p className="text-[15px] leading-relaxed mb-2">{descripcion}</p>
        <p className="text-fuchsia-600 font-bold">$ {precio}</p>
        <p className="text-gray-500 italic">Duración: {duracion} min</p>
      </div>
    </div>
  )
}