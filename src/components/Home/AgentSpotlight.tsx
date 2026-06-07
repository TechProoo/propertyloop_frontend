import { useEffect, useRef, useState } from "react";
import {
  CheckCircle,
  Phone,
  Sparkles,
  WifiOff,
  RotateCcw,
} from "lucide-react";
import AuthGate from "../ui/AuthGate";
import agentsService from "../../api/services/agents";
import type { AgentPublic } from "../../api/types";
import FallbackImg from "../../assets/fallback.png";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Manually-curated agents that should always appear at the top of the
// home-page spotlight, in this order. The backend doesn't (yet) have a
// "featured" flag, so we promote them on the client by email match.
const FEATURED_EMAILS: string[] = [
  "omodolapookunlola@gmail.com",
  "danielsboluwatife@gmail.com",
];

const AgentSpotlight = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [agents, setAgents] = useState<AgentPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadAgents = async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await agentsService.list({
        limit: 100,
        sort: "top_performers",
      });

      const featuredOrder = new Map(
        FEATURED_EMAILS.map((e, i) => [e.toLowerCase(), i]),
      );
      const featured: AgentPublic[] = [];
      const rest: AgentPublic[] = [];
      for (const a of result.items) {
        const idx = featuredOrder.get((a.email ?? "").toLowerCase());
        if (idx !== undefined) featured[idx] = a;
        else rest.push(a);
      }
      const ordered = [...featured.filter(Boolean), ...rest];
      setAgents(ordered.slice(0, 3));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 bg-linear-to-br from-white/40 to-white/20 rounded-[20px] animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <WifiOff className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="font-heading font-bold text-primary-dark text-lg">
              Couldn’t load agents
            </h3>
            <p className="text-text-secondary text-sm mt-2 max-w-sm">
              Check your internet connection and try again.
            </p>
            <button
              onClick={loadAgents}
              className="mt-6 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.map((agent, i) => (
              <AuthGate
                key={i}
                href={`/agent/${agent.id}`}
                data-as-card
                className="group bg-white border border-border-light rounded-[24px] p-6 shadow-[0_2px_14px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.09)] hover:-translate-y-1 transition-all duration-300 block"
              >
                {/* Top — avatar + name + agency */}
                <div className="flex items-center gap-4">
                  <div className="w-[68px] h-[68px] rounded-full overflow-hidden bg-bg-accent shrink-0">
                    <img
                      src={agent.avatarUrl || FallbackImg}
                      alt={agent.name}
                      onError={(e) => {
                        e.currentTarget.src = FallbackImg;
                      }}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-heading font-bold text-primary-dark text-[17px] leading-tight truncate">
                        {agent.name}
                      </h3>
                      {agent.verified && (
                        <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-text-subtle text-xs mt-1 truncate">
                      {agent.agency} · {agent.location}
                    </p>
                  </div>
                </div>

                {/* KYC pill */}
                {agent.verified && (
                  <span className="inline-flex items-center gap-1.5 mt-4 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary-dark text-xs font-semibold">
                    <CheckCircle className="w-3.5 h-3.5 text-primary" />
                    KYC Verified
                  </span>
                )}

                {/* Stats — or "new agent" badge */}
                {agent.listingsCount === 0 &&
                agent.soldRentedCount === 0 &&
                !agent.rating ? (
                  <div className="mt-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      <Sparkles className="w-3 h-3" />
                      New on PropertyLoop
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 my-5 py-4 border-t border-b border-border-light text-center">
                    <div>
                      <b className="font-heading text-[20px] font-bold text-primary-dark block tracking-tight">
                        {agent.listingsCount}
                      </b>
                      <span className="text-[11px] text-text-subtle">Active</span>
                    </div>
                    <div>
                      <b className="font-heading text-[20px] font-bold text-primary-dark block tracking-tight">
                        {agent.soldRentedCount}
                      </b>
                      <span className="text-[11px] text-text-subtle">Closed</span>
                    </div>
                    <div>
                      <b className="font-heading text-[20px] font-bold text-primary-dark block tracking-tight">
                        {agent.rating > 0 ? agent.rating.toFixed(1) : "—"}
                      </b>
                      <span className="text-[11px] text-text-subtle">Rating</span>
                    </div>
                  </div>
                )}

                {/* View profile */}
                <div className="w-full mt-5 bg-bg-accent text-primary-dark group-hover:bg-primary group-hover:text-white rounded-2xl py-3.5 text-center font-semibold text-sm transition-colors">
                  View profile
                </div>
              </AuthGate>
            ))}
          </div>
        )}

        {/* Trust strip */}
        <div
          data-as-banner
          className="mt-11 bg-white border border-border-light rounded-[24px] px-6 sm:px-9 py-7 flex flex-col sm:flex-row items-center gap-6 shadow-[0_2px_14px_rgba(0,0,0,0.04)]"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-heading font-bold text-primary-dark text-lg">
              All agents are KYC-verified
            </h3>
            <p className="text-text-secondary text-sm mt-1 leading-relaxed">
              Every agent on PropertyLoop passes identity verification before
              they can list properties. This is how we keep listings trustworthy
              and protect buyers and tenants.
            </p>
          </div>
          <a
            href="/find-agent"
            className="shrink-0 h-12 px-7 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors duration-300 inline-flex items-center gap-2"
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
