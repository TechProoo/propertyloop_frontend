import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Home } from "lucide-react";
import listingsService from "../../api/services/listings";
import leadsService from "../../api/services/leads";
import type { Listing, ListingStatus } from "../../api/types";
import { toast } from "../../lib/toast";
import {
  C,
  Card,
  PageHeader,
  PrimaryButton,
  StatusPill,
  EmptyState,
  BouncyLoader,
} from "../../components/agent/ui";

const FILTERS: { id: string; label: string; match: (s: ListingStatus) => boolean }[] = [
  { id: "all", label: "All", match: () => true },
  { id: "active", label: "Active", match: (s) => s === "ACTIVE" },
  { id: "pending", label: "Pending", match: (s) => s === "PENDING_REVIEW" },
  { id: "paused", label: "Paused", match: (s) => s === "PAUSED" },
  { id: "closed", label: "Sold / Rented", match: (s) => s === "SOLD" || s === "RENTED" },
];

export default function AgentListings() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Listing[]>([]);
  const [leadCounts, setLeadCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      listingsService.listMine({ limit: 100 }),
      leadsService.list({ limit: 100 }),
    ]).then(([l, ld]) => {
      if (!active) return;
      if (l.status === "fulfilled") setItems(l.value.items);
      else toast.error("Couldn't load your listings");
      if (ld.status === "fulfilled") {
        const m: Record<string, number> = {};
        ld.value.items.forEach((x) => {
          m[x.listingId] = (m[x.listingId] ?? 0) + 1;
        });
        setLeadCounts(m);
      }
      setLoading(false);
    });
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

  const manage = (id: string) => navigate(`/agent-dashboard/listings/${id}`);

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
          <div className="py-10"><BouncyLoader /></div>
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
                  {["Property", "Type", "Price", "Views", "Leads", "Status", ""].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[11px] font-bold uppercase tracking-wide px-4 py-3.5 whitespace-nowrap"
                      style={{ color: C.ink3, borderBottom: `1px solid ${C.line2}` }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map((l) => (
                  <tr
                    key={l.id}
                    onClick={() => manage(l.id)}
                    className="cursor-pointer transition-colors hover:bg-[#faf9f6]"
                  >
                    <td className="px-4 py-3.5" style={{ borderBottom: `1px solid ${C.line2}` }}>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-[10px] shrink-0"
                          style={{ background: l.coverImage ? `url(${l.coverImage}) center/cover` : C.surface3 }}
                        />
                        <div className="min-w-0">
                          <b className="text-[13.5px] font-bold block" style={{ color: C.ink }}>{l.title}</b>
                          <span className="text-xs" style={{ color: C.ink3 }}>{l.location}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[13.5px] whitespace-nowrap" style={{ borderBottom: `1px solid ${C.line2}`, color: C.ink2 }}>
                      {l.type === "SALE" ? "For sale" : l.type === "RENT" ? "For rent" : "Shortlet"}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap" style={{ borderBottom: `1px solid ${C.line2}` }}>
                      <b className="text-[13.5px]" style={{ color: C.ink }}>{l.priceLabel}</b>
                    </td>
                    <td className="px-4 py-3.5 text-[13.5px]" style={{ borderBottom: `1px solid ${C.line2}`, color: C.ink2 }}>
                      {l.viewsCount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5" style={{ borderBottom: `1px solid ${C.line2}` }}>
                      <span
                        className="inline-grid place-items-center min-w-[24px] h-6 px-2 rounded-full text-xs font-bold"
                        style={{ background: C.primarySoft, color: C.primaryInk }}
                      >
                        {leadCounts[l.id] ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap" style={{ borderBottom: `1px solid ${C.line2}` }}>
                      <StatusPill status={l.status} />
                    </td>
                    <td className="px-4 py-3.5 text-right" style={{ borderBottom: `1px solid ${C.line2}` }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          manage(l.id);
                        }}
                        className="px-3.5 py-1.5 rounded-full text-[12.5px] font-bold whitespace-nowrap hover:bg-[#ece6df] transition-colors"
                        style={{ background: C.card, border: `1px solid ${C.line}`, color: C.ink }}
                      >
                        Manage
                      </button>
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
