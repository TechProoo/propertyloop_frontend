import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Shield,
  Lock,
  CreditCard,
  Clock,
  Home,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Star,
  FileSignature,
  Banknote,
  KeyRound,
  UserCheck,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";

const ease = [0.23, 1, 0.32, 1] as const;

const steps = ["review", "deposit", "payment", "esign", "confirmed"] as const;
type Step = (typeof steps)[number];

const stepLabels: Record<Step, string> = {
  review: "Review Lease",
  deposit: "Deposit",
  payment: "Payment",
  esign: "E-Sign",
  confirmed: "Confirmed",
};

const rental = {
  image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop",
  title: "Serviced 3-Bed Flat with Pool",
  address: "15 Freedom Way, Lekki Phase 1",
  location: "Lekki, Lagos",
  price: "₦3,500,000",
  period: "year",
  beds: 3,
  baths: 3,
  sqft: "2,400",
  rating: 4.8,
  agent: "Adebayo Johnson",
  agency: "Prime Realty Lagos",
};

const RentalEscrow = () => {
  const [currentStep, setCurrentStep] = useState<Step>("review");
  const [processing, setProcessing] = useState(false);

  const stepIndex = steps.indexOf(currentStep);
  const deposit = 3500000;
  const agencyFee = 350000;
  const legalFee = 150000;
  const serviceFee = 175000;
  const total = deposit + agencyFee + legalFee + serviceFee;

  const goNext = () => {
    if (currentStep === "payment") {
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        setCurrentStep("esign");
      }, 2000);
      return;
    }
    if (currentStep === "esign") {
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        setCurrentStep("confirmed");
      }, 1500);
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
            <Link to="/rent" className="hover:text-primary transition-colors">Rent</Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">Rental Deposit</span>
          </div>

          {/* Step indicator */}
          {currentStep !== "confirmed" && (
            <div className="flex items-center justify-center gap-2 mb-8">
              {steps.slice(0, 4).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-heading font-semibold transition-all ${i <= stepIndex ? "bg-primary text-white shadow-lg shadow-glow/40" : "bg-white/60 text-text-secondary border border-border-light"}`}>
                    {i < stepIndex ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`hidden sm:inline text-xs font-medium ${i <= stepIndex ? "text-primary-dark" : "text-text-subtle"}`}>{stepLabels[s]}</span>
                  {i < 3 && <div className={`w-8 sm:w-12 h-0.5 rounded-full ${i < stepIndex ? "bg-primary" : "bg-border-light"}`} />}
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8 mb-20">
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div key={currentStep} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease }}>

                  {/* Review */}
                  {currentStep === "review" && (
                    <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                      <h2 className="font-heading font-bold text-primary-dark text-lg mb-5">Review Lease Terms</h2>
                      <div className="flex flex-col gap-3 text-sm">
                        {[
                          { label: "Property", value: rental.title },
                          { label: "Address", value: rental.address },
                          { label: "Annual Rent", value: rental.price + "/year" },
                          { label: "Lease Duration", value: "12 months" },
                          { label: "Start Date", value: "May 1, 2026" },
                          { label: "Listing Agent", value: rental.agent + " · " + rental.agency },
                        ].map((r) => (
                          <div key={r.label} className="flex items-center justify-between py-2 border-b border-border-light last:border-0">
                            <span className="text-text-secondary">{r.label}</span>
                            <span className="font-heading font-medium text-primary-dark text-right">{r.value}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end mt-6">
                        <button onClick={goNext} className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-primary text-white font-heading font-semibold text-sm shadow-lg shadow-glow/40 hover:bg-primary-dark transition-colors">Continue <ArrowRight className="w-4 h-4" /></button>
                      </div>
                    </div>
                  )}

                  {/* Deposit breakdown */}
                  {currentStep === "deposit" && (
                    <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                      <h2 className="font-heading font-bold text-primary-dark text-lg mb-5">Deposit Breakdown</h2>
                      <div className="flex items-center gap-3 mb-5 px-4 py-3 rounded-2xl bg-primary/5 border border-primary/20">
                        <Shield className="w-5 h-5 text-primary shrink-0" />
                        <p className="text-primary-dark text-sm">Your deposit is held in <span className="font-bold">Paystack escrow</span> until lease signing is complete. If the deal falls through, you get a full refund.</p>
                      </div>
                      <div className="flex flex-col gap-3 text-sm">
                        <div className="flex justify-between py-2"><span className="text-text-secondary">Rental deposit (1 year)</span><span className="font-heading font-medium text-primary-dark">₦{deposit.toLocaleString()}</span></div>
                        <div className="flex justify-between py-2"><span className="text-text-secondary">Agency fee (10%)</span><span className="font-heading font-medium text-primary-dark">₦{agencyFee.toLocaleString()}</span></div>
                        <div className="flex justify-between py-2"><span className="text-text-secondary">Legal / agreement fee</span><span className="font-heading font-medium text-primary-dark">₦{legalFee.toLocaleString()}</span></div>
                        <div className="flex justify-between py-2"><span className="text-text-secondary">PropertyLoop service fee (5%)</span><span className="font-heading font-medium text-primary-dark">₦{serviceFee.toLocaleString()}</span></div>
                        <div className="h-px bg-border-light" />
                        <div className="flex justify-between"><span className="font-heading font-bold text-primary-dark">Total Due</span><span className="font-heading font-bold text-primary-dark text-lg">₦{total.toLocaleString()}</span></div>
                      </div>
                      <div className="flex items-center justify-between mt-6">
                        <button onClick={goBack} className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors"><ArrowLeft className="w-4 h-4" /> Back</button>
                        <button onClick={goNext} className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-primary text-white font-heading font-semibold text-sm shadow-lg shadow-glow/40 hover:bg-primary-dark transition-colors">Proceed to Payment <CreditCard className="w-4 h-4" /></button>
                      </div>
                    </div>
                  )}

                  {/* Payment */}
                  {currentStep === "payment" && (
                    <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                      <h2 className="font-heading font-bold text-primary-dark text-lg mb-5">Escrow Payment</h2>
                      <div className="flex items-center gap-3 mb-5 px-4 py-3 rounded-2xl bg-primary/5 border border-primary/20">
                        <Lock className="w-5 h-5 text-primary" />
                        <p className="text-primary-dark text-sm">Paying <span className="font-bold">₦{total.toLocaleString()}</span> into Paystack escrow</p>
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
                        <button onClick={goNext} disabled={processing} className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-primary text-white font-heading font-semibold text-sm shadow-lg shadow-glow/40 hover:bg-primary-dark transition-colors disabled:opacity-60">
                          {processing ? <><Clock className="w-4 h-4 animate-spin" /> Processing...</> : <>Pay ₦{total.toLocaleString()} <Lock className="w-4 h-4" /></>}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* E-Sign */}
                  {currentStep === "esign" && (
                    <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                      <h2 className="font-heading font-bold text-primary-dark text-lg mb-2">Sign Tenancy Agreement</h2>
                      <p className="text-text-secondary text-sm mb-5">Payment received. Now sign your tenancy agreement via DocuSeal to complete the process.</p>
                      <div className="bg-white/80 border border-border-light rounded-2xl p-6 mb-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><FileSignature className="w-5 h-5" /></div>
                          <div>
                            <p className="font-heading font-bold text-primary-dark text-sm">Tenancy Agreement</p>
                            <p className="text-text-secondary text-xs">PropertyLoop Standard Lease · 12 months</p>
                          </div>
                        </div>
                        <div className="bg-[#f5f7f5] rounded-xl p-4 border border-border-light text-xs text-text-secondary leading-relaxed h-40 overflow-y-auto">
                          <p className="font-bold text-primary-dark mb-2">TENANCY AGREEMENT</p>
                          <p>This Tenancy Agreement ("Agreement") is entered into on this 1st day of May, 2026 between the Landlord, represented by {rental.agent} of {rental.agency}, and the Tenant.</p>
                          <p className="mt-2"><span className="font-semibold text-primary-dark">Property:</span> {rental.title}, {rental.address}</p>
                          <p className="mt-1"><span className="font-semibold text-primary-dark">Rent:</span> {rental.price} per annum</p>
                          <p className="mt-1"><span className="font-semibold text-primary-dark">Duration:</span> 12 months commencing May 1, 2026</p>
                          <p className="mt-2">The Tenant agrees to maintain the property in good condition, pay rent promptly, and comply with estate rules. The Landlord agrees to ensure the property is habitable and all facilities are functional...</p>
                          <p className="mt-2 text-primary-dark font-semibold">Signed via DocuSeal — PropertyLoop Digital Signing</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <button onClick={goBack} className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors"><ArrowLeft className="w-4 h-4" /> Back</button>
                        <button onClick={goNext} disabled={processing} className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-primary text-white font-heading font-semibold text-sm shadow-lg shadow-glow/40 hover:bg-primary-dark transition-colors disabled:opacity-60">
                          {processing ? <><Clock className="w-4 h-4 animate-spin" /> Signing...</> : <>Sign Agreement <FileSignature className="w-4 h-4" /></>}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Confirmed */}
                  {currentStep === "confirmed" && (
                    <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-8 sm:p-10 text-center">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-5 shadow-lg shadow-glow/40">
                        <KeyRound className="w-8 h-8 text-white" />
                      </motion.div>
                      <h2 className="font-heading font-bold text-primary-dark text-xl">Lease Signed & Deposit Secured!</h2>
                      <p className="text-text-secondary text-sm mt-2 max-w-md mx-auto">Your tenancy agreement has been signed and ₦{total.toLocaleString()} is held in escrow. The agent will release the keys on your move-in date.</p>
                      <div className="mt-6 bg-bg-accent rounded-2xl border border-border-light p-4 text-left max-w-sm mx-auto">
                        <p className="font-heading font-bold text-primary-dark text-sm">{rental.title}</p>
                        <p className="text-text-secondary text-xs mt-1">12 months · Move-in: May 1, 2026 · Ref: RNT-20260501-0018</p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                        <Link to="/dashboard" className="h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors inline-flex items-center gap-2">Go to Dashboard <ArrowRight className="w-4 h-4" /></Link>
                        <Link to="/rent" className="h-10 px-6 rounded-full border border-border-light bg-white/80 text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all">Browse more rentals</Link>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right — Property summary */}
            <div className="lg:w-[340px] shrink-0">
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden sticky top-8">
                <img src={rental.image} alt={rental.title} className="w-full h-40 object-cover" />
                <div className="p-5">
                  <h3 className="font-heading font-bold text-primary-dark text-sm">{rental.title}</h3>
                  <p className="text-text-secondary text-xs flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {rental.location}</p>
                  <div className="flex items-center gap-3 text-text-secondary text-xs mt-2">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-[#F5A623] fill-[#F5A623]" /> {rental.rating}</span>
                    <span className="flex items-center gap-1"><Bed className="w-3 h-3" /> {rental.beds}</span>
                    <span className="flex items-center gap-1"><Bath className="w-3 h-3" /> {rental.baths}</span>
                  </div>
                  <div className="h-px bg-border-light my-3" />
                  <p className="font-heading font-bold text-primary-dark text-lg">{rental.price} <span className="text-text-secondary text-sm font-normal">/year</span></p>
                  <div className="h-px bg-border-light my-3" />
                  <div className="flex items-center gap-2 text-xs text-primary"><Shield className="w-4 h-4" /> Escrow-protected deposit</div>
                  <div className="flex items-center gap-2 text-xs text-primary mt-1.5"><FileSignature className="w-4 h-4" /> E-signing via DocuSeal</div>
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

export default RentalEscrow;
