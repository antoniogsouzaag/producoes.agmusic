
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { deleteFile } from '@/lib/s3'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID da música não fornecido' },
        { status: 400 }
      )
    }
    
    const music = await prisma.music.findUnique({
      where: { id: parseInt(id) },
    })
    
    if (!music) {
      return NextResponse.json(
        { error: 'Música não encontrada' },
        { status: 404 }
      )
    }
    
    // Delete from S3
    await deleteFile(music.cloud_storage_path)
    
    // Delete from database
    await prisma.music.delete({
      where: { id: parseInt(id) },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar música' },
      { status: 500 }
    )
  }
}
