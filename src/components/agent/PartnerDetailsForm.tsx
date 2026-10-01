import { useEffect, useRef, useState } from "react";
import { Camera, Check, Loader2, X } from "lucide-react";
import partnersService from "../../api/services/partners";
import type { PartnerDetails, PartnerMe } from "../../api/services/partners";
import paymentsService from "../../api/services/payments";
import type { Bank } from "../../api/types";
import uploadService from "../../api/services/upload";
import { NIGERIAN_STATES } from "../../data/nigeria";
import { toast } from "../../lib/toast";
import { C, Card } from "./ui";

/**
 * A partner editing their own details.
 *
 * This is the piece the programme was missing: people register without their
 * bank account to hand, and the dashboard told them what was outstanding with
 * nowhere to put it. Same fields as the registration form, prefilled, so the
 * second visit looks like the first.
 */

const label = "block text-[11px] font-bold tracking-wider uppercase mb-1.5";
const field =
  "w-full h-11 px-3 rounded-xl text-sm outline-none transition-colors border";

function Field({
  children,
  title,
  hint,
}: {
  children: React.ReactNode;
  title: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className={label} style={{ color: C.ink3 }}>
        {title}
      </span>
      {children}
      {hint && (
        <span className="mt-1 block text-[11px]" style={{ color: C.ink3 }}>
          {hint}
        </span>
      )}
    </label>
  );
}

