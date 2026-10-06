import api from "../client";
import type { StoreProduct, Storefront, StoreTeaser } from "../../data/storefronts";

/* ─── Shapes returned by the backend marketplace API ────────────────────── */

export type ProductWithStore = StoreProduct & {
  storeSlug: string;
  storeName: string;
  storeAccent: string;
};

export interface ListProductsParams {
  search?: string;
  category?: string;
  storeSlug?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "top_rated" | "popular";
  page?: number;
  limit?: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ProductDetail extends ProductWithStore {
  store: {
    ownerUserId?: string;
    slug: string;
    name: string;
    logo: string;
    accent: string;
    category: string;
    verified: boolean;
    ordersFulfilled: number;
    policies: Storefront["policies"];
    promo?: Storefront["promo"];
  };
  related: ProductWithStore[];
}

export interface CreateOrderPayload {
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  address: string;
  city: string;
  state: string;
  notes?: string;
  returnUrl?: string;
  items: { productId: string; quantity: number; options?: Record<string, string> }[];
}

export interface InitOrderResult {
  orderNumber: string;
  reference: string;
  paymentUrl: string;
  total: number;
}

export interface MarketplaceOrder {
  id: string;
  orderNumber: string;
  reference: string;
  status: "PENDING" | "PAID" | "FULFILLED" | "CANCELLED" | "REFUNDED";
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  address: string;
  city: string;
  state: string;
  notes?: string;
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  total: number;
  paidAt?: string;
  placedAt: string;
  items: {
    productId: string;
    storeId: string;
    storeName: string;
    name: string;
    image: string;
    unitPrice: number;
    quantity: number;
    options?: Record<string, string>;
    lineTotal: number;
  }[];
}

const marketplaceService = {
  // ─── Public catalogue ─────────────────────────────────────────────────
  async listStores(): Promise<StoreTeaser[]> {
    const { data } = await api.get<StoreTeaser[]>("/marketplace/stores");
    return data;
  },

  async getStore(slug: string): Promise<Storefront> {
    const { data } = await api.get<Storefront>(`/marketplace/stores/${slug}`);
    return data;
  },

  async listProducts(
    params?: ListProductsParams,
  ): Promise<Paginated<ProductWithStore>> {
    const { data } = await api.get<Paginated<ProductWithStore>>(
      "/marketplace/products",
      { params },
    );
    return data;
  },

  async getProduct(id: string): Promise<ProductDetail> {
    const { data } = await api.get<ProductDetail>(
      `/marketplace/products/${id}`,
    );
    return data;
  },

  // ─── Checkout ─────────────────────────────────────────────────────────
  async createOrder(payload: CreateOrderPayload): Promise<InitOrderResult> {
    const { data } = await api.post<InitOrderResult>(
      "/marketplace/orders",
      payload,
    );
    return data;
  },

  async verifyOrder(reference: string): Promise<MarketplaceOrder> {
    const { data } = await api.get<MarketplaceOrder>(
      `/marketplace/orders/verify/${reference}`,
    );
    return data;
  },

  async myOrders(): Promise<Paginated<MarketplaceOrder>> {
    const { data } = await api.get<Paginated<MarketplaceOrder>>(
      "/marketplace/orders/mine",
    );
    return data;
  },

  // ─── Vendor management ────────────────────────────────────────────────
  async getMyStore(): Promise<Storefront | null> {
    const { data } = await api.get<Storefront | null>(
      "/marketplace/vendor/store",
    );
    return data;
  },

  async upsertMyStore(payload: UpsertStorePayload): Promise<Storefront> {
    const { data } = await api.post<Storefront>(
      "/marketplace/vendor/store",
      payload,
    );
    return data;
  },

  async myProducts(): Promise<ProductWithStore[]> {
    const { data } = await api.get<ProductWithStore[]>(
      "/marketplace/vendor/products",
    );
    return data;
  },

  async createProduct(payload: UpsertProductPayload): Promise<ProductWithStore> {
    const { data } = await api.post<ProductWithStore>(
      "/marketplace/vendor/products",
      payload,
    );
    return data;
  },

  async updateProduct(
    id: string,
    payload: Partial<UpsertProductPayload>,
  ): Promise<ProductWithStore> {
    const { data } = await api.patch<ProductWithStore>(
      `/marketplace/vendor/products/${id}`,
      payload,
    );
    return data;
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    const { data } = await api.delete<{ success: boolean }>(
      `/marketplace/vendor/products/${id}`,
    );
    return data;
  },

  async vendorOrders(): Promise<Paginated<MarketplaceOrder>> {
    const { data } = await api.get<Paginated<MarketplaceOrder>>(
      "/marketplace/vendor/orders",
    );
    return data;
  },

  async vendorEarnings(): Promise<VendorEarningsSummary> {
    const { data } = await api.get<VendorEarningsSummary>(
      "/marketplace/vendor/earnings",
    );
    return data;
  },
};

export interface UpsertStorePayload {
  name: string;
  tagline: string;
  bio: string;
  logo: string;
  banner: string;
  accent?: string;
  category: string;
  location: string;
  phone: string;
  email: string;
  established?: string;
  responseTime?: string;
  deliveryAreas?: string[];
  policies?: unknown;
  promo?: unknown;
  collections?: unknown;
}

export interface UpsertProductPayload {
  name: string;
  description: string;
  priceNaira: number;
  compareAtNaira?: number;
  category: string;
  coverImage: string;
  gallery?: string[];
  specs?: unknown;
  options?: unknown;
  tag?: string;
  bulkEligible?: boolean;
  inStock?: boolean;
  stockQty?: number;
  active?: boolean;
}

export interface VendorEarningsSummary {
  orders: number;
  lineItems: number;
  grossNaira: number;
  commissionNaira: number;
  netNaira: number;
}

export default marketplaceService;
