import { useEffect, useMemo, useState } from "react";
import {
  FileSignature,
  Check,
  X,
  Repeat,
  ChevronRight,
  Loader2,
} from "lucide-react";
import offersService from "../../api/services/offers";
import type { Offer, PropertyPurchase, PurchaseStep } from "../../api/types";
import { toast } from "../../lib/toast";
import {
  C,
  Card,
  PageHeader,
  EmptyState,
  BouncyLoader,
  naira,
  initials,
} from "../../components/agent/ui";

const OFFER_STATUS: Record<string, { label: string; bg: string; fg: string }> = {
  PENDING: { label: "New · needs response", bg: "#f5ead4", fg: "#7a5418" },
  COUNTERED: { label: "Countered", bg: "#e4ecfb", fg: "#3b5bdb" },
  ACCEPTED: { label: "Accepted", bg: "#e3efe7", fg: "#134a2d" },
  DECLINED: { label: "Declined", bg: "#f7e4dc", fg: "#8a3b1d" },
  WITHDRAWN: { label: "Withdrawn", bg: "#ece6df", fg: "#7f857f" },
  EXPIRED: { label: "Expired", bg: "#ece6df", fg: "#7f857f" },
};

function pctVsAsking(offer: Offer): string {
  const asking = offer.listing?.priceNaira ?? 0;
  if (!asking) return "";
  const pct = Math.round(((asking - offer.currentAmountNaira) / asking) * 100);
  if (pct === 0) return "matches asking";
  return pct > 0 ? `${pct}% below asking` : `${-pct}% above asking`;
}

