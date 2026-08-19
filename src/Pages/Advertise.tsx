import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  CheckCircle,
  Clock,
  ExternalLink,
  Eye,
  ImagePlus,
  Loader2,
  Lock,
  Megaphone,
  MousePointerClick,
  PauseCircle,
  ShieldCheck,
  Banknote,
  XCircle,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { useAuth } from "../context/AuthContext";
import adsService, {
  type AdPlacement,
  type AdStatus,
  type MyAd,
} from "../api/services/ads";

// ─── Static config ───────────────────────────────────────────────────────────

const PLACEMENTS: { key: AdPlacement; name: string; blurb: string }[] = [
  {
    key: "SPLASH",
    name: "App open (splash)",
    blurb: "Full-screen moment when the app opens - maximum visibility.",
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
  DRAFT: { label: "Awaiting payment", cls: "bg-gray-100 text-gray-600", icon: <Banknote className="w-3.5 h-3.5" /> },
  PENDING_REVIEW: { label: "In review", cls: "bg-amber-100 text-amber-700", icon: <Clock className="w-3.5 h-3.5" /> },
  ACTIVE: { label: "Live", cls: "bg-green-100 text-green-700", icon: <BadgeCheck className="w-3.5 h-3.5" /> },
  PAUSED: { label: "Paused", cls: "bg-blue-100 text-blue-700", icon: <PauseCircle className="w-3.5 h-3.5" /> },
  REJECTED: { label: "Not approved", cls: "bg-rose-100 text-rose-700", icon: <XCircle className="w-3.5 h-3.5" /> },
  EXPIRED: { label: "Finished", cls: "bg-gray-100 text-gray-500", icon: <CheckCircle className="w-3.5 h-3.5" /> },
};

const INPUT_CLS =
  "w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-gray-300";

const DRAFT_KEY = "pl_ad_draft_v1";

function naira(n: number) {
  return `₦${Math.round(n).toLocaleString("en-NG")}`;
}
function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// Text fields worth keeping if the visitor bounces mid-flow. The creative file
// can't be serialised, so it's re-picked on return (rare and cheap).
type Draft = {
  placement: AdPlacement;
  weeks: number;
  startAt: string;
  headline: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  brandName: string;
  contactEmail: string;
  contactPhone: string;
};

function loadDraft(): Partial<Draft> {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Partial<Draft>) : {};
  } catch {
    return {};
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Advertise() {
  const { user, isLoggedIn, login, signup } = useAuth();
  const [params, setParams] = useSearchParams();
  const draft = useRef(loadDraft()).current;

  // Wizard
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 - placement & schedule
  const [rates, setRates] = useState<Record<AdPlacement, number> | null>(null);
  const [placement, setPlacement] = useState<AdPlacement>(draft.placement ?? "SPLASH");
  const [weeks, setWeeks] = useState(draft.weeks ?? 1);
  const [startAt, setStartAt] = useState(draft.startAt && draft.startAt >= todayISO() ? draft.startAt : todayISO());

  // Step 2 - creative (file stays local until pay; upload needs an account)
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [headline, setHeadline] = useState(draft.headline ?? "");
  const [body, setBody] = useState(draft.body ?? "");
  const [ctaLabel, setCtaLabel] = useState(draft.ctaLabel ?? "Learn more");
  const [ctaUrl, setCtaUrl] = useState(draft.ctaUrl ?? "");
  const fileRef = useRef<HTMLInputElement>(null);

  // Step 3 - contact + inline auth + pay
  const [brandName, setBrandName] = useState(draft.brandName ?? "");
  const [contactEmail, setContactEmail] = useState(draft.contactEmail ?? "");
  const [contactPhone, setContactPhone] = useState(draft.contactPhone ?? "");
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");
  const [authPassword, setAuthPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Campaigns list (signed-in only)
  const [myAds, setMyAds] = useState<MyAd[]>([]);
  const [loadingMine, setLoadingMine] = useState(false);

  const quote = useMemo(() => (rates ? rates[placement] * weeks : null), [rates, placement, weeks]);

  // ── Effects ──
  useEffect(() => {
    adsService.pricing().then((p) => setRates(p.weeklyRates)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    setContactEmail((e) => e || user?.email || "");
    setLoadingMine(true);
    adsService.listMine().then(setMyAds).catch(() => {}).finally(() => setLoadingMine(false));
  }, [isLoggedIn, user?.email]);

  // Autosave the draft so a bounce (grabbing a logo, signing in) loses nothing.
  useEffect(() => {
    const d: Draft = { placement, weeks, startAt, headline, body, ctaLabel, ctaUrl, brandName, contactEmail, contactPhone };
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    } catch {
      /* storage full/blocked - drafts are best-effort */
    }
  }, [placement, weeks, startAt, headline, body, ctaLabel, ctaUrl, brandName, contactEmail, contactPhone]);

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
        try {
          localStorage.removeItem(DRAFT_KEY);
        } catch {
          /* ignore */
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.get("paid"), isLoggedIn]);

  // Object URL for the local preview.
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // ── Step gating ──
  const step2Ready = !!file && headline.trim().length >= 4 && /^https?:\/\/.+/.test(ctaUrl.trim());
  const step3Ready =
    brandName.trim().length >= 2 &&
    /.+@.+\..+/.test(contactEmail.trim()) &&
    (isLoggedIn || authPassword.length >= 8);

  const goNext = () => {
    setError(null);
    if (step === 1) return setStep(2);
    if (step === 2) {
      if (!file) return setError("Add your creative image to continue.");
      if (headline.trim().length < 4) return setError("Give your ad a headline (at least 4 characters).");
      if (!/^https?:\/\/.+/.test(ctaUrl.trim()))
        return setError("Enter the landing page URL, starting with https://");
      return setStep(3);
    }
  };

  // ── Final submit: (auth if needed) → upload → create → pay ──
  const submit = async () => {
    setError(null);
    if (!step3Ready) {
      setError(
        isLoggedIn
          ? "Fill in your brand name and a valid contact email."
          : authMode === "signup"
            ? "Fill in brand name, a valid email, and a password of at least 8 characters."
            : "Fill in brand name, your account email, and your password.",
      );
      return;
    }
    if (!file) {
      setStep(2);
      setError("Your creative image needs to be re-added.");
      return;
    }
    setSubmitting(true);
    try {
      // 1. Make sure we have an account - inline, no page hop.
      if (!isLoggedIn) {
        try {
          if (authMode === "signup") {
            await signup({
              name: brandName.trim(),
              email: contactEmail.trim(),
              password: authPassword,
              phone: contactPhone.trim() || undefined,
              role: "BUYER",
            });
          } else {
            await login({ email: contactEmail.trim(), password: authPassword });
          }
        } catch (e: unknown) {
          const err = e as { response?: { data?: { message?: string | string[] } } };
          const msg = err.response?.data?.message;
          const text = Array.isArray(msg) ? msg.join(", ") : msg;
          // A friendlier nudge for the most common miss: account already exists.
          if (authMode === "signup" && text?.toLowerCase().includes("already")) {
            setAuthMode("signin");
            setError("You already have an account with this email - enter your password to sign in instead.");
          } else {
            setError(text || "Couldn't sign you in. Check your details and try again.");
          }
          setSubmitting(false);
          return;
        }
      }

      // 2. Upload the creative (needs the account from step 1).
      const imageUrl = await adsService.uploadImage(file);

      // 3. Create the campaign and hand over to Paystack.
      const ad = await adsService.create({
        brandName: brandName.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim() || undefined,
        imageUrl,
        headline: headline.trim(),
        body: body.trim() || undefined,
        ctaLabel: ctaLabel.trim() || undefined,
        ctaUrl: ctaUrl.trim(),
        placement,
        startAt: new Date(`${startAt}T09:00:00`).toISOString(),
        weeks,
      });
      const { paymentUrl } = await adsService.pay(ad.id);
      window.location.href = paymentUrl;
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

  const placementName = PLACEMENTS.find((p) => p.key === placement)?.name ?? "";

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <Navbar />

      {/* Hero - tighter than before; the wizard is the star. */}
      <section className="bg-gradient-to-br from-primary-dark via-primary to-emerald-700 text-white pt-24 pb-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Megaphone className="w-3.5 h-3.5" /> Advertise on PropertyLoop
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold mt-4 leading-tight">
              Launch your campaign in 3 quick steps
            </h1>
            <p className="text-white/85 mt-2 text-sm sm:text-base">
              Pick a spot → add your ad → pay. Live after a quick review - no account needed until the last step.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 -mt-6 space-y-8">
        {/* Wizard card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Stepper */}
          <div className="px-6 pt-5">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
                  <button
                    onClick={() => s < step && setStep(s as 1 | 2 | 3)}
                    className={`flex items-center gap-2 shrink-0 ${s < step ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                        s < step
                          ? "bg-primary border-primary text-white"
                          : s === step
                            ? "border-primary text-primary bg-primary/5"
                            : "border-gray-200 text-gray-400"
                      }`}
                    >
                      {s < step ? <Check className="w-3.5 h-3.5" /> : s}
                    </span>
                    <span
                      className={`text-xs font-semibold hidden sm:block ${
                        s === step ? "text-primary-dark" : s < step ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {s === 1 ? "Spot & dates" : s === 2 ? "Your ad" : "Contact & pay"}
                    </span>
                  </button>
                  {s < 3 && <div className={`h-0.5 flex-1 rounded ${s < step ? "bg-primary" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* ── STEP 1 - placement + schedule ── */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Where should your brand show?</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Flat weekly rate - the price you see is the price you pay.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PLACEMENTS.map((p) => (
                    <button
                      key={p.key}
                      onClick={() => setPlacement(p.key)}
                      className={`relative text-left rounded-xl border p-4 transition-all ${
                        placement === p.key
                          ? "border-primary ring-2 ring-primary/20 bg-primary/[0.03]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {placement === p.key && (
                        <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </span>
                      )}
                      <p className="font-semibold text-gray-800 pr-6">{p.name}</p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{p.blurb}</p>
                      <p className="text-primary font-bold mt-2 text-sm">
                        {rates ? `${naira(rates[p.key])}/week` : "…"}
                      </p>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <Field label="Start date">
                    <input type="date" min={todayISO()} value={startAt} onChange={(e) => setStartAt(e.target.value)} className={INPUT_CLS} />
                  </Field>
                  <Field label="Duration">
                    <select value={weeks} onChange={(e) => setWeeks(Number(e.target.value))} className={INPUT_CLS}>
                      {[1, 2, 4, 8, 12].map((w) => (
                        <option key={w} value={w}>
                          {w} week{w > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>
            )}

            {/* ── STEP 2 - creative + live preview ── */}
            {step === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">Build your ad</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Watch the preview update as you type.</p>
                  </div>
                  <Field label="Creative image * (landscape works best)">
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="w-full rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/40 transition-colors overflow-hidden"
                    >
                      {previewUrl ? (
                        <img src={previewUrl} alt="creative" className="w-full h-36 object-cover" />
                      ) : (
                        <div className="h-36 flex flex-col items-center justify-center text-gray-400">
                          <ImagePlus className="w-7 h-7" />
                          <span className="text-xs mt-2 font-medium">Click to add your image (JPG/PNG, max 10MB)</span>
                        </div>
                      )}
                    </button>
                  </Field>
                  <Field label="Headline * (max 90 chars)">
                    <input value={headline} maxLength={90} onChange={(e) => setHeadline(e.target.value)} placeholder="e.g. Furnish your new home for less" className={INPUT_CLS} />
                  </Field>
                  <Field label="Supporting text (optional)">
                    <textarea value={body} maxLength={200} onChange={(e) => setBody(e.target.value)} rows={2} className={`${INPUT_CLS} resize-none`} />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Button label">
                      <input value={ctaLabel} maxLength={24} onChange={(e) => setCtaLabel(e.target.value)} className={INPUT_CLS} />
                    </Field>
                    <Field label="Landing page URL *">
                      <input value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="https://yourbrand.com/offer" className={INPUT_CLS} />
                    </Field>
                  </div>
                </div>

                {/* Live preview */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Live preview · {placementName}
                  </p>
                  <AdPreview
                    imageUrl={previewUrl}
                    brandName={brandName || "Your brand"}
                    headline={headline || "Your headline appears here"}
                    body={body}
                    ctaLabel={ctaLabel || "Learn more"}
                    variant={placement === "HOME_FEED" || placement === "SEARCH_INLINE" ? "card" : "banner"}
                  />
                  <p className="text-[11px] text-gray-400 mt-3 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    This is how it will look on the app and website.
                  </p>
                </div>
              </div>
            )}

            {/* ── STEP 3 - contact, inline auth, summary ── */}
            {step === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">Almost there</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {isLoggedIn
                        ? "Confirm your details and pay - your ad goes straight to review."
                        : "Your details below double as your PropertyLoop account, so you can track views and clicks."}
                    </p>
                  </div>
                  <Field label="Brand name *">
                    <input value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="e.g. Sterling Homes Ltd" className={INPUT_CLS} />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Email *">
                      <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} type="email" placeholder="you@brand.com" className={INPUT_CLS} disabled={isLoggedIn && !!user?.email} />
                    </Field>
                    <Field label="Phone (optional)">
                      <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className={INPUT_CLS} />
                    </Field>
                  </div>

                  {/* Inline auth - no page hop, no losing the draft. */}
                  {!isLoggedIn && (
                    <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5" />
                          {authMode === "signup" ? "Choose a password for your account" : "Sign in to your account"}
                        </p>
                        <button
                          onClick={() => { setAuthMode(authMode === "signup" ? "signin" : "signup"); setError(null); }}
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          {authMode === "signup" ? "I already have an account" : "I'm new here"}
                        </button>
                      </div>
                      <input
                        type="password"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder={authMode === "signup" ? "Create a password (8+ characters)" : "Your password"}
                        className={INPUT_CLS}
                      />
                    </div>
                  )}
                  {isLoggedIn && (
                    <p className="text-xs text-gray-400 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                      Signed in as {user?.email}
                    </p>
                  )}
                </div>

                {/* Order summary */}
                <div className="space-y-4">
                  <AdPreview
                    imageUrl={previewUrl}
                    brandName={brandName || "Your brand"}
                    headline={headline || "Your headline"}
                    body={body}
                    ctaLabel={ctaLabel || "Learn more"}
                    variant={placement === "HOME_FEED" || placement === "SEARCH_INLINE" ? "card" : "banner"}
                  />
                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-5 space-y-2">
                    <Row k="Placement" v={placementName} />
                    <Row k="Run" v={`${weeks} week${weeks > 1 ? "s" : ""} from ${shortDate(`${startAt}T09:00:00`)}`} />
                    <div className="flex justify-between text-base pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-700">Total</span>
                      <span className="font-bold text-primary">{quote != null ? naira(quote) : "…"}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1 pt-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Secure Paystack checkout · reviewed and live the same business day.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <p className="mt-5 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">{error}</p>
            )}
          </div>
        </div>

        {/* Your campaigns */}
        {isLoggedIn && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your campaigns</h2>
            {loadingMine ? (
              <div className="flex items-center gap-2 text-gray-400 text-sm py-8">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading…
              </div>
            ) : myAds.length === 0 ? (
              <p className="text-sm text-gray-400 bg-white border border-gray-100 rounded-2xl p-6">
                No campaigns yet - your first one will show up here with live view and click counts.
              </p>
            ) : (
              <div className="space-y-3">
                {myAds.map((ad) => {
                  const meta = STATUS_META[ad.status];
                  return (
                    <div key={ad.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                      <img src={ad.imageUrl} alt={ad.brandName} className="w-full sm:w-28 h-20 rounded-lg object-cover border border-gray-100" />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${meta.cls}`}>
                            {meta.icon} {meta.label}
                          </span>
                          <span className="text-xs text-gray-400">
                            {PLACEMENTS.find((p) => p.key === ad.placement)?.name} · {shortDate(ad.startAt)} → {shortDate(ad.endAt)}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800 mt-1 truncate">{ad.headline}</p>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-3">
                          <span className="inline-flex items-center gap-1"><Eye className="w-3 h-3" /> {ad.impressions.toLocaleString()} views</span>
                          <span className="inline-flex items-center gap-1"><MousePointerClick className="w-3 h-3" /> {ad.clicks.toLocaleString()} clicks</span>
                          <span className="inline-flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {naira(ad.amountNaira)}</span>
                        </p>
                        {ad.status === "REJECTED" && ad.adminNote && (
                          <p className="text-xs text-rose-600 mt-1">Reason: {ad.adminNote}</p>
                        )}
                      </div>
                      {ad.status === "DRAFT" && (
                        <button onClick={() => payDraft(ad.id)} className="shrink-0 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-primary/90">
                          Pay {naira(ad.amountNaira)}
                        </button>
                      )}
                      {ad.status === "ACTIVE" && (
                        <a href={ad.ctaUrl} target="_blank" rel="noreferrer" className="shrink-0 inline-flex items-center gap-1 text-sm text-primary font-medium">
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

      {/* Sticky action bar - the next step is always one tap away. */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          {step > 1 && (
            <button
              onClick={() => { setError(null); setStep((s) => (s - 1) as 1 | 2 | 3); }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-gray-400 leading-tight">
              {placementName} · {weeks}wk
            </p>
            <p className="text-base font-bold text-primary-dark leading-tight">{quote != null ? naira(quote) : "…"}</p>
          </div>
          {step < 3 ? (
            <button
              onClick={goNext}
              disabled={step === 2 && !step2Ready}
              className="flex items-center gap-2 bg-primary text-white font-semibold text-sm px-6 py-3 rounded-full hover:bg-primary/90 disabled:opacity-50"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={submitting}
              className="flex items-center gap-2 bg-primary text-white font-semibold text-sm px-6 py-3 rounded-full hover:bg-primary/90 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Redirecting to Paystack…
                </>
              ) : (
                <>Pay {quote != null ? naira(quote) : ""} & submit</>
              )}
            </button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

// ─── Bits ────────────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{k}</span>
      <span className="font-medium text-gray-800 text-right">{v}</span>
    </div>
  );
}

/** Mirrors the real AdSlot visuals so the preview is honest. */
function AdPreview({
  imageUrl,
  brandName,
  headline,
  body,
  ctaLabel,
  variant,
}: {
  imageUrl: string | null;
  brandName: string;
  headline: string;
  body?: string;
  ctaLabel: string;
  variant: "banner" | "card";
}) {
  if (variant === "card") {
    return (
      <div className="max-w-xs rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
        <div className="relative h-40 overflow-hidden bg-gray-100">
          {imageUrl ? (
            <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ImagePlus className="w-8 h-8" />
            </div>
          )}
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white px-2 py-0.5 rounded-full">
            Sponsored
          </span>
        </div>
        <div className="p-4">
          <p className="text-xs text-gray-400 font-medium">{brandName}</p>
          <p className="text-sm font-semibold text-gray-800 mt-0.5 line-clamp-2">{headline}</p>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary mt-2">
            {ctaLabel} <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className="grid overflow-hidden rounded-xl bg-[#123d2a] text-[#fbf8f1] shadow-xl sm:grid-cols-[0.92fr_1.48fr]">
      <div className="relative flex min-h-[260px] flex-col justify-between overflow-hidden px-5 py-5 sm:px-6 sm:py-6">
        <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="relative flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 border border-white/25 bg-white/[0.08] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-[#f6efd9]">
            <span className="h-1 w-1 rounded-full bg-[#f1c46e]" /> Sponsored
          </span>
          <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-white/45">Partner</span>
        </div>
        <div className="relative pt-6">
          <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[#f1c46e]">{brandName}</p>
          <p className="font-display text-xl leading-[1.05] tracking-[-0.03em] text-white sm:text-2xl">{headline}</p>
          {body && <p className="mt-3 line-clamp-2 text-xs leading-5 text-white/70">{body}</p>}
        </div>
        <span className="relative mt-5 inline-flex w-fit items-center gap-2 bg-[#f8f2e5] px-3 py-2 text-xs font-bold text-[#123d2a]">
          {ctaLabel} <ExternalLink className="h-3 w-3" />
        </span>
      </div>
      <div className="relative min-h-[210px] overflow-hidden border-t border-white/15 bg-[#0c2519] sm:border-l sm:border-t-0">
        {imageUrl ? (
          <img src={imageUrl} alt="preview" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/35"><ImagePlus className="h-9 w-9" /></div>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,61,42,0.4),transparent_42%)]" />
        <div className="absolute inset-3 border border-white/35 sm:inset-4" />
      </div>
    </div>
  );
}
