import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  RotateCcw,
  Search,
  ShoppingBag,
  Star,
  Store,
  WifiOff,
} from "lucide-react";
import listingsService from "../../api/services/listings";
import marketplaceService from "../../api/services/marketplace";
import type { Listing } from "../../api/types";
import type { StoreTeaser } from "../../data/storefronts";
import PropertyTile from "./PropertyTile";
import { listingToTile } from "./tileData";
import { PRODUCT_MARKETPLACE } from "../../config/features";

/* ═══════════════════════════════════════════════════════════════════════════
   StockHero — unified hero that combines property search, PropertyLoop stock,
   and the marketplace in one premium section.
   ═══════════════════════════════════════════════════════════════════════════ */

const SEARCH_CATS = [
  { label: "All", path: "/buy" },
  { label: "Buy", path: "/buy" },
  { label: "Rent", path: "/rent" },
  { label: "Shortlet", path: "/shortlet" },
] as const;

const QUICK_LINKS = [
  { label: "Buy a home", href: "/buy", icon: "🏠" },
  { label: "Rent", href: "/rent", icon: "🔑" },
  { label: "Shortlet", href: "/shortlet", icon: "🌴" },
  { label: "Find an agent", href: "/find-agent", icon: "👤" },
  ...(PRODUCT_MARKETPLACE
    ? [{ label: "Marketplace", href: "/marketplace", icon: "🛒" }]
    : []),
];

const STOCK_COUNT = 4;

function PanelSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-2xl bg-white/80 p-4">
      <div className="h-5 w-3/4 animate-pulse rounded-full bg-primary/10" />
      <div className="mt-2 h-3.5 w-1/2 animate-pulse rounded-full bg-primary/5" />
      <div className="mt-3 aspect-4/3 w-full animate-pulse rounded-xl bg-primary/5" />
      <div className="mt-3.5 h-5 w-1/3 animate-pulse rounded-full bg-primary/10" />
    </div>
  );
}

type StoreCard = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  accent: string;
  rating: number;
  products: number;
  logo: string;
  hero: string;
};

const toStoreCard = (s: StoreTeaser): StoreCard => ({
  slug: s.slug,
  name: s.name,
  tagline: s.tagline,
  category: s.category,
  accent: s.accent,
  rating: s.rating,
  products: s.productsCount,
  logo: s.logo,
  hero: s.banner,
});

