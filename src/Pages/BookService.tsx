import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  MapPin,
  Star,
  Phone,
  MessageCircle,
  CheckCircle,
  Shield,
  ShieldCheck,
  Lock,
  CreditCard,
  Clock,
  Calendar,
  ClipboardList,
  Wrench,
  Send,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { getVendorById } from "../data/vendors";
import { getConversation, saveConversation, addMessage, type ChatMessage } from "../data/chat";

const ease = [0.23, 1, 0.32, 1] as const;

const steps = ["details", "review", "payment", "confirmed"] as const;
type Step = (typeof steps)[number];

const stepLabels: Record<Step, string> = {
  details: "Job Details",
  review: "Review & Price",
  payment: "Payment",
  confirmed: "Confirmed",
};

const BookService = () => {
  const { id } = useParams<{ id: string }>();
  const vendor = getVendorById(id || "");
  const [currentStep, setCurrentStep] = useState<Step>("details");
  const [processing, setProcessing] = useState(false);

  // Form state
  const [jobDescription, setJobDescription] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("10:00");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [agreedPrice, setAgreedPrice] = useState("");

  // Mini chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const convoId = `vendor-${id}`;

  // Initialize chat from localStorage or create new
  useEffect(() => {
    if (!vendor) return;
    const existing = getConversation(convoId);
    if (existing) {
      setChatMessages(existing.messages);
    } else {
      const initial: ChatMessage[] = [
        { sender: "them", text: `Hi! I'm ${vendor.name}. How can I help you today?`, time: "Just now" },
      ];
      saveConversation({
        id: convoId,
        name: vendor.name,
        avatar: vendor.avatar,
        role: "Vendor",
        phone: vendor.phone,
        messages: initial,
      });
      setChatMessages(initial);
    }
  }, [vendor, convoId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleChatSend = () => {
    if (!chatInput.trim() || !vendor) return;
    const msg: ChatMessage = { sender: "you", text: chatInput.trim(), time: "Just now" };
    addMessage(convoId, msg);
    setChatMessages((prev) => [...prev, msg]);
    setChatInput("");
    // Simulate vendor reply after 1.5s
    setTimeout(() => {
      const replies = [
        "Sure, I can help with that! Let me check my schedule.",
        "No problem. I'll bring all the necessary tools and materials.",
        "I usually charge based on the scope of work. Can you describe the job?",
        "Yes, I'm available. Let's discuss the details.",
        "Great! I'll give you a fair quote once I see the work needed.",
      ];
      const reply: ChatMessage = { sender: "them", text: replies[Math.floor(Math.random() * replies.length)], time: "Just now" };
      addMessage(convoId, reply);
      setChatMessages((prev) => [...prev, reply]);
    }, 1500);
  };

  const stepIndex = steps.indexOf(currentStep);

  if (!vendor) {
    return (
      <div className="min-h-screen bg-[#f5f0eb]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-6">
          <div className="w-20 h-20 rounded-full bg-bg-accent border border-border-light flex items-center justify-center mb-6">
            <Wrench className="w-8 h-8 text-text-subtle" />
          </div>
          <h1 className="font-heading font-bold text-primary-dark text-2xl mb-2">Vendor not found</h1>
          <Link to="/services" className="mt-4 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Service Loop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const priceNum = agreedPrice ? parseInt(agreedPrice.replace(/,/g, "")) || vendor.priceNum : vendor.priceNum;
  const serviceFee = Math.round(priceNum * 0.1);
  const total = priceNum + serviceFee;

  const goNext = () => {
    if (currentStep === "payment") {
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        setCurrentStep("confirmed");
      }, 2000);
      return;
    }
    const next = stepIndex + 1;
    if (next < steps.length) setCurrentStep(steps[next]);
  };

  const goBack = () => {
    const prev = stepIndex - 1;
    if (prev >= 0) setCurrentStep(steps[prev]);
  };

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />
      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-8">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/services" className="hover:text-primary transition-colors">Service Loop</Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">Book {vendor.name}</span>
          </div>

          {/* Step indicator */}
          {currentStep !== "confirmed" && (
            <div className="flex items-center justify-center gap-2 mb-8">
              {steps.slice(0, 3).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-heading font-semibold transition-all ${i <= stepIndex ? "bg-primary text-white shadow-lg shadow-glow/40" : "bg-white/60 text-text-secondary border border-border-light"}`}>
                    {i < stepIndex ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`hidden sm:inline text-xs font-medium ${i <= stepIndex ? "text-primary-dark" : "text-text-subtle"}`}>{stepLabels[s]}</span>
                  {i < 2 && <div className={`w-8 sm:w-12 h-0.5 rounded-full ${i < stepIndex ? "bg-primary" : "bg-border-light"}`} />}
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8 mb-20">
            {/* Left — step content */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div key={currentStep} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease }}>

                  {/* Step 1: Job Details */}
                  {currentStep === "details" && (
                    <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                      <h2 className="font-heading font-bold text-primary-dark text-lg mb-5">Describe Your Job</h2>

                      {/* Vendor mini card */}
                      <div className="flex items-center gap-4 bg-white/60 border border-border-light rounded-2xl p-4 mb-6">
                        <img src={vendor.avatar} alt={vendor.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-heading font-bold text-primary-dark text-sm">{vendor.name}</p>
                            {vendor.verified && <CheckCircle className="w-3.5 h-3.5 text-primary" />}
                          </div>
                          <p className="text-text-secondary text-xs">{vendor.category} · {vendor.location}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-text-secondary">
                          <Star className="w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]" /> {vendor.rating}
                        </div>
                      </div>

                      <div className="flex flex-col gap-4">
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">What do you need done?</label>
                          <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Describe the job in detail — what needs to be fixed, installed, or repaired..." className="w-full h-28 px-4 py-3 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors resize-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">Preferred Date</label>
                            <div className="relative">
                              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                              <input type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} className="w-full h-11 pl-11 pr-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors" />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">Preferred Time</label>
                            <select value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors appearance-none">
                              <option>08:00</option><option>09:00</option><option>10:00</option><option>11:00</option><option>12:00</option><option>13:00</option><option>14:00</option><option>15:00</option><option>16:00</option><option>17:00</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">Property Address</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                            <input type="text" value={propertyAddress} onChange={(e) => setPropertyAddress(e.target.value)} placeholder="Where should the vendor come?" className="w-full h-11 pl-11 pr-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors" />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end mt-6">
                        <button onClick={goNext} className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-primary text-white font-heading font-semibold text-sm shadow-lg shadow-glow/40 hover:bg-primary-dark transition-colors">
                          Continue <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Review & Price */}
                  {currentStep === "review" && (
                    <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                      <h2 className="font-heading font-bold text-primary-dark text-lg mb-5">Review & Agree on Price</h2>

                      <div className="flex flex-col gap-3 text-sm mb-6">
                        {[
                          { label: "Vendor", value: vendor.name },
                          { label: "Service", value: vendor.category },
                          { label: "Date", value: preferredDate ? new Date(preferredDate).toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "Not set" },
                          { label: "Time", value: preferredTime },
                          { label: "Address", value: propertyAddress || "Not set" },
                        ].map((r) => (
                          <div key={r.label} className="flex items-center justify-between py-2 border-b border-border-light last:border-0">
                            <span className="text-text-secondary">{r.label}</span>
                            <span className="font-heading font-medium text-primary-dark text-right max-w-[60%] truncate">{r.value}</span>
                          </div>
                        ))}
                      </div>

                      {jobDescription && (
                        <div className="bg-white/60 border border-border-light rounded-2xl p-4 mb-6">
                          <p className="text-xs font-heading font-semibold text-primary-dark mb-1">Job Description</p>
                          <p className="text-text-secondary text-sm">{jobDescription}</p>
                        </div>
                      )}

                      <div className="mb-6">
                        <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                          Agreed Price (₦)
                        </label>
                        <input type="text" value={agreedPrice} onChange={(e) => setAgreedPrice(e.target.value)} placeholder={String(vendor.priceNum)} className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors" />
                        <p className="text-text-subtle text-xs mt-1">Vendor's starting price: {vendor.price}. Enter the agreed amount.</p>
                      </div>

                      <div className="bg-bg-accent rounded-2xl border border-border-light p-4">
                        <div className="flex items-center gap-2 text-xs text-primary mb-2"><Shield className="w-4 h-4" /> Paystack Escrow Protected</div>
                        <div className="flex justify-between text-sm"><span className="text-text-secondary">Vendor fee</span><span className="text-primary-dark font-medium">₦{priceNum.toLocaleString()}</span></div>
                        <div className="flex justify-between text-sm mt-1"><span className="text-text-secondary">Service fee (10%)</span><span className="text-primary-dark font-medium">₦{serviceFee.toLocaleString()}</span></div>
                        <div className="h-px bg-border-light my-2" />
                        <div className="flex justify-between"><span className="font-heading font-bold text-primary-dark">Total</span><span className="font-heading font-bold text-primary-dark text-lg">₦{total.toLocaleString()}</span></div>
                      </div>

                      <div className="flex items-center justify-between mt-6">
                        <button onClick={goBack} className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors"><ArrowLeft className="w-4 h-4" /> Back</button>
                        <button onClick={goNext} className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-primary text-white font-heading font-semibold text-sm shadow-lg shadow-glow/40 hover:bg-primary-dark transition-colors">
                          Proceed to Payment <CreditCard className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Payment */}
                  {currentStep === "payment" && (
                    <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                      <h2 className="font-heading font-bold text-primary-dark text-lg mb-5">Escrow Payment</h2>
                      <div className="flex items-center gap-3 mb-5 px-4 py-3 rounded-2xl bg-primary/5 border border-primary/20">
                        <Lock className="w-5 h-5 text-primary" />
                        <p className="text-primary-dark text-sm">₦{total.toLocaleString()} will be held in <span className="font-bold">Paystack escrow</span>. {vendor.name} only gets paid when you confirm the job is complete.</p>
                      </div>
                      <div className="flex flex-col gap-4">
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">Card Number</label>
                          <input type="text" placeholder="4084 0840 8408 4081" className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div><label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">Expiry</label><input type="text" placeholder="12/28" className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors" /></div>
                          <div><label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">CVV</label><input type="text" placeholder="123" className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors" /></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-6">
                        <button onClick={goBack} className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors"><ArrowLeft className="w-4 h-4" /> Back</button>
                        <button onClick={goNext} disabled={processing} className="h-12 px-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors inline-flex items-center gap-2 shadow-[0_4px_16px_rgba(31,111,67,0.3)] disabled:opacity-60">
                          {processing ? <><Clock className="w-4 h-4 animate-spin" /> Processing...</> : <>Pay ₦{total.toLocaleString()} <Lock className="w-4 h-4" /></>}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Confirmed */}
                  {currentStep === "confirmed" && (
                    <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-8 sm:p-10 text-center">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-5 shadow-lg shadow-glow/40">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </motion.div>
                      <h2 className="font-heading font-bold text-primary-dark text-xl">Service Booked!</h2>
                      <p className="text-text-secondary text-sm mt-2 max-w-md mx-auto">
                        ₦{total.toLocaleString()} is held in Paystack escrow. {vendor.name} will contact you to confirm the appointment. Funds are released only when you confirm the job is done.
                      </p>
                      <div className="mt-6 bg-bg-accent rounded-2xl border border-border-light p-4 text-left max-w-sm mx-auto">
                        <p className="font-heading font-bold text-primary-dark text-sm">{vendor.category} — {vendor.name}</p>
                        <p className="text-text-secondary text-xs mt-1">Booking #SVC-20260402-0023 · ₦{total.toLocaleString()}</p>
                        {preferredDate && <p className="text-text-secondary text-xs mt-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(preferredDate).toLocaleDateString("en-NG", { weekday: "short", month: "short", day: "numeric" })} at {preferredTime}</p>}
                      </div>
                      <div className="mt-4 bg-white/25 backdrop-blur-md rounded-2xl border border-white/40 p-4 max-w-sm mx-auto">
                        <div className="flex items-center gap-2 text-xs text-primary"><ClipboardList className="w-4 h-4" /> This job will be auto-logged to the Property Logbook once completed.</div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                        <Link to="/dashboard" className="h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors inline-flex items-center gap-2">Go to Dashboard <ArrowRight className="w-4 h-4" /></Link>
                        <Link to="/services" className="h-10 px-6 rounded-full border border-border-light bg-white/80 text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all">Browse more vendors</Link>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right — Vendor summary */}
            {currentStep !== "confirmed" && (
              <div className="lg:w-85 shrink-0">
                <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden sticky top-8">
                  <img src={vendor.image} alt={vendor.name} className="w-full h-40 object-cover" />
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={vendor.avatar} alt={vendor.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-heading font-bold text-primary-dark text-sm truncate">{vendor.name}</p>
                          {vendor.verified && <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />}
                        </div>
                        <p className="text-text-secondary text-xs">{vendor.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-secondary mb-3">
                      <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]" /> {vendor.rating}</span>
                      <span>{vendor.jobs} jobs</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {vendor.location}</span>
                    </div>
                    <div className="h-px bg-border-light mb-3" />
                    <p className="font-heading font-bold text-primary-dark text-lg">{vendor.price}</p>
                    <p className="text-text-secondary text-xs mt-2 leading-relaxed">{vendor.bio}</p>
                    <div className="h-px bg-border-light my-3" />
                    <div className="flex flex-col gap-2 text-xs text-text-secondary">
                      <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Escrow-protected payment</div>
                      <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> KYC verified vendor</div>
                      <div className="flex items-center gap-2"><ClipboardList className="w-4 h-4 text-primary" /> Auto-logged to Property Logbook</div>
                    </div>
                    <div className="h-px bg-border-light my-3" />
                    <div className="flex gap-2">
                      <a href={`tel:+${vendor.phone}`} className="flex-1 h-9 rounded-full bg-white/80 border border-white/40 text-primary-dark text-xs font-medium hover:bg-primary hover:text-white hover:border-primary transition-all inline-flex items-center justify-center gap-1">
                        <Phone className="w-3 h-3" /> Call
                      </a>
                      <a href={`https://wa.me/${vendor.phone}`} target="_blank" rel="noopener noreferrer" className="flex-1 h-9 rounded-full bg-[#25D366] text-white text-xs font-medium hover:bg-[#20bd5a] transition-colors inline-flex items-center justify-center gap-1">
                        <MessageCircle className="w-3 h-3" /> WhatsApp
                      </a>
                    </div>
                  </div>
                </div>

                {/* ─── Mini Chat Widget ─── */}
                <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden mt-4 sticky top-[calc(100vh-400px)]">
                  {/* Chat Header — Toggle */}
                  <button onClick={() => setChatOpen(!chatOpen)} className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/30 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="font-heading font-bold text-primary-dark text-sm">Chat with {vendor.name.split(" ")[0]}</p>
                        <p className="text-text-subtle text-[10px]">Ask questions before booking</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {chatMessages.length > 1 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-primary text-white text-[9px] font-bold">{chatMessages.length}</span>
                      )}
                      {chatOpen ? <ChevronDown className="w-4 h-4 text-text-subtle" /> : <ChevronUp className="w-4 h-4 text-text-subtle" />}
                    </div>
                  </button>

                  {/* Chat Body */}
                  <AnimatePresence>
                    {chatOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/30">
                          {/* Messages */}
                          <div className="h-64 overflow-y-auto p-3 flex flex-col gap-2 bg-white/20">
                            {chatMessages.map((msg, i) => (
                              <div key={i} className={`flex ${msg.sender === "you" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                                  msg.sender === "you"
                                    ? "bg-primary text-white rounded-br-md"
                                    : "bg-white/70 backdrop-blur-sm border border-white/40 text-primary-dark rounded-bl-md"
                                }`}>
                                  {msg.text}
                                  <p className={`text-[9px] mt-0.5 ${msg.sender === "you" ? "text-white/50" : "text-text-subtle"}`}>{msg.time}</p>
                                </div>
                              </div>
                            ))}
                            <div ref={chatEndRef} />
                          </div>

                          {/* Input */}
                          <div className="p-2 border-t border-white/30 bg-white/20">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
                                placeholder="Type a message..."
                                className="flex-1 h-8 px-3 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 text-xs text-primary-dark placeholder:text-text-subtle focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                              />
                              <button
                                onClick={handleChatSend}
                                disabled={!chatInput.trim()}
                                className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-40 shrink-0"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookService;
