import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Bath,
  BedDouble,
  Building2,
  CheckCircle2,
  ImageOff,
  Info,
  Loader2,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import partnersService from "../../api/services/partners";
import type { HouseListing, PartnerMe } from "../../api/services/partners";
import { toast } from "../../lib/toast";
import {
  C,
  Card,
  PageHeader,
  EmptyState,
  BouncyLoader,
} from "../../components/agent/ui";
import PartnerJoinCard from "../../components/agent/PartnerJoinCard";

/**
 * PropertyLoop stock — inventory the company holds a mandate on, which agent
 * partners may sell. The website twin of the app's "PL stock" tab.
 *
 * The distinction is worth keeping plain: an agent's own listing belongs to
 * them; house stock is there for any partner to bring a buyer to.
 */

/** 11 local digits (08031234567) or +234 followed by 10 — the app's rule. */
function isValidNgPhone(raw: string): boolean {
  const d = raw.replace(/\D/g, "");
  if (d.startsWith("234")) return d.length === 13;
  return d.length === 11 && d.startsWith("0");
}

function apiMessage(e: unknown, fallback: string): string {
  const msg = (e as { response?: { data?: { message?: string | string[] } } })
    ?.response?.data?.message;
  if (Array.isArray(msg)) return msg.join(", ");
  return msg ?? fallback;
}

export default function AgentPartnerStock() {
  const [partner, setPartner] = useState<PartnerMe | null>(null);
  const [stock, setStock] = useState<HouseListing[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [introducing, setIntroducing] = useState<HouseListing | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      // Partner status first: without a partner record the inventory endpoint
      // refuses, and the page shows the join prompt instead.
      const me = await partnersService.me();
      setPartner(me);
      if (me) {
        const inv = await partnersService.inventory({ limit: 60 });
        setStock(inv.items);
        setTotal(inv.total);
      }
    } catch {
      setFailed(true);
      toast.error("Couldn't load PropertyLoop stock.");
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
        <BouncyLoader label="Loading stock" />
      </div>
    );
  }

  if (failed) {
    return (
      <div className="space-y-6">
        <PageHeader title="PropertyLoop stock" />
        <EmptyState
          icon={<AlertCircle className="w-6 h-6" />}
          title="Couldn't load stock"
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
        <PageHeader
          title="PropertyLoop stock"
          subtitle="Property PropertyLoop holds a mandate on, open to agent partners"
        />
        <PartnerJoinCard title="Sell PropertyLoop stock" />
      </div>
    );
  }

  // Somebody who cannot be paid should hear it here, not after their first
  // sale closes — by then it is no longer a small errand.
  const blocked = !partner.payoutReady && partner.payoutGaps.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="PropertyLoop stock"
        subtitle={`${total} ${total === 1 ? "property" : "properties"} you can sell · commission agreed per property`}
        actions={
          <Link
            to="/agent-dashboard/partnership"
            className="inline-flex h-10 px-4 items-center rounded-full text-sm font-bold"
            style={{ background: C.primarySoft, color: C.primaryInk }}
          >
            Partner {partner.code}
          </Link>
        }
      />

      {blocked && (
        <div
          className="rounded-2xl p-4 flex gap-3"
          style={{ background: C.accentSoft }}
        >
          <AlertCircle className="w-5 h-5 shrink-0" style={{ color: C.accent }} />
          <p className="text-sm" style={{ color: C.accentInk, lineHeight: 1.55 }}>
            Before your first commission can be paid we still need your{" "}
            <strong>{partner.payoutGaps.join(", ")}</strong>. You can keep
            selling in the meantime.
          </p>
        </div>
      )}

      {stock.length === 0 ? (
        <EmptyState
          icon={<Building2 className="w-6 h-6" />}
          title="No stock yet"
          body="Nothing is published for partners to sell right now. New inventory lands here first."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stock.map((l) => (
            <StockCard
              key={l.id}
              listing={l}
              onIntroduce={() => setIntroducing(l)}
            />
          ))}
        </div>
      )}

      {total > stock.length && (
        <p className="text-xs text-center" style={{ color: C.ink3 }}>
          Showing the newest {stock.length} of {total}.
        </p>
      )}

      {introducing && (
        <BringBuyerModal
          listing={introducing}
          onClose={() => setIntroducing(null)}
        />
      )}
    </div>
  );
}

