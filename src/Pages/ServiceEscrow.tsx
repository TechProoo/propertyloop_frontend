import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Shield,
  ShieldCheck,
  Wrench,
  CheckCircle,
  Clock,
  ClipboardList,
  Star,
  AlertTriangle,
  DollarSign,
  Lock,
  Banknote,
  UserCheck,
  ThumbsUp,
  FileCheck,
  MapPin,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";

const ease = [0.23, 1, 0.32, 1] as const;

/* ─── Flow Steps ─── */

const flowSteps = [
  {
    id: "select",
    title: "Select a Vendor",
    subtitle: "Choose a verified service professional",
    icon: <UserCheck className="w-6 h-6" />,
    description:
      "Browse the Service Loop and choose a KYC-verified vendor for your job. All vendors have been identity-verified through Smile Identity before they can accept jobs.",
  },
  {
    id: "book",
    title: "Book & Describe Job",
    subtitle: "Tell the vendor what you need",
    icon: <ClipboardList className="w-6 h-6" />,
    description:
      "Describe the work needed, agree on a price with the vendor, and select a date. The agreed price becomes the escrow amount — no surprise charges.",
  },
  {
    id: "pay",
    title: "Pay into Escrow",
    subtitle: "Funds held securely by Paystack",
    icon: <Lock className="w-6 h-6" />,
    description:
      "Your payment is deposited into a Paystack escrow account. The vendor can see the funds are secured but cannot access them yet. You're protected from the moment you pay.",
  },
  {
    id: "work",
    title: "Vendor Completes Job",
    subtitle: "Work is carried out as agreed",
    icon: <Wrench className="w-6 h-6" />,
    description:
      "The vendor carries out the work as described. Once finished, they submit a completion request through the platform with photos of the completed job.",
  },
  {
    id: "confirm",
    title: "Confirm Completion",
    subtitle: "You approve or raise a dispute",
    icon: <ThumbsUp className="w-6 h-6" />,
    description:
      "Review the completed work. If you're satisfied, confirm completion. If there's an issue, raise a dispute and PropertyLoop mediates between you and the vendor.",
  },
  {
    id: "release",
    title: "Funds Released",
    subtitle: "Vendor gets paid, job logged",
    icon: <Banknote className="w-6 h-6" />,
    description:
      "Paystack releases the funds to the vendor minus the PropertyLoop service fee. The completed service is automatically recorded in the Property Logbook as a verified entry.",
  },
];

/* ─── Mock Transaction ─── */

const mockTransaction = {
  vendor: {
    name: "Chinedu Okonkwo",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    category: "Plumbing",
    rating: 4.9,
    jobs: 234,
    location: "Lekki, Lagos",
    verified: true,
  },
  job: {
    title: "Kitchen Sink Replacement",
    description:
      "Replace existing kitchen sink with a new stainless steel double-bowl sink, including pipe rerouting and fitting.",
    property: "4-Bed Villa, Lekki Phase 1",
    propertyId: "PL-00482",
    date: "April 5, 2026",
    time: "10:00 AM",
  },
  payment: {
    amount: "₦45,000",
    serviceFee: "₦4,500",
    vendorReceives: "₦40,500",
    method: "Paystack",
    escrowId: "ESC-20260405-0012",
  },
};

/* ─── Component ─── */

