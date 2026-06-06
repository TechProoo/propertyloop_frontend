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
import SplashLoader from "../components/ui/SplashLoader";
import type { User } from "../api/types";

export type { User, SignupPayload, LoginPayload };

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  signup: (payload: SignupPayload) => Promise<User>;
  login: (payload: LoginPayload) => Promise<User>;
  logout: () => Promise<void>;
  /** Logs out showing a full-screen loader, then redirects to /login. */
  logoutWithRedirect: () => Promise<void>;
  loggingOut: boolean;
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
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Optimistic paint: show the cached user immediately if we have one,
      // so the navbar isn't a flash of logged-out UI on every reload.
      const cached = tokens.getUser<User>();
      if (cached) setUser(cached);

      // We have no access token in memory after a fresh page load (refresh
      // tokens are now HttpOnly cookies, not localStorage). Call /auth/refresh
      // to mint a new access token from the cookie. If the cookie is missing
      // or expired the call 401s and we treat the user as logged out.
      try {
        await authService.refresh();
        // Once we have an access token, hydrate the user from /auth/me.
        const fresh = await authService.me();
        setUser(fresh);
      } catch {
        tokens.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // No proactive refresh interval — the access token is refreshed on demand
  // whenever a request 401s. Both this bootstrap refresh and the 401
  // interceptor go through the SAME single-flight refreshSession() in
  // client.ts, so concurrent refreshes collapse into one token rotation.
  // A second, independent refresh path here previously raced the interceptor
  // and tripped the backend's refresh-token reuse detection, which revoked the
  // entire session — that path no longer exists.

  const signup = useCallback(async (payload: SignupPayload) => {
    const res = await authService.signup(payload);
    setUser(res.user);
    return res.user;
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await authService.login(payload);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const logoutWithRedirect = useCallback(async () => {
    setLoggingOut(true);
    try {
      await authService.logout();
    } catch {
      /* logout already clears local tokens; redirect regardless */
    }
    setUser(null);
    // Full reload to /login so all auth-dependent state resets cleanly.
    window.location.href = "/login";
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const fresh = await authService.me();
      setUser(fresh);
    } catch { /* keep cached */ }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loading,
        signup,
        login,
        logout,
        logoutWithRedirect,
        loggingOut,
        refreshUser,
      }}
    >
      {loggingOut && <SplashLoader message="Signing you out..." />}
      {children}
    </AuthContext.Provider>
  );
};
