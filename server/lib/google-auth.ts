import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.file', // Added for uploading resumes
];

let authClientInstance: any = null;

export async function getGoogleAuth(): Promise<any> {
  if (authClientInstance) {
    return authClientInstance;
  }

  try {
    // 1. Check environment variable with Service Account JSON string
    const jsonCreds = process.env.GOOGLE_DRIVE_CREDENTIALS || process.env.GOOGLE_SHEETS_CREDENTIALS;
    if (jsonCreds) {
      try {
        const credentials = JSON.parse(jsonCreds);
        authClientInstance = new google.auth.GoogleAuth({
          credentials,
          scopes: SCOPES,
        });
        return authClientInstance;
      } catch (e) {
        console.error("Failed to parse Google credentials JSON from env:", e);
      }
    }

    // 2. Check file path from env or default 'google-credentials.json'
    const keyFilePath =
      process.env.GOOGLE_CREDENTIALS_PATH ||
      process.env.GOOGLE_SHEETS_CREDENTIALS_PATH ||
      'google-credentials.json';

    const resolvedPath = path.resolve(process.cwd(), keyFilePath);

    if (fs.existsSync(resolvedPath)) {
      authClientInstance = new google.auth.GoogleAuth({
        keyFile: resolvedPath,
        scopes: SCOPES,
      });
      return authClientInstance;
    }

    // 3. Fallback to API Key string
    const apiKey = process.env.GOOGLE_API_KEY;
    if (apiKey) {
      return apiKey;
    }

    console.warn("No Google Auth credentials or API Key found.");
    return null;
  } catch (error) {
    console.error("Error initializing Google Auth:", error);
    return null;
  }
}
