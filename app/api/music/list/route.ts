
export const dynamic = "force-dynamic"

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getFileUrl } from '@/lib/s3'
// 1. IMPORTA O TIPO Music GERADO PELO PRISMA
import { Music } from '@prisma/client' 

export async function GET() {
  try {
    // Busca os dados do banco
    const musics = await prisma.music.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    // REMOVIDA A INTERFACE MANUAL
    
    // Generate signed URLs for each music file and cover image
    const musicsWithUrls = await Promise.all(
      // 2. APLICA O TIPO IMPORTADO (Music) AO PARÂMETRO 'music'
      musics.map(async (music: Music) => {
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
