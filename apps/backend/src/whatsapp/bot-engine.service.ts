import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsappSenderService } from './whatsapp-sender.service';
import { GeminiAiService } from './gemini-ai.service';
import {
  WELCOME_TEXT,
  MAIN_MENU_BUTTONS,
  BUTTON_IDS,
  BUTTON_SERVICE_LIST,
  MENU_TRIGGER_KEYWORDS,
  PRICING_KEYWORDS,
  PRICING_REPLY,
  getCompanyAnswerByKeyword,
} from './company-knowledge';
import { ConversationStatus, MessageType, SenderType } from '../prisma/prisma.types';

export interface IncomingMessage {
  waId: string;
  contactName: string;
  messageId: string;
  body: string;
  buttonPayload?: string;
  timestamp: Date;
}

@Injectable()
export class BotEngineService {
  private readonly logger = new Logger(BotEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly sender: WhatsappSenderService,
    private readonly geminiAi: GeminiAiService,
  ) {}

  async processIncomingMessage(incoming: IncomingMessage): Promise<void> {
    const { waId, contactName, messageId, body, buttonPayload } = incoming;

    const contact = await this.prisma.contact.upsert({
      where:  { waId },
      update: { name: contactName },
      create: { waId, name: contactName },
    });

    let conversation = await this.prisma.conversation.findFirst({
      where:   { contactId: contact.id },
      orderBy: { updatedAt: 'desc' },
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: { contactId: contact.id, status: ConversationStatus.BOT },
      });
    }

    await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        metaMessageId:  messageId,
        senderType:     SenderType.USER,
        type:           buttonPayload ? MessageType.INTERACTIVE : MessageType.TEXT,
        body:           buttonPayload ? `[Button: ${body}]` : body,
        status:         'DELIVERED',
        timestamp:      incoming.timestamp,
      },
    });

    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data:  { unreadCount: { increment: 1 }, updatedAt: new Date() },
    });

    if (conversation.status === ConversationStatus.HUMAN_TAKEOVER) {
      this.logger.log(`🧑 [${waId}] HUMAN_TAKEOVER — skipping bot`);
      return;
    }

    await this.handleBotResponse(waId, conversation.id, body, buttonPayload);
  }

  private async handleBotResponse(
    waId: string,
    conversationId: string,
    body: string,
    buttonPayload?: string,
  ): Promise<void> {
    const normalizedText = (buttonPayload ?? body).toLowerCase().trim();

    // Rule 1: Greeting → welcome + 3 buttons
    if (MENU_TRIGGER_KEYWORDS.includes(normalizedText)) {
      await this.sendWelcomeMenu(waId, conversationId);
      return;
    }

    // Rule 2: Button click → show only service name bullet list
    if (buttonPayload) {
      const list = BUTTON_SERVICE_LIST[buttonPayload as keyof typeof BUTTON_SERVICE_LIST];
      if (list) {
        const metaId = await this.sender.sendTextMessage(waId, list);
        await this.saveBotMessage(conversationId, list, MessageType.TEXT, metaId);
        return;
      }
      await this.sendWelcomeMenu(waId, conversationId);
      return;
    }

    // Numeric shortcuts
    if (normalizedText === '1') { await this.showServiceList(waId, conversationId, BUTTON_IDS.DM);   return; }
    if (normalizedText === '2') { await this.showServiceList(waId, conversationId, BUTTON_IDS.TECH); return; }
    if (normalizedText === '3') { await this.showServiceList(waId, conversationId, BUTTON_IDS.ECOM); return; }

    // Rule 4: Pricing query
    if (PRICING_KEYWORDS.some((k) => normalizedText.includes(k))) {
      const metaId = await this.sender.sendTextMessage(waId, PRICING_REPLY);
      await this.saveBotMessage(conversationId, PRICING_REPLY, MessageType.TEXT, metaId);
      return;
    }

    // Rule 3 + 5: Specific service explanation or out-of-scope fallback
    const answer = getCompanyAnswerByKeyword(body, 'en');
    const metaId = await this.sender.sendTextMessage(waId, answer);
    await this.saveBotMessage(conversationId, answer, MessageType.TEXT, metaId);
  }

  /** Rule 2 helper — send only the bullet list for a button ID */
  private async showServiceList(waId: string, conversationId: string, buttonId: string): Promise<void> {
    const list = BUTTON_SERVICE_LIST[buttonId as keyof typeof BUTTON_SERVICE_LIST];
    if (!list) { await this.sendWelcomeMenu(waId, conversationId); return; }
    const metaId = await this.sender.sendTextMessage(waId, list);
    await this.saveBotMessage(conversationId, list, MessageType.TEXT, metaId);
  }

  /** Rule 1 — send welcome message + 3 interactive buttons */
  private async sendWelcomeMenu(waId: string, conversationId: string): Promise<void> {
    const metaId = await this.sender.sendInteractiveButtonMessage(
      waId,
      WELCOME_TEXT,
      [...MAIN_MENU_BUTTONS],
    );
    await this.saveBotMessage(conversationId, WELCOME_TEXT, MessageType.INTERACTIVE, metaId);
  }

  private async saveBotMessage(
    conversationId: string,
    body: string,
    type: MessageType,
    metaMessageId: string | null,
  ): Promise<void> {
    await this.prisma.message.create({
      data: {
        conversationId,
        metaMessageId: metaMessageId ?? undefined,
        senderType:    SenderType.BOT,
        type,
        body,
        status: 'SENT',
      },
    });
  }
}
