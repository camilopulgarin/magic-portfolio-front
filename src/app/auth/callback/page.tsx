import { redirect } from 'next/navigation';
import { authService } from '@/lib/services/auth';

export const dynamic = 'force-dynamic';

export default async function AuthCallbackPage() {
  // El backend ya seteó las cookies httpOnly antes de redirigir aquí.
  // Verificamos sesión server-side y redirigimos al dashboard.
  try {
    await authService.getMe();
  } catch {
    redirect('/login?error=oauth_failed');
  }

  redirect('/dashboard');
}
