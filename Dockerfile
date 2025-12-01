# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app

# Instala dependências do sistema necessárias para prisma
RUN apk add --no-cache libc6-compat openssl

# Copia package files
COPY package*.json ./

# Instala ALL dependencies (incluindo dev) para o build
RUN npm ci

# Copia prisma schema
COPY prisma ./prisma

# Gera Prisma Client
RUN npx prisma generate

# Copia o resto dos arquivos
COPY . .

# Build Next.js com standalone output
RUN npm run build

# Stage 2: runtime
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

ENV NODE_ENV=production
ENV PORT=3000

# Copia arquivos do standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copia Prisma (schema + client gerado)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copia o CLI do Prisma para executar migrations
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

EXPOSE 3000

# Script de inicialização que executa migração antes de iniciar
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Comando de start com migração
CMD ["./start.sh"]
