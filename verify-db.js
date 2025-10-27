const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  console.log('🔍 Verificando conexão com o banco de dados...\n');

  try {
    // Verificar conexão
    await prisma.$connect();
    console.log('✅ Conexão estabelecida com sucesso!\n');

    // Contar músicas
    const count = await prisma.music.count();
    console.log(`📊 Total de músicas no banco: ${count}\n`);

    // Listar primeiras 5 músicas
    const musicas = await prisma.music.findMany({
      take: 5,
      orderBy: { id: 'asc' },
    });

    console.log('🎵 Primeiras 5 músicas:');
    musicas.forEach((musica, index) => {
      console.log(`   ${index + 1}. "${musica.title}" por ${musica.artist} (${musica.duration}s)`);
    });

    console.log('\n✅ Banco de dados funcionando perfeitamente!');
  } catch (error) {
    console.error('❌ Erro ao verificar banco de dados:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
