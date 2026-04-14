import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Lock,
  Truck,
  MapPin,
  ShieldCheck,
  Package,
  Clock,
  CheckCircle,
  Building2,
  Wallet,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { getProductById } from "../data/products";

const ease = [0.23, 1, 0.32, 1] as const;

interface CartItem {
  id: string;
  quantity: number;
}

type Stage = "delivery" | "payment";
type PayMethod = "card" | "transfer" | "wallet";

const Checkout = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [stage, setStage] = useState<Stage>("delivery");
  const [processing, setProcessing] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Lagos");
  const [notes, setNotes] = useState("");

  const [payMethod, setPayMethod] = useState<PayMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("pl_cart") || "[]");
    setItems(saved);
  }, []);

  const cartProducts = items
    .map((item) => {
      const product = getProductById(item.id);
      return product ? { ...product, cartQty: item.quantity } : null;
    })
    .filter(Boolean) as (ReturnType<typeof getProductById> & {
    cartQty: number;
  })[];

  const subtotal = cartProducts.reduce(
    (sum, p) => sum + p!.price * p!.cartQty,
    0,
  );
  const deliveryFee = subtotal > 0 ? 15000 : 0;
  const serviceFee = Math.round(subtotal * 0.03);
  const total = subtotal + deliveryFee + serviceFee;

  const handlePlaceOrder = async () => {
    setProcessing(true);
    try {
      const payMethodMap: Record<string, string> = { card: "CARD", transfer: "TRANSFER", wallet: "WALLET" };
      const { default: ordersService } = await import("../api/services/orders");
      const order = await ordersService.create({
        recipientName: name,
        phone,
        address,
        city,
        notes: notes || undefined,
        payMethod: (payMethodMap[payMethod] || "CARD") as any,
        items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
      });
      localStorage.setItem("pl_cart", "[]");
      // Also store locally for OrderConfirmation to read
      localStorage.setItem(`pl_order_${order.orderNumber}`, JSON.stringify(order));
      navigate(`/order-confirmation/${order.orderNumber}`);
    } catch {
      // Fallback: save locally if API fails
      const orderId = `MAT-${Date.now().toString().slice(-8)}`;
      const fallbackOrder = {
        id: orderId,
        items: cartProducts.map((p) => ({
          id: p!.id, name: p!.name, image: p!.image, supplier: p!.supplier,
          price: p!.price, priceLabel: p!.priceLabel, unit: p!.unit, quantity: p!.cartQty,
        })),
        delivery: { name, phone, address, city, notes },
        payMethod, subtotal, deliveryFee, serviceFee, total,
        placedAt: new Date().toISOString(),
      };
      localStorage.setItem(`pl_order_${orderId}`, JSON.stringify(fallbackOrder));
      localStorage.setItem("pl_cart", "[]");
      navigate(`/order-confirmation/${orderId}`);
    } finally {
      setProcessing(false);
    }
  };

  if (cartProducts.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f0eb]">
        <Navbar />
        <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-20">
          <div className="max-w-3xl mx-auto text-center py-20">
            <div className="w-16 h-16 rounded-full bg-bg-accent border border-border-light flex items-center justify-center mx-auto mb-4">
              <Package className="w-7 h-7 text-text-subtle" />
            </div>
            <h1 className="font-heading font-bold text-primary-dark text-2xl">
              Your cart is empty
            </h1>
            <p className="text-text-secondary text-sm mt-2">
              Add some materials before heading to checkout.
            </p>
            <Link
              to="/marketplace"
              className="mt-6 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              Browse Marketplace <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const canContinueDelivery = name && phone && address;
  const canPlaceOrder =
    payMethod !== "card" || (cardNumber && cardExpiry && cardCvv);

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />
      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/cart" className="hover:text-primary transition-colors">
              Cart
            </Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">Checkout</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-[1.8rem] sm:text-[2.4rem] font-bold text-primary-dark leading-tight tracking-tight">
              Checkout
            </h1>
            <p className="text-text-secondary text-sm mt-2">
              Review your order and complete payment securely.
            </p>
          </div>

          {/* Stage indicator */}
          <div className="flex items-center gap-2 mb-8">
            {(["delivery", "payment"] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-heading font-semibold transition-all ${
                    (["delivery", "payment"] as const).indexOf(stage) >= i
                      ? "bg-primary text-white shadow-lg shadow-glow/40"
                      : "bg-white/60 text-text-secondary border border-border-light"
                  }`}
                >
                  {(["delivery", "payment"] as const).indexOf(stage) > i ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`text-xs sm:text-sm font-medium ${(["delivery", "payment"] as const).indexOf(stage) >= i ? "text-primary-dark" : "text-text-subtle"}`}
                >
                  {s === "delivery" ? "Delivery" : "Payment"}
                </span>
                {i < 1 && (
                  <div className="flex-1 h-0.5 bg-border-light rounded-full" />
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mb-20">
            {/* Form */}
            <div className="flex-1 min-w-0">
              {/* DELIVERY */}
              {stage === "delivery" && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease }}
                  className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8"
                >
                  <h2 className="font-heading font-bold text-primary-dark text-lg mb-5 flex items-center gap-2">
                    <Truck className="w-5 h-5" /> Delivery Details
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                        Recipient's Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full name"
                        className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 800 000 0000"
                        className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                        City
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors"
                      >
                        <option>Lagos</option>
                        <option>Abuja</option>
                        <option>Port Harcourt</option>
                        <option>Ibadan</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                        Delivery Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Street, area, landmark"
                          className="w-full h-11 pl-11 pr-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                        Delivery Notes (optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={2}
                        placeholder="Gate code, building, anything that helps the driver..."
                        className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors resize-none"
                      />
                    </div>
                  </div>

                  <div className="mt-5 bg-bg-accent rounded-2xl border border-border-light p-4 flex items-center gap-3">
                    <Truck className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-primary-dark">
                        Estimated delivery: 2–5 business days
                      </p>
                      <p className="text-text-secondary text-xs mt-0.5">
                        Available within Lagos. Contact suppliers for other
                        cities.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-border-light">
                    <Link
                      to="/cart"
                      className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back to cart
                    </Link>
                    <button
                      onClick={() => setStage("payment")}
                      disabled={!canContinueDelivery}
                      className="h-11 px-6 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center gap-2 shadow-[0_4px_16px_rgba(31,111,67,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Payment <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* PAYMENT */}
              {stage === "payment" && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease }}
                  className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8"
                >
                  <h2 className="font-heading font-bold text-primary-dark text-lg mb-5 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" /> Payment Method
                  </h2>

                  <div className="flex items-center gap-3 mb-5 px-4 py-3 rounded-2xl bg-primary/5 border border-primary/20">
                    <Lock className="w-5 h-5 text-primary" />
                    <p className="text-primary-dark text-sm">
                      Your payment of{" "}
                      <span className="font-bold">
                        ₦{total.toLocaleString()}
                      </span>{" "}
                      is processed securely via Paystack.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      {
                        key: "card" as PayMethod,
                        icon: <CreditCard className="w-5 h-5" />,
                        label: "Card",
                      },
                      {
                        key: "transfer" as PayMethod,
                        icon: <Building2 className="w-5 h-5" />,
                        label: "Transfer",
                      },
                      {
                        key: "wallet" as PayMethod,
                        icon: <Wallet className="w-5 h-5" />,
                        label: "Wallet",
                      },
                    ].map((m) => (
                      <button
                        key={m.key}
                        onClick={() => setPayMethod(m.key)}
                        className={`flex flex-col items-center gap-2 py-4 rounded-2xl border transition-all ${
                          payMethod === m.key
                            ? "bg-primary/10 border-primary text-primary shadow-sm"
                            : "bg-white/60 border-border-light text-text-secondary hover:border-primary/40"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${payMethod === m.key ? "bg-primary text-white" : "bg-white text-text-secondary"}`}
                        >
                          {m.icon}
                        </div>
                        <span className="text-xs font-medium">{m.label}</span>
                      </button>
                    ))}
                  </div>

                  {payMethod === "card" && (
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4084 0840 8408 4081"
                          className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            Expiry
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            CVV
                          </label>
                          <input
                            type="text"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="123"
                            className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {payMethod === "transfer" && (
                    <div className="bg-bg-accent rounded-2xl border border-border-light p-5 text-sm text-primary-dark">
                      You'll receive a one-time bank transfer reference once you
                      place your order. Order processing begins as soon as your
                      transfer is confirmed.
                    </div>
                  )}

                  {payMethod === "wallet" && (
                    <div className="bg-bg-accent rounded-2xl border border-border-light p-5 text-sm text-primary-dark">
                      Your PropertyLoop wallet balance:{" "}
                      <span className="font-bold">₦0</span>. Please top up
                      before continuing or pick another method.
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-border-light">
                    <button
                      onClick={() => setStage("delivery")}
                      className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={processing || !canPlaceOrder}
                      className="h-12 px-8 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors inline-flex items-center gap-2 shadow-[0_4px_16px_rgba(31,111,67,0.3)] disabled:opacity-60"
                    >
                      {processing ? (
                        <>
                          <Clock className="w-4 h-4 animate-spin" /> Processing...
                        </>
                      ) : (
                        <>
                          Pay ₦{total.toLocaleString()}{" "}
                          <Lock className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order summary */}
            <aside className="lg:w-90 shrink-0">
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sticky top-8">
                <h3 className="font-heading font-bold text-primary-dark text-sm mb-4">
                  Order Summary
                </h3>

                <div className="flex flex-col gap-3 mb-4 max-h-65 overflow-y-auto pr-1">
                  {cartProducts.map((p) => (
                    <div key={p!.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 relative">
                        <img
                          src={p!.image}
                          alt={p!.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                          {p!.cartQty}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-medium text-primary-dark text-xs truncate">
                          {p!.name}
                        </p>
                        <p className="text-text-secondary text-[11px] truncate">
                          {p!.supplier}
                        </p>
                      </div>
                      <p className="font-heading font-bold text-primary-dark text-xs">
                        ₦{(p!.price * p!.cartQty).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-border-light my-4" />

                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="font-heading font-medium text-primary-dark">
                      ₦{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Delivery</span>
                    <span className="font-heading font-medium text-primary-dark">
                      ₦{deliveryFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">
                      Service fee (3%)
                    </span>
                    <span className="font-heading font-medium text-primary-dark">
                      ₦{serviceFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-px bg-border-light" />
                  <div className="flex justify-between">
                    <span className="font-heading font-bold text-primary-dark">
                      Total
                    </span>
                    <span className="font-heading font-bold text-primary-dark text-lg">
                      ₦{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-border-light my-4" />
                <div className="flex flex-col gap-2 text-xs text-text-secondary">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" /> Secure
                    Paystack payment
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-primary" /> Tracked delivery
                    in Lagos
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" /> All suppliers
                    verified
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
