import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useListings } from "../api/hooks";
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  Star,
  Search,
  LayoutGrid,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import BookmarkButton from "../components/ui/BookmarkButton";
import EmptyState from "../components/ui/EmptyState";

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const [heroQuery, setHeroQuery] = useState(searchQuery);

  const { items: listings, loading, page, pages, nextPage } = useListings({
    search: searchQuery,
    limit: 20,
  });

  const currentListings = listings.map((l) => ({
    id: l.id,
    image: l.coverImage,
    price: l.priceLabel,
    title: l.title,
    address: l.address,
    beds: l.beds,
    baths: l.baths,
    sqft: l.sqft,
    rating: l.rating,
    type: l.type,
    agent: l.agent?.name || "Agent",
  }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(heroQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />

      <main className="w-full px-6 md:px-12 lg:px-20 pt-8 pb-16 flex-1">
        <div className="max-w-7xl mx-auto">
          {/* Search Header */}
          <div className="mb-12">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-dark mb-4">
              Search Results
            </h1>
            <p className="text-text-secondary mb-6">
              {searchQuery && (
                <>
                  Showing results for "<span className="font-medium text-primary-dark">{searchQuery}</span>"
                </>
              )}
            </p>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-border-light rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.06)] pl-6 pr-1.5 py-1.5"
            >
              <input
                type="text"
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                placeholder="Search by location, LGA, or keyword..."
                className="flex-1 text-sm text-primary-dark placeholder-text-subtle outline-none bg-transparent"
              />
              <button
                type="submit"
                className="w-10 h-10 bg-primary hover:bg-primary-dark rounded-full flex items-center justify-center transition-colors shrink-0"
              >
                <Search className="w-5 h-5 text-white" />
              </button>
            </form>
          </div>

          {/* Results Count */}
          {!loading && (
            <p className="text-text-secondary text-sm mb-6">
              Found <span className="font-bold text-primary-dark">{listings.length}</span> properties
            </p>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-border-light/60" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-border-light/60 rounded-full w-1/3" />
                    <div className="h-4 bg-border-light/60 rounded-full w-2/3" />
                    <div className="h-3 bg-border-light/60 rounded-full w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results Grid */}
          {!loading && currentListings.length > 0 && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {currentListings.map((listing, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/property/${listing.id}`)}
                  >
                    {/* Image */}
                    <div className="h-48 overflow-hidden rounded-t-[20px] relative">
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-primary-dark">
                        <Star className="w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]" />
                        {listing.rating}
                      </span>
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        <BookmarkButton
                          id={listing.id}
                          type="property"
                          size="sm"
                        />
                        <span
                          className={`px-2.5 py-1 rounded-full backdrop-blur-sm text-white text-xs font-medium ${
                            listing.type === "SALE"
                              ? "bg-primary/90"
                              : "bg-blue-500/90"
                          }`}
                        >
                          {listing.type === "SALE" ? "For Sale" : "For Rent"}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mx-3 mb-3 -mt-6 relative z-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl px-5 pt-4 pb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                      <p className="font-heading font-bold text-primary-dark text-lg">
                        {listing.price}
                      </p>
                      <h3 className="font-heading font-bold text-primary-dark text-sm leading-snug mt-1 truncate">
                        {listing.title}
                      </h3>
                      <p className="text-text-secondary text-xs mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {listing.address}
                      </p>

                      <div className="h-px bg-border-light mt-3 mb-3" />

                      <div className="flex items-center gap-4 text-text-secondary text-xs">
                        {listing.beds > 0 && (
                          <span className="flex items-center gap-1.5">
                            <Bed className="w-3.5 h-3.5" />
                            {listing.beds}
                          </span>
                        )}
                        {listing.baths > 0 && (
                          <span className="flex items-center gap-1.5">
                            <Bath className="w-3.5 h-3.5" />
                            {listing.baths}
                          </span>
                        )}
                        {listing.sqft && (
                          <span className="flex items-center gap-1.5">
                            <Maximize className="w-3.5 h-3.5" />
                            {listing.sqft}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Load More Button */}
              {!!page && !!pages && page < pages && (
                <div className="mt-12 text-center">
                  <button
                    onClick={nextPage}
                    disabled={loading}
                    className="h-11 px-8 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Loading..." : "Load more results"}
                  </button>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && currentListings.length === 0 && (
            <EmptyState
              icon={<Search className="w-10 h-10" />}
              title="No Properties Found"
              description={
                searchQuery
                  ? `No properties match "${searchQuery}". Try adjusting your search terms.`
                  : "Enter a search query to find properties."
              }
              actions={[
                {
                  label: "Browse All Properties",
                  icon: <LayoutGrid className="w-4 h-4" />,
                  onClick: () => navigate("/buy"),
                  variant: "primary",
                },
              ]}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;
