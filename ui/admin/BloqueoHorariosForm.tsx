"use client";
import React from "react";

interface Props {
  showBloqueoForm: boolean;
  setShowBloqueoForm: (v: boolean) => void;
  showBloqueoFormVisible: boolean;
  bloqueoFechaInicio: string;
  setBloqueoFechaInicio: (v: string) => void;
  bloqueoHoraInicio: string;
  setBloqueoHoraInicio: (v: string) => void;
  bloqueoHoraFin: string;
  setBloqueoHoraFin: (v: string) => void;
  bloqueoFechaFin: string;
  setBloqueoFechaFin: (v: string) => void;
  bloqueoTipoServicio: string;
  setBloqueoTipoServicio: (v: string) => void;
  tiposServicio: string[];
  bloqueando: boolean;
  setBloqueando: (v: boolean) => void;
  bloqueoMensaje: string;
  setBloqueoMensaje: (v: string) => void;
  bloqueoError: string;
  setBloqueoError: (v: string) => void;
}

export default function BloqueoHorariosForm({
  showBloqueoForm, setShowBloqueoForm, showBloqueoFormVisible,
  bloqueoFechaInicio, setBloqueoFechaInicio,
  bloqueoHoraInicio, setBloqueoHoraInicio,
  bloqueoHoraFin, setBloqueoHoraFin,
  bloqueoFechaFin, setBloqueoFechaFin,
  bloqueoTipoServicio, setBloqueoTipoServicio,
  tiposServicio,
  bloqueando, setBloqueando,
  bloqueoMensaje, setBloqueoMensaje,
  bloqueoError, setBloqueoError
}: Props) {
  return (
    <div className="bg-white/80 rounded-2xl shadow-xl p-6 flex flex-col items-center">
      <button
        type="button"
        onClick={() => setShowBloqueoForm(!showBloqueoForm)}
        className="mb-4 bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-700 rounded py-2 px-4 font-semibold border border-fuchsia-300 transition w-full"
      >
        {showBloqueoForm ? "Ocultar formulario de bloqueo" : "Bloquear horarios"}
      </button>
      {showBloqueoFormVisible && (
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showBloqueoForm ? 'opacity-100 translate-y-0 max-h-[500px]' : 'opacity-0 -translate-y-4 max-h-0 pointer-events-none'}`}>
          {showBloqueoForm && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setBloqueoMensaje("");
                setBloqueoError("");
                setBloqueando(true);
                try {
                  const res = await fetch("/api/bloqueos_admin", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      fecha_inicio: bloqueoFechaInicio,
                      hora_inicio: bloqueoHoraInicio,
                      hora_fin: bloqueoHoraFin,
                      fecha_fin: bloqueoFechaFin || bloqueoFechaInicio,
                      tipo_servicio: bloqueoTipoServicio,
                    }),
                  });
                  const data = await res.json();
                  if (data.ok) {
                    setBloqueoMensaje("Bloqueo realizado correctamente.");
                    setBloqueoFechaInicio("");
                    setBloqueoFechaFin("");
                    setBloqueoHoraInicio("");
                    setBloqueoHoraFin("");
                    setBloqueoTipoServicio("");
                  } else {
                    setBloqueoError(data.error || "Error al realizar el bloqueo.");
                  }
                } catch (err) {
                  setBloqueoError("Error al conectar con el servidor.");
                }
                setBloqueando(false);
              }}
              className="w-full flex flex-col gap-4 bg-white rounded-xl px-4 py-5 shadow-md"
            >
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-fuchsia-700">Fecha de inicio</label>
                <input
                  type="date"
                  value={bloqueoFechaInicio}
                  onChange={e => setBloqueoFechaInicio(e.target.value)}
                  required
                  className="border border-fuchsia-300 focus:ring-2 focus:ring-fuchsia-500 focus:outline-none rounded-lg px-3 py-2 text-sm shadow-sm transition"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-fuchsia-700">Hora de inicio</label>
                <input
                  type="time"
                  value={bloqueoHoraInicio}
                  onChange={e => setBloqueoHoraInicio(e.target.value)}
                  required
                  className="border border-fuchsia-300 focus:ring-2 focus:ring-fuchsia-500 focus:outline-none rounded-lg px-3 py-2 text-sm shadow-sm transition"
                  step="60"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-fuchsia-700">Hora de fin</label>
                <input
                  type="time"
                  value={bloqueoHoraFin}
                  onChange={e => setBloqueoHoraFin(e.target.value)}
                  required
                  className="border border-fuchsia-300 focus:ring-2 focus:ring-fuchsia-500 focus:outline-none rounded-lg px-3 py-2 text-sm shadow-sm transition"
                  step="60"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-fuchsia-700">Fecha de fin</label>
                <input
                  type="date"
                  value={bloqueoFechaFin}
                  onChange={e => setBloqueoFechaFin(e.target.value)}
                  required
                  className="border border-fuchsia-300 focus:ring-2 focus:ring-fuchsia-500 focus:outline-none rounded-lg px-3 py-2 text-sm shadow-sm transition"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-fuchsia-700">Tipo de servicio</label>
                <select
                  value={bloqueoTipoServicio}
                  onChange={e => setBloqueoTipoServicio(e.target.value)}
                  required
                  className="border border-fuchsia-300 focus:ring-2 focus:ring-fuchsia-500 focus:outline-none rounded-lg px-3 py-2 text-sm shadow-sm transition"
                >
                  <option value="">Seleccionar tipo de servicio</option>
                  {tiposServicio.map((tipo) => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={bloqueando}
                className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg py-2 font-semibold shadow-md transition"
              >
                {bloqueando ? "Bloqueando..." : "Confirmar bloqueo"}
              </button>
              {bloqueoMensaje && <div className="text-center text-sm font-semibold text-green-600">{bloqueoMensaje}</div>}
              {bloqueoError && <div className="text-center text-sm font-semibold text-red-500">{bloqueoError}</div>}
            </form>
          )}
        </div>
      )}
    </div>
  );
}