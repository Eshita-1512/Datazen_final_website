import type { IncomingMessage, ServerResponse } from 'http';

interface DriveImageFile {
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

function getFolderId(slug: string): string | undefined {
  const normalized = slug.toLowerCase().trim();
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

// In-memory cache for Vercel lambdas
const cache = new Map<string, { time: number; data: DriveImageFile[] }>();
const CACHE_TTL_MS = 60 * 1000;

async function fetchImagesForFolder(folderId: string): Promise<DriveImageFile[]> {
  const cached = cache.get(folderId);
  if (cached && Date.now() - cached.time < CACHE_TTL_MS) {
    return cached.data;
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.warn("GOOGLE_API_KEY is not set in environment variables");
    return [];
  }

  const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
  const fields = encodeURIComponent('files(id, name, mimeType, thumbnailLink, webViewLink)');
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&pageSize=50&supportsAllDrives=true&includeItemsFromAllDrives=true&key=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) {
    const txt = await res.text();
    console.error(`Google Drive API returned HTTP ${res.status}:`, txt);
    return [];
  }

  const json = await res.json();
  const files = json.files || [];

  const images: DriveImageFile[] = files
    .filter((f: any) => {
      const mime = (f.mimeType || '').toLowerCase();
      const name = (f.name || '').toLowerCase();
      return mime.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|heic|heif)$/i.test(name);
    })
    .map((f: any) => {
      const fileId = f.id;
      const highResUrl = f.thumbnailLink 
        ? f.thumbnailLink.replace(/=s\d+/, '=w1000') 
        : `https://lh3.googleusercontent.com/d/${fileId}=w1000`;
      const thumbUrl = f.thumbnailLink 
        ? f.thumbnailLink.replace(/=s\d+/, '=w600') 
        : `https://lh3.googleusercontent.com/d/${fileId}=w600`;

      return {
        id: fileId,
        name: f.name || 'Event Image',
        imageUrl: highResUrl,
        thumbnailUrl: thumbUrl,
        webViewLink: f.webViewLink || `https://drive.google.com/file/d/${fileId}/view`,
        mimeType: f.mimeType || 'image/jpeg',
      };
    });

  cache.set(folderId, { time: Date.now(), data: images });
  return images;
}

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  try {
    // Match /api/events/:slug/images
    const eventMatch = pathname.match(/^\/api\/events\/([^/]+)\/images\/?$/);
    if (eventMatch && req.method === 'GET') {
      const slug = decodeURIComponent(eventMatch[1]);
      const folderId = getFolderId(slug);

      if (!folderId) {
        return res.status(404).json({
          success: false,
          message: `No Google Drive folder mapped for event "${slug}"`,
          images: [],
        });
      }

      const images = await fetchImagesForFolder(folderId);

      res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
      return res.status(200).json({
        success: true,
        event: slug,
        count: images.length,
        images,
      });
    }

    // Health check
    if (pathname === '/api/health') {
      return res.status(200).json({ status: 'ok', time: new Date().toISOString() });
    }

    return res.status(404).json({ success: false, message: 'API Route Not Found' });
  } catch (err: any) {
    console.error('Vercel API error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err?.message || String(err),
    });
  }
}
