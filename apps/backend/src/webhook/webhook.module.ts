import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WhatsappModule } from '../whatsapp/whatsapp.module';

/**
 * WebhookModule — handles Meta WhatsApp Cloud API events.
 *
 * WhatsappModule is imported so that WhatsappSenderService
 * is available for injection into WebhookController.
 *
 * WebhookService is no longer needed — the controller
 * now routes directly through company-knowledge.ts.
 */
@Module({
  imports: [WhatsappModule],
  controllers: [WebhookController],
})
export class WebhookModule {}
