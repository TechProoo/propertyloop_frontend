import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin } from "lucide-react";
import AuthGate from "../ui/AuthGate";
import listingsService from "../../api/services/listings";
import type { Listing } from "../../api/types";
import { handleBannerError } from "../../lib/bannerFallback";
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

    const label = el.querySelector("[data-ss-label]");
    const heading = el.querySelector("[data-ss-heading]");
    const subtitle = el.querySelector("[data-ss-subtitle]");
    const viewAll = el.querySelector("[data-ss-viewall]");
    const datePicker = el.querySelector("[data-ss-datepicker]");
    const cards = el.querySelectorAll("[data-ss-card]");

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: el, start: "top 75%", once: true },
    });

    // Label
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

    // Date picker bar — expand from center
    if (datePicker) {
      tl.fromTo(
        datePicker,
        { scaleX: 0.6, opacity: 0, transformOrigin: "center" },
        { scaleX: 1, opacity: 1, duration: 0.8, ease: "power4.out" },
        "-=0.2",
      );
    }

    // Shortlet cards — stagger rise with scale
    if (cards.length) {
      tl.fromTo(
        cards,
        { y: 80, opacity: 0, scale: 0.92 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          stagger: 0.18,
          ease: "power4.out",
        },
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
              data-ss-label
              className="text-primary text-sm font-medium tracking-wide uppercase mb-2"
            >
              Short-Term Stays
            </p>
            <h2
              data-ss-heading
              className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3rem] leading-[1.1] font-bold text-primary-dark tracking-tight"
            >
              Shortlet <span className="text-primary">Spotlight</span>
            </h2>
            <p
              data-ss-subtitle
              className="text-text-secondary text-sm leading-relaxed mt-3 max-w-lg"
            >
              Browse verified short-term apartments by the night. Transparent
              pricing and direct contact with the host.
            </p>
          </div>
          <AuthGate
            href="/shortlet"
            className="shrink-0 h-10 px-6 rounded-full border border-border bg-white/80 backdrop-blur-sm text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 inline-flex items-center"
          >
            <span data-ss-viewall>View all shortlets</span>
          </AuthGate>
        </div>

        {/* Date picker bar */}
        <div
          data-ss-datepicker
          className="bg-white border border-border-light rounded-[24px] shadow-[0_2px_14px_rgba(0,0,0,0.04)] px-5 sm:px-8 py-7 mb-10 flex flex-col sm:flex-row sm:items-end gap-5"
        >
          <div className="flex items-center gap-2 text-primary shrink-0 sm:pb-1">
            <CalendarDays className="w-5 h-5" />
            <span className="font-heading font-bold text-primary-dark text-sm">
              Pick your dates
            </span>
          </div>

          <div className="w-full flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="min-w-0">
              <label className="text-text-secondary text-xs font-medium block mb-1.5">
                Check in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full h-10 px-4 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="min-w-0">
              <label className="text-text-secondary text-xs font-medium block mb-1.5">
                Check out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full h-10 px-4 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="min-w-0">
              <label className="text-text-secondary text-xs font-medium block mb-1.5">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                <select className="w-full h-10 pl-9 pr-4 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors appearance-none truncate">
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

          <button className="shrink-0 self-center sm:self-auto h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors duration-300">
            Search
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/60 border border-border-light rounded-[20px] overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-border-light/40" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-2/3 bg-border-light/60 rounded-full" />
                  <div className="h-3 w-1/2 bg-border-light/60 rounded-full" />
                  <div className="h-3 w-1/3 bg-border-light/60 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : shortlets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center rounded-[28px] bg-white/30 border border-border-light">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <CalendarDays className="w-8 h-8 text-primary/50" />
            </div>
            <h3 className="font-heading font-bold text-primary-dark text-lg">
              Shortlets Coming Soon
            </h3>
            <p className="text-text-secondary text-sm mt-2 max-w-sm">
              Browse verified short-term apartments by the night and message
              hosts directly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shortlets.map((s) => (
              <AuthGate
                key={s.id}
                href={`/property/${s.id}`}
                data-ss-card
                className="group relative bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden block"
              >
                <div className="h-56 overflow-hidden relative bg-bg-accent">
                  {s.coverImage ? (
                    <img
                      src={s.coverImage}
                      alt={s.title}
                      onError={handleBannerError}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <CalendarDays className="w-10 h-10 text-text-subtle" />
                    </div>
                  )}
                  <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-primary-dark text-xs font-semibold">
                    Verified host
                  </span>
                  {s.rating > 0 && (
                    <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-[#1a2120] text-white text-xs font-bold">
                      ★ {s.rating.toFixed(1)}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-bold text-primary-dark text-[16px] leading-snug line-clamp-1">
                    {s.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-text-subtle text-xs mt-1.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{s.location}</span>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-light">
                    <span className="font-heading font-bold text-primary-dark text-lg tracking-tight">
                      {s.priceLabel}
                      {s.period && (
                        <span className="text-text-subtle text-xs font-normal">
                          {" "}
                          /{s.period.replace(/^\//, "")}
                        </span>
                      )}
                    </span>
                    <span className="text-xs font-semibold text-text-secondary bg-bg px-3 py-1.5 rounded-full">
                      {s.beds} {s.beds === 1 ? "bed" : "beds"}
                    </span>
                  </div>
                </div>
              </AuthGate>
            ))}
          </div>
        )}

        {!loading && shortlets.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              to="/shortlet"
              className="inline-flex h-10 px-6 rounded-full border border-border bg-white/80 backdrop-blur-sm text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 items-center"
            >
              View all shortlets
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShortletSpotlight;
