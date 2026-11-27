import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  RotateCcw,
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
import HomeHero from "./HomeHero";
import { PRODUCT_MARKETPLACE } from "../../config/features";

/* ═══════════════════════════════════════════════════════════════════════════
   StockHero — unified hero that combines property search, PropertyLoop stock,
   and the marketplace in one premium section.
   ═══════════════════════════════════════════════════════════════════════════ */

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

  const showStores = PRODUCT_MARKETPLACE && storesLoaded && stores.length > 0;

  return (
    <>
      <HomeHero />
      <section className="landing-stock">
        <div className="landing-chapter">
          <div className="chapter-head">
            <div>
              <p className="chapter-label">PropertyLoop collection</p>
              <h2>From our property desk</h2>
              <p className="mt-3 text-sm text-text-secondary">Homes inspected and documented by the PropertyLoop team.</p>
            </div>
            <Link to="/buy">Browse properties <ArrowRight size={15} /></Link>
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
          ) : !stockLoading && stock.length === 0 ? (
            <p className="mt-6 text-sm text-text-secondary">Our next collection is on its way. Explore agent listings below.</p>
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
