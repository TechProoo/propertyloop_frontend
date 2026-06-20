import api from "../client";

export type SubTier = "FREE" | "FOUNDING" | "STANDARD" | "PRO";
export type SubStatus = "ACTIVE" | "LAPSED" | "CANCELLED";

export interface SubscriptionInfo {
  tier: SubTier | null;
  status: SubStatus | null;
  renewsAt: string | null;
  paystackSubscriptionCode: string | null;
}

export interface SubscriptionPayment {
  id: string;
  tier: SubTier;
  amountKobo: number;
  status: string; // "success" | "failed" | "pending"
  billingPeriodStart: string;
  billingPeriodEnd: string;
  createdAt: string;
}

const subscriptionsService = {
  /** Current agent's live subscription state. */
  async get(): Promise<SubscriptionInfo> {
    const { data } = await api.get<SubscriptionInfo>("/agents/me/subscription");
    return data;
  },

  /**
   * Start a Paystack checkout for a paid tier. Returns the authorization URL
   * to redirect the browser to. STANDARD = ₦5,000/mo, PRO (Premium) = ₦20,000/mo.
   */
  async checkout(
    tier: "STANDARD" | "PRO",
  ): Promise<{ paymentUrl: string; reference: string }> {
    const { data } = await api.post("/agents/me/subscription/checkout", { tier });
    return data;
  },

  /** Cancel the active subscription — the agent drops to the Free plan. */
  async cancel(): Promise<{ success: boolean }> {
    const { data } = await api.post("/agents/me/subscription/cancel", {});
    return data;
  },

  /** Past subscription charges, newest first. */
  async payments(): Promise<SubscriptionPayment[]> {
    const { data } = await api.get<SubscriptionPayment[]>(
      "/agents/me/subscription/payments",
    );
    return data;
  },
};

export default subscriptionsService;
