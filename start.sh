#!/bin/sh
set -e

echo "🔄 Running database migrations..."
npx prisma generate
npx prisma db push --accept-data-loss

echo "✅ Migrations complete!"
echo "🚀 Starting application..."

exec node server.js
