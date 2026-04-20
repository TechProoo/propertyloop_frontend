import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Logo from "../assets/logo.png";
import authService from "../api/services/auth";

const ease = [0.23, 1, 0.32, 1] as const;

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }
    authService
      .verifyEmail(token)
      .then(() => {
        setStatus("success");
        setMessage("Your email has been verified successfully!");
      })
      .catch((err: any) => {
        setStatus("error");
        setMessage(
          err?.response?.data?.message ||
            "Verification failed. The link may have expired.",
        );
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-bg relative overflow-hidden flex flex-col">
      <div className="w-full px-6 md:px-12 lg:px-20 py-4 flex items-center justify-between relative z-10">
        <Link to="/">
          <img className="w-30" src={Logo} alt="PropertyLoop" />
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 pb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="w-full max-w-md backdrop-blur-md bg-white/60 rounded-[28px] border border-border-light shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-8 sm:p-10 text-center"
        >
          {status === "loading" && (
            <>
              <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-5">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              <h2 className="font-heading font-bold text-primary-dark text-xl">
                Verifying your email…
              </h2>
              <p className="text-text-secondary text-sm mt-2">
                Please wait while we confirm your email address.
              </p>
            </>
          )}
          {status === "success" && (
            <>
              <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-heading font-bold text-primary-dark text-xl">
                Email Verified!
              </h2>
              <p className="text-text-secondary text-sm mt-2">{message}</p>
              <Link
                to="/login"
                className="mt-6 inline-flex items-center gap-2 h-11 px-8 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-glow/40"
              >
                Go to Login
              </Link>
            </>
          )}
          {status === "error" && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="font-heading font-bold text-primary-dark text-xl">
                Verification Failed
              </h2>
              <p className="text-text-secondary text-sm mt-2">{message}</p>
              <Link
                to="/login"
                className="mt-6 inline-flex items-center gap-2 h-11 px-8 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-glow/40"
              >
                Go to Login
              </Link>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmail;
