import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Camera,
  FileText,
  Video,
  X,
  CheckCircle,
  Home,
  Building2,
  LandPlot,
  Store,
  ShieldCheck,
  Image,
  Plus,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";

/* ─── Types ─── */

interface PropertyForm {
  listingType: "sale" | "rent" | "shortlet";
  propertyType: string;
  title: string;
  address: string;
  location: string;
  beds: string;
  baths: string;
  size: string;
  yearBuilt: string;
  price: string;
  description: string;
  virtualTourUrl: string;
}

const initialForm: PropertyForm = {
  listingType: "sale",
  propertyType: "",
  title: "",
  address: "",
  location: "",
  beds: "",
  baths: "",
  size: "",
  yearBuilt: "",
  price: "",
  description: "",
  virtualTourUrl: "",
};

/* ─── Data ─── */

const listingTypes = [
  { value: "sale" as const, label: "For Sale" },
  { value: "rent" as const, label: "For Rent" },
  { value: "shortlet" as const, label: "Shortlet" },
];

const propertyTypes = [
  { icon: <Building2 className="w-4 h-4" />, label: "Flat / Apartment" },
  { icon: <Home className="w-4 h-4" />, label: "House" },
  { icon: <LandPlot className="w-4 h-4" />, label: "Land" },
  { icon: <Store className="w-4 h-4" />, label: "Commercial" },
];

const locations = [
  "Lekki, Lagos",
  "Victoria Island, Lagos",
  "Ikoyi, Lagos",
  "Banana Island, Lagos",
  "Ajah, Lagos",
  "Gbagada, Lagos",
  "Surulere, Lagos",
  "Ikeja, Lagos",
  "Maryland, Lagos",
  "Yaba, Lagos",
  "Magodo, Lagos",
  "Ojodu, Lagos",
];

const steps = ["details", "photos", "review"] as const;
type Step = (typeof steps)[number];

const stepLabels = {
  details: "Property Details",
  photos: "Photos & Documents",
  review: "Review & Submit",
};

const ease = [0.23, 1, 0.32, 1] as const;

const inputClass =
  "h-11 px-4 rounded-2xl bg-white/40 backdrop-blur-md border border-white/50 text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary focus:bg-white/60 focus:shadow-[0_4px_20px_rgba(31,111,67,0.08)] transition-all w-full";

const selectClass =
  "h-11 px-4 rounded-2xl bg-white/40 backdrop-blur-md border border-white/50 text-primary-dark text-sm focus:outline-none focus:border-primary focus:bg-white/60 focus:shadow-[0_4px_20px_rgba(31,111,67,0.08)] transition-all appearance-none w-full";

const labelClass =
  "text-xs font-heading font-semibold text-primary-dark mb-1.5 block";

/* ─── Component ─── */

