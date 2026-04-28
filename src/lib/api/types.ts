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