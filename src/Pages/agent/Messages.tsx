import { useEffect, useRef, useState } from "react";
import {
  Search,
  Send,
  ArrowLeft,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { useConversations } from "../../api/hooks";
import messagesService from "../../api/services/messages";
import MessageAttachments from "../../components/Messages/MessageAttachments";
import { C, PageHeader, BouncyLoader, initials } from "../../components/agent/ui";

const QUICK = ["Yes, it's available", "Share the address", "Suggest a time"];

// Panels fill the viewport (minus the page chrome) so each scrolls
// internally instead of the whole page scrolling.
const PANEL_H = "h-[calc(100dvh-172px)] lg:h-[calc(100vh-130px)]";

export default function AgentMessages() {
  const {
    conversations,
    activeMessages,
    loading,
    messagesLoadingId,
    loadMessages,
    sendMessage,
  } = useConversations();

  const [picked, setPicked] = useState<string>("");
  const [query, setQuery] = useState("");
  const [input, setInput] = useState("");
  // On small screens we show the list OR the conversation (master-detail).
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false);
  // Attachments
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive the active conversation: explicit pick, else the first one.
  const selected = picked || conversations[0]?.id || "";

  const openThread = (id: string) => {
    setPicked(id);
    setMobileThreadOpen(true);
  };

  useEffect(() => {
    if (selected) loadMessages(selected);
  }, [selected, loadMessages]);

  const convo = conversations.find((c) => c.id === selected);
  const msgs = activeMessages[selected] ?? [];
  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  // Quick-reply / text-only send.
  const send = (text: string) => {
    const t = text.trim();
    if (!t || !selected) return;
    sendMessage(selected, t);
    setInput("");
  };

  const canSend =
    (input.trim().length > 0 || pendingFiles.length > 0) && !uploading;

  // Composer send — uploads any attachments first, then sends.
  const handleSend = async () => {
    if (!canSend || !selected) return;
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
    sendMessage(selected, input.trim(), attachmentUrls);
    setInput("");
    setPendingFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) setPendingFiles((prev) => [...prev, ...files].slice(0, 5));
    e.target.value = "";
  };

  return (
    <div>
      <PageHeader
        title="Messages"
        subtitle="Reply fast — agents who respond within an hour win more deals."
      />

      <div className="mt-[18px] grid gap-4 grid-cols-1 lg:grid-cols-[320px_1fr] lg:items-start">
        {/* Thread list — sticky on large screens */}
        <div
          className={`rounded-[20px] border overflow-hidden flex-col ${PANEL_H} lg:sticky lg:top-6 ${
            mobileThreadOpen ? "hidden lg:flex" : "flex"
          }`}
          style={{ background: C.card, borderColor: C.line }}
        >
          <div className="p-3.5 shrink-0" style={{ borderBottom: `1px solid ${C.line2}` }}>
            <div className="flex items-center gap-2 rounded-full px-3.5 py-2" style={{ background: C.surface2, color: C.ink3 }}>
              <Search className="w-[15px] h-[15px]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search messages"
                className="flex-1 bg-transparent outline-none text-[13px]"
                style={{ color: C.ink }}
              />
            </div>
          </div>
          <div className="overflow-auto flex-1">
            {loading ? (
              <div className="p-8"><BouncyLoader /></div>
            ) : filtered.length === 0 ? (
              <p className="text-[13px] p-4" style={{ color: C.ink3 }}>No conversations yet.</p>
            ) : (
              filtered.map((c) => {
                const on = c.id === selected;
                return (
                  <button
                    key={c.id}
                    onClick={() => openThread(c.id)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left relative"
                    style={{ background: on ? C.primarySoft : "transparent", borderBottom: `1px solid ${C.line2}` }}
                  >
                    <Avatar name={c.name} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <b className="text-[13.5px] font-bold truncate" style={{ color: C.ink }}>{c.name}</b>
                        <em className="text-[11px] not-italic shrink-0" style={{ color: C.ink3 }}>{c.time}</em>
                      </div>
                      <span className="block text-[12.5px] truncate mt-0.5" style={{ color: C.ink3 }}>{c.lastMessage}</span>
                    </div>
                    {c.unread > 0 && <i className="w-[9px] h-[9px] rounded-full shrink-0" style={{ background: C.primary }} />}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Conversation */}
        <div
          className={`rounded-[20px] border flex-col overflow-hidden ${PANEL_H} ${
            mobileThreadOpen ? "flex" : "hidden lg:flex"
          }`}
          style={{ background: C.card, borderColor: C.line }}
        >
          {!convo ? (
            <div className="flex-1 grid place-items-center text-[13px]" style={{ color: C.ink3 }}>
              Select a conversation
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 px-4 lg:px-[18px] py-3.5 shrink-0" style={{ borderBottom: `1px solid ${C.line2}` }}>
                <button
                  onClick={() => setMobileThreadOpen(false)}
                  className="lg:hidden w-8 h-8 -ml-1 grid place-items-center rounded-full shrink-0"
                  style={{ color: C.ink2 }}
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <Avatar name={convo.name} />
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-extrabold truncate" style={{ color: C.ink }}>{convo.name}</div>
                  <div className="text-xs truncate" style={{ color: C.ink3 }}>{convo.role}{convo.phone ? ` · ${convo.phone}` : ""}</div>
                </div>
              </div>

              <div className="flex-1 overflow-auto px-4 lg:px-[18px] py-4 flex flex-col gap-2">
                {messagesLoadingId === selected && msgs.length === 0 ? (
                  <div className="m-auto"><BouncyLoader /></div>
                ) : msgs.length === 0 ? (
                  <p className="text-[13px] m-auto" style={{ color: C.ink3 }}>No messages yet — say hello.</p>
                ) : (
                  msgs.map((m, i) => (
                    <div
                      key={i}
                      className="max-w-[80%] lg:max-w-[74%] px-3.5 py-2.5 text-sm leading-snug"
                      style={
                        m.sender === "you"
                          ? { alignSelf: "flex-end", background: C.primary, color: "#fff", borderRadius: "16px 16px 5px 16px" }
                          : { alignSelf: "flex-start", background: C.surface2, color: C.ink, borderRadius: "16px 16px 16px 5px" }
                      }
                    >
                      {m.text && <span className="whitespace-pre-wrap break-words">{m.text}</span>}
                      <MessageAttachments urls={m.attachmentUrls} isYou={m.sender === "you"} />
                    </div>
                  ))
                )}
              </div>

              {/* Quick replies */}
              <div className="px-4 lg:px-[18px] pb-2 flex gap-1.5 flex-wrap shrink-0">
                {QUICK.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-[12.5px] font-bold px-3 py-2 rounded-full"
                    style={{ background: C.surface2, color: C.ink2 }}
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Pending attachment previews */}
              {pendingFiles.length > 0 && (
                <div
                  className="px-3.5 pt-2 flex flex-wrap gap-2 shrink-0"
                  style={{ borderTop: `1px solid ${C.line2}` }}
                >
                  {pendingFiles.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs"
                      style={{ background: C.surface2, color: C.ink }}
                    >
                      {f.type.startsWith("image/") ? (
                        <ImageIcon className="w-3.5 h-3.5 shrink-0" style={{ color: C.primary }} />
                      ) : (
                        <FileText className="w-3.5 h-3.5 shrink-0" style={{ color: C.primary }} />
                      )}
                      <span className="max-w-[110px] truncate">{f.name}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setPendingFiles((prev) => prev.filter((_, j) => j !== i))
                        }
                        className="ml-0.5"
                        style={{ color: C.ink3 }}
                        aria-label="Remove attachment"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="px-3.5 pt-2.5 pb-4 flex items-center gap-2 shrink-0"
                style={{ borderTop: pendingFiles.length > 0 ? "none" : `1px solid ${C.line2}` }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*,application/pdf"
                  multiple
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-11 h-11 rounded-full grid place-items-center shrink-0"
                  style={{ background: C.surface2, color: C.ink2 }}
                  aria-label="Attach file"
                  title="Attach a photo or PDF"
                >
                  <Paperclip className="w-[17px] h-[17px]" />
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={pendingFiles.length > 0 ? "Add a message (optional)…" : "Write a reply…"}
                  className="flex-1 min-w-0 rounded-full px-4 py-2.5 text-sm outline-none"
                  style={{ background: C.surface2, color: C.ink }}
                />
                <button
                  type="submit"
                  disabled={!canSend}
                  className="w-11 h-11 rounded-full grid place-items-center text-white shrink-0 disabled:opacity-50"
                  style={{ background: C.primary }}
                  aria-label="Send"
                >
                  {uploading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-[17px] h-[17px]" />
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <div
      className="w-[42px] h-[42px] rounded-full grid place-items-center font-bold text-sm shrink-0"
      style={{ background: C.primarySoft, color: C.primaryInk }}
    >
      {initials(name)}
    </div>
  );
}
