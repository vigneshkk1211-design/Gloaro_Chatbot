import { Injectable } from '@nestjs/common';
import { BotEngineService, IncomingMessage } from '../whatsapp/bot-engine.service';

@Injectable()
export class WebhookService {
  constructor(private readonly botEngine: BotEngineService) {}

  async handleIncomingMessage(incoming: IncomingMessage): Promise<void> {
    await this.botEngine.processIncomingMessage(incoming);
  }
}
