
'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function StudioPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

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

  return (
    <>
      {/* Header/Navigation */}
      <header className="header">
        <nav className="navbar">
          <div className="container">
            <Link href="/" className="logo">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.jpeg"
                  alt="Antônio Garcia Logo"
                  fill
                  className="logo-img"
                  sizes="40px"
                />
              </div>
              <span className="logo-text">Antônio Garcia</span>
            </Link>
            <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
              <li><Link href="/" className="nav-link">Início</Link></li>
              <li><button onClick={() => scrollToElement('sobre-estudio')} className="nav-link">Sobre</button></li>
              <li><button onClick={() => scrollToElement('equipamentos')} className="nav-link">Equipamentos</button></li>
              <li><button onClick={() => scrollToElement('servicos-estudio')} className="nav-link">Serviços</button></li>
              <li><button onClick={() => scrollToElement('galeria')} className="nav-link">Galeria</button></li>
            </ul>
            <div 
              className={`hamburger ${isMenuOpen ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="studio-hero">
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
            <a href="https://wa.me/5564993049853" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Agendar Visita
            </a>
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
                src="/estudio/estudio-1.jpg"
                alt="Interior do Estúdio AG Music"
                width={600}
                height={400}
                className="studio-img"
              />
            </div>
            <div className="studio-about-text">
              <p className="studio-intro">
                O <strong>Estúdio AG Music</strong> é um espaço dedicado à excelência na produção musical. Com tratamento acústico profissional e equipamentos de última geração, oferecemos o ambiente perfeito para gravação, mixagem e masterização.
              </p>
              <p>
                Localizado em um ambiente projetado especificamente para produção musical, nosso estúdio conta com salas isoladas acusticamente, proporcionando gravações limpas e sem interferências externas.
              </p>
              <p>
                Seja você um artista iniciante ou experiente, temos a estrutura e o conhecimento técnico para levar sua música ao próximo nível. Trabalhamos com diversos estilos musicais, sempre respeitando a identidade artística de cada projeto.
              </p>
              
              <div className="studio-features">
                <div className="feature-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Tratamento Acústico Profissional</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Equipamentos de Alta Qualidade</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Ambiente Climatizado e Confortável</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Atendimento Personalizado</span>
                </div>
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
          <p className="section-subtitle">Tecnologia de ponta para produção profissional</p>
          
          <div className="equipment-grid">
            <div className="equipment-category">
              <div className="equipment-icon">
                <i className="fas fa-microphone"></i>
              </div>
              <h3>Microfones</h3>
              <ul>
                <li>Microfones condensadores de alta qualidade</li>
                <li>Microfones dinâmicos para instrumentos</li>
                <li>Kits de microfones para bateria</li>
                <li>Pop filters e suportes profissionais</li>
              </ul>
            </div>

            <div className="equipment-category">
              <div className="equipment-icon">
                <i className="fas fa-sliders-h"></i>
              </div>
              <h3>Interfaces & Mixers</h3>
              <ul>
                <li>Interfaces de áudio profissionais</li>
                <li>Mesa de mixagem analógica/digital</li>
                <li>Pré-amplificadores de alta qualidade</li>
                <li>Processadores de dinâmica</li>
              </ul>
            </div>

            <div className="equipment-category">
              <div className="equipment-icon">
                <i className="fas fa-desktop"></i>
              </div>
              <h3>Computação & Software</h3>
              <ul>
                <li>Workstation de alta performance</li>
                <li>DAWs profissionais (Logic, Pro Tools)</li>
                <li>Plugins e processadores premium</li>
                <li>Bibliotecas de samples e instrumentos virtuais</li>
              </ul>
            </div>

            <div className="equipment-category">
              <div className="equipment-icon">
                <i className="fas fa-headphones"></i>
              </div>
              <h3>Monitoramento</h3>
              <ul>
                <li>Monitores de estúdio de referência</li>
                <li>Fones de ouvido profissionais</li>
                <li>Sistema de distribuição de fones</li>
                <li>Tratamento acústico calibrado</li>
              </ul>
            </div>

            <div className="equipment-category">
              <div className="equipment-icon">
                <i className="fas fa-guitar"></i>
              </div>
              <h3>Instrumentos</h3>
              <ul>
                <li>Guitarras e baixos elétricos</li>
                <li>Violões acústicos</li>
                <li>Teclados e sintetizadores</li>
                <li>Amplificadores valvulados</li>
              </ul>
            </div>

            <div className="equipment-category">
              <div className="equipment-icon">
                <i className="fas fa-cog"></i>
              </div>
              <h3>Processamento</h3>
              <ul>
                <li>Compressores e limitadores</li>
                <li>Equalizadores paramétricos</li>
                <li>Processadores de efeitos</li>
                <li>Afinadores e processadores de pitch</li>
              </ul>
            </div>
          </div>

          <div className="equipment-image-showcase">
            <Image
              src="/estudio/equipamentos.jpg"
              alt="Equipamentos de produção musical"
              width={1200}
              height={600}
              className="equipment-showcase-img"
            />
          </div>
        </div>
      </section>

      {/* Serviços do Estúdio */}
      <section id="servicos-estudio" className="studio-services">
        <div className="container">
          <h2 className="section-title">Serviços</h2>
          <div className="title-underline"></div>
          <p className="section-subtitle">Soluções completas para sua produção musical</p>
          
          <div className="services-detailed">
            <div className="service-detailed-card">
              <div className="service-detailed-icon">
                <i className="fas fa-music"></i>
              </div>
              <h3>Produção Musical Completa</h3>
              <p>
                Desde o conceito inicial até a entrega final, cuidamos de todos os aspectos da sua produção. Criação de arranjos, programação de instrumentos, direção de gravação e desenvolvimento da identidade sonora do seu projeto.
              </p>
            </div>

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
                <i className="fas fa-waveform-path"></i>
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
            <div className="gallery-item">
              <Image
                src="/estudio/estudio-1.jpg"
                alt="Estúdio AG Music - Sala de gravação"
                width={400}
                height={300}
                className="gallery-img"
              />
            </div>
            <div className="gallery-item">
              <Image
                src="/estudio/estudio-2.jpg"
                alt="Estúdio AG Music - Sala de controle"
                width={400}
                height={300}
                className="gallery-img"
              />
            </div>
            <div className="gallery-item">
              <Image
                src="/estudio/estudio-3.jpg"
                alt="Estúdio AG Music - Equipamentos"
                width={400}
                height={300}
                className="gallery-img"
              />
            </div>
            <div className="gallery-item">
              <Image
                src="/estudio/console-1.jpg"
                alt="Estúdio AG Music - Console de mixagem"
                width={400}
                height={300}
                className="gallery-img"
              />
            </div>
            <div className="gallery-item">
              <Image
                src="/estudio/equipamentos.jpg"
                alt="Estúdio AG Music - Setup de produção"
                width={400}
                height={300}
                className="gallery-img"
              />
            </div>
            <div className="gallery-item">
              <Image
                src="/foto-performance.png"
                alt="Antônio Garcia - Performance"
                width={400}
                height={300}
                className="gallery-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="studio-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Pronto para Gravar sua Música?</h2>
            <p>Agende uma visita ao estúdio ou solicite um orçamento sem compromisso</p>
            <div className="cta-buttons">
              <a href="https://wa.me/5564993049853" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-large">
                <i className="fab fa-whatsapp"></i>
                Falar no WhatsApp
              </a>
              <Link href="/" className="btn btn-secondary btn-large">
                Voltar ao Início
              </Link>
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
                  src="/logo.jpeg"
                  alt="Antônio Garcia Logo"
                  fill
                  className="logo-img"
                  sizes="40px"
                />
              </div>
              <div> 
                <h3>Antônio Garcia</h3>
                <p>Produtor Musical</p>
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
            <p>&copy; 2025 Antônio Garcia. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
