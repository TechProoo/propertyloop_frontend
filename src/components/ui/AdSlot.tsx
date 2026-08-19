// Reusable sponsored-content slot. Drop <AdSlot placement="HOME_BANNER" />
// anywhere; it fetches the active ad for that placement, renders nothing at
// all when no campaign is live (zero layout cost), fires an impression once
// when it scrolls into view, and records the click before opening the
// brand's landing page.
import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import adsService, { type AdPlacement, type PublicAd } from "../../api/services/ads";

export default function AdSlot({
  placement,
  variant = "banner",
  className = "",
}: {
  placement: AdPlacement;
  /** banner = wide strip; card = grid-item sized (for in-feed slots) */
  variant?: "banner" | "card";
  className?: string;
}) {
  const [ad, setAd] = useState<PublicAd | null>(null);
  const [loaded, setLoaded] = useState(false);
  const seen = useRef(false);
  const ref = useRef<HTMLAnchorElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let on = true;
    adsService
      .serve(placement)
      .then((ads) => {
        if (!on || ads.length === 0) return;
        // Cheap rotation: several campaigns in one slot take turns per render.
        setAd(ads[Math.floor(Math.random() * ads.length)]);
      })
      .catch(() => {});
    return () => {
      on = false;
    };
  }, [placement]);

  // Impression: count once, only when the slot actually enters the viewport.
  useEffect(() => {
    if (!ad || !ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !seen.current) {
          seen.current = true;
          adsService.impression(ad.id);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ad]);

  // A creative already in the browser cache fires `load` before React attaches
  // onLoad, which would strand the fade at opacity-0 — check .complete too.
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, [ad]);

  if (!ad) return null;

  const onClick = () => adsService.click(ad.id);

  if (variant === "card") {
    return (
      <a
        ref={ref}
        href={ad.ctaUrl}
        target="_blank"
        rel="noreferrer sponsored"
        onClick={onClick}
        aria-label={`Sponsored by ${ad.brandName}: ${ad.headline}`}
        className={`group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.06] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${className}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          <img
            ref={imgRef}
            src={ad.imageUrl}
            alt={ad.brandName}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
            className={`h-full w-full object-cover transition-all duration-500 ease-out group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white">
              Sponsored
            </span>
          </span>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            {ad.brandName}
          </p>
          <p className="mt-1 line-clamp-2 text-[15px] font-bold leading-snug text-gray-900">
            {ad.headline}
          </p>
          {ad.body && (
            <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-gray-500">
              {ad.body}
            </p>
          )}
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-1.5">
            {ad.ctaLabel}
            <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </a>
    );
  }

  return (
    <a
      ref={ref}
      href={ad.ctaUrl}
      target="_blank"
      rel="noreferrer sponsored"
      onClick={onClick}
      aria-label={`Sponsored by ${ad.brandName}: ${ad.headline}`}
      className={`group relative block overflow-hidden rounded-3xl bg-gray-900 ring-1 ring-black/[0.06] shadow-sm transition-all duration-300 hover:shadow-xl ${className}`}
    >
      <div className="relative h-44 overflow-hidden sm:h-56 md:h-60">
        <img
          ref={imgRef}
          src={ad.imageUrl}
          alt={ad.brandName}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-all duration-[600ms] ease-out group-hover:scale-[1.04] ${loaded ? "opacity-100" : "opacity-0"}`}
        />
        {/* Two stacked scrims: a left-to-right wash so copy always reads, plus a
            bottom lift that anchors the headline + CTA. */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
      </div>

      <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 ring-1 ring-white/25 backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/90">
          Sponsored
        </span>
      </span>

      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
          {ad.brandName}
        </p>
        <p className="mt-1 max-w-xl text-lg font-bold leading-snug text-white sm:text-2xl">
          {ad.headline}
        </p>
        {ad.body && (
          <p className="mt-1.5 hidden max-w-lg text-sm leading-snug text-white/75 line-clamp-2 sm:block">
            {ad.body}
          </p>
        )}
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition-all duration-200 group-hover:gap-2.5 group-hover:bg-primary group-hover:text-white">
          {ad.ctaLabel}
          <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </a>
  );
}
