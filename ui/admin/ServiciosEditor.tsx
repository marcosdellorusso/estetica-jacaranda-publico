"use client";
import React, { useEffect, useState } from "react";

// Tipo de servicio según tu tabla
type Servicio = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  tipo_servicio: string;
  duracion_min: number;
};

export default function ServiciosEditor() {
  const [tipos, setTipos] = useState<string[]>([]);
  const [selectedTipo, setSelectedTipo] = useState("");
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<Servicio>>({});
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [showEditor, setShowEditor] = useState(false);

  const [serviciosPage, setServiciosPage] = useState(1);
  const serviciosPerPage = 2; // Cambiá esto si querés más o menos por página
  const [serviciosTotal, setServiciosTotal] = useState(0);

  // Traer tipos de servicio al iniciar
  useEffect(() => {
    async function fetchTipos() {
      try {
        const res = await fetch("/api/servicios/tipos");
        const data = await res.json();
        if (data.ok && Array.isArray(data.tipos)) setTipos(data.tipos);
      } catch {
        setTipos([]);
      }
    }
    fetchTipos();
  }, []);

  // Traer servicios por tipo con paginación
  useEffect(() => {
    if (!selectedTipo) {
      setServicios([]);
      setServiciosTotal(0);
      return;
    }
    setLoading(true);
    fetch(`/api/servicios/paginado?tipo=${encodeURIComponent(selectedTipo)}&page=${serviciosPage}&limit=${serviciosPerPage}`)
      .then(r => r.json())
      .then(data => {
        setServicios(data.servicios || []);
        setServiciosTotal(data.total || 0);
      })
      .catch(() => {
        setServicios([]);
        setServiciosTotal(0);
      })
      .finally(() => setLoading(false));
  }, [selectedTipo, serviciosPage]);

  // Iniciar edición
  const startEdit = (servicio: Servicio) => {
    setEditingId(servicio.id);
    setEditValues({ ...servicio });
    setStatusMsg("");
  };

  // Guardar edición
  const saveEdit = async () => {
    if (!editingId) return;
    setLoading(true);
    setStatusMsg("");
    try {
      const res = await fetch(`/api/servicios/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editValues),
      });
      if (res.ok) {
        setStatusMsg("Servicio actualizado ✔️");
        // Actualizar la lista local sin volver a pedir todo
        setServicios(servicios =>
          servicios.map(s => (s.id === editingId ? { ...s, ...editValues } as Servicio : s))
        );
        setEditingId(null);
      } else {
        setStatusMsg("Error al guardar cambios");
      }
    } catch {
      setStatusMsg("Error al conectar con el servidor");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white/80 rounded-2xl shadow-xl p-6 flex flex-col items-center mb-10">
      <button
        type="button"
        onClick={() => setShowEditor(prev => !prev)}
        className="mb-4 bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-700 rounded py-2 px-4 font-semibold border border-fuchsia-300 transition w-full"
      >
        {showEditor ? "Ocultar editor de servicios" : "Editar servicios"}
      </button>
      {showEditor && (
        <>
          {/* Selector de tipo de servicio */}
          <select
            className="border px-3 py-2 rounded mb-6"
            value={selectedTipo}
            onChange={e => {
              setSelectedTipo(e.target.value);
              setServiciosPage(1);
            }}
          >
            <option value="">Seleccionar tipo de servicio...</option>
            {tipos.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>

          {/* Lista de servicios */}
          {loading && <div className="text-fuchsia-600 mb-4">Cargando...</div>}
          {!loading && selectedTipo && servicios.length === 0 && (
            <div className="text-gray-600 mb-4">No hay servicios para este tipo.</div>
          )}
          {!loading && servicios.length > 0 && (
            <div className="w-full flex flex-col gap-3">
              {servicios.map(servicio => (
                <div
                  key={servicio.id}
                  className="border rounded-xl p-3 bg-fuchsia-50 shadow flex flex-col md:flex-row gap-3"
                >
                  {editingId === servicio.id ? (
                    <form
                      className="flex flex-col gap-2 w-full max-w-md"
                      onSubmit={e => { e.preventDefault(); saveEdit(); }}
                      style={{ minWidth: 0 }}
                    >
                      <input
                        className="border rounded px-2 py-1"
                        value={editValues.nombre || ""}
                        onChange={e => setEditValues(ev => ({ ...ev, nombre: e.target.value }))}
                        placeholder="Nombre"
                        required
                      />
                      <input
                        className="border rounded px-2 py-1"
                        value={editValues.precio || ""}
                        type="number"
                        min={0}
                        onChange={e => setEditValues(ev => ({ ...ev, precio: Number(e.target.value) }))}
                        placeholder="Precio"
                        required
                      />
                      <input
                        className="border rounded px-2 py-1"
                        value={editValues.duracion_min || ""}
                        type="number"
                        min={0}
                        onChange={e => setEditValues(ev => ({ ...ev, duracion_min: Number(e.target.value) }))}
                        placeholder="Duración (min)"
                        required
                      />
                      <input
                        className="border rounded px-2 py-1"
                        value={editValues.imagen_url || ""}
                        onChange={e => setEditValues(ev => ({ ...ev, imagen_url: e.target.value }))}
                        placeholder="URL Imagen"
                      />
                      <textarea
                        className="border rounded px-2 py-1"
                        value={editValues.descripcion || ""}
                        onChange={e => setEditValues(ev => ({ ...ev, descripcion: e.target.value }))}
                        placeholder="Descripción"
                        rows={3}
                        style={{ resize: "vertical" }}
                      />
                      <div className="flex gap-2 mt-1">
                        <button
                          className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded py-2 font-semibold flex-1 transition-colors"
                          disabled={loading}
                          type="submit"
                        >
                          Guardar
                        </button>
                        <button
                          className="bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-700 rounded py-2 font-semibold flex-1 transition-colors"
                          disabled={loading}
                          type="button"
                          onClick={() => setEditingId(null)}
                        >
                          Cancelar
                        </button>
                      </div>
                      {statusMsg && <div className="text-center text-fuchsia-700">{statusMsg}</div>}
                    </form>
                  ) : (
                    <>
                      <div className="flex-1">
                        <div className="font-bold">{servicio.nombre}</div>
                        <div>Precio: ${servicio.precio}</div>
                        <div>Duración: {servicio.duracion_min} min</div>
                        <div className="text-xs text-gray-500 break-words">Imagen: {servicio.imagen_url}</div>
                        <div className="text-sm">{servicio.descripcion}</div>
                      </div>
                      <div className="flex flex-col justify-between">
                        <button
                          className="bg-fuchsia-500 hover:bg-fuchsia-700 text-white px-3 py-1 rounded font-semibold mb-2"
                          onClick={() => startEdit(servicio)}
                        >
                          Editar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
          {serviciosTotal > serviciosPerPage && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setServiciosPage(Math.max(1, serviciosPage - 1))}
                disabled={serviciosPage === 1 || loading}
                className="px-3 py-1 rounded bg-fuchsia-200 text-fuchsia-700 font-semibold disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="mx-2">
                Página {serviciosPage} de {Math.ceil(serviciosTotal / serviciosPerPage)}
              </span>
              <button
                onClick={() => setServiciosPage(serviciosPage + 1)}
                disabled={serviciosPage >= Math.ceil(serviciosTotal / serviciosPerPage) || loading}
                className="px-3 py-1 rounded bg-fuchsia-200 text-fuchsia-700 font-semibold disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
          {statusMsg && !editingId && <div className="mt-2 text-center text-fuchsia-700">{statusMsg}</div>}
        </>
      )}
    </div>
  );
}