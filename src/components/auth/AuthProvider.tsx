'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, UserResponse } from '@/lib/api/auth';
import { setTokens } from '@/lib/api/client';
import { success, error } from '@/hooks/use-toast';

interface AuthContextType {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // 1. Intenta con localStorage (login normal)
      if (authApi.isAuthenticated()) {
        try {
          const userData = await authApi.getMe();
          setUser(userData);
        } catch {
          authApi.logout();
        } finally {
          setIsLoading(false);
        }
        return;
      }

      // ✨ NUEVO: 2. Intenta con cookies httpOnly (login con Google)
      try {
        const res = await fetch('/api/auth/tokens');
        if (res.ok) {
          const tokens = await res.json();
          setTokens(tokens); // sincroniza cookies → localStorage
          const userData = await authApi.getMe();
          setUser(userData);
        }
      } catch {
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authApi.login({ email, password });
    setUser(result.user);
    success(`Bienvenido, ${result.user.fullName}!`);
  };

  const register = async (email: string, password: string, fullName: string, username: string) => {
    const result = await authApi.register({ email, password, fullName, username });
    setUser(result.user);
    success(`Cuenta creada para ${result.user.fullName}!`);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    success('Sesión cerrada correctamente');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
