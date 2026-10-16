'use client';

import React, { useState, useEffect } from 'react';
import CardPregunta from '@/ui/CardPregunta';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import type { FichaSaludForm } from '@/types/FichaSaludForm';

 const preguntasFichaSalud = [
    {
      key: "enfermedad_diagnosticada",
      label: "¿Tenés alguna enfermedad diagnosticada?",
      tieneDetalle: true,
      placeholder: undefined,
    },
    {
      key: "toma_medicacion",
      label: "¿Tomás medicación actualmente?",
      tieneDetalle: true,
      placeholder: undefined,
    },
    {
      key: "antecedente_cancer",
      label: "¿Tenés antecedentes de cáncer o tratamiento oncológico?",
      tieneDetalle: true,
      placeholder: undefined,
    },
    {
      key: "problemas_hormonales",
      label: "¿Problemas hormonales o estás en tratamiento hormonal?",
      tieneDetalle: true,
      placeholder: undefined,
    },
    {
      key: "enfermedad_piel",
      label: "¿Enfermedad de la piel? (psoriasis, dermatitis, vitiligo, etc.)",
      tieneDetalle: true,
      placeholder: undefined,
    },
    {
      key: "marcapasos_implantes_protesis",
      label: "¿Tenés marcapasos, implantes metálicos o prótesis?",
      tieneDetalle: true,
      placeholder: undefined,
    },
    {
      key: "tiene_tatuajes",
      label: "¿Tenés tatuajes?",
      tieneDetalle: true,
      placeholder: "¿Dónde?",
    },
    {
      key: "lunares_cicatrices_manchas",
      label: "¿Tenés lunares, cicatrices o manchas en las zonas a tratar?",
      tieneDetalle: true,
      placeholder: "¿Dónde?",
    },
    {
      key: "considera_piel_sensible",
      label: "¿Tuviste lesiones previas en piel sensible? (quemaduras, ampollas, etc.)",
      tieneDetalle: false,
    },
    {
      key: "usa_protector_solar",
      label: "¿Usás protector solar?",
      tieneDetalle: false,
    },
    {
      key: "primera_vez_depilacion_definitiva",
      label: "¿Es la primera vez que te realizás depilación definitiva?",
      tieneDetalle: true,
      placeholder: "¿Dónde/cuándo?",
    },
    {
      key: "metodo_depilacion_anterior",
      label: "¿Qué método de depilación utilizabas antes de comenzar con la definitiva?",
      tieneDetalle: true,
      placeholder: undefined,
    },
    {
      key: "embarazo_lactancia",
      label: "¿Estás embarazada o en período de lactancia?",
      tieneDetalle: false,
    },
    {
      key: "problemas_cardiacos_hipertension",
      label: "¿Tenés problemas cardíacos o hipertensión?",
      tieneDetalle: true,
      placeholder: undefined,
    },
    {
      key: "alergias",
      label: "¿Sos alérgica/o?",
      tieneDetalle: true,
      placeholder: undefined,
    },
    {
      key: "metodo_anticonceptivo_hormonal",
      label: "¿Usás algún método anticonceptivo hormonal?",
      tieneDetalle: true,
      placeholder: undefined,
    },
  ];

const initialForm: FichaSaludForm = {
  // El resto de las claves se autogeneran al vuelo
};

export default function Page() {
  const [form, setForm] = useState<FichaSaludForm>(initialForm);
  const [mensaje, setMensaje] = useState('');
  const [fichaExistente, setFichaExistente] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const { data: session, status } = useSession(); 
  const router = useRouter();

  useEffect(() => {
    const fetchFichaSalud = async () => {
      if (session && session.user && session.user.dni) {
        try {
          const res = await fetch(`/api/ficha_salud/${session.user.dni}`);
          if (res.ok) {
            const data = await res.json();
            if (data) {
              setForm(data);
              setFichaExistente(true);
            }
          }
        } catch {
          // No hacer nada en caso de error al cargar datos
        }
      }
    };
    fetchFichaSalud();
  }, [session?.user?.dni]);

  const handleChange = (name: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(typeof value === 'boolean' && value === false
        ? { [`${name}_cual`]: '' }
        : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setMensaje('');
    try {
      // Validar que todas las preguntas tengan valor true o false
      for (const pregunta of preguntasFichaSalud) {
        const val = form[pregunta.key];
        if (val !== true && val !== false) {
          setMensaje('Por favor, contestá todas las preguntas (sí o no)');
          return;
        }
      }
      if (!session || !session.user || !session.user.dni) {
        setMensaje('Por favor, inicia sesión para enviar la ficha.');
        return;
      }
      const payload = {
        ...form,
        dni_usuario: session.user.dni,
      };
      let res;
      if (fichaExistente) {
        res = await fetch(`/api/ficha_salud/${session.user.dni}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/ficha_salud`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      if (res.ok) {
        if (!fichaExistente) {
          router.push('/turnos/depilacion');
        } else {
          setMensaje('Actualización exitosa');
        }
      } else {
        setMensaje('Error al enviar la ficha');
      }
    } catch {
      setMensaje('Error de conexión');
    } finally {
      setEnviando(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#f6f3fc] flex items-center justify-center py-6">
        <p className="text-[#7455c3] text-xl font-semibold">Cargando...</p>
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="min-h-screen bg-[#f6f3fc] flex items-center justify-center py-6">
        <p className="text-[#7455c3] text-xl font-semibold text-center px-4">
          Por favor, inicia sesión para acceder a la ficha de salud.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f3fc] flex items-center justify-center py-6">
      <div className="w-full max-w-md p-6 bg-white/80 rounded-3xl shadow-2xl border border-[#e3d5fa]">
        <h1 className="text-2xl font-bold text-[#7455c3] mb-6 text-center">Ficha de Salud</h1>
        <form onSubmit={handleSubmit} className="space-y-5">

          {preguntasFichaSalud.map((pregunta) => (
            <CardPregunta
              key={pregunta.key}
              label={pregunta.label}
              value={form[pregunta.key] ?? null}
              onChange={(v) => handleChange(pregunta.key, v)}
              inputValue={pregunta.tieneDetalle ? form[`${pregunta.key}_cual`] || '' : undefined}
              onInputChange={
                pregunta.tieneDetalle
                  ? (val) => handleChange(`${pregunta.key}_cual`, val)
                  : undefined
              }
              placeholder={pregunta.placeholder}
              requiredText={pregunta.tieneDetalle && form[pregunta.key] === true}
            />
          ))}

          <button
            type="submit"
            disabled={enviando}
            className={`w-full font-bold py-2 rounded-2xl shadow mt-2 transition ${
              enviando
                ? 'bg-[#cbb7fa] cursor-not-allowed text-white'
                : 'bg-[#ae7bfa] hover:bg-[#7455c3] text-white'
            }`}
          >
            {enviando ? 'Enviando...' : fichaExistente ? 'Actualizar ficha' : 'Enviar ficha'}
          </button>

          {mensaje && (
            <p className="mt-2 text-center text-[#7455c3] font-semibold">{mensaje}</p>
          )}

        </form>
      </div>
    </div>
  );
}