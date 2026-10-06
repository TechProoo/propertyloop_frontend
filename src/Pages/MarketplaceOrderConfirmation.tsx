import { useEffect, useMemo, useRef, useState } from "react";
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
  Loader2,
  Clock,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import Seo from "../components/Seo";
import marketplaceService, {
  type MarketplaceOrder,
} from "../api/services/marketplace";
import { useStoreCart } from "../context/StoreCartContext";

const naira = (n: number) => "₦" + n.toLocaleString("en-NG");

type Phase = "verifying" | "paid" | "pending" | "error";

const MarketplaceOrderConfirmation = () => {
  const { reference = "" } = useParams<{ reference: string }>();
  const { clear } = useStoreCart();
  const [order, setOrder] = useState<MarketplaceOrder | null>(null);
  const [phase, setPhase] = useState<Phase>("verifying");
  const [copied, setCopied] = useState(false);
  const clearedRef = useRef(false);

  useEffect(() => {
    if (!reference) {
      setPhase("error");
      return;
    }
    let cancelled = false;

    // Paystack can take a beat to settle — verify a few times before giving up.
    const run = async () => {
      for (let attempt = 0; attempt < 4; attempt++) {
        try {
          const res = await marketplaceService.verifyOrder(reference);
          if (cancelled) return;
          setOrder(res);
          if (res.status === "PAID" || res.status === "FULFILLED") {
            setPhase("paid");
            if (!clearedRef.current) {
              clearedRef.current = true;
              clear();
            }
            return;
          }
        } catch {
          /* transient — retry */
        }
        await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
        if (cancelled) return;
      }
      if (!cancelled) setPhase((p) => (p === "verifying" ? "pending" : p));
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [reference, clear]);

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  // Group the flat order items by store for display.
  const groups = useMemo(() => {
    if (!order) return [];
    const map = new Map<
      string,
      { storeId: string; storeName: string; items: MarketplaceOrder["items"]; subtotal: number }
    >();
    for (const it of order.items) {
      const g = map.get(it.storeId) ?? {
        storeId: it.storeId,
        storeName: it.storeName,
        items: [],
        subtotal: 0,
      };
      g.items.push(it);
      g.subtotal += it.lineTotal;
      map.set(it.storeId, g);
    }
    return [...map.values()];
  }, [order]);

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
          <span className="text-primary-dark font-semibold">Order</span>
        </nav>

        {/* ─── Verifying ────────────────────────────────────────────── */}
        {phase === "verifying" && (
          <div className="rounded-3xl bg-white border border-border-light p-12 text-center">
            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Loader2 className="h-7 w-7 animate-spin" />
            </div>
            <h1 className="font-heading font-bold text-primary-dark text-xl">
              Confirming your payment…
            </h1>
            <p className="text-text-secondary text-sm mt-2">
              Hold on a moment while we confirm the transaction with Paystack.
            </p>
          </div>
        )}

        {/* ─── Pending ──────────────────────────────────────────────── */}
        {phase === "pending" && (
          <div className="rounded-3xl bg-white border border-border-light p-12 text-center">
            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Clock className="h-7 w-7" />
            </div>
            <h1 className="font-heading font-bold text-primary-dark text-xl">
              Still confirming
            </h1>
            <p className="text-text-secondary text-sm mt-2 max-w-md mx-auto">
              If you completed payment, your order will confirm in a moment —
              we'll email your receipt. You haven't been charged twice. Reference{" "}
              <span className="font-mono text-primary-dark">{reference}</span>.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="h-11 px-6 rounded-full bg-primary-dark text-white text-sm font-bold hover:bg-black transition-colors"
              >
                Check again
              </button>
              <Link
                to="/marketplace"
                className="h-11 px-6 rounded-full border border-border-light bg-white text-primary-dark text-sm font-semibold hover:border-primary hover:text-primary transition-colors inline-flex items-center"
              >
                Back to marketplace
              </Link>
            </div>
          </div>
        )}

        {/* ─── Error ────────────────────────────────────────────────── */}
        {phase === "error" && (
          <div className="rounded-3xl bg-white border border-border-light p-12 text-center">
            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-border-light text-text-subtle">
              <Package className="h-7 w-7" />
            </div>
            <h1 className="font-heading font-bold text-primary-dark text-xl">
              We couldn't find that order
            </h1>
            <p className="text-text-secondary text-sm mt-2">
              The reference may be wrong, or the order was never completed.
            </p>
            <Link
              to="/marketplace"
              className="mt-6 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-primary-dark text-white text-sm font-bold hover:bg-black transition-colors"
            >
              Back to marketplace
            </Link>
          </div>
        )}

        {/* ─── Paid ─────────────────────────────────────────────────── */}
        {phase === "paid" && order && (
          <>
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
                    Thanks, {order.buyerName.split(" ")[0]}. We've emailed your
                    receipt and alerted{" "}
                    {groups.length > 1 ? "the vendors" : "the vendor"} — they'll
                    begin preparing your items right away.
                  </p>
                  <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-white/10 border border-white/20 pl-5 pr-2 py-2 backdrop-blur-sm">
                    <div>
                      <p className="text-white/60 text-[10px] font-semibold uppercase tracking-wide">
                        Order
                      </p>
                      <p className="font-heading font-bold text-sm">
                        {order.orderNumber}
                      </p>
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

              <div className="p-6 lg:p-10 grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <section>
                    <h2 className="font-heading font-bold text-primary-dark text-lg inline-flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Items in your order
                    </h2>
                    <div className="mt-4 space-y-4">
                      {groups.map((group) => (
                        <div
                          key={group.storeId}
                          className="rounded-2xl border border-border-light overflow-hidden"
                        >
                          <div className="px-5 py-3 border-b border-border-light flex items-center justify-between flex-wrap gap-2">
                            <span className="inline-flex items-center gap-2 font-heading font-bold text-primary-dark text-sm">
                              <StoreIcon className="h-3.5 w-3.5" />
                              {group.storeName}
                            </span>
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
                                <div className="h-14 w-14 shrink-0 rounded-xl overflow-hidden border border-border-light">
                                  <img
                                    src={it.image}
                                    alt={it.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-heading font-bold text-primary-dark text-sm line-clamp-2">
                                    {it.name}
                                  </p>
                                  <p className="text-text-subtle text-[11px]">
                                    Qty {it.quantity} · {naira(it.unitPrice)} each
                                  </p>
                                </div>
                                <p className="shrink-0 font-heading font-bold text-primary-dark text-sm">
                                  {naira(it.lineTotal)}
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
                          {order.address}, {order.city}, {order.state}
                        </span>
                      </p>
                      <p className="inline-flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-primary" />
                        <span className="text-primary-dark font-medium">
                          {order.buyerPhone}
                        </span>
                      </p>
                      <p className="inline-flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-primary" />
                        <span className="text-primary-dark font-medium">
                          {order.buyerEmail}
                        </span>
                      </p>
                      {order.notes && (
                        <p className="text-xs italic text-text-subtle mt-2">
                          Notes: {order.notes}
                        </p>
                      )}
                    </div>
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
                          {naira(order.subtotal)}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between text-text-secondary">
                        <dt>Delivery</dt>
                        <dd className="font-semibold text-primary-dark">
                          {order.deliveryFee === 0
                            ? "Free"
                            : naira(order.deliveryFee)}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between text-text-secondary">
                        <dt>Platform fee</dt>
                        <dd className="font-semibold text-primary-dark">
                          {naira(order.platformFee)}
                        </dd>
                      </div>
                      <div className="h-px bg-border-light my-1" />
                      <div className="flex items-center justify-between">
                        <dt className="font-heading font-bold text-primary-dark">
                          Total paid
                        </dt>
                        <dd className="font-heading font-bold text-primary-dark text-xl">
                          {naira(order.total)}
                        </dd>
                      </div>
                    </dl>
                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-primary/5 border border-primary/15 p-3">
                      <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                      <p className="text-[11px] text-text-secondary leading-relaxed">
                        Held safely until delivery. Reply to your receipt email
                        if anything is wrong.
                      </p>
                    </div>
                  </div>
                </aside>
              </div>
            </section>

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
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MarketplaceOrderConfirmation;
