export interface ChatMessage {
  sender: "you" | "them";
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  role: "Agent" | "Vendor";
  phone: string;
  messages: ChatMessage[];
}

const STORAGE_KEY = "pl_chats";

/** Get all conversations from localStorage */
export function getConversations(): Record<string, Conversation> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

/** Get a single conversation by ID */
export function getConversation(id: string): Conversation | null {
  return getConversations()[id] || null;
}

/** Save a full conversation (creates or overwrites) */
export function saveConversation(convo: Conversation) {
  const all = getConversations();
  all[convo.id] = convo;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

/** Append a message to an existing conversation */
export function addMessage(convoId: string, message: ChatMessage) {
  const all = getConversations();
  if (all[convoId]) {
    all[convoId].messages.push(message);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }
}

/** Seed default conversations if localStorage is empty */
export function seedDefaultConversations(defaults: Conversation[]) {
  const all = getConversations();
  let changed = false;
  for (const c of defaults) {
    if (!all[c.id]) {
      all[c.id] = c;
      changed = true;
    }
  }
  if (changed) localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
