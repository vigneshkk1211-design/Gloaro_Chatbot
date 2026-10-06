import { Module } from '@nestjs/common';
import { GoogleSheetsService } from './google-sheets.service';
import { LeadsController } from './leads.controller';

@Module({
  controllers: [LeadsController],
  providers: [GoogleSheetsService],
  exports: [GoogleSheetsService],
})
export class GoogleSheetsModule {}