const AddProperty = () => {
  const [currentStep, setCurrentStep] = useState<Step>("details");
  const [form, setForm] = useState<PropertyForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  const stepIndex = steps.indexOf(currentStep);

  const updateForm = (updates: Partial<PropertyForm>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!form.propertyType) newErrors.propertyType = "Select a property type";
    if (!form.title.trim()) newErrors.title = "Property title is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.location) newErrors.location = "Select a location";
    if (!form.price.trim()) newErrors.price = "Price is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (!agreedTerms) newErrors.terms = "You must agree to the terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (currentStep === "details" && !validateStep1()) return;
    if (currentStep === "review") {
      if (!validateStep3()) return;
      setSubmitted(true);
      return;
    }
    const nextIndex = stepIndex + 1;
    if (nextIndex < steps.length) {
      setErrors({});
      setCurrentStep(steps[nextIndex]);
    }
  };

  const goBack = () => {
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) {
      setErrors({});
      setCurrentStep(steps[prevIndex]);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setPhotos([]);
    setSubmitted(false);
    setAgreedTerms(false);
    setCurrentStep("details");
    setErrors({});
  };

  const addPlaceholderPhoto = () => {
    if (photos.length < 10) {
      const placeholders = [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop",
      ];
      setPhotos((prev) => [
        ...prev,
        placeholders[prev.length % placeholders.length],
      ]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const priceLabel =
    form.listingType === "sale"
      ? "Price (₦)"
      : form.listingType === "rent"
        ? "Annual Rent (₦)"
        : "Price per Night (₦)";

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
            <span className="text-primary-dark font-medium">Add Property</span>
          </div>

          {/* ─── Hero ─── */}
          <div className="relative overflow-hidden rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] mb-10">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&h=600&fit=crop)",
              }}
            />
            <div className="absolute inset-0 bg-linear-to-r from-primary-dark/90 via-primary-dark/75 to-primary-dark/40" />
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-white/5" />

            <div className="relative z-10 p-8 sm:p-10 lg:p-14">
              <h1 className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3.5rem] leading-[1.1] font-bold text-white tracking-tight">
                List Your <span className="text-white/70">Property</span>
              </h1>
              <p className="text-white/60 text-sm leading-relaxed mt-3 max-w-xl">
                Create a professional listing on PropertyLoop. All listings are
                managed by KYC-verified agents and include price history,
                verified documents, and neighbourhood intelligence.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                {[
                  { value: "8,050+", label: "Properties" },
                  { value: "1,200+", label: "Agents" },
                  { value: "98%", label: "Verified" },
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
            </div>
          </div>

          {/* ─── Step Indicator ─── */}
          {!submitted && (
            <div className="flex items-center justify-center gap-2 mb-8">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-heading font-semibold transition-all ${
                      i <= stepIndex
                        ? "backdrop-blur-md bg-primary/90 text-white shadow-lg shadow-glow/40 border border-primary/40"
                        : "backdrop-blur-md bg-white/30 text-text-secondary border border-white/50"
                    }`}
                  >
                    {i < stepIndex ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={`hidden sm:inline text-xs font-medium ${
                      i <= stepIndex ? "text-primary-dark" : "text-text-subtle"
                    }`}
                  >
                    {stepLabels[s]}
                  </span>
                  {i < steps.length - 1 && (
                    <div
                      className={`w-8 sm:w-16 h-0.5 rounded-full transition-all ${
                        i < stepIndex ? "bg-primary/80" : "bg-white/30"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ─── Form Content ─── */}
          <div className="max-w-2xl mx-auto mb-20">
            <AnimatePresence mode="wait">
              {submitted ? (
                /* ─── Success State ─── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease }}
                  className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-[28px] p-10 shadow-[0_8px_32px_rgba(0,0,0,0.06)] ring-1 ring-white/20 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/15 backdrop-blur-sm border border-primary/20 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-heading font-bold text-primary-dark text-xl">
                    Listing Submitted
                  </h3>
                  <p className="text-text-secondary text-sm mt-2 max-w-sm mx-auto">
                    Your property listing has been submitted for review. It will
                    appear on PropertyLoop once verified by our team, typically
                    within 24 hours.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                    <button
                      onClick={handleReset}
                      className="h-10 px-6 rounded-full border border-border-light bg-white/80 backdrop-blur-sm text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                    >
                      Add another property
                    </button>
                    <Link
                      to="/"
                      className="h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors duration-300 inline-flex items-center gap-2"
                    >
                      Back to home
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease }}
                >
                  {/* ─── Step 1: Property Details ─── */}
                  {currentStep === "details" && (
                    <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-[28px] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] ring-1 ring-white/20">
                      <h3 className="font-heading font-bold text-primary-dark text-lg mb-6">
                        Property Details
                      </h3>

                      <div className="flex flex-col gap-5">
                        {/* Listing type pills */}
                        <div>
                          <label className={labelClass}>Listing Type</label>
                          <div className="flex gap-2">
                            {listingTypes.map((lt) => (
                              <button
                                key={lt.value}
                                onClick={() =>
                                  updateForm({ listingType: lt.value })
                                }
                                className={`px-5 py-2 text-sm font-medium rounded-full border transition-all ${
                                  form.listingType === lt.value
                                    ? "backdrop-blur-md bg-primary/90 text-white border-primary/60 shadow-lg shadow-glow/40"
                                    : "backdrop-blur-md bg-white/30 text-text-secondary border-white/50 hover:bg-white/50 hover:border-primary hover:text-primary"
                                }`}
                              >
                                {lt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Property type */}
                        <div>
                          <label className={labelClass}>Property Type</label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {propertyTypes.map((pt) => (
                              <button
                                key={pt.label}
                                onClick={() => {
                                  updateForm({ propertyType: pt.label });
                                  if (errors.propertyType)
                                    setErrors((p) => ({
                                      ...p,
                                      propertyType: "",
                                    }));
                                }}
                                className={`flex items-center gap-2 px-4 text-nowrap py-2 rounded-full border text-sm font-medium transition-all ${
                                  form.propertyType === pt.label
                                    ? "backdrop-blur-md bg-primary/90 text-white border-primary/60 shadow-lg shadow-glow/40"
                                    : "backdrop-blur-md bg-white/30 text-text-secondary border-white/50 hover:bg-white/50 hover:border-primary hover:text-primary"
                                }`}
                              >
                                {pt.icon}
                                {pt.label}
                              </button>
                            ))}
                          </div>
                          {errors.propertyType && (
                            <p className="text-red-500 text-xs mt-1 ml-1">
                              {errors.propertyType}
                            </p>
                          )}
                        </div>

                        {/* Title */}
                        <div>
                          <label className={labelClass}>Property Title</label>
                          <input
                            type="text"
                            placeholder="e.g. Luxury 4-Bed Duplex in Lekki"
                            value={form.title}
                            onChange={(e) => {
                              updateForm({ title: e.target.value });
                              if (errors.title)
                                setErrors((p) => ({ ...p, title: "" }));
                            }}
                            className={inputClass}
                          />
                          {errors.title && (
                            <p className="text-red-500 text-xs mt-1 ml-1">
                              {errors.title}
                            </p>
                          )}
                        </div>

                        {/* Address */}
                        <div>
                          <label className={labelClass}>Property Address</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                            <input
                              type="text"
                              placeholder="Full property address"
                              value={form.address}
                              onChange={(e) => {
                                updateForm({ address: e.target.value });
                                if (errors.address)
                                  setErrors((p) => ({ ...p, address: "" }));
                              }}
                              className={`${inputClass} pl-10`}
                            />
                          </div>
                          {errors.address && (
                            <p className="text-red-500 text-xs mt-1 ml-1">
                              {errors.address}
                            </p>
                          )}
                        </div>

                        {/* Location */}
                        <div>
                          <label className={labelClass}>Location / Area</label>
                          <select
                            value={form.location}
                            onChange={(e) => {
                              updateForm({ location: e.target.value });
                              if (errors.location)
                                setErrors((p) => ({ ...p, location: "" }));
                            }}
                            className={selectClass}
                          >
                            <option value="">Select area</option>
                            {locations.map((loc) => (
                              <option key={loc} value={loc}>
                                {loc}
                              </option>
                            ))}
                          </select>
                          {errors.location && (
                            <p className="text-red-500 text-xs mt-1 ml-1">
                              {errors.location}
                            </p>
                          )}
                        </div>

                        {/* Beds + Baths */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelClass}>Bedrooms</label>
                            <input
                              type="number"
                              placeholder="0"
                              value={form.beds}
                              onChange={(e) =>
                                updateForm({ beds: e.target.value })
                              }
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>Bathrooms</label>
                            <input
                              type="number"
                              placeholder="0"
                              value={form.baths}
                              onChange={(e) =>
                                updateForm({ baths: e.target.value })
                              }
                              className={inputClass}
                            />
                          </div>
                        </div>

                        {/* Size + Year */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className={labelClass}>Size (m²)</label>
                            <input
                              type="text"
                              placeholder="e.g. 2,400"
                              value={form.size}
                              onChange={(e) =>
                                updateForm({ size: e.target.value })
                              }
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>Year Built</label>
                            <input
                              type="text"
                              placeholder="e.g. 2022"
                              value={form.yearBuilt}
                              onChange={(e) =>
                                updateForm({ yearBuilt: e.target.value })
                              }
                              className={inputClass}
                            />
                          </div>
                        </div>

                        {/* Price */}
                        <div>
                          <label className={labelClass}>{priceLabel}</label>
                          <input
                            type="text"
                            placeholder="e.g. 185,000,000"
                            value={form.price}
                            onChange={(e) => {
                              updateForm({ price: e.target.value });
                              if (errors.price)
                                setErrors((p) => ({ ...p, price: "" }));
                            }}
                            className={inputClass}
                          />
                          {errors.price && (
                            <p className="text-red-500 text-xs mt-1 ml-1">
                              {errors.price}
                            </p>
                          )}
                        </div>

                        {/* Description */}
                        <div>
                          <label className={labelClass}>Description</label>
                          <textarea
                            placeholder="Describe your property — features, condition, neighbourhood highlights..."
                            value={form.description}
                            onChange={(e) =>
                              updateForm({ description: e.target.value })
                            }
                            className="w-full h-28 px-4 py-3 rounded-2xl bg-white/40 backdrop-blur-md border border-white/50 text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary focus:bg-white/60 focus:shadow-[0_4px_20px_rgba(31,111,67,0.08)] transition-all resize-none"
                          />
                        </div>
                      </div>

                      {/* Navigation */}
                      <div className="flex items-center justify-end mt-6">
                        <motion.button
                          onClick={goNext}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-primary text-white font-heading font-semibold text-sm shadow-lg shadow-glow/40 hover:bg-primary-dark transition-colors"
                        >
                          Continue
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {/* ─── Step 2: Photos & Documents ─── */}
                  {currentStep === "photos" && (
                    <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-[28px] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] ring-1 ring-white/20">
                      <h3 className="font-heading font-bold text-primary-dark text-lg mb-6">
                        Photos & Documents
                      </h3>

                      <div className="flex flex-col gap-6">
                        {/* Photo upload */}
                        <div>
                          <label className={labelClass}>Property Photos</label>
                          <button
                            onClick={addPlaceholderPhoto}
                            className="w-full border-2 border-dashed border-white/40 rounded-2xl p-8 flex flex-col items-center gap-3 bg-white/20 backdrop-blur-md hover:border-primary hover:bg-white/40 hover:shadow-[0_4px_20px_rgba(31,111,67,0.06)] transition-all cursor-pointer"
                          >
                            <div className="w-14 h-14 rounded-full bg-white/40 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-[0_4px_16px_rgba(31,111,67,0.06)]">
                              <Camera className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-center">
                              <p className="text-primary-dark text-sm font-medium">
                                Click to add photos
                              </p>
                              <p className="text-text-subtle text-xs mt-1">
                                Up to 10 photos, max 5MB each
                              </p>
                            </div>
                          </button>

                          {/* Photo previews */}
                          {photos.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 mt-4">
                              {photos.map((photo, i) => (
                                <div
                                  key={i}
                                  className="relative rounded-xl overflow-hidden h-24 group"
                                >
                                  <img
                                    src={photo}
                                    alt={`Photo ${i + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    onClick={() => removePhoto(i)}
                                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                  {i === 0 && (
                                    <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full bg-primary/90 text-white text-[10px] font-medium">
                                      Cover
                                    </span>
                                  )}
                                </div>
                              ))}
                              {photos.length < 10 && (
                                <button
                                  onClick={addPlaceholderPhoto}
                                  className="h-24 rounded-xl border-2 border-dashed border-white/40 bg-white/20 backdrop-blur-sm flex items-center justify-center text-text-subtle hover:border-primary hover:text-primary hover:bg-white/40 transition-all"
                                >
                                  <Plus className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="h-px bg-white/30" />

                        {/* Document upload */}
                        <div>
                          <label className={labelClass}>
                            Documents (C of O, Survey Plan)
                          </label>
                          <div className="w-full border-2 border-dashed border-white/40 rounded-2xl p-6 flex items-center gap-4 bg-white/20 backdrop-blur-md hover:border-primary hover:bg-white/40 hover:shadow-[0_4px_20px_rgba(31,111,67,0.06)] transition-all cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-white/40 backdrop-blur-sm border border-white/50 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-primary-dark text-sm font-medium">
                                Upload verified documents
                              </p>
                              <p className="text-text-subtle text-xs mt-0.5">
                                PDF, JPG or PNG — max 10MB per file
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Virtual tour */}
                        <div>
                          <label className={labelClass}>
                            Virtual Tour URL (Optional)
                          </label>
                          <div className="relative">
                            <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                            <input
                              type="url"
                              placeholder="https://my360tour.com/property/..."
                              value={form.virtualTourUrl}
                              onChange={(e) =>
                                updateForm({ virtualTourUrl: e.target.value })
                              }
                              className={`${inputClass} pl-10`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Navigation */}
                      <div className="flex items-center justify-between mt-6">
                        <motion.button
                          onClick={goBack}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Back
                        </motion.button>
                        <motion.button
                          onClick={goNext}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-primary text-white font-heading font-semibold text-sm shadow-lg shadow-glow/40 hover:bg-primary-dark transition-colors"
                        >
                          Continue
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {/* ─── Step 3: Review & Submit ─── */}
                  {currentStep === "review" && (
                    <div className="flex flex-col gap-6">
                      {/* Preview card */}
                      <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                        {/* Preview image */}
                        <div className="h-48 overflow-hidden relative bg-bg-accent">
                          {photos.length > 0 ? (
                            <img
                              src={photos[0]}
                              alt="Cover"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Image className="w-10 h-10 text-text-subtle" />
                            </div>
                          )}
                          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-primary/90 backdrop-blur-sm text-white text-xs font-medium">
                            {form.listingType === "sale"
                              ? "For Sale"
                              : form.listingType === "rent"
                                ? "For Rent"
                                : "Shortlet"}
                          </span>
                          {photos.length > 1 && (
                            <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
                              <Camera className="w-3 h-3" />
                              {photos.length} photos
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="mx-3 mb-3 -mt-6 relative z-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl px-5 pt-4 pb-5 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                          <p className="font-heading font-bold text-primary-dark text-[18px]">
                            ₦{form.price || "0"}
                            {form.listingType === "rent" && (
                              <span className="text-text-secondary text-sm font-normal">
                                {" "}
                                /year
                              </span>
                            )}
                            {form.listingType === "shortlet" && (
                              <span className="text-text-secondary text-sm font-normal">
                                {" "}
                                /night
                              </span>
                            )}
                          </p>
                          <h3 className="font-heading font-bold text-primary-dark text-[15px] leading-snug mt-1">
                            {form.title || "Property Title"}
                          </h3>
                          <p className="text-text-secondary text-xs mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {form.address || "Property Address"},{" "}
                            {form.location || "Location"}
                          </p>

                          <div className="h-px bg-border-light mt-3 mb-3" />

                          <div className="flex items-center gap-4 text-text-secondary text-xs">
                            {form.beds && (
                              <span className="flex items-center gap-1.5">
                                <Bed className="w-3.5 h-3.5" />
                                {form.beds} Beds
                              </span>
                            )}
                            {form.baths && (
                              <span className="flex items-center gap-1.5">
                                <Bath className="w-3.5 h-3.5" />
                                {form.baths} Baths
                              </span>
                            )}
                            {form.size && (
                              <span className="flex items-center gap-1.5">
                                <Maximize className="w-3.5 h-3.5" />
                                {form.size}m²
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Details summary */}
                      <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
                        <h3 className="font-heading font-bold text-primary-dark text-base mb-4">
                          Listing Summary
                        </h3>
                        <div className="flex flex-col gap-3">
                          {[
                            { label: "Type", value: form.propertyType },
                            {
                              label: "Listing",
                              value:
                                form.listingType === "sale"
                                  ? "For Sale"
                                  : form.listingType === "rent"
                                    ? "For Rent"
                                    : "Shortlet",
                            },
                            { label: "Location", value: form.location },
                            { label: "Year Built", value: form.yearBuilt },
                            {
                              label: "Photos",
                              value: `${photos.length} uploaded`,
                            },
                            {
                              label: "Virtual Tour",
                              value: form.virtualTourUrl
                                ? "Provided"
                                : "Not provided",
                            },
                          ]
                            .filter((item) => item.value)
                            .map((item) => (
                              <div
                                key={item.label}
                                className="flex items-center justify-between"
                              >
                                <span className="text-text-secondary text-sm">
                                  {item.label}
                                </span>
                                <span className="font-heading font-medium text-primary-dark text-sm">
                                  {item.value}
                                </span>
                              </div>
                            ))}
                        </div>

                        {form.description && (
                          <>
                            <div className="h-px bg-border-light my-4" />
                            <p className="text-text-secondary text-sm leading-relaxed">
                              {form.description}
                            </p>
                          </>
                        )}
                      </div>

                      {/* Agent notice + Terms */}
                      <div className="bg-white/25 backdrop-blur-md rounded-2xl border border-white/40 p-5">
                        <div className="flex items-start gap-3">
                          <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="text-primary-dark text-sm font-medium">
                              Agent-Verified Listing
                            </p>
                            <p className="text-text-secondary text-xs mt-1 leading-relaxed">
                              This listing will be published under your verified
                              agent profile. All submitted information and
                              documents will be reviewed by PropertyLoop before
                              going live.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Terms checkbox */}
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreedTerms}
                          onChange={(e) => {
                            setAgreedTerms(e.target.checked);
                            if (errors.terms)
                              setErrors((p) => ({ ...p, terms: "" }));
                          }}
                          className="mt-1 w-4 h-4 rounded accent-primary"
                        />
                        <span className="text-text-secondary text-sm leading-relaxed">
                          I confirm that the information provided is accurate
                          and I agree to PropertyLoop's{" "}
                          <a href="/legal/terms" className="text-primary underline">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a href="/legal/agent-agreement" className="text-primary underline">
                            Agent Agreement
                          </a>
                          .
                        </span>
                      </label>
                      {errors.terms && (
                        <p className="text-red-500 text-xs -mt-4 ml-7">
                          {errors.terms}
                        </p>
                      )}

                      {/* Navigation */}
                      <div className="flex items-center justify-between">
                        <motion.button
                          onClick={goBack}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Back
                        </motion.button>
                        <motion.button
                          onClick={goNext}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full sm:w-auto h-12 px-10 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors duration-300 inline-flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(31,111,67,0.3)]"
                        >
                          Submit Listing
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AddProperty;
