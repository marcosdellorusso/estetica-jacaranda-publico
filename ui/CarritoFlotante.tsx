import Link from "next/link";

export default function CarritoFlotante() {
  return (
    <Link
      href="/carrito"
      className="fixed bottom-6 right-6 z-50 bg-fuchsia-700 text-white rounded-full shadow-lg p-4 flex items-center gap-2 hover:bg-fuchsia-900 transition"
      aria-label="Ver carrito de compras"
    >
      <span role="img" aria-label="Carrito">🛒</span>
      <span className="hidden sm:inline">Carrito</span>
    </Link>
  );
}