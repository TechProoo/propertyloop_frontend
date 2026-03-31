import {
  ArrowUpRight,
  CheckCircle,
  Star,
  Home,
  Phone,
} from "lucide-react";
import { agents as sharedAgents } from "../../data/agents";

const agents = sharedAgents.slice(0, 6);

const AgentSpotlight = () => {
  return (
    <section className="w-full px-6 md:px-12 lg:px-20 py-20 lg:py-28 bg-bg">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="text-primary text-sm font-medium tracking-wide uppercase mb-2">
              Agent-First Model
            </p>
            <h2 className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
              Meet Our <span className="text-primary">Top Agents</span>
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mt-3 max-w-lg">
              Every listing on PropertyLoop is managed by a KYC-verified agent.
              No individual landlord posts — just professionals you can trust.
            </p>
          </div>
          <a href="/find-agent" className="shrink-0 h-10 px-6 rounded-full border border-border bg-white/80 backdrop-blur-sm text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 inline-flex items-center">
            View all agents
          </a>
        </div>

        {/* Agent cards — 3 per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent, i) => (
            <a
              key={i}
              href={`/agent/${agent.id}`}
              className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer block"
            >
              {/* Photo */}
              <div className="h-52 overflow-hidden rounded-t-[20px] relative">
                <img
                  src={agent.photo}
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
                      {agent.listings} active
                    </span>
                    <span>{agent.soldRented} closed</span>
                  </div>
                </div>
              </div>

              {/* Arrow — clipped circle bottom-right */}
              <div className="w-20 h-20 bg-[#1a1a1a] rounded-full absolute -right-5 -bottom-5 z-20 group-hover:bg-primary transition-colors duration-300">
                <ArrowUpRight className="absolute top-4 left-5 w-5 h-5 text-white" />
              </div>
            </a>
          ))}
        </div>

        {/* Trust banner */}
        <div className="mt-12 bg-white/60 backdrop-blur-sm border border-border-light rounded-[20px] px-8 py-6 flex flex-col sm:flex-row items-center gap-6">
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
          <a href="/find-agent" className="shrink-0 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors duration-300 inline-flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Contact an agent
          </a>
        </div>
      </div>
    </section>
  );
};

export default AgentSpotlight;
