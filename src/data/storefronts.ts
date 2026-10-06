/**
 * Marketplace types
 *
 * Shapes shared across the marketplace pages and the API service. The catalogue
 * itself is served by the backend (`/marketplace/*`) — there is no static store
 * or product data here. `TEASER_STORES` is kept as an (empty) extension point
 * for "opening soon" cards the team may curate later.
 */

export type StoreProduct = {
  id: string;
  name: string;
  priceNaira: number;
  compareAtNaira?: number;
  image: string;
  gallery?: string[];
  category: string;
  rating: number;
  reviews: number;
  reviewsList?: { author: string; rating: number; comment: string; when: string }[];
  inStock: boolean;
  tag?: "new" | "bestseller" | "sale";
  bulkEligible?: boolean;
  description?: string;
  specs?: { label: string; value: string }[];
  options?: { label: string; values: string[] }[];
};

export type Storefront = {
  slug: string;
  name: string;
  tagline: string;
  bio: string;
  logo: string;
  banner: string;
  accent: string;
  category: string;
  location: string;
  phone: string;
  email: string;
  established: string;
  rating: number;
  reviews: number;
  ordersFulfilled: number;
  verified: boolean;
  responseTime: string;
  deliveryAreas: string[];
  policies: {
    icon: "shield" | "truck" | "clock" | "tag";
    label: string;
    detail: string;
  }[];
  promo?: { title: string; subtitle: string; code: string };
  collections: {
    id: string;
    title: string;
    subtitle: string;
    image: string;
  }[];
  products: StoreProduct[];
  reviewsList: {
    author: string;
    rating: number;
    comment: string;
    when: string;
  }[];
};

export type StoreTeaser = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  logo: string;
  banner: string;
  accent: string;
  rating: number;
  productsCount: number;
  verified: boolean;
  live: boolean;
};

export type ProductWithStore = StoreProduct & {
  storeSlug: string;
  storeName: string;
  storeAccent: string;
};

/** Curated "opening soon" cards shown beside live stores. Empty by default. */
export const TEASER_STORES: StoreTeaser[] = [];
