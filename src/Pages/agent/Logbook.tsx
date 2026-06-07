import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import listingsService from "../../api/services/listings";
import type { LogbookEntry } from "../../api/services/listings";
import type { Listing } from "../../api/types";
import { toast } from "../../lib/toast";
import { C, Card, PageHeader, EmptyState, naira } from "../../components/agent/ui";

const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function dateLabel(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getDate()} ${MONTH[d.getMonth()]} ${d.getFullYear()}`;
}

export default function AgentLogbook() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [entries, setEntries] = useState<LogbookEntry[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingLog, setLoadingLog] = useState(false);

  useEffect(() => {
    let active = true;
    listingsService
      .listMine({ limit: 100 })
      .then((res) => {
        if (!active) return;
        setListings(res.items);
        if (res.items[0]) setSelected(res.items[0].id);
      })
      .catch(() => active && toast.error("Couldn't load listings"))
      .finally(() => active && setLoadingList(false));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selected) return;
    let active = true;
    const run = async () => {
      setLoadingLog(true);
      try {
        const res = await listingsService.getLogbook(selected);
        if (active) setEntries(res);
      } catch {
        if (active) setEntries([]);
      } finally {
        if (active) setLoadingLog(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [selected]);

  const current = listings.find((l) => l.id === selected);
  const lifetime = entries.reduce((sum, e) => sum + (e.cost || 0), 0);

  return (
    <div>
      <PageHeader
        title="Property Logbook"
        subtitle="The honest service history that travels with every property you manage."
      />

      <div className="mt-4 grid gap-4 items-start grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Property picker */}
        <Card className="!p-2">
          {loadingList ? (
            <p className="text-[13px] p-3" style={{ color: C.ink3 }}>Loading…</p>
          ) : listings.length === 0 ? (
            <p className="text-[13px] p-3" style={{ color: C.ink3 }}>No listings yet.</p>
          ) : (
            listings.map((l) => {
              const on = l.id === selected;
              return (
                <button
                  key={l.id}
                  onClick={() => setSelected(l.id)}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left"
                  style={{ background: on ? C.primarySoft : "transparent" }}
                >
                  <div className="w-[42px] h-[42px] rounded-[10px] flex-shrink-0" style={{ background: l.coverImage ? `url(${l.coverImage}) center/cover` : C.surface3 }} />
                  <div className="min-w-0">
                    <b className="text-[13.5px] font-bold block truncate" style={{ color: C.ink }}>{l.title}</b>
                    <span className="text-[11.5px]" style={{ color: C.ink3 }}>{l.location}</span>
                  </div>
                </button>
              );
            })
          )}
        </Card>

        {/* Timeline */}
        <Card>
          {!current ? (
            <p className="text-[13px]" style={{ color: C.ink3 }}>Select a property to view its logbook.</p>
          ) : (
            <>
              <div className="flex items-start justify-between mb-3.5">
                <div>
                  <h3 className="m-0 text-base font-extrabold" style={{ color: C.ink }}>{current.title}</h3>
                  <span className="text-[13px]" style={{ color: C.ink3 }}>{current.address}</span>
                </div>
                <div className="text-center flex-shrink-0">
                  <div className="font-heading text-[22px] font-bold" style={{ color: C.ink }}>{naira(lifetime)}</div>
                  <div className="text-[10px] font-bold uppercase" style={{ color: C.ink3 }}>Lifetime spend</div>
                </div>
              </div>

              {loadingLog ? (
                <p className="text-[13px]" style={{ color: C.ink3 }}>Loading entries…</p>
              ) : entries.length === 0 ? (
                <EmptyState
                  icon={<ClipboardList className="w-[26px] h-[26px]" />}
                  title="No logbook entries yet"
                  body="Repairs and services logged against this property — by Service Loop vendors or by you — will appear here as a permanent history."
                />
              ) : (
                <div>
                  {entries.map((e, i) => {
                    const last = i === entries.length - 1;
                    return (
                      <div key={e.id} className="flex gap-3.5">
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div
                            className="w-[13px] h-[13px] rounded-full mt-1"
                            style={e.verified ? { background: C.primary } : { background: C.surface3, border: `2px solid ${C.line}` }}
                          />
                          {!last && <div className="w-0.5 flex-1 mt-1" style={{ background: C.line }} />}
                        </div>
                        <div className="flex-1 pb-5">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-[3px] rounded-full" style={{ background: C.surface2, color: C.ink2 }}>
                              {e.category}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: e.verified ? C.primary : C.ink3 }}>
                              {e.verified ? "✓ Verified" : "Self-reported"}
                            </span>
                            {e.cost > 0 && <b className="ml-auto text-[13px]" style={{ color: C.ink }}>{naira(e.cost)}</b>}
                          </div>
                          <b className="text-sm font-bold block" style={{ color: C.ink }}>{e.title}</b>
                          <span className="text-xs" style={{ color: C.ink3 }}>
                            {e.vendorName}
                            {e.completedAt ? ` · ${dateLabel(e.completedAt)}` : ""}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
