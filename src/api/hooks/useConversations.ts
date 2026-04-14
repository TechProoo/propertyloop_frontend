import { useState, useEffect, useCallback } from "react";
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

  const loadMessages = useCallback(
    async (convoId: string) => {
      if (activeMessages[convoId]?.length) return; // already loaded
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
      }
    },
    [activeMessages],
  );

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

  return { conversations, activeMessages, loading, loadMessages, sendMessage };
}
