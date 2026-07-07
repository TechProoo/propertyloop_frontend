import api from "../client";
import type { JobDispute, JobStatus, Paginated, SuccessResponse, VendorJob } from "../types";

export interface CreateBookingPayload {
  vendorId: string;
  title: string;
  description: string;
  address: string;
  category?: string;
  vendorFee: number;
  scheduledFor: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  paymentMethod?: string;
  attachments?: string[];
}

export interface CompleteJobPayload {
  completionNotes?: string;
  completionProofImages?: string[];
}

export interface DisputeJobPayload {
  disputeReason: string;
}

const vendorJobsService = {
  /** Buyer books a vendor service */
  async createBooking(payload: CreateBookingPayload): Promise<VendorJob> {
    const { data } = await api.post<VendorJob>("/vendor-jobs", payload);
    return data;
  },

  /** Vendor lists their own jobs */
  async list(params?: { status?: JobStatus; page?: number; limit?: number }): Promise<Paginated<VendorJob>> {
    const { data } = await api.get<Paginated<VendorJob>>("/vendor-jobs", { params });
    return data;
  },

  /** Buyer lists their own bookings */
  async listMine(params?: { status?: JobStatus; page?: number; limit?: number }): Promise<Paginated<VendorJob>> {
    const { data } = await api.get<Paginated<VendorJob>>("/vendor-jobs/mine", { params });
    return data;
  },

  async getById(id: string): Promise<VendorJob> {
    const { data } = await api.get<VendorJob>(`/vendor-jobs/${id}`);
    return data;
  },

  // ─── Vendor state transitions ──────────────────────────────────────────

  async accept(id: string): Promise<VendorJob> {
    const { data } = await api.patch<VendorJob>(`/vendor-jobs/${id}/accept`);
    return data;
  },

  async decline(id: string): Promise<SuccessResponse> {
    const { data } = await api.patch<SuccessResponse>(`/vendor-jobs/${id}/decline`);
    return data;
  },

  async start(id: string): Promise<VendorJob> {
    const { data } = await api.patch<VendorJob>(`/vendor-jobs/${id}/start`);
    return data;
  },

  async complete(id: string, payload?: CompleteJobPayload): Promise<VendorJob> {
    const { data } = await api.patch<VendorJob>(`/vendor-jobs/${id}/complete`, payload);
    return data;
  },

  // ─── Buyer state transitions ───────────────────────────────────────────

  async confirm(id: string): Promise<VendorJob> {
    const { data } = await api.post<VendorJob>(`/vendor-jobs/${id}/confirm`);
    return data;
  },

  async dispute(id: string, payload: DisputeJobPayload): Promise<VendorJob> {
    const { data } = await api.post<VendorJob>(`/vendor-jobs/${id}/dispute`, payload);
    return data;
  },

  // ─── Dispute thread (both parties) ─────────────────────────────────────

  async getDispute(id: string): Promise<JobDispute> {
    const { data } = await api.get<JobDispute>(`/vendor-jobs/${id}/dispute`);
    return data;
  },

  async addDisputeMessage(
    id: string,
    body: string,
    attachments?: string[],
  ): Promise<JobDispute> {
    const { data } = await api.post<JobDispute>(`/vendor-jobs/${id}/dispute/messages`, {
      body,
      attachments,
    });
    return data;
  },
};

export default vendorJobsService;
