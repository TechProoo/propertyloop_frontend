import api from "../client";

/**
 * Agent Partner Programme registration.
 *
 * Deliberately split into "who you are" and "how we pay you". The first half
 * is all that is needed to join the directory; the payout half can be left
 * until later, because asking a stranger for their NIN and bank details
 * before they have agreed to anything loses most of them at the first screen.
 */

export interface PartnerPayoutDetails {
  /** R2 URL from the upload service, not the file itself. */
  passportPhotoUrl?: string;
  bankCode?: string;
  bankName?: string;
  accountNumber?: string;
  /** Resolved from Paystack, never typed by hand. */
  accountName?: string;
  nin?: string;
  tin?: string;
  /** Lagos State LIRS Payer ID for individuals. */
  payerId?: string;
  dateOfBirth?: string;
  residentialAddress?: string;
  residentialState?: string;
  /** CAC registration number, for partners registered as a company. */
  rcNumber?: string;
}

export interface PartnerRegistration extends PartnerPayoutDetails {
  fullName: string;
  whatsapp: string;
  email: string;
  experience?: "NEW" | "ONE_TO_THREE" | "THREE_PLUS";
  agencyName?: string;
  operatingState?: string;
  /** The partner code of whoever sent them the link. */
  referredByCode?: string;
  /** Explicit, timestamped by the server on arrival. */
  consentedToTerms: boolean;
}

export interface PartnerRegistrationResult {
  /** Human-readable partner number, e.g. AGT-4192. */
  partnerCode: string;
  /** Their own referral link, to pass on. */
  referralUrl: string;
  email: string;
  /** True when payout details are complete enough to be paid. */
  payoutReady: boolean;
}

/* ─── After registration ─────────────────────────────────────────────────
 * A partner is an ordinary AGENT account with an AgentPartner record attached.
 * These answer only for that account; anyone else gets a 403, which is read
 * as "not a partner yet" rather than as an error. Shapes match the app.
 */

export type PartnerStatus =
  | "NEW"
  | "CONTACTED"
  | "VERIFIED"
  | "ACTIVE"
  | "DORMANT"
  | "REJECTED";

export type PartnerCommissionStatus = "PENDING" | "APPROVED" | "PAID" | "REJECTED";

export interface PartnerCommission {
  id: string;
  listing: string | null;
  amountNaira: number;
  status: PartnerCommissionStatus;
  createdAt: string;
  paidAt: string | null;
}

export interface PartnerMe {
  code: string;
  status: PartnerStatus;
  referralUrl: string;
  payoutReady: boolean;
  /** Exactly what is still missing, e.g. ["NIN", "bank account"]. */
  payoutGaps: string[];
  introductions: number;
  commissions: PartnerCommission[];
}

/** PropertyLoop's own published stock — what a partner is here to sell. */
export interface HouseListing {
  id: string;
  slug: string;
  title: string;
  location: string;
  address: string;
  type: "SALE" | "RENT" | "SHORTLET";
  propertyType: string;
  priceNaira: number;
  priceLabel: string;
  beds: number;
  baths: number;
  /** Empty until photos are uploaded — render a placeholder, not a broken image. */
  coverImage: string;
  verified: boolean;
}

export interface HouseInventory {
  items: HouseListing[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  /** What a partner earns on a sale, as a percentage. */
  commissionPercent: number;
}

export interface IntroduceBuyerPayload {
  name: string;
  phone: string;
  email?: string;
  message?: string;
}

const partnersService = {
  async register(
    payload: PartnerRegistration,
  ): Promise<PartnerRegistrationResult> {
    const { data } = await api.post<PartnerRegistrationResult>(
      "/partners/register",
      payload,
    );
    return data;
  },

  /** Checks a referral code belongs to a real partner before we credit them. */
  async checkReferral(
    code: string,
  ): Promise<{ valid: boolean; partnerName?: string }> {
    try {
      const { data } = await api.get<{ valid: boolean; partnerName?: string }>(
        "/partners/referral-check",
        { params: { code } },
      );
      return data;
    } catch {
      // A referral code that cannot be checked must never block a signup —
      // the worst case is an uncredited referral, which is recoverable.
      return { valid: false };
    }
  },
  /**
   * The signed-in agent's partnership, or null when they have not joined.
   * Only a 403 means "not a partner"; anything else is a real failure and is
   * thrown, so a network problem is not mistaken for "you never registered".
   */
  async me(): Promise<PartnerMe | null> {
    try {
      const { data } = await api.get<PartnerMe>("/partners/me");
      return data;
    } catch (e) {
      const status = (e as { response?: { status?: number } })?.response?.status;
      if (status === 403 || status === 404) return null;
      throw e;
    }
  },

  /** Published PropertyLoop stock. Needs a partner account. */
  async inventory(
    params: { page?: number; limit?: number; state?: string } = {},
  ): Promise<HouseInventory> {
    const { data } = await api.get<HouseInventory>("/partners/inventory", {
      params,
    });
    return data;
  },

  /**
   * Record a buyer against a stock listing. This is the attribution, and it
   * happens BEFORE the sale — afterwards "I brought that buyer" is only a
   * claim. The same person twice returns the original introduction.
   */
  async introduce(
    listingId: string,
    payload: IntroduceBuyerPayload,
  ): Promise<{ leadId: string; duplicate: boolean }> {
    const { data } = await api.post<{ leadId: string; duplicate: boolean }>(
      `/partners/inventory/${listingId}/introduce`,
      payload,
    );
    return data;
  },

};

export default partnersService;
