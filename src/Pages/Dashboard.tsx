import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  Bell,
  Calendar,
  MessageCircle,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Star,
  Phone,
  CheckCircle,
  ArrowRight,
  ArrowUpRight,
  X,
  Eye,
  Bookmark,
  Send,
  Search,
  Users,
  Wrench,
  Plus,
  TrendingDown,
  Home,
  Clock,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { listings } from "../data/listings";
import { getAgentById } from "../data/agents";

const ease = [0.23, 1, 0.32, 1] as const;

/* ─── Mock Data ─── */

const user = {
  name: "Olumide Adeyemi",
  email: "olumide@email.com",
  initials: "OA",
  memberSince: "January 2026",
  savedCount: 6,
  alertsCount: 3,
  viewingsCount: 2,
  messagesCount: 5,
};

const savedListings = listings.slice(0, 3);
const myAgent = getAgentById("adebayo-johnson");

const recentActivity = [
  {
    icon: <Eye className="w-4 h-4" />,
    title: "Viewed Luxury 3-Bed Flat in Lekki",
    time: "2 hours ago",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: <Bookmark className="w-4 h-4" />,
    title: "Saved Penthouse with Ocean View",
    time: "Yesterday",
    color: "text-[#F5A623]",
    bg: "bg-[#FFF8ED]",
  },
  {
    icon: <Send className="w-4 h-4" />,
    title: "Contacted Adebayo Johnson",
    time: "2 days ago",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: <Calendar className="w-4 h-4" />,
    title: "Scheduled viewing for Contemporary Villa",
    time: "3 days ago",
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

const upcomingViewings = [
  {
    date: "Apr 2",
    time: "10:00 AM",
    property: "Luxury 3-Bed Flat in Lekki",
    agent: "Adebayo Johnson",
    propertyId: "luxury-3bed-lekki",
  },
  {
    date: "Apr 5",
    time: "2:30 PM",
    property: "Contemporary Villa with Garden",
    agent: "Adebayo Johnson",
    propertyId: "villa-garden-lekki",
  },
];

const quickActions = [
  {
    icon: <Search className="w-5 h-5" />,
    label: "Browse Properties",
    href: "/buy",
  },
  {
    icon: <Users className="w-5 h-5" />,
    label: "Find an Agent",
    href: "/find-agent",
  },
  {
    icon: <Wrench className="w-5 h-5" />,
    label: "Book a Service",
    href: "/services",
  },
  {
    icon: <Plus className="w-5 h-5" />,
    label: "List a Property",
    href: "/add-property",
  },
];

const stats = [
  {
    icon: <Heart className="w-5 h-5" />,
    value: String(user.savedCount),
    label: "Saved Properties",
    color: "text-red-400",
    bg: "bg-red-50",
  },
  {
    icon: <Bell className="w-5 h-5" />,
    value: `${user.alertsCount} new`,
    label: "Property Alerts",
    color: "text-[#F5A623]",
    bg: "bg-[#FFF8ED]",
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    value: String(user.viewingsCount),
    label: "Viewings Scheduled",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: <MessageCircle className="w-5 h-5" />,
    value: `${user.messagesCount} unread`,
    label: "Messages",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
];

/* ─── Component ─── */

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />

      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-7xl mx-auto">
          {/* ─── Welcome Header ─── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
            className="mb-8"
          >
            <h1 className="font-heading text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
              Welcome back,{" "}
              <span className="text-primary">
                {user.name.split(" ")[0]}
              </span>
            </h1>
            <p className="text-text-secondary text-sm mt-2">
              Here's what's happening with your property search
            </p>
          </motion.div>

          {/* ─── Stats Row ─── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.4, ease }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {stats.map((s, i) => (
              <div
                key={i}
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
              </div>
            ))}
          </motion.div>

          {/* ─── Two-Column Layout ─── */}
          <div className="flex flex-col lg:flex-row gap-8 mb-20">
            {/* Left Column */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Saved Properties */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4, ease }}
                className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden"
              >
                <div className="px-6 py-5 border-b border-border-light flex items-center justify-between">
                  <h2 className="font-heading font-bold text-primary-dark text-lg">
                    Saved Properties
                  </h2>
                  <Link
                    to="/buy"
                    className="text-primary text-xs font-medium hover:underline"
                  >
                    View all
                  </Link>
                </div>
                <div className="p-4 flex flex-col gap-4">
                  {savedListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="group flex gap-4 bg-white/60 backdrop-blur-sm border border-border-light rounded-2xl p-3 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 relative"
                    >
                      <Link
                        to={`/property/${listing.id}`}
                        className="flex gap-4 flex-1 min-w-0"
                      >
                        <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 relative">
                          <img
                            src={listing.image}
                            alt={listing.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-full bg-primary/90 text-white text-[10px] font-medium">
                            {listing.type === "sale"
                              ? "Sale"
                              : listing.type === "rent"
                                ? "Rent"
                                : "Shortlet"}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 py-0.5">
                          <p className="font-heading font-bold text-primary-dark text-[15px]">
                            {listing.price}
                            {listing.period && (
                              <span className="text-text-secondary text-xs font-normal">
                                {" "}
                                /{listing.period}
                              </span>
                            )}
                          </p>
                          <p className="font-heading font-semibold text-primary-dark text-sm leading-snug mt-0.5 truncate">
                            {listing.title}
                          </p>
                          <p className="text-text-secondary text-xs mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {listing.location}
                          </p>
                          {listing.beds > 0 && (
                            <div className="flex items-center gap-3 text-text-secondary text-[11px] mt-2">
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
                          )}
                        </div>
                      </Link>
                      <button className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/80 border border-border-light flex items-center justify-center text-text-subtle hover:text-red-400 hover:border-red-300 transition-colors opacity-0 group-hover:opacity-100">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4, ease }}
                className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8"
              >
                <h2 className="font-heading font-bold text-primary-dark text-lg mb-5">
                  Recent Activity
                </h2>
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-[18px] top-2 bottom-2 w-px bg-border-light" />

                  <div className="flex flex-col gap-5">
                    {recentActivity.map((item, i) => (
                      <div key={i} className="flex items-start gap-4 relative">
                        <div
                          className={`w-9 h-9 rounded-full ${item.bg} flex items-center justify-center ${item.color} shrink-0 relative z-10 border-2 border-[#f5f0eb]`}
                        >
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <p className="text-primary-dark text-sm font-medium">
                            {item.title}
                          </p>
                          <p className="text-text-subtle text-xs mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Neighbourhood Alerts */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4, ease }}
                className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8"
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-heading font-bold text-primary-dark text-lg">
                    Alerts
                  </h2>
                  <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    3 new
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3 bg-white/60 border border-border-light rounded-2xl p-4 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-primary-dark text-sm font-medium">
                        3 new properties in Lekki
                      </p>
                      <p className="text-text-secondary text-xs mt-0.5">
                        Matching your saved search criteria
                      </p>
                    </div>
                    <Link
                      to="/buy"
                      className="text-primary shrink-0 hover:scale-110 transition-transform"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="flex items-start gap-3 bg-white/60 border border-border-light rounded-2xl p-4 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all">
                    <div className="w-9 h-9 rounded-xl bg-[#FFF8ED] flex items-center justify-center text-[#F5A623] shrink-0">
                      <TrendingDown className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-primary-dark text-sm font-medium">
                        Price drop on Victoria Island Penthouse
                      </p>
                      <p className="text-text-secondary text-xs mt-0.5">
                        ₦120,000,000 → ₦115,000,000
                      </p>
                    </div>
                    <Link
                      to="/property/penthouse-ocean-vi"
                      className="text-primary shrink-0 hover:scale-110 transition-transform"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="flex items-start gap-3 bg-white/60 border border-border-light rounded-2xl p-4 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Home className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-primary-dark text-sm font-medium">
                        New shortlet available in Ikoyi
                      </p>
                      <p className="text-text-secondary text-xs mt-0.5">
                        ₦65,000/night — 2 beds, verified
                      </p>
                    </div>
                    <Link
                      to="/shortlet"
                      className="text-primary shrink-0 hover:scale-110 transition-transform"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="lg:w-[380px] shrink-0 flex flex-col gap-6">
              {/* My Profile */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4, ease }}
                className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white font-heading font-bold text-lg shadow-lg shadow-glow/30">
                    {user.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-bold text-primary-dark text-sm">
                      {user.name}
                    </p>
                    <p className="text-text-secondary text-xs">{user.email}</p>
                    <p className="text-text-subtle text-[11px] mt-0.5">
                      Member since {user.memberSince}
                    </p>
                  </div>
                </div>
                <button className="w-full h-10 rounded-full bg-white/80 border border-border-light text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                  Edit Profile
                </button>
              </motion.div>

              {/* My Agent */}
              {myAgent && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4, ease }}
                  className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6"
                >
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
                          <Star className="w-3 h-3 text-[#F5A623] fill-[#F5A623]" />
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
                      <Phone className="w-3.5 h-3.5" />
                      Call
                    </a>
                    <a
                      href={`https://wa.me/${myAgent.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 h-10 rounded-full bg-[#25D366] text-white text-sm font-bold hover:bg-[#20bd5a] transition-colors inline-flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp
                    </a>
                  </div>
                  <Link
                    to={`/agent/${myAgent.id}`}
                    className="block text-center text-primary text-xs font-medium mt-3 hover:underline"
                  >
                    View full profile
                  </Link>
                </motion.div>
              )}

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4, ease }}
                className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6"
              >
                <h3 className="font-heading font-bold text-primary-dark text-sm mb-4">
                  Quick Actions
                </h3>
                <div className="flex flex-col gap-2.5">
                  {quickActions.map((action) => (
                    <Link
                      key={action.label}
                      to={action.href}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl bg-white/60 border border-border-light hover:border-primary hover:bg-white/80 hover:shadow-[0_4px_20px_rgba(31,111,67,0.06)] hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        {action.icon}
                      </div>
                      <span className="flex-1 font-heading font-semibold text-primary-dark text-sm">
                        {action.label}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-text-subtle" />
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Upcoming Viewings */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4, ease }}
                className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6"
              >
                <h3 className="font-heading font-bold text-primary-dark text-sm mb-4">
                  Upcoming Viewings
                </h3>
                <div className="flex flex-col gap-3">
                  {upcomingViewings.map((v, i) => (
                    <Link
                      key={i}
                      to={`/property/${v.propertyId}`}
                      className="flex items-center gap-3 bg-white/60 border border-border-light rounded-2xl p-3.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <div className="w-12 h-14 rounded-xl bg-primary/10 flex flex-col items-center justify-center shrink-0">
                        <span className="font-heading font-bold text-primary text-sm leading-none">
                          {v.date.split(" ")[1]}
                        </span>
                        <span className="text-primary text-[10px] mt-0.5">
                          {v.date.split(" ")[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-semibold text-primary-dark text-sm truncate">
                          {v.property}
                        </p>
                        <p className="text-text-secondary text-xs mt-0.5">
                          {v.time} · {v.agent}
                        </p>
                      </div>
                      <Calendar className="w-4 h-4 text-text-subtle shrink-0" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
