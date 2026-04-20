import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actions: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
    icon?: ReactNode;
  }[];
  suggestions?: {
    icon: ReactNode;
    label: string;
    onClick: () => void;
  }[];
}

const EmptyState = ({
  icon,
  title,
  description,
  actions,
  suggestions,
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-12 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary">
        {icon}
      </div>

      <h2 className="font-heading font-bold text-primary-dark text-2xl mb-3">
        {title}
      </h2>

      <p className="text-text-secondary text-sm mb-8 max-w-md mx-auto">
        {description}
      </p>

      {/* Action Buttons */}
      {actions.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick}
              className={`h-11 px-6 rounded-full text-sm font-bold inline-flex items-center justify-center gap-2 transition-all ${
                action.variant === "secondary"
                  ? "border border-border-light bg-white/80 text-primary-dark hover:bg-primary hover:text-white hover:border-primary"
                  : "bg-primary text-white hover:bg-primary-dark"
              }`}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Suggestions Grid */}
      {suggestions && suggestions.length > 0 && (
        <div className="bg-primary/5 rounded-2xl p-6 mt-8">
          <p className="text-text-secondary text-xs uppercase tracking-widest font-semibold mb-4">
            Browse by Category
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={suggestion.onClick}
                className="p-3 rounded-xl bg-white/60 hover:bg-white/80 transition-colors text-center"
              >
                <div className="flex justify-center mb-2 text-primary">
                  {suggestion.icon}
                </div>
                <p className="font-heading font-semibold text-primary-dark text-xs">
                  {suggestion.label}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;
