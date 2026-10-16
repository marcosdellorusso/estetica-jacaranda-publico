import { NextRequest, NextResponse } from "next/server";
import { confirmarTurnosByUsuario } from '@/db/queries/turnos';

// Webhook para recibir notificaciones de Mercado Pago
export async function POST(req: NextRequest) {
  try {
    const payment = await req.json();
	 console.log("Webhook recibido:", payment);

	 const paymentId = payment.data.id;
	 try {
		const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
			headers: {
				"Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}`
			}
		});
		const mpPayment = await response.json();
		console.log("Respuesta de Mercado Pago:", mpPayment);

		if (mpPayment.status === "approved") {
			// Intentar obtener el DNI del usuario desde payer.identification.number
			let dni_usuario = mpPayment.metadata?.dni_usuario;
			if (!dni_usuario && mpPayment.payer?.identification?.type === 'DNI') {
				dni_usuario = mpPayment.payer.identification.number;
			}
			if (dni_usuario) {
				await confirmarTurnosByUsuario(dni_usuario);
				console.log(`Turnos confirmados para el usuario con DNI: ${dni_usuario}`);
			} else {
				console.warn("No se encontró el DNI del usuario en el metadata ni en payer.identification");
			}
		}
	 } catch (error) {
		console.error("Error al obtener el pago:", error);
	 }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error en webhook de Mercado Pago:", error);
    return NextResponse.json({ error: "Error procesando webhook" }, { status: 400 });
  }
}
