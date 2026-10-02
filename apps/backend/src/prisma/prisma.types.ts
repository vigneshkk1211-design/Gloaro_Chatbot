export enum ConversationStatus {
  BOT = 'BOT',
  HUMAN_TAKEOVER = 'HUMAN_TAKEOVER',
}

export enum SenderType {
  USER = 'USER',
  BOT = 'BOT',
  AGENT = 'AGENT',
}

export enum MessageType {
  TEXT = 'TEXT',
  INTERACTIVE = 'INTERACTIVE',
  TEMPLATE = 'TEMPLATE',
}

export enum MessageStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
}
