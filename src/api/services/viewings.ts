import api from "../client";
import type { Paginated, SuccessResponse, Viewing, ViewingStatus } from "../types";

export interface CreateViewingPayload {
  listingId: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  scheduledFor: string;
  notes?: string;
}

export interface UpdateViewingPayload {
  status?: ViewingStatus;
  scheduledFor?: string;
  notes?: string;
}

const viewingsService = {
  async create(payload: CreateViewingPayload): Promise<Viewing> {
    const { data } = await api.post<Viewing>("/viewings", payload);
    return data;
  },

  async list(params?: { status?: ViewingStatus; upcoming?: boolean; page?: number; limit?: number }): Promise<Paginated<Viewing>> {
    const { data } = await api.get<Paginated<Viewing>>("/viewings", { params });
    return data;
  },

  async listMine(params?: { status?: ViewingStatus; upcoming?: boolean; page?: number; limit?: number }): Promise<Paginated<Viewing>> {
    const { data } = await api.get<Paginated<Viewing>>("/viewings/me", { params });
    return data;
  },

  async cancelMine(id: string): Promise<Viewing> {
    const { data } = await api.post<Viewing>(`/viewings/me/${id}/cancel`);
    return data;
  },

  async update(id: string, payload: UpdateViewingPayload): Promise<Viewing> {
    const { data } = await api.patch<Viewing>(`/viewings/${id}`, payload);
    return data;
  },

  async cancel(id: string): Promise<Viewing> {
    const { data } = await api.post<Viewing>(`/viewings/${id}/cancel`);
    return data;
  },

  async remove(id: string): Promise<SuccessResponse> {
    const { data } = await api.delete<SuccessResponse>(`/viewings/${id}`);
    return data;
  },
};

export default viewingsService;
