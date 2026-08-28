/**
 * Vendor-only onboarding step: post the first bookable service.
 *
 * Mirrors the app's vendor-first-service screen. This runs *after* signup, so
 * the vendor is authenticated and the service can be POSTed straight away. It
 * matters: a vendor with an empty menu has no price to book against, so the
 * directory and their profile both read "Contact for pricing" and no buyer can
 * hire them.
 */
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, ShieldCheck, Tag, FileText } from "lucide-react";

const DURATIONS = ["1-2 hrs", "2-3 hrs", "4-6 hrs", "Full day"] as const;
const FEE_RATE = 0.1;

export interface FirstServiceDraft {
  name: string;
  description: string;
  priceNaira: number;
  priceMode: "FIXED" | "FROM";
  duration: string;
}

interface Props {
  vendorCategory?: string;
  onBack: () => void;
  onSubmit: (draft: FirstServiceDraft) => void | Promise<void>;
  onSkip: () => void;
  error?: string;
  isLoading?: boolean;
}

const FirstService = ({
  vendorCategory,
  onBack,
  onSubmit,
  onSkip,
  error,
  isLoading,
}: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [priceMode, setPriceMode] = useState<"FIXED" | "FROM">("FIXED");
  const [duration, setDuration] = useState<string>(DURATIONS[1]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const priceNum = Number(price.replace(/[^\d]/g, "")) || 0;
  const net = useMemo(
    () => Math.round(priceNum * (1 - FEE_RATE)),
    [priceNum],
  );

  // Mirrors the backend DTO: name 2-80, description 5-400, price > 0.
  const validate = () => {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Give the service a name.";
    if (description.trim().length < 5)
      next.description = "Say what the customer gets for this price.";
    if (priceNum <= 0) next.price = "Set a price above zero.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (isLoading) return;
    if (!validate()) return;
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      priceNaira: priceNum,
      priceMode,
      duration,
    });
  };

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
        <h1 className="font-heading text-[1.8rem] sm:text-[2.2rem] font-bold text-primary-dark leading-tight">
          Your first service
        </h1>
        <p className="text-text-secondary font-body text-sm mt-2">
          Customers book a service, not a profile. Post one now and you're
          hireable straight away - you can add more any time.
        </p>
      </div>

      <div className="backdrop-blur-md bg-white/60 rounded-[28px] border border-border-light shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-6 sm:p-8">
        {/* Name */}
        <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
          Service name
        </label>
        <div className={wrapperClass("name")}>
          <Tag className="w-4 h-4 text-text-subtle absolute left-3.5" />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            placeholder={
              vendorCategory
                ? `e.g. Standard ${vendorCategory.toLowerCase()} callout`
                : "e.g. Standard home clean"
            }
            className="w-full bg-transparent text-sm text-primary-dark placeholder-text-subtle outline-none py-3 pl-10 pr-4"
          />
        </div>
        {errors.name && (
          <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>
        )}

        {/* Description */}
        <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block mt-5">
          What's included
        </label>
        <div className={`${wrapperClass("description")} items-start`}>
          <FileText className="w-4 h-4 text-text-subtle absolute left-3.5 top-3.5" />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={400}
            rows={3}
            placeholder="What does the customer get for this price?"
            className="w-full bg-transparent text-sm text-primary-dark placeholder-text-subtle outline-none py-3 pl-10 pr-4 resize-none"
          />
        </div>
        {errors.description && (
          <p className="text-red-500 text-xs mt-1.5">{errors.description}</p>
        )}

        {/* Price mode */}
        <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block mt-5">
          Pricing
        </label>
        <div className="flex gap-2">
          {(
            [
              { key: "FIXED" as const, label: "Fixed price" },
              { key: "FROM" as const, label: "Starting from" },
            ]
          ).map((m) => {
            const on = priceMode === m.key;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => setPriceMode(m.key)}
                aria-pressed={on}
                className={`flex-1 h-10 rounded-full text-xs font-bold transition-all ${
                  on
                    ? "bg-primary text-white shadow-lg shadow-glow/30"
                    : "bg-white/60 border border-border-light text-text-secondary hover:border-primary/40"
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Price */}
        <div className={`${wrapperClass("price")} mt-3`}>
          <span className="absolute left-3.5 text-base font-bold text-text-subtle">
            ₦
          </span>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))}
            inputMode="numeric"
            placeholder="0"
            className="w-full bg-transparent text-sm text-primary-dark placeholder-text-subtle outline-none py-3 pl-10 pr-4"
          />
        </div>
        {errors.price ? (
          <p className="text-red-500 text-xs mt-1.5">{errors.price}</p>
        ) : (
          priceNum > 0 && (
            <p className="text-text-subtle text-xs mt-1.5">
              You keep ₦{net.toLocaleString()} after the 10% fee
            </p>
          )
        )}

        {/* Duration */}
        <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block mt-5">
          Typical duration
        </label>
        <div className="grid grid-cols-4 gap-2">
          {DURATIONS.map((d) => {
            const on = duration === d;
            return (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                aria-pressed={on}
                className={`h-10 rounded-full text-[11px] font-bold transition-all ${
                  on
                    ? "bg-primary text-white shadow-lg shadow-glow/30"
                    : "bg-white/60 border border-border-light text-text-secondary hover:border-primary/40"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>

        {/* Fee explainer */}
        <div className="mt-5 rounded-2xl bg-primary-soft px-4 py-3.5 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-primary-ink shrink-0 mt-0.5" />
          <div>
            <p className="text-primary-ink text-xs font-bold">
              How you get paid
            </p>
            <p className="text-primary-ink/80 text-[11.5px] leading-relaxed mt-1">
              Customers pay your listed price into escrow. Once they confirm the
              job's done, PropertyLoop releases your share (minus a 10% platform
              fee) to your bank.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between mt-6">
          <motion.button
            onClick={onBack}
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.03 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </motion.button>

          <motion.button
            onClick={handleSubmit}
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.03 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-primary text-white font-heading font-semibold text-sm shadow-lg shadow-glow/40 hover:bg-primary-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Post service
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mt-3">{error}</p>
        )}

        <button
          onClick={onSkip}
          disabled={isLoading}
          className="w-full text-center text-xs text-text-secondary hover:text-primary transition-colors mt-4 disabled:opacity-50"
        >
          I'll add this later
        </button>
      </div>
    </div>
  );
};

export default FirstService;
