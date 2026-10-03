import { Controller, Get, Post, Req, Res, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import {
  MENU_TRIGGER_KEYWORDS,
  detectLanguage,
  getWelcomeContent,
  getButtonServiceList,
  getCompanyAnswerByKeyword,
} from '../whatsapp/company-knowledge';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly prisma: PrismaService) { }

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

      const existingMsg = await this.prisma.message.findUnique({
        where: { metaMessageId: message.id },
      });
      if (existingMsg) {
        this.logger.warn(`🔁 Duplicate skipped: ${message.id as string}`);
        return;
      }

      const contact = await this.prisma.contact.upsert({
        where: { waId: senderPhone },
        update: { name: contactName },
        create: { waId: senderPhone, name: contactName },
      });

      let conversation = await this.prisma.conversation.findFirst({
        where: { contactId: contact.id },
        orderBy: { updatedAt: 'desc' },
      });

      if (!conversation) {
        conversation = await this.prisma.conversation.create({
          data: { contactId: contact.id, status: 'BOT' },
        });
      }

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

      // உரையாடலின் தொடக்க மொழியை நிலைநிறுத்த முந்தைய செய்திகளைத் தேடுதல்
      const previousMessages = await this.prisma.message.findMany({
        where: { conversationId: conversation.id },
        orderBy: { timestamp: 'asc' },
        take: 5,
      });

      let sessionLang: 'ta' | 'hi' | 'en' = 'en';
      for (const msg of previousMessages) {
        const l = detectLanguage(msg.body);
        if (l !== 'en') {
          sessionLang = l;
          break;
        }
      }

      const currentDetected = detectLanguage(incomingText);
      if (currentDetected !== 'en') {
        sessionLang = currentDetected;
      }

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

      // வாடிக்கையாளர் எந்தச் செய்தியை அனுப்பினாலும் முதல்முறையாக இருந்தால் அல்லது கீவேர்ட் என்றால் வெல்கம் மெசேஜ் அனுப்புதல்
      const isFirstMessage = previousMessages.length <= 1;
      if (isFirstMessage || MENU_TRIGGER_KEYWORDS.some((k) => cleanLower.includes(k) || incomingText.includes(k))) {
        if (conversation.status !== 'BOT') {
          await this.prisma.conversation.update({
            where: { id: conversation.id },
            data: { status: 'BOT' },
          });
        }

        const welcomeContent = getWelcomeContent(sessionLang);
        await this.sendMultilingualWelcomeButtons(senderPhone, welcomeContent);
        await this.saveBotMessage(conversation.id, welcomeContent.body, 'INTERACTIVE');
        return;
      }

      if (conversation.status === 'HUMAN_TAKEOVER') {
        this.logger.log(`🧑 [${senderPhone}] HUMAN_TAKEOVER active — skipping bot`);
        return;
      }

      // பட்டன் கிளிக் செய்யும்போது லாக் செய்யப்பட்ட மொழியிலேயே பதில் அனுப்புதல்
      if (selectedButtonId) {
        const serviceListText = getButtonServiceList(selectedButtonId, sessionLang);
        await this.sendWhatsAppText(senderPhone, serviceListText);
        await this.saveBotMessage(conversation.id, serviceListText, 'TEXT');
        return;
      }

      // பிற வினவல்கள் மற்றும் அவுட்-ஆஃப்-ஸ்கோப்
      const answer = getCompanyAnswerByKeyword(incomingText, sessionLang);
      await this.sendWhatsAppText(senderPhone, answer);
      await this.saveBotMessage(conversation.id, answer, 'TEXT');

    } catch (error: any) {
      this.logger.error('❌ Webhook error:', error?.response?.data ?? error?.message);
    }
  }

  private async sendMultilingualWelcomeButtons(
    to: string,
    content: { body: string; buttons: { id: string; title: string }[] }
  ): Promise<void> {
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
    const token = process.env.META_ACCESS_TOKEN;

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text: content.body },
        action: {
          buttons: content.buttons.map((btn) => ({
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
    this.logger.log(`✅ Multilingual Welcome buttons sent to ${to} | ${JSON.stringify(res.data?.messages?.[0]?.id)}`);
  }

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