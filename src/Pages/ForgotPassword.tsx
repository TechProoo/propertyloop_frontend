import { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../api/services/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import Logo from "../assets/logo.png";

const ease = [0.23, 1, 0.32, 1] as const;

type Step = "email" | "code" | "reset" | "success";

const ForgotPassword = () => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const handleSendCode = async () => {
    const next: Record<string, string> = {};
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Enter a valid email";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSending(true);
    try {
      await authService.forgotPassword(email);
      setStep("code");
    } catch (err: any) {
      setErrors({
        email: err?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setSending(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.some((c) => !c)) {
      setErrors({ code: "Enter the complete 6-digit code" });
      return;
    }
    setErrors({});
    try {
      await authService.verifyResetCode(email, code.join(""));
      setStep("reset");
    } catch (err: any) {
      setErrors({
        code: err?.response?.data?.message || "Invalid or expired code",
      });
    }
  };

  const handleResetPassword = async () => {
    const next: Record<string, string> = {};
    if (!password) next.password = "Password is required";
    else if (password.length < 8) next.password = "Use at least 8 characters";
    if (password !== confirm) next.confirm = "Passwords don't match";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    try {
      await authService.resetPassword(email, code.join(""), password);
      setStep("success");
    } catch (err: any) {
      setErrors({ password: err?.response?.data?.message || "Reset failed" });
    }
  };

  const handleCodeChange = (i: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    if (val && !/^\d$/.test(val)) return;
    const next = [...code];
    next[i] = val;
    setCode(next);
    if (val && i < 5) {
      const el = document.getElementById(`code-${i + 1}`);
      el?.focus();
    }
  };

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
          to="/login"
          className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
        >
          Back to Sign In
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 pb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="w-full max-w-md"
        >
          <AnimatePresence mode="wait">
            {/* STEP 1 — EMAIL */}
            {step === "email" && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease }}
              >
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center mx-auto mb-4">
                    <KeyRound className="w-6 h-6 text-primary" />
                  </div>
                  <h1 className="font-heading text-[1.8rem] sm:text-[2.2rem] font-bold text-primary-dark leading-tight">
                    Forgot password?
                  </h1>
                  <p className="text-text-secondary text-sm mt-2">
                    No worries — enter the email associated with your account
                    and we'll send you a reset code.
                  </p>
                </div>

                <div className="backdrop-blur-md bg-white/60 rounded-[28px] border border-border-light shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                  <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                    Email Address
                  </label>
                  <div
                    className={`relative flex items-center backdrop-blur-sm border rounded-2xl transition-all ${
                      errors.email
                        ? "bg-red-50/50 border-red-300"
                        : "bg-white/50 border-border-light focus-within:border-primary focus-within:bg-white/70"
                    }`}
                  >
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
                      className="w-full bg-transparent text-sm text-primary-dark placeholder-text-subtle outline-none py-3 pl-10 pr-4"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      {errors.email}
                    </p>
                  )}

                  <motion.button
                    onClick={handleSendCode}
                    disabled={sending}
                    whileHover={{ scale: sending ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6 w-full h-12 rounded-full bg-primary text-white font-heading font-bold text-sm hover:bg-primary-dark transition-colors duration-300 inline-flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(31,111,67,0.3)] disabled:opacity-60"
                  >
                    {sending ? "Sending code..." : "Send Reset Code"}
                    {!sending && <ArrowRight className="w-4 h-4" />}
                  </motion.button>
                </div>

                <p className="text-center text-text-secondary text-sm mt-6">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="text-primary font-semibold hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </motion.div>
            )}

            {/* STEP 2 — CODE */}
            {step === "code" && (
              <motion.div
                key="code"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease }}
              >
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                  <h1 className="font-heading text-[1.8rem] sm:text-[2.2rem] font-bold text-primary-dark leading-tight">
                    Check your email
                  </h1>
                  <p className="text-text-secondary text-sm mt-2">
                    We sent a 6-digit code to{" "}
                    <span className="font-medium text-primary-dark">
                      {email}
                    </span>
                  </p>
                </div>

                <div className="backdrop-blur-md bg-white/60 rounded-[28px] border border-border-light shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                  <label className="text-xs font-heading font-semibold text-primary-dark mb-3 block text-center">
                    Verification Code
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    {code.map((c, i) => (
                      <input
                        key={i}
                        id={`code-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={c}
                        onChange={(e) => handleCodeChange(i, e.target.value)}
                        className={`w-11 h-13 sm:w-12 sm:h-14 text-center font-heading font-bold text-primary-dark text-lg rounded-2xl bg-white/80 border transition-all ${
                          errors.code
                            ? "border-red-300"
                            : "border-border-light focus:outline-none focus:border-primary"
                        }`}
                      />
                    ))}
                  </div>
                  {errors.code && (
                    <p className="text-red-500 text-xs mt-3 text-center">
                      {errors.code}
                    </p>
                  )}

                  <motion.button
                    onClick={handleVerifyCode}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6 w-full h-12 rounded-full bg-primary text-white font-heading font-bold text-sm hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(31,111,67,0.3)]"
                  >
                    Verify Code <ArrowRight className="w-4 h-4" />
                  </motion.button>

                  <div className="flex items-center justify-between mt-5 text-xs">
                    <button
                      onClick={() => setStep("email")}
                      className="flex items-center gap-1 text-text-secondary hover:text-primary"
                    >
                      <ArrowLeft className="w-3 h-3" /> Change email
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await authService.forgotPassword(email);
                        } catch {
                          /* ignore */
                        }
                      }}
                      className="text-primary font-medium hover:underline"
                    >
                      Resend code
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3 — RESET */}
            {step === "reset" && (
              <motion.div
                key="reset"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease }}
              >
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <h1 className="font-heading text-[1.8rem] sm:text-[2.2rem] font-bold text-primary-dark leading-tight">
                    Set a new password
                  </h1>
                  <p className="text-text-secondary text-sm mt-2">
                    Choose a strong password you haven't used before.
                  </p>
                </div>

                <div className="backdrop-blur-md bg-white/60 rounded-[28px] border border-border-light shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                        New Password
                      </label>
                      <div
                        className={`relative flex items-center backdrop-blur-sm border rounded-2xl transition-all ${
                          errors.password
                            ? "bg-red-50/50 border-red-300"
                            : "bg-white/50 border-border-light focus-within:border-primary focus-within:bg-white/70"
                        }`}
                      >
                        <Lock className="absolute left-3.5 w-4 h-4 text-text-subtle" />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="At least 8 characters"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password)
                              setErrors((p) => ({ ...p, password: "" }));
                          }}
                          className="w-full bg-transparent text-sm text-primary-dark placeholder-text-subtle outline-none py-3 pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 text-text-subtle hover:text-primary"
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

                    <div>
                      <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                        Confirm Password
                      </label>
                      <div
                        className={`relative flex items-center backdrop-blur-sm border rounded-2xl transition-all ${
                          errors.confirm
                            ? "bg-red-50/50 border-red-300"
                            : "bg-white/50 border-border-light focus-within:border-primary focus-within:bg-white/70"
                        }`}
                      >
                        <Lock className="absolute left-3.5 w-4 h-4 text-text-subtle" />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Re-enter password"
                          value={confirm}
                          onChange={(e) => {
                            setConfirm(e.target.value);
                            if (errors.confirm)
                              setErrors((p) => ({ ...p, confirm: "" }));
                          }}
                          className="w-full bg-transparent text-sm text-primary-dark placeholder-text-subtle outline-none py-3 pl-10 pr-4"
                        />
                      </div>
                      {errors.confirm && (
                        <p className="text-red-500 text-xs mt-1 ml-1">
                          {errors.confirm}
                        </p>
                      )}
                    </div>
                  </div>

                  <motion.button
                    onClick={handleResetPassword}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6 w-full h-12 rounded-full bg-primary text-white font-heading font-bold text-sm hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(31,111,67,0.3)]"
                  >
                    Reset Password <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* STEP 4 — SUCCESS */}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease }}
                className="backdrop-blur-md bg-white/60 rounded-[28px] border border-border-light shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-8 sm:p-10 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-5 shadow-lg shadow-glow/40"
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="font-heading font-bold text-primary-dark text-xl">
                  Password reset successful
                </h2>
                <p className="text-text-secondary text-sm mt-2">
                  You can now sign in with your new password.
                </p>
                <Link
                  to="/login"
                  className="mt-6 inline-flex items-center gap-2 h-11 px-8 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-glow/40"
                >
                  Continue to Sign In <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
