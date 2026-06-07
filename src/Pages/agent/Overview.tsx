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
  BouncyLoader,
  initials,
} from "../../components/agent/ui";
import {
  buildAgentNotifications,
  useNotifReads,
} from "./agentNotifications";

export default function AgentOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = (user?.name ?? "there").split(" ")[0];

  const [stats, setStats] = useState<AgentStats | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [nudgeOpen, setNudgeOpen] = useState(!user?.avatarUrl);

  // Notification bell dropdown
  const [notifOpen, setNotifOpen] = useState(false);
  const notifications = buildAgentNotifications(user, stats);
  const { isUnread, markRead, markAllRead, unreadCount } = useNotifReads();
  const unread = unreadCount(notifications);
  const previewNotifs = notifications.slice(0, 5);

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
            <div className="relative">
              <button
                className="w-11 h-11 rounded-xl grid place-items-center relative"
                style={{ background: C.card, border: `1px solid ${C.line}`, color: C.ink2 }}
                onClick={() => setNotifOpen((o) => !o)}
                aria-label="Notifications"
              >
                <Bell className="w-[19px] h-[19px]" />
                {unread > 0 && (
                  <span
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full grid place-items-center text-[10px] font-bold text-white"
                    style={{ background: C.accent, border: `2px solid ${C.card}` }}
                  >
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </button>

              {notifOpen && (
                <>
                  {/* click-away backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotifOpen(false)}
                  />
                  <div
                    className="absolute right-0 mt-2 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl z-50 overflow-hidden text-left"
                    style={{
                      background: C.card,
                      border: `1px solid ${C.line}`,
                      boxShadow: "0 18px 50px rgba(0,0,0,0.14)",
                    }}
                  >
                    <div
                      className="flex items-center justify-between px-4 py-3"
                      style={{ borderBottom: `1px solid ${C.line}` }}
                    >
                      <b className="text-sm font-bold" style={{ color: C.ink }}>
                        Notifications
                      </b>
                      {unread > 0 && (
                        <button
                          onClick={() => markAllRead(notifications.map((n) => n.id))}
                          className="text-xs font-bold"
                          style={{ color: C.primary }}
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-[360px] overflow-y-auto">
                      {previewNotifs.length === 0 ? (
                        <div
                          className="px-4 py-10 text-center text-xs"
                          style={{ color: C.ink3 }}
                        >
                          You're all caught up 🎉
                        </div>
                      ) : (
                        previewNotifs.map((n) => {
                          const fresh = isUnread(n.id);
                          return (
                            <button
                              key={n.id}
                              onClick={() => {
                                markRead(n.id);
                                setNotifOpen(false);
                                navigate(n.to);
                              }}
                              className="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors"
                              style={{
                                borderBottom: `1px solid ${C.line2}`,
                                background: fresh ? C.primarySoft : "transparent",
                              }}
                            >
                              <span
                                className="w-8 h-8 rounded-lg grid place-items-center shrink-0"
                                style={{
                                  background:
                                    n.tone === "action" ? C.primarySoft : C.surface2,
                                  color: n.tone === "action" ? C.primary : C.ink2,
                                }}
                              >
                                {n.icon}
                              </span>
                              <span className="flex-1 min-w-0">
                                <span className="flex items-center gap-2">
                                  <span
                                    className="font-bold text-[13px] truncate"
                                    style={{ color: C.ink }}
                                  >
                                    {n.title}
                                  </span>
                                  {fresh && (
                                    <span
                                      className="w-1.5 h-1.5 rounded-full shrink-0"
                                      style={{ background: C.primary }}
                                    />
                                  )}
                                </span>
                                <span
                                  className="block text-[11.5px] mt-0.5 leading-snug"
                                  style={{ color: C.ink3 }}
                                >
                                  {n.desc}
                                </span>
                              </span>
                            </button>
                          );
                        })
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setNotifOpen(false);
                        navigate("/agent-dashboard/notifications");
                      }}
                      className="w-full px-4 py-3 text-[13px] font-bold transition-colors"
                      style={{ color: C.primary, borderTop: `1px solid ${C.line}` }}
                    >
                      View all notifications
                    </button>
                  </div>
                </>
              )}
            </div>
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
      <div className="mt-4 grid gap-4 items-start grid-cols-1 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
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
              <div className="py-8"><BouncyLoader /></div>
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
