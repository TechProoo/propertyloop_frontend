import { useEffect, useState } from "react";
import { Search, Send } from "lucide-react";
import { useConversations } from "../../api/hooks";
import { C, PageHeader, BouncyLoader, initials } from "../../components/agent/ui";

const QUICK = ["Yes, it's available", "Share the address", "Suggest a time"];

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

  // Derive the active conversation: explicit pick, else the first one.
  // (Computed, not stored — avoids a setState-in-effect cascade.)
  const selected = picked || conversations[0]?.id || "";
  const setSelected = setPicked;

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

      <div className="mt-[18px] grid gap-4 grid-cols-1 lg:grid-cols-[320px_1fr] lg:h-[600px]">
        {/* Thread list */}
        <div className="rounded-[20px] border overflow-hidden flex flex-col max-h-[360px] lg:max-h-none" style={{ background: C.card, borderColor: C.line }}>
          <div className="p-3.5" style={{ borderBottom: `1px solid ${C.line2}` }}>
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
                    onClick={() => setSelected(c.id)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left relative"
                    style={{ background: on ? C.primarySoft : "transparent", borderBottom: `1px solid ${C.line2}` }}
                  >
                    <Avatar name={c.name} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between">
                        <b className="text-[13.5px] font-bold" style={{ color: C.ink }}>{c.name}</b>
                        <em className="text-[11px] not-italic" style={{ color: C.ink3 }}>{c.time}</em>
                      </div>
                      <span className="block text-[12.5px] truncate mt-0.5" style={{ color: C.ink3 }}>{c.lastMessage}</span>
                    </div>
                    {c.unread > 0 && <i className="w-[9px] h-[9px] rounded-full flex-shrink-0" style={{ background: C.primary }} />}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Conversation */}
        <div className="rounded-[20px] border flex flex-col overflow-hidden min-h-[520px] lg:min-h-0" style={{ background: C.card, borderColor: C.line }}>
          {!convo ? (
            <div className="flex-1 grid place-items-center text-[13px]" style={{ color: C.ink3 }}>
              Select a conversation
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 px-[18px] py-3.5" style={{ borderBottom: `1px solid ${C.line2}` }}>
                <Avatar name={convo.name} />
                <div className="flex-1">
                  <div className="text-[15px] font-extrabold" style={{ color: C.ink }}>{convo.name}</div>
                  <div className="text-xs" style={{ color: C.ink3 }}>{convo.role}{convo.phone ? ` · ${convo.phone}` : ""}</div>
                </div>
              </div>

              <div className="flex-1 overflow-auto px-[18px] py-4 flex flex-col gap-2">
                {messagesLoadingId === selected && msgs.length === 0 ? (
                  <div className="m-auto"><BouncyLoader /></div>
                ) : msgs.length === 0 ? (
                  <p className="text-[13px] m-auto" style={{ color: C.ink3 }}>No messages yet — say hello.</p>
                ) : (
                  msgs.map((m, i) => (
                    <div
                      key={i}
                      className="max-w-[74%] px-3.5 py-2.5 text-sm leading-snug"
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
              <div className="px-[18px] pb-2 flex gap-1.5 flex-wrap">
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
                className="px-3.5 pt-2.5 pb-4 flex items-center gap-2"
                style={{ borderTop: `1px solid ${C.line2}` }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Write a reply…"
                  className="flex-1 rounded-full px-4 py-2.5 text-sm outline-none"
                  style={{ background: C.surface2, color: C.ink }}
                />
                <button
                  type="submit"
                  className="w-11 h-11 rounded-full grid place-items-center text-white flex-shrink-0"
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
      className="w-[42px] h-[42px] rounded-full grid place-items-center font-bold text-sm flex-shrink-0"
      style={{ background: C.primarySoft, color: C.primaryInk }}
    >
      {initials(name)}
    </div>
  );
}
