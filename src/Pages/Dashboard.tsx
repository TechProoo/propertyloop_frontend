import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Heart,
  MessageCircle,
  MapPin,
  Star,
  Phone,
  CheckCircle,
  ArrowRight,
  ArrowUpRight,
  X,
  Send,
  Search,
  Users,
  Wrench,
  Home,
  ShoppingCart,
  Package,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  Bed,
  Bath,
  ArrowLeft,
} from "lucide-react";
import Logo from "../assets/logo.png";
import { listings } from "../data/listings";
import { getAgentById } from "../data/agents";
import { products, getProductById } from "../data/products";
import { vendors } from "../data/vendors";
import { useAuth } from "../context/AuthContext";
import { useBookmarks } from "../context/BookmarkContext";
import BookmarkButton from "../components/ui/BookmarkButton";
import {
  getConversations,
  addMessage,
  seedDefaultConversations,
  type Conversation,
  type ChatMessage,
} from "../data/chat";

const ease = [0.23, 1, 0.32, 1] as const;

/* ─── Static Data ─── */
const myAgent = getAgentById("adebayo-johnson");

const navItems = [
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    label: "Overview",
    id: "overview",
  },
  {
    icon: <Heart className="w-5 h-5" />,
    label: "Bookmarks",
    id: "saved",
  },
  {
    icon: <Wrench className="w-5 h-5" />,
    label: "Vendors",
    id: "vendors",
  },
  {
    icon: <ShoppingCart className="w-5 h-5" />,
    label: "Marketplace",
    id: "marketplace",
  },
  {
    icon: <MessageCircle className="w-5 h-5" />,
    label: "Messages",
    id: "messages",
  },
  { icon: <Settings className="w-5 h-5" />, label: "Settings", id: "settings" },
];

const defaultConversations: Conversation[] = [
  {
    id: "conv-1",
    name: "Adebayo Johnson",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    role: "Agent",
    phone: "2348012345678",
    messages: [
      {
        sender: "them",
        text: "Good morning! I wanted to follow up on the Lekki property you viewed last week.",
        time: "Yesterday, 9:15 AM",
      },
      {
        sender: "you",
        text: "Hi Adebayo, yes I'm still very interested. Can we schedule another viewing?",
        time: "Yesterday, 10:02 AM",
      },
      {
        sender: "them",
        text: "Of course! The owner is available Thursday morning. Would 10am work for you?",
        time: "Yesterday, 10:30 AM",
      },
      {
        sender: "you",
        text: "Thursday at 10am works perfectly. See you then!",
        time: "Yesterday, 11:00 AM",
      },
      {
        sender: "them",
        text: "The viewing for the Lekki flat is confirmed for Thursday at 10am",
        time: "10 min ago",
      },
    ],
  },
  {
    id: "conv-2",
    name: "Chioma Okafor",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    role: "Agent",
    phone: "2348023456789",
    messages: [
      {
        sender: "them",
        text: "Hello! Based on your search preferences, I found some properties you might like.",
        time: "Today, 8:00 AM",
      },
      {
        sender: "you",
        text: "Hi Chioma! That sounds great, please share them",
        time: "Today, 8:45 AM",
      },
      {
        sender: "them",
        text: "I have 3 new listings in Victoria Island that match your budget",
        time: "2 hours ago",
      },
    ],
  },
  {
    id: "conv-3",
    name: "Chinedu Okonkwo",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    role: "Vendor",
    phone: "2348034567890",
    messages: [
      {
        sender: "you",
        text: "Hi Chinedu, when can you come fix the kitchen pipes?",
        time: "Mon, 2:00 PM",
      },
      {
        sender: "them",
        text: "I can come Wednesday morning. Will that work?",
        time: "Mon, 2:30 PM",
      },
      {
        sender: "you",
        text: "Wednesday morning is fine. Please come by 9am.",
        time: "Mon, 3:00 PM",
      },
      {
        sender: "them",
        text: "The plumbing work is complete. Please inspect and confirm.",
        time: "5 hours ago",
      },
    ],
  },
];

/* stats are computed inside the component to use bookmark counts */

