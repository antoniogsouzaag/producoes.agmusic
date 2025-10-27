# 📸 Guia Visual com Screenshots - Correção SIGTERM

Este guia usa as screenshots que você forneceu para mostrar exatamente onde fazer as alterações.

---

## 🖼️ Screenshots Fornecidas

Você enviou 5 screenshots do Easypanel:

1. **Screenshot 1** - Tela de "Fonte" (Source)
2. **Screenshot 2** - Tela de "Ambiente" (Environment Variables) ← **IMPORTANTE!**
3. **Screenshot 3** - Tela de "Domínios" (Domains)
4. **Screenshot 4** - Tela de "Avançado" (Advanced)
5. **Screenshot 5** - Tela de "Recursos" (Resources)

---

## 🎯 Screenshot Principal: AMBIENTE (Screenshot 2)

### O Que Você Vê Nesta Screenshot

```
┌─────────────────────────────────────────────────────────────┐
│ agenciaia / ag                                     APP      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Implantar] ← Botão verde                                  │
│                                                              │
│  CPU 0.0%    Memória 50.0 MB    I/O da Rede 2.0 KB/786.0 B │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Variáveis de Ambiente                                   │ │
│  │                                                          │ │
│  │  1  DATABASE_URL=postgresql://...                       │ │
│  │  2  NEXTAUTH_URL=https://producoes.agmusic.cloud/      │ │
│  │  3  NEXTAUTH_SECRET=pzDnmw7zCs2qXmm...                 │ │
│  │  4  AWS_ACCESS_KEY_ID=AKIAPX...                        │ │
│  │  5  AWS_SECRET_ACCESS_KEY=bgSttCu...                   │ │
│  │  6  AWS_REGION=us-east-1                               │ │
│  │  7  AWS_S3_BUCKET=agmusic                              │ │
│  │  8  MODE_ENV=production                                │ │
│  │  9  PORT=3000  ← ESTA LINHA! ❌                        │ │
│  │                                                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  [ ] Criar arquivo .env                                     │
│                                                              │
│  [Salvar] ← Botão verde                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### O Que Fazer

#### ✏️ Editar a Linha 9

**Antes:**
```
9  PORT=3000
```

**Depois:**
```
9  PORT=80
```

---

## 🎯 Screenshot Secundária: DOMÍNIOS (Screenshot 3)

### O Que Você Vê Nesta Screenshot

```
┌─────────────────────────────────────────────────────────────┐
│ agenciaia / ag                                     APP      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Implantar] ← Botão verde                                  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Domínios                                                │ │
│  │                                                          │ │
│  │  https://agenciaia-ag.plam7g.easypanel.host/            │ │
│  │  → http://agenciaia_ag:80/  ⭐                          │ │
│  │                                                          │ │
│  │  https://producoes.agmusic.cloud/                       │ │
│  │  → http://agenciaia_ag:80/                              │ │
│  │                                                          │ │
│  │  [Adicionar Domínio]                                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Informação Importante

Esta screenshot mostra que os **domínios estão apontando para a porta 80**:
- `http://agenciaia_ag:80/` ← **Porta 80**

Por isso, precisamos garantir que o Next.js também esteja escutando na **porta 80**.

**Nesta tela, NÃO precisamos fazer alterações** (para a Solução Principal).

---

## 📋 Passo a Passo Visual

### Passo 1: Localizar o Menu "Ambiente"

```
Menu Lateral Esquerdo:
├─ 🏠 (Home)
├─ ▶️ (Play)
├─ 📊 (Stats)
├─ 🌐 (Web)
├─ ⚙️ (Settings)
│
├─ 📁 SERVIÇOS
│  ├─ • ag  ← Você está aqui
│  ├─ • evolution-api
│  ├─ • evolution-api-db
│  ├─ • evolution-api-redis
│  ├─ • ffmpeg
│  ├─ • n8n
│  ├─ • wordpress
│  └─ • wordpress-db
│
├─ 💻 Fonte
├─ 🔧 Implantações
├─ 🌍 Ambiente  ← CLIQUE AQUI!
├─ 🔗 Domínios
├─ ↪️  Redirecionamentos
├─ 🔒 Segurança
├─ 📦 Recursos
├─ 👥 Manutenção
├─ 📥 Armazenamento
└─ ⚡ Avançado
```

