# ✓ Checklist de Verificação Pós-Correção

Use esta checklist para confirmar que o problema foi completamente resolvido.

---

## 📋 Fase 1: Pré-Correção

Antes de aplicar a correção, documente o estado atual:

- [ ] **Screenshot dos logs mostrando SIGTERM**
  - Arquivo: `logs_antes.png`
  - Localização: Salve para comparação

- [ ] **Screenshot da variável PORT=3000**
  - Arquivo: `config_antes.png`
  - Confirme o valor antigo

- [ ] **Teste de acesso ao site (deve falhar ou ser instável)**
  - URL: https://producoes.agmusic.cloud/
  - Status: `[ ] Carrega  [ ] Erro  [ ] Timeout  [ ] Instável`

- [ ] **Horário de início da correção:** ________________

---

## 🔧 Fase 2: Aplicação da Correção

Siga exatamente nesta ordem:

### Passo 1: Acesso ao Easypanel
- [ ] Login realizado com sucesso
- [ ] Projeto "agenciaia" selecionado
- [ ] Serviço "ag" visível na lista

### Passo 2: Navegação para Ambiente
- [ ] Menu lateral "Ambiente" clicado
- [ ] Lista de variáveis carregada
- [ ] Variável PORT localizada

### Passo 3: Edição da Variável PORT
- [ ] Valor antigo confirmado: `PORT=3000`
- [ ] Valor alterado para: `PORT=80`
- [ ] Nenhuma outra variável foi modificada acidentalmente

### Passo 4: Salvamento
- [ ] Botão "Salvar" clicado
- [ ] Mensagem de confirmação exibida
- [ ] Alteração persistida (recarregue a página para confirmar)

### Passo 5: Reimplantação
- [ ] Seção "Implantações" acessada
- [ ] Botão "Implantar" clicado
- [ ] Processo de build iniciado
- [ ] **Aguardar 2-3 minutos** ⏳

---

## ✅ Fase 3: Verificação Imediata (0-5 minutos)

### Logs da Aplicação

Acesse os logs e verifique:

- [ ] **Build completou com sucesso**
  ```
  ✓ Esperado: "Build succeeded"
  ❌ Se falhar: Verifique erros de build
  ```

- [ ] **Aplicação iniciou**
  ```
  ✓ Esperado: "▲ Next.js 15.0.3"
  ❌ Se não aparecer: Build pode ter falhado
  ```

- [ ] **Porta correta está sendo usada**
  ```
  ✓ Esperado: "- Local: http://localhost:80"
  ❌ Se mostrar :3000: Variável não foi aplicada
  ```

- [ ] **Status "Ready" apareceu**
  ```
  ✓ Esperado: "✓ Ready in XXXXms"
  ❌ Se timeout: Verificar erros de inicialização
  ```

- [ ] **NÃO há mensagens de SIGTERM**
  ```
  ❌ Se aparecer "SIGTERM received": Problema persiste
  ✓ Esperado: Nenhuma mensagem de SIGTERM
  ```

### Métricas do Container

Na tela principal do serviço:

- [ ] **CPU está estável**
  ```
  ✓ Esperado: 0.5% - 5% (varia com uso)
  ❌ Se 0.0% constante: Container pode estar crashando
  ```

- [ ] **Memória está em uso**
  ```
  ✓ Esperado: 40-100 MB
  ❌ Se 0 MB: Container não iniciou
  ```

- [ ] **I/O de Rede mostra atividade**
  ```
  ✓ Esperado: Valores maiores que 0 KB
  ❌ Se 0 KB/0 B: Sem tráfego de rede
  ```

- [ ] **Container está "Running" (verde)**
  ```
  ✓ Esperado: Status verde/ativo
  ❌ Se amarelo/vermelho: Problema de health check
  ```

---

## 🌐 Fase 4: Testes de Acesso (5-10 minutos)

### Teste 1: Domínio Principal

**URL:** https://producoes.agmusic.cloud/

- [ ] **Página carrega sem erros**
- [ ] **Tempo de carregamento:** _______ segundos
- [ ] **Status HTTP:** `[ ] 200 OK  [ ] Outro: _____`
- [ ] **Conteúdo exibido corretamente**

**Screenshot:** `teste_dominio_principal.png`

