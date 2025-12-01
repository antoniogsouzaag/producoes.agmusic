
import { S3Client } from "@aws-sdk/client-s3"

export function getBucketConfig() {
  const bucketName = process.env.AWS_BUCKET_NAME
  
  if (!bucketName) {
    console.warn('AWS_BUCKET_NAME not configured. File uploads will fail until AWS credentials are set.')
  }
  
  return {
    bucketName: bucketName || 'not-configured',
    folderPrefix: process.env.AWS_FOLDER_PREFIX || ""
  }
}

export function createS3Client() {
  const credentials = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    : undefined
  
  if (!credentials) {
    console.warn('AWS credentials not configured. File uploads will fail until credentials are set in environment variables.')
  }
  
  return new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials
  })
}
