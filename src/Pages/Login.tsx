import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  Lock,
  CheckCircle,
  Home,
  Briefcase,
  Wrench,
} from "lucide-react";
import Logo from "../assets/logo.png";

const ease = [0.23, 1, 0.32, 1] as const;

type UserRole = "buyer" | "agent" | "vendor";

const roleDashboard: Record<UserRole, string> = {
  buyer: "/dashboard",
  agent: "/agent-dashboard",
  vendor: "/vendor-dashboard",
};

const Login = () => {
  const { login, isRegistered } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("buyer");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      if (!isRegistered(email)) {
        setErrors({
          email: "No account found with this email. Please sign up first.",
        });
        return;
      }
      login({ name: email.split("@")[0], email, role: selectedRole });
      setSubmitted(true);
    }
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
    <div className="min-h-screen bg-bg relative overflow-hidden flex flex-col">
      {/* Decorative background */}
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
        <Link to="/">
          <img className="w-30" src={Logo} alt="PropertyLoop" />
        </Link>
        <Link
          to="/"
          className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
        >
          Back to Home
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 pb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="w-full max-w-md"
        >
          {submitted ? (
            /* ─── Success State ─── */
            <div className="backdrop-blur-md bg-white/60 rounded-[28px] border border-border-light shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-8 sm:p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/15 backdrop-blur-sm border border-primary/20 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-heading font-bold text-primary-dark text-xl">
                Welcome back!
              </h2>
              <p className="text-text-secondary text-sm mt-2">
                You've signed in successfully. Redirecting to your dashboard...
              </p>
              <Link
                to={roleDashboard[selectedRole]}
                className="mt-6 inline-flex items-center gap-2 h-11 px-8 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-glow/40"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="font-heading text-[1.8rem] sm:text-[2.2rem] font-bold text-primary-dark leading-tight">
                  Welcome back
                </h1>
                <p className="text-text-secondary font-body text-sm mt-2">
                  Sign in to your PropertyLoop account
                </p>
              </div>

              {/* Form Card */}
              <div className="backdrop-blur-md bg-white/60 rounded-[28px] border border-border-light shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                <div className="flex flex-col gap-4">
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
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email)
                            setErrors((p) => ({ ...p, email: "" }));
                        }}
                        className={inputClass}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 ml-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-heading font-semibold text-primary-dark">
                        Password
                      </label>
                      <a
                        href="/contact"
                        className="text-xs text-primary font-medium hover:underline"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <div className={wrapperClass("password")}>
                      <Lock className="absolute left-3.5 w-4 h-4 text-text-subtle" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password)
                            setErrors((p) => ({ ...p, password: "" }));
                        }}
                        className={inputClass}
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
                      <p className="text-red-500 text-xs mt-1 ml-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                {/* Role selector */}
                <div className="mt-6">
                  <label className="text-xs font-heading font-semibold text-primary-dark mb-2 block">
                    Sign in as
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        role: "buyer" as UserRole,
                        icon: <Home className="w-4 h-4" />,
                        label: "Buyer",
                      },
                      {
                        role: "agent" as UserRole,
                        icon: <Briefcase className="w-4 h-4" />,
                        label: "Agent",
                      },
                      {
                        role: "vendor" as UserRole,
                        icon: <Wrench className="w-4 h-4" />,
                        label: "Vendor",
                      },
                    ].map((item) => (
                      <button
                        key={item.role}
                        type="button"
                        onClick={() => setSelectedRole(item.role)}
                        className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border transition-all ${
                          selectedRole === item.role
                            ? "bg-primary/10 border-primary text-primary shadow-sm"
                            : "bg-white/50 border-white/40 text-text-secondary hover:border-primary/40 hover:bg-white/70"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${selectedRole === item.role ? "bg-primary text-white" : "bg-white/60 text-text-secondary"}`}
                        >
                          {item.icon}
                        </div>
                        <span className="text-xs font-medium">
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sign in button */}
                <motion.button
                  onClick={handleSubmit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 w-full h-12 rounded-full bg-primary text-white font-heading font-bold text-sm hover:bg-primary-dark transition-colors duration-300 inline-flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(31,111,67,0.3)]"
                >
                  Sign In as{" "}
                  {selectedRole === "buyer"
                    ? "Buyer / Renter"
                    : selectedRole === "agent"
                      ? "Agent"
                      : "Vendor"}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Sign up link */}
              <p className="text-center text-text-secondary text-sm mt-6">
                Don't have an account?{" "}
                <Link
                  to="/onboarding"
                  className="text-primary font-semibold hover:underline"
                >
                  Create account
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
