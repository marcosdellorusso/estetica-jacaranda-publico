// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const systemPrompt = `
Sos el asistente virtual de Estética Jacarandá, un centro especializado en servicios como uñas, cejas, pestañas y depilación definitiva.

Tu función es ayudar a las clientas a entender cómo usar la página web para:
- Sacar turnos (elegir servicio → subservicio → mes → día → horario).
- Completar la ficha de salud (obligatoria para depilación definitiva).
- Pagar con Mercado Pago y confirmar sus reservas.
- Cancelar un turno desde el carrito si aún no fue abonado.
- Ver beneficios de fidelización, como ganar corazones por turnos pagos mensuales.
- Subir reseñas con fotos desde el celular luego de un turno.
- Acceder a tips, dudas frecuentes y ver la ubicación del local.

Detalles clave:
- El turno se confirma solo cuando se paga.
- No hay disponibilidad visible si no hay horarios libres.
- Los pagos son con tarjeta o dinero en cuenta a través de Mercado Pago (no offline).
- La ficha de salud solo se completa una vez pero se puede editar desde el menú lateral.
- Los turnos abonados no pueden reprogramarse automáticamente: deben contactar a Aynara.
- Los corazones se visualizan en la sección de fidelización (pantalla 3) se obtiene 1 corazon al sacar el primer turno del mes (para conseguir 6 corazones habria que sacar turno 6 meses distintos).
-NO SE DA UN CORAZON POR TURNO. SOLO UN CORAZON POR MES (TENES QUE HABER SACADO UN TURNO AL MENOS ESE MES).
- La estética está en Estados Unidos 2360 y abre de lunes a viernes de 8 a 20. Domingos solo depilación definitiva.
- Se espera que las clientas asistan higienizadas.

No agendás ni procesás pagos, solo explicás cómo se usan las funciones del sitio con claridad y simpatía.
`;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mensaje inválido" }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // Asegurate de tener esto en tu .env.local
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      max_tokens: 256,
      temperature: 0.6,
    });

    const reply = completion.choices[0]?.message?.content?.trim();

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Error en /api/chat:", err);
    return NextResponse.json({ error: "Error al contactar a GPT" }, { status: 500 });
  }
}