export default function StockHero() {
  const navigate = useNavigate();
  const [searchCat, setSearchCat] = useState("All");
  const [searchQ, setSearchQ] = useState("");

  /* ── Stock ─────────────────────────────────────────────── */
  const [stock, setStock] = useState<Listing[]>([]);
  const [stockLoading, setStockLoading] = useState(true);
  const [stockFailed, setStockFailed] = useState(false);
  const [stockAttempt, setStockAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    listingsService
      .list({ ownership: "HOUSE", limit: STOCK_COUNT, sort: "newest" })
      .then((res) => {
        if (!alive) return;
        setStock(res.items);
        setStockFailed(false);
      })
      .catch(() => {
        if (alive) setStockFailed(true);
      })
      .finally(() => {
        if (alive) setStockLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [stockAttempt]);

  const retryStock = () => {
    setStockLoading(true);
    setStockFailed(false);
    setStockAttempt((n) => n + 1);
  };

  /* ── Marketplace stores ────────────────────────────────── */
  const [stores, setStores] = useState<StoreCard[]>([]);
  const [storesLoaded, setStoresLoaded] = useState(false);

  useEffect(() => {
    if (!PRODUCT_MARKETPLACE) return;
    let cancelled = false;
    marketplaceService
      .listStores()
      .then((list) => {
        if (!cancelled) setStores(list.slice(0, 3).map(toStoreCard));
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setStoresLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /* ── Search ────────────────────────────────────────────── */
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQ.trim();
    const cat = SEARCH_CATS.find((c) => c.label === searchCat);
    const base = cat?.path ?? "/buy";
    navigate(q ? `${base}?q=${encodeURIComponent(q)}` : base);
  }

  const showStores = PRODUCT_MARKETPLACE && storesLoaded && stores.length > 0;

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          PART 1 — The hero banner
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#0f2e1b]">
        {/* Decorative gradient orbs */}
        <div className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-60 -left-40 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[100px]" />

        <div className="relative mx-auto max-w-360 px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8 lg:pb-20 lg:pt-16">
          {/* Headline */}
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading text-[32px] font-extrabold leading-[1.08] tracking-tight text-white sm:text-[44px] lg:text-[56px]">
              Find your next home.
              <br />
              <span className="bg-gradient-to-r from-[#4ade80] to-[#a3e635] bg-clip-text text-transparent">
                Shop for it too.
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/60 sm:text-base">
              Nigeria's property marketplace — verified listings, trusted agents,
              and everything you need to furnish and finish your home, all in one
              place.
            </p>
          </div>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mt-8 flex max-w-2xl overflow-hidden rounded-full bg-white shadow-[0_8px_32px_rgba(0,0,0,0.3)] sm:mt-10"
          >
            <select
              value={searchCat}
              onChange={(e) => setSearchCat(e.target.value)}
              aria-label="Search category"
              className="hidden border-none bg-gray-50 px-4 py-3 text-[13px] font-semibold text-[#0f2e1b] outline-none sm:block"
            >
              {SEARCH_CATS.map((c) => (
                <option key={c.label} value={c.label}>
                  {c.label}
                </option>
              ))}
            </select>
            <input
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search by area, city or landmark"
              aria-label="Search properties"
              className="min-w-0 flex-1 border-none px-5 py-3.5 text-sm text-[#0f1111] outline-none placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="m-1.5 flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-primary-dark sm:px-6"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          {/* Quick-link pills */}
          <div className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-2">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-[12.5px] font-medium text-white/70 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          PART 2 — PropertyLoop stock + marketplace grid
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#f5f0eb]">
        <div className="mx-auto max-w-360 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          {/* ── PropertyLoop stock ─────────────────────────────────── */}
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.15em] text-primary">
                <BadgeCheck className="h-3 w-3" />
                PropertyLoop stock
              </span>
              <h2 className="font-heading mt-3 text-[26px] font-bold leading-[1.1] tracking-tight text-primary-dark sm:text-[34px]">
                Listed &amp; checked by our team
              </h2>
              <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-text-secondary">
                Every property here has been inspected, documented and priced by
                PropertyLoop — papers, photographs and price, verified before it
                reaches you.
              </p>
            </div>
            <Link
              to="/buy"
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 px-5 py-2.5 text-[13px] font-bold text-primary-dark transition-colors hover:bg-primary hover:text-white"
            >
              Browse all stock
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {stockFailed ? (
            <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
              <WifiOff className="h-6 w-6 text-text-subtle" />
              <p className="text-sm text-text-secondary">
                We could not load our stock just now.
              </p>
              <button
                onClick={retryStock}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-[13px] font-bold text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Try again
              </button>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stockLoading
                ? Array.from({ length: STOCK_COUNT }).map((_, i) => (
                    <PanelSkeleton key={i} />
                  ))
                : stock.map((l) => (
                    <PropertyTile
                      key={l.id}
                      data={listingToTile(l)}
                      variant="panel"
                      badge="PropertyLoop"
                    />
                  ))}
            </div>
          )}

          {/* ── Marketplace stores ─────────────────────────────────── */}
          {showStores && (
            <div className="mt-14">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.15em] text-accent">
                    <Store className="h-3 w-3" />
                    Marketplace
                  </span>
                  <h2 className="font-heading mt-3 text-[26px] font-bold leading-[1.1] tracking-tight text-primary-dark sm:text-[34px]">
                    Everything for your home
                  </h2>
                  <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-text-secondary">
                    Furniture, materials, lighting, smart home — each vendor runs
                    their own branded storefront on PropertyLoop. Checkout and
                    buyer protection are handled by us.
                  </p>
                </div>
                <Link
                  to="/marketplace"
                  className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 px-5 py-2.5 text-[13px] font-bold text-primary-dark transition-colors hover:bg-accent hover:text-white"
                >
                  Visit marketplace
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
                {stores.map((s) => (
                  <Link
                    key={s.slug}
                    to={`/store/${s.slug}`}
                    className="group relative overflow-hidden rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
                    style={{ backgroundColor: s.accent }}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${s.hero})` }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(180deg, transparent 0%, transparent 30%, ${s.accent}e6 100%)`,
                      }}
                    />

                    <div className="relative z-10 flex min-h-[280px] flex-col p-5">
                      <div className="flex items-start justify-between">
                        <div className="h-12 w-12 overflow-hidden rounded-xl border-2 border-white/30 bg-white/10 shadow">
                          <img
                            src={s.logo}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                          <BadgeCheck className="h-3 w-3" />
                          Verified
                        </span>
                      </div>

                      <div className="mt-auto">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-white/60">
                          {s.category}
                        </p>
                        <h3 className="font-heading mt-1 text-lg font-bold leading-tight text-white">
                          {s.name}
                        </h3>
                        <p className="mt-1 text-[13px] text-white/80">
                          {s.tagline}
                        </p>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-white/70">
                            <span className="inline-flex items-center gap-1">
                              <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
                              <span className="font-semibold text-white">
                                {s.rating.toFixed(1)}
                              </span>
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <ShoppingBag className="h-3 w-3" />
                              {s.products} products
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-white">
                            Visit
                            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Sell CTA */}
              <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-border-light bg-white/80 px-6 py-5 sm:flex-row sm:items-center">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Store className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <p className="font-heading text-[15px] font-bold text-primary-dark">
                    Have products to sell? Open your store in minutes.
                  </p>
                  <p className="mt-0.5 text-[13px] text-text-secondary">
                    Your brand, your prices, your inventory. We handle checkout
                    and only earn when you earn.
                  </p>
                </div>
                <Link
                  to="/onboarding?role=vendor"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary-dark px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-black"
                >
                  Start selling
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
