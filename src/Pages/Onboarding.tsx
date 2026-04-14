import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RoleSelection from "../components/Onboarding/RoleSelection";
import Signup from "../components/Onboarding/Signup";
import ProfileSetup from "../components/Onboarding/ProfileSetup";
import Welcome from "../components/Onboarding/Welcome";
import Logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

export type UserRole = "buyer" | "agent" | "vendor";

export interface OnboardingData {
  role: UserRole | null;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  profilePhoto?: string;
  // Buyer-specific
  lookingFor?: string;
  preferredLocation?: string;
  budgetRange?: string;
  // Agent-specific
  agencyName?: string;
  licenseNumber?: string;
  businessAddress?: string;
  // Vendor-specific
  serviceCategory?: string;
  yearsExperience?: string;
  serviceArea?: string;
}

const steps = ["role", "signup", "setup", "welcome"] as const;
type Step = (typeof steps)[number];

const roleMap = { buyer: "BUYER", agent: "AGENT", vendor: "VENDOR" } as const;

const Onboarding = () => {
  const { signup } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>("role");
  const [signupError, setSignupError] = useState("");
  const [data, setData] = useState<OnboardingData>({
    role: null,
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const goTo = (step: Step) => setCurrentStep(step);

  const handleSignup = async () => {
    if (!data.role) return;
    setSignupError("");
    const apiRole = roleMap[data.role];
    try {
      await signup({
        name: data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
        role: apiRole,
        ...(data.role === "buyer" && {
          buyer: { preferredLocations: data.preferredLocation },
        }),
        ...(data.role === "agent" && {
          agent: {
            agencyName: data.agencyName!,
            licenseNumber: data.licenseNumber!,
            businessAddress: data.businessAddress!,
          },
        }),
        ...(data.role === "vendor" && {
          vendor: {
            serviceCategory: data.serviceCategory!,
            yearsExperience: data.yearsExperience!,
            serviceArea: data.serviceArea!,
          },
        }),
      });
      setCurrentStep("welcome");
    } catch (err: any) {
      setSignupError(
        err?.response?.data?.message || "Signup failed. Please try again.",
      );
    }
  };

  const stepIndex = steps.indexOf(currentStep);

  return (
    <div className="min-h-screen bg-bg relative overflow-hidden">
      {/* Decorative background shapes */}
      <div
        className="absolute top-0 right-0 w-150 h-150 rounded-full opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(31,111,67,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-100 h-100 rounded-full opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(31,111,67,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Top bar */}
      <div className="w-full px-6 md:px-12 lg:px-20 py-4 flex items-center justify-between relative z-10">
        <a href="/">
          <img className="w-30" src={Logo} alt="PropertyLoop" />
        </a>
        {currentStep !== "role" && currentStep !== "welcome" && (
          <div className="flex items-center gap-2">
            {steps.slice(0, 3).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-heading font-semibold transition-all ${
                    i <= stepIndex
                      ? "bg-primary text-white shadow-lg shadow-glow/40"
                      : "bg-white/60 backdrop-blur-sm text-text-secondary border border-border-light"
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
                {i < 2 && (
                  <div
                    className={`w-12 h-0.5 rounded-full transition-all ${
                      i < stepIndex ? "bg-primary" : "bg-border-light"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        )}
        <a
          href="/"
          className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
        >
          Back to Home
        </a>
      </div>

      {/* Step content */}
      <div className="relative z-10 px-6 md:px-12 lg:px-20 pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            {currentStep === "role" && (
              <RoleSelection
                selectedRole={data.role}
                onSelectRole={(role) => updateData({ role })}
                onContinue={() => goTo("signup")}
              />
            )}
            {currentStep === "signup" && (
              <Signup
                data={data}
                updateData={updateData}
                onBack={() => goTo("role")}
                onContinue={() => goTo("setup")}
              />
            )}
            {currentStep === "setup" && (
              <ProfileSetup
                data={data}
                updateData={updateData}
                onBack={() => goTo("signup")}
                onContinue={handleSignup}
                error={signupError}
              />
            )}
            {currentStep === "welcome" && <Welcome data={data} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
