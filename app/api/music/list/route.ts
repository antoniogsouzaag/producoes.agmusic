
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
    
    interface Music {
  id: number
  title: string
  artist: string       // adiciona aqui
  duration: number
  cloud_storage_path: string
  cover_image_path?: string
}
    // Generate signed URLs for each music file and cover image
    const musicsWithUrls = await Promise.all(
  musics.map(async (music) => {
        const url = await getFileUrl(music.cloud_storage_path)
        const coverUrl = music.cover_image_path ? await getFileUrl(music.cover_image_path) : null
        return {
          id: String(music.id),
          title: music.title,
          artist: music.artist,
          url: url,
          coverUrl: coverUrl,
          duration: music.duration ?? 0,
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
