import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Bath,
  Bed,
  Building2,
  Check,
  Hammer,
  KeyRound,
  Lamp,
  LayoutGrid,
  MapPin,
  Palmtree,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sofa,
  Store,
  Trees,
  Wrench,
  Zap,
} from "lucide-react";
import marketplaceService from "../../api/services/marketplace";
import type { ProductWithStore } from "../../api/services/marketplace";
import type { Listing } from "../../api/types";
import { useStoreCart } from "../../context/StoreCartContext";
import { PRODUCT_MARKETPLACE } from "../../config/features";
import { IMG, sizedImage } from "../../lib/imageSize";
import { listingToTile } from "./tileData";

/* ═══════════════════════════════════════════════════════════════════════════
   HomeHero — the first screen of propertyloop.ng.

   It has one idea to get across: PropertyLoop sells the home *and* what goes
   in it, through one checkout people can trust. So every part of it carries
   both halves — the category strip, the search (Buy · Rent · Shortlet · Shop)
   and the showcase, where a property of our own sits beside things from the
   marketplace you can put in your cart without leaving the page.
   ═══════════════════════════════════════════════════════════════════════════ */

const LIME = "#a3e635";
const FIELD = "#0f2e1b";

/** Properties lead; the rest deep-link into the marketplace, filtered. */
const CATEGORY_TILES = [
  { label: "Properties", href: "/buy", icon: Building2, tint: "#1f6f43", lead: true },
  { label: "Furniture", href: "/marketplace?category=Furniture", icon: Sofa, tint: "#b9842c" },
  { label: "Lighting", href: "/marketplace?category=Lighting%20%26%20Decor", icon: Lamp, tint: "#c2410c" },
  { label: "Materials", href: "/marketplace?category=Building%20Materials", icon: Hammer, tint: "#2563eb" },
  { label: "Smart Home", href: "/marketplace?category=Smart%20Home", icon: Zap, tint: "#7c3aed" },
  { label: "Tools", href: "/marketplace?category=Tools%20%26%20Hardware", icon: Wrench, tint: "#be123c" },
  { label: "Garden", href: "/marketplace?category=Landscaping", icon: Trees, tint: "#15803d" },
  { label: "All", href: "/marketplace", icon: LayoutGrid, tint: "#4b5563" },
].filter((t) => PRODUCT_MARKETPLACE || t.lead);

type Mode = "buy" | "rent" | "shortlet" | "shop";

const MODES: {
  key: Mode;
  label: string;
  icon: typeof Building2;
  path: string;
  placeholder: string;
  popular: string[];
}[] = [
  {
    key: "buy",
    label: "Buy",
    icon: Building2,
    path: "/buy",
    placeholder: "Area, city or landmark — Lekki, Epe, Ikeja GRA",
    popular: ["Lekki", "Ikoyi", "Ajah", "Epe"],
  },
  {
    key: "rent",
    label: "Rent",
    icon: KeyRound,
    path: "/rent",
    placeholder: "Where do you want to rent?",
    popular: ["Yaba", "Lekki", "Surulere", "Gbagada"],
  },
  {
    key: "shortlet",
    label: "Shortlet",
    icon: Palmtree,
    path: "/shortlet",
    placeholder: "Where are you staying?",
    popular: ["Victoria Island", "Lekki Phase 1", "Ikoyi"],
  },
  ...(PRODUCT_MARKETPLACE
    ? [
        {
          key: "shop" as const,
          label: "Shop",
          icon: ShoppingBag,
          path: "/marketplace/products",
          placeholder: "Sofas, tiles, lighting, doors…",
          popular: ["Sofa", "Tiles", "Lighting", "Doors"],
        },
      ]
    : []),
];

const TRUST = [
  { icon: BadgeCheck, title: "Verified listings", text: "Papers and photos checked" },
  { icon: ShieldCheck, title: "Safe checkout", text: "Paid through PropertyLoop" },
  { icon: Store, title: "Verified vendors", text: "Stores we've approved" },
];

const ROTATE_MS = 5500;
const naira = (n: number) => "₦" + n.toLocaleString("en-NG");

