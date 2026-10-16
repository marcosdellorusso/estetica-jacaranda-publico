import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference, Payment, MerchantOrder } from 'mercadopago';
import { MPItem } from "@/types/MPItem";
import { auth } from '@/auth';

// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

const preference = new Preference(client);

let compraId = Date.now().toString();

export async function POST(req: NextRequest) {
  let body: any = {};
  const contentType = req.headers.get("content-type") || "";
  const isForm = contentType.includes("application/x-www-form-urlencoded");

  if (contentType.includes("application/json")) {
    body = await req.json();
  } else if (isForm) {
    const formData = await req.formData();
    // Only expecting 'items' as a JSON string
    const itemsRaw = formData.get("items");
    try {
      body.items = itemsRaw ? JSON.parse(itemsRaw.toString()) : [];
    } catch (e) {
      return NextResponse.json({ error: "Error al parsear items" }, { status: 400 });
    }
  } else {
    return NextResponse.json({ error: "Tipo de contenido no soportado" }, { status: 415 });
  }

  try {
    // Obtener sesión para el DNI
    const session = await auth();
    const dni_usuario = session?.user?.dni;

    const items: MPItem[] = (body.items || []).map((item: any) => ({
      title: item.title || item.nombre || "Producto",
      unit_price: item.unit_price || item.precio || 0,
      quantity: item.quantity || item.cantidad || 1,
      currency_id: item.currency_id || "ARS"
    }));

    if (!items.length) {
      return NextResponse.json({ error: "No hay productos en el carrito" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const successUrl = `${baseUrl}/pago/exito`;
    const failureUrl = `${baseUrl}/pago/fallo`;
    const pendingUrl = `${baseUrl}/pago/pendiente`;
    const isLocalhost = baseUrl.includes("localhost");

	const preferenceBody: any = {
	  items,
	  back_urls: {
		success: successUrl,
		failure: failureUrl,
		pending: pendingUrl,
	  },
	  notification_url: `${baseUrl}/api/mercadopago/webhook`,
	  external_reference: compraId,
	  metadata: {}
	};
    if (dni_usuario) {
      preferenceBody.metadata.dni_usuario = dni_usuario;
    }

    if (!isLocalhost) {
      preferenceBody.auto_return = "approved";
    }

    const response = await preference.create({ body: preferenceBody });
    const preferenceId = response.id;
    console.log("Preferencia creada con ID:", preferenceId);

    if (response && response.init_point) {
      if (isForm) {
        // Redirect for form submissions
        return NextResponse.redirect(response.init_point, 303);
      } else {
        // JSON for fetch requests
        return NextResponse.json({ init_point: response.init_point });
      }
    } else {
      return NextResponse.json({ error: "No se pudo obtener el link de pago" }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Error Mercado Pago:", error);
    return NextResponse.json({ error: "Error creando preferencia" }, { status: 500 });
  }
}