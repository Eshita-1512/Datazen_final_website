import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import formidable from "formidable";
import fs from "fs";

// ─── Vercel config: disable built-in body parser so formidable can read the stream ───
export const config = {
  api: { bodyParser: false },
};

// ─── Google Auth ──────────────────────────────────────────────────────────────
async function getAuth() {
  const jsonCreds =
    process.env.GOOGLE_DRIVE_CREDENTIALS ||
    process.env.GOOGLE_SHEETS_CREDENTIALS;
  if (jsonCreds) {
    const credentials = JSON.parse(jsonCreds);
    return new google.auth.GoogleAuth({
      credentials,
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive.readonly",
      ],
    });
  }
  return null;
}

// ─── Google Drive image fetching (same logic as original api/index.ts) ────────
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
  datathon: "1d3pPkDpSb2YtwxGnTvmb5DqMhfYlCvGF",
  "datathon-2026": "1d3pPkDpSb2YtwxGnTvmb5DqMhfYlCvGF",
  datatrek: "1YWZ1QMn-ze39jaBSReRl8EIjz7ASsssu",
  "data-trek": "1YWZ1QMn-ze39jaBSReRl8EIjz7ASsssu",
  zenconnect: "1SjUMDrodFhu-rewYj8s4ytkgC_HnoKVs",
  "zenconnect-25": "1SjUMDrodFhu-rewYj8s4ytkgC_HnoKVs",
  "zenconnect-26": "1SjUMDrodFhu-rewYj8s4ytkgC_HnoKVs",
  "zenconnect-2026": "1SjUMDrodFhu-rewYj8s4ytkgC_HnoKVs",
};

function getFolderId(slug: string): string | undefined {
  const normalized = slug.toLowerCase().trim();
  if (normalized.includes("case-study"))
    return process.env.GOOGLE_DRIVE_FOLDER_CASE_STUDY || DEFAULT_EVENT_FOLDER_MAP["case-study"];
  if (normalized.includes("datathon"))
    return process.env.GOOGLE_DRIVE_FOLDER_DATATHON || DEFAULT_EVENT_FOLDER_MAP["datathon"];
  if (normalized.includes("trek"))
    return process.env.GOOGLE_DRIVE_FOLDER_DATATREK || DEFAULT_EVENT_FOLDER_MAP["datatrek"];
  if (normalized.includes("zenconnect"))
    return process.env.GOOGLE_DRIVE_FOLDER_ZENCONNECT || DEFAULT_EVENT_FOLDER_MAP["zenconnect"];
  return DEFAULT_EVENT_FOLDER_MAP[normalized];
}

const imageCache = new Map<string, { time: number; data: DriveImageFile[] }>();
const CACHE_TTL_MS = 60 * 1000;

async function fetchImagesForFolder(folderId: string): Promise<DriveImageFile[]> {
  const cached = imageCache.get(folderId);
  if (cached && Date.now() - cached.time < CACHE_TTL_MS) return cached.data;

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return [];

  const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
  const fields = encodeURIComponent("files(id, name, mimeType, thumbnailLink, webViewLink)");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&pageSize=50&supportsAllDrives=true&includeItemsFromAllDrives=true&key=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) return [];

  const json = await res.json();
  const files = json.files || [];
  const images: DriveImageFile[] = files
    .filter((f: any) => {
      const mime = (f.mimeType || "").toLowerCase();
      const name = (f.name || "").toLowerCase();
      return mime.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|heic|heif)$/i.test(name);
    })
    .map((f: any) => {
      const fileId = f.id;
      return {
        id: fileId,
        name: f.name || "Event Image",
        imageUrl: f.thumbnailLink
          ? f.thumbnailLink.replace(/=s\d+/, "=w1000")
          : `https://lh3.googleusercontent.com/d/${fileId}=w1000`,
        thumbnailUrl: f.thumbnailLink
          ? f.thumbnailLink.replace(/=s\d+/, "=w600")
          : `https://lh3.googleusercontent.com/d/${fileId}=w600`,
        webViewLink: f.webViewLink || `https://drive.google.com/file/d/${fileId}/view`,
        mimeType: f.mimeType || "image/jpeg",
      };
    });

  imageCache.set(folderId, { time: Date.now(), data: images });
  return images;
}

// ─── AWS S3 Upload ────────────────────────────────────────────────────────────
async function uploadToS3(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string | null> {
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
    console.error("Missing AWS credentials in environment variables");
    return null;
  }

  const s3 = new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });

  const timestamp = Date.now();
  const cleanName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const objectKey = `resumes/${timestamp}-${cleanName}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: fileBuffer,
      ContentType: mimeType,
      ContentDisposition: "inline",
    })
  );

  return `https://${bucketName}.s3.${region}.amazonaws.com/${objectKey}`;
}

// ─── Google Sheets append ─────────────────────────────────────────────────────
async function ensureSheetExists(sheets: any, spreadsheetId: string, sheetName: string, headers: string[]) {
  try {
    const resp = await sheets.spreadsheets.get({ spreadsheetId });
    const exists = resp.data.sheets?.some((s: any) => s.properties?.title === sheetName);
    if (!exists) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: { requests: [{ addSheet: { properties: { title: sheetName } } }] },
      });
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [headers] },
      });
    }
  } catch (e) {
    console.error("ensureSheetExists error:", e);
  }
}

