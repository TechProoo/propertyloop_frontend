import { useEffect, useRef } from "react";
import { ArrowRight, Home, MapPin, Shield, Smartphone, UserCheck } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import appStoreBadge from "../../assets/appstore.png";
import playStoreBadge from "../../assets/playstore.png";
import { APP_STORE_URL, PLAY_STORE_URL } from "../../lib/appLinks";

gsap.registerPlugin(ScrollTrigger);

export { APP_STORE_URL, PLAY_STORE_URL };

const screenshots = Object.entries(
  import.meta.glob<string>("../../assets/app_ss*.{png,jpg,jpeg,webp,avif}", {
    eager: true,
    import: "default",
  }),
)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

const stats = [
  { icon: Home, value: "20,000+", label: "Listings" },
  { icon: UserCheck, value: "1,200+", label: "Verified Agents" },
  { icon: Shield, value: "8,500+", label: "Verified Vendors" },
  { icon: MapPin, value: "5", label: "Cities" },
];

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
    className={`relative rounded-[2rem] border border-border-light bg-white/80 p-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-md ${className}`}
  >
    <div className="relative aspect-[9/19.5] overflow-hidden rounded-[1.65rem] bg-[#f5f0eb]">
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Smartphone className="h-7 w-7 text-primary" />
          </div>
          <p className="text-sm font-bold text-primary-dark">PropertyLoop</p>
          <p className="text-xs text-text-subtle">Out now on iOS &amp; Android</p>
        </div>
      )}
    </div>
    <div className="absolute left-1/2 top-3.5 h-4 w-16 -translate-x-1/2 rounded-full border border-border-light bg-white/90" />
  </div>
);

const shotAt = (i: number) =>
  screenshots.length ? screenshots[i % screenshots.length] : undefined;

const badgeLinkClass =
  "inline-flex rounded-[0.9rem] shadow-[0_8px_24px_rgba(0,0,0,0.24)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(0,0,0,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
const badgeImgClass = "h-14 sm:h-16 w-auto";

const StoreBadges = ({ className = "" }: { className?: string }) => (
  <div className={`flex flex-wrap items-center gap-4 ${className}`}>
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download PropertyLoop on the App Store"
      className={badgeLinkClass}
    >
      <img src={appStoreBadge} alt="Download on the App Store" className={badgeImgClass} />
    </a>
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get PropertyLoop on Google Play"
      className={badgeLinkClass}
    >
      <img src={playStoreBadge} alt="Get it on Google Play" className={badgeImgClass} />
    </a>
  </div>
);

const CtaBanner = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const phone = el.querySelector("[data-cb-phone]");
    const statCards = el.querySelectorAll("[data-cb-stat]");
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: el, start: "top 80%", once: true },
    });
    if (phone) {
      tl.fromTo(
        phone,
        { x: 60, opacity: 0, rotateY: -10 },
        { x: 0, opacity: 1, rotateY: 0, duration: 0.9, ease: "power4.out" },
      );
    }
    if (statCards.length) {
      tl.fromTo(
        statCards,
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.08, ease: "power4.out" },
        "-=0.4",
      );
    }
    return () => { tl.kill(); };
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#f5f0eb]">
      <div className="mx-auto max-w-360 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-border-light bg-white shadow-sm">
          <div className="relative px-5 py-10 sm:px-10 sm:py-14 lg:px-14">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/5" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-primary/5" />

            <div className="relative flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
              {/* Left text */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.15em] text-white shadow-[0_2px_10px_rgba(31,111,67,0.3)]">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                    Out now
                  </span>
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
                    On iOS &amp; Android
                  </p>
                </div>

                <h2 className="font-heading mt-4 text-[26px] font-bold leading-[1.1] tracking-tight text-primary-dark sm:text-[34px]">
                  Find your next home.{" "}
                  <span className="text-primary">Close the loop.</span>
                </h2>
                <p className="mt-3 max-w-md text-[14px] leading-relaxed text-text-secondary">
                  From first search to signed contract — and everything after
                  the keys are handed over. The PropertyLoop app has landed:
                  download it free on the App Store or Google Play, or sign up
                  on the web to get started.
                </p>

                <div className="mt-7">
                  <p className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.15em] text-primary-dark">
                    Download the app
                  </p>
                  <StoreBadges />
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border-light pt-5">
                  <a
                    href="/onboarding"
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primary-dark"
                  >
                    Sign up free
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                  <span className="text-xs text-text-subtle">
                    Prefer the browser? Everything works on the web too.
                  </span>
                </div>
              </div>

              {/* Right — app screenshots */}
              <div data-cb-phone className="shrink-0">
                <div className="relative hidden h-124 w-108 lg:block">
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
                    className="absolute left-1/2 top-0 z-10 w-52 -translate-x-1/2"
                  />
                </div>
                <div className="flex justify-center lg:hidden">
                  <PhoneFrame
                    src={shotAt(0)}
                    alt="PropertyLoop app - home screen"
                    className="w-44 sm:w-52"
                  />
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-10 border-t border-border-light pt-6">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={i}
                      data-cb-stat
                      className="min-w-0 rounded-xl border border-border-light bg-[#f5f0eb]/60 px-4 py-3 shadow-sm"
                    >
                      <div className="mb-1.5 flex items-center gap-1.5">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-[11px] leading-tight text-text-secondary">
                          {stat.label}
                        </span>
                      </div>
                      <p className="font-heading text-xl font-bold leading-none text-primary-dark">
                        {stat.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;
