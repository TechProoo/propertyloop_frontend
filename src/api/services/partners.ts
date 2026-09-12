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
};

export default partnersService;
