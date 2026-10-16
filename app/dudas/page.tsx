'use client'
import { useRouter } from 'next/navigation'
import styles from './page.module.css';

const preguntas = [
    {
      id: 'cuanto-duran-las-unas',
      texto: '¿Cuánto duran las uñas?',
      respuesta:
        'Depende del cuidado personal, pero suelen durar más de 3 semanas. No es recomendable dejarlas más de un mes para evitar que se quiebren o generen hongos.',
    },
    {
      id: 'extra-por-strass',
      texto: '¿Se cobra extra por strass, diseños o brillo?',
      respuesta:
        'No, todos nuestros servicios incluyen lo que elijas. El precio no cambia por más decoración que quieras.',
    },
    {
      id: 'venir-con-esmalte',
      texto: '¿Puedo venir con esmalte puesto?',
      respuesta:
        'Sí, pero avisanos antes si traés uñas hechas de otro lugar para organizar mejor tu turno. El retirado de otro colegas tiene un costo adicional, pero trabajos de Estética Jacarandá no.',
    },
    {
      id: 'unas-cortas-o-mordidas',
      texto: '¿Se puede hacer sobre uñas cortas o mordidas?',
      respuesta:
        '¡Sí! En esos casos recomendamos capping o soft gel para reforzarlas y ayudar a que crezcan. Te asesoramos cuál es mejor para vos.',
    },
    {
      id: 'duran-extensiones-pestanas',
      texto: '¿Cuánto duran las extensiones de pestañas?',
      respuesta:
        'Entre 2 y 3 semanas en buen estado. Luego, se recomienda un retoque para mantenerlas prolijas.',
    },
    {
      id: 'mojar-pestanas',
      texto: '¿Puedo mojar las pestañas después del servicio?',
      respuesta:
        'Con lifting, después de 24 hs. Con extensiones, recomendamos evitar el agua directa las primeras 48 hs.',
    },
    {
      id: 'cuidados-extensiones',
      texto: '¿Qué cuidados debo tener después de ponerme extensiones?',
      respuesta:
        'No frotarte los ojos, no usar productos oleosos ni máscaras a prueba de agua, y peinarlas suavemente cada día.',
    },
    {
      id: 'maquillarme-despues',
      texto: '¿Puedo maquillarme después del servicio?',
      respuesta:
        'Con lifting, sí. Con extensiones, se recomienda evitar máscaras de pestañas y desmaquillantes oleosos.',
    },
    {
      id: 'es-doloroso',
      texto: '¿Es doloroso?',
      respuesta:
        'La mayoría de las personas siente solo calor o pequeños pinchacitos, es muy tolerable.',
    },
    {
      id: 'cuantas-sesiones',
      texto: '¿Cuántas sesiones necesito?',
      respuesta:
        'En promedio, entre 6 y 10 sesiones. Pero puede variar según cada cuerpo y zona tratada.',
    },
    {
      id: 'verano',
      texto: '¿Se puede hacer durante el verano?',
      respuesta:
        'Sí, pero con cuidados específicos: sin tomar sol antes ni después del turno y usando protector solar siempre.',
    },
    {
      id: 'rasurarme',
      texto: '¿Debo rasurarme antes del turno?',
      respuesta:
        'Sí, la zona debe estar rasurada con cuchilla 24 a 48 hs antes. No cera, pinza ni depiladora eléctrica.',
    },
    {
      id: 'vello-rubio-blanco',
      texto: '¿Puedo hacerme si tengo vello rubio, blanco o canoso?',
      respuesta:
        'Depende del tipo de tecnología, pero en general el láser no actúa bien en vellos muy claros. Lo evaluamos en la consulta previa.',
    },
    {
      id: 'entre-sesiones',
      texto: '¿Cuánto tiempo tiene que pasar entre sesiones?',
      respuesta:
        'Entre 30 y 45 días, según el crecimiento del vello y la zona tratada.',
    },
    {
      id: 'depilacion-menstruacion',
      texto: '¿Puedo hacerme depilación si estoy con la menstruación?',
      respuesta:
        'Sí, pero en zonas íntimas deberías usar tampón o copa. Si estás muy sensible, se puede reprogramar.',
    },
    {
      id: 'edad-minima',
      texto: '¿Hay edad mínima para hacerse depilación definitiva?',
      respuesta:
        'Sí. A partir de que las niñas se hagan señoritas y siempre acompañadas con autorización de un adulto responsable.',
    },
  ]
  
export default function DudasCompletaPage() {
  const router = useRouter();
  return (
    <section className="min-h-screen relative py-8">
      {/* Fondo de imagen con opacidad */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[url('/images/fondo-jacaranda.png')] bg-cover bg-center opacity-60" />
      </div>
      <div className="relative z-10">
        <div className="max-w-lg mx-auto px-4 mt-14">
          {/* Botón de volver */}
          <div className="fixed top-6 left-4 z-30 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl shadow-lg shadow-[#E636D4]/20 p-2">
            <button
              onClick={() => router.push('/inicio/#dudas')}
              aria-label="Volver"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#7C56AA"
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
          <div className="flex flex-col gap-10">
            <h1
              className={`${styles['h1-dudas']} text-2xl sm:text-3xl font-bold text-center mb-4`}
            >
              Dudas Frecuentes
            </h1>
            {/* Mapa de ubicación */}
            <div key={"ubicacion"} className="scroll-mt-28">
              <h2 id='ubicacion' className={`${styles['h2-dudas']} text-base sm:text-lg font-bold mb-2`}>
                ¿Dónde queda la estética?
              </h2>
              <div className="w-full rounded-xl overflow-hidden shadow-lg border border-fuchsia-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3111.444491730515!2d-62.27491758844049!3d-38.75350798821107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95edbd2f338cd721%3A0xa789f04d4ca46e5f!2sEstados%20Unidos%202360%2C%20B8000ABR%20Bah%C3%ADa%20Blanca%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1751927878097!5m2!1ses!2sar"
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación Estética Jacarandá"
                />
              </div>
            </div>
            {preguntas.map((p) => (
              <div key={p.id} id={p.id} className="scroll-mt-28">
                <h2 className={`${styles['h2-dudas']} text-base sm:text-lg font-bold mb-2`}>
                  {p.texto}
                </h2>
                <p className="text-base text-gray-800 bg-white/70 rounded-lg p-4 shadow-sm">{p.respuesta}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}