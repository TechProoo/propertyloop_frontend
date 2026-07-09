import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Banknote,
  CalendarDays,
  CheckCircle,
  Clock,
  ExternalLink,
  Eye,
  ImagePlus,
  Loader2,
  Megaphone,
  MousePointerClick,
  PauseCircle,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { useAuth } from "../context/AuthContext";
import adsService, {
  type AdPlacement,
  type AdStatus,
  type CreateAdPayload,
  type MyAd,
} from "../api/services/ads";

const PLACEMENTS: {
  key: AdPlacement;
  name: string;
  blurb: string;
}[] = [
  {
    key: "SPLASH",
    name: "App open (splash)",
    blurb: "Full-screen moment when the app opens — maximum visibility.",
  },
  {
    key: "HOME_BANNER",
    name: "Home banner",
    blurb: "Wide banner at the top of the home screen, web + app.",
  },
  {
    key: "SEARCH_INLINE",
    name: "Search results",
    blurb: "Native card inside property search results.",
  },
  {
    key: "HOME_FEED",
    name: "In-feed card",
    blurb: "Sponsored card between listings in the browsing grid.",
  },
];

const STATUS_META: Record<AdStatus, { label: string; cls: string; icon: React.ReactNode }> = {
  DRAFT: {
    label: "Awaiting payment",
    cls: "bg-gray-100 text-gray-600",
    icon: <Banknote className="w-3.5 h-3.5" />,
  },
  PENDING_REVIEW: {
    label: "In review",
    cls: "bg-amber-100 text-amber-700",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  ACTIVE: {
    label: "Live",
    cls: "bg-green-100 text-green-700",
    icon: <BadgeCheck className="w-3.5 h-3.5" />,
  },
  PAUSED: {
    label: "Paused",
    cls: "bg-blue-100 text-blue-700",
    icon: <PauseCircle className="w-3.5 h-3.5" />,
  },
  REJECTED: {
    label: "Not approved",
    cls: "bg-rose-100 text-rose-700",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
  EXPIRED: {
    label: "Finished",
    cls: "bg-gray-100 text-gray-500",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
};

const INPUT_CLS =
  "w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-gray-300";

function naira(n: number) {
  return `₦${Math.round(n).toLocaleString("en-NG")}`;
}
function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function Advertise() {
  const { user, isLoggedIn } = useAuth();
  const [params, setParams] = useSearchParams();

  const [rates, setRates] = useState<Record<AdPlacement, number> | null>(null);
  const [myAds, setMyAds] = useState<MyAd[]>([]);
  const [loadingMine, setLoadingMine] = useState(false);

  // Form state
  const [brandName, setBrandName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [ctaLabel, setCtaLabel] = useState("Learn more");
  const [ctaUrl, setCtaUrl] = useState("");
  const [placement, setPlacement] = useState<AdPlacement>("HOME_BANNER");
  const [startAt, setStartAt] = useState(todayISO());
  const [weeks, setWeeks] = useState(1);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const quote = useMemo(
    () => (rates ? rates[placement] * weeks : null),
    [rates, placement, weeks],
  );

  useEffect(() => {
    adsService.pricing().then((p) => setRates(p.weeklyRates)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    setContactEmail((e) => e || user?.email || "");
    setLoadingMine(true);
    adsService
      .listMine()
      .then(setMyAds)
      .catch(() => {})
      .finally(() => setLoadingMine(false));
  }, [isLoggedIn, user?.email]);

  // Paystack return: ?paid=<adId> → verify and refresh the list.
  useEffect(() => {
    const paidId = params.get("paid");
    if (!paidId || !isLoggedIn) return;
    adsService
      .verify(paidId)
      .then(() => adsService.listMine().then(setMyAds))
      .catch(() => {})
      .finally(() => {
        params.delete("paid");
        params.delete("trxref");
        params.delete("reference");
        setParams(params, { replace: true });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.get("paid"), isLoggedIn]);

  const onPickImage = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      setImageUrl(await adsService.uploadImage(file));
    } catch {
      setError("Couldn't upload the image. Please try a smaller file.");
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    setError(null);
    if (!brandName.trim() || !headline.trim() || !ctaUrl.trim() || !imageUrl) {
      setError("Please fill in the brand name, headline, landing URL and upload a creative.");
      return;
    }
    setSubmitting(true);
    try {
      const payload: CreateAdPayload = {
        brandName: brandName.trim(),
        contactEmail: contactEmail.trim() || user?.email || "",
        contactPhone: contactPhone.trim() || undefined,
        imageUrl,
        headline: headline.trim(),
        body: body.trim() || undefined,
        ctaLabel: ctaLabel.trim() || undefined,
        ctaUrl: ctaUrl.trim(),
        placement,
        startAt: new Date(`${startAt}T09:00:00`).toISOString(),
        weeks,
      };
      const ad = await adsService.create(payload);
      const { paymentUrl } = await adsService.pay(ad.id);
      window.location.href = paymentUrl; // Paystack hosted checkout
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string | string[] } } };
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(", ") : msg || "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const payDraft = async (id: string) => {
    try {
      const { paymentUrl } = await adsService.pay(id);
      window.location.href = paymentUrl;
    } catch {
      setError("Couldn't restart payment for that ad. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-dark via-primary to-emerald-700 text-white pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Megaphone className="w-3.5 h-3.5" /> Advertise on PropertyLoop
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold mt-4 max-w-2xl leading-tight">
              Put your brand in front of Nigeria's home movers
            </h1>
            <p className="text-white/85 mt-3 max-w-xl text-sm sm:text-base">
              Buyers, renters, agents and homeowners use PropertyLoop every day. Book a
              placement, upload your creative, pay securely with Paystack — live after a
              quick review.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 pb-20 space-y-10">
        {/* Rate card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLACEMENTS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPlacement(p.key)}
              className={`text-left bg-white rounded-2xl border p-5 shadow-sm transition-all ${
                placement === p.key
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <p className="font-semibold text-gray-800">{p.name}</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{p.blurb}</p>
              <p className="text-primary font-bold mt-3">
                {rates ? `${naira(rates[p.key])}/week` : "…"}
              </p>
            </button>
          ))}
        </div>

        {/* Booking form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-800">Book your campaign</h2>
          <p className="text-sm text-gray-500 mt-1">
            Flat weekly rate — the price you see is the price you pay. Every ad is
            reviewed by our team before it goes live.
          </p>

          {!isLoggedIn ? (
            <div className="mt-6 rounded-xl bg-gray-50 border border-gray-100 p-6 text-center">
              <p className="text-gray-600 text-sm">
                Sign in (or create a free account) to book a campaign and track its
                performance.
              </p>
              <Link
                to="/login"
                className="inline-block mt-3 bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-primary/90"
              >
                Sign in to continue
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: fields */}
              <div className="space-y-4">
                <Field label="Brand name *">
                  <input
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. Sterling Homes Ltd"
                    className={INPUT_CLS}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Contact email *">
                    <input
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      type="email"
                      className={INPUT_CLS}
                    />
                  </Field>
                  <Field label="Phone (optional)">
                    <input
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className={INPUT_CLS}
                    />
                  </Field>
                </div>
                <Field label="Headline * (max 90 chars)">
                  <input
                    value={headline}
                    maxLength={90}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Furnish your new home for less"
                    className={INPUT_CLS}
                  />
                </Field>
                <Field label="Supporting text (optional)">
                  <textarea
                    value={body}
                    maxLength={200}
                    onChange={(e) => setBody(e.target.value)}
                    rows={2}
                    className={`${INPUT_CLS} resize-none`}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Button label">
                    <input
                      value={ctaLabel}
                      maxLength={24}
                      onChange={(e) => setCtaLabel(e.target.value)}
                      className={INPUT_CLS}
                    />
                  </Field>
                  <Field label="Landing page URL *">
                    <input
                      value={ctaUrl}
                      onChange={(e) => setCtaUrl(e.target.value)}
                      placeholder="https://yourbrand.com/offer"
                      className={INPUT_CLS}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Start date">
                    <input
                      type="date"
                      min={todayISO()}
                      value={startAt}
                      onChange={(e) => setStartAt(e.target.value)}
                      className={INPUT_CLS}
                    />
                  </Field>
                  <Field label="Duration">
                    <select
                      value={weeks}
                      onChange={(e) => setWeeks(Number(e.target.value))}
                      className={INPUT_CLS}
                    >
                      {[1, 2, 4, 8, 12].map((w) => (
                        <option key={w} value={w}>
                          {w} week{w > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>

              {/* Right: creative + summary */}
              <div className="space-y-4">
                <Field label="Creative image * (landscape works best)">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onPickImage(e.target.files?.[0])}
                  />
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/40 transition-colors overflow-hidden"
                  >
                    {imageUrl ? (
                      <img src={imageUrl} alt="creative" className="w-full h-44 object-cover" />
                    ) : (
                      <div className="h-44 flex flex-col items-center justify-center text-gray-400">
                        {uploading ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <>
                            <ImagePlus className="w-7 h-7" />
                            <span className="text-xs mt-2 font-medium">
                              Click to upload (JPG/PNG, max 10MB)
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </button>
                </Field>

                <div className="rounded-xl bg-gray-50 border border-gray-100 p-5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Placement</span>
                    <span className="font-medium text-gray-800">
                      {PLACEMENTS.find((p) => p.key === placement)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Run</span>
                    <span className="font-medium text-gray-800">
                      {weeks} week{weeks > 1 ? "s" : ""} from {shortDate(`${startAt}T09:00:00`)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base pt-2 border-t border-gray-200">
                    <span className="font-semibold text-gray-700">Total</span>
                    <span className="font-bold text-primary">
                      {quote != null ? naira(quote) : "…"}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Secure card/bank payment via
                    Paystack. Goes live after review (same business day).
                  </p>
                </div>

                {error && (
                  <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  onClick={submit}
                  disabled={submitting || uploading}
                  className="w-full bg-primary text-white font-semibold py-3.5 rounded-full hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Redirecting to Paystack…
                    </>
                  ) : (
                    <>Pay {quote != null ? naira(quote) : ""} & submit for review</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* My campaigns */}
        {isLoggedIn && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your campaigns</h2>
            {loadingMine ? (
              <div className="flex items-center gap-2 text-gray-400 text-sm py-8">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading…
              </div>
            ) : myAds.length === 0 ? (
              <p className="text-sm text-gray-400 bg-white border border-gray-100 rounded-2xl p-6">
                No campaigns yet — your first one will show up here with live view and
                click counts.
              </p>
            ) : (
              <div className="space-y-3">
                {myAds.map((ad) => {
                  const meta = STATUS_META[ad.status];
                  return (
                    <div
                      key={ad.id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                    >
                      <img
                        src={ad.imageUrl}
                        alt={ad.brandName}
                        className="w-full sm:w-28 h-20 rounded-lg object-cover border border-gray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${meta.cls}`}
                          >
                            {meta.icon} {meta.label}
                          </span>
                          <span className="text-xs text-gray-400">
                            {PLACEMENTS.find((p) => p.key === ad.placement)?.name} ·{" "}
                            {shortDate(ad.startAt)} → {shortDate(ad.endAt)}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800 mt-1 truncate">
                          {ad.headline}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-3">
                          <span className="inline-flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {ad.impressions.toLocaleString()} views
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MousePointerClick className="w-3 h-3" /> {ad.clicks.toLocaleString()} clicks
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" /> {naira(ad.amountNaira)}
                          </span>
                        </p>
                        {ad.status === "REJECTED" && ad.adminNote && (
                          <p className="text-xs text-rose-600 mt-1">Reason: {ad.adminNote}</p>
                        )}
                      </div>
                      {ad.status === "DRAFT" && (
                        <button
                          onClick={() => payDraft(ad.id)}
                          className="shrink-0 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-primary/90"
                        >
                          Pay {naira(ad.amountNaira)}
                        </button>
                      )}
                      {ad.status === "ACTIVE" && (
                        <a
                          href={ad.ctaUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 inline-flex items-center gap-1 text-sm text-primary font-medium"
                        >
                          View landing <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
