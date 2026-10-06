import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
} from "lucide-react";

/* ─── Home spotlight for the vendor marketplace ──────────────────────────── */

const FEATURED = [
  {
    slug: "casa-nova-interiors",
    name: "Casa Nova Interiors",
    tagline: "Furniture that moves in before you do.",
    category: "Furniture & Interiors",
    accent: "#2b4e3b",
    rating: 4.8,
    products: 128,
    logo: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&h=400&fit=crop",
    hero: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
  },
  {
    slug: "ironworks-building-co",
    name: "Ironworks Building Co.",
    tagline: "Materials sized for your site.",
    category: "Building Materials",
    accent: "#8a3b1f",
    rating: 4.7,
    products: 86,
    logo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop",
    hero: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop",
  },
  {
    slug: "lumen-lighting",
    name: "Lumen Lighting",
    tagline: "Warmer rooms, piece by piece.",
    category: "Lighting & Decor",
    accent: "#3b3b6b",
    rating: 4.9,
    products: 54,
    logo: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=400&fit=crop",
    hero: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=600&fit=crop",
  },
];

const MarketplaceSpotlight = () => {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* ─── Section header ─────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-4 lg:justify-between mb-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold tracking-wide uppercase">
              <Sparkles className="h-3 w-3" />
              New · Marketplace
            </span>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-dark tracking-tight leading-[1.1]">
              Branded storefronts
              <br />
              <span className="text-primary">for every corner of a home.</span>
            </h2>
            <p className="mt-4 text-text-secondary text-sm sm:text-base max-w-xl">
              Furniture, materials, lighting, smart home — each vendor runs their own storefront on PropertyLoop. Checkout, delivery and buyer protection are handled by us.
            </p>
          </div>
          <Link
            to="/marketplace"
            className="shrink-0 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-primary-dark text-white text-sm font-bold hover:bg-black transition-colors self-start lg:self-auto"
          >
            Visit the marketplace
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* ─── Featured storefront cards ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {FEATURED.map((s) => (
            <Link
              key={s.slug}
              to={`/store/${s.slug}`}
              className="group relative overflow-hidden rounded-3xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300"
              style={{ backgroundColor: s.accent }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity duration-500"
                style={{ backgroundImage: `url(${s.hero})` }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(170deg, ${s.accent}30 0%, ${s.accent} 70%)`,
                }}
              />

              <div className="relative z-10 p-6 min-h-[320px] flex flex-col">
                <div className="flex items-start justify-between">
                  <div className="h-14 w-14 rounded-2xl overflow-hidden border-2 border-white/30 shadow bg-white/10">
                    <img
                      src={s.logo}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold">
                    <BadgeCheck className="h-3 w-3" />
                    Verified
                  </span>
                </div>

                <div className="mt-auto">
                  <p className="text-white/60 text-[11px] font-semibold uppercase tracking-wide">
                    {s.category}
                  </p>
                  <h3 className="mt-1 font-heading font-bold text-white text-xl leading-tight">
                    {s.name}
                  </h3>
                  <p className="mt-1 text-white/80 text-sm">{s.tagline}</p>

                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-white/80 text-xs">
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-300 fill-amber-300" />
                        <span className="font-semibold text-white">
                          {s.rating.toFixed(1)}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <ShoppingBag className="h-3 w-3" />
                        {s.products} products
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-white text-xs font-bold">
                      Visit
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ─── Secondary row: vendors CTA ─────────────────────────── */}
        <div className="mt-10 rounded-3xl bg-white/80 border border-border-light px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center gap-5">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Store className="h-6 w-6" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-heading font-bold text-primary-dark text-base">
              Have products to sell? Open your store in minutes.
            </p>
            <p className="text-text-secondary text-sm mt-0.5">
              Keep your brand. Your URL, your prices, your inventory. We handle checkout and only earn when you earn.
            </p>
          </div>
          <Link
            to="/onboarding?role=vendor"
            className="shrink-0 h-10 px-5 rounded-full bg-primary-dark text-white text-xs font-bold inline-flex items-center gap-1.5 hover:bg-black transition-colors"
          >
            Start selling
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceSpotlight;
