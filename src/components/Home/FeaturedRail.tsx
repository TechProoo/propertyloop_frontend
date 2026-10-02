import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import featuredPropertiesService from "../../api/services/featuredProperties";
import type { FeaturedProperty } from "../../api/services/featuredProperties";
import PropertyTile from "./PropertyTile";
import { featuredToTile } from "./tileData";

/**
 * Paid featured placements.
 *
 * These used to be the home page's hero carousel. The hero now leads with
 * PropertyLoop's own stock, so the placements people pay for get their own
 * band directly under it — still above the fold on a laptop, and no longer
 * competing with a search box for attention.
 *
 * Renders nothing at all when no campaign is live.
 */

const COUNT = 4;

export default function FeaturedRail() {
  const [items, setItems] = useState<FeaturedProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    featuredPropertiesService
      .listActive()
      .then((res) => {
        if (alive) setItems(res.filter((f) => f.imageUrls?.length > 0).slice(0, COUNT));
      })
      .catch(() => {
        // A failed ad fetch is not worth an error state on the home page.
        if (alive) setItems([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (loading || items.length === 0) return null;

  return (
    <section className="bg-[#f5f0eb] pb-10">
      <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent-ink">
              <Sparkles className="h-3.5 w-3.5" />
              Featured
            </p>
            <h2 className="font-heading mt-1.5 text-[24px] font-bold leading-[1.1] tracking-tight text-primary-dark sm:text-[30px]">
              Developments worth a look
            </h2>
          </div>
          <Link
            to="/featured"
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 px-5 py-2.5 text-[13px] font-bold text-primary-dark transition-colors hover:bg-primary hover:text-white"
          >
            See all featured
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4">
          {items.map((f) => (
            <PropertyTile key={f.id} data={featuredToTile(f)} badge="Featured" />
          ))}
        </div>
      </div>
    </section>
  );
}
