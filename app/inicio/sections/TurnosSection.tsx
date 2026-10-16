import TurnoCard from '@/ui/TurnoCard'

const servicios = [
  { titulo: 'Uñas', ruta: '/turnos/unias' },
  { titulo: 'Cejas', ruta: '/turnos/cejas' },
  { titulo: 'Pestañas', ruta: '/turnos/pestanas' },
  { titulo: 'Depilación', ruta: '/turnos/depilacion' },
]

export default function TurnosSection() {
  return (
    <section id="turnos" className="h-screen relative">
      {/* Imagen de fondo con opacidad */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[url('/images/fondo-jacaranda.png')] bg-cover bg-center opacity-60" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <div className="grid grid-cols-2 gap-4 w-full max-w-md aspect-[4/3] mt-[-40px]">
          {servicios.map((s, idx) => (
            <TurnoCard key={idx} titulo={s.titulo} href={s.ruta} />
          ))}
        </div>
      </div>
    </section>
  )
}