import { Controller, Get, Res, NotFoundException, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('leads')
export class LeadsController {
  /**
   * GET /leads/download
   * Streams the local leads.xlsx file back to the client as an Excel download attachment.
   */
  @Get('download')
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
