import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getCompanyAnswerByKeyword } from './company-knowledge';

@Injectable()
export class GeminiAiService {
  private readonly logger = new Logger(GeminiAiService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Generates a grounded response strictly based on Gloaro Pvt Ltd official knowledge base.
   * Runs 100% standalone locally via keyword/rule matching with zero external dependencies.
   */
  async generateGroundedResponse(userQuery: string, senderName?: string, lang: 'ta' | 'hi' | 'en' = 'en'): Promise<string> {
    return getCompanyAnswerByKeyword(userQuery, lang);
  }
}
