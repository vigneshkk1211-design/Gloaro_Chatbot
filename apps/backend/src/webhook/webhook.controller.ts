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
  SERVICE_VIDEOS,
  buildLangMarker,
  parseLangMarker,
  buttonIdToLang,
  getLanguageSelectionContent,
  getServiceMenuContent,
  getCategorySubMenuContent,
  InteractiveListContent,
  getServiceImageUrl,
  getServiceVideoUrl,
  getSubServiceCategory,
  getPricingReply,
  getCompanyAnswerByKeyword,
  isThankYouMessage,
  getThankYouReply,
} from '../whatsapp/company-knowledge';

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Controller — GLOARO PVT LTD WhatsApp Bot
//
// High-Definition Photo & Uncompressed Video Delivery Architecture:
//   1. GitHub Raw Direct URLs for 100% reliable uptime (no 404s).
//   2. High-Quality Photo Payload (type: 'image') for native WhatsApp photo rendering.
//   3. Video Delivery via Document Mode (type: 'document' with .mp4 filename) to bypass Meta compression limits.
//   4. Strict Sequence: Media (Image/Video) sent first -> immediately followed by text/buttons/lists.
//   5. Instantaneous processing with zero artificial delays.
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

      // ── 4. Parse incoming message (Buttons, Lists, and Plain Text) ────────
      let incomingText     = '';
      let selectedButtonId = '';

      if (message.type === 'interactive') {
        if (message.interactive?.button_reply) {
          selectedButtonId = ((message.interactive.button_reply.id as string) || '').trim().toLowerCase();
          incomingText     = ((message.interactive.button_reply.title as string) || '').trim();
        } else if (message.interactive?.list_reply) {
          selectedButtonId = ((message.interactive.list_reply.id as string) || '').trim().toLowerCase();
          incomingText     = ((message.interactive.list_reply.title as string) || '').trim();
        }
      } else if (message.type === 'text') {
        incomingText = ((message.text?.body as string) || '').trim();
      } else {
        this.logger.debug(`Unsupported message type: ${message.type as string}`);
        return;
      }

      // Robust case-insensitive normalization for matching
      const cleanLower = incomingText.toLowerCase().trim();

      // ── 5. Persist user message ───────────────────────────────────────────
      await this.prisma.message.create({
        data: {
          conversationId: conversation.id,
          metaMessageId:  message.id as string,
          senderType:     'USER',
          type:           selectedButtonId ? 'INTERACTIVE' : 'TEXT',
          body:           selectedButtonId ? `[Interactive: ${incomingText} (${selectedButtonId})]` : incomingText,
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
      // STEP 1 — User sends "Hi" / initial message -> Language Selection Prompt
      // ─────────────────────────────────────────────────────────────────────
      if (!sessionLang && !LANG_BUTTON_IDS.includes(selectedButtonId)) {
        const langContent = getLanguageSelectionContent();
        await this.sendInteractiveButtons(senderPhone, langContent);
        await this.saveBotMessage(conversation.id, langContent.body, 'INTERACTIVE');
        this.logger.log(`🌐 Language selection sent → ${senderPhone}`);
        return;
      }

      // ─────────────────────────────────────────────────────────────────────
      // STEP 2 — User selects Language -> welcome.jpg FIRST -> Welcome text + 3 main category buttons SECOND
      // ─────────────────────────────────────────────────────────────────────
      if (LANG_BUTTON_IDS.includes(selectedButtonId)) {
        const chosenLang: Lang = buttonIdToLang(selectedButtonId) ?? 'en';

        // Persist the language marker so every future request can resolve it
        await this.saveBotMessage(conversation.id, buildLangMarker(chosenLang), 'TEXT');

        // 1. Send High-Definition Welcome Photo FIRST (strictly awaited)
        if (SERVICE_IMAGES.welcome) {
          await this.sendWhatsAppImage(senderPhone, SERVICE_IMAGES.welcome);
          await this.saveBotMessage(conversation.id, `[Image: ${SERVICE_IMAGES.welcome}]`, 'IMAGE');
        }

        // 2. Send Welcome Text with 3 interactive service buttons SECOND
        const menuContent = getServiceMenuContent(chosenLang);
        await this.sendInteractiveButtons(senderPhone, menuContent);
        await this.saveBotMessage(conversation.id, menuContent.body, 'INTERACTIVE');
        this.logger.log(`🔒 Language locked [${chosenLang}] & Welcome menu sent → ${senderPhone}`);
        return;
      }

      // From this point the session language is always resolved
      const lang: Lang = sessionLang ?? 'en';

      // ─────────────────────────────────────────────────────────────────────
      // STEP 3 — Main Categories Selection (Digital Marketing / Technology Solutions / E-Commerce Solutions)
      // When clicked -> Send Category Image FIRST -> Send Interactive List Sub-Menu SECOND
      // ─────────────────────────────────────────────────────────────────────
      const isDmCategory =
        selectedButtonId === BUTTON_IDS.DM ||
        selectedButtonId === 'btn_dm' ||
        cleanLower === 'digital marketing' ||
        cleanLower === 'digital-marketing' ||
        cleanLower === 'டிஜிட்டல் மார்க்கெட்டிங்' ||
        cleanLower === 'डिजिटल मार्केटिंग';

      const isTechCategory =
        selectedButtonId === BUTTON_IDS.TECH ||
        selectedButtonId === 'btn_tech' ||
        cleanLower === 'technology solutions' ||
        cleanLower === 'tech solutions' ||
        cleanLower === 'technology' ||
        cleanLower === 'தொழில்நுட்ப தீர்வுகள்' ||
        cleanLower === 'तकनीकी समाधान';

      const isEcomCategory =
        selectedButtonId === BUTTON_IDS.ECOM ||
        selectedButtonId === 'btn_ecom' ||
        cleanLower === 'e-commerce solutions' ||
        cleanLower === 'ecommerce solutions' ||
        cleanLower === 'e-commerce' ||
        cleanLower === 'ecommerce' ||
        cleanLower === 'இ-காமர்ஸ் தீர்வுகள்' ||
        cleanLower === 'ई-कॉमर्स समाधान';

      if (isDmCategory) {
        // 1. Send Digital Marketing Image FIRST (strictly awaited)
        await this.sendWhatsAppImage(senderPhone, SERVICE_IMAGES.dm);
        await this.saveBotMessage(conversation.id, `[Image: ${SERVICE_IMAGES.dm}]`, 'IMAGE');

        // 2. Send Interactive Sub-Menu List SECOND
        const subMenu = getCategorySubMenuContent(BUTTON_IDS.DM, lang);
        await this.sendInteractiveList(senderPhone, subMenu);
        await this.saveBotMessage(conversation.id, subMenu.bodyText, 'INTERACTIVE');
        this.logger.log(`📈 Digital Marketing sub-menu list sent → ${senderPhone} [${lang}]`);
        return;
      }

      if (isTechCategory) {
        // 1. Send Technology Solutions Image FIRST (strictly awaited)
        await this.sendWhatsAppImage(senderPhone, SERVICE_IMAGES.tech);
        await this.saveBotMessage(conversation.id, `[Image: ${SERVICE_IMAGES.tech}]`, 'IMAGE');

        // 2. Send Interactive Sub-Menu List SECOND
        const subMenu = getCategorySubMenuContent(BUTTON_IDS.TECH, lang);
        await this.sendInteractiveList(senderPhone, subMenu);
        await this.saveBotMessage(conversation.id, subMenu.bodyText, 'INTERACTIVE');
        this.logger.log(`💻 Technology Solutions sub-menu list sent → ${senderPhone} [${lang}]`);
        return;
      }

      if (isEcomCategory) {
        // 1. Send E-Commerce Solutions Image FIRST (strictly awaited)
        await this.sendWhatsAppImage(senderPhone, SERVICE_IMAGES.ecom);
        await this.saveBotMessage(conversation.id, `[Image: ${SERVICE_IMAGES.ecom}]`, 'IMAGE');

        // 2. Send Interactive Sub-Menu List SECOND
        const subMenu = getCategorySubMenuContent(BUTTON_IDS.ECOM, lang);
        await this.sendInteractiveList(senderPhone, subMenu);
        await this.saveBotMessage(conversation.id, subMenu.bodyText, 'INTERACTIVE');
        this.logger.log(`🛒 E-Commerce Solutions sub-menu list sent → ${senderPhone} [${lang}]`);
        return;
      }

      // ─────────────────────────────────────────────────────────────────────
      // Greetings / Reset -> 1. welcome.jpg FIRST -> 2. Welcome text + 3 Category Buttons SECOND
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

        // 1. Send High-Definition Welcome Photo FIRST
        if (SERVICE_IMAGES.welcome) {
          await this.sendWhatsAppImage(senderPhone, SERVICE_IMAGES.welcome);
          await this.saveBotMessage(conversation.id, `[Image: ${SERVICE_IMAGES.welcome}]`, 'IMAGE');
        }

        // 2. Immediately follow with localized welcome body + 3 service buttons SECOND
        const menuContent = getServiceMenuContent(lang);
        await this.sendInteractiveButtons(senderPhone, menuContent);
        await this.saveBotMessage(conversation.id, menuContent.body, 'INTERACTIVE');
        return;
      }

      // ─────────────────────────────────────────────────────────────────────
      // Thank you / appreciation query -> professional acknowledgment
      // ─────────────────────────────────────────────────────────────────────
      if (isThankYouMessage(cleanLower)) {
        const thankYouReply = getThankYouReply(lang);
        await this.sendWhatsAppText(senderPhone, thankYouReply);
        await this.saveBotMessage(conversation.id, thankYouReply, 'TEXT');
        return;
      }

      // ─────────────────────────────────────────────────────────────────────
      // Pricing query -> pricing reply with contact info
      // ─────────────────────────────────────────────────────────────────────
      if (PRICING_KEYWORDS.some((k) => cleanLower.includes(k))) {
        const pricingReply = getPricingReply(lang);
        await this.sendWhatsAppText(senderPhone, pricingReply);
        await this.saveBotMessage(conversation.id, pricingReply, 'TEXT');
        return;
      }

      // ─────────────────────────────────────────────────────────────────────
      // Video Triggers — CRM & ERP -> intro.mp4 | Product Listing & Management -> service-demo.mp4
      // Sequence: Video Document (.mp4) FIRST -> Catchy definition text SECOND
      // ─────────────────────────────────────────────────────────────────────
      const videoUrl = getServiceVideoUrl(selectedButtonId || cleanLower);
      if (videoUrl) {
        const answer = getCompanyAnswerByKeyword(selectedButtonId || cleanLower, lang);

        const isCrm = videoUrl === SERVICE_VIDEOS.crm || videoUrl.includes('intro.mp4');
        const filename = isCrm ? 'GLOARO-CRM-Video.mp4' : 'GLOARO-Product-Management-Video.mp4';

        // Clean professional title without phone numbers or extra clutter
        let videoCaption = isCrm ? 'GLOARO PVT LTD — CRM & ERP Intro Video' : 'GLOARO PVT LTD — Service Demo Video';
        if (lang === 'ta') {
          videoCaption = isCrm ? 'GLOARO PVT LTD — CRM & ERP விளக்க வீடியோ' : 'GLOARO PVT LTD — சேவை விளக்க வீடியோ';
        } else if (lang === 'hi') {
          videoCaption = isCrm ? 'GLOARO PVT LTD — CRM और ERP डेमो वीडियो' : 'GLOARO PVT LTD — सेवा डेमो वीडियो';
        }

        // 1. Send Video as Document FIRST (strictly awaited)
        await this.sendWhatsAppVideo(senderPhone, videoUrl, filename, videoCaption);
        await this.saveBotMessage(conversation.id, `[Document: ${filename} - ${videoUrl}]`, 'DOCUMENT');

        // 2. Send detailed description text AFTER the video document (strictly after media)
        await this.sendWhatsAppText(senderPhone, answer);
        await this.saveBotMessage(conversation.id, answer, 'TEXT');
        this.logger.log(`🎦 Video document sent FIRST, then description [${cleanLower}] (${filename}) → ${senderPhone} [${lang}]`);
        return;
      }

      // ─────────────────────────────────────────────────────────────────────
      // STEP 4 — Sub-Service Selection (Interactive List row / Button / Free-text Keyword)
      // Sequence: Exact Mapped HD Image FIRST -> Catchy Definition Text + Contact Info SECOND
      // ─────────────────────────────────────────────────────────────────────
      const answer = getCompanyAnswerByKeyword(selectedButtonId || cleanLower, lang);

      // Resolve specific service image or parent-category image FIRST (case-insensitive)
      const categoryBtnId = getSubServiceCategory(cleanLower);
      const subImageUrl =
        getServiceImageUrl(selectedButtonId) ||
        getServiceImageUrl(cleanLower) ||
        (categoryBtnId ? getServiceImageUrl(categoryBtnId) : null);

      // 1. Send HD Service Image FIRST (strictly awaited)
      if (subImageUrl) {
        await this.sendWhatsAppImage(senderPhone, subImageUrl);
        await this.saveBotMessage(conversation.id, `[Image: ${subImageUrl}]`, 'IMAGE');
        this.logger.log(`🖼️ Service image sent for [${selectedButtonId || cleanLower}] (${subImageUrl}) → ${senderPhone}`);
      }

      // 2. Send detailed sub-service text strictly AFTER the image
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

  // ── Send WhatsApp Video as Document (type: 'document' with .mp4 filename) ────
  private async sendWhatsAppVideo(
    to: string,
    videoUrl: string,
    filename: string,
    caption?: string,
  ): Promise<void> {
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
    const token         = process.env.META_ACCESS_TOKEN;

    if (!phoneNumberId || !token) {
      this.logger.warn('⚠️ Missing META_PHONE_NUMBER_ID or META_ACCESS_TOKEN for WhatsApp Document delivery');
      return;
    }

    const freshUrl = videoUrl.includes('?') ? `${videoUrl}&v=${Date.now()}` : `${videoUrl}?v=${Date.now()}`;

    try {
      const res = await axios.post(
        `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type:    'individual',
          to,
          type: 'document',
          document: {
            link: freshUrl,
            filename,
            ...(caption ? { caption } : {}),
          },
        },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } },
      );
      this.logger.log(`✅ Video document sent → ${to} (${filename} - ${freshUrl}) | msgId: ${JSON.stringify(res.data?.messages?.[0]?.id)}`);
    } catch (err: any) {
      this.logger.error(`❌ Failed to send video document (${filename}): ${err?.response?.data?.error?.message ?? err?.message}`);
      if (caption) {
        await this.sendWhatsAppText(to, caption);
      }
    }
  }

  // ── Send WhatsApp HD Image (Photo delivery via type: 'image') ────────────
  private async sendWhatsAppImage(
    to: string,
    imageUrl: string,
    caption?: string,
  ): Promise<void> {
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
    const token         = process.env.META_ACCESS_TOKEN;

    if (!phoneNumberId || !token) {
      this.logger.warn('⚠️ Missing META_PHONE_NUMBER_ID or META_ACCESS_TOKEN for WhatsApp Image delivery');
      return;
    }

    // Dynamic cache-busting timestamp parameter forces Meta servers to fetch the latest un-cached HD image
    const freshUrl = imageUrl.includes('?') ? `${imageUrl}&v=${Date.now()}` : `${imageUrl}?v=${Date.now()}`;

    try {
      const res = await axios.post(
        `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type:    'individual',
          to,
          type: 'image',
          image: {
            link: freshUrl,
            ...(caption ? { caption } : {}),
          },
        },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } },
      );
      this.logger.log(`✅ HD Photo sent → ${to} (${freshUrl}) | msgId: ${JSON.stringify(res.data?.messages?.[0]?.id)}`);
    } catch (err: any) {
      this.logger.error(`❌ Failed to send image (${freshUrl}): ${err?.response?.data?.error?.message ?? err?.message}`);
      if (caption) {
        await this.sendWhatsAppText(to, caption);
      }
    }
  }

  // ── Send Interactive Buttons ──────────────────────────────────────────────
  private async sendInteractiveButtons(
    to: string,
    content: { body: string; buttons: { id: string; title: string }[] },
  ): Promise<void> {
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
    const token         = process.env.META_ACCESS_TOKEN;

    const payload = {
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

    const res = await axios.post(
      `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
      payload,
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } },
    );
    this.logger.log(`✅ Interactive Buttons sent → ${to} | msgId: ${JSON.stringify(res.data?.messages?.[0]?.id)}`);
  }

  // ── Send Interactive List (Sub-menu popups) ───────────────────────────────
  private async sendInteractiveList(
    to: string,
    content: InteractiveListContent,
  ): Promise<void> {
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
    const token         = process.env.META_ACCESS_TOKEN;

    if (!phoneNumberId || !token) {
      this.logger.warn('⚠️ Missing META_PHONE_NUMBER_ID or META_ACCESS_TOKEN for WhatsApp List delivery');
      return;
    }

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type:    'individual',
      to,
      type: 'interactive',
      interactive: {
        type: 'list',
        ...(content.headerText ? { header: { type: 'text', text: content.headerText } } : {}),
        body: { text: content.bodyText },
        ...(content.footerText ? { footer: { text: content.footerText } } : {}),
        action: {
          button: content.buttonText,
          sections: content.sections,
        },
      },
    };

    try {
      const res = await axios.post(
        `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
        payload,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } },
      );
      this.logger.log(`✅ Interactive List sent → ${to} | msgId: ${JSON.stringify(res.data?.messages?.[0]?.id)}`);
    } catch (err: any) {
      this.logger.error(`❌ Failed to send interactive list: ${err?.response?.data?.error?.message ?? err?.message}`);
      // Fallback to text message if list fails
      await this.sendWhatsAppText(to, content.bodyText);
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