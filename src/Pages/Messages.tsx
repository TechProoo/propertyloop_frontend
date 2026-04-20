import { useState, useMemo, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useChat } from "../api/hooks";
import {
  Search,
  Send,
  Phone,
  Briefcase,
  Wrench,
  ArrowLeft,
  MessageCircle,
  CheckCheck,
  MoreHorizontal,
  Paperclip,
  Smile,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { useAuth } from "../context/AuthContext";
import ServiceRequestMessage from "../components/Messages/ServiceRequestMessage";

const ease = [0.23, 1, 0.32, 1] as const;

/* Seed conversations removed — data now loaded from API */

// Conversation shape the template expects (bridged from API)
interface LocalConvo {
  id: string;
  name: string;
  avatar: string;
  role: string;
  phone: string;
  messages: { sender: "you" | "them"; text: string; time: string }[];
}

const Messages = () => {
  const { isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chat = useChat();
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "Agent" | "Vendor">("all");
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !isLoggedIn) navigate("/onboarding");
  }, [loading, isLoggedIn, navigate]);

  // Auto-open conversation from query param ?with=convoId
  useEffect(() => {
    if (chat.loading) return;
    const fromQuery = searchParams.get("with");
    if (fromQuery && chat.conversations.length > 0) {
      chat.openConversation(fromQuery);
      setMobileShowChat(true);
    } else if (!chat.activeConversationId && chat.conversations.length > 0) {
      chat.openConversation(chat.conversations[0].id);
    }
  }, [chat.loading, searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);

  // Map API conversations to the shape the template expects
  const conversations: Record<string, LocalConvo> = useMemo(() => {
    const map: Record<string, LocalConvo> = {};
    for (const c of chat.conversations) {
      const roleDisplay = c.role === "AGENT" ? "Agent" : c.role === "VENDOR" ? "Vendor" : "Buyer";
      map[c.id] = {
        id: c.id,
        name: c.name,
        avatar: c.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
        role: roleDisplay,
        phone: c.phone || "",
        messages: [],
      };
    }
    return map;
  }, [chat.conversations]);

  const list = useMemo(() => {
    return Object.values(conversations)
      .filter((c) => (filter === "all" ? true : c.role === filter))
      .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  }, [conversations, filter, search]);

  const activeId = chat.activeConversationId;
  const active = activeId ? conversations[activeId] || null : null;

  // Build the message list from the socket hook's messages
  const activeMessages = useMemo(
    () =>
      chat.messages.map((m) => ({
        sender: m.isYou ? ("you" as const) : ("them" as const),
        text: m.text,
        time: new Date(m.createdAt).toLocaleTimeString("en-NG", {
          hour: "numeric",
          minute: "2-digit",
        }),
      })),
    [chat.messages],
  );
  // Patch active with real messages for rendering
  if (active) {
    active.messages = activeMessages;
  }

  const handleSend = () => {
    if (!draft.trim()) return;
    chat.sendMessage(draft.trim());
    setDraft("");
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />
      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">Messages</span>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="font-heading text-[1.8rem] sm:text-[2.4rem] font-bold text-primary-dark leading-tight tracking-tight">
              Messages
            </h1>
            <p className="text-text-secondary text-sm mt-2">
              Conversations with agents and vendors you've contacted on
              PropertyLoop.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden mb-20 h-[640px] flex">
            {/* LEFT — conversation list */}
            <aside
              className={`w-full md:w-85 shrink-0 border-r border-border-light flex flex-col ${mobileShowChat ? "hidden md:flex" : "flex"}`}
            >
              {/* Search */}
              <div className="p-4 border-b border-border-light">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search conversations..."
                    className="w-full h-10 pl-10 pr-4 rounded-full bg-bg-accent border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex gap-1.5 mt-3">
                  {(["all", "Agent", "Vendor"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        filter === f
                          ? "bg-primary text-white border-primary"
                          : "bg-white/80 text-text-secondary border-border-light hover:border-primary"
                      }`}
                    >
                      {f === "all" ? "All" : f + "s"}
                    </button>
                  ))}
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto">
                {list.length === 0 ? (
                  <div className="text-center py-16 px-6">
                    <div className="w-12 h-12 rounded-full bg-bg-accent border border-border-light flex items-center justify-center mx-auto mb-3">
                      <MessageCircle className="w-5 h-5 text-text-subtle" />
                    </div>
                    <p className="text-text-secondary text-sm">
                      No conversations yet
                    </p>
                  </div>
                ) : (
                  list.map((c) => {
                    if (!c) return null;
                    const last = c.messages?.[c.messages.length - 1];
                    const isActive = c.id === activeId;
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          chat.openConversation(c.id);
                          setMobileShowChat(true);
                        }}
                        className={`w-full text-left px-4 py-3.5 border-b border-border-light/60 transition-colors flex items-start gap-3 ${
                          isActive
                            ? "bg-primary/5"
                            : "hover:bg-bg-accent/60"
                        }`}
                      >
                        <div className="relative shrink-0">
                          <img
                            src={c.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"}
                            alt={c.name}
                            className="w-11 h-11 rounded-full object-cover"
                          />
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${c.role === "Agent" ? "bg-primary" : "bg-blue-500"}`}
                          >
                            {c.role === "Agent" ? (
                              <Briefcase className="w-2 h-2 text-white" />
                            ) : (
                              <Wrench className="w-2 h-2 text-white" />
                            )}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-heading font-bold text-primary-dark text-sm truncate">
                              {c.name}
                            </p>
                            <span className="text-text-subtle text-[11px] shrink-0">
                              {last?.time}
                            </span>
                          </div>
                          <p className="text-text-secondary text-xs truncate mt-0.5">
                            {last?.sender === "you" ? "You: " : ""}
                            {last?.text || "No messages yet"}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </aside>

            {/* RIGHT — active chat */}
            <section
              className={`flex-1 min-w-0 flex flex-col ${mobileShowChat ? "flex" : "hidden md:flex"}`}
            >
              {active ? (
                <>
                  {/* Chat header */}
                  <div className="px-5 py-4 border-b border-border-light flex items-center gap-3">
                    <button
                      onClick={() => setMobileShowChat(false)}
                      className="md:hidden w-8 h-8 rounded-full hover:bg-bg-accent flex items-center justify-center text-text-secondary"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <img
                      src={active?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200"}
                      alt={active?.name || "User"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-bold text-primary-dark text-sm truncate">
                        {active?.name || "User"}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 text-xs ${active?.role === "Agent" ? "text-primary" : "text-blue-500"}`}
                      >
                        {active?.role === "Agent" ? (
                          <Briefcase className="w-3 h-3" />
                        ) : (
                          <Wrench className="w-3 h-3" />
                        )}
                        {active?.role || "User"}
                      </span>
                    </div>
                    <a
                      href={`tel:${active?.phone || ""}`}
                      className="w-9 h-9 rounded-full bg-bg-accent border border-border-light flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                    <button className="w-9 h-9 rounded-full bg-bg-accent border border-border-light flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto px-5 py-6 bg-[#fafaf6]">
                    <div className="flex flex-col gap-3">
                      {active.messages.map((m, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, ease }}
                          className={`flex ${m.sender === "you" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              m.sender === "you"
                                ? "bg-primary text-white rounded-br-md shadow-[0_2px_8px_rgba(31,111,67,0.2)]"
                                : "bg-white border border-border-light text-primary-dark rounded-bl-md"
                            }`}
                          >
                            {(m.text.includes("SERVICE REQUEST") || m.text.includes("**Service Request**")) ? (
                              <ServiceRequestMessage text={m.text} />
                            ) : (
                              <p className="whitespace-pre-wrap break-words">{m.text}</p>
                            )}
                            <div
                              className={`flex items-center gap-1 mt-1 text-[10px] ${m.sender === "you" ? "text-white/70 justify-end" : "text-text-subtle"}`}
                            >
                              {m.time}
                              {m.sender === "you" && (
                                <CheckCheck className="w-3 h-3" />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  {/* Composer */}
                  <div className="px-4 py-3 border-t border-border-light bg-white/60 flex items-center gap-2">
                    <button className="w-9 h-9 rounded-full hover:bg-bg-accent flex items-center justify-center text-text-secondary shrink-0">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        onInput={() => chat.setTyping(true)}
                        onBlur={() => chat.setTyping(false)}
                        placeholder="Type a message..."
                        className="w-full h-10 pl-4 pr-10 rounded-full bg-bg-accent border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle hover:text-primary">
                        <Smile className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={handleSend}
                      disabled={!draft.trim()}
                      className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors shadow-[0_2px_8px_rgba(31,111,67,0.3)] disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                  <div className="w-16 h-16 rounded-full bg-bg-accent border border-border-light flex items-center justify-center mb-4">
                    <MessageCircle className="w-7 h-7 text-text-subtle" />
                  </div>
                  <h3 className="font-heading font-bold text-primary-dark text-lg">
                    Select a conversation
                  </h3>
                  <p className="text-text-secondary text-sm mt-2 max-w-xs">
                    Pick a chat from the list to view messages and reply.
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Messages;
