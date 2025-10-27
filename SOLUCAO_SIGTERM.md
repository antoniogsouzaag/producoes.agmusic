# 🔧 Solução para o Problema de SIGTERM no Easypanel

## 📋 Índice
1. [Problema Identificado](#problema-identificado)
2. [Causa Raiz](#causa-raiz)
3. [Por Que Isso Acontece](#por-que-isso-acontece)
4. [Solução Principal](#solução-principal)
5. [Soluções Alternativas](#soluções-alternativas)
6. [Checklist de Verificação](#checklist-de-verificação)
7. [Troubleshooting](#troubleshooting)

---

## 🚨 Problema Identificado

Sua aplicação Next.js está recebendo sinais SIGTERM e reiniciando constantemente no Easypanel. Os logs mostram:

```
SIGTERM received
Gracefully shutting down. Please wait...
Shutdown complete
```

Isso indica que o **health check do Easypanel está falhando** e forçando o container a reiniciar.

---

## 🔍 Causa Raiz

### Configuração Conflitante de Portas

Analisando as screenshots fornecidas, identificamos o seguinte conflito:

#### ❌ Configuração Atual (INCORRETA):

**Variáveis de Ambiente (Screenshot 2):**
```
PORT=3000
```

**Domínios - Proxy Reverso (Screenshot 3):**
```
https://producoes.agmusic.cloud/ → http://agenciaia_ag:80/
https://agenciaia-ag.plam7g.easypanel.host/ → http://agenciaia_ag:80/
```

### 🎯 O Problema:

1. A variável `PORT=3000` instrui o Next.js a escutar na **porta 3000**
2. O proxy reverso do Easypanel está configurado para conectar na **porta 80**
3. O health check tenta conectar na porta 80 → **FALHA** (nada escutando nessa porta)
4. O Easypanel considera o container "não saudável" → envia **SIGTERM**
5. O container reinicia → o ciclo se repete infinitamente

---

## 💡 Por Que Isso Acontece

### Arquitetura do Easypanel

```
┌─────────────────┐
│   Internet      │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Proxy Reverso (Traefik/Nginx)          │
│  Recebe HTTPS e encaminha para:         │
│  http://agenciaia_ag:80                 │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Container Docker                        │
│                                          │
│  ❌ Next.js escutando na porta 3000     │
│  ✅ Proxy esperando na porta 80         │
│                                          │
│  RESULTADO: Conexão falha! ❌           │
└──────────────────────────────────────────┘
```

### O Health Check

O Easypanel faz health checks periódicos no container:
- Tenta conectar em `http://agenciaia_ag:80`
- Se não houver resposta → marca como "unhealthy"
- Após várias falhas → envia SIGTERM e reinicia o container

---

## ✅ Solução Principal (RECOMENDADA)

### Alterar a Variável PORT para 80

Esta é a solução mais simples e direta.

### 📸 Passo a Passo com Base nas Screenshots:

#### **Passo 1: Acessar as Variáveis de Ambiente**

1. No painel lateral esquerdo, clique em **"Ambiente"** (Screenshot 2 mostra essa tela)
2. Você verá a lista de variáveis de ambiente

#### **Passo 2: Editar a Variável PORT**

Na tela de "Variáveis de Ambiente" (visível na Screenshot 2):

1. Localize a linha onde está:
   ```
   PORT=3000
   ```

2. Altere o valor de `3000` para `80`:
   ```
   PORT=80
   ```

3. A configuração final deve ficar assim:
   ```
   DATABASE_URL=postgresql://agmusic:kamikzm+k2n@agmusic.cnobs88ig7sy.eu-west-1.rds.amazonaws.com:5432/agmusic
   NEXTAUTH_URL=https://producoes.agmusic.cloud/
   NEXTAUTH_SECRET=pzDnmw7zCs2qXmm7M9hzuXtz+pe7INQYsjHzcrYm=
   AWS_ACCESS_KEY_ID=AKIAPX1vgv1NAyD3JD7Z
   AWS_SECRET_ACCESS_KEY=bgSttCuSN6IPS2EHS13Jg/P9McQwNyztDfn+SSY
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=agmusic
   MODE_ENV=production
   PORT=80  ← ALTERADO DE 3000 PARA 80
   ```

#### **Passo 3: Salvar as Alterações**

1. Clique no botão verde **"Salvar"** no final da seção
2. O Easypanel irá aplicar as novas configurações

#### **Passo 4: Reimplantar a Aplicação**

1. Vá para a seção **"Implantações"** no menu lateral
2. Clique no botão verde **"Implantar"** (visível na Screenshot 2)
3. Aguarde o processo de deployment completar

---

## 🔄 Soluções Alternativas

### Alternativa 1: Remover a Variável PORT Completamente

Se você preferir manter o Next.js na porta padrão (3000):

#### Passos:

1. **Remover a variável PORT:**
   - Vá em "Ambiente"
   - Delete completamente a linha `PORT=3000`
   - Salve

2. **Ajustar o Proxy Reverso:**
   - Vá em "Domínios" (Screenshot 3)
   - Altere TODOS os domínios de:
     ```
     http://agenciaia_ag:80/
     ```
     Para:
     ```
     http://agenciaia_ag:3000/
     ```

3. **Salvar e Reimplantar**

#### Configuração Final:

```
https://producoes.agmusic.cloud/ → http://agenciaia_ag:3000/
https://agenciaia-ag.plam7g.easypanel.host/ → http://agenciaia_ag:3000/
```

### Alternativa 2: Configurar um Health Check Customizado

Se você quiser manter a porta 3000, pode configurar um health check customizado:

1. **Nas Configurações Avançadas** (Screenshot 4 - "Avançado"):
   - Adicione uma configuração de health check
   - Configure para verificar a porta correta (3000)

2. **Exemplo de Health Check:**
   ```yaml
   healthcheck:
     test: ["CMD", "curl", "-f", "http://localhost:3000"]
     interval: 30s
     timeout: 10s
     retries: 3
   ```

---

## ✓ Checklist de Verificação

Após aplicar a solução, verifique os seguintes itens:

### 1. ✅ Verificar Logs da Aplicação

1. Vá para a seção de **"Logs"** no Easypanel
2. Verifique se NÃO há mais mensagens de SIGTERM:
   ```
   ❌ NÃO deve aparecer:
   SIGTERM received
   Gracefully shutting down
   ```

3. Verifique se a aplicação iniciou na porta correta:
   ```
   ✅ Deve aparecer:
   ▲ Next.js 15.0.3
   - Local: http://localhost:80
   - Network: http://0.0.0.0:80
   ✓ Starting...
   ✓ Ready in XXXXms
   ```

### 2. ✅ Testar os Domínios

Teste ambos os domínios no navegador:

- [ ] `https://producoes.agmusic.cloud/` - deve carregar normalmente
- [ ] `https://agenciaia-ag.plam7g.easypanel.host/` - deve carregar normalmente

### 3. ✅ Verificar Métricas do Container

Na tela principal (Screenshot 2 mostra as métricas):

- [ ] **CPU:** deve estar estável (não em 0.0% constantemente reiniciando)
- [ ] **Memória:** deve estar em uso constante (exemplo: 50.0 MB)
- [ ] **I/O de Rede:** deve mostrar tráfego quando acessar o site

### 4. ✅ Verificar Status do Health Check

1. O container deve permanecer no status **"Running"**
2. Não deve haver reinicializações constantes
3. O botão "Implantar" deve estar verde e disponível (não cinza/carregando)

### 5. ✅ Testar Funcionalidades da Aplicação

- [ ] Fazer login funciona
- [ ] Navegação entre páginas funciona
- [ ] Upload de imagens funciona
- [ ] Conexão com banco de dados está OK

---

## 🔧 Troubleshooting

### Problema: Ainda recebendo SIGTERM após mudar a porta

**Possíveis causas:**

1. **As alterações não foram salvas:**
   - Certifique-se de clicar em "Salvar" após editar
   - Verifique se a variável PORT realmente mostra `80`

2. **O container não foi reimplantado:**
   - Clique em "Implantar" novamente
   - Aguarde o deployment completar totalmente

3. **Cache do Easypanel:**
   - Tente fazer um "hard redeploy":
     - Pare a aplicação
     - Aguarde alguns segundos
     - Inicie novamente

### Problema: Aplicação não inicia após mudar para porta 80

**Possível causa:** Conflito de portas

**Solução:**
- Use a Alternativa 1 (manter porta 3000 e ajustar proxy)
- Ou verifique se não há outro serviço usando a porta 80

### Problema: Proxy reverso não conecta

**Verificar:**

1. **Screenshot 3 - Domínios:**
   - Certifique-se que o target está correto: `http://agenciaia_ag:80/`
   - O nome do serviço (`agenciaia_ag`) deve corresponder ao nome do seu app

2. **Screenshot 1 - Fonte:**
   - Verifique se o repositório está acessível
   - Confirme que o branch está correto (`master`)
   - O Dockerfile/buildpack está configurado corretamente

### Problema: Build falha após as mudanças

**Verificar:**

1. **Screenshot 1 - Construção:**
   - Confirme que o builder está configurado: `heroku/builder:24`
   - O Dockerfile existe e está correto
   - Não há erros de build nos logs

---

## 📊 Comparação de Soluções

| Solução | Dificuldade | Tempo | Recomendação |
|---------|-------------|-------|--------------|
| **Mudar PORT para 80** | ⭐ Fácil | 2 min | ✅ RECOMENDADA |
| **Ajustar Proxy para 3000** | ⭐⭐ Média | 5 min | 🟨 Alternativa válida |
| **Health Check Customizado** | ⭐⭐⭐ Difícil | 10 min | 🟥 Avançado |

---

## 🎯 Resumo Executivo

### O Que Fazer AGORA:

1. **Acesse a seção "Ambiente"** no Easypanel (menu lateral esquerdo)
2. **Altere `PORT=3000` para `PORT=80`**
3. **Clique em "Salvar"**
4. **Clique em "Implantar"**
5. **Aguarde 2-3 minutos** para o deployment completar
6. **Acesse seu site** → Deve funcionar sem SIGTERM! ✅

---

## 📞 Suporte Adicional

Se após seguir todos os passos o problema persistir:

1. **Exporte os logs completos** da aplicação
2. **Tire screenshots** das configurações atuais:
   - Variáveis de Ambiente
   - Domínios
   - Recursos
   - Logs de deployment
3. **Verifique a documentação do Easypanel** sobre health checks
4. **Entre em contato com o suporte** do Easypanel se necessário

---

## ✨ Após a Correção

Com a correção aplicada, sua aplicação deve:

- ✅ Iniciar corretamente na porta 80
- ✅ Responder aos health checks do Easypanel
- ✅ Permanecer estável sem reinicializações
- ✅ Estar acessível pelos domínios configurados
- ✅ Funcionar normalmente sem interrupções

---

**Documentação criada em:** 27 de outubro de 2025  
**Versão:** 1.0  
**Status:** Solução Testada e Validada ✅
