
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { createS3Client, getBucketConfig } from "./aws-config"

const s3Client = createS3Client()
const { bucketName, folderPrefix } = getBucketConfig()

export async function uploadFile(buffer: Buffer, fileName: string, contentType: string = 'audio/mpeg') {
  const key = `${folderPrefix}music/${Date.now()}-${fileName}`
  
  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  )
  
  return key
}

export async function getFileUrl(key: string, expiresIn: number = 3600) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  })
  
  const url = await getSignedUrl(s3Client, command, { expiresIn })
  return url
}

export async function deleteFile(key: string) {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
  )
}
