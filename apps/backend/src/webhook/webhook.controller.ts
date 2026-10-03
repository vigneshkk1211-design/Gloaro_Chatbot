import { Controller, Get, Post, Req, Res, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import {
  BUTTON_IDS,
  MENU_TRIGGER_KEYWORDS,
  PRICING_KEYWORDS,
  detectLanguage,
  getWelcomeContent,
  getButtonServiceList,
  getPricingReply,
  getCompanyAnswerByKeyword,
} from '../whatsapp/company-knowledge';

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Controller — GLOARO PVT LTD WhatsApp Bot
//
// Message flow:
//   1. Greeting / first message → Localized welcome + 3 service buttons
//   2. Service button click     → Bullet list ONLY (no contact info)
//   3. Free-text keyword query  → Detailed reply WITH contact info
//   4. Pricing keyword          → Pricing reply in locked language
//   5. HUMAN_TAKEOVER           → Skip bot
// ─────────────────────────────────────────────────────────────────────────────
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

      // ── 1. Duplicate guard ────────────────────────────────────────────────
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

      // ── 4. Parse incoming message ─────────────────────────────────────────
      let incomingText     = '';
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

      // Bump conversation activity
      await this.prisma.conversation.update({
        where: { id: conversation.id },
        data:  { unreadCount: { increment: 1 }, updatedAt: new Date() },
      });

      // ── 6. Resolve session language from message history ──────────────────
      const previousMessages = await this.prisma.message.findMany({
        where:   { conversationId: conversation.id },
        orderBy: { timestamp: 'asc' },
        take:    10,
      });

      // Detect language from history (most recent non-English wins)
      let sessionLang: 'ta' | 'hi' | 'en' = 'en';
      for (const msg of previousMessages) {
        const detected = detectLanguage(msg.body);
        if (detected !== 'en') { sessionLang = detected; break; }
      }
      // Current message overrides if it carries a language signal
      const currentDetected = detectLanguage(incomingText);
      if (currentDetected !== 'en') sessionLang = currentDetected;

      // ── HUMAN_TAKEOVER guard ──────────────────────────────────────────────
      if (conversation.status === 'HUMAN_TAKEOVER') {
        this.logger.log(`🧑 [${senderPhone}] HUMAN_TAKEOVER — skipping bot`);
        return;
      }

      const cleanLower = incomingText.trim().toLowerCase();

      // ─────────────────────────────────────────────────────────────────────
      // STEP 1 — Greeting or first message → localized welcome + service buttons
      // ─────────────────────────────────────────────────────────────────────
      const isFirstMessage  = previousMessages.length <= 1;
      const isGreeting      = MENU_TRIGGER_KEYWORDS.some(
        (k) => cleanLower === k || cleanLower.startsWith(k),
      );

      if (isFirstMessage || isGreeting) {
        if (conversation.status !== 'BOT') {
          await this.prisma.conversation.update({
            where: { id: conversation.id },
            data:  { status: 'BOT' },
          });
        }
        const welcomeContent = getWelcomeContent(sessionLang);
        await this.sendInteractiveButtons(senderPhone, welcomeContent);
        await this.saveBotMessage(conversation.id, welcomeContent.body, 'INTERACTIVE');
        this.logger.log(`👋 Welcome sent to ${senderPhone} [${sessionLang}]`);
        return;
      }

      // ─────────────────────────────────────────────────────────────────────
      // STEP 2 — Service button click → bullet list ONLY (no contact info)
      // ─────────────────────────────────────────────────────────────────────
      const serviceButtonIds: string[] = [BUTTON_IDS.DM, BUTTON_IDS.TECH, BUTTON_IDS.ECOM];
      if (selectedButtonId && serviceButtonIds.includes(selectedButtonId)) {
        const serviceList = getButtonServiceList(selectedButtonId, sessionLang);
        await this.sendWhatsAppText(senderPhone, serviceList);
        await this.saveBotMessage(conversation.id, serviceList, 'TEXT');
        this.logger.log(`📋 Service list [${selectedButtonId}] sent to ${senderPhone} [${sessionLang}]`);
        return;
      }

      // ─────────────────────────────────────────────────────────────────────
      // STEP 3 — Pricing keyword → pricing reply in locked language
      // ─────────────────────────────────────────────────────────────────────
      if (PRICING_KEYWORDS.some((k) => cleanLower.includes(k))) {
        const pricingReply = getPricingReply(sessionLang);
        await this.sendWhatsAppText(senderPhone, pricingReply);
        await this.saveBotMessage(conversation.id, pricingReply, 'TEXT');
        return;
      }

      // ─────────────────────────────────────────────────────────────────────
      // STEP 4 — Free-text keyword → detailed reply WITH contact info
      // ─────────────────────────────────────────────────────────────────────
      const answer = getCompanyAnswerByKeyword(incomingText, sessionLang);
      await this.sendWhatsAppText(senderPhone, answer);
      await this.saveBotMessage(conversation.id, answer, 'TEXT');

    } catch (error: any) {
      this.logger.error('❌ Webhook error:', error?.response?.data ?? error?.message);
    }
  }

  // ── Send interactive button message ───────────────────────────────────────
  private async sendInteractiveButtons(
    to: string,
    content: { body: string; buttons: { id: string; title: string }[] },
  ): Promise<void> {
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
    const token         = process.env.META_ACCESS_TOKEN;

    const res = await axios.post(
      `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type:    'individual',
        to,
        type: 'interactive',
        interactive: {
          type: 'button',
          body: { text: content.body },
          action: {
            buttons: content.buttons.map((btn) => ({
              type:  'reply',
              reply: { id: btn.id, title: btn.title },
            })),
          },
        },
      },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } },
    );
    this.logger.log(`✅ Buttons sent to ${to} | msgId: ${JSON.stringify(res.data?.messages?.[0]?.id)}`);
  }

  // ── Send plain WhatsApp text message ──────────────────────────────────────
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
    this.logger.log(`✅ Text sent to ${to} | msgId: ${JSON.stringify(res.data?.messages?.[0]?.id)}`);
  }

  // ── Persist bot reply to DB ───────────────────────────────────────────────
  private async saveBotMessage(conversationId: string, body: string, type: string): Promise<void> {
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