/* ─── One stock listing ─────────────────────────────────────────────────── */

function StockCard({
  listing,
  onIntroduce,
}: {
  listing: HouseListing;
  onIntroduce: () => void;
}) {

  return (
    <Card className="overflow-hidden flex flex-col" style={{ padding: 0 }}>
      <Link
        to={`/property/${listing.id}`}
        className="block aspect-[4/3] relative"
        style={{ background: C.surface2 }}
      >
        {listing.coverImage ? (
          <img
            src={listing.coverImage}
            alt={listing.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          // Stock posted before its photographs arrive has no cover yet. Say
          // so, rather than render a broken image.
          <div
            className="h-full w-full flex flex-col items-center justify-center gap-1.5"
            style={{ color: C.ink3 }}
          >
            <ImageOff className="w-6 h-6" />
            <span className="text-xs">Photos coming</span>
          </div>
        )}
        {listing.verified && (
          <span
            className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold"
            style={{ background: C.primarySoft, color: C.primaryInk }}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified
          </span>
        )}
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <Link to={`/property/${listing.id}`}>
          <h3
            className="font-heading font-bold text-[15px] leading-snug"
            style={{ color: C.ink }}
          >
            {listing.title}
          </h3>
        </Link>
        <p className="text-xs mt-1" style={{ color: C.ink3 }}>
          {listing.location}
        </p>
        <p className="font-heading font-bold mt-2" style={{ color: C.ink, fontSize: 17 }}>
          {listing.priceLabel}
        </p>
        {(listing.beds > 0 || listing.baths > 0) && (
          <div className="flex gap-3 mt-2 text-xs" style={{ color: C.ink2 }}>
            {listing.beds > 0 && (
              <span className="inline-flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5" />
                {listing.beds} bed
              </span>
            )}
            {listing.baths > 0 && (
              <span className="inline-flex items-center gap-1">
                <Bath className="w-3.5 h-3.5" />
                {listing.baths} bath
              </span>
            )}
          </div>
        )}

        {/* The action this page exists for. */}
        <div
          className="mt-auto pt-4 flex items-end justify-between gap-3"
          style={{ borderTop: `1px solid ${C.line2}`, marginTop: 16 }}
        >
          <div>
            {/* No rate: commission is negotiated per property, so a figure
                here would read as a promise. */}
            <p className="text-[10px] tracking-wider uppercase" style={{ color: C.ink3 }}>
              You earn
            </p>
            <p className="text-xs font-semibold" style={{ color: C.primaryInk }}>
              Commission agreed per property
            </p>
          </div>
          <button
            onClick={onIntroduce}
            className="inline-flex h-10 px-4 items-center gap-1.5 rounded-full text-sm font-bold text-white"
            style={{ background: C.primary }}
          >
            <UserPlus className="w-4 h-4" />
            Bring a buyer
          </button>
        </div>
      </div>
    </Card>
  );
}

/* ─── Bring a buyer ─────────────────────────────────────────────────────── */

function BringBuyerModal({
  listing,
  onClose,
}: {
  listing: HouseListing;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ duplicate: boolean } | null>(null);

  const phoneBad = phone.length > 0 && !isValidNgPhone(phone);
  const valid = name.trim().length > 1 && isValidNgPhone(phone);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, submitting]);

  async function submit() {
    if (!valid || submitting) return;
    setSubmitting(true);
    try {
      const res = await partnersService.introduce(listing.id, {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        message: message.trim() || undefined,
      });
      setDone({ duplicate: res.duplicate });
    } catch (e) {
      toast.error(
        apiMessage(e, "Could not record the introduction. Check your connection and try again."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  const field = "w-full h-11 px-4 rounded-xl text-sm outline-none";
  const fieldStyle = { background: C.surface, border: `1px solid ${C.line}`, color: C.ink };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(15,20,17,0.55)" }}
      onClick={() => !submitting && onClose()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Bring a buyer"
        className="w-full max-w-md rounded-[20px] p-6 max-h-[90vh] overflow-y-auto"
        style={{ background: C.card }}
      >
        {done ? (
          <div className="text-center py-4">
            <div
              className="mx-auto w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: C.primarySoft }}
            >
              <CheckCircle2 className="w-7 h-7" style={{ color: C.primary }} />
            </div>
            <h3 className="font-heading font-bold mt-4" style={{ color: C.ink, fontSize: 20 }}>
              {done.duplicate ? "Already recorded" : "Buyer recorded"}
            </h3>
            <p className="text-sm mt-2" style={{ color: C.ink2, lineHeight: 1.6 }}>
              {done.duplicate
                ? `You had already introduced ${name.trim()} to this property. The original introduction still stands — you have not lost it, and nobody has taken it.`
                : `${name.trim()} is now on record as your introduction. If this sale closes, the commission is attributed to you.`}
            </p>
            <button
              onClick={onClose}
              className="mt-6 h-10 px-6 rounded-full text-sm font-bold text-white"
              style={{ background: C.primary }}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-heading font-bold" style={{ color: C.ink, fontSize: 18 }}>
              Bring a buyer
            </h3>
            <p className="text-xs mt-1" style={{ color: C.ink2 }}>
              {listing.title} · {listing.priceLabel} · commission agreed per
              property
            </p>

            <label className="block text-xs font-bold mt-4 mb-1.5" style={{ color: C.ink }}>
              Buyer&apos;s name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              autoFocus
              className={field}
              style={fieldStyle}
            />

            <label className="block text-xs font-bold mt-3 mb-1.5" style={{ color: C.ink }}>
              Phone number
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0803 000 0000"
              inputMode="tel"
              className={field}
              style={{ ...fieldStyle, borderColor: phoneBad ? "#d99a8e" : C.line }}
            />
            {phoneBad ? (
              <p className="text-xs mt-1.5" style={{ color: "#b4442f" }}>
                That does not look like a Nigerian number.
              </p>
            ) : (
              <p className="text-xs mt-1.5" style={{ color: C.ink3 }}>
                How the agent reaches them. Nigerian mobile.
              </p>
            )}

            <label className="block text-xs font-bold mt-3 mb-1.5" style={{ color: C.ink }}>
              Email <span className="font-normal" style={{ color: C.ink3 }}>optional</span>
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className={field}
              style={fieldStyle}
            />

            <label className="block text-xs font-bold mt-3 mb-1.5" style={{ color: C.ink }}>
              Anything the agent should know{" "}
              <span className="font-normal" style={{ color: C.ink3 }}>optional</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Budget, timeline, what they are looking for."
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
              style={fieldStyle}
            />

            <div className="rounded-xl p-3 mt-4 flex gap-2.5" style={{ background: C.accentSoft }}>
              <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: C.accent }} />
              <p className="text-xs" style={{ color: C.accentInk, lineHeight: 1.55 }}>
                Recording this now is what ties the commission to you. Do it
                before the agent speaks to them, not after the sale.
              </p>
            </div>

            <div className="flex gap-2.5 mt-5">
              <button
                onClick={onClose}
                disabled={submitting}
                className="flex-1 h-10 rounded-full text-sm font-medium"
                style={{ background: C.surface2, color: C.ink }}
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={!valid || submitting}
                className="flex-1 h-10 rounded-full text-sm font-bold text-white inline-flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: C.primary }}
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Record introduction
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
