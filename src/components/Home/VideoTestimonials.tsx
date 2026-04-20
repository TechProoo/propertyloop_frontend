import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, Quote } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


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

    // Subtitle
    if (subtitle) {
      tl.fromTo(
        subtitle,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.4",
      );
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
        {/* Heading */}
        <div className="text-center mb-14">
          <p
            data-vt-label
            className="text-primary text-sm font-medium tracking-wide uppercase mb-3"
          >
            Testimonials
          </p>
          <h2
            data-vt-heading
            className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3rem] leading-[1.1] font-bold text-primary-dark tracking-tight"
          >
            Hear from <span className="text-primary">real people</span>
          </h2>
          <p
            data-vt-subtitle
            className="text-text-secondary text-sm leading-relaxed mt-4 max-w-lg mx-auto"
          >
            Thousands of buyers, agents, and vendors trust PropertyLoop every
            day. Here's what they have to say.
          </p>
        </div>

        {/* Testimonials coming soon */}
        <div className="flex flex-col items-center justify-center py-24 text-center rounded-[28px] bg-white/30 border border-border-light">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Quote className="w-8 h-8 text-primary/50" />
          </div>
          <h3 className="font-heading font-bold text-primary-dark text-lg">
            Community Testimonials Coming Soon
          </h3>
          <p className="text-text-secondary text-sm mt-2 max-w-sm">
            Video testimonials from buyers, agents, and vendors will be featured here. Join thousands of happy PropertyLoop users.
          </p>
          <button className="mt-6 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors">
            Share Your Story
          </button>
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
