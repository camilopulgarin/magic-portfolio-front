'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GoogleSignInButton } from '@/components/shared/GoogleSignInButton';
import { error as toastError } from '@/hooks/use-toast';
import { registerSchema, RegisterFormData } from '@/lib/schemas/auth';

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      await registerUser(data.email, data.password, data.fullName, data.username);
      router.push('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear la cuenta';
      toastError(message);
      setTimeout(() => setIsLoading(false), 800);
      return;
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md px-4 sm:px-6">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1
            className="font-manrope text-2xl sm:text-3xl font-bold text-foreground mb-2"
            style={{ letterSpacing: '-0.02em' }}
          >
            Únete a la élite
          </h1>
          <p className="text-muted-foreground text-sm">Crea tu cuenta para comenzar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-foreground">
              Nombre completo
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Juan Pérez"
              {...register('fullName')}
              className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
            />
            {errors.fullName && (
              <p className="text-xs text-red-400 mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-foreground">
              Nombre de usuario
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="juanperez"
              {...register('username')}
              className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
            />
            {errors.username && (
              <p className="text-xs text-red-400 mt-1">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Correo electrónico
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              {...register('email')}
              className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              {...register('password')}
              className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
            />
            {errors.password && (
              <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-foreground">
              Confirmar contraseña
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirma tu contraseña"
              {...register('confirmPassword')}
              className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card px-2 text-muted-foreground">O continúa con</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <GoogleSignInButton className="h-11 w-full bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-all" />
          <Button
            variant="outline"
            className="h-11 bg-white/5 border-white/10 text-foreground hover:bg-white/10 hover:text-foreground transition-all"
            disabled
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          ¿Ya tienes una cuenta?{' '}
          <Link
            href="/login"
            className="ml-1 text-primary hover:text-primary/80 font-bold transition-colors text-base"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
