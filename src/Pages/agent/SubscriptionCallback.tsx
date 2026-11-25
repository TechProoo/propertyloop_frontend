import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BouncyLoader, Card } from "../../components/agent/ui";
import { useAuth } from "../../context/AuthContext";
import subscriptionsService from "../../api/services/subscriptions";

export default function SubscriptionCallback() {
  const [params] = useSearchParams();
  const reference = params.get("ref") || params.get("reference");
  const { refreshUser } = useAuth();
  const [result, setResult] = useState<"active" | "pending" | null>(null);

  useEffect(() => {
    if (!reference) return;
    let cancelled = false;
    subscriptionsService
      .verify(reference)
      .then(async (payment) => {
        if (cancelled) return;
        if (
          payment.paymentStatus === "success" &&
          Date.parse(payment.accessUntil ?? "") > Date.now()
        ) {
          await refreshUser();
          if (!cancelled) setResult("active");
        } else {
          setResult("pending");
        }
      })
      .catch(() => {
        if (!cancelled) setResult("pending");
      });
    return () => {
      cancelled = true;
    };
  }, [reference, refreshUser]);

  return (
    <main className="grid min-h-screen place-items-center bg-[#f6f4ef] px-5">
      <Card className="w-full max-w-md p-8 text-center">
        {reference && !result ? (
          <BouncyLoader label="Confirming your payment…" />
        ) : (
          <>
            <h1 className="text-xl font-bold">
              {result === "active"
                ? "Subscription active"
                : "Payment not confirmed"}
            </h1>
            <p className="mb-5 text-sm">
              {result === "active"
                ? "You now have agent access on both the website and the app."
                : "If you completed checkout, open Billing and refresh your subscription status before paying again."}
            </p>
            <Link
              to={
                result === "active"
                  ? "/agent-dashboard"
                  : "/agent-dashboard/subscription"
              }
              className="font-semibold text-[#1f6f43]"
            >
              {result === "active" ? "Go to dashboard" : "Open billing"}
            </Link>
          </>
        )}
      </Card>
    </main>
  );
}
