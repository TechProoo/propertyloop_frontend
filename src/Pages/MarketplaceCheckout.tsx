import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  ChevronRight,
  Truck,
  ShieldCheck,
  Lock,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  User,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Package,
  Tag,
  Store as StoreIcon,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import Seo from "../components/Seo";
import { useStoreCart } from "../context/StoreCartContext";
import { useAuth } from "../context/AuthContext";
import marketplaceService from "../api/services/marketplace";

const naira = (n: number) => "₦" + n.toLocaleString("en-NG");

type Stage = "contact" | "delivery" | "payment";

type ContactForm = {
  name: string;
  email: string;
  phone: string;
};

type DeliveryForm = {
  address: string;
  city: string;
  state: string;
  notes: string;
};

const NIGERIAN_CITIES = [
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Ibadan",
  "Kano",
  "Benin City",
  "Enugu",
  "Kaduna",
  "Owerri",
  "Abeokuta",
];

const DRAFT_KEY = "pl-marketplace-checkout-draft.v1";

const MarketplaceCheckout = () => {
  const { items, itemsByStore, subtotal, count } = useStoreCart();
  const { user } = useAuth();
  const [stage, setStage] = useState<Stage>("contact");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const [contact, setContact] = useState<ContactForm>({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  });
  const [delivery, setDelivery] = useState<DeliveryForm>({
    address: "",
    city: "Lagos",
    state: "Lagos",
    notes: "",
  });

  // Restore any in-flight draft on mount — a buyer who navigated away mid-flow
  // should land back on their filled-in form rather than start from scratch.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.contact) setContact((c) => ({ ...c, ...parsed.contact }));
      if (parsed.delivery) setDelivery((d) => ({ ...d, ...parsed.delivery }));
    } catch {
      /* ignore malformed drafts */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ contact, delivery }),
      );
    } catch {
      /* storage full or private window — carry on */
    }
  }, [contact, delivery]);

  const totals = useMemo(() => {
    const platformFee = Math.round(subtotal * 0.015);
    const freeShip = subtotal >= 250000 || subtotal === 0;
    const deliveryFee = freeShip ? 0 : 5000;
    const total = subtotal + platformFee + deliveryFee;
    return { platformFee, deliveryFee, total, freeShip };
  }, [subtotal]);

  const canContinueContact =
    contact.name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact.email.trim()) &&
    contact.phone.trim().length >= 7;

  const canContinueDelivery =
    delivery.address.trim().length >= 5 && delivery.city.trim().length > 0;

  // ─── Empty cart guard ─────────────────────────────────────────────
  if (count === 0) {
    return (
      <div className="min-h-screen bg-[#f5f0eb]">
        <Seo
          title="Checkout · PropertyLoop Marketplace"
          description="Complete your marketplace purchase."
          path="/marketplace/checkout"
        />
        <Navbar />
        <main className="mx-auto max-w-3xl px-6 py-24 text-center">
          <div className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-border-light text-text-subtle">
            <Package className="h-7 w-7" />
          </div>
          <h1 className="font-heading font-bold text-primary-dark text-2xl">
            No items to check out
          </h1>
          <p className="text-text-secondary text-sm mt-2">
            Your cart is empty — add something from the marketplace first.
          </p>
          <Link
            to="/marketplace"
            className="mt-6 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-primary-dark text-white text-sm font-bold hover:bg-black transition-colors"
          >
            Browse marketplace
            <ArrowRight className="h-4 w-4" />
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const payWithPaystack = async () => {
    setPayError(null);
    if (!canContinueContact || !canContinueDelivery) {
      setPayError("Please complete every delivery and contact field.");
      return;
    }

    setPaying(true);
    try {
      // The server recomputes every price and the total from the database, so
      // the amount charged can't be tampered with from the client. It returns a
      // Paystack checkout URL that already knows the order and the callback.
      const result = await marketplaceService.createOrder({
        buyerName: contact.name.trim(),
        buyerEmail: contact.email.trim().toLowerCase(),
        buyerPhone: contact.phone.trim(),
        address: delivery.address.trim(),
        city: delivery.city,
        state: delivery.state,
        notes: delivery.notes.trim() || undefined,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          options: i.options,
        })),
      });

      // Clear the local draft; the cart is cleared on the confirmation page once
      // payment is verified, so an abandoned checkout keeps the cart intact.
      try {
        window.localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* non-fatal */
      }

      // Hand off to Paystack's hosted checkout. Paystack redirects back to
      // /marketplace/order/:orderNumber, which verifies server-side.
      window.location.href = result.paymentUrl;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string | string[] } } })
          ?.response?.data?.message;
      setPayError(
        Array.isArray(message)
          ? message[0]
          : (message ??
              "We could not start the payment. Please try again."),
      );
      setPaying(false);
    }
  };

  const stageIndex = ["contact", "delivery", "payment"].indexOf(stage);

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Seo
        title="Checkout · PropertyLoop Marketplace"
        description="Secure your marketplace order with Paystack."
        path="/marketplace/checkout"
      />
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 lg:px-10 py-10">
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
          <Link
            to="/marketplace/cart"
            className="hover:text-primary transition-colors"
          >
            Cart
          </Link>
          <ChevronRight className="h-3 w-3 text-text-subtle" />
          <span className="text-primary-dark font-semibold">Checkout</span>
        </nav>

        <header className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary-dark tracking-tight">
            Checkout
          </h1>
          <p className="mt-2 text-text-secondary text-sm">
            Review your order and complete payment securely with Paystack.
          </p>
        </header>

        {/* ─── Progress tracker ───────────────────────────────────── */}
        <ol className="flex items-center gap-3 mb-8">
          {[
            { k: "contact", label: "Contact" },
            { k: "delivery", label: "Delivery" },
            { k: "payment", label: "Payment" },
          ].map((s, i) => {
            const done = i < stageIndex;
            const active = i === stageIndex;
            return (
              <li key={s.k} className="flex items-center gap-3 flex-1">
                <span
                  className={`h-8 w-8 rounded-full inline-flex items-center justify-center text-xs font-bold transition-colors ${
                    done
                      ? "bg-primary text-white"
                      : active
                        ? "bg-primary-dark text-white"
                        : "bg-white border border-border-light text-text-subtle"
                  }`}
                >
                  {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </span>
                <span
                  className={`text-xs font-semibold ${
                    done || active ? "text-primary-dark" : "text-text-subtle"
                  }`}
                >
                  {s.label}
                </span>
                {i < 2 && (
                  <span className="flex-1 h-px bg-border-light hidden sm:block" />
                )}
              </li>
            );
          })}
        </ol>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ─── Form column ───────────────────────────────────────── */}
          <section className="lg:col-span-2 space-y-6">
            {/* Contact */}
            <div className="rounded-3xl bg-white border border-border-light p-6 lg:p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-bold text-primary-dark text-lg inline-flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Contact details
                </h2>
                {stage !== "contact" && (
                  <button
                    onClick={() => setStage("contact")}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              {stage === "contact" ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="sm:col-span-2 block">
                    <span className="text-xs font-semibold text-primary-dark mb-1.5 block">
                      Full name
                    </span>
                    <input
                      value={contact.name}
                      onChange={(e) =>
                        setContact((c) => ({ ...c, name: e.target.value }))
                      }
                      placeholder="How should we address you?"
                      className="w-full h-11 px-4 rounded-xl bg-white border border-border-light text-sm focus:outline-none focus:border-primary"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-primary-dark mb-1.5 block">
                      Email (receipts go here)
                    </span>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-subtle" />
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) =>
                          setContact((c) => ({ ...c, email: e.target.value }))
                        }
                        placeholder="you@example.com"
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-border-light text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-primary-dark mb-1.5 block">
                      Phone number
                    </span>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-subtle" />
                      <input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) =>
                          setContact((c) => ({ ...c, phone: e.target.value }))
                        }
                        placeholder="+234 800 000 0000"
                        className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-border-light text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                  </label>
                  <div className="sm:col-span-2 flex justify-end">
                    <button
                      disabled={!canContinueContact}
                      onClick={() => setStage("delivery")}
                      className="h-11 px-6 rounded-full bg-primary-dark text-white text-sm font-bold inline-flex items-center gap-2 hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Continue to delivery
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <dl className="text-sm space-y-1 text-text-secondary">
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 text-text-subtle">Name</dt>
                    <dd className="font-medium text-primary-dark">{contact.name}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 text-text-subtle">Email</dt>
                    <dd className="font-medium text-primary-dark">{contact.email}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 text-text-subtle">Phone</dt>
                    <dd className="font-medium text-primary-dark">{contact.phone}</dd>
                  </div>
                </dl>
              )}
            </div>

            {/* Delivery */}
            {stageIndex >= 1 && (
              <div className="rounded-3xl bg-white border border-border-light p-6 lg:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading font-bold text-primary-dark text-lg inline-flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Delivery address
                  </h2>
                  {stage !== "delivery" && (
                    <button
                      onClick={() => setStage("delivery")}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {stage === "delivery" ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="sm:col-span-2 block">
                      <span className="text-xs font-semibold text-primary-dark mb-1.5 block">
                        Street address
                      </span>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-subtle" />
                        <input
                          value={delivery.address}
                          onChange={(e) =>
                            setDelivery((d) => ({
                              ...d,
                              address: e.target.value,
                            }))
                          }
                          placeholder="Street, estate, apartment"
                          className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-border-light text-sm focus:outline-none focus:border-primary"
                        />
                      </div>
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold text-primary-dark mb-1.5 block">
                        City
                      </span>
                      <select
                        value={delivery.city}
                        onChange={(e) =>
                          setDelivery((d) => ({ ...d, city: e.target.value }))
                        }
                        className="w-full h-11 px-4 rounded-xl bg-white border border-border-light text-sm focus:outline-none focus:border-primary"
                      >
                        {NIGERIAN_CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold text-primary-dark mb-1.5 block">
                        State
                      </span>
                      <input
                        value={delivery.state}
                        onChange={(e) =>
                          setDelivery((d) => ({ ...d, state: e.target.value }))
                        }
                        placeholder="Lagos"
                        className="w-full h-11 px-4 rounded-xl bg-white border border-border-light text-sm focus:outline-none focus:border-primary"
                      />
                    </label>
                    <label className="sm:col-span-2 block">
                      <span className="text-xs font-semibold text-primary-dark mb-1.5 block">
                        Delivery notes (optional)
                      </span>
                      <textarea
                        value={delivery.notes}
                        onChange={(e) =>
                          setDelivery((d) => ({ ...d, notes: e.target.value }))
                        }
                        rows={2}
                        placeholder="Gate code, landmark, delivery window"
                        className="w-full px-4 py-3 rounded-xl bg-white border border-border-light text-sm focus:outline-none focus:border-primary resize-none"
                      />
                    </label>
                    <div className="sm:col-span-2 flex items-center justify-between">
                      <button
                        onClick={() => setStage("contact")}
                        className="text-xs font-semibold text-text-secondary hover:text-primary inline-flex items-center gap-1.5"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back
                      </button>
                      <button
                        disabled={!canContinueDelivery}
                        onClick={() => setStage("payment")}
                        className="h-11 px-6 rounded-full bg-primary-dark text-white text-sm font-bold inline-flex items-center gap-2 hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Continue to payment
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <dl className="text-sm space-y-1 text-text-secondary">
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0 text-text-subtle">Address</dt>
                      <dd className="font-medium text-primary-dark">
                        {delivery.address}, {delivery.city}, {delivery.state}
                      </dd>
                    </div>
                    {delivery.notes && (
                      <div className="flex gap-2">
                        <dt className="w-20 shrink-0 text-text-subtle">Notes</dt>
                        <dd className="font-medium text-primary-dark">
                          {delivery.notes}
                        </dd>
                      </div>
                    )}
                  </dl>
                )}
              </div>
            )}

            {/* Payment */}
            {stage === "payment" && (
              <div className="rounded-3xl bg-white border border-border-light p-6 lg:p-8">
                <h2 className="font-heading font-bold text-primary-dark text-lg inline-flex items-center gap-2 mb-4">
                  <CreditCard className="h-4 w-4" />
                  Payment
                </h2>

                <div className="rounded-2xl bg-primary/5 border border-primary/15 p-4 flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-primary-dark text-sm">
                      Pay{" "}
                      <span className="text-primary">
                        {naira(totals.total)}
                      </span>{" "}
                      with Paystack
                    </p>
                    <p className="text-text-secondary text-xs leading-relaxed mt-1">
                      Click below to open the secure Paystack checkout. You can
                      pay by card, bank transfer, USSD, or QR. Your card details
                      never touch our servers.
                    </p>
                  </div>
                </div>

                {payError && (
                  <div className="mt-4 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{payError}</span>
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
                  <button
                    onClick={() => setStage("delivery")}
                    className="text-xs font-semibold text-text-secondary hover:text-primary inline-flex items-center gap-1.5"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back
                  </button>
                  <button
                    disabled={paying}
                    onClick={payWithPaystack}
                    className="h-12 px-7 rounded-full bg-primary-dark text-white text-sm font-bold inline-flex items-center gap-2 hover:bg-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {paying ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Opening Paystack…
                      </>
                    ) : (
                      <>
                        Pay {naira(totals.total)}
                        <Lock className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>

                <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-text-secondary">
                  <li className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    PCI-DSS secured by Paystack
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-primary" />
                    3-D Secure authentication
                  </li>
                  <li className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    Receipts emailed instantly
                  </li>
                </ul>
              </div>
            )}
          </section>

          {/* ─── Order summary ─────────────────────────────────────── */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 rounded-3xl bg-white border border-border-light overflow-hidden">
              <div className="px-6 py-5 border-b border-border-light">
                <h2 className="font-heading font-bold text-primary-dark text-base">
                  Order summary
                </h2>
                <p className="text-text-secondary text-xs mt-0.5">
                  {count} {count === 1 ? "item" : "items"} across{" "}
                  {itemsByStore.length}{" "}
                  {itemsByStore.length === 1 ? "store" : "stores"}
                </p>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {itemsByStore.map((group) => (
                  <div
                    key={group.storeSlug}
                    className="px-6 py-4 border-b border-border-light last:border-b-0"
                  >
                    <p className="inline-flex items-center gap-1.5 text-text-subtle text-[11px] uppercase tracking-wide font-semibold mb-3">
                      <StoreIcon className="h-3 w-3" />
                      {group.storeName}
                    </p>
                    <ul className="space-y-3">
                      {group.items.map((it) => (
                        <li
                          key={it.productId}
                          className="flex items-start gap-3"
                        >
                          <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden border border-border-light">
                            <img
                              src={it.image}
                              alt={it.name}
                              className="h-full w-full object-cover"
                            />
                            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary-dark text-white text-[10px] font-bold inline-flex items-center justify-center">
                              {it.quantity}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-heading font-bold text-primary-dark text-xs line-clamp-2">
                              {it.name}
                            </p>
                            <p className="text-text-subtle text-[11px]">
                              {naira(it.priceNaira)}
                            </p>
                          </div>
                          <p className="shrink-0 font-heading font-bold text-primary-dark text-xs">
                            {naira(it.priceNaira * it.quantity)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="px-6 py-5 border-t border-border-light space-y-2 text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span className="font-semibold text-primary-dark">
                    {naira(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Delivery</span>
                  <span className="font-semibold text-primary-dark">
                    {totals.deliveryFee === 0 ? "Free" : naira(totals.deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Platform fee</span>
                  <span className="font-semibold text-primary-dark">
                    {naira(totals.platformFee)}
                  </span>
                </div>
                <div className="h-px bg-border-light" />
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-primary-dark text-base">
                    Total
                  </span>
                  <span className="font-heading font-bold text-primary-dark text-xl">
                    {naira(totals.total)}
                  </span>
                </div>
                {totals.freeShip && subtotal > 0 && (
                  <p className="inline-flex items-center gap-1 text-xs text-primary font-semibold">
                    <Tag className="h-3 w-3" />
                    Free Lagos delivery unlocked
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MarketplaceCheckout;
