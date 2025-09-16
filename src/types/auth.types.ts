// filepath: src/types/auth.types.ts
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  role?: "customer" | "admin" | "barista";
}

export interface AuthUser {
  id: string;
  username: string;
  role: "customer" | "admin" | "barista";
  accessToken: string;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;
}