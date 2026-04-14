import { useState, useEffect, useCallback } from "react";
import vendorsService, { type ListVendorsParams } from "../services/vendors";
import type { VendorPublic, Paginated } from "../types";

export function useVendors(initialParams?: ListVendorsParams) {
  const [params, setParams] = useState<ListVendorsParams>(initialParams ?? {});
  const [data, setData] = useState<Paginated<VendorPublic>>({ items: [], total: 0, page: 1, limit: 24, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (p: ListVendorsParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await vendorsService.list(p);
      setData(res);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load vendors");
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(params); }, [params, fetch]);

  const updateParams = useCallback((updates: Partial<ListVendorsParams>) => {
    setParams((prev) => ({ ...prev, ...updates, page: updates.page ?? 1 }));
  }, []);

  return { ...data, loading, error, params, updateParams, refetch: () => fetch(params) };
}
