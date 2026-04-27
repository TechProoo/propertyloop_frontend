import api from "../client";

export interface WaitlistPrefill {
  wlId: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: "buyer" | "agent" | "vendor";
  activated: boolean;
}

const waitlistService = {
  async prefill(token: string): Promise<WaitlistPrefill> {
    const { data } = await api.get<WaitlistPrefill>("/waitlist/prefill", {
      params: { token },
    });
    return data;
  },

  async activate(wlId: string): Promise<void> {
    await api.patch(`/waitlist/${wlId}/activate`);
  },
};

export default waitlistService;
