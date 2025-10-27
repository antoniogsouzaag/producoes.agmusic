
export const dynamic = "force-dynamic"

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getFileUrl } from '@/lib/s3'

// ----------------------------------------------------
// 1. DEFINE UMA FUNÇÃO AUXILIAR PARA A QUERY E INFERE O TIPO DE RETORNO
const getMusicsQuery = () => prisma.music.findMany({
  orderBy: {
    createdAt: 'desc',
  },
});

// 2. EXTRAI O TIPO DO ARRAY DE RETORNO DA FUNÇÃO DO PRISMA
// O tipo MusicArrayType é [Music, Music, Music, ...]
type MusicArrayType = Awaited<ReturnType<typeof getMusicsQuery>>;

// 3. EXTRAI O TIPO DO ITEM (MÚSICA) DO ARRAY
type MusicType = MusicArrayType[number];
// ----------------------------------------------------


export async function GET() {
  try {
    // A chamada da query agora usa a função auxiliar
    const musics = await getMusicsQuery();
    
    // Generate signed URLs for each music file and cover image
    const musicsWithUrls = await Promise.all(
      // APLICAÇÃO DO TIPO MusicType INFERIDO
      musics.map(async (music: MusicType) => {
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
    console.error('Database connection error:', error)
    
    // Check if it's a database connection error
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as any
      if (prismaError.code === 'P1001' || prismaError.code === 'ENOTFOUND' || prismaError.code === 'ETIMEDOUT') {
        return NextResponse.json({
          error: 'Sistema temporariamente indisponível. Por favor, tente novamente em alguns minutos.',
          musics: [] // Return empty array so the UI can still render
        })
      }
    }
    
    return NextResponse.json(
      { error: 'Erro temporário ao carregar músicas. Tente novamente.', musics: [] },
      { status: 500 }
    )
  }
}