async function appendRecruitmentToSheets(data: Record<string, any>): Promise<boolean> {
  const auth = await getAuth();
  if (!auth) return false;

  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  if (!spreadsheetId) return false;

  const sheetName = "First Year Recruitment";
  const headers = [
    "Timestamp", "Full Name", "Email", "Phone", "College / Branch",
    "Year of Study", "Preference 1", "Preference 2",
    "About Yourself", "Why Join DataZen", "Resume Link",
  ];

  const sheets = google.sheets({ version: "v4", auth });
  await ensureSheetExists(sheets, spreadsheetId, sheetName, headers);

  const row = [
    new Date().toISOString(),
    data.name, data.email, data.phone, data.college, data.year,
    data.preference1, data.preference2, data.aboutSelf, data.whyJoin,
    data.resumeUrl || "",
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });

  return true;
}

async function appendContactToSheets(data: Record<string, any>): Promise<boolean> {
  const auth = await getAuth();
  if (!auth) return false;
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  if (!spreadsheetId) return false;

  const sheetName = "Contact Messages";
  const headers = ["Name", "Email", "Subject", "Message", "Created At"];
  const sheets = google.sheets({ version: "v4", auth });
  await ensureSheetExists(sheets, spreadsheetId, sheetName, headers);

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[data.name, data.email, data.subject, data.message, new Date().toISOString()]],
    },
  });
  return true;
}

// ─── Parse multipart form with formidable ─────────────────────────────────────
function parseForm(req: VercelRequest): Promise<{ fields: Record<string, string>; fileBuffer: Buffer | null; fileName: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const form = formidable({ maxFileSize: 10 * 1024 * 1024 }); // 10 MB limit
    form.parse(req as any, (err, fields, files) => {
      if (err) return reject(err);

      // Flatten fields (formidable v3+ returns arrays)
      const flat: Record<string, string> = {};
      for (const [k, v] of Object.entries(fields)) {
        flat[k] = Array.isArray(v) ? v[0] : (v as string);
      }

      const resumeFile = files.resume
        ? (Array.isArray(files.resume) ? files.resume[0] : files.resume)
        : null;

      if (resumeFile && resumeFile.filepath) {
        const buffer = fs.readFileSync(resumeFile.filepath);
        resolve({
          fields: flat,
          fileBuffer: buffer,
          fileName: resumeFile.originalFilename || "resume",
          mimeType: resumeFile.mimetype || "application/octet-stream",
        });
      } else {
        resolve({ fields: flat, fileBuffer: null, fileName: "", mimeType: "" });
      }
    });
  });
}

// ─── Main handler ─────────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname;

  try {
    // ── GET /api/events/:slug/images ──────────────────────────────────────────
    const eventMatch = pathname.match(/^\/api\/events\/([^/]+)\/images\/?$/);
    if (eventMatch && req.method === "GET") {
      const slug = decodeURIComponent(eventMatch[1]);
      const folderId = getFolderId(slug);
      if (!folderId) return res.status(404).json({ success: false, images: [] });
      const images = await fetchImagesForFolder(folderId);
      res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
      return res.status(200).json({ success: true, event: slug, count: images.length, images });
    }

    // ── POST /api/recruitment ─────────────────────────────────────────────────
    if (pathname === "/api/recruitment" && req.method === "POST") {
      const { fields, fileBuffer, fileName, mimeType } = await parseForm(req);

      // Validate required fields
      const required = ["name", "email", "phone", "college", "preference1", "preference2", "aboutSelf", "whyJoin"];
      for (const f of required) {
        if (!fields[f]) return res.status(400).json({ success: false, message: `Missing required field: ${f}` });
      }

      // Upload resume to S3 if provided
      let resumeUrl = "";
      if (fileBuffer) {
        const uploaded = await uploadToS3(fileBuffer, `${fields.name}-Resume-${fileName}`, mimeType);
        if (uploaded) resumeUrl = uploaded;
      }

      // Save to Google Sheets
      await appendRecruitmentToSheets({ ...fields, resumeUrl });

      return res.status(201).json({ success: true, message: "Application submitted successfully! We'll be in touch soon." });
    }

    // ── POST /api/contact ─────────────────────────────────────────────────────
    if (pathname === "/api/contact" && req.method === "POST") {
      const body = req.body as Record<string, string>;
      if (!body?.name || !body?.email || !body?.message) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }
      await appendContactToSheets(body);
      return res.status(201).json({ success: true, message: "Message received successfully" });
    }

    // ── GET /api/health ───────────────────────────────────────────────────────
    if (pathname === "/api/health") {
      return res.status(200).json({ status: "ok", time: new Date().toISOString() });
    }

    return res.status(404).json({ success: false, message: "API Route Not Found" });
  } catch (err: any) {
    console.error("Vercel API error:", err);
    return res.status(500).json({ success: false, message: err?.message || "Internal Server Error" });
  }
}
