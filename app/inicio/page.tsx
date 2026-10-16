'use client'

import { useEffect } from 'react'
import InicioSection from './sections/InicioSection'
import TurnosSection from './sections/TurnosSection'
import FidelizacionSection from './sections/FidelizacionSection'
import TestimoniosSection from './sections/TestimoniosSection'
import DudasSection from './sections/DudasSection'
import { useSession } from "next-auth/react";

export default function HomeScroll() {
	const { data: session } = useSession();
	const userName = session?.user?.name;

  useEffect(() => {
    function scrollToHash() {
      if (window.location.hash) {
        const id = window.location.hash.substring(1)
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }

    scrollToHash()
    window.addEventListener('hashchange', scrollToHash)

    // --- NUEVO: actualizar el hash al scrollear ---
    const sections = ['inicio', 'turnos', 'fidelizacion', 'testimonios', 'dudas']
    const observer = new window.IntersectionObserver(
      (entries) => {
        // Entradas visibles
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) {
          // La más visible (mayor intersección)
          const topSection = visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
          const id = topSection.target.id
          // Solo actualiza si el hash no es el actual
          if (window.location.hash !== `#${id}`) {
            window.history.replaceState(null, '', `#${id}`)
          }
        }
      },
      {
        threshold: 0.5, // 50% visible para que cuente como activa
      }
    )
    sections.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => {
      window.removeEventListener('hashchange', scrollToHash)
      observer.disconnect()
    }
  }, [])

  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      <section className="h-screen snap-start" id="inicio">
        <InicioSection userName={userName!} />
      </section>
      <section className="h-screen snap-start" id="turnos">
        <TurnosSection />
      </section>
      <section className="h-screen snap-start" id="fidelizacion">
        <FidelizacionSection />
      </section>
      <section className="h-screen snap-start" id="testimonios">
        <TestimoniosSection />
      </section>
      <section className="h-screen snap-start" id="dudas">
        <DudasSection />
      </section>
    </div>
  )
}