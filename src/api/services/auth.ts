import api, { tokens, refreshSession } from "../client";
import type { AuthResponse, Session, SuccessResponse, User } from "../types";

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "BUYER" | "AGENT" | "VENDOR";
  buyer?: { preferredLocations?: string };
  agent?: { agencyName: string; licenseNumber: string; businessAddress: string };
  vendor?: { serviceCategory: string; yearsExperience: string; serviceArea: string };
}

export interface LoginPayload {
  email: string;
  password: string;
}

const authService = {
  async signup(payload: SignupPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/signup", payload);
    // refreshToken is no longer in the response body — the backend sets it
    // as an HttpOnly cookie. Only the access token comes back in JSON.
    tokens.setAccess(data.accessToken);
    tokens.setUser(data.user);
    return data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    tokens.setAccess(data.accessToken);
    tokens.setUser(data.user);
    return data;
  },

  async me(): Promise<User> {
    const { data } = await api.get<User>("/auth/me");
    tokens.setUser(data);
    return data;
  },

  async refresh(): Promise<void> {
    // Delegate to the shared single-flight refresh in client.ts so the
    // bootstrap refresh and any concurrent 401-triggered refresh collapse into
    // ONE network call (and one token rotation). Token + user caching and
    // cross-tab broadcast are handled inside refreshSession().
    await refreshSession();
  },

  async logout(): Promise<void> {
    // Backend clears the cookie. Nothing to send.
    try {
      await api.post("/auth/logout", {});
    } catch {
      /* noop */
    }
    tokens.clear();
  },

  async logoutAll(): Promise<void> {
    await api.post("/auth/logout-all");
    tokens.clear();
  },

  async forgotPassword(email: string): Promise<SuccessResponse> {
    const { data } = await api.post<SuccessResponse>("/auth/forgot-password", { email });
    return data;
  },

  async verifyResetCode(email: string, code: string): Promise<SuccessResponse> {
    const { data } = await api.post<SuccessResponse>("/auth/verify-reset-code", { email, code });
    return data;
  },

  async resetPassword(email: string, code: string, password: string): Promise<SuccessResponse> {
    const { data } = await api.post<SuccessResponse>("/auth/reset-password", { email, code, password });
    return data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<SuccessResponse> {
    const { data } = await api.post<SuccessResponse>("/auth/change-password", { currentPassword, newPassword });
    return data;
  },

  async verifyEmail(token: string): Promise<SuccessResponse> {
    const { data } = await api.post<SuccessResponse>("/auth/verify-email", { token });
    return data;
  },

  async resendVerification(): Promise<SuccessResponse> {
    const { data } = await api.post<SuccessResponse>("/auth/resend-verification");
    return data;
  },

  async resendVerificationPublic(email: string): Promise<SuccessResponse> {
    const { data } = await api.post<SuccessResponse>(
      "/auth/resend-verification-public",
      { email },
    );
    return data;
  },

  async listSessions(): Promise<Session[]> {
    const { data } = await api.get<Session[]>("/auth/sessions");
    return data;
  },

  async revokeSession(sessionId: string): Promise<SuccessResponse> {
    const { data } = await api.delete<SuccessResponse>(`/auth/sessions/${sessionId}`);
    return data;
  },
};

export default authService;
