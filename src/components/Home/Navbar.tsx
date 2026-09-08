import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LogOut, Plus, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Logo from "../../assets/logo.png";
import gsap from "gsap";

const ease = [0.23, 1, 0.32, 1] as const;

const flipVariants = {
  front: {
    rotateX: 0,
    transition: { duration: 0.35, ease },
  },
  back: {
    rotateX: -90,
    transition: { duration: 0.35, ease },
  },
};

const backFaceVariants = {
  hidden: {
    rotateX: 90,
    transition: { duration: 0.35, ease },
  },
  visible: {
    rotateX: 0,
    transition: { duration: 0.35, ease },
  },
};

const glowVariants = {
  idle: { scale: 0, opacity: 0 },
  hover: {
    scale: 2.2,
    opacity: 1,
    transition: { duration: 0.45, ease },
  },
};

/**
 * Secondary destinations, grouped so the bar itself stays down to the four
 * primary property actions. Anything added here costs no horizontal space.
 */
const MENU_GROUPS = [
  {
    heading: "Services",
    items: [
      {
        label: "Artisan Corner",
        href: "/services",
        blurb: "Vetted plumbers, electricians and cleaners",
      },
      {
        label: "Facility Management",
        href: "/facility-management",
        blurb: "End-to-end upkeep for buildings and estates",
      },
      {
        label: "Advertise",
        href: "/advertise",
        blurb: "Put your listings in front of active buyers",
      },
    ],
  },
  {
    heading: "Company",
    items: [
      {
        label: "About Us",
        href: "/about",
        blurb: "Who we are and why we built PropertyLoop",
      },
      {
        label: "How It Works",
        href: "/how-it-works",
        blurb: "From first search to signed contract",
      },
      {
        label: "Pricing",
        href: "/pricing",
        blurb: "Plans for agents, vendors and landlords",
      },
    ],
  },
];

const MENU_HREFS = MENU_GROUPS.flatMap((g) => g.items.map((i) => i.href));

const FlipLink = ({
  label,
  href,
  isActive = false,
}: {
  label: string;
  href: string;
  isActive?: boolean;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={href}
      className={`relative inline-flex items-center py-2 px-1 ${isActive ? "after:absolute after:bottom-0 after:left-1 after:right-1 after:h-0.5 after:bg-primary after:rounded-full" : ""}`}
      style={{ perspective: "500px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="absolute inset-0 m-auto w-full h-full rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(31,111,67,0.25) 0%, rgba(31,111,67,0.06) 50%, transparent 70%)",
        }}
        variants={glowVariants}
        initial="idle"
        animate={hovered || isActive ? "hover" : "idle"}
      />
      <div
        className="relative h-5 overflow-hidden"
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.span
          className={`block text-sm whitespace-nowrap ${isActive ? "font-semibold text-primary" : "font-medium text-primary-dark"}`}
          style={{ backfaceVisibility: "hidden" }}
          variants={flipVariants}
          initial="front"
          animate={hovered ? "back" : "front"}
        >
          {label}
        </motion.span>
        <motion.span
          className="absolute inset-0 block text-sm font-semibold text-primary whitespace-nowrap"
          style={{ backfaceVisibility: "hidden" }}
          variants={backFaceVariants}
          initial="hidden"
          animate={hovered ? "visible" : "hidden"}
        >
          {label}
        </motion.span>
      </div>
    </Link>
  );
};

