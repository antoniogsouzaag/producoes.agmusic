
import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import Chatbot from '../components/chatbot'

const inter = Inter({ subsets: ['latin'] })

const SITE_URL = 'https://agmusic.cloud'

export const metadata = {
  // Sem metadataBase o Next resolve OG e canonical contra localhost em build,
  // e as imagens sociais saíam com URL relativa que rede nenhuma consegue
  // buscar.
  metadataBase: new URL(SITE_URL),
  // Padrão do site inteiro, e a raiz é o estúdio. A página do produtor
  // sobrescreve título e descrição em app/bio/page.tsx.
  title: 'AG Music | Estúdio de Gravação, Mixagem e Masterização',
  description: 'Estúdio AG Music: gravação, mixagem, masterização e produção musical completa, em ambiente tratado acusticamente.',
  keywords: 'estúdio de gravação, produção musical, mixagem, masterização, gravação profissional, ag music',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AG Music | Estúdio de Gravação, Mixagem e Masterização',
    description: 'Gravação, mixagem, masterização e produção musical completa.',
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    siteName: 'AG Music',
    images: [{ url: '/foto-performance.png', width: 1200, height: 630, alt: 'Estúdio AG Music' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AG Music | Estúdio de Gravação, Mixagem e Masterização',
    description: 'Gravação, mixagem, masterização e produção musical completa.',
    images: ['/foto-performance.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  }
}

/**
 * JSON-LD do estúdio.
 *
 * O site não servia dado estruturado nenhum. Para uma busca como "estúdio de
 * gravação" ou "mixagem e masterização", o que decide se o resultado aparece
 * com serviços e contato é este bloco — sem ele há só um título azul.
 */
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['LocalBusiness', 'MusicalOrganization'],
      '@id': `${SITE_URL}/#estudio`,
      name: 'AG Music',
      alternateName: 'Estúdio AG Music',
      url: SITE_URL,
      description:
        'Estúdio de produção musical: da pré-produção à masterização, com mais de 15 anos de experiência em gravação, mixagem e produção completa.',
      image: `${SITE_URL}/foto-performance.png`,
      telephone: '+5564993049853',
      priceRange: '$$',
      founder: { '@id': `${SITE_URL}/#person` },
      sameAs: ['https://www.instagram.com/antonio0_/'],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Serviços de produção musical',
        itemListElement: [
          'Produção Musical',
          'Gravação Profissional',
          'Mixagem & Masterização',
          'Edição & Pós-Produção',
          'Gravação de Instrumentos',
          'Consultoria Musical',
        ].map((nome) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: nome },
        })),
      },
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: 'Antônio Garcia',
      jobTitle: 'Produtor musical',
      // A página da pessoa é /bio; a raiz descreve o estúdio.
      url: `${SITE_URL}/bio`,
      image: `${SITE_URL}/foto_perfil.jpeg`,
      knowsAbout: ['Produção musical', 'Mixagem', 'Masterização', 'Gravação'],
      sameAs: ['https://www.instagram.com/antonio0_/'],
      worksFor: { '@id': `${SITE_URL}/#estudio` },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'AG Music',
      inLanguage: 'pt-BR',
      publisher: { '@id': `${SITE_URL}/#estudio` },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        {children}

        <Chatbot />
        <div id="modal-root" />
      </body>
    </html>
  )
}
