import api from "../client";
import type { Paginated, RentalApplication } from "../types";

export interface CreateRentalApplicationPayload {
  listingId: string;
  applicantName: string;
  applicantPhone: string;
  applicantEmail?: string;
  deposit: number;
  agencyFee: number;
  legalFee: number;
  leaseDuration: string;
  startDate: string;
  paymentMethod?: string;
}

const rentalApplicationsService = {
  async create(payload: CreateRentalApplicationPayload): Promise<RentalApplication> {
    const { data } = await api.post<RentalApplication>("/rental-applications", payload);
    return data;
  },

  async list(params?: { page?: number; limit?: number }): Promise<Paginated<RentalApplication>> {
    const { data } = await api.get<Paginated<RentalApplication>>("/rental-applications", { params });
    return data;
  },

  async getById(id: string): Promise<RentalApplication> {
    const { data } = await api.get<RentalApplication>(`/rental-applications/${id}`);
    return data;
  },

  async markDepositPaid(id: string): Promise<RentalApplication> {
    const { data } = await api.post<RentalApplication>(`/rental-applications/${id}/deposit-paid`);
    return data;
  },

  async sign(id: string): Promise<RentalApplication> {
    const { data } = await api.post<RentalApplication>(`/rental-applications/${id}/sign`);
    return data;
  },

  async cancel(id: string): Promise<RentalApplication> {
    const { data } = await api.post<RentalApplication>(`/rental-applications/${id}/cancel`);
    return data;
  },
};

export default rentalApplicationsService;
