import { Module } from '@nestjs/common';
import { WhatsappSenderService } from './whatsapp-sender.service';
import { BotEngineService } from './bot-engine.service';
import { GeminiAiService } from './gemini-ai.service';

@Module({
  providers: [WhatsappSenderService, BotEngineService, GeminiAiService],
  exports: [WhatsappSenderService, BotEngineService, GeminiAiService],
})
export class WhatsappModule {}
