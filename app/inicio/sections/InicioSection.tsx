'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const PUBLICIDADES = [
  '/images/publicidad-1.jpeg',
  '/images/publicidad-2.png',
  // ...
]

type Props = {
  userName?: string;
};

export default function InicioSection({ userName }: Props) {
  const [webpKey, setWebpKey] = useState(0)
  const [showLogoImage, setShowLogoImage] = useState(false)
  const [publiIdx, setPubliIdx] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const jumpRef = useRef(false) // <-- para controlar el salto

  // Para el loop infinito: agregamos el primer slide al final
  const SLIDES = [...PUBLICIDADES, PUBLICIDADES[0]]

  // Start auto-slide
  useEffect(() => {
    setWebpKey(Date.now())
    const timerLogo = setTimeout(() => setShowLogoImage(true), 2000)

    function nextSlide() {
      setPubliIdx((prev) => prev + 1)
      setIsTransitioning(true)
    }
    intervalRef.current = setInterval(nextSlide, 2500)

    return () => {
      clearTimeout(timerLogo)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  // Efecto para el salto invisible al primer slide real
  useEffect(() => {
    if (publiIdx === SLIDES.length - 1) {
      // Después de la transición al slide duplicado, saltamos al real
      const timeout = setTimeout(() => {
        setIsTransitioning(false)
        setPubliIdx(0)
        jumpRef.current = true
      }, 700)
      return () => clearTimeout(timeout)
    }
    // Cuando se resetea a 0, desactiva el flag de salto después de renderizar
    if (publiIdx === 0 && jumpRef.current) {
      // Forzamos el reflow para evitar transición en el salto
      requestAnimationFrame(() => {
        setIsTransitioning(true)
        jumpRef.current = false
      })
    }
  }, [publiIdx, SLIDES.length])

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start pt-20 z-10">
      {/* Fondo con overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/fondologin.png"
          alt="Fondo"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[6px]" />
      </div>

      {/* Logo animado */}
      <div className="w-[300px] aspect-[1080/450] relative mb-4">
        <img
          key={webpKey}
          src={`/videos/logo-frames.webp?v=${webpKey}`}
          alt="Logo animado"
          className="absolute inset-0 w-full h-full object-contain"
        />
        {showLogoImage && (
          <Image
            src="/images/Logo.png"
            alt="Logo"
            fill
            className="object-contain absolute inset-0 transition-opacity duration-500"
            priority
          />
        )}
      </div>

      {/* Descripción nueva con fondo translúcido y decoración floral */}
      <div className="relative max-w-md w-full mx-auto text-center mb-0 px-6">
        <div className="flex justify-center my-2">
          <div className="w-16 border-t border-fuchsia-400 rounded-full"></div>
        </div>
        <div className="bg-black/30 backdrop-blur-md rounded-2xl px-4 py-4">
          <p className="text-lg text-white font-semibold mb-2">
            ¡Hola{' '}
            <span className="text-fuchsia-400 font-bold">
              {userName ? userName : 'Usuario'}
            </span>
            !
			<br />
				Soy Aynara Varela
          </p>
          <p className="text-base text-white/90 mb-2">
            Me dedico con pasión al mundo de la estética desde 2017. Manicura, lashista y operadora matriculada en depilación definitiva, formada y perfeccionada para ofrecerte un servicio de calidad, cuidado y confianza
          </p>
          <p className="text-lg font-bold text-fuchsia-300 mb-0">
            ¡Reservá tu turno y empezá a brillar!
          </p>

        </div>
      </div>

      {/* Slider de Publicidades con loop infinito corregido */}
      <div className="relative overflow-hidden h-48 mt-8 w-[calc(100vw-40px)] mx-auto">
        <div
          className={`flex ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
          style={{
            width: `${SLIDES.length * 100}%`,
            transform: `translateX(-${publiIdx * (100 / SLIDES.length)}%)`,
          }}
        >
          {SLIDES.map((img, i) => (
            <div key={i} className="h-48 relative flex-shrink-0 w-[calc(100vw-40px)]">
              <Image
                src={img}
                alt={`Publicidad ${i + 1}`}
                fill
                className="object-cover"
                style={{ objectPosition: 'center' }}
                priority={i === 0}
              />
            </div>
          ))}
        </div>
        {/* Puntos indicadores */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
          {PUBLICIDADES.map((_, i) => (
            <span
              key={i}
              className={`inline-block w-2 h-2 rounded-full ${i === (publiIdx === SLIDES.length - 1 ? 0 : publiIdx) ? 'bg-[#E636D4]' : 'bg-white/30'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}