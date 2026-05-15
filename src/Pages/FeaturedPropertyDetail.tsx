import { useState } from "react";
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
  Tag,
  Play,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import type { FeaturedProperty } from "../api/services/featuredProperties";
import { handleBannerError } from "../lib/bannerFallback";
import { formatTel, formatPhoneDisplay } from "../lib/phone";

const WHATSAPP = "2347053053040";
const PHONE = "2347053053040";
const SUPPORT_EMAIL = "support@propertyloop.ng";

export default function FeaturedPropertyDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const property: FeaturedProperty | undefined = location.state?.property;

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  const allImages = property?.imageUrls ?? [];

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const prevLightbox = () =>
    setLightboxIndex((i) => (i === null ? 0 : (i - 1 + allImages.length) % allImages.length));
  const nextLightbox = () =>
    setLightboxIndex((i) => (i === null ? 0 : (i + 1) % allImages.length));

  const waMessage = property
    ? encodeURIComponent(
        `Hi PropertyLoop! I'm interested in: *${property.title}* — ${property.location} (${property.priceLabel}). Please share more details.`,
      )
    : encodeURIComponent("Hi PropertyLoop! I'm interested in a property I saw on your site.");

  const waListMessage = encodeURIComponent(
    "Hi PropertyLoop! I'd like to feature my property on your platform. Please let me know the details.",
  );

  const emailSubject = property
    ? encodeURIComponent(`Enquiry: ${property.title} — ${property.location}`)
    : encodeURIComponent("Property Enquiry");

  const typeBadge =
    property?.type === "SALE"
      ? "For Sale"
      : property?.type === "RENT"
        ? "For Rent"
        : "Shortlet";

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />

      {/* Lightbox */}
      {lightboxIndex !== null && allImages.length > 0 && (
        <div
          className="fixed inset-0 z-9999 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
          >
            <X size={28} />
          </button>
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
                className="absolute left-4 text-white/70 hover:text-white p-2"
              >
                <ChevronLeft size={36} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
                className="absolute right-14 text-white/70 hover:text-white p-2"
              >
                <ChevronRight size={36} />
              </button>
            </>
          )}
          <img
            src={allImages[lightboxIndex]}
            alt="Property"
            onError={handleBannerError}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-4 text-white/50 text-sm">
            {lightboxIndex + 1} / {allImages.length}
          </p>
        </div>
      )}

      {property ? (
        <>
          {/* ── Hero image banner ───────────────────────────────────── */}
          {allImages.length > 0 && (
            <div
              className="relative h-[55vh] md:h-[65vh] w-full cursor-zoom-in overflow-hidden"
              onClick={() => openLightbox(activeImage)}
            >
              <img
                src={allImages[activeImage]}
                alt={property.title}
                onError={handleBannerError}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

              {/* Back button */}
              <button
                onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                className="absolute top-4 left-4 flex items-center gap-2 text-white bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium transition-all"
              >
                <ArrowLeft size={15} />
                Back
              </button>

              {/* Badges */}
              <div className="absolute top-4 right-4 flex gap-2">
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-primary text-white shadow">
                  {typeBadge}
                </span>
                <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white">
                  {property.propertyType}
                </span>
              </div>

              {/* Bottom overlay — title + price */}
              <div className="absolute bottom-0 left-0 right-0 px-5 md:px-10 pb-6 pt-10">
                <h1 className="font-heading font-bold text-white text-2xl md:text-3xl leading-tight drop-shadow-lg">
                  {property.title}
                </h1>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <span className="flex items-center gap-1.5 text-white/80 text-sm">
                    <MapPin size={13} className="shrink-0" />
                    {property.location}
                  </span>
                  <span className="text-white font-bold text-lg md:text-xl bg-primary/80 backdrop-blur-sm px-3 py-0.5 rounded-full">
                    {property.priceLabel}
                  </span>
                </div>
              </div>

              {/* Image count pill */}
              {allImages.length > 1 && (
                <span className="absolute bottom-6 right-5 md:right-10 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm">
                  1 / {allImages.length} — tap to zoom
                </span>
              )}
            </div>
          )}

          {/* ── Thumbnail strip ─────────────────────────────────────── */}
          {allImages.length > 1 && (
            <div className="bg-white/80 border-b border-border-light px-4 md:px-10 py-3">
              <div className="flex gap-2 overflow-x-auto pb-1 max-w-7xl mx-auto">
                {allImages.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`shrink-0 w-20 h-14 md:w-24 md:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === idx
                        ? "border-primary shadow-md scale-105"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt="" onError={handleBannerError} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Body ────────────────────────────────────────────────── */}
          <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left column — details + video + description */}
            <div className="lg:col-span-2 space-y-6 min-w-0">

              {/* Quick stats */}
              <div className="bg-white rounded-2xl border border-border-light p-5 flex flex-wrap gap-x-8 gap-y-3">
                {property.beds > 0 && (
                  <div className="flex items-center gap-2 text-text-secondary text-sm">
                    <Bed size={16} className="text-primary" />
                    <span><strong className="text-primary-dark">{property.beds}</strong> Bed{property.beds !== 1 ? "s" : ""}</span>
                  </div>
                )}
                {property.baths > 0 && (
                  <div className="flex items-center gap-2 text-text-secondary text-sm">
                    <Bath size={16} className="text-primary" />
                    <span><strong className="text-primary-dark">{property.baths}</strong> Bath{property.baths !== 1 ? "s" : ""}</span>
                  </div>
                )}
                {property.sqft && (
                  <div className="flex items-center gap-2 text-text-secondary text-sm">
                    <Maximize size={16} className="text-primary" />
                    <span><strong className="text-primary-dark">{property.sqft}</strong></span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-text-secondary text-sm">
                  <Tag size={16} className="text-primary" />
                  <span><strong className="text-primary-dark">{property.propertyType}</strong></span>
                </div>
              </div>

              {/* Videos */}
              {(() => {
                const vids = property.videoUrls?.length
                  ? property.videoUrls
                  : property.videoUrl
                    ? [property.videoUrl]
                    : [];
                if (!vids.length) return null;
                return (
                  <div className="space-y-4">
                    {vids.map((url, idx) => (
                      <div
                        key={url}
                        className="bg-white rounded-2xl border border-border-light overflow-hidden"
                      >
                        <div className="flex items-center gap-2 px-5 py-3 border-b border-border-light">
                          <Play size={14} className="text-primary" />
                          <span className="text-sm font-semibold text-primary-dark">
                            {vids.length > 1 ? `Property Video ${idx + 1}` : "Property Video"}
                          </span>
                        </div>
                        <video
                          src={url}
                          controls
                          className="w-full max-h-80 bg-black object-contain"
                          poster={allImages[0]}
                        />
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Description */}
              {property.description && (
                <div className="bg-white rounded-2xl border border-border-light p-5 md:p-7">
                  <h2 className="font-heading font-bold text-primary-dark text-lg mb-4">
                    About this property
                  </h2>
                  <div
                    className="prose prose-sm prose-green max-w-none text-text-secondary leading-relaxed overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: property.description }}
                  />
                </div>
              )}
            </div>

            {/* Right column — contact + list CTA */}
            <div className="space-y-5 lg:sticky lg:top-24 self-start">

              {/* Contact card */}
              <div className="bg-white rounded-2xl border border-border-light p-5 shadow-sm">
                <h2 className="font-heading font-bold text-primary-dark text-base mb-1">
                  Interested in this property?
                </h2>
                <p className="text-text-secondary text-xs mb-4">
                  Reach out via any channel below — our team responds fast.
                </p>

                <div className="space-y-2.5">
                  <a
                    href={`https://wa.me/${WHATSAPP}?text=${waMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-green-50 border border-green-200 hover:bg-green-100 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center shrink-0 shadow-sm">
                      <MessageCircle size={18} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest">WhatsApp · Fastest</p>
                      <p className="text-green-900 font-semibold text-sm truncate">+{WHATSAPP}</p>
                    </div>
                    <ChevronRight size={15} className="text-green-400 group-hover:translate-x-0.5 transition-transform" />
                  </a>

                  <a
                    href={formatTel(PHONE)}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center shrink-0 shadow-sm">
                      <Phone size={18} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">Call Us</p>
                      <p className="text-blue-900 font-semibold text-sm truncate">{formatPhoneDisplay(PHONE)}</p>
                    </div>
                    <ChevronRight size={15} className="text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                  </a>

                  <a
                    href={`mailto:${SUPPORT_EMAIL}?subject=${emailSubject}`}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center shrink-0 shadow-sm">
                      <Mail size={18} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-purple-700 uppercase tracking-widest">Email</p>
                      <p className="text-purple-900 font-semibold text-sm truncate">{SUPPORT_EMAIL}</p>
                    </div>
                    <ChevronRight size={15} className="text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* List your property CTA */}
              <div className="relative bg-linear-to-br from-primary to-primary-dark rounded-2xl p-5 overflow-hidden shadow-md">
                {/* Background decoration */}
                <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-white/5" />

                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Star size={15} className="text-yellow-300 fill-yellow-300" />
                    <p className="text-white/90 text-xs font-bold uppercase tracking-widest">
                      Feature Your Property
                    </p>
                  </div>
                  <h3 className="font-heading font-bold text-white text-base leading-snug mb-2">
                    Want your property to stand out like this?
                  </h3>
                  <p className="text-white/75 text-xs leading-relaxed mb-4">
                    Get your listing featured on our homepage and reach thousands of serious buyers and renters every day.
                  </p>
                  <a
                    href={`https://wa.me/${WHATSAPP}?text=${waListMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-white text-primary font-bold text-sm rounded-xl px-4 py-2.5 hover:bg-green-50 transition-colors shadow-sm"
                  >
                    <MessageCircle size={15} />
                    Contact us on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white border border-border-light flex items-center justify-center mb-4 shadow-sm">
            <MapPin size={24} className="text-text-subtle" />
          </div>
          <p className="text-primary-dark font-heading font-bold text-xl mb-2">Property not found</p>
          <p className="text-text-secondary text-sm max-w-xs">
            Please go back and select a property from the gallery.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft size={14} /> Go back
          </button>
        </div>
      )}
    </div>
  );
}
