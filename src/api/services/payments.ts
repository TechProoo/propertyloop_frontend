import api from "../client";
import type { EscrowStatus, VendorBankAccount, Bank } from "../types";

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
    return data;
  },
};

export default paymentsService;