### Teste 2: Domínio Easypanel

**URL:** https://agenciaia-ag.plam7g.easypanel.host/

- [ ] **Página carrega sem erros**
- [ ] **Tempo de carregamento:** _______ segundos
- [ ] **Status HTTP:** `[ ] 200 OK  [ ] Outro: _____`
- [ ] **Conteúdo idêntico ao domínio principal**

**Screenshot:** `teste_dominio_easypanel.png`

### Teste 3: Funcionalidades Críticas

#### Navegação
- [ ] **Home page carrega**
- [ ] **Página de login carrega**
- [ ] **Navegação entre páginas funciona**
- [ ] **Links internos funcionam**

#### Autenticação
- [ ] **Login funciona**
  - Usuário teste: ________________
  - Login bem-sucedido: `[ ] Sim  [ ] Não`
  - Tempo de resposta: _______ segundos

- [ ] **Sessão persiste**
  - Recarregue a página
  - Ainda está logado: `[ ] Sim  [ ] Não`

#### Recursos S3/AWS
- [ ] **Upload de imagem funciona**
  - Teste: Upload de uma imagem pequena
  - Sucesso: `[ ] Sim  [ ] Não`
  - URL da imagem: ________________

- [ ] **Imagens são exibidas**
  - Imagens carregam nos cards/páginas
  - Sucesso: `[ ] Sim  [ ] Não`

#### Banco de Dados
- [ ] **Dados são carregados**
  - Listas/tabelas exibem informações
  - Sucesso: `[ ] Sim  [ ] Não`

- [ ] **Dados podem ser salvos**
  - Crie/edite um item teste
  - Sucesso: `[ ] Sim  [ ] Não`

---

## 🔄 Fase 5: Teste de Estabilidade (30 minutos - 1 hora)

### Monitoramento Contínuo

Após os testes iniciais, monitore por pelo menos 30 minutos:

**Horário de início:** ________________

#### A cada 10 minutos, verifique:

**10 minutos:**
- [ ] Container ainda está "Running"
- [ ] Nenhum SIGTERM nos logs
- [ ] Site ainda acessível
- [ ] Timestamp: ________________

**20 minutos:**
- [ ] Container ainda está "Running"
- [ ] Nenhum SIGTERM nos logs
- [ ] Site ainda acessível
- [ ] Timestamp: ________________

**30 minutos:**
- [ ] Container ainda está "Running"
- [ ] Nenhum SIGTERM nos logs
- [ ] Site ainda acessível
- [ ] Timestamp: ________________

**1 hora (opcional):**
- [ ] Container ainda está "Running"
- [ ] Nenhum SIGTERM nos logs
- [ ] Site ainda acessível
- [ ] Timestamp: ________________

### Teste de Carga Leve

Simule uso normal:

- [ ] **Abra 5 abas do site**
  - Todas carregam: `[ ] Sim  [ ] Não`
  - Tempo médio: _______ segundos

- [ ] **Navegue entre páginas múltiplas vezes**
  - Sem erros: `[ ] Sim  [ ] Não`
  - Sem lentidão: `[ ] Sim  [ ] Não`

- [ ] **Faça login/logout 3 vezes**
  - Sempre funciona: `[ ] Sim  [ ] Não`
  - Sem mensagens de erro: `[ ] Sim  [ ] Não`

---

## 📊 Fase 6: Comparação Antes/Depois

### Logs

| Métrica | Antes da Correção | Depois da Correção |
|---------|-------------------|-------------------|
| SIGTERM ocorrências | _______ vezes | _______ vezes |
| Reinicializações | _______ vezes | _______ vezes |
| Tempo de uptime | _______ min | _______ min |
| Porta em uso | 3000 | 80 |

### Performance

| Métrica | Antes da Correção | Depois da Correção |
|---------|-------------------|-------------------|
| Tempo carregamento homepage | _______ s | _______ s |
| Tempo de resposta login | _______ s | _______ s |
| Estabilidade (1-10) | _______ | _______ |
| Disponibilidade (%) | _______% | _______% |

---

## ✨ Fase 7: Validação Final

### Critérios de Sucesso

Para considerar o problema **COMPLETAMENTE RESOLVIDO**, todos devem estar ✅:

