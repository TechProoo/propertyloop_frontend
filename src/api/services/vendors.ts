import api from "../client";
import type {
  Paginated,
  VendorPublic,
  VendorReview,
  VendorStats,
} from "../types";

export interface ListVendorsParams {
  search?: string;
  category?: string;
  location?: string;
  minRating?: number;
  sort?: "top_rated" | "most_jobs" | "price_asc" | "newest";
  page?: number;
  limit?: number;
}

export interface UpdateVendorProfilePayload {
  name?: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
  serviceCategory?: string;
  yearsExperience?: string;
  serviceArea?: string;
  priceLabel?: string;
  priceNum?: number;
  bannerImage?: string;
  portfolioImages?: string[];
  availableForHire?: boolean;
}

export interface CreateVendorReviewPayload {
  rating: number;
  comment: string;
  jobId?: string;
  jobTitle?: string;
  reviewerName?: string;
  reviewerAvatar?: string;
}

const vendorsService = {
  async list(params?: ListVendorsParams): Promise<Paginated<VendorPublic>> {
    const { data } = await api.get<Paginated<VendorPublic>>("/vendors", { params });
    return data;
  },

  async getById(id: string): Promise<VendorPublic & { reviews: VendorReview[] }> {
    const { data } = await api.get(`/vendors/${id}`);
    return data;
  },

  async getMe(): Promise<VendorPublic & { settings: unknown }> {
    const { data } = await api.get("/vendors/me");
    return data;
  },

  async updateMe(payload: UpdateVendorProfilePayload) {
    const { data } = await api.patch("/vendors/me", payload);
    return data;
  },

  async getStats(): Promise<VendorStats> {
    const { data } = await api.get<VendorStats>("/vendors/me/stats");
    return data;
  },

  async listReviews(vendorId: string): Promise<VendorReview[]> {
    const { data } = await api.get<VendorReview[]>(`/vendors/${vendorId}/reviews`);
    return data;
  },

  async createReview(vendorId: string, payload: CreateVendorReviewPayload): Promise<VendorReview> {
    const { data } = await api.post<VendorReview>(`/vendors/${vendorId}/reviews`, payload);
    return data;
  },
};

export default vendorsService;
