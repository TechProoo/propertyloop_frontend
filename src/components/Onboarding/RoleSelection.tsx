import { motion } from "framer-motion";
import type { UserRole } from "../../Pages/Onboarding";
import {
  Home,
  Briefcase,
  Wrench,
  ArrowRight,
  Search,
  BarChart3,
  ShieldCheck,
  Star,
  Wallet,
  ClipboardList,
} from "lucide-react";

interface Props {
  selectedRole: UserRole | null;
  onSelectRole: (role: UserRole) => void;
  onContinue: () => void;
}

const roles: {
  id: UserRole;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  features: { icon: React.ReactNode; text: string }[];
}[] = [
  {
    id: "buyer",
    title: "Buyer / Renter",
    subtitle: "Find your perfect home",
    description:
      "Search verified listings, view price histories, and close deals — all in one place.",
    icon: <Home className="w-6 h-6" />,
    features: [
      { icon: <Search className="w-3.5 h-3.5" />, text: "Smart property search" },
      { icon: <ShieldCheck className="w-3.5 h-3.5" />, text: "Verified agents only" },
      { icon: <ClipboardList className="w-3.5 h-3.5" />, text: "Property logbook access" },
    ],
  },
  {
    id: "agent",
    title: "Real Estate Agent",
    subtitle: "Grow your business",
    description:
      "List properties, manage leads with a built-in CRM, and track performance analytics.",
    icon: <Briefcase className="w-6 h-6" />,
    features: [
      { icon: <BarChart3 className="w-3.5 h-3.5" />, text: "CRM & analytics dashboard" },
      { icon: <Star className="w-3.5 h-3.5" />, text: "Verified agent badge" },
      { icon: <Wallet className="w-3.5 h-3.5" />, text: "In-platform transactions" },
    ],
  },
  {
    id: "vendor",
    title: "Service Vendor",
    subtitle: "Get hired for jobs",
    description:
      "Join the Service Loop as a verified plumber, electrician, builder, or other professional.",
    icon: <Wrench className="w-6 h-6" />,
    features: [
      { icon: <ShieldCheck className="w-3.5 h-3.5" />, text: "Reach KYC-verified clients" },
      { icon: <Star className="w-3.5 h-3.5" />, text: "Build your reputation" },
      { icon: <ClipboardList className="w-3.5 h-3.5" />, text: "Job booking & scheduling" },
    ],
  },
];

const cardVariants = {
  idle: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4 },
};

const RoleSelection = ({ selectedRole, onSelectRole, onContinue }: Props) => {
  return (
    <div className="max-w-4xl mx-auto pt-8 lg:pt-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3rem] font-bold text-primary-dark leading-tight">
          Welcome to{" "}
          <span className="text-primary">PropertyLoop</span>
        </h1>
        <p className="text-text-secondary font-body text-base mt-3 max-w-md mx-auto">
          How would you like to use the platform? Choose the option that best
          describes you.
        </p>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {roles.map((role) => {
          const isSelected = selectedRole === role.id;
          return (
            <motion.button
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              variants={cardVariants}
              initial="idle"
              whileHover="hover"
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className={`relative text-left rounded-[24px] p-6 border transition-all cursor-pointer ${
                isSelected
                  ? "bg-white/80 backdrop-blur-md border-primary shadow-[0_8px_32px_rgba(31,111,67,0.15)]"
                  : "bg-white/50 backdrop-blur-sm border-border-light shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:bg-white/70 hover:border-border"
              }`}
            >
              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  layoutId="selected-indicator"
                  className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-glow/40"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}

              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                  isSelected
                    ? "bg-primary text-white shadow-lg shadow-glow/30"
                    : "bg-bg-accent text-primary"
                }`}
              >
                {role.icon}
              </div>

              {/* Content */}
              <h3 className="font-heading font-bold text-primary-dark text-lg">
                {role.title}
              </h3>
              <p className="text-primary text-xs font-medium mt-0.5">
                {role.subtitle}
              </p>
              <p className="text-text-secondary text-sm mt-2 leading-relaxed">
                {role.description}
              </p>

              {/* Feature list */}
              <div className="mt-4 flex flex-col gap-2">
                {role.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-text-secondary">
                    <span className={`${isSelected ? "text-primary" : "text-primary-muted"}`}>
                      {f.icon}
                    </span>
                    <span className="text-xs">{f.text}</span>
                  </div>
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="flex justify-center mt-10">
        <motion.button
          onClick={onContinue}
          disabled={!selectedRole}
          whileHover={selectedRole ? { scale: 1.03 } : {}}
          whileTap={selectedRole ? { scale: 0.98 } : {}}
          className={`flex items-center gap-2 px-10 py-3 rounded-full font-heading font-semibold text-sm transition-all ${
            selectedRole
              ? "bg-primary text-white shadow-lg shadow-glow/40 hover:bg-primary-dark"
              : "bg-white/40 text-text-subtle border border-border-light cursor-not-allowed"
          }`}
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

export default RoleSelection;
