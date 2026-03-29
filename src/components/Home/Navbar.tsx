import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../../assets/logo.png";

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

const FlipLink = ({ label, href }: { label: string; href: string }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      className="relative inline-flex items-center py-2 px-1"
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
        animate={hovered ? "hover" : "idle"}
      />
      <div
        className="relative h-5 overflow-hidden"
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.span
          className="block text-sm font-medium text-primary-dark whitespace-nowrap"
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

  return (
    <>
      <nav className="w-full px-6 md:px-12 lg:px-20 py-4 flex items-center justify-between relative z-50">
        {/* Left group: Logo + Nav Links */}
        <div className="flex items-center gap-10">
          <div>
            <img className="w-30" src={Logo} alt="Logo" />
          </div>
          <ul className="hidden lg:flex items-center gap-7">
            <li><FlipLink label="Buy" href="/buy" /></li>
            <li><FlipLink label="Rent" href="/rent" /></li>
            <li><FlipLink label="Sell" href="#" /></li>
            <li><FlipLink label="Find Agent" href="#" /></li>
          </ul>
        </div>

        {/* Right Nav Links */}
        <ul className="hidden lg:flex items-center gap-7">
          <li><FlipLink label="Add Property" href="#" /></li>
          <li><FlipLink label="About Us" href="#" /></li>
          <li>
            <a href="#" className="text-sm font-medium text-primary-dark hover:text-primary transition-colors">
              Join
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-primary-dark transition-transform ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-primary-dark transition-opacity ${mobileMenuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-primary-dark transition-transform ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
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
            <a href="/buy" className="py-2 hover:text-primary">Buy</a>
            <a href="/rent" className="py-2 hover:text-primary">Rent</a>
            <a href="#" className="py-2 hover:text-primary">Sell</a>
            <a href="#" className="py-2 hover:text-primary">Find Agent</a>
            <hr className="border-border-light" />
            <a href="#" className="py-2 hover:text-primary">Add Property</a>
            <a href="#" className="py-2 hover:text-primary">About Us</a>
            <a href="#" className="py-2 hover:text-primary font-semibold">Join</a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
