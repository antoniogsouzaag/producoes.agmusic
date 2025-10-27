# 📝 Como Editar o Site AG Music

Este guia explica de forma detalhada como editar o conteúdo do seu site, incluindo fotos, textos e configurações.

---

## 📸 Como Trocar as Fotos

### 1. Fotos da Página Principal

#### Logo do Site
**Localização**: `public/logo.jpeg`

**Como trocar**:
1. Prepare sua nova imagem (formato: JPEG, PNG ou SVG)
2. Renomeie para `logo.jpeg` (ou mantenha a extensão original e atualize o código)
3. Substitua o arquivo em `public/logo.jpeg`

#### Foto do Hero (Foto Principal)
**Localização**: `public/foto-performance.png`

**Como trocar**:
1. Prepare uma foto de performance ou profissional
2. Tamanho recomendado: 1200x800 pixels ou maior
3. Renomeie para `foto-performance.png`
4. Substitua o arquivo em `public/foto-performance.png`

#### Foto de Perfil (Seção "Sobre")
**Localização**: `public/foto_perfil.jpeg`

**Como trocar**:
1. Prepare uma foto de perfil profissional
2. Tamanho recomendado: 800x800 pixels ou maior
3. Renomeie para `foto_perfil.jpeg`
4. Substitua o arquivo em `public/foto_perfil.jpeg`

### 2. Fotos da Página do Estúdio

**Localização**: Pasta `public/estudio/`

As fotos do estúdio estão organizadas nesta pasta:

- `estudio-1.jpg` - Foto principal do estúdio
- `estudio-2.jpg` - Sala de controle
- `estudio-3.jpg` - Ambiente de gravação
- `console-1.jpg` - Console de mixagem
- `equipamentos.jpg` - Equipamentos de produção

**Como trocar**:
1. Tire fotos do seu estúdio com boa iluminação
2. Tamanho recomendado: 1200x800 pixels ou maior
3. Renomeie suas fotos para corresponder aos nomes acima
4. Substitua os arquivos em `public/estudio/`

**💡 Dica**: Você pode adicionar mais fotos na galeria! Basta adicionar as imagens na pasta `public/estudio/` e editar o componente da galeria (veja seção "Edição Avançada").

---

## ✏️ Como Editar Textos

### 1. Textos da Página Principal

Os textos da página principal estão no arquivo:
**`components/interactive-landing.tsx`**

#### Editar o Título Principal (Hero)
Procure por:
```tsx
<h1 className="hero-brand">AG Music</h1>
<h2 className="hero-name">Antônio Garcia</h2>
```

Altere "AG Music" e "Antônio Garcia" para o texto desejado.

#### Editar a Descrição Principal
Procure por:
```tsx
<p className="hero-subtitle">
  Transforme Sua Música em Sucesso Profissional | ...
```

Altere todo o texto entre as tags `<p>` e `</p>`.

#### Editar Seção "Sobre Mim"
Procure por:
```tsx
<section id="sobre" className="sobre">
```

Dentro desta seção, edite os parágrafos `<p>` com suas informações pessoais.

#### Editar Estatísticas
Procure por:
```tsx
<span className="stat-number" data-target="15">0</span>
<span className="stat-label">Anos de Experiência</span>
```

Altere o número em `data-target="15"` e o texto da label.

#### Editar Serviços
Procure por:
```tsx
<section id="servicos" className="servicos">
```

Dentro desta seção, cada serviço está em um `<div className="servico-card">`. Edite:
- `<h3>` - Nome do serviço
- `<p>` - Descrição do serviço
- `<i className="fas fa-music">` - Ícone (veja seção de ícones)

### 2. Textos da Página do Estúdio

Os textos da página do estúdio estão no arquivo:
**`components/studio-page.tsx`**

#### Editar Título do Hero
Procure por:
```tsx
<h1 className="studio-hero-title">Estúdio AG Music</h1>
```

