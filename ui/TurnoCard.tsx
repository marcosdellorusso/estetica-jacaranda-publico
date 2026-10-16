'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Parisienne } from 'next/font/google'

const parisienne = Parisienne({
  subsets: ['latin'],
  weight: ['400'],
})

interface TurnoCardProps {
  titulo: string
  href: string
}

export default function TurnoCard({ titulo, href }: TurnoCardProps) {
  return (
    <Link href={href}>
      <div className="relative aspect-square p-3">
        {/* Tarjeta principal */}
        <div className="relative w-full h-full rounded-xl overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105 shadow-lg shadow-[#E636D4]/20 z-10">
          {/* Capa de vidrio */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center">
            <h3
              className={`${parisienne.className} text-4xl`}
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
              {titulo}
            </h3>
          </div>
        </div>

        {/* Imagen decorativa encima de todo */}
        <Image
          src="/images/esquinero.png"
          alt="Decoración esquinas"
          fill
          className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none z-20 scale-[1.15]"
        />
      </div>
    </Link>
  )
}