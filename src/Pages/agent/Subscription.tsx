import { useCallback, useEffect, useState } from "react";
import { Check, Receipt, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  C,
  Card,
  PageHeader,
  EmptyState,
  PrimaryButton,
  GhostButton,
  BouncyLoader,
  naira,
} from "../../components/agent/ui";
import subscriptionsService, {
  type SubscriptionInfo,
  type SubscriptionPayment,
  type SubTier,
} from "../../api/services/subscriptions";

// Selectable plans. Premium maps to the backend "PRO" tier. FOUNDING is a
// grandfathered free-forever tier - it's never shown as an option, only as the
// current plan for the early agents who hold it.
const PLANS: {
  id: "FREE" | "STANDARD" | "PRO";
  name: string;
  price: string;
  per: string;
  blurb: string;
  features: string[];
}[] = [
  {
    id: "FREE",
    name: "Free",
    price: "₦0",
    per: "",
    blurb: "Get started",
    features: ["3 active listings", "Basic profile", "Contact form"],
  },
  {
    id: "STANDARD",
    name: "Standard",
    price: "₦5,000",
    per: "/mo",
    blurb: "For active agents",
    features: [
      "10 active listings",
      "WhatsApp button",
      "Phone number display",
      "Priority search ranking",
      "Analytics",
    ],
  },
  {
    id: "PRO",
    name: "Premium",
    price: "₦20,000",
    per: "/mo",
    blurb: "Maximum visibility",
    features: [
      "Unlimited listings",
      "Featured listings",
      "Verified badge",
      "Homepage promotion",
      "Premium support",
    ],
  },
];

const TIER_LABEL: Record<string, string> = {
  FREE: "Free",
  FOUNDING: "Founding",
  STANDARD: "Standard",
  PRO: "Premium",
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Active",
  LAPSED: "Past due",
  CANCELLED: "Cancelled",
};

function priceForTier(tier: string | null): string {
  if (tier === "FOUNDING") return "₦0";
  return PLANS.find((p) => p.id === tier)?.price ?? "-";
}

