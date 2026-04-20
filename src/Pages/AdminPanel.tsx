import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Home,
  ShoppingCart,
  Shield,
  Settings,
  BarChart3,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { useListings } from "../api/hooks";
import { StatSkeleton, ListRowSkeleton } from "../components/ui/Skeleton";
import adminService from "../api/services/admin";

const ease = [0.23, 1, 0.32, 1] as const;

type AdminTab = "overview" | "users" | "listings" | "orders" | "disputes";

const statusBadge: Record<string, string> = {
  ACTIVE: "bg-green-50 text-green-600",
  DRAFT: "bg-[#FFF8ED] text-[#F5A623]",
  SOLD: "bg-blue-50 text-blue-600",
  RENTED: "bg-primary/10 text-primary",
};

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [overview, setOverview] = useState<any>(null);
  const [users, setUsers] = useState<any>(null);
  const [orders, setOrders] = useState<any>(null);
  const [disputes, setDisputes] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const {
    items: listings,
    total: listingTotal,
    loading: listingsLoading,
    error: listingsError,
  } = useListings({ limit: 50 });

  useEffect(() => {
    setLoading(true);
    adminService
      .getOverview()
      .then(setOverview)
      .catch(() => setOverview(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === "users") {
      setLoading(true);
      adminService
        .listUsers(1, 50)
        .then(setUsers)
        .catch(() => setUsers(null))
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "orders") {
      setLoading(true);
      adminService
        .listOrders(1, 50)
        .then(setOrders)
        .catch(() => setOrders(null))
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "disputes") {
      setLoading(true);
      adminService
        .listDisputes(1, 50)
        .then(setDisputes)
        .catch(() => setDisputes(null))
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

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
    },
    {
      key: "listings" as const,
      label: "Listings",
      icon: <Home className="w-4 h-4" />,
      count: listingTotal,
    },
    {
      key: "orders" as const,
      label: "Orders",
      icon: <ShoppingCart className="w-4 h-4" />,
    },
    {
      key: "disputes" as const,
      label: "Disputes",
      icon: <Shield className="w-4 h-4" />,
    },
  ];

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
                  {loading ? (
                    <StatSkeleton />
                  ) : (
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                      {[
                        {
                          label: "Total Users",
                          value: overview?.totalUsers || "—",
                          icon: <Users className="w-5 h-5" />,
                          color: "text-primary",
                          bg: "bg-primary/10",
                          sub: `${overview?.totalAgents || 0} agents, ${overview?.totalVendors || 0} vendors`,
                        },
                        {
                          label: "Active Listings",
                          value: overview?.activeListings || listingTotal,
                          icon: <Home className="w-5 h-5" />,
                          color: "text-blue-600",
                          bg: "bg-blue-50",
                          sub: `${overview?.totalListings || 0} total`,
                        },
                        {
                          label: "Total Orders",
                          value: overview?.totalOrders || "—",
                          icon: <ShoppingCart className="w-5 h-5" />,
                          color: "text-green-600",
                          bg: "bg-green-50",
                          sub: "All orders",
                        },
                        {
                          label: "Platform Stats",
                          value: overview?.totalUsers || "—",
                          icon: <BarChart3 className="w-5 h-5" />,
                          color: "text-amber-600",
                          bg: "bg-amber-50",
                          sub: "Active users",
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
                  )}
                </div>
              )}

              {/* USERS */}
              {activeTab === "users" && (
                <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                  <div className="px-6 py-5 border-b border-white/30">
                    <h3 className="font-heading font-bold text-primary-dark text-base">
                      All Users
                    </h3>
                  </div>
                  {loading ? (
                    <ListRowSkeleton />
                  ) : users?.items && users.items.length > 0 ? (
                    <div className="divide-y divide-white/30">
                      {users.items.map((u: any) => (
                        <div
                          key={u.id}
                          className="px-6 py-4 flex items-center gap-4 hover:bg-white/30 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Users className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-heading font-semibold text-primary-dark text-sm truncate">
                              {u.name}
                            </p>
                            <p className="text-text-secondary text-xs">
                              {u.email}
                            </p>
                          </div>
                          <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full shrink-0">
                            {u.role}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-[11px] font-medium shrink-0 ${
                              u.isActive
                                ? "bg-green-50 text-green-600"
                                : "bg-gray-50 text-gray-600"
                            }`}
                          >
                            {u.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <p className="text-text-secondary text-sm">
                        No users found.
                      </p>
                    </div>
                  )}
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
                  {listingsLoading ? (
                    <ListRowSkeleton />
                  ) : listingsError ? (
                    <div className="p-8 text-center">
                      <p className="text-red-600 text-sm">{listingsError}</p>
                    </div>
                  ) : listings.length === 0 ? (
                    <div className="p-12 text-center">
                      <p className="text-text-secondary text-sm">
                        No listings found.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-white/30">
                      {listings.map((l) => (
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
                              {l.agent?.name || "—"} · {l.type}
                            </p>
                          </div>
                          <span className="font-heading font-bold text-primary text-sm shrink-0 hidden sm:block">
                            {l.priceLabel}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${statusBadge[l.status] || "bg-gray-50 text-gray-600"}`}
                          >
                            {l.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
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
                  {loading ? (
                    <ListRowSkeleton />
                  ) : orders?.items && orders.items.length > 0 ? (
                    <div className="divide-y divide-white/30">
                      {orders.items.map((o: any) => (
                        <div
                          key={o.id}
                          className="px-6 py-4 flex items-center gap-4 hover:bg-white/30 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                            <ShoppingCart className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-heading font-semibold text-primary-dark text-sm truncate">
                              {o.buyer?.name}
                            </p>
                            <p className="text-text-secondary text-xs">
                              {o.items?.length || 0} items
                            </p>
                          </div>
                          <span className="font-heading font-bold text-primary text-sm shrink-0 hidden sm:block">
                            ₦{o.amount?.toLocaleString()}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${
                              o.status === "completed"
                                ? "bg-green-50 text-green-600"
                                : "bg-amber-50 text-amber-600"
                            }`}
                          >
                            {o.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <p className="text-text-secondary text-sm">
                        No orders found.
                      </p>
                    </div>
                  )}
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
                  {loading ? (
                    <ListRowSkeleton />
                  ) : disputes?.items && disputes.items.length > 0 ? (
                    <div className="divide-y divide-white/30">
                      {disputes.items.map((d: any) => (
                        <div
                          key={d.id}
                          className="px-6 py-4 flex items-center gap-4 hover:bg-white/30 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                            <Shield className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-heading font-semibold text-primary-dark text-sm truncate">
                              {d.title}
                            </p>
                            <p className="text-text-secondary text-xs">
                              {d.reportedBy?.name}
                            </p>
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
                            d.severity === "high"
                              ? "bg-red-50 text-red-600"
                              : d.severity === "medium"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-blue-50 text-blue-600"
                          }`}>
                            {d.severity}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${
                              d.status === "open"
                                ? "bg-amber-50 text-amber-600"
                                : "bg-green-50 text-green-600"
                            }`}
                          >
                            {d.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <p className="text-text-secondary text-sm">
                        No disputes found.
                      </p>
                    </div>
                  )}
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
