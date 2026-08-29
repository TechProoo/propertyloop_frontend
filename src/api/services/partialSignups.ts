import api from "../client";

export type PartialSignupStep = "role" | "signup";

export interface CapturePartialSignupInput {
  email: string;
  name?: string;
  phone?: string;
  role?: "BUYER" | "AGENT" | "VENDOR";
  step?: PartialSignupStep;
}

const partialSignupsService = {
  /**
   * Record a signup-in-progress so an abandoned registration can be followed
   * up on. Fired in the background while the user is still on the form —
   * never awaited by the UI and never surfaces an error, because the user
   * didn't ask for this and a failure must not interrupt them.
   */
  capture(input: CapturePartialSignupInput): void {
    void api
      .post("/partial-signups", { ...input, source: "web" })
      .catch(() => {});
  },
};

export interface PartialSignup {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: "BUYER" | "AGENT" | "VENDOR" | null;
  /** Where it came from: "signup" (form abandoned) or "guest_modal". */
  step: string | null;
  source: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface PartialSignupPage {
  items: PartialSignup[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export const adminPartialSignups = {
  list: (page = 1, limit = 50, search?: string) =>
    api
      .get<PartialSignupPage>("/admin/partial-signups", {
        params: { page, limit, search },
      })
      .then((res) => res.data),

  remove: (id: string) =>
    api.delete(`/admin/partial-signups/${id}`).then((res) => res.data),

  /**
   * The export needs the admin bearer token, so it can't be a plain link —
   * pull the CSV as a blob and hand it to the browser as a download.
   */
  async downloadCsv(): Promise<void> {
    const res = await api.get("/admin/partial-signups/export", {
      responseType: "blob",
    });
    const url = URL.createObjectURL(new Blob([res.data], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "abandoned-signups.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },
};

export default partialSignupsService;
