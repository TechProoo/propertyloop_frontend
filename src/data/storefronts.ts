/**
 * Marketplace catalogue — single source of truth
 *
 * Lives here (not inside a page) so the hub, storefront, product-browse and
 * product-detail pages all read the same records. Shape mirrors what we will
 * ultimately pull from `/vendors/:slug/storefront` on the backend, so swapping
 * in a real fetch later is a one-line change in each consumer.
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

/* ─── Full storefronts (branded pages) ──────────────────────────────────── */

export const STOREFRONTS: Record<string, Storefront> = {
  "casa-nova-interiors": {
    slug: "casa-nova-interiors",
    name: "Casa Nova Interiors",
    tagline: "Furniture that moves in before you do.",
    bio: "A Lagos-based furniture studio curating sofas, dining sets and bedroom pieces for Nigerian homes. We ship direct from our Lekki warehouse with a seven-day return window.",
    logo: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&h=400&fit=crop",
    banner:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&h=800&fit=crop",
    accent: "#2b4e3b",
    category: "Furniture & Interiors",
    location: "Lekki Phase 1, Lagos",
    phone: "+2347000000001",
    email: "orders@casanova.ng",
    established: "2021",
    rating: 4.8,
    reviews: 312,
    ordersFulfilled: 1840,
    verified: true,
    responseTime: "under 2 hours",
    deliveryAreas: ["Lekki", "Ikoyi", "VI", "Ajah", "Ikeja", "Nationwide"],
    policies: [
      {
        icon: "truck",
        label: "Free Lagos delivery",
        detail: "On orders above ₦250,000",
      },
      {
        icon: "shield",
        label: "7-day returns",
        detail: "No-questions returns within a week",
      },
      {
        icon: "clock",
        label: "Assembly included",
        detail: "On every sofa and bed frame",
      },
      {
        icon: "tag",
        label: "Realtor discount",
        detail: "10% off with a verified realtor code",
      },
    ],
    promo: {
      title: "Move-in Season",
      subtitle: "Save up to 25% across living and dining",
      code: "MOVEIN25",
    },
    collections: [
      {
        id: "living",
        title: "Living Room",
        subtitle: "Sofas, armchairs, media units",
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop",
      },
      {
        id: "dining",
        title: "Dining",
        subtitle: "Tables, chairs, barware",
        image:
          "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=400&fit=crop",
      },
      {
        id: "bedroom",
        title: "Bedroom",
        subtitle: "Beds, wardrobes, dressers",
        image:
          "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=400&fit=crop",
      },
      {
        id: "office",
        title: "Home Office",
        subtitle: "Desks, chairs, shelves",
        image:
          "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=400&fit=crop",
      },
    ],
    products: [
      {
        id: "p1",
        name: "Terrazzo 3-Seater Sofa",
        priceNaira: 540000,
        compareAtNaira: 680000,
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop",
        gallery: [
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000&h=1000&fit=crop",
          "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1000&h=1000&fit=crop",
          "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1000&h=1000&fit=crop",
          "https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=1000&h=1000&fit=crop",
        ],
        category: "Living Room",
        rating: 4.9,
        reviews: 48,
        inStock: true,
        tag: "sale",
        description:
          "A deep, three-seater sofa upholstered in stain-resistant terrazzo-weave fabric over a solid iroko frame. Built in Lagos, delivered flat-packed with on-site assembly by our team.",
        specs: [
          { label: "Dimensions", value: "220 × 92 × 85 cm" },
          { label: "Frame", value: "Kiln-dried iroko hardwood" },
          { label: "Fill", value: "High-resilience foam + feather tops" },
          { label: "Upholstery", value: "Stain-resistant woven terrazzo" },
          { label: "Warranty", value: "3 years, structural" },
          { label: "Lead time", value: "Delivered within 5 working days" },
        ],
        options: [
          { label: "Colour", values: ["Oatmeal", "Charcoal", "Olive"] },
          { label: "Legs", values: ["Walnut", "Matte black"] },
        ],
        reviewsList: [
          {
            author: "Chiamaka O.",
            rating: 5,
            comment:
              "Firmer than it looks online, in a good way. Delivery team assembled on the spot and took the packaging away.",
            when: "2 weeks ago",
          },
          {
            author: "Realtor · Blessing E.",
            rating: 5,
            comment:
              "Staged a 3-bed in Ikoyi with this. Clients bought the sofa with the unit.",
            when: "1 month ago",
          },
        ],
      },
      {
        id: "p2",
        name: "Oakwood Dining Set (6)",
        priceNaira: 420000,
        image:
          "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=800&fit=crop",
        gallery: [
          "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1000&h=1000&fit=crop",
          "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=1000&h=1000&fit=crop",
          "https://images.unsplash.com/photo-1591129841117-3adfd313e34f?w=1000&h=1000&fit=crop",
        ],
        category: "Dining",
        rating: 4.7,
        reviews: 36,
        inStock: true,
        tag: "bestseller",
        description:
          "Solid oak dining table seating six, paired with cushioned chairs. Finished in a hand-rubbed oil that is food-safe and easy to touch up.",
        specs: [
          { label: "Table", value: "180 × 90 × 75 cm" },
          { label: "Material", value: "Solid European oak" },
          { label: "Finish", value: "Hard-wax oil, food-safe" },
          { label: "Includes", value: "Table + 6 chairs" },
          { label: "Lead time", value: "7 working days" },
        ],
        options: [
          { label: "Finish", values: ["Natural", "Smoked"] },
          { label: "Chair fabric", values: ["Stone", "Teal", "Navy"] },
        ],
      },
      {
        id: "p3",
        name: "Linen Headboard King Bed",
        priceNaira: 385000,
        image:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=800&fit=crop",
        gallery: [
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1000&h=1000&fit=crop",
          "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1000&h=1000&fit=crop",
        ],
        category: "Bedroom",
        rating: 4.8,
        reviews: 22,
        inStock: true,
        tag: "new",
        description:
          "King-size bed frame with a channel-tufted linen headboard. Slatted base with central support; no box spring needed.",
      },
      {
        id: "p4",
        name: "Mid-Century Office Chair",
        priceNaira: 118000,
        compareAtNaira: 148000,
        image:
          "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&h=800&fit=crop",
        category: "Home Office",
        rating: 4.6,
        reviews: 54,
        inStock: true,
        tag: "sale",
        description:
          "Ergonomic office chair with a walnut shell, breathable mesh back and adjustable lumbar support.",
      },
      {
        id: "p5",
        name: "Marble-Top Coffee Table",
        priceNaira: 165000,
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop",
        category: "Living Room",
        rating: 4.8,
        reviews: 19,
        inStock: true,
      },
      {
        id: "p6",
        name: "Walnut Wardrobe (6-door)",
        priceNaira: 720000,
        image:
          "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=800&fit=crop",
        category: "Bedroom",
        rating: 4.9,
        reviews: 11,
        inStock: false,
      },
      {
        id: "p7",
        name: "Barcelona Lounge Chair",
        priceNaira: 240000,
        image:
          "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&h=800&fit=crop",
        category: "Living Room",
        rating: 4.7,
        reviews: 27,
        inStock: true,
        bulkEligible: true,
      },
      {
        id: "p8",
        name: "Scandi Study Desk",
        priceNaira: 145000,
        image:
          "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=800&fit=crop",
        category: "Home Office",
        rating: 4.5,
        reviews: 31,
        inStock: true,
      },
    ],
    reviewsList: [
      {
        author: "Chiamaka O.",
        rating: 5,
        comment:
          "Delivered to Ajah on day two, assembly in under an hour. Sofa is firmer than it looks online, in a good way.",
        when: "2 weeks ago",
      },
      {
        author: "Tunde A.",
        rating: 5,
        comment:
          "Full dining set for the new apartment. Price match on the chairs with no fuss. Will reorder for the home office.",
        when: "1 month ago",
      },
      {
        author: "Realtor · Blessing E.",
        rating: 4,
        comment:
          "Furnished three staged units through them this quarter. Realtor code saves my clients real money and I keep the margin.",
        when: "6 weeks ago",
      },
    ],
  },
  "ironworks-building-co": {
    slug: "ironworks-building-co",
    name: "Ironworks Building Co.",
    tagline: "Materials sized for your site, not someone else's catalogue.",
    bio: "Family-owned supplier of steel, cement, roofing and electricals since 2007. We quote by site drawings, deliver on your schedule and finance volume orders through PropertyLoop.",
    logo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop",
    banner:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&h=800&fit=crop",
    accent: "#8a3b1f",
    category: "Building Materials",
    location: "Ikeja, Lagos",
    phone: "+2347000000002",
    email: "sales@ironworks.ng",
    established: "2007",
    rating: 4.7,
    reviews: 526,
    ordersFulfilled: 4210,
    verified: true,
    responseTime: "same day",
    deliveryAreas: ["Lagos mainland", "Lagos island", "Ogun", "Ibadan"],
    policies: [
      {
        icon: "truck",
        label: "Site delivery",
        detail: "Dedicated trucks within 24h",
      },
      {
        icon: "shield",
        label: "Spec guarantee",
        detail: "Factory-stamped, batch-traceable",
      },
      {
        icon: "tag",
        label: "Volume pricing",
        detail: "Tiered discounts from 50 bags",
      },
      {
        icon: "clock",
        label: "Open 7 days",
        detail: "Weekend deliveries available",
      },
    ],
    promo: {
      title: "Site Rush",
      subtitle: "Order 100+ bags of cement, get free delivery across Lagos",
      code: "SITE100",
    },
    collections: [
      {
        id: "cement",
        title: "Cement & Concrete",
        subtitle: "Dangote, BUA, Lafarge",
        image:
          "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&fit=crop",
      },
      {
        id: "steel",
        title: "Steel & Rebar",
        subtitle: "Rods, mesh, structural steel",
        image:
          "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&h=400&fit=crop",
      },
      {
        id: "roofing",
        title: "Roofing",
        subtitle: "Stone-coated, long-span",
        image:
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=400&fit=crop",
      },
      {
        id: "electrical",
        title: "Electrical",
        subtitle: "Cables, switchgear, fittings",
        image:
          "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=400&fit=crop",
      },
    ],
    products: [
      {
        id: "ib1",
        name: "Dangote 42.5R Cement (bag)",
        priceNaira: 7800,
        image:
          "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=800&fit=crop",
        gallery: [
          "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1000&h=1000&fit=crop",
          "https://images.unsplash.com/photo-1518237001-26aa5cd3c7cb?w=1000&h=1000&fit=crop",
        ],
        category: "Cement & Concrete",
        rating: 4.9,
        reviews: 212,
        inStock: true,
        tag: "bestseller",
        bulkEligible: true,
        description:
          "Dangote 42.5R Portland cement, 50kg bag. Batch-traceable, delivered on your schedule. Volume orders of 100 bags and above qualify for free Lagos delivery.",
        specs: [
          { label: "Weight", value: "50kg per bag" },
          { label: "Grade", value: "42.5R" },
          { label: "Standard", value: "NIS 444-1:2003" },
          { label: "Min order", value: "10 bags" },
          { label: "Bulk from", value: "50 bags · 100 bags for free delivery" },
        ],
      },
      {
        id: "ib2",
        name: "12mm Rebar (12m length)",
        priceNaira: 10500,
        image:
          "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&h=800&fit=crop",
        category: "Steel & Rebar",
        rating: 4.8,
        reviews: 94,
        inStock: true,
        bulkEligible: true,
        description:
          "Deformed reinforcing bar, 12mm × 12m, meeting NIS 117:2004. Priced per length, delivered bundled by the ton.",
      },
      {
        id: "ib3",
        name: "Stone-coated Roof Sheet (bundle)",
        priceNaira: 46000,
        compareAtNaira: 52000,
        image:
          "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=800&fit=crop",
        category: "Roofing",
        rating: 4.7,
        reviews: 68,
        inStock: true,
        tag: "sale",
      },
      {
        id: "ib4",
        name: "2.5mm Twin & Earth Cable (coil)",
        priceNaira: 54000,
        image:
          "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=800&fit=crop",
        category: "Electrical",
        rating: 4.6,
        reviews: 44,
        inStock: true,
      },
    ],
    reviewsList: [
      {
        author: "Site Engineer · Dapo A.",
        rating: 5,
        comment:
          "Delivered 400 bags to Epe on schedule, invoice matched quote to the kobo. Rare combination.",
        when: "3 weeks ago",
      },
      {
        author: "Felix M.",
        rating: 4,
        comment:
          "Good pricing on steel, delivery was a day late but they called ahead.",
        when: "2 months ago",
      },
    ],
  },
};

