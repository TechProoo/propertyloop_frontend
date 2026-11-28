import { useState, useEffect, useRef } from "react";
import { ARTISAN_CORNER, PRODUCT_MARKETPLACE } from "../../config/features";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, ChevronDown, LogOut, Menu, Plus, Search, Settings, ShoppingBag, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useStoreCart } from "../../context/StoreCartContext";
import Logo from "../../assets/logo.png";
import gsap from "gsap";

const ease = [0.23, 1, 0.32, 1] as const;

const panelMotion = {
  initial: { opacity: 0, y: 8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 8, scale: 0.98 },
  transition: { duration: 0.18, ease },
};

const SEARCH_CATEGORIES = [
  { label: "All", path: "/buy" },
  { label: "Buy", path: "/buy" },
  { label: "Rent", path: "/rent" },
  { label: "Shortlet", path: "/shortlet" },
] as const;

const CATEGORY_LINKS = [
  { label: "Buy", href: "/buy" },
  { label: "Rent", href: "/rent" },
  { label: "Sell", href: "/sell" },
  { label: "Shortlet", href: "/shortlet" },
  { label: "Feed", href: "/feed", badge: "New" },
  // { label: "Services", href: "/services" },  // Artisan Corner is hidden (src/config/features.ts). Nothing is deleted.
  ...(PRODUCT_MARKETPLACE
    ? [{ label: "Marketplace", href: "/marketplace", badge: "New" } as const]
    : []),
  { label: "Find Agent", href: "/find-agent" },
  { label: "Facility Management", href: "/facility-management" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("All");
  const closeMobileMenu = () => setMobileMenuOpen(false);
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const { user, isLoggedIn, logoutWithRedirect, loggingOut } = useAuth();
  const { count: cartCount } = useStoreCart();
  const navRef = useRef<HTMLElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav || path === "/" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const logo = nav.querySelector("[data-nav-logo]");
    const searchBar = nav.querySelector("[data-nav-search]");
    const actions = nav.querySelectorAll("[data-nav-action]");

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.fromTo(
      logo,
      { y: -40, opacity: 0, scale: 0.7 },
      { y: 0, opacity: 1, scale: 1, duration: 0.9 },
    );

    tl.fromTo(
      searchBar,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      "-=0.5",
    );

    tl.fromTo(
      actions,
      { y: -20, opacity: 0, scale: 0.85 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.06,
        ease: "back.out(1.4)",
      },
      "-=0.4",
    );

    return () => {
      tl.revert();
    };
  }, [path]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleScroll = () => setMobileMenuOpen(false);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!accountOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!accountRef.current?.contains(e.target as Node)) setAccountOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAccountOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [accountOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    const cat = SEARCH_CATEGORIES.find((c) => c.label === searchCategory);
    const basePath = cat?.path ?? "/buy";
    navigate(q ? `${basePath}?q=${encodeURIComponent(q)}` : basePath);
  }

  const dashboardHref =
    user?.role === "AGENT"
      ? "/agent-dashboard"
      : user?.role === "VENDOR" && ARTISAN_CORNER
        ? "/vendor-dashboard"
        : "/dashboard";

  const onDashboard =
    path === "/dashboard" ||
    path === "/agent-dashboard" ||
    path === "/vendor-dashboard";

  const initials = (user?.name ?? "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <>
      {/* ── Primary nav bar ─────────────────────────────────────────── */}
      <nav ref={navRef} aria-label="Main navigation" className="relative z-50 bg-[#0f2e1b]">
        <div className="mx-auto flex max-w-360 items-center gap-3 px-4 py-2.5 sm:gap-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" data-nav-logo className="shrink-0">
            <img
              className="h-9 w-auto rounded bg-white/95 object-contain p-1 sm:h-10"
              src={Logo}
              alt="PropertyLoop"
            />
          </Link>

          {/* Search bar – desktop */}
          {path === "/" ? (
            <div className="landing-nav-links">
              <Link to="/buy">Buy</Link>
              <Link to="/rent">Rent</Link>
              <Link to="/shortlet">Shortlets</Link>
              {PRODUCT_MARKETPLACE && <Link to="/marketplace">Marketplace</Link>}
              <Link to="/find-agent">Find an agent</Link>
              <details
                className="landing-more"
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    event.currentTarget.open = false;
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.currentTarget.open = false;
                    event.currentTarget.querySelector("summary")?.focus();
                  }
                }}
              >
                <summary>More <ChevronDown size={14} /></summary>
                <div>
                  {CATEGORY_LINKS.filter(link =>
                    !["/buy", "/rent", "/shortlet", "/marketplace", "/find-agent"].includes(link.href)
                  ).map(link => (
                    <Link key={link.href} to={link.href}>{link.label}</Link>
                  ))}
                </div>
              </details>
            </div>
          ) : (
            <form
              onSubmit={handleSearch}
              data-nav-search
              className="hidden flex-1 lg:flex"
            >
              <div className="flex w-full overflow-hidden rounded-md">
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="border-none bg-primary-soft px-3 py-2 text-[13px] font-medium text-[#0f2e1b] outline-none"
                  aria-label="Search category"
                >
                  {SEARCH_CATEGORIES.map((c) => (
                    <option key={c.label} value={c.label}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by area, city or landmark — Lekki, Epe, Ikeja GRA"
                  aria-label="Search properties"
                  className="min-w-0 flex-1 border-none bg-white px-4 py-2.5 text-sm text-[#0f1111] outline-none placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="bg-accent px-4 transition-colors hover:bg-[#a3741f]"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5 text-white" />
                </button>
              </div>
            </form>
          )}

          {/* Right actions – desktop */}
          <div className="hidden items-center gap-3 lg:flex">
            {PRODUCT_MARKETPLACE && (
              <Link
                data-nav-action
                to="/marketplace/cart"
                aria-label="Marketplace cart"
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-extrabold text-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            )}
            {isLoggedIn ? (
              <>
                {user?.role === "AGENT" && (
                  <Link
                    data-nav-action
                    to="/add-property"
                    className="inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] font-medium text-white/80 transition-colors hover:text-white"
                  >
                    <Plus className="h-4 w-4" />
                    Add Property
                  </Link>
                )}

                <Link
                  data-nav-action
                  to={dashboardHref}
                  className={`whitespace-nowrap rounded-sm px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                    onDashboard
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  Dashboard
                </Link>

                {/* Account dropdown */}
                <div data-nav-action ref={accountRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setAccountOpen((v) => !v)}
                    aria-expanded={accountOpen}
                    aria-haspopup="true"
                    aria-label="Account menu"
                    className="flex items-center gap-1 rounded-sm p-0.5 pr-1.5 transition-colors hover:bg-white/10"
                  >
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt=""
                        className="h-8 w-8 rounded-full border border-white/30 object-cover"
                      />
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
                        {initials || "PL"}
                      </span>
                    )}
                    <ChevronDown
                      className={`h-3.5 w-3.5 text-white/60 transition-transform duration-200 ${accountOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {accountOpen && (
                      <motion.div
                        {...panelMotion}
                        className="absolute right-0 top-full z-50 w-64 pt-3"
                      >
                        <div className="rounded-xl border border-border-light bg-white p-2 shadow-[0_16px_48px_rgba(0,0,0,0.12)]">
                          <div className="mb-1 border-b border-border-light px-3 py-2.5">
                            <p className="truncate text-sm font-semibold text-[#0f1111]">
                              {user?.name}
                            </p>
                            <p className="truncate text-xs text-gray-500">
                              {user?.email}
                            </p>
                          </div>
                          <Link to="/saved-searches" onClick={() => setAccountOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-[#0f1111] transition-colors hover:bg-gray-50">
                            <Bookmark className="h-4 w-4 text-gray-400" />Saved searches
                          </Link>
                          <Link
                            to="/settings"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-[#0f1111] transition-colors hover:bg-gray-50"
                          >
                            <Settings className="h-4 w-4 text-gray-400" />
                            Settings
                          </Link>
                          <button
                            onClick={logoutWithRedirect}
                            disabled={loggingOut}
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-60"
                          >
                            <LogOut className="h-4 w-4" />
                            {loggingOut ? "Logging out…" : "Logout"}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link
                  data-nav-action
                  to="/login"
                  className="whitespace-nowrap text-[13px] font-medium text-white/80 transition-colors hover:text-white"
                >
                  Sign in
                </Link>
                <Link
                  data-nav-action
                  to="/onboarding"
                  className="whitespace-nowrap rounded-sm bg-accent px-4 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#a3741f]"
                >
                  Join free
                </Link>
              </>
            )}
          </div>

          {/* Mobile: hamburger */}
          <button
            className="ml-auto lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu" aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        {/* Search bar – mobile */}
        <form
          onSubmit={handleSearch}
          className={path === "/" ? "hidden" : "px-4 pb-2.5 lg:hidden"}
        >
          <div className="flex overflow-hidden rounded-md">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search properties..."
              aria-label="Search properties"
              className="min-w-0 flex-1 border-none bg-white px-3 py-2 text-sm text-[#0f1111] outline-none placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="bg-accent px-3"
              aria-label="Search"
            >
              <Search className="h-4 w-4 text-white" />
            </button>
          </div>
        </form>
      </nav>

      {/* ── Secondary category bar ──────────────────────────────────── */}
      <div className={path === "/" ? "hidden" : "z-40 border-t border-white/10 bg-primary-dark"}>
        <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
          <div className="hide-scrollbar flex items-center gap-1 overflow-x-auto py-1.5 text-[13px]">
            {CATEGORY_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-sm px-3 py-1 font-medium transition-colors ${
                  path === link.href
                    ? "bg-white/15 text-white"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
                {"badge" in link && link.badge && (
                  <span className="rounded-full bg-accent px-1.5 py-px text-[9px] font-extrabold text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile slide-out menu ───────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={path === "/" ? { top: "calc(3.8rem + var(--dl-bar-h,0px))" } : undefined} className="fixed inset-x-0 top-[calc(7rem+var(--dl-bar-h,0px))] bottom-0 z-40 overflow-y-auto bg-white py-4 px-5 shadow-lg lg:hidden"
          >
            <p className="px-1 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
              Browse
            </p>
            {CATEGORY_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={closeMobileMenu}
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  path === link.href
                    ? "bg-primary-soft text-[#0f2e1b]"
                    : "text-[#0f1111] hover:bg-gray-50"
                }`}
              >
                {link.label}
                {"badge" in link && link.badge && (
                  <span className="rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-extrabold text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}

            <Link to="/saved-searches" onClick={closeMobileMenu} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[#0f1111] hover:bg-gray-50"><Bookmark className="h-4 w-4" />Saved searches</Link>
            <hr className="my-3 border-gray-200" />

            <p className="px-1 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
              More
            </p>
            <Link
              to="/how-it-works"
              onClick={closeMobileMenu}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                path === "/how-it-works"
                  ? "bg-primary-soft text-[#0f2e1b]"
                  : "text-[#0f1111] hover:bg-gray-50"
              }`}
            >
              How It Works
            </Link>
            <Link
              to="/advertise"
              onClick={closeMobileMenu}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                path === "/advertise"
                  ? "bg-primary-soft text-[#0f2e1b]"
                  : "text-[#0f1111] hover:bg-gray-50"
              }`}
            >
              Advertise
            </Link>

            <hr className="my-3 border-gray-200" />

            {isLoggedIn ? (
              <>
                {user?.role === "AGENT" && (
                  <Link
                    to="/add-property"
                    onClick={closeMobileMenu}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[#0f1111] hover:bg-gray-50"
                  >
                    Add Property
                  </Link>
                )}
                <Link
                  to="/settings"
                  onClick={closeMobileMenu}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[#0f1111] hover:bg-gray-50"
                >
                  Settings
                </Link>
                <Link
                  to={dashboardHref}
                  onClick={closeMobileMenu}
                  className={`mt-2 block rounded-lg px-3 py-2.5 text-center text-sm font-semibold transition-colors ${
                    onDashboard
                      ? "bg-[#0f2e1b] text-white"
                      : "bg-primary-soft text-[#0f2e1b] hover:bg-[#d1e3d6]"
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={logoutWithRedirect}
                  disabled={loggingOut}
                  className="mt-1 w-full rounded-lg bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-60"
                >
                  {loggingOut ? "Logging out…" : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[#0f1111] hover:bg-gray-50"
                >
                  Sign in
                </Link>
                <Link
                  to="/onboarding"
                  onClick={closeMobileMenu}
                  className="mt-2 block rounded-lg bg-[#0f2e1b] px-3 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                  Join free
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
