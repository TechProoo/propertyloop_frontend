import api from "../client";
import type { Order, OrderPaymentMethod, Paginated } from "../types";

export interface CreateOrderPayload {
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
  payMethod: OrderPaymentMethod;
  items: { productId: string; quantity: number }[];
}

const ordersService = {
  async create(payload: CreateOrderPayload): Promise<Order> {
    const { data } = await api.post<Order>("/orders", payload);
    return data;
  },

  async list(params?: { page?: number; limit?: number }): Promise<Paginated<Order>> {
    const { data } = await api.get<Paginated<Order>>("/orders", { params });
    return data;
  },

  async getById(id: string): Promise<Order> {
    const { data } = await api.get<Order>(`/orders/${id}`);
    return data;
  },

  async getByOrderNumber(orderNumber: string): Promise<Order> {
    const { data } = await api.get<Order>(`/orders/number/${orderNumber}`);
    return data;
  },
};

export default ordersService;
