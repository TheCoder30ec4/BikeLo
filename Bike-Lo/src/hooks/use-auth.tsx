import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { loginApi, signupApi, meApi, refreshApi, setTokens, clearTokens } from "@/services/authService";
import type { UserResponse } from "@/types/api";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  status?: string;
}

function userFromResponse(u: UserResponse): User {
  return {
    id: String(u.id),
    email: u.email,
    name: u.name,
    phone: u.phone,
    role: u.role,
    status: u.status,
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<{ user: User; otp?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  /** Optional: after OTP verification (e.g. legacy flow); refreshes user from API. */
  verify: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "bikelo_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const u = await meApi();
      const next = userFromResponse(u);
      setUser(next);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(next));
    } catch {
      setUser(null);
      localStorage.removeItem(USER_STORAGE_KEY);
      clearTokens();
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem("bikelo_access_token");
    if (!token) {
      Promise.resolve().then(() => {
        setUser(null);
        setIsLoading(false);
      });
      return;
    }
    meApi()
      .then((u) => {
        if (!cancelled) {
          const next = userFromResponse(u);
          setUser(next);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(next));
        }
      })
      .catch(async () => {
        if (cancelled) return;
        try {
          await refreshApi();
          const u = await meApi();
          if (!cancelled) {
            const next = userFromResponse(u);
            setUser(next);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(next));
          }
        } catch {
          if (!cancelled) {
            setUser(null);
            localStorage.removeItem(USER_STORAGE_KEY);
            clearTokens();
          }
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email: string, password: string) => {
    const tokens = await loginApi(email, password);
    setTokens(tokens.access_token, tokens.refresh_token); // save to localStorage
    const u = await meApi();
    const next = userFromResponse(u);
    setUser(next);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(next));
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<{ user: User; otp?: string }> => {
    const tokens = await signupApi({
      name,
      email,
      password,
      phone: phone ?? "",
    });
    setTokens(tokens.access_token, tokens.refresh_token); // save to localStorage
    const u = await meApi();
    const next = userFromResponse(u);
    setUser(next);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(next));
    return { user: next };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    clearTokens();
  };

  const verify = async (_email: string) => {
    await refreshUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        refreshUser,
        verify,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
