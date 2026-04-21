import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, CheckCircle, AlertCircle, LogOut, RefreshCw } from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import authService from "../api/services/auth";
import { useAuth } from "../context/AuthContext";

const ease = [0.23, 1, 0.32, 1] as const;

const VerifyEmailRequired = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleResend = async () => {
    setSending(true);
    setMessage(null);
    try {
      await authService.resendVerification();
      setMessage({
        type: "success",
        text: "Verification email sent! Check your inbox.",
      });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error?.response?.data?.message || "Failed to resend verification email.",
      });
    } finally {
      setSending(false);
    }
  };

  const handleCheckVerification = async () => {
    setSending(true);
    try {
      await refreshUser?.();
    } catch {
      /* ignore */
    }
    setSending(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#f5f0eb] flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-sm border border-border-light rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-8 sm:p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-heading font-bold text-primary-dark text-2xl mb-2">
              Verify Your Email
            </h1>
            <p className="text-text-secondary text-sm mb-6">
              We sent a verification link to
            </p>
            <p className="font-heading font-bold text-primary-dark text-base mb-6 break-all">
              {user?.email}
            </p>
            <p className="text-text-secondary text-sm mb-8">
              Please check your inbox and click the verification link to activate your account.
            </p>

            {message && (
              <div
                className={`mb-6 p-4 rounded-2xl border flex items-start gap-2 text-sm text-left ${
                  message.type === "success"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleResend}
                disabled={sending}
                className="w-full h-11 px-6 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Mail className="w-4 h-4" />
                {sending ? "Sending..." : "Resend Verification Email"}
              </button>
              <button
                onClick={handleCheckVerification}
                disabled={sending}
                className="w-full h-11 px-6 rounded-full border border-border-light bg-white/80 text-primary-dark text-sm font-medium hover:border-primary hover:text-primary transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <RefreshCw className="w-4 h-4" />
                I've Verified — Refresh
              </button>
              <button
                onClick={handleLogout}
                className="w-full h-11 px-6 rounded-full text-text-secondary text-sm font-medium hover:text-red-600 transition-colors inline-flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-text-secondary text-xs">
              Didn't receive the email? Check your spam folder or{" "}
              <button
                onClick={handleResend}
                className="text-primary hover:underline font-medium"
              >
                resend
              </button>
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default VerifyEmailRequired;
