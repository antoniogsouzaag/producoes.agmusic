
import InteractiveLanding from '../../components/interactive-landing'

// Era a home do site. Virou rota própria quando o estúdio assumiu a raiz:
// esta página é a do produtor — trajetória, serviços e portfólio.
export const metadata = {
  title: 'Antônio Garcia | Produtor Musical',
  description: 'Antônio Garcia - Produtor Musical | Produção, Gravação, Mixagem e Masterização. Mais de 15 anos de experiência.',
  keywords: 'produtor musical, mixagem, masterização, gravação, antonio garcia, música',
  alternates: {
    canonical: '/bio',
  },
  openGraph: {
    title: 'Antônio Garcia | Produtor Musical',
    description: 'Transformando ideias em música profissional',
    url: '/bio',
    images: [{ url: '/foto-performance.png', width: 1200, height: 630, alt: 'Antônio Garcia, produtor musical' }],
  },
}

export default function Bio() {
  return <InteractiveLanding />
}
