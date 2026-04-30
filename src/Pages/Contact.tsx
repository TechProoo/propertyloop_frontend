import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, CheckCircle, Send } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";

// Brand glyphs — same set used in Footer.tsx (lucide-react too old to ship them)
type IconProps = { className?: string };

const XIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const LinkedinIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const FacebookIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TikTokIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.36a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.79z" />
  </svg>
);

const ease = [0.23, 1, 0.32, 1] as const;

const officeIcon = L.divIcon({
  className: "",
  html: `<div style="background:#1f6f43;color:#fff;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:14px;">&#9679;</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Invalid email address";
    if (!message.trim()) errs.message = "Message is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      setSubmitted(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setErrors({});
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />
      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-8">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">Contact</span>
          </div>

          {/* Hero */}
          <div className="relative overflow-hidden rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] mb-10">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&h=600&fit=crop)",
              }}
            />
            <div className="absolute inset-0 bg-linear-to-r from-primary-dark/90 via-primary-dark/75 to-primary-dark/40" />
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
            <div className="relative z-10 p-8 sm:p-10 lg:p-14">
              <h1 className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3.5rem] leading-[1.1] font-bold text-white tracking-tight">
                Get in <span className="text-white/70">Touch</span>
              </h1>
              <p className="text-white/60 text-sm leading-relaxed mt-3 max-w-xl">
                Have a question about PropertyLoop? We'd love to hear from you.
                Send us a message and we'll respond within 24 hours.
              </p>
            </div>
          </div>

          {/* Two-column */}
          <div className="flex flex-col lg:flex-row gap-8 mb-20">
            {/* Left — Form */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4, ease }}
                className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8"
              >
                {submitted ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                      <CheckCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-heading font-bold text-primary-dark text-xl">
                      Message Sent!
                    </h3>
                    <p className="text-text-secondary text-sm mt-2">
                      We'll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-6 h-10 px-6 rounded-full border border-border-light bg-white/80 text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="font-heading font-bold text-primary-dark text-lg mb-5">
                      Send a Message
                    </h2>
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            Full Name
                          </label>
                          <input
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`w-full h-11 px-4 rounded-full bg-white/80 border ${errors.name ? "border-red-400" : "border-border-light"} text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors`}
                          />
                          {errors.name && (
                            <p className="text-red-500 text-xs mt-1 ml-4">
                              {errors.name}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            Email
                          </label>
                          <input
                            type="email"
                            placeholder="you@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full h-11 px-4 rounded-full bg-white/80 border ${errors.email ? "border-red-400" : "border-border-light"} text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors`}
                          />
                          {errors.email && (
                            <p className="text-red-500 text-xs mt-1 ml-4">
                              {errors.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            Phone
                          </label>
                          <input
                            type="tel"
                            placeholder="+234 800 000 0000"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full h-11 px-4 rounded-full bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            Subject
                          </label>
                          <select className="w-full h-11 px-4 rounded-full bg-white/80 border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors appearance-none">
                            <option>General Enquiry</option>
                            <option>Buying / Renting</option>
                            <option>Agent Support</option>
                            <option>Vendor Support</option>
                            <option>Technical Issue</option>
                            <option>Partnership</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                          Message
                        </label>
                        <textarea
                          placeholder="How can we help you?"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className={`w-full h-32 px-4 py-3 rounded-2xl bg-white/80 border ${errors.message ? "border-red-400" : "border-border-light"} text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors resize-none`}
                        />
                        {errors.message && (
                          <p className="text-red-500 text-xs mt-1 ml-4">
                            {errors.message}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={handleSubmit}
                        className="w-full h-12 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(31,111,67,0.3)]"
                      >
                        <Send className="w-4 h-4" /> Send Message
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </div>

            {/* Right — Info + Map */}
            <div className="lg:w-100 shrink-0 flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4, ease }}
                className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6"
              >
                <h3 className="font-heading font-bold text-primary-dark text-sm mb-4">
                  Office
                </h3>
                <div className="flex flex-col gap-4">
                  {[
                    {
                      icon: <MapPin className="w-4 h-4" />,
                      label: "Address",
                      value: "36 lekki epe expressway wing a,2nd floor lekki Swiss mall",
                    },
                    {
                      icon: <Phone className="w-4 h-4" />,
                      label: "Phone",
                      value: "+234 705 305 3040",
                    },
                    {
                      icon: <Mail className="w-4 h-4" />,
                      label: "Email",
                      value: "support@propertyloop.ng",
                    },
                    {
                      icon: <Clock className="w-4 h-4" />,
                      label: "Hours",
                      value: "Mon – Fri: 8am – 6pm WAT",
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-text-subtle text-[11px]">
                          {item.label}
                        </p>
                        <p className="text-primary-dark text-sm font-medium">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Map */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4, ease }}
                className="rounded-[20px] overflow-hidden border border-border-light shadow-[0_4px_16px_rgba(0,0,0,0.06)] h-[250px]"
              >
                <MapContainer
                  center={[6.4478, 3.4723]}
                  zoom={15}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%" }}
                  zoomControl={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[6.4478, 3.4723]} icon={officeIcon}>
                    <Popup>
                      <b>PropertyLoop HQ</b>
                      <br />
                      36 lekki epe expressway wing a,2nd floor lekki Swiss mall
                    </Popup>
                  </Marker>
                </MapContainer>
              </motion.div>

              {/* Social */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4, ease }}
                className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6"
              >
                <h3 className="font-heading font-bold text-primary-dark text-sm mb-3">
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  {[
                    {
                      label: "X",
                      href: "https://x.com/propertyloop",
                      Icon: XIcon,
                    },
                    {
                      label: "Instagram",
                      href: "https://instagram.com/propertyloop",
                      Icon: InstagramIcon,
                    },
                    {
                      label: "TikTok",
                      href: "https://www.tiktok.com/@propertyloopng",
                      Icon: TikTokIcon,
                    },
                    {
                      label: "LinkedIn",
                      href: "https://www.linkedin.com/company/propertyloopng/",
                      Icon: LinkedinIcon,
                    },
                    {
                      label: "Facebook",
                      href: "https://www.facebook.com/share/18Lq1D7BzL/?mibextid=wwXIfr",
                      Icon: FacebookIcon,
                    },
                  ].map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      title={label}
                      className="w-10 h-10 rounded-full bg-white/80 border border-border-light flex items-center justify-center text-text-secondary hover:bg-primary hover:text-white hover:border-primary transition-all"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
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

export default Contact;
