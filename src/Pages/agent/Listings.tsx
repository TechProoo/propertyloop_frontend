import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, ClipboardList, Trash2, Home } from "lucide-react";
import listingsService from "../../api/services/listings";
import type { Listing, ListingStatus } from "../../api/types";
import { toast } from "../../lib/toast";
import {
  C,
  Card,
  PageHeader,
  PrimaryButton,
  StatusPill,
  EmptyState,
} from "../../components/agent/ui";

const FILTERS: { id: string; label: string; match: (s: ListingStatus) => boolean }[] = [
  { id: "all", label: "All", match: () => true },
  { id: "active", label: "Active", match: (s) => s === "ACTIVE" },
  { id: "pending", label: "Pending", match: (s) => s === "PENDING_REVIEW" },
  { id: "paused", label: "Paused", match: (s) => s === "PAUSED" },
  { id: "closed", label: "Sold / Rented", match: (s) => s === "SOLD" || s === "RENTED" },
];

const STATUS_OPTIONS: ListingStatus[] = ["ACTIVE", "PAUSED", "SOLD", "RENTED", "ARCHIVED"];

export default function AgentListings() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    listingsService
      .listMine({ limit: 100 })
      .then((res) => active && setItems(res.items))
      .catch(() => active && toast.error("Couldn't load your listings"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    FILTERS.forEach((f) => (c[f.id] = items.filter((l) => f.match(l.status)).length));
    return c;
  }, [items]);

  const activeCount = items.filter((l) => l.status === "ACTIVE").length;
  const pendingCount = items.filter((l) => l.status === "PENDING_REVIEW").length;

  const shown = items.filter((l) => FILTERS.find((f) => f.id === filter)!.match(l.status));

  const changeStatus = async (l: Listing, status: ListingStatus) => {
    if (status === l.status) return;
    setBusyId(l.id);
    try {
      const updated = await listingsService.update(l.id, { status });
      setItems((arr) => arr.map((x) => (x.id === l.id ? updated : x)));
      toast.success(`Listing marked ${status.toLowerCase().replace("_", " ")}`);
    } catch {
      toast.error("Couldn't update status");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (l: Listing) => {
    if (!window.confirm(`Delete "${l.title}"? This can't be undone.`)) return;
    setBusyId(l.id);
    try {
      await listingsService.remove(l.id);
      setItems((arr) => arr.filter((x) => x.id !== l.id));
      toast.success("Listing deleted");
    } catch {
      toast.error("Couldn't delete listing");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="My listings"
        subtitle={`${activeCount} active · ${pendingCount} pending review · ${items.length} total`}
        actions={
          <PrimaryButton onClick={() => navigate("/add-property")}>
            <Plus className="w-[17px] h-[17px]" strokeWidth={2.2} /> Add Listing
          </PrimaryButton>
        }
      />

      {/* Quota */}
      <Card className="mt-4 !py-4">
        <div className="flex justify-between text-[13px] font-semibold" style={{ color: C.ink2 }}>
          <span>Active listings</span>
          <span style={{ color: C.ink, fontWeight: 700 }}>{activeCount} live</span>
        </div>
        <div className="h-[7px] rounded-full overflow-hidden mt-2.5" style={{ background: C.surface2 }}>
          <i className="block h-full rounded-full" style={{ width: `${Math.min(100, activeCount * 8)}%`, background: C.primary }} />
        </div>
      </Card>

      {/* Filter tabs */}
      <div className="flex gap-1 mt-4 flex-wrap">
        {FILTERS.map((f) => {
          const on = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="px-3.5 py-2 rounded-full text-[13px] font-bold transition-colors"
              style={
                on
                  ? { background: C.ink, color: "#fff", border: `1px solid ${C.ink}` }
                  : { background: C.card, color: C.ink3, border: `1px solid ${C.line}` }
              }
            >
              {f.label} · {counts[f.id] ?? 0}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <Card className="mt-3.5 !p-0 overflow-hidden">
        {loading ? (
          <p className="text-[13px] p-6" style={{ color: C.ink3 }}>Loading…</p>
        ) : shown.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<Home className="w-[26px] h-[26px]" />}
              title="Nothing here yet"
              body="Listings in this category will appear here."
              action={
                <PrimaryButton className="!h-auto !py-2.5 !rounded-full" onClick={() => navigate("/add-property")}>
                  Create a listing →
                </PrimaryButton>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Property", "Type", "Price", "Views", "Status", ""].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[11px] font-bold uppercase tracking-wide px-4 py-3.5"
                      style={{ color: C.ink3, borderBottom: `1px solid ${C.line2}` }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map((l) => (
                  <tr key={l.id} style={{ opacity: busyId === l.id ? 0.5 : 1 }}>
                    <td className="px-4 py-3.5" style={{ borderBottom: `1px solid ${C.line2}` }}>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-[10px] flex-shrink-0"
                          style={{ background: l.coverImage ? `url(${l.coverImage}) center/cover` : C.surface3 }}
                        />
                        <div className="min-w-0">
                          <b className="text-[13.5px] font-bold block" style={{ color: C.ink }}>{l.title}</b>
                          <span className="text-xs" style={{ color: C.ink3 }}>{l.location}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[13.5px]" style={{ borderBottom: `1px solid ${C.line2}`, color: C.ink2 }}>
                      {l.type === "SALE" ? "For sale" : l.type === "RENT" ? "For rent" : "Shortlet"}
                    </td>
                    <td className="px-4 py-3.5" style={{ borderBottom: `1px solid ${C.line2}` }}>
                      <b className="text-[13.5px]" style={{ color: C.ink }}>{l.priceLabel}</b>
                    </td>
                    <td className="px-4 py-3.5 text-[13.5px]" style={{ borderBottom: `1px solid ${C.line2}`, color: C.ink2 }}>
                      {l.viewsCount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5" style={{ borderBottom: `1px solid ${C.line2}` }}>
                      <StatusPill status={l.status} />
                    </td>
                    <td className="px-4 py-3.5" style={{ borderBottom: `1px solid ${C.line2}` }}>
                      <div className="flex items-center gap-2 justify-end">
                        <select
                          value={l.status}
                          disabled={busyId === l.id}
                          onChange={(e) => changeStatus(l, e.target.value as ListingStatus)}
                          className="text-[12.5px] font-bold rounded-full px-3 py-1.5 cursor-pointer"
                          style={{ background: C.card, border: `1px solid ${C.line}`, color: C.ink }}
                        >
                          {!STATUS_OPTIONS.includes(l.status) && <option value={l.status}>{l.status}</option>}
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase().replace("_", " ")}</option>
                          ))}
                        </select>
                        <Link
                          to="/agent-dashboard/logbook"
                          className="w-9 h-9 grid place-items-center rounded-full"
                          style={{ background: C.card, border: `1px solid ${C.line}`, color: C.ink2 }}
                          title="Logbook"
                        >
                          <ClipboardList className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => remove(l)}
                          disabled={busyId === l.id}
                          className="w-9 h-9 grid place-items-center rounded-full"
                          style={{ background: C.card, border: `1px solid ${C.line}`, color: C.danger }}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
