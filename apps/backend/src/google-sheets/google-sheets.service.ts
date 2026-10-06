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
    this.initClient();
  }

  private initClient() {
    const rawSpreadsheetId =
      process.env.GOOGLE_SHEET_ID || '1k725Gyx3rT9l_ycbddjlliAzbNPMVNeV2YWuHMY84';
    const rawClientEmail =
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
      'gloaro-whatsapp-bot@eighth-epigram-480204-k6.iam.gserviceaccount.com';
    const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY;

    const spreadsheetId = (rawSpreadsheetId || '').trim().replace(/^["']|["']$/g, '');
    const clientEmail = (rawClientEmail || '').trim().replace(/^["']|["']$/g, '');

    if (!rawPrivateKey) {
      this.logger.warn(
        '⚠️ GOOGLE_PRIVATE_KEY is missing. Lead capture will log leads locally until private key is configured.',
      );
      this.spreadsheetId = spreadsheetId;
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
      this.logger.log(`✅ Google Sheets client initialized successfully for Sheet ID: ${spreadsheetId}`);
    } catch (error: any) {
      this.logger.error('❌ Failed to initialize Google Sheets client:', error?.message ?? error);
    }
  }

  /**
   * Appends a new lead row into the Google Sheet.
   * Row format: [Name, Company Name, Contact Details, Place / Location, Service Name, Timestamp]
   * Range: 'A:F' (appends automatically across columns A through F)
   */
  async appendLead(data: LeadData): Promise<boolean> {
    if (!this.sheets || !this.spreadsheetId) {
      this.initClient();
    }

    const timestamp =
      data.timestamp ||
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const rowValues = [
      data.name || 'N/A',
      data.company || 'N/A',
      data.contact || 'N/A',
      data.place || 'N/A',
      data.service || 'N/A',
      timestamp,
    ];

    if (!this.sheets || !this.spreadsheetId) {
      this.logger.log(`📝 [Simulated Lead Capture] Google Sheets not connected (missing private key). Record: ${JSON.stringify(data)}`);
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
      console.error('❌ Google Sheets API Append Error:', error?.response?.data ?? error?.message ?? error);
      this.logger.error('❌ Failed to append lead to Google Sheet:', error?.response?.data ?? error?.message ?? error);

      if (error?.response?.status === 404 || error?.message?.includes('404')) {
        this.logger.error(
          `💡 404 Troubleshooting: Please verify:
1. The Google Sheet exists and its ID (${this.spreadsheetId}) is correct.
2. The Service Account email (${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || 'gloaro-whatsapp-bot@eighth-epigram-480204-k6.iam.gserviceaccount.com'}) has been added as an 'Editor' in the Google Sheet's 'Share' settings.`,
        );
      }

      // Fallback: log so lead is not lost
      this.logger.log(`📋 Lead fallback log: ${JSON.stringify(data)}`);
      return false;
    }
  }
}
