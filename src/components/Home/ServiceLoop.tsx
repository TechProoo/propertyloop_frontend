import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuthGate from "../ui/AuthGate";
import vendorsService from "../../api/services/vendors";
import type { VendorPublic } from "../../api/types";
import {
  ArrowUpRight,
  Wrench,
  Zap,
  Paintbrush,
  HardHat,
  Sparkles,
  PipetteIcon,
  Shield,
  CheckCircle,
  WifiOff,
  RotateCcw,
} from "lucide-react";
import FallbackImg from "../../assets/fallback.png";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { icon: <HardHat className="w-5 h-5" />, label: "Building" },
  { icon: <Sparkles className="w-5 h-5" />, label: "Cleaning" },
  { icon: <Zap className="w-5 h-5" />, label: "Electrical" },
  { icon: <Paintbrush className="w-5 h-5" />, label: "Painting" },
  { icon: <PipetteIcon className="w-5 h-5" />, label: "Plaster" },
  { icon: <Wrench className="w-5 h-5" />, label: "Plumbing" },
];

const ServiceLoop = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [vendors, setVendors] = useState<VendorPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadVendors = async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await vendorsService.list({
        limit: 100,
        sort: "top_rated",
      });
      const available = result.items.filter((v) => v.availableForHire);
      setVendors(available.slice(0, 3));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const label = el.querySelector("[data-sl-label]");
    const heading = el.querySelector("[data-sl-heading]");
    const subtitle = el.querySelector("[data-sl-subtitle]");
    const viewAll = el.querySelector("[data-sl-viewall]");
    const pills = el.querySelectorAll("[data-sl-pill]");
    const cards = el.querySelectorAll("[data-sl-card]");
    const banner = el.querySelector("[data-sl-banner]");

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: el, start: "top 75%", once: true },
    });

    // Label — fade in
    if (label) {
      tl.fromTo(
        label,
        { y: -15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
      );
    }

    // Heading — clip-path wipe
    if (heading) {
      tl.fromTo(
        heading,
        { clipPath: "inset(0 100% 0 0)", opacity: 0 },
        {
          clipPath: "inset(0 0% 0 0)",
          opacity: 1,
          duration: 0.9,
          ease: "power4.out",
        },
        "-=0.2",
      );
    }

    // Subtitle
    if (subtitle) {
      tl.fromTo(
        subtitle,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.4",
      );
    }

    // View-all button
    if (viewAll) {
      tl.fromTo(
        viewAll,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.6)" },
        "-=0.3",
      );
    }

    // Category pills — stagger pop from left
    if (pills.length) {
      tl.fromTo(
        pills,
        { x: -30, opacity: 0, scale: 0.85 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.07,
          ease: "back.out(1.8)",
        },
        "-=0.3",
      );
    }

    // Vendor cards — cinematic stagger rise
    if (cards.length) {
      tl.fromTo(
        cards,
        { y: 80, opacity: 0, rotateX: 6, scale: 0.94 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: "power4.out",
        },
        "-=0.2",
      );
    }

    // Escrow banner — slide up with scale
    if (banner) {
      tl.fromTo(
        banner,
        { y: 50, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.2)" },
        "-=0.3",
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full px-6 md:px-12 lg:px-20 py-20 lg:py-28 bg-bg"
    >
      <div className="max-w-7xl mx-auto">
       <div className="rounded-[32px] bg-gradient-to-b from-[#eef3ee] to-bg px-5 sm:px-10 lg:px-16 py-12 lg:py-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p
              data-sl-label
              className="text-primary text-sm font-medium tracking-wide uppercase mb-2"
            >
              Service Loop
            </p>
            <h2
              data-sl-heading
              className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3rem] leading-[1.1] font-bold text-primary-dark tracking-tight"
            >
              Verified Home <span className="text-primary">Services</span>
            </h2>
            <p
              data-sl-subtitle
              className="text-text-secondary text-sm leading-relaxed mt-3 max-w-lg"
            >
              Book trusted, KYC-verified vendors for any home service. Connect
              with professionals you can trust for plumbing, electrical,
              cleaning, and more.
            </p>
          </div>
          <AuthGate
            href="/services"
            className="shrink-0 h-10 px-6 rounded-full border border-border bg-white/80 backdrop-blur-sm text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 inline-flex items-center"
          >
            <span data-sl-viewall>Browse all vendors</span>
          </AuthGate>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat, i) => (
            <button
              key={i}
              data-sl-pill
              className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-white border border-border-light text-primary-dark text-[15px] font-semibold hover:border-primary transition-all duration-300"
            >
              <span className="text-primary">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Vendor cards — 3 per row */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 bg-linear-to-br from-white/40 to-white/20 rounded-[20px] animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <WifiOff className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="font-heading font-bold text-primary-dark text-lg">
              Couldn’t load vendors
            </h3>
            <p className="text-text-secondary text-sm mt-2 max-w-sm">
              Check your internet connection and try again.
            </p>
            <button
              onClick={loadVendors}
              className="mt-6 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
          </div>
        ) : vendors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Wrench className="w-8 h-8 text-primary/50" />
            </div>
            <h3 className="font-heading font-bold text-primary-dark text-lg">
              Quality Vendors Coming Soon
            </h3>
            <p className="text-text-secondary text-sm mt-2 max-w-sm">
              We're onboarding verified vendors. Browse our full services
              catalog to see what's available.
            </p>
            <a
              href="/services"
              className="mt-6 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors inline-flex items-center"
            >
              Browse All Services
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {vendors.map((vendor, i) => (
              <AuthGate
                key={vendor.id}
                href={`/vendor/${vendor.id}`}
                data-sl-card
                className="group relative bg-white border border-border-light rounded-[24px] p-[18px] shadow-[0_2px_14px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.09)] hover:-translate-y-1 transition-all duration-300 block"
              >
                {/* Tag + arrow over the logo box */}
                <span className="absolute top-7 left-7 z-10 px-3.5 py-1.5 rounded-full bg-white border border-border-light text-primary-dark text-[13px] font-bold">
                  {vendor.category || "Service"}
                </span>
                <div
                  className={`absolute top-7 right-7 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    i % 3 === 1
                      ? "bg-primary hover:bg-primary-dark"
                      : "bg-[#1a2120] group-hover:bg-primary"
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>

                {/* Logo / banner box */}
                <div className="h-[150px] rounded-2xl bg-bg-accent overflow-hidden relative flex items-center justify-center">
                  {vendor.bannerImage ? (
                    <img
                      src={vendor.bannerImage}
                      alt={vendor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : vendor.avatarUrl ? (
                    <>
                      <img
                        src={vendor.avatarUrl}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60"
                      />
                      <img
                        src={vendor.avatarUrl}
                        alt={vendor.name}
                        className="relative h-full w-auto object-contain"
                      />
                    </>
                  ) : (
                    <Wrench className="w-12 h-12 text-text-subtle/40" />
                  )}
                </div>

                {/* Meta row — avatar + name */}
                <div className="mt-3.5 bg-bg-accent rounded-2xl p-4 flex items-center gap-3">
                  <img
                    src={vendor.avatarUrl || FallbackImg}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.src = FallbackImg;
                    }}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shrink-0"
                  />
                  <h4 className="font-heading font-bold text-primary-dark text-[15px] truncate flex-1 min-w-0">
                    {vendor.name}
                  </h4>
                  {vendor.verified && (
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  )}
                </div>

                {/* Jobs / price row */}
                <div className="flex items-center justify-between mt-3.5 px-1 pb-1">
                  <span className="text-text-subtle text-sm">
                    {vendor.jobsCount} jobs
                  </span>
                  <span className="font-heading font-bold text-primary-dark text-[15px]">
                    {vendor.priceLabel || "From ₦15,000"}
                  </span>
                </div>
              </AuthGate>
            ))}
          </div>
        )}

        {/* Trust strip */}
        <div
          data-sl-banner
          className="mt-11 bg-white border border-border-light rounded-[24px] px-6 sm:px-9 py-7 flex flex-col sm:flex-row items-center gap-6 shadow-[0_2px_14px_rgba(0,0,0,0.04)]"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
            <Shield className="w-7 h-7" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-heading font-bold text-primary-dark text-lg">
              KYC-verified, trusted vendors
            </h3>
            <p className="text-text-secondary text-sm mt-1 leading-relaxed">
              Every vendor is identity-verified and rated by the community.
              Browse, message, and book directly — no middlemen.
            </p>
          </div>
          <Link
            to="/how-it-works"
            className="shrink-0 h-12 px-7 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors duration-300 inline-flex items-center"
          >
            Learn how it works
          </Link>
        </div>
       </div>
      </div>
    </section>
  );
};

export default ServiceLoop;
