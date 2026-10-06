import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface LeadData {
  name: string;
  company: string;
  contact: string;
  place: string;
  service: string;
  timestamp?: string;
}

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  /**
   * Saves lead data locally into an Excel file (leads.xlsx) using SheetJS (xlsx).
   */
  async appendLead(data: LeadData): Promise<boolean> {
    const timestamp =
      data.timestamp ||
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const XLSX = require('xlsx');
      const filePath = path.join(process.cwd(), 'leads.xlsx');

      let rows: any[][] = [];
      const headers = [
        'Name',
        'Company Name',
        'Contact Details',
        'Place / Location',
        'Service Name',
        'Timestamp',
      ];

      if (fs.existsSync(filePath)) {
        try {
          const workbook = XLSX.readFile(filePath);
          const sheetName = workbook.SheetNames[0] || 'Leads';
          const worksheet = workbook.Sheets[sheetName];
          rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        } catch (readErr) {
          rows = [headers];
        }
      }

      if (!rows || rows.length === 0) {
        rows = [headers];
      }

      rows.push([
        data.name || 'N/A',
        data.company || 'N/A',
        data.contact || 'N/A',
        data.place || 'N/A',
        data.service || 'N/A',
        timestamp,
      ]);

      const newWorksheet = XLSX.utils.aoa_to_sheet(rows);
      const newWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Leads');
      XLSX.writeFile(newWorkbook, filePath);

      this.logger.log(`📊 Lead row appended & saved to local Excel spreadsheet: ${filePath}`);
      return true;
    } catch (err: any) {
      this.logger.error(`❌ Failed to save lead to local Excel spreadsheet:`, err?.message ?? err);
      return false;
    }
  }
}
