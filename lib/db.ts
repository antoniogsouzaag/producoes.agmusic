import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Crie o Prisma Client de forma otimizada para ambientes serverless (Next.js)
// Ele usa a instância global se já existir.
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  // Configura a URL de conexão
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Configura os logs: mais detalhado em dev, apenas erros em produção
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// Em desenvolvimento, armazena a instância no objeto global para reutilização (Hot Reloading)
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Desconexão elegante (Graceful shutdown)
if (typeof window === 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
}