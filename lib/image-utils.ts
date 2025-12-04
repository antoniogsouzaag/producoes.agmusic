/**
 * Utilitário para resolução de imagens com múltiplos formatos
 * Permite usar jpg, jpeg, png ou webp intercambiavelmente
 */

// Extensões suportadas em ordem de prioridade
const SUPPORTED_EXTENSIONS = ['webp', 'jpg', 'jpeg', 'png'] as const;

export type ImageExtension = typeof SUPPORTED_EXTENSIONS[number];

/**
 * Configuração de imagens do site
 * Defina o nome base (sem extensão) e a extensão disponível
 * 
 * Para trocar uma imagem:
 * 1. Substitua o arquivo na pasta public/ com o mesmo nome
 * 2. Se mudar a extensão, atualize aqui também
 * 
 * Formatos suportados: jpg, jpeg, png, webp
 */
export const SITE_IMAGES = {
  // Imagens principais (pasta /public)
  logo: { basePath: '/logo', extension: 'jpeg' as ImageExtension },
  fotoPerformance: { basePath: '/foto-performance', extension: 'png' as ImageExtension },
  fotoPerfil: { basePath: '/foto_perfil', extension: 'jpeg' as ImageExtension },
  
  // Imagens do estúdio (pasta /public/estudio)
  estudioHeroBg: { basePath: '/estudio/hero-bg', extension: 'jpg' as ImageExtension },
  estudio1: { basePath: '/estudio/estudio-1', extension: 'png' as ImageExtension },
  estudio2: { basePath: '/estudio/estudio-2', extension: 'jpg' as ImageExtension },
  estudio3: { basePath: '/estudio/estudio-3', extension: 'jpeg' as ImageExtension },
  console1: { basePath: '/estudio/console-1', extension: 'png' as ImageExtension },
  equipamentos: { basePath: '/estudio/equipamentos', extension: 'png' as ImageExtension },
  salaGeral: { basePath: '/estudio/sala-geral', extension: 'jpg' as ImageExtension },
} as const;

export type ImageKey = keyof typeof SITE_IMAGES;

/**
 * Retorna o caminho completo da imagem com extensão
 */
export function getImagePath(key: ImageKey): string {
  const config = SITE_IMAGES[key];
  return `${config.basePath}.${config.extension}`;
}

/**
 * Retorna todas as informações de uma imagem
 */
export function getImageConfig(key: ImageKey) {
  return SITE_IMAGES[key];
}

/**
 * Atualiza a extensão de uma imagem no runtime
 * Útil para verificação dinâmica de formatos
 */
export function buildImagePath(basePath: string, extension: ImageExtension): string {
  return `${basePath}.${extension}`;
}

/**
 * Verifica se a extensão é suportada
 */
export function isSupportedExtension(ext: string): ext is ImageExtension {
  return SUPPORTED_EXTENSIONS.includes(ext.toLowerCase() as ImageExtension);
}

/**
 * Galeria de imagens do estúdio para o componente de galeria
 */
export const STUDIO_GALLERY_IMAGES = [
  {
    id: 'estudio-1',
    src: getImagePath('estudio1'),
    alt: 'Estúdio AG Music - Sala principal',
    title: 'Sala Principal'
  },
  {
    id: 'estudio-2',
    src: getImagePath('estudio2'),
    alt: 'Estúdio AG Music - Cabine de gravação',
    title: 'Cabine de Gravação'
  },
  {
    id: 'console-1',
    src: getImagePath('console1'),
    alt: 'Estúdio AG Music - Console de mixagem',
    title: 'Console de Mixagem'
  },
  {
    id: 'estudio-3',
    src: getImagePath('estudio3'),
    alt: 'Estúdio AG Music - Vista geral',
    title: 'Vista Geral'
  },
  {
    id: 'equipamentos',
    src: getImagePath('equipamentos'),
    alt: 'Estúdio AG Music - Equipamentos',
    title: 'Equipamentos'
  },
  {
    id: 'sala-geral',
    src: getImagePath('salaGeral'),
    alt: 'Estúdio AG Music - Sala geral',
    title: 'Sala Geral'
  },
] as const;

export type GalleryImage = typeof STUDIO_GALLERY_IMAGES[number];
