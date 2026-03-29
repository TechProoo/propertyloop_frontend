import { useState, useRef, useCallback } from "react";
import { ImageGallery } from "@/components/ui/carousel-circular-image-gallery";
import type { ImageGalleryHandle } from "@/components/ui/carousel-circular-image-gallery";

const tabs = ["Buy", "Rent", "Shortlet"] as const;

const properties = [
  {
    title: "Lekki Phase 1 Duplex",
    description:
      "4-bed verified agent listing with\nfull property logbook history.",
    price: "₦185,000,000",
    url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=600&fit=crop",
  },
  {
    title: "Ikoyi Waterfront Villa",
    description: "5-bed luxury home with pool\nand private jetty access.",
    price: "₦450,000,000",
    url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=600&fit=crop",
  },
  {
    title: "Victoria Island Penthouse",
    description: "3-bed penthouse with panoramic\nocean views and smart home.",
    price: "₦320,000,000",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=600&fit=crop",
  },
  {
    title: "Banana Island Mansion",
    description: "6-bed estate with cinema room,\ngym and 24hr power supply.",
    price: "₦1,200,000,000",
    url: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&h=600&fit=crop",
  },
  {
    title: "Ajah Modern Terrace",
    description: "3-bed serviced terrace in\na gated estate with CCTV.",
    price: "₦75,000,000",
    url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=600&fit=crop",
  },
  {
    title: "Gbagada Semi-Detached",
    description: "4-bed semi-detached duplex\nwith BQ and ample parking.",
    price: "₦95,000,000",
    url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=600&fit=crop",
  },
];

const galleryImages = properties.map((p) => ({ title: p.title, url: p.url }));

const Hero = () => {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Buy");
  const [activeSlide, setActiveSlide] = useState(0);
  const galleryRef = useRef<ImageGalleryHandle>(null);

  const handleSlideChange = useCallback((index: number) => {
    setActiveSlide(index);
  }, []);

  const current = properties[activeSlide];

  return (
    <section className="relative w-full h-[calc(100vh-64px)] overflow-hidden">
      {/* Decorative shape — upper area, green-tinted glass */}
      <div
        className="absolute hidden lg:block"
        style={{
          top: 0,
          left: "15%",
          width: "80%",
          height: "55%",
          background: "rgba(31, 111, 67, 0.06)",
          borderRadius: "0 0 50px 50px",
          zIndex: 0,
        }}
      />

      {/* Gallery — right side (desktop) */}
      <div
        className="absolute hidden lg:block"
        style={{
          top: "6%",
          left: "42%",
          right: "2%",
          bottom: "4%",
          zIndex: 2,
        }}
      >
        <ImageGallery
          ref={galleryRef}
          images={galleryImages}
          autoplayInterval={4500}
          className="w-full h-full"
          onSlideChange={handleSlideChange}
          hideNavButtons
        />
      </div>

      {/* Mobile gallery */}
      <div className="absolute inset-x-4 top-[55%] bottom-4 lg:hidden z-2">
        <ImageGallery
          images={galleryImages}
          autoplayInterval={4500}
          className="w-full h-full"
          onSlideChange={handleSlideChange}
        />
      </div>

      {/* Content layer */}
      <div className="relative z-10 h-full flex flex-col justify-between px-6 md:px-12 lg:px-20 pb-8 pt-4 lg:pt-8 pointer-events-none">
        {/* Top content */}
        <div className="pointer-events-auto mt-30">
          {/* Heading */}
          <h1 className="font-heading text-[2.2rem] sm:text-[2.8rem] lg:text-[3.2rem] xl:text-[3.8rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
            Find your home, <br />
            <span className="text-primary">close the deal,</span>
            <br />
            <span className="italic font-normal text-primary-dark">
              manage it all
            </span>
          </h1>

          {/* Search Box — glassmorphism */}
          <div className="flex flex-col gap-3 max-w-[320px] mt-8 lg:mt-10">
            {/* Pill Tabs — glass */}
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-1.5 text-sm font-medium rounded-full border transition-all ${
                    activeTab === tab
                      ? "backdrop-blur-md bg-white/70 text-primary-dark border-white/50 shadow-sm"
                      : "backdrop-blur-sm bg-white/30 text-text-secondary border-white/30 hover:bg-white/50 hover:text-primary-dark"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Input — glass card */}
            <div className="flex items-center backdrop-blur-xl bg-white/40 rounded-full border border-white/50 shadow-[0_8px_32px_rgba(31,111,67,0.12)] pl-4 pr-1.5 py-1 ring-1 ring-white/20">
              <input
                type="text"
                placeholder="Search by location, LGA, or keyword"
                className="flex-1 text-sm text-primary-dark placeholder-text-subtle outline-none bg-transparent py-2"
              />
              <button className="w-9 h-9 bg-primary hover:bg-primary-dark rounded-full flex items-center justify-center transition-colors shrink-0 shadow-lg shadow-glow/40">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row — quote left, property card right */}
        <div className="flex items-end justify-between gap-6 pointer-events-auto">
          {/* Quote */}
          <div className="hidden sm:block max-w-60 relative lg:block">
            <span className="text-primary/15 text-6xl font-heading leading-none absolute -top-7 -left-3 select-none">
              &ldquo;
            </span>
            <p className="text-text-secondary text-[13px] leading-relaxed italic pl-3 pt-3">
              "From first search to signed contract — and everything that
              happens after the keys are handed over."
            </p>
          </div>

          {/* Property Card — synced with gallery */}
          <div className="hidden lg:flex backdrop-blur-xl bg-white/65 rounded-2xl shadow-lg shadow-glow/10 border border-white/40 px-5 py-4 items-center gap-4 ml-auto max-w-95">
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-bold text-primary-dark text-[15px] transition-all duration-300">
                {current.title}
              </h3>
              <p className="text-text-secondary text-xs mt-0.5 leading-relaxed whitespace-pre-line transition-all duration-300">
                {current.description}
              </p>
              <div className="mt-2.5 inline-block border border-primary-dark rounded-full px-4 py-1.5 text-xs font-semibold text-primary-dark transition-all duration-300">
                {current.price}
              </div>
            </div>

            {/* Navigation Arrows — control the gallery */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => galleryRef.current?.prev()}
                className="w-10 h-10 rounded-full border border-white/50 backdrop-blur-sm bg-white/40 flex items-center justify-center hover:bg-white/70 transition-colors"
              >
                <svg
                  className="w-4 h-4 text-primary-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() => galleryRef.current?.next()}
                className="w-10 h-10 rounded-full bg-primary hover:bg-primary-dark flex items-center justify-center transition-colors shadow-lg shadow-glow/40"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
