
import { supabaseAdmin, getStorageBucket } from "./supabase"

export async function uploadFile(buffer: Buffer, fileName: string, contentType: string = 'audio/mpeg') {
  try {
    const bucket = getStorageBucket()
    // Sanitize file name to prevent path traversal and encoding issues
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
    const key = `music/${Date.now()}-${sanitizedFileName}`

    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(key, buffer, { contentType, upsert: false })

    if (error) {
      console.error('Supabase upload error:', error)
      throw new Error(error.message)
    }

    return key
  } catch (error) {
    console.error('Storage upload error:', error)
    throw new Error('Failed to upload file to storage. Please check Supabase configuration.')
  }
}

// Gera URL pública direta (bucket deve ser público no Supabase)
export function getPublicUrl(key: string): string {
  const bucket = getStorageBucket()
  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(key)
  return data.publicUrl
}

// Mantém a função getFileUrl para compatibilidade
export async function getFileUrl(key: string, _expiresIn: number = 3600) {
  return getPublicUrl(key)
}

// URL assinada com expiração (caso o bucket seja privado)
export async function getSignedFileUrl(key: string, expiresIn: number = 3600) {
  try {
    const bucket = getStorageBucket()
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(key, expiresIn)

    if (error || !data?.signedUrl) {
      throw new Error(error?.message || 'Failed to generate signed URL')
    }
    return data.signedUrl
  } catch (error) {
    console.error('Supabase getSignedFileUrl error:', error)
    throw new Error('Failed to generate file URL. Please check Supabase configuration.')
  }
}

export async function deleteFile(key: string) {
  try {
    const bucket = getStorageBucket()
    const { error } = await supabaseAdmin.storage.from(bucket).remove([key])
    if (error) {
      console.warn(`Failed to delete file from storage: ${key}`, error.message)
    }
  } catch (error) {
    console.error('Storage delete error:', error)
    // Don't throw to prevent blocking database cleanup
    console.warn(`Failed to delete file from storage: ${key}`)
  }
}

export async function fileExists(key: string) {
  try {
    const bucket = getStorageBucket()
    const folder = key.substring(0, key.lastIndexOf('/'))
    const name = key.substring(key.lastIndexOf('/') + 1)
    const { data, error } = await supabaseAdmin.storage.from(bucket).list(folder, { search: name })
    if (error || !data) return false
    return data.some((f) => f.name === name)
  } catch {
    return false
  }
}
