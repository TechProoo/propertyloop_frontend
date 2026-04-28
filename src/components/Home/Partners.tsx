import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Handshake,
  TrendingUp,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const partners = [
  {
    name: "Access Bank",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Access_Bank_Plc_logo.svg/2560px-Access_Bank_Plc_logo.svg.png",
  },
  {
    name: "GTBank",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Guaranty_Trust_Holding_Company_logo.svg/2560px-Guaranty_Trust_Holding_Company_logo.svg.png",
  },
  {
    name: "FIRS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Coat_of_arms_of_Nigeria.svg/200px-Coat_of_arms_of_Nigeria.svg.png",
  },
  {
    name: "Dangote Group",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Dangote-Group-Logo.svg/1200px-Dangote-Group-Logo.svg.png",
  },
  {
    name: "First Bank",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/First_Bank_of_Nigeria_logo.svg/2560px-First_Bank_of_Nigeria_logo.svg.png",
  },
];

const partnerBenefits = [
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Grow Your Reach",
    description:
      "Access thousands of active property buyers, sellers, and renters across Nigeria.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Trusted Ecosystem",
    description:
      "Join a verified, KYC-checked platform that prioritises transparency and trust.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Co-Branded Exposure",
    description:
      "Get featured across our platform, marketing channels, and partner showcases.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
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

    const label = el.querySelector("[data-pt-label]");
    const heading = el.querySelector("[data-pt-heading]");
    const subtitle = el.querySelector("[data-pt-subtitle]");
    const logoBox = el.querySelector("[data-pt-logobox]");
    const logos = el.querySelectorAll("[data-pt-logo]");
    const whyHeading = el.querySelector("[data-pt-why-heading]");
    const whySubtitle = el.querySelector("[data-pt-why-subtitle]");
    const benefitCards = el.querySelectorAll("[data-pt-benefit]");
    const ctaBanner = el.querySelector("[data-pt-cta]");
    const pills = el.querySelectorAll("[data-pt-pill]");

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

    if (subtitle)
      tl.fromTo(
        subtitle,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.4",
      );

    if (logoBox)
      tl.fromTo(
        logoBox,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        "-=0.3",
      );

    if (logos.length) {
      tl.fromTo(
        logos,
        { scale: 0.6, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.07,
          ease: "back.out(1.6)",
        },
        "-=0.3",
      );
    }

    if (whyHeading) {
      tl.fromTo(
        whyHeading,
        { clipPath: "inset(0 100% 0 0)", opacity: 0 },
        {
          clipPath: "inset(0 0% 0 0)",
          opacity: 1,
          duration: 0.8,
          ease: "power4.out",
        },
        "-=0.1",
      );
    }

    if (whySubtitle)
      tl.fromTo(
        whySubtitle,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.3",
      );

    if (benefitCards.length) {
      tl.fromTo(
        benefitCards,
        { y: 50, opacity: 0, rotateY: -6, scale: 0.93 },
        {
          y: 0,
          opacity: 1,
          rotateY: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power4.out",
        },
        "-=0.2",
      );
    }

    if (ctaBanner) {
      tl.fromTo(
        ctaBanner,
        { y: 60, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power4.out" },
        "-=0.2",
      );
    }

    if (pills.length) {
      tl.fromTo(
        pills,
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.06,
          ease: "back.out(1.4)",
        },
        "-=0.5",
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full px-6 md:px-12 lg:px-20 py-16 lg:py-24 bg-bg"
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <p
            data-pt-label
            className="text-primary text-sm font-medium tracking-wide uppercase mb-3"
          >
            Our Partners
          </p>
          <h2
            data-pt-heading
            className="font-heading text-[1.75rem] sm:text-[2rem] lg:text-[2.5rem] leading-[1.1] font-bold text-primary-dark tracking-tight"
          >
            Trusted by <span className="text-primary">industry leaders</span>
          </h2>
          <p
            data-pt-subtitle
            className="text-text-secondary text-sm leading-relaxed mt-4 max-w-lg mx-auto"
          >
            We partner with top financial institutions, payment providers, and
            organisations to deliver a seamless property experience.
          </p>
        </div>

        {/* Logo grid */}
        <div
          data-pt-logobox
          className="bg-white/60 backdrop-blur-sm border border-border-light rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-3"
        >
          <div className="bg-white/80 backdrop-blur-md border border-white/40 rounded-[22px] shadow-[0_4px_16px_rgba(0,0,0,0.04)] px-8 py-10 sm:px-12 sm:py-14">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10 items-center">
              {partners.map((partner) => (
                <div
                  key={partner.name}
                  data-pt-logo
                  className="flex items-center justify-center"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-8 sm:h-10 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Why Partner With Us ─── */}
        <div className="mt-16 lg:mt-20">
          <div className="text-center mb-10">
            <h3
              data-pt-why-heading
              className="font-heading text-[1.5rem] sm:text-[1.75rem] font-bold text-primary-dark tracking-tight"
            >
              Why partner with{" "}
              <span className="text-primary">PropertyLoop?</span>
            </h3>
            <p
              data-pt-why-subtitle
              className="text-text-secondary text-sm leading-relaxed mt-3 max-w-md mx-auto"
            >
              Whether you're a bank, fintech, or service provider — there's a
              seat at the table for you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {partnerBenefits.map((benefit) => (
              <div
                key={benefit.title}
                data-pt-benefit
                className="group bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {benefit.icon}
                </div>
                <h4 className="font-heading font-bold text-primary-dark text-[15px] mb-2">
                  {benefit.title}
                </h4>
                <p className="text-text-secondary text-xs leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Partner Types + CTA ─── */}
        <div className="mt-14 lg:mt-16">
          <div
            data-pt-cta
            className="bg-linear-to-br from-primary-dark via-primary-dark to-primary rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.15)] overflow-hidden relative"
          >
            {/* Decorative circles */}
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5 blur-2xl" />

            <div className="relative z-10 px-8 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20 flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-16">
              {/* Left side */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white/80 text-xs font-medium mb-5">
                  <Handshake className="w-3.5 h-3.5" />
                  Partnership Programme
                </div>
                <h3 className="font-heading text-[1.6rem] sm:text-[2rem] font-bold text-white leading-tight tracking-tight">
                  Become a partner
                  <br />
                  <span className="text-primary-light opacity-80">today</span>
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mt-4 max-w-md">
                  Join Nigeria's fastest-growing property platform. We're
                  building partnerships that make real estate simpler, safer,
                  and more accessible for everyone.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-8">
                  <Link
                    to="/contact"
                    className="h-11 px-7 text-nowrap rounded-full bg-white text-primary-dark text-sm font-bold hover:bg-white/90 transition-colors inline-flex items-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                  >
                    Get in Touch
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="mailto:support@propertyloop.ng"
                    className="h-11 px-7 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-colors inline-flex items-center gap-2"
                  >
                    support@propertyloop.ng
                  </a>
                </div>
              </div>

              {/* Right side — partner types */}
              <div className="w-full lg:w-auto lg:min-w-70">
                <p className="text-white/50 text-xs font-medium uppercase tracking-wide mb-4">
                  We work with
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {partnerTypes.map((type) => (
                    <span
                      key={type}
                      data-pt-pill
                      className="px-3.5 py-2 rounded-xl bg-white/8 backdrop-blur-sm border border-white/10 text-white/80 text-xs font-medium hover:bg-white/15 hover:text-white transition-all duration-200 cursor-default"
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