export default function AgentOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [purchases, setPurchases] = useState<PropertyPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [counterFor, setCounterFor] = useState<Offer | null>(null);
  const [counterAmount, setCounterAmount] = useState("");
  const [counterNote, setCounterNote] = useState("");
  const [countering, setCountering] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [offersRes, purchasesRes] = await Promise.all([
        offersService.listReceived().catch(() => ({ items: [] as Offer[] })),
        offersService.listPurchases().catch(() => [] as PropertyPurchase[]),
      ]);
      setOffers(offersRes.items);
      setPurchases(purchasesRes);
    } catch {
      toast.error("Couldn't load offers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Offers awaiting the agent (buyer made the last move) come first.
  const sorted = useMemo(() => {
    const needs = (o: Offer) =>
      (o.status === "PENDING" || o.status === "COUNTERED") &&
      o.lastActor === "BUYER";
    return [...offers].sort((a, b) => (needs(b) ? 1 : 0) - (needs(a) ? 1 : 0));
  }, [offers]);

  const activePurchases = purchases.filter((p) => p.status === "IN_PROGRESS");

  const handleAccept = async (offer: Offer) => {
    if (
      !window.confirm(
        `Accept ${offer.currentAmountLabel} for "${offer.listing?.title}"? This creates a tracked purchase for you and the buyer.`,
      )
    )
      return;
    setBusyId(offer.id);
    try {
      await offersService.accept(offer.id);
      await load();
      toast.success("Offer accepted - a purchase has been created.");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Couldn't accept. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDecline = async (offer: Offer) => {
    if (!window.confirm("Decline this offer? The buyer will be notified.")) return;
    setBusyId(offer.id);
    try {
      const updated = await offersService.decline(offer.id);
      setOffers((prev) => prev.map((o) => (o.id === offer.id ? updated : o)));
      toast.success("Offer declined.");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Couldn't decline. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  const submitCounter = async () => {
    if (!counterFor) return;
    const amount = Number(counterAmount.replace(/[^\d]/g, ""));
    if (!amount || amount <= 0) {
      toast.error("Enter a counter amount above zero.");
      return;
    }
    setCountering(true);
    try {
      const updated = await offersService.counter(
        counterFor.id,
        amount,
        counterNote.trim() || undefined,
      );
      setOffers((prev) => prev.map((o) => (o.id === counterFor.id ? updated : o)));
      setCounterFor(null);
      setCounterAmount("");
      setCounterNote("");
      toast.success("Counter-offer sent to the buyer.");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Couldn't send counter. Please try again.");
    } finally {
      setCountering(false);
    }
  };

  const advanceStep = async (
    purchase: PropertyPurchase,
    step: PurchaseStep,
  ) => {
    // DONE -> reopen (ACTIVE); otherwise mark DONE. Backend re-derives the
    // next ACTIVE step, so the buyer's tracker stays in sync automatically.
    const next = step.state === "DONE" ? "ACTIVE" : "DONE";
    setBusyId(step.id);
    try {
      const updated = await offersService.updatePurchaseStep(
        purchase.id,
        step.id,
        { state: next },
      );
      setPurchases((prev) =>
        prev.map((p) => (p.id === purchase.id ? updated : p)),
      );
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Couldn't update the step.");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <BouncyLoader />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Offers"
        subtitle="Review buyer offers, negotiate, and track purchases through to close."
      />

      {/* Active purchases */}
      {activePurchases.length > 0 && (
        <div>
          <h2
            className="font-heading font-bold mb-3"
            style={{ fontSize: 17, color: C.ink }}
          >
            Purchases in progress
          </h2>
          <div className="flex flex-col gap-4">
            {activePurchases.map((p) => (
              <Card key={p.id}>
                <div className="flex items-center gap-4">
                  <img
                    src={p.listing?.coverImage}
                    alt={p.listing?.title}
                    className="w-14 h-14 rounded-xl object-cover"
                    style={{ border: `1px solid ${C.line}` }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-heading font-bold truncate"
                      style={{ color: C.ink, fontSize: 15 }}
                    >
                      {p.listing?.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: C.ink2 }}>
                      {p.buyer?.name} · agreed {p.agreedAmountLabel}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  {(p.steps || []).map((step) => (
                    <button
                      key={step.id}
                      onClick={() => advanceStep(p, step)}
                      disabled={busyId === step.id}
                      className="flex items-center gap-3 text-left rounded-xl px-3 py-2 transition-colors hover:bg-black/[0.02] disabled:opacity-60"
                    >
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background:
                            step.state === "DONE"
                              ? C.primary
                              : step.state === "ACTIVE"
                                ? C.primarySoft
                                : C.surface2,
                          color:
                            step.state === "DONE"
                              ? "#fff"
                              : step.state === "ACTIVE"
                                ? C.primaryInk
                                : C.ink3,
                          border:
                            step.state === "ACTIVE"
                              ? `2px solid ${C.primary}`
                              : "none",
                        }}
                      >
                        {busyId === step.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : step.state === "DONE" ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <span className="text-[10px] font-bold">{step.order}</span>
                        )}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span
                          className="block text-sm font-bold"
                          style={{
                            color: step.state === "TODO" ? C.ink3 : C.ink,
                          }}
                        >
                          {step.title}
                        </span>
                        <span className="block text-xs" style={{ color: C.ink2 }}>
                          {step.detail}
                        </span>
                      </span>
                      <span className="text-[11px] font-bold shrink-0" style={{ color: C.ink3 }}>
                        {step.state === "DONE" ? "Undo" : "Mark done"}
                      </span>
                    </button>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Offers */}
      <div>
        <h2
          className="font-heading font-bold mb-3"
          style={{ fontSize: 17, color: C.ink }}
        >
          Offers received
        </h2>
        {sorted.length === 0 ? (
          <EmptyState
            icon={<FileSignature className="w-7 h-7" />}
            title="No offers yet"
            body="When a buyer makes an offer on one of your listings, it lands here for you to accept, counter or decline."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {sorted.map((offer) => {
              const s = OFFER_STATUS[offer.status] ?? OFFER_STATUS.PENDING;
              const needsResponse =
                (offer.status === "PENDING" || offer.status === "COUNTERED") &&
                offer.lastActor === "BUYER";
              return (
                <Card
                  key={offer.id}
                  style={
                    needsResponse
                      ? { borderColor: C.primary, borderWidth: 1.5 }
                      : undefined
                  }
                >
                  <div className="flex gap-4">
                    <img
                      src={offer.listing?.coverImage}
                      alt={offer.listing?.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                      style={{ border: `1px solid ${C.line}` }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className="font-heading font-bold truncate"
                          style={{ color: C.ink, fontSize: 15 }}
                        >
                          {offer.listing?.title}
                        </p>
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0"
                          style={{ background: s.bg, color: s.fg }}
                        >
                          {s.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                          style={{ background: C.primarySoft, color: C.primaryInk }}
                        >
                          {initials(offer.buyer?.name)}
                        </span>
                        <span className="text-xs" style={{ color: C.ink2 }}>
                          {offer.buyer?.name} ·{" "}
                          {offer.financing === "CASH" ? "Cash buyer" : "Own financing"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mt-2">
                        <span className="text-xs" style={{ color: C.ink3 }}>
                          Asking {offer.listing?.priceLabel ?? naira(offer.listing?.priceNaira)}
                        </span>
                        <span
                          className="font-heading font-bold"
                          style={{ color: C.primary, fontSize: 17 }}
                        >
                          {offer.status === "COUNTERED" && offer.lastActor === "AGENT"
                            ? `Your counter: ${offer.currentAmountLabel}`
                            : `Offer: ${offer.currentAmountLabel}`}
                        </span>
                        <span className="text-[11px]" style={{ color: C.ink3 }}>
                          {pctVsAsking(offer)}
                        </span>
                      </div>

                      {offer.note && (
                        <p
                          className="text-xs mt-2 italic rounded-lg px-3 py-2"
                          style={{ color: C.ink2, background: C.surface }}
                        >
                          "{offer.note}"
                        </p>
                      )}
                    </div>
                  </div>

                  {needsResponse && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4" style={{ borderTop: `1px solid ${C.line}` }}>
                      <button
                        onClick={() => handleAccept(offer)}
                        disabled={busyId === offer.id}
                        className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-xs font-bold text-white transition-colors disabled:opacity-60"
                        style={{ background: C.primary }}
                      >
                        {busyId === offer.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        Accept {offer.currentAmountLabel}
                      </button>
                      <button
                        onClick={() => {
                          setCounterFor(offer);
                          setCounterAmount(String(offer.currentAmountNaira));
                          setCounterNote("");
                        }}
                        className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-xs font-bold transition-colors"
                        style={{ background: C.surface2, color: C.ink }}
                      >
                        <Repeat className="w-3.5 h-3.5" /> Counter
                      </button>
                      <button
                        onClick={() => handleDecline(offer)}
                        disabled={busyId === offer.id}
                        className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-xs font-medium transition-colors disabled:opacity-60"
                        style={{ background: "#f7e4dc", color: "#8a3b1d" }}
                      >
                        <X className="w-3.5 h-3.5" /> Decline
                      </button>
                    </div>
                  )}

                  {offer.status === "COUNTERED" && offer.lastActor === "AGENT" && (
                    <p className="text-xs mt-3 flex items-center gap-1.5" style={{ color: C.ink3 }}>
                      <ChevronRight className="w-3.5 h-3.5" /> Waiting for the buyer
                      to respond to your counter.
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Counter modal */}
      {counterFor && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(15,20,17,0.55)" }}
          onClick={() => !countering && setCounterFor(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-[20px] p-6"
            style={{ background: C.card }}
          >
            <h3 className="font-heading font-bold" style={{ color: C.ink, fontSize: 18 }}>
              Counter offer
            </h3>
            <p className="text-xs mt-1" style={{ color: C.ink2 }}>
              {counterFor.listing?.title} · buyer offered{" "}
              {counterFor.currentAmountLabel}
            </p>

            <label className="block text-xs font-bold mt-4 mb-1.5" style={{ color: C.ink }}>
              Your counter amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: C.ink2 }}>
                ₦
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={Number(counterAmount.replace(/[^\d]/g, "") || 0).toLocaleString()}
                onChange={(e) => setCounterAmount(e.target.value.replace(/[^\d]/g, ""))}
                className="w-full h-11 pl-8 pr-4 rounded-xl text-sm outline-none"
                style={{ background: C.surface, border: `1px solid ${C.line}`, color: C.ink }}
              />
            </div>

            <label className="block text-xs font-bold mt-3 mb-1.5" style={{ color: C.ink }}>
              Note (optional)
            </label>
            <textarea
              value={counterNote}
              onChange={(e) => setCounterNote(e.target.value)}
              rows={3}
              placeholder="Explain your counter, e.g. 'Price reflects the recent renovation.'"
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
              style={{ background: C.surface, border: `1px solid ${C.line}`, color: C.ink }}
            />

            <div className="flex gap-2.5 mt-5">
              <button
                onClick={() => setCounterFor(null)}
                disabled={countering}
                className="flex-1 h-10 rounded-full text-sm font-medium"
                style={{ background: C.surface2, color: C.ink }}
              >
                Cancel
              </button>
              <button
                onClick={submitCounter}
                disabled={countering}
                className="flex-1 h-10 rounded-full text-sm font-bold text-white inline-flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: C.primary }}
              >
                {countering && <Loader2 className="w-4 h-4 animate-spin" />}
                Send counter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
