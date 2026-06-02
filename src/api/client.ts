import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  reportNetworkError,
  reportNetworkRecover,
} from "../hooks/useOnlineStatus";

// ─── Base config ────────────────────────────────────────────────────────────

export const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE,
  // 90s default — Render free-tier cold starts can take 40–60s on the first
  // request after idle; 30s killed presign/create calls before the dyno had
  // a chance to boot. Per-request overrides (e.g. R2 PUTs at 10min) still apply.
  timeout: 90_000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ─── Token helpers ──────────────────────────────────────────────────────────
//
// Refresh token lives in an HttpOnly Secure cookie set by the backend —
// unreadable from JS, immune to XSS exfiltration. The access token lives
// only in memory: short-lived, lost on full page reload, recovered by
// calling /auth/refresh during app bootstrap (see AuthContext).
//
// A non-sensitive `user` is cached in localStorage purely so the navbar
// can render the correct UI on first paint without waiting for /auth/me.

const USER_CACHE_KEY = "pl_user";

let accessToken: string | null = null;

export const tokens = {
  getAccess: () => accessToken,

  setAccess(token: string | null) {
    accessToken = token;
  },

  clear() {
    accessToken = null;
    localStorage.removeItem(USER_CACHE_KEY);
  },

  setUser(user: unknown) {
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
  },

  getUser<T = unknown>(): T | null {
    const raw = localStorage.getItem(USER_CACHE_KEY);
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

// ─── Single-flight token refresh (+ cross-tab coordination) ─────────────────
//
// Refresh tokens are single-use and rotated on every /auth/refresh, so two
// refreshes carrying the same cookie make the backend think a token was
// replayed. To avoid that we guarantee at most ONE in-flight refresh:
//   - within a tab, every caller (the 401 interceptor AND the bootstrap in
//     AuthContext) shares the same `refreshPromise`;
//   - across tabs, a successful refresh broadcasts the new access token so
//     sibling tabs adopt it instead of firing their own refresh.

const authChannel =
  typeof BroadcastChannel !== "undefined"
    ? new BroadcastChannel("pl_auth")
    : null;

authChannel?.addEventListener("message", (e: MessageEvent) => {
  // A sibling tab refreshed — adopt its access token in memory. We set the
  // field directly (not via a broadcasting path) so this doesn't echo back.
  if (e.data?.type === "access" && typeof e.data.token === "string") {
    accessToken = e.data.token;
  }
});

let refreshPromise: Promise<string> | null = null;

export function refreshSession(): Promise<string> {
  if (!refreshPromise) {
    const p = (async () => {
      // Refresh token travels automatically as an HttpOnly cookie
      // (withCredentials: true). No body needed.
      const { data } = await axios.post(
        `${API_BASE}/auth/refresh`,
        {},
        { withCredentials: true },
      );
      tokens.setAccess(data.accessToken);
      if (data.user) tokens.setUser(data.user);
      authChannel?.postMessage({ type: "access", token: data.accessToken });
      return data.accessToken as string;
    })();
    refreshPromise = p;
    // Clear the slot once settled so the next refresh starts fresh. Attaching
    // handlers here (rather than in callers) keeps a single reset point and
    // swallows the rejection on this bookkeeping chain — callers still await
    // `p` directly and handle the error themselves.
    const clear = () => {
      if (refreshPromise === p) refreshPromise = null;
    };
    p.then(clear, clear);
  }
  return refreshPromise;
}

// ─── Response interceptor: silent token refresh on 401 ──────────────────────

api.interceptors.response.use(
  (res) => {
    reportNetworkRecover();
    return res;
  },
  async (error: AxiosError) => {
    // No response means the request never reached the server — offline,
    // DNS failure, CORS preflight blocked, server down, etc. Notify the
    // global offline boundary so it can surface the network-error page.
    if (!error.response) {
      reportNetworkError();
    }

    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (!original) return Promise.reject(error);

    // Only /auth/refresh and /auth/login should bypass refresh-on-401:
    //   - /auth/refresh failure means the refresh token is genuinely invalid;
    //     trying to refresh again would loop.
    //   - /auth/login 401 just means wrong credentials.
    // Everything else (including /auth/me, /auth/logout, /auth/sessions...)
    // is a normal authenticated request that should silently refresh.
    const url = original.url || "";
    const isRefreshOrLogin =
      url.includes("/auth/refresh") || url.includes("/auth/login");
    const shouldRetry =
      error.response?.status === 401 &&
      !original._retry &&
      !isRefreshOrLogin;

    if (!shouldRetry) return Promise.reject(error);

    original._retry = true;

    try {
      const newAccessToken = await refreshSession();
      original.headers = {
        ...original.headers,
        Authorization: `Bearer ${newAccessToken}`,
      };
      return api(original);
    } catch {
      tokens.clear();
      window.location.href = "/login";
      return Promise.reject(error);
    }
  },
);

export default api;
