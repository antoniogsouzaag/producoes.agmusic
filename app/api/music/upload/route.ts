
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { uploadFile } from '@/lib/s3'

export async function POST(request: NextRequest) {
  console.log('[API /music/upload] Starting upload request...')
  
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const coverImage = formData.get('coverImage') as File | null
    const title = formData.get('title') as string
    const artist = formData.get('artist') as string || 'Antônio Garcia'
    
    console.log('[API /music/upload] Form data received:', {
      hasFile: !!file,
      fileType: file?.type,
      fileSize: file?.size,
      hasCover: !!coverImage,
      title,
      artist
    })
    
    // Validação: arquivo obrigatório
    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      )
    }

    // Validação: tipo de arquivo
    if (!file.type.startsWith('audio/')) {
      return NextResponse.json(
        { error: 'O arquivo deve ser um áudio' },
        { status: 400 }
      )
    }

    // Segurança: validar tamanho do arquivo (máx 50MB)
    const MAX_FILE_SIZE = 50 * 1024 * 1024
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Tamanho máximo: 50MB' },
        { status: 413 }
      )
    }

    // Segurança: sanitizar e validar título
    const sanitizedTitle = title?.trim().substring(0, 200)
    if (!sanitizedTitle || sanitizedTitle.length < 1) {
      return NextResponse.json(
        { error: 'Título inválido' },
        { status: 400 }
      )
    }

    // Segurança: sanitizar nome do artista
    const sanitizedArtist = (artist?.trim() || 'Antônio Garcia').substring(0, 100)

    // Convert audio file to buffer
    console.log('[API /music/upload] Converting file to buffer...')
    const audioBuffer = Buffer.from(await file.arrayBuffer())
    
    // Upload audio to S3
    console.log('[API /music/upload] Uploading to S3...')
    const cloud_storage_path = await uploadFile(audioBuffer, file.name, file.type)
    console.log('[API /music/upload] Audio uploaded to:', cloud_storage_path)
    
    // Handle cover image upload if provided
    let cover_image_path = null
    if (coverImage && coverImage.type.startsWith('image/')) {
      // Segurança: validar tamanho da imagem (máx 5MB)
      const MAX_IMAGE_SIZE = 5 * 1024 * 1024
      if (coverImage.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { error: 'Imagem de capa muito grande. Tamanho máximo: 5MB' },
          { status: 413 }
        )
      }
      console.log('[API /music/upload] Uploading cover image...')
      const imageBuffer = Buffer.from(await coverImage.arrayBuffer())
      cover_image_path = await uploadFile(imageBuffer, coverImage.name, coverImage.type)
      console.log('[API /music/upload] Cover uploaded to:', cover_image_path)
    }
    
    // Save metadata to database
    console.log('[API /music/upload] Saving to database...')
    const music = await prisma.music.create({
      data: {
        title: sanitizedTitle,
        artist: sanitizedArtist,
        cloud_storage_path,
        cover_image_path,
      },
    })
    
    console.log('[API /music/upload] Success! Music ID:', music.id)
    
    return NextResponse.json({ 
      success: true, 
      music: {
        id: music.id,
        title: music.title,
        artist: music.artist,
      }
    })
  } catch (error) {
    console.error('[API /music/upload] Error:', error)
    
    // Check if it's a database connection error
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as any
      if (prismaError.code === 'P1001' || prismaError.code === 'ENOTFOUND' || prismaError.code === 'ETIMEDOUT') {
        return NextResponse.json({
          error: 'Sistema temporariamente indisponível. Por favor, tente novamente em alguns minutos.'
        }, { status: 503 })
      }
    }
    
    // Retornar erro mais detalhado em desenvolvimento
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    return NextResponse.json(
      { error: `Erro ao fazer upload: ${errorMessage}` },
      { status: 500 }
    )
  }
}
