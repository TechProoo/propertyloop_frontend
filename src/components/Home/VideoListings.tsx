import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Bed, Bath, Maximize, Play, X } from "lucide-react";
import listingsService from "../../api/services/listings";
import type { Listing } from "../../api/types";
import { handleBannerError } from "../../lib/bannerFallback";
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
    const cards = el.querySelectorAll("[data-vl-card]");
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
  }, [loading, listings.length]);

  return (
    <section ref={sectionRef} className="bg-[#f5f0eb]">
      <div className="mx-auto max-w-360 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.15em] text-primary">
              <Play className="h-3 w-3" />
              Video tours
            </span>
            <h2 className="font-heading mt-3 text-[26px] font-bold leading-[1.1] tracking-tight text-primary-dark sm:text-[34px]">
              Walk through before you visit
            </h2>
            <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-text-secondary">
              Watch video tours filmed by verified agents before you visit in
              person.
            </p>
          </div>
          <Link
            to="/video-tours"
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 px-5 py-2.5 text-[13px] font-bold text-primary-dark transition-colors hover:bg-primary hover:text-white"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-white p-3">
                <div className="aspect-[4/3] w-full rounded-xl bg-primary/5" />
                <div className="mt-3 h-4 w-2/3 rounded-full bg-primary/10" />
                <div className="mt-2 h-3 w-1/2 rounded-full bg-primary/5" />
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
            <Play className="h-6 w-6 text-text-subtle" />
            <p className="text-sm font-semibold text-primary-dark">
              No video tours yet
            </p>
            <p className="max-w-sm text-[13px] text-text-secondary">
              Video tours are coming soon. Check back later to explore
              properties with verified agent walkthroughs.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((home, i) => {
              const videoUrl = home.videoUrl;
              const thumbnail = home.coverImage;
              const fullPrice =
                home.priceLabel || `₦${home.priceNaira.toLocaleString()}`;
              const period = home.period && home.period.replace(/^\//, "");
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
                    ? "bg-primary-light text-white"
                    : "bg-[#b9842c] text-white";

              return (
                <div
                  key={home.id}
                  data-vl-card
                  className="group overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)]"
                >
                  {/* Video / Thumbnail */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-black">
                    <span
                      className={`absolute left-3 top-3 z-20 rounded-full px-2.5 py-1 text-[10px] font-semibold shadow-sm ${categoryStyles}`}
                    >
                      {categoryLabel}
                    </span>
                    {playingIdx === i && videoUrl ? (
                      <>
                        {videoUrl.includes("youtu") ||
                        videoUrl.includes("vimeo") ? (
                          <iframe
                            src={`${videoUrl}?autoplay=1`}
                            title={home.title}
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            className="h-full w-full"
                          />
                        ) : (
                          <video
                            src={videoUrl}
                            autoPlay
                            controls
                            className="h-full w-full"
                          />
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlayingIdx(null);
                          }}
                          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <img
                          src={thumbnail}
                          alt={home.title}
                          onError={handleBannerError}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#1a1a1a] text-white transition-colors group-hover:bg-primary">
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlayingIdx(i);
                          }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-[0_6px_20px_rgba(0,0,0,0.2)] backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white">
                            <Play className="ml-0.5 h-6 w-6 fill-primary-dark text-primary-dark" />
                          </div>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Info */}
                  <Link to={`/property/${home.id}`} className="block p-4">
                    <p className="text-[16px] font-bold text-primary-dark">
                      {fullPrice}
                      {period && (
                        <span className="ml-1 text-[13px] font-normal text-text-subtle">
                          /{period}
                        </span>
                      )}
                    </p>
                    <h3 className="mt-1 truncate text-[14px] font-bold leading-snug text-primary-dark">
                      {home.title}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-text-subtle">
                      {home.address}
                    </p>
                    <div className="mt-3 flex gap-4 border-t border-border-light pt-3 text-xs text-text-secondary">
                      <span className="inline-flex items-center gap-1">
                        <Bed className="h-3.5 w-3.5" /> {home.beds} Beds
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Bath className="h-3.5 w-3.5" /> {home.baths} Baths
                      </span>
                      {home.sqft && (
                        <span className="inline-flex items-center gap-1">
                          <Maximize className="h-3.5 w-3.5" /> {home.sqft} m²
                        </span>
                      )}
                    </div>
                  </Link>
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
