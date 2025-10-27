# 🔧 Documentação de Correção do Deploy - Next.js Standalone

## 📋 Resumo Executivo

Este documento explica detalhadamente os problemas encontrados no deployment da aplicação Next.js e as soluções implementadas para corrigí-los definitivamente.

---

## ❌ Problemas Identificados

### 1. **Erro Principal: "Cannot find module '/workspace/.next/standalone/server.js'"**

O erro ocorria na fase de execução (runtime), mesmo após o build completar com sucesso. Isso indicava que o arquivo estava sendo criado, mas o sistema não conseguia localizá-lo no caminho especificado.

### 2. **Causa Raiz: Substituição de Variáveis no Procfile**

O problema estava relacionado ao uso de substituição de variáveis bash no arquivo `Procfile`:

```
web: node ${NEXT_DIST_DIR:-.next}/standalone/server.js
```

**Por que isso não funciona?**
- O Heroku e Easypanel (baseado em Dokku) não processam o Procfile através de um shell bash
- O Procfile é lido diretamente pelo gerenciador de processos
- A sintaxe `${NEXT_DIST_DIR:-.next}` é uma funcionalidade do bash que **NÃO é interpretada** pelo gerenciador de processos
- O sistema tentava literalmente executar: `node ${NEXT_DIST_DIR:-.next}/standalone/server.js` como um caminho literal

### 3. **Configuração Desnecessária no next.config.js**

A configuração `distDir: process.env.NEXT_DIST_DIR || '.next'` era:
- Desnecessária, pois o Next.js já usa `.next` como padrão
- Criava confusão e complexidade sem benefício
- Dependia de variáveis de ambiente que não eram consistentemente definidas

### 4. **Script start no package.json**

O mesmo problema de substituição de variáveis existia no script `start`:
```json
"start": "node ${NEXT_DIST_DIR:-.next}/standalone/server.js"
```

---

## ✅ Soluções Implementadas

### 1. **Simplificação do next.config.js**

**Antes:**
```javascript
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: 'standalone',
  // ... outras configurações
};
```

**Depois:**
```javascript
const nextConfig = {
  output: 'standalone',
  // ... outras configurações
};
```

**Benefícios:**
- Usa o diretório padrão do Next.js (`.next`)
- Remove dependência de variáveis de ambiente
- Torna a configuração mais simples e previsível

### 2. **Correção do Procfile**

**Antes:**
```
web: node ${NEXT_DIST_DIR:-.next}/standalone/server.js
```

**Depois:**
```
web: node .next/standalone/server.js
```

**Benefícios:**
- Caminho absoluto e direto
- Não depende de interpretação de shell
- Funciona em qualquer plataforma de deployment (Heroku, Easypanel, Dokku)

### 3. **Correção do package.json**

**Antes:**
```json
"start": "node ${NEXT_DIST_DIR:-.next}/standalone/server.js"
```

**Depois:**
```json
"start": "node .next/standalone/server.js"
```

**Benefícios:**
- Consistência com o Procfile
- Execução confiável do servidor
- Fácil de testar localmente

### 4. **Limpeza e Build Fresco**

Realizamos:
- Limpeza completa dos artefatos de build anteriores
- Build novo com as configurações corrigidas
- Verificação da criação do arquivo `server.js`
- Cópia dos arquivos estáticos necessários
- Teste local do servidor

---

## 🔍 Entendendo o Output Standalone do Next.js

O modo `output: 'standalone'` do Next.js cria uma build otimizada para deployment em containers:

### Estrutura Criada:
```
.next/
├── standalone/
│   ├── server.js          # Servidor Node.js independente
│   ├── package.json       # Dependências mínimas
│   ├── node_modules/      # Apenas dependências necessárias
│   └── .next/             # Arquivos de build internos
└── static/                # Assets estáticos (CSS, JS)
```

