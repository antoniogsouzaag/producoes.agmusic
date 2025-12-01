#!/bin/sh
set -e

echo "🔄 Running database migrations..."
npx prisma db push --skip-generate

echo "✅ Migrations complete!"
echo "🚀 Starting application..."

exec node server.js
