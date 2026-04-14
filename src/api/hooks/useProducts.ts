import { useState, useEffect, useCallback } from "react";
import productsService, { type ListProductsParams } from "../services/products";
import type { Product, Paginated } from "../types";

export function useProducts(initialParams?: ListProductsParams) {
  const [params, setParams] = useState<ListProductsParams>(initialParams ?? {});
  const [data, setData] = useState<Paginated<Product>>({ items: [], total: 0, page: 1, limit: 24, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (p: ListProductsParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await productsService.list(p);
      setData(res);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load products");
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(params); }, [params, fetch]);

  const updateParams = useCallback((updates: Partial<ListProductsParams>) => {
    setParams((prev) => ({ ...prev, ...updates, page: updates.page ?? 1 }));
  }, []);

  return { ...data, loading, error, params, updateParams, refetch: () => fetch(params) };
}
