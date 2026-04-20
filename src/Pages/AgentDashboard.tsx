import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Home,
  Users,
  BarChart3,
  MessageCircle,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Star,
  TrendingUp,
  Eye,
  Phone,
  DollarSign,
  MapPin,
  Bed,
  Bath,
  Maximize,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowRight,
  Bell,
  Calendar,
  PlusCircle,
  FileText,
  Briefcase,
  ClipboardList,
  ArrowLeft,
  Send,
  Upload,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/logo.png";
import agentsService from "../api/services/agents";
import listingsService from "../api/services/listings";
import leadsService from "../api/services/leads";
import viewingsService from "../api/services/viewings";
import type { AgentStats, Listing } from "../api/types";
import { useConversations } from "../api/hooks";
import { StatSkeleton } from "../components/ui/Skeleton";

const ease = [0.23, 1, 0.32, 1] as const;

/* ─── Agent data loaded from API ─── */

/* ─── Sidebar Nav Items ─── */
const navItems = [
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    label: "Overview",
    id: "overview",
  },
  { icon: <Home className="w-5 h-5" />, label: "My Listings", id: "listings" },
  { icon: <Users className="w-5 h-5" />, label: "Leads", id: "leads" },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    label: "Analytics",
    id: "analytics",
  },
  {
    icon: <MessageCircle className="w-5 h-5" />,
    label: "Messages",
    id: "messages",
  },
  { icon: <Calendar className="w-5 h-5" />, label: "Viewings", id: "viewings" },
  {
    icon: <FileText className="w-5 h-5" />,
    label: "Documents",
    id: "documents",
  },
  { icon: <Settings className="w-5 h-5" />, label: "Settings", id: "settings" },
];

/* ─── Stats built from API data ─── */

/* ─── Leads loaded from API ─── */

const statusColors: Record<string, string> = {
  New: "bg-blue-500/10 text-blue-600",
  NEW: "bg-blue-500/10 text-blue-600",
  Contacted: "bg-[#FFF8ED] text-[#F5A623]",
  CONTACTED: "bg-[#FFF8ED] text-[#F5A623]",
  Viewing: "bg-primary/10 text-primary",
  VIEWING_SCHEDULED: "bg-primary/10 text-primary",
  Negotiating: "bg-purple-50 text-purple-600",
  NEGOTIATING: "bg-purple-50 text-purple-600",
  CONVERTED: "bg-green-50 text-green-600",
  LOST: "bg-red-50 text-red-500",
};

/* ─── Activity built from recent leads/viewings ─── */

/* ─── Viewings loaded from API ─── */

/* ─── Documents extracted from listing documents via API ─── */

/* ─── Component ─── */

