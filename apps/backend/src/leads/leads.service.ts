import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { WhatsappSenderService } from '../whatsapp/whatsapp-sender.service';

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

  /** Admin WhatsApp number in E.164 format (no leading +), e.g. "917200073704". */
  private readonly adminWaNumber: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly whatsappSender: WhatsappSenderService,
  ) {
    this.adminWaNumber =
      this.configService.get<string>('ADMIN_WHATSAPP_NUMBER') ?? '917200073704';
  }

  // ── Excel Append ────────────────────────────────────────────────────────────

  /**
   * Appends a new lead row to `leads.xlsx` (located at the process CWD).
   * - If the file already exists, existing rows are preserved and the new row
   *   is appended after the last data row.
   * - If the file does not yet exist, it is created with a header row first.
   * - If the file is corrupt / unreadable, it is recreated from scratch.
   */
  async appendLead(data: LeadData): Promise<boolean> {
    const timestamp =
      data.timestamp ||
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const XLSX = require('xlsx');
      const filePath = path.join(process.cwd(), 'leads.xlsx');

      const headers = [
        'Name',
        'Company Name',
        'Contact Details',
        'Place / Location',
        'Service Name',
        'Timestamp',
      ];

      // ── 1. Read existing rows (preserve history) ────────────────────────
      let rows: any[][] = [];

      if (fs.existsSync(filePath)) {
        try {
          const workbook = XLSX.readFile(filePath);
          const sheetName: string = workbook.SheetNames[0] ?? 'Leads';
          const worksheet = workbook.Sheets[sheetName];
          rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        } catch (readErr) {
          this.logger.warn(
            `⚠️  Could not read existing leads.xlsx (will recreate): ${(readErr as Error).message}`,
          );
          rows = [];
        }
      }

      // ── 2. Ensure header row exists ────────────────────────────────────
      if (rows.length === 0) {
        rows.push(headers);
      }

      // ── 3. Append new lead row ─────────────────────────────────────────
      rows.push([
        data.name    || 'N/A',
        data.company || 'N/A',
        data.contact || 'N/A',
        data.place   || 'N/A',
        data.service || 'N/A',
        timestamp,
      ]);

      // ── 4. Write back (all rows including pre-existing history) ─────────
      const newWorksheet = XLSX.utils.aoa_to_sheet(rows);
      const newWorkbook  = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Leads');
      XLSX.writeFile(newWorkbook, filePath);

      this.logger.log(
        `📊 Lead appended to Excel (${rows.length - 1} total rows): ${filePath}`,
      );
      return true;
    } catch (err: any) {
      this.logger.error(
        `❌ Failed to save lead to Excel: ${err?.message ?? err}`,
      );
      return false;
    }
  }

  // ── Admin WhatsApp Notification ─────────────────────────────────────────────

  /**
   * Sends a formatted WhatsApp text message to the admin number containing all
   * captured lead details.
   */
  async notifyAdmin(data: LeadData): Promise<void> {
    const timestamp =
      data.timestamp ||
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const message = [
      `🔔 *New Lead Received!*`,
      ``,
      `👤 *Name:*     ${data.name    || 'N/A'}`,
      `🏢 *Company:*  ${data.company || 'N/A'}`,
      `📞 *Contact:*  ${data.contact || 'N/A'}`,
      `📍 *Place:*    ${data.place   || 'N/A'}`,
      `🛠️ *Service:*  ${data.service || 'N/A'}`,
      `🕐 *Time:*     ${timestamp}`,
    ].join('\n');

    const msgId = await this.whatsappSender.sendTextMessage(
      this.adminWaNumber,
      message,
    );

    if (msgId) {
      this.logger.log(
        `📬 Admin lead notification sent to ${this.adminWaNumber} | Meta ID: ${msgId}`,
      );
    } else {
      this.logger.warn(
        `⚠️  Admin lead notification to ${this.adminWaNumber} may not have been delivered`,
      );
    }
  }

  // ── Combined Entry Point ────────────────────────────────────────────────────

  /**
   * Saves the lead to Excel **and** fires a WhatsApp notification to the admin.
   * Both operations run concurrently; a failure in either does not block the other.
   */
  async saveLead(data: LeadData): Promise<boolean> {
    const [excelOk] = await Promise.all([
      this.appendLead(data),
      this.notifyAdmin(data).catch((err) =>
        this.logger.error(
          `❌ Admin notification failed: ${(err as Error)?.message ?? err}`,
        ),
      ),
    ]);
    return excelOk;
  }
}
