import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "@/components/Home/Footer";
import { useAuth } from "../context/AuthContext";

const GREEN = "#1f6f43";

// PropertyLoop is free for every agent — one plan, everything included.
const FREE_FEATURES = [
  "Unlimited active listings",
  "Full agent profile",
  "Buyer contact & WhatsApp enquiries",
  "Phone number on listings",
  "Search placement & listing analytics",
  "Verified agent badge",
];

export default function Pricing() {
  const { user } = useAuth();
  // Existing agents land on their dashboard; everyone else starts the agent
  // sign-up flow — no payment step.
  const ctaHref = user?.role === "AGENT" ? "/agent-dashboard" : "/onboarding";

  return (
    <div className="min-h-screen bg-[#f6f4ef]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 pt-28 pb-20">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto">
          <span
            className="inline-block text-[11px] font-extrabold uppercase tracking-[0.18em] px-3 py-1 rounded-full"
            style={{ background: "#e3efe7", color: GREEN }}
          >
            Agent plans
          </span>
          <h1
            className="mt-4 font-heading font-extrabold tracking-tight text-[#1a2120]"
            style={{ fontSize: 42, letterSpacing: "-0.03em", lineHeight: 1.08 }}
          >
            Free for every agent
          </h1>
          <p className="mt-3 text-[15px] text-[#4d524f]">
            PropertyLoop is completely free for agents — unlimited listings and
            every feature, no subscription, no card required.
          </p>
        </div>

        {/* Single free plan */}
        <div className="mt-12 max-w-md mx-auto">
          <div
            className="rounded-[22px] p-7 flex flex-col bg-white relative"
            style={{
              border: `2px solid ${GREEN}`,
              boxShadow: "0 18px 40px -22px rgba(31,111,67,0.45)",
            }}
          >
            <span
              className="absolute -top-3 left-7 text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full text-white"
              style={{ background: GREEN }}
            >
              Everything included
            </span>
            <h3 className="text-[15px] font-extrabold text-[#1a2120]">Free forever</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span
                className="font-heading font-extrabold text-[#1a2120]"
                style={{ fontSize: 40, letterSpacing: "-0.02em" }}
              >
                ₦0
              </span>
            </div>
            <p className="mt-1.5 text-[13px] text-[#4d524f]">
              List, get leads, and grow — on the house.
            </p>

            <Link
              to={ctaHref}
              className="mt-5 inline-flex items-center justify-center h-11 rounded-xl text-sm font-bold transition-colors"
              style={{ background: GREEN, color: "#fff" }}
            >
              {user?.role === "AGENT" ? "Go to dashboard" : "Get started"}
            </Link>

            <ul className="mt-6 flex flex-col gap-2.5 list-none pl-0">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[13px] text-[#4d524f]">
                  <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: GREEN }} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
