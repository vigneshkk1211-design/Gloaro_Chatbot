import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
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

  /**
   * GET /conversations/leads/download
   * Streams the local leads.xlsx file back to the client as an Excel download attachment.
   */
  @Get('leads/download')
  downloadLeads(@Res({ passthrough: true }) res: Response): StreamableFile {
    const filePath = path.join(process.cwd(), 'leads.xlsx');
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Leads Excel file (leads.xlsx) has not been generated yet.');
    }

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="leads.xlsx"',
    });

    const fileStream = fs.createReadStream(filePath);
    return new StreamableFile(fileStream);
  }
}
