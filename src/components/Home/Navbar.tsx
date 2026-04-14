import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
    <a
      href={href}
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
    </a>
  );
};

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname;
  const { user, isLoggedIn, logout } = useAuth();
  const navRef = useRef<HTMLElement>(null);

  // ─── GSAP cinematic entrance ───────────────────────────────────────────
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const logo = nav.querySelector("[data-nav-logo]");
    const links = nav.querySelectorAll("[data-nav-link]");
    const actions = nav.querySelectorAll("[data-nav-action]");

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Logo — drops in with scale overshoot
    tl.fromTo(
      logo,
      { y: -40, opacity: 0, scale: 0.7 },
      { y: 0, opacity: 1, scale: 1, duration: 0.9 },
    );

    // Nav links — stagger cascade from left with slight rotation
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

    // Right-side actions — scale up with spring feel
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
  const dashboardHref =
    user?.role === "AGENT"
      ? "/agent-dashboard"
      : user?.role === "VENDOR"
        ? "/vendor-dashboard"
        : "/dashboard";

  return (
    <>
      <nav
        ref={navRef}
        className="w-full px-6 md:px-12 lg:px-20 py-4 flex items-center justify-between relative z-50"
      >
        {/* Left group: Logo + Nav Links */}
        <div className="flex items-center gap-10">
          <a href="/" data-nav-logo>
            <img className="w-30" src={Logo} alt="Logo" />
          </a>
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
            <li data-nav-link>
              <FlipLink
                label="Service Loop"
                href="/services"
                isActive={path === "/services"}
              />
            </li>
            <li data-nav-link>
              <FlipLink
                label="Building Materials"
                href="/marketplace"
                isActive={path === "/marketplace"}
              />
            </li>
          </ul>
        </div>

        {/* Right Nav Links */}
        <ul className="hidden lg:flex items-center gap-7">
          <li data-nav-action>
            <FlipLink
              label="Add Property"
              href="/add-property"
              isActive={path === "/add-property"}
            />
          </li>
          <li data-nav-action>
            <FlipLink
              label="About Us"
              href="/about"
              isActive={path === "/about"}
            />
          </li>
          {isLoggedIn ? (
            <>
              <li data-nav-action>
                <a
                  href={dashboardHref}
                  className={`text-sm font-semibold px-4 py-2 rounded-full transition-colors ${
                    path === "/dashboard" || path === "/agent-dashboard"
                      ? "bg-primary text-white"
                      : "bg-primary/10 text-primary-dark hover:bg-primary/20"
                  }`}
                >
                  Dashboard
                </a>
              </li>
              <li data-nav-action>
                <button
                  onClick={() => {
                    logout();
                    window.location.href = "/";
                  }}
                  className="text-sm font-medium px-4 py-2 rounded-full bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li data-nav-action>
                <a
                  href="/login"
                  className="text-sm font-medium text-primary-dark hover:text-primary transition-colors"
                >
                  Login
                </a>
              </li>
              <li data-nav-action>
                <a
                  href="/onboarding"
                  className="text-sm font-medium text-white bg-primary px-6 py-2 rounded-4xl hover:bg-primary-dark transition-colors"
                >
                  Join
                </a>
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
            className="fixed inset-x-0 top-16 z-40 backdrop-blur-xl bg-white/60 border-b border-white/30 shadow-lg lg:hidden py-4 px-6 flex flex-col gap-3 text-sm font-medium text-primary-dark"
          >
            <a
              href="/buy"
              className={`py-2 hover:text-primary ${path === "/buy" ? "text-primary font-semibold" : ""}`}
            >
              Buy
            </a>
            <a
              href="/rent"
              className={`py-2 hover:text-primary ${path === "/rent" ? "text-primary font-semibold" : ""}`}
            >
              Rent
            </a>
            <a
              href="/sell"
              className={`py-2 hover:text-primary ${path === "/sell" ? "text-primary font-semibold" : ""}`}
            >
              Sell
            </a>
            <a
              href="/services"
              className={`py-2 hover:text-primary ${path === "/services" ? "text-primary font-semibold" : ""}`}
            >
              Service Loop
            </a>
            <a
              href="/marketplace"
              className={`py-2 hover:text-primary ${path === "/marketplace" ? "text-primary font-semibold" : ""}`}
            >
              Building Materials
            </a>
            <hr className="border-border-light" />
            <a
              href="/add-property"
              className={`py-2 hover:text-primary ${path === "/add-property" ? "text-primary font-semibold" : ""}`}
            >
              Add Property
            </a>
            <a
              href="/about"
              className={`py-2 hover:text-primary ${path === "/about" ? "text-primary font-semibold" : ""}`}
            >
              About Us
            </a>
            {isLoggedIn ? (
              <>
                <a
                  href={dashboardHref}
                  className={`py-2 px-4 rounded-full font-semibold transition-colors ${
                    path === "/dashboard" || path === "/agent-dashboard"
                      ? "bg-primary text-white"
                      : "bg-primary/10 text-primary-dark hover:bg-primary/20"
                  }`}
                >
                  Dashboard
                </a>
                <button
                  onClick={() => {
                    logout();
                    window.location.href = "/";
                  }}
                  className="py-2 px-4 rounded-full text-left bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className={`py-2 hover:text-primary ${path === "/login" ? "text-primary font-semibold" : ""}`}
                >
                  Login
                </a>
                <a
                  href="/onboarding"
                  className="py-2 hover:text-primary font-semibold"
                >
                  Join
                </a>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
