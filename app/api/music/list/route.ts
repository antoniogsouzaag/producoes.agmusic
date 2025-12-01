
export const dynamic = "force-dynamic"

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getPublicUrl } from '@/lib/s3'

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

    // Gerar URLs públicas para cada música (bucket é público)
    const musicsWithUrls = musics
      .filter(music => music.cloud_storage_path) // Só músicas com path válido
      .map((music) => {
        const url = getPublicUrl(music.cloud_storage_path)
        const coverUrl = music.cover_image_path ? getPublicUrl(music.cover_image_path) : null
        
        console.log(`[API /music/list] Music ${music.id}: ${music.title} -> ${url}`)
        
        return {
          id: String(music.id),
          title: music.title,
          artist: music.artist,
          url: url,
          coverUrl: coverUrl,
          duration: music.duration ?? 0,
        }
      })

    console.log(`[API /music/list] Returning ${musicsWithUrls.length} musics`)

    return NextResponse.json({ musics: musicsWithUrls })
  } catch (error: any) {
    console.error('[API /music/list] Error:', error)
    
    // Se a tabela não existe, retorna mensagem específica
    if (error.code === 'P2021') {
      console.error('[API /music/list] Table does not exist. Please run: npx prisma db push')
      return NextResponse.json(
        { 
          error: 'Banco de dados não inicializado. Por favor, contate o administrador.',
          musics: [] 
        },
        { status: 500 }
      )
    }
    
    // Retorna array vazio para não quebrar a UI
    return NextResponse.json(
      { 
        error: 'Erro ao carregar músicas', 
        musics: [],
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
