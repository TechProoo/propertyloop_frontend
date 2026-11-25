import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Card,
  GhostButton,
  PageHeader,
  PrimaryButton,
  naira,
} from "../../components/agent/ui";
import subscriptionsService, {
  type SubscriptionInfo,
  type SubscriptionPayment,
} from "../../api/services/subscriptions";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-NG", { dateStyle: "medium" });

export default function AgentSubscription() {
  const { refreshUser, logoutWithRedirect } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(
    null,
  );
  const [payments, setPayments] = useState<SubscriptionPayment[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const info = await subscriptionsService.get();
    setSubscription(info);
    setPayments(await subscriptionsService.payments());
  }, []);

  useEffect(() => {
    Promise.all([load(), refreshUser()]).catch(() =>
      setError(
        "We couldn’t load your billing details. Refresh billing to try again.",
      ),
    );
  }, [load, refreshUser]);

  const active = Date.parse(subscription?.accessUntil ?? "") > Date.now();
  const pendingReference = subscription?.pendingReference;
  const canCancel =
    subscription?.paystackSubscriptionCode &&
    subscription.status !== "CANCELLED";

  async function checkout() {
    setBusy(true);
    setError("");
    try {
      const { paymentUrl, reference } = await subscriptionsService.checkout();
      if (paymentUrl) {
        window.location.assign(paymentUrl);
      } else {
        navigate(
          `/agent/subscription/callback?ref=${encodeURIComponent(reference)}`,
          { replace: true },
        );
      }
    } catch {
      setError(
        "We couldn’t start checkout. Refresh your billing details before trying again.",
      );
      setBusy(false);
    }
  }

  async function checkPayment() {
    setBusy(true);
    setError("");
    try {
      if (pendingReference) await subscriptionsService.verify(pendingReference);
      await load();
      await refreshUser();
    } catch {
      setError(
        "We couldn’t confirm your payment yet. Please try again shortly.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function cancel() {
    if (
      !window.confirm(
        "Turn off automatic renewal? You’ll keep access until your paid period ends.",
      )
    )
      return;
    setBusy(true);
    setError("");
    try {
      await subscriptionsService.cancel();
      await Promise.all([load(), refreshUser()]);
    } catch {
      setError("We couldn’t turn off automatic renewal. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-[760px] px-4 py-8 sm:px-6">
      <PageHeader
        title="Agent subscription"
        subtitle="Manage access to your PropertyLoop agent account."
      />
      <Card className="mt-5 p-6">
        <h2 className="m-0 text-2xl font-bold">
          {naira((subscription?.amountKobo ?? 5_000_000) / 100)}{" "}
          <span className="text-base font-medium">/ month</span>
        </h2>
        <p className="my-3 text-sm">
          {active && subscription?.accessUntil
            ? `Agent access is active until ${formatDate(subscription.accessUntil)}.`
            : "An active subscription is required to use your agent account on the website and app."}
        </p>
        <p className="mb-5 text-sm">
          {subscription?.status === "CANCELLED" && active
            ? "Automatic renewal is off."
            : "The plan renews monthly through Paystack. You can turn off renewal in Billing."}
        </p>
        <div className="flex flex-wrap gap-3">
          {!active && subscription && (
            <PrimaryButton onClick={checkout} disabled={busy}>
              {pendingReference ? "Resume checkout" : "Subscribe with Paystack"}
            </PrimaryButton>
          )}
          {active && (
            <Link
              className="self-center text-sm font-semibold text-[#1f6f43]"
              to="/agent-dashboard"
            >
              Go to dashboard
            </Link>
          )}
          {canCancel && (
            <GhostButton onClick={cancel} disabled={busy}>
              Turn off auto-renewal
            </GhostButton>
          )}
          <GhostButton onClick={checkPayment} disabled={busy}>
            Refresh billing
          </GhostButton>
          <Link
            className="self-center text-sm font-semibold text-[#1f6f43]"
            to="/agent-dashboard/settings"
          >
            Account settings
          </Link>
          <GhostButton onClick={logoutWithRedirect} disabled={busy}>
            Sign out
          </GhostButton>
        </div>
        {error && (
          <p role="alert" className="mb-0 mt-4 text-sm text-red-700">
            {error}
          </p>
        )}
      </Card>

      {payments.length > 0 && (
        <Card className="mt-5 p-6">
          <h2 className="m-0 text-lg font-bold">Payment history</h2>
          <ul className="my-0 list-none px-0 pt-2">
            {payments.map((payment) => (
              <li
                key={payment.id}
                className="flex justify-between gap-3 border-t border-black/10 py-3 text-sm"
              >
                <span>
                  {formatDate(payment.billingPeriodStart)} – {formatDate(payment.billingPeriodEnd)}
                  {payment.status !== "success" && (
                    <span className="ml-2 capitalize">{payment.status}</span>
                  )}
                </span>
                <span>{naira(payment.amountKobo / 100)}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </main>
  );
}
