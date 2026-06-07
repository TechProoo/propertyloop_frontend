import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  Pencil,
  MapPin,
  ClipboardList,
  ChevronRight,
  Check,
  Plus,
} from "lucide-react";
import listingsService from "../../api/services/listings";
import leadsService from "../../api/services/leads";
import viewingsService from "../../api/services/viewings";
import type { Lead, Listing, ListingStatus } from "../../api/types";
import { toast } from "../../lib/toast";
import {
  C,
  Card,
  PrimaryButton,
  GhostButton,
  StatusPill,
  StatCard,
  initials,
} from "../../components/agent/ui";

function Toggle({
  on,
  onClick,
  disabled,
}: {
  on: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-11 h-[26px] rounded-full relative shrink-0 transition-colors disabled:opacity-60"
      style={{ background: on ? C.primary : C.surface3 }}
      aria-pressed={on}
    >
      <span
        className="absolute top-[3px] w-5 h-5 rounded-full bg-white transition-all"
        style={{ left: on ? 21 : 3 }}
      />
    </button>
  );
}

function SetRow({
  title,
  sub,
  children,
  last,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-3 py-3"
      style={{ borderBottom: last ? "none" : `1px solid ${C.line2}` }}
    >
      <div className="flex-1">
        <b className="text-[13.5px] block" style={{ color: C.ink }}>{title}</b>
        {sub && <span className="text-xs" style={{ color: C.ink3 }}>{sub}</span>}
      </div>
      {children}
    </div>
  );
}

