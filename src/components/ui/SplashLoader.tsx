import { motion } from "framer-motion";
import Logo from "../../assets/logo.png";

const SplashLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 bg-[#f5f0eb] z-[9999] flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <img src={Logo} alt="PropertyLoop" className="w-40" />
        </motion.div>

        {/* Bouncing balls */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-3 h-3 rounded-full bg-primary"
              style={{
                animation: "pl-bounce 1s infinite ease-in-out",
                animationDelay: `${i * 0.16}s`,
              }}
            />
          ))}
        </div>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-text-secondary text-sm font-medium"
        >
          Loading PropertyLoop...
        </motion.p>
      </div>
      <style>{`
        @keyframes pl-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.6; }
          40% { transform: translateY(-10px); opacity: 1; }
        }
      `}</style>
    </motion.div>
  );
};

export default SplashLoader;
