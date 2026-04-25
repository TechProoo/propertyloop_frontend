import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bed,
  Bath,
  MapPin,
  ShieldCheck,
  Clock,
  Filter,
  Info,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import listingsService from "../api/services/listings";
import type { Listing } from "../api/types";

type StatusFilter = "ALL" | "SOLD" | "RENTED";

const LogbookList = () => {
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("ALL");

  useEffect(() => {
    let active = true;
    setLoading(true);
    const fetchByStatus = async () => {
      try {
        if (filter === "SOLD" || filter === "RENTED") {
          const res = await listingsService.list({
            status: filter,
            limit: 60,
            sort: "newest",
          });
          if (active) setItems(res.items || []);
          return;
        }
        // ALL — fetch sold + rented and merge
        const [sold, rented] = await Promise.all([
          listingsService
            .list({ status: "SOLD", limit: 60, sort: "newest" })
            .catch(() => ({ items: [] as Listing[] })),
          listingsService
            .list({ status: "RENTED", limit: 60, sort: "newest" })
            .catch(() => ({ items: [] as Listing[] })),
        ]);
        const merged = [...sold.items, ...rented.items].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        if (active) setItems(merged);
      } catch {
        if (active) setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchByStatus();
    return () => {
      active = false;
    };
  }, [filter]);

  const soldCount = items.filter((p) => p.status === "SOLD").length;
  const rentedCount = items.filter((p) => p.status === "RENTED").length;

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="w-full px-4 sm:px-6 md:px-12 lg:px-20 pt-8 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-text-secondary text-sm hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          {/* Hero */}
          <div className="mb-10">
            <p className="text-primary text-sm font-medium tracking-wide uppercase mb-2">
              Property Logbook
            </p>
            <h1 className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
              Every Repair. <span className="text-primary">Every Record.</span>
            </h1>
            <p className="text-text-secondary text-sm sm:text-base leading-relaxed mt-4 max-w-2xl">
              A permanent digital trail of every property that has been sold
              or rented through PropertyLoop. Browse the verified history.
            </p>
            <Link
              to="/logbook/about"
              className="inline-flex items-center gap-1.5 text-primary text-sm font-medium mt-3 hover:underline"
            >
              <Info className="w-3.5 h-3.5" />
              Learn how logbooks work
            </Link>
          </div>

          {/* Stat strip */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
            <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl px-4 py-4 sm:px-5 sm:py-5">
              <p className="text-text-secondary text-xs">Total entries</p>
              <p className="font-heading font-bold text-primary-dark text-xl sm:text-2xl mt-1">
                {items.length}
              </p>
            </div>
            <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl px-4 py-4 sm:px-5 sm:py-5">
              <p className="text-text-secondary text-xs">Sold</p>
              <p className="font-heading font-bold text-green-700 text-xl sm:text-2xl mt-1">
                {soldCount}
              </p>
            </div>
            <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl px-4 py-4 sm:px-5 sm:py-5">
              <p className="text-text-secondary text-xs">Rented</p>
              <p className="font-heading font-bold text-blue-700 text-xl sm:text-2xl mt-1">
                {rentedCount}
              </p>
            </div>
          </div>

          {/* Filter chips */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-text-subtle shrink-0" />
            {(["ALL", "SOLD", "RENTED"] as StatusFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 h-8 px-4 rounded-full text-xs font-medium border transition-all ${
                  filter === f
                    ? "bg-primary text-white border-primary"
                    : "bg-white/70 text-primary-dark border-border-light hover:border-primary"
                }`}
              >
                {f === "ALL" ? "All" : f === "SOLD" ? "Sold" : "Rented"}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white/60 border border-border-light rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="h-40 bg-border-light/40" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 w-2/3 bg-border-light/60 rounded-full" />
                    <div className="h-3 w-1/2 bg-border-light/60 rounded-full" />
                    <div className="h-3 w-1/3 bg-border-light/60 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white/60 border border-border-light rounded-3xl py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-primary/60" />
              </div>
              <h3 className="font-heading font-bold text-primary-dark text-lg">
                No logbook entries yet
              </h3>
              <p className="text-text-secondary text-sm mt-2 max-w-sm mx-auto">
                Listings move into the logbook after they're marked sold or
                rented. Check back soon — this page updates as deals close.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((p) => (
                <Link
                  key={p.id}
                  to={`/property/${p.id}`}
                  className="group relative bg-white/70 backdrop-blur-sm border border-white/40 rounded-2xl overflow-hidden hover:shadow-[0_8px_24px_rgba(31,111,67,0.15)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="h-44 bg-bg-accent overflow-hidden relative">
                    {p.coverImage ? (
                      <img
                        src={p.coverImage}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : null}
                    <span
                      className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        p.status === "SOLD"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {p.status === "SOLD" ? "Sold" : "Rented"}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-bold text-primary-dark text-sm line-clamp-1">
                      {p.title}
                    </h3>
                    <div className="flex items-center gap-1 text-text-secondary text-xs mt-1">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{p.location}</span>
                    </div>
                    <div className="h-px bg-border-light my-3" />
                    <div className="flex items-center justify-between text-xs text-text-secondary">
                      <span className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5" />
                          {p.beds}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5" />
                          {p.baths}
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(p.createdAt).toLocaleDateString("en-NG", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LogbookList;
