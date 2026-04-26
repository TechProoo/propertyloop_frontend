import { useState, useRef } from "react";
import { motion } from "framer-motion";
import type { OnboardingData } from "../../Pages/Onboarding";
import {
  ArrowRight,
  ArrowLeft,
  Building2,
  FileText,
  MapPin,
  Hammer,
  Clock,
  Upload,
  Camera,
} from "lucide-react";

interface Props {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  onBack: () => void;
  onContinue: () => void | Promise<void>;
  error?: string;
  isLoading?: boolean;
}

const vendorCategories = [
  "Plumber",
  "Electrician",
  "Builder",
  "Cleaner",
  "Painter",
  "Carpenter",
  "Interior Designer",
  "HVAC Technician",
  "Landscaper",
  "Other",
];

const ProfileSetup = ({ data, updateData, onBack, onContinue, error, isLoading }: Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPhotoError("");
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file (JPG, PNG, GIF)");
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Image must be under 5MB");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      updateData({
        profilePhoto: reader.result as string,
        profilePhotoFile: file,
      });
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (data.role === "agent") {
      if (!data.agencyName?.trim())
        newErrors.agencyName = "Agency name is required";
      if (!data.licenseNumber?.trim())
        newErrors.licenseNumber = "License number is required";
      if (!data.businessAddress?.trim())
        newErrors.businessAddress = "Business address is required";
    }

    if (data.role === "vendor") {
      if (!data.serviceCategory)
        newErrors.serviceCategory = "Select a service category";
      if (!data.yearsExperience?.trim())
        newErrors.yearsExperience = "Years of experience is required";
      if (!data.serviceArea?.trim())
        newErrors.serviceArea = "Service area is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (data.role === "buyer" || validate()) onContinue();
  };

  const wrapperClass = (field: string) =>
    `relative flex items-center backdrop-blur-sm border rounded-2xl transition-all ${
      errors[field]
        ? "bg-red-50/50 border-red-300"
        : "bg-white/50 border-border-light focus-within:border-primary focus-within:bg-white/70 focus-within:shadow-[0_4px_20px_rgba(31,111,67,0.08)]"
    }`;

  const inputClass =
    "w-full bg-transparent text-sm text-primary-dark placeholder-text-subtle outline-none py-3 pl-10 pr-4";

  return (
    <div className="max-w-md mx-auto pt-8 lg:pt-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-heading text-[1.8rem] sm:text-[2.2rem] font-bold text-primary-dark leading-tight">
          {data.role === "buyer" && "Personalise your experience"}
          {data.role === "agent" && "Set up your agent profile"}
          {data.role === "vendor" && "Set up your vendor profile"}
        </h1>
        <p className="text-text-secondary font-body text-sm mt-2">
          {data.role === "buyer" &&
            "Tell us what you're looking for so we can tailor your feed."}
          {data.role === "agent" &&
            "Complete your business details to get verified."}
          {data.role === "vendor" &&
            "Tell us about your services to start receiving jobs."}
        </p>
      </div>

      {/* Form Card */}
      <div className="backdrop-blur-md bg-white/60 rounded-[28px] border border-border-light shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-6 sm:p-8">
        {/* Profile Photo Upload */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-full bg-bg-accent border-2 border-dashed border-border flex items-center justify-center cursor-pointer overflow-hidden"
            >
              {data.profilePhoto ? (
                <img
                  src={data.profilePhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-6 h-6 text-text-subtle" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-glow/40 hover:bg-primary-dark transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        {photoError && (
          <p className="text-xs text-red-600 text-center mb-4 -mt-2">
            {photoError}
          </p>
        )}

        {/* BUYER FIELDS */}
        {data.role === "buyer" && (
          <div className="flex flex-col gap-4">
            {/* Looking for */}
            <div>
              <label className="text-xs font-heading font-semibold text-primary-dark mb-2 block">
                What are you looking for?
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Buy a home",
                  "Rent a home",
                  "Shortlet stay",
                  "Just browsing",
                ].map((option) => (
                  <button
                    key={option}
                    onClick={() => updateData({ lookingFor: option })}
                    className={`px-4 py-2 text-xs font-medium rounded-full border transition-all ${
                      data.lookingFor === option
                        ? "bg-primary text-white border-primary"
                        : "border-border-light bg-white/50 backdrop-blur-sm text-text-secondary hover:bg-primary hover:text-white hover:border-primary"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Location */}
            <div>
              <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                Preferred Location
              </label>
              <div className={wrapperClass("")}>
                <MapPin className="absolute left-3.5 w-4 h-4 text-text-subtle" />
                <input
                  type="text"
                  placeholder="e.g. Lekki, Ikoyi, Victoria Island"
                  value={data.preferredLocation || ""}
                  onChange={(e) =>
                    updateData({ preferredLocation: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </div>

            {/* Budget Range */}
            <div>
              <label className="text-xs font-heading font-semibold text-primary-dark mb-2 block">
                Budget Range
              </label>
              <div className="flex flex-wrap gap-2">
                {["Under ₦50M", "₦50M – ₦100M", "₦100M – ₦300M", "₦300M+"].map(
                  (range) => (
                    <button
                      key={range}
                      onClick={() => updateData({ budgetRange: range })}
                      className={`px-4 py-2 text-xs font-medium rounded-full border transition-all ${
                        data.budgetRange === range
                          ? "bg-primary text-white border-primary"
                          : "border-border-light bg-white/50 backdrop-blur-sm text-text-secondary hover:bg-primary hover:text-white hover:border-primary"
                      }`}
                    >
                      {range}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        )}

        {/* AGENT FIELDS */}
        {data.role === "agent" && (
          <div className="flex flex-col gap-4">
            {/* Agency Name */}
            <div>
              <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                Agency / Business Name
              </label>
              <div className={wrapperClass("agencyName")}>
                <Building2 className="absolute left-3.5 w-4 h-4 text-text-subtle" />
                <input
                  type="text"
                  placeholder="Your agency or business name"
                  value={data.agencyName || ""}
                  onChange={(e) => {
                    updateData({ agencyName: e.target.value });
                    if (errors.agencyName)
                      setErrors((p) => ({ ...p, agencyName: "" }));
                  }}
                  className={inputClass}
                />
              </div>
              {errors.agencyName && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.agencyName}
                </p>
              )}
            </div>

            {/* License Number */}
            <div>
              <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                License / Registration Number
              </label>
              <div className={wrapperClass("licenseNumber")}>
                <FileText className="absolute left-3.5 w-4 h-4 text-text-subtle" />
                <input
                  type="text"
                  placeholder="e.g. NIESV/2024/001234"
                  value={data.licenseNumber || ""}
                  onChange={(e) => {
                    updateData({ licenseNumber: e.target.value });
                    if (errors.licenseNumber)
                      setErrors((p) => ({ ...p, licenseNumber: "" }));
                  }}
                  className={inputClass}
                />
              </div>
              {errors.licenseNumber && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.licenseNumber}
                </p>
              )}
            </div>

            {/* Business Address */}
            <div>
              <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                Business Address
              </label>
              <div className={wrapperClass("businessAddress")}>
                <MapPin className="absolute left-3.5 w-4 h-4 text-text-subtle" />
                <input
                  type="text"
                  placeholder="Office address"
                  value={data.businessAddress || ""}
                  onChange={(e) => {
                    updateData({ businessAddress: e.target.value });
                    if (errors.businessAddress)
                      setErrors((p) => ({ ...p, businessAddress: "" }));
                  }}
                  className={inputClass}
                />
              </div>
              {errors.businessAddress && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.businessAddress}
                </p>
              )}
            </div>

          </div>
        )}

        {/* VENDOR FIELDS */}
        {data.role === "vendor" && (
          <div className="flex flex-col gap-4">
            {/* Service Category */}
            <div>
              <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                Service Category
              </label>
              <div className={wrapperClass("serviceCategory")}>
                <Hammer className="absolute left-3.5 w-4 h-4 text-text-subtle" />
                <select
                  value={data.serviceCategory || ""}
                  onChange={(e) => {
                    updateData({ serviceCategory: e.target.value });
                    if (errors.serviceCategory)
                      setErrors((p) => ({ ...p, serviceCategory: "" }));
                  }}
                  className="w-full bg-transparent text-sm text-primary-dark outline-none py-3 pl-10 pr-4 appearance-none"
                >
                  <option value="" disabled>
                    Select your trade
                  </option>
                  {vendorCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              {errors.serviceCategory && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.serviceCategory}
                </p>
              )}
            </div>

            {/* Years Experience */}
            <div>
              <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                Years of Experience
              </label>
              <div className={wrapperClass("yearsExperience")}>
                <Clock className="absolute left-3.5 w-4 h-4 text-text-subtle" />
                <input
                  type="text"
                  placeholder="e.g. 5 years"
                  value={data.yearsExperience || ""}
                  onChange={(e) => {
                    updateData({ yearsExperience: e.target.value });
                    if (errors.yearsExperience)
                      setErrors((p) => ({ ...p, yearsExperience: "" }));
                  }}
                  className={inputClass}
                />
              </div>
              {errors.yearsExperience && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.yearsExperience}
                </p>
              )}
            </div>

            {/* Service Area */}
            <div>
              <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                Primary Service Area
              </label>
              <div className={wrapperClass("serviceArea")}>
                <MapPin className="absolute left-3.5 w-4 h-4 text-text-subtle" />
                <input
                  type="text"
                  placeholder="e.g. Lekki, Ajah, Victoria Island"
                  value={data.serviceArea || ""}
                  onChange={(e) => {
                    updateData({ serviceArea: e.target.value });
                    if (errors.serviceArea)
                      setErrors((p) => ({ ...p, serviceArea: "" }));
                  }}
                  className={inputClass}
                />
              </div>
              {errors.serviceArea && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.serviceArea}
                </p>
              )}
            </div>

          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-between mt-6">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </motion.button>

          <motion.button
            onClick={handleContinue}
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.03 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-primary text-white font-heading font-semibold text-sm shadow-lg shadow-glow/40 hover:bg-primary-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                {data.role === "buyer" ? "Finish" : "Submit for Verification"}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
        {error && (
          <p className="text-red-500 text-sm text-center mt-3">{error}</p>
        )}
      </div>
    </div>
  );
};

export default ProfileSetup;
