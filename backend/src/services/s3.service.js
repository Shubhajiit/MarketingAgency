const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { env } = require('../config/env');
const logger = require('../utils/logger');

let s3Client = null;

const getS3Client = () => {
  if (!s3Client && env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY) {
    s3Client = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3Client;
};

/**
 * Generate a signed URL for viewing a video.
 * URL expires after the specified duration.
 *
 * @param {string} s3Key - The S3 object key
 * @param {number} expiresIn - Expiry in seconds (default: 3600 = 1 hour)
 */
const getSignedVideoUrl = async (s3Key, expiresIn = 3600) => {
  const client = getS3Client();
  if (!client) {
    logger.warn('S3 not configured, returning placeholder URL');
    return `https://${env.S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${s3Key}`;
  }

  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: s3Key,
  });

  const signedUrl = await getSignedUrl(client, command, { expiresIn });
  return signedUrl;
};

/**
 * Generate a presigned upload URL.
 *
 * @param {string} s3Key - The S3 object key
 * @param {string} contentType - MIME type
 * @param {number} expiresIn - Expiry in seconds (default: 600 = 10 min)
 */
const getPresignedUploadUrl = async (s3Key, contentType = 'video/mp4', expiresIn = 600) => {
  const client = getS3Client();
  if (!client) throw new Error('S3 not configured');

  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: s3Key,
    ContentType: contentType,
  });

  const signedUrl = await getSignedUrl(client, command, { expiresIn });
  return signedUrl;
};

module.exports = { getS3Client, getSignedVideoUrl, getPresignedUploadUrl };