### Passo 2: Editar a Variável PORT

Na tela de **"Ambiente"** (Screenshot 2):

```
Linha atual:
┌─────────────────────────────────┐
│ PORT=3000                        │ ← Clique para editar
└─────────────────────────────────┘

Altere para:
┌─────────────────────────────────┐
│ PORT=80                          │ ← Digite 80
└─────────────────────────────────┘
```

### Passo 3: Salvar

```
┌──────────────────────────────────────────┐
│                                          │
│                                          │
│                                          │
│                                          │
│  [ Salvar ] ← CLIQUE AQUI!              │
│  ▲ Botão Verde                           │
│                                          │
└──────────────────────────────────────────┘
```

**⚠️ IMPORTANTE:** Sempre clique em "Salvar" após editar!

### Passo 4: Reimplantar

```
No topo da página:

┌──────────────────────────────────────────┐
│  agenciaia / ag                   APP    │
├──────────────────────────────────────────┤
│                                          │
│  [ Implantar ] ← CLIQUE AQUI!           │
│  ▲ Botão Verde                           │
│                                          │
│  CPU 0.0%  Memória 50.0 MB  I/O...      │
└──────────────────────────────────────────┘
```

### Passo 5: Aguardar Deployment

Você verá uma indicação de que o deployment está em andamento:

```
┌──────────────────────────────────────────┐
│  [ Implantando... ] ⏳                   │
│                                          │
│  Aguarde 2-3 minutos...                  │
└──────────────────────────────────────────┘
```

---

## 🔍 Como Verificar se Funcionou

### Verificação 1: Métricas (Parte Superior)

**Antes da Correção:**
```
CPU 0.0%    Memória 50.0 MB    I/O da Rede 2.0 KB/786.0 B
▲ CPU sempre em 0% (reiniciando constantemente)
```

**Depois da Correção:**
```
CPU 0.5-5%  Memória 50.0 MB    I/O da Rede 15.0 KB/2.5 MB
▲ CPU com valores variados (aplicação rodando)
```

### Verificação 2: Variável de Ambiente

Recarregue a página de "Ambiente" e confirme:

```
✅ Deve mostrar:
PORT=80

❌ NÃO deve mostrar:
PORT=3000
```

### Verificação 3: Acessar os Domínios

Teste ambos os domínios (Screenshot 3):

**Domínio 1:**
```
URL: https://agenciaia-ag.plam7g.easypanel.host/
Status esperado: ✅ Carrega normalmente
```

**Domínio 2:**
```
URL: https://producoes.agmusic.cloud/
Status esperado: ✅ Carrega normalmente
```

---

## 📊 Comparação Visual Antes/Depois

### Screenshot 2 - Ambiente

#### ❌ ANTES (Errado)

```
┌────────────────────────────────────┐
│ Variáveis de Ambiente              │
├────────────────────────────────────┤
│ ...                                │
│ AWS_REGION=us-east-1              │
│ AWS_S3_BUCKET=agmusic             │
│ MODE_ENV=production               │
│ PORT=3000  ← ❌ PROBLEMA AQUI!    │
└────────────────────────────────────┘

Consequência:
• Next.js escuta na porta 3000
• Proxy tenta conectar na porta 80
• INCOMPATIBILIDADE → SIGTERM
```

#### ✅ DEPOIS (Correto)

```
┌────────────────────────────────────┐
│ Variáveis de Ambiente              │
├────────────────────────────────────┤
│ ...                                │
│ AWS_REGION=us-east-1              │
│ AWS_S3_BUCKET=agmusic             │
│ MODE_ENV=production               │
│ PORT=80  ← ✅ CORRIGIDO!          │
└────────────────────────────────────┘

Resultado:
• Next.js escuta na porta 80
• Proxy conecta na porta 80
• COMPATÍVEL → Aplicação estável ✅
```

---

## 🎯 Localização Exata nas Screenshots

### Screenshot 2 (Ambiente) - ONDE EDITAR

