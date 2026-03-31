import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* Fix default marker icon (Leaflet + bundler issue) */
const priceIcon = (price: string) =>
  L.divIcon({
    className: "",
    html: `<div style="background:#1f6f43;color:#fff;font-weight:700;font-size:11px;font-family:'Libre Franklin',sans-serif;padding:4px 10px;border-radius:20px;white-space:nowrap;box-shadow:0 2px 8px rgba(31,111,67,0.35);border:2px solid #fff;cursor:pointer">${price}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });

const activePriceIcon = (price: string) =>
  L.divIcon({
    className: "",
    html: `<div style="background:#fff;color:#1f6f43;font-weight:700;font-size:11px;font-family:'Libre Franklin',sans-serif;padding:4px 10px;border-radius:20px;white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,0.2);border:2px solid #1f6f43;cursor:pointer">${price}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });

export interface MapListing {
  lat: number;
  lng: number;
  price: string;
  title: string;
  address: string;
  beds: number;
  baths: number;
  sqft: string;
  index: number;
}

interface Props {
  listings: MapListing[];
  activeIndex?: number | null;
  onMarkerClick?: (index: number) => void;
  className?: string;
}

/* Recenter map when listings change */
const FitBounds = ({ listings }: { listings: MapListing[] }) => {
  const map = useMap();
  useEffect(() => {
    if (listings.length > 0) {
      const bounds = L.latLngBounds(
        listings.map((l) => [l.lat, l.lng] as [number, number])
      );
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [listings, map]);
  return null;
};

const PropertyMap = ({
  listings,
  activeIndex = null,
  onMarkerClick,
  className = "",
}: Props) => {
  /* Lagos center fallback */
  const center: [number, number] =
    listings.length > 0
      ? [listings[0].lat, listings[0].lng]
      : [6.5244, 3.3792];

  return (
    <div
      className={`rounded-[20px] overflow-hidden border border-border-light shadow-[0_4px_16px_rgba(0,0,0,0.06)] ${className}`}
    >
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", minHeight: "350px" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds listings={listings} />
        {listings.map((listing) => (
          <Marker
            key={listing.index}
            position={[listing.lat, listing.lng]}
            icon={
              activeIndex === listing.index
                ? activePriceIcon(listing.price)
                : priceIcon(listing.price)
            }
            eventHandlers={{
              click: () => onMarkerClick?.(listing.index),
            }}
          >
            <Popup>
              <div style={{ fontFamily: "'Libre Franklin', sans-serif", minWidth: 180 }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: "#1a3d2a", margin: 0 }}>
                  {listing.price}
                </p>
                <p style={{ fontWeight: 600, fontSize: 12, color: "#1a3d2a", margin: "4px 0 2px" }}>
                  {listing.title}
                </p>
                <p style={{ fontSize: 11, color: "#4a7a5c", margin: 0 }}>
                  {listing.address}
                </p>
                {listing.beds > 0 && (
                  <p style={{ fontSize: 11, color: "#4a7a5c", margin: "4px 0 0" }}>
                    {listing.beds} Beds · {listing.baths} Baths · {listing.sqft}m²
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default PropertyMap;
