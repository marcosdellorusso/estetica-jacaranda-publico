import Link from "next/link";

export default function DepilacionIntroPage() {
  return (
    <>
      <Link
        href="/inicio/#turnos"
        className="fixed top-6 left-4 z-30 p-3"
        aria-label="Volver"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.5 22L10 14L18.5 6"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
      <div
        className="relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url(/images/maquina-fondo.png)" }}
      >
        {/* Capa negra translúcida */}
        <div className="absolute inset-0 bg-black bg-opacity-65 z-0" />

        {/* Contenido por encima del fondo */}
        <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-4 pt-16 text-white">
          {/* Descripción */}
          <div className="max-w-2xl text-center mb-8 mt-8 px-4">
            <h1 className="text-3xl font-bold mb-4">Depilación definitiva</h1>
            <p className="text-lg">
              La depilación definitiva es una tecnología avanzada de Soprano Ice Platinum que elimina el vello no deseado de forma prolongada y efectiva, brindándote una piel suave y libre de irritaciones. Utilizo tecnología especializada que actúa directamente sobre el folículo piloso, reduciendo el crecimiento del vello de manera gradual hasta lograr resultados duraderos. Además, es apta para distintas zonas del cuerpo y tipos de piel, siempre con un cuidado personalizado y profesional.
            </p>
          </div>

          {/* Botones */}
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <Link href="/turnos/combos-hombre">
              <button className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
                Combos Hombres
              </button>
            </Link>
            <Link href="/turnos/combos-mujer">
              <button className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
                Combos Mujeres
              </button>
            </Link>
            <Link href="/turnos/zonas-individuales">
              <button className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
                Zonas Individuales
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}