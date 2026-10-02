import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  RotateCcw,
  Search,
  ShieldCheck,
  Store,
  WifiOff,
} from "lucide-react";
import listingsService from "../../api/services/listings";
import type { Listing } from "../../api/types";
import PropertyTile from "./PropertyTile";
import { listingToTile } from "./tileData";

/**
 * The top of the home page: PropertyLoop's own stock, four across.
 *
 * Stock we list ourselves leads, because it is the only inventory we can
 * vouch for end to end — and the only one an agent can earn on without
 * holding the mandate. Agents' listings follow underneath.
 *
 * When there is less stock than panels, the remaining slots carry the things
 * a first-time visitor needs anyway rather than stretching four properties
 * out of one. An empty-looking shop front is worse than a smaller one.
 */

const TABS = [
  { label: "Buy", path: "/buy" },
  { label: "Rent", path: "/rent" },
  { label: "Shortlet", path: "/shortlet" },
] as const;

const PANELS = 4;

const PROMOS = [
  {
    title: "List your property",
    body: "Reach buyers and tenants who are already searching. Free to list, verified before it goes live.",
    cta: "Start listing",
    to: "/add-property",
    icon: Building2,
    tint: "bg-[#eaf3ed]",
  },
  {
    title: "Earn on our stock",
    body: "Introduce a buyer to a PropertyLoop property and earn commission. No mandate needed.",
    cta: "Join as a partner",
    to: "/realtors/partners",
    icon: Store,
    tint: "bg-[#fbeed4]",
  },
  {
    title: "Every deal in escrow",
    body: "Money is held until the work is done and the papers check out. Verified agents only.",
    cta: "How it works",
    to: "/how-it-works",
    icon: ShieldCheck,
    tint: "bg-[#e6eef7]",
  },
];

function PromoPanel({ promo }: { promo: (typeof PROMOS)[number] }) {
  const Icon = promo.icon;
  return (
    <Link
      to={promo.to}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl ${promo.tint} p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(16,36,25,0.12)]`}
    >
      {/* A property panel is tall, and these sit beside it. Rather than leave
          the difference as dead space, the icon grows into it. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-8 -right-6 text-primary-dark/[0.07] transition-transform duration-500 group-hover:scale-105"
      >
        <Icon className="h-44 w-44" strokeWidth={1.25} />
      </span>

      <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-primary-dark">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="font-heading relative mt-4 text-[20px] font-bold leading-[1.15] tracking-tight text-primary-dark sm:text-[22px]">
        {promo.title}
      </h3>
      <p className="relative mt-2 text-[13.5px] leading-relaxed text-text-body">
        {promo.body}
      </p>
      <span className="relative mt-auto inline-flex items-center gap-1.5 pt-6 text-[13px] font-bold text-primary-dark transition-transform duration-300 group-hover:translate-x-0.5">
        {promo.cta}
        <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}

function PanelSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-3xl bg-white p-4">
      <div className="h-5 w-3/4 animate-pulse rounded-full bg-primary/10" />
      <div className="mt-2 h-3.5 w-1/2 animate-pulse rounded-full bg-primary/5" />
      <div className="mt-3 aspect-[4/5] w-full animate-pulse rounded-2xl bg-primary/5" />
      <div className="mt-3.5 h-5 w-1/3 animate-pulse rounded-full bg-primary/10" />
    </div>
  );
}

export default function StockHero() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<(typeof TABS)[number]["label"]>("Buy");
  const [stock, setStock] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  // Bumped by the retry button. The request lives in the effect so nothing is
  // set during render, and a stale response from a previous attempt cannot
  // land on top of a newer one.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    listingsService
      .list({ ownership: "HOUSE", limit: PANELS, sort: "newest" })
      .then((res) => {
        if (!alive) return;
        setStock(res.items);
        setFailed(false);
      })
      .catch(() => {
        if (alive) setFailed(true);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [attempt]);

  const retry = () => {
    setLoading(true);
    setFailed(false);
    setAttempt((n) => n + 1);
  };

  function search(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    const path = TABS.find((t) => t.label === tab)?.path ?? "/buy";
    navigate(q ? `${path}?q=${encodeURIComponent(q)}` : path);
  }

  // Promos fill whatever stock does not, so the row is always complete.
  const promos = PROMOS.slice(0, Math.max(0, PANELS - stock.length));

  return (
    <section className="bg-[#f5f0eb] pb-10 pt-6 sm:pt-8">
      <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
        {/* Search first: most people arrive knowing where they want to live. */}
        <form
          onSubmit={search}
          className="rounded-3xl bg-white p-3 shadow-[0_2px_14px_rgba(16,36,25,0.06)] sm:p-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex shrink-0 gap-1 self-start rounded-full bg-bg-accent p-1 sm:self-auto">
              {TABS.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => setTab(t.label)}
                  className={`rounded-full px-4 py-2 text-[13px] font-bold transition-colors ${
                    tab === t.label
                      ? "bg-primary text-white"
                      : "text-primary-dark hover:bg-white/70"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex flex-1 items-center gap-2 rounded-full border border-border-light px-4 py-2.5">
              <Search className="h-4 w-4 shrink-0 text-text-subtle" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by area, city or landmark — Lekki, Epe, Ikeja GRA"
                aria-label="Search properties"
                className="min-w-0 flex-1 bg-transparent text-sm text-primary-dark outline-none placeholder:text-text-subtle"
              />
            </div>
            <button
              type="submit"
              className="shrink-0 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-ink"
            >
              Search
            </button>
          </div>
        </form>

        <div className="mt-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
              PropertyLoop stock
            </p>
            <h1 className="font-heading mt-1.5 text-[26px] font-bold leading-[1.1] tracking-tight text-primary-dark sm:text-[34px]">
              Property we list ourselves
            </h1>
            <p className="mt-1.5 max-w-xl text-[14px] leading-relaxed text-text-secondary">
              Checked by our team before it reaches you — papers, photographs
              and price.
            </p>
          </div>
          <Link
            to="/buy"
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 px-5 py-2.5 text-[13px] font-bold text-primary-dark transition-colors hover:bg-primary hover:text-white"
          >
            Browse everything
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {failed ? (
          <div className="mt-5 flex flex-col items-center gap-3 rounded-3xl bg-white px-6 py-12 text-center">
            <WifiOff className="h-6 w-6 text-text-subtle" />
            <p className="text-sm text-text-secondary">
              We could not load our stock just now.
            </p>
            <button
              onClick={retry}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-[13px] font-bold text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Try again
            </button>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {loading
              ? Array.from({ length: PANELS }).map((_, i) => (
                  <PanelSkeleton key={i} />
                ))
              : [
                  ...stock.map((l) => (
                    <PropertyTile
                      key={l.id}
                      data={listingToTile(l)}
                      variant="panel"
                      badge="PropertyLoop"
                    />
                  )),
                  ...promos.map((p) => <PromoPanel key={p.title} promo={p} />),
                ]}
          </div>
        )}
      </div>
    </section>
  );
}
