export default function PendientePage() {
  return (
    <div className="max-w-xl mx-auto mt-20 p-8 bg-yellow-50 rounded-xl shadow text-center">
      <h1 className="text-3xl font-bold text-yellow-700 mb-4">Pago pendiente</h1>
      <p className="text-lg text-yellow-800 mb-6">Tu pago está pendiente de confirmación. Te avisaremos cuando se acredite.</p>
      <a href="/" className="text-yellow-700 underline">Volver al inicio</a>
    </div>
  );
}