export default function ManageListing() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [listing, setListing] = useState<Listing | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [viewingsCount, setViewingsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const [featured, setFeatured] = useState(false);
  const [acceptOffers, setAcceptOffers] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      listingsService.getById(id),
      leadsService.list({ limit: 100 }),
      viewingsService.list({ limit: 100 }),
    ]).then(([l, ld, v]) => {
      if (!active) return;
      if (l.status === "fulfilled") {
        setListing(l.value);
        setFeatured(!!l.value.featured);
        setAcceptOffers(!!l.value.openToOffers);
      } else toast.error("Couldn't load this listing");
      if (ld.status === "fulfilled")
        setLeads(ld.value.items.filter((x) => x.listingId === id));
      if (v.status === "fulfilled")
        setViewingsCount(v.value.items.filter((x) => x.listingId === id).length);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id]);

  const setStatus = async (status: ListingStatus, msg: string) => {
    if (!listing) return;
    setBusy(true);
    try {
      const updated = await listingsService.update(listing.id, { status });
      setListing(updated);
      toast.success(msg);
    } catch {
      toast.error("Couldn't update the listing");
    } finally {
      setBusy(false);
    }
  };

  const toggleFeatured = async () => {
    if (!listing) return;
    const next = !featured;
    setFeatured(next);
    try {
      setListing(await listingsService.update(listing.id, { featured: next }));
    } catch {
      setFeatured(!next);
      toast.error("Couldn't update featured placement");
    }
  };

  const toggleOffers = async () => {
    if (!listing) return;
    const next = !acceptOffers;
    setAcceptOffers(next);
    try {
      setListing(await listingsService.update(listing.id, { openToOffers: next }));
    } catch {
      setAcceptOffers(!next);
      toast.error("Couldn't update offer settings");
    }
  };

  const remove = async () => {
    if (!listing) return;
    if (!window.confirm(`Delete "${listing.title}"? This can't be undone.`)) return;
    setBusy(true);
    try {
      await listingsService.remove(listing.id);
      toast.success("Listing deleted");
      navigate("/agent-dashboard/listings");
    } catch {
      toast.error("Couldn't delete listing");
      setBusy(false);
    }
  };

  if (loading) {
    return <p className="text-[13px]" style={{ color: C.ink3 }}>Loading…</p>;
  }
  if (!listing) {
    return (
      <div>
        <BackLink />
        <p className="text-[14px] mt-4" style={{ color: C.ink2 }}>
          This listing couldn't be found.
        </p>
      </div>
    );
  }

  const published = listing.status === "ACTIVE";
  const images = [listing.coverImage, ...(listing.images ?? [])].filter(Boolean);
  const gallery = Array.from(new Set(images));
  const typeLabel =
    listing.type === "SALE" ? "For sale" : listing.type === "RENT" ? "For rent" : "Shortlet";
  const conversion =
    listing.viewsCount > 0 ? ((leads.length / listing.viewsCount) * 100).toFixed(1) : "0";

  const details: { label: string; value: string }[] = [
    { label: "Type", value: `${typeLabel} · ${listing.priceLabel}` },
    { label: "Bedrooms", value: String(listing.beds) },
    { label: "Bathrooms", value: String(listing.baths) },
    { label: "Floor area", value: listing.sqft ? `${listing.sqft} m²` : "—" },
    { label: "Year built", value: listing.yearBuilt || "—" },
    { label: "Property", value: listing.propertyType || "—" },
  ];

  return (
    <div>
      <BackLink />

      {/* Header */}
      <div className="flex items-start justify-between gap-5 flex-wrap mt-2.5">
        <div>
          <h1
            className="m-0 font-heading font-extrabold tracking-tight"
            style={{ fontSize: 30, color: C.ink, letterSpacing: "-0.025em" }}
          >
            {listing.title}
          </h1>
          <p className="mt-1.5 mb-0 text-sm flex items-center gap-1.5 flex-wrap" style={{ color: C.ink2 }}>
            <MapPin className="w-[14px] h-[14px]" />
            {listing.address || listing.location}
            <span style={{ color: C.line }}>·</span>
            <StatusPill status={listing.status} />
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <GhostButton
            onClick={() =>
              listing.slug
                ? window.open(`/property/${listing.slug}`, "_blank")
                : toast.info("Preview available once the listing is live")
            }
          >
            Preview
          </GhostButton>
          <PrimaryButton onClick={() => toast.info("Full listing editor is coming soon")}>
            <Pencil className="w-4 h-4" /> Edit listing
          </PrimaryButton>
        </div>
      </div>

      {/* Performance stats */}
      <div className="mt-[18px] grid gap-3.5 grid-cols-2 xl:grid-cols-4">
        <StatCard value={listing.viewsCount.toLocaleString()} label="Views" delta="all-time" deltaTone="flat" />
        <StatCard hero value={leads.length} label="Leads" delta={`${leads.filter((l) => l.status === "NEW").length} new`} />
        <StatCard value={viewingsCount} label="Viewings booked" delta="this listing" deltaTone="flat" />
        <StatCard value={`${conversion}%`} label="View → lead" deltaTone="flat" />
      </div>

      <div className="mt-4 grid gap-4 items-start grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {/* Left */}
        <div className="flex flex-col gap-4 min-w-0">
          {/* Listing details + gallery */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="m-0 text-base font-extrabold" style={{ color: C.ink }}>Listing details</h3>
            </div>
            <div className="flex gap-2.5 mb-4">
              <div
                className="flex-1 h-[170px] rounded-[14px] bg-cover bg-center"
                style={{ background: gallery[0] ? `url(${gallery[0]}) center/cover` : C.surface3 }}
              />
              <div className="w-[90px] flex flex-col gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-[10px] grid place-items-center text-[13px] font-bold text-white"
                    style={{
                      background:
                        i === 3 && gallery.length > 4
                          ? C.ink
                          : gallery[i]
                            ? `url(${gallery[i]}) center/cover`
                            : C.surface3,
                    }}
                  >
                    {i === 3 && gallery.length > 4 ? `+${gallery.length - 4}` : ""}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {details.map((d) => (
                <div key={d.label}>
                  <span className="text-[11px] font-bold uppercase tracking-wide block" style={{ color: C.ink3 }}>
                    {d.label}
                  </span>
                  <b className="text-sm font-bold mt-0.5 block" style={{ color: C.ink }}>{d.value}</b>
                </div>
              ))}
            </div>
          </Card>

          {/* Documents */}
          <Card>
            <h3 className="m-0 text-base font-extrabold mb-1" style={{ color: C.ink }}>Documents</h3>
            <p className="text-[12.5px] mt-0 mb-2.5" style={{ color: C.ink3 }}>
              Verified documents are the strongest trust signal to buyers.
            </p>
            {(listing.documents ?? []).length === 0 ? (
              <div className="flex items-center gap-3.5 py-3" style={{ borderTop: `1px solid ${C.line2}` }}>
                <div className="w-10 h-10 rounded-[11px] grid place-items-center shrink-0" style={{ background: C.surface2, color: C.ink3 }}>
                  <Plus className="w-[17px] h-[17px]" />
                </div>
                <div className="flex-1">
                  <b className="text-sm block" style={{ color: C.ink }}>No documents yet</b>
                  <span className="text-[11.5px]" style={{ color: C.ink3 }}>Add a C of O or survey plan to strengthen the listing</span>
                </div>
              </div>
            ) : (
              (listing.documents ?? []).map((doc) => (
                <div key={doc.id} className="flex items-center gap-3.5 py-3" style={{ borderTop: `1px solid ${C.line2}` }}>
                  <div
                    className="w-10 h-10 rounded-[11px] grid place-items-center shrink-0 text-white"
                    style={{ background: doc.verified ? C.primary : C.surface2 }}
                  >
                    {doc.verified ? <Check className="w-[17px] h-[17px]" strokeWidth={2.4} /> : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <b className="text-[13px] block truncate" style={{ color: C.ink }}>{doc.name}</b>
                    <span className="text-[11.5px]" style={{ color: C.ink3 }}>
                      {doc.type.replace(/_/g, " ")}
                    </span>
                  </div>
                  {doc.verified && <StatusPill status="ACTIVE" />}
                </div>
              ))
            )}
          </Card>

          {/* Leads on this listing */}
          <Card>
            <div className="flex items-center justify-between mb-1">
              <h3 className="m-0 text-base font-extrabold" style={{ color: C.ink }}>Leads on this listing</h3>
              <Link to="/agent-dashboard/messages" className="text-[13px] font-bold" style={{ color: C.primary }}>
                View all {leads.length}
              </Link>
            </div>
            {leads.length === 0 ? (
              <p className="text-[13px] mt-2" style={{ color: C.ink3 }}>No leads on this listing yet.</p>
            ) : (
              leads.slice(0, 4).map((ld) => (
                <div key={ld.id} className="flex items-center gap-3 py-3" style={{ borderTop: `1px solid ${C.line2}` }}>
                  <div className="w-10 h-10 rounded-full grid place-items-center font-bold text-[13px] shrink-0" style={{ background: C.primarySoft, color: C.primaryInk }}>
                    {initials(ld.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <b className="text-[13.5px] font-bold block" style={{ color: C.ink }}>{ld.name}</b>
                    <span className="block text-xs truncate" style={{ color: C.ink3 }}>{ld.message ?? "Enquiry"}</span>
                  </div>
                  {ld.status === "NEW" && (
                    <span className="text-[10px] font-extrabold px-2 py-1 rounded-full uppercase tracking-wide shrink-0" style={{ background: C.primarySoft, color: C.primaryInk }}>
                      New
                    </span>
                  )}
                </div>
              ))
            )}
          </Card>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4 min-w-0">
          {/* Status controls */}
          <Card>
            <h3 className="m-0 text-base font-extrabold mb-2" style={{ color: C.ink }}>Status</h3>
            <SetRow title="Published" sub="Live and visible to buyers">
              <Toggle
                on={published}
                disabled={busy || listing.status === "SOLD" || listing.status === "RENTED"}
                onClick={() =>
                  published
                    ? setStatus("PAUSED", "Listing paused")
                    : setStatus("ACTIVE", "Listing published")
                }
              />
            </SetRow>
            <SetRow title="Featured placement" sub="Top of search · Pro included">
              <Toggle on={featured} disabled={busy} onClick={toggleFeatured} />
            </SetRow>
            <SetRow title="Accept offers" sub="Buyers can submit offers" last>
              <Toggle on={acceptOffers} disabled={busy} onClick={toggleOffers} />
            </SetRow>
            <div className="flex gap-2 mt-3.5">
              <button
                onClick={() => setStatus(published ? "PAUSED" : "ACTIVE", published ? "Listing paused" : "Listing published")}
                disabled={busy}
                className="flex-1 h-10 rounded-full text-[12.5px] font-bold disabled:opacity-60"
                style={{ background: C.card, border: `1px solid ${C.line}`, color: C.ink }}
              >
                {published ? "Pause listing" : "Publish"}
              </button>
              <button
                onClick={() => setStatus(listing.type === "RENT" ? "RENTED" : "SOLD", "Marked as closed")}
                disabled={busy}
                className="flex-1 h-10 rounded-full text-[12.5px] font-bold disabled:opacity-60"
                style={{ background: C.card, border: `1px solid ${C.primary}`, color: C.primary }}
              >
                {listing.type === "RENT" ? "Mark rented" : "Mark sold"}
              </button>
            </div>
          </Card>

          {/* Logbook quick link */}
          <div className="rounded-[20px] p-5" style={{ background: C.primarySoft, border: "1px solid #cfe5d8" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[11px] grid place-items-center bg-white" style={{ color: C.primary }}>
                <ClipboardList className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <b className="text-sm" style={{ color: C.primaryInk }}>Property Logbook</b>
                <div className="text-xs" style={{ color: C.primaryInk, opacity: 0.8 }}>Service history for this home</div>
              </div>
              <Link
                to="/agent-dashboard/logbook"
                className="px-3.5 h-9 inline-flex items-center rounded-full text-[12.5px] font-bold"
                style={{ background: C.card, border: `1px solid ${C.line}`, color: C.ink }}
              >
                Open
              </Link>
            </div>
          </div>

          {/* More / danger */}
          <Card>
            <h3 className="m-0 text-base font-extrabold mb-1" style={{ color: C.ink }}>More</h3>
            <button
              onClick={remove}
              disabled={busy}
              className="w-full flex items-center justify-between py-3 text-left disabled:opacity-60"
            >
              <div>
                <b className="text-[13.5px] block" style={{ color: C.danger }}>Delete listing</b>
                <span className="text-xs" style={{ color: C.ink3 }}>This can't be undone</span>
              </div>
              <ChevronRight className="w-4 h-4" style={{ color: C.ink3 }} />
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      to="/agent-dashboard/listings"
      className="inline-flex items-center gap-1.5 text-[13px] font-bold"
      style={{ color: C.ink2 }}
    >
      <ChevronLeft className="w-4 h-4" /> Back to My Listings
    </Link>
  );
}
