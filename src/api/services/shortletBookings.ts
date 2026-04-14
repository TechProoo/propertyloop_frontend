import api from "../client";
import type { Paginated, ShortletBooking } from "../types";

export interface CreateShortletBookingPayload {
  listingId: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  guests: number;
  checkIn: string;
  checkOut: string;
  paymentMethod?: string;
}

const shortletBookingsService = {
  async create(
    payload: CreateShortletBookingPayload,
  ): Promise<ShortletBooking> {
    const { data } = await api.post<ShortletBooking>(
      "/shortlet-bookings",
      payload,
    );
    return data;
  },

  async list(params?: {
    page?: number;
    limit?: number;
  }): Promise<Paginated<ShortletBooking>> {
    const { data } = await api.get<Paginated<ShortletBooking>>(
      "/shortlet-bookings",
      { params },
    );
    return data;
  },

  async getById(id: string): Promise<ShortletBooking> {
    const { data } = await api.get<ShortletBooking>(`/shortlet-bookings/${id}`);
    return data;
  },

  async cancel(id: string): Promise<ShortletBooking> {
    const { data } = await api.post<ShortletBooking>(
      `/shortlet-bookings/${id}/cancel`,
    );
    return data;
  },
};

export default shortletBookingsService;
