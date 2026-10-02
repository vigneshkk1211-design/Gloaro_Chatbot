import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { SendReplyDto } from './dto/send-reply.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  /**
   * GET /conversations
   * List all conversations with contact info and last message
   */
  @Get()
  findAll() {
    return this.conversationsService.findAll();
  }

  /**
   * GET /conversations/:id/messages
   * Retrieve full message history for a conversation
   */
  @Get(':id/messages')
  findMessages(@Param('id') id: string) {
    return this.conversationsService.findMessages(id);
  }

  /**
   * POST /conversations/:id/reply
   * Agent sends a manual reply to a conversation
   */
  @Post(':id/reply')
  @HttpCode(HttpStatus.CREATED)
  sendReply(@Param('id') id: string, @Body() dto: SendReplyDto) {
    return this.conversationsService.sendReply(id, dto);
  }

  /**
   * PATCH /conversations/:id/status
   * Toggle between BOT and HUMAN_TAKEOVER mode
   */
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.conversationsService.updateStatus(id, dto);
  }
}
