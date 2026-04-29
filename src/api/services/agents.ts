import api from "../client";
import type { AgentPublic, AgentReview, AgentStats, Paginated } from "../types";

export interface ListAgentsParams {
  search?: string;
  specialty?: string;
  location?: string;
  minRating?: number;
  sort?:
    | "top_rated"
    | "most_listings"
    | "most_deals"
    | "top_performers"
    | "newest";
  page?: number;
  limit?: number;
}

export interface UpdateAgentProfilePayload {
  name?: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
  agencyName?: string;
  businessAddress?: string;
  yearsExperience?: number;
  specialty?: string[];
  website?: string;
}

export interface CreateAgentReviewPayload {
  rating: number;
  comment: string;
  reviewerName?: string;
}

const agentsService = {
  async list(params?: ListAgentsParams): Promise<Paginated<AgentPublic>> {
    const { data } = await api.get<Paginated<AgentPublic>>("/agents", {
      params,
    });
    return data;
  },

  async getById(
    id: string,
  ): Promise<
    AgentPublic & {
      bio?: string;
      activeListings: unknown[];
      reviews: AgentReview[];
    }
  > {
    const { data } = await api.get(`/agents/${id}`);
    return data;
  },

  async getMe(): Promise<
    AgentPublic & {
      licenseNumber: string;
      businessAddress: string;
      settings: unknown;
    }
  > {
    const { data } = await api.get("/agents/me");
    return data;
  },

  async updateMe(payload: UpdateAgentProfilePayload) {
    const { data } = await api.patch("/agents/me", payload);
    return data;
  },

  async getStats(): Promise<AgentStats> {
    const { data } = await api.get<AgentStats>("/agents/me/stats");
    return data;
  },

  async listReviews(agentId: string): Promise<AgentReview[]> {
    const { data } = await api.get<AgentReview[]>(`/agents/${agentId}/reviews`);
    return data;
  },

  async createReview(
    agentId: string,
    payload: CreateAgentReviewPayload,
  ): Promise<AgentReview> {
    const { data } = await api.post<AgentReview>(
      `/agents/${agentId}/reviews`,
      payload,
    );
    return data;
  },
};

export default agentsService;
