// Archivo utilitario para manejo de notificaciones push web en el cliente Next.js

import { WebPushPayload } from '@/types/WebPushPayload';

// Ruta del service worker para web push
const SERVICE_WORKER_FILE_PATH = '/web-push-service-worker.js';

// Verifica si el navegador soporta notificaciones push y service workers
export function notificationUnsupported(): boolean {
	let unsupported = false;

	if (
		!('serviceWorker' in navigator) ||
		!('PushManager' in window) ||
		!('showNotification' in ServiceWorkerRegistration.prototype)
	) {
		unsupported = true;
	}

	return unsupported;
}

// Según el estado de permisos, actúa: si está concedido, registra y suscribe
export function checkPermissionStateAndAct(
	onSubscribe: (subs: PushSubscription | null) => void,
): void {
	const state: NotificationPermission = Notification.permission;

	switch (state) {
		case 'denied':
			// El usuario denegó permisos, no hacer nada
			break;
		case 'granted':
			// Permiso concedido, registrar SW y suscribir
			registerAndSubscribe(onSubscribe);
			break;
		case 'default':
			break;
	}
}

// Convierte una clave pública VAPID en base64-url a Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding)
		.replace(/-/g, '+')
		.replace(/_/g, '/');
	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

// Suscribe al usuario a push notifications usando el service worker
async function subscribe(onSubscribe: (subs: PushSubscription | null) => void): Promise<void> {
	navigator.serviceWorker.ready
		.then((registration: ServiceWorkerRegistration) => {
			// Suscribe con la clave pública VAPID
			const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
			if (!vapidKey) {
				throw new Error('VAPID public key is not defined');
			}
			return registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(vapidKey),
			});
		})
		.then((subscription: PushSubscription) => {
			console.info('Created subscription Object: ', subscription.toJSON());

			// Envía la suscripción al backend
			submitSubscription(subscription).then(_ => {
				onSubscribe(subscription);
			});
		})
		.catch(e => {
			// Error al suscribir
			console.error('Failed to subscribe cause of: ', e);
		});
}

// Envía la suscripción al endpoint del backend para guardarla
async function submitSubscription(subscription: PushSubscription): Promise<void> {
	const endpointUrl = '/api/web-push/subscription';

	await fetch(endpointUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ subscription }),
	});
}

// Registra el service worker y luego suscribe al usuario
export async function registerAndSubscribe(
	onSubscribe: (subs: PushSubscription | null) => void,
): Promise<void> {
	try {
		await navigator.serviceWorker.register(SERVICE_WORKER_FILE_PATH);

		await subscribe(onSubscribe);
	} catch (e) {
		// Error al registrar el service worker
		console.error('Failed to register service-worker: ', e);
	}
}

// Envía una notificación push al backend para distribuirla a los suscriptores
export async function sendWebPush(payload: WebPushPayload): Promise<void> {
	const endPointUrl = '/api/web-push/send';

	const pushBody = {
		title: payload.title || 'Test Push',
		body: payload.body || 'Este es un mensaje de prueba',
		image: payload.image || '/next.png',
		icon: payload.icon || 'nextjs.png',
		url: payload.url || 'https://google.com',
	};

	const res = await fetch(endPointUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(pushBody),
	});

	const result = await res.json();
	console.log(result);
}
