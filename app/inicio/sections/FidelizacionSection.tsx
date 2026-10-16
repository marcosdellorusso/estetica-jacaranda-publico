import { useState } from "react";
import Image from "next/image";
import { FaHeart, FaGift } from "react-icons/fa";


const CORAZONES_TOTAL = 12;

const VIOLETA_CLARO = "#e8e6fa";
const VIOLETA_MEDIO = "#b8a2fa";
const VIOLETA_TEXT = "#5541a9";
const FLOR_TEXT = "#c4a5f8"; // Color para flores SVG

function FlorSVG({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width={28} height={28} fill="none" viewBox="0 0 28 28">
      <path
        d="M14 3 Q18 2 22 10 Q26 18 14 24 Q4 19 6 11 Q9 4 14 3Z"
        fill="none"
        stroke={FLOR_TEXT}
        strokeWidth={1.5}
      />
    </svg>
  );
}

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function FidelizacionSection() {
  const [corazonesLlenos, setCorazonesLlenos] = useState(0);
  const [modalAbierto, setModalAbierto] = useState<null | "fila1" | "fila2">(null);
  const { data: session } = useSession();
  const dni = session?.user?.dni;

  useEffect(() => {
    if (!dni) return;
    const fetchCorazones = async () => {
      try {
        const res = await fetch(`/api/turnos/meses_fidelizacion?dni=${dni}`);
        const json = await res.json();
        setCorazonesLlenos(json.corazonesLlenos || 0);
      } catch (error) {
        console.error("Error al obtener corazones:", error);
      }
    };
    fetchCorazones();
  }, [dni]);

  return (
    <section
      className="h-screen flex flex-col items-center py-4 overflow-y-auto"
      style={{ background: VIOLETA_CLARO }}
    >
      <div className="w-full flex flex-col items-center pt-4">
        {/* Tarjeta de fidelidad */}
        <div
          className="rounded-xl shadow-lg p-8 flex flex-col items-center relative"
          style={{ background: "#fff", border: `2px solid ${VIOLETA_MEDIO}` }}
        >
          <h2
            className="text-3xl font-serif mb-6 text-center"
            style={{ color: VIOLETA_TEXT }}
          >
            Tarjeta de fidelidad
          </h2>

          {/* Corazones en dos filas de 6 */}
          <div className="flex flex-col gap-4 mb-6">
            {[0, 1].map(row => (
              <div key={row} className="flex flex-row gap-4 justify-center">
                {Array.from({ length: 6 }).map((_, col) => {
                  const idx = row * 6 + col;
                  const lleno = corazonesLlenos > idx;
                  // El corazón 6 (idx 5) y 12 (idx 11) son presionables si están llenos
                  const esPremio = (idx === 5 && corazonesLlenos > 5) || (idx === 11 && corazonesLlenos > 11);

                  if (esPremio) {
                    return (
                      <button
                        key={idx}
                        className="relative group animate-pulse ring-2 ring-violet-400 rounded-full transition"
                        onClick={() => setModalAbierto(idx === 5 ? "fila1" : "fila2")}
                        aria-label="Ver premio"
                      >
                        <FaHeart size={42} color={VIOLETA_MEDIO} className="drop-shadow" />
                        <FaGift
                          size={20}
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-pink-400 animate-bounce"
                        />
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-violet-700 opacity-80 group-hover:opacity-100">
                          Ver premio
                        </span>
                      </button>
                    );
                  }
                  // Los corazones llenos normales (los dos previos a premio con regalito extra)
                  if (lleno) {
                    return (
                      <div key={idx} className="relative">
                        <FaHeart size={42} color={VIOLETA_MEDIO} className="drop-shadow" />
                        { 
                        }
                      </div>
                    );
                  }
                  // Corazones vacíos
                  return (
                    <FaHeart
                      key={idx}
                      size={42}
                      color="#e5e0f7"
                      className="opacity-60"
                      style={{ filter: "drop-shadow(0 2px 4px #d2cbef)" }}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          <p
            className="text-center text-lg mt-2"
            style={{ color: VIOLETA_TEXT }}
          >
            Estás a nada de llegar a tu objetivo...
            <br />
            No te imaginás los regalos que te esperan!
          </p>
        </div>

        {/* Sección superior */}
        <div className="relative w-full max-w-2xl mb-4 px-2">
          <div className="flex justify-center items-center mb-3 relative">
            <svg width="70" height="70" fill="none" viewBox="0 0 50 50">
              <path
                d="M25 7 Q35 5 43 19 Q50 31 30 42 Q20 48 10 34 Q0 21 15 13 Q23 8 25 7Z"
                fill={VIOLETA_CLARO}
                stroke={VIOLETA_MEDIO}
                strokeWidth="2"
              />
            </svg>
          </div>
          <h1
            className="text-4xl font-serif text-center mb-2"
            style={{ color: VIOLETA_TEXT }}
          >
            ¿Cómo funciona?
          </h1>
          <p className="text-xl text-center mb-3 font-semibold" style={{ color: VIOLETA_TEXT }}>
            Sumá visitas, sumá beneficios
          </p>
          <p className="text-center text-lg mb-1" style={{ color: VIOLETA_TEXT }}>
            Cada mes que te realizás un servicio, tachás corazones.
          </p>
          <p className="text-center text-lg" style={{ color: VIOLETA_TEXT }}>
            Al llegar a ciertos objetivos, te esperan premios y sorpresas.
          </p>
          {/* Líneas decorativas */}
          <svg
            className="absolute left-0 top-0"
            width="100"
            height="60"
            fill="none"
            viewBox="0 0 100 60"
          >
            <path
              d="M5,55 Q15,25 50,35 Q85,45 95,5"
              stroke={VIOLETA_MEDIO}
              strokeWidth="3"
              fill="none"
            />
          </svg>
          <svg
            className="absolute right-0 bottom-0"
            width="100"
            height="60"
            fill="none"
            viewBox="0 0 100 60"
          >
            <path
              d="M95,5 Q85,35 50,25 Q15,15 5,55"
              stroke={VIOLETA_MEDIO}
              strokeWidth="3"
              fill="none"
            />
          </svg>
        </div>
      </div>

      {/* Modal premio */}
      {modalAbierto && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
          onClick={() => setModalAbierto(null)}
        >
          <div
            className="relative flex flex-col items-center justify-center"
            onClick={e => e.stopPropagation()}
            style={{ minWidth: "82vw", maxWidth: 330, minHeight: 220 }}
          >
            {/* Fondo suave atrás del corazón */}
            <div
              className="absolute w-full h-full rounded-3xl"
              style={{
                background: "rgba(255,255,255,0.92)",
                boxShadow: "0 0 36px 8px #cabcf7",
                zIndex: 1,
              }}
            />
          
            {/* Contenido del premio */}
            <div
              className="relative flex flex-col items-center px-4 pt-8 pb-6"
              style={{
                zIndex: 3,
                width: "78vw",
                maxWidth: 295,
                minHeight: 160,
              }}
            >
              <h3
                className="text-3xl font-serif font-normal mb-5 text-center"
                style={{ color: VIOLETA_TEXT, letterSpacing: 2 }}
              >
                ¡LO LOGRASTE!
              </h3>
              <div className="flex flex-col items-center gap-3 mb-2">
                {(modalAbierto === "fila1"
                  ? [
                      "TÉ O CAFÉ",
                      "5% OFF EN TU SERVICIO",
                      "ARREGLO UÑAS QUEBRADAS",
                      "MASAJEADOR DE PIES"
                    ]
                  : [
                      "10% OFF EN TU SERVICIO",
                      "SPA DE MANOS CON MASAJEADOR DE PIES",
                      "SESIÓN DE DEPILACIÓN DEFINITIVA EN AXILAS",
                      "50% OFF SERVICIO CUMPLEAÑOS",
                      "PERFILADO DE CEJAS",
                    ]
                ).map((premio, i) => (
                  <div
                    key={i}
                    className="flex flex-row items-center justify-center gap-3"
                    style={{ width: "100%" }}
                  >
                    <Image
                      src="/images/pin.png"
                      width={i % 2 === 0 ? 24 : 32}
                      height={i % 2 === 0 ? 24 : 32}
                      alt="Flor decorativa"
                      className="inline-block"
                      style={{ minWidth: 20, minHeight: 20 }}
                    />
                    <span
                      className={`text-base font-serif`}
                      style={{
                        color: VIOLETA_TEXT,
                        textAlign: "center",
                        minWidth: "180px",
                      }}
                    >
                      {premio}
                    </span>
                    <Image
                      src="/images/pin.png"
                      width={i % 2 === 1 ? 24 : 32}
                      height={i % 2 === 1 ? 24 : 32}
                      alt="Flor decorativa"
                      className="inline-block"
                      style={{ minWidth: 20, minHeight: 20 }}
                    />
                  </div>
                ))}
              </div>
              <p className="text-center text-lg mt-3 font-serif" style={{ color: VIOLETA_TEXT }}>
                Seleccioná tu regalo y avisale a Ayni cuál escogiste
              </p>
              <button
                className="mt-4 px-4 py-2 bg-violet-200 hover:bg-violet-300 rounded font-semibold text-violet-900 mx-auto block"
                onClick={() => setModalAbierto(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}