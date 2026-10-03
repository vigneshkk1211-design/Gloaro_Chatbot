import { Controller, Get, Post, Req, Res, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import {
  Lang,
  BUTTON_IDS,
  LANG_BUTTON_IDS,
  PRICING_KEYWORDS,
  SERVICE_IMAGES,
  buildLangMarker,
  parseLangMarker,
  buttonIdToLang,
  getLanguageSelectionContent,
  getServiceMenuContent,
  getButtonServiceList,
  getServiceImageUrl,
  getPricingReply,
  getCompanyAnswerByKeyword,
} from '../whatsapp/company-knowledge';

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Controller — GLOARO PVT LTD WhatsApp Bot
//
// Meta Media & Structured Interactive Payload Architecture:
//   1. Automated Media Upload (POST /v20.0/{phone-number-id}/media) -> returns Media ID
//   2. Structured Interactive Payload / Media ID Header format for crystal-clear clarity
//   3. Resilient Multi-Tier Fallback: Interactive Media Header -> Standalone Media ID -> Link -> Text
// ─────────────────────────────────────────────────────────────────────────────
@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);
  private readonly mediaIdCache = new Map<string, string>();

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

      // ── 1. Duplicate guard (prevents Prisma P2002 on metaMessageId) ───────
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

      // ── 6. Resolve session language from DB history ───────────────────────
      // Language is locked by a "[Lang:xx]" marker saved as a bot message.
      const allMessages = await this.prisma.message.findMany({
        where:   { conversationId: conversation.id },
        orderBy: { timestamp: 'asc' },
      });

      const sessionLang: Lang | null = this.resolveSessionLang(
        allMessages.map((m) => m.body),
      );

      // ── HUMAN_TAKEOVER guard ──────────────────────────────────────────────
      if (conversation.status === 'HUMAN_TAKEOVER') {
        this.logger.log(`🧑 [${senderPhone}] HUMAN_TAKEOVER — skipping bot`);
        return;
      }

      // ─────────────────────────────────────────────────────────────────────
      // STEP 1 — No language chosen yet → send language selection buttons
      // ─────────────────────────────────────────────────────────────────────
      if (!sessionLang && !LANG_BUTTON_IDS.includes(selectedButtonId)) {
        const langContent = getLanguageSelectionContent();
        await this.sendInteractiveButtons(senderPhone, langContent);
        await this.saveBotMessage(conversation.id, langContent.body, 'INTERACTIVE');
        this.logger.log(`🌐 Language selection sent → ${senderPhone}`);
        return;
      }

      // ─────────────────────────────────────────────────────────────────────
      // STEP 2 — User clicked a language button → lock language, send Welcome Image + Service Menu
      // ─────────────────────────────────────────────────────────────────────
      if (LANG_BUTTON_IDS.includes(selectedButtonId)) {
        const chosenLang: Lang = buttonIdToLang(selectedButtonId) ?? 'en';

        // Persist the language marker so every future request can resolve it
        await this.saveBotMessage(conversation.id, buildLangMarker(chosenLang), 'TEXT');

        // Send HD Welcome Image first via Media ID
        if (SERVICE_IMAGES.welcome) {
          await this.sendWhatsAppImageByMediaId(senderPhone, SERVICE_IMAGES.welcome, 'GLOARO-Welcome.jpg');
          await this.saveBotMessage(conversation.id, `[Image (Media ID): ${SERVICE_IMAGES.welcome}]`, 'IMAGE');
        }

        // Send Welcome Text with 3 interactive service buttons
        const menuContent = getServiceMenuContent(chosenLang);
        await this.sendInteractiveButtons(senderPhone, menuContent);
        await this.saveBotMessage(conversation.id, menuContent.body, 'INTERACTIVE');
        this.logger.log(`🔒 Language locked [${chosenLang}] & Welcome menu sent → ${senderPhone}`);
        return;
      }

      // From this point the session language is always resolved
      const lang: Lang = sessionLang ?? 'en';
      const cleanLower = incomingText.trim().toLowerCase();

      // ─────────────────────────────────────────────────────────────────────
      // STEP 3 — Service button click → Send HD Image (Media ID) First, Then Description Text
      // ─────────────────────────────────────────────────────────────────────
      const serviceButtonIds: string[] = [BUTTON_IDS.DM, BUTTON_IDS.TECH, BUTTON_IDS.ECOM];
      if (selectedButtonId && serviceButtonIds.includes(selectedButtonId)) {
        const serviceList = getButtonServiceList(selectedButtonId, lang);
        const imageUrl = getServiceImageUrl(selectedButtonId);

        let filename = 'GLOARO-Service.jpg';
        if (selectedButtonId === BUTTON_IDS.DM)   filename = 'GLOARO-Digital-Marketing.jpg';
        if (selectedButtonId === BUTTON_IDS.TECH) filename = 'GLOARO-Technology-Solutions.jpg';
        if (selectedButtonId === BUTTON_IDS.ECOM) filename = 'GLOARO-ECommerce-Solutions.jpg';

        // 1. Send High-Definition Service Image via Media ID
        if (imageUrl) {
          await this.sendWhatsAppImageByMediaId(senderPhone, imageUrl, filename);
          await this.saveBotMessage(conversation.id, `[Image (Media ID): ${imageUrl}]`, 'IMAGE');
        }

        // 2. Send detailed description text
        await this.sendWhatsAppText(senderPhone, serviceList);
        await this.saveBotMessage(conversation.id, serviceList, 'TEXT');

        this.logger.log(`📋 Service image and description sent [${selectedButtonId}] → ${senderPhone} [${lang}]`);
        return;
      }

      // ─────────────────────────────────────────────────────────────────────
      // Greeting / menu reset → 1. Send Welcome Image (Media ID) -> 2. Send Service Menu in locked language
      // ─────────────────────────────────────────────────────────────────────
      const GREETINGS = [
        'hi', 'hello', 'hey', 'start', 'menu', 'main menu', 'help',
        'services', 'service', 'good morning', 'good evening',
        'வணக்கம்', 'தொடங்கு', 'नमस्ते', 'नमस्कार',
      ];
      const isGreeting =
        GREETINGS.includes(cleanLower) ||
        cleanLower.startsWith('hi ') ||
        cleanLower.startsWith('hello ') ||
        cleanLower.startsWith('hey ') ||
        cleanLower.startsWith('good morning') ||
        cleanLower.startsWith('good evening');

      if (isGreeting) {
        if (conversation.status !== 'BOT') {
          await this.prisma.conversation.update({
            where: { id: conversation.id },
            data:  { status: 'BOT' },
          });
        }

        // 1. Send High-Definition Welcome Image via Media ID
        if (SERVICE_IMAGES.welcome) {
          await this.sendWhatsAppImageByMediaId(senderPhone, SERVICE_IMAGES.welcome, 'GLOARO-Welcome.jpg');
          await this.saveBotMessage(conversation.id, `[Image (Media ID): ${SERVICE_IMAGES.welcome}]`, 'IMAGE');
        }

        // 2. Immediately follow with localized welcome body + 3 service buttons
        const menuContent = getServiceMenuContent(lang);
        await this.sendInteractiveButtons(senderPhone, menuContent);
        await this.saveBotMessage(conversation.id, menuContent.body, 'INTERACTIVE');
        return;
      }

      // ─────────────────────────────────────────────────────────────────────
      // Pricing query → pricing reply with contact info
      // ─────────────────────────────────────────────────────────────────────
      if (PRICING_KEYWORDS.some((k) => cleanLower.includes(k))) {
        const pricingReply = getPricingReply(lang);
        await this.sendWhatsAppText(senderPhone, pricingReply);
        await this.saveBotMessage(conversation.id, pricingReply, 'TEXT');
        return;
      }

      // ─────────────────────────────────────────────────────────────────────
      // STEP 4 — Free-text keyword → detailed sub-service reply WITH contact info
      // ─────────────────────────────────────────────────────────────────────
      const answer = getCompanyAnswerByKeyword(incomingText, lang);
      await this.sendWhatsAppText(senderPhone, answer);
      await this.saveBotMessage(conversation.id, answer, 'TEXT');

    } catch (error: any) {
      this.logger.error('❌ Webhook error:', error?.response?.data ?? error?.message);
    }
  }

  // ── Resolve session language from all message bodies ─────────────────────
  private resolveSessionLang(messageBodies: string[]): Lang | null {
    // Scan all messages; the LAST [Lang:xx] marker wins (allows re-selection)
    let resolved: Lang | null = null;
    for (const body of messageBodies) {
      const lang = parseLangMarker(body);
      if (lang) resolved = lang;
    }
    return resolved;
  }

  // ── 1. Automated Meta Media Upload (POST /v20.0/{phone-number-id}/media) ─
  private async uploadImageToMeta(imageUrl: string, filename = 'image.jpg'): Promise<string | null> {
    const cachedId = this.mediaIdCache.get(imageUrl);
    if (cachedId) {
      this.logger.debug(`⚡ Using cached Media ID for ${imageUrl}: ${cachedId}`);
      return cachedId;
    }

    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
    const token         = process.env.META_ACCESS_TOKEN;

    if (!phoneNumberId || !token) {
      this.logger.warn('⚠️ Missing META_PHONE_NUMBER_ID or META_ACCESS_TOKEN for media upload');
      return null;
    }

    try {
      this.logger.log(`📥 Downloading uncompressed image buffer from source: ${imageUrl}`);
      const imgRes = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          Accept: 'image/jpeg,image/png,image/*,*/*',
        },
      });

      const buffer = Buffer.from(imgRes.data);
      const mimeType = imageUrl.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

      const formData = new FormData();
      formData.append('messaging_product', 'whatsapp');
      formData.append('type', mimeType);
      formData.append('file', new Blob([buffer], { type: mimeType }), filename);

      this.logger.log(`🚀 Uploading HD image to Meta Media API (${filename}, ${buffer.length} bytes)...`);
      const uploadRes = await axios.post(
        `https://graph.facebook.com/v20.0/${phoneNumberId}/media`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 25000,
        },
      );

      const mediaId = uploadRes.data?.id as string;
      if (mediaId) {
        this.mediaIdCache.set(imageUrl, mediaId);
        this.logger.log(`✅ HD Image uploaded to Meta! Media ID: ${mediaId} (${filename})`);
        return mediaId;
      }
      return null;
    } catch (err: any) {
      this.logger.error(`❌ Meta Media upload failed for ${imageUrl}: ${err?.response?.data?.error?.message ?? err?.message}`);
      return null;
    }
  }

  // ── 2. Send WhatsApp HD Image by Media ID ─────────────────────────────────
  private async sendWhatsAppImageByMediaId(
    to: string,
    imageUrl: string,
    filename = 'image.jpg',
    caption?: string,
  ): Promise<void> {
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
    const token         = process.env.META_ACCESS_TOKEN;

    // 1. Attempt upload to Meta Media API to obtain HD Media ID
    const mediaId = await this.uploadImageToMeta(imageUrl, filename);

    if (mediaId) {
      try {
        const res = await axios.post(
          `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
          {
            messaging_product: 'whatsapp',
            recipient_type:    'individual',
            to,
            type: 'image',
            image: {
              id: mediaId,
              ...(caption ? { caption } : {}),
            },
          },
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } },
        );
        this.logger.log(`✅ Crystal-Clear HD Image sent by Media ID → ${to} (Media ID: ${mediaId}) | msgId: ${JSON.stringify(res.data?.messages?.[0]?.id)}`);
        return;
      } catch (err: any) {
        this.logger.warn(`⚠️ Failed to send image with Media ID ${mediaId} (invalidating cache and retrying fallback): ${err?.response?.data?.error?.message ?? err?.message}`);
        this.mediaIdCache.delete(imageUrl);
      }
    }

    // 2. Direct Link Fallback (if Media ID upload or send fails)
    try {
      const res = await axios.post(
        `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type:    'individual',
          to,
          type: 'image',
          image: {
            link: imageUrl,
            ...(caption ? { caption } : {}),
          },
        },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } },
      );
      this.logger.log(`✅ Image sent by Link fallback → ${to} | msgId: ${JSON.stringify(res.data?.messages?.[0]?.id)}`);
    } catch (err: any) {
      this.logger.error(`❌ Failed to send image by link fallback (${imageUrl}): ${err?.response?.data?.error?.message ?? err?.message}`);
      if (caption) {
        await this.sendWhatsAppText(to, caption);
      }
    }
  }

  // ── 3. Send Interactive Buttons (with optional Media Header or fallback) ─
  private async sendInteractiveButtons(
    to: string,
    content: { body: string; buttons: { id: string; title: string }[]; headerMediaId?: string },
  ): Promise<void> {
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
    const token         = process.env.META_ACCESS_TOKEN;

    const payload: any = {
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
    };

    if (content.headerMediaId) {
      payload.interactive.header = {
        type: 'image',
        image: { id: content.headerMediaId },
      };
    }

    try {
      const res = await axios.post(
        `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
        payload,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } },
      );
      this.logger.log(`✅ Interactive Buttons sent → ${to} | msgId: ${JSON.stringify(res.data?.messages?.[0]?.id)}`);
    } catch (err: any) {
      if (content.headerMediaId) {
        this.logger.warn(`⚠️ Failed to send with media header, retrying plain buttons: ${err?.response?.data?.error?.message ?? err?.message}`);
        delete payload.interactive.header;
        const res = await axios.post(
          `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
          payload,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } },
        );
        this.logger.log(`✅ Plain buttons fallback sent → ${to} | msgId: ${JSON.stringify(res.data?.messages?.[0]?.id)}`);
      } else {
        throw err;
      }
    }
  }

  // ── 4. Send Message Template with Media Header (if template configured) ─
  private async sendWhatsAppTemplateWithMediaHeader(
    to: string,
    templateName: string,
    languageCode: string,
    mediaId?: string,
  ): Promise<void> {
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
    const token         = process.env.META_ACCESS_TOKEN;

    const components: any[] = [];
    if (mediaId) {
      components.push({
        type: 'header',
        parameters: [
          {
            type: 'image',
            image: { id: mediaId },
          },
        ],
      });
    }

    try {
      const res = await axios.post(
        `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type:    'individual',
          to,
          type: 'template',
          template: {
            name: templateName,
            language: { code: languageCode },
            ...(components.length > 0 ? { components } : {}),
          },
        },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } },
      );
      this.logger.log(`✅ Template sent → ${to} (${templateName}) | msgId: ${JSON.stringify(res.data?.messages?.[0]?.id)}`);
    } catch (err: any) {
      this.logger.error(`❌ Template send failed: ${err?.response?.data?.error?.message ?? err?.message}`);
      throw err;
    }
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
    this.logger.log(`✅ Text sent → ${to} | msgId: ${JSON.stringify(res.data?.messages?.[0]?.id)}`);
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