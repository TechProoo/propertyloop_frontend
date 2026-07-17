import api from "../client";

const adminService = {
  getOverview: () =>
    api.get("/admin/overview").then((res) => res.data),

  listUsers: (page: number = 1, limit: number = 50, search?: string) =>
    api
      .get("/admin/users", {
        params: { page, limit, search },
      })
      .then((res) => res.data),

  // Kick one user off all their devices (they stay in for ≤15 min until
  // their access token expires, then the silent refresh fails → /login).
  forceLogoutUser: (userId: string) =>
    api
      .post<{ revokedTokens: number; revokedSessions: number }>(
        `/admin/users/${userId}/logout-all`,
      )
      .then((res) => res.data),

  // Site-wide session reset — logs every user out except the acting admin.
  forceLogoutEveryone: () =>
    api
      .post<{ revokedTokens: number; revokedSessions: number }>(
        "/admin/users/logout-everyone",
      )
      .then((res) => res.data),

  listOrders: (page: number = 1, limit: number = 50, status?: string) =>
    api
      .get("/admin/orders", {
        params: { page, limit, status },
      })
      .then((res) => res.data),

  listDisputes: (page: number = 1, limit: number = 50, status?: string) =>
    api
      .get("/admin/disputes", {
        params: { page, limit, status },
      })
      .then((res) => res.data),
};

export default adminService;
