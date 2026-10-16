"use client";
import React from "react";

interface Props {
  showTurnos: boolean;
  setShowTurnos: (v: boolean) => void;
  showTurnosVisible: boolean;
  turnos: any[];
  turnosPage: number;
  setTurnosPage: (v: number) => void;
  loadingTurnos: boolean;
  filtroDniInput: string;
  setFiltroDniInput: (v: string) => void;
  filtroFecha: string;
  setFiltroFecha: (v: string) => void;
}

export default function TurnosList({
  showTurnos, setShowTurnos, showTurnosVisible,
  turnos, turnosPage, setTurnosPage, loadingTurnos,
  filtroDniInput, setFiltroDniInput, filtroFecha, setFiltroFecha,
}: Props) {
  const [turnosPaginados, setTurnosPaginados] = React.useState<any[]>([]);
  const [turnosTotal, setTurnosTotal] = React.useState(0);
  const [cancelandoId, setCancelandoId] = React.useState<number | null>(null);
  const turnosPerPage = 2;

  // Nueva función para obtener los turnos de la página actual
  const fetchTurnosPaginaActual = async (page?: number) => {
    let pagina = typeof page === "number" ? page : turnosPage;
    let url = `/api/turnos/paginado?page=${pagina}&limit=${turnosPerPage}`;
    if (filtroDniInput) {
      url += `&dni=${encodeURIComponent(filtroDniInput)}`;
    }
    if (filtroFecha) {
      url += `&fecha=${encodeURIComponent(filtroFecha)}`;
    }
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data?.turnos) {
        setTurnosPaginados(data.turnos);
        setTurnosTotal(data.total || 0);
      }
    } catch (err) {
      console.error("Error al cargar turnos paginados:", err);
    }
  };

  const handleCancelarTurno = async (id: number) => {
    try {
      const res = await fetch(`/api/turnos/${id}`, { method: "DELETE" });
      if (res.ok) {
        const nuevaLista = turnosPaginados.filter(t => t.id !== id);
        setTurnosPaginados(nuevaLista);
        setTurnosTotal(prev => prev - 1);

        if (nuevaLista.length === 0) {
          if (turnosPage === 1) {
            fetchTurnosPaginaActual(1);
          } else {
            setTurnosPage(turnosPage - 1);
          }
        } else {
          setCancelandoId(null);
        }
      } else {
        alert("Error al cancelar el turno");
      }
    } catch (err) {
      alert("Error al cancelar el turno");
    }
    setCancelandoId(null);
  };

  React.useEffect(() => {
    const fetchTurnos = async () => {
      let url = `/api/turnos/paginado?page=${turnosPage}&limit=${turnosPerPage}`;
      if (filtroDniInput) {
        url += `&dni=${encodeURIComponent(filtroDniInput)}`;
      }
      if (filtroFecha) {
        url += `&fecha=${encodeURIComponent(filtroFecha)}`;
      }
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data?.turnos) {
          setTurnosPaginados(data.turnos);
          setTurnosTotal(data.total || 0);
        }
      } catch (err) {
        console.error("Error al cargar turnos paginados:", err);
      }
    };
    fetchTurnos();
  }, [turnosPage, filtroDniInput, filtroFecha]);

  return (
    <div className="bg-white/80 rounded-2xl shadow-xl p-6 flex flex-col items-center">
      <button
        type="button"
        onClick={() => setShowTurnos(!showTurnos)}
        className="mb-4 bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-700 rounded py-2 px-4 font-semibold border border-fuchsia-300 transition w-full"
      >
        {showTurnos ? "Ocultar listado de turnos" : "Ver listado de turnos"}
      </button>
      {showTurnosVisible && (
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showTurnos ? 'opacity-100 translate-y-0 max-h-[1000px]' : 'opacity-0 -translate-y-4 max-h-0 pointer-events-none'}`}>
          {showTurnos && (
            <div className="w-full flex flex-col gap-3 relative">
              {/* Filtros de búsqueda */}
              <div className="flex flex-col md:flex-row gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Buscar por DNI"
                  value={filtroDniInput}
                  onChange={e => setFiltroDniInput(e.target.value)}
                  className="border rounded px-3 py-2 w-full md:w-1/2"
                />
                <input
                  type="date"
                  placeholder="Buscar por fecha"
                  value={filtroFecha}
                  onChange={e => { setFiltroFecha(e.target.value); setTurnosPage(1); }}
                  className="border rounded px-3 py-2 w-full md:w-1/2"
                />
              </div>
              {/* Overlay de carga sobre el listado de turnos */}
              {loadingTurnos && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-xl">
                  <span className="text-fuchsia-700 font-semibold animate-pulse">Cargando turnos...</span>
                </div>
              )}
              {/* Si no hay turnos y no está cargando, mostrar mensaje */}
              {turnosPaginados.length === 0 && !loadingTurnos ? (
                <div className="text-center">No hay turnos registrados.</div>
              ) : (
                <>
                  {/* Listado de turnos, cada uno como tarjeta mobile-first */}
                  <ul className="divide-y divide-fuchsia-100">
                    {turnosPaginados.map((turno) => {
                      // Formatear fecha a dd/mm
                      let fechaFormateada = "";
                      try {
                        const date = new Date(turno.fecha);
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        fechaFormateada = `${day}/${month}`;
                      } catch {
                        fechaFormateada = turno.fecha;
                      }
                      // Formatear hora a HH:MM
                      let horaFormateada = "";
                      if (typeof turno.hora === 'string' && turno.hora.length >= 5) {
                        horaFormateada = turno.hora.slice(0,5);
                      } else {
                        horaFormateada = turno.hora;
                      }
                      return (
                        <li key={turno.id} className="bg-fuchsia-50 rounded-xl shadow p-4 mb-4 flex flex-col gap-2 border border-fuchsia-100 relative">
                          <button
                            onClick={() => setCancelandoId(turno.id)}
                            className="absolute top-2 right-2 text-fuchsia-700 bg-fuchsia-100 hover:bg-fuchsia-200 rounded px-2 py-1 text-xs font-semibold shadow transition"
                            title="Cancelar turno"
                          >
                            Cancelar
                          </button>
                          <div><span className="font-semibold">DNI:</span> {turno.dni_usuario || turno.dni}</div>
                          <div><span className="font-semibold">Fecha:</span> {fechaFormateada}</div>
                          <div><span className="font-semibold">Hora:</span> {horaFormateada}</div>
                          <div><span className="font-semibold">Servicio:</span> {turno.tipo_servicio || turno.servicio_id}</div>
                          <div><span className="font-semibold">Estado:</span> {turno.estado}</div>
                        </li>
                      );
                    })}
                  </ul>
                  {/* Paginación */}
                  <div className="flex justify-between items-center mt-4">
                    <button onClick={() => setTurnosPage(Math.max(1, turnosPage - 1))} disabled={turnosPage === 1 || loadingTurnos} className="px-3 py-1 rounded bg-fuchsia-200 text-fuchsia-700 font-semibold disabled:opacity-50">
                      Anterior
                    </button>
                    <span className="mx-2">Página {turnosPage} de {Math.ceil(turnosTotal / turnosPerPage)}</span>
                    <button onClick={() => setTurnosPage(turnosPage + 1)} disabled={turnosPage >= Math.ceil(turnosTotal / turnosPerPage) || loadingTurnos} className="px-3 py-1 rounded bg-fuchsia-200 text-fuchsia-700 font-semibold disabled:opacity-50">
                      Siguiente
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
      {cancelandoId !== null && (
        <div className="fixed inset-0 bg-fuchsia-900 bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80 max-w-full text-center">
            <p className="mb-6 text-fuchsia-700 font-semibold">¿Seguro que querés cancelar este turno?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  if (cancelandoId !== null) {
                    handleCancelarTurno(cancelandoId);
                  }
                }}
                className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold px-4 py-2 rounded transition"
              >
                Confirmar
              </button>
              <button
                onClick={() => setCancelandoId(null)}
                className="bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-700 font-semibold px-4 py-2 rounded transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}