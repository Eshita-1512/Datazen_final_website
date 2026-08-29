import { google } from 'googleapis';
import { getGoogleAuth } from './google-auth';
import https from 'https';

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

  if (normalized.includes("case-study") && process.env.GOOGLE_DRIVE_FOLDER_CASE_STUDY) {
    return process.env.GOOGLE_DRIVE_FOLDER_CASE_STUDY;
  }
  if (normalized.includes("datathon") && process.env.GOOGLE_DRIVE_FOLDER_DATATHON) {
    return process.env.GOOGLE_DRIVE_FOLDER_DATATHON;
  }
  if (normalized.includes("trek") && process.env.GOOGLE_DRIVE_FOLDER_DATATREK) {
    return process.env.GOOGLE_DRIVE_FOLDER_DATATREK;
  }
  if (normalized.includes("zenconnect") && process.env.GOOGLE_DRIVE_FOLDER_ZENCONNECT) {
    return process.env.GOOGLE_DRIVE_FOLDER_ZENCONNECT;
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
    const driveOptions: any = { version: 'v3' };
    if (typeof auth === 'string') {
      driveOptions.auth = auth;
    } else {
      driveOptions.auth = auth;
    }

    const drive = google.drive(driveOptions);
    
    const res: any = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType, thumbnailLink, webViewLink, webContentLink)',
      pageSize: 50,
    } as any);

    const allFiles: any[] = res.data.files || [];

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
      // Use local server proxy URL to guarantee JPEG conversion and CORS safety
      const proxyUrl = `/api/drive/image/${fileId}`;
      const cdnUrl = file.thumbnailLink ? file.thumbnailLink.replace(/=s\d+/, '=s1000') : proxyUrl;

      return {
        id: fileId,
        name: file.name || 'Event Image',
        imageUrl: proxyUrl,
        thumbnailUrl: cdnUrl,
        webViewLink: file.webViewLink || `https://drive.google.com/file/d/${fileId}/view`,
        mimeType: file.mimeType || 'image/jpeg',
      };
    });

    // Update cache
    imageCache.set(folderId, {
      timestamp: Date.now(),
      data: images,
    });

    return images;
  } catch (error: any) {
    console.error(`Error fetching images from Google Drive folder ${folderId}:`, error?.message || error);
    return [];
  }
}

// Proxy stream Google Drive image converted as JPEG directly to browser
export async function fetchDriveImageStream(fileId: string): Promise<{ stream: any; mimeType: string } | null> {
  const auth = await getGoogleAuth();
  if (!auth) return null;

  try {
    const driveOptions: any = { version: 'v3' };
    if (typeof auth === 'string') {
      driveOptions.auth = auth;
    } else {
      driveOptions.auth = auth;
    }

    const drive = google.drive(driveOptions);

    const meta: any = await drive.files.get({
      fileId,
      fields: 'thumbnailLink, mimeType',
    });

    const rawThumb = meta.data.thumbnailLink;
    if (rawThumb) {
      const highResThumbUrl = rawThumb.replace(/=s\d+/, '=s1000');
      
      return new Promise((resolve) => {
        https.get(highResThumbUrl, (res) => {
          if (res.statusCode === 200) {
            resolve({
              stream: res,
              mimeType: 'image/jpeg',
            });
          } else {
            resolve(null);
          }
        }).on('error', (err) => {
          console.error("Error fetching thumbnail stream:", err);
          resolve(null);
        });
      });
    }

    // Fallback if no thumbnailLink
    const media: any = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    return {
      stream: media.data,
      mimeType: meta.data.mimeType || 'image/jpeg',
    };
  } catch (error: any) {
    console.error(`Error streaming file ${fileId} from Google Drive:`, error?.message || error);
    return null;
  }
}
