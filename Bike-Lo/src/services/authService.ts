import {
  API_BASE,
  fetchWithAuth,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "@/lib/api";
import type {
  SignupRequest,
  TokenResponse,
  UserResponse,
  UpdateRoleRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/types/api";

export type { SignupRequest, TokenResponse, UserResponse };

async function parseJson<T = unknown>(res: Response): Promise<T> {
  const text = await res.text();
  let data: T;
  try {
    data = text ? (JSON.parse(text) as T) : ({} as T);
  } catch {
    throw new Error(text || res.statusText || "Invalid response");
  }
  if (!res.ok) {
    const msg = (data as any)?.detail ?? (data as any)?.message ?? text;
    throw new Error(Array.isArray(msg) ? msg.map((e: any) => e.msg || e).join(", ") : String(msg));
  }
  return data;
}

export async function signupApi(payload: SignupRequest): Promise<TokenResponse> {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      phone: payload.phone ?? "",
      role: payload.role ?? "user",
      status: payload.status ?? "active",
    }),
  });
  return parseJson<TokenResponse>(res);
}

export async function loginApi(email: string, password: string): Promise<TokenResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return parseJson<TokenResponse>(res);
}

export async function refreshApi(): Promise<TokenResponse> {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error("No refresh token");
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refresh }),
  });
  const data = await parseJson<TokenResponse>(res);
  setTokens(data.access_token, data.refresh_token);
  return data;
}

export async function meApi(): Promise<UserResponse> {
  const res = await fetchWithAuth("/auth/me");
  if (res.status === 401) throw new Error("Unauthorized");
  return parseJson<UserResponse>(res);
}

export async function forgotPasswordApi(payload: ForgotPasswordRequest): Promise<unknown> {
  const res = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

export async function resetPasswordApi(payload: ResetPasswordRequest): Promise<unknown> {
  const res = await fetch(`${API_BASE}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

export async function listUsersApi(): Promise<UserResponse[]> {
  const res = await fetchWithAuth("/auth/admin/users");
  if (!res.ok) {
    const text = await res.text();
    let detail: unknown;
    try {
      detail = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(text || "Failed to list users");
    }
    throw new Error((detail as any)?.detail ?? text);
  }
  return parseJson<UserResponse[]>(res);
}

export async function updateUserRoleApi(userId: number, payload: UpdateRoleRequest): Promise<UserResponse> {
  const res = await fetchWithAuth(`/auth/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    let detail: unknown;
    try {
      detail = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(text || "Failed to update role");
    }
    throw new Error((detail as any)?.detail ?? text);
  }
  return parseJson<UserResponse>(res);
}

export { getRefreshToken, setTokens, clearTokens };

/** Legacy/optional: verify OTP via external webhook (used by VerifyOTP page). */
export async function verifyOtpApi(email: string, otp: string): Promise<string> {
  const res = await fetch("https://n8n.ch-varun.xyz/webhook/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || "OTP verification failed");
  return text;
}
