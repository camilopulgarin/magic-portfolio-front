import { api } from './client';
import type { AuthResponse, LoginDto, RegisterDto, UserResponse } from './types';

export const authApi = {
  async register(data: RegisterDto): Promise<AuthResponse> {
    // El backend gestiona completamente la emisión de cookies httpOnly en su respuesta.
    const { data: response } = await api.post<AuthResponse>('/auth/register', data);
    return response;
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    // El backend gestiona completamente la emisión de cookies httpOnly en su respuesta.
    const { data: response } = await api.post<AuthResponse>('/auth/login', data);
    return response;
  },

  async logout(): Promise<void> {
    try {
      // Llama al endpoint de logout del backend.
      // El backend invalidará la sesión y limpiará las cookies httpOnly.
      await api.post('/auth/logout'); // Asumiendo que el backend tiene este endpoint
    } catch (err) {
      console.error("Error al cerrar sesión en el backend:", err);
    }
    // No hay lógica de limpieza de tokens del lado del cliente aquí.
    // AuthProvider se encargará de limpiar su estado local `user`.
  },

  async getMe(): Promise<UserResponse> {
    const { data } = await api.get<UserResponse>('/auth/me');
    return data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.patch('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },
};