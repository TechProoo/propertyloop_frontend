import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, RotateCcw, WifiOff } from "lucide-react";
import listingsService from "../../api/services/listings";
import type { Listing } from "../../api/types";
import PropertyTile from "./PropertyTile";
import { listingToTile } from "./tileData";
import heroImg1 from "../../assets/hero_img_1.jpg";
import heroImg2 from "../../assets/hero_img_2.jpg";
import hs1 from "../../assets/hs1.avif";
import lek from "../../assets/lek.jpg";

const HERO_CARDS = [
  {
    title: "Find your dream home",
    cta: "Browse homes",
    href: "/buy",
    bg: "#e3efe7",
    image: heroImg1,
  },
  {
    title: "Rent with confidence",
    cta: "Browse rentals",
    href: "/rent",
    bg: "#f5ead4",
    image: heroImg2,
  },
  {
    title: "Book a shortlet",
    cta: "Browse shortlets",
    href: "/shortlet",
    bg: "#dae8f5",
    image: hs1,
  },
  {
    title: "Find a verified agent",
    cta: "Browse agents",
    href: "/find-agent",
    bg: "#ecdaf7",
    image: lek,
  },
];

const STOCK_COUNT = 4;

function PanelSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-3xl bg-white p-4">
      <div className="h-5 w-3/4 animate-pulse rounded-full bg-primary/10" />
      <div className="mt-2 h-3.5 w-1/2 animate-pulse rounded-full bg-primary/5" />
      <div className="mt-3 aspect-4/3 w-full animate-pulse rounded-2xl bg-primary/5" />
      <div className="mt-3.5 h-5 w-1/3 animate-pulse rounded-full bg-primary/10" />
    </div>
  );
}

export default function StockHero() {
  const [stock, setStock] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    listingsService
      .list({ ownership: "HOUSE", limit: STOCK_COUNT, sort: "newest" })
      .then((res) => {
        if (!alive) return;
        setStock(res.items);
        setFailed(false);
      })
      .catch(() => {
        if (alive) setFailed(true);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [attempt]);

  const retry = () => {
    setLoading(true);
    setFailed(false);
    setAttempt((n) => n + 1);
  };

  return (
    <section className="relative bg-[#f5f0eb]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-linear-to-b from-[#0f2e1b] via-[#0f2e1b]/50 to-transparent" />

      <div className="relative mx-auto max-w-360 px-4 pt-5 pb-10 sm:px-6 lg:px-8">
        {/* ── Hero category cards ──────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HERO_CARDS.map((card) => (
            <Link
              key={card.href}
              to={card.href}
              className="group flex flex-col rounded-sm p-5 pb-3 shadow-sm transition-shadow hover:shadow-md"
              style={{ backgroundColor: card.bg }}
            >
              <h2 className="text-xl font-bold leading-tight text-[#0f1111]">
                {card.title}
              </h2>
              <div className="mt-3 aspect-4/3 overflow-hidden rounded-sm">
                <img
                  src={card.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="mt-3 inline-flex items-center gap-0.5 text-[13px] font-medium text-primary hover:text-primary-dark hover:underline">
                {card.cta}
                <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>

        {/* ── PropertyLoop stock ───────────────────────────────────── */}
        <div className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                PropertyLoop stock
              </p>
              <h2 className="font-heading mt-1.5 text-[26px] font-bold leading-[1.1] tracking-tight text-primary-dark sm:text-[34px]">
                Property we list ourselves
              </h2>
              <p className="mt-1.5 max-w-xl text-[14px] leading-relaxed text-text-secondary">
                Checked by our team before it reaches you — papers, photographs
                and price.
              </p>
            </div>
            <Link
              to="/buy"
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 px-5 py-2.5 text-[13px] font-bold text-primary-dark transition-colors hover:bg-primary hover:text-white"
            >
              Browse everything
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {failed ? (
            <div className="mt-5 flex flex-col items-center gap-3 rounded-3xl bg-white px-6 py-12 text-center">
              <WifiOff className="h-6 w-6 text-text-subtle" />
              <p className="text-sm text-text-secondary">
                We could not load our stock just now.
              </p>
              <button
                onClick={retry}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-[13px] font-bold text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Try again
              </button>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {loading
                ? Array.from({ length: STOCK_COUNT }).map((_, i) => (
                    <PanelSkeleton key={i} />
                  ))
                : stock.map((l) => (
                    <PropertyTile
                      key={l.id}
                      data={listingToTile(l)}
                      variant="panel"
                      badge="PropertyLoop"
                    />
                  ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