Altere "Estúdio AG Music" para o nome do seu estúdio.

#### Editar Descrição "Sobre o Estúdio"
Procure por:
```tsx
<section id="sobre-estudio" className="studio-about">
```

Edite os parágrafos `<p>` com informações sobre seu estúdio.

#### Editar Equipamentos
Procure por:
```tsx
<section id="equipamentos" className="studio-equipment">
```

Dentro das `<div className="equipment-category">`, edite:
- `<h3>` - Categoria do equipamento
- `<li>` - Itens da lista de equipamentos

#### Editar Serviços do Estúdio
Procure por:
```tsx
<section id="servicos-estudio" className="studio-services">
```

Edite cada `<div className="service-detailed-card">` com:
- `<h3>` - Nome do serviço
- `<p>` - Descrição detalhada

### 3. Editar Informações de Contato

Em ambos os arquivos (`interactive-landing.tsx` e `studio-page.tsx`), procure por:

```tsx
<a href="mailto:agmusicproduçoes@gmail.com">
```

Altere para seu email.

```tsx
<a href="https://wa.me/5564993049853">
```

Altere o número (formato: 55 + DDD + número, sem espaços ou caracteres especiais).

### 4. Editar Links de Redes Sociais

Procure por:
```tsx
<a href="https://www.instagram.com/antonio0_/" target="_blank">
<a href="https://www.youtube.com/@AntonioGarcia-xx9sv" target="_blank">
```

Altere os links para suas redes sociais.

---

## 🎨 Como Trocar Ícones

O site usa ícones do Font Awesome. Para trocar um ícone:

1. Visite: https://fontawesome.com/icons
2. Procure pelo ícone desejado (exemplo: "guitar")
3. Copie o código da classe (exemplo: `fas fa-guitar`)
4. No código, procure o ícone atual:
   ```tsx
   <i className="fas fa-music"></i>
   ```
5. Substitua `fa-music` pelo novo ícone (exemplo: `fa-guitar`)

---

## 🔧 Estrutura do Projeto

```
producoes.agmusic/
├── app/
│   ├── estudio/          # Página do estúdio
│   │   └── page.tsx
│   ├── globals.css       # Estilos CSS do site inteiro
│   ├── layout.tsx        # Layout principal (header, footer)
│   └── page.tsx          # Página inicial
├── components/
│   ├── chatbot.tsx       # Componente do chatbot
│   ├── interactive-landing.tsx  # Componente da página principal
│   ├── studio-page.tsx   # Componente da página do estúdio
│   ├── audio-player.tsx  # Player de áudio do portfólio
│   └── music-manager.tsx # Gerenciador de músicas
├── public/
│   ├── estudio/          # Fotos do estúdio
│   │   ├── estudio-1.jpg
│   │   ├── estudio-2.jpg
│   │   ├── estudio-3.jpg
│   │   ├── console-1.jpg
│   │   └── equipamentos.jpg
│   ├── logo.jpeg         # Logo do site
│   ├── foto-performance.png  # Foto hero
│   └── foto_perfil.jpeg  # Foto de perfil
└── README_DEPLOY.md      # Instruções de deploy
```

---

## 📋 Passo a Passo: Adicionar uma Nova Foto

### Exemplo: Adicionar nova foto na galeria do estúdio

1. **Prepare a foto**:
   - Tire uma foto com boa iluminação
   - Tamanho recomendado: 1200x800 pixels
   - Formato: JPG ou PNG

2. **Adicione a foto na pasta**:
   - Coloque a foto em `public/estudio/`
   - Exemplo: `public/estudio/minha-nova-foto.jpg`

3. **Edite o código**:
   - Abra `components/studio-page.tsx`
   - Procure por `<section id="galeria">`
   - Adicione um novo item da galeria:
   ```tsx
   <div className="gallery-item">
     <Image
       src="/estudio/minha-nova-foto.jpg"
       alt="Descrição da foto"
       width={400}
       height={300}
       className="gallery-img"
     />
   </div>
   ```

