# 🗄️ Configuração do Banco de Dados

## 📋 Sobre

Esta aplicação usa **Prisma ORM** com **PostgreSQL** para gerenciar dados de músicas e metadados.

## 🚀 Setup Rápido

### 1. Configurar Variável de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure o `DATABASE_URL`:

```env
DATABASE_URL="postgresql://username:password@host:5432/database?schema=public"
```

### 2. Rodar Migrations

```bash
# Gerar cliente Prisma
npx prisma generate

# Aplicar migrations no banco
npx prisma migrate deploy

# (Opcional) Ver banco de dados no Prisma Studio
npx prisma studio
```

## 🗃️ Schema do Banco

### Model: Music

```prisma
model Music {
  id                 Int      @id @default(autoincrement())
  title              String
  artist             String   @default("Antônio Garcia")
  cloud_storage_path String   // Caminho no S3
  cover_image_path   String?  // Caminho da capa no S3 (opcional)
  duration           Int?     // Duração em segundos
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}
```

## 🌐 Opções de Banco de Dados

### ⚡ Neon (Recomendado)
- **Gratuito:** Até 0.5 GB storage
- **Serverless:** Escala automaticamente
- **Setup:** 2 minutos

**Como configurar:**
1. Criar conta em [neon.tech](https://neon.tech)
2. Criar novo projeto PostgreSQL
3. Copiar DATABASE_URL
4. Adicionar ao `.env`

### 🔥 Supabase
- **Gratuito:** Até 500 MB storage
- **Features extras:** Auth, Storage, Realtime
- **Setup:** 3 minutos

**Como configurar:**
1. Criar conta em [supabase.com](https://supabase.com)
2. Criar novo projeto
3. Ir em Settings → Database
4. Copiar Connection String (PostgreSQL)
5. Adicionar ao `.env`

### ☁️ AWS RDS
- **Pago:** A partir de $15/mês
- **Controle total:** Backups automáticos, scaling
- **Setup:** 10-15 minutos

**Como configurar:**
1. Criar instância PostgreSQL no RDS
2. Configurar Security Group:
   - Porta: 5432
   - Source: 0.0.0.0/0 (ou IPs específicos)
3. Marcar "Publicly accessible": Yes
4. Copiar endpoint de conexão
5. Adicionar ao `.env`

### 🚂 Railway
- **Gratuito:** $5 crédito mensal
- **All-in-one:** Deploy + Database
- **Setup:** 5 minutos

**Como configurar:**
1. Criar conta em [railway.app](https://railway.app)
2. Criar PostgreSQL database
3. Copiar DATABASE_URL das variáveis
4. Adicionar ao `.env`

## 🔧 Comandos Úteis

### Desenvolvimento
```bash
# Ver banco de dados visualmente
npx prisma studio

# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Resetar banco (⚠️ CUIDADO: apaga todos os dados)
npx prisma migrate reset

# Formatar schema.prisma
npx prisma format
```

### Produção
```bash
# Aplicar migrations
npx prisma migrate deploy

# Gerar cliente Prisma
npx prisma generate
```

### Debug
```bash
# Ver status das migrations
npx prisma migrate status

# Ver logs de query (adicionar em lib/db.ts)
log: ['query', 'error', 'warn']
```

## 🛠️ Tratamento de Erros

A aplicação possui tratamento gracioso de erros de conexão:

- ✅ **GET /api/music/list** - Retorna array vazio
- ✅ **POST /api/music/upload** - Retorna erro 503
- ✅ **DELETE /api/music/delete** - Retorna erro 503

Mesmo que o banco esteja offline, a aplicação não quebra.

## 📊 Connection String - Parâmetros

```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?param1=value1&param2=value2
```

### Parâmetros recomendados:
- `schema=public` - Schema padrão do PostgreSQL
- `connection_limit=5` - Limite de conexões por instância
- `pool_timeout=10` - Timeout do pool em segundos
- `sslmode=require` - Força SSL (recomendado para produção)

### Exemplo completo:
```
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public&connection_limit=5&pool_timeout=10&sslmode=require"
```

## 🔍 Troubleshooting

### Erro: "Can't reach database server"

Veja o arquivo [DATABASE_TROUBLESHOOTING.md](../DATABASE_TROUBLESHOOTING.md) na raiz do projeto para soluções detalhadas.

**Quick checks:**
1. ✅ Banco está rodando?
2. ✅ DATABASE_URL está correto?
3. ✅ Firewall/Security Group permite conexões?
4. ✅ Instância é publicamente acessível?

### Erro: "Authentication failed"
- Verificar username e password
- Verificar se usuário tem permissões corretas

### Erro: "Database does not exist"
- Criar database manualmente:
  ```sql
  CREATE DATABASE nome_do_banco;
  ```

### Erro: "SSL connection required"
- Adicionar `?sslmode=require` na connection string

## 📚 Recursos

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

## 🔐 Segurança

⚠️ **NUNCA commite o arquivo `.env`!**

O arquivo `.env` contém credenciais sensíveis e está no `.gitignore`.

Para deploy em produção:
- Adicione variáveis de ambiente no painel do serviço de deploy
- Use services secrets manager (AWS Secrets Manager, etc)
- Nunca exponha DATABASE_URL em código client-side

---

**Última atualização:** 27 de Outubro de 2025