/* ─── Component ─── */
const Dashboard = () => {
  const { user: authUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("overview");
  const [selectedConvo, setSelectedConvo] = useState("conv-1");
  const [vendorSearch, setVendorSearch] = useState("");
  const [vendorCategory, setVendorCategory] = useState("All Categories");
  const [msgFilter, setMsgFilter] = useState<"all" | "agents" | "vendors">(
    "all",
  );
  const [chatInput, setChatInput] = useState("");
  const [allConversations, setAllConversations] = useState<Conversation[]>([]);
  const [mobileChat, setMobileChat] = useState(false);

  // Seed defaults + load all conversations (including vendor chats from BookService)
  useEffect(() => {
    seedDefaultConversations(defaultConversations);
    const convos = getConversations();
    setAllConversations(Object.values(convos));
  }, [activeNav]); // refresh when switching to messages tab

  const { getByType, count: bookmarkCount } = useBookmarks();
  const displayName = authUser?.name || "Olumide Adeyemi";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const cartItems = JSON.parse(localStorage.getItem("pl_cart") || "[]") as {
    id: string;
    quantity: number;
  }[];
  const cartProducts = cartItems
    .map((item) => {
      const p = getProductById(item.id);
      return p ? { ...p, cartQty: item.quantity } : null;
    })
    .filter(Boolean);

  // Bookmarked items
  const savedPropertyIds = getByType("property");
  const savedVendorIds = getByType("service");
  const savedProductIds = getByType("product");
  const savedProperties = listings.filter((l) =>
    savedPropertyIds.includes(l.id),
  );
  const savedVendors = vendors.filter((vendor) =>
    savedVendorIds.includes(vendor.id),
  );
  const savedProducts = savedProductIds
    .map((id) => getProductById(id))
    .filter(Boolean);
  const vendorCategories = [
    "All Categories",
    ...Array.from(new Set(vendors.map((vendor) => vendor.category))).sort(),
  ];
  const filteredVendors = vendors.filter((vendor) => {
    const q = vendorSearch.trim().toLowerCase();
    const matchesQuery =
      !q ||
      vendor.name.toLowerCase().includes(q) ||
      vendor.category.toLowerCase().includes(q) ||
      vendor.location.toLowerCase().includes(q);
    const matchesCategory =
      vendorCategory === "All Categories" || vendor.category === vendorCategory;
    return matchesQuery && matchesCategory;
  });

  const stats = [
    {
      icon: <Heart className="w-5 h-5" />,
      value: String(bookmarkCount),
      label: "Saved Items",
      color: "text-red-400",
      bg: "bg-red-50",
    },
    {
      icon: <ShoppingCart className="w-5 h-5" />,
      value: String(cartItems.length),
      label: "Cart Items",
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f0eb] flex">
      {/* ─── Desktop Sidebar ─── */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 72 }}
        transition={{ duration: 0.3, ease }}
        className="hidden lg:flex flex-col shrink-0 h-screen sticky top-0 overflow-hidden"
        style={{ background: "hsl(160, 30%, 12%)" }}
      >
        <div
          className="flex items-center justify-between px-4 py-5 border-b"
          style={{ borderColor: "hsl(160, 20%, 22%)" }}
        >
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <Link to="/">
                <motion.img
                  key="logo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  src={Logo}
                  alt="PropertyLoop"
                  className="w-28"
                />
              </Link>
            )}
          </AnimatePresence>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 py-4 px-2 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`flex items-center gap-3 w-full rounded-xl transition-all duration-200 ${sidebarOpen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"} ${activeNav === item.id ? "text-white" : "text-white/50 hover:text-white/80 hover:bg-white/5"}`}
              style={
                activeNav === item.id
                  ? { background: "hsl(160, 25%, 20%)" }
                  : {}
              }
            >
              <div
                className={`shrink-0 ${activeNav === item.id ? "text-[hsl(142,71%,45%)]" : ""}`}
              >
                {item.icon}
              </div>
              {sidebarOpen && (
                <span className="text-sm font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}
              {sidebarOpen && item.id === "messages" && (
                <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-[hsl(142,71%,45%)] text-white">
                  5
                </span>
              )}
              {sidebarOpen &&
                item.id === "marketplace" &&
                cartItems.length > 0 && (
                  <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500 text-white">
                    {cartItems.length}
                  </span>
                )}
            </button>
          ))}
        </nav>

        <div
          className="px-3 py-4 border-t"
          style={{ borderColor: "hsl(160, 20%, 22%)" }}
        >
          <div
            className={`flex items-center gap-3 ${!sidebarOpen ? "justify-center" : ""}`}
          >
            <div className="w-9 h-9 rounded-full bg-[hsl(142,71%,45%)] flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {displayName}
                </p>
                <p className="text-white/40 text-[11px] truncate">
                  {authUser?.email || "olumide@email.com"}
                </p>
              </div>
            )}
            {sidebarOpen && (
              <button
                onClick={() => {
                  logout();
                  window.location.href = "/";
                }}
                className="text-white/40 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* ─── Mobile Sidebar ─── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease }}
              className="fixed left-0 top-0 bottom-0 w-65 z-50 lg:hidden flex flex-col"
              style={{ background: "hsl(160, 30%, 12%)" }}
            >
              <div
                className="flex items-center justify-between px-4 py-5 border-b"
                style={{ borderColor: "hsl(160, 20%, 22%)" }}
              >
                <img src={Logo} alt="PropertyLoop" className="w-28" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <nav className="flex-1 py-4 px-2 flex flex-col gap-1 overflow-y-auto">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveNav(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-xl transition-all duration-200 ${activeNav === item.id ? "text-white" : "text-white/50 hover:text-white/80 hover:bg-white/5"}`}
                    style={
                      activeNav === item.id
                        ? { background: "hsl(160, 25%, 20%)" }
                        : {}
                    }
                  >
                    <div
                      className={
                        activeNav === item.id ? "text-[hsl(142,71%,45%)]" : ""
                      }
                    >
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
              <div
                className="px-3 py-4 border-t"
                style={{ borderColor: "hsl(160, 20%, 22%)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[hsl(142,71%,45%)] flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {displayName}
                    </p>
                    <p className="text-white/40 text-[11px]">
                      {authUser?.email || "olumide@email.com"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── Main Content ─── */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/60 backdrop-blur-xl border-b border-white/40 px-6 py-3 flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 flex items-center justify-center text-primary-dark hover:bg-primary hover:text-white transition-all shadow-sm"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div>
              <h1 className="font-heading font-bold text-primary-dark text-lg inline-block px-2 py-0.5 rounded-md bg-primary/10">
                {navItems.find((n) => n.id === activeNav)?.label || "Overview"}
              </h1>
              <p className="text-text-subtle text-xs">
                Welcome back, {displayName.split(" ")[0]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="relative w-9 h-9 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 flex items-center justify-center text-text-secondary hover:bg-white transition-all shadow-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Page content */}
        <div className="p-6 lg:p-8">
          {/* ─── Overview ─── */}
          {activeNav === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
            >
              {/* Stats */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {stats.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3, ease }}
                    className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl ${s.bg} flex items-center justify-center ${s.color} mb-3`}
                    >
                      {s.icon}
                    </div>
                    <p className="font-heading font-bold text-primary-dark text-xl">
                      {s.value}
                    </p>
                    <p className="text-text-secondary text-xs mt-0.5">
                      {s.label}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col xl:flex-row gap-6">
                {/* Left */}
                <div className="flex-1 flex flex-col gap-6">
                  {/* Bookmarked Properties */}
                  <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                    <div className="px-6 py-5 border-b border-border-light flex items-center justify-between">
                      <h2 className="font-heading font-bold text-primary-dark text-base">
                        Bookmarked Properties ({savedProperties.length})
                      </h2>
                      <Link
                        to="/buy"
                        className="text-primary text-xs font-medium hover:underline"
                      >
                        Browse
                      </Link>
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                      {savedProperties.length > 0 ? (
                        savedProperties.slice(0, 3).map((listing) => (
                          <Link
                            key={listing.id}
                            to={`/property/${listing.id}`}
                            className="group flex gap-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl p-3 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
                          >
                            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative">
                              <img
                                src={listing.image}
                                alt={listing.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-full bg-primary/90 text-white text-[10px] font-medium">
                                {listing.type === "sale" ? "Sale" : "Rent"}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0 py-0.5">
                              <p className="font-heading font-bold text-primary-dark text-sm">
                                {listing.price}
                              </p>
                              <p className="text-primary-dark text-xs leading-snug mt-0.5 truncate">
                                {listing.title}
                              </p>
                              <p className="text-text-secondary text-xs mt-0.5 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />{" "}
                                {listing.location}
                              </p>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <Heart className="w-8 h-8 text-text-subtle mx-auto mb-2" />
                          <p className="text-text-secondary text-xs">
                            No bookmarked properties yet
                          </p>
                          <Link
                            to="/buy"
                            className="text-primary text-xs font-medium mt-1 inline-flex items-center gap-1"
                          >
                            Browse properties <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Saved Products */}
                  <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                    <div className="px-6 py-5 border-b border-border-light flex items-center justify-between">
                      <h2 className="font-heading font-bold text-primary-dark text-base">
                        Bookmarked Materials ({savedProducts.length})
                      </h2>
                      <Link
                        to="/marketplace"
                        className="text-primary text-xs font-medium hover:underline"
                      >
                        Browse
                      </Link>
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                      {savedProducts.length > 0 ? (
                        savedProducts.slice(0, 3).map((product) => (
                          <Link
                            key={product!.id}
                            to={`/product/${product!.id}`}
                            className="group flex gap-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl p-3 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
                          >
                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                              <img
                                src={product!.image}
                                alt={product!.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0 py-0.5">
                              <p className="font-heading font-bold text-primary-dark text-sm">
                                {product!.priceLabel}/{product!.unit}
                              </p>
                              <p className="text-primary-dark text-xs leading-snug mt-0.5 truncate">
                                {product!.name}
                              </p>
                              <p className="text-text-secondary text-xs mt-0.5">
                                {product!.supplier}
                              </p>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <Package className="w-8 h-8 text-text-subtle mx-auto mb-2" />
                          <p className="text-text-secondary text-xs">
                            No bookmarked materials yet
                          </p>
                          <Link
                            to="/marketplace"
                            className="text-primary text-xs font-medium mt-1 inline-flex items-center gap-1"
                          >
                            Browse materials <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="xl:w-90 shrink-0 flex flex-col gap-6">
                  {/* My Profile */}
                  <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white font-heading font-bold text-lg shadow-lg shadow-glow/30">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-bold text-primary-dark text-sm">
                          {displayName}
                        </p>
                        <p className="text-text-secondary text-xs">
                          {authUser?.email || "olumide@email.com"}
                        </p>
                        <p className="text-text-subtle text-[11px] mt-0.5">
                          Member since January 2026
                        </p>
                      </div>
                    </div>
                    <button className="w-full h-10 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm">
                      Edit Profile
                    </button>
                  </div>

                  {/* My Agent */}
                  {myAgent && (
                    <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6">
                      <h3 className="font-heading font-bold text-primary-dark text-sm mb-4">
                        My Agent
                      </h3>
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={myAgent.photo}
                          alt={myAgent.name}
                          className="w-12 h-12 rounded-full object-cover object-top border-2 border-white shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-heading font-bold text-primary-dark text-sm truncate">
                              {myAgent.name}
                            </p>
                            {myAgent.verified && (
                              <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                            )}
                          </div>
                          <p className="text-text-secondary text-xs">
                            {myAgent.agency}
                          </p>
                          <div className="flex items-center gap-3 text-text-secondary text-xs mt-1">
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-[#F5A623] fill-[#F5A623]" />{" "}
                              {myAgent.rating}
                            </span>
                            <span>{myAgent.listings} listings</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`tel:+${myAgent.phone}`}
                          className="flex-1 h-10 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5" /> Call
                        </a>
                        <a
                          href={`https://wa.me/${myAgent.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 h-10 rounded-full bg-[#25D366] text-white text-sm font-bold hover:bg-[#20bd5a] transition-colors inline-flex items-center justify-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                        </a>
                      </div>
                      <Link
                        to={`/agent/${myAgent.id}`}
                        className="block text-center text-primary text-xs font-medium mt-3 hover:underline"
                      >
                        View full profile
                      </Link>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6">
                    <h3 className="font-heading font-bold text-primary-dark text-sm mb-4">
                      Quick Actions
                    </h3>
                    <div className="flex flex-col gap-2.5">
                      {[
                        {
                          icon: <Search className="w-4 h-4" />,
                          label: "Browse Properties",
                          href: "/buy",
                        },
                        {
                          icon: <Users className="w-4 h-4" />,
                          label: "Find an Agent",
                          href: "/find-agent",
                        },
                        {
                          icon: <Wrench className="w-4 h-4" />,
                          label: "Book a Service",
                          href: "/services",
                        },
                        {
                          icon: <ShoppingCart className="w-4 h-4" />,
                          label: "Browse Materials",
                          href: "/marketplace",
                        },
                      ].map((action) => (
                        <Link
                          key={action.label}
                          to={action.href}
                          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 hover:border-primary hover:bg-white/70 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            {action.icon}
                          </div>
                          <span className="flex-1 font-heading font-medium text-primary-dark text-sm">
                            {action.label}
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-text-subtle" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Marketplace Cart */}
                  <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading font-bold text-primary-dark text-sm flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-primary" /> Cart
                      </h3>
                      <Link
                        to="/marketplace"
                        className="text-primary text-xs font-medium hover:underline"
                      >
                        Browse
                      </Link>
                    </div>
                    {cartProducts.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        {cartProducts.slice(0, 2).map((p) => (
                          <Link
                            key={p!.id}
                            to={`/product/${p!.id}`}
                            className="flex items-center gap-3 bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl p-3 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all"
                          >
                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                              <img
                                src={p!.image}
                                alt={p!.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-primary-dark text-xs font-medium truncate">
                                {p!.name}
                              </p>
                              <p className="text-text-secondary text-[11px]">
                                {p!.priceLabel}/{p!.unit} × {p!.cartQty}
                              </p>
                            </div>
                          </Link>
                        ))}
                        <Link
                          to="/cart"
                          className="w-full h-10 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" /> View Cart (
                          {cartItems.length})
                        </Link>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Package className="w-8 h-8 text-text-subtle mx-auto mb-2" />
                        <p className="text-text-secondary text-xs">
                          No items in cart
                        </p>
                        <Link
                          to="/marketplace"
                          className="text-primary text-xs font-medium mt-1 inline-flex items-center gap-1"
                        >
                          Browse materials <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Bookmarks Panel ─── */}
          {activeNav === "saved" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
              className="flex flex-col gap-6"
            >
              {/* Bookmarked Properties — For Sale */}
              {(() => {
                const saleSaved = savedProperties.filter(
                  (l) => l.type === "sale",
                );
                return (
                  <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                    <div className="px-6 py-5 border-b border-border-light flex items-center justify-between">
                      <h2 className="font-heading font-bold text-primary-dark text-base flex items-center gap-2">
                        <Home className="w-4 h-4 text-primary" /> For Sale (
                        {saleSaved.length})
                      </h2>
                      <Link
                        to="/buy"
                        className="text-primary text-xs font-medium hover:underline flex items-center gap-1"
                      >
                        View More <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                    {saleSaved.length > 0 ? (
                      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {saleSaved.map((listing) => (
                          <Link
                            key={listing.id}
                            to={`/property/${listing.id}`}
                            className="group bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
                          >
                            <div className="h-32 overflow-hidden relative">
                              <img
                                src={listing.image}
                                alt={listing.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <BookmarkButton
                                id={listing.id}
                                type="property"
                                className="absolute top-2 right-2"
                              />
                            </div>
                            <div className="p-3">
                              <p className="font-heading font-bold text-primary-dark text-sm">
                                {listing.price}
                              </p>
                              <p className="text-primary-dark text-xs leading-snug mt-0.5 truncate">
                                {listing.title}
                              </p>
                              <p className="text-text-secondary text-xs mt-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />{" "}
                                {listing.location}
                              </p>
                              <div className="flex items-center gap-3 text-text-secondary text-[11px] mt-1.5">
                                <span className="flex items-center gap-1">
                                  <Bed className="w-3 h-3" /> {listing.beds}{" "}
                                  Beds
                                </span>
                                <span className="flex items-center gap-1">
                                  <Bath className="w-3 h-3" /> {listing.baths}{" "}
                                  Baths
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <Heart className="w-8 h-8 text-text-subtle mx-auto mb-2" />
                        <p className="text-text-secondary text-sm">
                          No saved sale properties
                        </p>
                        <Link
                          to="/buy"
                          className="text-primary text-xs font-medium mt-1 inline-flex items-center gap-1"
                        >
                          Browse properties <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Bookmarked Properties — For Rent */}
              {(() => {
                const rentSaved = savedProperties.filter(
                  (l) => l.type === "rent" || l.type === "shortlet",
                );
                return (
                  <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                    <div className="px-6 py-5 border-b border-border-light flex items-center justify-between">
                      <h2 className="font-heading font-bold text-primary-dark text-base flex items-center gap-2">
                        <Home className="w-4 h-4 text-blue-500" /> For Rent (
                        {rentSaved.length})
                      </h2>
                      <Link
                        to="/rent"
                        className="text-primary text-xs font-medium hover:underline flex items-center gap-1"
                      >
                        View More <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                    {rentSaved.length > 0 ? (
                      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {rentSaved.map((listing) => (
                          <Link
                            key={listing.id}
                            to={`/property/${listing.id}`}
                            className="group bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
                          >
                            <div className="h-32 overflow-hidden relative">
                              <img
                                src={listing.image}
                                alt={listing.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <BookmarkButton
                                id={listing.id}
                                type="property"
                                className="absolute top-2 right-2"
                              />
                            </div>
                            <div className="p-3">
                              <p className="font-heading font-bold text-primary-dark text-sm">
                                {listing.price}
                                {listing.period && (
                                  <span className="text-text-secondary font-normal">
                                    /{listing.period}
                                  </span>
                                )}
                              </p>
                              <p className="text-primary-dark text-xs leading-snug mt-0.5 truncate">
                                {listing.title}
                              </p>
                              <p className="text-text-secondary text-xs mt-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />{" "}
                                {listing.location}
                              </p>
                              <div className="flex items-center gap-3 text-text-secondary text-[11px] mt-1.5">
                                <span className="flex items-center gap-1">
                                  <Bed className="w-3 h-3" /> {listing.beds}{" "}
                                  Beds
                                </span>
                                <span className="flex items-center gap-1">
                                  <Bath className="w-3 h-3" /> {listing.baths}{" "}
                                  Baths
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <Heart className="w-8 h-8 text-text-subtle mx-auto mb-2" />
                        <p className="text-text-secondary text-sm">
                          No saved rental properties
                        </p>
                        <Link
                          to="/rent"
                          className="text-primary text-xs font-medium mt-1 inline-flex items-center gap-1"
                        >
                          Browse rentals <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Bookmarked Vendors */}
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="px-6 py-5 border-b border-border-light flex items-center justify-between">
                  <h2 className="font-heading font-bold text-primary-dark text-base flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-[#F5A623]" /> Vendors (
                    {savedVendors.length})
                  </h2>
                  <Link
                    to="/services"
                    className="text-primary text-xs font-medium hover:underline flex items-center gap-1"
                  >
                    View More <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                {savedVendors.length > 0 ? (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {savedVendors.map((vendor) => (
                      <Link
                        key={vendor.id}
                        to={`/book-service/${vendor.id}`}
                        className="group bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl p-4 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={vendor.avatar}
                            alt={vendor.name}
                            className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-heading font-bold text-primary-dark text-sm truncate">
                                {vendor.name}
                              </p>
                              {vendor.verified && (
                                <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                              )}
                            </div>
                            <p className="text-text-secondary text-xs mt-0.5">
                              {vendor.category}
                            </p>
                            <p className="text-text-secondary text-[11px] mt-1 flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3" /> {vendor.location}
                            </p>
                            <div className="flex items-center gap-2 text-text-secondary text-[11px] mt-1">
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-[#F5A623] fill-[#F5A623]" />
                                {vendor.rating}
                              </span>
                              <span>{vendor.jobs} jobs</span>
                            </div>
                          </div>
                          <BookmarkButton
                            id={vendor.id}
                            type="service"
                            size="sm"
                            className="shrink-0"
                          />
                        </div>
                        <p className="font-heading font-bold text-primary-dark text-sm mt-3">
                          {vendor.price}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Wrench className="w-8 h-8 text-text-subtle mx-auto mb-2" />
                    <p className="text-text-secondary text-sm">
                      No bookmarked vendors
                    </p>
                    <Link
                      to="/services"
                      className="text-primary text-xs font-medium mt-1 inline-flex items-center gap-1"
                    >
                      Browse vendors <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Bookmarked Materials */}
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="px-6 py-5 border-b border-border-light flex items-center justify-between">
                  <h2 className="font-heading font-bold text-primary-dark text-base flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-500" /> Marketplace (
                    {savedProducts.length})
                  </h2>
                  <Link
                    to="/marketplace"
                    className="text-primary text-xs font-medium hover:underline flex items-center gap-1"
                  >
                    View More <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                {savedProducts.length > 0 ? (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {savedProducts.map((product) => (
                      <Link
                        key={product!.id}
                        to={`/product/${product!.id}`}
                        className="group bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <div className="h-28 overflow-hidden">
                          <img
                            src={product!.image}
                            alt={product!.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-3">
                          <p className="font-heading font-bold text-primary-dark text-sm">
                            {product!.priceLabel}/{product!.unit}
                          </p>
                          <p className="text-primary-dark text-xs leading-snug mt-0.5 truncate">
                            {product!.name}
                          </p>
                          <p className="text-text-secondary text-xs mt-0.5">
                            {product!.supplier}
                          </p>
                          <div className="flex items-center gap-1 text-text-secondary text-[11px] mt-1">
                            <Star className="w-3 h-3 text-[#F5A623] fill-[#F5A623]" />{" "}
                            {product!.rating} ({product!.reviews} reviews)
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Package className="w-8 h-8 text-text-subtle mx-auto mb-2" />
                    <p className="text-text-secondary text-sm">
                      No saved materials
                    </p>
                    <Link
                      to="/marketplace"
                      className="text-primary text-xs font-medium mt-1 inline-flex items-center gap-1"
                    >
                      Browse materials <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ─── Marketplace Panel ─── */}
          {activeNav === "vendors" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
              className="flex flex-col gap-6"
            >
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-7">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div>
                    <h2 className="font-heading font-bold text-primary-dark text-lg">
                      Service Vendors
                    </h2>
                    <p className="text-text-secondary text-xs mt-0.5">
                      {filteredVendors.length} vendor
                      {filteredVendors.length === 1 ? "" : "s"} found
                    </p>
                  </div>
                  <Link
                    to="/services"
                    className="h-9 px-4 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-1.5"
                  >
                    View Full Service Loop{" "}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                    <input
                      type="text"
                      value={vendorSearch}
                      onChange={(e) => setVendorSearch(e.target.value)}
                      placeholder="Search vendors by name, category, or location"
                      className="w-full h-11 pl-11 pr-4 rounded-full bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <select
                    value={vendorCategory}
                    onChange={(e) => setVendorCategory(e.target.value)}
                    className="h-11 px-4 rounded-full bg-white/80 border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors appearance-none"
                  >
                    {vendorCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {(vendorSearch.trim() ||
                  vendorCategory !== "All Categories") && (
                  <button
                    onClick={() => {
                      setVendorSearch("");
                      setVendorCategory("All Categories");
                    }}
                    className="mt-3 h-8 px-4 rounded-full bg-white border border-border-light text-text-secondary text-xs font-medium hover:text-primary hover:border-primary transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {filteredVendors.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredVendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="group bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <div className="flex gap-4">
                        <img
                          src={vendor.avatar}
                          alt={vendor.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-heading font-bold text-primary-dark text-sm truncate">
                              {vendor.name}
                            </p>
                            {vendor.verified && (
                              <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                            )}
                          </div>
                          <p className="text-text-secondary text-xs mt-0.5">
                            {vendor.category}
                          </p>
                          <div className="flex items-center gap-3 text-text-secondary text-xs mt-1">
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-[#F5A623] fill-[#F5A623]" />
                              {vendor.rating}
                            </span>
                            <span>{vendor.jobs} jobs</span>
                            <span className="flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3" />
                              {vendor.location}
                            </span>
                          </div>
                        </div>
                        <BookmarkButton
                          id={vendor.id}
                          type="service"
                          size="sm"
                          className="shrink-0"
                        />
                      </div>

                      <p className="font-heading font-bold text-primary-dark text-base mt-4">
                        {vendor.price}
                      </p>
                      <p className="text-text-secondary text-xs mt-1 line-clamp-2">
                        {vendor.bio}
                      </p>

                      <div className="flex items-center gap-2 mt-4">
                        <Link
                          to={`/book-service/${vendor.id}`}
                          className="flex-1 h-10 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-1.5"
                        >
                          Book Service <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <a
                          href={`https://wa.me/${vendor.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-10 px-4 rounded-full border border-border-light bg-white/80 text-primary-dark text-xs font-medium hover:bg-primary hover:text-white hover:border-primary transition-all"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] py-14 px-6 text-center">
                  <Wrench className="w-10 h-10 text-text-subtle mx-auto mb-3" />
                  <h3 className="font-heading font-bold text-primary-dark text-lg">
                    No vendors found
                  </h3>
                  <p className="text-text-secondary text-sm mt-1">
                    Try another search term or change the category filter.
                  </p>
                  <button
                    onClick={() => {
                      setVendorSearch("");
                      setVendorCategory("All Categories");
                    }}
                    className="mt-4 h-9 px-5 rounded-full bg-white border border-border-light text-primary-dark text-xs font-medium hover:bg-primary hover:text-white hover:border-primary transition-all"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ─── Marketplace Panel ─── */}
          {activeNav === "marketplace" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
              className="flex flex-col gap-6"
            >
              {/* Cart Summary */}
              {cartProducts.length > 0 && (
                <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                  <div className="px-6 py-5 border-b border-border-light flex items-center justify-between">
                    <h2 className="font-heading font-bold text-primary-dark text-base flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-primary" /> Your
                      Cart ({cartItems.length})
                    </h2>
                    <Link
                      to="/cart"
                      className="text-primary text-xs font-medium hover:underline flex items-center gap-1"
                    >
                      Go to Cart <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                    {cartProducts.map((p) => (
                      <Link
                        key={p!.id}
                        to={`/product/${p!.id}`}
                        className="flex items-center gap-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl p-3 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                          <img
                            src={p!.image}
                            alt={p!.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-primary-dark text-sm font-medium truncate">
                            {p!.name}
                          </p>
                          <p className="text-text-secondary text-xs">
                            {p!.priceLabel}/{p!.unit} x {p!.cartQty}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Featured Products */}
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="px-6 py-5 border-b border-border-light flex items-center justify-between">
                  <h2 className="font-heading font-bold text-primary-dark text-base flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" /> Featured
                    Materials
                  </h2>
                  <Link
                    to="/marketplace"
                    className="text-primary text-xs font-medium hover:underline flex items-center gap-1"
                  >
                    View All <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {products.slice(0, 6).map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      className="group bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <div className="h-28 overflow-hidden relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-primary/90 text-white text-[10px] font-medium">
                          {product.category}
                        </span>
                        <BookmarkButton
                          id={product.id}
                          type="product"
                          className="absolute top-2 right-2"
                        />
                      </div>
                      <div className="p-3">
                        <p className="font-heading font-bold text-primary-dark text-sm">
                          {product.priceLabel}/{product.unit}
                        </p>
                        <p className="text-primary-dark text-xs leading-snug mt-0.5 truncate">
                          {product.name}
                        </p>
                        <p className="text-text-secondary text-xs mt-0.5">
                          {product.supplier}
                        </p>
                        <div className="flex items-center gap-1 text-text-secondary text-[11px] mt-1">
                          <Star className="w-3 h-3 text-[#F5A623] fill-[#F5A623]" />{" "}
                          {product.rating} ({product.reviews})
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Saved Materials */}
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="px-6 py-5 border-b border-border-light flex items-center justify-between">
                  <h2 className="font-heading font-bold text-primary-dark text-base flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-400" /> Saved Materials (
                    {savedProducts.length})
                  </h2>
                  <Link
                    to="/marketplace"
                    className="text-primary text-xs font-medium hover:underline flex items-center gap-1"
                  >
                    Browse More <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                {savedProducts.length > 0 ? (
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {savedProducts.map((product) => (
                      <Link
                        key={product!.id}
                        to={`/product/${product!.id}`}
                        className="group bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <div className="h-28 overflow-hidden relative">
                          <img
                            src={product!.image}
                            alt={product!.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <BookmarkButton
                            id={product!.id}
                            type="product"
                            className="absolute top-2 right-2"
                          />
                        </div>
                        <div className="p-3">
                          <p className="font-heading font-bold text-primary-dark text-sm">
                            {product!.priceLabel}/{product!.unit}
                          </p>
                          <p className="text-primary-dark text-xs leading-snug mt-0.5 truncate">
                            {product!.name}
                          </p>
                          <p className="text-text-secondary text-xs mt-0.5">
                            {product!.supplier}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Package className="w-8 h-8 text-text-subtle mx-auto mb-2" />
                    <p className="text-text-secondary text-sm">
                      No saved materials yet
                    </p>
                    <Link
                      to="/marketplace"
                      className="text-primary text-xs font-medium mt-1 inline-flex items-center gap-1"
                    >
                      Browse materials <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ─── Messages Panel ─── */}
          {activeNav === "messages" &&
            (() => {
              const filtered =
                msgFilter === "all"
                  ? allConversations
                  : allConversations.filter((c) =>
                      msgFilter === "agents"
                        ? c.role === "Agent"
                        : c.role === "Vendor",
                    );
              const activeConvo =
                allConversations.find((c) => c.id === selectedConvo) ||
                allConversations[0];
              if (!activeConvo) return null;
              const activeMessages = activeConvo.messages || [];

              const handleSend = () => {
                if (!chatInput.trim()) return;
                const msg: ChatMessage = {
                  sender: "you",
                  text: chatInput.trim(),
                  time: "Just now",
                };
                addMessage(activeConvo.id, msg);
                setAllConversations((prev) =>
                  prev.map((c) =>
                    c.id === activeConvo.id
                      ? { ...c, messages: [...c.messages, msg] }
                      : c,
                  ),
                );
                setChatInput("");
              };

              return (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease }}
                >
                  <div
                    className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden"
                    style={{ height: "calc(100vh - 140px)" }}
                  >
                    <div className="flex h-full">
                      {/* ── Left: Conversation List ── */}
                      <div
                        className={`${mobileChat ? "hidden md:flex" : "flex"} flex-col w-full md:w-85 lg:w-90 shrink-0 border-r border-white/30 bg-white/30 backdrop-blur-sm`}
                      >
                        {/* Filter Tabs */}
                        <div className="px-4 pt-4 pb-3 border-b border-white/30">
                          <div className="flex gap-2">
                            {(["all", "agents", "vendors"] as const).map(
                              (f) => (
                                <button
                                  key={f}
                                  onClick={() => setMsgFilter(f)}
                                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${msgFilter === f ? "bg-primary text-white shadow-sm" : "bg-white/50 backdrop-blur-sm border border-white/40 text-text-secondary hover:bg-white"}`}
                                >
                                  {f === "all"
                                    ? "All"
                                    : f === "agents"
                                      ? "Agents"
                                      : "Vendors"}
                                </button>
                              ),
                            )}
                          </div>
                        </div>

                        {/* Conversation Rows */}
                        <div className="flex-1 overflow-y-auto">
                          {filtered.map((convo) => {
                            const lastMsg =
                              convo.messages[convo.messages.length - 1];
                            return (
                              <button
                                key={convo.id}
                                onClick={() => {
                                  setSelectedConvo(convo.id);
                                  setMobileChat(true);
                                }}
                                className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-all hover:bg-white/40 ${selectedConvo === convo.id ? "bg-white/50 backdrop-blur-sm border-l-2 border-primary" : "border-l-2 border-transparent"}`}
                              >
                                <div className="relative shrink-0">
                                  <img
                                    src={convo.avatar}
                                    alt={convo.name}
                                    className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <p className="text-sm truncate font-medium text-primary-dark">
                                        {convo.name}
                                      </p>
                                      <span
                                        className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${convo.role === "Agent" ? "bg-primary/10 text-primary" : "bg-[#FFF8ED] text-[#F5A623]"}`}
                                      >
                                        {convo.role}
                                      </span>
                                    </div>
                                    {lastMsg && (
                                      <span className="text-text-subtle text-[10px] shrink-0">
                                        {lastMsg.time}
                                      </span>
                                    )}
                                  </div>
                                  {lastMsg && (
                                    <p className="text-xs mt-0.5 truncate text-text-secondary">
                                      {lastMsg.text}
                                    </p>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                          {filtered.length === 0 && (
                            <div className="text-center py-12">
                              <MessageCircle className="w-8 h-8 text-text-subtle mx-auto mb-2" />
                              <p className="text-text-secondary text-sm">
                                No conversations
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ── Right: Chat View ── */}
                      <div
                        className={`${mobileChat ? "flex" : "hidden md:flex"} flex-col flex-1 min-w-0`}
                      >
                        {/* Chat Header */}
                        <div className="px-5 py-3.5 border-b border-white/30 bg-white/20 backdrop-blur-sm flex items-center gap-3">
                          <button
                            onClick={() => setMobileChat(false)}
                            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary hover:bg-white/80 transition-colors shrink-0"
                          >
                            <ArrowLeft className="w-4 h-4" />
                          </button>
                          <img
                            src={activeConvo.avatar}
                            alt={activeConvo.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-heading font-bold text-primary-dark text-sm truncate">
                                {activeConvo.name}
                              </p>
                              <span
                                className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${activeConvo.role === "Agent" ? "bg-primary/10 text-primary" : "bg-[#FFF8ED] text-[#F5A623]"}`}
                              >
                                {activeConvo.role}
                              </span>
                            </div>
                            <p className="text-text-subtle text-[11px]">
                              Active now
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={`tel:+${activeConvo.phone}`}
                              className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`https://wa.me/${activeConvo.phone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-lg bg-[#25D366]/10 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
                          {activeMessages.map((msg, i) => (
                            <div
                              key={i}
                              className={`flex ${msg.sender === "you" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${msg.sender === "you" ? "bg-primary text-white rounded-br-md shadow-sm" : "bg-white/70 backdrop-blur-sm border border-white/40 text-primary-dark rounded-bl-md shadow-sm"}`}
                              >
                                <p className="text-sm leading-relaxed">
                                  {msg.text}
                                </p>
                                <p
                                  className={`text-[10px] mt-1 ${msg.sender === "you" ? "text-white/60" : "text-text-subtle"}`}
                                >
                                  {msg.time}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Input */}
                        <div className="px-4 py-3 border-t border-white/30 bg-white/20 backdrop-blur-sm">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              onKeyDown={(e) =>
                                e.key === "Enter" && handleSend()
                              }
                              placeholder="Type a message..."
                              className="flex-1 h-10 px-4 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 text-sm text-primary-dark placeholder:text-text-subtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                            <button
                              onClick={handleSend}
                              disabled={!chatInput.trim()}
                              className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-sm"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })()}

          {/* ─── Other tabs placeholder ─── */}
          {activeNav !== "overview" &&
            activeNav !== "properties" &&
            activeNav !== "saved" &&
            activeNav !== "vendors" &&
            activeNav !== "marketplace" &&
            activeNav !== "messages" &&
            activeNav !== "settings" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease }}
              >
                <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    {navItems.find((n) => n.id === activeNav)?.icon}
                  </div>
                  <h2 className="font-heading font-bold text-primary-dark text-xl">
                    {navItems.find((n) => n.id === activeNav)?.label}
                  </h2>
                  <p className="text-text-secondary text-sm mt-2">
                    This section is coming soon
                  </p>
                  <button
                    onClick={() => setActiveNav("overview")}
                    className="mt-4 h-10 px-6 rounded-full border border-white/40 bg-white/60 backdrop-blur-sm text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all"
                  >
                    Back to Overview
                  </button>
                </div>
              </motion.div>
            )}

          {/* ─── Settings Panel ─── */}
          {activeNav === "settings" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
              className="flex flex-col gap-6"
            >
              {/* Profile */}
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                <h3 className="font-heading font-bold text-primary-dark text-base mb-6">
                  Profile
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    {
                      label: "Full Name",
                      value: authUser?.name || "",
                      type: "text",
                    },
                    {
                      label: "Email",
                      value: authUser?.email || "",
                      type: "email",
                    },
                    { label: "Phone", value: "+234 800 000 0000", type: "tel" },
                    {
                      label: "Location",
                      value: "Lagos, Nigeria",
                      type: "text",
                    },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-sm font-medium text-primary-dark mb-1.5">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        defaultValue={field.value}
                        className="w-full h-11 px-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 text-sm text-primary-dark placeholder:text-text-subtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <button className="h-10 px-6 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-glow/30">
                    Save Changes
                  </button>
                  <button
                    onClick={() => setActiveNav("overview")}
                    className="h-10 px-6 rounded-full border border-white/40 bg-white/60 backdrop-blur-sm text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                <h3 className="font-heading font-bold text-primary-dark text-base mb-6">
                  Preferences
                </h3>
                <div className="flex flex-col gap-4">
                  {[
                    {
                      label: "Email Notifications",
                      desc: "Get notified about new listings and updates",
                    },
                    {
                      label: "SMS Alerts",
                      desc: "Receive text alerts for saved-search matches",
                    },
                    {
                      label: "Price Drop Alerts",
                      desc: "Get alerted when bookmarked properties reduce in price",
                    },
                  ].map((pref, idx) => (
                    <label
                      key={pref.label}
                      className="flex items-center justify-between py-3 border-b border-border-light last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-primary-dark">
                          {pref.label}
                        </p>
                        <p className="text-xs text-text-secondary mt-0.5">
                          {pref.desc}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked={idx === 0}
                        className="w-5 h-5 rounded border-border-light text-primary focus:ring-primary/20 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Account / Danger zone */}
              <div className="bg-white/70 backdrop-blur-md border border-red-100 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                <h3 className="font-heading font-bold text-red-600 text-base mb-2">
                  Account
                </h3>
                <p className="text-text-secondary text-sm mb-4">
                  Log out of your account.
                </p>
                <button
                  onClick={() => {
                    logout();
                    window.location.href = "/";
                  }}
                  className="h-10 px-6 rounded-full border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
