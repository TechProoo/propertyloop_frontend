import { useState, useEffect, useCallback, useRef } from "react";
import { getSocket } from "../socket";
import messagesService, {
  type ConversationPreview,
  type ChatMessage,
} from "../services/messages";
import type { Socket } from "socket.io-client";

export interface UseChatReturn {
  /** All conversations with last message preview */
  conversations: ConversationPreview[];
  /** Messages for the currently active conversation */
  messages: ChatMessage[];
  /** Total unread count across all conversations */
  unreadCount: number;
  /** Whether the socket is connected */
  connected: boolean;
  /** Whether the initial conversation list is still loading */
  loading: boolean;
  /** Whether the messages of the active conversation are still loading */
  messagesLoading: boolean;
  /** ID of the currently active conversation */
  activeConversationId: string | null;
  /** Select a conversation — loads messages + marks read */
  openConversation: (id: string) => void;
  /** Send a message to the active conversation */
  sendMessage: (text: string) => void;
  /** Emit typing indicator */
  setTyping: (isTyping: boolean) => void;
  /** Other user's typing state for the active conversation */
  otherTyping: boolean;
}

export function useChat(): UseChatReturn {
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [otherTyping, setOtherTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  // ─── Connect socket + load initial data ────────────────────────────────

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("connected", (data: { unread: number }) => {
      setUnreadCount(data.unread);
    });

    // New message arrives in any conversation
    socket.on("new_message", (msg: ChatMessage) => {
      // Update messages if it's the active conversation
      setMessages((prev) => {
        if (prev.length > 0 && prev[0]?.conversationId === msg.conversationId) {
          // Deduplicate — don't add if already exists (from optimistic update)
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        }
        return prev;
      });

      // Update last message in conversation list
      setConversations((prev) =>
        prev.map((c) =>
          c.id === msg.conversationId
            ? {
                ...c,
                lastMessage: msg.text,
                lastMessageAt: msg.createdAt,
                lastMessageIsYou: msg.isYou,
                unread: msg.isYou ? c.unread : c.unread + 1,
              }
            : c,
        ),
      );

      // Update global unread count
      if (!msg.isYou) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    // Unread update from server
    socket.on(
      "unread_update",
      (data: { conversationId: string; unread: number }) => {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === data.conversationId ? { ...c, unread: data.unread } : c,
          ),
        );
      },
    );

    // Typing indicator
    socket.on(
      "user_typing",
      (data: { conversationId: string; isTyping: boolean }) => {
        if (data.conversationId === activeConversationId) {
          setOtherTyping(data.isTyping);
          // Auto-clear after 3 seconds
          if (data.isTyping) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(
              () => setOtherTyping(false),
              3000,
            );
          }
        }
      },
    );

    // Conversation read confirmation
    socket.on("conversation_read", (data: { conversationId: string }) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === data.conversationId ? { ...c, unread: 0 } : c,
        ),
      );
    });

    // Load initial conversation list via REST
    messagesService
      .listConversations({ limit: 50 })
      .then((res) => {
        setConversations(res.items);
        setUnreadCount(res.items.reduce((sum, c) => sum + c.unread, 0));
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => {
      // Detach this hook's listeners but DON'T disconnect the socket.
      // The socket is process-wide and shared — disconnecting on cleanup
      // races with React StrictMode's double-mount in dev (cleanup fires
      // before the WebSocket handshake completes → "closed before
      // established"). The socket disconnects naturally on logout (when
      // the access token is cleared) or full page unload.
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connected");
      socket.off("new_message");
      socket.off("unread_update");
      socket.off("user_typing");
      socket.off("conversation_read");
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Open a conversation ───────────────────────────────────────────────

  const openConversation = useCallback(async (id: string) => {
    setActiveConversationId(id);
    setOtherTyping(false);
    setMessages([]);
    setMessagesLoading(true);

    // Join the socket room
    socketRef.current?.emit("join_conversation", { conversationId: id });

    // Load messages via REST (reliable, socket is for real-time updates)
    try {
      const msgs = await messagesService.getMessages(id, { limit: 100 });
      setMessages(msgs);
    } catch {
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }

    // Mark as read locally
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)),
    );
  }, []);

  // ─── Send a message ────────────────────────────────────────────────────

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || !activeConversationId) return;

      // Send via socket (real-time)
      socketRef.current?.emit("send_message", {
        conversationId: activeConversationId,
        text: text.trim(),
      });

      // Stop typing indicator
      socketRef.current?.emit("typing", {
        conversationId: activeConversationId,
        isTyping: false,
      });
    },
    [activeConversationId],
  );

  // ─── Typing indicator ─────────────────────────────────────────────────

  const setTyping = useCallback(
    (isTyping: boolean) => {
      if (!activeConversationId) return;
      socketRef.current?.emit("typing", {
        conversationId: activeConversationId,
        isTyping,
      });
    },
    [activeConversationId],
  );

  return {
    conversations,
    messages,
    unreadCount,
    connected,
    loading,
    messagesLoading,
    activeConversationId,
    openConversation,
    sendMessage,
    setTyping,
    otherTyping,
  };
}
