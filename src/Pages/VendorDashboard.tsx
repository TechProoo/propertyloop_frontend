import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  DollarSign,
  MessageCircle,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  TrendingUp,
  Eye,
  Phone,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowRight,
  Bell,
  ArrowLeft,
  Send,
  Wrench,
  MapPin,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import vendorsService from "../api/services/vendors";
import vendorJobsService from "../api/services/vendorJobs";
import vendorEarningsService from "../api/services/vendorEarnings";
import type { VendorStats } from "../api/types";
import { useConversations } from "../api/hooks";

const ease = [0.23, 1, 0.32, 1] as const;

/* ─── Sidebar Nav Items ─── */
const navItems = [
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    label: "Overview",
    id: "overview",
  },
  { icon: <Briefcase className="w-5 h-5" />, label: "My Jobs", id: "jobs" },
  {
    icon: <DollarSign className="w-5 h-5" />,
    label: "Earnings",
    id: "earnings",
  },
  {
    icon: <MessageCircle className="w-5 h-5" />,
    label: "Messages",
    id: "messages",
  },
  { icon: <Star className="w-5 h-5" />, label: "Reviews", id: "reviews" },
  { icon: <Settings className="w-5 h-5" />, label: "Settings", id: "settings" },
];

/* ─── Helpers ─── */
const statusColors: Record<string, string> = {
  pending: "bg-[#FFF8ED] text-[#F5A623]",
  accepted: "bg-blue-50 text-blue-600",
  "in-progress": "bg-primary/10 text-primary",
  completed: "bg-purple-50 text-purple-600",
  paid: "bg-green-50 text-green-600",
};

const earningStatusColors: Record<string, string> = {
  paid: "bg-green-50 text-green-600",
  pending: "bg-[#FFF8ED] text-[#F5A623]",
  processing: "bg-blue-50 text-blue-600",
};

const activityIcons: Record<
  string,
  { icon: React.ReactNode; bg: string; color: string }
> = {
  request: {
    icon: <Briefcase className="w-4 h-4" />,
    bg: "bg-blue-50",
    color: "text-blue-500",
  },
  payment: {
    icon: <DollarSign className="w-4 h-4" />,
    bg: "bg-green-50",
    color: "text-green-500",
  },
  review: {
    icon: <Star className="w-4 h-4" />,
    bg: "bg-[#FFF8ED]",
    color: "text-[#F5A623]",
  },
  completed: {
    icon: <CheckCircle className="w-4 h-4" />,
    bg: "bg-primary/10",
    color: "text-primary",
  },
};

const formatCurrency = (v: number) => "₦" + v.toLocaleString("en-NG");

/* ─── Component ─── */

const vendorActivity: { text: string; time: string; type: string }[] = [];

const VendorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("overview");
  const [jobTab, setJobTab] = useState<"pending" | "active" | "completed">(
    "pending",
  );
  const [chatInput, setChatInput] = useState("");
  const [mobileChat, setMobileChat] = useState(false);
  const {
    conversations: vendorConversations,
    activeMessages: localMessages,
    loadMessages: loadConvoMessages,
    sendMessage: sendConvoMessage,
  } = useConversations();
  const [selectedConvo, setSelectedConvo] = useState("");

  // ─── API state ──────────────────────────────────────────────────────────
  const [apiStats, setApiStats] = useState<VendorStats | null>(null);
  const [vendorJobs, setVendorJobs] = useState<any[]>([]);
  const [vendorEarnings, setVendorEarnings] = useState<any[]>([]);
  const [vendorReviews, setVendorReviews] = useState<any[]>([]);
  const [vendorStats, setVendorStats] = useState<
    {
      value: string;
      label: string;
      change: string;
      color: string;
      bg: string;
    }[]
  >([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, jobsRes, earningsRes, reviewsRes] = await Promise.all([
          vendorsService.getStats().catch(() => null),
          vendorJobsService.list({ limit: 50 }).catch(() => ({ items: [] })),
          vendorEarningsService
            .list({ limit: 50 })
            .catch(() => ({ items: [] })),
          user?.id
            ? vendorsService.listReviews(user.id).catch(() => [])
            : Promise.resolve([]),
        ]);
        if (statsRes) {
          setApiStats(statsRes);
          setVendorStats([
            {
              value: String(statsRes.jobs.active),
              label: "Active Jobs",
              change: `${statsRes.jobs.pending} pending`,
              color: "text-primary",
              bg: "bg-primary/10",
            },
            {
              value: `₦${(statsRes.earnings.paid / 1000).toFixed(0)}K`,
              label: "Total Earnings",
              change: `₦${(statsRes.earnings.thisMonth / 1000).toFixed(0)}K this month`,
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              value: String(statsRes.reviews.averageRating || 0),
              label: "Rating",
              change: `${statsRes.reviews.total} reviews`,
              color: "text-[#F5A623]",
              bg: "bg-[#FFF8ED]",
            },
            {
              value: String(statsRes.jobs.completed),
              label: "Completed",
              change: `${statsRes.reviews.fiveStarPct}% 5-star`,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
          ]);
        }
        // Map API jobs to match the template shape
        setVendorJobs(
          jobsRes.items.map((j: any) => ({
            ...j,
            client: j.clientName,
            clientAvatar: "",
            clientPhone: j.clientPhone,
            date: new Date(j.createdAt).toLocaleDateString(),
            status: j.status.toLowerCase().replace("_", "-"),
          })),
        );
        setVendorEarnings(
          earningsRes.items.map((e: any) => ({
            ...e,
            client: e.clientName,
            date: new Date(e.createdAt).toLocaleDateString(),
            status: e.status.toLowerCase(),
          })),
        );
        setVendorReviews(
          (reviewsRes as any[]).map((r: any) => ({
            ...r,
            client: r.clientName,
            avatar: r.clientAvatar || "",
            date: new Date(r.createdAt).toLocaleDateString(),
          })),
        );
      } catch {
        /* ignore */
      }
    };
    load();
  }, [user?.id]);

  const vendorName = user?.name || "Vendor";
  const vendorCategory =
    (user?.vendorProfile as any)?.serviceCategory || "Service";

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  /* Job filtering */
  const pendingJobs = vendorJobs.filter((j: any) => j.status === "pending");
  const activeJobs = vendorJobs.filter(
    (j: any) => j.status === "accepted" || j.status === "in-progress",
  );
  const completedJobs = vendorJobs.filter(
    (j: any) => j.status === "completed" || j.status === "paid",
  );

  const filteredJobs =
    jobTab === "pending"
      ? pendingJobs
      : jobTab === "active"
        ? activeJobs
        : completedJobs;

  /* Earnings summary */
  const totalEarnings = apiStats?.earnings.total ?? 0;
  const paidEarnings = apiStats?.earnings.paid ?? 0;
  const pendingEarnings = apiStats?.earnings.pending ?? 0;

  /* Review summary */
  const avgRating = apiStats?.reviews.averageRating?.toFixed(1) || "0";
  const ratingDist = [5, 4, 3, 2, 1].map((r) => ({
    star: r,
    count: vendorReviews.filter((rv) => rv.rating === r).length,
    pct: vendorReviews.length
      ? Math.round(
          (vendorReviews.filter((rv) => rv.rating === r).length /
            vendorReviews.length) *
            100,
        )
      : 0,
  }));

  return (
    <div className="min-h-screen bg-[#f5f0eb] flex">
      {/* ─── Sidebar (Desktop) ─── */}
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
              <motion.img
                key="logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={Logo}
                alt="PropertyLoop"
                className="w-28"
              />
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
                  3
                </span>
              )}
              {sidebarOpen && item.id === "jobs" && pendingJobs.length > 0 && (
                <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F5A623] text-white">
                  {pendingJobs.length}
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
            <div
              className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-white text-sm font-bold shrink-0 border-2"
              style={{ borderColor: "hsl(160, 25%, 20%)" }}
            >
              {vendorName.charAt(0)}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {vendorName}
                </p>
                <p className="text-white/40 text-[11px] truncate">
                  {vendorCategory}
                </p>
              </div>
            )}
            {sidebarOpen && (
              <button
                onClick={handleLogout}
                className="text-white/40 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* ─── Mobile Sidebar Overlay ─── */}
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
                  <div
                    className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-white text-sm font-bold shrink-0 border-2"
                    style={{ borderColor: "hsl(160, 25%, 20%)" }}
                  >
                    {vendorName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {vendorName}
                    </p>
                    <p className="text-white/40 text-[11px] truncate">
                      {vendorCategory}
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
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-white/60 backdrop-blur-xl border-b border-white/40 px-6 py-3 flex items-center justify-between shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 flex items-center justify-center text-primary-dark hover:bg-primary hover:text-white transition-all shadow-sm"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div>
              <h1 className="font-heading font-bold text-primary-dark text-lg">
                {navItems.find((n) => n.id === activeNav)?.label || "Overview"}
              </h1>
              <p className="text-text-subtle text-xs">
                {vendorCategory} · Service Vendor
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 flex items-center justify-center text-text-secondary hover:bg-white transition-all shadow-sm">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                2
              </span>
            </button>
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold border-2 border-white shadow-sm hidden sm:flex">
              {vendorName.charAt(0)}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 lg:p-8">
          {/* ─── Overview Panel ─── */}
          {activeNav === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
            >
              <div className="mb-6">
                <h2 className="font-heading text-[1.3rem] sm:text-[1.6rem] font-bold text-primary-dark">
                  Welcome back, {vendorName.split(" ")[0]}
                </h2>
                <p className="text-text-secondary text-sm mt-1">
                  Here's your service overview
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {vendorStats.map((s, i) => (
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
                      {i === 0 && <Briefcase className="w-5 h-5" />}
                      {i === 1 && <DollarSign className="w-5 h-5" />}
                      {i === 2 && <Star className="w-5 h-5" />}
                      {i === 3 && <Eye className="w-5 h-5" />}
                    </div>
                    <p className="font-heading font-bold text-primary-dark text-xl">
                      {s.value}
                    </p>
                    <p className="text-text-secondary text-xs mt-0.5">
                      {s.label}
                    </p>
                    <p className="text-primary text-[11px] font-medium mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {s.change}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Two-Column */}
              <div className="flex flex-col xl:flex-row gap-6">
                {/* Left */}
                <div className="flex-1 flex flex-col gap-6">
                  {/* Incoming Requests */}
                  <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                    <div className="px-6 py-5 border-b border-white/30 flex items-center justify-between">
                      <h3 className="font-heading font-bold text-primary-dark text-base">
                        Incoming Requests
                      </h3>
                      <span className="px-2.5 py-1 rounded-full bg-[#FFF8ED] text-[#F5A623] text-xs font-medium">
                        {pendingJobs.length} pending
                      </span>
                    </div>
                    <div className="divide-y divide-white/30">
                      {pendingJobs.map((job) => (
                        <div
                          key={job.id}
                          className="px-6 py-4 flex items-center gap-4 hover:bg-white/50 transition-colors"
                        >
                          <img
                            src={job.clientAvatar}
                            alt={job.client}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-heading font-semibold text-primary-dark text-sm">
                              {job.title}
                            </p>
                            <p className="text-text-secondary text-xs truncate">
                              {job.client} · {job.address}
                            </p>
                            <p className="text-primary font-heading font-bold text-xs mt-0.5">
                              {formatCurrency(job.amount)}
                            </p>
                          </div>
                          <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${statusColors[job.status]}`}
                            >
                              {job.status}
                            </span>
                            <span className="text-text-subtle text-[11px] flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {job.date}
                            </span>
                          </div>
                          <a
                            href={`tel:+${job.clientPhone}`}
                            className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shrink-0"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ))}
                      {pendingJobs.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-text-secondary text-sm">
                            No pending requests
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="px-6 py-3 border-t border-white/30">
                      <button
                        onClick={() => {
                          setActiveNav("jobs");
                          setJobTab("pending");
                        }}
                        className="text-primary text-xs font-medium hover:underline flex items-center gap-1"
                      >
                        View all jobs <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Active Jobs */}
                  <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                    <div className="px-6 py-5 border-b border-white/30 flex items-center justify-between">
                      <h3 className="font-heading font-bold text-primary-dark text-base">
                        Active Jobs
                      </h3>
                      <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {activeJobs.length} in progress
                      </span>
                    </div>
                    <div className="p-4 flex flex-col gap-3">
                      {activeJobs.map((job) => (
                        <div
                          key={job.id}
                          className="flex gap-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl p-4 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
                        >
                          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Wrench className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-heading font-bold text-primary-dark text-sm">
                              {job.title}
                            </p>
                            <p className="text-text-secondary text-xs mt-0.5">
                              {job.client}
                            </p>
                            <p className="text-text-secondary text-[11px] mt-0.5 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {job.address}
                            </p>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="font-heading font-bold text-primary text-xs">
                                {formatCurrency(job.amount)}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[job.status]}`}
                              >
                                {job.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {activeJobs.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-text-secondary text-sm">
                            No active jobs
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="xl:w-90 shrink-0 flex flex-col gap-6">
                  {/* Performance */}
                  <div className="bg-primary rounded-[20px] p-6 text-white">
                    <h3 className="font-heading font-bold text-base mb-4">
                      Performance
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">Rating</span>
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-[#F5A623] fill-[#F5A623]" />
                          <span className="font-heading font-bold">
                            {avgRating}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">
                          Jobs Completed
                        </span>
                        <span className="font-heading font-bold">
                          {completedJobs.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">
                          Total Reviews
                        </span>
                        <span className="font-heading font-bold">
                          {vendorReviews.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">
                          Response Rate
                        </span>
                        <span className="font-heading font-bold">94%</span>
                      </div>
                      <div className="h-px bg-white/20 my-1" />
                      <div className="flex items-center gap-2 text-white/60 text-xs">
                        <CheckCircle className="w-4 h-4 text-[hsl(142,71%,45%)]" />
                        KYC Verified · Smile Identity
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6">
                    <h3 className="font-heading font-bold text-primary-dark text-sm mb-4">
                      Recent Activity
                    </h3>
                    <div className="relative">
                      <div className="absolute left-4.5 top-2 bottom-2 w-px bg-white/40" />
                      <div className="flex flex-col gap-4">
                        {vendorActivity.map((item, i) => {
                          const cfg = activityIcons[item.type];
                          return (
                            <div
                              key={i}
                              className="flex items-start gap-3 relative"
                            >
                              <div
                                className={`w-9 h-9 rounded-full ${cfg.bg} flex items-center justify-center ${cfg.color} shrink-0 relative z-10 border-2 border-[#f5f0eb]`}
                              >
                                {cfg.icon}
                              </div>
                              <div className="flex-1 min-w-0 pt-1">
                                <p className="text-primary-dark text-xs font-medium leading-snug">
                                  {item.text}
                                </p>
                                <p className="text-text-subtle text-[11px] mt-0.5 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {item.time}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6">
                    <h3 className="font-heading font-bold text-primary-dark text-sm mb-4">
                      Quick Actions
                    </h3>
                    <div className="flex flex-col gap-2.5">
                      {[
                        {
                          icon: <Briefcase className="w-4 h-4" />,
                          label: "View Pending Jobs",
                          nav: "jobs",
                        },
                        {
                          icon: <DollarSign className="w-4 h-4" />,
                          label: "Check Earnings",
                          nav: "earnings",
                        },
                        {
                          icon: <Star className="w-4 h-4" />,
                          label: "View Reviews",
                          nav: "reviews",
                        },
                        {
                          icon: <Settings className="w-4 h-4" />,
                          label: "Edit Profile",
                          nav: "settings",
                        },
                      ].map((action) => (
                        <button
                          key={action.label}
                          onClick={() => setActiveNav(action.nav)}
                          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 hover:border-primary hover:bg-white/80 hover:-translate-y-0.5 transition-all duration-200 text-left"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            {action.icon}
                          </div>
                          <span className="flex-1 font-heading font-medium text-primary-dark text-sm">
                            {action.label}
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-text-subtle" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── My Jobs Panel ─── */}
          {activeNav === "jobs" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
            >
              {/* Sub-Tabs */}
              <div className="flex items-center gap-2 mb-6">
                {[
                  {
                    key: "pending" as const,
                    label: "Pending",
                    count: pendingJobs.length,
                  },
                  {
                    key: "active" as const,
                    label: "Active",
                    count: activeJobs.length,
                  },
                  {
                    key: "completed" as const,
                    label: "Completed",
                    count: completedJobs.length,
                  },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setJobTab(tab.key)}
                    className={`h-9 px-4 rounded-full text-sm font-medium transition-all ${
                      jobTab === tab.key
                        ? "bg-primary text-white shadow-lg shadow-glow/30"
                        : "bg-white/60 backdrop-blur-sm border border-white/40 text-text-secondary hover:bg-white/80"
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>

              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="p-4 flex flex-col gap-3">
                  {filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex flex-col sm:flex-row gap-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl p-5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all"
                    >
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <img
                          src={job.clientAvatar}
                          alt={job.client}
                          className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-heading font-bold text-primary-dark text-sm">
                              {job.title}
                            </p>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${statusColors[job.status]}`}
                            >
                              {job.status}
                            </span>
                          </div>
                          <p className="text-text-secondary text-xs mt-1">
                            {job.client}
                          </p>
                          <p className="text-text-secondary text-[11px] mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.address}
                          </p>
                          <p className="text-text-subtle text-xs mt-1.5">
                            {job.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="font-heading font-bold text-primary text-sm">
                              {formatCurrency(job.amount)}
                            </span>
                            <span className="text-text-subtle text-[11px] flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {job.date}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 sm:pt-1">
                        {job.status === "pending" && (
                          <>
                            <button className="h-8 px-4 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors shadow-sm flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5" /> Accept
                            </button>
                            <button className="h-8 px-4 rounded-full border border-red-200 bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors flex items-center gap-1.5">
                              <XCircle className="w-3.5 h-3.5" /> Decline
                            </button>
                          </>
                        )}
                        {(job.status === "accepted" ||
                          job.status === "in-progress") && (
                          <button className="h-8 px-4 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors shadow-sm flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5" /> Mark
                            Complete
                          </button>
                        )}
                        {job.status === "completed" && (
                          <span className="flex items-center gap-1 text-purple-600 text-xs font-medium">
                            <AlertCircle className="w-3.5 h-3.5" /> Awaiting
                            payment
                          </span>
                        )}
                        {job.status === "paid" && (
                          <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                            <CheckCircle className="w-3.5 h-3.5" /> Payment
                            received
                          </span>
                        )}
                        <a
                          href={`tel:+${job.clientPhone}`}
                          className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                  {filteredJobs.length === 0 && (
                    <div className="text-center py-16">
                      <Briefcase className="w-12 h-12 text-text-subtle mx-auto mb-3" />
                      <p className="text-primary-dark font-heading font-bold text-base">
                        No {jobTab} jobs
                      </p>
                      <p className="text-text-secondary text-sm mt-1">
                        {jobTab === "pending"
                          ? "No new requests at the moment"
                          : jobTab === "active"
                            ? "No active jobs right now"
                            : "No completed jobs yet"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Earnings Panel ─── */}
          {activeNav === "earnings" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
              className="flex flex-col gap-6"
            >
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    label: "Total Earnings",
                    value: formatCurrency(totalEarnings),
                    color: "text-primary",
                    bg: "bg-primary/10",
                  },
                  {
                    label: "Paid Out",
                    value: formatCurrency(paidEarnings),
                    color: "text-green-600",
                    bg: "bg-green-50",
                  },
                  {
                    label: "Pending / Processing",
                    value: formatCurrency(pendingEarnings),
                    color: "text-[#F5A623]",
                    bg: "bg-[#FFF8ED]",
                  },
                ].map((card, i) => (
                  <div
                    key={i}
                    className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6"
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl ${card.bg} flex items-center justify-center ${card.color} mb-3`}
                    >
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <p className="font-heading font-bold text-primary-dark text-xl">
                      {card.value}
                    </p>
                    <p className="text-text-secondary text-xs mt-0.5">
                      {card.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* History Table */}
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="px-6 py-5 border-b border-white/30">
                  <h3 className="font-heading font-bold text-primary-dark text-base">
                    Earnings History
                  </h3>
                </div>
                <div className="divide-y divide-white/30">
                  {vendorEarnings.map((earning) => (
                    <div
                      key={earning.id}
                      className="px-6 py-4 flex items-center gap-4 hover:bg-white/30 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-semibold text-primary-dark text-sm truncate">
                          {earning.jobTitle}
                        </p>
                        <p className="text-text-secondary text-xs mt-0.5">
                          {earning.client}
                        </p>
                      </div>
                      <span className="text-text-subtle text-xs shrink-0 hidden sm:block">
                        {earning.date}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${earningStatusColors[earning.status]}`}
                      >
                        {earning.status}
                      </span>
                      <span className="font-heading font-bold text-primary-dark text-sm shrink-0">
                        {formatCurrency(earning.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Messages Panel ─── */}
          {activeNav === "messages" &&
            (() => {
              const activeConvo =
                vendorConversations.find((c) => c.id === selectedConvo) ||
                vendorConversations[0];
              const convoId = activeConvo?.id || "";
              const activeMessages = localMessages[convoId] || [];

              if (convoId && !localMessages[convoId]) {
                loadConvoMessages(convoId);
              }

              const handleSend = () => {
                if (!chatInput.trim() || !convoId) return;
                sendConvoMessage(convoId, chatInput.trim());
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
                      {/* Left: Conversation List */}
                      <div
                        className={`${mobileChat ? "hidden md:flex" : "flex"} flex-col w-full md:w-85 lg:w-90 shrink-0 border-r border-white/30 bg-white/30 backdrop-blur-sm`}
                      >
                        <div className="px-4 pt-4 pb-3 border-b border-white/30">
                          <p className="font-heading font-bold text-primary-dark text-sm">
                            Conversations
                          </p>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                          {vendorConversations.map((convo) => (
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
                                {convo.unread > 0 && (
                                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                                    {convo.unread}
                                  </span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <p
                                      className={`text-sm truncate ${convo.unread > 0 ? "font-bold text-primary-dark" : "font-medium text-primary-dark"}`}
                                    >
                                      {convo.name}
                                    </p>
                                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold shrink-0 bg-primary/10 text-primary">
                                      {convo.role}
                                    </span>
                                  </div>
                                  <span className="text-text-subtle text-[10px] shrink-0">
                                    {convo.time}
                                  </span>
                                </div>
                                <p
                                  className={`text-xs mt-0.5 truncate ${convo.unread > 0 ? "text-primary-dark font-medium" : "text-text-secondary"}`}
                                >
                                  {convo.lastMessage}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Right: Chat */}
                      <div
                        className={`${mobileChat ? "flex" : "hidden md:flex"} flex-col flex-1 min-w-0`}
                      >
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
                              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold shrink-0 bg-primary/10 text-primary">
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
                          </div>
                        </div>
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

          {/* ─── Reviews Panel ─── */}
          {activeNav === "reviews" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
              className="flex flex-col gap-6"
            >
              {/* Rating Summary */}
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="bg-primary rounded-[20px] p-6 text-white sm:w-60 shrink-0 flex flex-col items-center justify-center">
                  <p className="font-heading font-bold text-[3rem] leading-none">
                    {avgRating}
                  </p>
                  <div className="flex items-center gap-0.5 mt-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= Math.round(Number(avgRating)) ? "text-[#F5A623] fill-[#F5A623]" : "text-white/30"}`}
                      />
                    ))}
                  </div>
                  <p className="text-white/60 text-sm mt-2">
                    {vendorReviews.length} reviews
                  </p>
                </div>

                <div className="flex-1 bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6">
                  <h3 className="font-heading font-bold text-primary-dark text-sm mb-4">
                    Rating Distribution
                  </h3>
                  <div className="flex flex-col gap-2.5">
                    {ratingDist.map((r) => (
                      <div key={r.star} className="flex items-center gap-3">
                        <span className="text-sm text-text-secondary w-12 shrink-0 flex items-center gap-1">
                          {r.star}{" "}
                          <Star className="w-3 h-3 text-[#F5A623] fill-[#F5A623]" />
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-white/50 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#F5A623]"
                            style={{ width: `${r.pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-text-secondary w-16 shrink-0 text-right">
                          {r.count} ({r.pct}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Cards */}
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="px-6 py-5 border-b border-white/30">
                  <h3 className="font-heading font-bold text-primary-dark text-base">
                    All Reviews
                  </h3>
                </div>
                <div className="divide-y divide-white/30">
                  {vendorReviews.map((review) => (
                    <div key={review.id} className="px-6 py-5">
                      <div className="flex items-start gap-3">
                        <img
                          src={review.avatar}
                          alt={review.client}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-heading font-semibold text-primary-dark text-sm">
                              {review.client}
                            </p>
                            <span className="text-text-subtle text-[11px] shrink-0">
                              {review.date}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${s <= review.rating ? "text-[#F5A623] fill-[#F5A623]" : "text-gray-200"}`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-primary font-medium mt-1">
                            {review.jobTitle}
                          </p>
                          <p className="text-text-secondary text-sm mt-1.5 leading-relaxed">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                <h3 className="font-heading font-bold text-primary-dark text-base mb-6">
                  Vendor Profile
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { label: "Full Name", value: vendorName, type: "text" },
                    { label: "Email", value: user?.email || "", type: "email" },
                    { label: "Phone", value: "+234 801 234 5678", type: "tel" },
                    {
                      label: "Service Category",
                      value: vendorCategory,
                      type: "text",
                    },
                    { label: "Location", value: "Lekki, Lagos", type: "text" },
                    { label: "Years of Experience", value: "12", type: "text" },
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
                <div className="mt-5">
                  <label className="block text-sm font-medium text-primary-dark mb-1.5">
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    defaultValue="Expert plumber with 12 years of experience across Lekki and Victoria Island. Specialises in kitchen and bathroom installations, pipe repairs, and water heater systems."
                    className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 text-sm text-primary-dark placeholder:text-text-subtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  />
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

              {/* Danger Zone */}
              <div className="bg-white/70 backdrop-blur-md border border-red-100 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                <h3 className="font-heading font-bold text-red-600 text-base mb-2">
                  Account
                </h3>
                <p className="text-text-secondary text-sm mb-4">
                  Log out of your vendor account.
                </p>
                <button
                  onClick={handleLogout}
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

export default VendorDashboard;
