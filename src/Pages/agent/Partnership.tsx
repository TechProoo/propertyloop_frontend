import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Building2,
  Check,
  Copy,
  MessageCircle,
  Share2,
  Wallet,
} from "lucide-react";
import partnersService from "../../api/services/partners";
import type {
  PartnerCommission,
  PartnerCommissionStatus,
  PartnerMe,
  PartnerStatus,
} from "../../api/services/partners";
import { toast } from "../../lib/toast";
import {
  C,
  Card,
  PageHeader,
  EmptyState,
  BouncyLoader,
  naira,
} from "../../components/agent/ui";
import PartnerJoinCard from "../../components/agent/PartnerJoinCard";
import PartnerDetailsForm from "../../components/agent/PartnerDetailsForm";

const STATUS_UI: Record<PartnerStatus, { label: string; bg: string; fg: string }> = {
  NEW: { label: "Registered", bg: "#f5ead4", fg: "#6b4a16" },
  CONTACTED: { label: "In progress", bg: "#dfeaf8", fg: "#1b4576" },
  VERIFIED: { label: "Verified", bg: "#d7f0ef", fg: "#0a5352" },
  ACTIVE: { label: "Active", bg: C.primarySoft, fg: C.primaryInk },
  DORMANT: { label: "Dormant", bg: "#f0f0f0", fg: C.ink2 },
  REJECTED: { label: "Not approved", bg: "#fbe2df", fg: "#7d2820" },
};

const COMMISSION_UI: Record<
  PartnerCommissionStatus,
  { label: string; bg: string; fg: string }
> = {
  PENDING: { label: "Awaiting sign-off", bg: "#f5ead4", fg: "#6b4a16" },
  APPROVED: { label: "Approved", bg: "#d7f0ef", fg: "#0a5352" },
  PAID: { label: "Paid", bg: C.primarySoft, fg: C.primaryInk },
  REJECTED: { label: "Declined", bg: "#fbe2df", fg: "#7d2820" },
};

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/**
 * A partner's own view of the programme — the website twin of the app's
 * "My partnership" screen.
 *
 * Three jobs: show where they stand, hand them their referral link in a form
 * they can actually send, and show what they are owed. The link matters most:
 * partners recruit partners over WhatsApp, and a link that takes three steps
 * to send does not get sent.
 */
