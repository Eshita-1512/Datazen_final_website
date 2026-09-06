import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_S3_BUCKET_NAME;

const s3Client = new S3Client({
  region: region || "ap-south-1",
  credentials: {
    accessKeyId: accessKeyId || "",
    secretAccessKey: secretAccessKey || "",
  },
});

/**
 * Uploads a file buffer to AWS S3 and returns the public URL.
 */
export async function uploadResumeToS3(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string | null> {
  if (!bucketName || !accessKeyId || !secretAccessKey) {
    console.error("AWS S3 credentials or bucket name are missing from .env");
    return null;
  }

  try {
    // Generate a unique object key to avoid overwriting files with the same name
    const timestamp = Date.now();
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const objectKey = `resumes/${timestamp}-${cleanFileName}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: fileBuffer,
      ContentType: mimeType,
      ContentDisposition: "inline",
      // If the bucket doesn't enforce bucket owner enforced ACLs, we can set it to public-read.
      // But we will omit ACL since most modern buckets use Bucket Policies instead of ACLs.
      // ACL: "public-read",
    });

    await s3Client.send(command);

    // Construct and return the public URL
    const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${objectKey}`;
    return publicUrl;
  } catch (error) {
    console.error("Error uploading file to AWS S3:", error);
    return null;
  }
}
