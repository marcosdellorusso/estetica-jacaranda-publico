import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { authConfig } from './auth.config';
import pool from '@/db/index';

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	...authConfig,
	providers: [
		Credentials({
			async authorize(credentials) {
				
				const parsed = z.object({
					dni: z.string().min(1),
					password: z.string().min(1),
				}).safeParse(credentials);

				if (!parsed.success){
					 return null;
				}

				const { dni, password } = parsed.data;
				const { rows } = await pool.query('SELECT * FROM usuarios WHERE dni = $1', [dni]);
				const user = rows[0];
				
				if (!user) return null;

				const ok = await bcrypt.compare(password, user.password); // compara con bcrypt (hash)
				
				return ok ? user : null;
			},
		}),
	],
	callbacks: {
		// https://stackoverflow.com/questions/77322613/how-can-i-update-the-next-auth-session-every-time-a-page-reloads-by-getting-data
		// Este callback se ejecuta cada vez que se crea una sesión.
		// Permite modificar el objeto de sesión antes de enviarlo al cliente.
		async session({ session, token, user }) {
			// Obtiene el rol, dni, nombre, apellido, telefono y fecha_nacimiento del usuario desde diferentes fuentes posibles.
			const role = (user && (user as any).rol) || (token && (token as any).rol) || session.user?.role;
			const dni = (user && (user as any).dni) || (token && (token as any).dni) || session.user?.dni;
			const name = (user && (user as any).nombre) || (token && (token as any).nombre) || session.user?.name;
			const apellido = (user && (user as any).apellido) || (token && (token as any).apellido) || session.user?.apellido;
			const telefono = (user && (user as any).telefono) || (token && (token as any).telefono) || session.user?.telefono;
			const fecha_nacimiento = (user && (user as any).fecha_nacimiento) || (token && (token as any).fecha_nacimiento) || session.user?.fecha_nacimiento;
			if (session.user) {
				session.user.role = role;
				session.user.dni = dni;
				session.user.name = name;
				session.user.apellido = apellido;
				session.user.telefono = telefono;
				session.user.fecha_nacimiento = fecha_nacimiento;
			}
			return session;
		},
		// Este callback se ejecuta cada vez que se genera o actualiza un JWT.
		// Permite agregar información personalizada al token.
		async jwt({ token, user }) {
			// Si el usuario tiene un rol, lo agrega al token.
			if (user && (user as any).rol) {
				token.rol = (user as any).rol;
			}
			if (user && (user as any).dni) {
				token.dni = (user as any).dni;
			}
			if (user && (user as any).nombre) {
				token.name = (user as any).nombre;
				token.nombre = (user as any).nombre;
			}
			if (user && (user as any).apellido) {
				token.apellido = (user as any).apellido;
			}
			if (user && (user as any).telefono) {
				token.telefono = (user as any).telefono;
			}
			if (user && (user as any).fecha_nacimiento) {
				token.fecha_nacimiento = (user as any).fecha_nacimiento;
			}
			return token;
		},
		// ...puedes mantener otros callbacks existentes...
		...(authConfig.callbacks || {})
	},
} as NextAuthConfig);