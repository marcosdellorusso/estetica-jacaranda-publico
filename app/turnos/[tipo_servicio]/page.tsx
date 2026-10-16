'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ServicioCard from '@/ui/ServicioCard'
import { Parisienne } from 'next/font/google'

const parisienne = Parisienne({
  subsets: ['latin'],
  weight: ['400'],
})

interface Servicio {
  id: number
  nombre: string
  tipo_servicio: string
  descripcion: string
  precio: number
  imagen_url?: string
  duracion_min?: number
}

export default function TurnoCategoriaPage() {
  useEffect(() => {
  }, [])

  const [servicios, setServicios] = useState<Servicio[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  const router = useRouter()
  const tipo_servicio = String(params?.tipo_servicio || '')

  const SKELETON_COUNT = 3

  useEffect(() => {
    setIsLoading(true)
    fetch(`/api/servicios?tipo=${tipo_servicio}`)
      .then((res) => res.json())
      .then((data) => {
        setServicios(data)
        setIsLoading(false)
      })
  }, [tipo_servicio])


  let tituloPagina = ''
  if (tipo_servicio === 'unias') tituloPagina = 'Uñas'
  else if (tipo_servicio === 'cejas') tituloPagina = 'Cejas'
  else if (tipo_servicio === 'pestanas') tituloPagina = 'Pestañas'
  else if (tipo_servicio === 'depilacion') tituloPagina = 'Depilación Definitiva'
  else if (tipo_servicio === 'combos-hombre') tituloPagina = 'Combos para Hombre'
  else if (tipo_servicio === 'combos-mujer') tituloPagina = 'Combos para Mujer'
  else if (tipo_servicio === 'zonas-individuales') tituloPagina = 'Zonas de Depilación Individuales'
  else tituloPagina = tipo_servicio.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[url('/images/fondo-jacaranda.png')] bg-cover bg-center bg-fixed bg-no-repeat" />
      </div>
      <div className="fixed top-6 left-4 z-30 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl shadow-lg shadow-[#E636D4]/20 p-2">
        <button
          onClick={() => router.push('/inicio/#turnos')}
          aria-label="Volver"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#8B4EEB"
            strokeWidth={2}
            width={28}
            height={28}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>
      <div className="relative z-10 p-6 pb-28 w-full max-w-5xl mx-auto text-white">
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl shadow-lg shadow-[#E636D4]/20 flex items-center justify-center py-8 px-8 w-full max-w-xl mx-auto mb-10 mt-8">
          <h1
            className={`${parisienne.className} text-5xl sm:text-6xl font-normal text-center`}
            style={{
              color: '#8B4EEB',
              textShadow: `
                0 0 3px #fff,
                0 0 6px #fff,
                0 0 9px #fff,
                0 0 12px #fff
              `,
            }}
          >
            {tituloPagina}
          </h1>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <div
                key={index}
                className="w-full max-w-3xl h-32 bg-gray-300 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : servicios.length === 0 ? (
          <p className="text-gray-400">No hay servicios de esta categoría disponibles.</p>
        ) : (
          <div className="flex flex-col items-center gap-4 sm:gap-6 transition-all duration-500 ease-in-out">
            {servicios.map((s) => (
              <ServicioCard
                key={s.id}
                titulo={s.nombre}
                descripcion={s.descripcion}
                imagen={s.imagen_url ?? ''}
                precio={s.precio}
                duracion={s.duracion_min ?? 0}
                tipo_servicio={tipo_servicio}
                servicio_id={s.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}