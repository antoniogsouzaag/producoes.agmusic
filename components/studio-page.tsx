

'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import ImageGalleryModal from './image-gallery-modal'
import { getImagePath } from '@/lib/image-utils'

// Configuração das imagens da galeria (6 imagens)
const GALLERY_IMAGES = [
  {
    id: 'estudio-1',
    src: getImagePath('estudio1'),
    alt: 'Estúdio AG Music - Sala principal',
  },
  {
    id: 'estudio-2',
    src: getImagePath('estudio2'),
    alt: 'Estúdio AG Music - Cabine de gravação',
  },
  {
    id: 'console-1',
    src: getImagePath('console1'),
    alt: 'Estúdio AG Music - Console de mixagem',
  },
  {
    id: 'estudio-3',
    src: getImagePath('estudio3'),
    alt: 'Estúdio AG Music - Vista geral',
  },
  {
    id: 'equipamentos',
    src: getImagePath('equipamentos'),
    alt: 'Estúdio AG Music - Equipamentos',
  },
  {
    id: 'sala-geral',
    src: getImagePath('salaGeral'),
    alt: 'Estúdio AG Music - Sala geral',
  },
]

export default function StudioPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Estado do modal da galeria
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      
      const header = document.querySelector('.header') as HTMLElement
      if (header) {
        if (window.scrollY > 100) {
          header.style.background = 'rgba(10, 10, 10, 0.98)'
          header.style.boxShadow = '0 5px 30px rgba(255, 0, 128, 0.2)'
        } else {
          header.style.background = 'rgba(10, 10, 10, 0.95)'
          header.style.boxShadow = '0 2px 20px rgba(255, 0, 128, 0.1)'
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Melhorias de acessibilidade e UX do menu mobile: trava scroll e fecha com ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false)
    }

    if (isMenuOpen) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId)
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY
      const offset = 80
      
      window.scrollTo({
        top: offsetTop - offset,
        behavior: 'smooth'
      })
    }
    setIsMenuOpen(false)
  }

  const handleContactFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      service: formData.get('service'),
      message: formData.get('message')
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        alert('Mensagem enviada com sucesso! Entraremos em contato em breve.')
        ;(e.target as HTMLFormElement).reset()
      } else {
        throw new Error('Falha no envio')
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error)
      alert('Erro ao enviar mensagem. Por favor, tente novamente ou entre em contato pelo WhatsApp.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Mapear tipos de serviço para nomes amigáveis
  const serviceNames = {
    'gravacao': 'Gravação Profissional',
    'mixagem': 'Mixagem & Masterização',
    'instrumentos': 'Gravação de Instrumentos',
    'edicao': 'Edição & Pós-Produção',
    'consultoria': 'Consultoria & Mentoria'
  }

  // Função para abrir a galeria
  const openGallery = (index: number) => {
    setGalleryIndex(index)
    setIsGalleryOpen(true)
  }

  return (
    <>
      {/* Header/Navigation */}
      <header className="header">
        <nav className="navbar">
          <div className="container">
            <Link href="/" className="logo">
              <div className="relative w-10 h-10">
                <Image
                  src={getImagePath('logo')}
                  alt="Antônio Garcia Logo"
                  fill
                  className="logo-img"
                  sizes="40px"
                />
              </div>
              <span className="logo-text">Antônio Garcia</span>
            </Link>
            {/* Overlay para o menu mobile */}
            <div
              className={`nav-overlay ${isMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />

            <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`} id="primary-navigation" role="menu">
              <li><Link href="/" className="nav-link">Início</Link></li>
              <li><button onClick={() => scrollToElement('sobre-estudio')} className="nav-link">Sobre</button></li>
              <li><button onClick={() => scrollToElement('equipamentos')} className="nav-link">Equipamentos</button></li>
              <li><button onClick={() => scrollToElement('servicos-estudio')} className="nav-link">Serviços</button></li>
              <li><button onClick={() => scrollToElement('galeria')} className="nav-link">Galeria</button></li>
              <li><a href="https://agmusic.cloud" className="nav-link" onClick={() => setIsMenuOpen(false)}>AG Home</a></li>
              <li><a href="https://app.agmusic.cloud" className="nav-link" onClick={() => setIsMenuOpen(false)}>App</a></li>
              <li><button onClick={() => scrollToElement('contato-estudio')} className="nav-link">Contato</button></li>
            </ul>
            <button
              type="button"
              className={`hamburger ${isMenuOpen ? 'active' : ''}`}
              aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-controls="primary-navigation"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="studio-hero" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('${getImagePath('estudioHeroBg')}')` }}>
        <div className="studio-hero-overlay"></div>
        <div 
          className="studio-hero-content"
          style={{ 
            transform: `translateY(${scrollY * 0.3}px)`,
            opacity: Math.max(0, 1 - (scrollY / 700))
          }}
        >
          <h1 className="studio-hero-title">Estúdio AG Music</h1>
          <p className="studio-hero-subtitle">
            Equipamentos de ponta, ambiente profissional e toda estrutura para transformar suas ideias em música de qualidade
          </p>
          <div className="studio-hero-buttons">
            <button onClick={() => scrollToElement('contato-estudio')} className="btn btn-primary">
              Agendar Visita
            </button>
            <button onClick={() => scrollToElement('sobre-estudio')} className="btn btn-secondary">
              Conhecer Mais
            </button>
          </div>
        </div>
        <div className="scroll-indicator">
          <span></span>
        </div>
      </section>

      {/* Sobre o Estúdio */}
      <section id="sobre-estudio" className="studio-about">
        <div className="container">
          <h2 className="section-title">Sobre o Estúdio</h2>
          <div className="title-underline"></div>
          
          <div className="studio-about-content">
            <div className="studio-about-image">
              <Image
                src={getImagePath('estudio1')}
                alt="Interior do Estúdio AG Music"
                width={600}
                height={400}
                className="studio-img"
              />
            </div>
            <div className="studio-about-text">
              <p className="studio-intro">
                O <strong>Estúdio AG Music</strong> é um espaço dedicado à excelência na produção musical. Com tratamento acústico e equipamentos profissionais, oferecemos o ambiente perfeito para gravação, mixagem e masterização.
              </p>
              <p>
                Localizado em um ambiente projetado para produção musical, nosso estúdio conta com sala isolada acusticamente, proporcionando gravações limpas e sem interferências externas.
              </p>
              <p>
                Seja você um artista iniciante ou experiente, temos a estrutura e o conhecimento técnico para levar sua música ao próximo nível. Trabalhamos com diversos estilos musicais, sempre respeitando a identidade artística de cada projeto.
              </p>
              
              <div className="studio-features">
                <h4>Características do Nosso Estúdio:</h4>
                <ul>
                  <li>Tratamento acústico profissional</li>
                  <li>Sala isolada e climatizada</li>
                  <li>Equipamentos de alta qualidade</li>
                  <li>Ambiente criativo e inspirador</li>
                  <li>Flexibilidade de horários</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipamentos */}
      <section id="equipamentos" className="studio-equipment">
        <div className="container">
          <h2 className="section-title">Equipamentos</h2>
          <div className="title-underline"></div>
          <p className="section-subtitle">Tecnologia de ponta para resultados profissionais</p>
          
          <div className="equipment-grid">
            <div className="equipment-category">
              <div className="equipment-icon">
                <i className="fas fa-microphone"></i>
              </div>
              <h3>Inputs</h3>
              <ul className="equipment-list">
                <li>Microfones condensadores de estúdio</li>
                <li>Amplificadores para instrumentos</li>
                <li>Instrumentos profissionais para captação</li>
                <li>Pop filters e anti-reflexo</li>
              </ul>
            </div>

            <div className="equipment-category">
              <div className="equipment-icon">
                <i className="fas fa-sliders-h"></i>
              </div>
              <h3>Mesa & Áudio</h3>
              <ul className="equipment-list">
                <li>Mesa de mixagem digital na DAW</li>
                <li>Interface de áudio profissional</li>
                <li>Pluguins Pré-amplificadores valvulados</li>
                <li>Pluguins Compressores e equalizadores Premium</li>
              </ul>
            </div>

            <div className="equipment-category">
              <div className="equipment-icon">
                <i className="fas fa-desktop"></i>
              </div>
              <h3>Produção Digital</h3>
              <ul className="equipment-list">
                <li>Workstation de alta performance</li>
                <li>Monitores de referência ativos</li>
                <li>Plugins profissionais premium</li>
                <li>Controladores MIDI avançados</li>
              </ul>
            </div>

            <div className="equipment-category">
              <div className="equipment-icon">
                <i className="fas fa-music"></i>
              </div>
              <h3>Instrumentos</h3>
              <ul className="equipment-list">
                <li>Piano digital weighted</li>
                <li>Guitarras e baixos profissionais</li>
                <li>Bateria VsT MIDI premium</li>
                <li>Amplificador transistorizado</li>
              </ul>
            </div>

            <div className="equipment-category">
              <div className="equipment-icon">
                <i className="fas fa-volume-up"></i>
              </div>
              <h3>Amplificação</h3>
              <ul className="equipment-list">
                <li>Amplificadores valvulados premium</li>
                <li>Monitores de estúdio de referência</li>
                <li>Fone de alta performance para graves precisos</li>
                <li>Sistemas de fones profissionais</li>
              </ul>
            </div>

            <div className="equipment-category">
              <div className="equipment-icon">
                <i className="fas fa-cogs"></i>
              </div>
              <h3>Processamento Digital</h3>
              <ul className="equipment-list">
                <li>Compressores analógicos vintage</li>
                <li>Equalizadores paramétricos</li>
                <li>Reverbs e delays premium</li>
                <li>Gates e expansores dinâmicos</li>
              </ul>
            </div>
          </div>

          {/* Console Showcase - Imagem menor com descrição */}
          <div className="console-showcase">
            <div className="console-showcase-image">
              <Image
                src={getImagePath('console1')}
                alt="Console de mixagem do Estúdio AG Music"
                width={500}
                height={350}
                className="console-img"
              />
            </div>
            <div className="console-showcase-text">
              <h3>Nosso Worstation</h3>
              <p>
                O coração do nosso estúdio é nossa interface de mixagem, 
                que permite um controle preciso de cada elemento da sua produção musical.
              </p>
              <p>
                Com ela, conseguimos trabalhar em projetos de alta complexidade, 
                desde gravações simples até produções completas com múltiplas faixas 
                e instrumentos.
              </p>
              <ul className="console-features">
                <li><i className="fas fa-check"></i> Controle preciso de ganho e EQ</li>
                <li><i className="fas fa-check"></i> Múltiplos canais de entrada</li>
                <li><i className="fas fa-check"></i> Processamento em tempo real</li>
                <li><i className="fas fa-check"></i> Integração com DAW profissional</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços Detalhados */}
      <section id="servicos-estudio" className="studio-services">
        <div className="container">
          <h2 className="section-title">Nossos Serviços</h2>
          <div className="title-underline"></div>
          <p className="section-subtitle">Soluções completas para sua produção musical</p>
          
          <div className="services-detailed-grid">
            <div className="service-detailed-card">
              <div className="service-detailed-icon">
                <i className="fas fa-microphone-alt"></i>
              </div>
              <h3>Gravação Profissional</h3>
              <p>
                Gravação de voz, instrumentos acústicos e elétricos em ambiente tratado acusticamente. Utilizamos técnicas de microfonação profissionais e equipamentos de alta qualidade para capturar cada detalhe da sua performance.
              </p>
            </div>

            <div className="service-detailed-card">
              <div className="service-detailed-icon">
                <i className="fas fa-sliders-h"></i>
              </div>
              <h3>Mixagem & Masterização</h3>
              <p>
                Transformamos suas gravações em uma produção profissional e competitiva. Processamento detalhado de cada elemento, equalização, compressão, efeitos e balanceamento final para streaming, rádio e outras plataformas.
              </p>
            </div>

            <div className="service-detailed-card">
              <div className="service-detailed-icon">
                <i className="fas fa-guitar"></i>
              </div>
              <h3>Gravação de Instrumentos</h3>
              <p>
                Sessões de gravação com músicos profissionais disponíveis. Guitarras, baixo, teclados, bateria e outros instrumentos. Ideal para quem precisa complementar seu projeto com performances de alta qualidade.
              </p>
            </div>

            <div className="service-detailed-card">
              <div className="service-detailed-icon">
                <i className="fas fa-cut"></i>
              </div>
              <h3>Edição & Pós-Produção</h3>
              <p>
                Edição detalhada de timing, afinação (pitch correction), limpeza de ruídos, comping vocal e alinhamento rítmico. Garantimos que cada take esteja perfeito antes de partir para a mixagem.
              </p>
            </div>

            <div className="service-detailed-card">
              <div className="service-detailed-icon">
                <i className="fas fa-chalkboard-teacher"></i>
              </div>
              <h3>Consultoria & Mentoria</h3>
              <p>
                Orientação completa sobre produção musical, desde a pré-produção até estratégias de lançamento. Mentoria para produtores iniciantes e artistas que querem entender melhor o processo de produção.
              </p>
            </div>

            <div className="service-detailed-card">
              <div className="service-detailed-icon">
                <i className="fas fa-compact-disc"></i>
              </div>
              <h3>Produção Completa</h3>
              <p>
                Pacote completo de produção musical: desde o arranjo inicial, gravação, edição, mixagem até a masterização final. Ideal para artistas que querem um produto profissional pronto para distribuição.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Galeria */}
      <section id="galeria" className="studio-gallery">
        <div className="container">
          <h2 className="section-title">Galeria do Estúdio</h2>
          <div className="title-underline"></div>
          <p className="section-subtitle">Conheça nosso espaço</p>
          
          <div className="gallery-grid">
            {GALLERY_IMAGES.map((image, index) => (
              <div 
                key={image.id} 
                className="gallery-item"
                onClick={() => openGallery(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openGallery(index)}
                aria-label={`Abrir imagem ${index + 1}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={400}
                  height={300}
                  className="gallery-img"
                />
                <div className="gallery-overlay">
                  <i className="fas fa-search-plus"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal da Galeria */}
      <ImageGalleryModal
        images={GALLERY_IMAGES}
        initialIndex={galleryIndex}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />

      {/* CTA Section */}
      <section className="studio-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Pronto para Gravar?</h2>
            <p>Agende sua visita e conheça nosso estúdio pessoalmente</p>
            <div className="cta-buttons">
              <button onClick={() => scrollToElement('contato-estudio')} className="btn btn-primary btn-large">
                Solicitar Orçamento
              </button>
              <button onClick={() => scrollToElement('galeria')} className="btn btn-secondary btn-large">
                Ver Galeria
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Contato */}
      <section id="contato-estudio" className="studio-contact">
        <div className="container">
          <h2 className="section-title">Entre em Contato</h2>
          <div className="title-underline"></div>
          <p className="section-subtitle">Agende sua visita ou tire suas dúvidas</p>
          
          <div className="contact-content">
            <div className="contact-info">
              <h3>Informações de Contato</h3>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <div className="contact-details">
                  <p>(64) 99304-9853</p>
                  <span>WhatsApp e Ligações</span>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-details">
                  <p>suporte@agmusic.cloud</p>
                  <span>Email profissional</span>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fab fa-instagram"></i>
                </div>
                <div className="contact-details">
                  <p>@ag_music_producoes</p>
                  <span>Instagram oficial</span>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="contact-details">
                  <p>Seg - Sex: 08:00 às 18:00</p>
                  <span>Horário de atendimento</span>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <form onSubmit={handleContactFormSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Nome Completo</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Telefone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-control"
                    placeholder="(XX) XXXXX-XXXX"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="service">Serviço de Interesse</label>
                  <select id="service" name="service" className="form-control" required>
                    <option value="">Selecione um serviço</option>
                    <option value="gravacao">Gravação Profissional</option>
                    <option value="mixagem">Mixagem & Masterização</option>
                    <option value="instrumentos">Gravação de Instrumentos</option>
                    <option value="edicao">Edição & Pós-Produção</option>
                    <option value="consultoria">Consultoria & Mentoria</option>
                    <option value="visita">Agendar Visita ao Estúdio</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Mensagem</label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-control"
                    rows={5}
                    placeholder="Descreva seu projeto ou dúvida..."
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src={getImagePath('logo')}
                  alt="Antônio Garcia Logo"
                  fill
                  className="logo-img"
                  sizes="40px"
                />
              </div>
              <div>
                <h3>Estúdio AG Music</h3>
                <p>Produção Musical Profissional</p>
              </div>
            </div>
            <div className="footer-social">
              <a href="https://www.instagram.com/antonio0_/" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.youtube.com/@AntonioGarcia-xx9sv" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="https://wa.me/5564993049853" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Estúdio AG Music - Antônio Garcia. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
