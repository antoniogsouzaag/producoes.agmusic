# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app

# Instala dependências do sistema necessárias para prisma
RUN apk add --no-cache libc6-compat openssl

COPY package*.json ./
# Se usar pnpm/yarn, adapte aqui
RUN npm ci

COPY prisma ./prisma
COPY . .

# Gerar Prisma e build Next
RUN npx prisma generate
RUN npm run build

# Stage 2: runtime
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl

# Copia artefatos do build (standalone)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copia node_modules e prisma do builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Script de inicialização que executa migração antes de iniciar
COPY --from=builder /app/start.sh ./start.sh
RUN chmod +x ./start.sh

# Comando de start com migração
CMD ["./start.sh"]
