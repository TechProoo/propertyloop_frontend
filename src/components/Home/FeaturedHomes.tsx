import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Bed, Bath, Maximize } from "lucide-react";
import AuthGate from "../ui/AuthGate";
import { CardSkeleton } from "../ui/Skeleton";
import listingsService from "../../api/services/listings";
import type { Listing } from "../../api/types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FeaturedHomes = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [homes, setHomes] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listingsService
      .list({ type: "SALE", limit: 3, sort: "newest" })
      .then((res) => setHomes(res.items))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || homes.length === 0) return;
    const el = sectionRef.current;
    if (!el) return;

    const heading = el.querySelector("[data-fh-heading]");
    const subtitle = el.querySelector("[data-fh-subtitle]");
    const viewAll = el.querySelector("[data-fh-viewall]");
    const cards = el.querySelectorAll("[data-fh-card]");

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: el, start: "top 75%", once: true },
    });

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
      );
    }

    // Subtitle — fade up
    if (subtitle) {
      tl.fromTo(
        subtitle,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.4",
      );
    }

    // View-all button — pop in
    if (viewAll) {
      tl.fromTo(
        viewAll,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.6)" },
        "-=0.3",
      );
    }

    // Cards — stagger rise with slight 3D rotation
    if (cards.length) {
      tl.fromTo(
        cards,
        { y: 80, opacity: 0, rotateY: -6, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          rotateY: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: "power4.out",
        },
        "-=0.3",
      );
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [loading, homes]);

  return (
    <section
      ref={sectionRef}
      className="w-full px-6 md:px-12 lg:px-20 py-20 lg:py-28 bg-bg"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2
              data-fh-heading
              className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3rem] leading-[1.1] font-bold text-primary-dark tracking-tight"
            >
              Featured <span className="text-primary">Homes</span>
            </h2>
            <p
              data-fh-subtitle
              className="text-text-secondary text-sm leading-relaxed mt-3 max-w-lg"
            >
              Hand-picked properties verified by our agents with full logbook
              history and transparent pricing.
            </p>
          </div>
          <AuthGate
            href="/buy"
            className="shrink-0 h-10 px-6 rounded-full border border-border bg-white/80 backdrop-blur-sm text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 inline-flex items-center"
          >
            <span data-fh-viewall>View all</span>
          </AuthGate>
        </div>

        {/* Cards grid — 3 per row */}
        {loading ? (
          <CardSkeleton count={3} />
        ) : homes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Bed className="w-8 h-8 text-primary/50" />
            </div>
            <h3 className="font-heading font-bold text-primary-dark text-lg">
              Featured Homes Coming Soon
            </h3>
            <p className="text-text-secondary text-sm mt-2 max-w-sm">
              Our agents are curating the best properties for you. Check back soon to discover hand-picked homes.
            </p>
            <a
              href="/buy"
              className="mt-6 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors inline-flex items-center"
            >
              Browse All Properties
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {homes.map((home) => (
              <AuthGate
                key={home.id}
                href={`/property/${home.id}`}
                data-fh-card
                className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer block"
              >
                {/* Image — flush top, rounded top corners only */}
                <div className="h-52 overflow-hidden rounded-t-[20px]">
                  <img
                    src={home.coverImage}
                    alt={home.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content — glass morphism panel */}
                <div className="mx-3 mb-3 -mt-6 relative z-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl px-5 pt-4 pb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                  {/* Price */}
                  <p className="font-heading font-bold text-primary-dark text-[18px]">
                    {home.priceLabel}
                  </p>

                  {/* Title */}
                  <h3 className="font-heading font-bold text-primary-dark text-[15px] leading-snug mt-1.5 truncate">
                    {home.title}
                  </h3>

                  {/* Address */}
                  <p className="text-text-secondary text-xs mt-1">
                    {home.address}
                  </p>

                  {/* Divider */}
                  <div className="h-px bg-border-light mt-4 mb-3" />

                  {/* Stats row */}
                  <div className="flex items-center gap-4 text-text-secondary text-xs pr-10">
                    <span className="flex items-center gap-1.5">
                      <Bed className="w-3.5 h-3.5" />
                      {home.beds} Beds
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Bath className="w-3.5 h-3.5" />
                      {home.baths} Bathrooms
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Maximize className="w-3.5 h-3.5" />
                      {home.sqft}m²
                    </span>
                  </div>
                </div>

                {/* Arrow — clipped circle at bottom-right corner, above glass */}
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-full absolute -right-3 -bottom-3 z-20 group-hover:bg-primary transition-colors duration-300 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
              </AuthGate>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedHomes;