function fmtDate(iso: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AgentSubscription() {
  const { user, refreshUser } = useAuth();
  const [sub, setSub] = useState<SubscriptionInfo | null>(null);
  const [payments, setPayments] = useState<SubscriptionPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    subscriptionsService
      .payments()
      .then(setPayments)
      .catch(() => setPayments([]));
    try {
      const data = await subscriptionsService.get();
      setSub(data);
    } catch {
      // Fall back to the tier on the cached user object.
      const fallback = (
        user?.agentProfile as { subscriptionTier?: SubTier } | undefined
      )?.subscriptionTier;
      setSub({
        tier: fallback ?? null,
        status: null,
        renewsAt: null,
        paystackSubscriptionCode: null,
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const tier = sub?.tier ?? null;
  const isPaid = tier === "STANDARD" || tier === "PRO";

  const upgrade = async (target: "STANDARD" | "PRO") => {
    setError(null);
    setBusy(target);
    try {
      const { paymentUrl } = await subscriptionsService.checkout(target);
      window.location.href = paymentUrl; // off to Paystack
    } catch {
      setBusy(null);
      setError("Couldn't start checkout. Please try again.");
    }
  };

  const cancel = async () => {
    if (
      !window.confirm(
        "Cancel your subscription? You'll move to the Free plan - your 3 most recent listings stay active and the rest are paused.",
      )
    )
      return;
    setError(null);
    setBusy("cancel");
    try {
      await subscriptionsService.cancel();
      await load();
      await refreshUser();
    } catch {
      setError("Couldn't cancel right now. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Subscription & billing"
        subtitle="Manage your plan and payments."
      />

      {error && (
        <div
          className="mt-4 rounded-xl px-4 py-3 text-[13px] font-semibold"
          style={{ background: "#fbeee6", color: C.danger }}
        >
          {error}
        </div>
      )}

      <div className="mt-[18px] grid gap-4 items-start grid-cols-1 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4 min-w-0">
          {/* Current plan */}
          <div
            className="rounded-[20px] p-5"
            style={{ background: "linear-gradient(150deg,#1f6f43,#14512f)", color: "#fff" }}
          >
            {loading ? (
              <div className="py-6">
                <BouncyLoader label="Loading your plan…" />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
                    <i
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ background: "#7ad296" }}
                    />
                    {tier ? `${TIER_LABEL[tier] ?? tier} plan` : "Your plan"}
                  </span>
                  {sub?.status && (
                    <span className="text-[11px] font-bold opacity-80">
                      {STATUS_LABEL[sub.status] ?? sub.status}
                    </span>
                  )}
                </div>
                <div className="mt-3.5">
                  <span className="font-heading font-bold" style={{ fontSize: 38 }}>
                    {priceForTier(tier)}
                  </span>
                  <span className="opacity-70 text-[13px] font-semibold">
                    {isPaid ? " / month · incl. VAT" : ""}
                  </span>
                </div>
                <p className="text-[13px] mt-2 mb-0" style={{ opacity: 0.85 }}>
                  {tier === "FOUNDING"
                    ? "You're on the free-forever Founding plan - unlimited listings, no charge."
                    : isPaid
                      ? `Renews ${fmtDate(sub?.renewsAt ?? null)}.`
                      : "You're on the Free plan - 3 active listings. Upgrade for more."}
                </p>
                {isPaid && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={cancel}
                      disabled={busy !== null}
                      className="flex-1 py-2.5 rounded-full font-bold text-[13px] disabled:opacity-60"
                      style={{ background: "rgba(255,255,255,.16)", color: "#fff", border: "none" }}
                    >
                      {busy === "cancel" ? "Cancelling…" : "Cancel subscription"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Payment history */}
          <Card>
            <h3 className="m-0 text-base font-extrabold mb-2" style={{ color: C.ink }}>
              Payment history
            </h3>
            {payments.length === 0 ? (
              <EmptyState
                icon={<Receipt className="w-[26px] h-[26px]" />}
                title="No receipts yet"
                body="Your subscription charges and receipts will appear here after your first payment."
              />
            ) : (
              <div className="flex flex-col">
                {payments.map((pay, i) => (
                  <div
                    key={pay.id}
                    className="flex items-center justify-between py-3"
                    style={{
                      borderTop: i === 0 ? "none" : `1px solid ${C.line2}`,
                    }}
                  >
                    <div>
                      <b className="text-[13.5px] font-bold block" style={{ color: C.ink }}>
                        {TIER_LABEL[pay.tier] ?? pay.tier}
                        <span className="font-semibold" style={{ color: C.ink3 }}>
                          {" · "}
                          {fmtDate(pay.createdAt)}
                        </span>
                      </b>
                      <span className="text-[11.5px]" style={{ color: C.ink3 }}>
                        {fmtDate(pay.billingPeriodStart)} – {fmtDate(pay.billingPeriodEnd)}
                      </span>
                    </div>
                    <div className="text-right">
                      <b className="font-heading text-[15px] font-bold" style={{ color: C.ink }}>
                        {naira(pay.amountKobo / 100)}
                      </b>
                      <span
                        className="block text-[11px] font-bold capitalize"
                        style={{ color: pay.status === "success" ? C.primary : C.danger }}
                      >
                        {pay.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Plans compare */}
        <Card>
          <h3 className="m-0 text-base font-extrabold" style={{ color: C.ink }}>
            Plans
          </h3>
          {PLANS.map((p) => {
            const current = tier === p.id;
            return (
              <div
                key={p.id}
                className="p-3.5 rounded-[14px] mt-2.5"
                style={
                  current
                    ? { border: `1.5px solid ${C.primary}`, background: C.primarySoft }
                    : { border: `1px solid ${C.line}` }
                }
              >
                <div className="flex items-start justify-between">
                  <div>
                    <b
                      className="text-sm font-bold flex items-center gap-1.5"
                      style={{ color: C.ink }}
                    >
                      {p.name}
                      {current && (
                        <span
                          className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wide text-white"
                          style={{ background: C.primary }}
                        >
                          Current
                        </span>
                      )}
                    </b>
                    <span className="block text-xs mt-px" style={{ color: C.ink3 }}>
                      {p.blurb}
                    </span>
                  </div>
                  <div className="font-heading text-lg font-bold text-right" style={{ color: C.ink }}>
                    {p.price}
                    {p.per && (
                      <small
                        className="font-body text-[11px] font-semibold ml-0.5"
                        style={{ color: C.ink3 }}
                      >
                        {p.per}
                      </small>
                    )}
                  </div>
                </div>

                <ul className="mt-2.5 mb-0 pl-0 list-none flex flex-col gap-1">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-1.5 text-[12px]"
                      style={{ color: C.ink2 }}
                    >
                      <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: C.primary }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-3">
                  <PlanAction
                    planId={p.id}
                    planName={p.name}
                    current={current}
                    tier={tier}
                    busy={busy}
                    onUpgrade={upgrade}
                    onCancel={cancel}
                  />
                </div>
              </div>
            );
          })}
          <div className="mt-3.5 flex items-start gap-2 text-xs" style={{ color: C.ink3 }}>
            <Check className="w-4 h-4 flex-shrink-0 mt-px" style={{ color: C.primary }} />
            A failed renewal keeps your 3 most recent listings active and pauses the
            rest until you update payment.
          </div>
        </Card>
      </div>
    </div>
  );
}

function PlanAction({
  planId,
  planName,
  current,
  tier,
  busy,
  onUpgrade,
  onCancel,
}: {
  planId: "FREE" | "STANDARD" | "PRO";
  planName: string;
  current: boolean;
  tier: string | null;
  busy: string | null;
  onUpgrade: (t: "STANDARD" | "PRO") => void;
  onCancel: () => void;
}) {
  const disabled = busy !== null;

  if (current) {
    return (
      <GhostButton onClick={() => {}} style={{ opacity: 0.6, cursor: "default" }}>
        Current plan
      </GhostButton>
    );
  }

  // The Free row: a downgrade target only for paid agents (cancel the sub).
  if (planId === "FREE") {
    const isPaid = tier === "STANDARD" || tier === "PRO";
    if (!isPaid) return null; // FREE/FOUNDING/none: nothing to do here
    return (
      <GhostButton onClick={onCancel}>
        {busy === "cancel" ? "Cancelling…" : "Downgrade to Free"}
      </GhostButton>
    );
  }

  // STANDARD / PRO (Premium): upgrade or switch.
  const label = tier === "FOUNDING" ? `Switch to ${planName}` : `Upgrade to ${planName}`;
  return (
    <PrimaryButton onClick={() => onUpgrade(planId)} disabled={disabled}>
      {busy === planId ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" /> Redirecting…
        </>
      ) : (
        label
      )}
    </PrimaryButton>
  );
}