const AgentDashboard = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("overview");
  const [chatInput, setChatInput] = useState("");
  const [mobileChat, setMobileChat] = useState(false);
  const {
    conversations: agentConversations,
    activeMessages: localMessages,
    loadMessages: loadConvoMessages,
    sendMessage: sendConvoMessage,
  } = useConversations();
  const [selectedConvo, setSelectedConvo] = useState("");

  // ─── API state ──────────────────────────────────────────────────────────
  const [apiStats, setApiStats] = useState<AgentStats | null>(null);
  const [agentListings, setAgentListings] = useState<Listing[]>([]);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [upcomingViewings, setUpcomingViewings] = useState<any[]>([]);
  const [documents, setDocuments] = useState<
    {
      id: string;
      listingId: string;
      listingTitle: string;
      name: string;
      type: string;
      date: string;
      size: string;
      verified: boolean;
    }[]
  >([]);
  const [dashLoading, setDashLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadListingId, setUploadListingId] = useState("");
  const [uploadDocName, setUploadDocName] = useState("");
  const [uploadDocType, setUploadDocType] = useState<
    "C_OF_O" | "SURVEY_PLAN" | "BUILDING_PERMIT" | "RECEIPT"
  >("C_OF_O");
  const [uploading, setUploading] = useState(false);

  // ─── Profile form state ──────────────────────────────────────────────────
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileAgency, setProfileAgency] = useState("");
  const [profileLocation, setProfileLocation] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileWebsite, setProfileWebsite] = useState("");
  const [profileYears, setProfileYears] = useState<number>(0);
  const [profileSpecialties, setProfileSpecialties] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, listingsRes, leadsRes, viewingsRes] =
          await Promise.all([
            agentsService.getStats().catch(() => null),
            listingsService
              .listMine({ limit: 50 })
              .catch(() => ({ items: [] })),
            leadsService.list({ limit: 20 }).catch(() => ({ items: [] })),
            viewingsService
              .list({ upcoming: true, limit: 20 })
              .catch(() => ({ items: [] })),
          ]);
        if (statsRes) setApiStats(statsRes);
        setAgentListings(listingsRes.items);
        setRecentLeads(
          leadsRes.items.map((l: any) => ({
            ...l,
            property: l.listing?.title || "Property enquiry",
            time: new Date(l.createdAt).toLocaleDateString(),
          })),
        );
        setUpcomingViewings(
          viewingsRes.items.map((v: any) => {
            const d = new Date(v.scheduledFor);
            return {
              ...v,
              date: d.toLocaleDateString("en-NG", {
                month: "short",
                day: "numeric",
              }),
              time: d.toLocaleTimeString("en-NG", {
                hour: "numeric",
                minute: "2-digit",
              }),
              client: v.clientName,
              property: v.listing?.title || "Property viewing",
              phone: v.clientPhone,
              status:
                v.status === "CONFIRMED"
                  ? "Confirmed"
                  : v.status === "COMPLETED"
                    ? "Completed"
                    : "Pending",
            };
          }),
        );
        // Extract documents from all listings
        const docs = listingsRes.items.flatMap((l: any) =>
          (l.documents || []).map((d: any) => ({
            id: d.id,
            listingId: l.id,
            listingTitle: l.title || "Untitled",
            name: d.name,
            type: d.type?.replace(/_/g, " ") || d.type,
            date: d.date || new Date(d.createdAt).toLocaleDateString(),
            size: "—",
            verified: d.verified ?? false,
          })),
        );
        setDocuments(docs);
      } catch {
        /* ignore */
      }
      setDashLoading(false);
    };
    load();
  }, []);

  // ─── Populate profile form from user data ────────────────────────────────
  useEffect(() => {
    if (user) {
      setProfileName(user.name || "");
      setProfilePhone(user.phone || "");
      setProfileLocation(user.location || "");
      setProfileBio(user.bio || "");
      setProfileWebsite((user as any).website || "");
      const agentProfile = user.agentProfile as any;
      if (agentProfile) {
        setProfileAgency(agentProfile.agencyName || "");
        setProfileYears(agentProfile.yearsExperience || 0);
        setProfileSpecialties(Array.isArray(agentProfile.specialty) ? agentProfile.specialty.join(", ") : "");
      }
    }
  }, [user]);

  // ─── Save profile handler ────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    if (!profileName.trim()) {
      setProfileMessage({ type: "error", text: "Name is required" });
      return;
    }

    setSavingProfile(true);
    setProfileMessage(null);
    try {
      const specialtyArray = profileSpecialties
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      await agentsService.updateMe({
        name: profileName,
        phone: profilePhone,
        location: profileLocation,
        bio: profileBio,
        website: profileWebsite,
        agencyName: profileAgency,
        yearsExperience: profileYears,
        specialty: specialtyArray,
      });
      setProfileMessage({ type: "success", text: "Profile saved successfully!" });
      setTimeout(() => {
        setProfileMessage(null);
        setActiveNav("overview");
      }, 2000);
    } catch (error) {
      setProfileMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to save profile",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  // Build stats from API data
  const agent = {
    id: user?.agentProfile?.id || user?.id || "",
    listings: apiStats?.listings.active ?? 0,
    soldRented: apiStats?.profile.soldRentedCount ?? 0,
    rating: apiStats?.profile.rating ?? 0,
    yearsExperience: apiStats?.profile.yearsExperience ?? 0,
    verified: apiStats?.profile.verified ?? false,
    name: user?.name || "Agent",
    photo:
      user?.avatarUrl ||
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
    agency: (user?.agentProfile as any)?.agencyName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    bio: user?.bio || "",
  };

  const stats = [
    {
      icon: <Home className="w-5 h-5" />,
      value: String(apiStats?.listings.active ?? 0),
      label: "Active Listings",
      change: `${apiStats?.listings.pendingReview ?? 0} pending review`,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: <Users className="w-5 h-5" />,
      value: String(apiStats?.leads.total ?? 0),
      label: "Total Leads",
      change: `${apiStats?.leads.new ?? 0} new`,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      icon: <Eye className="w-5 h-5" />,
      value: (apiStats?.listings.totalViews ?? 0).toLocaleString(),
      label: "Total Views",
      change: `${apiStats?.viewings.upcoming ?? 0} viewings upcoming`,
      color: "text-[#F5A623]",
      bg: "bg-[#FFF8ED]",
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      value: `${apiStats?.leads.conversionRate ?? 0}%`,
      label: "Conversion Rate",
      change: `${apiStats?.profile.soldRentedCount ?? 0} deals closed`,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  const handleUploadDocument = async () => {
    if (!uploadListingId || !uploadDocName.trim()) return;
    setUploading(true);
    try {
      const doc = await listingsService.addDocument(uploadListingId, {
        name: uploadDocName.trim(),
        type: uploadDocType as any,
        date: new Date().toISOString().split("T")[0],
      });
      const listing = agentListings.find((l) => l.id === uploadListingId);
      setDocuments((prev) => [
        {
          id: doc.id,
          listingId: uploadListingId,
          listingTitle: listing?.title || "Untitled",
          name: doc.name,
          type: doc.type?.replace(/_/g, " ") || doc.type,
          date: doc.date || new Date().toLocaleDateString(),
          size: "—",
          verified: false,
        },
        ...prev,
      ]);
      setShowUploadModal(false);
      setUploadDocName("");
      setUploadListingId("");
    } catch {
      /* ignore */
    }
    setUploading(false);
  };

  const handleRemoveDocument = async (docListingId: string, docId: string) => {
    try {
      await listingsService.removeDocument(docListingId, docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch {
      /* ignore */
    }
  };

  const recentActivity = recentLeads.slice(0, 4).map((lead) => ({
    icon:
      lead.status === "NEW" ? (
        <Bell className="w-4 h-4" />
      ) : (
        <Users className="w-4 h-4" />
      ),
    text: `${lead.name} — ${lead.listing?.title || "property enquiry"}`,
    time: new Date(lead.createdAt).toLocaleDateString(),
    bg: lead.status === "NEW" ? "bg-blue-50" : "bg-primary/10",
    color: lead.status === "NEW" ? "text-blue-500" : "text-primary",
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
        {/* Logo + Collapse */}
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

        {/* Nav Links */}
        <nav className="flex-1 py-4 px-2 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`flex items-center gap-3 w-full rounded-xl transition-all duration-200 ${
                sidebarOpen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center"
              } ${
                activeNav === item.id
                  ? "text-white"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`}
              style={
                activeNav === item.id
                  ? { background: "hsl(160, 25%, 20%)" }
                  : {}
              }
            >
              <div
                className={`shrink-0 ${
                  activeNav === item.id ? "text-[hsl(142,71%,45%)]" : ""
                }`}
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
              {sidebarOpen && item.id === "leads" && (
                <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500 text-white">
                  12
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Agent Profile (Bottom) */}
        <div
          className="px-3 py-4 border-t"
          style={{ borderColor: "hsl(160, 20%, 22%)" }}
        >
          <div
            className={`flex items-center gap-3 ${!sidebarOpen ? "justify-center" : ""}`}
          >
            <img
              src={agent.photo}
              alt={agent.name}
              className="w-9 h-9 rounded-full object-cover object-top border-2 shrink-0"
              style={{ borderColor: "hsl(160, 25%, 20%)" }}
            />
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {agent.name}
                </p>
                <p className="text-white/40 text-[11px] truncate">
                  {agent.agency}
                </p>
              </div>
            )}
            {sidebarOpen && (
              <button
                onClick={() => {
                  logout();
                  window.location.href = "/";
                }}
                className="flex items-center gap-2 text-primary-dark bg-primary/10 px-2 py-1 rounded-md hover:bg-primary/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-xs">Logout</span>
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
                <Link to="/">
                  <img src={Logo} alt="PropertyLoop" className="w-28" />
                </Link>
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
                    className={`flex items-center gap-3 px-3 py-2.5 w-full rounded-xl transition-all duration-200 ${
                      activeNav === item.id
                        ? "text-white"
                        : "text-white/50 hover:text-white/80 hover:bg-white/5"
                    }`}
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
                  <img
                    src={agent.photo}
                    alt={agent.name}
                    className="w-9 h-9 rounded-full object-cover object-top border-2"
                    style={{ borderColor: "hsl(160, 25%, 20%)" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {agent.name}
                    </p>
                    <p className="text-white/40 text-[11px] truncate">
                      {agent.agency}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    window.location.href = "/";
                  }}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
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
                {agent.agency} · {agent.location}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/add-property"
              className="hidden sm:inline-flex items-center gap-2 h-9 px-4 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-glow/30"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Listing
            </Link>
            <button className="relative w-9 h-9 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 flex items-center justify-center text-text-secondary hover:bg-white transition-all shadow-sm">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                3
              </span>
            </button>
            <img
              src={agent.photo}
              alt={agent.name}
              className="w-9 h-9 rounded-full object-cover object-top border-2 border-white shadow-sm hidden sm:block"
            />
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
              {dashLoading ? (
                <StatSkeleton />
              ) : (
                <>
                  {/* Welcome */}
                  <div className="mb-6">
                    <h2 className="font-heading text-[1.3rem] sm:text-[1.6rem] font-bold text-primary-dark">
                      Welcome back, {agent.name.split(" ")[0]}
                    </h2>
                    <p className="text-text-secondary text-sm mt-1">
                      Here's your performance overview
                    </p>
                  </div>

                  {/* Stats Grid */}
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
                      {/* Recent Leads */}
                      <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                        <div className="px-6 py-5 border-b border-white/30 flex items-center justify-between">
                          <h3 className="font-heading font-bold text-primary-dark text-base">
                            Recent Leads
                          </h3>
                          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                            12 new
                          </span>
                        </div>
                        <div className="divide-y divide-white/30">
                          {recentLeads.map((lead, i) => (
                            <div
                              key={i}
                              className="px-6 py-4 flex items-center gap-4 hover:bg-white/50 transition-colors"
                            >
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                                {lead.name.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-heading font-semibold text-primary-dark text-sm">
                                  {lead.name}
                                </p>
                                <p className="text-text-secondary text-xs truncate">
                                  {lead.property}
                                </p>
                              </div>
                              <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${statusColors[lead.status]}`}
                                >
                                  {lead.status}
                                </span>
                                <span className="text-text-subtle text-[11px] flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {lead.time}
                                </span>
                              </div>
                              <a
                                href={`tel:${lead.phone}`}
                                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shrink-0"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          ))}
                        </div>
                        <div className="px-6 py-3 border-t border-white/30">
                          <button className="text-primary text-xs font-medium hover:underline flex items-center gap-1">
                            View all leads
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* My Listings */}
                      <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                        <div className="px-6 py-5 border-b border-white/30 flex items-center justify-between">
                          <h3 className="font-heading font-bold text-primary-dark text-base">
                            My Listings
                          </h3>
                          <Link
                            to="/add-property"
                            className="text-primary text-xs font-medium hover:underline flex items-center gap-1"
                          >
                            <PlusCircle className="w-3 h-3" />
                            Add new
                          </Link>
                        </div>
                        <div className="p-4 flex flex-col gap-3">
                          {agentListings.map((listing) => (
                            <Link
                              key={listing.id}
                              to={`/property/${listing.id}`}
                              className="group flex gap-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl p-3 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
                            >
                              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative">
                                <img
                                  src={listing.coverImage}
                                  alt={listing.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-full bg-primary/90 text-white text-[10px] font-medium">
                                  {listing.type === "SALE" ? "Sale" : "Rent"}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0 py-0.5">
                                <p className="font-heading font-bold text-primary-dark text-sm">
                                  {listing.priceLabel}
                                </p>
                                <p className="font-heading font-semibold text-primary-dark text-xs leading-snug mt-0.5 truncate">
                                  {listing.title}
                                </p>
                                <p className="text-text-secondary text-[11px] mt-0.5 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {listing.location}
                                </p>
                                <div className="flex items-center gap-3 text-text-secondary text-[11px] mt-1.5">
                                  <span className="flex items-center gap-1">
                                    <Bed className="w-3 h-3" />
                                    {listing.beds}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Bath className="w-3 h-3" />
                                    {listing.baths}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Maximize className="w-3 h-3" />
                                    {listing.sqft}m²
                                  </span>
                                </div>
                              </div>
                            </Link>
                          ))}
                          {agentListings.length === 0 && (
                            <div className="text-center py-8">
                              <p className="text-text-secondary text-sm">
                                No listings yet
                              </p>
                              <Link
                                to="/add-property"
                                className="text-primary text-xs font-medium mt-2 inline-flex items-center gap-1"
                              >
                                Add your first listing{" "}
                                <ArrowRight className="w-3 h-3" />
                              </Link>
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
                            <span className="text-white/60 text-sm">
                              Rating
                            </span>
                            <div className="flex items-center gap-1.5">
                              <Star className="w-4 h-4 text-[#F5A623] fill-[#F5A623]" />
                              <span className="font-heading font-bold">
                                {agent.rating}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/60 text-sm">
                              Deals Closed
                            </span>
                            <span className="font-heading font-bold">
                              {agent.soldRented}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/60 text-sm">
                              Experience
                            </span>
                            <span className="font-heading font-bold">
                              {agent.yearsExperience} years
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/60 text-sm">
                              Response Rate
                            </span>
                            <span className="font-heading font-bold">96%</span>
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
                            {recentActivity.map((item, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-3 relative"
                              >
                                <div
                                  className={`w-9 h-9 rounded-full ${item.bg} flex items-center justify-center ${item.color} shrink-0 relative z-10 border-2 border-[#f5f0eb]`}
                                >
                                  {item.icon}
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
                            ))}
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
                              icon: <PlusCircle className="w-4 h-4" />,
                              label: "Add New Listing",
                              href: "/add-property",
                            },
                            {
                              icon: <Users className="w-4 h-4" />,
                              label: "View All Leads",
                              href: "#",
                            },
                            {
                              icon: <Briefcase className="w-4 h-4" />,
                              label: "Edit Agent Profile",
                              href: `/agent/${agent.id}`,
                            },
                            {
                              icon: <ClipboardList className="w-4 h-4" />,
                              label: "Property Logbook",
                              href: "#",
                            },
                          ].map((action) => (
                            <Link
                              key={action.label}
                              to={action.href}
                              className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 hover:border-primary hover:bg-white/80 hover:-translate-y-0.5 transition-all duration-200"
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
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ─── My Listings Panel ─── */}
          {activeNav === "listings" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
            >
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="px-6 py-5 border-b border-white/30 flex items-center justify-between">
                  <h2 className="font-heading font-bold text-primary-dark text-base">
                    My Listings ({agentListings.length})
                  </h2>
                  <Link
                    to="/add-property"
                    className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors shadow-sm"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Add Listing
                  </Link>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {agentListings.map((listing, idx) => {
                    const reviewStatus =
                      idx === 0 ? "Under Review" : "Approved";
                    const reviewBadge =
                      reviewStatus === "Under Review"
                        ? "bg-[#FFF8ED] text-[#F5A623]"
                        : "bg-primary/10 text-primary";
                    return (
                      <Link
                        key={listing.id}
                        to={`/property/${listing.id}`}
                        className="group bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <div className="h-36 overflow-hidden relative">
                          <img
                            src={listing.coverImage}
                            alt={listing.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-primary/90 text-white text-[10px] font-medium">
                            {listing.type === "SALE" ? "For Sale" : "For Rent"}
                          </span>
                          <span
                            className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-medium ${reviewBadge}`}
                          >
                            {reviewStatus === "Under Review" ? (
                              <>{reviewStatus}</>
                            ) : (
                              <>{reviewStatus}</>
                            )}
                          </span>
                        </div>
                        <div className="p-3">
                          <p className="font-heading font-bold text-primary-dark text-sm">
                            {listing.priceLabel}
                          </p>
                          <p className="text-primary-dark text-xs leading-snug mt-0.5 truncate">
                            {listing.title}
                          </p>
                          <p className="text-text-secondary text-xs mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {listing.location}
                          </p>
                          <div className="flex items-center gap-3 text-text-secondary text-[11px] mt-1.5">
                            <span className="flex items-center gap-1">
                              <Bed className="w-3 h-3" /> {listing.beds}
                            </span>
                            <span className="flex items-center gap-1">
                              <Bath className="w-3 h-3" /> {listing.baths}
                            </span>
                            <span className="flex items-center gap-1">
                              <Maximize className="w-3 h-3" /> {listing.sqft}m²
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-[11px]">
                            <span className="flex items-center gap-1 text-text-secondary">
                              <Eye className="w-3 h-3" /> 142 views
                            </span>
                            <span className="flex items-center gap-1 text-text-secondary">
                              <Users className="w-3 h-3" /> 8 leads
                            </span>
                            <span
                              className={`ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full ${reviewBadge}`}
                            >
                              {reviewStatus === "Under Review" ? (
                                <Clock className="w-3 h-3" />
                              ) : (
                                <CheckCircle className="w-3 h-3" />
                              )}
                              {reviewStatus}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                {agentListings.length === 0 && (
                  <div className="text-center py-16">
                    <Home className="w-12 h-12 text-text-subtle mx-auto mb-3" />
                    <p className="text-primary-dark font-heading font-bold text-base">
                      No listings yet
                    </p>
                    <p className="text-text-secondary text-sm mt-1">
                      Add your first property listing
                    </p>
                    <Link
                      to="/add-property"
                      className="mt-4 inline-flex items-center gap-2 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
                    >
                      <PlusCircle className="w-4 h-4" /> Add Listing
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ─── Leads Panel ─── */}
          {activeNav === "leads" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
            >
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="px-6 py-5 border-b border-white/30 flex items-center justify-between">
                  <h2 className="font-heading font-bold text-primary-dark text-base">
                    All Leads ({recentLeads.length})
                  </h2>
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                    12 new this week
                  </span>
                </div>
                <div className="divide-y divide-white/30">
                  {recentLeads.map((lead, i) => (
                    <div
                      key={i}
                      className="px-6 py-4 flex items-center gap-4 hover:bg-white/30 transition-colors"
                    >
                      <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                        {lead.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-semibold text-primary-dark text-sm">
                          {lead.name}
                        </p>
                        <p className="text-text-secondary text-xs truncate">
                          {lead.property}
                        </p>
                        <p className="text-text-subtle text-[11px] mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {lead.time}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${statusColors[lead.status]}`}
                      >
                        {lead.status}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={`tel:${lead.phone}`}
                          className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Analytics Panel ─── */}
          {activeNav === "analytics" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
              className="flex flex-col gap-6"
            >
              {/* Stats */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((s, i) => (
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
                    <p className="text-primary text-[11px] font-medium mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> {s.change}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col xl:flex-row gap-6">
                {/* Performance Breakdown */}
                <div className="flex-1 bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6">
                  <h3 className="font-heading font-bold text-primary-dark text-base mb-5">
                    Performance Overview
                  </h3>
                  <div className="flex flex-col gap-4">
                    {[
                      {
                        label: "Total Listings",
                        value: String(apiStats?.listings.total ?? 0),
                        sub: `${apiStats?.listings.active ?? 0} active`,
                      },
                      {
                        label: "Total Views",
                        value: (
                          apiStats?.listings.totalViews ?? 0
                        ).toLocaleString(),
                        sub: "across all listings",
                      },
                      {
                        label: "Total Leads",
                        value: String(apiStats?.leads.total ?? 0),
                        sub: `${apiStats?.leads.new ?? 0} new`,
                      },
                      {
                        label: "Conversion Rate",
                        value: `${apiStats?.leads.conversionRate ?? 0}%`,
                        sub: `${apiStats?.leads.converted ?? 0} converted`,
                      },
                      {
                        label: "Viewings",
                        value: String(apiStats?.viewings.total ?? 0),
                        sub: `${apiStats?.viewings.upcoming ?? 0} upcoming`,
                      },
                      {
                        label: "Deals Closed",
                        value: String(apiStats?.profile.soldRentedCount ?? 0),
                        sub: `${apiStats?.profile.yearsExperience ?? 0} yrs experience`,
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 border-b border-white/20 last:border-0"
                      >
                        <span className="text-text-secondary text-sm">
                          {item.label}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="font-heading font-bold text-primary-dark text-sm">
                            {item.value}
                          </span>
                          <span className="text-text-secondary text-xs">
                            {item.sub}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lead Funnel */}
                <div className="xl:w-90 shrink-0 bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6">
                  <h3 className="font-heading font-bold text-primary-dark text-base mb-5">
                    Lead Funnel
                  </h3>
                  <div className="flex flex-col gap-3">
                    {(() => {
                      const totalLeads = apiStats?.leads.total || 1;
                      const newLeads = apiStats?.leads.new ?? 0;
                      const converted = apiStats?.leads.converted ?? 0;
                      const pending = totalLeads - newLeads - converted;
                      return [
                        {
                          source: "New Leads",
                          count: newLeads,
                          pct: Math.round((newLeads / totalLeads) * 100),
                          color: "bg-primary",
                        },
                        {
                          source: "In Progress",
                          count: Math.max(0, pending),
                          pct: Math.round(
                            (Math.max(0, pending) / totalLeads) * 100,
                          ),
                          color: "bg-[#F5A623]",
                        },
                        {
                          source: "Converted",
                          count: converted,
                          pct: Math.round((converted / totalLeads) * 100),
                          color: "bg-green-500",
                        },
                      ];
                    })().map((item, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-primary-dark font-medium">
                            {item.source}
                          </span>
                          <span className="text-xs text-text-secondary">
                            {item.count} leads ({item.pct}%)
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-white/50 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${item.color}`}
                            style={{ width: `${item.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Messages Panel ─── */}
          {activeNav === "messages" &&
            (() => {
              const activeConvo =
                agentConversations.find((c) => c.id === selectedConvo) ||
                agentConversations[0];
              const convoId = activeConvo?.id || "";
              const activeMessages = localMessages[convoId] || [];

              // Load messages when conversation is selected
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
                      {/* Left: List */}
                      <div
                        className={`${mobileChat ? "hidden md:flex" : "flex"} flex-col w-full md:w-85 lg:w-90 shrink-0 border-r border-white/30 bg-white/30 backdrop-blur-sm`}
                      >
                        <div className="px-4 pt-4 pb-3 border-b border-white/30">
                          <p className="font-heading font-bold text-primary-dark text-sm">
                            Conversations
                          </p>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                          {agentConversations.map((convo) => (
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
                                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold shrink-0 bg-blue-50 text-blue-600">
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
                              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold shrink-0 bg-blue-50 text-blue-600">
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

          {/* ─── Viewings Panel ─── */}
          {activeNav === "viewings" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
            >
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="px-6 py-5 border-b border-white/30 flex items-center justify-between">
                  <h2 className="font-heading font-bold text-primary-dark text-base">
                    Upcoming Viewings ({upcomingViewings.length})
                  </h2>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  {upcomingViewings.map((v, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl p-4 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all"
                    >
                      <div className="w-14 h-16 rounded-xl bg-primary/10 flex flex-col items-center justify-center shrink-0">
                        <span className="font-heading font-bold text-primary text-base leading-none">
                          {v.date.split(" ")[1]}
                        </span>
                        <span className="text-primary text-[10px] mt-0.5">
                          {v.date.split(" ")[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-semibold text-primary-dark text-sm">
                          {v.property}
                        </p>
                        <p className="text-text-secondary text-xs mt-0.5">
                          {v.time} · {v.client}
                        </p>
                        <span
                          className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${v.status === "Confirmed" ? "bg-primary/10 text-primary" : "bg-[#FFF8ED] text-[#F5A623]"}`}
                        >
                          {v.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={`tel:${v.phone}`}
                          className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── Documents Panel ─── */}
          {activeNav === "documents" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
            >
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="px-6 py-5 border-b border-white/30 flex items-center justify-between">
                  <h2 className="font-heading font-bold text-primary-dark text-base">
                    Documents ({documents.length})
                  </h2>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload
                  </button>
                </div>

                {documents.length === 0 ? (
                  <div className="px-6 py-16 text-center">
                    <div className="w-14 h-14 rounded-full bg-bg-accent border border-border-light flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-6 h-6 text-text-subtle" />
                    </div>
                    <p className="font-heading font-bold text-primary-dark text-sm">
                      No documents yet
                    </p>
                    <p className="text-text-secondary text-xs mt-1.5 max-w-xs mx-auto">
                      Upload C of O, survey plans, building permits, and
                      receipts for your properties.
                    </p>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="mt-5 h-9 px-5 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors"
                    >
                      Upload your first document
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-white/30">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="px-6 py-4 flex items-center gap-4 hover:bg-white/30 transition-colors"
                      >
                        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-heading font-semibold text-primary-dark text-sm truncate">
                              {doc.name}
                            </p>
                            {doc.verified && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                                <CheckCircle className="w-3 h-3" /> Verified
                              </span>
                            )}
                          </div>
                          <p className="text-text-secondary text-xs mt-0.5">
                            {doc.type} · {doc.listingTitle}
                          </p>
                        </div>
                        <span className="text-text-subtle text-xs shrink-0 hidden sm:block">
                          {doc.date}
                        </span>
                        <button
                          onClick={() =>
                            handleRemoveDocument(doc.listingId, doc.id)
                          }
                          className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upload Modal */}
              <AnimatePresence>
                {showUploadModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
                    onClick={() => setShowUploadModal(false)}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      transition={{ duration: 0.3, ease }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-[0_16px_64px_rgba(0,0,0,0.15)] p-6 sm:p-8"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-heading font-bold text-primary-dark text-lg">
                          Upload Document
                        </h3>
                        <button
                          onClick={() => setShowUploadModal(false)}
                          className="w-8 h-8 rounded-full bg-bg-accent flex items-center justify-center text-text-subtle hover:text-primary-dark transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex flex-col gap-4">
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            Property
                          </label>
                          <select
                            value={uploadListingId}
                            onChange={(e) => setUploadListingId(e.target.value)}
                            className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors appearance-none"
                          >
                            <option value="">Select a listing…</option>
                            {agentListings.map((l) => (
                              <option key={l.id} value={l.id}>
                                {l.title}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            Document Name
                          </label>
                          <input
                            type="text"
                            value={uploadDocName}
                            onChange={(e) => setUploadDocName(e.target.value)}
                            placeholder="e.g. Certificate of Occupancy – Plot 14"
                            className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            Document Type
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {(
                              [
                                {
                                  value: "C_OF_O",
                                  label: "C of O",
                                  icon: "📜",
                                },
                                {
                                  value: "SURVEY_PLAN",
                                  label: "Survey Plan",
                                  icon: "📐",
                                },
                                {
                                  value: "BUILDING_PERMIT",
                                  label: "Building Permit",
                                  icon: "🏗️",
                                },
                                {
                                  value: "RECEIPT",
                                  label: "Receipt",
                                  icon: "🧾",
                                },
                              ] as const
                            ).map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => setUploadDocType(opt.value)}
                                className={`h-11 rounded-2xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                  uploadDocType === opt.value
                                    ? "bg-primary text-white border-primary shadow-lg shadow-glow/30"
                                    : "bg-white/60 border-border-light text-primary-dark hover:border-primary/40"
                                }`}
                              >
                                <span>{opt.icon}</span> {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-6">
                        <button
                          onClick={handleUploadDocument}
                          disabled={
                            uploading ||
                            !uploadListingId ||
                            !uploadDocName.trim()
                          }
                          className="flex-1 h-11 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 shadow-lg shadow-glow/30"
                        >
                          {uploading ? (
                            <>
                              <Clock className="w-4 h-4 animate-spin" />{" "}
                              Uploading…
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" /> Upload Document
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setShowUploadModal(false)}
                          className="h-11 px-5 rounded-full border border-border-light bg-white/60 text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
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
              {/* Agent Profile */}
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                <h3 className="font-heading font-bold text-primary-dark text-base mb-6">
                  Agent Profile
                </h3>

                {profileMessage && (
                  <div
                    className={`mb-6 p-4 rounded-xl ${
                      profileMessage.type === "success"
                        ? "bg-green-50 border border-green-200 text-green-800"
                        : "bg-red-50 border border-red-200 text-red-800"
                    } text-sm`}
                  >
                    {profileMessage.text}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-primary-dark mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 text-sm text-primary-dark placeholder:text-text-subtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-dark mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full h-11 px-4 rounded-xl bg-white/30 border border-white/40 text-sm text-text-subtle opacity-60 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-dark mb-1.5">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 text-sm text-primary-dark placeholder:text-text-subtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-dark mb-1.5">
                      Agency Name
                    </label>
                    <input
                      type="text"
                      value={profileAgency}
                      onChange={(e) => setProfileAgency(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 text-sm text-primary-dark placeholder:text-text-subtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-dark mb-1.5">
                      Location
                    </label>
                    <input
                      type="text"
                      value={profileLocation}
                      onChange={(e) => setProfileLocation(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 text-sm text-primary-dark placeholder:text-text-subtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-dark mb-1.5">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={profileYears}
                      onChange={(e) => setProfileYears(parseInt(e.target.value) || 0)}
                      className="w-full h-11 px-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 text-sm text-primary-dark placeholder:text-text-subtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-dark mb-1.5">
                      Website
                    </label>
                    <input
                      type="url"
                      value={profileWebsite}
                      onChange={(e) => setProfileWebsite(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full h-11 px-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 text-sm text-primary-dark placeholder:text-text-subtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-dark mb-1.5">
                      Specialties (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={profileSpecialties}
                      onChange={(e) => setProfileSpecialties(e.target.value)}
                      placeholder="e.g., Residential, Commercial, Rentals"
                      className="w-full h-11 px-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 text-sm text-primary-dark placeholder:text-text-subtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
                <div className="mt-5">
                  <label className="block text-sm font-medium text-primary-dark mb-1.5">
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    placeholder="Tell your clients about your experience and specialties..."
                    className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border border-white/40 text-sm text-primary-dark placeholder:text-text-subtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  />
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                    className="h-10 px-6 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-glow/30 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setActiveNav("overview")}
                    className="h-10 px-6 rounded-full border border-white/40 bg-white/60 backdrop-blur-sm text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                <h3 className="font-heading font-bold text-primary-dark text-base mb-6">
                  Notifications
                </h3>
                <div className="flex flex-col gap-4">
                  {[
                    {
                      label: "New Lead Alerts",
                      desc: "Get notified when a buyer enquires on your listing",
                    },
                    {
                      label: "Viewing Reminders",
                      desc: "Reminders 1 hour before scheduled viewings",
                    },
                    {
                      label: "Listing Updates",
                      desc: "Alerts when your listing status changes",
                    },
                    {
                      label: "Monthly Performance Report",
                      desc: "Receive a summary of your analytics each month",
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
                        defaultChecked={idx < 2}
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
                  Log out of your agent account.
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

export default AgentDashboard;
