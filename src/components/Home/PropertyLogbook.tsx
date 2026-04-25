import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Home,
  Clock,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import listingsService from "../../api/services/listings";
import type { Listing } from "../../api/types";

gsap.registerPlugin(ScrollTrigger);

const PropertyLogbook = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [logbookListings, setLogbookListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch sold/rented properties for logbook display
  useEffect(() => {
    const fetchLogbookData = async () => {
      try {
        const HOME_LIMIT = 5;
        const result = await listingsService.list({
          status: "SOLD",
          limit: HOME_LIMIT,
          sort: "newest",
        });

        if (result.items && result.items.length > 0) {
          setLogbookListings(result.items);
          setLoading(false);
          return;
        }

        // If no SOLD properties, try RENTED
        const rentedResult = await listingsService.list({
          status: "RENTED",
          limit: HOME_LIMIT,
          sort: "newest",
        });

        if (rentedResult.items && rentedResult.items.length > 0) {
          setLogbookListings(rentedResult.items);
          setLoading(false);
          return;
        }

        // If no SOLD or RENTED, fetch any listings as fallback so the
        // section never appears empty on a fresh deployment.
        const allResult = await listingsService.list({
          limit: HOME_LIMIT,
          sort: "newest",
        });
        setLogbookListings(allResult.items || []);
      } catch (error) {
        console.error("Error fetching logbook data:", error);
        setLogbookListings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLogbookData();
  }, []);

  // Animation timeline
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const label = el.querySelector("[data-pl-label]");
    const heading = el.querySelector("[data-pl-heading]");
    const desc = el.querySelector("[data-pl-desc]");
    const propCard = el.querySelector("[data-pl-propcard]");
    const learnBtn = el.querySelector("[data-pl-learn]");
    const timelineLine = el.querySelector("[data-pl-line]");
    const timelineCards = el.querySelectorAll("[data-pl-entry]");

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: el, start: "top 75%", once: true },
    });

    // Label
    if (label) {
      tl.fromTo(
        label,
        { y: -15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
      );
    }

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
        "-=0.2",
      );
    }

    // Description
    if (desc) {
      tl.fromTo(
        desc,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.4",
      );
    }

    // Property card — scale-in with spring
    if (propCard) {
      tl.fromTo(
        propCard,
        { y: 40, opacity: 0, scale: 0.92 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.3)" },
        "-=0.3",
      );
    }

    // Learn button
    if (learnBtn) {
      tl.fromTo(
        learnBtn,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.6)" },
        "-=0.4",
      );
    }

    // Timeline vertical line — grow from top
    if (timelineLine) {
      tl.fromTo(
        timelineLine,
        { scaleY: 0, transformOrigin: "top center" },
        { scaleY: 1, duration: 1.0, ease: "power4.out" },
        "-=0.6",
      );
    }

    // Timeline entries — stagger slide-in from right
    if (timelineCards.length) {
      tl.fromTo(
        timelineCards,
        { x: 60, opacity: 0, scale: 0.95 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power4.out",
        },
        "-=0.7",
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
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">
          {/* Left — intro (sticky on desktop) */}
          <div className="lg:w-95 shrink-0 lg:sticky lg:top-8 lg:self-start">
            <p
              data-pl-label
              className="text-primary text-sm font-medium tracking-wide uppercase mb-2"
            >
              Property Logbook
            </p>
            <h2
              data-pl-heading
              className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3rem] leading-[1.1] font-bold text-primary-dark tracking-tight"
            >
              Every Repair. <span className="text-primary">Every Record.</span>
            </h2>
            <p
              data-pl-desc
              className="text-text-secondary text-sm leading-relaxed mt-4"
            >
              Every property on PropertyLoop gets a permanent digital logbook.
              All maintenance, repairs, and services are recorded with verified
              vendor details — building trust and transparency for buyers,
              tenants, and owners.
            </p>

            {/* Sample property card */}
            <div
              data-pl-propcard
              className="mt-8 relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-5"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Home className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-primary-dark text-[15px]">
                    4-Bed Villa, Lekki Phase 1
                  </h3>
                  <p className="text-text-secondary text-xs">
                    Property ID: PL-00482
                  </p>
                </div>
              </div>
              <div className="h-px bg-border-light my-4" />
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <span>6 service records</span>
                <span>Last updated: Mar 2026</span>
              </div>

              {/* Clipped circle */}
              <div className="w-16 h-16 bg-primary/10 rounded-full absolute -right-3 -top-3">
                <ShieldCheck className="absolute bottom-4 left-4 w-5 h-5 text-primary" />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/logbook/about"
                data-pl-learn
                className="inline-flex h-10 px-6 rounded-full border border-border bg-white/80 backdrop-blur-sm text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
              >
                Learn about logbooks
              </Link>
              {logbookListings.length >= 5 && (
                <Link
                  to="/logbook"
                  className="inline-flex h-10 px-6 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25"
                >
                  View more
                </Link>
              )}
            </div>
          </div>

          {/* Right — timeline */}
          <div className="flex-1 relative">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-pulse">
                  <ShieldCheck className="w-8 h-8 text-primary/50" />
                </div>
                <p className="text-text-secondary text-sm">Loading logbooks...</p>
              </div>
            ) : logbookListings.length > 0 ? (
              <>
                <div
                  data-pl-line
                  className="absolute left-8 top-0 bottom-0 w-1 bg-linear-to-b from-primary to-primary/20 rounded-full"
                />
                <div className="space-y-6 pl-20">
                  {logbookListings.map((property) => (
                    <div
                      key={property.id}
                      data-pl-entry
                      className="relative"
                    >
                      {/* Timeline dot */}
                      <div className="absolute -left-14 top-1.5 w-6 h-6 rounded-full bg-primary border-4 border-white shadow-lg flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>

                      {/* Card */}
                      <div className="bg-white/80 backdrop-blur-sm border border-border-light rounded-2xl p-4 hover:shadow-[0_8px_24px_rgba(31,111,67,0.15)] transition-shadow">
                        <div className="flex items-start gap-3 mb-3">
                          <img
                            src={property.coverImage || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&h=100&fit=crop"}
                            alt={property.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-heading font-bold text-primary-dark text-sm truncate">
                              {property.title}
                            </h4>
                            <p className="text-text-secondary text-xs">
                              {property.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-text-secondary mb-2">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {property.status === "SOLD" ? "Sold" : "Rented"} • {new Date(property.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-primary-dark">
                            {property.beds} bed{property.beds !== 1 ? "s" : ""} • {property.baths} bath{property.baths !== 1 ? "s" : ""}
                          </span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            property.status === "SOLD"
                              ? "bg-green-50 text-green-600"
                              : "bg-blue-50 text-blue-600"
                          }`}>
                            {property.status === "SOLD" ? "Sold" : "Rented"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-8 h-8 text-primary/50" />
                </div>
                <h3 className="font-heading font-bold text-primary-dark text-lg">
                  Property Logbooks Coming Soon
                </h3>
                <p className="text-text-secondary text-sm mt-2 max-w-sm">
                  Mark properties as sold or rented to see them in the logbook. Currently showing properties from your listings.
                </p>
                <p className="text-text-subtle text-xs mt-4 max-w-sm">
                  Tip: To test, mark a listing as SOLD or RENTED from your agent dashboard.
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
