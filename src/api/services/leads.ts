import api from "../client";
import type { Lead, LeadStatus, Paginated, SuccessResponse } from "../types";

export interface CreateLeadPayload {
  listingId: string;
  name: string;
  email?: string;
  phone: string;
  message?: string;
  source?: string;
}

export interface UpdateLeadPayload {
  status?: LeadStatus;
  notes?: string;
}

const leadsService = {
  async create(payload: CreateLeadPayload): Promise<Lead> {
    const { data } = await api.post<Lead>("/leads", payload);
    return data;
  },

  async list(params?: { status?: LeadStatus; page?: number; limit?: number }): Promise<Paginated<Lead>> {
    const { data } = await api.get<Paginated<Lead>>("/leads", { params });
    return data;
  },

  async getById(id: string): Promise<Lead> {
    const { data } = await api.get<Lead>(`/leads/${id}`);
    return data;
  },

  async update(id: string, payload: UpdateLeadPayload): Promise<Lead> {
    const { data } = await api.patch<Lead>(`/leads/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<SuccessResponse> {
    const { data } = await api.delete<SuccessResponse>(`/leads/${id}`);
    return data;
  },
};

export default leadsService;
