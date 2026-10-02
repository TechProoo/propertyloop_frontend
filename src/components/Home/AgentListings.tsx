import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RotateCcw, WifiOff } from "lucide-react";
import listingsService from "../../api/services/listings";
import type { Listing } from "../../api/types";
import PropertyTile from "./PropertyTile";
import { listingToTile } from "./tileData";

/**
 * Agents' own listings, directly under PropertyLoop's stock.
 *
 * Same card, smaller shape: the two rows read as one shop front rather than
 * two unrelated sections, and the order says which inventory we stand behind
 * without saying anything unkind about the rest.
 */

const COUNT = 8;

function TileSkeleton() {
  return (
    <div className="rounded-3xl bg-white p-3">
      <div className="aspect-[4/3] w-full animate-pulse rounded-2xl bg-primary/5" />
      <div className="mt-3 h-4 w-3/4 animate-pulse rounded-full bg-primary/10" />
      <div className="mt-2 h-3 w-1/2 animate-pulse rounded-full bg-primary/5" />
      <div className="mt-3 h-5 w-1/3 animate-pulse rounded-full bg-primary/10" />
    </div>
  );
}

export default function AgentListings() {
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    listingsService
      .list({ ownership: "AGENT_OWN", limit: COUNT, sort: "newest" })
      .then((res) => {
        if (!alive) return;
        setItems(res.items);
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

  if (!loading && !failed && items.length === 0) return null;

  return (
    <section className="bg-[#f5f0eb] py-10">
      <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
              From our agents
            </p>
            <h2 className="font-heading mt-1.5 text-[24px] font-bold leading-[1.1] tracking-tight text-primary-dark sm:text-[30px]">
              Newly listed across Nigeria
            </h2>
            <p className="mt-1.5 max-w-xl text-[14px] leading-relaxed text-text-secondary">
              Listed by agents on PropertyLoop. Every one of them is verified
              before a listing goes live.
            </p>
          </div>
          <Link
            to="/buy"
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 px-5 py-2.5 text-[13px] font-bold text-primary-dark transition-colors hover:bg-primary hover:text-white"
          >
            See all listings
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {failed ? (
          <div className="mt-5 flex flex-col items-center gap-3 rounded-3xl bg-white px-6 py-12 text-center">
            <WifiOff className="h-6 w-6 text-text-subtle" />
            <p className="text-sm text-text-secondary">
              These listings could not be loaded.
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
          <div className="mt-5 grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4">
            {loading
              ? Array.from({ length: COUNT }).map((_, i) => (
                  <TileSkeleton key={i} />
                ))
              : items.map((l) => (
                  <PropertyTile key={l.id} data={listingToTile(l)} />
                ))}
          </div>
        )}
      </div>
    </section>
  );
}
