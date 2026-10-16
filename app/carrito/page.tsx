"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Turno } from "@/types/Turno";

export default function CarritoPage() {
  const { data: session } = useSession();
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [turnoAEliminar, setTurnoAEliminar] = useState<number | null>(null);
  
  const total = turnos.reduce((acc, t) => acc + Number(t.precio), 0);

  useEffect(() => {
    async function fetchTurnos() {
      if (session?.user?.dni) {
        try {
          const response = await fetch(`/api/turnos?dni=${session.user.dni}`);
          if (response.ok) {
            const data = await response.json();
            setTurnos(data.turnos || []);
          }
        } catch (error) {
          console.error('Error fetching turnos:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    fetchTurnos();
  }, [session]);

  const mostrarModalConfirmacion = (turnoId: number) => {
    setTurnoAEliminar(turnoId);
    setShowModal(true);
  };

  const confirmarEliminacion = async () => {
    if (turnoAEliminar === null) return;
    
    try {
      const response = await fetch(`/api/turnos/${turnoAEliminar}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Eliminar el turno del estado local
        setTurnos(turnos.filter(turno => turno.turno_id !== turnoAEliminar));
      } else {
        console.error('Error al eliminar el turno');
      }
    } catch (error) {
      console.error('Error al eliminar el turno:', error);
    } finally {
      setShowModal(false);
      setTurnoAEliminar(null);
    }
  };

  const cancelarEliminacion = () => {
    setShowModal(false);
    setTurnoAEliminar(null);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg mt-10">
        <div className="text-center">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg mt-10">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Carrito de compras</h1>
      {turnos.length === 0 ? (
        <p className="text-gray-700">No tienes turnos en tu carrito.</p>
      ) : (
        <ul className="divide-y divide-gray-300 mb-6">
          {turnos.map(turno => {
            // Formateo de fecha dd/mm/yy
            let fechaFormateada = '';
            if (typeof turno.fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(turno.fecha)) {
              const [anio, mes, dia] = turno.fecha.split('-');
              fechaFormateada = `${dia}/${mes}/${anio.slice(-2)}`;
            } else {
              const fechaObj = new Date(turno.fecha);
              const dia = fechaObj.getDate().toString().padStart(2, '0');
              const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
              const anio = fechaObj.getFullYear().toString().slice(-2);
              fechaFormateada = `${dia}/${mes}/${anio}`;
            }

            // Formateo de hora HH:MM
            let horaStr = '';
            if (typeof turno.hora === 'string') {
              const [h, m] = turno.hora.split(":");
              horaStr = `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
            } else if (turno.hora instanceof Date) {
              horaStr = turno.hora.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
            } else {
              horaStr = String(turno.hora);
            }

            return (
              <li key={turno.turno_id} className="flex justify-between items-center py-4">
                <div className="flex-1">
                  <span className="text-gray-900 block">
                    {turno.servicio}
                  </span>
                  <span className="text-gray-600 block text-sm mt-1">
                    {fechaFormateada}<br />
                    {horaStr}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-blue-900 font-semibold">${turno.precio}</span>
                  <button
                    onClick={() => mostrarModalConfirmacion(turno.turno_id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    title="Eliminar turno"
                  >
                    ✕
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <div className="flex justify-between font-bold text-lg mb-4 text-gray-900">
        <span>Total:</span>
        <span>${total}</span>
      </div>
      {turnos.length > 0 && (
        <form method="POST" action="/api/mercadopago">
          <input type="hidden" name="items" value={JSON.stringify(turnos)} />
          <button
            type="submit"
            className="w-full bg-fuchsia-600 text-white py-2 rounded hover:bg-fuchsia-700 transition"
          >
            Ir a pagar
          </button>
        </form>
      )}
      <Link href={"/inicio#turnos"} className="block text-center text-blue-700 mt-4 underline hover:text-blue-900 focus:outline focus:outline-2 focus:outline-blue-700">
        {turnos.length === 0 ? 'Empezá a reservar' : 'Seguir comprando'}
      </Link>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmar cancelación
            </h3>
            <p className="text-gray-700 mb-6">
              ¿Desea cancelar el turno?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelarEliminacion}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                No
              </button>
              <button
                onClick={confirmarEliminacion}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Sí
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}