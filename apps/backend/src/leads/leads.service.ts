import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { WhatsappSenderService } from '../whatsapp/whatsapp-sender.service';
import { PrismaService } from '../prisma/prisma.service';

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
    private readonly prisma: PrismaService,
  ) {
    this.adminWaNumber =
      this.configService.get<string>('ADMIN_WHATSAPP_NUMBER') ?? '917200073704';
  }

  // ── Excel Append ─────────────────────────────────────────────────────────────

  /**
   * Appends a new lead row to `leads.xlsx` (located at the process CWD).
   *
   * Strategy — read-then-write (cumulative, never-erasing):
   *   1. If the file exists, read ALL existing rows into memory.
   *   2. If the file is missing or corrupt, start fresh with just the header.
   *   3. Push the new lead row at the bottom.
   *   4. Write the full row array (header + all historical rows + new row) back
   *      to disk — so no historical data is ever lost.
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

      // ── Step 1: Read all existing rows from disk ──────────────────────────
      let rows: any[][] = [];

      if (fs.existsSync(filePath)) {
        try {
          const workbook = XLSX.readFile(filePath);
          const sheetName: string = workbook.SheetNames[0] ?? 'Leads';
          const worksheet = workbook.Sheets[sheetName];
          // header:1 → returns raw arrays including the header row itself
          rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        } catch (readErr) {
          this.logger.warn(
            `⚠️  Could not read existing leads.xlsx (recreating): ${(readErr as Error).message}`,
          );
          rows = [];
        }
      }

      // ── Step 2: Guarantee header row is present ───────────────────────────
      if (rows.length === 0) {
        rows.push(headers);
      }

      // ── Step 3: Append the new lead row ───────────────────────────────────
      rows.push([
        data.name    || 'N/A',
        data.company || 'N/A',
        data.contact || 'N/A',
        data.place   || 'N/A',
        data.service || 'N/A',
        timestamp,
      ]);

      // ── Step 4: Write ALL rows back (preserves entire history) ────────────
      const worksheet = XLSX.utils.aoa_to_sheet(rows);
      const workbook  = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
      XLSX.writeFile(workbook, filePath);

      this.logger.log(
        `📊 Lead saved to Excel — total data rows: ${rows.length - 1} | path: ${filePath}`,
      );
      return true;
    } catch (err: any) {
      this.logger.error(`❌ Excel append failed: ${err?.message ?? err}`);
      return false;
    }
  }

  // ── Database Persistence ──────────────────────────────────────────────────────

  /**
   * Persists the lead to the SQLite database using a raw INSERT statement.
   *
   * Uses `$executeRaw` (available on the existing PrismaClient without re-running
   * `prisma generate`) so the Lead table is written to without requiring new
   * generated model types.  Survives server restarts, redeploys, and accidental
   * deletion of leads.xlsx.
   */
  async persistToDb(data: LeadData): Promise<void> {
    // Generate a cuid-like unique id using timestamp + random suffix
    const id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const name    = data.name    || 'N/A';
    const company = data.company || 'N/A';
    const contact = data.contact || 'N/A';
    const place   = data.place   || 'N/A';
    const service = data.service || 'N/A';

    try {
      await this.prisma.$executeRaw`
        INSERT INTO "Lead" ("id", "name", "company", "contact", "place", "service", "createdAt")
        VALUES (${id}, ${name}, ${company}, ${contact}, ${place}, ${service}, datetime('now'))
      `;
      this.logger.log(`🗄️  Lead persisted to SQLite DB (id: ${id}, name: ${name})`);
    } catch (err: any) {
      this.logger.error(`❌ DB lead persistence failed: ${err?.message ?? err}`);
      // Do NOT re-throw — a DB failure must never abort the Excel write
    }
  }

  // ── Admin WhatsApp Notification ───────────────────────────────────────────────

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

  // ── Combined Entry Point ──────────────────────────────────────────────────────

  /**
   * Saves the lead through all three persistence channels concurrently:
   *   1. Appends to `leads.xlsx`  (cumulative, never-erasing)
   *   2. Inserts into SQLite DB   (durable across restarts / redeploys)
   *   3. Sends WhatsApp alert to admin
   *
   * A failure in any one channel is logged but does NOT block the others.
   * Returns `true` if the Excel write succeeded (primary storage).
   */
  async saveLead(data: LeadData): Promise<boolean> {
    const [excelOk] = await Promise.all([
      this.appendLead(data),
      this.persistToDb(data),
      this.notifyAdmin(data).catch((err) =>
        this.logger.error(
          `❌ Admin notification failed: ${(err as Error)?.message ?? err}`,
        ),
      ),
    ]);
    return excelOk;
  }
}
