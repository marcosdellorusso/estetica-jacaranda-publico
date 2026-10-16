'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import type { Turno } from '@/types/Turno';

export default function TurnosConfirmadosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    fetchTurnos();
  }, [session, status]);

  const fetchTurnos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/turnos/confirmados');
      
      if (!response.ok) {
        throw new Error('Error al cargar los turnos');
      }
      
      const data = await response.json();
      setTurnos(data.turnos || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha: string | Date) => {
    let dateObj: Date | null = null;

    if (typeof fecha === 'string') {
      // Si viene como YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss.sssZ
      const soloFecha = fecha.split('T')[0]; // Agarra la parte de la fecha
      const [anio, mes, dia] = soloFecha.split('-');
      if (anio && mes && dia) {
        // Crear fecha en zona local, para evitar desfase
        dateObj = new Date(Number(anio), Number(mes) - 1, Number(dia));
      }
    } else if (fecha instanceof Date) {
      dateObj = fecha;
    }

    if (dateObj) {
      return dateObj.toLocaleDateString('es-AR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    // Fallback: mostrar la fecha como está
    return String(fecha);
  };

  const formatearHora = (hora: string | Date) => {
    if (typeof hora === 'string' && hora.includes(':')) {
      return hora.slice(0, 5); // Formato HH:MM
    }
    const date = typeof hora === 'string' ? new Date(hora) : hora;
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearPrecio = (precio: string | number) => {
    const valor = typeof precio === 'string' ? parseFloat(precio) : precio;
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(valor);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando turnos confirmados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchTurnos}
            className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                Mis Turnos Confirmados
              </h1>
              <p className="text-gray-600">
                {turnos.length > 0 
                  ? `Tienes ${turnos.length} turno${turnos.length !== 1 ? 's' : ''} confirmado${turnos.length !== 1 ? 's' : ''}`
                  : 'No tienes turnos confirmados'
                }
              </p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </div>

        {/* Lista de turnos */}
        {turnos.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">🗓️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No tienes turnos confirmados
            </h3>
            <p className="text-gray-600 mb-6">
              Una vez que confirmes tus turnos pendientes, aparecerán aquí.
            </p>
            <button
              onClick={() => router.push('/inicio#turnos')}
              className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
            >
              Reservar un turno
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {turnos.map((turno) => (
              <div
                key={turno.turno_id}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Info principal */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {turno.servicio}
                      </h3>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">📅 Fecha:</span>
                        <span className="capitalize">{formatearFecha(turno.fecha)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">🕐 Hora:</span>
                        <span>{formatearHora(turno.hora)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">🏷️ Tipo:</span>
                        <span className="capitalize">{turno.tipo_servicio}</span>
                      </div>
                    </div>
                  </div>

                  {/* Precio y estado */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-lg font-bold text-fuchsia-600">
                      {formatearPrecio(turno.precio)}
                    </div>
                    <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Confirmado
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}