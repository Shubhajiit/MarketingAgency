const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Initialize S3 client (singleton — safe for concurrency)
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

/**
 * Generate a pre-signed GET URL for a private S3 object.
 * Default TTL: 15 minutes (900 seconds)
 * @param {string} s3Key - The S3 object key (path inside bucket)
 * @param {number} expiresIn - TTL in seconds (default 900)
 * @returns {Promise<string>} pre-signed URL
 */
async function getPresignedUrl(s3Key, expiresIn = 900) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
  });
  return await getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Upload a file buffer to S3.
 * @param {Buffer} buffer - File data
 * @param {string} s3Key - Destination key (path) in bucket
 * @param {string} contentType - MIME type e.g. 'video/mp4'
 * @returns {Promise<string>} The s3Key of the uploaded object
 */
async function uploadToS3(buffer, s3Key, contentType = 'application/octet-stream') {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
    Body: buffer,
    ContentType: contentType,
    // No ACL — bucket is private by default
  });
  await s3Client.send(command);
  return s3Key;
}

/**
 * Delete an object from S3.
 * @param {string} s3Key
 */
async function deleteFromS3(s3Key) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
  });
  await s3Client.send(command);
}

module.exports = { s3Client, getPresignedUrl, uploadToS3, deleteFromS3, BUCKET_NAME };
