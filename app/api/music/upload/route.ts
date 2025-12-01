
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
    let audioBuffer: Buffer;
    try {
      audioBuffer = Buffer.from(await file.arrayBuffer())
    } catch (err) {
      console.error('[API /music/upload] Error converting file to buffer:', err)
      return NextResponse.json({ error: 'Erro ao processar o arquivo de áudio.' }, { status: 500 })
    }
    
    // Upload audio to S3
    console.log('[API /music/upload] Uploading to S3...')
    let cloud_storage_path: string;
    try {
      cloud_storage_path = await uploadFile(audioBuffer, file.name, file.type)
      console.log('[API /music/upload] Audio uploaded to:', cloud_storage_path)
    } catch (err) {
      console.error('[API /music/upload] S3 Upload Error:', err)
      return NextResponse.json({ error: 'Erro ao enviar arquivo para o armazenamento.' }, { status: 502 })
    }
    
    // Handle cover image upload if provided
    let cover_image_path = null
    if (coverImage && coverImage.type.startsWith('image/')) {
      try {
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
      } catch (err) {
        console.error('[API /music/upload] Cover Upload Error:', err)
        // Non-fatal error, continue without cover
      }
    }
    
    // Save metadata to database
    console.log('[API /music/upload] Saving to database...')
    let music;
    try {
      music = await prisma.music.create({
        data: {
          title: sanitizedTitle,
          artist: sanitizedArtist,
          cloud_storage_path,
          cover_image_path,
        },
      })
    } catch (err: any) {
      console.error('[API /music/upload] Database Write Error:', err)
      
      // Se a tabela não existe, tente criar
      if (err.code === 'P2021') {
        console.error('[API /music/upload] Table does not exist. Please run: npx prisma db push')
        return NextResponse.json({ 
          error: 'Banco de dados não inicializado. Por favor, contate o administrador.' 
        }, { status: 500 })
      }
      
      // Try to clean up S3 file if DB write fails
      // await deleteFile(cloud_storage_path) 
      return NextResponse.json({ 
        error: 'Erro ao salvar informações no banco de dados.',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      }, { status: 500 })
    }
    
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
