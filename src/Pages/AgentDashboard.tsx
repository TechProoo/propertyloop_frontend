import { useState } from "react";
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
} from "lucide-react";
import Logo from "../assets/logo.png";
import { getAgentById } from "../data/agents";
import { listings } from "../data/listings";

const ease = [0.23, 1, 0.32, 1] as const;

/* ─── Mock Agent (logged-in agent) ─── */
const agent = getAgentById("adebayo-johnson")!;
const agentListings = listings.filter((l) => l.agentId === agent.id);

/* ─── Sidebar Nav Items ─── */
const navItems = [
  { icon: <LayoutDashboard className="w-5 h-5" />, label: "Overview", id: "overview" },
  { icon: <Home className="w-5 h-5" />, label: "My Listings", id: "listings" },
  { icon: <Users className="w-5 h-5" />, label: "Leads", id: "leads" },
  { icon: <BarChart3 className="w-5 h-5" />, label: "Analytics", id: "analytics" },
  { icon: <MessageCircle className="w-5 h-5" />, label: "Messages", id: "messages" },
  { icon: <Calendar className="w-5 h-5" />, label: "Viewings", id: "viewings" },
  { icon: <FileText className="w-5 h-5" />, label: "Documents", id: "documents" },
  { icon: <Settings className="w-5 h-5" />, label: "Settings", id: "settings" },
];

