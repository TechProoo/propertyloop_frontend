import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  BadgeCheck,
  Banknote,
  Camera,
  Check,
  ChevronRight,
  Copy,
  Loader2,
  Lock,
  ShieldCheck,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import Seo from "../components/Seo";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { NIGERIAN_STATES } from "../data/nigeria";
import partnersService from "../api/services/partners";
import type { PartnerRegistrationResult } from "../api/services/partners";
import paymentsService from "../api/services/payments";
import uploadService from "../api/services/upload";
import logo from "../assets/logo_2.jpg";

/* ─── Validation ────────────────────────────────────────────────────────── */
//
// Everything here is checked on the way in rather than at submit, because a
// partner who fills eleven fields and is then told the third one is wrong
// usually does not come back.

const digitsOnly = (v: string) => v.replace(/\D/g, "");

/** 11 local digits (08031234567) or +234 followed by 10. */
function isValidNgPhone(raw: string): boolean {
  const d = digitsOnly(raw);
  if (d.startsWith("234")) return d.length === 13;
  return d.length === 11 && d.startsWith("0");
}

function isValidEmail(raw: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(raw.trim());
}

interface Errors {
  [field: string]: string | undefined;
}

/* ─── Small form primitives ─────────────────────────────────────────────── */

function Label({
  children,
  hint,
  optional,
}: {
  children: React.ReactNode;
  hint?: string;
  optional?: boolean;
}) {
  return (
    <span className="mb-1.5 block">
      <span className="text-sm font-medium text-primary-ink">
        {children}
        {optional && (
          <span className="ml-1.5 text-xs font-normal text-text-subtle">
            optional
          </span>
        )}
      </span>
      {hint && (
        <span className="mt-0.5 block text-xs leading-relaxed text-text-secondary">
          {hint}
        </span>
      )}
    </span>
  );
}

const FIELD =
  "w-full rounded-xl border bg-white/70 px-3.5 py-2.5 text-sm text-primary-ink outline-none transition-all placeholder:text-text-subtle focus:ring-2 focus:ring-primary/15";

function Input({
  value,
  onChange,
  placeholder,
  error,
  type = "text",
  inputMode,
  maxLength,
  ariaLabel,
  onBlur,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  type?: string;
  inputMode?: "text" | "numeric" | "email" | "tel";
  maxLength?: number;
  ariaLabel?: string;
  onBlur?: () => void;
}) {
  return (
    <>
      <input
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-label={ariaLabel}
        aria-invalid={Boolean(error)}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`${FIELD} ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
            : "border-border-light focus:border-primary"
        }`}
      />
      {error && <FieldError>{error}</FieldError>}
    </>
  );
}

