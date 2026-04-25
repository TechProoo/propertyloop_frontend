import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import listingsService from "../api/services/listings";
import type { ListingType } from "../api/types";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/client";
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
  features: string[];
  virtualTourUrl: string;
  videoUrl: string;
}

const PRESET_FEATURES = [
  "24hr Power",
  "Borehole Water",
  "Swimming Pool",
  "Gym",
  "Air Conditioning",
  "Balcony",
  "Parking Space",
  "Security",
  "CCTV",
  "Furnished",
  "WiFi / Internet",
  "Elevator",
  "Generator",
  "Solar Power",
  "Garden",
  "Servant Quarters",
  "Smart Home",
  "Fireplace",
];

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
  features: [],
  virtualTourUrl: "",
  videoUrl: "",
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
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [pendingPhotoFiles, setPendingPhotoFiles] = useState<File[]>([]);
  const [uploadingPhotoIndex, setUploadingPhotoIndex] = useState<number | null>(null);
  const [pendingDocFiles, setPendingDocFiles] = useState<File[]>([]);
  const [photoUploadError, setPhotoUploadError] = useState("");
  const [docUploadError, setDocUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const [, setUploadingVideo] = useState(false);
  const [videoUploadError, setVideoUploadError] = useState("");
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [videoInputType, setVideoInputType] = useState<"url" | "file">("url");
  const [pendingVideoFile, setPendingVideoFile] = useState<File | null>(null);
  const [useCustomLocation, setUseCustomLocation] = useState(false);
  const [customFeature, setCustomFeature] = useState("");

  const addCustomFeature = () => {
    const value = customFeature.trim();
    if (!value) return;
    if (form.features.includes(value)) {
      setCustomFeature("");
      return;
    }
    setForm((prev) => ({ ...prev, features: [...prev.features, value] }));
    setCustomFeature("");
  };

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

  const [, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const goNext = async () => {
    if (currentStep === "details" && !validateStep1()) return;
    if (currentStep === "review") {
      if (!validateStep3()) return;
      setSubmitting(true);
      setSubmitError("");
      try {
        const typeMap: Record<string, ListingType> = {
          sale: "SALE",
          rent: "RENT",
          shortlet: "SHORTLET",
        };
        if (pendingPhotoFiles.length === 0) {
          setSubmitError("Please add at least one property photo");
          return;
        }

        const uploadedUrls = await uploadPendingPhotos();
        const uploadedVideoUrl = await uploadPendingVideo();

        const created = await listingsService.create({
          title: form.title,
          type: typeMap[form.listingType] || "SALE",
          propertyType: form.propertyType,
          priceNaira: parseInt(form.price.replace(/,/g, "")) || 0,
          period:
            form.listingType === "rent"
              ? "/year"
              : form.listingType === "shortlet"
                ? "/night"
                : undefined,
          address: form.address,
          location: form.location,
          beds: parseInt(form.beds) || 0,
          baths: parseInt(form.baths) || 0,
          sqft: form.size,
          yearBuilt: form.yearBuilt,
          description: form.description,
          features: form.features,
          coverImage: uploadedUrls[0],
          images: uploadedUrls,
          virtualTourUrl: form.virtualTourUrl || undefined,
          videoUrl: uploadedVideoUrl || form.videoUrl || undefined,
        });

        if (pendingDocFiles.length > 0) {
          await uploadAndAttachDocs(created.id);
        }

        setSubmitted(true);
      } catch (err: any) {
        setSubmitError(
          err?.response?.data?.message ||
            "Failed to submit listing. Please try again.",
        );
      } finally {
        setSubmitting(false);
      }
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
    setPendingPhotoFiles([]);
    setPendingDocFiles([]);
    setPendingVideoFile(null);
    photoPreviews.forEach((url) => URL.revokeObjectURL(url));
    setPhotoPreviews([]);
    setSubmitted(false);
    setAgreedTerms(false);
    setCurrentStep("details");
    setErrors({});
  };

  const queuePhoto = (file: File) => {
    if (pendingPhotoFiles.length >= 10) return;
    const localPreview = URL.createObjectURL(file);
    setPhotoPreviews((prev) => [...prev, localPreview]);
    setPendingPhotoFiles((prev) => [...prev, file]);
  };

  const uploadPendingPhotos = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (let i = 0; i < pendingPhotoFiles.length; i++) {
      const file = pendingPhotoFiles[i];
      setUploadingPhotoIndex(i);
      const formData = new FormData();
      formData.append("file", file);
      const { fileUrl } = await api
        .post<{ fileUrl: string }>(
          "/listings/upload/photo",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        )
        .then((res) => res.data);
      urls.push(fileUrl);
    }
    setUploadingPhotoIndex(null);
    return urls;
  };

  const handlePhotoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    setPhotoUploadError("");
    if (files) {
      const MAX = 10 * 1024 * 1024; // 10MB — matches backend cap
      const rejected: string[] = [];
      Array.from(files).forEach((file) => {
        if (pendingPhotoFiles.length >= 10) return;
        if (!file.type.startsWith("image/")) {
          rejected.push(`${file.name} (not an image)`);
          return;
        }
        if (file.size > MAX) {
          rejected.push(
            `${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB > 10MB)`,
          );
          return;
        }
        queuePhoto(file);
      });
      if (rejected.length) {
        setPhotoUploadError(`Skipped: ${rejected.join(", ")}`);
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerPhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const removePhoto = (index: number) => {
    setPendingPhotoFiles((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => {
      const removed = prev[index];
      if (removed) URL.revokeObjectURL(removed);
      return prev.filter((_, i) => i !== index);
    });
  };

  const triggerDocUpload = () => {
    docInputRef.current?.click();
  };

  const handleDocInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    setDocUploadError("");
    if (files) {
      const MAX = 10 * 1024 * 1024; // 10MB — matches backend cap
      const accepted: File[] = [];
      const rejected: string[] = [];
      Array.from(files).forEach((file) => {
        if (file.size > MAX) {
          rejected.push(
            `${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB > 10MB)`,
          );
          return;
        }
        accepted.push(file);
      });
      if (accepted.length) {
        setPendingDocFiles((prev) => [...prev, ...accepted]);
      }
      if (rejected.length) {
        setDocUploadError(`Skipped: ${rejected.join(", ")}`);
      }
    }
    if (docInputRef.current) docInputRef.current.value = "";
  };

  const removeDoc = (index: number) => {
    setPendingDocFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const inferDocType = (
    name: string,
  ): "C_OF_O" | "SURVEY_PLAN" | "BUILDING_PERMIT" | "RECEIPT" => {
    const n = name.toLowerCase();
    if (n.includes("survey")) return "SURVEY_PLAN";
    if (n.includes("permit")) return "BUILDING_PERMIT";
    if (n.includes("receipt")) return "RECEIPT";
    return "C_OF_O";
  };

  const uploadAndAttachDocs = async (listingId: string) => {
    for (const file of pendingDocFiles) {
      const formData = new FormData();
      formData.append("file", file);
      const { fileUrl } = await api
        .post<{ fileUrl: string }>(
          "/listings/upload/photo",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
        )
        .then((res) => res.data);
      await listingsService.addDocument(listingId, {
        name: file.name,
        type: inferDocType(file.name),
        url: fileUrl,
      });
    }
  };

  const uploadPendingVideo = async (): Promise<string | undefined> => {
    if (!pendingVideoFile) return undefined;
    setUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append("file", pendingVideoFile);
      const { fileUrl } = await api
        .post<{ fileUrl: string }>(
          "/listings/upload/video",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 5 * 60 * 1000, // 5 min — videos take time
          },
        )
        .then((res) => res.data);
      return fileUrl;
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleVideoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    setVideoUploadError("");
    if (files?.length) {
      const file = files[0];
      if (!file.type.startsWith("video/")) {
        setVideoUploadError("Please choose a video file");
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setVideoUploadError(
          `Video is ${(file.size / 1024 / 1024).toFixed(1)}MB — must be under 50MB`,
        );
        return;
      }
      setPendingVideoFile(file);
    }
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const removePendingVideo = () => {
    setPendingVideoFile(null);
    setVideoUploadError("");
  };

  const triggerVideoUpload = () => {
    videoInputRef.current?.click();
  };

  const removeVideo = () => {
    updateForm({ videoUrl: "" });
    setVideoUploadError("");
  };

  const priceLabel =
    form.listingType === "sale"
      ? "Price (₦)"
      : form.listingType === "rent"
        ? "Annual Rent (₦)"
        : "Price per Night (₦)";

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      {submitting && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-2xl px-10 py-8 flex flex-col items-center gap-5">
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-3 h-3 rounded-full bg-primary"
                  style={{
                    animation: "ap-bounce 1s infinite ease-in-out",
                    animationDelay: `${i * 0.16}s`,
                  }}
                />
              ))}
            </div>
            <p className="text-primary-dark font-heading font-semibold text-sm">
              Submitting...
            </p>
          </div>
          <style>{`
            @keyframes ap-bounce {
              0%, 80%, 100% { transform: translateY(0); opacity: 0.6; }
              40% { transform: translateY(-10px); opacity: 1; }
            }
          `}</style>
        </div>
      )}

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
                            value={
                              useCustomLocation
                                ? "__OTHER__"
                                : locations.includes(form.location)
                                ? form.location
                                : ""
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === "__OTHER__") {
                                setUseCustomLocation(true);
                                updateForm({ location: "" });
                              } else {
                                setUseCustomLocation(false);
                                updateForm({ location: val });
                              }
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
                            <option value="__OTHER__">Other (enter manually)</option>
                          </select>
                          {useCustomLocation && (
                            <input
                              type="text"
                              placeholder="Enter your location/area"
                              value={form.location}
                              onChange={(e) => {
                                updateForm({ location: e.target.value });
                                if (errors.location)
                                  setErrors((p) => ({ ...p, location: "" }));
                              }}
                              className={`${inputClass} mt-2`}
                              autoFocus
                            />
                          )}
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

                        {/* Features & Amenities */}
                        <div>
                          <label className={labelClass}>
                            Features & Amenities
                          </label>
                          <p className="text-text-subtle text-xs mb-2">
                            Tap any that apply, or add your own.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {PRESET_FEATURES.map((f) => {
                              const selected = form.features.includes(f);
                              return (
                                <button
                                  key={f}
                                  type="button"
                                  onClick={() =>
                                    updateForm({
                                      features: selected
                                        ? form.features.filter(
                                            (x) => x !== f,
                                          )
                                        : [...form.features, f],
                                    })
                                  }
                                  className={`h-8 px-3 rounded-full text-xs font-medium border transition-all ${
                                    selected
                                      ? "bg-primary text-white border-primary"
                                      : "bg-white/50 text-primary-dark border-white/50 hover:border-primary"
                                  }`}
                                >
                                  {selected && (
                                    <CheckCircle className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />
                                  )}
                                  {f}
                                </button>
                              );
                            })}
                            {form.features
                              .filter((f) => !PRESET_FEATURES.includes(f))
                              .map((f) => (
                                <button
                                  key={f}
                                  type="button"
                                  onClick={() =>
                                    updateForm({
                                      features: form.features.filter(
                                        (x) => x !== f,
                                      ),
                                    })
                                  }
                                  className="h-8 px-3 rounded-full text-xs font-medium border bg-primary text-white border-primary inline-flex items-center gap-1.5"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  {f}
                                  <X className="w-3 h-3 opacity-70" />
                                </button>
                              ))}
                          </div>
                          <div className="mt-3 flex gap-2">
                            <input
                              type="text"
                              placeholder="Add custom feature (e.g. Boys' Quarters)"
                              value={customFeature}
                              onChange={(e) =>
                                setCustomFeature(e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addCustomFeature();
                                }
                              }}
                              className={inputClass}
                            />
                            <button
                              type="button"
                              onClick={addCustomFeature}
                              disabled={!customFeature.trim()}
                              className="h-11 px-5 rounded-2xl bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                            >
                              Add
                            </button>
                          </div>
                          {form.features.length > 0 && (
                            <p className="text-text-subtle text-[11px] mt-2">
                              {form.features.length} selected
                            </p>
                          )}
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
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handlePhotoInput}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={triggerPhotoUpload}
                            disabled={uploadingPhotoIndex !== null || pendingPhotoFiles.length >= 10}
                            className="w-full border-2 border-dashed border-white/40 rounded-2xl p-8 flex flex-col items-center gap-3 bg-white/20 backdrop-blur-md hover:border-primary hover:bg-white/40 hover:shadow-[0_4px_20px_rgba(31,111,67,0.06)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <div className="w-14 h-14 rounded-full bg-white/40 backdrop-blur-sm border border-white/50 flex items-center justify-center shadow-[0_4px_16px_rgba(31,111,67,0.06)]">
                              {uploadingPhotoIndex !== null ? (
                                <div className="animate-spin">
                                  <Camera className="w-6 h-6 text-primary" />
                                </div>
                              ) : (
                                <Camera className="w-6 h-6 text-primary" />
                              )}
                            </div>
                            <div className="text-center">
                              <p className="text-primary-dark text-sm font-medium">
                                {uploadingPhotoIndex !== null
                                  ? `Uploading ${uploadingPhotoIndex + 1}/${pendingPhotoFiles.length}...`
                                  : "Click to add photos"}
                              </p>
                              <p className="text-text-subtle text-xs mt-1">
                                {pendingPhotoFiles.length}/10 photos selected
                              </p>
                            </div>
                          </button>

                          {photoUploadError && (
                            <p className="text-xs text-red-600 mt-2 ml-1">
                              {photoUploadError}
                            </p>
                          )}

                          {/* Photo previews */}
                          {photoPreviews.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 mt-4">
                              {photoPreviews.map((preview, i) => (
                                <div
                                  key={i}
                                  className="relative rounded-xl overflow-hidden h-24 group"
                                >
                                  <img
                                    src={preview}
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
                              {pendingPhotoFiles.length < 10 && (
                                <button
                                  type="button"
                                  onClick={triggerPhotoUpload}
                                  disabled={uploadingPhotoIndex !== null}
                                  className="h-24 rounded-xl border-2 border-dashed border-white/40 bg-white/20 backdrop-blur-sm flex items-center justify-center text-text-subtle hover:border-primary hover:text-primary hover:bg-white/40 transition-all disabled:opacity-50"
                                >
                                  {uploadingPhotoIndex !== null ? (
                                    <div className="animate-spin">
                                      <Plus className="w-5 h-5" />
                                    </div>
                                  ) : (
                                    <Plus className="w-5 h-5" />
                                  )}
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
                          <input
                            ref={docInputRef}
                            type="file"
                            multiple
                            accept=".pdf,image/jpeg,image/png"
                            onChange={handleDocInput}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={triggerDocUpload}
                            className="w-full border-2 border-dashed border-white/40 rounded-2xl p-6 flex items-center gap-4 bg-white/20 backdrop-blur-md hover:border-primary hover:bg-white/40 hover:shadow-[0_4px_20px_rgba(31,111,67,0.06)] transition-all cursor-pointer text-left"
                          >
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
                          </button>

                          {docUploadError && (
                            <p className="text-xs text-red-600 mt-2 ml-1">
                              {docUploadError}
                            </p>
                          )}

                          {pendingDocFiles.length > 0 && (
                            <div className="mt-3 flex flex-col gap-2">
                              {pendingDocFiles.map((file, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/40 backdrop-blur-sm border border-white/50"
                                >
                                  <FileText className="w-4 h-4 text-primary shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-primary-dark text-sm font-medium truncate">
                                      {file.name}
                                    </p>
                                    <p className="text-text-subtle text-[11px]">
                                      {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeDoc(i)}
                                    className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center text-text-secondary hover:bg-red-100 hover:text-red-600 transition-colors"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
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

                        <div className="h-px bg-white/30" />

                        {/* Video upload */}
                        <div>
                          <label className={labelClass}>
                            Property Video (Optional)
                          </label>
                          <p className="text-text-subtle text-xs mb-3">
                            Add a video walkthrough or showcase. You can upload a file or paste a video URL.
                          </p>

                          {videoUploadError && (
                            <div className="mb-3 p-3 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-lg">
                              <p className="text-xs text-red-700">{videoUploadError}</p>
                            </div>
                          )}

                          {form.videoUrl ? (
                            <div className="relative rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm border border-white/20 p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Video className="w-5 h-5 text-primary shrink-0" />
                                  <p className="text-sm text-primary-dark font-medium truncate">
                                    {form.videoUrl.includes("youtu") ? "YouTube Video" : "Video Uploaded"}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={removeVideo}
                                  className="text-text-subtle hover:text-red-600 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : pendingVideoFile ? (
                            <div className="rounded-xl bg-white/40 backdrop-blur-sm border border-white/50 p-4">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                  <Video className="w-5 h-5 text-primary shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-sm text-primary-dark font-medium truncate">
                                      {pendingVideoFile.name}
                                    </p>
                                    <p className="text-[11px] text-text-subtle">
                                      {(pendingVideoFile.size / 1024 / 1024).toFixed(2)} MB · uploads when you submit
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={removePendingVideo}
                                  className="text-text-subtle hover:text-red-600 transition-colors shrink-0"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-3">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-px bg-white/30" />
                                <span className="text-xs text-text-subtle">OR</span>
                                <div className="flex-1 h-px bg-white/30" />
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                {/* File upload */}
                                <button
                                  type="button"
                                  onClick={triggerVideoUpload}
                                  className="border-2 border-dashed border-white/40 rounded-xl p-4 flex flex-col items-center gap-2 bg-white/20 backdrop-blur-md hover:border-primary hover:bg-white/40 transition-all"
                                >
                                  <div className="w-8 h-8 rounded-full bg-white/40 backdrop-blur-sm border border-white/50 flex items-center justify-center">
                                    <Video className="w-4 h-4 text-primary" />
                                  </div>
                                  <p className="text-xs text-primary-dark font-medium text-center">
                                    Choose Video
                                  </p>
                                  <p className="text-[10px] text-text-subtle text-center">
                                    MP4, MOV (max 50MB)
                                  </p>
                                </button>

                                {/* URL input */}
                                <div className="relative">
                                  <input
                                    type="url"
                                    placeholder="Paste video URL..."
                                    value={videoInputType === "url" && !form.videoUrl ? "" : form.videoUrl}
                                    onChange={(e) => {
                                      if (e.target.value.includes("youtu") || e.target.value.includes("vimeo")) {
                                        updateForm({ videoUrl: e.target.value });
                                      } else if (e.target.value === "") {
                                        updateForm({ videoUrl: "" });
                                      }
                                    }}
                                    onFocus={() => setVideoInputType("url")}
                                    className={`${inputClass}`}
                                  />
                                  <p className="text-[10px] text-text-subtle mt-1">
                                    YouTube or Vimeo link
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          <input
                            ref={videoInputRef}
                            type="file"
                            accept="video/*"
                            onChange={handleVideoInput}
                            className="hidden"
                          />
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
                          {photoPreviews.length > 0 ? (
                            <img
                              src={photoPreviews[0]}
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
                          {pendingPhotoFiles.length > 1 && (
                            <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
                              <Camera className="w-3 h-3" />
                              {pendingPhotoFiles.length} photos
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
                              label: "Features",
                              value:
                                form.features.length > 0
                                  ? `${form.features.length} selected`
                                  : "",
                            },
                            {
                              label: "Photos",
                              value: `${pendingPhotoFiles.length} selected`,
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
                          <a
                            href="/legal/terms"
                            className="text-primary underline"
                          >
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a
                            href="/legal/agent-agreement"
                            className="text-primary underline"
                          >
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
