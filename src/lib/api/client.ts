import axios, { AxiosError, type AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { CLIENT_API_URL } from './config';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export const api = axios.create({
  baseURL: `${CLIENT_API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Esto es CRÍTICO para enviar y recibir cookies httpOnly
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Axios se encargará automáticamente de enviar las cookies httpOnly gracias a withCredentials: true.
    // No necesitamos añadir headers de autorización manualmente.
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiError>) => {
    // En un 401, simplemente rechazamos la promesa.
    // El AuthProvider, al llamar a authApi.getMe(), capturará este error
    // y se encargará de limpiar el estado del usuario.
    // No redirigimos ni manejamos el refresh aquí; todo eso es responsabilidad del backend.
    return Promise.reject(error);
  }
);