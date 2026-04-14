import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, X, Star, Quote } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Adaeze Okafor",
    role: "Home Buyer, Lagos",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&h=120&fit=crop&crop=face",
    quote:
      "PropertyLoop made buying my first home stress-free. The escrow system gave me total confidence — I knew my money was safe until the deal was sealed.",
    rating: 5,
    videoId: "dQw4w9WgXcQ",
    thumbnail:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=640&h=360&fit=crop",
  },
  {
    name: "Chinedu Eze",
    role: "Property Investor, Abuja",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
    quote:
      "I've used many platforms but nothing compares. The verified agents, video tours, and the logbook feature are game-changers for serious investors.",
    rating: 5,
    videoId: "dQw4w9WgXcQ",
    thumbnail:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=640&h=360&fit=crop",
  },
  {
    name: "Funke Adeyemi",
    role: "Vendor (Plumber), Lagos",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
    quote:
      "Since joining PropertyLoop, my bookings have tripled. The escrow system means I always get paid for completed work. It's transformed my business.",
    rating: 5,
    videoId: "dQw4w9WgXcQ",
    thumbnail:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=640&h=360&fit=crop",
  },
];

const VideoTestimonials = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const label = el.querySelector("[data-vt-label]");
    const heading = el.querySelector("[data-vt-heading]");
    const subtitle = el.querySelector("[data-vt-subtitle]");
    const cards = el.querySelectorAll("[data-vt-card]");

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: el, start: "top 75%", once: true },
    });

    // Label
    if (label) {
      tl.fromTo(label, { y: -15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
    }

    // Heading — clip-path wipe
    if (heading) {
      tl.fromTo(
        heading,
        { clipPath: "inset(0 100% 0 0)", opacity: 0 },
        { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 0.9, ease: "power4.out" },
        "-=0.2",
      );
    }

    // Subtitle
    if (subtitle) {
      tl.fromTo(subtitle, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.4");
    }

    // Testimonial cards — stagger rise with rotation
    if (cards.length) {
      tl.fromTo(
        cards,
        { y: 70, opacity: 0, rotateY: -6, scale: 0.93 },
        {
          y: 0,
          opacity: 1,
          rotateY: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.18,
          ease: "power4.out",
        },
        "-=0.2",
      );
    }

    return () => { tl.kill(); };
  }, []);

  return (
    <section ref={sectionRef} className="w-full px-6 md:px-12 lg:px-20 py-20 lg:py-28 bg-bg">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <p data-vt-label className="text-primary text-sm font-medium tracking-wide uppercase mb-3">
            Testimonials
          </p>
          <h2 data-vt-heading className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
            Hear from <span className="text-primary">real people</span>
          </h2>
          <p data-vt-subtitle className="text-text-secondary text-sm leading-relaxed mt-4 max-w-lg mx-auto">
            Thousands of buyers, agents, and vendors trust PropertyLoop every
            day. Here's what they have to say.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              data-vt-card
              className="group bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300"
            >
              {/* Video thumbnail */}
              <div
                className="relative aspect-video cursor-pointer overflow-hidden"
                onClick={() => setActiveVideo(t.videoId)}
              >
                <img
                  src={t.thumbnail}
                  alt={`${t.name} testimonial`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-5 h-5 text-primary ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Quote */}
                <div className="relative">
                  <Quote className="w-6 h-6 text-primary/20 absolute -top-1 -left-1" />
                  <p className="text-text-secondary text-[13px] leading-relaxed pl-6">
                    {t.quote}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex gap-0.5 mt-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]"
                    />
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border-light">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <p className="font-heading font-bold text-primary-dark text-sm">
                      {t.name}
                    </p>
                    <p className="text-text-subtle text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-3xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`}
              title="Video testimonial"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full"
            />
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default VideoTestimonials;
