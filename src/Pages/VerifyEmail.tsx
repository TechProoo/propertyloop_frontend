import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Mail, ArrowRight } from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import authService from "../api/services/auth";

const ease = [0.23, 1, 0.32, 1] as const;
type VerificationStatus = "verifying" | "success" | "error" | "invalid";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<VerificationStatus>("verifying");
  const [errorMessage, setErrorMessage] = useState("");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      setErrorMessage("Verification link is missing or invalid.");
      return;
    }

    const verifyToken = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus("success");
        setTimeout(() => { navigate("/login"); }, 3000);
      } catch (error: any) {
        setStatus("error");
        setErrorMessage(
          error?.response?.data?.message ||
          "Email verification failed. The link may have expired."
        );
      }
    };

    verifyToken();
  }, [token, navigate]);

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
            {status === "verifying" && (
              <>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h1 className="font-heading font-bold text-primary-dark text-2xl mb-2">Verifying Email</h1>
                <p className="text-text-secondary text-sm mb-8">Please wait while we verify your email address...</p>
                <div className="flex gap-1 justify-center">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-primary"
                      style={{ animation: `bounce 1.4s infinite`, animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </>
            )}

            {status === "success" && (
              <>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
                  className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </motion.div>
                <h1 className="font-heading font-bold text-primary-dark text-2xl mb-2">Email Verified!</h1>
                <p className="text-text-secondary text-sm mb-8">Your email has been successfully verified. You can now log in to your account.</p>
                <div className="p-4 rounded-2xl bg-green-50 border border-green-200 mb-8">
                  <p className="text-green-700 text-xs font-medium">Redirecting to login in 3 seconds...</p>
                </div>
                <button onClick={() => navigate("/login")}
                  className="w-full h-11 px-6 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" /> Go to Login
                </button>
              </>
            )}

            {status === "error" && (
              <>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
                  className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6"
                >
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </motion.div>
                <h1 className="font-heading font-bold text-primary-dark text-2xl mb-2">Verification Failed</h1>
                <p className="text-text-secondary text-sm mb-2">{errorMessage}</p>
                <p className="text-text-secondary text-xs mb-8">The verification link may have expired. Please try signing up again.</p>
                <div className="space-y-2">
                  <button onClick={() => navigate("/signup")}
                    className="w-full h-11 px-6 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4" /> Sign Up Again
                  </button>
                  <button onClick={() => navigate("/")}
                    className="w-full h-11 px-6 rounded-full border border-border-light text-primary-dark text-sm font-medium hover:border-primary hover:text-primary transition-colors"
                  >
                    Go Home
                  </button>
                </div>
              </>
            )}

            {status === "invalid" && (
              <>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
                  className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-6"
                >
                  <AlertCircle className="w-8 h-8 text-amber-600" />
                </motion.div>
                <h1 className="font-heading font-bold text-primary-dark text-2xl mb-2">Invalid Link</h1>
                <p className="text-text-secondary text-sm mb-8">The verification link is missing or invalid. Please check your email again.</p>
                <div className="space-y-2">
                  <button onClick={() => navigate("/login")}
                    className="w-full h-11 px-6 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4" /> Go to Login
                  </button>
                  <button onClick={() => navigate("/")}
                    className="w-full h-11 px-6 rounded-full border border-border-light text-primary-dark text-sm font-medium hover:border-primary hover:text-primary transition-colors"
                  >
                    Go Home
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="mt-8 text-center">
            <p className="text-text-secondary text-xs">
              Questions? <a href="/help" className="text-primary hover:underline">Contact support</a>
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

export default VerifyEmail;
