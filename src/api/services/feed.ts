import api from "../client";
import type { Paginated } from "../types";

export type FeedPostType =
  | "UPDATE"
  | "INSIGHT"
  | "PROJECT"
  | "TIP"
  | "NEWS"
  | "POLL"
  | "LISTING";

export interface FeedAuthor {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: "BUYER" | "AGENT" | "VENDOR" | "ADMIN";
  location: string | null;
  verified: boolean;
  agency: string | null;
  serviceCategory: string | null;
}

export interface FeedListingCard {
  id: string;
  slug: string;
  title: string;
  priceLabel: string;
  period?: string | null;
  address: string;
  location: string;
  beds: number;
  baths: number;
  sqft: string | null;
  coverImage: string;
  type: "SALE" | "RENT" | "SHORTLET";
}

export interface FeedPollOption {
  id: string;
  text: string;
  votes: number;
}

export interface FeedPost {
  id: string;
  type: FeedPostType;
  body: string;
  images: string[];
  createdAt: string;
  author: FeedAuthor;
  listing: FeedListingCard | null;
  insight: {
    metric: string;
    period: string | null;
    delta: string | null;
    bars: number[];
  } | null;
  project: {
    name: string;
    location: string | null;
    units: string | null;
  } | null;
  poll: {
    endsAt: string | null;
    totalVotes: number;
    options: FeedPollOption[];
  } | null;
  likesCount: number;
  commentsCount: number;
  viewer: {
    liked: boolean;
    saved: boolean;
    votedOptionId: string | null;
    followingAuthor: boolean;
    isAuthor: boolean;
  };
}

export interface FeedComment {
  id: string;
  body: string;
  parentId: string | null;
  createdAt: string;
  author: FeedAuthor;
  replies?: FeedComment[];
}

export interface FeedMeta {
  roles: { role: string; count: number }[];
  trending: { tag: string; count: number }[];
  savedCount: number;
  suggestions: (FeedAuthor & { followersCount: number })[];
}

export interface FeedUserProfile {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: "BUYER" | "AGENT" | "VENDOR" | "ADMIN";
  location: string | null;
  bio: string | null;
  createdAt: string;
  verified: boolean;
  agency: string | null;
  website: string | null;
  businessAddress: string | null;
  specialty: string[];
  serviceCategory: string | null;
  serviceArea: string | null;
  rating: number | null;
  listingsCount: number | null;
  soldRentedCount: number | null;
  jobsCount: number | null;
  counts: { posts: number; followers: number; following: number };
  viewer: { following: boolean; isSelf: boolean };
}

export interface CreateFeedPostPayload {
  type?: FeedPostType;
  body: string;
  images?: string[];
  listingId?: string;
  insightMetric?: string;
  insightPeriod?: string;
  insightDelta?: string;
  insightBars?: number[];
  projectName?: string;
  projectLocation?: string;
  projectUnits?: string;
  pollOptions?: string[];
}

const feedService = {
  async list(params?: {
    filter?: string;
    hashtag?: string;
    page?: number;
    limit?: number;
  }): Promise<Paginated<FeedPost>> {
    const { data } = await api.get<Paginated<FeedPost>>("/feed", { params });
    return data;
  },

  async meta(): Promise<FeedMeta> {
    const { data } = await api.get<FeedMeta>("/feed/meta");
    return data;
  },

  async userProfile(userId: string): Promise<FeedUserProfile> {
    const { data } = await api.get<FeedUserProfile>(`/feed/users/${userId}`);
    return data;
  },

  async userPosts(
    userId: string,
    params?: { page?: number; limit?: number },
  ): Promise<Paginated<FeedPost>> {
    const { data } = await api.get<Paginated<FeedPost>>(
      `/feed/users/${userId}/posts`,
      { params },
    );
    return data;
  },

  async create(payload: CreateFeedPostPayload): Promise<FeedPost> {
    const { data } = await api.post<FeedPost>("/feed", payload);
    return data;
  },

  async remove(postId: string): Promise<{ deleted: boolean }> {
    const { data } = await api.delete(`/feed/${postId}`);
    return data;
  },

  async toggleLike(postId: string): Promise<{ liked: boolean; count: number }> {
    const { data } = await api.post(`/feed/${postId}/like`);
    return data;
  },

  async toggleSave(postId: string): Promise<{ saved: boolean }> {
    const { data } = await api.post(`/feed/${postId}/save`);
    return data;
  },

  async vote(
    postId: string,
    optionId: string,
  ): Promise<{
    votedOptionId: string;
    totalVotes: number;
    options: FeedPollOption[];
  }> {
    const { data } = await api.post(`/feed/${postId}/vote`, { optionId });
    return data;
  },

  async comments(postId: string): Promise<FeedComment[]> {
    const { data } = await api.get(`/feed/${postId}/comments`);
    return data;
  },

  async addComment(
    postId: string,
    body: string,
    parentId?: string,
  ): Promise<FeedComment> {
    const { data } = await api.post(`/feed/${postId}/comments`, {
      body,
      parentId,
    });
    return data;
  },

  async toggleFollow(userId: string): Promise<{ following: boolean }> {
    const { data } = await api.post(`/feed/follow/${userId}`);
    return data;
  },

  async report(postId: string, reason?: string): Promise<{ reported: boolean }> {
    const { data } = await api.post(`/feed/${postId}/report`, { reason });
    return data;
  },

  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post<{ url: string }>(
      "/upload/feed-image",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data;
  },
};

export default feedService;
