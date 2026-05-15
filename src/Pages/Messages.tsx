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
  X,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { useAuth } from "../context/AuthContext";
import ServiceRequestMessage from "../components/Messages/ServiceRequestMessage";
import MessagesSkeleton, {
  ConversationsSkeleton,
} from "../components/Messages/MessagesSkeleton";
import messagesService from "../api/services/messages";
import FallbackImg from "../assets/fallback.png";
import { formatTel } from "../lib/phone";

const ease = [0.23, 1, 0.32, 1] as const;

interface LocalConvo {
  id: string;
  name: string;
  avatar: string;
  role: string;
  phone: string;
  messages: { sender: "you" | "them"; text: string; time: string; attachmentUrls: string[] }[];
}

function isImageUrl(url: string) {
  return /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(url);
}

function AttachmentBubble({ urls, isYou }: { urls: string[]; isYou: boolean }) {
  if (!urls.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-1.5">
      {urls.map((url, i) =>
        isImageUrl(url) ? (
          <a key={i} href={url} target="_blank" rel="noopener noreferrer">
            <img
              src={url}
              alt="attachment"
              className="max-w-[180px] max-h-[180px] rounded-xl object-cover border border-white/30 hover:opacity-90 transition-opacity"
            />
          </a>
        ) : (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              isYou
                ? "bg-white/20 border-white/30 text-white hover:bg-white/30"
                : "bg-gray-50 border-gray-200 text-primary-dark hover:bg-gray-100"
            }`}
          >
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate max-w-[120px]">
              {url.split("/").pop()?.split("?")[0] || "Attachment"}
            </span>
          </a>
        ),
      )}
    </div>
  );
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Attachment state
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!loading && !isLoggedIn) navigate("/onboarding");
  }, [loading, isLoggedIn, navigate]);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);

  const conversations: Record<string, LocalConvo> = useMemo(() => {
    const map: Record<string, LocalConvo> = {};
    for (const c of chat.conversations) {
      const roleDisplay = c.role === "AGENT" ? "Agent" : c.role === "VENDOR" ? "Vendor" : "Buyer";
      map[c.id] = {
        id: c.id,
        name: c.name,
        avatar: c.avatar || FallbackImg,
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

  const activeMessages = useMemo(
    () =>
      chat.messages.map((m) => ({
        sender: m.isYou ? ("you" as const) : ("them" as const),
        text: m.text,
        attachmentUrls: m.attachmentUrls ?? [],
        time: new Date(m.createdAt).toLocaleTimeString("en-NG", {
          hour: "numeric",
          minute: "2-digit",
        }),
      })),
    [chat.messages],
  );
  if (active) {
    active.messages = activeMessages;
  }

  const canSend = (draft.trim().length > 0 || pendingFiles.length > 0) && !uploading;

  const handleSend = async () => {
    if (!canSend) return;

    let attachmentUrls: string[] = [];

    if (pendingFiles.length > 0) {
      setUploading(true);
      try {
        const results = await Promise.all(
          pendingFiles.map((f) => messagesService.uploadAttachment(f)),
        );
        attachmentUrls = results.map((r) => r.url);
      } catch {
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    chat.sendMessage(draft.trim(), attachmentUrls);
    setDraft("");
    setPendingFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setPendingFiles((prev) => [...prev, ...files].slice(0, 5));
    e.target.value = "";
  };

  const removePending = (idx: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <Navbar />
      <main className="w-full px-6 md:px-12 lg:px-20 pt-5 pb-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-text-secondary text-sm mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-primary-dark font-medium">Messages</span>
          </div>

          <div className="mb-6">
            <h1 className="font-heading text-[1.8rem] sm:text-[2.4rem] font-bold text-primary-dark leading-tight tracking-tight">
              Messages
            </h1>
            <p className="text-text-secondary text-sm mt-2">
              Conversations with agents and vendors you've contacted on PropertyLoop.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden mb-20 h-[640px] flex">
            {/* LEFT — conversation list */}
            <aside className={`w-full md:w-85 shrink-0 border-r border-border-light flex flex-col ${mobileShowChat ? "hidden md:flex" : "flex"}`}>
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

              <div className="flex-1 overflow-y-auto">
                {chat.loading ? (
                  <ConversationsSkeleton />
                ) : list.length === 0 ? (
                  <div className="text-center py-16 px-6">
                    <div className="w-12 h-12 rounded-full bg-bg-accent border border-border-light flex items-center justify-center mx-auto mb-3">
                      <MessageCircle className="w-5 h-5 text-text-subtle" />
                    </div>
                    <p className="text-text-secondary text-sm">No conversations yet</p>
                  </div>
                ) : (
                  list.map((c) => {
                    if (!c) return null;
                    const lastMsg = chat.conversations.find((cv) => cv.id === c.id);
                    const isActive = c.id === activeId;
                    return (
                      <button
                        key={c.id}
                        onClick={() => { chat.openConversation(c.id); setMobileShowChat(true); }}
                        className={`w-full text-left px-4 py-3.5 border-b border-border-light/60 transition-colors flex items-start gap-3 ${isActive ? "bg-primary/5" : "hover:bg-bg-accent/60"}`}
                      >
                        <div className="relative shrink-0">
                          <img src={c.avatar} alt={c.name} onError={(e) => { e.currentTarget.src = FallbackImg; }} className="w-11 h-11 rounded-full object-cover" />
                          <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${c.role === "Agent" ? "bg-primary" : "bg-blue-500"}`}>
                            {c.role === "Agent" ? <Briefcase className="w-2 h-2 text-white" /> : <Wrench className="w-2 h-2 text-white" />}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-heading font-bold text-primary-dark text-sm truncate">{c.name}</p>
                            <span className="text-text-subtle text-[11px] shrink-0">
                              {lastMsg?.lastMessageAt ? new Date(lastMsg.lastMessageAt).toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit" }) : ""}
                            </span>
                          </div>
                          <p className="text-text-secondary text-xs truncate mt-0.5">
                            {lastMsg?.lastMessageIsYou ? "You: " : ""}
                            {lastMsg?.lastMessage || "No messages yet"}
                          </p>
                        </div>
                        {(lastMsg?.unread ?? 0) > 0 && (
                          <span className="shrink-0 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                            {(lastMsg?.unread ?? 0) > 9 ? "9+" : lastMsg?.unread}
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </aside>

            {/* RIGHT — active chat */}
            <section className={`flex-1 min-w-0 flex flex-col ${mobileShowChat ? "flex" : "hidden md:flex"}`}>
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
                    <img src={active?.avatar} alt={active?.name || "User"} onError={(e) => { e.currentTarget.src = FallbackImg; }} className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-bold text-primary-dark text-sm truncate">{active?.name || "User"}</p>
                      <span className={`inline-flex items-center gap-1 text-xs ${active?.role === "Agent" ? "text-primary" : "text-blue-500"}`}>
                        {active?.role === "Agent" ? <Briefcase className="w-3 h-3" /> : <Wrench className="w-3 h-3" />}
                        {active?.role || "User"}
                      </span>
                    </div>
                    <a
                      href={formatTel(active?.phone)}
                      className="w-9 h-9 rounded-full bg-bg-accent border border-border-light flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                    <button className="w-9 h-9 rounded-full bg-bg-accent border border-border-light flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto bg-[#fafaf6]">
                    {chat.messagesLoading ? (
                      <MessagesSkeleton />
                    ) : (
                      <div className="flex flex-col gap-3 px-5 py-6">
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
                              {m.text && (
                                (m.text.includes("SERVICE REQUEST") || m.text.includes("**Service Request**")) ? (
                                  <ServiceRequestMessage text={m.text} />
                                ) : (
                                  <p className="whitespace-pre-wrap break-words">{m.text}</p>
                                )
                              )}
                              <AttachmentBubble urls={m.attachmentUrls} isYou={m.sender === "you"} />
                              <div className={`flex items-center gap-1 mt-1 text-[10px] ${m.sender === "you" ? "text-white/70 justify-end" : "text-text-subtle"}`}>
                                {m.time}
                                {m.sender === "you" && <CheckCheck className="w-3 h-3" />}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  {/* Pending file previews */}
                  {pendingFiles.length > 0 && (
                    <div className="px-4 pt-2 pb-1 border-t border-border-light bg-white/60 flex flex-wrap gap-2">
                      {pendingFiles.map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5 bg-bg-accent border border-border-light rounded-lg px-2.5 py-1.5 text-xs text-primary-dark">
                          {f.type.startsWith("image/") ? (
                            <ImageIcon className="w-3.5 h-3.5 text-primary shrink-0" />
                          ) : (
                            <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
                          )}
                          <span className="max-w-[100px] truncate">{f.name}</span>
                          <button onClick={() => removePending(i)} className="ml-0.5 text-text-subtle hover:text-red-500 transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Composer */}
                  <div className="px-4 py-3 border-t border-border-light bg-white/60 flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*,application/pdf"
                      multiple
                      onChange={handleFileChange}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-9 h-9 rounded-full hover:bg-bg-accent flex items-center justify-center text-text-secondary hover:text-primary transition-colors shrink-0"
                      title="Attach file"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        onInput={() => chat.setTyping(true)}
                        onBlur={() => chat.setTyping(false)}
                        placeholder={pendingFiles.length > 0 ? "Add a message (optional)..." : "Type a message..."}
                        className="w-full h-10 pl-4 pr-4 rounded-full bg-bg-accent border border-border-light text-primary-dark text-sm placeholder:text-text-subtle focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <button
                      onClick={handleSend}
                      disabled={!canSend}
                      className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors shadow-[0_2px_8px_rgba(31,111,67,0.3)] disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                      {uploading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                  <div className="w-16 h-16 rounded-full bg-bg-accent border border-border-light flex items-center justify-center mb-4">
                    <MessageCircle className="w-7 h-7 text-text-subtle" />
                  </div>
                  <h3 className="font-heading font-bold text-primary-dark text-lg">Select a conversation</h3>
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
