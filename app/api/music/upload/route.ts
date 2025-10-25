
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { uploadFile } from '@/lib/s3'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const coverImage = formData.get('coverImage') as File | null
    const title = formData.get('title') as string
    const artist = formData.get('artist') as string || 'Antônio Garcia'
    
    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      )
    }

    if (!file.type.startsWith('audio/')) {
      return NextResponse.json(
        { error: 'O arquivo deve ser um áudio' },
        { status: 400 }
      )
    }

    // Convert audio file to buffer
    const audioBuffer = Buffer.from(await file.arrayBuffer())
    
    // Upload audio to S3
    const cloud_storage_path = await uploadFile(audioBuffer, file.name, file.type)
    
    // Handle cover image upload if provided
    let cover_image_path = null
    if (coverImage && coverImage.type.startsWith('image/')) {
      const imageBuffer = Buffer.from(await coverImage.arrayBuffer())
      cover_image_path = await uploadFile(imageBuffer, coverImage.name, coverImage.type)
    }
    
    // Save metadata to database
    const music = await prisma.music.create({
      data: {
        title,
        artist,
        cloud_storage_path,
        cover_image_path,
      },
    })
    
    return NextResponse.json({ 
      success: true, 
      music: {
        id: music.id,
        title: music.title,
        artist: music.artist,
      }
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer upload da música' },
      { status: 500 }
    )
  }
}