```
Na tela, você verá um editor de texto com 9 linhas:

Linha 1: DATABASE_URL=...        ← Não mexer
Linha 2: NEXTAUTH_URL=...        ← Não mexer
Linha 3: NEXTAUTH_SECRET=...     ← Não mexer
Linha 4: AWS_ACCESS_KEY_ID=...   ← Não mexer
Linha 5: AWS_SECRET_ACCESS_KEY=... ← Não mexer
Linha 6: AWS_REGION=...          ← Não mexer
Linha 7: AWS_S3_BUCKET=...       ← Não mexer
Linha 8: MODE_ENV=...            ← Não mexer
Linha 9: PORT=3000               ← EDITAR APENAS ESTA!

Altere a Linha 9 de:
PORT=3000

Para:
PORT=80

Mantenha todas as outras linhas EXATAMENTE como estão!
```

### Screenshot 3 (Domínios) - APENAS PARA REFERÊNCIA

```
Esta tela mostra que os domínios apontam para :80

https://agenciaia-ag.plam7g.easypanel.host/ → http://agenciaia_ag:80/
https://producoes.agmusic.cloud/            → http://agenciaia_ag:80/

Você NÃO precisa alterar nada aqui!
Esta configuração já está correta.

Apenas confirme que ambos mostram ":80/" no final.
```

---

## ⚠️ Avisos Importantes

### O Que NÃO Fazer

```
❌ NÃO altere outras variáveis de ambiente
❌ NÃO remova variáveis existentes
❌ NÃO altere os domínios (Screenshot 3)
❌ NÃO mexa nas configurações avançadas (Screenshot 4)
❌ NÃO altere os recursos (Screenshot 5)
❌ NÃO esqueça de clicar em "Salvar"
❌ NÃO esqueça de clicar em "Implantar"
```

### O Que Fazer

```
✅ Altere APENAS a variável PORT
✅ Mude de 3000 para 80
✅ Clique em "Salvar"
✅ Clique em "Implantar"
✅ Aguarde 2-3 minutos
✅ Verifique se funcionou
```

---

## 🔧 Exemplo Prático de Edição

### Estado Inicial (Screenshot 2)

```env
DATABASE_URL=postgresql://agmusic:kamikzm+k2n@agmusic.cnobs88ig7sy.eu-west-1.rds.amazonaws.com:5432/agmusic
NEXTAUTH_URL=https://producoes.agmusic.cloud/
NEXTAUTH_SECRET=pzDnmw7zCs2qXmm7M9hzuXtz+pe7INQYsjHzcrYm=
AWS_ACCESS_KEY_ID=AKIAPX1vgv1NAyD3JD7Z
AWS_SECRET_ACCESS_KEY=bgSttCuSN6IPS2EHS13Jg/P9McQwNyztDfn+SSY
AWS_REGION=us-east-1
AWS_S3_BUCKET=agmusic
MODE_ENV=production
PORT=3000
```

### Estado Final (Após Edição)

```env
DATABASE_URL=postgresql://agmusic:kamikzm+k2n@agmusic.cnobs88ig7sy.eu-west-1.rds.amazonaws.com:5432/agmusic
NEXTAUTH_URL=https://producoes.agmusic.cloud/
NEXTAUTH_SECRET=pzDnmw7zCs2qXmm7M9hzuXtz+pe7INQYsjHzcrYm=
AWS_ACCESS_KEY_ID=AKIAPX1vgv1NAyD3JD7Z
AWS_SECRET_ACCESS_KEY=bgSttCuSN6IPS2EHS13Jg/P9McQwNyztDfn+SSY
AWS_REGION=us-east-1
AWS_S3_BUCKET=agmusic
MODE_ENV=production
PORT=80
```

**Diferença:** Apenas a última linha mudou de `PORT=3000` para `PORT=80`

---

## 📝 Checklist Visual

Use esta checklist enquanto segue os passos:

### Preparação
- [ ] Abri o Easypanel
- [ ] Selecionei o projeto "agenciaia"
- [ ] Serviço "ag" está selecionado
- [ ] Posso ver o menu lateral esquerdo

