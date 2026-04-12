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
  ArrowLeft,
  Send,
  Download,
  Upload,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/logo.png";
import { getAgentById } from "../data/agents";
import { listings } from "../data/listings";

const ease = [0.23, 1, 0.32, 1] as const;

/* ─── Mock Agent (logged-in agent) ─── */
const agent = getAgentById("adebayo-johnson")!;
const agentListings = listings.filter((l) => l.agentId === agent.id);

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
  {
    name: "Tayo Ogunleye",
    property: "Luxury 3-Bed Flat in Lekki",
    status: "New",
    time: "2 hours ago",
    phone: "+234 801 234 5678",
  },
  {
    name: "Sandra Eze",
    property: "Contemporary Villa with Garden",
    status: "Contacted",
    time: "Yesterday",
    phone: "+234 802 345 6789",
  },
  {
    name: "Ibrahim Sanni",
    property: "Penthouse with Ocean View",
    status: "Viewing",
    time: "2 days ago",
    phone: "+234 803 456 7890",
  },
  {
    name: "Amaka Obi",
    property: "Serviced 3-Bed Flat",
    status: "Negotiating",
    time: "3 days ago",
    phone: "+234 804 567 8901",
  },
];

const statusColors: Record<string, string> = {
  New: "bg-blue-500/10 text-blue-600",
  Contacted: "bg-[#FFF8ED] text-[#F5A623]",
  Viewing: "bg-primary/10 text-primary",
  Negotiating: "bg-purple-50 text-purple-600",
};

/* ─── Mock Activity ─── */
const recentActivity = [
  {
    icon: <Eye className="w-4 h-4" />,
    text: "Tayo Ogunleye viewed Luxury 3-Bed Flat",
    time: "2h ago",
    bg: "bg-primary/10",
    color: "text-primary",
  },
  {
    icon: <Phone className="w-4 h-4" />,
    text: "Missed call from Sandra Eze",
    time: "5h ago",
    bg: "bg-red-50",
    color: "text-red-400",
  },
  {
    icon: <MessageCircle className="w-4 h-4" />,
    text: "New message from Ibrahim Sanni",
    time: "Yesterday",
    bg: "bg-blue-50",
    color: "text-blue-500",
  },
  {
    icon: <Star className="w-4 h-4" />,
    text: "New 5-star review from Kemi Adeyemi",
    time: "2 days ago",
    bg: "bg-[#FFF8ED]",
    color: "text-[#F5A623]",
  },
];

/* ─── Mock Viewings ─── */
const upcomingViewings = [
  {
    date: "Apr 3",
    time: "10:00 AM",
    client: "Tayo Ogunleye",
    property: "Luxury 3-Bed Flat in Lekki",
    phone: "+234 801 234 5678",
    status: "Confirmed",
  },
  {
    date: "Apr 5",
    time: "2:30 PM",
    client: "Sandra Eze",
    property: "Contemporary Villa with Garden",
    phone: "+234 802 345 6789",
    status: "Pending",
  },
  {
    date: "Apr 7",
    time: "11:00 AM",
    client: "Ibrahim Sanni",
    property: "Penthouse with Ocean View",
    phone: "+234 803 456 7890",
    status: "Confirmed",
  },
  {
    date: "Apr 10",
    time: "9:00 AM",
    client: "Amaka Obi",
    property: "Serviced 3-Bed Flat",
    phone: "+234 804 567 8901",
    status: "Pending",
  },
];

/* ─── Mock Documents ─── */
const documents = [
  {
    name: "C of O - Luxury 3-Bed Lekki",
    type: "Certificate of Occupancy",
    date: "Mar 15, 2026",
    size: "2.4 MB",
  },
  {
    name: "Survey Plan - Villa Garden",
    type: "Survey Plan",
    date: "Mar 10, 2026",
    size: "1.8 MB",
  },
  {
    name: "Deed of Assignment - Penthouse VI",
    type: "Deed of Assignment",
    date: "Feb 28, 2026",
    size: "3.1 MB",
  },
  {
    name: "Building Approval - Serviced Flat",
    type: "Building Approval",
    date: "Feb 20, 2026",
    size: "1.2 MB",
  },
  {
    name: "Power of Attorney - Lekki Plot",
    type: "Power of Attorney",
    date: "Jan 15, 2026",
    size: "890 KB",
  },
];

