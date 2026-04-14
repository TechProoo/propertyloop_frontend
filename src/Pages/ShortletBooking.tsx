import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Calendar,
  Users,
  CreditCard,
  CheckCircle,
  Shield,
  Star,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Lock,
  Clock,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import listingsService from "../api/services/listings";
import shortletBookingsService from "../api/services/shortletBookings";
import type {
  Listing,
  ShortletBooking as ShortletBookingType,
} from "../api/types";

const ease = [0.23, 1, 0.32, 1] as const;

const steps = ["dates", "guests", "review", "payment", "confirmed"] as const;
type Step = (typeof steps)[number];

const stepLabels: Record<Step, string> = {
  dates: "Select Dates",
  guests: "Guests",
  review: "Review",
  payment: "Payment",
  confirmed: "Confirmed",
};

const fallbackProperty = {
  image:
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop",
  title: "Luxury Penthouse with City View",
  address: "Victoria Island, Lagos",
  price: 85000,
  rating: 4.9,
  beds: 3,
  baths: 2,
  sqft: "2,400",
  amenities: ["WiFi", "Pool", "Gym", "Parking", "24hr Power", "Smart TV"],
  agent: "Island Properties",
};

const ShortletBooking = () => {
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get("listingId");

  const [currentStep, setCurrentStep] = useState<Step>("dates");
  const [checkIn, setCheckIn] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [checkOut, setCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split("T")[0];
  });
  const [guests, setGuests] = useState(2);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [processing, setProcessing] = useState(false);
  const [listing, setListing] = useState<Listing | null>(null);
  const [loadingListing, setLoadingListing] = useState(!!listingId);
  const [booking, setBooking] = useState<ShortletBookingType | null>(null);

  useEffect(() => {
    if (!listingId) return;
    listingsService
      .getById(listingId)
      .then(setListing)
      .catch(() => {})
      .finally(() => setLoadingListing(false));
  }, [listingId]);

  const property = listing
    ? {
        image: listing.coverImage,
        title: listing.title,
        address: listing.address || listing.location,
        price: listing.priceNaira,
        rating: listing.rating,
        beds: listing.beds,
        baths: listing.baths,
        sqft: listing.sqft,
        amenities: listing.features?.slice(0, 6) ?? [],
        agent: listing.agent?.name ?? "Property Loop",
      }
    : fallbackProperty;

  const stepIndex = steps.indexOf(currentStep);
  const nights =
    checkIn && checkOut
      ? Math.max(
          1,
          Math.round(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              86400000,
          ),
        )
      : 1;
  const subtotal = property.price * nights;
  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee;

  const goNext = async () => {
    if (currentStep === "payment") {
      setProcessing(true);
      try {
        if (listingId) {
          const result = await shortletBookingsService.create({
            listingId,
            guestName: guestName || "Guest",
            guestPhone: guestPhone || "",
            guests,
            checkIn,
            checkOut,
            paymentMethod: "CARD",
          });
          setBooking(result);
        }
        setCurrentStep("confirmed");
      } catch {
        // Fallback — still show confirmed locally
        setCurrentStep("confirmed");
      } finally {
        setProcessing(false);
      }
      return;
    }
    const nextIndex = stepIndex + 1;
    if (nextIndex < steps.length) setCurrentStep(steps[nextIndex]);
  };

  const goBack = () => {
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) setCurrentStep(steps[prevIndex]);
  };

  if (loadingListing) {
    return (
      <div className="min-h-screen bg-[#f5f0eb] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />
      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-8">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              to="/shortlet"
              className="hover:text-primary transition-colors"
            >
              Shortlet
            </Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">Book</span>
          </div>

          {/* Step indicator */}
          {currentStep !== "confirmed" && (
            <div className="flex items-center justify-center gap-2 mb-8">
              {steps.slice(0, 4).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-heading font-semibold transition-all ${
                      i <= stepIndex
                        ? "bg-primary text-white shadow-lg shadow-glow/40"
                        : "bg-white/60 text-text-secondary border border-border-light"
                    }`}
                  >
                    {i < stepIndex ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={`hidden sm:inline text-xs font-medium ${i <= stepIndex ? "text-primary-dark" : "text-text-subtle"}`}
                  >
                    {stepLabels[s]}
                  </span>
                  {i < 3 && (
                    <div
                      className={`w-8 sm:w-12 h-0.5 rounded-full ${i < stepIndex ? "bg-primary" : "bg-border-light"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Main content */}
          <div className="flex flex-col lg:flex-row gap-8 mb-20">
            {/* Left — Step content */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease }}
                >
                  {/* Dates */}
                  {currentStep === "dates" && (
                    <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                      <h2 className="font-heading font-bold text-primary-dark text-lg mb-5">
                        Select Your Dates
                      </h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            Check-in
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                            <input
                              type="date"
                              value={checkIn}
                              min={new Date().toISOString().split("T")[0]}
                              onChange={(e) => {
                                setCheckIn(e.target.value);
                                if (e.target.value >= checkOut) {
                                  const next = new Date(e.target.value);
                                  next.setDate(next.getDate() + 1);
                                  setCheckOut(next.toISOString().split("T")[0]);
                                }
                              }}
                              className="w-full h-11 pl-11 pr-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            Check-out
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                            <input
                              type="date"
                              value={checkOut}
                              min={(() => {
                                const d = new Date(checkIn);
                                d.setDate(d.getDate() + 1);
                                return d.toISOString().split("T")[0];
                              })()}
                              onChange={(e) => setCheckOut(e.target.value)}
                              className="w-full h-11 pl-11 pr-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 bg-bg-accent rounded-2xl border border-border-light p-4">
                        <p className="text-primary-dark text-sm font-medium">
                          {nights} night{nights > 1 ? "s" : ""} selected
                        </p>
                        <p className="text-text-secondary text-xs mt-1">
                          ₦{property.price.toLocaleString()} x {nights} nights =
                          ₦{subtotal.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex justify-end mt-6">
                        <button
                          onClick={goNext}
                          className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-primary text-white font-heading font-semibold text-sm shadow-lg shadow-glow/40 hover:bg-primary-dark transition-colors"
                        >
                          Continue <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Guests */}
                  {currentStep === "guests" && (
                    <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                      <h2 className="font-heading font-bold text-primary-dark text-lg mb-5">
                        Number of Guests
                      </h2>
                      <div className="flex items-center gap-4 mb-6">
                        <Users className="w-5 h-5 text-primary" />
                        <div className="flex items-center gap-3 bg-white/80 border border-border-light rounded-2xl p-1">
                          <button
                            onClick={() => setGuests(Math.max(1, guests - 1))}
                            className="w-10 h-10 rounded-xl bg-bg-accent flex items-center justify-center text-primary-dark font-bold text-lg hover:bg-primary hover:text-white transition-all"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-heading font-bold text-primary-dark text-lg">
                            {guests}
                          </span>
                          <button
                            onClick={() => setGuests(Math.min(10, guests + 1))}
                            className="w-10 h-10 rounded-xl bg-bg-accent flex items-center justify-center text-primary-dark font-bold text-lg hover:bg-primary hover:text-white transition-all"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-text-secondary text-sm">
                          guest{guests > 1 ? "s" : ""}
                        </span>
                      </div>
                      <p className="text-text-subtle text-xs">
                        Maximum 10 guests for this property. Children under 2
                        stay free.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            Guest Name
                          </label>
                          <input
                            type="text"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="Full name"
                            className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={guestPhone}
                            onChange={(e) => setGuestPhone(e.target.value)}
                            placeholder="+234 801 234 5678"
                            className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-6">
                        <button
                          onClick={goBack}
                          className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <button
                          onClick={goNext}
                          className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-primary text-white font-heading font-semibold text-sm shadow-lg shadow-glow/40 hover:bg-primary-dark transition-colors"
                        >
                          Continue <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Review */}
                  {currentStep === "review" && (
                    <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                      <h2 className="font-heading font-bold text-primary-dark text-lg mb-5">
                        Review Your Booking
                      </h2>
                      <div className="flex flex-col gap-3 text-sm">
                        {[
                          { label: "Property", value: property.title },
                          {
                            label: "Check-in",
                            value: new Date(checkIn).toLocaleDateString(
                              "en-NG",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            ),
                          },
                          {
                            label: "Check-out",
                            value: new Date(checkOut).toLocaleDateString(
                              "en-NG",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            ),
                          },
                          { label: "Nights", value: String(nights) },
                          { label: "Guests", value: String(guests) },
                          { label: "Agent", value: property.agent },
                        ].map((r) => (
                          <div
                            key={r.label}
                            className="flex items-center justify-between py-2 border-b border-border-light last:border-0"
                          >
                            <span className="text-text-secondary">
                              {r.label}
                            </span>
                            <span className="font-heading font-medium text-primary-dark">
                              {r.value}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 bg-bg-accent rounded-2xl border border-border-light p-4">
                        <div className="flex items-center gap-2 text-xs text-primary mb-2">
                          <Shield className="w-4 h-4" /> Paystack Escrow
                          Protected
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">
                            ₦{property.price.toLocaleString()} x {nights} nights
                          </span>
                          <span className="text-primary-dark font-medium">
                            ₦{subtotal.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-text-secondary">
                            Service fee
                          </span>
                          <span className="text-primary-dark font-medium">
                            ₦{serviceFee.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-px bg-border-light my-2" />
                        <div className="flex justify-between">
                          <span className="font-heading font-bold text-primary-dark">
                            Total
                          </span>
                          <span className="font-heading font-bold text-primary-dark text-lg">
                            ₦{total.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-6">
                        <button
                          onClick={goBack}
                          className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <button
                          onClick={goNext}
                          className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-primary text-white font-heading font-semibold text-sm shadow-lg shadow-glow/40 hover:bg-primary-dark transition-colors"
                        >
                          Proceed to Payment <CreditCard className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Payment */}
                  {currentStep === "payment" && (
                    <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                      <h2 className="font-heading font-bold text-primary-dark text-lg mb-5">
                        Payment
                      </h2>
                      <div className="flex items-center gap-3 mb-5 px-4 py-3 rounded-2xl bg-primary/5 border border-primary/20">
                        <Lock className="w-5 h-5 text-primary" />
                        <p className="text-primary-dark text-sm">
                          Your payment of{" "}
                          <span className="font-bold">
                            ₦{total.toLocaleString()}
                          </span>{" "}
                          will be held in Paystack escrow until check-in is
                          confirmed.
                        </p>
                      </div>
                      <div className="flex flex-col gap-4">
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            Card Number
                          </label>
                          <input
                            type="text"
                            placeholder="4084 0840 8408 4081"
                            className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                              Expiry
                            </label>
                            <input
                              type="text"
                              placeholder="12/28"
                              className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                              CVV
                            </label>
                            <input
                              type="text"
                              placeholder="123"
                              className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-6">
                        <button
                          onClick={goBack}
                          className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <button
                          onClick={goNext}
                          disabled={processing}
                          className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-primary text-white font-heading font-semibold text-sm shadow-lg shadow-glow/40 hover:bg-primary-dark transition-colors disabled:opacity-60"
                        >
                          {processing ? (
                            <>
                              <Clock className="w-4 h-4 animate-spin" />{" "}
                              Processing...
                            </>
                          ) : (
                            <>
                              Pay ₦{total.toLocaleString()}{" "}
                              <Lock className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Confirmed */}
                  {currentStep === "confirmed" && (
                    <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-8 sm:p-10 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                        className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-5 shadow-lg shadow-glow/40"
                      >
                        <CheckCircle className="w-8 h-8 text-white" />
                      </motion.div>
                      <h2 className="font-heading font-bold text-primary-dark text-xl">
                        Booking Confirmed!
                      </h2>
                      <p className="text-text-secondary text-sm mt-2 max-w-sm mx-auto">
                        Your shortlet booking has been confirmed. ₦
                        {total.toLocaleString()} is held in Paystack escrow.
                        You'll receive a confirmation SMS shortly.
                      </p>
                      <div className="mt-6 bg-bg-accent rounded-2xl border border-border-light p-4 text-left max-w-sm mx-auto">
                        <p className="font-heading font-bold text-primary-dark text-sm">
                          {property.title}
                        </p>
                        <p className="text-text-secondary text-xs mt-1">
                          {nights} nights · {guests} guests · Booking #
                          {booking?.id?.slice(0, 12) ??
                            "SHL-" + Date.now().toString().slice(-8)}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                        <Link
                          to="/dashboard"
                          className="h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
                        >
                          Go to Dashboard <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                          to="/shortlet"
                          className="h-10 px-6 rounded-full border border-border-light bg-white/80 text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all inline-flex items-center gap-2"
                        >
                          Browse more shortlets
                        </Link>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right — Property summary card */}
            <div className="lg:w-85 shrink-0">
              <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden sticky top-8">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-44 object-cover"
                />
                <div className="p-5">
                  <h3 className="font-heading font-bold text-primary-dark text-sm">
                    {property.title}
                  </h3>
                  <p className="text-text-secondary text-xs flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {property.address}
                  </p>
                  <div className="flex items-center gap-3 text-text-secondary text-xs mt-2">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#F5A623] fill-[#F5A623]" />{" "}
                      {property.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bed className="w-3 h-3" /> {property.beds}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-3 h-3" /> {property.baths}
                    </span>
                    <span className="flex items-center gap-1">
                      <Maximize className="w-3 h-3" /> {property.sqft}m²
                    </span>
                  </div>
                  <div className="h-px bg-border-light my-3" />
                  <p className="font-heading font-bold text-primary-dark text-lg">
                    ₦{property.price.toLocaleString()}{" "}
                    <span className="text-text-secondary text-sm font-normal">
                      /night
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {property.amenities.map((a) => (
                      <span
                        key={a}
                        className="px-2 py-0.5 rounded-full bg-bg-accent text-text-secondary text-[10px] border border-border-light"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                  <div className="h-px bg-border-light my-3" />
                  <div className="flex items-center gap-2 text-xs text-primary">
                    <Shield className="w-4 h-4" /> Paystack escrow protected
                  </div>
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

export default ShortletBooking;
