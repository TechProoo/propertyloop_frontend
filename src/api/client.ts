import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

// ─── Base config ────────────────────────────────────────────────────────────

export const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ─── Token helpers ──────────────────────────────────────────────────────────

const TOKEN_KEYS = {
  access: "pl_access_token",
  refresh: "pl_refresh_token",
  user: "pl_user",
} as const;

export const tokens = {
  getAccess: () => localStorage.getItem(TOKEN_KEYS.access),
  getRefresh: () => localStorage.getItem(TOKEN_KEYS.refresh),

  set(access: string, refresh: string) {
    localStorage.setItem(TOKEN_KEYS.access, access);
    localStorage.setItem(TOKEN_KEYS.refresh, refresh);
  },

  clear() {
    localStorage.removeItem(TOKEN_KEYS.access);
    localStorage.removeItem(TOKEN_KEYS.refresh);
    localStorage.removeItem(TOKEN_KEYS.user);
  },

  setUser(user: unknown) {
    localStorage.setItem(TOKEN_KEYS.user, JSON.stringify(user));
  },

  getUser<T = unknown>(): T | null {
    const raw = localStorage.getItem(TOKEN_KEYS.user);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
};

// ─── Request interceptor: attach Bearer token ───────────────────────────────

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokens.getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor: silent token refresh on 401 ──────────────────────

let refreshPromise: Promise<string> | null = null;

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (!original) return Promise.reject(error);

    const isAuthRoute = original.url?.includes("/auth/");
    const shouldRetry =
      error.response?.status === 401 && !original._retry && !isAuthRoute;

    if (!shouldRetry) return Promise.reject(error);

    original._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const rt = tokens.getRefresh();
          if (!rt) throw new Error("No refresh token");

          const { data } = await axios.post(`${API_BASE}/auth/refresh`, {
            refreshToken: rt,
          });

          tokens.set(data.accessToken, data.refreshToken);
          if (data.user) tokens.setUser(data.user);
          return data.accessToken as string;
        })();
      }

      const newAccessToken = await refreshPromise;
      refreshPromise = null;

      original.headers = {
        ...original.headers,
        Authorization: `Bearer ${newAccessToken}`,
      };
      return api(original);
    } catch {
      refreshPromise = null;
      tokens.clear();
      window.location.href = "/login";
      return Promise.reject(error);
    }
  },
);

export default api;
