import { useEffect, useState } from "react";
import agentsService from "../../api/services/agents";
import listingsService from "../../api/services/listings";
import type { AgentStats, Listing } from "../../api/types";
import { C, Card, PageHeader } from "../../components/agent/ui";

export default function AgentAnalytics() {
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.allSettled([agentsService.getStats(), listingsService.listMine({ limit: 100 })]).then(
      ([s, l]) => {
        if (!active) return;
        if (s.status === "fulfilled") setStats(s.value);
        if (l.status === "fulfilled") setListings(l.value.items);
        setLoading(false);
      },
    );
    return () => {
      active = false;
    };
  }, []);

  const views = stats?.listings.totalViews ?? 0;
  const leadsTotal = stats?.leads.total ?? 0;
  const viewingsTotal = stats?.viewings.total ?? 0;
  const closed = stats?.profile.soldRentedCount ?? 0;

  const funnel = [
    { label: "Views", value: views },
    { label: "Leads", value: leadsTotal },
    { label: "Viewings", value: viewingsTotal },
    { label: "Closed", value: closed },
  ];
  const funnelMax = Math.max(views, 1);

  const top = [...listings].sort((a, b) => b.viewsCount - a.viewsCount).slice(0, 3);

  const stat = (value: string, label: string, delta?: string, tone: "up" | "down" | "flat" = "up") => (
    <div className="rounded-[18px] p-[18px]" style={{ background: C.card, border: `1px solid ${C.line}` }}>
      <div className="font-heading font-extrabold" style={{ fontSize: 30, letterSpacing: "-0.03em", color: C.ink }}>{value}</div>
      <div className="text-[13px] font-semibold mt-0.5" style={{ color: C.ink2 }}>{label}</div>
      {delta && (
        <div className="text-xs font-bold mt-2" style={{ color: tone === "up" ? C.primary : tone === "down" ? C.danger : C.ink3 }}>
          {delta}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Your performance across all listings." />

      <div className="mt-[18px] grid gap-3.5 grid-cols-2 xl:grid-cols-4">
        {stat(loading ? "—" : views.toLocaleString(), "Listing views")}
        {stat(loading ? "—" : leadsTotal.toString(), "Total leads")}
        {stat(loading ? "—" : `${stats?.leads.conversionRate ?? 0}%`, "View → lead", undefined, "flat")}
        {stat(loading ? "—" : closed.toString(), "Deals closed", undefined, "flat")}
      </div>

      <div className="mt-4 grid gap-4 items-start grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* Views & leads chart (illustrative) */}
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="m-0 text-base font-extrabold" style={{ color: C.ink }}>Views &amp; leads</h3>
            <div className="flex gap-4 text-xs font-semibold" style={{ color: C.ink2 }}>
              <span><i className="inline-block w-[9px] h-[9px] rounded-[3px] mr-1.5 align-middle" style={{ background: C.primary }} />Views</span>
              <span><i className="inline-block w-[9px] h-[9px] rounded-[3px] mr-1.5 align-middle" style={{ background: C.accent }} />Leads</span>
            </div>
          </div>
          <div className="h-[200px] mt-2 relative">
            <svg viewBox="0 0 600 200" preserveAspectRatio="none" className="w-full h-full block">
              <defs>
                <linearGradient id="an-g" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor={C.primary} stopOpacity="0.2" />
                  <stop offset="1" stopColor={C.primary} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 150 L60 140 L120 148 L180 120 L240 128 L300 96 L360 104 L420 70 L480 80 L540 48 L600 56 L600 200 L0 200 Z" fill="url(#an-g)" />
              <path d="M0 150 L60 140 L120 148 L180 120 L240 128 L300 96 L360 104 L420 70 L480 80 L540 48 L600 56" fill="none" stroke={C.primary} strokeWidth="2.5" />
              <path d="M0 184 L60 180 L120 182 L180 172 L240 176 L300 165 L360 168 L420 158 L480 162 L540 150 L600 154" fill="none" stroke={C.accent} strokeWidth="2.5" strokeDasharray="2 5" />
            </svg>
          </div>
          <p className="text-xs mt-1 mb-0" style={{ color: C.ink3 }}>
            Trend is illustrative — connect a time-series endpoint to plot real daily figures.
          </p>
        </Card>

        {/* Lead funnel */}
        <Card>
          <h3 className="m-0 text-base font-extrabold" style={{ color: C.ink }}>Lead funnel</h3>
          <div className="mt-3.5 flex flex-col gap-3">
            {funnel.map((f) => (
              <div key={f.label}>
                <div className="flex justify-between text-[13px] mb-1.5">
                  <span className="font-semibold" style={{ color: C.ink2 }}>{f.label}</span>
                  <b style={{ color: C.ink }}>{f.value.toLocaleString()}</b>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: C.surface2 }}>
                  <i className="block h-full rounded-full" style={{ width: `${Math.max(4, (f.value / funnelMax) * 100)}%`, background: "linear-gradient(90deg,#1f6f43,#b9842c)" }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top performing */}
      <Card className="mt-4">
        <h3 className="m-0 text-base font-extrabold" style={{ color: C.ink }}>Top performing listings</h3>
        <div className="mt-2">
          {top.length === 0 ? (
            <p className="text-[13px] mt-2" style={{ color: C.ink3 }}>No listings yet.</p>
          ) : (
            top.map((l, i) => (
              <div key={l.id} className="flex items-center gap-3 py-3 border-t first:border-t-0" style={{ borderColor: C.line2 }}>
                <div
                  className="w-10 h-10 rounded-[9px] grid place-items-center font-bold text-[13px] flex-shrink-0"
                  style={i === 0 ? { background: C.accentSoft, color: C.accentInk } : { background: C.surface2, color: C.ink2 }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <b className="text-[13.5px] font-bold block truncate" style={{ color: C.ink }}>{l.title}</b>
                  <span className="text-xs" style={{ color: C.ink3 }}>{l.viewsCount.toLocaleString()} views</span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
