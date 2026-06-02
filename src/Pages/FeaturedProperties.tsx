import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  Star,
  WifiOff,
  RotateCcw,
  LayoutGrid,
} from "lucide-react";
import Seo from "../components/Seo";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import AuthGate from "../components/ui/AuthGate";
import BookmarkButton from "../components/ui/BookmarkButton";
import EmptyState from "../components/ui/EmptyState";
import listingsService from "../api/services/listings";
import type { Listing } from "../api/types";
import { handleBannerError } from "../lib/bannerFallback";

const PAGE_SIZE = 12;

const FeaturedProperties = () => {
  const [homes, setHomes] = useState<Listing[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchPage = useCallback((pageToLoad: number) => {
    const isFirst = pageToLoad === 1;
    if (isFirst) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(false);

    listingsService
      .list({ limit: PAGE_SIZE, page: pageToLoad, sort: "newest" })
      .then((res) => {
        const fresh = res.items.filter(
          (l) => l.type === "SALE" || l.type === "RENT",
        );
        setHomes((prev) => {
          if (isFirst) return fresh;
          // Guard against duplicates if the same page loads twice
          const seen = new Set(prev.map((h) => h.id));
          return [...prev, ...fresh.filter((h) => !seen.has(h.id))];
        });
        setPage(res.page);
        setPages(res.pages);
        setTotal(res.total);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
        setLoadingMore(false);
      });
  }, []);

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  // Infinite scroll — load the next page when the sentinel enters the viewport
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    if (loading || loadingMore || error) return;
    if (page >= pages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchPage(page + 1);
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [page, pages, loading, loadingMore, error, fetchPage]);

  const hasMore = page < pages;

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Seo
        title="Featured Properties"
        description="Browse all hand-picked properties on PropertyLoop — verified by our agents with full logbook history and transparent pricing."
        path="/featured"
        keywords="featured properties Nigeria, verified listings, buy property, rent property Lagos"
      />
      <Navbar />

      <main className="w-full px-6 md:px-12 lg:px-20 pt-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-heading text-3xl md:text-4xl lg:text-[3rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
              Featured <span className="text-primary">Properties</span>
            </h1>
            <p className="text-text-secondary text-sm leading-relaxed mt-3 max-w-lg">
              Hand-picked properties verified by our agents with full logbook
              history and transparent pricing.
            </p>
            {!loading && !error && total > 0 && (
              <p className="text-text-secondary text-sm mt-6">
                Showing{" "}
                <span className="font-bold text-primary-dark">
                  {homes.length}
                </span>{" "}
                of <span className="font-bold text-primary-dark">{total}</span>{" "}
                properties
              </p>
            )}
          </div>

          {/* Loading (initial) */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden animate-pulse"
                >
                  <div className="h-52 bg-border-light/60" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-border-light/60 rounded-full w-1/3" />
                    <div className="h-4 bg-border-light/60 rounded-full w-2/3" />
                    <div className="h-3 bg-border-light/60 rounded-full w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <WifiOff className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="font-heading font-bold text-primary-dark text-lg">
                Couldn’t load properties
              </h3>
              <p className="text-text-secondary text-sm mt-2 max-w-sm">
                Check your internet connection and try again.
              </p>
              <button
                onClick={() => fetchPage(page > 0 ? page : 1)}
                className="mt-6 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && homes.length === 0 && (
            <EmptyState
              icon={<LayoutGrid className="w-10 h-10" />}
              title="Featured Properties Coming Soon"
              description="Our agents are curating the best properties for you. Check back soon to discover hand-picked homes."
              actions={[]}
            />
          )}

          {/* Grid */}
          {!loading && !error && homes.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {homes.map((home, i) => (
                  <motion.div
                    key={home.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (i % PAGE_SIZE) * 0.05 }}
                  >
                    <AuthGate
                      href={`/property/${home.id}`}
                      className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer block"
                    >
                      {/* Image */}
                      <div className="h-52 overflow-hidden rounded-t-[20px] relative">
                        <img
                          src={home.coverImage}
                          alt={home.title}
                          onError={handleBannerError}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-primary-dark">
                          <Star className="w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]" />
                          {home.rating}
                        </span>
                        <div className="absolute top-3 right-3 flex items-center gap-2">
                          <BookmarkButton
                            id={home.id}
                            type="property"
                            size="sm"
                          />
                          <span
                            className={`px-2.5 py-1 rounded-full backdrop-blur-sm text-white text-xs font-semibold tracking-wide shadow-sm ${
                              home.type === "SALE"
                                ? "bg-primary/90"
                                : "bg-indigo-500/90"
                            }`}
                          >
                            {home.type === "SALE" ? "For Sale" : "For Rent"}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="mx-3 mb-3 -mt-6 relative z-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl px-5 pt-4 pb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                        <p className="font-heading font-bold text-primary-dark text-[18px]">
                          {home.priceLabel}
                        </p>
                        <h3 className="font-heading font-bold text-primary-dark text-[15px] leading-snug mt-1.5 truncate">
                          {home.title}
                        </h3>
                        <p className="text-text-secondary text-xs mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {home.address}
                        </p>

                        <div className="h-px bg-border-light mt-4 mb-3" />

                        <div className="flex items-center gap-4 text-text-secondary text-xs">
                          <span className="flex items-center gap-1.5">
                            <Bed className="w-3.5 h-3.5" />
                            {home.beds} Beds
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Bath className="w-3.5 h-3.5" />
                            {home.baths} Bathrooms
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Maximize className="w-3.5 h-3.5" />
                            {home.sqft}m²
                          </span>
                        </div>
                      </div>
                    </AuthGate>
                  </motion.div>
                ))}
              </div>

              {/* Infinite-scroll sentinel + loading indicator */}
              <div ref={sentinelRef} className="h-10" />
              {loadingMore && (
                <div className="mt-8 flex justify-center">
                  <div className="inline-flex items-center gap-2 text-text-secondary text-sm">
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    Loading more properties…
                  </div>
                </div>
              )}
              {!hasMore && !loadingMore && (
                <p className="mt-12 text-center text-text-secondary text-sm">
                  You’ve reached the end — that’s every featured property.
                </p>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FeaturedProperties;
