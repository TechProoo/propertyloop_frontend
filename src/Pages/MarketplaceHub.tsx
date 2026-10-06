import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Search,
  Store,
  BadgeCheck,
  Star,
  Package,
  Sparkles,
  TrendingUp,
  Sofa,
  Hammer,
  Lamp,
  Wrench,
  Trees,
  Zap,
  ShieldCheck,
  Truck,
  ChevronRight,
  Percent,
  Users,
  ShoppingBag,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import Seo from "../components/Seo";
import {
  STOREFRONTS,
  TEASER_STORES,
  ALL_PRODUCTS,
} from "../data/storefronts";
import { useStoreCart } from "../context/StoreCartContext";

/* ─── Static catalogue ──────────────────────────────────────────────────────
 *
 * Discovery entries for the hub. Live stores come from the shared storefronts
 * module so a product change in one place is reflected everywhere; teaser
 * cards sit next to them so the directory looks fuller than it is.
 */

const CATEGORIES = [
  { icon: Sofa, label: "Furniture", stores: 42 },
  { icon: Lamp, label: "Lighting & Decor", stores: 28 },
  { icon: Hammer, label: "Building Materials", stores: 61 },
  { icon: Zap, label: "Smart Home", stores: 19 },
  { icon: Wrench, label: "Tools & Hardware", stores: 23 },
  { icon: Trees, label: "Landscaping", stores: 12 },
] as const;

