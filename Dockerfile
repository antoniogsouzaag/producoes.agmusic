# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app

# Instala dependências do sistema necessárias para prismal
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
RUN apk add --no-cache libc6-compat

# Copia artefatos do build (standalone)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copia node_modules do builder (mais rápido) ou reinstala se preferir
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Se estiver usando prisma binary, defina variável
ENV PRISMA_QUERY_ENGINE_BINARY=/app/node_modules/.prisma/client/query-engine-$(uname -m)-linux-musl

# Comando de start
CMD ["node", "server.js"]
