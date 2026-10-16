"use client";

import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function LogoutButton() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Solo muestra el botón si hay sesión y no está en /login
  if (!session || pathname === "/login") return null;

  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="fixed bottom-6 right-6 z-50 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-full shadow-lg px-5 py-3 text-base font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2"
      title="Cerrar sesión"
    >
      Cerrar sesión
    </button>
  );
}
