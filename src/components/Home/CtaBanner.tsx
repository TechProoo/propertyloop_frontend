import { useEffect, useRef } from "react";
import { ArrowRight, Home, UserCheck, Shield, MapPin, Smartphone } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import appStoreBadge from "../../assets/appstore.png";
import playStoreBadge from "../../assets/playstore.png";

gsap.registerPlugin(ScrollTrigger);

export const APP_STORE_URL =
  "https://apps.apple.com/mx/app/propertyloop/id6790199019?l=en-GB";
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=ng.propertyloop.app&pcampaignid=web_share";

/**
 * App screenshots are picked up from src/assets by filename (app_ss1, app_ss2,
 * app_ss3 - any image extension). Resolved at build time, so dropping the files
 * in is all that's needed; while they're absent this is simply empty and the
 * showcase falls back to a plain device frame rather than breaking the build.
 */
const screenshots = Object.entries(
  import.meta.glob<string>("../../assets/app_ss*.{png,jpg,jpeg,webp,avif}", {
    eager: true,
    import: "default",
  }),
)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

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
    label: "Verified Vendors",
  },
  {
    icon: <MapPin className="w-4 h-4" />,
    value: "5",
    label: "Cities",
  },
];

/** A single device frame. `src` omitted renders the branded empty state. */
const PhoneFrame = ({
  src,
  alt,
  className = "",
}: {
  src?: string;
  alt: string;
  className?: string;
}) => (
  <div
    className={`relative rounded-[2rem] bg-white/80 backdrop-blur-md border border-border-light p-2 shadow-[0_12px_40px_rgba(0,0,0,0.14)] ${className}`}
  >
    <div className="relative overflow-hidden rounded-[1.65rem] bg-bg-accent aspect-[9/19.5]">
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Smartphone className="w-7 h-7 text-primary" />
          </div>
          <p className="font-heading font-bold text-primary-dark text-sm">
            PropertyLoop
          </p>
          <p className="text-text-subtle text-xs">Out now on iOS &amp; Android</p>
        </div>
      )}
    </div>
    {/* Notch */}
    <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full bg-white/90 border border-border-light" />
  </div>
);

/** Cycles the available screenshots so 1, 2 or 3 files all lay out sensibly. */
const shotAt = (i: number) =>
  screenshots.length ? screenshots[i % screenshots.length] : undefined;

const StoreBadges = ({ className = "" }: { className?: string }) => (
  <div className={`flex flex-wrap items-center gap-3 ${className}`}>
    <a
      data-cb-btn
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download PropertyLoop on the App Store"
      className="inline-flex rounded-xl transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <img
        src={appStoreBadge}
        alt="Download on the App Store"
        className="h-12 w-auto"
      />
    </a>
    <a
      data-cb-btn
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get PropertyLoop on Google Play"
      className="inline-flex rounded-xl transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <img
        src={playStoreBadge}
        alt="Get it on Google Play"
        className="h-12 w-auto"
      />
    </a>
  </div>
);

const CtaBanner = () => {
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
      className="w-full px-6 md:px-12 lg:px-20 py-10 sm:py-14 lg:py-28 bg-bg"
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
              {/* Top - content */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-10 sm:gap-12 lg:gap-20">
                {/* Left text */}
                <div className="flex-1">
                  <div data-cb-label className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_2px_10px_rgba(31,111,67,0.35)]">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                      </span>
                      Out now
                    </span>
                    <p className="text-primary text-sm font-medium tracking-wide uppercase">
                      On iOS &amp; Android
                    </p>
                  </div>

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
                    From first search to signed contract - and everything after
                    the keys are handed over. The PropertyLoop app has landed:
                    download it free on the App Store or Google Play, or sign up
                    on the web to get started.
                  </p>

                  {/* Store badges */}
                  <div className="mt-8">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-subtle mb-3">
                      Download the app
                    </p>
                    <StoreBadges />
                  </div>

                  {/* Secondary CTA */}
                  <div className="flex flex-wrap items-center gap-4 mt-7 pt-6 border-t border-border-light">
                    <a
                      data-cb-btn
                      href="/onboarding"
                      className="h-12 px-8 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors duration-300 inline-flex items-center gap-2 shadow-[0_4px_16px_rgba(31,111,67,0.3)]"
                    >
                      Sign up free
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    <span className="text-text-subtle text-xs">
                      Prefer the browser? Everything works on the web too.
                    </span>
                  </div>
                </div>

                {/* Right - app screenshots */}
                <div data-cb-phone className="shrink-0">
                  {/* Fanned trio on desktop */}
                  <div className="relative hidden lg:block w-[27rem] h-[31rem]">
                    <PhoneFrame
                      src={shotAt(1)}
                      alt="PropertyLoop app - property search"
                      className="absolute left-0 top-12 w-40 -rotate-[8deg]"
                    />
                    <PhoneFrame
                      src={shotAt(2)}
                      alt="PropertyLoop app - listing details"
                      className="absolute right-0 top-12 w-40 rotate-[8deg]"
                    />
                    <PhoneFrame
                      src={shotAt(0)}
                      alt="PropertyLoop app - home screen"
                      className="absolute left-1/2 -translate-x-1/2 top-0 w-52 z-10"
                    />
                  </div>

                  {/* Single phone on mobile / tablet */}
                  <div className="lg:hidden flex justify-center">
                    <PhoneFrame
                      src={shotAt(0)}
                      alt="PropertyLoop app - home screen"
                      className="w-44 sm:w-52"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom - stats row */}
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
    </section>
  );
};

export default CtaBanner;
