import { useMemo, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  ShieldCheck,
  Truck,
  Package,
  Star,
  Search,
  Heart,
  ShoppingBag,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  Share2,
  MessageCircle,
  Tag,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Home,
  Store,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import Seo from "../components/Seo";
import { type Storefront } from "../data/storefronts";
import marketplaceService from "../api/services/marketplace";
import messagesService from "../api/services/messages";
import { useStoreCart } from "../context/StoreCartContext";
import { useAuth } from "../context/AuthContext";
import { sharePage } from "../lib/share";

const naira = (n: number) => "₦" + n.toLocaleString("en-NG");

function Policy({ p }: { p: Storefront["policies"][number] }) {
  const Icon =
    p.icon === "shield"
      ? ShieldCheck
      : p.icon === "truck"
        ? Truck
        : p.icon === "clock"
          ? Clock
          : Tag;
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border-light bg-white/70 backdrop-blur-sm px-4 py-3">
      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-primary-dark">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="font-heading font-bold text-primary-dark text-sm leading-tight">
          {p.label}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mt-0.5">
          {p.detail}
        </p>
      </div>
    </div>
  );
}

function StorefrontNotFound({ slug }: { slug: string }) {
  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/70 border border-border-light text-text-subtle">
          <Store className="h-7 w-7" />
        </div>
        <h1 className="font-heading font-bold text-primary-dark text-2xl">
          No storefront at /store/{slug}
        </h1>
        <p className="text-text-secondary text-sm mt-2">
          This vendor hasn't opened their store on PropertyLoop yet. Browse the marketplace for similar vendors you can buy from today.
        </p>
        <Link
          to="/marketplace"
          className="mt-6 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
        >
          Visit the marketplace
          <ArrowRight className="h-4 w-4" />
        </Link>
      </main>
      <Footer />
    </div>
  );
}

