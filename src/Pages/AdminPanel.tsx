import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Home,
  ShoppingCart,
  Shield,
  Settings,
  Search,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { useAuth } from "../context/AuthContext";

const ease = [0.23, 1, 0.32, 1] as const;

type AdminTab = "overview" | "users" | "listings" | "orders" | "disputes";

/* Mock data for admin panel — will be replaced with real API when backend admin endpoints are added */
const mockUsers = [
  {
    id: "1",
    name: "Adeola Ogunleye",
    email: "adeola@email.com",
    role: "BUYER",
    status: "active",
    joined: "2024-11-15",
    avatar: "",
  },
  {
    id: "2",
    name: "Chukwu Emmanuel",
    email: "chukwu@email.com",
    role: "AGENT",
    status: "active",
    joined: "2024-10-20",
    avatar: "",
  },
  {
    id: "3",
    name: "Fatima Abubakar",
    email: "fatima@email.com",
    role: "VENDOR",
    status: "active",
    joined: "2024-12-01",
    avatar: "",
  },
  {
    id: "4",
    name: "Olumide Bankole",
    email: "olumide@email.com",
    role: "BUYER",
    status: "suspended",
    joined: "2025-01-05",
    avatar: "",
  },
  {
    id: "5",
    name: "Grace Nwankwo",
    email: "grace@email.com",
    role: "AGENT",
    status: "active",
    joined: "2025-01-15",
    avatar: "",
  },
  {
    id: "6",
    name: "Yusuf Mohammed",
    email: "yusuf@email.com",
    role: "VENDOR",
    status: "pending",
    joined: "2025-02-01",
    avatar: "",
  },
];

const mockListings = [
  {
    id: "1",
    title: "3 Bed Apartment, Lekki Phase 1",
    agent: "Chukwu Emmanuel",
    price: 75000000,
    status: "active",
    views: 1240,
    type: "SALE",
  },
  {
    id: "2",
    title: "Studio Flat, Victoria Island",
    agent: "Grace Nwankwo",
    price: 35000000,
    status: "pending_review",
    views: 0,
    type: "SALE",
  },
  {
    id: "3",
    title: "5 Bed Duplex, Ikoyi",
    agent: "Chukwu Emmanuel",
    price: 250000000,
    status: "active",
    views: 3420,
    type: "SALE",
  },
  {
    id: "4",
    title: "2 Bed Shortlet, Oniru",
    agent: "Grace Nwankwo",
    price: 85000,
    status: "active",
    views: 890,
    type: "SHORTLET",
  },
  {
    id: "5",
    title: "4 Bed Semi-Detached, Ajah",
    agent: "Chukwu Emmanuel",
    price: 45000000,
    status: "flagged",
    views: 670,
    type: "SALE",
  },
];

const mockOrders = [
  {
    id: "ORD-001",
    buyer: "Adeola Ogunleye",
    items: 3,
    total: 45200,
    status: "delivered",
    date: "2025-01-20",
  },
  {
    id: "ORD-002",
    buyer: "Fatima Abubakar",
    items: 1,
    total: 18500,
    status: "processing",
    date: "2025-02-01",
  },
  {
    id: "ORD-003",
    buyer: "Olumide Bankole",
    items: 2,
    total: 32000,
    status: "shipped",
    date: "2025-02-05",
  },
  {
    id: "ORD-004",
    buyer: "Adeola Ogunleye",
    items: 1,
    total: 12000,
    status: "cancelled",
    date: "2025-02-10",
  },
];

const mockDisputes = [
  {
    id: "DSP-001",
    title: "Plumbing repair incomplete",
    buyer: "Adeola Ogunleye",
    vendor: "Fatima Abubakar",
    amount: 85000,
    status: "open",
    filed: "2025-02-01",
  },
  {
    id: "DSP-002",
    title: "Painting job quality issue",
    buyer: "Olumide Bankole",
    vendor: "Yusuf Mohammed",
    amount: 120000,
    status: "resolved",
    filed: "2025-01-15",
  },
  {
    id: "DSP-003",
    title: "Electrician no-show",
    buyer: "Grace Nwankwo",
    vendor: "Fatima Abubakar",
    amount: 45000,
    status: "open",
    filed: "2025-02-08",
  },
];

const roleBadge: Record<string, string> = {
  BUYER: "bg-blue-50 text-blue-600",
  AGENT: "bg-primary/10 text-primary",
  VENDOR: "bg-purple-50 text-purple-600",
  ADMIN: "bg-red-50 text-red-600",
};

