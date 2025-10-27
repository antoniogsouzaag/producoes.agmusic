# 🚀 Deploy no Easypanel

Este guia explica como fazer o deploy do projeto AG Music no Easypanel.

## 📋 Pré-requisitos

- Conta no Easypanel
- Repositório GitHub configurado
- Subdomínio `producoes.agmusic.cloud` apontado para o Easypanel
- Banco de dados PostgreSQL (pode ser criado no próprio Easypanel)
- Bucket S3 AWS (opcional, para upload de músicas)

## 🔧 Configuração no Easypanel

### 1. Criar Novo Serviço

1. No Easypanel, clique em **"New Service"**
2. Selecione **"GitHub"** como fonte
3. Conecte seu repositório: `antoniogsouzaag/producoes.agmusic`
4. Escolha a branch: `main` ou `master`

### 2. Configurar Build

- **Build Method**: Docker
- **Dockerfile Path**: `./Dockerfile`
- **Context**: `.`

### 3. Configurar Variáveis de Ambiente

Adicione as seguintes variáveis de ambiente no Easypanel:

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
NODE_ENV=production
PORT=3000
```

**⚠️ IMPORTANTE**: 
- Não compartilhe suas credenciais reais
- Use o PostgreSQL do Easypanel ou externo
- Para o bucket S3, crie um na AWS com permissões adequadas

### 4. Configurar Domínio

1. No Easypanel, vá em **"Domains"**
2. Adicione o domínio: `producoes.agmusic.cloud`
3. Configure o SSL (automático pelo Easypanel)

### 5. Deploy

1. Clique em **"Deploy"**
2. Aguarde o build completar (pode levar alguns minutos)
3. Verifique os logs para garantir que não há erros

## 🗄️ Configurar Banco de Dados

### Opção 1: PostgreSQL no Easypanel

1. Crie um novo serviço PostgreSQL no Easypanel
2. Copie a `DATABASE_URL` gerada
3. Cole na variável de ambiente do seu app

### Opção 2: PostgreSQL Externo

Use qualquer provedor PostgreSQL (Supabase, Railway, etc.) e configure a `DATABASE_URL`.

### Migração do Banco

Após configurar o banco, execute as migrações:

```bash
npx prisma migrate deploy
```

Você pode executar isso via SSH no container ou localmente apontando para o banco de produção.

## 🔄 Atualizações

Para atualizar o site:

1. Faça commit das alterações no GitHub
2. Push para a branch configurada
3. O Easypanel fará o deploy automático

Ou clique em **"Redeploy"** manualmente no Easypanel.

## 🐛 Troubleshooting

### Erro de Build

- Verifique os logs de build no Easypanel
- Certifique-se de que todas as dependências estão no `package.json`
- Teste o build localmente: `docker build -t agmusic .`

### Erro de Conexão com Banco

- Verifique se a `DATABASE_URL` está correta
- Teste a conexão ao banco
- Execute as migrações: `npx prisma migrate deploy`

### Imagens não carregam

- Verifique as permissões do bucket S3
- Configure o CORS no bucket S3
- Verifique as credenciais AWS

### Chatbot não funciona

- Verifique se o webhook n8n está ativo: `https://webhook.agmusic.cloud/webhook/botagmusic`
- Teste o webhook manualmente com Postman ou curl
- Verifique os logs do navegador (F12)

## 📝 Notas

- O chatbot está configurado para se comunicar com o webhook n8n
- As imagens do estúdio estão na pasta `public/estudio/`
- Para editar conteúdo, veja o arquivo `COMO_EDITAR.md`

## 🆘 Suporte

Para problemas técnicos:
- Verifique a documentação do Easypanel
- Consulte os logs do container
- Entre em contato com o suporte do Easypanel

---

**Última atualização**: 27 de Outubro de 2025
