import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useListings } from "../api/hooks";
import listingsService from "../api/services/listings";
import type { Listing } from "../api/types";
import Seo from "../components/Seo";
import {
  Search,
  MapPin,
  Bed,
  Bath,
  Maximize,
  ChevronDown,
  SlidersHorizontal,
  MessageCircle,
  Images,
  X,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import PropertyMap from "../components/ui/PropertyMap";
import type { MapListing } from "../components/ui/PropertyMap";
import BookmarkButton from "../components/ui/BookmarkButton";
import EmptyState from "../components/ui/EmptyState";
import { BouncyLoader } from "../components/agent/ui";

/* ── helpers ─────────────────────────────────────────────────────────── */

const PRICE_OPTS = [
  { value: "any", label: "Any price" },
  { value: "0-50000000", label: "Under ₦50M" },
  { value: "50000000-150000000", label: "₦50M – ₦150M" },
  { value: "150000000-300000000", label: "₦150M – ₦300M" },
  { value: "300000000-0", label: "₦300M+" },
];

const BEDS_OPTS = [
  { value: "any", label: "Any beds" },
  { value: "1", label: "1+ beds" },
  { value: "2", label: "2+ beds" },
  { value: "3", label: "3+ beds" },
  { value: "4", label: "4+ beds" },
];

const SORT_OPTS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "top_rated", label: "Top rated" },
];

const propertyTypeMap: Record<string, string> = {
  "Flats & Apartments": "Flat / Apartment",
  Houses: "House",
  Lands: "Land",
  "Commercial Property": "Commercial",
};

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=1120&fit=crop";

