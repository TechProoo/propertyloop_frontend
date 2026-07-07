import api from "../client";
import type { EscrowStatus, VendorBankAccount, Bank, WithdrawResult } from "../types";

export interface InitializePaymentResponse {
  paymentUrl: string;
  reference: string;
}

export interface VerifyPaymentResponse {
  escrowStatus: EscrowStatus;
  jobId: string;
}

export interface SaveBankAccountPayload {
  accountName: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
}

const paymentsService = {
  async initializePayment(jobId: string): Promise<InitializePaymentResponse> {
    const { data } = await api.post<InitializePaymentResponse>(
      `/payments/initialize/${jobId}`
    );
    return data;
  },

  async verifyPayment(reference: string): Promise<VerifyPaymentResponse> {
    const { data } = await api.get<VerifyPaymentResponse>(
      `/payments/verify/${reference}`
    );
    return data;
  },

  async saveBankAccount(payload: SaveBankAccountPayload): Promise<VendorBankAccount> {
    const { data } = await api.post<VendorBankAccount>("/payments/bank-account", payload);
    return data;
  },

  async getBankAccount(): Promise<VendorBankAccount | null> {
    try {
      const { data } = await api.get<VendorBankAccount>("/payments/bank-account");
      return data;
    } catch (error) {
      return null;
    }
  },

  async listBanks(): Promise<Bank[]> {
    const { data } = await api.get<Bank[]>("/payments/banks");
    const list = Array.isArray(data) ? data : ((data as any)?.banks ?? (data as any)?.data ?? []);
    // Paystack's bank list can repeat the same code — dedupe so list keys stay unique.
    const seen = new Set<string>();
    return (list as Bank[]).filter((b) => {
      if (seen.has(b.code)) return false;
      seen.add(b.code);
      return true;
    });
  },

  /** Confirm the real account holder name before saving/paying to an account. */
  async resolveAccount(accountNumber: string, bankCode: string): Promise<{ accountName: string; accountNumber: string }> {
    const { data } = await api.get("/payments/resolve-account", {
      params: { account_number: accountNumber, bank_code: bankCode },
    });
    return {
      accountName: data.accountName ?? data.account_name,
      accountNumber: data.accountNumber ?? data.account_number,
    };
  },

  /** Vendor moves their available in-app balance to their bank. */
  async withdraw(): Promise<WithdrawResult> {
    const { data } = await api.post<WithdrawResult>("/payments/withdraw");
    return data;
  },
};

export default paymentsService;
