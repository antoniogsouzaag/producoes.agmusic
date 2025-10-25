
export const dynamic = "force-dynamic"

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getFileUrl } from '@/lib/s3'

export async function GET() {
  try {
    const musics = await prisma.music.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    // Generate signed URLs for each music file and cover image
    const musicsWithUrls = await Promise.all(
      musics.map(async (music) => {
        const url = await getFileUrl(music.cloud_storage_path)
        const coverUrl = music.cover_image_path ? await getFileUrl(music.cover_image_path) : null
        return {
          id: music.id,
          title: music.title,
          artist: music.artist,
          url,
          coverUrl,
          duration: music.duration,
        }
      })
    )
    
    return NextResponse.json({ musics: musicsWithUrls })
  } catch (error) {
    console.error('List error:', error)
    return NextResponse.json(
      { error: 'Erro ao listar músicas' },
      { status: 500 }
    )
  }
}
