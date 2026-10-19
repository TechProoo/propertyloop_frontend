import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Home, ShieldCheck } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import listingsService from "../../api/services/listings";
import type { Listing } from "../../api/types";
import { handleBannerError } from "../../lib/bannerFallback";

gsap.registerPlugin(ScrollTrigger);

const PropertyLogbook = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [logbookListings, setLogbookListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogbookData = async () => {
      try {
        const HOME_LIMIT = 5;
        const PER_BUCKET = 12;
        const [sold, rented, active] = await Promise.all([
          listingsService
            .list({ status: "SOLD", limit: PER_BUCKET, sort: "newest" })
            .catch(() => ({ items: [] as Listing[] })),
          listingsService
            .list({ status: "RENTED", limit: PER_BUCKET, sort: "newest" })
            .catch(() => ({ items: [] as Listing[] })),
          listingsService
            .list({ limit: PER_BUCKET, sort: "newest" })
            .catch(() => ({ items: [] as Listing[] })),
        ]);

        const editedActive = (active.items || []).filter((l) => {
          if (!l.updatedAt) return false;
          const created = new Date(l.createdAt).getTime();
          const updated = new Date(l.updatedAt).getTime();
          return updated - created > 60_000;
        });

        const merged: Listing[] = [];
        const seen = new Set<string>();
        for (const l of [
          ...(sold.items || []),
          ...(rented.items || []),
          ...editedActive,
        ]) {
          if (seen.has(l.id)) continue;
          seen.add(l.id);
          merged.push(l);
        }

        merged.sort((a, b) => {
          const aT = new Date(a.updatedAt ?? a.createdAt).getTime();
          const bT = new Date(b.updatedAt ?? b.createdAt).getTime();
          return bT - aT;
        });

        const final = merged.length > 0 ? merged : active.items || [];
        setLogbookListings(final.slice(0, HOME_LIMIT));
      } catch (error) {
        console.error("Error fetching logbook data:", error);
        setLogbookListings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLogbookData();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const entries = el.querySelectorAll("[data-pl-entry]");
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: el, start: "top 80%", once: true },
    });
    if (entries.length) {
      tl.fromTo(
        entries,
        { x: 40, opacity: 0, scale: 0.97 },
        { x: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.12, ease: "power4.out" },
      );
    }
    return () => { tl.kill(); };
  }, [loading, logbookListings.length]);

  return (
    <section ref={sectionRef} className="bg-[#f5f0eb]">
      <div className="mx-auto max-w-360 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          {/* Left — intro */}
          <div className="shrink-0 lg:w-95 lg:sticky lg:top-[calc(2rem+var(--dl-bar-h))] lg:self-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.15em] text-primary">
              <ShieldCheck className="h-3 w-3" />
              Property logbook
            </span>
            <h2 className="font-heading mt-3 text-[26px] font-bold leading-[1.1] tracking-tight text-primary-dark sm:text-[34px]">
              Every repair. Every record.
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
              Every property on PropertyLoop gets a permanent digital logbook.
              All maintenance, repairs, and services are recorded with verified
              vendor details — building trust and transparency for buyers,
              tenants, and owners.
            </p>

            {/* Sample property card */}
            <div className="mt-6 relative overflow-hidden rounded-2xl border border-border-light bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Home className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[14px] font-bold text-primary-dark">
                    4-Bed Villa, Lekki Phase 1
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Property ID: PL-00482
                  </p>
                </div>
              </div>
              <div className="my-3 h-px bg-border-light" />
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <span>6 service records</span>
                <span>Last updated: Mar 2026</span>
              </div>
              <div className="absolute -right-3 -top-3 h-14 w-14 rounded-full bg-primary/10">
                <ShieldCheck className="absolute bottom-3.5 left-3.5 h-5 w-5 text-primary" />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/logbook/about"
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 px-5 py-2.5 text-[13px] font-bold text-primary-dark transition-colors hover:bg-primary hover:text-white"
              >
                Learn about logbooks
              </Link>
              {logbookListings.length >= 5 && (
                <Link
                  to="/logbook"
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primary-dark"
                >
                  View more
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>

          {/* Right — timeline */}
          <div className="relative min-w-0 flex-1 overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-14 w-14 animate-pulse items-center justify-center rounded-full bg-primary/10">
                  <ShieldCheck className="h-6 w-6 text-primary/50" />
                </div>
                <p className="text-sm text-text-secondary">
                  Loading logbooks...
                </p>
              </div>
            ) : logbookListings.length > 0 ? (
              <>
                <div className="absolute bottom-0 left-8 top-0 w-1 rounded-full bg-gradient-to-b from-primary to-primary/20" />
                <div className="space-y-4 pl-20">
                  {logbookListings.map((property) => {
                    const created = new Date(property.createdAt).getTime();
                    const updated = property.updatedAt
                      ? new Date(property.updatedAt).getTime()
                      : created;
                    const wasEdited = updated - created > 60_000;
                    let label: "Sold" | "Rented" | "Updated" | "Listed";
                    let badgeClass: string;
                    if (property.status === "SOLD") {
                      label = "Sold";
                      badgeClass = "bg-green-50 text-green-600";
                    } else if (property.status === "RENTED") {
                      label = "Rented";
                      badgeClass = "bg-blue-50 text-blue-600";
                    } else if (wasEdited) {
                      label = "Updated";
                      badgeClass = "bg-amber-50 text-amber-600";
                    } else {
                      label = "Listed";
                      badgeClass = "bg-primary/10 text-primary";
                    }
                    const eventDate = new Date(
                      property.updatedAt ?? property.createdAt,
                    ).toLocaleDateString();
                    return (
                      <div key={property.id} data-pl-entry className="relative">
                        <div className="absolute -left-14 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-primary shadow-lg">
                          <div className="h-2 w-2 rounded-full bg-white" />
                        </div>
                        <div className="rounded-2xl border border-border-light bg-white p-4 shadow-sm transition-shadow hover:shadow-[0_6px_20px_rgba(31,111,67,0.1)]">
                          <div className="mb-3 flex items-start gap-3">
                            <img
                              src={
                                property.coverImage ||
                                "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&h=100&fit=crop"
                              }
                              alt={property.title}
                              onError={handleBannerError}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <h4 className="truncate text-[13px] font-bold text-primary-dark">
                                {property.title}
                              </h4>
                              <p className="text-xs text-text-secondary">
                                {property.location}
                              </p>
                            </div>
                          </div>
                          <div className="mb-2 flex items-center gap-2 text-xs text-text-secondary">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              {label} · {eventDate}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-primary-dark">
                              {property.beds} bed
                              {property.beds !== 1 ? "s" : ""} ·{" "}
                              {property.baths} bath
                              {property.baths !== 1 ? "s" : ""}
                            </span>
                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${badgeClass}`}
                            >
                              {label}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <ShieldCheck className="h-6 w-6 text-primary/50" />
                </div>
                <p className="text-sm font-semibold text-primary-dark">
                  Property logbooks coming soon
                </p>
                <p className="mt-1 max-w-sm text-[13px] text-text-secondary">
                  Mark properties as sold or rented to see them in the logbook.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyLogbook;
