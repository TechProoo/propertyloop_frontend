import { useState, useEffect, useCallback } from "react";
import listingsService, { type ListListingsParams } from "../services/listings";
import type { Listing, Paginated } from "../types";

export function useListings(initialParams?: ListListingsParams) {
  const [params, setParams] = useState<ListListingsParams>(initialParams ?? {});
  const [data, setData] = useState<Paginated<Listing>>({ items: [], total: 0, page: 1, limit: 24, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (p: ListListingsParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await listingsService.list(p);
      setData(res);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load listings");
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(params); }, [params, fetch]);

  const updateParams = useCallback((updates: Partial<ListListingsParams>) => {
    setParams((prev) => ({ ...prev, ...updates, page: updates.page ?? 1 }));
  }, []);

  const nextPage = useCallback(() => {
    if (data.page < data.pages) setParams((p) => ({ ...p, page: (p.page ?? 1) + 1 }));
  }, [data.page, data.pages]);

  const prevPage = useCallback(() => {
    if ((params.page ?? 1) > 1) setParams((p) => ({ ...p, page: (p.page ?? 1) - 1 }));
  }, [params.page]);

  return { ...data, loading, error, params, updateParams, nextPage, prevPage, refetch: () => fetch(params) };
}
