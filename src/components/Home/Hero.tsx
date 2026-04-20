import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ImageGallery } from "@/components/ui/carousel-circular-image-gallery";
import type { ImageGalleryHandle } from "@/components/ui/carousel-circular-image-gallery";
import gsap from "gsap";

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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Buy");
  const [activeSlide, setActiveSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const galleryRef = useRef<ImageGalleryHandle>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const handleSlideChange = useCallback((index: number) => {
    setActiveSlide(index);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // ─── GSAP cinematic entrance ───────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const decorBg = section.querySelector("[data-hero-decor]");
    const galleryBox = section.querySelector("[data-hero-gallery]");
    const headingLines = section.querySelectorAll("[data-hero-heading]");
    const searchBox = section.querySelector("[data-hero-search]");
    const quote = section.querySelector("[data-hero-quote]");
    const propCard = section.querySelector("[data-hero-card]");
    const mobileHeading = section.querySelector("[data-hero-mobile-heading]");
    const mobileSearch = section.querySelector("[data-hero-mobile-search]");
    const mobileGallery = section.querySelector("[data-hero-mobile-gallery]");
    const mobileCard = section.querySelector("[data-hero-mobile-card]");

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      delay: 0.3,
    });

    // Decorative shape — cinematic scale-in from center
    if (decorBg) {
      tl.fromTo(
        decorBg,
        { scaleX: 0, opacity: 0, transformOrigin: "center top" },
        { scaleX: 1, opacity: 1, duration: 1.0, ease: "power4.out" },
      );
    }

    // Heading lines — clip-path wipe reveal + stagger
    if (headingLines.length) {
      tl.fromTo(
        headingLines,
        { clipPath: "inset(0 100% 0 0)", opacity: 0, x: -30 },
        {
          clipPath: "inset(0 0% 0 0)",
          opacity: 1,
          x: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power4.out",
        },
        "-=0.5",
      );
    }

    // Search box — slides up with bounce
    if (searchBox) {
      tl.fromTo(
        searchBox,
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.2)" },
        "-=0.4",
      );
    }

    // Gallery — cinematic scale from far with rotation
    if (galleryBox) {
      tl.fromTo(
        galleryBox,
        { scale: 1.15, opacity: 0, x: 80 },
        { scale: 1, opacity: 1, x: 0, duration: 1.2, ease: "power3.out" },
        "-=0.9",
      );
    }

    // Quote — fade up
    if (quote) {
      tl.fromTo(
        quote,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
        "-=0.4",
      );
    }

    // Property card — slides up from below viewport
    if (propCard) {
      tl.fromTo(
        propCard,
        { y: 60, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.3)" },
        "-=0.5",
      );
    }

    // ─── Mobile animations ───────────────────────────────────────────
    if (mobileHeading) {
      tl.fromTo(
        mobileHeading,
        { clipPath: "inset(0 100% 0 0)", opacity: 0 },
        {
          clipPath: "inset(0 0% 0 0)",
          opacity: 1,
          duration: 0.8,
          ease: "power4.out",
        },
        0.3,
      );
    }
    if (mobileSearch) {
      tl.fromTo(
        mobileSearch,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "back.out(1.2)" },
        "-=0.3",
      );
    }
    if (mobileGallery) {
      tl.fromTo(
        mobileGallery,
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.9, ease: "power3.out" },
        "-=0.4",
      );
    }
    if (mobileCard) {
      tl.fromTo(
        mobileCard,
        { y: 40, opacity: 0, scale: 0.92 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.3)" },
        "-=0.3",
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  const current = properties[activeSlide];

  return (
    <section
      ref={sectionRef}
      className="relative w-full lg:h-[calc(100vh-64px)] overflow-hidden"
    >
      {/* Decorative shape — upper area, green-tinted glass */}
      <div
        data-hero-decor
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
        data-hero-gallery
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

      {/* ─── MOBILE LAYOUT (stacked, not absolute) ─── */}
      <div className="lg:hidden flex flex-col px-5 sm:px-8 pt-4 pb-6">
        {/* Heading */}
        <h1
          data-hero-mobile-heading
          className="font-heading text-[1.7rem] sm:text-[2.4rem] leading-[1.1] font-bold text-primary-dark tracking-tight"
        >
          Find your home, <br />
          <span className="text-primary">close the deal,</span>
          <br />
          <span className="italic font-normal text-primary-dark">
            manage it all
          </span>
        </h1>

        {/* Search Box */}
        <form
          onSubmit={handleSearch}
          data-hero-mobile-search
          className="flex flex-col gap-2.5 mt-5 sm:max-w-[320px]"
        >
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-xs font-medium rounded-full border transition-all ${
                  activeTab === tab
                    ? "backdrop-blur-md bg-white/70 text-primary-dark border-white/50 shadow-sm"
                    : "backdrop-blur-sm bg-white/30 text-text-secondary border-white/30"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center backdrop-blur-xl bg-white/40 rounded-full border border-white/50 shadow-[0_8px_32px_rgba(31,111,67,0.12)] pl-4 pr-1.5 py-1 ring-1 ring-white/20">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by location, LGA, or keyword"
              className="flex-1 text-sm text-primary-dark placeholder-text-subtle outline-none bg-transparent py-2"
            />
            <button
              type="submit"
              className="w-9 h-9 bg-primary hover:bg-primary-dark rounded-full flex items-center justify-center transition-colors shrink-0 shadow-lg shadow-glow/40"
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
                  strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </form>

        {/* Mobile gallery */}
        <div
          data-hero-mobile-gallery
          className="mt-5 rounded-2xl overflow-hidden h-[45vh] sm:h-[50vh]"
        >
          <ImageGallery
            images={galleryImages}
            autoplayInterval={4500}
            className="w-full h-full"
            onSlideChange={handleSlideChange}
          />
        </div>

        {/* Mobile property card */}
        <div
          data-hero-mobile-card
          className="mt-4 backdrop-blur-xl bg-white/65 rounded-xl shadow-lg shadow-glow/10 border border-white/40 px-4 py-3 flex items-center justify-between"
        >
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-bold text-primary-dark text-[13px] truncate">
              {current.title}
            </h3>
            <p className="text-text-secondary text-[11px] mt-0.5 truncate">
              {current.description.split("\n")[0]}
            </p>
          </div>
          <div className="ml-3 shrink-0 border border-primary-dark rounded-full px-3 py-1 text-[11px] font-semibold text-primary-dark">
            {current.price}
          </div>
        </div>
      </div>

      {/* ─── DESKTOP LAYOUT (absolute positioned, original) ─── */}
      <div className="relative z-10 h-full hidden lg:flex flex-col justify-between px-6 md:px-12 lg:px-20 pb-8 pt-8 pointer-events-none">
        {/* Top content */}
        <div className="pointer-events-auto mt-16">
          {/* Heading */}
          <h1 className="font-heading text-[3.2rem] xl:text-[3.8rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
            <span data-hero-heading className="block">
              Find your home,
            </span>
            <span data-hero-heading className="block text-primary">
              close the deal,
            </span>
            <span
              data-hero-heading
              className="block italic font-normal text-primary-dark"
            >
              manage it all
            </span>
          </h1>

          {/* Search Box — glassmorphism */}
          <form
            onSubmit={handleSearch}
            data-hero-search
            className="flex flex-col gap-3 max-w-[320px] mt-10"
          >
            {/* Pill Tabs — glass */}
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by location, LGA, or keyword"
                className="flex-1 text-sm text-primary-dark placeholder-text-subtle outline-none bg-transparent py-2"
              />
              <button
                type="submit"
                className="w-9 h-9 bg-primary hover:bg-primary-dark rounded-full flex items-center justify-center transition-colors shrink-0 shadow-lg shadow-glow/40"
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
                    strokeWidth={2.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* Bottom row — quote left, property card right */}
        <div className="flex items-end justify-between gap-6 pointer-events-auto">
          {/* Quote */}
          <div data-hero-quote className="max-w-60 relative">
            <span className="text-primary/15 text-6xl font-heading leading-none absolute -top-7 -left-3 select-none">
              &ldquo;
            </span>
            <p className="text-text-secondary text-[13px] leading-relaxed italic pl-3 pt-3">
              "From first search to signed contract — and everything that
              happens after the keys are handed over."
            </p>
          </div>

          {/* Property Card — synced with gallery */}
          <div
            data-hero-card
            className="flex backdrop-blur-xl bg-white/65 rounded-2xl shadow-lg shadow-glow/10 border border-white/40 px-5 py-4 items-center gap-4 ml-auto max-w-95"
          >
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
