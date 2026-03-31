import { useState } from "react";
import {
  ArrowUpRight,
  Bed,
  Bath,
  Maximize,
  CalendarDays,
  MapPin,
  Star,
} from "lucide-react";

const shortlets = [
  {
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop",
    price: "₦85,000",
    period: "night",
    title: "Luxury Penthouse with City View",
    address: "Victoria Island, Lagos",
    rating: 4.9,
    beds: 3,
    baths: 2,
    sqft: "2,400",
  },
  {
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
    price: "₦120,000",
    period: "night",
    title: "Beachfront Studio Apartment",
    address: "Lekki Phase 1, Lagos",
    rating: 4.8,
    beds: 1,
    baths: 1,
    sqft: "850",
  },
  {
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop",
    price: "₦65,000",
    period: "night",
    title: "Modern Serviced Flat with Pool",
    address: "Ikoyi, Lagos",
    rating: 4.7,
    beds: 2,
    baths: 2,
    sqft: "1,600",
  },
  {
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
    price: "₦45,000",
    period: "night",
    title: "Cozy One-Bed in Gated Estate",
    address: "Ajah, Lagos",
    rating: 4.6,
    beds: 1,
    baths: 1,
    sqft: "700",
  },
  {
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
    price: "₦150,000",
    period: "night",
    title: "Executive Suite with Concierge",
    address: "Banana Island, Lagos",
    rating: 4.9,
    beds: 2,
    baths: 2,
    sqft: "2,100",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
    price: "₦95,000",
    period: "night",
    title: "Smart Loft with Rooftop Access",
    address: "Gbagada, Lagos",
    rating: 4.8,
    beds: 2,
    baths: 1,
    sqft: "1,200",
  },
];

const ShortletSpotlight = () => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  return (
    <section className="w-full px-6 md:px-12 lg:px-20 py-20 lg:py-28 bg-bg">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-primary text-sm font-medium tracking-wide uppercase mb-2">
              Short-Term Stays
            </p>
            <h2 className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
              Shortlet <span className="text-primary">Spotlight</span>
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mt-3 max-w-lg">
              Book verified short-term apartments by the night. Instant booking,
              transparent pricing, and Paystack-powered payments.
            </p>
          </div>
          <a href="/shortlet" className="shrink-0 h-10 px-6 rounded-full border border-border bg-white/80 backdrop-blur-sm text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 inline-flex items-center">
            View all shortlets
          </a>
        </div>

        {/* Date picker bar */}
        <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] px-6 py-4 mb-10 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2 text-primary">
            <CalendarDays className="w-5 h-5" />
            <span className="font-heading font-bold text-primary-dark text-sm">
              Pick your dates
            </span>
          </div>

          <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full">
              <label className="text-text-subtle text-xs block mb-1">
                Check in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full h-10 px-4 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="text-text-subtle text-xs block mb-1">
                Check out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full h-10 px-4 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="text-text-subtle text-xs block mb-1">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                <select className="w-full h-10 pl-9 pr-4 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors appearance-none">
                  <option>All Lagos</option>
                  <option>Victoria Island</option>
                  <option>Lekki</option>
                  <option>Ikoyi</option>
                  <option>Ajah</option>
                  <option>Banana Island</option>
                </select>
              </div>
            </div>
          </div>

          <button className="shrink-0 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors duration-300">
            Search
          </button>
        </div>

        {/* Shortlet cards — 3 per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {shortlets.map((stay, i) => (
            <div
              key={i}
              className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              {/* Image */}
              <div className="h-48 overflow-hidden rounded-t-[20px] relative">
                <img
                  src={stay.image}
                  alt={stay.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Rating badge */}
                <span className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-primary-dark">
                  <Star className="w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]" />
                  {stay.rating}
                </span>
                {/* Nightly badge */}
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-primary/90 backdrop-blur-sm text-white text-xs font-medium">
                  {stay.price}
                  <span className="font-normal opacity-70">
                    /{stay.period}
                  </span>
                </span>
              </div>

              {/* Glass content panel */}
              <div className="mx-3 mb-3 -mt-6 relative z-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl px-5 pt-4 pb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                {/* Title */}
                <h3 className="font-heading font-bold text-primary-dark text-[15px] leading-snug truncate">
                  {stay.title}
                </h3>

                {/* Address */}
                <p className="text-text-secondary text-xs mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {stay.address}
                </p>

                {/* Divider */}
                <div className="h-px bg-border-light mt-3 mb-3" />

                {/* Stats row */}
                <div className="flex items-center gap-4 text-text-secondary text-xs pr-10">
                  <span className="flex items-center gap-1.5">
                    <Bed className="w-3.5 h-3.5" />
                    {stay.beds} Beds
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Bath className="w-3.5 h-3.5" />
                    {stay.baths} Baths
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Maximize className="w-3.5 h-3.5" />
                    {stay.sqft}m²
                  </span>
                </div>
              </div>

              {/* Arrow — clipped circle bottom-right */}
              <div className="w-20 h-20 bg-[#1a1a1a] rounded-full absolute -right-5 -bottom-5 z-20 group-hover:bg-primary transition-colors duration-300">
                <ArrowUpRight className="absolute top-4 left-5 w-5 h-5 text-white" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShortletSpotlight;
