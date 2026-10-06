import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Marketplace cart — persisted in localStorage so items survive refreshes and
 * tab switches without needing an authenticated session. Scoped to the new
 * storefront marketplace so it never conflicts with the legacy `/cart` page.
 */

const STORAGE_KEY = "pl-marketplace-cart.v1";

export type CartItem = {
  productId: string;
  storeSlug: string;
  storeName: string;
  name: string;
  priceNaira: number;
  image: string;
  quantity: number;
  options?: Record<string, string>;
};

type CartContextShape = {
  items: CartItem[];
  count: number;
  subtotal: number;
  itemsByStore: { storeSlug: string; storeName: string; items: CartItem[]; subtotal: number }[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

const StoreCartContext = createContext<CartContextShape | null>(null);

function readFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is CartItem =>
        x &&
        typeof x.productId === "string" &&
        typeof x.storeSlug === "string" &&
        typeof x.priceNaira === "number" &&
        typeof x.quantity === "number",
    );
  } catch {
    return [];
  }
}

export function StoreCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota or private-mode errors — cart falls back to in-memory */
    }
  }, [items, hydrated]);

  const addItem = useCallback<CartContextShape["addItem"]>((item) => {
    const quantity = item.quantity ?? 1;
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [...prev, { ...item, quantity }];
    });
  }, []);

  const removeItem = useCallback<CartContextShape["removeItem"]>((productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const setQuantity = useCallback<CartContextShape["setQuantity"]>(
    (productId, quantity) => {
      setItems((prev) => {
        if (quantity <= 0) return prev.filter((i) => i.productId !== productId);
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity } : i,
        );
      });
    },
    [],
  );

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextShape>(() => {
    const count = items.reduce((n, i) => n + i.quantity, 0);
    const subtotal = items.reduce((n, i) => n + i.priceNaira * i.quantity, 0);
    const bySlug = new Map<
      string,
      { storeSlug: string; storeName: string; items: CartItem[]; subtotal: number }
    >();
    for (const i of items) {
      const bucket = bySlug.get(i.storeSlug) ?? {
        storeSlug: i.storeSlug,
        storeName: i.storeName,
        items: [],
        subtotal: 0,
      };
      bucket.items.push(i);
      bucket.subtotal += i.priceNaira * i.quantity;
      bySlug.set(i.storeSlug, bucket);
    }
    return {
      items,
      count,
      subtotal,
      itemsByStore: Array.from(bySlug.values()),
      addItem,
      removeItem,
      setQuantity,
      clear,
    };
  }, [items, addItem, removeItem, setQuantity, clear]);

  return (
    <StoreCartContext.Provider value={value}>
      {children}
    </StoreCartContext.Provider>
  );
}

export function useStoreCart(): CartContextShape {
  const ctx = useContext(StoreCartContext);
  if (!ctx) {
    throw new Error(
      "useStoreCart must be used inside a <StoreCartProvider />. Wrap your app in App.tsx.",
    );
  }
  return ctx;
}
