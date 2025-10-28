# 🔧 Troubleshooting - Erro de Conexão com Banco de Dados

## ⚠️ Problema Identificado

A aplicação está apresentando erros de conexão com o banco de dados AWS RDS PostgreSQL:

```
PrismaClientInitializationError: Can't reach database server at 
`agmusic.cno8s88igry5.eu-west-1.rds.amazonaws.com:5432`
```

## 🔍 Causas Possíveis

### 1. **Banco de Dados AWS RDS Desligado/Parado** ⏸️
   - **Solução:** Acesse o Console AWS RDS e verifique se a instância está **Available** (Disponível)
   - **Como verificar:**
     1. Acesse: https://console.aws.amazon.com/rds/
     2. Selecione a região: **eu-west-1** (Ireland)
     3. Procure pela instância: **agmusic**
     4. Verifique o status - deve estar **Available**

### 2. **Security Groups Bloqueando Conexões** 🔒
   - **Solução:** Configurar Security Group para permitir conexões externas
   - **Como corrigir:**
     1. No Console AWS RDS, clique na instância
     2. Vá em **Connectivity & security**
     3. Clique no Security Group associado
     4. Em **Inbound rules**, adicione regra:
        - Type: PostgreSQL
        - Port: 5432
        - Source: `0.0.0.0/0` (todas as IPs) ou IP específico do seu deploy

### 3. **Credenciais Incorretas** 🔑
   - **Solução:** Verificar e atualizar variáveis de ambiente
   - **Formato correto do DATABASE_URL:**
     ```
     DATABASE_URL="postgresql://username:password@agmusic.cno8s88igry5.eu-west-1.rds.amazonaws.com:5432/database_name?schema=public&connection_limit=5&pool_timeout=10"
     ```
   - **Onde atualizar:**
     - No deploy (Vercel/Heroku/etc): nas variáveis de ambiente
     - Localmente: arquivo `.env` (não commitado)

### 4. **RDS Público vs Privado** 🌐
   - **Problema:** RDS pode estar configurado como privado (sem acesso externo)
   - **Solução:**
     1. No Console AWS RDS → instância
     2. **Connectivity & security** → **Publicly accessible**: deve estar **Yes**
     3. Se estiver **No**, você precisará:
        - Modificar a instância para torná-la pública, OU
        - Usar VPN/Bastion Host para conectar, OU
        - Migrar para outro banco de dados

### 5. **Instância Deletada ou Região Errada** ❌
   - **Solução:** Verificar se a instância ainda existe
   - Se não existir mais, você tem opções:
     - Restaurar de backup (se disponível)
     - Criar nova instância RDS
     - Migrar para outro serviço de banco de dados

## 🛠️ Soluções Implementadas no Código

### ✅ Tratamento de Erro Gracioso
A aplicação agora possui tratamento de erro em todas as rotas API:

- **GET /api/music/list** - Retorna array vazio quando banco está indisponível
- **POST /api/music/upload** - Retorna erro 503 com mensagem amigável
- **DELETE /api/music/delete** - Retorna erro 503 com mensagem amigável

### ✅ Melhorias no Cliente Prisma
O arquivo `lib/db.ts` foi melhorado com:
- Logging apropriado por ambiente
- Graceful shutdown
- Melhor configuração de conexão

## 🚀 Opções de Migração (Se o RDS não estiver disponível)

### Opção 1: Neon (Recomendado) ⚡
**Prós:** Gratuito, serverless, fácil setup
```bash
# 1. Criar conta em: https://neon.tech
# 2. Criar novo projeto PostgreSQL
# 3. Copiar DATABASE_URL fornecido
# 4. Atualizar variável de ambiente
# 5. Rodar migrations:
npm run prisma migrate deploy
```

### Opção 2: Supabase 🔥
**Prós:** Gratuito, features extras (auth, storage)
```bash
# 1. Criar conta em: https://supabase.com
# 2. Criar novo projeto
# 3. Copiar Connection String (PostgreSQL)
# 4. Atualizar DATABASE_URL
# 5. Rodar migrations:
npm run prisma migrate deploy
```

### Opção 3: PlanetScale 🌍
**Prós:** MySQL serverless, muito rápido
```bash
# 1. Criar conta em: https://planetscale.com
# 2. Criar banco de dados
# 3. Atualizar schema.prisma:
#    provider = "mysql"
# 4. Copiar DATABASE_URL
# 5. Gerar novo schema:
npx prisma db push
```

### Opção 4: Railway 🚂
**Prós:** Deploy + Database juntos
```bash
# 1. Criar conta em: https://railway.app
# 2. Criar PostgreSQL database
# 3. Copiar DATABASE_URL
# 4. Deploy da aplicação também pode ser feito lá
```

## 📋 Checklist de Verificação

- [ ] Banco AWS RDS está rodando (status: Available)
- [ ] Security Group permite conexões na porta 5432
- [ ] DATABASE_URL está corretamente configurado no deploy
- [ ] Instância RDS é publicamente acessível
- [ ] Credenciais (username/password) estão corretas
- [ ] Nome do database está correto na connection string

## 🔧 Comandos Úteis

### Testar conexão localmente:
```bash
# Instalar psql (se necessário)
sudo apt-get install postgresql-client

# Testar conexão
psql "postgresql://username:password@agmusic.cno8s88igry5.eu-west-1.rds.amazonaws.com:5432/database_name"
```

### Verificar variáveis de ambiente no deploy:
```bash
# Heroku
heroku config

# Vercel
vercel env ls
```

### Rodar migrations após resolver conexão:
```bash
npx prisma migrate deploy
```

## 📞 Próximos Passos

1. **Verificar AWS RDS Console** - Confirmar status da instância
2. **Verificar Security Groups** - Garantir que porta 5432 está aberta
3. **Verificar Variáveis de Ambiente** - Confirmar DATABASE_URL correto
4. **Considerar Migração** - Se RDS não estiver disponível, escolher alternativa

## 🆘 Suporte Adicional

Se o problema persistir após verificar todos os itens:
1. Verifique logs do AWS CloudWatch para a instância RDS
2. Teste conectividade usando `telnet` ou `nc`:
   ```bash
   nc -zv agmusic.cno8s88igry5.eu-west-1.rds.amazonaws.com 5432
   ```
3. Considere criar uma nova instância RDS do zero

---

**Última atualização:** 27 de Outubro de 2025
**Status:** Aplicação possui tratamento de erro gracioso ✅
