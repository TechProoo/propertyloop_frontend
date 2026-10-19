import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Handshake,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import utModern from "../../assets/ut_modern.jpeg";
import paystack from "../../assets/pt_2.png";
import redan from "../../assets/redan.png";

gsap.registerPlugin(ScrollTrigger);

const partners = [
  { name: "Ultramodern", logo: utModern },
  { name: "Paystack", logo: paystack },
  { name: "REDAN - Real Estate Developers Association of Nigeria", logo: redan },
];

const partnerBenefits = [
  {
    icon: TrendingUp,
    title: "Grow Your Reach",
    description:
      "Access thousands of active property buyers, sellers, and renters across Nigeria.",
  },
  {
    icon: Shield,
    title: "Trusted Ecosystem",
    description:
      "Join a verified, KYC-checked platform that prioritises transparency and trust.",
  },
  {
    icon: Users,
    title: "Co-Branded Exposure",
    description:
      "Get featured across our platform, marketing channels, and partner showcases.",
  },
  {
    icon: Zap,
    title: "API Integrations",
    description:
      "Seamlessly integrate your services with our platform via modern APIs and webhooks.",
  },
];

const partnerTypes = [
  "Banks & Mortgage Providers",
  "Payment Processors",
  "Insurance Companies",
  "Construction & Building Material Suppliers",
  "Legal & Conveyancing Firms",
  "Government & Regulatory Bodies",
];

const Partners = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const logos = el.querySelectorAll("[data-pt-logo]");
    const benefits = el.querySelectorAll("[data-pt-benefit]");
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: el, start: "top 80%", once: true },
    });
    if (logos.length) {
      tl.fromTo(
        logos,
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, stagger: 0.08, ease: "back.out(1.6)" },
      );
    }
    if (benefits.length) {
      tl.fromTo(
        benefits,
        { y: 40, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.08, ease: "power4.out" },
        "-=0.2",
      );
    }
    return () => { tl.kill(); };
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#f5f0eb]">
      <div className="mx-auto max-w-360 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.15em] text-primary">
            <Handshake className="h-3 w-3" />
            Our partners
          </span>
          <h2 className="font-heading mt-3 text-[26px] font-bold leading-[1.1] tracking-tight text-primary-dark sm:text-[34px]">
            Trusted by industry leaders
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-[14px] leading-relaxed text-text-secondary">
            We partner with top financial institutions, payment providers, and
            organisations to deliver a seamless property experience.
          </p>
        </div>

        {/* Logo grid */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {partners.map((partner) => (
            <div
              key={partner.name}
              data-pt-logo
              className="flex h-24 w-40 items-center justify-center rounded-2xl border border-border-light bg-white px-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] sm:h-[100px] sm:w-[180px]"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-12 w-full object-contain sm:max-h-14"
              />
            </div>
          ))}
        </div>

        {/* Why Partner */}
        <div className="mt-12">
          <div className="text-center">
            <h3 className="font-heading text-[22px] font-bold tracking-tight text-primary-dark sm:text-[26px]">
              Why partner with PropertyLoop?
            </h3>
            <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-text-secondary">
              Whether you are a bank, fintech, or service provider — there is a
              seat at the table for you.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {partnerBenefits.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  data-pt-benefit
                  className="group rounded-2xl border border-border-light bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)]"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-[14px] font-bold text-primary-dark">
                    {b.title}
                  </h4>
                  <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">
                    {b.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Partner CTA */}
        <div className="mt-10 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-dark via-primary-dark to-primary shadow-[0_6px_24px_rgba(0,0,0,0.12)]">
          <div className="relative px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-white/5 blur-2xl" />

            <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-14">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.15em] text-white/80 backdrop-blur-sm">
                  <Handshake className="h-3 w-3" />
                  Partnership programme
                </span>
                <h3 className="font-heading mt-4 text-[24px] font-bold leading-tight tracking-tight text-white sm:text-[28px]">
                  Become a partner today
                </h3>
                <p className="mt-2 max-w-md text-[14px] leading-relaxed text-white/60">
                  Join Nigeria's fastest-growing property platform. We are
                  building partnerships that make real estate simpler, safer,
                  and more accessible for everyone.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[13px] font-bold text-primary-dark shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-colors hover:bg-white/90"
                  >
                    Get in touch
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <a
                    href="mailto:support.propertyloop@propertyloop.ng"
                    className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-[13px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                  >
                    support.propertyloop@propertyloop.ng
                  </a>
                </div>
              </div>

              <div className="max-w-sm lg:max-w-xs">
                <p className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.15em] text-white/50">
                  We work with
                </p>
                <div className="flex flex-wrap gap-2">
                  {partnerTypes.map((type) => (
                    <span
                      key={type}
                      className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[12px] font-medium text-white/80 backdrop-blur-sm transition-colors hover:bg-white/15 hover:text-white"
                    >
                      {type}
                    </span>
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

export default Partners;
