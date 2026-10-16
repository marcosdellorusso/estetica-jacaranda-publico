'use client'

import { useParams, useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation';
import CalendarioCliente from '@/ui/CalendarioCliente'
import { useRef,useState } from 'react';

export default function CalendarioPage() {
  const { tipo_servicio } = useParams()
  const router = useRouter()
  const searchParams = useSearchParams();
  const servicio_id = Number(searchParams.get('servicio_id'));
  const calendarioRef = useRef<any>(null);
  const [vistaCalendario, setVistaCalendario] = useState('meses');

  const handleVolver = () => {
    if (vistaCalendario === 'horas' || vistaCalendario === 'dias') {
      // Llamá al método volver como ya hacés (usando la ref)
      calendarioRef.current?.volver();
    } else {
      router.push(`/turnos/${tipo_servicio}`);
    }
  };

  return (
    <>
      <button
        className="fixed top-6 left-4 z-30 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl shadow-lg shadow-[#E636D4]/20 p-2"
        onClick={handleVolver}
        aria-label="Volver"
        type="button"
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 24L10 14L18 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className="min-h-screen flex items-center justify-center bg-[url('/images/fondoinicio.png')] bg-cover bg-center px-4 py-20">
        <CalendarioCliente ref={calendarioRef} tipo_servicio={String(tipo_servicio)} servicio_id={servicio_id} onVistaChange={setVistaCalendario} />
      </div>
    </>
  )
}