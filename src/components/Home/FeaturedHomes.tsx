import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bed,
  Sparkles,
  WifiOff,
  RotateCcw,
} from "lucide-react";
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

    const cards = el.querySelectorAll("[data-fh-card]");
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: el, start: "top 80%", once: true },
    });

    if (cards.length) {
      tl.fromTo(
        cards,
        { y: 50, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.12, ease: "power4.out" },
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
    <section ref={sectionRef} className="bg-[#f5f0eb]">
      <div className="mx-auto max-w-360 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.15em] text-primary">
              <Sparkles className="h-3 w-3" />
              Featured properties
            </span>
            <h2 className="font-heading mt-3 text-[26px] font-bold leading-[1.1] tracking-tight text-primary-dark sm:text-[34px]">
              Hand-picked &amp; verified
            </h2>
            <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-text-secondary">
              Properties selected by our team with full logbook history and
              transparent pricing.
            </p>
          </div>
          <Link
            to="/featured"
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 px-5 py-2.5 text-[13px] font-bold text-primary-dark transition-colors hover:bg-primary hover:text-white"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-6">
            <CardSkeleton count={3} />
          </div>
        ) : error ? (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
            <WifiOff className="h-6 w-6 text-text-subtle" />
            <p className="text-sm text-text-secondary">
              These properties could not be loaded.
            </p>
            <button
              onClick={fetchHomes}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-[13px] font-bold text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Try again
            </button>
          </div>
        ) : homes.length === 0 ? (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
            <Bed className="h-6 w-6 text-text-subtle" />
            <p className="text-sm font-semibold text-primary-dark">
              Featured homes coming soon
            </p>
            <p className="max-w-sm text-[13px] text-text-secondary">
              Our agents are curating the best properties for you.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