function SelectInput({
  value,
  onChange,
  children,
  error,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  error?: string;
  ariaLabel?: string;
}) {
  return (
    <>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${FIELD} ${
          error
            ? "border-red-400 focus:border-red-500"
            : "border-border-light focus:border-primary"
        } ${value === "" ? "text-text-subtle" : ""}`}
      >
        {children}
      </select>
      {error && <FieldError>{error}</FieldError>}
    </>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-1.5 flex items-start gap-1 text-xs text-red-600">
      <AlertCircle className="mt-px h-3 w-3 shrink-0" />
      {children}
    </span>
  );
}

function Card({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: typeof UserRound;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border-light bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:p-6">
      <header className="mb-5 flex items-start gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Icon className="h-4.5 w-4.5" strokeWidth={1.9} />
        </span>
        <div>
          <h2 className="font-heading text-lg leading-tight text-primary-ink">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">
              {subtitle}
            </p>
          )}
        </div>
      </header>
      {children}
    </section>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

interface Bank {
  name: string;
  code: string;
}

export default function RealtorPartners() {
  const [params] = useSearchParams();

  // ── Who you are ──
  const [referral, setReferral] = useState(params.get("ref") ?? "");
  const [referralName, setReferralName] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [operatingState, setOperatingState] = useState("");

  // ── Getting you paid ──
  const [showPayout, setShowPayout] = useState(false);
  const [photo, setPhoto] = useState<{ url: string; name: string } | null>(
    null,
  );
  const [photoBusy, setPhotoBusy] = useState(false);
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [resolving, setResolving] = useState(false);
  const [nin, setNin] = useState("");
  const [tin, setTin] = useState("");
  const [payerId, setPayerId] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [residentialState, setResidentialState] = useState("");
  const [rcNumber, setRcNumber] = useState("");

  const [banks, setBanks] = useState<Bank[]>([]);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<PartnerRegistrationResult | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const formTop = useRef<HTMLDivElement>(null);

  // A referral code in the URL is confirmed against the directory so the
  // person who sent the link actually gets credited — and so a typo shows up
  // now rather than at commission time.
  useEffect(() => {
    const code = referral.trim().toUpperCase();
    if (code.length < 4) {
      setReferralName(null);
      return;
    }
    let cancelled = false;
    const t = setTimeout(async () => {
      const res = await partnersService.checkReferral(code);
      if (!cancelled) setReferralName(res.valid ? (res.partnerName ?? null) : null);
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [referral]);

  useEffect(() => {
    if (!showPayout || banks.length > 0) return;
    paymentsService
      .listBanks()
      .then((list) => setBanks(list as Bank[]))
      .catch(() => setBanks([]));
  }, [showPayout, banks.length]);

  // Paystack tells us who the account really belongs to. Resolving it beats
  // a free-text "account name" field: no typos, and a mismatch against the
  // partner's own name surfaces here instead of when a payment bounces.
  useEffect(() => {
    if (accountNumber.length !== 10 || !bankCode) {
      setAccountName("");
      return;
    }
    let cancelled = false;
    setResolving(true);
    paymentsService
      .resolveAccount(accountNumber, bankCode)
      .then((r) => {
        if (!cancelled) setAccountName(r.accountName);
      })
      .catch(() => {
        if (!cancelled) setAccountName("");
      })
      .finally(() => {
        if (!cancelled) setResolving(false);
      });
    return () => {
      cancelled = true;
    };
  }, [accountNumber, bankCode]);

  const payoutReady = useMemo(
    () =>
      Boolean(
        photo &&
          bankCode &&
          accountNumber.length === 10 &&
          accountName &&
          nin.length === 11 &&
          (payerId.trim() || tin.trim()) &&
          address.trim() &&
          residentialState,
      ),
    [
      photo,
      bankCode,
      accountNumber,
      accountName,
      nin,
      payerId,
      tin,
      address,
      residentialState,
    ],
  );

  async function handlePhoto(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((e) => ({ ...e, photo: "That file is not an image." }));
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setErrors((e) => ({ ...e, photo: "Please keep the photo under 8MB." }));
      return;
    }
    setErrors((e) => ({ ...e, photo: undefined }));
    setPhotoBusy(true);
    try {
      const { url } = await uploadService.uploadProfilePicture(file);
      setPhoto({ url, name: file.name });
    } catch {
      setErrors((e) => ({
        ...e,
        photo: "Upload failed. Check your connection and try again.",
      }));
    } finally {
      setPhotoBusy(false);
    }
  }

  function validate(): boolean {
    const next: Errors = {};
    if (!fullName.trim()) next.fullName = "We need your name to register you.";
    else if (!fullName.trim().includes(" "))
      next.fullName = "Please give your full name as it appears on your ID.";

    if (!whatsapp.trim()) next.whatsapp = "This is how we reach you.";
    else if (!isValidNgPhone(whatsapp))
      next.whatsapp = "That does not look like a Nigerian number.";

    if (!email.trim()) next.email = "Your partner number is sent here.";
    else if (!isValidEmail(email)) next.email = "Check this email address.";

    // The payout half is optional as a whole, but half-finished bank details
    // are worse than none — they look complete on a list and fail at payment.
    if (showPayout) {
      if (accountNumber && accountNumber.length !== 10)
        next.accountNumber = "Account numbers are 10 digits.";
      if (accountNumber && !bankCode) next.bankCode = "Pick the bank too.";
      if (nin && nin.length !== 11) next.nin = "A NIN is 11 digits.";
    }

    if (!consent) next.consent = "Please confirm before you register.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      formTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return false;
    }
    return true;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await partnersService.register({
        fullName: fullName.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim().toLowerCase(),
        experience: (experience || undefined) as never,
        agencyName: agencyName.trim() || undefined,
        operatingState: operatingState || undefined,
        referredByCode: referral.trim().toUpperCase() || undefined,
        consentedToTerms: true,
        ...(showPayout && {
          passportPhotoUrl: photo?.url,
          bankCode: bankCode || undefined,
          bankName: banks.find((b) => b.code === bankCode)?.name,
          accountNumber: accountNumber || undefined,
          accountName: accountName || undefined,
          nin: nin || undefined,
          tin: tin.trim() || undefined,
          payerId: payerId.trim() || undefined,
          dateOfBirth: dob || undefined,
          residentialAddress: address.trim() || undefined,
          residentialState: residentialState || undefined,
          rcNumber: rcNumber.trim() || undefined,
        }),
      });
      setResult(res);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string | string[] } } })
          ?.response?.data?.message ?? null;
      setSubmitError(
        Array.isArray(message)
          ? message[0]
          : (message ??
              "We could not complete your registration. Please try again, or call 0705 305 3040."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (result) return <Registered result={result} />;

  return (
    <div className="min-h-screen bg-bg">
      <Seo
        title="Agent Partner Programme"
        description="Register free as a PropertyLoop realtor or agent. Get a partner number, your own referral link, and a profile in our verified agent directory."
        path="/realtors/partners"
      />
      <Navbar />

      <Hero />

      <main
        ref={formTop}
        className="mx-auto max-w-3xl scroll-mt-24 px-4 pb-20 sm:px-6"
      >
        <form onSubmit={submit} className="flex flex-col gap-5">
          {/* ── Referral ── */}
          <Card
            icon={BadgeCheck}
            title="Referral code"
            subtitle="Only if another partner sent you this link."
          >
            <Input
              value={referral}
              onChange={(v) => setReferral(v.toUpperCase())}
              placeholder="AGT-1234"
              ariaLabel="Referral code"
              maxLength={12}
            />
            {referralName && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-primary">
                <Check className="h-3.5 w-3.5" />
                Referred by {referralName}
              </p>
            )}
          </Card>

          {/* ── You ── */}
          <Card icon={UserRound} title="You">
            <div className="grid gap-4">
              <label className="block">
                <Label hint="As it appears on your ID">Full name</Label>
                <Input
                  value={fullName}
                  onChange={setFullName}
                  placeholder="Full name"
                  error={errors.fullName}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <Label>WhatsApp number</Label>
                  <div className="flex items-stretch gap-2">
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border-light bg-surface-2/60 px-3 text-sm text-text-secondary">
                      🇳🇬 +234
                    </span>
                    <div className="min-w-0 flex-1">
                      <Input
                        value={whatsapp}
                        onChange={setWhatsapp}
                        placeholder="803 000 0000"
                        inputMode="tel"
                        error={errors.whatsapp}
                      />
                    </div>
                  </div>
                </label>

                <label className="block">
                  <Label>Email</Label>
                  <Input
                    value={email}
                    onChange={setEmail}
                    placeholder="you@example.com"
                    type="email"
                    inputMode="email"
                    error={errors.email}
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <Label optional>Experience</Label>
                  <SelectInput
                    value={experience}
                    onChange={setExperience}
                    ariaLabel="Experience"
                  >
                    <option value="">Select —</option>
                    <option value="NEW">New to property sales</option>
                    <option value="ONE_TO_THREE">1–3 years</option>
                    <option value="THREE_PLUS">3+ years</option>
                  </SelectInput>
                </label>

                <label className="block">
                  <Label optional>State where you operate</Label>
                  <SelectInput
                    value={operatingState}
                    onChange={setOperatingState}
                    ariaLabel="Operating state"
                  >
                    <option value="">Select state —</option>
                    {NIGERIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </SelectInput>
                </label>
              </div>

              <label className="block">
                <Label optional hint="If you sell under an agency or company">
                  Agency / company name
                </Label>
                <Input
                  value={agencyName}
                  onChange={setAgencyName}
                  placeholder="Agency or company name"
                />
              </label>
            </div>
          </Card>

          {/* ── Getting you paid ── */}
          <section className="rounded-2xl border border-border-light bg-white/80 shadow-sm backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setShowPayout((v) => !v)}
              aria-expanded={showPayout}
              className="flex w-full items-start gap-3 p-5 text-left sm:p-6"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Banknote className="h-4.5 w-4.5" strokeWidth={1.9} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-heading text-lg leading-tight text-primary-ink">
                    Getting you paid
                  </span>
                  {payoutReady ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary-ink">
                      <Check className="h-3 w-3" />
                      complete
                    </span>
                  ) : (
                    <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-text-secondary">
                      optional now
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-text-secondary">
                  On file means your first commission pays without delay. You
                  can skip this and add it later.
                </span>
              </span>
              <ChevronRight
                className={`mt-1 h-4 w-4 shrink-0 text-text-subtle transition-transform ${
                  showPayout ? "rotate-90" : ""
                }`}
              />
            </button>

            {showPayout && (
              <div className="grid gap-4 border-t border-border-light p-5 sm:p-6">
                {/* Passport photograph */}
                <div>
                  <Label hint="A clear, recent photo of you. Required before your first payout.">
                    Passport photograph
                  </Label>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handlePhoto(e.target.files?.[0])}
                  />
                  {photo ? (
                    <div className="flex items-center gap-3 rounded-xl border border-primary/25 bg-primary-soft/40 p-2.5">
                      <img
                        src={photo.url}
                        alt=""
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <span className="min-w-0 flex-1 truncate text-xs text-primary-ink">
                        {photo.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPhoto(null)}
                        aria-label="Remove photo"
                        className="rounded-lg p-1.5 text-text-secondary transition-colors hover:bg-white/70"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={photoBusy}
                      onClick={() => fileRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-2.5 text-sm font-medium text-text-body transition-colors hover:border-primary hover:text-primary disabled:opacity-60"
                    >
                      {photoBusy ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                      {photoBusy ? "Uploading…" : "Choose photo"}
                    </button>
                  )}
                  {errors.photo && <FieldError>{errors.photo}</FieldError>}
                </div>

                {/* Bank */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <Label>Bank</Label>
                    <SelectInput
                      value={bankCode}
                      onChange={setBankCode}
                      error={errors.bankCode}
                      ariaLabel="Bank"
                    >
                      <option value="">
                        {banks.length ? "Select bank —" : "Loading banks…"}
                      </option>
                      {banks.map((b) => (
                        <option key={b.code} value={b.code}>
                          {b.name}
                        </option>
                      ))}
                    </SelectInput>
                  </label>

                  <label className="block">
                    <Label>Account number</Label>
                    <Input
                      value={accountNumber}
                      onChange={(v) => setAccountNumber(digitsOnly(v))}
                      placeholder="10 digits"
                      inputMode="numeric"
                      maxLength={10}
                      error={errors.accountNumber}
                    />
                  </label>
                </div>

                {/* Resolved, never typed. */}
                <div>
                  <Label hint="Confirmed with your bank — you cannot edit this.">
                    Account name
                  </Label>
                  <div
                    className={`flex min-h-[42px] items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm ${
                      accountName
                        ? "border-primary/30 bg-primary-soft/40 font-medium text-primary-ink"
                        : "border-border-light bg-surface-2/40 text-text-subtle"
                    }`}
                  >
                    {resolving ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Checking with your bank…
                      </>
                    ) : accountName ? (
                      <>
                        <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />
                        {accountName}
                      </>
                    ) : (
                      "Pick a bank and enter 10 digits"
                    )}
                  </div>
                </div>

                {/* Tax identity */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <Label hint="Required by law for commission payouts — withholding tax">
                      NIN
                    </Label>
                    <Input
                      value={nin}
                      onChange={(v) => setNin(digitsOnly(v))}
                      placeholder="11 digits"
                      inputMode="numeric"
                      maxLength={11}
                      error={errors.nin}
                    />
                  </label>
                  <label className="block">
                    <Label optional>TIN</Label>
                    <Input
                      value={tin}
                      onChange={setTin}
                      placeholder="Tax Identification Number"
                    />
                  </label>
                </div>

                <label className="block">
                  <Label hint="Individuals: your Lagos State LIRS Payer ID. Companies: your FIRS TIN instead — one of the two is required before payouts.">
                    Payer ID
                  </Label>
                  <Input
                    value={payerId}
                    onChange={setPayerId}
                    placeholder="Payer ID"
                  />
                </label>

                {/* Address */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <Label optional>Date of birth</Label>
                    <Input value={dob} onChange={setDob} type="date" />
                  </label>
                  <label className="block">
                    <Label optional>RC number</Label>
                    <Input
                      value={rcNumber}
                      onChange={setRcNumber}
                      placeholder="CAC registration number"
                    />
                  </label>
                </div>

                <label className="block">
                  <Label>Residential address</Label>
                  <Input
                    value={address}
                    onChange={setAddress}
                    placeholder="Residential address"
                  />
                </label>

                <label className="block">
                  <Label>State</Label>
                  <SelectInput
                    value={residentialState}
                    onChange={setResidentialState}
                    ariaLabel="Residential state"
                  >
                    <option value="">Select state —</option>
                    {NIGERIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </SelectInput>
                </label>

                <p className="flex items-start gap-2 rounded-xl bg-surface-2/50 px-3.5 py-3 text-xs leading-relaxed text-text-secondary">
                  <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  Never shared. Used only to pay you.
                </p>
              </div>
            )}
          </section>

          {/* ── Consent & submit ── */}
          <div className="rounded-2xl border border-border-light bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:p-6">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#1f6f43]"
              />
              <span className="text-xs leading-relaxed text-text-body">
                I confirm the details above are mine and correct, and I agree to
                PropertyLoop&apos;s{" "}
                <Link
                  to="/legal/terms"
                  className="font-medium text-primary underline underline-offset-2"
                >
                  terms
                </Link>{" "}
                and{" "}
                <Link
                  to="/legal/privacy"
                  className="font-medium text-primary underline underline-offset-2"
                >
                  privacy policy
                </Link>
                . I am happy to be contacted on WhatsApp about listings and
                commission.
              </span>
            </label>
            {errors.consent && <FieldError>{errors.consent}</FieldError>}

            {submitError && (
              <p className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs leading-relaxed text-red-700">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-ink active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Registering…
                </>
              ) : (
                <>
                  Register as a partner
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>

            <p className="mt-3 text-xs text-text-subtle">
              Your details are used to run your partnership and pay your
              commission — nothing else.
            </p>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}

/* ─── Hero ──────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-primary-ink via-primary to-primary-light">
      <span className="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />
      <span className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-4 py-14 text-white sm:px-6 sm:py-20">
        <div className="mb-6 flex items-center gap-3">
          <img
            src={logo}
            alt=""
            className="h-11 w-11 rounded-xl bg-white/95 object-contain p-1"
          />
          <span className="text-xs font-semibold tracking-[0.18em] text-amber-300 uppercase">
            Agent Partner Programme
          </span>
        </div>

        <h1 className="font-display text-3xl leading-tight sm:text-5xl">
          Partner registration
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80">
          Register once. Your partner number and personal referral link arrive
          by email. Free to join, free to list.
        </p>

        <ul className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            { icon: BadgeCheck, text: "A profile in our agent directory" },
            { icon: Upload, text: "List properties at no cost" },
            { icon: ShieldCheck, text: "Commission paid through escrow" },
          ].map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="flex items-start gap-2.5 rounded-xl bg-white/10 px-3.5 py-3 backdrop-blur-sm"
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
              <span className="text-xs leading-relaxed text-white/90">
                {text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

/* ─── Success ───────────────────────────────────────────────────────────── */

function Registered({ result }: { result: PartnerRegistrationResult }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard
      ?.writeText(result.referralUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => undefined);
  }

  return (
    <div className="min-h-screen bg-bg">
      <Seo
        title="You are registered"
        description="Your PropertyLoop partner number and referral link."
        path="/realtors/partners"
      />
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="rounded-3xl border border-border-light bg-white/80 p-6 text-center shadow-sm backdrop-blur-sm sm:p-10">
          <span className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <Check className="h-7 w-7" strokeWidth={2.4} />
          </span>

          <h1 className="font-display text-2xl text-primary-ink sm:text-3xl">
            You are a PropertyLoop partner
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
            We have sent your partner number and referral link to{" "}
            <strong className="font-semibold text-primary-ink">
              {result.email}
            </strong>
            . Check your spam folder if it has not arrived in a few minutes.
          </p>

          <div className="mt-8 rounded-2xl bg-gradient-to-br from-primary-ink to-primary p-5 text-white">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-amber-300 uppercase">
              Your partner number
            </p>
            <p className="mt-1.5 font-display text-3xl">{result.partnerCode}</p>
          </div>

          <div className="mt-4 text-left">
            <p className="mb-1.5 text-xs font-medium text-text-secondary">
              Your referral link — anyone who registers through it is credited
              to you.
            </p>
            <div className="flex items-stretch gap-2">
              <code className="min-w-0 flex-1 truncate rounded-xl border border-border-light bg-surface-2/50 px-3.5 py-2.5 text-xs text-primary-ink">
                {result.referralUrl}
              </code>
              <button
                type="button"
                onClick={copy}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3.5 text-xs font-semibold text-white transition-colors hover:bg-primary-ink"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {!result.payoutReady && (
            <p className="mt-6 flex items-start gap-2 rounded-xl border border-accent/30 bg-accent-soft/50 px-4 py-3 text-left text-xs leading-relaxed text-text-body">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
              <span>
                Your payout details are not complete yet. You can still list and
                earn — we will ask for them before your first commission is
                paid.
              </span>
            </p>
          )}

          {/* Without this, a new partner has a number and no idea where to
              use it. Their account is an agent account, so the dashboard is
              the same one every agent already signs in to. */}
          <p className="mt-6 text-left text-xs leading-relaxed text-text-secondary">
            Set your password from the email we sent, then sign in. Stock you
            can sell and your commissions are in your dashboard under{" "}
            <a
              href="/agent-dashboard/partnership"
              className="font-semibold text-primary underline underline-offset-2"
            >
              Partnership
            </a>
            .
          </p>

          <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <a
              href="https://wa.me/2347053053040"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-ink"
            >
              Message us on WhatsApp
            </a>
            <Link
              to="/find-agent"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-text-body transition-colors hover:border-primary hover:text-primary"
            >
              See the agent directory
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
