// ─── API Types shared across the frontend ────────────────────────────────────

export type ConversationStatus = 'BOT' | 'HUMAN_TAKEOVER';
export type SenderType = 'USER' | 'BOT' | 'AGENT';
export type MessageType = 'TEXT' | 'INTERACTIVE' | 'TEMPLATE';
export type MessageStatus = 'SENT' | 'DELIVERED' | 'READ';

export interface Contact {
  id: string;
  waId: string;
  name: string;
}

export interface Message {
  id: string;
  conversationId: string;
  metaMessageId: string | null;
  senderType: SenderType;
  type: MessageType;
  body: string;
  status: MessageStatus;
  timestamp: string;
}

export interface ConversationSummary {
  id: string;
  status: ConversationStatus;
  unreadCount: number;
  updatedAt: string;
  contact: Contact;
  lastMessage: Message | null;
}

export interface ConversationDetail {
  conversation: {
    id: string;
    status: ConversationStatus;
    contact: Contact;
  };
  messages: Message[];
}
