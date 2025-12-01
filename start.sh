#!/bin/sh
set -e

echo "🔄 Running database migrations..."

# Gera o Prisma Client (necessário porque o standalone não inclui dev dependencies)
npx prisma generate

# Tenta executar migrations primeiro, se falhar usa db push
if ! npx prisma migrate deploy; then
  echo "⚠️  Migrate deploy failed, falling back to db push..."
  npx prisma db push --accept-data-loss --skip-generate
fi

echo "✅ Migrations complete!"
echo "🚀 Starting application..."

# Inicia o servidor Next.js
exec npm run start
