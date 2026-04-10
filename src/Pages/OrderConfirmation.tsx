import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Phone,
  Calendar,
  Download,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Mail,
  Clock,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";

const ease = [0.23, 1, 0.32, 1] as const;

interface OrderItem {
  id: string;
  name: string;
  image: string;
  supplier: string;
  price: number;
  priceLabel: string;
  unit: string;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  delivery: {
    name: string;
    phone: string;
    address: string;
    city: string;
    notes?: string;
  };
  payMethod: string;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
  placedAt: string;
}

const OrderConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!id) return;
    const stored = localStorage.getItem(`pl_order_${id}`);
    if (stored) {
      try {
        setOrder(JSON.parse(stored));
      } catch {
        /* ignore */
      }
    }
  }, [id]);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f5f0eb]">
        <Navbar />
        <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-20">
          <div className="max-w-3xl mx-auto text-center py-20">
            <div className="w-16 h-16 rounded-full bg-bg-accent border border-border-light flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-7 h-7 text-text-subtle" />
            </div>
            <h1 className="font-heading font-bold text-primary-dark text-2xl">
              Order not found
            </h1>
            <p className="text-text-secondary text-sm mt-2">
              We couldn't find the order you're looking for. It may have
              expired or never existed.
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

  const placedDate = new Date(order.placedAt);
  const eta = new Date(placedDate.getTime() + 5 * 24 * 60 * 60 * 1000);
  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-NG", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />
      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              to="/marketplace"
              className="hover:text-primary transition-colors"
            >
              Marketplace
            </Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">
              Order Confirmation
            </span>
          </div>

          {/* Hero confirmation card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-8 sm:p-12 mb-6 text-center relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/5" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-primary/5" />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 20 }}
              className="relative w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-6 shadow-[0_8px_24px_rgba(31,111,67,0.35)]"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="relative font-heading text-[1.8rem] sm:text-[2.4rem] font-bold text-primary-dark leading-tight tracking-tight">
              Order confirmed!
            </h1>
            <p className="relative text-text-secondary text-sm sm:text-base mt-3 max-w-md mx-auto">
              Thanks {order.delivery.name.split(" ")[0]} — your payment was
              successful and your order is on its way.
            </p>

            <div className="relative inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-6 px-5 py-3 rounded-2xl bg-bg-accent border border-border-light">
              <div className="flex items-center gap-2 text-sm">
                <Package className="w-4 h-4 text-primary" />
                <span className="font-heading font-bold text-primary-dark">
                  Order #{order.id}
                </span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-border-light" />
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Calendar className="w-4 h-4" />
                {formatDate(placedDate)}
              </div>
            </div>

            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <button className="h-11 px-6 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center gap-2 shadow-[0_4px_16px_rgba(31,111,67,0.3)]">
                <Download className="w-4 h-4" /> Download receipt
              </button>
              <Link
                to="/dashboard"
                className="h-11 px-6 rounded-full border border-border-light bg-white/80 text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all inline-flex items-center gap-2"
              >
                Go to dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Delivery + payment summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease }}
              className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6"
            >
              <h2 className="font-heading font-bold text-primary-dark text-sm mb-4 flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" /> Delivery
              </h2>
              <div className="flex flex-col gap-2.5 text-sm">
                <div className="flex items-start gap-2 text-text-secondary">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-text-subtle" />
                  <div>
                    <p className="font-medium text-primary-dark">
                      {order.delivery.name}
                    </p>
                    <p className="text-xs">
                      {order.delivery.address}, {order.delivery.city}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-text-secondary text-xs">
                  <Phone className="w-3.5 h-3.5 text-text-subtle" />
                  {order.delivery.phone}
                </div>
                <div className="h-px bg-border-light my-1" />
                <div className="flex items-center gap-2 text-primary-dark text-xs">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>
                    Estimated arrival:{" "}
                    <span className="font-bold">{formatDate(eta)}</span>
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease }}
              className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6"
            >
              <h2 className="font-heading font-bold text-primary-dark text-sm mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" /> Payment
              </h2>
              <div className="flex flex-col gap-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Method</span>
                  <span className="font-medium text-primary-dark capitalize">
                    {order.payMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="font-medium text-primary-dark">
                    ₦{order.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Delivery</span>
                  <span className="font-medium text-primary-dark">
                    ₦{order.deliveryFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Service fee</span>
                  <span className="font-medium text-primary-dark">
                    ₦{order.serviceFee.toLocaleString()}
                  </span>
                </div>
                <div className="h-px bg-border-light my-1" />
                <div className="flex justify-between">
                  <span className="font-heading font-bold text-primary-dark">
                    Total paid
                  </span>
                  <span className="font-heading font-bold text-primary text-lg">
                    ₦{order.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Items */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease }}
            className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8 mb-6"
          >
            <h2 className="font-heading font-bold text-primary-dark text-sm mb-5 flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" /> Items in this order
              <span className="ml-auto text-text-secondary font-normal text-xs">
                {order.items.length} item
                {order.items.length !== 1 ? "s" : ""}
              </span>
            </h2>
            <div className="divide-y divide-border-light">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="py-4 first:pt-0 last:pb-0 flex items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.id}`}
                      className="font-heading font-bold text-primary-dark text-sm hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-text-secondary text-xs mt-0.5">
                      {item.supplier}
                    </p>
                    <p className="text-text-subtle text-xs mt-1">
                      {item.priceLabel} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-heading font-bold text-primary-dark text-sm shrink-0">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* What's next */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25, ease }}
            className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8 mb-20"
          >
            <h2 className="font-heading font-bold text-primary-dark text-sm mb-5">
              What happens next
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: <Mail className="w-4 h-4" />,
                  title: "Confirmation email",
                  desc: "Receipt and order details on the way.",
                },
                {
                  icon: <Package className="w-4 h-4" />,
                  title: "Supplier prepares",
                  desc: "Suppliers package within 24 hours.",
                },
                {
                  icon: <Truck className="w-4 h-4" />,
                  title: "Tracked delivery",
                  desc: `Arriving by ${formatDate(eta)}.`,
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-bg-accent border border-border-light"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    {s.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-primary-dark text-xs">
                      {s.title}
                    </p>
                    <p className="text-text-secondary text-xs mt-1 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
