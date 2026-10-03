import { Controller, Get, Post, Req, Res, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import {
  WELCOME_TEXT,
  MAIN_MENU_BUTTONS,
  MENU_TRIGGER_KEYWORDS,
  PRICING_KEYWORDS,
  BUTTON_SERVICE_LIST,
  getCompanyAnswerByKeyword,
} from '../whatsapp/company-knowledge';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly prisma: PrismaService) { }

  // ── Language Detection Helper ─────────────────────────────────────────────
  private detectLanguage(text: string): 'ta' | 'en' | 'hi' {
    const tamilRegex = /[\u0B80-\u0BFF]/;
    const hindiRegex = /[\u0900-\u097F]/;

    if (tamilRegex.test(text) || text.includes('வணக்கம்')) return 'ta';
    if (hindiRegex.test(text) || text.includes('नमस्ते')) return 'hi';
    return 'en'; // Default to English
  }

  // ── GET /webhook — Meta verification handshake ────────────────────────────
  @Get()
  verifyWebhook(@Req() req: Request, @Res() res: Response) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
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
    res.status(HttpStatus.OK).send('EVENT_RECEIVED');

    try {
      const body = req.body;
      const entry = body?.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
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
        where: { waId: senderPhone },
        update: { name: contactName },
        create: { waId: senderPhone, name: contactName },
      });

      // ── 3. Find or create conversation ────────────────────────────────────
      let conversation = await this.prisma.conversation.findFirst({
        where: { contactId: contact.id },
        orderBy: { updatedAt: 'desc' },
      });

      if (!conversation) {
        conversation = await this.prisma.conversation.create({
          data: { contactId: contact.id, status: 'BOT' },
        });
      }

      // ── 4. Parse incoming message type ────────────────────────────────────
      let incomingText = '';
      let selectedButtonId = '';

      if (message.type === 'interactive' && message.interactive?.button_reply) {
        selectedButtonId = message.interactive.button_reply.id as string;
        incomingText = message.interactive.button_reply.title as string;
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
          metaMessageId: message.id as string,
          senderType: 'USER',
          type: selectedButtonId ? 'INTERACTIVE' : 'TEXT',
          body: selectedButtonId ? `[Button: ${incomingText}]` : incomingText,
        },
      });

      await this.prisma.conversation.update({
        where: { id: conversation.id },
        data: { unreadCount: { increment: 1 }, updatedAt: new Date() },
      });

      const cleanLower = incomingText.trim().toLowerCase();
      const userLang = this.detectLanguage(incomingText);

      // ─────────────────────────────────────────────────────────────────────
      // RULE 1: Greeting → Language analysis & Multilingual Welcome + Buttons
      // ─────────────────────────────────────────────────────────────────────
      if (MENU_TRIGGER_KEYWORDS.some((k) => cleanLower.includes(k) || incomingText.includes(k))) {
        if (conversation.status !== 'BOT') {
          await this.prisma.conversation.update({
            where: { id: conversation.id },
            data: { status: 'BOT' },
          });
        }
        await this.sendWelcomeButtons(senderPhone, userLang);

        let welcomeMsgToSend = WELCOME_TEXT;
        if (userLang === 'ta') {
          welcomeMsgToSend = `வணக்கம்! GLOARO PVT LTD-க்கு நல்வரவு! 🚀✨\n\n"ஒரு சுற்றுச்சூழல் அமைப்பு. பல வணிகத் தீர்வுகள்."\n\nதொழில்முனைவோர், ஸ்டார்ட்அப்கள் மற்றும் SMEs-களை இணைக்கும் வணிக சுற்றுச்சூழல் அமைப்பு நாங்கள்.\n\nஇன்று உங்கள் வணிகத்தை எப்படி உயர்த்த உதவ முடியும்? கீழே உள்ள சேவைகளில் ஒன்றைத் தேர்ந்தெடுக்கவும்:`;
        } else if (userLang === 'hi') {
          welcomeMsgToSend = `नमस्ते! GLOARO PVT LTD में आपका स्वागत है! 🚀✨\n\n"एक पारिस्थितिकी तंत्र। कई व्यावसायिक समाधान।"\n\nआज हम आपके व्यवसाय को बढ़ाने में कैसे मदद कर सकते हैं? कृपया नीचे एक सेवा चुनें:`;
        }

        await this.saveBotMessage(conversation.id, welcomeMsgToSend, 'INTERACTIVE');
        return;
      }

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
      // RULE 4: Pricing / Cost query — Multilingual response (Tamil/Hindi/English)
      // ─────────────────────────────────────────────────────────────────────
      const pricingKeywordsWithLangs = [...PRICING_KEYWORDS, 'விலை', 'கட்டணம்', 'मूल्य', 'शुल्क', 'cost', 'price', 'charge', 'fee'];
      if (pricingKeywordsWithLangs.some((k) => cleanLower.includes(k) || incomingText.includes(k))) {
        let pricingReplyText = '';
        if (userLang === 'ta') {
          pricingReplyText = `கட்டண விவரங்கள் மற்றும் சேவைக் கட்டணங்கள் உங்களது தேவைகளைப் பொறுத்து மாறுபடும். கூடுதல் விவரங்களுக்கு எங்களது நிறுவனத்தைத் தொடர்பு கொள்ளவும்!\n📞 தொடர்புக்கு: 7200537033 / 7200073704\n📧 மின்னஞ்சல்: info@gloaro.com`;
        } else if (userLang === 'hi') {
          pricingReplyText = `मूल्य विवरण और सेवा शुल्क आपकी आवश्यकताओं के अनुसार भिन्न हो सकते हैं। अधिक जानकारी के लिए कृपया हमारी कंपनी से संपर्क करें!\n📞 संपर्क: 7200537033 / 7200073704\n📧 ईमेल: info@gloaro.com`;
        } else {
          pricingReplyText = `Pricing details and service charges vary based on your specific requirements. Please contact our company for further details!\n📞 Contact: 7200537033 / 7200073704\n📧 Email: info@gloaro.com`;
        }

        await this.sendWhatsAppText(senderPhone, pricingReplyText);
        await this.saveBotMessage(conversation.id, pricingReplyText, 'TEXT');
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

  // ── Send Multilingual Welcome Buttons ─────────────────────────────────────
  private async sendWelcomeButtons(to: string, lang: 'ta' | 'en' | 'hi'): Promise<void> {
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
    const token = process.env.META_ACCESS_TOKEN;

    let bodyText = WELCOME_TEXT;
    let buttons = MAIN_MENU_BUTTONS;

    if (lang === 'ta') {
      bodyText = `வணக்கம்! GLOARO PVT LTD-க்கு நல்வரவு! 🚀✨\n\n"ஒரு சுற்றுச்சூழல் அமைப்பு. பல வணிகத் தீர்வுகள்."\n\nதொழில்முனைவோர் மற்றும் நிறுவனங்களை வளர்க்க உதவும் தொழில்நுட்ப சுற்றுச்சூழல் அமைப்பு.\n\nஇன்று உங்கள் வணிகத்தை எப்படி உயர்த்த உதவ முடியும்? கீழே உள்ள சேவைகளில் ஒன்றைத் தேர்ந்தெடுக்கவும்:`;
      buttons = [
        { id: 'btn_dm', title: 'டிஜிட்டல் மார்க்கெட்டிங்' },
        { id: 'btn_tech', title: 'தொழில்நுட்ப தீர்வுகள்' },
        { id: 'btn_ecom', title: 'இ-காமர்ஸ் தீர்வுகள்' },
      ];
    } else if (lang === 'hi') {
      bodyText = `नमस्ते! GLOARO PVT LTD में आपका स्वागत है! 🚀✨\n\n"एक पारिस्थितिकी तंत्र। कई व्यावसायिक समाधान।"\n\nआज हम आपके व्यवसाय को बढ़ाने में कैसे मदद कर सकते हैं? कृपया नीचे एक सेवा चुनें:`;
      buttons = [
        { id: 'btn_dm', title: 'डिजिटल मार्केटिंग' },
        { id: 'btn_tech', title: 'तकनीकी समाधान' },
        { id: 'btn_ecom', title: 'ई-कॉमर्स समाधान' },
      ];
    }

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text: bodyText },
        action: {
          buttons: buttons.map((btn) => ({
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
    this.logger.log(`✅ ${lang.toUpperCase()} Welcome buttons sent to ${to} | ${JSON.stringify(res.data?.messages?.[0]?.id)}`);
  }

  // ── Send plain WhatsApp text ───────────────────────────────────────────────
  private async sendWhatsAppText(to: string, text: string): Promise<void> {
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
    const token = process.env.META_ACCESS_TOKEN;

    const res = await axios.post(
      `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
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