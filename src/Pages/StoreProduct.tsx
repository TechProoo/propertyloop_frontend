import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Home,
  ChevronRight,
  Star,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  Clock,
  Tag,
  Minus,
  Plus,
  ShoppingBag,
  Store as StoreIcon,
  BadgeCheck,
  Package,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import Seo from "../components/Seo";
import marketplaceService, {
  type ProductDetail,
} from "../api/services/marketplace";
import { useStoreCart } from "../context/StoreCartContext";

const naira = (n: number) => "₦" + n.toLocaleString("en-NG");

/* ─── Not-found fallback ─────────────────────────────────────────────────── */

function ProductNotFound() {
  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/70 border border-border-light text-text-subtle">
          <Package className="h-7 w-7" />
        </div>
        <h1 className="font-heading font-bold text-primary-dark text-2xl">
          Product unavailable
        </h1>
        <p className="text-text-secondary text-sm mt-2">
          This product has been removed or the store is no longer listed.
        </p>
        <Link
          to="/marketplace/products"
          className="mt-6 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
        >
          Browse all products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </main>
      <Footer />
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

const StoreProductPage = () => {
  const { productId = "" } = useParams<{
    slug: string;
    productId: string;
  }>();
  const navigate = useNavigate();

  // Hooks must run on every render — define state before any early return
  // so React never sees a different hook count between loads.
  const [data, setData] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    {},
  );
  const [saved, setSaved] = useState(false);
  const [addedFlash, setAddedFlash] = useState(false);

  const { addItem } = useStoreCart();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setActiveImage(0);
    setQuantity(1);
    setSelectedOptions({});
    marketplaceService
      .getProduct(productId)
      .then((p) => {
        if (!cancelled) setData(p);
      })
      .catch(() => {
        if (!cancelled) setData(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [productId]);

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

  if (!data) return <ProductNotFound />;

  const product = data;
  const store = data.store;
  const related = data.related ?? [];
  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const discount = product.compareAtNaira
    ? Math.round(
        ((product.compareAtNaira - product.priceNaira) /
          product.compareAtNaira) *
          100,
      )
    : null;

  const handleAdd = () => {
    addItem({
      productId: product.id,
      storeSlug: store.slug,
      storeName: store.name,
      name: product.name,
      priceNaira: product.priceNaira,
      image: product.image,
      quantity,
      options:
        Object.keys(selectedOptions).length > 0 ? selectedOptions : undefined,
    });
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 1800);
  };

  const handleBuyNow = () => {
    handleAdd();
    navigate("/marketplace/cart");
  };

  const policyIcon = {
    truck: Truck,
    shield: ShieldCheck,
    clock: Clock,
    tag: Tag,
  } as const;

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Seo
        title={`${product.name} · ${store.name}`}
        description={
          product.description ??
          `${product.name} from ${store.name} on PropertyLoop Marketplace.`
        }
        path={`/store/${store.slug}/product/${product.id}`}
      />
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 lg:px-10 py-8">
        {/* ─── Breadcrumbs ───────────────────────────────────────────── */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-text-secondary text-xs mb-6 flex-wrap"
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
          <Link
            to={`/store/${store.slug}`}
            className="hover:text-primary transition-colors"
          >
            {store.name}
          </Link>
          <ChevronRight className="h-3 w-3 text-text-subtle" />
          <span className="text-primary-dark font-semibold truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* ─── Main grid: gallery + buy box ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* ─── Gallery ─────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-border-light bg-white">
              <img
                src={gallery[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              {discount !== null && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold">
                  −{discount}%
                </span>
              )}
              {!product.inStock && (
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/70 text-white text-xs font-bold">
                  Out of stock
                </span>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-3">
                {gallery.map((src, i) => (
                  <button
                    key={src + i}
                    onClick={() => setActiveImage(i)}
                    aria-label={`View image ${i + 1}`}
                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                      activeImage === i
                        ? "border-primary-dark"
                        : "border-border-light hover:border-primary/40"
                    }`}
                  >
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* ─── Description + specs ───────────────────────────── */}
            <section className="mt-10 rounded-3xl bg-white/80 border border-border-light p-6 lg:p-8">
              <h2 className="font-heading font-bold text-primary-dark text-xl">
                About this product
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed mt-3">
                {product.description ??
                  `${product.name} from ${store.name}. Add to cart to continue to secure PropertyLoop checkout.`}
              </p>

              {product.specs && product.specs.length > 0 && (
                <div className="mt-6 grid sm:grid-cols-2 gap-3">
                  {product.specs.map((s) => (
                    <div
                      key={s.label}
                      className="flex items-start justify-between rounded-2xl bg-white border border-border-light px-4 py-3"
                    >
                      <span className="text-text-subtle text-xs">
                        {s.label}
                      </span>
                      <span className="text-primary-dark text-xs font-semibold text-right">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ─── Reviews ───────────────────────────────────────── */}
            <section className="mt-6 rounded-3xl bg-white/80 border border-border-light p-6 lg:p-8">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="font-heading font-bold text-primary-dark text-xl">
                  Reviews
                </h2>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-[#F5A623] fill-[#F5A623]" />
                  <span className="font-heading font-bold text-primary-dark text-lg">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-text-secondary text-sm">
                    · {product.reviews} reviews
                  </span>
                </div>
              </div>

              {product.reviewsList && product.reviewsList.length > 0 ? (
                <ul className="mt-5 space-y-4">
                  {product.reviewsList.map((r) => (
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
                      <p className="text-text-subtle text-[11px] mt-2">
                        {r.when}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-text-secondary text-sm">
                  No written reviews yet — be the first after your order lands.
                </p>
              )}
            </section>
          </div>

          {/* ─── Buy box ─────────────────────────────────────────── */}
          <aside className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 space-y-5">
              {/* Vendor banner */}
              <Link
                to={`/store/${store.slug}`}
                className="group flex items-center gap-3 rounded-2xl bg-white border border-border-light p-3 hover:border-primary transition-colors"
              >
                <div className="h-12 w-12 rounded-xl overflow-hidden shrink-0 border border-border-light">
                  <img src={store.logo} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-heading font-bold text-primary-dark text-sm flex items-center gap-1 truncate">
                    {store.name}
                    {store.verified && (
                      <BadgeCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                    )}
                  </p>
                  <p className="text-text-secondary text-xs">
                    {store.category} · {store.ordersFulfilled.toLocaleString()}{" "}
                    orders
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-text-subtle group-hover:text-primary transition-colors" />
              </Link>

              {/* Main buy card */}
              <div className="rounded-3xl bg-white border border-border-light p-6 shadow-sm">
                <p className="text-text-subtle text-[11px] uppercase tracking-wide font-semibold">
                  {product.category}
                </p>
                <h1 className="mt-1 font-display font-bold text-primary-dark text-2xl leading-tight">
                  {product.name}
                </h1>

                <div className="mt-3 flex items-center gap-2 text-xs text-text-secondary">
                  <Star className="h-3.5 w-3.5 text-[#F5A623] fill-[#F5A623]" />
                  <span className="font-semibold text-primary-dark">
                    {product.rating.toFixed(1)}
                  </span>
                  <span>({product.reviews} reviews)</span>
                </div>

                {/* Price */}
                <div className="mt-5 flex items-end gap-3">
                  <p className="font-heading font-bold text-primary-dark text-3xl leading-none">
                    {naira(product.priceNaira)}
                  </p>
                  {product.compareAtNaira && (
                    <p className="text-text-subtle text-sm line-through pb-1">
                      {naira(product.compareAtNaira)}
                    </p>
                  )}
                </div>
                {product.inStock ? (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-primary font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    In stock · ships in 1-3 days
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-red-600 font-semibold">
                    Currently out of stock
                  </p>
                )}

                {/* Options */}
                {product.options && product.options.length > 0 && (
                  <div className="mt-5 space-y-4">
                    {product.options.map((opt) => (
                      <div key={opt.label}>
                        <p className="text-text-subtle text-[11px] uppercase tracking-wide font-semibold mb-2">
                          {opt.label}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {opt.values.map((v) => {
                            const active = selectedOptions[opt.label] === v;
                            return (
                              <button
                                key={v}
                                onClick={() =>
                                  setSelectedOptions((s) => ({
                                    ...s,
                                    [opt.label]: v,
                                  }))
                                }
                                className={`h-9 px-3.5 rounded-full border text-xs font-semibold transition-colors ${
                                  active
                                    ? "bg-primary-dark border-primary-dark text-white"
                                    : "bg-white border-border-light text-primary-dark hover:border-primary"
                                }`}
                              >
                                {v}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quantity */}
                <div className="mt-5">
                  <p className="text-text-subtle text-[11px] uppercase tracking-wide font-semibold mb-2">
                    Quantity
                  </p>
                  <div className="inline-flex items-center rounded-full border border-border-light bg-white overflow-hidden">
                    <button
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="h-10 w-10 inline-flex items-center justify-center text-primary-dark hover:bg-black/5"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-primary-dark">
                      {quantity}
                    </span>
                    <button
                      aria-label="Increase quantity"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="h-10 w-10 inline-flex items-center justify-center text-primary-dark hover:bg-black/5"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* CTAs */}
                <div className="mt-6 flex flex-col gap-2">
                  <button
                    disabled={!product.inStock}
                    onClick={handleBuyNow}
                    className="h-12 rounded-full bg-primary-dark text-white text-sm font-bold inline-flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Buy now
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    disabled={!product.inStock}
                    onClick={handleAdd}
                    className="h-12 rounded-full border border-primary-dark text-primary-dark text-sm font-bold inline-flex items-center justify-center gap-2 hover:bg-primary-dark hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {addedFlash ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Added to cart
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" />
                        Add to cart
                      </>
                    )}
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSaved((s) => !s)}
                      className={`flex-1 h-10 rounded-full border text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors ${
                        saved
                          ? "bg-red-50 border-red-200 text-red-600"
                          : "bg-white border-border-light text-text-secondary hover:border-primary hover:text-primary"
                      }`}
                    >
                      <Heart className={`h-3.5 w-3.5 ${saved ? "fill-current" : ""}`} />
                      {saved ? "Saved" : "Save"}
                    </button>
                    <button className="flex-1 h-10 rounded-full border border-border-light bg-white text-text-secondary text-xs font-semibold inline-flex items-center justify-center gap-1.5 hover:border-primary hover:text-primary transition-colors">
                      <Share2 className="h-3.5 w-3.5" />
                      Share
                    </button>
                  </div>
                </div>

                {/* Promo code */}
                {store.promo && (
                  <div
                    className="mt-5 rounded-2xl p-4 text-white"
                    style={{
                      background: `linear-gradient(100deg, ${store.accent}, ${store.accent}dd)`,
                    }}
                  >
                    <p className="text-white/80 text-[11px] uppercase tracking-wide font-semibold">
                      {store.promo.title}
                    </p>
                    <p className="font-heading font-bold text-sm mt-0.5">
                      {store.promo.subtitle}
                    </p>
                    <p className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
                      <Tag className="h-3 w-3" />
                      Code · {store.promo.code}
                    </p>
                  </div>
                )}
              </div>

              {/* Delivery + policies */}
              <div className="rounded-3xl bg-white border border-border-light p-5">
                <h3 className="font-heading font-bold text-primary-dark text-sm mb-3">
                  Delivery &amp; buyer protection
                </h3>
                <ul className="space-y-3">
                  {(store.policies ?? []).map((p) => {
                    const Icon = policyIcon[p.icon];
                    return (
                      <li
                        key={p.label}
                        className="flex items-start gap-3 text-xs"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                        <div>
                          <p className="font-heading font-bold text-primary-dark">
                            {p.label}
                          </p>
                          <p className="text-text-secondary leading-relaxed">
                            {p.detail}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Message vendor */}
              <Link
                to={`/store/${store.slug}`}
                className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-full border border-border-light bg-white text-primary-dark text-xs font-semibold hover:border-primary hover:text-primary transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Visit {store.name}
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>
        </div>

        {/* ─── Related products ──────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-16">
            <div className="flex items-end justify-between mb-5">
              <div>
                <h2 className="font-heading font-bold text-primary-dark text-2xl">
                  More from {store.name}
                </h2>
                <p className="text-text-secondary text-sm mt-1">
                  Hand-picked by the vendor.
                </p>
              </div>
              <Link
                to={`/store/${store.slug}`}
                className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:underline"
              >
                <StoreIcon className="h-3.5 w-3.5" />
                Visit store
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to={`/store/${store.slug}/product/${p.id}`}
                  className="group rounded-3xl overflow-hidden bg-white border border-border-light shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-bold text-primary-dark text-sm line-clamp-2">
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
        )}
      </main>

      <Footer />
    </div>
  );
};

export default StoreProductPage;
