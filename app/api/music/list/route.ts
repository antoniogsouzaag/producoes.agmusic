
export const dynamic = "force-dynamic"

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getFileUrl, fileExists } from '@/lib/s3'

export async function GET() {
  try {
    console.log('[API /music/list] Starting request...')
    
    // Buscar todas as músicas do banco
    const musics = await prisma.music.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    console.log(`[API /music/list] Found ${musics.length} musics in database`)

    // Gerar URLs assinadas para cada música
    const musicsWithUrls = await Promise.all(
      musics.map(async (music) => {
        try {
          const path = music.cloud_storage_path
          
          // Se não tem path, pula
          if (!path) {
            console.log(`[API /music/list] Music ${music.id} has no cloud_storage_path, skipping`)
            return null
          }

          // Verifica se o arquivo existe no S3
          const exists = await fileExists(path)
          if (!exists) {
            console.log(`[API /music/list] File not found in S3 for music ${music.id}: ${path}`)
            return null
          }

          // Gera URL assinada
          const url = await getFileUrl(path)
          const coverUrl = music.cover_image_path ? await getFileUrl(music.cover_image_path) : null
          
          return {
            id: String(music.id),
            title: music.title,
            artist: music.artist,
            url: url,
            coverUrl: coverUrl,
            duration: music.duration ?? 0,
          }
        } catch (err) {
          console.error(`[API /music/list] Error processing music ${music.id}:`, err)
          return null
        }
      })
    )

    // Filtra músicas válidas
    const validMusics = musicsWithUrls.filter(Boolean)
    console.log(`[API /music/list] Returning ${validMusics.length} valid musics`)

    return NextResponse.json({ musics: validMusics })
  } catch (error) {
    console.error('[API /music/list] Error:', error)
    
    // Retorna array vazio para não quebrar a UI
    return NextResponse.json(
      { error: 'Erro ao carregar músicas', musics: [] },
      { status: 500 }
    )
  }
}
