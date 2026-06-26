import api, { setToken, clearToken, getToken } from "@/lib/api";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  token: string;
}

// ── POST /auth/login ──────────────────────────────────────────────────────────
export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", {
    email,
    password,
  });
  return data;
}

// ── POST /auth/register ───────────────────────────────────────────────────────
export async function register(
  name: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>("/auth/register", {
    name,
    email,
    password,
  });
  return data;
}

// ── GET /auth/me ──────────────────────────────────────────────────────────────
export async function getMe(): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>("/auth/me");
  return data;
}

// ── POST /auth/forgot-password ────────────────────────────────────────────────
export async function forgotPassword(email: string): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>("/auth/forgot-password", {
    email,
  });
  return data;
}

// ── POST /auth/reset-password ─────────────────────────────────────────────────
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>("/auth/reset-password", {
    token,
    newPassword,
  });
  return data;
}

// ── Token helpers (re-exported for convenience) ───────────────────────────────
export { setToken, clearToken, getToken };