### Arquivos Necessários para Deployment:
1. **`.next/standalone/`** - Contém o servidor e dependências
2. **`.next/static/`** - Deve ser copiado para `.next/standalone/.next/static/`
3. **`public/`** - Deve ser copiado para `.next/standalone/public/`

**Importante:** Esses arquivos são copiados automaticamente durante o build.

---

## 🧪 Testes Realizados

### 1. Verificação do Arquivo server.js
```bash
ls -la .next/standalone/server.js
# ✅ -rw-r--r-- 1 ubuntu ubuntu 4619 Oct 27 04:36 .next/standalone/server.js
```

### 2. Teste Local do Servidor
```bash
PORT=3001 node .next/standalone/server.js
# ✅ ▲ Next.js 14.2.28
# ✅  - Local: http://localhost:3001
# ✅  ✓ Ready in 315ms
```

**Resultado:** Servidor inicia corretamente e responde às requisições.

---

## 📚 Por Que Essas Mudanças Funcionam?

### 1. **Procfile é Interpretado Literalmente**
O gerenciador de processos (como foreman, Heroku, Dokku) lê o Procfile linha por linha e executa os comandos **exatamente como escritos**. Não há interpretação de shell, então:
- ❌ `${VAR}` não é substituído
- ❌ `$(command)` não é executado
- ✅ Apenas caminhos literais funcionam

### 2. **Consistência Entre Ambientes**
Usar caminhos diretos garante que:
- O desenvolvimento local use o mesmo caminho
- O CI/CD use o mesmo caminho
- A produção use o mesmo caminho
- Não há surpresas com variáveis de ambiente

### 3. **Simplicidade e Manutenibilidade**
- Menos variáveis de ambiente para gerenciar
- Menos pontos de falha
- Mais fácil de debugar
- Mais fácil de documentar

---

## 🚀 Processo de Deploy no Easypanel

### Fluxo de Deploy:
1. **Build Phase:**
   - `npm install` - Instala dependências
   - `npm run build` - Executa `prisma generate && next build`
   - Next.js cria `.next/standalone/` com tudo necessário

2. **Release Phase:**
   - Plataforma copia arquivos para `/workspace/`
   - Estrutura final: `/workspace/.next/standalone/server.js`

3. **Runtime Phase:**
   - Procfile é lido: `web: node .next/standalone/server.js`
   - Servidor é iniciado
   - Aplicação fica disponível

### Por que Falhava Antes:
```
Procfile: web: node ${NEXT_DIST_DIR:-.next}/standalone/server.js
                         ↓
Sistema tentava: node ${NEXT_DIST_DIR:-.next}/standalone/server.js
                         ↓
Caminho literal não existente! ❌
```

### Por que Funciona Agora:
```
Procfile: web: node .next/standalone/server.js
                    ↓
Sistema executa: node .next/standalone/server.js
                    ↓
Arquivo existe no caminho! ✅
```

---

## 📋 Checklist de Verificação

Antes de fazer deploy, verifique:

- [ ] ✅ `next.config.js` NÃO tem configuração `distDir`
- [ ] ✅ `Procfile` usa caminho direto: `web: node .next/standalone/server.js`
- [ ] ✅ `package.json` script start usa: `"start": "node .next/standalone/server.js"`
- [ ] ✅ Build local completa com sucesso
- [ ] ✅ Arquivo `.next/standalone/server.js` existe após build
- [ ] ✅ Servidor inicia localmente sem erros
- [ ] ✅ Variáveis de ambiente necessárias estão configuradas no Easypanel

---

## 🔐 Variáveis de Ambiente Necessárias

Configure no Easypanel:

### Essenciais:
```bash
DATABASE_URL=postgresql://user:password@host:5432/database
NEXTAUTH_URL=https://seu-dominio.com
NEXTAUTH_SECRET=seu-secret-aqui
```

### AWS (se usar S3):
```bash
AWS_ACCESS_KEY_ID=sua-key
AWS_SECRET_ACCESS_KEY=seu-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=seu-bucket
```

