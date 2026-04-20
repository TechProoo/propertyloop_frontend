import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Bed,
  Bath,
  Maximize,
  Play,
  X,
  Search,
  Eye,
  Star,
  MapPin,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import listingsService from "../api/services/listings";
import type { Listing } from "../api/types";

const VideoTours = () => {
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const loadVideoListings = async () => {
      try {
        const result = await listingsService.list({ limit: 100 });
        const videosOnly = result.items.filter((l) => l.videoUrl);
        setListings(videosOnly);
      } catch (error) {
        console.error("Failed to load video listings:", error);
        setListings([]);
      }
    };
    loadVideoListings();
  }, []);

  const filtered = listings.filter((v) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      v.title.toLowerCase().includes(q) ||
      v.location.toLowerCase().includes(q) ||
      v.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />

      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-8">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">Video Tours</span>
          </div>

          {/* ─── Hero ─── */}
          <div className="relative overflow-hidden rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] mb-10">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1400&h=600&fit=crop)",
              }}
            />
            <div className="absolute inset-0 bg-linear-to-r from-primary-dark/90 via-primary-dark/75 to-primary-dark/40" />
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5" />

            <div className="relative z-10 p-8 sm:p-10 lg:p-14">
              <h1 className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3.5rem] leading-[1.1] font-bold text-white tracking-tight">
                Video <span className="text-white/70">Tours</span>
              </h1>
              <p className="text-white/60 text-sm leading-relaxed mt-3 max-w-xl">
                Walk through properties from anywhere. Watch video tours filmed
                by verified agents before you visit in person.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                {[
                  { value: String(filtered.length), label: "Video Tours" },
                  { value: "4K", label: "Quality" },
                  { value: "Verified", label: "Agents" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-sm"
                  >
                    <span className="font-heading font-bold text-white">
                      {s.value}
                    </span>
                    <span className="text-white/50">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Search */}
              <div className="mt-8 bg-white/10 backdrop-blur-md border border-white/15 rounded-[18px] p-3 flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by property name or location..."
                    className="w-full h-12 pl-11 pr-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
                <button className="shrink-0 h-12 px-8 rounded-full bg-white text-primary-dark text-sm font-bold hover:bg-white/90 transition-colors duration-300 inline-flex items-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
            <p className="text-text-secondary text-sm">
              Showing{" "}
              <span className="font-bold text-primary-dark">
                {filtered.length}
              </span>{" "}
              video tours
            </p>
            <select className="h-9 px-4 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-xs focus:outline-none focus:border-primary transition-colors appearance-none pr-8">
              <option>Most viewed</option>
              <option>Newest first</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          {/* ─── Video Grid ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-20">
            {filtered.map((tour, i) => (
              <div
                key={tour.id}
                className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Video / Thumbnail */}
                <div className="relative h-56 sm:h-64 overflow-hidden rounded-t-[20px] bg-black">
                  {playingIdx === i && tour.videoUrl ? (
                    <>
                      {tour.videoUrl.includes("youtu") || tour.videoUrl.includes("vimeo") ? (
                        <iframe
                          src={`${tour.videoUrl}?autoplay=1`}
                          title={tour.title}
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      ) : (
                        <video
                          src={tour.videoUrl}
                          autoPlay
                          controls
                          className="w-full h-full"
                        />
                      )}
                      <button
                        onClick={() => setPlayingIdx(null)}
                        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <img
                        src={tour.coverImage}
                        alt={tour.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

                      {/* Play button */}
                      <button
                        onClick={() => setPlayingIdx(i)}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:bg-white hover:scale-110 transition-all duration-300">
                          <Play className="w-7 h-7 text-primary-dark fill-primary-dark ml-0.5" />
                        </div>
                      </button>

                      {/* Views */}
                      <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                        <Eye className="w-3 h-3" />
                        {(tour.viewsCount / 1000).toFixed(1)}k views
                      </span>

                      {/* Rating */}
                      <span className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-primary-dark text-xs font-medium">
                        <Star className="w-3 h-3 text-[#F5A623] fill-[#F5A623]" />
                        {tour.rating}
                      </span>
                    </>
                  )}
                </div>

                {/* Glass content */}
                <Link
                  to={`/video-tour/${tour.id}`}
                  className="mx-3 mb-3 -mt-6 relative z-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl px-5 pt-4 pb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)] block"
                >
                  <p className="font-heading font-bold text-primary-dark text-[18px]">
                    {tour.priceLabel}
                  </p>
                  <h3 className="font-heading font-bold text-primary-dark text-[15px] leading-snug mt-1 truncate">
                    {tour.title}
                  </h3>
                  <p className="text-text-secondary text-xs mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {tour.address}
                  </p>

                  <div className="h-px bg-border-light mt-3 mb-3" />

                  <div className="flex items-center gap-4 text-text-secondary text-xs pr-10">
                    <span className="flex items-center gap-1.5">
                      <Bed className="w-3.5 h-3.5" />
                      {tour.beds} Beds
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Bath className="w-3.5 h-3.5" />
                      {tour.baths} Baths
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Maximize className="w-3.5 h-3.5" />
                      {tour.sqft}m²
                    </span>
                  </div>
                </Link>

                {/* Arrow */}
                <Link
                  to={`/video-tour/${tour.id}`}
                  className="w-12 h-12 bg-[#1a1a1a] rounded-full absolute -right-3 -bottom-3 z-20 group-hover:bg-primary transition-colors duration-300 flex items-center justify-center"
                >
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VideoTours;
