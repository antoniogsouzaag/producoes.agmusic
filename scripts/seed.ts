import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.music.deleteMany({});
  console.log('✅ Dados existentes limpos');

  // Músicas de exemplo
  const musicas = [
    {
      title: 'Bossa Nova Dreams',
      artist: 'Antônio Garcia',
      cloud_storage_path: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      cover_image_path: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&h=500&fit=crop',
      duration: 245,
    },
    {
      title: 'Samba do Coração',
      artist: 'Antônio Garcia',
      cloud_storage_path: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      cover_image_path: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&h=500&fit=crop',
      duration: 198,
    },
    {
      title: 'Melodia do Amanhecer',
      artist: 'Antônio Garcia',
      cloud_storage_path: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      cover_image_path: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop',
      duration: 212,
    },
    {
      title: 'Ritmo Brasileiro',
      artist: 'Antônio Garcia',
      cloud_storage_path: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      cover_image_path: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop',
      duration: 187,
    },
    {
      title: 'Noites Tropicais',
      artist: 'Antônio Garcia',
      cloud_storage_path: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      cover_image_path: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500&h=500&fit=crop',
      duration: 234,
    },
  ];

  // Inserir músicas
  for (const musica of musicas) {
    const created = await prisma.music.create({
      data: musica,
    });
    console.log(`✅ Criada: ${created.title} (ID: ${created.id})`);
  }

  console.log(`\n🎉 Seed concluído! ${musicas.length} músicas adicionadas ao banco de dados.`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
