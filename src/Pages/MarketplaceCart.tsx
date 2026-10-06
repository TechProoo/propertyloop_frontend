import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  ChevronRight,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  Truck,
  ArrowRight,
  Store as StoreIcon,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import Seo from "../components/Seo";
import { useStoreCart } from "../context/StoreCartContext";

const naira = (n: number) => "₦" + n.toLocaleString("en-NG");

const MarketplaceCart = () => {
  const navigate = useNavigate();
  const { itemsByStore, subtotal, count, setQuantity, removeItem, clear } =
    useStoreCart();

  const platformFee = Math.round(subtotal * 0.015);
  const delivery = subtotal >= 250000 || subtotal === 0 ? 0 : 5000;
  const total = subtotal + platformFee + delivery;

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Seo
        title="Your cart · PropertyLoop Marketplace"
        description="Review items from your favourite stores and continue to secure PropertyLoop checkout."
        path="/marketplace/cart"
      />
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 lg:px-10 py-10">
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
          <span className="text-primary-dark font-semibold">Cart</span>
        </nav>

        <header className="mb-8 flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary-dark tracking-tight">
              Your cart
            </h1>
            <p className="mt-2 text-text-secondary text-sm">
              {count === 0
                ? "No items yet — browse the marketplace to add some."
                : `${count} ${count === 1 ? "item" : "items"} across ${itemsByStore.length} ${itemsByStore.length === 1 ? "store" : "stores"}`}
            </p>
          </div>
          {count > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Remove every item from your cart?")) clear();
              }}
              className="h-10 px-4 rounded-full border border-border-light bg-white text-xs font-semibold text-text-secondary hover:border-red-400 hover:text-red-600 transition-colors inline-flex items-center gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear cart
            </button>
          )}
        </header>

        {count === 0 ? (
          <div className="rounded-3xl bg-white/80 border border-border-light p-12 text-center">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-border-light text-text-subtle">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <h2 className="font-heading font-bold text-primary-dark text-xl">
              Your cart is empty
            </h2>
            <p className="text-text-secondary text-sm mt-2 max-w-md mx-auto">
              Products you add from any storefront land here. Head to the marketplace and start browsing.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                to="/marketplace"
                className="h-11 px-6 rounded-full bg-primary-dark text-white text-sm font-bold inline-flex items-center gap-2 hover:bg-black transition-colors"
              >
                Browse marketplace
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/marketplace/products"
                className="h-11 px-6 rounded-full border border-border-light bg-white text-primary-dark text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
              >
                See all products
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ─── Items ─────────────────────────────────────────── */}
            <section className="lg:col-span-2 space-y-6">
              {itemsByStore.map((group) => (
                <div
                  key={group.storeSlug}
                  className="rounded-3xl bg-white border border-border-light overflow-hidden"
                >
                  <div className="px-6 py-4 border-b border-border-light flex items-center justify-between flex-wrap gap-2">
                    <Link
                      to={`/store/${group.storeSlug}`}
                      className="inline-flex items-center gap-2 font-heading font-bold text-primary-dark text-sm hover:text-primary transition-colors"
                    >
                      <StoreIcon className="h-4 w-4" />
                      {group.storeName}
                    </Link>
                    <p className="text-text-secondary text-xs">
                      {group.items.length}{" "}
                      {group.items.length === 1 ? "item" : "items"} ·{" "}
                      <span className="font-bold text-primary-dark">
                        {naira(group.subtotal)}
                      </span>
                    </p>
                  </div>
                  <ul className="divide-y divide-border-light">
                    {group.items.map((it) => (
                      <li
                        key={it.productId}
                        className="px-6 py-5 flex gap-4 items-start"
                      >
                        <Link
                          to={`/store/${it.storeSlug}/product/${it.productId}`}
                          className="h-20 w-20 shrink-0 rounded-2xl overflow-hidden border border-border-light"
                        >
                          <img
                            src={it.image}
                            alt={it.name}
                            className="h-full w-full object-cover"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/store/${it.storeSlug}/product/${it.productId}`}
                            className="font-heading font-bold text-primary-dark text-sm hover:text-primary transition-colors line-clamp-2"
                          >
                            {it.name}
                          </Link>
                          {it.options && Object.keys(it.options).length > 0 && (
                            <p className="text-text-subtle text-xs mt-1">
                              {Object.entries(it.options)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(" · ")}
                            </p>
                          )}
                          <p className="font-heading font-bold text-primary-dark text-sm mt-2">
                            {naira(it.priceNaira)}
                          </p>

                          <div className="mt-3 flex items-center gap-3">
                            <div className="inline-flex items-center rounded-full border border-border-light overflow-hidden">
                              <button
                                aria-label="Decrease"
                                onClick={() =>
                                  setQuantity(it.productId, it.quantity - 1)
                                }
                                className="h-8 w-8 inline-flex items-center justify-center hover:bg-black/5"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-bold text-primary-dark">
                                {it.quantity}
                              </span>
                              <button
                                aria-label="Increase"
                                onClick={() =>
                                  setQuantity(it.productId, it.quantity + 1)
                                }
                                className="h-8 w-8 inline-flex items-center justify-center hover:bg-black/5"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(it.productId)}
                              className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                              Remove
                            </button>
                          </div>
                        </div>
                        <p className="shrink-0 font-heading font-bold text-primary-dark text-sm">
                          {naira(it.priceNaira * it.quantity)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            {/* ─── Summary ───────────────────────────────────────── */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 rounded-3xl bg-white border border-border-light p-6">
                <h2 className="font-heading font-bold text-primary-dark text-lg">
                  Order summary
                </h2>

                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center justify-between text-text-secondary">
                    <dt>Subtotal</dt>
                    <dd className="font-semibold text-primary-dark">
                      {naira(subtotal)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between text-text-secondary">
                    <dt>Delivery</dt>
                    <dd className="font-semibold text-primary-dark">
                      {delivery === 0 ? "Free" : naira(delivery)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between text-text-secondary">
                    <dt>Platform fee</dt>
                    <dd className="font-semibold text-primary-dark">
                      {naira(platformFee)}
                    </dd>
                  </div>
                  <div className="h-px bg-border-light my-2" />
                  <div className="flex items-center justify-between">
                    <dt className="font-heading font-bold text-primary-dark text-base">
                      Total
                    </dt>
                    <dd className="font-heading font-bold text-primary-dark text-xl">
                      {naira(total)}
                    </dd>
                  </div>
                </dl>

                <button
                  onClick={() => navigate("/marketplace/checkout")}
                  className="mt-6 w-full h-12 rounded-full bg-primary-dark text-white text-sm font-bold inline-flex items-center justify-center gap-2 hover:bg-black transition-colors"
                >
                  Checkout securely
                  <ArrowRight className="h-4 w-4" />
                </button>
                <p className="mt-2 text-[11px] text-text-subtle text-center">
                  Powered by Paystack · 3-D Secure
                </p>

                <ul className="mt-5 space-y-3 text-xs text-text-secondary">
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                    <span>
                      Payment is secured and held until items are delivered.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Truck className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                    <span>
                      Free Lagos delivery on orders over ₦250,000; otherwise ₦5,000 flat.
                    </span>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MarketplaceCart;
