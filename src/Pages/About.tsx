import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle,
  ShieldCheck,
  TrendingUp,
  Lock,
  ClipboardList,
  Users,
  BarChart3,
  Wrench,
  Home,
  FileSignature,
  MapPin,
  Zap,
  Target,
  Globe,
  Heart,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";

/* ─── Data ─── */

const problems = [
  {
    problem: "Inflated Pricing",
    reality: "No price history; agents re-list at higher prices freely",
    solution: "Full price history on every listing",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    problem: "Weak Trust",
    reality: "Verification is a paid add-on; scams are widespread",
    solution: "KYC-verified agents by default",
    icon: <ShieldCheck className="w-5 h-5" />,
  },
  {
    problem: "No Transactions",
    reality: "Platforms generate leads then step aside",
    solution: "Offers, e-signing, escrow — all in-platform",
    icon: <FileSignature className="w-5 h-5" />,
  },
  {
    problem: "No Local Data",
    reality: "Zero neighbourhood-level insights on any Nigerian platform",
    solution: "Hyperlocal scores: power, flood, roads, schools, safety",
    icon: <MapPin className="w-5 h-5" />,
  },
  {
    problem: "Poor Agent Tools",
    reality: "No CRM, no analytics, no lead tracking",
    solution: "Full agent CRM with pipeline and per-listing analytics",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    problem: "No Post-Move Support",
    reality: "Users leave platform to find plumbers and electricians",
    solution: "Verified Service Vendors with escrow-protected payments",
    icon: <Wrench className="w-5 h-5" />,
  },
];

const differentiators = [
  {
    title: "The Service Loop",
    description:
      "Verified home service vendors — plumbers, electricians, builders — bookable and payable inside the platform. No more hunting for tradespeople after you move in.",
    icon: <Wrench className="w-6 h-6" />,
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop",
  },
  {
    title: "Service Escrow",
    description:
      "Paystack-powered escrow protects users on every vendor payment. Funds only release when you confirm the job is complete — no more paying upfront and hoping.",
    icon: <Lock className="w-6 h-6" />,
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
  },
  {
    title: "Property Logbook",
    description:
      "A permanent, verifiable digital maintenance history attached to every property ID on the platform. Know exactly what was repaired, when, and by whom.",
    icon: <ClipboardList className="w-6 h-6" />,
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=400&fit=crop",
  },
];

const values = [
  {
    title: "Transparency",
    description:
      "Full price histories, verified documents, and neighbourhood data on every listing. No hidden fees, no inflated prices.",
    icon: <Target className="w-5 h-5" />,
  },
  {
    title: "Trust",
    description:
      "Every agent and vendor is KYC-verified through Smile Identity before they can operate on the platform.",
    icon: <ShieldCheck className="w-5 h-5" />,
  },
  {
    title: "Innovation",
    description:
      "From AI-powered search to predictive pricing and commute-time filters — we're building the future of Nigerian real estate.",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    title: "Community",
    description:
      "Agents, vendors, and homeowners are all stakeholders. The platform grows when everyone succeeds.",
    icon: <Heart className="w-5 h-5" />,
  },
];

const timeline = [
  {
    phase: "Phase 1",
    period: "Foundation",
    description:
      "Core listings platform — Buy, Rent, Shortlet, and New Developments through verified agents. Map search, user accounts, and mobile-responsive frontend.",
  },
  {
    phase: "Phase 2",
    period: "Trust & Data",
    description:
      "Price history tracking, C of O verification, agent KYC, neighbourhood scorecards, saved searches with alerts, and verified vendor onboarding.",
  },
  {
    phase: "Phase 3",
    period: "Transactions & Tools",
    description:
      "Shortlet booking with Paystack, rental escrow, e-signing, agent CRM dashboard, Service Loop launch, and Service Escrow launch.",
  },
  {
    phase: "Phase 4",
    period: "Growth & Intelligence",
    description:
      "Property Logbook, AI natural language search, predictive pricing, market reports, and expansion to Abuja, Port Harcourt, Kano, and Ibadan.",
  },
];

const stats = [
  { value: "8,050+", label: "Properties Listed" },
  { value: "1,200+", label: "Verified Agents" },
  { value: "15,000+", label: "Deals Closed" },
  { value: "5", label: "Cities" },
];

/* ─── Component ─── */