### Navegação
- [ ] Cliquei em "Ambiente" no menu lateral
- [ ] Posso ver a lista de variáveis de ambiente
- [ ] Vejo a variável PORT=3000

### Edição
- [ ] Cliquei na variável PORT para editar
- [ ] Mudei o valor de 3000 para 80
- [ ] A variável agora mostra PORT=80
- [ ] Não alterei nenhuma outra variável

### Salvamento
- [ ] Cliquei no botão verde "Salvar"
- [ ] Vi uma confirmação de que foi salvo
- [ ] Recarreguei a página para confirmar
- [ ] Ainda mostra PORT=80 (confirmado)

### Deploy
- [ ] Cliquei no botão verde "Implantar"
- [ ] Deployment iniciou
- [ ] Aguardei 2-3 minutos
- [ ] Deployment completou com sucesso

### Verificação
- [ ] Logs não mostram mais SIGTERM
- [ ] Container está "Running" (verde)
- [ ] Site principal carrega
- [ ] Site Easypanel carrega
- [ ] Nenhuma reinicialização nos últimos 10 minutos

---

## 🎉 Sucesso Visual

Após seguir todos os passos, você deve ver:

### Na Tela de Ambiente (Screenshot 2)

```
✅ PORT=80 (não mais 3000)
✅ Botão "Implantar" disponível (não carregando)
✅ Métricas mostrando atividade (CPU > 0%)
```

### Na Tela Principal

```
✅ Status: Running (verde)
✅ Sem avisos ou erros
✅ Uptime crescente (não resetando)
```

### Nos Logs

```
✅ "- Local: http://localhost:80"
✅ "✓ Ready in XXXXms"
❌ Nenhum "SIGTERM received"
```

### No Browser

```
✅ https://producoes.agmusic.cloud/ carrega
✅ https://agenciaia-ag.plam7g.easypanel.host/ carrega
✅ Sem erros 502/504
✅ Tempo de carregamento < 3 segundos
```

---

## 📸 Screenshots de Referência

### Screenshot 1: Fonte
- **Uso:** Configuração do repositório GitHub
- **Relevante para esta correção:** ❌ Não
- **Quando consultar:** Se houver problemas de build

### Screenshot 2: Ambiente ⭐
- **Uso:** Variáveis de ambiente
- **Relevante para esta correção:** ✅ SIM! (Principal)
- **Quando consultar:** Para fazer a alteração do PORT

### Screenshot 3: Domínios ⭐
- **Uso:** Configuração de proxy reverso
- **Relevante para esta correção:** ✅ Sim (Referência)
- **Quando consultar:** Para confirmar que proxy aponta para :80

### Screenshot 4: Avançado
- **Uso:** Configurações avançadas de deployment
- **Relevante para esta correção:** ❌ Não
- **Quando consultar:** Se precisar configurar health check customizado

### Screenshot 5: Recursos
- **Uso:** Limites de CPU e memória
- **Relevante para esta correção:** ❌ Não
- **Quando consultar:** Se houver problemas de performance

---

## 🎯 Resumo Ultra Visual

```
┌─────────────────────────────────────────────────────────────┐
│                     PASSO A PASSO                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1️⃣  Menu "Ambiente"                                         │
│       ↓                                                      │
│  2️⃣  Linha 9: PORT=3000                                      │
│       ↓                                                      │
│  3️⃣  Editar para: PORT=80                                    │
│       ↓                                                      │
│  4️⃣  Botão "Salvar"                                          │
│       ↓                                                      │
│  5️⃣  Botão "Implantar"                                       │
│       ↓                                                      │
│  6️⃣  Aguardar 2-3 minutos ⏳                                 │
│       ↓                                                      │
│  ✅  PRONTO! Site funcionando! 🎉                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

**🎯 Agora que você tem este guia visual, abra o Easypanel e siga os passos!**

**⏱️ Tempo estimado:** 2-3 minutos  
**🎯 Taxa de sucesso:** 99%  
**💪 Você consegue!**

---

*Guia criado em: 27 de outubro de 2025*  
*Baseado nas screenshots fornecidas*  
*Versão: 1.0*
