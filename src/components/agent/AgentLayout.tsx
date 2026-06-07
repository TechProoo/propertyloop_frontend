// Shell for the redesigned, multi-page agent dashboard. Dark emerald
// sidebar with routed NavLinks + a scrollable <Outlet/> main area. Each
// page renders its own header/actions (matching the design bundle).
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutGrid,
  Home,
  BarChart3,
  CalendarDays,
  ClipboardList,
  MessageCircle,
  CreditCard,
  Settings as SettingsIcon,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { C, initials } from "./ui";

const NAV = [
  { to: "overview", label: "Overview", icon: LayoutGrid },
  { to: "listings", label: "My Listings", icon: Home },
  { to: "analytics", label: "Analytics", icon: BarChart3 },
  { to: "viewings", label: "Viewings", icon: CalendarDays },
  { to: "logbook", label: "Logbook", icon: ClipboardList },
  { to: "messages", label: "Messages", icon: MessageCircle },
];

const ACCOUNT_NAV = [
  { to: "subscription", label: "Subscription", icon: CreditCard },
  { to: "settings", label: "Settings", icon: SettingsIcon },
];

export default function AgentLayout() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const tier = user?.agentProfile
    ? // @ts-expect-error subscriptionTier may not be typed on AgentProfile yet
      (user.agentProfile.subscriptionTier as string | undefined)
    : undefined;

  const SidebarInner = (
    <>
      <div className="flex items-center gap-2.5 px-2 pt-1 pb-5">
        <div
          className="w-[34px] h-[34px] rounded-[9px] grid place-items-center"
          style={{ background: C.primary }}
        >
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
            <path d="M4 16a12 12 0 0124 0" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M10 17l6-5 6 5v6h-4v-4h-4v4h-4v-6z" fill="#fff" />
          </svg>
        </div>
        <b className="text-base font-extrabold tracking-tight text-white">
          property<span style={{ color: "#7ad296" }}>loop</span>
        </b>
      </div>

      <nav className="flex flex-col gap-1 mt-1.5 flex-1">
        {NAV.map((n) => (
          <NavItem key={n.to} {...n} onNavigate={() => setMobileOpen(false)} />
        ))}
        <span
          className="text-[10px] font-bold tracking-[0.1em] uppercase px-3.5 pt-4 pb-1.5"
          style={{ color: "#6f8a7b" }}
        >
          Account
        </span>
        {ACCOUNT_NAV.map((n) => (
          <NavItem key={n.to} {...n} onNavigate={() => setMobileOpen(false)} />
        ))}
      </nav>

      <div
        className="mt-auto flex items-center gap-2.5 p-3 rounded-[14px]"
        style={{ background: "rgba(255,255,255,0.05)" }}
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt=""
            className="w-[38px] h-[38px] rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div
            className="w-[38px] h-[38px] rounded-full grid place-items-center font-bold text-sm text-white flex-shrink-0"
            style={{ background: C.accent }}
          >
            {initials(user?.name)}
          </div>
        )}
        <div className="min-w-0">
          <div className="text-[13px] font-bold text-white leading-tight truncate">
            {user?.name ?? "Agent"}
          </div>
          <div className="text-[11px] truncate" style={{ color: "#8aa395" }}>
            {user?.agentProfile?.agencyName ?? "Loop Realty"}
            {tier ? ` · ${tier.charAt(0) + tier.slice(1).toLowerCase()}` : ""}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen" style={{ background: C.surface }}>
      {/* Mobile top bar */}
      <div
        className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14"
        style={{ background: "#14271c" }}
      >
        <b className="text-base font-extrabold text-white">
          property<span style={{ color: "#7ad296" }}>loop</span>
        </b>
        <button
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 grid place-items-center rounded-lg text-white"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div className="lg:grid" style={{ gridTemplateColumns: "256px 1fr" }}>
        {/* Desktop sidebar */}
        <aside
          className="hidden lg:flex flex-col sticky top-0 h-screen px-4 py-[22px]"
          style={{ background: "#14271c", color: "#cfe0d5" }}
        >
          {SidebarInner}
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />
            <aside
              className="absolute left-0 top-0 h-full w-[256px] flex flex-col px-4 py-[22px]"
              style={{ background: "#14271c", color: "#cfe0d5" }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="self-end w-8 h-8 grid place-items-center rounded-lg text-white mb-1"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
              {SidebarInner}
            </aside>
          </div>
        )}

        {/* Main */}
        <main className="px-5 py-7 lg:px-[34px] lg:py-[26px] pb-16 max-w-[1180px] w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NavItem({
  to,
  label,
  icon: Icon,
  onNavigate,
}: {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onNavigate: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className="flex items-center gap-3 px-3.5 py-[11px] rounded-xl text-sm font-semibold transition-colors"
      style={({ isActive }) =>
        isActive
          ? { background: C.primary, color: "#fff" }
          : { color: "#a9c2b3" }
      }
    >
      <Icon className="w-[19px] h-[19px]" />
      {label}
    </NavLink>
  );
}