/* ─── Mock Conversations ─── */
const agentConversations = [
  {
    id: "ac-1",
    name: "Tayo Ogunleye",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    role: "Buyer" as const,
    phone: "2348012345678",
    lastMessage: "Is the Lekki flat still available?",
    time: "10 min ago",
    unread: 2,
    messages: [
      {
        sender: "them" as const,
        text: "Good morning, I saw the Luxury 3-Bed Flat listing in Lekki.",
        time: "Yesterday, 9:15 AM",
      },
      {
        sender: "you" as const,
        text: "Hello Tayo! Yes, it's still available. Would you like to schedule a viewing?",
        time: "Yesterday, 10:02 AM",
      },
      {
        sender: "them" as const,
        text: "Yes please! I'm free Thursday morning.",
        time: "Yesterday, 10:30 AM",
      },
      {
        sender: "them" as const,
        text: "Is the Lekki flat still available?",
        time: "10 min ago",
      },
    ],
  },
  {
    id: "ac-2",
    name: "Sandra Eze",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    role: "Buyer" as const,
    phone: "2348023456789",
    lastMessage: "Can we negotiate the price for the villa?",
    time: "2 hours ago",
    unread: 1,
    messages: [
      {
        sender: "them" as const,
        text: "Hi, I'm interested in the Contemporary Villa with Garden.",
        time: "Today, 8:00 AM",
      },
      {
        sender: "you" as const,
        text: "Great choice! The asking price is ₦185M. Would you like to view it?",
        time: "Today, 8:45 AM",
      },
      {
        sender: "them" as const,
        text: "Can we negotiate the price for the villa?",
        time: "2 hours ago",
      },
    ],
  },
  {
    id: "ac-3",
    name: "Ibrahim Sanni",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    role: "Renter" as const,
    phone: "2348034567890",
    lastMessage: "I'll take the penthouse. Let's proceed with the paperwork.",
    time: "Yesterday",
    unread: 0,
    messages: [
      {
        sender: "them" as const,
        text: "Hello, I viewed the Penthouse yesterday and I'm very impressed.",
        time: "Mon, 2:00 PM",
      },
      {
        sender: "you" as const,
        text: "Glad to hear that! Would you like to make an offer?",
        time: "Mon, 2:30 PM",
      },
      {
        sender: "them" as const,
        text: "I'll take the penthouse. Let's proceed with the paperwork.",
        time: "Yesterday",
      },
    ],
  },
  {
    id: "ac-4",
    name: "Amaka Obi",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
    role: "Buyer" as const,
    phone: "2348045678901",
    lastMessage: "What documents do I need for the purchase?",
    time: "2 days ago",
    unread: 0,
    messages: [
      {
        sender: "them" as const,
        text: "I want to go ahead with buying the Serviced 3-Bed Flat.",
        time: "Sat, 10:00 AM",
      },
      {
        sender: "you" as const,
        text: "Wonderful! I'll prepare the documentation. You'll need a valid ID and proof of funds.",
        time: "Sat, 10:30 AM",
      },
      {
        sender: "them" as const,
        text: "What documents do I need for the purchase?",
        time: "2 days ago",
      },
    ],
  },
];

/* ─── Component ─── */

