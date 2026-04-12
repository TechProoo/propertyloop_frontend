import { useState } from "react";
import { ArrowUpRight, Bed, Bath, Maximize, Play, X } from "lucide-react";
import { videoListings } from "../../data/videos";

const VideoListings = () => {
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);

  return (
    <section className="w-full px-6 md:px-12 lg:px-20 py-20 lg:py-28 bg-bg">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
              Video <span className="text-primary">Tours</span>
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mt-3 max-w-lg">
              Walk through properties from anywhere. Watch video tours filmed by
              verified agents before you visit in person.
            </p>
          </div>
          <a
            href="/video-tours"
            className="shrink-0 h-10 px-6 rounded-full border border-border bg-white/80 backdrop-blur-sm text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 inline-flex items-center"
          >
            View all
          </a>
        </div>

        {/* Cards grid — 3 per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videoListings.slice(0, 3).map((home, i) => (
            <div
              key={i}
              className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              {/* Video / Thumbnail area */}
              <div className="relative h-52 overflow-hidden rounded-t-[20px] bg-black">
                {playingIdx === i ? (
                  <>
                    <iframe
                      src={`${home.video}?autoplay=1`}
                      title={home.title}
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      className="w-full h-full"
                    />
                    {/* Close button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlayingIdx(null);
                      }}
                      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <img
                      src={home.thumbnail}
                      alt={home.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

                    {/* Play button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlayingIdx(i);
                      }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:bg-white hover:scale-110 transition-all duration-300">
                        <Play className="w-6 h-6 text-primary-dark fill-primary-dark ml-0.5" />
                      </div>
                    </button>

                    {/* Duration badge */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                      {home.duration}
                    </span>
                  </>
                )}
              </div>

              {/* Content — glass morphism panel */}
              <a
                href={`/video-tour/${home.id}`}
                className="mx-3 mb-3 -mt-6 relative z-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl px-5 pt-4 pb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)] block"
              >
                {/* Price */}
                <p className="font-heading font-bold text-primary-dark text-[18px]">
                  {home.price}
                </p>

                {/* Title */}
                <h3 className="font-heading font-bold text-primary-dark text-[15px] leading-snug mt-1.5 truncate">
                  {home.title}
                </h3>

                {/* Address */}
                <p className="text-text-secondary text-xs mt-1">
                  {home.address}
                </p>

                {/* Divider */}
                <div className="h-px bg-border-light mt-4 mb-3" />

                {/* Stats row */}
                <div className="flex items-center gap-4 text-text-secondary text-xs pr-10">
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
              </a>

              {/* Arrow — clipped circle at bottom-right corner */}
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-full absolute -right-3 -bottom-3 z-20 group-hover:bg-primary transition-colors duration-300 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoListings;
