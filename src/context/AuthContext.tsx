import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface User {
  name: string;
  email: string;
  role: "buyer" | "agent" | "vendor";
  loggedIn: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (user: Omit<User, "loggedIn">) => void;
  logout: () => void;
  requireAuth: (redirectTo?: string) => boolean;
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
    const saved = localStorage.getItem("pl_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("pl_user");
      }
    }
    setLoading(false);
  }, []);

  const login = (data: Omit<User, "loggedIn">) => {
    const u = { ...data, loggedIn: true };
    setUser(u);
    localStorage.setItem("pl_user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pl_user");
  };

  const requireAuth = () => {
    if (!user?.loggedIn) {
      window.location.href = "/onboarding";
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user?.loggedIn, loading, login, logout, requireAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
