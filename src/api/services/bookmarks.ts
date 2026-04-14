import api from "../client";
import type { Bookmark, BookmarkType, SuccessResponse } from "../types";

const bookmarksService = {
  async list(type?: BookmarkType): Promise<Bookmark[]> {
    const params = type ? { type } : undefined;
    const { data } = await api.get<Bookmark[]>("/bookmarks", { params });
    return data;
  },

  async toggle(entityId: string, type: BookmarkType): Promise<{ bookmarked: boolean; id: string }> {
    const { data } = await api.post<{ bookmarked: boolean; id: string }>("/bookmarks/toggle", { entityId, type });
    return data;
  },

  async check(entityId: string, type: BookmarkType): Promise<{ bookmarked: boolean }> {
    const { data } = await api.get<{ bookmarked: boolean }>("/bookmarks/check", { params: { entityId, type } });
    return data;
  },

  async remove(id: string): Promise<SuccessResponse> {
    const { data } = await api.delete<SuccessResponse>(`/bookmarks/${id}`);
    return data;
  },
};

export default bookmarksService;
