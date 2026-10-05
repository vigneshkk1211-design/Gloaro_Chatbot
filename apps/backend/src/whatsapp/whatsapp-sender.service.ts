import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

export interface WhatsAppButton {
  id: string;
  title: string;
}

@Injectable()
export class WhatsappSenderService {
  private readonly logger = new Logger(WhatsappSenderService.name);
  private readonly httpClient: AxiosInstance;
  private readonly phoneNumberId: string;

  constructor(private readonly configService: ConfigService) {
    const accessToken = this.configService.getOrThrow<string>('META_ACCESS_TOKEN');
    this.phoneNumberId = this.configService.getOrThrow<string>('META_PHONE_NUMBER_ID');

    this.httpClient = axios.create({
      baseURL: 'https://graph.facebook.com/v20.0',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  // ── Text message ────────────────────────────────────────────────────────────
  async sendTextMessage(to: string, body: string): Promise<string | null> {
    try {
      const response = await this.httpClient.post(`/${this.phoneNumberId}/messages`, {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'text',
        text: { preview_url: false, body },
      });
      const messageId: string = response.data?.messages?.[0]?.id;
      this.logger.log(`✅ Text sent to ${to} | Meta ID: ${messageId}`);
      return messageId;
    } catch (error: unknown) {
      this.handleAxiosError(error, `sendTextMessage → ${to}`);
      return null;
    }
  }

  // ── Video message ───────────────────────────────────────────────────────────
  async sendVideoMessage(to: string, videoUrl: string, caption?: string): Promise<string | null> {
    try {
      const response = await this.httpClient.post(`/${this.phoneNumberId}/messages`, {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'video',
        video: {
          link: videoUrl,
          ...(caption ? { caption } : {}),
        },
      });
      const messageId: string = response.data?.messages?.[0]?.id;
      this.logger.log(`✅ Video sent to ${to} | Meta ID: ${messageId}`);
      return messageId;
    } catch (error: unknown) {
      this.handleAxiosError(error, `sendVideoMessage → ${to}`);
      return null;
    }
  }

  // ── Interactive buttons (plain body text) ───────────────────────────────────
  async sendInteractiveButtonMessage(
    to: string,
    body: string,
    buttons: WhatsAppButton[],
  ): Promise<string | null> {
    return this._sendInteractive(to, body, buttons);
  }

  // ── Interactive buttons WITH header image ───────────────────────────────────
  /**
   * Sends an interactive button message that includes a header image.
   * WhatsApp renders the image above the body text.
   *
   * @param imageUrl  Public HTTPS URL of the header image (JPEG/PNG, ≤ 5 MB)
   * @param body      Body text shown below the image (max 1024 chars)
   * @param buttons   Up to 3 quick-reply buttons
   */
  async sendInteractiveButtonMessageWithImage(
    to: string,
    imageUrl: string,
    body: string,
    buttons: WhatsAppButton[],
  ): Promise<string | null> {
    return this._sendInteractive(to, body, buttons, imageUrl);
  }

  // ── Mark as read ────────────────────────────────────────────────────────────
  async markMessageAsRead(messageId: string): Promise<void> {
    try {
      await this.httpClient.post(`/${this.phoneNumberId}/messages`, {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
      });
      this.logger.debug(`📖 Marked ${messageId} as read`);
    } catch (error: unknown) {
      this.handleAxiosError(error, `markMessageAsRead ${messageId}`);
    }
  }

  // ── Private helpers ─────────────────────────────────────────────────────────
  private async _sendInteractive(
    to: string,
    body: string,
    buttons: WhatsAppButton[],
    headerImageUrl?: string,
  ): Promise<string | null> {
    if (buttons.length === 0 || buttons.length > 3) {
      this.logger.warn(`sendInteractive: buttons count must be 1-3, got ${buttons.length}`);
    }

    const formattedButtons = buttons.map((btn) => ({
      type: 'reply',
      reply: {
        id: btn.id.slice(0, 256),        // Meta enforces 256-char limit on button IDs
        title: btn.title.slice(0, 20),   // Meta enforces 20-char limit on button titles
      },
    }));

    const interactive: Record<string, unknown> = {
      type: 'button',
      body: { text: body },
      action: { buttons: formattedButtons },
    };

    if (headerImageUrl) {
      interactive['header'] = {
        type: 'image',
        image: { link: headerImageUrl },
      };
    }

    try {
      const response = await this.httpClient.post(`/${this.phoneNumberId}/messages`, {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'interactive',
        interactive,
      });
      const messageId: string = response.data?.messages?.[0]?.id;
      this.logger.log(
        `✅ Interactive${headerImageUrl ? ' (with image)' : ''} sent to ${to} | Meta ID: ${messageId}`,
      );
      return messageId;
    } catch (error: unknown) {
      this.handleAxiosError(error, `sendInteractiveButton → ${to}`);
      return null;
    }
  }

  private handleAxiosError(error: unknown, context: string): void {
    if (axios.isAxiosError(error)) {
      this.logger.error(
        `❌ WhatsApp API [${context}]: ${JSON.stringify(error.response?.data ?? error.message)}`,
      );
    } else {
      this.logger.error(`❌ Unknown error [${context}]: ${String(error)}`);
    }
  }
}
