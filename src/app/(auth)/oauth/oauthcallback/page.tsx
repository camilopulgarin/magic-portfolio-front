import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { error as toastError } from '@/hooks/use-toast';
// Placeholder de icono: reemplazar con el componente de icono real si existe
import { Card, CardContent } from '@/components/ui/card';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Usuario autenticado, redirigir al dashboard y reemplazar el historial
        router.replace('/dashboard');
      } else {
        // No autenticado después de cargar, mostrar error y redirigir al login y reemplazar el historial
        toastError('No se pudo iniciar sesión con Google. Inténtalo de nuevo.');
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center justify-center p-8">
          {/* Asume la existencia de Icons.spinner. Si no, usa un texto simple o un spinner de shadcn/ui. */}
          <div className="h-10 w-10 border-t-2 border-primary border-solid rounded-full animate-spin" />
          <p className="mt-4 text-muted-foreground">Iniciando sesión con Google...</p>
        </CardContent>
      </Card>
    </div>
  );
}
