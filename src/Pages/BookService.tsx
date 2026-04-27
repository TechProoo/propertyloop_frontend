import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  MapPin,
  Star,
  Phone,
  MessageCircle,
  CheckCircle,
  ShieldCheck,
  Calendar,
  ClipboardList,
  Wrench,
  Send,
  ChevronDown,
  ChevronUp,
  Flag,
  X,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import vendorsService from "../api/services/vendors";
import messagesService from "../api/services/messages";
import vendorJobsService from "../api/services/vendorJobs";
import { useAuth } from "../context/AuthContext";
import type { VendorPublic } from "../api/types";
// Chat and booking data now handled via API services
type ChatMessage = {
  sender: "you" | "them";
  text: string;
  time: string;
};

type Conversation = {
  id: string;
  name: string;
  avatar: string;
  role: string;
  phone: string;
  messages: ChatMessage[];
};

const getConversation = (id: string): Conversation | null => {
  const stored = localStorage.getItem(`conversation-${id}`);
  return stored ? JSON.parse(stored) : null;
};

const saveConversation = (conversation: Conversation) => {
  localStorage.setItem(`conversation-${conversation.id}`, JSON.stringify(conversation));
};

const addMessage = (convoId: string, message: ChatMessage) => {
  const existing = getConversation(convoId);
  if (existing) {
    existing.messages.push(message);
    saveConversation(existing);
  }
};

const ease = [0.23, 1, 0.32, 1] as const;


