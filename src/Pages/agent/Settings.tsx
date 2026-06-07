import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import agentsService from "../../api/services/agents";
import uploadService from "../../api/services/upload";
import ProfilePictureUpload from "../../components/Settings/ProfilePictureUpload";
import { toast } from "../../lib/toast";
import { C, Card, PageHeader, PrimaryButton, StatusPill } from "../../components/agent/ui";

const inputCls = "w-full h-[46px] px-3.5 rounded-xl text-sm font-semibold outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold mb-1.5" style={{ color: C.ink2 }}>{label}</label>
      {children}
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-11 h-[26px] rounded-full relative flex-shrink-0 transition-colors"
      style={{ background: on ? C.primary : C.surface3 }}
      aria-pressed={on}
    >
      <span className="absolute top-[3px] w-5 h-5 rounded-full bg-white transition-all" style={{ left: on ? 21 : 3 }} />
    </button>
  );
}

export default function AgentSettings() {
  const { user, refreshUser } = useAuth();
  const ap = user?.agentProfile;

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [agency, setAgency] = useState(ap?.agencyName ?? "");
  const [location, setLocation] = useState(user?.location ?? "");
  const [website, setWebsite] = useState(ap?.website ?? "");
  const [years, setYears] = useState(ap?.yearsExperience ?? 0);
  const [bio, setBio] = useState(user?.bio ?? "");
  const [specialties, setSpecialties] = useState((ap?.specialty ?? []).join(", "));
  const [saving, setSaving] = useState(false);

  const [notif, setNotif] = useState({ leads: true, viewings: true, weekly: false });
  const [twoFa, setTwoFa] = useState(false);

  const handlePhoto = async (file: File): Promise<string> => {
    const { url } = await uploadService.uploadProfilePicture(file);
    await agentsService.updateMe({ avatarUrl: url });
    await refreshUser();
    return url;
  };

  const save = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      // Only send non-empty fields — empty strings fail @IsUrl()/@IsOptional.
      const payload: Record<string, unknown> = {
        name: name.trim(),
        specialty: specialties.split(",").map((s) => s.trim()).filter(Boolean),
      };
      if (phone.trim()) payload.phone = phone.trim();
      if (location.trim()) payload.location = location.trim();
      if (bio.trim()) payload.bio = bio.trim();
      if (agency.trim()) payload.agencyName = agency.trim();
      if (Number.isFinite(years) && years >= 0) payload.yearsExperience = Number(years);
      if (website.trim()) {
        let site = website.trim();
        if (!/^https?:\/\//i.test(site)) site = `https://${site}`;
        payload.website = site;
      }
      await agentsService.updateMe(payload);
      await refreshUser();
      toast.success("Profile saved");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg.join(", ") : msg || "Couldn't save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your profile, security and notifications." />

      <div className="mt-[18px] grid gap-4 items-start grid-cols-1 lg:grid-cols-2">
        {/* Left — profile */}
        <Card>
          <h3 className="m-0 mb-3.5 text-base font-extrabold" style={{ color: C.ink }}>Profile picture</h3>
          <ProfilePictureUpload currentImage={user?.avatarUrl || null} onUpload={handlePhoto} label="Profile Picture" />

          <h3 className="mt-5 mb-3.5 text-base font-extrabold" style={{ color: C.ink }}>Agent profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Field label="Full name">
              <input className={inputCls} style={{ background: C.surface, border: `1px solid ${C.line}`, color: C.ink }} value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Email">
              <input className={inputCls} style={{ background: C.surface2, border: `1px solid ${C.line}`, color: C.ink3 }} value={user?.email ?? ""} disabled />
            </Field>
            <Field label="Phone">
              <input className={inputCls} style={{ background: C.surface, border: `1px solid ${C.line}`, color: C.ink }} value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Field>
            <Field label="Agency">
              <input className={inputCls} style={{ background: C.surface, border: `1px solid ${C.line}`, color: C.ink }} value={agency} onChange={(e) => setAgency(e.target.value)} />
            </Field>
            <Field label="Location">
              <input className={inputCls} style={{ background: C.surface, border: `1px solid ${C.line}`, color: C.ink }} value={location} onChange={(e) => setLocation(e.target.value)} />
            </Field>
            <Field label="Years of experience">
              <input type="number" min={0} className={inputCls} style={{ background: C.surface, border: `1px solid ${C.line}`, color: C.ink }} value={years} onChange={(e) => setYears(Number(e.target.value))} />
            </Field>
          </div>
          <div className="mt-3.5">
            <Field label="Website">
              <input className={inputCls} style={{ background: C.surface, border: `1px solid ${C.line}`, color: C.ink }} value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="looprealty.ng" />
            </Field>
          </div>
          <div className="mt-3.5">
            <Field label="Specialties (comma-separated)">
              <input className={inputCls} style={{ background: C.surface, border: `1px solid ${C.line}`, color: C.ink }} value={specialties} onChange={(e) => setSpecialties(e.target.value)} placeholder="Sales, Rentals, Luxury" />
            </Field>
          </div>
          <div className="mt-3.5">
            <Field label="Bio">
              <textarea className="w-full rounded-xl text-sm font-semibold outline-none px-3.5 py-3" rows={3} style={{ background: C.surface, border: `1px solid ${C.line}`, color: C.ink2 }} value={bio} onChange={(e) => setBio(e.target.value)} />
            </Field>
          </div>
          <PrimaryButton className="mt-4" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </PrimaryButton>
        </Card>

        {/* Right — verification / notifications / security */}
        <div className="flex flex-col gap-4 min-w-0">
          <Card>
            <h3 className="m-0 mb-1.5 text-base font-extrabold" style={{ color: C.ink }}>Verification</h3>
            <div className="flex items-center gap-3 py-3">
              <div className="w-[34px] h-[34px] rounded-[10px] grid place-items-center flex-shrink-0" style={{ background: C.primarySoft, color: C.primary }}>
                <ShieldCheck className="w-[17px] h-[17px]" />
              </div>
              <div className="flex-1">
                <b className="text-[13.5px] block" style={{ color: C.ink }}>KYC {ap?.verified ? "verified" : "not verified"}</b>
                <span className="text-xs" style={{ color: C.ink3 }}>
                  {ap?.verified ? "Identity confirmed via Smile Identity" : "Complete KYC to earn the verified badge"}
                </span>
              </div>
              <StatusPill status={ap?.verified ? "ACTIVE" : "PENDING"} />
            </div>
          </Card>

          <Card>
            <h3 className="m-0 mb-1.5 text-base font-extrabold" style={{ color: C.ink }}>Notifications</h3>
            {[
              { key: "leads" as const, title: "New leads", sub: "Email + push when a buyer enquires" },
              { key: "viewings" as const, title: "Viewing reminders", sub: "1 hour before each viewing" },
              { key: "weekly" as const, title: "Weekly performance", sub: "Monday morning summary", last: true },
            ].map((row) => (
              <div key={row.key} className="flex items-center gap-3 py-3" style={{ borderBottom: row.last ? "none" : `1px solid ${C.line2}` }}>
                <div className="flex-1">
                  <b className="text-[13.5px] block" style={{ color: C.ink }}>{row.title}</b>
                  <span className="text-xs" style={{ color: C.ink3 }}>{row.sub}</span>
                </div>
                <Toggle on={notif[row.key]} onClick={() => setNotif((n) => ({ ...n, [row.key]: !n[row.key] }))} />
              </div>
            ))}
            <p className="text-[11px] mt-1 mb-0" style={{ color: C.ink3 }}>Preferences are stored locally until the settings API is connected.</p>
          </Card>

          <Card>
            <h3 className="m-0 mb-1.5 text-base font-extrabold" style={{ color: C.ink }}>Security</h3>
            <div className="flex items-center gap-3 py-3" style={{ borderBottom: `1px solid ${C.line2}` }}>
              <div className="flex-1">
                <b className="text-[13.5px] block" style={{ color: C.ink }}>Password</b>
                <span className="text-xs" style={{ color: C.ink3 }}>Reset it from the login screen</span>
              </div>
              <a href="/forgot-password" className="px-3.5 h-9 inline-flex items-center rounded-full text-[12.5px] font-bold" style={{ background: C.card, border: `1px solid ${C.line}`, color: C.ink }}>
                Change
              </a>
            </div>
            <div className="flex items-center gap-3 py-3">
              <div className="flex-1">
                <b className="text-[13.5px] block" style={{ color: C.ink }}>Two-factor auth</b>
                <span className="text-xs" style={{ color: C.ink3 }}>Extra security on sign-in</span>
              </div>
              <Toggle on={twoFa} onClick={() => setTwoFa((v) => !v)} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
