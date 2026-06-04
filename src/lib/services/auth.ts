import { ApiError, http } from '@/lib/api/http';
import type { AuthResponse, LoginDto, RegisterDto, User } from '@/types/auth';

const ME_CACHE_TTL_MS = 10_000;
const ME_429_BACKOFF_MS = 5_000;

let meInFlight: Promise<User> | null = null;
let meCache: { user: User; expiresAt: number } | null = null;
let meBackoffUntil = 0;

export const authService = {
  getMe: async () => {
    const now = Date.now();

    if (meCache && meCache.expiresAt > now) {
      return meCache.user;
    }

    if (meInFlight) {
      return meInFlight;
    }

    if (meBackoffUntil > now) {
      throw new ApiError(429, 'Too Many Requests');
    }

    meInFlight = http
      .get<User>('/api/auth/me', { cache: 'no-store' })
      .then((user) => {
        meCache = { user, expiresAt: Date.now() + ME_CACHE_TTL_MS };
        meBackoffUntil = 0;
        return user;
      })
      .catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 429) {
          meBackoffUntil = Date.now() + ME_429_BACKOFF_MS;
        }
        throw error;
      })
      .finally(() => {
        meInFlight = null;
      });

    return meInFlight;
  },

  login: async (data: LoginDto) => {
    const result = await http.post<AuthResponse>('/api/auth/login', data);
    meCache = { user: result.user, expiresAt: Date.now() + ME_CACHE_TTL_MS };
    meBackoffUntil = 0;
    return result;
  },

  register: async (data: RegisterDto) => {
    const result = await http.post<AuthResponse>('/api/auth/register', data);
    meCache = { user: result.user, expiresAt: Date.now() + ME_CACHE_TTL_MS };
    meBackoffUntil = 0;
    return result;
  },

  logout: async () => {
    meCache = null;
    meBackoffUntil = 0;

    const res = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (res.ok || res.status === 204) {
      return;
    }

    let message = res.statusText;
    try {
      const data = (await res.json()) as { message?: string | string[] };
      if (Array.isArray(data?.message)) {
        message = data.message.join(', ');
      } else if (data?.message) {
        message = data.message;
      }
    } catch {
      // sin body json
    }

    throw new ApiError(res.status, message);
  },

  changePassword: (currentPassword: string, newPassword: string) =>
    http.patch<void>('/api/auth/change-password', { currentPassword, newPassword }),
};
