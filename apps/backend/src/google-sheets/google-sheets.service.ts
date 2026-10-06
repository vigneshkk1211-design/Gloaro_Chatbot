import { Injectable, Logger } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';

export interface LeadData {
  name: string;
  company: string;
  contact: string;
  place: string;
  service: string;
  timestamp?: string;
}

@Injectable()
export class GoogleSheetsService {
  private readonly logger = new Logger(GoogleSheetsService.name);
  private sheets: sheets_v4.Sheets | null = null;
  private spreadsheetId: string | null = null;

  constructor() {
    this.initSheetsClient();
  }

  private initSheetsClient() {
    const rawSpreadsheetId = process.env.GOOGLE_SHEET_ID;
    const rawClientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY;

    const spreadsheetId = (rawSpreadsheetId || '').trim().replace(/^["']|["']$/g, '');
    const clientEmail = (rawClientEmail || '').trim().replace(/^["']|["']$/g, '');

    if (!spreadsheetId || !rawPrivateKey || !clientEmail) {
      this.spreadsheetId = spreadsheetId || null;
      return;
    }

    try {
      const cleanedKey = rawPrivateKey.trim().replace(/^["']|["']$/g, '').replace(/\\n/g, '\n');
      const auth = new google.auth.JWT({
        email: clientEmail,
        key: cleanedKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth });
      this.spreadsheetId = spreadsheetId;
      this.logger.log(`✅ Google Sheets client initialized for Sheet ID: ${spreadsheetId}`);
    } catch (error: any) {
      this.logger.error('❌ Failed to initialize Google Sheets client:', error?.message ?? error);
    }
  }

  /**
   * Transports email notification using Nodemailer SMTP settings.
   */
  private async sendLeadEmail(data: LeadData, timestamp: string): Promise<boolean> {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const recipient = process.env.NOTIFICATION_EMAIL || 'info@gloaro.com';

    const subject = `🚀 New Lead Captured - ${data.service} from ${data.name}`;

    const textBody = [
      `🚀 NEW LEAD CAPTURED VIA WHATSAPP BOT`,
      `------------------------------------`,
      `Name: ${data.name}`,
      `Company: ${data.company}`,
      `Contact: ${data.contact}`,
      `Place: ${data.place}`,
      `Service: ${data.service}`,
      `Timestamp: ${timestamp}`,
    ].join('\n');

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #25D366; margin-top: 0;">🚀 New Lead Captured via WhatsApp Bot</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 30%;">Name</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Company Name</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${data.company}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Contact Details</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${data.contact}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Place / Location</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${data.place}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Requested Service</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${data.service}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Timestamp</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${timestamp}</td>
          </tr>
        </table>
        <p style="margin-top: 20px; font-size: 12px; color: #888;">GLOARO PVT LTD WhatsApp Automation System</p>
      </div>
    `;

    if (!user || !pass) {
      this.logger.log(`📧 [Simulated Email Notification] SMTP credentials not set (SMTP_USER/SMTP_PASS).`);
      this.logger.log(`📧 Notification Target: ${recipient} | Subject: ${subject}`);
      return false;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });

      await transporter.sendMail({
        from: `"GLOARO Bot Leads" <${user}>`,
        to: recipient,
        subject,
        text: textBody,
        html: htmlBody,
      });

      this.logger.log(`✅ Email notification sent to ${recipient} for lead: "${data.name}" (${data.service})`);
      return true;
    } catch (err: any) {
      this.logger.error(`❌ Failed to send email notification to ${recipient}:`, err?.message ?? err);
      return false;
    }
  }

  /**
   * Appends lead to Email Notification & Google Sheets storage.
   */
  async appendLead(data: LeadData): Promise<boolean> {
    const timestamp =
      data.timestamp ||
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // 1. Send Email Notification via Nodemailer
    await this.sendLeadEmail(data, timestamp);

    // 2. Append row to Google Sheets if configured
    if (!this.sheets || !this.spreadsheetId) {
      this.initSheetsClient();
    }

    const rowValues = [
      data.name || 'N/A',
      data.company || 'N/A',
      data.contact || 'N/A',
      data.place || 'N/A',
      data.service || 'N/A',
      timestamp,
    ];

    if (!this.sheets || !this.spreadsheetId) {
      this.logger.log(`📝 [Logged Lead Record]: ${JSON.stringify(data)}`);
      return true;
    }

    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'A:F',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [rowValues],
        },
      });
      this.logger.log(`✅ Lead appended to Google Sheet (A:F): "${data.name}" | "${data.company}" | "${data.contact}" | "${data.place}" | "${data.service}"`);
      return true;
    } catch (error: any) {
      // Dynamic Tab Title Fallback if default range 'A:F' fails
      try {
        const spreadsheetInfo = await this.sheets.spreadsheets.get({
          spreadsheetId: this.spreadsheetId,
        });
        const firstTabTitle = spreadsheetInfo.data.sheets?.[0]?.properties?.title || 'Sheet1';
        const dynamicRange = `'${firstTabTitle}'!A:F`;

        await this.sheets.spreadsheets.values.append({
          spreadsheetId: this.spreadsheetId,
          range: dynamicRange,
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: {
            values: [rowValues],
          },
        });
        this.logger.log(`✅ Lead appended to Google Sheet tab "${firstTabTitle}" (${dynamicRange}): "${data.name}" | "${data.company}" | "${data.contact}" | "${data.place}" | "${data.service}"`);
        return true;
      } catch (fallbackErr: any) {
        this.logger.error(`❌ Google Sheets append status:`, fallbackErr?.response?.data ?? fallbackErr?.message ?? error);
        this.logger.log(`📋 Fallback lead log: ${JSON.stringify(data)}`);
        return true;
      }
    }
  }
}