const About = () => {
  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />

      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-8">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">About Us</span>
          </div>

          {/* ─── Hero ─── */}
          <div className="relative overflow-hidden rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] mb-20">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&h=600&fit=crop)",
              }}
            />
            <div className="absolute inset-0 bg-linear-to-r from-primary-dark/90 via-primary-dark/75 to-primary-dark/40" />
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5" />

            <div className="relative z-10 p-8 sm:p-10 lg:p-14">
              <p className="text-white/50 text-sm font-medium tracking-wide uppercase mb-3">
                About PropertyLoop
              </p>
              <h1 className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3.5rem] leading-[1.1] font-bold text-white tracking-tight max-w-2xl">
                Closing the loop on{" "}
                <span className="text-white/70">Nigerian real estate</span>
              </h1>
              <p className="text-white/60 text-sm leading-relaxed mt-4 max-w-xl">
                From first search to signed contract — and everything that
                happens after the keys are handed over. PropertyLoop is the
                first platform built to handle the entire property journey.
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                {stats.map((s) => (
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

              <Link
                to="/onboarding"
                className="mt-8 inline-flex items-center gap-2 h-12 px-8 rounded-full bg-white text-primary-dark text-sm font-bold hover:bg-white/90 transition-colors duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.15)]"
              >
                Join PropertyLoop
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* ─── Mission ─── */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <p className="text-primary text-sm font-medium tracking-wide uppercase mb-2">
                Our Mission
              </p>
              <h2 className="font-heading text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
                Built for <span className="text-primary">Nigeria</span>
              </h2>
              <p className="text-text-secondary text-sm mt-3 max-w-lg mx-auto leading-relaxed">
                Unlike existing platforms that stop at listing and lead
                generation, PropertyLoop closes the entire loop — from property
                discovery to signed tenancy agreement, and beyond into ongoing
                home management.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 bg-white/60 backdrop-blur-sm border border-border-light rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-8 sm:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-primary-dark text-lg">
                      The Nigerian Problem
                    </h3>
                    <p className="text-text-secondary text-xs">
                      What we're fixing
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  {problems.map((item, i) => (
                    <div
                      key={i}
                      className="group bg-white/80 backdrop-blur-sm border border-border-light rounded-2xl p-4 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-heading font-bold text-primary-dark text-sm">
                            {item.problem}
                          </h4>
                          <p className="text-text-subtle text-xs mt-0.5">
                            {item.reality}
                          </p>
                          <p className="text-primary text-xs font-medium mt-1.5 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {item.solution}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Values */}
              <div className="lg:w-95 shrink-0 flex flex-col gap-5">
                <div className="bg-white/60 backdrop-blur-sm border border-border-light rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-8">
                  <h3 className="font-heading font-bold text-primary-dark text-lg mb-5">
                    Our Values
                  </h3>
                  <div className="flex flex-col gap-4">
                    {values.map((v, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          {v.icon}
                        </div>
                        <div>
                          <h4 className="font-heading font-semibold text-primary-dark text-sm">
                            {v.title}
                          </h4>
                          <p className="text-text-secondary text-xs mt-0.5 leading-relaxed">
                            {v.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick stat card */}
                <div className="bg-primary rounded-[24px] p-8 text-white">
                  <h3 className="font-heading font-bold text-lg mb-2">
                    Agent-First Model
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    PropertyLoop does not accept listings from individual
                    landlords. All listings are posted and managed by
                    KYC-verified real estate agents — raising listing quality
                    and making agents core platform stakeholders.
                  </p>
                  <Link
                    to="/find-agent"
                    className="mt-5 inline-flex items-center gap-2 h-10 px-6 rounded-full bg-white text-primary-dark text-sm font-bold hover:bg-white/90 transition-colors"
                  >
                    Find an agent
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ─── What Makes Us Different ─── */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <p className="text-primary text-sm font-medium tracking-wide uppercase mb-2">
                What Makes Us Different
              </p>
              <h2 className="font-heading text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
                Three things{" "}
                <span className="text-primary">no competitor has</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {differentiators.map((item, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="h-48 overflow-hidden rounded-t-[20px]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Glass content */}
                  <div className="mx-3 mb-3 -mt-6 relative z-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl px-5 pt-4 pb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        {item.icon}
                      </div>
                      <h3 className="font-heading font-bold text-primary-dark text-[16px]">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="w-20 h-20 bg-[#1a1a1a] rounded-full absolute -right-5 -bottom-5 z-20 group-hover:bg-primary transition-colors duration-300">
                    <ArrowUpRight className="absolute top-4 left-5 w-5 h-5 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Roadmap ─── */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <p className="text-primary text-sm font-medium tracking-wide uppercase mb-2">
                Our Roadmap
              </p>
              <h2 className="font-heading text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
                Building the <span className="text-primary">future</span>
              </h2>
              <p className="text-text-secondary text-sm mt-3 max-w-md mx-auto">
                A phased approach to transforming Nigerian real estate
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {timeline.map((item, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 p-6"
                >
                  {/* Phase number */}
                  <div className="w-16 h-16 bg-primary/10 rounded-full absolute -right-3 -top-3">
                    <span className="absolute bottom-4 left-5 font-heading font-bold text-primary text-lg">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    {i === 0 && <Home className="w-5 h-5" />}
                    {i === 1 && <ShieldCheck className="w-5 h-5" />}
                    {i === 2 && <FileSignature className="w-5 h-5" />}
                    {i === 3 && <Zap className="w-5 h-5" />}
                  </div>

                  <h3 className="font-heading font-bold text-primary-dark text-[15px] mb-1">
                    {item.phase}
                  </h3>
                  <p className="text-primary text-xs font-medium mb-2">
                    {item.period}
                  </p>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Platform stats ─── */}
          <section className="mb-20">
            <div className="bg-primary rounded-[28px] p-8 sm:p-12 lg:p-16">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((s, i) => (
                  <div key={i} className="text-center">
                    <p className="font-heading font-bold text-white text-[2rem] sm:text-[2.5rem] lg:text-[3rem] leading-none">
                      {s.value}
                    </p>
                    <p className="text-white/60 text-sm mt-2">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── CTA ─── */}
          <section className="mb-20">
            <div className="bg-white/60 backdrop-blur-sm border border-border-light rounded-[20px] px-8 py-10 sm:px-12 text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h2 className="font-heading font-bold text-primary-dark text-xl sm:text-2xl">
                Ready to join PropertyLoop?
              </h2>
              <p className="text-text-secondary text-sm mt-2 max-w-md mx-auto">
                Whether you're buying, renting, selling, or offering services —
                PropertyLoop is built for you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                <Link
                  to="/onboarding"
                  className="h-11 px-8 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors duration-300 inline-flex items-center gap-2 shadow-[0_4px_16px_rgba(31,111,67,0.3)]"
                >
                  Get started
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/find-agent"
                  className="h-11 px-8 rounded-full border border-border-light bg-white/80 backdrop-blur-sm text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 inline-flex items-center gap-2"
                >
                  Find an agent
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
