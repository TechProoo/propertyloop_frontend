import api from "../client";
import type { Paginated, Product } from "../types";

export interface ListProductsParams {
  search?: string;
  category?: string;
  location?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "top_rated";
  page?: number;
  limit?: number;
}

const productsService = {
  async list(params?: ListProductsParams): Promise<Paginated<Product>> {
    const { data } = await api.get<Paginated<Product>>("/products", { params });
    return data;
  },

  async getById(id: string): Promise<Product> {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
  },

  async getBySlug(slug: string): Promise<Product> {
    const { data } = await api.get<Product>(`/products/slug/${slug}`);
    return data;
  },
};

export default productsService;
