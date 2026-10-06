import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { GoogleSheetsModule } from '../google-sheets/google-sheets.module';

/**
 * WebhookModule — handles Meta WhatsApp Cloud API events.
 *
 * WhatsappModule & GoogleSheetsModule are imported for
 * injection into WebhookController.
 */
@Module({
  imports: [WhatsappModule, GoogleSheetsModule],
  controllers: [WebhookController],
})
export class WebhookModule {}

