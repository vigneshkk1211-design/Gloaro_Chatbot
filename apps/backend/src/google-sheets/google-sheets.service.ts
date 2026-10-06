import { Injectable, Logger } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';

export interface LeadData {
  name: string;
  company: string;
  contact: string;
  service: string;
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
    const spreadsheetId =
      process.env.GOOGLE_SHEET_ID || '1k725Gyx3rT9l_ycbddjlliAzbNPMVNeV2YWuHMY84';
    const clientEmail =
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
      'gloaro-whatsapp-bot@eighth-epigram-480204-k6.iam.gserviceaccount.com';
    const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!rawPrivateKey) {
      this.logger.warn(
        '⚠️ GOOGLE_PRIVATE_KEY is missing. Lead capture will log leads locally until private key is configured.',
      );
      this.spreadsheetId = spreadsheetId;
      return;
    }

    try {
      const privateKey = rawPrivateKey.replace(/\\n/g, '\n');
      const auth = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
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
   * Row format: [Name, Company Name, Contact Details, Service Name, Timestamp]
   */
  async appendLead(data: LeadData): Promise<boolean> {
    if (!this.sheets || !this.spreadsheetId) {
      this.initClient();
    }

    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const rowValues = [
      data.name || 'N/A',
      data.company || 'N/A',
      data.contact || 'N/A',
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
        range: 'Sheet1!A:E',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [rowValues],
        },
      });
      this.logger.log(`✅ Lead appended to Google Sheet (Sheet1!A:E): "${data.name}" | "${data.company}" | "${data.contact}" | "${data.service}"`);
      return true;
    } catch (error: any) {
      this.logger.error('❌ Failed to append lead to Google Sheet:', error?.response?.data ?? error?.message ?? error);
      // Fallback: log so lead is not lost
      this.logger.log(`📋 Lead fallback log: ${JSON.stringify(data)}`);
      return false;
    }
  }
}