type StoreCard = {
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

const FEATURED_STORES: StoreCard[] = [
  ...Object.values(STOREFRONTS).map((s) => ({
    slug: s.slug,
    name: s.name,
    tagline: s.tagline,
    category: s.category,
    logo: s.logo,
    banner: s.banner,
    accent: s.accent,
    rating: s.rating,
    productsCount: s.products.length,
    verified: s.verified,
    live: true,
  })),
  ...TEASER_STORES,
];

/* ─── Formatting helpers ─────────────────────────────────────────────────── */

const naira = (n: number) => "₦" + n.toLocaleString("en-NG");

/* ─── Page ───────────────────────────────────────────────────────────────── */

const MarketplaceHub = () => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const { count: cartCount } = useStoreCart();

  const trending = useMemo(
    () =>
      ALL_PRODUCTS.slice()
        .sort((a, b) => b.reviews - a.reviews)
        .slice(0, 4),
    [],
  );

  const visibleStores = FEATURED_STORES.filter((s) => {
    const matchesCategory =
      activeCategory === "All" || s.category === activeCategory;
    const matchesQuery =
      !query ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.tagline.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Seo
        title="PropertyLoop Marketplace"
        description="Shop verified vendor storefronts for furniture, building materials, smart home and more. Each store runs on PropertyLoop."
        path="/marketplace"
      />
      <Navbar />

      {/* ─── Hero ───────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&h=800&fit=crop)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/95 via-primary-dark/85 to-primary-dark/60" />
        <span className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-amber-300/10 blur-3xl" />
        <span className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-emerald-300/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-300/20 border border-amber-300/30 text-amber-200 text-[11px] font-semibold tracking-wide uppercase">
              <Sparkles className="h-3 w-3" />
              Marketplace
            </span>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.05]">
              Every store you need
              <br />
              <span className="text-white/70">for your next home.</span>
            </h1>
            <p className="mt-5 text-white/80 text-base sm:text-lg max-w-xl">
              Shop verified vendors for furniture, building materials, lighting, smart home and more. Each one runs its own branded storefront, checkout is secured by PropertyLoop.
            </p>

            <div className="mt-8 bg-white/10 backdrop-blur-md border border-white/15 rounded-full p-2 flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search stores, categories or products"
                  className="w-full h-11 pl-11 pr-4 bg-transparent text-white placeholder:text-white/50 text-sm focus:outline-none"
                />
              </div>
              <Link
                to="/marketplace/products"
                className="shrink-0 h-11 px-6 rounded-full bg-white text-primary-dark text-sm font-bold hover:bg-white/90 transition-colors inline-flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Browse all
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                to="/marketplace/products"
                className="h-10 px-5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm inline-flex items-center gap-2"
              >
                <Package className="h-3.5 w-3.5" />
                All products
              </Link>
              <Link
                to="/marketplace/cart"
                className="h-10 pl-4 pr-5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm inline-flex items-center gap-2"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Cart
                <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-white text-primary-dark text-[10px] font-bold inline-flex items-center justify-center">
                  {cartCount}
                </span>
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {[
                { v: "180+", l: "verified stores" },
                { v: "4,200+", l: "products" },
                { v: "Lagos-wide", l: "delivery" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs"
                >
                  <span className="font-heading font-bold text-white">
                    {s.v}
                  </span>
                  <span className="text-white/60">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 lg:px-10 py-14">
        {/* ─── Categories strip ───────────────────────────────────────── */}
        <section>
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="font-heading font-bold text-primary-dark text-2xl">
                Shop by category
              </h2>
              <p className="text-text-secondary text-sm mt-1">
                Discover vendors across every room of the home.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIES.map(({ icon: Icon, label, stores }) => (
              <button
                key={label}
                onClick={() => setActiveCategory(label)}
                className={`group rounded-2xl border p-4 text-left transition-all ${
                  activeCategory === label
                    ? "bg-primary-dark border-primary-dark text-white"
                    : "bg-white/80 border-border-light text-primary-dark hover:border-primary"
                }`}
              >
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-xl mb-3 ${
                    activeCategory === label
                      ? "bg-white/10 text-white"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <p className="font-heading font-bold text-sm leading-tight">
                  {label}
                </p>
                <p
                  className={`text-xs mt-0.5 ${
                    activeCategory === label ? "text-white/60" : "text-text-subtle"
                  }`}
                >
                  {stores} stores
                </p>
              </button>
            ))}
          </div>
          {activeCategory !== "All" && (
            <button
              onClick={() => setActiveCategory("All")}
              className="mt-4 text-xs font-semibold text-primary hover:underline"
            >
              Clear category filter
            </button>
          )}
        </section>

        {/* ─── Featured stores ────────────────────────────────────────── */}
        <section className="mt-16">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="font-heading font-bold text-primary-dark text-2xl">
                Featured storefronts
              </h2>
              <p className="text-text-secondary text-sm mt-1">
                Branded, verified, ready to ship.
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-text-secondary text-xs">
              <TrendingUp className="h-3.5 w-3.5" />
              Updated weekly
            </span>
          </div>

          {visibleStores.length === 0 ? (
            <div className="text-center py-16 bg-white/60 rounded-3xl border border-border-light">
              <div className="w-14 h-14 mx-auto rounded-full bg-white border border-border-light flex items-center justify-center mb-3">
                <Store className="w-6 h-6 text-text-subtle" />
              </div>
              <h3 className="font-heading font-bold text-primary-dark text-lg">
                No stores match
              </h3>
              <p className="text-text-secondary text-sm mt-1">
                Try a different category or search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleStores.map((s) => (
                <article
                  key={s.slug}
                  className="group relative overflow-hidden rounded-3xl bg-white border border-border-light shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_14px_32px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={s.banner}
                      alt=""
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, ${s.accent}cc 0%, transparent 60%)`,
                      }}
                    />
                    {!s.live && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wide">
                        Opening soon
                      </span>
                    )}
                  </div>

                  <div className="relative px-5 pb-5 -mt-10 flex-1 flex flex-col">
                    <div className="flex items-end justify-between mb-3">
                      <div className="h-16 w-16 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-white">
                        <img
                          src={s.logo}
                          alt={s.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      {s.verified && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
                          <BadgeCheck className="h-3 w-3" />
                          Verified
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading font-bold text-primary-dark text-base leading-tight">
                      {s.name}
                    </h3>
                    <p className="text-text-secondary text-xs mt-0.5">
                      {s.category}
                    </p>
                    <p className="text-text-body text-sm mt-2 line-clamp-2">
                      {s.tagline}
                    </p>

                    <div className="mt-4 flex items-center gap-3 text-xs text-text-secondary">
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3 w-3 text-[#F5A623] fill-[#F5A623]" />
                        <span className="font-semibold text-primary-dark">
                          {s.rating.toFixed(1)}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {s.productsCount} products
                      </span>
                    </div>

                    <Link
                      to={s.live ? `/store/${s.slug}` : "#"}
                      aria-disabled={!s.live}
                      onClick={(e) => {
                        if (!s.live) e.preventDefault();
                      }}
                      className={`mt-5 h-10 rounded-full text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors ${
                        s.live
                          ? "bg-primary-dark text-white hover:bg-black"
                          : "bg-black/5 text-text-subtle cursor-not-allowed"
                      }`}
                    >
                      {s.live ? "Visit store" : "Opening soon"}
                      {s.live && <ArrowRight className="h-3.5 w-3.5" />}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* ─── Trending products ──────────────────────────────────────── */}
        <section className="mt-16">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="font-heading font-bold text-primary-dark text-2xl">
                Trending across stores
              </h2>
              <p className="text-text-secondary text-sm mt-1">
                What buyers are ordering this week.
              </p>
            </div>
            <Link
              to="/marketplace/products"
              className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:underline"
            >
              See all products
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {trending.map((p) => (
              <Link
                key={`${p.storeSlug}-${p.id}`}
                to={`/store/${p.storeSlug}/product/${p.id}`}
                className="group relative overflow-hidden rounded-3xl bg-white border border-border-light shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <p className="text-text-subtle text-[11px] uppercase tracking-wide font-semibold">
                    {p.storeName}
                  </p>
                  <h3 className="font-heading font-bold text-primary-dark text-sm mt-0.5 line-clamp-2">
                    {p.name}
                  </h3>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="font-heading font-bold text-primary-dark text-base">
                      {naira(p.priceNaira)}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs text-text-secondary">
                      <Star className="h-3 w-3 text-[#F5A623] fill-[#F5A623]" />
                      {p.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── Sell on marketplace CTA ─────────────────────────────────── */}
        <section className="mt-16 relative overflow-hidden rounded-3xl p-8 lg:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-dark/80" />
          <span className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-amber-300/20 blur-3xl" />
          <span className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-amber-200 text-[11px] font-semibold tracking-wide uppercase">
                <Store className="h-3 w-3" />
                For vendors
              </span>
              <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Open your branded storefront on PropertyLoop
              </h2>
              <p className="mt-4 text-white/80 text-sm sm:text-base max-w-md">
                Your own URL, logo and inventory. Send your customers straight to your store, let realtors recommend your products to their clients, and keep the vast majority of every sale. We only earn when you earn.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/onboarding?role=vendor"
                  className="h-11 px-6 rounded-full bg-white text-primary-dark text-sm font-bold inline-flex items-center gap-2 hover:bg-white/90 transition-colors shadow"
                >
                  Start selling
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/pricing"
                  className="h-11 px-6 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm inline-flex items-center gap-2"
                >
                  See commission tiers
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: Store,
                  title: "Your own store",
                  body: "Branded URL, logo, colours. Looks like your site, not ours.",
                },
                {
                  icon: Percent,
                  title: "Keep more sales",
                  body: "Tiered commission starting at 5%. No listing fees.",
                },
                {
                  icon: Users,
                  title: "Realtor referrals",
                  body: "Agents recommend you with trackable codes.",
                },
                {
                  icon: Truck,
                  title: "Delivery handled",
                  body: "Opt in to shared logistics or keep your own.",
                },
              ].map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="mt-3 font-heading font-bold text-white text-sm">
                    {title}
                  </p>
                  <p className="text-white/60 text-xs leading-relaxed mt-0.5">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Buyer trust strip ───────────────────────────────────────── */}
        <section className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: ShieldCheck,
              title: "Buyer protection",
              body: "Checkout and refunds secured by PropertyLoop.",
            },
            {
              icon: BadgeCheck,
              title: "Verified vendors",
              body: "KYC and address checks before a store goes live.",
            },
            {
              icon: Star,
              title: "Reviews that matter",
              body: "Only buyers who ordered can rate a store.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl bg-white/80 border border-border-light p-5 flex items-start gap-3"
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-heading font-bold text-primary-dark text-sm">
                  {title}
                </p>
                <p className="text-text-secondary text-xs leading-relaxed mt-0.5">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MarketplaceHub;
