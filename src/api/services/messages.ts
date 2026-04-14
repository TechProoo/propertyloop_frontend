import api from "../client";

export interface ConversationPreview {
  id: string;
  listingId?: string | null;
  productId?: string | null;
  name: string;
  avatar: string | null;
  phone: string | null;
  role: string;
  otherUserId: string | null;
  lastMessage: string;
  lastMessageAt: string;
  lastMessageIsYou: boolean;
  unread: number;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderUserId: string;
  senderName: string;
  senderAvatar: string | null;
  isYou: boolean;
  text: string;
  createdAt: string;
}

export interface CreateConversationPayload {
  recipientId: string;
  recipientRole: string;
  senderRole: string;
  text?: string;
  listingId?: string;
  productId?: string;
}

const messagesService = {
  async listConversations(params?: { page?: number; limit?: number }) {
    const { data } = await api.get<{
      items: ConversationPreview[];
      total: number;
      page: number;
      limit: number;
      pages: number;
    }>("/messages/conversations", { params });
    return data;
  },

  async getMessages(conversationId: string, params?: { limit?: number; before?: string }) {
    const { data } = await api.get<ChatMessage[]>(
      `/messages/conversations/${conversationId}`,
      { params },
    );
    return data;
  },

  async sendMessage(conversationId: string, text: string) {
    const { data } = await api.post<ChatMessage>(
      `/messages/conversations/${conversationId}`,
      { text },
    );
    return data;
  },

  async createOrFind(payload: CreateConversationPayload) {
    const { data } = await api.post<{ conversationId: string; created: boolean }>(
      "/messages/conversations",
      payload,
    );
    return data;
  },

  async markRead(conversationId: string) {
    await api.post(`/messages/conversations/${conversationId}/read`);
  },

  async getUnreadCount() {
    const { data } = await api.get<{ unread: number }>("/messages/unread");
    return data.unread;
  },
};

export default messagesService;
