import { useEffect, useRef, useState } from "react";
import {
  Bed,
  WifiOff,
  RotateCcw,
} from "lucide-react";
import AuthGate from "../ui/AuthGate";
import { CardSkeleton } from "../ui/Skeleton";
import listingsService from "../../api/services/listings";
import PropertyTile from "./PropertyTile";
import { listingToTile } from "./tileData";
import type { Listing } from "../../api/types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FeaturedHomes = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [homes, setHomes] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Bumped by the retry button. The request lives in the effect so nothing is
  // set during render, and a stale response cannot land on a newer one.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    listingsService
      .list({ limit: 12, sort: "newest" })
      .then((res) => {
        if (!alive) return;
        setHomes(
          res.items
            .filter((l) => l.type === "SALE" || l.type === "RENT")
            .slice(0, 3),
        );
        setError(false);
      })
      .catch(() => {
        if (alive) setError(true);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [attempt]);

  const fetchHomes = () => {
    setLoading(true);
    setError(false);
    setAttempt((n) => n + 1);
  };

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

    // Heading - clip-path wipe
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

    // Subtitle - fade up
    if (subtitle) {
      tl.fromTo(
        subtitle,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.4",
      );
    }

    // View-all button - pop in
    if (viewAll) {
      tl.fromTo(
        viewAll,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.6)" },
        "-=0.3",
      );
    }

    // Cards - stagger rise with slight 3D rotation
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
      className="w-full px-6 md:px-12 lg:px-20 py-10 sm:py-14 lg:py-28 bg-bg"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2
              data-fh-heading
              className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3rem] leading-[1.1] font-bold text-primary-dark tracking-tight"
            >
              Featured <span className="text-primary">Properties</span>
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
            href="/featured"
            className="shrink-0 h-10 px-6 rounded-full border border-border bg-white/80 backdrop-blur-sm text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 inline-flex items-center"
          >
            <span data-fh-viewall>View all</span>
          </AuthGate>
        </div>

        {/* Cards grid - 3 per row */}
        {loading ? (
          <CardSkeleton count={3} />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <WifiOff className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="font-heading font-bold text-primary-dark text-lg">
              Couldn’t load properties
            </h3>
            <p className="text-text-secondary text-sm mt-2 max-w-sm">
              Check your internet connection and try again.
            </p>
            <button
              onClick={fetchHomes}
              className="mt-6 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
          </div>
        ) : homes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Bed className="w-8 h-8 text-primary/50" />
            </div>
            <h3 className="font-heading font-bold text-primary-dark text-lg">
              Featured Homes Coming Soon
            </h3>
            <p className="text-text-secondary text-sm mt-2 max-w-sm">
              Our agents are curating the best properties for you. Check back
              soon to discover hand-picked homes.
            </p>
            <a
              href="/search"
              className="mt-6 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors inline-flex items-center"
            >
              Browse All Properties
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {homes.map((home) => (
              <div key={home.id} data-fh-card>
                <PropertyTile data={listingToTile(home)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedHomes;
