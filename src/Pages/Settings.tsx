import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  Bell,
  CreditCard,
  Shield,
  Globe,
  LogOut,
  Camera,
  Mail,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  CheckCircle,
  Trash2,
  Home,
  Briefcase,
  Wrench,
  ChevronRight,
  Save,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

const ease = [0.23, 1, 0.32, 1] as const;

type Tab =
  | "profile"
  | "security"
  | "notifications"
  | "payments"
  | "privacy"
  | "preferences";

const Settings = () => {
  const { user, isLoggedIn, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("profile");
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+234 ");
  const [location, setLocation] = useState("Lagos, Nigeria");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face",
  );

  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(false);
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifPriceAlerts, setNotifPriceAlerts] = useState(true);

  const [twoFactor, setTwoFactor] = useState(false);
  const [profileVisible, setProfileVisible] = useState(true);
  const [shareActivity, setShareActivity] = useState(false);

  const [language, setLanguage] = useState("English");
  const [currency, setCurrency] = useState("NGN (₦)");

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate("/onboarding");
      return;
    }
    if (user) {
      setName(user.name);
      setEmail(user.email);
      const stored = localStorage.getItem("pl_settings");
      if (stored) {
        try {
          const s = JSON.parse(stored);
          if (s.phone) setPhone(s.phone);
          if (s.location) setLocation(s.location);
          if (s.bio) setBio(s.bio);
          if (s.avatar) setAvatar(s.avatar);
        } catch {
          /* ignore */
        }
      }
    }
  }, [user, isLoggedIn, loading, navigate]);

  const handleSave = async () => {
    try {
      await api.patch("/users/me", { name, phone, location, bio, avatarUrl: avatar });
      await api.patch("/users/me/settings", {
        notifEmail, notifSms, notifMessages, notifPriceAlerts, notifMarketing,
        profileVisible, shareActivity, language, currency, twoFactorEnabled: twoFactor,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      /* ignore — show error toast in the future */
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This cannot be undone.",
      )
    ) {
      try {
        await api.delete("/users/me");
      } catch { /* ignore */ }
      await logout();
      navigate("/");
    }
  };

  if (loading) return null;

  const roleInfo: Record<
    string,
    { label: string; icon: React.ReactNode; color: string }
  > = {
    BUYER: {
      label: "Buyer / Renter",
      icon: <Home className="w-4 h-4" />,
      color: "bg-primary/10 text-primary",
    },
    AGENT: {
      label: "Agent",
      icon: <Briefcase className="w-4 h-4" />,
      color: "bg-amber-100 text-amber-700",
    },
    VENDOR: {
      label: "Vendor",
      icon: <Wrench className="w-4 h-4" />,
      color: "bg-blue-100 text-blue-700",
    },
  };

  const currentRole = user ? roleInfo[user.role] : roleInfo.BUYER;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { key: "security", label: "Security", icon: <Lock className="w-4 h-4" /> },
    {
      key: "notifications",
      label: "Notifications",
      icon: <Bell className="w-4 h-4" />,
    },
    {
      key: "payments",
      label: "Payments",
      icon: <CreditCard className="w-4 h-4" />,
    },
    { key: "privacy", label: "Privacy", icon: <Shield className="w-4 h-4" /> },
    {
      key: "preferences",
      label: "Preferences",
      icon: <Globe className="w-4 h-4" />,
    },
  ];

  const Toggle = ({
    on,
    onClick,
  }: {
    on: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`relative w-11 h-6 rounded-full transition-colors ${on ? "bg-primary" : "bg-border-light"}`}
    >
      <span
        className={`absolute top-0.5 ${on ? "left-5.5" : "left-0.5"} w-5 h-5 rounded-full bg-white shadow transition-all`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />
      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">Settings</span>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-heading text-[1.8rem] sm:text-[2.4rem] font-bold text-primary-dark leading-tight tracking-tight">
                Account Settings
              </h1>
              <p className="text-text-secondary text-sm mt-2">
                Manage your profile, preferences, and account security.
              </p>
            </div>
            <AnimatePresence>
              {saved && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
                >
                  <CheckCircle className="w-4 h-4" /> Changes saved
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mb-20">
            {/* Sidebar */}
            <aside className="lg:w-65 shrink-0">
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-5 sticky top-8">
                <div className="flex items-center gap-3 pb-4 border-b border-border-light">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-12 h-12 rounded-full object-cover border border-border-light"
                  />
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-primary-dark text-sm truncate">
                      {name || "Your account"}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${currentRole.color}`}
                    >
                      {currentRole.icon}
                      {currentRole.label}
                    </span>
                  </div>
                </div>
                <nav className="flex flex-col gap-1 mt-4">
                  {tabs.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setTab(t.key)}
                      className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        tab === t.key
                          ? "bg-primary text-white shadow-[0_4px_12px_rgba(31,111,67,0.25)]"
                          : "text-text-secondary hover:bg-bg-accent hover:text-primary-dark"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        {t.icon}
                        {t.label}
                      </span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 ${tab === t.key ? "text-white" : "text-text-subtle"}`}
                      />
                    </button>
                  ))}
                  <div className="h-px bg-border-light my-2" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </nav>
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease }}
                  className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8"
                >
                  {/* PROFILE */}
                  {tab === "profile" && (
                    <>
                      <h2 className="font-heading font-bold text-primary-dark text-xl mb-1">
                        Profile Information
                      </h2>
                      <p className="text-text-secondary text-sm mb-6">
                        This information is visible to other users on the
                        platform.
                      </p>

                      <div className="flex items-center gap-5 mb-6 pb-6 border-b border-border-light">
                        <div className="relative">
                          <img
                            src={avatar}
                            alt={name}
                            className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
                          />
                          <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary-dark transition-colors">
                            <Camera className="w-4 h-4" />
                          </button>
                        </div>
                        <div>
                          <p className="font-heading font-bold text-primary-dark text-sm">
                            Profile photo
                          </p>
                          <p className="text-text-secondary text-xs mt-1">
                            JPG or PNG. Max 2MB.
                          </p>
                          <button className="text-primary text-xs font-medium hover:underline mt-2">
                            Upload new photo
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            Full Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            Phone Number
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            Location
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                            <input
                              type="text"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors"
                            />
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            Bio
                          </label>
                          <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={3}
                            placeholder="Tell others a bit about yourself..."
                            className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors resize-none"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end mt-6 pt-6 border-t border-border-light">
                        <button
                          onClick={handleSave}
                          className="h-11 px-6 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center gap-2 shadow-[0_4px_16px_rgba(31,111,67,0.3)]"
                        >
                          <Save className="w-4 h-4" /> Save changes
                        </button>
                      </div>
                    </>
                  )}

                  {/* SECURITY */}
                  {tab === "security" && (
                    <>
                      <h2 className="font-heading font-bold text-primary-dark text-xl mb-1">
                        Security
                      </h2>
                      <p className="text-text-secondary text-sm mb-6">
                        Keep your account safe with a strong password and
                        two-factor authentication.
                      </p>

                      <div className="flex flex-col gap-5">
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            Current Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                            <input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter current password"
                              className="w-full h-11 pl-10 pr-11 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-subtle hover:text-primary"
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                              New Password
                            </label>
                            <input
                              type="password"
                              placeholder="At least 8 characters"
                              className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                              Confirm Password
                            </label>
                            <input
                              type="password"
                              placeholder="Re-enter new password"
                              className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                            />
                          </div>
                        </div>

                        <div className="bg-bg-accent rounded-2xl border border-border-light p-5 flex items-center justify-between">
                          <div>
                            <p className="font-heading font-bold text-primary-dark text-sm">
                              Two-factor authentication
                            </p>
                            <p className="text-text-secondary text-xs mt-1">
                              Add an extra layer of security to your account.
                            </p>
                          </div>
                          <Toggle
                            on={twoFactor}
                            onClick={() => setTwoFactor(!twoFactor)}
                          />
                        </div>

                        <div className="flex justify-end pt-6 border-t border-border-light">
                          <button
                            onClick={handleSave}
                            className="h-11 px-6 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center gap-2 shadow-[0_4px_16px_rgba(31,111,67,0.3)]"
                          >
                            <Save className="w-4 h-4" /> Update password
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* NOTIFICATIONS */}
                  {tab === "notifications" && (
                    <>
                      <h2 className="font-heading font-bold text-primary-dark text-xl mb-1">
                        Notifications
                      </h2>
                      <p className="text-text-secondary text-sm mb-6">
                        Choose what you want to hear about and how.
                      </p>

                      <div className="flex flex-col gap-3">
                        {[
                          {
                            label: "Email notifications",
                            desc: "Booking confirmations, escrow updates, important account alerts.",
                            on: notifEmail,
                            set: setNotifEmail,
                          },
                          {
                            label: "SMS notifications",
                            desc: "Get text messages for time-sensitive updates only.",
                            on: notifSms,
                            set: setNotifSms,
                          },
                          {
                            label: "New messages",
                            desc: "When agents or vendors send you a message.",
                            on: notifMessages,
                            set: setNotifMessages,
                          },
                          {
                            label: "Price alerts",
                            desc: "When properties on your shortlist drop in price.",
                            on: notifPriceAlerts,
                            set: setNotifPriceAlerts,
                          },
                          {
                            label: "Marketing & newsletters",
                            desc: "Market reports, product updates, occasional offers.",
                            on: notifMarketing,
                            set: setNotifMarketing,
                          },
                        ].map((n) => (
                          <div
                            key={n.label}
                            className="flex items-center justify-between gap-4 px-5 py-4 rounded-2xl bg-bg-accent border border-border-light"
                          >
                            <div className="min-w-0">
                              <p className="font-heading font-bold text-primary-dark text-sm">
                                {n.label}
                              </p>
                              <p className="text-text-secondary text-xs mt-1 leading-relaxed">
                                {n.desc}
                              </p>
                            </div>
                            <Toggle on={n.on} onClick={() => n.set(!n.on)} />
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end mt-6 pt-6 border-t border-border-light">
                        <button
                          onClick={handleSave}
                          className="h-11 px-6 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center gap-2 shadow-[0_4px_16px_rgba(31,111,67,0.3)]"
                        >
                          <Save className="w-4 h-4" /> Save preferences
                        </button>
                      </div>
                    </>
                  )}

                  {/* PAYMENTS */}
                  {tab === "payments" && (
                    <>
                      <h2 className="font-heading font-bold text-primary-dark text-xl mb-1">
                        Payment Methods
                      </h2>
                      <p className="text-text-secondary text-sm mb-6">
                        Cards, bank accounts, and payout details.
                      </p>

                      <div className="bg-bg-accent rounded-2xl border border-border-light p-10 text-center">
                        <div className="w-14 h-14 rounded-full bg-white border border-border-light flex items-center justify-center mx-auto mb-4">
                          <CreditCard className="w-6 h-6 text-text-subtle" />
                        </div>
                        <p className="font-heading font-bold text-primary-dark text-sm">
                          No payment methods yet
                        </p>
                        <p className="text-text-secondary text-xs mt-1.5 max-w-sm mx-auto">
                          Add a card or bank account to speed up checkout and
                          escrow payments.
                        </p>
                        <button className="mt-5 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors">
                          Add payment method
                        </button>
                      </div>
                    </>
                  )}

                  {/* PRIVACY */}
                  {tab === "privacy" && (
                    <>
                      <h2 className="font-heading font-bold text-primary-dark text-xl mb-1">
                        Privacy
                      </h2>
                      <p className="text-text-secondary text-sm mb-6">
                        Control what other users can see about you.
                      </p>

                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-4 px-5 py-4 rounded-2xl bg-bg-accent border border-border-light">
                          <div className="min-w-0">
                            <p className="font-heading font-bold text-primary-dark text-sm">
                              Public profile
                            </p>
                            <p className="text-text-secondary text-xs mt-1 leading-relaxed">
                              Allow agents and vendors to view your basic
                              profile when you contact them.
                            </p>
                          </div>
                          <Toggle
                            on={profileVisible}
                            onClick={() => setProfileVisible(!profileVisible)}
                          />
                        </div>
                        <div className="flex items-center justify-between gap-4 px-5 py-4 rounded-2xl bg-bg-accent border border-border-light">
                          <div className="min-w-0">
                            <p className="font-heading font-bold text-primary-dark text-sm">
                              Share activity
                            </p>
                            <p className="text-text-secondary text-xs mt-1 leading-relaxed">
                              Help us improve recommendations by sharing
                              anonymised browsing activity.
                            </p>
                          </div>
                          <Toggle
                            on={shareActivity}
                            onClick={() => setShareActivity(!shareActivity)}
                          />
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-border-light">
                        <h3 className="font-heading font-bold text-primary-dark text-sm mb-2">
                          Danger Zone
                        </h3>
                        <p className="text-text-secondary text-xs mb-4">
                          Permanently delete your account and all associated
                          data. This cannot be undone.
                        </p>
                        <button
                          onClick={handleDelete}
                          className="h-11 px-6 rounded-full bg-red-50 border border-red-200 text-red-500 text-sm font-bold hover:bg-red-500 hover:text-white hover:border-red-500 transition-all inline-flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Delete account
                        </button>
                      </div>
                    </>
                  )}

                  {/* PREFERENCES */}
                  {tab === "preferences" && (
                    <>
                      <h2 className="font-heading font-bold text-primary-dark text-xl mb-1">
                        Preferences
                      </h2>
                      <p className="text-text-secondary text-sm mb-6">
                        Set your language, currency, and regional defaults.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            Language
                          </label>
                          <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors"
                          >
                            <option>English</option>
                            <option>Yoruba</option>
                            <option>Igbo</option>
                            <option>Hausa</option>
                            <option>French</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            Currency
                          </label>
                          <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors"
                          >
                            <option>NGN (₦)</option>
                            <option>USD ($)</option>
                            <option>GBP (£)</option>
                            <option>EUR (€)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end mt-6 pt-6 border-t border-border-light">
                        <button
                          onClick={handleSave}
                          className="h-11 px-6 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center gap-2 shadow-[0_4px_16px_rgba(31,111,67,0.3)]"
                        >
                          <Save className="w-4 h-4" /> Save preferences
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;