const AgentDashboard = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("overview");
  const [selectedConvo, setSelectedConvo] = useState(agentConversations[0].id);
  const [chatInput, setChatInput] = useState("");
  const [localMessages, setLocalMessages] = useState(() =>
    Object.fromEntries(agentConversations.map((c) => [c.id, [...c.messages]])),
  );
  const [mobileChat, setMobileChat] = useState(false);

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
                        <span className="text-white/60 text-sm">Rating</span>
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
                            src={listing.image}
                            alt={listing.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-primary/90 text-white text-[10px] font-medium">
                            {listing.type === "sale" ? "For Sale" : "For Rent"}
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
                            {listing.price}
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
                    Monthly Performance
                  </h3>
                  <div className="flex flex-col gap-4">
                    {[
                      { label: "Properties Listed", value: "12", change: "+3" },
                      { label: "Total Views", value: "4,285", change: "+18%" },
                      { label: "Leads Generated", value: "68", change: "+24%" },
                      {
                        label: "Viewings Scheduled",
                        value: "32",
                        change: "+15%",
                      },
                      { label: "Deals Closed", value: "5", change: "+2" },
                      { label: "Revenue", value: "₦48M", change: "+32%" },
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
                          <span className="text-primary text-xs font-medium flex items-center gap-0.5">
                            <TrendingUp className="w-3 h-3" /> {item.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lead Sources */}
                <div className="xl:w-90 shrink-0 bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6">
                  <h3 className="font-heading font-bold text-primary-dark text-base mb-5">
                    Lead Sources
                  </h3>
                  <div className="flex flex-col gap-3">
                    {[
                      {
                        source: "PropertyLoop Search",
                        count: 34,
                        pct: 50,
                        color: "bg-primary",
                      },
                      {
                        source: "Direct Contact",
                        count: 18,
                        pct: 26,
                        color: "bg-blue-500",
                      },
                      {
                        source: "Referrals",
                        count: 10,
                        pct: 15,
                        color: "bg-[#F5A623]",
                      },
                      {
                        source: "Social Media",
                        count: 6,
                        pct: 9,
                        color: "bg-purple-500",
                      },
                    ].map((item, i) => (
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
              const activeMessages = localMessages[activeConvo.id] || [];

              const handleSend = () => {
                if (!chatInput.trim()) return;
                setLocalMessages((prev) => ({
                  ...prev,
                  [activeConvo.id]: [
                    ...(prev[activeConvo.id] || []),
                    {
                      sender: "you" as const,
                      text: chatInput.trim(),
                      time: "Just now",
                    },
                  ],
                }));
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
                  <button className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors shadow-sm">
                    <Upload className="w-3.5 h-3.5" /> Upload
                  </button>
                </div>
                <div className="divide-y divide-white/30">
                  {documents.map((doc, i) => (
                    <div
                      key={i}
                      className="px-6 py-4 flex items-center gap-4 hover:bg-white/30 transition-colors"
                    >
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-semibold text-primary-dark text-sm truncate">
                          {doc.name}
                        </p>
                        <p className="text-text-secondary text-xs mt-0.5">
                          {doc.type} · {doc.size}
                        </p>
                      </div>
                      <span className="text-text-subtle text-xs shrink-0 hidden sm:block">
                        {doc.date}
                      </span>
                      <button className="w-8 h-8 rounded-lg bg-white/50 backdrop-blur-sm border border-white/40 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shrink-0">
                        <Download className="w-3.5 h-3.5" />
                      </button>
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
              {/* Agent Profile */}
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                <h3 className="font-heading font-bold text-primary-dark text-base mb-6">
                  Agent Profile
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    {
                      label: "Full Name",
                      value: user?.name || agent.name,
                      type: "text",
                    },
                    { label: "Email", value: user?.email || "", type: "email" },
                    {
                      label: "Phone",
                      value: agent.phone || "+234 801 234 5678",
                      type: "tel",
                    },
                    {
                      label: "Agency",
                      value: agent.agency || "Independent",
                      type: "text",
                    },
                    {
                      label: "Location",
                      value: agent.location || "Lagos, Nigeria",
                      type: "text",
                    },
                    {
                      label: "License No.",
                      value: "LG/RE/2024/0847",
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
                <div className="mt-5">
                  <label className="block text-sm font-medium text-primary-dark mb-1.5">
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    defaultValue={
                      agent.bio ||
                      "Experienced real estate agent specialising in residential and commercial properties across Lagos."
                    }
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