export default function HomeHero({
  stock,
  stockLoading,
}: {
  stock: Listing[];
  stockLoading: boolean;
}) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { addItem } = useStoreCart();

  const [mode, setMode] = useState<Mode>("buy");
  const [q, setQ] = useState("");
  const active = MODES.find((m) => m.key === mode) ?? MODES[0];

  const homes = useMemo(() => stock.map(listingToTile), [stock]);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const home = homes.length ? homes[slide % homes.length] : null;

  const [products, setProducts] = useState<ProductWithStore[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(!PRODUCT_MARKETPLACE);
  const [added, setAdded] = useState<string | null>(null);

  useEffect(() => {
    if (!PRODUCT_MARKETPLACE) return;
    let alive = true;
    marketplaceService
      .listProducts({ limit: 8, sort: "newest" })
      .then((res) => {
        if (!alive) return;
        // In-stock first, so the hero never leads with something you can't buy.
        const sorted = [...res.items].sort(
          (a, b) => Number(b.inStock) - Number(a.inStock),
        );
        setProducts(sorted.slice(0, 2));
      })
      .catch(() => undefined)
      .finally(() => alive && setProductsLoaded(true));
    return () => {
      alive = false;
    };
  }, []);

  // The featured home rotates through our stock. Paused on hover, and not at
  // all for anyone who has asked their system for less motion.
  const [tabHidden, setTabHidden] = useState(false);
  useEffect(() => {
    const onVis = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    if (reduceMotion || paused || tabHidden || homes.length < 2) return;
    const t = window.setInterval(
      () => setSlide((s) => (s + 1) % homes.length),
      ROTATE_MS,
    );
    return () => window.clearInterval(t);
  }, [reduceMotion, paused, tabHidden, homes.length]);

  function go(term: string) {
    const t = term.trim();
    navigate(t ? `${active.path}?q=${encodeURIComponent(t)}` : active.path);
  }

  function addToCart(p: ProductWithStore) {
    addItem({
      productId: p.id,
      storeSlug: p.storeSlug,
      storeName: p.storeName,
      name: p.name,
      priceNaira: p.priceNaira,
      image: p.image,
    });
    setAdded(p.id);
    window.setTimeout(() => setAdded((cur) => (cur === p.id ? null : cur)), 1500);
  }

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: FIELD }}>
      {/* Texture and light — a faint dot grid and two soft glows. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-56 h-[640px] w-[640px] rounded-full bg-[#1f6f43]/45 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-64 -left-40 h-[540px] w-[540px] rounded-full bg-[#b9842c]/15 blur-[120px]"
      />

      <div className="relative mx-auto max-w-360 px-4 pb-14 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:px-8 lg:pb-20">
        {/* ── Category strip ─────────────────────────────────────────── */}
        <nav
          aria-label="Shop by category"
          className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:justify-center sm:gap-4 sm:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {CATEGORY_TILES.map(({ label, href, icon: Icon, tint, lead }) => (
            <Link
              key={label}
              to={href}
              className="group flex w-[68px] shrink-0 flex-col items-center gap-2 sm:w-[80px]"
            >
              <span
                className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-[0_6px_18px_rgba(0,0,0,0.22)] transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_12px_26px_rgba(0,0,0,0.3)] sm:h-[72px] sm:w-[72px] ${
                  lead ? "ring-2 ring-[#a3e635] ring-offset-2 ring-offset-[#0f2e1b]" : ""
                }`}
              >
                <Icon className="h-7 w-7" style={{ color: tint }} strokeWidth={1.75} />
              </span>
              <span className="text-center text-[11.5px] font-medium leading-tight text-white/75 transition-colors group-hover:text-white sm:text-[12.5px]">
                {label}
              </span>
            </Link>
          ))}
        </nav>

        <div
          aria-hidden
          className="mt-6 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent sm:mt-8"
        />

        <div className="mt-10 grid grid-cols-1 items-center gap-10 lg:mt-12 lg:grid-cols-12 lg:gap-12">
          {/* ── Left: the pitch and the search ───────────────────────── */}
          <div className="min-w-0 lg:col-span-5">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: LIME }} />
              {PRODUCT_MARKETPLACE ? "Homes · Furniture · Materials" : "Buy · Rent · Shortlet"}
            </p>

            <h1 className="font-heading mt-5 text-[40px] font-extrabold leading-[1.02] tracking-tight text-white sm:text-[54px] lg:text-[62px]">
              Find the home.
              <br />
              <span className="font-display font-medium italic" style={{ color: LIME }}>
                {PRODUCT_MARKETPLACE ? "Fill it too." : "Move in sure."}
              </span>
            </h1>

            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/65 sm:text-base">
              Verified properties from our own team and trusted agents
              {PRODUCT_MARKETPLACE
                ? " — plus furniture, materials and everything else the place needs, from verified vendors. One account, one safe checkout."
                : ", with papers and photos checked before they reach you."}
            </p>

            {/* Search — one box for homes and for shopping */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                go(q);
              }}
              className="mt-8 rounded-2xl bg-white p-2 shadow-[0_24px_60px_rgba(0,0,0,0.38)]"
            >
              <div role="tablist" aria-label="What are you looking for?" className="flex gap-1 p-1">
                {MODES.map((m) => {
                  const on = mode === m.key;
                  return (
                    <button
                      key={m.key}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      onClick={() => setMode(m.key)}
                      className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-[13px] font-bold transition-colors ${
                        on
                          ? m.key === "shop"
                            ? "bg-[#b9842c] text-white"
                            : "bg-[#0f2e1b] text-white"
                          : "text-[#0f2e1b]/55 hover:bg-gray-100 hover:text-[#0f2e1b]"
                      }`}
                    >
                      <m.icon className="hidden h-3.5 w-3.5 min-[400px]:block" />
                      {m.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-1 flex items-center gap-2 rounded-xl bg-gray-50 pl-4 pr-1.5 ring-1 ring-gray-100 transition-shadow focus-within:ring-2 focus-within:ring-[#1f6f43]/35">
                {mode === "shop" ? (
                  <ShoppingBag className="h-4 w-4 shrink-0 text-gray-400" />
                ) : (
                  <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                )}
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={active.placeholder}
                  aria-label={mode === "shop" ? "Search the marketplace" : "Search properties"}
                  className="min-w-0 flex-1 bg-transparent py-3.5 text-[14px] text-[#0f1111] outline-none placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="my-1.5 inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#1f6f43] px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#175534]"
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 px-2 pb-1 pt-3">
                <span className="text-[11.5px] font-semibold text-gray-400">Popular:</span>
                {active.popular.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => go(p)}
                    className="rounded-full bg-gray-100 px-2.5 py-1 text-[11.5px] font-medium text-[#0f2e1b]/70 transition-colors hover:bg-[#e3efe7] hover:text-[#0f2e1b]"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </form>

            {/* Trust */}
            <ul className="mt-7 grid grid-cols-3 gap-3">
              {TRUST.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-2.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10">
                    <Icon className="h-4 w-4" style={{ color: LIME }} />
                  </span>
                  <span>
                    <span className="block text-[12.5px] font-bold leading-tight text-white">{title}</span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-white/50">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Right: the showcase ──────────────────────────────────── */}
          <div className="min-w-0 lg:col-span-7">
            <div className="grid grid-cols-2 gap-3 sm:h-[440px] sm:grid-cols-5 sm:grid-rows-2 sm:gap-4 lg:h-[500px]">
              {/* Featured home */}
              <div
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                className="relative col-span-2 h-[340px] overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 sm:col-span-3 sm:row-span-2 sm:h-auto"
              >
                {stockLoading ? (
                  <div className="absolute inset-0 animate-pulse bg-white/5" />
                ) : home ? (
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={home.id}
                      initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                    >
                      <Link to={home.href} className="group block h-full">
                        {home.coverImage ? (
                          <img
                            src={sizedImage(home.coverImage, IMG.hero)}
                            alt={home.title}
                            className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-[#163d26] text-sm font-medium text-white/40">
                            Photos coming
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/15" />

                        <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
                          <span
                            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider"
                            style={{ backgroundColor: LIME, color: FIELD }}
                          >
                            <BadgeCheck className="h-3 w-3" />
                            PropertyLoop stock
                          </span>
                          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-[#0f2e1b]">
                            {home.typeLabel}
                          </span>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                          <h3 className="font-heading line-clamp-2 text-[22px] font-bold leading-tight text-white sm:text-[26px]">
                            {home.title}
                          </h3>
                          <p className="mt-1.5 flex items-center gap-1 text-[13px] text-white/70">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{home.location}</span>
                          </p>
                          <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-heading truncate text-[22px] font-extrabold leading-none text-white sm:text-[26px]">
                                {home.priceLabel}
                                {home.period && (
                                  <span className="ml-1 text-[13px] font-semibold text-white/60">
                                    /{home.period.toLowerCase()}
                                  </span>
                                )}
                              </p>
                              {(home.beds > 0 || home.baths > 0) && (
                                <p className="mt-2 flex items-center gap-3 text-[12px] text-white/65">
                                  {home.beds > 0 && (
                                    <span className="inline-flex items-center gap-1">
                                      <Bed className="h-3.5 w-3.5" /> {home.beds} bed
                                    </span>
                                  )}
                                  {home.baths > 0 && (
                                    <span className="inline-flex items-center gap-1">
                                      <Bath className="h-3.5 w-3.5" /> {home.baths} bath
                                    </span>
                                  )}
                                </p>
                              )}
                            </div>
                            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[12.5px] font-bold text-[#0f2e1b] transition-transform group-hover:translate-x-0.5">
                              View property
                              <ArrowRight className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <Link
                    to="/buy"
                    className="group flex h-full flex-col items-start justify-end bg-gradient-to-br from-[#163d26] to-[#0f2e1b] p-6"
                  >
                    <Building2 className="h-8 w-8" style={{ color: LIME }} />
                    <p className="font-heading mt-4 text-[24px] font-bold leading-tight text-white">
                      Browse verified homes
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-white/80 group-hover:text-white">
                      See listings <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                )}

                {homes.length > 1 && (
                  <div className="absolute right-4 top-4 flex gap-1.5">
                    {homes.map((h, i) => {
                      const on = i === slide % homes.length;
                      return (
                        <button
                          key={h.id}
                          type="button"
                          aria-label={`Show ${h.title}`}
                          aria-current={on}
                          onClick={() => setSlide(i)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            on ? "w-6 bg-white" : "w-1.5 bg-white/45 hover:bg-white/70"
                          }`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Marketplace picks */}
              {!PRODUCT_MARKETPLACE ? null : !productsLoaded ? (
                <>
                  <div className="h-[220px] animate-pulse rounded-3xl bg-white/10 sm:col-span-2 sm:h-auto" />
                  <div className="h-[220px] animate-pulse rounded-3xl bg-white/10 sm:col-span-2 sm:h-auto" />
                </>
              ) : products.length === 0 ? (
                <SellCard tall />
              ) : (
                products.map((p) => {
                  const href = `/store/${p.storeSlug}/product/${p.id}`;
                  return (
                    <div
                      key={p.id}
                      className="group flex flex-col overflow-hidden rounded-3xl bg-white sm:col-span-2"
                    >
                      <Link
                        to={href}
                        className="relative block aspect-square overflow-hidden bg-[#f3efe9] sm:aspect-auto sm:min-h-0 sm:flex-1"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-[#b9842c] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                          Marketplace
                        </span>
                      </Link>
                      <div className="flex items-end justify-between gap-2 p-3 sm:p-4">
                        <div className="min-w-0">
                          <p className="truncate text-[11px] font-semibold text-[#1f6f43]">
                            {p.storeName}
                          </p>
                          <Link to={href}>
                            <p className="truncate text-[13.5px] font-bold text-[#0f2e1b] hover:underline">
                              {p.name}
                            </p>
                          </Link>
                          <p className="mt-0.5 text-[14px] font-extrabold text-[#0f2e1b]">
                            {naira(p.priceNaira)}
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={!p.inStock}
                          aria-label={`Add ${p.name} to cart`}
                          onClick={() => addToCart(p)}
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#0f2e1b] text-white transition-colors hover:bg-black disabled:opacity-40"
                        >
                          {added === p.id ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
              {PRODUCT_MARKETPLACE && productsLoaded && products.length === 1 && (
                <SellCard />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Vendor call-to-action that fills a showcase slot the marketplace can't. */
function SellCard({ tall = false }: { tall?: boolean }) {
  return (
    <Link
      to="/onboarding?role=vendor"
      className={`group flex flex-col justify-end rounded-3xl bg-white/[0.06] ring-1 ring-white/10 transition-colors hover:bg-white/10 sm:col-span-2 ${
        tall ? "col-span-2 p-6 sm:row-span-2" : "col-span-1 p-4 sm:p-5"
      }`}
    >
      <Store className={tall ? "h-8 w-8" : "h-6 w-6"} style={{ color: LIME }} />
      <p
        className={`font-heading mt-3 font-bold leading-tight text-white ${
          tall ? "text-[22px]" : "text-[15px] sm:text-[18px]"
        }`}
      >
        Sell to people furnishing new homes
      </p>
      {tall && (
        <p className="mt-2 text-[13px] leading-relaxed text-white/60">
          Open your store on PropertyLoop. We handle checkout and only earn when
          you do.
        </p>
      )}
      <span className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-white/85 transition-colors group-hover:text-white">
        Start selling <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}
