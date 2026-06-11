import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  ShieldCheck,
  ChevronDown,
  SlidersHorizontal,
  MessageCircle,
  ClipboardCheck,
  ArrowRight,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import BookmarkButton from "../components/ui/BookmarkButton";
import EmptyState from "../components/ui/EmptyState";
import { BouncyLoader } from "../components/agent/ui";

/* ── helpers ─────────────────────────────────────────────────────────── */

const fmtNaira = (n: number) =>
  n >= 1_000_000_000
    ? `₦${(n / 1_000_000_000).toFixed(1)}B`
    : n >= 1_000_000
      ? `₦${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
      : `₦${Math.round(n / 1_000)}K`;

const PRICE_OPTS = [
  { value: "any", label: "Any budget" },
  { value: "0-3000000", label: "Up to ₦3M/yr" },
  { value: "3000000-8000000", label: "₦3M – ₦8M/yr" },
  { value: "8000000-15000000", label: "₦8M – ₦15M/yr" },
  { value: "15000000-0", label: "₦15M+/yr" },
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

const rentPropertyTypeMap: Record<string, string> = {
  "Flats & Apartments": "Flat / Apartment",
  Houses: "House",
  "All Property": "",
};

// Editorial fallbacks so hero / strips are never blank while data loads.
const FALLBACK_HERO_BIG =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=640&fit=crop";
const FALLBACK_HERO_SMALL =
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=700&h=460&fit=crop";

const FALLBACK_AREAS = [
  { name: "Lekki", count: 320, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=320&h=220&fit=crop" },
  { name: "Ikoyi", count: 148, image: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=320&h=220&fit=crop" },
  { name: "Yaba", count: 96, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=320&h=220&fit=crop" },
  { name: "Ikeja GRA", count: 112, image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=320&h=220&fit=crop" },
  { name: "Surulere", count: 74, image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=320&h=220&fit=crop" },
  { name: "Victoria Island", count: 203, image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=320&h=220&fit=crop" },
];

// Derive the "Available now" / "Furnished" / "New" pill for a listing.
const listingTag = (l: Listing): { label: string; now: boolean } => {
  const furnished = l.features?.some((f) => /furnish/i.test(f));
  if (furnished) return { label: "Furnished", now: false };
  const ageDays = (Date.now() - new Date(l.createdAt).getTime()) / 86_400_000;
  if (ageDays <= 7) return { label: "New", now: false };
  return { label: "Available now", now: true };
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

/* ── styled pill <select> for the toolbar ────────────────────────────── */

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
          ? "bg-primary/10 border-transparent text-primary-ink"
          : "bg-[#f5f0eb] border-line-2 text-ink-2 hover:border-primary"
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

const Rent = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [priceRange, setPriceRange] = useState("any");
  const [bedsFilter, setBedsFilter] = useState("any");
  const [typeFilter, setTypeFilter] = useState("All Property");
  const [furnished, setFurnished] = useState(false);
  const [sort, setSort] = useState("newest");
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [bathsFilter, setBathsFilter] = useState("any");
  const [stats, setStats] = useState<any>(null);
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
  } = useListings({ type: "RENT", limit: PAGE_SIZE });

  // Debounce the editorial search box.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Category stats (drives type chip + headline counts).
  useEffect(() => {
    listingsService
      .getStats("RENT")
      .then(setStats)
      .catch((err) => console.error("Failed to fetch rent stats:", err));
  }, []);

  // Push filters to the API.
  useEffect(() => {
    const [priceMin, priceMax] =
      priceRange !== "any"
        ? priceRange.split("-").map(Number)
        : [undefined, undefined];
    updateParams({
      type: "RENT",
      limit: PAGE_SIZE,
      propertyType: rentPropertyTypeMap[typeFilter] || undefined,
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

  // Furnished is not a server filter — apply it client-side over loaded pages.
  const listings = useMemo(
    () =>
      furnished
        ? allListings.filter((l) => l.features?.some((f) => /furnish/i.test(f)))
        : allListings,
    [allListings, furnished],
  );

  const hasMore = !furnished && !!page && !!pages && page < pages;

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
  }, [hasMore, listingsLoading, nextPage, listings.length]);

  // Type options for the toolbar chip, built from live stats when available.
  const typeOptions = useMemo(() => {
    const opts = [{ value: "All Property", label: "Any type" }];
    if (stats?.byType) {
      for (const type of Object.keys(stats.byType)) {
        const label =
          Object.keys(rentPropertyTypeMap).find(
            (k) => rentPropertyTypeMap[k] === type,
          ) || type;
        opts.push({ value: label, label });
      }
    } else {
      opts.push(
        { value: "Flats & Apartments", label: "Flats & Apartments" },
        { value: "Houses", label: "Houses" },
      );
    }
    return opts;
  }, [stats]);

  // Neighbourhood roll-up for the ticker + popular-areas strip.
  const areas = useMemo(() => {
    const map = new Map<string, { count: number; image: string }>();
    for (const l of allListings) {
      const key = (l.location || l.address?.split(",").pop()?.trim() || "")
        .trim();
      if (!key) continue;
      const e = map.get(key);
      if (e) e.count += 1;
      else map.set(key, { count: 1, image: l.coverImage });
    }
    const derived = [...map.entries()]
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.count - a.count);
    return derived.length >= 4 ? derived.slice(0, 8) : FALLBACK_AREAS;
  }, [allListings]);

  // Hero collage + "from" price.
  const heroBig = allListings[0]?.coverImage || FALLBACK_HERO_BIG;
  const heroSmall = allListings[1]?.coverImage || FALLBACK_HERO_SMALL;
  const minPrice = useMemo(() => {
    const ps = allListings.map((l) => l.priceNaira).filter(Boolean);
    return ps.length ? Math.min(...ps) : 1_800_000;
  }, [allListings]);

  const headerArea =
    debouncedSearch.trim() ||
    (areas[0]?.name && areas !== FALLBACK_AREAS ? areas[0].name : "Lagos");
  const resultCount = total || listings.length;

  const scrollToResults = () =>
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const goToListing = (id: string) => navigate(`/property/${id}`);

  return (
    <div className="min-h-screen bg-[#f5f0eb] font-heading">
      <Seo
        title="Properties for Rent in Nigeria"
        description="Find apartments, duplexes and houses for rent across Nigeria. Every rental is inspected and listed by a KYC-verified agent — talk straight to the person who manages it."
        path="/rent"
        keywords="rent property Nigeria, apartments for rent Lagos, houses for rent Nigeria, rent in Lekki, PropertyLoop rentals"
      />
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-8 pb-14 overflow-hidden">
        {/* Area ticker */}
        <div className="pl-ticker-mask flex items-center border-y border-line-2 overflow-hidden">
          <div className="pl-ticker-track">
            {[...areas, ...areas].map((a, i) => (
              <span
                key={`${a.name}-${i}`}
                className="font-display italic text-sm text-ink-3 px-5 py-3 inline-flex items-center gap-5"
              >
                <span>
                  <b className="not-italic font-bold text-ink">
                    {a.name}
                  </b>{" "}
                  {a.count} rentals
                </span>
                <span className="w-1 h-1 rounded-full bg-primary" />
              </span>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 mt-12 lg:mt-16 items-center">
          {/* Left — copy + editorial search */}
          <div>
            <div className="font-display text-[15px] text-primary font-semibold tracking-wide">
              № 01 — Renting, done right
            </div>
            <h1 className="font-display font-medium text-[2.6rem] sm:text-[3.4rem] lg:text-[4.125rem] leading-[0.98] tracking-[-0.03em] text-ink mt-3.5">
              Your next <span className="italic text-primary">home</span> is
              <br />
              one honest{" "}
              <span className="relative whitespace-nowrap">
                conversation
                <span className="absolute left-0 right-0 -bottom-0.5 h-2.5 bg-primary/20 rounded-[2px] -z-10" />
              </span>{" "}
              away.
            </h1>
            <p className="text-[16.5px] text-ink-2/90 leading-relaxed max-w-[480px] mt-6">
              Every rental is inspected and listed by a KYC-verified agent — no
              fake listings, no runaround. Find a place, then talk straight to
              the person who manages it.
            </p>

            {/* Inline editorial search */}
            <div className="mt-8 bg-white border-[1.5px] border-ink/85 rounded-[18px] p-1.5 pl-1 flex items-center gap-0.5 max-w-[560px] shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
              <label className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-[14px] hover:bg-[#f5f0eb] transition-colors cursor-text">
                <MapPin className="w-[17px] h-[17px] text-primary shrink-0" />
                <span className="min-w-0">
                  <span className="block text-[10.5px] font-extrabold tracking-[0.08em] uppercase text-ink-3">
                    Where
                  </span>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && scrollToResults()}
                    placeholder="Lekki, Lagos"
                    className="w-full bg-transparent text-sm font-bold text-ink placeholder:text-ink-3/70 focus:outline-none mt-px"
                  />
                </span>
              </label>
              <span className="w-px h-[30px] bg-line-2" />
              <label className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-[14px] hover:bg-[#f5f0eb] transition-colors cursor-pointer">
                <SlidersHorizontal className="w-[17px] h-[17px] text-primary shrink-0" />
                <span className="min-w-0">
                  <span className="block text-[10.5px] font-extrabold tracking-[0.08em] uppercase text-ink-3">
                    Budget
                  </span>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-ink focus:outline-none mt-px cursor-pointer appearance-none"
                  >
                    {PRICE_OPTS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </span>
              </label>
              <button
                onClick={scrollToResults}
                aria-label="Search rentals"
                className="w-[50px] h-[50px] rounded-[13px] bg-primary text-white grid place-items-center shrink-0 hover:bg-primary-light transition-colors"
              >
                <Search className="w-[19px] h-[19px]" />
              </button>
            </div>
          </div>

          {/* Right — photo collage */}
          <div className="relative h-[340px] lg:h-[440px]">
            <div className="absolute top-0 right-0 w-[74%] h-[260px] lg:h-[320px] rounded-[18px_18px_18px_70px] overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.16)] bg-[#16321f]">
              <img
                src={heroBig}
                alt="Featured rental"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 w-[52%] h-[180px] lg:h-[230px] rounded-[18px] overflow-hidden border-[5px] border-[#f5f0eb] shadow-[0_24px_50px_rgba(0,0,0,0.16)] bg-[#16321f]">
              <img
                src={heroSmall}
                alt="Interior"
                className="w-full h-full object-cover"
              />
            </div>
            {/* chip — verified */}
            <div className="absolute top-6 left-0 z-[4] bg-white rounded-[14px] px-3.5 py-2.5 shadow-[0_12px_30px_rgba(0,0,0,0.16)] flex items-center gap-2.5">
              <span className="w-[34px] h-[34px] rounded-[10px] bg-primary/10 text-primary grid place-items-center">
                <ShieldCheck className="w-[17px] h-[17px]" />
              </span>
              <span>
                <b className="block text-sm font-extrabold text-ink">
                  Verified
                </b>
                <small className="text-[11px] text-ink-3">
                  Walked in person
                </small>
              </span>
            </div>
            {/* chip — from price */}
            <div className="absolute bottom-8 right-1.5 z-[4] bg-primary text-white rounded-[14px] px-3.5 py-2.5 shadow-[0_12px_30px_rgba(0,0,0,0.16)]">
              <small className="block text-[11px] opacity-80">From</small>
              <b className="font-display text-lg font-bold tracking-tight">
                {fmtNaira(minPrice)} / year
              </b>
            </div>
          </div>
        </div>
      </section>

      {/* ── TOOLBAR ──────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-[4] mt-3">
        <div className="bg-white border border-line-2 rounded-[20px] p-4 flex items-center gap-3 flex-wrap shadow-[0_14px_40px_rgba(0,0,0,0.10)]">
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
            onClick={() => setFurnished((f) => !f)}
            className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
              furnished
                ? "bg-primary/10 border-transparent text-primary-ink"
                : "bg-[#f5f0eb] border-line-2 text-ink-2 hover:border-primary"
            }`}
          >
            Furnished
          </button>
          <button
            onClick={() => setShowAllFilters((s) => !s)}
            className={`shrink-0 inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
              showAllFilters
                ? "bg-primary/10 border-transparent text-primary-ink"
                : "bg-[#f5f0eb] border-line-2 text-ink-2 hover:border-primary"
            }`}
          >
            <SlidersHorizontal className="w-[15px] h-[15px]" />
            All filters
          </button>

          <div className="ml-auto flex items-center gap-2.5">
            <span className="hidden sm:inline text-xs text-ink-3">
              Sort
            </span>
            <ChipSelect value={sort} onChange={setSort} options={SORT_OPTS} />
          </div>
        </div>

        {/* All-filters drawer */}
        {showAllFilters && (
          <div className="mt-2.5 bg-white border border-line-2 rounded-[20px] p-4 flex flex-wrap items-end gap-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
            <div className="flex-1 min-w-[160px]">
              <label className="block text-[11px] font-semibold text-ink-3 mb-1.5">
                Bathrooms
              </label>
              <select
                value={bathsFilter}
                onChange={(e) => setBathsFilter(e.target.value)}
                className="w-full h-10 px-4 rounded-full bg-[#f5f0eb] border border-line-2 text-sm text-ink focus:outline-none focus:border-primary appearance-none"
              >
                <option value="any">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
              </select>
            </div>
            <button
              onClick={() => {
                setPriceRange("any");
                setBedsFilter("any");
                setBathsFilter("any");
                setTypeFilter("All Property");
                setFurnished(false);
                setSearchQuery("");
              }}
              className="h-10 px-5 rounded-full bg-[#f5f0eb] border border-line-2 text-ink-2 text-xs font-semibold hover:bg-primary hover:text-white hover:border-primary transition-all"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* ── POPULAR AREAS ────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-16">
        <div className="mb-5">
          <h2 className="font-display font-semibold text-[1.875rem] tracking-[-0.02em] text-ink">
            Popular <span className="text-primary">areas</span> to rent
          </h2>
          <p className="text-sm text-ink-3 mt-2">
            Browse by neighbourhood
          </p>
        </div>
        <div className="flex gap-4 overflow-x-auto pt-1 pb-8 -mx-6 px-6 md:mx-0 md:px-0">
          {areas.map((a) => (
            <button
              key={a.name}
              onClick={() => {
                setSearchQuery(a.name);
                scrollToResults();
              }}
              className="group shrink-0 w-[150px] h-[104px] rounded-[18px] overflow-hidden relative bg-[#ece6df]"
            >
              <img
                src={a.image}
                alt={a.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 flex flex-col justify-end p-3 text-left">
                <span className="text-white text-sm font-extrabold">
                  {a.name}
                </span>
                <span className="text-white/80 text-[11.5px] font-semibold">
                  {a.count} rentals
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── RESULTS ──────────────────────────────────────────── */}
      <section
        ref={resultsRef}
        className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-12 pb-20 scroll-mt-6"
      >
        <div className="mb-8">
          <h2 className="font-display font-semibold text-[1.875rem] tracking-[-0.02em] text-ink">
            <span className="text-primary">
              {resultCount.toLocaleString()}{" "}
              {resultCount === 1 ? "rental" : "rentals"}
            </span>{" "}
            in {headerArea}
          </h2>
          <p className="text-sm text-ink-3 mt-1.5">
            Every listing verified · talk straight to the agent
          </p>
        </div>

        {listingsLoading && allListings.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-line-2 rounded-[22px] overflow-hidden animate-pulse"
              >
                <div className="h-[210px] bg-[#ece6df]" />
                <div className="p-5 space-y-3">
                  <div className="h-6 w-1/3 bg-[#ece6df] rounded-full" />
                  <div className="h-4 w-2/3 bg-[#ece6df] rounded-full" />
                  <div className="h-3 w-1/2 bg-[#ece6df] rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <EmptyState
            icon={<Search className="w-10 h-10" />}
            title="No rentals found"
            description={
              debouncedSearch
                ? `No rentals match "${debouncedSearch}". Try adjusting your filters.`
                : "No rentals match your current filters. Try widening your budget or area."
            }
            actions={[
              {
                label: "Clear all filters",
                onClick: () => {
                  setSearchQuery("");
                  setPriceRange("any");
                  setBedsFilter("any");
                  setBathsFilter("any");
                  setTypeFilter("All Property");
                  setFurnished(false);
                },
                variant: "primary",
              },
            ]}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {listings.map((l) => {
              const tag = listingTag(l);
              const agentName = l.agent?.name || l.agent?.agency || "Agent";
              return (
                <div
                  key={l.id}
                  onClick={() => goToListing(l.id)}
                  className="group bg-white border border-line-2 rounded-[22px] overflow-hidden cursor-pointer flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(0,0,0,0.10)] hover:border-transparent"
                >
                  {/* photo */}
                  <div className="relative h-[210px] bg-[#ece6df] overflow-hidden">
                    <img
                      src={l.coverImage}
                      alt={l.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span
                      className={`absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 text-[11.5px] font-extrabold px-3 py-1.5 rounded-full ${
                        tag.now
                          ? "bg-primary text-white"
                          : "bg-white text-primary-ink"
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
                  </div>

                  {/* body */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <div className="font-display font-bold text-2xl tracking-[-0.02em] text-ink">
                      {l.priceLabel}{" "}
                      <em className="not-italic text-[13px] text-ink-3 font-semibold">
                        / {l.period?.replace(/^\//, "") || "year"}
                      </em>
                    </div>
                    <h3 className="text-base font-extrabold tracking-[-0.01em] text-ink mt-1 truncate">
                      {l.title}
                    </h3>
                    <p className="flex items-center gap-1.5 text-[13px] text-ink-3 mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{l.address}</span>
                    </p>

                    <div className="flex gap-4 mt-4 text-[13px] font-semibold text-ink-2">
                      {l.beds > 0 && (
                        <span className="inline-flex items-center gap-1.5">
                          <Bed className="w-[15px] h-[15px] text-ink-3" />
                          {l.beds}
                        </span>
                      )}
                      {l.baths > 0 && (
                        <span className="inline-flex items-center gap-1.5">
                          <Bath className="w-[15px] h-[15px] text-ink-3" />
                          {l.baths}
                        </span>
                      )}
                      {l.sqft && (
                        <span className="inline-flex items-center gap-1.5">
                          <Maximize className="w-[15px] h-[15px] text-ink-3" />
                          {l.sqft}m²
                        </span>
                      )}
                    </div>

                    {/* footer — agent */}
                    <div className="flex items-center gap-2.5 mt-auto pt-4 border-t border-line-2">
                      <div className="w-[30px] h-[30px] rounded-full bg-[#ddd5c9] overflow-hidden shrink-0 grid place-items-center text-[10px] font-bold text-primary-ink">
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
                        <div className="text-xs font-bold text-ink truncate">
                          {agentName}
                        </div>
                        {l.agent?.verified && (
                          <small className="block text-primary font-bold text-[10.5px]">
                            ✓ Verified
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
                        aria-label={`Message ${agentName}`}
                        className="ml-auto w-[38px] h-[38px] rounded-full grid place-items-center bg-[#f5f0eb] border border-line-2 text-ink hover:bg-primary hover:text-white hover:border-primary transition-colors"
                      >
                        <MessageCircle className="w-[15px] h-[15px]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* infinite-scroll sentinel + bouncy loader */}
        {listings.length > 0 && (
          <div ref={loadMoreRef} className="py-11">
            {listingsLoading && page > 1 ? (
              <BouncyLoader label="Loading more rentals…" />
            ) : !hasMore && !furnished ? (
              <p className="text-center text-sm text-ink-3">
                You've reached the end · {resultCount.toLocaleString()} rentals
              </p>
            ) : null}
          </div>
        )}
      </section>

      {/* ── RENTER HELP BAND ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pb-20">
        <div className="bg-primary/10 rounded-[28px] p-9 md:p-11 flex flex-col md:flex-row items-center text-center md:text-left gap-7">
          <div className="w-[60px] h-[60px] rounded-[17px] bg-white text-primary grid place-items-center shrink-0">
            <ClipboardCheck className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-[1.625rem] tracking-[-0.02em] text-primary-ink">
              New to renting on PropertyLoop?
            </h3>
            <p className="text-[15px] text-primary-ink/80 leading-relaxed mt-2 max-w-[540px]">
              See how viewings, rental applications, and deposits work — and why
              you'll always deal with a verified agent, never a stranger.
            </p>
          </div>
          <Link
            to="/how-it-works"
            className="md:ml-auto inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-full font-bold text-[15px] whitespace-nowrap hover:bg-primary-light transition-colors"
          >
            How renting works
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Rent;
