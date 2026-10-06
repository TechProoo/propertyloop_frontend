import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Star,
  Heart,
  ArrowRight,
  Package,
  Home,
  ChevronRight,
  Grid3x3,
  BadgeCheck,
  Store,
  X,
  Loader2,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import Seo from "../components/Seo";
import type { ProductWithStore, StoreTeaser } from "../data/storefronts";
import marketplaceService from "../api/services/marketplace";
import { useStoreCart } from "../context/StoreCartContext";

const naira = (n: number) => "₦" + n.toLocaleString("en-NG");

type SortKey = "popular" | "price_asc" | "price_desc" | "top_rated" | "newest";

const SORT_LABELS: Record<SortKey, string> = {
  popular: "Most popular",
  price_asc: "Price: low to high",
  price_desc: "Price: high to low",
  top_rated: "Top rated",
  newest: "Newest",
};

const PRICE_BUCKETS: { label: string; min: number; max: number }[] = [
  { label: "Under ₦50,000", min: 0, max: 50000 },
  { label: "₦50,000 – ₦200,000", min: 50000, max: 200000 },
  { label: "₦200,000 – ₦500,000", min: 200000, max: 500000 },
  { label: "₦500,000 and above", min: 500000, max: Number.POSITIVE_INFINITY },
];

const MarketplaceProducts = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [storeSlug, setStoreSlug] = useState<string>("All");
  const [priceIdx, setPriceIdx] = useState<number | null>(null);
  const [sort, setSort] = useState<SortKey>("popular");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { addItem, count } = useStoreCart();

  const [allProducts, setAllProducts] = useState<ProductWithStore[]>([]);
  const [storeList, setStoreList] = useState<StoreTeaser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      marketplaceService.listProducts({ limit: 200 }).catch(() => ({
        items: [] as ProductWithStore[],
        total: 0,
        page: 1,
        limit: 200,
        pages: 0,
      })),
      marketplaceService.listStores().catch(() => [] as StoreTeaser[]),
    ])
      .then(([prodRes, stores]) => {
        if (cancelled) return;
        setAllProducts(prodRes.items);
        setStoreList(stores);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of allProducts) set.add(p.category);
    return ["All", ...[...set].sort()];
  }, [allProducts]);

  const storeNameBySlug = useMemo(() => {
    const m = new Map<string, string>();
    for (const s of storeList) m.set(s.slug, s.name);
    return m;
  }, [storeList]);

  const stores = useMemo(
    () => ["All", ...storeList.map((s) => s.slug)],
    [storeList],
  );

  const products = useMemo(() => {
    let list: ProductWithStore[] = allProducts.slice();
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.storeName.toLowerCase().includes(q),
      );
    }
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (storeSlug !== "All") list = list.filter((p) => p.storeSlug === storeSlug);
    if (priceIdx !== null) {
      const b = PRICE_BUCKETS[priceIdx];
      list = list.filter((p) => p.priceNaira >= b.min && p.priceNaira < b.max);
    }
    switch (sort) {
      case "price_asc":
        list.sort((a, b) => a.priceNaira - b.priceNaira);
        break;
      case "price_desc":
        list.sort((a, b) => b.priceNaira - a.priceNaira);
        break;
      case "top_rated":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list = list.slice().reverse();
        break;
      default:
        list.sort((a, b) => b.reviews - a.reviews);
    }
    return list;
  }, [allProducts, query, category, storeSlug, priceIdx, sort]);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearFilters = () => {
    setQuery("");
    setCategory("All");
    setStoreSlug("All");
    setPriceIdx(null);
    setSort("popular");
  };

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Seo
        title="All products · PropertyLoop Marketplace"
        description="Browse every product listed by verified vendors on PropertyLoop. Furniture, materials, lighting, smart home — all in one place."
        path="/marketplace/products"
      />
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 lg:px-10 py-10">
        {/* ─── Breadcrumbs ───────────────────────────────────────────── */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-text-secondary text-xs mb-6"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Home className="h-3 w-3" />
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-text-subtle" />
          <Link to="/marketplace" className="hover:text-primary transition-colors">
            Marketplace
          </Link>
          <ChevronRight className="h-3 w-3 text-text-subtle" />
          <span className="text-primary-dark font-semibold">All products</span>
        </nav>

        {/* ─── Header ────────────────────────────────────────────────── */}
        <header className="flex flex-col lg:flex-row lg:items-end gap-4 lg:justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary-dark tracking-tight">
              All products
            </h1>
            <p className="mt-2 text-text-secondary text-sm sm:text-base max-w-xl">
              Browse every item from every verified storefront in one place.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/marketplace/cart"
              className="h-10 px-4 rounded-full border border-border bg-white text-primary-dark text-xs font-semibold inline-flex items-center gap-1.5 hover:border-primary hover:text-primary transition-colors"
            >
              Cart
              <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-primary-dark text-white text-[10px] font-bold inline-flex items-center justify-center">
                {count}
              </span>
            </Link>
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="lg:hidden h-10 px-4 rounded-full border border-border bg-white text-primary-dark text-xs font-semibold inline-flex items-center gap-1.5 hover:border-primary hover:text-primary transition-colors"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
            </button>
          </div>
        </header>

        {/* ─── Search bar ────────────────────────────────────────────── */}
        <div className="rounded-full bg-white/80 backdrop-blur-sm border border-border-light p-1.5 flex items-center gap-2 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-subtle" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products, stores or categories"
              className="w-full h-10 pl-11 pr-4 bg-transparent text-sm text-primary-dark placeholder:text-text-subtle focus:outline-none"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-10 px-4 pr-8 rounded-full bg-primary-dark text-white text-xs font-semibold focus:outline-none"
          >
            {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
              <option key={k} value={k}>
                {SORT_LABELS[k]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ─── Sidebar filters ───────────────────────────────────── */}
          <aside
            className={`${
              filtersOpen ? "block" : "hidden"
            } lg:block lg:w-64 shrink-0`}
          >
            <div className="rounded-3xl bg-white/80 backdrop-blur-sm border border-border-light p-5 lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-bold text-primary-dark text-sm">
                  Filters
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-primary text-xs font-semibold hover:underline"
                >
                  Clear all
                </button>
              </div>

              <section className="mb-5">
                <p className="text-text-subtle text-[11px] uppercase tracking-wide font-semibold mb-2">
                  Category
                </p>
                <div className="flex flex-col gap-1">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        category === c
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-text-body hover:bg-black/5"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </section>

              <section className="mb-5">
                <p className="text-text-subtle text-[11px] uppercase tracking-wide font-semibold mb-2">
                  Store
                </p>
                <div className="flex flex-col gap-1">
                  {stores.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStoreSlug(s)}
                      className={`text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        storeSlug === s
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-text-body hover:bg-black/5"
                      }`}
                    >
                      {s === "All" ? "All stores" : storeNameBySlug.get(s) ?? s}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <p className="text-text-subtle text-[11px] uppercase tracking-wide font-semibold mb-2">
                  Price
                </p>
                <div className="flex flex-col gap-1">
                  {PRICE_BUCKETS.map((b, i) => (
                    <button
                      key={b.label}
                      onClick={() => setPriceIdx(priceIdx === i ? null : i)}
                      className={`text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        priceIdx === i
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-text-body hover:bg-black/5"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </aside>

          {/* ─── Grid ──────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-text-secondary text-sm">
                Showing{" "}
                <span className="font-bold text-primary-dark">
                  {products.length}
                </span>{" "}
                {products.length === 1 ? "product" : "products"}
              </p>
              <div className="hidden sm:flex items-center gap-1.5 text-text-subtle text-xs">
                <Grid3x3 className="h-3.5 w-3.5" />
                Grid view
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-32">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white/60 rounded-3xl border border-border-light">
                <div className="w-14 h-14 mx-auto rounded-full bg-white border border-border-light flex items-center justify-center mb-3">
                  <Package className="w-6 h-6 text-text-subtle" />
                </div>
                <h3 className="font-heading font-bold text-primary-dark text-lg">
                  No products match
                </h3>
                <p className="text-text-secondary text-sm mt-1">
                  Try clearing a filter or adjusting your search.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-primary-dark text-white text-xs font-bold hover:bg-black transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {products.map((p) => {
                  const saved = wishlist.has(p.id);
                  return (
                    <article
                      key={`${p.storeSlug}-${p.id}`}
                      className="group relative overflow-hidden rounded-3xl bg-white border border-border-light shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
                    >
                      <Link
                        to={`/store/${p.storeSlug}/product/${p.id}`}
                        className="relative aspect-square overflow-hidden"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          {p.tag === "sale" && (
                            <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold uppercase tracking-wide">
                              Sale
                            </span>
                          )}
                          {p.tag === "new" && (
                            <span className="px-2 py-0.5 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-wide">
                              New
                            </span>
                          )}
                          {p.tag === "bestseller" && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-bold uppercase tracking-wide">
                              Bestseller
                            </span>
                          )}
                        </div>
                        {!p.inStock && (
                          <div className="absolute inset-x-3 bottom-3 rounded-full bg-black/70 backdrop-blur-sm text-white text-[11px] font-semibold py-1 text-center">
                            Out of stock
                          </div>
                        )}
                      </Link>
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        aria-label={
                          saved ? "Remove from wishlist" : "Save to wishlist"
                        }
                        className={`absolute top-3 right-3 h-9 w-9 rounded-full inline-flex items-center justify-center border transition-all ${
                          saved
                            ? "bg-red-500 text-white border-red-500"
                            : "bg-white/90 text-primary-dark border-white hover:bg-white"
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
                      </button>

                      <div className="p-4 flex-1 flex flex-col">
                        <Link
                          to={`/store/${p.storeSlug}`}
                          className="flex items-center gap-1 text-text-subtle text-[11px] uppercase tracking-wide font-semibold hover:text-primary transition-colors"
                        >
                          <Store className="h-3 w-3" />
                          {p.storeName}
                        </Link>
                        <Link
                          to={`/store/${p.storeSlug}/product/${p.id}`}
                          className="mt-1 font-heading font-bold text-primary-dark text-sm leading-snug line-clamp-2 hover:text-primary transition-colors"
                        >
                          {p.name}
                        </Link>

                        <div className="mt-2 flex items-center gap-1.5 text-xs text-text-secondary">
                          <Star className="h-3 w-3 text-[#F5A623] fill-[#F5A623]" />
                          <span className="font-semibold text-primary-dark">
                            {p.rating.toFixed(1)}
                          </span>
                          <span>({p.reviews})</span>
                        </div>

                        <div className="mt-auto pt-3 flex items-end justify-between gap-2">
                          <div>
                            <p className="font-heading font-bold text-primary-dark text-base leading-none">
                              {naira(p.priceNaira)}
                            </p>
                            {p.compareAtNaira && (
                              <p className="text-text-subtle text-xs line-through mt-1">
                                {naira(p.compareAtNaira)}
                              </p>
                            )}
                          </div>
                          <button
                            disabled={!p.inStock}
                            onClick={() =>
                              addItem({
                                productId: p.id,
                                storeSlug: p.storeSlug,
                                storeName: p.storeName,
                                name: p.name,
                                priceNaira: p.priceNaira,
                                image: p.image,
                              })
                            }
                            className="h-9 px-3 rounded-full bg-primary-dark text-white text-xs font-bold inline-flex items-center gap-1.5 hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Add
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* ─── Vendor spotlight below grid ──────────────────────── */}
            <section className="mt-14 rounded-3xl bg-white/80 border border-border-light p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-5">
                <BadgeCheck className="h-4 w-4 text-primary" />
                <h2 className="font-heading font-bold text-primary-dark text-lg">
                  Shop by store
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {storeList.map((s) => (
                  <Link
                    key={s.slug}
                    to={`/store/${s.slug}`}
                    className="group flex items-center gap-4 rounded-2xl border border-border-light bg-white p-4 hover:border-primary transition-colors"
                  >
                    <div className="h-14 w-14 rounded-2xl overflow-hidden shrink-0 border border-border-light">
                      <img
                        src={s.logo}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-heading font-bold text-primary-dark text-sm truncate">
                        {s.name}
                      </p>
                      <p className="text-text-secondary text-xs">
                        {s.category} · {s.productsCount} products
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-text-subtle group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MarketplaceProducts;
