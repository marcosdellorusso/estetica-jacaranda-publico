import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
	matcher: [
		// Protege TODO menos login, registro, manifest y los directorios donde ponés estáticos
		'/((?!login|registro|api|_next/static|_next/image|videos|images|fonts|favicon.ico|robots.txt|sitemap.xml|manifest.json|pwa.js|web-push-service-worker.js).*)'
	],
};