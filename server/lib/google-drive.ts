import { google } from 'googleapis';
import { getGoogleAuth } from './google-auth';
import https from 'https';
import { URL } from 'url';
import { Readable } from 'stream';

export interface DriveImageFile {
  id: string;
  name: string;
  imageUrl: string;
  thumbnailUrl: string;
  webViewLink: string;
  mimeType?: string;
}

const DEFAULT_EVENT_FOLDER_MAP: Record<string, string> = {
  "case-study": "1D1W-kePGSxwUratRYWl7dqeHDEiVt-RK",
  "case-study-competition": "1D1W-kePGSxwUratRYWl7dqeHDEiVt-RK",
  "datathon": "1d3pPkDpSb2YtwxGnTvmb5DqMhfYlCvGF",
  "datathon-2026": "1d3pPkDpSb2YtwxGnTvmb5DqMhfYlCvGF",
  "datatrek": "1YWZ1QMn-ze39jaBSReRl8EIjz7ASsssu",
  "data-trek": "1YWZ1QMn-ze39jaBSReRl8EIjz7ASsssu",
  "zenconnect": "1SjUMDrodFhu-rewYj8s4ytkgC_HnoKVs",
  "zenconnect-25": "1SjUMDrodFhu-rewYj8s4ytkgC_HnoKVs",
  "zenconnect-26": "1SjUMDrodFhu-rewYj8s4ytkgC_HnoKVs",
  "zenconnect-2026": "1SjUMDrodFhu-rewYj8s4ytkgC_HnoKVs",
};

// 30-second memory cache for quick Google Drive sync
interface CacheEntry {
  timestamp: number;
  data: DriveImageFile[];
}

const imageCache: Map<string, CacheEntry> = new Map();
const CACHE_TTL_MS = 30 * 1000;

export function getFolderIdForEvent(eventSlug: string): string | undefined {
  const normalized = eventSlug.toLowerCase().trim();

  if (normalized.includes("case-study")) {
    return process.env.GOOGLE_DRIVE_FOLDER_CASE_STUDY || DEFAULT_EVENT_FOLDER_MAP["case-study"];
  }
  if (normalized.includes("datathon")) {
    return process.env.GOOGLE_DRIVE_FOLDER_DATATHON || DEFAULT_EVENT_FOLDER_MAP["datathon"];
  }
  if (normalized.includes("trek")) {
    return process.env.GOOGLE_DRIVE_FOLDER_DATATREK || DEFAULT_EVENT_FOLDER_MAP["datatrek"];
  }
  if (normalized.includes("zenconnect")) {
    return process.env.GOOGLE_DRIVE_FOLDER_ZENCONNECT || DEFAULT_EVENT_FOLDER_MAP["zenconnect"];
  }

  return DEFAULT_EVENT_FOLDER_MAP[normalized];
}

export async function fetchEventImages(eventSlug: string): Promise<DriveImageFile[]> {
  const folderId = getFolderIdForEvent(eventSlug);
  if (!folderId) {
    console.warn(`No Google Drive folder ID mapped for event slug: "${eventSlug}"`);
    return [];
  }

  // Check cache
  const cached = imageCache.get(folderId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const auth = await getGoogleAuth();
  if (!auth) {
    console.warn("Unable to authenticate with Google API. No service account or API Key found.");
    return [];
  }

  try {
    let allFiles: any[] = [];

    // If auth is an API Key string, use direct REST fetch
    if (typeof auth === 'string') {
      const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
      const fields = encodeURIComponent('files(id, name, mimeType, thumbnailLink, webViewLink)');
      const apiUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&pageSize=50&supportsAllDrives=true&includeItemsFromAllDrives=true&key=${auth}`;

      const resp = await fetch(apiUrl);
      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`Google Drive API returned ${resp.status}: ${errText}`);
      }
      const data = await resp.json();
      allFiles = data.files || [];
    } else {
      // Service account auth client
      const drive = google.drive({ version: 'v3', auth });
      const res: any = await drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType, thumbnailLink, webViewLink)',
        pageSize: 50,
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
      });
      allFiles = res.data.files || [];
    }

    // Filter to images & HEIC/HEIF photos
    const imageFiles = allFiles.filter((file: any) => {
      const mime = (file.mimeType || '').toLowerCase();
      const name = (file.name || '').toLowerCase();
      return (
        mime.startsWith('image/') ||
        /\.(jpg|jpeg|png|gif|webp|heic|heif)$/i.test(name)
      );
    });

    const images: DriveImageFile[] = imageFiles.map((file: any) => {
      const fileId = file.id || '';
      // Direct high-res Google CDN thumbnail URLs
      const highResUrl = file.thumbnailLink 
        ? file.thumbnailLink.replace(/=s\d+/, '=w1000') 
        : `https://lh3.googleusercontent.com/d/${fileId}=w1000`;
      
      const thumbUrl = file.thumbnailLink 
        ? file.thumbnailLink.replace(/=s\d+/, '=w600') 
        : `https://lh3.googleusercontent.com/d/${fileId}=w600`;

      return {
        id: fileId,
        name: file.name || 'Event Image',
        imageUrl: highResUrl,
        thumbnailUrl: thumbUrl,
        webViewLink: file.webViewLink || `https://drive.google.com/file/d/${fileId}/view`,
        mimeType: file.mimeType || 'image/jpeg',
      };
    });

    console.log(`[Google Drive] Loaded ${images.length} images for event "${eventSlug}" (Folder: ${folderId})`);

    // Update cache
    imageCache.set(folderId, {
      timestamp: Date.now(),
      data: images,
    });

    return images;
  } catch (error: any) {
    console.error(`[Google Drive] Error fetching images for folder ${folderId} (slug "${eventSlug}"):`, error?.message || error);
    return [];
  }
}

