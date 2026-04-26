import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, Bed, Bath, Maximize, Play, X } from "lucide-react";
import AuthGate from "../ui/AuthGate";
import listingsService from "../../api/services/listings";
import type { Listing } from "../../api/types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VideoListings = () => {
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const loadVideoListings = async () => {
      try {
        const result = await listingsService.list({ limit: 100 });
        const videoListingsData = result.items.filter(
          (l) => l.videoUrl && l.status !== "SOLD" && l.status !== "RENTED",
        );
        setListings(videoListingsData.slice(0, 3));
      } catch (error) {
        console.error("Failed to load video listings:", error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };
    loadVideoListings();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const heading = el.querySelector("[data-vl-heading]");
    const subtitle = el.querySelector("[data-vl-subtitle]");
    const viewAll = el.querySelector("[data-vl-viewall]");
    const cards = el.querySelectorAll("[data-vl-card]");

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

    // View-all button
    if (viewAll) {
      tl.fromTo(
        viewAll,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.6)" },
        "-=0.3",
      );
    }

    // Cards — cinematic stagger from bottom with scale
    if (cards.length) {
      tl.fromTo(
        cards,
        { y: 90, opacity: 0, scale: 0.92 },
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
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2
              data-vl-heading
              className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3rem] leading-[1.1] font-bold text-primary-dark tracking-tight"
            >
              Video <span className="text-primary">Tours</span>
            </h2>
            <p
              data-vl-subtitle
              className="text-text-secondary text-sm leading-relaxed mt-3 max-w-lg"
            >
              Walk through properties from anywhere. Watch video tours filmed by
              verified agents before you visit in person.
            </p>
          </div>
          <AuthGate
            href="/video-tours"
            className="shrink-0 h-10 px-6 rounded-full border border-border bg-white/80 backdrop-blur-sm text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 inline-flex items-center"
          >
            <span data-vl-viewall>View all</span>
          </AuthGate>
        </div>

        {/* Cards grid — 3 per row */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 bg-gradient-to-br from-white/40 to-white/20 rounded-[20px] animate-pulse"
              />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Play className="w-8 h-8 text-primary/50" />
            </div>
            <h3 className="font-heading font-bold text-primary-dark text-lg">
              No Video Tours Yet
            </h3>
            <p className="text-text-secondary text-sm mt-2 max-w-sm">
              Video tours are coming soon. Check back later to explore properties with verified agent walkthroughs.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((home, i) => {
            const videoUrl = home.videoUrl;
            const thumbnail = home.coverImage;
            const fullPrice = home.priceLabel || `₦${home.priceNaira.toLocaleString()}`;
            const period =
              home.period && home.period.replace(/^\//, "");
            const categoryLabel =
              home.type === "SALE"
                ? "For Sale"
                : home.type === "RENT"
                  ? "For Rent"
                  : "Shortlet";
            const categoryStyles =
              home.type === "SALE"
                ? "bg-primary text-white"
                : home.type === "RENT"
                  ? "bg-blue-500 text-white"
                  : "bg-amber-500 text-white";

            return (
              <div
                key={home.id}
                data-vl-card
                className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {/* Video / Thumbnail area */}
                <div className="relative h-52 overflow-hidden rounded-t-[20px] bg-black">
                  {/* Category pill */}
                  <span
                    className={`absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full text-[11px] font-semibold shadow-sm ${categoryStyles}`}
                  >
                    {categoryLabel}
                  </span>
                  {playingIdx === i && videoUrl ? (
                    <>
                      {videoUrl.includes("youtu") || videoUrl.includes("vimeo") ? (
                        <iframe
                          src={`${videoUrl}?autoplay=1`}
                          title={home.title}
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      ) : (
                        <video
                          src={videoUrl}
                          autoPlay
                          controls
                          className="w-full h-full"
                        />
                      )}
                      {/* Close button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlayingIdx(null);
                        }}
                        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <img
                        src={thumbnail}
                        alt={home.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

                      {/* Play button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlayingIdx(i);
                        }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:bg-white hover:scale-110 transition-all duration-300">
                          <Play className="w-6 h-6 text-primary-dark fill-primary-dark ml-0.5" />
                        </div>
                      </button>
                    </>
                  )}
                </div>

                {/* Content — glass morphism panel */}
                <a
                  href={`/property/${home.slug}`}
                  className="mx-3 mb-3 -mt-6 relative z-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl px-5 pt-4 pb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)] block"
                >
                  {/* Price */}
                  <p className="font-heading font-bold text-primary-dark text-[18px]">
                    {fullPrice}
                    {period && (
                      <span className="text-text-subtle text-[13px] font-normal ml-1">
                        /{period}
                      </span>
                    )}
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
                      {home.baths} Baths
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Maximize className="w-3.5 h-3.5" />
                      {home.sqft}m²
                    </span>
                  </div>
                </a>

                {/* Arrow — clipped circle at bottom-right corner */}
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-full absolute -right-3 -bottom-3 z-20 group-hover:bg-primary transition-colors duration-300 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
              </div>
            );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default VideoListings;
