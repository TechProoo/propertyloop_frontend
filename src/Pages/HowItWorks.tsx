import { Link } from "react-router-dom";
import {
  Search,
  UserCheck,
  CalendarCheck,
  Shield,
  CheckCircle,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Lock,
  CreditCard,
  Handshake,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";

const steps = [
  {
    icon: <Search className="w-5 h-5" />,
    title: "Find a Service",
    description:
      "Browse verified vendors by category — plumbing, electrical, building, cleaning, and more. Filter by location, rating, and price.",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
  },
  {
    icon: <UserCheck className="w-5 h-5" />,
    title: "Choose a Verified Vendor",
    description:
      "Every vendor on PropertyLoop is KYC-verified before they can accept jobs. Check their rating, job history, and reviews.",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop",
  },
  {
    icon: <CalendarCheck className="w-5 h-5" />,
    title: "Book & Pay Securely",
    description:
      "Schedule the job and pay through our Paystack-powered escrow. Your money is held securely — the vendor never receives it upfront.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Escrow Protects You",
    description:
      "While the job is in progress, your funds sit safely in escrow. No surprises, no risk. If there's an issue, raise a dispute.",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
  },
  {
    icon: <CheckCircle className="w-5 h-5" />,
    title: "Confirm & Release",
    description:
      "Once the job is complete and you're satisfied, confirm completion. Only then are the funds released to the vendor.",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
  },
  {
    icon: <BookOpen className="w-5 h-5" />,
    title: "Logged to Property Logbook",
    description:
      "Every completed service is automatically recorded against your property's permanent logbook — building verifiable history.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
  },
];

const escrowFlow = [
  {
    icon: <CreditCard className="w-6 h-6" />,
    label: "You Pay",
    sub: "Funds deposited to escrow",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    label: "Money Held",
    sub: "Vendor begins work",
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    label: "You Confirm",
    sub: "Job completed to satisfaction",
  },
  {
    icon: <Handshake className="w-6 h-6" />,
    label: "Funds Released",
    sub: "Vendor gets paid securely",
  },
];

const faqs = [
  {
    q: "What happens if the vendor doesn't finish the job?",
    a: "Your money stays in escrow. You can raise a dispute and our team will mediate. Funds are never released until you confirm satisfaction.",
  },
  {
    q: "How are vendors verified?",
    a: "Every vendor goes through KYC verification via Smile Identity or Dojah before they can accept jobs on the platform.",
  },
  {
    q: "Is there a fee for using escrow?",
    a: "A small service fee is deducted from the vendor's payout when funds are released. As a customer, you pay the agreed price — nothing extra.",
  },
  {
    q: "Can I see a vendor's past work?",
    a: "Yes. Every vendor profile shows their rating, number of completed jobs, and reviews from verified customers.",
  },
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />

      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-16 ">
        <div className="max-w-7xl mx-auto">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-text-secondary text-sm hover:text-primary transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          {/* ─── Hero ─── */}
          <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-8 sm:p-12 lg:p-16 mb-20">
            {/* Decorative circles */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/5" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-primary/5" />

            <div className="relative z-10 max-w-2xl">
              <p className="text-primary text-sm font-medium tracking-wide uppercase mb-3">
                Service Loop
              </p>
              <h1 className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3.5rem] leading-[1.1] font-bold text-primary-dark tracking-tight">
                How Escrow <span className="text-primary">Protects You</span>
              </h1>
              <p className="text-text-secondary text-base leading-relaxed mt-5 max-w-xl">
                Every vendor payment on PropertyLoop goes through escrow. Your
                money is held securely by Paystack and only released when you
                confirm the job is done.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                {[
                  { icon: <Shield className="w-4 h-4 text-primary" />, text: "Escrow protected" },
                  { icon: <UserCheck className="w-4 h-4 text-primary" />, text: "KYC-verified vendors" },
                  { icon: <BookOpen className="w-4 h-4 text-primary" />, text: "Auto-logged history" },
                ].map((badge, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-text-secondary bg-white/50 backdrop-blur-sm border border-white/40 rounded-full px-4 py-2"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                      {badge.icon}
                    </div>
                    {badge.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── Escrow Flow ─── */}
          <div className="mb-20">
            <div className="text-center mb-10 bg-white/50 backdrop-blur-sm border border-white/40 rounded-[20px] py-6 px-8 mx-auto max-w-md shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <h2 className="font-heading font-bold text-primary-dark text-2xl sm:text-3xl">
                The Escrow Flow
              </h2>
              <p className="text-text-secondary text-sm mt-2">
                Your money is safe at every step
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {escrowFlow.map((item, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 p-6"
                >
                  {/* Step number — clipped circle top-right */}
                  <div className="w-16 h-16 bg-primary/10 rounded-full absolute -right-3 -top-3">
                    <span className="absolute bottom-4 left-5 font-heading font-bold text-primary text-lg">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                      {item.icon}
                    </div>
                    <h3 className="font-heading font-bold text-primary-dark text-lg mb-1">
                      {item.label}
                    </h3>
                    <p className="text-text-secondary text-sm">{item.sub}</p>
                  </div>

                  {i < 3 && (
                    <ArrowRight className="hidden lg:block absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-5 h-5 text-border z-20" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ─── Step-by-Step Cards ─── */}
          <div className="mb-20">
            <div className="text-center mb-10 bg-white/50 backdrop-blur-sm border border-white/40 rounded-[20px] py-6 px-8 mx-auto max-w-md shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <h2 className="font-heading font-bold text-primary-dark text-2xl sm:text-3xl">
                Step by Step
              </h2>
              <p className="text-text-secondary text-sm mt-2">
                From finding a vendor to logging the completed job
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="h-44 overflow-hidden rounded-t-[20px]">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Step badge */}
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-primary-dark text-xs font-medium">
                      Step {i + 1}
                    </span>
                  </div>

                  {/* Glass content panel */}
                  <div className="mx-3 mb-3 -mt-6 relative z-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl px-5 pt-4 pb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        {step.icon}
                      </div>
                      <h3 className="font-heading font-bold text-primary-dark text-[15px] leading-snug">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-text-secondary text-[13px] leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* ─── FAQs ─── */}
          <div className="mb-20">
            <div className="text-center mb-10 bg-white/50 backdrop-blur-sm border border-white/40 rounded-[20px] py-6 px-8 mx-auto max-w-md shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <h2 className="font-heading font-bold text-primary-dark text-2xl sm:text-3xl">
                Common Questions
              </h2>
              <p className="text-text-secondary text-sm mt-2">
                Everything you need to know about our escrow service
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 p-6"
                >
                  {/* Q number — clipped circle top-right */}
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
          </div>

          {/* ─── Bottom CTA ─── */}
          <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm border border-border-light rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-8 sm:p-12">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/5" />
            <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full bg-primary/5" />

            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-heading font-bold text-primary-dark text-xl sm:text-2xl">
                  Ready to hire a verified vendor?
                </h3>
                <p className="text-text-secondary text-sm mt-2 max-w-lg">
                  Every payment is escrow-protected. Browse our network of
                  KYC-verified plumbers, electricians, builders, and more.
                </p>
              </div>
              <Link
                to="/"
                className="shrink-0 h-12 px-8 rounded-full bg-primary text-white font-medium hover:bg-primary-dark transition-colors duration-300 inline-flex items-center gap-2"
              >
                Browse vendors
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HowItWorks;