export default function AgentPartnership() {
  const [partner, setPartner] = useState<PartnerMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      setPartner(await partnersService.me());
    } catch {
      setFailed(true);
      toast.error("Couldn't load your partnership.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="py-24">
        <BouncyLoader label="Loading your partnership" />
      </div>
    );
  }

  if (failed) {
    return (
      <div className="space-y-6">
        <PageHeader title="My partnership" />
        <EmptyState
          icon={<AlertCircle className="w-6 h-6" />}
          title="Couldn't load your partnership"
          body="Check your connection and try again."
          action={
            <button
              onClick={() => load()}
              className="h-10 px-5 rounded-full text-sm font-bold text-white"
              style={{ background: C.primary }}
            >
              Try again
            </button>
          }
        />
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="space-y-6">
        <PageHeader title="My partnership" />
        <PartnerJoinCard
          title="You have not joined yet"
          secondary={{ to: "/agent-dashboard/stock", label: "See what is on offer first" }}
        />
      </div>
    );
  }

  const shareText =
    "Join me as a PropertyLoop agent partner — free to register, and you can " +
    `sell PropertyLoop's own property listings.\n\n${partner.referralUrl}`;
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  async function copyLink() {
    if (!partner) return;
    try {
      await navigator.clipboard.writeText(partner.referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Couldn't copy. Select the link and copy it manually.");
    }
  }

  async function shareLink() {
    try {
      await navigator.share({ title: "PropertyLoop Agent Partner Programme", text: shareText });
    } catch {
      // Dismissed the share sheet. Nothing to report.
    }
  }

  const earned = partner.commissions
    .filter((c) => c.status === "PAID")
    .reduce((n, c) => n + c.amountNaira, 0);
  const owed = partner.commissions
    .filter((c) => c.status === "PENDING" || c.status === "APPROVED")
    .reduce((n, c) => n + c.amountNaira, 0);
  const meta = STATUS_UI[partner.status];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My partnership"
        subtitle="Where you stand, your referral link, and what you are owed"
        actions={
          <Link
            to="/agent-dashboard/stock"
            className="inline-flex h-10 px-4 items-center gap-1.5 rounded-full text-sm font-bold text-white"
            style={{ background: C.primary }}
          >
            <Building2 className="w-4 h-4" />
            Sell PropertyLoop stock
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Where they stand */}
        <div className="lg:col-span-3 rounded-[20px] p-6" style={{ background: C.primaryInk }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className="text-[10px] font-bold tracking-widest uppercase"
                style={{ color: "#fcd34d" }}
              >
                Partner number
              </p>
              <p className="font-heading font-bold text-white mt-1" style={{ fontSize: 32 }}>
                {partner.code}
              </p>
            </div>
            <span
              className="px-2.5 py-1 rounded-full text-[10.5px] font-bold tracking-wider uppercase"
              style={{ background: meta.bg, color: meta.fg }}
            >
              {meta.label}
            </span>
          </div>
          <div
            className="grid grid-cols-3 gap-3 mt-6 pt-5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}
          >
            <Stat label="Introduced" value={String(partner.introductions)} />
            <Stat label="Earned" value={naira(earned)} />
            <Stat label="Owed" value={naira(owed)} highlight={owed > 0} />
          </div>
        </div>

        {/* The link */}
        <Card className="lg:col-span-2">
          <p className="text-sm font-bold" style={{ color: C.ink }}>
            Your referral link
          </p>
          <p className="text-xs mt-1" style={{ color: C.ink3, lineHeight: 1.5 }}>
            Anyone who registers through this link is credited to you.
          </p>
          <div
            className="rounded-xl px-3 py-2.5 mt-3 text-xs break-all select-all"
            style={{ background: C.surface, color: C.primaryInk }}
          >
            {partner.referralUrl}
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={copyLink}
              className="inline-flex h-10 px-4 items-center gap-1.5 rounded-full text-sm font-bold"
              style={
                copied
                  ? { background: C.primarySoft, color: C.primaryInk }
                  : { background: C.primary, color: "#ffffff" }
              }
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied" : "Copy link"}
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 px-4 items-center gap-1.5 rounded-full text-sm font-bold"
              style={{ background: C.surface2, color: C.ink }}
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
            {canShare && (
              <button
                onClick={shareLink}
                className="inline-flex h-10 px-4 items-center gap-1.5 rounded-full text-sm font-bold"
                style={{ background: C.surface2, color: C.ink }}
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            )}
          </div>
        </Card>
      </div>

      {!partner.payoutReady && partner.payoutGaps.length > 0 && (
        <div className="rounded-2xl p-4 flex gap-3" style={{ background: C.accentSoft }}>
          <AlertCircle className="w-5 h-5 shrink-0" style={{ color: C.accent }} />
          <div>
            <p className="text-sm font-bold" style={{ color: C.accentInk }}>
              We cannot pay you yet
            </p>
            <p className="text-sm mt-1" style={{ color: C.accentInk, lineHeight: 1.55 }}>
              Still needed: <strong>{partner.payoutGaps.join(", ")}</strong>. You
              can keep selling — this only blocks the transfer.
            </p>
            {/* Used to send people back to the public sign-up form, where
                they were told they had already registered. The details are
                edited here instead. */}
            <a
              href="#your-details"
              className="inline-block text-sm font-bold underline underline-offset-4 mt-2"
              style={{ color: C.accentInk }}
            >
              Complete my details
            </a>
          </div>
        </div>
      )}

      <div id="your-details" className="scroll-mt-24">
        <PartnerDetailsForm
          details={partner.details}
          payoutGaps={partner.payoutGaps}
          onSaved={setPartner}
        />
      </div>

      <div>
        <p
          className="text-[11px] font-bold tracking-widest uppercase mb-3"
          style={{ color: C.ink3 }}
        >
          Commission
        </p>
        {partner.commissions.length === 0 ? (
          <EmptyState
            icon={<Wallet className="w-6 h-6" />}
            title="Nothing yet"
            body="Commission appears here once a buyer you introduced completes a purchase."
          />
        ) : (
          <div className="grid gap-2.5">
            {partner.commissions.map((c) => (
              <CommissionRow key={c.id} commission={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p
        className="text-base font-bold truncate"
        style={{ color: highlight ? "#fcd34d" : "#ffffff" }}
      >
        {value}
      </p>
      <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>
        {label}
      </p>
    </div>
  );
}

function CommissionRow({ commission }: { commission: PartnerCommission }) {
  const meta = COMMISSION_UI[commission.status];
  return (
    <Card className="flex flex-wrap items-center justify-between gap-3" style={{ padding: 16 }}>
      <div className="min-w-0">
        <p className="text-sm font-bold truncate" style={{ color: C.ink }}>
          {commission.listing ?? "Property removed"}
        </p>
        <p className="text-xs mt-1" style={{ color: C.ink3 }}>
          {shortDate(commission.createdAt)}
          {commission.paidAt ? ` · paid ${shortDate(commission.paidAt)}` : ""}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span
          className="px-2 py-0.5 rounded-full text-[10.5px] font-bold tracking-wider uppercase"
          style={{ background: meta.bg, color: meta.fg }}
        >
          {meta.label}
        </span>
        <span className="font-heading font-bold" style={{ color: C.ink, fontSize: 17 }}>
          {naira(commission.amountNaira)}
        </span>
      </div>
    </Card>
  );
}
