import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CheckCircle2,
  Home,
  ChevronRight,
  Package,
  Truck,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Copy,
  Check,
  Store as StoreIcon,
  Receipt,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import Seo from "../components/Seo";

const naira = (n: number) => "₦" + n.toLocaleString("en-NG");

type StoredOrder = {
  reference: string;
  placedAt: string;
  contact: { name: string; email: string; phone: string };
  delivery: { address: string; city: string; state: string; notes: string };
  totals: {
    subtotal: number;
    deliveryFee: number;
    platformFee: number;
    total: number;
    freeShip: boolean;
  };
  itemsByStore: {
    storeSlug: string;
    storeName: string;
    subtotal: number;
    items: {
      productId: string;
      storeSlug: string;
      storeName: string;
      name: string;
      priceNaira: number;
      image: string;
      quantity: number;
      options?: Record<string, string>;
    }[];
  }[];
};

const MarketplaceOrderConfirmation = () => {
  const { reference = "" } = useParams<{ reference: string }>();
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!reference) return;
    try {
      const raw = window.localStorage.getItem(
        `pl-marketplace-order-${reference}`,
      );
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, [reference]);

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Seo
        title="Order confirmed · PropertyLoop Marketplace"
        description="Thanks for your order. We'll send tracking details by email."
        path={`/marketplace/order/${reference}`}
      />
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 lg:px-10 py-10">
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
          <span className="text-primary-dark font-semibold">Order confirmed</span>
        </nav>

        {/* ─── Success banner ─────────────────────────────────────── */}
        <section className="rounded-3xl bg-white border border-border-light overflow-hidden">
          <div className="relative px-6 lg:px-10 py-10 bg-gradient-to-br from-primary-dark via-primary to-primary-dark/80 text-white">
            <span className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />
            <span className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/15 blur-3xl" />
            <div className="relative z-10">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm mb-5">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                Payment received
              </h1>
              <p className="mt-3 text-white/80 text-sm sm:text-base max-w-xl">
                Thanks{order?.contact.name ? `, ${order.contact.name.split(" ")[0]}` : ""}
                . We've emailed your receipt and alerted the vendor{order && order.itemsByStore.length > 1 ? "s" : ""} — they'll begin preparing your items right away.
              </p>

              <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-white/10 border border-white/20 pl-5 pr-2 py-2 backdrop-blur-sm">
                <div>
                  <p className="text-white/60 text-[10px] font-semibold uppercase tracking-wide">
                    Reference
                  </p>
                  <p className="font-heading font-bold text-sm">{reference}</p>
                </div>
                <button
                  onClick={copyReference}
                  className="h-8 w-8 rounded-full bg-white text-primary-dark inline-flex items-center justify-center hover:bg-white/90 transition-colors"
                  aria-label="Copy reference"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ─── Order details ───────────────────────────────────── */}
          {order ? (
            <div className="p-6 lg:p-10 grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <section>
                  <h2 className="font-heading font-bold text-primary-dark text-lg inline-flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Items in your order
                  </h2>
                  <div className="mt-4 space-y-4">
                    {order.itemsByStore.map((group) => (
                      <div
                        key={group.storeSlug}
                        className="rounded-2xl border border-border-light overflow-hidden"
                      >
                        <div className="px-5 py-3 border-b border-border-light flex items-center justify-between flex-wrap gap-2">
                          <Link
                            to={`/store/${group.storeSlug}`}
                            className="inline-flex items-center gap-2 font-heading font-bold text-primary-dark text-sm hover:text-primary transition-colors"
                          >
                            <StoreIcon className="h-3.5 w-3.5" />
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
                              className="px-5 py-4 flex gap-3 items-start"
                            >
                              <Link
                                to={`/store/${it.storeSlug}/product/${it.productId}`}
                                className="h-14 w-14 shrink-0 rounded-xl overflow-hidden border border-border-light"
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
                                <p className="text-text-subtle text-[11px]">
                                  Qty {it.quantity} · {naira(it.priceNaira)} each
                                </p>
                              </div>
                              <p className="shrink-0 font-heading font-bold text-primary-dark text-sm">
                                {naira(it.priceNaira * it.quantity)}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="font-heading font-bold text-primary-dark text-lg inline-flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Delivery
                  </h2>
                  <div className="mt-4 rounded-2xl border border-border-light p-5 text-sm space-y-2 text-text-secondary">
                    <p className="inline-flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span className="text-primary-dark font-medium">
                        {order.delivery.address}, {order.delivery.city},{" "}
                        {order.delivery.state}
                      </span>
                    </p>
                    <p className="inline-flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-primary" />
                      <span className="text-primary-dark font-medium">
                        {order.contact.phone}
                      </span>
                    </p>
                    <p className="inline-flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      <span className="text-primary-dark font-medium">
                        {order.contact.email}
                      </span>
                    </p>
                    {order.delivery.notes && (
                      <p className="text-xs italic text-text-subtle mt-2">
                        Notes: {order.delivery.notes}
                      </p>
                    )}
                  </div>
                </section>

                <section>
                  <h2 className="font-heading font-bold text-primary-dark text-lg inline-flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    What happens next
                  </h2>
                  <ol className="mt-4 space-y-3">
                    {[
                      {
                        t: "Vendor confirmation",
                        b: "Each vendor confirms stock and prepares your items — usually within a few hours.",
                      },
                      {
                        t: "Dispatch & tracking",
                        b: "You'll get an email with tracking as soon as items ship. Lagos deliveries land in 2-5 business days.",
                      },
                      {
                        t: "Buyer protection",
                        b: "Funds are only released to the vendor after delivery. Anything missing or wrong? Reply to the receipt email.",
                      },
                    ].map((step, i) => (
                      <li
                        key={step.t}
                        className="flex items-start gap-3 rounded-2xl border border-border-light bg-white p-4"
                      >
                        <span className="h-8 w-8 shrink-0 rounded-full bg-primary/10 text-primary inline-flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="font-heading font-bold text-primary-dark text-sm">
                            {step.t}
                          </p>
                          <p className="text-text-secondary text-xs leading-relaxed mt-0.5">
                            {step.b}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              </div>

              <aside>
                <div className="rounded-2xl border border-border-light bg-white p-5 lg:sticky lg:top-24">
                  <h3 className="font-heading font-bold text-primary-dark text-sm inline-flex items-center gap-1.5">
                    <Receipt className="h-3.5 w-3.5" />
                    Payment summary
                  </h3>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center justify-between text-text-secondary">
                      <dt>Subtotal</dt>
                      <dd className="font-semibold text-primary-dark">
                        {naira(order.totals.subtotal)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between text-text-secondary">
                      <dt>Delivery</dt>
                      <dd className="font-semibold text-primary-dark">
                        {order.totals.deliveryFee === 0
                          ? "Free"
                          : naira(order.totals.deliveryFee)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between text-text-secondary">
                      <dt>Platform fee</dt>
                      <dd className="font-semibold text-primary-dark">
                        {naira(order.totals.platformFee)}
                      </dd>
                    </div>
                    <div className="h-px bg-border-light my-1" />
                    <div className="flex items-center justify-between">
                      <dt className="font-heading font-bold text-primary-dark">
                        Total paid
                      </dt>
                      <dd className="font-heading font-bold text-primary-dark text-xl">
                        {naira(order.totals.total)}
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-[11px] text-text-subtle leading-relaxed">
                    Charged to the card ending as shown in your Paystack
                    receipt. Reference{" "}
                    <span className="font-mono text-primary-dark">
                      {reference}
                    </span>
                    .
                  </p>
                </div>
              </aside>
            </div>
          ) : (
            <div className="p-6 lg:p-10 text-center">
              <p className="text-text-secondary text-sm leading-relaxed max-w-md mx-auto">
                We received your payment. The detailed receipt is in your email
                — if you opened this page from a different browser or device,
                it will not show the line items here.
              </p>
            </div>
          )}
        </section>

        {/* ─── Follow-up CTAs ─────────────────────────────────────── */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/marketplace"
            className="h-11 px-6 rounded-full bg-primary-dark text-white text-sm font-bold inline-flex items-center gap-2 hover:bg-black transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            Continue shopping
          </Link>
          <Link
            to="/marketplace/products"
            className="h-11 px-6 rounded-full border border-border-light bg-white text-primary-dark text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
          >
            All products
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MarketplaceOrderConfirmation;
