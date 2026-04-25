import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ArrowUpRight,
  ArrowRight,
  UserCheck,
  ClipboardCheck,
  MessageSquare,
  Handshake,
  ShieldCheck,
  TrendingUp,
  Lock,
  FileSignature,
  BarChart3,
  BookOpen,
  CheckCircle,
  Star,
  Home,
  Clock,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";

/* ─── Data ─── */

const steps = [
  {
    icon: <UserCheck className="w-6 h-6" />,
    title: "Connect With an Agent",
    description:
      "Tell us about your property and we'll match you with the best local KYC-verified agent.",
  },
  {
    icon: <ClipboardCheck className="w-6 h-6" />,
    title: "Agent Lists Your Property",
    description:
      "Your agent handles photos, pricing strategy, and creates a professional listing on the platform.",
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Receive & Manage Offers",
    description:
      "All offers come through the platform with full transparency and built-in negotiation tools.",
  },
  {
    icon: <Handshake className="w-6 h-6" />,
    title: "Close the Deal",
    description:
      "Receive offers, message buyers directly, and coordinate handover with your verified agent.",
  },
];

const benefits = [
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
    title: "KYC-Verified Agents",
    description:
      "Every agent passes identity verification. Your property is represented by professionals you can trust.",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    title: "Full Price History",
    description:
      "Transparent pricing with complete history. No hidden inflation — buyers see the truth.",
  },
  {
    icon: <Lock className="w-5 h-5" />,
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
    title: "Verified Buyers",
    description:
      "Every PropertyLoop user is identity-verified, so the offers you receive come from real people you can trust.",
  },
  {
    icon: <FileSignature className="w-5 h-5" />,
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop",
    title: "Digital E-Signing",
    description:
      "Sign sale agreements digitally via DocuSeal. No printing, no scanning, no delays.",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    title: "Per-Listing Analytics",
    description:
      "See exactly how your listing performs — views, enquiries, and offer activity in real time.",
  },
  {
    icon: <BookOpen className="w-5 h-5" />,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
    title: "Property Logbook",
    description:
      "Every maintenance record builds your property's verifiable history, increasing its value.",
  },
];

const agents = [
  {
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    name: "Adebayo Johnson",
    agency: "Prime Realty Lagos",
    location: "Lekki, Lagos",
    rating: 4.9,
    listings: 42,
    sold: 187,
  },
  {
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    name: "Chioma Okafor",
    agency: "Island Properties",
    location: "Victoria Island, Lagos",
    rating: 4.8,
    listings: 38,
    sold: 156,
  },
  {
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    name: "Emeka Nwosu",
    agency: "Prestige Homes",
    location: "Ikoyi, Lagos",
    rating: 4.9,
    listings: 55,
    sold: 231,
  },
  {
    photo:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
    name: "Tunde Bakare",
    agency: "Royal Estate Advisors",
    location: "Banana Island, Lagos",
    rating: 4.7,
    listings: 29,
    sold: 124,
  },
  {
    photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    name: "Aisha Mohammed",
    agency: "Metro Living Realty",
    location: "Ajah, Lagos",
    rating: 4.8,
    listings: 47,
    sold: 198,
  },
  {
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    name: "Femi Adeyemi",
    agency: "Cityscape Properties",
    location: "Gbagada, Lagos",
    rating: 4.6,
    listings: 33,
    sold: 142,
  },
];

const faqs = [
  {
    q: "Can I list my property myself?",
    a: "No. PropertyLoop uses an Agent-First Model. All listings are managed by KYC-verified agents to ensure quality and trust.",
  },
  {
    q: "How much does it cost to sell?",
    a: "Listing on PropertyLoop is free for sellers. Your agent may charge a commission, which is agreed before listing.",
  },
  {
    q: "How are agents verified?",
    a: "Every agent goes through KYC verification via Smile Identity or Dojah before they can list properties on the platform.",
  },
  {
    q: "How long does it take to sell?",
    a: "The average time to sell on PropertyLoop is 45 days, but this varies by property type, location, and pricing.",
  },
  {
    q: "How do I screen buyers?",
    a: "Every PropertyLoop user is identity-verified. You'll see who you're talking to and can review their profile before accepting an offer.",
  },
  {
    q: "What if I'm not happy with my agent?",
    a: "You can request a new agent at any time. We'll reassign your property to another verified professional.",
  },
];

const platformStats = [
  {
    icon: <Home className="w-4 h-4" />,
    value: "2,400+",
    label: "Properties Sold",
  },
  {
    icon: <UserCheck className="w-4 h-4" />,
    value: "1,200+",
    label: "Verified Agents",
  },
  {
    icon: <Clock className="w-4 h-4" />,
    value: "45 days",
    label: "Avg. Time to Sell",
  },
  {
    icon: <TrendingUp className="w-4 h-4" />,
    value: "98%",
    label: "Seller Satisfaction",
  },
];

/* ─── Component ─── */

const Sell = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  const handleCardClick = () => {
    if (!isLoggedIn) {
      navigate("/onboarding");
      return;
    }
    navigate("/find-agent");
  };

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />

      <main className="w-full px-4 sm:px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-8">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">
              Sell Your Property
            </span>
          </div>

          {/* ─── 1. Hero ─── */}
          <div className="relative overflow-hidden rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] mb-20">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&h=600&fit=crop)",
              }}
            />
            <div className="absolute inset-0 bg-linear-to-r from-primary-dark/90 via-primary-dark/75 to-primary-dark/40" />
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5" />

            <div className="relative z-10 p-8 sm:p-10 lg:p-14">
              <h1 className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3.5rem] leading-[1.1] font-bold text-white tracking-tight">
                Sell Your Property
                <br />
                <span className="text-white/70">Through Trusted Agents</span>
              </h1>
              <p className="text-white/60 text-sm leading-relaxed mt-4 max-w-xl">
                On PropertyLoop, every sale is managed by a KYC-verified agent.
                No DIY listings. Just professional representation, transparent
                pricing, and verified buyers.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                {[
                  { value: "2,400+", label: "Properties Sold" },
                  { value: "1,200+", label: "Agents" },
                  { value: "45 days", label: "Avg. Time to Sell" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-sm"
                  >
                    <span className="font-heading font-bold text-white">
                      {s.value}
                    </span>
                    <span className="text-white/50">{s.label}</span>
                  </div>
                ))}
              </div>

              <a
                href="#valuation"
                className="mt-8 inline-flex items-center gap-2 h-12 px-8 rounded-full bg-white text-primary-dark text-sm font-bold hover:bg-white/90 transition-colors duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
              >
                Connect with an agent
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* ─── 2. How It Works ─── */}
          <section className="mb-20">
            <div className="text-center mb-10">
              <p className="text-primary text-sm font-medium tracking-wide uppercase mb-2">
                Simple Process
              </p>
              <h2 className="font-heading text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
                How Selling <span className="text-primary">Works</span>
              </h2>
              <p className="text-text-secondary text-sm mt-3 max-w-md mx-auto">
                From first contact to signed contract — in four steps
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 p-6"
                >
                  {/* Clipped number circle */}
                  <div className="w-16 h-16 bg-primary/10 rounded-full absolute -right-3 -top-3">
                    <span className="absolute bottom-4 left-5 font-heading font-bold text-primary text-lg">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                      {step.icon}
                    </div>
                    <h3 className="font-heading font-bold text-primary-dark text-lg mb-2">
                      {step.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {i < 3 && (
                    <ArrowRight className="hidden lg:block absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-5 h-5 text-border z-20" />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ─── 3. Why Sell With Us ─── */}
          <section className="mb-20">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
              <div>
                <p className="text-primary text-sm font-medium tracking-wide uppercase mb-2">
                  Platform Advantages
                </p>
                <h2 className="font-heading text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
                  Why Sell <span className="text-primary">With Us</span>
                </h2>
                <p className="text-text-secondary text-sm leading-relaxed mt-3 max-w-lg">
                  Every tool a seller needs — verified agents, verified
                  buyers, transparent pricing, and direct messaging.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="h-44 overflow-hidden rounded-t-[20px]">
                    <img
                      src={benefit.image}
                      alt={benefit.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Glass content panel */}
                  <div className="mx-3 mb-3 -mt-6 relative z-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl px-5 pt-4 pb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        {benefit.icon}
                      </div>
                      <h3 className="font-heading font-bold text-primary-dark text-[15px] leading-snug">
                        {benefit.title}
                      </h3>
                    </div>
                    <p className="text-text-secondary text-[13px] leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── 4. Featured Agents ─── */}
          <section className="mb-20">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
              <div>
                <p className="text-primary text-sm font-medium tracking-wide uppercase mb-2">
                  Agent-First Model
                </p>
                <h2 className="font-heading text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
                  Find Your <span className="text-primary">Selling Agent</span>
                </h2>
                <p className="text-text-secondary text-sm leading-relaxed mt-3 max-w-lg">
                  Every agent is KYC-verified. Choose the right professional to
                  represent your property and close the deal.
                </p>
              </div>
              <button className="shrink-0 h-10 px-6 rounded-full border border-border bg-white/80 backdrop-blur-sm text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                View all agents
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {agents.map((agent, i) => (
                <div
                  key={i}
                  onClick={handleCardClick}
                  className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  {/* Photo */}
                  <div className="h-52 overflow-hidden rounded-t-[20px] relative">
                    <img
                      src={agent.photo}
                      alt={agent.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-primary text-xs font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      KYC Verified
                    </span>
                  </div>

                  {/* Glass content panel */}
                  <div className="mx-3 mb-3 -mt-6 relative z-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl px-5 pt-4 pb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                    <h3 className="font-heading font-bold text-primary-dark text-[16px] leading-snug">
                      {agent.name}
                    </h3>
                    <p className="text-text-secondary text-xs mt-0.5">
                      {agent.agency} · {agent.location}
                    </p>

                    <div className="h-px bg-border-light mt-3 mb-3" />

                    <div className="flex items-center gap-4 text-text-secondary text-xs pr-8">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]" />
                        {agent.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Home className="w-3.5 h-3.5" />
                        {agent.listings} active
                      </span>
                      <span>{agent.sold} sold</span>
                    </div>
                  </div>

                  {/* Clipped arrow */}
                  <div className="w-12 h-12 bg-[#1a1a1a] rounded-full absolute -right-3 -bottom-3 z-20 group-hover:bg-primary transition-colors duration-300 flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── 5. Valuation Form ─── */}
          <section id="valuation" className="mb-20 scroll-mt-8">
            <div className="bg-white/60 backdrop-blur-sm border border-border-light rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-2 sm:p-3">
              <div className="relative overflow-hidden bg-white/80 backdrop-blur-md border border-white/40 rounded-[22px] shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/5" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-primary/5" />

                <div className="relative z-10 px-5 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-12 lg:py-14 flex flex-col lg:flex-row gap-10 lg:gap-16">
                  {/* Left — copy */}
                  <div className="flex-1 lg:max-w-md">
                    <p className="text-primary text-sm font-medium tracking-wide uppercase mb-2">
                      Free Property Valuation
                    </p>
                    <h2 className="font-heading text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
                      What's Your Property{" "}
                      <span className="text-primary">Worth?</span>
                    </h2>
                    <p className="text-text-secondary text-sm leading-relaxed mt-4">
                      Get a free, no-obligation valuation from a verified agent.
                      Share your property details and we'll connect you with the
                      right professional within 24 hours.
                    </p>

                    {/* Trust badges */}
                    <div className="flex flex-wrap gap-3 mt-8">
                      {["Free valuation", "No obligation", "24hr response"].map(
                        (badge) => (
                          <span
                            key={badge}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-white/40 text-text-secondary text-xs"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-primary" />
                            {badge}
                          </span>
                        ),
                      )}
                    </div>

                    {/* Stats */}
                    <div className="mt-10 pt-8 border-t border-border-light">
                      <div className="grid grid-cols-2 gap-3 sm:gap-5">
                        {platformStats.map((stat, i) => (
                          <div
                            key={i}
                            className="bg-white/60 backdrop-blur-sm border border-border-light rounded-2xl px-3 sm:px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                          >
                            <div className="flex items-center gap-2 text-text-secondary mb-1">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                {stat.icon}
                              </div>
                              <span className="text-[11px]">{stat.label}</span>
                            </div>
                            <p className="font-heading font-bold text-primary-dark text-lg">
                              {stat.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right — form */}
                  <div className="flex-1">
                    {submitted ? (
                      <div className="h-full flex flex-col items-center justify-center text-center bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] p-10 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                          <CheckCircle className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-heading font-bold text-primary-dark text-xl">
                          Request Submitted
                        </h3>
                        <p className="text-text-secondary text-sm mt-2 max-w-xs">
                          A verified agent will contact you within 24 hours to
                          discuss your property valuation.
                        </p>
                        <button
                          onClick={() => setSubmitted(false)}
                          className="mt-6 h-10 px-6 rounded-full border border-border-light bg-white/80 backdrop-blur-sm text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                        >
                          Submit another
                        </button>
                      </div>
                    ) : (
                      <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                        <h3 className="font-heading font-bold text-primary-dark text-base mb-5">
                          Property Details
                        </h3>
                        <div className="flex flex-col gap-3">
                          <input
                            type="text"
                            placeholder="Property address"
                            className="h-11 px-4 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                          />
                          <select className="h-11 px-4 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors appearance-none">
                            <option value="">Property type</option>
                            <option>Flat / Apartment</option>
                            <option>House</option>
                            <option>Land</option>
                            <option>Commercial</option>
                          </select>
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="number"
                              placeholder="Bedrooms"
                              className="h-11 px-4 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                            />
                            <input
                              type="number"
                              placeholder="Bathrooms"
                              className="h-11 px-4 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Estimated value (optional)"
                            className="h-11 px-4 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                          />

                          <div className="h-px bg-border-light my-1" />

                          <h3 className="font-heading font-bold text-primary-dark text-base">
                            Your Details
                          </h3>
                          <input
                            type="text"
                            placeholder="Full name"
                            className="h-11 px-4 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                          />
                          <input
                            type="tel"
                            placeholder="Phone number"
                            className="h-11 px-4 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                          />
                          <input
                            type="email"
                            placeholder="Email address"
                            className="h-11 px-4 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                          />

                          <button
                            onClick={() => setSubmitted(true)}
                            className="mt-2 w-full h-12 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors duration-300 inline-flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(31,111,67,0.3)]"
                          >
                            Get free valuation
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ─── 6. FAQ ─── */}
          <section className="mb-20">
            <div className="text-center mb-10">
              <p className="text-primary text-sm font-medium tracking-wide uppercase mb-2">
                Common Questions
              </p>
              <h2 className="font-heading text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
                Selling <span className="text-primary">FAQ</span>
              </h2>
              <p className="text-text-secondary text-sm mt-3 max-w-md mx-auto">
                Everything you need to know about selling on PropertyLoop
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 p-6"
                >
                  {/* Clipped number circle */}
                  <div className="w-16 h-16 bg-primary/10 rounded-full absolute -right-3 -top-3">
                    <span className="absolute bottom-4 left-5 font-heading font-bold text-primary text-lg">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-primary-dark text-[15px] pr-8 mb-3">
                    {faq.q}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sell;