// New-today (gold) → Verified (green) → For sale.
const listingTag = (l: Listing): { label: string; tone: "new" | "verified" } => {
  const ageDays = (Date.now() - new Date(l.createdAt).getTime()) / 86_400_000;
  if (ageDays <= 2) return { label: "New today", tone: "new" };
  return { label: l.agent?.verified ? "Verified" : "For sale", tone: "verified" };
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

/* ── styled pill <select> for the filter bar ─────────────────────────── */

const ChipSelect = ({
  value,
  onChange,
  options,
  active,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  active?: boolean;
}) => (
  <div className="relative shrink-0">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`appearance-none cursor-pointer rounded-full border pl-4 pr-9 py-2.5 text-sm font-semibold transition-colors focus:outline-none ${
        active
          ? "bg-primary-soft border-transparent text-primary-ink"
          : "bg-white border-line text-ink-2 hover:border-primary"
      }`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-3" />
  </div>
);

/* ── page ────────────────────────────────────────────────────────────── */

const Buy = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [priceRange, setPriceRange] = useState("any");
  const [bedsFilter, setBedsFilter] = useState("any");
  const [typeFilter, setTypeFilter] = useState("All Property");
  const [bathsFilter, setBathsFilter] = useState("any");
  const [sort, setSort] = useState("newest");
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [activePin, setActivePin] = useState<number | null>(null);
  // Accumulated listings across pages (infinite scroll).
  const [allListings, setAllListings] = useState<Listing[]>([]);

  const resultsRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const PAGE_SIZE = 5;

  const {
    items: apiListings,
    loading: listingsLoading,
    total,
    page,
    pages,
    nextPage,
    updateParams,
  } = useListings({ type: "SALE", limit: PAGE_SIZE });

  // Debounced search box.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Category / market stats.
  useEffect(() => {
    listingsService
      .getStats("SALE")
      .then(setStats)
      .catch((err) => console.error("Failed to fetch sale stats:", err));
  }, []);

  // Push filters to the API.
  useEffect(() => {
    const [priceMin, priceMax] =
      priceRange !== "any"
        ? priceRange.split("-").map(Number)
        : [undefined, undefined];
    updateParams({
      type: "SALE",
      limit: PAGE_SIZE,
      propertyType: propertyTypeMap[typeFilter] || undefined,
      search: debouncedSearch.trim() || undefined,
      minBeds: bedsFilter !== "any" ? parseInt(bedsFilter) : undefined,
      minBaths: bathsFilter !== "any" ? parseInt(bathsFilter) : undefined,
      minPrice: priceMin || undefined,
      maxPrice: priceMax || undefined,
      sort: sort as any,
    });
  }, [
    typeFilter,
    debouncedSearch,
    priceRange,
    bedsFilter,
    bathsFilter,
    sort,
    updateParams,
  ]);

  // Accumulate pages: page 1 replaces, later pages append (deduped).
  useEffect(() => {
    setAllListings((prev) => {
      if (page <= 1) return apiListings;
      const seen = new Set(prev.map((p) => p.id));
      return [...prev, ...apiListings.filter((l) => !seen.has(l.id))];
    });
  }, [apiListings, page]);

  const hasMore = !!page && !!pages && page < pages;

  // Infinite scroll — auto-load the next page when the sentinel nears view.
  useEffect(() => {
    if (!hasMore || listingsLoading) return;
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) nextPage();
      },
      { rootMargin: "400px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, listingsLoading, nextPage, allListings.length]);

  // Type chip options from live stats.
  const typeOptions = useMemo(() => {
    const opts = [{ value: "All Property", label: "Any type" }];
    if (stats?.byType) {
      for (const type of Object.keys(stats.byType)) {
        const label =
          Object.keys(propertyTypeMap).find(
            (k) => propertyTypeMap[k] === type,
          ) || type;
        opts.push({ value: label, label });
      }
    } else {
      opts.push(
        { value: "Flats & Apartments", label: "Flats & Apartments" },
        { value: "Houses", label: "Houses" },
        { value: "Lands", label: "Lands" },
      );
    }
    return opts;
  }, [stats]);

  // Stable pseudo-coords per listing for the map (backend has no geo yet).
  const coords = useMemo(() => {
    const m: Record<string, { lat: number; lng: number }> = {};
    allListings.forEach((l, i) => {
      // deterministic spread around Lagos based on index
      m[l.id] = {
        lat: 6.43 + ((i * 7) % 30) / 1000,
        lng: 3.4 + ((i * 11) % 80) / 1000,
      };
    });
    return m;
  }, [allListings]);

  const mapListings: MapListing[] = allListings.map((l, i) => ({
    lat: coords[l.id]?.lat ?? 6.45,
    lng: coords[l.id]?.lng ?? 3.4,
    price: l.priceLabel,
    title: l.title,
    address: l.address,
    beds: l.beds,
    baths: l.baths,
    sqft: l.sqft,
    index: i,
  }));

  const featured = allListings[0];
  const homesCount = stats?.total ?? total;
  const agentsCount = stats?.verifiedAgents;
  const fmtPlus = (n?: number) =>
    n == null ? "—" : n >= 1000 ? `${(Math.floor(n / 100) / 10).toFixed(1)}k` : `${n}`;

  const headerArea = debouncedSearch.trim() || "Lagos";
  const resultCount = total || allListings.length;

  const goToListing = (id: string) => navigate(`/property/${id}`);
  const clearAll = () => {
    setSearchQuery("");
    setPriceRange("any");
    setBedsFilter("any");
    setBathsFilter("any");
    setTypeFilter("All Property");
  };

  // Active-filter chips.
  const activeFilters: { key: string; label: string; clear: () => void }[] = [];
  if (debouncedSearch.trim())
    activeFilters.push({
      key: "q",
      label: debouncedSearch.trim(),
      clear: () => setSearchQuery(""),
    });
  if (priceRange !== "any")
    activeFilters.push({
      key: "price",
      label: PRICE_OPTS.find((o) => o.value === priceRange)?.label || "Price",
      clear: () => setPriceRange("any"),
    });
  if (bedsFilter !== "any")
    activeFilters.push({
      key: "beds",
      label: `${bedsFilter}+ beds`,
      clear: () => setBedsFilter("any"),
    });
  if (bathsFilter !== "any")
    activeFilters.push({
      key: "baths",
      label: `${bathsFilter}+ baths`,
      clear: () => setBathsFilter("any"),
    });
  if (typeFilter !== "All Property")
    activeFilters.push({
      key: "type",
      label: typeFilter,
      clear: () => setTypeFilter("All Property"),
    });

  return (
    <div className="min-h-screen bg-[#f5f0eb] font-heading">
      <Seo
        title="Properties for Sale in Nigeria"
        description="Browse verified homes for sale across Lagos, Abuja and Port Harcourt. Every home is walked in person and listed by a KYC-verified agent — message them directly, no middlemen."
        path="/buy"
        keywords="property for sale Nigeria, houses for sale Lagos, buy property, verified properties, PropertyLoop"
      />
      <Navbar />

      {/* ── HERO (editorial split) ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-10 lg:pt-12 pb-8">
        <div className="flex items-end justify-between gap-5 border-b-[1.5px] border-ink/85 pb-4">
          <span className="text-[12px] font-extrabold tracking-[0.22em] uppercase text-primary">
            Homes for Sale · Lagos
          </span>
          <span className="font-display italic text-[15px] text-ink-2 hidden sm:block">
            Updated daily · June 2026
          </span>
        </div>

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-12 mt-8 lg:mt-10 items-end">
          {/* Left — copy + figures */}
          <div>
            <h1 className="font-display font-medium text-[2.6rem] sm:text-[3.6rem] lg:text-[4.5rem] leading-[0.96] tracking-[-0.03em] text-ink">
              Find the one
              <br />
              that's <span className="italic text-primary">actually</span> yours.
            </h1>
            <div className="flex gap-5 mt-7 max-w-[560px]">
              <span className="w-[3px] rounded-full bg-primary shrink-0" />
              <p className="text-base text-ink-2 leading-relaxed">
                Every home here was walked in person by our team and is listed by
                a KYC-verified agent. Browse, then message the person who knows
                the property best — no middlemen.
              </p>
            </div>
            <div className="flex flex-wrap gap-9 mt-9">
              {[
                { n: `${fmtPlus(homesCount)}`, sup: "+", s: "Verified homes for sale" },
                { n: `${fmtPlus(agentsCount)}`, sup: "+", s: "KYC-verified agents" },
                { n: "100", sup: "%", s: "Inspected before listing" },
              ].map((f) => (
                <div key={f.s}>
                  <div className="font-display font-semibold text-3xl tracking-[-0.02em] text-ink">
                    {f.n}
                    <sup className="text-primary text-base">{f.sup}</sup>
                  </div>
                  <div className="text-[12.5px] text-ink-3 mt-1 max-w-[110px] leading-snug">
                    {f.s}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — featured photo with detail card */}
          <div className="relative rounded-[8px_8px_60px_8px] overflow-hidden aspect-[4/5] bg-[#16321f] shadow-[0_30px_60px_rgba(0,0,0,0.16)]">
            <img
              src={featured?.coverImage || FALLBACK_HERO}
              alt={featured?.title || "Featured home"}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 z-[3] bg-white text-ink text-[11px] font-extrabold tracking-[0.1em] uppercase px-3 py-1.5 rounded-full">
              Featured · {featured?.location || "Lekki"}
            </span>
            <button
              type="button"
              onClick={() => featured && goToListing(featured.id)}
              className="absolute left-3.5 right-3.5 bottom-3.5 z-[3] text-left bg-white/85 backdrop-blur-xl border border-white/60 rounded-2xl px-4 py-3.5 hover:bg-white transition-colors"
            >
              <div className="font-display font-bold text-[22px] tracking-[-0.02em] text-ink">
                {featured?.priceLabel || "₦78,000,000"}
              </div>
              <div className="text-[13px] font-bold text-ink mt-0.5 truncate">
                {featured?.title || "Hibiscus House · 4-bed detached"}
              </div>
              <div className="text-xs text-ink-3 mt-0.5 truncate">
                {featured?.address || "Admiralty Way, Lekki Phase 1"}
              </div>
              <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-black/10">
                <div className="w-[26px] h-[26px] rounded-full bg-surface-3 overflow-hidden shrink-0 grid place-items-center text-[9px] font-bold text-primary-ink">
                  {featured?.agent?.avatarUrl ? (
                    <img
                      src={featured.agent.avatarUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    initials(featured?.agent?.name || "PropertyLoop")
                  )}
                </div>
                <b className="text-xs text-ink">
                  {featured?.agent?.name || "Verified agent"}
                </b>
                {featured?.agent?.verified !== false && (
                  <small className="text-primary font-bold text-[11px]">
                    ✓ Verified agent
                  </small>
                )}
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ── STICKY FILTER BAR ────────────────────────────────── */}
      <div className="sticky top-3 z-30 max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="bg-white border border-line-2 rounded-[20px] p-3.5 flex items-center gap-3 flex-wrap shadow-[0_12px_36px_rgba(0,0,0,0.08)]">
          <div className="flex-1 min-w-[200px] flex items-center gap-2.5 bg-surface-2 rounded-full px-4 py-2.5">
            <Search className="w-[18px] h-[18px] text-ink-3 shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by area, e.g. Lekki, Lagos"
              className="flex-1 min-w-0 bg-transparent text-[14.5px] text-ink placeholder:text-ink-3 focus:outline-none"
            />
          </div>
          <ChipSelect
            value={priceRange}
            onChange={setPriceRange}
            options={PRICE_OPTS}
            active={priceRange !== "any"}
          />
          <ChipSelect
            value={bedsFilter}
            onChange={setBedsFilter}
            options={BEDS_OPTS}
            active={bedsFilter !== "any"}
          />
          <ChipSelect
            value={typeFilter}
            onChange={setTypeFilter}
            options={typeOptions}
            active={typeFilter !== "All Property"}
          />
          <button
            onClick={() => setShowAllFilters((s) => !s)}
            className={`shrink-0 inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
              showAllFilters
                ? "bg-primary-soft border-transparent text-primary-ink"
                : "bg-white border-line text-ink-2 hover:border-primary"
            }`}
          >
            <SlidersHorizontal className="w-[15px] h-[15px]" />
            All filters
          </button>
        </div>

        {showAllFilters && (
          <div className="mt-2.5 bg-white border border-line-2 rounded-[20px] p-4 flex flex-wrap items-end gap-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
            <div className="flex-1 min-w-[160px]">
              <label className="block text-[11px] font-semibold text-ink-3 mb-1.5">
                Bathrooms
              </label>
              <select
                value={bathsFilter}
                onChange={(e) => setBathsFilter(e.target.value)}
                className="w-full h-10 px-4 rounded-full bg-surface-2 border border-line text-sm text-ink focus:outline-none focus:border-primary appearance-none"
              >
                <option value="any">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
              </select>
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="block text-[11px] font-semibold text-ink-3 mb-1.5">
                Sort by
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full h-10 px-4 rounded-full bg-surface-2 border border-line text-sm text-ink focus:outline-none focus:border-primary appearance-none"
              >
                {SORT_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={clearAll}
              className="h-10 px-5 rounded-full bg-surface-2 border border-line text-ink-2 text-xs font-semibold hover:bg-primary hover:text-white hover:border-primary transition-all"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* ── RESULTS + MAP SPLIT ──────────────────────────────── */}
      <section
        ref={resultsRef}
        className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-8 pb-16 scroll-mt-24"
      >
        <div className="grid lg:grid-cols-[1fr_0.92fr] gap-8 items-start">
          {/* LEFT — results list */}
          <div>
            <div className="flex items-end justify-between gap-5">
              <div>
                <h2 className="font-display font-semibold text-[1.75rem] sm:text-[1.875rem] tracking-[-0.02em] text-ink">
                  <span className="text-primary">
                    {resultCount.toLocaleString()}{" "}
                    {resultCount === 1 ? "home" : "homes"}
                  </span>{" "}
                  for sale in {headerArea}
                </h2>
                <p className="text-sm text-ink-3 mt-1.5">
                  Every listing verified · talk straight to the agent
                </p>
              </div>
              <div className="relative shrink-0 hidden sm:block">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none cursor-pointer rounded-full border border-line bg-white pl-4 pr-9 py-2.5 text-sm font-bold text-ink focus:outline-none"
                >
                  {SORT_OPTS.map((o) => (
                    <option key={o.value} value={o.value}>
                      Sort: {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-3" />
              </div>
            </div>

            {/* active filters */}
            {activeFilters.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mt-5 mb-6">
                {activeFilters.map((f) => (
                  <span
                    key={f.key}
                    className="inline-flex items-center gap-2 bg-ink text-white pl-3.5 pr-2 py-1.5 rounded-full text-[13px] font-semibold"
                  >
                    {f.label}
                    <button
                      onClick={f.clear}
                      aria-label={`Remove ${f.label}`}
                      className="w-5 h-5 rounded-full bg-white/20 grid place-items-center hover:bg-white/30 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={clearAll}
                  className="text-[13px] font-bold text-primary ml-1 hover:text-primary-ink transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* list */}
            {listingsLoading && allListings.length === 0 ? (
              <div className="flex flex-col gap-5 mt-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="grid sm:grid-cols-[300px_1fr] bg-white border border-line-2 rounded-[24px] overflow-hidden animate-pulse"
                  >
                    <div className="h-[200px] sm:h-[230px] bg-surface-2" />
                    <div className="p-6 space-y-3">
                      <div className="h-6 w-1/3 bg-surface-2 rounded-full" />
                      <div className="h-4 w-2/3 bg-surface-2 rounded-full" />
                      <div className="h-3 w-1/2 bg-surface-2 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : allListings.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  icon={<Search className="w-10 h-10" />}
                  title="No homes found"
                  description={
                    debouncedSearch
                      ? `No homes for sale match "${debouncedSearch}". Try adjusting your filters.`
                      : "No homes match your current filters. Try widening your price range or area."
                  }
                  actions={[
                    { label: "Clear all filters", onClick: clearAll, variant: "primary" },
                  ]}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-5 mt-6">
                {allListings.map((l, i) => {
                  const tag = listingTag(l);
                  const agentName = l.agent?.name || l.agent?.agency || "Agent";
                  const isHot = tag.tone === "new";
                  return (
                    <div
                      key={l.id}
                      onClick={() => goToListing(l.id)}
                      onMouseEnter={() => setActivePin(i)}
                      onMouseLeave={() => setActivePin(null)}
                      className={`group grid sm:grid-cols-[300px_1fr] bg-white border rounded-[24px] overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(0,0,0,0.10)] hover:border-transparent ${
                        isHot
                          ? "border-transparent ring-2 ring-primary"
                          : "border-line-2"
                      }`}
                    >
                      {/* photo */}
                      <div className="relative h-[200px] sm:h-[230px] bg-surface-2 overflow-hidden">
                        <img
                          src={l.coverImage}
                          alt={l.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span
                          className={`absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full text-white ${
                            tag.tone === "new" ? "bg-accent" : "bg-primary"
                          }`}
                        >
                          {tag.label}
                        </span>
                        <div
                          className="absolute top-3 right-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <BookmarkButton id={l.id} type="property" size="md" />
                        </div>
                        {l.images?.length > 0 && (
                          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 bg-black/55 backdrop-blur-sm text-white text-[11.5px] font-semibold px-2.5 py-1 rounded-full">
                            <Images className="w-3.5 h-3.5" />
                            {l.images.length} photos
                          </span>
                        )}
                      </div>

                      {/* body */}
                      <div className="p-5 sm:p-6 flex flex-col">
                        <div className="font-display font-bold text-[27px] tracking-[-0.02em] text-ink">
                          {l.priceLabel}
                        </div>
                        <h3 className="text-[17px] font-extrabold tracking-[-0.01em] text-ink mt-1">
                          {l.title}
                        </h3>
                        <p className="flex items-center gap-1.5 text-[13.5px] text-ink-3 mt-1">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{l.address}</span>
                        </p>

                        <div className="flex flex-wrap gap-x-[18px] gap-y-2 mt-3.5 text-[13.5px] font-semibold text-ink-2">
                          {l.beds > 0 && (
                            <span className="inline-flex items-center gap-1.5">
                              <Bed className="w-4 h-4 text-ink-3" />
                              {l.beds} beds
                            </span>
                          )}
                          {l.baths > 0 && (
                            <span className="inline-flex items-center gap-1.5">
                              <Bath className="w-4 h-4 text-ink-3" />
                              {l.baths} baths
                            </span>
                          )}
                          {l.sqft && (
                            <span className="inline-flex items-center gap-1.5">
                              <Maximize className="w-4 h-4 text-ink-3" />
                              {l.sqft} m²
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2.5 mt-auto pt-4 border-t border-line-2">
                          <div className="w-[34px] h-[34px] rounded-full bg-surface-3 overflow-hidden shrink-0 grid place-items-center text-[11px] font-bold text-primary-ink">
                            {l.agent?.avatarUrl ? (
                              <img
                                src={l.agent.avatarUrl}
                                alt={agentName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              initials(agentName)
                            )}
                          </div>
                          <div className="leading-tight min-w-0">
                            <div className="text-[12.5px] font-bold text-ink truncate">
                              {agentName}
                            </div>
                            {l.agent?.verified && (
                              <small className="block text-primary font-semibold text-[11px]">
                                ✓ Verified agent
                              </small>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isLoggedIn) {
                                navigate("/onboarding");
                                return;
                              }
                              goToListing(l.id);
                            }}
                            className="ml-auto inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2.5 rounded-full text-[13px] font-bold hover:bg-primary-light transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            Message
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* infinite-scroll sentinel + bouncy loader */}
            {allListings.length > 0 && (
              <div ref={loadMoreRef} className="py-10">
                {listingsLoading && page > 1 ? (
                  <BouncyLoader label="Loading more homes…" />
                ) : !hasMore ? (
                  <p className="text-center text-sm text-ink-3">
                    You've reached the end · {resultCount.toLocaleString()} homes
                  </p>
                ) : null}
              </div>
            )}
          </div>

          {/* RIGHT — sticky map */}
          <div className="hidden lg:block lg:sticky lg:top-24 h-[calc(100vh-7rem)]">
            {allListings.length > 0 ? (
              <PropertyMap
                listings={mapListings}
                activeIndex={activePin}
                onMarkerClick={(i) => goToListing(allListings[i].id)}
                className="h-full"
              />
            ) : (
              <div className="h-full rounded-[20px] border border-line-2 bg-surface-2 grid place-items-center text-ink-3 text-sm">
                Map appears when homes match your search
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Buy;
