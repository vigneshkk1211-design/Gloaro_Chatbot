import { Controller, Get, Post, Req, Res, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import {
  WELCOME_TEXT,
  MAIN_MENU_BUTTONS,
  MENU_TRIGGER_KEYWORDS,
  PRICING_KEYWORDS,
  PRICING_REPLY,
  BUTTON_SERVICE_LIST,
  getCompanyAnswerByKeyword,
} from '../whatsapp/company-knowledge';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly prisma: PrismaService) {}

  // ── GET /webhook — Meta verification handshake ────────────────────────────
  @Get()
  verifyWebhook(@Req() req: Request, @Res() res: Response) {
    const mode        = req.query['hub.mode'];
    const token       = req.query['hub.verify_token'];
    const challenge   = req.query['hub.challenge'];
    const verifyToken = process.env.META_VERIFY_TOKEN || 'gloaro_webhook_verify_token';

    if (mode === 'subscribe' && token === verifyToken) {
      this.logger.log('✅ Webhook verified successfully');
      return res.status(HttpStatus.OK).send(challenge);
    }
    return res.status(HttpStatus.FORBIDDEN).send('Forbidden');
  }

  // ── POST /webhook — Receive WhatsApp events ───────────────────────────────
  @Post()
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    // Acknowledge Meta immediately (within 20s SLA)
    res.status(HttpStatus.OK).send('EVENT_RECEIVED');

    try {
      const body    = req.body;
      const entry   = body?.entry?.[0];
      const changes = entry?.changes?.[0];
      const value   = changes?.value;
      const message = value?.messages?.[0];

      if (!message) return;

      const senderPhone = message.from as string;
      const contactName = (value?.contacts?.[0]?.profile?.name as string) || 'Customer';

      this.logger.log(`📩 Incoming from ${senderPhone}: ${JSON.stringify(message)}`);

      // ── 1. Duplicate guard (Prisma P2002 prevention) ───────────────────────
      const existingMsg = await this.prisma.message.findUnique({
        where: { metaMessageId: message.id },
      });
      if (existingMsg) {
        this.logger.warn(`🔁 Duplicate skipped: ${message.id as string}`);
        return;
      }

      // ── 2. Upsert contact ─────────────────────────────────────────────────
      const contact = await this.prisma.contact.upsert({
        where:  { waId: senderPhone },
        update: { name: contactName },
        create: { waId: senderPhone, name: contactName },
      });

      // ── 3. Find or create conversation ────────────────────────────────────
      let conversation = await this.prisma.conversation.findFirst({
        where:   { contactId: contact.id },
        orderBy: { updatedAt: 'desc' },
      });

      if (!conversation) {
        conversation = await this.prisma.conversation.create({
          data: { contactId: contact.id, status: 'BOT' },
        });
      }

      // ── 4. Parse incoming message type ────────────────────────────────────
      let incomingText    = '';
      let selectedButtonId = '';

      if (message.type === 'interactive' && message.interactive?.button_reply) {
        selectedButtonId = message.interactive.button_reply.id as string;
        incomingText     = message.interactive.button_reply.title as string;
      } else if (message.type === 'text') {
        incomingText = (message.text?.body as string) || '';
      } else {
        this.logger.debug(`Unsupported message type: ${message.type as string}`);
        return;
      }

      // ── 5. Persist user message ───────────────────────────────────────────
      await this.prisma.message.create({
        data: {
          conversationId: conversation.id,
          metaMessageId:  message.id as string,
          senderType:     'USER',
          type:           selectedButtonId ? 'INTERACTIVE' : 'TEXT',
          body:           selectedButtonId ? `[Button: ${incomingText}]` : incomingText,
        },
      });

      // Bump conversation timestamp + unread count
      await this.prisma.conversation.update({
        where: { id: conversation.id },
        data:  { unreadCount: { increment: 1 }, updatedAt: new Date() },
      });

      const cleanLower = incomingText.trim().toLowerCase();

      // ─────────────────────────────────────────────────────────────────────
      // RULE 1: Greeting → reset to BOT + send Welcome + 3 Buttons
      // ─────────────────────────────────────────────────────────────────────
      if (MENU_TRIGGER_KEYWORDS.includes(cleanLower)) {
        if (conversation.status !== 'BOT') {
          await this.prisma.conversation.update({
            where: { id: conversation.id },
            data:  { status: 'BOT' },
          });
        }
        await this.sendWelcomeButtons(senderPhone);
        await this.saveBotMessage(conversation.id, WELCOME_TEXT, 'INTERACTIVE');
        return;
      }

      // Skip bot when human agent has taken over (unless it was a greeting)
      if (conversation.status === 'HUMAN_TAKEOVER') {
        this.logger.log(`🧑 [${senderPhone}] HUMAN_TAKEOVER active — skipping bot`);
        return;
      }

      // ─────────────────────────────────────────────────────────────────────
      // RULE 2: Button click → send ONLY the bullet list of service names
      // ─────────────────────────────────────────────────────────────────────
      if (selectedButtonId && BUTTON_SERVICE_LIST[selectedButtonId as keyof typeof BUTTON_SERVICE_LIST]) {
        const list = BUTTON_SERVICE_LIST[selectedButtonId as keyof typeof BUTTON_SERVICE_LIST];
        await this.sendWhatsAppText(senderPhone, list);
        await this.saveBotMessage(conversation.id, list, 'TEXT');
        return;
      }

      // ─────────────────────────────────────────────────────────────────────
      // RULE 4: Pricing / Cost query — exact reply, no deviation
      // ─────────────────────────────────────────────────────────────────────
      if (PRICING_KEYWORDS.some((k) => cleanLower.includes(k))) {
        await this.sendWhatsAppText(senderPhone, PRICING_REPLY);
        await this.saveBotMessage(conversation.id, PRICING_REPLY, 'TEXT');
        return;
      }

      // ─────────────────────────────────────────────────────────────────────
      // RULE 3 + 5: Specific service explanation OR out-of-scope fallback
      // ─────────────────────────────────────────────────────────────────────
      const answer = getCompanyAnswerByKeyword(incomingText);
      await this.sendWhatsAppText(senderPhone, answer);
      await this.saveBotMessage(conversation.id, answer, 'TEXT');

    } catch (error: any) {
      this.logger.error('❌ Webhook error:', error?.response?.data ?? error?.message);
    }
  }

  // ── Rule 1: Send welcome interactive message with 3 service buttons ───────
  private async sendWelcomeButtons(to: string): Promise<void> {
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
    const token         = process.env.META_ACCESS_TOKEN;

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type:    'individual',
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text: WELCOME_TEXT },
        action: {
          buttons: MAIN_MENU_BUTTONS.map((btn) => ({
            type: 'reply',
            reply: { id: btn.id, title: btn.title },
          })),
        },
      },
    };

    const res = await axios.post(
      `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
      payload,
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } },
    );
    this.logger.log(`✅ Welcome buttons sent to ${to} | ${JSON.stringify(res.data?.messages?.[0]?.id)}`);
  }

  // ── Send plain WhatsApp text ───────────────────────────────────────────────
  private async sendWhatsAppText(to: string, text: string): Promise<void> {
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
    const token         = process.env.META_ACCESS_TOKEN;

    const res = await axios.post(
      `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type:    'individual',
        to,
        type: 'text',
        text: { preview_url: false, body: text },
      },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } },
    );
    this.logger.log(`✅ Text sent to ${to} | ${JSON.stringify(res.data?.messages?.[0]?.id)}`);
  }

  // ── Persist bot reply to DB ────────────────────────────────────────────────
  private async saveBotMessage(
    conversationId: string,
    body: string,
    type: string,
  ): Promise<void> {
    await this.prisma.message.create({
      data: {
        conversationId,
        senderType: 'BOT',
        type,
        body,
        status: 'SENT',
      },
    });
  }
}