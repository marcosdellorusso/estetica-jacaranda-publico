import type { Metadata } from 'next'
import BarraFlotanteUsuarioWrapper from '../ui/BarraFlotanteUsuarioWrapper'
import CarritoFlotanteWrapper from '../ui/CarritoFlotanteWrapper'
import ChatWidget from '../ui/ChatWidget';
import React from 'react' // necesario para JSX
import RootLayoutClient from './RootLayoutClient';
import { SessionProvider } from 'next-auth/react';

export const metadata: Metadata = {
	title: 'Estética Jacaranda',
	description: 'Con Tailwind andando de verdad',
	manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<head>
				<link rel="manifest" href="/manifest.json" />
			</head>
			<html lang="es">
				<body className="antialiased text-white min-h-screen" suppressHydrationWarning>
					<SessionProvider>
						<RootLayoutClient>
							{children}
						</RootLayoutClient>
						<BarraFlotanteUsuarioWrapper />
						<CarritoFlotanteWrapper />
						<ChatWidget />
					</SessionProvider>
				</body>
			</html>
		</>
	)
}