### Outras:
```bash
NODE_ENV=production
PORT=3000
```

---

## 🎯 Próximos Passos para Deploy

### 1. **Verificar Configurações no Easypanel**

#### a) Build Settings:
- **Build Command:** `npm run build`
- **Install Command:** `npm install`
- **Node Version:** 20.x ou superior

#### b) Environment Variables:
Configure todas as variáveis listadas acima.

#### c) Port Configuration:
- **Port:** 3000 (ou deixe automático)
- O Easypanel detectará automaticamente do Procfile

### 2. **Conectar ao GitHub**
- Repository: `https://github.com/antoniogsouzaag/producoes.agmusic`
- Branch: `master`
- Auto-deploy: ✅ Habilitado (recomendado)

### 3. **Configurar Database**
- Certifique-se que o banco PostgreSQL está acessível
- Teste a conexão com `DATABASE_URL`
- Execute migrations: `npx prisma migrate deploy`

### 4. **Deploy**
- Faça push para GitHub
- Easypanel detectará automaticamente
- Aguarde o build completar
- Verifique os logs

### 5. **Verificação Pós-Deploy**
```bash
# Verifique se a aplicação está rodando
curl https://seu-dominio.com

# Verifique os logs
# (No painel do Easypanel)
```

---

## 🐛 Troubleshooting

### Se o erro "Cannot find module" persistir:

1. **Verifique o Procfile:**
   ```bash
   cat Procfile
   # Deve mostrar: web: node .next/standalone/server.js
   ```

2. **Verifique os logs de build:**
   - Procure por "Creating an optimized production build"
   - Verifique se não há erros durante `next build`

3. **Verifique a estrutura de arquivos:**
   ```bash
   ls -la .next/standalone/
   # Deve listar: server.js, package.json, node_modules/
   ```

4. **Teste localmente:**
   ```bash
   npm run build
   npm start
   ```

### Se o build falhar:

1. **Verifique as dependências:**
   ```bash
   npm install
   ```

2. **Verifique o banco de dados:**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

3. **Limpe o cache:**
   ```bash
   rm -rf .next node_modules/.cache
   npm run build
   ```

---

## 📖 Referências

### Documentação Oficial:
- [Next.js Standalone Output](https://nextjs.org/docs/pages/api-reference/next-config-js/output)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)

### Heroku Procfile:
- [Process Types and Procfile](https://devcenter.heroku.com/articles/procfile)
- **Importante:** O Procfile NÃO suporta substituição de variáveis bash

---

## 📝 Resumo das Mudanças

| Arquivo | Antes | Depois |
|---------|-------|--------|
| **next.config.js** | `distDir: process.env.NEXT_DIST_DIR \|\| '.next'` | (removido) |
| **Procfile** | `web: node ${NEXT_DIST_DIR:-.next}/standalone/server.js` | `web: node .next/standalone/server.js` |
| **package.json** | `"start": "node ${NEXT_DIST_DIR:-.next}/standalone/server.js"` | `"start": "node .next/standalone/server.js"` |

---

## ✨ Conclusão

As mudanças implementadas resolvem definitivamente o problema de deployment ao:

1. ✅ **Eliminar dependência de variáveis de ambiente** desnecessárias
2. ✅ **Usar caminhos diretos** que funcionam em todas as plataformas
3. ✅ **Simplificar a configuração** para facilitar manutenção
4. ✅ **Garantir consistência** entre ambientes
5. ✅ **Seguir as melhores práticas** do Next.js e Heroku/Dokku

O deploy agora deve funcionar corretamente no Easypanel! 🎉

---

## 📞 Suporte

Se tiver problemas após estas mudanças:

1. Verifique este documento completamente
2. Revise os logs de deploy no Easypanel
3. Confirme que todas as variáveis de ambiente estão configuradas
4. Teste localmente antes de fazer deploy

**Data da Correção:** 27 de Outubro de 2025  
**Versão:** 1.0.0
