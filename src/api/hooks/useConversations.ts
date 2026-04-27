import { useState, useEffect, useCallback, useRef } from "react";
import messagesService from "../services/messages";

export interface DashboardConvo {
  id: string;
  name: string;
  avatar: string;
  role: string;
  phone: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: { sender: "you" | "them"; text: string; time: string }[];
}

export function useConversations() {
  const [conversations, setConversations] = useState<DashboardConvo[]>([]);
  const [activeMessages, setActiveMessages] = useState<
    Record<string, { sender: "you" | "them"; text: string; time: string }[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [messagesLoadingId, setMessagesLoadingId] = useState<string | null>(null);

  // Mirror activeMessages into a ref so loadMessages doesn't need to
  // declare it as a dep and rebuild on every state change.
  const activeMessagesRef = useRef(activeMessages);
  activeMessagesRef.current = activeMessages;
  // In-flight guard so that callers (e.g. dashboards calling
  // loadMessages from inside render) can't trigger duplicate fetches
  // before the first one resolves — a single fetch per conversation.
  const inFlightRef = useRef(new Set<string>());

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await messagesService.listConversations({ limit: 50 });
        if (cancelled) return;
        const convos: DashboardConvo[] = res.items.map((c) => ({
          id: c.id,
          name: c.name,
          avatar: c.avatar || "",
          role:
            c.role === "AGENT"
              ? "Agent"
              : c.role === "VENDOR"
                ? "Vendor"
                : c.role === "BUYER"
                  ? "Buyer"
                  : c.role,
          phone: c.phone || "",
          lastMessage: c.lastMessage,
          time: c.lastMessageAt
            ? new Date(c.lastMessageAt).toLocaleDateString()
            : "",
          unread: c.unread,
          messages: [],
        }));
        setConversations(convos);
      } catch {
        if (!cancelled) setConversations([]);
      }
      if (!cancelled) setLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadMessages = useCallback(async (convoId: string) => {
    if (!convoId) return;
    if (activeMessagesRef.current[convoId]?.length) return; // already loaded
    if (inFlightRef.current.has(convoId)) return; // already fetching
    inFlightRef.current.add(convoId);
    setMessagesLoadingId(convoId);
    try {
      const msgs = await messagesService.getMessages(convoId, { limit: 100 });
      setActiveMessages((prev) => ({
        ...prev,
        [convoId]: msgs.map((m) => ({
          sender: m.isYou ? ("you" as const) : ("them" as const),
          text: m.text,
          time: new Date(m.createdAt).toLocaleTimeString("en-NG", {
            hour: "numeric",
            minute: "2-digit",
          }),
        })),
      }));
      messagesService.markRead(convoId).catch(() => {});
    } catch {
      /* ignore */
    } finally {
      inFlightRef.current.delete(convoId);
      setMessagesLoadingId((curr) => (curr === convoId ? null : curr));
    }
  }, []);

  const sendMessage = useCallback(async (convoId: string, text: string) => {
    const msg = {
      sender: "you" as const,
      text,
      time: new Date().toLocaleTimeString("en-NG", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
    // Optimistic update
    setActiveMessages((prev) => ({
      ...prev,
      [convoId]: [...(prev[convoId] || []), msg],
    }));
    try {
      await messagesService.sendMessage(convoId, text);
    } catch {
      /* keep optimistic */
    }
  }, []);

  return {
    conversations,
    activeMessages,
    loading,
    messagesLoadingId,
    loadMessages,
    sendMessage,
  };
}
