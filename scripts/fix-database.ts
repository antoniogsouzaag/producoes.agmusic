import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixDatabase() {
  console.log('🔍 Verificando estado do banco de dados...');

  try {
    // Tenta criar a tabela Music se não existir
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Music" (
        "id" SERIAL NOT NULL,
        "title" TEXT NOT NULL,
        "artist" TEXT NOT NULL DEFAULT 'Antônio Garcia',
        "cloud_storage_path" TEXT NOT NULL,
        "cover_image_path" TEXT,
        "duration" INTEGER,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Music_pkey" PRIMARY KEY ("id")
      );
    `);

    console.log('✅ Tabela Music criada/verificada com sucesso!');

    // Verifica se há dados na tabela
    const count = await prisma.music.count();
    console.log(`📊 Total de músicas no banco: ${count}`);

    // Testa uma query simples
    const musics = await prisma.music.findMany({ take: 5 });
    console.log(`📝 Primeiras músicas:`, musics);

  } catch (error) {
    console.error('❌ Erro ao verificar/corrigir banco de dados:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixDatabase()
  .then(() => {
    console.log('✅ Verificação concluída com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Falha na verificação:', error);
    process.exit(1);
  });
