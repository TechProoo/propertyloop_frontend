import { useEffect, useState } from "react";
import { Search, Send, ArrowLeft } from "lucide-react";
import { useConversations } from "../../api/hooks";
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

  const send = (text: string) => {
    const t = text.trim();
    if (!t || !selected) return;
    sendMessage(selected, t);
    setInput("");
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
                      {m.text}
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

              <form
                onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="px-3.5 pt-2.5 pb-4 flex items-center gap-2 shrink-0"
                style={{ borderTop: `1px solid ${C.line2}` }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Write a reply…"
                  className="flex-1 min-w-0 rounded-full px-4 py-2.5 text-sm outline-none"
                  style={{ background: C.surface2, color: C.ink }}
                />
                <button
                  type="submit"
                  className="w-11 h-11 rounded-full grid place-items-center text-white shrink-0"
                  style={{ background: C.primary }}
                  aria-label="Send"
                >
                  <Send className="w-[17px] h-[17px]" />
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
