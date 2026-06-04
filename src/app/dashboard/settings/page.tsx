'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { success, error as toastError } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { authService } from '@/lib/services/auth';

type Tab = 'general' | 'password' | 'security';

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

type PasswordStrength = 'weak' | 'medium' | 'strong';

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('password');
  const [formData, setFormData] = useState<FormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const getPasswordStrength = (password: string): PasswordStrength => {
    if (!password) return 'weak';
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 1) return 'weak';
    if (score <= 2) return 'medium';
    return 'strong';
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const passwordsMatch =
    formData.newPassword === formData.confirmPassword && formData.confirmPassword.length > 0;
  const strength = getPasswordStrength(formData.newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.newPassword !== formData.confirmPassword) {
        toastError('Las contraseñas no coinciden');
        setIsLoading(false);
        return;
      }

      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
        toastError('La contraseña debe contener al menos una mayúscula, una minúscula y un número');
        setIsLoading(false);
        return;
      }

      await authService.changePassword(formData.currentPassword, formData.newPassword);

      success('Contraseña actualizada correctamente');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar la contraseña';
      toastError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'general' as Tab, label: 'General', icon: 'settings' },
    { id: 'password' as Tab, label: 'Cambiar Contraseña', icon: 'lock' },
    { id: 'security' as Tab, label: 'Seguridad', icon: 'security' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ajustes</h1>
        <p className="text-muted-foreground mt-1">
          Administra la configuración y preferencias de tu cuenta.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="border-b border-border">
          <nav className="flex gap-1 p-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {tab.icon === 'settings' && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.834 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.834 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.834-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.834-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                  )}
                  {tab.icon === 'lock' && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                    />
                  )}
                  {tab.icon === 'security' && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 002 12c0 6.083 3.39 11.741 8.382 12.869a11.955 11.955 0 01-8.382-3.04z"
                    />
                  )}
                </svg>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Ajustes Generales</h2>
                <p className="text-muted-foreground text-sm">
                  Configura las preferencias de tu cuenta.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Cambiar Contraseña</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Mantén tu cuenta segura con una contraseña fuerte.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
                <div className="space-y-2">
                  <Label
                    htmlFor="currentPassword"
                    className="text-primary text-xs font-semibold uppercase tracking-wider"
                  >
                    Contraseña Actual
                  </Label>
                  <div className="relative group">
                    <Input
                      id="currentPassword"
                      type={showPasswords.current ? 'text' : 'password'}
                      value={formData.currentPassword}
                      onChange={(e) => handleChange('currentPassword', e.target.value)}
                      placeholder="Ingresa tu contraseña actual"
                      required
                      className="bg-card/50 border border-border rounded-xl py-4 px-5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary/20 group-focus-within:bg-primary transition-all duration-300" />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords((prev) => ({ ...prev, current: !prev.current }))
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showPasswords.current ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="newPassword"
                    className="text-primary text-xs font-semibold uppercase tracking-wider"
                  >
                    Nueva Contraseña
                  </Label>
                  <div className="relative group">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? 'text' : 'password'}
                      value={formData.newPassword}
                      onChange={(e) => handleChange('newPassword', e.target.value)}
                      placeholder="Ingresa la nueva contraseña"
                      required
                      className="bg-card/50 border border-border rounded-xl py-4 px-5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary/20 group-focus-within:bg-primary transition-all duration-300" />
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Fortaleza:{' '}
                        <span
                          className={
                            strength === 'strong'
                              ? 'text-secondary'
                              : strength === 'medium'
                                ? 'text-yellow-500'
                                : 'text-red-500'
                          }
                        >
                          {strength === 'strong'
                            ? 'Fuerte'
                            : strength === 'medium'
                              ? 'Media'
                              : 'Débil'}
                        </span>
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground italic">
                        mín 8 caracteres
                      </span>
                    </div>
                    <div className="flex gap-1 h-1">
                      <div
                        className={`flex-1 rounded-full ${strength === 'weak' ? 'bg-red-500' : strength === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}
                      />
                      <div
                        className={`flex-1 rounded-full ${strength === 'weak' ? 'bg-muted' : strength === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}
                      />
                      <div className="flex-1 bg-muted rounded-full" />
                      <div className="flex-1 bg-muted rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-primary text-xs font-semibold uppercase tracking-wider"
                  >
                    Confirmar Nueva Contraseña
                  </Label>
                  <div className="relative group">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      placeholder="Repite la nueva contraseña"
                      required
                      className="bg-card/50 border border-border rounded-xl py-4 px-5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary/20 group-focus-within:bg-primary transition-all duration-300" />
                    {passwordsMatch && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-secondary"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-2 17l-5-5 1.414-1.414L11 14.586l7.293-7.293 1.414 1.414-8.707 8.707z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {passwordsMatch && (
                    <p className="text-[10px] font-medium text-secondary pl-1">
                      Las contraseñas coinciden
                    </p>
                  )}
                </div>

                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground font-bold text-lg shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      'Actualizando...'
                    ) : (
                      <>
                        Actualizar Contraseña
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                          />
                        </svg>
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                  >
                    ¿Olvidaste tu contraseña actual?
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Seguridad</h2>
                <p className="text-muted-foreground text-sm">
                  Administra tu configuración de seguridad y 2FA.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
