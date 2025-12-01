#!/bin/sh
set -e

echo "🔄 Running database migrations..."

# Gera o Prisma Client (necessário porque o standalone não inclui dev dependencies)
npx prisma generate

# Sincroniza o schema com o banco (cria a tabela se não existir)
npx prisma db push --accept-data-loss --skip-generate

echo "✅ Migrations complete!"
echo "🚀 Starting application..."

# Inicia o servidor Next.js standalone
exec node server.js
