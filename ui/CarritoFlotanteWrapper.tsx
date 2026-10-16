"use client";
import { usePathname } from "next/navigation";
import CarritoFlotante from "./CarritoFlotante";

function CarritoFlotanteWrapper() {
	const pathname = usePathname();
	if (pathname === "/login" || pathname.startsWith("/admin")) return null;
	return <CarritoFlotante />;
}

export default CarritoFlotanteWrapper;
