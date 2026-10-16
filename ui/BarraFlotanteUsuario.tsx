"use client";

import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function BarraFlotanteUsuario() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Solo muestra la barra si hay sesión y no está en /login
  if (!session || pathname === "/login") return null;

  const nombre = session.user?.name?.trim() || "";
  const apellido = session.user?.apellido?.trim() || "";
  const role = session.user?.role?.toLowerCase() || "";
  const mostrar = (nombre || apellido) ? `${nombre} ${apellido}`.trim() : "Usuario";
  const mostrarConAdmin = role === "admin" ? `${mostrar} (administrador)` : mostrar;

  return (
    <div className="fixed top-6 left-6 z-50">
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 transition-all"
        title="Menú usuario"
        aria-label="Menú usuario"
      >
        {/* Icono de hamburguesa */}
        <span className="flex flex-col gap-1">
          <span className="block w-7 h-1 bg-white rounded"></span>
          <span className="block w-7 h-1 bg-white rounded"></span>
          <span className="block w-7 h-1 bg-white rounded"></span>
        </span>
      </button>
      {open && (
        <div ref={menuRef} className="absolute top-16 left-0 bg-fuchsia-600 text-white rounded-xl shadow-lg px-6 py-4 flex flex-col items-start gap-2 min-w-[180px] transition-all duration-150">
          <span className="font-semibold text-base mb-2">{mostrarConAdmin}</span>
          <a
            href="/inicio"
            className="hover:underline focus:outline-none text-sm"
            title="Ir a inicio"
          >
            Ir a Inicio
          </a>
          {role === "admin" && (
            <a
              href="/admin"
              className="hover:underline focus:outline-none text-sm"
              title="Panel de administración"
            >
              Ir al Panel Admin
            </a>
          )}
          <a
            href="/ficha_salud"
            className="hover:underline focus:outline-none text-sm"
            title="Ficha de salud"
          >
            Ficha de salud
          </a>
          <a
            href="/turnos_confirmados"
            className="hover:underline focus:outline-none text-sm"
            title="Ver turnos confirmados"
          >
            Ver turnos confirmados
          </a>
          <hr className="w-full border-fuchsia-300 my-2" />
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="hover:underline focus:outline-none text-sm mt-1 pt-1"
            title="Cerrar sesión"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
