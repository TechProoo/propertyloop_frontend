import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Home,
  UserCheck,
  Shield,
  MapPin,
  Smartphone,
  X,
  Bell,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: <Home className="w-4 h-4" />, value: "20,000+", label: "Listings" },
  {
    icon: <UserCheck className="w-4 h-4" />,
    value: "1,200+",
    label: "Verified Agents",
  },
  {
    icon: <Shield className="w-4 h-4" />,
    value: "8,500+",
    label: "Escrow Jobs",
  },
  {
    icon: <MapPin className="w-4 h-4" />,
    value: "5",
    label: "Cities",
  },
];

const CtaBanner = () => {
  const [showModal, setShowModal] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const label = el.querySelector("[data-cb-label]");
    const heading = el.querySelector("[data-cb-heading]");
    const desc = el.querySelector("[data-cb-desc]");
    const btns = el.querySelectorAll("[data-cb-btn]");
    const phone = el.querySelector("[data-cb-phone]");
    const statCards = el.querySelectorAll("[data-cb-stat]");

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: el, start: "top 75%", once: true },
    });

    if (label)
      tl.fromTo(
        label,
        { y: -15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
      );

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

    if (desc)
      tl.fromTo(
        desc,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.4",
      );

    if (btns.length) {
      tl.fromTo(
        btns,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.12,
          ease: "back.out(1.6)",
        },
        "-=0.2",
      );
    }

    if (phone) {
      tl.fromTo(
        phone,
        { x: 80, opacity: 0, rotateY: -12 },
        { x: 0, opacity: 1, rotateY: 0, duration: 1, ease: "power4.out" },
        "-=0.6",
      );
    }

    if (statCards.length) {
      tl.fromTo(
        statCards,
        { y: 40, opacity: 0, scale: 0.92 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power4.out",
        },
        "-=0.3",
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
        {/* Outer glass card */}
        <div className="relative overflow-hidden bg-white/60 backdrop-blur-sm border border-border-light rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-3">
          {/* Inner content card */}
          <div className="relative overflow-hidden bg-white/80 backdrop-blur-md border border-white/40 rounded-[22px] shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
            {/* Decorative circles */}
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary/5" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-primary/5" />

            <div className="relative z-10 px-5 sm:px-10 lg:px-16 py-10 sm:py-14 lg:py-20">
              {/* Top — content */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-10 sm:gap-12 lg:gap-20">
                {/* Left text */}
                <div className="flex-1">
                  <p
                    data-cb-label
                    className="text-primary text-sm font-medium tracking-wide uppercase mb-3"
                  >
                    Get Started Today
                  </p>
                  <h2
                    data-cb-heading
                    className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3rem] leading-[1.1] font-bold text-primary-dark tracking-tight"
                  >
                    Find your next home.
                    <br />
                    <span className="text-primary">Close the loop.</span>
                  </h2>
                  <p
                    data-cb-desc
                    className="text-text-secondary text-sm leading-relaxed mt-5 max-w-md"
                  >
                    From first search to signed contract — and everything after
                    the keys are handed over. Download the app or sign up to get
                    started.
                  </p>

                  {/* CTA buttons */}
                  <div className="flex flex-wrap gap-4 mt-8">
                    <a
                      data-cb-btn
                      href="/onboarding"
                      className="h-12 px-8 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors duration-300 inline-flex items-center gap-2 shadow-[0_4px_16px_rgba(31,111,67,0.3)]"
                    >
                      Sign up free
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    <button
                      data-cb-btn
                      onClick={() => setShowModal(true)}
                      className="h-12 px-8 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark font-medium text-sm hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 inline-flex items-center gap-2"
                    >
                      <Smartphone className="w-4 h-4" />
                      Download app
                    </button>
                  </div>
                </div>

                {/* Right — phone mockup */}
                <div
                  data-cb-phone
                  className="shrink-0 hidden lg:flex items-center justify-center"
                >
                  <div className="relative w-55 h-95 bg-white/70 backdrop-blur-md border border-border-light rounded-[36px] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
                    <div className="w-full h-full rounded-[28px] bg-bg-accent border border-border-light flex flex-col items-center justify-center gap-4">
                      {/* Notch */}
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-white rounded-full border border-border-light" />
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <Home className="w-7 h-7 text-primary" />
                      </div>
                      <div className="text-center px-4">
                        <p className="font-heading font-bold text-primary-dark text-sm">
                          PropertyLoop
                        </p>
                        <p className="text-text-subtle text-xs mt-1">
                          Coming soon on
                          <br />
                          iOS & Android
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom — stats row */}
              <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-border-light">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
                  {stats.map((stat, i) => (
                    <div
                      key={i}
                      data-cb-stat
                      className="bg-white/60 backdrop-blur-sm border border-border-light rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] min-w-0"
                    >
                      <div className="flex items-start gap-1.5 sm:gap-2 text-text-secondary mb-1.5 sm:mb-2">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full  bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          {stat.icon}
                        </div>
                        <span className="text-[11px] sm:text-xs leading-tight text-nowrap">
                          {stat.label}
                        </span>
                      </div>
                      <p className="font-heading font-bold text-primary-dark text-[1.5rem] sm:text-xl leading-none">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={() => setShowModal(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

          {/* Modal card */}
          <div
            className="relative w-full max-w-sm overflow-hidden bg-white/85 backdrop-blur-md border border-border-light rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-bg flex items-center justify-center text-text-subtle hover:bg-border-light hover:text-primary-dark transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="flex flex-col items-center text-center">
              {/* Phone icon */}
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                <Smartphone className="w-8 h-8 text-primary" />
              </div>

              <h3 className="font-heading font-bold text-primary-dark text-xl">
                Coming Soon
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed mt-2 max-w-xs">
                The PropertyLoop mobile app is currently in development. Leave
                your email to get notified when it launches on iOS and Android.
              </p>

              {/* Email input */}
              <div className="w-full mt-6 flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 h-11 px-4 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                />
                <button className="shrink-0 h-11 px-5 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors duration-300 inline-flex items-center gap-1.5">
                  <Bell className="w-4 h-4" />
                  Notify me
                </button>
              </div>

              {/* Store badges placeholder */}
              <div className="flex gap-3 mt-6">
                <div className="h-10 px-4 rounded-xl bg-bg border border-border-light flex items-center gap-2 text-text-secondary text-xs">
                  <Smartphone className="w-4 h-4" />
                  iOS
                </div>
                <div className="h-10 px-4 rounded-xl bg-bg border border-border-light flex items-center gap-2 text-text-secondary text-xs">
                  <Smartphone className="w-4 h-4" />
                  Android
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CtaBanner;
