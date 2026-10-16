// auth.config.ts
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;

      if (isLoggedIn && path === '/login') {
        return Response.redirect(new URL('/inicio', nextUrl));
      }

      if (path === '/login') {
        return true;
      }

      return isLoggedIn;
    },
  },
  providers: [],
} satisfies NextAuthConfig;