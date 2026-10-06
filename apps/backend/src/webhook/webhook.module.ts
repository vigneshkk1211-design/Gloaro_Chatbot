import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { LeadsModule } from '../leads/leads.module';

/**
 * WebhookModule — handles Meta WhatsApp Cloud API events.
 *
 * WhatsappModule & LeadsModule are imported for injection into WebhookController.
 */
@Module({
  imports: [WhatsappModule, LeadsModule],
  controllers: [WebhookController],
})
export class WebhookModule {}
