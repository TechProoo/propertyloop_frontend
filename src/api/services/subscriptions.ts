import api from "../client";

export interface SubscriptionInfo {
  status: "ACTIVE" | "LAPSED" | "CANCELLED" | null;
  accessUntil: string | null;
  amountKobo: number;
  paystackSubscriptionCode: string | null;
  pendingReference: string | null;
}

export interface SubscriptionPayment {
  id: string;
  amountKobo: number;
  status: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
}

const subscriptionsService = {
  async get(): Promise<SubscriptionInfo> {
    const { data } = await api.get<SubscriptionInfo>("/agents/me/subscription");
    return data;
  },

  async checkout(): Promise<{ paymentUrl: string | null; reference: string }> {
    const { data } = await api.post("/agents/me/subscription/checkout", {});
    return data;
  },

  async verify(
    reference: string,
  ): Promise<{ paymentStatus: string; accessUntil: string | null }> {
    const { data } = await api.get(
      `/payments/subscription/verify/${encodeURIComponent(reference)}`,
    );
    return data;
  },

  async cancel(): Promise<void> {
    await api.post("/agents/me/subscription/cancel", {});
  },

  async payments(): Promise<SubscriptionPayment[]> {
    const { data } = await api.get<SubscriptionPayment[]>(
      "/agents/me/subscription/payments",
    );
    return data;
  },
};

export default subscriptionsService;