const statusBadge: Record<string, string> = {
  active: "bg-green-50 text-green-600",
  suspended: "bg-red-50 text-red-600",
  pending: "bg-[#FFF8ED] text-[#F5A623]",
  pending_review: "bg-[#FFF8ED] text-[#F5A623]",
  flagged: "bg-red-50 text-red-600",
  delivered: "bg-green-50 text-green-600",
  processing: "bg-blue-50 text-blue-600",
  shipped: "bg-primary/10 text-primary",
  cancelled: "bg-red-50 text-red-600",
  open: "bg-amber-50 text-amber-600",
  resolved: "bg-green-50 text-green-600",
};

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [userFilter, setUserFilter] = useState("all");

  const tabs = [
    {
      key: "overview" as const,
      label: "Overview",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      key: "users" as const,
      label: "Users",
      icon: <Users className="w-4 h-4" />,
      count: mockUsers.length,
    },
    {
      key: "listings" as const,
      label: "Listings",
      icon: <Home className="w-4 h-4" />,
      count: mockListings.length,
    },
    {
      key: "orders" as const,
      label: "Orders",
      icon: <ShoppingCart className="w-4 h-4" />,
      count: mockOrders.length,
    },
    {
      key: "disputes" as const,
      label: "Disputes",
      icon: <Shield className="w-4 h-4" />,
      count: mockDisputes.filter((d) => d.status === "open").length,
    },
  ];

  const filteredUsers = mockUsers.filter((u) => {
    const matchesSearch =
      !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = userFilter === "all" || u.role === userFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />
      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">Admin Panel</span>
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-8 sm:p-10 mb-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Settings className="w-7 h-7" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-primary-dark text-2xl sm:text-3xl tracking-tight">
                  Admin Panel
                </h1>
                <p className="text-text-secondary text-sm mt-1">
                  Manage users, listings, orders, and disputes across the
                  platform.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`h-10 px-5 rounded-full text-sm font-medium transition-all shrink-0 flex items-center gap-2 ${
                  activeTab === t.key
                    ? "bg-primary text-white shadow-lg shadow-glow/30"
                    : "bg-white/60 backdrop-blur-sm border border-white/40 text-text-secondary hover:bg-white/80"
                }`}
              >
                {t.icon} {t.label} {t.count !== undefined && `(${t.count})`}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease }}
              className="mb-20"
            >
              {/* OVERVIEW */}
              {activeTab === "overview" && (
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                    {[
                      {
                        label: "Total Users",
                        value: mockUsers.length,
                        icon: <Users className="w-5 h-5" />,
                        color: "text-primary",
                        bg: "bg-primary/10",
                        sub: `${mockUsers.filter((u) => u.role === "AGENT").length} agents`,
                      },
                      {
                        label: "Active Listings",
                        value: mockListings.filter((l) => l.status === "active")
                          .length,
                        icon: <Home className="w-5 h-5" />,
                        color: "text-blue-600",
                        bg: "bg-blue-50",
                        sub: `${mockListings.filter((l) => l.status === "pending_review").length} pending review`,
                      },
                      {
                        label: "Total Orders",
                        value: mockOrders.length,
                        icon: <ShoppingCart className="w-5 h-5" />,
                        color: "text-green-600",
                        bg: "bg-green-50",
                        sub: `₦${mockOrders.reduce((s, o) => s + o.total, 0).toLocaleString()} revenue`,
                      },
                      {
                        label: "Open Disputes",
                        value: mockDisputes.filter((d) => d.status === "open")
                          .length,
                        icon: <AlertTriangle className="w-5 h-5" />,
                        color: "text-amber-600",
                        bg: "bg-amber-50",
                        sub: `₦${mockDisputes
                          .filter((d) => d.status === "open")
                          .reduce((s, d) => s + d.amount, 0)
                          .toLocaleString()} at risk`,
                      },
                    ].map((s, i) => (
                      <div
                        key={i}
                        className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-5"
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
                        <p className="text-text-subtle text-[11px] mt-1">
                          {s.sub}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6">
                    <h3 className="font-heading font-bold text-primary-dark text-base mb-4">
                      Platform Health
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        {
                          label: "User Growth",
                          value: "+12%",
                          desc: "vs last month",
                          color: "text-green-600",
                        },
                        {
                          label: "Listing Quality",
                          value: "94%",
                          desc: "pass moderation",
                          color: "text-primary",
                        },
                        {
                          label: "Dispute Rate",
                          value: "2.1%",
                          desc: "of all transactions",
                          color: "text-amber-600",
                        },
                      ].map((m, i) => (
                        <div
                          key={i}
                          className="bg-white/50 rounded-2xl border border-border-light p-4 text-center"
                        >
                          <p
                            className={`font-heading font-bold text-2xl ${m.color}`}
                          >
                            {m.value}
                          </p>
                          <p className="text-primary-dark text-xs font-medium mt-1">
                            {m.label}
                          </p>
                          <p className="text-text-subtle text-[11px] mt-0.5">
                            {m.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* USERS */}
              {activeTab === "users" && (
                <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                  <div className="px-6 py-5 border-b border-white/30 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <h3 className="font-heading font-bold text-primary-dark text-base flex-1">
                      All Users
                    </h3>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                        <input
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search users…"
                          className="h-9 pl-9 pr-4 w-full sm:w-60 rounded-full bg-white/80 border border-border-light text-sm text-primary-dark focus:outline-none focus:border-primary transition-colors"
                        />
                      </div>
                      <select
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
                        className="h-9 px-3 rounded-full bg-white/80 border border-border-light text-xs text-primary-dark focus:outline-none focus:border-primary transition-colors appearance-none"
                      >
                        <option value="all">All Roles</option>
                        <option value="BUYER">Buyers</option>
                        <option value="AGENT">Agents</option>
                        <option value="VENDOR">Vendors</option>
                      </select>
                    </div>
                  </div>
                  <div className="divide-y divide-white/30">
                    {filteredUsers.map((u) => (
                      <div
                        key={u.id}
                        className="px-6 py-4 flex items-center gap-4 hover:bg-white/30 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-heading font-semibold text-primary-dark text-sm">
                            {u.name}
                          </p>
                          <p className="text-text-secondary text-xs">
                            {u.email}
                          </p>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${roleBadge[u.role]}`}
                        >
                          {u.role}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${statusBadge[u.status]}`}
                        >
                          {u.status}
                        </span>
                        <span className="text-text-subtle text-xs shrink-0 hidden sm:block">
                          {u.joined}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LISTINGS */}
              {activeTab === "listings" && (
                <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                  <div className="px-6 py-5 border-b border-white/30">
                    <h3 className="font-heading font-bold text-primary-dark text-base">
                      All Listings
                    </h3>
                  </div>
                  <div className="divide-y divide-white/30">
                    {mockListings.map((l) => (
                      <div
                        key={l.id}
                        className="px-6 py-4 flex items-center gap-4 hover:bg-white/30 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <Home className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-heading font-semibold text-primary-dark text-sm truncate">
                            {l.title}
                          </p>
                          <p className="text-text-secondary text-xs">
                            {l.agent} · {l.type}
                          </p>
                        </div>
                        <span className="font-heading font-bold text-primary text-sm shrink-0 hidden sm:block">
                          ₦{l.price.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 text-text-subtle text-xs shrink-0">
                          <Eye className="w-3 h-3" /> {l.views}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${statusBadge[l.status]}`}
                        >
                          {l.status.replace("_", " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ORDERS */}
              {activeTab === "orders" && (
                <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                  <div className="px-6 py-5 border-b border-white/30">
                    <h3 className="font-heading font-bold text-primary-dark text-base">
                      All Orders
                    </h3>
                  </div>
                  <div className="divide-y divide-white/30">
                    {mockOrders.map((o) => (
                      <div
                        key={o.id}
                        className="px-6 py-4 flex items-center gap-4 hover:bg-white/30 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                          <ShoppingCart className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-heading font-semibold text-primary-dark text-sm">
                            {o.id}
                          </p>
                          <p className="text-text-secondary text-xs">
                            {o.buyer} · {o.items} item{o.items > 1 ? "s" : ""}
                          </p>
                        </div>
                        <span className="text-text-subtle text-xs shrink-0 hidden sm:block">
                          {o.date}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${statusBadge[o.status]}`}
                        >
                          {o.status}
                        </span>
                        <span className="font-heading font-bold text-primary-dark text-sm shrink-0">
                          ₦{o.total.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DISPUTES */}
              {activeTab === "disputes" && (
                <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                  <div className="px-6 py-5 border-b border-white/30">
                    <h3 className="font-heading font-bold text-primary-dark text-base">
                      All Disputes
                    </h3>
                  </div>
                  <div className="divide-y divide-white/30">
                    {mockDisputes.map((d) => (
                      <div
                        key={d.id}
                        className="px-6 py-5 hover:bg-white/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                            <AlertTriangle className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-heading font-semibold text-primary-dark text-sm">
                              {d.title}
                            </p>
                            <p className="text-text-secondary text-xs mt-0.5">
                              {d.buyer} vs {d.vendor}
                            </p>
                          </div>
                          <span className="text-text-subtle text-xs shrink-0">
                            {d.filed}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${statusBadge[d.status]}`}
                          >
                            {d.status}
                          </span>
                          <span className="font-heading font-bold text-primary-dark text-sm shrink-0">
                            ₦{d.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPanel;
