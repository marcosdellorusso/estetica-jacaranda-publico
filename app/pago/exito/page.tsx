'use client';

import { useState } from 'react';
import { registerAndSubscribe } from '@/app/api/web-push/push';

export default function ExitoPage() {
	const [permission, setPermission] = useState<NotificationPermission | null>(
		typeof window !== 'undefined' && 'Notification' in window
			? Notification.permission
			: null
	);

	const handleEnableNotifications = async () => {
		if (!('Notification' in window)) {
			alert('Las notificaciones Push no son compatibles con este navegador.');
			return;
		}
		try {
			const result = await Notification.requestPermission();
			setPermission(result);
			if (result === 'granted') {
				new Notification('¡Notificaciones activadas!', {
					body: 'Recibirás notificaciones de Aynara.',
				});
				registerAndSubscribe((subscription) => {
					if (subscription) {
						console.log('Subscription:', subscription);
					} else {
						console.log('No subscription available.');
					}
				});
			}
			
		} catch (e) {
			alert('No se pudo activar las notificaciones.');
		}
	};

	return (
		<div className="max-w-xl mx-auto mt-20 p-8 bg-green-50 rounded-xl shadow text-center">
			<h1 className="text-3xl font-bold text-green-700 mb-4">¡Pago exitoso!</h1>
			<p className="text-lg text-green-800 mb-6">Tu pago fue procesado correctamente. Muchas gracias por tu compra.</p>
			<a href="/" className="text-green-700 underline block mb-6">Volver al inicio</a>
			<label className="block text-green-900 font-semibold mb-2">¡Ahora podés pertenecer al exclusivo grupo de las notificaciones de Aynara!</label>
			<button
				onClick={handleEnableNotifications}
				className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition"
				disabled={permission === 'granted'}
			>
				{permission === 'granted' ? 'Notificaciones activadas' : 'Activar notificaciones Push'}
			</button>
		</div>
	);
}