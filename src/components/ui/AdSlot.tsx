// Reusable sponsored-content slot. Drop <AdSlot placement="HOME_BANNER" />
// anywhere; it fetches the active ad for that placement, renders nothing at
// all when no campaign is live (zero layout cost), fires an impression once
// when it scrolls into view, and records the click before opening the
// brand's landing page.
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
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
  const seen = useRef(false);
  const ref = useRef<HTMLAnchorElement>(null);

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

  if (!ad) return null;

  const onClick = () => adsService.click(ad.id);

  if (placement === "HOME_BANNER") {
    return (
      <a
        ref={ref}
        href={ad.ctaUrl}
        target="_blank"
        rel="noreferrer sponsored"
        onClick={onClick}
        aria-label={`Sponsored by ${ad.brandName}: ${ad.headline}`}
        className={`group relative isolate block overflow-hidden rounded-[14px] bg-[#123d2a] text-[#fbf8f1] shadow-[0_22px_60px_-30px_rgba(12,46,31,0.58)] ring-1 ring-[#123d2a]/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_75px_-32px_rgba(12,46,31,0.72)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${className}`}
      >
        <div className="grid min-h-[350px] lg:grid-cols-[minmax(0,0.92fr)_minmax(470px,1.48fr)]">
          <div className="relative flex min-h-[350px] flex-col justify-between overflow-hidden px-6 py-7 sm:px-9 sm:py-9 lg:min-h-[390px] lg:px-11 lg:py-10">
            <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:26px_26px]" />
            <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full border border-[#d7ae67]/30" />
            <div className="pointer-events-none absolute -left-7 -top-11 h-36 w-36 rounded-full border border-[#d7ae67]/20" />

            <div className="relative flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-2 border border-white/25 bg-white/[0.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#f6efd9]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f1c46e] shadow-[0_0_0_4px_rgba(241,196,110,0.15)]" />
                Sponsored
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">PropertyLoop partner</span>
            </div>

            <div className="relative max-w-xl pt-10 lg:pt-14">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#f1c46e]">{ad.brandName}</p>
              <h2 className="max-w-lg font-display text-3xl leading-[1.04] tracking-[-0.035em] text-white sm:text-4xl lg:text-[2.8rem]">
                {ad.headline}
              </h2>
              {ad.body && <p className="mt-5 max-w-md text-sm leading-6 text-white/70 sm:text-[15px]">{ad.body}</p>}
            </div>

            <span className="relative mt-8 inline-flex w-fit items-center gap-3 border border-[#f6efd9]/25 bg-[#f8f2e5] px-4 py-3 text-sm font-bold text-[#123d2a] transition-all duration-300 group-hover:border-[#f1c46e] group-hover:bg-[#f1c46e] sm:px-5">
              {ad.ctaLabel}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>

          <div className="relative min-h-[260px] overflow-hidden border-t border-white/15 bg-[#0c2519] lg:min-h-0 lg:border-l lg:border-t-0">
            <img
              src={ad.imageUrl}
              alt={ad.brandName}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,61,42,0.42)_0%,transparent_34%,rgba(4,18,12,0.08)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(6,25,17,0.44)_0%,transparent_42%)]" />
            <div className="absolute inset-4 border border-white/35 sm:inset-5" />
            <div className="absolute bottom-7 right-7 flex items-center gap-3 bg-[#f8f2e5] px-3.5 py-2.5 text-[#123d2a] shadow-xl sm:bottom-9 sm:right-9">
              <span className="text-[9px] font-bold uppercase tracking-[0.18em]">Discover more</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </a>
    );
  }

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
            src={ad.imageUrl}
            alt={ad.brandName}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
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
          src={ad.imageUrl}
          alt={ad.brandName}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
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
