import { useLocation, useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Phone,
  Mail,
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Play,
  Tag,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import type { FeaturedProperty } from "../api/services/featuredProperties";

const WHATSAPP = "2347053053040";
const PHONE = "2347053053040";
const SUPPORT_EMAIL = "support@propertyloop.ng";

function ContactCard({
  icon,
  label,
  value,
  href,
  colorClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  colorClass: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 p-4 rounded-2xl border border-border-light bg-white/60 backdrop-blur-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-text-subtle uppercase tracking-widest">
          {label}
        </p>
        <p className="text-primary-dark font-bold text-sm truncate">{value}</p>
      </div>
      <ArrowLeft className="ml-auto shrink-0 w-4 h-4 text-text-subtle rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}

export default function FeaturedPropertyDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const property: FeaturedProperty | undefined = location.state?.property;

  const waMessage = property
    ? encodeURIComponent(
        `Hi PropertyLoop! I'm interested in: *${property.title}* — ${property.location} (${property.priceLabel}). Please share more details.`,
      )
    : encodeURIComponent(
        "Hi PropertyLoop! I'm interested in a property I saw on your site.",
      );

  const emailSubject = property
    ? encodeURIComponent(`Enquiry: ${property.title} — ${property.location}`)
    : encodeURIComponent("Property Enquiry");

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors text-sm mb-6"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {property ? (
          <>
            {/* ── Image gallery ─────────────────────────────────── */}
            {property.imageUrls?.length > 0 && (
              <div className="rounded-2xl overflow-hidden border border-border-light shadow-sm mb-6">
                {/* Cover image */}
                <div className="relative h-56 sm:h-72">
                  <img
                    src={property.imageUrls[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full bg-primary text-white">
                    {property.type === "SALE"
                      ? "For Sale"
                      : property.type === "RENT"
                        ? "For Rent"
                        : "Shortlet"}
                  </span>
                  <span className="absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/50 text-white">
                    {property.propertyType}
                  </span>
                </div>

                {/* Additional images */}
                {property.imageUrls.length > 1 && (
                  <div className="bg-white/80 px-4 py-3 border-t border-border-light">
                    <p className="text-[10px] font-semibold text-text-subtle uppercase tracking-widest mb-2">
                      More Photos
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {property.imageUrls.slice(1).map((url, idx) => (
                        <div
                          key={idx}
                          className="shrink-0 w-28 h-20 rounded-xl overflow-hidden border border-border-light"
                        >
                          <img
                            src={url}
                            alt={`${property.title} photo ${idx + 2}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Video ─────────────────────────────────────────── */}
            {property.videoUrl && (
              <div className="rounded-2xl overflow-hidden border border-border-light shadow-sm mb-6 bg-black">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white/90 border-b border-border-light">
                  <Play size={14} className="text-primary" />
                  <span className="text-xs font-semibold text-primary-dark">
                    Property Video
                  </span>
                </div>
                <video
                  src={property.videoUrl}
                  controls
                  className="w-full max-h-72 object-contain"
                  poster={property.imageUrls?.[0]}
                />
              </div>
            )}

            {/* ── Property details ──────────────────────────────── */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-border-light p-5 mb-6">
              <h1 className="font-heading font-bold text-primary-dark text-xl leading-snug">
                {property.title}
              </h1>
              <p className="flex items-center gap-1.5 text-text-secondary text-sm mt-1.5">
                <MapPin size={13} />
                {property.location}
              </p>

              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="text-primary font-bold text-2xl">
                  {property.priceLabel}
                </span>
              </div>

              <div className="flex items-center gap-4 text-text-secondary text-xs mt-2 flex-wrap">
                {property.beds > 0 && (
                  <span className="flex items-center gap-1">
                    <Bed size={12} /> {property.beds} bed{property.beds !== 1 ? "s" : ""}
                  </span>
                )}
                {property.baths > 0 && (
                  <span className="flex items-center gap-1">
                    <Bath size={12} /> {property.baths} bath{property.baths !== 1 ? "s" : ""}
                  </span>
                )}
                {property.sqft && (
                  <span className="flex items-center gap-1">
                    <Maximize size={12} /> {property.sqft}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Tag size={12} /> {property.propertyType}
                </span>
              </div>

              {/* Description */}
              {property.description && (
                <div
                  className="mt-4 pt-4 border-t border-border-light prose prose-sm prose-green max-w-none text-text-secondary text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: property.description }}
                />
              )}
            </div>

            {/* ── Contact options ───────────────────────────────── */}
            <h2 className="font-heading font-bold text-primary-dark text-lg mb-3">
              Interested? Get in touch
            </h2>
            <div className="space-y-3 mb-8">
              <ContactCard
                href={`https://wa.me/${WHATSAPP}?text=${waMessage}`}
                label="WhatsApp — fastest response"
                value={`+${WHATSAPP}`}
                colorClass="bg-green-100 text-green-600"
                icon={<MessageCircle size={20} />}
              />
              <ContactCard
                href={`tel:+${PHONE}`}
                label="Call us directly"
                value={`+${PHONE}`}
                colorClass="bg-blue-100 text-blue-600"
                icon={<Phone size={20} />}
              />
              <ContactCard
                href={`mailto:${SUPPORT_EMAIL}?subject=${emailSubject}`}
                label="Email"
                value={SUPPORT_EMAIL}
                colorClass="bg-purple-100 text-purple-600"
                icon={<Mail size={20} />}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-text-secondary">
            <p className="text-lg font-semibold mb-2">Property not found</p>
            <p className="text-sm">
              Please go back and select a property from the gallery.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
