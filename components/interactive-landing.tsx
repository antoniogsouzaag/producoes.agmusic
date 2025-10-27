
'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import AudioPlayer from './audio-player'
import MusicManager from './music-manager'
import Chatbot from './chatbot'

interface Music {
  id: number
  title: string
  artist: string
  url: string
  coverUrl?: string | null
  duration?: number | null
}

export default function InteractiveLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [musics, setMusics] = useState<Music[]>([])
  const [isLoadingMusics, setIsLoadingMusics] = useState(true)

  const loadMusics = async () => {
    setIsLoadingMusics(true)
    try {
      const response = await fetch('/api/music/list')
      const data = await response.json()
      setMusics(data.musics || [])
      
      // Show friendly error message if database is unavailable
      if (data.error && data.musics?.length === 0) {
        console.warn('Database temporarily unavailable:', data.error)
      }
    } catch (error) {
      console.error('Error loading musics:', error)
      setMusics([]) // Ensure empty array for fallback UI
    } finally {
      setIsLoadingMusics(false)
    }
  }

  useEffect(() => {
    loadMusics()
  }, [])

  useEffect(() => {
    // Debounced scroll handler for better performance
    let scrollTimeout: NodeJS.Timeout
    const handleScroll = () => {
      // Use RAF for smoother animations
      requestAnimationFrame(() => {
        setScrollY(window.scrollY)
      })
      
      // Debounce header updates
      if (scrollTimeout) clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
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
      }, 50)
    }

    // Optimized Intersection Observer with will-change
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement
          
          // Add will-change for GPU acceleration
          target.style.willChange = 'opacity, transform'
          target.style.opacity = '1'
          target.style.transform = 'translateY(0)'
          
          // Remove will-change after animation completes
          setTimeout(() => {
            target.style.willChange = 'auto'
          }, 800)
          
          // Animate counters when stats section is visible
          if (target.classList.contains('sobre-stats')) {
            const counters = target.querySelectorAll('.stat-number')
            counters.forEach(counter => {
              const targetValue = parseInt(counter.getAttribute('data-target') ?? '0')
              animateCounter(counter as HTMLElement, targetValue)
            })
          }
          
          // Unobserve after animation to save resources
          observer.unobserve(target)
        }
      })
    }, observerOptions)

    // Observe sections for animation
    const sections = document.querySelectorAll('section')
    sections.forEach(section => {
      const sectionElement = section as HTMLElement
      sectionElement.style.opacity = '0'
      sectionElement.style.transform = 'translateY(50px)'
      sectionElement.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
      observer.observe(section)
    })

    // Observe stats specifically
    const statsSection = document.querySelector('.sobre-stats')
    if (statsSection) {
      observer.observe(statsSection)
    }

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
      if (scrollTimeout) clearTimeout(scrollTimeout)
    }
  }, [])

  const animateCounter = (element: HTMLElement, target: number, duration = 2000) => {
    const startTime = performance.now()
    
    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smoother animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const currentValue = Math.floor(easeOutCubic * target)
      
      element.textContent = currentValue + '+'
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter)
      } else {
        element.textContent = target + '+'
      }
    }
    
    requestAnimationFrame(updateCounter)
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const formData = new FormData(e.currentTarget)
    const nome = formData.get('nome') as string
    const email = formData.get('email') as string
    const telefone = formData.get('telefone') as string
    const servico = formData.get('servico') as string
    const mensagem = formData.get('mensagem') as string
    
    // Criar mensagem para WhatsApp
    const whatsappMessage = `
*Nova Solicitação de Orçamento*

*Nome:* ${nome}
*Email:* ${email}
*Telefone:* ${telefone || 'Não informado'}
*Serviço:* ${servico}
*Mensagem:* ${mensagem}
    `.trim()
    
    const whatsappURL = `https://wa.me/5564993049853?text=${encodeURIComponent(whatsappMessage)}`
    
    // Abrir WhatsApp
    window.open(whatsappURL, '_blank')
    
    // Limpar formulário
    e.currentTarget.reset()
    
    // Feedback visual
    alert('Redirecionando para o WhatsApp...')
  }

  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId)
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY
      const offset = 80 // Header height offset
      
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
            <div className="logo">
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
            </div>
            <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
              <li><button onClick={() => scrollToElement('home')} className="nav-link">Início</button></li>
              <li><button onClick={() => scrollToElement('sobre')} className="nav-link">Sobre</button></li>
              <li><button onClick={() => scrollToElement('servicos')} className="nav-link">Serviços</button></li>
              <li><button onClick={() => scrollToElement('portfolio')} className="nav-link">Portfólio</button></li>
              <li><a href="/estudio" className="nav-link">Estúdio</a></li>
              <li><button onClick={() => scrollToElement('contato')} className="nav-link">Contato</button></li>
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
      <section id="home" className="hero">
        <div className="hero-container">
          {/* Left Side - Photo */}
          <div 
            className="hero-photo"
            style={{ 
              transform: `translateY(${scrollY * 0.3}px)`,
              opacity: Math.max(0, 1 - (scrollY / 700))
            }}
          >
            <div className="hero-photo-frame">
              <Image
                src="/foto-performance.png"
                alt="Antônio Garcia tocando violão"
                fill
                className="hero-photo-img"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div 
            className="hero-content"
            style={{ 
              transform: `translateY(${scrollY * 0.5}px)`,
              opacity: Math.max(0, 1 - (scrollY / 700))
            }}
          >
            <h1 className="hero-brand">AG Music</h1>
            <h2 className="hero-name">Antônio Garcia</h2>
            <p className="hero-subtitle">
              Transforme Sua Música em Sucesso Profissional | Produção Musical Completa para Artistas e Cantores
              <br /><br />
              Da pré-produção à masterização, cuidamos de cada detalhe para que sua música alcance o padrão profissional que ela merece. Com mais de 15 anos de experiência, oferecemos gravação, mixagem e produção completa em diversos estilos musicais.
              <br /><br />
              Seu som, sua identidade, seu sucesso - vamos criar juntos a música que vai marcar sua carreira.
            </p>
            <div className="hero-buttons">
              <button onClick={() => scrollToElement('contato')} className="btn btn-primary btn-compact">
                Solicitar Orçamento
              </button>
              <button onClick={() => scrollToElement('portfolio')} className="btn btn-secondary btn-compact">
                Ouvir Portfólio
              </button>
            </div>
            <div className="hero-social">
              <a href="https://www.instagram.com/antonio0_/" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.youtube.com/@AntonioGarcia-xx9sv" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <span></span>
        </div>
      </section>

      {/* Sobre Section */}
      <section id="sobre" className="sobre">
        <div className="container">
          <div className="sobre-content">
            <div className="sobre-image">
              <div className="sobre-image-frame">
                <Image
                  src="/foto_perfil.jpeg"
                  alt="Antônio Garcia"
                  fill
                  className="sobre-image-img"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                />
              </div>
            </div>
            <div className="sobre-text">
              <h2 id="titulo-sobre-mim" className="section-title">Sobre Mim</h2>
              <div className="title-underline"></div>
              <p>Olá! Sou <strong>Antônio Garcia</strong>, produtor musical e engenheiro de áudio apaixonado por criar experiências sonoras únicas.</p>
              <p>Atuo há <strong>mais de 15 anos como músico profissional</strong> com bandas, cantores e vários projetos musicais. Fiz a produção do <strong>DVD Unisamba carreira solo</strong>, além de produções independentes e gravações musicais de diversos artistas em variados estilos, como <strong>rock, pop, pagode, sertanejo</strong>, entre outros.</p>
              <p>Também atuo como <strong>professor de música há mais de 10 anos</strong>, com especialização em instrumentos de cordas, compartilhando minha paixão e conhecimento com novos músicos.</p>
              <p>Meu objetivo é transformar sua visão musical em realidade, com profissionalismo, criatividade e atenção aos detalhes.</p>
              <div className="sobre-stats">
                <div className="stat-item">
                  <span className="stat-number" data-target="15">0</span>
                  <span className="stat-label">Anos de Experiência</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number" data-target="50">0</span>
                  <span className="stat-label">Projetos</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number" data-target="10">0</span>
                  <span className="stat-label">Anos Ensinando</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços Section */}
      <section id="servicos" className="servicos">
        <div className="container">
          <h2 className="section-title">Serviços</h2>
          <div className="title-underline"></div>
          <p className="section-subtitle">Soluções completas para sua música</p>
          
          <div className="servicos-grid">
            <div className="servico-card">
              <div className="servico-icon">
                <i className="fas fa-music"></i>
              </div>
              <h3>Produção Musical</h3>
              <p>Criação completa de arranjos, programação de instrumentos e direção artística para seu projeto musical.</p>
            </div>

            <div className="servico-card">
              <div className="servico-icon">
                <i className="fas fa-microphone-alt"></i>
              </div>
              <h3>Gravação Profissional</h3>
              <p>Gravação de voz e instrumentos em estúdio com equipamentos de alta qualidade e acústica tratada.</p>
            </div>

            <div className="servico-card">
              <div className="servico-icon">
                <i className="fas fa-sliders-h"></i>
              </div>
              <h3>Mixagem & Masterização</h3>
              <p>Balanceamento profissional e finalização da sua música para streaming, rádio e outras plataformas.</p>
            </div>

            <div className="servico-card">
              <div className="servico-icon">
                <i className="fas fa-cut"></i>
              </div>
              <h3>Edição & Pós-Produção</h3>
              <p>Edição precisa de áudio, correção de timing, afinação e limpeza de ruídos indesejados.</p>
            </div>

            <div className="servico-card">
              <div className="servico-icon">
                <i className="fas fa-guitar"></i>
              </div>
              <h3>Gravação de Instrumentos</h3>
              <p>Sessões com músicos profissionais para complementar seu projeto com performances de alta qualidade.</p>
            </div>

            <div className="servico-card">
              <div className="servico-icon">
                <i className="fas fa-chalkboard-teacher"></i>
              </div>
              <h3>Consultoria Musical</h3>
              <p>Orientação completa sobre produção, desde a pré-produção até estratégias de lançamento.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gêneros Section */}
      <section className="generos">
        <div className="container">
          <h2 className="section-title">Gêneros Musicais</h2>
          <div className="title-underline"></div>
          <div className="generos-list">
            <span className="genero-tag">Sertanejo</span>
            <span className="genero-tag">Rock</span>
            <span className="genero-tag">Pagode</span>
            <span className="genero-tag">MPB</span>
            <span className="genero-tag">Samba</span>
            <span className="genero-tag">Pop</span>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="portfolio">
        <div className="container">
          <h2 className="section-title">Portfólio</h2>
          <div className="title-underline"></div>
          <p className="section-subtitle">Confira alguns dos meus trabalhos</p>
          
          <div className="portfolio-content">
            <div className="admin-controls">
              <MusicManager onUploadSuccess={loadMusics} />
            </div>

            {isLoadingMusics ? (
              <div className="portfolio-player">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Carregando músicas...</p>
              </div>
            ) : (
              <AudioPlayer musics={musics} onRefresh={loadMusics} />
            )}
            
            <div className="portfolio-links" style={{ marginTop: '2rem' }}>
              <a href="https://www.youtube.com/@AntonioGarcia-xx9sv" target="_blank" rel="noopener noreferrer" className="portfolio-link">
                <i className="fab fa-youtube"></i>
                <span>Visite meu canal no YouTube</span>
              </a>
              <a href="https://www.instagram.com/antonio0_/" target="_blank" rel="noopener noreferrer" className="portfolio-link">
                <i className="fab fa-instagram"></i>
                <span>Veja mais no Instagram</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contato Section */}
      <section id="contato" className="contato">
        <div className="container">
          <h2 className="section-title">Entre em Contato</h2>
          <div className="title-underline"></div>
          <p className="section-subtitle">Vamos criar algo incrível juntos!</p>
          
          <div className="contato-content">
            <div className="contato-info">
              <div className="contato-item">
                <div className="contato-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <h3>Email</h3>
                  <a href="mailto:agmusicproduçoes@gmail.com">agmusicproduçoes@gmail.com</a>
                </div>
              </div>

              <div className="contato-item">
                <div className="contato-icon">
                  <i className="fab fa-whatsapp"></i>
                </div>
                <div>
                  <h3>WhatsApp</h3>
                  <a href="https://wa.me/5564993049853" target="_blank" rel="noopener noreferrer">(64) 99304-9853</a>
                </div>
              </div>

              <div className="contato-item">
                <div className="contato-icon">
                  <i className="fas fa-calendar"></i>
                </div>
                <div>
                  <h3>Agendar Sessão</h3>
                  <p>Entre em contato para agendar</p>
                </div>
              </div>
            </div>

            <div className="contato-form">
              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <input type="text" name="nome" placeholder="Seu Nome" required />
                </div>
                <div className="form-group">
                  <input type="email" name="email" placeholder="Seu Email" required />
                </div>
                <div className="form-group">
                  <input type="tel" name="telefone" placeholder="Seu Telefone" />
                </div>
                <div className="form-group">
                  <select name="servico" required>
                    <option value="">Selecione o serviço</option>
                    <option value="producao">Produção Musical</option>
                    <option value="gravacao">Gravação de Instrumentos</option>
                    <option value="edicao">Edição</option>
                    <option value="mixagem">Mixagem</option>
                    <option value="masterizacao">Masterização</option>
                    <option value="completo">Pacote Completo</option>
                  </select>
                </div>
                <div className="form-group">
                  <textarea name="mensagem" rows={5} placeholder="Conte mais sobre seu projeto..." required></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-full">Enviar Mensagem</button>
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
  
  {/* O container da Imagem (Primeiro item do Flexbox) */}
  <div className="relative w-10 h-10">
    <Image
      src="/logo.jpeg"
      alt="Antônio Garcia Logo"
      fill
      className="logo-img"
      sizes="40px"
    />
  </div>
  
  {/* O container do Texto (Segundo item do Flexbox) */}
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

      {/* Chatbot */}
      <Chatbot />
    </>
  )
}
