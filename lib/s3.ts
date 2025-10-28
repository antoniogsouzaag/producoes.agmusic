
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { createS3Client, getBucketConfig } from "./aws-config"

const s3Client = createS3Client()
const { bucketName, folderPrefix } = getBucketConfig()

export async function uploadFile(buffer: Buffer, fileName: string, contentType: string = 'audio/mpeg') {
  try {
    // Sanitize file name to prevent path traversal and encoding issues
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
    const key = `${folderPrefix}music/${Date.now()}-${sanitizedFileName}`
    
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    )
    
    return key
  } catch (error) {
    console.error('S3 upload error:', error)
    throw new Error('Failed to upload file to storage. Please check AWS credentials and bucket configuration.')
  }
}

export async function getFileUrl(key: string, expiresIn: number = 3600) {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
    
    const url = await getSignedUrl(s3Client, command, { expiresIn })
    return url
  } catch (error) {
    console.error('S3 getFileUrl error:', error)
    throw new Error('Failed to generate file URL. Please check AWS credentials and bucket configuration.')
  }
}

export async function deleteFile(key: string) {
  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
    )
  } catch (error) {
    console.error('S3 delete error:', error)
    // Don't throw error on delete failure to prevent blocking database cleanup
    console.warn(`Failed to delete file from S3: ${key}`)
  }
}
