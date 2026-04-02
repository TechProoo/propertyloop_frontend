import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Star,
  Phone,
  MessageCircle,
  CheckCircle,
  ShieldCheck,
  Package,
  Truck,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { getProductById, products } from "../data/products";

const ease = [0.23, 1, 0.32, 1] as const;

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = getProductById(id || "");
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f5f0eb]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-6">
          <div className="w-20 h-20 rounded-full bg-bg-accent border border-border-light flex items-center justify-center mb-6"><Package className="w-8 h-8 text-text-subtle" /></div>
          <h1 className="font-heading font-bold text-primary-dark text-2xl mb-2">Product not found</h1>
          <Link to="/marketplace" className="mt-4 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors inline-flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back to Marketplace</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const similar = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3);
  if (similar.length < 3) {
    const more = products.filter((p) => p.id !== product.id && p.category !== product.category).slice(0, 3 - similar.length);
    similar.push(...more);
  }

  const subtotal = product.price * quantity;

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("pl_cart") || "[]");
    const existing = cart.findIndex((item: { id: string }) => item.id === product.id);
    if (existing >= 0) {
      cart[existing].quantity += quantity;
    } else {
      cart.push({ id: product.id, quantity });
    }
    localStorage.setItem("pl_cart", JSON.stringify(cart));
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />
      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/marketplace" className="hover:text-primary transition-colors">Materials</Link>
            <span>/</span>
            <span className="text-primary-dark font-medium truncate max-w-50">{product.name}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mb-20">
            {/* Left — Image + Details */}
            <div className="flex-1">
              {/* Image */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden mb-6">
                <div className="h-75 sm:h-100 overflow-hidden">
                  <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
                </div>
                {product.images.length > 1 && (
                  <div className="flex gap-2 p-3">
                    {product.images.map((img, i) => (
                      <button key={i} onClick={() => setActiveImage(i)} className={`h-16 w-24 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${activeImage === i ? "border-primary shadow-lg" : "border-transparent opacity-60 hover:opacity-100"}`}>
                        <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Description */}
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4, ease }} className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8 mb-6">
                <h2 className="font-heading font-bold text-primary-dark text-lg mb-4">Product Description</h2>
                <p className="text-text-secondary text-sm leading-relaxed">{product.description}</p>
              </motion.div>

              {/* Specs */}
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4, ease }} className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8 mb-6">
                <h2 className="font-heading font-bold text-primary-dark text-lg mb-4">Specifications</h2>
                <div className="grid grid-cols-2 gap-3">
                  {product.specs.map((s) => (
                    <div key={s.label} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/60 border border-border-light">
                      <span className="text-text-secondary text-sm">{s.label}</span>
                      <span className="ml-auto font-heading font-medium text-primary-dark text-sm">{s.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right — Purchase panel */}
            <div className="lg:w-100 shrink-0">
              {/* Product info + buy */}
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4, ease }} className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 mb-6 sticky top-8">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{product.category}</span>
                <h1 className="font-heading font-bold text-primary-dark text-xl mt-3">{product.name}</h1>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-text-secondary text-sm">{product.supplier}</span>
                  {product.verified && <CheckCircle className="w-4 h-4 text-primary" />}
                </div>
                <p className="text-text-secondary text-sm mt-1 flex items-center gap-1"><MapPin className="w-4 h-4" /> {product.location}</p>

                <div className="flex items-center gap-3 mt-3 text-sm text-text-secondary">
                  <span className="flex items-center gap-1"><Star className="w-4 h-4 text-[#F5A623] fill-[#F5A623]" /> {product.rating}</span>
                  <span>{product.reviews} reviews</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${product.inStock ? "bg-primary/10 text-primary" : "bg-red-50 text-red-500"}`}>{product.inStock ? "In Stock" : "Out of Stock"}</span>
                </div>

                <div className="h-px bg-border-light my-4" />

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <p className="font-heading font-bold text-primary-dark text-2xl">{product.priceLabel}</p>
                  <span className="text-text-secondary text-sm">/ {product.unit}</span>
                </div>
                <p className="text-text-subtle text-xs mt-1">{product.minOrder}</p>

                <div className="h-px bg-border-light my-4" />

                {/* Quantity */}
                <div>
                  <label className="text-xs font-heading font-semibold text-primary-dark mb-2 block">Quantity ({product.unit}s)</label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0 bg-white/80 border border-border-light rounded-2xl overflow-hidden">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-11 h-11 flex items-center justify-center text-primary-dark hover:bg-bg-accent transition-colors"><Minus className="w-4 h-4" /></button>
                      <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-16 h-11 text-center font-heading font-bold text-primary-dark text-sm bg-transparent outline-none border-x border-border-light" />
                      <button onClick={() => setQuantity(quantity + 1)} className="w-11 h-11 flex items-center justify-center text-primary-dark hover:bg-bg-accent transition-colors"><Plus className="w-4 h-4" /></button>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-text-subtle text-xs">Subtotal</p>
                      <p className="font-heading font-bold text-primary-dark text-lg">₦{subtotal.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Add to Cart */}
                <button onClick={handleAddToCart} className="mt-5 w-full h-12 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(31,111,67,0.3)]">
                  <ShoppingCart className="w-4 h-4" /> Add to Cart — ₦{subtotal.toLocaleString()}
                </button>

                {/* Contact supplier */}
                <div className="flex gap-2 mt-3">
                  <a href={`tel:+${product.phone}`} className="flex-1 h-10 rounded-full bg-white/80 border border-border-light text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all inline-flex items-center justify-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Call
                  </a>
                  <a href={`https://wa.me/${product.phone}?text=Hi, I'm interested in ${product.name} on PropertyLoop.`} target="_blank" rel="noopener noreferrer" className="flex-1 h-10 rounded-full bg-[#25D366] text-white text-sm font-medium hover:bg-[#20bd5a] transition-colors inline-flex items-center justify-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                </div>

                <div className="h-px bg-border-light my-4" />

                <div className="flex flex-col gap-2 text-xs text-text-secondary">
                  <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-primary" /> Delivery: 2–5 business days within Lagos</div>
                  <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> Verified supplier · Quality guaranteed</div>
                  <div className="flex items-center gap-2"><Package className="w-4 h-4 text-primary" /> Bulk orders available · Contact supplier</div>
                </div>
              </motion.div>

              {/* Similar Products */}
              {similar.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4, ease }} className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                  <div className="px-6 py-5 border-b border-border-light">
                    <h2 className="font-heading font-bold text-primary-dark text-lg">Similar Products</h2>
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                    {similar.map((s) => (
                      <Link key={s.id} to={`/product/${s.id}`} className="group flex gap-4 bg-white/60 border border-border-light rounded-2xl p-3 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300">
                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                          <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 min-w-0 py-0.5">
                          <p className="font-heading font-bold text-primary-dark text-sm">{s.priceLabel}/{s.unit}</p>
                          <p className="text-primary-dark text-xs leading-snug mt-0.5 truncate">{s.name}</p>
                          <p className="text-text-secondary text-xs mt-0.5">{s.supplier}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="px-4 pb-4">
                    <Link to="/marketplace" className="w-full h-10 rounded-full bg-white/80 border border-border-light text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 inline-flex items-center justify-center gap-2">
                      Browse all materials <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
