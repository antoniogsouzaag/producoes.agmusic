import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes (MANTIDO)
  // Isso garante que você está começando com um banco de dados limpo.
  await prisma.music.deleteMany({});
  console.log('✅ Dados existentes limpos');

  // **********************************************
  // ** BLOCO DE MÚSICAS DE EXEMPLO REMOVIDO **
  // **********************************************

  console.log('\n🎉 Seed concluído! Nenhuma música de exemplo adicionada ao banco de dados.');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    // É importante desconectar o Prisma Client no final.
    await prisma.$disconnect();
  });