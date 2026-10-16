import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// Extiende la sesión y el usuario para incluir el rol

declare module "next-auth" {
  interface Session {
    user?: {
      role?: string;
      name?: string | null;
      email?: string | null;
      [key: string]: any;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    role?: string;
  }
}
