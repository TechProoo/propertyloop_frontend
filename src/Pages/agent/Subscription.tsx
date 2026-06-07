import { Check, Receipt } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { C, Card, PageHeader, EmptyState } from "../../components/agent/ui";

// Pricing is fixed product config (from the brand brief), so it's safe to
// render statically. Live plan/renewal/billing data is NOT yet exposed by
// the frontend API — those areas show an honest "connect billing" state
// rather than fabricated figures.
const PLANS = [
  { id: "STANDARD", name: "Standard", blurb: "10 active listings", price: "₦5,000", per: "/mo" },
  { id: "PRO", name: "Pro", blurb: "Unlimited + featured placement", price: "₦12,000", per: "/mo" },
  { id: "FOUNDING", name: "Founding", blurb: "Free forever · waitlist only", price: "₦0", per: "" },
];

export default function AgentSubscription() {
  const { user } = useAuth();
  // subscriptionTier isn't typed on AgentProfile in the frontend yet.
  const tier =
    (user?.agentProfile as { subscriptionTier?: string } | undefined)?.subscriptionTier ?? null;

  return (
    <div>
      <PageHeader title="Subscription & billing" subtitle="Manage your plan and payments." />

      <div className="mt-[18px] grid gap-4 items-start" style={{ gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)" }}>
        <div className="flex flex-col gap-4 min-w-0">
          {/* Current plan */}
          <div className="rounded-[20px] p-5" style={{ background: "linear-gradient(150deg,#1f6f43,#14512f)", color: "#fff" }}>
            <div className="flex justify-between items-center">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
                <i className="w-2 h-2 rounded-full inline-block" style={{ background: "#7ad296" }} />
                {tier ? `${tier.charAt(0) + tier.slice(1).toLowerCase()} plan` : "Your plan"}
              </span>
            </div>
            <div className="mt-3.5">
              <span className="font-heading font-bold" style={{ fontSize: 38 }}>
                {tier ? PLANS.find((p) => p.id === tier)?.price ?? "—" : "—"}
              </span>
              <span className="opacity-70 text-[13px] font-semibold"> {tier ? "/ month · incl. VAT" : ""}</span>
            </div>
            <p className="text-[13px] mt-2 mb-0" style={{ opacity: 0.85 }}>
              Live plan status, renewal date and payment method aren't connected to this view yet.
            </p>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 py-2.5 rounded-full font-bold text-[13px]" style={{ background: "rgba(255,255,255,.16)", color: "#fff", border: "none" }}>
                Change plan
              </button>
              <button className="flex-1 py-2.5 rounded-full font-bold text-[13px]" style={{ background: "rgba(255,255,255,.16)", color: "#fff", border: "none" }}>
                Manage
              </button>
            </div>
          </div>

          {/* Payment history */}
          <Card>
            <h3 className="m-0 text-base font-extrabold mb-2" style={{ color: C.ink }}>Payment history</h3>
            <EmptyState
              icon={<Receipt className="w-[26px] h-[26px]" />}
              title="No billing history to show"
              body="Once the Paystack subscription endpoints are wired in, your charges and receipts will appear here."
            />
          </Card>
        </div>

        {/* Plans compare */}
        <Card>
          <h3 className="m-0 text-base font-extrabold" style={{ color: C.ink }}>Plans</h3>
          {PLANS.map((p) => {
            const current = tier === p.id;
            return (
              <div
                key={p.id}
                className="flex items-center justify-between p-3.5 rounded-[14px] mt-2.5"
                style={current ? { border: `1.5px solid ${C.primary}`, background: C.primarySoft } : { border: `1px solid ${C.line}` }}
              >
                <div>
                  <b className="text-sm font-bold flex items-center gap-1.5" style={{ color: C.ink }}>
                    {p.name}
                    {current && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wide text-white" style={{ background: C.primary }}>
                        Current
                      </span>
                    )}
                  </b>
                  <span className="block text-xs mt-px" style={{ color: C.ink3 }}>{p.blurb}</span>
                </div>
                <div className="font-heading text-lg font-bold" style={{ color: C.ink }}>
                  {p.price}
                  {p.per && <small className="font-body text-[11px] font-semibold ml-0.5" style={{ color: C.ink3 }}>{p.per}</small>}
                </div>
              </div>
            );
          })}
          <div className="mt-3.5 flex items-start gap-2 text-xs" style={{ color: C.ink3 }}>
            <Check className="w-4 h-4 flex-shrink-0 mt-px" style={{ color: C.primary }} />
            Failed renewals pause your listings immediately. We remind you 7 and 3 days before each charge.
          </div>
        </Card>
      </div>
    </div>
  );
}
