// Módulo para manejar notificaciones push web y suscripciones en la API Next.js
import webpush, { PushSubscription } from 'web-push';
import pool from '@/db/index';

// Configuración de VAPID para autenticación de Web Push
webpush.setVapidDetails(
	'mailto:mail@example.com',
	process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
	process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY!,
);

// Handler principal para rutas POST bajo /api/web-push/*
export async function POST(request: any) {
	// Extrae el pathname para enrutar la petición
	const { pathname } = new URL(request.url);
	switch (pathname) {
		case '/api/web-push/subscription':
			// Registrar o actualizar una suscripción push
			return setSubscription(request);
		case '/api/web-push/send':
			// Enviar notificación push a todos los suscriptores
			return sendPush(request);
		default:
			// Ruta no encontrada
			return notFoundApi();
	}
}

// Registra una nueva suscripción push en la base de datos
async function setSubscription(request: any) {
	const body: { subscription: PushSubscription } = await request.json();

	// Guarda o actualiza la suscripción en la base de datos
	const client = await pool.connect();
	try {
		const { endpoint, keys } = body.subscription;
		const { p256dh, auth } = keys;
		const expirationTime = null;

		await client.query(
			`INSERT INTO push_subscriptions (endpoint, p256dh, auth, expiration_time)
			 VALUES ($1, $2, $3, $4)
			 ON CONFLICT (endpoint) DO UPDATE
			 SET p256dh = EXCLUDED.p256dh,
					 auth = EXCLUDED.auth,
					 expiration_time = EXCLUDED.expiration_time;`,
			[endpoint, p256dh, auth, expirationTime]
		);
	} finally {
		client.release();
	}

	return new Response(JSON.stringify({ message: 'Subscription set.' }), {});
}

// Envía una notificación push a todas las suscripciones válidas
async function sendPush(request: any) {
	const body = await request.json();
	const pushPayload = JSON.stringify(body);

	// Obtiene todas las suscripciones desde la base de datos
	const client = await pool.connect();
	let dbSubscriptions: PushSubscription[] = [];
	try {
		const res = await client.query('SELECT endpoint, p256dh, auth FROM push_subscriptions');
		dbSubscriptions = res.rows.map((row: any) => ({
			endpoint: row.endpoint,
			keys: { p256dh: row.p256dh, auth: row.auth }
		}));
	} finally {
		client.release();
	}

	// Envía la notificación a cada suscripción y elimina las inválidas
	const results = await Promise.allSettled(
		dbSubscriptions.map(async sub => {
			try {
				await webpush.sendNotification(sub, pushPayload);
				return { endpoint: sub.endpoint, status: 'sent' };
			} catch (err: any) {
				// Si el endpoint es inválido (404/410), lo elimina de la base de datos
				if (err.statusCode === 404 || err.statusCode === 410) {
					const client = await pool.connect();
					try {
						await client.query('DELETE FROM push_subscriptions WHERE endpoint = $1', [sub.endpoint]);
					} finally {
						client.release();
					}
					return { endpoint: sub.endpoint, status: 'deleted' };
				}
				// Otro error al enviar la notificación
				return { endpoint: sub.endpoint, status: 'error', error: err.message };
			}
		})
	);

	return new Response(JSON.stringify({ message: 'Push sent.', results }), {});
}

// Handler para rutas no encontradas en la API
async function notFoundApi() {
	return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
		headers: { 'Content-Type': 'application/json' },
		status: 404,
	});
}