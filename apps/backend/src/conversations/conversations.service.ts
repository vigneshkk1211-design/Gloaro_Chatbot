import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WhatsappSenderService } from '../whatsapp/whatsapp-sender.service';
import { ConversationStatus, MessageType, SenderType, MessageStatus } from '../prisma/prisma.types';
import { SendReplyDto } from './dto/send-reply.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class ConversationsService {
  private readonly logger = new Logger(ConversationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly sender: WhatsappSenderService,
  ) {}

  // ── GET /conversations ──────────────────────────────────────────────────────
  async findAll() {
    const conversations = await this.prisma.conversation.findMany({
      include: {
        contact: true,
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return conversations.map((conv) => ({
      id: conv.id,
      status: conv.status,
      unreadCount: conv.unreadCount,
      updatedAt: conv.updatedAt,
      contact: {
        id: conv.contact.id,
        waId: conv.contact.waId,
        name: conv.contact.name,
      },
      lastMessage: conv.messages[0] ?? null,
    }));
  }

  // ── GET /conversations/:id/messages ────────────────────────────────────────
  async findMessages(conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { contact: true },
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation ${conversationId} not found`);
    }

    const messages = await this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { timestamp: 'asc' },
    });

    // Reset unread count when agent opens conversation
    if (conversation.unreadCount > 0) {
      await this.prisma.conversation.update({
        where: { id: conversationId },
        data: { unreadCount: 0 },
      });
    }

    return {
      conversation: {
        id: conversation.id,
        status: conversation.status,
        contact: {
          id: conversation.contact.id,
          waId: conversation.contact.waId,
          name: conversation.contact.name,
        },
      },
      messages,
    };
  }

  // ── POST /conversations/:id/reply ──────────────────────────────────────────
  async sendReply(conversationId: string, dto: SendReplyDto) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { contact: true },
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation ${conversationId} not found`);
    }

    const { waId } = conversation.contact;

    // Agents can reply regardless of current bot/human status.
    // Send via WhatsApp Cloud API.
    const metaMessageId = await this.sender.sendTextMessage(waId, dto.message);

    // Persist the agent message
    const message = await this.prisma.message.create({
      data: {
        conversationId,
        metaMessageId: metaMessageId ?? undefined,
        senderType: SenderType.AGENT,
        type: MessageType.TEXT,
        body: dto.message,
        status: MessageStatus.SENT,
      },
    });

    // Bump updatedAt so conversation floats to top of list
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    this.logger.log(`📤 Agent reply sent to ${waId} [conv:${conversationId}]`);
    return message;
  }

  // ── PATCH /conversations/:id/status ───────────────────────────────────────
  async updateStatus(conversationId: string, dto: UpdateStatusDto) {
    const exists = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { id: true },
    });

    if (!exists) {
      throw new NotFoundException(`Conversation ${conversationId} not found`);
    }

    const updated = await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        status: dto.status as ConversationStatus,
        updatedAt: new Date(),
      },
      // Return only the scalar fields needed by the frontend
      select: {
        id: true,
        status: true,
        unreadCount: true,
        updatedAt: true,
        contact: {
          select: { id: true, waId: true, name: true },
        },
      },
    });

    this.logger.log(`🔄 Conversation ${conversationId} → ${dto.status}`);
    return updated;
  }
}