/* ─── Review / Report Vendor ─── */
const VendorReviewSection = ({ vendorName }: { vendorName: string }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [disputeText, setDisputeText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

  const handleReviewSubmit = () => {
    if (reviewRating > 0 && reviewText.trim()) {
      setReviewSubmitted(true);
      setTimeout(() => {
        setShowReviewForm(false);
        setReviewSubmitted(false);
        setReviewRating(0);
        setReviewText("");
      }, 2000);
    }
  };

  const handleDisputeSubmit = () => {
    if (disputeText.trim()) {
      setDisputeSubmitted(true);
      setTimeout(() => {
        setShowDisputeForm(false);
        setDisputeSubmitted(false);
        setDisputeText("");
      }, 2000);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-5 mt-4">
      <div className="flex gap-2">
        <button
          onClick={() => {
            setShowReviewForm(!showReviewForm);
            setShowDisputeForm(false);
          }}
          className="flex-1 h-9 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors inline-flex items-center justify-center gap-1.5"
        >
          <Star className="w-3.5 h-3.5" /> Review
        </button>
        <button
          onClick={() => {
            setShowDisputeForm(!showDisputeForm);
            setShowReviewForm(false);
          }}
          className="flex-1 h-9 rounded-full bg-white/60 border border-border-light text-text-secondary text-xs font-medium hover:border-red-300 hover:text-red-500 transition-all inline-flex items-center justify-center gap-1.5"
        >
          <Flag className="w-3.5 h-3.5" /> Report
        </button>
      </div>

      <AnimatePresence mode="wait">
        {showReviewForm && (
          <motion.div
            key="review"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            {reviewSubmitted ? (
              <div className="text-center py-4">
                <CheckCircle className="w-8 h-8 text-primary mx-auto mb-1" />
                <p className="font-heading font-bold text-primary-dark text-sm">
                  Review submitted!
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-heading font-semibold text-primary-dark text-xs">
                    Rate {vendorName}
                  </p>
                  <button
                    onClick={() => setShowReviewForm(false)}
                    className="text-text-subtle hover:text-primary-dark"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setReviewRating(star)}>
                      <Star
                        className={`w-5 h-5 ${star <= reviewRating ? "text-[#F5A623] fill-[#F5A623]" : "text-border-light"}`}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-white/80 border border-border-light text-primary-dark text-xs placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors resize-none"
                />
                <button
                  onClick={handleReviewSubmit}
                  disabled={reviewRating === 0 || !reviewText.trim()}
                  className="mt-2 h-8 px-4 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors inline-flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-3 h-3" /> Submit
                </button>
              </>
            )}
          </motion.div>
        )}
        {showDisputeForm && (
          <motion.div
            key="dispute"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            {disputeSubmitted ? (
              <div className="text-center py-4">
                <CheckCircle className="w-8 h-8 text-primary mx-auto mb-1" />
                <p className="font-heading font-bold text-primary-dark text-sm">
                  Report submitted!
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-heading font-semibold text-primary-dark text-xs">
                    Report {vendorName}
                  </p>
                  <button
                    onClick={() => setShowDisputeForm(false)}
                    className="text-text-subtle hover:text-primary-dark"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea
                  value={disputeText}
                  onChange={(e) => setDisputeText(e.target.value)}
                  placeholder="Describe the issue..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-white/80 border border-border-light text-primary-dark text-xs placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors resize-none"
                />
                <button
                  onClick={handleDisputeSubmit}
                  disabled={!disputeText.trim()}
                  className="mt-2 h-8 px-4 rounded-full bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors inline-flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Flag className="w-3 h-3" /> Submit Report
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BookService = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [vendor, setVendor] = useState<VendorPublic | null>(null);
  const [loadingVendor, setLoadingVendor] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoadingVendor(false);
      return;
    }
    vendorsService
      .getById(id)
      .then(setVendor)
      .catch(() => {})
      .finally(() => setLoadingVendor(false));
  }, [id]);

  // Form state
  const [jobDescription, setJobDescription] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("10:00");
  const [propertyAddress, setPropertyAddress] = useState("");

  // Mini chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [convoId, setConvoId] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Booking negotiation state
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Initialize chat - create/find conversation and load messages
  useEffect(() => {
    if (!vendor || !id) return;

    const initializeChat = async () => {
      try {
        console.log("Initializing chat with vendor:", vendor);
        // Create or find conversation with vendor
        const result = await messagesService.createOrFind({
          recipientId: vendor.id,
          recipientRole: "VENDOR",
          senderRole: "BUYER",
        });
        console.log("Conversation created/found:", result);
        setConvoId(result.conversationId);

        // Load existing messages
        try {
          const messages = await messagesService.getMessages(result.conversationId);
          console.log("Messages loaded:", messages);
          if (messages && messages.length > 0) {
            const formattedMessages: ChatMessage[] = messages.map((msg) => ({
              sender: msg.isYou ? "you" : "them",
              text: msg.text,
              time: new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }));
            setChatMessages(formattedMessages);
          }
        } catch (msgError) {
          console.warn("Could not load messages:", msgError);
        }
      } catch (error) {
        console.error("Failed to initialize chat:", error);
      }
    };

    initializeChat();
  }, [vendor, id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendNegotiationRequest = async () => {
    if (!jobDescription.trim() || !vendor || !convoId || !user) {
      console.log("Negotiation blocked:", { hasDescription: !!jobDescription.trim(), hasVendor: !!vendor, hasConvoId: !!convoId, hasUser: !!user });
      return;
    }

    setSending(true);

    try {
      // Create the VendorJob booking record
      await vendorJobsService.createBooking({
        vendorId: vendor.id,
        title: vendor.category || "Service",
        description: jobDescription,
        address: propertyAddress || "Not specified",
        category: vendor.category || "Service",
        vendorFee: Math.max(vendor.priceNum ?? 0, 15000),
        scheduledFor: preferredDate ? new Date(`${preferredDate}T${preferredTime}`).toISOString() : new Date().toISOString(),
        clientName: (user as any).name || "Client",
        clientPhone: (user as any).phone,
        clientEmail: (user as any).email,
      });
      console.log("Vendor job booking created successfully");

      // Format the booking details as a nicely formatted message
      const messageText = `📋 SERVICE REQUEST

📝 What I need:
${jobDescription}

${preferredDate ? `📅 Preferred Date: ${new Date(preferredDate).toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}` : ""}
${preferredDate ? `⏰ Preferred Time: ${preferredTime}` : ""}

${propertyAddress ? `📌 Notes: ${propertyAddress}` : ""}

Let's negotiate the scope and pricing. Looking forward to your response!`;

      await messagesService.sendMessage(convoId, messageText);
      setSent(true);
      console.log("Negotiation request sent successfully");

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = "/dashboard?tab=messages";
      }, 2000);
    } catch (error) {
      console.error("Failed to send negotiation request:", error);
      setSending(false);
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || !vendor || !convoId) {
      console.log("Chat send blocked:", { hasInput: !!chatInput.trim(), hasVendor: !!vendor, hasConvoId: !!convoId });
      return;
    }

    const messageText = chatInput.trim();
    setChatInput("");

    const msg: ChatMessage = {
      sender: "you",
      text: messageText,
      time: "Just now",
    };

    console.log("Sending message:", { convoId, messageText, msg });
    addMessage(convoId, msg);
    setChatMessages((prev) => {
      const updated = [...prev, msg];
      console.log("Chat messages updated:", updated);
      return updated;
    });

    // Send message to backend API
    try {
      const result = await messagesService.sendMessage(convoId, messageText);
      console.log("Message sent successfully:", result);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (loadingVendor) {
    return (
      <div className="min-h-screen bg-[#f5f0eb] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-[#f5f0eb]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 px-6">
          <div className="w-20 h-20 rounded-full bg-bg-accent border border-border-light flex items-center justify-center mb-6">
            <Wrench className="w-8 h-8 text-text-subtle" />
          </div>
          <h1 className="font-heading font-bold text-primary-dark text-2xl mb-2">
            Vendor not found
          </h1>
          <Link
            to="/services"
            className="mt-4 h-10 px-6 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Service Loop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />
      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-8">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              to="/services"
              className="hover:text-primary transition-colors"
            >
              Service Loop
            </Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">
              Book {vendor.name}
            </span>
          </div>


          <div className="flex flex-col lg:flex-row gap-8 mb-20">
            {/* Left — step content */}
            <div className="flex-1">
              <div>
                <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-6 sm:p-8">
                      <h2 className="font-heading font-bold text-primary-dark text-lg mb-5">
                        Describe Your Job
                      </h2>

                      {/* Vendor mini card */}
                      <Link
                        to={`/vendor/${vendor.id}`}
                        className="flex items-center gap-4 bg-white/60 border border-border-light rounded-2xl p-4 mb-6 hover:shadow-md hover:border-primary/30 transition-all"
                      >
                        <img
                          src={vendor.avatarUrl ?? ""}
                          alt={vendor.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-heading font-bold text-primary-dark text-sm hover:text-primary transition-colors">
                              {vendor.name}
                            </p>
                            {vendor.verified && (
                              <CheckCircle className="w-3.5 h-3.5 text-primary" />
                            )}
                          </div>
                          <p className="text-text-secondary text-xs">
                            {vendor.category} · {vendor.location}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-text-secondary">
                          <Star className="w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]" />{" "}
                          {vendor.rating}
                        </div>
                      </Link>

                      <div className="flex flex-col gap-4">
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            What do you need done?
                          </label>
                          <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Describe the job in detail — what needs to be fixed, installed, or repaired..."
                            className="w-full h-28 px-4 py-3 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors resize-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                              Preferred Date
                            </label>
                            <div className="relative">
                              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                              <input
                                type="date"
                                value={preferredDate}
                                onChange={(e) =>
                                  setPreferredDate(e.target.value)
                                }
                                className="w-full h-11 pl-11 pr-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                              Preferred Time
                            </label>
                            <select
                              value={preferredTime}
                              onChange={(e) => setPreferredTime(e.target.value)}
                              className="w-full h-11 px-4 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm focus:outline-none focus:border-primary transition-colors appearance-none"
                            >
                              <option>08:00</option>
                              <option>09:00</option>
                              <option>10:00</option>
                              <option>11:00</option>
                              <option>12:00</option>
                              <option>13:00</option>
                              <option>14:00</option>
                              <option>15:00</option>
                              <option>16:00</option>
                              <option>17:00</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-heading font-semibold text-primary-dark mb-1.5 block">
                            Negotiation Notes
                          </label>
                          <div className="relative">
                            <MessageCircle className="absolute left-4 top-3.5 w-4 h-4 text-text-subtle" />
                            <textarea
                              value={propertyAddress}
                              onChange={(e) =>
                                setPropertyAddress(e.target.value)
                              }
                              placeholder="State your negotiation — chat with vendor to agree on scope and pricing before confirming."
                              className="w-full h-20 pl-11 pr-4 py-3 rounded-2xl bg-white/80 border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors resize-none"
                            />
                          </div>
                          <p className="text-[11px] text-text-subtle mt-1 ml-1">
                            Property address will be shared after negotiation is
                            concluded.
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end mt-6">
                        <button
                          onClick={handleSendNegotiationRequest}
                          disabled={!jobDescription.trim() || sending}
                          className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-primary text-white font-heading font-semibold text-sm shadow-lg shadow-glow/40 hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {sending ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              Continue Negotiation <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                {/* Success Message Overlay */}
                  <AnimatePresence>
                    {sent && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                      >
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                        <div className="relative bg-white/95 backdrop-blur-md border border-white/40 rounded-[20px] shadow-2xl p-8 sm:p-10 text-center max-w-sm">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                            }}
                            className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-5 shadow-lg shadow-glow/40"
                          >
                            <MessageCircle className="w-8 h-8 text-white" />
                          </motion.div>
                          <h2 className="font-heading font-bold text-primary-dark text-xl">
                            Request Sent!
                          </h2>
                          <p className="text-text-secondary text-sm mt-2">
                            Your service request has been sent to {vendor.name}. Continue negotiating details on your dashboard.
                          </p>
                          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-text-secondary">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            Redirecting to dashboard...
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
              </div>
            </div>

            {/* Right — Vendor summary */}
            <div className="lg:w-85 shrink-0">
                <div className="sticky top-8 flex flex-col gap-4">
                  <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                    <Link to={`/vendor/${vendor.id}`}>
                      <img
                        src={vendor.bannerImage ?? vendor.avatarUrl ?? ""}
                        alt={vendor.name}
                        className="w-full h-40 object-cover hover:opacity-90 transition-opacity"
                      />
                    </Link>
                    <div className="p-5">
                      <Link to={`/vendor/${vendor.id}`} className="group flex items-center gap-3 mb-3 hover:opacity-80 transition-opacity">
                        <img
                          src={vendor.avatarUrl ?? ""}
                          alt={vendor.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-heading font-bold text-primary-dark text-sm truncate group-hover:text-primary transition-colors">
                              {vendor.name}
                            </p>
                            {vendor.verified && (
                              <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                            )}
                          </div>
                          <p className="text-text-secondary text-xs">
                            {vendor.category}
                          </p>
                        </div>
                      </Link>
                      <div className="flex items-center gap-3 text-xs text-text-secondary mb-3">
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-[#F5A623] fill-[#F5A623]" />{" "}
                          {vendor.rating}
                        </span>
                        <span>{vendor.jobsCount} jobs</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {vendor.location}
                        </span>
                      </div>
                      <div className="h-px bg-border-light mb-3" />
                      <p className="font-heading font-bold text-primary-dark text-lg">
                        {vendor.priceLabel ??
                          `From ₦${Math.max(vendor.priceNum ?? 0, 15000).toLocaleString()}`}
                      </p>
                      <p className="text-text-secondary text-xs mt-2 leading-relaxed">
                        {vendor.bio}
                      </p>
                      <div className="h-px bg-border-light my-3" />
                      <div className="flex flex-col gap-2 text-xs text-text-secondary">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-primary" /> KYC
                          verified vendor
                        </div>
                        <div className="flex items-center gap-2">
                          <ClipboardList className="w-4 h-4 text-primary" />{" "}
                          Auto-logged to Property Logbook
                        </div>
                      </div>
                      <div className="h-px bg-border-light my-3" />
                      <div className="flex gap-2">
                        <a
                          href={`tel:+${vendor.phone ?? ""}`}
                          className="flex-1 h-9 rounded-full bg-white/80 border border-white/40 text-primary-dark text-xs font-medium hover:bg-primary hover:text-white hover:border-primary transition-all inline-flex items-center justify-center gap-1"
                        >
                          <Phone className="w-3 h-3" /> Call
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* ─── Review / Report Vendor ─── */}
                  <VendorReviewSection vendorName={vendor.name} />

                  {/* ─── Mini Chat Widget ─── */}
                  <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[20px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                    {/* Chat Header — Toggle */}
                    <button
                      onClick={() => setChatOpen(!chatOpen)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/30 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <MessageCircle className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <p className="font-heading font-bold text-primary-dark text-sm">
                            Chat with {vendor.name.split(" ")[0]}
                          </p>
                          <p className="text-text-subtle text-[10px]">
                            Ask questions before booking
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {chatMessages.length > 1 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-primary text-white text-[9px] font-bold">
                            {chatMessages.length}
                          </span>
                        )}
                        {chatOpen ? (
                          <ChevronDown className="w-4 h-4 text-text-subtle" />
                        ) : (
                          <ChevronUp className="w-4 h-4 text-text-subtle" />
                        )}
                      </div>
                    </button>

                    {/* Chat Body */}
                    <AnimatePresence>
                      {chatOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-white/30">
                            {/* Messages */}
                            <div className="h-64 overflow-y-auto p-3 flex flex-col gap-2 bg-white/20">
                              {chatMessages.map((msg, i) => (
                                <div
                                  key={i}
                                  className={`flex ${msg.sender === "you" ? "justify-end" : "justify-start"}`}
                                >
                                  <div
                                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                                      msg.sender === "you"
                                        ? "bg-primary text-white rounded-br-md"
                                        : "bg-white/70 backdrop-blur-sm border border-white/40 text-primary-dark rounded-bl-md"
                                    }`}
                                  >
                                    {msg.text}
                                    <p
                                      className={`text-[9px] mt-0.5 ${msg.sender === "you" ? "text-white/50" : "text-text-subtle"}`}
                                    >
                                      {msg.time}
                                    </p>
                                  </div>
                                </div>
                              ))}
                              <div ref={chatEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-2 border-t border-white/30 bg-white/20">
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  value={chatInput}
                                  onChange={(e) => setChatInput(e.target.value)}
                                  onKeyDown={(e) =>
                                    e.key === "Enter" && handleChatSend()
                                  }
                                  placeholder="Type a message..."
                                  className="flex-1 h-8 px-3 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 text-xs text-primary-dark placeholder:text-text-subtle focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                                />
                                <button
                                  onClick={handleChatSend}
                                  disabled={!chatInput.trim()}
                                  className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-40 shrink-0"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookService;
