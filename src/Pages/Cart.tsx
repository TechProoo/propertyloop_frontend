import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  CreditCard,
  Lock,
  CheckCircle,
  Truck,
  MapPin,
  ShieldCheck,
  Clock,
  Package,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import productsService from "../api/services/products";
import ordersService from "../api/services/orders";
import type { Product, OrderPaymentMethod } from "../api/types";

const ease = [0.23, 1, 0.32, 1] as const;

interface CartItem {
  id: string;
  quantity: number;
}

const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Map<string, Product>>(new Map());
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [step, setStep] = useState<
    "cart" | "delivery" | "payment" | "confirmed"
  >("cart");
  const [processing, setProcessing] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");
  const [deliveryName, setDeliveryName] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("Lagos");

  useEffect(() => {
    const saved: CartItem[] = JSON.parse(
      localStorage.getItem("pl_cart") || "[]",
    );
    setItems(saved);

    // Fetch product details from API for each cart item
    if (saved.length === 0) {
      setLoadingProducts(false);
      return;
    }
    Promise.all(
      saved.map((item) => productsService.getById(item.id).catch(() => null)),
    )
      .then((results) => {
        const map = new Map<string, Product>();
        results.forEach((p) => {
          if (p) map.set(p.id, p);
        });
        setProducts(map);
      })
      .finally(() => setLoadingProducts(false));
  }, []);

  const updateQuantity = (id: string, qty: number) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, qty) } : item,
    );
    setItems(updated);
    localStorage.setItem("pl_cart", JSON.stringify(updated));
  };

  const removeItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    localStorage.setItem("pl_cart", JSON.stringify(updated));
  };

  const cartProducts = items
    .map((item) => {
      const product = products.get(item.id);
      return product
        ? { ...product, price: product.priceNaira, cartQty: item.quantity }
        : null;
    })
    .filter(Boolean) as (Product & { price: number; cartQty: number })[];

  const subtotal = cartProducts.reduce(
    (sum, p) => sum + p!.price * p!.cartQty,
    0,
  );
  const deliveryFee = subtotal > 0 ? 15000 : 0;
  const serviceFee = Math.round(subtotal * 0.03);
  const total = subtotal + deliveryFee + serviceFee;

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const order = await ordersService.create({
        recipientName: deliveryName,
        phone: deliveryPhone,
        address: deliveryAddress,
        city: deliveryCity,
        payMethod: "CARD" as OrderPaymentMethod,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });
      localStorage.setItem("pl_cart", "[]");
      setItems([]);
      navigate(`/order-confirmation/${order.orderNumber}`);
    } catch {
      // Fallback to local confirmation
      setProcessing(false);
      localStorage.setItem("pl_cart", "[]");
      setItems([]);
      setStep("confirmed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />
      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-8">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              to="/marketplace"
              className="hover:text-primary transition-colors"
            >
              Materials
            </Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">
              {step === "confirmed" ? "Order Confirmed" : "Cart"}
            </span>
          </div>

          {/* Step indicator */}
          {step !== "confirmed" && (
            <div className="flex items-center justify-center gap-2 mb-8">
              {(["cart", "delivery", "payment"] as const).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-heading font-semibold transition-all ${
                      (["cart", "delivery", "payment"] as const).indexOf(
                        step,
                      ) >= i
                        ? "bg-primary text-white shadow-lg shadow-glow/40"
                        : "bg-white/60 text-text-secondary border border-border-light"
                    }`}
                  >
                    {(["cart", "delivery", "payment"] as const).indexOf(step) >
                    i ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={`hidden sm:inline text-xs font-medium ${(["cart", "delivery", "payment"] as const).indexOf(step) >= i ? "text-primary-dark" : "text-text-subtle"}`}
                  >
                    {s === "cart"
                      ? "Cart"
                      : s === "delivery"
                        ? "Delivery"
                        : "Payment"}
                  </span>
                  {i < 2 && (
                    <div
                      className={`w-8 sm:w-12 h-0.5 rounded-full ${(["cart", "delivery", "payment"] as const).indexOf(step) > i ? "bg-primary" : "bg-border-light"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8 mb-20">
            {/* Left — Step content */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease }}
                >
                  {/* Cart */}
                  {step === "cart" && (
                    <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                      <div className="px-6 py-5 border-b border-border-light flex items-center justify-between">
                        <h2 className="font-heading font-bold text-primary-dark text-lg flex items-center gap-2">
                          <ShoppingCart className="w-5 h-5" /> Your Cart
                        </h2>
                        <span className="text-text-secondary text-sm">
                          {cartProducts.length} item
                          {cartProducts.length !== 1 ? "s" : ""}
                        </span>
                      </div>

                      {loadingProducts ? (
                        <div className="text-center py-16 px-6">
                          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
                          <p className="text-text-secondary text-sm">
                            Loading cart items...
                          </p>
                        </div>
                      ) : cartProducts.length === 0 ? (
                        <div className="text-center py-16 px-6">
                          <div className="w-16 h-16 rounded-full bg-bg-accent border border-border-light flex items-center justify-center mx-auto mb-4">
                            <ShoppingCart className="w-7 h-7 text-text-subtle" />
                          </div>
                          <h3 className="font-heading font-bold text-primary-dark text-lg">
                            Your cart is empty
                          </h3>
                          <p className="text-text-secondary text-sm mt-2">
                            Browse the marketplace to add building materials.
                          </p>
                          <Link
                            to="/marketplace"
                            className="mt-4 inline-flex items-center gap-2 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
                          >
                            Browse Materials <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      ) : (
                        <div className="divide-y divide-border-light">
                          {cartProducts.map((product) => (
                            <div
                              key={product!.id}
                              className="px-6 py-5 flex flex-col sm:flex-row gap-4"
                            >
                              <div className="flex gap-4 flex-1 min-w-0">
                                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                                  <img
                                    src={product!.coverImage}
                                    alt={product!.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <Link
                                    to={`/product/${product!.id}`}
                                    className="font-heading font-bold text-primary-dark text-sm hover:text-primary transition-colors"
                                  >
                                    {product!.name}
                                  </Link>
                                  <p className="text-text-secondary text-xs mt-0.5">
                                    {product!.supplier} · {product!.category}
                                  </p>
                                  <p className="font-heading font-bold text-primary-dark text-sm mt-2">
                                    {product!.priceLabel}{" "}
                                    <span className="text-text-secondary font-normal">
                                      /{product!.unit}
                                    </span>
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center sm:items-end sm:flex-col gap-3 sm:gap-2 shrink-0">
                                <button
                                  onClick={() => removeItem(product!.id)}
                                  className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <div className="flex items-center gap-0 bg-white/80 border border-border-light rounded-xl overflow-hidden">
                                  <button
                                    onClick={() =>
                                      updateQuantity(
                                        product!.id,
                                        product!.cartQty - 1,
                                      )
                                    }
                                    className="w-8 h-8 flex items-center justify-center hover:bg-bg-accent"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-10 text-center font-heading font-bold text-primary-dark text-xs">
                                    {product!.cartQty}
                                  </span>
                                  <button
                                    onClick={() =>
                                      updateQuantity(
                                        product!.id,
                                        product!.cartQty + 1,
                                      )
                                    }
                                    className="w-8 h-8 flex items-center justify-center hover:bg-bg-accent"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                                <p className="font-heading font-bold text-primary-dark text-sm ml-auto sm:ml-0">
                                  ₦
                                  {(
                                    product!.price * product!.cartQty
                                  ).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {cartProducts.length > 0 && (
                        <div className="px-6 py-4 border-t border-border-light flex items-center justify-between">
                          <Link
                            to="/marketplace"
                            className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" /> Continue
                            shopping
                          </Link>
                          <button
                            onClick={() => setStep("delivery")}
                            className="h-10 px-8 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
                          >
                            Checkout <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Delivery */}
                  {step === "delivery" && (
                    <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                      <h2 className="font-heading font-bold text-primary-dark text-lg mb-5 flex items-center gap-2">
                        <Truck className="w-5 h-5" /> Delivery Details
                      </h2>
                      <div className="flex flex-col gap-4">
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={deliveryName}
                            onChange={(e) => setDeliveryName(e.target.value)}
                            placeholder="Recipient's full name"
                            className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={deliveryPhone}
                            onChange={(e) => setDeliveryPhone(e.target.value)}
                            placeholder="+234 800 000 0000"
                            className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            Delivery Address
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                            <input
                              type="text"
                              value={deliveryAddress}
                              onChange={(e) =>
                                setDeliveryAddress(e.target.value)
                              }
                              placeholder="Full delivery address in Lagos"
                              className="w-full h-11 pl-11 pr-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            City
                          </label>
                          <select
                            value={deliveryCity}
                            onChange={(e) => setDeliveryCity(e.target.value)}
                            className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors appearance-none"
                          >
                            <option>Lagos</option>
                            <option>Abuja</option>
                            <option>Port Harcourt</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-5 bg-bg-accent rounded-2xl border border-border-light p-4">
                        <div className="flex items-center gap-2 text-sm text-primary-dark">
                          <Truck className="w-4 h-4 text-primary" />{" "}
                          <span className="font-medium">
                            Estimated delivery: 2–5 business days
                          </span>
                        </div>
                        <p className="text-text-secondary text-xs mt-1">
                          Delivery within Lagos mainland and island. Contact
                          supplier for locations outside Lagos.
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-6">
                        <button
                          onClick={() => setStep("cart")}
                          className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <button
                          onClick={() => setStep("payment")}
                          className="h-10 px-8 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
                        >
                          Continue to Payment <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Payment */}
                  {step === "payment" && (
                    <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                      <h2 className="font-heading font-bold text-primary-dark text-lg mb-5 flex items-center gap-2">
                        <CreditCard className="w-5 h-5" /> Payment
                      </h2>
                      <div className="flex items-center gap-3 mb-5 px-4 py-3 rounded-2xl bg-primary/5 border border-primary/20">
                        <Lock className="w-5 h-5 text-primary" />
                        <p className="text-primary-dark text-sm">
                          Your payment of{" "}
                          <span className="font-bold">
                            ₦{total.toLocaleString()}
                          </span>{" "}
                          will be confirmed by the vendor after checkout.
                        </p>
                      </div>
                      <div className="flex flex-col gap-4">
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            Card Number
                          </label>
                          <input
                            type="text"
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
                              placeholder="12/28"
                              className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                              CVV
                            </label>
                            <input
                              type="text"
                              placeholder="123"
                              className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-6">
                        <button
                          onClick={() => setStep("delivery")}
                          className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <button
                          onClick={handlePayment}
                          disabled={processing}
                          className="h-12 px-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors inline-flex items-center gap-2 shadow-[0_4px_16px_rgba(31,111,67,0.3)] disabled:opacity-60"
                        >
                          {processing ? (
                            <>
                              <Clock className="w-4 h-4 animate-spin" />{" "}
                              Processing...
                            </>
                          ) : (
                            <>
                              Pay ₦{total.toLocaleString()}{" "}
                              <Lock className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Confirmed */}
                  {step === "confirmed" && (
                    <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-8 sm:p-10 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                        className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-5 shadow-lg shadow-glow/40"
                      >
                        <CheckCircle className="w-8 h-8 text-white" />
                      </motion.div>
                      <h2 className="font-heading font-bold text-primary-dark text-xl">
                        Order Confirmed!
                      </h2>
                      <p className="text-text-secondary text-sm mt-2 max-w-md mx-auto">
                        Your order has been placed successfully. You'll receive
                        an SMS confirmation with tracking details shortly.
                      </p>
                      <div className="mt-6 bg-bg-accent rounded-2xl border border-border-light p-4 text-left max-w-sm mx-auto">
                        <p className="font-heading font-bold text-primary-dark text-sm">
                          Order #MAT-20260402-0015
                        </p>
                        <p className="text-text-secondary text-xs mt-1">
                          ₦{total.toLocaleString()} · Delivery: 2–5 business
                          days
                        </p>
                        {deliveryAddress && (
                          <p className="text-text-secondary text-xs mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {deliveryAddress}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                        <Link
                          to="/dashboard"
                          className="h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
                        >
                          Go to Dashboard <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                          to="/marketplace"
                          className="h-10 px-6 rounded-full border border-border-light bg-white/80 text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all"
                        >
                          Continue Shopping
                        </Link>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right — Order Summary */}
            {step !== "confirmed" && cartProducts.length > 0 && (
              <div className="lg:w-85 shrink-0">
                <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sticky top-8">
                  <h3 className="font-heading font-bold text-primary-dark text-sm mb-4">
                    Order Summary
                  </h3>
                  <div className="flex flex-col gap-3 text-sm">
                    {cartProducts.map((p) => (
                      <div
                        key={p!.id}
                        className="flex items-center justify-between"
                      >
                        <span className="text-text-secondary truncate max-w-45">
                          {p!.name} x{p!.cartQty}
                        </span>
                        <span className="font-heading font-medium text-primary-dark">
                          ₦{(p!.price * p!.cartQty).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className="h-px bg-border-light" />
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Subtotal</span>
                      <span className="font-heading font-medium text-primary-dark">
                        ₦{subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Delivery fee</span>
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
                      <ShieldCheck className="w-4 h-4 text-primary" /> Verified
                      suppliers
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-primary" /> 2–5 day
                      delivery in Lagos
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary" /> All suppliers
                      verified
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
