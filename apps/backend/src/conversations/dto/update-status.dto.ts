import { IsEnum, IsNotEmpty } from 'class-validator';
import { ConversationStatus } from '../../prisma/prisma.types';

export class UpdateStatusDto {
  @IsEnum(ConversationStatus)
  @IsNotEmpty()
  status: ConversationStatus;
}
