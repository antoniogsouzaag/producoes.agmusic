
import StudioPage from '../components/studio-page'

// A raiz é o estúdio: o site é o AG Music, e quem chega em agmusic.cloud está
// procurando o estúdio, não a biografia do produtor — essa mora em /bio.
export const metadata = {
  title: 'AG Music | Estúdio de Gravação, Mixagem e Masterização',
  description: 'Estúdio AG Music: equipamentos profissionais, ambiente tratado acusticamente e toda infraestrutura para gravação, mixagem e masterização.',
  keywords: 'estúdio de gravação, equipamentos de áudio, produção musical, gravação profissional, mixagem, masterização',
  alternates: {
    canonical: '/',
  },
}

export default function Home() {
  return <StudioPage />
}
