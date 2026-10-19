import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Hammer,
  Lamp,
  Plus,
  ShoppingBag,
  Sofa,
  Star,
  Store,
  Trees,
  Wrench,
  Zap,
} from "lucide-react";
import marketplaceService from "../../api/services/marketplace";
import type { ProductWithStore } from "../../api/services/marketplace";
import { useStoreCart } from "../../context/StoreCartContext";
import { PRODUCT_MARKETPLACE } from "../../config/features";

/* ─── Shop-the-marketplace showcase for the home page ─────────────────────
   The retail half of the home: shop-by-category entries and an
   auto-advancing product carousel, so the page reads as a place to buy
   things for a home, not only to find one. */

const CATEGORIES = [
  { icon: Sofa, label: "Furniture" },
  { icon: Lamp, label: "Lighting & Decor" },
  { icon: Hammer, label: "Building Materials" },
  { icon: Zap, label: "Smart Home" },
  { icon: Wrench, label: "Tools & Hardware" },
  { icon: Trees, label: "Landscaping" },
] as const;

const naira = (n: number) => "₦" + n.toLocaleString("en-NG");

function CardSkeleton() {
  return (
    <div className="w-[260px] shrink-0 snap-start">
      <div className="aspect-[4/3] w-full animate-pulse rounded-2xl bg-primary/5" />
      <div className="mt-3 h-4 w-3/4 animate-pulse rounded-full bg-primary/10" />
      <div className="mt-2 h-3 w-1/2 animate-pulse rounded-full bg-primary/5" />
    </div>
  );
}

export default function MarketplaceShowcase() {
  const { addItem } = useStoreCart();
  const [products, setProducts] = useState<ProductWithStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState<string | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(false);

  useEffect(() => {
    if (!PRODUCT_MARKETPLACE) {
      setLoading(false);
      return;
    }
    let alive = true;
    marketplaceService
      .listProducts({ limit: 12, sort: "newest" })
      .then((res) => alive && setProducts(res.items))
      .catch(() => undefined)
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  // Gentle auto-advance — nudges the rail one card every few seconds and loops
  // back to the start at the end. Pauses while the pointer is over the rail so
  // it never fights the person scrolling.
  useEffect(() => {
    if (products.length === 0) return;
    const el = trackRef.current;
    if (!el) return;
    const timer = setInterval(() => {
      if (hoverRef.current) return;
      const card = el.querySelector<HTMLElement>("[data-card]");
      const step = card ? card.offsetWidth + 20 : 280;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      el.scrollTo({
        left: atEnd ? 0 : el.scrollLeft + step,
        behavior: "smooth",
      });
    }, 3800);
    return () => clearInterval(timer);
  }, [products.length]);

  function nudge(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 20 : 280;
    el.scrollBy({ left: dir * step * 1.5, behavior: "smooth" });
  }

  if (!PRODUCT_MARKETPLACE) return null;
  if (!loading && products.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#0f2e1b] py-16 sm:py-20">
      {/* soft glow accents */}
      <div className="pointer-events-none absolute -right-32 -top-24 h-80 w-80 rounded-full bg-accent/10 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-primary/30 blur-[110px]" />

      <div className="relative mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-[#a3e635]">
              <ShoppingBag className="h-3 w-3" />
              Marketplace
            </span>
            <h2 className="font-heading mt-3 text-[28px] font-bold leading-[1.1] tracking-tight text-white sm:text-[38px]">
              Everything for your home —{" "}
              <span className="text-[#a3e635]">in one checkout.</span>
            </h2>
            <p className="mt-2.5 max-w-lg text-[14px] leading-relaxed text-white/60">
              Found the place? Furnish and finish it too. Furniture, materials,
              lighting and more from verified vendors — paid safely through
              PropertyLoop.
            </p>
          </div>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[13px] font-bold text-primary-dark transition-transform hover:-translate-y-0.5"
          >
            Visit marketplace
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Shop by category */}
        <div className="mt-7 flex flex-wrap gap-2.5">
          {CATEGORIES.map(({ icon: Icon, label }) => (
            <Link
              key={label}
              to={`/marketplace?category=${encodeURIComponent(label)}`}
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-[13px] font-semibold text-white/80 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
            >
              <Icon className="h-4 w-4 text-[#a3e635]" />
              {label}
            </Link>
          ))}
        </div>

        {/* Product carousel */}
        <div className="relative mt-8">
          {/* Arrows (desktop) */}
          <button
            type="button"
            aria-label="Previous products"
            onClick={() => nudge(-1)}
            className="absolute -left-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary-dark shadow-lg transition-transform hover:scale-105 lg:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next products"
            onClick={() => nudge(1)}
            className="absolute -right-3 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary-dark shadow-lg transition-transform hover:scale-105 lg:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={trackRef}
            onMouseEnter={() => (hoverRef.current = true)}
            onMouseLeave={() => (hoverRef.current = false)}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
              : products.map((p) => {
                  const onSale =
                    p.compareAtNaira && p.compareAtNaira > p.priceNaira;
                  const href = `/store/${p.storeSlug}/product/${p.id}`;
                  return (
                    <div
                      key={p.id}
                      data-card
                      className="group w-[260px] shrink-0 snap-start overflow-hidden rounded-2xl bg-white shadow-[0_6px_24px_rgba(0,0,0,0.18)]"
                    >
                      <Link to={href} className="block">
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-primary/5">
                          <img
                            src={p.image}
                            alt={p.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {onSale && (
                            <span className="absolute left-2.5 top-2.5 rounded-full bg-[#c2410c] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                              Sale
                            </span>
                          )}
                          {!p.inStock && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <span className="text-xs font-bold uppercase tracking-wider text-white">
                                Sold out
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="p-3.5">
                        <Link to={`/store/${p.storeSlug}`}>
                          <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline">
                            <Store className="h-3 w-3" />
                            {p.storeName}
                          </p>
                        </Link>
                        <Link to={href}>
                          <h3 className="mt-1 line-clamp-2 text-[14px] font-bold leading-snug text-primary-dark">
                            {p.name}
                          </h3>
                        </Link>

                        <div className="mt-2.5 flex items-end justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[16px] font-bold text-primary-dark">
                              {naira(p.priceNaira)}
                            </p>
                            {onSale && (
                              <p className="text-[11px] text-text-subtle line-through">
                                {naira(p.compareAtNaira!)}
                              </p>
                            )}
                            {p.rating > 0 && (
                              <p className="mt-0.5 inline-flex items-center gap-0.5 text-[11px] text-text-subtle">
                                <Star className="h-3 w-3 fill-accent text-accent" />
                                {p.rating.toFixed(1)}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            disabled={!p.inStock}
                            onClick={() => {
                              addItem({
                                productId: p.id,
                                storeSlug: p.storeSlug,
                                storeName: p.storeName,
                                name: p.name,
                                priceNaira: p.priceNaira,
                                image: p.image,
                              });
                              setAdded(p.id);
                              window.setTimeout(
                                () => setAdded((cur) => (cur === p.id ? null : cur)),
                                1400,
                              );
                            }}
                            className="inline-flex h-9 shrink-0 items-center gap-1 rounded-full bg-primary-dark px-3.5 text-[12px] font-bold text-white transition-colors hover:bg-black disabled:opacity-40"
                          >
                            {added === p.id ? (
                              "Added"
                            ) : (
                              <>
                                <Plus className="h-3.5 w-3.5" />
                                Add
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </section>
  );
}
