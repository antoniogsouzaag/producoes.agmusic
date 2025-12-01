# 🔧 Correção do Banco de Dados - Music Portfolio

## 🎯 Problema Identificado

O erro `The table public.Music does not exist in the current database` ocorre porque a tabela `Music` não foi criada no banco de dados PostgreSQL.

Os arquivos de áudio estão sendo enviados com sucesso para o S3, mas não conseguem ser salvos no banco de dados.

---

## ✅ Soluções Implementadas

### 1. **Scripts Automatizados de Deploy**

Atualizamos o `Procfile` e `package.json` para executar migrations automaticamente:

```json
// package.json
"scripts": {
  "postbuild": "prisma migrate deploy || prisma db push --accept-data-loss",
  "db:push": "prisma db push --accept-data-loss",
  "db:fix": "tsx scripts/fix-database.ts"
}
```

```
// Procfile
web: npx prisma migrate deploy || npx prisma db push --accept-data-loss && npm run start
```

### 2. **Script de Correção Manual**

Criamos `scripts/fix-database.ts` para criar a tabela manualmente se necessário.

### 3. **Melhor Tratamento de Erros nas APIs**

As rotas `/api/music/upload` e `/api/music/list` agora detectam quando a tabela não existe e retornam mensagens mais claras.

---

## 🚀 Como Corrigir

### **Opção 1: Deploy Automático (Recomendado)**

Se você está usando **Heroku** ou **Easypanel**, basta fazer um novo deploy:

```bash
git add .
git commit -m "Fix: Add database migrations"
git push
```

As migrations serão executadas automaticamente durante o build.

---

### **Opção 2: Comando Manual no Servidor**

Se você tem acesso ao terminal do servidor:

```bash
# Opção A: Usar migrations
npx prisma migrate deploy

# Opção B: Forçar sincronização do schema
npx prisma db push --accept-data-loss

# Opção C: Usar script de correção
npm run db:fix
```

---

### **Opção 3: Localmente (Desenvolvimento)**

Se estiver testando localmente:

```bash
# 1. Configure a variável de ambiente DATABASE_URL no .env
echo "DATABASE_URL=postgresql://user:password@host:5432/database" > .env

# 2. Execute o push do schema
npx prisma db push

# 3. Ou use o script de correção
npm run db:fix

# 4. Inicie o servidor
npm run dev
```

---

## 🔍 Verificar se Está Funcionando

### 1. **Verifique os Logs do Servidor**

Procure por mensagens como:
```
✅ Migrations complete!
🚀 Starting application...
```

### 2. **Teste a API de Listagem**

Acesse no navegador:
```
https://seu-site.com/api/music/list
```

Deve retornar `{"musics":[]}` em vez de erro 500.

### 3. **Teste o Upload de Música**

Vá para `/estudio` e tente fazer upload de uma música.

---

## 📊 Estrutura da Tabela Music

```sql
CREATE TABLE "Music" (
  "id" SERIAL NOT NULL,
  "title" TEXT NOT NULL,
  "artist" TEXT NOT NULL DEFAULT 'Antônio Garcia',
  "cloud_storage_path" TEXT NOT NULL,
  "cover_image_path" TEXT,
  "duration" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Music_pkey" PRIMARY KEY ("id")
);
```

---

## 🛠️ Troubleshooting

### Erro: "Can't reach database server"
- Verifique se a variável `DATABASE_URL` está correta no ambiente
- Confirme que o servidor PostgreSQL está rodando
- Verifique as credenciais de acesso

### Erro: "Migration already applied"
- Isso é normal, significa que as migrations já foram executadas
- Use `prisma db push` ao invés de `migrate deploy`

### Erro: "Permission denied"
- O usuário do banco precisa ter permissões de CREATE TABLE
- Verifique as permissões do usuário PostgreSQL

---

## 📝 Próximos Passos

Após corrigir o banco de dados:

1. ✅ A tabela `Music` será criada automaticamente
2. ✅ Os uploads de música funcionarão normalmente
3. ✅ A listagem de músicas retornará os dados corretamente
4. ✅ O portfólio exibirá as músicas no site

---

## 💡 Dicas

- **Backup**: Sempre faça backup do banco antes de rodar migrations em produção
- **Environment**: Certifique-se que a `DATABASE_URL` está configurada corretamente
- **Logs**: Monitore os logs do servidor após o deploy para confirmar sucesso
- **Testing**: Teste primeiro em ambiente de desenvolvimento/staging

---

## 📞 Suporte

Se o problema persistir, verifique:

1. **Logs do servidor** para detalhes do erro
2. **DATABASE_URL** está configurada corretamente
3. **Versão do PostgreSQL** (recomendado 12+)
4. **Permissões do usuário** do banco de dados

---

**Última atualização**: Dezembro 2025
