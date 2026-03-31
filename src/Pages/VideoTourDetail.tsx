import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bed,
  Bath,
  Maximize,
  MapPin,
  Star,
  Phone,
  MessageCircle,
  Mail,
  CheckCircle,
  ShieldCheck,
  Calendar,
  Building2,
  Play,
  X,
  Eye,
  Share2,
  Clock,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { getVideoById, videoListings } from "../data/videos";
import { getAgentById } from "../data/agents";

const ease = [0.23, 1, 0.32, 1] as const;

const VideoTourDetail = () => {
  const { id } = useParams<{ id: string }>();
  const video = getVideoById(id || "");
  const [playing, setPlaying] = useState(false);

  if (!video) {
    return (
      <div className="min-h-screen bg-[#f5f0eb]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-6">
          <div className="w-20 h-20 rounded-full bg-bg-accent border border-border-light flex items-center justify-center mb-6">
            <Play className="w-8 h-8 text-text-subtle" />
          </div>
          <h1 className="font-heading font-bold text-primary-dark text-2xl mb-2">
            Video not found
          </h1>
          <p className="text-text-secondary text-sm mb-6">
            This video tour doesn't exist or has been removed.
          </p>
          <Link
            to="/video-tours"
            className="h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Video Tours
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const agent = getAgentById(video.agentId);
  const similar = videoListings.filter((v) => v.id !== video.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />

      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              to="/video-tours"
              className="hover:text-primary transition-colors"
            >
              Video Tours
            </Link>
            <span>/</span>
            <span className="text-primary-dark font-medium truncate max-w-50">
              {video.title}
            </span>
          </div>

          {/* ─── Video Player Hero ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="relative overflow-hidden rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] mb-8"
          >
            <div className="relative h-75 sm:h-105 lg:h-130 bg-black">
              {playing ? (
                <>
                  <iframe
                    src={`${video.video}?autoplay=1`}
                    title={video.title}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    className="w-full h-full"
                  />
                  <button
                    onClick={() => setPlaying(false)}
                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />

                  {/* Big play button */}
                  <button
                    onClick={() => setPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white hover:scale-110 transition-all duration-300">
                      <Play className="w-9 h-9 text-primary-dark fill-primary-dark ml-1" />
                    </div>
                  </button>

                  {/* Badges */}
                  <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {video.duration}
                  </span>
                  <span className="absolute top-4 right-16 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
                    <Eye className="w-3.5 h-3.5" />
                    {video.views.toLocaleString()} views
                  </span>

                  {/* Actions */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/40 transition-all">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bottom gradient info */}
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-6">
                    <p className="font-heading font-bold text-white text-[1.5rem] sm:text-[2rem] leading-tight drop-shadow-lg">
                      {video.price}
                    </p>
                    <p className="text-white/80 text-sm mt-1">{video.title}</p>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* ─── Main Content ─── */}
          <div className="flex flex-col lg:flex-row gap-8 mb-20">
            {/* Left */}
            <div className="flex-1">
              {/* Title + Specs */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4, ease }}
                className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8 mb-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="font-heading font-bold text-primary-dark text-xl sm:text-2xl leading-tight">
                      {video.title}
                    </h1>
                    <p className="text-text-secondary text-sm mt-1.5 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-primary" />
                      {video.address}, {video.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium shrink-0">
                    <Star className="w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]" />
                    {video.rating}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-5">
                  {[
                    {
                      icon: <Bed className="w-4 h-4 text-primary" />,
                      val: String(video.beds),
                      label: "Bedrooms",
                    },
                    {
                      icon: <Bath className="w-4 h-4 text-primary" />,
                      val: String(video.baths),
                      label: "Bathrooms",
                    },
                    {
                      icon: <Maximize className="w-4 h-4 text-primary" />,
                      val: video.sqft,
                      label: "m²",
                    },
                    {
                      icon: <Building2 className="w-4 h-4 text-primary" />,
                      val: video.propertyType,
                      label: "",
                    },
                    {
                      icon: <Calendar className="w-4 h-4 text-primary" />,
                      val: `Built ${video.yearBuilt}`,
                      label: "",
                    },
                    {
                      icon: <Eye className="w-4 h-4 text-primary" />,
                      val: `${(video.views / 1000).toFixed(1)}k`,
                      label: "views",
                    },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-border-light text-sm"
                    >
                      {s.icon}
                      <span className="font-heading font-bold text-primary-dark">
                        {s.val}
                      </span>
                      {s.label && (
                        <span className="text-text-secondary">{s.label}</span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4, ease }}
                className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8 mb-6"
              >
                <h2 className="font-heading font-bold text-primary-dark text-lg mb-4">
                  About This Property
                </h2>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {video.description}
                </p>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4, ease }}
                className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8 mb-6"
              >
                <h2 className="font-heading font-bold text-primary-dark text-lg mb-4">
                  Features & Amenities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {video.features.map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white/60 border border-border-light"
                    >
                      <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-primary-dark text-sm">{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right */}
            <div className="lg:w-95 shrink-0">
              {/* Agent card */}
              {agent && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4, ease }}
                  className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 mb-6"
                >
                  <h3 className="font-heading font-bold text-primary-dark text-sm mb-4">
                    Listed by
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={agent.photo}
                      alt={agent.name}
                      className="w-14 h-14 rounded-full object-cover object-top border-2 border-white shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-heading font-bold text-primary-dark text-sm truncate">
                          {agent.name}
                        </p>
                        {agent.verified && (
                          <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-text-secondary text-xs">
                        {agent.agency}
                      </p>
                      <div className="flex items-center gap-3 text-text-secondary text-xs mt-1">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-[#F5A623] fill-[#F5A623]" />{" "}
                          {agent.rating}
                        </span>
                        <span>{agent.listings} listings</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <a
                      href={`tel:+${agent.phone}`}
                      className="h-11 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2 shadow-lg shadow-glow/40"
                    >
                      <Phone className="w-4 h-4" /> Call Agent
                    </a>
                    <a
                      href={`https://wa.me/${agent.phone}?text=Hi ${agent.name}, I watched the video tour for ${video.title} and I'm interested.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-11 rounded-full bg-[#25D366] text-white text-sm font-bold hover:bg-[#20bd5a] transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </a>
                    <a
                      href={`mailto:${agent.email}?subject=Video Tour: ${video.title}`}
                      className="h-11 rounded-full bg-white/80 border border-border-light text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all inline-flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" /> Email
                    </a>
                  </div>
                  <Link
                    to={`/agent/${agent.id}`}
                    className="block text-center text-primary text-xs font-medium mt-3 hover:underline"
                  >
                    View full agent profile
                  </Link>
                </motion.div>
              )}

              {/* Price card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4, ease }}
                className="bg-primary rounded-[20px] p-6 text-white mb-6"
              >
                <p className="text-white/60 text-xs">Asking Price</p>
                <p className="font-heading font-bold text-[1.8rem] leading-tight mt-1">
                  {video.price}
                </p>
                <div className="h-px bg-white/20 my-4" />
                <div className="flex items-center gap-2 text-white/70 text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Escrow-protected transaction via Paystack</span>
                </div>
              </motion.div>

              {/* More Video Tours */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4, ease }}
                className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden"
              >
                <div className="px-6 py-5 border-b border-border-light">
                  <h2 className="font-heading font-bold text-primary-dark text-lg">
                    More Video Tours
                  </h2>
                </div>
                <div className="p-4 flex flex-col gap-4">
                  {similar.map((s) => (
                    <Link
                      key={s.id}
                      to={`/video-tour/${s.id}`}
                      className="group flex gap-4 bg-white/60 backdrop-blur-sm border border-border-light rounded-2xl p-3 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <div className="w-24 h-20 rounded-xl overflow-hidden shrink-0 relative">
                        <img
                          src={s.thumbnail}
                          alt={s.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
                            <Play className="w-3.5 h-3.5 text-primary-dark fill-primary-dark ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-medium">
                          {s.duration}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 py-0.5">
                        <p className="font-heading font-bold text-primary-dark text-[15px]">
                          {s.price}
                        </p>
                        <p className="font-heading font-semibold text-primary-dark text-sm leading-snug mt-0.5 truncate">
                          {s.title}
                        </p>
                        <p className="text-text-secondary text-xs mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {s.location}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="px-4 pb-4">
                  <Link
                    to="/video-tours"
                    className="w-full h-10 rounded-full bg-white/80 backdrop-blur-sm border border-border-light text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 inline-flex items-center justify-center gap-2"
                  >
                    Browse all video tours <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VideoTourDetail;
