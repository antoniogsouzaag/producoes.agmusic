const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando script de seed (vazio)...');

  // **********************************************
  // ** O BLOCO DE CRIAÇÃO DE MÚSICAS DE EXEMPLO FOI REMOVIDO **
  // **********************************************

  // Se você precisar limpar o banco de dados para DEVS, use:
  // await prisma.music.deleteMany({});
  // Mas REMOVA esta linha em produção para evitar perda de dados.

  console.log('\n🎉 Seed concluído! Nenhuma música de exemplo adicionada.');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao popular banco de dados:', e);
    // Se ocorrer um erro durante o seed, o processo é encerrado.
    process.exit(1);
  })
  .finally(async () => {
    // Garante que a conexão com o banco de dados seja fechada.
    await prisma.$disconnect();
  });