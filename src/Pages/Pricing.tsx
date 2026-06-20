import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "@/components/Home/Footer";
import { useAuth } from "../context/AuthContext";

const GREEN = "#1f6f43";

const PLANS = [
  {
    id: "FREE",
    name: "Free",
    price: "₦0",
    per: "",
    blurb: "Get listing and build your profile.",
    cta: "Get started",
    highlight: false,
    features: [
      "3 active listings",
      "Basic agent profile",
      "Buyer contact form",
      "Standard search placement",
    ],
  },
  {
    id: "STANDARD",
    name: "Standard",
    price: "₦5,000",
    per: "/month",
    blurb: "For active agents who want more reach.",
    cta: "Choose Standard",
    highlight: true,
    features: [
      "10 active listings",
      "WhatsApp enquiry button",
      "Phone number on listings",
      "Priority search ranking",
      "Listing analytics",
    ],
  },
  {
    id: "PRO",
    name: "Premium",
    price: "₦20,000",
    per: "/month",
    blurb: "Maximum visibility and trust signals.",
    cta: "Choose Premium",
    highlight: false,
    features: [
      "Unlimited listings",
      "Featured listing placement",
      "Verified agent badge",
      "Homepage & social promotion",
      "Premium priority support",
    ],
  },
];

export default function Pricing() {
  const { user } = useAuth();
  // Existing agents manage their plan in the dashboard; everyone else starts
  // the agent sign-up flow.
  const ctaHref =
    user?.role === "AGENT" ? "/agent-dashboard/subscription" : "/onboarding";

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
            Plans that grow with your business
          </h1>
          <p className="mt-3 text-[15px] text-[#4d524f]">
            Start free with 3 listings. Upgrade when you want more reach, leads,
            and visibility. Prices include VAT — cancel anytime.
          </p>
        </div>

        {/* Plans */}
        <div className="mt-12 grid gap-5 grid-cols-1 md:grid-cols-3 items-start">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className="rounded-[22px] p-6 flex flex-col bg-white relative"
              style={{
                border: p.highlight ? `2px solid ${GREEN}` : "1px solid #e1dcd3",
                boxShadow: p.highlight ? "0 18px 40px -22px rgba(31,111,67,0.45)" : "none",
              }}
            >
              {p.highlight && (
                <span
                  className="absolute -top-3 left-6 text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full text-white"
                  style={{ background: GREEN }}
                >
                  Most popular
                </span>
              )}
              <h3 className="text-[15px] font-extrabold text-[#1a2120]">{p.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span
                  className="font-heading font-extrabold text-[#1a2120]"
                  style={{ fontSize: 34, letterSpacing: "-0.02em" }}
                >
                  {p.price}
                </span>
                {p.per && (
                  <span className="text-[13px] font-semibold text-[#7f857f]">{p.per}</span>
                )}
              </div>
              <p className="mt-1.5 text-[13px] text-[#4d524f] min-h-[36px]">{p.blurb}</p>

              <Link
                to={ctaHref}
                className="mt-4 inline-flex items-center justify-center h-11 rounded-xl text-sm font-bold transition-colors"
                style={
                  p.highlight
                    ? { background: GREEN, color: "#fff" }
                    : { background: "#fff", color: GREEN, border: `1.5px solid ${GREEN}` }
                }
              >
                {p.cta}
              </Link>

              <ul className="mt-5 flex flex-col gap-2.5 list-none pl-0">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px] text-[#4d524f]">
                    <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: GREEN }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Reassurance */}
        <p className="mt-10 text-center text-[13px] text-[#7f857f]">
          Already an early agent on the Founding plan? Your free-forever access
          stays — these plans are for new accounts.
        </p>
      </main>

      <Footer />
    </div>
  );
}
