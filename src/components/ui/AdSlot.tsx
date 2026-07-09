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

  if (variant === "card") {
    return (
      <a
        ref={ref}
        href={ad.ctaUrl}
        target="_blank"
        rel="noreferrer sponsored"
        onClick={onClick}
        className={`group block rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow ${className}`}
      >
        <div className="relative h-44 overflow-hidden">
          <img
            src={ad.imageUrl}
            alt={ad.brandName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white px-2 py-0.5 rounded-full">
            Sponsored
          </span>
        </div>
        <div className="p-4">
          <p className="text-xs text-gray-400 font-medium">{ad.brandName}</p>
          <p className="text-sm font-semibold text-gray-800 mt-0.5 line-clamp-2">
            {ad.headline}
          </p>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary mt-2">
            {ad.ctaLabel} <ExternalLink className="w-3.5 h-3.5" />
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
      className={`group relative block rounded-2xl overflow-hidden ${className}`}
    >
      <img
        src={ad.imageUrl}
        alt={ad.brandName}
        className="w-full h-40 sm:h-52 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
      <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
        Sponsored · {ad.brandName}
      </span>
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
        <p className="text-white font-bold text-base sm:text-xl max-w-lg leading-snug">
          {ad.headline}
        </p>
        {ad.body && (
          <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-md line-clamp-2 hidden sm:block">
            {ad.body}
          </p>
        )}
        <span className="inline-flex items-center gap-1.5 mt-2.5 bg-white text-gray-900 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full group-hover:bg-gray-100 transition-colors">
          {ad.ctaLabel} <ExternalLink className="w-3.5 h-3.5" />
        </span>
      </div>
    </a>
  );
}
