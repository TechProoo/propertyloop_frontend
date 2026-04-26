import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, CheckCircle, Star, Home, Phone } from "lucide-react";
import AuthGate from "../ui/AuthGate";
import agentsService from "../../api/services/agents";
import type { AgentPublic } from "../../api/types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AgentSpotlight = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [agents, setAgents] = useState<AgentPublic[]>([]);

  useEffect(() => {
    const loadAgents = async () => {
      try {
        const result = await agentsService.list({
          limit: 100,
          sort: "top_rated",
        });
        setAgents(result.items.slice(0, 3));
      } catch (error) {
        console.error("Failed to load agents:", error);
        setAgents([]);
      }
    };
    loadAgents();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const label = el.querySelector("[data-as-label]");
    const heading = el.querySelector("[data-as-heading]");
    const subtitle = el.querySelector("[data-as-subtitle]");
    const viewAll = el.querySelector("[data-as-viewall]");
    const cards = el.querySelectorAll("[data-as-card]");
    const banner = el.querySelector("[data-as-banner]");

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

    // View-all button
    if (viewAll) {
      tl.fromTo(
        viewAll,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.6)" },
        "-=0.3",
      );
    }

    // Agent cards — cinematic stagger rise with 3D tilt
    if (cards.length) {
      tl.fromTo(
        cards,
        { y: 80, opacity: 0, rotateY: -8, scale: 0.93 },
        {
          y: 0,
          opacity: 1,
          rotateY: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.18,
          ease: "power4.out",
        },
        "-=0.3",
      );
    }

    // Trust banner — slide up
    if (banner) {
      tl.fromTo(
        banner,
        { y: 50, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.2)" },
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p
              data-as-label
              className="text-primary text-sm font-medium tracking-wide uppercase mb-2"
            >
              Agent-First Model
            </p>
            <h2
              data-as-heading
              className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3rem] leading-[1.1] font-bold text-primary-dark tracking-tight"
            >
              Meet Our <span className="text-primary">Top Agents</span>
            </h2>
            <p
              data-as-subtitle
              className="text-text-secondary text-sm leading-relaxed mt-3 max-w-lg"
            >
              Every listing on PropertyLoop is managed by a KYC-verified agent.
              No individual landlord posts — just professionals you can trust.
            </p>
          </div>
          <AuthGate
            href="/find-agent"
            className="shrink-0 h-10 px-6 rounded-full border border-border bg-white/80 backdrop-blur-sm text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 inline-flex items-center"
          >
            <span data-as-viewall>View all agents</span>
          </AuthGate>
        </div>

        {/* Agent cards — 3 per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent, i) => (
            <AuthGate
              key={i}
              href={`/agent/${agent.id}`}
              data-as-card
              className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer block"
            >
              {/* Photo */}
              <div className="h-52 overflow-hidden rounded-t-[20px] relative bg-linear-to-br from-primary/20 to-primary-dark/20">
                <img
                  src={agent.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop"}
                  alt={agent.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                {/* Verified badge */}
                {agent.verified && (
                  <span className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-primary text-xs font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    KYC Verified
                  </span>
                )}
              </div>

              {/* Glass content panel */}
              <div className="mx-3 mb-3 -mt-6 relative z-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl px-5 pt-4 pb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                {/* Name + agency */}
                <h3 className="font-heading font-bold text-primary-dark text-[16px] leading-snug">
                  {agent.name}
                </h3>
                <p className="text-text-secondary text-xs mt-0.5">
                  {agent.agency} · {agent.location}
                </p>

                {/* Divider */}
                <div className="h-px bg-border-light mt-3 mb-3" />

                {/* Stats */}
                <div className="flex items-center justify-between text-xs pr-8">
                  <div className="flex items-center gap-4 text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]" />
                      {agent.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Home className="w-3.5 h-3.5" />
                      {agent.listingsCount} active
                    </span>
                    <span>{agent.soldRentedCount} closed</span>
                  </div>
                </div>
              </div>

              {/* Arrow — clipped circle bottom-right */}
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-full absolute -right-3 -bottom-3 z-20 group-hover:bg-primary transition-colors duration-300 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
            </AuthGate>
          ))}
        </div>

        {/* Trust banner */}
        <div
          data-as-banner
          className="mt-12 bg-white/60 backdrop-blur-sm border border-border-light rounded-[20px] px-8 py-6 flex flex-col sm:flex-row items-center gap-6"
        >
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <CheckCircle className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-heading font-bold text-primary-dark text-lg">
              All agents are KYC-verified
            </h3>
            <p className="text-text-secondary text-sm mt-1">
              Every agent on PropertyLoop passes identity verification before
              they can list properties. This is how we keep listings trustworthy
              and protect buyers and tenants.
            </p>
          </div>
          <a
            href="/find-agent"
            className="shrink-0 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors duration-300 inline-flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Contact an agent
          </a>
        </div>
      </div>
    </section>
  );
};

export default AgentSpotlight;
