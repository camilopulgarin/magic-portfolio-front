import { api, clearTokens, getTokens, setTokens } from "./client";
import type { AuthResponse, LoginDto, RegisterDto, UserResponse } from "./types";

export const authApi = {
  async register(data: RegisterDto): Promise<AuthResponse> {
    clearTokens();
    const { data: response } = await api.post<AuthResponse>("/auth/register", data);
    setTokens({ accessToken: response.accessToken, refreshToken: response.refreshToken });
    return response;
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    clearTokens();
    const { data: response } = await api.post<AuthResponse>("/auth/login", data);
    setTokens({ accessToken: response.accessToken, refreshToken: response.refreshToken });
    return response;
  },

  async logout(): Promise<void> {
    const tokens = getTokens();
    try {
      await api.post("/auth/logout", { refreshToken: tokens?.refreshToken });
    } catch {
    } finally {
      clearTokens();
    }
  },

  async getMe(): Promise<UserResponse> {
    const { data } = await api.get<UserResponse>("/auth/me");
    return data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.patch("/auth/change-password", {
      currentPassword,
      newPassword,
    });
  },

  isAuthenticated(): boolean {
    return !!getTokens();
  },
};

export function getServerToken(cookies: string | null): string | undefined {
  if (!cookies) return undefined;
  const match = cookies.match(/accessToken=([^;]+)/);
  return match?.[1];
}