// Helper to follow HTTP redirects for streaming thumbnails
function getStreamWithRedirects(url: string, maxRedirects = 5): Promise<{ stream: any; mimeType: string } | null> {
  return new Promise((resolve) => {
    function request(currentUrl: string, redirectsRemaining: number) {
      if (redirectsRemaining <= 0) {
        console.warn("Too many redirects fetching Drive image stream");
        resolve(null);
        return;
      }
      https.get(currentUrl, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          let nextUrl = res.headers.location;
          if (nextUrl.startsWith('/')) {
            const parsed = new URL(currentUrl);
            nextUrl = `${parsed.protocol}//${parsed.host}${nextUrl}`;
          }
          request(nextUrl, redirectsRemaining - 1);
          return;
        }
        if (res.statusCode === 200) {
          resolve({
            stream: res,
            mimeType: (res.headers['content-type'] as string) || 'image/jpeg',
          });
        } else {
          console.warn(`Drive image stream returned HTTP ${res.statusCode} for ${currentUrl}`);
          resolve(null);
        }
      }).on('error', (err) => {
        console.error("Error fetching thumbnail stream:", err);
        resolve(null);
      });
    }
    request(url, maxRedirects);
  });
}

// Proxy stream Google Drive image converted as JPEG directly to browser
export async function fetchDriveImageStream(fileId: string): Promise<{ stream: any; mimeType: string } | null> {
  const auth = await getGoogleAuth();
  if (!auth) return null;

  try {
    const highResThumbUrl = `https://lh3.googleusercontent.com/d/${fileId}=w1000`;
    const streamRes = await getStreamWithRedirects(highResThumbUrl);
    if (streamRes) {
      return streamRes;
    }

    if (typeof auth !== 'string') {
      const drive = google.drive({ version: 'v3', auth });
      const media: any = await drive.files.get(
        { fileId, alt: 'media', supportsAllDrives: true },
        { responseType: 'stream' }
      );
      return {
        stream: media.data,
        mimeType: 'image/jpeg',
      };
    }

    return null;
  } catch (error: any) {
    console.error(`Error streaming file ${fileId} from Google Drive:`, error?.message || error);
    return null;
  }
}

export async function uploadResumeToDrive(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string | null> {
  try {
    const auth = await getGoogleAuth();
    if (!auth || typeof auth === 'string') {
      console.error("Valid Service Account authentication is required for file uploads");
      return null;
    }
    const drive = google.drive({ version: 'v3', auth });

    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    if (!folderId) {
      console.error("GOOGLE_DRIVE_FOLDER_ID is not set in .env");
      return null;
    }

    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };

    const media = {
      mimeType: mimeType,
      body: Readable.from(fileBuffer),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    // Make the file publicly accessible so the link works for anyone with it
    if (response.data.id) {
      await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
    }

    return response.data.webViewLink || null;
  } catch (error) {
    console.error("Error uploading file to Google Drive:", error);
    return null;
  }
}
