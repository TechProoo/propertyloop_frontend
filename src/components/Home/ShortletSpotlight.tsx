import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, MapPin, Palmtree } from "lucide-react";
import listingsService from "../../api/services/listings";
import PropertyTile from "./PropertyTile";
import { listingToTile } from "./tileData";
import type { Listing } from "../../api/types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ShortletSpotlight = () => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [shortlets, setShortlets] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let active = true;
    listingsService
      .list({ type: "SHORTLET", limit: 6, sort: "newest" })
      .then((res) => {
        if (active) setShortlets(res.items || []);
      })
      .catch(() => {
        if (active) setShortlets([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const cards = el.querySelectorAll("[data-ss-card]");
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
    return () => { tl.kill(); };
  }, [loading, shortlets.length]);

  return (
    <section ref={sectionRef} className="bg-[#f5f0eb]">
      <div className="mx-auto max-w-360 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.15em] text-primary">
              <Palmtree className="h-3 w-3" />
              Short-term stays
            </span>
            <h2 className="font-heading mt-3 text-[26px] font-bold leading-[1.1] tracking-tight text-primary-dark sm:text-[34px]">
              Shortlet spotlight
            </h2>
            <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-text-secondary">
              Verified short-term apartments by the night. Transparent pricing
              and direct contact with the host.
            </p>
          </div>
          <Link
            to="/shortlet"
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 px-5 py-2.5 text-[13px] font-bold text-primary-dark transition-colors hover:bg-primary hover:text-white"
          >
            View all shortlets
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Date picker bar */}
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border-light bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-end sm:px-6">
          <div className="flex shrink-0 items-center gap-2 text-primary sm:pb-1">
            <CalendarDays className="h-4 w-4" />
            <span className="text-[13px] font-bold text-primary-dark">
              Pick your dates
            </span>
          </div>

          <div className="grid w-full flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="min-w-0">
              <label className="mb-1 block text-[11px] font-medium text-text-secondary">
                Check in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="h-10 w-full rounded-full border border-border-light bg-[#f5f0eb]/60 px-4 text-sm text-primary-dark transition-colors focus:border-primary focus:outline-none"
              />
            </div>
            <div className="min-w-0">
              <label className="mb-1 block text-[11px] font-medium text-text-secondary">
                Check out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="h-10 w-full rounded-full border border-border-light bg-[#f5f0eb]/60 px-4 text-sm text-primary-dark transition-colors focus:border-primary focus:outline-none"
              />
            </div>
            <div className="min-w-0">
              <label className="mb-1 block text-[11px] font-medium text-text-secondary">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
                <select className="h-10 w-full appearance-none truncate rounded-full border border-border-light bg-[#f5f0eb]/60 pl-9 pr-4 text-sm text-primary-dark transition-colors focus:border-primary focus:outline-none">
                  <option>All Lagos</option>
                  <option>Victoria Island</option>
                  <option>Lekki</option>
                  <option>Ikoyi</option>
                  <option>Ajah</option>
                  <option>Banana Island</option>
                </select>
              </div>
            </div>
          </div>

          <button className="h-10 shrink-0 self-center rounded-full bg-primary px-6 text-[13px] font-bold text-white transition-colors hover:bg-primary-dark sm:self-auto">
            Search
          </button>
        </div>

        {loading ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl bg-white p-3"
              >
                <div className="aspect-[4/3] w-full rounded-xl bg-primary/5" />
                <div className="mt-3 h-4 w-2/3 rounded-full bg-primary/10" />
                <div className="mt-2 h-3 w-1/2 rounded-full bg-primary/5" />
              </div>
            ))}
          </div>
        ) : shortlets.length === 0 ? (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
            <CalendarDays className="h-6 w-6 text-text-subtle" />
            <p className="text-sm font-semibold text-primary-dark">
              Shortlets coming soon
            </p>
            <p className="max-w-sm text-[13px] text-text-secondary">
              Browse verified short-term apartments by the night and message
              hosts directly.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shortlets.map((s) => (
              <div key={s.id} data-ss-card>
                <PropertyTile data={listingToTile(s)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ShortletSpotlight;
