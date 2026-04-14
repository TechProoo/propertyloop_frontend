import { useState, useEffect, useCallback } from "react";
import agentsService, { type ListAgentsParams } from "../services/agents";
import type { AgentPublic, Paginated } from "../types";

export function useAgents(initialParams?: ListAgentsParams) {
  const [params, setParams] = useState<ListAgentsParams>(initialParams ?? {});
  const [data, setData] = useState<Paginated<AgentPublic>>({ items: [], total: 0, page: 1, limit: 24, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (p: ListAgentsParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await agentsService.list(p);
      setData(res);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load agents");
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(params); }, [params, fetch]);

  const updateParams = useCallback((updates: Partial<ListAgentsParams>) => {
    setParams((prev) => ({ ...prev, ...updates, page: updates.page ?? 1 }));
  }, []);

  return { ...data, loading, error, params, updateParams, refetch: () => fetch(params) };
}
