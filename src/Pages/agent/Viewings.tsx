import { useEffect, useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import viewingsService from "../../api/services/viewings";
import type { Viewing, ViewingStatus } from "../../api/types";
import { toast } from "../../lib/toast";
import { C, Card, PageHeader, StatusPill, EmptyState } from "../../components/agent/ui";

const WEEKDAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}
function dayLabel(iso: string): string {
  const d = new Date(iso);
  const today = startOfDay(new Date());
  const that = startOfDay(d);
  const diff = Math.round((that - today) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return `${WEEKDAY[d.getDay()]} ${d.getDate()} ${MONTH[d.getMonth()]}`;
}
function timeLabel(iso: string): string {
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export default function AgentViewings() {
  const [items, setItems] = useState<Viewing[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    viewingsService
      .list({ limit: 100 })
      .then((res) => active && setItems(res.items))
      .catch(() => active && toast.error("Couldn't load viewings"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const summary = useMemo(() => {
    const by = (s: ViewingStatus) => items.filter((v) => v.status === s).length;
    return {
      confirmed: by("CONFIRMED"),
      pending: by("PENDING"),
      completed: by("COMPLETED"),
      noShow: by("NO_SHOW"),
    };
  }, [items]);

  // upcoming (pending + confirmed), soonest first, grouped by day
  const grouped = useMemo(() => {
    const upcoming = items
      .filter((v) => v.status === "PENDING" || v.status === "CONFIRMED")
      .sort((a, b) => +new Date(a.scheduledFor) - +new Date(b.scheduledFor));
    const groups: { label: string; rows: Viewing[] }[] = [];
    upcoming.forEach((v) => {
      const label = dayLabel(v.scheduledFor);
      const g = groups.find((x) => x.label === label);
      if (g) g.rows.push(v);
      else groups.push({ label, rows: [v] });
    });
    return groups;
  }, [items]);

  const patch = (v: Viewing) => setItems((arr) => arr.map((x) => (x.id === v.id ? v : x)));

  const confirm = async (v: Viewing) => {
    setBusyId(v.id);
    try {
      patch(await viewingsService.update(v.id, { status: "CONFIRMED" }));
      toast.success("Viewing confirmed");
    } catch {
      toast.error("Couldn't confirm");
    } finally {
      setBusyId(null);
    }
  };

  const cancel = async (v: Viewing) => {
    if (!window.confirm(`Decline ${v.clientName}'s viewing?`)) return;
    setBusyId(v.id);
    try {
      patch(await viewingsService.cancel(v.id));
      toast.success("Viewing declined");
    } catch {
      toast.error("Couldn't decline");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Viewings"
        subtitle={`${summary.confirmed} confirmed · ${summary.pending} awaiting your confirmation`}
      />

      <div className="mt-[18px] grid gap-4 items-start" style={{ gridTemplateColumns: "minmax(0,1fr) 320px" }}>
        <div className="flex flex-col gap-4 min-w-0">
          {loading ? (
            <Card><p className="text-[13px]" style={{ color: C.ink3 }}>Loading…</p></Card>
          ) : grouped.length === 0 ? (
            <Card>
              <EmptyState
                icon={<CalendarDays className="w-[26px] h-[26px]" />}
                title="No upcoming viewings"
                body="When buyers book a viewing on your listings, they'll appear here."
              />
            </Card>
          ) : (
            grouped.map((g) => (
              <Card key={g.label}>
                <h3 className="m-0 mb-3.5 text-base font-extrabold" style={{ color: C.ink }}>{g.label}</h3>
                {g.rows.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center gap-4 py-3.5 border-t first:border-t-0"
                    style={{ borderColor: C.line2, opacity: busyId === v.id ? 0.5 : 1 }}
                  >
                    <div className="w-16 flex-shrink-0 flex flex-col">
                      <span className="font-heading text-lg font-bold" style={{ color: C.ink }}>{timeLabel(v.scheduledFor)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <b className="text-sm font-bold block" style={{ color: C.ink }}>{v.clientName}</b>
                      <span className="text-xs" style={{ color: C.ink3 }}>
                        {v.listing?.title ?? "Listing"}
                        {v.notes ? ` · ${v.notes}` : ""}
                      </span>
                    </div>
                    {v.status === "CONFIRMED" ? (
                      <div className="flex items-center gap-2">
                        <StatusPill status={v.status} />
                        <button
                          onClick={() => cancel(v)}
                          disabled={busyId === v.id}
                          className="px-3.5 h-9 rounded-full text-[12.5px] font-bold"
                          style={{ background: C.card, border: `1px solid ${C.line}`, color: C.danger }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => confirm(v)}
                          disabled={busyId === v.id}
                          className="px-3.5 h-9 rounded-full text-[12.5px] font-bold text-white"
                          style={{ background: C.primary }}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => cancel(v)}
                          disabled={busyId === v.id}
                          className="px-3.5 h-9 rounded-full text-[12.5px] font-bold"
                          style={{ background: C.card, border: `1px solid ${C.line}`, color: C.ink }}
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </Card>
            ))
          )}
        </div>

        {/* Week summary */}
        <Card>
          <h3 className="m-0 text-base font-extrabold" style={{ color: C.ink }}>This week</h3>
          <div className="mt-3.5 flex flex-col gap-2.5">
            {[
              { label: "Confirmed", value: summary.confirmed, color: C.primary },
              { label: "Pending your confirm", value: summary.pending, color: C.danger },
              { label: "Completed", value: summary.completed, color: C.ink },
              { label: "No-shows", value: summary.noShow, color: C.ink, last: true },
            ].map((row) => (
              <div
                key={row.label}
                className="flex justify-between items-center pb-2.5"
                style={{ borderBottom: row.last ? "none" : `1px solid ${C.line2}` }}
              >
                <span className="text-[13px] font-semibold" style={{ color: C.ink2 }}>{row.label}</span>
                <b className="font-heading text-lg" style={{ color: row.color }}>{row.value}</b>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3.5 rounded-[14px]" style={{ background: C.primarySoft }}>
            <b className="text-[13px]" style={{ color: C.primaryInk }}>Confirm fast to win the booking</b>
            <p className="mt-0.5 mb-0 text-xs" style={{ color: C.primaryInk, opacity: 0.8 }}>
              Buyers pick the agent who replies first.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