const ServiceEscrow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [simulating, setSimulating] = useState(false);
  const [completed, setCompleted] = useState(false);

  const currentStep = flowSteps[activeStep];

  const goNext = () => {
    if (activeStep < flowSteps.length - 1) {
      setActiveStep((p) => p + 1);
    } else {
      setCompleted(true);
    }
  };

  const goBack = () => {
    if (activeStep > 0) setActiveStep((p) => p - 1);
  };

  const simulateFlow = () => {
    setSimulating(true);
    setActiveStep(0);
    setCompleted(false);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= flowSteps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setCompleted(true);
          setSimulating(false);
        }, 1200);
      } else {
        setActiveStep(step);
      }
    }, 1800);
  };

  const reset = () => {
    setActiveStep(0);
    setCompleted(false);
    setSimulating(false);
  };

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
            <Link
              to="/services"
              className="hover:text-primary transition-colors"
            >
              Service Loop
            </Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">
              Escrow Payment
            </span>
          </div>

          {/* ─── Hero ─── */}
          <div className="relative overflow-hidden rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] mb-10">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&h=600&fit=crop)",
              }}
            />
            <div className="absolute inset-0 bg-linear-to-r from-primary-dark/90 via-primary-dark/75 to-primary-dark/40" />
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5" />

            <div className="relative z-10 p-8 sm:p-10 lg:p-14">
              <h1 className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3.5rem] leading-[1.1] font-bold text-white tracking-tight">
                Service <span className="text-white/70">Escrow</span>
              </h1>
              <p className="text-white/60 text-sm leading-relaxed mt-3 max-w-xl">
                Every vendor payment on PropertyLoop is protected by
                Paystack-powered escrow. Funds are only released when you
                confirm the job is complete.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                {[
                  { value: "Paystack", label: "Powered" },
                  { value: "100%", label: "Protected" },
                  { value: "Auto", label: "Logbook Entry" },
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
              <button
                onClick={simulateFlow}
                disabled={simulating}
                className="mt-8 inline-flex items-center gap-2 h-12 px-8 rounded-full bg-white text-primary-dark text-sm font-bold hover:bg-white/90 transition-colors duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.15)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {simulating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-dark/30 border-t-primary-dark rounded-full animate-spin" />
                    Simulating...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Simulate Escrow Flow
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ─── Step Progress Bar ─── */}
          <div className="mb-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-primary-dark text-sm">
                Escrow Flow
              </h3>
              <span className="text-text-secondary text-xs">
                Step {activeStep + 1} of {flowSteps.length}
              </span>
            </div>

            {/* Progress circles */}
            <div className="flex items-center gap-1">
              {flowSteps.map((step, i) => (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    onClick={() => !simulating && setActiveStep(i)}
                    disabled={simulating}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-heading font-semibold transition-all duration-500 shrink-0 ${
                      completed || i < activeStep
                        ? "bg-primary text-white shadow-lg shadow-glow/40"
                        : i === activeStep
                          ? "bg-primary text-white shadow-lg shadow-glow/40 ring-4 ring-primary/20"
                          : "bg-white/60 backdrop-blur-sm text-text-secondary border border-border-light"
                    }`}
                  >
                    {completed || i < activeStep ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      i + 1
                    )}
                  </button>
                  {i < flowSteps.length - 1 && (
                    <div
                      className={`flex-1 h-1 rounded-full mx-1 transition-all duration-500 ${
                        completed || i < activeStep
                          ? "bg-primary"
                          : "bg-border-light"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step labels (desktop) */}
            <div className="hidden lg:flex items-center gap-1 mt-2">
              {flowSteps.map((step, i) => (
                <div key={step.id} className="flex items-center flex-1">
                  <span
                    className={`text-[10px] w-10 text-center shrink-0 ${
                      i <= activeStep || completed
                        ? "text-primary font-medium"
                        : "text-text-subtle"
                    }`}
                  >
                    {step.title.split(" ")[0]}
                  </span>
                  {i < flowSteps.length - 1 && <div className="flex-1" />}
                </div>
              ))}
            </div>
          </div>

          {/* ─── Main Content ─── */}
          <div className="flex flex-col lg:flex-row gap-8 mb-20">
            {/* Left — Active Step Detail */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                {completed ? (
                  /* ─── Completed State ─── */
                  <motion.div
                    key="completed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease }}
                    className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-8 sm:p-10 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: 0.2,
                      }}
                      className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-6 shadow-[0_8px_32px_rgba(31,111,67,0.3)]"
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>

                    <h2 className="font-heading font-bold text-primary-dark text-2xl">
                      Escrow Complete!
                    </h2>
                    <p className="text-text-secondary text-sm mt-2 max-w-md mx-auto">
                      The payment has been released to the vendor and the
                      service has been auto-logged to the Property Logbook.
                    </p>

                    {/* Transaction summary */}
                    <div className="bg-white/60 border border-border-light rounded-2xl p-5 mt-6 text-left max-w-sm mx-auto">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-text-secondary text-sm">
                            Amount Paid
                          </span>
                          <span className="font-heading font-bold text-primary-dark">
                            {mockTransaction.payment.amount}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-text-secondary text-sm">
                            Service Fee (10%)
                          </span>
                          <span className="text-text-secondary text-sm">
                            {mockTransaction.payment.serviceFee}
                          </span>
                        </div>
                        <div className="h-px bg-border-light" />
                        <div className="flex items-center justify-between">
                          <span className="text-text-secondary text-sm">
                            Vendor Received
                          </span>
                          <span className="font-heading font-bold text-primary">
                            {mockTransaction.payment.vendorReceives}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4 text-xs text-primary">
                        <FileCheck className="w-3.5 h-3.5" />
                        Logged to Property Logbook (
                        {mockTransaction.job.propertyId})
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                      <button
                        onClick={reset}
                        className="h-10 px-6 rounded-full border border-border-light bg-white/80 text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                      >
                        Run again
                      </button>
                      <Link
                        to="/services"
                        className="h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
                      >
                        Browse vendors
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  /* ─── Active Step Card ─── */
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.4, ease }}
                    className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8"
                  >
                    {/* Step badge */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        {currentStep.icon}
                      </div>
                      <div>
                        <p className="text-primary text-xs font-medium">
                          Step {activeStep + 1} of {flowSteps.length}
                        </p>
                        <h2 className="font-heading font-bold text-primary-dark text-xl">
                          {currentStep.title}
                        </h2>
                      </div>
                    </div>

                    <p className="text-text-secondary text-sm leading-relaxed mb-6">
                      {currentStep.description}
                    </p>

                    {/* Step-specific UI */}
                    {activeStep === 0 && (
                      /* Vendor card */
                      <div className="bg-white/60 border border-border-light rounded-2xl p-5">
                        <div className="flex items-center gap-4">
                          <img
                            src={mockTransaction.vendor.avatar}
                            alt={mockTransaction.vendor.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-heading font-bold text-primary-dark text-sm">
                                {mockTransaction.vendor.name}
                              </span>
                              <CheckCircle className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <p className="text-text-secondary text-xs">
                              {mockTransaction.vendor.category} ·{" "}
                              {mockTransaction.vendor.location}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-text-secondary mt-1">
                              <span className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-[#F5A623] fill-[#F5A623]" />
                                {mockTransaction.vendor.rating}
                              </span>
                              <span>
                                {mockTransaction.vendor.jobs} jobs completed
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeStep === 1 && (
                      /* Job details */
                      <div className="bg-white/60 border border-border-light rounded-2xl p-5">
                        <h4 className="font-heading font-bold text-primary-dark text-sm">
                          {mockTransaction.job.title}
                        </h4>
                        <p className="text-text-secondary text-xs mt-1 leading-relaxed">
                          {mockTransaction.job.description}
                        </p>
                        <div className="h-px bg-border-light my-3" />
                        <div className="flex flex-col gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-primary" />
                            <span className="text-text-secondary">
                              {mockTransaction.job.property}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            <span className="text-text-secondary">
                              {mockTransaction.job.date} at{" "}
                              {mockTransaction.job.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-3.5 h-3.5 text-primary" />
                            <span className="font-heading font-bold text-primary-dark">
                              Agreed: {mockTransaction.payment.amount}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeStep === 2 && (
                      /* Escrow payment */
                      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Lock className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-heading font-bold text-primary-dark text-sm">
                              Escrow Secured
                            </p>
                            <p className="text-text-secondary text-xs">
                              ID: {mockTransaction.payment.escrowId}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-center justify-between bg-white/60 rounded-xl px-4 py-3">
                            <span className="text-text-secondary text-sm">
                              Amount in Escrow
                            </span>
                            <span className="font-heading font-bold text-primary-dark text-lg">
                              {mockTransaction.payment.amount}
                            </span>
                          </div>
                          <div className="flex items-center justify-between bg-white/60 rounded-xl px-4 py-3">
                            <span className="text-text-secondary text-sm">
                              Payment Method
                            </span>
                            <span className="flex items-center gap-1.5 font-medium text-primary-dark text-sm">
                              <CreditCard className="w-4 h-4 text-primary" />
                              {mockTransaction.payment.method}
                            </span>
                          </div>
                          <div className="flex items-center justify-between bg-white/60 rounded-xl px-4 py-3">
                            <span className="text-text-secondary text-sm">
                              Vendor Status
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-[#FFF8ED] text-[#F5A623] text-xs font-medium">
                              Funds Locked
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeStep === 3 && (
                      /* Work in progress */
                      <div className="bg-white/60 border border-border-light rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-[#FFF8ED] flex items-center justify-center text-[#F5A623]">
                            <Wrench className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-heading font-bold text-primary-dark text-sm">
                              Work in Progress
                            </p>
                            <p className="text-text-secondary text-xs">
                              {mockTransaction.vendor.name} is on-site
                            </p>
                          </div>
                        </div>
                        <div className="w-full h-2 rounded-full bg-border-light overflow-hidden">
                          <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "75%" }}
                            transition={{ duration: 1.5, ease }}
                            className="h-full rounded-full bg-primary"
                          />
                        </div>
                        <p className="text-text-subtle text-xs mt-2 text-center">
                          Vendor will submit completion request when done
                        </p>
                      </div>
                    )}

                    {activeStep === 4 && (
                      <div className="flex flex-col gap-3">
                        <button className="w-full flex items-center gap-4 bg-primary/5 border border-primary/20 rounded-2xl p-5 hover:bg-primary/10 transition-colors text-left">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <ThumbsUp className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-heading font-bold text-primary-dark text-sm">
                              Confirm Completion
                            </p>
                            <p className="text-text-secondary text-xs">
                              Job was done satisfactorily — release payment
                            </p>
                          </div>
                        </button>
                        <button className="w-full flex items-center gap-4 bg-red-50/50 border border-red-200 rounded-2xl p-5 hover:bg-red-50 transition-colors text-left">
                          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-400">
                            <AlertTriangle className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-heading font-bold text-primary-dark text-sm">
                              Raise a Dispute
                            </p>
                            <p className="text-text-secondary text-xs">
                              Something isn't right — PropertyLoop will mediate
                            </p>
                          </div>
                        </button>
                      </div>
                    )}

                    {activeStep === 5 && (
                      /* Release */
                      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <span className="text-text-secondary text-sm">
                              Total Paid
                            </span>
                            <span className="font-heading font-bold text-primary-dark">
                              {mockTransaction.payment.amount}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-text-secondary text-sm">
                              Service Fee (10%)
                            </span>
                            <span className="text-text-secondary text-sm">
                              -{mockTransaction.payment.serviceFee}
                            </span>
                          </div>
                          <div className="h-px bg-primary/20" />
                          <div className="flex items-center justify-between">
                            <span className="font-heading font-bold text-primary-dark text-sm">
                              Vendor Receives
                            </span>
                            <span className="font-heading font-bold text-primary text-lg">
                              {mockTransaction.payment.vendorReceives}
                            </span>
                          </div>
                          <div className="h-px bg-primary/20" />
                          <div className="flex items-center gap-2 text-xs text-primary">
                            <ClipboardList className="w-3.5 h-3.5" />
                            Auto-logged to Property Logbook (
                            {mockTransaction.job.propertyId})
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-6">
                      <button
                        onClick={goBack}
                        disabled={activeStep === 0 || simulating}
                        className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </button>
                      <motion.button
                        onClick={goNext}
                        disabled={simulating}
                        whileHover={!simulating ? { scale: 1.03 } : {}}
                        whileTap={!simulating ? { scale: 0.98 } : {}}
                        className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-primary text-white font-heading font-semibold text-sm shadow-lg shadow-glow/40 hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {activeStep === flowSteps.length - 1
                          ? "Complete"
                          : "Next Step"}
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right — Transaction Summary */}
            <div className="lg:w-90 shrink-0 flex flex-col gap-6">
              {/* Transaction card */}
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6">
                <h3 className="font-heading font-bold text-primary-dark text-sm mb-4">
                  Transaction Details
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={mockTransaction.vendor.avatar}
                    alt={mockTransaction.vendor.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <p className="font-heading font-semibold text-primary-dark text-sm">
                      {mockTransaction.vendor.name}
                    </p>
                    <p className="text-text-secondary text-xs">
                      {mockTransaction.vendor.category}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Job</span>
                    <span className="text-primary-dark font-medium text-right text-xs max-w-45">
                      {mockTransaction.job.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Property</span>
                    <span className="text-primary-dark text-xs">
                      {mockTransaction.job.property}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Date</span>
                    <span className="text-primary-dark text-xs">
                      {mockTransaction.job.date}
                    </span>
                  </div>
                  <div className="h-px bg-border-light" />
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Amount</span>
                    <span className="font-heading font-bold text-primary-dark">
                      {mockTransaction.payment.amount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Escrow ID</span>
                    <span className="text-text-subtle text-xs">
                      {mockTransaction.payment.escrowId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Escrow status */}
              <div
                className={`rounded-[20px] p-6 transition-all duration-500 ${
                  completed
                    ? "bg-primary text-white"
                    : "bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
                }`}
              >
                <h3
                  className={`font-heading font-bold text-sm mb-3 ${
                    completed ? "text-white" : "text-primary-dark"
                  }`}
                >
                  Escrow Status
                </h3>
                <div className="flex flex-col gap-2">
                  {flowSteps.map((step, i) => (
                    <div
                      key={step.id}
                      className={`flex items-center gap-2.5 text-xs transition-all duration-300 ${
                        completed || i <= activeStep
                          ? completed
                            ? "text-white"
                            : "text-primary-dark"
                          : completed
                            ? "text-white/40"
                            : "text-text-subtle"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                          completed || i < activeStep
                            ? completed
                              ? "bg-white/20"
                              : "bg-primary text-white"
                            : i === activeStep
                              ? completed
                                ? "bg-white/20"
                                : "bg-primary/20 text-primary"
                              : completed
                                ? "bg-white/10"
                                : "bg-border-light"
                        }`}
                      >
                        {completed || i < activeStep ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : i === activeStep ? (
                          <div
                            className={`w-2 h-2 rounded-full ${
                              completed ? "bg-white" : "bg-primary"
                            }`}
                          />
                        ) : null}
                      </div>
                      <span className="font-medium">{step.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* How it protects you */}
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6">
                <h3 className="font-heading font-bold text-primary-dark text-sm mb-4">
                  How Escrow Protects You
                </h3>
                <div className="flex flex-col gap-3">
                  {[
                    {
                      icon: <Lock className="w-4 h-4" />,
                      text: "Funds are locked until you confirm the job is done",
                    },
                    {
                      icon: <ShieldCheck className="w-4 h-4" />,
                      text: "All vendors are KYC-verified before accepting jobs",
                    },
                    {
                      icon: <AlertTriangle className="w-4 h-4" />,
                      text: "Disputes are mediated by PropertyLoop support",
                    },
                    {
                      icon: <ClipboardList className="w-4 h-4" />,
                      text: "Every job is auto-logged to the Property Logbook",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                        {item.icon}
                      </div>
                      <p className="text-text-secondary text-xs leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceEscrow;