/* ─── Discovery cards for stores that are "opening soon" ────────────────── */

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

export const TEASER_STORES: StoreTeaser[] = [
  {
    slug: "lumen-lighting",
    name: "Lumen Lighting Lagos",
    tagline: "Pendants, sconces and fittings for warmer rooms.",
    category: "Lighting & Decor",
    logo: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=400&fit=crop",
    banner:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=400&fit=crop",
    accent: "#3b3b6b",
    rating: 4.9,
    productsCount: 54,
    verified: true,
    live: false,
  },
  {
    slug: "greenline-landscapes",
    name: "Greenline Landscapes",
    tagline: "Plants, soils and planters for Lagos balconies and gardens.",
    category: "Landscaping",
    logo: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    banner:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop",
    accent: "#1f5f3b",
    rating: 4.6,
    productsCount: 73,
    verified: false,
    live: false,
  },
  {
    slug: "nordik-smarthome",
    name: "Nordik Smart Home",
    tagline: "Smart switches, locks and cameras — installed same day.",
    category: "Smart Home",
    logo: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=400&fit=crop",
    banner:
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=400&fit=crop",
    accent: "#1a3a5c",
    rating: 4.8,
    productsCount: 41,
    verified: true,
    live: false,
  },
  {
    slug: "forma-kitchen-co",
    name: "Forma Kitchen Co.",
    tagline: "Fitted kitchens and wardrobes, measured in your home.",
    category: "Furniture & Interiors",
    logo: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    banner:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop",
    accent: "#3a2b1f",
    rating: 4.9,
    productsCount: 24,
    verified: true,
    live: false,
  },
];

/* ─── Flat product catalogue (for browse page) ──────────────────────────── */

export type ProductWithStore = StoreProduct & {
  storeSlug: string;
  storeName: string;
  storeAccent: string;
};

export const ALL_PRODUCTS: ProductWithStore[] = Object.values(STOREFRONTS).flatMap(
  (store) =>
    store.products.map((p) => ({
      ...p,
      storeSlug: store.slug,
      storeName: store.name,
      storeAccent: store.accent,
    })),
);

export function findProduct(
  storeSlug: string,
  productId: string,
): { store: Storefront; product: StoreProduct } | null {
  const store = STOREFRONTS[storeSlug];
  if (!store) return null;
  const product = store.products.find((p) => p.id === productId);
  if (!product) return null;
  return { store, product };
}

export function listAllCategories(): string[] {
  const set = new Set<string>();
  for (const s of Object.values(STOREFRONTS)) {
    for (const p of s.products) set.add(p.category);
  }
  return Array.from(set).sort();
}
