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
  Star,
  Shield,
  CheckCircle,
} from "lucide-react";
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

  // Fetch verified vendors from API
  useEffect(() => {
    const loadVendors = async () => {
      try {
        const result = await vendorsService.list({
          limit: 100,
          sort: "top_rated",
        });
        // Filter for verified vendors and take top 3
        const verifiedVendors = result.items.filter((v) => v.verified && v.availableForHire);
        setVendors(verifiedVendors.slice(0, 3));
      } catch (error) {
        console.error("Failed to load vendors:", error);
        setVendors([]);
      } finally {
        setLoading(false);
      }
    };
    loadVendors();
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
              Book trusted, KYC-verified vendors for any home service. Every
              payment is protected by escrow — funds release only when the job
              is done.
            </p>
          </div>
          <a
            href="/services"
            data-sl-viewall
            className="shrink-0 h-10 px-6 rounded-full border border-border bg-white/80 backdrop-blur-sm text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 inline-flex items-center"
          >
            Browse all vendors
          </a>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat, i) => (
            <button
              key={i}
              data-sl-pill
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-text-secondary text-sm hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
            >
              {cat.icon}
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
                className="h-80 bg-gradient-to-br from-white/40 to-white/20 rounded-[20px] animate-pulse"
              />
            ))}
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
              We're onboarding verified vendors. Browse our full services catalog to see what's available.
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
            {vendors.map((vendor) => (
              <AuthGate
                key={vendor.id}
                href="/services"
                data-sl-card
                className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer block"
              >
                {/* Cover image */}
                <div className="relative h-44 overflow-hidden rounded-t-[20px]">
                  <img
                    src={vendor.bannerImage || "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop"}
                    alt={vendor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Category badge */}
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-primary-dark text-xs font-medium">
                    {vendor.category || "Service"}
                  </span>
                </div>

                {/* Glass content panel */}
                <div className="mx-3 mb-3 -mt-6 relative z-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl px-5 pt-4 pb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                  {/* Vendor header — avatar + name + verified */}
                  <div className="flex items-center gap-3">
                    <img
                      src={vendor.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"}
                      alt={vendor.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-heading font-bold text-primary-dark text-[15px] leading-snug truncate">
                          {vendor.name}
                        </h3>
                        {vendor.verified && (
                          <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-text-secondary text-xs">
                        {vendor.location}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-border-light mt-3 mb-3" />

                  {/* Stats row */}
                  <div className="flex items-center flex-wrap gap-y-2 justify-between text-xs">
                    <div className="flex items-center gap-2 sm:gap-3 text-text-secondary min-w-0">
                      <span className="flex items-center gap-1 shrink-0">
                        <Star className="w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]" />
                        {vendor.rating}
                      </span>
                      <span className="shrink-0">
                        {vendor.jobsCount} jobs
                      </span>
                      <span className="flex items-center gap-1 shrink-0">
                        <Shield className="w-3.5 h-3.5" />
                        Escrow
                      </span>
                    </div>
                    <span className="font-heading font-bold text-primary-dark text-sm shrink-0 ml-auto">
                      {vendor.priceLabel || "From ₦15,000"}
                    </span>
                  </div>
                </div>

                {/* Arrow — clipped circle at bottom-right corner */}
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-full absolute -right-3 -bottom-3 z-20 group-hover:bg-primary transition-colors duration-300 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
              </AuthGate>
            ))}
          </div>
        )}

        {/* Escrow trust banner */}
        <div
          data-sl-banner
          className="mt-12 bg-white/60 backdrop-blur-sm border border-border-light rounded-[20px] px-8 py-6 flex flex-col sm:flex-row items-center gap-6"
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-heading font-bold text-primary-dark text-lg">
              Every payment is escrow-protected
            </h3>
            <p className="text-text-secondary text-sm mt-1">
              Your money is held securely via Paystack. Funds are only released
              to the vendor when you confirm the job is complete. No surprises.
            </p>
          </div>
          <Link
            to="/how-it-works"
            className="shrink-0 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors duration-300 inline-flex items-center"
          >
            Learn how it works
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceLoop;
