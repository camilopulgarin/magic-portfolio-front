'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { error as toastError } from '@/hooks/use-toast';
import { authService } from '@/lib/services/auth';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/lib/schemas/auth';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [enteredEmail, setEnteredEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      await authService.forgotPassword(data);
      setEnteredEmail(data.email);
      setIsEmailSent(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al enviar el correo';
      toastError(message);
      setTimeout(() => setIsLoading(false), 800);
      return;
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md px-4 sm:px-6">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8  shadow-2xl">
        {!isEmailSent ? (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-muted-foreground"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  <path d="M12 15v2" />
                  <path d="M9.5 13.5L12 16l2.5-2.5" />
                </svg>
              </div>
            </div>

            <div className="text-center mb-6 sm:mb-8">
              <h1
                className="font-manrope text-2xl sm:text-3xl font-bold text-foreground mb-2"
                style={{ letterSpacing: '-0.02em' }}
              >
                Recuperar contraseña
              </h1>
              <p className="text-muted-foreground text-sm">
                Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu
                contraseña
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Correo electrónico
                </Label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 4L12 13L2 4" />
                  </svg>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    {...register('email')}
                    className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary pl-10"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-secondary text-secondary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
              </Button>
            </form>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-secondary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              </div>
            </div>

            <div className="text-center mb-6 sm:mb-8">
              <h1
                className="font-manrope text-2xl sm:text-3xl font-bold text-foreground mb-2"
                style={{ letterSpacing: '-0.02em' }}
              >
                ¡Correo enviado!
              </h1>
              <p className="text-muted-foreground text-sm">
                Hemos enviado un enlace de recuperación a{' '}
                <span className="text-foreground font-medium">{enteredEmail}</span>. Revisa tu
                bandeja de entrada y sigue las instrucciones.
              </p>
            </div>

            <p className="text-center text-xs text-muted-foreground mb-6">
              ¿No recibiste el correo? Revisa tu carpeta de spam o{' '}
              <button
                type="button"
                onClick={() => setIsEmailSent(false)}
                className="text-secondary hover:text-secondary/80 transition-colors"
              >
                Intentar de nuevo
              </button>
            </p>
          </>
        )}

        <div className="flex justify-center mt-4">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="M12 19L5 12L12 5" />
            </svg>
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