/* ─── Mock Stats ─── */
const stats = [
  {
    icon: <Home className="w-5 h-5" />,
    value: String(agent.listings),
    label: "Active Listings",
    change: "+3 this month",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: <Users className="w-5 h-5" />,
    value: "28",
    label: "Active Leads",
    change: "+12 this week",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: <Eye className="w-5 h-5" />,
    value: "1,847",
    label: "Profile Views",
    change: "+18% vs last month",
    color: "text-[#F5A623]",
    bg: "bg-[#FFF8ED]",
  },
  {
    icon: <DollarSign className="w-5 h-5" />,
    value: "₦2.4B",
    label: "Total Sales Volume",
    change: `${agent.soldRented} deals closed`,
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

/* ─── Mock Leads ─── */
const recentLeads = [
  { name: "Tayo Ogunleye", property: "Luxury 3-Bed Flat in Lekki", status: "New", time: "2 hours ago", phone: "+234 801 234 5678" },
  { name: "Sandra Eze", property: "Contemporary Villa with Garden", status: "Contacted", time: "Yesterday", phone: "+234 802 345 6789" },
  { name: "Ibrahim Sanni", property: "Penthouse with Ocean View", status: "Viewing", time: "2 days ago", phone: "+234 803 456 7890" },
  { name: "Amaka Obi", property: "Serviced 3-Bed Flat", status: "Negotiating", time: "3 days ago", phone: "+234 804 567 8901" },
];

const statusColors: Record<string, string> = {
  New: "bg-blue-500/10 text-blue-600",
  Contacted: "bg-[#FFF8ED] text-[#F5A623]",
  Viewing: "bg-primary/10 text-primary",
  Negotiating: "bg-purple-50 text-purple-600",
};

/* ─── Mock Activity ─── */
const recentActivity = [
  { icon: <Eye className="w-4 h-4" />, text: "Tayo Ogunleye viewed Luxury 3-Bed Flat", time: "2h ago", bg: "bg-primary/10", color: "text-primary" },
  { icon: <Phone className="w-4 h-4" />, text: "Missed call from Sandra Eze", time: "5h ago", bg: "bg-red-50", color: "text-red-400" },
  { icon: <MessageCircle className="w-4 h-4" />, text: "New message from Ibrahim Sanni", time: "Yesterday", bg: "bg-blue-50", color: "text-blue-500" },
  { icon: <Star className="w-4 h-4" />, text: "New 5-star review from Kemi Adeyemi", time: "2 days ago", bg: "bg-[#FFF8ED]", color: "text-[#F5A623]" },
];

/* ─── Component ─── */

const AgentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("overview");

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
        <div className="flex items-center justify-between px-4 py-5 border-b" style={{ borderColor: "hsl(160, 20%, 22%)" }}>
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
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
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
        <div className="px-3 py-4 border-t" style={{ borderColor: "hsl(160, 20%, 22%)" }}>
          <div className={`flex items-center gap-3 ${!sidebarOpen ? "justify-center" : ""}`}>
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
              <Link to="/" className="text-white/40 hover:text-white transition-colors">
                <LogOut className="w-4 h-4" />
              </Link>
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
              className="fixed left-0 top-0 bottom-0 w-[260px] z-50 lg:hidden flex flex-col"
              style={{ background: "hsl(160, 30%, 12%)" }}
            >
              <div className="flex items-center justify-between px-4 py-5 border-b" style={{ borderColor: "hsl(160, 20%, 22%)" }}>
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
                    <div className={activeNav === item.id ? "text-[hsl(142,71%,45%)]" : ""}>
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="px-3 py-4 border-t" style={{ borderColor: "hsl(160, 20%, 22%)" }}>
                <div className="flex items-center gap-3">
                  <img src={agent.photo} alt={agent.name} className="w-9 h-9 rounded-full object-cover object-top border-2" style={{ borderColor: "hsl(160, 25%, 20%)" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{agent.name}</p>
                    <p className="text-white/40 text-[11px] truncate">{agent.agency}</p>
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
        <div className="sticky top-0 z-30 bg-[#f5f0eb]/80 backdrop-blur-md border-b border-border-light px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl bg-white/80 border border-border-light flex items-center justify-center text-primary-dark hover:bg-primary hover:text-white transition-all"
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
            <button className="relative w-9 h-9 rounded-xl bg-white/80 border border-border-light flex items-center justify-center text-text-secondary hover:bg-white transition-all">
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
                    <div className={`w-10 h-10 rounded-2xl ${s.bg} flex items-center justify-center ${s.color} mb-3`}>
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
                    <div className="px-6 py-5 border-b border-border-light flex items-center justify-between">
                      <h3 className="font-heading font-bold text-primary-dark text-base">
                        Recent Leads
                      </h3>
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                        12 new
                      </span>
                    </div>
                    <div className="divide-y divide-border-light">
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
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${statusColors[lead.status]}`}>
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
                    <div className="px-6 py-3 border-t border-border-light">
                      <button className="text-primary text-xs font-medium hover:underline flex items-center gap-1">
                        View all leads
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* My Listings */}
                  <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                    <div className="px-6 py-5 border-b border-border-light flex items-center justify-between">
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
                          className="group flex gap-4 bg-white/60 backdrop-blur-sm border border-border-light rounded-2xl p-3 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
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
                            <p className="font-heading font-semibold text-primary-dark text-xs leading-snug mt-0.5 truncate">
                              {listing.title}
                            </p>
                            <p className="text-text-secondary text-[11px] mt-0.5 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {listing.location}
                            </p>
                            <div className="flex items-center gap-3 text-text-secondary text-[11px] mt-1.5">
                              <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{listing.beds}</span>
                              <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{listing.baths}</span>
                              <span className="flex items-center gap-1"><Maximize className="w-3 h-3" />{listing.sqft}m²</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                      {agentListings.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-text-secondary text-sm">No listings yet</p>
                          <Link to="/add-property" className="text-primary text-xs font-medium mt-2 inline-flex items-center gap-1">
                            Add your first listing <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="xl:w-[360px] shrink-0 flex flex-col gap-6">
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
                          <span className="font-heading font-bold">{agent.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">Deals Closed</span>
                        <span className="font-heading font-bold">{agent.soldRented}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">Experience</span>
                        <span className="font-heading font-bold">{agent.yearsExperience} years</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">Response Rate</span>
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
                      <div className="absolute left-[18px] top-2 bottom-2 w-px bg-border-light" />
                      <div className="flex flex-col gap-4">
                        {recentActivity.map((item, i) => (
                          <div key={i} className="flex items-start gap-3 relative">
                            <div className={`w-9 h-9 rounded-full ${item.bg} flex items-center justify-center ${item.color} shrink-0 relative z-10 border-2 border-[#f5f0eb]`}>
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
                        { icon: <PlusCircle className="w-4 h-4" />, label: "Add New Listing", href: "/add-property" },
                        { icon: <Users className="w-4 h-4" />, label: "View All Leads", href: "#" },
                        { icon: <Briefcase className="w-4 h-4" />, label: "Edit Agent Profile", href: `/agent/${agent.id}` },
                        { icon: <ClipboardList className="w-4 h-4" />, label: "Property Logbook", href: "#" },
                      ].map((action) => (
                        <Link
                          key={action.label}
                          to={action.href}
                          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl bg-white/60 border border-border-light hover:border-primary hover:bg-white/80 hover:-translate-y-0.5 transition-all duration-200"
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
            </motion.div>
          )}

          {/* ─── Placeholder for other tabs ─── */}
          {activeNav !== "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease }}
              className="flex flex-col items-center justify-center py-20"
            >
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
                className="mt-4 h-10 px-6 rounded-full border border-border-light bg-white/80 text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all"
              >
                Back to Overview
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
