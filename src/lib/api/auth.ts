const API_URL = "/api";

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  username: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

export interface TokensResponse {
  accessToken: string;
  refreshToken: string;
}

class AuthApi {
  private getTokens(): { accessToken: string; refreshToken: string } | null {
    if (typeof window === "undefined") return null;
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    if (!accessToken || !refreshToken) return null;
    return { accessToken, refreshToken };
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    document.cookie = `accessToken=${accessToken}; path=/; max-age=${15 * 60}; SameSite=Lax`;
    document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  }

  private clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    document.cookie = "accessToken=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "refreshToken=; path=/; max-age=0; SameSite=Lax";
  }

  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Registration failed");
    }

    const result: AuthResponse = await response.json();
    this.setTokens(result.accessToken, result.refreshToken);
    return result;
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Invalid email or password");
    }

    const result: AuthResponse = await response.json();
    this.setTokens(result.accessToken, result.refreshToken);
    return result;
  }

  async logout(): Promise<void> {
    const tokens = this.getTokens();
    if (!tokens) return;

    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      });
    } catch {
    } finally {
      this.clearTokens();
    }
  }

  async getMe(): Promise<UserResponse> {
    const tokens = this.getTokens();
    if (!tokens) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    if (!response.ok) {
      this.clearTokens();
      throw new Error("Session expired");
    }

    return response.json();
  }

  isAuthenticated(): boolean {
    return !!this.getTokens();
  }

  static getServerToken(cookies: string | null): string | undefined {
    if (!cookies) return undefined;
    const match = cookies.match(/accessToken=([^;]+)/);
    return match?.[1];
  }
}

export const authApi = new AuthApi();