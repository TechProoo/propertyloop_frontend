import { useState } from "react";
import { motion } from "framer-motion";
import type { OnboardingData } from "../../Pages/Onboarding";
import {
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
} from "lucide-react";

interface Props {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  onBack: () => void;
  onContinue: () => void;
}

const roleLabels = {
  buyer: "Buyer / Renter",
  agent: "Real Estate Agent",
  vendor: "Service Vendor",
};

const Signup = ({ data, updateData, onBack, onContinue }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!data.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!data.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      newErrors.email = "Enter a valid email";
    if (!data.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^(\+?234|0)[789]\d{9}$/.test(data.phone.replace(/\s/g, "")))
      newErrors.phone = "Enter a valid Nigerian phone number";
    if (!data.password) newErrors.password = "Password is required";
    else if (data.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) onContinue();
  };

  const inputClass = (field: string) =>
    `w-full bg-transparent text-sm text-primary-dark placeholder-text-subtle outline-none py-3 pl-10 pr-4 ${
      errors[field] ? "" : ""
    }`;

  const wrapperClass = (field: string) =>
    `relative flex items-center backdrop-blur-sm border rounded-2xl transition-all ${
      errors[field]
        ? "bg-red-50/50 border-red-300"
        : "bg-white/50 border-border-light focus-within:border-primary focus-within:bg-white/70 focus-within:shadow-[0_4px_20px_rgba(31,111,67,0.08)]"
    }`;

  return (
    <div className="max-w-md mx-auto pt-8 lg:pt-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block px-4 py-1 rounded-full bg-bg-accent border border-border-light text-xs font-medium text-primary mb-4">
          {roleLabels[data.role!]}
        </div>
        <h1 className="font-heading text-[1.8rem] sm:text-[2.2rem] font-bold text-primary-dark leading-tight">
          Create your account
        </h1>
        <p className="text-text-secondary font-body text-sm mt-2">
          Enter your details to get started on PropertyLoop
        </p>
      </div>

      {/* Form Card */}
      <div className="backdrop-blur-md bg-white/60 rounded-[28px] border border-border-light shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-6 sm:p-8">
        <div className="flex flex-col gap-4">
          {/* Full Name */}
          <div>
            <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
              Full Name
            </label>
            <div className={wrapperClass("fullName")}>
              <User className="absolute left-3.5 w-4 h-4 text-text-subtle" />
              <input
                type="text"
                placeholder="Enter your full name"
                value={data.fullName}
                onChange={(e) => {
                  updateData({ fullName: e.target.value });
                  if (errors.fullName) setErrors((p) => ({ ...p, fullName: "" }));
                }}
                className={inputClass("fullName")}
              />
            </div>
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
              Email Address
            </label>
            <div className={wrapperClass("email")}>
              <Mail className="absolute left-3.5 w-4 h-4 text-text-subtle" />
              <input
                type="email"
                placeholder="you@example.com"
                value={data.email}
                onChange={(e) => {
                  updateData({ email: e.target.value });
                  if (errors.email) setErrors((p) => ({ ...p, email: "" }));
                }}
                className={inputClass("email")}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
              Phone Number
            </label>
            <div className={wrapperClass("phone")}>
              <Phone className="absolute left-3.5 w-4 h-4 text-text-subtle" />
              <input
                type="tel"
                placeholder="+234 800 000 0000"
                value={data.phone}
                onChange={(e) => {
                  updateData({ phone: e.target.value });
                  if (errors.phone) setErrors((p) => ({ ...p, phone: "" }));
                }}
                className={inputClass("phone")}
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
              Password
            </label>
            <div className={wrapperClass("password")}>
              <Lock className="absolute left-3.5 w-4 h-4 text-text-subtle" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={data.password}
                onChange={(e) => {
                  updateData({ password: e.target.value });
                  if (errors.password) setErrors((p) => ({ ...p, password: "" }));
                }}
                className={inputClass("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-text-subtle hover:text-primary transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>
            )}
          </div>
        </div>

        {/* Terms */}
        <p className="text-text-subtle text-[11px] mt-5 leading-relaxed text-center">
          By creating an account, you agree to PropertyLoop's{" "}
          <a href="#" className="text-primary underline">Terms of Service</a> and{" "}
          <a href="#" className="text-primary underline">Privacy Policy</a>.
        </p>

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
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-primary text-white font-heading font-semibold text-sm shadow-lg shadow-glow/40 hover:bg-primary-dark transition-colors"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Sign in link */}
      <p className="text-center text-text-secondary text-sm mt-6">
        Already have an account?{" "}
        <a href="#" className="text-primary font-semibold hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
};

export default Signup;
