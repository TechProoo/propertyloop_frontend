import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import authService, {
  type SignupPayload,
  type LoginPayload,
} from "../api/services/auth";
import { tokens } from "../api/client";
import type { User } from "../api/types";

export type { User, SignupPayload, LoginPayload };

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  signup: (payload: SignupPayload) => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = tokens.getAccess();
      const cached = tokens.getUser<User>();
      if (token && cached) {
        setUser(cached);
        try {
          const fresh = await authService.me();
          setUser(fresh);
        } catch {
          tokens.clear();
          setUser(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const signup = useCallback(async (payload: SignupPayload) => {
    const res = await authService.signup(payload);
    setUser(res.user);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await authService.login(payload);
    setUser(res.user);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const fresh = await authService.me();
      setUser(fresh);
    } catch { /* keep cached */ }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, loading, signup, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
