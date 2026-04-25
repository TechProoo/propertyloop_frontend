import api from "../client";
import type {
  Listing,
  ListingDocument,
  ListingStatus,
  ListingType,
  Paginated,
  SuccessResponse,
} from "../types";

export interface ListListingsParams {
  type?: ListingType;
  propertyType?: string;
  location?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  minBaths?: number;
  status?: ListingStatus;
  sort?: "newest" | "price_asc" | "price_desc" | "top_rated";
  page?: number;
  limit?: number;
}

export interface CreateListingPayload {
  title: string;
  type: ListingType;
  propertyType: string;
  priceNaira: number;
  period?: string;
  address: string;
  location: string;
  beds: number;
  baths: number;
  sqft: string;
  yearBuilt: string;
  description: string;
  features: string[];
  coverImage: string;
  images: string[];
  virtualTourUrl?: string;
  videoUrl?: string;
}

export interface UpdateListingPayload extends Partial<CreateListingPayload> {
  status?: ListingStatus;
}

export interface AddDocumentPayload {
  name: string;
  type: "C_OF_O" | "SURVEY_PLAN" | "BUILDING_PERMIT" | "RECEIPT";
  url?: string;
  date?: string;
}

const listingsService = {
  async list(params?: ListListingsParams): Promise<Paginated<Listing>> {
    const { data } = await api.get<Paginated<Listing>>("/listings", { params });
    return data;
  },

  async getStats(type: "SALE" | "RENT") {
    const { data } = await api.get(`/listings/stats/${type}`);
    return data;
  },

  async getById(id: string): Promise<Listing> {
    const { data } = await api.get<Listing>(`/listings/${id}`);
    return data;
  },

  async getBySlug(slug: string): Promise<Listing> {
    const { data } = await api.get<Listing>(`/listings/slug/${slug}`);
    return data;
  },

  async listMine(params?: ListListingsParams): Promise<Paginated<Listing>> {
    const { data } = await api.get<Paginated<Listing>>("/listings/me/all", { params });
    return data;
  },

  async create(payload: CreateListingPayload): Promise<Listing> {
    const { data } = await api.post<Listing>("/listings", payload);
    return data;
  },

  async update(id: string, payload: UpdateListingPayload): Promise<Listing> {
    const { data } = await api.patch<Listing>(`/listings/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<SuccessResponse> {
    const { data } = await api.delete<SuccessResponse>(`/listings/${id}`);
    return data;
  },

  async addDocument(listingId: string, payload: AddDocumentPayload): Promise<ListingDocument> {
    const { data } = await api.post<ListingDocument>(`/listings/${listingId}/documents`, payload);
    return data;
  },

  async removeDocument(listingId: string, docId: string): Promise<SuccessResponse> {
    const { data } = await api.delete<SuccessResponse>(`/listings/${listingId}/documents/${docId}`);
    return data;
  },
};

export default listingsService;
