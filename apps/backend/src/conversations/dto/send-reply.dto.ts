import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class SendReplyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(4096)
  message: string;
}
