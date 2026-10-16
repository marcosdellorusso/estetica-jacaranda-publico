export default function FalloPage() {
  return (
    <div className="max-w-xl mx-auto mt-20 p-8 bg-red-50 rounded-xl shadow text-center">
      <h1 className="text-3xl font-bold text-red-700 mb-4">Pago fallido</h1>
      <p className="text-lg text-red-800 mb-6">Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.</p>
      <a href="/carrito" className="text-red-700 underline">Volver al carrito</a>
    </div>
  );
}