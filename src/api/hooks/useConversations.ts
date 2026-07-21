import { useState, useEffect, useCallback, useRef } from "react";
import messagesService, { type ChatMessage } from "../services/messages";
import { getSocket } from "../socket";

export interface DashboardMessage {
  id?: string;
  sender: "you" | "them";
  text: string;
  time: string;
  attachmentUrls: string[];
  read?: boolean;
}

export interface DashboardConvo {
  id: string;
  name: string;
  avatar: string;
  role: string;
  phone: string;
  otherUserId: string | null;
  lastMessage: string;
  time: string;
  unread: number;
  messages: DashboardMessage[];
}

function toDashboardMessage(m: ChatMessage): DashboardMessage {
  return {
    id: m.id,
    sender: m.isYou ? "you" : "them",
    text: m.text,
    attachmentUrls: m.attachmentUrls ?? [],
    read: m.read,
    time: new Date(m.createdAt).toLocaleTimeString("en-NG", {
      hour: "numeric",
      minute: "2-digit",
    }),
  };
}

export function useConversations() {
  const [conversations, setConversations] = useState<DashboardConvo[]>([]);
  const [activeMessages, setActiveMessages] = useState<
    Record<string, DashboardMessage[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [messagesLoadingId, setMessagesLoadingId] = useState<string | null>(null);
  // userId → online (presence, live from the gateway).
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});

  // Mirror activeMessages into a ref so loadMessages doesn't need to
  // declare it as a dep and rebuild on every state change.
  const activeMessagesRef = useRef(activeMessages);
  activeMessagesRef.current = activeMessages;
  // Which conversation ids we've already loaded messages for - so a live
  // incoming message only appends to threads the UI is actually showing.
  const loadedConvosRef = useRef<Set<string>>(new Set());
  // In-flight guard so that callers (e.g. dashboards calling
  // loadMessages from inside render) can't trigger duplicate fetches
  // before the first one resolves - a single fetch per conversation.
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
          otherUserId: c.otherUserId ?? null,
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

  // ─── Realtime: live incoming messages, presence, read receipts ───────────
  // The socket is process-wide and shared with useChat. Both hooks are never
  // mounted at once (different pages), and we detach only our OWN named
  // handlers on cleanup so nothing clobbers the other hook's listeners.
  useEffect(() => {
    const socket = getSocket();

    const onNewMessage = (msg: ChatMessage) => {
      // Append to the open thread (only if we've loaded it).
      if (loadedConvosRef.current.has(msg.conversationId)) {
        setActiveMessages((prev) => {
          const existing = prev[msg.conversationId] || [];
          if (existing.some((m) => m.id && m.id === msg.id)) return prev; // already have it
          const mapped = toDashboardMessage(msg);
          // Reconcile our own optimistic (id-less) copy instead of duplicating.
          if (msg.isYou) {
            const idx = existing.findIndex(
              (m) => !m.id && m.sender === "you" && m.text === msg.text,
            );
            if (idx !== -1) {
              const next = existing.slice();
              next[idx] = mapped;
              return { ...prev, [msg.conversationId]: next };
            }
          }
          return { ...prev, [msg.conversationId]: [...existing, mapped] };
        });
      }
      // Update the conversation list preview + unread.
      setConversations((prev) =>
        prev.map((c) =>
          c.id === msg.conversationId
            ? {
                ...c,
                lastMessage: msg.text,
                time: new Date(msg.createdAt).toLocaleDateString(),
                unread: msg.isYou ? c.unread : c.unread + 1,
              }
            : c,
        ),
      );
    };

    const onPresence = (data: { userId: string; online: boolean }) => {
      setOnlineUsers((prev) => ({ ...prev, [data.userId]: data.online }));
    };

    const onMessagesRead = (data: { conversationId: string; readerUserId: string }) => {
      setActiveMessages((prev) => {
        const existing = prev[data.conversationId];
        if (!existing) return prev;
        return {
          ...prev,
          [data.conversationId]: existing.map((m) =>
            m.sender === "you" ? { ...m, read: true } : m,
          ),
        };
      });
    };

    const onUnreadUpdate = (data: { conversationId: string; unread: number }) => {
      setConversations((prev) =>
        prev.map((c) => (c.id === data.conversationId ? { ...c, unread: data.unread } : c)),
      );
    };

    socket.on("new_message", onNewMessage);
    socket.on("presence", onPresence);
    socket.on("messages_read", onMessagesRead);
    socket.on("unread_update", onUnreadUpdate);

    return () => {
      socket.off("new_message", onNewMessage);
      socket.off("presence", onPresence);
      socket.off("messages_read", onMessagesRead);
      socket.off("unread_update", onUnreadUpdate);
    };
  }, []);

  const loadMessages = useCallback(async (convoId: string) => {
    if (!convoId) return;
    if (activeMessagesRef.current[convoId]?.length) return; // already loaded
    if (inFlightRef.current.has(convoId)) return; // already fetching
    inFlightRef.current.add(convoId);
    setMessagesLoadingId(convoId);
    // Join the socket room → marks read + surfaces the other party's presence.
    getSocket().emit("join_conversation", { conversationId: convoId });
    try {
      const msgs = await messagesService.getMessages(convoId, { limit: 100 });
      loadedConvosRef.current.add(convoId);
      setActiveMessages((prev) => ({
        ...prev,
        [convoId]: msgs.map(toDashboardMessage),
      }));
      messagesService.markRead(convoId).catch(() => {});
    } catch {
      /* ignore */
    } finally {
      inFlightRef.current.delete(convoId);
      setMessagesLoadingId((curr) => (curr === convoId ? null : curr));
    }
  }, []);

  const sendMessage = useCallback(
    async (convoId: string, text: string, attachmentUrls?: string[]) => {
      const msg: DashboardMessage = {
        sender: "you" as const,
        text,
        attachmentUrls: attachmentUrls ?? [],
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
        await messagesService.sendMessage(convoId, text, attachmentUrls);
      } catch {
        /* keep optimistic */
      }
    },
    [],
  );

  const isOnline = useCallback(
    (userId?: string | null) => (userId ? !!onlineUsers[userId] : false),
    [onlineUsers],
  );

  return {
    conversations,
    activeMessages,
    loading,
    messagesLoadingId,
    loadMessages,
    sendMessage,
    isOnline,
  };
}
