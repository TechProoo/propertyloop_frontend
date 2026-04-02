import { useEffect } from "react";
import { motion } from "framer-motion";
import type { OnboardingData } from "../../Pages/Onboarding";
import { useAuth } from "../../context/AuthContext";
import {
  CheckCircle2,
  Search,
  LayoutDashboard,
  Briefcase,
  ArrowRight,
} from "lucide-react";

interface Props {
  data: OnboardingData;
}

const roleConfig = {
  buyer: {
    heading: "You're all set!",
    subheading: "Start exploring verified properties across Nigeria.",
    cta: "Browse Properties",
    ctaHref: "/dashboard",
    features: [
      {
        icon: <Search className="w-5 h-5" />,
        title: "Search Properties",
        desc: "Browse thousands of verified listings with price history and neighbourhood data.",
      },
      {
        icon: <LayoutDashboard className="w-5 h-5" />,
        title: "Save & Compare",
        desc: "Save your favourite listings and get alerts when new matches appear.",
      },
      {
        icon: <Briefcase className="w-5 h-5" />,
        title: "Close the Deal",
        desc: "Make offers, sign agreements, and manage payments — all in-platform.",
      },
    ],
  },
  agent: {
    heading: "Application submitted!",
    subheading:
      "We'll verify your details and activate your agent profile within 24–48 hours.",
    cta: "Go to Dashboard",
    ctaHref: "/agent-dashboard",
    features: [
      {
        icon: <LayoutDashboard className="w-5 h-5" />,
        title: "Agent CRM",
        desc: "Manage leads, track your pipeline, and view per-listing analytics.",
      },
      {
        icon: <Search className="w-5 h-5" />,
        title: "List Properties",
        desc: "Upload listings with photos, virtual tours, and verified documents.",
      },
      {
        icon: <Briefcase className="w-5 h-5" />,
        title: "Close Deals",
        desc: "Handle offers, e-signing, and escrow payments seamlessly.",
      },
    ],
  },
  vendor: {
    heading: "Application submitted!",
    subheading:
      "We'll verify your profile and onboard you to the Service Loop within 24–48 hours.",
    cta: "Go to Dashboard",
    ctaHref: "/vendor-dashboard",
    features: [
      {
        icon: <Briefcase className="w-5 h-5" />,
        title: "Receive Job Requests",
        desc: "Get notified when homeowners in your area need your services.",
      },
      {
        icon: <LayoutDashboard className="w-5 h-5" />,
        title: "Manage Your Schedule",
        desc: "Accept or decline jobs and manage your calendar in one place.",
      },
      {
        icon: <Search className="w-5 h-5" />,
        title: "Build Your Reputation",
        desc: "Earn reviews and ratings that help you win more jobs over time.",
      },
    ],
  },
};

const Welcome = ({ data }: Props) => {
  const { login } = useAuth();
  const config = roleConfig[data.role!];

  useEffect(() => {
    if (data.fullName && data.email && data.role) {
      login({ name: data.fullName, email: data.email, role: data.role });
    }
  }, [data.fullName, data.email, data.role, login]);

  return (
    <div className="max-w-lg mx-auto pt-8 lg:pt-16">
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
          className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-[0_8px_32px_rgba(31,111,67,0.3)]"
        >
          <CheckCircle2 className="w-10 h-10 text-white" />
        </motion.div>
      </div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <h1 className="font-heading text-[1.8rem] sm:text-[2.5rem] font-bold text-primary-dark leading-tight">
          {config.heading}
        </h1>
        <p className="text-text-secondary font-body text-sm mt-2 max-w-sm mx-auto">
          {config.subheading}
        </p>
      </motion.div>

      {/* Welcome name */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-8"
      >
        <p className="text-primary-dark font-heading font-semibold text-lg">
          Welcome, {data.fullName.split(" ")[0]}
        </p>
      </motion.div>

      {/* What's next cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="backdrop-blur-md bg-white/60 rounded-[28px] border border-border-light shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-6 sm:p-8"
      >
        <h3 className="font-heading font-bold text-primary-dark text-sm mb-5">
          What you can do next
        </h3>

        <div className="flex flex-col gap-4">
          {config.features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex gap-4 items-start"
            >
              <div className="w-10 h-10 rounded-2xl bg-bg-accent border border-border-light flex items-center justify-center text-primary shrink-0">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-heading font-semibold text-primary-dark text-sm">
                  {feature.title}
                </h4>
                <p className="text-text-secondary text-xs mt-0.5 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center mt-8"
      >
        <motion.a
          href={config.ctaHref}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-10 py-3 rounded-full bg-primary text-white font-heading font-semibold text-sm shadow-lg shadow-glow/40 hover:bg-primary-dark transition-colors"
        >
          {config.cta}
          <ArrowRight className="w-4 h-4" />
        </motion.a>
      </motion.div>
    </div>
  );
};

export default Welcome;
