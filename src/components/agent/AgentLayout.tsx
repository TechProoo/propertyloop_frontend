// Shell for the redesigned, multi-page agent dashboard. Dark emerald
// sidebar with routed NavLinks + a scrollable <Outlet/> main area. On large
// screens the sidebar collapses to an icon rail (state persisted); on small
// screens it's a slide-in drawer. Each page renders its own header/actions.
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
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
  ChevronLeft,
  Newspaper,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { C, initials } from "./ui";
import Logo from "../../assets/logo.png";

const NAV = [
  { to: "overview", label: "Overview", icon: LayoutGrid },
  { to: "listings", label: "My Listings", icon: Home },
  { to: "analytics", label: "Analytics", icon: BarChart3 },
  { to: "viewings", label: "Viewings", icon: CalendarDays },
  { to: "logbook", label: "Logbook", icon: ClipboardList },
  { to: "messages", label: "Messages", icon: MessageCircle },
  { to: "/feed", label: "Community Feed", icon: Newspaper },
];

const ACCOUNT_NAV = [
  { to: "subscription", label: "Subscription", icon: CreditCard },
  { to: "settings", label: "Settings", icon: SettingsIcon },
];

const STORAGE_KEY = "pl_agent_sidebar_collapsed";

/** propertyloop logo mark — green house tile + (optional) wordmark. */
function Brand({ collapsed, onClick }: { collapsed: boolean; onClick?: () => void }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className={`flex items-center pt-1 pb-5 ${collapsed ? "justify-center" : "px-2"}`}
      aria-label="propertyloop — go to homepage"
    >
      {collapsed ? (
        // Compact mark for the icon rail — the logo's house tile.
        <div
          className="w-[34px] h-[34px] rounded-[9px] grid place-items-center shrink-0"
          style={{ background: C.primary }}
        >
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
            <path d="M4 16a12 12 0 0124 0" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M10 17l6-5 6 5v6h-4v-4h-4v4h-4v-6z" fill="#fff" />
          </svg>
        </div>
      ) : (
        <img
          src={Logo}
          alt="propertyloop"
          className="h-8 w-auto max-w-full object-contain"
        />
      )}
    </Link>
  );
}

export default function AgentLayout() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(STORAGE_KEY) === "1";
  });

  const toggleCollapsed = () =>
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });

  const tier = user?.agentProfile
    ? // @ts-expect-error subscriptionTier may not be typed on AgentProfile yet
      (user.agentProfile.subscriptionTier as string | undefined)
    : undefined;

  // `isCollapsed` only applies to the desktop rail; the mobile drawer is
  // always full-width.
  const renderSidebar = (isCollapsed: boolean) => (
    <>
      <Brand collapsed={isCollapsed} onClick={() => setMobileOpen(false)} />

      <nav className="flex flex-col gap-1 mt-1.5 flex-1">
        {NAV.map((n) => (
          <NavItem key={n.to} {...n} collapsed={isCollapsed} onNavigate={() => setMobileOpen(false)} />
        ))}
        {isCollapsed ? (
          <div className="my-2 mx-2 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
        ) : (
          <span
            className="text-[10px] font-bold tracking-[0.1em] uppercase px-3.5 pt-4 pb-1.5"
            style={{ color: "#6f8a7b" }}
          >
            Account
          </span>
        )}
        {ACCOUNT_NAV.map((n) => (
          <NavItem key={n.to} {...n} collapsed={isCollapsed} onNavigate={() => setMobileOpen(false)} />
        ))}
      </nav>

      <div
        className={`mt-auto flex items-center rounded-[14px] ${isCollapsed ? "justify-center p-2" : "gap-2.5 p-3"}`}
        style={{ background: "rgba(255,255,255,0.05)" }}
        title={isCollapsed ? user?.name ?? "Agent" : undefined}
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt=""
            className="w-[38px] h-[38px] rounded-full object-cover shrink-0"
          />
        ) : (
          <div
            className="w-[38px] h-[38px] rounded-full grid place-items-center font-bold text-sm text-white shrink-0"
            style={{ background: C.accent }}
          >
            {initials(user?.name)}
          </div>
        )}
        {!isCollapsed && (
          <div className="min-w-0">
            <div className="text-[13px] font-bold text-white leading-tight truncate">
              {user?.name ?? "Agent"}
            </div>
            <div className="text-[11px] truncate" style={{ color: "#8aa395" }}>
              {user?.agentProfile?.agencyName ?? "Loop Realty"}
              {tier ? ` · ${tier.charAt(0) + tier.slice(1).toLowerCase()}` : ""}
            </div>
          </div>
        )}
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
        <Link to="/" aria-label="propertyloop — go to homepage" className="inline-flex">
          <img src={Logo} alt="propertyloop" className="h-7 w-auto object-contain" />
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 grid place-items-center rounded-lg text-white"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div
        className="lg:grid"
        style={{
          gridTemplateColumns: `${collapsed ? 76 : 256}px 1fr`,
          transition: "grid-template-columns 260ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Desktop sidebar */}
        <aside
          className={`hidden lg:flex flex-col sticky top-0 h-screen py-[22px] transition-[padding] ${collapsed ? "px-3" : "px-4"}`}
          style={{ background: "#14271c", color: "#cfe0d5" }}
        >
          {/* Collapse / expand toggle on the sidebar edge */}
          <button
            onClick={toggleCollapsed}
            className="absolute -right-3 top-6 w-6 h-6 rounded-full grid place-items-center z-20 shadow-sm"
            style={{ background: "#ffffff", border: `1px solid ${C.line}`, color: C.ink2 }}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand" : "Collapse"}
          >
            <ChevronLeft
              className="w-3.5 h-3.5 transition-transform"
              style={{ transform: collapsed ? "rotate(180deg)" : "none" }}
            />
          </button>
          {/* Clip the content so labels slide in/out instead of spilling
              past the rail while the width animates. */}
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            {renderSidebar(collapsed)}
          </div>
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
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
              {renderSidebar(false)}
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
  collapsed,
  onNavigate,
}: {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  collapsed: boolean;
  onNavigate: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className={`flex items-center rounded-xl text-sm font-semibold transition-colors py-[11px] whitespace-nowrap ${
        collapsed ? "justify-center px-0" : "gap-3 px-3.5"
      }`}
      style={({ isActive }) =>
        isActive ? { background: C.primary, color: "#fff" } : { color: "#a9c2b3" }
      }
    >
      <Icon className="w-[19px] h-[19px]" />
      {!collapsed && label}
    </NavLink>
  );
}
