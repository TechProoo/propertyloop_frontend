import { Link } from "react-router-dom";
import { ArrowUpRight, Megaphone, Sparkles } from "lucide-react";

export default function AdvertiseSpotlight() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#153d2b] px-6 py-7 sm:px-10 sm:py-9 shadow-[0_24px_60px_rgba(21,61,43,0.22)]">
        <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full border border-white/10" />
        <div className="absolute right-16 bottom-[-120px] h-64 w-64 rounded-full bg-[#b9842c]/20 blur-3xl" />
        <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#bfe6cb]">
              <Sparkles className="h-3.5 w-3.5" /> For brands & developers
            </div>
            <div className="mt-4 flex items-start gap-4">
              <div className="hidden sm:grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#f5ead4] text-[#7a5314]">
                <Megaphone className="h-7 w-7" />
              </div>
              <div>
                <h2 className="font-serif text-3xl leading-tight text-white sm:text-4xl">
                  Put your brand in front of <em className="text-[#f0d69f]">home movers.</em>
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
                  Reach buyers, renters, agents, and property owners while they are actively making property decisions.
                </p>
              </div>
            </div>
          </div>
          <Link
            to="/advertise"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#f0d69f] px-6 py-3.5 text-sm font-bold text-[#392609] transition-transform hover:-translate-y-0.5 hover:bg-white"
          >
            View advertising packages
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
