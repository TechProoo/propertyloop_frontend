import { Link } from "react-router-dom";
import { ArrowRight, Megaphone, Sparkles } from "lucide-react";

export default function AdvertiseSpotlight() {
  return (
    <section className="bg-[#f5f0eb]">
      <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-[#0f2e1b] px-6 py-8 shadow-[0_6px_24px_rgba(15,46,27,0.18)] sm:px-10 sm:py-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border border-white/10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-28 right-16 h-56 w-56 rounded-full bg-[#b9842c]/20 blur-3xl"
          />
          <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.15em] text-[#a3e635]">
                <Sparkles className="h-3 w-3" />
                For brands &amp; developers
              </span>
              <div className="mt-4 flex items-start gap-4">
                <div className="hidden h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#f5ead4] text-[#7a5314] sm:grid">
                  <Megaphone className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-heading text-[24px] font-bold leading-tight tracking-tight text-white sm:text-[30px]">
                    Put your brand in front of{" "}
                    <span className="text-[#f0d69f]">home movers.</span>
                  </h2>
                  <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-white/65">
                    Reach buyers, renters, agents, and property owners while
                    they are actively making property decisions.
                  </p>
                </div>
              </div>
            </div>
            <Link
              to="/advertise"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#f0d69f] px-5 py-2.5 text-[13px] font-bold text-[#392609] transition-transform hover:-translate-y-0.5 hover:bg-white"
            >
              View advertising packages
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
