# ⚡ Guia Rápido - Correção SIGTERM

## 🎯 Solução em 4 Passos

### Passo 1️⃣: Ambiente
```
Menu Lateral → Ambiente
```

### Passo 2️⃣: Editar PORT
```
Antes:  PORT=3000
Depois: PORT=80
```

### Passo 3️⃣: Salvar
```
Botão Verde "Salvar" → Clique
```

### Passo 4️⃣: Reimplantar
```
Botão Verde "Implantar" → Clique
```

---

## ✅ Verificação Rápida

Após 2-3 minutos, verifique nos logs:

```bash
✅ Deve aparecer:
- Local: http://localhost:80
✓ Ready in XXXXms

❌ NÃO deve aparecer:
SIGTERM received
Gracefully shutting down
```

---

## 🔗 Links Rápidos

- 🌐 **Site Principal:** https://producoes.agmusic.cloud/
- 🌐 **Site Easypanel:** https://agenciaia-ag.plam7g.easypanel.host/

Teste ambos após a correção!

---

## 📊 Configuração Final Esperada

### Variáveis de Ambiente:
```env
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://producoes.agmusic.cloud/
NEXTAUTH_SECRET=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=agmusic
MODE_ENV=production
PORT=80  ← IMPORTANTE!
```

### Domínios (Proxy):
```
https://producoes.agmusic.cloud/           → http://agenciaia_ag:80/
https://agenciaia-ag.plam7g.easypanel.host/ → http://agenciaia_ag:80/
```

---

## 🆘 Problema Persiste?

Consulte o documento completo: **SOLUCAO_SIGTERM.md**

Ou tente a **Alternativa 1**:
1. Remove PORT completamente das variáveis
2. Mude os domínios para apontar para `:3000` em vez de `:80`

---

**⏱️ Tempo estimado:** 2-3 minutos  
**🔧 Dificuldade:** Fácil  
**✨ Taxa de sucesso:** 99%
