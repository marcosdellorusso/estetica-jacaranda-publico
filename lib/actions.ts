'use server'
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate (_prev: any, form: FormData) {
  try {
    await signIn('credentials', form);
  } catch (err) {
    if (err instanceof AuthError && err.type === 'CredentialsSignin') {
      return 'Credenciales inválidas';
    }
    throw err;
  }
}