const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Populando banco de dados com dados de exemplo...');

  // Criar músicas de exemplo
  const musicas = [
    {
      title: 'Verão Brasileiro',
      artist: 'Antônio Garcia',
      cloud_storage_path: '/storage/verao_brasileiro.mp3',
      cover_image_path: 'https://upload.wikimedia.org/wikipedia/en/b/b9/Taylor_Swift_-_Anti-Hero.png',
      duration: 180,
    },
    {
      title: 'Noite Estrelada',
      artist: 'Antônio Garcia',
      cloud_storage_path: '/storage/noite_estrelada.mp3',
      cover_image_path: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/250px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
      duration: 240,
    },
    {
      title: 'Ritmo da Cidade',
      artist: 'Antônio Garcia',
      cloud_storage_path: '/storage/ritmo_cidade.mp3',
      cover_image_path: 'https://i.ytimg.com/vi/oZJ2zaHooDA/maxresdefault.jpg',
      duration: 200,
    },
    {
      title: 'Melodia do Amanhecer',
      artist: 'Antônio Garcia',
      cloud_storage_path: '/storage/melodia_amanhecer.mp3',
      cover_image_path: 'https://i.pinimg.com/736x/4c/a5/5f/4ca55fce2da7984c525f153279b8084b.jpg',
      duration: 220,
    },
    {
      title: 'Beat Eletrônico',
      artist: 'Antônio Garcia',
      cloud_storage_path: '/storage/beat_eletronico.mp3',
      cover_image_path: 'https://i.ytimg.com/vi/ypheD6IWj6U/sddefault.jpg',
      duration: 190,
    },
    {
      title: 'Samba do Coração',
      artist: 'Antônio Garcia',
      cloud_storage_path: '/storage/samba_coracao.mp3',
      cover_image_path: 'https://upload.wikimedia.org/wikipedia/en/7/78/So_Dan%C3%A7o_Samba.jpg',
      duration: 195,
    },
    {
      title: 'Jazz na Madrugada',
      artist: 'Antônio Garcia',
      cloud_storage_path: '/storage/jazz_madrugada.mp3',
      cover_image_path: 'https://i.ytimg.com/vi/fnT9n81iP7w/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGH8gEygVMA8=&rs=AOn4CLBAh7VTGgYPf3R9IqfHi2wkXp6-6Q',
      duration: 280,
    },
    {
      title: 'Rock Brasileiro',
      artist: 'Antônio Garcia',
      cloud_storage_path: '/storage/rock_brasileiro.mp3',
      cover_image_path: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8d/John_Garcia_-_John_Garcia.jpg/250px-John_Garcia_-_John_Garcia.jpg',
      duration: 210,
    },
    {
      title: 'Forró da Alegria',
      artist: 'Antônio Garcia',
      cloud_storage_path: '/storage/forro_alegria.mp3',
      cover_image_path: 'https://i.ytimg.com/vi/gagLn335DVM/mqdefault.jpg',
      duration: 175,
    },
    {
      title: 'Bossa Nova Clássica',
      artist: 'Antônio Garcia',
      cloud_storage_path: '/storage/bossa_classica.mp3',
      cover_image_path: 'https://i.pinimg.com/474x/d0/eb/7e/d0eb7ef87f5eaabed94659ac1f58343a.jpg',
      duration: 230,
    },
  ];

  for (const musica of musicas) {
    const created = await prisma.music.create({
      data: musica,
    });
    console.log(`✅ Música criada: ${created.title} (ID: ${created.id})`);
  }

  console.log(`\n🎉 Banco de dados populado com sucesso! ${musicas.length} músicas criadas.`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao popular banco de dados:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
