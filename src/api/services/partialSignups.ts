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

export default partialSignupsService;