const VendorStorefront = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const [store, setStore] = useState<Storefront | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeCollection, setActiveCollection] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [promoCopied, setPromoCopied] = useState(false);

  const { count, addItem } = useStoreCart();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [messagingVendor, setMessagingVendor] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleMessageVendor = async () => {
    if (!isLoggedIn) {
      navigate(`/login?redirect=/store/${slug}`);
      return;
    }
    if (!store?.ownerUserId || messagingVendor) return;
    setMessagingVendor(true);
    try {
      const { conversationId } = await messagesService.createOrFind({
        recipientId: store.ownerUserId,
        recipientRole: "VENDOR",
        senderRole: user?.role === "AGENT" ? "AGENT" : "BUYER",
      });
      navigate(`/messages?with=${conversationId}`);
    } catch {
      showToast("Could not start conversation. Please try again.");
    } finally {
      setMessagingVendor(false);
    }
  };

  const handleShareStore = async () => {
    if (!store) return;
    const result = await sharePage({
      title: `${store.name} on PropertyLoop`,
      text: store.tagline,
      url: `${window.location.origin}/store/${store.slug}`,
    });
    if (result === "copied") showToast("Store link copied to clipboard");
    else if (result === "failed") showToast("Could not share. Copy the URL from your address bar.");
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setActiveCollection("all");
    setQuery("");
    marketplaceService
      .getStore(slug)
      .then((s) => {
        if (cancelled) return;
        // The API omits lists a vendor hasn't filled in (and has no reviews
        // feed yet); default them so the page never maps over undefined.
        setStore({
          ...s,
          products: s.products ?? [],
          policies: s.policies ?? [],
          collections: s.collections ?? [],
          deliveryAreas: s.deliveryAreas ?? [],
          reviewsList: s.reviewsList ?? [],
        });
      })
      .catch(() => {
        if (!cancelled) setStore(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const products = useMemo(() => {
    if (!store) return [];
    return store.products.filter((p) => {
      const inCollection =
        activeCollection === "all" ||
        p.category.toLowerCase() === activeCollection.toLowerCase() ||
        store.collections.find((c) => c.id === activeCollection)?.title.toLowerCase() ===
          p.category.toLowerCase();
      const matches =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase());
      return inCollection && matches;
    });
  }, [store, activeCollection, query]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f0eb]">
        <Navbar />
        <div className="flex items-center justify-center py-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!store) return <StorefrontNotFound slug={slug} />;

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copyPromo = async () => {
    if (!store.promo) return;
    try {
      await navigator.clipboard.writeText(store.promo.code);
      setPromoCopied(true);
      setTimeout(() => setPromoCopied(false), 1800);
    } catch {
      /* clipboard unavailable, promo code is still visible */
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#f5f0eb" }}>
      <Seo
        title={`${store.name} · Storefront`}
        description={store.tagline}
        path={`/store/${store.slug}`}
      />
      <Navbar />

      {/* ─── Store header: branded hero ────────────────────────────────── */}
      <header
        className="relative overflow-hidden border-b border-black/5"
        style={{ backgroundColor: store.accent }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${store.banner})` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, ${store.accent}ee 0%, ${store.accent}99 45%, ${store.accent}33 100%)`,
          }}
        />
        <span className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <span className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 py-12 lg:py-16">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-white/70 text-xs mb-6 flex-wrap"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <Home className="h-3 w-3" />
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/marketplace" className="hover:text-white transition-colors">
              Marketplace
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white font-semibold">{store.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end gap-8">
            <div className="flex items-end gap-5">
              <div className="h-24 w-24 lg:h-28 lg:w-28 rounded-3xl overflow-hidden border-4 border-white/30 shadow-2xl shrink-0 bg-white/10">
                <img
                  src={store.logo}
                  alt={store.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="pb-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-sm text-white/90 text-[11px] font-semibold tracking-wide uppercase">
                    {store.category}
                  </span>
                  {store.verified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-400/90 text-emerald-950 text-[11px] font-semibold">
                      <BadgeCheck className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>
                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                  {store.name}
                </h1>
                <p className="mt-2 text-white/80 text-sm sm:text-base max-w-xl">
                  {store.tagline}
                </p>
              </div>
            </div>

            <div className="lg:ml-auto flex flex-wrap items-center gap-2">
              <button
                onClick={handleShareStore}
                className="h-10 px-4 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share store
              </button>
              <button
                onClick={handleMessageVendor}
                disabled={messagingVendor}
                className="h-10 px-4 rounded-full bg-white text-primary-dark text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-white/90 transition-colors shadow disabled:opacity-60"
              >
                {messagingVendor ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <MessageCircle className="h-3.5 w-3.5" />
                )}
                {messagingVendor ? "Opening chat…" : "Message vendor"}
              </button>
              <Link
                to="/marketplace/cart"
                className="h-10 pl-4 pr-5 rounded-full bg-black/40 text-white text-xs font-semibold inline-flex items-center gap-2 border border-white/15 backdrop-blur-sm hover:bg-black/55 transition-colors"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Cart
                <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-white text-primary-dark text-[10px] font-bold inline-flex items-center justify-center">
                  {count}
                </span>
              </Link>
            </div>
          </div>

          {/* Trust strip */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { v: store.rating.toFixed(1), l: "Rating", s: Star },
              {
                v: store.ordersFulfilled.toLocaleString(),
                l: "Orders fulfilled",
                s: Package,
              },
              { v: store.responseTime, l: "Avg. response", s: Clock },
              { v: `Est. ${store.established}`, l: "On PropertyLoop", s: Store },
            ].map(({ v, l, s: Icon }) => (
              <div
                key={l}
                className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-3"
              >
                <div className="flex items-center gap-2 text-white/70">
                  <Icon className="h-3.5 w-3.5" />
                  <span className="text-[11px] font-medium uppercase tracking-wide">
                    {l}
                  </span>
                </div>
                <p className="mt-1 font-heading font-bold text-white text-lg">
                  {v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 lg:px-10 py-10 lg:py-14">
        {/* ─── Promo banner ────────────────────────────────────────────── */}
        {store.promo && (
          <section
            className="rounded-3xl overflow-hidden shadow-sm mb-10 flex flex-col sm:flex-row sm:items-center gap-4 p-5 sm:p-7"
            style={{
              background: `linear-gradient(100deg, ${store.accent}, ${store.accent}dd)`,
            }}
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white">
                <Sparkles className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-white/70 text-[11px] font-semibold uppercase tracking-wide">
                  Live promotion
                </p>
                <p className="font-heading font-bold text-white text-xl mt-0.5">
                  {store.promo.title}
                </p>
                <p className="text-white/80 text-sm">{store.promo.subtitle}</p>
              </div>
            </div>
            <button
              onClick={copyPromo}
              className="shrink-0 h-11 px-5 rounded-full bg-white text-primary-dark text-sm font-bold inline-flex items-center gap-2 hover:bg-white/90 transition-colors"
            >
              {promoCopied ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  Use code · {store.promo.code}
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </section>
        )}

        {/* ─── Policies ───────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
          {store.policies.map((p) => (
            <Policy key={p.label} p={p} />
          ))}
        </section>

        {/* ─── Collections ────────────────────────────────────────────── */}
        <section className="mb-12">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="font-heading font-bold text-primary-dark text-2xl">
                Shop by collection
              </h2>
              <p className="text-text-secondary text-sm mt-1">
                Curated by {store.name.split(" ")[0]}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {store.collections.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCollection(c.id)}
                className="group relative aspect-4/5 rounded-3xl overflow-hidden border border-black/5 shadow-sm text-left"
              >
                <img
                  src={c.image}
                  alt={c.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="font-heading font-bold text-lg leading-tight">
                    {c.title}
                  </p>
                  <p className="text-white/70 text-xs mt-0.5">{c.subtitle}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold">
                    Shop
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ─── Inventory grid ─────────────────────────────────────────── */}
        <section>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="font-heading font-bold text-primary-dark text-2xl">
                Inventory
              </h2>
              <p className="text-text-secondary text-sm mt-1">
                {products.length}{" "}
                {products.length === 1 ? "product" : "products"} available
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search this store"
                  className="w-full h-10 pl-10 pr-4 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-sm text-primary-dark placeholder:text-text-subtle focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {[
                  { id: "all", label: "All" },
                  ...store.collections.map((c) => ({ id: c.id, label: c.title })),
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCollection(c.id)}
                    className={`shrink-0 h-10 px-4 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${
                      activeCollection === c.id
                        ? "bg-primary-dark text-white border-primary-dark"
                        : "bg-white/70 text-primary-dark border-border-light hover:border-primary"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 bg-white/60 rounded-3xl border border-border-light">
              <div className="w-14 h-14 mx-auto rounded-full bg-white border border-border-light flex items-center justify-center mb-3">
                <Package className="w-6 h-6 text-text-subtle" />
              </div>
              <h3 className="font-heading font-bold text-primary-dark text-lg">
                Nothing matches
              </h3>
              <p className="text-text-secondary text-sm mt-1">
                Try a different search or collection.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map((p) => {
                const saved = wishlist.has(p.id);
                return (
                  <article
                    key={p.id}
                    className="group relative overflow-hidden rounded-3xl bg-white border border-border-light shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
                  >
                    <Link
                      to={`/store/${store.slug}/product/${p.id}`}
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
                        {p.bulkEligible && (
                          <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-primary-dark text-[10px] font-bold uppercase tracking-wide">
                            Bulk price
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
                          : "bg-white/80 text-primary-dark border-white/70 hover:bg-white"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
                    </button>

                    <div className="p-4 flex-1 flex flex-col">
                      <p className="text-text-subtle text-[11px] uppercase tracking-wide font-semibold">
                        {p.category}
                      </p>
                      <Link
                        to={`/store/${store.slug}/product/${p.id}`}
                        className="font-heading font-bold text-primary-dark text-sm leading-snug mt-0.5 line-clamp-2 hover:text-primary transition-colors"
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
                              storeSlug: store.slug,
                              storeName: store.name,
                              name: p.name,
                              priceNaira: p.priceNaira,
                              image: p.image,
                            })
                          }
                          className="h-9 px-3 rounded-full bg-primary-dark text-white text-xs font-bold inline-flex items-center gap-1.5 hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          Add
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* ─── About + reviews ────────────────────────────────────────── */}
        <section className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl bg-white/80 border border-border-light p-6 lg:p-8">
            <h2 className="font-heading font-bold text-primary-dark text-xl">
              About {store.name}
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mt-3">
              {store.bio}
            </p>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-text-subtle text-[11px] uppercase tracking-wide font-semibold">
                    Based in
                  </p>
                  <p className="text-primary-dark text-sm font-medium">
                    {store.location}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-text-subtle text-[11px] uppercase tracking-wide font-semibold">
                    Delivers to
                  </p>
                  <p className="text-primary-dark text-sm font-medium">
                    {store.deliveryAreas.join(" · ")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-text-subtle text-[11px] uppercase tracking-wide font-semibold">
                    Phone
                  </p>
                  <p className="text-primary-dark text-sm font-medium">
                    {store.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-text-subtle text-[11px] uppercase tracking-wide font-semibold">
                    Email
                  </p>
                  <p className="text-primary-dark text-sm font-medium">
                    {store.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white/80 border border-border-light p-6 lg:p-8">
            <h2 className="font-heading font-bold text-primary-dark text-xl">
              Buyer reviews
            </h2>
            <div className="mt-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-[#F5A623] fill-[#F5A623]" />
              <span className="font-heading font-bold text-primary-dark text-lg">
                {store.rating.toFixed(1)}
              </span>
              <span className="text-text-secondary text-sm">
                · {store.reviews} reviews
              </span>
            </div>
            <ul className="mt-5 space-y-4">
              {store.reviewsList.map((r) => (
                <li
                  key={r.author + r.when}
                  className="rounded-2xl bg-white border border-border-light p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-heading font-bold text-primary-dark text-sm">
                      {r.author}
                    </p>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 text-[#F5A623] fill-[#F5A623]"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-text-secondary text-xs mt-2 leading-relaxed">
                    {r.comment}
                  </p>
                  <p className="text-text-subtle text-[11px] mt-2">{r.when}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ─── Platform footer ─────────────────────────────────────────── */}
        <section className="mt-14 rounded-3xl bg-white/70 border border-border-light px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="font-heading font-bold text-primary-dark text-sm">
                Checkout is secured by PropertyLoop
              </p>
              <p className="text-text-secondary text-xs leading-relaxed">
                Payments, delivery tracking and buyer protection run on the PropertyLoop platform. Vendors run their own storefronts — we handle the plumbing.
              </p>
            </div>
          </div>
          <Link
            to="/marketplace"
            className="shrink-0 h-10 px-5 rounded-full border border-border text-primary-dark text-xs font-semibold inline-flex items-center gap-1.5 hover:border-primary hover:text-primary transition-colors"
          >
            Discover more stores
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </section>
      </main>

      <Footer />

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-[fadeInUp_0.25s_ease-out]">
          <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-primary-dark text-white text-sm font-medium shadow-lg shadow-black/20">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {toast}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorStorefront;
