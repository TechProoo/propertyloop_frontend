import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Phone,
  RotateCcw,
  Sparkles,
  Users,
  WifiOff,
} from "lucide-react";
import AuthGate from "../ui/AuthGate";
import agentsService from "../../api/services/agents";
import type { AgentPublic } from "../../api/types";
import FallbackImg from "../../assets/fallback.png";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
    const cards = el.querySelectorAll("[data-as-card]");
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: el, start: "top 80%", once: true },
    });
    if (cards.length) {
      tl.fromTo(
        cards,
        { y: 50, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.12, ease: "power4.out" },
      );
    }
    return () => { tl.kill(); };
  }, [loading, agents.length]);

  return (
    <section ref={sectionRef} className="bg-[#f5f0eb]">
      <div className="mx-auto max-w-360 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.15em] text-primary">
              <Users className="h-3 w-3" />
              Agent-first model
            </span>
            <h2 className="font-heading mt-3 text-[26px] font-bold leading-[1.1] tracking-tight text-primary-dark sm:text-[34px]">
              Meet our top agents
            </h2>
            <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-text-secondary">
              Every listing on PropertyLoop is managed by a KYC-verified agent.
              No individual landlord posts — just professionals you can trust.
            </p>
          </div>
          <Link
            to="/find-agent"
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 px-5 py-2.5 text-[13px] font-bold text-primary-dark transition-colors hover:bg-primary hover:text-white"
          >
            View all agents
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-white p-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 shrink-0 rounded-full bg-primary/5" />
                  <div className="flex-1">
                    <div className="h-4 w-3/4 rounded-full bg-primary/10" />
                    <div className="mt-2 h-3 w-1/2 rounded-full bg-primary/5" />
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-12 rounded-xl bg-primary/5" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
            <WifiOff className="h-6 w-6 text-text-subtle" />
            <p className="text-sm text-text-secondary">
              Agents could not be loaded.
            </p>
            <button
              onClick={loadAgents}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-[13px] font-bold text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Try again
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent, i) => (
              <AuthGate
                key={i}
                href={`/agent/${agent.id}`}
                data-as-card
                className="group block rounded-2xl border border-border-light bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[#f5f0eb]">
                    <img
                      src={agent.avatarUrl || FallbackImg}
                      alt={agent.name}
                      onError={(e) => {
                        e.currentTarget.src = FallbackImg;
                      }}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate text-[15px] font-bold leading-tight text-primary-dark">
                        {agent.name}
                      </h3>
                      {agent.verified && (
                        <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-text-subtle">
                      {agent.agency} · {agent.location}
                    </p>
                  </div>
                </div>

                {agent.verified && (
                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10.5px] font-semibold text-primary-dark">
                    <CheckCircle className="h-3 w-3 text-primary" />
                    KYC Verified
                  </span>
                )}

                {agent.listingsCount === 0 &&
                agent.soldRentedCount === 0 &&
                !agent.rating ? (
                  <div className="mt-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10.5px] font-medium text-primary">
                      <Sparkles className="h-3 w-3" />
                      New on PropertyLoop
                    </span>
                  </div>
                ) : (
                  <div className="my-4 grid grid-cols-3 gap-2 border-t border-b border-border-light py-3 text-center">
                    <div>
                      <b className="block text-[18px] font-bold tracking-tight text-primary-dark">
                        {agent.listingsCount}
                      </b>
                      <span className="text-[11px] text-text-subtle">Active</span>
                    </div>
                    <div>
                      <b className="block text-[18px] font-bold tracking-tight text-primary-dark">
                        {agent.soldRentedCount}
                      </b>
                      <span className="text-[11px] text-text-subtle">Closed</span>
                    </div>
                    <div>
                      <b className="block text-[18px] font-bold tracking-tight text-primary-dark">
                        {agent.rating > 0 ? agent.rating.toFixed(1) : "-"}
                      </b>
                      <span className="text-[11px] text-text-subtle">Rating</span>
                    </div>
                  </div>
                )}

                <div className="mt-4 w-full rounded-xl bg-[#f5f0eb] py-3 text-center text-[13px] font-semibold text-primary-dark transition-colors group-hover:bg-primary group-hover:text-white">
                  View profile
                </div>
              </AuthGate>
            ))}
          </div>
        )}

        {/* Trust strip */}
        <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-border-light bg-white px-6 py-5 shadow-sm sm:flex-row sm:items-center">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CheckCircle className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="text-[15px] font-bold text-primary-dark">
              All agents are KYC-verified
            </p>
            <p className="mt-0.5 text-[13px] text-text-secondary">
              Every agent passes identity verification before they can list
              properties — keeping listings trustworthy and protecting buyers
              and tenants.
            </p>
          </div>
          <a
            href="/find-agent"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-primary-dark"
          >
            <Phone className="h-3.5 w-3.5" />
            Contact an agent
          </a>
        </div>
      </div>
    </section>
  );
};

export default AgentSpotlight;
