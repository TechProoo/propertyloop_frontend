import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  MessageCircle,
  CalendarDays,
  BarChart3,
  Bell,
  Plus,
  UserCircle2,
  X,
  Check,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import agentsService from "../../api/services/agents";
import listingsService from "../../api/services/listings";
import leadsService from "../../api/services/leads";
import type { AgentStats, Lead, Listing } from "../../api/types";
import {
  C,
  Card,
  PageHeader,
  PrimaryButton,
  StatCard,
  EmptyState,
  initials,
} from "../../components/agent/ui";

export default function AgentOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = (user?.name ?? "there").split(" ")[0];

  const [stats, setStats] = useState<AgentStats | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [nudgeOpen, setNudgeOpen] = useState(!user?.avatarUrl);

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      agentsService.getStats(),
      listingsService.listMine({ limit: 6 }),
      leadsService.list({ limit: 3 }),
    ]).then(([s, l, ld]) => {
      if (!active) return;
      if (s.status === "fulfilled") setStats(s.value);
      if (l.status === "fulfilled") setListings(l.value.items);
      if (ld.status === "fulfilled") setLeads(ld.value.items);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const checklist = [
    { label: "Verify your identity (KYC)", done: !!user?.agentProfile?.verified },
    { label: "Add agency details", done: !!user?.agentProfile?.agencyName },
    { label: "Add a profile photo", done: !!user?.avatarUrl },
    { label: "Publish your first listing", done: (stats?.listings.total ?? 0) > 0 },
  ];
  const doneCount = checklist.filter((c) => c.done).length;

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${firstName} 👋`}
        subtitle="Here's how your listings are performing this week."
        actions={
          <>
            <button
              className="w-11 h-11 rounded-xl grid place-items-center relative"
              style={{ background: C.card, border: `1px solid ${C.line}`, color: C.ink2 }}
              onClick={() => navigate("/agent-dashboard/messages")}
              aria-label="Notifications"
            >
              <Bell className="w-[19px] h-[19px]" />
              <span
                className="absolute top-[11px] right-[11px] w-2 h-2 rounded-full"
                style={{ background: C.accent, border: `2px solid ${C.card}` }}
              />
            </button>
            <PrimaryButton onClick={() => navigate("/add-property")}>
              <Plus className="w-[17px] h-[17px]" strokeWidth={2.2} /> Add Listing
            </PrimaryButton>
          </>
        }
      />

      {/* Profile nudge */}
      {nudgeOpen && (
        <div
          className="mt-[22px] flex items-center gap-3.5 px-4 py-3.5 rounded-2xl"
          style={{
            background: "linear-gradient(100deg, #e3efe7, #eef6f0)",
            border: "1px solid #cfe5d8",
          }}
        >
          <div
            className="w-11 h-11 rounded-full grid place-items-center flex-shrink-0"
            style={{ border: `2px dashed ${C.primary}`, color: C.primary }}
          >
            <UserCircle2 className="w-[22px] h-[22px]" />
          </div>
          <div className="flex-1">
            <b className="text-sm font-bold" style={{ color: C.ink }}>
              Add a profile photo to win more trust
            </b>
            <span className="block text-[12.5px] mt-px" style={{ color: C.ink2 }}>
              Agents with photos get up to 3× more enquiries. Takes a few seconds.
            </span>
          </div>
          <button
            onClick={() => navigate("/agent-dashboard/settings")}
            className="px-4 py-2.5 rounded-full text-white text-[13px] font-bold"
            style={{ background: C.primary }}
          >
            Add photo
          </button>
          <button
            onClick={() => setNudgeOpen(false)}
            className="p-1.5"
            style={{ color: C.ink3 }}
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="mt-[18px] grid gap-3.5 grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Home className="w-5 h-5" />}
          value={loading ? "—" : stats?.listings.active ?? 0}
          label="Active listings"
          delta={stats ? `▲ ${stats.listings.pendingReview} pending` : undefined}
        />
        <StatCard
          hero
          icon={<MessageCircle className="w-5 h-5" />}
          value={loading ? "—" : stats?.leads.new ?? 0}
          label="New leads"
          delta={stats ? `${stats.leads.total} total` : undefined}
        />
        <StatCard
          icon={<CalendarDays className="w-5 h-5" />}
          value={loading ? "—" : stats?.viewings.upcoming ?? 0}
          label="Upcoming viewings"
          deltaTone="flat"
          delta={stats ? `${stats.viewings.total} all-time` : undefined}
          iconBg={C.accentSoft}
          iconColor={C.accentInk}
        />
        <StatCard
          icon={<BarChart3 className="w-5 h-5" />}
          value={loading ? "—" : (stats?.listings.totalViews ?? 0).toLocaleString()}
          label="Listing views"
          delta={stats ? `${stats.leads.conversionRate}% → lead` : undefined}
        />
      </div>

      {/* Two columns */}
      <div className="mt-4 grid gap-4 items-start" style={{ gridTemplateColumns: "minmax(0,1.7fr) minmax(0,1fr)" }}>
        <div className="flex flex-col gap-4 min-w-0">
          {/* Views chart (illustrative trend) */}
          <Card>
            <div className="flex items-center justify-between mb-1">
              <h3 className="m-0 text-base font-extrabold" style={{ color: C.ink }}>
                Listing views
              </h3>
              <span className="text-xs font-semibold" style={{ color: C.ink3 }}>
                Last 14 days
              </span>
            </div>
            <div className="h-[168px] mt-3.5 relative">
              <svg viewBox="0 0 600 168" preserveAspectRatio="none" className="w-full h-full block">
                <defs>
                  <linearGradient id="ov-g" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor={C.primary} stopOpacity="0.22" />
                    <stop offset="1" stopColor={C.primary} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 130 L46 120 L92 126 L138 100 L184 110 L230 88 L276 74 L322 82 L368 58 L414 66 L460 44 L506 52 L552 30 L600 38 L600 168 L0 168 Z" fill="url(#ov-g)" />
                <path d="M0 130 L46 120 L92 126 L138 100 L184 110 L230 88 L276 74 L322 82 L368 58 L414 66 L460 44 L506 52 L552 30 L600 38" fill="none" stroke={C.primary} strokeWidth="2.5" />
                <circle cx="552" cy="30" r="5" fill={C.primary} stroke="#fff" strokeWidth="2.5" />
              </svg>
            </div>
            <div className="flex gap-4 mt-2.5 text-xs font-semibold" style={{ color: C.ink2 }}>
              <span>
                <i className="inline-block w-[9px] h-[9px] rounded-[3px] mr-1.5 align-middle" style={{ background: C.primary }} />
                Views
              </span>
              <span style={{ color: C.ink3 }}>
                {(stats?.listings.totalViews ?? 0).toLocaleString()} total this period
              </span>
            </div>
          </Card>

          {/* My listings preview / empty */}
          <Card>
            <div className="flex items-center justify-between mb-1">
              <h3 className="m-0 text-base font-extrabold" style={{ color: C.ink }}>
                My listings
              </h3>
              <Link to="/agent-dashboard/listings" className="text-[13px] font-bold" style={{ color: C.primary }}>
                View all
              </Link>
            </div>
            {loading ? (
              <p className="text-[13px] mt-3" style={{ color: C.ink3 }}>Loading…</p>
            ) : listings.length === 0 ? (
              <div className="mt-3.5">
                <EmptyState
                  icon={<Home className="w-[26px] h-[26px]" />}
                  title="Put your first home in front of buyers"
                  body="Verified listings get up to 4× more enquiries. We'll guide you through it."
                  action={
                    <PrimaryButton className="!h-auto !py-2.5 !rounded-full" onClick={() => navigate("/add-property")}>
                      Create a listing →
                    </PrimaryButton>
                  }
                />
              </div>
            ) : (
              <div className="mt-2">
                {listings.slice(0, 4).map((l) => (
                  <Link
                    key={l.id}
                    to="/agent-dashboard/listings"
                    className="flex items-center gap-3 py-3 border-t first:border-t-0"
                    style={{ borderColor: C.line2 }}
                  >
                    <div
                      className="w-12 h-12 rounded-[10px] bg-cover bg-center flex-shrink-0"
                      style={{ background: l.coverImage ? `url(${l.coverImage}) center/cover` : C.surface3 }}
                    />
                    <div className="flex-1 min-w-0">
                      <b className="text-[13.5px] font-bold block truncate" style={{ color: C.ink }}>{l.title}</b>
                      <span className="text-xs" style={{ color: C.ink3 }}>{l.location}</span>
                    </div>
                    <span className="text-[13px] font-bold" style={{ color: C.ink }}>{l.priceLabel}</span>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4 min-w-0">
          <Card>
            <div className="flex items-center justify-between mb-1">
              <h3 className="m-0 text-base font-extrabold" style={{ color: C.ink }}>Recent leads</h3>
              <Link to="/agent-dashboard/messages" className="text-[13px] font-bold" style={{ color: C.primary }}>View all</Link>
            </div>
            {leads.length === 0 ? (
              <p className="text-[13px] mt-3" style={{ color: C.ink3 }}>
                No leads yet — they'll appear here as buyers enquire.
              </p>
            ) : (
              leads.map((ld) => (
                <div key={ld.id} className="flex items-center gap-3 py-3 border-t first:border-t-0" style={{ borderColor: C.line2 }}>
                  <div className="w-10 h-10 rounded-full grid place-items-center font-bold text-[13px] flex-shrink-0" style={{ background: C.primarySoft, color: C.primaryInk }}>
                    {initials(ld.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <b className="text-[13.5px] font-bold block" style={{ color: C.ink }}>{ld.name}</b>
                    <span className="block text-xs truncate" style={{ color: C.ink3 }}>
                      {ld.listing?.title ?? "Listing"}
                      {ld.message ? ` · "${ld.message}"` : ""}
                    </span>
                  </div>
                  {ld.status === "NEW" && (
                    <span className="text-[10px] font-extrabold px-2 py-1 rounded-full uppercase tracking-wide flex-shrink-0" style={{ background: C.primarySoft, color: C.primaryInk }}>
                      New
                    </span>
                  )}
                </div>
              ))
            )}
          </Card>

          <Card>
            <h3 className="m-0 text-base font-extrabold" style={{ color: C.ink }}>Finish your profile</h3>
            <p className="mt-1 mb-0 text-[13px]" style={{ color: C.ink3 }}>
              {doneCount} of 4 done — verified agents rank higher.
            </p>
            <div className="h-[7px] rounded-full overflow-hidden mt-3" style={{ background: C.surface2 }}>
              <i className="block h-full rounded-full" style={{ width: `${(doneCount / 4) * 100}%`, background: C.primary }} />
            </div>
            <div className="mt-1.5">
              {checklist.map((c) => (
                <div key={c.label} className="flex items-center gap-3 py-[11px] border-t first:border-t-0" style={{ borderColor: C.line2 }}>
                  <div
                    className="w-6 h-6 rounded-[7px] grid place-items-center flex-shrink-0"
                    style={c.done ? { background: C.primary } : { border: `2px solid ${C.line}` }}
                  >
                    {c.done && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </div>
                  <div className="flex-1 text-[13.5px] font-semibold" style={{ color: c.done ? C.ink3 : C.ink }}>
                    {c.label}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