4. **Salve e faça commit**:
   ```bash
   git add .
   git commit -m "Adiciona nova foto na galeria"
   git push
   ```

---

## 🎨 Como Alterar Cores do Site

As cores principais estão definidas em `app/globals.css`:

```css
:root {
  --primary-color: #ff0080;      /* Rosa/Pink principal */
  --secondary-color: #00d4ff;    /* Azul ciano */
  --accent-color: #ffea00;       /* Amarelo */
  --dark-bg: #0a0a0a;           /* Fundo escuro */
  --text-light: #ffffff;         /* Texto claro */
  --text-gray: #b0b0b0;         /* Texto cinza */
}
```

Para alterar as cores:
1. Escolha uma nova cor em formato hexadecimal (exemplo: #ff0000 para vermelho)
2. Substitua o valor da variável desejada
3. Salve o arquivo

**💡 Ferramenta útil**: Use https://coolors.co para gerar paletas de cores.

---

## 🚀 Como Aplicar as Alterações

### Método 1: Via GitHub (Recomendado)

1. Edite os arquivos diretamente no GitHub
2. Faça commit das alterações
3. O Easypanel fará o deploy automático

### Método 2: Via Git Local

```bash
# 1. Clone o repositório (se ainda não tiver)
git clone https://github.com/antoniogsouzaag/producoes.agmusic
cd producoes.agmusic

# 2. Faça as alterações nos arquivos

# 3. Adicione as alterações
git add .

# 4. Faça o commit
git commit -m "Descrição das alterações"

# 5. Envie para o GitHub
git push origin main

# 6. O Easypanel fará o deploy automático
```

---

## 🎯 Dicas Importantes

### Para Fotos:

✅ **Use fotos de alta qualidade** (mínimo 1200x800 pixels)  
✅ **Mantenha os formatos** (JPG, PNG)  
✅ **Otimize o tamanho** (máximo 2MB por foto)  
✅ **Tire fotos com boa iluminação**  
✅ **Mantenha a proporção 3:2 ou 16:9**  

❌ **Evite fotos muito pesadas** (acima de 5MB)  
❌ **Evite fotos borradas ou escuras**  
❌ **Não use formatos incomuns** (WEBP, TIFF)  

### Para Textos:

✅ **Seja claro e objetivo**  
✅ **Use parágrafos curtos**  
✅ **Destaque informações importantes com `<strong>`**  
✅ **Mantenha a identidade da sua marca**  
✅ **Revise a ortografia**  

---

## 🆘 Problemas Comuns

### Foto não aparece após trocar

**Solução**:
1. Verifique se o nome do arquivo está correto
2. Verifique se a foto está na pasta `public/`
3. Limpe o cache do navegador (Ctrl + F5)
4. Verifique se fez commit e push

### Texto não atualiza

**Solução**:
1. Verifique se salvou o arquivo
2. Verifique se fez commit e push
3. Aguarde o deploy completar no Easypanel
4. Limpe o cache do navegador

### Site quebrou após editar

**Solução**:
1. Verifique se não removeu nenhuma tag de fechamento (`</div>`, `</p>`, etc.)
2. Verifique se não alterou código fora das seções de texto
3. Reverta para a versão anterior no GitHub
4. Peça ajuda técnica se necessário

---

## 📞 Precisa de Ajuda?

Se você encontrar dificuldades ou tiver dúvidas:

1. **Revise este guia** - A maioria das dúvidas está respondida aqui
2. **Verifique o README_DEPLOY.md** - Para problemas de deploy
3. **Consulte a documentação do Next.js** - https://nextjs.org/docs
4. **Entre em contato com suporte técnico** - Se o problema persistir

---

**Última atualização**: 27 de Outubro de 2025  
**Versão**: 1.0
