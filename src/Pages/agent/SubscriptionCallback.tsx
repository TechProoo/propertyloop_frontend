import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { C, PrimaryButton, BouncyLoader } from "../../components/agent/ui";
import subscriptionsService from "../../api/services/subscriptions";

type Phase = "checking" | "active" | "pending";

/**
 * Landing page Paystack redirects to after subscription checkout
 * (FRONTEND_URL/agent/subscription/callback?ref=...). The subscription is
 * activated server-side by the Paystack webhook, so we poll the live
 * subscription a few times until it flips to a paid ACTIVE tier, then refresh
 * the user. If it hasn't landed in time we show an honest "processing" state —
 * the webhook will still complete it.
 */
export default function SubscriptionCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [phase, setPhase] = useState<Phase>("checking");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let cancelled = false;
    const reference = params.get("ref") || params.get("reference");

    const poll = async () => {
      for (let attempt = 0; attempt < 8 && !cancelled; attempt++) {
        try {
          const sub = await subscriptionsService.get();
          if (
            sub.status === "ACTIVE" &&
            (sub.tier === "STANDARD" || sub.tier === "PRO")
          ) {
            await refreshUser();
            if (!cancelled) setPhase("active");
            return;
          }
        } catch {
          /* keep polling */
        }
        await new Promise((r) => setTimeout(r, 2000));
      }
      if (!cancelled) {
        await refreshUser();
        setPhase("pending");
      }
    };

    if (!reference) {
      // No reference — nothing to confirm; treat as still processing.
      setPhase("pending");
    } else {
      void poll();
    }

    return () => {
      cancelled = true;
    };
  }, [params, refreshUser]);

  return (
    <div
      className="min-h-screen grid place-items-center px-5"
      style={{ background: C.surface }}
    >
      <div
        className="w-full max-w-md rounded-[20px] border p-8 text-center"
        style={{ background: C.card, borderColor: C.line }}
      >
        {phase === "checking" && (
          <>
            <BouncyLoader label="Confirming your payment…" />
            <p className="mt-4 mb-0 text-[13px]" style={{ color: C.ink3 }}>
              This usually takes a few seconds.
            </p>
          </>
        )}

        {phase === "active" && (
          <>
            <div
              className="w-14 h-14 rounded-2xl grid place-items-center mx-auto mb-4"
              style={{ background: C.primarySoft, color: C.primary }}
            >
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="m-0 text-xl font-extrabold" style={{ color: C.ink }}>
              You're all set
            </h2>
            <p className="mt-1.5 mb-5 text-[13px]" style={{ color: C.ink2 }}>
              Your subscription is active. Your listings and features are unlocked.
            </p>
            <PrimaryButton onClick={() => navigate("/agent-dashboard/subscription")}>
              Go to billing
            </PrimaryButton>
          </>
        )}

        {phase === "pending" && (
          <>
            <div
              className="w-14 h-14 rounded-2xl grid place-items-center mx-auto mb-4"
              style={{ background: C.accentSoft, color: C.accentInk }}
            >
              <Clock className="w-7 h-7" />
            </div>
            <h2 className="m-0 text-xl font-extrabold" style={{ color: C.ink }}>
              Payment received
            </h2>
            <p className="mt-1.5 mb-5 text-[13px]" style={{ color: C.ink2 }}>
              We're finalizing your subscription — this can take a minute. It'll
              update automatically; check your billing page shortly.
            </p>
            <PrimaryButton onClick={() => navigate("/agent-dashboard/subscription")}>
              Go to billing
            </PrimaryButton>
          </>
        )}
      </div>
    </div>
  );
}
