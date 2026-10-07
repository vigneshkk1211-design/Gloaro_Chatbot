import { Controller, Get, Post, Req, Res, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { LeadsService } from '../leads/leads.service';
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
  getButtonServiceList,
  getCategorySubMenuContent,
  InteractiveListContent,
  getServiceImageUrl,
  getServiceVideoUrl,
  getSubServiceCategory,
  getPricingReply,
  getCompanyAnswerByKeyword,
  isThankYouMessage,
  getThankYouReply,
  buildPendingLeadMarker,
  parsePendingLeadMarker,
  getSubServiceTitle,
  getLeadPrompt,
  getLeadConfirmation,
  parseLeadDetails,
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
//   6. Local Excel (leads.xlsx) Lead Capture flow prior to delivering service media.
// ─────────────────────────────────────────────────────────────────────────────
@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly leadsService: LeadsService,
  ) {}

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
  handleWebhook(@Req() req: Request, @Res() res: Response) {
    // 1. Immediately return HTTP 200 to Meta API (satisfies strict 20s SLA within < 5ms)
    res.status(HttpStatus.OK).send('EVENT_RECEIVED');

    // 2. Process conversation & bot dispatch asynchronously in background (24/7 reliability)
    setImmediate(() => {
      this.processWebhookEvent(req.body).catch((err: any) => {
        this.logger.error('❌ Async webhook processing error:', err?.response?.data ?? err?.message ?? err);
      });
    });
  }

  private async processWebhookEvent(body: any): Promise<void> {
    try {
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

      // ── 4. Parse incoming message (Buttons, Lists, Native Flow Responses, and Plain Text) ────────
      let incomingText     = '';
      let selectedButtonId = '';
      let formPayload: { name?: string; company?: string; contact?: string; place?: string } | null = null;

      if (message.type === 'interactive') {
        if (message.interactive?.button_reply) {
          selectedButtonId = ((message.interactive.button_reply.id as string) || '').trim().toLowerCase();
          incomingText     = ((message.interactive.button_reply.title as string) || '').trim();
        } else if (message.interactive?.list_reply) {
          selectedButtonId = ((message.interactive.list_reply.id as string) || '').trim().toLowerCase();
          incomingText     = ((message.interactive.list_reply.title as string) || '').trim();
        } else if (message.interactive?.nfm_reply || message.interactive?.native_flow_response) {
          const nfm = message.interactive.nfm_reply || message.interactive.native_flow_response;
          const rawJson = nfm.response_json;
          selectedButtonId = (nfm.name || 'form_response').toLowerCase();
          incomingText = typeof rawJson === 'string' ? rawJson : JSON.stringify(rawJson);
          try {
            const parsed = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;
            formPayload = {
              name: parsed.name || parsed.fullName || parsed.Name || parsed.full_name,
              company: parsed.company || parsed.companyName || parsed.Company || parsed.company_name,
              contact: parsed.contact || parsed.phone || parsed.mobile || parsed.Contact || parsed.phone_number,
              place: parsed.place || parsed.location || parsed.city || parsed.Place || parsed.address,
            };
          } catch (e) {
            this.logger.warn(`Failed to parse nfm_reply JSON: ${incomingText}`);
          }
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
      // (Sent as clean interactive buttons WITHOUT welcome image)
      // ─────────────────────────────────────────────────────────────────────
      if (!sessionLang && !LANG_BUTTON_IDS.includes(selectedButtonId)) {
        const langContent = getLanguageSelectionContent();
        await this.sendInteractiveButtons(senderPhone, langContent);
        await this.saveBotMessage(conversation.id, langContent.body, 'INTERACTIVE');
        this.logger.log(`🌐 Language selection sent without welcome image → ${senderPhone}`);
        return;
      }

      // ─────────────────────────────────────────────────────────────────────
      // STEP 2 — User selects Language -> welcome.jpg ONLY triggered AFTER language chosen
      // Welcome message and 3 service buttons attached with welcome.jpg as a single message
      // ─────────────────────────────────────────────────────────────────────
      if (LANG_BUTTON_IDS.includes(selectedButtonId)) {
        const chosenLang: Lang = buttonIdToLang(selectedButtonId) ?? 'en';

        // Persist the language marker so every future request can resolve it
        await this.saveBotMessage(conversation.id, buildLangMarker(chosenLang), 'TEXT');

        // Send Welcome Image + Welcome text + 3 main category buttons attached together
        const menuContent = getServiceMenuContent(chosenLang);
        await this.sendInteractiveButtons(senderPhone, {
          ...menuContent,
          imageUrl: SERVICE_IMAGES.welcome,
        });
        await this.saveBotMessage(conversation.id, `[Welcome: ${SERVICE_IMAGES.welcome}]\n\n${menuContent.body}`, 'INTERACTIVE');
        this.logger.log(`🔒 Language locked [${chosenLang}] & Welcome menu sent with welcome.jpg → ${senderPhone}`);
        return;
      }

      // From this point the session language is always resolved
      const lang: Lang = sessionLang ?? 'en';

      // ─────────────────────────────────────────────────────────────────────
      // STEP 3 — Main Categories Selection (Digital Marketing / Technology Solutions / E-Commerce Solutions)
      // Triggered ONLY by the main category buttons (btn_dm / btn_tech / btn_ecom).
      // Dispatches ONLY the descriptive text and the interactive "View Services" list pop-up (NO images).
      // Sub-service item clicks (e.g. btn_sub_dm) pass through to Step 4.
      // ─────────────────────────────────────────────────────────────────────
      const isSubServiceClick =
        selectedButtonId.startsWith('btn_sub_') ||
        selectedButtonId === BUTTON_IDS.SUB_DM ||
        selectedButtonId === BUTTON_IDS.SUB_SMM ||
        selectedButtonId === BUTTON_IDS.SUB_ADS ||
        selectedButtonId === BUTTON_IDS.SUB_SEO ||
        selectedButtonId === BUTTON_IDS.SUB_CONTENT ||
        selectedButtonId === BUTTON_IDS.SUB_BRANDING ||
        selectedButtonId === BUTTON_IDS.SUB_WEB ||
        selectedButtonId === BUTTON_IDS.SUB_MOBILE ||
        selectedButtonId === BUTTON_IDS.SUB_SOFTWARE ||
        selectedButtonId === BUTTON_IDS.SUB_CRM ||
        selectedButtonId === BUTTON_IDS.SUB_BOT ||
        selectedButtonId === BUTTON_IDS.SUB_ECOM_APP ||
        selectedButtonId === BUTTON_IDS.SUB_STORE ||
        selectedButtonId === BUTTON_IDS.SUB_LISTING ||
        selectedButtonId === BUTTON_IDS.SUB_B2B ||
        selectedButtonId === BUTTON_IDS.SUB_ECOM_MARKETING ||
        selectedButtonId === BUTTON_IDS.SUB_PAYMENT;

      const isDmCategory =
        !isSubServiceClick &&
        (selectedButtonId === BUTTON_IDS.DM ||
          selectedButtonId === 'btn_dm' ||
          (!selectedButtonId && (
            cleanLower === 'digital marketing category' ||
            cleanLower === 'dm category'
          )));

      const isTechCategory =
        !isSubServiceClick &&
        (selectedButtonId === BUTTON_IDS.TECH ||
          selectedButtonId === 'btn_tech' ||
          (!selectedButtonId && (
            cleanLower === 'technology solutions' ||
            cleanLower === 'tech solutions' ||
            cleanLower === 'தொழில்நுட்ப தீர்வுகள்' ||
            cleanLower === 'तकनीकी समाधान'
          )));

      const isEcomCategory =
        !isSubServiceClick &&
        (selectedButtonId === BUTTON_IDS.ECOM ||
          selectedButtonId === 'btn_ecom' ||
          (!selectedButtonId && (
            cleanLower === 'e-commerce solutions' ||
            cleanLower === 'ecommerce solutions' ||
            cleanLower === 'இ-காமர்ஸ் தீர்வுகள்' ||
            cleanLower === 'ई-कॉमर्स समाधान'
          )));

      if (isDmCategory) {
        // Send ONLY the interactive sub-menu list with its descriptive body text (NO image)
        const subMenu = getCategorySubMenuContent(BUTTON_IDS.DM, lang);
        await this.sendInteractiveList(senderPhone, subMenu);
        await this.saveBotMessage(conversation.id, subMenu.bodyText, 'INTERACTIVE');
        this.logger.log(`📈 Digital Marketing sub-menu list sent → ${senderPhone} [${lang}]`);
        return;
      }

      if (isTechCategory) {
        // Send ONLY the interactive sub-menu list with its descriptive body text (NO image)
        const subMenu = getCategorySubMenuContent(BUTTON_IDS.TECH, lang);
        await this.sendInteractiveList(senderPhone, subMenu);
        await this.saveBotMessage(conversation.id, subMenu.bodyText, 'INTERACTIVE');
        this.logger.log(`💻 Technology Solutions sub-menu list sent → ${senderPhone} [${lang}]`);
        return;
      }

      if (isEcomCategory) {
        // Send ONLY the interactive sub-menu list with its descriptive body text (NO image)
        const subMenu = getCategorySubMenuContent(BUTTON_IDS.ECOM, lang);
        await this.sendInteractiveList(senderPhone, subMenu);
        await this.saveBotMessage(conversation.id, subMenu.bodyText, 'INTERACTIVE');
        this.logger.log(`🛒 E-Commerce Solutions sub-menu list sent → ${senderPhone} [${lang}]`);
        return;
      }

      // ─────────────────────────────────────────────────────────────────────
      // Greetings / Reset -> Welcome image attached with 3 Category Buttons
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

        const menuContent = getServiceMenuContent(lang);
        await this.sendInteractiveButtons(senderPhone, {
          ...menuContent,
          imageUrl: SERVICE_IMAGES.welcome,
        });
        await this.saveBotMessage(conversation.id, `[Welcome: ${SERVICE_IMAGES.welcome}]\n\n${menuContent.body}`, 'INTERACTIVE');
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
      // LEAD CAPTURE STEP 2 & 3: Check if user is replying to a Pending Lead Prompt
      // Sequence:
      // a. Append lead record to local leads.xlsx spreadsheet via xlsx.
      // b. Send immediate Thank You confirmation message in user's language.
      // c. Send service promotional image & detailed description caption.
      // (Welcome Menu is completely omitted — conversation flow stops cleanly here)
      // ─────────────────────────────────────────────────────────────────────
      const pendingLeadService = this.resolvePendingLead(allMessages.map((m) => m.body));
      const hasFormPayload = Boolean(formPayload && (formPayload.name || formPayload.contact));

      if ((pendingLeadService || hasFormPayload) && !isSubServiceClick) {
        const serviceKey = pendingLeadService || 'General Inquiry';
        const serviceTitle = getSubServiceTitle(serviceKey, lang);
        
        // Extract lead details from interactive formPayload or parse text input
        const parsedLead = (hasFormPayload && formPayload)
          ? {
              name: formPayload.name || 'Customer',
              company: formPayload.company || 'N/A',
              contact: formPayload.contact || senderPhone,
              place: formPayload.place || 'N/A',
            }
          : parseLeadDetails(incomingText, senderPhone);

        // a. Append lead record to local leads.xlsx storage
        await this.leadsService.appendLead({
          name: parsedLead.name,
          company: parsedLead.company,
          contact: parsedLead.contact,
          place: parsedLead.place,
          service: serviceTitle,
        });

        // Clear pending lead state in DB
        await this.saveBotMessage(conversation.id, '[LeadCompleted]', 'TEXT');

        // b. Send immediate Thank You confirmation message in user's selected language
        const confirmationMsg = getLeadConfirmation(parsedLead.name, serviceTitle, lang);
        await this.sendWhatsAppText(senderPhone, confirmationMsg);
        await this.saveBotMessage(conversation.id, confirmationMsg, 'TEXT');

        // c. Follow up by sending the sub-service promotional image & detailed description
        const videoUrl = getServiceVideoUrl(serviceKey);
        if (videoUrl) {
          const answer = getCompanyAnswerByKeyword(serviceKey, lang);
          const isCrm = videoUrl === SERVICE_VIDEOS.crm || videoUrl.includes('intro.mp4');
          const filename = isCrm ? 'GLOARO-CRM-Video.mp4' : 'GLOARO-Product-Management-Video.mp4';
          let videoCaption = isCrm ? 'GLOARO PVT LTD — CRM & ERP Intro Video' : 'GLOARO PVT LTD — Service Demo Video';
          if (lang === 'ta') {
            videoCaption = isCrm ? 'GLOARO PVT LTD — CRM & ERP விளக்க வீடியோ' : 'GLOARO PVT LTD — சேவை விளக்க வீடியோ';
          } else if (lang === 'hi') {
            videoCaption = isCrm ? 'GLOARO PVT LTD — CRM और ERP डेमो வீடியோ' : 'GLOARO PVT LTD — சேவை डेमो वीडियो';
          }

          await this.sendWhatsAppVideo(senderPhone, videoUrl, filename, videoCaption);
          await this.saveBotMessage(conversation.id, `[Document: ${filename} - ${videoUrl}]`, 'DOCUMENT');
          await this.sendWhatsAppText(senderPhone, answer);
          await this.saveBotMessage(conversation.id, answer, 'TEXT');
          this.logger.log(`🎦 Video document sent after lead capture [${serviceKey}] → ${senderPhone}`);
        } else {
          const answer = getCompanyAnswerByKeyword(serviceKey, lang);
          const subImageUrl =
            getServiceImageUrl(serviceKey) ||
            getServiceImageUrl(cleanLower);

          if (subImageUrl) {
            await this.sendWhatsAppImage(senderPhone, subImageUrl, answer);
            await this.saveBotMessage(conversation.id, `[Image: ${subImageUrl}]\n\n${answer}`, 'IMAGE');
            this.logger.log(`🖼️ Sub-service image with attached caption sent after lead capture [${serviceKey}] (${subImageUrl}) → ${senderPhone}`);
          } else if (answer) {
            await this.sendWhatsAppText(senderPhone, answer);
            await this.saveBotMessage(conversation.id, answer, 'TEXT');
          }
        }

        this.logger.log(`✅ Lead completion flow finished cleanly for ${senderPhone} without repeating Welcome Menu`);
        return;
      }

      // ─────────────────────────────────────────────────────────────────────
      // LEAD CAPTURE STEP 1: Sub-Service Selection Interception
      // When a user selects/clicks any sub-service, DO NOT send image immediately.
      // Instead, dispatch interactive WhatsApp Flow / Form prompt for Name, Company Name, and Contact Details.
      // ─────────────────────────────────────────────────────────────────────
      const serviceKey = selectedButtonId || cleanLower;
      const isMappedSubService =
        isSubServiceClick ||
        Boolean(getServiceImageUrl(serviceKey)) ||
        Boolean(getServiceVideoUrl(serviceKey)) ||
        Boolean(getSubServiceCategory(serviceKey));

      if (isMappedSubService) {
        const serviceTitle = getSubServiceTitle(serviceKey, lang);

        // Save active requested service state marker
        await this.saveBotMessage(conversation.id, buildPendingLeadMarker(serviceKey), 'TEXT');

        // Send Interactive WhatsApp Flow / Form Prompt
        await this.sendWhatsAppFlowPrompt(senderPhone, serviceTitle, serviceKey, lang);

        const promptText = getLeadPrompt(serviceTitle, lang);
        await this.saveBotMessage(conversation.id, `[InteractiveFormPrompt: ${serviceTitle}]\n${promptText}`, 'INTERACTIVE');
        this.logger.log(`📋 Interactive lead capture prompt sent for [${serviceTitle}] → ${senderPhone}`);
        return;
      }

      // ─────────────────────────────────────────────────────────────────────
      // Fallback / General Company Query
      // ─────────────────────────────────────────────────────────────────────
      const answer = getCompanyAnswerByKeyword(cleanLower, lang);
      await this.sendWhatsAppText(senderPhone, answer);
      await this.saveBotMessage(conversation.id, answer, 'TEXT');

    } catch (error: any) {
      this.logger.error('❌ Webhook error:', error?.response?.data ?? error?.message);
    }
  }

  // ── Resolve active pending lead service from message bodies ───────────────
  private resolvePendingLead(messageBodies: string[]): string | null {
    let pending: string | null = null;
    for (const body of messageBodies) {
      const parsed = parsePendingLeadMarker(body);
      if (parsed) {
        pending = parsed;
      } else if (
        body.startsWith('[LeadCompleted]') ||
        body.startsWith('[Lang:') ||
        body.startsWith('[Welcome:')
      ) {
        pending = null;
      }
    }
    return pending;
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

  // ── Send WhatsApp Interactive Flow / Form Prompt ──────────────────────────
  private async sendWhatsAppFlowPrompt(
    to: string,
    serviceTitle: string,
    serviceKey: string,
    lang: Lang = 'en',
  ): Promise<void> {
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
    const token         = process.env.META_ACCESS_TOKEN;
    const flowId        = process.env.META_WHATSAPP_FLOW_ID;

    if (!phoneNumberId || !token) {
      this.logger.warn('⚠️ Missing META_PHONE_NUMBER_ID or META_ACCESS_TOKEN for WhatsApp API');
      return;
    }

    // 1. If native Meta WhatsApp Flow ID is set in env, dispatch Native Flow payload
    if (flowId) {
      let ctaText = 'Fill Details Form';
      let bodyText = `Please click below to submit your details for ${serviceTitle}.`;
      if (lang === 'ta') {
        ctaText = 'விவரங்களைப் பூர்த்தி செய்ய';
        bodyText = `${serviceTitle} சேவைக்கான உங்கள் விவரங்களைச் சமர்ப்பிக்க கீழே கிளிக் செய்யவும்.`;
      } else if (lang === 'hi') {
        ctaText = 'विवरण भरें';
        bodyText = `${serviceTitle} के लिए अपना विवरण जमा करने के लिए नीचे क्लिक करें।`;
      }

      const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'interactive',
        interactive: {
          type: 'flow',
          header: { type: 'text', text: `📋 ${serviceTitle}` },
          body: { text: bodyText },
          footer: { text: 'GLOARO PVT LTD' },
          action: {
            name: 'flow',
            parameters: {
              flow_message_version: '3',
              flow_token: `flow_${serviceKey}_${Date.now()}`,
              flow_id: flowId,
              flow_cta: ctaText,
              flow_action: 'navigate',
              flow_action_payload: { screen: 'LEAD_FORM' },
            },
          },
        },
      };

      try {
        const res = await axios.post(
          `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
          payload,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } },
        );
        this.logger.log(`✅ Native WhatsApp Flow sent → ${to} (${flowId}) | msgId: ${JSON.stringify(res.data?.messages?.[0]?.id)}`);
        return;
      } catch (err: any) {
        this.logger.warn(`⚠️ Native Flow payload returned error, using structured interactive prompt: ${err?.response?.data?.error?.message ?? err?.message}`);
      }
    }

    // 2. Structured form prompt fallback with clear field guidance
    const promptText = getLeadPrompt(serviceTitle, lang);
    await this.sendWhatsAppText(to, promptText);
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

  // ── Send Interactive Buttons (with optional Image Header attachment) ────
  private async sendInteractiveButtons(
    to: string,
    content: { body: string; buttons: { id: string; title: string }[]; imageUrl?: string },
  ): Promise<void> {
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
    const token         = process.env.META_ACCESS_TOKEN;

    if (!phoneNumberId || !token) {
      this.logger.warn('⚠️ Missing META_PHONE_NUMBER_ID or META_ACCESS_TOKEN for WhatsApp Buttons');
      return;
    }

    const freshUrl = content.imageUrl
      ? (content.imageUrl.includes('?') ? `${content.imageUrl}&v=${Date.now()}` : `${content.imageUrl}?v=${Date.now()}`)
      : undefined;

    const payload: any = {
      messaging_product: 'whatsapp',
      recipient_type:    'individual',
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        ...(freshUrl ? { header: { type: 'image', image: { link: freshUrl } } } : {}),
        body: { text: content.body },
        action: {
          buttons: content.buttons.map((btn) => ({
            type:  'reply',
            reply: { id: btn.id, title: btn.title },
          })),
        },
      },
    };

    try {
      const res = await axios.post(
        `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
        payload,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } },
      );
      this.logger.log(`✅ Interactive Buttons sent → ${to} | msgId: ${JSON.stringify(res.data?.messages?.[0]?.id)}`);
    } catch (err: any) {
      this.logger.error(`❌ Failed to send interactive buttons: ${err?.response?.data?.error?.message ?? err?.message}`);
      if (content.imageUrl) {
        await this.sendWhatsAppImage(to, content.imageUrl, content.body);
      } else {
        await this.sendWhatsAppText(to, content.body);
      }
    }
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