import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Send,
  MessageCircle,
  User,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";

const ease = [0.23, 1, 0.32, 1] as const;

const officeIcon = L.divIcon({
  className: "",
  html: `<div style="background:#1f6f43;color:#fff;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:14px;">&#9679;</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />
      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-8">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">Contact</span>
          </div>

          {/* Hero */}
          <div className="relative overflow-hidden rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] mb-10">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&h=600&fit=crop)" }} />
            <div className="absolute inset-0 bg-linear-to-r from-primary-dark/90 via-primary-dark/75 to-primary-dark/40" />
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
            <div className="relative z-10 p-8 sm:p-10 lg:p-14">
              <h1 className="font-heading text-[2rem] sm:text-[2.5rem] lg:text-[3.5rem] leading-[1.1] font-bold text-white tracking-tight">
                Get in <span className="text-white/70">Touch</span>
              </h1>
              <p className="text-white/60 text-sm leading-relaxed mt-3 max-w-xl">
                Have a question about PropertyLoop? We'd love to hear from you. Send us a message and we'll respond within 24 hours.
              </p>
            </div>
          </div>

          {/* Two-column */}
          <div className="flex flex-col lg:flex-row gap-8 mb-20">
            {/* Left — Form */}
            <div className="flex-1">
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4, ease }} className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                {submitted ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5"><CheckCircle className="w-8 h-8 text-primary" /></div>
                    <h3 className="font-heading font-bold text-primary-dark text-xl">Message Sent!</h3>
                    <p className="text-text-secondary text-sm mt-2">We'll get back to you within 24 hours.</p>
                    <button onClick={() => setSubmitted(false)} className="mt-6 h-10 px-6 rounded-full border border-border-light bg-white/80 text-primary-dark text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all">Send another message</button>
                  </div>
                ) : (
                  <>
                    <h2 className="font-heading font-bold text-primary-dark text-lg mb-5">Send a Message</h2>
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">Full Name</label>
                          <input type="text" placeholder="Your name" className="w-full h-11 px-4 rounded-full bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors" />
                        </div>
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">Email</label>
                          <input type="email" placeholder="you@email.com" className="w-full h-11 px-4 rounded-full bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">Phone</label>
                          <input type="tel" placeholder="+234 800 000 0000" className="w-full h-11 px-4 rounded-full bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors" />
                        </div>
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">Subject</label>
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
                        <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">Message</label>
                        <textarea placeholder="How can we help you?" className="w-full h-32 px-4 py-3 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors resize-none" />
                      </div>
                      <button onClick={() => setSubmitted(true)} className="w-full h-12 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(31,111,67,0.3)]">
                        <Send className="w-4 h-4" /> Send Message
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </div>

            {/* Right — Info + Map */}
            <div className="lg:w-[400px] shrink-0 flex flex-col gap-6">
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4, ease }} className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6">
                <h3 className="font-heading font-bold text-primary-dark text-sm mb-4">Office</h3>
                <div className="flex flex-col gap-4">
                  {[
                    { icon: <MapPin className="w-4 h-4" />, label: "Address", value: "12 Admiralty Way, Lekki Phase 1, Lagos, Nigeria" },
                    { icon: <Phone className="w-4 h-4" />, label: "Phone", value: "+234 801 234 5678" },
                    { icon: <Mail className="w-4 h-4" />, label: "Email", value: "hello@propertyloop.ng" },
                    { icon: <Clock className="w-4 h-4" />, label: "Hours", value: "Mon – Fri: 8am – 6pm WAT" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">{item.icon}</div>
                      <div>
                        <p className="text-text-subtle text-[11px]">{item.label}</p>
                        <p className="text-primary-dark text-sm font-medium">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Map */}
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4, ease }} className="rounded-[20px] overflow-hidden border border-border-light shadow-[0_4px_16px_rgba(0,0,0,0.06)] h-[250px]">
                <MapContainer center={[6.4478, 3.4723]} zoom={15} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }} zoomControl={false}>
                  <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[6.4478, 3.4723]} icon={officeIcon}>
                    <Popup><b>PropertyLoop HQ</b><br />12 Admiralty Way, Lekki</Popup>
                  </Marker>
                </MapContainer>
              </motion.div>

              {/* Social */}
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4, ease }} className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6">
                <h3 className="font-heading font-bold text-primary-dark text-sm mb-3">Follow Us</h3>
                <div className="flex gap-3">
                  {["X", "IG", "LI", "FB"].map((s) => (
                    <a key={s} href="#" className="w-10 h-10 rounded-full bg-white/80 border border-border-light flex items-center justify-center text-text-secondary text-xs font-medium hover:bg-primary hover:text-white hover:border-primary transition-all">{s}</a>
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