export default function PartnerDetailsForm({
  details,
  payoutGaps,
  onSaved,
}: {
  details: PartnerDetails;
  payoutGaps: string[];
  onSaved: (next: PartnerMe) => void;
}) {
  const [fullName, setFullName] = useState(details.fullName ?? "");
  const [whatsapp, setWhatsapp] = useState(details.whatsapp ?? "");
  const [agencyName, setAgencyName] = useState(details.agencyName ?? "");
  const [operatingState, setOperatingState] = useState(
    details.operatingState ?? "",
  );
  const [photoUrl, setPhotoUrl] = useState(details.passportPhotoUrl ?? "");
  const [bankCode, setBankCode] = useState(details.bankCode ?? "");
  const [accountNumber, setAccountNumber] = useState(details.accountNumber ?? "");
  const [accountName, setAccountName] = useState(details.accountName ?? "");
  const [nin, setNin] = useState(details.nin ?? "");
  const [tin, setTin] = useState(details.tin ?? "");
  const [payerId, setPayerId] = useState(details.payerId ?? "");
  const [dob, setDob] = useState(details.dateOfBirth ?? "");
  const [address, setAddress] = useState(details.residentialAddress ?? "");
  const [residentialState, setResidentialState] = useState(
    details.residentialState ?? "",
  );
  const [rcNumber, setRcNumber] = useState(details.rcNumber ?? "");

  const [banks, setBanks] = useState<Bank[]>([]);
  const [resolving, setResolving] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    paymentsService
      .listBanks()
      .then(setBanks)
      .catch(() => setBanks([]));
  }, []);

  // The account name is resolved from the bank, never typed: a name that does
  // not match the account is how a payout goes to the wrong person.
  useEffect(() => {
    if (accountNumber.length !== 10 || !bankCode) return;
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

  async function handlePhoto(file?: File) {
    if (!file) return;
    setPhotoBusy(true);
    try {
      const { url } = await uploadService.uploadProfilePicture(file);
      setPhotoUrl(url);
    } catch {
      toast.error("That photo could not be uploaded.");
    } finally {
      setPhotoBusy(false);
    }
  }

  async function save() {
    if (accountNumber && accountNumber.length !== 10) {
      setError("An account number is 10 digits.");
      return;
    }
    if (accountNumber && !bankCode) {
      setError("Pick the bank as well.");
      return;
    }
    if (nin && nin.length !== 11) {
      setError("A NIN is 11 digits.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const next = await partnersService.updateMe({
        fullName: fullName.trim() || undefined,
        whatsapp: whatsapp.trim() || undefined,
        agencyName: agencyName.trim(),
        operatingState,
        passportPhotoUrl: photoUrl,
        bankCode,
        bankName: banks.find((b) => b.code === bankCode)?.name ?? "",
        accountNumber,
        accountName,
        nin,
        tin: tin.trim(),
        payerId: payerId.trim(),
        dateOfBirth: dob || undefined,
        residentialAddress: address.trim(),
        residentialState,
        rcNumber: rcNumber.trim(),
      });
      onSaved(next);
      setSaved(true);
      toast.success("Your details are saved.");
      window.setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      const message = (
        e as { response?: { data?: { message?: string | string[] } } }
      )?.response?.data?.message;
      setError(
        (Array.isArray(message) ? message[0] : message) ??
          "Those details could not be saved. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  const input = {
    background: C.surface,
    borderColor: C.line2,
    color: C.ink,
  };

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold" style={{ color: C.ink }}>
            Your details
          </p>
          <p className="text-xs mt-1" style={{ color: C.ink3, lineHeight: 1.5 }}>
            Change these whenever you like. Your email is your sign-in, so it
            stays as it is — message us if it has to change.
          </p>
        </div>
        {payoutGaps.length > 0 && (
          <span
            className="px-2.5 py-1 rounded-full text-[10.5px] font-bold tracking-wider uppercase"
            style={{ background: "#f5ead4", color: "#6b4a16" }}
          >
            Still needed: {payoutGaps.join(", ")}
          </span>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mt-5">
        <Field title="Full name">
          <input
            className={field}
            style={input}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </Field>
        <Field title="WhatsApp number">
          <input
            className={field}
            style={input}
            value={whatsapp}
            inputMode="tel"
            onChange={(e) => setWhatsapp(e.target.value)}
          />
        </Field>
        <Field title="Email (sign-in)">
          <input
            className={field}
            style={{ ...input, background: C.surface2, color: C.ink3 }}
            value={details.email}
            readOnly
          />
        </Field>
        <Field title="Agency name" hint="Leave blank if you work alone.">
          <input
            className={field}
            style={input}
            value={agencyName}
            onChange={(e) => setAgencyName(e.target.value)}
          />
        </Field>
        <Field title="State you work in">
          <select
            className={field}
            style={input}
            value={operatingState}
            onChange={(e) => setOperatingState(e.target.value)}
          >
            <option value="">Select a state</option>
            {NIGERIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field title="Date of birth">
          <input
            type="date"
            className={field}
            style={input}
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </Field>
      </div>

      <p
        className="text-[11px] font-bold tracking-wider uppercase mt-7 mb-3"
        style={{ color: C.primaryInk }}
      >
        Getting you paid
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field title="Bank">
          <select
            className={field}
            style={input}
            value={bankCode}
            onChange={(e) => setBankCode(e.target.value)}
          >
            <option value="">Select your bank</option>
            {banks.map((b) => (
              <option key={b.code} value={b.code}>
                {b.name}
              </option>
            ))}
          </select>
        </Field>
        <Field title="Account number">
          <input
            className={field}
            style={input}
            value={accountNumber}
            inputMode="numeric"
            maxLength={10}
            onChange={(e) =>
              setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
          />
        </Field>
        <Field
          title="Account name"
          hint={
            resolving
              ? "Checking with the bank…"
              : "Filled in from your bank, not typed."
          }
        >
          <input
            className={field}
            style={{ ...input, background: C.surface2, color: C.ink2 }}
            value={accountName}
            readOnly
            placeholder="—"
          />
        </Field>
        <Field title="NIN">
          <input
            className={field}
            style={input}
            value={nin}
            inputMode="numeric"
            maxLength={11}
            onChange={(e) =>
              setNin(e.target.value.replace(/\D/g, "").slice(0, 11))
            }
          />
        </Field>
        <Field title="Payer ID" hint="Lagos State LIRS, for individuals.">
          <input
            className={field}
            style={input}
            value={payerId}
            onChange={(e) => setPayerId(e.target.value)}
          />
        </Field>
        <Field title="TIN" hint="If you are registered as a company.">
          <input
            className={field}
            style={input}
            value={tin}
            onChange={(e) => setTin(e.target.value)}
          />
        </Field>
        <Field title="RC number" hint="CAC registration, if you have one.">
          <input
            className={field}
            style={input}
            value={rcNumber}
            onChange={(e) => setRcNumber(e.target.value)}
          />
        </Field>
        <Field title="State you live in">
          <select
            className={field}
            style={input}
            value={residentialState}
            onChange={(e) => setResidentialState(e.target.value)}
          >
            <option value="">Select a state</option>
            {NIGERIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-4">
        <Field title="Home address">
          <input
            className={field}
            style={input}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-4">
        <span className={label} style={{ color: C.ink3 }}>
          Passport photograph
        </span>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handlePhoto(e.target.files?.[0])}
        />
        <div className="flex items-center gap-3">
          {photoUrl ? (
            <>
              <img
                src={photoUrl}
                alt=""
                className="h-12 w-12 rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => setPhotoUrl("")}
                className="inline-flex items-center gap-1.5 text-xs font-semibold"
                style={{ color: C.ink3 }}
              >
                <X className="w-3.5 h-3.5" />
                Remove
              </button>
            </>
          ) : null}
          <button
            type="button"
            disabled={photoBusy}
            onClick={() => fileRef.current?.click()}
            className="inline-flex h-10 px-4 items-center gap-2 rounded-full text-sm font-bold border"
            style={{ borderColor: C.line2, color: C.ink2 }}
          >
            {photoBusy ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
            {photoBusy ? "Uploading…" : photoUrl ? "Change photo" : "Add photo"}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-xs font-semibold" style={{ color: "#7d2820" }}>
          {error}
        </p>
      )}

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex h-11 px-6 items-center gap-2 rounded-full text-sm font-bold text-white disabled:opacity-60"
          style={{ background: saved ? C.primaryInk : C.primary }}
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <Check className="w-4 h-4" />
          ) : null}
          {saving ? "Saving…" : saved ? "Saved" : "Save changes"}
        </button>
      </div>
    </Card>
  );
}
