import axios from "axios";
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
  website?: string;
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

  async getPublicStats() {
    const { data } = await api.get("/vendors/stats");
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

  /**
   * Direct-to-R2 upload for a vendor portfolio image (or banner). Asks the
   * backend for a presigned PUT URL, uploads the bytes straight to R2, and
   * returns the public file URL the caller can persist.
   */
  async uploadPortfolioImage(
    file: File,
    kind: "portfolio" | "banner" = "portfolio",
  ): Promise<string> {
    const { data: presign } = await api.post<{
      uploadUrl: string;
      fileUrl: string;
      key: string;
    }>("/vendors/me/portfolio/presign", {
      filename: file.name,
      contentType: file.type || "image/jpeg",
      size: file.size,
      kind,
    });
    await axios.put(presign.uploadUrl, file, {
      headers: { "Content-Type": file.type || "image/jpeg" },
      timeout: 10 * 60 * 1000,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });
    return presign.fileUrl;
  },
};

export default vendorsService;