- [ ] **Nenhum SIGTERM** nos últimos 30 minutos
- [ ] **Container estável** (sem reinicializações)
- [ ] **Ambos os domínios** acessíveis e funcionando
- [ ] **Todas as funcionalidades** testadas e operacionais
- [ ] **Logs mostram** porta 80 sendo usada
- [ ] **Health checks** passando (container "Running")
- [ ] **Métricas estáveis** (CPU, memória, I/O)
- [ ] **Tempo de uptime** > 30 minutos sem interrupção

### Resultado Final

**Status da Correção:**
- [ ] ✅ **SUCESSO COMPLETO** - Todos os critérios atendidos
- [ ] 🟨 **SUCESSO PARCIAL** - Alguns critérios não atendidos (listar abaixo)
- [ ] ❌ **FALHA** - Problema persiste (ver troubleshooting)

**Observações adicionais:**
```
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________
```

---

## 🆘 Se Algum Item Falhou

### Problemas Comuns e Soluções

#### ❌ Ainda recebendo SIGTERM

**Verificar:**
1. [ ] Variável PORT realmente mostra `80` (recarregue a página de ambiente)
2. [ ] Foi feito "Salvar" antes de "Implantar"
3. [ ] Deployment completou 100%
4. [ ] Não há erros nos logs de build

**Tentar:**
- [ ] Parar o serviço completamente
- [ ] Aguardar 30 segundos
- [ ] Iniciar novamente
- [ ] Aguardar mais 2-3 minutos

#### ❌ Site não carrega (502/504)

**Verificar:**
1. [ ] Container está "Running" (verde)
2. [ ] Logs mostram "✓ Ready"
3. [ ] Porta 80 está sendo usada

**Tentar:**
- [ ] Usar a **Alternativa 1** do documento principal
- [ ] Remover PORT das variáveis
- [ ] Ajustar proxy para porta 3000

#### ❌ Build falha

**Verificar:**
1. [ ] Repositório GitHub está acessível
2. [ ] Branch "master" existe
3. [ ] Dockerfile está correto
4. [ ] Não há erros de sintaxe

**Tentar:**
- [ ] Verificar configuração de "Fonte" (Screenshot 1)
- [ ] Confirmar builder: `heroku/builder:24`
- [ ] Revisar logs de build completos

---

## 📝 Documentação Final

Após validação bem-sucedida, documente:

### Screenshots Finais
- [ ] `logs_depois.png` - Logs mostrando porta 80 e sem SIGTERM
- [ ] `config_depois.png` - Variável PORT=80
- [ ] `metricas_estavel.png` - Métricas mostrando estabilidade
- [ ] `site_funcionando.png` - Site carregando normalmente

### Relatório de Correção
- [ ] **Data/hora da correção:** ________________
- [ ] **Tempo total de downtime:** _______ minutos
- [ ] **Solução aplicada:** `[ ] Principal (PORT=80)  [ ] Alternativa 1  [ ] Alternativa 2`
- [ ] **Dificuldades encontradas:** _______________________________
- [ ] **Lições aprendidas:** _______________________________

---

## 🎯 Próximos Passos Recomendados

Após resolver o problema:

### Configuração de Monitoramento
- [ ] **Configurar alertas** no Easypanel para notificar sobre reinicializações
- [ ] **Documentar** a configuração correta para referência futura
- [ ] **Adicionar** health check customizado (opcional)

### Prevenção
- [ ] **Documentar** esta configuração no README do projeto
- [ ] **Criar** variável de ambiente no .env.example
- [ ] **Adicionar** comentários no código sobre requisitos de porta

### Backup de Configuração
- [ ] **Exportar** configurações do Easypanel
- [ ] **Salvar** screenshots das configurações corretas
- [ ] **Versionar** documentação de deployment

---

## ✅ Assinaturas

**Correção aplicada por:** ________________________________

**Data:** ______ / ______ / 2025

**Hora:** ______ : ______

**Validação confirmada por:** ________________________________

**Data:** ______ / ______ / 2025

**Hora:** ______ : ______

---

**🎉 Parabéns! Se todos os itens foram marcados como ✅, seu problema está resolvido!**

---

*Versão da Checklist: 1.0*  
*Última atualização: 27 de outubro de 2025*
