'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { error as toastError } from '@/hooks/use-toast';
import { authService } from '@/lib/services/auth';
import { resetPasswordSchema, ResetPasswordFormData } from '@/lib/schemas/auth';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toastError('Token de recuperación no válido');
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword({ token, password: data.password });
      setIsPasswordReset(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al restablecer la contraseña';
      toastError(message);
      setTimeout(() => setIsLoading(false), 800);
      return;
    }
    setIsLoading(false);
  };

  if (!token) {
    return (
      <div className="w-full max-w-md px-4 sm:px-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-red-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M15 9L9 15" />
                <path d="M9 9L15 15" />
              </svg>
            </div>
          </div>

          <div className="text-center mb-6 sm:mb-8">
            <h1
              className="font-manrope text-2xl sm:text-3xl font-bold text-foreground mb-2"
              style={{ letterSpacing: '-0.02em' }}
            >
              Enlace no válido
            </h1>
            <p className="text-muted-foreground text-sm">
              El enlace de recuperación no es válido o ha expirado. Solicita uno nuevo.
            </p>
          </div>

          <div className="flex justify-center">
            <Link
              href="/forgot-password"
              className="text-sm text-secondary hover:text-secondary/80 transition-colors inline-flex items-center gap-2"
            >
              Solicitar nuevo enlace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md px-4 sm:px-6">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
        {!isPasswordReset ? (
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
                Nueva contraseña
              </h1>
              <p className="text-muted-foreground text-sm">
                Ingresa tu nueva contraseña para restablecer el acceso a tu cuenta
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Nueva contraseña
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
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Ingresa tu nueva contraseña"
                    {...register('password')}
                    className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary pl-10"
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Confirmar contraseña
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
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirma tu nueva contraseña"
                    {...register('confirmPassword')}
                    className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary pl-10"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-secondary text-secondary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? 'Restableciendo...' : 'Restablecer contraseña'}
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
                  <path d="M20 6L9 17L4 12" />
                </svg>
              </div>
            </div>

            <div className="text-center mb-6 sm:mb-8">
              <h1
                className="font-manrope text-2xl sm:text-3xl font-bold text-foreground mb-2"
                style={{ letterSpacing: '-0.02em' }}
              >
                ¡Contraseña restablecida!
              </h1>
              <p className="text-muted-foreground text-sm">
                Tu contraseña ha sido actualizada correctamente. Ya puedes iniciar sesión con tu nueva contraseña.
              </p>
            </div>
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
