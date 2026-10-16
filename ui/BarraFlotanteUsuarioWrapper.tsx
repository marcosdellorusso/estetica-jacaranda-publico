"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import BarraFlotanteUsuario from "./BarraFlotanteUsuario";

const rutasPermitidas = [
  "/inicio",
  "/inicio#inicio",
  "/inicio#turnos",
  "/inicio#fidelizacion",
  "/inicio#testimonios",
  "/inicio#dudas",
  "/admin",
  "/turnos_confirmados",
  "/carrito",
  "/pago/exito",
  "/pago/fallo",
  "/pago/pendiente"
];

export default function BarraFlotanteUsuarioWrapper() {
  const pathname = usePathname();
  const [hash, setHash] = useState<string>("");

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash(); // Inicializar
    window.addEventListener("hashchange", updateHash);

    return () => {
      window.removeEventListener("hashchange", updateHash);
    };
  }, []);

  const pathWithHash = `${pathname}${hash}`;

  if (!rutasPermitidas.includes(pathname) && !rutasPermitidas.includes(pathWithHash)) return null;
  return <BarraFlotanteUsuario />;
}