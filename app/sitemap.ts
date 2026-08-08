import type { MetadataRoute } from 'next'

// O site não tinha sitemap: /sitemap.xml devolvia 404 e o Google descobria as
// páginas só por link interno.
const SITE_URL = 'https://agmusic.cloud'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // A raiz é o estúdio; /bio é a página do produtor. /estudio não entra:
    // responde 301 para a raiz e sitemap não lista redirecionamento.
    { url: SITE_URL, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/bio`, changeFrequency: 'monthly', priority: 0.8 },
  ]
}
