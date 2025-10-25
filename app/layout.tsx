
import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Antônio Garcia | Produtor Musical',
  description: 'Antônio Garcia - Produtor Musical | Produção, Gravação, Mixagem e Masterização',
  keywords: 'produtor musical, mixagem, masterização, gravação, antonio garcia, música',
  openGraph: {
    title: 'Antônio Garcia | Produtor Musical',
    description: 'Transformando ideias em música profissional',
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={inter.className}>
        {children}

        <div id="modal-root" />
      </body>
    </html>
  )
}
