import type { MetadataRoute } from 'next'

// O site não tinha sitemap: /sitemap.xml devolvia 404 e o Google descobria as
// páginas só por link interno.
const SITE_URL = 'https://agmusic.cloud'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/estudio`, changeFrequency: 'monthly', priority: 0.8 },
  ]
}