const panelMotion = {
  initial: { opacity: 0, y: 8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 8, scale: 0.98 },
  transition: { duration: 0.18, ease },
};

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const closeMobileMenu = () => setMobileMenuOpen(false);
  const location = useLocation();
  const path = location.pathname;
  const { user, isLoggedIn, logoutWithRedirect, loggingOut } = useAuth();
  const navRef = useRef<HTMLElement>(null);
  const moreRef = useRef<HTMLLIElement>(null);
  const accountRef = useRef<HTMLLIElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);

  const moreActive = MENU_HREFS.includes(path);

  // ─── GSAP cinematic entrance ───────────────────────────────────────────
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const logo = nav.querySelector("[data-nav-logo]");
    const links = nav.querySelectorAll("[data-nav-link]");
    const actions = nav.querySelectorAll("[data-nav-action]");

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Logo - drops in with scale overshoot
    tl.fromTo(
      logo,
      { y: -40, opacity: 0, scale: 0.7 },
      { y: 0, opacity: 1, scale: 1, duration: 0.9 },
    );

    // Nav links - stagger cascade from left with slight rotation
    tl.fromTo(
      links,
      { y: -30, opacity: 0, rotateX: -40 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.7,
        stagger: 0.08,
      },
      "-=0.5",
    );

    // Right-side actions - scale up with spring feel
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
      tl.kill();
    };
  }, []);

  // Close mobile menu on scroll
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleScroll = () => setMobileMenuOpen(false);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen]);

  // Dismiss dropdowns on outside click or Escape
  useEffect(() => {
    if (!moreOpen && !accountOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (moreOpen && !moreRef.current?.contains(target)) setMoreOpen(false);
      if (accountOpen && !accountRef.current?.contains(target))
        setAccountOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMoreOpen(false);
      setAccountOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [moreOpen, accountOpen]);

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  // Hover intent: opening is instant, closing waits so the cursor can cross
  // the gap between the trigger and the panel.
  const openMore = () => {
    window.clearTimeout(hoverTimer.current);
    setMoreOpen(true);
  };
  const closeMoreSoon = () => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setMoreOpen(false), 140);
  };

  const dashboardHref =
    user?.role === "AGENT"
      ? "/agent-dashboard"
      : user?.role === "VENDOR"
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
      <nav
        ref={navRef}
        className="w-full px-6 md:px-12 lg:px-20 py-4 flex items-center justify-between relative z-50"
      >
        {/* Left group: Logo + primary nav */}
        <div className="flex items-center gap-10">
          <Link to="/" data-nav-logo>
            <img className="w-30" src={Logo} alt="Logo" />
          </Link>
          <ul className="hidden lg:flex items-center gap-7">
            <li data-nav-link>
              <FlipLink label="Buy" href="/buy" isActive={path === "/buy"} />
            </li>
            <li data-nav-link>
              <FlipLink label="Rent" href="/rent" isActive={path === "/rent"} />
            </li>
            <li data-nav-link>
              <FlipLink label="Sell" href="/sell" isActive={path === "/sell"} />
            </li>
            <li data-nav-link className="relative pr-7">
              <FlipLink label="Feed" href="/feed" isActive={path === "/feed"} />
              <span className="absolute top-0 right-0 bg-primary text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full pointer-events-none">
                New
              </span>
            </li>

            {/* Everything secondary lives behind one trigger */}
            <li
              data-nav-link
              ref={moreRef}
              className="relative"
              onMouseEnter={openMore}
              onMouseLeave={closeMoreSoon}
            >
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                aria-expanded={moreOpen}
                aria-haspopup="true"
                className={`inline-flex items-center gap-1 py-2 px-1 text-sm transition-colors ${
                  moreActive || moreOpen
                    ? "font-semibold text-primary"
                    : "font-medium text-primary-dark hover:text-primary"
                }`}
              >
                More
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    {...panelMotion}
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[34rem]"
                  >
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 rounded-2xl border border-border-light bg-white/95 backdrop-blur-xl p-3 shadow-[0_16px_48px_rgba(0,0,0,0.12)]">
                      {MENU_GROUPS.map((group) => (
                        <div key={group.heading}>
                          <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-text-subtle">
                            {group.heading}
                          </p>
                          {group.items.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={() => setMoreOpen(false)}
                              className={`block rounded-xl px-3 py-2.5 transition-colors ${
                                path === item.href
                                  ? "bg-primary/10"
                                  : "hover:bg-primary/5"
                              }`}
                            >
                              <span
                                className={`block text-sm ${
                                  path === item.href
                                    ? "font-semibold text-primary"
                                    : "font-medium text-primary-dark"
                                }`}
                              >
                                {item.label}
                              </span>
                              <span className="block text-xs text-text-subtle mt-0.5 leading-snug">
                                {item.blurb}
                              </span>
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          </ul>
        </div>

        {/* Right group: account actions only */}
        <ul className="hidden lg:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {user?.role === "AGENT" && (
                <li data-nav-action>
                  <Link
                    to="/add-property"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-dark hover:text-primary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Property
                  </Link>
                </li>
              )}
              <li data-nav-action>
                <Link
                  to={dashboardHref}
                  className={`text-sm font-semibold px-4 py-2 rounded-full transition-colors ${
                    onDashboard
                      ? "bg-primary text-white"
                      : "bg-primary/10 text-primary-dark hover:bg-primary/20"
                  }`}
                >
                  Dashboard
                </Link>
              </li>

              {/* Account menu absorbs settings + logout */}
              <li data-nav-action ref={accountRef} className="relative">
                <button
                  type="button"
                  onClick={() => setAccountOpen((v) => !v)}
                  aria-expanded={accountOpen}
                  aria-haspopup="true"
                  aria-label="Account menu"
                  className="flex items-center gap-1 rounded-full p-0.5 pr-1.5 hover:bg-primary/5 transition-colors"
                >
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover border border-border-light"
                    />
                  ) : (
                    <span className="w-9 h-9 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                      {initials || "PL"}
                    </span>
                  )}
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-text-subtle transition-transform duration-200 ${accountOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      {...panelMotion}
                      className="absolute right-0 top-full pt-3 w-64"
                    >
                      <div className="rounded-2xl border border-border-light bg-white/95 backdrop-blur-xl p-2 shadow-[0_16px_48px_rgba(0,0,0,0.12)]">
                        <div className="px-3 py-2.5 border-b border-border-light mb-1">
                          <p className="text-sm font-semibold text-primary-dark truncate">
                            {user?.name}
                          </p>
                          <p className="text-xs text-text-subtle truncate">
                            {user?.email}
                          </p>
                        </div>
                        <Link
                          to="/settings"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-primary-dark hover:bg-primary/5 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-text-subtle" />
                          Settings
                        </Link>
                        <button
                          onClick={logoutWithRedirect}
                          disabled={loggingOut}
                          className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors disabled:opacity-60"
                        >
                          <LogOut className="w-4 h-4" />
                          {loggingOut ? "Logging out…" : "Logout"}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            </>
          ) : (
            <>
              <li data-nav-action>
                <Link
                  to="/login"
                  className="text-sm font-medium text-primary-dark hover:text-primary transition-colors px-2"
                >
                  Login
                </Link>
              </li>
              <li data-nav-action>
                <Link
                  to="/onboarding"
                  className="text-sm font-medium text-white bg-primary px-6 py-2 rounded-4xl hover:bg-primary-dark transition-colors"
                >
                  Join
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-primary-dark transition-transform ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-primary-dark transition-opacity ${mobileMenuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-primary-dark transition-transform ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-[calc(4rem+var(--dl-bar-h))] bottom-0 z-40 overflow-y-auto backdrop-blur-xl bg-white/80 border-b border-white/30 shadow-lg lg:hidden py-4 px-6 flex flex-col gap-1 text-sm font-medium text-primary-dark"
          >
            {[
              { label: "Buy", href: "/buy" },
              { label: "Rent", href: "/rent" },
              { label: "Sell", href: "/sell" },
            ].map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={closeMobileMenu}
                className={`py-2.5 hover:text-primary ${path === item.href ? "text-primary font-semibold" : ""}`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/feed"
              onClick={closeMobileMenu}
              className={`py-2.5 hover:text-primary flex items-center gap-2 ${path === "/feed" ? "text-primary font-semibold" : ""}`}
            >
              Feed
              <span className="bg-primary text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                New
              </span>
            </Link>

            {MENU_GROUPS.map((group) => (
              <div key={group.heading} className="mt-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-subtle py-1.5">
                  {group.heading}
                </p>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={closeMobileMenu}
                    className={`block py-2.5 hover:text-primary ${path === item.href ? "text-primary font-semibold" : ""}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}

            <hr className="border-border-light my-3" />

            {isLoggedIn ? (
              <>
                {user?.role === "AGENT" && (
                  <Link
                    to="/add-property"
                    onClick={closeMobileMenu}
                    className={`py-2.5 hover:text-primary ${path === "/add-property" ? "text-primary font-semibold" : ""}`}
                  >
                    Add Property
                  </Link>
                )}
                <Link
                  to="/settings"
                  onClick={closeMobileMenu}
                  className={`py-2.5 hover:text-primary ${path === "/settings" ? "text-primary font-semibold" : ""}`}
                >
                  Settings
                </Link>
                <Link
                  to={dashboardHref}
                  onClick={closeMobileMenu}
                  className={`mt-2 py-2.5 px-4 rounded-full font-semibold text-center transition-colors ${
                    onDashboard
                      ? "bg-primary text-white"
                      : "bg-primary/10 text-primary-dark hover:bg-primary/20"
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={logoutWithRedirect}
                  disabled={loggingOut}
                  className="mt-1 py-2.5 px-4 rounded-full bg-red-50 text-red-700 hover:bg-red-100 transition-colors disabled:opacity-60"
                >
                  {loggingOut ? "Logging out…" : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className={`py-2.5 hover:text-primary ${path === "/login" ? "text-primary font-semibold" : ""}`}
                >
                  Login
                </Link>
                <Link
                  to="/onboarding"
                  onClick={closeMobileMenu}
                  className="mt-2 py-2.5 px-4 rounded-full bg-primary text-white font-semibold text-center hover:bg-primary-dark transition-colors"
                >
                  Join
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
