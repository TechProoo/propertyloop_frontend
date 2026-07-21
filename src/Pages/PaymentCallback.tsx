import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import paymentsService from "../api/services/payments";

const ease = [0.23, 1, 0.32, 1] as const;

type State = "verifying" | "secured" | "pending";

/**
 * Paystack redirects the buyer here after a web escrow checkout
 * (`FRONTEND_URL/payment-callback?jobId=…&reference=…`). We actively verify the
 * charge with the backend (which locks escrow - idempotent with the webhook) so
 * the buyer sees "secured" immediately instead of waiting on the webhook.
 */
const PaymentCallback = () => {
  const [params] = useSearchParams();
  const [state, setState] = useState<State>("verifying");
  // Paystack appends `reference` (and legacy `trxref`) to the callback URL.
  const reference = params.get("reference") ?? params.get("trxref") ?? "";

  useEffect(() => {
    let cancelled = false;
    const verify = async () => {
      if (!reference) {
        setState("pending");
        return;
      }
      // Retry a few times - the charge can take a beat to settle on Paystack's side.
      for (let attempt = 0; attempt < 4; attempt++) {
        try {
          const res = await paymentsService.verifyPayment(reference);
          if (cancelled) return;
          if (res.escrowStatus === "LOCKED" || res.escrowStatus === "RELEASED") {
            setState("secured");
            return;
          }
        } catch {
          /* transient - retry */
        }
        await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
        if (cancelled) return;
      }
      if (!cancelled) setState("pending");
    };
    verify();
    return () => {
      cancelled = true;
    };
  }, [reference]);

  return (
    <div className="min-h-screen bg-[#f5f0eb] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease }}
        className="w-full max-w-md bg-white/80 backdrop-blur-md border border-white/50 rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-8 sm:p-10 text-center"
      >
        {state === "verifying" && (
          <>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <h1 className="font-heading font-bold text-primary-dark text-2xl">
              Confirming your payment…
            </h1>
            <p className="text-text-secondary text-sm mt-2 leading-relaxed">
              Hold on a moment while we confirm the transaction with Paystack.
            </p>
          </>
        )}

        {state === "secured" && (
          <>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-heading font-bold text-primary-dark text-2xl">
              Payment secured
            </h1>
            <p className="text-text-secondary text-sm mt-2 leading-relaxed">
              Your money is held safely in escrow. The vendor can now start the
              job, and nothing is released until you confirm the work is done.
            </p>
            <Link
              to="/dashboard"
              className="mt-6 inline-flex items-center justify-center h-11 px-8 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-glow/30"
            >
              Back to my bookings
            </Link>
          </>
        )}

        {state === "pending" && (
          <>
            <div className="w-16 h-16 rounded-full bg-[#FFF8ED] flex items-center justify-center mx-auto mb-5">
              <AlertCircle className="w-8 h-8 text-[#F5A623]" />
            </div>
            <h1 className="font-heading font-bold text-primary-dark text-2xl">
              Still confirming
            </h1>
            <p className="text-text-secondary text-sm mt-2 leading-relaxed">
              If you completed the payment, your booking will show as secured in
              a moment or two - check your dashboard. You haven't been charged
              twice.
            </p>
            <Link
              to="/dashboard"
              className="mt-6 inline-flex items-center justify-center h-11 px-8 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-glow/30"
            >
              Back to my bookings
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentCallback;
