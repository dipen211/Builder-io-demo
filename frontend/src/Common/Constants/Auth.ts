export const AUTH_CONFIG = {
  TOKEN_EXPIRY_TIME: 3600000, // 1 hour in milliseconds
  REFRESH_THRESHOLD: 300000, // 5 minutes in milliseconds
  MAX_LOGIN_ATTEMPTS: 3,
  LOCKOUT_DURATION: 900000, // 15 minutes in milliseconds
} as const;

export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
} as const;

export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
  VIEWER: "viewer",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
